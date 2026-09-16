// src/engine/trajectoryEngine.ts
// Mathematical Coordinate & Cognitive Vector Prediction Engine

export interface CoordinateAttempt {
  seedToken: string;
  topicId: string;
  selectedCoordinate: number; // 0, 1, 2, 3
  correctCoordinate: number; // The ground truth coordinate
  isCorrect: boolean;
  misconceptionTag?: string;
  timestamp: number;
}

export interface CognitiveTrajectoryState {
  totalAttempts: number;
  accuracy: number;
  activeTrapVector: string | null;
  trapConfidence: number; // 0.0 to 1.0
  predictedNextTrap: string | null;
  coordinateEntropy: number; // low = systematic patterned error, high = guessing
  recommendedAction: string;
  recentTrail: CoordinateAttempt[];
}

export class TrajectoryEngine {
  private static attempts: CoordinateAttempt[] = [];

  static recordAttempt(attempt: CoordinateAttempt): CognitiveTrajectoryState {
    this.attempts.push(attempt);
    if (this.attempts.length > 50) {
      this.attempts.shift(); // keep sliding window
    }
    return this.analyzeTrajectory();
  }

  static getRecentTrail(): CoordinateAttempt[] {
    return [...this.attempts];
  }

  static analyzeTrajectory(): CognitiveTrajectoryState {
    const total = this.attempts.length;
    if (total === 0) {
      return {
        totalAttempts: 0,
        accuracy: 1.0,
        activeTrapVector: null,
        trapConfidence: 0,
        predictedNextTrap: null,
        coordinateEntropy: 0,
        recommendedAction: 'Awaiting first coordinate response.',
        recentTrail: [],
      };
    }

    const correctCount = this.attempts.filter((a) => a.isCorrect).length;
    const accuracy = Math.round((correctCount / total) * 100) / 100;

    // Filter out incorrect attempts to map error vectors
    const errors = this.attempts.filter((a) => !a.isCorrect && a.misconceptionTag);
    if (errors.length === 0) {
      return {
        totalAttempts: total,
        accuracy,
        activeTrapVector: null,
        trapConfidence: 0,
        predictedNextTrap: null,
        coordinateEntropy: 0,
        recommendedAction: 'Full axiomatic alignment. Advance difficulty bracket.',
        recentTrail: [...this.attempts],
      };
    }

    // Tally misconception frequencies
    const freq: Record<string, number> = {};
    errors.forEach((e) => {
      const tag = e.misconceptionTag || 'General Misconception';
      freq[tag] = (freq[tag] || 0) + 1;
    });

    // Find primary trap vector
    let dominantTrap = '';
    let maxCount = 0;
    for (const [tag, count] of Object.entries(freq)) {
      if (count > maxCount) {
        maxCount = count;
        dominantTrap = tag;
      }
    }

    const trapConfidence = Math.min(1.0, Math.round((maxCount / errors.length) * 100) / 100);

    // Coordinate entropy calculation
    // If student keeps clicking the same error coordinate or same trap, entropy is low (systematic mistake).
    // If student clicks all over randomly, entropy is high (guessing).
    const errorCoords = errors.map((e) => e.selectedCoordinate);
    const coordCounts: Record<number, number> = {};
    errorCoords.forEach((c) => {
      coordCounts[c] = (coordCounts[c] || 0) + 1;
    });
    let entropy = 0;
    const errLen = errorCoords.length;
    for (const count of Object.values(coordCounts)) {
      const p = count / errLen;
      entropy -= p * Math.log2(p);
    }
    // Normalized entropy between 0 and 1 (max entropy for 4 options is 2)
    const normalizedEntropy = Math.min(1.0, Math.round((entropy / 2) * 100) / 100);

    let recommendedAction = '';
    let predictedNextTrap: string | null = null;

    if (trapConfidence >= 0.6) {
      predictedNextTrap = dominantTrap;
      recommendedAction = `Systematic pattern detected (${Math.round(trapConfidence * 100)}% convergence). Deploy Socratic counter-example to decouple "${dominantTrap}".`;
    } else if (normalizedEntropy > 0.8 && errors.length >= 3) {
      recommendedAction = 'High coordinate entropy detected: Student may be guessing rather than applying systematic reasoning. Suggest conceptual reset.';
    } else {
      recommendedAction = 'Reinforce fundamental definitions before presenting parallel variations.';
    }

    return {
      totalAttempts: total,
      accuracy,
      activeTrapVector: dominantTrap,
      trapConfidence,
      predictedNextTrap,
      coordinateEntropy: normalizedEntropy,
      recommendedAction,
      recentTrail: [...this.attempts],
    };
  }

  /**
   * Deterministic State Transition Stream Function:
   * S_{t+1} = f(S_t, C_prev, isCorrect, targetVector)
   * The instance doesn't require isolated textual history—the coordinate of the previous
   * interaction directly computes the next harmonic coordinate in the curriculum seed space.
   */
  static deriveNextSeedStream(params: {
    currentSeedToken: string;
    previousCoordinate: number; // 0, 1, 2, 3
    isCorrect: boolean;
    misconceptionTag?: string;
  }): {
    nextSeedToken: string;
    pedagogicalIntent: 'stretch_mastery' | 'counter_example' | 'concrete_scaffold' | 'parallel_variant';
    adaptationLabel: string;
  } {
    const { currentSeedToken, previousCoordinate, isCorrect, misconceptionTag } = params;

    // Hash the current seed and coordinate together into a deterministic 32-bit state
    let hash = 2166136261;
    const str = `${currentSeedToken}_c${previousCoordinate}_${isCorrect ? 'T' : 'F'}_${misconceptionTag || 'none'}`;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const cleanHash = (hash >>> 0).toString(16).toUpperCase().padStart(8, '0');

    if (isCorrect) {
      // Coordinate was Ground Truth: Advance upward along the mastery vector
      return {
        nextSeedToken: `AXIOM-${cleanHash}`,
        pedagogicalIntent: 'stretch_mastery',
        adaptationLabel: 'Mastery Confirmed: Advancing along cognitive vector.',
      };
    }

    if (misconceptionTag && (misconceptionTag.includes('add') || misconceptionTag.includes('count') || misconceptionTag.includes('precedence'))) {
      // Systematic Trap Vector: Serve the targeted counter-proof seed
      return {
        nextSeedToken: `SOCRATIC-${cleanHash}`,
        pedagogicalIntent: 'counter_example',
        adaptationLabel: `Trap Decoupler: Addressing "${misconceptionTag.slice(0, 30)}..."`,
      };
    }

    // Default coordinate branching: Parallel variant
    return {
      nextSeedToken: `STREAM-${cleanHash}`,
      pedagogicalIntent: 'parallel_variant',
      adaptationLabel: 'Synthesizing parallel coordinate variation.',
    };
  }

  static clearTrail() {
    this.attempts = [];
  }
}
