export const VFS_CURRICULUM_SEEDS: Record<string, string> = {
  // --- PRIMARY CURRICULUM ---

  // Primary Mathematics: Fractions
  '/sys/views/math_fractions.lisp': `(view :className "card padding--md margin-vert--md"
  (header :level 3 "Primary Mathematics: Fractions & Decimals")
  (callout :variant "info" "A fraction represents equal parts of a whole.")
  (stepper
    (step (text "Step 1: Understand that 1/4 means 1 divided into 4 equal parts."))
    (step (text "Step 2: Dividing 1.00 by 4 gives 0.25."))
    (step (text "Step 3: Multiply 0.25 by 3 to find 3/4 = 0.75.")))
  (quiz :id "math-frac-101"
    (question "What is 3/4 expressed as a decimal?")
    (option "0.34")
    (option :correct true "0.75")
    (option "0.43")
    (explanation "3/4 = 3 ÷ 4 = 0.75."))
  (ai-tutor :persona "Hypatia" :engine "Gemini Nano" :greeting "Let's explore fractions! Ask me anything about numerators and denominators."))`,

  // Primary Science: Plant Photosynthesis
  '/sys/views/sci_plants.lisp': `(view :className "card padding--md margin-vert--md"
  (header :level 3 "Primary Science: How Plants Make Food")
  (callout :variant "success" "Photosynthesis is the process plants use to convert sunlight into energy.")
  (stepper
    (step (text "Step 1: Roots absorb water and minerals from the soil."))
    (step (text "Step 2: Leaves absorb carbon dioxide from the air."))
    (step (text "Step 3: Chlorophyll captures sunlight to create glucose and release oxygen.")))
  (quiz :id "sci-plant-101"
    (question "Which gas do plants release into the air during photosynthesis?")
    (option "Carbon Dioxide")
    (option :correct true "Oxygen")
    (option "Nitrogen")
    (explanation "Plants absorb carbon dioxide and release oxygen as a byproduct."))
  (ai-tutor :persona "Dr. Carver" :engine "Gemini Nano" :greeting "Welcome to biology! How can I help you understand plant growth?"))`,

  // Primary English: Parts of Speech
  '/sys/views/eng_grammar.lisp': `(view :className "card padding--md margin-vert--md"
  (header :level 3 "Primary English: Identifying Nouns and Verbs")
  (callout :variant "info" "A noun is a person, place, or thing. A verb is an action word.")
  (stepper
    (step (text "Step 1: Locate the word describing what is happening (Action = Verb)."))
    (step (text "Step 2: Locate the person, place, or object performing the action (Naming word = Noun)."))
    (step (text "Step 3: In 'The cat leaped', 'cat' is the noun and 'leaped' is the verb.")))
  (quiz :id "eng-gram-101"
    (question "Identify the verb in the sentence: 'The astronaut floated into the spacecraft.'")
    (option "astronaut")
    (option :correct true "floated")
    (option "spacecraft")
    (explanation "'Floated' describes the action taking place."))
  (ai-tutor :persona "Shakespeare" :engine "Gemini Nano" :greeting "Hark! Let us explore language and grammar together. What shall we analyze?"))`,

  // Primary Computing: Sequencing & Algorithms
  '/sys/views/comp_algorithms.lisp': `(view :className "card padding--md margin-vert--md"
  (header :level 3 "Primary Computing: Algorithms & Sequencing")
  (callout :variant "info" "An algorithm is a precise set of step-by-step instructions to solve a problem.")
  (stepper
    (step (text "Step 1: Break down the goal into single, unambiguous steps."))
    (step (text "Step 2: Order the instructions sequentially."))
    (step (text "Step 3: Identify bugs if the output does not match expectations.")))
  (quiz :id "comp-algo-101"
    (question "What happens if instructions in an algorithm are executed out of order?")
    (option "The computer runs faster")
    (option :correct true "The algorithm produces unexpected errors or bugs")
    (option "Nothing changes")
    (explanation "Computers follow instructions linearly; altering sequence alters the final result."))
  (ai-tutor :persona "Ada Lovelace" :engine "Gemini Nano" :greeting "Welcome to computation! How can I assist your algorithm design today?"))`,

  // --- SECONDARY / GCSE CURRICULUM ---

  // Secondary Physics: Newton's Laws
  '/sys/views/physics_forces.lisp': `(view :className "card padding--md margin-vert--md"
  (header :level 3 "GCSE Physics: Newton's Second Law of Motion")
  (callout :variant "warning" "Force equals mass times acceleration: F = m × a.")
  (stepper
    (step (text "Step 1: Identify mass (m) measured in kilograms (kg)."))
    (step (text "Step 2: Identify acceleration (a) measured in meters per second squared (m/s²)."))
    (step (text "Step 3: Multiply mass by acceleration to compute force (F) in Newtons (N).")))
  (quiz :id "phys-newton-201"
    (question "What force is required to accelerate a 2 kg mass at 5 m/s²?")
    (option "7 N")
    (option :correct true "10 N")
    (option "2.5 N")
    (explanation "Using F = m × a: F = 2 kg × 5 m/s² = 10 N."))
  (ai-tutor :persona "Sir Isaac" :engine "Gemini Nano" :greeting "Greetings. What queries do you have regarding the laws of motion?"))`,

  // Secondary Chemistry: Atomic Structure
  '/sys/views/chem_atoms.lisp': `(view :className "card padding--md margin-vert--md"
  (header :level 3 "GCSE Chemistry: Atomic Structure")
  (callout :variant "info" "Atoms consist of protons, neutrons, and electrons.")
  (stepper
    (step (text "Step 1: Protons (positive) and neutrons (neutral) reside in the nucleus."))
    (step (text "Step 2: Electrons (negative) orbit in electron shells."))
    (step (text "Step 3: Atomic number equals the number of protons.")))
  (quiz :id "chem-atom-201"
    (question "Which subatomic particle has a negative electric charge?")
    (option "Proton")
    (option "Neutron")
    (option :correct true "Electron")
    (explanation "Electrons carry a negative relative charge (-1) and orbit the nucleus."))
  (ai-tutor :persona "Marie Curie" :engine "Gemini Nano" :greeting "Let's explore atomic structure. What subatomic concepts would you like to clarify?"))`,

  // Secondary Biology: Cell Structure
  '/sys/views/bio_cells.lisp': `(view :className "card padding--md margin-vert--md"
  (header :level 3 "GCSE Biology: Plant vs Animal Cells")
  (callout :variant "success" "Eukaryotic cells contain specialized organelles, some unique to plants.")
  (stepper
    (step (text "Step 1: Animal and plant cells both contain a nucleus, cytoplasm, and mitochondria."))
    (step (text "Step 2: Plant cells also have a cellulose cell wall, permanent vacuole, and chloroplasts."))
    (step (text "Step 3: Chloroplasts facilitate photosynthesis.")))
  (quiz :id "bio-cell-201"
    (question "Which organelle is found in plant cells but NOT in animal cells?")
    (option "Mitochondria")
    (option "Nucleus")
    (option :correct true "Chloroplast")
    (explanation "Chloroplasts contain chlorophyll for photosynthesis and are exclusive to plant cells."))
  (ai-tutor :persona "Rosalind Franklin" :engine "Gemini Nano" :greeting "Let's investigate cellular biology. What structure should we inspect?"))`,

  // Secondary History: Socratic Source Analysis
  '/sys/views/hist_sources.lisp': `(view :className "card padding--md margin-vert--md"
  (header :level 3 "GCSE History: Primary vs Secondary Sources")
  (callout :variant "warning" "Historical analysis requires evaluating provenance, bias, and context.")
  (stepper
    (step (text "Step 1: Primary sources are direct first-hand evidence created during the period."))
    (step (text "Step 2: Secondary sources interpret, analyze, or synthesize primary records later."))
    (step (text "Step 3: Assess the author's motive and perspective to gauge reliability.")))
  (quiz :id "hist-src-201"
    (question "Which of the following is an example of a primary source?")
    (option "A modern history textbook chapter on WWI")
    (option :correct true "A soldier's diary written from the trenches in 1916")
    (option "A documentary produced in 2014")
    (explanation "A wartime diary is direct, contemporaneous evidence written at the time of the event."))
  (ai-tutor :persona "Herodotus" :engine "Gemini Nano" :greeting "Greetings, scholar. What historical artifacts or eras shall we scrutinize?"))`,
};