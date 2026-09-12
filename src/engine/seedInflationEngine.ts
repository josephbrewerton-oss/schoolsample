// src/engine/seedInflationEngine.ts
/**
 * St Joseph's Curriculum Portal — AST Seed & Inflation Engine
 *
 * Designed specifically for developing nations, low-bandwidth, and offline-first
 * environments (refugee camps, rural schools, micro-solar classrooms).
 *
 * Core Concept:
 * Rather than transmitting 50MB+ streaming video or heavy raster graphics,
 * we store and transmit ultra-compressed Lisp S-Expression AST "Knowledge Seeds"
 * (200 - 450 bytes).
 *
 * On-Device Gemini Nano / Local Procedural Engine acts as the ribosome:
 * inflating the tiny seed into rich interactive lessons, procedural SVG visualizers,
 * diagnostic misconception profiling, and infinite practice variants with ZERO network usage.
 */

export interface MisconceptionProfile {
  id: string;
  name: string;
  trigger: string;
  diagnosticExplanation: string;
  mentalMirror: {
    flawedModel: string;
    scientificReality: string;
    visualDifference: string;
  };
}

export interface ProceduralQuestionVariant {
  id: string;
  prompt: string;
  options: string[];
  answerKey: number;
  hint: string;
  explanation: string;
  misconceptionMap: Record<number, string>;
}

export interface ASTKnowledgeSeed {
  id: string;
  keyStage: string;
  subject: string;
  topic: string;
  rawAST: string;
  coreAxiom: string;
  cognitiveTrap: string;
  socraticPivot: string;
  cpaType:
    | 'fractions'
    | 'balance-scale'
    | 'circuits'
    | 'atomic'
    | 'photosynthesis'
    | 'place-value'
    | 'ratio-bar'
    | 'number-line'
    | 'force-vectors'
    | 'chemical-balance';
  misconceptions: MisconceptionProfile[];
  generateQuestions: (seedVariant: number) => ProceduralQuestionVariant[];
  realWorldAnalogies: {
    universal: string;
    developingNationContext: string;
  };
}

export interface InflationTelemetry {
  seedSizeBytes: number;
  traditionalPayloadBytes: number; // e.g. 52,428,800 bytes for 50MB video + images
  compressionRatio: string;        // e.g. "154,200 : 1"
  dataSavedPercentage: string;    // "99.999%"
  networkEgressBytes: number;     // 0 bytes
  cellularCostUSD: string;        // "$0.00" (vs ~$0.75 for 50MB on prepaid 3G)
  offlineStatus: '100% On-Device RAM' | 'IndexedDB Cached';
  generationDurationMs: number;
}

export interface InflatedLessonExperience {
  seed: ASTKnowledgeSeed;
  telemetry: InflationTelemetry;
  narrative: {
    hook: string;
    axiomExploration: string;
    analogy: string;
    guidedStep: string;
    socraticCheck: string;
  };
  activeManipulative: {
    cpaType: ASTKnowledgeSeed['cpaType'];
    title: string;
    description: string;
  };
  questions: ProceduralQuestionVariant[];
}

/**
 * Registry of Compressed AST Knowledge Seeds (Key Stages 1 - 4)
 * Each seed is mathematically dense and under 450 bytes in raw representation.
 */
export const COMPRESSED_KNOWLEDGE_SEEDS: Record<string, ASTKnowledgeSeed> = {
  'ks2:maths:fractions': {
    id: 'ks2:maths:fractions',
    keyStage: 'Key Stage 2',
    subject: 'Mathematics',
    topic: 'Fractions: Addition & Unequal Denominators',
    rawAST: `(:seed :id "ks2:mat:frac-add" :ks "ks2" :sub "maths"
  :axiom "Denominators quantify partition size; equalise common partitions before summing numerators."
  :trap "Direct denominator addition: a/b + c/d = (a+c)/(b+d)"
  :cpa :fractions
  :misconceptions (
    (:id "direct-sum" :name "The Direct Adder" :trap "1/3 + 1/4 = 2/7")
    (:id "scale-forget" :name "Incomplete Multiplier" :trap "Scaling denominator without numerator")
    (:id "bigger-is-larger" :name "Whole Number Bias" :trap "Assuming 1/8 > 1/4 because 8 > 4")
  ))`,
    coreAxiom: 'Denominators represent the size of the partition, not a count of items. Unlike multiplication, addition requires identical partition sizes before numerators can be accumulated.',
    cognitiveTrap: 'Adding numerators and denominators straight across (e.g. 1/3 + 1/4 = 2/7), which creates a result smaller than the starting fraction.',
    socraticPivot: 'If you have 1 slice of a 3-slice loaf and 1 slice of a 4-slice loaf, do your slices combine into 7ths?',
    cpaType: 'fractions',
    realWorldAnalogies: {
      universal: 'Think of measuring lengths with centimeters and inches: you cannot say 1cm + 1 inch = 2 "lengths" without converting to a common unit first.',
      developingNationContext: 'If two market stalls measure grain with different basket sizes (a 3-cup basket and a 4-cup basket), you cannot simply add basket counts together without pouring into a standard measuring bowl (12ths).',
    },
    misconceptions: [
      {
        id: 'direct-sum',
        name: 'The Direct Denominator Sum',
        trigger: 'Entering (a+c)/(b+d), e.g. 1/3 + 1/4 = 2/7',
        diagnosticExplanation: 'You added the numbers on top and bottom straight across. That treats the denominator as an object to count rather than the slice size. 2/7 is actually smaller than 1/3 alone!',
        mentalMirror: {
          flawedModel: '2/7 of a whole (0.285) — Smaller than what you started with!',
          scientificReality: '7/12 of a whole (0.583) — Correct combined volume.',
          visualDifference: 'Adding 1/4 to 1/3 must increase the volume, not decrease it.',
        },
      },
      {
        id: 'scale-forget',
        name: 'Incomplete Multiplier',
        trigger: 'Multiplying the denominator by 4 without multiplying the numerator',
        diagnosticExplanation: 'When converting 1/3 to 12ths, both the top and bottom must be multiplied by 4. If you only multiply the bottom, you just made the slice 4 times smaller without taking 4 slices!',
        mentalMirror: {
          flawedModel: '1/12 — You changed the slice size without taking more slices.',
          scientificReality: '4/12 — The slice size is smaller, but you have 4 slices to match.',
          visualDifference: 'Preserving total mass requires multiplying numerator and denominator equally.',
        },
      },
      {
        id: 'bigger-is-larger',
        name: 'Whole Number Denominator Bias',
        trigger: 'Believing 1/8 is larger than 1/4 because 8 is larger than 4',
        diagnosticExplanation: 'In whole numbers, 8 > 4. But in fractions, the denominator is the division count. Sharing a cake among 8 children gives each child a smaller slice than sharing among 4!',
        mentalMirror: {
          flawedModel: '1/8 assumed larger because 8 > 4.',
          scientificReality: '1/4 is twice as large as 1/8.',
          visualDifference: 'More shares mean smaller individual pieces.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      const pairs = [
        { a: 1, b: 3, c: 1, d: 4, sumNum: 7, sumDen: 12, wrongDirect: '2/7', wrongScale: '2/12', wrongInv: '7/1' },
        { a: 1, b: 2, c: 1, d: 3, sumNum: 5, sumDen: 6, wrongDirect: '2/5', wrongScale: '2/6', wrongInv: '6/5' },
        { a: 2, b: 5, c: 1, d: 10, sumNum: 5, sumDen: 10, wrongDirect: '3/15', wrongScale: '3/10', wrongInv: '15/3' },
        { a: 1, b: 4, c: 2, d: 3, sumNum: 11, sumDen: 12, wrongDirect: '3/7', wrongScale: '3/12', wrongInv: '12/11' },
      ];
      const p = pairs[seedVariant % pairs.length];
      return [
        {
          id: `frac-p1-${seedVariant}`,
          prompt: `Calculate: ${p.a}/${p.b} + ${p.c}/${p.d} = ?`,
          options: [
            `${p.sumNum}/${p.sumDen}`,
            p.wrongDirect,
            p.wrongScale,
            p.wrongInv,
          ],
          answerKey: 0,
          hint: `Find a common denominator for ${p.b} and ${p.d} before adding the numerators.`,
          explanation: `Convert both to ${p.sumDen}ths: (${p.a}×${p.sumDen / p.b})/${p.sumDen} + (${p.c}×${p.sumDen / p.d})/${p.sumDen} = ${p.sumNum}/${p.sumDen}.`,
          misconceptionMap: {
            1: 'Direct Denominator Adder Trap: Adding denominators directly gives less than you started with!',
            2: 'Incomplete Multiplier Trap: Numerators were not scaled along with the denominators.',
            3: 'Inversion Trap: Inverted the fraction ratio.',
          },
        },
      ];
    },
  },

  'ks2:science:circuits': {
    id: 'ks2:science:circuits',
    keyStage: 'Key Stage 2',
    subject: 'Science',
    topic: 'Electric Circuits & Loop Continuity',
    rawAST: `(:seed :id "ks2:sci:circuits" :ks "ks2" :sub "science"
  :axiom "Electric current requires an unbroken conductive loop from and back to the power source."
  :trap "Clashing currents or sink model (electricity stored in wires and used up)."
  :cpa :circuits
  :misconceptions (
    (:id "clashing" :name "Clashing Currents Model" :trap "Current flows from both terminals to meet at bulb")
    (:id "sink" :name "Consumer Sink Fallacy" :trap "Current decreases after each consecutive bulb")
  ))`,
    coreAxiom: 'Electric current is the continuous drift of charge through a closed loop. Current is not consumed like fuel; electrical potential energy is transformed while the charge count remains conserved everywhere in the loop.',
    cognitiveTrap: 'Believing electricity flows outward from both ends of the cell to "clash" at the lamp, or that a bulb "consumes" the electricity so that less returns to the cell.',
    socraticPivot: 'If electric current was used up like fuel, why is the current leaving a bulb identical to the current entering it?',
    cpaType: 'circuits',
    realWorldAnalogies: {
      universal: 'Think of a bicycle chain: pedaling moves the chain, but no links disappear when turning the wheel. The chain must be a continuous loop to work.',
      developingNationContext: 'Like a hand-pump water circuit in an irrigation ring: water flows through the channels to turn a small paddle, but water is not destroyed—it flows continuously around the loop.',
    },
    misconceptions: [
      {
        id: 'clashing',
        name: 'Clashing Currents Model',
        trigger: 'Believing current travels from both positive and negative terminals to collide inside the bulb',
        diagnosticExplanation: 'Current does not collide from both ends. Charges already exist throughout every millimeter of the wire; the battery acts as a pump providing electromotive pressure across the entire closed loop.',
        mentalMirror: {
          flawedModel: 'Two separate flows crashing into each other at the component.',
          scientificReality: 'A continuous circular conveyer belt moving uniformly.',
          visualDifference: 'Breaking any part of the loop stops movement everywhere instantaneously.',
        },
      },
      {
        id: 'sink',
        name: 'The "Consumed Electricity" Fallacy',
        trigger: 'Believing the second bulb in a series circuit receives less current than the first',
        diagnosticExplanation: 'Bulbs do not consume the electrons; they dissipate electrical potential energy into heat and light. In a series loop, the exact same current (Amperes) passes through every component.',
        mentalMirror: {
          flawedModel: 'Bulb 1 drinks 50% of the electrons, leaving less for Bulb 2.',
          scientificReality: 'Equal electron flow through both; energy shared equally.',
          visualDifference: 'An ammeter placed before Bulb 1 and after Bulb 2 reads the exact same value.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      return [
        {
          id: `circ-q1-${seedVariant}`,
          prompt: 'In a simple series circuit with one cell and two identical lamps, how does the current before the first lamp compare to the current after the second lamp?',
          options: [
            'It is identical at all points around the loop.',
            'It is much higher before the first lamp because the lamps consume electrons.',
            'It is zero because the currents clashed inside the lamps.',
            'It depends on which direction the cell was turned.',
          ],
          answerKey: 0,
          hint: 'Remember the bicycle chain analogy: do chain links disappear after passing the rear cog?',
          explanation: 'Electric current is conserved in a closed series loop. Energy is transferred, but charge is never created or destroyed.',
          misconceptionMap: {
            1: 'Consumer Sink Fallacy: Bulbs transfer energy, they do not consume the moving electrons.',
            2: 'Clashing Currents Trap: Current is a continuous loop, not two colliding streams.',
            3: 'Orientation Bias: Current direction changes sign, but loop continuity principle remains universal.',
          },
        },
      ];
    },
  },

  'ks3:maths:equations': {
    id: 'ks3:maths:equations',
    keyStage: 'Key Stage 3',
    subject: 'Mathematics',
    topic: 'Linear Equations & Balance Operations',
    rawAST: `(:seed :id "ks3:mat:equations" :ks "ks3" :sub "maths"
  :axiom "An algebraic equation represents a balanced equality; identical inverse operations maintain equilibrium."
  :trap "Sign shifting without balance or operating on one side only."
  :cpa :balance-scale
  :misconceptions (
    (:id "sign-move" :name "Magical Sign Transposition" :trap "Moving a term across = changes sign without understanding subtraction")
    (:id "one-sided" :name "One-Sided Operation" :trap "Dividing 3x by 3 but forgetting to divide the constant on the RHS")
  ))`,
    coreAxiom: 'The equals sign (=) is not an instruction to calculate; it is a relational balance beam. Whatever transformation is applied to one side of the relation must be applied identically to the other to preserve the invariant equality.',
    cognitiveTrap: 'Believing numbers "jump over the equals sign and magically invert", leading to operating on only one side or botching order of inverse operations.',
    socraticPivot: 'If a weighing scale has equal weight on both pans, what happens to the balance if you remove 5kg from only the left pan?',
    cpaType: 'balance-scale',
    realWorldAnalogies: {
      universal: 'A physical mechanical balance scale: adding or removing weight on one pan requires the exact same adjustment on the opposing pan to keep the beam level.',
      developingNationContext: 'Traditional balance scales used in village grain markets: brass weights on one side must exactly counter-balance grain bundles on the other.',
    },
    misconceptions: [
      {
        id: 'sign-move',
        name: 'Magical Transposition Illusion',
        trigger: 'Saying "+5 moves over and turns into -5"',
        diagnosticExplanation: 'Numbers do not move themselves across symbols. We are performing the inverse operation (subtracting 5) to both sides of the balance equation to isolate the variable.',
        mentalMirror: {
          flawedModel: 'Terms jump across the border and magically switch signs.',
          scientificReality: 'Subtracting 5 from LHS leaves 3x; subtracting 5 from RHS leaves 15.',
          visualDifference: 'Preserves the mathematical logic behind inverse operations.',
        },
      },
      {
        id: 'one-sided',
        name: 'One-Sided Operation',
        trigger: 'In 2x + 4 = 10, dividing by 2 to get x + 4 = 5',
        diagnosticExplanation: 'When dividing by 2, every single term on both sides must be divided: 2x/2 + 4/2 = 10/2, giving x + 2 = 5.',
        mentalMirror: {
          flawedModel: 'Dividing only the variable coefficient and the RHS answer.',
          scientificReality: 'Distributive division applies to every term on both sides.',
          visualDifference: 'Failing to divide the +4 creates an unbalanced equation.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      const eqSets = [
        { a: 3, b: 5, c: 20, ans: 5, wrongAdd: 8.33, wrongOneSide: 15, wrongDivFirst: 6 },
        { a: 2, b: 7, c: 19, ans: 6, wrongAdd: 13, wrongOneSide: 12, wrongDivFirst: 8 },
        { a: 4, b: 8, c: 24, ans: 4, wrongAdd: 8, wrongOneSide: 16, wrongDivFirst: 5 },
      ];
      const eq = eqSets[seedVariant % eqSets.length];
      return [
        {
          id: `eq-q1-${seedVariant}`,
          prompt: `Solve for x: ${eq.a}x + ${eq.b} = ${eq.c}`,
          options: [
            `x = ${eq.ans}`,
            `x = ${eq.wrongOneSide}`,
            `x = ${eq.wrongAdd}`,
            `x = ${eq.wrongDivFirst}`,
          ],
          answerKey: 0,
          hint: `First subtract ${eq.b} from both sides to isolate the ${eq.a}x term on the balance scale.`,
          explanation: `Step 1: Subtract ${eq.b} from both sides: ${eq.a}x = ${eq.c - eq.b}. Step 2: Divide both sides by ${eq.a}: x = ${eq.ans}.`,
          misconceptionMap: {
            1: `One-Sided Operation: Subtracted ${eq.b} but forgot to divide by ${eq.a}.`,
            2: `Wrong Inverse: Added ${eq.b} instead of subtracting it from both sides.`,
            3: `Order of Operations Error: Divided before subtracting the constant term.`,
          },
        },
      ];
    },
  },

  'ks3:science:atomic': {
    id: 'ks3:science:atomic',
    keyStage: 'Key Stage 3',
    subject: 'Science',
    topic: 'Atomic Structure & Subatomic Distribution',
    rawAST: `(:seed :id "ks3:sci:atomic" :ks "ks3" :sub "science"
  :axiom "Mass is 99.9% concentrated in the dense nucleus (protons+neutrons); electrons occupy discrete orbital energy shells."
  :trap "Assuming mass is evenly distributed across atomic volume or electrons have significant mass."
  :cpa :atomic
  :misconceptions (
    (:id "plum-pudding" :name "Uniform Density Illusion" :trap "Believing an atom is solid throughout like a marble")
    (:id "electron-mass" :name "Equal Subatomic Mass Fallacy" :trap "Believing electrons contribute equally to atomic mass")
  ))`,
    coreAxiom: 'An atom is over 99.9999% empty space. Nearly all atomic mass is concentrated in the dense, positively charged nucleus (protons and neutrons), while extremely light electrons occupy discrete quantum shells around it.',
    cognitiveTrap: 'Visualizing an atom as a solid sphere where weight is evenly spread, or thinking electrons weigh the same as protons.',
    socraticPivot: 'If an atom were enlarged to the size of a football stadium, how large would the central nucleus be in comparison?',
    cpaType: 'atomic',
    realWorldAnalogies: {
      universal: 'A football stadium where the nucleus is a tiny marble on the center spot, and electrons are gnats buzzing around the highest seats.',
      developingNationContext: 'Like a large village square: the heavy grain silo sits at the exact center, while children run along the outer perimeter fences in distinct rings.',
    },
    misconceptions: [
      {
        id: 'plum-pudding',
        name: 'Uniform Density Illusion',
        trigger: 'Assuming an atom has uniform mass throughout its diameter',
        diagnosticExplanation: 'Rutherford’s alpha particle scattering experiment proved the opposite: most particles pass straight through empty space, while only those hitting the tiny dense nucleus bounce backwards.',
        mentalMirror: {
          flawedModel: 'Solid marble with particles scattered evenly inside.',
          scientificReality: 'Dense core (1/100,000th the diameter) surrounded by vast empty space.',
          visualDifference: '99.9% of mass is packed into a microscopic central point.',
        },
      },
      {
        id: 'electron-mass',
        name: 'Equal Subatomic Mass Fallacy',
        trigger: 'Calculating atomic mass by adding protons + neutrons + electrons',
        diagnosticExplanation: 'A proton or neutron has a relative mass of 1. An electron has a relative mass of approximately 1/1836th—so negligible that it is excluded from the atomic mass number calculation.',
        mentalMirror: {
          flawedModel: 'Protons, neutrons, and electrons contribute equally to mass.',
          scientificReality: 'Atomic Mass = Protons + Neutrons only.',
          visualDifference: 'It takes ~1,836 electrons to equal the mass of a single proton.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      return [
        {
          id: `atom-q1-${seedVariant}`,
          prompt: 'An atom of Carbon has 6 protons, 6 neutrons, and 6 electrons. What is its approximate relative atomic mass number, and where is that mass located?',
          options: [
            'Mass 12, located almost entirely in the central nucleus.',
            'Mass 18, evenly distributed across the entire atom.',
            'Mass 6, located in the outer electron shells.',
            'Mass 12, evenly distributed between the nucleus and electrons.',
          ],
          answerKey: 0,
          hint: 'Remember that electrons have negligible mass (1/1836) compared to protons and neutrons.',
          explanation: 'Atomic mass = protons (6) + neutrons (6) = 12. Almost 100% of this mass is concentrated inside the tiny central nucleus.',
          misconceptionMap: {
            1: 'Equal Mass Fallacy: Included 6 electrons in mass calculation; electrons have negligible mass.',
            2: 'Only Protons Counted: Forgot to count the neutrons in the nucleus.',
            3: 'Uniform Distribution Fallacy: Mass is not shared evenly; 99.9% is inside the nucleus.',
          },
        },
      ];
    },
  },

  'ks1:maths:place-value': {
    id: 'ks1:maths:place-value',
    keyStage: 'Key Stage 1',
    subject: 'Mathematics',
    topic: 'Place Value & Tens/Ones Partitioning',
    rawAST: `(:seed :id "ks1:mat:place-val" :ks "ks1" :sub "maths"
  :axiom "Digits acquire value by position: the tens column represents bundles of 10, the units column represents individual ones."
  :trap "Digit reversal and concatenation bias (writing 14 as 41, or treating 14 as 1 + 4 = 5)."
  :cpa :place-value
  :misconceptions (
    (:id "reversal" :name "Digit Reversal Trap" :trap "Writing 14 as 41 due to phonetic confusion")
    (:id "sum-digits" :name "Face Value Fallacy" :trap "Assuming the value of 24 is 2 + 4 = 6")
  ))`,
    coreAxiom: 'Digits acquire value purely from their column position. In a two-digit integer, the left digit represents bundles of ten, and the right digit represents individual units.',
    cognitiveTrap: 'Phonetic reversal (hearing "fourteen" and writing the unit 4 first, producing 41) or treating digits as loose items to add together (thinking 24 = 2 + 4 = 6).',
    socraticPivot: 'If you have 2 full boxes of 10 pencils and 4 loose pencils, do you have 6 pencils or 24 pencils?',
    cpaType: 'place-value',
    realWorldAnalogies: {
      universal: 'Egg cartons: 2 full cartons of 10 eggs and 4 loose eggs gives 24 eggs, not 6 eggs.',
      developingNationContext: 'Bundles of firewood: 2 tightly bound bundles of 10 sticks each, plus 4 loose twigs. You have 24 cooking sticks, not 6.',
    },
    misconceptions: [
      {
        id: 'reversal',
        name: 'Phonetic Digit Reversal Trap',
        trigger: 'Writing 14 as 41 or reading 35 as 53',
        diagnosticExplanation: 'English names for teen numbers put the unit sound first ("four-teen"), confusing young learners into writing the 4 in the tens place. 41 represents 4 tens and 1 unit—nearly three times larger than 14!',
        mentalMirror: {
          flawedModel: '41 = 4 ten-rods and 1 unit block (41 items).',
          scientificReality: '14 = 1 ten-rod and 4 unit blocks (14 items).',
          visualDifference: '41 is 27 items greater than 14; position determines magnitude.',
        },
      },
      {
        id: 'sum-digits',
        name: 'Face Value (Additive) Fallacy',
        trigger: 'Believing the number 25 means 2 + 5 = 7 items',
        diagnosticExplanation: 'The digit 2 does not mean 2 individual units; sitting in the tens column means it holds 2 tens (20). Total value is 20 + 5 = 25.',
        mentalMirror: {
          flawedModel: '2 + 5 = 7 loose pebbles.',
          scientificReality: '2 bundles of ten (20) + 5 loose pebbles = 25.',
          visualDifference: 'A ten-rod is 10 times the length and volume of a unit cube.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      const sets = [
        { tens: 3, ones: 4, val: 34, rev: 43, sum: 7, mult: 12 },
        { tens: 2, ones: 6, val: 26, rev: 62, sum: 8, mult: 12 },
        { tens: 5, ones: 1, val: 51, rev: 15, sum: 6, mult: 5 },
      ];
      const s = sets[seedVariant % sets.length];
      return [
        {
          id: `pv-q1-${seedVariant}`,
          prompt: `A child has ${s.tens} bundles of 10 sticks and ${s.ones} loose sticks. What is the total number of sticks?`,
          options: [
            `${s.val} sticks (${s.tens} tens and ${s.ones} ones)`,
            `${s.rev} sticks (reversed digits)`,
            `${s.sum} sticks (adding ${s.tens} + ${s.ones})`,
            `${s.mult} sticks (multiplying digits)`,
          ],
          answerKey: 0,
          hint: `Each bundle contains 10 sticks. Count the tens first: ${s.tens} × 10 = ${s.tens * 10}.`,
          explanation: `${s.tens} bundles of 10 = ${s.tens * 10}. Adding the ${s.ones} loose sticks gives ${s.tens * 10} + ${s.ones} = ${s.val}.`,
          misconceptionMap: {
            1: 'Digit Reversal Trap: Inverted the tens and ones column positions.',
            2: 'Face Value Fallacy: Added the digits together as loose units instead of recognizing bundles of ten.',
            3: 'Multiplication Trap: Multiplied digits instead of evaluating place values.',
          },
        },
      ];
    },
  },

  'ks2:maths:ratios': {
    id: 'ks2:maths:ratios',
    keyStage: 'Key Stage 2',
    subject: 'Mathematics',
    topic: 'Ratio Sharing & Total Parts Invariant',
    rawAST: `(:seed :id "ks2:mat:ratios" :ks "ks2" :sub "maths"
  :axiom "A ratio a:b partitions a total quantity into (a + b) equal unit shares; find one share before multiplying."
  :trap "Direct divisor error: dividing whole quantity by a or b directly rather than (a + b)."
  :cpa :ratio-bar
  :misconceptions (
    (:id "div-single" :name "Single Term Divisor" :trap "Dividing £60 in ratio 2:3 by 2 to get £30")
    (:id "diff-error" :name "Additive Difference Bias" :trap "Treating ratio 2:3 as an addition of 1 part")
  ))`,
    coreAxiom: 'A ratio a:b divides an entire quantity into (a + b) equal shares. To divide any amount into a ratio, you must first calculate the value of 1 equal part by dividing the total by the sum of the ratio terms.',
    cognitiveTrap: 'Dividing the total amount by one of the ratio numbers directly (e.g. sharing £60 in ratio 2:3 by dividing 60 by 2 or 3), leaving the remaining shares inconsistent.',
    socraticPivot: 'If two people share apples in the ratio 2:3, how many equal piles of apples must be set on the table before distributing them?',
    cpaType: 'ratio-bar',
    realWorldAnalogies: {
      universal: 'Mixing paint: 2 cups of blue and 3 cups of yellow makes 5 cups of green paint in total.',
      developingNationContext: 'Sharing a harvest of cassava: 2 sacks to the elder brother and 3 sacks to the younger brother. Every 5 sacks harvested form one complete distribution cycle.',
    },
    misconceptions: [
      {
        id: 'div-single',
        name: 'Single Term Divisor Error',
        trigger: 'Sharing £60 in ratio 2:3 and calculating 60 ÷ 2 = 30 and 60 ÷ 3 = 20',
        diagnosticExplanation: '30 + 20 = £50, which does not equal the original £60! You must add the ratio parts together (2 + 3 = 5 parts) to find the size of 1 unit share (£60 ÷ 5 = £12).',
        mentalMirror: {
          flawedModel: 'Dividing by 2 and 3 independently produces £30 + £20 = £50 (Leaves £10 unaccounted for).',
          scientificReality: '5 equal parts of £12 each: Person A gets 2×£12 = £24, Person B gets 3×£12 = £36. £24 + £36 = £60.',
          visualDifference: 'Bar model must completely tile the full whole quantity without gaps or overlaps.',
        },
      },
      {
        id: 'diff-error',
        name: 'Additive Difference Fallacy',
        trigger: 'Assuming ratio 2:3 means one person simply gets 1 unit more than the other',
        diagnosticExplanation: 'Ratios are multiplicative relationships, not fixed additive differences. A 2:3 ratio scales proportionately with the total amount shared.',
        mentalMirror: {
          flawedModel: 'Person B gets whatever Person A gets + 1.',
          scientificReality: 'Person B receives 1.5× whatever Person A receives, regardless of scale.',
          visualDifference: 'Multiplicative scaling preserves steepness; addition shifts positions.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      const sets = [
        { total: 60, rA: 2, rB: 3, parts: 5, unitVal: 12, shareA: 24, shareB: 36, wrongDiv: [30, 20] },
        { total: 80, rA: 1, rB: 3, parts: 4, unitVal: 20, shareA: 20, shareB: 60, wrongDiv: [80, 26.6] },
        { total: 70, rA: 3, rB: 4, parts: 7, unitVal: 10, shareA: 30, shareB: 40, wrongDiv: [23.3, 17.5] },
      ];
      const s = sets[seedVariant % sets.length];
      return [
        {
          id: `ratio-q1-${seedVariant}`,
          prompt: `Share £${s.total} between Amal and Brenda in the ratio ${s.rA}:${s.rB}. How much does Amal receive?`,
          options: [
            `£${s.shareA} (Amal) and £${s.shareB} (Brenda)`,
            `£${s.wrongDiv[0]} (divided total by ${s.rA})`,
            `£${Math.round(s.total / 2)} (split equally in half)`,
            `£${s.shareA - 5} (arbitrary split)`,
          ],
          answerKey: 0,
          hint: `Step 1: Find total parts by adding ${s.rA} + ${s.rB} = ${s.parts}. Step 2: Divide £${s.total} by ${s.parts}.`,
          explanation: `Total parts = ${s.rA} + ${s.rB} = ${s.parts}. One part = £${s.total} ÷ ${s.parts} = £${s.unitVal}. Amal gets ${s.rA} parts × £${s.unitVal} = £${s.shareA}.`,
          misconceptionMap: {
            1: `Single Term Divisor Error: Divided £${s.total} by ${s.rA} directly instead of total parts (${s.parts}).`,
            2: 'Equal Division Bias: Divided 50/50, ignoring the ratio proportion entirely.',
            3: 'Guessing Error: Check that the two shares sum exactly to £' + s.total,
          },
        },
      ];
    },
  },

  'ks3:maths:negative-numbers': {
    id: 'ks3:maths:negative-numbers',
    keyStage: 'Key Stage 3',
    subject: 'Mathematics',
    topic: 'Negative Integers & Direction Inversion',
    rawAST: `(:seed :id "ks3:mat:negatives" :ks "ks3" :sub "maths"
  :axiom "Subtractions invert direction along the 1D real vector line; subtracting a negative integer causes positive displacement."
  :trap "Rote rule over-generalization ('two minuses always make a plus' applied to -3 + -4 = +7)."
  :cpa :number-line
  :misconceptions (
    (:id "minus-rule" :name "Blind Sign Collision Rule" :trap "Thinking -4 + -3 = +7 because there are two minuses")
    (:id "sub-neg-sub" :name "Subtracting Negative Means Decreasing" :trap "Thinking 5 - (-3) = 2")
  ))`,
    coreAxiom: 'On a real number line, subtraction means facing the negative direction, and a negative number means stepping backwards. Facing left and walking backwards moves you in the positive (rightward) direction: a - (-b) = a + b.',
    cognitiveTrap: 'Applying the rhyme "two minuses make a plus" blindly to addition (e.g. -4 + -3 = +7) or believing that subtraction must always result in a smaller number.',
    socraticPivot: 'If a thermometer reads 3°C, and the temperature rises because cold air is taken away, does the temperature become hotter or colder?',
    cpaType: 'number-line',
    realWorldAnalogies: {
      universal: 'Elevator in a building with basements: taking away 2 floors of basement depth moves you higher up into the tower.',
      developingNationContext: 'Village ledger debt: if you owe the grain merchant 3 sacks of maize (-3) and the merchant cancels the debt (takes away the debt: -(-3)), you are 3 sacks richer.',
    },
    misconceptions: [
      {
        id: 'sub-neg-sub',
        name: 'Subtraction Always Decreases Fallacy',
        trigger: 'Thinking 4 - (-3) = 1 because subtraction must make things smaller',
        diagnosticExplanation: 'Subtracting a negative removes a deficit. Removing 3 units of cold or 3 units of debt increases your value: 4 - (-3) = 4 + 3 = 7.',
        mentalMirror: {
          flawedModel: '4 - 3 = 1 (Ignored the negative sign on the second number).',
          scientificReality: '4 - (-3) = 4 + 3 = 7 (Displaced 3 steps in positive direction).',
          visualDifference: 'On a number line, removing a backwards step pushes you forwards.',
        },
      },
      {
        id: 'minus-rule',
        name: 'Blind Sign Collision Rule',
        trigger: 'Calculating -5 + -2 = +7 because "two minuses make a plus"',
        diagnosticExplanation: 'The rule "two minuses make a plus" only applies when two negative signs multiply or negate each other directly (e.g. -(-2)). In addition, adding a deficit simply deepens the deficit: -5 + -2 = -7.',
        mentalMirror: {
          flawedModel: '-5 + -2 turned into +7 by memorized sign trick.',
          scientificReality: '-5 + -2 = -7 (You are 7 units below zero).',
          visualDifference: 'Adding cold to cold makes it colder, not warmer.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      const sets = [
        { a: 5, b: 3, ans: 8, wrongSub: 2, wrongNeg: -8, prompt: '5 - (-3)' },
        { a: 2, b: 6, ans: 8, wrongSub: -4, wrongNeg: -8, prompt: '2 - (-6)' },
        { a: -4, b: -3, ans: -7, wrongSub: 7, wrongNeg: -1, prompt: '-4 + (-3)' },
      ];
      const s = sets[seedVariant % sets.length];
      return [
        {
          id: `neg-q1-${seedVariant}`,
          prompt: `Calculate: ${s.prompt} = ?`,
          options: [
            `${s.ans}`,
            `${s.wrongSub}`,
            `${s.wrongNeg}`,
            `0`,
          ],
          answerKey: 0,
          hint: 'Think of a number line: subtraction means facing left, but a negative step means walking backwards.',
          explanation: `${s.prompt}: Subtracting a negative is equivalent to adding: ${s.prompt.includes('- (-') ? `${s.a} + ${s.b} = ${s.ans}` : `Starting at -4 and moving 3 steps left gives -7`}.`,
          misconceptionMap: {
            1: 'Subtraction Decreases Fallacy: Treated the operation as normal positive subtraction.',
            2: 'Blind Sign Trick: Misapplied the two-minuses rhyme to addition.',
            3: 'Zero Point Error: Confused position with origin.',
          },
        },
      ];
    },
  },

  'ks3:science:photosynthesis': {
    id: 'ks3:science:photosynthesis',
    keyStage: 'Key Stage 3',
    subject: 'Science',
    topic: 'Photosynthesis & Carbon Biomass Origin',
    rawAST: `(:seed :id "ks3:sci:photo" :ks "ks3" :sub "science"
  :axiom "Plant dry biomass originates almost entirely from airborne carbon dioxide (CO2) assimilated via light-driven chloroplast chemistry; roots absorb water and trace minerals, NOT food."
  :trap "Soil ingestion fallacy: assuming trees grow massive by eating soil through roots like an animal."
  :cpa :photosynthesis
  :misconceptions (
    (:id "soil-food" :name "Soil Eating Fallacy" :trap "Believing tree wood comes from soil mass")
    (:id "sun-food" :name "Sunlight as Matter" :trap "Believing sunlight provides physical mass rather than photon energy")
  ))`,
    coreAxiom: 'Over 95% of a plant’s dry biomass (wood, leaves, fruit) comes from the carbon in atmospheric carbon dioxide (CO2) gas, fixed during photosynthesis using solar energy. Soil provides water and trace minerals (nitrogen, phosphorus), but negligible dry mass.',
    cognitiveTrap: 'Believing that trees "eat soil" like animals eat food, or that giant 10-ton trees grew by taking 10 tons of soil out of the ground.',
    socraticPivot: 'In Jan Baptist van Helmont’s 1648 experiment, a willow tree gained 74 kg in 5 years while the soil lost only 57 grams. Where did the 74 kg of wood come from?',
    cpaType: 'photosynthesis',
    realWorldAnalogies: {
      universal: 'A brick house built by catching floating dust particles out of the wind and cementing them with water and solar power.',
      developingNationContext: 'A giant Baobab tree growing on dry rocky soil: the huge wooden trunk cannot have come from the rocks below; its solid carbon body was drawn silently from the passing air.',
    },
    misconceptions: [
      {
        id: 'soil-food',
        name: 'The "Plants Eat Soil" Fallacy',
        trigger: 'Believing trees get their solid matter and mass from soil nutrients',
        diagnosticExplanation: 'Van Helmont proved 400 years ago that soil mass barely changes as a tree grows. Soil minerals act like vitamins for humans—essential for enzymes, but providing 0% of the carbon backbone of wood (cellulose).',
        mentalMirror: {
          flawedModel: 'Roots absorb chunks of soil to build the trunk and branches.',
          scientificReality: 'Leaves absorb invisible CO2 gas from air; carbon atoms bond into glucose and wood.',
          visualDifference: 'A 50kg tree takes <0.1kg of minerals from soil and ~49.9kg of carbon and water from air and rain.',
        },
      },
      {
        id: 'sun-food',
        name: 'Light Converted into Matter Fallacy',
        trigger: 'Believing sunlight turns directly into physical matter',
        diagnosticExplanation: 'Sunlight is electromagnetic radiation (energy), not matter. Photons provide the activation energy to break water and CO2 bonds; the actual physical atoms come from the gas.',
        mentalMirror: {
          flawedModel: 'Sunlight solidifies into leaves.',
          scientificReality: 'Sunlight powers chemical bonds; CO2 gas provides the physical carbon atoms.',
          visualDifference: 'Photons are energy carriers; carbon atoms are physical matter.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      return [
        {
          id: `photo-q1-${seedVariant}`,
          prompt: 'A seedling weighs 5 grams. Five years later, it is a sturdy tree weighing 50 kilograms. Where did most of this new solid mass come from?',
          options: [
            'Carbon dioxide gas absorbed from the surrounding air through stomata in leaves.',
            'Organic soil matter sucked up through the root system.',
            'Plant fertilizer and minerals dissolved in the ground.',
            'Direct conversion of sunlight photons into solid matter.',
          ],
          answerKey: 0,
          hint: 'Remember Van Helmont’s experiment: the soil in the pot lost almost zero weight over 5 years.',
          explanation: 'During photosynthesis, carbon dioxide (CO2) from the air is chemically fixed into glucose (C6H12O6) and cellulose. The solid wood of a tree is literally solidified air and water!',
          misconceptionMap: {
            1: 'Soil Eating Fallacy: Roots absorb water and trace minerals, but not the carbon mass of wood.',
            2: 'Mineral Bias: Minerals act like vitamins in tiny microgram quantities.',
            3: 'Energy-Matter Confusion: Sunlight provides photon energy to power the reaction, but no mass.',
          },
        },
      ];
    },
  },

  'ks4:physics:forces-newton': {
    id: 'ks4:physics:forces-newton',
    keyStage: 'Key Stage 4',
    subject: 'Physics',
    topic: "Newton's First Law & Balanced Vector Dynamics",
    rawAST: `(:seed :id "ks4:phy:newton1" :ks "ks4" :sub "physics"
  :axiom "An object maintains uniform constant velocity (or rest) when resultant net force is zero (Sigma F = 0 => a = 0)."
  :trap "Aristotelian impetus fallacy: assuming continuous motion requires a continuous forward driving force."
  :cpa :force-vectors
  :misconceptions (
    (:id "impetus" :name "Aristotelian Impetus Trap" :trap "Believing a space probe requires rocket thrust to stay at 30,000 mph")
    (:id "speed-force" :name "Speed Proportional to Force" :trap "Assuming higher speed means larger forward force")
  ))`,
    coreAxiom: "Newton's First Law dictates that an object will remain at rest or continue moving at constant speed in a straight line unless acted upon by a non-zero resultant force (ΣF = 0 implies acceleration a = 0). Force causes change in velocity, NOT velocity itself.",
    cognitiveTrap: 'The Aristotelian Fallacy: Believing that if something is moving fast forward, there MUST be a forward force pushing it; and if the forward force stops, it immediately slows down.',
    socraticPivot: 'Once the Voyager spacecraft leaves our solar system into deep space, its rocket engines are turned completely off. Does it stop, slow down, or continue cruising at 35,000 mph forever?',
    cpaType: 'force-vectors',
    realWorldAnalogies: {
      universal: 'An ice hockey puck gliding on frictionless ice: once hit, it glides indefinitely at constant speed without needing another push.',
      developingNationContext: 'Sliding a flat smooth stone across a wet muddy riverbank or ice sheet: on rough ground friction slows it down, but if friction were zero, the stone would glide forever.',
    },
    misconceptions: [
      {
        id: 'impetus',
        name: 'The Aristotelian Impetus Fallacy',
        trigger: 'Assuming a car cruising at steady 60 mph has a net forward force',
        diagnosticExplanation: 'If a car cruises at steady 60 mph, the forward engine thrust exactly equals the backward air resistance and friction. The resultant net force is exactly ZERO. If there were a net forward force, the car would accelerate faster and faster!',
        mentalMirror: {
          flawedModel: 'Forward Force > Backward Drag to keep moving at 60 mph.',
          scientificReality: 'Forward Force = Backward Drag (Net Force = 0 N). Velocity remains constant.',
          visualDifference: 'Resultant force produces acceleration, not steady speed.',
        },
      },
      {
        id: 'speed-force',
        name: 'Speed Proportional to Force Fallacy',
        trigger: 'Believing an object moving at 100 m/s must have twice the forward force of one moving at 50 m/s',
        diagnosticExplanation: 'Velocity and force are independent vectors. A satellite moving at 17,000 mph in orbit has 0 N of forward propulsion force along its trajectory.',
        mentalMirror: {
          flawedModel: 'Speed is maintained by an internal reservoir of force.',
          scientificReality: 'Inertia preserves velocity; forces only change velocity.',
          visualDifference: 'Zero net force means constant velocity indefinitely.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      const sets = [
        { speed: 70, thrust: 1200, drag: 1200, unit: 'mph' },
        { speed: 100, thrust: 2500, drag: 2500, unit: 'km/h' },
        { speed: 50, thrust: 800, drag: 800, unit: 'm/s' },
      ];
      const s = sets[seedVariant % sets.length];
      return [
        {
          id: `newton-q1-${seedVariant}`,
          prompt: `A high-speed train travels along a straight, flat track at a constant speed of ${s.speed} ${s.unit}. The resistive forces (air drag and friction) total ${s.drag} N backwards. What is the forward driving force provided by the locomotive?`,
          options: [
            `Exactly ${s.drag} N forwards (Net force is 0 N, preserving constant velocity).`,
            `Much greater than ${s.drag} N forwards (a forward net force is required to keep it moving at ${s.speed} ${s.unit}).`,
            `0 N forwards (train coasts purely on momentum).`,
            `${s.drag * 2} N forwards (double the resistance).`,
          ],
          answerKey: 0,
          hint: 'The speed is CONSTANT (acceleration = 0). What does Newton’s First Law say about the resultant force when acceleration is zero?',
          explanation: `Since the velocity is constant, the acceleration is 0 m/s². By Newton's First and Second Laws (F = ma), the resultant net force must be 0 N. Therefore, Forward Force = Backward Resistance = ${s.drag} N.`,
          misconceptionMap: {
            1: `Aristotelian Trap: Believed a net forward force is needed to maintain steady speed. If net force were > 0, the train would accelerate!`,
            2: `Coasting Error: Without engine force, resistive forces would immediately decelerate the train.`,
            3: `Over-compensation: Balanced vectors must be equal in magnitude and opposite in direction.`,
          },
        },
      ];
    },
  },

  'ks4:chemistry:balancing-equations': {
    id: 'ks4:chemistry:balancing-equations',
    keyStage: 'Key Stage 4',
    subject: 'Chemistry',
    topic: 'Conservation of Mass & Stoichiometric Coefficients',
    rawAST: `(:seed :id "ks4:chm:stoich" :ks "ks4" :sub "chemistry"
  :axiom "Atoms are conserved during chemical reactions; balance equations by scaling stoichiometric coefficients, NEVER altering molecular subscripts."
  :trap "Subscript tampering: changing chemical formulas to match atom counts (e.g. turning H2 + O2 -> H2O into H2 + O2 -> H2O2)."
  :cpa :chemical-balance
  :misconceptions (
    (:id "subscript-tamper" :name "Subscript Alteration Trap" :trap "Changing chemical formulas instead of balancing multipliers")
    (:id "atom-creation" :name "Vanishing Atom Fallacy" :trap "Ignoring unbalanced atoms assuming they boil away")
  ))`,
    coreAxiom: 'In a chemical reaction, atoms cannot be created or destroyed (Law of Conservation of Mass). To balance an equation, you may only change the whole-number stoichiometric coefficients in front of molecules, never the chemical subscripts within a formula.',
    cognitiveTrap: 'Changing the small subscript numbers inside a chemical formula to make the atom counts equal on paper (e.g. changing $H_2 + O_2 \\rightarrow H_2O$ into $H_2 + O_2 \\rightarrow H_2O_2$). Changing subscripts alters the substance into a completely different chemical!',
    socraticPivot: 'Why can you not balance $H_2 + O_2 \\rightarrow H_2O$ by writing $H_2O_2$? What is the difference between drinking water ($H_2O$) and drinking hydrogen peroxide ($H_2O_2$)?',
    cpaType: 'chemical-balance',
    realWorldAnalogies: {
      universal: 'Bicycle factory: A bicycle has 1 frame (F) and 2 wheels (W) -> FW2. If you have 2 frames and 4 wheels, you make 2 FW2 bicycles; you cannot build a bike with 4 wheels attached to 1 frame (FW4)!',
      developingNationContext: 'Mud brick ovens: Dismantling an old rectangular chimney to build two smaller square cooking stoves. Every single clay brick must be placed in the new stoves; no brick disappears into thin air.',
    },
    misconceptions: [
      {
        id: 'subscript-tamper',
        name: 'The Subscript Alteration Trap',
        trigger: 'Writing H2 + O2 -> H2O2 to balance the oxygen atoms',
        diagnosticExplanation: 'Changing the subscript changes the chemical identity! H2O is harmless life-giving water; H2O2 is concentrated hydrogen peroxide—a corrosive bleach and rocket fuel. You must adjust the coefficient: 2H2 + O2 -> 2H2O.',
        mentalMirror: {
          flawedModel: 'H2 + O2 -> H2O2 (Changed the molecule into poison).',
          scientificReality: '2H2 + O2 -> 2H2O (Doubled water molecule count; chemical identity preserved).',
          visualDifference: 'Coefficients multiply separate molecules; subscripts alter internal chemical bonds.',
        },
      },
      {
        id: 'atom-creation',
        name: 'Vanishing Atom Fallacy',
        trigger: 'Believing unbalanced oxygen atoms simply evaporate or disappear during the reaction',
        diagnosticExplanation: 'Every atom entering a closed reaction must exit in the products. Matter is strictly conserved.',
        mentalMirror: {
          flawedModel: '1 oxygen atom simply vanishes into nothingness.',
          scientificReality: '2 hydrogen molecules react with 1 oxygen molecule to yield 2 water molecules.',
          visualDifference: 'Total mass of reactants equals total mass of products to the exact microgram.',
        },
      },
    ],
    generateQuestions: (seedVariant: number) => {
      return [
        {
          id: `stoich-q1-${seedVariant}`,
          prompt: 'Which is the correctly balanced chemical equation for the combustion of hydrogen in oxygen to produce water?',
          options: [
            '2H₂ + O₂ → 2H₂O',
            'H₂ + O₂ → H₂O₂',
            'H₂ + O₂ → H₂O + O',
            'H₂ + ½O₂ → H₂O (unacceptable fractional convention in GCSE)',
          ],
          answerKey: 0,
          hint: 'Count the atoms on both sides: Reactants must have 4 H and 2 O, and Products must have 4 H and 2 O.',
          explanation: '2H₂ + O₂ → 2H₂O has 4 Hydrogen atoms and 2 Oxygen atoms on both the left and right sides. Subscripts were never altered, preserving the true chemical formula of water.',
          misconceptionMap: {
            1: 'Subscript Alteration Trap: Formed hydrogen peroxide (H₂O₂) instead of water (H₂O).',
            2: 'Free Radical Trap: Atomic oxygen (O) does not exist stably on its own in normal conditions.',
            3: 'Fractional notation: Standard GCSE/curriculum chemistry requires lowest whole-number integer coefficients.',
          },
        },
      ];
    },
  },
};

/**
 * Calculates raw UTF-8 byte length of a string
 */
export function calculateByteLength(str: string): number {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str).length;
  }
  return str.length;
}

/**
 * Inflates a compressed knowledge seed on-device into a comprehensive lesson experience.
 * Uses 0 bytes of network egress.
 */
export function inflateKnowledgeSeed(seedKey: string): InflatedLessonExperience {
  const seed = COMPRESSED_KNOWLEDGE_SEEDS[seedKey] || COMPRESSED_KNOWLEDGE_SEEDS['ks2:maths:fractions'];
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const seedSizeBytes = calculateByteLength(seed.rawAST);
  // Benchmark comparison: A standard Khan Academy or BBC Bitesize streaming video lesson is ~50MB (52,428,800 bytes)
  const traditionalPayloadBytes = 52428800;
  const ratio = Math.round(traditionalPayloadBytes / seedSizeBytes);

  const duration = typeof performance !== 'undefined' ? performance.now() - startTime : 1;

  const telemetry: InflationTelemetry = {
    seedSizeBytes,
    traditionalPayloadBytes,
    compressionRatio: `${ratio.toLocaleString()} : 1`,
    dataSavedPercentage: '99.999%',
    networkEgressBytes: 0,
    cellularCostUSD: '$0.00',
    offlineStatus: '100% On-Device RAM',
    generationDurationMs: Math.max(1, Math.round(duration)),
  };

  const narrative = {
    hook: `Inquiry Opening: ${seed.realWorldAnalogies.developingNationContext}`,
    axiomExploration: seed.coreAxiom,
    analogy: seed.realWorldAnalogies.universal,
    guidedStep: `Step-by-Step Resolution: Always inspect the underlying relational invariant before attempting symbolic computation.`,
    socraticCheck: seed.socraticPivot,
  };

  const questions = seed.generateQuestions(0);

  return {
    seed,
    telemetry,
    narrative,
    activeManipulative: {
      cpaType: seed.cpaType,
      title: `${seed.topic} — Zero-Asset Procedural Manipulative`,
      description: `Pure mathematical SVG vector rendered dynamically on-device (0 bytes downloaded). Visualizes the mental model mirror live.`,
    },
    questions,
  };
}
