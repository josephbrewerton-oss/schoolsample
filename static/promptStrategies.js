// static/promptStrategies.js

export const PROMPT_BUILDERS = {
  calculation: (subject, topic, langName, keyStage) => `Task: Generate a multiple-choice question for Key Stage ${keyStage}.
Subject: ${subject}
Topic: ${topic}

LANGUAGE: ${langName}

RULES:
1. Question must be strictly on the topic "${topic}".
2. State ONLY the question in :prompt.
3. Put the strictly correct answer in slot 0 of :options.
4. Distractors must be common student misconceptions for ${keyStage}.
5. Set :answer-key to 0.

Output format:
(:route "quiz:mcq" :prompt "<Question text>" :options (list "<correct_answer>" "<distractor_1>" "<distractor_2>" "<distractor_3>") :answer-key 0)

Output:`,

  factual: (subject, topic, langName, keyStage) => `Task: Generate a conceptual multiple-choice quiz question for Key Stage ${keyStage}.
Subject: ${subject}
Topic: ${topic}

LANGUAGE: ${langName}

RULES:
1. Question MUST test knowledge strictly about "${topic}" in ${subject}. Never output unrelated math problems.
2. Put the strictly correct factual answer in slot 0 of :options.
3. Provide 3 plausible incorrect options related to ${topic}.
4. Set :answer-key to 0.

Output format:
(:route "quiz:mcq" :prompt "<Question text>" :options (list "<correct_answer>" "<distractor_1>" "<distractor_2>" "<distractor_3>") :answer-key 0)

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