import { CreateMLCEngine, MLCEngine } from "@mlc-ai/web-llm";

export type ModelProvider = "gemini-nano" | "llama-3.2-1b" | "llama-3.2-3b" | "gemma-2-2b" | "phi-3.5";

export const AVAILABLE_MODELS = [
  { id: "gemini-nano", name: "Chrome Built-in AI (Gemini Nano)", size: "Pre-installed (0 MB download)" },
  { id: "Llama-3.2-1B-Instruct-q4f16_1-MLC", key: "llama-3.2-1b", name: "Llama 3.2 1B Instruct", size: "~850 MB" },
  { id: "Llama-3.2-3B-Instruct-q4f16_1-MLC", key: "llama-3.2-3b", name: "Llama 3.2 3B Instruct", size: "~2.2 GB" },
  { id: "gemma-2-2b-it-q4f16_1-MLC", key: "gemma-2-2b", name: "Gemma 2 2B Instruct", size: "~1.4 GB" },
  { id: "Phi-3.5-mini-instruct-q4f16_1-MLC", key: "phi-3.5", name: "Phi-3.5 Mini Instruct", size: "~2.1 GB" },
];

let activeEngine: MLCEngine | null = null;

export async function loadModel(
  modelId: string, 
  onProgress?: (progressText: string, percentage: number) => void
) {
  if (modelId === "gemini-nano") return true;

  activeEngine = await CreateMLCEngine(modelId, {
    initProgressCallback: (report) => {
      const match = report.text.match(/\[(\d+)\/(\d+)\]/);
      let pct = 0;
      if (match) {
        pct = Math.round((parseInt(match[1], 10) / parseInt(match[2], 10)) * 100);
      }
      onProgress?.(report.text, pct);
    }
  });

  return true;
}

export async function queryAI(prompt: string, selectedModel: string): Promise<string> {
  // Option A: Gemini Nano
  if (selectedModel === "gemini-nano") {
    if ("ai" in window && (window as any).ai?.languageModel) {
      const session = await (window as any).ai.languageModel.create();
      return await session.prompt(prompt);
    }
    throw new Error("Chrome Built-in AI (Nano) not enabled in this browser.");
  }

  // Option B: In-Browser WebGPU Open Weights
  if (!activeEngine) {
    throw new Error("Selected model is not initialized. Please load it in Settings.");
  }

  const reply = await activeEngine.chat.completions.create({
    messages: [{ role: "user", content: prompt }]
  });

  return reply.choices[0]?.message?.content || "No response generated.";
}