// src/data/catholic/liturgicalCalendar.ts
// St Joseph's Catholic Life & Faith Sanctuary
// Catholic Liturgical Calendar, Seasons & Quiz

export interface LiturgicalSeason {
  id: string;
  name: string;
  latinName: string;
  colorName: string;
  colorHex: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  icon: string;
  duration: string;
  theme: string;
  spiritualMeaning: string;
  keyEvents: string[];
  biblicalAnchor: string;
  traditions: string[];
  connectionToEucharist: string;
  catechismRef: string;
}

export interface LiturgicalQuizItem {
  q: string;
  options: string[];
  answer: string;
  hint: string;
}

export const LITURGICAL_SEASONS: LiturgicalSeason[] = [
  {
    id: 'advent',
    name: 'Advent',
    latinName: 'Adventus (Coming)',
    colorName: 'Purple / Violet (Rose on Gaudete Sunday)',
    colorHex: '#7c3aed',
    badgeBg: '#f3e8ff',
    badgeBorder: '#d8b4fe',
    badgeText: '#6b21a8',
    icon: '🕯️',
    duration: '4 Sundays leading up to Christmas Eve',
    theme: 'Hope, preparation, and joyful anticipation of Christ’s First Coming at Bethlehem and His Second Coming at the end of time.',
    spiritualMeaning: 'A time of spiritual awakening and quiet preparation of the heart to receive the Infant Jesus.',
    keyEvents: [
      'First Sunday of Advent (New Liturgical Year starts)',
      'Gaudete Sunday (3rd Sunday - Rose vestments for joy)',
      'Solemnity of the Immaculate Conception (8 December)',
      'O Antiphons (17–23 December)'
    ],
    biblicalAnchor: '"A voice cries out: In the desert prepare the way of the Lord; make straight in the wilderness a highway for our God!" (Isaiah 40:3)',
    traditions: [
      'The Advent Wreath with 3 purple candles and 1 rose candle',
      'The Jesse Tree tracing the lineage of Christ',
      'Daily Advent Calendar prayer reflection'
    ],
    connectionToEucharist: 'Just as Mary opened her heart to carry Jesus in her womb, we prepare our souls in Advent to receive Jesus in Holy Communion.',
    catechismRef: 'CCC 524'
  },
  {
    id: 'christmas',
    name: 'Christmastide (The Nativity)',
    latinName: 'Nativitas Domini',
    colorName: 'White & Gold',
    colorHex: '#d97706',
    badgeBg: '#fef3c7',
    badgeBorder: '#fde68a',
    badgeText: '#92400e',
    icon: '⭐',
    duration: 'Christmas Eve through the Baptism of the Lord (early January)',
    theme: 'The Incarnation: God became man to dwell among us and save us from sin.',
    spiritualMeaning: 'Celebration of divine humility, peace, and eternal life brought to humanity by Jesus Christ.',
    keyEvents: [
      'The Nativity of the Lord / Christmas Day (25 December)',
      'Feast of the Holy Family of Jesus, Mary, and Joseph',
      'Solemnity of Mary, the Holy Mother of God (1 January)',
      'Solemnity of the Epiphany (The Magi present Gold, Frankincense & Myrrh)',
      'The Feast of the Baptism of the Lord (Concludes Christmastide)'
    ],
    biblicalAnchor: '"And the Word became flesh and made his dwelling among us, and we saw his glory, the glory as of the Father’s only Son." (John 1:14)',
    traditions: [
      'The Nativity Creche / Crib blessing with baby Jesus',
      'Midnight Mass of the Nativity',
      'Chalking the door with the Epiphany blessing (20+C+M+B+year)'
    ],
    connectionToEucharist: 'Bethlehem means "House of Bread". Jesus was born in Bethlehem and laid in a manger (a feeding trough), showing that He is the Living Bread from Heaven for us to eat.',
    catechismRef: 'CCC 525-528'
  },
  {
    id: 'ordinary-time-1',
    name: 'Ordinary Time (Part I)',
    latinName: 'Tempus per Annum',
    colorName: 'Green',
    colorHex: '#16a34a',
    badgeBg: '#dcfce7',
    badgeBorder: '#bbf7d0',
    badgeText: '#15803d',
    icon: '🌱',
    duration: 'From the Baptism of the Lord until Ash Wednesday (4–9 weeks)',
    theme: 'Growing in discipleship, following Jesus in His early public ministry, call of the Apostles, and miracles.',
    spiritualMeaning: '"Ordinary" comes from "ordinal" (counted time). Green symbolizes life, hope, and steady spiritual growth.',
    keyEvents: [
      'The Wedding Feast at Cana (First public miracle of Jesus)',
      'The Calling of the Twelve Apostles',
      'The Feast of the Presentation of the Lord / Candlemas (2 February)'
    ],
    biblicalAnchor: '"Jesus said to them: Follow me, and I will make you fishers of men." (Mark 1:17)',
    traditions: [
      'Blessing of candles at Candlemas',
      'Daily Gospel reading and learning the parables'
    ],
    connectionToEucharist: 'At Cana, Jesus changed water into wine, pointing forward to the Last Supper where wine is transformed into His Precious Blood.',
    catechismRef: 'CCC 1163-1171'
  },
  {
    id: 'lent',
    name: 'Lent (Quadragesima)',
    latinName: 'Quadragesima (40 Days)',
    colorName: 'Purple / Violet (Rose on Laetare Sunday)',
    colorHex: '#6d28d9',
    badgeBg: '#ede9fe',
    badgeBorder: '#ddd6fe',
    badgeText: '#5b21b6',
    icon: '✝️',
    duration: '40 days from Ash Wednesday to Holy Thursday (excluding Sundays)',
    theme: 'Repentance, conversion, prayer, fasting, and almsgiving, walking with Jesus into the desert.',
    spiritualMeaning: 'Purification of our hearts through self-discipline, preparing to celebrate the victory of the Resurrection.',
    keyEvents: [
      'Ash Wednesday ("Remember that you are dust, and to dust you shall return")',
      'The 40 Days of Fasting imitating Jesus in the Judean desert',
      'Laetare Sunday (4th Sunday of Lent - Rose vestments for joy)',
      'Stations of the Cross practiced every Friday'
    ],
    biblicalAnchor: '"Even now, says the Lord, return to me with your whole heart, with fasting, and weeping, and mourning." (Joel 2:12)',
    traditions: [
      'Receiving blessed ashes on the forehead on Ash Wednesday',
      'Praying the 14 Stations of the Cross (Via Crucis)',
      'Making a thorough Lenten Confession (Sacrament of Reconciliation)',
      'Giving up sweets or luxuries, doing acts of charity'
    ],
    connectionToEucharist: 'In Lent, we confess our sins so our souls are clean, humble, and receptive when we receive Jesus at the Easter altar.',
    catechismRef: 'CCC 540, 1434, 1438'
  },
  {
    id: 'triduum',
    name: 'Holy Week & The Sacred Paschal Triduum',
    latinName: 'Sacrum Triduum Paschale',
    colorName: 'Red (Palm Sunday & Good Friday), White (Holy Thursday & Easter Vigil)',
    colorHex: '#b91c1c',
    badgeBg: '#fee2e2',
    badgeBorder: '#fca5a5',
    badgeText: '#991b1b',
    icon: '🕊️',
    duration: 'From Holy Thursday evening to Easter Sunday evening (The Great 3 Days)',
    theme: 'The summit and heart of the entire Christian year: The Passion, Crucifixion, Death, Burial, and Resurrection of Jesus.',
    spiritualMeaning: 'The historical and theological core of salvation history. Christ pays the debt of sin and crushes death forever.',
    keyEvents: [
      'Palm Sunday of the Passion of the Lord (Blessing of Palms, Christ enters Jerusalem)',
      'Holy Thursday: Mass of the Lord’s Supper (Institution of the Eucharist & Priesthood, Washing of the Feet, Watch with Jesus at the Altar of Repose)',
      'Good Friday of the Lord’s Passion (Solemn Intercessions, Veneration of the Wood of the Cross, Communion service; no Mass celebrated anywhere on Earth)',
      'Holy Saturday: The Easter Vigil in the Holy Night (Lucernarium / Service of Light, Paschal Candle, Exsultet chant, 7 Old Testament readings, Baptism of new Catholics, the joyful return of the Gloria & Alleluia)'
    ],
    biblicalAnchor: '"Greater love has no one than this: to lay down one’s life for one’s friends." (John 15:13) and "Father, into your hands I commend my spirit." (Luke 23:46)',
    traditions: [
      'Carrying blessed palm branches in procession',
      'Washing of feet imitating Jesus’ servant leadership (Mandatum)',
      'Silent prayer at the Altar of Repose until midnight',
      'Touching or kissing the crucifix during Veneration of the Cross',
      'Lighting individual candles from the new Paschal Fire in the darkened church'
    ],
    connectionToEucharist: 'On Holy Thursday at the Last Supper, Jesus instituted the Sacrament of the Holy Eucharist! Every single Mass celebrated in the world makes this very sacrifice and supper present on our altar.',
    catechismRef: 'CCC 1168-1171'
  },
  {
    id: 'easter',
    name: 'The Easter Season (Eastertide / Paschaltide)',
    latinName: 'Tempus Paschale',
    colorName: 'White & Gold',
    colorHex: '#eab308',
    badgeBg: '#fef9c3',
    badgeBorder: '#fef08a',
    badgeText: '#854d0e',
    icon: '🌅',
    duration: '50 glorious days from Easter Sunday to Pentecost Sunday',
    theme: 'The Resurrection of Jesus Christ, victory over sin and death, the gift of eternal life, and divine mercy.',
    spiritualMeaning: 'A continuous 50-day feast celebrated as "one great Sunday" (St Athanasius). The triumphant exclamation is "Christ is Risen! Alleluia!"',
    keyEvents: [
      'Easter Sunday: The Resurrection of the Lord (Empty tomb, appearance to Mary Magdalene)',
      'The Easter Octave (8 days celebrated as one continuous Easter Day)',
      'Divine Mercy Sunday (2nd Sunday of Easter)',
      'The Road to Emmaus (Jesus recognized in the Breaking of the Bread)',
      'Solemnity of the Ascension of the Lord (40th day after Easter - Christ ascends into Heaven)'
    ],
    biblicalAnchor: '"Why do you look for the living among the dead? He is not here; he has risen!" (Luke 24:5-6)',
    traditions: [
      'Singing the Regina Caeli instead of the Angelus',
      'The tall Paschal Candle burning brightly near the altar at every Mass',
      'Exchanging Easter eggs as symbols of new life bursting from the tomb',
      'Sprinkling with freshly blessed Easter water'
    ],
    connectionToEucharist: 'In the Holy Eucharist, we receive the RISEN, living Jesus Christ! His tomb is forever empty, and His glorified body feeds us to give us eternal life.',
    catechismRef: 'CCC 638-655, 1169'
  },
  {
    id: 'pentecost',
    name: 'Pentecost Sunday',
    latinName: 'Pentecoste (50th Day)',
    colorName: 'Red (The Fire of the Holy Spirit)',
    colorHex: '#dc2626',
    badgeBg: '#fee2e2',
    badgeBorder: '#fecaca',
    badgeText: '#b91c1c',
    icon: '🔥',
    duration: 'The 50th day after Easter (Concludes Eastertide)',
    theme: 'The descent of the Holy Spirit upon Mary and the Apostles; the birth of the Catholic Church and missionary mandate.',
    spiritualMeaning: 'The Church is empowered with divine boldness and the Seven Gifts of the Holy Spirit to bring Christ’s Gospel to every corner of the earth.',
    keyEvents: [
      'The Descent of the Holy Spirit as tongues of fire and a mighty rushing wind',
      'The Apostles proclaim Christ in all languages',
      '3,000 souls baptized in Jerusalem',
      'The official Birthday of the Catholic Church'
    ],
    biblicalAnchor: '"And there appeared to them tongues as of fire, distributed and resting on each one of them. And they were all filled with the Holy Spirit." (Acts 2:3-4)',
    traditions: [
      'Wearing red to Sunday Mass',
      'Singing the ancient Veni Creator Spiritus chant',
      'Confirmations celebrated in many parishes'
    ],
    connectionToEucharist: 'At every Mass during the Epiclesis, the priest stretches his hands over the bread and wine and prays for the Holy Spirit to descend and change them into Christ’s Body and Blood.',
    catechismRef: 'CCC 731-741, 1287'
  },
  {
    id: 'ordinary-time-2',
    name: 'Ordinary Time (Part II)',
    latinName: 'Tempus per Annum',
    colorName: 'Green',
    colorHex: '#15803d',
    badgeBg: '#f0fdf4',
    badgeBorder: '#bbf7d0',
    badgeText: '#14532d',
    icon: '🌿',
    duration: 'From the Monday after Pentecost until the First Sunday of Advent (approx. 24–28 weeks)',
    theme: 'Living out the Gospel daily, spiritual fruitfulness, and keeping our eyes fixed on Christ until the end of time.',
    spiritualMeaning: 'The longest stretch of the Church year, focusing on mature Christian living, prayer, virtues, and the teachings of Jesus.',
    keyEvents: [
      'Solemnity of the Most Holy Trinity (Sunday after Pentecost)',
      'Solemnity of Corpus Christi (The Most Holy Body and Blood of Christ)',
      'Solemnity of the Sacred Heart of Jesus',
      'Solemnity of the Assumption of the Blessed Virgin Mary (15 August)',
      'Solemnity of All Saints (1 November) & All Souls Day (2 November)',
      'Solemnity of Christ the King (Final Sunday of the Church Year)'
    ],
    biblicalAnchor: '"I am the vine, you are the branches. Whoever remains in me and I in him will bear much fruit." (John 15:5)',
    traditions: [
      'Corpus Christi Eucharistic Processions through town streets',
      'Praying the Rosary daily, especially during October',
      'Visiting cemeteries and praying for the Holy Souls in November'
    ],
    connectionToEucharist: 'Corpus Christi in Ordinary Time is our solemn thanksgiving for the gift of the Holy Eucharist, where Jesus in the Monstrance is carried through the streets in loving adoration.',
    catechismRef: 'CCC 1163-1171'
  }
];

export function getCurrentSeasonByDate(): LiturgicalSeason {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed (0 = Jan, 8 = Sep, 11 = Dec)
  const date = now.getDate();

  // Approximate Catholic calendar based on standard dates
  // Advent: late Nov / Dec
  if ((month === 10 && date >= 27) || (month === 11 && date <= 24)) {
    return LITURGICAL_SEASONS[0]; // Advent
  }
  // Christmas: Dec 25 - Jan 10
  if ((month === 11 && date >= 25) || (month === 0 && date <= 10)) {
    return LITURGICAL_SEASONS[1]; // Christmas
  }
  // Lent / Triduum / Easter: Approx March - May (variable by lunar equinox)
  if (month === 2 || month === 3) {
    // Lent / Easter window
    return LITURGICAL_SEASONS[3]; // Lent
  }
  if (month === 4) {
    return LITURGICAL_SEASONS[5]; // Easter
  }
  // September is Ordinary Time Part II
  return LITURGICAL_SEASONS[7]; // Ordinary Time Part II
}

export const LITURGICAL_QUIZ_QUESTIONS: LiturgicalQuizItem[] = [
  {
    q: 'Which liturgical season celebrates the glorious Resurrection of Jesus Christ from the dead?',
    options: ['The Easter Season (Paschaltide)', 'Advent', 'Ordinary Time'],
    answer: 'The Easter Season (Paschaltide)',
    hint: 'It lasts for 50 days and uses white and gold vestments with the joyful exclamation "Alleluia!"'
  },
  {
    q: 'What is the "Sacred Paschal Triduum" in the Catholic Church?',
    options: [
      'The Three Great Days: Holy Thursday, Good Friday, and the Easter Vigil',
      'The three weeks before Christmas Day',
      'The first three days of Lent'
    ],
    answer: 'The Three Great Days: Holy Thursday, Good Friday, and the Easter Vigil',
    hint: 'It begins with the Mass of the Lord’s Supper and ends on Easter Sunday evening.'
  },
  {
    q: 'On which holy day was the Sacrament of the Holy Eucharist instituted by Jesus Christ?',
    options: ['Holy Thursday (Maundy Thursday)', 'Ash Wednesday', 'Good Friday'],
    answer: 'Holy Thursday (Maundy Thursday)',
    hint: 'Jesus broke bread at the Last Supper and said: "This is my Body... Do this in remembrance of me."'
  },
  {
    q: 'What liturgical colour does the priest wear during Ordinary Time, and what does it symbolize?',
    options: [
      'Green, symbolizing spiritual growth, life, and hope in Christ',
      'Purple, symbolizing mourning and repentance',
      'Red, symbolizing fire and martyrdom'
    ],
    answer: 'Green, symbolizing spiritual growth, life, and hope in Christ',
    hint: 'Think of growing plants and trees in the springtime.'
  },
  {
    q: 'Which solemn feast day celebrates the descent of the Holy Spirit upon Our Lady and the Apostles 50 days after Easter?',
    options: ['Pentecost Sunday', 'Ascension Thursday', 'Epiphany'],
    answer: 'Pentecost Sunday',
    hint: 'The priest wears red vestments and it is known as the Birthday of the Catholic Church.'
  },
  {
    q: 'How many days does Lent last, and on which holy day does it begin with the imposition of ashes?',
    options: [
      '40 days, beginning on Ash Wednesday',
      '50 days, beginning on Palm Sunday',
      '25 days, beginning on Christmas Day'
    ],
    answer: '40 days, beginning on Ash Wednesday',
    hint: 'It recalls Jesus fasting 40 days in the desert.'
  }
];
