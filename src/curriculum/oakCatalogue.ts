export interface OakTopic {
  id: string;
  title: string;
}

export interface OakSubject {
  id: string;
  title: string;
  topics: OakTopic[];
}

export interface OakStage {
  id: string;
  title: string;
  subjects: OakSubject[];
}

// 1. New ID-driven curriculum structure matching curriculum.ast
export const OAK_CURRICULUM_CATALOGUE: Record<string, OakStage> = {
  'ks1': {
    id: 'ks1',
    title: 'Key Stage 1',
    subjects: [
      {
        id: 'english',
        title: 'English',
        topics: [
          { id: 'phonics-simple-sentences', title: 'Phonics & Simple Sentences' },
          { id: 'capital-letters-stops', title: 'Capital Letters & Full Stops' },
          { id: 'story-sequencing', title: 'Story Sequencing' },
        ],
      },
      {
        id: 'maths',
        title: 'Mathematics',
        topics: [
          { id: 'addition-subtraction-20', title: 'Addition & Subtraction within 20' },
          { id: '2d-3d-shapes', title: '2D & 3D Shapes' },
          { id: 'place-value-50', title: 'Place Value to 50' },
        ],
      },
      {
        id: 'science',
        title: 'Science',
        topics: [
          { id: 'seasonal-changes', title: 'Seasonal Changes' },
          { id: 'animals-humans', title: 'Animals and Humans' },
          { id: 'materials-properties', title: 'Materials and Properties' },
        ],
      },
      {
        id: 'history',
        title: 'History',
        topics: [
          { id: 'living-memory', title: 'Changes Within Living Memory' },
          { id: 'historical-figures', title: 'Significant Historical Figures' },
        ],
      },
      {
        id: 'geography',
        title: 'Geography',
        topics: [
          { id: 'local-area', title: 'Our Local Area' },
          { id: 'weather-patterns', title: 'The Four Seasons & Weather Patterns' },
        ],
      },
    ],
  },
  'ks2': {
    id: 'ks2',
    title: 'Key Stage 2',
    subjects: [
      {
        id: 'maths',
        title: 'Mathematics',
        topics: [
          { id: 'fractions-decimals', title: 'Fractions and Decimals' },
          { id: 'place-value-rounding', title: 'Place Value and Rounding' },
          { id: 'long-division-multiplication', title: 'Long Division & Multiplication' },
          { id: 'perimeter-area', title: 'Perimeter and Area' },
        ],
      },
      {
        id: 'english',
        title: 'English',
        topics: [
          { id: 'fronted-adverbials-commas', title: 'Fronted Adverbials & Commas' },
          { id: 'direct-speech-punctuation', title: 'Direct Speech Punctuation' },
          { id: 'reading-comprehension-inference', title: 'Reading Comprehension: Inference' },
        ],
      },
      {
        id: 'science',
        title: 'Science',
        topics: [
          { id: 'states-of-matter', title: 'States of Matter' },
          { id: 'water-cycle', title: 'The Water Cycle' },
          { id: 'forces-magnets', title: 'Forces and Magnets' },
          { id: 'earth-space', title: 'Earth and Space' },
          { id: 'electricity-circuits', title: 'Electricity & Circuits' },
        ],
      },
      {
        id: 'history',
        title: 'History',
        topics: [
          { id: 'ancient-egypt', title: 'Ancient Egypt & Pharaohs' },
          { id: 'roman-empire', title: 'The Roman Empire & Britain' },
          { id: 'vikings-anglo-saxons', title: 'The Vikings & Anglo-Saxons' },
        ],
      },
      {
        id: 'geography',
        title: 'Geography',
        topics: [
          { id: 'rivers-water-cycle', title: 'Rivers & The Water Cycle' },
          { id: 'volcanoes-earthquakes', title: 'Volcanoes and Earthquakes' },
          { id: 'world-biomes', title: 'World Biomes & Climate Zones' },
        ],
      },
      {
        id: 'computing',
        title: 'Computing',
        topics: [
          { id: 'scratch-block-programming', title: 'Scratch Block Programming' },
          { id: 'online-safety', title: 'Online Safety & Digital Literacy' },
          { id: 'algorithms-sequencing', title: 'Algorithms & Sequencing' },
        ],
      },
    ],
  },
  'ks3': {
    id: 'ks3',
    title: 'Key Stage 3',
    subjects: [
      {
        id: 'maths',
        title: 'Mathematics',
        topics: [
          { id: 'algebraic-expressions', title: 'Algebraic Expressions & Indices' },
          { id: 'linear-equations', title: 'Linear Equations' },
          { id: 'probability-venn', title: 'Probability & Venn Diagrams' },
          { id: 'pythagoras-theorem', title: 'Pythagoras Theorem' },
        ],
      },
      {
        id: 'science',
        title: 'Science',
        topics: [
          { id: 'atomic-structure', title: 'Atomic Structure & Periodic Table' },
          { id: 'cell-biology', title: 'Cell Biology & Microscopy' },
          { id: 'energy-transfers', title: 'Energy Transfers & Conservation' },
        ],
      },
      {
        id: 'english',
        title: 'English',
        topics: [
          { id: 'shakespeare-themes', title: 'Shakespeare: Key Themes' },
          { id: 'gothic-literature', title: 'Gothic Literature' },
          { id: 'persuasive-writing', title: 'Persuasive Writing & Rhetoric' },
        ],
      },
      {
        id: 'history',
        title: 'History',
        topics: [
          { id: 'norman-conquest', title: 'The Norman Conquest (1066)' },
          { id: 'industrial-revolution', title: 'The Industrial Revolution' },
          { id: 'transatlantic-slave-trade', title: 'The Transatlantic Slave Trade' },
        ],
      },
      {
        id: 'geography',
        title: 'Geography',
        topics: [
          { id: 'plate-tectonics', title: 'Plate Tectonics & Hazards' },
          { id: 'urbanisation-mega-cities', title: 'Urbanisation & Mega Cities' },
          { id: 'glacial-landscapes', title: 'Glacial Landscapes' },
        ],
      },
      {
        id: 'mfl',
        title: 'Modern Foreign Languages',
        topics: [
          { id: 'french-present-routine', title: 'French: Present Tense & Daily Routine' },
          { id: 'spanish-free-time', title: 'Spanish: Free Time & Hobbies' },
        ],
      },
    ],
  },
  'ks4': {
    id: 'ks4',
    title: 'Key Stage 4 (GCSE)',
    subjects: [
      {
        id: 'maths',
        title: 'Mathematics',
        topics: [
          { id: 'quadratic-equations', title: 'Quadratic Equations & Graphs' },
          { id: 'trigonometry', title: 'Trigonometry (SOH CAH TOA)' },
          { id: 'circle-theorems', title: 'Circle Theorems' },
          { id: 'simultaneous-equations', title: 'Simultaneous Equations' },
        ],
      },
      {
        id: 'chemistry',
        title: 'Chemistry',
        topics: [
          { id: 'balancing-equations', title: 'Balancing Chemical Equations' },
          { id: 'electrolysis', title: 'Electrolysis & Electrolytes' },
          { id: 'quantitative-chemistry', title: 'Quantitative Chemistry & Moles' },
        ],
      },
      {
        id: 'physics',
        title: 'Physics',
        topics: [
          { id: 'newtonian-mechanics', title: 'Newtonian Mechanics & Force' },
          { id: 'em-spectrum', title: 'Waves and Electromagnetic Spectrum' },
          { id: 'radioactivity', title: 'Radioactivity & Half-Life' },
        ],
      },
      {
        id: 'biology',
        title: 'Biology',
        topics: [
          { id: 'genetics-inheritance', title: 'Genetics and Inheritance' },
          { id: 'photosynthesis-transport', title: 'Photosynthesis & Plant Transport' },
          { id: 'homeostasis-response', title: 'Homeostasis and Response' },
        ],
      },
      {
        id: 'religious-studies',
        title: 'Religious Studies',
        topics: [
          { id: 'christian-practices', title: 'Christian Practices & Sacraments' },
          { id: 'ethics-peace-conflict', title: 'Ethics: Peace, Conflict and Justice' },
        ],
      },
    ],
  },
};

// 2. Backward-compatible mapping for existing components
export type OakCatalogue = Record<string, Record<string, string[]>>;

export const DEFAULT_OAK_CATALOGUE: OakCatalogue = Object.values(OAK_CURRICULUM_CATALOGUE).reduce(
  (acc, stage) => {
    acc[stage.title] = stage.subjects.reduce((subAcc, sub) => {
      subAcc[sub.title] = sub.topics.map((t) => t.title);
      return subAcc;
    }, {} as Record<string, string[]>);
    return acc;
  },
  {} as OakCatalogue
);