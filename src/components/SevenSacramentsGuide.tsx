import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';

import {
  SEVEN_SACRAMENTS,
  SACRAMENTS_QUIZ_QUESTIONS,
  SacramentData,
} from '../data/catholic';

export { SEVEN_SACRAMENTS };
export type { SacramentData };

export default function SevenSacramentsGuide(): React.JSX.Element {
  const [filterCategory, setFilterCategory] = useState<'All' | 'Initiation' | 'Healing' | 'Service'>('All');
  const [selectedSacramentId, setSelectedSacramentId] = useState<string>('eucharist');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const QUIZ_QUESTIONS = SACRAMENTS_QUIZ_QUESTIONS;

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

        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#ffffff' }}>
          The Seven Holy Sacraments of the Church
        </h2>

        <p style={{ margin: 0, fontSize: '0.95rem', color: '#e0e7ff', maxWidth: '820px', lineHeight: 1.6 }}>
          A sacrament is an outward sign instituted by Jesus Christ to give us inward sanctifying grace. 
          The Catholic Church celebrates seven holy sacraments in three groups: 
          <strong> Christian Initiation</strong> (Baptism, Confirmation, Holy Eucharist), 
          <strong> Healing</strong> (Penance &amp; Reconciliation, Anointing of the Sick), and 
          <strong> Service of Communion</strong> (Holy Orders, Holy Matrimony).
        </p>

        <button
          type="button"
          onClick={() => handleListen('A sacrament is an outward sign instituted by Jesus Christ to give inward sanctifying grace. The Catholic Church celebrates seven sacraments: Baptism, Confirmation, Holy Eucharist, Penance and Reconciliation, Anointing of the Sick, Holy Orders, and Holy Matrimony.')}
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
          🕊️ Initiation (Baptism, Confirmation, Eucharist)
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
          🌿 Healing (Reconciliation &amp; Anointing of the Sick)
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
          💍 Service of Communion (Holy Orders &amp; Matrimony)
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
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {sacrament.name}
                    </h3>
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

              {/* Expanded Biblical Anchor, Minister, & Effects when Selected */}
              {isSelected && (
                <div
                  style={{
                    background: '#f0f4ff',
                    border: '1px solid #c7d2fe',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '0.8rem',
                    color: '#1e1b4b',
                    lineHeight: 1.45,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div>
                    📖 <strong>Sacred Scripture Anchor:</strong> <em>{sacrament.biblicalAnchor}</em>
                  </div>
                  <div>
                    👤 <strong>Ordinary Minister:</strong> {sacrament.minister}
                  </div>
                  <div>
                    ✨ <strong>Sacramental Grace / Effect:</strong> {sacrament.effect}
                  </div>
                </div>
              )}

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
            <h3 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              The Seven Sacraments Mastery Quiz
            </h3>
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
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
              Quiz Completed!
            </h3>
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
