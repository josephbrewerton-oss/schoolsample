// scripts/ingest-oak.ts
import fs from 'fs';
import path from 'path';

const CUSTOM_EXPANDED_CURRICULUM = [
  // --- PRIMARY / FIRST COMMUNION AGE (KEY STAGE 2 / PARISH PREPARATION) ---
  {
    slug: 'first-reconciliation',
    stream: 'faith',
    title: 'The Sacrament of Reconciliation (First Confession)',
    keyStage: 'KS2',
    keyStageTitle: 'Primary Preparation (KS2)',
    subjectTitle: 'Religious Formation',
    unitTitle: 'Sacraments of Healing',
    lessonCode: 'FHC-REC',
    questions: [
      {
        questionText: 'What are the essential steps of making a good confession in the Sacrament of Reconciliation?',
        correctAnswer: ['examination of conscience, contrition, confession to the priest, absolution, and penance', 'contrition confession and absolution', 'contrition, confession, satisfaction'],
        hint: 'Think about being truly sorry in your heart, confessing your sins honestly, and doing your penance.',
        explanation: 'Reconciliation restores our friendship with God and the Church through contrition, confession to a priest acting in persona Christi, absolution, and satisfaction or penance (CCC 1440–1449).',
        distractors: [
          { answerText: 'just saying sorry in your head without a priest', feedback: 'Catholic doctrine teaches that Christ entrusted the power of forgiving sins to His Apostles and their successors (John 20:23); sacramental confession requires an ordained priest.' },
          { answerText: 'punishing yourself severely', feedback: 'Penance is a medicine for spiritual healing and restitution, not cruel punishment; God\'s mercy is freely given.' }
        ]
      },
      {
        questionText: 'What is contrition and why is it essential for receiving God\'s forgiveness?',
        correctAnswer: ['heartfelt sorrow for sin and a firm resolution not to sin again', 'sorrow for sin with intent to amend', 'true sorrow for offending god'],
        hint: 'It means turning your heart back toward God with genuine remorse.',
        explanation: 'Contrition (sorrow of the soul and detestation for the sin committed, with the resolution not to sin again) is the primary act of the penitent necessary for forgiveness (CCC 1451).',
        distractors: [
          { answerText: 'only being afraid of getting caught', feedback: 'True contrition springs from love of God (perfect contrition) or recognizing the ugliness of sin (imperfect contrition), not mere fear of human discovery.' }
        ]
      }
    ]
  },
  {
    slug: 'first-holy-communion',
    stream: 'faith',
    title: 'The Sacrament of the Eucharist (First Holy Communion)',
    keyStage: 'KS2',
    keyStageTitle: 'Primary Preparation (KS2)',
    subjectTitle: 'Religious Formation',
    unitTitle: 'Sacramental Life',
    lessonCode: 'FHC-EUCH',
    questions: [
      {
        questionText: 'What is the outward sign and theological effect of Holy Communion?',
        correctAnswer: ['body and blood of christ', 'body and blood', 'eucharist', 'real presence'],
        hint: 'Think about the Last Supper and the words of consecration spoken by the priest.',
        explanation: 'The Eucharist is the source and summit of Christian life, representing the Real Presence of Christ in His Body, Blood, Soul, and Divinity (CCC 1324).',
        distractors: [
          { answerText: 'just bread and wine', feedback: 'Catholic doctrine teaches transubstantiation—the bread and wine substantially become the Real Presence of Christ, not mere symbols.' }
        ]
      },
      {
        questionText: 'What is transubstantiation in Catholic Eucharistic theology?',
        correctAnswer: ['the change of the whole substance of bread and wine into the body and blood of christ', 'change of substance into christ\'s body and blood', 'substantial change into the body and blood of christ'],
        hint: 'The physical appearances (accidents) of bread and wine remain, but their underlying reality is transformed.',
        explanation: 'Through the words of consecration and the Holy Spirit, transubstantiation occurs: the reality of the bread and wine becomes the living Christ (Council of Trent; CCC 1376).',
        distractors: [
          { answerText: 'a mere symbol or reminder of Jesus', feedback: 'Catholic teaching affirms that the Eucharist is not merely a symbolic memorial, but the objective Real Presence of Jesus Christ.' }
        ]
      },
      {
        questionText: 'How must a Catholic prepare to receive Holy Communion worthily?',
        correctAnswer: ['be in a state of grace and observe the eucharistic fast for one hour', 'state of grace and fast for one hour', 'free from mortal sin and fast'],
        hint: 'Think about spiritual readiness (free from grave sin) and physical fasting before receiving.',
        explanation: 'Catholics must fast from food and drink (except water and medicine) for at least one hour before Communion and be in a state of grace, seeking confession if conscious of mortal sin (CCC 1385–1387).',
        distractors: [
          { answerText: 'fasting for three whole days without water', feedback: 'The Church asks for a fast of one hour from food and liquids prior to receiving, not three days, and water is always permitted.' }
        ]
      }
    ]
  },
  {
    slug: 'order-of-the-mass',
    stream: 'faith',
    title: 'The Order and Structure of the Mass',
    keyStage: 'KS2',
    keyStageTitle: 'Primary Preparation (KS2)',
    subjectTitle: 'Religious Formation',
    unitTitle: 'Liturgy & Worship',
    lessonCode: 'MASS-01',
    questions: [
      {
        questionText: 'What are the two principal parts that together form the celebration of the Catholic Mass?',
        correctAnswer: ['the liturgy of the word and the liturgy of the eucharist', 'liturgy of the word and liturgy of the eucharist', 'word and eucharist'],
        hint: 'The first focuses on Scripture and the Gospel; the second on the altar, consecration, and Communion.',
        explanation: 'The Mass consists of two great parts: the Liturgy of the Word and the Liturgy of the Eucharist, forming one single, unified act of divine worship (CCC 1346).',
        distractors: [
          { answerText: 'the singing of hymns and the parish announcements', feedback: 'Hymns and notices accompany the liturgy, but the core liturgical structure is the Liturgy of the Word and the Liturgy of the Eucharist.' }
        ]
      },
      {
        questionText: 'What takes place during the Liturgy of the Word?',
        correctAnswer: ['scripture readings, the responsorial psalm, the gospel, the homily, the creed, and prayers of the faithful', 'readings gospel homily and creed', 'scripture readings and the gospel'],
        hint: 'God speaks to His pilgrim people through Sacred Scripture, culminating in the proclamation of Christ\'s Gospel.',
        explanation: 'In the Liturgy of the Word, Christ is truly present in His proclaimed Word; it concludes with the profession of faith (Creed) and the universal prayer (CCC 1154, 1349).',
        distractors: [
          { answerText: 'the consecration of the chalice', feedback: 'The Eucharistic Prayer and consecration belong to the Liturgy of the Eucharist, not the Liturgy of the Word.' }
        ]
      }
    ]
  },
  {
    slug: 'sacrament-of-baptism',
    stream: 'faith',
    title: 'Baptism: The Gateway Sacrament',
    keyStage: 'KS2',
    keyStageTitle: 'Primary Preparation (KS2)',
    subjectTitle: 'Religious Formation',
    unitTitle: 'Sacraments of Initiation',
    lessonCode: 'BAP-01',
    questions: [
      {
        questionText: 'What are the essential matter and form of the Sacrament of Baptism?',
        correctAnswer: ['immersion in or pouring of water with the trinitarian words: in the name of the father and of the son and of the holy spirit', 'water and the trinitarian formula', 'water and in the name of the father son and holy spirit'],
        hint: 'Think about pure water and the exact command given by Jesus in Matthew 28:19.',
        explanation: 'Baptism requires clean water as its essential physical matter and the Trinitarian formula ("I baptize you in the name of the Father, and of the Son, and of the Holy Spirit") as its essential form (CCC 1239–1240).',
        distractors: [
          { answerText: 'anointing with oil only without water', feedback: 'While Sacred Chrism is used in baptismal anointing, immersion in or pouring of water is strictly required for the validity of the sacrament.' }
        ]
      },
      {
        questionText: 'What theological graces does Baptism confer on the soul?',
        correctAnswer: ['forgiveness of original sin, adoption as god\'s child, and membership in the church', 'cleansing of original sin and sanctifying grace', 'forgiveness of sin and new life in christ'],
        hint: 'It washes away all sin and leaves an indelible, permanent spiritual character.',
        explanation: 'Baptism cleanses Original Sin and personal sins, grants sanctifying grace and the theological virtues, adopts the recipient as a child of God, and imprints an indelible mark on the soul (CCC 1262–1274).',
        distractors: [
          { answerText: 'a certificate with no real spiritual change', feedback: 'Sacraments are efficacious signs instituted by Christ that confer real supernatural grace, not mere civic registration.' }
        ]
      }
    ]
  },

  // --- SECONDARY / CONFIRMATION & YOUTH FORMATION (KEY STAGE 3) ---
  {
    slug: 'sacrament-of-confirmation',
    stream: 'faith',
    title: 'The Sacrament of Confirmation & Gifts of the Holy Spirit',
    keyStage: 'KS3',
    keyStageTitle: 'Key Stage 3 (Ages 11–14)',
    subjectTitle: 'Religious Education (Catholic)',
    unitTitle: 'Sacraments of Initiation',
    lessonCode: 'CONF-01',
    questions: [
      {
        questionText: 'What is the theological purpose and effect of the Sacrament of Confirmation?',
        correctAnswer: ['an outpouring of the holy spirit to strengthen baptismal grace and empower apostolic witness', 'strengthening baptismal grace with the holy spirit', 'outpouring of the holy spirit to witness to christ'],
        hint: 'Just as at Pentecost, it deepens the presence of the Holy Spirit so the believer can defend and spread the faith.',
        explanation: 'Confirmation perfects baptismal grace, uniting us more firmly to Christ, increasing the gifts of the Holy Spirit, and giving special strength to spread and defend the faith (CCC 1285, 1302–1303).',
        distractors: [
          { answerText: 'graduation from religious education meaning you never have to go to church again', feedback: 'Confirmation is not a graduation or exit, but the beginning of adult apostolic responsibility and active service in Christ\'s Church.' }
        ]
      },
      {
        questionText: 'Name the Seven Gifts of the Holy Spirit bestowed in Confirmation (Isaiah 11:1-2).',
        correctAnswer: ['wisdom, understanding, counsel, fortitude, knowledge, piety, and fear of the lord', 'wisdom understanding counsel fortitude knowledge piety fear of the lord', 'wisdom fortitude knowledge piety counsel understanding and fear of the lord'],
        hint: 'These gifts assist our mind, will, courage, and reverence toward God.',
        explanation: 'The seven gifts of the Holy Spirit (Wisdom, Understanding, Counsel, Fortitude, Knowledge, Piety, and Fear of the Lord) sustain and enrich the moral and spiritual life of Christians (CCC 1830–1831).',
        distractors: [
          { answerText: 'wealth, fame, pride, power, ambition, physical strength, and success', feedback: 'These are worldly desires; the spiritual gifts of the Holy Spirit cultivate holiness, virtue, humility, and love of God.' }
        ]
      },
      {
        questionText: 'What sacred matter is used by the bishop during the anointing on the forehead at Confirmation?',
        correctAnswer: ['sacred chrism', 'chrism oil', 'holy chrism'],
        hint: 'A fragrant mixture of pure olive oil and sweet balsam consecrated during the Holy Week Chrism Mass.',
        explanation: 'The Bishop anoints the candidate\'s forehead with Sacred Chrism while laying on hands, saying: "Be sealed with the Gift of the Holy Spirit" (CCC 1295–1300).',
        distractors: [
          { answerText: 'ordinary cooking oil', feedback: 'The Church specifically requires Sacred Chrism, which is consecrated by the diocesan bishop with fragrant balsam to symbolize the aroma of Christ.' }
        ]
      }
    ]
  },
  {
    slug: 'holy-trinity-creed',
    stream: 'faith',
    title: 'The Holy Trinity & The Nicene Creed',
    keyStage: 'KS3',
    keyStageTitle: 'Key Stage 3 (Ages 11–14)',
    subjectTitle: 'Religious Education (Catholic)',
    unitTitle: 'Catholic Beliefs & Teachings',
    lessonCode: 'TRIN-01',
    questions: [
      {
        questionText: 'How does Catholic dogma define the mystery of the Most Holy Trinity?',
        correctAnswer: ['one god in three distinct divine persons: father, son, and holy spirit', 'one god in three divine persons', 'three persons in one god'],
        hint: 'The three Persons share the exact same single divine essence, yet are distinct in their eternal relations.',
        explanation: 'The Trinity is One: Catholics worship one God in three Persons—the Father, the Son, and the Holy Spirit—co-equal, co-eternal, and consubstantial (CCC 253–256).',
        distractors: [
          { answerText: 'three separate gods who hold committee meetings', feedback: 'This is the heresy of polytheism or tritheism; Catholic monotheism affirms strictly One God in three divine Persons.' },
          { answerText: 'one god wearing three different costumes at different times', feedback: 'This is the heresy of modalism; the Father, Son, and Holy Spirit are truly distinct Persons simultaneously, not temporary masks.' }
        ]
      },
      {
        questionText: 'What does the word "consubstantial" (homoousios) in the Nicene Creed affirm about the Son and the Father?',
        correctAnswer: ['the son is of the exact same divine substance and nature as the father', 'of the same substance as the father', 'same nature as the father'],
        hint: 'Proclaimed at the Council of Nicaea (325 AD) to reject the Arian heresy.',
        explanation: 'Consubstantial affirms that Jesus Christ is not a created being, but true God from true God, possessing the identical divine nature as God the Father (CCC 242, 465).',
        distractors: [
          { answerText: 'that the Son was the first creature made by God', feedback: 'The Creed explicitly denies this by declaring Christ is "begotten, not made, consubstantial with the Father".' }
        ]
      }
    ]
  },
  {
    slug: 'paschal-mystery',
    stream: 'faith',
    title: 'The Paschal Mystery: Passion, Death & Resurrection',
    keyStage: 'KS3',
    keyStageTitle: 'Key Stage 3 (Ages 11–14)',
    subjectTitle: 'Religious Education (Catholic)',
    unitTitle: 'Christology & Salvation',
    lessonCode: 'PASCH-01',
    questions: [
      {
        questionText: 'What four historical and theological events constitute the Paschal Mystery of Jesus Christ?',
        correctAnswer: ['the passion, death, resurrection, and ascension of jesus christ', 'passion death resurrection and ascension', 'suffering death resurrection ascension'],
        hint: 'From His trial, scourging, and crucifixion on Good Friday through Easter Sunday and His ascension to Heaven.',
        explanation: 'The Paschal Mystery—Christ\'s Passion, Death, Resurrection, and Ascension—is the central saving event of Christianity, by which Christ destroyed death and restored eternal life (CCC 571, 1067).',
        distractors: [
          { answerText: 'His childhood in Nazareth and His carpentry work', feedback: 'While part of the hidden life of Christ, the Paschal Mystery specifically denotes His climactic saving Passion, Death, Resurrection, and Ascension.' }
        ]
      },
      {
        questionText: 'Why is Jesus titled the "Lamb of God" (Agnus Dei)?',
        correctAnswer: ['he is the pure sacrificial offering who takes away the sins of the world, fulfilling the passover lamb', 'the sacrifice who redeems humanity from sin', 'fulfilling the passover sacrifice on the cross'],
        hint: 'Connect Jesus\' sacrifice on Calvary with the Exodus Passover lamb whose blood saved the Israelites.',
        explanation: 'John the Baptist identified Jesus as the Lamb of God (John 1:29); on the Cross, Christ is the unblemished Paschal victim who redeems all humanity from sin (CCC 608, 613).',
        distractors: [
          { answerText: 'because lambs are gentle animals to pet', feedback: 'The title refers to the deep theological reality of ritual sacrificial redemption in the Old Covenant fulfilled once for all on the Cross.' }
        ]
      }
    ]
  },
  {
    slug: 'mary-and-rosary',
    stream: 'faith',
    title: 'Mary, Mother of God & The Rosary',
    keyStage: 'KS3',
    keyStageTitle: 'Key Stage 3 (Ages 11–14)',
    subjectTitle: 'Religious Education (Catholic)',
    unitTitle: 'Mariology & Devotion',
    lessonCode: 'MARY-01',
    questions: [
      {
        questionText: 'What does the Catholic dogma of the "Theotokos" (Mother of God) proclaim about the Virgin Mary?',
        correctAnswer: ['mary is truly the mother of god because jesus is fully god and fully man in one divine person', 'mother of god because jesus is god incarnate', 'theotokos god bearer'],
        hint: 'Affirmed at the Council of Ephesus (431 AD) in response to Nestorius.',
        explanation: 'Because Jesus Christ is true God and true man undivided in one divine Person, Mary—who gave birth to Jesus—is legitimately honored as the Mother of God / Theotokos (CCC 495, 509).',
        distractors: [
          { answerText: 'that Catholics worship Mary as equal to God Almighty', feedback: 'Catholics venerate (hyperdulia) Mary with honor as the mother of the Redeemer, but worship and adoration (latria) belong strictly to God alone.' }
        ]
      },
      {
        questionText: 'What is the core spiritual purpose of praying the Holy Rosary?',
        correctAnswer: ['to meditate on the life, passion, death, and glory of jesus christ through the eyes of mary', 'meditating on the mysteries of christ with mary', 'contemplating the gospel mysteries'],
        hint: 'The Joyful, Luminous, Sorrowful, and Glorious mysteries guide the Christian through the Gospels.',
        explanation: 'The Rosary is a biblical prayer where repeated vocal prayers form a meditative background for contemplating the principal mysteries of Christ\'s life and salvation (CCC 971, 2708).',
        distractors: [
          { answerText: 'saying words as fast as possible to count beads', feedback: 'The Rosary is an interior contemplative prayer intended to draw the heart closer to Jesus Christ through quiet reflection on the Gospels.' }
        ]
      }
    ]
  },

  // --- SECONDARY / GCSE CATHOLIC CHRISTIANITY (KEY STAGE 4) ---
  {
    slug: 'gcse-re-trinity',
    stream: 'faith',
    title: 'The Nature of God: The Holy Trinity',
    keyStage: 'GCSE',
    keyStageTitle: 'GCSE Religious Studies',
    subjectTitle: 'Catholic Christianity',
    unitTitle: 'Beliefs & Teachings',
    lessonCode: 'RE-TRINITY',
    questions: [
      {
        questionText: 'How does the Nicene Creed describe the relationship between God the Father and God the Son?',
        correctAnswer: ['consubstantial', 'homoousios', 'same substance', 'of the same essence'],
        hint: 'It means "of the same substance" or divine essence.',
        explanation: 'The Nicene Creed states the Son is consubstantial (homoousios) with the Father, begotten before all ages and not created (CCC 242).',
        distractors: [
          { answerText: 'created', feedback: 'Catholic theology affirms the Son is "begotten, not made", decisively avoiding the Arian heresy.' }
        ]
      }
    ]
  },
  {
    slug: 'catholic-social-teaching',
    stream: 'faith',
    title: 'Catholic Social Teaching & Human Dignity',
    keyStage: 'GCSE',
    keyStageTitle: 'GCSE Religious Studies',
    subjectTitle: 'Catholic Christianity',
    unitTitle: 'Moral Theology & Social Justice',
    lessonCode: 'CST-01',
    questions: [
      {
        questionText: 'What is the theological foundation of human dignity in Catholic Social Teaching?',
        correctAnswer: ['every human being is created in the image and likeness of god (imago dei)', 'imago dei image of god', 'created in the image of god'],
        hint: 'Found in Genesis 1:26–27; human worth does not depend on utility, wealth, or ability.',
        explanation: 'Being created in the image of God (Imago Dei), every human person possesses intrinsic, inalienable dignity from conception to natural death (CCC 1700, 1929–1933).',
        distractors: [
          { answerText: 'human worth is determined by economic output and intelligence', feedback: 'Catholic social teaching explicitly rejects utilitarianism; human dignity is inherent and God-given, independent of a person\'s productivity or health.' }
        ]
      },
      {
        questionText: 'What does the Catholic principle of the "Preferential Option for the Poor" mandate?',
        correctAnswer: ['prioritizing the needs of the vulnerable, impoverished, and marginalized in decisions and policies', 'preferential care for the poor and vulnerable', 'putting the needs of the poorest first'],
        hint: 'Reflects Christ\'s judgment in Matthew 25: "Whatever you did for one of the least of these, you did for me."',
        explanation: 'The preferential option for the poor is a distinctive Christian commitment demanding that society\'s moral health be judged by how its most vulnerable members fare (CCC 2443–2448).',
        distractors: [
          { answerText: 'ignoring personal charity and relying solely on taxes', feedback: 'The option for the poor requires personal conversion and charitable action as well as structural justice in social institutions.' }
        ]
      },
      {
        questionText: 'Explain the Catholic principle of "Subsidiarity" in organizing society.',
        correctAnswer: ['higher authorities should not usurp the responsibilities of local communities or families when they can handle matters competently', 'matters should be handled by the lowest competent authority', 'supporting local initiative without state overreach'],
        hint: 'Pioneered in papal encyclicals like Rerum Novarum and Quadragesimo Anno.',
        explanation: 'Subsidiarity affirms that higher social entities should support (subsidium) lower bodies like families and local councils, without absorbing or destroying their legitimate autonomy (CCC 1883).',
        distractors: [
          { answerText: 'total centralized government ownership of all family decisions', feedback: 'Subsidiarity directly guards against totalitarian centralization by protecting the sacred autonomy of the family and local associations.' }
        ]
      }
    ]
  },
  {
    slug: 'catholic-sources-of-authority',
    stream: 'faith',
    title: 'Sources of Authority: Scripture, Tradition & Magisterium',
    keyStage: 'GCSE',
    keyStageTitle: 'GCSE Religious Studies',
    subjectTitle: 'Catholic Christianity',
    unitTitle: 'Authority & Doctrine',
    lessonCode: 'AUTH-01',
    questions: [
      {
        questionText: 'What is the "Tripod of Truth" in Catholic theology that authentically conveys divine revelation?',
        correctAnswer: ['sacred scripture, sacred tradition, and the magisterium', 'scripture tradition magisterium', 'bible tradition and magisterium'],
        hint: 'Three interdependent pillars; none can stand alone without the other two.',
        explanation: 'According to Dei Verbum, Sacred Scripture and Sacred Tradition form one sacred deposit of the Word of God, interpreted by the living Magisterium; none can exist without the others (CCC 84–95).',
        distractors: [
          { answerText: 'Scripture alone (Sola Scriptura) with personal private interpretation', feedback: 'Catholic teaching emphasizes that Sacred Scripture was written and recognized within the living Tradition of the Church and requires the Magisterium for authentic interpretation.' }
        ]
      },
      {
        questionText: 'What is the Magisterium of the Catholic Church?',
        correctAnswer: ['the living teaching authority of the church exercised by the pope and bishops in communion with him', 'teaching office of the pope and bishops', 'teaching authority of the church'],
        hint: 'Guided by the Holy Spirit to safeguard, interpret, and defend the apostolic deposit of faith.',
        explanation: 'The Magisterium is the living teaching office of the Church, exercised by the successor of Peter (the Pope) and the bishops united with him, to preserve Christian doctrine from error (CCC 85–88).',
        distractors: [
          { answerText: 'a political assembly that rewrites the Bible each year', feedback: 'The Magisterium does not invent new revelation; it faithfully preserves, defends, and expounds the deposit of faith entrusted by Christ once and for all.' }
        ]
      }
    ]
  },
  {
    slug: 'catholic-eschatology',
    stream: 'faith',
    title: 'Eschatology: Death, Judgment, Purgatory, Heaven & Hell',
    keyStage: 'GCSE',
    keyStageTitle: 'GCSE Religious Studies',
    subjectTitle: 'Catholic Christianity',
    unitTitle: 'Eschatology & Four Last Things',
    lessonCode: 'ESCHAT-01',
    questions: [
      {
        questionText: 'What is the Catholic doctrine of Purgatory?',
        correctAnswer: ['a state of final purification for those who die in god\'s grace but require cleansing before entering heaven', 'final purification before entering heaven', 'purification of souls destined for heaven'],
        hint: 'All souls in Purgatory are assured of heaven; it is a purification of love aided by the prayers of the faithful on earth.',
        explanation: 'Purgatory is the final cleansing of the elect so as to achieve the holiness necessary to enter the joy of heaven; the Church commends suffrages, prayers, and the Mass on their behalf (CCC 1030–1032).',
        distractors: [
          { answerText: 'a second chance for souls condemned to Hell', feedback: 'Purgatory is not a second chance for the damned; it is exclusively for those who died in friendship with God who need purification before beholding the Beatific Vision.' },
          { answerText: 'an eternal resting place where souls remain forever', feedback: 'Purgatory is temporary; every soul purified in Purgatory ultimately enters eternal life in Heaven.' }
        ]
      },
      {
        questionText: 'How does Catholic theology define Hell (eternal damnation)?',
        correctAnswer: ['the state of definitive self-exclusion from communion with god and the blessed', 'definitive self exclusion from god', 'eternal separation from god through unrepented mortal sin'],
        hint: 'It is the tragic outcome of human free will freely choosing to reject God\'s mercy and love until death.',
        explanation: 'Hell is the definitive state of self-chosen exclusion from communion with God, brought about by dying in mortal sin without repenting and refusing God\'s merciful love (CCC 1033–1037).',
        distractors: [
          { answerText: 'a place God arbitrarily pushes innocent people into', feedback: 'God predestines no one to go to hell; a willful turning away from God (mortal sin) and persistence in it until the end is necessary for damnation.' }
        ]
      }
    ]
  }
];

function getSubjectEmoji(subject: string = ''): string {
  const s = subject.toLowerCase();
  if (s.includes('sci') || s.includes('bio') || s.includes('chem') || s.includes('phys')) return '🧪';
  if (s.includes('math')) return '📐';
  if (s.includes('hist')) return '🏛️';
  if (s.includes('eng')) return '📖';
  if (s.includes('geog')) return '🌍';
  if (s.includes('rel') || s.includes('faith') || s.includes('re') || s.includes('catholic')) return '⛪';
  if (s.includes('comp') || s.includes('tech')) return '💻';
  if (s.includes('art')) return '🎨';
  if (s.includes('french') || s.includes('german') || s.includes('span')) return '🗣️';
  if (s.includes('cook') || s.includes('nutr')) return '🍳';
  if (s.includes('citizen')) return '⚖️';
  return '🎓';
}

function getSubjectColor(subject: string = ''): string {
  const s = subject.toLowerCase();
  if (s.includes('sci') || s.includes('bio') || s.includes('chem') || s.includes('phys')) return '#059669';
  if (s.includes('math')) return '#2563eb';
  if (s.includes('hist')) return '#991b1b';
  if (s.includes('eng')) return '#7c3aed';
  if (s.includes('geog')) return '#d97706';
  if (s.includes('rel') || s.includes('faith') || s.includes('re')) return '#b45309';
  if (s.includes('comp') || s.includes('tech')) return '#0284c7';
  if (s.includes('art')) return '#db2777';
  return '#1e293b';
}

function formatTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const STOP_WORDS = new Set([
  'what', 'happens', 'during', 'after', 'before', 'this', 'that', 
  'with', 'from', 'about', 'your', 'explain', 'which', 'where', 
  'when', 'does', 'have', 'been', 'were', 'they', 'them', 'their',
  'there', 'these', 'those', 'will', 'would', 'could', 'should',
  'into', 'than', 'then', 'also', 'more', 'some', 'such', 'unit',
  'lesson', 'part', 'step', 'core', 'main'
]);

function tokenize(text: string): string[] {
  return Array.from(new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !STOP_WORDS.has(w))
  ));
}

function buildChallengePrompt(unitTitle: string, subjectTitle: string = '', phaseTitle: string = ''): string {
  const s = subjectTitle.toLowerCase();
  const isPrimary = phaseTitle.toLowerCase().includes('primary') || phaseTitle.toLowerCase().includes('ks1') || phaseTitle.toLowerCase().includes('ks2');

  if (s.includes('eng') || s.includes('lang') || s.includes('lit') || s.includes('grammar')) {
    return isPrimary ? `Practice the key words and sentence rules for "${unitTitle}".` : `Examine the themes, language techniques, and structure in "${unitTitle}".`;
  }
  if (s.includes('comp') || s.includes('tech') || s.includes('digital')) {
    return isPrimary ? `What are the main steps or safety tips to remember for "${unitTitle}"?` : `Identify key algorithms, systems, or digital principles in "${unitTitle}".`;
  }
  if (s.includes('math')) {
    return isPrimary ? `Work out the calculation or number pattern for "${unitTitle}".` : `Outline the step-by-step method and solve the problem for "${unitTitle}".`;
  }
  if (s.includes('sci') || s.includes('bio') || s.includes('chem') || s.includes('phys')) {
    return isPrimary ? `Describe what happens and name the key parts in "${unitTitle}".` : `Explain the core scientific principles and mechanisms behind "${unitTitle}".`;
  }
  if (s.includes('hist') || s.includes('geog')) {
    return isPrimary ? `Name the key facts, places, or people explored in "${unitTitle}".` : `Analyze the causes, evidence, and historical impacts of "${unitTitle}".`;
  }
  if (s.includes('art') || s.includes('design')) {
    return isPrimary ? `What materials, shapes, or drawing techniques are used in "${unitTitle}"?` : `Examine the composition, style, and visual methods in "${unitTitle}".`;
  }
  return isPrimary ? `What are the most important things to remember about "${unitTitle}"?` : `Explain the essential concepts and applications of "${unitTitle}".`;
}

async function buildSystem() {
  const localOakDir = path.join(process.cwd(), 'scripts', 'data', 'oak');
  const manifestsDir = path.join(process.cwd(), 'static', 'manifests');
  const lessonsDir = path.join(manifestsDir, 'lessons');

  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
  }

  const catalogItems: any[] = [];
  const ragIndex: any[] = [];

  // 1. Ingest Custom Faith & Parish Streams
  for (const item of CUSTOM_EXPANDED_CURRICULUM) {
    const fileName = `${item.slug}.json`;

    const challenges = (item.questions || []).map((q: any, index: number) => {
      const distractors = q.distractors || [];
      const semanticRules: [string, string][] = distractors.map((d: any) => [
        d.answerText.toLowerCase().split(' ').filter((w: string) => w.length > 2).join(' '),
        d.feedback || `Misconception flagged regarding "${d.answerText}".`
      ]);

      const rawExpected = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];

      return {
        i: `${item.slug}-q${index + 1}`,
        p: q.questionText,
        ip: (q as any).immersionQuestionText || undefined,
        a: rawExpected.join(' | '),
        h: q.hint,
        e: q.explanation,
        r: semanticRules,
      };
    });

    const manifest = {
      m: {
        d: item.slug,
        n: item.title,
        i: getSubjectEmoji(item.subjectTitle),
        c: getSubjectColor(item.subjectTitle),
        t: `${item.keyStageTitle} • ${item.subjectTitle}`,
        l: 'en-US'
      },
      tp: {
        n: `${item.subjectTitle} Guide`,
        e: 'Socratic',
        p: 1.0,
        r: 1.0
      },
      co: [
        {
          c: item.lessonCode || 'GEN-1',
          n: `${item.title} Cohort`,
          s: `${item.keyStageTitle} ${item.subjectTitle}`,
          d: `${item.slug}-q1`
        }
      ],
      c: challenges
    };

    fs.writeFileSync(path.join(lessonsDir, fileName), JSON.stringify(manifest), 'utf-8');

    catalogItems.push({
      id: item.slug,
      stream: item.stream,
      keyStage: item.keyStage,
      subject: item.subjectTitle,
      unit: item.unitTitle,
      title: item.title,
      badgeIcon: getSubjectEmoji(item.subjectTitle),
      manifestPath: `/manifests/lessons/${fileName}`,
    });

    const combinedText = `${item.title} ${item.subjectTitle} ${item.keyStageTitle} ${
      challenges.map(c => `${c.p} ${c.a} ${c.r.map((r: any) => r[0]).join(' ')}`).join(' ')
    }`;

    ragIndex.push({
      id: item.slug,
      stream: item.stream || 'faith',
      phase: item.keyStageTitle,
      subject: item.subjectTitle,
      title: item.title,
      tokens: tokenize(combinedText),
      ragContext: `[${item.subjectTitle} - ${item.keyStageTitle}] ${item.title}\nCore Concepts: ${challenges.map(c => c.p).join(' | ')}\nAnswers: ${challenges.map(c => c.a).join(' | ')}`,
      manifestPath: `/manifests/lessons/${fileName}`
    });

    console.log(`📦 Compiled Custom AST: ${fileName}`);
  }

  // 2. Ingest Offline Oak Bulk JSON Files
  if (fs.existsSync(localOakDir)) {
    const rawFiles = fs.readdirSync(localOakDir).filter(f => f.endsWith('.json'));
    console.log(`\n📂 Found ${rawFiles.length} local Oak bulk files. Compiling AST manifests...`);

    for (const file of rawFiles) {
      const filePath = path.join(localOakDir, file);
      const fileSlug = file.replace('.json', '');
      const [subjectSlug, phase] = fileSlug.split('-');
      const subjectTitle = formatTitle(subjectSlug);
      const phaseTitle = phase ? formatTitle(phase) : 'Standard';

      try {
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawContent);
        const lessons = Array.isArray(data) ? data : (data.lessons || data.units || data.data || []);
        if (!lessons.length) continue;

        const maxModules = 12;
        const selectedLessons = lessons.slice(0, maxModules);

        selectedLessons.forEach((lesson: any, lIdx: number) => {
          const lessonSlug = `oak-${fileSlug}-unit-${lIdx + 1}`;
          const lessonTitle = lesson.lessonTitle || lesson.unitTitle || lesson.title || `${subjectTitle} Unit ${lIdx + 1}`;
          const rawQuestions = lesson.questions || lesson.quiz || lesson.keyLearningPoints || [];
          const outFileName = `${lessonSlug}.json`;

          const challenges = rawQuestions.slice(0, 8).map((q: any, qIdx: number) => {
            const defaultPrompt = buildChallengePrompt(lessonTitle, subjectTitle, phaseTitle);
            const prompt = typeof q === 'string'
              ? (q.trim() ? q : defaultPrompt)
              : (q.question || q.prompt || q.title || defaultPrompt);
            const answers = q.answers || q.correctAnswers || [q.answer || 'Standard Definition'];
            const distractors = q.distractors || q.misconceptions || [];

            const semanticRules: [string, string][] = Array.isArray(distractors) 
              ? distractors.map((d: any) => [
                  typeof d === 'string' ? d.toLowerCase() : (d.text || d.answer || '').toLowerCase(),
                  typeof d === 'string' ? `Note the definition for: ${d}` : (d.feedback || d.misconception || 'Review core terms.')
                ])
              : [];

            return {
              i: `${lessonSlug}-q${qIdx + 1}`,
              p: prompt,
              a: Array.isArray(answers) ? answers.join(' | ') : String(answers),
              h: q.hint || `Focus on foundational concepts in ${subjectTitle}.`,
              e: q.explanation || `Refer to Key Stage ${phaseTitle} guidance.`,
              r: semanticRules
            };
          });

          if (!challenges.length) {
            challenges.push({
              i: `${lessonSlug}-q1`,
              p: `What is the primary concept addressed in ${lessonTitle}?`,
              a: lessonTitle,
              h: `Consider the unit title and context.`,
              e: `Core focus: ${lessonTitle}`,
              r: []
            });
          }

          const manifest = {
            m: {
              d: lessonSlug,
              n: lessonTitle,
              i: getSubjectEmoji(subjectTitle),
              c: getSubjectColor(subjectTitle),
              t: `${phaseTitle} • ${subjectTitle}`,
              l: 'en-US'
            },
            tp: {
              n: `${subjectTitle} Tutor`,
              e: 'Socratic',
              p: 1.0,
              r: 1.0
            },
            co: [
              {
                c: `OAK-${fileSlug.toUpperCase()}-${lIdx + 1}`,
                n: `${lessonTitle} Cohort`,
                s: `${phaseTitle} ${subjectTitle}`,
                d: `${lessonSlug}-q1`
              }
            ],
            c: challenges
          };

          fs.writeFileSync(path.join(lessonsDir, outFileName), JSON.stringify(manifest), 'utf-8');

          catalogItems.push({
            id: lessonSlug,
            stream: 'academic',
            keyStage: phaseTitle.toUpperCase(),
            subject: subjectTitle,
            unit: lessonTitle,
            title: lessonTitle,
            badgeIcon: getSubjectEmoji(subjectTitle),
            manifestPath: `/manifests/lessons/${outFileName}`,
          });

          const combinedText = `${lessonTitle} ${subjectTitle} ${phaseTitle} ${
            challenges.map(c => `${c.p} ${c.a} ${c.r.map((r: any) => r[0]).join(' ')}`).join(' ')
          }`;

          ragIndex.push({
            id: lessonSlug,
            stream: 'academic',
            phase: phaseTitle,
            subject: subjectTitle,
            title: lessonTitle,
            tokens: tokenize(combinedText),
            ragContext: `[${subjectTitle} - ${phaseTitle}] ${lessonTitle}\nCore Concepts: ${challenges.map(c => c.p).join(' | ')}\nKey Rules: ${challenges.map(c => c.a).join(' | ')}`,
            manifestPath: `/manifests/lessons/${outFileName}`
          });
        });

        console.log(`✅ Processed ${file} (${selectedLessons.length} modular manifests generated)`);
      } catch (err: any) {
        console.warn(`⚠️ Error compiling ${file}: ${err.message}`);
      }
    }
  }

  // 3. Write Master Catalog & RAG Index
  const masterCatalog = {
    version: '1.2.0-compact',
    generatedAt: Date.now(),
    streams: [
      { id: 'academic', title: 'National Curriculum (Oak)', description: 'Key Stage 1–4 Academic Mastery', icon: '🎓' },
      { id: 'faith', title: 'Parish & Faith Formation', description: 'Catechesis and Sacramental Preparation', icon: '⛪' },
      { id: 'cpd', title: 'Professional & CPD', description: 'Staff training & vocational standards', icon: '💼' },
    ],
    items: catalogItems,
  };

  fs.writeFileSync(path.join(manifestsDir, 'catalog.json'), JSON.stringify(masterCatalog, null, 2), 'utf-8');
  fs.writeFileSync(path.join(manifestsDir, 'rag-index.json'), JSON.stringify(ragIndex), 'utf-8');

  console.log(`\n🚀 Ingestion Complete!`);
  console.log(`✨ Generated ${catalogItems.length} interactive manifests in static/manifests/lessons/`);
  console.log(`⚡ Generated static/manifests/rag-index.json (${ragIndex.length} indexed nodes)`);
}

buildSystem();