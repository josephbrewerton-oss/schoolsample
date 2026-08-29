// src/components/NeuralLabCanvas.tsx
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import { useWebRTCNeuralBus, QuestionPayload } from '../hooks/useWebRTCNeuralBus';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';
import { EngineFlow } from '../engine/engineflow';
import { ComponentsFlow } from './componentsflow';
import { getBufferedQuestion } from '../services/dbStore';

interface NeuralLabCanvasProps {
  onTopicChange?: (keyStage: string, subject: string, unit: string) => void;
}

export default function NeuralLabCanvas({ onTopicChange }: NeuralLabCanvasProps) {
  const [curriculumSetting, setCurriculumSetting] = useState<CurriculumProviderKey>(() => {
    return (localStorage.getItem('curriculum_standard') as CurriculumProviderKey) || 'uk_oak';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('curriculum_standard') as CurriculumProviderKey;
      if (saved && saved !== curriculumSetting) {
        setCurriculumSetting(saved);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [curriculumSetting]);

  const curriculumTree = useMemo(() => {
    return getActiveCurriculumTree(curriculumSetting);
  }, [curriculumSetting]);

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

  // Keep a live ref of user selections to avoid async stale closures
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

  const handleNewQuestion = useCallback((payload: QuestionPayload & { hint?: string }) => {
    setIsGenerating(false);
    const { question, keyStage, subject, unit } = payload;

    if (!question || !Array.isArray(question.options) || question.options.length < 2) {
      console.warn('[NeuralLabCanvas] Invalid question payload:', payload);
      return;
    }

    // 1. Resolve canonical answer
    const rawKey = typeof question.answerKey === 'number' ? question.answerKey : 0;
    const targetValue = question.options[rawKey] ?? question.options[0];

    // 2. Fisher-Yates shuffle
    const shuffled = [...question.options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const computedCorrectIndex = shuffled.indexOf(targetValue);
    setCorrectIndex(computedCorrectIndex !== -1 ? computedCorrectIndex : 0);
    setSelectedAnswer(null);

    // 3. Fallback to active selection if payload is missing metadata
    const resolvedKs = keyStage || activeSelectionRef.current.keyStage;
    const resolvedSub = subject || activeSelectionRef.current.subject;
    const resolvedUnit = unit || activeSelectionRef.current.unit;

    setActiveQuestion({
      id: question.id || `q_${Date.now()}`,
      prompt: question.prompt,
      displayOptions: shuffled,
      rawOptions: question.options,
      hint: (question as any).hint || payload.hint || '',
      keyStage: resolvedKs,
      subject: resolvedSub,
      unit: resolvedUnit,
    });
  }, []);

  const { isReady, sendIntent } = useWebRTCNeuralBus(handleNewQuestion);

  // Sync topic changes to parent
  useEffect(() => {
    if (onTopicChange) {
      onTopicChange(selectedKeyStage, selectedSubject, selectedUnit);
    }
  }, [selectedKeyStage, selectedSubject, selectedUnit, onTopicChange]);

  const requestQuestion = useCallback(async (
    ks = activeSelectionRef.current.keyStage, 
    sub = activeSelectionRef.current.subject, 
    u = activeSelectionRef.current.unit
  ) => {
    const requestId = ++activeRequestIdRef.current;
    setIsGenerating(true);
    setSelectedAnswer(null);
    setCorrectIndex(null);

    const ksId = slugify(ks) || 'ks1';
    const subId = slugify(sub) || 'science';
    const unitId = slugify(u) || 'seasonal-changes';
    const topicKey = `${ksId}_${subId}_${unitId}`;

    try {
      // 1. FAST PATH: Check IndexedDB buffer cache
      const cachedRawAST = await getBufferedQuestion(topicKey);
      if (requestId !== activeRequestIdRef.current) return;

      if (cachedRawAST && !cachedRawAST.includes('<STEM>')) {
        const parsedCached = EngineFlow.parse(cachedRawAST);
        const normalizedCached = EngineFlow.normalizeASTToQuestion(parsedCached);
        if (normalizedCached && normalizedCached.options.length >= 2) {
          const hintText = normalizedCached.hint || (parsedCached as any)?.hint || '';
          handleNewQuestion({
            question: {
              ...normalizedCached,
              hint: hintText
            },
            keyStage: ks,
            subject: sub,
            unit: u,
            hint: hintText
          });
          return;
        }
      }

      // 2. BUS PATH: Signal WebRTC daemon if ready
      if (sendIntent && isReady) {
        sendIntent(ks, sub, u, ksId, subId, unitId, curriculumSetting);
      }

      // 3. DIRECT ENGINE PIPELINE: Local Nano execution & AST Governance
      const governed = await EngineFlow.synthesizeGovernedQuestion({
        subject: sub,
        topic: u,
        keyStage: ks,
        curriculum: curriculumSetting,
        isQuiz: true,
      });

      if (requestId !== activeRequestIdRef.current) return;

      if (governed?.isValid && governed.sanitizedQuestion) {
        const hintText = (governed.sanitizedQuestion as any).hint || '';
        handleNewQuestion({
          question: {
            ...governed.sanitizedQuestion,
            hint: hintText,
          },
          keyStage: ks,
          subject: sub,
          unit: u,
          hint: hintText,
        });
      } else {
        console.warn('[AST EngineFlow Rejection]:', governed?.rejectionReason);
      }
    } catch (err) {
      if (requestId === activeRequestIdRef.current) {
        console.error('[Question Generation Error]:', err);
      }
    } finally {
      if (requestId === activeRequestIdRef.current) {
        setIsGenerating(false);
      }
    }
  }, [curriculumSetting, handleNewQuestion, isReady, sendIntent]);

  // Initial load
  useEffect(() => {
    requestQuestion(selectedKeyStage, selectedSubject, selectedUnit);
  }, [selectedKeyStage, selectedSubject, selectedUnit, curriculumSetting, requestQuestion]);

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer === correctIndex || !activeQuestion || correctIndex === null) {
      return;
    }

    setSelectedAnswer(idx);
    const isCorrect = idx === correctIndex;

    const feedbackText = isCorrect
      ? 'Spot on! Correct conceptual deduction.'
      : sanitizeHint(activeQuestion.hint);

    ComponentsFlow.emitFeedback(feedbackText, isCorrect);

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }

    const topicId = `${slugify(activeQuestion.subject)}_${slugify(activeQuestion.unit)}`;
    ComponentsFlow.recordProgress({
      cohortCode: sessionId || 'default_cohort',
      challengeId: activeQuestion.id || `ch_${Date.now()}`,
      topicId,
      isCorrect,
      userAnswer: activeQuestion.displayOptions[idx],
    }).catch(console.error);
  };

  const handleExportReport = async () => {
    try {
      const summary = await generateSessionReport(sessionId);
      downloadReportAsHtml(summary);
    } catch (err) {
      console.error('Failed to generate diagnostic report:', err);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '1rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <CurriculumSelector
        keyStage={selectedKeyStage}
        subject={selectedSubject}
        unit={selectedUnit}
        status={isReady ? 'online' : 'compiling'}
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
        onUnitChange={(newUnit) => {
          setSelectedUnit(newUnit);
        }}
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
              color: '#64748b'
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