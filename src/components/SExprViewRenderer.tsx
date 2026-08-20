import React, { useState } from 'react';
import { SExprAST, SExprNode } from '../types/sexpr';

interface Props {
  ast: SExprAST;
  onAction?: (action: string, payload?: any) => void;
}

export default function SExprViewRenderer({ ast, onAction }: Props): React.JSX.Element | null {
  if (ast === null || ast === undefined) return null;
  if (typeof ast !== 'object') {
    return <span>{String(ast)}</span>;
  }

  const { tag, props, children } = ast as SExprNode;

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
      return <QuizNode props={props} children={children} onAction={onAction} />;

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
    
    // Resume audio context if the browser suspended speech synthesis
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    
    window.speechSynthesis.cancel();

    const clean = text.replace(/[*_#`~[\]]/g, '').replace(/[^\x00-\x7F]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    
    utterance.pitch = Number(props.voicePitch) || 1.0;
    utterance.rate = Number(props.voiceRate) || 1.0;
    utterance.lang = props.lang || 'en-US';

    // Pick an available browser voice if available
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

    // Append student prompt + create empty tutor bubble
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
          // If the engine sends cumulative text, use it; otherwise append delta
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

function QuizNode({
  props,
  children,
  onAction,
}: {
  props: Record<string, any>;
  children: (SExprNode | any)[];
  onAction?: (action: string, payload?: any) => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

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

const [failCount, setFailCount] = useState(0);

const synthesizeRemediationLesson = async (subject: string, question: string) => {
    setLogs((prev) => [
      ...prev,
      { role: 'tutor', text: 'Synthesizing an adaptive micro-lesson into the local VFS...' },
    ]);

    const defaultMicroLesson = `
(lesson
  :title "Remediation: Place Value Column Addition"
  (card :type "starter"
    (text "Let's review: 4 units + 3 units = 7 units."))
  (card :type "stepper"
    (step :num 1 "Add the units column first: 4 + 3 = 7")
    (step :num 2 "Add the tens column next: 10 + 10 = 20")
    (step :num 3 "Combine the sums: 20 + 7 = 27"))
  (card :type "practice"
    (quiz :id "rem-1" :prompt "What is 14 + 13?"
      (opt "27" :correct #t)
      (opt "26" :correct #f))))
    `.trim();

    try {
      const aiObj = (window as any).ai?.languageModel || (window as any).LanguageModel;
      let synthesizedLisp = defaultMicroLesson;

      if (aiObj) {
        const session = await (aiObj.create
          ? aiObj.create({
              systemPrompt:
                'Output ONLY a valid 3-step Lisp S-expression lesson AST. Do not include markdown code blocks or explanations.',
            })
          : (window as any).ai.languageModel.create({
              systemPrompt:
                'Output ONLY a valid 3-step Lisp S-expression lesson AST. Do not include markdown code blocks or explanations.',
            }));

        const result = await session.prompt(
          `Create a 3-step micro-lesson S-expression for a student struggling with "${question}" in "${subject}". Use format: (lesson :title "..." (card :type "starter" ...) (card :type "stepper" ...) (card :type "practice" ...))`
        );
        if (result && result.includes('(lesson')) {
          synthesizedLisp = result.replace(/```lisp|```/g, '').trim();
        }
      }

      // Signal parent to mount the synthesized VFS node
      if (onAction) {
        onAction('vfs:mount-remediation', {
          path: `/sys/views/remediation/${props.id || 'current-lesson'}.lisp`,
          astSource: synthesizedLisp,
        });
      }

      setLogs((prev) => [
        ...prev,
        { role: 'tutor', text: 'Adaptive module generated! Loading step-by-step review...' },
      ]);
    } catch (err) {
      console.warn('[Synthesis Error]', err);
    }
  };

  const handleCheck = async () => {
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

if (!isCorrect) {
      const nextFails = failCount + 1;
      setFailCount(nextFails);

      if (nextFails >= 2) {
        await synthesizeRemediationLesson(props.subject || 'Maths', props.prompt || '14 + 13');
        return;
      }

      // ... keep existing single-hint Socratic diagnostic below

      try {
        const aiObj = (window as any).ai?.languageModel || (window as any).LanguageModel;

        if (aiObj) {
          const session = await (aiObj.create
            ? aiObj.create({
                systemPrompt:
                  'The student chose an incorrect quiz option. Give a short, 1-sentence Socratic hint under 15 words explaining why or pointing to the first step. Never give the answer.',
              })
            : (window as any).ai.languageModel.create({
                systemPrompt:
                  'The student chose an incorrect quiz option. Give a short, 1-sentence Socratic hint under 15 words explaining why or pointing to the first step. Never give the answer.',
              }));

          const diagnosticPrompt = `Student selected option index ${selectedIdx} (incorrect). Provide a short Socratic hint.`;
          let streamedHint = '';
          const stream = session.promptStreaming(diagnosticPrompt);

          for await (const chunk of stream) {
            streamedHint = chunk;
            setLogs((prev) => {
              if (prev.length === 0) return prev;
              const next = [...prev];
              next[next.length - 1] = { role: 'tutor', text: streamedHint };
              return next;
            });
          }
          speak(streamedHint);
        } else {
          const fallback = `That's not quite right. Look at the place values again—what do the units add up to?`;
          setLogs((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: 'tutor', text: fallback };
            return next;
          });
          speak(fallback);
        }
      } catch (err) {
        console.warn('[Remediation Error]', err);
      }
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setSubmitted(false);
  };

  const isCurrentCorrect = selectedIdx !== null && Boolean(optionNodes[selectedIdx]?.props?.correct);

  return (
    <div className="card padding--md margin-vert--md" style={{ border: '1px solid var(--ifm-color-emphasis-300)' }}>
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
              style={{ textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => handleSelect(idx)}
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
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
          >
            ◀ Back
          </button>
          <button
            type="button"
            className="button button--secondary button--sm"
            disabled={currentStep >= stepNodes.length - 1}
            onClick={() => setCurrentStep((s) => Math.min(stepNodes.length - 1, s + 1))}
          >
            Next ▶
          </button>
        </div>
      </div>

      <div style={{ padding: '0.5rem 0', minHeight: '60px' }}>
        <SExprViewRenderer ast={stepNodes[currentStep]} onAction={onAction} />
      </div>
    </div>
  );
}