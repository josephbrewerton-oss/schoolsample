// static/promptStrategies.js

const KEY_STAGE_CONSTRAINTS = {
  KS1: "Ages 5-7 (Primary). Short simple sentences, everyday words, basic concrete items (e.g. apples, coins). No technical jargon.",
  KS2: "Ages 7-11 (Middle Primary). Simple sentence structures, foundational subject terms. One-step reasoning or simple arithmetic only.",
  KS3: "Ages 11-14 (Lower Secondary). Core foundational concepts only. DO NOT use advanced GCSE/A-Level concepts (e.g. no photons, quantum transitions, moles, or advanced kinematics). Use electron shells/energy levels, not quantum orbits.",
  KS4: "Ages 14-16 (Upper Secondary / GCSE standard). Rigorous terminology, quantitative relations, multi-step calculations with standard units, subtle distractor traps."
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
    { stem: 'Calculate / Evaluate', pattern: 'Direct computation (e.g., "Calculate the value of...", "Determine the size of angle...")' },
    { stem: 'Geometric Deduction', pattern: 'Theorem application (e.g., "Given circle with arc X, what is angle Y?")' },
    { stem: 'Inverse Formulation', pattern: 'Working backwards (e.g., "If the total area of a sector is X, find the radius...")' },
    { stem: 'Identify Property', pattern: 'Direct rule check (e.g., "Which geometric theorem describes...")' }
  ],
  science: [
    { stem: 'Causal Mechanism (Why/How)', pattern: 'Explain phenomenon (e.g., "Why does...", "How does structure X enable function Y?")' },
    { stem: 'Predict the Outcome (What happens)', pattern: 'Scenario intervention (e.g., "What happens to the rate of reaction if temperature increases?")' },
    { stem: 'Identify Component (Which)', pattern: 'Structure or law definition (e.g., "Which organelle is responsible for...", "Which force acts...")' },
    { stem: 'Quantitative Relation', pattern: 'Formula application (e.g., "Calculate the energy transferred when...")' }
  ],
  languages: [
    { stem: 'Identify Device / Technique', pattern: 'Device recognition (e.g., "Which literary technique is used in the phrase...")' },
    { stem: 'Punctuation & Grammar Correction', pattern: 'Syntax rule check (e.g., "Which sentence correctly places the subordinate clause?")' },
    { stem: 'Tone & Connotation', pattern: 'Semantic inference (e.g., "What emotion does the author evoke by choosing the word...")' }
  ],
  computing: [
    { stem: 'Trace / State Value', pattern: 'Code tracing (e.g., "What is the final value of variable X after loop termination?")' },
    { stem: 'Binary / Denary Conversion', pattern: 'Data representation evaluation (e.g., "Convert binary value X to denary:")' },
    { stem: 'Identify Error / Protocol', pattern: 'Diagnostic evaluation (e.g., "Which network layer is responsible for...")' }
  ],
  humanities: [
    { stem: 'Causal Significance (Why)', pattern: 'Cause and effect (e.g., "Why did event X lead to consequence Y?")' },
    { stem: 'Historical / Geographical Identification', pattern: 'Direct fact check (e.g., "Which treaty concluded...", "What type of plate boundary...")' },
    { stem: 'Source & Perspective Evaluation', pattern: 'Significance assessment (e.g., "What was the primary impact of law X on society?")' }
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
    ],
    specificRules: [
      "TOPIC FIDELITY: Strictly generate a question testing the exact Topic specified.",
      "Compute the exact numeric or geometric step-by-step solution in :scratchpad first.",
      "Distractors (Items 1, 2, 3) must represent common student mathematical misconceptions.",
      "SYLLABUS BOUNDARY: Use standard school units and degrees (0°-360°).",
      "DISTRACTOR DIVERSITY: All 4 options in :options (list ...) MUST be distinctly different numbers or expressions."
    ],
    example: '(:route "quiz:mcq" :scratchpad "Angle subtended at center is twice angle at circumference. 35 * 2 = 70 degrees." :prompt "An angle subtended at the circumference of a circle is 35°. What is the angle subtended by the same arc at the center?" :options (list "70°" "35°" "17.5°" "140°") :hint "Recall the relationship between the angle at the center and the angle at the circumference for the same arc." :answer-key 0)'
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
    ],
    specificRules: [
      "SYLLABUS CEILING: Strictly adapt to Key Stage level. For KS3: stick to basic atomic structure (protons, neutrons, electrons in shells 2,8,8), periodic table groups/periods, and simple conservation of mass. Never introduce photons, excitation, or quantum mechanics at KS3.",
      "ATOMIC STRUCTURE CONSTRAINTS: Protons (+1, mass 1), Neutrons (neutral, mass 1), Electrons (-1, negligible mass). Use the term 'shells' or 'energy levels', never classical 'planetary orbits'.",
      "CHEMISTRY EQUATIONS: If balancing equations or writing reactions, use valid chemical formulas without changing subscripts.",
      "TOPIC GROUNDING: Strictly test the chosen topic."
    ],
    example: '(:route "quiz:mcq" :scratchpad "Enzymes denature at high temperatures because heat alters their active site shape." :prompt "What happens to enzyme activity when temperature rises significantly above the optimum level?" :options (list "The enzyme denatures and activity drops" "Activity increases exponentially" "The enzyme creates more substrates" "The reaction rate remains constant") :hint "Think about how extreme heat changes the structural shape of the active site." :answer-key 0)'
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
    ],
    specificRules: [
      "Write the correct grammatical, literary, or punctuation rule clearly in :scratchpad first.",
      "Follow regional dialect and terminology specified under REGIONAL & CURRICULUM CONSTRAINTS."
    ],
  example: `(:route "quiz:mcq" :scratchpad "A metaphor asserts that one thing is another without using 'like' or 'as'." :prompt "Which literary device directly asserts that one thing is another rather than using comparative words like 'as'?" :options (list "Metaphor" "Simile" "Personification" "Alliteration") :hint "Consider which device equates two concepts directly without using 'like' or 'as'." :answer-key 0)`
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
    ],
    specificRules: [
      "Trace intermediate execution states directly in :scratchpad before writing options.",
      "Use language-agnostic pseudocode or standard Python syntax."
    ],
    example: '(:route "quiz:mcq" :scratchpad "Binary 00001010 = 8 + 2 = 10 in denary." :prompt "Convert the 8-bit binary value 00001010 to denary (base 10):" :options (list "10" "12" "6" "20") :hint "Add together the place values for the bit positions containing a 1." :answer-key 0)'
  },

  humanities: {
    category: "Humanities & Social Sciences",
    aliases: [
      'humanities', 'history', 'geography', 'citizenship', 're', 
      'religious-education', 'economics', 'egypt', 'pharaohs', 'rome', 'victorian', 
      'ancient'
    ],
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
    example: '(:route "quiz:mcq" :scratchpad "The Nile flooded annually, depositing rich silt that enabled agriculture in Ancient Egypt." :prompt "Why was the annual flooding of the River Nile essential for the Ancient Egyptian civilization?" :options (list "It deposited fertile black silt for agriculture" "It prevented trade ships from entering" "It formed deep gold mines" "It stopped pyramids from sinking") :hint "Think about how river sediment acted as natural fertilizer for crops." :answer-key 0)'
  }
};

const BASE_CORE_RULES = `
CRITICAL INVARIANTS:
1. TOPIC INTEGRITY: You MUST test the specified Topic. Do NOT switch to an unrelated subject.
2. SCRATCHPAD REASONING: In :scratchpad, calculate or state the exact rule/fact step-by-step.
3. PROMPT ISOLATION: The :prompt field must contain ONLY clean text inside double quotes. Never use unescaped parentheses inside the prompt string.
4. OPTION SLOT 0: In :options (list ...), ITEM 0 MUST BE THE EXACT CORRECT ANSWER.
5. DISTRACTORS: Items 1, 2, and 3 MUST be plausible distractors matching the exact data type of Item 0.
6. SOCRATIC HINT: In :hint, write a concise, one-sentence conceptual clue that guides a confused student without revealing the answer.
7. :answer-key MUST ALWAYS be 0.
8. Output ONLY the raw Lisp S-expression.

OUTPUT SCHEMA:
(:route "quiz:mcq" :scratchpad "<FACT_OR_STEPS>" :prompt "<QUESTION_STEM>" :options (list "<CORRECT>" "<DISTRACTOR_1>" "<DISTRACTOR_2>" "<DISTRACTOR_3>") :hint "<SOCRATIC_CLUE>" :answer-key 0)
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

  const searchCorpus = `${subjectId} ${subject} ${topicId} ${topic}`.toLowerCase();
  
  const matchedKey = Object.keys(SUBJECT_DEFINITIONS).find(key => {
    if (key === subjectId.toLowerCase() || key === subject.toLowerCase()) return true;
    return SUBJECT_DEFINITIONS[key].aliases.some(alias => searchCorpus.includes(alias));
  }) || 'humanities';

  const subConfig = SUBJECT_DEFINITIONS[matchedKey];
  const focus = pickRandom(subConfig.archetypes);
  
  const frameList = QUESTION_FRAME_ROUTING[matchedKey] || QUESTION_FRAME_ROUTING.humanities;
  const entropy = Math.floor(Math.random() * 100000);
  const selectedFrame = frameList[entropy % frameList.length];

  const ageRule = resolveKeyStageRule(keyStage);
  const regionalRule = REGIONAL_CONSTRAINTS[curriculum] || REGIONAL_CONSTRAINTS.uk_oak;

  return `You are an automated educational assessment ${subConfig.category} question generator for Level ${keyStage}.
[Entropy-Seed: ${entropy}]

Target Subject: ${subject}
Target Topic: ${topic} (TopicId: ${topicId || 'general'})
Question Construction Route: ${selectedFrame.stem}
Question Style Requirement: ${selectedFrame.pattern}
Pedagogical Focus: ${focus}
Language: ${langName}
Target Reading Level & Tone: ${ageRule}

REGIONAL & CURRICULUM CONSTRAINTS:
${regionalRule}

${BASE_CORE_RULES}

SUBJECT SPECIFIC RULES:
${subConfig.specificRules.map(r => `- ${r}`).join('\n')}
- Strictly adhere to Target Reading Level: "${ageRule}".

DOMAIN GOLD-STANDARD EXAMPLE FOR ${subConfig.category.toUpperCase()}:
Output: ${subConfig.example}

Generate ONE unique question strictly testing "${subject} - ${topic}":
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