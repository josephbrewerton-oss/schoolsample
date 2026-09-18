// src/services/soundHaptics.ts
/**
 * Zero-Data Educational Sound & Tactile Haptic Engine
 * 
 * Generates harmonic audio feedback using the browser's native Web Audio API
 * (sine and triangle wave oscillators) and tactile haptic impulses via navigator.vibrate.
 * 
 * - ZERO external sound files or network data.
 * - 100% offline & instant.
 * - Non-jarring, pedagogical sound design (uplifting success, gentle formative tone).
 * - Full mute & privacy controls for quiet classrooms.
 */

const SOUND_KEY = 'stj_sound_enabled';
const HAPTICS_KEY = 'stj_haptics_enabled';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = localStorage.getItem(SOUND_KEY);
  return val === null ? true : val === 'true';
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('stj_sound_haptics_updated'));
}

export function isHapticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const val = localStorage.getItem(HAPTICS_KEY);
  return val === null ? true : val === 'true';
}

export function setHapticsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HAPTICS_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('stj_sound_haptics_updated'));
}

/**
 * Plays a soft, uplifting harmonic chime for correct answers / milestones.
 * Major triad: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
 */
export function playSuccessChime(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      // Envelope: gentle attack, pleasant ring, smooth exponential fade
      const startTime = now + idx * 0.08;
      const duration = 0.28;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {
    console.warn('[Sound Engine] Chime play error:', err);
  }
}

/**
 * Plays a warm, gentle formative tone for incorrect answers.
 * Low, encouraging minor/fourth transition (A3 220Hz -> F3 174Hz).
 * Purposefully designed to be gentle, friendly, and non-punitive.
 */
export function playIncorrectTone(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now); // A3
    osc.frequency.exponentialRampToValueAtTime(174.61, now + 0.16); // F3

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.24);
  } catch (err) {
    console.warn('[Sound Engine] Tone play error:', err);
  }
}

/**
 * Subtle 10ms micro-click for interactive tactile button presses.
 */
export function playClickTone(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.015);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch (err) {}
}

/**
 * Celebratory 4-note ascending fanfare when a student completes a unit/lab.
 */
export function playCelebrationFanfare(): void {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === notes.length - 1 ? 'triangle' : 'sine';
      const startTime = now + idx * 0.1;
      const duration = idx === notes.length - 1 ? 0.45 : 0.25;

      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.14, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  } catch (err) {}
}

/**
 * Haptic feedback trigger for physical touch devices (phones and tablets).
 */
export function triggerHapticSuccess(): void {
  if (!isHapticsEnabled() || typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate([18, 30, 22]);
  } catch {}
}

export function triggerHapticError(): void {
  if (!isHapticsEnabled() || typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate([25, 45, 25]);
  } catch {}
}

export function triggerHapticClick(): void {
  if (!isHapticsEnabled() || typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    navigator.vibrate(8);
  } catch {}
}
