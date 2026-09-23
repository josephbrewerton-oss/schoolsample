// src/components/NeuralLabCanvas.tsx
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import NeuralAstCanvasTopology from './NeuralAstCanvasTopology';
import { dispatch } from '../engine/hypercall';
import { hypervisor, GuestVMState, HypervisorMetrics } from '../engine/hypervisor';
import { hasUserGrantedAiConsent, setUserAiConsent } from '../engine/aicaller';
import { getSavedLanguage, listenToLanguageChange } from '../engine/operational-language';
import { findCurriculumKnowledge } from '../data/oakCurriculumKnowledge';
import { PRNG } from '../engine/prng';
import { TrajectoryEngine, CognitiveTrajectoryState } from '../engine/trajectoryEngine';
import { LessonSequencer, PedagogicalStage } from '../engine/lessonSequencer';
import {
  playSuccessChime,
  playIncorrectTone,
  triggerHapticSuccess,
  triggerHapticError,
} from '../services/soundHaptics';
import {
  triggerCorrectConfetti,
  triggerStreakCelebration,
  triggerMasteryConfetti,
} from '../utils/confetti';

interface NeuralLabCanvasProps {
  initialKeyStage?: string;
  initialSubject?: string;
  initialUnit?: string;
  onTopicChange?: (keyStage: string, subject: string, unit: string) => void;
}

export default function NeuralLabCanvas({
  initialKeyStage,
  initialSubject,
  initialUnit,
  onTopicChange,
}: NeuralLabCanvasProps) {
  const [curriculumSetting, setCurriculumSetting] = useState<string>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('curriculum_standard')) || 'uk_oak';
  });

  const [selectedKeyStage, setSelectedKeyStage] = useState(initialKeyStage || 'Key Stage 1');
  const [selectedSubject, setSelectedSubject] = useState(initialSubject || 'Science');
  const [selectedUnit, setSelectedUnit] = useState(initialUnit || 'Seasonal Changes');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [sessionId, setSessionId] = useState('Lesson 1');

  const [activeLang, setActiveLang] = useState<string>(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });

  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setActiveLang(newLang);
    });
    return unsub;
  }, []);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<'warmup' | 'challenger' | 'brainbuster'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('preferred_difficulty') as any) || 'challenger';
    }
    return 'challenger';
  });
  const [hasConsent, setHasConsent] = useState(false);
  const [showCanvasTopology, setShowCanvasTopology] = useState(true);

  // Hypervisor Host Supervisor State & Metrics
  const [vmState, setVmState] = useState<GuestVMState>(() => hypervisor.getState());
  const [vmMetrics, setVmMetrics] = useState<HypervisorMetrics>(() => hypervisor.getMetrics());

  useEffect(() => {
    return hypervisor.subscribe((state, metrics) => {
      setVmState(state);
      setVmMetrics(metrics);
    });
  }, []);

  useEffect(() => {
    setHasConsent(hasUserGrantedAiConsent());
    const onConsentChanged = (e: any) => setHasConsent(Boolean(e.detail));
    window.addEventListener('ai_consent_changed', onConsentChanged);
    window.addEventListener('storage', () => setHasConsent(hasUserGrantedAiConsent()));
    return () => window.removeEventListener('ai_consent_changed', onConsentChanged);
  }, []);
  const [trajectoryState, setTrajectoryState] = useState<CognitiveTrajectoryState | null>(null);
  const [streamTransition, setStreamTransition] = useState<{
    nextSeedToken: string;
    pedagogicalIntent: string;
    adaptationLabel: string;
  } | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    id?: string;
    seedToken?: string;
    pedagogicalStage?: PedagogicalStage;
    stageBadge?: string;
    stepLabel?: string;
    pedagogicalIntent?: string;
    prompt: string;
    displayOptions: string[];
    rawOptions: string[];
    hint?: string;
    explanation?: string;
    misconceptions?: string[];
    socraticFollowUp?: string;
    keyStage: string;
    subject: string;
    unit: string;
    lessonTitle?: string;
    urn?: string;
    csn?: string;
    routeEngine?: string;
    axiom?: string;
    trap?: string;
  } | null>(null);

  const activeRequestIdRef = useRef(0);
  const activeQuestionRef = useRef(activeQuestion);
  const activeSelectionRef = useRef({
    keyStage: selectedKeyStage,
    subject: selectedSubject,
    unit: selectedUnit,
    lesson: selectedLesson,
  });

  useEffect(() => {
    activeQuestionRef.current = activeQuestion;
  }, [activeQuestion]);

  useEffect(() => {
    activeSelectionRef.current = {
      keyStage: selectedKeyStage,
      subject: selectedSubject,
      unit: selectedUnit,
      lesson: selectedLesson,
    };
  }, [selectedKeyStage, selectedSubject, selectedUnit, selectedLesson]);

  useEffect(() => {
    if (initialKeyStage && initialKeyStage !== selectedKeyStage) {
      setSelectedKeyStage(initialKeyStage);
    }
  }, [initialKeyStage]);

  useEffect(() => {
    if (initialSubject && initialSubject !== selectedSubject) {
      setSelectedSubject(initialSubject);
    }
  }, [initialSubject]);

  useEffect(() => {
    if (initialUnit && initialUnit !== selectedUnit) {
      setSelectedUnit(initialUnit);
    }
  }, [initialUnit]);

  // 1. Resolve Curriculum Tree via Unified Node Dispatch (fetch full tree once)
  const [curriculumTree, setCurriculumTree] = useState<any>(null);
  useEffect(() => {
    dispatch('CurriculumNode', {
      intent: 'resolve:tree',
      payload: {},
    }).then((res) => {
      if (res.ok && res.data) setCurriculumTree(res.data);
    });
  }, []);

  const slugify = (text: string) =>
    (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const sanitizeHint = (raw?: string): string => {
    if (!raw) return 'Review the core definition and eliminate options that contradict the rule.';
    return raw
      .replace(/^[\s\S]*?\*\*Response:\*\*/i, '')
      .replace(/^[\s\S]*?(?:Okay,?\s+here['’]?s\s+(?:a\s+)?socratic\s+hint[^:]*:\s*|Here(?:'s|\s+is)\s+a\s+hint:?)/i, '')
      .replace(/\((?:Since|Based on|If they|Note).*?\)/gi, '')
      .replace(/\*\*.*?\*\*/g, '')
      .replace(/^"(.*)"$/, '$1')
      .replace(/^(?:Hint|Tutor Hint|Prof\. Turing):\s*/i, '')
      .trim();
  };

  const handleNewQuestion = useCallback((payload: any) => {
    setIsGenerating(false);
    const { question, keyStage, subject, unit } = payload;
    if (!question?.options || question.options.length < 2) return;

    const rawKey = typeof question.answerKey === 'number' ? question.answerKey : 0;
    const rawOptions = question.options;
    const rawMisconceptions = Array.isArray(question.misconceptions) ? question.misconceptions : [];

    // Pair options with their misconceptions before shuffling
    const items = rawOptions.map((opt: string, idx: number) => ({
      text: opt,
      misconception: rawMisconceptions[idx] || (idx === rawKey ? 'Correct!' : 'Common conceptual trap.'),
      isCorrect: idx === rawKey,
    }));

    const shuffled = [...items].sort(() => Math.random() - 0.5);
    const computedCorrectIndex = shuffled.findIndex((item) => item.isCorrect);
    setCorrectIndex(computedCorrectIndex !== -1 ? computedCorrectIndex : 0);
    setSelectedAnswer(null);

    setActiveQuestion({
      id: question.id || `q_${Date.now()}`,
      urn: question.urn,
      csn: question.csn,
      routeEngine: question.routeEngine,
      axiom: question.axiom,
      trap: question.trap,
      seedToken: question.seedToken || payload.seedToken || '',
      pedagogicalStage: question.pedagogicalStage,
      stageBadge: question.stageBadge,
      stepLabel: question.stepLabel,
      pedagogicalIntent: question.pedagogicalIntent,
      prompt: question.prompt,
      displayOptions: shuffled.map((s) => s.text),
      misconceptions: shuffled.map((s) => s.misconception),
      rawOptions: question.options,
      hint: question.hint || payload.hint || '',
      explanation: question.explanation || payload.explanation || '',
      socraticFollowUp: question.socraticFollowUp || payload.socraticFollowUp || '',
      keyStage: keyStage || activeSelectionRef.current.keyStage,
      subject: subject || activeSelectionRef.current.subject,
      unit: unit || activeSelectionRef.current.unit,
      lessonTitle: payload.lessonTitle || activeSelectionRef.current.lesson || undefined,
    });
  }, []);

  // 2. Request Question via Unified Node Dispatch (Cache -> Bus -> LLM synthesis handled in engine)
  const requestQuestion = useCallback(async (
    ks = activeSelectionRef.current.keyStage,
    sub = activeSelectionRef.current.subject,
    u = activeSelectionRef.current.unit,
    diff = difficulty,
    targetLang = activeLang,
    forceVariation = false,
    customSeed?: string,
    lessonTitle = activeSelectionRef.current.lesson
  ) => {
    const requestId = ++activeRequestIdRef.current;
    setIsGenerating(true);
    setSelectedAnswer(null);
    setCorrectIndex(null);

    // Hard fallback timer ensuring the UI never gets stuck in a generating state (aligned with hypervisor watchdog)
    const safetyTimer = setTimeout(() => {
      if (requestId === activeRequestIdRef.current) {
        setIsGenerating(false);
      }
    }, 32000);

    setStreamTransition(null);

    try {
      const currentPrompt = activeQuestionRef.current?.prompt || '';
      const seedToUse = customSeed !== undefined && customSeed !== '' ? customSeed : undefined;
      const res = await dispatch('QuestionEngine', {
        intent: 'synthesize:governed',
        payload: {
          keyStage: ks,
          subject: sub,
          topic: u,
          lessonTitle,
          curriculum: curriculumSetting,
          difficulty: diff,
          lang: targetLang,
          forceVariation,
          excludePrompt: customSeed ? '' : currentPrompt,
          seed: seedToUse,
          nonce: Math.floor(Math.random() * 1000000),
        },
      });

      if (requestId !== activeRequestIdRef.current) return;

      if (res.ok && res.data) {
        let questionData = res.data;
        // Strict guard: If the returned question stem matches the current active question stem, rotate to an alternate question
        if (!customSeed && currentPrompt && questionData.prompt && questionData.prompt.trim() === currentPrompt.trim()) {
          const offline = findCurriculumKnowledge(ks, sub, u);
          const alt = offline?.questions?.find((q) => q.prompt.trim() !== currentPrompt.trim());
          if (alt) {
            questionData = {
              ...questionData,
              prompt: alt.prompt,
              options: alt.options,
              answerKey: alt.answerKey,
              hint: alt.hint || questionData.hint,
              explanation: alt.explanation || questionData.explanation,
            };
          } else if (offline?.socraticPivot) {
            questionData = {
              ...questionData,
              prompt: `🤔 [Diagnostic Inquiry] ${offline.socraticPivot}`,
            };
          } else if (offline?.hook) {
            questionData = {
              ...questionData,
              prompt: `🌍 [Real-World Application] ${offline.hook}`,
            };
          }
        }

        handleNewQuestion({
          question: questionData,
          keyStage: ks,
          subject: sub,
          unit: u,
          hint: questionData.hint || '',
          seedToken: questionData.seedToken,
        });
      }
    } catch {
      if (requestId === activeRequestIdRef.current) {
        const fallbackOffline = findCurriculumKnowledge(ks, sub, u);
        const currentPrompt = activeQuestionRef.current?.prompt || '';
        if (fallbackOffline && fallbackOffline.questions?.length > 0) {
          const eligible = fallbackOffline.questions.filter((q) => q.prompt.trim() !== currentPrompt.trim());
          const chosen = eligible.length > 0
            ? eligible[Math.floor(Math.random() * eligible.length)]
            : fallbackOffline.questions[0];
          let chosenPrompt = chosen.prompt;
          if (chosenPrompt.trim() === currentPrompt.trim() && fallbackOffline.socraticPivot) {
            chosenPrompt = `🤔 [Diagnostic Inquiry] ${fallbackOffline.socraticPivot}`;
          }
          handleNewQuestion({
            question: { ...chosen, prompt: chosenPrompt },
            keyStage: ks,
            subject: sub,
            unit: u,
            hint: chosen.hint || '',
          });
        }
      }
    } finally {
      clearTimeout(safetyTimer);
      if (requestId === activeRequestIdRef.current) {
        setIsGenerating(false);
      }
    }
  }, [curriculumSetting, difficulty, activeLang, handleNewQuestion]);

  const handleKeyStageSelect = (newKs: string, firstSub: string, firstUnit: string) => {
    const nextSub = firstSub || selectedSubject;
    const nextUnit = firstUnit || selectedUnit;
    activeSelectionRef.current = {
      keyStage: newKs,
      subject: nextSub,
      unit: nextUnit,
      lesson: '',
    };
    setSelectedKeyStage(newKs);
    setSelectedSubject(nextSub);
    setSelectedUnit(nextUnit);
    setSelectedLesson('');
    onTopicChange?.(newKs, nextSub, nextUnit);
    requestQuestion(newKs, nextSub, nextUnit, difficulty, activeLang, false, undefined, '');
  };

  const handleSubjectSelect = (newSub: string, firstUnit: string) => {
    const nextUnit = firstUnit || selectedUnit;
    activeSelectionRef.current = {
      keyStage: selectedKeyStage,
      subject: newSub,
      unit: nextUnit,
      lesson: '',
    };
    setSelectedSubject(newSub);
    setSelectedUnit(nextUnit);
    setSelectedLesson('');
    onTopicChange?.(selectedKeyStage, newSub, nextUnit);
    requestQuestion(selectedKeyStage, newSub, nextUnit, difficulty, activeLang, false, undefined, '');
  };

  const handleUnitSelect = (newUnit: string) => {
    activeSelectionRef.current = {
      keyStage: selectedKeyStage,
      subject: selectedSubject,
      unit: newUnit,
      lesson: '',
    };
    setSelectedUnit(newUnit);
    setSelectedLesson('');
    onTopicChange?.(selectedKeyStage, selectedSubject, newUnit);
    requestQuestion(selectedKeyStage, selectedSubject, newUnit, difficulty, activeLang, false, undefined, '');
  };

  const handleLessonSelect = (lesson: string) => {
    activeSelectionRef.current = {
      keyStage: selectedKeyStage,
      subject: selectedSubject,
      unit: selectedUnit,
      lesson,
    };
    setSelectedLesson(lesson);
    requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, difficulty, activeLang, false, undefined, lesson);
  };

  const handleDifficultyChange = (newDiff: 'warmup' | 'challenger' | 'brainbuster') => {
    setDifficulty(newDiff);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_difficulty', newDiff);
    }
    requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, newDiff, activeLang, false, undefined, selectedLesson);
  };

  const hasMountedRef = useRef(false);
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, difficulty, activeLang, false, undefined, selectedLesson);
    }
  }, []);

  // 3. User Selection & Progress Tracking via Unified Dispatch
  const handleSelectOption = (idx: number) => {
    if (selectedAnswer === correctIndex || !activeQuestion || correctIndex === null) return;

    setSelectedAnswer(idx);
    const isCorrect = idx === correctIndex;
    const feedbackText = isCorrect ? 'Spot on! Correct conceptual deduction.' : sanitizeHint(activeQuestion.hint);

    // Audio / UI Feedback
    dispatch('FeedbackSubstrate', {
      intent: 'emit:toast',
      payload: { text: feedbackText, isCorrect },
    });

    // Native Web Audio & Haptic Feedback
    if (isCorrect) {
      playSuccessChime();
      triggerHapticSuccess();
    } else {
      playIncorrectTone();
      triggerHapticError();
    }

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => {
        const nextStreak = st + 1;
        if (nextStreak === 3 || nextStreak === 5 || nextStreak === 10 || nextStreak % 5 === 0) {
          triggerStreakCelebration(nextStreak);
        } else if (activeQuestion.pedagogicalStage === 'MASTERY') {
          triggerMasteryConfetti();
        } else {
          triggerCorrectConfetti();
        }
        return nextStreak;
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('active_student_misconception');
      }
    } else {
      setStreak(0);
      if (typeof window !== 'undefined' && activeQuestion.misconceptions?.[idx]) {
        // Broadcast the specific misconception to the Classroom Beacon for teacher oversight
        localStorage.setItem('active_student_misconception', activeQuestion.misconceptions[idx]);
      }
    }

    // Update in-memory cognitive trajectory lattice
    const updatedTrajectory = TrajectoryEngine.recordAttempt({
      seedToken: activeQuestion.seedToken || 'unknown_seed',
      topicId: `${slugify(activeQuestion.subject)}_${slugify(activeQuestion.unit)}`,
      selectedCoordinate: idx,
      correctCoordinate: correctIndex,
      isCorrect,
      misconceptionTag: !isCorrect ? activeQuestion.misconceptions?.[idx] : undefined,
      timestamp: Date.now(),
    });
    setTrajectoryState(updatedTrajectory);

    // Update Oak Pedagogical Sequence State (Hook -> Axiom -> Practice -> Pivot -> Mastery)
    const updatedLessonState = LessonSequencer.recordAttempt({
      keyStage: activeQuestion.keyStage || selectedKeyStage,
      subject: activeQuestion.subject,
      unit: activeQuestion.unit,
      isCorrect,
      misconceptionTag: !isCorrect ? activeQuestion.misconceptions?.[idx] : undefined,
    });

    // Compute deterministic next coordinate stream transition
    const nextTransition = TrajectoryEngine.deriveNextSeedStream({
      currentSeedToken: activeQuestion.seedToken || 'unknown_seed',
      previousCoordinate: idx,
      isCorrect,
      misconceptionTag: !isCorrect ? activeQuestion.misconceptions?.[idx] : undefined,
    });
    setStreamTransition(nextTransition);

    // Record Metrics with Coordinate Telemetry
    dispatch('TelemetryNode', {
      intent: 'record:answer',
      payload: {
        cohortCode: sessionId || 'default_cohort',
        challengeId: activeQuestion.id,
        topicId: `${slugify(activeQuestion.subject)}_${slugify(activeQuestion.unit)}`,
        isCorrect,
        userAnswer: activeQuestion.displayOptions[idx],
        seedToken: activeQuestion.seedToken,
        selectedCoordinate: idx,
        correctCoordinate: correctIndex,
        misconceptionTag: !isCorrect ? activeQuestion.misconceptions?.[idx] : undefined,
      },
    });
  };

  // 4. Session Reporting via Unified Dispatch
  const handleExportReport = () => {
    dispatch('ReportEngine', {
      intent: 'export:html',
      payload: { sessionId },
    });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '1rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <CurriculumSelector
        keyStage={selectedKeyStage}
        subject={selectedSubject}
        unit={selectedUnit}
        selectedLesson={selectedLesson}
        onLessonChange={handleLessonSelect}
        status="online"
        isReady={!isGenerating}
        sessionId={sessionId}
        curriculumTree={curriculumTree}
        buttonLabel={isGenerating ? '⚡ Generating...' : 'New Question'}
        onKeyStageChange={handleKeyStageSelect}
        onSubjectChange={handleSubjectSelect}
        onUnitChange={handleUnitSelect}
        onSessionIdChange={setSessionId}
        onNewQuestion={() => requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, difficulty, activeLang, false, undefined, selectedLesson)}
        onDownloadReport={handleExportReport}
      />

      <div
        style={{
          marginTop: '1.25rem',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          minHeight: '480px',
          boxSizing: 'border-box',
        }}
      >
        {/* Catholic First Communion Masterclass Quick Pill */}
        {(selectedSubject.toLowerCase().includes('catholic') ||
          selectedSubject.toLowerCase().includes('religious education') ||
          selectedUnit.toLowerCase().includes('communion') ||
          selectedUnit.toLowerCase().includes('eucharist') ||
          selectedUnit.toLowerCase().includes('mass')) && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.65rem 1rem',
              background: 'linear-gradient(135deg, #fefce8 0%, #fef08a 100%)',
              border: '1px solid #facc15',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>✝️</span>
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#854d0e' }}>
                First Holy Communion Interactive Masterclass Available
              </span>
            </div>
            <Link
              to="/learning-zone?tab=first-communion"
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: '#4338ca',
                color: '#ffffff',
                fontSize: '0.78rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>Explore Mass & Altar Vessels</span>
              <span>➔</span>
            </Link>
          </div>
        )}

        {/* Child-Friendly Difficulty / Challenge Level Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
              🎯 Challenge Level:
            </span>
            <button
              type="button"
              onClick={() => handleDifficultyChange('warmup')}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                border: difficulty === 'warmup' ? '2px solid #10b981' : '1px solid #cbd5e1',
                background: difficulty === 'warmup' ? '#ecfdf5' : '#ffffff',
                color: difficulty === 'warmup' ? '#065f46' : '#64748b',
                fontWeight: difficulty === 'warmup' ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🌱 Warm-Up
            </button>
            <button
              type="button"
              onClick={() => handleDifficultyChange('challenger')}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                border: difficulty === 'challenger' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                background: difficulty === 'challenger' ? '#eff6ff' : '#ffffff',
                color: difficulty === 'challenger' ? '#1e40af' : '#64748b',
                fontWeight: difficulty === 'challenger' ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              ⚡ Challenger
            </button>
            <button
              type="button"
              onClick={() => handleDifficultyChange('brainbuster')}
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                border: difficulty === 'brainbuster' ? '2px solid #7c3aed' : '1px solid #cbd5e1',
                background: difficulty === 'brainbuster' ? '#f5f3ff' : '#ffffff',
                color: difficulty === 'brainbuster' ? '#5b21b6' : '#64748b',
                fontWeight: difficulty === 'brainbuster' ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              🏆 Brain Buster
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {difficulty === 'warmup' && '🌱 Gentle questions to build core confidence'}
              {difficulty === 'challenger' && '⚡ Real-world problems and clever distractors'}
              {difficulty === 'brainbuster' && '🏆 Big brain puzzles that power up device AI!'}
            </span>

            {/* Live Hypervisor Supervisor Status */}
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                background: vmState === 'ready' || vmState === 'executing' ? '#f0fdfa' : '#f8fafc',
                color: vmState === 'ready' || vmState === 'executing' ? '#0d9488' : '#64748b',
                border: `1px solid ${vmState === 'ready' || vmState === 'executing' ? '#99f6e4' : '#cbd5e1'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title={`Hypervisor Status: ${vmState}. Main-Thread FPS: ${vmMetrics.currentFps || 60}. Zero-Copy Frames: ${vmMetrics.binaryFramesTransferred}.`}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background:
                    vmState === 'ready'
                      ? '#10b981'
                      : vmState === 'executing'
                      ? '#f59e0b'
                      : vmState === 'watchdog_timeout'
                      ? '#ef4444'
                      : '#94a3b8',
                  display: 'inline-block',
                }}
              />
              {vmState === 'executing'
                ? 'Hypervisor: Watchdog Armed'
                : vmState === 'ready'
                ? 'Hypervisor: Supervising'
                : vmState === 'watchdog_timeout'
                ? 'Hypervisor: Recycled'
                : 'Hypervisor: Active'}
            </span>

            {/* Thread Isolation & Zero-Copy Badge */}
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '6px',
                background: '#f0fdf4',
                color: '#166534',
                border: '1px solid #bbf7d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Inference runs 100% off-main-thread inside worker.html with zero-copy ArrayBuffer loopback"
            >
              <span>⚡</span>
              <span>{vmMetrics.currentFps || 60} FPS • Zero-Copy</span>
            </span>

            {/* Transparent Resource/Consent Interactive Badge */}
            <button
              type="button"
              onClick={() => {
                const nextState = !hasConsent;
                setUserAiConsent(nextState);
                requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, difficulty);
              }}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                background: hasConsent ? '#f0fdf4' : '#fffbeb',
                color: hasConsent ? '#15803d' : '#92400e',
                border: `1px solid ${hasConsent ? '#bbf7d0' : '#fde68a'}`,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title={
                hasConsent
                  ? 'On-Device Gemini Nano active (100% private). Click to switch to Eco Mode.'
                  : 'Fast offline mode. Click to enable on-device Gemini Nano live tutoring.'
              }
            >
              <span>{hasConsent ? '🧠' : '⚡'}</span>
              <span>{hasConsent ? 'Nano AI: Active' : 'Enable Nano AI'}</span>
            </button>

            {/* 2D Canvas AST Topology Toggle */}
            <button
              type="button"
              onClick={() => setShowCanvasTopology(!showCanvasTopology)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px',
                background: showCanvasTopology ? '#f0fdf4' : '#f8fafc',
                color: showCanvasTopology ? '#166534' : '#475569',
                border: `1px solid ${showCanvasTopology ? '#bbf7d0' : '#cbd5e1'}`,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              aria-pressed={showCanvasTopology}
              aria-label="Toggle 2D Neural AST Canvas and screen-reader mirror"
              title="Toggle interactive 2D Canvas Neural AST graph with full WCAG screen reader DOM mirror"
            >
              <span>🕸️</span>
              <span>{showCanvasTopology ? '2D Canvas: Active' : 'Show 2D Canvas'}</span>
            </button>
          </div>
        </div>

        {isGenerating ? (
          <div
            style={{
              height: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#475569' }}>
              🎯 Preparing your question for {selectedSubject}: {selectedUnit}...
            </div>
            <div style={{ width: '70%', height: '18px', background: '#f1f5f9', borderRadius: '6px' }} />
            <div style={{ width: '100%', height: '48px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <div style={{ width: '100%', height: '48px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <div style={{ width: '100%', height: '48px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          </div>
        ) : activeQuestion ? (
          <>
            {/* Interactive 2D Neural AST Canvas with Full Screen-Reader DOM Mirror (WCAG 2.1 AA) */}
            {showCanvasTopology && (
              <NeuralAstCanvasTopology
                prompt={activeQuestion.prompt}
                options={activeQuestion.displayOptions}
                selectedAnswer={selectedAnswer}
                correctIndex={correctIndex}
                onSelectOption={handleSelectOption}
                fps={vmMetrics.currentFps || 60}
                zeroCopyFrames={vmMetrics.binaryFramesTransferred}
              />
            )}

            <QuestionCard
              keyStage={activeQuestion.keyStage || selectedKeyStage}
              subject={activeQuestion.subject}
              unit={activeQuestion.unit}
              lessonTitle={activeQuestion.lessonTitle || selectedLesson || undefined}
              prompt={activeQuestion.prompt}
              displayOptions={activeQuestion.displayOptions}
              selectedAnswer={selectedAnswer}
              correctIndex={correctIndex}
              score={score}
              streak={streak}
              seedToken={activeQuestion.seedToken}
              pedagogicalStage={activeQuestion.pedagogicalStage}
              stageBadge={activeQuestion.stageBadge}
              stepLabel={activeQuestion.stepLabel}
              pedagogicalIntent={activeQuestion.pedagogicalIntent}
              urn={activeQuestion.urn}
              csn={activeQuestion.csn}
              routeEngine={activeQuestion.routeEngine}
              trajectoryState={trajectoryState}
              streamTransition={streamTransition}
              onSeedJump={(customSeed) => {
                requestQuestion(
                  selectedKeyStage,
                  selectedSubject,
                  selectedUnit,
                  difficulty,
                  activeLang,
                  false,
                  customSeed
                );
              }}
              hint={activeQuestion.hint}
              explanation={activeQuestion.explanation}
              misconceptions={activeQuestion.misconceptions}
              socraticFollowUp={activeQuestion.socraticFollowUp}
              currentLang={activeLang}
              onLanguageChange={(newLang) => {
                setActiveLang(newLang);
                requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, difficulty, newLang);
              }}
              onSelectOption={handleSelectOption}
              onNextQuestion={() => {
                const targetSeed = streamTransition?.nextSeedToken;
                requestQuestion(
                  selectedKeyStage,
                  selectedSubject,
                  selectedUnit,
                  difficulty,
                  activeLang,
                  false,
                  targetSeed
                );
              }}
              onParallelVariation={() => requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, difficulty, activeLang, true)}
            />
          </>
        ) : (
          <div
            style={{
              height: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '12px',
              color: '#64748b',
            }}
          >
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Ready to Practice</div>
            <div style={{ fontSize: '0.95rem' }}>
              Select your Stage, Subject, and Unit above, then click <strong>New Question</strong> to begin.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}