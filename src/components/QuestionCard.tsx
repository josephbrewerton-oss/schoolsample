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
import { ProceduralManipulative } from './ProceduralManipulative';
import { ASTKnowledgeSeed } from '../engine/seedInflationEngine';

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
  const [hintStage, setHintStage] = useState<number>(0); // 0 = hidden, 1 = conceptual nudge, 2 = step method
  const [showMentalMirror, setShowMentalMirror] = useState<boolean>(false);

  const isLanguageSubject = useMemo(() => {
    const subLower = (subject || '').toLowerCase();
    const unitLower = (unit || '').toLowerCase();
    return subLower.includes('foreign') || subLower.includes('mfl') || subLower.includes('french') || subLower.includes('spanish') || subLower.includes('latin') || unitLower.includes('french') || unitLower.includes('spanish') || unitLower.includes('latin');
  }, [subject, unit]);

  const [bilingualMode, setBilingualMode] = useState<boolean>(() => isLanguageSubject);
  const [teacherMode, setTeacherMode] = useState<boolean>(false);

  const inferredCpaType = useMemo<ASTKnowledgeSeed['cpaType'] | null>(() => {
    const combined = `${subject} ${unit} ${prompt}`.toLowerCase();
    if (combined.includes('fraction')) return 'fractions';
    if (combined.includes('circuit') || combined.includes('electric') || combined.includes('lamp') || combined.includes('battery')) return 'circuits';
    if ((combined.includes('equation') || combined.includes('reaction')) && (combined.includes('chemical') || combined.includes('balance') || combined.includes('subscript') || combined.includes('reactant') || combined.includes('h2') || combined.includes('stoich'))) return 'chemical-balance';
    if (combined.includes('equation') || combined.includes('solve for x') || combined.includes('algebra')) return 'balance-scale';
    if (combined.includes('atom') || combined.includes('nucleus') || combined.includes('electron') || combined.includes('proton')) return 'atomic';
    if (combined.includes('place value') || combined.includes('tens') || combined.includes('ones') || combined.includes('bundles of 10') || combined.includes('partition')) return 'place-value';
    if (combined.includes('ratio') || combined.includes('share') || combined.includes('parts')) return 'ratio-bar';
    if (combined.includes('negative') || combined.includes('number line') || combined.includes('direction inversion')) return 'number-line';
    if (combined.includes('photosynthesis') || combined.includes('biomass') || combined.includes('chloroplast') || combined.includes('van helmont') || combined.includes('co2')) return 'photosynthesis';
    if (combined.includes('newton') || combined.includes('thrust') || combined.includes('resistive force') || combined.includes('resultant force') || combined.includes('drag') || combined.includes('constant speed')) return 'force-vectors';
    return null;
  }, [subject, unit, prompt]);

  // Reset hint stage & mirror when prompt changes
  useEffect(() => {
    setHintStage(0);
    setShowMentalMirror(false);
  }, [prompt]);

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

  const effectiveHint =
    isNonEnglish && !showOriginal && translatedData.hint
      ? translatedData.hint
      : hint;


  const currentLangMeta = SUPPORTED_LANGUAGES[activeLang] || SUPPORTED_LANGUAGES.en;
  const isResolvedCorrect = selectedAnswer !== null && selectedAnswer === correctIndex;

  const handleLangSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setActiveLang(newLang);
    setSavedLanguage(newLang);
    setShowOriginal(false);
    onLanguageChange?.(newLang);
  };

  const handleSpeak = (customText?: string, customLang?: string) => {
    const text = customText || effectivePrompt;
    const langToSpeak = customLang || (isNonEnglish && !showOriginal ? activeLang : 'en');
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
          {isLanguageSubject && (
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                color: '#7c3aed',
                background: '#f5f3ff',
                border: '1px solid #ddd6fe',
                borderRadius: '9999px',
                padding: '2px 8px',
              }}
            >
              🗣️ Modern Foreign Languages
            </span>
          )}
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

          {/* Bilingual Dual-Language Toggle */}
          <button
            type="button"
            onClick={() => setBilingualMode(!bilingualMode)}
            style={{
              background: bilingualMode ? '#ecfdf5' : '#ffffff',
              color: bilingualMode ? '#047857' : '#475569',
              border: `1px solid ${bilingualMode ? '#a7f3d0' : '#cbd5e1'}`,
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Show both English and Target Language simultaneously for bilingual grammar and vocabulary learning"
          >
            <span>🔤</span>
            <span>{bilingualMode ? 'Dual-Language: ON' : 'Dual-Language'}</span>
          </button>

          {/* Teacher Mode Diagnostic Error Challenge Toggle */}
          <button
            type="button"
            onClick={() => setTeacherMode(!teacherMode)}
            style={{
              background: teacherMode ? '#faf5ff' : '#ffffff',
              color: teacherMode ? '#7e22ce' : '#475569',
              border: `1px solid ${teacherMode ? '#d8b4fe' : '#cbd5e1'}`,
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Diagnose student Jamie's error and common cognitive misconceptions"
          >
            <span>🎓</span>
            <span>{teacherMode ? 'Teacher Mode: ON' : 'Teacher Mode'}</span>
          </button>

          {isNonEnglish && !bilingualMode && (
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
            onClick={() => handleSpeak()}
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

      {/* MFL Immersion Hint if active language is English */}
      {isLanguageSubject && activeLang === 'en' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: '1rem',
            padding: '6px 12px',
            background: '#faf5ff',
            border: '1px solid #e9d5ff',
            borderRadius: '8px',
            fontSize: '0.82rem',
            color: '#6b21a8',
          }}
        >
          <span>💡 <strong>MFL Immersion:</strong> Switch Translate to 🇪🇸 Spanish or 🇫🇷 French in 🔤 Dual-Language mode to compare grammar and false cognates side-by-side!</span>
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => {
                setActiveLang('es');
                setSavedLanguage('es');
                setBilingualMode(true);
                onLanguageChange?.('es');
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #d8b4fe',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#7e22ce',
                cursor: 'pointer',
              }}
            >
              🇪🇸 Spanish
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveLang('fr');
                setSavedLanguage('fr');
                setBilingualMode(true);
                onLanguageChange?.('fr');
              }}
              style={{
                background: '#ffffff',
                border: '1px solid #d8b4fe',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#7e22ce',
                cursor: 'pointer',
              }}
            >
              🇫🇷 French
            </button>
          </div>
        </div>
      )}

      {/* Teacher Mode Diagnostic Challenge Banner */}
      {teacherMode && (
        <div
          style={{
            background: '#fdf4ff',
            border: '1px solid #f0abfc',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#86198f', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🎓</span>
            <span>Teacher Diagnostic Challenge: Spot Jamie's Misconception</span>
          </div>
          <div style={{ fontSize: '0.84rem', color: '#701a75', lineHeight: 1.4 }}>
            A pupil named <strong>Jamie</strong> submitted an answer with a common cognitive trap. Select an option below to diagnose Jamie's reasoning error and reveal the axiomatic pitfall!
          </div>
        </div>
      )}

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
          ) : bilingualMode ? (
            <span>🔤 Dual-Language Active: English + {currentLangMeta.label} ({currentLangMeta.nativeLabel})</span>
          ) : showOriginal ? (
            <span>🇬🇧 Viewing English Original (Translation to {currentLangMeta.label} available)</span>
          ) : (
            <span>🌐 Translated to {currentLangMeta.label} ({currentLangMeta.nativeLabel})</span>
          )}
        </div>
      )}

      {/* Question Prompt Stem */}
      {bilingualMode && isNonEnglish ? (
        <div style={{ marginBottom: '1.25rem' }}>
          {/* Primary English Prompt */}
          <div
            style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '0.5rem',
              lineHeight: 1.5,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span>{prompt}</span>
            <button
              type="button"
              onClick={() => handleSpeak(prompt, 'en')}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title="Listen in English"
            >
              🔊 EN
            </button>
          </div>

          {/* Bilingual Target Language Prompt Immersion Card */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#0369a1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '2px',
                }}
              >
                🌐 {currentLangMeta.label} ({currentLangMeta.nativeLabel}) • Bilingual Bridge
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0c4a6e', lineHeight: 1.4 }}>
                {translatedData.prompt}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSpeak(translatedData.prompt, activeLang)}
              style={{
                background: '#ffffff',
                border: '1px solid #7dd3fc',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#0284c7',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              title={`Listen in ${currentLangMeta.label}`}
            >
              🔊 {currentLangMeta.code.toUpperCase()}
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            fontSize: '1.35rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '1rem',
            lineHeight: 1.5,
          }}
        >
          {effectivePrompt}
        </div>
      )}

      {/* Stepped Pedagogical Scaffolding Bar (Stage 1 Conceptual Nudge & Stage 2 Method Step) */}
      {(effectiveHint || effectiveSocratic) && selectedAnswer === null && (
        <div style={{ marginBottom: '1.5rem' }}>
          {hintStage === 0 ? (
            <button
              type="button"
              onClick={() => setHintStage(1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                color: '#475569',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title="Click for a gentle clue before answering"
            >
              💡 Need a clue? (Stage 1)
            </button>
          ) : (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {hintStage === 1 ? '🌱 Stage 1 Clue: Conceptual Nudge' : '🔍 Stage 2 Clue: Method Step'}
                </span>
                {hintStage === 1 && effectiveSocratic && (
                  <button
                    type="button"
                    onClick={() => setHintStage(2)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#15803d',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    Still stuck? Show Next Step ➔
                  </button>
                )}
              </div>

              <div style={{ fontSize: '0.92rem', color: '#14532d', lineHeight: 1.4 }}>
                {hintStage === 1 ? (effectiveHint || effectiveSocratic) : (effectiveSocratic || effectiveHint)}
              </div>
            </div>
          )}
        </div>
      )}

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
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ lineHeight: 1.4 }}>
                  {bilingualMode && isNonEnglish ? (displayOptions[idx] || opt) : opt}
                </span>
                {bilingualMode && isNonEnglish && translatedData.displayOptions[idx] && (
                  <span
                    style={{
                      fontSize: '0.86rem',
                      color: isSelected ? textColor : '#0369a1',
                      fontWeight: 500,
                      lineHeight: 1.3,
                    }}
                  >
                    🌐 {translatedData.displayOptions[idx]}
                  </span>
                )}
              </div>
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
          {teacherMode && (
            <div
              style={{
                padding: '0.85rem 1.15rem',
                background: isResolvedCorrect ? '#faf5ff' : '#fdf4ff',
                border: '1px solid #d8b4fe',
                borderRadius: '8px',
                color: '#6b21a8',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🎯</span>
                <span>
                  {isResolvedCorrect
                    ? "Teacher Diagnostic Note: You picked the correct answer!"
                    : `Teacher Diagnostic Note: Jamie's Trap Identified on Choice ${String.fromCharCode(65 + selectedAnswer)}`}
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: '#581c87', lineHeight: 1.4 }}>
                {isResolvedCorrect
                  ? "Option " + String.fromCharCode(65 + selectedAnswer) + " is correct. Jamie made a misconception mistake by picking one of the distractors below."
                  : "Jamie's error analysis: " + (effectiveMisconceptions[selectedAnswer] || "This distractor captures a common cognitive misconception in this topic.")}
              </div>
            </div>
          )}

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

              {inferredCpaType && (
                <div style={{ paddingTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowMentalMirror(!showMentalMirror)}
                    style={{
                      background: showMentalMirror ? '#e0f2fe' : '#ffffff',
                      color: '#0369a1',
                      border: '1px solid #7dd3fc',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>🪞</span>
                    <span>{showMentalMirror ? 'Hide Procedural Visual Mirror' : 'Open Zero-Footprint Mental Mirror (0 KB)'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Collapsible Procedural Mental Mirror Manipulative */}
          {showMentalMirror && inferredCpaType && (
            <div style={{ marginTop: '0.5rem' }}>
              <ProceduralManipulative
                cpaType={inferredCpaType}
                seedTopic={unit}
              />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <button
              type="button"
              onClick={onNextQuestion}
              style={{
                background: '#f8fafc',
                color: '#334155',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.75rem 1.25rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
              title="Practice another parallel variation of this concept to cement mastery"
            >
              <span>🔄</span>
              <span>Parallel Variation (Mastery)</span>
            </button>

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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{translatedFeedback.nextQuestion}</span>
              <span>➔</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
