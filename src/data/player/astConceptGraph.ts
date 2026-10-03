// src/data/player/astConceptGraph.ts
/**
 * Pedagogical Concept Graph & Semantic Slide Traversal
 * 
 * Unlike legacy Flash (.swf) binaries which were opaque, monolithic, and isolated,
 * our AST-guided media player operates on an Abstract Syntax Tree knowledge graph.
 * 
 * This enables:
 * 1. Semantic Concept Trails: Jumping between mathematically and scientifically linked concepts.
 * 2. Instantaneous Sub-Millisecond Morphing: 2 KB AST S-expressions hot-swap without reloading the player.
 * 3. Cross-Disciplinary Concept Bridging: Showing how 2D geometric arrays in Times Tables
 *    underpin the algebraic clamping in BODMAS and denominator slicing in Fractions.
 */

export interface ConceptNode {
  id: string;
  title: string;
  stage: string;
  domain: 'Maths' | 'Science' | 'English & MFL' | 'Religious & Cultural' | 'Benchmarks';
  conceptPillar: string;
  icon: string;
  relatedSlideIds: string[];
  pedagogicalLinks: Record<string, {
    reason: string;
    relationshipType: 'prerequisite' | 'extension' | 'parallel-analogy' | 'direct-application';
    invariantConcept: string;
  }>;
}

export const AST_CONCEPT_GRAPH: Record<string, ConceptNode> = {
  'bodmas': {
    id: 'bodmas',
    title: 'BODMAS / BIDMAS: Forcefield Clamps',
    stage: 'KS2/KS3 MATHS',
    domain: 'Maths',
    conceptPillar: 'Order of Operations & Geometric Grouping',
    icon: '🧮',
    relatedSlideIds: ['times-tables', 'fractions', 'math-fishing'],
    pedagogicalLinks: {
      'times-tables': {
        reason: 'BODMAS clamps 3 × 4 first because multiplication forms an unbroken 2D rectangular area of 12 tiles before loose units can be added.',
        relationshipType: 'prerequisite',
        invariantConcept: '2D Rectangular Area Arrays',
      },
      'fractions': {
        reason: 'In fractions, the common denominator acts like a BODMAS grouping clamp: slices must be equal before the numerator addition occurs.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Grouping Invariant Prior to Addition',
      },
      'math-fishing': {
        reason: 'Number bonds provide the mental fluency needed once the multiplication clamp has evaluated down to loose unit addition.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Additive Number Bonds',
      },
    },
  },

  'times-tables': {
    id: 'times-tables',
    title: 'Times Tables: 2D Array & Distributive Splitter',
    stage: 'KS1/KS2 MATHS',
    domain: 'Maths',
    conceptPillar: 'Multiplication Arrays & Distributive Decomposition',
    icon: '📐',
    relatedSlideIds: ['bodmas', 'fractions', 'math-fishing'],
    pedagogicalLinks: {
      'bodmas': {
        reason: 'The 2D tile arrays proven here explain WHY multiplication takes precedence over loose addition in BODMAS.',
        relationshipType: 'extension',
        invariantConcept: 'Multiplication Precedence Physics',
      },
      'fractions': {
        reason: 'Splitting arrays into fractions of rows and columns introduces common denominators and fraction multiplication.',
        relationshipType: 'extension',
        invariantConcept: 'Fractional Area Grids',
      },
      'math-fishing': {
        reason: 'Distributive splitting (e.g. 8 into 5 + 3) relies on rapid mental recall of number bonds to 10.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Number Decomposition',
      },
    },
  },

  'fractions': {
    id: 'fractions',
    title: 'Fractions: Common Denominators',
    stage: 'KS2 MATHS',
    domain: 'Maths',
    conceptPillar: 'Rational Numbers & Area Equivalence',
    icon: '🍰',
    relatedSlideIds: ['times-tables', 'bodmas', 'pythagoras'],
    pedagogicalLinks: {
      'times-tables': {
        reason: 'Finding a common denominator (e.g. 1/2 = 2/4) uses multiplication equivalence tables: multiplying numerator and denominator by the same scalar.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Equivalence Ratios & Factors',
      },
      'bodmas': {
        reason: 'Fraction bars act as implicit parentheses grouping expressions into numerator and denominator blocks before division.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Vinculum Grouping Operator',
      },
      'pythagoras': {
        reason: 'Ratio conservation between fractional areas mirrors the area conservation of squares on triangle legs.',
        relationshipType: 'extension',
        invariantConcept: 'Conservation of Geometric Area',
      },
    },
  },

  'pythagoras': {
    id: 'pythagoras',
    title: 'Pythagoras Theorem: Area Conservation',
    stage: 'KS3 GEOMETRY',
    domain: 'Maths',
    conceptPillar: 'Geometric Area Proofs & Right Triangles',
    icon: '📐',
    relatedSlideIds: ['mountain-elevation', 'velocity', 'fractions'],
    pedagogicalLinks: {
      'mountain-elevation': {
        reason: 'Pythagoras directly calculates mountain climber slope distance, steepness, and elevation hypotenuse (run² + rise² = climb²).',
        relationshipType: 'direct-application',
        invariantConcept: 'Slope & Hypotenuse Trigonometry',
      },
      'velocity': {
        reason: 'Resolving 2D velocity vectors into perpendicular horizontal (Vx) and vertical (Vy) components uses Pythagoras to find resultant speed.',
        relationshipType: 'direct-application',
        invariantConcept: 'Vector Magnitude Resolution',
      },
      'fractions': {
        reason: 'Pythagorean geometric proofs rely on cutting and preserving fractional areas without losing total square units.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Geometric Area Conservation',
      },
    },
  },

  'mountain-elevation': {
    id: 'mountain-elevation',
    title: 'Mountain Altitude: Climber Game & Slope',
    stage: 'KS2/KS3 MATHS & GEOGRAPHY',
    domain: 'Maths',
    conceptPillar: 'Elevation, Lapse Rates & Hypotenuse',
    icon: '🧗',
    relatedSlideIds: ['pythagoras', 'velocity', 'water-cycle'],
    pedagogicalLinks: {
      'pythagoras': {
        reason: 'The mountain slope is the right-angled triangle hypotenuse proven in Pythagoras Theorem.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Right-Angled Triangle Hypotenuse',
      },
      'water-cycle': {
        reason: 'As the climber ascends, adiabatic cooling causes atmospheric condensation and orographic rainfall on mountain peaks.',
        relationshipType: 'direct-application',
        invariantConcept: 'Altitude & Thermodynamic Condensation',
      },
      'velocity': {
        reason: 'Climber speed is a velocity vector split into horizontal trail distance and vertical rate of climb.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Rate of Change & Vectors',
      },
    },
  },

  'velocity': {
    id: 'velocity',
    title: 'Velocity & Distance Vectors',
    stage: 'KS3 PHYSICS',
    domain: 'Science',
    conceptPillar: 'Kinematics & Vector Resolution',
    icon: '🏎️',
    relatedSlideIds: ['pythagoras', 'mountain-elevation', 'solar-system'],
    pedagogicalLinks: {
      'pythagoras': {
        reason: 'Calculating the diagonal resultant velocity vector from horizontal and vertical vector components uses a² + b² = c².',
        relationshipType: 'prerequisite',
        invariantConcept: 'Orthogonal Vector Addition',
      },
      'mountain-elevation': {
        reason: 'The rate of elevation climb per unit time is the vertical velocity component of the mountain ascent.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Vertical Velocity Component',
      },
      'solar-system': {
        reason: 'Planetary orbits in the solar system represent continuous perpendicular gravitational acceleration bending velocity into an ellipse.',
        relationshipType: 'extension',
        invariantConcept: 'Centripetal Force & Orbital Velocity',
      },
    },
  },

  'photosynthesis': {
    id: 'photosynthesis',
    title: 'Photosynthesis: Leaf Factory',
    stage: 'KS3 BIOLOGY',
    domain: 'Science',
    conceptPillar: 'Biochemical Energy Conversion',
    icon: '🌱',
    relatedSlideIds: ['water-cycle', 'atom', 'solar-system'],
    pedagogicalLinks: {
      'water-cycle': {
        reason: 'Leaves draw H2O through transpiration from the soil, directly participating in the global atmospheric water cycle.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Transpiration & Hydrological Flux',
      },
      'atom': {
        reason: 'Solar photons excite electrons in chlorophyll molecules (Bohr model energy transitions) to split H2O and synthesize glucose.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Atomic Electron Excitation',
      },
      'solar-system': {
        reason: 'The solar radiation driving photosynthesis originates from nuclear fusion in the Sun at the center of the solar system.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Solar Radiant Energy Flux',
      },
    },
  },

  'water-cycle': {
    id: 'water-cycle',
    title: 'Water Cycle: Dynamic States',
    stage: 'KS2 GEOGRAPHY',
    domain: 'Science',
    conceptPillar: 'Thermodynamics & Phase Transitions',
    icon: '💧',
    relatedSlideIds: ['photosynthesis', 'mountain-elevation', 'atom'],
    pedagogicalLinks: {
      'photosynthesis': {
        reason: 'Plant transpiration pumps 10% of all atmospheric moisture into clouds, driving rainfall cycles.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Biological Hydrological Loop',
      },
      'mountain-elevation': {
        reason: 'Rising air cool rapidly over mountain terrain, producing clouds and snowfall at high altitudes.',
        relationshipType: 'direct-application',
        invariantConcept: 'Orographic Precipitation',
      },
      'atom': {
        reason: 'Evaporation, condensation, and freezing are changes in molecular kinetic energy and intermolecular bonds between H2O molecules.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Molecular Kinetic States',
      },
    },
  },

  'atom': {
    id: 'atom',
    title: 'Atomic Shells: Bohr Model',
    stage: 'KS3 CHEMISTRY',
    domain: 'Science',
    conceptPillar: 'Atomic Structure & Quantum Shells',
    icon: '⚛️',
    relatedSlideIds: ['photosynthesis', 'dna-helix', 'solar-system'],
    pedagogicalLinks: {
      'photosynthesis': {
        reason: 'Chlorophyll molecules capture photon energy by jumping electrons between quantized atomic energy levels.',
        relationshipType: 'direct-application',
        invariantConcept: 'Quantized Photon Absorption',
      },
      'dna-helix': {
        reason: 'Hydrogen bonds between base pairs (A-T, G-C) in DNA rely on the electron shell affinities modeled in the Bohr atom.',
        relationshipType: 'direct-application',
        invariantConcept: 'Chemical Covalent & Hydrogen Bonds',
      },
      'solar-system': {
        reason: 'Bohr modeled electrons orbiting the nucleus in shells directly inspired by the heliocentric gravitational orbits of planets.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Central Force Orbital Mechanics',
      },
    },
  },

  'dna-helix': {
    id: 'dna-helix',
    title: 'DNA Double Helix Transcription',
    stage: 'KS3 GENETICS',
    domain: 'Science',
    conceptPillar: 'Molecular Genetics & Base Pairing',
    icon: '🧬',
    relatedSlideIds: ['atom', 'photosynthesis'],
    pedagogicalLinks: {
      'atom': {
        reason: 'Adenine, Thymine, Cytosine, and Guanine are molecular assemblies bonded according to atomic valence electrons.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Valence Bond Geometry',
      },
      'photosynthesis': {
        reason: 'DNA codes for the enzymes and chlorophyll synthesis complexes that carry out photosynthesis in plant chloroplasts.',
        relationshipType: 'extension',
        invariantConcept: 'Enzymatic Genetic Coding',
      },
    },
  },

  'phonics-lab': {
    id: 'phonics-lab',
    title: 'Early Phonics: Sound Buttons & Blending',
    stage: 'EYFS/KS1 ENGLISH',
    domain: 'English & MFL',
    conceptPillar: 'Synthetic Phonics & Pure Phonemes',
    icon: '🔤',
    relatedSlideIds: ['shakespeare', 'languages'],
    pedagogicalLinks: {
      'shakespeare': {
        reason: 'Pure phonemes and syllable blending are the building blocks of the stressed and unstressed beats in Shakespearean iambic pentameter.',
        relationshipType: 'extension',
        invariantConcept: 'Phonemic Meter & Syllable Stress',
      },
      'languages': {
        reason: 'Pronouncing pure phonemes without schwa ("uh") is essential for authentic Spanish, French, and Latin vowel purity.',
        relationshipType: 'direct-application',
        invariantConcept: 'Pure Vowel Articulation',
      },
    },
  },

  'shakespeare': {
    id: 'shakespeare',
    title: 'The Globe Theatre: Shakespeare & Iambic Meter',
    stage: 'KS3/KS4 ENGLISH LITERATURE',
    domain: 'English & MFL',
    conceptPillar: 'Dramatic Rhythm & Iambic Pentameter',
    icon: '🎭',
    relatedSlideIds: ['phonics-lab', 'languages', 'church-tour'],
    pedagogicalLinks: {
      'phonics-lab': {
        reason: 'The da-DUM iambic heartbeat rhythm depends on knowing syllable boundaries first learned on the phonics blending mat.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Syllabic Stress Cadence',
      },
      'languages': {
        reason: 'Early Modern English borrows vast vocabulary and rhetorical figures directly from Latin and French classical rhetoric.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Classical Linguistic Etymology',
      },
      'church-tour': {
        reason: 'The Elizabethan worldview and sacred theatre architecture reflect the sacred cosmology and acoustic acoustics of Renaissance cathedrals.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Renaissance Sacred Architecture & Stage',
      },
    },
  },

  'languages': {
    id: 'languages',
    title: 'MFL & Polyglot Studio: Spanish, French & Latin',
    stage: 'KS2/KS3 MFL',
    domain: 'English & MFL',
    conceptPillar: 'Romance Linguistics & Polyglot Roots',
    icon: '🌍',
    relatedSlideIds: ['phonics-lab', 'shakespeare', 'church-tour'],
    pedagogicalLinks: {
      'phonics-lab': {
        reason: 'Phonetic decoding allows pupils to read transparent languages like Spanish and Latin with 100% regular sound-letter correspondence.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Phoneme-Grapheme Regularity',
      },
      'church-tour': {
        reason: 'Latin is the historic mother language of the Roman Catholic Church, inscribed on altars, ambones, and crucifixes.',
        relationshipType: 'direct-application',
        invariantConcept: 'Liturgical Latin Epigraphy',
      },
      'shakespeare': {
        reason: 'Understanding Romance language syntax deepens pupils’ grasp of English poetic inversions and vocabulary roots.',
        relationshipType: 'extension',
        invariantConcept: 'Comparative Etymology',
      },
    },
  },

  'church-tour': {
    id: 'church-tour',
    title: 'Catholic Church: Sacred Architecture Tour',
    stage: 'CATHOLIC LIFE',
    domain: 'Religious & Cultural',
    conceptPillar: 'Sacred Architecture, Liturgy & Cruciform Geometry',
    icon: '⛪',
    relatedSlideIds: ['languages', 'pythagoras', 'shakespeare'],
    pedagogicalLinks: {
      'languages': {
        reason: 'The Church preserves living Latin prayers (Pater Noster, Ave Maria) engraved on the tabernacle, ambo, and stained glass.',
        relationshipType: 'direct-application',
        invariantConcept: 'Living Sacred Latin',
      },
      'pythagoras': {
        reason: 'Cathedral architecture uses Pythagorean geometric ratios (3-4-5 triangles and golden proportions) for structural equilibrium and sacred harmony.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Sacred Geometric Harmony',
      },
      'shakespeare': {
        reason: 'The acoustic design and sacred symbolism of the nave and sanctuary heavily influenced Shakespeare’s Globe Theatre stage design.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Sacred Acoustic Space',
      },
    },
  },

  'math-fishing': {
    id: 'math-fishing',
    title: 'Math Pond: Number Bonds Fishing Game',
    stage: 'KS1/KS2 MATHS',
    domain: 'Maths',
    conceptPillar: 'Addition Bonds & Fluency',
    icon: '🎣',
    relatedSlideIds: ['times-tables', 'bodmas'],
    pedagogicalLinks: {
      'times-tables': {
        reason: 'Fast recall of number bonds (e.g. 5 + 3 = 8) is what makes distributive splitting of times tables instantaneous.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Additive Number Bonds',
      },
      'bodmas': {
        reason: 'After multiplying, evaluating the final step requires combining the product with loose numbers using basic addition bonds.',
        relationshipType: 'prerequisite',
        invariantConcept: 'Loose Unit Addition',
      },
    },
  },

  'fish-tank': {
    id: 'fish-tank',
    title: 'Aquarium Stress Benchmark',
    stage: 'BENCHMARK & STRESS LAB',
    domain: 'Benchmarks',
    conceptPillar: 'Vector Point Rendering & FPS Performance',
    icon: '🐠',
    relatedSlideIds: ['velocity', 'math-fishing'],
    pedagogicalLinks: {
      'velocity': {
        reason: 'Fish flocking dynamics and collision bouncing calculate continuous 2D velocity vectors in real time.',
        relationshipType: 'direct-application',
        invariantConcept: 'Vector Velocity Simulation',
      },
      'math-fishing': {
        reason: 'The physics pond and fish animations share continuous coordinate math and collision bounding circles.',
        relationshipType: 'parallel-analogy',
        invariantConcept: 'Interactive Canvas Physics',
      },
    },
  },
};

/**
 * Returns the related concepts for a given preset ID.
 */
export function getRelatedConcepts(presetId: string): {
  id: string;
  title: string;
  stage: string;
  icon: string;
  reason: string;
  relationshipType: string;
  invariantConcept: string;
}[] {
  const node = AST_CONCEPT_GRAPH[presetId];
  if (!node) return [];

  return node.relatedSlideIds.map((relId) => {
    const relNode = AST_CONCEPT_GRAPH[relId];
    const link = node.pedagogicalLinks[relId] || {
      reason: 'Related curriculum concept',
      relationshipType: 'extension',
      invariantConcept: 'Cross-Disciplinary Learning',
    };
    return {
      id: relId,
      title: relNode?.title || relId,
      stage: relNode?.stage || 'CURRICULUM',
      icon: relNode?.icon || '🔗',
      reason: link.reason,
      relationshipType: link.relationshipType,
      invariantConcept: link.invariantConcept,
    };
  });
}
