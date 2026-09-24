import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  SUPPORTED_LANGUAGES,
  getSavedLanguage,
  listenToLanguageChange,
  setSavedLanguage,
  getLanguagePracticeMode,
  listenToLanguagePracticeMode,
  getSpeechSpeed,
  listenToSpeechSpeed,
} from '../engine/operational-language';
import {
  translateQuestionData,
  translateText,
  speakInLanguage,
  speakBilingual,
  cancelSpeech,
} from '../engine/translationService';
import { ProceduralManipulative } from './ProceduralManipulative';
import { ASTKnowledgeSeed } from '../engine/seedInflationEngine';
import { CognitiveTrajectoryState } from '../engine/trajectoryEngine';
import { MindSpaceEngine, QuestionMindSpace } from '../engine/mindSpaceEngine';
import { PedagogicalStage } from '../engine/lessonSequencer';
import { aiCaller } from '../engine/aicaller';
import { playClickTone, triggerHapticClick } from '../services/soundHaptics';
import { MathRenderer } from './MathRenderer';

interface Props {
  keyStage?: string;
  subject: string;
  unit: string;
  lessonTitle?: string;
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
  pedagogicalStage?: PedagogicalStage;
  stageBadge?: string;
  stepLabel?: string;
  pedagogicalIntent?: string;
  urn?: string;
  csn?: string;
  routeEngine?: string;
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
  lessonTitle,
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
  pedagogicalStage,
  stageBadge,
  stepLabel,
  pedagogicalIntent,
  urn,
  csn,
  routeEngine,
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
  
  // Staged deliberate commitment: tap to select/preview, then commit to check
  const [stagedChoice, setStagedChoice] = useState<number | null>(null);

  // On-Device AI Socratic Unpacker state
  const [aiUnpackText, setAiUnpackText] = useState<string>('');
  const [isAiUnpacking, setIsAiUnpacking] = useState<boolean>(false);
  const [aiUnpackError, setAiUnpackError] = useState<string | null>(null);

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

  const [bilingualMode, setBilingualMode] = useState<boolean>(() => isLanguageSubject || getLanguagePracticeMode());
  const [speechSpeed, setLocalSpeechSpeed] = useState<number>(() => getSpeechSpeed());
  const [audioPhase, setAudioPhase] = useState<'idle' | 'primary' | 'secondary'>('idle');
  const cancelAudioRef = useRef<(() => void) | null>(null);
  const [teacherMode, setTeacherMode] = useState<boolean>(false);

  // Sync with global Language Practice Mode and Speech Speed
  useEffect(() => {
    const unsubPractice = listenToLanguagePracticeMode((enabled) => {
      setBilingualMode(enabled || isLanguageSubject);
    });
    const unsubSpeed = listenToSpeechSpeed((speed) => {
      setLocalSpeechSpeed(speed);
    });
    return () => {
      unsubPractice();
      unsubSpeed();
      if (cancelAudioRef.current) {
        cancelAudioRef.current();
        cancelAudioRef.current = null;
      }
      cancelSpeech();
    };
  }, [isLanguageSubject]);

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

  // Reset hint stage, mirror, staged choice & AI unpacker when prompt changes
  useEffect(() => {
    setHintStage(0);
    setShowMentalMirror(false);
    setStagedChoice(null);
    setAiUnpackText('');
    setAiUnpackError(null);
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

  // Keyboard shortcut listener: 1-4 / A-D to stage or choose, Enter to confirm
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      const key = e.key.toUpperCase();
      let index = -1;
      if (['1', 'A'].includes(key)) index = 0;
      else if (['2', 'B'].includes(key)) index = 1;
      else if (['3', 'C'].includes(key)) index = 2;
      else if (['4', 'D'].includes(key)) index = 3;

      if (index >= 0 && index < effectiveOptions.length && selectedAnswer === null) {
        e.preventDefault();
        setStagedChoice(index);
        playClickTone();
        triggerHapticClick();
      } else if (e.key === 'Enter') {
        if (selectedAnswer === null && stagedChoice !== null) {
          e.preventDefault();
          onSelectOption(stagedChoice);
        } else if (selectedAnswer !== null) {
          e.preventDefault();
          onNextQuestion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAnswer, stagedChoice, effectiveOptions.length, onSelectOption, onNextQuestion]);

  const handleLangSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setActiveLang(newLang);
    setSavedLanguage(newLang);
    setShowOriginal(false);
    onLanguageChange?.(newLang);
  };

  const handleSpeak = (customText?: string, customLang?: string, slow?: boolean) => {
    cancelSpeech();
    if (cancelAudioRef.current) {
      cancelAudioRef.current();
      cancelAudioRef.current = null;
    }
    const text = customText || effectivePrompt;
    const langToSpeak = customLang || (isNonEnglish && !showOriginal ? activeLang : 'en');
    setAudioPhase(langToSpeak === 'en' ? 'primary' : 'secondary');
    speakInLanguage(text, langToSpeak, {
      rate: slow ? 0.7 : speechSpeed,
      onEnd: () => setAudioPhase('idle'),
      onError: () => setAudioPhase('idle'),
    });
  };

  const handleSpeakEcho = () => {
    cancelSpeech();
    if (cancelAudioRef.current) {
      cancelAudioRef.current();
      cancelAudioRef.current = null;
      setAudioPhase('idle');
      return;
    }
    if (!isNonEnglish) {
      handleSpeak(prompt, 'en');
      return;
    }

    cancelAudioRef.current = speakBilingual(
      prompt,
      'en',
      translatedData.prompt,
      activeLang,
      {
        rate: speechSpeed,
        onPhaseChange: (phase) => setAudioPhase(phase),
        onEnd: () => {
          setAudioPhase('idle');
          cancelAudioRef.current = null;
        },
      }
    );
  };

  const handleStopSpeech = () => {
    cancelSpeech();
    if (cancelAudioRef.current) {
      cancelAudioRef.current();
      cancelAudioRef.current = null;
    }
    setAudioPhase('idle');
  };

  // Local AI Socratic Explainer: Unpacks the authentic misconception using on-device Gemini Nano/WebLLM
  const handleRequestAiUnpack = async () => {
    if (selectedAnswer === null) return;
    setIsAiUnpacking(true);
    setAiUnpackError(null);

    const chosenOptionText = effectiveOptions[selectedAnswer] || '';
    const misconceptionNote = effectiveMisconceptions[selectedAnswer] || 'Conceptual confusion';

    const systemPrompt = `You are St Joseph's Socratic On-Device Tutor.
Your job is to explain WHY a student's chosen option is a tempting cognitive trap, without giving away future answers.
Speak directly to a UK student in an encouraging, friendly, and precise voice. Keep your explanation to 2-3 short, clear sentences.`;

    const userPrompt = `Subject: ${subject}
Topic: ${unit}
Key Stage: ${keyStage}
Question: "${effectivePrompt}"
The student chose: "${chosenOptionText}"
Curriculum Misconception Trap: "${misconceptionNote}"

Explain in 2 friendly sentences why this answer is such an intuitive mistake and what key rule or physical/mathematical reality helps avoid this trap.`;

    try {
      const response = await aiCaller.promptText({
        prompt: userPrompt,
        systemPrompt,
        timeoutMs: 14000,
      });
      setAiUnpackText(response.trim());
    } catch (err: any) {
      console.warn('[QuestionCard AI Unpack fallback]:', err);
      // Deterministic fallback if model download not consented or unavailable
      setAiUnpackText(`Here is why this choice is tempting: "${misconceptionNote}". Look closely at how ${unit} behaves when you test the fundamental rule.`);
    } finally {
      setIsAiUnpacking(false);
    }
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
          {lessonTitle && (
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#0369a1',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '6px',
                padding: '2px 8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Anchored to Oak National Academy lesson"
            >
              📖 {lessonTitle}
            </span>
          )}
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

      {/* Oak Pedagogical Learning Arc Progression Banner */}
      {stageBadge && (
        <div
          style={{
            background: pedagogicalStage === 'HOOK'
              ? '#eff6ff'
              : pedagogicalStage === 'AXIOM'
              ? '#f0fdf4'
              : pedagogicalStage === 'SOCRATIC_PIVOT'
              ? '#fffbeb'
              : pedagogicalStage === 'MASTERY'
              ? '#faf5ff'
              : '#f8fafc',
            border: pedagogicalStage === 'HOOK'
              ? '1px solid #bfdbfe'
              : pedagogicalStage === 'AXIOM'
              ? '1px solid #bbf7d0'
              : pedagogicalStage === 'SOCRATIC_PIVOT'
              ? '1px solid #fde68a'
              : pedagogicalStage === 'MASTERY'
              ? '1px solid #e9d5ff'
              : '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1rem' }}>
                {pedagogicalStage === 'HOOK'
                  ? '🌍'
                  : pedagogicalStage === 'AXIOM'
                  ? '🏛️'
                  : pedagogicalStage === 'SOCRATIC_PIVOT'
                  ? '⚖️'
                  : pedagogicalStage === 'MASTERY'
                  ? '👑'
                  : '🎯'}
              </span>
              <span
                style={{
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  color: pedagogicalStage === 'HOOK'
                    ? '#1e40af'
                    : pedagogicalStage === 'AXIOM'
                    ? '#166534'
                    : pedagogicalStage === 'SOCRATIC_PIVOT'
                    ? '#92400e'
                    : pedagogicalStage === 'MASTERY'
                    ? '#6b21a8'
                    : '#1e293b',
                }}
              >
                {stageBadge}
              </span>
              {stepLabel && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: '#ffffff',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                  }}
                >
                  {stepLabel}
                </span>
              )}
              {(csn || urn) && (
                <span
                  title={`Curriculum Stock Number (NATO-style identifier): ${csn || ''} | Canonical URN: ${urn || ''}`}
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    letterSpacing: '0.02em',
                  }}
                >
                  🏷️ {csn || urn?.replace(/^urn:curriculum:/, '')}
                </span>
              )}
            </div>
            {/* Visual Arc Mini-Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {(['HOOK', 'AXIOM', 'PRACTICE', 'MASTERY'] as const).map((st, i) => {
                const isActive = (pedagogicalStage === st) || (pedagogicalStage === 'SOCRATIC_PIVOT' && st === 'PRACTICE');
                const isCompleted =
                  (pedagogicalStage === 'AXIOM' && i === 0) ||
                  ((pedagogicalStage === 'PRACTICE' || pedagogicalStage === 'SOCRATIC_PIVOT') && i < 2) ||
                  (pedagogicalStage === 'MASTERY' && i < 3);
                return (
                  <span
                    key={st}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isActive ? '#1e293b' : isCompleted ? '#dcfce7' : '#ffffff',
                      color: isActive ? '#ffffff' : isCompleted ? '#166534' : '#94a3b8',
                      border: `1px solid ${isActive ? '#1e293b' : isCompleted ? '#86efac' : '#e2e8f0'}`,
                    }}
                  >
                    {i + 1}
                  </span>
                );
              })}
            </div>
          </div>
          {pedagogicalIntent && (
            <div
              style={{
                fontSize: '0.8rem',
                color: '#475569',
                lineHeight: 1.4,
              }}
            >
              <strong>Pedagogical Purpose:</strong> {pedagogicalIntent}
            </div>
          )}
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
                {selectedAnswer !== null
                  ? `⚠️ ${trajectoryState.activeTrapVector} (${Math.round(trajectoryState.trapConfidence * 100)}% convergence)`
                  : `⚠️ Prior Misconception Detected: Watch for subtle conceptual traps`}
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
        <div
          style={{
            marginBottom: '1.25rem',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '12px',
            padding: '12px 14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Language Immersion Practice Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              paddingBottom: '8px',
              marginBottom: '10px',
              borderBottom: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.9rem' }}>🗣️</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Parallel Text & Ear-Training (English ⟷ {currentLangMeta.label})
              </span>
            </div>

            {/* Echo & Audio Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleSpeakEcho}
                style={{
                  background: audioPhase !== 'idle' ? '#047857' : '#ecfdf5',
                  color: audioPhase !== 'idle' ? '#ffffff' : '#065f46',
                  border: '1px solid #a7f3d0',
                  borderRadius: '6px',
                  padding: '3px 10px',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: audioPhase !== 'idle' ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                }}
                title="Play sequential bilingual audio: Speaks English first, pauses, then speaks the target translation"
              >
                <span>🎧</span>
                <span>{audioPhase !== 'idle' ? 'Playing Echo...' : `Echo (EN ➔ ${currentLangMeta.code.toUpperCase()})`}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpeak(translatedData.prompt, activeLang, true)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
                title="Listen to translation slowly for clear phonetic articulation"
              >
                <span>🐢</span> Slow (0.7x)
              </button>

              {audioPhase !== 'idle' && (
                <button
                  type="button"
                  onClick={handleStopSpeech}
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: '6px',
                    padding: '3px 8px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#b91c1c',
                    cursor: 'pointer',
                  }}
                  title="Stop audio playback"
                >
                  ⏹ Stop
                </button>
              )}
            </div>
          </div>

          {/* Primary English Prompt */}
          <div
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              background: audioPhase === 'primary' ? '#eff6ff' : 'transparent',
              border: `1px solid ${audioPhase === 'primary' ? '#60a5fa' : 'transparent'}`,
              transition: 'all 0.2s ease',
              marginBottom: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '2px' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: audioPhase === 'primary' ? '#2563eb' : '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                🇬🇧 English Original {audioPhase === 'primary' && '• ▶ Speaking...'}
              </span>
              <button
                type="button"
                onClick={() => handleSpeak(prompt, 'en')}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '5px',
                  padding: '2px 7px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#334155',
                  cursor: 'pointer',
                }}
                title="Listen in English"
              >
                🔊 EN
              </button>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.45 }}>
              <MathRenderer text={prompt} />
            </div>
          </div>

          {/* Target Language Prompt Immersion Card */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '8px',
              background: audioPhase === 'secondary' ? '#f0fdf4' : '#f0f9ff',
              border: `1px solid ${audioPhase === 'secondary' ? '#34d399' : '#bae6fd'}`,
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: audioPhase === 'secondary' ? '#059669' : '#0369a1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                🌐 {currentLangMeta.label} ({currentLangMeta.nativeLabel}) • Target Audio {audioPhase === 'secondary' && '• ▶ Pronouncing...'}
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  onClick={() => handleSpeak(translatedData.prompt, activeLang, true)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '5px',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                  title="Slow phonetic pronunciation"
                >
                  🐢 0.7x
                </button>
                <button
                  type="button"
                  onClick={() => handleSpeak(translatedData.prompt, activeLang)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #7dd3fc',
                    borderRadius: '5px',
                    padding: '2px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    cursor: 'pointer',
                  }}
                  title={`Listen in ${currentLangMeta.label}`}
                >
                  🔊 {currentLangMeta.code.toUpperCase()}
                </button>
              </div>
            </div>
            <div style={{ fontSize: '1.08rem', fontWeight: 600, color: '#0c4a6e', lineHeight: 1.45 }}>
              <MathRenderer text={translatedData.prompt} />
            </div>
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
          <MathRenderer text={effectivePrompt} />
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
          const isSubmitted = selectedAnswer !== null;
          const isStaged = !isSubmitted && stagedChoice === idx;
          const isSelected = selectedAnswer === idx;
          const isCorrect = idx === correctIndex;

          let bg = '#f8fafc';
          let border = '#e2e8f0';
          let textColor = '#1e293b';

          if (isStaged) {
            bg = '#eff6ff';
            border = '#3b82f6';
            textColor = '#1d4ed8';
          } else if (isSelected) {
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
              onClick={() => {
                if (selectedAnswer !== null) return;
                // If student clicks an option, stage it for confirmation
                setStagedChoice(idx);
                playClickTone();
                triggerHapticClick();
              }}
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
                boxShadow: (isSelected || isStaged) ? '0 2px 8px rgba(0,0,0,0.06)' : '0 1px 2px rgba(0,0,0,0.03)',
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
                  background: (isSelected || isStaged) ? border : '#e2e8f0',
                  color: (isSelected || isStaged) ? '#ffffff' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  flexShrink: 0,
                }}
              >
                {String.fromCharCode(65 + idx)}
              </span>

              {/* Option Text */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                  <span style={{ lineHeight: 1.4 }}>
                    <MathRenderer text={bilingualMode && isNonEnglish ? (displayOptions[idx] || opt) : opt} />
                  </span>
                  {bilingualMode && isNonEnglish && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeak(displayOptions[idx] || opt, 'en');
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        padding: '1px 4px',
                      }}
                      title="Listen to option in English"
                    >
                      🔊 EN
                    </button>
                  )}
                </div>
                {bilingualMode && isNonEnglish && translatedData.displayOptions[idx] && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.86rem',
                        color: isSelected ? textColor : '#0369a1',
                        fontWeight: 500,
                        lineHeight: 1.3,
                      }}
                    >
                      🌐 <MathRenderer text={translatedData.displayOptions[idx]} />
                    </span>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(translatedData.displayOptions[idx], activeLang, true);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#64748b',
                          fontSize: '0.68rem',
                          cursor: 'pointer',
                          padding: '1px 3px',
                        }}
                        title="Pronounce slowly"
                      >
                        🐢
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSpeak(translatedData.displayOptions[idx], activeLang);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '0.72rem',
                          cursor: 'pointer',
                          padding: '1px 4px',
                        }}
                        title={`Listen to option in ${currentLangMeta.label}`}
                      >
                        🔊 {currentLangMeta.code.toUpperCase()}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shortcut Key Label */}
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: isStaged ? '#2563eb' : '#94a3b8',
                  padding: '2px 6px',
                  background: isStaged ? '#dbeafe' : '#f1f5f9',
                  borderRadius: '4px',
                  flexShrink: 0,
                }}
              >
                Key {idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Deliberate "Check Answer" Confirmation Bar */}
      {selectedAnswer === null && (
        <div
          style={{
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            padding: '10px 14px',
            background: stagedChoice !== null ? '#f0fdf4' : '#f8fafc',
            border: stagedChoice !== null ? '1px solid #86efac' : '1px solid #e2e8f0',
            borderRadius: '10px',
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: stagedChoice !== null ? '#166534' : '#64748b' }}>
            {stagedChoice !== null ? (
              <span>
                🎯 Selected <strong>Option {String.fromCharCode(65 + stagedChoice)}</strong>. Ready to verify against curriculum axioms?
              </span>
            ) : (
              <span>
                👉 Select an option above (or press <strong>1–{effectiveOptions.length}</strong> on your keyboard) to commit.
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={stagedChoice === null}
            onClick={() => {
              if (stagedChoice !== null) {
                onSelectOption(stagedChoice);
              }
            }}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '8px',
              fontSize: '0.92rem',
              fontWeight: 700,
              background: stagedChoice !== null ? '#16a34a' : '#cbd5e1',
              color: '#ffffff',
              border: 'none',
              cursor: stagedChoice !== null ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: stagedChoice !== null ? '0 2px 6px rgba(22, 163, 74, 0.25)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Check Answer</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>[Enter ↵]</span>
          </button>
        </div>
      )}

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
                  <MathRenderer text={effectiveExplanation} />
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

              {/* On-Device AI Socratic Decoupler: Dynamic Trap Investigation */}
              <div style={{ paddingTop: '6px' }}>
                {!aiUnpackText ? (
                  <button
                    type="button"
                    disabled={isAiUnpacking}
                    onClick={handleRequestAiUnpack}
                    style={{
                      background: '#fffbeb',
                      color: '#b45309',
                      border: '1px solid #fcd34d',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: isAiUnpacking ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                    }}
                    title="Ask the on-device AI tutor why this cognitive trap is tempting without giving away answers"
                  >
                    <span>🤖</span>
                    <span>{isAiUnpacking ? 'Decoupling Trap via Local Nano...' : 'Ask Local AI: "Why did I fall for this trap?"'}</span>
                  </button>
                ) : (
                  <div
                    style={{
                      background: '#fefce8',
                      border: '1px solid #fef08a',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.88rem',
                      color: '#713f12',
                      lineHeight: 1.5,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '4px', fontSize: '0.82rem', color: '#854d0e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      <span>🤖</span>
                      <span>On-Device Socratic Unpacker</span>
                    </div>
                    <div>{aiUnpackText}</div>
                  </div>
                )}
              </div>

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
                background: isResolvedCorrect ? '#16a34a' : '#2563eb',
                color: '#ffffff',
                fontWeight: 700,
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.15s ease',
              }}
              title={
                !isResolvedCorrect
                  ? "Step into the Socratic counter-proof to decouple this misconception"
                  : pedagogicalStage === 'HOOK'
                  ? "Advance to verify the invariant core axiom"
                  : pedagogicalStage === 'AXIOM'
                  ? "Advance to applied curriculum practice"
                  : "Proceed along learning arc"
              }
            >
              <span>
                {!isResolvedCorrect
                  ? '⚖️ Investigate Socratic Probe'
                  : pedagogicalStage === 'HOOK'
                  ? '🏛️ Advance to Core Axiom'
                  : pedagogicalStage === 'AXIOM'
                  ? '🎯 Enter Applied Practice'
                  : pedagogicalStage === 'PRACTICE'
                  ? '👑 Level Up to Mastery'
                  : translatedFeedback.nextQuestion}
              </span>
              <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>[Enter ↵]</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
