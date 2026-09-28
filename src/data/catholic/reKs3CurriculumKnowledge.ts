// src/data/catholic/reKs3CurriculumKnowledge.ts
// St Joseph's Catholic Life & Faith Sanctuary
// Key Stage 3 Religious Education (Catholic Theology, Creeds, Confirmation, Paschal Mystery & Rosary)
// Modularized extracted topics ensuring all curriculum data files remain strictly maintainable and < 600 lines.

import type { CurriculumTopicEntry } from '../curriculumKnowledgeExpansion';

export const CATHOLIC_KS3_KNOWLEDGE: Record<string, CurriculumTopicEntry> = {
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
      },
      {
        id: 'ks3-re-trinity-6',
        prompt: 'What ancient Trinitarian heresy falsely claimed that the Father, Son, and Holy Spirit are not three distinct eternal Persons, but merely three temporary masks or modes worn by one solitary God?',
        options: [
          'Modalism (or Sabellianism)',
          'Arianism',
          'Pelagianism',
          'Donatism'
        ],
        answerKey: 0,
        hint: 'This heresy views God like an actor changing costumes or modes depending on the role.',
        explanation: 'Modalism (Sabellianism) denies the real distinction between the three divine Persons, treating Father, Son, and Holy Spirit merely as three consecutive modes of one divine Person.'
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
      },
      {
        id: 'ks3-re-conf-5',
        prompt: 'What is the primary spiritual purpose of selecting a Confirmation Saint\'s name and choosing a sponsor for the sacrament?',
        options: [
          'To adopt a patron saint as a heavenly role model and intercessor, and to have a practicing Catholic guide for spiritual growth',
          'To officially change one\'s legal surname on national government registers',
          'To qualify for financial loans from the local parish',
          'To replace one\'s biological family in civil law'
        ],
        answerKey: 0,
        hint: 'The saint prays for the candidate and provides an inspiring example of following Jesus.',
        explanation: 'Taking a saint\'s name provides the candidate with a spiritual patron and exemplar of virtue, while the sponsor commits to assisting the candidate to lead a Christian life in harmony with baptism.'
      },
      {
        id: 'ks3-re-conf-6',
        prompt: 'Which of the Twelve Fruits of the Holy Spirit (Galatians 5:22-23) describes the inner calm and trust that comes from being reconciled with God and others?',
        options: [
          'Peace (Pax)',
          'Ambition',
          'Curiosity',
          'Pride'
        ],
        answerKey: 0,
        hint: 'Jesus gave this greeting to His apostles after the Resurrection: "_____ be with you."',
        explanation: 'Peace is a Fruit of the Holy Spirit reflecting the tranquil order and soul-deep serenity that comes from communion with God and charity towards one\'s neighbour.'
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
      },
      {
        id: 'ks3-re-pasch-4',
        prompt: 'What happened during Christ\'s "Descent into Hell" (Harrowing of Hell / Hades) commemorated on Holy Saturday before His Resurrection?',
        options: [
          'Christ in His holy soul proclaimed salvation to the righteous souls (such as Adam, Eve, and Abraham) who were waiting to enter heaven',
          'Christ was condemned to eternal torment like the damned',
          'Christ ceased to exist until the Father recreated Him on Sunday',
          'Christ travelled to Rome to confront the Roman Emperor'
        ],
        answerKey: 0,
        hint: 'The Apostles\' Creed states: "He descended into hell; on the third day he rose again from the dead."',
        explanation: 'As the Catechism (CCC 632-635) teaches, Christ descended to the realm of the dead to free the holy souls who were awaiting their Redeemer and open heaven\'s gates to them.'
      },
      {
        id: 'ks3-re-pasch-5',
        prompt: 'What is commemorated on Ascension Thursday, forty days after Easter Sunday in the liturgical year?',
        options: [
          'Jesus returning in glory to the Father, entering heavenly sanctuary with His glorified human nature',
          'The birth of the Church with tongues of fire in the upper room',
          'The arrival of the Wise Men in Bethlehem',
          'The arrest of Jesus in the Garden of Gethsemane'
        ],
        answerKey: 0,
        hint: 'Forty days after Easter, Christ ascended into heaven in the presence of His disciples.',
        explanation: 'The Ascension (Acts 1:9-11) marks Christ\'s definitive entrance into heavenly sanctuary at the right hand of the Father, elevating human nature to divine glory.'
      },
      {
        id: 'ks3-re-pasch-6',
        prompt: 'How is the historical sacrifice of Jesus on Mount Calvary made present in Catholic worship today?',
        options: [
          'Through the celebration of the Holy Eucharist (Mass), where the one sacrifice of the Cross is re-presented in an unbloody sacramental manner',
          'By sacrificing livestock at the parish altar every Sunday',
          'Only as an annual theatrical passion play acted out during Holy Week',
          'Through written exam papers taken by secondary school students'
        ],
        answerKey: 0,
        hint: 'The Mass is not a new sacrifice or re-killing of Jesus; it is the memorial re-presentation of Calvary.',
        explanation: 'Catholic doctrine teaches that the Mass is the same sacrifice as that of the Cross: Christ offers Himself through the ministry of the priest, making His saving grace actively present to the Church.'
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
      },
      {
        id: 'ks3-re-mary-4',
        prompt: 'What does the ancient title "Theotokos" (defined at the Council of Ephesus in 431 AD) proclaim about the Virgin Mary?',
        options: [
          'She is the "God-bearer" or Mother of God because Jesus is one divine person with a fully human and fully divine nature',
          'She existed before God created the universe',
          'She is the biological creator of God the Father',
          'She was an earthly queen of the Roman Empire'
        ],
        answerKey: 0,
        hint: 'The Greek word "Theos" means God and "tokos" means bearer or mother.',
        explanation: 'The Council of Ephesus (431 AD) affirmed Mary as Theotokos (Mother of God) against Nestorius, ensuring that Christ\'s true divinity and humanity in one single divine person are upheld.'
      },
      {
        id: 'ks3-re-mary-5',
        prompt: 'What does the Catholic dogma of the "Assumption of Mary" (defined by Pope Pius XII in 1950) declare?',
        options: [
          'Mary, at the end of her earthly life, was taken up body and soul into heavenly glory',
          'Mary was elected as the first bishop of Rome',
          'Mary assumed leadership over the Roman legions',
          'Mary never lived on Earth and was an angel from heaven'
        ],
        answerKey: 0,
        hint: 'Because she was preserved from original sin, Mary shared directly in her Son\'s bodily resurrection.',
        explanation: 'The dogma of the Assumption proclaims that Mary was assumed body and soul into heavenly glory, anticipating the bodily resurrection promised to all faithful Christians.'
      },
      {
        id: 'ks3-re-mary-6',
        prompt: 'Which of the following describes the biblical structure of the "Hail Mary" prayer recited in each decade of the Rosary?',
        options: [
          'The greeting of the Archangel Gabriel (Luke 1:28), Elizabeth\'s blessing (Luke 1:42), and the Church\'s petition for Mary\'s intercession now and at the hour of death',
          'A psalm composed by King David in the Old Testament',
          'A poem written by St Francis of Assisi in the Middle Ages',
          'A translation of Roman imperial civil laws'
        ],
        answerKey: 0,
        hint: '"Hail Mary, full of grace, the Lord is with thee..." comes directly from Gabriel\'s words at the Annunciation.',
        explanation: 'The Hail Mary weaves together Scripture from the Annunciation and Visitation with the Church\'s petition asking the Mother of God to pray for sinners.'
      }
    ]
  },
};
