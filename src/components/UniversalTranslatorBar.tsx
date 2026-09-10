// src/components/UniversalTranslatorBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  SUPPORTED_LANGUAGES,
  getSavedLanguage,
  setSavedLanguage,
  listenToLanguageChange,
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
  const [useGoogleFallback, setUseGoogleFallback] = useState<boolean>(false);
  const googleScriptLoadedRef = useRef(false);

  // Initialize from storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = getSavedLanguage();
    setCurrentLang(saved);
    if (saved && saved !== 'en') {
      setIsTranslated(true);
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
        translatePageDOM(newLang).then(() => {
          setIsTranslating(false);
          enableUniversalObserver(newLang);
        });
      } else {
        setIsTranslated(false);
        restorePageDOM();
      }
    });
    return unsub;
  }, []);

  // Listen to path changes / route transitions in SPA to re-translate new pages
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      const saved = getSavedLanguage();
      if (saved && saved !== 'en') {
        setTimeout(() => {
          translatePageDOM(saved);
        }, 150);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const handleLanguageSelect = async (langCode: string) => {
    setCurrentLang(langCode);
    setSavedLanguage(langCode);

    if (langCode === 'en') {
      setIsTranslated(false);
      restorePageDOM();
      return;
    }

    setIsTranslating(true);
    setIsTranslated(true);
    try {
      await translatePageDOM(langCode);
      enableUniversalObserver(langCode);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleToggleOriginal = () => {
    if (isTranslated) {
      restorePageDOM();
      setIsTranslated(false);
    } else {
      if (currentLang && currentLang !== 'en') {
        setIsTranslating(true);
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

  // Google Translate widget injection on demand
  const handleToggleGoogleEngine = () => {
    const nextVal = !useGoogleFallback;
    setUseGoogleFallback(nextVal);

    if (nextVal && typeof window !== 'undefined' && !googleScriptLoadedRef.current) {
      googleScriptLoadedRef.current = true;
      (window as any).googleTranslateElementInit = function () {
        if ((window as any).google?.translate?.TranslateElement) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  const langMeta = SUPPORTED_LANGUAGES[currentLang] || SUPPORTED_LANGUAGES.en;

  return (
    <aside
      id="universal-translator-bar"
      className="notranslate"
      aria-label="Universal Language Translator"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        background: '#0f172a',
        color: '#f8fafc',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
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

            {/* Optional 100+ Language Web Widget Toggle */}
            <button
              type="button"
              id="universal-google-engine-btn"
              onClick={handleToggleGoogleEngine}
              style={{
                background: useGoogleFallback ? '#047857' : '#1e293b',
                color: useGoogleFallback ? '#ffffff' : '#cbd5e1',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Toggle Google Web Translator for 100+ languages"
            >
              {useGoogleFallback ? '✓ Web Engine Active' : '+ 100+ Languages'}
            </button>

            {/* Container for Google Translate Element if activated */}
            {useGoogleFallback && (
              <div
                id="google_translate_element"
                style={{ display: 'inline-block', verticalAlign: 'middle' }}
              />
            )}
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
    </aside>
  );
}
