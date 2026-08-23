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

Generate ONE question for "${topic}":
Output:`,

  factual: (subject, topic, langName, keyStage, subjectId, topicId) => `You are an automated UK National Curriculum test generator for Key Stage ${keyStage}.

Subject: ${subject}
Topic: ${topic}
Language: ${langName}

STRICT CONSTRAINTS:
1. Subject is ${subject}. DO NOT output math equations, variables (x, y), or arithmetic.
2. Formulate a multiple-choice question testing knowledge of "${topic}".
3. In :options (list ...), ITEM 0 MUST BE the correct answer.
4. Items 1, 2, and 3 MUST be incorrect plausible distractors.
5. :answer-key MUST ALWAYS be 0.
6. Output ONLY the raw Lisp S-expression.

EXAMPLE (History):
Output: (:route "quiz:mcq" :scratchpad "The steam engine powered the factories during the Industrial Revolution." :prompt "Which technological innovation was central to the Industrial Revolution?" :options (list "Steam Engine" "Printing Press" "Microscope" "Telegraph") :answer-key 0)

EXAMPLE (Geography):
Output: (:route "quiz:mcq" :scratchpad "Tectonic plates float on the semi-fluid asthenosphere beneath the lithosphere." :prompt "Which layer of the Earth do tectonic plates form?" :options (list "Lithosphere" "Hydrosphere" "Atmosphere" "Biosphere") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`
};

export function buildPrompt(userPrompt, langName = 'English') {
  const subjMatch = userPrompt.match(/Subject:\s*"([^"]+)"/i);
  const topicMatch = userPrompt.match(/Topic:\s*"([^"]+)"/i);
  const ksMatch = userPrompt.match(/Key Stage:\s*"([^"]+)"|Key Stage\s*([1-4])/i);
  const subjIdMatch = userPrompt.match(/SubjectId:\s*"([^"]*)"/i);
  const topicIdMatch = userPrompt.match(/TopicId:\s*"([^"]*)"/i);

  const subject = subjMatch ? subjMatch[1].trim() : 'Mathematics';
  const topic = topicMatch ? topicMatch[1].trim() : 'General';
  const keyStage = ksMatch ? (ksMatch[1] || `KS${ksMatch[2]}`) : 'KS3';
  const subjectId = subjIdMatch ? subjIdMatch[1].toLowerCase().trim() : '';
  const topicId = topicIdMatch ? topicIdMatch[1].toLowerCase().trim() : '';

  const isPureMath = 
    subjectId === 'maths' || 
    /^(mathematics|maths)$/i.test(subject) ||
    /\b(algebra|fractions|decimals|arithmetic|geometry|percentages|ratio|equations|numbers)\b/i.test(topicId || topic);

  if (isPureMath) {
    return PROMPT_BUILDERS.calculation(subject, topic, langName, keyStage, topicId);
  }

  return PROMPT_BUILDERS.factual(subject, topic, langName, keyStage, subjectId, topicId);
}