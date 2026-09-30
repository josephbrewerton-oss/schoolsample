// src/services/challengeLauncher.ts
/**
 * Global Challenge & Educational Game Launcher Service
 * 
 * Provides zero-bloat, pedagogically grounded challenge games intrinsically
 * coupled to curriculum topics (Concrete-Pictorial-Abstract, Active Recall,
 * Micro-Physics, and Liturgical Sequence).
 */

import { VectorPresetId, resolvePresetForTopic } from './playerLauncher';

export type ChallengeType =
  | 'math-fishing'       // Number Bonds & CPA Addition/Subtraction
  | 'mountain-climber'   // Altitude, Hypotenuse & Micro-Physics Gravity jump
  | 'liturgy-sequence'   // Liturgical Sequence & Sacred Architecture
  | 'neural-logic'       // Logic Gates, Binary & Computational Thinking
  | 'vector-lab'         // Interactive Vector Lab with Socratic Checkpoints
  | 'shakespeare-theatre'; // 1599 Globe Theatre, Iambic Scansion & Soliloquy Director

export interface ChallengeMetadata {
  type: ChallengeType;
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  preset?: VectorPresetId;
  subject: string;
  unit: string;
  keyStage?: string;
}

export interface ChallengeCallOptions {
  challenge: ChallengeMetadata;
  autoStart?: boolean;
}

type ChallengeListener = (options: ChallengeCallOptions | null) => void;

const listeners = new Set<ChallengeListener>();
let currentOptions: ChallengeCallOptions | null = null;

/**
 * Intelligent topic-to-challenge resolver.
 * Maps any subject, unit, and lesson to its most authentic educational challenge.
 */
export function resolveChallengeForTopic(
  subject?: string,
  unit?: string,
  topic?: string,
  keyStage?: string
): ChallengeMetadata {
  const s = (subject || '').toLowerCase();
  const u = (unit || '').toLowerCase();
  const t = (topic || '').toLowerCase();
  const ks = (keyStage || '').toLowerCase();
  const combined = `${s} ${u} ${t} ${ks}`;

  // 1. Catholic RE / Liturgy / Sacraments / Mass / Creed
  if (
    combined.includes('relig') ||
    combined.includes('catholic') ||
    combined.includes('communion') ||
    combined.includes('eucharist') ||
    combined.includes('sacrament') ||
    combined.includes('mass') ||
    combined.includes('creed') ||
    combined.includes('rosary')
  ) {
    return {
      type: 'liturgy-sequence',
      title: 'Order of the Mass & Sacred Space Quest',
      badge: 'Sequence & Sacred Architecture',
      badgeColor: '#7c3aed',
      icon: '⛪',
      description: 'Can you reconstruct the holy sequence of the Mass and explore the 3D sacred sanctuary without errors?',
      preset: 'church-tour',
      subject: subject || 'Religious Education',
      unit: unit || 'The Mass & Sacraments',
      keyStage,
    };
  }

  // 1b. Shakespeare, Drama, English Literature, Poetry, Soliloquy
  if (
    combined.includes('shakespear') ||
    combined.includes('macbeth') ||
    combined.includes('hamlet') ||
    combined.includes('romeo') ||
    combined.includes('juliet') ||
    combined.includes('theatre') ||
    combined.includes('theater') ||
    combined.includes('drama') ||
    combined.includes('soliloquy') ||
    combined.includes('poetry') ||
    combined.includes('iambic') ||
    combined.includes('playwright')
  ) {
    return {
      type: 'shakespeare-theatre',
      title: 'The Globe Theatre: Iambic Meter & Soliloquy Director',
      badge: 'Shakespearean Drama & Rhythm',
      badgeColor: '#b45309',
      icon: '🎭',
      description: 'Step onto the 1599 Globe thrust stage! Master iambic pentameter scansion, adjust the First Folio translation slider, and direct the soliloquy.',
      preset: 'shakespeare',
      subject: subject || 'English Literature',
      unit: unit || 'Shakespearean Drama',
      keyStage,
    };
  }

  // 2. Mountain, Altitude, Trigonometry, Forces, Gravity, Kinetic Energy, Physics
  if (
    combined.includes('mountain') ||
    combined.includes('altitude') ||
    combined.includes('elevation') ||
    combined.includes('climb') ||
    combined.includes('force') ||
    combined.includes('gravity') ||
    combined.includes('motion') ||
    combined.includes('kinetic') ||
    combined.includes('hypotenuse') ||
    combined.includes('velocity')
  ) {
    return {
      type: 'mountain-climber',
      title: 'Summit Expedition & Altitude Physics Challenge',
      badge: 'Micro-Physics & Gravity Challenge',
      badgeColor: '#0284c7',
      icon: '🧗',
      description: 'Scale the 3,000m alpine peak! Balance stamina, oxygen consumption, and gravity jumps while applying physics.',
      preset: 'mountain-elevation',
      subject: subject || 'Science',
      unit: unit || 'Forces & Motion',
      keyStage,
    };
  }

  // 3. Mathematics: Primary Number Bonds, Addition, Subtraction, Counting (KS1 & early KS2)
  if (
    (s.includes('math') || combined.includes('number') || combined.includes('addition') || combined.includes('subtraction') || combined.includes('counting') || combined.includes('bond')) &&
    !combined.includes('fraction') &&
    !combined.includes('pythag') &&
    !combined.includes('algebra')
  ) {
    return {
      type: 'math-fishing',
      title: 'Number Bonds Pond Adventure',
      badge: 'CPA Concrete Ten-Frames Challenge',
      badgeColor: '#059669',
      icon: '🎣',
      description: 'Cast your line into the vector pond! Hook swimming fish with subitising Ten-Frame dots to lock in number bonds.',
      preset: 'fractions',
      subject: subject || 'Mathematics',
      unit: unit || 'Number Bonds & Addition',
      keyStage,
    };
  }

  // 4. Computing, Coding, Logic Gates, Binary, AI, Computational Thinking
  if (
    combined.includes('comput') ||
    combined.includes('logic') ||
    combined.includes('algorithm') ||
    combined.includes('binary') ||
    combined.includes('neural') ||
    combined.includes('code')
  ) {
    return {
      type: 'neural-logic',
      title: 'Neural Logic & Binary Truth Challenge',
      badge: 'Computational Thinking Arena',
      badgeColor: '#4f46e5',
      icon: '⚡',
      description: 'Adjust synaptic weights, evaluate Boolean logic gates, and prove computational mastery on the live canvas.',
      subject: subject || 'Computing',
      unit: unit || 'Algorithms & Logic',
      keyStage,
    };
  }

  // 5. Mathematics: Fractions, Decimals, Ratios, Geometry
  if (
    combined.includes('fraction') ||
    combined.includes('decimal') ||
    combined.includes('ratio') ||
    combined.includes('pythag') ||
    combined.includes('geometry') ||
    s.includes('math')
  ) {
    const isPythag = combined.includes('pythag') || combined.includes('triangle');
    const preset: VectorPresetId = isPythag ? 'pythagoras' : 'fractions';
    return {
      type: 'vector-lab',
      title: isPythag ? 'Pythagorean Hypotenuse Proof Lab' : 'Fraction Equivalence Precision Slicer',
      badge: 'Concrete Geometric Proof',
      badgeColor: '#d97706',
      icon: isPythag ? '📐' : '🍰',
      description: 'Manipulate the live geometric proof, slice mathematical units, and conquer the Socratic active recall checkpoints.',
      preset,
      subject: subject || 'Mathematics',
      unit: unit || 'Fractions & Proportions',
      keyStage,
    };
  }

  // 6. Science / Biology / Chemistry / Nature (Photosynthesis, Cells, Atoms, Water Cycle)
  const resolvedPreset = resolvePresetForTopic(subject, unit, topic);
  return {
    type: 'vector-lab',
    title: `${unit || topic || 'Scientific'} Interactive Discovery Lab`,
    badge: 'Active Recall Investigation',
    badgeColor: '#0284c7',
    icon: '🔬',
    description: 'Explore the living vector model, trigger dynamic states, and test your understanding at critical conceptual milestones.',
    preset: resolvedPreset,
    subject: subject || 'Science',
    unit: unit || 'Scientific Principles',
    keyStage,
  };
}

/**
 * Opens the global challenge modal
 */
export function openChallengeModal(options: ChallengeCallOptions): void {
  currentOptions = options;
  listeners.forEach((listener) => listener(currentOptions));
}

/**
 * Closes the global challenge modal
 */
export function closeChallengeModal(): void {
  currentOptions = null;
  listeners.forEach((listener) => listener(null));
}

/**
 * Subscribes to challenge calls
 */
export function subscribeToChallengeCalls(listener: ChallengeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
