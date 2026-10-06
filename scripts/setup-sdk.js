const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const sdkDir = path.join(rootDir, 'packages', 'edge-runtime');
const srcDir = path.join(sdkDir, 'src');
const coreDir = path.join(srcDir, 'core');
const typesDir = path.join(srcDir, 'types');

// 1. Create directories
[sdkDir, srcDir, coreDir, typesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 2. Package.json
const packageJson = {
  name: "@school-ai/edge-runtime",
  version: "1.1.0",
  description: "Client-side edge inference, WebRTC daemon transport, and S-expression AST verification SDK",
  main: "./dist/index.js",
  module: "./dist/index.mjs",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.mjs",
      require: "./dist/index.js"
    }
  },
  files: ["dist"],
  scripts: {
    build: "tsup",
    dev: "tsup --watch"
  },
  peerDependencies: {},
  devDependencies: {
    tsup: "^8.5.1",
    typescript: "^5.4.0"
  },
  license: "MIT"
};

// 3. Tsconfig
const tsconfig = {
  compilerOptions: {
    target: "ES2022",
    module: "ESNext",
    moduleResolution: "bundler",
    declaration: true,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    outDir: "./dist"
  },
  include: ["src/**/*"]
};

// 4. Tsup Config
const tsupConfig = `import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
  external: []
});
`;

// 5. Types (src/types/index.ts)
const typesCode = `export type BackendTier = "chrome-nano" | "webrtc-daemon" | "rule-engine";

export interface ParsedAstNode {
  route: string;
  calc?: string;
  prompt: string;
  options: string[];
  answerKey: number;
  answer?: number;
  hint?: string;
  explanation?: string;
}

export type UnifiedAstUnit = ParsedAstNode | any;

export interface EngineExecutionResult {
  output: string;
  source: BackendTier;
  ast?: UnifiedAstUnit;
  correctionsCount: number;
}

export interface EngineOptions {
  model?: string;
  channelName?: string;
}
`;

// 6. AST Parser & Validator (src/core/AstCompiler.ts)
const astCompilerCode = `import { 
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

    // 1. Detect Vector Scene Dialect
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

    // 2. Detect Curriculum Lesson Unit Dialect
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

  static validate(node: any): boolean {
    if (!node || typeof node !== 'object') return false;

    // Dialect 1: Question / Checkpoint
    if (isAstQuestion(node) || (node.prompt && Array.isArray(node.options))) {
      const effectiveKey = typeof node.answerKey === 'number'
        ? node.answerKey
        : (typeof node.answer === 'number' ? node.answer : -1);
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
    if (isAstScene(node) || (node.id && typeof node.duration === 'number' && node.duration > 0 && (Array.isArray(node.keyframes) || Array.isArray(node.bindings)))) {
      return Boolean(
        node.id &&
        typeof node.duration === 'number' &&
        node.duration > 0 &&
        (Array.isArray(node.keyframes) || Array.isArray(node.bindings))
      );
    }

    // Dialect 3: Curriculum Lesson Unit
    if (isAstLesson(node) || (node.id && node.stage && (Array.isArray(node.questions) || Array.isArray(node.interactiveScenes)))) {
      return Boolean(
        node.id &&
        node.stage &&
        (Array.isArray(node.questions) || Array.isArray(node.interactiveScenes))
      );
    }

    return false;
  }
}
`;

// 7. Core Engine (src/core/Engine.ts)
const engineCode = `import { BackendTier, EngineExecutionResult, EngineOptions } from "../types";
import { AstCompiler } from "./AstCompiler";

export class EdgeCognitiveEngine {
  private channel: BroadcastChannel | null = null;

  constructor(options?: EngineOptions) {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.channel = new BroadcastChannel(options?.channelName || "schoolai-bus");
    }
  }

  async infer(prompt: string, systemPrompt?: string): Promise<{ text: string; source: BackendTier }> {
    // 1. Built-in Gemini Nano / Prompt API
    if (typeof window !== "undefined" && (window as any).ai?.languageModel) {
      try {
        const capabilities = await (window as any).ai.languageModel.capabilities?.();
        if (!capabilities || capabilities.available !== "no") {
          const session = await (window as any).ai.languageModel.create({
            systemPrompt: systemPrompt || "You are an educational AST generator."
          });
          const result = await session.prompt(prompt);
          if (session.destroy) session.destroy();
          return { text: result, source: "chrome-nano" };
        }
      } catch (e) {
        console.warn("Chrome AI invocation failed:", e);
      }
    }

    // 2. Offline Deterministic Rule Fallback
    return {
      text: '(:prompt "Offline Rule Question" :options ("True" "False") :answer-key 0)',
      source: "rule-engine"
    };
  }

  async executeAstWithRepair(prompt: string, systemPrompt: string, maxRetries = 2): Promise<EngineExecutionResult> {
    let attempts = 0;
    let currentPrompt = prompt;

    while (attempts <= maxRetries) {
      const { text, source } = await this.infer(currentPrompt, systemPrompt);
      try {
        const ast = AstCompiler.parse(text);
        if (AstCompiler.validate(ast)) {
          return { output: text, source, ast, correctionsCount: attempts };
        }
      } catch (err: any) {
        attempts++;
        currentPrompt = \`\${prompt}\\nRepair S-Expression syntax error: \${err.message}\\nEnsure proper AST formatting.\`;
      }
    }

    throw new Error("AST generation failed validation after retry attempts.");
  }
}
`;

// 8. Main Entry (src/index.ts)
const indexCode = `export { EdgeCognitiveEngine } from "./core/Engine";
export { AstCompiler, parseAstNode, tokenize, parseSExpr, stripSExprComments } from "./core/AstCompiler";
export * from "./types";
`;

// 9. Write Files & Compile
console.log('Scaffolding SDK in packages/edge-runtime...');
fs.writeFileSync(path.join(sdkDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
fs.writeFileSync(path.join(sdkDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf8');
fs.writeFileSync(path.join(sdkDir, 'tsup.config.ts'), tsupConfig, 'utf8');
fs.writeFileSync(path.join(typesDir, 'index.ts'), typesCode, 'utf8');
fs.writeFileSync(path.join(coreDir, 'AstCompiler.ts'), astCompilerCode, 'utf8');
fs.writeFileSync(path.join(coreDir, 'Engine.ts'), engineCode, 'utf8');
fs.writeFileSync(path.join(srcDir, 'index.ts'), indexCode, 'utf8');

console.log('Installing dependencies and building SDK...');
execSync('npm install --save-dev tsup', { stdio: 'inherit', cwd: sdkDir });
execSync('npm run build', { stdio: 'inherit', cwd: sdkDir });

console.log('✅ Edge-Runtime SDK updated with S-Expression AST verification at packages/edge-runtime/dist');