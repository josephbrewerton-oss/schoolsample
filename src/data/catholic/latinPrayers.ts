// src/data/catholic/latinPrayers.ts
// St Joseph's Catholic Life & Faith Sanctuary
// Latin Mass Prayers Chapel (Ordinary of the Mass & Universal Prayers)

export interface LatinPrayerVerse {
  latin: string;
  english: string;
  phonetic: string;
}

export interface LatinPrayerItem {
  id: string;
  titleLatin: string;
  titleEnglish: string;
  category: 'Ordinary of the Mass' | 'Universal Prayers' | 'Thanksgiving & Adoration';
  liturgicalMoment: string;
  verses: LatinPrayerVerse[];
  sacredContext: string;
  historicalNote: string;
}

export const LATIN_PRAYERS_DATA: LatinPrayerItem[] = [
  {
    id: 'signum-crucis',
    titleLatin: 'Signum Crucis',
    titleEnglish: 'The Sign of the Cross',
    category: 'Ordinary of the Mass',
    liturgicalMoment: 'Beginning of every Mass, prayer, and sacrament',
    sacredContext: 'We touch our forehead, heart, left shoulder, and right shoulder, sealing ourselves in the Holy Trinity.',
    historicalNote: 'Used by the earliest Christian martyrs from the apostolic age as a mark of belonging to Christ.',
    verses: [
      {
        latin: 'In nómine Patris, et Fílii, et Spíritus Sancti.',
        english: 'In the name of the Father, and of the Son, and of the Holy Spirit.',
        phonetic: 'In NOH-mee-neh PAH-trees, et FEE-lee-ee, et SPEE-ree-toos SAHNK-tee.',
      },
      {
        latin: 'Amen.',
        english: 'Amen (So be it).',
        phonetic: 'AH-men.',
      },
    ],
  },
  {
    id: 'dominus-vobiscum',
    titleLatin: 'Salútátio (Dóminus Vobíscum)',
    titleEnglish: 'The Liturgical Greeting',
    category: 'Ordinary of the Mass',
    liturgicalMoment: 'Beginning of the Mass, Gospel proclamation, and Preface',
    sacredContext: 'The priest greets the congregation, praying that Christ is active among us, and we respond to his holy office.',
    historicalNote: 'Based on the biblical greetings of Boaz (Ruth 2:4) and the Archangel Gabriel (Luke 1:28).',
    verses: [
      {
        latin: 'Sacerdos: Dóminus vobíscum.',
        english: 'Priest: The Lord be with you.',
        phonetic: 'DOH-mee-noos voh-BEES-koom.',
      },
      {
        latin: 'Populus: Et cum spíritu tuo.',
        english: 'People: And with your spirit.',
        phonetic: 'Et koom SPEE-ree-too TOH-oh.',
      },
    ],
  },
  {
    id: 'kyrie-eleison',
    titleLatin: 'Kýrie, Eléison',
    titleEnglish: 'Lord, Have Mercy',
    category: 'Ordinary of the Mass',
    liturgicalMoment: 'Penitential Act after confessing our sins',
    sacredContext: 'The only Greek prayer retained in the Roman Rite, pleading for Christ’s tender mercy and compassion.',
    historicalNote: 'Kept in ancient Greek since the 4th century to remind all Catholics of the undivided ancient Church.',
    verses: [
      {
        latin: 'Kýrie, eléison.',
        english: 'Lord, have mercy.',
        phonetic: 'KEE-ree-ay eh-LAY-ee-zohn.',
      },
      {
        latin: 'Christe, eléison.',
        english: 'Christ, have mercy.',
        phonetic: 'KREES-tay eh-LAY-ee-zohn.',
      },
      {
        latin: 'Kýrie, eléison.',
        english: 'Lord, have mercy.',
        phonetic: 'KEE-ree-ay eh-LAY-ee-zohn.',
      },
    ],
  },
  {
    id: 'sanctus',
    titleLatin: 'Sanctus, Sanctus, Sanctus',
    titleEnglish: 'Holy, Holy, Holy',
    category: 'Ordinary of the Mass',
    liturgicalMoment: 'End of the Eucharistic Preface, just before the Consecration',
    sacredContext: 'We join the celestial choirs of Angels and Archangels in singing praise before the Eucharistic mystery begins.',
    historicalNote: 'Taken directly from the vision of the prophet Isaiah (Isaiah 6:3) and Psalm 118:26.',
    verses: [
      {
        latin: 'Sanctus, Sanctus, Sanctus Dóminus Deus Sábaoth.',
        english: 'Holy, Holy, Holy Lord God of hosts.',
        phonetic: 'SAHNK-toos, SAHNK-toos, SAHNK-toos DOH-mee-noos DAY-oos SAH-bah-oht.',
      },
      {
        latin: 'Pleni sunt cæli et terra glória tua.',
        english: 'Heaven and earth are full of your glory.',
        phonetic: 'PLAY-nee soont CHAY-lee et TAIR-rah GLOH-ree-ah TOO-ah.',
      },
      {
        latin: 'Hosánna in excélsis.',
        english: 'Hosanna in the highest.',
        phonetic: 'Hoh-ZAHN-nah een ex-CHEL-sees.',
      },
      {
        latin: 'Benedíctus qui venit in nómine Dómini.',
        english: 'Blessed is he who comes in the name of the Lord.',
        phonetic: 'Bay-nay-DEEK-toos kwee VAY-neet een NOH-mee-nay DOH-mee-nee.',
      },
      {
        latin: 'Hosánna in excélsis.',
        english: 'Hosanna in the highest.',
        phonetic: 'Hoh-ZAHN-nah een ex-CHEL-sees.',
      },
    ],
  },
  {
    id: 'mysterium-fidei',
    titleLatin: 'Mystérium Fídei',
    titleEnglish: 'The Mystery of Faith',
    category: 'Ordinary of the Mass',
    liturgicalMoment: 'Immediately following the Consecration of the Chalice',
    sacredContext: 'The priest acclaims the great miracle that has just occurred on the altar, and the faithful profess their faith.',
    historicalNote: 'Proclaimed by the Church throughout the ages to anchor our hope in the resurrection and Second Coming.',
    verses: [
      {
        latin: 'Sacerdos: Mystérium fídei.',
        english: 'Priest: The mystery of faith.',
        phonetic: 'Mee-STAIR-ee-oom FEE-day-ee.',
      },
      {
        latin: 'Populus: Mortem tuam annuntiámus, Dómine, et tuam resurrectiónem confitémur, donec vénias.',
        english: 'People: We proclaim your Death, O Lord, and profess your Resurrection until you come again.',
        phonetic: 'MOHR-tem TOO-ahm ahn-noon-chee-AH-moos, DOH-mee-nay, et TOO-ahm ray-zoor-rek-tsyo-nem kon-fee-TAY-moor, DOH-nek VAY-nee-ahs.',
      },
    ],
  },
  {
    id: 'agnus-dei',
    titleLatin: 'Agnus Dei',
    titleEnglish: 'Lamb of God',
    category: 'Ordinary of the Mass',
    liturgicalMoment: 'Fraction of the Host before Holy Communion',
    sacredContext: 'As the priest breaks the consecrated Host, we pray to Jesus, the true Paschal Lamb who takes away the sin of the world.',
    historicalNote: 'Introduced into the Roman Mass by Pope Saint Sergius I in the 7th century.',
    verses: [
      {
        latin: 'Agnus Dei, qui tollis peccáta mundi: miserére nobis.',
        english: 'Lamb of God, you take away the sins of the world: have mercy on us.',
        phonetic: 'AHNG-yoos DAY-ee, kwee TOHL-lees pek-KAH-tah MOON-dee: mee-zay-RAY-ray NOH-bees.',
      },
      {
        latin: 'Agnus Dei, qui tollis peccáta mundi: miserére nobis.',
        english: 'Lamb of God, you take away the sins of the world: have mercy on us.',
        phonetic: 'AHNG-yoos DAY-ee, kwee TOHL-lees pek-KAH-tah MOON-dee: mee-zay-RAY-ray NOH-bees.',
      },
      {
        latin: 'Agnus Dei, qui tollis peccáta mundi: dona nobis pacem.',
        english: 'Lamb of God, you take away the sins of the world: grant us peace.',
        phonetic: 'AHNG-yoos DAY-ee, kwee TOHL-lees pek-KAH-tah MOON-dee: DOH-nah NOH-bees PAH-chem.',
      },
    ],
  },
  {
    id: 'pater-noster',
    titleLatin: 'Pater Noster',
    titleEnglish: 'The Lord’s Prayer (Our Father)',
    category: 'Universal Prayers',
    liturgicalMoment: 'Communion Rite, praying as children of one Heavenly Father',
    sacredContext: 'The perfect prayer taught directly by Jesus to His Apostles on the Mount.',
    historicalNote: 'Recited at every Catholic Mass since the early centuries as the preparation for receiving Holy Communion.',
    verses: [
      {
        latin: 'Pater noster, qui es in cælis:',
        english: 'Our Father, who art in heaven:',
        phonetic: 'PAH-tair NOH-stair, kwee es een CHAY-lees:',
      },
      {
        latin: 'sanctificétur nomen tuum;',
        english: 'hallowed be thy name;',
        phonetic: 'sahnk-tee-fee-CHAY-toor NOH-men TOO-oom;',
      },
      {
        latin: 'advéniat regnum tuum;',
        english: 'thy kingdom come;',
        phonetic: 'ahd-VAY-nee-aht RAYNG-yoom TOO-oom;',
      },
      {
        latin: 'fiat volúntas tua, sicut in cælo, et in terra.',
        english: 'thy will be done, on earth as it is in heaven.',
        phonetic: 'FEE-aht voh-LOON-tahs TOO-ah, SEE-koot een CHAY-loh, et een TAIR-rah.',
      },
      {
        latin: 'Panem nostrum quotidiánum da nobis hódie;',
        english: 'Give us this day our daily bread;',
        phonetic: 'PAH-nem NOH-stroom kwoh-tee-dee-AH-noom dah NOH-bees OH-dee-ay;',
      },
      {
        latin: 'et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris;',
        english: 'and forgive us our trespasses, as we forgive those who trespass against us;',
        phonetic: 'et dee-MEET-tay NOH-bees DAY-bee-tah NOH-strah, SEE-koot et nohs dee-MEET-tee-moos day-bee-TOH-ree-boos NOH-strees;',
      },
      {
        latin: 'et ne nos indúcas in tentatiónem;',
        english: 'and lead us not into temptation;',
        phonetic: 'et nay nohs een-DOO-kahs een ten-tah-tsyOH-nem;',
      },
      {
        latin: 'sed líbera nos a malo. Amen.',
        english: 'but deliver us from evil. Amen.',
        phonetic: 'sed LEE-bay-rah nohs ah MAH-loh. AH-men.',
      },
    ],
  },
  {
    id: 'ave-maria',
    titleLatin: 'Ave Maria',
    titleEnglish: 'Hail Mary',
    category: 'Universal Prayers',
    liturgicalMoment: 'Devotional prayer, Angelus, and Holy Rosary',
    sacredContext: 'Greeting Our Blessed Lady with the words of Archangel Gabriel and Saint Elizabeth, asking her holy intercession.',
    historicalNote: 'Beloved prayer of Catholic children around the globe; Mary leads all children straight to her Son Jesus.',
    verses: [
      {
        latin: 'Ave, María, grátia plena, Dóminus tecum.',
        english: 'Hail, Mary, full of grace, the Lord is with thee.',
        phonetic: 'AH-vay, mah-REE-ah, GRAH-tsy-ah PLAY-nah, DOH-mee-noos TAY-koom.',
      },
      {
        latin: 'Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus.',
        english: 'Blessed art thou among women, and blessed is the fruit of thy womb, Jesus.',
        phonetic: 'Bay-nay-DEEK-tah too een moo-lee-AY-ree-boos, et bay-nay-DEEK-toos FROOK-toos VEN-trees TOO-ee, YAY-zoos.',
      },
      {
        latin: 'Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen.',
        english: 'Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.',
        phonetic: 'SAHNK-tah mah-REE-ah, MAH-tair DAY-ee, OH-rah proh NOH-bees pek-kah-TOH-ree-boos, noonk et een OH-rah MOHR-tees NAY-stray. AH-men.',
      },
    ],
  },
  {
    id: 'gloria-patri',
    titleLatin: 'Glória Patri',
    titleEnglish: 'Glory Be to the Father',
    category: 'Universal Prayers',
    liturgicalMoment: 'Doxology ending psalms and decades of the Rosary',
    sacredContext: 'A praise of the Blessed Trinity, giving glory to God who was, is, and ever shall be.',
    historicalNote: 'Dates back to the 4th Council of Toledo in 633 AD.',
    verses: [
      {
        latin: 'Glória Patri, et Fílio, et Spirítui Sancto.',
        english: 'Glory be to the Father, and to the Son, and to the Holy Spirit.',
        phonetic: 'GLOH-ree-ah PAH-tree, et FEE-lee-oh, et spee-REE-too-ee SAHNK-toh.',
      },
      {
        latin: 'Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.',
        english: 'As it was in the beginning, is now, and ever shall be, world without end. Amen.',
        phonetic: 'SEE-koot AY-raht een preen-CHEE-pee-oh, et noonk, et SEM-pair, et een SAY-koo-lah say-koo-LOH-room. AH-men.',
      },
    ],
  },
  {
    id: 'anima-christi',
    titleLatin: 'Anima Christi',
    titleEnglish: 'Soul of Christ (Thanksgiving Prayer)',
    category: 'Thanksgiving & Adoration',
    liturgicalMoment: 'Quiet thanksgiving after receiving Holy Communion',
    sacredContext: 'A very tender prayer of intimacy with Jesus right after He enters our heart in the Blessed Sacrament.',
    historicalNote: 'Composed in the early 14th century, popularized by Saint Ignatius of Loyola.',
    verses: [
      {
        latin: 'Ánima Christi, sanctífica me.',
        english: 'Soul of Christ, sanctify me.',
        phonetic: 'AH-nee-mah KREES-tee, sahnk-TEE-fee-kah may.',
      },
      {
        latin: 'Corpus Christi, salva me.',
        english: 'Body of Christ, save me.',
        phonetic: 'KOHR-poos KREES-tee, SAHL-vah may.',
      },
      {
        latin: 'Sanguis Christi, inébria me.',
        english: 'Blood of Christ, inebriate me (fill my soul with love).',
        phonetic: 'SAHNG-gwees KREES-tee, ee-NAY-bree-ah may.',
      },
      {
        latin: 'Aqua láteris Christi, lava me.',
        english: 'Water from the side of Christ, wash me.',
        phonetic: 'AH-kwah LAH-tay-rees KREES-tee, LAH-vah may.',
      },
      {
        latin: 'Pássio Christi, confórta me.',
        english: 'Passion of Christ, strengthen me.',
        phonetic: 'PAHS-sy-oh KREES-tee, kon-FOHR-tah may.',
      },
      {
        latin: 'O bone Iesu, exáudi me.',
        english: 'O good Jesus, hear me.',
        phonetic: 'Oh BOH-nay YAY-zoo, ex-OW-dee may.',
      },
      {
        latin: 'Intra tua vúlnera abscónde me.',
        english: 'Within your wounds hide me.',
        phonetic: 'EEN-trah TOO-ah VOOL-nay-rah ahb-SKOHN-day may.',
      },
      {
        latin: 'Ne permíttas me separári a te.',
        english: 'Suffer me not to be separated from you.',
        phonetic: 'Nay pair-MEET-tahs may say-pah-RAH-ree ah tay.',
      },
      {
        latin: 'Ab hoste malígno defénde me.',
        english: 'From the malicious enemy defend me.',
        phonetic: 'Ahb OH-stay mah-LEEN-yoh day-FEN-day may.',
      },
      {
        latin: 'In hora mortis meæ voca me, et iube me veníre ad te, ut cum Sanctis tuis laudem te in sǽcula sæculórum. Amen.',
        english: 'In the hour of my death call me, and bid me come unto you, that with your saints I may praise you forever and ever. Amen.',
        phonetic: 'Een OH-rah MOHR-tees MAY-ay VOH-kah may, et YOO-bay may vay-NEE-ray ahd tay, oot koom SAHNK-tees TOO-ees LOW-dem tay een SAY-koo-lah say-koo-LOH-room. AH-men.',
      },
    ],
  },
];
