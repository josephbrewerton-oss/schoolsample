export const PROMPT_BUILDERS = {
  calculation: (userPrompt, langName) => `Task: Generate a 100% mathematically accurate 4-choice quiz question for ${userPrompt}.

LANGUAGE REQUIREMENT:
- Write student-facing text in ${langName}.
- AST tags (:route, :calc, :prompt, :options, :answer-key, list) MUST remain in ASCII English.

RULES:
1. First, calculate the step-by-step arithmetic in :calc (e.g. :calc "F=20, m=5 -> a=20/5=4").
2. The FIRST item in :options MUST be the EXACT correct calculated value with units (e.g. "4m/s^2").
3. Provide 3 UNIQUE, distinct distractor values.
4. Set :answer-key to 0.

Output format:
(:route "quiz:mcq" :calc "<step_by_step_math>" :prompt "<question>" :options (list "<correct_answer>" "<distractor1>" "<distractor2>" "<distractor3>") :answer-key 0)

Output:`,

  factual: (userPrompt, langName) => `Task: Generate a factually accurate 4-choice quiz question for ${userPrompt}.

LANGUAGE REQUIREMENT:
- Write student-facing text in ${langName}.
- AST tags (:route, :prompt, :options, :answer-key, list) MUST remain in ASCII English.

RULES:
1. The FIRST item in :options MUST be the strictly correct factual answer.
2. Provide 3 plausible, unique distractors.
3. Set :answer-key to 0.

Output format:
(:route "quiz:mcq" :prompt "<question>" :options (list "<correct_answer>" "<distractor1>" "<distractor2>" "<distractor3>") :answer-key 0)

Output:`
};

export function buildPrompt(userPrompt, langName) {
  const isMathOrPhysics = /mathematics|physics|chemistry|mechanics|calculation|fraction|decimal|equation|force|mass/i.test(userPrompt);
  const builder = isMathOrPhysics ? PROMPT_BUILDERS.calculation : PROMPT_BUILDERS.factual;
  return builder(userPrompt, langName);
}