// src/engine/ast-loader.ts
import { 
  getVfsView, 
  saveVfsView, 
  getRandomCachedAST, 
  saveVerifiedAST 
} from '../services/dbStore';
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
// In src/engine/ast-loader.ts -> tokenize()
function tokenize(input: string): string[] {
  const sanitized = input
    .replace(/```(?:lisp|scheme)?/gi, '')
    .replace(/```/g, '')
    .replace(/;;.*$/gm, '')
    .trim();

  const tokens: string[] = [];
  let i = 0;

  while (i < sanitized.length) {
    const char = sanitized[i];

    // 1. Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }

    // 2. Consume full quoted strings (preserve all inner parentheses/symbols)
    if (char === '"') {
      let str = '';
      i++; // skip opening quote
      while (i < sanitized.length) {
        if (sanitized[i] === '\\' && i + 1 < sanitized.length) {
          str += sanitized[i + 1];
          i += 2;
          continue;
        }
        if (sanitized[i] === '"') {
          i++; // skip closing quote
          break;
        }
        str += sanitized[i];
        i++;
      }
      tokens.push(JSON.stringify(str));
      continue;
    }

    // 3. Structural delimiters
    if (char === '(' || char === ')') {
      tokens.push(char);
      i++;
      continue;
    }

    // 4. Atoms, keywords, and identifiers
    let atom = '';
    while (i < sanitized.length && !/\s|[()"]/.test(sanitized[i])) {
      atom += sanitized[i];
      i++;
    }
    if (atom) tokens.push(atom);
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
 * Resolves a curriculum topic AST: checks VFS view -> AST Bank -> Gemini Nano inference.
 */
export async function resolveTopicAST(
  stage: OakStage,
  subject: OakSubject,
  topic: OakTopic
): Promise<{ raw: string; ast: ASTNode | null }> {
  const topicKey = `${subject.id}_${topic.id}`.toLowerCase();
  const vfsPath = `/sys/curriculum/${stage.id}/${subject.id}/${topic.id}.lisp`;

  // 1. Level 1 Cache: Check VFS store
  const cachedLisp = await getVfsView(vfsPath);
  if (cachedLisp) {
    return {
      raw: cachedLisp,
      ast: parseAST(cachedLisp),
    };
  }

  // 2. Level 2 Cache: Check verified synthetic AST bank
  const cachedAST = await getRandomCachedAST(topicKey);
  if (cachedAST) {
    await saveVfsView(vfsPath, cachedAST);
    return {
      raw: cachedAST,
      ast: parseAST(cachedAST),
    };
  }

  // 3. Fallback to grounded On-Device Inference
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

  // Pass topicKey to allow dynamic adapter grounding
  const rawResult = await runLocalInference(prompt, systemPrompt, topicKey);

  const cleanLisp = rawResult
    .replace(/```(?:lisp|scheme)?/gi, '')
    .replace(/```/g, '')
    .trim();

  // Persist to both VFS and verified AST bank
  await saveVfsView(vfsPath, cleanLisp);
  await saveVerifiedAST(topicKey, cleanLisp);

  return {
    raw: cleanLisp,
    ast: parseAST(cleanLisp),
  };
}