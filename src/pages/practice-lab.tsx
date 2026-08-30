// src/pages/practice-lab.tsx
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import NeuralLabCanvas from '../components/NeuralLabCanvas';
import NanoAssistantPanel from '../components/NanoAssistantPanel';
import { LanguageSelector } from '@site/src/engine/operational-language';
import { dispatch } from '../engine/hypercall';

export default function PracticeLabPage() {
  const [mounted, setMounted] = useState(false);
  const [bootIframe, setBootIframe] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  const location = useLocation();

  // Dynamic topic tracking for Super Teacher Nano
  const [activeStage, setActiveStage] = useState('Key Stage 2');
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [activeUnit, setActiveUnit] = useState('Fractions and Decimals');
  const [activeAxiomCheck, setActiveAxiomCheck] = useState<string | undefined>(undefined);

  const workerUrl = useBaseUrl('/worker.html');

  // 1. URL Query Parameter Ingestion & Component Mount
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setBootIframe(true), 150);

    if (typeof window !== 'undefined' && location?.search) {
      const searchParams = new URLSearchParams(location.search);
      const urlKs = searchParams.get('ks');
      const urlSub = searchParams.get('sub');
      const urlUnit = searchParams.get('unit');

      if (urlKs) setActiveStage(urlKs);
      if (urlSub) setActiveSubject(urlSub);
      if (urlUnit) setActiveUnit(urlUnit);
    }

    return () => clearTimeout(timer);
  }, [location.search]);

  // 2. Hydrate Diagnostic Baseline via Hypercall Substrate on Topic Change
  useEffect(() => {
    let isCancelled = false;

    dispatch('LessonSynthesizer', {
      intent: 'inflate:baseline',
      payload: {
        stage: activeStage,
        subject: activeSubject,
        topic: activeUnit,
      },
    }).then((res) => {
      if (!isCancelled && res.ok && res.data?.socraticCheck) {
        setActiveAxiomCheck(res.data.socraticCheck);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [activeStage, activeSubject, activeUnit]);

  const handleLanguageChange = (newLang: string) => {
    setCurrentLang(newLang);
    const channel = new BroadcastChannel('neural_hypervisor_bus');
    channel.postMessage({
      type: 'SET_LANGUAGE',
      lang: newLang,
    });
    channel.close();
  };

  return (
    <Layout title="Practice Lab" description="On-Device Neural Hypervisor">
      {/* Dynamic Base URL Worker Daemon */}
      {bootIframe && (
        <iframe
          src={workerUrl}
          style={{ display: 'none', width: 0, height: 0, border: 'none' }}
          title="neural-engine-daemon"
        />
      )}

      {mounted ? (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
            <LanguageSelector currentLang={currentLang} onSelect={handleLanguageChange} />
          </div>

          {/* S-Expression Canvas Engine */}
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

          {/* Synchronized Super Teacher Nano */}
          <NanoAssistantPanel
            seedKey={`${activeStage}:${activeSubject}:${activeUnit}`}
            keyStage={activeStage}
            subject={activeSubject}
            unit={activeUnit}
            contextTopic={`${activeStage} • ${activeSubject}: ${activeUnit}`}
            activePrompt={activeAxiomCheck}
          />
        </main>
      ) : (
        <div style={{ maxWidth: '1100px', margin: '3rem auto', textAlign: 'center', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading St Joseph&apos;s Practice Lab...</p>
        </div>
      )}
    </Layout>
  );
}