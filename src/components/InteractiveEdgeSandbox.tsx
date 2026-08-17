import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { EdgeCognitiveEngine, SandboxedEvaluator } from '@school-ai/edge-runtime';

function SandboxComponent() {
  const [engine, setEngine] = useState<EdgeCognitiveEngine | null>(null);
  const [status, setStatus] = useState('Initializing Edge Runtime...');
  const [output, setOutput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    const initSdk = async () => {
      try {
        const edgeEngine = new EdgeCognitiveEngine({
          model: 'Llama-3.2-1B-Instruct-q4f32_1-MLC',
          autoFallback: true
        });

        await edgeEngine.init((progress) => {
          setStatus(`Loading weights: ${Math.round(progress.progress * 100)}%`);
        });

        setEngine(edgeEngine);
        setStatus('Edge runtime ready (100% Client-Side)');
      } catch (err: any) {
        setStatus(`Initialization notice: ${err.message || err}`);
      }
    };

    initSdk();
  }, []);

  const runEvaluation = async () => {
    if (!engine) return;
    setIsEvaluating(true);
    try {
      const res = await engine.executeWithSelfCorrection(
        'Calculate the kinetic energy of a 2kg mass moving at 5m/s (KE = 0.5 * m * v^2)',
        (code) => SandboxedEvaluator.evaluate(code)
      );
      setOutput(`Output: ${res.output}\nResult: ${JSON.stringify(res.executionTrace)}\nSource: ${res.source}\nRetries: ${res.correctionsCount}`);
    } catch (err: any) {
      setOutput(`Evaluation error: ${err.message}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div style={{ border: '1px solid #334155', borderRadius: '8px', padding: '1.25rem', margin: '1.5rem 0', background: '#0f172a' }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#f8fafc' }}>⚡ Neuro-Symbolic Edge Runtime</h4>
      <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>Status: {status}</p>
      
      <button 
        className="button button--primary" 
        onClick={runEvaluation} 
        disabled={!engine || isEvaluating}
      >
        {isEvaluating ? 'Evaluating...' : 'Run Client-Side Loop'}
      </button>

      {output && (
        <pre style={{ marginTop: '1rem', background: '#020617', color: '#4ade80', padding: '1rem', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
          {output}
        </pre>
      )}
    </div>
  );
}

export default function InteractiveEdgeSandbox() {
  return (
    <BrowserOnly fallback={<div>Loading runtime environment...</div>}>
      {() => <SandboxComponent />}
    </BrowserOnly>
  );
}