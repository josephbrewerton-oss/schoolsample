// src/data/catholic/reCurriculumKnowledge.ts
// St Joseph's Catholic Life & Faith Sanctuary
// UK National Curriculum Religious Education (Catholic First Holy Communion & Liturgy)
// Modularized extracted topics ensuring all curriculum data files remain strictly maintainable and < 600 lines.

import type { CurriculumTopicKnowledge } from '../oakCurriculumKnowledge';

export const CATHOLIC_KS2_KNOWLEDGE: Record<string, CurriculumTopicKnowledge> = {
  // --- KS2 Religious Education (Catholic First Holy Communion Programme) ---
  'ks2:religious-education-catholic:sacrament-of-baptism': {
    topicId: 'sacrament-of-baptism',
    title: 'Baptism: Belonging to the Family of God',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'Baptism is the gateway to life in the Spirit and the door giving access to the other Sacraments. Through holy water and the Holy Spirit, we are freed from original sin and reborn as children of God into the Catholic Church (CCC 1213).',
    cognitiveTrap: 'Believing that Baptism is merely a naming party or celebration, rather than a real spiritual transformation making us living members of the Body of Christ.',
    socraticPivot: 'What do the holy water and the white garment at Baptism show us about what God does inside our souls?',
    hook: 'When someone joins a sports team or school, they receive a special uniform. What holy symbols show that a person has joined God\'s family in the Catholic Church?',
    guidedStep: 'Explore the 4 key signs of Baptism: Holy Water (cleansing from sin and giving new life), Sacred Chrism Oil (anointing with the Holy Spirit as priest, prophet, and king), White Garment (clothed in Christ and spiritual purity), and the Baptismal Candle (Christ as the Light of the World).',
    scaffoldHints: {
      level1: 'Think about washing your hands when they are dirty: water cleans our body on the outside, while the Sacrament of Baptism washes our soul clean inside.',
      level2: 'In Baptism, the priest pours water three times saying: "I baptize you in the name of the Father, and of the Son, and of the Holy Spirit."',
      level3: 'Baptism leaves a permanent, indelible spiritual seal on our soul. Because we are now children of God, we are invited to prepare for Reconciliation and the Holy Eucharist.'
    },
    questions: [
      {
        id: 'ks2-re-bap-1',
        prompt: 'What is the main spiritual gift received in the Sacrament of Baptism?',
        options: [
          'We are freed from original sin and welcomed as children of God into the Church',
          'We receive a certificate to keep in a school drawer',
          'We choose our future career and occupation',
          'We become an official choir singer in the parish'
        ],
        answerKey: 0,
        hint: 'Think about being washed clean from sin and entering God\'s family.',
        explanation: 'Baptism washes away original sin, pours sanctifying grace into our soul, and makes us beloved sons and daughters of God.'
      },
      {
        id: 'ks2-re-bap-2',
        prompt: 'Which essential words does the priest or deacon say while pouring holy water three times during Baptism?',
        options: [
          '"I baptize you in the name of the Father, and of the Son, and of the Holy Spirit"',
          '"Welcome to our school community, peace be with you"',
          '"May you grow tall, strong, and prosperous in life"',
          '"By the power of the church building, you are named"'
        ],
        answerKey: 0,
        hint: 'Remember the Trinity: Father, Son, and Holy Spirit.',
        explanation: 'The Trinitarian formula commanded by Jesus in Matthew 28:19 is the essential form of the Sacrament of Baptism.'
      },
      {
        id: 'ks2-re-bap-3',
        prompt: 'What does the white garment given to the newly baptized person represent?',
        options: [
          'Purity, new life, and having "put on Christ"',
          'That it is a formal party day',
          'That the person must always wear white clothes to church',
          'The cold temperature of holy water'
        ],
        answerKey: 0,
        hint: 'White represents clean innocence and belonging wholly to Christ.',
        explanation: 'The white garment symbolizes that the baptized person has been cleansed of sin and has put on the righteousness of Christ (Galatians 3:27).'
      },
      {
        id: 'ks2-re-bap-4',
        prompt: 'What does the Baptismal Candle, lit from the tall Easter (Paschal) Candle, symbolize for the baptized child?',
        options: [
          'Christ as the Light of the World guiding the child to walk always as a child of the light',
          'The exact time of day when the service took place',
          'A birthday candle for their next birthday party',
          'Protection against drafts inside the church building'
        ],
        answerKey: 0,
        hint: 'Jesus said: "I am the light of the world. Whoever follows me will not walk in darkness."',
        explanation: 'The baptismal candle represents the Light of Christ which parents and godparents must help keep burning brightly in the child\'s heart.'
      },
      {
        id: 'ks2-re-bap-5',
        prompt: 'What is the sacred perfumed olive oil called that the priest uses to anoint the newly baptized person as priest, prophet, and king?',
        options: [
          'Sacred Chrism',
          'Cooking olive oil',
          'Lavender water',
          'Candle wax'
        ],
        answerKey: 0,
        hint: 'Consecrated by the Bishop at the Chrism Mass during Holy Week.',
        explanation: 'Sacred Chrism is consecrated oil used in Baptism, Confirmation, and Holy Orders to signify the gift of the Holy Spirit.'
      },
      {
        id: 'ks2-re-bap-6',
        prompt: 'What special role do Godparents (sponsors) undertake at a Catholic child\'s Baptism?',
        options: [
          'To help the parents raise the child in Catholic faith and support them with good Christian example and prayer',
          'To buy all the child\'s school books until university',
          'To serve as the priest\'s altar servers during the ceremony',
          'To choose the child\'s future school'
        ],
        answerKey: 0,
        hint: 'They promise to help the child practice and grow in their Catholic faith.',
        explanation: 'Godparents promise before God and the Church to assist the parents in teaching the child to love God and live according to the Gospel.'
      }
    ]
  },

  'ks2:religious-education-catholic:first-reconciliation': {
    topicId: 'first-reconciliation',
    title: 'First Reconciliation: God’s Healing Mercy & Forgiveness',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'In the Sacrament of Reconciliation (Penance or Confession), those who confess their sins with true sorrow and a firm purpose of amendment obtain forgiveness from God\'s infinite mercy through the priest\'s absolution, reconciling them with God and the Church (CCC 1422).',
    cognitiveTrap: 'Fearing that Confession is about being judged or scolded, rather than encountering Jesus the Good Shepherd who welcomes and heals us with gentleness and mercy.',
    socraticPivot: 'Why did Jesus breathe on the Apostles and tell them: "Whose sins you forgive are forgiven them" (John 20:23)?',
    hook: 'If you accidentally broke your friend\'s favourite toy, you would say sorry so your friendship could be healed. How does Jesus heal our friendship with God when we make mistakes and sin?',
    guidedStep: 'Follow the 4 steps of a good Confession: 1. Examination of Conscience (reflecting in prayer on our choices), 2. Contrition (true sorrow for hurting God and others), 3. Confession & Penance (honestly telling our sins to the priest and accepting a prayer of reparation), 4. Absolution (hearing God\'s words of forgiveness).',
    scaffoldHints: {
      level1: 'Imagine carrying a heavy backpack full of sharp rocks. Confessing your sins is like setting that heavy pack down and walking away with a clean, peaceful heart.',
      level2: 'Jesus told the parable of the Prodigal Son to show that God our Heavenly Father never stops waiting for us to come home with open arms of mercy.',
      level3: 'During Confession, you pray the Act of Contrition (Sorrow), and the priest raises his hand saying: "I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit."'
    },
    questions: [
      {
        id: 'ks2-re-rec-1',
        prompt: 'What happens when we make a sincere Confession to a Catholic priest in the Sacrament of Reconciliation?',
        options: [
          'God forgives our sins and restores our friendship with Him through the priest\'s absolution',
          'The priest tells our family and school teachers what we said',
          'We receive a punishment and are not allowed back into church',
          'Our mistakes are written down on a parish public board'
        ],
        answerKey: 0,
        hint: 'Jesus heals our soul and the priest is bound by the absolute Seal of Confession.',
        explanation: 'Through the priest acting in persona Christi (in the person of Christ), God freely forgives all our confessed sins and fills our soul with peace and grace.'
      },
      {
        id: 'ks2-re-rec-2',
        prompt: 'What is the traditional prayer called where we tell God we are genuinely sorry for our sins and promise to do better?',
        options: [
          'The Act of Contrition (or Act of Sorrow)',
          'The Nicene Creed',
          'The Gloria in Excelsis',
          'The Angelus'
        ],
        answerKey: 0,
        hint: 'Contrition means heartfelt sorrow for having offended God who is so good.',
        explanation: 'The Act of Contrition is the prayer prayed during Confession expressing sincere sorrow for our sins and resolving to avoid the near occasions of sin.'
      },
      {
        id: 'ks2-re-rec-3',
        prompt: 'What are the sacred words called when the priest grants God\'s forgiveness in the Sacrament of Penance?',
        options: [
          'The Words of Absolution',
          'The Final Blessing',
          'The Offertory Prayer',
          'The Preface Dialogue'
        ],
        answerKey: 0,
        hint: 'To "absolve" means to set free and unbind from sin.',
        explanation: 'The priest speaks the words of Absolution: "...and I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit. Amen."'
      },
      {
        id: 'ks2-re-rec-4',
        prompt: 'What is the essential first step before going to Confession, where we quietly reflect on our choices and actions in light of God\'s commandments?',
        options: [
          'An Examination of Conscience',
          'Singing the closing hymn',
          'Reading the parish financial newsletter',
          'Choosing a baptismal name'
        ],
        answerKey: 0,
        hint: 'Examining what our conscience tells us about right and wrong.',
        explanation: 'An Examination of Conscience is a quiet prayerful reflection where we ask the Holy Spirit to reveal our sins so we can confess them honestly.'
      },
      {
        id: 'ks2-re-rec-5',
        prompt: 'What is the strict Catholic law called that forbids a priest under the pain of excommunication from ever revealing sins confessed to him?',
        options: [
          'The Seal of Confession',
          'The Liturgical Calendar',
          'The Canon of Scripture',
          'The Diocesan Charter'
        ],
        answerKey: 0,
        hint: 'The seal is sacred and inviolable: a priest can never break it under any circumstance.',
        explanation: 'The Seal of Confession guarantees total confidentiality; a priest may never betray a penitent in any manner or for any reason whatsoever.'
      },
      {
        id: 'ks2-re-rec-6',
        prompt: 'What is the prayer or act of kindness called that the priest invites you to perform after Confession to help heal the harm caused by sin?',
        options: [
          'A Penance',
          'A Collection',
          'An Ordination',
          'A Canonization'
        ],
        answerKey: 0,
        hint: 'It is a small prayer (like an Our Father or Hail Mary) or good deed of reparation.',
        explanation: 'A penance helps repair the spiritual harm done by sin and trains our soul to turn back toward God with renewed love.'
      }
    ]
  },

  'ks2:religious-education-catholic:liturgy-of-the-word': {
    topicId: 'liturgy-of-the-word',
    title: 'The Liturgy of the Word: God Speaks in Scripture',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'In the Liturgy of the Word, the first major part of the Holy Mass, God speaks directly to His gathered people through Sacred Scripture, and Christ proclaims His Good News in the Holy Gospel (CCC 1154).',
    cognitiveTrap: 'Thinking the readings at Mass are merely old historical stories, rather than God’s living, inspired Word speaking to our hearts right now in the present.',
    socraticPivot: 'Why do we stand up on our feet and sing "Alleluia" specifically before the priest or deacon reads the Gospel?',
    hook: 'Have you ever received a letter from someone who loves you very much? The Bible is God\'s personal love letter to each of us!',
    guidedStep: 'Trace the order of the Liturgy of the Word: First Reading (often Old Testament prophecies or stories), Responsorial Psalm (singing God\'s praises), Second Reading (New Testament letter from St Paul or Apostles), Gospel Acclamation (Alleluia), The Holy Gospel, Homily, Nicene/Apostles Creed, and Bidding Prayers (Universal Prayer).',
    scaffoldHints: {
      level1: 'When a respected king enters the hall, everyone stands up out of honour. We stand during the Gospel because Jesus Himself is speaking to us through His words and deeds.',
      level2: 'Before the Gospel is read, we trace a small cross with our thumb on our forehead, lips, and heart, praying: "Lord, be in my mind, on my lips, and in my heart."',
      level3: 'At the conclusion of the first and second readings, the reader says: "The Word of the Lord", and the congregation responds with gratitude: "Thanks be to God".'
    },
    questions: [
      {
        id: 'ks2-re-word-1',
        prompt: 'Why does the whole congregation stand up when the Holy Gospel is about to be proclaimed at Mass?',
        options: [
          'To show deep reverence and honour because Jesus Christ Himself is speaking to us',
          'Because the wooden benches are being cleaned',
          'Because the choir wants to see the back of the church',
          'To signal that the Mass is almost finished'
        ],
        answerKey: 0,
        hint: 'Standing is an ancient sign of active attention and reverence for Christ.',
        explanation: 'We stand for the Holy Gospel because it contains the direct words and actions of Jesus Christ, our Lord and Saviour.'
      },
      {
        id: 'ks2-re-word-2',
        prompt: 'What prayerful gesture do we make on our forehead, lips, and chest just before the Gospel is read?',
        options: [
          'We trace three small signs of the cross, asking God\'s word to be in our minds, on our lips, and in our hearts',
          'We bow deeply three times towards the organist',
          'We clap our hands to welcome the deacon',
          'We place both hands over our eyes in silence'
        ],
        answerKey: 0,
        hint: 'Mind, lips, and heart: to understand, speak, and love God\'s Word.',
        explanation: 'Tracing the cross on our forehead, lips, and heart is a prayer asking that the Gospel may guide our thoughts, words, and loving actions.'
      },
      {
        id: 'ks2-re-word-3',
        prompt: 'Which part of the Liturgy of the Word is when the priest or deacon explains the readings and shows how to live them out today?',
        options: [
          'The Homily',
          'The Responsorial Psalm',
          'The Collect Prayer',
          'The Sign of Peace'
        ],
        answerKey: 0,
        hint: 'The priest preaches this from the ambo/pulpit after the Gospel.',
        explanation: 'In the Homily, the priest breaks open God\'s Word and helps us understand how to apply Jesus\' teachings in our school, home, and daily life.'
      },
      {
        id: 'ks2-re-word-4',
        prompt: 'Which biblical book of prayers and poetic songs (many written by King David) is sung or spoken by the congregation between the first and second readings?',
        options: [
          'The Responsorial Psalm',
          'The Book of Revelation',
          'The Song of Solomon',
          'The Book of Numbers'
        ],
        answerKey: 0,
        hint: 'The Psalmist or cantor sings a verse and the whole congregation sings the response.',
        explanation: 'The Responsorial Psalm provides a prayerful response meditating on the theme of the First Reading.'
      },
      {
        id: 'ks2-re-word-5',
        prompt: 'What joyful Hebrew word meaning "Praise the Lord" is sung by the congregation as the Gospel Acclamation (except during Lent)?',
        options: [
          'Alleluia',
          'Hosanna',
          'Maranatha',
          'Kyrie'
        ],
        answerKey: 0,
        hint: 'A word of exuberant praise to welcome the proclamation of Christ\'s Gospel.',
        explanation: 'Alleluia (Hallelujah) is the Gospel Acclamation greeting Christ who speaks to us in the Gospel.'
      },
      {
        id: 'ks2-re-word-6',
        prompt: 'What are the final intercessory prayers of the Liturgy of the Word called, where we pray for the Church, world leaders, the sick, and our local community?',
        options: [
          'The Universal Prayer (or Bidding Prayers)',
          'The Eucharistic Canon',
          'The Agnus Dei',
          'The Angelus'
        ],
        answerKey: 0,
        hint: 'The congregation answers each petition: "Lord, in your mercy, hear our prayer."',
        explanation: 'The Universal Prayer (Bidding Prayers) expresses the priestly duty of the baptized to intercede for the needs of all humanity.'
      }
    ]
  },

  'ks2:religious-education-catholic:the-last-supper': {
    topicId: 'the-last-supper',
    title: 'The Last Supper: "Do This in Memory of Me"',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'At the Last Supper on Holy Thursday, Jesus instituted the Eucharistic Sacrifice of His Body and Blood. Taking bread and wine, He blessed them, broke them, gave them to His Apostles, and commanded: "Do this in memory of me" (Luke 22:19, CCC 1323).',
    cognitiveTrap: 'Confusing the Last Supper with an ordinary farewell dinner, or thinking "in memory of me" means just remembering a past memory rather than making Christ\'s living sacrifice present on the altar.',
    socraticPivot: 'What did Jesus mean when He took the bread and solemnly said: "Take, eat; this is my body"?',
    hook: 'On the night before He laid down His life on the Cross, Jesus sat down for a Passover meal with His twelve Apostles. What everlasting gift did He leave for the whole world that evening?',
    guidedStep: 'Examine Holy Thursday: Jesus first washed the feet of His Apostles to teach humble servant love. Then, He took bread, gave thanks, broke it, and gave it to His disciples, saying: "This is my body, which is given for you." Then He took the chalice of wine, saying: "This chalice is the new covenant in my blood."',
    scaffoldHints: {
      level1: 'Jesus did not say "this is like my body" or "this represents my body." He declared: "This IS my body."',
      level2: 'When Jesus commanded "Do this in memory of me", He gave the Apostles and their successors (bishops and priests) the sacred authority to celebrate the Holy Mass.',
      level3: 'At every Mass, we are spiritually united with Jesus at the Last Supper and at the foot of the Cross on Calvary. His one saving sacrifice is made present for us today.'
    },
    questions: [
      {
        id: 'ks2-re-ls-1',
        prompt: 'On which night of Holy Week did Jesus celebrate the Last Supper and institute the Holy Eucharist?',
        options: [
          'Holy Thursday (Maundy Thursday)',
          'Easter Sunday morning',
          'Palm Sunday afternoon',
          'Ash Wednesday'
        ],
        answerKey: 0,
        hint: 'It is the night before Good Friday, when Jesus washed His disciples\' feet.',
        explanation: 'On Holy Thursday evening, at the Last Supper, Jesus gave us the Sacrament of the Holy Eucharist and the Catholic Priesthood.'
      },
      {
        id: 'ks2-re-ls-2',
        prompt: 'What command did Jesus give to His Apostles after giving them His Body and Blood under the signs of bread and wine?',
        options: [
          '"Do this in memory of me"',
          '"Keep this a secret forever"',
          '"Build a golden palace in Jerusalem"',
          '"Never eat unleavened bread again"'
        ],
        answerKey: 0,
        hint: 'This command is repeated at every Holy Mass by the priest.',
        explanation: 'Jesus commanded "Do this in memory of me" (Luke 22:19), charging the Church to perpetually celebrate the Holy Sacrifice of the Mass until He comes again.'
      },
      {
        id: 'ks2-re-ls-3',
        prompt: 'What humble act of service did Jesus perform before the Last Supper to show how His followers must love one another?',
        options: [
          'He washed the feet of His twelve Apostles',
          'He gave them bags of gold coins',
          'He built a wooden boat for them',
          'He carved stone tablets with their names'
        ],
        answerKey: 0,
        hint: 'A servant\'s chore in ancient times that Jesus performed to teach humility.',
        explanation: 'By washing the feet of the Apostles (John 13:1-15), Jesus showed that true greatness in the Kingdom of God comes through humble service to others.'
      },
      {
        id: 'ks2-re-ls-4',
        prompt: 'Which ancient Jewish feast commemorating liberation from slavery in Egypt were Jesus and His disciples celebrating at the Last Supper?',
        options: [
          'The Passover (Pesach)',
          'Hanukkah',
          'The Feast of Purim',
          'Yom Kippur'
        ],
        answerKey: 0,
        hint: 'The feast where unleavened bread and the Passover lamb were eaten.',
        explanation: 'Jesus chose the Passover meal to transform the ancient covenant into the New and Eternal Covenant in His Blood.'
      },
      {
        id: 'ks2-re-ls-5',
        prompt: 'Which Apostle left the table during the Last Supper and betrayed Jesus to the chief priests for thirty pieces of silver?',
        options: [
          'Judas Iscariot',
          'Simon Peter',
          'John the Evangelist',
          'Thomas the Apostle'
        ],
        answerKey: 0,
        hint: 'He dipped bread into the dish with Jesus before departing into the dark night.',
        explanation: 'Judas Iscariot betrayed Jesus in the Garden of Gethsemane shortly after the Last Supper.'
      },
      {
        id: 'ks2-re-ls-6',
        prompt: 'What did Jesus say when He passed the chalice of wine to the Apostles at the Last Supper?',
        options: [
          '"Drink of it, all of you, for this is my blood of the covenant, poured out for many for the forgiveness of sins"',
          '"Drink this to celebrate the harvest of grapes"',
          '"Keep this wine locked away until the end of time"',
          '"This is an ordinary drink to quench your thirst"'
        ],
        answerKey: 0,
        hint: 'Jesus revealed that His Blood would be poured out on Calvary for the forgiveness of sins.',
        explanation: 'Jesus consecrated the wine into His Precious Blood, establishing the New Covenant (Matthew 26:27-28).'
      }
    ]
  },

  'ks2:religious-education-catholic:first-holy-communion': {
    topicId: 'first-holy-communion',
    title: 'The Sacrament of the Eucharist: The Real Presence',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'Through the consecration at Mass, the whole substance of the bread is changed into the Body of Christ, and the whole substance of the wine into His Blood. The Catholic Church names this miracle Transubstantiation. Jesus Christ is truly, really, and substantially present: Body, Blood, Soul, and Divinity (CCC 1374, 1376).',
    cognitiveTrap: 'Believing the consecrated Host is merely a symbol, a metaphor, or just a wafer of bread representing Jesus, rather than Jesus Himself truly present.',
    socraticPivot: 'Although the consecrated Host still looks, smells, and tastes like bread to our eyes, what has it truly become in its deepest reality through the Holy Spirit?',
    hook: 'Imagine preparing your heart to welcome the most holy, loving Guest in the entire universe. In First Holy Communion, who is it that comes to live inside you?',
    guidedStep: 'Understand the Eucharistic mystery: During the Eucharistic Prayer, the priest calls upon the Holy Spirit (epiclesis) and repeats the words of Jesus (consecration). While outward appearances (accidents: color, taste, size) remain unchanged, the inward reality (substance) is transformed into Jesus Christ.',
    scaffoldHints: {
      level1: 'Our human eyes only see bread and wine, but through the eyes of Catholic faith, we know that Jesus keeps His promise: He gives us His true Flesh and Blood for eternal life.',
      level2: 'The Church uses the word "Transubstantiation" (trans = change, substantia = substance): the bread and wine become the Body, Blood, Soul, and Divinity of Christ.',
      level3: 'Because Jesus is really present, the consecrated Hosts are reverently kept in the Tabernacle. We genuflect on our right knee towards the Tabernacle when entering church.'
    },
    questions: [
      {
        id: 'ks2-re-fhc-1',
        prompt: 'What does the Catholic Church teach about what the bread and wine truly become during the consecration at Mass?',
        options: [
          'They truly become the Body, Blood, Soul, and Divinity of Jesus Christ',
          'They remain ordinary bread and wine but blessed with perfume',
          'They are just holy snacks to keep us awake during the service',
          'They turn into physical gold and silver treasures'
        ],
        answerKey: 0,
        hint: 'The Catholic Church teaches the doctrine of the Real Presence of Jesus.',
        explanation: 'Through the power of the Holy Spirit and the words of Christ, the consecrated Host is not a mere symbol; it is the Real Presence of Jesus Christ.'
      },
      {
        id: 'ks2-re-fhc-2',
        prompt: 'What is the sacred theological term for the miraculous change of the substance of bread and wine into Christ\'s Body and Blood?',
        options: [
          'Transubstantiation',
          'Reincarnation',
          'Photosynthesis',
          'Electrolysis'
        ],
        answerKey: 0,
        hint: 'Trans- (change) + substance: the underlying reality changes completely.',
        explanation: 'Transubstantiation is the dogma defined by the Catholic Church: the substance changes into Christ while the physical appearances (species) remain.'
      },
      {
        id: 'ks2-re-fhc-3',
        prompt: 'Why is there always a red sanctuary lamp burning next to the Tabernacle inside a Catholic church?',
        options: [
          'To show that Jesus in the Blessed Sacrament is present inside the Tabernacle',
          'To help the priest see the keys in the dark',
          'Because red is the national colour of the city council',
          'To warn people that the candles are hot'
        ],
        answerKey: 0,
        hint: 'The red flame shows that the King of Kings is in the house!',
        explanation: 'The sanctuary lamp burns day and night to indicate and honour the Real Presence of Christ reserved in the Holy Tabernacle.'
      },
      {
        id: 'ks2-re-fhc-4',
        prompt: 'What is the ornate golden stand called with glass rays used to display the Blessed Sacrament for Eucharistic Adoration and Benediction?',
        options: [
          'A Monstrance',
          'A Chalice',
          'A Cruet',
          'A Lectern'
        ],
        answerKey: 0,
        hint: 'From the Latin "monstrare" meaning "to show" or reveal Christ to the faithful.',
        explanation: 'A Monstrance is a sacred vessel designed to display the consecrated Host for adoration by the congregation.'
      },
      {
        id: 'ks2-re-fhc-5',
        prompt: 'Why do Catholics genuflect on their right knee when entering or leaving a Catholic church or passing the Tabernacle?',
        options: [
          'To humbly worship and adore Jesus Christ truly present in the Blessed Sacrament in the Tabernacle',
          'To stretch leg muscles before sitting down',
          'To show respect to the choir members',
          'Because the church floor requires inspection'
        ],
        answerKey: 0,
        hint: 'Genuflection is a bodily act of deep adoration reserved for God alone.',
        explanation: 'Touching the right knee to the ground towards the Tabernacle is an ancient sign of homage and adoration to Jesus Christ, the King of Kings.'
      },
      {
        id: 'ks2-re-fhc-6',
        prompt: 'What did Jesus say in John 6:35 when teaching about the Holy Eucharist?',
        options: [
          '"I am the Bread of Life; whoever comes to me shall not hunger, and whoever believes in me shall never thirst"',
          '"Bread is only necessary for physical health"',
          '"Do not share food with travellers"',
          '"The bread will only satisfy you for one day"'
        ],
        answerKey: 0,
        hint: 'Jesus declares that He is the Bread of Life who offers eternal salvation.',
        explanation: 'In the Bread of Life discourse (John 6), Jesus reveals that His Flesh is true food and His Blood is true drink for eternal life.'
      }
    ]
  },

  'ks2:religious-education-catholic:order-of-the-mass': {
    topicId: 'order-of-the-mass',
    title: 'The Order of the Mass & Reverent Reception',
    keyStage: 'Key Stage 2',
    subject: 'Religious Education (Catholic)',
    coreAxiom: 'To receive Holy Communion worthily, a Catholic must be in the state of grace (free from grave sin), observe the Eucharistic fast of at least one hour from food and drink, and receive the Blessed Sacrament with deep faith and devotion, responding "Amen" ("I believe!") (CCC 1385, 1387).',
    cognitiveTrap: 'Receiving Holy Communion casually or carelessly without preparation, or saying "Thank you" instead of the solemn profession of faith: "Amen".',
    socraticPivot: 'When the priest or minister holds up the Sacred Host and says "The Body of Christ", why is our response "Amen" so important?',
    hook: 'If you were invited to a royal banquet with the King, how would you prepare your manners, clothes, and heart? The Holy Mass is the heavenly banquet of Christ our King!',
    guidedStep: 'Practice receiving Holy Communion reverently: Fast for 1 hour before receiving. Approach the altar with hands joined in prayer. Bow your head in reverence. When the priest says "The Body of Christ", clearly answer "Amen". You may receive on the tongue or in the hand (placing the left hand flat on top of the right hand to create a "throne"). Consume the Host immediately, make the Sign of the Cross, and return to kneel in thanksgiving.',
    scaffoldHints: {
      level1: '"Amen" is a Hebrew word that means: "Yes, it is true! I believe with all my heart!"',
      level2: 'Before receiving, we pray the words of the Roman Centurion: "Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed."',
      level3: 'After receiving Holy Communion, return quietly to your pew, kneel down, close your eyes, and talk with Jesus in silent prayer, thanking Him for coming into your heart.'
    },
    questions: [
      {
        id: 'ks2-re-ord-1',
        prompt: 'What is the correct and reverent response when the priest holds up the Host and says "The Body of Christ"?',
        options: [
          '"Amen" (meaning "I believe!")',
          '"Thank you very much"',
          '"Peace be with you"',
          '"Good morning Father"'
        ],
        answerKey: 0,
        hint: '"Amen" is your solemn declaration that you believe this is truly Jesus.',
        explanation: 'By answering "Amen", we express our personal faith that we are receiving Jesus Christ Himself, our Lord and God.'
      },
      {
        id: 'ks2-re-ord-2',
        prompt: 'How long must Catholics observe the Eucharistic fast from food and drink (except water and medicine) before receiving Holy Communion?',
        options: [
          'At least one hour before receiving',
          'Twenty-four full hours',
          'Five minutes while walking to church',
          'Only during the homily'
        ],
        answerKey: 0,
        hint: 'One hour of fasting helps our body and mind prepare for the heavenly food.',
        explanation: 'Canon law and the Catechism (CCC 1387) prescribe a fast of at least one hour from food and drink (except water and medicine) to honour the Blessed Sacrament.'
      },
      {
        id: 'ks2-re-ord-3',
        prompt: 'If receiving Holy Communion in your hands, how should your hands be held according to ancient Catholic tradition?',
        options: [
          'Open flat, with your dominant hand supporting underneath the other to make a "throne" for the King',
          'Cupped like a drinking bowl with fingers spread wide',
          'Grabbed with two fingers like a snack crisp',
          'Holding a prayer book at the same time'
        ],
        answerKey: 0,
        hint: 'St Cyril of Jerusalem taught: "Make your left hand a throne for your right, as about to receive a King."',
        explanation: 'We place one hand flat over the other to form a reverent throne for the Host, taking care that no sacred particle falls, and consume it immediately.'
      },
      {
        id: 'ks2-re-ord-4',
        prompt: 'What should you do immediately after returning to your seat after receiving Holy Communion?',
        options: [
          'Kneel down in quiet, loving prayer to thank Jesus for coming into your heart',
          'Check your watch and leave the church immediately',
          'Chat with your neighbours about after-Mass plans',
          'Wave to your friends in the choir'
        ],
        answerKey: 0,
        hint: 'This is the most sacred time of intimate prayer and thanksgiving with Jesus.',
        explanation: 'The time right after Holy Communion is precious. We kneel in silence to thank Jesus, offer Him our prayers, and ask Him to help us live like Him.'
      },
      {
        id: 'ks2-re-ord-5',
        prompt: 'What is the liturgical response spoken by the congregation before receiving Communion when the priest proclaims: "Behold the Lamb of God, behold him who takes away the sins of the world"?',
        options: [
          '"Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed"',
          '"Thanks be to God, for the Lord has delivered us"',
          '"Holy, Holy, Holy Lord God of hosts"',
          '"Glory to God in the highest and on earth peace to people of good will"'
        ],
        answerKey: 0,
        hint: 'This response echoes the humble faith of the Roman Centurion in the Gospel of Matthew (8:8).',
        explanation: 'Before receiving Holy Communion, Catholics recite the Centurion\'s prayer of deep humility and trust: "Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed."'
      },
      {
        id: 'ks2-re-ord-6',
        prompt: 'What must a Catholic do before receiving Holy Communion if they are conscious of having committed a grave (mortal) sin?',
        options: [
          'Receive the Sacrament of Reconciliation (Confession) to be restored to the state of grace',
          'Just fast for an extra thirty minutes before Mass begins',
          'Whisper a private promise to a friend sitting nearby',
          'Write an apology letter to the parish bishop'
        ],
        answerKey: 0,
        hint: 'The Sacrament of Reconciliation forgives sins and restores us to the state of sanctifying grace.',
        explanation: 'To receive the Eucharist worthily, anyone aware of having committed a mortal sin must first receive absolution in the Sacrament of Penance and Reconciliation (CCC 1457).'
      }
    ]
  }
};
