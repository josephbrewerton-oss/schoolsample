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
  KS1: "Ages 5-7 (Primary). Short simple sentences, everyday words, basic concrete items (e.g. apples, coins). No technical jargon.",
  KS2: "Ages 7-11 (Middle Primary). Simple sentence structures, foundational subject terms. One-step reasoning or simple arithmetic only.",
  KS3: "Ages 11-14 (Lower Secondary / Middle Years). Formal definitions, standard formulas, two-step reasoning. Standard secondary tone.",
  KS4: "Ages 14-16 (Upper Secondary / GCSE / IGCSE standard). Rigorous terminology, multi-step calculations with standard units, subtle distractor traps."
};

const REGIONAL_CONSTRAINTS = {
  uk_oak: `
- CURRICULUM FRAMEWORK: UK National Curriculum (Oak National Academy aligned).
- DIALECT: Standard UK English spelling ('colour', 'neutralise', 'aluminium', 'centimetre').
- UNITS & CURRENCY: SI Metric units, Celsius (°C), and British Pounds (£/p).
- TERMINOLOGY: UK schooling terminology (e.g. 'full stop', 'speech marks' / 'inverted commas').
`.trim(),

  international: `
- CURRICULUM FRAMEWORK: International / Universal (Cambridge & IB aligned).
- DIALECT: Globally neutral international English (avoid regional colloquialisms).
- UNITS & CURRENCY: Strict SI Metric units ONLY (m, km, kg, s, °C). Do NOT use local currencies (£, $, €); use neutral counts or trade items.
- TERMINOLOGY: Globally neutral schooling terminology ('full stop / period', 'quotation marks').
`.trim()
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

// Universal Invariants for all subjects to ensure deterministic Lisp AST output
const BASE_CORE_RULES = `
CRITICAL INVARIANTS:
1. In :scratchpad, write ONLY the factual explanation or mathematical calculation steps (e.g., "12000 * 3 = 36000 km"). NEVER repeat the question, and NEVER write a question mark (?) in the scratchpad.
2. In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER directly matching the explanation in :scratchpad.
3. Items 1, 2, and 3 MUST be plausible distractors matching the exact entity type of Item 0. NEVER place an incorrect option or distractor in position 0.
4. :answer-key MUST ALWAYS be 0.
5. STRICT MCQ FORMAT: Do NOT include open-ended instructions like "Explain your reasoning", "Justify your answer", or "Show calculations" in the question stem.
6. Output ONLY the raw Lisp S-expression. No markdown, no introductory text, no ticks.
`.trim();

export const PROMPT_BUILDERS = {
  // 1. MATHEMATICS & CALCULATION
  maths: (subject, topic, langName, keyStage, topicId, curriculumKey = 'uk_oak') => {
    const focus = pickRandom(PEDAGOGICAL_ARCHETYPES.maths);
    const entropy = Math.floor(Math.random() * 100000);
    const ageRule = resolveKeyStageRule(keyStage);
    const regionalRule = REGIONAL_CONSTRAINTS[curriculumKey] || REGIONAL_CONSTRAINTS.uk_oak;

    return `You are an automated educational assessment Mathematics question generator for Level ${keyStage}.
[Entropy-Seed: ${entropy}]

Subject: ${subject}
Topic: ${topic} (TopicId: ${topicId || 'maths'})
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

REGIONAL & CURRICULUM CONSTRAINTS:
${regionalRule}

${BASE_CORE_RULES}

SUBJECT SPECIFIC RULES:
- Compute the exact numeric or algebraic solution step-by-step in :scratchpad first.
- Distractors (Items 1, 2, 3) must represent common student arithmetic errors.
- Strictly adhere to Target Reading Level: "${ageRule}".

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "1/4 + 1/2 = 1/4 + 2/4 = 3/4" :prompt "Calculate 1/4 + 1/2 in simplest form." :options (list "3/4" "2/6" "1/2" "3/8") :answer-key 0)

Generate ONE question for "${topic}":
Output:`;
  },

  // 2. SCIENCE (Physics, Chemistry, Biology)
  science: (subject, topic, langName, keyStage, topicId, curriculumKey = 'uk_oak') => {
    const focus = pickRandom(PEDAGOGICAL_ARCHETYPES.science);
    const entropy = Math.floor(Math.random() * 100000);
    const ageRule = resolveKeyStageRule(keyStage);
    const regionalRule = REGIONAL_CONSTRAINTS[curriculumKey] || REGIONAL_CONSTRAINTS.uk_oak;

    return `You are an automated educational assessment Science question generator for Level ${keyStage}.
[Entropy-Seed: ${entropy}]

Subject: ${subject}
Topic: ${topic}
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

REGIONAL & CURRICULUM CONSTRAINTS:
${regionalRule}

${BASE_CORE_RULES}

SUBJECT SPECIFIC RULES:
- SYLLABUS CEILING: Keep strictly within secondary Level ${keyStage} science. Do NOT introduce university/advanced research concepts unless explicit in the curriculum.
- Target pedagogical focus '${focus}'. Do NOT ask basic recall questions if higher-order application is possible.
- CHEMISTRY EQUATIONS: If balancing equations or writing reactions, use only valid real-world chemical reactions. Only change balancing coefficients, NEVER change chemical subscripts or compound formulas.
- TOPIC GROUNDING: Strictly test the chosen topic '${topic}'.
- Strictly adhere to Target Reading Level: "${ageRule}".

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "Microwaves penetrate atmosphere with minimal scattering, making them ideal for satellite communication." :prompt "Why are microwaves preferred over standard radio waves for direct satellite communications?" :options (list "They penetrate the atmosphere without excessive scattering" "They travel faster than the speed of light" "They carry no electromagnetic energy" "They reflect completely off the upper atmosphere") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`;
  },

  // 3. HUMANITIES (History, Geography, Religious Education, Citizenship)
  humanities: (subject, topic, langName, keyStage, topicId, curriculumKey = 'uk_oak') => {
    const focus = pickRandom(PEDAGOGICAL_ARCHETYPES.humanities);
    const entropy = Math.floor(Math.random() * 100000);
    const ageRule = resolveKeyStageRule(keyStage);
    const regionalRule = REGIONAL_CONSTRAINTS[curriculumKey] || REGIONAL_CONSTRAINTS.uk_oak;

    return `You are an automated educational assessment Humanities question generator for Level ${keyStage}.
[Entropy-Seed: ${entropy}]

Subject: ${subject}
Topic: ${topic}
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

REGIONAL & CURRICULUM CONSTRAINTS:
${regionalRule}

${BASE_CORE_RULES}

SUBJECT SPECIFIC RULES:
- State the historical, geographical, or cultural fact in :scratchpad first.
- Focus on '${focus}'. Avoid generic trivia dates/places unless assessing causation or significance.
- Strictly adhere to Target Reading Level: "${ageRule}".

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "William of Normandy defeated King Harold Godwinson at the Battle of Hastings in 1066." :prompt "Where did the decisive battle between William the Conqueror and King Harold take place in 1066?" :options (list "Battle of Hastings" "Battle of Stamford Bridge" "Battle of Bannockburn" "Battle of Waterloo") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`;
  },

  // 4. ENGLISH & LANGUAGES
  languages: (subject, topic, langName, keyStage, topicId, curriculumKey = 'uk_oak') => {
    const focus = pickRandom(PEDAGOGICAL_ARCHETYPES.languages);
    const entropy = Math.floor(Math.random() * 100000);
    const ageRule = resolveKeyStageRule(keyStage);
    const regionalRule = REGIONAL_CONSTRAINTS[curriculumKey] || REGIONAL_CONSTRAINTS.uk_oak;

    return `You are an automated educational assessment Language and Literature question generator for Level ${keyStage}.
[Entropy-Seed: ${entropy}]

Subject: ${subject}
Topic: ${topic}
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

REGIONAL & CURRICULUM CONSTRAINTS:
${regionalRule}

${BASE_CORE_RULES}

SUBJECT SPECIFIC RULES:
- Write the correct grammatical, literary, or punctuation rule clearly in :scratchpad first.
- Follow the regional dialect and terminology specified under REGIONAL & CURRICULUM CONSTRAINTS.
- Focus on '${focus}'.
- Strictly adhere to Target Reading Level: "${ageRule}".

EXAMPLE:
Output: (:route "quiz:mcq" :scratchpad "A metaphor directly asserts that one thing is another without using 'like' or 'as'." :prompt "Which literary device directly compares two things by stating one is the other?" :options (list "Metaphor" "Simile" "Alliteration" "Personification") :answer-key 0)

Generate ONE question for "${subject} - ${topic}":
Output:`;
  }
};

export function buildPrompt(userPrompt, langName = 'English', curriculumOverride = null) {
  if (typeof userPrompt === 'object' && userPrompt !== null) {
    const subject = userPrompt.subject || 'Science';
    const topic = userPrompt.unit || userPrompt.topic || 'General';
    const keyStage = userPrompt.keyStage || 'KS3';
    const subjectId = (userPrompt.subjectId || '').toLowerCase().trim();
    const topicId = (userPrompt.unitId || userPrompt.topicId || '').toLowerCase().trim();
    const curriculum = userPrompt.curriculum || curriculumOverride || 'uk_oak';

    return routePrompt(subject, topic, langName, keyStage, subjectId, topicId, curriculum);
  }

  const subjMatch = userPrompt.match(/Subject:\s*"([^"]+)"/i);
  const topicMatch = userPrompt.match(/Topic:\s*"([^"]+)"/i);
  const ksMatch = userPrompt.match(/Key Stage:\s*"([^"]+)"|Key Stage\s*([1-4])/i);
  const subjIdMatch = userPrompt.match(/SubjectId:\s*"([^"]*)"/i);
  const topicIdMatch = userPrompt.match(/TopicId:\s*"([^"]*)"/i);
  const currMatch = userPrompt.match(/Curriculum:\s*"([^"]*)"/i);

  const subject = subjMatch ? subjMatch[1].trim() : 'Mathematics';
  const topic = topicMatch ? topicMatch[1].trim() : 'General';
  const keyStage = ksMatch ? (ksMatch[1] || `KS${ksMatch[2]}`) : 'KS3';
  const subjectId = (subjIdMatch ? subjIdMatch[1] : '').toLowerCase().trim();
  const topicId = (topicIdMatch ? topicIdMatch[1] : '').toLowerCase().trim();
  const curriculum = currMatch ? currMatch[1] : (curriculumOverride || 'uk_oak');

  return routePrompt(subject, topic, langName, keyStage, subjectId, topicId, curriculum);
}

function routePrompt(subject, topic, langName, keyStage, subjectId, topicId, curriculum) {
  if (
    subjectId === 'maths' ||
    subjectId === 'mathematics' ||
    /^(mathematics|maths)$/i.test(subject) ||
    /\b(algebra|fractions|decimals|arithmetic|geometry|percentages|ratio|equations|numbers|trigonometry)\b/i.test(topicId || topic)
  ) {
    return PROMPT_BUILDERS.maths(subject, topic, langName, keyStage, topicId, curriculum);
  }

  if (
    subjectId === 'science' ||
    subjectId === 'physics' ||
    subjectId === 'chemistry' ||
    subjectId === 'biology' ||
    /^(science|physics|chemistry|biology)$/i.test(subject) ||
    /\b(forces|magnet|electric|electrolysis|photosynthesis|plant|cell|atom|chemical|energy|wave|ecology|acid|reaction)\b/i.test(topicId || topic)
  ) {
    return PROMPT_BUILDERS.science(subject, topic, langName, keyStage, topicId, curriculum);
  }

  if (
    subjectId === 'english' ||
    subjectId === 'english-language' ||
    subjectId === 'english-literature' ||
    subjectId === 'french' ||
    subjectId === 'spanish' ||
    subjectId === 'german' ||
    /\b(grammar|punctuation|spelling|metaphor|literature|poem|comprehension)\b/i.test(topicId || topic)
  ) {
    return PROMPT_BUILDERS.languages(subject, topic, langName, keyStage, topicId, curriculum);
  }

  return PROMPT_BUILDERS.humanities(subject, topic, langName, keyStage, topicId, curriculum);
}