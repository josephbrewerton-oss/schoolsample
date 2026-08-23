import React, { useState, useCallback } from 'react';
import { DEFAULT_OAK_CATALOGUE } from '../curriculum/oakCatalogue';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import { useWebRTCNeuralBus } from '../hooks/useWebRTCNeuralBus';
import { ExtractedQuestion } from '../utils/astQuestionExtractor';
import { generateSessionReport, downloadReportAsHtml } from '../utils/sessionReporter';

export default function NeuralLabCanvas() {
  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 2');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedUnit, setSelectedUnit] = useState('Fractions and Decimals');
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

  const handleNewQuestion = useCallback((q: ExtractedQuestion) => {
    const targetValue = q.options[q.answerKey] ?? q.options[0];
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);

    setCorrectIndex(shuffled.indexOf(targetValue));
    setSelectedAnswer(null);
    setActiveQuestion({
      prompt: q.prompt,
      displayOptions: shuffled,
      subject: selectedSubject,
      unit: selectedUnit
    });
  }, [selectedSubject, selectedUnit]);

  const { isReady, status, sendIntent } = useWebRTCNeuralBus(handleNewQuestion);

  const requestQuestion = (ks = selectedKeyStage, sub = selectedSubject, u = selectedUnit) => {
    setActiveQuestion(null);
    setSelectedAnswer(null);
    setCorrectIndex(null);
    sendIntent(ks, sub, u);
  };

  React.useEffect(() => {
    if (isReady && !activeQuestion) {
      requestQuestion(selectedKeyStage, selectedSubject, selectedUnit);
    }
  }, [isReady]);  

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer === correctIndex) return;
    setSelectedAnswer(idx);
    if (idx === correctIndex) {
      setScore(s => s + 1);
      setStreak(st => st + 1);
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
      {/* Background WebRTC Daemon Worker Frame */}
      <iframe
        src="/schoolsample/worker.html"
        style={{ display: 'none', width: 0, height: 0, border: 'none' }}
        title="WebRTC Neural Worker Daemon"
        aria-hidden="true"
      />

      <CurriculumSelector
        keyStage={selectedKeyStage}
        subject={selectedSubject}
        unit={selectedUnit}
        status={status}
        isReady={isReady}
        sessionId={sessionId}
        onKeyStageChange={(ks) => {
          const firstSub = Object.keys(DEFAULT_OAK_CATALOGUE[ks] || {})[0] || '';
          const firstUnit = DEFAULT_OAK_CATALOGUE[ks]?.[firstSub]?.[0] || '';
          setSelectedKeyStage(ks);
          setSelectedSubject(firstSub);
          setSelectedUnit(firstUnit);
          requestQuestion(ks, firstSub, firstUnit);
        }}
        onSubjectChange={(sub) => {
          const firstUnit = DEFAULT_OAK_CATALOGUE[selectedKeyStage]?.[sub]?.[0] || '';
          setSelectedSubject(sub);
          setSelectedUnit(firstUnit);
          requestQuestion(selectedKeyStage, sub, firstUnit);
        }}
        onUnitChange={(u) => {
          setSelectedUnit(u);
          requestQuestion(selectedKeyStage, selectedSubject, u);
        }}
        onSessionIdChange={setSessionId}
        onNewQuestion={() => requestQuestion()}
        onDownloadReport={handleExportReport}
      />

      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        minHeight: '540px',
        boxSizing: 'border-box'
      }}>
        {!activeQuestion ? (
          <div style={{ height: '440px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>
              ⚡ Fast-splicing AST question archetype...
            </div>
            {/* Structural skeleton to preserve identical vertical height */}
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
            onNextQuestion={() => requestQuestion()}
          />
        )}
      </div>
    </div>
  );
}