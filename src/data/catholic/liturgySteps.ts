// src/data/catholic/liturgySteps.ts
// St Joseph's Catholic Life & Faith Sanctuary
// Holy Mass Liturgy Walkthrough & Sequencing Order

export interface LiturgyStep {
  id: string;
  part: 'Introductory Rites' | 'Liturgy of the Word' | 'Liturgy of the Eucharist' | 'Concluding Rites';
  title: string;
  gesture: string;
  mystery: string;
  dialogue?: {
    priest: string;
    response: string;
  };
  catechismRef?: string;
  audioPrompt?: string;
}

export const LITURGY_STEPS: LiturgyStep[] = [
  {
    id: 'entrance-sign-cross',
    part: 'Introductory Rites',
    title: 'Gathering & Sign of the Cross',
    gesture: 'Standing tall, reverently making the Sign of the Cross from forehead to chest, left shoulder to right shoulder.',
    mystery: 'We gather as the Family of God, beginning everything in the Name of the Father, and of the Son, and of the Holy Spirit.',
    dialogue: {
      priest: 'The grace of our Lord Jesus Christ, and the love of God, and the communion of the Holy Spirit be with you all.',
      response: 'And with your spirit.'
    },
    catechismRef: 'CCC 1348',
    audioPrompt: 'The grace of our Lord Jesus Christ be with you all. And with your spirit.'
  },
  {
    id: 'penitential-act',
    part: 'Introductory Rites',
    title: 'Penitential Act & Kyrie Eleison',
    gesture: 'Bowing our heads humbly, striking our chest gently at "through my fault".',
    mystery: 'We honestly ask Jesus to forgive our faults so we can prepare our hearts to encounter Him worthily.',
    dialogue: {
      priest: 'Lord, have mercy.',
      response: 'Lord, have mercy. Christ, have mercy. Lord, have mercy.'
    },
    catechismRef: 'CCC 1422',
    audioPrompt: 'Lord have mercy. Christ have mercy. Lord have mercy.'
  },
  {
    id: 'gospel-proclamation',
    part: 'Liturgy of the Word',
    title: 'The Holy Gospel of Jesus Christ',
    gesture: 'Standing in honour. With our right thumb, we trace a small cross on our forehead ("Word in my mind"), lips ("Word on my lips"), and heart ("Word in my heart").',
    mystery: 'Jesus Himself speaks directly to us. He is alive and present in His Holy Word.',
    dialogue: {
      priest: 'A reading from the holy Gospel according to Luke.',
      response: 'Glory to you, O Lord!'
    },
    catechismRef: 'CCC 1154',
    audioPrompt: 'A reading from the holy Gospel. Glory to you, O Lord!'
  },
  {
    id: 'offertory-presentation',
    part: 'Liturgy of the Eucharist',
    title: 'The Presentation of the Gifts (Offertory)',
    gesture: 'Sitting reverently as members of the parish bring the bread, wine cruets, and our collection to the altar.',
    mystery: 'We offer God the simple bread and wine produced by human hands, together with our own prayers, work, and joys.',
    dialogue: {
      priest: 'Blessed are you, Lord God of all creation, for through your goodness we have received the bread we offer you...',
      response: 'Blessed be God for ever.'
    },
    catechismRef: 'CCC 1350',
    audioPrompt: 'Blessed be God for ever.'
  },
  {
    id: 'consecration-transubstantiation',
    part: 'Liturgy of the Eucharist',
    title: 'Consecration & Transubstantiation',
    gesture: 'Kneeling on both knees in total adoration. Silence fills the church as the bells chime.',
    mystery: 'Through the words of Jesus spoken by the priest and the power of the Holy Spirit, the bread and wine become truly the Body, Blood, Soul, and Divinity of Jesus Christ.',
    dialogue: {
      priest: 'TAKE THIS, ALL OF YOU, AND EAT OF IT, FOR THIS IS MY BODY, WHICH WILL BE GIVEN UP FOR YOU.',
      response: '(Silent awe and adoration: "My Lord and my God!")'
    },
    catechismRef: 'CCC 1374-1377',
    audioPrompt: 'Take this, all of you, and eat of it, for this is my body.'
  },
  {
    id: 'centurion-prayer',
    part: 'Liturgy of the Eucharist',
    title: 'The Centurion’s Prayer & Invitation',
    gesture: 'Striking chest gently with right hand in humble contrition.',
    mystery: 'Like the Roman Centurion in the Gospel, we recognise that while we are imperfect, Jesus can heal our souls with a single word.',
    dialogue: {
      priest: 'Behold the Lamb of God, behold him who takes away the sins of the world. Blessed are those called to the supper of the Lamb.',
      response: 'Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed.'
    },
    catechismRef: 'CCC 1386',
    audioPrompt: 'Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed.'
  },
  {
    id: 'holy-communion-reception',
    part: 'Liturgy of the Eucharist',
    title: 'Receiving Holy Communion & Thanksgiving',
    gesture: 'Walking forward with hands joined. When approaching, bow reverently. Place left hand over right hand as a "throne for the King". Say a clear "Amen!", receive the Host, consume it immediately, and return to your pew to kneel in quiet thanksgiving.',
    mystery: 'Jesus unites Himself to us intimately, dwelling in our heart and feeding our soul with eternal life.',
    dialogue: {
      priest: 'The Body of Christ.',
      response: 'Amen!'
    },
    catechismRef: 'CCC 1385-1387',
    audioPrompt: 'The Body of Christ. Amen!'
  },
  {
    id: 'final-dismissal',
    part: 'Concluding Rites',
    title: 'Final Blessing & Commissioning',
    gesture: 'Standing tall, making the Sign of the Cross with the priest’s blessing, and preparing to live as disciples.',
    mystery: 'Having received Christ, we are sent out into our school, family, and community to love, serve, and radiate Jesus.',
    dialogue: {
      priest: 'Go in peace, glorifying the Lord by your life.',
      response: 'Thanks be to God!'
    },
    catechismRef: 'CCC 1332',
    audioPrompt: 'Go in peace, glorifying the Lord by your life. Thanks be to God!'
  }
];

export const CORRECT_LITURGY_SEQUENCE_IDS: string[] = [
  'entrance-sign-cross',
  'penitential-act',
  'gospel-proclamation',
  'offertory-presentation',
  'consecration-transubstantiation',
  'centurion-prayer',
  'holy-communion-reception',
  'final-dismissal',
];
