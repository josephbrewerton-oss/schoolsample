// src/engine/EdgeCognitiveEngine.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  openLocalDB, 
  bootstrapTopicAdapters,
  saveVerifiedAST, 
  getRandomCachedAST,
  getTuringDiagnosticSummary 
} from '../services/dbStore';
import { resolveSeedCoordinate } from '@site/static/promptStrategies';
import { aiCaller } from './aicaller';

/**
 * Generates an instant, route-appropriate fallback AST based on topicKey.
 */
function generateContextualFallback(topicKey: string, isQuiz: boolean): string {
  const seed = resolveSeedCoordinate(topicKey);

  if (isQuiz) {
    return `(:route "quiz:mcq" :scratchpad "${seed.axiom}" :prompt "${seed.pivot}" :options (list "${seed.axiom}" "Incorrect alternative 1" "Incorrect alternative 2" "Incorrect alternative 3") :hint "Consider the core principle." :answer-key 0)`;
  }

  return `(:route "lesson:view" :axiom "${seed.axiom}" :trap "${seed.trap}" :pivot "${seed.pivot}")`;
}

/**
 * Executes on-device LLM inference using the unified aiCaller singleton.
 */
export async function runLocalInference(
  prompt: string, 
  systemPrompt?: string, 
  topicKey: string = 'ks3:sci:atomic'
): Promise<string> {
  const isQuizRequest = prompt.includes('quiz:mcq') || !prompt.includes('lesson:view');
  let fallbackAST = generateContextualFallback(topicKey, isQuizRequest);

  try {
    const cached = await getRandomCachedAST(topicKey.toLowerCase());
    if (cached) fallbackAST = cached;
  } catch (err) {
    console.warn('[DB Bank Warning] Failed fetching cached AST fallback:', err);
  }

  const inferencePromise = (async () => {
    try {
      const rawResponse = await aiCaller.promptText({
        prompt,
        systemPrompt: systemPrompt || 
          "You are an expert Oak Curriculum compiler. Output ONLY a valid Lisp S-expression. Never output markdown backticks or conversational text.",
      });

      let sanitized = (rawResponse || '')
        .replace(/```(?:lisp|scheme)?/gi, '')
        .replace(/```/g, '')
        .trim();

      const firstParen = sanitized.indexOf('(');
      const lastParen = sanitized.lastIndexOf(')');

      if (firstParen !== -1 && lastParen !== -1 && lastParen > firstParen) {
        sanitized = sanitized.substring(firstParen, lastParen + 1);
      }

      // Multi-route AST Validation
      const isQuizValid = sanitized.includes(':prompt') && sanitized.includes(':options');
      const isLessonValid = sanitized.includes(':axiom') && sanitized.includes(':trap');

      if (isQuizValid || isLessonValid) {
        saveVerifiedAST(topicKey.toLowerCase(), sanitized).catch(console.error);
        return sanitized;
      }

      return fallbackAST;
    } catch (err) {
      console.warn('[AI Engine Error]', err);
      return fallbackAST;
    }
  })();

  const timeoutPromise = new Promise<string>((resolve) =>
    setTimeout(() => {
      resolve(fallbackAST);
    }, 6000)
  );

  return Promise.race([inferencePromise, timeoutPromise]);
}

export default function InteractiveEdgeSandbox({ runtimeConfig }: { runtimeConfig?: any }) {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ Initializing IndexedDB v4 and on-device WebGPU runtime...',
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    openLocalDB()
      .then(() => bootstrapTopicAdapters())
      .then(() => {
        setTerminalLogs((prev) => [
          ...prev,
          '📦 EdgeLearningEngineDB v4 connected (dynamic_adapters seeded, ast_bank ready).',
          '⚡ On-device Gemini Nano ready. Select a lesson topic or enter a query below.'
        ]);
      })
      .catch((err) => {
        console.error('[IndexedDB Init Error]', err);
        setTerminalLogs((prev) => [
          ...prev,
          '⚠️ IndexedDB initialization failed. Running in memory-only mode.'
        ]);
      });
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [terminalLogs]);

  const triggerStream = async (promptText: string, topicId: string = 'ks3:sci:atomic') => {
    setIsProcessing(true);
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTerminalLogs((prev) => [
      ...prev,
      `\n> [Input]: ${promptText}`,
      '⚡ Querying student diagnostic state and connecting to Gemini Nano...',
    ]);

    try {
      const diagnostics = await getTuringDiagnosticSummary(topicId);
      const errorContext = diagnostics.commonErrors.length > 0 
        ? ` Note student previously struggled with: ${diagnostics.commonErrors.join(', ')}.`
        : '';

      const stream = aiCaller.promptStream({
        prompt: promptText,
        systemPrompt: `You are Prof. Turing, a concise Socratic tutor. Guide the student conceptually without giving away the direct answer.${errorContext} Keep responses under 25 words.`,
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse = chunk;
        setTerminalLogs((prev) => {
          const next = [...prev];
          next[next.length - 1] = `🤖 [Prof. Turing]: ${fullResponse}`;
          return next;
        });
      }
    } catch (err: any) {
      console.warn('[Nano Inference Error]', err);
      setTerminalLogs((prev) => [
        ...prev,
        `💡 [Offline Socratic Rule]: Break the problem down into fundamental units. What does the core definition state?`,
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreset = (topic: string, topicId: string) => {
    triggerStream(`Explore concept: ${topic}`, topicId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;
    triggerStream(inputQuery);
    setInputQuery('');
  };

  return (
    <div
      ref={containerRef}
      style={{ marginTop: '1.5rem', background: '#0f172a', borderRadius: '12px', padding: '1.5rem', color: '#fff' }}
    >
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => handlePreset('Atomic Structure & Isotopes', 'ks3:sci:atomic')}
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ⚛️ Science: Atomic Structure
        </button>
        <button
          type="button"
          onClick={() => handlePreset("Newton's Laws of Motion", 'ks2:sci:forces')}
          style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ⚡ Physics: Forces & Motion
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Ask Prof. Turing a question..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }}
        />
        <button
          type="submit"
          disabled={isProcessing}
          style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 600, cursor: isProcessing ? 'wait' : 'pointer' }}
        >
          {isProcessing ? 'Thinking...' : 'Submit Query 🚀'}
        </button>
      </form>

      <div
        style={{
          background: '#020617',
          border: '1px solid #1e293b',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '140px',
          maxHeight: '240px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          color: '#38bdf8'
        }}
      >
        {terminalLogs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: '4px', whiteSpace: 'pre-wrap' }}>{log}</div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}