export type ASTNode = {
  tag: string;
  props: Record<string, any>;
  children: (ASTNode | string | number)[];
};

/**
 * Tokenizes raw S-expression strings into symbols, keywords, strings, and parenthesis.
 */
function tokenize(input: string): string[] {
  // Strip comments (;; ...)
  const sanitized = input.replace(/;;.*$/gm, '');
  const tokens: string[] = [];
  const regex = /\s*([()"]|:[a-zA-Z0-9_-]+|[^\s()":]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sanitized)) !== null) {
    if (match[1] === '"') {
      let str = '';
      let escaped = false;
      while (regex.lastIndex < sanitized.length) {
        const char = sanitized[regex.lastIndex++];
        if (char === '\\' && !escaped) {
          escaped = true;
          continue;
        }
        if (char === '"' && !escaped) break;
        str += char;
        escaped = false;
      }
      tokens.push(JSON.stringify(str));
    } else {
      tokens.push(match[1]);
    }
  }
  return tokens;
}

/**
 * Recursively parses token stream into an AST node tree.
 */
export function parseAST(source: string): ASTNode | null {
  const tokens = tokenize(source);
  let cursor = 0;

  function parseExpression(): any {
    const token = tokens[cursor++];
    if (token !== '(') return null;

    const tag = tokens[cursor++];
    const node: ASTNode = { tag, props: {}, children: [] };

    while (cursor < tokens.length && tokens[cursor] !== ')') {
      const current = tokens[cursor];

      if (current.startsWith(':')) {
        const key = current.slice(1);
        cursor++;
        const valToken = tokens[cursor];
        if (valToken === '(') {
          node.props[key] = parseExpression();
        } else {
          cursor++;
          node.props[key] = valToken.startsWith('"') ? JSON.parse(valToken) : valToken;
        }
      } else if (current === '(') {
        node.children.push(parseExpression());
      } else {
        cursor++;
        node.children.push(current.startsWith('"') ? JSON.parse(current) : current);
      }
    }

    if (tokens[cursor] === ')') cursor++;
    return node;
  }

  return parseExpression();
}