import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';

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

export default function LatinMassPrayersChapel() {
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('pater-noster');
  const [displayMode, setDisplayMode] = useState<'both' | 'latin' | 'english'>('both');
  const [showPhonetics, setShowPhonetics] = useState<boolean>(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  
  // Interactive matching mini-game state
  const [matchGameActive, setMatchGameActive] = useState<boolean>(false);
  const [selectedMatchLatin, setSelectedMatchLatin] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchFeedback, setMatchFeedback] = useState<string | null>(null);

  const activePrayer = LATIN_PRAYERS_DATA.find((p) => p.id === selectedPrayerId) || LATIN_PRAYERS_DATA[0];

  const categories = ['All', 'Ordinary of the Mass', 'Universal Prayers', 'Thanksgiving & Adoration'];

  const filteredPrayers = activeCategoryFilter === 'All' 
    ? LATIN_PRAYERS_DATA 
    : LATIN_PRAYERS_DATA.filter((p) => p.category === activeCategoryFilter);

  // Play Latin recitation (using Italian/Latin TTS voice phonetics)
  const handleReciteLatin = (verseLatin: string) => {
    // Italian phonemes best match Roman liturgical Latin pronunciation in Web Speech
    speakInLanguage(verseLatin, 'it');
  };

  const handleReciteEnglish = (verseEnglish: string) => {
    speakInLanguage(verseEnglish, 'en');
  };

  const handleReciteFullPrayer = () => {
    const fullText = activePrayer.verses.map((v) => v.latin).join(' ');
    speakInLanguage(fullText, 'it');
  };

  // Mini quiz match pairs
  const miniGamePairs = [
    { latin: 'Sanctus, Sanctus, Sanctus', english: 'Holy, Holy, Holy' },
    { latin: 'Agnus Dei', english: 'Lamb of God' },
    { latin: 'Et cum spíritu tuo', english: 'And with your spirit' },
    { latin: 'Pater noster', english: 'Our Father' },
    { latin: 'Dona nobis pacem', english: 'Grant us peace' },
    { latin: 'In nómine Patris', english: 'In the name of the Father' },
  ];

  const handleMatchClick = (type: 'latin' | 'english', text: string) => {
    if (type === 'latin') {
      setSelectedMatchLatin(text);
      setMatchFeedback(null);
    } else if (type === 'english' && selectedMatchLatin) {
      const match = miniGamePairs.find((p) => p.latin === selectedMatchLatin && p.english === text);
      if (match) {
        setMatchedPairs((prev) => [...prev, match.latin]);
        setSelectedMatchLatin(null);
        setMatchFeedback('🎉 Correct match! Deo grátias (Thanks be to God)!');
      } else {
        setMatchFeedback('🌿 Not quite matched. Listen closely and try again!');
      }
    }
  };

  return (
    <div id="latin-mass-prayers-chapel" style={{ padding: '1.25rem 1.5rem', background: '#fdfbf7' }}>
      {/* Intro Box */}
      <div
        style={{
          background: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 12px rgba(120, 53, 15, 0.18)',
          border: '1px solid #b45309',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '1.6rem' }}>📜</span>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fef08a' }}>
              Sacred Latin & English Mass Prayers Chapel
            </h3>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                background: 'rgba(254, 240, 138, 0.2)',
                color: '#fef08a',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid rgba(254, 240, 138, 0.4)',
              }}
            >
              Lingua Sacra &bull; Universal Catholic Heritage
            </span>
          </div>
          <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#fde68a', maxWidth: '680px', lineHeight: 1.45 }}>
            Latin is the universal mother tongue of the Catholic Church. Learning these holy acclamations connects you with 
            millions of Catholic children and saints throughout 2,000 years of history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleReciteFullPrayer}
            style={{
              background: '#f59e0b',
              color: '#451a03',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            <span>🔊</span>
            <span>Chant Latin Aloud</span>
          </button>

          <button
            type="button"
            onClick={() => setMatchGameActive(!matchGameActive)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🎯</span>
            <span>{matchGameActive ? 'Close Matcher' : 'Latin Match Game'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Match Mini Game */}
      {matchGameActive && (
        <div
          style={{
            background: '#ffffff',
            border: '2px dashed #b45309',
            borderRadius: '12px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#78350f' }}>
              🎯 Match the Sacred Latin to English Meaning
            </h4>
            <span style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 600 }}>
              Matched: {matchedPairs.length} / {miniGamePairs.length}
            </span>
          </div>
          <p style={{ margin: '0 0 1rem', fontSize: '0.84rem', color: '#78350f' }}>
            Click a <strong>Latin Acclamation</strong> on the left, then click its corresponding <strong>English Translation</strong> on the right!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Latin Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                Latin Acclamations
              </div>
              {miniGamePairs.map((pair) => {
                const isMatched = matchedPairs.includes(pair.latin);
                const isSelected = selectedMatchLatin === pair.latin;
                return (
                  <button
                    key={`match-lat-${pair.latin}`}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleMatchClick('latin', pair.latin)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      border: isSelected ? '2px solid #b45309' : isMatched ? '1px solid #86efac' : '1px solid #e2e8f0',
                      background: isMatched ? '#f0fdf4' : isSelected ? '#fef3c7' : '#f8fafc',
                      color: isMatched ? '#166534' : isSelected ? '#92400e' : '#1e293b',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: isMatched ? 'default' : 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{pair.latin}</span>
                    {isMatched && <span>✅</span>}
                  </button>
                );
              })}
            </div>

            {/* English Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                English Meanings
              </div>
              {miniGamePairs.map((pair) => {
                const isMatched = matchedPairs.includes(pair.latin);
                return (
                  <button
                    key={`match-eng-${pair.english}`}
                    type="button"
                    disabled={isMatched}
                    onClick={() => handleMatchClick('english', pair.english)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      textAlign: 'left',
                      border: isMatched ? '1px solid #86efac' : '1px solid #e2e8f0',
                      background: isMatched ? '#f0fdf4' : '#f8fafc',
                      color: isMatched ? '#166534' : '#1e293b',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      cursor: isMatched ? 'default' : 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{pair.english}</span>
                    {isMatched && <span>✅</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {matchFeedback && (
            <div
              style={{
                marginTop: '1rem',
                padding: '8px 12px',
                borderRadius: '8px',
                background: matchFeedback.includes('Correct') ? '#f0fdf4' : '#fef2f2',
                color: matchFeedback.includes('Correct') ? '#166534' : '#991b1b',
                fontSize: '0.85rem',
                fontWeight: 700,
              }}
            >
              {matchFeedback}
            </div>
          )}
        </div>
      )}

      {/* Controls Bar: Category Filter & View Mode */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
          background: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* Category filter pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={`cat-${cat}`}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeCategoryFilter === cat ? '#78350f' : '#f1f5f9',
                color: activeCategoryFilter === cat ? '#ffffff' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '6px' }}>
            <button
              type="button"
              onClick={() => setDisplayMode('both')}
              style={{
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: displayMode === 'both' ? '#ffffff' : 'transparent',
                color: displayMode === 'both' ? '#78350f' : '#64748b',
                boxShadow: displayMode === 'both' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Parallel View
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('latin')}
              style={{
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: displayMode === 'latin' ? '#ffffff' : 'transparent',
                color: displayMode === 'latin' ? '#78350f' : '#64748b',
                boxShadow: displayMode === 'latin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Latin Only
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode('english')}
              style={{
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                background: displayMode === 'english' ? '#ffffff' : 'transparent',
                color: displayMode === 'english' ? '#78350f' : '#64748b',
                boxShadow: displayMode === 'english' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              English Only
            </button>
          </div>

          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={showPhonetics}
              onChange={(e) => setShowPhonetics(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Show Pronunciation Guide</span>
          </label>
        </div>
      </div>

      {/* Main Prayer Layout: Selector on Left / Reader on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 300px) 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* Left: Prayer List */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div
            style={{
              background: '#f8fafc',
              padding: '10px 14px',
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 700,
              fontSize: '0.84rem',
              color: '#475569',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>SELECT SACRED PRAYER</span>
            <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px' }}>
              {filteredPrayers.length}
            </span>
          </div>

          <div style={{ maxHeight: '540px', overflowY: 'auto' }}>
            {filteredPrayers.map((prayer) => {
              const isSelected = prayer.id === activePrayer.id;
              return (
                <button
                  key={`prayer-select-${prayer.id}`}
                  type="button"
                  onClick={() => setSelectedPrayerId(prayer.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 14px',
                    border: 'none',
                    borderBottom: '1px solid #f1f5f9',
                    background: isSelected ? '#fef3c7' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.1s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        color: isSelected ? '#78350f' : '#1e293b',
                        fontFamily: 'Georgia, serif',
                      }}
                    >
                      {prayer.titleLatin}
                    </span>
                    {isSelected && <span style={{ fontSize: '0.78rem', color: '#b45309' }}>▶</span>}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: isSelected ? '#92400e' : '#64748b' }}>
                    {prayer.titleEnglish}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      color: isSelected ? '#b45309' : '#94a3b8',
                      marginTop: '2px',
                    }}
                  >
                    {prayer.liturgicalMoment.slice(0, 45)}...
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Prayer Presentation */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header of Active Prayer */}
          <div
            style={{
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: '#78350f',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {activePrayer.titleLatin}
                </h3>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: '#fef3c7',
                    color: '#92400e',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  {activePrayer.category}
                </span>
              </div>
              <h4 style={{ margin: '4px 0 0', fontSize: '0.96rem', fontWeight: 600, color: '#64748b' }}>
                {activePrayer.titleEnglish}
              </h4>
              <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#475569', fontStyle: 'italic' }}>
                📍 {activePrayer.liturgicalMoment}
              </p>
            </div>

            <button
              type="button"
              onClick={handleReciteFullPrayer}
              style={{
                background: '#fef3c7',
                border: '1px solid #fcd34d',
                color: '#78350f',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>🔊</span>
              <span>Listen Full Prayer</span>
            </button>
          </div>

          {/* Catechetical Meaning Banner */}
          <div
            style={{
              background: '#fefce8',
              borderLeft: '4px solid #eab308',
              padding: '0.75rem 1rem',
              borderRadius: '0 8px 8px 0',
              marginBottom: '1.25rem',
              fontSize: '0.84rem',
              color: '#713f12',
              lineHeight: 1.5,
            }}
          >
            <strong>✨ Spiritual Meaning for Communion:</strong> {activePrayer.sacredContext}
            <div style={{ marginTop: '4px', fontSize: '0.78rem', color: '#854d0e' }}>
              📜 <em>Historical Note:</em> {activePrayer.historicalNote}
            </div>
          </div>

          {/* Verses Table / List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activePrayer.verses.map((verse, idx) => (
              <div
                key={`verse-${activePrayer.id}-${idx}`}
                style={{
                  background: idx % 2 === 0 ? '#fafaf9' : '#ffffff',
                  border: '1px solid #f5f5f4',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'grid',
                  gridTemplateColumns: displayMode === 'both' ? '1fr 1fr' : '1fr',
                  gap: '1rem',
                  position: 'relative',
                }}
              >
                {/* Latin side */}
                {(displayMode === 'both' || displayMode === 'latin') && (
                  <div style={{ borderRight: displayMode === 'both' ? '1px dashed #e2e8f0' : 'none', paddingRight: displayMode === 'both' ? '1rem' : '0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#92400e', textTransform: 'uppercase' }}>
                        Latin
                      </span>
                      <button
                        type="button"
                        onClick={() => handleReciteLatin(verse.latin)}
                        title="Pronounce Latin phrase"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          padding: '2px 4px',
                        }}
                      >
                        🔊
                      </button>
                    </div>
                    <div
                      style={{
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        color: '#78350f',
                        fontFamily: 'Georgia, serif',
                        lineHeight: 1.5,
                      }}
                    >
                      {verse.latin}
                    </div>

                    {showPhonetics && (
                      <div
                        style={{
                          marginTop: '6px',
                          fontSize: '0.78rem',
                          color: '#b45309',
                          fontStyle: 'italic',
                          background: 'rgba(254, 243, 199, 0.5)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        🗣️ <strong>Say:</strong> {verse.phonetic}
                      </div>
                    )}
                  </div>
                )}

                {/* English side */}
                {(displayMode === 'both' || displayMode === 'english') && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                        English Meaning
                      </span>
                      <button
                        type="button"
                        onClick={() => handleReciteEnglish(verse.english)}
                        title="Read English translation"
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          padding: '2px 4px',
                        }}
                      >
                        🔊
                      </button>
                    </div>
                    <div
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 500,
                        color: '#1e293b',
                        lineHeight: 1.5,
                      }}
                    >
                      {verse.english}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
