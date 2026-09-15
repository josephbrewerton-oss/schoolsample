// src/utils/astQuestionExtractor.ts

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
export function healSExprString(raw: string): string {
  if (!raw || typeof raw !== 'string') return '';
  let clean = raw.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

  // 1. Balance quotes (counting unescaped double quotes)
  let inQuote = false;
  let escapeNext = false;
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inQuote = !inQuote;
    }
  }
  if (inQuote) {
    clean += '"';
  }

  // 2. Balance parentheses
  let openParenCount = 0;
  inQuote = false;
  escapeNext = false;
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    if (char === '"') {
      inQuote = !inQuote;
      continue;
    }
    if (!inQuote) {
      if (char === '(') openParenCount++;
      else if (char === ')') openParenCount--;
    }
  }

  while (openParenCount > 0) {
    clean += ')';
    openParenCount--;
  }

  return clean;
}

export function extractQuestionFromAst(rawLisp: string): ExtractedQuestion | null {
  if (!rawLisp || typeof rawLisp !== 'string') return null;

  try {
    const rawTrimmed = rawLisp.trim();

    // Strategy 1: Attempt JSON extraction (Gemini Nano frequently generates JSON or markdown-fenced JSON)
    const jsonMatch = rawTrimmed.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        const prompt = parsed.prompt || parsed.question || parsed.q || parsed.stem;
        const rawOptions = parsed.options || parsed.choices || parsed.answers || parsed.opts;
        if (prompt && Array.isArray(rawOptions) && rawOptions.length >= 2) {
          const options = rawOptions.map((o: any) => typeof o === 'string' ? o.replace(/^[A-D]\)\s*/i, '').trim() : String(o));
          let answerKey = 0;
          if (typeof parsed.answerKey === 'number') answerKey = parsed.answerKey;
          else if (typeof parsed.answer === 'number') answerKey = parsed.answer;
          else if (typeof parsed.answerKey === 'string') {
            const letterIdx = 'abcd'.indexOf(parsed.answerKey.toLowerCase().trim());
            if (letterIdx >= 0) answerKey = letterIdx;
            else {
              const num = parseInt(parsed.answerKey, 10);
              if (!isNaN(num)) answerKey = num;
            }
          }
          return {
            prompt: String(prompt).trim(),
            options,
            answerKey: Math.min(Math.max(0, answerKey), options.length - 1),
            scratchpad: parsed.scratchpad || parsed.reasoning,
            hint: parsed.hint || parsed.clue,
            misconceptions: Array.isArray(parsed.misconceptions) ? parsed.misconceptions : undefined,
            socraticFollowUp: parsed.socraticFollowUp || parsed.followUp,
          };
        }
      } catch {}
    }

    const clean = healSExprString(rawLisp);

    // Strategy 2: Lisp S-Expression Parsing (:prompt "..." :options (...) :answer-key ...)
    // 1. Prompt stem extraction (Longhand :prompt or Shorthand :q / :question)
    const promptMatch =
      clean.match(/:(?:prompt|q|question)\s+"([^"]+)"/i) ||
      clean.match(/:(?:prompt|q|question)\s+([^\s:]+)/i) ||
      clean.match(/\(question\s+(?:\(text\s+)?"([^"]+)"/i);

    // 2. Options list extraction (Longhand :options or Shorthand :opts, with either () or [])
    const optionsMatch =
      clean.match(/:(?:options|opts|choices)\s+[\(\[](?:list\s+)?([^\]\)]*)[\)\]]/i);

    let optionMatches: string[] = [];
    let detectedAnswerKey = -1;

    if (optionsMatch) {
      optionMatches = [...optionsMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1].trim());
    } else {
      const explicitOptionRegex = /\(option\s*(?::correct\s+#([tf]))?\s*(?:\(text\s+)?"([^"]+)"/gi;
      let optIdx = 0;
      let match: RegExpExecArray | null;
      while ((match = explicitOptionRegex.exec(clean)) !== null) {
        if (match[1]?.toLowerCase() === 't') {
          detectedAnswerKey = optIdx;
        }
        optionMatches.push(match[2].trim());
        optIdx++;
      }
    }

    // Strategy 3: Markdown / Plain Text MCQ fallback (Question: ... A) ... B) ... Answer: ...)
    if (!promptMatch || optionMatches.length < 2) {
      const lines = rawTrimmed.split('\n').map((l) => l.trim()).filter(Boolean);
      let detectedPrompt = '';
      const textOptions: string[] = [];
      let textAnswer = 0;

      for (const line of lines) {
        const qMatch = line.match(/^(?:question|prompt|q)\s*[:\-]\s*(.+)$/i);
        if (qMatch && !detectedPrompt) {
          detectedPrompt = qMatch[1].trim();
          continue;
        }
        const optMatch = line.match(/^(?:[A-D]\)|\d+\.|\-)\s+(.+)$/i);
        if (optMatch) {
          textOptions.push(optMatch[1].replace(/^["']|["']$/g, '').trim());
          continue;
        }
        const ansMatch = line.match(/^(?:answer|correct|key)\s*[:\-]\s*([A-D]|\d+)/i);
        if (ansMatch) {
          const val = ansMatch[1].toUpperCase();
          if (['A', 'B', 'C', 'D'].includes(val)) {
            textAnswer = 'ABCD'.indexOf(val);
          } else {
            textAnswer = parseInt(val, 10) || 0;
          }
        }
      }

      if (detectedPrompt && textOptions.length >= 2) {
        return {
          prompt: detectedPrompt,
          options: textOptions,
          answerKey: Math.min(Math.max(0, textAnswer), textOptions.length - 1),
        };
      }
      return null;
    }

    const prompt = promptMatch[1].trim();

    // 4. Answer key extraction (Longhand :answer-key, :answerKey, :answer_key or Shorthand :ans)
    let answerKey = detectedAnswerKey >= 0 ? detectedAnswerKey : 0;
    const answerKeyMatch = clean.match(/:(?:answer-key|ans|answerKey|answer_key)\s+(\d+)/i);
    if (answerKeyMatch) {
      const parsedKey = parseInt(answerKeyMatch[1], 10);
      if (!isNaN(parsedKey)) {
        answerKey = parsedKey;
      }
    }

    // 5. Scratchpad / Arithmetic reasoning extraction (:scratchpad or :calc)
    const scratchpadMatch = clean.match(/:(?:scratchpad|calc|reasoning)\s+"([^"]+)"/i);
    const scratchpad = scratchpadMatch ? scratchpadMatch[1].trim() : undefined;

    // 6. Hint extraction (:hint or :hints)
    const hintMatch =
      clean.match(/:hint\s+"([^"]+)"/i) ||
      clean.match(/:hints\s+\((?:list\s+)?(?:"([^"]+)")?/i) ||
      clean.match(/:hints\s+"([^"]+)"/i);
    const hint = hintMatch ? hintMatch[1].trim() : undefined;

    // 7. Misconceptions extraction (:misconceptions or :misc)
    const miscMatch = clean.match(/:(?:misconceptions|misc)\s+[\(\[](?:list\s+)?([^\]\)]*)[\)\]]/i);
    let misconceptions: string[] | undefined = undefined;
    if (miscMatch) {
      const parsedMiscs = [...miscMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1].trim());
      if (parsedMiscs.length > 0) {
        misconceptions = parsedMiscs;
      }
    }

    // 8. Socratic Follow-up
    const socraticMatch = clean.match(/:(?:socratic-followup|socratic|followup)\s+"([^"]+)"/i);
    const socraticFollowUp = socraticMatch ? socraticMatch[1].trim() : undefined;

    return {
      prompt,
      options: optionMatches,
      answerKey: isNaN(answerKey) ? 0 : Math.min(Math.max(0, answerKey), optionMatches.length - 1),
      scratchpad,
      hint,
      misconceptions,
      socraticFollowUp,
    };
  } catch (err) {
    console.error('[AST Extractor] Parse error:', err);
    return null;
  }
}