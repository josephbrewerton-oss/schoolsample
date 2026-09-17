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
      }
    ]
  }
};


