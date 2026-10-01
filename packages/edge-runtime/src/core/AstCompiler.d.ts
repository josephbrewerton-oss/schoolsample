import { ParsedAstNode } from "../types";
import { parseAstNode, tokenize, parseSExpr, stripSExprComments } from "../../../../src/utils/sexprParser";
export { tokenize, parseSExpr, stripSExprComments, parseAstNode };
export declare class AstCompiler {
    /**
     * Parses S-Expression into ParsedAstNode using robust recursive tokenizer from src/utils/sexprParser.ts.
     * Legacy brittle regex matchers are deprecated.
     */
    static parse(sExpr: string): ParsedAstNode;
    static validate(node: ParsedAstNode): boolean;
}
