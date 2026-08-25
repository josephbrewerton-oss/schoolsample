// src/engine/ast-loader.ts
import { getVfsView, saveVfsView } from '../services/dbStore';
import { OakStage, OakSubject, OakTopic } from '../curriculum/oakCatalogue';
import { runLocalInference } from './EdgeCognitiveEngine';

export type ASTNode = {
  tag: string;
  props: Record<string, any>;
  children: (ASTNode | string | number)[];
};

/**
 * Tokenizes raw S-expression strings into symbols, keywords, strings, and parenthesis.
 */
function tokenize(input: string): string[] {
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

/**
 * Resolves a curriculum topic AST: checks IndexedDB VFS first,
 * falling back to local on-device inference.
 */
export async function resolveTopicAST(
  stage: OakStage,
  subject: OakSubject,
  topic: OakTopic
): Promise<{ raw: string; ast: ASTNode | null }> {
  const vfsPath = `/sys/curriculum/${stage.id}/${subject.id}/${topic.id}.lisp`;

  const cachedLisp = await getVfsView(vfsPath);
  if (cachedLisp) {
    return {
      raw: cachedLisp,
      ast: parseAST(cachedLisp),
    };
  }

  const systemPrompt = `You are a deterministic S-expression generator. Output ONLY a valid Lisp AST formatted as (view ...) containing (stepper ...) and (quiz ...). Do not include markdown formatting or commentary.`;

  const prompt = `Create an interactive lesson for UK ${stage.title}, Subject: ${subject.title}, Topic: "${topic.title}".
Format strictly:
(view
  (header :level 2 "${topic.title}")
  (stepper
    (step (text "Core concept explanation here..."))
    (step (text "Worked example explanation here...")))
  (quiz :id "${topic.id}-q1"
    (question (text "Practice question prompt?"))
    (option :correct #t (text "Correct option"))
    (option (text "Distractor 1"))
    (option (text "Distractor 2"))
    (option (text "Distractor 3"))
    (explanation (text "Diagnostic rationale."))))`;

  const rawResult = await runLocalInference(prompt, systemPrompt);

  const cleanLisp = rawResult
    .replace(/```(?:lisp|scheme)?/gi, '')
    .replace(/```/g, '')
    .trim();

  await saveVfsView(vfsPath, cleanLisp);

  return {
    raw: cleanLisp,
    ast: parseAST(cleanLisp),
  };
}