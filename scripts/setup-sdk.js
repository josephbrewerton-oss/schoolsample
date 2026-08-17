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

// 2. Define package.json
const packageJson = {
  name: "@school-ai/edge-runtime",
  version: "1.0.0",
  description: "Client-side neuro-symbolic inference and deterministic verification SDK",
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
// 3. Define tsconfig.json
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

// 4. Define tsup.config.ts
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

// 5. Define Types (src/types/index.ts)
const typesCode = `import type * as webllm from "@mlc-ai/web-llm";

export type TierBackend = "chrome-builtin-nano" | "webgpu-webllm" | "symbolic-evaluator";

export interface EngineExecutionResult {
  output: string;
  source: TierBackend;
  executionTrace?: any;
  correctionsCount: number;
}

export interface EngineOptions {
  model?: string;
  autoFallback?: boolean;
}

export interface EvaluationResult {
  success: boolean;
  result?: any;
  error?: string;
}

export type EvaluatorFunction = (code: string) => EvaluationResult;
`;

// 6. Define Sandbox Evaluator (src/core/Sandbox.ts)
const sandboxCode = `import { EvaluationResult } from "../types";

export class SandboxedEvaluator {
  static evaluate(code: string): EvaluationResult {
    try {
      const sanitized = code.replace(/console\\.log/g, "return ");
      const evalResult = new Function(sanitized)();
      return { success: true, result: evalResult };
    } catch (err: any) {
      return { success: false, error: err.message || String(err) };
    }
  }
}
`;

// 7. Define Core Engine (src/core/Engine.ts)
const engineCode = `import * as webllm from "@mlc-ai/web-llm";
import { EngineExecutionResult, EngineOptions, EvaluatorFunction } from "../types";

export class EdgeCognitiveEngine {
  private webllmEngine: webllm.MLCEngineInterface | null = null;
  private hasWebGPU: boolean = false;
  private hasChromeAI: boolean = false;
  private modelName: string;

  constructor(options?: EngineOptions) {
    this.modelName = options?.model || "Llama-3.2-1B-Instruct-q4f32_1-MLC";
  }

  async init(onProgress?: (report: webllm.InitProgressReport) => void): Promise<void> {
    this.hasWebGPU = typeof navigator !== "undefined" && "gpu" in navigator;
    this.hasChromeAI = typeof window !== "undefined" && "ai" in window && "languageModel" in (window as any).ai;

    if (this.hasWebGPU && !this.webllmEngine) {
      try {
        this.webllmEngine = await webllm.CreateMLCEngine(this.modelName, {
          initProgressCallback: onProgress,
        });
      } catch (err) {
        console.warn("WebLLM initialization deferred or failed:", err);
      }
    }
  }

  async infer(prompt: string, systemPrompt?: string): Promise<string> {
    if (this.hasChromeAI) {
      try {
        const session = await (window as any).ai.languageModel.create({
          systemPrompt: systemPrompt || "You are an accurate, deterministic educational assistant.",
        });
        const result = await session.prompt(prompt);
        session.destroy();
        return result;
      } catch (e) {
        console.warn("Chrome AI invocation failed, falling back to WebGPU:", e);
      }
    }

    if (this.webllmEngine) {
      const reply = await this.webllmEngine.chat.completions.create({
        messages: [
          ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
          { role: "user" as const, content: prompt },
        ],
      });
      return reply.choices[0].message.content || "";
    }

    throw new Error("No client-side hardware inference backend available on this device.");
  }

  async executeWithSelfCorrection(
    prompt: string,
    evaluatorFn: EvaluatorFunction,
    maxRetries: number = 3
  ): Promise<EngineExecutionResult> {
    let attempts = 0;
    let currentPrompt = prompt;

    while (attempts < maxRetries) {
      const generatedCode = await this.infer(
        currentPrompt,
        "Generate strictly executable JavaScript wrapped in \`\`\`eval ... \`\`\` blocks. Do not include conversational filler."
      );

      const match = generatedCode.match(/\`\`\`(?:eval|javascript|js)?\\s*([\\s\\S]*?)\\s*\`\`\`/);
      const codeToEval = match ? match[1] : generatedCode;

      const trace = evaluatorFn(codeToEval);

      if (trace.success) {
        return {
          output: codeToEval,
          source: this.hasChromeAI ? "chrome-builtin-nano" : "webgpu-webllm",
          executionTrace: trace.result,
          correctionsCount: attempts,
        };
      }

      attempts++;
      currentPrompt = \`The previous output failed verification:\\nError: \${trace.error}\\nCode:\\n\${codeToEval}\\nPlease repair the logic and output only the corrected code block.\`;
    }

    throw new Error(\`Self-correction failed after \${maxRetries} feedback iterations.\`);
  }
}
`;

// 8. Define Main Entry (src/index.ts)
const indexCode = `export { EdgeCognitiveEngine } from "./core/Engine";
export { SandboxedEvaluator } from "./core/Sandbox";
export * from "./types";
`;

// 9. Write Files
console.log('Scaffolding SDK in packages/edge-runtime...');
fs.writeFileSync(path.join(sdkDir, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
fs.writeFileSync(path.join(sdkDir, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2), 'utf8');
fs.writeFileSync(path.join(sdkDir, 'tsup.config.ts'), tsupConfig, 'utf8');
fs.writeFileSync(path.join(typesDir, 'index.ts'), typesCode, 'utf8');
fs.writeFileSync(path.join(coreDir, 'Sandbox.ts'), sandboxCode, 'utf8');
fs.writeFileSync(path.join(coreDir, 'Engine.ts'), engineCode, 'utf8');
fs.writeFileSync(path.join(srcDir, 'index.ts'), indexCode, 'utf8');

console.log('Installing SDK bundler dependencies...');
execSync('npm install --save-dev tsup', { stdio: 'inherit', cwd: sdkDir });

console.log('Building SDK distribution files...');
execSync('npm run build', { stdio: 'inherit', cwd: sdkDir });

console.log('✅ SDK successfully created and compiled at: packages/edge-runtime/dist');