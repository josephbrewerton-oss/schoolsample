import { 
  ParsedAstNode, 
  UnifiedAstUnit, 
  AstQuestionNode, 
  AstSceneNode, 
  AstLessonNode,
  isAstQuestion, 
  isAstScene, 
  isAstLesson 
} from "../types";
import { parseAstNode, tokenize, parseSExpr, stripSExprComments } from "../../../../src/utils/sexprParser";

export { tokenize, parseSExpr, stripSExprComments, parseAstNode };

export class AstCompiler {
  /**
   * Parses S-Expression into a UnifiedAstUnit (Question/Checkpoint, Vector Scene, or Lesson) or legacy ParsedAstNode.
   * Harmonizes dialect differences across :answer-key vs :answer, :prompt vs :q, and multi-dialect ASTs.
   */
  static parse(sExpr: string): any {
    if (!sExpr || typeof sExpr !== 'string') {
      throw new Error('Invalid AST: Input must be a non-empty string');
    }

    const decommented = stripSExprComments(sExpr).trim();
    if (!decommented) {
      throw new Error('Invalid AST: Empty S-expression');
    }

    const rawAst = parseSExpr(decommented);
    if (!rawAst) {
      throw new Error('Invalid AST: Failed to parse S-expression');
    }

    // Helper to extract key-value pairs from array or object node
    function extractPropsAndLists(node: any) {
      const props: Record<string, any> = {};
      const lists: any[] = [];
      if (Array.isArray(node)) {
        let start = 0;
        if (typeof node[0] === 'string' && !node[0].startsWith(':')) {
          props._tag = node[0];
          start = 1;
        } else if (typeof node[0] === 'string' && node[0].startsWith(':')) {
          if (node.length > 1 && typeof node[1] === 'string' && node[1].startsWith(':')) {
            props._tag = node[0].slice(1);
            start = 1;
          }
        }
        for (let i = start; i < node.length; i++) {
          const item = node[i];
          if (typeof item === 'string' && item.startsWith(':')) {
            const key = item.slice(1);
            const val = i + 1 < node.length ? node[i + 1] : true;
            props[key] = val;
            i++;
          } else if (Array.isArray(item)) {
            lists.push(item);
          }
        }
      } else if (node && typeof node === 'object') {
        props._tag = node.tag;
        Object.assign(props, node.props || {});
        if (Array.isArray(node.children)) {
          for (const child of node.children) {
            if (Array.isArray(child)) lists.push(child);
          }
        }
      }
      return { props, lists };
    }

    const { props, lists } = extractPropsAndLists(rawAst);
    const tag = (props._tag || '').toLowerCase();

    // 1. Detect Vector Scene Dialect (:scene or scene, or presence of duration/keyframes/bindings)
    if (tag === 'scene' || props.duration !== undefined || props.keyframes !== undefined || props.bindings !== undefined) {
      const id = String(props.id || 'scene-' + Date.now());
      const title = String(props.title || id);
      const stage = String(props.stage || 'CURRICULUM');
      const duration = typeof props.duration === 'number' ? props.duration : (parseFloat(String(props.duration)) || 10.0);

      const keyframes: AstKeyframeNode[] = [];
      const bindings: AstBindingNode[] = [];
      const subtitles: AstSubtitleNode[] = [];
      const checkpoints: AstQuestionNode[] = [];

      for (const list of lists) {
        if (Array.isArray(list) && list.length > 0) {
          const listHeader = typeof list[0] === 'string' ? list[0].replace(/^:/, '') : '';
          const items = Array.isArray(list[1]) ? list[1] : list.slice(1);

          if (listHeader === 'keyframes') {
            for (const kf of items) {
              const { props: kfProps } = extractPropsAndLists(kf);
              if (kfProps.t !== undefined) {
                keyframes.push({
                  t: Number(kfProps.t),
                  title: String(kfProps.title || ''),
                  rule: String(kfProps.rule || ''),
                  cam: kfProps.cam,
                  narration: kfProps.narration,
                  notes: kfProps.notes
                });
              }
            }
          } else if (listHeader === 'bindings') {
            for (const b of items) {
              const { props: bProps } = extractPropsAndLists(b);
              if (bProps.target) {
                bindings.push({
                  target: String(bProps.target),
                  attr: bProps.attr ? String(bProps.attr) : undefined,
                  expr: bProps.expr ? String(bProps.expr) : undefined,
                  ...bProps
                });
              }
            }
          } else if (listHeader === 'subtitles') {
            for (const sub of items) {
              const { props: subProps } = extractPropsAndLists(sub);
              if (subProps.start !== undefined && subProps.end !== undefined) {
                subtitles.push({
                  start: Number(subProps.start),
                  end: Number(subProps.end),
                  en: String(subProps.en || ''),
                  ...subProps
                });
              }
            }
          } else if (listHeader === 'interactive' || listHeader === 'checkpoints') {
            for (const cp of items) {
              const { props: cpProps } = extractPropsAndLists(cp);
              const rawPrompt = cpProps.prompt || cpProps.q || cpProps.question;
              if (rawPrompt) {
                const options = Array.isArray(cpProps.options) ? cpProps.options : ['True', 'False'];
                const ans = typeof cpProps.answer === 'number' 
                  ? cpProps.answer 
                  : (typeof cpProps['answer-key'] === 'number' ? cpProps['answer-key'] : 0);
                checkpoints.push({
                  prompt: String(rawPrompt),
                  options: options.map(String),
                  answerKey: ans,
                  answer: ans,
                  explanation: cpProps.explanation ? String(cpProps.explanation) : undefined,
                  t: cpProps.t !== undefined ? Number(cpProps.t) : undefined
                });
              }
            }
          }
        }
      }

      const sceneNode: AstSceneNode = {
        id,
        title,
        stage,
        duration,
        keyframes: keyframes.length > 0 ? keyframes : undefined,
        bindings: bindings.length > 0 ? bindings : undefined,
        subtitles: subtitles.length > 0 ? subtitles : undefined,
        checkpoints: checkpoints.length > 0 ? checkpoints : undefined,
        astSource: sExpr
      };
      return sceneNode;
    }

    // 2. Detect Curriculum Lesson Unit Dialect (:lesson or lesson)
    if (tag === 'lesson') {
      const id = String(props.id || 'lesson-' + Date.now());
      const title = String(props.title || id);
      const stage = String(props.stage || 'KS2');
      const subject = String(props.subject || 'General');
      const lessonNode: AstLessonNode = {
        id,
        title,
        stage,
        subject,
        summary: props.summary ? String(props.summary) : undefined,
        questions: [],
        interactiveScenes: []
      };
      return lessonNode;
    }

    // 3. Fallback to Question Dialect (with full harmonization)
    const question = parseAstNode(decommented);
    if (typeof (question as any).answer === 'number' && question.answerKey === undefined) {
      question.answerKey = (question as any).answer;
    }
    return question;
  }

  /**
   * Validates any of the unified AST dialects (Question/Checkpoint, Vector Scene, or Lesson).
   */
  static validate(node: any): boolean {
    if (!node || typeof node !== 'object') return false;

    // Dialect 1: Question / Checkpoint
    if (isAstQuestion(node) || (node.prompt && Array.isArray(node.options))) {
      const effectiveKey = typeof node.answerKey === 'number' 
        ? node.answerKey 
        : (typeof (node as any).answer === 'number' ? (node as any).answer : -1);
      return Boolean(
        typeof node.prompt === 'string' &&
        node.prompt.trim().length > 0 &&
        Array.isArray(node.options) &&
        node.options.length >= 2 &&
        effectiveKey >= 0 &&
        effectiveKey < node.options.length
      );
    }

    // Dialect 2: Vector Scene / Simulation
    if (isAstScene(node)) {
      return Boolean(
        node.id &&
        typeof node.duration === 'number' &&
        node.duration > 0 &&
        (Array.isArray(node.keyframes) || Array.isArray(node.bindings))
      );
    }

    // Dialect 3: Curriculum Lesson Unit
    if (isAstLesson(node)) {
      return Boolean(
        node.id &&
        node.stage &&
        (Array.isArray(node.questions) || Array.isArray(node.interactiveScenes))
      );
    }

    return false;
  }
}
