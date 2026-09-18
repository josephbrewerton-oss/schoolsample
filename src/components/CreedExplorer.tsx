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
    mystery: 'God is the Origin of all reality, loving Father, omnipotent and eternal.',
    theologicalPillar: 'The Father & Creation',
    catechismRef: 'CCC 198-231',
    scriptureRef: 'Genesis 1:1; Matthew 6:9',
    rciaExplanation: 'To say "I believe" is an act of total trust and self-giving. God is not an impersonal cosmic force, but our loving Father who spoke all visible and invisible creation into being ex nihilo (out of nothing).'
  },
  {
    number: 2,
    article: 'and in Jesus Christ, his only Son, our Lord,',
    latinExcerpt: 'et in Iesum Christum, Filium eius unicum, Dominum nostrum,',
    mystery: 'Jesus is True God from True God, co-eternal with the Father.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 441-451',
    scriptureRef: 'John 1:1-14; Philippians 2:11',
    rciaExplanation: '"Jesus" means "God saves." "Christ" is the Messiah, the Anointed One. Calling Him "Lord" (Kyrios) proclaims His absolute divinity and our allegiance to Him over any earthly power.'
  },
  {
    number: 3,
    article: 'who was conceived by the Holy Spirit, born of the Virgin Mary,',
    latinExcerpt: 'qui conceptus est de Spiritu Sancto, natus ex Maria Virgine,',
    mystery: 'The Incarnation: The eternal Word took on true human flesh for our salvation.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 484-507',
    scriptureRef: 'Luke 1:35; Matthew 1:20',
    rciaExplanation: 'Through Mary\'s generous "Fiat" (let it be done), God became man without ceasing to be God. Mary is honoured as Theotokos (God-bearer) and perpetual Virgin, our mother in faith.'
  },
  {
    number: 4,
    article: 'suffered under Pontius Pilate, was crucified, died and was buried;',
    latinExcerpt: 'passus sub Pontio Pilato, crucifixus, mortuus, et sepultus,',
    mystery: 'The Paschal Mystery: Christ bore the weight of human sin in sacrificial love.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 571-623',
    scriptureRef: 'Mark 15:15-37; 1 Peter 2:24',
    rciaExplanation: 'The mention of Pontius Pilate anchors Christianity firmly in real human history. Jesus truly died on the Cross, offering the supreme sacrifice that reconciles humanity to God.'
  },
  {
    number: 5,
    article: 'he descended into hell; on the third day he rose again from the dead;',
    latinExcerpt: 'descendit ad inferos; tertia die resurrexit a mortuis;',
    mystery: 'The Harrowing of Hades and the Victory of the Resurrection.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 631-658',
    scriptureRef: '1 Peter 3:18-19; 1 Corinthians 15:3-4',
    rciaExplanation: '"Descended into hell" (Sheol) means Christ entered the realm of the dead to free the righteous souls who awaited Him. His bodily Resurrection is the crowning proof of His divinity and our promise of eternal life.'
  },
  {
    number: 6,
    article: 'he ascended into heaven, and is seated at the right hand of God the Father almighty;',
    latinExcerpt: 'ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis,',
    mystery: 'Christ in Glory as eternal High Priest and King of the Universe.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 659-667',
    scriptureRef: 'Acts 1:9-11; Hebrews 1:3',
    rciaExplanation: 'Humanity, through the glorified body of Christ, is raised into the inner life of the Holy Trinity. Jesus sits at the Father\'s right hand as our eternal mediator and intercessor.'
  },
  {
    number: 7,
    article: 'from there he will come to judge the living and the dead.',
    latinExcerpt: 'inde venturus est iudicare vivos et mortuos.',
    mystery: 'The Parousia (Second Coming) and final triumph of Divine Justice.',
    theologicalPillar: 'The Son & Redemption',
    catechismRef: 'CCC 668-682',
    scriptureRef: 'Matthew 25:31-46; 2 Timothy 4:1',
    rciaExplanation: 'History is heading toward a glorious culmination. Christ will return in glory to judge all hearts according to truth, mercy, and our love shown to the least among us.'
  },
  {
    number: 8,
    article: 'I believe in the Holy Spirit,',
    latinExcerpt: 'Credo in Spiritum Sanctum,',
    mystery: 'The Third Person of the Trinity, Lord and Giver of Life.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 683-747',
    scriptureRef: 'John 14:26; Acts 2:1-4',
    rciaExplanation: 'The Holy Spirit proceeds from the Father and the Son, adored and glorified. He animates, inspires, and guides the Church, sanctifying believers through grace and the Sacraments.'
  },
  {
    number: 9,
    article: 'the holy catholic Church, the communion of saints,',
    latinExcerpt: 'sanctam Ecclesiam catholicam, sanctorum communionem,',
    mystery: 'The Mystical Body of Christ and the fellowship of all believers across time.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 748-975',
    scriptureRef: 'Ephesians 4:4-6; Hebrews 12:1',
    rciaExplanation: '"Catholic" means universal and complete. The Church is One, Holy, Catholic, and Apostolic. The Communion of Saints unites the Church Militant (on earth), Suffering (in Purgatory), and Triumphant (in Heaven).'
  },
  {
    number: 10,
    article: 'the forgiveness of sins,',
    latinExcerpt: 'remissionem peccatorum,',
    mystery: 'Sacramental grace through Baptism and Reconciliation.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 976-987',
    scriptureRef: 'John 20:22-23; Matthew 28:19',
    rciaExplanation: 'Christ gave His Apostles the power to forgive sins in His Name ("Whose sins you forgive, they are forgiven"). No sin is beyond the boundless ocean of divine mercy.'
  },
  {
    number: 11,
    article: 'the resurrection of the body,',
    latinExcerpt: 'carnis resurrectionem,',
    mystery: 'Our physical bodies will be raised incorruptible on the Last Day.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 988-1019',
    scriptureRef: '1 Corinthians 15:42-44; John 6:40',
    rciaExplanation: 'We are not spirits trapped in machines; body and soul form a single unity. In the final resurrection, our bodies will be reunited with our souls, transformed and glorified like Christ\'s.'
  },
  {
    number: 12,
    article: 'and life everlasting. Amen.',
    latinExcerpt: 'vitam aeternam. Amen.',
    mystery: 'The Beatific Vision: Eternal communion with God in Heaven.',
    theologicalPillar: 'The Holy Spirit & The Church',
    catechismRef: 'CCC 1020-1065',
    scriptureRef: 'Revelation 21:1-4; 1 John 3:2',
    rciaExplanation: 'Heaven is the ultimate end and fulfillment of deepest human longings. "Amen" means "I believe it! So be it!" sealing our personal surrender to the living God.'
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
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--stj-primary)' }}>
              Pillar 1: The Apostles&apos; Creed Interactive Explorer
            </h3>
            <span className="stj-badge stj-badge-primary">RCIA Foundational</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--stj-text-muted)', maxWidth: '750px', lineHeight: 1.5 }}>
            The 12 Articles of the Apostles&apos; Creed form the rule of faith handed down from the Apostles. Explore each article, its scriptural roots, and its theological meaning for adult initiation.
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

            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 8px 0', lineHeight: 1.4 }}>
              &ldquo;{active.article}&rdquo;
            </h4>

            <div style={{ padding: '8px 12px', background: 'var(--stj-surface)', borderRadius: 'var(--stj-radius-sm)', marginBottom: '1rem', fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--stj-text-muted)' }}>
              Latin: {active.latinExcerpt}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--stj-primary)', marginBottom: '4px' }}>
                RCIA Adult Formation Note:
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
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 2px 0' }}>
              🎯 RCIA Diagnostic: Testing Core Doctrines of the Creed
            </h4>
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
