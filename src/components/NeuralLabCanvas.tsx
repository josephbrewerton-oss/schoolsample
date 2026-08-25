// src/components/NeuralLabCanvas.tsx
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import { useWebRTCNeuralBus, QuestionPayload } from '../hooks/useWebRTCNeuralBus';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';
import { getActiveCurriculumTree, CurriculumProviderKey } from '../data/curriculumRegistry';

import { buildUniversalPrompt } from '@site/static/promptStrategies';
import { parseAST } from '../engine/ast-loader';
import { ASTFlowGovernor, RawASTQuestion } from '../engine/astGovernor';
import { runLocalInference } from '../engine/EdgeCognitiveEngine';

function normalizeASTToQuestion(parsed: any): RawASTQuestion | null {
  if (!parsed) return null;

  let options: string[] = [];
  if (Array.isArray(parsed.options)) {
    options = parsed.options.map((o: any) => (typeof o === 'object' ? o.children?.[0] || '' : String(o)));
  } else if (parsed.options?.children && Array.isArray(parsed.options.children)) {
    options = parsed.options.children.map((c: any) => (typeof c === 'object' ? c.children?.[0] || '' : String(c)));
  }

  const prompt = typeof parsed.prompt === 'object' ? parsed.prompt?.children?.[0] || '' : String(parsed.prompt || '');
  const scratchpad = typeof parsed.scratchpad === 'object' ? parsed.scratchpad?.children?.[0] || '' : String(parsed.scratchpad || '');
  const answerKey = Number(parsed['answer-key'] ?? parsed.answerKey ?? 0);

  return {
    route: parsed.route || 'quiz:mcq',
    prompt: prompt.trim(),
    scratchpad: scratchpad.trim(),
    options: options.filter(Boolean),
    answerKey: isNaN(answerKey) ? 0 : answerKey,
  };
}

export default function NeuralLabCanvas() {
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

  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 3');
  const [selectedSubject, setSelectedSubject] = useState('Science');
  const [selectedUnit, setSelectedUnit] = useState('Atomic Structure & Periodic Table');
  const [sessionId, setSessionId] = useState('Lesson 1');

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<{
    prompt: string;
    displayOptions: string[];
    keyStage: string;
    subject: string;
    unit: string;
  } | null>(null);

  const isGeneratingRef = useRef(false);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNewQuestion = useCallback((payload: QuestionPayload) => {
    isGeneratingRef.current = false;
    const { question, keyStage, subject, unit } = payload;

    const targetValue = question.options[question.answerKey] ?? question.options[0];
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);

    setCorrectIndex(shuffled.indexOf(targetValue));
    setSelectedAnswer(null);
    setActiveQuestion({
      prompt: question.prompt,
      displayOptions: shuffled,
      keyStage: keyStage || selectedKeyStage,
      subject: subject,
      unit: unit,
    });
  }, [selectedKeyStage]);

  const { isReady, status } = useWebRTCNeuralBus(handleNewQuestion);

  const requestQuestion = async (
    ks = selectedKeyStage, 
    sub = selectedSubject, 
    u = selectedUnit
  ) => {
    if (isGeneratingRef.current) return;
    isGeneratingRef.current = true;
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setCorrectIndex(null);

    const ksId = slugify(ks) || 'ks3';
    const subId = slugify(sub) || 'science';
    const unitId = slugify(u) || 'atomic-structure';

    try {
      const prompt = buildUniversalPrompt({
        subject: sub,
        topic: u,
        keyStage: ks,
        subjectId: subId,
        topicId: unitId,
        curriculum: curriculumSetting
      });

      console.log('[Prompt Generated]:', prompt);
      const rawContent = await runLocalInference(prompt);
      console.log('[Raw AI Response]:', rawContent);

      const parsedNode = parseAST(rawContent);
      console.log('[Parsed AST]:', parsedNode);

      const normalized = normalizeASTToQuestion(parsedNode);

      if (normalized) {
        const governed = ASTFlowGovernor.govern(normalized, sub, u);
        console.log('[Governor Result]:', governed);

        if (governed.isValid && governed.sanitizedQuestion) {
          handleNewQuestion({
            question: governed.sanitizedQuestion,
            keyStage: ks,
            subject: sub,
            unit: u
          });
          return;
        } else {
          console.warn('[AST Governor Rejection]:', governed.rejectionReason);
        }
      }
    } catch (err) {
      console.error('[Question Generation Error]:', err);
    } finally {
      isGeneratingRef.current = false;
    }
  };

  // Immediate initial question trigger on mount
  useEffect(() => {
    if (!activeQuestion && !isGeneratingRef.current) {
      requestQuestion(selectedKeyStage, selectedSubject, selectedUnit);
    }
  }, []);

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer === correctIndex) return;
    setSelectedAnswer(idx);
    if (idx === correctIndex) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleExportReport = async () => {
    try {
      const summary = await generateSessionReport(sessionId);
      downloadReportAsHtml(summary);
    } catch (err) {
      console.error('Failed to generate diagnostic report:', err);
    }
  };

  const isQuestionAligned =
    activeQuestion !== null &&
    activeQuestion.keyStage === selectedKeyStage &&
    activeQuestion.subject === selectedSubject &&
    activeQuestion.unit === selectedUnit;

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <CurriculumSelector
        keyStage={selectedKeyStage}
        subject={selectedSubject}
        unit={selectedUnit}
        status={status}
        isReady={isReady || true}
        sessionId={sessionId}
        curriculumTree={curriculumTree}
        onKeyStageChange={(newKs, firstSub, firstUnit) => {
          const sub = firstSub || 'Science';
          const unit = firstUnit || 'Atomic Structure & Periodic Table';
          setSelectedKeyStage(newKs);
          setSelectedSubject(sub);
          setSelectedUnit(unit);
          requestQuestion(newKs, sub, unit);
        }}
        onSubjectChange={(newSub, firstUnit) => {
          const unit = firstUnit || 'General';
          setSelectedSubject(newSub);
          setSelectedUnit(unit);
          requestQuestion(selectedKeyStage, newSub, unit);
        }}
        onUnitChange={(newUnit) => {
          setSelectedUnit(newUnit);
          requestQuestion(selectedKeyStage, selectedSubject, newUnit);
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
        {!isQuestionAligned ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
}