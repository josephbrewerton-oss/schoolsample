// src/components/InteractiveEdgeSandbox.tsx
import React, { useState } from 'react';
import SExprViewRenderer from './SExprViewRenderer';
import { aiCaller } from '../engine/aicaller';

interface SandboxProps {
  onSaveToVfs?: (path: string, content: string) => Promise<void> | void;
}

const TEMPLATES: Record<string, string> = {
  science: `(lesson
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
      (opt "Flowers" :correct #f))))`,

  cssAst: `(view
  :style (:rule (:bg "#0f172a") (:padding "20px") (:radius "12px") (:gap "14px"))
  (header :level 2 
    :style (:rule (:color "#f8fafc") (:fontSize "20px") (:fontWeight "700"))
    "🎨 Liturgical & CSS AST Engine Showcase")
  (callout :variant "info" 
    :style (:rule (:liturgical :violet) (:padding "14px") (:radius "8px"))
    "✝️ Liturgical Violet Token applied directly via S-Expression AST (:liturgical :violet). Perfect for Lent and Advent lessons.")
  (box 
    :style (:rule (:liturgical :gold) (:padding "16px") (:radius "10px") (:border "2px solid #facc15"))
    (header :level 3 :style (:rule (:color "#854d0e")) "✨ Easter & Eucharistic Gold Token")
    (text :style (:rule (:color "#713f12") (:fontSize "15px")) 
      "CSS AST properties (:bg, :radius, :padding, :color, :gap) compile cleanly into verified, zero-CLS DOM element styles without raw CSS string hazards."))
  (box 
    :style (:rule (:bg "#1e293b") (:color "#38bdf8") (:padding "12px") (:radius "8px") (:fontSize "13px"))
    (text "⚡ Zero Runtime Bloat: Styles are evaluated in-memory during AST evaluation.")))`,

  virtualized: `(view
  :virtualize #t
  :style (:rule (:gap "10px"))
  (header :level 3 :style (:rule (:color "#38bdf8")) "🚀 Virtualized AST Node Stream (12 Subtrees)")
  (callout :variant "success" "This list contains 12 heavy AST nodes. Off-screen subtrees are kept lightweight and only mounted as they scroll into view.")
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 1: Baptism - Gateway of the Sacraments"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 2: Confirmation - The Seal of the Holy Spirit"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 3: Holy Eucharist - Source and Summit"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 4: Penance & Reconciliation - God's Merciful Pardon"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 5: Anointing of the Sick - Spiritual and Bodily Healing"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 6: Holy Orders - Priesthood in persona Christi"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 7: Holy Matrimony - Covenant of Love & Life"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 8: The Nicene Creed - Symbolum Fidei"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 9: Liturgy of the Word - Proclamation of Scripture"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 10: Liturgy of the Eucharist - Transubstantiation"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 11: Communion Rite - Lamb of God & Receiving"))
  (box :style (:rule (:bg "#1e293b") (:padding "12px") (:radius "8px")) (text "Item 12: Concluding Rites - 'Ite, missa est'"))
)`,
};

function TeacherSandboxInner({ onSaveToVfs }: SandboxProps) {
  const [lispCode, setLispCode] = useState(TEMPLATES.science);
  const [topicPrompt, setTopicPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Synthesize Oak lesson via unified aiCaller substrate
  const handleAIGenerate = async () => {
    if (!topicPrompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setSaveStatus('');

    if (!aiCaller.isPromptApiAvailableSync()) {
      const fallbackAST = `(lesson :title "${topicPrompt}"
  (card :type "starter" :prompt "What foundational rule governs ${topicPrompt}?")
  (card :type "stepper" :axiom "Core curriculum rule for ${topicPrompt}" :trap "Common misconception regarding ${topicPrompt}")
  (card :type "practice" :prompt "Identify the correct statement about ${topicPrompt}" :options ("Correct rule" "Common trap" "Opposite" "Irrelevant") :answer-key 0))`;
      setLispCode(fallbackAST);
      setIsGenerating(false);
      return;
    }

    try {
      const systemPrompt =
        'Generate valid Oak-standard Lisp S-expression lesson ASTs only. Follow the structure: (lesson :title "..." (card :type "starter" ...) (card :type "stepper" ...) (card :type "practice" ...)). Do not return markdown fences or explanation.';

      const prompt = `Synthesize a primary school lesson on topic: "${topicPrompt}". Output only pure Lisp AST.`;

      const result = await aiCaller.promptText({
        prompt,
        systemPrompt,
        temperature: 0.1,
        timeoutMs: 15000,
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
    } catch {
      const fallbackAST = `(lesson :title "${topicPrompt}"
  (card :type "starter" :prompt "What foundational rule governs ${topicPrompt}?")
  (card :type "stepper" :axiom "Core curriculum rule for ${topicPrompt}" :trap "Common misconception regarding ${topicPrompt}")
  (card :type "practice" :prompt "Identify the correct statement about ${topicPrompt}" :options ("Correct rule" "Common trap" "Opposite" "Irrelevant") :answer-key 0))`;
      setLispCode(fallbackAST);
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

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Templates:</span>
          <button
            type="button"
            onClick={() => setLispCode(TEMPLATES.science)}
            style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', background: '#1e293b', color: '#93c5fd', border: '1px solid #334155', cursor: 'pointer' }}
          >
            🌱 Science
          </button>
          <button
            type="button"
            onClick={() => setLispCode(TEMPLATES.cssAst)}
            style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', background: '#1e293b', color: '#c084fc', border: '1px solid #334155', cursor: 'pointer' }}
          >
            🎨 CSS AST &amp; Liturgical
          </button>
          <button
            type="button"
            onClick={() => setLispCode(TEMPLATES.virtualized)}
            style={{ padding: '4px 10px', fontSize: '12px', borderRadius: '4px', background: '#1e293b', color: '#6ee7b7', border: '1px solid #334155', cursor: 'pointer' }}
          >
            🚀 Virtualized DOM (12 Nodes)
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
  return <TeacherSandboxInner {...props} />;
}