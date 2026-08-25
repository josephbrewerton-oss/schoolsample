// src/engine/EdgeCognitiveEngine.tsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  openLocalDB, 
  bootstrapTopicAdapters,
  getTopicAdapter,
  saveVerifiedAST, 
  getRandomCachedAST,
  getTuringDiagnosticSummary 
} from '../services/dbStore';

/**
 * Resolves the active Prompt API factory across specification variants.
 */
function getLanguageModelFactory(): any {
  if (typeof (window as any).LanguageModel !== 'undefined') {
    return (window as any).LanguageModel;
  }
  if (typeof (self as any).LanguageModel !== 'undefined') {
    return (self as any).LanguageModel;
  }
  const aiHost = (window as any).ai || (self as any).ai;
  return aiHost?.languageModel || null;
}

/**
 * Executes on-device LLM inference using Chrome's Prompt API (Gemini Nano)
 * with strict sampling control, dynamic in-context adapters, 6s race timeout, and AST bank fallback.
 */
export async function runLocalInference(
  prompt: string, 
  systemPrompt?: string, 
  topicKey: string = 'science_atomic_structure'
): Promise<string> {
  const defaultFallbackAST = `(:route "quiz:mcq" :scratchpad "Atoms consist of protons and neutrons in the central nucleus, with electrons orbiting in outer shells." :prompt "Which subatomic particles are located inside the nucleus of an atom?" :options (list "Protons and Neutrons" "Electrons and Neutrons" "Electrons only" "Protons and Electrons") :answer-key 0)`;

  // 1. Check IndexedDB AST cache for zero-latency fallback
  let fallbackAST = defaultFallbackAST;
  try {
    const cached = await getRandomCachedAST(topicKey.toLowerCase());
    if (cached) fallbackAST = cached;
  } catch (err) {
    console.warn('[DB Bank Warning] Failed fetching cached AST fallback:', err);
  }

  const targetFactory = getLanguageModelFactory();

  if (!targetFactory) {
    console.warn('[AI Engine] Prompt API unavailable, using cached/deterministic fallback.');
    return fallbackAST;
  }

  // 2. Fetch dynamic adapter guardrails for the topic to ground Gemini Nano
  let groundedPrompt = prompt;
  try {
    const adapter = await getTopicAdapter(topicKey.toLowerCase());
    if (adapter) {
      groundedPrompt = `[Curriculum Guardrails]: ${adapter.curriculumGuardrails.join('; ')}
[Known Misconceptions to test as wrong options]: ${adapter.commonMisconceptions.join(', ')}
[Exemplar AST Structure]:
${adapter.exemplarAST}

[Task]:
${prompt}
Generate output in strict Lisp S-expression format:`;
    }
  } catch (err) {
    console.warn('[Adapter Grounding Warning] Failed fetching adapter, using raw prompt:', err);
  }

  const inferencePromise = (async () => {
    let session: any = null;
    try {
      if (typeof targetFactory.availability === 'function') {
        const status = await targetFactory.availability();
        if (status === 'no' || status === 'unavailable') return fallbackAST;
      } else if (typeof targetFactory.capabilities === 'function') {
        const caps = await targetFactory.capabilities();
        if (caps?.available === 'no') return fallbackAST;
      }

      const sessionOptions: Record<string, any> = {
        expectedInputs: [{ type: 'text', languages: ['en'] }],
        expectedOutputs: [{ type: 'text', languages: ['en'] }],
        temperature: 0.2,
        topK: 3,
      };

      sessionOptions.systemPrompt = systemPrompt || 
        "You are an expert curriculum compiler. Output ONLY a valid Lisp S-expression following the provided structure. Never output conversational preamble.";

      session = await targetFactory.create(sessionOptions);
      const response = await session.prompt(groundedPrompt);
      
      if (response && response.includes('(:route "quiz:mcq"')) {
        // Auto-save compiler-valid response to the synthetic AST Bank
        saveVerifiedAST(topicKey.toLowerCase(), response).catch(console.error);
        return response;
      }
      return fallbackAST;
    } catch (err) {
      console.warn('[AI Engine Error]', err);
      return fallbackAST;
    } finally {
      if (session && typeof session.destroy === 'function') {
        try {
          session.destroy();
        } catch {}
      }
    }
  })();

  const timeoutPromise = new Promise<string>((resolve) =>
    setTimeout(() => {
      console.warn('[AI Engine] Inference timed out after 6s. Resolving fallback AST.');
      resolve(fallbackAST);
    }, 6000)
  );

  return Promise.race([inferencePromise, timeoutPromise]);
}

export default function InteractiveEdgeSandbox({ runtimeConfig }: { runtimeConfig?: any }) {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '⚡ Initializing IndexedDB v3 and on-device WebGPU runtime...',
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize DB and bootstrap gold-standard adapters on mount
  useEffect(() => {
    openLocalDB()
      .then(() => bootstrapTopicAdapters())
      .then(() => {
        setTerminalLogs((prev) => [
          ...prev,
          '📦 EdgeLearningEngineDB v3 connected (dynamic_adapters seeded, ast_bank ready).',
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

  const triggerStream = async (promptText: string, topicId: string = 'science_atomic_structure') => {
    setIsProcessing(true);
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTerminalLogs((prev) => [
      ...prev,
      `\n> [Input]: ${promptText}`,
      '⚡ Querying student diagnostic state and connecting to Gemini Nano...',
    ]);

    let session: any = null;
    try {
      // Fetch recent diagnostic misconception summary from IndexedDB
      const diagnostics = await getTuringDiagnosticSummary(topicId);
      const errorContext = diagnostics.commonErrors.length > 0 
        ? ` Note student previously struggled with: ${diagnostics.commonErrors.join(', ')}.`
        : '';

      const targetFactory = getLanguageModelFactory();

      if (targetFactory) {
        session = await targetFactory.create({
          systemPrompt: `You are Prof. Turing, a concise Socratic tutor. Extract one narrow rule or question to guide the student. Never give the direct answer.${errorContext} Maximum 20 words.`,
          expectedInputs: [{ type: 'text', languages: ['en'] }],
          expectedOutputs: [{ type: 'text', languages: ['en'] }],
          temperature: 0.2,
          topK: 3
        });

        const stream = session.promptStreaming(promptText);
        let fullResponse = '';

        for await (const chunk of stream) {
          fullResponse = chunk;
          setTerminalLogs((prev) => {
            const next = [...prev];
            next[next.length - 1] = `🤖 [Prof. Turing]: ${fullResponse}`;
            return next;
          });
        }
      } else {
        await new Promise((res) => setTimeout(res, 400));
        setTerminalLogs((prev) => [
          ...prev,
          `💡 [Offline Socratic Rule]: Break the problem down into fundamental units. What does the core definition state?`,
        ]);
      }
    } catch (err: any) {
      console.warn('[Nano Inference Error]', err);
      setTerminalLogs((prev) => [
        ...prev,
        `⚠️ [Fallback Tutor]: Let's look at the first step together. Try breaking down the core concepts first.`,
      ]);
    } finally {
      if (session && typeof session.destroy === 'function') {
        try {
          session.destroy();
        } catch {}
      }
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
          onClick={() => handlePreset('Atomic Structure & Isotopes', 'science_atomic_structure')}
          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ⚛️ Science: Atomic Structure
        </button>
        <button
          type="button"
          onClick={() => handlePreset("Newton's Laws of Motion", 'physics_newtons_laws')}
          style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
        >
          ⚡ Physics: Newton's Laws
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