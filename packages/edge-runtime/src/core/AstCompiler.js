import { parseAstNode, tokenize, parseSExpr, stripSExprComments } from "../../../../src/utils/sexprParser";
export { tokenize, parseSExpr, stripSExprComments, parseAstNode };
export class AstCompiler {
    /**
     * Parses S-Expression into ParsedAstNode using robust recursive tokenizer from src/utils/sexprParser.ts.
     * Legacy brittle regex matchers are deprecated.
     */
    static parse(sExpr) {
        return parseAstNode(sExpr);
    }
    static validate(node) {
        return Boolean(node &&
            node.prompt &&
            node.prompt.length > 0 &&
            Array.isArray(node.options) &&
            node.options.length >= 2 &&
            node.answerKey >= 0 &&
            node.answerKey < node.options.length);
    }
}
