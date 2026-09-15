// src/data/oakCurriculumKnowledge.ts
// Comprehensive, 100% Offline-First UK National Curriculum Knowledge Base
// Designed for zero-internet rural, low-resource, mobile, and browser environments.

export interface CurriculumQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerKey: number; // 0-indexed correct option in `options`
  hint: string;
  explanation: string;
}

import { findCustomTopicKnowledge } from '../services/curriculumPackStore';
import { CURRICULUM_EXPANSION_BASE } from './curriculumKnowledgeExpansion';

export interface CurriculumTopicKnowledge {

  topicId: string;
  title: string;
  keyStage: string;
  subject: string;
  coreAxiom: string;
  cognitiveTrap: string;
  socraticPivot: string;
  hook: string;
  guidedStep: string;
  scaffoldHints: {
    level1: string; // Gentle real-world analogy
    level2: string; // Core curriculum rule
    level3: string; // Step-by-step demonstration
  };
  questions: CurriculumQuestion[];
}

export const CURRICULUM_KNOWLEDGE_BASE: Record<string, CurriculumTopicKnowledge> = {
  // ==========================================
  // KEY STAGE 1 (Ages 5-7 / Primary)
  // ==========================================

  // --- KS1 Science ---
  'ks1:science:seasonal-changes': {
    topicId: 'seasonal-changes',
    title: 'Seasonal Changes',
    keyStage: 'Key Stage 1',
    subject: 'Science',
    coreAxiom: 'There are four seasons (Autumn, Winter, Spring, Summer) with distinct daylight hours and weather patterns caused by the Earth orbiting the Sun.',
    cognitiveTrap: 'Believing that seasonal weather changes happen randomly overnight rather than as a continuous cyclical pattern.',
    socraticPivot: 'Why do daylight hours get shorter in Winter and longer in Summer?',
    hook: 'Have you noticed why you wear a warm coat in January but light clothes in July?',
    guidedStep: 'Observe changes in trees, daylight hours, and temperature across the four seasons.',
    scaffoldHints: {
      level1: 'Think about when leaves turn orange and drop to the ground, versus when flowers bloom in warm sunshine.',
      level2: 'The UK experiences four seasons in order: Spring, Summer, Autumn, and Winter. Days are longest in Summer and shortest in Winter.',
      level3: 'Look at the calendar: December to February is Winter (cold, short days); June to August is Summer (warm, long days).'
    },
    questions: [
      {
        id: 'ks1-sci-season-1',
        prompt: 'In which season in the UK are the daylight hours shortest and the weather typically coldest?',
        options: ['Winter', 'Summer', 'Spring', 'Autumn'],
        answerKey: 0,
        hint: 'Think about when it gets dark before 4:30 PM and you need a heavy winter coat.',
        explanation: 'Winter has the shortest daylight hours and coldest temperatures because our hemisphere is tilted away from the Sun.'
      },
      {
        id: 'ks1-sci-season-2',
        prompt: 'What happens to deciduous trees during Autumn?',
        options: ['Their leaves change colour and fall off', 'They grow fresh green leaves', 'They produce brand new spring blossoms', 'They freeze and turn to stone'],
        answerKey: 0,
        hint: 'What happens to the leaves in September and October?',
        explanation: 'In Autumn, deciduous trees prepare for cold weather by shedding their leaves to conserve moisture and energy.'
      }
    ]
  },

  'ks1:science:animals-humans': {
    topicId: 'animals-humans',
    title: 'Animals and Humans',
    keyStage: 'Key Stage 1',
    subject: 'Science',
    coreAxiom: 'Animals, including humans, need water, food, and air to survive and can be grouped as carnivores, herbivores, or omnivores.',
    cognitiveTrap: 'Thinking humans are not animals, or that all animals eat the exact same food.',
    socraticPivot: 'What three things does every animal—including you—need to stay alive?',
    hook: 'If a lion eats only meat, what happens if you try to feed it grass?',
    guidedStep: 'Compare body parts (limbs, senses) and diets of birds, fish, mammals, amphibians, and reptiles.',
    scaffoldHints: {
      level1: 'Think about your own day: you drink water, breathe fresh air, and eat meals to have energy.',
      level2: 'Herbivores eat plants. Carnivores eat other animals (meat). Omnivores eat both plants and meat.',
      level3: 'A cow eats grass (herbivore). A tiger eats meat (carnivore). A human eats carrots and chicken (omnivore).'
    },
    questions: [
      {
        id: 'ks1-sci-anim-1',
        prompt: 'What do we call an animal that eats only plants (like grass, leaves, and berries)?',
        options: ['Herbivore', 'Carnivore', 'Omnivore', 'Insectivore'],
        answerKey: 0,
        hint: 'The word starts with "Herb" (think of plants and herbs).',
        explanation: 'Herbivores eat plant material. Carnivores eat meat, and omnivores eat both plants and animals.'
      },
      {
        id: 'ks1-sci-anim-2',
        prompt: 'Which of the following do ALL living animals, including humans, need to survive?',
        options: ['Water, food, and air', 'Shelter, toys, and milk', 'Sunlight, soil, and fertiliser', 'Only fruit and warm blankets'],
        answerKey: 0,
        hint: 'What do you breathe, drink, and eat every single day?',
        explanation: 'All animals need air (oxygen), water, and food (nutrients) to survive and stay healthy.'
      }
    ]
  },

  'ks1:science:materials-properties': {
    topicId: 'materials-properties',
    title: 'Materials and Properties',
    keyStage: 'Key Stage 1',
    subject: 'Science',
    coreAxiom: 'Everyday objects are made from materials chosen for their specific physical properties (e.g. waterproof, flexible, transparent, rigid).',
    cognitiveTrap: 'Confusing the name of the object with the material it is made from (e.g. calling plastic "spoon").',
    socraticPivot: 'Why would an umbrella made of paper be a terrible idea?',
    hook: 'Imagine trying to build a window out of solid wood. Why wouldn\'t that work?',
    guidedStep: 'Test and classify materials as wood, plastic, glass, metal, water, or rock by testing transparency and flexibility.',
    scaffoldHints: {
      level1: 'If you want to see outside, what material must a window be made of? Clear glass!',
      level2: 'Materials have properties: glass is transparent and brittle; rubber is flexible and waterproof; metal is strong and rigid.',
      level3: 'An umbrella needs to keep water out, so it must be made of a waterproof material like nylon or plastic, not absorbent paper.'
    },
    questions: [
      {
        id: 'ks1-sci-mat-1',
        prompt: 'Why are windows usually made of glass instead of wood?',
        options: ['Glass is transparent so light can pass through', 'Glass is softer than wood', 'Wood is completely waterproof', 'Glass is cheap and flexible'],
        answerKey: 0,
        hint: 'Think about being able to see through the window.',
        explanation: 'Glass is transparent, which allows daylight into a room while keeping the wind and rain out.'
      },
      {
        id: 'ks1-sci-mat-2',
        prompt: 'Which property makes rubber a great material for waterproof rain boots (wellies)?',
        options: ['It is waterproof and flexible', 'It is transparent and brittle', 'It absorbs water like a sponge', 'It is made of heavy metal'],
        answerKey: 0,
        hint: 'Wellies must keep your feet dry and bend as you walk.',
        explanation: 'Rubber is waterproof (stops water getting through) and flexible (bends comfortably with foot movement).'
      }
    ]
  },

  // --- KS1 Mathematics ---
  'ks1:maths:addition-subtraction-20': {
    topicId: 'addition-subtraction-20',
    title: 'Addition & Subtraction within 20',
    keyStage: 'Key Stage 1',
    subject: 'Mathematics',
    coreAxiom: 'Addition combines groups (commutative: 7 + 5 = 5 + 7); subtraction finds the difference or removes an amount (inverse of addition).',
    cognitiveTrap: 'Counting every single item starting from 1 rather than "counting on" from the larger number.',
    socraticPivot: 'If you already have 9 apples, why count from 1 to add 4 more?',
    hook: 'If you have 8 marbles and your friend gives you 5 more, how fast can you count them without starting from 1?',
    guidedStep: 'Use number bonds to 10 (e.g. 8 + 2 = 10, then add 3 = 13) and counting on from the largest number.',
    scaffoldHints: {
      level1: 'Put the biggest number in your head (like 9), and hold up 4 fingers to count on: 10, 11, 12, 13!',
      level2: 'Bridge through 10: to calculate 8 + 5, split 5 into 2 and 3. 8 + 2 = 10, then 10 + 3 = 13.',
      level3: 'For subtraction like 14 - 6: take away 4 to reach 10, then take away 2 more to reach 8.'
    },
    questions: [
      {
        id: 'ks1-mat-add-1',
        prompt: 'What is 8 + 7?',
        options: ['15', '14', '16', '13'],
        answerKey: 0,
        hint: 'Bridge through 10: 8 + 2 = 10, then add the remaining 5.',
        explanation: '8 + 7 = 15. We know 8 + 2 = 10, and 7 is 2 + 5, so 10 + 5 = 15.'
      },
      {
        id: 'ks1-mat-add-2',
        prompt: 'If you have 17 counters and take away 9, how many are left?',
        options: ['8', '9', '7', '10'],
        answerKey: 0,
        hint: '17 take away 7 is 10. Now take away 2 more.',
        explanation: '17 - 9 = 8. (17 - 7 = 10, and 10 - 2 = 8).'
      }
    ]
  },

  'ks1:maths:2d-3d-shapes': {
    topicId: '2d-3d-shapes',
    title: '2D & 3D Shapes',
    keyStage: 'Key Stage 1',
    subject: 'Mathematics',
    coreAxiom: '2D shapes are flat with sides and vertices; 3D shapes are solid with faces, edges, and vertices.',
    cognitiveTrap: 'Calling a 3D sphere a "circle" or a 3D cube a "square".',
    socraticPivot: 'Can you hold a circle in your hand, or can you only hold a sphere like a ball?',
    hook: 'Look at a cardboard box. Is it flat like a drawing of a square, or can you store items inside it?',
    guidedStep: 'Count vertices (corners), edges/sides, and faces on common 2D and 3D shapes.',
    scaffoldHints: {
      level1: 'A drawing on paper is flat (2D). A real object you can hold (like a football or dice) is solid (3D).',
      level2: 'A cube has 6 square faces, 12 edges, and 8 vertices. A cylinder has 2 flat circular faces and 1 curved surface.',
      level3: 'A triangle has 3 sides and 3 vertices. A rectangle has 4 straight sides (opposite sides equal) and 4 right angles.'
    },
    questions: [
      {
        id: 'ks1-mat-shape-1',
        prompt: 'How many flat square faces does a cube have?',
        options: ['6', '4', '8', '12'],
        answerKey: 0,
        hint: 'Think of a 6-sided playing dice.',
        explanation: 'A cube has exactly 6 identical square faces, 12 straight edges, and 8 vertices.'
      },
      {
        id: 'ks1-mat-shape-2',
        prompt: 'Which 2D shape has 3 straight sides and 3 corners (vertices)?',
        options: ['Triangle', 'Square', 'Pentagon', 'Circle'],
        answerKey: 0,
        hint: '"Tri" means three (like a tricycle has 3 wheels).',
        explanation: 'A triangle has 3 straight sides and 3 vertices.'
      }
    ]
  },

  // --- KS1 English ---
  'ks1:english:capital-letters-stops': {
    topicId: 'capital-letters-stops',
    title: 'Capital Letters & Full Stops',
    keyStage: 'Key Stage 1',
    subject: 'English',
    coreAxiom: 'Every complete sentence starts with a capital letter, expresses a whole thought, and ends with a punctuation mark (full stop, question mark, or exclamation mark).',
    cognitiveTrap: 'Putting capital letters in the middle of words, or forgetting full stops between distinct ideas.',
    socraticPivot: 'How does a reader know where one idea stops and the next one starts?',
    hook: 'What would happen if all the words in a book ran together without any stops?',
    guidedStep: 'Identify sentence boundaries and apply capital letters for sentence starts, "I", and proper nouns.',
    scaffoldHints: {
      level1: 'A sentence is like a train: the capital letter is the engine at the front, and the full stop is the red light at the end.',
      level2: 'Capital letters are used for: 1) The first word in every sentence; 2) The pronoun "I"; 3) Names of people and places (proper nouns).',
      level3: 'Check: Does your sentence start with a capital? Does it make sense on its own? Does it end with a full stop?'
    },
    questions: [
      {
        id: 'ks1-eng-punc-1',
        prompt: 'Which sentence is punctuated correctly with a capital letter and full stop?',
        options: [
          'The dog ran across the sunny garden.',
          'the dog ran across the sunny garden.',
          'The dog ran across the sunny garden',
          'The Dog Ran Across The Sunny Garden.'
        ],
        answerKey: 0,
        hint: 'Check the first letter (capital) and the last mark (full stop), without random capitals in the middle.',
        explanation: 'Sentences must start with a single capital letter ("The") and end with a full stop, keeping regular nouns in lowercase.'
      }
    ]
  },

  // ==========================================
  // KEY STAGE 2 (Ages 7-11 / Junior Primary)
  // ==========================================

  // --- KS2 Science ---
  'ks2:science:states-of-matter': {
    topicId: 'states-of-matter',
    title: 'States of Matter',
    keyStage: 'Key Stage 2',
    subject: 'Science',
    coreAxiom: 'Matter exists as solids, liquids, or gases depending on particle arrangement and thermal energy.',
    cognitiveTrap: 'Thinking gases weigh nothing or that ice, water, and steam are three completely different chemicals.',
    socraticPivot: 'When an ice cube melts into water and then boils into steam, did the substance change, or just how its particles move?',
    hook: 'Why does steam spread out to fill an entire bathroom, while a bar of soap stays the exact same shape on the sink?',
    guidedStep: 'Model particles: tightly packed in vibrating rows (solid), close but flowing past each other (liquid), and moving rapidly far apart (gas).',
    scaffoldHints: {
      level1: 'Solid: like children sitting frozen in desks. Liquid: walking and sliding around the room. Gas: running and bouncing off the walls!',
      level2: 'Solids have fixed shape and volume. Liquids take the shape of their container with fixed volume. Gases expand to fill the entire container.',
      level3: 'Heating adds kinetic energy: Melting turns solid to liquid (0°C for water). Evaporating/boiling turns liquid to gas (100°C for water).'
    },
    questions: [
      {
        id: 'ks2-sci-states-1',
        prompt: 'What happens to the particles in liquid water when it freezes into solid ice?',
        options: [
          'They lose thermal energy and vibrate in fixed positions in a rigid lattice',
          'They gain energy and move around much faster',
          'They disappear into cold air',
          'They change into a completely different chemical substance'
        ],
        answerKey: 0,
        hint: 'In a solid, can particles freely slide past each other, or are they locked in place?',
        explanation: 'When water cools to 0°C, the particles lose kinetic energy and become locked into fixed positions vibrating in a solid structure.'
      },
      {
        id: 'ks2-sci-states-2',
        prompt: 'Which state of matter has NO fixed shape and expands to fill whatever container it is in?',
        options: ['Gas', 'Liquid', 'Solid', 'Ice'],
        answerKey: 0,
        hint: 'Think about helium inside a balloon or steam in a room.',
        explanation: 'Gases have weak forces between particles, allowing them to move freely and expand into all available space.'
      }
    ]
  },

  'ks2:science:water-cycle': {
    topicId: 'water-cycle',
    title: 'The Water Cycle',
    keyStage: 'Key Stage 2',
    subject: 'Science',
    coreAxiom: 'The water cycle continuously circulates water through evaporation, condensation, precipitation, and collection powered by solar energy.',
    cognitiveTrap: 'Thinking that rain comes from new water created in the clouds, rather than recycled water from Earth\'s oceans and land.',
    socraticPivot: 'Could the water you drank today be the exact same water a dinosaur drank millions of years ago?',
    hook: 'Where does the water in a puddle on the playground go on a hot, sunny afternoon?',
    guidedStep: 'Trace water from the ocean (evaporation by the Sun) -> rising and cooling (condensation into clouds) -> falling as rain/snow (precipitation) -> rivers/groundwater (collection).',
    scaffoldHints: {
      level1: 'The Sun heats the puddle -> water vapor rises invisible into the sky -> cools into fluffy clouds -> clouds get heavy and drop rain!',
      level2: 'Evaporation: liquid to gas (vapor). Condensation: gas cooling into liquid droplets. Precipitation: rain, snow, sleet, or hail.',
      level3: 'Earth\'s water is conserved: water does not vanish; it cycles endlessly between oceans, atmosphere, and land.'
    },
    questions: [
      {
        id: 'ks2-sci-water-1',
        prompt: 'What process causes liquid water on Earth\'s surface to turn into invisible water vapor when heated by the Sun?',
        options: ['Evaporation', 'Condensation', 'Precipitation', 'Transpiration'],
        answerKey: 0,
        hint: 'Think of heat turning water into steam/vapor.',
        explanation: 'Evaporation is the process by which liquid water absorbs thermal energy from the Sun and changes into water vapor gas.'
      },
      {
        id: 'ks2-sci-water-2',
        prompt: 'When warm water vapor rises high into the cool atmosphere, what happens to form clouds?',
        options: [
          'It cools and condenses into tiny liquid water droplets',
          'It freezes into solid rocks',
          'It catches fire in the upper atmosphere',
          'It evaporates into outer space'
        ],
        answerKey: 0,
        hint: 'What happens when water vapor meets cold air?',
        explanation: 'Condensation happens when rising water vapor cools and turns back into billions of microscopic liquid droplets, forming clouds.'
      }
    ]
  },

  'ks2:science:forces-magnets': {
    topicId: 'forces-magnets',
    title: 'Forces and Magnets',
    keyStage: 'Key Stage 2',
    subject: 'Science',
    coreAxiom: 'Forces are pushes, pulls, or twists. Friction and air resistance oppose motion. Magnets attract magnetic materials (iron, steel) and have two poles (like repel, opposites attract).',
    cognitiveTrap: 'Thinking all shiny metals are magnetic (e.g. thinking aluminum or copper stick to magnets).',
    socraticPivot: 'If two north poles of two magnets are pushed together, what invisible force pushes back?',
    hook: 'Why do sneakers have rubber grip soles instead of smooth plastic bottom surfaces?',
    guidedStep: 'Experiment with contact forces (friction on carpet vs wood) and non-contact forces (magnetic attraction/repulsion).',
    scaffoldHints: {
      level1: 'Try sliding across an ice rink vs a carpet: the carpet grips your shoes because of high friction.',
      level2: 'Magnetic rule: Opposite poles attract (North + South pull together). Like poles repel (North + North push away).',
      level3: 'Only certain metals are magnetic: iron, nickel, cobalt, and steel. Gold, aluminum, silver, and copper are NOT magnetic!'
    },
    questions: [
      {
        id: 'ks2-sci-force-1',
        prompt: 'What happens when the North pole of one bar magnet is brought close to the North pole of another bar magnet?',
        options: ['They repel (push apart)', 'They attract (stick together)', 'They cancel each other out and demagnetise', 'They spark and catch fire'],
        answerKey: 0,
        hint: 'Rule: "Like poles repel, opposite poles attract."',
        explanation: 'Identical magnetic poles (North and North, or South and South) repel each other with magnetic force.'
      },
      {
        id: 'ks2-sci-force-2',
        prompt: 'Which of these common metals will be strongly attracted to a magnet?',
        options: ['Iron', 'Aluminium', 'Copper', 'Gold'],
        answerKey: 0,
        hint: 'Only ferrous metals (containing iron) and nickel/cobalt stick to magnets.',
        explanation: 'Iron is a ferromagnetic metal. Aluminium, copper, and gold are non-magnetic metals.'
      }
    ]
  },

  'ks2:science:electricity-circuits': {
    topicId: 'electricity-circuits',
    title: 'Electricity & Circuits',
    keyStage: 'Key Stage 2',
    subject: 'Science',
    coreAxiom: 'Electric current requires an unbroken conductive loop (circuit) powered by a cell/battery to deliver energy to components.',
    cognitiveTrap: 'The "clashing currents" misconception: believing positive and negative electricity rush from both ends to collide in the bulb.',
    socraticPivot: 'If there is a tiny break anywhere in the wire loop, why does the bulb immediately turn off?',
    hook: 'When you flick a light switch in your classroom, what is physically happening inside the wall?',
    guidedStep: 'Build series circuits with cells, switches, wires, bulbs, and buzzers, identifying open vs closed circuits.',
    scaffoldHints: {
      level1: 'A circuit is like a bicycle chain: all the links must be connected in a continuous circle for the pedals to turn the wheel.',
      level2: 'Current is the flow of electric charge around a closed circuit from the positive terminal to the negative terminal.',
      level3: 'A switch works by opening (breaking) or closing (completing) the gap in the wire.'
    },
    questions: [
      {
        id: 'ks2-sci-elec-1',
        prompt: 'What happens to a bulb in a simple circuit when a switch is opened?',
        options: ['The bulb turns off because the circuit is broken', 'The bulb shines twice as bright', 'The battery charges up', 'The electricity spills out onto the table'],
        answerKey: 0,
        hint: 'An "open" switch creates a gap in the loop.',
        explanation: 'An open switch breaks the continuous conductive pathway, preventing current from flowing, so the bulb turns off.'
      }
    ]
  },

  // --- KS2 Mathematics ---
  'ks2:maths:fractions-decimals': {
    topicId: 'fractions-decimals',
    title: 'Fractions and Decimals',
    keyStage: 'Key Stage 2',
    subject: 'Mathematics',
    coreAxiom: 'A fraction represents part of a whole; the denominator denotes total equal divisions, the numerator denotes how many parts are taken. Decimals represent fractions with powers of 10.',
    cognitiveTrap: 'Assuming that 1/8 is bigger than 1/4 because 8 is larger than 4.',
    socraticPivot: 'If a chocolate cake is divided equally among 8 children versus 4 children, who gets a bigger slice?',
    hook: 'Would you rather have 1/2 of a pizza or 1/10 of the same pizza?',
    guidedStep: 'Find equivalent fractions by multiplying or dividing numerator and denominator by the same non-zero number.',
    scaffoldHints: {
      level1: 'Denominator = how many slices the pizza was cut into. The more slices you cut, the smaller each slice must be!',
      level2: '1/2 = 0.5 = 50%. 1/4 = 0.25 = 25%. 3/4 = 0.75 = 75%.',
      level3: 'To compare fractions with different denominators, find a common denominator: 1/4 = 2/8. Since 2/8 < 3/8, 3/8 is larger than 1/4.'
    },
    questions: [
      {
        id: 'ks2-mat-frac-1',
        prompt: 'Which fraction is the largest?',
        options: ['1/2', '1/4', '1/8', '1/10'],
        answerKey: 0,
        hint: 'If you share a pie with fewer people, each person gets a larger share.',
        explanation: '1/2 represents one out of two equal parts (50%), which is larger than 1/4 (25%), 1/8 (12.5%), or 1/10 (10%).'
      },
      {
        id: 'ks2-mat-frac-2',
        prompt: 'What is 3/4 written as a decimal?',
        options: ['0.75', '0.34', '0.43', '0.3'],
        answerKey: 0,
        hint: 'Think of 3 quarters of 100 pence.',
        explanation: '3/4 = 75/100 = 0.75.'
      },
      {
        id: 'ks2-mat-frac-3',
        prompt: 'What is 2/5 + 1/5?',
        options: ['3/5', '3/10', '2/10', '3/25'],
        answerKey: 0,
        hint: 'When denominators are identical, add only the top numerators.',
        explanation: 'When adding fractions with identical denominators, add the numerators: 2 + 1 = 3, so 3/5.'
      }
    ]
  },

  'ks2:maths:perimeter-area': {
    topicId: 'perimeter-area',
    title: 'Perimeter and Area',
    keyStage: 'Key Stage 2',
    subject: 'Mathematics',
    coreAxiom: 'Perimeter is the continuous distance around the outer boundary (measured in length units like cm/m). Area is the 2D surface enclosed within the boundary (measured in square units like cm²/m²).',
    cognitiveTrap: 'Confusing perimeter with area, or adding length and width without multiplying for area.',
    socraticPivot: 'If you want to build a fence around a sheep field, do you measure perimeter or area?',
    hook: 'If you are buying carpet to cover a classroom floor, what mathematical calculation do you need?',
    guidedStep: 'Perimeter of rectangle = 2 × (length + width). Area of rectangle = length × width.',
    scaffoldHints: {
      level1: 'Perimeter: walking along the fence all the way around the outside. Area: painting the entire grass lawn inside.',
      level2: 'Rectangle with length 6m and width 4m: Perimeter = 6 + 4 + 6 + 4 = 20m. Area = 6 × 4 = 24m².',
      level3: 'Units matter: Perimeter uses regular meters (m). Area uses square meters (m²).'
    },
    questions: [
      {
        id: 'ks2-mat-perim-1',
        prompt: 'A rectangular garden has a length of 8 meters and a width of 5 meters. What is its AREA?',
        options: ['40 m²', '26 m', '40 m', '13 m²'],
        answerKey: 0,
        hint: 'Area of rectangle = length × width (in square meters).',
        explanation: 'Area = length × width = 8m × 5m = 40 m².'
      },
      {
        id: 'ks2-mat-perim-2',
        prompt: 'What is the PERIMETER of the same 8m by 5m rectangular garden?',
        options: ['26 m', '40 m²', '13 m', '26 m²'],
        answerKey: 0,
        hint: 'Add all four sides: 8 + 5 + 8 + 5.',
        explanation: 'Perimeter is the distance all the way around: 8m + 5m + 8m + 5m = 26 m.'
      }
    ]
  },

  // --- KS2 Computing ---
  'ks2:computing:algorithms-sequencing': {
    topicId: 'algorithms-sequencing',
    title: 'Algorithms & Sequencing',
    keyStage: 'Key Stage 2',
    subject: 'Computing',
    coreAxiom: 'An algorithm is a precise, ordered set of instructions designed to solve a problem or complete a task; incorrect sequence causes bugs.',
    cognitiveTrap: 'Believing computers are smart and can "guess" missing instructions in a program.',
    socraticPivot: 'If you tell a robot "put your shoes on, then put your socks on", what problem happens?',
    hook: 'What would happen if a recipe told you to bake a cake in the oven before mixing the flour and eggs?',
    guidedStep: 'Deconstruct a task into sequential inputs, processes, decision conditions (if/else), and outputs.',
    scaffoldHints: {
      level1: 'Think of a recipe or building Lego: every step must be done in exact order or the result is ruined.',
      level2: 'Computers do exactly what you tell them, not what you meant to tell them. Bugs happen when steps are missing or out of order.',
      level3: 'Algorithms use sequence (step-by-step), selection (if condition then do X else Y), and repetition (loops).'
    },
    questions: [
      {
        id: 'ks2-comp-algo-1',
        prompt: 'What is the definition of an algorithm in computing?',
        options: [
          'A precise, ordered sequence of instructions to solve a problem',
          'A physical computer monitor or keyboard',
          'A virus that damages hardware',
          'An internet website address'
        ],
        answerKey: 0,
        hint: 'Think of a step-by-step recipe for a computer.',
        explanation: 'An algorithm is an unambiguous, step-by-step set of rules or instructions to accomplish a specific task.'
      }
    ]
  },

  // --- KS2 Religious Education (Catholic First Holy Communion Programme) ---
  'ks2:religious-education-catholic:sacrament-of-baptism': {
    topicId: 'sacrament-of-baptism',
    title: 'Baptism: Belonging to the Family of God',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'Baptism is the gateway to life in the Spirit and the door giving access to the other Sacraments. Through holy water and the Holy Spirit, we are freed from original sin and reborn as children of God into the Catholic Church (CCC 1213).',
    cognitiveTrap: 'Believing that Baptism is merely a naming party or celebration, rather than a real spiritual transformation making us living members of the Body of Christ.',
    socraticPivot: 'What do the holy water and the white garment at Baptism show us about what God does inside our souls?',
    hook: 'When someone joins a sports team or school, they receive a special uniform. What holy symbols show that a person has joined God\'s family in the Catholic Church?',
    guidedStep: 'Explore the 4 key signs of Baptism: Holy Water (cleansing from sin and giving new life), Sacred Chrism Oil (anointing with the Holy Spirit as priest, prophet, and king), White Garment (clothed in Christ and spiritual purity), and the Baptismal Candle (Christ as the Light of the World).',
    scaffoldHints: {
      level1: 'Think about washing your hands when they are dirty: water cleans our body on the outside, while the Sacrament of Baptism washes our soul clean inside.',
      level2: 'In Baptism, the priest pours water three times saying: "I baptize you in the name of the Father, and of the Son, and of the Holy Spirit."',
      level3: 'Baptism leaves a permanent, indelible spiritual seal on our soul. Because we are now children of God, we are invited to prepare for Reconciliation and the Holy Eucharist.'
    },
    questions: [
      {
        id: 'ks2-re-bap-1',
        prompt: 'What is the main spiritual gift received in the Sacrament of Baptism?',
        options: [
          'We are freed from original sin and welcomed as children of God into the Church',
          'We receive a certificate to keep in a school drawer',
          'We choose our future career and occupation',
          'We become an official choir singer in the parish'
        ],
        answerKey: 0,
        hint: 'Think about being washed clean from sin and entering God\'s family.',
        explanation: 'Baptism washes away original sin, pours sanctifying grace into our soul, and makes us beloved sons and daughters of God.'
      },
      {
        id: 'ks2-re-bap-2',
        prompt: 'Which essential words does the priest or deacon say while pouring holy water three times during Baptism?',
        options: [
          '"I baptize you in the name of the Father, and of the Son, and of the Holy Spirit"',
          '"Welcome to our school community, peace be with you"',
          '"May you grow tall, strong, and prosperous in life"',
          '"By the power of the church building, you are named"'
        ],
        answerKey: 0,
        hint: 'Remember the Trinity: Father, Son, and Holy Spirit.',
        explanation: 'The Trinitarian formula commanded by Jesus in Matthew 28:19 is the essential form of the Sacrament of Baptism.'
      },
      {
        id: 'ks2-re-bap-3',
        prompt: 'What does the white garment given to the newly baptized person represent?',
        options: [
          'Purity, new life, and having "put on Christ"',
          'That it is a formal party day',
          'That the person must always wear white clothes to church',
          'The cold temperature of holy water'
        ],
        answerKey: 0,
        hint: 'White represents clean innocence and belonging wholly to Christ.',
        explanation: 'The white garment symbolizes that the baptized person has been cleansed of sin and has put on the righteousness of Christ (Galatians 3:27).'
      }
    ]
  },

  'ks2:religious-education-catholic:first-reconciliation': {
    topicId: 'first-reconciliation',
    title: 'First Reconciliation: God’s Healing Mercy & Forgiveness',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'In the Sacrament of Reconciliation (Penance or Confession), those who confess their sins with true sorrow and a firm purpose of amendment obtain forgiveness from God\'s infinite mercy through the priest\'s absolution, reconciling them with God and the Church (CCC 1422).',
    cognitiveTrap: 'Fearing that Confession is about being judged or scolded, rather than encountering Jesus the Good Shepherd who welcomes and heals us with gentleness and mercy.',
    socraticPivot: 'Why did Jesus breathe on the Apostles and tell them: "Whose sins you forgive are forgiven them" (John 20:23)?',
    hook: 'If you accidentally broke your friend\'s favourite toy, you would say sorry so your friendship could be healed. How does Jesus heal our friendship with God when we make mistakes and sin?',
    guidedStep: 'Follow the 4 steps of a good Confession: 1. Examination of Conscience (reflecting in prayer on our choices), 2. Contrition (true sorrow for hurting God and others), 3. Confession & Penance (honestly telling our sins to the priest and accepting a prayer of reparation), 4. Absolution (hearing God\'s words of forgiveness).',
    scaffoldHints: {
      level1: 'Imagine carrying a heavy backpack full of sharp rocks. Confessing your sins is like setting that heavy pack down and walking away with a clean, peaceful heart.',
      level2: 'Jesus told the parable of the Prodigal Son to show that God our Heavenly Father never stops waiting for us to come home with open arms of mercy.',
      level3: 'During Confession, you pray the Act of Contrition (Sorrow), and the priest raises his hand saying: "I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit."'
    },
    questions: [
      {
        id: 'ks2-re-rec-1',
        prompt: 'What happens when we make a sincere Confession to a Catholic priest in the Sacrament of Reconciliation?',
        options: [
          'God forgives our sins and restores our friendship with Him through the priest\'s absolution',
          'The priest tells our family and school teachers what we said',
          'We receive a punishment and are not allowed back into church',
          'Our mistakes are written down on a parish public board'
        ],
        answerKey: 0,
        hint: 'Jesus heals our soul and the priest is bound by the absolute Seal of Confession.',
        explanation: 'Through the priest acting in persona Christi (in the person of Christ), God freely forgives all our confessed sins and fills our soul with peace and grace.'
      },
      {
        id: 'ks2-re-rec-2',
        prompt: 'What is the traditional prayer called where we tell God we are genuinely sorry for our sins and promise to do better?',
        options: [
          'The Act of Contrition (or Act of Sorrow)',
          'The Nicene Creed',
          'The Gloria in Excelsis',
          'The Angelus'
        ],
        answerKey: 0,
        hint: 'Contrition means heartfelt sorrow for having offended God who is so good.',
        explanation: 'The Act of Contrition is the prayer prayed during Confession expressing sincere sorrow for our sins and resolving to avoid the near occasions of sin.'
      },
      {
        id: 'ks2-re-rec-3',
        prompt: 'What are the sacred words called when the priest grants God\'s forgiveness in the Sacrament of Penance?',
        options: [
          'The Words of Absolution',
          'The Final Blessing',
          'The Offertory Prayer',
          'The Preface Dialogue'
        ],
        answerKey: 0,
        hint: 'To "absolve" means to set free and unbind from sin.',
        explanation: 'The priest speaks the words of Absolution: "...and I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit. Amen."'
      }
    ]
  },

  'ks2:religious-education-catholic:liturgy-of-the-word': {
    topicId: 'liturgy-of-the-word',
    title: 'The Liturgy of the Word: God Speaks in Scripture',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'In the Liturgy of the Word, the first major part of the Holy Mass, God speaks directly to His gathered people through Sacred Scripture, and Christ proclaims His Good News in the Holy Gospel (CCC 1154).',
    cognitiveTrap: 'Thinking the readings at Mass are merely old historical stories, rather than God’s living, inspired Word speaking to our hearts right now in the present.',
    socraticPivot: 'Why do we stand up on our feet and sing "Alleluia" specifically before the priest or deacon reads the Gospel?',
    hook: 'Have you ever received a letter from someone who loves you very much? The Bible is God\'s personal love letter to each of us!',
    guidedStep: 'Trace the order of the Liturgy of the Word: First Reading (often Old Testament prophecies or stories), Responsorial Psalm (singing God\'s praises), Second Reading (New Testament letter from St Paul or Apostles), Gospel Acclamation (Alleluia), The Holy Gospel, Homily, Nicene/Apostles Creed, and Bidding Prayers (Universal Prayer).',
    scaffoldHints: {
      level1: 'When a respected king enters the hall, everyone stands up out of honour. We stand during the Gospel because Jesus Himself is speaking to us through His words and deeds.',
      level2: 'Before the Gospel is read, we trace a small cross with our thumb on our forehead, lips, and heart, praying: "Lord, be in my mind, on my lips, and in my heart."',
      level3: 'At the conclusion of the first and second readings, the reader says: "The Word of the Lord", and the congregation responds with gratitude: "Thanks be to God".'
    },
    questions: [
      {
        id: 'ks2-re-word-1',
        prompt: 'Why does the whole congregation stand up when the Holy Gospel is about to be proclaimed at Mass?',
        options: [
          'To show deep reverence and honour because Jesus Christ Himself is speaking to us',
          'Because the wooden benches are being cleaned',
          'Because the choir wants to see the back of the church',
          'To signal that the Mass is almost finished'
        ],
        answerKey: 0,
        hint: 'Standing is an ancient sign of active attention and reverence for Christ.',
        explanation: 'We stand for the Holy Gospel because it contains the direct words and actions of Jesus Christ, our Lord and Saviour.'
      },
      {
        id: 'ks2-re-word-2',
        prompt: 'What prayerful gesture do we make on our forehead, lips, and chest just before the Gospel is read?',
        options: [
          'We trace three small signs of the cross, asking God\'s word to be in our minds, on our lips, and in our hearts',
          'We bow deeply three times towards the organist',
          'We clap our hands to welcome the deacon',
          'We place both hands over our eyes in silence'
        ],
        answerKey: 0,
        hint: 'Mind, lips, and heart: to understand, speak, and love God\'s Word.',
        explanation: 'Tracing the cross on our forehead, lips, and heart is a prayer asking that the Gospel may guide our thoughts, words, and loving actions.'
      },
      {
        id: 'ks2-re-word-3',
        prompt: 'Which part of the Liturgy of the Word is when the priest or deacon explains the readings and shows how to live them out today?',
        options: [
          'The Homily',
          'The Responsorial Psalm',
          'The Collect Prayer',
          'The Sign of Peace'
        ],
        answerKey: 0,
        hint: 'The priest preaches this from the ambo/pulpit after the Gospel.',
        explanation: 'In the Homily, the priest breaks open God\'s Word and helps us understand how to apply Jesus\' teachings in our school, home, and daily life.'
      }
    ]
  },

  'ks2:religious-education-catholic:the-last-supper': {
    topicId: 'the-last-supper',
    title: 'The Last Supper: "Do This in Memory of Me"',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'At the Last Supper on Holy Thursday, Jesus instituted the Eucharistic Sacrifice of His Body and Blood. Taking bread and wine, He blessed them, broke them, gave them to His Apostles, and commanded: "Do this in memory of me" (Luke 22:19, CCC 1323).',
    cognitiveTrap: 'Confusing the Last Supper with an ordinary farewell dinner, or thinking "in memory of me" means just remembering a past memory rather than making Christ\'s living sacrifice present on the altar.',
    socraticPivot: 'What did Jesus mean when He took the bread and solemnly said: "Take, eat; this is my body"?',
    hook: 'On the night before He laid down His life on the Cross, Jesus sat down for a Passover meal with His twelve Apostles. What everlasting gift did He leave for the whole world that evening?',
    guidedStep: 'Examine Holy Thursday: Jesus first washed the feet of His Apostles to teach humble servant love. Then, He took bread, gave thanks, broke it, and gave it to His disciples, saying: "This is my body, which is given for you." Then He took the chalice of wine, saying: "This chalice is the new covenant in my blood."' ,
    scaffoldHints: {
      level1: 'Jesus did not say "this is like my body" or "this represents my body." He declared: "This IS my body."',
      level2: 'When Jesus commanded "Do this in memory of me", He gave the Apostles and their successors (bishops and priests) the sacred authority to celebrate the Holy Mass.',
      level3: 'At every Mass, we are spiritually united with Jesus at the Last Supper and at the foot of the Cross on Calvary. His one saving sacrifice is made present for us today.'
    },
    questions: [
      {
        id: 'ks2-re-ls-1',
        prompt: 'On which night of Holy Week did Jesus celebrate the Last Supper and institute the Holy Eucharist?',
        options: [
          'Holy Thursday (Maundy Thursday)',
          'Easter Sunday morning',
          'Palm Sunday afternoon',
          'Ash Wednesday'
        ],
        answerKey: 0,
        hint: 'It is the night before Good Friday, when Jesus washed His disciples\' feet.',
        explanation: 'On Holy Thursday evening, at the Last Supper, Jesus gave us the Sacrament of the Holy Eucharist and the Catholic Priesthood.'
      },
      {
        id: 'ks2-re-ls-2',
        prompt: 'What command did Jesus give to His Apostles after giving them His Body and Blood under the signs of bread and wine?',
        options: [
          '"Do this in memory of me"',
          '"Keep this a secret forever"',
          '"Build a golden palace in Jerusalem"',
          '"Never eat unleavened bread again"'
        ],
        answerKey: 0,
        hint: 'This command is repeated at every Holy Mass by the priest.',
        explanation: 'Jesus commanded "Do this in memory of me" (Luke 22:19), charging the Church to perpetually celebrate the Holy Sacrifice of the Mass until He comes again.'
      },
      {
        id: 'ks2-re-ls-3',
        prompt: 'What humble act of service did Jesus perform before the Last Supper to show how His followers must love one another?',
        options: [
          'He washed the feet of His twelve Apostles',
          'He gave them bags of gold coins',
          'He built a wooden boat for them',
          'He carved stone tablets with their names'
        ],
        answerKey: 0,
        hint: 'A servant\'s chore in ancient times that Jesus performed to teach humility.',
        explanation: 'By washing the feet of the Apostles (John 13:1-15), Jesus showed that true greatness in the Kingdom of God comes through humble service to others.'
      }
    ]
  },

  'ks2:religious-education-catholic:first-holy-communion': {
    topicId: 'first-holy-communion',
    title: 'The Sacrament of the Eucharist: The Real Presence',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'Through the consecration at Mass, the whole substance of the bread is changed into the Body of Christ, and the whole substance of the wine into His Blood. The Catholic Church names this miracle Transubstantiation. Jesus Christ is truly, really, and substantially present: Body, Blood, Soul, and Divinity (CCC 1374, 1376).',
    cognitiveTrap: 'Believing the consecrated Host is merely a symbol, a metaphor, or just a wafer of bread representing Jesus, rather than Jesus Himself truly present.',
    socraticPivot: 'Although the consecrated Host still looks, smells, and tastes like bread to our eyes, what has it truly become in its deepest reality through the Holy Spirit?',
    hook: 'Imagine preparing your heart to welcome the most holy, loving Guest in the entire universe. In First Holy Communion, who is it that comes to live inside you?',
    guidedStep: 'Understand the Eucharistic mystery: During the Eucharistic Prayer, the priest calls upon the Holy Spirit (epiclesis) and repeats the words of Jesus (consecration). While outward appearances (accidents: color, taste, size) remain unchanged, the inward reality (substance) is transformed into Jesus Christ.',
    scaffoldHints: {
      level1: 'Our human eyes only see bread and wine, but through the eyes of Catholic faith, we know that Jesus keeps His promise: He gives us His true Flesh and Blood for eternal life.',
      level2: 'The Church uses the word "Transubstantiation" (trans = change, substantia = substance): the bread and wine become the Body, Blood, Soul, and Divinity of Christ.',
      level3: 'Because Jesus is really present, the consecrated Hosts are reverently kept in the Tabernacle. We genuflect on our right knee towards the Tabernacle when entering church.'
    },
    questions: [
      {
        id: 'ks2-re-fhc-1',
        prompt: 'What does the Catholic Church teach about what the bread and wine truly become during the consecration at Mass?',
        options: [
          'They truly become the Body, Blood, Soul, and Divinity of Jesus Christ',
          'They remain ordinary bread and wine but blessed with perfume',
          'They are just holy snacks to keep us awake during the service',
          'They turn into physical gold and silver treasures'
        ],
        answerKey: 0,
        hint: 'The Catholic Church teaches the doctrine of the Real Presence of Jesus.',
        explanation: 'Through the power of the Holy Spirit and the words of Christ, the consecrated Host is not a mere symbol; it is the Real Presence of Jesus Christ.'
      },
      {
        id: 'ks2-re-fhc-2',
        prompt: 'What is the sacred theological term for the miraculous change of the substance of bread and wine into Christ\'s Body and Blood?',
        options: [
          'Transubstantiation',
          'Reincarnation',
          'Photosynthesis',
          'Electrolysis'
        ],
        answerKey: 0,
        hint: 'Trans- (change) + substance: the underlying reality changes completely.',
        explanation: 'Transubstantiation is the dogma defined by the Catholic Church: the substance changes into Christ while the physical appearances (species) remain.'
      },
      {
        id: 'ks2-re-fhc-3',
        prompt: 'Why is there always a red sanctuary lamp burning next to the Tabernacle inside a Catholic church?',
        options: [
          'To show that Jesus in the Blessed Sacrament is present inside the Tabernacle',
          'To help the priest see the keys in the dark',
          'Because red is the national colour of the city council',
          'To warn people that the candles are hot'
        ],
        answerKey: 0,
        hint: 'The red flame shows that the King of Kings is in the house!',
        explanation: 'The sanctuary lamp burns day and night to indicate and honour the Real Presence of Christ reserved in the Holy Tabernacle.'
      }
    ]
  },

  'ks2:religious-education-catholic:order-of-the-mass': {
    topicId: 'order-of-the-mass',
    title: 'The Order of the Mass & Reverent Reception',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'To receive Holy Communion worthily, a Catholic must be in the state of grace (free from grave sin), observe the Eucharistic fast of at least one hour from food and drink, and receive the Blessed Sacrament with deep faith and devotion, responding "Amen" ("I believe!") (CCC 1385, 1387).',
    cognitiveTrap: 'Receiving Holy Communion casually or carelessly without preparation, or saying "Thank you" instead of the solemn profession of faith: "Amen".',
    socraticPivot: 'When the priest or minister holds up the Sacred Host and says "The Body of Christ", why is our response "Amen" so important?',
    hook: 'If you were invited to a royal banquet with the King, how would you prepare your manners, clothes, and heart? The Holy Mass is the heavenly banquet of Christ our King!',
    guidedStep: 'Practice receiving Holy Communion reverently: Fast for 1 hour before receiving. Approach the altar with hands joined in prayer. Bow your head in reverence. When the priest says "The Body of Christ", clearly answer "Amen". You may receive on the tongue or in the hand (placing the left hand flat on top of the right hand to create a "throne"). Consume the Host immediately, make the Sign of the Cross, and return to kneel in thanksgiving.',
    scaffoldHints: {
      level1: '"Amen" is a Hebrew word that means: "Yes, it is true! I believe with all my heart!"',
      level2: 'Before receiving, we pray the words of the Roman Centurion: "Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed."',
      level3: 'After receiving Holy Communion, return quietly to your pew, kneel down, close your eyes, and talk with Jesus in silent prayer, thanking Him for coming into your heart.'
    },
    questions: [
      {
        id: 'ks2-re-ord-1',
        prompt: 'What is the correct and reverent response when the priest holds up the Host and says "The Body of Christ"?',
        options: [
          '"Amen" (meaning "I believe!")',
          '"Thank you very much"',
          '"Peace be with you"',
          '"Good morning Father"'
        ],
        answerKey: 0,
        hint: '"Amen" is your solemn declaration that you believe this is truly Jesus.',
        explanation: 'By answering "Amen", we express our personal faith that we are receiving Jesus Christ Himself, our Lord and God.'
      },
      {
        id: 'ks2-re-ord-2',
        prompt: 'How long must Catholics observe the Eucharistic fast from food and drink (except water and medicine) before receiving Holy Communion?',
        options: [
          'At least one hour before receiving',
          'Twenty-four full hours',
          'Five minutes while walking to church',
          'Only during the homily'
        ],
        answerKey: 0,
        hint: 'One hour of fasting helps our body and mind prepare for the heavenly food.',
        explanation: 'Canon law and the Catechism (CCC 1387) prescribe a fast of at least one hour from food and drink (except water and medicine) to honour the Blessed Sacrament.'
      },
      {
        id: 'ks2-re-ord-3',
        prompt: 'If receiving Holy Communion in your hands, how should your hands be held according to ancient Catholic tradition?',
        options: [
          'Open flat, with your dominant hand supporting underneath the other to make a "throne" for the King',
          'Cupped like a drinking bowl with fingers spread wide',
          'Grabbed with two fingers like a snack crisp',
          'Holding a prayer book at the same time'
        ],
        answerKey: 0,
        hint: 'St Cyril of Jerusalem taught: "Make your left hand a throne for your right, as about to receive a King."',
        explanation: 'We place one hand flat over the other to form a reverent throne for the Host, taking care that no sacred particle falls, and consume it immediately.'
      },
      {
        id: 'ks2-re-ord-4',
        prompt: 'What should you do immediately after returning to your seat after receiving Holy Communion?',
        options: [
          'Kneel down in quiet, loving prayer to thank Jesus for coming into your heart',
          'Check your watch and leave the church immediately',
          'Chat with your neighbours about after-Mass plans',
          'Wave to your friends in the choir'
        ],
        answerKey: 0,
        hint: 'This is the most sacred time of intimate prayer and thanksgiving with Jesus.',
        explanation: 'The time right after Holy Communion is precious. We kneel in silence to thank Jesus, offer Him our prayers, and ask Him to help us live like Him.'
      }
    ]
  },

  // ==========================================
  // KEY STAGE 3 (Ages 11-14 / Lower Secondary)
  // ==========================================

  // --- KS3 Science ---
  'ks3:science:atomic-structure': {
    topicId: 'atomic-structure',
    title: 'Atomic Structure & Periodic Table',
    keyStage: 'Key Stage 3',
    subject: 'Science',
    coreAxiom: 'Atoms consist of a dense central nucleus containing protons (charge +1, mass 1) and neutrons (charge 0, mass 1), surrounded by electrons (charge -1, mass ~1/1840) in energy shells.',
    cognitiveTrap: 'Assuming an atom is a solid sphere or that electrons carry most of the atom\'s mass.',
    socraticPivot: 'Where is 99.9% of an atom\'s mass concentrated, and why is most of an atom empty space?',
    hook: 'If the nucleus of an atom were the size of a marble in the center of a football stadium, where would the electrons be?',
    guidedStep: 'Calculate subatomic particles: Atomic number = number of protons. Mass number = protons + neutrons. In neutral atom, electrons = protons.',
    scaffoldHints: {
      level1: 'The nucleus is the heavy bowling ball in the middle. The electrons are tiny gnats buzzing in the distant stands.',
      level2: 'Protons: +1 (mass 1). Neutrons: 0 (mass 1). Electrons: -1 (negligible mass). Number of protons defines which element it is.',
      level3: 'For Carbon-12: Atomic number = 6 (6 protons, 6 electrons). Mass number = 12 (12 - 6 = 6 neutrons).'
    },
    questions: [
      {
        id: 'ks3-sci-atom-1',
        prompt: 'Which subatomic particle has a relative charge of -1 and negligible mass orbiting the nucleus?',
        options: ['Electron', 'Proton', 'Neutron', 'Positron'],
        answerKey: 0,
        hint: 'It orbits in outer energy levels/shells and carries a negative charge.',
        explanation: 'Electrons carry a negative charge (-1) and orbit the nucleus in electron shells with negligible mass (~1/1840 of a proton).'
      },
      {
        id: 'ks3-sci-atom-2',
        prompt: 'An atom has 11 protons, 12 neutrons, and 11 electrons. What is its MASS NUMBER?',
        options: ['23', '11', '12', '34'],
        answerKey: 0,
        hint: 'Mass number = Protons + Neutrons.',
        explanation: 'Mass number is the total number of protons and neutrons in the nucleus: 11 + 12 = 23 (Sodium).'
      }
    ]
  },

  'ks3:science:cell-biology': {
    topicId: 'cell-biology',
    title: 'Cell Biology & Microscopy',
    keyStage: 'Key Stage 3',
    subject: 'Science',
    coreAxiom: 'Cells are the fundamental building blocks of all living organisms. Plant cells contain a cell wall, chloroplasts, and permanent vacuole, which animal cells lack.',
    cognitiveTrap: 'Confusing cell membrane (controls what enters/exits) with cell wall (provides rigid structural support).',
    socraticPivot: 'Why can animal cells change shape and move flexibly, while plant cells remain rigid like wooden blocks?',
    hook: 'Why do plants stand upright without having a bony skeleton like humans?',
    guidedStep: 'Distinguish shared organelles (nucleus, cytoplasm, cell membrane, mitochondria, ribosomes) from plant-only organelles (cellulose cell wall, permanent vacuole, chloroplasts).',
    scaffoldHints: {
      level1: 'Plant cells have a cardboard box around them (cell wall) and mini solar panels (chloroplasts) to make food from light.',
      level2: 'Both plant and animal cells have: nucleus (controls cell), cytoplasm (chemical reactions occur), cell membrane (gatekeeper), mitochondria (respiration).',
      level3: 'Plant cells uniquely have: cellulose cell wall (strength/turgor), permanent vacuole (cell sap), and chloroplasts (chlorophyll for photosynthesis).'
    },
    questions: [
      {
        id: 'ks3-sci-cell-1',
        prompt: 'Which organelle is found in plant cells to absorb light for photosynthesis, but is NEVER found in animal cells?',
        options: ['Chloroplast', 'Mitochondria', 'Nucleus', 'Cell membrane'],
        answerKey: 0,
        hint: 'Contains green chlorophyll to trap sunlight.',
        explanation: 'Chloroplasts contain green chlorophyll which absorbs sunlight for photosynthesis; animal cells do not photosynthesize.'
      },
      {
        id: 'ks3-sci-cell-2',
        prompt: 'What is the function of the cell membrane in both plant and animal cells?',
        options: [
          'It regulates what substances enter and leave the cell',
          'It provides rigid structural support to keep the plant upright',
          'It stores the genetic DNA in the center',
          'It produces food using sunlight'
        ],
        answerKey: 0,
        hint: 'It acts like a security guard or semi-permeable boundary.',
        explanation: 'The cell membrane is a selectively permeable barrier controlling the movement of substances into and out of the cell.'
      }
    ]
  },

  // --- KS3 Mathematics ---
  'ks3:maths:linear-equations': {
    topicId: 'linear-equations',
    title: 'Linear Equations',
    keyStage: 'Key Stage 3',
    subject: 'Mathematics',
    coreAxiom: 'An algebraic equation is balanced like scales; whatever operation is applied to one side must be applied equally to the other side to isolate the unknown variable.',
    cognitiveTrap: 'Moving numbers across the equals sign without reversing their operation (e.g. changing +5 to +5 instead of -5).',
    socraticPivot: 'If 3x + 7 = 22, what inverse operations must you perform to leave x completely on its own?',
    hook: 'Think of an old-fashioned balance scale: if you take 5 grams off the left side, what happens unless you take 5 grams off the right side?',
    guidedStep: 'Isolate the variable by applying inverse operations in reverse BIDMAS order (undo addition/subtraction first, then multiplication/division).',
    scaffoldHints: {
      level1: 'Equation = balance scale. To isolate x, peel away surrounding numbers by doing the exact opposite operation to both sides.',
      level2: 'Inverse pairs: + pairs with - ; × pairs with ÷. If 2x + 4 = 16: subtract 4 from both sides (2x = 12), then divide by 2 (x = 6).',
      level3: 'Always check your answer: substitute x = 6 back into original equation: 2(6) + 4 = 12 + 4 = 16. Correct!'
    },
    questions: [
      {
        id: 'ks3-mat-eq-1',
        prompt: 'Solve for x: 4x + 7 = 31',
        options: ['x = 6', 'x = 8', 'x = 5', 'x = 9.5'],
        answerKey: 0,
        hint: 'Step 1: Subtract 7 from both sides. Step 2: Divide both sides by 4.',
        explanation: '4x + 7 = 31 -> 4x = 31 - 7 = 24 -> x = 24 / 4 = 6.'
      },
      {
        id: 'ks3-mat-eq-2',
        prompt: 'Solve for y: 2(y - 3) = 14',
        options: ['y = 10', 'y = 4', 'y = 7', 'y = 8.5'],
        answerKey: 0,
        hint: 'Divide both sides by 2 first: y - 3 = 7, then add 3.',
        explanation: 'Divide both sides by 2: y - 3 = 7. Add 3 to both sides: y = 10. (Alternatively expand: 2y - 6 = 14 -> 2y = 20 -> y = 10).'
      }
    ]
  },

  'ks3:maths:pythagoras-theorem': {
    topicId: 'pythagoras-theorem',
    title: 'Pythagoras Theorem',
    keyStage: 'Key Stage 3',
    subject: 'Mathematics',
    coreAxiom: 'In any right-angled triangle, the area of the square on the hypotenuse (longest side opposite the right angle) equals the sum of the areas of the squares on the other two sides: a² + b² = c².',
    cognitiveTrap: 'Applying Pythagoras theorem to non-right-angled triangles, or forgetting to take the square root at the final step.',
    socraticPivot: 'Why must you always identify the hypotenuse first before substituting numbers into a² + b² = c²?',
    hook: 'If you walk 3 miles North and then 4 miles East, how far are you from where you started in a direct straight line?',
    guidedStep: '1. Identify right angle and hypotenuse c. 2. Calculate a² and b². 3. Add to find c². 4. Square root to find c.',
    scaffoldHints: {
      level1: 'The hypotenuse is always the longest side, directly opposite the 90-degree right angle.',
      level2: 'Formula: a² + b² = c². If legs are 3 and 4: 3² = 9, 4² = 16. 9 + 16 = 25. c = √25 = 5.',
      level3: 'If finding a shorter leg a: rearrange to a² = c² - b². Always subtract from the hypotenuse squared!'
    },
    questions: [
      {
        id: 'ks3-mat-pyth-1',
        prompt: 'In a right-angled triangle, the two shorter sides are 6 cm and 8 cm. What is the length of the hypotenuse?',
        options: ['10 cm', '14 cm', '100 cm', '12 cm'],
        answerKey: 0,
        hint: '6² + 8² = 36 + 64 = 100. Now take the square root of 100.',
        explanation: 'a² + b² = c² -> 6² + 8² = 36 + 64 = 100 -> c = √100 = 10 cm.'
      }
    ]
  },

  // --- KS2 Modern Foreign Languages (Spanish) ---
  'ks2:spanish:greetings-introductions': {
    topicId: 'greetings-introductions',
    title: 'Spanish Greetings & Introductions',
    keyStage: 'Key Stage 2',
    subject: 'Spanish',
    coreAxiom: 'In Spanish, greeting conventions and question forms change depending on formality and time of day (Buenos días, Buenas tardes, Buenas noches). Inverted punctuation (¿?) is used at the beginning of question clauses.',
    cognitiveTrap: 'Using "Buenos días" in the evening or forgetting that Spanish adjectives and gender agreements reflect the speaker or noun.',
    socraticPivot: 'How does Spanish signal that a sentence is a question before you even finish reading it?',
    hook: 'If you arrive in Madrid at 8:00 PM, which greeting should you use to say hello politely?',
    guidedStep: 'Practice matching time of day with the correct greeting (días = morning, tardes = afternoon, noches = evening/night).',
    scaffoldHints: {
      level1: 'Días is like daytime/morning. Tardes is afternoon. Noches is night.',
      level2: 'Buenos días (until midday); Buenas tardes (afternoon until sunset); Buenas noches (evening/night).',
      level3: 'Notice how "días" is masculine (buenos), while "tardes" and "noches" are feminine (buenas).'
    },
    questions: [
      {
        id: 'ks2-spa-greet-1',
        prompt: '¿Cómo se dice "Good afternoon" en español?',
        options: ['Buenas tardes', 'Buenos días', 'Buenas noches', 'Hasta luego'],
        answerKey: 0,
        hint: 'Used between lunch and the evening sunset.',
        explanation: '"Buenas tardes" is used in the afternoon. "Buenos días" is morning and "Buenas noches" is evening/night.'
      },
      {
        id: 'ks2-spa-greet-2',
        prompt: 'Which phrase means "My name is" when introducing yourself in Spanish?',
        options: ['Me llamo', '¿Cómo te llamas?', 'Mucho gusto', 'Por favor'],
        answerKey: 0,
        hint: 'Literally means "I call myself".',
        explanation: '"Me llamo" followed by your name translates to "My name is" (literally "I call myself").'
      }
    ]
  },

  // --- KS3 Modern Foreign Languages (Spanish) ---
  'ks3:spanish:present-tense-regular-verbs': {
    topicId: 'present-tense-regular-verbs',
    title: 'Spanish Present Tense: Regular Verbs (-ar, -er, -ir)',
    keyStage: 'Key Stage 3',
    subject: 'Spanish',
    coreAxiom: 'Spanish verbs are grouped into three conjugation paradigms (-ar, -er, -ir). To conjugate in the present tense, remove the infinitive ending and append person-specific endings (e.g., -o, -as/-es, -a/-e, -amos/-emos/-imos, -áis/-éis/-ís, -an/-en). Subject pronouns (yo, tú) are frequently omitted because the verb ending indicates the subject.',
    cognitiveTrap: 'Always writing subject pronouns (e.g., "Yo hablo" every time) or applying -ar verb endings to -er/-ir verbs (e.g., writing "yo comas" instead of "tú comes").',
    socraticPivot: 'Why is "Hablo español" completely understood without needing to say "Yo"?',
    hook: 'Why do Spanish verbs look like secret codes that tell you WHO is doing the action in just the last two letters?',
    guidedStep: '1. Identify the stem (habl-). 2. Check the verb ending class (-ar). 3. Append the correct personal ending (-o, -as, -a, -amos, -áis, -an).',
    scaffoldHints: {
      level1: 'The ending changes depending on who does it: -o is always "I" (yo).',
      level2: 'For -ar verbs (hablar): hablo (I speak), hablas (you speak), habla (he/she speaks), hablamos (we speak), hablan (they speak).',
      level3: 'For -er (comer): como, comes, come, comemos, coméis, comen. For -ir (vivir): vivo, vives, vive, vivimos, vivís, viven.'
    },
    questions: [
      {
        id: 'ks3-spa-verb-1',
        prompt: 'Which is the correct form of the verb "hablar" for "We speak" (nosotros)?',
        options: ['Hablamos', 'Hablan', 'Hablas', 'Hablo'],
        answerKey: 0,
        hint: '-amos is the first-person plural ending for regular -ar verbs.',
        explanation: 'For regular -ar verbs, the "nosotros" (we) ending is -amos: hablar -> nosotros hablamos.'
      },
      {
        id: 'ks3-spa-verb-2',
        prompt: 'How do you say "They eat" using the regular verb "comer"?',
        options: ['Comen', 'Comemos', 'Comes', 'Coman'],
        answerKey: 0,
        hint: 'For -er verbs, the third-person plural ("ellos/ellas") ending is -en.',
        explanation: 'For regular -er verbs in the present indicative, the "ellos/ellas" ending is -en: comer -> comen.'
      }
    ]
  },

  // ==========================================
  // KEY STAGE 4 (GCSE / Ages 14-16)
  // ==========================================

  // --- KS4 Physics ---
  'ks4:physics:newtonian-mechanics': {
    topicId: 'newtonian-mechanics',
    title: 'Newtonian Mechanics & Force',
    keyStage: 'Key Stage 4 (GCSE)',
    subject: 'Physics',
    coreAxiom: 'Newton\'s 1st Law: An object remains at rest or constant velocity unless acted upon by a resultant force. Newton\'s 2nd Law: Resultant Force = mass × acceleration (F = ma). Newton\'s 3rd Law: Forces always occur in equal and opposite interaction pairs.',
    cognitiveTrap: 'Believing that a continuous forward force is required to keep an object moving at a constant speed.',
    socraticPivot: 'When Voyager 1 flies through deep interstellar space where there is zero friction, why does it travel at 38,000 mph forever without its engines running?',
    hook: 'Why does an astronaut floating outside the International Space Station drift backwards when they throw a heavy wrench forward?',
    guidedStep: 'Draw free-body diagrams, calculate resultant force, and apply F = ma with SI units (N, kg, m/s²).',
    scaffoldHints: {
      level1: 'Aristotle thought you need a push to keep moving. Newton proved that without friction, things keep moving forever on their own!',
      level2: 'Resultant force is what causes ACCELERATION (changing speed or direction). Zero resultant force = steady speed or stationary.',
      level3: 'F = ma: A 1200 kg car accelerating at 2 m/s² requires a resultant forward force of F = 1200 × 2 = 2400 N.'
    },
    questions: [
      {
        id: 'ks4-phy-newton-1',
        prompt: 'A skydiver is falling through the air at terminal velocity (constant speed of 55 m/s). What is the RESULTANT FORCE acting on the skydiver?',
        options: ['0 N (Zero Newtons)', '55 N downwards', 'Equal to the skydiver\'s weight', 'Equal to the air resistance multiplied by speed'],
        answerKey: 0,
        hint: 'Constant velocity means zero acceleration. By F = ma, if a = 0, what is F?',
        explanation: 'At terminal velocity, downward weight is exactly balanced by upward air resistance. Resultant force is 0 N, so acceleration is zero.'
      },
      {
        id: 'ks4-phy-newton-2',
        prompt: 'A resultant force of 60 N acts on a mass of 12 kg. What is the acceleration produced?',
        options: ['5 m/s²', '720 m/s²', '0.2 m/s²', '48 m/s²'],
        answerKey: 0,
        hint: 'Rearrange F = ma to find a: a = F / m.',
        explanation: 'a = F / m = 60 N / 12 kg = 5 m/s².'
      }
    ]
  },

  // --- KS4 Chemistry ---
  'ks4:chemistry:balancing-equations': {
    topicId: 'balancing-equations',
    title: 'Balancing Chemical Equations',
    keyStage: 'Key Stage 4 (GCSE)',
    subject: 'Chemistry',
    coreAxiom: 'Law of Conservation of Mass: Atoms cannot be created or destroyed in a chemical reaction. The number of atoms of each element in the reactants must equal the number in the products; only stoichiometric coefficients (large numbers in front) may be changed.',
    cognitiveTrap: 'Changing the small subscript numbers inside chemical formulas (e.g. changing H₂O to H₂O₂ to balance oxygen).',
    socraticPivot: 'Why does changing a subscript alter the chemical substance itself, whereas changing a coefficient merely changes the number of molecules?',
    hook: 'If you burn 100 grams of wood in a sealed glass box, how much do the ashes, smoke, and gases weigh combined?',
    guidedStep: 'Tally atoms of each element on reactant and product sides; balance metals first, non-metals next, then hydrogen and oxygen last.',
    scaffoldHints: {
      level1: 'Think of balancing chemical equations like balancing a recipe: 2 slices of bread + 1 slice of cheese = 1 sandwich.',
      level2: 'Never change subscripts! H₂O is water you drink; H₂O₂ is toxic hydrogen peroxide bleach. Only change the big multiplier numbers in front.',
      level3: 'Balancing: H₂ + O₂ -> H₂O. Left has 2 O, right has 1 O. Put 2 in front: H₂ + O₂ -> 2H₂O. Now right has 4 H. Balance left: 2H₂ + O₂ -> 2H₂O.'
    },
    questions: [
      {
        id: 'ks4-chem-bal-1',
        prompt: 'Which set of coefficients correctly balances: ___ Fe + ___ O₂ -> ___ Fe₂O₃ ?',
        options: ['4 Fe + 3 O₂ -> 2 Fe₂O₃', '2 Fe + 3 O₂ -> 1 Fe₂O₃', '4 Fe + 2 O₂ -> 2 Fe₂O₃', '1 Fe + 1 O₂ -> 1 Fe₂O₃'],
        answerKey: 0,
        hint: 'Right side has 2 Fe and 3 O in each Fe₂O₃. To balance odd and even oxygens, target 6 oxygens.',
        explanation: '4 Fe + 3 O₂ -> 2 Fe₂O₃ gives 4 Iron atoms and 6 Oxygen atoms on both reactant and product sides.'
      }
    ]
  },

  // --- KS4 Biology ---
  'ks4:biology:photosynthesis-transport': {
    topicId: 'photosynthesis-transport',
    title: 'Photosynthesis & Plant Transport',
    keyStage: 'Key Stage 4 (GCSE)',
    subject: 'Biology',
    coreAxiom: 'Photosynthesis is an endothermic reaction where light energy converts carbon dioxide and water into glucose and oxygen: 6CO₂ + 6H₂O -> C₆H₁₂O₆ + 6O₂. Water travels up through xylem; sugars travel bidirectionally through phloem.',
    cognitiveTrap: 'Believing plants only photosynthesize and never respire, or that photosynthesis happens at night.',
    socraticPivot: 'Do plants respire at night when there is no sunlight, and what gas do they take in during the dark?',
    hook: 'Where does the actual solid physical mass of a giant 50-ton oak tree come from: the soil or the air?',
    guidedStep: 'Analyze limiting factors (light intensity, CO₂ concentration, temperature) and contrast xylem (transpiration) with phloem (translocation).',
    scaffoldHints: {
      level1: 'A tree builds its wood out of thin air! It traps invisible carbon dioxide gas and stitches it into glucose wood.',
      level2: 'Equation: Carbon dioxide + Water (with light and chlorophyll) -> Glucose + Oxygen. It is endothermic (absorbs energy).',
      level3: 'Xylem transports water and mineral ions upwards from roots (dead hollow tubes). Phloem transports sucrose and amino acids up and down (living cells).'
    },
    questions: [
      {
        id: 'ks4-bio-photo-1',
        prompt: 'What are the two products formed during plant photosynthesis?',
        options: ['Glucose and Oxygen', 'Carbon dioxide and Water', 'Lactic acid and Energy', 'Starch and Carbon monoxide'],
        answerKey: 0,
        hint: 'Plants produce sugar for energy and release the gas we breathe.',
        explanation: 'Photosynthesis converts carbon dioxide and water into glucose (sugar) and oxygen gas.'
      },
      {
        id: 'ks4-bio-photo-2',
        prompt: 'Which tissue in vascular plants is responsible for transporting dissolved sugars (sucrose) from leaves to roots and storage organs?',
        options: ['Phloem', 'Xylem', 'Stomata', 'Epidermis'],
        answerKey: 0,
        hint: 'Phloem flows food (ph sounds like f). Xylem carries water.',
        explanation: 'Phloem transports dissolved sugars and amino acids throughout the plant via translocation.'
      }
    ]
  }
};

/**
 * Normalizes stage, subject, and topic strings to match knowledge base keys.
 */
export function findCurriculumKnowledge(
  stage: string,
  subject: string,
  topic: string
): CurriculumTopicKnowledge | null {
  // 0. Check locally installed custom curriculum packs (overseas/school syllabi)
  const customKnowledge = findCustomTopicKnowledge(stage, subject, topic);
  if (customKnowledge) {
    return customKnowledge;
  }

  const norm = (s: string) =>
    (s || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const normStage = norm(stage);
  const normSubject = norm(subject);
  const normTopic = norm(topic);

  const combinedKnowledgeBase: Record<string, CurriculumTopicKnowledge> = {
    ...CURRICULUM_KNOWLEDGE_BASE,
    ...CURRICULUM_EXPANSION_BASE,
  };

  // 1. Direct key match (e.g. "ks2:science:states-of-matter")
  for (const [key, val] of Object.entries(combinedKnowledgeBase)) {
    const [kStage, kSub, kTop] = key.split(':');
    const stageMatch = normStage.includes(kStage) || (kStage === 'ks1' && normStage.includes('1')) || (kStage === 'ks2' && normStage.includes('2')) || (kStage === 'ks3' && normStage.includes('3')) || (kStage === 'ks4' && (normStage.includes('4') || normStage.includes('gcse')));
    const subjectMatch = normSubject.includes(kSub) || kSub.includes(normSubject) || (kSub === 'maths' && normSubject.includes('mat')) || (kSub === 'science' && (normSubject.includes('sci') || normSubject.includes('phys') || normSubject.includes('chem') || normSubject.includes('bio'))) || (kSub === 'history' && normSubject.includes('hist')) || (kSub === 'geography' && normSubject.includes('geo')) || (kSub === 'english' && normSubject.includes('eng')) || (kSub === 'computing' && normSubject.includes('comp')) || (kSub === 'mfl' && (normSubject.includes('mfl') || normSubject.includes('lang') || normSubject.includes('french') || normSubject.includes('spanish') || normSubject.includes('latin')));
    const topicMatch = normTopic.includes(kTop) || kTop.includes(normTopic) || norm(val.title).includes(normTopic) || normTopic.includes(norm(val.title));

    if (stageMatch && subjectMatch && topicMatch) {
      return val;
    }
  }

  // 2. Fuzzy topic match across knowledge base if exact stage/subject slightly differs
  for (const val of Object.values(combinedKnowledgeBase)) {
    const valTitleNorm = norm(val.title);
    if (valTitleNorm.includes(normTopic) || normTopic.includes(valTitleNorm) || val.topicId === normTopic) {
      return val;
    }
  }

  // 3. Fallback to first topic in matching subject/stage if available
  for (const [key, val] of Object.entries(combinedKnowledgeBase)) {
    const [kStage, kSub] = key.split(':');
    const stageMatch = normStage.includes(kStage) || (kStage === 'ks1' && normStage.includes('1')) || (kStage === 'ks2' && normStage.includes('2')) || (kStage === 'ks3' && normStage.includes('3')) || (kStage === 'ks4' && (normStage.includes('4') || normStage.includes('gcse')));
    const subjectMatch = normSubject.includes(kSub) || kSub.includes(normSubject);
    if (stageMatch && subjectMatch) {
      return val;
    }
  }

  return null;
}
