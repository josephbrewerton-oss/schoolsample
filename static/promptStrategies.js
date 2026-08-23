// static/promptStrategies.js

export const PROMPT_BUILDERS = {
  calculation: (subject, topic, langName, keyStage, topicId) => `You are a strict UK National Curriculum Mathematics test author for Key Stage ${keyStage}.

Subject: ${subject}
Topic: ${topic} (TopicId: ${topicId || 'generic-maths'})
Target Language: ${langName}

MANDATORY RULES:
1. First, write down the complete arithmetic solution in :scratchpad with every intermediate step.
2. In :options, slot 0 MUST BE the exact solution calculated in :scratchpad.
3. Slots 1, 2, and 3 MUST be distinct, believable wrong answers (distractors). Never duplicate numbers.
4. Set :answer-key to 0.
5. Output ONLY the Lisp S-expression. No explanations or markdown blocks.

FEW-SHOT EXAMPLES:

Example 1 (Fractions):
(:route "quiz:mcq" :scratchpad "1/2 + 1/4 = 2/4 + 1/4 = 3/4" :prompt "What is 1/2 + 1/4 in simplest form?" :options (list "3/4" "2/6" "1/8" "2/4") :answer-key 0)

Example 2 (Algebra):
(:route "quiz:mcq" :scratchpad "3x + 5 = 20 => 3x = 15 => x = 5" :prompt "Solve for x: 3x + 5 = 20" :options (list "5" "15" "3" "25") :answer-key 0)

Example 3 (Decimals & Percentages):
(:route "quiz:mcq" :scratchpad "3/5 = (3 * 20)/(5 * 20) = 60/100 = 60%" :prompt "What is 3/5 expressed as a percentage?" :options (list "60%" "35%" "30%" "75%") :answer-key 0)

Generate ONE new question for Topic: "${topic}" (${keyStage}):
Output:`,

  factual: (subject, topic, langName, keyStage, subjectId, topicId) => `You are a UK National Curriculum test author for Key Stage ${keyStage}.

Subject: ${subject} (SubjectId: ${subjectId || 'humanities'})
Topic: ${topic} (TopicId: ${topicId || 'general-topic'})
Target Language: ${langName}

MANDATORY RULES:
1. Verify the core curriculum fact in :scratchpad first.
2. Question MUST focus strictly on "${topic}" in ${subject}. Never generate arithmetic or math formulas.
3. Slot 0 in :options MUST be the factually correct statement.
4. Slots 1, 2, and 3 MUST be distinct, plausible misconceptions related to ${topic}.
5. Set :answer-key to 0.
6. Output ONLY the Lisp S-expression.

FEW-SHOT EXAMPLES:

Example 1 (History):
(:route "quiz:mcq" :scratchpad "James Watt improved Thomas Newcomen's steam engine design in 1776, enabling efficient rotary power." :prompt "Which inventor made critical improvements to the steam engine during the Industrial Revolution?" :options (list "James Watt" "Alexander Graham Bell" "Thomas Edison" "Isambard Kingdom Brunel") :answer-key 0)

Example 2 (Geography):
(:route "quiz:mcq" :scratchpad "A megacity is defined as a metropolitan area with a total population exceeding 10 million people." :prompt "What is the minimum population generally required for an urban area to be classified as a megacity?" :options (list "10 million" "1 million" "5 million" "25 million") :answer-key 0)

Example 3 (Science):
(:route "quiz:mcq" :scratchpad "Photosynthesis converts carbon dioxide and water into glucose and oxygen using light." :prompt "What gas is released as a byproduct during plant photosynthesis?" :options (list "Oxygen" "Carbon dioxide" "Nitrogen" "Methane") :answer-key 0)

Generate ONE new question for Topic: "${topic}" (${keyStage}):
Output:`
};

export function buildPrompt(userPrompt, langName = 'English') {
  // 1. Extract IDs and human titles from the enriched intent
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

  // 2. Deterministic ID-driven domain routing
  const isPureMath = subjectId === 'maths' || 
    /^(mathematics|maths)$/i.test(subject.trim()) ||
    /\b(algebra|fractions|decimals|arithmetic|geometry|percentages|ratio|equations|numbers)\b/i.test(topicId || topic);

  if (isPureMath) {
    return PROMPT_BUILDERS.calculation(subject, topic, langName, keyStage, topicId);
  }

  return PROMPT_BUILDERS.factual(subject, topic, langName, keyStage, subjectId, topicId);
}