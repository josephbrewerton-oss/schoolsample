import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';
import {
  playSuccessChime,
  playIncorrectTone,
  playClickTone,
  triggerHapticSuccess,
  triggerHapticError,
  triggerHapticClick,
} from '../services/soundHaptics';

export interface CreedArticle {
  number: number;
  article: string;
  latinExcerpt: string;
  mystery: string;
  theologicalPillar: 'The Father & Creation' | 'The Son & Redemption' | 'The Holy Spirit & The Church';
  catechismRef: string;
  scriptureRef: string;
  rciaExplanation: string;
}

const CREED_ARTICLES: CreedArticle[] = [
  {
    number: 1,
    article: 'I believe in God, the Father almighty, Creator of heaven and earth,',
    latinExcerpt: 'Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae,',
    mystery: 'God is our loving Father and Creator of all that exists.',
    theologicalPillar: 'The Father & Creation',
    catechismRef: 'CCC 198-231',
    scriptureRef: 'Genesis 1:1; Matthew 6:9',
    rciaExplanation: 'Saying "I believe" means putting all our trust in God’s loving hands. God is our caring Father who created everything around us — the twinkling stars, mountains, oceans, animals, and you!'
  },
  {
    number: 2,
    article: 'and in Jesus Christ, his only Son, our Lord,',
    latinExcerpt: 'et in Iesum Christum, Filium eius unicum, Dominum nostrum,',
    mystery: 'Jesus is God’s only Son, our loving Lord and Saviour.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 441-451',
    scriptureRef: 'John 1:1-14; Philippians 2:11',
    rciaExplanation: '"Jesus" means "God saves." "Christ" means the Chosen One. Calling Jesus our "Lord" means we choose to follow Him, listen to His words, and love everyone like He does.'
  },
  {
    number: 3,
    article: 'who was conceived by the Holy Spirit, born of the Virgin Mary,',
    latinExcerpt: 'qui conceptus est de Spiritu Sancto, natus ex Maria Virgine,',
    mystery: 'Jesus became a real human child through Mary and the Holy Spirit.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 484-507',
    scriptureRef: 'Luke 1:35; Matthew 1:20',
    rciaExplanation: 'Jesus came into our world as a real baby boy. Our Blessed Mother Mary said a joyful "Yes" to God, and the Holy Spirit made Jesus human while remaining truly God.'
  },
  {
    number: 4,
    article: 'suffered under Pontius Pilate, was crucified, died and was buried;',
    latinExcerpt: 'passus sub Pontio Pilato, crucifixus, mortuus, et sepultus,',
    mystery: 'Jesus gave His life on Good Friday out of supreme love for us.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 571-623',
    scriptureRef: 'Mark 15:15-37; 1 Peter 2:24',
    rciaExplanation: 'Pontius Pilate was a real Roman governor, proving this happened in real history. Jesus loved us so much that He died on the Cross on Good Friday, forgiving those who hurt Him and washing away our sins.'
  },
  {
    number: 5,
    article: 'he descended into hell; on the third day he rose again from the dead;',
    latinExcerpt: 'descendit ad inferos; tertia die resurrexit a mortuis;',
    mystery: 'Jesus rose victorious from the dead on Easter Sunday!',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 631-658',
    scriptureRef: '1 Peter 3:18-19; 1 Corinthians 15:3-4',
    rciaExplanation: 'Jesus visited all the holy people who had died before Him to lead them into heaven. Then, on Easter Sunday morning, He rose from the dead alive and victorious! Death has no power over Jesus.'
  },
  {
    number: 6,
    article: 'he ascended into heaven, and is seated at the right hand of God the Father almighty;',
    latinExcerpt: 'ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis,',
    mystery: 'Jesus returned to heaven in glory, always caring for us.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 659-667',
    scriptureRef: 'Acts 1:9-11; Hebrews 1:3',
    rciaExplanation: 'Jesus ascended to heaven to prepare a wonderful home for us. He sits beside God our Father, listening to every little prayer we whisper from our bedrooms and classrooms.'
  },
  {
    number: 7,
    article: 'from there he will come to judge the living and the dead.',
    latinExcerpt: 'inde venturus est iudicare vivos et mortuos.',
    mystery: 'Jesus will return one day to bring fairness, peace, and eternal joy.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 668-682',
    scriptureRef: 'Matthew 25:31-46; 2 Timothy 4:1',
    rciaExplanation: 'One day Jesus will return in glory. He will look at how we treated others — especially the lonely, hungry, or sad — and His love will make all things right.'
  },
  {
    number: 8,
    article: 'I believe in the Holy Spirit,',
    latinExcerpt: 'Credo in Spiritum Sanctum,',
    mystery: 'The Holy Spirit is God’s gentle, powerful Helper inside our hearts.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 683-747',
    scriptureRef: 'John 14:26; Acts 2:1-4',
    rciaExplanation: 'The Holy Spirit is the Third Person of the Holy Trinity. He lives quietly in our hearts, giving us bravery when we are scared, good ideas, and peace to choose the right path.'
  },
  {
    number: 9,
    article: 'the holy catholic Church, the communion of saints,',
    latinExcerpt: 'sanctam Ecclesiam catholicam, sanctorum communionem,',
    mystery: 'We are one worldwide family connected to the saints in heaven.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 748-975',
    scriptureRef: 'Ephesians 4:4-6; Hebrews 12:1',
    rciaExplanation: '"Catholic" means universal — open to every person in every country! "Communion of saints" means we are all linked together: people on earth, holy souls, and the saints in heaven cheering us on!'
  },
  {
    number: 10,
    article: 'the forgiveness of sins,',
    latinExcerpt: 'remissionem peccatorum,',
    mystery: 'Jesus washes away all our mistakes through Baptism and Confession.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 976-987',
    scriptureRef: 'John 20:22-23; Matthew 28:19',
    rciaExplanation: 'Whenever we make a slip and say sorry to God, Jesus forgives us completely. Through Baptism and Confession, God wipes the slate clean and gives us a fresh, happy start.'
  },
  {
    number: 11,
    article: 'the resurrection of the body,',
    latinExcerpt: 'carnis resurrectionem,',
    mystery: 'God loves our bodies and souls, and we will rise with Jesus.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 988-1019',
    scriptureRef: '1 Corinthians 15:42-44; John 6:40',
    rciaExplanation: 'God made our bodies as well as our souls. Because Jesus rose from the dead with a glorious body, we believe that after this life, God will raise us up to live forever with Him.'
  },
  {
    number: 12,
    article: 'and life everlasting. Amen.',
    latinExcerpt: 'vitam aeternam. Amen.',
    mystery: 'Heaven is our forever home of eternal joy, peace, and love.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 1020-1065',
    scriptureRef: 'Revelation 21:1-4; 1 John 3:2',
    rciaExplanation: 'In heaven, there is no more crying, illness, or sadness — only pure joy, friendship with the angels and saints, and endless happiness with Jesus. "Amen" means: "Yes, I believe it with all my heart!"'
  }
];

export default function CreedExplorer() {
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0);
  const [creedQuizScore, setCreedQuizScore] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<Record<number, boolean>>({});
  const [filterPillar, setFilterPillar] = useState<'All' | 'The Father & Creation' | 'The Son & Redemption' | 'The Holy Spirit & The Church'>('All');

  const active = CREED_ARTICLES[selectedArticleIndex];

  const filteredArticles = filterPillar === 'All'
    ? CREED_ARTICLES
    : CREED_ARTICLES.filter(a => a.theologicalPillar === filterPillar);

  const handleSelect = (index: number) => {
    playClickTone();
    triggerHapticClick();
    setSelectedArticleIndex(index);
  };

  const handleListen = (text: string) => {
    speakInLanguage(text, 'en');
  };

  // Quick 3-Question Knowledge Check for RCIA
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      question: 'Why does the Creed specifically name "Pontius Pilate"?',
      options: [
        'To honour the Roman Empire for their judicial system.',
        'To anchor the death and resurrection of Jesus in verifiable human history.',
        'Because Pilate converted to Christianity before the crucifixion.',
        'To indicate that Jesus only died under Roman law, not Jewish law.'
      ],
      correctIndex: 1,
      rationale: 'Naming Pontius Pilate demonstrates that the Gospel is not mythology or fable, but an actual historical event occurring in first-century Judea.'
    },
    {
      id: 2,
      question: 'What is meant by the phrase "the communion of saints"?',
      options: [
        'Only canonized saints officially recognized in Rome.',
        'The physical distribution of Holy Communion during Mass.',
        'The spiritual solidarity uniting believers on earth, souls in Purgatory, and saints in Heaven.',
        'A special meeting of parish priests and bishops.'
      ],
      correctIndex: 2,
      rationale: 'The communion of saints binds the Church Militant (earth), Church Suffering (Purgatory), and Church Triumphant (Heaven) into one Body of Christ.'
    },
    {
      id: 3,
      question: 'What does the word "Catholic" mean in the Creed?',
      options: [
        'Strictly located in the city of Rome.',
        'Universal, whole, and possessing the fullness of Christ\'s truth and means of salvation.',
        'Written in Latin rather than Greek or Hebrew.',
        'Founded in the Middle Ages.'
      ],
      correctIndex: 1,
      rationale: 'From the Greek "katholikos" meaning "universal according to the whole", the Church preserves the fullness of revelation and is sent to all peoples across all ages.'
    }
  ];

  return (
    <div style={{ padding: '1.25rem', background: 'var(--stj-surface)', color: 'var(--stj-text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.75rem' }}>📜</span>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--stj-primary)' }}>
              The Apostles&apos; Creed: What We Believe
            </h2>
            <span className="stj-badge stj-badge-primary">For All Ages &bull; Whole School</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--stj-text-muted)', maxWidth: '750px', lineHeight: 1.5 }}>
            The 12 Articles of the Apostles&apos; Creed tell the story of God&apos;s love for us. Explore each belief, what it means for our lives, and its scripture roots.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleListen(`Article ${active.number}: ${active.article}. ${active.rciaExplanation}`)}
          className="stj-btn stj-btn-secondary"
          style={{ minHeight: '38px', padding: '4px 14px', fontSize: '0.82rem' }}
        >
          <span>🔊</span>
          <span>Listen to Article {active.number}</span>
        </button>
      </div>

      {/* Filter by Trinitarian Pillar */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {(['All', 'The Father & Creation', 'The Son & Redemption', 'The Holy Spirit & The Church'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => {
              playClickTone();
              setFilterPillar(p);
            }}
            className={`stj-btn ${filterPillar === p ? 'stj-btn-primary' : 'stj-btn-secondary'}`}
            style={{ fontSize: '0.82rem', padding: '4px 12px', minHeight: '34px' }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Articles List and Detailed Exposition */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {/* Left Column: List of 12 Articles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredArticles.map((art) => {
            const isSelected = art.number === active.number;
            return (
              <button
                key={art.number}
                type="button"
                onClick={() => handleSelect(art.number - 1)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--stj-radius-md)',
                  border: `2px solid ${isSelected ? 'var(--stj-primary)' : 'var(--stj-border)'}`,
                  background: isSelected ? 'var(--stj-primary-surface)' : 'var(--stj-canvas)',
                  color: 'var(--stj-text)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    background: isSelected ? 'var(--stj-primary)' : 'var(--stj-border)',
                    color: isSelected ? '#ffffff' : 'var(--stj-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {art.number}
                </span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '2px' }}>
                    {art.article}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--stj-text-muted)', fontStyle: 'italic' }}>
                    {art.latinExcerpt}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Article Deep-Dive */}
        <div
          className="stj-card"
          style={{
            border: '2px solid var(--stj-primary)',
            background: 'var(--stj-canvas)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="stj-badge stj-badge-primary">Article {active.number} of 12</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--stj-primary)' }}>
                {active.theologicalPillar}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px 0', lineHeight: 1.4 }}>
              &ldquo;{active.article}&rdquo;
            </h3>

            <div style={{ padding: '8px 12px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-sm)', marginBottom: '1rem', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--stj-text-muted)' }}>
              Latin: {active.latinExcerpt}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--stj-primary)', marginBottom: '4px' }}>
                💡 What This Means For Us:
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--stj-text)' }}>
                {active.rciaExplanation}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.8rem' }}>
              <div style={{ padding: '4px 10px', background: 'var(--stj-surface)', borderRadius: '6px', border: '1px solid var(--stj-border)' }}>
                📖 <strong>Scripture:</strong> {active.scriptureRef}
              </div>
              <div style={{ padding: '4px 10px', background: 'var(--stj-surface)', borderRadius: '6px', border: '1px solid var(--stj-border)' }}>
                🏛️ <strong>Catechism:</strong> {active.catechismRef}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              disabled={selectedArticleIndex === 0}
              onClick={() => handleSelect(selectedArticleIndex - 1)}
              className="stj-btn stj-btn-secondary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              ← Previous Article
            </button>
            <button
              type="button"
              disabled={selectedArticleIndex === CREED_ARTICLES.length - 1}
              onClick={() => handleSelect(selectedArticleIndex + 1)}
              className="stj-btn stj-btn-primary"
              style={{ fontSize: '0.82rem', padding: '6px 14px' }}
            >
              Next Article →
            </button>
          </div>
        </div>
      </div>

      {/* RCIA Creed Formation Check */}
      <div className="stj-card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 2px 0' }}>
              🎯 RCIA Diagnostic: Testing Core Doctrines of the Creed
            </h3>
            <div style={{ fontSize: '0.82rem', color: 'var(--stj-text-muted)' }}>
              Check your doctrinal understanding of the Creed.
            </div>
          </div>
          <span className="stj-badge stj-badge-success">
            Score: {creedQuizScore} / {QUIZ_QUESTIONS.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {QUIZ_QUESTIONS.map((q) => {
            const hasAnswered = quizAnswered[q.id] !== undefined;
            return (
              <div key={q.id} style={{ padding: '0.9rem', background: 'var(--stj-canvas)', borderRadius: 'var(--stj-radius-md)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.5rem' }}>
                  {q.id}. {q.question}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
                  {q.options.map((opt, oIdx) => (
                    <button
                      key={opt}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => {
                        const isCorrect = oIdx === q.correctIndex;
                        setQuizAnswered((prev) => ({ ...prev, [q.id]: isCorrect }));
                        if (isCorrect) {
                          setCreedQuizScore((s) => s + 1);
                          playSuccessChime();
                          triggerHapticSuccess();
                        } else {
                          playIncorrectTone();
                          triggerHapticError();
                        }
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--stj-radius-sm)',
                        border: '1px solid var(--stj-border)',
                        background: hasAnswered
                          ? oIdx === q.correctIndex
                            ? 'var(--stj-success-surface)'
                            : 'var(--stj-surface)'
                          : 'var(--stj-surface)',
                        color: 'var(--stj-text)',
                        textAlign: 'left',
                        fontSize: '0.84rem',
                        cursor: hasAnswered ? 'default' : 'pointer',
                        fontWeight: oIdx === q.correctIndex && hasAnswered ? 700 : 400,
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {hasAnswered && (
                  <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--stj-text-muted)', lineHeight: 1.4 }}>
                    💡 <em>{q.rationale}</em>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
