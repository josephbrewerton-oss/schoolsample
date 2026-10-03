// src/data/catholic/catholicRitesData.ts
/**
 * Sacred Tradition: The 6 Liturgical Rites & 24 Sui Iuris Churches of the Catholic Communion
 * 
 * Based on:
 * - Catechism of the Catholic Church (CCC §§ 1200–1209: Liturgical Diversity and the Unity of the Mystery)
 * - Second Vatican Council Decree on Eastern Catholic Churches (Orientalium Ecclesiarum, 1964)
 * - St. John Paul II Apostolic Letter Orientale Lumen (1995: The Church breathing with two lungs)
 * - Code of Canons of the Eastern Churches (CCEO)
 */

export interface SuiIurisChurch {
  id: string;
  name: string;
  riteId: string;
  riteName: string;
  geographicHeartland: string;
  primaryRegions: string[];
  headTitle: string;
  seeCity: string;
  liturgicalLanguages: string[];
  approximateFaithful: string;
  historicalOrigins: string;
  distinctiveTreasures: string[];
  sacredSymbolEmoji: string;
}

export interface LiturgicalRiteFamily {
  id: string;
  name: string;
  originSee: string;
  heartland: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
  };
  summary: string;
  anaphoraTitle: string;
  primarySacredLanguage: string;
  churchesCount: number;
  theologicalEmphasis: string;
}

export interface LiturgicalComparisonTopic {
  id: string;
  title: string;
  category: 'Eucharist' | 'Architecture' | 'Sacraments' | 'Prayer & Devotion';
  westernLatinPractice: {
    title: string;
    description: string;
    theologicalMeaning: string;
  };
  easternCatholicPractice: {
    title: string;
    description: string;
    theologicalMeaning: string;
  };
  socraticSynthesis: string;
}

export interface ConsecrationVoiceSample {
  rite: string;
  language: string;
  scriptText: string;
  transliteration: string;
  englishTranslation: string;
  speechText: string;
  langCode: string;
  historicalContext: string;
}

export const LITURGICAL_RITE_FAMILIES: LiturgicalRiteFamily[] = [
  {
    id: 'latin',
    name: 'Latin (Western) Tradition',
    originSee: 'Patriarchate of the West (Rome)',
    heartland: 'Europe, Americas, Global (Worldwide)',
    colorScheme: {
      bg: 'rgba(59, 130, 246, 0.08)',
      border: '#3b82f6',
      text: '#1d4ed8',
      badgeBg: '#dbeafe',
    },
    summary: 'The liturgical patrimony of the Bishop of Rome. Celebrated worldwide with noble simplicity, clarity of prayer, and Gregorian chant.',
    anaphoraTitle: 'Roman Canon (Eucharistic Prayer I) & Eucharistic Prayers II-IV',
    primarySacredLanguage: 'Latin (alongside approved modern vernaculars)',
    churchesCount: 1,
    theologicalEmphasis: 'Redemption, legal justification reconciled by Christ, Eucharistic sacrifice, noble simplicity.',
  },
  {
    id: 'byzantine',
    name: 'Byzantine Tradition',
    originSee: 'Imperial See of Constantinople',
    heartland: 'Ukraine, Greece, Middle East, Eastern Europe, Global Diaspora',
    colorScheme: {
      bg: 'rgba(234, 179, 8, 0.08)',
      border: '#eab308',
      text: '#a16207',
      badgeBg: '#fef9c3',
    },
    summary: 'Splendid cosmic liturgy celebrated with holy icons, the iconostasis, clouds of incense, and choral harmonies without musical instruments.',
    anaphoraTitle: 'Divine Liturgy of St. John Chrysostom & St. Basil the Great',
    primarySacredLanguage: 'Greek, Church Slavonic, Arabic, Ukrainian, Romanian',
    churchesCount: 14,
    theologicalEmphasis: 'Theosis (Divinisation / partakers of divine nature), resurrection light, heavenly court liturgy.',
  },
  {
    id: 'alexandrian',
    name: 'Alexandrian Tradition',
    originSee: 'See of St. Mark the Evangelist (Alexandria, Egypt)',
    heartland: 'Egypt, Ethiopia, Eritrea, Horn of Africa',
    colorScheme: {
      bg: 'rgba(239, 68, 68, 0.08)',
      border: '#ef4444',
      text: '#b91c1c',
      badgeBg: '#fee2e2',
    },
    summary: 'Ancient monastic and contemplative prayer rooted in the Desert Fathers, using liturgical drums, sistrums, and rhythmic chant.',
    anaphoraTitle: 'Liturgies of St. Cyril, St. Mark, and the 14 Ge’ez Anaphoras',
    primarySacredLanguage: 'Ge’ez, Coptic, Arabic, Amharic, Tigrinya',
    churchesCount: 3,
    theologicalEmphasis: 'Monastic holiness, deep humility before the Holy Trinity, spiritual combat.',
  },
  {
    id: 'antiochene',
    name: 'Antiochene (West Syrian) Tradition',
    originSee: 'See of St. Peter at Antioch (Syria)',
    heartland: 'Lebanon, Syria, Holy Land, Kerala (South India)',
    colorScheme: {
      bg: 'rgba(168, 85, 247, 0.08)',
      border: '#a855f7',
      text: '#7e22ce',
      badgeBg: '#f3e8ff',
    },
    summary: 'Lyrical theological poetry composed by St. Ephrem the Syrian, celebrating the Words of Consecration in our Lord Jesus’s native Aramaic.',
    anaphoraTitle: 'Anaphora of the Twelve Apostles & Liturgy of St. James',
    primarySacredLanguage: 'Syriac/Aramaic, Arabic, Malayalam, English',
    churchesCount: 3,
    theologicalEmphasis: 'Typology, poetic mystery, the Holy Spirit (Ruho d’Qudsho) fluttering over the elements.',
  },
  {
    id: 'east-syrian',
    name: 'East Syrian (Chaldean) Tradition',
    originSee: 'Mesopotamia (Seleucia-Ctesiphon / Babylon) & Malabar Coast (India)',
    heartland: 'Iraq, Kerala (India), Iran, Middle East, Worldwide',
    colorScheme: {
      bg: 'rgba(16, 185, 129, 0.08)',
      border: '#10b981',
      text: '#047857',
      badgeBg: '#d1fae5',
    },
    summary: 'Direct apostolic lineage tracing to St. Thomas the Apostle and Mar Addai. Uses the historic blooming Mar Thoma Cross symbolizing resurrection.',
    anaphoraTitle: 'Holy Qurbana of the Apostles Mar Addai and Mar Mari',
    primarySacredLanguage: 'Classical Syriac, Malayalam, Chaldean Neo-Aramaic, Arabic',
    churchesCount: 2,
    theologicalEmphasis: 'Apostolic antiquity, reverence for the Holy Cross without corpus, cosmic sanctuary veil.',
  },
  {
    id: 'armenian',
    name: 'Armenian Tradition',
    originSee: 'Holy See of Etchmiadzin & Cilicia (St. Gregory the Illuminator)',
    heartland: 'Armenia, Lebanon, Holy Land, Middle East, Worldwide',
    colorScheme: {
      bg: 'rgba(249, 115, 22, 0.08)',
      border: '#f97316',
      text: '#c2410c',
      badgeBg: '#ffedd5',
    },
    summary: 'The liturgy of the first Christian nation (AD 301), blending sacred curtain-drawn sanctuary mysteries with stone khachkar crosses.',
    anaphoraTitle: 'Armenian Divine Liturgy (Soorp Badarak) of St. Athanasius',
    primarySacredLanguage: 'Classical Armenian (Grabar)',
    churchesCount: 1,
    theologicalEmphasis: 'Christological majesty, martyr steadfastness, sacred sanctuary veil.',
  },
];

export const SUI_IURIS_CHURCHES: SuiIurisChurch[] = [
  // 1. Latin Church
  {
    id: 'latin-church',
    name: 'The Latin (Roman) Church',
    riteId: 'latin',
    riteName: 'Latin Rite',
    geographicHeartland: 'Rome, Europe, Americas, Worldwide',
    primaryRegions: ['Western Europe', 'North America', 'Latin America', 'Sub-Saharan Africa', 'Philippines', 'Oceania'],
    headTitle: 'Bishop of Rome & Supreme Pontiff',
    seeCity: 'Vatican City / Rome, Italy',
    liturgicalLanguages: ['Latin', 'National Vernaculars'],
    approximateFaithful: '1.38 Billion',
    historicalOrigins: 'Directly founded upon the martyrdom and apostolic cathedra of Saints Peter and Paul in Rome.',
    distinctiveTreasures: [
      'Gregorian Chant (the Church’s supreme musical heritage)',
      'Unleavened bread hosts (Azymes)',
      'Bells during the Epiclesis and Elevation',
      'The Roman Canon dating back to the early centuries of persecution',
    ],
    sacredSymbolEmoji: '🏛️',
  },

  // 2. Byzantine Rite Churches (14 Churches)
  {
    id: 'ukrainian-greek-catholic',
    name: 'Ukrainian Greek Catholic Church',
    riteId: 'byzantine',
    riteName: 'Byzantine Rite',
    geographicHeartland: 'Ukraine, Central & Eastern Europe, Global Diaspora',
    primaryRegions: ['Ukraine', 'Poland', 'Canada', 'United States', 'Brazil', 'United Kingdom'],
    headTitle: 'Major Archbishop of Kyiv-Halych',
    seeCity: 'Kyiv, Ukraine',
    liturgicalLanguages: ['Church Slavonic', 'Ukrainian'],
    approximateFaithful: '4.5 Million (Largest Eastern Catholic Church)',
    historicalOrigins: 'Baptism of Kyivan Rus’ under St. Volodymyr the Great (AD 988); confirmed in communion with Rome at the Union of Brest (1596).',
    distinctiveTreasures: [
      'Heroic underground church martyrdom under Soviet persecution (Catacomb Church)',
      'Vibrant icon painting schools and Pysanky sacred art',
      'Leavened bread (Prosphora) mixed with warm water (Zeon) and consecrated wine',
      'Tri-bar Byzantine Cross of St. Andrew',
    ],
    sacredSymbolEmoji: '🇺🇦',
  },
  {
    id: 'melkite-greek-catholic',
    name: 'Melkite Greek Catholic Church',
    riteId: 'byzantine',
    riteName: 'Byzantine Rite',
    geographicHeartland: 'Syria, Lebanon, Jordan, Holy Land, Middle East',
    primaryRegions: ['Lebanon', 'Syria', 'Jerusalem', 'Egypt', 'Australia', 'Americas'],
    headTitle: 'Patriarch of Antioch and All the East, of Alexandria and Jerusalem',
    seeCity: 'Damascus, Syria',
    liturgicalLanguages: ['Arabic', 'Greek'],
    approximateFaithful: '1.6 Million',
    historicalOrigins: 'Apostolic See of Antioch where the disciples were first called Christians (Acts 11:26); formal reunion affirmed in 1724.',
    distinctiveTreasures: [
      'Supreme bridge between Byzantine East and Arabic liturgical hymnody',
      'Bilingual Arabic-Greek polyphonic liturgical psalmody',
      'Historic guardian of Christian presence in Damascus, Beirut, and Galilee',
    ],
    sacredSymbolEmoji: '🕊️',
  },
  {
    id: 'ruthenian-catholic',
    name: 'Ruthenian Byzantine Catholic Church',
    riteId: 'byzantine',
    riteName: 'Byzantine Rite',
    geographicHeartland: 'Carpathian Mountains (Slovakia, Ukraine, Hungary) & USA',
    primaryRegions: ['Transcarpathia (Ukraine)', 'Slovakia', 'United States (Metropolia of Pittsburgh)'],
    headTitle: 'Metropolitan Archbishop of Pittsburgh / Bishop of Mukachevo',
    seeCity: 'Mukachevo, Ukraine & Pittsburgh, USA',
    liturgicalLanguages: ['Church Slavonic', 'English'],
    approximateFaithful: '650,000',
    historicalOrigins: 'Union of Uzhhorod (1646) bringing the Carpatho-Rusyn faithful into Catholic communion.',
    distinctiveTreasures: [
      'Prostopinije (unaccompanied congregation-wide plainchant tradition)',
      'Wooden Tserkvas (Carpathian wooden log churches recognized by UNESCO)',
    ],
    sacredSymbolEmoji: '⛰️',
  },
  {
    id: 'romanian-greek-catholic',
    name: 'Romanian Greek Catholic Church',
    riteId: 'byzantine',
    riteName: 'Byzantine Rite',
    geographicHeartland: 'Romania & Eastern Europe',
    primaryRegions: ['Transylvania (Romania)', 'Western Europe', 'United States'],
    headTitle: 'Major Archbishop of Făgăraș and Alba Iulia',
    seeCity: 'Blaj, Romania',
    liturgicalLanguages: ['Romanian'],
    approximateFaithful: '500,000',
    historicalOrigins: 'Union of Alba Iulia (1698); celebrated seven martyr bishops beatified by Pope Francis in 2019.',
    distinctiveTreasures: [
      'Seven Bishop-Martyrs who died in communist prisons refusing to renounce the Pope',
      'Unique synthesis of Latin-derived Romanian language within Byzantine Liturgy',
    ],
    sacredSymbolEmoji: '🇷🇴',
  },
  {
    id: 'other-byzantine-churches',
    name: 'Italo-Albanian, Greek, Hungarian, Slovak, Bulgarian & Slavic Byzantine Churches',
    riteId: 'byzantine',
    riteName: 'Byzantine Rite',
    geographicHeartland: 'Southern Italy (Sicily/Calabria), Greece, Hungary, Slovakia, Balkans',
    primaryRegions: ['Italy (Lungro & Piana degli Albanesi)', 'Slovakia', 'Hungary', 'Croatia', 'Bulgaria'],
    headTitle: 'Respective Eparchs, Bishops & Apostolic Exarchs',
    seeCity: 'Rome, Athens, Prešov, Nyíregyháza, Zagreb',
    liturgicalLanguages: ['Greek', 'Slovak', 'Hungarian', 'Albanian', 'Old Church Slavonic'],
    approximateFaithful: '1.2 Million Combined',
    historicalOrigins: 'Historic monastic abbeys like Santa Maria di Grottaferrata (founded 1004 near Rome, never broken communion).',
    distinctiveTreasures: [
      'Grottaferrata Abbey: Byzantine monastery founded just outside Rome before the Great Schism',
      'Ancient Byzantine mosaics and iconographic frescoes preserved through centuries',
    ],
    sacredSymbolEmoji: '✨',
  },

  // 3. Alexandrian Rite (3 Churches)
  {
    id: 'coptic-catholic',
    name: 'Coptic Catholic Church',
    riteId: 'alexandrian',
    riteName: 'Alexandrian Rite',
    geographicHeartland: 'Egypt & Middle East',
    primaryRegions: ['Egypt', 'Sudan', 'Middle East Diaspora'],
    headTitle: 'Patriarch of Alexandria of the Copts',
    seeCity: 'Cairo, Egypt',
    liturgicalLanguages: ['Coptic (the last surviving stage of the ancient Egyptian Pharaonic language)', 'Arabic'],
    approximateFaithful: '190,000',
    historicalOrigins: 'Directly founded by St. Mark the Evangelist in Alexandria (AD 42); union restored in 1741.',
    distinctiveTreasures: [
      'Liturgical language directly descended from the tongue of the ancient Pharaohs',
      'Sistrum (sacred metal rattle used during chanting)',
      'The monastic spirit of St. Anthony the Great and St. Pachomius of the Desert',
    ],
    sacredSymbolEmoji: '🇪🇬',
  },
  {
    id: 'ethiopian-catholic',
    name: 'Ethiopian Catholic Church',
    riteId: 'alexandrian',
    riteName: 'Alexandrian (Ge’ez) Rite',
    geographicHeartland: 'Ethiopia & Horn of Africa',
    primaryRegions: ['Ethiopia (Addis Ababa)', 'North America', 'Europe'],
    headTitle: 'Metropolitan Archbishop of Addis Ababa',
    seeCity: 'Addis Ababa, Ethiopia',
    liturgicalLanguages: ['Ge’ez (ancient Semitic liturgical tongue)', 'Amharic'],
    approximateFaithful: '70,000',
    historicalOrigins: 'Evangelization of Ethiopia begun with St. Philip and the Ethiopian Court Official (Acts 8); established in 4th century by St. Frumentius.',
    distinctiveTreasures: [
      'Kabaro (traditional sacred ceremonial drums playing reverent liturgical polyrhythms)',
      'Prayer sticks (Maqamiya) used by clergy and elders standing in prayer',
      'Rich multi-colored embroidered liturgical parasols used in Eucharistic processions',
    ],
    sacredSymbolEmoji: '🇪🇹',
  },
  {
    id: 'eritrean-catholic',
    name: 'Eritrean Catholic Church',
    riteId: 'alexandrian',
    riteName: 'Alexandrian (Ge’ez) Rite',
    geographicHeartland: 'Eritrea & Horn of Africa',
    primaryRegions: ['Eritrea (Asmara, Barentu, Keren, Segheneiti)', 'Diaspora'],
    headTitle: 'Metropolitan Archbishop of Asmara',
    seeCity: 'Asmara, Eritrea',
    liturgicalLanguages: ['Ge’ez', 'Tigrinya'],
    approximateFaithful: '170,000',
    historicalOrigins: 'Established as an autonomous metropolitan sui iuris Church by Pope Francis in 2015.',
    distinctiveTreasures: [
      'Deep desert monastic asceticism and fasting disciplines (over 200 days of fasting a year)',
      'Reverent liturgical dancing steps (*Mahlet*) celebrating the presence of the Ark of God',
    ],
    sacredSymbolEmoji: '🇪🇷',
  },

  // 4. Antiochene / West Syrian (3 Churches)
  {
    id: 'maronite-catholic',
    name: 'Maronite Catholic Church',
    riteId: 'antiochene',
    riteName: 'Antiochene (West Syrian) Rite',
    geographicHeartland: 'Lebanon & the Levant (Middle East)',
    primaryRegions: ['Lebanon', 'Syria', 'Holy Land', 'United States', 'Brazil', 'Australia', 'Cyprus'],
    headTitle: 'Patriarch of Antioch and All the East of the Maronites',
    seeCity: 'Bkerké, Lebanon',
    liturgicalLanguages: ['Syriac/Aramaic', 'Arabic'],
    approximateFaithful: '3.5 Million',
    historicalOrigins: 'Founded by the 4th-century hermit monk St. Maron in Mount Lebanon; has NEVER broken communion with the Bishop of Rome throughout its entire history.',
    distinctiveTreasures: [
      'Unique among Eastern Churches for perpetual unbroken communion with Rome',
      'Words of Consecration chanted in the exact Aramaic dialect of Christ: *Moran Yeshua Msheekho*',
      'The Cedars of Lebanon spiritual heritage and intercession of St. Charbel Makhlouf',
      'The dramatic *Incense Wave* during the Sedro prayers',
    ],
    sacredSymbolEmoji: '🌲',
  },
  {
    id: 'syro-malankara-catholic',
    name: 'Syro-Malankara Catholic Church',
    riteId: 'antiochene',
    riteName: 'Antiochene (West Syrian) Rite',
    geographicHeartland: 'Kerala & across India (South Asia)',
    primaryRegions: ['Kerala (India)', 'Tamil Nadu', 'Delhi', 'Gulf Countries', 'North America'],
    headTitle: 'Major Archbishop-Catholicos of Trivandrum',
    seeCity: 'Trivandrum (Thiruvananthapuram), Kerala, India',
    liturgicalLanguages: ['Malayalam', 'West Syriac', 'English'],
    approximateFaithful: '460,000',
    historicalOrigins: 'Traces origin to St. Thomas the Apostle (AD 52); Re-established communion with Rome in 1930 under Servant of God Archbishop Geevarghese Mar Ivanios.',
    distinctiveTreasures: [
      'Integration of ancient Syrian Christian spirituality with deep Indian cultural reverence (oil lamps / Nilavilakku)',
      'The Holy Qurbana of St. James: poetic prayers praising the Trinity and the Holy Cross',
      'Vibrant missionary expansion across modern India and educational institutions',
    ],
    sacredSymbolEmoji: '🇮🇳',
  },
  {
    id: 'syrian-catholic',
    name: 'Syrian Catholic Church',
    riteId: 'antiochene',
    riteName: 'Antiochene (West Syrian) Rite',
    geographicHeartland: 'Syria, Iraq, Lebanon, Middle East',
    primaryRegions: ['Syria', 'Iraq', 'Lebanon', 'Jordan', 'Western Diaspora'],
    headTitle: 'Patriarch of Antioch and All the East of the Syrians',
    seeCity: 'Beirut, Lebanon',
    liturgicalLanguages: ['Classical Syriac', 'Arabic'],
    approximateFaithful: '200,000',
    historicalOrigins: 'Antiochian patriarchal see reunified with the Catholic Church in 1782.',
    distinctiveTreasures: [
      'Hymnody composed by St. Ephrem the Syrian (Doctor of the Universal Church)',
      'Heroic witness and preservation of faith amidst modern Middle Eastern civil conflicts',
    ],
    sacredSymbolEmoji: '📜',
  },

  // 5. East Syrian / Chaldean (2 Churches)
  {
    id: 'syro-malabar-catholic',
    name: 'Syro-Malabar Catholic Church',
    riteId: 'east-syrian',
    riteName: 'East Syrian / Chaldean Rite',
    geographicHeartland: 'Kerala, India & Global South Asian Diaspora',
    primaryRegions: ['Kerala (India)', 'Across India', 'United States (Chicago Eparchy)', 'United Kingdom (Preston Eparchy)', 'Australia', 'Gulf States'],
    headTitle: 'Major Archbishop of Ernakulam-Angamaly',
    seeCity: 'Kochi (Cochin), Kerala, India',
    liturgicalLanguages: ['Malayalam', 'Classical East Syriac', 'English'],
    approximateFaithful: '4.3 Million (Second Largest Eastern Catholic Church)',
    historicalOrigins: 'Directly established by St. Thomas the Apostle when he landed at Kodungallur (Muziris) in Kerala, India in AD 52.',
    distinctiveTreasures: [
      'St. Thomas Christians (Nasranis): one of the oldest Christian communities on earth, centuries before Western mission voyages',
      'Mar Thoma Cross (St. Thomas Cross): depicting the descending Holy Spirit dove and blooming lotus petals symbolizing the Resurrection',
      'Raza Qurbana (Solemn High Mass of the East Syrian liturgy) with deep prostrations and sanctuary veil',
      'Vast network of Catholic hospitals, schools, and social welfare institutions serving millions across India',
    ],
    sacredSymbolEmoji: '🪷',
  },
  {
    id: 'chaldean-catholic',
    name: 'Chaldean Catholic Church',
    riteId: 'east-syrian',
    riteName: 'East Syrian / Chaldean Rite',
    geographicHeartland: 'Iraq (Mesopotamia / Babylon) & Middle East',
    primaryRegions: ['Iraq (Baghdad, Erbil, Nineveh Plains)', 'Syria', 'Iran', 'United States (Detroit & San Diego)', 'Europe', 'Australia'],
    headTitle: 'Patriarch of Baghdad of the Chaldeans',
    seeCity: 'Baghdad, Iraq',
    liturgicalLanguages: ['Chaldean Neo-Aramaic', 'Classical Syriac', 'Arabic'],
    approximateFaithful: '650,000',
    historicalOrigins: 'Church of the East founded in ancient Mesopotamia by Apostles St. Thomas, St. Thaddeus (Addai), and St. Bartholomew; reaffirmed communion with Rome in 1553.',
    distinctiveTreasures: [
      'The Liturgy of Apostles Mar Addai and Mar Mari: one of the oldest unbroken Eucharistic liturgies in Christian history',
      'The living language of ancient Babylon and Nineveh, retaining the dialect spoken in northern Mesopotamia',
      'Enduring courage and steadfast martyrdom in the Nineveh Plains maintaining the Christian faith where Jonah preached',
    ],
    sacredSymbolEmoji: '🏛️',
  },

  // 6. Armenian Rite (1 Church)
  {
    id: 'armenian-catholic',
    name: 'Armenian Catholic Church',
    riteId: 'armenian',
    riteName: 'Armenian Rite',
    geographicHeartland: 'Armenia, Lebanon, Holy Land, Middle East & Americas',
    primaryRegions: ['Armenia', 'Georgia', 'Lebanon', 'Iran', 'France', 'United States', 'Argentina'],
    headTitle: 'Catholicos-Patriarch of Cilicia of the Armenian Catholics',
    seeCity: 'Bzoummar / Beirut, Lebanon',
    liturgicalLanguages: ['Classical Armenian (Grabar)'],
    approximateFaithful: '750,000',
    historicalOrigins: 'Kingdom of Armenia became the very first state to adopt Christianity as its official religion in AD 301 under St. Gregory the Illuminator; formal Catholic union reaffirmed in 1742.',
    distinctiveTreasures: [
      'St. Gregory of Narek (Doctor of the Universal Church) and his Book of Lamentations',
      'The Divine Liturgy (Soorp Badarak) using sacred embroidered sanctuary curtains (*Varaguyr*) drawn during the Consecration',
      'Khachkars (Sacred Armenian stone crosses with intricate lace carvings of vines and pomegranates)',
      'Unleavened bread (like the Latin Rite) but using undiluted pure wine (a unique ancient Armenian liturgical custom)',
    ],
    sacredSymbolEmoji: '🇦🇲',
  },
];

export const LITURGICAL_COMPARISONS: LiturgicalComparisonTopic[] = [
  {
    id: 'eucharistic-bread',
    title: 'Eucharistic Bread: Unleavened Azymes vs. Leavened Prosphora',
    category: 'Eucharist',
    westernLatinPractice: {
      title: 'Unleavened Bread (Host / Azymes)',
      description: 'The Latin (Roman) and Armenian Rites use pure wheat flour and water without yeast, baked into thin round wafers called Hosts.',
      theologicalMeaning: 'Recalls the Passover meal of the Old Covenant where the Israelites fled Egypt in haste before the dough could rise (Exodus 12:8). Represents purity, incorruption, and the sinless Lamb of God.',
    },
    easternCatholicPractice: {
      title: 'Leavened Bread (Prosphora)',
      description: 'Byzantine, Alexandrian, and Syrian Rites use leavened wheat bread (*Prosphora*) stamped with the Greek letters IC XC NIKA ("Jesus Christ Conquers").',
      theologicalMeaning: 'Yeast symbolizes the Divine Life and the Holy Spirit breathing life into the human dough. Represents Christ’s Resurrection: as yeast rises, so Christ rose bodily from the tomb! (Luke 13:21).',
    },
    socraticSynthesis: 'Both forms are completely valid and holy! The Latin Church emphasizes Christ’s Passover Sacrifice (the Paschal Lamb); Eastern Catholics emphasize Christ’s Risen Life and the indwelling of the Holy Spirit.',
  },
  {
    id: 'sign-of-the-cross',
    title: 'The Sign of the Cross: Hand Position & Direction',
    category: 'Prayer & Devotion',
    westernLatinPractice: {
      title: 'Open Hand: Forehead ➔ Chest ➔ Left Shoulder ➔ Right Shoulder',
      description: 'Made with an open hand (representing the Five Sacred Wounds of Christ), moving from left to right.',
      theologicalMeaning: 'Symbolizes Christ taking us out of the darkness and sin of the Left and leading us into the light, grace, and glory of the Father’s Right hand.',
    },
    easternCatholicPractice: {
      title: 'Three Joined Fingers: Forehead ➔ Chest ➔ Right Shoulder ➔ Left Shoulder',
      description: 'Thumb, index, and middle fingers are joined together; ring and little finger are pressed flat into the palm. Moved from right to left.',
      theologicalMeaning: 'The 3 joined fingers confess the Holy Trinity (Father, Son, Holy Spirit, One God); the 2 flat fingers confess Christ’s two natures (True God and True Man). Touching the Right shoulder first gives honor to Christ seated at the Right Hand of the Father.',
    },
    socraticSynthesis: 'Whether moving left-to-right or right-to-left, both traditions seal the human person with the triumph of the Holy Cross. In fact, Christians in the West also crossed right-to-left until around the 13th century!',
  },
  {
    id: 'sanctuary-architecture',
    title: 'Sanctuary Architecture: Open Altar vs. The Iconostasis',
    category: 'Architecture',
    westernLatinPractice: {
      title: 'Altar & Sanctuary in Plain View',
      description: 'In modern Roman churches, the altar is elevated and clearly visible to the congregation, sometimes framed by a baldachin, reredos, or sanctuary steps.',
      theologicalMeaning: 'Emphasizes the banquet of the Lord where the family of God gathers around the table of Christ’s sacrifice, seeing and hearing every word clearly.',
    },
    easternCatholicPractice: {
      title: 'The Iconostasis (Wall of Icons) & Royal Doors',
      description: 'A solid or carved screen of sacred icons separating the sanctuary (the Holy of Holies) from the nave (where the faithful stand). The central Royal Doors open during the Liturgy.',
      theologicalMeaning: 'Does NOT hide God, but acts as a mystical window into Heaven! It reminds us that Heaven and Earth meet at the Liturgy, surrounded by the cloud of witnesses (the Saints and Angels depicted on the icons).',
    },
    socraticSynthesis: 'The Western sanctuary emphasizes the accessibility of God in the Incarnation; the Eastern Iconostasis emphasizes the awe, mystery, and transcendence of the Heavenly Jerusalem.',
  },
  {
    id: 'sacraments-of-initiation',
    title: 'Sacraments of Initiation: Sequential vs. Unified at Infancy',
    category: 'Sacraments',
    westernLatinPractice: {
      title: 'Separated Sequential Stages',
      description: 'Infant Baptism is followed years later by First Reconciliation and First Holy Communion (~age 7–8), and finally Confirmation by the Bishop (~age 11–14).',
      theologicalMeaning: 'Allows the growing child to be catechized at the age of reason and personally reaffirm their baptismal promises before receiving the seal of the Holy Spirit.',
    },
    easternCatholicPractice: {
      title: 'Unified Mysteries: Baptism, Chrismation & Eucharist Together',
      description: 'An infant receives Baptism, Chrismation (Confirmation with holy Myron), and Holy Communion (a consecrated drop of the Precious Blood via liturgical spoon) all in the exact same liturgy!',
      theologicalMeaning: 'Preserves the ancient practice of the Early Church: if a baby is made a child of God through Baptism, they are already a full citizen of the Kingdom and have the right to the Holy Spirit and the Bread of Life.',
    },
    socraticSynthesis: 'Both pastoral approaches stem from legitimate apostolic authority. The Eastern practice reminds us that grace is an unearned gift from God; the Western practice emphasizes conscious mature discipleship.',
  },
];

export const CONSECRATION_VOICES: ConsecrationVoiceSample[] = [
  {
    rite: 'Antiochene & Maronite (Aramaic/Syriac)',
    language: 'Aramaic (The Tongue of Jesus)',
    scriptText: 'ܗܳܟ݂ܰܢܳܐ ܢܣܰܒ݂ ܠܰܚܡܳܐ ܒܺܐܝܕ݂ܰܘܗ̱ܝ ܩܰܕ݁ܺܝܫܳܬ݂ܳܐ ܘܒܰܪܶܟ݂ ܘܩܰܕ݁ܶܫ ܘܰܩܨܳܐ ܘܝܰܗ̱ܒ݂ ܠܬ݂ܰܠܡܺܝܕ݂ܰܘܗ̱ܝ ܘܶܐܡܰܪ: ܣܰܒ݂ܘ ܐܶܟ݂ܽܘܠܘ ܡܶܢܶܗ ܟ݁ܽܠܟ݂ܽܘܢ: ܗܳܢܰܘ ܓ݁ܶܝܪ ܦ݁ܰܓ݂ܪܝ ܕ݁ܰܚܠܳܦ݂ܰܝܟ݁ܽܘܢ ܘܰܚܠܳܦ݂ ܣܰܓ݁ܺܝܶܐܐ ܡܶܬ݂ܩܨܶܐ ܘܡܶܬ݂ܺܝܗܶܒ݂ ܠܫܽܘܒ݂ܩܳܢܳܐ ܕ݁ܰܚܛܳܗܶܐ.',
    transliteration: 'Hawkhano nsav lakhmo b’eedawhi qadeeshotho, w-barekh, w-qaddesh, w-qtsa, w-yahv l’thalmeedawhi w-emar: Savu khool menneh koolkhoon: Honaw geyr Faghro d’hlofaykoon w-hlof sagiyeh methqtsay w-methyehev l’shoobqono d’khthoheh.',
    englishTranslation: 'In like manner He took bread into His holy hands, and blessed, and sanctified, and broke, and gave to His disciples, saying: Take, eat of it, all of you: FOR THIS IS MY BODY, which for you and for many is broken and given for the forgiveness of sins.',
    speechText: 'Hawkhano nsav lakhmo b’eedawhi qadeeshotho: Honaw geyr Faghro d’hlofaykoon l’shoobqono d’khthoheh.',
    langCode: 'ar-LB',
    historicalContext: 'Chanted by Maronite, Syrian, and Syro-Malabar Catholic priests at the altar in the actual Northwest Semitic dialect spoken by Christ at the Last Supper.',
  },
  {
    rite: 'Byzantine Rite (Greek)',
    language: 'Koine Greek (The Language of the New Testament)',
    scriptText: 'Λάβετε, φάγετε, τοῦτό μού ἐστι τὸ Σῶμα, τὸ ὑπὲρ ὑμῶν κλώμενον εἰς ἄφεσιν ἁμαρτιῶν.',
    transliteration: 'Labete, phagete; touto mou esti to Soma, to hyper hymon klomenon eis aphesin hamartion.',
    englishTranslation: 'Take, eat; this is My Body, which is broken for you for the remission of sins.',
    speechText: 'Labete, phagete; touto mou esti to Soma, to hyper hymon klomenon eis aphesin hamartion.',
    langCode: 'el-GR',
    historicalContext: 'Chanted in the Divine Liturgy of St. John Chrysostom across the Byzantine Catholic world, unchanged since the 4th century.',
  },
  {
    rite: 'Latin (Roman) Rite',
    language: 'Ecclesiastical Latin',
    scriptText: 'Accípite, et manducáte ex hoc omnes: HOC EST ENIM CORPUS MEUM, QUOD PRO VOBIS TRADÉTUR.',
    transliteration: 'Accipite, et manducate ex hoc omnes: Hoc est enim Corpus Meum, quod pro vobis tradetur.',
    englishTranslation: 'Take this, all of you, and eat of it: FOR THIS IS MY BODY, WHICH WILL BE GIVEN UP FOR YOU.',
    speechText: 'Accipite, et manducate ex hoc omnes: Hoc est enim Corpus Meum, quod pro vobis tradetur.',
    langCode: 'it-IT',
    historicalContext: 'Prayed in the Roman Rite for over 1,600 years from the catacombs of Rome through St. Thomas Aquinas to the modern day.',
  },
  {
    rite: 'Alexandrian Rite (Ge’ez)',
    language: 'Classical Ge’ez (Ancient Ethiopia & Eritrea)',
    scriptText: 'ንሥኡ ብልዑ ዝንቱ ውእቱ ሥጋየ ዘበእንቲአክሙ ይትፌተት ለሥርየተ ኃጢአት።',
    transliteration: 'Nise’u bil’u zintu we’etu sigaye ze-ba’enti’akemu yitfeteti le-siryete hati’at.',
    englishTranslation: 'Take, eat, this is My Body, which is broken for you for the forgiveness of sins.',
    speechText: 'Nise’u bil’u zintu we’etu sigaye ze-ba’enti’akemu yitfeteti le-siryete hati’at.',
    langCode: 'am-ET',
    historicalContext: 'Chanted with reverent cadences in the Ethiopian and Eritrean Catholic Divine Liturgies since the time of St. Frumentius.',
  },
];
