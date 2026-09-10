import * as webllm from '@mlc-ai/web-llm';

type TierBackend = "chrome-builtin-nano" | "webgpu-webllm" | "symbolic-evaluator";
interface EngineExecutionResult {
    output: string;
    source: TierBackend;
    executionTrace?: any;
    correctionsCount: number;
}
interface EngineOptions {
    model?: string;
    autoFallback?: boolean;
}
interface EvaluationResult {
    success: boolean;
    result?: any;
    error?: string;
}
type EvaluatorFunction = (code: string) => EvaluationResult;

declare class EdgeCognitiveEngine {
    private webllmEngine;
    private hasWebGPU;
    private hasChromeAI;
    private modelName;
    constructor(options?: EngineOptions);
    init(onProgress?: (report: webllm.InitProgressReport) => void): Promise<void>;
    infer(prompt: string, systemPrompt?: string): Promise<string>;
    executeWithSelfCorrection(prompt: string, evaluatorFn: EvaluatorFunction, maxRetries?: number): Promise<EngineExecutionResult>;
}

declare class SandboxedEvaluator {
    static evaluate(code: string): EvaluationResult;
}

export { EdgeCognitiveEngine, type EngineExecutionResult, type EngineOptions, type EvaluationResult, type EvaluatorFunction, SandboxedEvaluator, type TierBackend };
