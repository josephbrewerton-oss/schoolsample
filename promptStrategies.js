// static/promptStrategies.js

export const KEY_STAGE_CONSTRAINTS = {
  KS1: "Ages 5-7. Simple vocabulary, clear concrete scenarios, short sentences.",
  KS2: "Ages 7-11. Elementary concepts, structured definitions, one-step reasoning.",
  KS3: "Ages 11-14. Foundational secondary concepts, cause-and-effect reasoning.",
  KS4: "Ages 14-16. GCSE standard, precise scientific terminology and quantitative deduction."
};

export const REGIONAL_CONSTRAINTS = {
  uk_oak: "Follow UK National Curriculum Key Stage standard terminology (e.g., maths, practical investigation, SI metric units, £/p).",
  international: "Follow international curriculum standard terminology (globally neutral English, SI metric units ONLY, no regional currencies)."
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
      "Geometric property deduction",
      "Real-world word problem application",
      "Spot the arithmetic or conceptual error"
    ]
  },

  science: {
    category: "Science",
    aliases: [
      'science', 'physics', 'chemistry', 'biology', 'forces', 'magnet', 'electric', 
      'electrolysis', 'photosynthesis', 'plant', 'cell', 'atom', 'chemical', 'energy', 
      'wave', 'ecology', 'acid', 'reaction', 'atomic structure', 'periodic table', 
      'isotope', 'subatomic', 'seasonal changes', 'seasons', 'weather'
    ],
    archetypes: [
      "Core physical or biological property identification",
      "Common misconception trap",
      "Structure and function relationship",
      "Observable environmental pattern deduction"
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
      "Passage device identification",
      "Subtle grammatical error correction",
      "Tone and connotation discrimination",
      "Sentence punctuation application"
    ]
  },

  computing: {
    category: "Computer Science & IT",
    aliases: [
      'computing', 'computer-science', 'programming', 'it', 'algorithms', 
      'binary', 'logic', 'python', 'scratch'
    ],
    archetypes: [
      "Trace code and variable state",
      "Identify logical errors in pseudocode",
      "Binary, hex, and logic gate evaluation",
      "Core computational concept definition"
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
      "Cause and consequence deduction",
      "Source evidence analysis",
      "Chronological milestone identification",
      "Core definition applied to a specific historical case"
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
    ) || 'science';
  }

  const subConfig = SUBJECT_DEFINITIONS[matchedKey] || SUBJECT_DEFINITIONS.science;
  const focus = pickRandom(subConfig.archetypes || ['Core concept mastery']);

  const ageRule = resolveKeyStageRule(keyStage);
  const regionalRule = REGIONAL_CONSTRAINTS[curriculum] || REGIONAL_CONSTRAINTS.uk_oak;

  // Resolve ground truth seed coordinates to supply real curriculum facts
  const seed = resolveSeedCoordinate(`${keyStage}:${cleanSubject}:${cleanTopic}`);

  return `You are an elite school teacher creating an interactive multiple-choice question.
Write an authentic, direct question testing student knowledge of "${topic}".

TOPIC CONTEXT:
- Level: ${keyStage} (${ageRule})
- Core Rule: "${seed.axiom}"
- Common Misconception: "${seed.trap}"
- Regional Style: ${regionalRule}
- Pedagogical Focus: ${focus}

RULES:
1. The :prompt MUST be a real, complete question sentence (e.g. "What happens to most trees in autumn?"). NEVER output phrases like "Clear question stem" or template instructions.
2. Slot 0 in :options MUST be the exact, factually correct answer.
3. Slots 1, 2, and 3 MUST be realistic, plausible wrong answers.
4. Output ONLY the raw Lisp S-expression without Markdown code blocks or preamble.

EXEMPLAR:
(:route "quiz:mcq" :scratchpad "In autumn, daylight hours decrease and deciduous trees shed their leaves." :prompt "Which change is most commonly observed in nature during autumn?" :options (list "Leaves change colour and fall from deciduous trees" "Trees grow new blossoms and fresh green shoots" "Days become significantly longer and temperatures peak" "Animals emerge from winter hibernation to build nests") :hint "Think about what happens to deciduous trees as daylight decreases." :answer-key 0)

Generate S-expression for ${keyStage} ${subject} (${topic}):
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
// 2. LEARNING ZONE SEED REGISTRY & COMPILERS
// ---------------------------------------------------------------------------

export const OAK_SEED_REGISTRY = {
  // === KEY STAGE 1 ===
  'ks1:eng:punctuation': {
    subject: 'English',
    keyStage: 'KS1',
    topic: 'Capital Letters & Full Stops',
    axiom: 'Every sentence begins with a capital letter and ends with a terminal punctuation mark.',
    trap: 'Forgetting capital letters for the personal pronoun "I" and proper nouns.',
    pivot: 'How does a reader know where your first idea ends and the next one starts?'
  },
  'ks1:sci:seasons': {
    subject: 'Science',
    keyStage: 'KS1',
    topic: 'Seasonal Changes',
    axiom: 'Earth experiences four distinct seasons each year (spring, summer, autumn, winter) with changing weather and daylight hours.',
    trap: 'Thinking summer is warmer because the Earth moves closer to the Sun rather than due to daylight hours and sunlight angle.',
    pivot: 'What happens to the temperature and daylight as we move from summer into winter?'
  },
  'ks1:sci:seasonal changes': {
    subject: 'Science',
    keyStage: 'KS1',
    topic: 'Seasonal Changes',
    axiom: 'Earth experiences four distinct seasons each year (spring, summer, autumn, winter) with changing weather and daylight hours.',
    trap: 'Thinking summer is warmer because the Earth moves closer to the Sun rather than due to daylight hours and sunlight angle.',
    pivot: 'What happens to the temperature and daylight as we move from summer into winter?'
  },
  'ks1:sci:plants': {
    subject: 'Science',
    keyStage: 'KS1',
    topic: 'Plants & Seeds',
    axiom: 'Seeds require moisture and warmth to germinate and grow roots before they need sunlight.',
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
    trap: 'Believing moving objects slow down because their internal force runs out.',
    pivot: 'What surface touches the toy car to make it slow down?'
  },
  'ks2:mat:fractions': {
    subject: 'Maths',
    keyStage: 'KS2',
    topic: 'Equivalent Fractions',
    axiom: 'Multiplying or dividing both numerator and denominator by the same non-zero number preserves value.',
    trap: 'Adding the same number to numerator and denominator thinking it keeps equivalence.',
    pivot: 'If you cut a pizza into twice as many slices, do you get more pizza if you take twice as many?'
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

  const matched = Object.keys(OAK_SEED_REGISTRY).find(k => 
    normalizedKey.includes(k) || k.includes(normalizedKey)
  );

  if (matched) return OAK_SEED_REGISTRY[matched];

  // Topic keyword fallback
  if (normalizedKey.includes('season') || normalizedKey.includes('weather')) {
    return OAK_SEED_REGISTRY['ks1:sci:seasons'];
  }
  if (normalizedKey.includes('plant') || normalizedKey.includes('seed')) {
    return OAK_SEED_REGISTRY['ks1:sci:plants'];
  }
  if (normalizedKey.includes('force') || normalizedKey.includes('friction')) {
    return OAK_SEED_REGISTRY['ks2:sci:forces'];
  }
  if (normalizedKey.includes('fraction')) {
    return OAK_SEED_REGISTRY['ks2:mat:fractions'];
  }

  return {
    subject: 'Science',
    keyStage: 'KS3',
    topic: 'Core Concept',
    axiom: 'Foundational scientific principles govern observable patterns and interactions.',
    trap: 'Assuming everyday intuition always matches rigorous scientific mechanisms.',
    pivot: 'What key rule defines how this process operates?'
  };
}

/**
 * Builds an ultra-dense, token-efficient prompt for Prof. Turing
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