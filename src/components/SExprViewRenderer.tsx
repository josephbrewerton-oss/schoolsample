import React, { useState, useRef, useEffect } from 'react';
import { SExprAST, SExprNode } from '../types/sexpr';

interface Props {
  ast: SExprAST;
  onAction?: (action: string, payload?: any) => void;
}

export default function SExprViewRenderer({ ast, onAction }: Props): React.JSX.Element | null {
  if (ast === null || ast === undefined) {
    return (
      <div style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
        Loading curriculum node...
      </div>
    );
  }

  if (typeof ast !== 'object') {
    return <span>{String(ast)}</span>;
  }

  const { tag, props, children } = ast as SExprNode;

  const isTeacherMode =
    typeof window !== 'undefined' &&
    localStorage.getItem('app_teacher_mode') === 'true';

  const renderChildren = () =>
    children.map((child, index) => (
      <SExprViewRenderer key={index} ast={child} onAction={onAction} />
    ));

  switch (tag) {
    case 'view':
    case 'box':
      return (
        <div style={props.style} className={props.className}>
          {renderChildren()}
        </div>
      );

    case 'header': {
      const Level = (`h${props.level || 2}` as keyof JSX.IntrinsicElements);
      return <Level className={props.className}>{renderChildren()}</Level>;
    }

    case 'text':
      return <p className={props.className}>{renderChildren()}</p>;

    case 'step':
      return <div className="stepper__step">{renderChildren()}</div>;

    case 'question':
      return <div className="quiz__question">{renderChildren()}</div>;

    case 'option':
      return <span className="quiz__option-label">{renderChildren()}</span>;

    case 'explanation':
      return <div className="quiz__explanation">{renderChildren()}</div>;

    case 'button':
      return (
        <button
          type="button"
          className={props.className || 'button button--primary'}
          onClick={() => props.action && onAction?.(props.action, props.payload)}
        >
          {renderChildren()}
        </button>
      );

    case 'badge':
      return (
        <span className={`badge badge--${props.variant || 'info'} margin-right--xs`}>
          {renderChildren()}
        </span>
      );

    case 'callout':
      return (
        <div
          className={`alert alert--${props.variant || 'info'} margin-vert--sm`}
          style={{ borderRadius: '6px' }}
        >
          {renderChildren()}
        </div>
      );

    case 'quiz':
      return <QuizNode props={props} children={children} onAction={onAction} isTeacherMode={isTeacherMode} />;

    case 'stepper':
      return <StepperNode props={props} children={children} onAction={onAction} />;

    case 'ai-tutor':
      return <AiTutorNode props={props} onAction={onAction} />;

    default:
      return (
        <div data-unknown-tag={tag} style={{ border: '1px dashed red', padding: '0.5rem' }}>
          {renderChildren()}
        </div>
      );
  }
}

// --- Interactive AI Tutor Terminal Node ---

function AiTutorNode({
  props,
  onAction,
}: {
  props: Record<string, any>;
  onAction?: (action: string, payload?: any) => void;
}) {
  const [logs, setLogs] = useState<Array<{ role: 'student' | 'tutor' | 'system'; text: string }>>([
    {
      role: 'tutor',
      text: props.greeting || 'Hello! I am your offline AI tutor. How can I help you with this lesson?',
    },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = (text: string) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();

    const clean = text.replace(/[*_#`~[\]]/g, '').replace(/[^\x00-\x7F]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.pitch = Number(props.voicePitch) || 1.0;
    utterance.rate = Number(props.voiceRate) || 1.0;
    utterance.lang = props.lang || 'en-US';

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find((v) => v.lang.startsWith(utterance.lang.slice(0, 2))) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (err) => {
      console.warn('[Speech Error]', err);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || busy) return;

    const userText = input.trim();
    setInput('');
    setBusy(true);

    setLogs((prev) => [
      ...prev,
      { role: 'student', text: userText },
      { role: 'tutor', text: '' },
    ]);

    if (onAction) {
      onAction('ai:query', {
        prompt: userText,
        persona: props.persona || 'Tutor',
        context: props.context || '',
      });
    }

    try {
      const aiObj = (window as any).ai?.languageModel || (window as any).LanguageModel;

      if (aiObj) {
        const session = await (aiObj.create
          ? aiObj.create({
              systemPrompt:
                'You are a concise, Socratic tutor for primary school students. Guide the student with 1 short question or rule under 15 words. Never give the direct answer.',
            })
          : (window as any).ai.languageModel.create({
              systemPrompt:
                'You are a concise, Socratic tutor for primary school students. Guide the student with 1 short question or rule under 15 words. Never give the direct answer.',
            }));

        let accumulated = '';
        const stream = session.promptStreaming(userText);

        for await (const chunk of stream) {
          if (chunk.startsWith(accumulated)) {
            accumulated = chunk;
          } else {
            accumulated += chunk;
          }

          setLogs((prev) => {
            if (prev.length === 0) return prev;
            const next = [...prev];
            next[next.length - 1] = { role: 'tutor', text: accumulated };
            return next;
          });
        }

        speak(accumulated);
      } else {
        await new Promise((res) => setTimeout(res, 350));
        const fallback = `Break down the problem step-by-step. What do the units add up to first?`;
        setLogs((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'tutor', text: fallback };
          return next;
        });
        speak(fallback);
      }
    } catch (err) {
      console.warn('[Nano Inference Error]', err);
      const fallback = `Let's focus on the first place value column.`;
      setLogs((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: 'tutor', text: fallback };
        return next;
      });
      speak(fallback);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        background: '#0b1120',
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid #1e293b',
        marginTop: '1.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.85rem' }}>
          ⚡ {props.persona || 'AI Socratic Tutor'} [{props.engine || 'On-Device Edge'}]
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              if (voiceEnabled && isSpeaking) window.speechSynthesis?.cancel();
              setVoiceEnabled(!voiceEnabled);
            }}
            style={{
              padding: '3px 8px',
              borderRadius: '12px',
              border: '1px solid #334155',
              background: voiceEnabled ? '#064e3b' : '#1e293b',
              color: voiceEnabled ? '#a7f3d0' : '#94a3b8',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {voiceEnabled ? (isSpeaking ? '🔊 Speaking...' : '🔊 Voice ON') : '🔇 Muted'}
          </button>
          <span
            style={{
              fontSize: '0.75rem',
              background: '#1e293b',
              color: '#38bdf8',
              padding: '2px 8px',
              borderRadius: '10px',
            }}
          >
            100% Client-Side
          </span>
        </div>
      </div>

      <div
        style={{
          background: '#030712',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          padding: '0.85rem',
          minHeight: '110px',
          maxHeight: '190px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          marginBottom: '0.75rem',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
        }}
      >
        {logs.map((log, idx) => (
          <div
            key={idx}
            style={{
              color:
                log.role === 'student'
                  ? '#38bdf8'
                  : log.role === 'tutor'
                  ? '#4ade80'
                  : '#64748b',
            }}
          >
            {log.role === 'student' ? '> You: ' : `🤖 ${props.persona || 'Tutor'}: `}
            {log.text}
          </div>
        ))}
        {busy && <div style={{ color: '#eab308' }}>⏳ Evaluating locally on-device...</div>}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Ask a question or explain your reasoning..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: '#030712',
            color: '#f8fafc',
            fontSize: '0.85rem',
          }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            background: 'var(--ifm-color-primary, #2563eb)',
            color: '#fff',
            border: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: busy ? 'wait' : 'pointer',
          }}
        >
          Ask
        </button>
      </form>
    </div>
  );
}

// --- Interactive Quiz Component Node ---

// --- Interactive Quiz Component Node ---

function QuizNode({
  props,
  children,
  onAction,
  isTeacherMode,
}: {
  props: Record<string, any>;
  children: (SExprNode | any)[];
  onAction?: (action: string, payload?: any) => void;
  isTeacherMode?: boolean;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const handleFocusQuiz = () => {
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 1800);
    };

    window.addEventListener('focus-quiz-node', handleFocusQuiz);
    return () => window.removeEventListener('focus-quiz-node', handleFocusQuiz);
  }, []);

  const questionNode = children.find(
    (c) => typeof c === 'object' && c !== null && c.tag === 'question'
  ) as SExprNode | undefined;

  const optionNodes = children.filter(
    (c) => typeof c === 'object' && c !== null && c.tag === 'option'
  ) as SExprNode[];

  const explanationNode = children.find(
    (c) => typeof c === 'object' && c !== null && c.tag === 'explanation'
  ) as SExprNode | undefined;

  const handleSelect = (idx: number) => {
    if (submitted) return;
    setSelectedIdx(idx);
  };

  const handleCheck = () => {
    if (selectedIdx === null) return;
    setSubmitted(true);
    const chosenOption = optionNodes[selectedIdx];
    const isCorrect = Boolean(chosenOption?.props?.correct);

    if (onAction) {
      onAction('quiz:submit', {
        quizId: props.id || 'anonymous-quiz',
        selectedIdx,
        isCorrect,
      });
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setSubmitted(false);
  };

  const isCurrentCorrect = selectedIdx !== null && Boolean(optionNodes[selectedIdx]?.props?.correct);

  return (
    <div
      id="lesson-quiz-container"
      className="card padding--md margin-vert--md"
      style={{
        border: isHighlighted
          ? '2px solid var(--ifm-color-primary, #2563eb)'
          : '1px solid var(--ifm-color-emphasis-300)',
        boxShadow: isHighlighted
          ? '0 0 20px rgba(37, 99, 235, 0.45)'
          : undefined,
        transform: isHighlighted ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.35s ease-in-out',
      }}
    >
      {isTeacherMode && (
        <div
          style={{
            marginBottom: '12px',
            padding: '8px 12px',
            background: 'rgba(168, 85, 247, 0.15)',
            borderLeft: '4px solid #a855f7',
            borderRadius: '4px',
            color: '#d8b4fe',
            fontSize: '0.82rem',
          }}
        >
          🧑‍🏫 <strong>Teacher Mode:</strong> Expected correct answer is outlined in green.
        </div>
      )}
      {questionNode && (
        <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.75rem' }}>
          <SExprViewRenderer ast={questionNode} onAction={onAction} />
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {optionNodes.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = Boolean(opt.props?.correct);

          let btnClass = 'button button--secondary button--block';
          if (isSelected && !submitted) {
            btnClass = 'button button--primary button--block';
          } else if (submitted) {
            if (isCorrect) btnClass = 'button button--success button--block';
            else if (isSelected && !isCorrect) btnClass = 'button button--danger button--block';
          }

          return (
            <button
              key={idx}
              type="button"
              className={btnClass}
              onClick={() => handleSelect(idx)}
              style={{
                border: isTeacherMode && isCorrect ? '2px solid #22c55e' : undefined,
              }}
            >
              <SExprViewRenderer ast={opt} onAction={onAction} />
            </button>
          );
        })}
      </div>

      <div className="margin-top--md" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {!submitted ? (
          <button
            type="button"
            className="button button--primary button--sm"
            disabled={selectedIdx === null}
            onClick={handleCheck}
          >
            Check Answer
          </button>
        ) : (
          <button type="button" className="button button--secondary button--sm" onClick={handleReset}>
            Retry
          </button>
        )}
      </div>

      {submitted && (
        <div
          className={`alert ${isCurrentCorrect ? 'alert--success' : 'alert--warning'} margin-top--sm`}
          style={{ borderRadius: '6px' }}
        >
          <strong>{isCurrentCorrect ? '✅ Correct!' : '❌ Not quite.'}</strong>{' '}
          {explanationNode ? (
            <SExprViewRenderer ast={explanationNode} onAction={onAction} />
          ) : isCurrentCorrect ? (
            'Great reasoning!'
          ) : (
            'Review the steps above and try again.'
          )}
        </div>
      )}
    </div>
  );
}

// --- Interactive Step-by-Step Problem Walkthrough Node ---

function StepperNode({
  children,
  onAction,
}: {
  props: Record<string, any>;
  children: (SExprNode | any)[];
  onAction?: (action: string, payload?: any) => void;
}) {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const stepNodes = children.filter(
    (c) => typeof c === 'object' && c !== null && c.tag === 'step'
  ) as SExprNode[];

  if (stepNodes.length === 0) return null;

  const isFinalStep = currentStep === stepNodes.length - 1;

  const handleNext = () => {
    if (!isFinalStep) {
      setCurrentStep((s) => s + 1);
    } else {
      // Dispatches visual focus pulse to the quiz card
      window.dispatchEvent(new CustomEvent('focus-quiz-node'));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  return (
    <div
      className="card padding--md margin-vert--md"
      style={{ border: '1px solid var(--ifm-color-emphasis-300)', background: 'var(--ifm-card-background-color)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span className="badge badge--info">
          Step {currentStep + 1} of {stepNodes.length}
        </span>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            type="button"
            className="button button--secondary button--sm"
            disabled={currentStep === 0}
            onClick={handleBack}
          >
            ◀ Back
          </button>
          <button
            type="button"
            className={`button ${isFinalStep ? 'button--primary' : 'button--secondary'} button--sm`}
            onClick={handleNext}
          >
            {isFinalStep ? 'Try Practice Question 👇' : 'Next ▶'}
          </button>
        </div>
      </div>

      <div style={{ padding: '0.5rem 0', minHeight: '60px' }} aria-live="polite">
        <SExprViewRenderer ast={stepNodes[currentStep]} onAction={onAction} />
      </div>
    </div>
  );
}