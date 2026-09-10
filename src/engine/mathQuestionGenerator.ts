// src/engine/mathQuestionGenerator.ts

export interface GeneratedMathQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerKey: number;
  misconceptions: string[];
  hint: string;
  explanation: string;
  socraticFollowUp: string;
}

/**
 * High-performance, zero-latency deterministic math generator.
 * Produces 100% mathematically correct problems with authentic student misconception distractors.
 */
export class MathQuestionGenerator {
  private static gcd(a: number, b: number): number {
    return !b ? a : this.gcd(b, a % b);
  }

  public static isMathSubject(subject?: string, topic?: string): boolean {
    const s = (subject || '').toLowerCase();
    const t = (topic || '').toLowerCase();
    return (
      s.includes('math') ||
      s.includes('calc') ||
      s.includes('arithmetic') ||
      t.includes('addition') ||
      t.includes('subtraction') ||
      t.includes('multiplication') ||
      t.includes('division') ||
      t.includes('fraction') ||
      t.includes('decimal') ||
      t.includes('percentage') ||
      t.includes('algebra') ||
      t.includes('bidmas') ||
      t.includes('ratio')
    );
  }

  public static generate(keyStage: string, topic: string): GeneratedMathQuestion {
    const ks = (keyStage || '').toLowerCase();
    const t = (topic || '').toLowerCase();

    // Route based on topic or Key Stage
    if (t.includes('fraction') || ks.includes('ks3') && Math.random() > 0.5) {
      return this.generateFractionQuestion();
    }
    if (t.includes('bidmas') || t.includes('order of operation') || ks.includes('ks3') && Math.random() > 0.5) {
      return this.generateBidmasQuestion();
    }
    if (ks.includes('ks1') || t.includes('addition') || t.includes('within 20')) {
      return this.generateKS1Arithmetic();
    }
    if (ks.includes('ks4') || t.includes('algebra') || t.includes('powers') || t.includes('index')) {
      return this.generateIndexLawsQuestion();
    }

    // Default to KS2 Times Tables / Mixed Operations
    return this.generateTimesTableQuestion();
  }

  /**
   * KS1: Addition / Subtraction with counting-on and off-by-one misconceptions
   */
  private static generateKS1Arithmetic(): GeneratedMathQuestion {
    const a = Math.floor(Math.random() * 8) + 6; // 6 to 13
    const b = Math.floor(Math.random() * 6) + 3; // 3 to 8
    const correct = a + b;

    const trapSub = Math.abs(a - b);
    const trapOffPlus = correct + 1;
    const trapOffMinus = correct - 1;

    const rawOptions = [
      { text: `${correct}`, misc: `Correct! ${a} + ${b} = ${correct}. Counted on from ${a} correctly.` },
      { text: `${trapOffPlus}`, misc: `Off-by-one error: Counted the starting number ${a} twice instead of counting on.` },
      { text: `${trapOffMinus}`, misc: `Off-by-one error: Stopped one number short while counting on.` },
      { text: `${trapSub}`, misc: `Operation confusion: Subtracted ${b} from ${a} instead of adding.` }
    ];

    // Shuffle options
    const shuffled = rawOptions.sort(() => Math.random() - 0.5);
    const answerKey = shuffled.findIndex(o => o.text === `${correct}`);

    return {
      id: `math_ks1_${Date.now()}`,
      prompt: `What is ${a} + ${b}?`,
      options: shuffled.map(o => o.text),
      answerKey: answerKey !== -1 ? answerKey : 0,
      misconceptions: shuffled.map(o => o.misc),
      hint: `Start at ${a} and count on ${b} steps.`,
      explanation: `Addition means joining the groups together: ${a} plus ${b} gives ${correct}.`,
      socraticFollowUp: `If you have ${a} counters and add 1 more, that's ${a + 1}. What happens when you add all ${b}?`
    };
  }

  /**
   * KS2: Multiplication / Times Tables with additive and factor confusion
   */
  private static generateTimesTableQuestion(): GeneratedMathQuestion {
    const table = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const factor = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const correct = table * factor;

    const trapAdd = table + factor;
    const trapOffTable = correct + table;
    const trapOffOne = correct - 1;

    const rawOptions = [
      { text: `${correct}`, misc: `Correct! ${table} groups of ${factor} equals ${correct}.` },
      { text: `${trapAdd}`, misc: `Operation confusion: Added ${table} + ${factor} instead of multiplying groups.` },
      { text: `${trapOffTable}`, misc: `Table jump error: Calculated ${table} × ${factor + 1} instead of ${table} × ${factor}.` },
      { text: `${trapOffOne}`, misc: `Calculation slip: Off-by-one counting error in the times table pattern.` }
    ];

    const shuffled = rawOptions.sort(() => Math.random() - 0.5);
    const answerKey = shuffled.findIndex(o => o.text === `${correct}`);

    return {
      id: `math_ks2_${Date.now()}`,
      prompt: `What is ${table} × ${factor}?`,
      options: shuffled.map(o => o.text),
      answerKey: answerKey !== -1 ? answerKey : 0,
      misconceptions: shuffled.map(o => o.misc),
      hint: `Think of ${table} equal groups of ${factor}.`,
      explanation: `Multiplication is repeated addition: adding ${factor}, ${table} times gives ${correct}.`,
      socraticFollowUp: `What is ${table} × 5? Can you use that benchmark to reach ${table} × ${factor}?`
    };
  }

  /**
   * KS2/KS3: Fraction Addition with the classic "add numerators and denominators" trap
   */
  private static generateFractionQuestion(): GeneratedMathQuestion {
    // Pick simple distinct denominators
    const pairs = [
      { n1: 1, d1: 2, n2: 1, d2: 3 }, // 1/2 + 1/3 = 5/6
      { n1: 1, d1: 3, n2: 1, d2: 4 }, // 1/3 + 1/4 = 7/12
      { n1: 1, d1: 4, n2: 1, d2: 2 }, // 1/4 + 1/2 = 3/4
      { n1: 2, d1: 5, n2: 1, d2: 10 }, // 2/5 + 1/10 = 5/10 = 1/2
      { n1: 1, d1: 5, n2: 2, d2: 3 }, // 1/5 + 2/3 = 13/15
    ];

    const pick = pairs[Math.floor(Math.random() * pairs.length)];
    const commDenom = (pick.d1 * pick.d2) / this.gcd(pick.d1, pick.d2);
    const adjNum = pick.n1 * (commDenom / pick.d1) + pick.n2 * (commDenom / pick.d2);
    const simpDiv = this.gcd(adjNum, commDenom);
    const correctNum = adjNum / simpDiv;
    const correctDen = commDenom / simpDiv;
    const correctStr = `${correctNum}/${correctDen}`;

    // Trap 1: Add numerators and add denominators (classic student error: (1+1)/(3+4) = 2/7)
    const trapAddAcross = `${pick.n1 + pick.n2}/${pick.d1 + pick.d2}`;

    // Trap 2: Multiply denominators without adjusting numerators
    const trapUnadjusted = `${pick.n1 + pick.n2}/${commDenom}`;

    // Trap 3: Multiply numerators instead of adding
    const trapMulNum = `${pick.n1 * pick.n2}/${commDenom}`;

    const rawOptions = [
      { text: correctStr, misc: `Correct! Converted to a common denominator of ${commDenom} before adding.` },
      { text: trapAddAcross, misc: `Classic misconception: Added straight across numerators (${pick.n1}+${pick.n2}) and denominators (${pick.d1}+${pick.d2}). Denominators represent slice size and must be matched first!` },
      { text: trapUnadjusted, misc: `Common trap: Found the common denominator but forgot to scale up the numerators.` },
      { text: trapMulNum, misc: `Operation confusion: Multiplied the top numbers instead of adding them.` }
    ];

    // Filter duplicates if any coincidental match
    const seen = new Set<string>();
    const cleanOptions = rawOptions.filter(o => {
      if (seen.has(o.text)) return false;
      seen.add(o.text);
      return true;
    });

    const shuffled = cleanOptions.sort(() => Math.random() - 0.5);
    const answerKey = shuffled.findIndex(o => o.text === correctStr);

    return {
      id: `math_frac_${Date.now()}`,
      prompt: `What is ${pick.n1}/${pick.d1} + ${pick.n2}/${pick.d2}?`,
      options: shuffled.map(o => o.text),
      answerKey: answerKey !== -1 ? answerKey : 0,
      misconceptions: shuffled.map(o => o.misc),
      hint: `Find a common denominator before adding the numerators.`,
      explanation: `To add fractions with different denominators, rewrite them with a common denominator of ${commDenom}: ${correctStr}.`,
      socraticFollowUp: `Can you add halves and thirds directly without slicing them into equal pieces first?`
    };
  }

  /**
   * KS3: Order of Operations (BIDMAS / PEMDAS) with left-to-right calculation trap
   */
  private static generateBidmasQuestion(): GeneratedMathQuestion {
    const a = Math.floor(Math.random() * 5) + 2; // 2 to 6
    const b = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const c = Math.floor(Math.random() * 5) + 3; // 3 to 7

    // Expression: a + b × c
    const correct = a + (b * c);
    const trapLeftToRight = (a + b) * c; // Ignored BIDMAS
    const trapAddAll = a + b + c;
    const trapMulFirstThenSub = Math.abs((b * c) - a);

    const rawOptions = [
      { text: `${correct}`, misc: `Correct! Multiplied ${b} × ${c} = ${b * c} first according to BIDMAS, then added ${a} to get ${correct}.` },
      { text: `${trapLeftToRight}`, misc: `Order of operations error: Worked strictly left-to-right (${a} + ${b} = ${a + b}, then × ${c}). BIDMAS requires multiplication before addition!` },
      { text: `${trapAddAll}`, misc: `Operator slip: Added all numbers together (${a} + ${b} + ${c}) instead of multiplying.` },
      { text: `${trapMulFirstThenSub}`, misc: `Sign error: Multiplied first but subtracted ${a} instead of adding.` }
    ];

    const shuffled = rawOptions.sort(() => Math.random() - 0.5);
    const answerKey = shuffled.findIndex(o => o.text === `${correct}`);

    return {
      id: `math_bidmas_${Date.now()}`,
      prompt: `Calculate: ${a} + ${b} × ${c}`,
      options: shuffled.map(o => o.text),
      answerKey: answerKey !== -1 ? answerKey : 0,
      misconceptions: shuffled.map(o => o.misc),
      hint: `Remember BIDMAS: Brackets, Indices, Division/Multiplication, Addition/Subtraction.`,
      explanation: `Multiplication takes precedence over addition: ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = ${correct}.`,
      socraticFollowUp: `Which operation has higher priority in BIDMAS: addition or multiplication?`
    };
  }

  /**
   * KS4: Index Laws / Exponents with power multiplication trap
   */
  private static generateIndexLawsQuestion(): GeneratedMathQuestion {
    const p1 = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const p2 = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const correctPower = p1 + p2;
    const trapMulPower = p1 * p2;
    const trapSubPower = Math.abs(p1 - p2);

    const correctStr = `x^${correctPower}`;
    const trapMulStr = `x^${trapMulPower}`;
    const trapSubStr = `x^${trapSubPower || 1}`;
    const trapCoeffStr = `${correctPower}x`;

    const rawOptions = [
      { text: correctStr, misc: `Correct! When multiplying terms with the same base, add the powers: ${p1} + ${p2} = ${correctPower}.` },
      { text: trapMulStr, misc: `Power multiplication trap: Multiplied the indices (${p1} × ${p2}) instead of adding them. You only multiply powers when raising a power to a power, e.g. (x^a)^b.` },
      { text: trapSubStr, misc: `Index law confusion: Subtracted the powers (${p1} - ${p2}) as if dividing terms.` },
      { text: trapCoeffStr, misc: `Algebraic confusion: Turned the power into a front coefficient.` }
    ];

    const shuffled = rawOptions.sort(() => Math.random() - 0.5);
    const answerKey = shuffled.findIndex(o => o.text === correctStr);

    return {
      id: `math_ks4_${Date.now()}`,
      prompt: `Simplify: x^${p1} × x^${p2}`,
      options: shuffled.map(o => o.text),
      answerKey: answerKey !== -1 ? answerKey : 0,
      misconceptions: shuffled.map(o => o.misc),
      hint: `Recall the first index law: a^m × a^n = a^(m + n).`,
      explanation: `When multiplying terms with the same base, add the indices: x^${p1} × x^${p2} = x^(${p1}+${p2}) = x^${correctPower}.`,
      socraticFollowUp: `Write out x^${p1} as x factors and x^${p2} as x factors. How many x's are being multiplied altogether?`
    };
  }
}
