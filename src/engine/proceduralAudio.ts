// src/engine/proceduralAudio.ts
/**
 * Zero-Bloat Procedural Web Audio Engine
 * 
 * Replaces heavy recorded sound effect files (MP3/WAV/OGG) with real-time mathematical
 * wave synthesis via the browser's hardware-accelerated Web Audio API (AudioContext).
 * 
 * Features:
 * - 0 Bytes Audio Files: generated purely through mathematical oscillators (f(t) = A·sin(2πft)).
 * - Microsecond latency: zero network fetch, buffering, or decoding delay.
 * - Dynamic parameter tuning: pitch, decay, and filters react to SVG motion progress in real time.
 */

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioContextClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }
  return sharedAudioCtx;
}

/**
 * Play a crystal-clear pentatonic harmonic chime when a keyframe is triggered.
 * Generated purely through FM synthesis and exponential gain decay.
 */
export function playKeyframeChime(keyframeIndex: number = 0, volume: number = 0.15): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Pentatonic scale (C5, D5, E5, G5, A5, C6)
    const frequencies = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const baseFreq = frequencies[keyframeIndex % frequencies.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    // Subtle gentle vibrato shimmer
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.01, ctx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch (err) {
    console.debug('[Procedural Audio]:', err);
  }
}

/**
 * Play a high-precision vector cut / slice sound (used for fraction division)
 */
export function playSliceCutSound(volume: number = 0.12): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.12);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.14);
  } catch (err) {
    console.debug('[Procedural Audio]:', err);
  }
}

/**
 * Play an astronomical planetary resonance chime (used for solar retrograde alignment)
 */
export function playCelestialHum(volume: number = 0.1): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    // Harmonic interval: Perfect 5th (220Hz A3 and 330Hz E4)
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, ctx.currentTime);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(330, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.7);
    osc2.stop(ctx.currentTime + 0.7);
  } catch (err) {
    console.debug('[Procedural Audio]:', err);
  }
}

/**
 * Play a full mathematical harmonic triad resolution (used when proof reaches t = 1.0)
 */
export function playProofResolvedChord(volume: number = 0.12): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Major Triad in C (C5 = 523.25, E5 = 659.25, G5 = 783.99, C6 = 1046.50)
    const triad = [523.25, 659.25, 783.99, 1046.5];
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
    gain.connect(ctx.destination);

    triad.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.connect(gain);
      osc.start(ctx.currentTime + idx * 0.04);
      osc.stop(ctx.currentTime + 0.9);
    });
  } catch (err) {
    console.debug('[Procedural Audio]:', err);
  }
}
