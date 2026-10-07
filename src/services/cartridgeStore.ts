// src/services/cartridgeStore.ts
/**
 * St. Joseph's Decentralized Curriculum Cartridge Store
 * 
 * Decentralized, client-side, zero-cloud storage and lifecycle engine for:
 * 1. Built-in Core STEM & Humanities Cartridges
 * 2. Imported PhET Interactive Simulations (HTML5, SWF, JSON)
 * 3. Teacher/Student User-Authored Cartridges
 * 4. Multi-Lesson Air-Gapped Cartridge Bundles
 * 
 * Invariants:
 * - 0% cloud database dependency (100% browser IndexedDB / LocalStorage persistence)
 * - True decentralization: Cartridges run standalone anywhere on GitHub Pages, offline, or air-gapped
 * - Instant PhET & Flash SWF distillation down to < 4 KB AST S-Expressions
 */

import { transpilePhetFile, isPhetBundle, extractPhetMetadata } from '../utils/phetBridge';
import { transpileSwfToAst } from '../utils/swfAstParser';

export interface CartridgeDefinition {
  id: string;
  title: string;
  stage: string;
  category: string;
  desc: string;
  icon: string;
  source: 'builtin' | 'phet' | 'user' | 'imported';
  svgMarkup?: string;
  astSource?: string;
  svgFile?: string;
  astFile?: string;
  author?: string;
  version?: string;
  invariants?: string[];
  createdAt?: number;
  updatedAt?: number;
}

export interface CartridgeBundle {
  id: string;
  title: string;
  description: string;
  cartridgeIds: string[];
  createdAt?: number;
}

const STORAGE_KEY_CUSTOM_CARTRIDGES = 'stj_custom_cartridges_v1';
const STORAGE_KEY_CUSTOM_BUNDLES = 'stj_custom_bundles_v1';

// Canonical Alias Map for fault-tolerant decentralized matching (e.g. spelling variants)
export const CARTRIDGE_ALIASES: Record<string, string> = {
  'pythagorus': 'pythagoras',
  'pythagoras-theorem': 'pythagoras',
  'pythagoras-proof': 'pythagoras',
  'ohms-law': 'electric-circuits',
  'phet-ohms-law': 'electric-circuits',
  'circuits': 'electric-circuits',
  'circuit': 'electric-circuits',
  'gas': 'kinetic-gas',
  'boyles-law': 'kinetic-gas',
  'curves': 'calculus-curves',
  'calculus': 'calculus-curves',
  'aquarium': 'fish-tank',
  'fish': 'fish-tank',
  'fishing': 'math-fishing',
  'mountain': 'mountain-elevation',
  'climber': 'mountain-elevation',
  'photosynth': 'photosynthesis',
  'leaf': 'photosynthesis',
  'stars': 'solar-system',
  'space': 'solar-system',
  'balance': 'algebra-balance',
  'algebra': 'algebra-balance',
};

// Built-in Core Curriculum Cartridge Catalog
export const BUILTIN_CARTRIDGES: CartridgeDefinition[] = [
  {
    id: 'pythagoras',
    title: "Pythagoras' Theorem (a² + b² = c²)",
    stage: 'KS3 MATHS & GEOMETRY',
    category: 'Mathematics',
    desc: 'Dynamic right triangle proof with live drag handles, numeric figure steppers, dynamic unit tile subgrids, and area conservation (a² + b² = c²).',
    icon: '📐',
    source: 'builtin',
    svgFile: 'scenes/pythagoras.svg',
    astFile: 'scenes/pythagoras.ast',
    version: '2.6.0',
    invariants: ['Euclidean Area Conservation', 'Dynamic Pythagorean Triples', 'Unit Tile Counting'],
  },
  {
    id: 'algebra-balance',
    title: 'Algebraic Balance Scale: Preserving Equality (2x + 5 = 15)',
    stage: 'KS2/KS3 MATHS',
    category: 'Mathematics',
    desc: 'Physical 2-pan balance scale demystifying linear equations. Whatever operation you apply to one side, you must apply to the other to preserve equilibrium.',
    icon: '⚖️',
    source: 'builtin',
    svgFile: 'scenes/algebra-balance.svg',
    astFile: 'scenes/algebra-balance.ast',
    version: '2.6.0',
    invariants: ['Conservation of Mass', 'Additive Invariance', 'Multiplicative Invariance'],
  },
  {
    id: 'electric-circuits',
    title: "Electrical Circuits & Ohm's Law (V = I × R)",
    stage: 'KS2/KS3 PHYSICS',
    category: 'Science',
    desc: 'Live closed-loop circuit with electron charge kinematics, battery electromotive force, resistance dissipation, and lightbulb filament luminance.',
    icon: '💡',
    source: 'builtin',
    svgFile: 'scenes/electric-circuits.svg',
    astFile: 'scenes/electric-circuits.ast',
    version: '2.6.0',
    invariants: ["Ohm's Law", 'Kirchhoff Voltage Loop', 'Electron Drift Velocity'],
  },
  {
    id: 'kinetic-gas',
    title: "Kinetic Gas Theory & Boyle's Law (PV = nRT)",
    stage: 'KS3/KS4 PHYSICS & CHEMISTRY',
    category: 'Science',
    desc: 'Real-time particle kinematics in a compression cylinder with temperature heater, pressure gauge, and Maxwell-Boltzmann velocity distribution.',
    icon: '🌡️',
    source: 'builtin',
    svgFile: 'scenes/kinetic-gas.svg',
    astFile: 'scenes/kinetic-gas.ast',
    version: '2.6.0',
    invariants: ["Boyle's Law", 'Ideal Gas Law', 'Kinetic Theory of Gases'],
  },
  {
    id: 'calculus-curves',
    title: 'Calculus: Tangent Slopes (dy/dx) & Definite Integrals (∫)',
    stage: 'GCSE & A-LEVEL MATHS',
    category: 'Mathematics',
    desc: 'Interactive tangent probe gliding over quadratic & cubic curves with real-time derivative secant limit and Riemann sum area accumulation.',
    icon: '📈',
    source: 'builtin',
    svgFile: 'scenes/calculus-curves.svg',
    astFile: 'scenes/calculus-curves.ast',
    version: '2.6.0',
    invariants: ['First Derivative Tangent Limit', 'Riemann Integral Sum', 'Continuity'],
  },
  {
    id: 'bodmas',
    title: 'BODMAS / BIDMAS: Forcefield & Magnetic Clamping',
    stage: 'KS2/KS3 MATHS',
    category: 'Mathematics',
    desc: 'Interactive operator physics: titanium bracket shields, magnetic multiplication clamps, and concrete Area Model showing why 5 + 3 × 4 ≠ 32.',
    icon: '🧮',
    source: 'builtin',
    svgFile: 'scenes/bodmas.svg',
    astFile: 'scenes/bodmas.ast',
    version: '2.6.0',
    invariants: ['Order of Operations', 'Distributive Property'],
  },
  {
    id: 'times-tables',
    title: 'Times Tables Arrays & Distributive Splitter (12×12)',
    stage: 'KS1/KS2 MATHS',
    category: 'Mathematics',
    desc: 'Visual 2D arrays, 90° commutative rotation, and mental arithmetic decomposition: 7 × 8 = (7 × 5) + (7 × 3) = 56.',
    icon: '📐',
    source: 'builtin',
    svgFile: 'scenes/times-tables.svg',
    astFile: 'scenes/times-tables.ast',
    version: '2.6.0',
    invariants: ['Commutative Property', 'Distributive Property'],
  },
  {
    id: 'fractions',
    title: 'Fractions & Proportions',
    stage: 'KS2 MATHS',
    category: 'Mathematics',
    desc: 'Visual slice partitioning, equivalent denominators, and geometric whole unit assembly.',
    icon: '🥧',
    source: 'builtin',
    svgFile: 'scenes/fractions.svg',
    astFile: 'scenes/fractions.ast',
    version: '2.6.0',
    invariants: ['Common Denominator Equivalence', 'Whole Conservation'],
  },
  {
    id: 'fish-tank',
    title: 'Aquarium Living Ecosystem & Boids Flocking Benchmark',
    stage: 'BENCHMARK & STRESS LAB',
    category: 'Diagnostics & Games',
    desc: 'Autonomous multi-species boids flocking simulation with acoustic glass-tap scatter, stage tap feeding, and frame render budget monitoring.',
    icon: '🐠',
    source: 'builtin',
    svgFile: 'scenes/fish-tank.svg',
    astFile: 'scenes/fish-tank.ast',
    version: '2.6.0',
    invariants: ['Craig Reynolds Boid Flocking', 'Continuous Velocity Verlet'],
  },
  {
    id: 'solar-system',
    title: 'Solar System Planetary Orbits',
    stage: 'KS3 SCIENCE',
    category: 'Science',
    desc: '3D Heliocentric orbital velocities, Keplerian mechanics, and scale celestial dynamics.',
    icon: '🪐',
    source: 'builtin',
    svgFile: 'scenes/solar-system.svg',
    astFile: 'scenes/solar-system.ast',
    version: '2.6.0',
    invariants: ["Kepler's Laws of Planetary Motion", 'Gravitational Central Force'],
  },
  {
    id: 'photosynthesis',
    title: 'Photosynthesis & Leaf Anatomy',
    stage: 'KS3 BIOLOGY',
    category: 'Science',
    desc: 'Light-dependent chloroplast reactions, stomata gas exchange, and glucose synthesis rate limiter.',
    icon: '🍃',
    source: 'builtin',
    svgFile: 'scenes/photosynthesis.svg',
    astFile: 'scenes/photosynthesis.ast',
    version: '2.6.0',
    invariants: ['Conservation of Carbon & Oxygen Atoms', 'Blackman Limiting Factors'],
  },
  {
    id: 'atom',
    title: 'Atomic Structure: Bohr Electron Shells',
    stage: 'KS3 CHEMISTRY',
    category: 'Science',
    desc: 'Quantized electron orbits (2, 8, 8), proton/neutron nucleus binding, and valence energy states.',
    icon: '⚛️',
    source: 'builtin',
    svgFile: 'scenes/atom.svg',
    astFile: 'scenes/atom.ast',
    version: '2.6.0',
    invariants: ['Bohr Angular Momentum Quantization', 'Nuclear Charge Balance'],
  },
  {
    id: 'velocity',
    title: 'Velocity Vectors & Kinematics',
    stage: 'KS3 PHYSICS',
    category: 'Science',
    desc: 'Continuous motion physics, displacement vectors, velocity-time graph area accumulation, and acceleration mechanics.',
    icon: '🏎️',
    source: 'builtin',
    svgFile: 'scenes/velocity.svg',
    astFile: 'scenes/velocity.ast',
    version: '2.6.0',
    invariants: ['Newtonian Kinematics', 'Displacement Calculus'],
  },
  {
    id: 'mountain-elevation',
    title: 'Mountain Altitude: Climber Game & Trigonometry',
    stage: 'KS2/KS3 MATHS & GEOGRAPHY',
    category: 'Games & Simulations',
    desc: 'Interactive hill climber game contrasting vertical altitude against slope distance, right-angle hypotenuse, and atmospheric lapse rate.',
    icon: '🧗',
    source: 'builtin',
    svgFile: 'scenes/mountain-elevation.svg',
    astFile: 'scenes/mountain-elevation.ast',
    version: '2.6.0',
    invariants: ['Trigonometric Ratios (sin, cos, tan)', 'Atmospheric Lapse Rate'],
  },
  {
    id: 'math-fishing',
    title: 'Math Pond: Number Bonds Fishing Game',
    stage: 'KS1/KS2 MATHS',
    category: 'Games & Simulations',
    desc: 'Interactive vector pond fishing adventure: hook swimming fish to solve number bonds to 10 & 20, doubles, and mental arithmetic.',
    icon: '🎣',
    source: 'builtin',
    svgFile: 'scenes/math-fishing.svg',
    astFile: 'scenes/math-fishing.ast',
    version: '2.6.0',
    invariants: ['Additive Part-Whole Number Bonds', 'Combinatorics'],
  },
  {
    id: 'dna-helix',
    title: 'DNA Double Helix & Base Pairs',
    stage: 'KS3 GENETICS',
    category: 'Science',
    desc: 'Antiparallel sugar-phosphate backbone and hydrogen-bonded A-T / C-G base pairing.',
    icon: '🧬',
    source: 'builtin',
    svgFile: 'scenes/dna-helix.svg',
    astFile: 'scenes/dna-helix.ast',
    version: '2.6.0',
    invariants: ['Watson-Crick Complementary Base Pairing', 'Double Helix Pitch'],
  },
  {
    id: 'phonics-lab',
    title: 'Early Phonics: Sound Buttons & Blending Mat',
    stage: 'EYFS/KS1 PHONICS',
    category: 'Early Literacy & Phonics',
    desc: 'Synthetic phonics soundboard, interactive sound button blending mat, tricky words, and Alien Words Screening Check.',
    icon: '🔤',
    source: 'builtin',
    svgFile: 'scenes/phonics-lab.svg',
    astFile: 'scenes/phonics-lab.ast',
    version: '2.6.0',
    invariants: ['Phoneme-Grapheme Correspondence', 'Synthetic Blending'],
  },
  {
    id: 'church-tour',
    title: 'Catholic Church Sanctuary Tour',
    stage: 'CATHOLIC LIFE',
    category: 'Catholic Faith',
    desc: 'Latin cross basilica architecture, Nave, High Altar, golden Tabernacle, and Marian Chapel.',
    icon: '⛪',
    source: 'builtin',
    svgFile: 'scenes/church-tour.svg',
    astFile: 'scenes/church-tour.ast',
    version: '2.6.0',
    invariants: ['Sacred Architecture', 'Latin Cross Basilica Proportions'],
  },
  {
    id: 'water-cycle',
    title: 'Water Cycle: Continuous Earth Cycle',
    stage: 'KS2 GEOGRAPHY',
    category: 'Geography & Science',
    desc: 'Solar evaporation, condensation cloud formation, precipitation, and groundwater runoff loop.',
    icon: '💧',
    source: 'builtin',
    svgFile: 'scenes/water-cycle.svg',
    astFile: 'scenes/water-cycle.ast',
    version: '2.6.0',
    invariants: ['Hydrological Mass Conservation', 'Phase Change Thermodynamics'],
  },
];

// Fallback embedded SVG & AST for core cartridges when running completely air-gapped
export const EMBEDDED_CORE_CARTRIDGES: Record<string, { svg: string; ast: string }> = {
  pythagoras: {
    svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="pyth-bg-glow" cx="50%" cy="55%" r="70%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </radialGradient>
    <linearGradient id="pyth-grad-a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#34d399" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#059669" stop-opacity="0.7" />
    </linearGradient>
    <linearGradient id="pyth-grad-b" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.7" />
    </linearGradient>
    <linearGradient id="pyth-grad-c" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#d97706" stop-opacity="0.7" />
    </linearGradient>
    <filter id="pyth-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>
  <rect width="800" height="480" fill="url(#pyth-bg-glow)" />
  <g transform="translate(180, 20)">
    <rect width="440" height="44" rx="10" fill="#0f172a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.5" />
    <text x="220" y="28" fill="#f8fafc" font-size="16" font-weight="800" text-anchor="middle">
      <tspan fill="#34d399">a² (9)</tspan> + <tspan fill="#60a5fa">b² (16)</tspan> = <tspan fill="#fbbf24">c² (25)</tspan> ➔ 3² + 4² = 5²
    </text>
  </g>
  <g id="pyth-group-a">
    <rect id="pyth-rect-a" x="360" y="190" width="0" height="90" fill="url(#pyth-grad-a)" stroke="#10b981" stroke-width="2" rx="4" data-draggable="pyth-handle-a" style="cursor:ns-resize;" />
    <g id="pyth-grid-a" opacity="0.4" stroke="#ffffff" stroke-width="0.8" pointer-events="none"></g>
    <text id="pyth-txt-a" x="315" y="240" fill="#ffffff" font-size="16" font-weight="800" text-anchor="middle" opacity="1" filter="url(#pyth-glow)" pointer-events="none">a² = 9</text>
  </g>
  <g id="pyth-group-b">
    <rect id="pyth-rect-b" x="360" y="280" width="120" height="0" fill="url(#pyth-grad-b)" stroke="#3b82f6" stroke-width="2" rx="4" data-draggable="pyth-handle-b" style="cursor:ew-resize;" />
    <g id="pyth-grid-b" opacity="0.4" stroke="#ffffff" stroke-width="0.8" pointer-events="none"></g>
    <text id="pyth-txt-b" x="420" y="345" fill="#ffffff" font-size="16" font-weight="800" text-anchor="middle" opacity="1" filter="url(#pyth-glow)" pointer-events="none">b² = 16</text>
  </g>
  <g id="pyth-group-c">
    <g id="pyth-rot-c" transform="translate(360, 190) rotate(-36.87)">
      <rect id="pyth-rect-c" x="0" y="-150" width="150" height="150" fill="url(#pyth-grad-c)" stroke="#f59e0b" stroke-width="2" rx="4" />
      <g id="pyth-grid-c" opacity="0.4" stroke="#ffffff" stroke-width="0.8" pointer-events="none"></g>
      <text id="pyth-txt-c" x="75" y="-70" fill="#ffffff" font-size="18" font-weight="900" text-anchor="middle" filter="url(#pyth-glow)" pointer-events="none">c² = 25</text>
    </g>
  </g>
  <polygon id="pyth-triangle" points="360,280 480,280 360,190" fill="#0f172a" fill-opacity="0.85" stroke="#38bdf8" stroke-width="3.5" stroke-linejoin="round" />
  <rect id="pyth-right-angle" x="360" y="262" width="18" height="18" fill="none" stroke="#94a3b8" stroke-width="2" />
  <g id="pyth-handle-a" data-draggable="pyth-handle-a" style="cursor:ns-resize;">
    <circle cx="360" cy="190" r="14" fill="#10b981" stroke="#ffffff" stroke-width="3" filter="url(#pyth-glow)" />
    <text x="360" y="195" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" pointer-events="none">a</text>
  </g>
  <g id="pyth-handle-b" data-draggable="pyth-handle-b" style="cursor:ew-resize;">
    <circle cx="480" cy="280" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="3" filter="url(#pyth-glow)" />
    <text x="480" y="285" fill="#ffffff" font-size="11" font-weight="900" text-anchor="middle" pointer-events="none">b</text>
  </g>
</svg>`,
    ast: `(:scene :id "pythagoras" :title "Pythagoras Theorem: Area Conservation" :stage "KS3 GEOMETRY" :duration 11.0
  (:vars (
    (:var :name "sideA" :val 3 :min 1 :max 8 :step 1 :unit "units" :label "Leg a")
    (:var :name "sideB" :val 4 :min 1 :max 8 :step 1 :unit "units" :label "Leg b")
  ))
  (:inputs (
    (:number :var "sideA" :label "Triangle Leg a" :min 1 :max 10 :step 1)
    (:number :var "sideB" :label "Triangle Leg b" :min 1 :max 10 :step 1)
  ))
  (:computed (
    (:name "hypotenuse" :expr "Math.sqrt(vars.sideA * vars.sideA + vars.sideB * vars.sideB).toFixed(2)")
    (:name "areaA" :expr "vars.sideA * vars.sideA")
    (:name "areaB" :expr "vars.sideB * vars.sideB")
    (:name "areaC" :expr "vars.sideA * vars.sideA + vars.sideB * vars.sideB")
  ))
  (:gestures (
    (:draggable :target "#pyth-handle-a" :axis "y" :min 100 :max 250)
    (:draggable :target "#pyth-handle-b" :axis "x" :min 380 :max 640)
    (:draggable :target "#pyth-rect-a" :axis "y" :min 100 :max 250)
    (:draggable :target "#pyth-rect-b" :axis "x" :min 380 :max 640)
  ))
  (:subtitles (
    (:start 0.00 :end 0.35 :en "Drag the handles, pans, or type your own figures for leg a and leg b." :es "Arrastra los controles o introduce tus propios números para los catetos a y b.")
    (:start 0.35 :end 0.70 :en "Observe area conservation: square a² (emerald) plus square b² (sapphire) always equals square c² (amber)." :es "Observa la conservación de área: el cuadrado a² más el cuadrado b² siempre es igual a c².")
    (:start 0.70 :end 1.00 :en "a² + b² = c². The total number of unit tiles is strictly conserved for all right triangles." :es "a² + b² = c². El número total de baldosas unitarias se conserva estrictamente.")
  ))
  (:keyframes (
    (:t 0.00 :title "Interactive Manipulative" :rule "Drag handles or enter custom figures to test Pythagorean triples")
    (:t 0.35 :title "Area Conservation" :rule "Square of side a has area a²; square of side b has area b²")
    (:t 0.70 :title "Vector Area Sum" :rule "Total square units: a² + b² = c²")
    (:t 1.00 :title "Hypotenuse Square c²" :rule "c = √(a² + b²) preserved across continuous geometry")
  ))
  (:bindings (
    (:target "#pyth-txt-a" :attr "opacity" :expr "1")
    (:target "#pyth-txt-b" :attr "opacity" :expr "1")
    (:target "#pyth-txt-c" :attr "opacity" :expr "1")
  ))
)`
  }
};

// In-memory cache
let inMemoryCartridgesCache: CartridgeDefinition[] | null = null;

/**
 * Returns all custom & PhET imported cartridges stored in browser localStorage
 */
export function getCustomCartridges(): CartridgeDefinition[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CUSTOM_CARTRIDGES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[cartridgeStore] Failed to read custom cartridges:', err);
    return [];
  }
}

/**
 * Normalizes any cartridge ID or alias to canonical ID
 */
export function normalizeCartridgeId(id: string): string {
  if (!id || typeof id !== 'string') return '';
  const clean = id.toLowerCase().trim()
    .replace(/^(demo-|scene-|preset-)/, '')
    .replace(/\.(ast|svg|json|html|phet)$/, '');
  return CARTRIDGE_ALIASES[clean] || clean;
}

/**
 * Retrieves all cartridges (Built-in + Custom + PhET Imported)
 */
export function getAllCartridges(): CartridgeDefinition[] {
  const custom = getCustomCartridges();
  const customMap = new Map<string, CartridgeDefinition>();
  custom.forEach((c) => customMap.set(c.id, c));

  // Merge built-in cartridges, letting custom cartridges override if user updated them
  const merged: CartridgeDefinition[] = [];
  const seen = new Set<string>();

  // Custom first so user updates take priority
  custom.forEach((c) => {
    merged.push(c);
    seen.add(c.id);
  });

  BUILTIN_CARTRIDGES.forEach((b) => {
    if (!seen.has(b.id)) {
      merged.push(b);
      seen.add(b.id);
    }
  });

  return merged;
}

/**
 * Finds a cartridge by ID or alias
 */
export function getCartridge(idOrAlias: string): CartridgeDefinition | null {
  if (!idOrAlias) return null;
  const canonicalId = normalizeCartridgeId(idOrAlias);
  const all = getAllCartridges();
  const found = all.find((c) => c.id === canonicalId || c.id === idOrAlias);
  if (found) return found;

  // Fallback check against embedded core
  if (EMBEDDED_CORE_CARTRIDGES[canonicalId]) {
    return {
      id: canonicalId,
      title: canonicalId.charAt(0).toUpperCase() + canonicalId.slice(1),
      stage: 'CURRICULUM',
      category: 'STEM',
      desc: 'Built-in curriculum vector simulation.',
      icon: '📐',
      source: 'builtin',
      svgMarkup: EMBEDDED_CORE_CARTRIDGES[canonicalId].svg,
      astSource: EMBEDDED_CORE_CARTRIDGES[canonicalId].ast,
    };
  }

  return null;
}

/**
 * Saves or updates a custom cartridge to decentralized storage
 */
export function saveCustomCartridge(cartridge: CartridgeDefinition): void {
  if (typeof window === 'undefined') return;
  const existing = getCustomCartridges().filter((c) => c.id !== cartridge.id);
  const updated = [{ ...cartridge, updatedAt: Date.now() }, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_CARTRIDGES, JSON.stringify(updated));
    inMemoryCartridgesCache = null;

    // Synchronize into runtime ASTSceneRegistry if available
    const g = window as any;
    if (g.ASTSceneRegistry && typeof g.ASTSceneRegistry.register === 'function') {
      g.ASTSceneRegistry.register(cartridge.id, {
        id: cartridge.id,
        title: cartridge.title,
        stage: cartridge.stage,
        svgMarkup: cartridge.svgMarkup,
        astSource: cartridge.astSource,
      });
    }

    window.dispatchEvent(new Event('cartridges_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('[cartridgeStore] Storage quota error saving cartridge:', err);
  }
}

/**
 * Deletes a custom cartridge from decentralized storage
 */
export function deleteCustomCartridge(cartridgeId: string): void {
  if (typeof window === 'undefined') return;
  const canonicalId = normalizeCartridgeId(cartridgeId);
  const filtered = getCustomCartridges().filter((c) => c.id !== canonicalId && c.id !== cartridgeId);
  try {
    localStorage.setItem(STORAGE_KEY_CUSTOM_CARTRIDGES, JSON.stringify(filtered));
    inMemoryCartridgesCache = null;
    window.dispatchEvent(new Event('cartridges_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('[cartridgeStore] Failed to delete cartridge:', err);
  }
}

/**
 * Ingests ANY external file (PhET HTML5, PhET JSON, Flash SWF, .ast, .ast.svg, cartridge .json)
 * and turns it into a reusable decentralized Cartridge!
 */
export async function importCartridgeFile(file: File): Promise<CartridgeDefinition> {
  const fileName = file.name.toLowerCase();

  // 1. Flash SWF (.swf) Transpiler
  if (fileName.endsWith('.swf')) {
    const buf = await file.arrayBuffer();
    const cleanId = file.name.replace(/\.swf$/i, '').replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const swfRes = await transpileSwfToAst(buf, cleanId);
    if (!swfRes.success) {
      throw new Error(swfRes.error || 'Failed to transpile legacy Flash SWF file.');
    }
    const cart: CartridgeDefinition = {
      id: cleanId,
      title: `Flash: ${cleanId.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`,
      stage: 'FLASH TRANSLATED',
      category: 'Imported Flash',
      desc: `Transpiled from legacy Adobe Flash SWF with 60 FPS deterministic vector recreation.`,
      icon: '⚡',
      source: 'imported',
      svgMarkup: swfRes.svgMarkup,
      astSource: swfRes.astSource,
      author: 'Flash Archive',
      version: `Flash v${swfRes.metadata?.version || 9}`,
      invariants: ['Legacy Vector Timeline', 'ActionScript Translation'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveCustomCartridge(cart);
    return cart;
  }

  // 2. PhET Interactive Simulation (.html, .json, .phet)
  const text = await file.text();
  if (isPhetBundle(text) || fileName.endsWith('.phet') || fileName.includes('phet')) {
    const phetRes = await transpilePhetFile(text, file.name);
    if (!phetRes.success) {
      throw new Error(phetRes.error || 'Failed to transpile PhET simulation.');
    }
    const cleanId = (phetRes.metadata?.simName || file.name)
      .replace(/\.(html|json|phet)$/i, '')
      .replace(/[^a-z0-9_-]/gi, '-')
      .toLowerCase();

    const cart: CartridgeDefinition = {
      id: cleanId,
      title: phetRes.metadata?.title || `PhET: ${cleanId}`,
      stage: 'PhET INTERACTIVE APPARATUS',
      category: 'Science',
      desc: `Distilled from ${((phetRes.metadata?.originalSizeBytes || 1000000) / 1024 / 1024).toFixed(1)} MB PhET bundle down to clean AST vector physics with zero cloud leakage.`,
      icon: '🧪',
      source: 'phet',
      svgMarkup: phetRes.svgMarkup,
      astSource: phetRes.astSource,
      author: 'University of Colorado Boulder (PhET)',
      version: phetRes.metadata?.version || '1.0.0',
      invariants: phetRes.metadata?.detectedInvariants || ['Physical Conservation Law'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveCustomCartridge(cart);
    return cart;
  }

  // 3. Cartridge JSON export package
  if (fileName.endsWith('.json')) {
    try {
      const data = JSON.parse(text);
      if (data && data.id && (data.svgMarkup || data.astSource)) {
        const cart: CartridgeDefinition = {
          id: data.id,
          title: data.title || data.id,
          stage: data.stage || 'CUSTOM CARTRIDGE',
          category: data.category || 'General',
          desc: data.desc || 'Imported decentralized cartridge package.',
          icon: data.icon || '📦',
          source: data.source || 'user',
          svgMarkup: data.svgMarkup || '',
          astSource: data.astSource || '',
          author: data.author || 'Educator',
          version: data.version || '1.0.0',
          invariants: data.invariants || [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        saveCustomCartridge(cart);
        return cart;
      }
    } catch (_) {}
  }

  // 4. Living AST.SVG Capsule or SVG file
  if (fileName.endsWith('.svg') || fileName.endsWith('.ast.svg')) {
    const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
    const astMatch = text.match(/<metadata[^>]*data-ast=["']([\s\S]*?)["']/i) || text.match(/\(:scene[\s\S]*?\)/);
    const cleanId = file.name.replace(/\.(ast\.)?svg$/i, '').replace(/[^a-z0-9_-]/gi, '-').toLowerCase();

    const cart: CartridgeDefinition = {
      id: cleanId,
      title: titleMatch ? titleMatch[1] : cleanId,
      stage: 'VECTOR CAPSULE',
      category: 'Mathematics',
      desc: 'Imported living vector cartridge capsule.',
      icon: '🎨',
      source: 'imported',
      svgMarkup: text,
      astSource: astMatch ? (astMatch[1] ? decodeURIComponent(astMatch[1]) : astMatch[0]) : `(:scene :id "${cleanId}" :title "${cleanId}")`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveCustomCartridge(cart);
    return cart;
  }

  // 5. Raw AST S-Expression file (.ast)
  if (fileName.endsWith('.ast') || text.trim().startsWith('(:scene') || text.trim().startsWith('(')) {
    const cleanId = file.name.replace(/\.ast$/i, '').replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
    const titleMatch = text.match(/:title\s+"([^"]+)"/i);
    const stageMatch = text.match(/:stage\s+"([^"]+)"/i);

    const cart: CartridgeDefinition = {
      id: cleanId,
      title: titleMatch ? titleMatch[1] : cleanId,
      stage: stageMatch ? stageMatch[1] : 'CURRICULUM',
      category: 'Mathematics',
      desc: 'Imported declarative AST vector logic cartridge.',
      icon: '📜',
      source: 'imported',
      svgMarkup: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg"><rect width="800" height="480" fill="#090d16"/><text x="400" y="240" fill="#38bdf8" font-size="20" font-weight="800" text-anchor="middle">${cleanId}</text></svg>`,
      astSource: text,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveCustomCartridge(cart);
    return cart;
  }

  throw new Error(`Unsupported cartridge file format: ${file.name}. Expected .html (PhET), .swf, .json, .ast, or .svg.`);
}

/**
 * Creates a brand new cartridge from teacher/student form inputs
 */
export function createCustomCartridge(input: {
  title: string;
  category: string;
  stage: string;
  desc?: string;
  icon?: string;
  svgMarkup?: string;
  astSource?: string;
}): CartridgeDefinition {
  const cleanId = input.title
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-|-$/g, '') || `cartridge-${Date.now().toString(36)}`;

  const defaultSvg = `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="custom-glow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </radialGradient>
  </defs>
  <rect width="800" height="480" fill="url(#custom-glow)" />
  <g id="apparatus-root">
    <text x="400" y="60" fill="#38bdf8" font-size="22" font-weight="900" text-anchor="middle">${input.title}</text>
    <circle id="probe" cx="400" cy="240" r="40" fill="#3b82f6" stroke="#60a5fa" stroke-width="4" />
    <text id="probe-label" x="400" y="246" fill="#ffffff" font-size="16" font-weight="800" text-anchor="middle">Interactive</text>
  </g>
</svg>`;

  const defaultAst = `(:scene :id "${cleanId}" :title "${input.title}" :stage "${input.stage}" :duration 12.0
  (:vars (
    (:var :name "magnitude" :val 5 :min 1 :max 10 :step 1 :label "Magnitude")
  ))
  (:inputs (
    (:slider :var "magnitude" :label "Magnitude" :min 1 :max 10 :step 1)
  ))
  (:subtitles (
    (:start 0.00 :end 6.00 :en "Welcome to this interactive decentralized cartridge." :es "Bienvenido a este cartucho interactivo descentralizado.")
    (:start 6.00 :end 12.00 :en "Observe real-time vector transformations and physical invariants." :es "Observa las transformaciones vectoriales y los invariantes físicos.")
  ))
  (:keyframes (
    (:t 0.00 :title "Apparatus Init" :rule "Deterministic zero-cloud vector loop initialized.")
    (:t 0.50 :title "Conservation State" :rule "Reactive bindings execute at 60 FPS.")
  ))
  (:bindings (
    (:target "#probe" :attr "r" :expr "30 + vars.magnitude * 3")
  ))
)`;

  const newCart: CartridgeDefinition = {
    id: cleanId,
    title: input.title,
    stage: input.stage || 'CUSTOM APPARATUS',
    category: input.category || 'General',
    desc: input.desc || 'Custom authored decentralized vector cartridge.',
    icon: input.icon || '📐',
    source: 'user',
    svgMarkup: input.svgMarkup || defaultSvg,
    astSource: input.astSource || defaultAst,
    author: 'Classroom Educator',
    version: '1.0.0',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  saveCustomCartridge(newCart);
  return newCart;
}
