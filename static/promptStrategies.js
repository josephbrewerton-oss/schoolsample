// static/promptStrategies.js

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

export const SUBJECT_DEFINITIONS = {
  maths: {
    category: "Mathematics",
    aliases: [
      'maths', 'mathematics', 'algebra', 'geometry', 'arithmetic', 'fractions', 
      'decimals', 'percentages', 'ratio', 'equations', 'numbers', 'trigonometry', 
      'statistics', 'circle', 'circle theorems', 'tangent', 'chord', 'subtended', 
      'arc', 'radius', 'diameter', 'pythagoras', 'quadratic', 'probability'
    ],
    archetypes: [
      "Multi-step problem solving",
      "Geometric property deduction / Theorem application",
      "Real-world word problem application",
      "Inverse problem (working backwards from a result)",
      "Spot the arithmetic / conceptual error"
    ],
    specificRules: [
      "TOPIC FIDELITY: Strictly generate a question testing the exact Topic specified (e.g., if Topic is 'Circle Theorems', the question MUST test angles, arcs, chords, or tangents).",
      "Compute the exact numeric or geometric step-by-step solution in :scratchpad first.",
      "Distractors (Items 1, 2, 3) must represent common student mathematical misconceptions.",
      "SYLLABUS BOUNDARY (KS4 GCSE): Use DEGREES (0°–360°) for angle and sector questions. NEVER use radians.",
      "DISTRACTOR DIVERSITY: All 4 options in :options (list ...) MUST be distinctly different numbers or expressions. NEVER output identical options.",
      "DISTRACTOR GENERATION: Create plausible arithmetic mistakes for Items 1, 2, and 3 (e.g. forgetting to square the radius, omitting the 1/2 factor, or multiplying instead of dividing)."
    ],
    example: '(:route "quiz:mcq" :scratchpad "The angle subtended by an arc at the center is twice the angle subtended at the circumference. 35 * 2 = 70 degrees." :prompt "An angle subtended at the circumference of a circle is 35°. What is the angle subtended by the same arc at the center?" :options (list "70°" "35°" "17.5°" "140°") :answer-key 0)'
  },

  science: {
    category: "Science",
    aliases: ['science', 'physics', 'chemistry', 'biology', 'forces', 'magnet', 'electric', 'electrolysis', 'photosynthesis', 'plant', 'cell', 'atom', 'chemical', 'energy', 'wave', 'ecology', 'acid', 'reaction'],
    archetypes: [
      "Calculation / Formula application (e.g. solve for unknown with units)",
      "Practical scenario / Diagnostic error (e.g. troubleshoot a lab setup or explain an observed phenomenon)",
      "Common misconception trap (distractor 1 must target a standard student error)",
      "Comparative analysis (e.g. relative frequencies, energy states, or properties)"
    ],
    specificRules: [
      "SYLLABUS CEILING: Keep strictly within secondary school level. Do NOT introduce university/advanced research concepts.",
      "CHEMISTRY EQUATIONS: If balancing equations or writing reactions, use only valid real-world chemical reactions. Only change balancing coefficients, NEVER change chemical subscripts or compound formulas.",
      "TOPIC GROUNDING: Strictly test the chosen topic."
    ],
    example: '(:route "quiz:mcq" :scratchpad "Microwaves penetrate atmosphere with minimal scattering, making them ideal for satellite communication." :prompt "Why are microwaves preferred over standard radio waves for direct satellite communications?" :options (list "They penetrate the atmosphere without excessive scattering" "They travel faster than the speed of light" "They carry no electromagnetic energy" "They reflect completely off the upper atmosphere") :answer-key 0)'
  },

  languages: {
    category: "Languages & Literature",
    aliases: ['english', 'english-language', 'english-literature', 'french', 'spanish', 'german', 'grammar', 'punctuation', 'spelling', 'metaphor', 'literature', 'poem', 'comprehension'],
    archetypes: [
      "Contextual passage analysis / Device identification",
      "Subtle grammatical error correction",
      "Tone and connotation discrimination",
      "Structural syntax application"
    ],
    specificRules: [
      "Write the correct grammatical, literary, or punctuation rule clearly in :scratchpad first.",
      "Follow regional dialect and terminology specified under REGIONAL & CURRICULUM CONSTRAINTS."
    ],
    example: '(:route "quiz:mcq" :scratchpad "A metaphor directly asserts that one thing is another without using \'like\' or \'as\'." :prompt "Which literary device directly compares two things by stating one is the other?" :options (list "Metaphor" "Simile" "Alliteration" "Personification") :answer-key 0)'
  },

  computing: {
    category: "Computer Science & IT",
    aliases: ['computing', 'computer-science', 'programming', 'it', 'algorithms', 'binary', 'logic', 'python', 'scratch'],
    archetypes: [
      "Trace code / predict variable state at line N",
      "Identify logical vs syntax errors in pseudocode",
      "Binary / Hex / Logic gate evaluation",
      "Network protocol & cybersecurity diagnostic"
    ],
    specificRules: [
      "Trace intermediate execution states directly in :scratchpad before writing options.",
      "Use language-agnostic pseudocode or standard Python syntax."
    ],
    example: '(:route "quiz:mcq" :scratchpad "Binary 00001010 = 8 + 2 = 10 in denary." :prompt "Convert the 8-bit binary value 00001010 to denary (base 10):" :options (list "10" "12" "6" "20") :answer-key 0)'
  },

  humanities: {
    category: "Humanities & Social Sciences",
    aliases: ['humanities', 'history', 'geography', 'citizenship', 're', 'religious-education', 'economics'],
    archetypes: [
      "Cause and consequence / Impact assessment",
      "Source analysis / Perspective comparison",
      "Chronological turning point / Significance",
      "Key definition applied to a specific historical/geographical case"
    ],
    specificRules: [
      "State the historical, geographical, or cultural fact in :scratchpad first.",
      "Avoid generic trivia dates/places unless assessing causation or significance."
    ],
    example: '(:route "quiz:mcq" :scratchpad "William of Normandy defeated King Harold Godwinson at the Battle of Hastings in 1066." :prompt "Where did the decisive battle between William the Conqueror and King Harold take place in 1066?" :options (list "Battle of Hastings" "Battle of Stamford Bridge" "Battle of Bannockburn" "Battle of Waterloo") :answer-key 0)'
  }
};

const BASE_CORE_RULES = `
CRITICAL INVARIANTS:
1. TOPIC INTEGRITY: You MUST test the specified Topic. Do not drift into unrelated subjects or adjacent units.
2. SCRATCHPAD REASONING: In :scratchpad, write ONLY the factual explanation or mathematical calculation steps (e.g., "35 * 2 = 70 degrees"). NEVER write a question mark (?) in the scratchpad.
3. PROMPT ISOLATION: The :prompt field must contain ONLY the clean question stem. NEVER include choices, option letters (A, B, C, D), or numbers (1), 2)) inside :prompt.
4. OPTION SLOT 0: In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER directly matching the solution in :scratchpad.
5. DISTRACTORS: Items 1, 2, and 3 MUST be plausible distractors matching the exact data type of Item 0. NEVER place an incorrect option in position 0.
6. :answer-key MUST ALWAYS be 0.
7. STRICT MCQ FORMAT: Do NOT include open-ended requests like "Explain your reasoning" or "Show your work".
8. Output ONLY the raw Lisp S-expression. No markdown quotes, backticks, or extra text.
`.trim();

function resolveKeyStageRule(rawKs) {
  if (/1/i.test(rawKs)) return KEY_STAGE_CONSTRAINTS.KS1;
  if (/2/i.test(rawKs)) return KEY_STAGE_CONSTRAINTS.KS2;
  if (/4/i.test(rawKs)) return KEY_STAGE_CONSTRAINTS.KS4;
  return KEY_STAGE_CONSTRAINTS.KS3;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function buildUniversalPrompt(params) {
  const {
    subject = 'Science',
    topic = 'General',
    langName = 'English',
    keyStage = 'KS3',
    subjectId = '',
    topicId = '',
    curriculum = 'uk_oak'
  } = params;

  // Search corpus across subject, subjectId, topic, topicId
  const searchCorpus = `${subjectId} ${subject} ${topicId} ${topic}`.toLowerCase();
  
  const matchedKey = Object.keys(SUBJECT_DEFINITIONS).find(key => {
    if (key === subjectId.toLowerCase() || key === subject.toLowerCase()) return true;
    return SUBJECT_DEFINITIONS[key].aliases.some(alias => searchCorpus.includes(alias));
  }) || 'humanities';

  const subConfig = SUBJECT_DEFINITIONS[matchedKey];
  const focus = pickRandom(subConfig.archetypes);
  const entropy = Math.floor(Math.random() * 100000);
  const ageRule = resolveKeyStageRule(keyStage);
  const regionalRule = REGIONAL_CONSTRAINTS[curriculum] || REGIONAL_CONSTRAINTS.uk_oak;

  return `You are an automated educational assessment ${subConfig.category} question generator for Level ${keyStage}.
[Entropy-Seed: ${entropy}]

Target Subject: ${subject}
Target Topic: ${topic} (TopicId: ${topicId || 'general'})
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

REGIONAL & CURRICULUM CONSTRAINTS:
${regionalRule}

${BASE_CORE_RULES}

SUBJECT SPECIFIC RULES:
${subConfig.specificRules.map(r => `- ${r}`).join('\n')}
- Strictly adhere to Target Reading Level: "${ageRule}".

EXAMPLE:
Output: ${subConfig.example}

Generate ONE question for "${subject} - ${topic}":
Output:`.trim();
}

/**
 * Backward compatibility wrapper for existing callers
 */
export function buildPrompt(userPrompt, langName = 'English', curriculumOverride = null) {
  if (typeof userPrompt === 'object' && userPrompt !== null) {
    return buildUniversalPrompt({
      subject: userPrompt.subject || 'Science',
      topic: userPrompt.unit || userPrompt.topic || 'General',
      keyStage: userPrompt.keyStage || 'KS3',
      subjectId: userPrompt.subjectId || '',
      topicId: userPrompt.unitId || userPrompt.topicId || '',
      langName,
      curriculum: userPrompt.curriculum || curriculumOverride || 'uk_oak'
    });
  }

  // String parsing fallback for legacy string-based callers
  const subjMatch = userPrompt.match(/Subject:\s*"([^"]+)"/i);
  const topicMatch = userPrompt.match(/Topic:\s*"([^"]+)"/i);
  const ksMatch = userPrompt.match(/Key Stage:\s*"([^"]+)"|Key Stage\s*([1-4])/i);
  const subjIdMatch = userPrompt.match(/SubjectId:\s*"([^"]*)"/i);
  const topicIdMatch = userPrompt.match(/TopicId:\s*"([^"]*)"/i);
  const currMatch = userPrompt.match(/Curriculum:\s*"([^"]*)"/i);

  return buildUniversalPrompt({
    subject: subjMatch ? subjMatch[1].trim() : 'Mathematics',
    topic: topicMatch ? topicMatch[1].trim() : 'General',
    keyStage: ksMatch ? (ksMatch[1] || `KS${ksMatch[2]}`) : 'KS3',
    subjectId: subjIdMatch ? subjIdMatch[1].trim() : '',
    topicId: topicIdMatch ? topicIdMatch[1].trim() : '',
    langName,
    curriculum: currMatch ? currMatch[1].trim() : (curriculumOverride || 'uk_oak')
  });
}