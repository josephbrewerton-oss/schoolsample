// static/promptStrategies.js

export const PROMPT_BUILDERS = {
  calculation: (subject, topic, langName, keyStage) => `Task: Generate a multiple-choice question for Key Stage ${keyStage}.
Subject: ${subject}
Topic: ${topic}

LANGUAGE: ${langName}

INSTRUCTIONS:
1. Work out the exact mathematical steps inside :scratchpad before writing options.
2. Ensure the strictly correct mathematical answer is always placed in slot 0 of :options.
3. Provide 3 plausible distractor answers representing common Key Stage ${keyStage} student mistakes.
4. Set :answer-key to 0.

Output format:
(:route "quiz:mcq" :scratchpad "<step-by-step arithmetic calculation>" :prompt "<Question text>" :options (list "<correct_answer>" "<distractor_1>" "<distractor_2>" "<distractor_3>") :answer-key 0)

Example:
(:route "quiz:mcq" :scratchpad "0.6 = 6/10 = 3/5 in simplest form" :prompt "Which fraction is equivalent to 0.6 in its simplest form?" :options (list "3/5" "1/2" "4/10" "2/10") :answer-key 0)

Output:`,

  factual: (subject, topic, langName, keyStage) => `Task: Generate a conceptual multiple-choice quiz question for Key Stage ${keyStage}.
Subject: ${subject}
Topic: ${topic}

LANGUAGE: ${langName}

INSTRUCTIONS:
1. Verify the factual accuracy inside :scratchpad first.
2. Question MUST test knowledge strictly about "${topic}" in ${subject}. Never output unrelated math problems.
3. Put the strictly correct factual answer in slot 0 of :options.
4. Provide 3 plausible incorrect options related to ${topic}.
5. Set :answer-key to 0.

Output format:
(:route "quiz:mcq" :scratchpad "<verified fact summary>" :prompt "<Question text>" :options (list "<correct_answer>" "<distractor_1>" "<distractor_2>" "<distractor_3>") :answer-key 0)

Output:`
};

export function buildPrompt(userPrompt, langName = 'English') {
  // 1. Extract explicit subject and topic from the intent format
  const subjMatch = userPrompt.match(/Subject:\s*"([^"]+)"/i);
  const topicMatch = userPrompt.match(/Topic:\s*"([^"]+)"/i);
  const ksMatch = userPrompt.match(/Key Stage:\s*"([^"]+)"|Key Stage\s*([1-4])/i);

  const subject = subjMatch ? subjMatch[1] : 'General Science';
  const topic = topicMatch ? topicMatch[1] : 'Core Concepts';
  const keyStage = ksMatch ? (ksMatch[1] || `KS${ksMatch[2]}`) : 'KS3';

  // 2. Pure maths routing only
  const isPureMath = /^(mathematics|maths)$/i.test(subject.trim()) ||
    /\b(algebra|fractions|decimals|arithmetic|geometry|percentages|ratio|equations)\b/i.test(topic);

  if (isPureMath) {
    return PROMPT_BUILDERS.calculation(subject, topic, langName, keyStage);
  }

  return PROMPT_BUILDERS.factual(subject, topic, langName, keyStage);
}