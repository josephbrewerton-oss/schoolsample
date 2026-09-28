// src/data/catholic/sacredObjects.ts
// St Joseph's Catholic Life & Faith Sanctuary
// Sacred Vessels, Linens, Sanctuary Appointments & Vestments

export interface SacredObject {
  id: string;
  name: string;
  icon: string;
  category: 'Vessel' | 'Linen' | 'Sanctuary' | 'Vestment';
  description: string;
  spiritualMeaning: string;
  catechismRef: string;
}

export const SACRED_OBJECTS: SacredObject[] = [
  {
    id: 'chalice',
    name: 'The Chalice',
    icon: '🏆',
    category: 'Vessel',
    description: 'The sacred cup made of precious metal (usually gold or silver) used to hold the wine that becomes the Precious Blood of Jesus.',
    spiritualMeaning: 'Echoes the cup Jesus lifted at the Last Supper: "This is my blood of the covenant, which is poured out for many."',
    catechismRef: 'CCC 1334'
  },
  {
    id: 'paten',
    name: 'The Paten',
    icon: '🪙',
    category: 'Vessel',
    description: 'A shallow golden plate that holds the large sacred Host that the priest breaks during the consecration.',
    spiritualMeaning: 'Derived from the Latin "patina" (dish), it holds the living Bread that came down from Heaven.',
    catechismRef: 'CCC 1150'
  },
  {
    id: 'ciborium',
    name: 'The Ciborium',
    icon: '👑',
    category: 'Vessel',
    description: 'A sacred cup with a lid used to hold the consecrated Hosts for distribution at Holy Communion and reservation in the Tabernacle.',
    spiritualMeaning: 'Safeguards the holy Sacrament so Jesus can be brought to the sick and adored in prayer.',
    catechismRef: 'CCC 1379'
  },
  {
    id: 'tabernacle',
    name: 'The Tabernacle',
    icon: '⛪',
    category: 'Sanctuary',
    description: 'The sacred, secure dwelling place in the church where the Blessed Sacrament is reserved.',
    spiritualMeaning: 'The word means "tent". Jesus truly dwells in our parish church 24/7. Whenever we pass it, we genuflect on our right knee.',
    catechismRef: 'CCC 1379'
  },
  {
    id: 'sanctuary-lamp',
    name: 'The Sanctuary Lamp',
    icon: '🕯️',
    category: 'Sanctuary',
    description: 'A candle encased in red glass burning continuously day and night beside or above the Tabernacle.',
    spiritualMeaning: 'A bright beacon reminding everyone that Jesus is truly present in the Tabernacle right now.',
    catechismRef: 'CCC 1183'
  },
  {
    id: 'cruets',
    name: 'The Cruets',
    icon: '🏺',
    category: 'Vessel',
    description: 'Two small glass pitchers: one containing water and the other containing pure grape wine for the Mass.',
    spiritualMeaning: 'When the priest mingles a drop of water into the wine, it signifies Christ sharing our human nature so we may share in His divinity.',
    catechismRef: 'CCC 1333'
  },
  {
    id: 'purificator',
    name: 'The Purificator',
    icon: '📜',
    category: 'Linen',
    description: 'A white linen cloth marked with a small red cross in the centre, used to dry and purify the Chalice, Paten, and Ciborium.',
    spiritualMeaning: 'Ensures that every tiny particle of the Body of Christ and drop of the Precious Blood is treated with supreme reverence.',
    catechismRef: 'CCC 1385'
  },
  {
    id: 'corporal',
    name: 'The Corporal',
    icon: '⬜',
    category: 'Linen',
    description: 'A square white linen cloth placed on the altar altar cloth where the Chalice, Paten, and Ciborium stand during the Mass.',
    spiritualMeaning: 'From the Latin "corpus" (body), it catches any tiny sacred crumbs that might fall during the consecration.',
    catechismRef: 'CCC 1385'
  },
  {
    id: 'monstrance',
    name: 'The Monstrance',
    icon: '☀️',
    category: 'Vessel',
    description: 'A tall, sunburst-shaped golden vessel holding a consecrated Host behind glass for Eucharistic Adoration and Benediction.',
    spiritualMeaning: 'From Latin "monstrare" (to show). It allows the faithful to gaze in silent awe at Jesus in the Blessed Sacrament.',
    catechismRef: 'CCC 1378'
  },
  {
    id: 'alb',
    name: 'The Alb',
    icon: '🥋',
    category: 'Vestment',
    description: 'A full-length, pure white linen tunic worn by the priest, deacon, and altar servers, reaching from the neck down to the feet.',
    spiritualMeaning: 'Recalls the white baptismal garment. It represents the soul cleansed from sin, putting on Jesus Christ in holiness and purity.',
    catechismRef: 'CCC 1155'
  },
  {
    id: 'cincture',
    name: 'The Cincture',
    icon: '🎗️',
    category: 'Vestment',
    description: 'A thick rope or cord belt with tassels at the ends, tied securely around the waist over the white alb.',
    spiritualMeaning: 'Symbolizes self-control, purity of heart, and spiritual vigilance—being girded and ready to serve Christ at the altar.',
    catechismRef: 'CCC 1155'
  },
  {
    id: 'stole',
    name: 'The Stole',
    icon: '🧣',
    category: 'Vestment',
    description: 'A long, narrow scarf-like band of coloured silk worn around the neck and over the shoulders by the priest during Mass and the sacraments.',
    spiritualMeaning: 'The essential badge of priestly authority and ministerial power granted by Christ to celebrate the Holy Sacrifice of the Mass and grant forgiveness.',
    catechismRef: 'CCC 1155'
  },
  {
    id: 'chasuble',
    name: 'The Chasuble',
    icon: '👘',
    category: 'Vestment',
    description: 'The flowing, sleeveless outer vestment worn by the priest over the alb and stole during the Holy Sacrifice of the Mass.',
    spiritualMeaning: 'Symbolizes the sweet yoke of Christ and Christian charity covering all things. Its liturgical colour changes with church seasons (Green, Purple, White/Gold, Red, Rose).',
    catechismRef: 'CCC 1155'
  },
  {
    id: 'humeral-veil',
    name: 'The Humeral Veil',
    icon: '✨',
    category: 'Vestment',
    description: 'A rich silk shawl worn over the shoulders and hands of the priest when holding the Monstrance during Eucharistic Adoration and Benediction.',
    spiritualMeaning: 'Hides the priest’s human hands so the faithful recognize that it is Jesus Himself in the Blessed Sacrament Who is blessing them.',
    catechismRef: 'CCC 1378'
  }
];
