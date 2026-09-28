// src/data/catholic/sanctuaryQuests.ts
// St Joseph's Catholic Life & Faith Sanctuary
// 3D Sanctuary Tour Stations & Pilgrim Quests

export interface StationQuest {
  id: string;
  stationNum: number;
  targetT: number;
  name: string;
  latinName: string;
  relicName: string;
  relicIcon: string;
  themeColor: string;
  riddle: string;
  theologicalSignificance: string;
  actionGuidance: string;
  question: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    scriptureRef: string;
  };
}

export const SANCTUARY_QUESTS: StationQuest[] = [
  {
    id: 'narthex',
    stationNum: 1,
    targetT: 0.00,
    name: 'The Narthex & Holy Water Stoup',
    latinName: 'Vestibulum & Aqua Benedicta',
    relicName: 'Aqua Benedicta',
    relicIcon: '💧',
    themeColor: '#0284c7',
    riddle: 'Before crossing into God’s sacred sanctuary, pilgrims must wash away worldly distractions. Find where the sanctified water waits at the entrance to remind us of our Holy Baptism.',
    theologicalSignificance: 'The Narthex acts as a transitional threshold between the secular world and the sacred dwelling of God. Holy water recalls the Sacrament of Baptism through which we became children of God.',
    actionGuidance: 'Dip your right hand into the holy water and make the Sign of the Cross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen."',
    question: {
      prompt: 'Why do Catholics bless themselves with Holy Water making the Sign of the Cross upon entering a church?',
      options: [
        'To wash their hands before touching hymn books',
        'To recall our Baptism and re-dedicate our minds, hearts, and bodies to the Trinity',
        'It is a medieval greeting to the church wardens',
        'To check the water temperature for parish baptisms'
      ],
      correctIndex: 1,
      explanation: 'Holy Water is a sacramental that recalls our Holy Baptism, reminding us that we belong to God and enter His house cleansed by His grace.',
      scriptureRef: 'Ezekiel 36:25 — "I will sprinkle clean water upon you, and you shall be clean from all your uncleannesses."'
    }
  },
  {
    id: 'nave',
    stationNum: 2,
    targetT: 0.20,
    name: 'The Nave & Central Aisle',
    latinName: 'Navis Ecclesiae',
    relicName: 'Navis Petri',
    relicIcon: '⛵',
    themeColor: '#7c3aed',
    riddle: 'Named from the ancient Latin word for "ship", this grand space carries the congregation forward together. Find the long central aisle where our wooden pews stand facing the Sanctuary.',
    theologicalSignificance: 'The Nave represents the Barque of St Peter carrying the Pilgrim People of God across the stormy seas of life safely towards the eternal shore of Heaven.',
    actionGuidance: 'Before stepping into your pew, pause in the aisle facing the Tabernacle and genuflect on your right knee down to the floor, honoring Jesus truly present.',
    question: {
      prompt: 'Which posture of reverence do Catholics adopt before entering their pew in the Nave, and why?',
      options: [
        'A quick wave toward the organ loft',
        'We genuflect down to the floor on our right knee in royal homage to Christ in the Tabernacle',
        'We bow to the person sitting next to us',
        'We remain standing with folded hands without bending our knees'
      ],
      correctIndex: 1,
      explanation: 'Genuflection (bending the right knee) is an ancient royal homage. Because Christ the King is truly present in the Tabernacle, we humble ourselves before Him.',
      scriptureRef: 'Philippians 2:10 — "That at the name of Jesus every knee should bend, in heaven and on earth and under the earth."'
    }
  },
  {
    id: 'ambo',
    stationNum: 3,
    targetT: 0.40,
    name: 'The Ambo (Table of the Word)',
    latinName: 'Mensa Verbi Dei',
    relicName: 'Verbum Domini',
    relicIcon: '📖',
    themeColor: '#2563eb',
    riddle: 'Faith comes from hearing! Find the elevated, dignified lectern from which the Sacred Scriptures, Responsorial Psalm, and the Holy Gospel are proclaimed to all the faithful.',
    theologicalSignificance: 'The Ambo is consecrated exclusively for the proclamation of Sacred Scripture. Together with the Altar, it forms the two tables from which the Church feeds the faithful: the Table of the Word and the Table of the Eucharist.',
    actionGuidance: 'When the Priest or Deacon introduces the Holy Gospel, we trace a small Sign of the Cross with our thumb on our forehead, lips, and breast: "May the Word of God be in my mind, on my lips, and in my heart."',
    question: {
      prompt: 'What is the sacred theological title given to the Ambo alongside the Altar of the Eucharist?',
      options: [
        'The Speaker Platform',
        'The Table of the Word (Mensa Verbi)',
        'The Choral Rood Screen',
        'The Credence Stand'
      ],
      correctIndex: 1,
      explanation: 'Vatican II teaches that the Church constantly feeds the faithful from two sacred tables: the Table of God’s Word (Ambo) and the Table of Christ’s Body (Altar).',
      scriptureRef: 'Hebrews 4:12 — "Indeed, the word of God is living and active, sharper than any two-edged sword."'
    }
  },
  {
    id: 'altar',
    stationNum: 4,
    targetT: 0.60,
    name: 'The Altar of Sacrifice',
    latinName: 'Altare Christi',
    relicName: 'Altare Vivum',
    relicIcon: '🕯️',
    themeColor: '#d97706',
    riddle: 'This is the sacred heart of the sanctuary, consecrated with holy chrism and representing Christ Himself. Find the table where bread and wine become the Real Body and Blood of Jesus.',
    theologicalSignificance: 'The Altar is both a sacrificial altar on which Christ’s sacrifice on Calvary is made present, and the banquet table of the Lord where the faithful receive Holy Communion.',
    actionGuidance: 'Whenever we walk past the Altar of Sacrifice outside of Mass, we make a profound bow of the body (from the waist) to reverence Christ represented by the altar stone.',
    question: {
      prompt: 'Why does the priest kiss the Altar of Sacrifice at the start and conclusion of the Holy Mass?',
      options: [
        'To see if the altar linen is freshly laundered',
        'Because the Altar is a consecrated symbol representing Christ Himself and contains holy relics of the saints',
        'It is an ancient Roman theatrical cue',
        'To signal the altar servers to ring the bells'
      ],
      correctIndex: 1,
      explanation: 'The Altar is venerated with a kiss because it represents Christ—the Priest, the Altar, and the Lamb of Sacrifice. Historically, it also encloses relics of holy martyrs.',
      scriptureRef: '1 Corinthians 10:21 — "You cannot partake of the table of the Lord and the table of demons."'
    }
  },
  {
    id: 'tabernacle',
    stationNum: 5,
    targetT: 0.80,
    name: 'The Tabernacle & Sanctuary Lamp',
    latinName: 'Tabernaculum Domini',
    relicName: 'Panis Vivus',
    relicIcon: '✨',
    themeColor: '#dc2626',
    riddle: 'Look toward the luminous golden ark crowned with a cross. Beside it, an eternal red flame burns day and night. Find the dwelling place where the Blessed Sacrament is reserved.',
    theologicalSignificance: 'The word "Tabernacle" means "tent" or "dwelling place", reminiscent of the Ark of the Covenant. Here, consecrated Eucharistic hosts are reserved for Communion to the sick and for perpetual adoration.',
    actionGuidance: 'Whenever entering or leaving the presence of the Tabernacle, we maintain a quiet, reverent silence, keeping in mind: "Christ is truly present in this room right now."',
    question: {
      prompt: 'What does the constantly burning red Sanctuary Lamp indicate to everyone inside the church?',
      options: [
        'That the church electrical system is operating',
        'That Jesus Christ is truly, sacramentally present in the Blessed Sacrament inside the Tabernacle',
        'That a wedding service is taking place',
        'That the parish doors are about to be locked'
      ],
      correctIndex: 1,
      explanation: 'The Sanctuary Lamp (Sanctuary Light) burns continuously with an oil or wax candle to testify to Christ’s Real Presence in the Holy Eucharist.',
      scriptureRef: 'John 6:51 — "I am the living bread that came down from heaven; whoever eats this bread will live forever; and the bread that I will give is my flesh for the life of the world."'
    }
  },
  {
    id: 'lady-chapel',
    stationNum: 6,
    targetT: 1.00,
    name: 'The Lady Chapel & Baptismal Font',
    latinName: 'Sacellum Marianum & Fons',
    relicName: 'Fons Salutis',
    relicIcon: '🕊️',
    themeColor: '#16a34a',
    riddle: 'Seek the peaceful devotional transept dedicated to the Blessed Virgin Mary, beside the eight-sided sacred font where original sin is washed away and new Christians are born into God’s family.',
    theologicalSignificance: 'The Lady Chapel invites devotional contemplation with Mary and St Joseph. The Baptismal font is traditionally eight-sided to celebrate the "Eighth Day"—Christ’s Resurrection and the dawn of the New Creation.',
    actionGuidance: 'Light a devotional votive candle at the Marian shrine and pray a Hail Mary for your family, your godparents, and someone in our school who needs encouragement.',
    question: {
      prompt: 'Why are Catholic Baptismal fonts traditionally designed with eight sides (octagonal)?',
      options: [
        'Because eight is the easiest shape for carpenters to cut',
        'To symbolize the "Eighth Day" of Creation: Christ’s Resurrection opening the gateway to eternal life',
        'To hold exactly eight gallons of sanctified water',
        'In honor of the eight Beatitudes only'
      ],
      correctIndex: 1,
      explanation: 'In early Christian theology, the 7 days of the week represent earthly time, while the 8th Day is Sunday—the Day of the Resurrection and the dawn of Eternal Life granted in Baptism.',
      scriptureRef: 'Romans 6:4 — "We were buried therefore with Him by baptism into death, in order that, just as Christ was raised from the dead, we too might walk in newness of life."'
    }
  }
];
