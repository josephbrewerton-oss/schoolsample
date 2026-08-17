import * as webllm from "@mlc-ai/web-llm";

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
        "Generate strictly executable code or expressions wrapped in ```eval ... ``` blocks. Do not include conversational filler."
      );

      const match = generatedCode.match(/```(?:eval|javascript|lisp)?\s*([\s\S]*?)\s*```/);
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
      currentPrompt = `The previous output generated a runtime error:\n${trace.error}\nCode:\n${codeToEval}\nPlease fix the logic and regenerate the code correctly.`;
    }

    throw new Error(`Self-correction failed after ${maxRetries} feedback iterations.`);
  }
}
