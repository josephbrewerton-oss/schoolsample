// src/services/playerLauncher.ts
/**
 * Global Media Player Call Service
 * Enables any component, script, or page across the portal to programmatically
 * launch or embed the AST Vector Media Player.
 */

export type VectorPresetId =
  | 'fractions'
  | 'solar-system'
  | 'church-tour'
  | 'photosynthesis'
  | 'pythagoras'
  | 'atom'
  | 'cell-mitosis'
  | 'velocity'
  | 'dna-helix';

export interface PlayerCallOptions {
  preset?: VectorPresetId;
  title?: string;
  autoPlay?: boolean;
  lang?: string;
}

type PlayerListener = (options: PlayerCallOptions | null) => void;

const listeners = new Set<PlayerListener>();
let currentOptions: PlayerCallOptions | null = null;

/**
 * Intelligent topic-to-preset resolver
 */
export function resolvePresetForTopic(subject?: string, unit?: string, topic?: string): VectorPresetId {
  const s = (subject || '').toLowerCase();
  const u = (unit || '').toLowerCase();
  const t = (topic || '').toLowerCase();
  const combined = `${s} ${u} ${t}`;

  if (combined.includes('relig') || combined.includes('catholic') || combined.includes('church') || combined.includes('sanctuary') || combined.includes('eucharist') || combined.includes('mass')) {
    return 'church-tour';
  }
  if (combined.includes('photo') || combined.includes('plant') || combined.includes('leaf') || combined.includes('botan')) {
    return 'photosynthesis';
  }
  if (combined.includes('pythag') || combined.includes('triangle') || combined.includes('hypotenuse') || combined.includes('geometry')) {
    return 'pythagoras';
  }
  if (combined.includes('atom') || combined.includes('bohr') || combined.includes('electron') || combined.includes('nucleus') || combined.includes('chem')) {
    return 'atom';
  }
  if (combined.includes('mitosis') || combined.includes('cell division') || combined.includes('cytokinesis') || combined.includes('prophase')) {
    return 'cell-mitosis';
  }
  if (combined.includes('velocity') || combined.includes('speed') || combined.includes('vector') || combined.includes('acceleration') || combined.includes('physics')) {
    return 'velocity';
  }
  if (combined.includes('dna') || combined.includes('helix') || combined.includes('genet') || combined.includes('chromosome') || combined.includes('nucleotide')) {
    return 'dna-helix';
  }
  if (combined.includes('math') || combined.includes('fraction') || combined.includes('decimal') || combined.includes('ratio')) {
    return 'fractions';
  }
  if (combined.includes('science') || combined.includes('space') || combined.includes('solar') || combined.includes('planet') || combined.includes('orbit')) {
    return 'solar-system';
  }

  // Educational teaching default
  return 'fractions';
}

/**
 * Calls the player modal across the application
 */
export function openPlayerModal(options: PlayerCallOptions = {}): void {
  currentOptions = {
    preset: options.preset || 'fractions',
    title: options.title || 'Curriculum Vector Media Player',
    autoPlay: options.autoPlay ?? true,
    lang: options.lang || 'en',
  };
  listeners.forEach((listener) => listener(currentOptions));
}

/**
 * Closes the player modal
 */
export function closePlayerModal(): void {
  currentOptions = null;
  listeners.forEach((listener) => listener(null));
}

/**
 * Subscribes to player launch/close events
 */
export function subscribeToPlayerCalls(listener: PlayerListener): () => void {
  listeners.add(listener);
  // Replay current state immediately
  if (currentOptions) {
    listener(currentOptions);
  }
  return () => {
    listeners.delete(listener);
  };
}

// Global browser window invocation hook
if (typeof window !== 'undefined') {
  (window as any).callMediaPlayer = (presetOrOptions?: string | PlayerCallOptions) => {
    if (typeof presetOrOptions === 'string') {
      openPlayerModal({ preset: presetOrOptions as VectorPresetId });
    } else if (presetOrOptions && typeof presetOrOptions === 'object') {
      openPlayerModal(presetOrOptions);
    } else {
      openPlayerModal({ preset: 'fractions' });
    }
  };
}
