// src/components/NeuralLabCanvas.tsx
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import { useWebRTCNeuralBus, QuestionPayload } from '../hooks/useWebRTCNeuralBus';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';

import { buildUniversalPrompt } from '@site/static/promptStrategies';
import { parseAST } from '../engine/ast-loader';
import { ASTFlowGovernor, RawASTQuestion } from '../engine/astGovernor';
import { runLocalInference } from '../engine/EdgeCognitiveEngine';
import { logProgress, getBufferedQuestion, saveVerifiedAST } from '../services/dbStore';
import { PromptASTPreparser } from '../engine/promptAstparser';

interface NormalizedQuestion extends RawASTQuestion {
  hint?: string;
}

function normalizeASTToQuestion(parsed: any): NormalizedQuestion | null {
  if (!parsed) return null;

  let options: string[] = [];
  if (Array.isArray(parsed.options)) {
    options = parsed.options.map((o: any) => (typeof o === 'object' ? o.children?.[0] || '' : String(o)));
  } else if (parsed.options?.children && Array.isArray(parsed.options.children)) {
    options = parsed.options.children.map((c: any) => (typeof c === 'object' ? c.children?.[0] || '' : String(c)));
  }

  const prompt = typeof parsed.prompt === 'object' ? parsed.prompt?.children?.[0] || '' : String(parsed.prompt || '');
  const scratchpad = typeof parsed.scratchpad === 'object' ? parsed.scratchpad?.children?.[0] || '' : String(parsed.scratchpad || '');
  const hint = typeof parsed.hint === 'object' ? parsed.hint?.children?.[0] || '' : String(parsed.hint || '');
  const answerKey = Number(parsed['answer-key'] ?? parsed.answerKey ?? 0);

  return {
    route: parsed.route || 'quiz:mcq',
    prompt: prompt.trim(),
    scratchpad: scratchpad.trim(),
    hint: hint.trim(),
    options: options.filter(Boolean),
    answerKey: isNaN(answerKey) ? 0 : answerKey,
  };
}

export default function NeuralLabCanvas() {
  const [curriculumSetting, setCurriculumSetting] = useState<CurriculumProviderKey>(() => {
    return (localStorage.getItem('curriculum_standard') as CurriculumProviderKey) || 'uk_oak';
  });

  const workerUrl = useBaseUrl('/worker.html');

  // Stable BroadcastChannel references to eliminate GC teardown race conditions
  const hypervisorBusRef = useRef<BroadcastChannel | null>(null);
  const voiceBusRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    hypervisorBusRef.current = new BroadcastChannel('neural_hypervisor_bus');
    voiceBusRef.current = new BroadcastChannel('neural_voice_bus');

    return () => {
      hypervisorBusRef.current?.close();
      voiceBusRef.current?.close();
    };
  }, []);

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

  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 3');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [selectedUnit, setSelectedUnit] = useState('Atomic Structure & Periodic Table');
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

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

    const targetValue = question.options[question.answerKey] ?? question.options[0];
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);

    setCorrectIndex(shuffled.indexOf(targetValue));
    setSelectedAnswer(null);
    setActiveQuestion({
      id: question.id,
      prompt: question.prompt,
      displayOptions: shuffled,
      rawOptions: question.options,
      hint: (question as any).hint || payload.hint,
      keyStage: keyStage || selectedKeyStage,
      subject: subject,
      unit: unit,
    });
  }, [selectedKeyStage]);

  const { isReady, status, sendIntent } = useWebRTCNeuralBus(handleNewQuestion);

  const requestQuestion = async (
    ks = selectedKeyStage, 
    sub = selectedSubject, 
    u = selectedUnit
  ) => {
    const requestId = ++activeRequestIdRef.current;
    setIsGenerating(true);
    setSelectedAnswer(null);
    setCorrectIndex(null);

    const ksId = slugify(ks) || 'ks3';
    const subId = slugify(sub) || 'science';
    const unitId = slugify(u) || 'atomic-structure';
    const topicKey = `${ksId}_${subId}_${unitId}`;

    try {
      // 1. FAST PATH: Check IndexedDB buffer cache
      const cachedRawAST = await getBufferedQuestion(topicKey);
      if (requestId !== activeRequestIdRef.current) return;

      if (cachedRawAST) {
        const parsedCached = parseAST(cachedRawAST);
        const normalizedCached = normalizeASTToQuestion(parsedCached);
        if (normalizedCached) {
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

      // 2. BUS PATH: Dispatch intent to background WebRTC Daemon if active
      if (sendIntent && isReady) {
        const sent = sendIntent(ks, sub, u, ksId, subId, unitId, curriculumSetting);
        if (sent) return;
      }

      // 3. IN-PAGE FALLBACK: Local Edge Engine execution
// 3. IN-PAGE FALLBACK: Local Edge Engine execution with AST Pre-Parsing
      const prompt = PromptASTPreParser.parseForInference({
        subject: sub,
        topic: u,
        keyStage: ks,
        curriculum: curriculumSetting,
      });

      console.log('[Token-Optimized AST Prompt]:', prompt);
      const rawContent = await runLocalInference(prompt);
      if (requestId !== activeRequestIdRef.current) return;

      console.log('[Raw AI Response]:', rawContent);
      const parsedNode = parseAST(rawContent);
      const normalized = normalizeASTToQuestion(parsedNode);

      if (normalized) {
        const governed = ASTFlowGovernor.govern(normalized, sub, u);
        if (governed.isValid && governed.sanitizedQuestion) {
          saveVerifiedAST(topicKey, rawContent).catch(console.error);
          const hintText = normalized.hint || (parsedNode as any)?.hint || '';

          handleNewQuestion({
            question: { 
              ...governed.sanitizedQuestion, 
              hint: hintText 
            },
            keyStage: ks,
            subject: sub,
            unit: u,
            hint: hintText
          });
          return;
        } else {
          console.warn('[AST Governor Rejection]:', governed.rejectionReason);
        }
      }
    } catch (err) {
      if (requestId === activeRequestIdRef.current) {
        console.error('[Question Generation Error]:', err);
      }
    } finally {
      if (requestId === activeRequestIdRef.current && !isReady) {
        setIsGenerating(false);
      }
    }
  };

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer === correctIndex || !activeQuestion || correctIndex === null) {
      return;
    }

    setSelectedAnswer(idx);
    const isCorrect = idx === correctIndex;

    const feedbackText = isCorrect
      ? 'Spot on! Correct conceptual deduction.'
      : sanitizeHint(activeQuestion.hint);

    const feedbackPayload = {
      type: 'TURING_FEEDBACK',
      message: feedbackText,
      isCorrect,
    };

    // Instant Socratic notification across both bus channels
    hypervisorBusRef.current?.postMessage(feedbackPayload);
    voiceBusRef.current?.postMessage(feedbackPayload);

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }

    const topicId = `${slugify(activeQuestion.subject)}_${slugify(activeQuestion.unit)}`;
    logProgress({
      cohortCode: sessionId || 'default_cohort',
      challengeId: activeQuestion.id || `ch_${Date.now()}`,
      topicId: topicId,
      answeredAt: Date.now(),
      isCorrect,
      userAnswer: activeQuestion.displayOptions[idx],
      errorTag: isCorrect ? undefined : 'concept_misconception'
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
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <CurriculumSelector
        keyStage={selectedKeyStage}
        subject={selectedSubject}
        unit={selectedUnit}
        status={status}
        isReady={isReady}
        sessionId={sessionId}
        curriculumTree={curriculumTree}
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
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          minHeight: '540px',
          boxSizing: 'border-box',
        }}
      >
        {isGenerating ? (
          <div
            style={{
              height: '440px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>
              ⚡ Fast-splicing AST question archetype for {selectedSubject}: {selectedUnit}...
            </div>
            <div style={{ width: '75%', height: '20px', background: '#f1f5f9', borderRadius: '6px' }} />
            <div style={{ width: '100%', height: '52px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            <div style={{ width: '100%', height: '52px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
            <div style={{ width: '100%', height: '52px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
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
              height: '440px',
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

      {/* Background WebRTC Daemon */}
      <iframe
        src={workerUrl}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          border: 'none',
        }}
        title="neural-worker-daemon"
      />
    </div>
  );
}