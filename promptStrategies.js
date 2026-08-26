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

export const AST_TEMPLATES = {
  mcq: {
    prefix: '(:route "quiz:mcq" :scratchpad "',
    promptStructure: `Complete the following S-expression. Fill in ONLY the values for :scratchpad, :prompt, :options, and :hint.

Template to complete:
(:route "quiz:mcq" :scratchpad "<STEP_BY_STEP_FACT>" :prompt "<QUESTION_STEM>" :options (list "<CORRECT_ANSWER>" "<DISTRACTOR_1>" "<DISTRACTOR_2>" "<DISTRACTOR_3>") :hint "<SOCRATIC_HINT>" :answer-key 0)

Begin immediately with the scratchpad text:`
  }
};

const QUESTION_FRAME_ROUTING = {
  maths: [
    { stem: 'Calculate / Evaluate', pattern: 'Direct computation' },
    { stem: 'Geometric Deduction', pattern: 'Theorem application' },
    { stem: 'Inverse Formulation', pattern: 'Working backwards' },
    { stem: 'Identify Property', pattern: 'Direct rule check' }
  ],
  science: [
    { stem: 'Causal Mechanism (Why/How)', pattern: 'Explain phenomenon' },
    { stem: 'Predict the Outcome', pattern: 'Scenario intervention' },
    { stem: 'Identify Component', pattern: 'Structure or law definition' },
    { stem: 'Quantitative Relation', pattern: 'Formula application' }
  ],
  languages: [
    { stem: 'Identify Device / Technique', pattern: 'Device recognition' },
    { stem: 'Punctuation & Grammar Correction', pattern: 'Syntax rule check' },
    { stem: 'Tone & Connotation', pattern: 'Semantic inference' }
  ],
  computing: [
    { stem: 'Trace / State Value', pattern: 'Code tracing' },
    { stem: 'Binary / Denary Conversion', pattern: 'Data representation evaluation' },
    { stem: 'Identify Error / Protocol', pattern: 'Diagnostic evaluation' }
  ],
  humanities: [
    { stem: 'Causal Significance', pattern: 'Cause and effect' },
    { stem: 'Historical / Geographical Identification', pattern: 'Direct fact check' },
    { stem: 'Source & Perspective Evaluation', pattern: 'Significance assessment' }
  ]
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
      'poem', 'comprehension'
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
  const entropy = Math.floor(Math.random() * 100000);

  const ageRule = resolveKeyStageRule(keyStage);
  const regionalRule = REGIONAL_CONSTRAINTS[curriculum] || REGIONAL_CONSTRAINTS.uk_oak;

  return `You are an expert curriculum test compiler.
Output ONLY one valid Lisp S-expression adhering to the exact syntax format shown in the exemplar.

EXEMPLAR:
(:route "quiz:mcq" :scratchpad "Speech marks must enclose the words actually spoken, with punctuation placed before the closing quotation mark." :prompt "Which sentence correctly punctuates the direct speech?" :options (list "\\"I am going home,\\" said Tom." "\\"I am going home\\" said Tom." "\\"I am going home said Tom.\\"" "I am going home, said Tom.") :hint "Remember that spoken words must be enclosed inside quotation marks with a comma inside." :answer-key 0)

TASK:
Generate a single multiple-choice question testing:
- Subject: ${subject}
- Topic: ${topic}
- Level: ${keyStage} (${ageRule})
- Focus: ${focus}
- Standard: ${regionalRule}

SYNTAX CONSTRAINTS:
1. :prompt must contain ONLY the isolated question sentence. NEVER put option letters (like A, B, C, D) or choices inside :prompt.
2. :options must contain (list "Option0" "Option1" "Option2" "Option3").
3. Slot 0 in (list ...) MUST be the correct ground-truth answer.
4. :answer-key must always be 0.
5. Do not include markdown codeblocks or conversational preamble.

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