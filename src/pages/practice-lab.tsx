// src/pages/practice-lab.tsx
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useLocation } from '@docusaurus/router';
import NeuralLabCanvas from '../components/NeuralLabCanvas';
import NanoAssistantPanel from '../components/NanoAssistantPanel';
import {
  getSavedLanguage,
  listenToLanguageChange,
  setSavedLanguage,
} from '@site/src/engine/operational-language';
import { dispatch } from '../engine/hypercall';
import { hypervisor } from '../engine/hypervisor';

export default function PracticeLabPage() {
  const [mounted, setMounted] = useState(false);
  const [bootIframe, setBootIframe] = useState(false);
  const [currentLang, setCurrentLang] = useState(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });

  const location = useLocation();

  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
    });
    return unsub;
  }, []);

  // Dynamic topic tracking for Super Teacher Nano
  const [activeStage, setActiveStage] = useState('Key Stage 2');
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [activeUnit, setActiveUnit] = useState('Fractions and Decimals');
  const [activeAxiomCheck, setActiveAxiomCheck] = useState<string | undefined>(undefined);

  const workerUrl = useBaseUrl('/worker.html');

  // 1. URL Query Parameter Ingestion & Component Mount
  useEffect(() => {
    setMounted(true);
    // Allow main thread, DOM, and signaling bus ample time to settle before booting worker daemon
    const timer = setTimeout(() => setBootIframe(true), 1000);

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
    setSavedLanguage(newLang);
    const channel = new BroadcastChannel('neural_hypervisor_bus');
    channel.postMessage({
      type: 'SET_LANGUAGE',
      lang: newLang,
    });
    channel.close();
  };

  return (
    <Layout title="Practice Arena" description="St Joseph's Interactive Curriculum Practice Arena">
      {/* Dynamic Base URL Worker Daemon */}
      {bootIframe && (
        <iframe
          ref={(el) => hypervisor.registerWorkerIframe(el)}
          src={workerUrl}
          style={{ display: 'none', width: 0, height: 0, border: 'none' }}
          title="neural-engine-daemon"
        />
      )}

      {mounted ? (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.25rem 1rem 3rem 1rem' }}>
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
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading St Joseph&apos;s Practice Arena...</p>
        </div>
      )}
    </Layout>
  );
}