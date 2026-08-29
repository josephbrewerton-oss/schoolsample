// src/components/NeuralLabCanvas.tsx
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import { dispatch } from '../engine/hypercall';

interface NeuralLabCanvasProps {
  onTopicChange?: (keyStage: string, subject: string, unit: string) => void;
}

export default function NeuralLabCanvas({ onTopicChange }: NeuralLabCanvasProps) {
  const [curriculumSetting, setCurriculumSetting] = useState<string>(() => {
    return localStorage.getItem('curriculum_standard') || 'uk_oak';
  });

  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 1');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [selectedUnit, setSelectedUnit] = useState('Seasonal Changes');
  const [sessionId, setSessionId] = useState('Lesson 1');

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
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
    u = activeSelectionRef.current.unit
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
  }, [curriculumSetting, handleNewQuestion]);

  useEffect(() => {
    requestQuestion(selectedKeyStage, selectedSubject, selectedUnit);
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