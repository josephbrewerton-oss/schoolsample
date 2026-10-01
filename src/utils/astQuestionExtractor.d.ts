export interface ExtractedQuestion {
    prompt: string;
    options: string[];
    answerKey: number;
    scratchpad?: string;
    hint?: string;
    misconceptions?: string[];
    socraticFollowUp?: string;
}
/**
 * Auto-heals truncated or malformed S-expression strings:
 * balances quotes and closing parentheses.
 */
export declare function healSExprString(raw: string): string;
export declare function extractQuestionFromAst(rawLisp: string): ExtractedQuestion | null;
