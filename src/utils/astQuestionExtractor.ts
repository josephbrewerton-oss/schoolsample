// src/utils/astQuestionExtractor.ts

export interface ExtractedQuestion {
  prompt: string;
  options: string[];
  answerKey: number;
  scratchpad?: string;
}

export function extractQuestionFromAst(rawLisp: string): ExtractedQuestion | null {
  if (!rawLisp || typeof rawLisp !== 'string') return null;

  try {
    const clean = rawLisp.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();

    const promptMatch = clean.match(/:prompt\s+"([^"]+)"/i);
    const optionsMatch = clean.match(/:options\s+\((?:list\s+)?([^)]+)\)/i);
    const answerKeyMatch = clean.match(/:answer-key\s+(\d+)/i);
    const scratchpadMatch = clean.match(/:scratchpad\s+"([^"]+)"/i);

    if (!promptMatch || !optionsMatch) {
      return null;
    }

    const prompt = promptMatch[1].trim();
    
    // Parse the string items out of :options (list "A" "B" "C" "D")
    const optionMatches = [...optionsMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1].trim());

    if (optionMatches.length < 2) {
      return null;
    }

    const answerKey = answerKeyMatch ? parseInt(answerKeyMatch[1], 10) : 0;
    const scratchpad = scratchpadMatch ? scratchpadMatch[1] : undefined;

    return {
      prompt,
      options: optionMatches,
      answerKey: isNaN(answerKey) ? 0 : answerKey,
      scratchpad,
    };
  } catch (err) {
    console.error('[AST Extractor] Parse error:', err);
    return null;
  }
}