import React, { useState } from 'react';
import { LESSON_REGISTRY, resolveLessonByCode, LessonASTNode } from '../data/lessons';

interface ViewerProps {
  defaultCode?: string;
}

export default function DynamicLessonViewer({ defaultCode = 'Y4-SCI-01' }: ViewerProps): React.JSX.Element {
  const [activeCode, setActiveCode] = useState<string>(defaultCode);
  const [searchInput, setSearchInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Lesson Node
  const activeNode: LessonASTNode = resolveLessonByCode(activeCode) ?? LESSON_REGISTRY[0];

  // Interactive Answer Box State
  const [studentAnswer, setStudentAnswer] = useState<string>('');
  const [answerFeedback, setAnswerFeedback] = useState<{ status: 'correct' | 'incorrect'; message: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Terminal & Query State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `⚡ WebGPU/Edge runtime active [${activeNode.code}]`,
    `🤖 [Tutor]: ${activeNode.runtime.starterPrompt}`
  ]);
  const [queryInput, setQueryInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const switchLesson = (code: string) => {
    setActiveCode(code);
    setErrorMsg(null);
    setStudentAnswer('');
    setAnswerFeedback(null);
    setShowHint(false);

    const node = resolveLessonByCode(code) ?? LESSON_REGISTRY[0];
    setTerminalLogs([
      `⚡ Switched context to [${node.code}] - ${node.stage} ${node.subject}`,
      `🤖 [Tutor]: ${node.runtime.starterPrompt}`
    ]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = resolveLessonByCode(searchInput);
    if (matched) {
      switchLesson(matched.code);
      setSearchInput('');
      setErrorMsg(null);
    } else {
      setErrorMsg(`No lesson found matching "${searchInput}". Try "Y4", "Y10", "Maths", or "Ethics".`);
    }
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim()) return;

    const isMatch = studentAnswer.trim().toLowerCase().includes(activeNode.exercise.expectedAnswer.toLowerCase());
    if (isMatch) {
      setAnswerFeedback({
        status: 'correct',
        message: `✅ Correct! ${activeNode.exercise.explanation}`
      });
    } else {
      setAnswerFeedback({
        status: 'incorrect',
        message: `❌ Not quite. Check your steps or click 'Need a hint?' below.`
      });
    }
  };

  const streamToTerminal = (promptText: string) => {
    setIsProcessing(true);
    setTerminalLogs((prev) => [...prev, `\n> Student: ${promptText}`, '⏳ Processing through client-side AST runtime...']);

    setTimeout(() => {
      setTerminalLogs((prev) => [
        ...prev,
        `🤖 [Tutor (${activeNode.runtime.mode})]: Exploring "${promptText}"`,
        `💡 [Guidance]: In ${activeNode.subject} (${activeNode.stage}), consider how the core variables interact. What is your next conclusion?`
      ]);
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'inherit' }}>
      
      {/* Top Search & Preset Navigation */}
      <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '0.75rem' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '6px', flex: '1 1 240px' }}>
            <input
              type="text"
              placeholder="Search code or subject (e.g. Y4, Y10, Maths, GCSE)..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
            />
            <button
              type="submit"
              style={{ padding: '7px 14px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Load
            </button>
          </form>

          {/* Quick Dropdown */}
          <select
            value={activeNode.code}
            onChange={(e) => switchLesson(e.target.value)}
            style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}
          >
            {LESSON_REGISTRY.map((node) => (
              <option key={node.code} value={node.code}>
                {node.code} — {node.stage} {node.subject}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Presets */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Presets:</span>
          {LESSON_REGISTRY.map((node) => (
            <button
              key={node.code}
              onClick={() => switchLesson(node.code)}
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                borderRadius: '20px',
                border: activeNode.code === node.code ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: activeNode.code === node.code ? '#eff6ff' : '#fff',
                color: activeNode.code === node.code ? '#1d4ed8' : '#475569',
                cursor: 'pointer',
                fontWeight: activeNode.code === node.code ? 600 : 400,
              }}
            >
              {node.icon} {node.code} ({node.stage})
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#dc2626', borderRadius: '6px', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Lesson Header */}
      <div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem', alignItems: 'center' }}>
          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
            {activeNode.yearGroup}
          </span>
          <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
            {activeNode.stage} · {activeNode.subject}
          </span>
          <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '0.85rem' }}>
            Code: <strong>{activeNode.code}</strong>
          </span>
        </div>

        <h1 style={{ margin: '0.5rem 0' }}>{activeNode.title} {activeNode.icon}</h1>
        <p style={{ fontSize: '1.05rem', color: '#475569' }}>{activeNode.description}</p>
      </div>

      {/* Learning Objectives */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>🎯 Key Learning Objectives</h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#15803d', fontSize: '0.95rem' }}>
          {activeNode.objectives.map((obj, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>{obj}</li>
          ))}
        </ul>
      </div>

      {/* Curriculum Breakdown */}
      {activeNode.sections.map((sec, idx) => (
        <div key={idx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
          <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>{sec.heading}</h3>
          {sec.content.map((p, pIdx) => (
            <p key={pIdx} style={{ margin: '0.5rem 0', color: '#334155', lineHeight: '1.5' }}>{p}</p>
          ))}
        </div>
      ))}

      {/* Interactive Answer Box / Student Challenge */}
      <div style={{ padding: '1.25rem', border: '1px solid #bfdbfe', background: '#eff6ff', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>✍️ Interactive Practice Challenge</h4>
        <p style={{ margin: '0 0 1rem 0', color: '#1e3a8a', fontWeight: 500 }}>{activeNode.exercise.prompt}</p>

        <form onSubmit={checkAnswer} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Type your answer here..."
            value={studentAnswer}
            onChange={(e) => setStudentAnswer(e.target.value)}
            style={{ flex: '1 1 200px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #93c5fd', background: '#fff' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Check Answer
          </button>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            style={{ padding: '8px 12px', borderRadius: '6px', background: 'transparent', color: '#1d4ed8', border: '1px dashed #93c5fd', cursor: 'pointer' }}
          >
            {showHint ? 'Hide Hint' : '💡 Need a hint?'}
          </button>
        </form>

        {showHint && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#1e40af', background: '#dbeafe', padding: '6px 10px', borderRadius: '6px' }}>
            <strong>Hint:</strong> {activeNode.exercise.hint}
          </div>
        )}

        {answerFeedback && (
          <div style={{
            marginTop: '0.75rem',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.9rem',
            fontWeight: 500,
            background: answerFeedback.status === 'correct' ? '#dcfce7' : '#fee2e2',
            color: answerFeedback.status === 'correct' ? '#166534' : '#991b1b',
            border: `1px solid ${answerFeedback.status === 'correct' ? '#86efac' : '#fca5a5'}`
          }}>
            {answerFeedback.message}
          </div>
        )}
      </div>

      {/* AI Tutor Sandbox & Terminal */}
      <div style={{ background: '#0f172a', borderRadius: '10px', padding: '1.25rem', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡</span>
            <strong>Neuro-Symbolic Edge Runtime [{activeNode.runtime.mode}]</strong>
          </div>
          <span style={{ fontSize: '0.75rem', background: '#1e293b', padding: '3px 8px', borderRadius: '4px', color: '#38bdf8' }}>
            100% Client-Side
          </span>
        </div>

        {/* Dynamic Topic Prompt Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {activeNode.runtime.samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => streamToTerminal(prompt)}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '5px 10px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Student Query Box */}
        <form onSubmit={(e) => { e.preventDefault(); if (queryInput.trim()) { streamToTerminal(queryInput); setQueryInput(''); } }} style={{ display: 'flex', gap: '8px', marginBottom: '0.75rem' }}>
          <input
            type="text"
            placeholder="Ask your edge tutor a question about this topic..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', background: '#020617', color: '#fff' }}
          />
          <button
            type="submit"
            disabled={isProcessing}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, cursor: isProcessing ? 'wait' : 'pointer' }}
          >
            {isProcessing ? 'Thinking...' : 'Submit Query 🚀'}
          </button>
        </form>

        {/* Live Terminal Output Box */}
        <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '6px', padding: '0.85rem', minHeight: '120px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8' }}>
          {terminalLogs.map((log, idx) => (
            <div key={idx} style={{ marginBottom: '4px', whiteSpace: 'pre-wrap' }}>{log}</div>
          ))}
        </div>
      </div>

    </div>
  );
}