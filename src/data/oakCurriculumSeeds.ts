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

  // --- KEY STAGE 2: RELIGIOUS EDUCATION (CATHOLIC FIRST COMMUNION) ---
  'ks2:re:1:baptism': {
    seedId: 'ks2:re:1:baptism',
    keyStage: 'ks2',
    subject: 'religious-education-catholic',
    unitTitle: 'Sacraments of Initiation',
    topicTitle: 'Baptism: Belonging to the Family of God',
    coreAxiom: 'Baptism frees us from original sin and rebirths us as children of God into the Catholic Church.',
    cognitiveTrap: 'Treating Baptism as merely a naming party rather than a real spiritual transformation.',
    socraticPivot: 'What do the holy water and white garment reveal about God washing our soul clean?',
    fallbackAST: '(:route "lesson:view" :axiom "Baptism frees from original sin and welcomes into God\'s family." :trap "Seeing Baptism as just a baby celebration." :pivot "What does the holy water wash clean?")'
  },
  'ks2:re:2:reconciliation': {
    seedId: 'ks2:re:2:reconciliation',
    keyStage: 'ks2',
    subject: 'religious-education-catholic',
    unitTitle: 'First Reconciliation',
    topicTitle: 'God’s Healing Mercy & Absolution',
    coreAxiom: 'Through the priest\'s absolution, Jesus forgives our sins and heals our friendship with God and the Church.',
    cognitiveTrap: 'Fearing Confession as punishment rather than encountering Jesus the Good Shepherd.',
    socraticPivot: 'Why did Jesus give priests the power to forgive sins in His holy name?',
    fallbackAST: '(:route "lesson:view" :axiom "Reconciliation forgives sins through Christ\'s absolution." :trap "Fearing Confession as punishment." :pivot "How does Jesus heal our friendship when we say sorry?")'
  },
  'ks2:re:3:liturgy-word': {
    seedId: 'ks2:re:3:liturgy-word',
    keyStage: 'ks2',
    subject: 'religious-education-catholic',
    unitTitle: 'The Order of Mass',
    topicTitle: 'The Liturgy of the Word',
    coreAxiom: 'In the Liturgy of the Word, God speaks directly to His people through Sacred Scripture and the Holy Gospel.',
    cognitiveTrap: 'Believing Bible readings are just old stories rather than God speaking to us today.',
    socraticPivot: 'Why do we stand and sing Alleluia when the Holy Gospel is proclaimed?',
    fallbackAST: '(:route "lesson:view" :axiom "God speaks directly through Sacred Scripture and the Gospel." :trap "Viewing readings as historical fiction." :pivot "Why do we stand for the Gospel?")'
  },
  'ks2:re:4:last-supper': {
    seedId: 'ks2:re:4:last-supper',
    keyStage: 'ks2',
    subject: 'religious-education-catholic',
    unitTitle: 'First Holy Communion',
    topicTitle: 'The Last Supper: Do This in Memory of Me',
    coreAxiom: 'At the Last Supper, Jesus gave His Apostles His true Body and Blood and commanded them to celebrate it perpetually.',
    cognitiveTrap: 'Thinking the Last Supper was just an ordinary farewell dinner.',
    socraticPivot: 'What did Jesus mean when He broke the bread and said "This is my body"?',
    fallbackAST: '(:route "lesson:view" :axiom "Jesus gave His true Body and Blood at the Last Supper." :trap "Calling it an ordinary farewell meal." :pivot "What did Jesus say when breaking the bread?")'
  },
  'ks2:re:5:eucharist': {
    seedId: 'ks2:re:5:eucharist',
    keyStage: 'ks2',
    subject: 'religious-education-catholic',
    unitTitle: 'First Holy Communion',
    topicTitle: 'The Eucharist: The Real Presence & Transubstantiation',
    coreAxiom: 'Through Transubstantiation, the bread and wine become truly the Body, Blood, Soul, and Divinity of Jesus Christ.',
    cognitiveTrap: 'Believing the consecrated Host is only a symbol or wafer representing Jesus.',
    socraticPivot: 'What has the host become in reality after the priest consecrates it?',
    fallbackAST: '(:route "lesson:view" :axiom "Bread and wine become truly Christ\'s Body, Blood, Soul, and Divinity." :trap "Thinking the Host is merely a symbol." :pivot "What is the true reality of the consecrated Host?")'
  },
  'ks2:re:6:order-mass': {
    seedId: 'ks2:re:6:order-mass',
    keyStage: 'ks2',
    subject: 'religious-education-catholic',
    unitTitle: 'The Order of Mass',
    topicTitle: 'Receiving Holy Communion Reverently',
    coreAxiom: 'We fast for one hour, approach reverently, respond "Amen", and offer quiet thanksgiving to Jesus in our hearts.',
    cognitiveTrap: 'Receiving Communion casually or answering "Thank you" instead of "Amen".',
    socraticPivot: 'Why do we answer "Amen" when the priest says "The Body of Christ"?',
    fallbackAST: '(:route "lesson:view" :axiom "We fast, respond Amen, and pray in thanksgiving." :trap "Receiving casually without prayer." :pivot "What does Amen mean when receiving Christ?")'
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