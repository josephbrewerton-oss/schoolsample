const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');

// 1. Ensure required directories exist
const engineDir = path.join(rootDir, 'src', 'engine');
const componentsDir = path.join(rootDir, 'src', 'components');
fs.mkdirSync(engineDir, { recursive: true });
fs.mkdirSync(componentsDir, { recursive: true });

// 2. Define File Contents
const engineCode = `import * as webllm from "@mlc-ai/web-llm";

export interface EngineExecutionResult {
  output: string;
  source: "chrome-builtin-nano" | "webgpu-webllm" | "symbolic-evaluator";
  executionTrace?: any;
  correctionsCount: number;
}

export class EdgeCognitiveEngine {
  private webllmEngine: webllm.MLCEngineInterface | null = null;
  private hasWebGPU: boolean = false;
  private hasChromeAI: boolean = false;

  async init(onProgress?: (report: webllm.InitProgressReport) => void): Promise<void> {
    this.hasWebGPU = typeof navigator !== "undefined" && "gpu" in navigator;
    this.hasChromeAI = typeof window !== "undefined" && "ai" in window && "languageModel" in (window as any).ai;

    if (this.hasWebGPU && !this.webllmEngine) {
      try {
        this.webllmEngine = await webllm.CreateMLCEngine("Llama-3.2-1B-Instruct-q4f32_1-MLC", {
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
    evaluatorFn: (code: string) => { success: boolean; result?: any; error?: string },
    maxRetries: number = 3
  ): Promise<EngineExecutionResult> {
    let attempts = 0;
    let currentPrompt = prompt;

    while (attempts < maxRetries) {
      const generatedCode = await this.infer(
        currentPrompt,
        "Generate strictly executable code or expressions wrapped in \`\`\`eval ... \`\`\` blocks. Do not include conversational filler."
      );

      const match = generatedCode.match(/\`\`\`(?:eval|javascript|lisp)?\\s*([\\s\\S]*?)\\s*\`\`\`/);
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
      currentPrompt = \`The previous output generated a runtime error:\\n\${trace.error}\\nCode:\\n\${codeToEval}\\nPlease fix the logic and regenerate the code correctly.\`;
    }

    throw new Error(\`Self-correction failed after \${maxRetries} feedback iterations.\`);
  }
}
`;

const componentCode = `import React, { useState, useEffect, useRef } from "react";
import { EdgeCognitiveEngine, EngineExecutionResult } from "../engine/EdgeCognitiveEngine";

export default function InteractiveEdgeSandbox() {
  const [status, setStatus] = useState<string>("Initializing edge runtime...");
  const [prompt, setPrompt] = useState<string>("Calculate the kinetic energy of a 2kg mass moving at 5m/s (KE = 0.5 * m * v^2)");
  const [result, setResult] = useState<EngineExecutionResult | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const engineRef = useRef<EdgeCognitiveEngine | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const engine = new EdgeCognitiveEngine();
    engine.init((report) => setStatus(report.text)).then(() => {
      engineRef.current = engine;
      setStatus("Edge runtime ready (100% Client-Side)");
    });
  }, []);

  const handleRun = async () => {
    if (!engineRef.current) return;
    setRunning(true);
    try {
      const res = await engineRef.current.executeWithSelfCorrection(
        prompt,
        (code) => {
          try {
            const sanitized = code.replace(/console\\.log/g, "return ");
            const evalResult = new Function(sanitized)();
            return { success: true, result: evalResult };
          } catch (err: any) {
            return { success: false, error: err.message };
          }
        }
      );
      setResult(res);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ border: "1px solid #444", borderRadius: 8, padding: 16, margin: "20px 0" }}>
      <h4>⚡ Neuro-Symbolic Edge Runtime</h4>
      <p style={{ fontSize: "0.85rem", color: "#888" }}>Status: {status}</p>
      
      <textarea
        rows={3}
        style={{ width: "100%", padding: 8, borderRadius: 4, background: "#1e1e1e", color: "#fff" }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleRun}
        disabled={running}
        style={{ marginTop: 10, padding: "8px 16px", cursor: "pointer", background: "#25c2a0", border: "none", borderRadius: 4, fontWeight: "bold" }}
      >
        {running ? "Synthesizing & Verifying..." : "Run Client-Side Loop"}
      </button>

      {result && (
        <div style={{ marginTop: 16, padding: 12, background: "#111", borderRadius: 4 }}>
          <div><strong>Execution Tier:</strong> {result.source}</div>
          <div><strong>Self-Correction Cycles:</strong> {result.correctionsCount}</div>
          <div><strong>Evaluated Output:</strong> {JSON.stringify(result.executionTrace)}</div>
          <pre style={{ marginTop: 8 }}>{result.output}</pre>
        </div>
      )}
    </div>
  );
}
`;

// 3. Write Source Files
console.log('Writing EdgeCognitiveEngine.ts...');
fs.writeFileSync(path.join(engineDir, 'EdgeCognitiveEngine.ts'), engineCode, 'utf8');

console.log('Writing InteractiveEdgeSandbox.tsx...');
fs.writeFileSync(path.join(componentsDir, 'InteractiveEdgeSandbox.tsx'), componentCode, 'utf8');

// 4. Build and Deploy
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

console.log('Deploying to GitHub Pages...');
execSync('npm run deploy', { stdio: 'inherit', cwd: rootDir });

console.log('✅ Deployment script complete.');