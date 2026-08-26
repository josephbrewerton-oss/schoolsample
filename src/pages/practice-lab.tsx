import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import NeuralLabCanvas from '../components/NeuralLabCanvas';
import NanoAssistantPanel from '../components/NanoAssistantPanel';
import { LanguageSelector } from '@site/src/engine/operational-language';

export default function PracticeLabPage() {
  const [mounted, setMounted] = useState(false);
  const [bootIframe, setBootIframe] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    setMounted(true);
    // Give components 100ms to register their BroadcastChannel listeners first
    const timer = setTimeout(() => setBootIframe(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (newLang: string) => {
    setCurrentLang(newLang);

    // Broadcast language switch to on-device AI worker and canvas
    const channel = new BroadcastChannel('neural_hypervisor_bus');
    channel.postMessage({
      type: 'SET_LANGUAGE',
      lang: newLang,
    });
    channel.close();
  };

  return (
    <Layout title="Practice Lab" description="On-Device Neural Hypervisor">
      {/* Invisible Headless Daemon — boots automatically in background */}
      {bootIframe && (
        <iframe
          src="/schoolsample/worker.html"
          style={{ display: 'none', width: 0, height: 0, border: 'none' }}
          title="neural-engine-daemon"
        />
      )}

      {mounted ? (
        <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
          {/* Top Toolbar / Language Selector */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1rem' }}>
            <LanguageSelector currentLang={currentLang} onSelect={handleLanguageChange} />
          </div>

          {/* S-Expression Canvas Engine (Handles Buffered ASTs & Zero-AI Grading) */}
          <NeuralLabCanvas />

          {/* Decoupled AI Tutor Assistant (Listens to Socratic Hint Events) */}
          <NanoAssistantPanel contextTopic="Key Stage 3 Science" />
        </main>
      ) : (
        <div style={{ maxWidth: '1100px', margin: '3rem auto', textAlign: 'center', color: '#64748b', fontFamily: 'sans-serif' }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading St Joseph's Practice Lab...</p>
        </div>
      )}
    </Layout>
  );
}