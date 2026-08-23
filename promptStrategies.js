// static/promptStrategies.js

export const PROMPT_BUILDERS = {
  calculation: (subject, topic, langName, keyStage, topicId) => `You are an automated UK National Curriculum Mathematics question generator for Key Stage ${keyStage}.

Subject: ${subject}
Topic: ${topic} (TopicId: ${topicId || 'maths'})
Language: ${langName}

CRITICAL RULES:
1. Compute the exact solution step-by-step in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE the EXACT computed answer from :scratchpad.
3. Items 1, 2, and 3 MUST be incorrect distractors.
4. :answer-key MUST ALWAYS be 0.
5. Output ONLY the raw Lisp S-expression. No explanations, no markdown ticks.

EXAMPLE:
Prompt: Fractions
Output: (:route "quiz:mcq" :scratchpad "1/4 + 1/2 = 1/4 + 2/4 = 3/4" :prompt "Calculate 1/4 + 1/2 in simplest form." :options (list "3/4" "2/6" "1/2" "3/8") :answer-key 0)

EXAMPLE:
Prompt: Decimals
Output: (:route "quiz:mcq" :scratchpad "0.75 + 0.25 = 1.00" :prompt "What is 0.75 + 0.25?" :options (list "1.00" "0.90" "0.80" "1.05") :answer-key 0)

Generate ONE question for "${topic}":
Output:`,

  factual: (subject, topic, langName, keyStage, subjectId, topicId) => `You are an automated UK National Curriculum test generator for Key Stage ${keyStage}.

Subject: ${subject} (SubjectId: ${subjectId || 'humanities'})
Topic: ${topic} (TopicId: ${topicId || 'topic'})
Language: ${langName}

CRITICAL RULES:
1. State the curriculum fact in :scratchpad.
2. Focus strictly on "${topic}". No math calculations.
3. In :options (list ...), ITEM 0 MUST BE the correct factual answer.
4. Items 1, 2, and 3 MUST be incorrect distractors.
5. :answer-key MUST ALWAYS be 0.
6. Output ONLY the raw Lisp S-expression.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "The Great Fire of London started on Pudding Lane in 1666." :prompt "Where did the Great Fire of London begin in 1666?" :options (list "Pudding Lane" "Baker Street" "Fleet Street" "Tower Bridge") :answer-key 0)

Generate ONE question for "${topic}":
Output:`
};

export function buildPrompt(userPrompt, langName = 'English') {
  const subjMatch = userPrompt.match(/Subject:\s*"([^"]+)"/i);
  const topicMatch = userPrompt.match(/Topic:\s*"([^"]+)"/i);
  const ksMatch = userPrompt.match(/Key Stage:\s*"([^"]+)"|Key Stage\s*([1-4])/i);
  const subjIdMatch = userPrompt.match(/SubjectId:\s*"([^"]*)"/i);
  const topicIdMatch = userPrompt.match(/TopicId:\s*"([^"]*)"/i);

  const subject = subjMatch ? subjMatch[1] : 'Mathematics';
  const topic = topicMatch ? topicMatch[1] : 'Fractions and Decimals';
  const keyStage = ksMatch ? (ksMatch[1] || `KS${ksMatch[2]}`) : 'KS2';
  const subjectId = subjIdMatch ? subjIdMatch[1].toLowerCase() : '';
  const topicId = topicIdMatch ? topicIdMatch[1].toLowerCase() : '';

  const isPureMath = subjectId === 'maths' || 
    /^(mathematics|maths)$/i.test(subject.trim()) ||
    /\b(algebra|fractions|decimals|arithmetic|geometry|percentages|ratio|equations|numbers)\b/i.test(topicId || topic);

  if (isPureMath) {
    return PROMPT_BUILDERS.calculation(subject, topic, langName, keyStage, topicId);
  }

  return PROMPT_BUILDERS.factual(subject, topic, langName, keyStage, subjectId, topicId);
}