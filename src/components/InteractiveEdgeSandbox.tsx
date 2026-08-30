// src/components/InteractiveEdgeSandbox.tsx
import React, { useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import SExprViewRenderer from './SExprViewRenderer';
import { aiCaller } from '../engine/aicaller';

interface SandboxProps {
  onSaveToVfs?: (path: string, content: string) => Promise<void> | void;
}

const DEFAULT_TEMPLATE = `(lesson
  :title "Primary Science: Plant Parts"
  (card :type "starter"
    (text "Plants have roots, stems, leaves, and flowers."))
  (card :type "stepper"
    (step :num 1 "Roots anchor the plant and absorb water.")
    (step :num 2 "Stems carry water and hold up leaves.")
    (step :num 3 "Leaves absorb sunlight to make food."))
  (card :type "practice"
    (quiz :id "sci-1" :prompt "Which part absorbs water from soil?"
      (opt "Roots" :correct #t)
      (opt "Leaves" :correct #f)
      (opt "Flowers" :correct #f))))`;

function TeacherSandboxInner({ onSaveToVfs }: SandboxProps) {
  const [lispCode, setLispCode] = useState(DEFAULT_TEMPLATE);
  const [topicPrompt, setTopicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Synthesize Oak lesson via unified aiCaller substrate
  const handleAIGenerate = async () => {
    if (!topicPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setSaveStatus('');

    try {
      const systemPrompt =
        'Generate valid Oak-standard Lisp S-expression lesson ASTs only. Follow the structure: (lesson :title "..." (card :type "starter" ...) (card :type "stepper" ...) (card :type "practice" ...)). Do not return markdown fences or explanation.';

      const prompt = `Synthesize a primary school lesson on topic: "${topicPrompt}". Output only pure Lisp AST.`;

      const result = await aiCaller.promptText({
        prompt,
        systemPrompt,
        temperature: 0.1,
      });

      if (result && result.includes('(lesson')) {
        let sanitized = result
          .replace(/```(?:lisp|scheme)?/gi, '')
          .replace(/```/g, '')
          .trim();

        const firstParen = sanitized.indexOf('(');
        const lastParen = sanitized.lastIndexOf(')');
        if (firstParen !== -1 && lastParen !== -1 && lastParen > firstParen) {
          sanitized = sanitized.substring(firstParen, lastParen + 1);
        }

        setLispCode(sanitized);
      }
    } catch (err) {
      console.warn('[Teacher Gen Error]:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Commit lesson AST to VFS
  const handleSave = async () => {
    const slug = topicPrompt.trim().toLowerCase().replace(/[^a-z0-9]/g, '-') || 'custom-lesson';
    const vfsPath = `/sys/views/lessons/${slug}.lisp`;

    if (onSaveToVfs) {
      await onSaveToVfs(vfsPath, lispCode);
    }
    setSaveStatus(`Saved to ${vfsPath}`);
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '16px', background: '#090d16', color: '#fff', minHeight: '80vh', borderRadius: '8px' }}>
      {/* Code Editor & AI Generator */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            placeholder="E.g. Fractions: Equivalent Halves"
            value={topicPrompt}
            onChange={(e) => setTopicPrompt(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #2d3748', background: '#1a202c', color: '#fff' }}
          />
          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={isGenerating}
            style={{ padding: '10px 16px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '6px', cursor: isGenerating ? 'wait' : 'pointer', fontWeight: 600 }}
          >
            {isGenerating ? 'Synthesizing...' : 'AI Generate'}
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ padding: '10px 16px', background: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
          >
            Save to VFS
          </button>
        </div>

        {saveStatus && <div style={{ color: '#48bb78', fontSize: '13px' }}>{saveStatus}</div>}

        <textarea
          value={lispCode}
          onChange={(e) => setLispCode(e.target.value)}
          spellCheck={false}
          style={{
            flex: 1,
            width: '100%',
            background: '#0e1726',
            color: '#63b3ed',
            fontFamily: 'monospace',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #1e293b',
            fontSize: '13px',
            lineHeight: 1.5,
            resize: 'none',
          }}
        />
      </div>

      {/* Real-time AST Render Pane */}
      <div style={{ border: '1px solid #1e293b', borderRadius: '8px', overflow: 'auto', background: '#0b1120', padding: '12px' }}>
        <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#718096', marginBottom: '12px' }}>
          Live Lesson Preview
        </div>
        <SExprViewRenderer source={lispCode} />
      </div>
    </div>
  );
}

export default function InteractiveEdgeSandbox(props: SandboxProps) {
  return (
    <BrowserOnly fallback={<div style={{ padding: '2rem', color: '#94a3b8' }}>Loading teacher authoring suite...</div>}>
      {() => <TeacherSandboxInner {...props} />}
    </BrowserOnly>
  );
}