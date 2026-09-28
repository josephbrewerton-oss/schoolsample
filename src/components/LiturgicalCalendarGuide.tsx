import React, { useState } from 'react';
import { speakInLanguage } from '../engine/translationService';

import {
  LITURGICAL_SEASONS,
  LITURGICAL_QUIZ_QUESTIONS,
  getCurrentSeasonByDate,
  LiturgicalSeason,
} from '../data/catholic';

export { LITURGICAL_SEASONS, getCurrentSeasonByDate };
export type { LiturgicalSeason };

export default function LiturgicalCalendarGuide(): React.JSX.Element {
  const currentSeason = getCurrentSeasonByDate();
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(currentSeason.id);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const QUIZ = LITURGICAL_QUIZ_QUESTIONS;

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
