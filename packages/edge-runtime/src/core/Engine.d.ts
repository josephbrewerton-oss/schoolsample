import { BackendTier, EngineExecutionResult, EngineOptions } from "../types";
export declare class EdgeCognitiveEngine {
    private channel;
    constructor(options?: EngineOptions);
    infer(prompt: string, systemPrompt?: string): Promise<{
        text: string;
        source: BackendTier;
    }>;
    executeAstWithRepair(prompt: string, systemPrompt: string, maxRetries?: number): Promise<EngineExecutionResult>;
}
