import React, { useState, useCallback } from 'react';
import { DEFAULT_OAK_CATALOGUE } from '../curriculum/oakCatalogue';
import { CurriculumSelector } from './CurriculumSelector';
import { QuestionCard } from './QuestionCard';
import { useWebRTCNeuralBus } from '../hooks/useWebRTCNeuralBus';
import { ExtractedQuestion } from '../utils/astQuestionExtractor';

export default function NeuralLabCanvas() {
  const [selectedKeyStage, setSelectedKeyStage] = useState('Key Stage 2');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedUnit, setSelectedUnit] = useState('Fractions and Decimals');

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

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <CurriculumSelector
        keyStage={selectedKeyStage}
        subject={selectedSubject}
        unit={selectedUnit}
        status={status}
        isReady={isReady}
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
        onNewQuestion={() => requestQuestion()}
      />

      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        minHeight: '480px'
      }}>
        {!activeQuestion ? (
          <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '1.25rem' }}>
            ⚡ Fast-splicing AST question archetype...
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