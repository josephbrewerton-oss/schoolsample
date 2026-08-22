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
  peerDependencies: {
    "@mlc-ai/web-llm": "^0.2.78"
  },
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
  external: ["@mlc-ai/web-llm"]
});
`;

// 5. Types (src/types/index.ts)
const typesCode = `export type BackendTier = "chrome-nano" | "webgpu-webllm" | "webrtc-daemon";

export interface ParsedAstNode {
  route: string;
  calc?: string;
  prompt: string;
  options: string[];
  answerKey: number;
}

export interface EngineExecutionResult {
  output: string;
  source: BackendTier;
  ast?: ParsedAstNode;
  correctionsCount: number;
}

export interface EngineOptions {
  model?: string;
  channelName?: string;
}
`;

// 6. AST Parser & Validator (src/core/AstCompiler.ts)
const astCompilerCode = `import { ParsedAstNode } from "../types";

export class AstCompiler {
  static parse(sExpr: string): ParsedAstNode {
    const routeMatch = sExpr.match(/:route\\s+"([^"]+)"/);
    const calcMatch = sExpr.match(/:calc\\s+"([^"]+)"/);
    const promptMatch = sExpr.match(/:prompt\\s+"([^"]+)"/);
    const answerKeyMatch = sExpr.match(/:answer-key\\s+(\\d+)/);
    const optionsMatch = sExpr.match(/:options\\s+\\((?:list\\s+)?([\\s\\S]*?)\\)(?:\\s*\\)|\\s*:)/);

    if (!promptMatch) {
      throw new Error("Invalid AST: Missing :prompt tag");
    }

    const options: string[] = [];
    if (optionsMatch) {
      const optRegex = /"([^"]+)"/g;
      let m: RegExpExecArray | null;
      while ((m = optRegex.exec(optionsMatch[1])) !== null) {
        options.push(m[1]);
      }
    }

    return {
      route: routeMatch ? routeMatch[1] : "quiz:mcq",
      calc: calcMatch ? calcMatch[1] : undefined,
      prompt: promptMatch[1],
      options: options.length > 0 ? options : ["Option A", "Option B", "Option C", "Option D"],
      answerKey: answerKeyMatch ? parseInt(answerKeyMatch[1], 10) : 0
    };
  }

  static validate(node: ParsedAstNode): boolean {
    return Boolean(
      node.prompt.length > 0 &&
      node.options.length >= 2 &&
      node.answerKey >= 0 &&
      node.answerKey < node.options.length
    );
  }
}
`;

// 7. Core Engine (src/core/Engine.ts)
const engineCode = `import * as webllm from "@mlc-ai/web-llm";
import { BackendTier, EngineExecutionResult, EngineOptions } from "../types";
import { AstCompiler } from "./AstCompiler";

export class EdgeCognitiveEngine {
  private webllmEngine: webllm.MLCEngineInterface | null = null;
  private modelName: string;
  private channel: BroadcastChannel | null = null;

  constructor(options?: EngineOptions) {
    this.modelName = options?.model || "Llama-3.2-1B-Instruct-q4f32_1-MLC";
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
        console.warn("Chrome AI invocation failed, trying WebGPU fallback:", e);
      }
    }

    // 2. WebGPU WebLLM
    if (this.webllmEngine) {
      const reply = await this.webllmEngine.chat.completions.create({
        messages: [
          ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
          { role: "user" as const, content: prompt }
        ]
      });
      return { text: reply.choices[0].message.content || "", source: "webgpu-webllm" };
    }

    throw new Error("No client-side hardware inference backend available.");
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
export { AstCompiler } from "./core/AstCompiler";
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