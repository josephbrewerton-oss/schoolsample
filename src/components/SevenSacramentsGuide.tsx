import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';

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

export default function SevenSacramentsGuide(): React.JSX.Element {
  const [filterCategory, setFilterCategory] = useState<'All' | 'Initiation' | 'Healing' | 'Service'>('All');
  const [selectedSacramentId, setSelectedSacramentId] = useState<string>('eucharist');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const QUIZ_QUESTIONS = [
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
    }
  ];

  const filteredSacraments = filterCategory === 'All'
    ? SEVEN_SACRAMENTS
    : SEVEN_SACRAMENTS.filter((s) => s.category === filterCategory);

  const activeSacrament = SEVEN_SACRAMENTS.find((s) => s.id === selectedSacramentId) || SEVEN_SACRAMENTS[0];

  const handleListen = (text: string) => {
    speakInLanguage(text, 'en');
  };

  const handleQuizAnswer = (option: string) => {
    if (quizAnswerSelected !== null) return;
    setQuizAnswerSelected(option);
    if (option === QUIZ_QUESTIONS[quizIndex].correct) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (quizIndex + 1 < QUIZ_QUESTIONS.length) {
      setQuizIndex((prev) => prev + 1);
      setQuizAnswerSelected(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setQuizAnswerSelected(null);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {/* Intro Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '1.75rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 14px rgba(49, 46, 129, 0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>✝️</span>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '2px 8px',
              borderRadius: '9999px',
            }}
          >
            Catholic Catechism (CCC 1210-1666)
          </span>
        </div>

        <h3 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
          The Seven Holy Sacraments of the Church
        </h3>

        <p style={{ margin: 0, fontSize: '0.95rem', color: '#e0e7ff', maxWidth: '780px', lineHeight: 1.6 }}>
          A sacrament is an outward sign instituted by Jesus Christ to give us inward sanctifying grace. 
          Discover all seven sacraments and see how each one prepares, surrounds, and enriches your encounter with Jesus in the <strong>Holy Eucharist</strong>!
        </p>

        <button
          type="button"
          onClick={() => handleListen('A sacrament is an outward sign instituted by Jesus Christ to give inward sanctifying grace. The Catholic Church celebrates seven sacraments.')}
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
          <span>Listen Catechism Definition</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setFilterCategory('All')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: filterCategory === 'All' ? '2px solid #4338ca' : '1px solid #cbd5e1',
            background: filterCategory === 'All' ? '#e0e7ff' : '#ffffff',
            color: filterCategory === 'All' ? '#312e81' : '#475569',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          All 7 Sacraments
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('Initiation')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: filterCategory === 'Initiation' ? '2px solid #15803d' : '1px solid #cbd5e1',
            background: filterCategory === 'Initiation' ? '#dcfce7' : '#ffffff',
            color: filterCategory === 'Initiation' ? '#14532d' : '#475569',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          🕊️ Christian Initiation (3)
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('Healing')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: filterCategory === 'Healing' ? '2px solid #b45309' : '1px solid #cbd5e1',
            background: filterCategory === 'Healing' ? '#fef3c7' : '#ffffff',
            color: filterCategory === 'Healing' ? '#78350f' : '#475569',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          🌿 Sacraments of Healing (2)
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('Service')}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            border: filterCategory === 'Service' ? '2px solid #0284c7' : '1px solid #cbd5e1',
            background: filterCategory === 'Service' ? '#e0f2fe' : '#ffffff',
            color: filterCategory === 'Service' ? '#075985' : '#475569',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          💍 Service &amp; Mission (2)
        </button>
      </div>

      {/* Grid of Sacraments */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}
      >
        {filteredSacraments.map((sacrament) => {
          const isSelected = sacrament.id === selectedSacramentId;
          const categoryColors = {
            Initiation: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
            Healing: { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
            Service: { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' },
          }[sacrament.category];

          return (
            <div
              key={sacrament.id}
              onClick={() => setSelectedSacramentId(sacrament.id)}
              style={{
                background: '#ffffff',
                border: isSelected ? '2px solid #4338ca' : '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1.25rem',
                cursor: 'pointer',
                boxShadow: isSelected ? '0 6px 16px rgba(67, 56, 202, 0.12)' : '0 2px 6px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '2rem' }}>{sacrament.icon}</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {sacrament.name}
                    </h4>
                    <span style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#64748b' }}>
                      Latin: {sacrament.latinName}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: categoryColors.bg,
                    color: categoryColors.text,
                    border: `1px solid ${categoryColors.border}`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sacrament.category}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.5 }}>
                {sacrament.summary}
              </p>

              {/* Matter & Form Box */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '0.78rem',
                  lineHeight: 1.45,
                }}
              >
                <div style={{ color: '#0f172a', fontWeight: 600 }}>
                  💧 <strong>Sign (Matter):</strong> {sacrament.matterAndForm.matter}
                </div>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>
                  🗣️ <strong>Words (Form):</strong> <span style={{ fontStyle: 'italic' }}>{sacrament.matterAndForm.form}</span>
                </div>
              </div>

              {/* Connection to First Communion */}
              <div
                style={{
                  background: '#fefce8',
                  border: '1px solid #fef08a',
                  borderRadius: '8px',
                  padding: '8px 10px',
                  fontSize: '0.8rem',
                  color: '#854d0e',
                  lineHeight: 1.4,
                }}
              >
                ⭐ <strong>Connection to First Communion:</strong> {sacrament.connectionToFirstCommunion}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '4px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                  {sacrament.catechismRef}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleListen(`${sacrament.name}. ${sacrament.summary}. For First Communion: ${sacrament.connectionToFirstCommunion}`);
                  }}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
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
          );
        })}
      </div>

      {/* Interactive 7 Sacraments Challenge Quiz */}
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
              First Communion Catechism Check
            </span>
            <h4 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              The Seven Sacraments Mastery Quiz
            </h4>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4338ca' }}>
            Score: {quizScore} / {QUIZ_QUESTIONS.length}
          </div>
        </div>

        {!quizCompleted ? (
          <div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
              Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}
            </div>

            <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.25rem' }}>
              {QUIZ_QUESTIONS[quizIndex].question}
            </p>

            <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {QUIZ_QUESTIONS[quizIndex].options.map((option) => {
                let btnBg = '#f8fafc';
                let btnBorder = '1px solid #cbd5e1';
                let btnColor = '#0f172a';

                if (quizAnswerSelected !== null) {
                  if (option === QUIZ_QUESTIONS[quizIndex].correct) {
                    btnBg = '#dcfce7';
                    btnBorder = '2px solid #15803d';
                    btnColor = '#14532d';
                  } else if (option === quizAnswerSelected) {
                    btnBg = '#fee2e2';
                    btnBorder = '2px solid #b91c1c';
                    btnColor = '#7f1d1d';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={quizAnswerSelected !== null}
                    onClick={() => handleQuizAnswer(option)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: btnBorder,
                      background: btnBg,
                      color: btnColor,
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      textAlign: 'left',
                      cursor: quizAnswerSelected !== null ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {quizAnswerSelected !== null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: quizAnswerSelected === QUIZ_QUESTIONS[quizIndex].correct ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                  {quizAnswerSelected === QUIZ_QUESTIONS[quizIndex].correct
                    ? '🎉 Correct! Well done!'
                    : `💡 Keep learning: The answer is ${QUIZ_QUESTIONS[quizIndex].correct}.`}
                </div>

                <button
                  type="button"
                  onClick={handleNextQuizQuestion}
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
                  {quizIndex + 1 < QUIZ_QUESTIONS.length ? 'Next Question ➡️' : 'See Results 🏆'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
            <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Quiz Completed!
            </h4>
            <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '1.25rem' }}>
              You scored <strong>{quizScore} out of {QUIZ_QUESTIONS.length}</strong> on The Seven Sacraments.
              {quizScore === QUIZ_QUESTIONS.length
                ? ' Amazing! You are fully prepared to understand the Holy Sacraments of the Church!'
                : ' Great effort! Review the cards above to master all seven sacraments.'}
            </p>
            <button
              type="button"
              onClick={handleRestartQuiz}
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
