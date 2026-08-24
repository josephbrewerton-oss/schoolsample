// src/components/NeuralLabCanvas.tsx
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import { useWebRTCNeuralBus, QuestionPayload } from '../hooks/useWebRTCNeuralBus';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';

export default function NeuralLabCanvas() {
  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 3');
  const [selectedSubject, setSelectedSubject] = useState('History');
  const [selectedUnit, setSelectedUnit] = useState('The Norman Conquest (1066)');
  const [sessionId, setSessionId] = useState('Lesson 1');

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<{
    prompt: string;
    displayOptions: string[];
    subject: string;
    unit: string;
  } | null>(null);

  const isGeneratingRef = useRef(false);

  const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleNewQuestion = useCallback((payload: QuestionPayload) => {
    isGeneratingRef.current = false;
    const { question, subject, unit } = payload;

    const targetValue = question.options[question.answerKey] ?? question.options[0];
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);

    setCorrectIndex(shuffled.indexOf(targetValue));
    setSelectedAnswer(null);
    setActiveQuestion({
      prompt: question.prompt,
      displayOptions: shuffled,
      subject: subject,
      unit: unit,
    });
  }, []);

  const { isReady, status, sendIntent } = useWebRTCNeuralBus(handleNewQuestion);

  const requestQuestion = (ks = selectedKeyStage, sub = selectedSubject, u = selectedUnit) => {
    isGeneratingRef.current = true;
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setCorrectIndex(null);

    const ksId = slugify(ks) || 'ks3';
    const subId = slugify(sub) || 'history';
    const unitId = slugify(u) || 'norman-conquest';

    sendIntent(ks, sub, u, ksId, subId, unitId);
  };

  // Initial boot trigger once daemon is ready
  useEffect(() => {
    if (isReady && !activeQuestion && !isGeneratingRef.current) {
      requestQuestion('Key Stage 3', 'History', 'The Norman Conquest (1066)');
    }
  }, [isReady]);

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

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <CurriculumSelector
        keyStage={selectedKeyStage}
        subject={selectedSubject}
        unit={selectedUnit}
        status={status}
        isReady={isReady}
        sessionId={sessionId}
        onKeyStageChange={(newKs, firstSub, firstUnit) => {
          setSelectedKeyStage(newKs);
          setSelectedSubject(firstSub);
          setSelectedUnit(firstUnit);
          requestQuestion(newKs, firstSub, firstUnit);
        }}
        onSubjectChange={(newSub, firstUnit) => {
          setSelectedSubject(newSub);
          setSelectedUnit(firstUnit);
          requestQuestion(selectedKeyStage, newSub, firstUnit);
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
        {!activeQuestion ? (
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
              ⚡ Fast-splicing AST question archetype...
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