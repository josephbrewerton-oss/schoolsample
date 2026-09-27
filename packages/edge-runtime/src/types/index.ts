export type BackendTier = "chrome-nano" | "webrtc-daemon" | "rule-engine";

export interface ParsedAstNode {
  route: string;
  calc?: string;
  prompt: string;
  options: string[];
  answerKey: number;
}

export interface EngineExecutionResult {
  output: string;
  source: BackendTier;
  ast?: ParsedAstNode;
  correctionsCount: number;
}

export interface EngineOptions {
  model?: string;
  channelName?: string;
}
