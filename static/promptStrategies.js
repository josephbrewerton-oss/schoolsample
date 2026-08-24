// static/promptStrategies.js

const PEDAGOGICAL_ARCHETYPES = {
  science: [
    "Calculation / Formula application (e.g. solve for unknown with units)",
    "Practical scenario / Diagnostic error (e.g. troubleshoot a lab setup or explain an observed phenomenon)",
    "Common misconception trap (distractor 1 must target a standard student error)",
    "Comparative analysis (e.g. relative frequencies, energy states, or properties)"
  ],
  maths: [
    "Multi-step problem solving",
    "Real-world word problem application",
    "Inverse problem (working backwards from a result)",
    "Spot the arithmetic / conceptual error"
  ],
  humanities: [
    "Cause and consequence / Impact assessment",
    "Source analysis / Perspective comparison",
    "Chronological turning point / Significance",
    "Key definition applied to a specific historical/geographical case"
  ],
  languages: [
    "Contextual passage analysis / Device identification",
    "Subtle grammatical error correction",
    "Tone and connotation discrimination",
    "Structural syntax application"
  ]
};

const KEY_STAGE_CONSTRAINTS = {
  KS1: "Ages 5-7. Short simple sentences, everyday words, basic concrete items (e.g. apples, coins). No technical jargon.",
  KS2: "Ages 7-11. Simple sentence structures, foundational subject terms. One-step reasoning or simple arithmetic only.",
  KS3: "Ages 11-14. Formal definitions, standard formulas, two-step reasoning. Standard secondary school tone.",
  KS4: "Ages 14-16 (GCSE standard). Rigorous exam terminology, multi-step calculations with standard units, subtle distractor traps."
};

function resolveKeyStageRule(rawKs) {
  if (/1/i.test(rawKs)) return KEY_STAGE_CONSTRAINTS.KS1;
  if (/2/i.test(rawKs)) return KEY_STAGE_CONSTRAINTS.KS2;
  if (/4/i.test(rawKs)) return KEY_STAGE_CONSTRAINTS.KS4;
  return KEY_STAGE_CONSTRAINTS.KS3;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const PROMPT_BUILDERS = {
  // 1. MATHEMATICS & CALCULATION
  maths: (subject, topic, langName, keyStage, topicId) => {
    const focus = pickRandom(PEDAGOGICAL_ARCHETYPES.maths);
    const entropy = Math.floor(Math.random() * 100000);
    const ageRule = resolveKeyStageRule(keyStage);

    return `You are an automated UK National Curriculum Mathematics question generator for Key Stage ${keyStage}.
[Entropy-Seed: ${entropy}]

Subject: ${subject}
Topic: ${topic} (TopicId: ${topicId || 'maths'})
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

CRITICAL RULES:
1. Compute the exact solution step-by-step in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE the EXACT computed answer from :scratchpad.
3. Items 1, 2, and 3 MUST be plausible but incorrect numeric distractors representing common student arithmetic errors.
4. :answer-key MUST ALWAYS be 0.
5. Strictly adhere to the Target Reading Level & Tone: "${ageRule}".
6. Output ONLY the raw Lisp S-expression. No explanations, no markdown ticks.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "1/4 + 1/2 = 1/4 + 2/4 = 3/4" :prompt "Calculate 1/4 + 1/2 in simplest form." :options (list "3/4" "2/6" "1/2" "3/8") :answer-key 0)

Generate ONE question for "${topic}":
Output:`;
  },

// 2. SCIENCE (Physics, Chemistry, Biology)
  science: (subject, topic, langName, keyStage, topicId) => {
    const focus = pickRandom(PEDAGOGICAL_ARCHETYPES.science);
    const entropy = Math.floor(Math.random() * 100000);
    const ageRule = resolveKeyStageRule(keyStage);

    return `You are an automated UK National Curriculum Science question generator for Key Stage ${keyStage}.
[Entropy-Seed: ${entropy}]

Subject: ${subject}
Topic: ${topic}
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

CRITICAL RULES:
1. Write the scientific fact/law clearly in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER matching the science in :scratchpad.
3. Items 1, 2, and 3 MUST be plausible scientific distractors that match the exact entity type of Item 0.
4. :answer-key MUST ALWAYS be 0.
5. STRICT MCQ FORMAT: Do NOT include open-ended instructions like "Explain your reasoning", "Justify your answer", or "Show calculations" in the question stem.
6. SYLLABUS CEILING: Keep strictly within UK Key Stage ${keyStage} science. Do NOT introduce university/A-Level concepts (e.g. no Planck equations, quantum mechanics, or wavenumbers unless explicitly required by Key Stage 4).
7. NEGATIVE CONSTRAINT: Do NOT ask basic "Which has the longest/shortest..." recall questions if higher-order application is possible. Target '${focus}'.
8. Strictly adhere to the Target Reading Level & Tone: "${ageRule}".

9. CHEMISTRY EQUATIONS: If balancing equations or writing reactions:
   - Use ONLY valid, real-world chemical reactions (e.g. 2H2 + O2 -> 2H2O, or electrolysis: 2H2O -> 2H2 + O2).
   - Only change balancing coefficients (numbers in front), NEVER change the chemical subscripts or compound formulas in the options.
10. TOPIC GROUNDING: The question MUST strictly test the chosen topic '${topic}' (e.g. cathode/anode reactions, molten vs aqueous ions for Electrolysis).
11. Output ONLY the raw Lisp S-expression. No markdown.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "Microwaves penetrate atmosphere with minimal scattering, making them ideal for satellite communication." :prompt "Why are microwaves preferred over standard radio waves for direct satellite communications?" :options (list "They penetrate the atmosphere without excessive scattering" "They travel faster than the speed of light" "They carry no electromagnetic energy" "They reflect completely off the upper atmosphere") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`;
  },

  // 3. HUMANITIES (History, Geography, Religious Education, Citizenship)
  humanities: (subject, topic, langName, keyStage, topicId) => {
    const focus = pickRandom(PEDAGOGICAL_ARCHETYPES.humanities);
    const entropy = Math.floor(Math.random() * 100000);
    const ageRule = resolveKeyStageRule(keyStage);

    return `You are an automated UK National Curriculum Humanities question generator for Key Stage ${keyStage}.
[Entropy-Seed: ${entropy}]

Subject: ${subject}
Topic: ${topic}
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

CRITICAL RULES:
1. State the historical, geographical, or cultural fact in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER stated in :scratchpad. It is mandatory that Item 0 is the single true fact.
3. Items 1, 2, and 3 MUST be plausible but historically/geographically incorrect distractors. NEVER place an incorrect option, joke, or distractor in position 0.
4. :answer-key MUST ALWAYS be 0.
5. Focus on '${focus}'. Avoid generic dates/places unless assessing causation or significance.
6. Strictly adhere to the Target Reading Level & Tone: "${ageRule}".
7. Output ONLY the raw Lisp S-expression. No markdown.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "William of Normandy defeated King Harold Godwinson at the Battle of Hastings in 1066." :prompt "Where did the decisive battle between William the Conqueror and King Harold take place in 1066?" :options (list "Battle of Hastings" "Battle of Stamford Bridge" "Battle of Bannockburn" "Battle of Waterloo") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`;
  },

  // 4. ENGLISH & LANGUAGES
  languages: (subject, topic, langName, keyStage, topicId) => {
    const focus = pickRandom(PEDAGOGICAL_ARCHETYPES.languages);
    const entropy = Math.floor(Math.random() * 100000);
    const ageRule = resolveKeyStageRule(keyStage);

    return `You are an automated UK National Curriculum English and Language question generator for Key Stage ${keyStage}.
[Entropy-Seed: ${entropy}]

Subject: ${subject}
Topic: ${topic}
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

CRITICAL RULES:
1. Write the correct grammatical, literary, or punctuation rule clearly in :scratchpad first.
2. In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER directly matching what you stated in :scratchpad. It is mandatory that Item 0 is the single correct answer.
3. Items 1, 2, and 3 MUST be plausible incorrect distractors. NEVER put an incorrect option or distractor into position 0.
4. :answer-key MUST ALWAYS be 0.
5. Use standard UK English terminology (e.g., 'inverted commas' or 'speech marks', 'full stop' instead of 'period').
6. Strictly adhere to the Target Reading Level & Tone: "${ageRule}".
7. Output ONLY the raw Lisp S-expression. No markdown.

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "A metaphor directly asserts that one thing is another without using 'like' or 'as'." :prompt "Which literary device directly compares two things by stating one is the other?" :options (list "Metaphor" "Simile" "Alliteration" "Personification") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`;
  }
};

export function buildPrompt(userPrompt, langName = 'English') {
  // Support either raw string or intent object
  if (typeof userPrompt === 'object' && userPrompt !== null) {
    const subject = userPrompt.subject || 'Science';
    const topic = userPrompt.unit || userPrompt.topic || 'General';
    const keyStage = userPrompt.keyStage || 'KS3';
    const subjectId = (userPrompt.subjectId || '').toLowerCase().trim();
    const topicId = (userPrompt.unitId || userPrompt.topicId || '').toLowerCase().trim();

    return routePrompt(subject, topic, langName, keyStage, subjectId, topicId);
  }

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

  

  return routePrompt(subject, topic, langName, keyStage, subjectId, topicId);
}

function routePrompt(subject, topic, langName, keyStage, subjectId, topicId) {
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
    /^(science|physics|chemistry|biology)$/i.test(subject) ||
    /\b(forces|magnet|electric|electrolysis|photosynthesis|plant|cell|atom|chemical|energy|wave|ecology|acid|reaction)\b/i.test(topicId || topic)
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