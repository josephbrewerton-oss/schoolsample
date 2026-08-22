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

export interface ParsedAstNode {
  route: string;
  calc?: string;
  prompt: string;
  options: string[];
  answerKey: number;
}

export interface EngineExecutionResult {
  output: string;
  source: "chrome-builtin-nano" | "webgpu-webllm" | "daemon-channel";
  ast?: ParsedAstNode;
  correctionsCount: number;
}

export class AstParser {
  static parse(sExpr: string): ParsedAstNode {
    const routeMatch = sExpr.match(/:route\\s+"([^"]+)"/);
    const calcMatch = sExpr.match(/:calc\\s+"([^"]+)"/);
    const promptMatch = sExpr.match(/:prompt\\s+"([^"]+)"/);
    const answerKeyMatch = sExpr.match(/:answer-key\\s+(\\d+)/);
    const optionsMatch = sExpr.match(/:options\\s+\\((?:list\\s+)?([\\s\\S]*?)\\)(?:\\s*\\)|\\s*:)/);

    if (!promptMatch) throw new Error("Invalid AST: Missing :prompt token");

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

  async infer(prompt: string, systemPrompt?: string): Promise<{ output: string; source: EngineExecutionResult["source"] }> {
    if (this.hasChromeAI) {
      try {
        const session = await (window as any).ai.languageModel.create({
          systemPrompt: systemPrompt || "Generate deterministic S-expressions for educational practice.",
        });
        const result = await session.prompt(prompt);
        if (session.destroy) session.destroy();
        return { output: result, source: "chrome-builtin-nano" };
      } catch (e) {
        console.warn("Chrome AI invocation failed, trying WebGPU fallback:", e);
      }
    }

    if (this.webllmEngine) {
      const reply = await this.webllmEngine.chat.completions.create({
        messages: [
          ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
          { role: "user" as const, content: prompt },
        ],
      });
      return { output: reply.choices[0].message.content || "", source: "webgpu-webllm" };
    }

    throw new Error("No client-side hardware inference backend available.");
  }

  async executeAstWithSelfCorrection(
    prompt: string,
    systemPrompt: string,
    maxRetries = 2
  ): Promise<EngineExecutionResult> {
    let attempts = 0;
    let currentPrompt = prompt;

    while (attempts <= maxRetries) {
      const { output, source } = await this.infer(currentPrompt, systemPrompt);
      try {
        const ast = AstParser.parse(output);
        return { output, source, ast, correctionsCount: attempts };
      } catch (err: any) {
        attempts++;
        currentPrompt = \`\${prompt}\\nRepair S-Expression syntax error: \${err.message}\\nOutput valid S-expression only.\`;
      }
    }

    throw new Error(\`AST self-correction failed after \${maxRetries} feedback iterations.\`);
  }
}
`;

const componentCode = `import React, { useState, useEffect, useRef } from "react";
import { EdgeCognitiveEngine, EngineExecutionResult } from "../engine/EdgeCognitiveEngine";

export default function InteractiveEdgeSandbox() {
  const [status, setStatus] = useState<string>("Initializing edge runtime...");
  const [prompt, setPrompt] = useState<string>("Generate a practice question for GCSE Physics: Kinetic Energy formula");
  const [result, setResult] = useState<EngineExecutionResult | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const engineRef = useRef<EdgeCognitiveEngine | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const engine = new EdgeCognitiveEngine();
    engine.init((report) => setStatus(report.text)).then(() => {
      engineRef.current = engine;
      setStatus("Edge runtime ready (100% Client-Side AST Engine)");
    });
  }, []);

  const handleRun = async () => {
    if (!engineRef.current) return;
    setRunning(true);
    try {
      const systemPrompt = \`Output format: (:route "quiz:mcq" :calc "<math>" :prompt "<question>" :options (list "<ans>" "<dist1>" "<dist2>" "<dist3>") :answer-key 0)\`;
      const res = await engineRef.current.executeAstWithSelfCorrection(prompt, systemPrompt);
      setResult(res);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{ border: "1px solid #333", borderRadius: 8, padding: 16, margin: "20px 0", background: "#18181b" }}>
      <h4 style={{ margin: "0 0 8px 0", color: "#60a5fa" }}>⚡ Neuro-Symbolic Edge AST Sandbox</h4>
      <p style={{ fontSize: "0.85rem", color: "#a1a1aa", margin: "0 0 12px 0" }}>Status: {status}</p>
      
      <textarea
        rows={3}
        style={{ width: "100%", padding: 8, borderRadius: 4, background: "#09090b", color: "#fafafa", border: "1px solid #27272a" }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleRun}
        disabled={running}
        style={{ marginTop: 10, padding: "8px 16px", cursor: running ? "not-allowed" : "pointer", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, fontWeight: "bold" }}
      >
        {running ? "Compiling AST..." : "Run Edge Inference"}
      </button>

      {result && (
        <div style={{ marginTop: 16, padding: 12, background: "#09090b", borderRadius: 4, border: "1px solid #27272a" }}>
          <div><strong>Execution Tier:</strong> {result.source}</div>
          <div><strong>Self-Correction Cycles:</strong> {result.correctionsCount}</div>
          {result.ast && (
            <div style={{ marginTop: 8 }}>
              <strong>Parsed AST Prompt:</strong> {result.ast.prompt}
              <ul style={{ margin: "6px 0" }}>
                {result.ast.options.map((opt, i) => (
                  <li key={i} style={{ color: i === result.ast?.answerKey ? "#4ade80" : "#d4d4d8" }}>
                    {opt} {i === result.ast?.answerKey ? "(Correct)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <pre style={{ marginTop: 8, fontSize: "0.8rem", color: "#93c5fd" }}>{result.output}</pre>
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
execSync('npm run deploy', { stdio: 'inherit', cwd: rootDir, env: { ...process.env, GIT_USER: process.env.GIT_USER || "josephbrewerton-oss" } });

console.log('✅ Edge engine written and production bundle deployed successfully.');