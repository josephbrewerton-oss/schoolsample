export interface OakLessonSeed {
  seedId: string;       // Compact coordinate: [stage]:[subject]:[unit]:[slug]
  keyStage: string;    // 'ks1' | 'ks2' | 'ks3' | 'ks4'
  subject: string;     // 'science' | 'maths' | 'english' | 'history' | 'geography' | 'computing'
  unitTitle: string;
  topicTitle: string;
  coreAxiom: string;   // Verified foundational rule / principle
  cognitiveTrap: string; // Documented misconception or common error
  socraticPivot: string; // Ultra-short steer cue for Gemini Nano
  fallbackAST: string;  // Pre-compiled S-expression for offline zero-latency boot
}

export const OAK_CURRICULUM_SEEDS: Record<string, OakLessonSeed> = {
  // --- KEY STAGE 1: SCIENCE ---
  'ks1:sci:1:plants': {
    seedId: 'ks1:sci:1:plants',
    keyStage: 'ks1',
    subject: 'science',
    unitTitle: 'Plants & Growth',
    topicTitle: 'Seed Germination Requirements',
    coreAxiom: 'Seeds require moisture, warmth, and air to germinate before they need sunlight.',
    cognitiveTrap: 'Believing seeds require direct sunlight underground to sprout.',
    socraticPivot: 'What condition does a buried seed actually experience in the dark soil?',
    fallbackAST: '(:route "lesson:view" :axiom "Seeds require moisture, warmth, and air to germinate." :trap "Believing seeds need sunlight underground." :pivot "What condition does a buried seed experience in dark soil?")'
  },
  'ks1:sci:2:materials': {
    seedId: 'ks1:sci:2:materials',
    keyStage: 'ks1',
    subject: 'science',
    unitTitle: 'Everyday Materials',
    topicTitle: 'Material Properties & Uses',
    coreAxiom: 'Objects are made from materials chosen specifically for their physical properties.',
    cognitiveTrap: 'Confusing the name of the object with the name of the material it is made from.',
    socraticPivot: 'Is a spoon the material itself, or is the spoon made of metal or wood?',
    fallbackAST: '(:route "lesson:view" :axiom "Objects are made from materials chosen for their properties." :trap "Confusing the object with its material." :pivot "Is a spoon the material, or made of metal?")'
  },

  // --- KEY STAGE 1: MATHS ---
  'ks1:mat:1:addition': {
    seedId: 'ks1:mat:1:addition',
    keyStage: 'ks1',
    subject: 'maths',
    unitTitle: 'Addition within 20',
    topicTitle: 'Counting On from Largest Addend',
    coreAxiom: 'Addition is commutative; counting on from the larger quantity minimizes calculation steps.',
    cognitiveTrap: 'Recounting the entire first group from one rather than starting at the known quantity.',
    socraticPivot: 'If you already have 8 blocks, do you need to recount those 8 before adding 3?',
    fallbackAST: '(:route "lesson:view" :axiom "Addition is commutative; count on from the larger number." :trap "Recounting the first set from one." :pivot "If you have 8 blocks, why recount them?")'
  },

  // --- KEY STAGE 2: SCIENCE ---
  'ks2:sci:1:forces': {
    seedId: 'ks2:sci:1:forces',
    keyStage: 'ks2',
    subject: 'science',
    unitTitle: 'Forces & Magnets',
    topicTitle: 'Friction and Surface Resistance',
    coreAxiom: 'Friction is a contact force that acts in the opposite direction to relative motion.',
    cognitiveTrap: 'Believing moving objects carry an internal force that simply wears out on its own.',
    socraticPivot: 'What physical contact surface slows the toy car down across the carpet?',
    fallbackAST: '(:route "lesson:view" :axiom "Friction opposes relative motion between surfaces." :trap "Thinking motion requires continuous internal force." :pivot "What surface slows the car down?")'
  },
  'ks2:sci:2:electricity': {
    seedId: 'ks2:sci:2:electricity',
    keyStage: 'ks2',
    subject: 'science',
    unitTitle: 'Simple Circuits',
    topicTitle: 'Complete Circuit Continuity',
    coreAxiom: 'Electric current requires an unbroken conductive loop from and back to the power source.',
    cognitiveTrap: 'The "clashing currents" model where electricity flows from both terminals to meet at the bulb.',
    socraticPivot: 'What happens to the entire circuit loop if a single wire is disconnected?',
    fallbackAST: '(:route "lesson:view" :axiom "Current requires an unbroken loop back to the source." :trap "Assuming currents clash from both ends." :pivot "What happens if one wire is detached?")'
  },

  // --- KEY STAGE 3: SCIENCE ---
  'ks3:sci:1:atomic': {
    seedId: 'ks3:sci:1:atomic',
    keyStage: 'ks3',
    subject: 'science',
    unitTitle: 'Atomic Structure & Periodic Table',
    topicTitle: 'Subatomic Particle Arrangement',
    coreAxiom: 'Protons and neutrons form the central dense nucleus; electrons orbit in discrete energy levels.',
    cognitiveTrap: 'Assuming the mass of an atom is evenly distributed across its entire volume.',
    socraticPivot: 'Where is nearly all of an atom\'s mass concentrated?',
    fallbackAST: '(:route "lesson:view" :axiom "Protons and neutrons reside in the nucleus; electrons orbit outer shells." :trap "Assuming mass is evenly distributed across volume." :pivot "Where is nearly all the mass concentrated?")'
  },

  // --- KEY STAGE 3: COMPUTING ---
  'ks3:com:1:algorithms': {
    seedId: 'ks3:com:1:algorithms',
    keyStage: 'ks3',
    subject: 'computing',
    unitTitle: 'Computational Thinking',
    topicTitle: 'Decomposition and Abstraction',
    coreAxiom: 'Decomposition breaks complex problems into smaller parts; abstraction removes unnecessary detail.',
    cognitiveTrap: 'Attempting to write implementation code before clarifying the algorithmic steps.',
    socraticPivot: 'What core detail can we ignore right now to make the main rule obvious?',
    fallbackAST: '(:route "lesson:view" :axiom "Decomposition splits problems; abstraction removes noise." :trap "Coding syntax before working out algorithm steps." :pivot "What details can we ignore for now?")'
  }
};