// src/pages/settings.tsx
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { CurriculumProviderKey } from '../data/curriculumRegistry';
import { aiCaller } from '../engine/aicaller';

export default function SettingsPage() {
  const [curriculumStandard, setCurriculumStandard] = useState<CurriculumProviderKey>('uk_oak');
  const [nanoStatus, setNanoStatus] = useState<'checking' | 'ready' | 'after-download' | 'unavailable'>('checking');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // 1. Load saved curriculum standard
    const saved = localStorage.getItem('curriculum_standard') as CurriculumProviderKey;
    if (saved) {
      setCurriculumStandard(saved);
    }

    // 2. Check local Gemini Nano availability via unified aiCaller
    async function checkNano() {
      try {
        const availability = await aiCaller.checkAvailability();
        if (availability.status === 'readily') {
          setNanoStatus('ready');
        } else if (availability.status === 'after-download') {
          setNanoStatus('after-download');
        } else {
          setNanoStatus('unavailable');
        }
      } catch {
        setNanoStatus('unavailable');
      }
    }

    checkNano();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('curriculum_standard', curriculumStandard);

    // Dispatch custom and storage event so open tabs/components update reactively
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('curriculum_standard_changed', { detail: curriculumStandard }));

    setSaveMessage('✅ Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <Layout title="Settings" description="Manage local neural engine and curriculum preferences.">
      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
          }}
        >
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem' }}>
            ⚙️ Runtime & Curriculum Settings
          </h1>

          <form onSubmit={handleSave}>
            {/* Runtime Status Section */}
            <div style={{ marginBottom: '2rem', padding: '1.25rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                🧠 On-Device Neural Engine
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Chrome Gemini Nano Status:</span>
                {nanoStatus === 'checking' && <span style={{ color: '#64748b' }}>Checking runtime...</span>}
                {nanoStatus === 'ready' && (
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Active (Hardware Accelerated)
                  </span>
                )}
                {nanoStatus === 'after-download' && (
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Download Required (Will auto-fetch on first run)
                  </span>
                )}
                {nanoStatus === 'unavailable' && (
                  <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Offline / Prompt API Disabled
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', marginBottom: 0 }}>
                Uses Chrome's Built-in Prompt API with local model execution.
              </p>
            </div>

            {/* Curriculum Standard Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="curriculum-standard-select" style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                Curriculum Framework
              </label>
              <select
                id="curriculum-standard-select"
                value={curriculumStandard}
                onChange={(e) => setCurriculumStandard(e.target.value as CurriculumProviderKey)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                }}
              >
                <option value="uk_oak">UK National Curriculum (Oak National Academy)</option>
                <option value="international">International / Cambridge Standard</option>
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Save Preferences
              </button>
              {saveMessage && <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>{saveMessage}</span>}
            </div>
          </form>
        </div>
      </main>
    </Layout>
  );
}