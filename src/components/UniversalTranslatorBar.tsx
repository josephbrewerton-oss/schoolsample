// src/components/UniversalTranslatorBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  SUPPORTED_LANGUAGES,
  getSavedLanguage,
  setSavedLanguage,
  listenToLanguageChange,
  getLanguagePracticeMode,
  setLanguagePracticeMode,
  listenToLanguagePracticeMode,
  getSpeechSpeed,
  setSpeechSpeed,
  listenToSpeechSpeed,
} from '../engine/operational-language';
import {
  translatePageDOM,
  restorePageDOM,
  enableUniversalObserver,
  speakCurrentPage,
} from '../engine/universalDomTranslator';

export default function UniversalTranslatorBar() {
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [practiceMode, setPracticeMode] = useState<boolean>(() => getLanguagePracticeMode());
  const [speechSpeed, setLocalSpeechSpeed] = useState<number>(() => getSpeechSpeed());
  const googleScriptLoadedRef = useRef(false);

  // Ensure CSS variable --universal-bar-height is set once or on actual height changes without triggering forced synchronous reflow
  const lastHeightRef = useRef<number>(-1);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bar = document.getElementById('universal-translator-bar');
    if (!bar) return;

    let rAFId: number;

    const applyHeight = (height: number) => {
      const rounded = Math.round(height);
      if (rounded <= 0 || rounded === lastHeightRef.current) return;
      lastHeightRef.current = rounded;
      rAFId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--universal-bar-height', `${rounded}px`);
      });
    };

    // Use ResizeObserver's native entry box dimensions — zero forced layout calculations
    const ro = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      let height = 0;
      if (entry.borderBoxSize && entry.borderBoxSize.length > 0) {
        height = entry.borderBoxSize[0].blockSize;
      } else if (entry.contentBoxSize && entry.contentBoxSize.length > 0) {
        height = entry.contentBoxSize[0].blockSize;
      } else {
        height = entry.contentRect.height;
      }
      if (height > 0) {
        applyHeight(height);
      }
    });

    ro.observe(bar);
    return () => {
      cancelAnimationFrame(rAFId);
      ro.disconnect();
    };
  }, [isCollapsed]);

  // Google Translate engine auto-loader
  const ensureGoogleTranslateLoaded = () => {
    if (typeof window === 'undefined') return;
    const win = window as any;
    if (!win.googleTranslateElementInit) {
      win.googleTranslateElementInit = () => {
        try {
          if (win.google?.translate?.TranslateElement) {
            new win.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                layout: win.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );
          }
        } catch (e) {
          console.warn('[GoogleTranslate Init]:', e);
        }
      };
    }

    if (!googleScriptLoadedRef.current && !document.getElementById('google-translate-script')) {
      googleScriptLoadedRef.current = true;
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  const applyGoogleTranslate = (langCode: string) => {
    if (typeof window === 'undefined') return;
    const host = window.location.hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';

    if (langCode === 'en' || !langCode) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      if (!isLocal) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${host};`;
      }
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      if (!isLocal) {
        document.cookie = `googtrans=/en/${langCode}; path=/; domain=${host};`;
      }
    }

    // Trigger Google combo if element already mounted
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      combo.value = langCode === 'en' ? '' : langCode;
      combo.dispatchEvent(new Event('change'));
    }
  };

  // Initialize from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = getSavedLanguage();
    setCurrentLang(saved);
    if (saved && saved !== 'en') {
      setIsTranslated(true);
      ensureGoogleTranslateLoaded();
      applyGoogleTranslate(saved);
      translatePageDOM(saved);
      enableUniversalObserver(saved);
    }
  }, []);

  // Sync with global language changes (from Practice Lab, Learning Zone, etc.)
  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
      if (newLang && newLang !== 'en') {
        setIsTranslating(true);
        setIsTranslated(true);
        ensureGoogleTranslateLoaded();
        applyGoogleTranslate(newLang);
        translatePageDOM(newLang).then(() => {
          setIsTranslating(false);
          enableUniversalObserver(newLang);
        });
      } else {
        setIsTranslated(false);
        applyGoogleTranslate('en');
        restorePageDOM();
      }
    });
    return unsub;
  }, []);

  // Listen to Language Practice Mode & Speech Speed changes
  useEffect(() => {
    const unsubPractice = listenToLanguagePracticeMode((enabled) => {
      setPracticeMode(enabled);
    });
    const unsubSpeed = listenToSpeechSpeed((speed) => {
      setLocalSpeechSpeed(speed);
    });
    return () => {
      unsubPractice();
      unsubSpeed();
    };
  }, []);

  const location = useLocation();

  // Listen to route transitions across the entire SPA to automatically re-translate new pages
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = getSavedLanguage();
    if (saved && saved !== 'en') {
      setIsTranslated(true);
      ensureGoogleTranslateLoaded();
      applyGoogleTranslate(saved);
      const timer = setTimeout(() => {
        translatePageDOM(saved);
        enableUniversalObserver(saved);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, location.search]);

  const handleLanguageSelect = async (langCode: string) => {
    setCurrentLang(langCode);
    setSavedLanguage(langCode);

    if (langCode === 'en') {
      setIsTranslated(false);
      applyGoogleTranslate('en');
      restorePageDOM();
      return;
    }

    setIsTranslating(true);
    setIsTranslated(true);
    ensureGoogleTranslateLoaded();
    applyGoogleTranslate(langCode);
    try {
      await translatePageDOM(langCode);
      enableUniversalObserver(langCode);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleToggleOriginal = () => {
    if (isTranslated) {
      applyGoogleTranslate('en');
      restorePageDOM();
      setIsTranslated(false);
    } else {
      if (currentLang && currentLang !== 'en') {
        setIsTranslating(true);
        ensureGoogleTranslateLoaded();
        applyGoogleTranslate(currentLang);
        translatePageDOM(currentLang).then(() => {
          setIsTranslating(false);
          setIsTranslated(true);
          enableUniversalObserver(currentLang);
        });
      }
    }
  };

  const handleSpeak = () => {
    speakCurrentPage(currentLang);
  };

  const langMeta = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;

  return (
    <div
      id="universal-translator-bar"
      className="notranslate"
      role="region"
      aria-label="Universal Language Translator"
      style={{
        width: '100%',
        background: '#0f172a',
        color: '#f8fafc',
        borderBottom: '1px solid #1e293b',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '0.85rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isCollapsed ? '0.35rem 1rem' : '0.5rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Left: Branding & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.15rem' }} role="img" aria-label="Globe">
            🌐
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <strong style={{ color: '#38bdf8', letterSpacing: '0.02em' }}>
              Universal Translator
            </strong>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '4px',
                background: isTranslated ? '#15803d' : '#334155',
                color: '#ffffff',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {isTranslating
                ? 'Translating...'
                : isTranslated
                ? `${langMeta.nativeLabel}`
                : 'English Original'}
            </span>
          </div>
        </div>

        {/* Center & Right Controls */}
        {!isCollapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            {/* Language Picker Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <label
                htmlFor="universal-lang-select"
                style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}
              >
                Translate to:
              </label>
              <select
                id="universal-lang-select"
                value={currentLang}
                onChange={(e) => handleLanguageSelect(e.target.value)}
                style={{
                  background: '#1e293b',
                  color: '#ffffff',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label} ({lang.nativeLabel})
                  </option>
                ))}
              </select>
            </div>

            {/* Revert / View Original Toggle */}
            {currentLang !== 'en' && (
              <button
                type="button"
                id="universal-toggle-original-btn"
                onClick={handleToggleOriginal}
                style={{
                  background: isTranslated ? '#334155' : '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                title="Toggle between translated page and original English text"
              >
                {isTranslated ? '🇬🇧 Show Original' : `🌐 Translate to ${langMeta.label}`}
              </button>
            )}

            {/* Language Practice Mode (Dual Parallel Text + Ear-Training) */}
            <button
              type="button"
              id="universal-practice-mode-btn"
              onClick={() => {
                const next = !practiceMode;
                setPracticeMode(next);
                setLanguagePracticeMode(next);
              }}
              style={{
                background: practiceMode ? '#065f46' : '#1e293b',
                color: practiceMode ? '#a7f3d0' : '#cbd5e1',
                border: `1px solid ${practiceMode ? '#10b981' : '#475569'}`,
                borderRadius: '6px',
                padding: '0.25rem 0.65rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
              title="Toggle Language Practice Mode: Enables parallel bilingual text and ear-training repetition across questions"
            >
              <span>🗣️</span>
              <span>{practiceMode ? 'Language Practice: ON' : 'Language Practice'}</span>
            </button>

            {/* Speech Speed Setting (Normal vs Slow/Clear) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '1px 3px',
                gap: '2px',
              }}
              title="Text-to-speech audio playback speed"
            >
              <button
                type="button"
                onClick={() => {
                  setLocalSpeechSpeed(0.7);
                  setSpeechSpeed(0.7);
                }}
                style={{
                  background: speechSpeed < 0.85 ? '#0284c7' : 'transparent',
                  color: speechSpeed < 0.85 ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Slower, phonetic speech for language acquisition"
              >
                🐢 0.7x
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocalSpeechSpeed(0.95);
                  setSpeechSpeed(0.95);
                }}
                style={{
                  background: speechSpeed >= 0.85 ? '#0284c7' : 'transparent',
                  color: speechSpeed >= 0.85 ? '#ffffff' : '#94a3b8',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                title="Standard speech speed"
              >
                1.0x
              </button>
            </div>

            {/* Read Page Aloud */}
            <button
              type="button"
              id="universal-read-aloud-btn"
              onClick={handleSpeak}
              style={{
                background: '#1e293b',
                color: '#e2e8f0',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Listen to the current page in the active language"
            >
              <span>🔊</span> Read Page
            </button>

            {/* Permanent hidden container for automated Google Web Translation Engine */}
            <div
              id="google_translate_element"
              style={{ display: 'none' }}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Rightmost: Collapse / Minimize Toggle */}
        <button
          type="button"
          id="universal-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.78rem',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '4px',
            textDecoration: 'underline',
          }}
          title={isCollapsed ? 'Expand Universal Translator Bar' : 'Minimize Bar'}
        >
          {isCollapsed ? '🌐 Expand Translator' : 'Hide Bar'}
        </button>
      </div>
    </div>
  );
}
