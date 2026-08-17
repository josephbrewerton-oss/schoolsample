import { EvaluationResult } from "../types";

export class SandboxedEvaluator {
  static evaluate(code: string): EvaluationResult {
    try {
      const sanitized = code.replace(/console\.log/g, "return ");
      const evalResult = new Function(sanitized)();
      return { success: true, result: evalResult };
    } catch (err: any) {
      return { success: false, error: err.message || String(err) };
    }
  }
}
