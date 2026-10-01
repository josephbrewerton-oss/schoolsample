import { AstCompiler } from "./AstCompiler";
export class EdgeCognitiveEngine {
    channel = null;
    constructor(options) {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
            this.channel = new BroadcastChannel(options?.channelName || "schoolai-bus");
        }
    }
    async infer(prompt, systemPrompt) {
        // 1. Built-in Gemini Nano / Prompt API
        if (typeof window !== "undefined" && window.ai?.languageModel) {
            try {
                const capabilities = await window.ai.languageModel.capabilities?.();
                if (!capabilities || capabilities.available !== "no") {
                    const session = await window.ai.languageModel.create({
                        systemPrompt: systemPrompt || "You are an educational AST generator."
                    });
                    const result = await session.prompt(prompt);
                    if (session.destroy)
                        session.destroy();
                    return { text: result, source: "chrome-nano" };
                }
            }
            catch (e) {
                console.warn("Chrome AI invocation failed:", e);
            }
        }
        // 2. Offline Deterministic Rule Fallback
        return {
            text: '(:prompt "Offline Rule Question" :options ("True" "False") :answer-key 0)',
            source: "rule-engine"
        };
    }
    async executeAstWithRepair(prompt, systemPrompt, maxRetries = 2) {
        let attempts = 0;
        let currentPrompt = prompt;
        while (attempts <= maxRetries) {
            const { text, source } = await this.infer(currentPrompt, systemPrompt);
            try {
                const ast = AstCompiler.parse(text);
                if (AstCompiler.validate(ast)) {
                    return { output: text, source, ast, correctionsCount: attempts };
                }
            }
            catch (err) {
                attempts++;
                currentPrompt = `${prompt}\nRepair S-Expression syntax error: ${err.message}\nEnsure proper AST formatting.`;
            }
        }
        throw new Error("AST generation failed validation after retry attempts.");
    }
}
