import { SExprAST, SExprNode } from '../types/sexpr';

export function parseSExpr(input: string): SExprAST {
  const tokens = tokenize(input);
  let cursor = 0;

  function parseNode(): SExprAST {
    const token = tokens[cursor++];
    if (token === '(') {
      const tag = tokens[cursor++];
      const props: Record<string, any> = {};
      const children: (SExprNode | any)[] = [];

      while (cursor < tokens.length && tokens[cursor] !== ')') {
        const current = tokens[cursor];
        if (typeof current === 'string' && current.startsWith(':')) {
          const key = current.slice(1);
          cursor++;
          props[key] = parseNode();
        } else {
          children.push(parseNode());
        }
      }
      cursor++; // consume ')'
      return { tag, props, children };
    }

    // Primitive conversions
    if (token === 'true') return true;
    if (token === 'false') return false;
    if (token === 'nil' || token === 'null') return null;
    if (!isNaN(Number(token))) return Number(token);
    if (token.startsWith('"') && token.endsWith('"')) return token.slice(1, -1);
    return token;
  }

  function tokenize(str: string): string[] {
    const regex = /\s*([()[\]]|"[^"]*"|[^\s()[\]]+)/g;
    const tokens: string[] = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      if (match[1].length > 0) tokens.push(match[1]);
    }
    return tokens;
  }

  return parseNode();
}