import type * as webllm from "@mlc-ai/web-llm";

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
