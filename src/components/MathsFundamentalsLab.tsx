// src/components/MathsFundamentalsLab.tsx
/**
 * Mathematical Fundamentals Visual Physics Lab
 * 
 * Features:
 * 1. BODMAS / BIDMAS Interactive Forcefield & Magnetic Clamping Engine
 *    - Concrete Area Model (why multiplication clamps before loose addition)
 *    - Titanium Bracket Shield & Exponent Flare
 *    - "Break the Rule / Try the Wrong Way!" Cognitive Trap Exploder
 *    - Left-to-Right Equal Precedence Trap (10 - 3 + 2 != 5)
 * 2. Visual Times Tables & Distributive Splitter (12x12 Array)
 *    - Commutative 90° Rotation
 *    - Mental arithmetic decomposition: 7 x 8 = (7 x 5) + (7 x 3) = 56
 * 3. Mastery Challenge Drills with Audio & Confetti
 */

import React, { useState, useEffect } from 'react';
import {
  playSuccessChime,
  playIncorrectTone,
  playClickTone,
  triggerHapticSuccess,
  triggerHapticClick,
} from '../services/soundHaptics';
import { triggerCorrectConfetti, triggerMasteryConfetti } from '../utils/confetti';
import { speakInLanguage } from '../engine/translationService';

export interface MathsFundamentalsLabProps {
  onClose?: () => void;
  initialTab?: 'bodmas' | 'times-tables' | 'challenge';
}

interface BodmasProblem {
  id: string;
  expression: string;
  title: string;
  trapWarning: string;
  steps: {
    ruleName: string;
    subExpression: string;
    action: string;
    currentEquation: string;
    explanation: string;
  }[];
  wrongPath: {
    wrongFirstOp: string;
    wrongCalculation: string;
    wrongResult: number;
    explanation: string;
  };
  areaModel?: {
    looseCount: number;
    rows: number;
    cols: number;
    looseLabel: string;
    gridLabel: string;
  };
}

const BODMAS_PROBLEMS: BodmasProblem[] = [
  {
    id: 'classic-trap',
    expression: '5 + 3 × 4',
    title: 'The Classic Trap (5 + 3 × 4)',
    trapWarning: 'Common slip: reading left-to-right (5 + 3 = 8, 8 × 4 = 32). This is WRONG!',
    steps: [
      {
        ruleName: 'M (Multiplication)',
        subExpression: '3 × 4',
        action: 'Magnetic Clamp snaps 3 and 4 together',
        currentEquation: '5 + (12)',
        explanation: '3 groups of 4 is an area of 12 items. Multiplication must evaluate first!',
      },
      {
        ruleName: 'A (Addition)',
        subExpression: '5 + 12',
        action: 'Combine loose 5 with 12',
        currentEquation: '17',
        explanation: 'Add the 5 loose items to the 12 items to get the true answer: 17.',
      },
    ],
    wrongPath: {
      wrongFirstOp: '5 + 3',
      wrongCalculation: '8 × 4',
      wrongResult: 32,
      explanation: 'You turned 3 groups of 4 into 8 groups of 4! You magically invented 20 extra items out of thin air!',
    },
    areaModel: {
      looseCount: 5,
      rows: 3,
      cols: 4,
      looseLabel: '5 loose coins (+)',
      gridLabel: '3 × 4 solid grid (12 tiles)',
    },
  },
  {
    id: 'bracket-shield',
    expression: '(12 - 4) ÷ 2 + 3²',
    title: 'Brackets & Indices Shield: (12 - 4) ÷ 2 + 3²',
    trapWarning: 'Never divide before solving what is locked inside the bracket shield!',
    steps: [
      {
        ruleName: 'B (Brackets Shield)',
        subExpression: '(12 - 4)',
        action: 'Titanium Shield resolves inside first',
        currentEquation: '8 ÷ 2 + 3²',
        explanation: 'Brackets protect terms inside. 12 - 4 simplifies to 8.',
      },
      {
        ruleName: 'O / I (Orders & Powers)',
        subExpression: '3²',
        action: 'Exponent flares into repeated product (3 × 3)',
        currentEquation: '8 ÷ 2 + 9',
        explanation: '3 squared means 3 × 3 = 9.',
      },
      {
        ruleName: 'D (Division)',
        subExpression: '8 ÷ 2',
        action: 'High-voltage clamp splits 8 by 2',
        currentEquation: '4 + 9',
        explanation: 'Division takes precedence over addition. 8 ÷ 2 = 4.',
      },
      {
        ruleName: 'A (Addition)',
        subExpression: '4 + 9',
        action: 'Merge remaining ribbon',
        currentEquation: '13',
        explanation: 'Final addition gives 13.',
      },
    ],
    wrongPath: {
      wrongFirstOp: '2 + 3²',
      wrongCalculation: '(12 - 4) ÷ 11',
      wrongResult: 0.72,
      explanation: 'You tried to add before division! Division has higher magnetic precedence than addition.',
    },
  },
  {
    id: 'equal-precedence',
    expression: '10 - 3 + 2',
    title: 'Equal Precedence Left-to-Right: 10 - 3 + 2',
    trapWarning: 'Huge SATs Trap: Addition does NOT beat subtraction! They have equal rank and MUST go left to right!',
    steps: [
      {
        ruleName: 'Left-to-Right (Subtraction first)',
        subExpression: '10 - 3',
        action: 'Evaluate from left because + and - are equal rank',
        currentEquation: '7 + 2',
        explanation: 'Because - and + have equal rank, we must go left to right: 10 - 3 = 7.',
      },
      {
        ruleName: 'Left-to-Right (Addition)',
        subExpression: '7 + 2',
        action: 'Complete the ribbon',
        currentEquation: '9',
        explanation: '7 + 2 = 9. The correct answer is 9, NOT 5!',
      },
    ],
    wrongPath: {
      wrongFirstOp: '3 + 2',
      wrongCalculation: '10 - 5',
      wrongResult: 5,
      explanation: 'Tricked by the acronym! Blindly doing addition first turned "take away 3 then add 2" into "take away 5"!',
    },
    areaModel: {
      looseCount: 10,
      rows: 1,
      cols: 3,
      looseLabel: '10 start items',
      gridLabel: 'Take 3 away, then add 2',
    },
  },
  {
    id: 'div-mult-race',
    expression: '24 ÷ 4 × 2',
    title: 'Division & Multiplication Race: 24 ÷ 4 × 2',
    trapWarning: 'Multiplication does not beat division! Equal rank means strictly left to right.',
    steps: [
      {
        ruleName: 'Left-to-Right (Division first)',
        subExpression: '24 ÷ 4',
        action: 'Leftmost operator evaluates first',
        currentEquation: '6 × 2',
        explanation: '24 ÷ 4 = 6.',
      },
      {
        ruleName: 'Left-to-Right (Multiplication)',
        subExpression: '6 × 2',
        action: 'Complete remaining product',
        currentEquation: '12',
        explanation: '6 × 2 = 12. Correct answer is 12, NOT 3!',
      },
    ],
    wrongPath: {
      wrongFirstOp: '4 × 2',
      wrongCalculation: '24 ÷ 8',
      wrongResult: 3,
      explanation: 'You multiplied 4 × 2 = 8 first, getting 24 ÷ 8 = 3. Division and multiplication are equal partners—go left to right!',
    },
  },
];

export default function MathsFundamentalsLab({
  onClose,
  initialTab = 'bodmas',
}: MathsFundamentalsLabProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'bodmas' | 'times-tables' | 'challenge'>(initialTab);

  // BODMAS state
  const [selectedProblemIdx, setSelectedProblemIdx] = useState(0);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [showWrongExplosion, setShowWrongExplosion] = useState(false);
  const [showAreaModel, setShowAreaModel] = useState(true);

  // Times tables state
  const [factorX, setFactorX] = useState(7);
  const [factorY, setFactorY] = useState(8);
  const [isRotated, setIsRotated] = useState(false);
  const [isSplitMode, setIsSplitMode] = useState(true);

  // Challenge state
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengeScore, setChallengeScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const currentProblem = BODMAS_PROBLEMS[selectedProblemIdx];

  const handleSelectProblem = (idx: number) => {
    setSelectedProblemIdx(idx);
    setActiveStepIdx(0);
    setShowWrongExplosion(false);
    playClickTone();
  };

  const handleNextStep = () => {
    if (activeStepIdx < currentProblem.steps.length) {
      setActiveStepIdx((prev) => prev + 1);
      playClickTone();
      triggerHapticClick();
    }
  };

  const handlePrevStep = () => {
    if (activeStepIdx > 0) {
      setActiveStepIdx((prev) => prev - 1);
      playClickTone();
    }
  };

  const handleTriggerWrongPath = () => {
    setShowWrongExplosion(true);
    playIncorrectTone();
    speakInLanguage(
      `Look out! If you calculate ${currentProblem.wrongPath.wrongFirstOp} first, you get ${currentProblem.wrongPath.wrongResult}. ${currentProblem.wrongPath.explanation}`,
      'en'
    );
  };

  const handleSpeakCurrentStep = () => {
    if (activeStepIdx === 0) {
      speakInLanguage(
        `We have the expression ${currentProblem.expression}. Watch out: ${currentProblem.trapWarning}`,
        'en'
      );
    } else {
      const step = currentProblem.steps[activeStepIdx - 1];
      speakInLanguage(
        `Step ${activeStepIdx}: ${step.ruleName}. ${step.explanation}. The expression is now ${step.currentEquation}.`,
        'en'
      );
    }
  };

  // Times tables distributive calculations
  const totalProduct = factorX * factorY;
  const split1 = 5;
  const split2 = factorY > 5 ? factorY - 5 : factorY;
  const part1Product = factorX * (factorY > 5 ? 5 : factorY);
  const part2Product = factorY > 5 ? factorX * (factorY - 5) : 0;

  // Challenge questions
  const CHALLENGE_QUESTIONS = [
    {
      question: 'In the expression 4 + 6 × 3, which calculation MUST happen first?',
      options: ['4 + 6 (Addition)', '6 × 3 (Multiplication)', 'Either order gives same answer'],
      correctIdx: 1,
      explanation: 'Multiplication has higher precedence than addition. 6 × 3 = 18 first, then 4 + 18 = 22!',
    },
    {
      question: 'What is the correct result of: 12 - 4 + 2?',
      options: ['6 (because 4 + 2 = 6, then 12 - 6)', '10 (because 12 - 4 = 8, then 8 + 2)', '8'],
      correctIdx: 1,
      explanation: 'Addition and Subtraction have EQUAL rank! You must calculate strictly left to right: 12 - 4 = 8, then 8 + 2 = 10.',
    },
    {
      question: 'Why does 3 × 4 take precedence over 5 + 3 in "5 + 3 × 4"?',
      options: [
        'It is just an arbitrary rule someone made up',
        '3 × 4 represents a solid 2D rectangular area of 12 items; 5 is just loose items',
        'Multiplication is always larger than addition',
      ],
      correctIdx: 1,
      explanation: 'Exactly! 3 × 4 is an area of 12 tiles. You cannot add 5 loose tiles to 3 without breaking the rectangular group of 4!',
    },
    {
      question: 'How can you split 7 × 8 to calculate it mentally in 2 seconds?',
      options: [
        '(7 × 5 = 35) + (7 × 3 = 21) = 56',
        '(7 × 4) × 2 = 28 × 2 = 56',
        'Both methods are brilliant mental maths strategies',
      ],
      correctIdx: 2,
      explanation: 'Both! The distributive property lets you split 8 into (5 + 3) or (4 × 2) so you never need to panic over big tables.',
    },
    {
      question: 'What is the value of: (5 + 3)² - 4 × 10?',
      options: ['24', '64', '40'],
      correctIdx: 0,
      explanation: 'Brackets first: (5 + 3) = 8. Then Index: 8² = 64. Then Multiply: 4 × 10 = 40. Finally Subtract: 64 - 40 = 24!',
    },
  ];

  const handleAnswerChallenge = (optIdx: number) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(optIdx);
    setIsAnswerChecked(true);

    const q = CHALLENGE_QUESTIONS[challengeIdx];
    if (optIdx === q.correctIdx) {
      setChallengeScore((prev) => prev + 1);
      playSuccessChime();
      triggerHapticSuccess();
      triggerCorrectConfetti();
    } else {
      playIncorrectTone();
    }
  };

  const handleNextChallenge = () => {
    if (challengeIdx < CHALLENGE_QUESTIONS.length - 1) {
      setChallengeIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerChecked(false);
      playClickTone();
    } else {
      // Completed
      triggerMasteryConfetti();
      playSuccessChime();
    }
  };

  return (
    <div
      style={{
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
      }}
    >
      {/* Top Banner Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          borderBottom: '1px solid #1e293b',
          background: 'linear-gradient(90deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚡</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
              Maths Fundamentals Visual Physics Lab
            </h3>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
              BODMAS / BIDMAS Forcefield Clamping &bull; Distributive Times Table Arrays &bull; Zero Hallucinations
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('bodmas');
              playClickTone();
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: activeTab === 'bodmas' ? '1px solid #3b82f6' : '1px solid #334155',
              background: activeTab === 'bodmas' ? '#1d4ed8' : '#1e293b',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🧮</span>
            <span>BODMAS Clamping</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('times-tables');
              playClickTone();
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: activeTab === 'times-tables' ? '1px solid #10b981' : '1px solid #334155',
              background: activeTab === 'times-tables' ? '#059669' : '#1e293b',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>📐</span>
            <span>Times Tables Array (12×12)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('challenge');
              playClickTone();
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: activeTab === 'challenge' ? '1px solid #f59e0b' : '1px solid #334155',
              background: activeTab === 'challenge' ? '#d97706' : '#1e293b',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🏆</span>
            <span>SATs Master Challenge</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '4px 8px',
                marginLeft: '8px',
              }}
              title="Close lab"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BODMAS / BIDMAS Interactive Forcefield & Magnetic Clamping Engine  */}
      {/* ========================================================================= */}
      {activeTab === 'bodmas' && (
        <div style={{ padding: '20px' }}>
          {/* Problem Selector Bar */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {BODMAS_PROBLEMS.map((prob, idx) => {
              const isSelected = idx === selectedProblemIdx;
              return (
                <button
                  key={prob.id}
                  type="button"
                  onClick={() => handleSelectProblem(idx)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #38bdf8' : '1px solid #334155',
                    background: isSelected ? '#0f2942' : '#0f172a',
                    color: isSelected ? '#38bdf8' : '#cbd5e1',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {prob.expression}
                </button>
              );
            })}
          </div>

          {/* Main Visual Board */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(300px, 1fr) minmax(280px, 340px)',
              gap: '20px',
            }}
          >
            {/* Left: The Physics Simulation Canvas */}
            <div
              style={{
                background: '#030712',
                border: '1px solid #1f2937',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '340px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Forcefield Grid Background */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.12) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  pointerEvents: 'none',
                }}
              />

              {/* Title & Speech Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                <div>
                  <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.05em' }}>
                    Visual Operator Physics
                  </span>
                  <h4 style={{ margin: '2px 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                    {currentProblem.title}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleSpeakCurrentStep}
                  style={{
                    background: '#1e293b',
                    border: '1px solid #3b82f6',
                    color: '#60a5fa',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Listen to teacher explanation"
                >
                  <span>🔊</span>
                  <span>Listen Aloud</span>
                </button>
              </div>

              {/* Central Formula Visual Display */}
              <div style={{ margin: '28px 0', textAlign: 'center', zIndex: 1 }}>
                {/* Stage Equation */}
                <div
                  style={{
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                    fontFamily: 'monospace',
                    color: '#f8fafc',
                    textShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                    padding: '16px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    borderRadius: '12px',
                    border: '1px solid #334155',
                    display: 'inline-block',
                  }}
                >
                  {activeStepIdx === 0
                    ? currentProblem.expression
                    : currentProblem.steps[activeStepIdx - 1].currentEquation}
                </div>

                {/* Sub-label showing step action */}
                <div style={{ marginTop: '12px', fontSize: '0.88rem', color: '#93c5fd', fontWeight: 600 }}>
                  {activeStepIdx === 0 ? (
                    <span style={{ color: '#fbbf24' }}>⚡ Step 0: Ready to solve with BODMAS rules</span>
                  ) : (
                    <span>
                      ✓ Step {activeStepIdx}: <strong>{currentProblem.steps[activeStepIdx - 1].action}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Area Model Concrete Representation if available */}
              {showAreaModel && currentProblem.areaModel && (
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '12px',
                    zIndex: 1,
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Concrete Physical Representation (Why Multiplication Clamps First)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Loose Coins */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '120px' }}>
                        {Array.from({ length: currentProblem.areaModel.looseCount }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: 'radial-gradient(circle, #f59e0b 0%, #b45309 100%)',
                              border: '1px solid #fbbf24',
                              boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#fde68a', fontWeight: 700 }}>
                        {currentProblem.areaModel.looseLabel}
                      </span>
                    </div>

                    <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 900 }}>+</span>

                    {/* Rectangular Grid Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(${currentProblem.areaModel.cols}, 18px)`,
                          gap: '2px',
                          padding: '4px',
                          background: 'rgba(37, 99, 235, 0.2)',
                          border: '2px solid #3b82f6',
                          borderRadius: '6px',
                        }}
                      >
                        {Array.from({ length: currentProblem.areaModel.rows * currentProblem.areaModel.cols }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: '18px',
                              height: '18px',
                              background: '#2563eb',
                              borderRadius: '2px',
                              border: '1px solid #60a5fa',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#93c5fd', fontWeight: 700 }}>
                        {currentProblem.areaModel.gridLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wrong Path Explosion Banner if triggered */}
              {showWrongExplosion && (
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(153, 27, 27, 0.4) 100%)',
                    border: '2px solid #ef4444',
                    borderRadius: '10px',
                    padding: '12px',
                    zIndex: 1,
                    marginBottom: '12px',
                    animation: 'shake 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fca5a5', fontWeight: 800, fontSize: '0.86rem' }}>
                    <span>🚨</span>
                    <span>COGNITIVE TRAP EXPLODED!</span>
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#fee2e2', lineHeight: 1.4 }}>
                    {currentProblem.wrongPath.explanation}
                  </p>
                </div>
              )}

              {/* Scrubber Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1, flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={activeStepIdx === 0}
                    style={{
                      background: activeStepIdx === 0 ? '#1f2937' : '#374151',
                      color: activeStepIdx === 0 ? '#6b7280' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: activeStepIdx === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ◀ Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={activeStepIdx >= currentProblem.steps.length}
                    style={{
                      background: activeStepIdx >= currentProblem.steps.length ? '#1f2937' : '#2563eb',
                      color: activeStepIdx >= currentProblem.steps.length ? '#6b7280' : '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: activeStepIdx >= currentProblem.steps.length ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Next Step ({activeStepIdx + 1}/{currentProblem.steps.length + 1}) ▶
                  </button>
                </div>

                {/* "Break the Rule" Exploder Button */}
                <button
                  type="button"
                  onClick={handleTriggerWrongPath}
                  style={{
                    background: '#7f1d1d',
                    border: '1px solid #ef4444',
                    color: '#fecaca',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title="Try calculating the wrong way to see what breaks!"
                >
                  <span>💥</span>
                  <span>Try the Wrong Way!</span>
                </button>
              </div>
            </div>

            {/* Right: The BODMAS Rule Inspector & Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Order of Operations Hierarchy Card */}
              <div
                style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  The Hierarchy of Operation Power
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: '#1e293b', borderRadius: '6px', borderLeft: '4px solid #a855f7' }}>
                    <strong style={{ color: '#c084fc', width: '24px' }}>B</strong>
                    <span><strong>Brackets:</strong> Titanium shield forces inner resolution</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: '#1e293b', borderRadius: '6px', borderLeft: '4px solid #ec4899' }}>
                    <strong style={{ color: '#f472b6', width: '24px' }}>O / I</strong>
                    <span><strong>Orders / Indices:</strong> Powers and square roots flare</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: '#1e293b', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
                    <strong style={{ color: '#60a5fa', width: '24px' }}>D / M</strong>
                    <span><strong>Division &amp; Multiplication:</strong> High-voltage magnetic clamps</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: '#1e293b', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
                    <strong style={{ color: '#34d399', width: '24px' }}>A / S</strong>
                    <span><strong>Addition &amp; Subtraction:</strong> Loose ribbons (Left to Right)</span>
                  </div>
                </div>
              </div>

              {/* Current Step Explanation Box */}
              <div
                style={{
                  background: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '16px',
                  flexGrow: 1,
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                  Teacher Diagnostic Note
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                  {activeStepIdx === 0
                    ? currentProblem.trapWarning
                    : currentProblem.steps[activeStepIdx - 1].explanation}
                </p>

                <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #1e293b', fontSize: '0.76rem', color: '#64748b' }}>
                  💡 <strong>Tip for SATs:</strong> If two operators have equal power (like ÷ and ×, or + and -), calculate strictly from left to right!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Visual Times Tables & Distributive Splitter (12x12 Array)          */}
      {/* ========================================================================= */}
      {activeTab === 'times-tables' && (
        <div style={{ padding: '20px' }}>
          {/* Controls Bar */}
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {/* Factor X & Y Sliders */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>
                  ROWS (Width): <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>{factorX}</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={factorX}
                  onChange={(e) => {
                    setFactorX(Number(e.target.value));
                    playClickTone();
                  }}
                  style={{ width: '130px', accentColor: '#38bdf8' }}
                />
              </div>

              <div>
                <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginBottom: '2px' }}>
                  COLUMNS (Height): <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>{factorY}</strong>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={factorY}
                  onChange={(e) => {
                    setFactorY(Number(e.target.value));
                    playClickTone();
                  }}
                  style={{ width: '130px', accentColor: '#10b981' }}
                />
              </div>
            </div>

            {/* Commutative & Split Toggles */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  const temp = factorX;
                  setFactorX(factorY);
                  setFactorY(temp);
                  setIsRotated(!isRotated);
                  playClickTone();
                  speakInLanguage(
                    `Rotating 90 degrees! Notice how ${factorX} times ${factorY} is identical to ${factorY} times ${factorX}. Both equal ${totalProduct}.`,
                    'en'
                  );
                }}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Rotate 90 degrees to prove commutativity"
              >
                <span>🔄</span>
                <span>Rotate 90° (Commutative)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSplitMode(!isSplitMode);
                  playClickTone();
                }}
                style={{
                  background: isSplitMode ? '#064e3b' : '#1e293b',
                  border: isSplitMode ? '1px solid #10b981' : '1px solid #334155',
                  color: isSplitMode ? '#6ee7b7' : '#cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>✂️</span>
                <span>Distributive Splitter ({isSplitMode ? 'ON' : 'OFF'})</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Visual Array & Mental Math Secret */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 360px)',
              gap: '20px',
            }}
          >
            {/* Left: The Dynamic SVG Grid */}
            <div
              style={{
                background: '#030712',
                border: '1px solid #1f2937',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '340px',
              }}
            >
              {/* Product Headline */}
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f8fafc', marginBottom: '16px' }}>
                <span style={{ color: '#38bdf8' }}>{factorX}</span> ×{' '}
                <span style={{ color: '#10b981' }}>{factorY}</span> ={' '}
                <span style={{ color: '#f59e0b' }}>{totalProduct}</span>
              </div>

              {/* The SVG Matrix */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${factorY}, minmax(14px, 24px))`,
                  gap: '3px',
                  padding: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  maxWidth: '100%',
                  overflowX: 'auto',
                }}
              >
                {Array.from({ length: factorX * factorY }).map((_, i) => {
                  const colIdx = i % factorY;
                  const isPart1 = isSplitMode && factorY > 5 && colIdx < 5;
                  const isPart2 = isSplitMode && factorY > 5 && colIdx >= 5;

                  let bgColor = '#3b82f6';
                  let borderColor = '#60a5fa';

                  if (isPart1) {
                    bgColor = '#10b981';
                    borderColor = '#34d399';
                  } else if (isPart2) {
                    bgColor = '#f59e0b';
                    borderColor = '#fbbf24';
                  }

                  return (
                    <div
                      key={i}
                      style={{
                        width: '22px',
                        height: '22px',
                        background: bgColor,
                        border: `1px solid ${borderColor}`,
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.62rem',
                        color: '#ffffff',
                        fontWeight: 700,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {i + 1}
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: '14px', fontSize: '0.78rem', color: '#94a3b8' }}>
                Total Area: <strong>{totalProduct} square units</strong>
              </div>
            </div>

            {/* Right: The Mental Maths "Secret Code" Explainer */}
            <div
              style={{
                background: '#0f172a',
                border: '1px solid #1e293b',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  The Mental Maths Secret (Distributive Property)
                </div>
                <h4 style={{ margin: '0 0 10px', fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                  Never Memorize 144 Isolated Facts!
                </h4>
                <p style={{ margin: '0 0 14px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.55 }}>
                  Notice how we can split <strong style={{ color: '#10b981' }}>{factorY}</strong> into friendly building blocks! 
                  Instead of struggling with a hard table like {factorX} × {factorY}, your brain can solve it in two easy chunks:
                </p>

                {factorY > 5 ? (
                  <div style={{ background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '12px', fontSize: '0.86rem' }}>
                    <div style={{ color: '#34d399', fontWeight: 700, marginBottom: '4px' }}>
                      🟢 Part 1 (Friendly 5s): {factorX} × 5 = <strong>{part1Product}</strong>
                    </div>
                    <div style={{ color: '#fbbf24', fontWeight: 700, marginBottom: '6px' }}>
                      🟡 Part 2 (The Rest): {factorX} × {factorY - 5} = <strong>{part2Product}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #334155', paddingTop: '6px', color: '#f8fafc', fontWeight: 900 }}>
                      ➔ {part1Product} + {part2Product} = <span style={{ color: '#38bdf8' }}>{totalProduct}</span>!
                    </div>
                  </div>
                ) : (
                  <div style={{ background: '#090d16', border: '1px solid #334155', borderRadius: '8px', padding: '12px', fontSize: '0.86rem', color: '#93c5fd' }}>
                    Because columns ≤ 5, this is already an ultra-friendly fundamental table!
                  </div>
                )}
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #1e293b' }}>
                <button
                  type="button"
                  onClick={() => {
                    speakInLanguage(
                      `To calculate ${factorX} times ${factorY}, split ${factorY} into 5 and ${factorY - 5}. ${factorX} times 5 is ${part1Product}, and ${factorX} times ${factorY - 5} is ${part2Product}. Adding them together gives ${totalProduct}.`,
                      'en'
                    );
                  }}
                  style={{
                    width: '100%',
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🔊 Listen to Mental Trick Aloud
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SATs Master Challenge Drills                                       */}
      {/* ========================================================================= */}
      {activeTab === 'challenge' && (
        <div style={{ padding: '24px', maxWidth: '640px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 700 }}>
              Question {challengeIdx + 1} of {CHALLENGE_QUESTIONS.length}
            </span>
            <span style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: 800 }}>
              Score: {challengeScore} / {CHALLENGE_QUESTIONS.length} 🏆
            </span>
          </div>

          {/* Question Card */}
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
            }}
          >
            <h4 style={{ margin: '0 0 16px', fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.4 }}>
              {CHALLENGE_QUESTIONS[challengeIdx].question}
            </h4>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {CHALLENGE_QUESTIONS[challengeIdx].options.map((opt, optIdx) => {
                const isSelected = selectedAnswer === optIdx;
                const isCorrect = optIdx === CHALLENGE_QUESTIONS[challengeIdx].correctIdx;

                let border = '1px solid #334155';
                let bg = '#1e293b';
                let text = '#f8fafc';

                if (isAnswerChecked) {
                  if (isCorrect) {
                    border = '2px solid #10b981';
                    bg = 'rgba(16, 185, 129, 0.2)';
                    text = '#34d399';
                  } else if (isSelected) {
                    border = '2px solid #ef4444';
                    bg = 'rgba(239, 68, 68, 0.2)';
                    text = '#f87171';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleAnswerChallenge(optIdx)}
                    disabled={isAnswerChecked}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border,
                      background: bg,
                      color: text,
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: isAnswerChecked ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#334155', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', flexShrink: 0 }}>
                      {['A', 'B', 'C'][optIdx]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Explanation */}
            {isAnswerChecked && (
              <div
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: selectedAnswer === CHALLENGE_QUESTIONS[challengeIdx].correctIdx ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${selectedAnswer === CHALLENGE_QUESTIONS[challengeIdx].correctIdx ? '#10b981' : '#ef4444'}`,
                }}
              >
                <div style={{ fontWeight: 800, color: selectedAnswer === CHALLENGE_QUESTIONS[challengeIdx].correctIdx ? '#34d399' : '#f87171', fontSize: '0.86rem', marginBottom: '4px' }}>
                  {selectedAnswer === CHALLENGE_QUESTIONS[challengeIdx].correctIdx ? '✓ Brilliant Reasoning!' : '✕ Not Quite! Watch out for the trap:'}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {CHALLENGE_QUESTIONS[challengeIdx].explanation}
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          {isAnswerChecked && (
            <button
              type="button"
              onClick={handleNextChallenge}
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              }}
            >
              {challengeIdx < CHALLENGE_QUESTIONS.length - 1 ? 'Next Question ➔' : 'Complete Challenge & View Badge 🏆'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
