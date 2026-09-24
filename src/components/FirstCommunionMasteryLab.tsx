import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';
import SevenSacramentsGuide from './SevenSacramentsGuide';
import LiturgicalCalendarGuide from './LiturgicalCalendarGuide';
import LatinMassPrayersChapel from './LatinMassPrayersChapel';
import CreedExplorer from './CreedExplorer';
import CommandmentsMoralGuide from './CommandmentsMoralGuide';
import RosaryMysteryWalk from './RosaryMysteryWalk';
import {
  playSuccessChime,
  playIncorrectTone,
  playClickTone,
  triggerHapticSuccess,
  triggerHapticError,
  triggerHapticClick,
} from '../services/soundHaptics';

export interface LiturgyStep {
  id: string;
  part: 'Introductory Rites' | 'Liturgy of the Word' | 'Liturgy of the Eucharist' | 'Concluding Rites';
  title: string;
  gesture: string;
  mystery: string;
  dialogue?: {
    priest: string;
    response: string;
  };
  catechismRef?: string;
  audioPrompt?: string;
}

export interface SacredObject {
  id: string;
  name: string;
  icon: string;
  category: 'Vessel' | 'Linen' | 'Sanctuary' | 'Vestment';
  description: string;
  spiritualMeaning: string;
  catechismRef: string;
}

export interface CatholicPrayer {
  id: string;
  title: string;
  occasion: string;
  text: string;
  missingWords: string[];
}

const LITURGY_STEPS: LiturgyStep[] = [
  {
    id: 'entrance-sign-cross',
    part: 'Introductory Rites',
    title: 'Gathering & Sign of the Cross',
    gesture: 'Standing tall, reverently making the Sign of the Cross from forehead to chest, left shoulder to right shoulder.',
    mystery: 'We gather as the Family of God, beginning everything in the Name of the Father, and of the Son, and of the Holy Spirit.',
    dialogue: {
      priest: 'The grace of our Lord Jesus Christ, and the love of God, and the communion of the Holy Spirit be with you all.',
      response: 'And with your spirit.'
    },
    catechismRef: 'CCC 1348',
    audioPrompt: 'The grace of our Lord Jesus Christ be with you all. And with your spirit.'
  },
  {
    id: 'penitential-act',
    part: 'Introductory Rites',
    title: 'Penitential Act & Kyrie Eleison',
    gesture: 'Bowing our heads humbly, striking our chest gently at "through my fault".',
    mystery: 'We honestly ask Jesus to forgive our faults so we can prepare our hearts to encounter Him worthily.',
    dialogue: {
      priest: 'Lord, have mercy.',
      response: 'Lord, have mercy. Christ, have mercy. Lord, have mercy.'
    },
    catechismRef: 'CCC 1422',
    audioPrompt: 'Lord have mercy. Christ have mercy. Lord have mercy.'
  },
  {
    id: 'gospel-proclamation',
    part: 'Liturgy of the Word',
    title: 'The Holy Gospel of Jesus Christ',
    gesture: 'Standing in honour. With our right thumb, we trace a small cross on our forehead ("Word in my mind"), lips ("Word on my lips"), and heart ("Word in my heart").',
    mystery: 'Jesus Himself speaks directly to us. He is alive and present in His Holy Word.',
    dialogue: {
      priest: 'A reading from the holy Gospel according to Luke.',
      response: 'Glory to you, O Lord!'
    },
    catechismRef: 'CCC 1154',
    audioPrompt: 'A reading from the holy Gospel. Glory to you, O Lord!'
  },
  {
    id: 'offertory-presentation',
    part: 'Liturgy of the Eucharist',
    title: 'The Presentation of the Gifts (Offertory)',
    gesture: 'Sitting reverently as members of the parish bring the bread, wine cruets, and our collection to the altar.',
    mystery: 'We offer God the simple bread and wine produced by human hands, together with our own prayers, work, and joys.',
    dialogue: {
      priest: 'Blessed are you, Lord God of all creation, for through your goodness we have received the bread we offer you...',
      response: 'Blessed be God for ever.'
    },
    catechismRef: 'CCC 1350',
    audioPrompt: 'Blessed be God for ever.'
  },
  {
    id: 'consecration-transubstantiation',
    part: 'Liturgy of the Eucharist',
    title: 'Consecration & Transubstantiation',
    gesture: 'Kneeling on both knees in total adoration. Silence fills the church as the bells chime.',
    mystery: 'Through the words of Jesus spoken by the priest and the power of the Holy Spirit, the bread and wine become truly the Body, Blood, Soul, and Divinity of Jesus Christ.',
    dialogue: {
      priest: 'TAKE THIS, ALL OF YOU, AND EAT OF IT, FOR THIS IS MY BODY, WHICH WILL BE GIVEN UP FOR YOU.',
      response: '(Silent awe and adoration: "My Lord and my God!")'
    },
    catechismRef: 'CCC 1374-1377',
    audioPrompt: 'Take this, all of you, and eat of it, for this is my body.'
  },
  {
    id: 'centurion-prayer',
    part: 'Liturgy of the Eucharist',
    title: 'The Centurion’s Prayer & Invitation',
    gesture: 'Striking chest gently with right hand in humble contrition.',
    mystery: 'Like the Roman Centurion in the Gospel, we recognise that while we are imperfect, Jesus can heal our souls with a single word.',
    dialogue: {
      priest: 'Behold the Lamb of God, behold him who takes away the sins of the world. Blessed are those called to the supper of the Lamb.',
      response: 'Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed.'
    },
    catechismRef: 'CCC 1386',
    audioPrompt: 'Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed.'
  },
  {
    id: 'holy-communion-reception',
    part: 'Liturgy of the Eucharist',
    title: 'Receiving Holy Communion & Thanksgiving',
    gesture: 'Walking forward with hands joined. When approaching, bow reverently. Place left hand over right hand as a "throne for the King". Say a clear "Amen!", receive the Host, consume it immediately, and return to your pew to kneel in quiet thanksgiving.',
    mystery: 'Jesus unites Himself to us intimately, dwelling in our heart and feeding our soul with eternal life.',
    dialogue: {
      priest: 'The Body of Christ.',
      response: 'Amen!'
    },
    catechismRef: 'CCC 1385-1387',
    audioPrompt: 'The Body of Christ. Amen!'
  },
  {
    id: 'final-dismissal',
    part: 'Concluding Rites',
    title: 'Final Blessing & Commissioning',
    gesture: 'Standing tall, making the Sign of the Cross with the priest’s blessing, and preparing to live as disciples.',
    mystery: 'Having received Christ, we are sent out into our school, family, and community to love, serve, and radiate Jesus.',
    dialogue: {
      priest: 'Go in peace, glorifying the Lord by your life.',
      response: 'Thanks be to God!'
    },
    catechismRef: 'CCC 1332',
    audioPrompt: 'Go in peace, glorifying the Lord by your life. Thanks be to God!'
  }
];

const SACRED_OBJECTS: SacredObject[] = [
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

const CATHOLIC_PRAYERS: CatholicPrayer[] = [
  {
    id: 'act-of-contrition',
    title: 'The Act of Contrition',
    occasion: 'During First Reconciliation / Before Holy Communion',
    text: 'O my God, I thank you for loving me. I am sorry for all my sins, for not loving others and not loving you. Help me to live like Jesus and not sin again. Amen.',
    missingWords: ['loving', 'sorry', 'sins', 'Jesus', 'sin']
  },
  {
    id: 'guardian-angel',
    title: 'Prayer to My Guardian Angel',
    occasion: 'Morning and Evening Daily Protection',
    text: 'Angel of God, my guardian dear, to whom God’s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.',
    missingWords: ['Angel', 'love', 'side', 'guard', 'guide']
  },
  {
    id: 'centurion-prayer',
    title: 'The Centurion’s Prayer of Humility',
    occasion: 'Right before receiving Holy Communion at every Mass',
    text: 'Lord, I am not worthy that you should enter under my roof, but only say the word and my soul shall be healed.',
    missingWords: ['worthy', 'roof', 'word', 'soul', 'healed']
  },
  {
    id: 'confiteor',
    title: 'The Confiteor (I Confess)',
    occasion: 'Penitential Rite at the start of Mass',
    text: 'I confess to almighty God and to you, my brothers and sisters, that I have greatly sinned, in my thoughts and in my words, in what I have done and in what I have failed to do, through my fault, through my fault, through my most grievous fault.',
    missingWords: ['confess', 'sinned', 'thoughts', 'words', 'fault']
  },
  {
    id: 'anima-christi',
    title: 'Thanksgiving Prayer (A Child’s Anima Christi)',
    occasion: 'Quiet reflection after receiving Holy Communion',
    text: 'Soul of Christ, make me holy. Body of Christ, save me. Blood of Christ, fill my heart with love. Water from the side of Christ, wash me clean. Passion of Christ, give me strength. O good Jesus, hear my prayer. Keep me close to you always, and never let me be separated from you. Amen.',
    missingWords: ['Soul', 'Body', 'love', 'Jesus', 'separated']
  }
];

export default function FirstCommunionMasteryLab() {
  const [activeTab, setActiveTab] = useState<
    | 'mass-walk'
    | 'seven-sacraments'
    | 'creed'
    | 'commandments'
    | 'rosary'
    | 'liturgical-seasons'
    | 'sacred-objects'
    | 'prayers'
    | 'latin-prayers'
    | 'journal'
  >('mass-walk');

  // Liturgy ordering game state
  const [sequenceSelection, setSequenceSelection] = useState<string[]>([]);
  const [sequenceSuccess, setSequenceSuccess] = useState<boolean | null>(null);

  // Sacred objects quiz state
  const [activeObjectIndex, setActiveObjectIndex] = useState(0);
  const [objectQuizAnswer, setObjectQuizAnswer] = useState<string | null>(null);
  const [objectQuizScore, setObjectQuizScore] = useState(0);

  // Prayer practice state
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('act-of-contrition');
  const [prayerTestMode, setPrayerTestMode] = useState<boolean>(false);
  const [blankAnswers, setBlankAnswers] = useState<Record<string, string>>({});
  const [prayerFeedback, setPrayerFeedback] = useState<string | null>(null);

  // Mass journal state
  const [journalDate, setJournalDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [journalParish, setJournalParish] = useState('');
  const [journalVestmentColor, setJournalVestmentColor] = useState('Green (Ordinary Time - Hope & Growth)');
  const [journalGospelMessage, setJournalGospelMessage] = useState('');
  const [journalPrayerIntention, setJournalPrayerIntention] = useState('');
  const [journalSaved, setJournalSaved] = useState(false);

  // Speak helper
  const handleListen = (text: string) => {
    speakInLanguage(text, 'en');
  };

  // Check sequence
  const correctSequenceIds = [
    'entrance-sign-cross',
    'penitential-act',
    'gospel-proclamation',
    'offertory-presentation',
    'consecration-transubstantiation',
    'holy-communion-reception',
    'final-dismissal'
  ];

  const handleToggleSequenceItem = (id: string) => {
    playClickTone();
    triggerHapticClick();
    if (sequenceSelection.includes(id)) {
      setSequenceSelection(sequenceSelection.filter((item) => item !== id));
      setSequenceSuccess(null);
    } else {
      const next = [...sequenceSelection, id];
      setSequenceSelection(next);
      if (next.length === correctSequenceIds.length) {
        const isCorrect = next.every((item, idx) => item === correctSequenceIds[idx]);
        setSequenceSuccess(isCorrect);
        if (isCorrect) {
          playSuccessChime();
          triggerHapticSuccess();
        } else {
          playIncorrectTone();
          triggerHapticError();
        }
      }
    }
  };

  const handleResetSequence = () => {
    setSequenceSelection([]);
    setSequenceSuccess(null);
  };

  const activePrayer = CATHOLIC_PRAYERS.find((p) => p.id === selectedPrayerId) || CATHOLIC_PRAYERS[0];

  const handleCheckPrayer = () => {
    let allCorrect = true;
    for (const w of activePrayer.missingWords) {
      if ((blankAnswers[w] || '').trim().toLowerCase() !== w.toLowerCase()) {
        allCorrect = false;
        break;
      }
    }
    if (allCorrect) {
      setPrayerFeedback('🎉 Beautiful! Every sacred word is exact. You have learned this prayer by heart.');
    } else {
      setPrayerFeedback('🌿 Look closely at the underlined blanks. Try again or toggle hint to check!');
    }
  };

  const handleSaveJournal = () => {
    setJournalSaved(true);
    setTimeout(() => setJournalSaved(false), 3000);
  };

  return (
    <section
      id="first-communion-masterclass"
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '2px solid #fef08a',
        boxShadow: '0 4px 20px -2px rgba(234, 179, 8, 0.15)',
        overflow: 'hidden',
        margin: '1.5rem 0',
      }}
    >
      {/* Header Banner */}
      <header
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
          color: '#ffffff',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '3px solid #facc15',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>✝️</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.01em', color: '#fef08a' }}>
                First Holy Communion &amp; Faith Lab
              </h1>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'rgba(254, 240, 138, 0.2)',
                  color: '#fef08a',
                  border: '1px solid rgba(254, 240, 138, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                }}
              >
                For All Pupils &bull; Parish &bull; Family
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#e0e7ff', maxWidth: '640px', lineHeight: 1.4 }}>
              Walk through the Holy Mass step-by-step, discover the sacred vessels on the altar, practice your prayers, and get ready to welcome Jesus into your heart!
            </p>
          </div>
        </div>

        {/* Global Read Aloud Header Button */}
        <button
          type="button"
          onClick={() => handleListen("Welcome to the First Holy Communion and Faith Lab. Let us walk through the Holy Mass, explore the sacred vessels, and learn our prayers.")}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '9999px',
            color: '#ffffff',
            padding: '6px 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
          title="Listen to welcome introduction"
        >
          <span>🔊</span>
          <span>Listen Intro</span>
        </button>
      </header>

      {/* Navigation Sub-Tabs */}
      <nav
        aria-label="First Communion Sections"
        style={{
          display: 'flex',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.5rem 1rem',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          id="fc-tab-mass-walk"
          onClick={() => setActiveTab('mass-walk')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'mass-walk' ? '#4338ca' : 'transparent',
            color: activeTab === 'mass-walk' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🕊️</span>
          <span>Walk Through the Mass</span>
        </button>

        <button
          type="button"
          id="fc-tab-seven-sacraments"
          onClick={() => setActiveTab('seven-sacraments')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'seven-sacraments' ? '#4338ca' : 'transparent',
            color: activeTab === 'seven-sacraments' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>✝️</span>
          <span>The Seven Sacraments</span>
        </button>

        <button
          type="button"
          id="fc-tab-creed"
          onClick={() => setActiveTab('creed')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'creed' ? '#4338ca' : 'transparent',
            color: activeTab === 'creed' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>📜</span>
          <span>Apostles&apos; Creed (What We Believe)</span>
        </button>

        <button
          type="button"
          id="fc-tab-commandments"
          onClick={() => setActiveTab('commandments')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'commandments' ? '#4338ca' : 'transparent',
            color: activeTab === 'commandments' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>⚖️</span>
          <span>10 Commandments &amp; Loving Choices</span>
        </button>

        <button
          type="button"
          id="fc-tab-rosary"
          onClick={() => setActiveTab('rosary')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'rosary' ? '#4338ca' : 'transparent',
            color: activeTab === 'rosary' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>📿</span>
          <span>The Holy Rosary</span>
        </button>

        <button
          type="button"
          id="fc-tab-liturgical-seasons"
          onClick={() => setActiveTab('liturgical-seasons')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'liturgical-seasons' ? '#4338ca' : 'transparent',
            color: activeTab === 'liturgical-seasons' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>📅</span>
          <span>Liturgical Seasons & Easter</span>
        </button>

        <button
          type="button"
          id="fc-tab-sacred-objects"
          onClick={() => setActiveTab('sacred-objects')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'sacred-objects' ? '#4338ca' : 'transparent',
            color: activeTab === 'sacred-objects' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🏺</span>
          <span>Sacred Vessels & Altar</span>
        </button>

        <button
          type="button"
          id="fc-tab-prayers"
          onClick={() => setActiveTab('prayers')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'prayers' ? '#4338ca' : 'transparent',
            color: activeTab === 'prayers' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🙏</span>
          <span>Catholic Prayers Lab</span>
        </button>

        <button
          type="button"
          id="fc-tab-latin-prayers"
          onClick={() => setActiveTab('latin-prayers')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'latin-prayers' ? '#78350f' : 'transparent',
            color: activeTab === 'latin-prayers' ? '#ffffff' : '#78350f',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderBottom: activeTab === 'latin-prayers' ? '2px solid #f59e0b' : 'none',
            transition: 'all 0.15s ease',
          }}
        >
          <span>🇻🇦</span>
          <span>Latin & English Mass Prayers</span>
        </button>

        <button
          type="button"
          id="fc-tab-journal"
          onClick={() => setActiveTab('journal')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'journal' ? '#4338ca' : 'transparent',
            color: activeTab === 'journal' ? '#ffffff' : '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
          }}
        >
          <span>📜</span>
          <span>Family Mass Journal</span>
        </button>
      </nav>

      {/* TAB 1: WALK THROUGH THE HOLY MASS */}
      {activeTab === 'mass-walk' && (
        <div style={{ padding: '1.5rem' }}>
          <div
            style={{
              background: '#fefce8',
              border: '1px solid #fef08a',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#854d0e' }}>
                📖 The Holy Mass: The Source and Summit of Our Faith (CCC 1324)
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#713f12', lineHeight: 1.4 }}>
                The Mass is divided into four sacred movements. Explore each step below to learn what the priest says, what we answer, and how to hold our bodies in reverence.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleListen("The Mass has four movements: Introductory Rites, Liturgy of the Word, Liturgy of the Eucharist, and Concluding Rites.")}
              style={{
                background: '#ffffff',
                border: '1px solid #ca8a04',
                color: '#854d0e',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>🔊</span>
              <span>Listen Summary</span>
            </button>
          </div>

          {/* Liturgy Steps Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {LITURGY_STEPS.map((step, idx) => (
              <article
                key={step.id}
                id={`liturgy-step-${step.id}`}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color:
                          step.part === 'Introductory Rites'
                            ? '#0284c7'
                            : step.part === 'Liturgy of the Word'
                            ? '#0d9488'
                            : step.part === 'Liturgy of the Eucharist'
                            ? '#b45309'
                            : '#7c3aed',
                      }}
                    >
                      Step {idx + 1} &bull; {step.part}
                    </span>
                    <h3 style={{ margin: '3px 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      {step.title}
                    </h3>
                  </div>
                  {step.audioPrompt && (
                    <button
                      type="button"
                      onClick={() => handleListen(step.audioPrompt!)}
                      style={{
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.85rem',
                      }}
                      title="Listen to dialogue"
                    >
                      🔊
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.45 }}>
                  <strong style={{ color: '#0f172a' }}>Sacred Gesture:</strong> {step.gesture}
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    borderLeft: '3px solid #3b82f6',
                    padding: '8px 12px',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.84rem',
                    color: '#1e293b',
                    lineHeight: 1.4,
                  }}
                >
                  <strong style={{ color: '#1d4ed8' }}>The Mystery:</strong> {step.mystery}
                </div>

                {step.dialogue && (
                  <div
                    style={{
                      background: '#fffbeb',
                      border: '1px dashed #fde68a',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div style={{ color: '#78350f' }}>
                      <strong>Priest:</strong> <em>"{step.dialogue.priest}"</em>
                    </div>
                    <div style={{ color: '#92400e', marginTop: '4px', fontWeight: 700 }}>
                      <strong>We Answer:</strong> <em>"{step.dialogue.response}"</em>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Interactive Challenge: Order the Liturgical Moments */}
          <div
            style={{
              marginTop: '2rem',
              background: '#f8fafc',
              border: '2px dashed #cbd5e1',
              borderRadius: '14px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  🧩 Sequence Challenge: Can you order the Mass?
                </h4>
                <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#64748b' }}>
                  Tap the steps in the exact order they happen during Sunday Mass.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetSequence}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#475569',
                }}
              >
                Reset Order
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '1rem' }}>
              {correctSequenceIds.map((id) => {
                const s = LITURGY_STEPS.find((item) => item.id === id);
                if (!s) return null;
                const isSelected = sequenceSelection.includes(id);
                const orderNumber = sequenceSelection.indexOf(id) + 1;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleToggleSequenceItem(id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      background: isSelected ? '#eff6ff' : '#ffffff',
                      color: isSelected ? '#1d4ed8' : '#334155',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isSelected && (
                      <span
                        style={{
                          background: '#2563eb',
                          color: '#ffffff',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {orderNumber}
                      </span>
                    )}
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>

            {sequenceSuccess === true && (
              <div
                style={{
                  marginTop: '1rem',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#15803d',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>🌟</span>
                <span>Superb! You correctly walked through the entire Order of Mass from Entrance to Dismissal.</span>
              </div>
            )}
            {sequenceSuccess === false && (
              <div
                style={{
                  marginTop: '1rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#b91c1c',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                Not quite in exact order yet! Remember: we always gather, listen to God's Word, consecrate & receive Holy Communion, and then receive the final blessing. Tap "Reset Order" to try again.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: THE SEVEN SACRAMENTS */}
      {activeTab === 'seven-sacraments' && (
        <div style={{ padding: '1.5rem' }}>
          <SevenSacramentsGuide />
        </div>
      )}

      {/* TAB: LITURGICAL SEASONS & EASTER */}
      {activeTab === 'liturgical-seasons' && (
        <div style={{ padding: '1.5rem' }}>
          <LiturgicalCalendarGuide />
        </div>
      )}

      {/* TAB 2: SACRED VESSELS & ALTAR OBJECTS */}
      {activeTab === 'sacred-objects' && (
        <div style={{ padding: '1.5rem' }}>
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#166534' }}>
                🏺 Sacred Vessels & Sanctuary Explorer
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#15803d', lineHeight: 1.4 }}>
                Every object on the Catholic altar has a special holy purpose to protect and honour the Body and Blood of Jesus Christ.
              </p>
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534' }}>
              10 Liturgical Objects Included
            </div>
          </div>

          {/* Interactive Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {SACRED_OBJECTS.map((obj, idx) => (
              <article
                key={obj.id}
                id={`sacred-obj-${obj.id}`}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '1.8rem',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '4px 8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {obj.icon}
                  </span>
                  <div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#64748b',
                      }}
                    >
                      {obj.category} &bull; {obj.catechismRef}
                    </span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {obj.name}
                    </h3>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.45 }}>
                  {obj.description}
                </p>

                <div
                  style={{
                    background: '#fefce8',
                    border: '1px solid #fef08a',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '0.8rem',
                    color: '#854d0e',
                    lineHeight: 1.35,
                  }}
                >
                  <strong>Why it matters:</strong> {obj.spiritualMeaning}
                </div>

                <button
                  type="button"
                  onClick={() => handleListen(`${obj.name}. ${obj.description}`)}
                  style={{
                    alignSelf: 'flex-start',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#334155',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: 'auto',
                  }}
                >
                  <span>🔊</span>
                  <span>Listen</span>
                </button>
              </article>
            ))}
          </div>

          {/* Quick Sanctuary Object Quiz */}
          <div
            style={{
              marginTop: '2rem',
              background: '#ffffff',
              border: '2px solid #e0e7ff',
              borderRadius: '14px',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#4f46e5' }}>
                  Flashcard Challenge
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Can you identify this sacred object?
                </h4>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4338ca' }}>
                Score: {objectQuizScore} correct
              </div>
            </div>

            <div style={{ marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                {SACRED_OBJECTS[activeObjectIndex].icon}
              </div>
              <p style={{ fontSize: '0.92rem', color: '#1e293b', margin: '0 0 1rem', lineHeight: 1.45 }}>
                <em>"{SACRED_OBJECTS[activeObjectIndex].description}"</em>
              </p>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  SACRED_OBJECTS[activeObjectIndex].name,
                  SACRED_OBJECTS[(activeObjectIndex + 2) % SACRED_OBJECTS.length].name,
                  SACRED_OBJECTS[(activeObjectIndex + 5) % SACRED_OBJECTS.length].name,
                ]
                  .sort()
                  .map((optionName) => {
                    const isSelected = objectQuizAnswer === optionName;
                    const isCorrect = optionName === SACRED_OBJECTS[activeObjectIndex].name;
                    return (
                      <button
                        key={optionName}
                        type="button"
                        onClick={() => {
                          setObjectQuizAnswer(optionName);
                          if (isCorrect) {
                            setObjectQuizScore((s) => s + 1);
                            playSuccessChime();
                            triggerHapticSuccess();
                          } else {
                            playIncorrectTone();
                            triggerHapticError();
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: isSelected
                            ? isCorrect
                              ? '2px solid #16a34a'
                              : '2px solid #dc2626'
                            : '1px solid #cbd5e1',
                          background: isSelected
                            ? isCorrect
                              ? '#dcfce7'
                              : '#fee2e2'
                            : '#ffffff',
                          color: '#0f172a',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        {optionName}
                      </button>
                    );
                  })}
              </div>

              {objectQuizAnswer && (
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: objectQuizAnswer === SACRED_OBJECTS[activeObjectIndex].name ? '#15803d' : '#b91c1c',
                    }}
                  >
                    {objectQuizAnswer === SACRED_OBJECTS[activeObjectIndex].name
                      ? '✅ Correct! Well remembered.'
                      : `❌ That is ${SACRED_OBJECTS[activeObjectIndex].name}.`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setObjectQuizAnswer(null);
                      setActiveObjectIndex((idx) => (idx + 1) % SACRED_OBJECTS.length);
                    }}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Next Object &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SACRED PRAYERS & REVERENCE LAB */}
      {activeTab === 'prayers' && (
        <div style={{ padding: '1.5rem' }}>
          {/* Golden Rules for Holy Communion */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
              border: '2px solid #fde68a',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#92400e' }}>
              👑 The 3 Golden Rules for Receiving Holy Communion Reverently
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <strong style={{ color: '#b45309', display: 'block', marginBottom: '4px' }}>1. Fast & State of Grace</strong>
                <span style={{ fontSize: '0.84rem', color: '#451a03', lineHeight: 1.4 }}>
                  Fast from all food and drink (except water and medicine) for at least 1 hour before Holy Communion. If aware of serious sin, make a good Confession first.
                </span>
              </div>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <strong style={{ color: '#b45309', display: 'block', marginBottom: '4px' }}>2. Hands as a Royal Throne</strong>
                <span style={{ fontSize: '0.84rem', color: '#451a03', lineHeight: 1.4 }}>
                  Place your left hand flat over your right hand to form a throne for the King of Kings. When the priest says "The Body of Christ", answer with a clear, firm <strong>"Amen!"</strong>
                </span>
              </div>
              <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                <strong style={{ color: '#b45309', display: 'block', marginBottom: '4px' }}>3. Kneeling in Thanksgiving</strong>
                <span style={{ fontSize: '0.84rem', color: '#451a03', lineHeight: 1.4 }}>
                  Consume the Host immediately in front of the priest. Return to your bench, kneel down, close your eyes, and talk quietly to Jesus living in your heart.
                </span>
              </div>
            </div>
          </div>

          {/* Prayer Selection Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {CATHOLIC_PRAYERS.map((p) => (
              <button
                key={p.id}
                type="button"
                id={`btn-prayer-${p.id}`}
                onClick={() => {
                  setSelectedPrayerId(p.id);
                  setBlankAnswers({});
                  setPrayerFeedback(null);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: selectedPrayerId === p.id ? '2px solid #4338ca' : '1px solid #cbd5e1',
                  background: selectedPrayerId === p.id ? '#eef2ff' : '#ffffff',
                  color: selectedPrayerId === p.id ? '#312e81' : '#475569',
                  fontWeight: selectedPrayerId === p.id ? 800 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {p.title}
              </button>
            ))}
          </div>

          {/* Selected Prayer Workspace */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase' }}>
                  {activePrayer.occasion}
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  {activePrayer.title}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleListen(activePrayer.text)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#1e293b',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span>🔊</span>
                  <span>Listen & Repeat</span>
                </button>

                <button
                  type="button"
                  id="toggle-memory-test"
                  onClick={() => {
                    setPrayerTestMode(!prayerTestMode);
                    setPrayerFeedback(null);
                  }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    background: prayerTestMode ? '#f59e0b' : '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {prayerTestMode ? '👁️ View Full Prayer' : '🧠 Test My Memory'}
                </button>
              </div>
            </div>

            {/* Prayer Rendering */}
            {!prayerTestMode ? (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: '#1e293b',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                }}
              >
                "{activePrayer.text}"
              </div>
            ) : (
              <div
                style={{
                  background: '#fffbeb',
                  border: '1px dashed #f59e0b',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  fontSize: '1.02rem',
                  lineHeight: 1.8,
                  color: '#1e293b',
                }}
              >
                <div style={{ marginBottom: '0.75rem', fontSize: '0.85rem', color: '#92400e', fontWeight: 600 }}>
                  Fill in the missing sacred words below, then click "Check Memory":
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  {activePrayer.text.split(' ').map((word, wIdx) => {
                    const cleanWord = word.replace(/[.,;!?]/g, '');
                    const isMissing = activePrayer.missingWords.some((mw) => mw.toLowerCase() === cleanWord.toLowerCase());
                    const punctuation = word.slice(cleanWord.length);

                    if (isMissing) {
                      return (
                        <span key={wIdx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="_______"
                            value={blankAnswers[cleanWord] || ''}
                            onChange={(e) => setBlankAnswers({ ...blankAnswers, [cleanWord]: e.target.value })}
                            style={{
                              width: '90px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              border: '1px solid #d97706',
                              background: '#ffffff',
                              fontSize: '0.9rem',
                              fontWeight: 700,
                              textAlign: 'center',
                              color: '#92400e',
                            }}
                          />
                          {punctuation}
                        </span>
                      );
                    }
                    return <span key={wIdx}>{word} </span>;
                  })}
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    id="btn-check-prayer"
                    onClick={handleCheckPrayer}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '8px',
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Check Memory
                  </button>
                  {prayerFeedback && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>
                      {prayerFeedback}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: SACRED LATIN & ENGLISH MASS PRAYERS CHAPEL */}
      {activeTab === 'latin-prayers' && (
        <LatinMassPrayersChapel />
      )}

      {/* TAB: RCIA PILLAR 1 — APOSTLES' CREED */}
      {activeTab === 'creed' && (
        <CreedExplorer />
      )}

      {/* TAB: RCIA PILLAR 3 — COMMANDMENTS & MORAL THEOLOGY */}
      {activeTab === 'commandments' && (
        <CommandmentsMoralGuide />
      )}

      {/* TAB: RCIA PILLAR 4 — THE HOLY ROSARY & CONTEMPLATIVE PRAYER */}
      {activeTab === 'rosary' && (
        <RosaryMysteryWalk />
      )}

      {/* TAB 4: FAMILY & PARISH MASS JOURNAL */}
      {activeTab === 'journal' && (
        <div style={{ padding: '1.5rem' }}>
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0369a1' }}>
                📜 Sunday Mass Family Conversation & Journal
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#0284c7', lineHeight: 1.4 }}>
                Parents are the primary educators of their children's faith. Use this guided journal every Sunday to reflect together on what you saw, heard, and prayed during the Mass.
              </p>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>🖨️</span>
              <span>Print Journal</span>
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveJournal();
            }}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Date of Sunday Mass:
              </label>
              <input
                type="date"
                value={journalDate}
                onChange={(e) => setJournalDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Our Parish Church Name:
              </label>
              <input
                type="text"
                placeholder="e.g. St Joseph's Catholic Church"
                value={journalParish}
                onChange={(e) => setJournalParish(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Liturgical Vestment Colour Spotted on the Priest:
              </label>
              <select
                value={journalVestmentColor}
                onChange={(e) => setJournalVestmentColor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  background: '#ffffff',
                }}
              >
                <option value="Green (Ordinary Time - Hope & Growth)">Green &bull; Ordinary Time (Growing in friendship with Jesus)</option>
                <option value="Purple / Violet (Advent & Lent - Preparation & Penance)">Purple / Violet &bull; Advent or Lent (Preparing and sorrow for sins)</option>
                <option value="White / Gold (Easter & Christmas - Resurrection & Joy)">White / Gold &bull; Easter & Christmas (Glorious resurrection and celebration)</option>
                <option value="Red (Pentecost & Martyrs - Holy Spirit & Love)">Red &bull; Pentecost & Martyrs (Fire of the Holy Spirit and total devotion)</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                What was the main story or message from the Holy Gospel?
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Jesus fed the 5,000 people and reminded us He is the Bread of Life..."
                value={journalGospelMessage}
                onChange={(e) => setJournalGospelMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                My Personal Prayer / Intention for Jesus this week:
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Dear Jesus, thank you for loving me. Please watch over my family and help me to be kind to everyone in my class..."
                value={journalPrayerIntention}
                onChange={(e) => setJournalPrayerIntention(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Save Family Journal
              </button>
              {journalSaved && (
                <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>
                  ✅ Journal entry saved in your local offline session!
                </span>
              )}
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
