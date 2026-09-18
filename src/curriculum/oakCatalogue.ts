export interface OakLesson {
  id: string;
  title: string;
  lessonNumber?: number;
}

export interface OakTopic {
  id: string;
  title: string;
  lessons?: OakLesson[];
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
          {
            id: 'phonics-simple-sentences',
            title: 'Phonics & Simple Sentences',
            lessons: [
              { id: 'pss-l1-blending-digraphs', title: 'Lesson 1: Blending Digraphs (sh, ch, th)', lessonNumber: 1 },
              { id: 'pss-l2-simple-sentence-structures', title: 'Lesson 2: Simple Sentence Structures (Subject + Verb)', lessonNumber: 2 },
            ],
          },
          {
            id: 'capital-letters-stops',
            title: 'Capital Letters & Full Stops',
            lessons: [
              { id: 'cls-l1-starting-sentences', title: 'Lesson 1: Starting Sentences with Capital Letters', lessonNumber: 1 },
              { id: 'cls-l2-closing-full-stops', title: 'Lesson 2: Concluding Sentences with Full Stops', lessonNumber: 2 },
            ],
          },
          {
            id: 'story-sequencing',
            title: 'Story Sequencing',
            lessons: [
              { id: 'ss-l1-beginning-middle-end', title: 'Lesson 1: Beginning, Middle & End Structure', lessonNumber: 1 },
              { id: 'ss-l2-time-words', title: 'Lesson 2: First, Next, Then & Finally Time Connectives', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'maths',
        title: 'Mathematics',
        topics: [
          {
            id: 'addition-subtraction-20',
            title: 'Addition & Subtraction within 20',
            lessons: [
              { id: 'as20-l1-number-bonds-10-20', title: 'Lesson 1: Number Bonds to 10 and 20', lessonNumber: 1 },
              { id: 'as20-l2-adding-counting-on', title: 'Lesson 2: Adding by Counting On on a Number Line', lessonNumber: 2 },
              { id: 'as20-l3-subtraction-crossing-10', title: 'Lesson 3: Subtraction Crossing the 10 Boundary', lessonNumber: 3 },
            ],
          },
          {
            id: '2d-3d-shapes',
            title: '2D & 3D Shapes',
            lessons: [
              { id: 'shapes-l1-properties-2d', title: 'Lesson 1: Sides & Vertices of 2D Shapes', lessonNumber: 1 },
              { id: 'shapes-l2-faces-edges-3d', title: 'Lesson 2: Faces, Edges & Vertices of 3D Prisms and Pyramids', lessonNumber: 2 },
            ],
          },
          {
            id: 'place-value-50',
            title: 'Place Value to 50',
            lessons: [
              { id: 'pv50-l1-tens-and-ones', title: 'Lesson 1: Grouping into Tens and Ones', lessonNumber: 1 },
              { id: 'pv50-l2-comparing-numbers-50', title: 'Lesson 2: Comparing Greater Than & Less Than to 50', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'science',
        title: 'Science',
        topics: [
          {
            id: 'seasonal-changes',
            title: 'Seasonal Changes',
            lessons: [
              { id: 'sc-l1-four-seasons', title: 'Lesson 1: The Four Seasons & Earth Orbit', lessonNumber: 1 },
              { id: 'sc-l2-daylight-weather', title: 'Lesson 2: Daylight Length & Weather Patterns', lessonNumber: 2 },
              { id: 'sc-l3-deciduous-trees', title: 'Lesson 3: Deciduous Trees & Autumn Cycles', lessonNumber: 3 },
            ],
          },
          {
            id: 'animals-humans',
            title: 'Animals and Humans',
            lessons: [
              { id: 'ah-l1-carnivores-herbivores', title: 'Lesson 1: Carnivores, Herbivores & Omnivores', lessonNumber: 1 },
              { id: 'ah-l2-senses-body', title: 'Lesson 2: Human Body Parts & The Five Senses', lessonNumber: 2 },
            ],
          },
          {
            id: 'materials-properties',
            title: 'Materials and Properties',
            lessons: [
              { id: 'mp-l1-identifying-materials', title: 'Lesson 1: Identifying Everyday Materials', lessonNumber: 1 },
              { id: 'mp-l2-transparent-opaque', title: 'Lesson 2: Transparent vs Opaque Properties', lessonNumber: 2 },
            ],
          },
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
          {
            id: 'fractions-decimals',
            title: 'Fractions and Decimals',
            lessons: [
              { id: 'fd-l1-unit-fractions', title: 'Lesson 1: Unit Fractions & Equal Parts of a Whole', lessonNumber: 1 },
              { id: 'fd-l2-equivalent-fractions', title: 'Lesson 2: Equivalent Fractions on a Number Line', lessonNumber: 2 },
              { id: 'fd-l3-tenths-hundredths', title: 'Lesson 3: Tenths and Hundredths as Decimals', lessonNumber: 3 },
            ],
          },
          {
            id: 'place-value-rounding',
            title: 'Place Value and Rounding',
            lessons: [
              { id: 'pvr-l1-thousands-ten-thousands', title: 'Lesson 1: Value of Digits up to 10,000', lessonNumber: 1 },
              { id: 'pvr-l2-rounding-10-100', title: 'Lesson 2: Rounding to Nearest 10, 100 and 1,000', lessonNumber: 2 },
            ],
          },
          {
            id: 'long-division-multiplication',
            title: 'Long Division & Multiplication',
            lessons: [
              { id: 'ldm-l1-formal-multiplication', title: 'Lesson 1: Formal Written Long Multiplication (2-Digit by 2-Digit)', lessonNumber: 1 },
              { id: 'ldm-l2-short-long-division', title: 'Lesson 2: Bus Stop Division & Interpreting Remainders', lessonNumber: 2 },
            ],
          },
          {
            id: 'perimeter-area',
            title: 'Perimeter and Area',
            lessons: [
              { id: 'pa-l1-calculating-perimeter', title: 'Lesson 1: Calculating Perimeter of Rectilinear Shapes', lessonNumber: 1 },
              { id: 'pa-l2-counting-squares-area', title: 'Lesson 2: Area by Counting Squares & Length × Width', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'english',
        title: 'English',
        topics: [
          {
            id: 'fronted-adverbials-commas',
            title: 'Fronted Adverbials & Commas',
            lessons: [
              { id: 'fac-l1-adverbials-time-place', title: 'Lesson 1: Identifying Fronted Adverbials of Time, Manner & Place', lessonNumber: 1 },
              { id: 'fac-l2-comma-rules-adverbials', title: 'Lesson 2: Punctuating Fronted Adverbials with Commas', lessonNumber: 2 },
            ],
          },
          {
            id: 'direct-speech-punctuation',
            title: 'Direct Speech Punctuation',
            lessons: [
              { id: 'dsp-l1-inverted-commas', title: 'Lesson 1: Inverted Commas for Spoken Words', lessonNumber: 1 },
              { id: 'dsp-l2-reporting-clauses', title: 'Lesson 2: Punctuation Before the Closing Speech Mark', lessonNumber: 2 },
            ],
          },
          {
            id: 'reading-comprehension-inference',
            title: 'Reading Comprehension: Inference',
            lessons: [
              { id: 'rci-l1-textual-clues', title: 'Lesson 1: Finding Implicit Clues in Character Actions', lessonNumber: 1 },
              { id: 'rci-l2-justifying-with-evidence', title: 'Lesson 2: Justifying Inferences Using Textual Evidence', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'science',
        title: 'Science',
        topics: [
          {
            id: 'states-of-matter',
            title: 'States of Matter',
            lessons: [
              { id: 'som-l1-solids-liquids-gases', title: 'Lesson 1: Solids, Liquids & Gases Particle Models', lessonNumber: 1 },
              { id: 'som-l2-changes-of-state', title: 'Lesson 2: Melting, Freezing & Boiling Points', lessonNumber: 2 },
              { id: 'som-l3-evaporation-condensation', title: 'Lesson 3: Evaporation vs Boiling', lessonNumber: 3 },
            ],
          },
          {
            id: 'water-cycle',
            title: 'The Water Cycle',
            lessons: [
              { id: 'wc-l1-evaporation-clouds', title: 'Lesson 1: Evaporation and Cloud Formation', lessonNumber: 1 },
              { id: 'wc-l2-precipitation-runoff', title: 'Lesson 2: Precipitation, Surface Runoff & Infiltration', lessonNumber: 2 },
            ],
          },
          {
            id: 'forces-magnets',
            title: 'Forces and Magnets',
            lessons: [
              { id: 'fm-l1-contact-forces', title: 'Lesson 1: Friction, Air Resistance & Contact Forces', lessonNumber: 1 },
              { id: 'fm-l2-magnetic-poles', title: 'Lesson 2: Magnetic Attraction, Repulsion & Poles', lessonNumber: 2 },
            ],
          },
          {
            id: 'earth-space',
            title: 'Earth and Space',
            lessons: [
              { id: 'es-l1-solar-system', title: 'Lesson 1: The Sun, Earth and Moon Orbit System', lessonNumber: 1 },
              { id: 'es-l2-day-night-rotation', title: 'Lesson 2: Earth Rotation and Day/Night Cycles', lessonNumber: 2 },
            ],
          },
          {
            id: 'electricity-circuits',
            title: 'Electricity & Circuits',
            lessons: [
              { id: 'ec-l1-complete-circuits', title: 'Lesson 1: Series Circuits & Complete Loops', lessonNumber: 1 },
              { id: 'ec-l2-switches-components', title: 'Lesson 2: Switches, Voltage & Bulb Brightness', lessonNumber: 2 },
            ],
          },
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
      {
        id: 'religious-education-catholic',
        title: 'Religious Education (Catholic)',
        topics: [
          {
            id: 'sacrament-of-baptism',
            title: 'Baptism: Belonging to the Family of God',
            lessons: [
              { id: 'bap-l1-signs-symbols-water', title: 'Lesson 1: The Signs of Baptism: Holy Water, Oil of Chrism & White Garment', lessonNumber: 1 },
              { id: 'bap-l2-belonging-church-family', title: 'Lesson 2: Welcomed into the Church Family & The Trinitarian Formula', lessonNumber: 2 },
            ],
          },
          {
            id: 'first-reconciliation',
            title: 'First Reconciliation: God’s Healing Mercy & Forgiveness',
            lessons: [
              { id: 'rec-l1-parable-lost-sheep', title: 'Lesson 1: The Parable of the Prodigal Son & The Good Shepherd', lessonNumber: 1 },
              { id: 'rec-l2-contrition-absolution', title: 'Lesson 2: Examination of Conscience, Act of Contrition & Absolution', lessonNumber: 2 },
            ],
          },
          {
            id: 'liturgy-of-the-word',
            title: 'The Liturgy of the Word: God Speaks in Scripture',
            lessons: [
              { id: 'low-l1-scripture-readings', title: 'Lesson 1: The Old Testament, Responsorial Psalm & Epistles', lessonNumber: 1 },
              { id: 'low-l2-gospel-homily', title: 'Lesson 2: Standing for the Gospel & The Priest’s Homily', lessonNumber: 2 },
            ],
          },
          {
            id: 'the-last-supper',
            title: 'The Last Supper: "Do This in Memory of Me"',
            lessons: [
              { id: 'tls-l1-passover-meal', title: 'Lesson 1: The Passover Feast & Jesus Washing the Disciples’ Feet', lessonNumber: 1 },
              { id: 'tls-l2-institution-eucharist', title: 'Lesson 2: "This is My Body, This is My Blood": The New Covenant', lessonNumber: 2 },
            ],
          },
          {
            id: 'first-holy-communion',
            title: 'The Sacrament of the Eucharist: The Real Presence',
            lessons: [
              { id: 'fhc-l1-transubstantiation-real-presence', title: 'Lesson 1: Bread and Wine Consecrated: The Real Presence of Christ', lessonNumber: 1 },
              { id: 'fhc-l2-reverent-reception-amen', title: 'Lesson 2: Fasting, Reverence, Making a Throne & Saying "Amen"', lessonNumber: 2 },
            ],
          },
          {
            id: 'order-of-the-mass',
            title: 'The Order of the Mass & Reverent Reception',
            lessons: [
              { id: 'oom-l1-introductory-rites', title: 'Lesson 1: Sign of the Cross, Penitential Act & The Gloria', lessonNumber: 1 },
              { id: 'oom-l2-concluding-rites-mission', title: 'Lesson 2: The Final Blessing & "Go in Peace to Love and Serve the Lord"', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'mfl',
        title: 'Modern Foreign Languages & Latin',
        topics: [
          { id: 'french-basics', title: 'French: Greetings, Family & Gender of Nouns' },
          { id: 'spanish-basics', title: 'Spanish: Phonics, Numbers & Animals' },
          { id: 'latin-roots', title: 'Latin Roots & English Derivatives' },
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
          {
            id: 'algebraic-expressions',
            title: 'Algebraic Expressions & Indices',
            lessons: [
              { id: 'ae-l1-simplifying-like-terms', title: 'Lesson 1: Collecting Like Terms & Simplifying', lessonNumber: 1 },
              { id: 'ae-l2-expanding-brackets', title: 'Lesson 2: Expanding Single and Double Brackets', lessonNumber: 2 },
              { id: 'ae-l3-laws-of-indices', title: 'Lesson 3: Multiplying & Dividing Powers (Laws of Indices)', lessonNumber: 3 },
            ],
          },
          {
            id: 'linear-equations',
            title: 'Linear Equations',
            lessons: [
              { id: 'le-l1-two-step-equations', title: 'Lesson 1: Solving Two-Step Linear Equations', lessonNumber: 1 },
              { id: 'le-l2-unknowns-both-sides', title: 'Lesson 2: Equations with Unknowns on Both Sides', lessonNumber: 2 },
            ],
          },
          {
            id: 'probability-venn',
            title: 'Probability & Venn Diagrams',
            lessons: [
              { id: 'pv-l1-single-event-probability', title: 'Lesson 1: Single Event Probability Scale & P(A)', lessonNumber: 1 },
              { id: 'pv-l2-venn-diagrams-intersection', title: 'Lesson 2: Set Notation & Venn Diagram Intersections', lessonNumber: 2 },
            ],
          },
          {
            id: 'pythagoras-theorem',
            title: 'Pythagoras Theorem',
            lessons: [
              { id: 'pt-l1-hypotenuse-calculation', title: 'Lesson 1: Finding the Hypotenuse (a² + b² = c²)', lessonNumber: 1 },
              { id: 'pt-l2-shorter-sides', title: 'Lesson 2: Calculating Shorter Sides and Problem Solving', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'science',
        title: 'Science',
        topics: [
          {
            id: 'atomic-structure',
            title: 'Atomic Structure & Periodic Table',
            lessons: [
              { id: 'as-l1-atoms-elements', title: 'Lesson 1: Atoms, Elements and Subatomic Particles', lessonNumber: 1 },
              { id: 'as-l2-atomic-mass-number', title: 'Lesson 2: Atomic Number, Mass Number & Isotopes', lessonNumber: 2 },
              { id: 'as-l3-electronic-structure', title: 'Lesson 3: Electronic Configuration & Periodic Groups', lessonNumber: 3 },
            ],
          },
          {
            id: 'cell-biology',
            title: 'Cell Biology & Microscopy',
            lessons: [
              { id: 'cb-l1-plant-animal-cells', title: 'Lesson 1: Eukaryotic Cells: Plant vs Animal Structures', lessonNumber: 1 },
              { id: 'cb-l2-prokaryotes-bacteria', title: 'Lesson 2: Prokaryotic Cells & Bacterial Structure', lessonNumber: 2 },
              { id: 'cb-l3-microscopy-magnification', title: 'Lesson 3: Light Microscopy & Magnification Calculations', lessonNumber: 3 },
            ],
          },
          {
            id: 'energy-transfers',
            title: 'Energy Transfers & Conservation',
            lessons: [
              { id: 'et-l1-energy-stores', title: 'Lesson 1: Energy Stores (Kinetic, Gravitational, Chemical)', lessonNumber: 1 },
              { id: 'et-l2-energy-pathways', title: 'Lesson 2: Energy Transfer Pathways & Conservation Law', lessonNumber: 2 },
              { id: 'et-l3-dissipation-efficiency', title: 'Lesson 3: Thermal Dissipation & Sankey Efficiency', lessonNumber: 3 },
            ],
          },
        ],
      },
      {
        id: 'english',
        title: 'English',
        topics: [
          {
            id: 'shakespeare-themes',
            title: 'Shakespeare: Key Themes',
            lessons: [
              { id: 'st-l1-fate-free-will', title: 'Lesson 1: Fate vs Free Will in Romeo and Juliet', lessonNumber: 1 },
              { id: 'st-l2-power-ambition-macbeth', title: 'Lesson 2: Ambition & Tyranny in Macbeth', lessonNumber: 2 },
            ],
          },
          {
            id: 'gothic-literature',
            title: 'Gothic Literature',
            lessons: [
              { id: 'gl-l1-gothic-tropes-setting', title: 'Lesson 1: The Sublime, Isolation & Pathetic Fallacy', lessonNumber: 1 },
              { id: 'gl-l2-uncanny-monsters', title: 'Lesson 2: The Uncanny & The Supernatural Foil', lessonNumber: 2 },
            ],
          },
          {
            id: 'persuasive-writing',
            title: 'Persuasive Writing & Rhetoric',
            lessons: [
              { id: 'pwr-l1-ethos-pathos-logos', title: 'Lesson 1: Ethos, Pathos, and Logos in Speeches', lessonNumber: 1 },
              { id: 'pwr-l2-rhetorical-devices', title: 'Lesson 2: Anaphora, Tricolon & Rhetorical Questions', lessonNumber: 2 },
            ],
          },
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
          { id: 'french-passe-compose', title: 'French: Passé Composé with Avoir & Être' },
          { id: 'spanish-free-time', title: 'Spanish: Free Time & Hobbies' },
          { id: 'spanish-ser-estar', title: 'Spanish: Ser vs Estar & Adjective Agreement' },
        ],
      },
      {
        id: 'religious-education-catholic',
        title: 'Religious Education (Catholic)',
        topics: [
          { id: 'sacrament-of-confirmation', title: 'The Sacrament of Confirmation & Gifts of the Holy Spirit' },
          { id: 'holy-trinity-creed', title: 'The Holy Trinity & The Nicene Creed' },
          { id: 'paschal-mystery', title: 'The Paschal Mystery: Passion, Death & Resurrection' },
          { id: 'mary-and-rosary', title: 'Mary, Mother of God & The Rosary' },
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
          {
            id: 'balancing-equations',
            title: 'Balancing Chemical Equations',
            lessons: [
              { id: 'bce-l1-law-conservation-mass', title: 'Lesson 1: Conservation of Mass & Counting Atoms', lessonNumber: 1 },
              { id: 'bce-l2-stoichiometric-coefficients', title: 'Lesson 2: Balancing Coefficients in Synthesis & Decomposition', lessonNumber: 2 },
            ],
          },
          {
            id: 'electrolysis',
            title: 'Electrolysis & Electrolytes',
            lessons: [
              { id: 'el-l1-molten-electrolytes', title: 'Lesson 1: Electrolysis of Molten Ionic Compounds (Lead Bromide)', lessonNumber: 1 },
              { id: 'el-l2-aqueous-solutions', title: 'Lesson 2: Predicting Products in Aqueous Solutions (H⁺ and OH⁻ Rules)', lessonNumber: 2 },
            ],
          },
          {
            id: 'quantitative-chemistry',
            title: 'Quantitative Chemistry & Moles',
            lessons: [
              { id: 'qc-l1-relative-formula-mass', title: 'Lesson 1: Relative Formula Mass (Mr) & Percentage Composition', lessonNumber: 1 },
              { id: 'qc-l2-moles-avogadro', title: 'Lesson 2: Moles, Mass and Avogadro’s Constant (n = m/Mr)', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'physics',
        title: 'Physics',
        topics: [
          {
            id: 'newtonian-mechanics',
            title: 'Newtonian Mechanics & Force',
            lessons: [
              { id: 'nm-l1-newtons-first-law', title: 'Lesson 1: Newton’s First Law & Balanced Resultant Forces', lessonNumber: 1 },
              { id: 'nm-l2-newtons-second-law', title: 'Lesson 2: Newton’s Second Law: F = ma Calculations', lessonNumber: 2 },
              { id: 'nm-l3-newtons-third-law', title: 'Lesson 3: Newton’s Third Law: Action-Reaction Force Pairs', lessonNumber: 3 },
            ],
          },
          {
            id: 'em-spectrum',
            title: 'Waves and Electromagnetic Spectrum',
            lessons: [
              { id: 'em-l1-transverse-longitudinal', title: 'Lesson 1: Transverse vs Longitudinal Wave Properties (v = fλ)', lessonNumber: 1 },
              { id: 'em-l2-em-spectrum-hazards', title: 'Lesson 2: The 7 EM Bands, Wavelength Trends & Ionising Radiation', lessonNumber: 2 },
            ],
          },
          {
            id: 'radioactivity',
            title: 'Radioactivity & Half-Life',
            lessons: [
              { id: 'rad-l1-alpha-beta-gamma', title: 'Lesson 1: Alpha, Beta & Gamma Ionising Powers & Penetration', lessonNumber: 1 },
              { id: 'rad-l2-half-life-decay-curves', title: 'Lesson 2: Radioactive Half-Life & Decay Curve Graphs', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'biology',
        title: 'Biology',
        topics: [
          {
            id: 'genetics-inheritance',
            title: 'Genetics and Inheritance',
            lessons: [
              { id: 'gi-l1-dna-genes-chromosomes', title: 'Lesson 1: DNA Double Helix, Genes & Alleles', lessonNumber: 1 },
              { id: 'gi-l2-punnett-squares-phenotype', title: 'Lesson 2: Monohybrid Crosses, Punnett Squares & Ratios', lessonNumber: 2 },
            ],
          },
          {
            id: 'photosynthesis-transport',
            title: 'Photosynthesis & Plant Transport',
            lessons: [
              { id: 'pt-l1-photosynthesis-equation', title: 'Lesson 1: The Word & Chemical Equation for Photosynthesis', lessonNumber: 1 },
              { id: 'pt-l2-xylem-phloem-transpiration', title: 'Lesson 2: Xylem, Phloem & The Transpiration Stream', lessonNumber: 2 },
            ],
          },
          {
            id: 'homeostasis-response',
            title: 'Homeostasis and Response',
            lessons: [
              { id: 'hr-l1-nervous-reflex-arc', title: 'Lesson 1: The Nervous System, Synapses & Reflex Arcs', lessonNumber: 1 },
              { id: 'hr-l2-blood-glucose-insulin', title: 'Lesson 2: Blood Glucose Regulation: Insulin & Glucagon Negative Feedback', lessonNumber: 2 },
            ],
          },
        ],
      },
      {
        id: 'religious-studies',
        title: 'Religious Studies (General & GCSE)',
        topics: [
          { id: 'christian-practices', title: 'Christian Practices & Sacraments' },
          { id: 'ethics-peace-conflict', title: 'Ethics: Peace, Conflict and Justice' },
        ],
      },
      {
        id: 'catholic-christianity',
        title: 'Catholic Christianity (GCSE)',
        topics: [
          { id: 'gcse-re-trinity', title: 'The Nature of God: The Holy Trinity' },
          { id: 'catholic-social-teaching', title: 'Catholic Social Teaching & Human Dignity' },
          { id: 'catholic-sources-of-authority', title: 'Sources of Authority: Scripture, Tradition & Magisterium' },
          { id: 'catholic-eschatology', title: 'Eschatology: Death, Judgment, Purgatory, Heaven & Hell' },
        ],
      },
      {
        id: 'mfl',
        title: 'Modern Foreign Languages (GCSE)',
        topics: [
          { id: 'spanish-past-future', title: 'Spanish: Preterite vs Imperfect & Future' },
          { id: 'french-complex-opinions', title: 'French: Complex Opinions & Subjunctive' },
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

/**
 * Helper to retrieve Oak National Academy lessons for a given stage, subject, and topic
 */
export function findTopicLessons(stageKey: string, subjectTitle: string, topicTitle: string): OakLesson[] {
  const normStage = (stageKey || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const stage = Object.values(OAK_CURRICULUM_CATALOGUE).find((s) => {
    const sId = s.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    const sTitle = s.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    return sId === normStage || sTitle === normStage || normStage.includes(sId) || sId.includes(normStage);
  });
  if (!stage) return [];

  const normSub = (subjectTitle || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const subject = stage.subjects.find((sub) => {
    const subTitle = sub.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const subId = sub.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    return subTitle === normSub || subId === normSub || subTitle.includes(normSub) || normSub.includes(subTitle);
  });
  if (!subject) return [];

  const normTop = (topicTitle || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const topic = subject.topics.find((t) => {
    const topTitle = t.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const topId = t.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    return topTitle === normTop || topId === normTop || topTitle.includes(normTop) || normTop.includes(topTitle);
  });

  return topic?.lessons || [];
}