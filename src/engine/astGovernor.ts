export interface RawASTQuestion {
  route?: string;
  scratchpad?: string;
  prompt: string;
  options: string[];
  answerKey: number;
}

export interface GovernedQuestion {
  isValid: boolean;
  sanitizedQuestion: RawASTQuestion | null;
  rejectionReason?: string;
}

/**
 * AST Flow Governor: Evaluates, verifies, and sanitizes generated AST trees.
 */
export class ASTFlowGovernor {
  /**
   * Deterministic Fraction/Arithmetic Reducer
   */
  private static verifyArithmetic(prompt: string, scratchpad = ''): string | null {
    // Check simple fraction addition pattern: a/b + c/d
    const fracMatch = prompt.match(/(\d+)\/(\d+)\s*\+\s*(\d+)\/(\d+)/);
    if (fracMatch) {
      const [, a, b, c, d] = fracMatch.map(Number);
      const commonDenominator = b * d;
      const numerator = a * d + c * b;
      
      // Simplify
      const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
      const divisor = gcd(numerator, commonDenominator);
      const simpNum = numerator / divisor;
      const simpDen = commonDenominator / divisor;
      
      return simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`;
    }
    return null;
  }

  /**
   * Governs an incoming AST node tree against schema, logic, and topic constraints.
   */
  public static govern(
    raw: RawASTQuestion,
    expectedSubject: string,
    expectedTopic: string
  ): GovernedQuestion {
    // 1. Structural Schema Validation
    if (!raw.prompt || !Array.isArray(raw.options) || raw.options.length < 2) {
      return {
        isValid: false,
        sanitizedQuestion: null,
        rejectionReason: 'AST Schema Failure: Missing prompt or insufficient options',
      };
    }

    // 2. Distractor De-duplication & Trimming
    const sanitizedOptions = Array.from(new Set(raw.options.map(opt => String(opt).trim()))).filter(Boolean);
    if (sanitizedOptions.length < 2) {
      return {
        isValid: false,
        sanitizedQuestion: null,
        rejectionReason: 'AST Distractor Failure: Duplicate options collapsed pool below minimum threshold',
      };
    }

    // 3. Deterministic Arithmetic Correction
    let targetAnswerKey = typeof raw.answerKey === 'number' && raw.answerKey >= 0 && raw.answerKey < sanitizedOptions.length
      ? raw.answerKey
      : 0;

    const evaluatedMath = this.verifyArithmetic(raw.prompt, raw.scratchpad);
    if (evaluatedMath) {
      const mathIndex = sanitizedOptions.indexOf(evaluatedMath);
      if (mathIndex !== -1) {
        targetAnswerKey = mathIndex;
      } else {
        // Inject verified correct answer into slot 0 if Nano hallucinated completely
        sanitizedOptions[0] = evaluatedMath;
        targetAnswerKey = 0;
      }
    }

    // 4. Subject/Topic Keyword Heuristic Firewall
    const isMathSubject = /math/i.test(expectedSubject) || /fraction|decimal|algebra|arithmetic/i.test(expectedTopic);
    const hasMathSymbols = /[0-9\+\-\*\/\=xX]/.test(raw.prompt);

    if (!isMathSubject && hasMathSymbols && !raw.prompt.toLowerCase().includes(expectedTopic.toLowerCase())) {
      return {
        isValid: false,
        sanitizedQuestion: null,
        rejectionReason: `AST Topic Bleed: Received math-heavy tokens during "${expectedTopic}" context`,
      };
    }

    return {
      isValid: true,
      sanitizedQuestion: {
        route: raw.route || 'quiz:mcq',
        scratchpad: raw.scratchpad || '',
        prompt: raw.prompt.trim(),
        options: sanitizedOptions,
        answerKey: targetAnswerKey,
      },
    };
  }
}