// src/components/NeuralLabCanvas.tsx
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import { dispatch } from '../engine/hypercall';
import { hasUserGrantedAiConsent } from '../engine/aicaller';
import { getSavedLanguage, listenToLanguageChange } from '../engine/operational-language';

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

  useEffect(() => {
    setHasConsent(hasUserGrantedAiConsent());
    const onConsentChanged = (e: any) => setHasConsent(Boolean(e.detail));
    window.addEventListener('ai_consent_changed', onConsentChanged);
    window.addEventListener('storage', () => setHasConsent(hasUserGrantedAiConsent()));
    return () => window.removeEventListener('ai_consent_changed', onConsentChanged);
  }, []);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<{
    id?: string;
    prompt: string;
    displayOptions: string[];
    rawOptions: string[];
    hint?: string;
    keyStage: string;
    subject: string;
    unit: string;
  } | null>(null);

  const activeRequestIdRef = useRef(0);
  const activeSelectionRef = useRef({
    keyStage: selectedKeyStage,
    subject: selectedSubject,
    unit: selectedUnit,
  });

  useEffect(() => {
    activeSelectionRef.current = {
      keyStage: selectedKeyStage,
      subject: selectedSubject,
      unit: selectedUnit,
    };
  }, [selectedKeyStage, selectedSubject, selectedUnit]);

  // 1. Resolve Curriculum via Unified Node Dispatch
  const [curriculumTree, setCurriculumTree] = useState<any>(null);
  useEffect(() => {
    dispatch('CurriculumNode', {
      intent: 'resolve:tree',
      payload: { stage: selectedKeyStage },
    }).then((res) => {
      if (res.ok) setCurriculumTree(res.data);
    });
  }, [selectedKeyStage]);

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
    const targetValue = question.options[rawKey] ?? question.options[0];

    const shuffled = [...question.options].sort(() => Math.random() - 0.5);
    const computedCorrectIndex = shuffled.indexOf(targetValue);
    setCorrectIndex(computedCorrectIndex !== -1 ? computedCorrectIndex : 0);
    setSelectedAnswer(null);

    setActiveQuestion({
      id: question.id || `q_${Date.now()}`,
      prompt: question.prompt,
      displayOptions: shuffled,
      rawOptions: question.options,
      hint: question.hint || payload.hint || '',
      keyStage: keyStage || activeSelectionRef.current.keyStage,
      subject: subject || activeSelectionRef.current.subject,
      unit: unit || activeSelectionRef.current.unit,
    });
  }, []);

  // 2. Request Question via Unified Node Dispatch (Cache -> Bus -> LLM synthesis handled in engine)
  const requestQuestion = useCallback(async (
    ks = activeSelectionRef.current.keyStage,
    sub = activeSelectionRef.current.subject,
    u = activeSelectionRef.current.unit,
    diff = difficulty,
    targetLang = activeLang
  ) => {
    const requestId = ++activeRequestIdRef.current;
    setIsGenerating(true);
    setSelectedAnswer(null);
    setCorrectIndex(null);

    try {
      const res = await dispatch('QuestionEngine', {
        intent: 'synthesize:governed',
        payload: {
          keyStage: ks,
          subject: sub,
          topic: u,
          curriculum: curriculumSetting,
          difficulty: diff,
          lang: targetLang,
        },
      });

      if (requestId !== activeRequestIdRef.current) return;

      if (res.ok && res.data) {
        handleNewQuestion({
          question: res.data,
          keyStage: ks,
          subject: sub,
          unit: u,
          hint: res.data.hint || '',
        });
      }
    } catch (err) {
      if (requestId === activeRequestIdRef.current) {
        console.error('[Dispatch Error]:', err);
      }
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsGenerating(false);
      }
    }
  }, [curriculumSetting, difficulty, activeLang, handleNewQuestion]);

  const handleDifficultyChange = (newDiff: 'warmup' | 'challenger' | 'brainbuster') => {
    setDifficulty(newDiff);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_difficulty', newDiff);
    }
    requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, newDiff);
  };

  useEffect(() => {
    requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, difficulty);
  }, [selectedKeyStage, selectedSubject, selectedUnit, curriculumSetting, requestQuestion]);

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

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }

    // Record Metrics
    dispatch('TelemetryNode', {
      intent: 'record:answer',
      payload: {
        cohortCode: sessionId || 'default_cohort',
        challengeId: activeQuestion.id,
        topicId: `${slugify(activeQuestion.subject)}_${slugify(activeQuestion.unit)}`,
        isCorrect,
        userAnswer: activeQuestion.displayOptions[idx],
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
        status="online"
        isReady={!isGenerating}
        sessionId={sessionId}
        curriculumTree={curriculumTree}
        buttonLabel={isGenerating ? '⚡ Generating...' : 'New Question'}
        onKeyStageChange={(newKs, firstSub, firstUnit) => {
          setSelectedKeyStage(newKs);
          if (firstSub) setSelectedSubject(firstSub);
          if (firstUnit) setSelectedUnit(firstUnit);
        }}
        onSubjectChange={(newSub, firstUnit) => {
          setSelectedSubject(newSub);
          if (firstUnit) setSelectedUnit(firstUnit);
        }}
        onUnitChange={(newUnit) => setSelectedUnit(newUnit)}
        onSessionIdChange={setSessionId}
        onNewQuestion={() => requestQuestion(selectedKeyStage, selectedSubject, selectedUnit)}
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

            {/* Transparent Resource/Consent Badge */}
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                background: hasConsent ? '#f0fdf4' : '#f8fafc',
                color: hasConsent ? '#15803d' : '#475569',
                border: `1px solid ${hasConsent ? '#bbf7d0' : '#e2e8f0'}`,
              }}
              title={
                hasConsent
                  ? 'On-Device AI Active (Permitted by user). Zero cloud telemetry.'
                  : 'Eco Mode (Default). Zero data downloads. Verified offline curriculum.'
              }
            >
              {hasConsent ? '🧠 Device AI Permitted' : '🌱 Eco Mode (Zero Download)'}
            </span>
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
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#64748b' }}>
              ⚡ Synthesizing & governing question for {selectedSubject}: {selectedUnit}...
            </div>
            <div style={{ width: '70%', height: '18px', background: '#f1f5f9', borderRadius: '6px' }} />
            <div style={{ width: '100%', height: '48px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <div style={{ width: '100%', height: '48px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <div style={{ width: '100%', height: '48px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          </div>
        ) : activeQuestion ? (
          <QuestionCard
            subject={activeQuestion.subject}
            unit={activeQuestion.unit}
            prompt={activeQuestion.prompt}
            displayOptions={activeQuestion.displayOptions}
            selectedAnswer={selectedAnswer}
            correctIndex={correctIndex}
            score={score}
            streak={streak}
            hint={activeQuestion.hint}
            currentLang={activeLang}
            onLanguageChange={(newLang) => {
              setActiveLang(newLang);
              requestQuestion(selectedKeyStage, selectedSubject, selectedUnit, difficulty, newLang);
            }}
            onSelectOption={handleSelectOption}
            onNextQuestion={() => requestQuestion(selectedKeyStage, selectedSubject, selectedUnit)}
          />
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