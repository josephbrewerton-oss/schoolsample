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
    if (t.includes('percentage') || t.includes('percent')) {
      return this.generatePercentageQuestion();
    }
    if (t.includes('ratio') || t.includes('proportion')) {
      return this.generateRatioQuestion();
    }
    if (t.includes('perimeter') || t.includes('area')) {
      return this.generatePerimeterAreaQuestion();
    }
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

  /**
   * KS2/KS3: Percentage of an amount with 10% benchmark and decimal traps
   */
  private static generatePercentageQuestion(): GeneratedMathQuestion {
    const percentages = [10, 20, 25, 50, 15, 75];
    const amounts = [40, 60, 80, 120, 200, 240, 300];
    const pct = percentages[Math.floor(Math.random() * percentages.length)];
    const total = amounts[Math.floor(Math.random() * amounts.length)];

    const correct = (pct / 100) * total;
    // Trap 1: Subtracted percentage number from total instead of finding fraction (e.g. 60 - 20 = 40)
    const trapSubtractPct = Math.abs(total - pct);
    // Trap 2: Divided total by percentage (e.g. 80 / 20 = 4)
    const trapDivide = Math.round(total / pct) || (correct + 5);
    // Trap 3: Confused 10% with 1%
    const trapOnePercent = correct / 10;

    const rawOptions = [
      { text: `${correct}`, misc: `Correct! ${pct}% of ${total} is ${correct}. Found using benchmark fractions.` },
      { text: `${trapSubtractPct}`, misc: `Percentage subtraction trap: Subtracted the percentage number (${total} - ${pct}) directly instead of finding the proportional fraction of ${total}.` },
      { text: `${trapDivide}`, misc: `Division slip: Divided the total by ${pct} instead of multiplying by ${pct}/100.` },
      { text: `${trapOnePercent}`, misc: `Place value slip: Divided by 100 twice, finding 1% instead of ${pct}%.` }
    ];

    const seen = new Set<string>();
    const cleanOptions = rawOptions.filter(o => {
      if (seen.has(o.text)) return false;
      seen.add(o.text);
      return true;
    });

    const shuffled = cleanOptions.sort(() => Math.random() - 0.5);
    const answerKey = shuffled.findIndex(o => o.text === `${correct}`);

    return {
      id: `math_pct_${Date.now()}`,
      prompt: `What is ${pct}% of ${total}?`,
      options: shuffled.map(o => o.text),
      answerKey: answerKey !== -1 ? answerKey : 0,
      misconceptions: shuffled.map(o => o.misc),
      hint: `Start by finding 10% of ${total} (divide by 10), then scale to ${pct}%.`,
      explanation: `To find ${pct}% of ${total}: 10% of ${total} is ${total / 10}. Multiplying by ${pct / 10} gives ${correct}.`,
      socraticFollowUp: `What is 10% of ${total}? How many 10% blocks fit into ${pct}%?`
    };
  }

  /**
   * KS2/KS3: Ratio Division with parts vs total confusion
   */
  private static generateRatioQuestion(): GeneratedMathQuestion {
    const part1 = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const part2 = Math.floor(Math.random() * 3) + 2; // 2 to 4
    const totalParts = part1 + part2;
    const multiplier = Math.floor(Math.random() * 8) + 4; // 4 to 11
    const totalAmount = totalParts * multiplier;
    const share1 = part1 * multiplier;
    const share2 = part2 * multiplier;

    const correct = share1;
    // Trap 1: Divided total amount by the single part ratio rather than sum of parts (totalAmount / part1)
    const trapDividedByOnePart = Math.round(totalAmount / part1);
    // Trap 2: Gave the larger share instead of the requested first share
    const trapOtherShare = share2;
    // Trap 3: Subtracted parts from total
    const trapSub = totalAmount - totalParts;

    const rawOptions = [
      { text: `${correct}`, misc: `Correct! ${totalAmount} shared in ratio ${part1}:${part2}. Total parts = ${totalParts}. One part = ${multiplier}, so ${part1} parts = ${correct}.` },
      { text: `${trapOtherShare}`, misc: `Target part confusion: Calculated the other share (${part2} parts = ${share2}) instead of the first share (${part1} parts).` },
      { text: `${trapDividedByOnePart}`, misc: `Total parts omission: Divided the total by ${part1} instead of dividing by the sum of parts (${part1} + ${part2} = ${totalParts}).` },
      { text: `${trapSub}`, misc: `Additive misconception: Subtracted ratio numbers instead of sharing into equal parts.` }
    ];

    const seen = new Set<string>();
    const cleanOptions = rawOptions.filter(o => {
      if (seen.has(o.text)) return false;
      seen.add(o.text);
      return true;
    });

    const shuffled = cleanOptions.sort(() => Math.random() - 0.5);
    const answerKey = shuffled.findIndex(o => o.text === `${correct}`);

    return {
      id: `math_ratio_${Date.now()}`,
      prompt: `Share £${totalAmount} in the ratio ${part1}:${part2}. What is the value of the first share?`,
      options: shuffled.map(o => o.text),
      answerKey: answerKey !== -1 ? answerKey : 0,
      misconceptions: shuffled.map(o => o.misc),
      hint: `Step 1: Add the ratio parts (${part1} + ${part2}) to find the total number of parts.`,
      explanation: `Add the ratio parts: ${part1} + ${part2} = ${totalParts} parts. Divide £${totalAmount} by ${totalParts} = £${multiplier} per part. First share is ${part1} × £${multiplier} = £${correct}.`,
      socraticFollowUp: `If £${totalAmount} is split into ${totalParts} equal piles, how much is in each pile?`
    };
  }

  /**
   * KS2: Area vs Perimeter - The single most common geometry misconception in primary schools
   */
  private static generatePerimeterAreaQuestion(): GeneratedMathQuestion {
    const length = Math.floor(Math.random() * 6) + 4; // 4 to 9 cm
    const width = Math.floor(Math.random() * 4) + 2;  // 2 to 5 cm

    const isAskingArea = Math.random() > 0.5;
    const area = length * width;
    const perimeter = 2 * (length + width);

    // Trap 1: Confused Area with Perimeter
    const trapFormulaConfusion = isAskingArea ? perimeter : area;
    // Trap 2: Added two sides only (half perimeter)
    const trapHalfPerimeter = length + width;
    // Trap 3: Multiplied and added (length * width + 2)
    const trapCalculationSlip = isAskingArea ? (area + 2) : (perimeter - 2);

    const correct = isAskingArea ? area : perimeter;
    const correctUnit = isAskingArea ? 'cm²' : 'cm';
    const trapUnit = isAskingArea ? 'cm' : 'cm²';

    const rawOptions = [
      { text: `${correct} ${correctUnit}`, misc: `Correct! ${isAskingArea ? `Area = length × width (${length} × ${width} = ${area} cm²).` : `Perimeter = sum of all 4 outer sides (2 × (${length} + ${width}) = ${perimeter} cm).`}` },
      { text: `${trapFormulaConfusion} ${isAskingArea ? 'cm²' : 'cm'}`, misc: `Classic Area vs Perimeter confusion: Calculated ${isAskingArea ? 'Perimeter (outer boundary distance)' : 'Area (internal square units)'} instead of ${isAskingArea ? 'Area' : 'Perimeter'}!` },
      { text: `${trapHalfPerimeter} ${correctUnit}`, misc: `Incomplete perimeter trap: Added only two adjacent sides (${length} + ${width}) and forgot the opposite two sides.` },
      { text: `${correct} ${trapUnit}`, misc: `Unit confusion: Calculated the correct numerical value but selected the wrong units (${trapUnit} instead of ${correctUnit}).` }
    ];

    const shuffled = rawOptions.sort(() => Math.random() - 0.5);
    const answerKey = shuffled.findIndex(o => o.text === `${correct} ${correctUnit}`);

    return {
      id: `math_geom_${Date.now()}`,
      prompt: `A rectangle has a length of ${length} cm and a width of ${width} cm. What is its ${isAskingArea ? 'AREA' : 'PERIMETER'}?`,
      options: shuffled.map(o => o.text),
      answerKey: answerKey !== -1 ? answerKey : 0,
      misconceptions: shuffled.map(o => o.misc),
      hint: isAskingArea ? `Area is the space inside: multiply length by width.` : `Perimeter is the distance all the way around all 4 sides.`,
      explanation: isAskingArea
        ? `Area = length × width = ${length} × ${width} = ${area} cm². Units for area are always squared.`
        : `Perimeter = 2 × (length + width) = 2 × (${length} + ${width}) = ${perimeter} cm.`,
      socraticFollowUp: isAskingArea
        ? `Are you measuring a fence around the outside (perimeter) or the grass carpet inside (area)?`
        : `How many sides does a rectangle have in total? Did you count all of them?`
    };
  }
}
