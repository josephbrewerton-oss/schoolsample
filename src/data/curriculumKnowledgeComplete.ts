// src/data/curriculumKnowledgeComplete.ts
// Complete Curriculum Coverage for St Joseph's Curriculum Portal
// Provides verified axiomatic seeds, diagnostic traps, and multiple rotating questions
// for all Catholic RE, GCSE Theology, Humanities, Maths, and Sciences.

import { CurriculumTopicEntry } from './curriculumKnowledgeExpansion';

export const CURRICULUM_COMPLETE_BASE: Record<string, CurriculumTopicEntry> = {
  // =========================================================================
  // KEY STAGE 3: Religious Education (Catholic)
  // =========================================================================
  'ks3:religious-education-catholic:holy-trinity-creed': {
    topicId: 'holy-trinity-creed',
    title: 'The Holy Trinity & The Nicene Creed',
    keyStage: 'Key Stage 3',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'The mystery of the Holy Trinity is the central mystery of Christian faith and life: there is only ONE God, who is three distinct Divine Persons (Father, Son, and Holy Spirit). The Persons are co-equal, co-eternal, and of one substance (consubstantial / homoousios). The Nicene Creed (promulgated at the Councils of Nicaea in 325 AD and Constantinople in 381 AD) articulates this orthodox faith (CCC 232-260).',
    cognitiveTrap: 'Falling into ancient heresies: Modalism (thinking Father, Son, and Spirit are merely 3 "roles" or "masks" of one Person); Tritheism (believing in 3 separate gods); Arianism (claiming the Son was created by the Father and not eternal); or Partialism (claiming each Person is one third of God).',
    socraticPivot: 'Why does the Nicene Creed specifically declare Jesus is "begotten, not made, consubstantial with the Father"? What heresy was this refuting?',
    hook: 'St Patrick used a shamrock, but theologians say even the shamrock is an imperfect analogy for God. How can God be both completely ONE and genuinely THREE Persons?',
    guidedStep: 'Examine the Nicene Creed clause by clause: God the Father Almighty (Maker of heaven and earth); Jesus Christ (Only Begotten Son, True God from True God, consubstantial); and the Holy Spirit (Lord and Giver of Life, proceeding from the Father and the Son, worshipped and glorified).',
    scaffoldHints: {
      level1: 'Consubstantial means "of the same substance" or "of one being" with the Father. Jesus is not a created being.',
      level2: 'The Council of Nicaea in 325 AD rejected Arius, who falsely claimed "there was a time when the Son was not."',
      level3: 'Christians are monotheists: we worship ONE God in Trinity, and Trinity in Unity, neither confounding the Persons nor dividing the substance.'
    },
    questions: [
      {
        id: 'ks3-re-trinity-1',
        prompt: 'In the Nicene Creed, what does the term "consubstantial with the Father" (Greek: homoousios) mean regarding Jesus Christ?',
        options: [
          'Jesus possesses the exact same divine nature and substance as the Father, and is not a created being',
          'Jesus was the first and greatest creation made by God the Father out of nothing',
          'Jesus was a purely human teacher whom God adopted as a son at his baptism in the Jordan',
          'Jesus is a secondary god who is similar to, but less powerful than, the Father'
        ],
        answerKey: 0,
        hint: 'Think about the debate at the Council of Nicaea against Arius. Was Jesus created, or is He eternal God?',
        explanation: 'At the Council of Nicaea (325 AD), the Church declared Jesus is "consubstantial" (of the same divine substance/being) with the Father, refuting the Arian heresy which claimed the Son was created.'
      },
      {
        id: 'ks3-re-trinity-2',
        prompt: 'Why do Catholic theologians caution against the analogy that the Trinity is "like water, ice, and steam"?',
        options: [
          'It risks teaching Modalism: water changes states at different times, whereas Father, Son, and Spirit exist simultaneously as three distinct Persons',
          'Because water is a physical liquid, and God cannot interact with the physical world',
          'Because steam is invisible, suggesting the Holy Spirit does not exist',
          'Because water was created on the first day of Genesis before God existed'
        ],
        answerKey: 0,
        hint: 'Water is either ice, liquid, or steam at any given moment; do the Father, Son, and Holy Spirit take turns?',
        explanation: 'Water cannot be ice, liquid, and steam simultaneously in the same spot. The "water/ice/steam" analogy leads to Modalism—the false belief that God is one Person putting on different "masks" or modes.'
      },
      {
        id: 'ks3-re-trinity-3',
        prompt: 'Which historical Ecumenical Council formulated the original core text of the Nicene Creed in 325 AD to defend the divinity of Christ?',
        options: [
          'The Council of Nicaea, called by Emperor Constantine to refute Arius',
          'The Council of Trent, called to address the Protestant Reformation in 1545',
          'The Second Vatican Council, called by Pope St John XXIII in 1962',
          'The Council of Jerusalem, led by St Peter and St Paul in Acts 15'
        ],
        answerKey: 0,
        hint: 'The creed takes its name from this ancient city in modern-day Turkey where the bishops met in 325 AD.',
        explanation: 'The First Council of Nicaea (325 AD) brought together over 300 bishops from across the Roman world to proclaim that Christ is "True God from True God, begotten, not made."'
      },
      {
        id: 'ks3-re-trinity-4',
        prompt: 'What does the Catholic Church profess in the Nicene Creed regarding the origin of the Holy Spirit (the "Filioque")?',
        options: [
          'The Holy Spirit eternally proceeds from both the Father and the Son',
          'The Holy Spirit was created by Jesus Christ on Pentecost morning',
          'The Holy Spirit is an impersonal energy force with no divine intellect or will',
          'The Holy Spirit proceeds only from angels and saints when they pray'
        ],
        answerKey: 0,
        hint: 'In Latin, "Filioque" translates to "and from the Son".',
        explanation: 'The Nicene-Constantinopolitan Creed declares that the Holy Spirit is the third divine Person who "proceeds from the Father and the Son" (Filioque), representing the eternal bond of love between them.'
      },
      {
        id: 'ks3-re-trinity-5',
        prompt: 'How does Catholic Christian doctrine reconcile belief in the Trinity with the ancient Jewish Shema ("Hear O Israel: The Lord our God, the Lord is one")?',
        options: [
          'Christians remain strictly monotheistic: God is ONE in divine being/substance, existing eternally as THREE distinct Persons',
          'Christians abandoned monotheism in favour of worshipping three distinct Gods (Tritheism)',
          'Christians believe the Father ceased to exist once Jesus was born in Bethlehem',
          'Christians believe God the Father is the only true God and Jesus was merely a symbolic figure'
        ],
        answerKey: 0,
        hint: 'Christianity is not polytheistic; it professes one divine essence shared completely by three Divine Persons.',
        explanation: 'Christianity maintains monotheism (One God). The Trinity does not divide the divine unity; each Divine Person is whole and entire God, distinct only in their relations of origin.'
      }
    ]
  },

  'ks3:religious-education-catholic:sacrament-of-confirmation': {
    topicId: 'sacrament-of-confirmation',
    title: 'The Sacrament of Confirmation & Gifts of the Holy Spirit',
    keyStage: 'Key Stage 3',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'Confirmation is the Sacrament of Christian Initiation that completes baptismal grace. Through the laying on of hands and anointing with Sacred Chrism by the Bishop, the recipient is sealed with the indelible spiritual mark of the Holy Spirit, receiving the Seven Gifts to be courageous witnesses for Christ (CCC 1285-1321).',
    cognitiveTrap: 'Viewing Confirmation merely as a "Catholic graduation" or "becoming an adult in the church", rather than an outpouring of divine grace and spiritual empowerment for mission.',
    socraticPivot: 'Why does the Bishop say "Be sealed with the gift of the Holy Spirit" while tracing the sign of the cross with perfumed oil on the candidate\'s forehead?',
    hook: 'At Pentecost, the Apostles were hiding behind locked doors in terror. After the Holy Spirit descended, they went boldly into the streets to proclaim the Gospel. What changed?',
    guidedStep: 'Identify the matter (laying on of hands, anointing with Sacred Chrism), form ("Be sealed with the gift of the Holy Spirit"), minister (usually the Bishop), and Seven Gifts (Wisdom, Understanding, Counsel, Fortitude, Knowledge, Piety, Fear of the Lord).',
    scaffoldHints: {
      level1: 'Sacred Chrism is olive oil scented with fragrant balsam, consecrated by the bishop during Holy Week.',
      level2: 'A seal (character) indicates permanent belonging and divine protection; Confirmation can only be received once.',
      level3: 'The Seven Gifts of the Holy Spirit are rooted in Isaiah 11:2.'
    },
    questions: [
      {
        id: 'ks3-re-conf-1',
        prompt: 'What are the essential matter and form of the Sacrament of Confirmation in the Catholic Church?',
        options: [
          'The laying on of hands and anointing with Sacred Chrism with the words "Be sealed with the Gift of the Holy Spirit"',
          'Immersion in holy water with the words "I baptise you in the name of the Father, Son, and Holy Spirit"',
          'Sharing bread and wine with the words "This is my Body, which will be given up for you"',
          'Confessing sins in private followed by the priest\'s words of absolution'
        ],
        answerKey: 0,
        hint: 'Think of the oil and the words spoken by the Bishop as he signs the candidate\'s forehead.',
        explanation: 'In the Latin Rite, the essential rite of Confirmation is the anointing of the forehead with Sacred Chrism, accompanied by the bishop laying on hands and proclaiming: "Be sealed with the Gift of the Holy Spirit."'
      },
      {
        id: 'ks3-re-conf-2',
        prompt: 'Which of the Seven Gifts of the Holy Spirit grants courage and perseverance to stand up for Catholic faith even during trials and persecution?',
        options: [
          'Fortitude (Courage)',
          'Understanding',
          'Piety (Reverence)',
          'Knowledge'
        ],
        answerKey: 0,
        hint: 'Think of the Latin word "fortis", meaning strong or brave.',
        explanation: 'Fortitude enables the Christian to overcome fear, endure hardships, and courageously defend and live the Gospel without shame.'
      },
      {
        id: 'ks3-re-conf-3',
        prompt: 'Why does the Sacrament of Confirmation leave an "indelible spiritual mark" (sacramental character) on the soul?',
        options: [
          'Because it permanently configures the candidate to Christ as His witness, meaning the sacrament can never be repeated',
          'Because the physical chrism oil can never be washed off the forehead',
          'Because it grants automatic entry to heaven regardless of future moral actions',
          'Because the candidate receives a physical tattoo of the cross'
        ],
        answerKey: 0,
        hint: 'Like Baptism and Holy Orders, Confirmation confers a permanent spiritual seal.',
        explanation: 'Confirmation imprints an indelible spiritual mark (character) signifying that the Christian has been sealed by Christ. Because this mark is permanent, Confirmation cannot be repeated.'
      },
      {
        id: 'ks3-re-conf-4',
        prompt: 'What biblical event serves as the primary theological model for the Sacrament of Confirmation?',
        options: [
          'Pentecost, when the Holy Spirit descended upon Mary and the Apostles as tongues of fire',
          'The Wedding at Cana, when Jesus performed His first miracle',
          'The Temptation in the Desert, when Jesus fasted for forty days',
          'The Transfiguration on Mount Tabor with Moses and Elijah'
        ],
        answerKey: 0,
        hint: 'Fifty days after Easter, the disciples were empowered by the Holy Spirit to go into the world.',
        explanation: 'Pentecost (Acts 2) is the foundational model for Confirmation. Just as the Apostles received the fullness of the Holy Spirit to witness to Christ, candidates receive the same empowering Spirit in Confirmation.'
      }
    ]
  },

  'ks3:religious-education-catholic:paschal-mystery': {
    topicId: 'paschal-mystery',
    title: 'The Paschal Mystery: Passion, Death & Resurrection',
    keyStage: 'Key Stage 3',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'The Paschal Mystery—the Passion, Death, Resurrection, and Ascension of Jesus Christ—is the focal point of God\'s redemptive plan for humanity. By His death Christ liberates us from sin; by His Resurrection He opens for us the way to eternal life (CCC 571-658).',
    cognitiveTrap: 'Believing Jesus was merely an innocent martyr killed by tragic historical accidents, rather than the voluntary offering of Himself as the true Passover Lamb to conquer sin and death.',
    socraticPivot: 'Why did Jesus say at the Last Supper: "This is my blood of the covenant, which is poured out for many for the forgiveness of sins"?',
    hook: 'The word "Paschal" comes from the Hebrew "Pesach" (Passover). How does Jesus crossing over from death to life parallel the Israelites passing through the Red Sea to freedom?',
    guidedStep: 'Trace the sequence of the Easter Triduum: Holy Thursday (Last Supper & Agony in the Garden), Good Friday (Passion and Crucifixion), Holy Saturday (Resting in the Tomb and Harrowing of Hades), and Easter Sunday (The Glorious Resurrection).',
    scaffoldHints: {
      level1: 'Good Friday remembers the Crucifixion; Easter Sunday celebrates Christ rising bodily from the dead.',
      level2: 'Christ\'s Resurrection was not a mere resuscitation of a corpse (like Lazarus who died again), but entering into glorified, eternal life.',
      level3: 'In the Holy Mass, the sacrifice of the Cross is made present on the altar in an unbloody manner.'
    },
    questions: [
      {
        id: 'ks3-re-pasch-1',
        prompt: 'What is meant by the theological term "The Paschal Mystery"?',
        options: [
          'The suffering, death, bodily resurrection, and glorious ascension of Jesus Christ that saves humanity from sin',
          'The mystery of why the Roman Empire eventually collapsed in the 5th century',
          'A secret coded message hidden in the Old Testament books of prophecy',
          'The process of building Catholic cathedrals during the Middle Ages'
        ],
        answerKey: 0,
        hint: '"Paschal" links Christ\'s sacrifice to Passover and the saving victory of the Resurrection.',
        explanation: 'The Paschal Mystery encompasses Christ\'s Passion, Death, Resurrection, and Ascension, through which He accomplished our redemption and restored human communion with God.'
      },
      {
        id: 'ks3-re-pasch-2',
        prompt: 'Why is Jesus called "The Lamb of God" (Agnus Dei) in relation to the Paschal Mystery?',
        options: [
          'Like the unblemished Passover lamb whose blood saved the Hebrews from death in Egypt, Christ\'s blood redeems humanity from the slavery of sin',
          'Because Jesus spent several years working as a shepherd in northern Galilee',
          'Because the Roman soldiers used lamb wool to dress Jesus in mockery',
          'Because lambs were considered the strongest and most fearsome animals in ancient Israel'
        ],
        answerKey: 0,
        hint: 'Recall Exodus 12 and John the Baptist pointing to Jesus: "Behold, the Lamb of God who takes away the sin of the world."',
        explanation: 'Just as the blood of the Passover lamb marked the doorposts in Egypt saving the Hebrews from death, Jesus as the Lamb of God willingly offered His life on the Cross to deliver us from sin and death.'
      },
      {
        id: 'ks3-re-pasch-3',
        prompt: 'How does the Catholic Church understand the bodily Resurrection of Jesus on Easter Sunday?',
        options: [
          'A real, historical event where Jesus rose bodily in a glorified, immortal state, transcending physical limits',
          'A symbolic metaphor created by disciples to preserve Jesus\' moral memories',
          'A resuscitation where Jesus came back to normal mortal life and died of old age years later',
          'A collective hallucination experienced by the grief-stricken apostles'
        ],
        answerKey: 0,
        hint: 'In Luke 24, the risen Jesus said: "Touch me and see; a ghost does not have flesh and bones, as you see I have."',
        explanation: 'The Resurrection was not a ghost or metaphor, nor a simple resuscitation like Lazarus. Christ rose with a real, transformed, glorified body that conquered death forever (1 Cor 15).'
      }
    ]
  },

  'ks3:religious-education-catholic:mary-and-rosary': {
    topicId: 'mary-and-rosary',
    title: 'Mary, Mother of God & The Rosary',
    keyStage: 'Key Stage 3',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'Mary is revered as the Mother of God (Theotokos) because Jesus is true God and true man. Catholics honour Mary with "hyperdulia" (special veneration) and ask for her maternal intercession, while "latria" (adoration/worship) is reserved strictly for God alone. The Rosary is a Christocentric, scriptural prayer reflecting on the mysteries of salvation through Mary\'s eyes (CCC 495, 963-975, 2673-2679).',
    cognitiveTrap: 'Confusing Catholic veneration of Mary with worshipping her as a divine goddess, or confusing the Immaculate Conception (Mary conceived without Original Sin) with the Virgin Birth (Jesus conceived by the Holy Spirit).',
    socraticPivot: 'When Catholics pray "Holy Mary, Mother of God, pray for us sinners", why are they asking for her prayers rather than treating her as God?',
    hook: 'At the foot of the Cross, Jesus said to the beloved disciple: "Behold your mother!" In that moment, Jesus gave Mary to be the mother of all His followers.',
    guidedStep: 'Distinguish the Four Marian Dogmas: Mother of God (Theotokos), Perpetual Virginity, Immaculate Conception (conceived free from original sin), and Assumption (taken body and soul into heavenly glory). Explore the 4 sets of Rosary Mysteries: Joyful, Luminous, Sorrowful, and Glorious.',
    scaffoldHints: {
      level1: 'The Hail Mary combines scripture from the Archangel Gabriel (Luke 1:28) and Elizabeth (Luke 1:42) with a petition for intercession.',
      level2: 'Latria = worship of God alone; Dulia = honour given to saints; Hyperdulia = the highest honour given to Mary.',
      level3: 'St John Paul II added the Luminous Mysteries (Mysteries of Light) in 2002 focusing on Jesus\' public ministry.'
    },
    questions: [
      {
        id: 'ks3-re-mary-1',
        prompt: 'What does the Catholic dogma of the "Immaculate Conception" strictly define?',
        options: [
          'Mary was preserved free from all stain of Original Sin from the very first moment of her conception in St Anne\'s womb',
          'Jesus was conceived in Mary\'s womb by the power of the Holy Spirit without a human biological father',
          'Mary was taken up body and soul into heavenly glory at the end of her earthly life',
          'Mary remained a perpetual virgin before, during, and after the birth of Christ'
        ],
        answerKey: 0,
        hint: 'Be careful! Many people confuse the Immaculate Conception with the Virgin Birth of Jesus.',
        explanation: 'Defined by Pope Pius IX in 1854, the Immaculate Conception states that Mary, by a singular grace of God in anticipation of Christ\'s redemption, was preserved from Original Sin from the moment of her conception.'
      },
      {
        id: 'ks3-re-mary-2',
        prompt: 'How does Catholic theology distinguish the honour given to Mary from the adoration given to God?',
        options: [
          'Catholics give adoration (latria) to God alone, while honouring Mary with highest veneration (hyperdulia) and asking for her prayers',
          'Catholics worship Mary as an equal fourth member of the Holy Trinity',
          'Catholics believe Mary is more powerful than God because she is His mother',
          'Catholics treat Mary as an ordinary historical figure with no special role in salvation'
        ],
        answerKey: 0,
        hint: 'Look at the distinction between "worship/adoration" (latria) and "veneration/intercession" (dulia/hyperdulia).',
        explanation: 'Catholics do NOT worship Mary as a goddess. Worship (latria) belongs only to God (Father, Son, Holy Spirit). Mary is given highest honour (hyperdulia) as the Mother of the Lord, and believers ask her to pray to God on their behalf.'
      },
      {
        id: 'ks3-re-mary-3',
        prompt: 'Which set of mysteries was added to the Holy Rosary by Pope St John Paul II in 2002 to illuminate the public ministry of Jesus?',
        options: [
          'The Luminous Mysteries (Mysteries of Light)',
          'The Joyful Mysteries',
          'The Sorrowful Mysteries',
          'The Glorious Mysteries'
        ],
        answerKey: 0,
        hint: 'These mysteries include the Baptism in the Jordan, Wedding at Cana, Proclamation of the Kingdom, Transfiguration, and Institution of the Eucharist.',
        explanation: 'In his apostolic letter Rosarium Virginis Mariae (2002), Pope St John Paul II introduced the Luminous Mysteries (Mysteries of Light) to bridge the childhood of Jesus (Joyful) and His Passion (Sorrowful).'
      }
    ]
  },

  // =========================================================================
  // KEY STAGE 4: Religious Studies (GCSE) & Catholic Christianity
  // =========================================================================
  'ks4:religious-studies:gcse-re-trinity': {
    topicId: 'gcse-re-trinity',
    title: 'The Nature of God: The Holy Trinity',
    keyStage: 'Key Stage 4',
    subject: 'Religious Studies (General & GCSE)',
    coreAxiom: 'In GCSE Religious Studies, Catholic belief in the Trinity integrates biblical revelation (Matthew 28:19, 2 Corinthians 13:14), patristic theology (St Augustine\'s psychological analogy of Lover, Beloved, and Love), and doctrinal definitions (Nicaea 325 AD). The Trinity models perfect relational community, guiding Christian love and social ethics.',
    cognitiveTrap: 'Treating the Trinity as a mathematical puzzle rather than an ontology of love, or failing to substantiate arguments with specific scriptural/magisterial evidence in GCSE 12-mark evaluative questions.',
    socraticPivot: 'How did St Augustine use the human experience of love (the lover, the beloved, and the love itself) to illuminate the mystery of the Trinity in De Trinitate?',
    hook: '"God is love" (1 John 4:8). If God is love, can love exist without an object of love? How does the Trinity explain God\'s eternal love before creation?',
    guidedStep: 'Link: 1) Biblical foundations (Baptism of Jesus, Great Commission); 2) Philosophical distinctions (Ousia/Substance vs Hypostasis/Person); 3) St Augustine\'s relational analogy; 4) Contemporary application (how the Trinity inspires Christian community and service).',
    scaffoldHints: {
      level1: 'At Jesus\' baptism: The Son is baptized, the Spirit descends like a dove, and the Father\'s voice speaks from heaven.',
      level2: 'St Augustine described the Father as the Lover, the Son as the Beloved, and the Holy Spirit as the Love connecting them.',
      level3: 'GCSE exam tip: Always use key vocabulary: monotheism, consubstantial, relational ontology, immanent Trinity, economic Trinity.'
    },
    questions: [
      {
        id: 'ks4-re-trin-1',
        prompt: 'How did St Augustine of Hippo explain the Trinity in his treatise "De Trinitate" using human relationship?',
        options: [
          'He described the Trinity as an eternal community of love: The Father is the Lover, the Son is the Beloved, and the Holy Spirit is the Love between them',
          'He argued that God has three separate brains controlling three distinct bodies in different galaxies',
          'He claimed that humans cannot love unless they reject the Old Testament entirely',
          'He stated that the Trinity is an illusion that disappears once a person achieves philosophical enlightenment'
        ],
        answerKey: 0,
        hint: '1 John 4:8 says "God is love". St Augustine reasoned that for love to exist, there must be three elements.',
        explanation: 'St Augustine demonstrated that love requires three things: the one who loves (the Father), the one who is loved (the Son), and the love that unites them (the Holy Spirit).'
      },
      {
        id: 'ks4-re-trin-2',
        prompt: 'In a GCSE exam question examining Jesus\' baptism in Mark 1:9-11, how is the Trinity manifested simultaneously?',
        options: [
          'The Son is physically baptized in the water, the Spirit descends like a dove, and the Father\'s voice declares "You are my beloved Son"',
          'Jesus changes His physical form from a man into a bird and then into a thunderstorm',
          'Only God the Father is present, speaking directly through the prophet Isaiah',
          'The disciples vote democratically on what they believe happened to Jesus'
        ],
        answerKey: 0,
        hint: 'Look for the presence of the voice from heaven, the dove, and Jesus in the Jordan.',
        explanation: 'At Christ\'s Baptism (a key theophany), all three Divine Persons are revealed at once: the Son in the water, the Holy Spirit descending like a dove, and the Father\'s voice from heaven.'
      }
    ]
  },

  'ks4:religious-studies:catholic-sources-of-authority': {
    topicId: 'catholic-sources-of-authority',
    title: 'Sources of Authority: Scripture, Tradition & Magisterium',
    keyStage: 'Key Stage 4',
    subject: 'Religious Studies (General & GCSE)',
    coreAxiom: 'Catholic authority rests upon a "three-legged stool": Sacred Scripture (written word of God), Sacred Tradition (living transmission of the Gospel through the Apostles), and the Magisterium (teaching authority of the Pope and Bishops in apostolic succession). None can stand alone; all three work harmoniously under the guidance of the Holy Spirit (Dei Verbum 10).',
    cognitiveTrap: 'Assuming Catholics rely on Scripture alone (Sola Scriptura), or conversely believing the Pope can invent brand-new doctrines disconnected from apostolic tradition.',
    socraticPivot: 'Why does the Catholic Church teach that the Magisterium is not superior to the Word of God, but its servant?',
    hook: 'If two people read the same Bible verse and come up with opposite interpretations, who has the authority to decide what it truly means?',
    guidedStep: 'Understand the Ordinary vs Extraordinary Magisterium (Papal Infallibility "Ex Cathedra" and Ecumenical Councils). Cite Vatican II\'s Dogmatic Constitution on Divine Revelation (Dei Verbum).',
    scaffoldHints: {
      level1: 'Sola Scriptura (Scripture alone) is a Protestant principle; Catholicism holds Scripture and Tradition as one single sacred deposit of faith.',
      level2: 'Papal Infallibility only applies under strict conditions: faith/morals, ex cathedra, binding the whole Church.',
      level3: 'Apostolic Succession means bishops trace an unbroken line of consecration back to the twelve Apostles.'
    },
    questions: [
      {
        id: 'ks4-re-auth-1',
        prompt: 'What constitutes the "three-legged stool" of divine authority in the Catholic Church according to Dei Verbum?',
        options: [
          'Sacred Scripture, Sacred Tradition, and the Magisterium working in mutual harmony',
          'The Bible, the British Parliament, and the United Nations Declaration of Human Rights',
          'The Pope\'s personal opinions, daily newspapers, and local church councils',
          'Scripture alone, rejecting all historical traditions and ecclesiastical offices'
        ],
        answerKey: 0,
        hint: 'Catholicism combines the written word, the living tradition of the apostles, and the official teaching office.',
        explanation: 'Dei Verbum 10 teaches that Sacred Tradition, Sacred Scripture, and the Magisterium are so linked together that one cannot stand without the others, each contributing effectively to the salvation of souls.'
      },
      {
        id: 'ks4-re-auth-2',
        prompt: 'Under what specific criteria does Papal Infallibility apply according to the First Vatican Council (Pastor Aeternus, 1870)?',
        options: [
          'When the Pope speaks "Ex Cathedra" as supreme shepherd, defining a doctrine concerning faith or morals to be held by the whole Church',
          'Whenever the Pope gives an impromptu press conference or personal interview on an aeroplane',
          'In all political elections, scientific disputes, and national economic policies',
          'Only when the Pope agrees with all world political leaders unanimously'
        ],
        answerKey: 0,
        hint: '"Ex Cathedra" literally means "from the chair" of St Peter.',
        explanation: 'Papal Infallibility is strictly limited: the Pope must speak Ex Cathedra (from the Chair of Peter), explicitly intending to define a dogma regarding faith or morals, to be definitively held by the universal Church.'
      }
    ]
  },

  'ks4:religious-studies:catholic-eschatology': {
    topicId: 'catholic-eschatology',
    title: 'Eschatology: Death, Judgment, Purgatory, Heaven & Hell',
    keyStage: 'Key Stage 4',
    subject: 'Religious Studies (General & GCSE)',
    coreAxiom: 'Catholic eschatology concerns the "Four Last Things": Death, Judgment, Heaven, and Hell. Immediately at death, each person undergoes the Particular Judgment. Those dying in God\'s grace but incompletely purified undergo Purgatory to achieve the holiness required to enter the Beatific Vision of Heaven. Hell is eternal self-exclusion from communion with God resulting from unrepented mortal sin (CCC 1020-1060).',
    cognitiveTrap: 'Viewing Purgatory as a "second chance" to change one\'s mind about God, or viewing Hell as a torture chamber created by God to take revenge, rather than the tragic ultimate consequence of free will rejecting divine love.',
    socraticPivot: 'Why does Catholic theology describe Hell as "eternal self-exclusion from communion with God" rather than God actively damning someone against their will?',
    hook: 'If God is infinitely loving, why would Hell exist? How does human free will make the reality of Hell necessary?',
    guidedStep: 'Distinguish: Particular Judgment (at moment of death) vs Final/General Judgment (at the end of time when bodies are resurrected). Explore the biblical basis for Purgatory (2 Maccabees 12:46, 1 Corinthians 3:15) and prayer for the dead.',
    scaffoldHints: {
      level1: 'The Beatific Vision is seeing God face-to-face in direct, eternal communion in Heaven.',
      level2: 'Purgatory is not a permanent third destination; everyone in Purgatory will eventually enter Heaven.',
      level3: 'Catholics pray for the souls of the departed, especially during the month of November and on All Souls\' Day.'
    },
    questions: [
      {
        id: 'ks4-re-esch-1',
        prompt: 'What is the purpose of Purgatory in Catholic theology?',
        options: [
          'A final purification for those who die in God\'s grace and friendship, so they may achieve the holiness necessary to enter the joy of Heaven',
          'A punishment realm where souls are tortured forever with no hope of entering Heaven',
          'A reincarnation holding zone where souls wait to be reborn into new earthly animal bodies',
          'A second chance for souls in Hell to take an exam and earn forgiveness'
        ],
        answerKey: 0,
        hint: 'Think of Purgatory as a spiritual cleansing before entering the pure presence of God (Revelation 21:27).',
        explanation: 'Catechism of the Catholic Church 1030 states that all who die in God\'s grace, but still imperfectly purified, undergo purification after death to achieve the holiness necessary to enter heaven.'
      },
      {
        id: 'ks4-re-esch-2',
        prompt: 'How does the Catechism of the Catholic Church (CCC 1033) define Hell?',
        options: [
          'The state of definitive, eternal self-exclusion from communion with God and the blessed',
          'A temporary prison managed by the Roman government beneath the Colosseum',
          'A fictional myth invented in the 17th century that Catholics are not required to believe',
          'A physical fire chamber where God forces good people to suffer against their will'
        ],
        answerKey: 0,
        hint: 'God does not force anyone to reject Him; Hell is the chosen refusal of divine love.',
        explanation: 'Hell is defined as eternal separation from God, freely chosen by a person who obstinately persists in mortal sin and refuses God\'s merciful love until death.'
      }
    ]
  },

  'ks4:religious-studies:ethics-peace-conflict': {
    topicId: 'ethics-peace-conflict',
    title: 'Ethics: Peace, Conflict and Justice',
    keyStage: 'Key Stage 4',
    subject: 'Religious Studies (General & GCSE)',
    coreAxiom: 'Catholic teaching on warfare is grounded in the Just War Theory (originated by St Augustine and developed by St Thomas Aquinas), establishing strict criteria under which military force may be morally justifiable: legitimate authority, just cause, right intention, last resort, proportionality, and probability of success. Pacifism also has deep roots in the Gospel of peace and early Christian martyrdom (CCC 2302-2317).',
    cognitiveTrap: 'Assuming Just War Theory gives countries permission to attack for wealth or revenge, or ignoring the strict contemporary requirements of proportionality regarding nuclear, biological, and chemical weapons.',
    socraticPivot: 'In modern warfare with weapons of mass destruction, can the criteria of "proportionality" and "protecting non-combatants" ever truly be satisfied?',
    hook: 'Jesus said in the Sermon on the Mount: "Blessed are the peacemakers, for they shall be called children of God." Does this mean a Christian can never serve in the military?',
    guidedStep: 'Examine Jus ad Bellum (conditions before war: just cause, legitimate authority, last resort) and Jus in Bello (conduct during war: non-combatant immunity, proportionality). Contrast with Christian Pacifism (Quakers, early Church).',
    scaffoldHints: {
      level1: 'Just cause means resisting grave, certain, lasting aggression; wars for national pride or territory are never just.',
      level2: 'Non-combatant immunity means civilians must never be targeted intentionally under any circumstances.',
      level3: 'Recent Popes (St John Paul II, Francis in Fratelli Tutti) have warned that modern weapons make the "just war" criteria almost impossible to meet.'
    },
    questions: [
      {
        id: 'ks4-re-war-1',
        prompt: 'Which condition is a fundamental requirement of "Jus ad Bellum" in Catholic Just War Theory?',
        options: [
          'Last Resort: all peaceful diplomatic negotiations must have been completely tried and failed',
          'First Strike: launching surprise attacks to gain sudden economic and territorial advantage',
          'Complete Annihilation: eliminating the entire civilian population of the opposing nation',
          'Financial Profit: ensuring the military campaign yields substantial gold and mineral wealth'
        ],
        answerKey: 0,
        hint: 'War is only considered when every non-violent method has been exhausted.',
        explanation: 'According to CCC 2309, all other means of putting an end to the grave injustice must have been shown to be impractical or ineffective before armed force may be considered.'
      },
      {
        id: 'ks4-re-war-2',
        prompt: 'What does the principle of "Non-Combatant Immunity" strictly demand during warfare?',
        options: [
          'Civilians, hospitals, and unarmed populations must never be deliberately targeted or attacked',
          'Soldiers must never surrender even if defeated',
          'Soldiers are permitted to target anyone in enemy territory without distinction',
          'Only volunteer soldiers may be paid during wartime'
        ],
        answerKey: 0,
        hint: 'Combatants are active soldiers; non-combatants are innocent citizens, doctors, children, and elders.',
        explanation: 'Just War Theory and international humanitarian law strictly forbid the intentional targeting of non-combatants (civilians). Attacking innocent lives is intrinsically evil.'
      }
    ]
  },

  // =========================================================================
  // KEY STAGE 3 & 4: Mathematics (Advanced Algebra, Geometry, Probability)
  // =========================================================================
  'ks3:maths:algebraic-expressions': {
    topicId: 'algebraic-expressions',
    title: 'Algebraic Expressions & Indices',
    keyStage: 'Key Stage 3',
    subject: 'Mathematics',
    coreAxiom: 'Algebra generalizes arithmetic using variables. When simplifying expressions, only LIKE TERMS (terms with identical variable powers) can be added or subtracted. Index laws dictate that when multiplying like bases we add indices (a^m * a^n = a^(m+n)), and when dividing we subtract indices (a^m / a^n = a^(m-n)).',
    cognitiveTrap: 'Adding unlike terms (e.g. thinking 3x + 2y = 5xy, or 2x + 3x^2 = 5x^3), or multiplying indices instead of adding them when multiplying bases (e.g. thinking x^2 * x^3 = x^6).',
    socraticPivot: 'If x represents an apple and y represents a banana, what does 3x + 2y represent? Can you turn it into 5 "apple-bananas"?',
    hook: 'Why do computer programmers and aerospace engineers use algebra instead of calculating everything by hand with specific numbers?',
    guidedStep: 'Group like terms with their preceding signs: (3x - 5) + (2x + 7) = (3x + 2x) + (-5 + 7) = 5x + 2. For index laws: x^3 * x^4 = (x*x*x) * (x*x*x*x) = x^7.',
    scaffoldHints: {
      level1: 'Circle terms with the same variable and sign before combining.',
      level2: 'x * x = x^2, but x + x = 2x. Never confuse multiplication with addition.',
      level3: 'Any non-zero base raised to the power 0 equals 1 (a^0 = 1).'
    },
    questions: [
      {
        id: 'ks3-mat-alg-1',
        prompt: 'Simplify the algebraic expression: 4x + 7y - 2x + 3y',
        options: [
          '2x + 10y',
          '12xy',
          '6x + 10y',
          '2x - 4y'
        ],
        answerKey: 0,
        hint: 'Combine the x terms (4x - 2x) and then combine the y terms (7y + 3y).',
        explanation: 'Group like terms: 4x - 2x = 2x, and 7y + 3y = 10y. The simplified expression is 2x + 10y.'
      },
      {
        id: 'ks3-mat-alg-2',
        prompt: 'Simplify using the laws of indices: (x^4) * (x^5)',
        options: [
          'x^9 (Add the powers because the bases are identical)',
          'x^20 (Mistakenly multiplied the powers)',
          '2x^9 (Mistakenly added the bases)',
          'x^1 (Mistakenly subtracted the powers)'
        ],
        answerKey: 0,
        hint: 'When multiplying powers with the same base, add the exponents: a^m * a^n = a^(m+n).',
        explanation: 'According to index laws, x^4 * x^5 = x^(4+5) = x^9.'
      },
      {
        id: 'ks3-mat-alg-3',
        prompt: 'What is the value of 7^0?',
        options: [
          '1 (Any non-zero number to power 0 equals 1)',
          '0',
          '7',
          '70'
        ],
        answerKey: 0,
        hint: 'Think of index division: 7^3 / 7^3 = 7^(3-3) = 7^0. What is any number divided by itself?',
        explanation: 'Any non-zero number raised to the power of zero equals 1 because a^n / a^n = a^(n-n) = a^0 = 1.'
      }
    ]
  },

  'ks4:maths:quadratic-equations': {
    topicId: 'quadratic-equations',
    title: 'Quadratic Equations & Graphs',
    keyStage: 'Key Stage 4',
    subject: 'Mathematics',
    coreAxiom: 'A quadratic equation has the general form ax^2 + bx + c = 0 (where a ≠ 0). Solutions (roots) represent the x-intercepts of a parabola graph. Quadratics can be solved by factorising into double brackets, completing the square, or using the quadratic formula: x = (-b ± √(b^2 - 4ac)) / (2a).',
    cognitiveTrap: 'Forgetting that quadratic equations usually have TWO solutions (±), or dividing both sides by x (e.g. turning x^2 = 5x into x = 5, losing the root x = 0).',
    socraticPivot: 'When factorising x^2 + 5x + 6 = 0 into (x + p)(x + q) = 0, what must p and q multiply to, and what must they add to?',
    hook: 'The trajectory of an arrow, a basketball shot, and water from a fountain all follow parabolic curves described by quadratic equations!',
    guidedStep: 'Find two numbers that multiply to c and add to b. Set each bracket equal to zero: if (x + 2)(x + 3) = 0, then x = -2 or x = -3.',
    scaffoldHints: {
      level1: 'Zero Product Property: If A * B = 0, then either A = 0 or B = 0.',
      level2: 'For x^2 - 9 = 0, notice the Difference of Two Squares: (x - 3)(x + 3) = 0, so x = 3 or x = -3.',
      level3: 'The discriminant (b^2 - 4ac) reveals the number of real roots: > 0 (two distinct roots), = 0 (one repeated root), < 0 (no real roots).'
    },
    questions: [
      {
        id: 'ks4-mat-quad-1',
        prompt: 'Solve the quadratic equation by factorising: x^2 - 7x + 12 = 0',
        options: [
          'x = 3 and x = 4',
          'x = -3 and x = -4',
          'x = 2 and x = 6',
          'x = 1 and x = 12'
        ],
        answerKey: 0,
        hint: 'Find two numbers that multiply to +12 and add to -7, then set brackets (x - p)(x - q) = 0.',
        explanation: 'The factors of +12 that add to -7 are -3 and -4: (x - 3)(x - 4) = 0. Therefore x = 3 or x = 4.'
      },
      {
        id: 'ks4-mat-quad-2',
        prompt: 'What are the solutions to x^2 - 25 = 0 using the Difference of Two Squares?',
        options: [
          'x = 5 and x = -5',
          'x = 5 only (Mistakenly neglected the negative root)',
          'x = 25 and x = -25',
          'x = 0 and x = 5'
        ],
        answerKey: 0,
        hint: 'Remember that (-5)^2 is also equal to +25.',
        explanation: 'x^2 - 25 factors into (x - 5)(x + 5) = 0, giving two valid real roots: x = 5 and x = -5.'
      }
    ]
  },

  'ks4:maths:trigonometry': {
    topicId: 'trigonometry',
    title: 'Trigonometry (SOH CAH TOA)',
    keyStage: 'Key Stage 4',
    subject: 'Mathematics',
    coreAxiom: 'In any right-angled triangle, the trigonometric ratios relate the angles to ratios of side lengths: sin(θ) = Opposite / Hypotenuse; cos(θ) = Adjacent / Hypotenuse; tan(θ) = Opposite / Adjacent (mnemonic: SOH CAH TOA). The hypotenuse is always the longest side opposite the 90° right angle.',
    cognitiveTrap: 'Misidentifying the Opposite and Adjacent sides relative to the chosen reference angle θ, or using trigonometry on triangles that do not contain a 90° right angle without the Sine/Cosine Rule.',
    socraticPivot: 'If you stand at angle θ, which side is across the room from you (Opposite) and which side forms part of the angle next to you (Adjacent)?',
    hook: 'Ancient Greek astronomers and modern GPS satellites calculate distances across planets and oceans using right-angled trigonometry!',
    guidedStep: '1. Label Hypotenuse (opposite 90°). 2. Label Opposite (opposite angle θ). 3. Label Adjacent (between θ and 90°). 4. Pick ratio using SOH CAH TOA. 5. Rearrange and solve.',
    scaffoldHints: {
      level1: 'SOH: sin = Opp/Hyp; CAH: cos = Adj/Hyp; TOA: tan = Opp/Adj.',
      level2: 'To find an angle when sides are known, use the inverse functions: sin^-1, cos^-1, or tan^-1.',
      level3: 'Check your calculator is in DEG (degrees) mode, not RAD (radians).'
    },
    questions: [
      {
        id: 'ks4-mat-trig-1',
        prompt: 'In a right-angled triangle, the side opposite angle θ is 6 cm and the hypotenuse is 10 cm. What is sin(θ)?',
        options: [
          '0.6 (sin = Opposite / Hypotenuse = 6 / 10)',
          '0.8 (cos = Adjacent / Hypotenuse)',
          '1.67 (Inverted ratio)',
          '0.75 (tan ratio)'
        ],
        answerKey: 0,
        hint: 'Recall SOH from SOH CAH TOA: sin(θ) = Opposite / Hypotenuse.',
        explanation: 'sin(θ) = Opposite / Hypotenuse = 6 / 10 = 0.6.'
      },
      {
        id: 'ks4-mat-trig-2',
        prompt: 'Which trigonometric ratio should be used to find the adjacent side when an angle θ and the opposite side are given?',
        options: [
          'tan(θ) = Opposite / Adjacent (Rearranged to Adjacent = Opposite / tan(θ))',
          'sin(θ) = Opposite / Hypotenuse',
          'cos(θ) = Adjacent / Hypotenuse',
          'Pythagoras theorem alone without the angle'
        ],
        answerKey: 0,
        hint: 'Look for the ratio that links Opposite and Adjacent (TOA).',
        explanation: 'TOA in SOH CAH TOA states tan(θ) = Opposite / Adjacent. When Opposite and θ are known, Adjacent = Opposite / tan(θ).'
      }
    ]
  },

  // =========================================================================
  // KEY STAGE 4: Sciences (Physics, Chemistry, Biology)
  // =========================================================================
  'ks4:physics:em-spectrum': {
    topicId: 'em-spectrum',
    title: 'Waves and Electromagnetic Spectrum',
    keyStage: 'Key Stage 4',
    subject: 'Physics',
    coreAxiom: 'The Electromagnetic (EM) Spectrum consists of continuous transverse waves that travel at the speed of light (3 x 10^8 m/s in vacuum): Radio waves, Microwaves, Infrared, Visible light, Ultraviolet, X-rays, Gamma rays (mnemonic: Real Men In Venice Use X-ray Guns). Wavelength decreases and frequency/energy increases from Radio to Gamma. Higher frequencies (UV, X-ray, Gamma) are ionising and can cause cellular DNA damage.',
    cognitiveTrap: 'Confusing the speed of light with sound (sound is a longitudinal wave requiring a medium; EM waves are transverse and travel through a vacuum), or thinking radio waves are sound waves.',
    socraticPivot: 'Why can sunlight reach Earth across the vast vacuum of space, but the roaring sound of the Sun\'s nuclear fusion cannot?',
    hook: 'Your mobile phone, microwave oven, dentist\'s X-ray, and TV remote all use the exact same type of wave—just at different frequencies and wavelengths!',
    guidedStep: 'Wave speed formula: v = f * λ (Wave speed = frequency * wavelength). As frequency increases, wavelength must decrease because speed v is constant.',
    scaffoldHints: {
      level1: 'All EM waves travel at the same speed in a vacuum: 300,000,000 m/s.',
      level2: 'Radio waves have longest wavelength and lowest frequency; Gamma rays have shortest wavelength and highest frequency.',
      level3: 'Ionising radiation: Ultraviolet, X-rays, Gamma rays. They have enough photon energy to knock electrons off atoms.'
    },
    questions: [
      {
        id: 'ks4-phy-em-1',
        prompt: 'Which electromagnetic wave has the highest frequency, highest photon energy, and shortest wavelength?',
        options: [
          'Gamma rays',
          'Radio waves',
          'Visible light',
          'Infrared radiation'
        ],
        answerKey: 0,
        hint: 'Think of the high-energy radiation emitted by radioactive atomic nuclei.',
        explanation: 'Gamma rays sit at the extreme high-frequency end of the EM spectrum, possessing the shortest wavelengths and greatest photon energy.'
      },
      {
        id: 'ks4-phy-em-2',
        prompt: 'Why are Ultraviolet, X-rays, and Gamma rays classified as "ionising radiation" while Radio and Microwaves are not?',
        options: [
          'Their frequencies are high enough to carry sufficient energy to knock electrons off atoms, damaging biological DNA and cells',
          'They travel faster than the speed of light',
          'They are longitudinal sound waves that cause eardrum damage',
          'They only exist inside nuclear reactors on Earth'
        ],
        answerKey: 0,
        hint: 'Ionisation means removing an electron from an atom or molecule.',
        explanation: 'High-frequency EM waves carry sufficient quantum energy per photon to remove tightly bound electrons from atoms (ionisation), creating free radicals that can mutate DNA.'
      }
    ]
  },

  'ks4:chemistry:quantitative-chemistry': {
    topicId: 'quantitative-chemistry',
    title: 'Quantitative Chemistry & Moles',
    keyStage: 'Key Stage 4',
    subject: 'Chemistry',
    coreAxiom: 'The mole is the unit for amount of substance: 1 mole contains Avogadro\'s constant of particles (6.02 x 10^23). Mass, moles, and relative formula mass (Mr) are linked by the fundamental equation: Moles = Mass (g) / Mr. In chemical reactions, mass is conserved: total mass of reactants equals total mass of products.',
    cognitiveTrap: 'Thinking 1 mole of carbon has the same mass as 1 mole of uranium (they have the same NUMBER of atoms, but different atomic masses), or forgetting to calculate Mr by multiplying atomic masses by formula subscripts.',
    socraticPivot: 'A baker counts donuts in dozens (12). Why do chemists count atoms in moles (6.02 x 10^23) instead of individual atoms?',
    hook: 'Atoms are so tiny that a single drop of water contains approximately 1.5 sextillion (1,500,000,000,000,000,000,000) water molecules!',
    guidedStep: 'Formula: Moles = Mass / Mr. Example: Water (H2O) has Mr = (2 * 1) + 16 = 18 g/mol. Therefore 36 g of water is 36 / 18 = 2 moles.',
    scaffoldHints: {
      level1: 'Find Mr by adding the relative atomic masses (Ar) of all atoms in the formula from the Periodic Table.',
      level2: 'Moles = Mass in grams divided by Mr. Mass = Moles * Mr.',
      level3: 'Avogadro\'s constant = 6.02 x 10^23 particles per mole.'
    },
    questions: [
      {
        id: 'ks4-chm-mol-1',
        prompt: 'What is the relative formula mass (Mr) of Calcium Carbonate (CaCO3)? (Ar: Ca = 40, C = 12, O = 16)',
        options: [
          '100 (40 + 12 + (16 * 3))',
          '68 (Forgot to multiply oxygen by 3)',
          '401216',
          '52'
        ],
        answerKey: 0,
        hint: 'Multiply the mass of oxygen (16) by its subscript 3, then add Calcium (40) and Carbon (12).',
        explanation: 'Mr of CaCO3 = 40 + 12 + (3 * 16) = 40 + 12 + 48 = 100 g/mol.'
      },
      {
        id: 'ks4-chm-mol-2',
        prompt: 'How many moles of carbon dioxide (CO2, Mr = 44) are present in 88 grams of CO2 gas?',
        options: [
          '2 moles (88 g / 44 g/mol)',
          '0.5 moles (Inverted formula)',
          '44 moles',
          '3872 moles'
        ],
        answerKey: 0,
        hint: 'Use the formula: Moles = Mass / Mr.',
        explanation: 'Moles = Mass / Mr = 88 g / 44 g/mol = 2 moles.'
      }
    ]
  },

  'ks4:biology:homeostasis-response': {
    topicId: 'homeostasis-response',
    title: 'Homeostasis and Response',
    keyStage: 'Key Stage 4',
    subject: 'Biology',
    coreAxiom: 'Homeostasis is the regulation of internal conditions of a cell or organism to maintain optimum conditions for enzyme function and cell survival in response to internal and external changes. In humans, automatic negative feedback control systems regulate blood glucose concentration (insulin and glucagon), body temperature (vasodilation, sweating, shivering), and water levels (ADH from pituitary gland).',
    cognitiveTrap: 'Confusing insulin and glucagon (insulin lowers blood glucose by moving it into cells and storing it as glycogen in liver; glucagon raises blood glucose by converting glycogen back to glucose).',
    socraticPivot: 'Why does human body temperature need to be tightly controlled around 37°C? What happens to enzymes if temperature rises to 45°C?',
    hook: 'Whether you are in freezing snow or a baking desert, your core body temperature stays at precisely ~37°C. How does your body maintain this delicate balance without you even thinking about it?',
    guidedStep: 'Negative Feedback Loop: Receptor detects change -> Coordination Centre (brain/pancreas) processes -> Effector (muscle/gland) produces response to restore normal optimum level.',
    scaffoldHints: {
      level1: 'Insulin is released when blood sugar is high (after eating); glucagon is released when blood sugar is low (when glucose is GONE).',
      level2: 'When hot: vasodilation (blood vessels dilate near skin surface to radiate heat) and sweating.',
      level3: 'Enzymes denature at high temperatures, changing their active site shape permanently.'
    },
    questions: [
      {
        id: 'ks4-bio-hom-1',
        prompt: 'How does the hormone insulin restore normal blood glucose levels when blood sugar rises after a meal?',
        options: [
          'It stimulates cells to absorb glucose from blood, and causes liver and muscle cells to store excess glucose as glycogen',
          'It breaks down liver glycogen into free glucose molecules to increase blood sugar',
          'It causes the kidneys to excrete all blood proteins into the urine',
          'It signals the stomach to immediately stop digesting food'
        ],
        answerKey: 0,
        hint: 'Insulin moves glucose IN to cells, lowering glucose in the bloodstream.',
        explanation: 'Insulin produced by the pancreas allows body cells to take up glucose and directs the liver to convert glucose into stored glycogen, reducing blood glucose levels back to normal.'
      },
      {
        id: 'ks4-bio-hom-2',
        prompt: 'Why do blood capillaries near the skin surface dilate (vasodilation) when body temperature rises?',
        options: [
          'It increases blood flow near the skin surface, transferring more thermal energy to the surroundings by radiation',
          'It stops blood from flowing so the body cools down instantly',
          'It thickens the skin to prevent sunlight entering the body',
          'It redirects all blood to the liver to warm up the core'
        ],
        answerKey: 0,
        hint: 'When warm, your skin turns flushed pink because blood vessels widen near the surface.',
        explanation: 'During vasodilation, arterioles dilate so more warm blood flows through skin capillaries, radiating excess thermal energy away from the body to cool down.'
      }
    ]
  }
};
