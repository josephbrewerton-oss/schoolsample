import { SExprAST } from '../types/sexpr';
/**
 * Strips Lisp-style comments (; or ;;) that occur outside of quoted strings.
 */
export declare function stripSExprComments(str: string): string;
export declare function parseSExpr(input: string): SExprAST;
/**
 * Tokenizes an S-Expression string into individual atomic tokens, delimiters, and quoted literals.
 * Implemented as a strictly linear O(n) character scanner without backtracking regular expressions
 * to guarantee complete immunity against Polynomial/Exponential ReDoS attacks (CodeQL: js/polynomial-redos).
 * Handles escaped quotes within strings cleanly.
 */
export declare function tokenize(str: string): string[];
export interface ParsedAstNode {
    route: string;
    calc?: string;
    prompt: string;
    options: string[];
    answerKey: number;
}
/**
 * Robust S-Expression AST question extractor.
 * Replaces legacy brittle regular expression matchers (:prompt, :options regexes).
 * Uses recursive tokenizer and parser to safely parse:
 * - Escaped double-quotes inside prompt/options
 * - Nested parentheses and lists
 * - Multi-line strings
 * - S-expression comments (; or ;;)
 * - Shorthand keywords (:q, :opts, :choices, :answer, etc.)
 */
export declare function parseAstNode(input: string | SExprAST): ParsedAstNode;
export declare class AstParser {
    /**
     * Parses S-Expression into ParsedAstNode using robust recursive tokenizer.
     * Replaces legacy regex matchers.
     */
    static parse(sExpr: string): ParsedAstNode;
}
