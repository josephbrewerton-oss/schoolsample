import { BackendTier, EngineExecutionResult, EngineOptions, UnifiedAstUnit } from "../types";
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

    // 2. Offline Deterministic Rule Fallback (Harmonized across multi-dialect prompt context)
    const lower = `${prompt} ${systemPrompt || ''}`.toLowerCase();
    if (lower.includes('scene') || lower.includes('simulation') || lower.includes('vector')) {
      return {
        text: '(:scene :id "offline-sim" :title "Offline Simulation" :stage "KS3" :duration 10.0 (:keyframes ((:t 0.0 :title "Initial State" :rule "Baseline condition") (:t 1.0 :title "Final State" :rule "System equilibrium"))) (:bindings ((:target "#obj" :attr "transform" :expr "\'translate(\' + (t * 100) + \', 0)\'"))))',
        source: "rule-engine"
      };
    }
    if (lower.includes('lesson')) {
      return {
        text: '(:lesson :id "offline-lesson" :title "Offline Lesson" :stage "KS2" :subject "General" (:questions ((:route "quiz:mcq" :prompt "Foundational curriculum check?" :options ("True" "False") :answer-key 0))))',
        source: "rule-engine"
      };
    }
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
        currentPrompt = `${prompt}\nRepair S-Expression syntax error: ${err.message}\nEnsure proper AST formatting.`;
      }
    }

    throw new Error("AST generation failed validation after retry attempts.");
  }
}
