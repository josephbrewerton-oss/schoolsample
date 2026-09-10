import React, { useState, useEffect, useMemo } from 'react';
import {
  SUPPORTED_LANGUAGES,
  getSavedLanguage,
  listenToLanguageChange,
  setSavedLanguage,
} from '../engine/operational-language';
import {
  translateQuestionData,
  translateText,
  speakInLanguage,
} from '../engine/translationService';

interface Props {
  subject: string;
  unit: string;
  prompt: string;
  displayOptions: string[];
  selectedAnswer: number | null;
  correctIndex: number | null;
  score: number;
  streak: number;
  hint?: string;
  explanation?: string;
  misconceptions?: string[];
  socraticFollowUp?: string;
  onSelectOption: (idx: number) => void;
  onNextQuestion: () => void;
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
}

export const QuestionCard: React.FC<Props> = ({
  subject,
  unit,
  prompt,
  displayOptions,
  selectedAnswer,
  correctIndex,
  score,
  streak,
  hint,
  explanation,
  misconceptions,
  socraticFollowUp,
  onSelectOption,
  onNextQuestion,
  currentLang,
  onLanguageChange,
}) => {
  const [activeLang, setActiveLang] = useState<string>(() => currentLang || getSavedLanguage());
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const [translatedData, setTranslatedData] = useState<{
    prompt: string;
    displayOptions: string[];
    hint?: string;
    explanation?: string;
    misconceptions?: string[];
    socraticFollowUp?: string;
  }>({
    prompt,
    displayOptions,
    hint,
    explanation,
    misconceptions,
    socraticFollowUp,
  });

  const [translatedFeedback, setTranslatedFeedback] = useState<{
    correct: string;
    tryAgain: string;
    nextQuestion: string;
    stars: string;
    streak: string;
  }>({
    correct: '🎉 Correct! Well done.',
    tryAgain: '💡 Not quite — check the clue below and try another choice!',
    nextQuestion: 'Next Question ➔',
    stars: 'Stars',
    streak: 'Streak',
  });

  // Sync external language prop or storage broadcast
  useEffect(() => {
    if (currentLang && currentLang !== activeLang) {
      setActiveLang(currentLang);
    }
  }, [currentLang]);

  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setActiveLang(newLang);
    });
    return unsub;
  }, []);

  // Perform translation whenever question or active language changes
  useEffect(() => {
    let cancelled = false;

    if (!activeLang || activeLang === 'en') {
      setTranslatedData({ prompt, displayOptions, hint, explanation, misconceptions, socraticFollowUp });
      setTranslatedFeedback({
        correct: '🎉 Correct! Well done.',
        tryAgain: '💡 Not quite — check the clue below and try another choice!',
        nextQuestion: 'Next Question ➔',
        stars: 'Stars',
        streak: 'Streak',
      });
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);

    Promise.all([
      translateQuestionData(
        { prompt, displayOptions, hint, explanation, misconceptions, socraticFollowUp },
        activeLang
      ),
      translateText('Correct! Well done.', activeLang),
      translateText('Not quite — check the clue below and try another choice!', activeLang),
      translateText('Next Question', activeLang),
      translateText('Stars', activeLang),
      translateText('Streak', activeLang),
    ])
      .then(([transQ, transCorrect, transTryAgain, transNext, transStars, transStreak]) => {
        if (!cancelled) {
          setTranslatedData(transQ);
          setTranslatedFeedback({
            correct: `🎉 ${transCorrect}`,
            tryAgain: `💡 ${transTryAgain}`,
            nextQuestion: `${transNext} ➔`,
            stars: transStars,
            streak: transStreak,
          });
          setIsTranslating(false);
        }
      })
      .catch((err) => {
        console.warn('[QuestionCard Translation Error]:', err);
        if (!cancelled) {
          setTranslatedData({ prompt, displayOptions, hint, explanation, misconceptions, socraticFollowUp });
          setIsTranslating(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [prompt, displayOptions, hint, explanation, misconceptions, socraticFollowUp, activeLang]);

  const isNonEnglish = activeLang && activeLang !== 'en';
  const effectivePrompt = isNonEnglish && !showOriginal ? translatedData.prompt : prompt;
  const effectiveOptions =
    isNonEnglish && !showOriginal && translatedData.displayOptions.length === displayOptions.length
      ? translatedData.displayOptions
      : displayOptions;

  const effectiveMisconceptions =
    isNonEnglish && !showOriginal && translatedData.misconceptions && translatedData.misconceptions.length === displayOptions.length
      ? translatedData.misconceptions
      : (misconceptions || []);

  const effectiveExplanation =
    isNonEnglish && !showOriginal && translatedData.explanation
      ? translatedData.explanation
      : explanation;

  const effectiveSocratic =
    isNonEnglish && !showOriginal && translatedData.socraticFollowUp
      ? translatedData.socraticFollowUp
      : (socraticFollowUp || hint);

  const currentLangMeta = SUPPORTED_LANGUAGES[activeLang] || SUPPORTED_LANGUAGES.en;
  const isResolvedCorrect = selectedAnswer !== null && selectedAnswer === correctIndex;

  const handleLangSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setActiveLang(newLang);
    setSavedLanguage(newLang);
    setShowOriginal(false);
    onLanguageChange?.(newLang);
  };

  const handleSpeak = () => {
    const text = effectivePrompt;
    const langToSpeak = isNonEnglish && !showOriginal ? activeLang : 'en';
    speakInLanguage(text, langToSpeak);
  };

  return (
    <div>
      {/* Subject, Translation Bar & Score Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '1rem',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1e3a8a', margin: 0 }}>
            {subject}: {unit}
          </h2>
        </div>

        {/* Translation Controls Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f1f5f9',
              padding: '3px 8px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
            }}
          >
            <label
              htmlFor="card-lang-select"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <span>🌐</span> Translate:
            </label>
            <select
              id="card-lang-select"
              value={activeLang}
              onChange={handleLangSelect}
              style={{
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #94a3b8',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {Object.values(SUPPORTED_LANGUAGES).map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label} ({l.nativeLabel})
                </option>
              ))}
            </select>
          </div>

          {isNonEnglish && (
            <button
              type="button"
              onClick={() => setShowOriginal(!showOriginal)}
              style={{
                background: showOriginal ? '#e0f2fe' : '#ffffff',
                color: showOriginal ? '#0284c7' : '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={showOriginal ? 'Switch to translated version' : 'Switch to original English'}
            >
              {showOriginal ? `🌐 Show ${currentLangMeta.label}` : '🇬🇧 Show Original'}
            </button>
          )}

          <button
            type="button"
            onClick={handleSpeak}
            style={{
              background: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Listen to question"
          >
            🔊 Listen
          </button>

          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#d97706', marginLeft: '8px' }}>
            ⭐ {translatedFeedback.stars}: {score} &nbsp;&nbsp; 🔥 {translatedFeedback.streak}: {streak}
          </div>
        </div>
      </div>

      {/* Translation active pill */}
      {isNonEnglish && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '1rem',
            padding: '3px 10px',
            background: showOriginal ? '#fef3c7' : '#eff6ff',
            color: showOriginal ? '#92400e' : '#1d4ed8',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            border: `1px solid ${showOriginal ? '#fde68a' : '#bfdbfe'}`,
          }}
        >
          {isTranslating ? (
            <span>⚡ Translating into {currentLangMeta.label} ({currentLangMeta.nativeLabel})...</span>
          ) : showOriginal ? (
            <span>🇬🇧 Viewing English Original (Translation to {currentLangMeta.label} available)</span>
          ) : (
            <span>🌐 Translated to {currentLangMeta.label} ({currentLangMeta.nativeLabel})</span>
          )}
        </div>
      )}

      {/* Question Prompt Stem */}
      <div
        style={{
          fontSize: '1.35rem',
          fontWeight: 700,
          color: '#0f172a',
          marginBottom: '1.75rem',
          lineHeight: 1.5,
        }}
      >
        {effectivePrompt}
      </div>

      {/* Option Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {effectiveOptions.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = idx === correctIndex;

          let bg = '#f8fafc';
          let border = '#e2e8f0';
          let textColor = '#1e293b';

          if (isSelected) {
            if (isCorrect) {
              bg = '#ecfdf5';
              border = '#10b981';
              textColor = '#065f46';
            } else {
              bg = '#fff7ed';
              border = '#f97316';
              textColor = '#9a3412';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isResolvedCorrect}
              onClick={() => onSelectOption(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                minHeight: '54px',
                padding: '0.9rem 1.25rem',
                background: bg,
                border: `2px solid ${border}`,
                borderRadius: '12px',
                cursor: isResolvedCorrect ? 'default' : 'pointer',
                textAlign: 'left',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: textColor,
                boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.06)' : '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.15s ease',
                opacity: isResolvedCorrect && !isSelected ? 0.6 : 1,
              }}
            >
              {/* Option Letter Tag */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isSelected ? border : '#e2e8f0',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + idx)}
              </span>

              {/* Option Text */}
              <span style={{ flex: 1, lineHeight: 1.4 }}>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Feedback Action Strip & Diagnostic Misconception Panel */}
      {selectedAnswer !== null && (
        <div
          style={{
            marginTop: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {isResolvedCorrect ? (
            <div
              style={{
                padding: '1rem 1.25rem',
                background: '#ecfdf5',
                border: '1px solid #10b981',
                borderRadius: '8px',
                color: '#065f46',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {translatedFeedback.correct}
              </div>
              {effectiveExplanation && (
                <div style={{ fontSize: '0.95rem', color: '#047857', lineHeight: 1.5 }}>
                  {effectiveExplanation}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                padding: '1rem 1.25rem',
                background: '#fff7ed',
                border: '1px solid #f97316',
                borderRadius: '8px',
                color: '#9a3412',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {translatedFeedback.tryAgain}
              </div>
              {effectiveMisconceptions[selectedAnswer] && (
                <div style={{ fontSize: '0.95rem', color: '#7c2d12', lineHeight: 1.5 }}>
                  <strong>💡 Understanding the error:</strong> {effectiveMisconceptions[selectedAnswer]}
                </div>
              )}
              {effectiveSocratic && (
                <div
                  style={{
                    fontSize: '0.92rem',
                    color: '#c2410c',
                    borderTop: '1px dashed #fdba74',
                    paddingTop: '6px',
                    lineHeight: 1.5,
                  }}
                >
                  <strong>🌱 Helpful Clue:</strong> {effectiveSocratic}
                </div>
              )}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <button
              type="button"
              onClick={onNextQuestion}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              {translatedFeedback.nextQuestion}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
