export const PROMPT_BUILDERS = {
  calculation: (userPrompt, langName, keyStage) => `Task: Generate an educational, mathematically rigorous 4-choice question for: ${userPrompt}.
Key Stage Target: ${keyStage} (UK National Curriculum / Oak Standards).

LANGUAGE REQUIREMENT:
- Write student-facing text in ${langName}.
- AST tags (:route, :calc, :prompt, :options, :answer-key, list) MUST remain in ASCII English.

RULES:
1. ARITHMETIC SCRATCHPAD: Calculate step-by-step strictly inside :calc (e.g. :calc "3/4 + 2/5 = 15/20 + 8/20 = 23/20").
2. PROMPT: State ONLY the question clearly. Never include instructions like "Show your working".
3. CORRECT ANSWER: Slot 0 of :options MUST contain the EXACT, fully-simplified result from :calc.
4. DIAGNOSTIC DISTRACTORS: Provide 3 UNIQUE distractors based on common pupil misconceptions.
5. UNITS: Include SI units for Physics/Chemistry ("12 N", "4 m/s^2"). Numbers only for pure Maths.
6. Set :answer-key to 0 strictly.

Output format:
(:route "quiz:mcq" :calc "<step_by_step_math>" :prompt "<question>" :options (list "<correct_answer>" "<misconception_1>" "<misconception_2>" "<misconception_3>") :answer-key 0)

Output:`,

  grammarAndVocab: (userPrompt, langName, keyStage) => `Task: Generate an English SPaG / Language question for: ${userPrompt}.
Key Stage Target: ${keyStage}.

LANGUAGE REQUIREMENT:
- Base instructions in ${langName}.

RULES:
1. TARGET CONCEPT: Focus strictly on correct punctuation, word class, spelling, or syntactic usage.
2. PROMPT: Present a clear sentence or identification task with exact punctuation.
3. CORRECT ANSWER: Slot 0 of :options MUST be the unequivocally correct grammatical form or identification.
4. DISTRACTORS: Provide 3 common grammatical/spelling errors typical for ${keyStage}.
5. Set :answer-key to 0 strictly.

Output format:
(:route "quiz:mcq" :prompt "<sentence_or_question>" :options (list "<correct_term>" "<error_1>" "<error_2>" "<error_3>") :answer-key 0)

Output:`,

  factual: (userPrompt, langName, keyStage) => `Task: Generate a diagnostic 4-choice quiz question aligned with Oak Curriculum for: ${userPrompt}.
Key Stage Target: ${keyStage}.

LANGUAGE REQUIREMENT:
- Write student-facing text in ${langName}.
- AST tags (:route, :prompt, :options, :answer-key, list) MUST remain in ASCII English.

RULES:
1. The FIRST item in :options MUST be the strictly correct factual answer.
2. Provide 3 plausible distractors targeting common domain confusions or related terms.
3. Keep prompt reading level strictly appropriate for ${keyStage}.
4. Set :answer-key to 0 strictly.

Output format:
(:route "quiz:mcq" :prompt "<question>" :options (list "<correct_answer>" "<distractor1>" "<distractor2>" "<distractor3>") :answer-key 0)

Output:`
};

export function buildPrompt(userPrompt, langName = 'English') {
  const ksMatch = userPrompt.match(/Key Stage\s*([1-4])|KS([1-4])/i);
  const keyStage = ksMatch ? `KS${ksMatch[1] || ksMatch[2]}` : 'KS2';

  const isMathOrCalculation = /\b(mathematics|maths|physics|chemistry|mechanics|calculation|fraction|decimal|equation|force|mass|volume|area|perimeter|algebra|arithmetic|ratio|percentage)\b/i.test(userPrompt);
  const isGrammarOrVocab = /\b(grammar|punctuation|spelling|spag|phonics|verb|noun|adjective|vocabulary|synonym|antonym|comprehension)\b/i.test(userPrompt);

  let builder = PROMPT_BUILDERS.factual;
  if (isMathOrCalculation) builder = PROMPT_BUILDERS.calculation;
  else if (isGrammarOrVocab) builder = PROMPT_BUILDERS.grammarAndVocab;

  return builder(userPrompt, langName, keyStage);
}