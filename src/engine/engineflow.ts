// src/engine/engineflow.ts
import { ASTNode, parseAST, resolveTopicAST } from './ast-loader';
import { ASTFlowGovernor, GovernedQuestion, RawASTQuestion } from './astGovernor';
import { PromptASTPreParser } from './promptAstparser';
import { runLocalInference } from './EdgeCognitiveEngine';
import { OakStage, OakSubject, OakTopic } from '../curriculum/oakCatalogue';

export interface GenerationRequest {
  subject: string;
  topic: string;
  keyStage: string;
  curriculum?: 'uk_oak' | 'international';
  isQuiz?: boolean;
}

export interface LessonViewContent {
  title: string;
  axiom: string;
  trap: string;
  hook: string;
  guidedStep: string;
  socraticCheck: string;
}

export interface EngineResult {
  raw: string;
  governed: GovernedQuestion | null;
  ast: ASTNode | null;
  fromCache: boolean;
}

export class EngineFlow {
  /**
   * 1. PRACTICE LAB ROUTE: Token Optimization -> Prompt API -> AST Governance
   */
  public static async synthesizeGovernedQuestion(
    req: GenerationRequest
  ): Promise<GovernedQuestion> {
    const topicKey = `${req.keyStage}_${req.subject}_${req.topic}`.toLowerCase();

    // 1. Build token-dense prompt for multiple-choice quiz format
    const prompt = PromptASTPreParser.parseForInference({
      subject: req.subject,
      topic: req.topic,
      keyStage: req.keyStage,
      curriculum: req.curriculum || 'uk_oak',
    });

    // 2. Execute on-device Gemini Nano inference
    const rawContent = await runLocalInference(prompt, undefined, topicKey);

    // 3. Parse AST tokens into structured node
    const parsedNode = parseAST(rawContent);
    const normalized = this.normalizeASTToQuestion(parsedNode);

    if (!normalized) {
      return {
        isValid: false,
        sanitizedQuestion: null,
        rejectionReason: 'Failed to normalize AST node structure',
      };
    }

    // 4. Govern, verify arithmetic, and validate topic boundary
    return ASTFlowGovernor.govern(normalized, req.subject, req.topic);
  }

  // Alias for semantic clarity
  public static generatePracticeQuestion = EngineFlow.synthesizeGovernedQuestion;

  /**
   * 2. LEARNING ZONE ROUTE: Pedagogical Lesson Card Generation
   */
  public static async generateLessonCards(req: {
    keyStage: string;
    subject: string;
    topic: string;
    curriculum?: string;
  }): Promise<LessonViewContent> {
    const topicKey = `${req.keyStage}_${req.subject}_${req.topic}`.toLowerCase();

    const systemPrompt = `You are an expert UK Oak National Curriculum author. Generate a concise, age-appropriate lesson structure for ${req.keyStage} ${req.subject}: "${req.topic}".
Format strictly as an S-expression:
(:route "lesson:view"
 :axiom "<Core foundational rule or concept definition under 25 words>"
 :trap "<Common student misconception or pitfall to avoid under 25 words>"
 :hook "<Engaging real-world or inquiry opening question>"
 :guided "<Step-by-step worked example or activity guidance>"
 :socratic "<Socratic check question to verify understanding>")`;

    const prompt = `Synthesize structured lesson cards for ${req.keyStage} ${req.subject}: "${req.topic}". Output only a valid Lisp S-expression.`;

    const raw = await runLocalInference(prompt, systemPrompt, topicKey);
    const parsed = parseAST(raw);

    return {
      title: req.topic,
      axiom: this.extractProp(parsed, 'axiom') || `Key foundational rule for ${req.topic} in ${req.subject}.`,
      trap: this.extractProp(parsed, 'trap') || `Commonly confusing misconceptions in ${req.topic}.`,
      hook: this.extractProp(parsed, 'hook') || `How does ${req.topic} apply in real-world contexts?`,
      guidedStep: this.extractProp(parsed, 'guided') || `Analyze the structure and principles of ${req.topic} step-by-step.`,
      socraticCheck: this.extractProp(parsed, 'socratic') || `What is the core rule behind ${req.topic}?`,
    };
  }

  /**
   * 3. Resolves and caches full lesson modules from VFS or On-Device generation
   */
  public static async resolveLessonView(
    stage: OakStage,
    subject: OakSubject,
    topic: OakTopic
  ): Promise<{ raw: string; ast: ASTNode | null }> {
    return resolveTopicAST(stage, subject, topic);
  }

  /**
   * 4. Normalizes parsed AST node objects to standard question schema
   */
  public static normalizeASTToQuestion(parsed: any): RawASTQuestion & { hint?: string } | null {
    if (!parsed) return null;

    let options: string[] = [];
    if (Array.isArray(parsed.options)) {
      options = parsed.options.map((o: any) =>
        typeof o === 'object' ? o.children?.[0] || '' : String(o)
      );
    } else if (parsed.options?.children && Array.isArray(parsed.options.children)) {
      options = parsed.options.children.map((c: any) =>
        typeof c === 'object' ? c.children?.[0] || '' : String(c)
      );
    }

    const prompt =
      typeof parsed.prompt === 'object'
        ? parsed.prompt?.children?.[0] || ''
        : String(parsed.prompt || '');
    const scratchpad =
      typeof parsed.scratchpad === 'object'
        ? parsed.scratchpad?.children?.[0] || ''
        : String(parsed.scratchpad || '');
    const hint =
      typeof parsed.hint === 'object'
        ? parsed.hint?.children?.[0] || ''
        : String(parsed.hint || '');
    const answerKey = Number(parsed['answer-key'] ?? parsed.answerKey ?? 0);

    return {
      route: parsed.route || 'quiz:mcq',
      prompt: prompt.trim(),
      scratchpad: scratchpad.trim(),
      hint: hint.trim(),
      options: options.filter(Boolean),
      answerKey: isNaN(answerKey) ? 0 : answerKey,
    };
  }

  /**
   * 5. Helper for direct AST string parsing
   */
  public static parse(source: string): ASTNode | null {
    return parseAST(source);
  }

  private static extractProp(parsed: any, key: string): string {
    if (!parsed) return '';
    const val = parsed[key];
    if (typeof val === 'object') return val?.children?.[0] || '';
    return typeof val === 'string' ? val.trim() : '';
  }
}