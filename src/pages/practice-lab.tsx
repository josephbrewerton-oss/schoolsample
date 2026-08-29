// src/pages/practice-lab.tsx
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import NeuralLabCanvas from '../components/NeuralLabCanvas';
import NanoAssistantPanel from '../components/NanoAssistantPanel';
import { LanguageSelector } from '@site/src/engine/operational-language';

export default function PracticeLabPage() {
  const [mounted, setMounted] = useState(false);
  const [bootIframe, setBootIframe] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  
  // Dynamic topic tracking for Super Teacher Nano
  const [activeStage, setActiveStage] = useState('Key Stage 2');
  const [activeSubject, setActiveSubject] = useState('Mathematics');
  const [activeUnit, setActiveUnit] = useState('Fractions and Decimals');

  const workerUrl = useBaseUrl('/worker.html');

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setBootIframe(true), 150);
    return () => clearTimeout(timer);
  }, []);

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
            onTopicChange={(stage, sub, unit) => {
              if (stage) setActiveStage(stage);
              if (sub) setActiveSubject(sub);
              if (unit) setActiveUnit(unit);
            }}
          />

          {/* Synchronized Super Teacher Nano */}
          <NanoAssistantPanel
            keyStage={activeStage}
            subject={activeSubject}
            unit={activeUnit}
            contextTopic={`${activeStage} • ${activeSubject}: ${activeUnit}`}
          />
        </main>
      ) : (
        <div style={{ maxWidth: '1100px', margin: '3rem auto', textAlign: 'center', color: '#64748b' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading St Joseph's Practice Lab...</p>
        </div>
      )}
    </Layout>
  );
}