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
import { CURRICULUM_COMPLETE_BASE } from './curriculumKnowledgeComplete';

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
      },
      {
        id: 'ks1-sci-season-3',
        prompt: 'Why do we have more daylight hours to play outside in Summer compared to Winter?',
        options: [
          'In Summer, the UK is tilted towards the Sun, giving us longer days',
          'The Sun moves much faster across the sky in Summer',
          'Clouds block the Sun completely for the entire Winter',
          'Street lamps make the sky look brighter earlier'
        ],
        answerKey: 0,
        hint: 'The tilt of Earth means we face the Sun for more hours each day in summer.',
        explanation: 'During summer in the UK, the Northern Hemisphere is tilted towards the Sun, which makes the Sun rise earlier and set later.'
      },
      {
        id: 'ks1-sci-season-4',
        prompt: 'What exciting signs of new life do we see during Spring?',
        options: [
          'Flowers begin to bud, birds build nests, and baby animals are born',
          'Snow covers all fields and trees lose all their leaves',
          'The weather turns freezing cold and days become very short',
          'All plants stop growing and dry up'
        ],
        answerKey: 0,
        hint: 'Spring is the season between Winter and Summer when the weather gets warmer.',
        explanation: 'In Spring, temperatures rise, daylight increases, seeds germinate, and animals give birth.'
      },
      {
        id: 'ks1-sci-season-5',
        prompt: 'What is special about an evergreen tree (like a pine or fir tree) in Winter?',
        options: [
          'It keeps its green needle-leaves all year round',
          'It sheds all its branches into the mud',
          'It turns bright purple and stops breathing',
          'It melts completely when snow falls'
        ],
        answerKey: 0,
        hint: 'The name "ever-green" gives you a big clue!',
        explanation: 'Evergreen trees have tough, waxy needles that do not fall off in Autumn, staying green throughout Winter.'
      },
      {
        id: 'ks1-sci-season-6',
        prompt: 'Which weather tool can a young scientist use to measure how much rain falls in one day?',
        options: ['A rain gauge', 'A thermometer', 'A wind vane', 'A measuring tape'],
        answerKey: 0,
        hint: 'A container that catches and measures rainwater in millimetres.',
        explanation: 'A rain gauge collects rainwater with marked measurements to show how much rain fell over a period of time.'
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
      },
      {
        id: 'ks1-sci-anim-3',
        prompt: 'Which animal is a carnivore that hunts other animals for meat?',
        options: ['A lion', 'A sheep', 'A rabbit', 'A dairy cow'],
        answerKey: 0,
        hint: 'Think of an animal that has sharp teeth for eating meat, not flat teeth for chewing grass.',
        explanation: 'Lions are carnivores because their diet consists almost entirely of other animals (meat).'
      },
      {
        id: 'ks1-sci-anim-4',
        prompt: 'What do we call animals like humans and bears that eat BOTH plants and meat?',
        options: ['Omnivores', 'Carnivores', 'Herbivores', 'Vegetarians'],
        answerKey: 0,
        hint: 'The prefix "omni-" means "all".',
        explanation: 'Omnivores eat both plant materials (fruits, vegetables) and animal meats.'
      },
      {
        id: 'ks1-sci-anim-5',
        prompt: 'Which sense organ allows you to hear music and sounds in your environment?',
        options: ['Ears', 'Eyes', 'Nose', 'Tongue'],
        answerKey: 0,
        hint: 'You have two on the sides of your head.',
        explanation: 'Our ears are our sense organs for hearing vibrations and sounds.'
      },
      {
        id: 'ks1-sci-anim-6',
        prompt: 'Which feature is unique to birds and found on no other animal group?',
        options: ['Feathers', 'Two eyes', 'A skeleton of bones', 'Breathing air'],
        answerKey: 0,
        hint: 'What covers a bird\'s wings to help it fly and stay warm?',
        explanation: 'Feathers are unique to birds; reptiles have scales, mammals have hair/fur, and amphibians have moist skin.'
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
      },
      {
        id: 'ks1-sci-mat-3',
        prompt: 'If you spill water on the kitchen floor, which material is best to mop it up because it is absorbent?',
        options: ['A cotton cloth or paper towel', 'A plastic ruler', 'A metal baking tray', 'A sheet of glass'],
        answerKey: 0,
        hint: 'An absorbent material soaks up liquid rather than letting it run off.',
        explanation: 'Cotton and paper towels are porous and absorbent, soaking up water trapped in their fibres.'
      },
      {
        id: 'ks1-sci-mat-4',
        prompt: 'What word describes a material like thick cardboard that blocks all light and cannot be seen through?',
        options: ['Opaque', 'Transparent', 'Translucent', 'Invisible'],
        answerKey: 0,
        hint: 'Transparent lets light through; what is the opposite word?',
        explanation: 'Opaque materials do not allow light to pass through them, casting a solid shadow behind them.'
      },
      {
        id: 'ks1-sci-mat-5',
        prompt: 'Why do cooking saucepans usually have a metal base but a plastic or wooden handle?',
        options: [
          'Metal conducts heat quickly to cook food, while plastic or wood protects your hands from getting burned',
          'Metal is soft and light, while wood is heavy and metallic',
          'Plastic melts easily into the food to add flavour',
          'Wood conducts heat much faster than copper and iron'
        ],
        answerKey: 0,
        hint: 'Think about how you pick up the hot pan safely from the cooker.',
        explanation: 'Metal is a thermal conductor that heats food quickly; wood and plastic are thermal insulators that stay cool to touch.'
      },
      {
        id: 'ks1-sci-mat-6',
        prompt: 'Which everyday object is made of a flexible, stretchy material?',
        options: ['An elastic rubber band', 'A ceramic teacup', 'A brick wall', 'A glass bottle'],
        answerKey: 0,
        hint: 'It can be pulled long and snaps back to its original shape.',
        explanation: 'Elastic bands are made of flexible, stretchy rubber that deforms under tension and returns to its shape.'
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
      },
      {
        id: 'ks1-mat-add-3',
        prompt: 'What is the double of 6 (6 + 6)?',
        options: ['12', '10', '14', '16'],
        answerKey: 0,
        hint: 'Count two groups of 6 or count on 6 from 6.',
        explanation: 'Double 6 is 12 (6 + 6 = 12).'
      },
      {
        id: 'ks1-mat-add-4',
        prompt: 'What is the missing number bond to 20 in this calculation: 14 + ___ = 20?',
        options: ['6', '5', '7', '16'],
        answerKey: 0,
        hint: 'How many ones do you add to 4 to reach 10?',
        explanation: '14 + 6 = 20. Since 4 + 6 = 10, 14 + 6 = 20.'
      },
      {
        id: 'ks1-mat-add-5',
        prompt: 'Leo had 13 shiny stickers. He gave 5 stickers to his sister. How many stickers does Leo have left?',
        options: ['8 stickers', '9 stickers', '7 stickers', '18 stickers'],
        answerKey: 0,
        hint: '13 take away 3 is 10, then take away 2 more.',
        explanation: '13 - 5 = 8. Leo has 8 stickers remaining.'
      },
      {
        id: 'ks1-mat-add-6',
        prompt: 'If we know that 9 + 4 = 13, what is 4 + 9 without counting?',
        options: ['13 (Addition is commutative and can be done in any order)', '14', '9', '4'],
        answerKey: 0,
        hint: 'Addition can be done in any order and gives the exact same total.',
        explanation: 'Addition is commutative: swapping the order of numbers (9 + 4 = 4 + 9 = 13) does not change the sum.'
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
      },
      {
        id: 'ks1-mat-shape-3',
        prompt: 'Which 3D solid shape has 2 flat circular faces and 1 curved surface connecting them (like a baked bean tin)?',
        options: ['Cylinder', 'Cone', 'Sphere', 'Pyramid'],
        answerKey: 0,
        hint: 'Think of a food tin or toilet roll tube.',
        explanation: 'A cylinder has 2 identical parallel circular flat faces and 1 continuous curved surface.'
      },
      {
        id: 'ks1-mat-shape-4',
        prompt: 'Which 2D shape has 4 straight sides that are ALL equal in length and 4 right-angle corners?',
        options: ['Square', 'Rectangle', 'Triangle', 'Hexagon'],
        answerKey: 0,
        hint: 'All four sides are identical in length.',
        explanation: 'A square is a regular quadrilateral with four equal sides and four right angles (90 degrees).'
      },
      {
        id: 'ks1-mat-shape-5',
        prompt: 'What 3D shape is a football, with 1 continuous curved surface and 0 flat faces or vertices?',
        options: ['Sphere', 'Cube', 'Cuboid', 'Cone'],
        answerKey: 0,
        hint: 'A completely round 3D ball is called a sphere.',
        explanation: 'A sphere is a perfectly round 3D solid where every point on the surface is an equal distance from the center.'
      },
      {
        id: 'ks1-mat-shape-6',
        prompt: 'How many straight sides does a 2D pentagon shape have?',
        options: ['5', '6', '8', '4'],
        answerKey: 0,
        hint: '"Penta" means five.',
        explanation: 'A pentagon is a 2D polygon with exactly 5 straight sides and 5 vertices.'
      }
    ]
  },

  'ks1:maths:place-value-50': {
    topicId: 'place-value-50',
    title: 'Place Value to 50',
    keyStage: 'Key Stage 1',
    subject: 'Mathematics',
    coreAxiom: 'Two-digit numbers up to 50 are composed of tens and ones (e.g. 43 is 4 tens and 3 ones, which equals 40 + 3). The position of each digit determines its value.',
    cognitiveTrap: 'Reversing digits (writing 34 for 43) or thinking the 4 in 43 just means 4 counters instead of 4 bundles of 10.',
    socraticPivot: 'If you have 4 packs of 10 pencils and 3 single pencils, how many pencils do you have in total?',
    hook: 'If you swap the digits in 14, you get 41! How does changing the place change the whole amount?',
    guidedStep: '1. Count the tens (groups of 10). 2. Count the leftover ones. 3. Combine: Tens + Ones.',
    scaffoldHints: {
      level1: 'In a 2-digit number, the left digit tells you how many TENS (10, 20, 30, 40) and the right digit tells you how many ONES.',
      level2: 'Dienes blocks: 1 tall stick = 1 ten (10). 1 little cube = 1 one.',
      level3: '3 tens and 7 ones = 30 + 7 = 37.'
    },
    questions: [
      {
        id: 'ks1-mat-pv-1',
        prompt: 'What is the value of the digit 4 in the number 47?',
        options: ['4 tens (40)', '4 ones (4)', '7 tens (70)', '400'],
        answerKey: 0,
        hint: 'The 4 is in the tens column: 4 tens = 40.',
        explanation: 'In 47, the 4 is in the tens place, representing 4 tens (40), and 7 is in the ones place.'
      },
      {
        id: 'ks1-mat-pv-2',
        prompt: 'Which number is partitioned into 3 tens and 6 ones?',
        options: ['36', '63', '306', '9'],
        answerKey: 0,
        hint: '3 tens = 30. 30 + 6 = 36.',
        explanation: '3 tens (30) plus 6 ones (6) equals 36.'
      },
      {
        id: 'ks1-mat-pv-3',
        prompt: 'Which number is 1 more than 29?',
        options: ['30', '28', '39', '20'],
        answerKey: 0,
        hint: 'When you have 9 ones and add 1 more one, you make a brand new ten!',
        explanation: 'Adding 1 to 29 gives 30 (2 tens and 10 ones regroup to 3 tens).'
      },
      {
        id: 'ks1-mat-pv-4',
        prompt: 'Which comparison symbol correctly completes this statement: 42 ___ 24?',
        options: ['> (greater than)', '< (less than)', '= (equal to)', '+ (plus)'],
        answerKey: 0,
        hint: '42 has 4 tens, while 24 only has 2 tens.',
        explanation: '42 has 4 tens (40), which is greater than 24, which only has 2 tens (20). So 42 > 24.'
      },
      {
        id: 'ks1-mat-pv-5',
        prompt: 'How many tens and how many ones are in the number 50?',
        options: ['5 tens and 0 ones', '0 tens and 5 ones', '50 tens and 0 ones', '5 ones and 5 tens'],
        answerKey: 0,
        hint: 'Look at the digit in the tens position (5) and ones position (0).',
        explanation: '50 is composed of exactly 5 tens (5 × 10 = 50) and 0 ones.'
      },
      {
        id: 'ks1-mat-pv-6',
        prompt: 'Which two-digit number is formed by 2 tens and 9 ones?',
        options: ['29', '92', '209', '11'],
        answerKey: 0,
        hint: '2 tens = 20, plus 9 ones = 29.',
        explanation: '2 tens (20) and 9 ones (9) combine to make 29.'
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
      },
      {
        id: 'ks1-eng-punc-2',
        prompt: 'Which sentence correctly capitalises the name of a person?',
        options: [
          'My best friend in class is Jack.',
          'My best friend in class is jack.',
          'my best friend in class is Jack',
          'My Best Friend In Class Is jack.'
        ],
        answerKey: 0,
        hint: 'Proper names of people always begin with a capital letter.',
        explanation: 'People\'s names are proper nouns and must always begin with a capital letter (Jack).'
      },
      {
        id: 'ks1-eng-punc-3',
        prompt: 'Which word in this sentence is missing a required capital letter: "yesterday, my sister and i went to the park."',
        options: [
          'Both the first word "yesterday" and the personal pronoun "i"',
          'Only the word "park"',
          'Only the word "sister"',
          'None of the words need a capital'
        ],
        answerKey: 0,
        hint: 'Sentences must start with a capital, and the word "I" is always capitalized when referring to yourself.',
        explanation: 'The sentence must begin with a capital "Yesterday" and the pronoun "I" must always be written with a capital letter.'
      },
      {
        id: 'ks1-eng-punc-4',
        prompt: 'Which punctuation mark should replace the star at the end of this sentence: "Where did you put your school jumper *"',
        options: [
          'A question mark (?)',
          'A full stop (.)',
          'A comma (,)',
          'An exclamation mark (!)'
        ],
        answerKey: 0,
        hint: 'The sentence asks for information and starts with "Where".',
        explanation: 'Sentences that ask an inquiry or question require a question mark (?) at the end.'
      },
      {
        id: 'ks1-eng-punc-5',
        prompt: 'Which day of the week is written with correct capitalisation?',
        options: ['Friday', 'friday', 'FRiDAy', 'fRiday'],
        answerKey: 0,
        hint: 'Days of the week are proper nouns.',
        explanation: 'All seven days of the week (Monday, Tuesday, etc.) must begin with a capital letter.'
      },
      {
        id: 'ks1-eng-punc-6',
        prompt: 'Which sentence correctly uses an exclamation mark to show strong surprise or urgency?',
        options: [
          'Look out, the ball is coming right at you!',
          'look out the ball is coming right at you?',
          'Look out the ball is coming right at you.',
          'Look Out The Ball Is Coming Right At You?'
        ],
        answerKey: 0,
        hint: 'Exclamation marks are used for shouting, sudden alarms, or great excitement.',
        explanation: 'An exclamation mark (!) expresses sudden emotion, warning, or excitement.'
      }
    ]
  },

  // ==========================================
  // KEY STAGE 2 (Ages 7-11 / Junior Primary)
  // ==========================================

  // --- KS2 Mathematics ---
  'ks2:maths:fractions-decimals': {
    topicId: 'fractions-decimals',
    title: 'Fractions and Decimals',
    keyStage: 'Key Stage 2',
    subject: 'Mathematics',
    coreAxiom: 'Fractions and decimals represent parts of a whole. A fraction a/b denotes "a parts out of b equal parts". To add or subtract fractions with different denominators, you must convert them to equivalent fractions with a common denominator. Decimals express fractions with powers of ten (tenths, hundredths, thousandths).',
    cognitiveTrap: 'Adding both numerators and denominators straight across (e.g. 1/3 + 1/4 = 2/7), or assuming a longer decimal is always larger (e.g. thinking 0.125 > 0.5).',
    socraticPivot: 'If you have half a pizza and another quarter of a pizza, why do you have 3/4 of a pizza and NOT 2/6?',
    hook: 'If you split a chocolate bar into 4 pieces and eat 1 piece, what fraction did you eat, and how is that written on a price tag as a decimal?',
    guidedStep: '1. Find the Lowest Common Multiple (LCM) of denominators. 2. Scale numerators. 3. Add or subtract numerators only; keep the common denominator.',
    scaffoldHints: {
      level1: 'Never add denominators together! 1/5 + 2/5 = 3/5, not 3/10.',
      level2: 'To add 1/2 + 1/4: convert 1/2 to 2/4. Now 2/4 + 1/4 = 3/4.',
      level3: 'Common decimal equivalents: 1/2 = 0.5, 1/4 = 0.25, 3/4 = 0.75, 1/10 = 0.1.'
    },
    questions: [
      {
        id: 'ks2-mat-frac-1',
        prompt: 'Calculate: 1/4 + 2/4 = ?',
        options: ['3/4', '3/8', '2/4', '1/2'],
        answerKey: 0,
        hint: 'Denominators are already identical (4): add the numerators 1 + 2.',
        explanation: 'When denominators are equal, add the numerators: 1/4 + 2/4 = 3/4.'
      },
      {
        id: 'ks2-mat-frac-2',
        prompt: 'Which decimal is exactly equivalent to the fraction 3/4?',
        options: ['0.75', '0.34', '0.43', '0.3'],
        answerKey: 0,
        hint: '1/4 is 0.25. Multiply 0.25 by 3.',
        explanation: '3/4 = 3 ÷ 4 = 0.75.'
      },
      {
        id: 'ks2-mat-frac-3',
        prompt: 'Calculate: 1/2 + 1/8 = ?',
        options: ['5/8', '2/10', '1/5', '6/8'],
        answerKey: 0,
        hint: 'Find a common denominator: convert 1/2 into eighths (4/8), then add 1/8.',
        explanation: '1/2 = 4/8. Then 4/8 + 1/8 = 5/8.'
      },
      {
        id: 'ks2-mat-frac-4',
        prompt: 'What is the fraction 6/18 written in its simplest form (reduced by dividing numerator and denominator by 6)?',
        options: ['1/3', '2/6', '3/9', '1/6'],
        answerKey: 0,
        hint: 'Divide both top and bottom by their greatest common factor (6).',
        explanation: '6 ÷ 6 = 1 and 18 ÷ 6 = 3. Therefore, 6/18 simplifies to 1/3.'
      },
      {
        id: 'ks2-mat-frac-5',
        prompt: 'Which of the following decimals has the greatest value: 0.45, 0.5, 0.09, or 0.495?',
        options: ['0.5', '0.495', '0.45', '0.09'],
        answerKey: 0,
        hint: 'Compare tenths first: 0.5 is 5 tenths (or 0.500), which is more than 4 tenths.',
        explanation: 'Looking at tenths column: 0.5 has 5 tenths (0.500), whereas 0.495 only has 4 tenths. Therefore, 0.5 is greatest.'
      },
      {
        id: 'ks2-mat-frac-6',
        prompt: 'What is the improper fraction 7/3 expressed as a mixed number?',
        options: ['2 and 1/3', '1 and 4/3', '3 and 1/3', '2 and 2/3'],
        answerKey: 0,
        hint: 'How many whole groups of 3 fit into 7? What is the remainder?',
        explanation: '7 ÷ 3 = 2 with a remainder of 1, giving 2 and 1/3.'
      }
    ]
  },

  'ks2:maths:place-value-rounding': {
    topicId: 'place-value-rounding',
    title: 'Place Value and Rounding',
    keyStage: 'Key Stage 2',
    subject: 'Mathematics',
    coreAxiom: 'In the base-10 positional number system, each column represents a power of 10 (Thousands, Hundreds, Tens, Ones, Tenths, Hundredths). When rounding to the nearest 10, 100, or 1000, inspect the decisive digit immediately to the right: 0-4 rounds down, 5-9 rounds up.',
    cognitiveTrap: 'Rounding 45 to the nearest 10 as 40 instead of 50, or changing the decisive digit without replacing following digits with placeholder zeros.',
    socraticPivot: 'Why is 350 rounded to the nearest hundred 400, but 349 rounded to the nearest hundred 300?',
    hook: 'Supermarkets round prices and crowd sizes are estimated to the nearest thousand. How do estimates give us fast clarity without losing our bearings?',
    guidedStep: '1. Underline the target place value column. 2. Circle the digit to its immediate right. 3. If 5 or more, round up (+1); if 4 or less, round down. 4. Fill remaining columns with 0.',
    scaffoldHints: {
      level1: 'Rounding rhyme: "5 to 9, climb the vine! 0 to 4, slide to the floor!"',
      level2: 'Round 348 to the nearest 100: look at the tens digit (4). Since 4 < 5, round down to 300.',
      level3: 'Decisive digit: When rounding to the nearest 1000, inspect the hundreds digit.'
    },
    questions: [
      {
        id: 'ks2-mat-pvr-1',
        prompt: 'What is 4,782 rounded to the nearest thousand?',
        options: ['5,000', '4,000', '4,800', '4,700'],
        answerKey: 0,
        hint: 'Look at the hundreds digit (7). Is 7 five or more? Round up!',
        explanation: 'The hundreds digit is 7 (≥ 5), so the thousands digit rounds up from 4 to 5, giving 5,000.'
      },
      {
        id: 'ks2-mat-pvr-2',
        prompt: 'In the number 52,836, what is the value of the digit 2?',
        options: ['2,000 (Two thousand)', '200', '20,000', '20'],
        answerKey: 0,
        hint: 'Read the place value columns: Ten-thousands (5), Thousands (2), Hundreds (8), Tens (3), Ones (6).',
        explanation: 'The digit 2 is in the thousands column, representing 2,000.'
      },
      {
        id: 'ks2-mat-pvr-3',
        prompt: 'What is 385 rounded to the nearest hundred?',
        options: ['400', '300', '380', '390'],
        answerKey: 0,
        hint: 'Look at the tens digit (8). Since 8 is 5 or more, round up.',
        explanation: 'The tens digit is 8 (≥ 5), so 3 hundreds rounds up to 4 hundreds (400).'
      },
      {
        id: 'ks2-mat-pvr-4',
        prompt: 'What is 76 rounded to the nearest ten?',
        options: ['80', '70', '75', '100'],
        answerKey: 0,
        hint: 'Look at the ones digit (6). 6 is 5 or more.',
        explanation: 'Because the ones digit is 6, 76 is closer to 80 than 70.'
      },
      {
        id: 'ks2-mat-pvr-5',
        prompt: 'Calculate: 4.5 × 100 = ?',
        options: ['450', '45', '4,500', '0.45'],
        answerKey: 0,
        hint: 'Multiplying by 100 shifts all digits two places to the left.',
        explanation: 'When multiplying by 100, digits shift two places left: 4.5 × 100 = 450.'
      },
      {
        id: 'ks2-mat-pvr-6',
        prompt: 'What number is 1,000 less than 10,000?',
        options: ['9,000', '9,990', '8,000', '9,900'],
        answerKey: 0,
        hint: 'Subtract 1 thousand from 10 thousands.',
        explanation: '10,000 - 1,000 = 9,000.'
      },
      {
        id: 'ks2-mat-pvr-7',
        prompt: 'Why is 350 rounded to the nearest hundred 400, but 349 rounded to the nearest hundred 300?',
        options: [
          'Because the decisive tens digit is 5 in 350 (rounds up), but 4 in 349 (rounds down).',
          'Because 350 is an even number and 349 is an odd number.',
          'Because numbers ending in zero always round up to the next hundred.',
          'Because 349 has fewer total digits than 350.'
        ],
        answerKey: 0,
        hint: 'When rounding to the nearest hundred, inspect the digit in the tens column.',
        explanation: 'When rounding to the nearest hundred, we inspect the decisive tens digit. In 350, the tens digit is 5 (5-9 rounds up to 400). In 349, the tens digit is 4 (0-4 rounds down to 300).'
      },
      {
        id: 'ks2-mat-pvr-8',
        prompt: 'A school has 645 pupils. Rounded to the nearest 10, how many pupils is this?',
        options: ['650', '640', '600', '700'],
        answerKey: 0,
        hint: 'To round to the nearest 10, look at the ones digit (5). "5 to 9, climb the vine!"',
        explanation: 'The ones digit is 5, so we round up to the next ten: 645 rounds up to 650.'
      }
    ]
  },

  'ks2:maths:long-division-multiplication': {
    topicId: 'long-division-multiplication',
    title: 'Long Division & Multiplication',
    keyStage: 'Key Stage 2',
    subject: 'Mathematics',
    coreAxiom: 'Formal written methods partition multi-digit calculations into place value steps. Long multiplication calculates partial products by distributing tens and ones, including placeholder zeros. Long division repeatedly groups and subtracts multiples of the divisor (Divide, Multiply, Subtract, Bring Down).',
    cognitiveTrap: 'Forgetting the placeholder 0 when multiplying by the tens digit in long multiplication, or misaligning place-value columns in long division.',
    socraticPivot: 'Why MUST you write a 0 in the ones place when multiplying by the 2 in 24?',
    hook: 'If a concert hall has 24 rows of 36 seats, how can you calculate the total capacity quickly and accurately without counting one seat at a time?',
    guidedStep: 'Long Multiplication: 1. Multiply by ones digit. 2. Write placeholder 0. 3. Multiply by tens digit. 4. Add the two partial products.',
    scaffoldHints: {
      level1: 'Always write the placeholder 0 on the second multiplication row before multiplying by tens!',
      level2: 'Long division chant: Divide, Multiply, Subtract, Bring down (Does McDonalds Sell Burgers?).',
      level3: 'To check your division: Multiply your answer by the divisor and add any remainder.'
    },
    questions: [
      {
        id: 'ks2-mat-ldm-1',
        prompt: 'Calculate: 34 × 20 = ?',
        options: ['680', '68', '340', '640'],
        answerKey: 0,
        hint: 'Multiply 34 × 2 = 68, then multiply by 10 (add a zero).',
        explanation: '34 × 2 = 68. Since we are multiplying by 20 (2 tens), 68 × 10 = 680.'
      },
      {
        id: 'ks2-mat-ldm-2',
        prompt: 'Calculate: 144 ÷ 12 = ?',
        options: ['12', '14', '10', '16'],
        answerKey: 0,
        hint: 'What number multiplied by 12 gives 144?',
        explanation: '144 ÷ 12 = 12 (since 12 × 12 = 144).'
      },
      {
        id: 'ks2-mat-ldm-3',
        prompt: 'When performing long multiplication (e.g. 54 × 23), why MUST you place a placeholder 0 in the ones column when multiplying by the 2?',
        options: [
          'Because the 2 represents 2 tens (20), so the partial product is 10 times larger',
          'Because all maths problems must end with a zero',
          'To show that the first calculation was completed',
          'Because zero is an even number'
        ],
        answerKey: 0,
        hint: 'The 2 in 23 stands for twenty, not two.',
        explanation: 'The 2 represents 20 (2 tens); writing the placeholder 0 ensures all subsequent digits align to their true place value.'
      },
      {
        id: 'ks2-mat-ldm-4',
        prompt: 'Calculate: 25 × 16 = ?',
        options: ['400', '350', '420', '380'],
        answerKey: 0,
        hint: 'Notice 25 × 4 = 100, and 16 is 4 × 4. So 100 × 4 = ?',
        explanation: '25 × 16 = 25 × 4 × 4 = 100 × 4 = 400.'
      },
      {
        id: 'ks2-mat-ldm-5',
        prompt: 'When 250 is divided by 6 using short division, what is the quotient and remainder?',
        options: ['41 remainder 4', '40 remainder 10', '42 remainder 2', '39 remainder 6'],
        answerKey: 0,
        hint: '6 × 40 = 240, 6 × 41 = 246, 250 - 246 = 4.',
        explanation: '250 ÷ 6 = 41 with a remainder of 4 (41 × 6 = 246; 246 + 4 = 250).'
      },
      {
        id: 'ks2-mat-ldm-6',
        prompt: 'Calculate: 365 × 4 = ?',
        options: ['1,460', '1,440', '1,260', '1,560'],
        answerKey: 0,
        hint: '(300 × 4) + (60 × 4) + (5 × 4) = 1,200 + 240 + 20.',
        explanation: '300 × 4 = 1,200; 60 × 4 = 240; 5 × 4 = 20. 1,200 + 240 + 20 = 1,460.'
      }
    ]
  },

  'ks2:maths:perimeter-area': {
    topicId: 'perimeter-area',
    title: 'Perimeter and Area',
    keyStage: 'Key Stage 2',
    subject: 'Mathematics',
    coreAxiom: 'Perimeter is the continuous boundary distance around the outside of a 2D shape (measured in linear units: cm, m). Area is the total surface space enclosed inside the shape (measured in square units: cm², m²). For a rectangle: Perimeter = 2(length + width); Area = length × width.',
    cognitiveTrap: 'Confusing perimeter and area (multiplying sides when asked for perimeter, or adding all four sides when asked for area).',
    socraticPivot: 'If you want to build a wooden fence around a garden vs planting grass inside it, which one needs perimeter and which needs area?',
    hook: 'A ribbon around a parcel measures perimeter; the wrapping paper covering the box measures area!',
    guidedStep: 'Perimeter: Walk around the shape and add all external sides together. Area of rectangle: Count the unit squares or multiply length × width.',
    scaffoldHints: {
      level1: 'Perimeter = Rim = Fence around outside (add sides). Area = Area code = Grass on the lawn (multiply length × width).',
      level2: 'Units check: Perimeter is cm or m. Area is always square units: cm² or m².',
      level3: 'For a rectangle with length 8 cm and width 3 cm: Perimeter = 8 + 3 + 8 + 3 = 22 cm. Area = 8 × 3 = 24 cm².'
    },
    questions: [
      {
        id: 'ks2-mat-pa-1',
        prompt: 'A rectangular playground has a length of 9 metres and a width of 4 metres. What is its AREA?',
        options: ['36 m²', '26 m', '13 m²', '36 m'],
        answerKey: 0,
        hint: 'Area = length × width. 9 × 4 = ?',
        explanation: 'Area of a rectangle = length × width = 9 m × 4 m = 36 m².'
      },
      {
        id: 'ks2-mat-pa-2',
        prompt: 'A rectangle has a length of 7 cm and a width of 3 cm. What is its PERIMETER?',
        options: ['20 cm', '21 cm²', '10 cm', '20 cm²'],
        answerKey: 0,
        hint: 'Perimeter is the distance all the way around: 7 + 3 + 7 + 3.',
        explanation: 'Perimeter = 2 × (7 + 3) = 2 × 10 = 20 cm.'
      },
      {
        id: 'ks2-mat-pa-3',
        prompt: 'What is the AREA of a right-angled triangle with a base of 6 cm and a perpendicular height of 4 cm?',
        options: ['12 cm²', '24 cm²', '10 cm²', '20 cm'],
        answerKey: 0,
        hint: 'Area of a triangle = (base × height) ÷ 2.',
        explanation: 'Area of triangle = 1/2 × base × height = (6 × 4) ÷ 2 = 24 ÷ 2 = 12 cm².'
      },
      {
        id: 'ks2-mat-pa-4',
        prompt: 'A square has a PERIMETER of 24 cm. What is the length of one of its sides?',
        options: ['6 cm', '12 cm', '4 cm', '8 cm'],
        answerKey: 0,
        hint: 'A square has 4 equal sides. Divide the total perimeter by 4.',
        explanation: 'A square has 4 equal sides: 24 cm ÷ 4 = 6 cm per side.'
      },
      {
        id: 'ks2-mat-pa-5',
        prompt: 'A square vegetable garden has sides of length 8 metres. What is its AREA?',
        options: ['64 m²', '32 m', '16 m²', '64 m'],
        answerKey: 0,
        hint: 'Area of square = side × side (8 × 8).',
        explanation: 'Area of a square = side × side = 8 m × 8 m = 64 m².'
      },
      {
        id: 'ks2-mat-pa-6',
        prompt: 'What is the key geometric difference between "Perimeter" and "Area"?',
        options: [
          'Perimeter measures the boundary distance around the edge (in cm or m); area measures the 2D surface space enclosed inside (in cm² or m²)',
          'Perimeter is only for 3D solids; area is only for 2D circles',
          'Perimeter is calculated by multiplying all four sides together; area is calculated by adding them',
          'Perimeter and area are identical measurements given in kilograms'
        ],
        answerKey: 0,
        hint: 'Perimeter is like the fence around the field; area is the grass inside.',
        explanation: 'Perimeter is linear distance around the perimeter rim (cm/m); Area is the two-dimensional surface space enclosed within (cm²/m²).'
      }
    ]
  },

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
      },
      {
        id: 'ks2-sci-states-3',
        prompt: 'At what temperature at normal sea level does pure solid ice melt into liquid water?',
        options: ['0°C', '100°C', '50°C', '-10°C'],
        answerKey: 0,
        hint: 'The freezing and melting point of pure water is the zero mark on the Celsius scale.',
        explanation: 'Pure water melts from ice to liquid at 0°C and boils from liquid to steam at 100°C.'
      },
      {
        id: 'ks2-sci-states-4',
        prompt: 'Why can a liquid like water be poured easily from a jug into a tall glass?',
        options: [
          'Its particles are close together but can slide and flow past one another',
          'Its particles are completely locked in a stiff, rigid grid',
          'Liquids have no particles whatsoever inside them',
          'The particles are spaced miles apart and move faster than light'
        ],
        answerKey: 0,
        hint: 'Liquids have a definite volume, but take the shape of their container.',
        explanation: 'In liquids, forces hold particles in contact, but they have sufficient kinetic energy to slide past each other, allowing flow.'
      },
      {
        id: 'ks2-sci-states-5',
        prompt: 'Why do tiny water droplets appear on the outside of a cold can of lemonade taken from the fridge on a warm day?',
        options: [
          'Water vapor in the warm surrounding air cools and condenses onto the cold surface',
          'Lemonade leaks directly through the solid aluminum can metal',
          'The cold can produces new water from the aluminum metal',
          'The bubbles of carbon dioxide freeze into water droplets'
        ],
        answerKey: 0,
        hint: 'Water vapor is invisible in the air around us until it hits a cold object.',
        explanation: 'This is condensation: invisible water vapor in the warm air loses heat when touching the chilled metal and turns into liquid drops.'
      },
      {
        id: 'ks2-sci-states-6',
        prompt: 'Why can a gas be easily squashed (compressed) into a smaller cylinder, while a solid block of wood cannot?',
        options: [
          'There are large empty spaces between gas particles, whereas solid particles are tightly packed together',
          'Gas particles are soft and squishy like tiny foam balls',
          'Solid wood contains no atoms or particles',
          'Gases are magnetic and pull themselves together under pressure'
        ],
        answerKey: 0,
        hint: 'Look at the gap between particles in a gas compared to a solid.',
        explanation: 'In gases, particles are spaced widely apart with empty space between them, so external pressure can easily push them closer together.'
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
      },
      {
        id: 'ks2-sci-water-3',
        prompt: 'Which scientific term describes water falling from clouds to Earth as rain, snow, sleet, or hail?',
        options: ['Precipitation', 'Evaporation', 'Filtration', 'Chlorination'],
        answerKey: 0,
        hint: 'The word refers to any form of moisture falling from the sky.',
        explanation: 'Precipitation occurs when water droplets in clouds become too heavy to stay suspended in air and fall under gravity.'
      },
      {
        id: 'ks2-sci-water-4',
        prompt: 'What is the main power source that drives the entire water cycle across planet Earth?',
        options: [
          'Thermal energy and radiation from the Sun',
          'The gravitational pull of the Moon on waves',
          'Underwater electric currents from submarine cables',
          'Windmills and sailing ships on the sea'
        ],
        answerKey: 0,
        hint: 'Without this hot celestial body, water would stay frozen and unable to evaporate.',
        explanation: 'The Sun provides solar energy, warming oceans and land, driving continuous evaporation and atmospheric movement.'
      },
      {
        id: 'ks2-sci-water-5',
        prompt: 'What is the name for the process where plants absorb water through roots and release water vapor into the air through leaves?',
        options: ['Transpiration', 'Precipitation', 'Sublimation', 'Sedimentation'],
        answerKey: 0,
        hint: 'It sounds like "perspiration" (sweating), but for trees and plants.',
        explanation: 'Transpiration is the evaporation of water from plant leaves through microscopic pores called stomata.'
      },
      {
        id: 'ks2-sci-water-6',
        prompt: 'Where does rainwater go after falling on land before it evaporates again to continue the cycle?',
        options: [
          'It flows as surface runoff into streams, rivers, and oceans, or soaks into the soil as groundwater',
          'It disappears permanently from Earth and leaves our planet forever',
          'It converts instantly into solid granite rock',
          'It turns into natural gas that fuels volcanoes'
        ],
        answerKey: 0,
        hint: 'Think about how rivers always flow downhill towards the sea.',
        explanation: 'Rain collects in soil, aquifers, lakes, and rivers, flowing back to oceans to be reheated by the Sun, sustaining the cycle.'
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
      },
      {
        id: 'ks2-sci-force-3',
        prompt: 'What happens when the North pole of a magnet is placed near the South pole of another magnet?',
        options: ['They attract (pull together)', 'They repel (push away)', 'They spin continuously without stopping', 'They lose all magnetism immediately'],
        answerKey: 0,
        hint: 'Opposite poles do the opposite of like poles.',
        explanation: 'Opposite magnetic poles (North and South) attract each other with a strong pulling magnetic force.'
      },
      {
        id: 'ks2-sci-force-4',
        prompt: 'Why can a magnet attract a steel paperclip across a table without touching it first?',
        options: [
          'Magnetism is a non-contact force that acts through an invisible magnetic field',
          'Air currents push the paperclip towards the magnet',
          'Magnets create static electric sparks that reel in objects',
          'Steel is naturally sticky and adheres to all hard surfaces'
        ],
        answerKey: 0,
        hint: 'Some forces need direct physical contact (like friction), but magnetism can act over a distance.',
        explanation: 'Magnetic forces are non-contact forces. A magnetic field surrounds the magnet and exerts force on magnetic objects within that field.'
      },
      {
        id: 'ks2-sci-force-5',
        prompt: 'Which surface will produce the greatest friction force opposing a moving toy car?',
        options: ['Rough sandpaper', 'Polished ice', 'Smooth glass', 'Oiled wooden tiles'],
        answerKey: 0,
        hint: 'Rough, bumpy surfaces grip objects more firmly than smooth ones.',
        explanation: 'Rougher surfaces have microscopic bumps that interlock, generating higher friction and slowing moving objects down more quickly.'
      },
      {
        id: 'ks2-sci-force-6',
        prompt: 'Why does a parachutist fall more slowly when their parachute opens?',
        options: [
          'The large parachute catches more air, creating huge air resistance pushing upward against gravity',
          'Gravity completely stops acting on the parachutist once fabric opens',
          'The air inside the parachute becomes lighter than hydrogen',
          'The parachute pulls the jumper sideways into clouds'
        ],
        answerKey: 0,
        hint: 'Air resistance is a frictional drag force that increases when surface area gets larger.',
        explanation: 'A deployed parachute has a vast surface area that collides with air particles, generating strong upward air resistance (drag) opposing downward gravity.'
      },
      {
        id: 'ks2-sci-force-7',
        prompt: 'On a standard bar magnet, where is the magnetic pull the strongest?',
        options: ['At both poles (North and South ends)', 'Exactly in the middle of the bar', 'Only on the sides of the bar', 'Equally weak at all points'],
        answerKey: 0,
        hint: 'If you dip a magnet into paperclips, where do most of them cling?',
        explanation: 'Magnetic field lines are concentrated most densely at the two poles (ends), making the magnetic pull strongest there.'
      },
      {
        id: 'ks2-sci-force-8',
        prompt: 'How does a magnetic compass needle allow a hiker to find direction?',
        options: [
          'The needle is a tiny magnet that aligns with Earth\'s magnetic field',
          'The needle is drawn towards sunlight reflecting from the horizon',
          'The glass cover spins the needle using wind pressure',
          'Gravity pulls the heavier end of the pointer down towards the equator'
        ],
        answerKey: 0,
        hint: 'The Earth itself acts like a giant bar magnet with magnetic poles.',
        explanation: 'Because Earth has its own magnetic field, the North-seeking pole of the magnetized compass needle pivots until it points toward Earth\'s magnetic North.'
      },
      {
        id: 'ks2-sci-force-9',
        prompt: 'Why are modern high-speed racing bicycles and swimmers\' suits designed with sleek, streamlined shapes?',
        options: [
          'To reduce friction with air (drag) or water resistance, allowing faster movement',
          'To make the bicycle attract magnetic energy from the track',
          'To eliminate all gravitational pull from the Earth',
          'To ensure the bicycle stays completely frozen in motion'
        ],
        answerKey: 0,
        hint: 'Streamlining helps fluids (air and water) flow smoothly around a moving object with less resistance.',
        explanation: 'Streamlined shapes allow air and water to flow smoothly past, minimizing turbulence and reducing drag (resistance).'
      },
      {
        id: 'ks2-sci-force-10',
        prompt: 'Which of the following relies on magnets to work in everyday household equipment?',
        options: [
          'The flexible magnetic gasket that keeps refrigerator doors firmly sealed shut',
          'A standard wooden rolling pin used in baking',
          'A ceramic drinking mug holding warm tea',
          'A cotton pillow on a bed'
        ],
        answerKey: 0,
        hint: 'Look for an appliance door that snaps shut snugly without a mechanical latch.',
        explanation: 'Refrigerator door seals contain flexible magnetic strips that stick to the steel fridge casing, creating an airtight thermal seal.'
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
      },
      {
        id: 'ks2-sci-elec-2',
        prompt: 'Which material is an electrical conductor commonly used inside electrical cables to carry current?',
        options: ['Copper metal', 'Plastic rubber', 'Dry wood', 'Ceramic glass'],
        answerKey: 0,
        hint: 'Metals allow electric current to flow through them freely.',
        explanation: 'Copper is a good electrical conductor with low resistance; plastic casing acts as an insulator to prevent shocks.'
      },
      {
        id: 'ks2-sci-elec-3',
        prompt: 'What happens to the brightness of a bulb in a series circuit if you add a second identical battery (cell) in the correct direction?',
        options: [
          'The bulb shines brighter because there is greater electrical voltage pushing current',
          'The bulb gets dimmer and slowly turns green',
          'The brightness does not change at all under any circumstances',
          'The wires immediately melt into water'
        ],
        answerKey: 0,
        hint: 'More cells increase the electrical push (voltage) through the circuit.',
        explanation: 'Adding more cells in series increases the total circuit voltage, driving more current through the bulb filament and making it glow brighter.'
      },
      {
        id: 'ks2-sci-elec-4',
        prompt: 'In a single series circuit with two bulbs, what happens if one bulb is unscrewed and removed?',
        options: [
          'The other bulb also turns off because the complete loop is broken',
          'The other bulb stays on and burns with blinding brightness',
          'The circuit begins to spin in circles',
          'The battery instantly catches fire'
        ],
        answerKey: 0,
        hint: 'In a simple series circuit, there is only one continuous path for the electricity.',
        explanation: 'Removing a component from a series circuit opens a gap in the only pathway, stopping the current and turning off all components.'
      },
      {
        id: 'ks2-sci-elec-5',
        prompt: 'What does a circle with an "X" inside it represent on a standard electrical circuit diagram?',
        options: ['A lamp (bulb)', 'A battery cell', 'An open switch', 'A buzzer'],
        answerKey: 0,
        hint: 'The cross represents the filament of a light emitter.',
        explanation: 'In standard circuit diagrams, a circle containing an "X" represents a lamp (filament bulb).'
      },
      {
        id: 'ks2-sci-elec-6',
        prompt: 'Why are electric plugs and tool handles coated in thick plastic or rubber?',
        options: [
          'Plastic and rubber are electrical insulators that stop current escaping into your hands',
          'Plastic makes the electric current flow three times faster',
          'Rubber charges the battery automatically when you hold it',
          'Metal cannot be shaped into plug handles'
        ],
        answerKey: 0,
        hint: 'Electrical insulators resist current flow and keep you safe from electric shocks.',
        explanation: 'Plastic and rubber are non-conductive insulators that protect users from hazardous electric shocks.'
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
      },
      {
        id: 'ks2-comp-algo-2',
        prompt: 'What do programmers call the process of finding and fixing errors or mistakes in their code?',
        options: ['Debugging', 'Sequencing', 'Encrypting', 'Compressing'],
        answerKey: 0,
        hint: 'Named after the famous story of a moth found trapped inside an early computer relay.',
        explanation: 'Debugging is the systematic process of identifying, diagnosing, and fixing flaws (bugs) in an algorithm or program.'
      },
      {
        id: 'ks2-comp-algo-3',
        prompt: 'Which programming concept allows a program to make a decision, such as "IF score > 50 THEN play victory sound ELSE play try-again sound"?',
        options: ['Selection (conditional decision)', 'Repetition (loop)', 'Variable storage', 'Hardware reboot'],
        answerKey: 0,
        hint: 'The program "selects" which branch of instructions to run based on a condition.',
        explanation: 'Selection uses conditional statements (IF/THEN/ELSE) to direct the flow of a program down different paths.'
      },
      {
        id: 'ks2-comp-algo-4',
        prompt: 'Why would a programmer use a loop (iteration) instead of writing out the same command 100 times?',
        options: [
          'A loop repeats commands efficiently, making code shorter, cleaner, and less prone to mistakes',
          'Computers crash if any command is typed more than once',
          'Loops speed up the computer\'s monitor refresh rate',
          'Loops automatically connect the computer to the Wi-Fi'
        ],
        answerKey: 0,
        hint: 'Iteration repeats instructions without copy-pasting lines.',
        explanation: 'Iteration (loops like "repeat 10 times" or "while true") allows instructions to execute repeatedly with minimal code.'
      },
      {
        id: 'ks2-comp-algo-5',
        prompt: 'What does "decomposition" mean when designing an algorithm for a complex game?',
        options: [
          'Breaking a large, difficult problem down into smaller, manageable sub-tasks',
          'Deleting the whole program when you encounter a bug',
          'Letting the computer overheat until it decomposes',
          'Translating code into ancient languages'
        ],
        answerKey: 0,
        hint: 'Think of taking a complex Lego castle apart into individual bricks or rooms.',
        explanation: 'Decomposition is a core computational thinking skill where you divide a complex challenge into smaller parts that are easier to solve.'
      },
      {
        id: 'ks2-comp-algo-6',
        prompt: 'Why is the exact ORDER (sequence) of commands essential in an algorithm?',
        options: [
          'Computers execute commands strictly in order; running steps out of order produces incorrect outcomes or crashes',
          'Computers randomly shuffle all lines of code before running them',
          'Order only matters for printing text on paper, not for software',
          'Computers will automatically guess what you intended if you reverse the steps'
        ],
        answerKey: 0,
        hint: 'Think about putting socks on after shoes—the order dictates success.',
        explanation: 'Computers follow instructions step-by-step in linear sequence unless instructed otherwise by control structures.'
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
      },
      {
        id: 'ks2-re-bap-4',
        prompt: 'What does the Baptismal Candle, lit from the tall Easter (Paschal) Candle, symbolize for the baptized child?',
        options: [
          'Christ as the Light of the World guiding the child to walk always as a child of the light',
          'The exact time of day when the service took place',
          'A birthday candle for their next birthday party',
          'Protection against drafts inside the church building'
        ],
        answerKey: 0,
        hint: 'Jesus said: "I am the light of the world. Whoever follows me will not walk in darkness."',
        explanation: 'The baptismal candle represents the Light of Christ which parents and godparents must help keep burning brightly in the child\'s heart.'
      },
      {
        id: 'ks2-re-bap-5',
        prompt: 'What is the sacred perfumed olive oil called that the priest uses to anoint the newly baptized person as priest, prophet, and king?',
        options: [
          'Sacred Chrism',
          'Cooking olive oil',
          'Lavender water',
          'Candle wax'
        ],
        answerKey: 0,
        hint: 'Consecrated by the Bishop at the Chrism Mass during Holy Week.',
        explanation: 'Sacred Chrism is consecrated oil used in Baptism, Confirmation, and Holy Orders to signify the gift of the Holy Spirit.'
      },
      {
        id: 'ks2-re-bap-6',
        prompt: 'What special role do Godparents (sponsors) undertake at a Catholic child\'s Baptism?',
        options: [
          'To help the parents raise the child in Catholic faith and support them with good Christian example and prayer',
          'To buy all the child\'s school books until university',
          'To serve as the priest\'s altar servers during the ceremony',
          'To choose the child\'s future school'
        ],
        answerKey: 0,
        hint: 'They promise to help the child practice and grow in their Catholic faith.',
        explanation: 'Godparents promise before God and the Church to assist the parents in teaching the child to love God and live according to the Gospel.'
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
      },
      {
        id: 'ks2-re-rec-4',
        prompt: 'What is the essential first step before going to Confession, where we quietly reflect on our choices and actions in light of God\'s commandments?',
        options: [
          'An Examination of Conscience',
          'Singing the closing hymn',
          'Reading the parish financial newsletter',
          'Choosing a baptismal name'
        ],
        answerKey: 0,
        hint: 'Examining what our conscience tells us about right and wrong.',
        explanation: 'An Examination of Conscience is a quiet prayerful reflection where we ask the Holy Spirit to reveal our sins so we can confess them honestly.'
      },
      {
        id: 'ks2-re-rec-5',
        prompt: 'What is the strict Catholic law called that forbids a priest under the pain of excommunication from ever revealing sins confessed to him?',
        options: [
          'The Seal of Confession',
          'The Liturgical Calendar',
          'The Canon of Scripture',
          'The Diocesan Charter'
        ],
        answerKey: 0,
        hint: 'The seal is sacred and inviolable: a priest can never break it under any circumstance.',
        explanation: 'The Seal of Confession guarantees total confidentiality; a priest may never betray a penitent in any manner or for any reason whatsoever.'
      },
      {
        id: 'ks2-re-rec-6',
        prompt: 'What is the prayer or act of kindness called that the priest invites you to perform after Confession to help heal the harm caused by sin?',
        options: [
          'A Penance',
          'A Collection',
          'An Ordination',
          'A Canonization'
        ],
        answerKey: 0,
        hint: 'It is a small prayer (like an Our Father or Hail Mary) or good deed of reparation.',
        explanation: 'A penance helps repair the spiritual harm done by sin and trains our soul to turn back toward God with renewed love.'
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
      },
      {
        id: 'ks2-re-word-4',
        prompt: 'Which biblical book of prayers and poetic songs (many written by King David) is sung or spoken by the congregation between the first and second readings?',
        options: [
          'The Responsorial Psalm',
          'The Book of Revelation',
          'The Song of Solomon',
          'The Book of Numbers'
        ],
        answerKey: 0,
        hint: 'The Psalmist or cantor sings a verse and the whole congregation sings the response.',
        explanation: 'The Responsorial Psalm provides a prayerful response meditating on the theme of the First Reading.'
      },
      {
        id: 'ks2-re-word-5',
        prompt: 'What joyful Hebrew word meaning "Praise the Lord" is sung by the congregation as the Gospel Acclamation (except during Lent)?',
        options: [
          'Alleluia',
          'Hosanna',
          'Maranatha',
          'Kyrie'
        ],
        answerKey: 0,
        hint: 'A word of exuberant praise to welcome the proclamation of Christ\'s Gospel.',
        explanation: 'Alleluia (Hallelujah) is the Gospel Acclamation greeting Christ who speaks to us in the Gospel.'
      },
      {
        id: 'ks2-re-word-6',
        prompt: 'What are the final intercessory prayers of the Liturgy of the Word called, where we pray for the Church, world leaders, the sick, and our local community?',
        options: [
          'The Universal Prayer (or Bidding Prayers)',
          'The Eucharistic Canon',
          'The Agnus Dei',
          'The Angelus'
        ],
        answerKey: 0,
        hint: 'The congregation answers each petition: "Lord, in your mercy, hear our prayer."',
        explanation: 'The Universal Prayer (Bidding Prayers) expresses the priestly duty of the baptized to intercede for the needs of all humanity.'
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
      },
      {
        id: 'ks2-re-ls-4',
        prompt: 'Which ancient Jewish feast commemorating liberation from slavery in Egypt were Jesus and His disciples celebrating at the Last Supper?',
        options: [
          'The Passover (Pesach)',
          'Hanukkah',
          'The Feast of Purim',
          'Yom Kippur'
        ],
        answerKey: 0,
        hint: 'The feast where unleavened bread and the Passover lamb were eaten.',
        explanation: 'Jesus chose the Passover meal to transform the ancient covenant into the New and Eternal Covenant in His Blood.'
      },
      {
        id: 'ks2-re-ls-5',
        prompt: 'Which Apostle left the table during the Last Supper and betrayed Jesus to the chief priests for thirty pieces of silver?',
        options: [
          'Judas Iscariot',
          'Simon Peter',
          'John the Evangelist',
          'Thomas the Apostle'
        ],
        answerKey: 0,
        hint: 'He dipped bread into the dish with Jesus before departing into the dark night.',
        explanation: 'Judas Iscariot betrayed Jesus in the Garden of Gethsemane shortly after the Last Supper.'
      },
      {
        id: 'ks2-re-ls-6',
        prompt: 'What did Jesus say when He passed the chalice of wine to the Apostles at the Last Supper?',
        options: [
          '"Drink of it, all of you, for this is my blood of the covenant, poured out for many for the forgiveness of sins"',
          '"Drink this to celebrate the harvest of grapes"',
          '"Keep this wine locked away until the end of time"',
          '"This is an ordinary drink to quench your thirst"'
        ],
        answerKey: 0,
        hint: 'Jesus revealed that His Blood would be poured out on Calvary for the forgiveness of sins.',
        explanation: 'Jesus consecrated the wine into His Precious Blood, establishing the New Covenant (Matthew 26:27-28).'
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
      },
      {
        id: 'ks2-re-fhc-4',
        prompt: 'What is the ornate golden stand called with glass rays used to display the Blessed Sacrament for Eucharistic Adoration and Benediction?',
        options: [
          'A Monstrance',
          'A Chalice',
          'A Cruet',
          'A Lectern'
        ],
        answerKey: 0,
        hint: 'From the Latin "monstrare" meaning "to show" or reveal Christ to the faithful.',
        explanation: 'A Monstrance is a sacred vessel designed to display the consecrated Host for adoration by the congregation.'
      },
      {
        id: 'ks2-re-fhc-5',
        prompt: 'Why do Catholics genuflect on their right knee when entering or leaving a Catholic church or passing the Tabernacle?',
        options: [
          'To humbly worship and adore Jesus Christ truly present in the Blessed Sacrament in the Tabernacle',
          'To stretch leg muscles before sitting down',
          'To show respect to the choir members',
          'Because the church floor requires inspection'
        ],
        answerKey: 0,
        hint: 'Genuflection is a bodily act of deep adoration reserved for God alone.',
        explanation: 'Touching the right knee to the ground towards the Tabernacle is an ancient sign of homage and adoration to Jesus Christ, the King of Kings.'
      },
      {
        id: 'ks2-re-fhc-6',
        prompt: 'What did Jesus say in John 6:35 when teaching about the Holy Eucharist?',
        options: [
          '"I am the Bread of Life; whoever comes to me shall not hunger, and whoever believes in me shall never thirst"',
          '"Bread is only necessary for physical health"',
          '"Do not share food with travellers"',
          '"The bread will only satisfy you for one day"'
        ],
        answerKey: 0,
        hint: 'Jesus declares that He is the Bread of Life who offers eternal salvation.',
        explanation: 'In the Bread of Life discourse (John 6), Jesus reveals that His Flesh is true food and His Blood is true drink for eternal life.'
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
      },
      {
        id: 'ks2-re-ord-5',
        prompt: 'What is the liturgical response spoken by the congregation before receiving Communion when the priest proclaims: "Behold the Lamb of God, behold him who takes away the sins of the world"?',
        options: [
          '"Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed"',
          '"Thanks be to God, for the Lord has delivered us"',
          '"Holy, Holy, Holy Lord God of hosts"',
          '"Glory to God in the highest and on earth peace to people of good will"'
        ],
        answerKey: 0,
        hint: 'This response echoes the humble faith of the Roman Centurion in the Gospel of Matthew (8:8).',
        explanation: 'Before receiving Holy Communion, Catholics recite the Centurion\'s prayer of deep humility and trust: "Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed."'
      },
      {
        id: 'ks2-re-ord-6',
        prompt: 'What must a Catholic do before receiving Holy Communion if they are conscious of having committed a grave (mortal) sin?',
        options: [
          'Receive the Sacrament of Reconciliation (Confession) to be restored to the state of grace',
          'Just fast for an extra thirty minutes before Mass begins',
          'Whisper a private promise to a friend sitting nearby',
          'Write an apology letter to the parish bishop'
        ],
        answerKey: 0,
        hint: 'The Sacrament of Reconciliation forgives sins and restores us to the state of sanctifying grace.',
        explanation: 'To receive the Eucharist worthily, anyone aware of having committed a mortal sin must first receive absolution in the Sacrament of Penance and Reconciliation (CCC 1457).'
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
      },
      {
        id: 'ks3-sci-atom-3',
        prompt: 'Which two subatomic particles are located together inside the central nucleus of an atom?',
        options: ['Protons and neutrons', 'Electrons and protons', 'Neutrons and electrons', 'Only electrons'],
        answerKey: 0,
        hint: 'They both have a relative mass of 1 and form the heavy core.',
        explanation: 'The atomic nucleus consists of positively charged protons and uncharged neutrons tightly bound together.'
      },
      {
        id: 'ks3-sci-atom-4',
        prompt: 'Why do neutral, uncharged atoms have NO overall electric charge?',
        options: [
          'The number of positive protons exactly equals the number of negative electrons',
          'Neutrons cancel out all magnetic and electrical fields',
          'Atoms only produce charge when heated above 10,000°C',
          'Electrons and protons have zero mass and zero charge'
        ],
        answerKey: 0,
        hint: 'Compare the number of +1 charges to -1 charges in a stable neutral atom.',
        explanation: 'In any neutral atom, the number of positive protons in the nucleus equals the number of negative electrons orbiting it (+1 and -1 balance to 0).'
      },
      {
        id: 'ks3-sci-atom-5',
        prompt: 'What is the maximum number of electrons that can occupy the first (innermost) energy shell in an atom?',
        options: ['2', '8', '18', '32'],
        answerKey: 0,
        hint: 'Hydrogen has 1 and Helium fills this first shell with 2.',
        explanation: 'The innermost shell can hold a maximum of 2 electrons, while the second and third shells can hold up to 8 electrons each.'
      },
      {
        id: 'ks3-sci-atom-6',
        prompt: 'Which fundamental property determines which chemical element an atom is on the Periodic Table?',
        options: [
          'The atomic number (number of protons in its nucleus)',
          'The number of neutrons in its outer shell',
          'The overall physical weight in grams',
          'The temperature at which it was formed'
        ],
        answerKey: 0,
        hint: 'Every Carbon atom has 6 of these, and every Oxygen atom has 8.',
        explanation: 'An element\'s identity is defined strictly by its atomic number (number of protons). If proton number changes, it becomes a different element.'
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
      },
      {
        id: 'ks3-sci-cell-3',
        prompt: 'What vital biological process occurs inside the mitochondria of plant and animal cells?',
        options: [
          'Aerobic cellular respiration to release usable energy (ATP)',
          'Photosynthesis using green chlorophyll pigments',
          'Storing solid food waste indefinitely',
          'Replicating the cell wall during mitosis'
        ],
        answerKey: 0,
        hint: 'Mitochondria are often referred to as the "powerhouses" of the cell.',
        explanation: 'Mitochondria are the sites of aerobic respiration, combining glucose with oxygen to release energy for cellular processes.'
      },
      {
        id: 'ks3-sci-cell-4',
        prompt: 'Which organelle acts as the control center of the cell and encloses the genetic DNA chromosomes?',
        options: ['The nucleus', 'The vacuole', 'The ribosome', 'The cytoplasm'],
        answerKey: 0,
        hint: 'Found in eukaryotic cells holding hereditary information.',
        explanation: 'The nucleus contains genetic material (DNA) organized into chromosomes, directing enzyme production and cellular division.'
      },
      {
        id: 'ks3-sci-cell-5',
        prompt: 'If a student uses a microscope with a 10× eyepiece lens and a 40× objective lens, what is the TOTAL MAGNIFICATION of the specimen?',
        options: ['400×', '50×', '40×', '4000×'],
        answerKey: 0,
        hint: 'Total magnification = Eyepiece lens magnification × Objective lens magnification.',
        explanation: 'Total magnification is calculated by multiplying: 10 × 40 = 400×.'
      },
      {
        id: 'ks3-sci-cell-6',
        prompt: 'What is the essential function of ribosomes in living cells?',
        options: [
          'Synthesizing proteins by assembling amino acids',
          'Pumping water out of the cell through osmosis',
          'Digesting toxic chemicals into carbon gas',
          'Reflecting ultraviolet light away from the nucleus'
        ],
        answerKey: 0,
        hint: 'Ribosomes read mRNA instructions to build vital structural molecules and enzymes.',
        explanation: 'Ribosomes are the cellular factories responsible for protein synthesis according to the genetic code.'
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
      },
      {
        id: 'ks3-mat-eq-3',
        prompt: 'Solve for x: 5x - 8 = 3x + 12',
        options: ['x = 10', 'x = 2', 'x = 5', 'x = 8'],
        answerKey: 0,
        hint: 'Subtract 3x from both sides first to get 2x - 8 = 12, then add 8.',
        explanation: '5x - 3x = 12 + 8 -> 2x = 20 -> x = 10.'
      },
      {
        id: 'ks3-mat-eq-4',
        prompt: 'Solve for x: (x + 4) / 3 = 5',
        options: ['x = 11', 'x = 19', 'x = 15', 'x = 7'],
        answerKey: 0,
        hint: 'Multiply both sides by 3 to clear the denominator, then subtract 4.',
        explanation: '(x + 4) = 5 × 3 = 15 -> x = 15 - 4 = 11.'
      },
      {
        id: 'ks3-mat-eq-5',
        prompt: 'Solve for x: 18 - 2x = 6',
        options: ['x = 6', 'x = 12', 'x = -6', 'x = 4'],
        answerKey: 0,
        hint: 'Subtract 18 from both sides (-2x = -12), then divide by -2.',
        explanation: '-2x = 6 - 18 = -12 -> x = -12 / -2 = 6.'
      },
      {
        id: 'ks3-mat-eq-6',
        prompt: 'Sam thinks of a secret number n, multiplies it by 4, and adds 3. If the final answer is 27, what is the value of n?',
        options: ['n = 6', 'n = 7', 'n = 8', 'n = 5'],
        answerKey: 0,
        hint: 'Form the equation 4n + 3 = 27, subtract 3, then divide by 4.',
        explanation: '4n + 3 = 27 -> 4n = 24 -> n = 6. Checking: 4(6) + 3 = 24 + 3 = 27.'
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
      },
      {
        id: 'ks3-mat-pyth-2',
        prompt: 'In a right-angled triangle, the hypotenuse is 13 cm and one of the shorter legs is 5 cm. What is the length of the third side?',
        options: ['12 cm', '8 cm', '144 cm', '18 cm'],
        answerKey: 0,
        hint: 'Rearrange formula: a² = c² - b² = 13² - 5² = 169 - 25 = 144.',
        explanation: 'a² = 13² - 5² = 169 - 25 = 144 -> a = √144 = 12 cm.'
      },
      {
        id: 'ks3-mat-pyth-3',
        prompt: 'A right-angled triangle has perpendicular legs of length 9 m and 12 m. What is the hypotenuse length?',
        options: ['15 m', '21 m', '225 m', '18 m'],
        answerKey: 0,
        hint: '9² = 81, 12² = 144. 81 + 144 = 225.',
        explanation: 'c² = 9² + 12² = 81 + 144 = 225 -> c = √225 = 15 m.'
      },
      {
        id: 'ks3-mat-pyth-4',
        prompt: 'A 5-metre ladder leans against a vertical wall. The base of the ladder is placed 3 metres away from the wall on level ground. How high up the wall does the ladder reach?',
        options: ['4 metres', '2 metres', '8 metres', '3.5 metres'],
        answerKey: 0,
        hint: 'The ladder is the hypotenuse (5 m). Height² = 5² - 3² = 25 - 9 = 16.',
        explanation: 'Height² = 5² - 3² = 25 - 9 = 16 -> Height = √16 = 4 metres.'
      },
      {
        id: 'ks3-mat-pyth-5',
        prompt: 'Which set of three side lengths forms a valid right-angled triangle (a Pythagorean triple)?',
        options: ['7 cm, 24 cm, 25 cm', '5 cm, 6 cm, 7 cm', '4 cm, 5 cm, 6 cm', '8 cm, 10 cm, 12 cm'],
        answerKey: 0,
        hint: 'Test if a² + b² = c²: 7² + 24² = 49 + 576 = 625 = 25².',
        explanation: '7² + 24² = 49 + 576 = 625, and 25² = 625. Since 625 = 625, this is a right-angled triangle.'
      },
      {
        id: 'ks3-mat-pyth-6',
        prompt: 'In any right-angled triangle, where is the hypotenuse always located?',
        options: [
          'Directly opposite the 90-degree right angle (and it is always the longest side)',
          'Adjacent to the smallest acute angle',
          'Along the horizontal bottom edge only',
          'It can be any of the three sides at random'
        ],
        answerKey: 0,
        hint: 'Look directly across from the square right-angle corner box.',
        explanation: 'The hypotenuse is defined geometrically as the longest side of a right-angled triangle, always situated directly opposite the right angle.'
      }
    ]
  },

  'ks3:maths:probability-venn': {
    topicId: 'probability-venn',
    title: 'Probability & Venn Diagrams',
    keyStage: 'Key Stage 3',
    subject: 'Mathematics',
    coreAxiom: 'Probability of a single event is P(E) = (number of favourable outcomes) / (total number of possible outcomes), always bounded between 0 and 1. For complementary events, P(not E) = 1 - P(E). In Venn diagrams, the intersection (A ∩ B) represents elements in BOTH sets, and the union (A ∪ B) represents elements in EITHER or BOTH sets.',
    cognitiveTrap: 'Expressing probability as a ratio of favourable to unfavourable outcomes (odds) rather than over the total, or double-counting the intersection in Venn diagram unions.',
    socraticPivot: 'If there are 3 red balls and 7 blue balls in a bag, why is the probability of picking red 3/10 and NOT 3/7?',
    hook: 'Why do weather forecasters say there is a "30% chance of rain", and what is the exact probability that it will NOT rain?',
    guidedStep: '1. Count total elements in the sample space. 2. Count favourable outcomes. 3. Form fraction favourable/total. 4. In Venn diagrams, fill the intersection first to prevent double-counting.',
    scaffoldHints: {
      level1: 'Probabilities are always fractions between 0 (impossible) and 1 (certain). The denominator must ALWAYS be the TOTAL count.',
      level2: 'P(not happening) = 1 - P(happening). If P(win) = 2/5, then P(lose) = 1 - 2/5 = 3/5.',
      level3: 'Intersection (∩) = overlap of both circles. Union (∪) = everything inside either circle: n(A ∪ B) = n(A) + n(B) - n(A ∩ B).'
    },
    questions: [
      {
        id: 'ks3-mat-prob-1',
        prompt: 'A standard fair 6-sided die is rolled once. What is the probability of rolling a prime number (2, 3, or 5)?',
        options: ['1/2 (or 3/6)', '1/3', '3/3', '2/6'],
        answerKey: 0,
        hint: 'There are 3 prime numbers (2, 3, 5) out of 6 possible numbers on the die.',
        explanation: 'Favourable outcomes = 3 (numbers 2, 3, 5). Total outcomes = 6. Probability = 3/6 = 1/2.'
      },
      {
        id: 'ks3-mat-prob-2',
        prompt: 'In a class of 30 students, 18 play football and 12 play rugby, while 5 play both sports. How many students play football OR rugby (the union)?',
        options: ['25 students', '30 students', '5 students', '15 students'],
        answerKey: 0,
        hint: 'Remember to subtract the 5 students who play both so they are not counted twice: 18 + 12 - 5.',
        explanation: 'Union = Football + Rugby - Both = 18 + 12 - 5 = 25 students.'
      },
      {
        id: 'ks3-mat-prob-3',
        prompt: 'If the probability of a commuter train arriving on time tomorrow is 0.82, what is the probability that it arrives late (complementary event)?',
        options: ['0.18', '0.82', '0.28', '0.08'],
        answerKey: 0,
        hint: 'The sum of an event happening and not happening is always 1: P(late) = 1 - 0.82.',
        explanation: 'Complementary rule: P(not E) = 1 - P(E) = 1 - 0.82 = 0.18.'
      },
      {
        id: 'ks3-mat-prob-4',
        prompt: 'A bag contains 4 red, 5 green, and 11 yellow marbles. If one marble is drawn at random, what is the probability of selecting a green marble?',
        options: ['1/4 (or 5/20)', '5/15', '1/5', '5/16'],
        answerKey: 0,
        hint: 'Total marbles = 4 + 5 + 11 = 20. Favourable = 5.',
        explanation: 'Probability = favourable / total = 5 / 20 = 1/4 (or 0.25).'
      },
      {
        id: 'ks3-mat-prob-5',
        prompt: 'In Venn diagram set notation, what does the intersection symbol ∩ (e.g. A ∩ B) represent?',
        options: [
          'Elements that belong to BOTH set A and set B simultaneously',
          'Elements that belong to set A OR set B or both',
          'Elements that do not belong to either set',
          'The total number of elements in the universal set'
        ],
        answerKey: 0,
        hint: 'The overlapping central section where both sets meet.',
        explanation: 'Intersection (A ∩ B) denotes the set of elements common to both sets.'
      },
      {
        id: 'ks3-mat-prob-6',
        prompt: 'A card is drawn from a standard shuffled deck of 52 playing cards. What is the probability of drawing an Ace?',
        options: ['1/13 (or 4/52)', '1/52', '1/4', '4/13'],
        answerKey: 0,
        hint: 'There are 4 Aces in a 52-card deck (one in each suit).',
        explanation: 'Probability = 4 / 52 = 1 / 13.'
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
      },
      {
        id: 'ks2-spa-greet-3',
        prompt: 'How would you politely answer when someone asks you "¿Cómo estás?" (How are you?) in Spanish?',
        options: ['Muy bien, gracias', 'Me llamo Carlos', 'Buenas noches', 'De nada'],
        answerKey: 0,
        hint: 'Means "Very well, thank you".',
        explanation: '"Muy bien, gracias" means "Very well, thank you," answering an inquiry about your wellbeing.'
      },
      {
        id: 'ks2-spa-greet-4',
        prompt: 'What unique punctuation mark does Spanish place at the BEGINNING of a question?',
        options: [
          'An inverted upside-down question mark (¿)',
          'A semicolon (;)',
          'A colon (:)',
          'An inverted exclamation mark (¡)'
        ],
        answerKey: 0,
        hint: 'Spanish warns the reader that a question clause is starting before they finish reading.',
        explanation: 'Spanish uses the inverted question mark (¿) at the start of an interrogative phrase and a regular (?) at the end.'
      },
      {
        id: 'ks2-spa-greet-5',
        prompt: 'Which word means "Goodbye" when taking your leave in Spanish?',
        options: ['Adiós', 'Hola', 'Buenos días', 'Por favor'],
        answerKey: 0,
        hint: 'Common parting word in Spanish.',
        explanation: '"Adiós" is the standard Spanish farewell for "Goodbye".'
      },
      {
        id: 'ks2-spa-greet-6',
        prompt: 'What are the polite Spanish words for "Please" and "Thank you"?',
        options: ['Por favor and Gracias', 'De nada and Perdón', 'Hola and Adiós', 'Mucho gusto and Salud'],
        answerKey: 0,
        hint: '"Por favor" means please and "Gracias" means thanks.',
        explanation: '"Por favor" translates to "please" and "gracias" translates to "thank you".'
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
      },
      {
        id: 'ks3-spa-verb-3',
        prompt: 'How do you conjugate the regular verb "vivir" (to live) for "I live" (yo)?',
        options: ['Vivo', 'Vives', 'Viven', 'Vivimos'],
        answerKey: 0,
        hint: 'Almost all regular verbs take -o for the first-person singular "yo" in the present tense.',
        explanation: 'Remove the -ir ending from vivir to find the stem "viv-", then append -o to get "vivo" (I live).'
      },
      {
        id: 'ks3-spa-verb-4',
        prompt: 'How do you say "You speak" when addressing a friend informally (tú) with "hablar"?',
        options: ['Hablas', 'Habla', 'Hablo', 'Hablamos'],
        answerKey: 0,
        hint: 'The informal "tú" ending for -ar verbs ends in -as.',
        explanation: 'For regular -ar verbs, the "tú" form takes -as: hablar -> tú hablas.'
      },
      {
        id: 'ks3-spa-verb-5',
        prompt: 'What is the correct present tense form of "escribir" (to write) for "We write" (nosotros)?',
        options: ['Escribimos', 'Escribemos', 'Escriban', 'Escribo'],
        answerKey: 0,
        hint: 'For regular -ir verbs, the "nosotros" ending retains the letter i (-imos).',
        explanation: 'Regular -ir verbs use -imos for the nosotros form: escribir -> escribimos.'
      },
      {
        id: 'ks3-spa-verb-6',
        prompt: 'Why do Spanish speakers often say "Hablo inglés" instead of "Yo hablo inglés"?',
        options: [
          'Because the verb ending "-o" already makes it 100% clear that the subject is "yo" (I)',
          'Because Spanish grammar completely forbids the use of the word "yo"',
          'Because "yo" can only be spoken by kings and teachers',
          'Because subject pronouns slow down the internet in Spain'
        ],
        answerKey: 0,
        hint: 'Spanish is a pro-drop (pronoun-dropping) language because verb conjugations encode the person.',
        explanation: 'Since the inflectional ending "-o" uniquely signals the first person singular, the subject pronoun "yo" is redundant and usually omitted.'
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
      },
      {
        id: 'ks4-phy-newton-3',
        prompt: 'According to Newton\'s First Law of Motion, what happens to a deep-space probe travelling at 15,000 m/s when its rocket thrusters are turned off in empty space?',
        options: [
          'It continues moving at 15,000 m/s in a straight line at constant velocity indefinitely',
          'It gradually slows down to a complete halt because no force keeps it moving',
          'It immediately drops vertically toward the nearest nebula',
          'It starts spinning in circles at increasing speed'
        ],
        answerKey: 0,
        hint: 'In the vacuum of deep space there is no friction or resultant force to change its state of motion.',
        explanation: 'Newton\'s First Law states an object remains in uniform motion at constant velocity unless acted upon by an external resultant force.'
      },
      {
        id: 'ks4-phy-newton-4',
        prompt: 'A car of mass 1,500 kg accelerates uniformly along a flat road at 2.5 m/s². What resultant force must act on the car?',
        options: ['3,750 N', '600 N', '1,500 N', '375 N'],
        answerKey: 0,
        hint: 'Use Newton\'s Second Law: F = m × a.',
        explanation: 'F = m × a = 1,500 kg × 2.5 m/s² = 3,750 N.'
      },
      {
        id: 'ks4-phy-newton-5',
        prompt: 'When an astronaut in orbit pushes forward on a 50 kg equipment crate with a force of 100 N, what happens to the astronaut according to Newton\'s Third Law?',
        options: [
          'The astronaut experiences an equal and opposite force of 100 N pushing backwards',
          'The astronaut remains completely motionless with zero force acting on them',
          'The astronaut is pulled forward in the same direction as the crate',
          'The force on the astronaut depends only on the temperature of space'
        ],
        answerKey: 0,
        hint: 'Newton\'s Third Law: For every action force, there is an equal and opposite reaction force.',
        explanation: 'Forces always occur in matched interaction pairs; pushing forward on the crate generates an equal 100 N reactionary force pushing backward on the astronaut.'
      },
      {
        id: 'ks4-phy-newton-6',
        prompt: 'What is the crucial scientific distinction between the MASS of an object and its WEIGHT?',
        options: [
          'Mass is the quantity of matter (measured in kg, constant anywhere); weight is the gravitational force acting on that mass (measured in Newtons, W = mg)',
          'Mass changes on the Moon, while weight stays identical everywhere',
          'Mass and weight are identical terms measuring volume in litres',
          'Mass is measured with a spring scale in Newtons; weight is measured in kilograms'
        ],
        answerKey: 0,
        hint: 'Weight is a force caused by gravity (W = mg), measured in Newtons.',
        explanation: 'Mass is an intrinsic measure of matter in kilograms (scalar). Weight is the downward gravitational force acting on mass (vector, measured in Newtons).'
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
      },
      {
        id: 'ks4-chem-bal-2',
        prompt: 'Which coefficients correctly balance the complete combustion of methane: ___ CH₄ + ___ O₂ -> ___ CO₂ + ___ H₂O ?',
        options: [
          'CH₄ + 2 O₂ -> CO₂ + 2 H₂O',
          'CH₄ + O₂ -> CO₂ + H₂O',
          '2 CH₄ + 3 O₂ -> 2 CO₂ + 2 H₂O',
          'CH₄ + 4 O₂ -> CO₂ + 4 H₂O'
        ],
        answerKey: 0,
        hint: 'Reactants have 4 H, so you need 2 H₂O on the product side. Then tally total oxygen atoms.',
        explanation: 'CH₄ + 2 O₂ -> CO₂ + 2 H₂O gives 1 C, 4 H, and 4 O on both sides.'
      },
      {
        id: 'ks4-chem-bal-3',
        prompt: 'Why is it strictly forbidden to alter the subscript numbers inside a chemical formula (e.g. changing CO₂ to CO) when balancing a chemical equation?',
        options: [
          'Because changing the subscript changes the chemical identity and molecular structure of the substance itself',
          'Because subscripts must always be even numbers',
          'Because the periodic table only allows coefficients of 2 or higher',
          'Because printers cannot reproduce changed subscripts'
        ],
        answerKey: 0,
        hint: 'CO₂ is carbon dioxide; CO is poisonous carbon monoxide.',
        explanation: 'Subscripts define the fixed chemical composition and bonding ratio of the compound. Altering subscripts invents a completely different substance.'
      },
      {
        id: 'ks4-chem-bal-4',
        prompt: 'Which coefficients correctly balance the Haber synthesis of ammonia: ___ N₂ + ___ H₂ -> ___ NH₃ ?',
        options: [
          'N₂ + 3 H₂ -> 2 NH₃',
          'N₂ + H₂ -> NH₃',
          '2 N₂ + 3 H₂ -> 4 NH₃',
          'N₂ + 2 H₂ -> 2 NH₃'
        ],
        answerKey: 0,
        hint: '2 Nitrogen atoms on the left require 2 NH₃ on the right, which gives 2 × 3 = 6 Hydrogen atoms.',
        explanation: 'N₂ + 3 H₂ -> 2 NH₃ gives 2 Nitrogen atoms and 6 Hydrogen atoms on both sides.'
      },
      {
        id: 'ks4-chem-bal-5',
        prompt: 'In the reaction 2 Na + Cl₂ -> 2 NaCl, if 46 g of sodium reacts completely with 71 g of chlorine gas, what mass of sodium chloride is produced according to the Law of Conservation of Mass?',
        options: ['117 g', '100 g', '25 g', '46 g'],
        answerKey: 0,
        hint: 'Conservation of mass: Total mass of reactants = Total mass of products.',
        explanation: 'Total reactant mass = 46 g + 71 g = 117 g. Mass is conserved, so exactly 117 g of NaCl is produced.'
      },
      {
        id: 'ks4-chem-bal-6',
        prompt: 'Which set of coefficients correctly balances the reaction between aluminium and hydrochloric acid: ___ Al + ___ HCl -> ___ AlCl₃ + ___ H₂ ?',
        options: [
          '2 Al + 6 HCl -> 2 AlCl₃ + 3 H₂',
          'Al + 3 HCl -> AlCl₃ + H₂',
          '2 Al + 3 HCl -> 2 AlCl₃ + 3 H₂',
          'Al + 2 HCl -> AlCl₃ + 2 H₂'
        ],
        answerKey: 0,
        hint: 'Find the lowest common multiple for Cl (3) and H (2), which is 6.',
        explanation: '2 Al + 6 HCl -> 2 AlCl₃ + 3 H₂ balances 2 Al, 6 H, and 6 Cl on both sides of the equation.'
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
      },
      {
        id: 'ks4-bio-photo-3',
        prompt: 'Which environmental factor, when increased beyond its optimum level, causes the rate of photosynthesis to plummet due to enzyme denaturation?',
        options: ['Temperature', 'Light intensity', 'Carbon dioxide concentration', 'Soil mineral levels'],
        answerKey: 0,
        hint: 'Enzymes like rubisco are proteins that lose their tertiary active-site shape at high heat.',
        explanation: 'Above approximately 45°C, photosynthetic enzymes denature, destroying their active sites and causing the reaction rate to drop to zero.'
      },
      {
        id: 'ks4-bio-photo-4',
        prompt: 'By what physical mechanism does water move continuously from plant roots through xylem vessels up to the leaves?',
        options: ['Transpiration stream driven by water evaporation at stomata', 'Active pumping by heart-like vascular valves', 'Gravitational hydrostatic pressure from root parenchyma', 'Phloem osmotic reverse siphonage'],
        answerKey: 0,
        hint: 'Water evaporates from spongy mesophyll and diffuses out through open stomata, pulling more water up via cohesion.',
        explanation: 'Evaporation of water vapor from leaf surfaces creates negative pressure tension, pulling a continuous column of water up xylem tubes via cohesive hydrogen bonds.'
      },
      {
        id: 'ks4-bio-photo-5',
        prompt: 'What is the inverse square law relationship between light intensity and the distance (d) from a light source in a photosynthesis experiment?',
        options: [
          'Light intensity is inversely proportional to the square of the distance (Light intensity ∝ 1 / d²)',
          'Light intensity decreases linearly as distance increases (Light intensity ∝ 1 / d)',
          'Light intensity is directly proportional to the square of distance (Light intensity ∝ d²)',
          'Distance has no mathematical effect on light intensity'
        ],
        answerKey: 0,
        hint: 'If you double the distance (×2), light intensity drops to one quarter (1/4 or 1/2²).',
        explanation: 'According to the inverse square law, as distance from the light source increases, light intensity drops proportionally to the square of the distance: Light intensity ∝ 1 / d².'
      },
      {
        id: 'ks4-bio-photo-6',
        prompt: 'What cellular adaptation enables root hair cells to absorb water by osmosis and mineral ions by active transport with maximum efficiency?',
        options: [
          'A greatly elongated microscopic projection providing an immense surface area-to-volume ratio and abundant mitochondria for active transport ATP',
          'A thick waxy cuticle layer that prevents water from leaking into the surrounding soil',
          'Abundant chloroplasts that carry out photosynthesis underground in the dark',
          'Lignified dead walls that filter out all dissolved mineral ions'
        ],
        answerKey: 0,
        hint: 'Root hairs have long microscopic fingers to maximize surface area and lots of mitochondria for energy.',
        explanation: 'Root hair cells possess long, thin extensions that dramatically increase surface area for osmosis, along with large numbers of mitochondria providing ATP for active transport of nitrates and other minerals against concentration gradients.'
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
    ...CURRICULUM_COMPLETE_BASE,
  };

  const stopWords = new Set(['and', 'within', 'the', 'of', 'to', 'in', 'for', 'with', 'a', 'an', 'at', 'by']);
  const getTokens = (str: string) =>
    (str || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 1 && !stopWords.has(w));

  const queryTopicTokens = getTokens(topic);

  // 1. Direct key match (e.g. "ks2:science:states-of-matter")
  for (const [key, val] of Object.entries(combinedKnowledgeBase)) {
    const [kStage, kSub, kTop] = key.split(':');
    const stageMatch =
      normStage.includes(kStage) ||
      (kStage === 'ks1' && normStage.includes('1')) ||
      (kStage === 'ks2' && normStage.includes('2')) ||
      (kStage === 'ks3' && normStage.includes('3')) ||
      (kStage === 'ks4' && (normStage.includes('4') || normStage.includes('gcse')));
    const subjectMatch =
      normSubject.includes(kSub) ||
      kSub.includes(normSubject) ||
      (kSub === 'maths' && (normSubject.includes('mat') || normSubject.includes('arith') || normSubject.includes('num'))) ||
      (kSub === 'science' && (normSubject.includes('sci') || normSubject.includes('phys') || normSubject.includes('chem') || normSubject.includes('bio'))) ||
      (kSub === 'history' && normSubject.includes('hist')) ||
      (kSub === 'geography' && normSubject.includes('geo')) ||
      (kSub === 'english' && (normSubject.includes('eng') || normSubject.includes('phon') || normSubject.includes('read') || normSubject.includes('writ'))) ||
      (kSub === 'computing' && (normSubject.includes('comp') || normSubject.includes('algo'))) ||
      (kSub.includes('relig') && (normSubject.includes('relig') || normSubject.includes('cath') || normSubject.includes('faith'))) ||
      (kSub === 'mfl' && (normSubject.includes('mfl') || normSubject.includes('lang') || normSubject.includes('french') || normSubject.includes('spanish') || normSubject.includes('latin')));

    const valNormTitle = norm(val.title);
    const keyTopTokens = getTokens(kTop);
    const valTitleTokens = getTokens(val.title);
    const combinedTokens = new Set([...keyTopTokens, ...valTitleTokens]);

    const directTokenOverlap =
      queryTopicTokens.length > 0 &&
      queryTopicTokens.every((t) => combinedTokens.has(t) || kTop.includes(t) || valNormTitle.includes(t));

    const majorTokenOverlap =
      queryTopicTokens.length >= 2 &&
      queryTopicTokens.filter((t) => combinedTokens.has(t) || kTop.includes(t) || valNormTitle.includes(t)).length >= 2;

    const topicMatch =
      normTopic.includes(kTop) ||
      kTop.includes(normTopic) ||
      valNormTitle.includes(normTopic) ||
      normTopic.includes(valNormTitle) ||
      val.topicId === normTopic ||
      directTokenOverlap ||
      majorTokenOverlap;

    if (stageMatch && subjectMatch && topicMatch) {
      return val;
    }
  }

  // 2. Fuzzy topic match across knowledge base if exact stage/subject slightly differs
  for (const val of Object.values(combinedKnowledgeBase)) {
    const valTitleNorm = norm(val.title);
    const valTitleTokens = getTokens(val.title);
    const hasSignificantOverlap =
      queryTopicTokens.length >= 2 &&
      queryTopicTokens.filter((t) => valTitleTokens.includes(t) || valTitleNorm.includes(t)).length >= 2;

    if (
      valTitleNorm.includes(normTopic) ||
      normTopic.includes(valTitleNorm) ||
      val.topicId === normTopic ||
      hasSignificantOverlap
    ) {
      return val;
    }
  }

  return null;
}
