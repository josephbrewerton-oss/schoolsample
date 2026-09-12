// src/pages/practice-lab.tsx
import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import NeuralLabCanvas from '../components/NeuralLabCanvas';
import NanoAssistantPanel from '../components/NanoAssistantPanel';
import PageMeta from '../components/PageMeta';
import { getAssetUrl } from '../utils/url';
import {
  getSavedLanguage,
  listenToLanguageChange,
} from '../engine/operational-language';
import { dispatch } from '../engine/hypercall';
import { hypervisor } from '../engine/hypervisor';

// In-line error boundary to capture child crashes without wiping the page
class ComponentGuard extends Component<
  { label: string; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[Guard] Crash inside ${this.props.label}:`, error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            margin: '1rem 0',
            padding: '1.25rem',
            background: '#450a0a',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            color: '#fecaca',
            fontFamily: 'monospace',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.5rem', color: '#f87171' }}>
            Error rendering {this.props.label}:
          </strong>
          <code>{(this.state.error as Error).message}</code>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function PracticeLabPage() {
  const [mounted, setMounted] = useState(false);
  const [bootIframe, setBootIframe] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });

  const location = useLocation();

  const [activeStage, setActiveStage] = useState('Key Stage 2');
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [activeUnit, setActiveUnit] = useState('Fractions and Decimals');
  const [activeAxiomCheck, setActiveAxiomCheck] = useState<string | undefined>(undefined);

  const workerUrl = getAssetUrl('worker.html?v=1.2.1');

  // 1. Language Bus Listener
  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
    });
    return unsub;
  }, []);

  // 2. Mount and Worker Delayed Activation
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setBootIframe(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // 3. Query Param Ingestion
  useEffect(() => {
    if (typeof window !== 'undefined' && location?.search) {
      const searchParams = new URLSearchParams(location.search);
      const urlKs = searchParams.get('ks');
      const urlSub = searchParams.get('sub');
      const urlUnit = searchParams.get('unit');

      if (urlKs && urlKs !== activeStage) setActiveStage(urlKs);
      if (urlSub && urlSub !== activeSubject) setActiveSubject(urlSub);
      if (urlUnit && urlUnit !== activeUnit) setActiveUnit(urlUnit);
    }
  }, [location.search]);

  // 4. Baseline Dispatch with Safe Promise Guard
  useEffect(() => {
    let isCancelled = false;

    try {
      const call = dispatch('LessonSynthesizer', {
        intent: 'inflate:baseline',
        payload: {
          stage: activeStage,
          subject: activeSubject,
          topic: activeUnit,
        },
      });

      if (call && typeof call.then === 'function') {
        call
          .then((res) => {
            if (!isCancelled && res?.ok && res?.data?.socraticCheck) {
              setActiveAxiomCheck(res.data.socraticCheck);
            }
          })
          .catch((err) => console.warn('[Baseline] Dispatch rejected:', err));
      }
    } catch (err) {
      console.warn('[Baseline] Dispatch threw synchronously:', err);
    }

    return () => {
      isCancelled = true;
    };
  }, [activeStage, activeSubject, activeUnit]);

  return (
    <PageMeta title="Practice Arena" description="St Joseph's Interactive Curriculum Practice Arena">
      {/* Background worker iframe with null-safe ref */}
      {bootIframe && (
        <iframe
          ref={(el) => {
            if (el && hypervisor?.registerWorkerIframe) {
              hypervisor.registerWorkerIframe(el);
            }
          }}
          src={workerUrl}
          style={{ display: 'none', width: 0, height: 0, border: 'none' }}
          title="neural-engine-daemon"
        />
      )}

      {/* Explicit dark container so content never blends with a white layout */}
      <div
        style={{
          minHeight: 'calc(100vh - 60px)',
          backgroundColor: '#0f172a',
          color: '#f8fafc',
          padding: '1.5rem 1rem 3rem 1rem',
        }}
      >
        {mounted ? (
          <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <ComponentGuard label="NeuralLabCanvas">
              <NeuralLabCanvas
                initialKeyStage={activeStage}
                initialSubject={activeSubject}
                initialUnit={activeUnit}
                onTopicChange={(stage, sub, unit) => {
                  if (stage) setActiveStage(stage);
                  if (sub) setActiveSubject(sub);
                  if (unit) setActiveUnit(unit);
                }}
              />
            </ComponentGuard>

            <ComponentGuard label="NanoAssistantPanel">
              <NanoAssistantPanel
                seedKey={`${activeStage}:${activeSubject}:${activeUnit}`}
                keyStage={activeStage}
                subject={activeSubject}
                unit={activeUnit}
                contextTopic={`${activeStage} • ${activeSubject}: ${activeUnit}`}
                activePrompt={activeAxiomCheck}
              />
            </ComponentGuard>
          </main>
        ) : (
          <div style={{ maxWidth: '1100px', margin: '3rem auto', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading St Joseph&apos;s Practice Arena...</p>
          </div>
        )}
      </div>
    </PageMeta>
  );
}