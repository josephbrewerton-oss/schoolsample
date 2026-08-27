// static/promptStrategies.js

export const KEY_STAGE_CONSTRAINTS = {
  KS1: "Ages 5-7. Simple vocabulary, clear concrete scenarios.",
  KS2: "Ages 7-11. Elementary concepts, structured definitions.",
  KS3: "Ages 11-14. Foundational secondary concepts, cause-and-effect reasoning.",
  KS4: "Ages 14-16. GCSE standard, precise scientific mechanisms and terminology."
};

export const REGIONAL_CONSTRAINTS = {
  uk_oak: "Follow UK National Curriculum Key Stage standard terminology (e.g., maths, practical investigation, periodic table groups 1 to 0).",
  universal: "Follow international curriculum standard scientific terminology."
};

export function resolveKeyStageRule(keyStage) {
  const ks = String(keyStage || '').toLowerCase();
  if (ks.includes('1') || ks.includes('ks1')) return KEY_STAGE_CONSTRAINTS.KS1;
  if (ks.includes('2') || ks.includes('ks2')) return KEY_STAGE_CONSTRAINTS.KS2;
  if (ks.includes('4') || ks.includes('ks4') || ks.includes('gcse')) return KEY_STAGE_CONSTRAINTS.KS4;
  return KEY_STAGE_CONSTRAINTS.KS3;
}

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
    ]
  },

  science: {
    category: "Science",
    aliases: [
      'science', 'physics', 'chemistry', 'biology', 'forces', 'magnet', 'electric', 
      'electrolysis', 'photosynthesis', 'plant', 'cell', 'atom', 'chemical', 'energy', 
      'wave', 'ecology', 'acid', 'reaction', 'atomic structure', 'periodic table', 
      'isotope', 'subatomic'
    ],
    archetypes: [
      "Calculation / Formula application (e.g. solve for unknown with units)",
      "Practical scenario / Diagnostic error (troubleshoot a lab setup)",
      "Common misconception trap",
      "Structure and function / Subatomic component identification"
    ]
  },

  languages: {
    category: "Languages & Literature",
    aliases: [
      'english', 'english-language', 'english-literature', 'french', 'spanish', 
      'german', 'grammar', 'punctuation', 'spelling', 'metaphor', 'literature', 
      'poem', 'comprehension', 'capital letters', 'full stops'
    ],
    archetypes: [
      "Contextual passage analysis / Device identification",
      "Subtle grammatical error correction",
      "Tone and connotation discrimination",
      "Structural syntax application"
    ]
  },

  computing: {
    category: "Computer Science & IT",
    aliases: [
      'computing', 'computer-science', 'programming', 'it', 'algorithms', 
      'binary', 'logic', 'python', 'scratch'
    ],
    archetypes: [
      "Trace code / predict variable state at line N",
      "Identify logical vs syntax errors in pseudocode",
      "Binary / Hex / Logic gate evaluation",
      "Network protocol & cybersecurity diagnostic"
    ]
  },

  humanities: {
    category: "Humanities & Social Sciences",
    aliases: [
      'humanities', 'history', 'geography', 'citizenship', 're', 
      'religious-education', 'economics', 'egypt', 'pharaohs', 'rome', 'victorian', 
      'ancient', 'living-memory', 'changes within living memory'
    ],
    archetypes: [
      "Cause and consequence / Impact assessment",
      "Source analysis / Perspective comparison",
      "Chronological turning point / Significance",
      "Key definition applied to a specific historical/geographical case"
    ]
  }
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------------------------------------------------------------------------
// 1. PRACTICE LAB COMPILERS (Multiple-Choice Questions)
// ---------------------------------------------------------------------------

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

  const cleanSubject = (subjectId || subject || '').toLowerCase().trim();
  const cleanTopic = (topicId || topic || '').toLowerCase().trim();

  let matchedKey = Object.keys(SUBJECT_DEFINITIONS).find(
    key => key === cleanSubject || SUBJECT_DEFINITIONS[key].aliases.some(alias => alias === cleanSubject || cleanSubject.includes(alias))
  );

  if (!matchedKey) {
    matchedKey = Object.keys(SUBJECT_DEFINITIONS).find(key =>
      SUBJECT_DEFINITIONS[key].aliases.some(alias => alias === cleanTopic)
    ) || 'humanities';
  }

  const subConfig = SUBJECT_DEFINITIONS[matchedKey] || SUBJECT_DEFINITIONS.humanities;
  const focus = pickRandom(subConfig.archetypes || ['core_conceptual_understanding']);

  const ageRule = resolveKeyStageRule(keyStage);
  const regionalRule = REGIONAL_CONSTRAINTS[curriculum] || REGIONAL_CONSTRAINTS.uk_oak;

  return `You are an expert curriculum test compiler.
Output ONLY one valid Lisp S-expression adhering to the exact syntax format shown in the exemplar.

EXEMPLAR:
(:route "quiz:mcq" :scratchpad "In winter, deciduous trees drop their leaves and the weather is typically coldest." :prompt "Which description best characterizes winter weather in the UK?" :options (list "Freezing temperatures and shorter daylight hours" "Warm sunny days with blossoming flowers" "Hot dry afternoons and long evenings" "Humid tropical rainstorms and high heat") :hint "Think about temperature and daylight changes during the coldest season." :answer-key 0)

TASK:
Generate a single multiple-choice question testing:
- Subject: ${subject}
- Topic: ${topic}
- Level: ${keyStage} (${ageRule})
- Focus: ${focus}
- Standard: ${regionalRule}

SYNTAX CONSTRAINTS:
1. :prompt must contain ONLY the isolated question sentence. NEVER include options inside :prompt.
2. :options must contain (list "Option0" "Option1" "Option2" "Option3").
3. All 4 options MUST be distinct, full sentences or phrases, and must NOT repeat or contain syntax artifacts.
4. Slot 0 in (list ...) MUST be the correct ground-truth answer.
5. :answer-key must always be 0.
6. Do not include markdown formatting, backtick codeblocks, or conversational chatter.

Generate S-expression for ${subject} -> ${topic}:
Output:`.trim();
}

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

  const subjMatch = String(userPrompt).match(/Subject:\s*"([^"]+)"/i);
  const topicMatch = String(userPrompt).match(/Topic:\s*"([^"]+)"/i);
  const ksMatch = String(userPrompt).match(/Key Stage:\s*"([^"]+)"|Key Stage\s*([1-4])/i);

  return buildUniversalPrompt({
    subject: subjMatch ? subjMatch[1].trim() : 'Science',
    topic: topicMatch ? topicMatch[1].trim() : 'General',
    keyStage: ksMatch ? (ksMatch[1] || `KS${ksMatch[2]}`) : 'KS3',
    langName,
    curriculum: curriculumOverride || 'uk_oak'
  });
}

// ---------------------------------------------------------------------------
// 2. LEARNING ZONE SEED REGISTRY & COMPILERS (Prof. Turing & Diagnostic AST)
// ---------------------------------------------------------------------------

export const OAK_SEED_REGISTRY = {
  // === KEY STAGE 1 ===
  'ks1:eng:punctuation': {
    subject: 'English',
    keyStage: 'KS1',
    topic: 'Capital Letters & Full Stops',
    axiom: 'Every sentence begins with a capital letter and ends with a terminal punctuation mark (full stop, question mark, or exclamation mark).',
    trap: 'Forgetting capital letters for the personal pronoun "I" and proper nouns (names and places).',
    pivot: 'How does a reader know where your first idea ends and the next one starts?'
  },
  'ks1:sci:plants': {
    subject: 'Science',
    keyStage: 'KS1',
    topic: 'Plants & Seeds',
    axiom: 'Seeds require moisture and warmth to sprout roots and shoots before they ever need sunlight.',
    trap: 'Thinking buried seeds need direct sunlight underground to germinate.',
    pivot: 'What condition does a buried seed actually experience in the dark soil?'
  },
  'ks1:mat:addition': {
    subject: 'Maths',
    keyStage: 'KS1',
    topic: 'Addition within 20',
    axiom: 'Addition is commutative; counting on from the larger number minimizes calculation steps.',
    trap: 'Recounting the first group from one instead of starting from the known total.',
    pivot: 'If you already have 8 blocks, why recount them from 1 when adding 3?'
  },

  // === KEY STAGE 2 ===
  'ks2:sci:forces': {
    subject: 'Science',
    keyStage: 'KS2',
    topic: 'Forces & Friction',
    axiom: 'Friction is a contact force that acts in the opposite direction to relative movement.',
    trap: 'Believing moving objects slow down because their internal "force" runs out.',
    pivot: 'What surface touches the toy car to make it slow down?'
  },
  'ks2:mat:fractions': {
    subject: 'Maths',
    keyStage: 'KS2',
    topic: 'Equivalent Fractions',
    axiom: 'Multiplying or dividing both numerator and denominator by the same non-zero number preserves value.',
    trap: 'Adding the same number to numerator and denominator thinking it keeps equivalence (e.g., 1/2 = 2/3).',
    pivot: 'If you cut a pizza into twice as many slices, do you get more total pizza if you take twice as many?'
  },

  // === KEY STAGE 3 ===
  'ks3:sci:atomic': {
    subject: 'Science',
    keyStage: 'KS3',
    topic: 'Atomic Structure',
    axiom: 'Protons and neutrons form the central dense nucleus; electrons orbit in discrete outer shells.',
    trap: 'Thinking atomic mass is evenly distributed across the entire volume of the atom.',
    pivot: 'Where is nearly all of an atom\'s mass concentrated?'
  },
  'ks3:com:algorithms': {
    subject: 'Computing',
    keyStage: 'KS3',
    topic: 'Computational Thinking',
    axiom: 'Decomposition breaks complex problems into smaller sub-problems; abstraction removes unnecessary details.',
    trap: 'Attempting to write implementation code before determining the algorithmic steps.',
    pivot: 'What details can we ignore right now to see the core pattern?'
  },

  // === KEY STAGE 4 (GCSE) ===
  'ks4:sci:bonding': {
    subject: 'Science',
    keyStage: 'KS4',
    topic: 'Ionic & Covalent Bonding',
    axiom: 'Ionic bonding involves electrostatic attraction between oppositely charged ions; covalent bonding involves shared electron pairs.',
    trap: 'Assuming covalent molecules conduct electricity because they have strong intramolecular bonds.',
    pivot: 'Are there any free delocalised electrons or mobile ions available to carry charge?'
  }
};

/**
 * Resolves an active seed object by key or fuzzy match.
 */
export function resolveSeedCoordinate(seedKey) {
  const normalizedKey = String(seedKey || '').toLowerCase().trim();
  if (OAK_SEED_REGISTRY[normalizedKey]) {
    return OAK_SEED_REGISTRY[normalizedKey];
  }

  // Fallback fuzzy search across keys
  const matched = Object.keys(OAK_SEED_REGISTRY).find(k => 
    normalizedKey.includes(k) || k.includes(normalizedKey)
  );

  return matched ? OAK_SEED_REGISTRY[matched] : OAK_SEED_REGISTRY['ks3:sci:atomic'];
}

/**
 * Builds an ultra-dense, token-efficient prompt for Prof. Turing
 * using exact Oak curriculum seed coordinates.
 */
export function buildSocraticSeedPrompt(seedKey, pupilMessage = '') {
  const seed = resolveSeedCoordinate(seedKey);

  return `[SEED: ${seedKey}]
[SUBJECT: ${seed.subject} | ${seed.keyStage}]
[CORE_AXIOM: ${seed.axiom}]
[COGNITIVE_TRAP: ${seed.trap}]
[PIVOT_QUESTION: ${seed.pivot}]
Pupil: "${pupilMessage || 'I need help understanding this topic.'}"
Prof. Turing (1 short Socratic question only):`.trim();
}

/**
 * Builds an AST Lesson Node compiler prompt for the Learning Zone diagnostic cards.
 */
export function buildLessonNodePrompt(seedKey) {
  const seed = resolveSeedCoordinate(seedKey);

  return `You are an Oak Curriculum AST compiler.
Complete the Lisp S-expression using these exact concepts:
Axiom: ${seed.axiom}
Trap: ${seed.trap}
Pivot: ${seed.pivot}

Output format:
(:route "lesson:view" :axiom "${seed.axiom}" :trap "${seed.trap}" :pivot "${seed.pivot}")
Output:`.trim();
}