export type ASTNode = {
  tag: string;
  props: Record<string, any>;
  children: (ASTNode | string | number)[];
};

/**
 * Tokenizes raw S-expression strings into symbols, keywords, strings, and parenthesis.
 */
function tokenize(input: string): string[] {
  // Strip comments (;; ...) and descriptive LLM image placeholders
  const sanitized = input
    .replace(/;;.*$/gm, '')
    .replace(/<image[^>]*>/gi, '')
    .replace(/\[image[^\]]*\]/gi, '');

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
 * Recursively parses token stream into an AST node tree or structured literal list.
 */
export function parseAST(source: string): ASTNode | null {
  const tokens = tokenize(source);
  let cursor = 0;

  function parseList(): any {
    if (tokens[cursor] !== '(') return null;
    cursor++; // consume '('

    const firstToken = tokens[cursor];

    // If it starts with a keyword or list token, parse as a list / kwargs container
    if (firstToken && firstToken.startsWith(':')) {
      const props: Record<string, any> = {};
      while (cursor < tokens.length && tokens[cursor] !== ')') {
        const keyToken = tokens[cursor++];
        if (keyToken.startsWith(':')) {
          const key = keyToken.slice(1);
          if (tokens[cursor] === '(') {
            props[key] = parseList();
          } else {
            const val = tokens[cursor++];
            props[key] = val && val.startsWith('"') ? JSON.parse(val) : val;
          }
        }
      }
      if (tokens[cursor] === ')') cursor++;
      return props;
    }

    const tag = tokens[cursor++];
    const node: ASTNode = { tag, props: {}, children: [] };

    while (cursor < tokens.length && tokens[cursor] !== ')') {
      const current = tokens[cursor];

      if (current.startsWith(':')) {
        const key = current.slice(1);
        cursor++;
        if (tokens[cursor] === '(') {
          node.props[key] = parseList();
        } else {
          const valToken = tokens[cursor++];
          node.props[key] = valToken && valToken.startsWith('"') ? JSON.parse(valToken) : valToken;
        }
      } else if (current === '(') {
        node.children.push(parseList());
      } else {
        cursor++;
        node.children.push(current.startsWith('"') ? JSON.parse(current) : current);
      }
    }

    if (tokens[cursor] === ')') cursor++;
    return node;
  }

  return parseList();
}