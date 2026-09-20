// src/utils/confetti.ts
/**
 * Delightful, accessible celebration engine powered by canvas-confetti (~6.5k stars).
 * 
 * - Respects prefers-reduced-motion for sensitive learners.
 * - Respects low-bandwidth / low-power data saver mode.
 * - Non-intrusive, joyful positive reinforcement for curriculum breakthroughs.
 */
import confetti from 'canvas-confetti';
import { isDataSaverActive } from '../services/dataSaverStore';

function canCelebrate(): boolean {
  if (typeof window === 'undefined') return false;
  if (isDataSaverActive()) return false;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false;
  }
  return true;
}

/**
 * Gentle burst for a correct answer.
 */
export function triggerCorrectConfetti(): void {
  if (!canCelebrate()) return;

  try {
    confetti({
      particleCount: 28,
      spread: 45,
      origin: { y: 0.72 },
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#10b981'],
      disableForReducedMotion: true,
      scalar: 0.85,
    });
  } catch (err) {
    // Graceful fallback if canvas is restricted
  }
}

/**
 * Twin cannon celebration for a streak milestone (3, 5, 10).
 */
export function triggerStreakCelebration(streak: number): void {
  if (!canCelebrate()) return;

  try {
    const end = Date.now() + 650;
    const colors = ['#2563eb', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

    (function frame() {
      confetti({
        particleCount: 15,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        disableForReducedMotion: true,
        scalar: 0.9,
      });
      confetti({
        particleCount: 15,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        disableForReducedMotion: true,
        scalar: 0.9,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (err) {}
}

/**
 * Full celebratory fanfare for completing a unit, lesson, or mastery question.
 */
export function triggerMasteryConfetti(): void {
  if (!canCelebrate()) return;

  try {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#2563eb', '#f59e0b', '#ec4899', '#a855f7'],
      disableForReducedMotion: true,
      scalar: 1.05,
    });
  } catch (err) {}
}
