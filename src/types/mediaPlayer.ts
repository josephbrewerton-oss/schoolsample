// src/types/mediaPlayer.ts
/**
 * AST-Guided Vector Media Player Types & Schema Definitions
 * 
 * Corresponds to /static/patterns/media-player.ast
 */

export interface ASTKeyframe {
  /** Normalized timeline milestone (0.00 to 1.00) */
  t: number;
  /** Short milestone title, e.g. "Step 1: Unequal Slices" */
  title: string;
  /** Core pedagogical rule or axiom being demonstrated */
  rule: string;
  /** Optional mathematical formula or LaTeX snippet */
  mathNotation?: string;
  /** Optional alert highlighting a common pupil misconception */
  misconceptionAlert?: string;
}

export interface ASTSubtitle {
  /** Start timestamp (0.00 to 1.00) */
  start: number;
  /** End timestamp (0.00 to 1.00) */
  end: number;
  /** English narrative caption */
  en: string;
  /** Optional localized translations for real-time speech and subtitles */
  es?: string;
  fr?: string;
  de?: string;
  it?: string;
  pl?: string;
  pt?: string;
  uk?: string;
  ar?: string;
  la?: string;
  [langCode: string]: string | number | undefined;
}

export interface ASTAudioCue {
  /** Timestamp trigger (0.00 to 1.00) */
  t: number;
  /** Procedural chime/frequency preset (e.g. 'slice', 'resolve', 'orbit', 'sparkle') */
  cue: 'slice' | 'resolve' | 'orbit' | 'sparkle' | 'chime';
  frequencyHz?: number;
}

export interface ASTSceneDefinition {
  /** Unique identifier for the scene, e.g. 'fractions' */
  id: string;
  /** National Curriculum Key Stage level, e.g. 'KS2 MATHS', 'KS3 SCIENCE' */
  stage: string;
  /** Lesson title */
  title: string;
  /** Full duration of one loop cycle in seconds, e.g. 12.0 */
  duration: number;
  /** SVG coordinate system boundaries (defaults to '0 0 800 480') */
  viewBox?: string;
  /** Master easing curve for parametric interpolation */
  easing?: 'linear' | 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'cubic';
  /** Chronological milestones */
  keyframes: ASTKeyframe[];
  /** Synchronized multilingual captions */
  subtitles: ASTSubtitle[];
  /** Optional audio frequency cues */
  audioCues?: ASTAudioCue[];
  /** Optional declarative vector elements */
  elements?: Array<Record<string, any>>;
  /** Optional zero-bloat interactivity specification */
  interactive?: {
    hotspots?: Array<{ id: string; label: string; targetT: number; hint?: string }>;
    checkpoints?: Array<{
      t: number;
      title?: string;
      prompt: string;
      options: string[];
      answer: number;
      explanation?: string;
    }>;
  };
  /**
   * Procedural SVG render function.
   * Receives normalized continuous time progress t (0.00 to 1.00)
   * and returns raw sanitized SVG element strings (<path>, <circle>, etc.).
   */
  render?: (t: number) => string;
}

/**
 * Commands sent from Parent App to iFrame Media Player
 */
export type ASTPlayerCommand =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'TOGGLE_PLAY' }
  | { type: 'SEEK'; progress: number }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'SET_LANG'; lang: string }
  | { type: 'SET_PRESET'; preset: string }
  | { type: 'SET_THEME'; theme: 'dark' | 'light' }
  | { type: 'REQUEST_PRINT' }
  | { type: 'LOAD_AST'; ast: ASTSceneDefinition | string }
  | { type: 'PING' };

/**
 * Telemetry events dispatched from iFrame Media Player to Parent App
 */
export type ASTPlayerTelemetry =
  | { type: 'PLAYER_READY'; version: string; preset: string; presets: Array<{ id: string; title: string; stage: string }> }
  | { type: 'TIME_UPDATE'; progress: number; currentTime: number; duration: number }
  | { type: 'KEYFRAME_REACHED'; index: number; title: string; rule: string; progress: number }
  | { type: 'STATE_CHANGE'; isPlaying: boolean; speed: number }
  | { type: 'PRESET_LOADED'; preset: string; title: string; duration: number }
  | { type: 'LANG_CHANGE'; lang: string }
  | { type: 'PONG'; ready: boolean; version: string };

/**
 * Builder helper to create a strictly-typed AST Scene Definition
 */
export function defineASTScene(scene: ASTSceneDefinition): ASTSceneDefinition {
  if (!scene.id) throw new Error('Scene must have an id');
  if (!scene.title) throw new Error('Scene must have a title');
  if (typeof scene.duration !== 'number' || scene.duration <= 0) {
    throw new Error('Scene must have a positive duration in seconds');
  }
  if (!Array.isArray(scene.keyframes)) scene.keyframes = [];
  if (!Array.isArray(scene.subtitles)) scene.subtitles = [];
  if (typeof scene.render !== 'function' && !Array.isArray(scene.elements)) {
    throw new Error('Scene must provide either a render(t: number): string function or an elements array');
  }
  return scene;
}
