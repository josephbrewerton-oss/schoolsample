// src/pages/settings.tsx
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { CurriculumProviderKey } from '../data/curriculumRegistry';
import { getInstalledCurriculumPacks, CustomCurriculumPack } from '../services/curriculumPackStore';
import Link from '@docusaurus/Link';
import { aiCaller, hasUserGrantedAiConsent, setUserAiConsent } from '../engine/aicaller';
import {
  SUPPORTED_LANGUAGES,
  getSavedLanguage,
  setSavedLanguage,
} from '../engine/operational-language';
import { translatePageDOM, restorePageDOM } from '../engine/universalDomTranslator';

export default function SettingsPage() {
  const [curriculumStandard, setCurriculumStandard] = useState<CurriculumProviderKey>('uk_oak');
  const [preferredDifficulty, setPreferredDifficulty] = useState<'warmup' | 'challenger' | 'brainbuster'>('challenger');
  const [hasAiConsent, setHasAiConsent] = useState<boolean>(false);
  const [nanoStatus, setNanoStatus] = useState<'checking' | 'ready' | 'after-download' | 'unavailable'>('checking');
  const [saveMessage, setSaveMessage] = useState('');
  const [testResult, setTestResult] = useState('');
  const [portalLanguage, setPortalLanguage] = useState<string>('en');
  const [cacheClearNotice, setCacheClearNotice] = useState('');
  const [customPacks, setCustomPacks] = useState<CustomCurriculumPack[]>([]);

  useEffect(() => {
    setCustomPacks(getInstalledCurriculumPacks());
    // 1. Load saved curriculum standard & difficulty & consent & language
    const savedStandard = localStorage.getItem('curriculum_standard') as CurriculumProviderKey;
    if (savedStandard) {
      setCurriculumStandard(savedStandard);
    }

    const savedDifficulty = localStorage.getItem('preferred_difficulty') as any;
    if (savedDifficulty) {
      setPreferredDifficulty(savedDifficulty);
    }

    setPortalLanguage(getSavedLanguage());
    setHasAiConsent(hasUserGrantedAiConsent());

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

  const handleToggleConsent = (granted: boolean) => {
    setUserAiConsent(granted);
    setHasAiConsent(granted);
    if (!granted) {
      aiCaller.destroy();
      setTestResult('🌱 Eco Mode Active: Neural downloads disabled. Relying 100% on zero-data offline curriculum rules.');
    } else {
      setTestResult('🚀 In-Browser Brainpower Enabled: Permitted to use on-device Gemini Nano when present.');
    }
  };

  const handleTestBrainpower = async () => {
    setTestResult('Testing device brainpower...');
    try {
      const avail = await aiCaller.checkAvailability();
      if (!hasAiConsent) {
        setTestResult('🌱 Eco Mode Active: On-device model execution is disabled until you give explicit consent below.');
      } else if (avail.status === 'readily') {
        setTestResult('🎉 High Brainpower: On-device Gemini Nano is ready to generate live custom questions!');
      } else if (avail.status === 'after-download') {
        setTestResult('📥 Model Download Available: Your Chromebook can download Gemini Nano in Chrome for offline AI.');
      } else {
        setTestResult('⚡ Eco Mode Active: Running fast, battery-safe verified curriculum questions directly from your device.');
      }
    } catch {
      setTestResult('⚡ Eco Mode Active: Verified offline curriculum questions ready.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('curriculum_standard', curriculumStandard);
    localStorage.setItem('preferred_difficulty', preferredDifficulty);
    setUserAiConsent(hasAiConsent);
    setSavedLanguage(portalLanguage);

    if (portalLanguage && portalLanguage !== 'en') {
      translatePageDOM(portalLanguage);
    } else {
      restorePageDOM();
    }

    // Dispatch custom and storage event so open tabs/components update reactively
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('curriculum_standard_changed', { detail: curriculumStandard }));

    setSaveMessage('✅ Settings saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleClearTranslationCache = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('cache_trans_') || key.startsWith('trans_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      setCacheClearNotice(`Cleared ${keysToRemove.length} cached translations.`);
      setTimeout(() => setCacheClearNotice(''), 3000);
    } catch {}
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
            {/* Device Brainpower & In-Browser Download */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  🧠 Device Brainpower & In-Browser AI
                </h2>
                <button
                  type="button"
                  onClick={handleTestBrainpower}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#1e40af',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  🔍 Test Device Brainpower
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '0.75rem' }}>
                <span style={{ fontWeight: 600, color: '#334155' }}>Chrome Gemini Nano Status:</span>
                {nanoStatus === 'checking' && <span style={{ color: '#64748b' }}>Checking runtime...</span>}
                {nanoStatus === 'ready' && (
                  <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Active (Hardware Accelerated)
                  </span>
                )}
                {nanoStatus === 'after-download' && (
                  <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Download Available (Chrome fetches model on first run)
                  </span>
                )}
                {nanoStatus === 'unavailable' && (
                  <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '2px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Offline Mode (Verified Pre-Compiled Curriculum)
                  </span>
                )}
              </div>

              {testResult && (
                <div style={{ marginTop: '0.75rem', padding: '8px 12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', color: '#1e293b' }}>
                  {testResult}
                </div>
              )}

              <div style={{ marginTop: '0.85rem', padding: '0.75rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #dbeafe', fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.5 }}>
                <strong>💻 How does it work on Chromebooks?</strong>
                <br />
                School Chromebooks and modern PCs can run AI models right inside Chrome! When supported, Chrome downloads the model once to the device cache. After that, it generates customized practice questions and Socratic hints <strong>completely offline</strong> without needing school Wi-Fi or sending data to the cloud.
              </div>

              {/* Explicit UK GDPR / Children's Code Resource Consent Card */}
              <div
                style={{
                  marginTop: '1rem',
                  padding: '1rem 1.25rem',
                  background: hasAiConsent ? '#f0fdf4' : '#fffbeb',
                  border: `2px solid ${hasAiConsent ? '#86efac' : '#fcd34d'}`,
                  borderRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '1.1rem' }}>{hasAiConsent ? '🛡️' : '🔒'}</span>
                      <strong style={{ color: hasAiConsent ? '#166534' : '#92400e', fontSize: '0.95rem' }}>
                        Pupil Data & Device Consent (UK Children's Code / GDPR)
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: hasAiConsent ? '#14532d' : '#78350f', margin: '0.35rem 0 0.5rem 0', lineHeight: 1.45 }}>
                      {hasAiConsent ? (
                        <>
                          <strong>Status: In-Browser AI Permitted.</strong> Your browser is authorized to use on-device Gemini Nano when present. 
                          Questions are generated locally with zero cloud telemetry.
                        </>
                      ) : (
                        <>
                          <strong>Status: Eco Mode (Default).</strong> Zero downloads and zero extra storage used. 
                          To protect device storage quotas and mobile data limits, model downloading is turned off until explicitly enabled.
                        </>
                      )}
                    </p>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      📦 Model size: ~1.5 GB in Chrome cache &nbsp;|&nbsp; 📶 Recommended only on unmetered school Wi-Fi &nbsp;|&nbsp; 🔒 100% On-device
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {hasAiConsent ? (
                      <button
                        type="button"
                        onClick={() => handleToggleConsent(false)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: '1px solid #ef4444',
                          background: '#ffffff',
                          color: '#dc2626',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        🛑 Switch Back to Eco Mode
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleConsent(true)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#16a34a',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
                        }}
                      >
                        ✅ Allow In-Browser AI Download
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Default Challenge Level */}
            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="difficulty-select" style={{ display: 'block', fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                🎯 Default Challenge Level
              </label>
              <select
                id="difficulty-select"
                value={preferredDifficulty}
                onChange={(e) => setPreferredDifficulty(e.target.value as any)}
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
                <option value="warmup">🌱 Warm-Up (Level 1) — Simple words, friendly confidence builder</option>
                <option value="challenger">⚡ Challenger (Level 2) — Everyday scenarios and clever distractors</option>
                <option value="brainbuster">🏆 Brain Buster (Level 3) — Deep thinking, multi-step problem solving</option>
              </select>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.4rem', marginBottom: 0 }}>
                You can also change your challenge level any time right on the Practice Lab screen!
              </p>
            </div>

            {/* Universal Language & Translation Settings */}
            <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '0.75rem' }}>
                <label htmlFor="portal-language-select" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🌐</span> Universal Portal Language & Translation
                </label>
                <button
                  type="button"
                  onClick={handleClearTranslationCache}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  title="Clear locally stored translations"
                >
                  🧹 Clear Translation Cache
                </button>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                Select your default language. The Universal Translation Engine automatically translates all pages, navigation items, lesson plans, and interactive questions across the entire portal.
              </p>

              <select
                id="portal-language-select"
                value={portalLanguage}
                onChange={(e) => setPortalLanguage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '0.95rem',
                  color: '#0f172a',
                  fontWeight: 600,
                }}
              >
                {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label} ({lang.nativeLabel}) — {lang.code.toUpperCase()}
                  </option>
                ))}
              </select>

              {cacheClearNotice && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                  {cacheClearNotice}
                </div>
              )}
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
                <option value="international">International / Cambridge Standard (Universal Scope)</option>
                <option value="custom_imported">Custom / Overseas Imported Syllabi Only</option>
              </select>
            </div>

            {/* Overseas & Custom Curriculum Studio Card */}
            <div style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              borderRadius: '12px',
              background: '#f0fdf4',
              border: '1px solid #86efac',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🌍</span> Overseas & Custom Curriculum Importer
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#14532d', margin: 0, lineHeight: 1.45 }}>
                    Overseas schools, dioceses, and education ministries can import custom spreadsheets (CSV) or install ready-to-run national packs (e.g. Kenya, India, Ghana, Philippines) into the offline engine.
                  </p>
                  <div style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700, marginTop: '8px' }}>
                    📦 Active custom packs on this device: <strong>{customPacks.length}</strong>
                    {customPacks.length > 0 && ` (${customPacks.map((p) => p.countryOrRegion).join(', ')})`}
                  </div>
                </div>

                <Link
                  to="/curriculum-studio"
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                    boxShadow: '0 2px 4px rgba(22,163,74,0.2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  🚀 Open Curriculum Studio ➔
                </Link>
              </div>
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