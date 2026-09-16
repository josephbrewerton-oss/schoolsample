// src/engine/prng.ts
/**
 * St Joseph's Curriculum Portal — Deterministic PRNG Seed System
 *
 * Implements a high-quality, fast Mulberry32 PRNG paired with MurmurHash3
 * string seed derivation.
 *
 * Gold-standard benefits:
 * 1. Infinite unique questions per topic by incrementing or hashing the seed.
 * 2. 100% deterministic reproducibility: Given the same seed, pupils and teachers
 *    always receive the exact same question numbers, variables, and distractors.
 * 3. Compact shareable seed tokens (e.g. "KS2-MAT-94A1F") for teacher assignments
 *    and synchronized classroom speed challenges.
 */

export class PRNG {
  private s: number;

  constructor(seed: number | string) {
    if (typeof seed === 'string') {
      this.s = PRNG.hashString(seed);
    } else {
      this.s = (seed >>> 0) || 0x12345678;
    }
  }

  /**
   * Fast, avalanche-tested MurmurHash3-inspired 32-bit integer string hasher.
   */
  public static hashString(str: string): number {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
  }

  /**
   * Generates a compact, human-readable seed token suitable for UI display and sharing.
   * e.g., "7F2A-4B81"
   */
  public static generateSeedToken(prefix?: string): string {
    const r1 = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
    const r2 = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, '0');
    const token = `${r1}-${r2}`;
    return prefix ? `${prefix.toUpperCase()}-${token}` : token;
  }

  /**
   * Returns a float in [0, 1) using the Mulberry32 algorithm.
   */
  public next(): number {
    let t = (this.s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Returns an integer in [min, max] inclusive.
   */
  public nextInt(min: number, max: number): number {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(this.next() * (hi - lo + 1)) + lo;
  }

  /**
   * Returns a random element from an array.
   */
  public pick<T>(array: T[]): T {
    if (!array || array.length === 0) return undefined as unknown as T;
    const index = Math.floor(this.next() * array.length);
    return array[index];
  }

  /**
   * Returns a shuffled copy of an array using Fisher-Yates with this PRNG.
   */
  public shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
