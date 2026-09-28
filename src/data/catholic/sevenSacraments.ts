// src/data/catholic/sevenSacraments.ts
// St Joseph's Catholic Life & Faith Sanctuary
// The Seven Sacraments: Initiation, Healing & Service

export interface SacramentData {
  id: string;
  name: string;
  latinName: string;
  icon: string;
  category: 'Initiation' | 'Healing' | 'Service';
  summary: string;
  biblicalAnchor: string;
  matterAndForm: {
    matter: string;
    form: string;
  };
  minister: string;
  effect: string;
  connectionToFirstCommunion: string;
  catechismRef: string;
}

export interface SacramentQuizQuestion {
  question: string;
  correct: string;
  options: string[];
  hint: string;
}

export const SEVEN_SACRAMENTS: SacramentData[] = [
  {
    id: 'baptism',
    name: 'The Sacrament of Baptism',
    latinName: 'Baptisma',
    icon: '💧',
    category: 'Initiation',
    summary: 'The gateway to life in the Spirit and the door which gives access to the other sacraments. It washes away Original Sin and all personal sins.',
    biblicalAnchor: 'Jesus said: "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit." (Matthew 28:19)',
    matterAndForm: {
      matter: 'Pouring of pure water on the head (or immersion in water)',
      form: '"I baptize you in the name of the Father, and of the Son, and of the Holy Spirit."'
    },
    minister: 'Bishop, Priest, or Deacon (in danger of death, anyone with the right intention)',
    effect: 'Washes away Original Sin, makes us adopted sons and daughters of God, and imprints an indelible spiritual character on the soul.',
    connectionToFirstCommunion: 'Baptism made you a member of God’s family! You must be baptized before you can receive Jesus in Holy Communion. The priest wears a white Alb at Mass to remind us of the white garment given to you at Baptism.',
    catechismRef: 'CCC 1213-1284'
  },
  {
    id: 'confirmation',
    name: 'The Sacrament of Confirmation',
    latinName: 'Confirmatio',
    icon: '🔥',
    category: 'Initiation',
    summary: 'Completes baptismal grace by sealing the Christian with the special gift of the Holy Spirit, empowering them to be witnesses of Christ.',
    biblicalAnchor: 'On Pentecost, tongues of fire rested on the Apostles and they were filled with the Holy Spirit. (Acts 2:1-4)',
    matterAndForm: {
      matter: 'Anointing on the forehead with Sacred Chrism oil and laying on of hands',
      form: '"Be sealed with the Gift of the Holy Spirit."'
    },
    minister: 'The Bishop (or a priest delegated by the Bishop)',
    effect: 'Full outpouring of the Holy Spirit, strengthens the Seven Gifts of the Holy Spirit (Wisdom, Understanding, Counsel, Fortitude, Knowledge, Piety, and Fear of the Lord).',
    connectionToFirstCommunion: 'Confirmation and the Eucharist belong together with Baptism as the three Sacraments of Christian Initiation. The Holy Spirit who descends at Confirmation is the same Spirit the priest calls down upon the altar to change bread into Christ’s Body!',
    catechismRef: 'CCC 1285-1321'
  },
  {
    id: 'eucharist',
    name: 'The Holy Eucharist (First Holy Communion)',
    latinName: 'Eucharistia',
    icon: '🍞',
    category: 'Initiation',
    summary: 'The Source and Summit of the whole Christian life. Under the signs of bread and wine, Jesus Christ is truly, really, and substantially present—Body, Blood, Soul, and Divinity.',
    biblicalAnchor: 'At the Last Supper: "Jesus took bread, and blessed, and broke it, and gave it to the disciples, and said, ‘Take, eat; this is my body.’" (Matthew 26:26)',
    matterAndForm: {
      matter: 'Unleavened wheat bread and pure grape wine mixed with a few drops of water',
      form: '"This is my Body... This is the Chalice of my Blood..." (Words of Consecration spoken by the priest in persona Christi)'
    },
    minister: 'A validly ordained Priest or Bishop',
    effect: 'Transubstantiation; intimate union with Jesus Christ; preserves, increases, and renews the life of grace; cleanses venial sins; unites us with the whole Church.',
    connectionToFirstCommunion: 'This is the very sacrament you are preparing to receive! When the priest holds up the Host, Jesus comes to live inside your heart in the most holy and wonderful way.',
    catechismRef: 'CCC 1322-1419'
  },
  {
    id: 'reconciliation',
    name: 'The Sacrament of Penance & Reconciliation (Confession)',
    latinName: 'Paenitentia',
    icon: '🕊️',
    category: 'Healing',
    summary: 'Christ grants the forgiveness of sins committed after Baptism through the ministry of the priest, reconciling the sinner with God and the Church.',
    biblicalAnchor: 'Jesus breathed on the Apostles: "Receive the Holy Spirit. If you forgive the sins of any, they are forgiven." (John 20:22-23)',
    matterAndForm: {
      matter: 'The penitent’s Contrition (sorrow for sin), Confession of sins, and fulfillment of Penance',
      form: '"I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit."'
    },
    minister: 'A validly ordained Priest or Bishop',
    effect: 'Restores sanctifying grace, heals the spiritual wounds caused by sin, and grants peace of conscience and spiritual strength.',
    connectionToFirstCommunion: 'Every child makes their First Confession before their First Holy Communion. We must always approach Jesus in the Eucharist with a clean, joyful heart in a state of grace.',
    catechismRef: 'CCC 1422-1498'
  },
  {
    id: 'anointing',
    name: 'The Anointing of the Sick',
    latinName: 'Unctio Infirmorum',
    icon: '🌿',
    category: 'Healing',
    summary: 'Bestows a special grace on Christians who are experiencing the difficulties inherent in a condition of grave illness or old age.',
    biblicalAnchor: '"Is anyone among you sick? Let him call for the elders of the church, and let them pray over him, anointing him with oil in the name of the Lord." (James 5:14)',
    matterAndForm: {
      matter: 'Anointing with the Holy Oil of the Sick (Oleum Infirmorum) on forehead and hands',
      form: '"Through this holy anointing may the Lord in his love and mercy help you with the grace of the Holy Spirit. May the Lord who frees you from sin save you and raise you up."'
    },
    minister: 'A validly ordained Priest or Bishop',
    effect: 'Unites the sick person to the passion of Christ for their own good and that of the whole Church; gives peace, courage, and sometimes physical recovery if God wills it.',
    connectionToFirstCommunion: 'When a sick person receives the Holy Eucharist as their food for the journey, it is called "Viaticum". The sacraments bring Christ’s healing touch to us throughout our whole lives.',
    catechismRef: 'CCC 1499-1532'
  },
  {
    id: 'holy-orders',
    name: 'The Sacrament of Holy Orders',
    latinName: 'Ordo',
    icon: '✋',
    category: 'Service',
    summary: 'The sacrament through which the mission entrusted by Christ to his apostles continues to be exercised in the Church in three degrees: Bishops, Priests, and Deacons.',
    biblicalAnchor: 'Jesus said to His Apostles: "Do this in remembrance of me." (Luke 22:19) and St Paul reminded Timothy: "Rekindle the gift of God that is within you through the laying on of my hands." (2 Timothy 1:6)',
    matterAndForm: {
      matter: 'The laying on of hands by the Bishop in silence upon the head of the ordinand',
      form: 'The solemn consecratory prayer asking God for the outpouring of the Holy Spirit and his gifts proper to the ministry'
    },
    minister: 'A validly consecrated Bishop',
    effect: 'Imprints an indelible sacramental character; configures the priest to Christ the Head and Shepherd so that he can act in the person of Christ (in persona Christi Capitis).',
    connectionToFirstCommunion: 'Without the Sacrament of Holy Orders, we could not have Holy Communion! Only a validly ordained priest has the power from Jesus to consecrate the bread and wine on the altar.',
    catechismRef: 'CCC 1536-1600'
  },
  {
    id: 'matrimony',
    name: 'The Sacrament of Holy Matrimony',
    latinName: 'Matrimonium',
    icon: '💍',
    category: 'Service',
    summary: 'A sacred covenant by which a baptized man and a baptized woman establish between themselves a lifelong partnership for their mutual good and the procreation and education of children.',
    biblicalAnchor: '"What therefore God has joined together, let not man put asunder." (Mark 10:9) and St Paul compares marriage to Christ and the Church (Ephesians 5:31-32).',
    matterAndForm: {
      matter: 'The mutual consent given by the bride and groom',
      form: 'The exchange of marriage vows: "I take you to be my wife/husband, to have and to hold from this day forward..."'
    },
    minister: 'The spouses themselves confer the sacrament upon each other before a Priest or Deacon and two witnesses',
    effect: 'Creates an indissoluble bond sealed by God, granting the couple the grace to love each other with Christ’s sacrificial love and raise holy children in the faith.',
    connectionToFirstCommunion: 'Catholic parents, united in Holy Matrimony, are the first teachers of the faith who bring their children to church to prepare for their First Holy Communion! A Catholic home is called the "Domestic Church".',
    catechismRef: 'CCC 1601-1666'
  }
];

export const SACRAMENTS_QUIZ_QUESTIONS: SacramentQuizQuestion[] = [
  {
    question: 'Which sacrament washes away Original Sin and makes us adopted children of God?',
    correct: 'The Sacrament of Baptism',
    options: ['The Sacrament of Baptism', 'The Sacrament of Confirmation', 'The Sacrament of Holy Orders'],
    hint: 'It uses water and was received when you were a baby or entered the Church.'
  },
  {
    question: 'Which sacrament is the "Source and Summit" of the Christian life where Jesus is truly present Body, Blood, Soul, and Divinity?',
    correct: 'The Holy Eucharist',
    options: ['The Holy Eucharist', 'The Sacrament of Matrimony', 'The Anointing of the Sick'],
    hint: 'Jesus instituted this at the Last Supper and you receive Him in your First Holy Communion.'
  },
  {
    question: 'Which sacrament must we receive before First Holy Communion to cleanse our soul and receive God’s forgiveness?',
    correct: 'The Sacrament of Penance & Reconciliation (Confession)',
    options: ['The Sacrament of Holy Orders', 'The Sacrament of Penance & Reconciliation (Confession)', 'The Sacrament of Confirmation'],
    hint: 'You tell your sins to the priest and he gives you absolution in Jesus’ name.'
  },
  {
    question: 'Which sacrament gives a special outpouring of the Holy Spirit, sealing us with the Seven Gifts?',
    correct: 'The Sacrament of Confirmation',
    options: ['The Sacrament of Confirmation', 'The Anointing of the Sick', 'The Sacrament of Baptism'],
    hint: 'It completes baptismal grace, usually received with the Bishop using Sacred Chrism oil.'
  },
  {
    question: 'Which sacrament gives the priest the power from Jesus to consecrate the bread and wine at the altar?',
    correct: 'The Sacrament of Holy Orders',
    options: ['The Sacrament of Matrimony', 'The Sacrament of Holy Orders', 'The Sacrament of Reconciliation'],
    hint: 'A Bishop lays his hands upon a man to ordain him as a priest.'
  },
  {
    question: 'Which sacrament brings Christ’s healing touch, comfort, and peace to those suffering from grave illness or frailty?',
    correct: 'The Anointing of the Sick',
    options: ['The Anointing of the Sick', 'The Sacrament of Baptism', 'The Sacrament of Holy Orders'],
    hint: 'The priest anoints the forehead and hands of the sick with holy oil (Oleum Infirmorum).'
  },
  {
    question: 'Which sacrament unites a baptized man and woman in a lifelong holy covenant to form a Catholic family (Domestic Church)?',
    correct: 'The Sacrament of Holy Matrimony',
    options: ['The Sacrament of Holy Orders', 'The Sacrament of Confirmation', 'The Sacrament of Holy Matrimony'],
    hint: 'The bride and groom exchange solemn vows before God, the priest, and the Church.'
  }
];
