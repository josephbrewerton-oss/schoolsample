// static/promptStrategies.js

export const PROMPT_BUILDERS = {
  // 1. MATHEMATICS & CALCULATION
  maths: (subject, topic, langName, keyStage, topicId) => `You are an automated UK National Curriculum Mathematics question generator for Key Stage ${keyStage}.

Subject: ${subject}
Topic: ${topic} (TopicId: ${topicId || 'maths'})
Language: ${langName}

CRITICAL RULES:
1. Compute the exact solution step-by-step in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE the EXACT computed answer from :scratchpad.
3. Items 1, 2, and 3 MUST be plausible but incorrect numeric distractors.
4. :answer-key MUST ALWAYS be 0.
5. Output ONLY the raw Lisp S-expression. No explanations, no markdown ticks.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "1/4 + 1/2 = 1/4 + 2/4 = 3/4" :prompt "Calculate 1/4 + 1/2 in simplest form." :options (list "3/4" "2/6" "1/2" "3/8") :answer-key 0)

Generate ONE question for "${topic}":
Output:`,

  // 2. SCIENCE (Physics, Chemistry, Biology)
  science: (subject, topic, langName, keyStage, topicId) => `You are an automated UK National Curriculum Science question generator for Key Stage ${keyStage}.

Subject: ${subject}
Topic: ${topic}
Language: ${langName}

CRITICAL RULES:
1. Write the scientific fact/law clearly in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER matching the science in :scratchpad.
3. Items 1, 2, and 3 MUST be incorrect scientific distractors.
4. :answer-key MUST ALWAYS be 0.
5. Output ONLY the raw Lisp S-expression. No markdown.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "Magnetic forces are non-contact forces that attract magnetic materials like iron and steel." :prompt "What force causes a magnet to attract iron?" :options (list "Magnetic force" "Air resistance" "Friction" "Gravity") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`,

  // 3. HUMANITIES (History, Geography, Religious Education, Citizenship)
  humanities: (subject, topic, langName, keyStage, topicId) => `You are an automated UK National Curriculum Humanities question generator for Key Stage ${keyStage}.

Subject: ${subject}
Topic: ${topic}
Language: ${langName}

CRITICAL RULES:
1. State the historical, geographical, or cultural fact in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER stated in :scratchpad.
3. Items 1, 2, and 3 MUST be plausible but historically/geographically incorrect distractors.
4. :answer-key MUST ALWAYS be 0.
5. Output ONLY the raw Lisp S-expression. No markdown.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "William of Normandy defeated King Harold Godwinson at the Battle of Hastings in 1066." :prompt "Where did the decisive battle between William the Conqueror and King Harold take place in 1066?" :options (list "Battle of Hastings" "Battle of Stamford Bridge" "Battle of Bannockburn" "Battle of Waterloo") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`,

  // 4. ENGLISH & LANGUAGES
  languages: (subject, topic, langName, keyStage, topicId) => `You are an automated UK National Curriculum English and Language question generator for Key Stage ${keyStage}.

Subject: ${subject}
Topic: ${topic}
Language: ${langName}

CRITICAL RULES:
1. State the grammar rule, definition, or literary device in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER stated in :scratchpad.
3. Items 1, 2, and 3 MUST be incorrect grammatical or literary distractors.
4. :answer-key MUST ALWAYS be 0.
5. Output ONLY the raw Lisp S-expression. No markdown.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "A metaphor directly asserts that one thing is another without using 'like' or 'as'." :prompt "Which literary device directly compares two things by stating one is the other?" :options (list "Metaphor" "Simile" "Alliteration" "Personification") :answer-key 0)

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
  const subjectId = (subjIdMatch ? subjIdMatch[1] : '').toLowerCase().trim();
  const topicId = (topicIdMatch ? topicIdMatch[1] : '').toLowerCase().trim();

  // Mathematics routing
  if (
    subjectId === 'maths' ||
    subjectId === 'mathematics' ||
    /^(mathematics|maths)$/i.test(subject) ||
    /\b(algebra|fractions|decimals|arithmetic|geometry|percentages|ratio|equations|numbers|trigonometry)\b/i.test(topicId || topic)
  ) {
    return PROMPT_BUILDERS.maths(subject, topic, langName, keyStage, topicId);
  }

  // Science routing (Physics, Chemistry, Biology)
  if (
    subjectId === 'science' ||
    subjectId === 'physics' ||
    subjectId === 'chemistry' ||
    subjectId === 'biology' ||
    /\b(forces|magnet|electricity|photosynthesis|plant|cell|atom|chemical|energy|wave|ecology)\b/i.test(topicId || topic)
  ) {
    return PROMPT_BUILDERS.science(subject, topic, langName, keyStage, topicId);
  }

  // English & Languages routing
  if (
    subjectId === 'english' ||
    subjectId === 'english-language' ||
    subjectId === 'english-literature' ||
    subjectId === 'french' ||
    subjectId === 'spanish' ||
    subjectId === 'german' ||
    /\b(grammar|punctuation|spelling|metaphor|literature|poem|comprehension)\b/i.test(topicId || topic)
  ) {
    return PROMPT_BUILDERS.languages(subject, topic, langName, keyStage, topicId);
  }

  // Default fallback: Humanities (History, Geography, RE, etc.)
  return PROMPT_BUILDERS.humanities(subject, topic, langName, keyStage, topicId);
}