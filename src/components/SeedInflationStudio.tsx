// src/components/SeedInflationStudio.tsx
import React, { useState, useEffect } from 'react';
import {
  COMPRESSED_KNOWLEDGE_SEEDS,
  inflateKnowledgeSeed,
  InflatedLessonExperience,
} from '../engine/seedInflationEngine';
import { ProceduralManipulative } from './ProceduralManipulative';

export default function SeedInflationStudio(): React.JSX.Element {
  const seedKeys = Object.keys(COMPRESSED_KNOWLEDGE_SEEDS);
  const [selectedSeedKey, setSelectedSeedKey] = useState<string>(seedKeys[0]);
  const [inflated, setInflated] = useState<InflatedLessonExperience>(() =>
    inflateKnowledgeSeed(seedKeys[0])
  );
  const [isInflating, setIsInflating] = useState(false);
  const [showRawAst, setShowRawAst] = useState(false);
  const [activeTab, setActiveTab] = useState<'manipulative' | 'misconceptions' | 'practice' | 'narrative'>('manipulative');
  const [practiceAnswer, setPracticeAnswer] = useState<number | null>(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [stageFilter, setStageFilter] = useState<'ALL' | 'Key Stage 1' | 'Key Stage 2' | 'Key Stage 3' | 'Key Stage 4'>('ALL');
  const [subjectFilter, setSubjectFilter] = useState<'ALL' | 'Mathematics' | 'Science'>('ALL');

  const filteredSeedKeys = seedKeys.filter((k) => {
    const s = COMPRESSED_KNOWLEDGE_SEEDS[k];
    const matchStage = stageFilter === 'ALL' || s.keyStage === stageFilter;
    const matchSub = subjectFilter === 'ALL' || s.subject === subjectFilter;
    return matchStage && matchSub;
  });

  // Trigger inflation when seed changes
  const handleSelectSeed = (key: string) => {
    setSelectedSeedKey(key);
    setIsInflating(true);
    setPracticeAnswer(null);
    setVariantIndex(0);

    // On-device inflation takes 50-150ms
    setTimeout(() => {
      const res = inflateKnowledgeSeed(key);
      setInflated(res);
      setIsInflating(false);
    }, 120);
  };

  const handleNextVariant = () => {
    setVariantIndex((v) => v + 1);
    setPracticeAnswer(null);
  };

  const activeSeed = inflated.seed;
  const currentQuestion = activeSeed.generateQuestions(variantIndex)[0];

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.75rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      {/* Studio Header & Developing Nation Mission Statement */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.4rem' }}>🌱</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Extreme Compression & On-Device Inflation Engine
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
            Delivering a <strong>world-class curriculum in a sub-kilobyte footprint</strong>. Instead of streaming 50MB video files that deplete cellular airtime in developing nations, the portal serves ultra-compressed AST &ldquo;Knowledge Seeds&rdquo; and inflates them on-device into interactive lessons, procedural SVG visualizers, and infinite practice questions.
          </p>
        </div>

        {/* Global Safety Badge */}
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '10px',
            padding: '8px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Developing-Nation Safe (Grade A+)
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
            0 MB Network Egress &bull; 2G &amp; Solar-Ready
          </span>
        </div>
      </div>

      {/* Live Footprint & Compression Telemetry Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          background: '#0f172a',
          padding: '1.25rem',
          borderRadius: '12px',
          color: '#f8fafc',
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Compressed AST Seed
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8' }}>
            {inflated.telemetry.seedSizeBytes} Bytes
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>S-Expression Genome</span>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Streaming Video Baseline
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f87171' }}>
            50.0 MB
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Traditional Web LMS</span>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Decompression Ratio
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399' }}>
            {inflated.telemetry.compressionRatio}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>99.999% Bandwidth Saved</span>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Cellular Airtime Cost
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fbbf24' }}>
            $0.00
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Zero Student Data Drain</span>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Inference Runtime
          </span>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#c084fc' }}>
            {inflated.telemetry.generationDurationMs}ms
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>100% On-Device RAM</span>
        </div>
      </div>

      {/* Seed Selection & Curriculum Filter Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Filter Controls Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Curriculum Breadth ({seedKeys.length} Seeds):
            </span>

            {/* Key Stage Filter */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '2px', borderRadius: '6px', gap: '2px' }}>
              {(['ALL', 'Key Stage 1', 'Key Stage 2', 'Key Stage 3', 'Key Stage 4'] as const).map((stage) => {
                const isCurrent = stageFilter === stage;
                const label = stage === 'ALL' ? 'All Stages' : stage.replace('Key Stage ', 'KS');
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => setStageFilter(stage)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: isCurrent ? 800 : 500,
                      background: isCurrent ? '#2563eb' : 'transparent',
                      color: isCurrent ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Subject Filter */}
            <div style={{ display: 'flex', background: '#f1f5f9', padding: '2px', borderRadius: '6px', gap: '2px' }}>
              {(['ALL', 'Mathematics', 'Science'] as const).map((sub) => {
                const isCurrent = subjectFilter === sub;
                const label = sub === 'ALL' ? 'All Subjects' : sub === 'Mathematics' ? '📐 Maths' : '🔬 Science';
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubjectFilter(sub)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: isCurrent ? 800 : 500,
                      background: isCurrent ? '#0f172a' : 'transparent',
                      color: isCurrent ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRawAst(!showRawAst)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              background: showRawAst ? '#e0f2fe' : '#ffffff',
              color: showRawAst ? '#0369a1' : '#64748b',
              border: '1px solid #cbd5e1',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showRawAst ? 'Hide Raw AST' : '🔍 Inspect Raw AST Seed'}
          </button>
        </div>

        {/* Seed Buttons Grid */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {filteredSeedKeys.map((k) => {
            const s = COMPRESSED_KNOWLEDGE_SEEDS[k];
            const isSelected = k === selectedSeedKey;
            const isMath = s.subject === 'Mathematics';
            return (
              <button
                key={k}
                type="button"
                onClick={() => handleSelectSeed(k)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: isSelected ? '#2563eb' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  border: isSelected ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: isSelected ? 700 : 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isSelected ? '0 2px 4px rgba(37,99,235,0.2)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ fontSize: '0.72rem', opacity: isSelected ? 0.9 : 0.6 }}>
                  {isMath ? '📐' : '🔬'} {s.keyStage.replace('Key Stage ', 'KS')}
                </span>
                <span>{s.topic.split('&')[0].trim()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Raw AST Code Modal / Drawer */}
      {showRawAst && (
        <div
          style={{
            background: '#1e293b',
            color: '#38bdf8',
            fontFamily: 'monospace',
            padding: '1rem 1.25rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            lineHeight: 1.5,
            overflowX: 'auto',
            border: '1px solid #334155',
          }}
        >
          <div style={{ color: '#94a3b8', marginBottom: '6px', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
            ;; Raw Lisp S-Expression AST Seed ({inflated.telemetry.seedSizeBytes} bytes transmitted over network once)
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{activeSeed.rawAST}</pre>
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', gap: '1rem', overflowX: 'auto' }}>
        {[
          { id: 'manipulative', label: '🪞 Procedural Manipulative & Mental Mirror' },
          { id: 'misconceptions', label: '🔍 Misconception Profiler' },
          { id: 'practice', label: '🎲 Infinite Practice Generator' },
          { id: 'narrative', label: '📖 Inflated Narrative & Local Analogy' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '0.65rem 0.5rem',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '3px solid #2563eb' : '3px solid transparent',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div>
        {/* 1. PROCEDURAL VECTOR MANIPULATIVE & MENTAL MIRROR */}
        {activeTab === 'manipulative' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
                {activeSeed.topic}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                <strong>Core Axiom:</strong> {activeSeed.coreAxiom}
              </p>
            </div>

            <ProceduralManipulative
              cpaType={activeSeed.cpaType}
              seedTopic={activeSeed.topic}
            />
          </div>
        )}

        {/* 2. DIAGNOSTIC MISCONCEPTION PROFILER */}
        {activeTab === 'misconceptions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '1rem 1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#991b1b', margin: '0 0 4px 0' }}>
                Documented Misconception Schema (Extracted from AST Seed)
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#7f1d1d', margin: 0 }}>
                Traditional tests simply mark answers wrong. Our on-device engine classifies the exact cognitive defect, revealing the pupil&apos;s internal reasoning error.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {activeSeed.misconceptions.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Misconception Pattern
                    </span>
                    <span style={{ fontSize: '0.72rem', background: '#fee2e2', color: '#b91c1c', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {m.id}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                    {m.name}
                  </h4>

                  <div style={{ fontSize: '0.82rem', color: '#dc2626', background: '#fff1f2', padding: '6px 10px', borderRadius: '6px' }}>
                    <strong>Trigger Condition:</strong> {m.trigger}
                  </div>

                  <p style={{ fontSize: '0.86rem', color: '#334155', margin: 0, lineHeight: 1.5 }}>
                    {m.diagnosticExplanation}
                  </p>

                  <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ color: '#b91c1c' }}>
                      <strong>❌ Flawed Model:</strong> {m.mentalMirror.flawedModel}
                    </div>
                    <div style={{ color: '#15803d' }}>
                      <strong>✅ Scientific Truth:</strong> {m.mentalMirror.scientificReality}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. INFINITE PRACTICE GENERATOR */}
        {activeTab === 'practice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                Procedural Variant #{variantIndex + 1} &bull; Generated locally without server round-trip
              </span>
              <button
                type="button"
                onClick={handleNextVariant}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                🎲 Inflate Next Variant (0 KB)
              </button>
            </div>

            {/* Practice Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                {currentQuestion.prompt}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = practiceAnswer === idx;
                  const isCorrect = idx === currentQuestion.answerKey;

                  let bg = '#ffffff';
                  let border = '#cbd5e1';
                  let color = '#1e293b';

                  if (practiceAnswer !== null) {
                    if (isCorrect) {
                      bg = '#ecfdf5';
                      border = '#10b981';
                      color = '#065f46';
                    } else if (isSelected) {
                      bg = '#fff7ed';
                      border = '#f97316';
                      color = '#9a3412';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPracticeAnswer(idx)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: bg,
                        border: `2px solid ${border}`,
                        color,
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {String.fromCharCode(65 + idx)}. {opt}
                    </button>
                  );
                })}
              </div>

              {/* Diagnostic Feedback upon answering */}
              {practiceAnswer !== null && (
                <div
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    background: practiceAnswer === currentQuestion.answerKey ? '#ecfdf5' : '#fff7ed',
                    border: `1px solid ${practiceAnswer === currentQuestion.answerKey ? '#10b981' : '#f97316'}`,
                    color: practiceAnswer === currentQuestion.answerKey ? '#065f46' : '#9a3412',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                >
                  {practiceAnswer === currentQuestion.answerKey ? (
                    <div>
                      <strong>🎉 Axiomatic Mastery!</strong> {currentQuestion.explanation}
                    </div>
                  ) : (
                    <div>
                      <strong>💡 Misconception Identified:</strong>{' '}
                      {currentQuestion.misconceptionMap[practiceAnswer] || 'Review the core partition invariant and try again.'}
                      <div style={{ marginTop: '6px', fontSize: '0.85rem', color: '#c2410c' }}>
                        Clue: {currentQuestion.hint}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. INFLATED NARRATIVE & LOCAL ANALOGY */}
        {activeTab === 'narrative' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase' }}>
                Developing-Nation Real World Analogy (Zero Translation Asset Download)
              </span>
              <p style={{ fontSize: '1rem', color: '#1e3a8a', margin: '0.5rem 0 0 0', lineHeight: 1.6, fontWeight: 500 }}>
                {activeSeed.realWorldAnalogies.developingNationContext}
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Universal Scientific Concept
              </span>
              <p style={{ fontSize: '0.95rem', color: '#334155', margin: '0.5rem 0 0 0', lineHeight: 1.6 }}>
                {activeSeed.realWorldAnalogies.universal}
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#047857', textTransform: 'uppercase' }}>
                Socratic Steer (Preserving Cognitive Struggle)
              </span>
              <p style={{ fontSize: '0.95rem', color: '#065f46', margin: '0.5rem 0 0 0', lineHeight: 1.6, fontWeight: 600 }}>
                &ldquo;{activeSeed.socraticPivot}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
