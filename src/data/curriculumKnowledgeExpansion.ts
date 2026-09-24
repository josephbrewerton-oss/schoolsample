// src/data/curriculumKnowledgeExpansion.ts
// Comprehensive UK National Curriculum & Oak Academy Knowledge Bank Expansion
// Covers History, Geography, Computing, English, and advanced Sciences across KS1 - KS4

export interface CurriculumTopicEntry {
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
    level1: string;
    level2: string;
    level3: string;
  };
  questions: Array<{
    id: string;
    prompt: string;
    options: string[];
    answerKey: number;
    hint: string;
    explanation: string;
  }>;
}

export const CURRICULUM_EXPANSION_BASE: Record<string, CurriculumTopicEntry> = {
  // ========================================================
  // KEY STAGE 1: History, Geography, English
  // ========================================================
  'ks1:history:living-memory': {
    topicId: 'living-memory',
    title: 'Changes Within Living Memory',
    keyStage: 'Key Stage 1',
    subject: 'History',
    coreAxiom: 'Living memory refers to events remembered by people alive today (e.g. grandparents, parents), contrasting with times before anyone alive was born.',
    cognitiveTrap: 'Believing everything in the past was in black-and-white, or confusing 50 years ago with the time of castles and dinosaurs.',
    socraticPivot: 'How can we find out what childhood was like for people alive today compared to people who lived hundreds of years ago?',
    hook: 'Did you know your grandparents didn\'t have smartphones, the internet, or streaming video when they were your age?',
    guidedStep: 'Compare everyday household objects, toys, and communication methods from the 1960s-1980s with today.',
    scaffoldHints: {
      level1: 'Think about people you can talk to directly: grandparents, older neighbours, or parents.',
      level2: 'Living memory means someone alive today was there to witness it firsthand.',
      level3: 'A wooden spinning top or dial telephone belongs to living memory; a medieval knight does not.'
    },
    questions: [
      {
        id: 'ks1-hist-mem-1',
        prompt: 'What does the phrase "within living memory" mean in history?',
        options: [
          'Events remembered by people who are still alive today',
          'Things that happened thousands of years ago in ancient times',
          'Stories made up in storybooks and fairy tales',
          'Events that only happen inside a person\'s dreams'
        ],
        answerKey: 0,
        hint: 'Think about stories an older family member can tell you from their own childhood.',
        explanation: 'Living memory covers the past ~80-100 years because there are people alive today who personally experienced those events.'
      },
      {
        id: 'ks1-hist-mem-2',
        prompt: 'Which of these communication devices was commonly used in homes before mobile phones existed?',
        options: [
          'A landline telephone with a rotary dial and cord',
          'A smartphone with touchscreen apps',
          'A tablet computer with wireless internet',
          'A smartwatch with voice assistant'
        ],
        answerKey: 0,
        hint: 'It had a round wheel with numbers that you turned with your finger.',
        explanation: 'Before mobile phones, families had landline rotary dial phones connected to the wall with a curly cord.'
      },
      {
        id: 'ks1-hist-mem-3',
        prompt: 'How did people commonly listen to music at home in the 1970s and 1980s before internet streaming existed?',
        options: [
          'On vinyl record players and cassette tape decks',
          'By streaming on wireless earbuds connected to the cloud',
          'Through digital satellite holograms in the living room',
          'Music could only be heard in outdoor football stadiums'
        ],
        answerKey: 0,
        hint: 'Music was stored physically on spinning plastic discs or magnetic tape.',
        explanation: 'Before digital MP3s and streaming, people purchased physical vinyl LP records and cassette tapes to play on home stereos.'
      },
      {
        id: 'ks1-hist-mem-4',
        prompt: 'How did schoolchildren find facts for a school project before internet search engines were created?',
        options: [
          'By reading printed encyclopedia books and non-fiction library books',
          'By asking artificial intelligence chatbots on tablets',
          'By downloading files from classroom satellites',
          'School projects did not exist before computers'
        ],
        answerKey: 0,
        hint: 'Big hardback books filled with facts in alphabetical order.',
        explanation: 'Children and adults looked up information in multi-volume printed encyclopedias and library reference collections.'
      },
      {
        id: 'ks1-hist-mem-5',
        prompt: 'Which of these major historical events took place WITHIN living memory?',
        options: [
          'The Apollo 11 Moon Landing in 1969',
          'The Building of the Great Pyramid of Giza',
          'The Battle of Hastings in 1066',
          'The extinction of the dinosaurs'
        ],
        answerKey: 0,
        hint: 'There are millions of grandparents and parents alive today who watched it live on television.',
        explanation: 'The 1969 Moon Landing occurred within living memory; many people alive today remember watching it on black-and-white TVs.'
      },
      {
        id: 'ks1-hist-mem-6',
        prompt: 'Why do historians interview older people to record "oral history"?',
        options: [
          'To hear firsthand memories of what daily life, work, and school were like in the past',
          'Because older people know how to build medieval castles',
          'To test if older people can remember poetry',
          'Because books are no longer allowed in museums'
        ],
        answerKey: 0,
        hint: 'Hearing real stories directly from people who lived through the event.',
        explanation: 'Oral history captures living memories, giving personal and emotional insight into how everyday life changed over recent decades.'
      }
    ]
  },

  'ks1:history:historical-figures': {
    topicId: 'historical-figures',
    title: 'Significant Historical Figures',
    keyStage: 'Key Stage 1',
    subject: 'History',
    coreAxiom: 'Significant historical figures (such as Florence Nightingale, Mary Seacole, and Neil Armstrong) made lasting contributions that changed society or human knowledge.',
    cognitiveTrap: 'Thinking significant figures only worked alone, or confusing who did what.',
    socraticPivot: 'Why do we remember nurses like Florence Nightingale and Mary Seacole more than 150 years later?',
    hook: 'Imagine going to a hospital where doctors didn\'t wash hands and beds had dirty sheets. Who changed that forever?',
    guidedStep: 'Identify key contributions of historical changemakers and analyze how hospitals and space exploration improved.',
    scaffoldHints: {
      level1: 'Florence Nightingale carried a lamp at night to care for wounded soldiers in the Crimean War.',
      level2: 'Mary Seacole was a British-Jamaican nurse who set up the British Hotel to treat sick and wounded soldiers.',
      level3: 'Their work established modern, clean nursing standards and hygiene in hospitals.'
    },
    questions: [
      {
        id: 'ks1-hist-fig-1',
        prompt: 'Why is Florence Nightingale remembered as a significant historical figure?',
        options: [
          'She reformed hospital hygiene and established modern professional nursing',
          'She was the first queen to rule England',
          'She invented the electric light bulb',
          'She discovered the laws of gravity'
        ],
        answerKey: 0,
        hint: 'She was called "The Lady with the Lamp" and cleaned dirty military hospitals.',
        explanation: 'Florence Nightingale showed that clean water, fresh air, healthy food, and handwashing saved soldiers\' lives, creating modern nursing.'
      },
      {
        id: 'ks1-hist-fig-2',
        prompt: 'Who was Mary Seacole, and what courageous work did she do?',
        options: [
          'A British-Jamaican nurse who travelled to Crimea to nurse sick and wounded soldiers',
          'The first female astronaut to orbit the Earth',
          'A Victorian railway engineer who built bridges',
          'An ancient Roman explorer who mapped Britain'
        ],
        answerKey: 0,
        hint: 'She used herbal remedies and her own funds to help soldiers during the Crimean War.',
        explanation: 'Mary Seacole showed immense courage and compassion caring for wounded soldiers in the Crimean War.'
      },
      {
        id: 'ks1-hist-fig-3',
        prompt: 'What famous nickname was given to Florence Nightingale by the wounded soldiers in the Crimean military hospital?',
        options: [
          '"The Lady with the Lamp"',
          '"The Queen of the Battlefield"',
          '"The Red Cross Angel"',
          '"The Iron Duchess"'
        ],
        answerKey: 0,
        hint: 'She carried a lamp down the dark hallways at night to comfort patients.',
        explanation: 'Soldiers called her "The Lady with the Lamp" because she patrolled the hospital wards at night making sure every wounded man was attended to.'
      },
      {
        id: 'ks1-hist-fig-4',
        prompt: 'Who was Neil Armstrong and why is he famous in world history?',
        options: [
          'He was the first human being to walk on the surface of the Moon in 1969',
          'He discovered the continent of Australia',
          'He invented the steam train engine',
          'He wrote the English dictionary'
        ],
        answerKey: 0,
        hint: 'Commander of the Apollo 11 space mission.',
        explanation: 'On July 20, 1969, American astronaut Neil Armstrong stepped off the Apollo 11 lunar module onto the Moon.'
      },
      {
        id: 'ks1-hist-fig-5',
        prompt: 'What memorable words did Neil Armstrong say as his boot first touched lunar dust?',
        options: [
          '"That\'s one small step for man, one giant leap for mankind"',
          '"Good luck to all the stars in heaven"',
          '"The earth is flat and very bright"',
          '"We have arrived at the final frontier"'
        ],
        answerKey: 0,
        hint: 'One small step for a person, but a huge leap for all humanity.',
        explanation: 'Armstrong\'s immortal phrase captured how a single physical step represented centuries of human scientific and technological achievement.'
      },
      {
        id: 'ks1-hist-fig-6',
        prompt: 'What did Mary Seacole build in the Crimea to provide shelter, hot meals, and care for soldiers?',
        options: [
          'The British Hotel',
          'St Thomas\'s Hospital',
          'The Royal Observatory',
          'A military fortress'
        ],
        answerKey: 0,
        hint: 'She named it after Britain and ran it using her own funds.',
        explanation: 'Mary Seacole funded and built the "British Hotel" near Balaclava to serve nourishing food and care for convalescing troops.'
      }
    ]
  },

  'ks1:geography:local-area': {
    topicId: 'local-area',
    title: 'Our Local Area',
    keyStage: 'Key Stage 1',
    subject: 'Geography',
    coreAxiom: 'A local area contains both human features (built by people, e.g. roads, houses, shops) and physical features (formed by nature, e.g. rivers, hills, trees).',
    cognitiveTrap: 'Classifying a park as entirely natural when humans designed the paths and planted the lawn.',
    socraticPivot: 'Look around your school: which features were made by people, and which were created by nature?',
    hook: 'If humans disappeared for 100 years, which parts of your town would survive and which would return to nature?',
    guidedStep: 'Sort local features into "Human Features" and "Physical Features" using simple map keys and directional compass points.',
    scaffoldHints: {
      level1: 'Human features = built by people (school, road, bridge).',
      level2: 'Physical features = created by nature (hill, river, woodland, beach).',
      level3: 'A park has physical grass and trees, but paths, benches, and fences are human features.'
    },
    questions: [
      {
        id: 'ks1-geo-loc-1',
        prompt: 'Which of the following is a HUMAN geographical feature in a local area?',
        options: [
          'A zebra crossing on a paved street',
          'A natural meandering river',
          'A rocky natural cliff',
          'A steep green hill formed by glaciers'
        ],
        answerKey: 0,
        hint: 'Which of these was constructed and built by workers?',
        explanation: 'Human features are built by people to help us live, travel, and work (like roads, zebra crossings, houses, and schools).'
      },
      {
        id: 'ks1-geo-loc-2',
        prompt: 'Which of the following is a PHYSICAL geographical feature?',
        options: [
          'A flowing freshwater river',
          'A brick primary school building',
          'A post office and supermarket',
          'A railway station platform'
        ],
        answerKey: 0,
        hint: 'It formed naturally on the Earth without people building it.',
        explanation: 'Rivers, oceans, mountains, and forests are physical features created by natural processes of the Earth.'
      },
      {
        id: 'ks1-geo-loc-3',
        prompt: 'What does a map KEY (or legend) show on a local street map?',
        options: [
          'What the symbols, colours, and shapes on the map represent',
          'The key that unlocks the school front door',
          'The names of all the car drivers in the town',
          'The weather forecast for tomorrow afternoon'
        ],
        answerKey: 0,
        hint: 'It unlocks the meaning of symbols like a cross for church or blue line for river.',
        explanation: 'A map key explains what each symbol, line, and shading means so the reader can understand the map.'
      },
      {
        id: 'ks1-geo-loc-4',
        prompt: 'Which compass direction points towards the bottom of a standard map when North is at the top?',
        options: [
          'South',
          'East',
          'West',
          'North-East'
        ],
        answerKey: 0,
        hint: 'Remember the four cardinal directions: North (top), South (bottom), East (right), West (left).',
        explanation: 'On standard maps with North pointing upwards, South is directly opposite pointing downwards.'
      },
      {
        id: 'ks1-geo-loc-5',
        prompt: 'Is a man-made canal with brick towpaths and water locks classified as a human or physical feature?',
        options: [
          'A human feature, because it was dug and constructed by human engineers',
          'A physical feature, because it contains water and ducks',
          'Neither, it is an astronomical feature',
          'Both, but it turns into a physical feature when it rains'
        ],
        answerKey: 0,
        hint: 'Even though it holds water, workers dug the channel with shovels and machines.',
        explanation: 'Because humans planned, dug, and constructed canals to transport goods, canals are human features.'
      },
      {
        id: 'ks1-geo-loc-6',
        prompt: 'What kind of view does an aerial map (bird\'s-eye view) show of a school playground?',
        options: [
          'Looking straight down from high up in the sky',
          'Looking through a window from inside the classroom',
          'Looking up from underneath the playground tarmac',
          'A side view of the school roof'
        ],
        answerKey: 0,
        hint: 'Imagine being a bird or drone looking directly down towards the ground.',
        explanation: 'An aerial or bird\'s-eye plan view shows ground features viewed from directly above.'
      }
    ]
  },

  'ks1:english:phonics-simple-sentences': {
    topicId: 'phonics-simple-sentences',
    title: 'Phonics & Simple Sentences',
    keyStage: 'Key Stage 1',
    subject: 'English',
    coreAxiom: 'A complete simple sentence contains a subject and a verb, expresses a complete thought, and begins with a capital letter and ends with punctuation.',
    cognitiveTrap: 'Treating a random group of words or an incomplete clause without a verb as a sentence.',
    socraticPivot: 'What makes "The dog barked" a complete sentence, but "The big brown dog" incomplete?',
    hook: 'Can you spot which word is missing to make this group of words make complete sense?',
    guidedStep: 'Check each sentence for: 1. Capital letter, 2. Subject, 3. Doing word (verb), 4. Full stop.',
    scaffoldHints: {
      level1: 'Every sentence needs someone or something (the subject) doing an action (the verb).',
      level2: 'If there is no action word, the thought is not finished.',
      level3: '"The cat" = who. "slept in the sun" = action. Together: "The cat slept in the sun."'
    },
    questions: [
      {
        id: 'ks1-eng-pho-1',
        prompt: 'Which of these is a complete, correctly punctuated simple sentence?',
        options: [
          'The children played in the park.',
          'in the green park under the trees',
          'Running quickly to the big yellow bus',
          'the tall teacher and the happy pupils'
        ],
        answerKey: 0,
        hint: 'Look for the option that has a capital letter, an action verb, and a full stop.',
        explanation: '"The children played in the park." is complete because it has a subject (the children), a verb (played), and proper punctuation.'
      },
      {
        id: 'ks1-eng-pho-2',
        prompt: 'Every complete written sentence must always start with which kind of letter?',
        options: [
          'A capital letter',
          'A lowercase letter',
          'An italic number',
          'A punctuation symbol'
        ],
        answerKey: 0,
        hint: 'A large uppercase letter to mark the beginning of a new idea.',
        explanation: 'Sentences in English always begin with an uppercase capital letter.'
      },
      {
        id: 'ks1-eng-pho-3',
        prompt: 'Which punctuation mark belongs at the end of a sentence that asks a question, like "Where did the kitten hide"?',
        options: [
          'A question mark (?)',
          'A full stop (.)',
          'A comma (,)',
          'An apostrophe (\')'
        ],
        answerKey: 0,
        hint: 'Used when someone is asking for an answer.',
        explanation: 'Interrogative sentences (questions) must conclude with a question mark (?).'
      },
      {
        id: 'ks1-eng-pho-4',
        prompt: 'Which word in this sentence is the action verb: "The playful puppy jumped over the puddle"?',
        options: [
          'jumped',
          'puppy',
          'playful',
          'puddle'
        ],
        answerKey: 0,
        hint: 'The doing word that tells what the puppy did.',
        explanation: '"Jumped" is the verb because it describes the action performed by the puppy.'
      },
      {
        id: 'ks1-eng-pho-5',
        prompt: 'In phonics, what sound does the consonant digraph "sh" make in words like "ship", "fish", and "shop"?',
        options: [
          'A quiet /sh/ sound like asking someone to be quiet',
          'A hard /ch/ sound like a train chugging',
          'A buzzing /zz/ sound like a bumblebee',
          'A clicking /k/ sound'
        ],
        answerKey: 0,
        hint: 'Two letters "s" and "h" joining together to make one soft unvoiced sound.',
        explanation: 'The digraph "sh" represents the unvoiced postalveolar fricative /ʃ/ sound as in "ship" and "brush".'
      },
      {
        id: 'ks1-eng-pho-6',
        prompt: 'Which punctuation mark should end a sentence expressing sudden excitement or urgency, such as "Watch out for that car!"?',
        options: [
          'An exclamation mark (!)',
          'A full stop (.)',
          'A question mark (?)',
          'A colon (:)'
        ],
        answerKey: 0,
        hint: 'A line with a dot underneath used for strong feeling or warnings.',
        explanation: 'Exclamation marks (!) are used to show heightened emotion, alarm, excitement, or a strong command.'
      }
    ]
  },

  // ========================================================
  // KEY STAGE 2: History, Geography, Computing, English
  // ========================================================
  'ks2:history:ancient-egypt': {
    topicId: 'ancient-egypt',
    title: 'Ancient Egypt & Pharaohs',
    keyStage: 'Key Stage 2',
    subject: 'History',
    coreAxiom: 'Ancient Egyptian civilization flourished along the River Nile, whose annual inundation (flooding) deposited fertile silt, enabling agriculture, monument construction, and divine kingship (Pharaohs).',
    cognitiveTrap: 'Believing the pyramids were built by aliens or that the Sahara desert was always barren without the Nile.',
    socraticPivot: 'Why did the Greek historian Herodotus call Egypt "the gift of the Nile"?',
    hook: 'Without a single river flowing through thousands of miles of scorching desert, would the Great Pyramids ever have existed?',
    guidedStep: 'Trace how seasonal Nile flooding (Akhet, Peret, Shemu) supported agriculture, papyrus making, and limestone transport.',
    scaffoldHints: {
      level1: 'The Nile provided fresh water, fish, fertile soil (black silt), and river transport.',
      level2: 'The Pharaoh was seen as both a political ruler and a religious intermediary connected to the gods (like Horus).',
      level3: 'Pyramids were royal tombs designed to protect the Pharaoh\'s body and possessions for the afterlife.'
    },
    questions: [
      {
        id: 'ks2-hist-egypt-1',
        prompt: 'Why was the annual flooding of the River Nile essential for Ancient Egyptian civilization?',
        options: [
          'It deposited fertile black silt (soil) along the riverbanks, allowing crops to grow in the desert',
          'It washed away all the homes so Egyptians could rebuild their cities every year',
          'It kept Egypt completely frozen so enemies could not invade by boat',
          'It brought saltwater straight from the ocean into people\'s drinking wells'
        ],
        answerKey: 0,
        hint: 'Think about how farmers grew wheat and barley in a dry desert region.',
        explanation: 'Every year, the Nile flooded and left behind rich black silt. This made the soil fertile, providing surplus food to feed pyramid builders and craftsmen.'
      },
      {
        id: 'ks2-hist-egypt-2',
        prompt: 'What was the primary religious purpose of building the stone pyramids in Ancient Egypt?',
        options: [
          'To serve as monumental tombs safeguarding the Pharaoh\'s body and goods for the afterlife',
          'To act as public astronomical observatories for watching eclipses',
          'To store giant supplies of river water during summer droughts',
          'To function as outdoor market squares for trading grain with Greece'
        ],
        answerKey: 0,
        hint: 'They contained burial chambers, mummies, and grave treasures.',
        explanation: 'Pyramids were grand tombs constructed to preserve the Pharaoh\'s mummy and treasures, ensuring safe passage into the afterlife.'
      },
      {
        id: 'ks2-hist-egypt-3',
        prompt: 'Which famous archaeological discovery in 1799 allowed modern historians to decipher ancient Egyptian hieroglyphic writing?',
        options: [
          'The Rosetta Stone, containing the same royal decree written in Greek, Demotic, and hieroglyphs',
          'The Golden Mask of Tutankhamun discovered in the Valley of the Kings',
          'The Great Sphinx of Giza carved out of solid limestone',
          'The wooden solar boat buried beside the Great Pyramid of Khufu'
        ],
        answerKey: 0,
        hint: 'It had the same text carved in three scripts, including ancient Greek which scholars could already read.',
        explanation: 'The Rosetta Stone had the same text in Greek, Demotic, and hieroglyphic scripts. By translating the known Greek, Jean-François Champollion cracked the hieroglyphic code.'
      },
      {
        id: 'ks2-hist-egypt-4',
        prompt: 'During the mummification process, what was the purpose of four carved stone containers known as canopic jars?',
        options: [
          'To preserve the mummy\'s internal organs (lungs, stomach, liver, and intestines) for the afterlife',
          'To hold aromatic oils and holy river water used to wash temple steps',
          'To store gold coins and jewelry given by mourners at the tomb',
          'To trap desert scorpions and snakes away from the burial chamber'
        ],
        answerKey: 0,
        hint: 'The embalmers removed internal organs and dried them with natron salt before placing them in these jars.',
        explanation: 'The stomach, liver, lungs, and intestines were removed, dried with natron salt, and placed into four canopic jars protected by the four sons of Horus.'
      },
      {
        id: 'ks2-hist-egypt-5',
        prompt: 'What versatile plant growing abundantly along the banks of the Nile was used by Egyptians to make writing material, rope, sandals, and boats?',
        options: [
          'Papyrus reed',
          'Cotton bush',
          'Oak bark',
          'Bamboo cane'
        ],
        answerKey: 0,
        hint: 'The word "paper" comes from the name of this tall water reed.',
        explanation: 'Papyrus reeds were cut into thin strips, pressed, dried, and polished into scrolls for writing, as well as woven into sandals and light river craft.'
      },
      {
        id: 'ks2-hist-egypt-6',
        prompt: 'In Ancient Egyptian belief, who was the Pharaoh believed to represent on Earth during his lifetime?',
        options: [
          'The living earthly incarnation of the falcon god Horus',
          'An ordinary elected mayor who served a five-year term',
          'A Roman general sent by Julius Caesar to govern the Nile',
          'A foreign merchant chosen by lottery at the spring harvest'
        ],
        answerKey: 0,
        hint: 'The Pharaoh wore the double crown of Upper and Lower Egypt and was seen as a divine ruler.',
        explanation: 'Ancient Egyptians revered the Pharaoh as a divine intermediary: living Horus on Earth, and uniting with Osiris in the realm of the afterlife upon death.'
      }
    ]
  },

  'ks2:history:roman-empire': {
    topicId: 'roman-empire',
    title: 'The Roman Empire & Britain',
    keyStage: 'Key Stage 2',
    subject: 'History',
    coreAxiom: 'The Roman conquest of Britain (AD 43 under Emperor Claudius) transformed British society through paved roads, stone villas, aqueducts, urban planning, Latin language, and military fortifications like Hadrian\'s Wall.',
    cognitiveTrap: 'Thinking Julius Caesar conquered Britain permanently in 55 BC (he only mounted reconnaissance raids).',
    socraticPivot: 'Why did the Romans build thousands of miles of straight roads across Britain?',
    hook: 'If you travel on roads like the A5 (Watling Street) or the Fosse Way today, you are driving directly on top of 2,000-year-old Roman engineering!',
    guidedStep: 'Analyze the impact of Roman governance, comparing Celtic tribal life with Roman towns, underfloor heating (hypocaust), and public baths.',
    scaffoldHints: {
      level1: 'Romans built straight roads to march legions swiftly and transport trading goods.',
      level2: 'Hadrian\'s Wall was built in northern England (AD 122) to defend the Roman frontier and control trade.',
      level3: 'Boudicca, Queen of the Iceni tribe, led a major rebellion against Roman rule in AD 60-61.'
    },
    questions: [
      {
        id: 'ks2-hist-rom-1',
        prompt: 'What was the primary military purpose of building Roman roads across conquered Britain?',
        options: [
          'To enable Roman legions to march swiftly across the province to suppress rebellions and move supplies',
          'To give wild animals a safe paved path through the British countryside',
          'To mark the boundaries where farming was strictly forbidden',
          'To drain excess rainwater from the mountains into the North Sea'
        ],
        answerKey: 0,
        hint: 'Roman soldiers had heavy armour and needed to move fast to defend forts.',
        explanation: 'Straight, stone-paved Roman roads allowed military units to march quickly in any weather, while also boosting trade between new towns.'
      },
      {
        id: 'ks2-hist-rom-2',
        prompt: 'What was the hypocaust system used for in wealthy Roman villas and public baths?',
        options: [
          'An underfloor heating system where hot air circulated from a furnace',
          'An underground prison cell for keeping Celtic captured leaders',
          'A stone gutter system for collecting rainwater off tiled roofs',
          'A pulley crane mechanism for lifting heavy building stones'
        ],
        answerKey: 0,
        hint: 'The Romans hated the cold British damp and kept their floors warm with furnaces.',
        explanation: 'A hypocaust circulated hot air and smoke from a furnace beneath raised tile floors and through hollow wall tiles to heat rooms.'
      },
      {
        id: 'ks2-hist-rom-3',
        prompt: 'Who was Queen Boudicca (Boadicea) and why is she remembered in British history?',
        options: [
          'Queen of the Celtic Iceni tribe who led a fierce armed rebellion against Roman rule in AD 60-61',
          'A Roman empress who personally ordered the building of Hadrian\'s Wall',
          'The first Christian missionary to establish a cathedral in Roman London',
          'A famous gladiator who escaped the Colosseum to lead Celtic miners'
        ],
        answerKey: 0,
        hint: 'She rode into battle on a chariot after Roman officials mistreated her family and seized tribal land.',
        explanation: 'Boudicca, queen of the Iceni in East Anglia, led a mass uprising in AD 60-61, burning Camulodunum (Colchester), Verulamium (St Albans), and Londinium (London).'
      },
      {
        id: 'ks2-hist-rom-4',
        prompt: 'Why did the Roman Emperor Hadrian order the construction of a 73-mile stone wall across northern Britain in AD 122?',
        options: [
          'To mark and defend the northern border of the Roman Empire and control migration and trade with Celtic tribes',
          'To stop sea water from flooding across the English countryside during storms',
          'To keep Roman soldiers trapped inside Britain so they could not return home to Rome',
          'To build a gigantic elevated aqueduct delivering fresh drinking water to Paris'
        ],
        answerKey: 0,
        hint: 'It ran from the River Tyne on the east to the Solway Firth on the west, complete with milecastles and turrets.',
        explanation: 'Hadrian\'s Wall marked the northwest frontier of the Roman Empire, separating Roman Britannia from the unconquered Picts and Caledonian tribes to the north.'
      },
      {
        id: 'ks2-hist-rom-5',
        prompt: 'Which Roman Emperor successfully launched the full-scale Roman invasion and permanent conquest of Britain in AD 43?',
        options: [
          'Emperor Claudius',
          'Emperor Nero',
          'Julius Caesar',
          'Emperor Constantine'
        ],
        answerKey: 0,
        hint: 'Julius Caesar came in 55 and 54 BC but did not stay. Claudius ordered the full invading force with war elephants in AD 43.',
        explanation: 'In AD 43, Emperor Claudius sent General Aulus Plautius with four legions to conquer Britain and establish it as an official Roman province.'
      },
      {
        id: 'ks2-hist-rom-6',
        prompt: 'What was the basic, highly disciplined military unit of the Roman army, consisting of about 5,000 professional heavy infantry soldiers?',
        options: [
          'A Roman Legion',
          'A Cavalry Squadron',
          'A Chariot Cohort',
          'A Guerrilla Band'
        ],
        answerKey: 0,
        hint: 'Each unit was commanded by a legate and subdivided into centuries led by centurions.',
        explanation: 'A Roman legion was comprised of roughly 5,000 citizen legionaries, renowned for iron discipline, engineering skill, and standard formations like the testudo (tortoise).'
      }
    ]
  },

  'ks2:geography:rivers-water-cycle': {
    topicId: 'rivers-water-cycle',
    title: 'Rivers & The Water Cycle',
    keyStage: 'Key Stage 2',
    subject: 'Geography',
    coreAxiom: 'A river profile transitions from its upper course (steep, V-shaped valleys, waterfalls) to middle course (meanders, oxbow lakes) to lower course (wide floodplains, estuaries, delta).',
    cognitiveTrap: 'Assuming a river flows uphill toward mountains or that water gets created out of nowhere.',
    socraticPivot: 'How does gravity shape the journey of river water from high mountain peaks to the ocean?',
    hook: 'Did you know the water flowing in the River Thames today may have once been drunk by a dinosaur millions of years ago?',
    guidedStep: 'Trace erosion (hydraulic action, abrasion), transportation (traction, saltation, suspension), and deposition along a river course.',
    scaffoldHints: {
      level1: 'Upper course = steep, fast water cutting waterfalls and gorges.',
      level2: 'Middle course = water curves in bends called meanders; erosion on the outside, deposition on the inside.',
      level3: 'Lower course = river is widest and deepest, ending at the mouth where it meets the sea.'
    },
    questions: [
      {
        id: 'ks2-geo-riv-1',
        prompt: 'In a river meander (bend), where does the fastest flowing water cause erosion?',
        options: [
          'On the outside bend of the river, forming a steep river cliff',
          'On the inside bend, where gravel and sand are deposited',
          'At the very bottom of the river bed, only during droughts',
          'Equally across every centimetre without any difference'
        ],
        answerKey: 0,
        hint: 'Water swings outward with centrifugal force, like cars speeding around a tight corner.',
        explanation: 'Fast-moving water flows around the outside bend, eroding the bank to create a river cliff. Slower water on the inside deposits sediment.'
      },
      {
        id: 'ks2-geo-riv-2',
        prompt: 'Which stage of the water cycle occurs when invisible water vapour rises, cools in the atmosphere, and turns into liquid water droplets forming clouds?',
        options: [
          'Condensation',
          'Evaporation',
          'Precipitation',
          'Transpiration'
        ],
        answerKey: 0,
        hint: 'Think of warm breath condensing on a cold window pane.',
        explanation: 'Condensation happens when water vapour cools as it rises, changing back into liquid water droplets that gather to form clouds.'
      },
      {
        id: 'ks2-geo-riv-3',
        prompt: 'Which landscape feature is typically carved by a river in its steep upper course high in the hills or mountains?',
        options: [
          'V-shaped valleys and dramatic waterfalls',
          'Wide flat floodplains and muddy estuaries',
          'Large oxbow lakes and sandy beaches',
          'Broad coral reefs and ocean trenches'
        ],
        answerKey: 0,
        hint: 'In the mountains, gravity pulls water steeply downwards, causing intense vertical erosion.',
        explanation: 'In the upper course, rivers have high gravitational energy and erode vertically downwards, carving steep-sided V-shaped valleys and waterfalls.'
      },
      {
        id: 'ks2-geo-riv-4',
        prompt: 'How is a horseshoe-shaped oxbow lake formed from a river meander over time?',
        options: [
          'Continuous erosion narrows the meander neck until the river cuts straight through during a flood, depositing silt that seals off the old loop',
          'Underground volcanic lava pushes the river sideways into an artificial pond',
          'Beavers build giant stone dams that turn river curves into permanent round lakes',
          'Earthquakes split the river channel into two completely separate valleys'
        ],
        answerKey: 0,
        hint: 'Water takes the path of least resistance. During high flow, the river cuts through the narrow neck of the bend.',
        explanation: 'Erosion on outer bends narrows the loop\'s neck. In floods, the river cuts straight through. Deposition seals off the cut-off bend, creating an oxbow lake.'
      },
      {
        id: 'ks2-geo-riv-5',
        prompt: 'What name is given to the wide, flat area of land adjacent to a river in its lower course that naturally submerges during periods of high water discharge?',
        options: [
          'Floodplain',
          'Gorge',
          'Watershed',
          'Tributary'
        ],
        answerKey: 0,
        hint: 'It is a plain of land that floods, leaving fertile alluvium behind.',
        explanation: 'A floodplain is a wide, flat valley floor surrounding a river in its lower course that receives mineral-rich alluvium whenever the river bursts its banks.'
      },
      {
        id: 'ks2-geo-riv-6',
        prompt: 'What is the geographical term for the point where a river finishes its journey and flows into an ocean, sea, or lake?',
        options: [
          'The mouth (or estuary/delta)',
          'The source',
          'The tributary confluence',
          'The interlocking spur'
        ],
        answerKey: 0,
        hint: 'A river begins at its source and ends at its mouth.',
        explanation: 'The mouth is the end of the river where it discharges its water and sediments into a sea, lake, or ocean.'
      }
    ]
  },

  'ks2:geography:volcanoes-earthquakes': {
    topicId: 'volcanoes-earthquakes',
    title: 'Volcanoes and Earthquakes',
    keyStage: 'Key Stage 2',
    subject: 'Geography',
    coreAxiom: 'Earthquakes and volcanoes occur primarily along tectonic plate boundaries where the Earth\'s crustal plates meet, collide, pull apart, or slide past each other.',
    cognitiveTrap: 'Thinking the Earth\'s mantle is hollow or that volcanoes erupt randomly anywhere on Earth.',
    socraticPivot: 'Why does the Pacific "Ring of Fire" experience over 75% of the world\'s active volcanoes and earthquakes?',
    hook: 'Under your feet, the solid ground is actually floating on giant rock slabs that move as fast as your fingernails grow!',
    guidedStep: 'Differentiate magma (underground) from lava (surface), and identify tectonic plate interactions (convergent, divergent, transform).',
    scaffoldHints: {
      level1: 'Magma is molten rock trapped underground. Once it erupts onto the surface, it is called lava.',
      level2: 'Earthquakes are caused by sudden releases of energy when locked plates slip along a fault line.',
      level3: 'The point underground where the earthquake begins is the focus; the point directly above it on the surface is the epicentre.'
    },
    questions: [
      {
        id: 'ks2-geo-vol-1',
        prompt: 'What is the scientific distinction between magma and lava?',
        options: [
          'Magma is molten rock beneath the Earth\'s surface; lava is molten rock that has erupted onto the surface',
          'Magma is cold solid rock; lava is boiling liquid water mixed with gas',
          'Lava is found only inside volcanic craters; magma only exists in the ocean',
          'They are completely unrelated chemical elements found on different planets'
        ],
        answerKey: 0,
        hint: 'One is trapped under the crust; the other flows down the volcano.',
        explanation: 'Molten rock beneath the Earth\'s crust is called magma. When pressure forces it out through a vent onto the surface, it is called lava.'
      },
      {
        id: 'ks2-geo-vol-2',
        prompt: 'Why are most of the world\'s active volcanoes and major earthquakes located along the edges of the Pacific Ocean in the "Ring of Fire"?',
        options: [
          'Because tectonic plate boundaries constantly collide, subduct, and slide past each other along the rim of the Pacific Plate',
          'Because ocean water cools down the Earth\'s core and creates giant steam explosions',
          'Because gravity is twice as strong in the Pacific Ocean than on dry land continents',
          'Because coral reefs exert magnetic pressure that cracks the ocean seafloor'
        ],
        answerKey: 0,
        hint: 'Tectonic plates meet all along the rim of the Pacific Ocean basin.',
        explanation: 'The Ring of Fire is a horseshoe-shaped belt of active plate margins where oceanic plates collide with and subduct under continental plates, generating immense volcanic and seismic activity.'
      },
      {
        id: 'ks2-geo-vol-3',
        prompt: 'In earthquake science, what is the exact difference between the "focus" and the "epicentre"?',
        options: [
          'The focus is the underground point where rocks fracture; the epicentre is the point directly above it on the Earth\'s surface',
          'The epicentre is the depth in the core; the focus is the highest mountain nearby',
          'The focus is measured in kilometres; the epicentre is measured in degrees Celsius',
          'They are two identical terms that describe the outer edge of a tsunami wave'
        ],
        answerKey: 0,
        hint: 'One is deep underground along the fault line; the other is on the map on the ground surface.',
        explanation: 'The focus (hypocentre) is the underground rupture point where stored strain energy releases. The epicentre is the point on Earth\'s surface vertically above the focus.'
      },
      {
        id: 'ks2-geo-vol-4',
        prompt: 'Which sensitive instrument do geologists and seismologists use to record seismic shockwaves travelling through the Earth\'s crust?',
        options: [
          'Seismometer (or Seismograph)',
          'Barometer',
          'Anemometer',
          'Hydrometer'
        ],
        answerKey: 0,
        hint: 'Barometers measure air pressure; this tool measures ground vibrations (seismic waves).',
        explanation: 'A seismometer measures and records vibrations (P-waves and S-waves) caused by earthquakes, volcanic tremors, and subsurface explosions.'
      },
      {
        id: 'ks2-geo-vol-5',
        prompt: 'What happens at a destructive (convergent) tectonic plate boundary when an oceanic plate collides with a continental plate?',
        options: [
          'The heavier oceanic plate is pushed down into the hot mantle (subduction), melting into magma that rises to form volcanoes',
          'Both plates float up into the sky and create permanent cloud formations',
          'The two plates lock together forever and the Earth stops rotating on its axis',
          'A brand new ocean basin opens up instantly between the two landmasses'
        ],
        answerKey: 0,
        hint: 'Dense oceanic basalt sinks underneath lighter continental granite into the subduction zone.',
        explanation: 'Because dense oceanic crust is heavier than continental crust, it is forced downward into the mantle (subduction zone), melting and feeding explosive volcanic arcs.'
      },
      {
        id: 'ks2-geo-vol-6',
        prompt: 'What can happen if a massive underwater earthquake suddenly displaces millions of tonnes of seawater on the ocean floor?',
        options: [
          'A tsunami: a series of powerful, fast-travelling ocean waves that grow enormously tall as they reach shallow coastal shores',
          'A tornado that sweeps inland across flat grasslands',
          'A permanent drop of the global ocean temperature down to absolute zero',
          'A localized waterspout that stays stationary in the open ocean for decades'
        ],
        answerKey: 0,
        hint: 'The Japanese word means "harbour wave".',
        explanation: 'Undersea fault slips suddenly displace the entire water column above, sending out high-speed tsunami wave trains that surge inland with immense destructive force.'
      }
    ]
  },

  'ks2:english:fronted-adverbials': {
    topicId: 'fronted-adverbials',
    title: 'Fronted Adverbials & Commas',
    keyStage: 'Key Stage 2',
    subject: 'English',
    coreAxiom: 'A fronted adverbial is a word, phrase, or clause at the beginning of a sentence that modifies the verb (stating when, where, how, or how often), followed by a comma.',
    cognitiveTrap: 'Omitting the mandatory comma after the fronted adverbial before the main independent clause.',
    socraticPivot: 'How does moving an adverbial to the front of a sentence change the reader\'s focus?',
    hook: '"Suddenly, the lights flickered." Notice how that single comma makes you pause and feel suspense!',
    guidedStep: 'Identify the time, place, or manner phrase at the start of a sentence and check that a comma separates it from the subject.',
    scaffoldHints: {
      level1: 'Fronted adverbial tells you WHEN (In the morning), WHERE (Under the bed), or HOW (Silently).',
      level2: 'It always goes at the FRONT of the sentence and needs a COMMA right after it.',
      level3: 'Example: "Without making a sound, the fox slipped through the fence."'
    },
    questions: [
      {
        id: 'ks2-eng-adv-1',
        prompt: 'Which sentence correctly uses a fronted adverbial with appropriate punctuation?',
        options: [
          'Early that morning, the fishermen sailed out into the calm bay.',
          'Early that morning the fishermen, sailed out into the calm bay.',
          'Early that morning the fishermen sailed out, into the calm bay.',
          'Early, that morning the fishermen sailed out into the calm bay.'
        ],
        answerKey: 0,
        hint: 'The comma belongs immediately after the fronted time phrase "Early that morning".',
        explanation: '"Early that morning" is a fronted adverbial of time and must be followed by a comma before the main clause begins.'
      },
      {
        id: 'ks2-eng-adv-2',
        prompt: 'Which of the following is a fronted adverbial expressing MANNER (how an action occurred)?',
        options: [
          'Without making a sound, the leopard crept toward the watering hole.',
          'In the dark forest, the owls hooted softly.',
          'At midnight, the clock in the tower chimed twelve.',
          'Every three weeks, the postman delivered a parcel from Canada.'
        ],
        answerKey: 0,
        hint: 'Ask yourself: does the opening phrase tell you HOW, WHERE, or WHEN?',
        explanation: '"Without making a sound" describes the manner (how) the leopard crept, making it a fronted adverbial of manner.'
      },
      {
        id: 'ks2-eng-adv-3',
        prompt: 'Which of the following sentences correctly demonstrates a fronted adverbial of PLACE (where)?',
        options: [
          'Deep beneath the ocean surface, peculiar bioluminescent creatures swim.',
          'Before the sun rose, the bakers lit their brick ovens.',
          'As fast as his legs could carry him, the boy dashed towards the school bus.',
          'Occasionally, grandfather paused to adjust his brass reading spectacles.'
        ],
        answerKey: 0,
        hint: 'Look for an adverbial phrase at the start of the sentence that answers the question "Where?".',
        explanation: '"Deep beneath the ocean surface" states the location (where) the creatures swim, followed cleanly by a comma.'
      },
      {
        id: 'ks2-eng-adv-4',
        prompt: 'Which sentence correctly demonstrates a fronted adverbial of FREQUENCY (how often)?',
        options: [
          'Every single morning, the station master polishes the brass railway bell.',
          'Beside the crumbling stone wall, wild blackberries grew in clusters.',
          'With trembling hands, the explorer unfolded the fragile parchment map.',
          'During the thunderstorm, our puppy hid quietly beneath the sofa.'
        ],
        answerKey: 0,
        hint: 'Look for a phrase telling you how often an action is repeated.',
        explanation: '"Every single morning" tells the reader how frequently the action occurs, serving as a fronted adverbial of frequency.'
      },
      {
        id: 'ks2-eng-adv-5',
        prompt: 'Where must the missing comma be placed in this sentence: "After finishing her homework Sophie practiced the violin."',
        options: [
          'Immediately after "homework" (After finishing her homework, Sophie practiced the violin.)',
          'Immediately after "After" (After, finishing her homework Sophie practiced the violin.)',
          'Immediately after "Sophie" (After finishing her homework Sophie, practiced the violin.)',
          'Immediately after "practiced" (After finishing her homework Sophie practiced, the violin.)'
        ],
        answerKey: 0,
        hint: 'The comma separates the opening adverbial time clause from the main independent clause.',
        explanation: '"After finishing her homework" is the fronted adverbial of time. A comma must be placed right after "homework" before the main subject "Sophie".'
      },
      {
        id: 'ks2-eng-adv-6',
        prompt: 'How can you rewrite this sentence to give it a fronted adverbial: "The brave knight charged toward the dragon with great courage."',
        options: [
          '"With great courage, the brave knight charged toward the dragon."',
          '"The brave knight charged, with great courage toward the dragon."',
          '"Toward the dragon with great courage the brave knight charged,."',
          '"Charged the brave knight with great courage, toward the dragon."'
        ],
        answerKey: 0,
        hint: 'Move the adverbial phrase "with great courage" to the very front of the sentence and add a comma.',
        explanation: 'Placing the adverbial phrase "With great courage" at the beginning creates a fronted adverbial of manner, separated from the main clause by a comma.'
      }
    ]
  },

  'ks2:computing:online-safety': {
    topicId: 'online-safety',
    title: 'Online Safety & Digital Literacy',
    keyStage: 'Key Stage 2',
    subject: 'Computing',
    coreAxiom: 'Digital safety requires protecting personal identifiable information (PII), evaluating online content critically, maintaining strong unique passwords, and reporting inappropriate encounters to trusted adults.',
    cognitiveTrap: 'Assuming people online are always who they claim to be, or believing everything found on internet search results is true.',
    socraticPivot: 'Why should you never share your school name, home address, or date of birth on public gaming platforms?',
    hook: 'If a stranger on the street asked for keys to your house, would you give them? Why do people accidentally do that online?',
    guidedStep: 'Use the SMART rules: Safe, Meet, Accepting, Reliable, Tell. Protect personal digital footprints.',
    scaffoldHints: {
      level1: 'Never share your full name, home address, school, or passwords with anyone online.',
      level2: 'If something makes you feel uncomfortable, confused, or upset online, tell a trusted adult immediately.',
      level3: 'Strong passwords combine uppercase letters, lowercase letters, numbers, and symbols.'
    },
    questions: [
      {
        id: 'ks2-comp-safe-1',
        prompt: 'Which of the following pieces of information is considered Personally Identifiable Information (PII) that should NEVER be shared publicly online?',
        options: [
          'Your full home address and school name',
          'Your favourite colour and favourite fruit',
          'A cartoon character avatar you drew yourself',
          'Your high score in an educational math puzzle'
        ],
        answerKey: 0,
        hint: 'Which detail could allow a stranger to locate where you live or study in real life?',
        explanation: 'Full names, home addresses, phone numbers, and school names can identify your physical location and must never be shared online.'
      },
      {
        id: 'ks2-comp-safe-2',
        prompt: 'Which of the following is the most secure password according to cybersecurity standards?',
        options: [
          'P@ss!onFr#it92 (combining uppercase, lowercase, numbers, and special symbols)',
          'password123 (common sequence of words and numbers)',
          'yourfirstname2014 (using personal names and birth years)',
          '11111111 (repeated identical numbers)'
        ],
        answerKey: 0,
        hint: 'Strong passwords are long and mix lowercase, uppercase, numbers, and special symbols without personal info.',
        explanation: 'Strong passwords are long, unpredictable, and mix uppercase letters, lowercase letters, numbers, and symbols, avoiding obvious words or personal details.'
      },
      {
        id: 'ks2-comp-safe-3',
        prompt: 'What should you do if an unexpected message from an unknown sender arrives claiming you have won a free prize and asking you to "Click here now"?',
        options: [
          'Do not click the link or open attachments; delete the message and report it to a trusted adult or teacher',
          'Click the link immediately so you do not miss out on the free prize',
          'Forward the link to all your friends so they can claim prizes as well',
          'Reply with your home address and telephone number to verify delivery'
        ],
        answerKey: 0,
        hint: 'This is a classic "phishing" scam designed to install malware or steal private details.',
        explanation: 'Suspicious links and prize claims are phishing attacks designed to steal information or download malicious software. Never click them.'
      },
      {
        id: 'ks2-comp-safe-4',
        prompt: 'What does the term "digital footprint" mean regarding your activities on the internet?',
        options: [
          'The permanent trail of data, photos, comments, and web visits left behind whenever you use digital devices',
          'The physical dirt left on your computer keyboard and mouse by fingers',
          'The number of steps recorded by a fitness watch while walking outdoors',
          'The speed at which files are transferred through your home Wi-Fi router'
        ],
        answerKey: 0,
        hint: 'Every post, image, search, or comment you make contributes to your digital trail.',
        explanation: 'A digital footprint is the record of all your digital interactions. Once posted online, content can be saved, shared, and remain visible indefinitely.'
      },
      {
        id: 'ks2-comp-safe-5',
        prompt: 'In the well-known child online safety SMART rules, what does the letter "T" stand for?',
        options: [
          'TELL: Tell a parent, carer, or trusted adult if someone or something makes you feel uncomfortable or worried online',
          'TEST: Test strangers by sharing half your password to see if they guess the rest',
          'TIME: Spend at least ten hours continuously playing games without taking screen breaks',
          'TRADE: Trade your personal photos in exchange for digital tokens and skins'
        ],
        answerKey: 0,
        hint: 'The SMART rules are: Safe, Meet, Accepting, Reliable, Tell.',
        explanation: 'In the SMART rules, T stands for TELL: Always tell a trusted adult if anything online causes worry, confusion, or discomfort.'
      },
      {
        id: 'ks2-comp-safe-6',
        prompt: 'Why should you critically evaluate information you read on internet websites before using it in a school project?',
        options: [
          'Because anyone can publish content online, meaning web pages can contain inaccurate facts, outdated information, or commercial bias',
          'Because computer screens scramble real facts after 24 hours of being posted',
          'Because all websites with pictures are strictly forbidden in school classrooms',
          'Because internet search engines only index fictional fantasy stories'
        ],
        answerKey: 0,
        hint: 'Look for trustworthy sources like academic institutions, museums, and reputable national news organisations.',
        explanation: 'Not all online content is accurate or peer-reviewed. Critical digital literacy requires checking the author, cross-referencing facts, and assessing reliability.'
      }
    ]
  },

  // ========================================================
  // KEY STAGE 3: History, Geography, English, Science
  // ========================================================
  'ks3:history:industrial-revolution': {
    topicId: 'industrial-revolution',
    title: 'The Industrial Revolution',
    keyStage: 'Key Stage 3',
    subject: 'History',
    coreAxiom: 'The Industrial Revolution (c. 1760-1840) transformed Britain from an agrarian economy to an industrial powerhouse through steam power (James Watt), mechanized textile manufacture, coal mining, railways, and rapid urban migration.',
    cognitiveTrap: 'Believing industrialization benefited everyone equally from the start, ignoring child labour, pollution, and slum conditions.',
    socraticPivot: 'How did the steam engine change not just factories, but where people lived and how time itself was organized?',
    hook: 'Before 1750, nearly 80% of Britons worked in farming. Within 100 years, most lived in crowded industrial cities!',
    guidedStep: 'Analyze the causes (coal deposits, capital, empire raw materials, technology) and human consequences (Factory Acts, trade unions).',
    scaffoldHints: {
      level1: 'Steam power replaced human and animal muscle, allowing factories to run continuously anywhere near coal and water.',
      level2: 'Cities grew rapidly (urbanisation), creating severe public health crises like cholera epidemics and child labour abuses.',
      level3: 'The 1833 Factory Act began state regulation by banning textile work for children under nine.'
    },
    questions: [
      {
        id: 'ks3-hist-ind-1',
        prompt: 'How did James Watt\'s rotary steam engine revolutionize factory production during the Industrial Revolution?',
        options: [
          'It enabled continuous mechanical rotary motion anywhere, freeing factories from having to locate beside fast-flowing rivers',
          'It eliminated the need for coal and powered machines entirely using natural solar energy',
          'It stopped all urban migration by guaranteeing equal farmland for every peasant',
          'It made all manufacturing completely automated so no human workers were needed'
        ],
        answerKey: 0,
        hint: 'Early factories used waterwheels and had to sit by rivers. Steam engines changed that location requirement.',
        explanation: 'Watt\'s improved steam engine converted reciprocal piston motion into rotary power, allowing mills to be built in urban centres near coalfields.'
      },
      {
        id: 'ks3-hist-ind-2',
        prompt: 'Why did the British Parliament pass the 1833 Factory Act during the height of industrialization?',
        options: [
          'To curb severe child labour abuses by banning textile employment for children under nine and setting maximum working hours',
          'To ban steam engines and return all manufacturing to rural domestic cottages',
          'To force every British factory to double adult working hours to eighteen hours daily',
          'To make trade unions legally mandatory for all factory managers'
        ],
        answerKey: 0,
        hint: 'Campaigners like Lord Shaftesbury exposed the terrible working conditions of young children in textile mills.',
        explanation: 'The 1833 Factory Act was Britain\'s first major piece of labour welfare legislation, prohibiting employment of children under nine and establishing factory inspectors.'
      },
      {
        id: 'ks3-hist-ind-3',
        prompt: 'What was the primary cause of rapid urbanisation in British cities like Manchester and Birmingham between 1780 and 1850?',
        options: [
          'Enclosure of common land and mechanized textile factories drew hundreds of thousands of rural agricultural workers to seek wage labour',
          'A royal decree forced all farmers to vacate the countryside to make room for royal parks',
          'Epidemics in rural villages made agriculture impossible, leaving cities as the only habitable places',
          'Foreign invasion along coastal ports forced all citizens to retreat to inland manufacturing towns'
        ],
        answerKey: 0,
        hint: 'Think about where jobs moved when cottage industries were replaced by massive mechanized steam-powered mills.',
        explanation: 'Agricultural changes (enclosure) and the concentration of steam-powered machinery in urban mills created an enormous migration of labour into industrial cities.'
      },
      {
        id: 'ks3-hist-ind-4',
        prompt: 'How did George Stephenson\'s "Rocket" and the development of passenger railways alter British economic life?',
        options: [
          'Railways drastically reduced transport costs and transit times for raw coal, heavy manufactured goods, and workers across Britain',
          'Railways caused Britain to abandon maritime overseas trade completely in favor of local train travel',
          'Trains could only transport luxury goods for royalty and had zero effect on industrial coal movement',
          'Railways were banned in commercial cities because horses were deemed faster and safer'
        ],
        answerKey: 0,
        hint: 'Before railways, heavy goods like coal had to crawl along canals or horse-drawn wagons.',
        explanation: 'The railway boom linked industrial centres directly to ports and coal deposits, standardizing time and driving economic growth nationwide.'
      },
      {
        id: 'ks3-hist-ind-5',
        prompt: 'Who were the "Luddites" and why did they protest violently in northern England between 1811 and 1816?',
        options: [
          'Skilled textile craft workers who smashed mechanized shearing frames and power looms that were destroying their wages and livelihoods',
          'Coal miners demanding that all steam train lines be shut down',
          'Factory owners petitioning Parliament for lower import tariffs',
          'A religious movement that refused to use any metal tools'
        ],
        answerKey: 0,
        hint: 'Named after the mythical leader Ned Ludd; they attacked mechanical power looms.',
        explanation: 'Luddites were skilled hand-weavers and artisans who destroyed mechanized factory frames in secret raids because machines undercut their artisan status and pay.'
      },
      {
        id: 'ks3-hist-ind-6',
        prompt: 'What geological advantage was fundamental in enabling Britain to become the "Workshop of the World" during the Industrial Revolution?',
        options: [
          'Rich, accessible domestic seams of coal and iron ore located near fast transport waterways and coastal ports',
          'Vast deposits of raw gold and diamond mines across the Scottish Highlands',
          'Tropical climate conditions that allowed rubber trees to grow in Yorkshire',
          'Extensive natural oil wells bubbling to the surface in the Midlands'
        ],
        answerKey: 0,
        hint: 'Fossil fuel to fire steam engine boilers and smelt iron for locomotives and machinery.',
        explanation: 'Britain possessed abundant, easily accessible coalfields (e.g. South Wales, Yorkshire, Newcastle) and iron ore, providing the essential fuel and material for steam power and heavy industry.'
      }
    ]
  },

  'ks3:geography:plate-tectonics': {
    topicId: 'plate-tectonics',
    title: 'Plate Tectonics & Hazards',
    keyStage: 'Key Stage 3',
    subject: 'Geography',
    coreAxiom: 'The lithosphere is divided into tectonic plates driven by mantle convection currents, slab pull, and ridge push, generating earthquakes, tsunamis, and volcanic arcs along constructive, destructive, conservative, and collision boundaries.',
    cognitiveTrap: 'Thinking continental drift is fast or that conservative boundaries generate explosive volcanoes.',
    socraticPivot: 'Why do earthquakes occur at conservative boundaries like the San Andreas Fault, but explosive composite volcanoes do not?',
    hook: 'The Himalayas are still growing taller every year because India is crashing into Asia at the speed of human hair growth!',
    guidedStep: 'Classify plate margins: Destructive (subduction, ocean trench, stratovolcanoes), Constructive (mid-ocean ridges), Conservative (friction, strike-slip earthquakes).',
    scaffoldHints: {
      level1: 'Destructive margins = dense oceanic plate subducts beneath lighter continental plate and melts.',
      level2: 'Conservative margins = plates grind past each other horizontally; no crust created or destroyed, so no volcanoes.',
      level3: 'Collision zones = two continental plates of equal density collide, crumpling upward into fold mountains (Himalayas).'
    },
    questions: [
      {
        id: 'ks3-geo-tec-1',
        prompt: 'Why do conservative (transform) plate boundaries (e.g. the San Andreas Fault) produce severe earthquakes but NO volcanoes?',
        options: [
          'Plates slide past each other horizontally without subduction or mantle magma rising to the surface',
          'The crust is too cold for any tectonic activity to occur along the boundary',
          'Conservative boundaries only occur deep under ice sheets where lava cannot melt through',
          'The friction between the plates completely dissolves all molten rock into water'
        ],
        answerKey: 0,
        hint: 'To get a volcano, you need magma rising through a gap or melting from a subducted plate.',
        explanation: 'Conservative boundaries involve horizontal shearing. Stress builds up as plates stick, then releases as an earthquake. Since no plate subducts or pulls apart, no magma rises.'
      },
      {
        id: 'ks3-geo-tec-2',
        prompt: 'At a destructive (convergent) plate margin between oceanic and continental crust, why does the oceanic plate subduct beneath the continental plate?',
        options: [
          'The oceanic plate is denser and heavier than the buoyant continental crust',
          'The continental crust is submerged deeper in the mantle',
          'Ocean water pushes the continental crust upward like a boat',
          'Tectonic plates always move strictly from east to west due to Earth rotation'
        ],
        answerKey: 0,
        hint: 'Consider the mineral composition and density of basaltic oceanic crust vs granitic continental crust.',
        explanation: 'Dense, basaltic oceanic crust sinks beneath the lighter, granitic continental crust into the subduction zone, where partial melting generates explosive composite volcanoes.'
      },
      {
        id: 'ks3-geo-tec-3',
        prompt: 'What geologic feature is characteristically formed along a constructive (divergent) plate boundary such as the Mid-Atlantic Ridge?',
        options: [
          'New oceanic lithosphere formed by magma rising to fill the separating rift valley',
          'Fold mountain ranges created by two continental landmasses crumpling',
          'Deep ocean trenches where one plate plunges into the asthenosphere',
          'Completely flat plains with no volcanic or seismic activity whatsoever'
        ],
        answerKey: 0,
        hint: 'Constructive means new crust is being built as plates pull apart.',
        explanation: 'As plates diverge at constructive margins, basaltic magma wells up from the mantle, cools against seawater, and creates brand-new seafloor along a mid-ocean ridge.'
      },
      {
        id: 'ks3-geo-tec-4',
        prompt: 'Which tectonic plate margin type formed the massive Himalayan mountain range?',
        options: [
          'A collision boundary where two continental plates of equal buoyancy crumple upwards',
          'A conservative strike-slip fault sliding horizontally',
          'A constructive oceanic divergent ridge pulling apart',
          'A volcanic hotspot plume deep beneath the sea floor'
        ],
        answerKey: 0,
        hint: 'The Indo-Australian plate crashed into the Eurasian plate, crumpling continental crust into fold mountains.',
        explanation: 'Collision margins occur when two continental plates meet; neither can subduct due to equal low density, forcing the rock crust to crumple upwards into towering fold mountain ranges.'
      },
      {
        id: 'ks3-geo-tec-5',
        prompt: 'What is the geographic term for the location on the Earth\'s surface situated directly above where an earthquake rupture initiates underground?',
        options: [
          'The Epicentre',
          'The Focus (Hypocentre)',
          'The Caldera',
          'The Rift Valley'
        ],
        answerKey: 0,
        hint: 'The underground rupture point is the focus; the surface point directly overhead is the epi-...',
        explanation: 'The epicentre is the point on Earth\'s surface vertically directly above the hypocentre (focus) where seismic energy is first released.'
      },
      {
        id: 'ks3-geo-tec-6',
        prompt: 'How does an undersea megathrust earthquake at a subduction zone trigger a devastating tsunami wave?',
        options: [
          'Sudden vertical displacement of the seafloor shifts the entire water column above, radiating high-velocity ocean waves',
          'The heat from underwater lava boils all the sea into steam waves',
          'Hurricane winds generated underground push surface water ashore',
          'Tsunamis are caused entirely by gravitational tidal pulls from Jupiter'
        ],
        answerKey: 0,
        hint: 'When the overriding plate springs upward, it lifts millions of tons of seawater.',
        explanation: 'During a megathrust subduction quake, the ocean floor suddenly thrusts upwards or drops, displacing massive volumes of ocean water that race across the sea as tsunami waves.'
      }
    ]
  },

  'ks3:geography:urbanisation-mega-cities': {
    topicId: 'urbanisation-mega-cities',
    title: 'Urbanisation & Mega Cities',
    keyStage: 'Key Stage 3',
    subject: 'Geography',
    coreAxiom: 'Urbanisation is the increasing proportion of a country\'s population living in towns and cities, driven by rural-to-urban migration (push and pull factors) and high rates of natural increase, resulting in the rapid emergence of megacities (populations over 10 million).',
    cognitiveTrap: 'Confusing the absolute growth of a city with urbanisation (which is the proportion of total population living in urban areas), or assuming push factors attract migrants.',
    socraticPivot: 'Why are the fastest-growing megacities today located primarily in Low-Income Countries (LICs) and Newly Emerging Economies (NEEs) rather than High-Income Countries (HICs)?',
    hook: 'In 1950 there were only two megacities in the entire world (Tokyo and New York); today there are over 30, with cities like Lagos adding thousands of new residents every single day!',
    guidedStep: 'Distinguish push factors (drought, lack of rural jobs, famine) from pull factors (higher wages, healthcare, education), and examine urban challenges such as squatter settlements (favelas) and traffic congestion.',
    scaffoldHints: {
      level1: 'Push factors drive people away from rural countryside; pull factors attract people toward urban cities.',
      level2: 'Megacities have populations exceeding 10 million people (e.g. Tokyo, Mumbai, São Paulo, Lagos).',
      level3: 'In HICs, urbanisation rates have slowed down or stabilized, whereas LICs/NEEs experience rapid urban growth due to rural-to-urban migration combined with high birth rates.'
    },
    questions: [
      {
        id: 'ks3-geo-urb-1',
        prompt: 'What is the standard geographical definition of a "Megacity"?',
        options: [
          'A continuous urban metropolitan area with a total population exceeding 10 million people',
          'Any capital city that contains more than 1 million residents',
          'A city that covers a geographic area larger than 5,000 square kilometers',
          'A financial district that generates at least 50% of a nation\'s gross domestic product'
        ],
        answerKey: 0,
        hint: 'The threshold is based on population size, in the tens of millions.',
        explanation: 'By international demographic convention (UN Habitat), a megacity is an urban agglomeration with a population of over 10 million residents (e.g. Tokyo, Delhi, Shanghai, São Paulo).'
      },
      {
        id: 'ks3-geo-urb-2',
        prompt: 'Which of the following represents an authentic "push factor" driving rural-to-urban migration in Low-Income Countries (LICs)?',
        options: [
          'Prolonged agricultural drought, desertification, and crop failure in rural farming communities',
          'Better tertiary education opportunities and specialized university hospitals in the capital city',
          'Higher formal wages and reliable electricity grids in central commercial districts',
          'Exciting cultural entertainment and modern public transport systems'
        ],
        answerKey: 0,
        hint: 'Push factors are negative pressures that force people away from their rural origin.',
        explanation: 'Push factors are negative conditions (drought, conflict, poverty, lack of rural services) that compel people to leave rural areas. Better services and jobs in the city are pull factors.'
      },
      {
        id: 'ks3-geo-urb-3',
        prompt: 'Why do squatter settlements (such as favelas in Brazil or slums in Mumbai) frequently form on steep hillsides or flood-prone marshes on the urban periphery?',
        options: [
          'Migrants lack capital and build on marginal, hazardous land that developers and government cannot commercially use',
          'Municipal governments officially zone steep hillsides specifically for luxury residential developments',
          'Steep terrain provides natural cooling that prevents tropical diseases from spreading',
          'Building on steep slopes eliminates the legal need to install foundations or structural supports'
        ],
        answerKey: 0,
        hint: 'Consider land value, affordability, and the vulnerability of un-regulated terrain.',
        explanation: 'New rural migrants arriving with little or no money are forced onto marginal land unsuitable for formal construction—such as unstable steep slopes prone to deadly landslides or contaminated marshes.'
      },
      {
        id: 'ks3-geo-urb-4',
        prompt: 'Which sustainable urban management strategy was pioneered in Curitiba (Brazil) to curb vehicle congestion and reduce air emissions?',
        options: [
          'A high-capacity Bus Rapid Transit (BRT) network with dedicated bus lanes and pre-boarding tube stations',
          'Banning all motorized vehicles across the entire city and requiring residents to walk',
          'Paving over city parks to construct twelve-lane elevated motorways through every neighborhood',
          'Relocating the entire municipal population to rural agricultural communes'
        ],
        answerKey: 0,
        hint: 'Curitiba designed an innovative, low-cost public transport system using dedicated bus corridors.',
        explanation: 'Curitiba\'s Bus Rapid Transit (BRT) system introduced dedicated arterial bus corridors and raised cylindrical boarding tubes, moving millions of passengers daily at a fraction of the cost of a subway.'
      },
      {
        id: 'ks3-geo-urb-5',
        prompt: 'Besides rural-to-urban migration, what other primary demographic mechanism drives rapid urban population growth in LIC megacities?',
        options: [
          'High rates of natural increase (birth rates significantly exceeding death rates among young migrant populations)',
          'Elderly retirees moving from abroad into urban centre nursing homes',
          'Massive migration of city dwellers moving outwards into rural villages',
          'Lower life expectancy combined with falling fertility rates'
        ],
        answerKey: 0,
        hint: 'Rural migrants are predominantly young adults who marry and start families in the city.',
        explanation: 'Because rural-to-urban migrants are mostly young adults in their prime reproductive years, high birth rates outpace mortality, generating high natural increase.'
      },
      {
        id: 'ks3-geo-urb-6',
        prompt: 'What is the "Urban Heat Island" effect observed in dense modern metropolises?',
        options: [
          'Urban areas experience significantly warmer surface and atmospheric temperatures than surrounding rural areas due to dark asphalt, concrete thermal mass, and artificial heat emissions',
          'Cities are naturally closer to volcanic hotspots than rural farmland',
          'Air conditioning units create warm clouds that hover permanently over suburbs',
          'City buildings reflect 100% of solar radiation back into deep outer space'
        ],
        answerKey: 0,
        hint: 'Concrete and tarmac absorb solar radiation during the day and re-radiate it slowly at night.',
        explanation: 'Building materials (concrete, tarmac) absorb heat, combined with reduced vegetation evapotranspiration and vehicular exhaust, creating an urban microclimate several degrees warmer than rural environs.'
      }
    ]
  },

  'ks3:geography:glacial-landscapes': {
    topicId: 'glacial-landscapes',
    title: 'Glacial Landscapes',
    keyStage: 'Key Stage 3',
    subject: 'Geography',
    coreAxiom: 'Glaciers shape upland landscapes through freeze-thaw weathering, plucking, and abrasion, carving distinctive erosional landforms (corries, arêtes, pyramidal peaks, and U-shaped glacial troughs) and depositing unsorted till to form moraines.',
    cognitiveTrap: 'Confusing V-shaped river valleys (carved by vertical river erosion) with U-shaped glacial troughs (carved by valley glaciers with steep sides and wide flat floors).',
    socraticPivot: 'How does the cross-profile of a glacial trough (U-shaped valley) visually reveal that ice eroded both the valley sides and floor simultaneously?',
    hook: 'During the last Ice Age, an ice sheet over a kilometer thick completely covered Scotland and Northern England, grinding solid mountain granite into powder!',
    guidedStep: 'Identify processes: freeze-thaw weathering, plucking (meltwater freezes around rock and tears it away), abrasion (sandpapering bedrock with embedded stones).',
    scaffoldHints: {
      level1: 'Plucking tears rocks from the valley floor; abrasion scratches and polishes the rock like sandpaper.',
      level2: 'A corrie (or cirque) is an armchair-shaped hollow on a mountainside where glacial snow accumulates.',
      level3: 'A U-shaped valley (glacial trough) has steep, sheer cliff sides and a wide, flat valley floor.'
    },
    questions: [
      {
        id: 'ks3-geo-gla-1',
        prompt: 'How does glacial "plucking" operate to detach bedrock from an upland mountain slope?',
        options: [
          'Subglacial meltwater freezes into bedrock cracks and tears blocks away as the glacier slides downhill',
          'Rocks carried on the glacier surface melt the mountain through chemical friction',
          'Winds blowing off the glacier blast loose sand grains against exposed cliffs',
          'Gravity alone causes mountains to instantly collapse whenever ice melts'
        ],
        answerKey: 0,
        hint: 'Think about meltwater freezing in cracks and adhering to the moving glacier.',
        explanation: 'As a glacier moves, basal meltwater penetrates bedrock fractures, freezes, and bonds rock to the base of the ice. As the glacier continues downhill, it plucks the shattered blocks away.'
      },
      {
        id: 'ks3-geo-gla-2',
        prompt: 'What knife-edge mountain ridge is formed when two adjacent corries (cirques) erode backwards into each other on opposite sides of a mountain?',
        options: [
          'An arête (e.g. Striding Edge in the Lake District)',
          'A drumlin',
          'A kettle lake',
          'A terminal moraine'
        ],
        answerKey: 0,
        hint: 'French for "fishbone" or edge; a sharp, steep-sided ridge between two hollows.',
        explanation: 'An arête is a narrow, steep-sided, knife-like ridge formed when two neighbouring corries erode back-to-back through plucking and freeze-thaw weathering.'
      },
      {
        id: 'ks3-geo-gla-3',
        prompt: 'What sharp, pyramid-shaped mountain summit (such as the Matterhorn in the Alps) forms when three or more corries erode backwards towards a single central point?',
        options: [
          'A Pyramidal Peak',
          'An Esker',
          'A Hanging Valley',
          'A Roche Moutonnée'
        ],
        answerKey: 0,
        hint: 'Three or more cirques backing into one another sculpt a pointed pyramid.',
        explanation: 'When three or more corries erode back-to-back on a mountain summit, freeze-thaw weathering and plucking carve steep, triangular arêtes meeting at a central pyramidal peak.'
      },
      {
        id: 'ks3-geo-gla-4',
        prompt: 'What distinctive cross-sectional valley shape is carved out when a powerful valley glacier bulldozes and widens a pre-existing V-shaped river valley?',
        options: [
          'A wide, flat-bottomed U-shaped valley (glacial trough) with steep, sheer rock sides',
          'A narrow V-shaped gorge with interlocking spurs',
          'A perfectly circular crater basin',
          'A multi-tiered canyon carved by subterranean winds'
        ],
        answerKey: 0,
        hint: 'Glacial ice carves both the valley floor and valley walls simultaneously.',
        explanation: 'A glacier possesses enormous mass and erosive power, shearing away interlocking spurs and gouging a broad, flat valley floor bounded by steep vertical rock walls (a U-shaped glacial trough).'
      },
      {
        id: 'ks3-geo-gla-5',
        prompt: 'What is the geological name for the unsorted, angular mixture of boulders, clay, and gravel dumped directly by a glacier as it melts?',
        options: [
          'Glacial Till (or Boulder Clay)',
          'Alluvial silt',
          'Sorted river shingle',
          'Volcanic tephra'
        ],
        answerKey: 0,
        hint: 'Unlike river deposits which are sorted by size, glacial deposits are completely unsorted and angular.',
        explanation: 'Glacial till (boulder clay) is deposited directly by melting ice; because ice does not sort by weight, sediment ranges from microscopic rock flour to car-sized boulders.'
      },
      {
        id: 'ks3-geo-gla-6',
        prompt: 'What type of moraine ridge marks the furthest maximum forward advance of a valley glacier down a mountain valley?',
        options: [
          'A Terminal Moraine',
          'A Medial Moraine',
          'A Lateral Moraine',
          'A Ground Moraine'
        ],
        answerKey: 0,
        hint: 'Marks the "terminus" or end snout of the ice sheet at its maximum extent.',
        explanation: 'A terminal moraine is a high curved ridge of unsorted glacial debris deposited across the valley floor at the glacier\'s snout, recording its maximum historical advance.'
      }
    ]
  },

  'ks3:english:gothic-literature': {
    topicId: 'gothic-literature',
    title: 'Gothic Literature',
    keyStage: 'Key Stage 3',
    subject: 'English',
    coreAxiom: 'Gothic literature explores themes of terror, the supernatural, isolation, psychological dread, uncanny doubles (doppelgängers), and transgression, often set in ruined castles, decaying estates, or sublime wild landscapes.',
    cognitiveTrap: 'Confusing generic horror (jump scares/blood) with Gothic literature (sublime awe, psychological decay, atmospheric dread).',
    socraticPivot: 'How do 19th-century Gothic texts like "Frankenstein" and "Jekyll and Hyde" reflect Victorian anxieties about unchecked scientific power?',
    hook: 'Why are Gothic stories almost always set in crumbling castles, midnight storms, or dark foggy alleyways?',
    guidedStep: 'Identify key Gothic conventions: the sublime, pathetic fallacy, the uncanny (unheimlich), framing narratives, and taboo.',
    scaffoldHints: {
      level1: 'Gothic settings create atmospheric dread: isolated mansions, crypts, violent weather, and shadows.',
      level2: 'The sublime is a feeling of overwhelming awe and terror when confronting vast nature or immense danger.',
      level3: 'Pathetic fallacy reflects the characters\' psychological turmoil through external weather (e.g. raging storms).'
    },
    questions: [
      {
        id: 'ks3-eng-got-1',
        prompt: 'In Gothic literature, what does the literary concept of "the sublime" describe?',
        options: [
          'A simultaneous feeling of breathtaking awe, insignificance, and terrifying grandeur when confronting vast nature or the unknown',
          'A humorous comic relief scene designed to make the audience laugh after a scare',
          'The simple physical feeling of comfort beside a warm domestic fireplace',
          'A strict grammatical rhyming pattern used exclusively in Victorian poetry'
        ],
        answerKey: 0,
        hint: 'Think of Edmund Burke\'s philosophy: being amazed and frightened at the same time by towering mountains or violent storms.',
        explanation: 'The sublime refers to an aesthetic experience that inspires awe, wonder, and deep terror at nature\'s overwhelming scale, a cornerstone of Gothic literature.'
      },
      {
        id: 'ks3-eng-got-2',
        prompt: 'Which literary device is employed when an author uses stormy, violent weather and howling wind to mirror a character\'s internal madness or grief?',
        options: [
          'Pathetic fallacy',
          'Alliteration',
          'Onomatopoeia',
          'Rhyming couplet'
        ],
        answerKey: 0,
        hint: 'Attributing human emotions and moods to nature and external atmospheric elements.',
        explanation: 'Pathetic fallacy projects human emotions onto nature and weather, a classic convention used in Gothic novels to build psychological tension and foreboding.'
      },
      {
        id: 'ks3-eng-got-3',
        prompt: 'In Mary Shelley\'s classic 1818 Gothic novel "Frankenstein", what timeless archetype does Victor Frankenstein represent?',
        options: [
          'The tragic overreacher whose hubris leads him to transgress natural and divine laws',
          'A brave medieval knight fighting mythical dragons for gold',
          'An innocent pastoral shepherd content with a simple country life',
          'A comic servant who solves mysteries with common sense'
        ],
        answerKey: 0,
        hint: 'Victor tries to conquer death and create life without considering the moral consequences.',
        explanation: 'Victor Frankenstein is the classic Gothic overreacher whose scientific arrogance and desire for god-like power result in catastrophe and isolation.'
      },
      {
        id: 'ks3-eng-got-4',
        prompt: 'What German psychological concept (popularized by Sigmund Freud and used in Gothic analysis) describes something that is familiar yet strangely, terrifyingly foreign?',
        options: [
          'The Uncanny (Das Unheimliche)',
          'Zeitgeist',
          'Weltschmerz',
          'Bildungsroman'
        ],
        answerKey: 0,
        hint: 'Translates literally as "un-homely"; something that should have remained secret but has come to light.',
        explanation: 'The uncanny (das Unheimliche) describes the psychological terror provoked by things that are eerily familiar yet distorted or alien (such as wax figures, ghosts, or doppelgängers).'
      },
      {
        id: 'ks3-eng-got-5',
        prompt: 'In Robert Louis Stevenson\'s "The Strange Case of Dr Jekyll and Mr Hyde", what central Gothic theme is explored through the relationship between Jekyll and Hyde?',
        options: [
          'The duality of human nature and the dark, repressed impulses lurking beneath Victorian respectability',
          'The triumph of modern industrial machinery over traditional craftsmanship',
          'The importance of international maritime trade routes to the British Empire',
          'A romantic comedy celebrating rural family courtship'
        ],
        answerKey: 0,
        hint: 'One respectable public gentleman hiding a sinister, uninhibited alter ego.',
        explanation: 'Jekyll and Hyde embodies the Doppelgänger motif, exposing Victorian societal hypocrisy and the dual nature of man torn between moral duty and primitive desires.'
      },
      {
        id: 'ks3-eng-got-6',
        prompt: 'Which typical architectural and geographic settings are most emblematic of traditional Gothic fiction?',
        options: [
          'Isolated ruined medieval castles, subterranean vaults, decaying ancestral estates, and windswept moors',
          'Sunlit modern suburban shopping centres and cheerful amusement parks',
          'Clean, minimalist hospital laboratories with bright fluorescent lighting',
          'Busy international airport terminals during daytime rush hour'
        ],
        answerKey: 0,
        hint: 'Settings that evoke claustrophobia, past family sins, decay, and physical isolation.',
        explanation: 'Gothic fiction relies on settings of decay, isolation, and antiquity—ruined abbeys, castles, and labyrinths—which manifest psychological entrapment and ancestral guilt.'
      }
    ]
  },

  // ========================================================
  // KEY STAGE 4: GCSE Sciences, Mathematics, RE
  // ========================================================
  'ks4:chemistry:electrolysis': {
    topicId: 'electrolysis',
    title: 'Electrolysis & Electrolytes',
    keyStage: 'Key Stage 4',
    subject: 'Chemistry',
    coreAxiom: 'Electrolysis uses direct electrical current to decompose an ionic compound (electrolyte). Positively charged cations migrate to the negative cathode (gaining electrons: reduction); negatively charged anions migrate to the positive anode (losing electrons: oxidation).',
    cognitiveTrap: 'Mixing up cathode and anode charges, or forgetting OIL RIG (Oxidation Is Loss, Reduction Is Gain of electrons).',
    socraticPivot: 'Why can solid sodium chloride not undergo electrolysis, while molten or aqueous sodium chloride can?',
    hook: 'Did you know aluminium was once more valuable than gold until chemists invented industrial molten cryolite electrolysis?',
    guidedStep: 'Remember: PANIC (Positive Anode, Negative Is Cathode). Write half-equations at each electrode: reduction at cathode, oxidation at anode.',
    scaffoldHints: {
      level1: 'Ions must be free to move, so the ionic substance must be molten (melted) or dissolved in water (aqueous).',
      level2: 'Cathode = negative electrode. Attracts positive metal ions (+). Metal ions gain electrons (reduction).',
      level3: 'Anode = positive electrode. Attracts negative non-metal ions (-). Non-metal ions lose electrons (oxidation).'
    },
    questions: [
      {
        id: 'ks4-chem-elec-1',
        prompt: 'In the electrolysis of molten lead(II) bromide (PbBr₂), which half-equation accurately represents the reaction occurring at the negative cathode?',
        options: [
          'Pb²⁺ + 2e⁻ → Pb (reduction)',
          '2Br⁻ → Br₂ + 2e⁻ (oxidation)',
          'Pb → Pb²⁺ + 2e⁻ (oxidation)',
          'Br₂ + 2e⁻ → 2Br⁻ (reduction)'
        ],
        answerKey: 0,
        hint: 'Positively charged lead cations (Pb²⁺) are attracted to the negative cathode where they gain electrons (OIL RIG).',
        explanation: 'At the negative cathode, positive lead ions (Pb²⁺) gain 2 electrons each to form neutral lead metal atoms (reduction).'
      },
      {
        id: 'ks4-chem-elec-2',
        prompt: 'In the industrial extraction of aluminium metal by the electrolysis of aluminium oxide (Al₂O₃), why is powdered cryolite added to the mixture?',
        options: [
          'To lower the melting point from over 2,000°C to around 950°C, substantially saving electrical energy and costs',
          'To prevent the aluminium metal from reacting with atmospheric nitrogen',
          'To turn the cathode positive and the anode negative',
          'To bleach the colour of aluminium to make it silver'
        ],
        answerKey: 0,
        hint: 'Aluminium oxide has an extraordinarily high melting point; cryolite acts as a solvent.',
        explanation: 'Cryolite dissolves aluminium oxide at ~950°C instead of pure alumina\'s melting point of 2,072°C, drastically lowering the operating thermal energy costs.'
      },
      {
        id: 'ks4-chem-elec-3',
        prompt: 'During the electrolysis of aqueous sodium chloride (brine), which gas is discharged at the negative cathode and why?',
        options: [
          'Hydrogen gas (H₂), because hydrogen is less reactive than sodium in the electrochemical reactivity series',
          'Sodium metal (Na), because sodium ions are always discharged in preference to water',
          'Chlorine gas (Cl₂), because negative chloride ions are attracted to the cathode',
          'Oxygen gas (O₂), because water always reduces to oxygen at the cathode'
        ],
        answerKey: 0,
        hint: 'At the cathode in aqueous solution, the less reactive element (hydrogen vs sodium) is discharged.',
        explanation: 'In aqueous electrolysis, H⁺ ions from water are discharged rather than Na⁺ because hydrogen is lower in the reactivity series: 2H⁺ + 2e⁻ → H₂.'
      },
      {
        id: 'ks4-chem-elec-4',
        prompt: 'In the electrolysis of brine (aqueous NaCl), what useful chemical compound remains in solution after hydrogen and chlorine gases have evolved?',
        options: [
          'Sodium hydroxide solution (NaOH)',
          'Hydrochloric acid (HCl)',
          'Pure distilled water',
          'Sodium hypochlorite solid'
        ],
        answerKey: 0,
        hint: 'Remaining ions in solution are Na⁺ and OH⁻.',
        explanation: 'As H⁺ ions are reduced at the cathode and Cl⁻ ions are oxidised at the anode, Na⁺ and OH⁻ ions remain in solution, forming sodium hydroxide (NaOH).'
      },
      {
        id: 'ks4-chem-elec-5',
        prompt: 'Why do the positive graphite (carbon) anodes need to be replaced periodically during the Hall-Héroult electrolysis of aluminium oxide?',
        options: [
          'Hot oxygen gas discharged at the anode reacts with the graphite at 950°C to produce carbon dioxide (C + O₂ → CO₂), burning the anodes away',
          'The graphite anodes melt into liquid carbon and drain out of the cell',
          'Aluminium deposits directly onto the anodes and covers them with metal',
          'Electric current dissolves the copper wiring inside the carbon'
        ],
        answerKey: 0,
        hint: 'Carbon + Oxygen at high temperature burns into carbon dioxide gas.',
        explanation: 'Oxygen released at the positive anode reacts with the carbon blocks at operating temperatures around 950°C to form CO₂ gas, eroding the anodes over time.'
      },
      {
        id: 'ks4-chem-elec-6',
        prompt: 'In aqueous electrolysis, when a solution containing sulfate (SO₄²⁻) or nitrate (NO₃⁻) ions is electrolyzed, what product is formed at the positive anode?',
        options: [
          'Oxygen gas (O₂) and water, formed by the oxidation of hydroxide (OH⁻) ions from water',
          'Pure sulfur solid, formed by the reduction of sulfate ions',
          'Nitrogen dioxide gas, formed by thermal decomposition',
          'Hydrogen gas, formed by the oxidation of hydronium ions'
        ],
        answerKey: 0,
        hint: 'Halide ions are oxidised if present; otherwise, OH⁻ from water is oxidised to oxygen gas: 4OH⁻ → O₂ + 2H₂O + 4e⁻.',
        explanation: 'Unless halide ions (Cl⁻, Br⁻, I⁻) are present in high concentration, hydroxide ions from water are oxidised at the positive anode: 4OH⁻ → O₂ + 2H₂O + 4e⁻.'
      }
    ]
  },

  'ks4:biology:genetics-inheritance': {
    topicId: 'genetics-inheritance',
    title: 'Genetics and Inheritance',
    keyStage: 'Key Stage 4',
    subject: 'Biology',
    coreAxiom: 'Genotype determines phenotype through dominant and recessive alleles inherited from biological parents, represented using monohybrid Punnett square crosses.',
    cognitiveTrap: 'Assuming a 3:1 ratio in a monohybrid cross means exactly 3 out of 4 real offspring must display the dominant trait (it is a statistical probability).',
    socraticPivot: 'If two brown-eyed parents have a blue-eyed child, what must both parents\' genotypes be?',
    hook: 'Why can two completely healthy parents who have never been sick in their lives have a baby with cystic fibrosis?',
    guidedStep: 'Identify homozygous dominant (BB), heterozygous (Bb), and homozygous recessive (bb). Cross alleles in a 2x2 Punnett square.',
    scaffoldHints: {
      level1: 'Dominant alleles (capital letter) always express their phenotype even if only one copy is present (Bb or BB).',
      level2: 'Recessive alleles (lowercase letter) only express when two copies are present (bb).',
      level3: 'Crossing Bb x Bb gives probabilities: 25% BB, 50% Bb, 25% bb (3:1 dominant phenotype ratio).'
    },
    questions: [
      {
        id: 'ks4-bio-gen-1',
        prompt: 'Cystic fibrosis is caused by a recessive allele (f). If two heterozygous carrier parents (Ff x Ff) have a child, what is the probability that the child will have cystic fibrosis (ff)?',
        options: [
          '25% (1 in 4)',
          '50% (1 in 2)',
          '75% (3 in 4)',
          '0% (impossible for carriers)'
        ],
        answerKey: 0,
        hint: 'Construct a 2x2 Punnett square crossing F and f with F and f. Count how many boxes contain "ff".',
        explanation: 'A cross between two carriers (Ff x Ff) produces FF (25%), Ff (50%), and ff (25%). Only the homozygous recessive (ff) child has cystic fibrosis.'
      },
      {
        id: 'ks4-bio-gen-2',
        prompt: 'What biological term defines an organism that possesses two identical alleles for a particular gene (e.g. BB or bb)?',
        options: [
          'Homozygous',
          'Heterozygous',
          'Hemizygous',
          'Polygenic'
        ],
        answerKey: 0,
        hint: '"Homo-" means same; having two identical copies of an allele.',
        explanation: 'Homozygous describes having two matching alleles (either homozygous dominant BB or homozygous recessive bb), whereas heterozygous means having two different alleles (Bb).'
      },
      {
        id: 'ks4-bio-gen-3',
        prompt: 'Polydactyly (extra fingers or toes) is caused by an inherited dominant allele (D). If a heterozygous parent with polydactyly (Dd) has children with a partner with normal digits (dd), what is the probability of each child inheriting polydactyly?',
        options: [
          '50% (1 in 2)',
          '25% (1 in 4)',
          '75% (3 in 4)',
          '100% (all children)'
        ],
        answerKey: 0,
        hint: 'Cross Dd with dd: possible offspring genotypes are Dd, Dd, dd, dd.',
        explanation: 'A cross of Dd x dd yields 50% Dd (polydactyly phenotype) and 50% dd (normal phenotype).'
      },
      {
        id: 'ks4-bio-gen-4',
        prompt: 'How many total chromosomes are found in a healthy human diploid somatic body cell compared to a haploid gamete (egg or sperm cell)?',
        options: [
          '46 chromosomes (23 pairs) in somatic cells; 23 single chromosomes in gametes',
          '23 chromosomes in somatic cells; 46 in gametes',
          '92 chromosomes in somatic cells; 46 in gametes',
          '48 chromosomes in somatic cells; 24 in gametes'
        ],
        answerKey: 0,
        hint: 'Diploid (2n) = full complement; Haploid (n) = half complement produced by meiosis.',
        explanation: 'Human body cells are diploid with 46 chromosomes (23 homologous pairs). Meiosis halves this number to 23 single chromosomes in gametes (sperm and egg).'
      },
      {
        id: 'ks4-bio-gen-5',
        prompt: 'Which combination of sex chromosomes present in a human zygote typically results in biological female development?',
        options: [
          'XX',
          'XY',
          'YY',
          'XO'
        ],
        answerKey: 0,
        hint: 'Human females inherit one X from mother and one X from father.',
        explanation: 'Human biological females have two X chromosomes (XX); human biological males possess one X and one Y chromosome (XY).'
      },
      {
        id: 'ks4-bio-gen-6',
        prompt: 'What groundbreaking conclusion did Gregor Mendel establish from his 19th-century breeding experiments with garden pea plants?',
        options: [
          'Inheritance is governed by discrete, individual "units" (now called genes) that pass unaltered from parents to offspring according to predictable mathematical ratios',
          'Parental traits blend together like liquid paints and cannot be separated in later generations',
          'Acquired physical characteristics gained during a lifetime are inherited by offspring',
          'DNA is organized into a double helix structure with base pairs A-T and C-G'
        ],
        answerKey: 0,
        hint: 'Mendel proved that traits do not blend into a soup; they remain discrete units that segregate independently.',
        explanation: 'Mendel discovered particulate inheritance: that distinct units of inheritance (genes) are passed down from each parent and remain distinct across generations.'
      }
    ]
  },

  'ks4:religious-education-catholic:catholic-social-teaching': {
    topicId: 'catholic-social-teaching',
    title: 'Catholic Social Teaching & Human Dignity',
    keyStage: 'Key Stage 4',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'Catholic Social Teaching (CST) rests on foundational principles: the Sanctity of Life & Human Dignity (Imago Dei), the Common Good, Subsidiarity, Preferential Option for the Poor, and Stewardship of Creation (Laudato Si\').',
    cognitiveTrap: 'Confusing CST with mere secular charity or party political ideologies; CST is rooted in the Gospel and papal encyclicals (from Rerum Novarum to Fratelli Tutti).',
    socraticPivot: 'Why does human dignity, according to Catholic teaching, belong unconditionally to every human being from conception to natural death, regardless of their utility or abilities?',
    hook: 'Pope Francis wrote Laudato Si\' urging the world to hear "both the cry of the earth and the cry of the poor." How are they connected?',
    guidedStep: 'Analyze key CST principles and examine how agencies like CAFOD and Caritas apply them globally.',
    scaffoldHints: {
      level1: 'Imago Dei: Every person is created in the image and likeness of God, giving them infinite, inviolable dignity.',
      level2: 'Preferential Option for the Poor: Christ prioritised the vulnerable and marginalized; society must do the same.',
      level3: 'Stewardship (Laudato Si\'): Humanity must care for God\'s creation, protecting future generations and combating climate injustice.'
    },
    questions: [
      {
        id: 'ks4-re-cst-1',
        prompt: 'What is the foundational theological basis for human dignity in Catholic Social Teaching?',
        options: [
          'All human beings are created in the image and likeness of God (Imago Dei) and possess inherent, inviolable worth',
          'A person\'s worth is determined exclusively by their economic productivity and social status',
          'Human dignity is granted as a legal privilege by national governments and can be revoked at any time',
          'Only citizens with university degrees are endowed with moral dignity in the Church'
        ],
        answerKey: 0,
        hint: 'Genesis 1:26-27 establishes that God created mankind in His own divine image.',
        explanation: 'Because every human person is created in the image of God (Imago Dei), human dignity is universal, inalienable, and unconditional.'
      },
      {
        id: 'ks4-re-cst-2',
        prompt: 'What does the Catholic Social Teaching principle of "Subsidiarity" stipulate regarding governance and decision-making?',
        options: [
          'Social and political decisions should be made at the lowest, most local competent level possible, rather than being centralized by higher state authorities',
          'All decisions in a country must be made exclusively by the national prime minister without consulting local communities',
          'Charity should only be distributed through international global corporations',
          'Citizens should never participate in local school boards or parish councils'
        ],
        answerKey: 0,
        hint: 'Higher authorities should support ("subsidium") local communities without taking over functions they can handle themselves.',
        explanation: 'Subsidiarity protects human freedom and community initiative by stating that higher central bodies must not absorb responsibilities that local groups and families can resolve.'
      },
      {
        id: 'ks4-re-cst-3',
        prompt: 'What moral obligation does the "Preferential Option for the Poor" impose on Catholic social and economic policies?',
        options: [
          'Society and public policies must give priority attention to the needs, rights, and empowerment of the impoverished, sick, and marginalized',
          'Wealthy individuals should receive all tax relief before the poor receive any medical support',
          'Governments should ignore unemployment and focus solely on military spending',
          'The poor should be blamed for their own suffering without receiving social aid'
        ],
        answerKey: 0,
        hint: 'Christ consistently identified with the outcast, the hungry, and the stranger (Matthew 25).',
        explanation: 'Following the example of Jesus, the Church teaches that moral health is judged by how the most vulnerable members of society are treated and protected.'
      },
      {
        id: 'ks4-re-cst-4',
        prompt: 'In his landmark 2015 encyclical "Laudato Si\'", how does Pope Francis describe our relationship with planet Earth?',
        options: [
          'The Earth is our "Common Home" requiring integral ecology that listens to both the cry of the earth and the cry of the poor',
          'The Earth is an unlimited commercial resource to be exploited without moral restraint',
          'Environmental issues are purely political matters with zero moral or spiritual dimension',
          'Climate change affects only wealthy nations, so poor countries should ignore it'
        ],
        answerKey: 0,
        hint: 'Pope Francis subtitles the encyclical "On Care for Our Common Home".',
        explanation: 'Pope Francis emphasizes "integral ecology", connecting environmental degradation directly to global poverty and calling for responsible stewardship of our Common Home.'
      },
      {
        id: 'ks4-re-cst-5',
        prompt: 'Which historic 1891 papal encyclical by Pope Leo XIII is widely recognized as the foundation of modern Catholic Social Teaching?',
        options: [
          'Rerum Novarum ("Of Revolutionary Change")',
          'Pacem in Terris',
          'Evangelium Vitae',
          'Humanae Vitae'
        ],
        answerKey: 0,
        hint: 'Issued in response to the Industrial Revolution, addressing workers\' rights, fair living wages, and private property.',
        explanation: 'Leo XIII\'s Rerum Novarum defended the dignity of working people, the right to form trade unions, fair wages, and the duties of employers during industrial capitalism.'
      },
      {
        id: 'ks4-re-cst-6',
        prompt: 'How does the Catholic concept of the "Common Good" differ fundamentally from utilitarianism\'s "greatest good for the greatest number"?',
        options: [
          'The Common Good insists that societal conditions must allow every single individual and group to flourish, prohibiting the sacrifice of any vulnerable minority',
          'The Common Good encourages sacrificing the elderly to save state healthcare expenses',
          'The Common Good is strictly concerned with maximizing gross national product and corporate dividends',
          'The Common Good only applies to people living within the Vatican City walls'
        ],
        answerKey: 0,
        hint: 'In CST, the human dignity of every individual person cannot be trampled to benefit the majority.',
        explanation: 'Unlike utilitarianism which may sacrifice minorities for the majority\'s pleasure, the Catholic Common Good demands conditions enabling all people and each person to achieve fulfillment.'
      }
    ]
  },

  // ========================================================
  // MODERN FOREIGN LANGUAGES & LATIN ROOTS (KS2 - KS4)
  // ========================================================
  'ks2:mfl:french-basics': {
    topicId: 'french-basics',
    title: 'French: Greetings, Family & Gender of Nouns',
    keyStage: 'Key Stage 2',
    subject: 'Modern Foreign Languages & Latin',
    coreAxiom: 'Every French noun has a grammatical gender: masculine (marked by "le" or "un") or feminine (marked by "la" or "une"). Many English and French words share common origins (cognates), but false friends (faux amis) carry different meanings.',
    cognitiveTrap: 'Assuming that inanimate objects have no gender like in English "it", or assuming words that sound like English words have identical meanings (e.g., confusing "la librairie" with library).',
    socraticPivot: 'Why do French speakers say "la table" and "le stylo", and how can we tell whether an article is masculine or feminine?',
    hook: 'Did you know that over 30% of modern English words were borrowed directly from French after the Norman Conquest in 1066?',
    guidedStep: 'Identify the gender marker (un/une, le/la) before the noun. Watch out for cognates that trick English speakers.',
    scaffoldHints: {
      level1: 'Look at the little word in front of the noun: "le" and "un" are masculine; "la" and "une" are feminine.',
      level2: 'In French, all nouns have gender. Adjectives change their endings to agree with the noun (e.g. un chat noir, une chatte noire).',
      level3: 'Beware of "faux amis" (false friends): "la librairie" is a shop that sells books (bookshop); "la bibliothèque" is where you borrow books (library).'
    },
    questions: [
      {
        id: 'ks2-mfl-fr-1',
        prompt: 'In French, which definite article correctly completes: "____ maison est grande" (The house is big)?',
        options: [
          'La (because "maison" is a feminine noun)',
          'Le (because houses are inanimate objects)',
          'Les (because "grande" is plural)',
          'Des (because it is an indefinite building)'
        ],
        answerKey: 0,
        hint: '"Maison" takes the feminine article in French.',
        explanation: 'In French, "maison" is feminine, so the singular definite article is "la" (La maison).'
      },
      {
        id: 'ks2-mfl-fr-2',
        prompt: 'Sophie wants to borrow a book for free for school. Her French penpal tells her: "Ne va pas à la librairie, va à la bibliothèque!" Why?',
        options: [
          'Because "la librairie" is a bookshop where you must buy books, whereas "la bibliothèque" is the free public library',
          'Because "la librairie" only sells newspapers and food',
          'Because "la bibliothèque" is closed on weekends',
          'Because "la librairie" is an English word that does not exist in France'
        ],
        answerKey: 0,
        hint: 'This is a classic "false friend" (faux ami) between French and English.',
        explanation: '"La librairie" is a classic false cognate: it means bookshop. The French word for library is "la bibliothèque".'
      },
      {
        id: 'ks2-mfl-fr-3',
        prompt: 'Which standard French greeting is universally used to say "Good morning" or "Hello" politely during daytime?',
        options: [
          'Bonjour',
          'Bonsoir',
          'Bonne nuit',
          'Au revoir'
        ],
        answerKey: 0,
        hint: 'Comes from "bon" (good) + "jour" (day).',
        explanation: '"Bonjour" literally means "good day" and is the standard greeting used from morning until late afternoon.'
      },
      {
        id: 'ks2-mfl-fr-4',
        prompt: 'Which French noun phrase correctly translates "the brother"?',
        options: [
          'Le frère',
          'La soeur',
          'Le père',
          'La mère'
        ],
        answerKey: 0,
        hint: 'Brother is masculine, using the masculine article "le".',
        explanation: '"Le frère" is the brother; "la soeur" is the sister.'
      },
      {
        id: 'ks2-mfl-fr-5',
        prompt: 'What happens to the singular French definite articles "le" or "la" when the following noun begins with a vowel or silent h (such as "école" or "ami")?',
        options: [
          'They elide (shorten) into "l\'" with an apostrophe: "l\'école", "l\'ami"',
          'They change into "les"',
          'They become "une"',
          'They disappear completely with no article'
        ],
        answerKey: 0,
        hint: 'French prevents awkward vowel clashes by dropping the vowel: "l\'homme", "l\'arbre".',
        explanation: 'In French, "le" or "la" drops the vowel before a noun starting with a vowel sound, contracting into "l\'" (l\'école, l\'arbre, l\'hôtel).'
      },
      {
        id: 'ks2-mfl-fr-6',
        prompt: 'If an English student reads the French sentence "Actuellement, il habite à Paris", what does "actuellement" mean?',
        options: [
          'Currently / at present (a classic false friend)',
          'Actually / in reality',
          'Accidentally',
          'Actively'
        ],
        answerKey: 0,
        hint: 'In French, "actuellement" refers to present time, not "actually". "Actually" is translated as "en fait".',
        explanation: '"Actuellement" is a classic false cognate meaning "currently" or "at present". To say "actually" in French, one says "en fait" or "en réalité".'
      }
    ]
  },

  'ks2:mfl:spanish-basics': {
    topicId: 'spanish-basics',
    title: 'Spanish: Phonics, Numbers & Animals',
    keyStage: 'Key Stage 2',
    subject: 'Modern Foreign Languages & Latin',
    coreAxiom: 'Spanish is a phonetic, pro-drop language where verb endings show who is doing the action (e.g., "tengo" = I have). Noun and adjective endings must agree in gender (-o/-a) and number (-s/-es). Age is expressed with the verb "tener" (to have), not "ser" (to be).',
    cognitiveTrap: 'Translating English idioms literally word-for-word, such as saying "Yo soy diez años" (I am 10 years) instead of "Tengo diez años" (I have 10 years).',
    socraticPivot: 'Why does a Spanish speaker say they "have" years rather than they "are" years old?',
    hook: 'If you learn how Spanish vowels (A, E, I, O, U) sound once, you can pronounce almost every Spanish word correctly!',
    guidedStep: 'Listen for pure vowel sounds. Match adjective gender and number to the noun (el perro negro, las gatas negras). Express age using "tener".',
    scaffoldHints: {
      level1: 'In Spanish, you don\'t say "I am 10 years old". You say "I have 10 years" (Tengo diez años).',
      level2: 'Nouns ending in -o are usually masculine (el gato); nouns ending in -a are usually feminine (la gata).',
      level3: 'Adjectives come after the noun: "el perro negro" (the dog black).'
    },
    questions: [
      {
        id: 'ks2-mfl-es-1',
        prompt: 'A Spanish student introduces himself: "Hola, me llamo Carlos y ____ diez años." Which verb correctly fills the blank?',
        options: [
          'tengo (In Spanish, age is possessed using "tener")',
          'soy (Literal translation of "I am")',
          'estoy (Temporary state of being)',
          'hago (Literal translation of "I make")'
        ],
        answerKey: 0,
        hint: 'Think about whether Spanish uses "to have" or "to be" for age.',
        explanation: 'In Spanish, age is an accumulated possession, so speakers use the verb "tener" (Tengo diez años = I have ten years).'
      },
      {
        id: 'ks2-mfl-es-2',
        prompt: 'Which phrase correctly translates "the black cats" (feminine plural) in Spanish with correct agreement?',
        options: [
          'Las gatas negras',
          'Los gatos negra',
          'La gata negros',
          'El gato negras'
        ],
        answerKey: 0,
        hint: 'Every word (article, noun, adjective) must be feminine and plural.',
        explanation: 'In Spanish, article, noun, and adjective must all agree: "Las" (fem pl) + "gatas" (fem pl) + "negras" (fem pl).'
      },
      {
        id: 'ks2-mfl-es-3',
        prompt: 'In Spanish numbers, which number corresponds to "quince"?',
        options: [
          '15',
          '5',
          '50',
          '14'
        ],
        answerKey: 0,
        hint: 'Count past diez, once, doce, trece, catorce...',
        explanation: 'In Spanish counting: once (11), doce (12), trece (13), catorce (14), quince (15).'
      },
      {
        id: 'ks2-mfl-es-4',
        prompt: 'Which Spanish noun phrase correctly means "the dog" in the singular masculine form?',
        options: [
          'El perro',
          'El gato',
          'El caballo',
          'El pájaro'
        ],
        answerKey: 0,
        hint: 'Perro = dog; gato = cat; caballo = horse; pájaro = bird.',
        explanation: '"El perro" is the dog in Spanish ("perra" for female dog).'
      },
      {
        id: 'ks2-mfl-es-5',
        prompt: 'How is the double "ll" pronounced in Spanish in everyday words like "me llamo" or "pollo"?',
        options: [
          'Like an English /y/ sound (as in "yes" or "yellow")',
          'Like a hard English /l/ sound (as in "bell")',
          'Like a silent letter that is never pronounced',
          'Like an English /k/ sound'
        ],
        answerKey: 0,
        hint: '"Me llamo" sounds like "meh yah-moh".',
        explanation: 'In standard Spanish phonetics, "ll" is pronounced like /j/ (similar to English "y" in "yellow").'
      },
      {
        id: 'ks2-mfl-es-6',
        prompt: 'How do you say "Thank you very much" politely in Spanish?',
        options: [
          'Muchas gracias',
          'De nada',
          'Por favor',
          'Mucho gusto'
        ],
        answerKey: 0,
        hint: '"Gracias" means thanks; "muchas" means many.',
        explanation: '"Muchas gracias" is the courteous Spanish expression for "Thank you very much" (to which one replies "De nada").'
      }
    ]
  },

  'ks2:mfl:latin-roots': {
    topicId: 'latin-roots',
    title: 'Latin Roots & English Derivatives',
    keyStage: 'Key Stage 2',
    subject: 'Modern Foreign Languages & Latin',
    coreAxiom: 'Latin is the mother tongue of the Romance languages (Spanish, French, Italian, Portuguese) and the root of over 60% of academic English vocabulary. Root morphemes (e.g., "cred" = believe, "aqua" = water, "port" = carry, "scrib/script" = write) unlock the definitions of advanced words.',
    cognitiveTrap: 'Treating complex English vocabulary words as isolated strings of letters rather than decoding them into root morphemes, prefixes, and suffixes.',
    socraticPivot: 'How does knowing that the Latin word "Credo" means "I believe" help you understand words like "incredible", "credible", "credit", and "creed"?',
    hook: 'Every time you say "auditorium", "aquarium", "transport", or "manufacture", you are speaking ancient Latin with an English accent!',
    guidedStep: 'Break complex words into Prefix + Latin Root + Suffix. Use the root meaning to deduce the scientific or literary definition.',
    scaffoldHints: {
      level1: 'Latin root "portare" means to carry: transport = carry across, portable = able to be carried.',
      level2: 'Latin root "credere" means to believe: incredible = not able to be believed.',
      level3: 'Latin root "scribere/scriptum" means to write: manuscript = written by hand, describe = write down.'
    },
    questions: [
      {
        id: 'ks2-mfl-lat-1',
        prompt: 'The Latin root "cred" means "to believe". Based on this root, what does the word "incredible" literally mean?',
        options: [
          'Not able to be believed because it is so extraordinary (in- = not + cred = believe + -ible = able)',
          'Something that was written down in a sacred ancient book',
          'A person who carries heavy boxes across long distances',
          'An underwater creature that lives in an ocean habitat'
        ],
        answerKey: 0,
        hint: 'Break it into parts: prefix "in-" (not) + root "cred" (believe) + suffix "-ible" (able).',
        explanation: 'From Latin "in-" (not) + "credere" (to believe) + "-ibilis" (able), "incredible" literally means unable to be believed.'
      },
      {
        id: 'ks2-mfl-lat-2',
        prompt: 'In Catholic prayer, the statement of foundational Christian beliefs begins with the word "Creed" (from Latin "Credo"). What does "Credo" mean?',
        options: [
          '"I believe" (affirming trust in God Father, Son, and Holy Spirit)',
          '"We sing together in harmony"',
          '"The holy book of ancient laws"',
          '"Peace be with all people on earth"'
        ],
        answerKey: 0,
        hint: '"Credo" is Latin for the first-person declaration of faith.',
        explanation: '"Credo" is Latin for "I believe", which is why the profession of Christian faith (Apostles\' and Nicene Creed) bears this name.'
      },
      {
        id: 'ks2-mfl-lat-3',
        prompt: 'The Latin root "port" (from "portare") means "to carry". What does the adjective "portable" describe?',
        options: [
          'Easily carried or moved by a person from place to place',
          'Made of transparent liquid glass',
          'Able to speak multiple foreign languages',
          'Extremely heavy and permanently anchored into solid stone'
        ],
        answerKey: 0,
        hint: '"Port" (carry) + "-able" (able to be).',
        explanation: 'From "portare" (to carry), "portable" means able to be carried or transported conveniently.'
      },
      {
        id: 'ks2-mfl-lat-4',
        prompt: 'The Latin word "aqua" means "water". What is an "aquarium"?',
        options: [
          'A water-filled glass tank or building where aquatic creatures and plants are kept and displayed',
          'A dry desert canyon where it never rains',
          'A musical instrument with brass valves and strings',
          'A high stone tower used to look at distant stars'
        ],
        answerKey: 0,
        hint: '"Aqua" = water; suffix "-arium" indicates a place or container for something.',
        explanation: 'From Latin "aqua" (water) + "-arium" (a place for), an aquarium is an artificial aquatic habitat for fish.'
      },
      {
        id: 'ks2-mfl-lat-5',
        prompt: 'The Latin root "scrib / script" means "to write" and "manus" means "hand". What is a "manuscript"?',
        options: [
          'A document, book, or piece of music written by hand before modern printing existed',
          'A mechanical steam engine designed to lift mining carts',
          'A protective leather shield worn by Roman soldiers',
          'A medicinal plant used to heal cuts and wounds'
        ],
        answerKey: 0,
        hint: '"Manus" (hand) + "scriptum" (written).',
        explanation: 'A manuscript is literally a text written by hand ("manu scriptus"), particularly medieval illuminated texts created by monks.'
      },
      {
        id: 'ks2-mfl-lat-6',
        prompt: 'The Latin root "aud" (from "audire") means "to hear". What is the primary purpose of an "auditorium"?',
        options: [
          'A hall or large room designed for an audience to gather and listen to performances, speeches, or music',
          'A swimming pool built for Olympic water racing',
          'A botanical greenhouse where exotic fruit trees grow',
          'A laboratory where chemical compounds are tested'
        ],
        answerKey: 0,
        hint: '"Audire" (to hear) + "-orium" (a place for). Related to "audio" and "audience".',
        explanation: 'From Latin "audire" (to hear), an auditorium is an acoustic hall engineered specifically for an audience to listen.'
      }
    ]
  },

  'ks3:mfl:french-present-routine': {
    topicId: 'french-present-routine',
    title: 'French: Present Tense & Daily Routine',
    keyStage: 'Key Stage 3',
    subject: 'Modern Foreign Languages',
    coreAxiom: 'Describing daily routines in French requires reflexive verbs (verbes pronominaux) such as "se réveiller" (to wake up) and "se doucher" (to shower). The reflexive pronoun (me, te, se, nous, vous, se) must be placed directly BEFORE the conjugated verb in the present tense.',
    cognitiveTrap: 'Applying English word order by placing the pronoun after the verb (e.g., writing "Je réveille me" or omitting the reflexive pronoun altogether: "Je lève à 7h").',
    socraticPivot: 'Why does French require "je ME réveille" (I wake MYSELF) when English just says "I wake up"?',
    hook: 'In French, you don\'t just brush teeth—you brush *to yourself* the teeth: "Je me brosse les dents"!',
    guidedStep: 'Match the subject to its reflexive pronoun: Je -> me, Tu -> te, Il/Elle -> se, Nous -> nous, Vous -> vous, Ils/Elles -> se. Conjugate regular -er verb endings (-e, -es, -e, -ons, -ez, -ent).',
    scaffoldHints: {
      level1: 'Reflexive pronouns: Je me, Tu te, Il/Elle se, Nous nous, Vous vous, Ils/Elles se.',
      level2: 'The pronoun sits directly in front of the verb: "Je me lève" (I get up).',
      level3: 'Before a vowel or silent h, "me/te/se" elide to "m\'/t\'/s\'": "Je m\'habille" (I get dressed).'
    },
    questions: [
      {
        id: 'ks3-mfl-fr-rout-1',
        prompt: 'Which sentence correctly expresses "I wake up at seven o\'clock" in French with proper reflexive syntax?',
        options: [
          'Je me réveille à sept heures',
          'Je réveille me à sept heures',
          'Je réveille à sept heures',
          'Me réveille je à sept heures'
        ],
        answerKey: 0,
        hint: 'The reflexive pronoun "me" must stand directly before the conjugated verb "réveille".',
        explanation: 'In French present tense, reflexive pronouns precede the conjugated verb: "Je me réveille à sept heures".'
      },
      {
        id: 'ks3-mfl-fr-rout-2',
        prompt: 'Which reflexive pronoun correctly completes the sentence: "Nous ____ couchons à dix heures du soir" (We go to bed at 10 PM)?',
        options: [
          'nous ("Nous nous couchons")',
          'vous',
          'se',
          'me'
        ],
        answerKey: 0,
        hint: 'The reflexive pronoun for the subject pronoun "nous" is also "nous".',
        explanation: 'For the first person plural "nous", the reflexive pronoun is "nous", resulting in the double form: "Nous nous couchons".'
      },
      {
        id: 'ks3-mfl-fr-rout-3',
        prompt: 'How do you correctly say "I brush my teeth" in French using the reflexive verb "se brosser"?',
        options: [
          'Je me brosse les dents',
          'Je brosse mes dents',
          'Je me brosse mes dents',
          'Moi brosse les dents'
        ],
        answerKey: 0,
        hint: 'In French reflexive body part expressions, use "le/la/les", not possessive adjectives: "Je me brosse les dents".',
        explanation: 'French uses reflexive pronouns with definite articles for body parts: "Je me brosse les dents" (literally, "I brush to myself the teeth").'
      },
      {
        id: 'ks3-mfl-fr-rout-4',
        prompt: 'How does the reflexive pronoun "se" behave before a vowel sound in "Elle s\'habille" (She gets dressed)?',
        options: [
          'It elides to "s\'" before the silent \'h\' of "habiller"',
          'It stays "se" without elision',
          'It changes to "sa"',
          'It moves behind the verb'
        ],
        answerKey: 0,
        hint: 'Silent \'h\' and vowels trigger elision with an apostrophe in French.',
        explanation: '"Me", "te", and "se" elide to "m\'", "t\'", and "s\'" before vowels and silent h: "Elle s\'habille".'
      },
      {
        id: 'ks3-mfl-fr-rout-5',
        prompt: 'How is a reflexive verb made negative in the present tense, such as "I do not get up early"?',
        options: [
          'Je ne me lève pas tôt ("ne ... pas" surrounds both the reflexive pronoun and conjugated verb)',
          'Je me ne lève pas tôt',
          'Je lève me pas tôt',
          'Je pas me lève tôt'
        ],
        answerKey: 0,
        hint: '"Ne" comes before the pronoun; "pas" comes after the verb.',
        explanation: 'Negative brackets "ne ... pas" enclose the reflexive pronoun and conjugated verb together: "Je ne me lève pas tôt".'
      },
      {
        id: 'ks3-mfl-fr-rout-6',
        prompt: 'Which reflexive French verb means "to hurry up" when you are late for school?',
        options: [
          'Se dépêcher (e.g. "Dépêche-toi!")',
          'Se promener',
          'Se reposer',
          'Se coucher'
        ],
        answerKey: 0,
        hint: 'Think of the imperative "Dépêche-toi!" (Hurry up!).',
        explanation: '"Se dépêcher" means to hurry up; "se promener" is to go for a walk, "se reposer" is to rest.'
      }
    ]
  },

  'ks3:mfl:french-passe-compose': {
    topicId: 'french-passe-compose',
    title: 'French: Passé Composé with Avoir & Être',
    keyStage: 'Key Stage 3',
    subject: 'Modern Foreign Languages',
    coreAxiom: 'The Passé Composé narrates completed past actions. Most verbs take "avoir" as the auxiliary (J\'ai mangé), but 16 specific movement/state-change verbs (DR & MRS VANDERTRAMP) plus all reflexive verbs require "être" and their past participles MUST agree in gender (-e) and number (-s) with the subject.',
    cognitiveTrap: 'Using "avoir" for verbs of movement (e.g. "J\'ai allé au cinéma" instead of "Je suis allé(e) au cinéma") and forgetting to add "-e" or "-s" for feminine or plural subjects with "être".',
    socraticPivot: 'If Marie says "Je suis allée", why did she add an extra "e" at the end of the participle?',
    hook: 'The mnemonic DR & MRS VANDERTRAMP remembers the 16 elite French verbs that use "être" in the past tense!',
    guidedStep: 'Step 1: Choose auxiliary (avoir for most verbs, être for DR & MRS VANDERTRAMP + reflexives). Step 2: Form past participle (-er -> -é, -ir -> -i, -re -> -u). Step 3: If using être, add agreement.',
    scaffoldHints: {
      level1: 'DR & MRS VANDERTRAMP: Devenir, Revenir, Monter, Rester, Sortir, Venir, Aller, Naître, Descendre, Entrer, Rentrer, Tomber, Retourner, Arriver, Mourir, Partir.',
      level2: 'With "être", the participle acts like an adjective: "Elle est allée" (add -e for feminine), "Ils sont allés" (add -s for plural).',
      level3: 'With "avoir", the past participle does NOT agree with the subject: "Elle a mangé une pomme".'
    },
    questions: [
      {
        id: 'ks3-mfl-fr-pass-1',
        prompt: 'Claire is writing in her diary about yesterday: "Hier, je ____ au parc." Which option correctly completes her sentence using the verb "aller"?',
        options: [
          'suis allée (Uses "être" because "aller" is a movement verb, with "-e" for feminine Claire)',
          'ai allé (Uses "avoir" without agreement)',
          'suis allé (Uses "être" but forgets feminine agreement for Claire)',
          'ai allée (Confuses auxiliary "avoir" with agreement)'
        ],
        answerKey: 0,
        hint: '"Aller" is in DR & MRS VANDERTRAMP, so it takes "être" and agrees with feminine subject Claire.',
        explanation: '"Aller" takes the auxiliary "être" (Je suis) and Claire is feminine singular, so the participle takes an extra "-e" (allée).'
      },
      {
        id: 'ks3-mfl-fr-pass-2',
        prompt: 'Which option correctly translates "We ate a pizza yesterday" into French?',
        options: [
          'Hier, nous avons mangé une pizza',
          'Hier, nous sommes mangé une pizza',
          'Hier, nous avons mangés une pizza',
          'Hier, nous sommes mangeant une pizza'
        ],
        answerKey: 0,
        hint: '"Manger" is a normal non-movement verb and uses the auxiliary "avoir" without subject agreement.',
        explanation: 'Regular verbs like "manger" take "avoir" (nous avons) and a regular past participle ending in -é (mangé).'
      },
      {
        id: 'ks3-mfl-fr-pass-3',
        prompt: 'In the sentence "Mes soeurs sont arrivées à l\'école", why is the past participle spelled "arrivées" with both an "e" and an "s"?',
        options: [
          'Because "arriver" uses the auxiliary "être", so the participle must agree with the feminine plural subject "Mes soeurs"',
          'Because all French past participles must end in -ées',
          'Because the school building is feminine',
          'Because the sentence is in the future tense'
        ],
        answerKey: 0,
        hint: 'With "être", add -e for feminine and -s for plural: feminine plural = -ées.',
        explanation: 'With auxiliary "être", the participle behaves like an adjective and agrees with the subject: "Mes soeurs" is feminine plural, adding "-e" (fem) and "-s" (plural).'
      },
      {
        id: 'ks3-mfl-fr-pass-4',
        prompt: 'What is the irregular past participle of the common French verb "faire" (to do / make) in "J\'ai ____ mes devoirs"?',
        options: [
          'fait',
          'faisé',
          'faision',
          'fart'
        ],
        answerKey: 0,
        hint: 'Irregular past participle ending in -t: "J\'ai fait".',
        explanation: 'The past participle of "faire" is irregular: "fait" (e.g. J\'ai fait mes devoirs = I did my homework).'
      },
      {
        id: 'ks3-mfl-fr-pass-5',
        prompt: 'What is the irregular past participle of the verb "prendre" (to take) in "Il a ____ le bus"?',
        options: [
          'pris',
          'prendu',
          'prené',
          'praint'
        ],
        answerKey: 0,
        hint: 'Similar to "compris" (understood); ends in -s.',
        explanation: 'The past participle of "prendre" is "pris" (Il a pris le bus = He took the bus).'
      },
      {
        id: 'ks3-mfl-fr-pass-6',
        prompt: 'In the DR & MRS VANDERTRAMP rule, which verb means "to fall", taking "être" in the passé composé?',
        options: [
          'Tomber (e.g. "Il est tombé")',
          'Tourner',
          'Travailler',
          'Trouver'
        ],
        answerKey: 0,
        hint: 'T in VANDERTRAMP: Tomber = to fall.',
        explanation: '"Tomber" (to fall) belongs to the 16 DR & MRS VANDERTRAMP verbs and uses "être": "Il est tombé dans l\'escalier".'
      }
    ]
  },

  'ks3:mfl:spanish-free-time': {
    topicId: 'spanish-free-time',
    title: 'Spanish: Free Time & Hobbies',
    keyStage: 'Key Stage 3',
    subject: 'Modern Foreign Languages',
    coreAxiom: 'The verb "gustar" (to like) functions differently than English: the liked object or activity is the grammatical subject. Use "me gusta" + singular noun or infinitive verb (Me gusta jugar), and "me gustan" + plural noun (Me gustan los deportes).',
    cognitiveTrap: 'Saying "Yo gusto el fútbol" by translating English "I like" directly, or using "me gusta" before plural nouns ("Me gusta los videojuegos").',
    socraticPivot: 'Why does Spanish say "Me gustan los libros" with an "n" at the end when talking about books, but "Me gusta el libro" for one book?',
    hook: 'In Spanish, you don\'t like things; things are pleasing *to you*!',
    guidedStep: 'Determine if what follows is singular or plural. Singular or infinitive = "me gusta". Plural = "me gustan". Precede with indirect object pronoun (me, te, le, nos, os, les).',
    scaffoldHints: {
      level1: 'Me gusta + 1 thing or verb: "Me gusta bailar", "Me gusta la música".',
      level2: 'Me gustan + plural things: "Me gustan las películas", "Me gustan los deportes".',
      level3: 'Never say "Yo gusto". The pronouns are: Me gusta(n), Te gusta(n), Le gusta(n), Nos gusta(n).'
    },
    questions: [
      {
        id: 'ks3-mfl-es-free-1',
        prompt: 'Which Spanish sentence correctly translates: "I like video games" (los videojuegos)?',
        options: [
          'Me gustan los videojuegos (Uses "gustan" because "videojuegos" is plural)',
          'Me gusta los videojuegos (Fails plural agreement)',
          'Yo gusto los videojuegos (Incorrect literal translation from English)',
          'Me gusto los videojuegos (Incorrect verb conjugation)'
        ],
        answerKey: 0,
        hint: '"Los videojuegos" is plural, so the verb must be plural.',
        explanation: 'Because "los videojuegos" is plural, the verb "gustar" must take the plural ending: "Me gustan los videojuegos".'
      },
      {
        id: 'ks3-mfl-es-free-2',
        prompt: 'How do you say "We like to read books" in Spanish?',
        options: [
          'Nos gusta leer libros (Uses "gusta" because the grammatical subject is the singular infinitive verb "leer")',
          'Nos gustan leer libros (Incorrectly makes verb plural before an infinitive)',
          'Nosotros gustamos leer libros (Literal error)',
          'Nos gustamos los libros (Reflexive mistake)'
        ],
        answerKey: 0,
        hint: 'When "gustar" is followed by an infinitive action verb, always use the singular form "gusta".',
        explanation: 'Infinitive verbs acting as subjects take the singular verb form: "Nos gusta leer libros" (Reading books pleases us).'
      },
      {
        id: 'ks3-mfl-es-free-3',
        prompt: 'Which Spanish phrase translates "I play football" in the present tense?',
        options: [
          'Juego al fútbol',
          'Hago el fútbol',
          'Toco el fútbol',
          'Juegas el fútbol'
        ],
        answerKey: 0,
        hint: 'Sport ball games use "jugar a + definite article": juego al fútbol.',
        explanation: 'In Spanish, sports involving balls or teams use "jugar a + el" = "jugar al" (Juego al fútbol).'
      },
      {
        id: 'ks3-mfl-es-free-4',
        prompt: 'Which verb is typically paired with non-team athletic activities like swimming ("natación") or gymnastics ("gimnasia")?',
        options: [
          'Hacer (e.g. "Hago natación", "Hago gimnasia")',
          'Jugar',
          'Tocar',
          'Mirar'
        ],
        answerKey: 0,
        hint: '"Hacer" means to do / practice.',
        explanation: 'Individual sports without balls use the verb "hacer": "Hago natación" (I do swimming), "Hago ciclismo" (I do cycling).'
      },
      {
        id: 'ks3-mfl-es-free-5',
        prompt: 'How do you ask a friend informally: "Do you like pop music?" in Spanish?',
        options: [
          '¿Te gusta la música pop?',
          '¿Te gustan la música pop?',
          '¿Tú gustas la música pop?',
          '¿Le gusta tú música pop?'
        ],
        answerKey: 0,
        hint: 'Use the informal 2nd-person indirect pronoun "te".',
        explanation: 'To ask an informal friend ("tú"), the indirect object pronoun is "te": "¿Te gusta la música pop?".'
      },
      {
        id: 'ks3-mfl-es-free-6',
        prompt: 'Which Spanish verb means "to hate" when expressing strong dislike for an activity (e.g. "I hate doing homework")?',
        options: [
          'Odiar ("Odio hacer los deberes")',
          'Encantar',
          'Preferir',
          'Esperar'
        ],
        answerKey: 0,
        hint: '"Odio" comes from "odiar" (to hate).',
        explanation: '"Odiar" conjugates like a regular verb: "Odio hacer los deberes" (I hate doing homework).'
      }
    ]
  },

  'ks3:mfl:spanish-ser-estar': {
    topicId: 'spanish-ser-estar',
    title: 'Spanish: Ser vs Estar & Adjective Agreement',
    keyStage: 'Key Stage 3',
    subject: 'Modern Foreign Languages',
    coreAxiom: 'Spanish has two distinct verbs for "to be": "SER" is used for permanent characteristics, identity, origin, time, and occupation (DOCTOR mnemonic); "ESTAR" is used for temporary states, physical locations, and changing emotions (PLACE mnemonic). Some adjectives change meaning completely depending on whether they are paired with Ser or Estar.',
    cognitiveTrap: 'Using "ser" to describe current location or temporary feelings (e.g. saying "Soy en Madrid" or "Soy triste"), or confusing "ser aburrido" (to be boring) with "estar aburrido" (to be bored).',
    socraticPivot: 'What is the dramatic difference in meaning between "El profesor es aburrido" and "El profesor está aburrido"?',
    hook: 'If you tell someone "Eres aburrido" you are insulting their personality (you are boring); if you say "Estás aburrido", you are just asking if they are bored right now!',
    guidedStep: 'Apply DOCTOR (Description, Occupation, Characteristic, Time, Origin, Relationship) for SER. Apply PLACE (Position, Location, Action, Condition, Emotion) for ESTAR.',
    scaffoldHints: {
      level1: 'SER = who/what you are permanently (Soy estudiante, Madrid es grande). ESTAR = how/where you are right now (Estoy cansado, Estoy en el aula).',
      level2: 'Adjectives with dual meaning: "Ser listo" = to be clever; "Estar listo" = to be ready.',
      level3: '"Ser rico" = to be wealthy; "Estar rico" = delicious (tasting good right now).'
    },
    questions: [
      {
        id: 'ks3-mfl-es-ser-1',
        prompt: 'Elena wants to say that she is ready to leave for school. Which Spanish sentence must she use?',
        options: [
          'Estoy lista (Uses "estar" for a temporary state of readiness)',
          'Soy lista (Means "I am clever/smart", a permanent trait with "ser")',
          'Estoy listo (Fails gender agreement for Elena)',
          'Soy listo (Fails both verb choice and gender agreement)'
        ],
        answerKey: 0,
        hint: 'Readiness is a temporary condition (PLACE mnemonic), so use "estar" with feminine agreement "-a".',
        explanation: '"Estar lista" means to be ready (temporary state). "Ser lista" means to be clever/brainy (permanent characteristic).'
      },
      {
        id: 'ks3-mfl-es-ser-2',
        prompt: 'Which verb correctly completes: "La Sagrada Familia ____ en Barcelona" (The Sagrada Familia is in Barcelona)?',
        options: [
          'está (Locations always take "estar", even for permanent monuments)',
          'es (Mistakenly used because the building cannot move)',
          'hay (Means "there is/are", not "is located")',
          'tiene (Means "to have")'
        ],
        answerKey: 0,
        hint: 'Physical location on a map always uses the verb "estar" (PLACE mnemonic).',
        explanation: 'Geographic and physical location always requires "estar", regardless of whether the building is permanent (La Sagrada Familia está en Barcelona).'
      },
      {
        id: 'ks3-mfl-es-ser-3',
        prompt: 'Which sentence correctly expresses "I am tired today" in Spanish?',
        options: [
          'Hoy estoy cansado / cansada (Tiredness is a temporary physical condition requiring "estar")',
          'Hoy soy cansado / cansada (Incorrectly uses "ser" for a temporary state)',
          'Hoy tengo cansado (Uses "tener" incorrectly)',
          'Hoy hago cansado (Uses "hacer" incorrectly)'
        ],
        answerKey: 0,
        hint: 'Tiredness is a temporary feeling/condition (PLACE: Condition).',
        explanation: 'Temporary physical states and emotions use "estar": "Estoy cansado/a".'
      },
      {
        id: 'ks3-mfl-es-ser-4',
        prompt: 'Which verb is used in Spanish to describe someone\'s permanent profession or job: "Mi madre ____ médica" (My mother is a doctor)?',
        options: [
          'es (Occupations always use "ser" under the DOCTOR mnemonic)',
          'está (Mistakenly treated as a temporary daily location)',
          'tiene (Means "to have")',
          'hace (Means "she does")'
        ],
        answerKey: 0,
        hint: 'Remember DOCTOR: Description, Occupation, Characteristic, Time, Origin, Relationship.',
        explanation: 'Professions and occupations always take "ser": "Mi madre es médica".'
      },
      {
        id: 'ks3-mfl-es-ser-5',
        prompt: 'What does the adjective "rico" mean when paired with "ESTAR" ("La paella está muy rica") versus "SER" ("Carlos es muy rico")?',
        options: [
          'With "estar" it means delicious to taste right now; with "ser" it means financially wealthy',
          'With "estar" it means wealthy; with "ser" it means delicious',
          'Both mean spicy with chili peppers',
          'Both mean extremely ancient'
        ],
        answerKey: 0,
        hint: '"Estar rico" applies to food tasting good right now.',
        explanation: '"Estar rico" means delicious (temporary taste condition); "ser rico" means wealthy/rich (permanent financial state).'
      },
      {
        id: 'ks3-mfl-es-ser-6',
        prompt: 'Which verb is used to tell the time in Spanish: "____ las tres y media" (It is half past three)?',
        options: [
          'Son (From "ser", because time expressions use "ser")',
          'Están',
          'Tienen',
          'Hacen'
        ],
        answerKey: 0,
        hint: 'Time uses "Es la una" (singular for 1 o\'clock) and "Son las..." (plural for 2-12).',
        explanation: 'Telling time is an application of "ser": "Es la una" (1:00) or "Son las tres y media" (3:30).'
      }
    ]
  },

  'ks4:mfl:spanish-past-future': {
    topicId: 'spanish-past-future',
    title: 'Spanish: Preterite vs Imperfect & Future',
    keyStage: 'Key Stage 4',
    subject: 'Modern Foreign Languages (GCSE)',
    coreAxiom: 'In GCSE Spanish, the past requires distinguishing between the PRETERITE (completed past events with specific start/end times: "Ayer visité...") and the IMPERFECT (ongoing past habits, descriptions, weather, and age: "Cuando era joven, jugaba..."). The immediate future uses "ir a + infinitive" (Voy a estudiar).',
    cognitiveTrap: 'Using the preterite for childhood descriptions or habits (e.g. saying "Cuando tuve 5 años" instead of "Cuando tenía 5 años").',
    socraticPivot: 'In the sentence "Mientras caminaba (Imperfect), vi un accidente (Preterite)", why are two different past tenses used in the same sentence?',
    hook: 'Think of the Imperfect as the background scenery in a film (setting the stage), and the Preterite as the sudden action that interrupts it!',
    guidedStep: 'Ask: Was it a habitual action/description (Imperfect -aba/-ía)? Or a single completed event at a specific moment (Preterite -é, -aste, -ó / -í, -iste, -ió)?',
    scaffoldHints: {
      level1: 'Imperfect keywords: Siempre (always), todos los días (every day), a menudo (often), cuando era joven (when I was young).',
      level2: 'Preterite keywords: Ayer (yesterday), anoche (last night), el año pasado (last year), de repente (suddenly).',
      level3: 'Interrupting actions: Ongoing background action is Imperfect; interrupting action is Preterite.'
    },
    questions: [
      {
        id: 'ks4-mfl-es-past-1',
        prompt: 'Which Spanish sentence correctly translates: "When I was younger, I used to swim every Saturday"?',
        options: [
          'Cuando era más joven, nadaba todos los sábados (Uses imperfect for habitual past action and description)',
          'Cuando fui más joven, nadé todos los sábados (Mistakenly uses preterite for a recurring habit)',
          'Cuando era más joven, nadé todos los sábados (Mixes imperfect description with preterite habit)',
          'Cuando estaba más joven, nado todos los sábados (Uses present tense and incorrect verb)'
        ],
        answerKey: 0,
        hint: '"Used to" indicates a recurring habit in the past, which requires the Imperfect tense.',
        explanation: 'Habitual repeated actions in the past ("used to swim") and age descriptions ("when I was younger") require the Imperfect tense ("era" and "nadaba").'
      },
      {
        id: 'ks4-mfl-es-past-2',
        prompt: 'Which preterite verb form correctly completes: "El sábado pasado, yo ____ con mis amigos en el centro comercial" (Last Saturday, I talked with my friends)?',
        options: [
          'hablé (Regular preterite 1st person singular ending for -ar verbs)',
          'hablaba (Imperfect ending for a continuous habit)',
          'hablo (Present tense)',
          'hablaré (Future tense)'
        ],
        answerKey: 0,
        hint: '"El sábado pasado" marks a completed action on a specific day; use the preterite -é ending.',
        explanation: 'For completed past actions at a specific time (el sábado pasado), regular -ar verbs take "-é" for "yo": "hablé".'
      },
      {
        id: 'ks4-mfl-es-past-3',
        prompt: 'How is the immediate "near future" (periphrastic future) constructed in Spanish to say "Tomorrow I am going to study"?',
        options: [
          'Mañana voy a estudiar (Formed using conjugated "ir" + "a" + infinitive verb)',
          'Mañana voy estudiar (Omits the preposition "a")',
          'Mañana estudié (Preterite past tense)',
          'Mañana estudio a voy (Incorrect word order)'
        ],
        answerKey: 0,
        hint: 'The structure is: [present of ir] + [a] + [infinitive].',
        explanation: 'The immediate future requires: ir (conjugated: voy) + a + infinitive (estudiar) = "Voy a estudiar".'
      },
      {
        id: 'ks4-mfl-es-past-4',
        prompt: 'In the sentence "Mientras yo cocinaba la cena, sonó el teléfono", why is "sonó" in the preterite tense while "cocinaba" is in the imperfect?',
        options: [
          'Cooking was the ongoing continuous background action (Imperfect), and the telephone ringing was a sudden interrupting event (Preterite)',
          'Because telephones can only be conjugated in the preterite',
          'Because cooking is always a habit that takes place over twenty years',
          'There is no grammatical difference; Spanish verbs are chosen randomly'
        ],
        answerKey: 0,
        hint: 'Think of background movie scenery (imperfect) interrupted by a sudden action (preterite).',
        explanation: 'The imperfect ("cocinaba") paints the ongoing background scene, while the preterite ("sonó") represents the single, completed interrupting event.'
      },
      {
        id: 'ks4-mfl-es-past-5',
        prompt: 'What is the irregular preterite form of the verb "hacer" (to do/make) for the subject "yo" (I did / made)?',
        options: [
          'hice',
          'hací',
          'hizo',
          'hacía'
        ],
        answerKey: 0,
        hint: 'Preterite of hacer: hice, hiciste, hizo, hicimos, hicisteis, hicieron.',
        explanation: 'The irregular preterite stem for "hacer" is "hic-", giving "yo hice" and "él/ella hizo".'
      },
      {
        id: 'ks4-mfl-es-past-6',
        prompt: 'In the simple future tense in Spanish (e.g. "hablaremos", "comeremos"), which ending is added to the infinitive for "nosotros" (we)?',
        options: [
          '-emos (added directly to the full infinitive, e.g. hablaremos)',
          '-amos',
          '-íamos',
          '-aron'
        ],
        answerKey: 0,
        hint: 'Future tense endings are added to the whole infinitive: -é, -ás, -á, -emos, -éis, -án.',
        explanation: 'The simple future endings for all verb groups (-ar, -er, -ir) are identical: -é, -ás, -á, -emos, -éis, -án, appended directly to the infinitive (hablar + emos = hablaremos).'
      }
    ]
  },

  'ks4:mfl:french-complex-opinions': {
    topicId: 'french-complex-opinions',
    title: 'French: Complex Opinions & Subjunctive',
    keyStage: 'Key Stage 4',
    subject: 'Modern Foreign Languages (GCSE)',
    coreAxiom: 'GCSE Grade 7-9 French requires expressing sophisticated opinions with connective clauses and the subjunctive mood. Impersonal structures expressing necessity or emotion trigger the subjunctive (e.g. "Il faut que je fasse mes devoirs", "Bien que ce soit cher"), whereas indicative is used for factual certainty ("Je pense que c\'est bon").',
    cognitiveTrap: 'Using the regular present indicative after subjunctive triggers (writing "Il faut que je fais" instead of "Il faut que je fasse", or "Bien que c\'est" instead of "Bien que ce soit").',
    socraticPivot: 'Why does "Je pense que c\'est utile" use "est" (indicative), but "Il faut que ce soit utile" use "soit" (subjunctive)?',
    hook: 'Using just one correct subjunctive phrase like "Bien que ce soit difficile" can elevate a GCSE writing or speaking response straight into Grade 8/9 territory!',
    guidedStep: 'Identify trigger phrases: Il faut que... (It is necessary that...), Bien que... (Although...), Pour que... (So that...). Conjugate the subjunctive stem (ils-stem in present - ent + e, es, e, ions, iez, ent). Note irregulars: être -> soit, avoir -> ait, faire -> fasse, aller -> aille.',
    scaffoldHints: {
      level1: 'Memorise the top 2 GCSE subjunctive phrases: "Bien que ce soit..." (Although it is...) and "Il faut que je fasse..." (I must do...).',
      level2: 'After "Je pense que" or "Je crois que" in the affirmative, use the normal indicative (c\'est).',
      level3: 'Subjunctive of "faire": je fasse, tu fasses, il/elle fasse, nous fassions, vous fassiez, ils fassent.'
    },
    questions: [
      {
        id: 'ks4-mfl-fr-sub-1',
        prompt: 'To achieve Grade 9 in GCSE French writing, Luc wants to say: "Although it is expensive, it is worth it." Which phrase correctly employs the subjunctive mood?',
        options: [
          'Bien que ce soit cher, ça en vaut la peine (Correctly triggers subjunctive "soit" of être)',
          'Bien que c\'est cher, ça en vaut la peine (Mistakenly uses indicative "est")',
          'Bien que c\'était cher, ça en vaut la peine (Uses imperfect indicative)',
          'Bien que ce sera cher, ça en vaut la peine (Uses future indicative)'
        ],
        answerKey: 0,
        hint: '"Bien que" (although) is a conjunction of concession that strictly requires the subjunctive mood ("soit").',
        explanation: 'In French, the conjunction "bien que" must always be followed by the subjunctive mood. The 3rd person singular subjunctive of "être" is "soit" (Bien que ce soit cher).'
      },
      {
        id: 'ks4-mfl-fr-sub-2',
        prompt: 'Which sentence correctly uses the subjunctive form of "faire" after the impersonal necessity trigger "Il faut que..." (It is necessary that)?',
        options: [
          'Il faut que je fasse mes devoirs (Uses subjunctive "fasse")',
          'Il faut que je fais mes devoirs (Mistakenly uses indicative "fais")',
          'Il faut que je ferai mes devoirs (Uses future indicative)',
          'Il faut que j\'ai fait mes devoirs (Uses past tense)'
        ],
        answerKey: 0,
        hint: '"Faire" has the irregular subjunctive stem "fass-": que je fasse, que tu fasses...',
        explanation: '"Il faut que" demands the subjunctive mood. The subjunctive of "faire" for "je" is "fasse": "Il faut que je fasse mes devoirs".'
      },
      {
        id: 'ks4-mfl-fr-sub-3',
        prompt: 'Which connective meaning "in order that" or "so that" obligatorily requires the subjunctive mood in French?',
        options: [
          'Pour que (e.g. "pour que je puisse...")',
          'Parce que',
          'Pendant que',
          'Tandis que'
        ],
        answerKey: 0,
        hint: '"Pour que" expresses purpose/aim, triggering subjunctive intent.',
        explanation: '"Pour que" (and "afin que") expresses intended purpose and always triggers the subjunctive mood: "Pour que je puisse réussir mes examens".'
      },
      {
        id: 'ks4-mfl-fr-sub-4',
        prompt: 'What is the 3rd person singular subjunctive form of "avoir" in the sentence: "Je doute qu\'il ____ le temps" (I doubt that he has the time)?',
        options: [
          'ait',
          'a',
          'aura',
          'avait'
        ],
        answerKey: 0,
        hint: 'Subjunctive of avoir: que j\'aie, que tu aies, qu\'il ait, que nous ayons...',
        explanation: 'Expressions of doubt trigger the subjunctive; the 3rd person singular subjunctive of "avoir" is "ait" (qu\'il ait).'
      },
      {
        id: 'ks4-mfl-fr-sub-5',
        prompt: 'When introducing a personal opinion with "À mon avis" (In my opinion) or "Selon moi" (According to me), which mood is used in the main clause?',
        options: [
          'The indicative mood (e.g. "À mon avis, c\'est une excellente solution")',
          'The subjunctive mood',
          'The imperative command mood',
          'The past infinitive'
        ],
        answerKey: 0,
        hint: '"À mon avis" is an introductory prepositional phrase expressing personal certainty, not a subjunctive trigger clause.',
        explanation: '"À mon avis" and "Selon moi" are followed by standard indicative clauses ("c\'est", "il y a"), because they do not contain a subordinate "que" with an obligation/doubt trigger.'
      },
      {
        id: 'ks4-mfl-fr-sub-6',
        prompt: 'Which sophisticated discourse marker can be used in a French GCSE essay to introduce a contrasting counter-argument meaning "On the other hand" / "However"?',
        options: [
          'D\'autre part / En revanche',
          'De plus',
          'En premier lieu',
          'C\'est-à-dire'
        ],
        answerKey: 0,
        hint: '"En revanche" or "d\'autre part" introduces an opposing viewpoint.',
        explanation: '"D\'autre part" (on the other hand) and "En revanche" (in contrast) are advanced connectors rewarded at GCSE higher tier for balanced arguments.'
      }
    ]
  },

  // ==========================================
  // OAK CATALOGUE MISSING TOPIC SEEDS (100% COVERAGE)
  // ==========================================

  // --- KS1 English: Story Sequencing ---
  'ks1:english:story-sequencing': {
    topicId: 'story-sequencing',
    title: 'Story Sequencing',
    keyStage: 'Key Stage 1',
    subject: 'English',
    coreAxiom: 'Stories have a beginning, a middle, and an end, ordered logically using chronological time connectives (First, Next, Then, After that, Finally).',
    cognitiveTrap: 'Telling events out of chronological order or jumping straight to the resolution without explaining the problem.',
    socraticPivot: 'Why would a fairy tale make no sense if the prince and princess married before they even met each other?',
    hook: 'Can you eat a banana before you peel it? Stories have a natural recipe order too!',
    guidedStep: '1. Beginning (Introduce characters and setting). 2. Middle (A problem or exciting event happens). 3. End (The problem is solved).',
    scaffoldHints: {
      level1: 'Chronological words: First..., Next..., Then..., Finally...',
      level2: 'Every good story has 3 parts: Beginning, Middle (the problem), and End (the solution).',
      level3: 'Look for sequence clues: "Once upon a time" is at the start; "Happily ever after" is at the end.'
    },
    questions: [
      {
        id: 'ks1-eng-seq-1',
        prompt: 'Which time connective word should you use at the very START of retelling a story?',
        options: ['First', 'Finally', 'Suddenly', 'After that'],
        answerKey: 0,
        hint: 'Which word means event number 1?',
        explanation: '"First" introduces the opening event in a sequence. "Finally" is saved for the end.'
      },
      {
        id: 'ks1-eng-seq-2',
        prompt: 'Which word is best used to signal the final event at the very END of a story sequence?',
        options: ['Finally', 'Initially', 'Meanwhile', 'First of all'],
        answerKey: 0,
        hint: 'Think of the word that means the very last stage.',
        explanation: '"Finally" indicates the conclusion or final event of a chronological narrative.'
      },
      {
        id: 'ks1-eng-seq-3',
        prompt: 'Look at these three story events: [1] The boy found a lost puppy. [2] The boy walked to school. [3] The puppy was reunited with its owner. What is the correct chronological order?',
        options: [
          '2, 1, 3 (Walking to school -> finding the puppy -> reuniting with owner)',
          '3, 2, 1 (Reunited -> walking -> finding)',
          '1, 3, 2 (Finding -> reuniting -> walking)',
          '3, 1, 2 (Reunited -> finding -> walking)'
        ],
        answerKey: 0,
        hint: 'The character must be out walking before finding the puppy, and must find it before returning it to its owner.',
        explanation: 'The logical narrative sequence begins with the character setting out, discovering the problem, and then resolving it.'
      },
      {
        id: 'ks1-eng-seq-4',
        prompt: 'What important story part usually happens in the MIDDLE of a narrative?',
        options: [
          'A problem, complication, or unexpected challenge for the main character',
          'The character going to sleep happily ever after',
          'The title page and author biography',
          'The glossary of hard words'
        ],
        answerKey: 0,
        hint: 'The beginning introduces characters; the middle introduces tension or a problem.',
        explanation: 'The middle of a story typically contains the problem, adventure, or conflict that tests the characters before the ending.'
      },
      {
        id: 'ks1-eng-seq-5',
        prompt: 'Which sentence starter is traditional for the BEGINNING of a classic fairy tale?',
        options: [
          '"Once upon a time in a faraway kingdom..."',
          '"And so they lived happily ever after."',
          '"In conclusion, the experiment was a success."',
          '"Finally, the castle gates were locked forever."'
        ],
        answerKey: 0,
        hint: 'This famous four-word phrase opens stories like Cinderella and Sleeping Beauty.',
        explanation: '"Once upon a time..." is the classic opening formula introducing setting and characters in traditional tales.'
      },
      {
        id: 'ks1-eng-seq-6',
        prompt: 'Which time connective shows that an exciting or unexpected event happened suddenly in the middle of a story?',
        options: [
          'Suddenly',
          'In conclusion',
          'At the very end',
          'Hours beforehand'
        ],
        answerKey: 0,
        hint: 'This word starts with "Sudden-" and creates instant surprise.',
        explanation: '"Suddenly" is used by writers to introduce an unexpected twist or fast event, creating drama in the narrative.'
      }
    ]
  },

  // --- KS1 Geography: The Four Seasons & Weather Patterns ---
  'ks1:geography:weather-patterns': {
    topicId: 'weather-patterns',
    title: 'The Four Seasons & Weather Patterns',
    keyStage: 'Key Stage 1',
    subject: 'Geography',
    coreAxiom: 'In the UK, weather patterns cycle through four seasons. Temperature, precipitation (rain, snow), wind speed, and daylight change predictably across Autumn, Winter, Spring, and Summer.',
    cognitiveTrap: 'Confusing "weather" (what is happening outside today) with "climate" or thinking hot weather only happens because of the Sun being closer.',
    socraticPivot: 'Why do we see frost and snow in December and January, but warm sunshine and long daylight hours in June and July?',
    hook: 'Why do swallows migrate south for the winter, and why do trees shed their leaves before the frost?',
    guidedStep: 'Record daily weather using symbols (sun, rain clouds, snowflakes) and track how day length changes across the year.',
    scaffoldHints: {
      level1: 'Winter is cold and dark with short days. Summer is warm and bright with long days.',
      level2: 'Spring brings new buds, blooming flowers, and baby animals. Autumn brings falling leaves and cooler winds.',
      level3: 'A thermometer measures temperature in degrees Celsius (°C); a rain gauge measures rainfall.'
    },
    questions: [
      {
        id: 'ks1-geo-weath-1',
        prompt: 'In the United Kingdom, during which season do days have the FEWEST hours of daylight and the coldest temperatures?',
        options: ['Winter', 'Summer', 'Spring', 'Autumn'],
        answerKey: 0,
        hint: 'Think of the season with Christmas, frost, and dark afternoons by 4:00 PM.',
        explanation: 'Winter has the shortest daylight hours and the coldest temperatures in the UK.'
      },
      {
        id: 'ks1-geo-weath-2',
        prompt: 'During which season do deciduous trees change colour to red and gold and shed their leaves to prepare for cold weather?',
        options: ['Autumn', 'Spring', 'Summer', 'Winter'],
        answerKey: 0,
        hint: 'This season happens in September, October, and November as days turn crisper.',
        explanation: 'In Autumn, falling temperatures trigger deciduous trees to stop chlorophyll production and drop their leaves.'
      },
      {
        id: 'ks1-geo-weath-3',
        prompt: 'Which season follows winter, bringing warmer sunshine, blooming daffodils, and newborn lambs?',
        options: ['Spring', 'Autumn', 'Summer', 'Winter'],
        answerKey: 0,
        hint: 'This season occurs in March, April, and May as nature wakes up.',
        explanation: 'Spring is the season of renewal, warmer temperatures, budding flowers, and lengthening daylight.'
      },
      {
        id: 'ks1-geo-weath-4',
        prompt: 'Which weather instrument is used by meteorologists to measure how hot or cold the air is in degrees Celsius (°C)?',
        options: ['Thermometer', 'Rain gauge', 'Wind vane', 'Barometer'],
        answerKey: 0,
        hint: 'The prefix "thermo-" refers to heat.',
        explanation: 'A thermometer measures temperature in degrees Celsius (°C) or Fahrenheit (°F).'
      },
      {
        id: 'ks1-geo-weath-5',
        prompt: 'What type of weather occurs when tiny droplets of water freeze into delicate ice crystals high in cold winter clouds and drift gently down?',
        options: ['Snow', 'Hailstones', 'Dew', 'Fog'],
        answerKey: 0,
        hint: 'Children love using this frozen white precipitation to build winter figures.',
        explanation: 'Snow forms when temperatures in the atmosphere fall below freezing (0°C), allowing water vapour to turn into ice crystal flakes.'
      },
      {
        id: 'ks1-geo-weath-6',
        prompt: 'Which weather condition occurs when warm, moist air cools rapidly near the ground, creating a thick blanket of tiny water droplets that makes it difficult to see ahead?',
        options: ['Fog / Mist', 'Thunderstorm', 'Heatwave', 'Blizzard'],
        answerKey: 0,
        hint: 'Drivers have to turn on special low yellow lights to see through it.',
        explanation: 'Fog is essentially a cloud touching the ground, formed when moisture condenses into suspended water droplets in cold ground air.'
      }
    ]
  },

  // --- KS2 English: Direct Speech Punctuation ---
  'ks2:english:direct-speech-punctuation': {
    topicId: 'direct-speech-punctuation',
    title: 'Direct Speech Punctuation',
    keyStage: 'Key Stage 2',
    subject: 'English',
    coreAxiom: 'Direct speech quotes the exact words spoken, enclosed within inverted commas ("..."). Punctuation (comma, full stop, question mark, or exclamation mark) MUST sit INSIDE the closing quotation mark. Each new speaker begins on a new line.',
    cognitiveTrap: 'Placing the comma or question mark outside the quotation marks (e.g. "Wait for me", shouted Tom), or forgetting to start a new paragraph for a new speaker.',
    socraticPivot: 'Why does the comma in "Hurry up," said Mum have to go INSIDE the inverted commas?',
    hook: 'Without speech marks, how can a reader tell whether a character is speaking out loud or just thinking in silence?',
    guidedStep: '1. Open inverted commas ("). 2. Capital letter for spoken words. 3. End speech with punctuation (! ? , .). 4. Close inverted commas ("). 5. Reporting clause (said Jack). 6. New speaker = new line.',
    scaffoldHints: {
      level1: 'Rule: "Punctuation before closing inverted commas!" (e.g. "Stop!" cried the policeman).',
      level2: 'Always start what the speaker says with a capital letter inside the quotes: "We are ready," announced Mia.',
      level3: 'New speaker, new line: Whenever someone else begins speaking, hit Enter to start a fresh line.'
    },
    questions: [
      {
        id: 'ks2-eng-speech-1',
        prompt: 'Which sentence is punctuated with correct inverted commas for direct speech?',
        options: [
          '"Can we explore the cave today?" whispered Leo.',
          '"Can we explore the cave today"? whispered Leo.',
          '"can we explore the cave today?" whispered Leo.',
          'Can we explore the cave today? "whispered Leo."'
        ],
        answerKey: 0,
        hint: 'The question mark MUST be inside the quotation marks, and the spoken sentence must begin with a capital letter.',
        explanation: 'The spoken words begin with a capital letter ("Can...") and the question mark sits strictly inside the closing speech mark: "Can we explore the cave today?" whispered Leo.'
      },
      {
        id: 'ks2-eng-speech-2',
        prompt: 'Where must the punctuation mark go when direct speech is followed by a reporting clause like "replied Marcus"?',
        options: [
          'Inside the closing inverted commas (e.g., "I know the answer," replied Marcus.)',
          'Outside the closing inverted commas (e.g., "I know the answer", replied Marcus.)',
          'At the very start of the sentence before the speech marks',
          'Punctuation is completely forbidden when someone replies'
        ],
        answerKey: 0,
        hint: 'Punctuation always stays tucked inside the speech marks.',
        explanation: 'In English grammar, commas, question marks, and exclamation marks must sit inside the closing quotation marks before the reporting verb.'
      },
      {
        id: 'ks2-eng-speech-3',
        prompt: 'What must you always do when writing dialogue whenever a different character begins speaking?',
        options: [
          'Start a new line (new paragraph)',
          'Change the colour of the ink',
          'Write in all capital letters',
          'Add three question marks'
        ],
        answerKey: 0,
        hint: 'Remember the classic rule: "New speaker, new line".',
        explanation: 'In story writing, whenever dialogue switches to a new speaker, you must begin on a new line to keep the conversation clear for the reader.'
      },
      {
        id: 'ks2-eng-speech-4',
        prompt: 'Which sentence correctly punctuates an exclamation in direct speech?',
        options: [
          '"Look out for the falling rocks!" yelled the guide.',
          '"Look out for the falling rocks"! yelled the guide.',
          '"look out for the falling rocks"! yelled the guide.',
          'Look out for the falling rocks! "yelled the guide."'
        ],
        answerKey: 0,
        hint: 'The exclamation mark goes inside the closing quotation mark.',
        explanation: 'The exclamation mark belongs inside the speech marks: "Look out for the falling rocks!" yelled the guide.'
      },
      {
        id: 'ks2-eng-speech-5',
        prompt: 'Which sentence correctly splits direct speech around a reporting clause?',
        options: [
          '"I would like to go," admitted Hannah, "but I have to finish my chores."',
          '"I would like to go" admitted Hannah "but I have to finish my chores."',
          '"I would like to go," admitted Hannah, "But I have to finish my chores."',
          '"I would like to go", admitted Hannah, "but I have to finish my chores"'
        ],
        answerKey: 0,
        hint: 'The comma sits inside the first quote, and the continuation does not need a capital letter if it is the same sentence.',
        explanation: 'When a spoken sentence is interrupted by a reporting clause, use a comma inside the first quote, and resume the sentence with a lowercase letter inside the second quote.'
      },
      {
        id: 'ks2-eng-speech-6',
        prompt: 'If a character asks a question in direct speech, which punctuation rule must you follow?',
        options: [
          'Place the question mark inside the closing quotation marks (e.g. "Are we nearly there?" asked Toby)',
          'Place the question mark outside after the reporting verb (e.g. "Are we nearly there" asked Toby?)',
          'Use a full stop inside and put the question mark at the very start of the sentence',
          'Replace all quotation marks with question marks'
        ],
        answerKey: 0,
        hint: 'Punctuation directly spoken by the character always stays inside the speech marks.',
        explanation: 'The question mark belongs to the words spoken by the character, so it must be placed inside the closing inverted commas.'
      }
    ]
  },

  // --- KS2 English: Reading Comprehension: Inference ---
  'ks2:english:reading-comprehension-inference': {
    topicId: 'reading-comprehension-inference',
    title: 'Reading Comprehension: Inference',
    keyStage: 'Key Stage 2',
    subject: 'English',
    coreAxiom: 'Inference is reading between the lines—combining textual clues with background knowledge to deduce meanings, emotions, or motives that the author has not explicitly stated.',
    cognitiveTrap: 'Guessing wild ideas not supported by evidence in the text, or confusing retrieval (finding literal words) with inference (deducing implied meaning).',
    socraticPivot: 'If a text says "James slammed the door, kicked his bag across the room, and refused to speak," how do we know he is angry if the word "angry" never appears?',
    hook: 'Detectives solve mysteries using footprints and clues. Reading comprehension inference turns you into a textual detective!',
    guidedStep: '1. Read the text clue. 2. Ask: What does this action or detail suggest? 3. Support your deduction with "because the text says...".',
    scaffoldHints: {
      level1: 'Inference = Clues from text + What you already know about human behavior.',
      level2: '"Show, don\'t tell": authors describe trembling hands to show fear rather than writing "she was afraid".',
      level3: 'PEE rule: Point (your inference), Evidence (quote from text), Explanation (how the quote proves your point).'
    },
    questions: [
      {
        id: 'ks2-eng-inf-1',
        prompt: 'Read the excerpt: "Sarah pulled her woollen scarf tighter around her neck, tucked her shivering hands into her coat pockets, and hurried towards the glowing porch light." What can we infer about the weather?',
        options: [
          'It is cold and chilly outside',
          'It is a sweltering hot summer afternoon',
          'It is completely pitch black with no light anywhere',
          'Sarah has forgotten where she lives'
        ],
        answerKey: 0,
        hint: 'Look at Sarah\'s actions: woollen scarf, shivering hands, thick coat.',
        explanation: 'The details of shivering, a woollen scarf, and hands tucked in pockets allow the reader to infer that the weather is cold, even though the text never uses the word "cold".'
      },
      {
        id: 'ks2-eng-inf-2',
        prompt: 'Read the excerpt: "Daniel stared down at the broken vase on the living room floor, biting his lower lip as the sound of his mother\'s car pulling into the driveway echoed outside." What can we infer about Daniel\'s feelings?',
        options: [
          'He is anxious, nervous, or worried about getting into trouble',
          'He is overjoyed and excited to show his mother a surprise',
          'He is completely bored and falling asleep',
          'He is proud of his artistic vase-making skill'
        ],
        answerKey: 0,
        hint: 'Biting one\'s lower lip while waiting for parents to arrive after an accident shows tension and fear.',
        explanation: 'Biting his lip and hearing his mother\'s car arrive right after breaking a vase indicates Daniel is nervous and dreading the consequence.'
      },
      {
        id: 'ks2-eng-inf-3',
        prompt: 'What is the main difference between a RETRIEVAL question and an INFERENCE question in a reading exam?',
        options: [
          'Retrieval finds words directly written in the text; inference uses clues to work out what is implied',
          'Retrieval tests spelling; inference tests handwriting',
          'Retrieval is only used in poetry; inference is only used in newspapers',
          'There is no difference; they mean the exact same thing'
        ],
        answerKey: 0,
        hint: 'Retrieval is "finding" facts; inference is "figuring out" implied meanings.',
        explanation: 'Retrieval involves extracting facts stated directly on the page, while inference requires interpreting clues to understand feelings, reasons, or atmosphere.'
      },
      {
        id: 'ks2-eng-inf-4',
        prompt: 'Read the excerpt: "Mrs Jones tapped her foot impatiently, crossed her arms, and glanced repeatedly at the wall clock above the empty classroom door." What can we infer about Mrs Jones?',
        options: [
          'She is waiting for someone who is late and feeling frustrated',
          'She is admiring the modern design of the clock face',
          'She is practicing dance steps for a concert',
          'She has just won a teaching award'
        ],
        answerKey: 0,
        hint: 'Tapping feet, crossed arms, and looking at the clock are classic body language signs.',
        explanation: 'Foot-tapping, crossed arms, and checking the clock are universal body language signals showing impatience while waiting for someone late.'
      },
      {
        id: 'ks2-eng-inf-5',
        prompt: 'Read the excerpt: "The puppy wagged its tail so fast its entire body wiggled as Liam reached for the red rubber ball." What can we infer about the puppy?',
        options: [
          'It is excited, happy, and eager to play fetch',
          'It is terrified and trying to escape from Liam',
          'It is hungry and wants to eat the ball for lunch',
          'It is fast asleep and dreaming'
        ],
        answerKey: 0,
        hint: 'Vigorous tail-wagging and body wiggling in dogs signify excitement and eagerness.',
        explanation: 'Vigorous tail wagging and whole-body wiggling when seeing a ball indicate intense canine enthusiasm and playfulness.'
      },
      {
        id: 'ks2-eng-inf-6',
        prompt: 'Read the excerpt: "Maya pushed her untouched bowl of soup away, rested her heavy head in her hands, and let out a weary sigh." What can we infer about Maya?',
        options: [
          'She is feeling exhausted, unwell, or troubled and has lost her appetite',
          'She has just won a marathon race and wants to celebrate',
          'She is delighted with how delicious the hot soup tastes',
          'She is playing an energetic video game'
        ],
        answerKey: 0,
        hint: 'Leaving food untouched, holding a heavy head, and sighing wearily point to fatigue or sickness.',
        explanation: 'Pushing away untouched food combined with holding her head and sighing allows the reader to deduce that Maya is tired, sad, or sick.'
      }
    ]
  },

  // --- KS2 Science: Earth and Space ---
  'ks2:science:earth-space': {
    topicId: 'earth-space',
    title: 'Earth and Space',
    keyStage: 'Key Stage 2',
    subject: 'Science',
    coreAxiom: 'The Earth is a roughly spherical body that rotates on its axis once every 24 hours (causing day and night) and orbits the Sun once every 365.25 days (causing the year and seasons). The Moon is a natural satellite that orbits the Earth roughly every 28 days.',
    cognitiveTrap: 'Believing that the Sun physically moves across the sky around the Earth, or that the Moon produces its own light like a lightbulb.',
    socraticPivot: 'Why does the Sun appear to rise in the east and set in the west if the Sun is actually stationed at the centre of our Solar System?',
    hook: 'If you stand in London at midday, people on the opposite side of the planet in New Zealand are fast asleep in the dark of night! Why?',
    guidedStep: '1. Identify the Sun as a star at the centre. 2. Recognise Earth\'s rotation causes day/night. 3. Moon reflects sunlight and orbits Earth.',
    scaffoldHints: {
      level1: 'The Sun does not move across the sky; Earth spins like a spinning top (rotation) once every 24 hours.',
      level2: 'Day happens when your side of the Earth faces towards the Sun; Night happens when it faces away.',
      level3: 'Orbit vs Rotation: Rotation = spinning on its axis (24 hours = 1 day). Orbit = travelling around the Sun (365 days = 1 year).'
    },
    questions: [
      {
        id: 'ks2-sci-space-1',
        prompt: 'What causes day and night on Planet Earth?',
        options: [
          'The Earth spinning (rotating) on its own axis every 24 hours',
          'The Sun travelling in a circle around the Earth',
          'The Moon blocking the Sun\'s light every evening',
          'Clouds covering the sky as the temperature drops'
        ],
        answerKey: 0,
        hint: 'Think about the Earth rotating like a spinning globe.',
        explanation: 'Day and night are caused by Earth\'s rotation on its axis once every 24 hours. As it turns, half faces the Sun (day) and half faces away into space (night).'
      },
      {
        id: 'ks2-sci-space-2',
        prompt: 'Approximately how long does it take for Planet Earth to complete one full orbit around the Sun?',
        options: [
          '365 and 1/4 days (one year)',
          '24 hours (one day)',
          '28 days (one month)',
          '100 years (one century)'
        ],
        answerKey: 0,
        hint: 'This is the time it takes to cycle through all four seasons back to your birthday.',
        explanation: 'Earth orbits the Sun in roughly 365.25 days, which forms our calendar year (with an extra leap day added every 4 years).'
      },
      {
        id: 'ks2-sci-space-3',
        prompt: 'Why does the Moon appear to shine brightly in the night sky?',
        options: [
          'It reflects light coming from the Sun',
          'It produces its own light through nuclear reactions like a star',
          'It is coated in glowing phosphorus crystals',
          'It absorbs street lighting from cities on Earth'
        ],
        answerKey: 0,
        hint: 'The Moon is not a star; it is a giant rocky ball that acts like a mirror.',
        explanation: 'The Moon has no light of its own; it shines because its rocky surface reflects sunlight back to our eyes on Earth.'
      },
      {
        id: 'ks2-sci-space-4',
        prompt: 'What causes the changing seasons (Spring, Summer, Autumn, Winter) on Earth?',
        options: [
          'The 23.5-degree tilt of the Earth\'s axis as it orbits the Sun',
          'The Earth getting physically closer and further from the Sun in an oval',
          'Giant heat waves erupting inside the Earth\'s core',
          'The Moon casting a giant shadow over the oceans'
        ],
        answerKey: 0,
        hint: 'When a hemisphere tilts towards the Sun, it experiences summer with more direct rays.',
        explanation: 'Earth\'s axis is tilted at 23.5 degrees. When a hemisphere leans toward the Sun, solar rays hit more directly, creating longer days and summer.'
      },
      {
        id: 'ks2-sci-space-5',
        prompt: 'What is the correct order of the four inner rocky planets in our Solar System starting from the Sun outwards?',
        options: [
          'Mercury, Venus, Earth, Mars',
          'Earth, Mars, Jupiter, Saturn',
          'Venus, Mercury, Mars, Earth',
          'Mars, Earth, Venus, Mercury'
        ],
        answerKey: 0,
        hint: 'Remember: My Very Easy Method (Mercury, Venus, Earth, Mars).',
        explanation: 'The four inner terrestrial planets in order from the Sun are Mercury, Venus, Earth, and Mars.'
      },
      {
        id: 'ks2-sci-space-6',
        prompt: 'What is the imaginary line running through the centre of the Earth from the North Pole to the South Pole called, around which Earth rotates?',
        options: [
          'The Axis',
          'The Equator',
          'The Tropic of Capricorn',
          'The Prime Meridian'
        ],
        answerKey: 0,
        hint: 'Earth spins on its tilted _____ once every 24 hours.',
        explanation: 'The axis is the imaginary line connecting the geographic North and South poles about which the Earth spins in its diurnal rotation.'
      }
    ]
  },

  // --- KS2 History: The Vikings & Anglo-Saxons ---
  'ks2:history:vikings-anglo-saxons': {
    topicId: 'vikings-anglo-saxons',
    title: 'The Vikings & Anglo-Saxons',
    keyStage: 'Key Stage 2',
    subject: 'History',
    coreAxiom: 'Following the fall of Roman Britain, Anglo-Saxon kingdoms established settlements across England. From 793 AD (raid on Lindisfarne monastery), Scandinavian Norse Vikings raided and later settled, culminating in King Alfred the Great dividing England under Danelaw before ultimate unification.',
    cognitiveTrap: 'Believing Vikings were purely horned-helmeted bloodthirsty raiders rather than skilled farmers, traders, craftspeople, and navigators.',
    socraticPivot: 'Why did Vikings target wealthy Christian monasteries like Lindisfarne rather than defended stone fortresses?',
    hook: 'Many English days of the week are named after Norse gods: Thursday is "Thor\'s Day", and Friday is "Freya\'s Day"!',
    guidedStep: '1. Map the routes of Anglo-Saxon and Viking settlers across the North Sea. 2. Understand Danelaw and Alfred the Great. 3. Examine Viking everyday village life.',
    scaffoldHints: {
      level1: 'Vikings came across the North Sea from Scandinavia (Norway, Sweden, Denmark) in fast longships.',
      level2: 'Monasteries held valuable gold chalices and manuscripts and had no armed guards, making them easy targets for early raids.',
      level3: 'King Alfred of Wessex defeated the Great Heathen Army and agreed a treaty establishing Danelaw in the north and east of England.'
    },
    questions: [
      {
        id: 'ks2-hist-vik-1',
        prompt: 'Why were early Christian monasteries (such as Lindisfarne in 793 AD) prime targets for Viking raids?',
        options: [
          'Monasteries held great wealth in gold and jewels and were undefended by soldiers',
          'Monasteries were large military castles guarding the coast',
          'The Vikings wanted to translate Anglo-Saxon religious books into Old Norse',
          'The monks invited the Vikings to trade with them peacefully'
        ],
        answerKey: 0,
        hint: 'Monks were peaceful and prayed, but churches held valuable treasures.',
        explanation: 'Monasteries were vulnerable, coastal, and packed with valuable treasures (silver, gold, relics) with no armed soldiers to protect them.'
      },
      {
        id: 'ks2-hist-vik-2',
        prompt: 'From which northern European region did the Vikings travel when they crossed the North Sea to raid and settle in Britain?',
        options: [
          'Scandinavia (modern-day Norway, Sweden, and Denmark)',
          'The Mediterranean (Italy and Greece)',
          'North Africa (Egypt and Morocco)',
          'Eastern Asia (China and Japan)'
        ],
        answerKey: 0,
        hint: 'The Norse homeland was in the far north of Europe with cold fjords.',
        explanation: 'Vikings came from Scandinavia—Norway, Sweden, and Denmark—navigating across rough northern seas in wooden longships.'
      },
      {
        id: 'ks2-hist-vik-3',
        prompt: 'Which Anglo-Saxon King of Wessex successfully defended his kingdom against the Great Heathen Army and established the historical region known as the Danelaw?',
        options: [
          'King Alfred the Great',
          'King Henry VIII',
          'King Arthur',
          'King William the Conqueror'
        ],
        answerKey: 0,
        hint: 'He is the only English monarch in history officially given the title "the Great".',
        explanation: 'King Alfred the Great defeated the Viking leader Guthrum at the Battle of Edington in 878 AD and agreed a treaty dividing England into Wessex and the Danelaw.'
      },
      {
        id: 'ks2-hist-vik-4',
        prompt: 'What was "Danelaw" in late 9th-century Anglo-Saxon England?',
        options: [
          'The northern and eastern territories of England where Danish laws and customs held authority',
          'A royal law banning all Viking longships from sailing on rivers',
          'A tax paid by Vikings to Anglo-Saxon monasteries in gold',
          'The secret runic alphabet used only by Viking chieftains'
        ],
        answerKey: 0,
        hint: 'It was the area under Danish law established after the Treaty of Wedmore.',
        explanation: 'The Danelaw was the territory in northern and eastern England where Viking law and governance prevailed under treaties with the Anglo-Saxons.'
      },
      {
        id: 'ks2-hist-vik-5',
        prompt: 'Which technological innovation allowed Viking longships to sail across deep open oceans and also navigate shallow inland rivers?',
        options: [
          'A shallow draft (keel design) and symmetrical hull that could row or sail in both directions',
          'Heavy cast-iron steam boilers with paddlewheels',
          'Deep underwater propellers powered by electricity',
          'Giant lead weights attached to the bottom of the boat'
        ],
        answerKey: 0,
        hint: 'Their shallow bottom allowed Vikings to land directly onto sandy beaches without needing a deep harbour.',
        explanation: 'Longships had a shallow draft, enabling them to navigate shallow rivers right up to inland towns and land easily on flat beaches.'
      },
      {
        id: 'ks2-hist-vik-6',
        prompt: 'What defensive military tactic did both Anglo-Saxons and Vikings rely upon to repel cavalry and weapon strikes in open pitched battles?',
        options: [
          'The Shield Wall (warriors standing shoulder-to-shoulder with overlapping wooden shields)',
          'Digging deep trenches with barbed wire',
          'Riding in armoured chariots drawn by four horses',
          'Firing long-range cannons from high hilltop fortifications'
        ],
        answerKey: 0,
        hint: 'Warriors locked circular shields together edge-to-edge to form an impenetrable wooden wall.',
        explanation: 'The shield wall was the primary infantry tactic of the Anglo-Saxon and Viking era, locking shields edge-to-edge with spears thrusting through gaps.'
      }
    ]
  },

  // --- KS2 Geography: World Biomes & Climate Zones ---
  'ks2:geography:world-biomes': {
    topicId: 'world-biomes',
    title: 'World Biomes & Climate Zones',
    keyStage: 'Key Stage 2',
    subject: 'Geography',
    coreAxiom: 'A biome is a large ecological community of plants and animals adapted to a specific regional climate. Major world biomes include Tropical Rainforests, Deserts, Savannas, Temperate Forests, Taiga (boreal), and Tundra.',
    cognitiveTrap: 'Assuming all deserts are blistering hot sand dunes (Antarctica is technically the world\'s largest desert because of extremely low precipitation).',
    socraticPivot: 'Why do tropical rainforests grow near the Equator while tundra and polar ice sheets exist at the high latitudes near the poles?',
    hook: 'In a tropical rainforest, it rains almost every single afternoon like clockwork! Why?',
    guidedStep: '1. Identify latitude (Equator receives most direct solar rays). 2. Correlate temperature and rainfall to biome characteristics. 3. Observe plant/animal adaptations.',
    scaffoldHints: {
      level1: 'Equator = hot and wet (Tropical Rainforest). Tropics of Cancer & Capricorn = dry and arid (Hot Deserts). Poles = freezing cold (Tundra).',
      level2: 'Definition of a desert: Any area receiving less than 250mm of precipitation per year.',
      level3: 'Rainforest layers: Emergent, Canopy (where most animals live), Understorey, Forest Floor.'
    },
    questions: [
      {
        id: 'ks2-geo-biome-1',
        prompt: 'Which global biome is characterised by warm temperatures year-round, extremely high rainfall, and the greatest biodiversity on Earth?',
        options: [
          'Tropical Rainforest',
          'Hot Desert',
          'Arctic Tundra',
          'Temperate Deciduous Forest'
        ],
        answerKey: 0,
        hint: 'Located along the Equator with lush green canopies and species like toucans and jaguars.',
        explanation: 'Tropical rainforests receive direct solar radiation at the Equator and abundant rainfall year-round, supporting over 50% of the world\'s plant and animal species.'
      },
      {
        id: 'ks2-geo-biome-2',
        prompt: 'What is the true geographical definition of a desert biome?',
        options: [
          'An area that receives less than 250 millimetres of precipitation (rain or snow) per year',
          'A land covered entirely in blistering hot red sand dunes',
          'Any region where the temperature never falls below 40 degrees Celsius',
          'A place where no living organisms or plants can survive'
        ],
        answerKey: 0,
        hint: 'Desert classification depends on low moisture/rain, not just heat.',
        explanation: 'A desert is defined by dryness: receiving under 250mm of precipitation annually. This includes cold deserts like Antarctica as well as hot deserts like the Sahara.'
      },
      {
        id: 'ks2-geo-biome-3',
        prompt: 'Which frigid biome, located around the Arctic Circle, features permanently frozen subsoil known as permafrost and low-growing mosses and lichens?',
        options: [
          'Tundra',
          'Savanna',
          'Chaparral',
          'Tropical Grassland'
        ],
        answerKey: 0,
        hint: 'Trees cannot grow because of the frozen permafrost subsoil.',
        explanation: 'The Tundra is characterised by extreme cold, low precipitation, short growing seasons, and a layer of permanently frozen subsoil called permafrost.'
      },
      {
        id: 'ks2-geo-biome-4',
        prompt: 'In a tropical rainforest, which structural layer consists of dense overlapping treetops 30 metres above ground where most animals, birds, and insects live?',
        options: [
          'The Canopy',
          'The Forest Floor',
          'The Understorey',
          'The Subterranean Layer'
        ],
        answerKey: 0,
        hint: 'This leafy roof acts like a giant green umbrella catching most of the sunlight.',
        explanation: 'The canopy acts like a ceiling over the forest, receiving abundant sunlight and fruit, providing food and shelter for the vast majority of rainforest creatures.'
      },
      {
        id: 'ks2-geo-biome-5',
        prompt: 'How have desert plants like cacti adapted to survive long droughts with very little water?',
        options: [
          'Fleshy thick stems to store water and sharp spines instead of wide leaves to minimize water loss',
          'Broad thin leaves that absorb moisture from passing clouds',
          'Floating hollow air sacs that let them drift across sand dunes',
          'Growing tall thin trunks that reach up into cold mountain air'
        ],
        answerKey: 0,
        hint: 'Spines protect against thirsty animals and prevent transpiration.',
        explanation: 'Cacti store water in succulent stems, use extensive root networks, and replace leaves with spines to minimize moisture loss through transpiration.'
      },
      {
        id: 'ks2-geo-biome-6',
        prompt: 'Which tropical biome is characterised by wide rolling grasslands, scattered acacia trees, and dramatic wet and dry seasons, home to large herbivores like zebras and elephants?',
        options: [
          'The Savanna',
          'The Taiga (Boreal Forest)',
          'The Alpine Tundra',
          'The Temperate Rainforest'
        ],
        answerKey: 0,
        hint: 'Think of the African plains shown in the Serengeti.',
        explanation: 'The Savanna is a tropical grassland biome found between deserts and rainforests, featuring warm temperatures and distinct seasonal rainfall supporting grazing herds.'
      }
    ]
  },

  // --- KS2 Computing: Scratch Block Programming ---
  'ks2:computing:scratch-block-programming': {
    topicId: 'scratch-block-programming',
    title: 'Scratch Block Programming',
    keyStage: 'Key Stage 2',
    subject: 'Computing',
    coreAxiom: 'Block-based programming environments (like Scratch) execute algorithms using visual syntax blocks. Key constructs include Sequence (order of blocks), Selection (if/then conditional decisions), and Iteration (repeat/forever loops). Sprites respond to events (e.g. "when green flag clicked").',
    cognitiveTrap: 'Putting blocks inside a loop when they only need to run once, or omitting the "when green flag clicked" hat block so the script never triggers.',
    socraticPivot: 'What would happen in a game if you put a character movement block inside a "repeat 10" loop versus a "forever" loop?',
    hook: 'Every video game you love—from Minecraft to Mario—is constructed out of the exact same computational building blocks: sequences, loops, and conditional choices!',
    guidedStep: '1. Start with an Event block (Hat block). 2. Add Motion or Looks blocks in sequence. 3. Use Control blocks (Loops and If/Then) for repeated or conditional behavior.',
    scaffoldHints: {
      level1: 'Green flag block = Start button for your code.',
      level2: 'Loop (repeat/forever) = runs the code inside over and over without having to rewrite it.',
      level3: 'Condition (if <touching edge?> then <bounce>) = checks if something is true before making a decision.'
    },
    questions: [
      {
        id: 'ks2-comp-scratch-1',
        prompt: 'In Scratch, which block is required to make a sprite continuously check forever if it is touching an obstacle throughout the entire game?',
        options: [
          'A "forever" loop containing an "if... then" block',
          'A single "move 10 steps" block',
          'A "wait 1 seconds" block',
          'A "say Hello! for 2 secs" block'
        ],
        answerKey: 0,
        hint: 'It needs to check without ever stopping while the game is running.',
        explanation: 'A "forever" loop combined with an "if... then" block ensures the condition is continuously evaluated for the duration of the program.'
      },
      {
        id: 'ks2-comp-scratch-2',
        prompt: 'What is the purpose of the yellow "when green flag clicked" event block placed at the top of a Scratch script?',
        options: [
          'It acts as the starting trigger that runs the attached code when the user starts the game',
          'It changes the sprite\'s colour permanently to green',
          'It deletes the current sprite from the stage',
          'It creates a sound effect of a waving flag'
        ],
        answerKey: 0,
        hint: 'Clicking the green flag on the stage starts execution.',
        explanation: '"When green flag clicked" is a Hat event block that begins running the script whenever the player presses the green play flag.'
      },
      {
        id: 'ks2-comp-scratch-3',
        prompt: 'In computing, what is a "variable" used for in a Scratch game project?',
        options: [
          'To store and update data that can change, such as a player\'s score, health points, or time',
          'To change the font size of the stage backdrop',
          'To connect the computer directly to a printer',
          'To draw circular vectors using the pen tool'
        ],
        answerKey: 0,
        hint: 'Think of a container that holds a number like Score = 10, then changes to Score = 11.',
        explanation: 'A variable is a named storage container in memory used to hold data values that can be referenced and modified during program execution.'
      },
      {
        id: 'ks2-comp-scratch-4',
        prompt: 'What will happen if a sprite runs the block: "repeat 4 [ move 100 steps, turn right 90 degrees ]"?',
        options: [
          'The sprite will draw or walk along the perimeter of a complete square and face its original direction',
          'The sprite will walk in a straight line forever off the screen',
          'The sprite will spin around in place without moving forward',
          'The sprite will disappear into the backdrop'
        ],
        answerKey: 0,
        hint: '4 equal sides of 100 steps with four 90-degree right turns make a familiar polygon.',
        explanation: 'Moving forward and turning 90 degrees four times traces out the four sides and corners of a square.'
      },
      {
        id: 'ks2-comp-scratch-5',
        prompt: 'What is the computer science term for finding and fixing errors or mistakes in your program code?',
        options: [
          'Debugging',
          'Downloading',
          'Encrypting',
          'Compressing'
        ],
        answerKey: 0,
        hint: 'Grace Hopper famously removed a literal moth from an early relay computer.',
        explanation: 'Debugging is the systematic process of identifying, isolating, and rectifying errors (bugs) in software code.'
      },
      {
        id: 'ks2-comp-scratch-6',
        prompt: 'In Scratch, which light-blue block category allows a sprite to detect whether it is touching the edge of the stage, another sprite, or a specific colour?',
        options: [
          'Sensing blocks (e.g. <touching mouse-pointer?>)',
          'Motion blocks',
          'Sound blocks',
          'Pen blocks'
        ],
        answerKey: 0,
        hint: 'These blocks act like the senses of eyes and touch for your sprite.',
        explanation: 'Sensing blocks provide input conditions (such as touching objects, distances, mouse clicks, and keyboard presses) to trigger game actions.'
      }
    ]
  },

  // --- KS3 Science: Energy Transfers & Conservation ---
  'ks3:science:energy-transfers': {
    topicId: 'energy-transfers',
    title: 'Energy Transfers & Conservation',
    keyStage: 'Key Stage 3',
    subject: 'Science',
    coreAxiom: 'The Law of Conservation of Energy states that energy cannot be created or destroyed, only transferred between stores (Kinetic, Gravitational Potential, Chemical, Thermal, Elastic, Nuclear). Transfers occur via mechanical work, electrical work, heating, or radiation (light/sound). In any non-ideal transfer, some energy is dissipated (wasted) into thermal stores.',
    cognitiveTrap: 'Believing energy is "used up" or disappears when a battery runs out, rather than being dissipated into thermal energy in the surroundings.',
    socraticPivot: 'When a roller coaster car rolls to a stop at the end of the track, where did its huge kinetic and gravitational potential energy go?',
    hook: 'A bouncing ball never bounces back as high as where you dropped it from. Has physics broken, or where did the missing height go?',
    guidedStep: '1. Identify the initial energy store. 2. Identify the transfer mechanism. 3. Identify the final useful and wasted (dissipated) energy stores. Initial Energy = Total Final Energy.',
    scaffoldHints: {
      level1: 'Conservation rule: Total Energy In = Total Energy Out (always!).',
      level2: 'Dissipated energy: When friction acts, kinetic energy transfers to thermal energy, heating the air and surfaces.',
      level3: 'Efficiency = (Useful energy output / Total energy input) × 100%.'
    },
    questions: [
      {
        id: 'ks3-sci-energy-1',
        prompt: 'When an archer pulls back a bowstring and releases an arrow, what is the primary energy transfer taking place?',
        options: [
          'Elastic potential energy stored in the bow transfers to kinetic energy of the flying arrow',
          'Gravitational potential energy transfers into nuclear energy',
          'Chemical energy in the arrow transfers into magnetic energy',
          'Thermal energy in the air creates new kinetic energy from nothing'
        ],
        answerKey: 0,
        hint: 'The stretched bowstring stores elastic energy; the moving arrow has kinetic energy.',
        explanation: 'Stretching the bow stores elastic potential energy. Upon release, mechanical work transfers this into the kinetic energy store of the moving arrow.'
      },
      {
        id: 'ks3-sci-energy-2',
        prompt: 'As a roller coaster cart plunges down from the highest summit of a hill, which energy store conversion occurs?',
        options: [
          'Gravitational potential energy decreases as it converts into kinetic energy',
          'Chemical energy increases while kinetic energy decreases',
          'Nuclear energy converts into gravitational potential energy',
          'Thermal energy converts into magnetic potential energy'
        ],
        answerKey: 0,
        hint: 'Height corresponds to gravitational potential energy; speed corresponds to kinetic energy.',
        explanation: 'As height decreases, gravitational potential energy is transferred mechanically into the cart\'s kinetic energy store, increasing speed.'
      },
      {
        id: 'ks3-sci-energy-3',
        prompt: 'What does the universal Law of Conservation of Energy state?',
        options: [
          'Energy cannot be created or destroyed, only transferred from one store to another',
          'Energy is slowly destroyed whenever friction acts in machines',
          'Total energy in the universe decreases by 10% every century',
          'Cold objects produce energy spontaneously without any source'
        ],
        answerKey: 0,
        hint: 'Total energy before a transfer is always equal to total energy after.',
        explanation: 'The Law of Conservation of Energy states that the total energy of an isolated system remains constant; it can never be created or destroyed.'
      },
      {
        id: 'ks3-sci-energy-4',
        prompt: 'When a mechanical machine operates, what usually happens to the "wasted" (dissipated) energy?',
        options: [
          'It is transferred to thermal stores of the surroundings and machine parts due to friction',
          'It turns into solid lead particles inside the gears',
          'It vanishes completely from the universe',
          'It travels directly into outer space as cosmic rays'
        ],
        answerKey: 0,
        hint: 'Feel a motor or bicycle tyre after heavy use—what does it feel like?',
        explanation: 'Frictional resistance and air resistance cause mechanical energy to dissipate into thermal energy, heating the machinery and surrounding air.'
      },
      {
        id: 'ks3-sci-energy-5',
        prompt: 'An electric lightbulb receives 100 Joules of electrical energy. It produces 20 Joules of useful light energy and 80 Joules of thermal energy. What is its percentage efficiency?',
        options: [
          '20% (Efficiency = [Useful Energy Output / Total Energy Input] × 100)',
          '80%',
          '100%',
          '5%'
        ],
        answerKey: 0,
        hint: 'Efficiency = (Useful output / Total input) × 100.',
        explanation: 'Efficiency = (20 J useful light / 100 J total input) × 100 = 20%. The remaining 80% is dissipated as heat.'
      },
      {
        id: 'ks3-sci-energy-6',
        prompt: 'Through which process of thermal energy transfer does heat travel across empty vacuum space from the Sun to Planet Earth?',
        options: [
          'Thermal radiation (Infrared electromagnetic waves that require no particle medium)',
          'Thermal conduction (Vibrating particles passing energy through touch)',
          'Thermal convection (Circulating fluid density currents)',
          'Electrical resistance in space'
        ],
        answerKey: 0,
        hint: 'Space is a vacuum with no particles, so only electromagnetic waves can travel through it.',
        explanation: 'Radiation travels as infrared electromagnetic waves at the speed of light, requiring no medium or matter, unlike conduction and convection.'
      }
    ]
  },

  // --- KS3 English: Shakespeare: Key Themes ---
  'ks3:english:shakespeare-themes': {
    topicId: 'shakespeare-themes',
    title: 'Shakespeare: Key Themes',
    keyStage: 'Key Stage 3',
    subject: 'English',
    coreAxiom: 'Shakespearean drama explores enduring universal human conflicts: Ambition vs Morality (Macbeth), Love vs Family Feud (Romeo and Juliet), Appearance vs Reality (Much Ado / Hamlet), and Power and Order vs Chaos (The Tempest / Julius Caesar). Dramatic irony, soliloquies, and iambic pentameter reveal characters\' hidden psychology.',
    cognitiveTrap: 'Reading Shakespearean soliloquies as dialogue spoken to other characters rather than an unfiltered private window into a character\'s psychological conscience.',
    socraticPivot: 'In Macbeth, why does Shakespeare have Macbeth hallucinate a bloody dagger floating in the air right before he murders King Duncan?',
    hook: 'Why are stories written over 400 years ago still remade today into modern films like The Lion King (Hamlet) and West Side Story (Romeo & Juliet)?',
    guidedStep: '1. Identify character desires and fatal flaws (hamartia). 2. Track motif imagery (light/dark, blood, disease). 3. Connect the speech to the central universal theme.',
    scaffoldHints: {
      level1: 'Soliloquy: A speech where a character is alone on stage speaking their private thoughts to the audience.',
      level2: 'Dramatic Irony: When the audience knows a crucial secret that the characters on stage do not know yet.',
      level3: 'Theme of Ambition in Macbeth: Unchecked ambition causes moral downfall and destroys the natural order.'
    },
    questions: [
      {
        id: 'ks3-eng-shak-1',
        prompt: 'In Shakespearean drama, what is a "soliloquy"?',
        options: [
          'A speech delivered by a character alone on stage that reveals their inner thoughts and motives to the audience',
          'A rhyming argument between two rival characters on stage',
          'The musical song played at the start of every Shakespeare play',
          'A comedy scene performed by the lower-class characters'
        ],
        answerKey: 0,
        hint: 'The root "soli-" means alone (like solo).',
        explanation: 'A soliloquy is a dramatic device where a character speaks their private inner thoughts directly to the audience while alone on stage.'
      },
      {
        id: 'ks3-eng-shak-2',
        prompt: 'In dramatic literature, what is the definition of "Dramatic Irony"?',
        options: [
          'When the audience knows important information that a character on stage is unaware of',
          'When an actor forgets their lines during a live performance',
          'When a character tells an intentional joke to make someone laugh',
          'When the play ends with all characters celebrating together'
        ],
        answerKey: 0,
        hint: 'Think of Romeo believing Juliet is truly dead in the tomb when the audience knows she is only asleep.',
        explanation: 'Dramatic irony occurs when the audience possesses knowledge of events, secrets, or traps that the characters on stage do not yet realise.'
      },
      {
        id: 'ks3-eng-shak-3',
        prompt: 'In Shakespeare\'s tragedy "Macbeth", what is Macbeth\'s fatal character flaw (hamartia) that leads to his downfall?',
        options: [
          'Unchecked, ruthlessly vaulting ambition that overpowers his moral conscience',
          'Cowardice in battle and fear of sword fighting',
          'Extreme generosity with royal gold coins',
          'Refusing to listen to prophecies or superstitious omens'
        ],
        answerKey: 0,
        hint: 'Macbeth himself speaks of his "vaulting ambition which o\'erleaps itself".',
        explanation: 'Macbeth\'s hamartia is vaulting ambition: his desire for supreme royal power leads him to commit regicide and descend into tyrannical brutality.'
      },
      {
        id: 'ks3-eng-shak-4',
        prompt: 'In "Romeo and Juliet", what is the primary societal conflict that thwarts the two young lovers?',
        options: [
          'An ancient, bitter family feud between the noble houses of Montague and Capulet',
          'A war between England and Renaissance Verona',
          'A pirate invasion that closes the city gates of Mantua',
          'A legal ban on theatre performances ordered by the Duke'
        ],
        answerKey: 0,
        hint: 'The prologue opens: "Two households, both alike in dignity, In fair Verona... From ancient grudge break to new mutiny."',
        explanation: 'The ancient hatred and unresolved feud between the Montagues and Capulets prevents Romeo and Juliet from being together openly, driving the tragedy.'
      },
      {
        id: 'ks3-eng-shak-5',
        prompt: 'Which rhythmic poetic meter did Shakespeare predominantly use for noble characters\' speeches, consisting of 10 syllables per line in alternating unstressed and stressed beats?',
        options: [
          'Iambic Pentameter (da-DUM da-DUM da-DUM da-DUM da-DUM)',
          'Dactylic Hexameter',
          'Trochaic Monometer',
          'Free Verse with no meter'
        ],
        answerKey: 0,
        hint: '"Penta" means five pairs (10 beats) mimicking a human heartbeat.',
        explanation: 'Iambic pentameter consists of five metrical feet (iambs), each with an unstressed followed by a stressed syllable, mirroring the natural rhythm of English speech.'
      },
      {
        id: 'ks3-eng-shak-6',
        prompt: 'In Shakespeare\'s romance "The Tempest", what overarching moral theme is resolved when Prospero chooses to forgive his treacherous brother and break his magic staff?',
        options: [
          'Reconciliation and forgiveness over vengeance and retribution',
          'The superiority of royal tyranny over democracy',
          'The pursuit of material wealth above friendship',
          'The inevitable destruction of all human love'
        ],
        answerKey: 0,
        hint: 'Prospero famously declares: "The rarer action is in virtue than in vengeance."',
        explanation: 'Prospero renounces his magical powers and chooses mercy and forgiveness over revenge, embodying the central Shakespearean theme of reconciliation and restoration of natural order.'
      }
    ]
  },

  // --- KS3 English: Persuasive Writing & Rhetoric ---
  'ks3:english:persuasive-writing': {
    topicId: 'persuasive-writing',
    title: 'Persuasive Writing & Rhetoric',
    keyStage: 'Key Stage 3',
    subject: 'English',
    coreAxiom: 'Rhetorical persuasion crafts arguments to influence an audience using Aristotle\'s classical modes: Ethos (credibility/authority), Pathos (emotional appeal), and Logos (logic/evidence). Linguistic techniques are remembered via DAFOREST (Direct address, Alliteration, Facts, Opinions, Rhetorical questions, Emotive language, Statistics, Triples).',
    cognitiveTrap: 'Using only emotive exclamation marks without providing logical evidence (Logos) or addressing counter-arguments.',
    socraticPivot: 'Why is a speech that uses the "Rule of Three" (e.g. "blood, sweat, and tears") significantly more memorable to the human brain than a list of two or four items?',
    hook: 'From Martin Luther King Jr\'s "I Have a Dream" to modern climate activists, what makes certain speeches spark global revolutions?',
    guidedStep: '1. Hook the audience with a bold assertion. 2. Establish credibility. 3. Provide statistical evidence and real-world example. 4. Anticipate and refute the opposing view. 5. Call to action.',
    scaffoldHints: {
      level1: 'Rule of Three (Tricolon): Grouping 3 words or phrases creates musical rhythm and emphasis.',
      level2: 'Rhetorical question: A question asked for dramatic effect where the answer is already implied.',
      level3: 'Ethos = credibility; Pathos = empathy/emotion; Logos = facts and statistics.'
    },
    questions: [
      {
        id: 'ks3-eng-rhet-1',
        prompt: 'Which sentence demonstrates the rhetorical technique of "Direct Address"?',
        options: [
          '"You have the power in your hands to change this school today."',
          '"Many people around the country think uniform is traditional."',
          '"Statistics show that 75% of students prefer reading books."',
          '"The wind wailed and whispered through the cold trees."'
        ],
        answerKey: 0,
        hint: 'Direct address speaks straight to the reader or listener using second-person pronouns.',
        explanation: 'Direct address uses the pronouns "you" and "your" to speak directly to the audience, creating an immediate personal connection and responsibility.'
      },
      {
        id: 'ks3-eng-rhet-2',
        prompt: 'What is the persuasive purpose of including a "Rhetorical Question" in a campaigning speech?',
        options: [
          'To prompt the audience to reflect deeply on an idea where the desired answer is obvious and implied',
          'To gather poll numbers from listeners by raising their hands',
          'To show that the speaker does not know the facts of the topic',
          'To invite audience members to shout out answers during the presentation'
        ],
        answerKey: 0,
        hint: 'Rhetorical questions don\'t require a spoken answer; they guide the listener\'s thought.',
        explanation: 'A rhetorical question engages the listener\'s conscience, subtly nudging them toward the speaker\'s conclusion without expecting a verbal reply.'
      },
      {
        id: 'ks3-eng-rhet-3',
        prompt: 'Which sentence illustrates the "Rule of Three" (tricolon) for rhetorical emphasis?',
        options: [
          '"Together we can build a community that is safer, stronger, and fairer for everyone."',
          '"Together we can build a community that is safer."',
          '"Together we might build something or perhaps leave things unchanged."',
          '"Building communities requires bricklayers, cement mixers, scaffolding, architects, and permits."'
        ],
        answerKey: 0,
        hint: 'Look for three parallel adjectives delivering rhythmic impact.',
        explanation: 'Grouping words in triads ("safer, stronger, and fairer") creates rhythmic resonance that is proven to be more memorable and persuasive.'
      },
      {
        id: 'ks3-eng-rhet-4',
        prompt: 'In Aristotle\'s classic rhetorical triangle, what is "Logos"?',
        options: [
          'Appealing to reason and intellect through logical arguments, verified facts, and statistical data',
          'Appealing to raw emotion, pity, anger, or empathy',
          'Establishing the speaker\'s moral character, qualification, and credibility',
          'The graphic trademark symbol printed on an organization\'s letterhead'
        ],
        answerKey: 0,
        hint: 'Ethos = character/credibility, Pathos = passion/emotion, Logos = logic/facts.',
        explanation: 'Logos relies on rational logic, structured syllogisms, evidence, and statistics to convince an audience through sound reason.'
      },
      {
        id: 'ks3-eng-rhet-5',
        prompt: 'Which phrase is an example of "Emotive Language" intended to stir deep sympathy in the reader?',
        options: [
          '"Heartbroken and shivering in the freezing mud, the abandoned puppy whimpered for help."',
          '"The domestic canine was located at coordinates 51.5 degrees north."',
          '"On Tuesday morning at 8:00 AM, the animal shelter opened its doors."',
          '"The average four-legged pet requires approximately 400 grams of food daily."'
        ],
        answerKey: 0,
        hint: 'Look for strong evocative words like "heartbroken", "shivering", and "whimpered".',
        explanation: 'Emotive language deliberately selects loaded vocabulary ("heartbroken", "whimpered", "abandoned") to trigger emotional responses like compassion or outrage.'
      },
      {
        id: 'ks3-eng-rhet-6',
        prompt: 'In a persuasive essay or debate, what is the purpose of acknowledging a "Counter-argument" and then providing a "Rebuttal"?',
        options: [
          'To demonstrate balanced critical thinking by anticipating the opponent\'s view and then disproving it with superior evidence',
          'To admit that the opposing side is completely correct and abandon your argument',
          'To insult the opposing speaker personally without using facts',
          'To double the length of the essay with unrelated opinions'
        ],
        answerKey: 0,
        hint: 'Addressing the other side\'s objection strengthens your credibility.',
        explanation: 'A counter-argument shows you understand opposing perspectives, and a rebuttal systematically explains why that objection is flawed, making your thesis more persuasive.'
      }
    ]
  },

  // --- KS3 History: The Norman Conquest (1066) ---
  'ks3:history:norman-conquest': {
    topicId: 'norman-conquest',
    title: 'The Norman Conquest (1066)',
    keyStage: 'Key Stage 3',
    subject: 'History',
    coreAxiom: 'In 1066, the death of Edward the Confessor triggered a succession crisis between Harold Godwinson, Harald Hardrada, and William Duke of Normandy. Following the Battle of Stamford Bridge, William defeated Harold at the Battle of Hastings on 14 October 1066, fundamentally transforming England through the Feudal System, motte-and-bailey castles, and the Domesday Book.',
    cognitiveTrap: 'Believing the Norman Conquest was simply a military battle rather than a complete social, linguistic, and land-ownership revolution that replaced the Anglo-Saxon elite.',
    socraticPivot: 'Why did William order the creation of the Domesday Book in 1086, recording every cow, acre, and mill across England?',
    hook: 'Why do English speakers use Germanic words for living farm animals (cow, pig, sheep) but French words for the meat on the dinner plate (beef, pork, mutton)?',
    guidedStep: '1. Succession crisis of 1066. 2. Tactical advantages at Hastings (feigned retreat, cavalry vs shield wall). 3. Instruments of Norman control: Motte-and-Bailey castles, Harrying of the North, Feudal System, Domesday Book.',
    scaffoldHints: {
      level1: 'Battle of Hastings: 14 October 1066. William of Normandy defeated Harold Godwinson.',
      level2: 'Feigned retreat: Norman cavalry pretended to run away, tricking the Saxon shield wall into breaking ranks down Senlac Hill.',
      level3: 'The Domesday Book was a comprehensive census to ensure William could tax every manor and know who owned what land.'
    },
    questions: [
      {
        id: 'ks3-hist-norm-1',
        prompt: 'What was the primary purpose of William the Conqueror commissioning the Domesday Book in 1086?',
        options: [
          'To record every piece of land, wealth, and livestock in England to calculate exact feudal taxes and military service',
          'To write a religious prayer book for all English churches',
          'To teach the Anglo-Saxon population how to speak French',
          'To list names of soldiers who died at the Battle of Hastings'
        ],
        answerKey: 0,
        hint: 'William needed money to pay his knights and secure his kingdom.',
        explanation: 'The Domesday Book was an exhaustive kingdom-wide survey detailing landholders, resources, and livestock so William could accurately assess taxation and feudal obligations.'
      },
      {
        id: 'ks3-hist-norm-2',
        prompt: 'Which tactical manoeuvre did Norman cavalry famously use at the Battle of Hastings to break King Harold\'s solid Anglo-Saxon shield wall?',
        options: [
          'A feigned retreat: pretending to panic and flee, tricking Saxon warriors into chasing them down the hill',
          'Digging deep underground tunnels beneath Senlac Hill',
          'Setting fire to the surrounding forest with burning arrows',
          'Waiting until nightfall to attack while the Saxons were sleeping'
        ],
        answerKey: 0,
        hint: 'By pretending to run away, the Normans enticed the undisciplined Saxons to leave their high defensive formation.',
        explanation: 'William\'s cavalry feigned retreat, causing Saxon fyrd soldiers to break formation and run downhill in pursuit, where Norman horsemen surrounded and cut them down.'
      },
      {
        id: 'ks3-hist-norm-3',
        prompt: 'Why did the Normans rapidly construct hundreds of wooden "Motte-and-Bailey" castles immediately after invading England?',
        options: [
          'They could be built in a matter of weeks using earth and timber to intimidate hostile local populations and house garrisons',
          'They were permanent luxury pleasure palaces for French artists',
          'They were designed solely to store grain during winter snowstorms',
          'They were used as public hospitals to treat injured Anglo-Saxon civilians'
        ],
        answerKey: 0,
        hint: 'The Normans were heavily outnumbered and needed rapid defensive fortifications.',
        explanation: 'Motte-and-bailey castles were cheap, quick to erect (using earth mounds and timber palisades), and allowed a small garrison of Norman knights to dominate large local areas.'
      },
      {
        id: 'ks3-hist-norm-4',
        prompt: 'How did the "Feudal System" introduced by William the Conqueror organize land ownership and military loyalty in England?',
        options: [
          'All land belonged to the King, who leased vast estates to Barons in exchange for loyalty, taxes, and knights',
          'Land was distributed equally among all peasant farmers through annual democratic elections',
          'The Church owned 100% of all land and appointed all local village mayors',
          'Merchants bought land using foreign paper bank currency'
        ],
        answerKey: 0,
        hint: 'Think of the feudal pyramid: King at the top, Barons/Tenants-in-chief, Knights, and Peasants/Serfs at the bottom.',
        explanation: 'Under feudalism, the monarch owned all land and granted fiefs to loyal barons in return for military service (providing knights) and taxation.'
      },
      {
        id: 'ks3-hist-norm-5',
        prompt: 'What was the "Harrying of the North" (1069-1070) carried out by William the Conqueror?',
        options: [
          'A brutal scorched-earth campaign in northern England, burning crops, slaughtering livestock, and causing catastrophic famine to crush Saxon rebellions',
          'A grand national festival celebrating Anglo-Saxon and Norman cultural unity',
          'The construction of a vast stone wall along the Scottish border',
          'A trade agreement opening trade between York and Scandinavian merchants'
        ],
        answerKey: 0,
        hint: 'William systematically devastated Yorkshire and the north so no rebellion could ever be fed there again.',
        explanation: 'In the winter of 1069-1070, William crushed northern revolts by burning villages, salting fields, and destroying food stocks, leading to widespread famine and depopulation.'
      },
      {
        id: 'ks3-hist-norm-6',
        prompt: 'Which famous 70-metre-long embroidered textile provides historians with an invaluable contemporary visual narrative of the Norman Conquest of 1066?',
        options: [
          'The Bayeux Tapestry',
          'The Magna Carta',
          'The Lindisfarne Gospels',
          'The Book of Kells'
        ],
        answerKey: 0,
        hint: 'Commissioned by Bishop Odo of Bayeux, it depicts ships, knights, and the death of Harold.',
        explanation: 'The Bayeux Tapestry is a historic embroidered linen cloth illustrating scenes leading up to and including the Battle of Hastings in October 1066.'
      }
    ]
  },

  // --- KS3 History: The Transatlantic Slave Trade ---
  'ks3:history:transatlantic-slave-trade': {
    topicId: 'transatlantic-slave-trade',
    title: 'The Transatlantic Slave Trade',
    keyStage: 'Key Stage 3',
    subject: 'History',
    coreAxiom: 'Between the 16th and 19th centuries, European colonial powers operated the "Triangular Trade": manufactured goods from Europe to West Africa; enslaved African human beings transported across the catastrophic "Middle Passage" to the Americas; and slave-produced commodities (sugar, tobacco, cotton) transported back to Europe. Resistance, rebellion, and abolitionist campaigning eventually brought legal abolition.',
    cognitiveTrap: 'Viewing enslaved Africans as passive victims rather than recognising active everyday resistance, maritime rebellions, Maroon communities, and the Haitian Revolution.',
    socraticPivot: 'Why was the abolition of the British slave trade in 1807 achieved through a combination of enslaved rebellions in the Caribbean and grassroots public boycotts in Britain?',
    hook: 'Every spoonful of sugar in 18th-century British tea was tied directly to the brutality of Caribbean plantation labor and the Triangular Trade.',
    guidedStep: '1. Map the 3 legs of the Triangular Trade. 2. Understand the conditions of the Middle Passage. 3. Analyze plantation economy and resistance. 4. Study the abolition movement (Olaudah Equiano, Thomas Clarkson).',
    scaffoldHints: {
      level1: 'Triangular Trade: 1. Europe -> Africa (guns/cloth). 2. Africa -> Americas (enslaved people / Middle Passage). 3. Americas -> Europe (sugar/tobacco).',
      level2: 'The Middle Passage was the horrific transatlantic journey where millions endured malnutrition, disease, and brutality in ship holds.',
      level3: 'Abolitionists like Olaudah Equiano published first-hand autobiographies exposing the true brutality of enslavement to the British public.'
    },
    questions: [
      {
        id: 'ks3-hist-slave-1',
        prompt: 'In the 18th-century "Triangular Trade", what was transported along the second leg (the "Middle Passage") from West Africa to the Americas?',
        options: [
          'Enslaved African men, women, and children forced onto merchant slave ships',
          'Manufactured guns, metal pots, and textiles from British factories',
          'Refined white sugar and tobacco shipped to London markets',
          'Spices, silk, and tea from the East India Company'
        ],
        answerKey: 0,
        hint: 'The Middle Passage refers to the horrific voyage of human beings across the Atlantic Ocean.',
        explanation: 'The Middle Passage was the transatlantic voyage of the Triangular Trade in which millions of enslaved Africans were forcibly transported to plantation colonies in the Americas.'
      },
      {
        id: 'ks3-hist-slave-2',
        prompt: 'Which commodities produced by enslaved labour on Caribbean and American plantations were shipped back to Britain on the third leg of the Triangular Trade?',
        options: [
          'Raw sugar, tobacco, rum, and cotton',
          'Iron steam locomotives and steel tracks',
          'Horses and woollen blankets from Europe',
          'Tea, porcelain, and silk from China'
        ],
        answerKey: 0,
        hint: 'These were cash crops grown in tropical climates that fuelled European consumer luxury.',
        explanation: 'The final leg carried cash crops produced under brutal forced plantation labour—predominantly sugarcane, tobacco, coffee, and cotton—back to European markets.'
      },
      {
        id: 'ks3-hist-slave-3',
        prompt: 'Who was Olaudah Equiano and how did his work contribute to the abolition movement in Britain?',
        options: [
          'A formerly enslaved African author whose best-selling autobiography exposed the horrific realities of enslavement to the British public',
          'A wealthy Liverpool merchant who financed the construction of slave ships',
          'The British Prime Minister who signed the 1833 Emancipation Act',
          'A sea captain who navigated the first voyage of the Triangular Trade'
        ],
        answerKey: 0,
        hint: 'His 1789 book "The Interesting Narrative" became a powerful bestseller that humanised the struggle.',
        explanation: 'Olaudah Equiano purchased his freedom and wrote his vivid 1789 autobiography, touring Britain to mobilise public moral outrage against the slave trade.'
      },
      {
        id: 'ks3-hist-slave-4',
        prompt: 'How did enslaved Africans actively resist their captivity on plantation colonies?',
        options: [
          'Through armed rebellions, escaping to form free Maroon communities, sabotage of tools, and preserving cultural traditions',
          'By filing formal legal lawsuits in colonial courts of law',
          'By organizing strikes through modern trade unions',
          'Enslaved people never resisted because they accepted their status'
        ],
        answerKey: 0,
        hint: 'Resistance occurred on many levels: daily passive resistance, cultural survival, and major revolts like the Baptist War.',
        explanation: 'Enslaved people fought back continually through rebellions (e.g. Sam Sharpe\'s 1831 revolt), escapes to form Maroon societies, slowing work, breaking machinery, and keeping African culture alive.'
      },
      {
        id: 'ks3-hist-slave-5',
        prompt: 'In what year did the British Parliament pass the landmark Act that made the transatlantic trading of enslaved human beings illegal throughout the British Empire?',
        options: [
          '1807 (Abolition of the Slave Trade Act)',
          '1066',
          '1914',
          '1707'
        ],
        answerKey: 0,
        hint: 'The trade was abolished in 1807; full emancipation of enslaved people in colonies followed in 1833.',
        explanation: 'The Slave Trade Act of 1807 prohibited British ships from participating in the slave trade, though full emancipation of enslaved people in British territories came with the 1833 Act.'
      },
      {
        id: 'ks3-hist-slave-6',
        prompt: 'What was the name given to formerly enslaved people who escaped Caribbean and South American plantations to form autonomous, fortified mountain communities (such as in Jamaica)?',
        options: [
          'Maroons (such as Queen Nanny and the Jamaican Maroons)',
          'Abolitionists',
          'Privateers',
          'Indentured servants'
        ],
        answerKey: 0,
        hint: 'Led by heroic figures like Queen Nanny, they fought British forces to a standstill.',
        explanation: 'Maroons were self-liberated Africans who established independent settlements in remote mountains, repelling colonial armies and securing peace treaties.'
      }
    ]
  },

  // --- KS4 Physics: Radioactivity & Half-Life ---
  'ks4:physics:radioactivity': {
    topicId: 'radioactivity',
    title: 'Radioactivity & Half-Life',
    keyStage: 'Key Stage 4 (GCSE)',
    subject: 'Physics',
    coreAxiom: 'Unstable atomic nuclei undergo spontaneous, random radioactive decay to achieve stability, emitting ionising radiation: Alpha (α, helium nucleus, highly ionising, stopped by paper), Beta (β⁻, fast electron, moderately ionising, stopped by aluminium), or Gamma (γ, high-frequency EM wave, weakly ionising, reduced by thick lead). Half-life is the time taken for half the radioactive nuclei in a sample to decay, or for its activity (Bq) to halve.',
    cognitiveTrap: 'Thinking that after two half-lives a substance has completely decayed to zero (after 2 half-lives, 1/4 or 25% remains: 100% -> 50% -> 25%).',
    socraticPivot: 'If radioactive decay is completely random for any single nucleus, why can scientists predict the half-life of a billion nuclei with near-perfect mathematical precision?',
    hook: 'Carbon-14 dating allows archaeologists to determine the exact age of ancient Egyptian mummies and woolly mammoth bones thousands of years after death!',
    guidedStep: '1. Identify radiation types and penetration powers. 2. Half-life calculations: halve the quantity for each half-life interval elapsed. 3. Assess irradiation vs contamination hazards.',
    scaffoldHints: {
      level1: 'Penetration order: Alpha stopped by paper/skin. Beta stopped by 3-5mm aluminium. Gamma stopped by thick lead or metres of concrete.',
      level2: 'Half-life calculation: Start = 80 Bq. After 1 half-life = 40 Bq. After 2 half-lives = 20 Bq. After 3 half-lives = 10 Bq.',
      level3: 'Alpha particle = 2 protons + 2 neutrons. When emitted, mass number drops by 4, atomic number drops by 2.'
    },
    questions: [
      {
        id: 'ks4-phys-rad-1',
        prompt: 'A radioactive isotope has an initial activity of 240 Bq and a half-life of 6 hours. What will its activity be after 18 hours have passed?',
        options: [
          '30 Bq (18 hours is 3 half-lives: 240 -> 120 -> 60 -> 30)',
          '60 Bq (Only 2 half-lives)',
          '80 Bq (Divided by 3 instead of halving 3 times)',
          '0 Bq (Assumed all decayed)'
        ],
        answerKey: 0,
        hint: 'Step 1: Calculate how many half-lives: 18 ÷ 6 = 3 half-lives. Step 2: Halve 240 three times.',
        explanation: 'Number of half-lives = 18 hours / 6 hours = 3 half-lives. Activity after 1 half-life = 120 Bq; after 2 = 60 Bq; after 3 = 30 Bq.'
      },
      {
        id: 'ks4-phys-rad-2',
        prompt: 'Which type of ionising nuclear radiation has the lowest penetration power and can be completely stopped by a single sheet of paper or human skin?',
        options: [
          'Alpha radiation (α)',
          'Beta radiation (β)',
          'Gamma radiation (γ)',
          'X-ray radiation'
        ],
        answerKey: 0,
        hint: 'Alpha particles are large and heavy (helium nuclei) and ionise strongly, losing energy rapidly.',
        explanation: 'Alpha particles (two protons and two neutrons) interact strongly with matter due to their +2 charge and large mass, making them easily stopped by a sheet of paper.'
      },
      {
        id: 'ks4-phys-rad-3',
        prompt: 'What constitutes an Alpha (α) particle emitted during nuclear decay?',
        options: [
          'A helium nucleus consisting of 2 protons and 2 neutrons',
          'A high-speed electron ejected from the nucleus',
          'A high-frequency transverse electromagnetic wave',
          'A single isolated neutron with neutral charge'
        ],
        answerKey: 0,
        hint: 'Alpha decay reduces the mass number by 4 and atomic number by 2.',
        explanation: 'An alpha particle is identical to a helium-4 nucleus: 2 protons and 2 neutrons bound together, carrying a +2 elementary charge.'
      },
      {
        id: 'ks4-phys-rad-4',
        prompt: 'In radiological safety, what is the crucial difference between "irradiation" and "contamination"?',
        options: [
          'Irradiation is exposure to radiation from an external source without absorbing radioactive material; contamination occurs when radioactive atoms get onto or inside an object or person',
          'Contamination only happens from sunlight; irradiation only occurs in nuclear power stations',
          'Irradiation makes the exposed object permanently radioactive itself; contamination does not',
          'They are identical scientific terms describing the same physical event'
        ],
        answerKey: 0,
        hint: 'Irradiation is like standing near a lamp (the light hits you); contamination is getting paint on your clothes.',
        explanation: 'Irradiation is exposure to radiation (which ceases when you move away). Contamination means radioactive atoms are physically present on or inside you, continuing to decay.'
      },
      {
        id: 'ks4-phys-rad-5',
        prompt: 'Which of the following is the single largest natural contributor to the background radiation dose received by people living in the UK?',
        options: [
          'Radon gas seeping from radioactive uranium in rocks and soils (especially granite)',
          'Medical X-rays and CT scans in hospitals',
          'Fallout from historic atmospheric nuclear weapons testing',
          'Routine emissions from nuclear power stations'
        ],
        answerKey: 0,
        hint: 'This radioactive noble gas accumulates in basements in areas like Cornwall and Aberdeenshire.',
        explanation: 'Radon gas naturally emitted from decay of uranium in granitic rocks accounts for approximately 50% of the average UK resident\'s total background radiation dose.'
      },
      {
        id: 'ks4-phys-rad-6',
        prompt: 'During Beta-minus (β⁻) radioactive decay, what fundamental transformation occurs inside an unstable atomic nucleus?',
        options: [
          'A neutron changes into a proton, emitting a fast-moving electron (beta particle) and an antineutrino',
          'Two protons fuse together to form an alpha particle',
          'The nucleus splits in half by nuclear fission',
          'A proton turns into a neutron and emits a high-energy gamma photon'
        ],
        answerKey: 0,
        hint: 'Mass number stays the same, but the atomic (proton) number increases by 1.',
        explanation: 'In beta-minus decay, a neutron transforms into a proton, expelling a high-speed electron (the beta particle). This increases the atomic number (Z) by 1 while mass number (A) remains constant.'
      }
    ]
  },

  // --- KS4 Religious Studies: Christian Practices & Sacraments ---
  'ks4:religious-studies:christian-practices': {
    topicId: 'christian-practices',
    title: 'Christian Practices & Sacraments',
    keyStage: 'Key Stage 4 (GCSE)',
    subject: 'Religious Studies (General & GCSE)',
    coreAxiom: 'Christian practice expresses faith through worship (liturgical vs non-liturgical), prayer, pilgrimage (e.g. Lourdes, Iona), celebration of festivals (Christmas, Easter), and Sacraments. Catholic and Orthodox Christians recognize 7 Sacraments as outward signs of inward grace instituted by Christ; Protestant traditions recognize 2 (Baptism and Eucharist) as directly commanded in the Gospels.',
    cognitiveTrap: 'Assuming all Christian denominations view the Eucharist identically (Catholic Transubstantiation vs Anglican Real Presence vs Baptist symbolic memorialism).',
    socraticPivot: 'Why do Catholic Christians view Sacraments as imparting actual divine grace ("ex opere operato"), whereas many Protestant traditions view ordinances as symbolic memorials?',
    hook: 'Millions of sick pilgrims travel to the remote town of Lourdes in France every year to bathe in spring water. What spiritual conviction drives this pilgrimage?',
    guidedStep: '1. Define Sacrament (outward visible sign of inward invisible grace). 2. Compare Infant Baptism vs Believers\' Baptism. 3. Compare views on Holy Communion. 4. Mission and charity (Tearfund, CAFOD).',
    scaffoldHints: {
      level1: 'The two sacraments accepted by almost all Christian traditions are Baptism and the Eucharist (Holy Communion).',
      level2: 'Believers\' Baptism (Baptist church) requires personal mature confession of faith; Infant Baptism (Catholic/Anglican) welcomes the baby into the Church family.',
      level3: 'Transubstantiation (Catholic doctrine) teaches that the bread and wine become the actual Body and Blood of Christ in substance.'
    },
    questions: [
      {
        id: 'ks4-re-prac-1',
        prompt: 'In Christian theology, what is the classic definition of a "Sacrament"?',
        options: [
          'An outward, visible sign of an inward, invisible divine grace instituted by Jesus Christ',
          'A legal contract signed by church elders before marriage',
          'Any reading taken from the Old Testament prophets',
          'A financial donation given during Sunday collection'
        ],
        answerKey: 0,
        hint: 'St Augustine defined it as a visible sign of invisible grace.',
        explanation: 'A Sacrament is traditionally defined as an outward and visible sign of an inward and spiritual divine grace, established by Jesus Christ.'
      },
      {
        id: 'ks4-re-prac-2',
        prompt: 'Why do Baptist churches practice "Believers\' Baptism" (Credobaptism) rather than Infant Baptism (Paedobaptism)?',
        options: [
          'They believe that baptism requires a conscious, mature, personal confession of faith and repentance from sins',
          'They believe infants are incapable of receiving water on their heads',
          'They believe baptism was invented by medieval monks',
          'They only allow people over sixty years old into churches'
        ],
        answerKey: 0,
        hint: 'Baptists argue Jesus was baptized as an adult in the River Jordan after making his own choice.',
        explanation: 'Baptists uphold Believers\' Baptism because they believe baptism is a personal declaration of faith that only a mature individual capable of repentance can make.'
      },
      {
        id: 'ks4-re-prac-3',
        prompt: 'What does the Catholic doctrine of "Transubstantiation" teach about the bread and wine during the Eucharistic Prayer at Mass?',
        options: [
          'The underlying substance truly and substantially becomes the Body and Blood of Jesus Christ, while the physical appearances (accidents) of bread and wine remain',
          'The bread and wine are merely symbolic metaphors with no spiritual change whatsoever',
          'The bread turns into physical solid gold on the altar',
          'The bread and wine only become holy if all congregation members are sinless'
        ],
        answerKey: 0,
        hint: 'Substance changes into Christ\'s real presence, while the visible appearances (taste, texture) remain.',
        explanation: 'Catholic doctrine teaches Transubstantiation: through the Holy Spirit and words of consecration, the substance becomes the actual Body and Blood of Christ (the Real Presence).'
      },
      {
        id: 'ks4-re-prac-4',
        prompt: 'Why do thousands of Catholic pilgrims, particularly sick and disabled people, travel each year on pilgrimage to the sanctuary of Lourdes in France?',
        options: [
          'To pray for spiritual healing, bathe in the spring waters where St Bernadette saw visions of Mary, and strengthen their faith',
          'To go hiking in the French Alps for sport',
          'To purchase antique Catholic artwork and gold jewellery',
          'To attend an international sports tournament'
        ],
        answerKey: 0,
        hint: 'St Bernadette experienced Marian apparitions at the Grotto of Massabielle in 1858.',
        explanation: 'Lourdes is a major Marian shrine where pilgrims seek physical, emotional, and spiritual healing, and celebrate solidarity with the sick through prayer and bathing.'
      },
      {
        id: 'ks4-re-prac-5',
        prompt: 'How does the Catholic international aid agency CAFOD (Catholic Agency for Overseas Development) put Christian faith into action around the world?',
        options: [
          'By providing emergency humanitarian disaster relief and supporting long-term sustainable development to tackle poverty and injustice regardless of religion',
          'By funding political candidates in foreign elections',
          'By building private holiday resorts for church leaders',
          'By forcing communities to convert before delivering clean drinking water'
        ],
        answerKey: 0,
        hint: 'Faith in action means loving your global neighbour in response to Jesus\'s Gospel teachings.',
        explanation: 'CAFOD works in over 40 countries tackling global poverty, responding to natural disasters, and campaigning for climate and economic justice inspired by Catholic Social Teaching.'
      },
      {
        id: 'ks4-re-prac-6',
        prompt: 'Why is Easter considered the most significant festival in the Christian liturgical calendar?',
        options: [
          'It celebrates the Resurrection of Jesus Christ from the dead, representing the triumph of divine love over sin and death and offering the promise of eternal life',
          'It marks the beginning of the secular calendar new year',
          'It commemorates the building of the first stone church in Rome',
          'It celebrates the discovery of the Ten Commandments on Mount Sinai'
        ],
        answerKey: 0,
        hint: 'Easter commemorates Christ conquering death on Easter Sunday.',
        explanation: 'Easter is the pinnacle of the Christian faith because Jesus\'s Resurrection confirms his divinity, fulfils Scripture, and offers salvation and hope of eternal life to believers.'
      }
    ]
  }
};


