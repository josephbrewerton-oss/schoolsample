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
import { CognitiveTrajectoryState } from '../engine/trajectoryEngine';
import { MindSpaceEngine, QuestionMindSpace } from '../engine/mindSpaceEngine';

interface Props {
  keyStage?: string;
  subject: string;
  unit: string;
  prompt: string;
  displayOptions: string[];
  selectedAnswer: number | null;
  correctIndex: number | null;
  score: number;
  streak: number;
  seedToken?: string;
  onSeedJump?: (seed: string) => void;
  trajectoryState?: CognitiveTrajectoryState | null;
  streamTransition?: {
    nextSeedToken: string;
    pedagogicalIntent: string;
    adaptationLabel: string;
  } | null;
  hint?: string;
  explanation?: string;
  misconceptions?: string[];
  socraticFollowUp?: string;
  onSelectOption: (idx: number) => void;
  onNextQuestion: () => void;
  onParallelVariation?: () => void;
  currentLang?: string;
  onLanguageChange?: (lang: string) => void;
}

export const QuestionCard: React.FC<Props> = ({
  keyStage = 'Key Stage 2',
  subject,
  unit,
  prompt,
  displayOptions,
  selectedAnswer,
  correctIndex,
  score,
  streak,
  seedToken,
  onSeedJump,
  trajectoryState,
  streamTransition,
  hint,
  explanation,
  misconceptions,
  socraticFollowUp,
  onSelectOption,
  onNextQuestion,
  onParallelVariation,
  currentLang,
  onLanguageChange,
}) => {
  const [activeLang, setActiveLang] = useState<string>(() => currentLang || getSavedLanguage());
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [hintStage, setHintStage] = useState<number>(0); // 0 = hidden, 1 = conceptual nudge, 2 = step method
  const [showMentalMirror, setShowMentalMirror] = useState<boolean>(false);
  const [showMindSpace, setShowMindSpace] = useState<boolean>(false);
  const [seedCopied, setSeedCopied] = useState<boolean>(false);
  const [isEditingSeed, setIsEditingSeed] = useState<boolean>(false);
  const [customSeedInput, setCustomSeedInput] = useState<string>('');

  // Project question onto the Mind Space cognitive frame
  const mindSpace: QuestionMindSpace = useMemo(() => {
    return MindSpaceEngine.projectMindSpace({
      keyStage,
      subject,
      unit,
      prompt,
      options: displayOptions,
      answerKey: correctIndex ?? 0,
      misconceptions,
      selectedCoordinate: selectedAnswer,
    });
  }, [keyStage, subject, unit, prompt, displayOptions, correctIndex, misconceptions, selectedAnswer]);

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

          {/* Mind Space Cognitive HUD Toggle */}
          <button
            type="button"
            onClick={() => setShowMindSpace(!showMindSpace)}
            style={{
              background: showMindSpace ? '#0f172a' : '#f8fafc',
              color: showMindSpace ? '#38bdf8' : '#334155',
              border: `1px solid ${showMindSpace ? '#0284c7' : '#cbd5e1'}`,
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: showMindSpace ? '0 0 10px rgba(56, 189, 248, 0.25)' : 'none',
            }}
            title="Inspect the Question Mind Space: Axiom, Trap, and Cognitive Geometries"
          >
            <span>🌌</span>
            <span>{showMindSpace ? 'Mind Space: Active' : 'Mind Space'}</span>
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

          {/* Seed Token & Deterministic Audit Pill */}
          {seedToken && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '3px 8px',
                fontSize: '0.78rem',
              }}
            >
              <span style={{ fontWeight: 700, color: '#64748b' }}>🌱 Seed:</span>
              <code
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#0f172a',
                  background: '#e2e8f0',
                  padding: '1px 5px',
                  borderRadius: '4px',
                }}
              >
                {seedToken}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(seedToken);
                  setSeedCopied(true);
                  setTimeout(() => setSeedCopied(false), 2000);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: seedCopied ? '#16a34a' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 4px',
                }}
                title="Copy seed to clipboard for reproducibility audit"
              >
                {seedCopied ? '✓ Copied' : '📋 Copy'}
              </button>
              {onSeedJump && (
                isEditingSeed ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (customSeedInput.trim()) {
                        onSeedJump(customSeedInput.trim());
                        setIsEditingSeed(false);
                        setCustomSeedInput('');
                      }
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <input
                      type="text"
                      value={customSeedInput}
                      onChange={(e) => setCustomSeedInput(e.target.value)}
                      placeholder="e.g. 48291"
                      autoFocus
                      style={{
                        width: '70px',
                        padding: '1px 4px',
                        fontSize: '0.75rem',
                        border: '1px solid #3b82f6',
                        borderRadius: '4px',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '1px 5px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Go
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingSeed(false)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomSeedInput(seedToken);
                      setIsEditingSeed(true);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '2px 4px',
                      textDecoration: 'underline',
                    }}
                    title="Enter custom seed to replay an exact question"
                  >
                    Jump ➔
                  </button>
                )
              )}
            </div>
          )}
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

      {/* Predictive Cognitive Trajectory Radar */}
      {trajectoryState && trajectoryState.totalAttempts > 0 && (
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '8px 14px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1rem' }}>🧭</span>
            <span style={{ fontWeight: 700, color: '#334155' }}>
              Cognitive Trajectory:
            </span>
            {trajectoryState.activeTrapVector ? (
              <span
                style={{
                  background: '#fee2e2',
                  color: '#991b1b',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                ⚠️ {trajectoryState.activeTrapVector} ({Math.round(trajectoryState.trapConfidence * 100)}% convergence)
              </span>
            ) : (
              <span
                style={{
                  background: '#dcfce7',
                  color: '#166534',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                ✅ Axiomatic Alignment
              </span>
            )}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.78rem' }}>
            Entropy: <strong>{trajectoryState.coordinateEntropy}</strong> (0=Systematic, 1=Guessing)
          </div>
        </div>
      )}

      {/* Mind Space Cognitive Frame HUD */}
      {showMindSpace && (
        <div
          style={{
            background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
            border: '1px solid #1e293b',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '1.25rem',
            color: '#f1f5f9',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🌌</span>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.02em', color: '#38bdf8' }}>
                Instance "Mind Space" Geometry: {mindSpace.title}
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#1e293b', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
              DIM: 4-Vector ({keyStage})
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
            {/* Core Invariant Axiom */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', marginBottom: '4px', textTransform: 'uppercase' }}>
                ⭐ Core Invariant Axiom (Ground Truth)
              </div>
              <div style={{ fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                {mindSpace.coreAxiom}
              </div>
            </div>

            {/* Systematic Cognitive Trap */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: '8px', padding: '10px 12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fb7185', marginBottom: '4px', textTransform: 'uppercase' }}>
                🧲 Dominant Cognitive Trap
              </div>
              <div style={{ fontSize: '0.84rem', color: '#fecdd3', lineHeight: 1.4 }}>
                {mindSpace.cognitiveTrap}
              </div>
            </div>
          </div>

          {/* 4-Vector Coordinate Geometry */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
              Coordinate Lattice Vectors [C₀, C₁, C₂, C₃]
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {mindSpace.distractorVectors.map((vec) => {
                const isSelected = selectedAnswer === vec.coordinate;
                const isGroundTruth = vec.isCorrect;
                return (
                  <div
                    key={vec.coordinate}
                    style={{
                      background: isSelected 
                        ? (isGroundTruth ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                        : '#0b1324',
                      border: `1px solid ${
                        isSelected 
                          ? (isGroundTruth ? '#22c55e' : '#ef4444')
                          : (isGroundTruth ? '#10b981' : '#334155')
                      }`,
                      borderRadius: '8px',
                      padding: '8px 10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <code style={{ fontSize: '0.76rem', fontWeight: 800, color: isGroundTruth ? '#4ade80' : '#f87171' }}>
                        Vector C{vec.coordinate} {isGroundTruth ? '✓ (Axiom)' : '✗ (Distractor)'}
                      </code>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                        x:{vec.mindCoordinate.x.toFixed(1)} y:{vec.mindCoordinate.y.toFixed(1)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600, marginBottom: '4px' }}>
                      "{vec.text.slice(0, 40)}{vec.text.length > 40 ? '...' : ''}"
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isGroundTruth ? '#86efac' : '#fca5a5' }}>
                      {vec.misconceptionArchetype}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Resonance State */}
          {mindSpace.currentMentalState ? (
            <div style={{ background: '#09152a', border: '1px solid #1d4ed8', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>Resonance Diagnosis: </span>
                <span style={{ fontSize: '0.82rem', color: '#e0f2fe' }}>{mindSpace.currentMentalState.diagnosis}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600 }}>
                ➔ Vector: {mindSpace.currentMentalState.recommendedNextVector}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'italic' }}>
              Awaiting learner coordinate choice to evaluate resonance in question mind space.
            </div>
          )}
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

          {/* Dynamic Coordinate Stream Transition Vector */}
          {streamTransition && (
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.82rem',
                color: '#166534',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡</span>
                <span>
                  <strong>Coordinate Stream Transition:</strong> {streamTransition.adaptationLabel}
                </span>
              </div>
              <code style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.78rem' }}>
                {streamTransition.nextSeedToken}
              </code>
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
              onClick={onParallelVariation || onNextQuestion}
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
