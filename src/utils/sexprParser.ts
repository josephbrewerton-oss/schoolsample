import { SExprAST, SExprNode } from '../types/sexpr';
import { healSExprString } from './astQuestionExtractor';

/**
 * Strips Lisp-style comments (; or ;;) that occur outside of quoted strings.
 */
export function stripSExprComments(str: string): string {
  if (!str || typeof str !== 'string') return '';
  let result = '';
  let inQuote = false;
  let escapeNext = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (escapeNext) {
      result += ch;
      escapeNext = false;
      continue;
    }
    if (ch === '\\') {
      result += ch;
      escapeNext = true;
      continue;
    }
    if (ch === '"') {
      inQuote = !inQuote;
      result += ch;
      continue;
    }
    if (!inQuote && ch === ';') {
      while (i < str.length && str[i] !== '\n' && str[i] !== '\r') {
        i++;
      }
      result += '\n';
      continue;
    }
    result += ch;
  }
  return result;
}

export function parseSExpr(input: string): SExprAST {
  if (!input || typeof input !== 'string') return null;
  const decommented = stripSExprComments(input);
  const healed = healSExprString(decommented);
  const tokens = tokenize(healed);
  let cursor = 0;

  function parseNode(): SExprAST {
    if (cursor >= tokens.length) return null;
    const token = tokens[cursor++];
    if (token === '(' || token === '[') {
      const closeDelim = token === '(' ? ')' : ']';

      // Empty list: () or []
      if (cursor < tokens.length && tokens[cursor] === closeDelim) {
        cursor++;
        return [];
      }

      // Lookahead: check if next token is a nested expression, a keyword argument, or an array of items
      const next = tokens[cursor];
      if (
        next === '(' ||
        next === '[' ||
        (typeof next === 'string' && (next.startsWith(':') || next.startsWith('"') || !isNaN(Number(next))))
      ) {
        const items: any[] = [];
        while (cursor < tokens.length && tokens[cursor] !== closeDelim) {
          items.push(parseNode());
        }
        if (tokens[cursor] === closeDelim) cursor++; // consume closing delimiter
        return items;
      }

      const tag = cursor < tokens.length ? tokens[cursor++] : 'node';
      const props: Record<string, any> = {};
      const children: (SExprNode | any)[] = [];

      while (cursor < tokens.length && tokens[cursor] !== closeDelim) {
        const current = tokens[cursor];
        if (typeof current === 'string' && current.startsWith(':')) {
          const key = current.slice(1);
          cursor++;
          props[key] = parseNode();
        } else {
          children.push(parseNode());
        }
      }
      if (tokens[cursor] === closeDelim) cursor++; // consume closing delimiter
      return { tag, props, children };
    }

    // Primitive conversions
    if (token === 'true') return true;
    if (token === 'false') return false;
    if (token === 'nil' || token === 'null') return null;
    if (!isNaN(Number(token))) return Number(token);
    if (token && token.startsWith('"') && token.endsWith('"')) {
      return token.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    return token;
  }

  function tokenize(str: string): string[] {
    const regex = /\s*([()[\]]|"(?:[^"\\]|\\.)*"|[^\s()[\]]+)/g;
    const tokens: string[] = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      if (match[1].length > 0) tokens.push(match[1]);
    }
    return tokens;
  }

  return parseNode();
}