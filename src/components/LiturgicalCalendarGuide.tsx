import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';

export interface LiturgicalSeason {
  id: string;
  name: string;
  latinName: string;
  colorName: string;
  colorHex: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  icon: string;
  duration: string;
  theme: string;
  spiritualMeaning: string;
  keyEvents: string[];
  biblicalAnchor: string;
  traditions: string[];
  connectionToEucharist: string;
  catechismRef: string;
}

export const LITURGICAL_SEASONS: LiturgicalSeason[] = [
  {
    id: 'advent',
    name: 'Advent',
    latinName: 'Adventus (Coming)',
    colorName: 'Purple / Violet (Rose on Gaudete Sunday)',
    colorHex: '#7c3aed',
    badgeBg: '#f3e8ff',
    badgeBorder: '#d8b4fe',
    badgeText: '#6b21a8',
    icon: '🕯️',
    duration: '4 Sundays leading up to Christmas Eve',
    theme: 'Hope, preparation, and joyful anticipation of Christ’s First Coming at Bethlehem and His Second Coming at the end of time.',
    spiritualMeaning: 'A time of spiritual awakening and quiet preparation of the heart to receive the Infant Jesus.',
    keyEvents: [
      'First Sunday of Advent (New Liturgical Year starts)',
      'Gaudete Sunday (3rd Sunday - Rose vestments for joy)',
      'Solemnity of the Immaculate Conception (8 December)',
      'O Antiphons (17–23 December)'
    ],
    biblicalAnchor: '"A voice cries out: In the desert prepare the way of the Lord; make straight in the wilderness a highway for our God!" (Isaiah 40:3)',
    traditions: [
      'The Advent Wreath with 3 purple candles and 1 rose candle',
      'The Jesse Tree tracing the lineage of Christ',
      'Daily Advent Calendar prayer reflection'
    ],
    connectionToEucharist: 'Just as Mary opened her heart to carry Jesus in her womb, we prepare our souls in Advent to receive Jesus in Holy Communion.',
    catechismRef: 'CCC 524'
  },
  {
    id: 'christmas',
    name: 'Christmastide (The Nativity)',
    latinName: 'Nativitas Domini',
    colorName: 'White & Gold',
    colorHex: '#d97706',
    badgeBg: '#fef3c7',
    badgeBorder: '#fde68a',
    badgeText: '#92400e',
    icon: '⭐',
    duration: 'Christmas Eve through the Baptism of the Lord (early January)',
    theme: 'The Incarnation: God became man to dwell among us and save us from sin.',
    spiritualMeaning: 'Celebration of divine humility, peace, and eternal life brought to humanity by Jesus Christ.',
    keyEvents: [
      'The Nativity of the Lord / Christmas Day (25 December)',
      'Feast of the Holy Family of Jesus, Mary, and Joseph',
      'Solemnity of Mary, the Holy Mother of God (1 January)',
      'Solemnity of the Epiphany (The Magi present Gold, Frankincense & Myrrh)',
      'The Feast of the Baptism of the Lord (Concludes Christmastide)'
    ],
    biblicalAnchor: '"And the Word became flesh and made his dwelling among us, and we saw his glory, the glory as of the Father’s only Son." (John 1:14)',
    traditions: [
      'The Nativity Creche / Crib blessing with baby Jesus',
      'Midnight Mass of the Nativity',
      'Chalking the door with the Epiphany blessing (20+C+M+B+year)'
    ],
    connectionToEucharist: 'Bethlehem means "House of Bread". Jesus was born in Bethlehem and laid in a manger (a feeding trough), showing that He is the Living Bread from Heaven for us to eat.',
    catechismRef: 'CCC 525-528'
  },
  {
    id: 'ordinary-time-1',
    name: 'Ordinary Time (Part I)',
    latinName: 'Tempus per Annum',
    colorName: 'Green',
    colorHex: '#16a34a',
    badgeBg: '#dcfce7',
    badgeBorder: '#bbf7d0',
    badgeText: '#15803d',
    icon: '🌱',
    duration: 'From the Baptism of the Lord until Ash Wednesday (4–9 weeks)',
    theme: 'Growing in discipleship, following Jesus in His early public ministry, call of the Apostles, and miracles.',
    spiritualMeaning: '"Ordinary" comes from "ordinal" (counted time). Green symbolizes life, hope, and steady spiritual growth.',
    keyEvents: [
      'The Wedding Feast at Cana (First public miracle of Jesus)',
      'The Calling of the Twelve Apostles',
      'The Feast of the Presentation of the Lord / Candlemas (2 February)'
    ],
    biblicalAnchor: '"Jesus said to them: Follow me, and I will make you fishers of men." (Mark 1:17)',
    traditions: [
      'Blessing of candles at Candlemas',
      'Daily Gospel reading and learning the parables'
    ],
    connectionToEucharist: 'At Cana, Jesus changed water into wine, pointing forward to the Last Supper where wine is transformed into His Precious Blood.',
    catechismRef: 'CCC 1163-1171'
  },
  {
    id: 'lent',
    name: 'Lent (Quadragesima)',
    latinName: 'Quadragesima (40 Days)',
    colorName: 'Purple / Violet (Rose on Laetare Sunday)',
    colorHex: '#6d28d9',
    badgeBg: '#ede9fe',
    badgeBorder: '#ddd6fe',
    badgeText: '#5b21b6',
    icon: '✝️',
    duration: '40 days from Ash Wednesday to Holy Thursday (excluding Sundays)',
    theme: 'Repentance, conversion, prayer, fasting, and almsgiving, walking with Jesus into the desert.',
    spiritualMeaning: 'Purification of our hearts through self-discipline, preparing to celebrate the victory of the Resurrection.',
    keyEvents: [
      'Ash Wednesday ("Remember that you are dust, and to dust you shall return")',
      'The 40 Days of Fasting imitating Jesus in the Judean desert',
      'Laetare Sunday (4th Sunday of Lent - Rose vestments for joy)',
      'Stations of the Cross practiced every Friday'
    ],
    biblicalAnchor: '"Even now, says the Lord, return to me with your whole heart, with fasting, and weeping, and mourning." (Joel 2:12)',
    traditions: [
      'Receiving blessed ashes on the forehead on Ash Wednesday',
      'Praying the 14 Stations of the Cross (Via Crucis)',
      'Making a thorough Lenten Confession (Sacrament of Reconciliation)',
      'Giving up sweets or luxuries, doing acts of charity'
    ],
    connectionToEucharist: 'In Lent, we confess our sins so our souls are clean, humble, and receptive when we receive Jesus at the Easter altar.',
    catechismRef: 'CCC 540, 1434, 1438'
  },
  {
    id: 'triduum',
    name: 'Holy Week & The Sacred Paschal Triduum',
    latinName: 'Sacrum Triduum Paschale',
    colorName: 'Red (Palm Sunday & Good Friday), White (Holy Thursday & Easter Vigil)',
    colorHex: '#b91c1c',
    badgeBg: '#fee2e2',
    badgeBorder: '#fca5a5',
    badgeText: '#991b1b',
    icon: '🕊️',
    duration: 'From Holy Thursday evening to Easter Sunday evening (The Great 3 Days)',
    theme: 'The summit and heart of the entire Christian year: The Passion, Crucifixion, Death, Burial, and Resurrection of Jesus.',
    spiritualMeaning: 'The historical and theological core of salvation history. Christ pays the debt of sin and crushes death forever.',
    keyEvents: [
      'Palm Sunday of the Passion of the Lord (Blessing of Palms, Christ enters Jerusalem)',
      'Holy Thursday: Mass of the Lord’s Supper (Institution of the Eucharist & Priesthood, Washing of the Feet, Watch with Jesus at the Altar of Repose)',
      'Good Friday of the Lord’s Passion (Solemn Intercessions, Veneration of the Wood of the Cross, Communion service; no Mass celebrated anywhere on Earth)',
      'Holy Saturday: The Easter Vigil in the Holy Night (Lucernarium / Service of Light, Paschal Candle, Exsultet chant, 7 Old Testament readings, Baptism of new Catholics, the joyful return of the Gloria & Alleluia)'
    ],
    biblicalAnchor: '"Greater love has no one than this: to lay down one’s life for one’s friends." (John 15:13) and "Father, into your hands I commend my spirit." (Luke 23:46)',
    traditions: [
      'Carrying blessed palm branches in procession',
      'Washing of feet imitating Jesus’ servant leadership (Mandatum)',
      'Silent prayer at the Altar of Repose until midnight',
      'Touching or kissing the crucifix during Veneration of the Cross',
      'Lighting individual candles from the new Paschal Fire in the darkened church'
    ],
    connectionToEucharist: 'On Holy Thursday at the Last Supper, Jesus instituted the Sacrament of the Holy Eucharist! Every single Mass celebrated in the world makes this very sacrifice and supper present on our altar.',
    catechismRef: 'CCC 1168-1171'
  },
  {
    id: 'easter',
    name: 'The Easter Season (Eastertide / Paschaltide)',
    latinName: 'Tempus Paschale',
    colorName: 'White & Gold',
    colorHex: '#eab308',
    badgeBg: '#fef9c3',
    badgeBorder: '#fef08a',
    badgeText: '#854d0e',
    icon: '🌅',
    duration: '50 glorious days from Easter Sunday to Pentecost Sunday',
    theme: 'The Resurrection of Jesus Christ, victory over sin and death, the gift of eternal life, and divine mercy.',
    spiritualMeaning: 'A continuous 50-day feast celebrated as "one great Sunday" (St Athanasius). The triumphant exclamation is "Christ is Risen! Alleluia!"',
    keyEvents: [
      'Easter Sunday: The Resurrection of the Lord (Empty tomb, appearance to Mary Magdalene)',
      'The Easter Octave (8 days celebrated as one continuous Easter Day)',
      'Divine Mercy Sunday (2nd Sunday of Easter)',
      'The Road to Emmaus (Jesus recognized in the Breaking of the Bread)',
      'Solemnity of the Ascension of the Lord (40th day after Easter - Christ ascends into Heaven)'
    ],
    biblicalAnchor: '"Why do you look for the living among the dead? He is not here; he has risen!" (Luke 24:5-6)',
    traditions: [
      'Singing the Regina Caeli instead of the Angelus',
      'The tall Paschal Candle burning brightly near the altar at every Mass',
      'Exchanging Easter eggs as symbols of new life bursting from the tomb',
      'Sprinkling with freshly blessed Easter water'
    ],
    connectionToEucharist: 'In the Holy Eucharist, we receive the RISEN, living Jesus Christ! His tomb is forever empty, and His glorified body feeds us to give us eternal life.',
    catechismRef: 'CCC 638-655, 1169'
  },
  {
    id: 'pentecost',
    name: 'Pentecost Sunday',
    latinName: 'Pentecoste (50th Day)',
    colorName: 'Red (The Fire of the Holy Spirit)',
    colorHex: '#dc2626',
    badgeBg: '#fee2e2',
    badgeBorder: '#fecaca',
    badgeText: '#b91c1c',
    icon: '🔥',
    duration: 'The 50th day after Easter (Concludes Eastertide)',
    theme: 'The descent of the Holy Spirit upon Mary and the Apostles; the birth of the Catholic Church and missionary mandate.',
    spiritualMeaning: 'The Church is empowered with divine boldness and the Seven Gifts of the Holy Spirit to bring Christ’s Gospel to every corner of the earth.',
    keyEvents: [
      'The Descent of the Holy Spirit as tongues of fire and a mighty rushing wind',
      'The Apostles proclaim Christ in all languages',
      '3,000 souls baptized in Jerusalem',
      'The official Birthday of the Catholic Church'
    ],
    biblicalAnchor: '"And there appeared to them tongues as of fire, distributed and resting on each one of them. And they were all filled with the Holy Spirit." (Acts 2:3-4)',
    traditions: [
      'Wearing red to Sunday Mass',
      'Singing the ancient Veni Creator Spiritus chant',
      'Confirmations celebrated in many parishes'
    ],
    connectionToEucharist: 'At every Mass during the Epiclesis, the priest stretches his hands over the bread and wine and prays for the Holy Spirit to descend and change them into Christ’s Body and Blood.',
    catechismRef: 'CCC 731-741, 1287'
  },
  {
    id: 'ordinary-time-2',
    name: 'Ordinary Time (Part II)',
    latinName: 'Tempus per Annum',
    colorName: 'Green',
    colorHex: '#15803d',
    badgeBg: '#f0fdf4',
    badgeBorder: '#bbf7d0',
    badgeText: '#14532d',
    icon: '🌿',
    duration: 'From the Monday after Pentecost until the First Sunday of Advent (approx. 24–28 weeks)',
    theme: 'Living out the Gospel daily, spiritual fruitfulness, and keeping our eyes fixed on Christ until the end of time.',
    spiritualMeaning: 'The longest stretch of the Church year, focusing on mature Christian living, prayer, virtues, and the teachings of Jesus.',
    keyEvents: [
      'Solemnity of the Most Holy Trinity (Sunday after Pentecost)',
      'Solemnity of Corpus Christi (The Most Holy Body and Blood of Christ)',
      'Solemnity of the Sacred Heart of Jesus',
      'Solemnity of the Assumption of the Blessed Virgin Mary (15 August)',
      'Solemnity of All Saints (1 November) & All Souls Day (2 November)',
      'Solemnity of Christ the King (Final Sunday of the Church Year)'
    ],
    biblicalAnchor: '"I am the vine, you are the branches. Whoever remains in me and I in him will bear much fruit." (John 15:5)',
    traditions: [
      'Corpus Christi Eucharistic Processions through town streets',
      'Praying the Rosary daily, especially during October',
      'Visiting cemeteries and praying for the Holy Souls in November'
    ],
    connectionToEucharist: 'Corpus Christi in Ordinary Time is our solemn thanksgiving for the gift of the Holy Eucharist, where Jesus in the Monstrance is carried through the streets in loving adoration.',
    catechismRef: 'CCC 1163-1171'
  }
];

export function getCurrentSeasonByDate(): LiturgicalSeason {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed (0 = Jan, 8 = Sep, 11 = Dec)
  const date = now.getDate();

  // Approximate Catholic calendar based on standard dates
  // Advent: late Nov / Dec
  if ((month === 10 && date >= 27) || (month === 11 && date <= 24)) {
    return LITURGICAL_SEASONS[0]; // Advent
  }
  // Christmas: Dec 25 - Jan 10
  if ((month === 11 && date >= 25) || (month === 0 && date <= 10)) {
    return LITURGICAL_SEASONS[1]; // Christmas
  }
  // Lent / Triduum / Easter: Approx March - May (variable by lunar equinox)
  if (month === 2 || month === 3) {
    // Lent / Easter window
    return LITURGICAL_SEASONS[3]; // Lent
  }
  if (month === 4) {
    return LITURGICAL_SEASONS[5]; // Easter
  }
  // September is Ordinary Time Part II
  return LITURGICAL_SEASONS[7]; // Ordinary Time Part II
}

export default function LiturgicalCalendarGuide(): React.JSX.Element {
  const currentSeason = getCurrentSeasonByDate();
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(currentSeason.id);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const QUIZ = [
    {
      q: 'Which liturgical season celebrates the glorious Resurrection of Jesus Christ from the dead?',
      options: ['The Easter Season (Paschaltide)', 'Advent', 'Ordinary Time'],
      answer: 'The Easter Season (Paschaltide)',
      hint: 'It lasts for 50 days and uses white and gold vestments with the joyful exclamation "Alleluia!"'
    },
    {
      q: 'What is the "Sacred Paschal Triduum" in the Catholic Church?',
      options: [
        'The Three Great Days: Holy Thursday, Good Friday, and the Easter Vigil',
        'The three weeks before Christmas Day',
        'The first three days of Lent'
      ],
      answer: 'The Three Great Days: Holy Thursday, Good Friday, and the Easter Vigil',
      hint: 'It begins with the Mass of the Lord’s Supper and ends on Easter Sunday evening.'
    },
    {
      q: 'On which holy day was the Sacrament of the Holy Eucharist instituted by Jesus Christ?',
      options: ['Holy Thursday (Maundy Thursday)', 'Ash Wednesday', 'Good Friday'],
      answer: 'Holy Thursday (Maundy Thursday)',
      hint: 'Jesus broke bread at the Last Supper and said: "This is my Body... Do this in remembrance of me."'
    },
    {
      q: 'What liturgical colour does the priest wear during Ordinary Time, and what does it symbolize?',
      options: [
        'Green, symbolizing spiritual growth, life, and hope in Christ',
        'Purple, symbolizing mourning and repentance',
        'Red, symbolizing fire and martyrdom'
      ],
      answer: 'Green, symbolizing spiritual growth, life, and hope in Christ',
      hint: 'Think of growing plants and trees in the springtime.'
    },
    {
      q: 'Which solemn feast day celebrates the descent of the Holy Spirit upon Our Lady and the Apostles 50 days after Easter?',
      options: ['Pentecost Sunday', 'Ascension Thursday', 'Epiphany'],
      answer: 'Pentecost Sunday',
      hint: 'The priest wears red vestments and it is known as the Birthday of the Catholic Church.'
    },
    {
      q: 'How many days does Lent last, and on which holy day does it begin with the imposition of ashes?',
      options: [
        '40 days, beginning on Ash Wednesday',
        '50 days, beginning on Palm Sunday',
        '25 days, beginning on Christmas Day'
      ],
      answer: '40 days, beginning on Ash Wednesday',
      hint: 'It recalls Jesus fasting 40 days in the desert.'
    }
  ];

  const activeSeason = LITURGICAL_SEASONS.find((s) => s.id === selectedSeasonId) || LITURGICAL_SEASONS[0];

  const handleOptionClick = (opt: string) => {
    if (selectedOption !== null) return;
    setSelectedOption(opt);
    if (opt === QUIZ[quizIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex + 1 < QUIZ.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {/* Hero Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 16px rgba(30, 27, 75, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.8rem' }}>📅</span>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '3px 10px',
              borderRadius: '9999px',
            }}
          >
            The Catholic Liturgical Year (Annum Liturgicum)
          </span>

          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              background: '#22c55e',
              color: '#052e16',
            }}
          >
            ● Today: {currentSeason.name}
          </span>
        </div>

        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
          Seasonal Liturgical Events &amp; The Church Year
        </h2>

        <p style={{ margin: 0, fontSize: '0.95rem', color: '#e0e7ff', maxWidth: '800px', lineHeight: 1.6 }}>
          The Catholic Church does not follow an ordinary calendar. Through the sacred rhythm of the{' '}
          <strong>Liturgical Seasons</strong>, we walk step-by-step through the entire life, death, resurrection, 
          and glory of Jesus Christ—culminating in the Sacred Paschal Triduum and Easter Sunday!
        </p>

        <button
          type="button"
          onClick={() =>
            speakInLanguage(
              'The Catholic Liturgical Year unfolds the whole mystery of Christ from Advent and Christmas to Lent, the Sacred Paschal Triduum, Easter, and Pentecost.',
              'en'
            )
          }
          style={{
            marginTop: '1rem',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            borderRadius: '9999px',
            color: '#ffffff',
            padding: '6px 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>🔊</span>
          <span>Listen Overview</span>
        </button>
      </div>

      {/* Liturgical Seasons Horizontal Wheel Selector */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '0.75rem' }}>
          Select a Church Season to Explore:
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0.6rem',
          }}
        >
          {LITURGICAL_SEASONS.map((season) => {
            const isSelected = season.id === selectedSeasonId;
            return (
              <button
                key={season.id}
                type="button"
                onClick={() => setSelectedSeasonId(season.id)}
                style={{
                  padding: '10px 8px',
                  borderRadius: '12px',
                  border: isSelected ? `2px solid ${season.colorHex}` : '1px solid #cbd5e1',
                  background: isSelected ? season.badgeBg : '#ffffff',
                  color: isSelected ? season.badgeText : '#334155',
                  fontWeight: isSelected ? 800 : 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: isSelected ? `0 4px 10px ${season.colorHex}25` : 'none',
                  transition: 'all 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{season.icon}</span>
                <span style={{ lineHeight: 1.2 }}>{season.name}</span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: season.badgeBorder,
                    color: season.badgeText,
                    fontWeight: 700,
                    marginTop: '2px',
                  }}
                >
                  {season.colorName.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Season Detailed Card */}
      <div
        style={{
          background: '#ffffff',
          border: `2px solid ${activeSeason.badgeBorder}`,
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '2.5rem',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: activeSeason.badgeBg,
                border: `2px solid ${activeSeason.badgeBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
              }}
            >
              {activeSeason.icon}
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {activeSeason.name}
              </h3>
              <div style={{ fontSize: '0.84rem', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                Latin: {activeSeason.latinName} &bull; {activeSeason.duration}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                background: activeSeason.badgeBg,
                border: `1px solid ${activeSeason.badgeBorder}`,
                color: activeSeason.badgeText,
                fontSize: '0.8rem',
                fontWeight: 800,
              }}
            >
              Vestments: {activeSeason.colorName}
            </span>

            <button
              type="button"
              onClick={() =>
                speakInLanguage(
                  `${activeSeason.name}. Theme: ${activeSeason.theme}. Connection to the Eucharist: ${activeSeason.connectionToEucharist}`,
                  'en'
                )
              }
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#334155',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>🔊</span>
              <span>Listen</span>
            </button>
          </div>
        </div>

        {/* Theme & Spiritual Meaning */}
        <div style={{ marginBottom: '1.25rem', fontSize: '0.95rem', lineHeight: 1.6, color: '#1e293b' }}>
          <strong>Core Spiritual Theme:</strong> {activeSeason.theme}
          <div style={{ marginTop: '0.4rem', color: '#475569', fontSize: '0.9rem' }}>
            {activeSeason.spiritualMeaning}
          </div>
        </div>

        {/* Biblical Anchor Quote */}
        <div
          style={{
            background: activeSeason.badgeBg,
            borderLeft: `4px solid ${activeSeason.colorHex}`,
            borderRadius: '0 8px 8px 0',
            padding: '10px 14px',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
            fontStyle: 'italic',
            color: activeSeason.badgeText,
            lineHeight: 1.5,
          }}
        >
          {activeSeason.biblicalAnchor}
        </div>

        {/* Grid: Key Events & Sacred Traditions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Key Events */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.1rem',
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
              🌟 Major Feasts &amp; Holy Days
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
              {activeSeason.keyEvents.map((evt, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>
                  {evt}
                </li>
              ))}
            </ul>
          </div>

          {/* Catholic Traditions */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.1rem',
            }}
          >
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
              🕯️ Catholic Devotions &amp; Customs
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.84rem', color: '#334155', lineHeight: 1.6 }}>
              {activeSeason.traditions.map((trad, idx) => (
                <li key={idx} style={{ marginBottom: '4px' }}>
                  {trad}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Eucharistic Connection Box */}
        <div
          style={{
            background: '#fefce8',
            border: '1px solid #fef08a',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '0.88rem',
            color: '#854d0e',
            lineHeight: 1.5,
          }}
        >
          🍞 <strong>First Holy Communion &amp; Eucharistic Connection:</strong>{' '}
          {activeSeason.connectionToEucharist}
        </div>

        <div style={{ marginTop: '0.8rem', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
          Catechism Reference: {activeSeason.catechismRef}
        </div>
      </div>

      {/* Interactive Liturgical Calendar Challenge Quiz */}
      <div
        style={{
          background: '#ffffff',
          border: '2px solid #e0e7ff',
          borderRadius: '16px',
          padding: '1.75rem',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#4338ca' }}>
              Liturgical Season Knowledge Check
            </span>
            <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Easter &amp; Liturgical Calendar Mastery Quiz
            </h3>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4338ca' }}>
            Score: {score} / {QUIZ.length}
          </div>
        </div>

        {!isFinished ? (
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Question {quizIndex + 1} of {QUIZ.length}
            </div>

            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              {QUIZ[quizIndex].q}
            </p>

            <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {QUIZ[quizIndex].options.map((opt) => {
                let btnBg = '#f8fafc';
                let btnBorder = '1px solid #cbd5e1';
                let btnColor = '#0f172a';

                if (selectedOption !== null) {
                  if (opt === QUIZ[quizIndex].answer) {
                    btnBg = '#dcfce7';
                    btnBorder = '2px solid #15803d';
                    btnColor = '#14532d';
                  } else if (opt === selectedOption) {
                    btnBg = '#fee2e2';
                    btnBorder = '2px solid #b91c1c';
                    btnColor = '#7f1d1d';
                  }
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => handleOptionClick(opt)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: btnBorder,
                      background: btnBg,
                      color: btnColor,
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      textAlign: 'left',
                      cursor: selectedOption !== null ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.85rem', color: selectedOption === QUIZ[quizIndex].answer ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                  {selectedOption === QUIZ[quizIndex].answer
                    ? '🎉 Correct! Well done!'
                    : `💡 Keep learning: The answer is "${QUIZ[quizIndex].answer}".`}
                </div>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#4338ca',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {quizIndex + 1 < QUIZ.length ? 'Next Question ➡️' : 'See Results 🏆'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Quiz Completed!
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.25rem' }}>
              You scored <strong>{score} out of {QUIZ.length}</strong> on the Catholic Liturgical Seasons &amp; Easter!
              {score === QUIZ.length
                ? ' Outstanding! You have mastered the seasons, feasts, and sacred vestment colours of the Church.'
                : ' Good work! Continue learning the seasons and feasts of the Church Year above.'}
            </p>
            <button
              type="button"
              onClick={handleRestart}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#4338ca',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              🔄 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
