import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { hasUserGrantedAiConsent, setUserAiConsent, aiCaller } from '../engine/aicaller';
import { getSavedLanguage, listenToLanguageChange } from '../engine/operational-language';
import { getComplianceCaveat } from '../data/complianceCaveats';

export default function PersistentNavbar(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasNanoConsent, setHasNanoConsent] = useState(false);
  const [nanoAvailable, setNanoAvailable] = useState<'checking' | 'yes' | 'after-download' | 'no'>('checking');
  const [showNanoPopover, setShowNanoPopover] = useState(false);
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });
  const location = useLocation();

  useEffect(() => {
    const unsub = listenToLanguageChange((lang) => {
      setCurrentLang(lang);
    });
    return unsub;
  }, []);

  // Listen for Nano AI Consent & Hardware Capabilities
  useEffect(() => {
    setHasNanoConsent(hasUserGrantedAiConsent());
    
    aiCaller.checkAvailability().then((avail) => {
      if (avail.status === 'readily') setNanoAvailable('yes');
      else if (avail.status === 'after-download') setNanoAvailable('after-download');
      else setNanoAvailable('no');
    }).catch(() => setNanoAvailable('no'));

    const handleConsentChange = (e: any) => {
      setHasNanoConsent(Boolean(e.detail));
    };
    window.addEventListener('ai_consent_changed', handleConsentChange);
    window.addEventListener('storage', () => setHasNanoConsent(hasUserGrantedAiConsent()));

    return () => {
      window.removeEventListener('ai_consent_changed', handleConsentChange);
    };
  }, []);

  // Listen for PWA install prompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Color mode initialization
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setColorMode(saved === 'dark' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleColorMode = () => {
    const next = colorMode === 'dark' ? 'light' : 'dark';
    setColorMode(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const navLinks = [
    { to: '/practice-lab', label: '⚡ Practice' },
    { to: '/learning-zone', label: '📖 Lessons' },
    { to: '/learning-zone?tab=inflation', label: '🌱 Seed Engine' },
    { to: '/profile', label: '⭐ Progress' },
    { to: '/curriculum-studio', label: '🌍 Studio' },
    { to: '/teacher-beacon', label: '📡 Beacon' },
    { to: '/licensing', label: '🕊️ Mission' },
    { to: '/blog', label: '📰 News' },
  ];

  return (
    <nav
      id="persistent-site-navbar"
      role="navigation"
      style={{
        backgroundColor: colorMode === 'dark' ? '#0f172a' : '#ffffff',
        borderBottom: `1px solid ${colorMode === 'dark' ? '#1e293b' : '#e2e8f0'}`,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        transition: 'background-color 0.2s ease',
        width: '100%',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '0 1rem',
          height: '54px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              textDecoration: 'none',
              color: colorMode === 'dark' ? '#f8fafc' : '#0f172a',
            }}
          >
            <img
              src={`${import.meta.env.BASE_URL}img/logo.svg`}
              alt="St Joseph's Logo"
              style={{ width: '28px', height: '28px', display: 'block' }}
              onError={(e) => {
                // Fallback icon if svg is loading
                (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}img/favicon-32x32.png`;
              }}
            />
            <span
              style={{
                fontWeight: 700,
                fontSize: '1.05rem',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              St Joseph's Portal
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
          className="desktop-nav-items"
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                padding: '0.4rem 0.65rem',
                fontSize: '0.88rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive
                  ? '#2563eb'
                  : colorMode === 'dark'
                  ? '#94a3b8'
                  : '#475569',
                backgroundColor: isActive
                  ? colorMode === 'dark'
                    ? 'rgba(37, 99, 235, 0.15)'
                    : '#eff6ff'
                  : 'transparent',
                borderRadius: '6px',
                transition: 'all 0.15s ease',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions (Settings & Theme Toggle & Mobile Hamburger) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Nano Live Engine Status Pill */}
          <div style={{ position: 'relative' }}>
            {(() => {
              const caveat = getComplianceCaveat(currentLang);
              return (
                <>
                  <button
                    type="button"
                    id="navbar-nano-status-pill"
                    onClick={() => setShowNanoPopover(!showNanoPopover)}
                    title="On-Device Gemini Nano AI Status"
                    style={{
                      background: hasNanoConsent ? '#ecfdf5' : '#f8fafc',
                      color: hasNanoConsent ? '#065f46' : '#475569',
                      border: `1px solid ${hasNanoConsent ? '#a7f3d0' : '#cbd5e1'}`,
                      borderRadius: '6px',
                      padding: '0.35rem 0.65rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{hasNanoConsent ? '🧠' : '🌱'}</span>
                    <span>{hasNanoConsent ? caveat.statusOn : caveat.statusEco}</span>
                  </button>

                  {/* In-Context Nano Control Popover */}
                  {showNanoPopover && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '125%',
                        width: '290px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1rem',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
                        zIndex: 9999,
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🧠</span> Gemini Nano (Local AI)
                        </strong>
                        <button
                          type="button"
                          onClick={() => setShowNanoPopover(false)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '0.9rem' }}
                        >
                          ✕
                        </button>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                        {hasNanoConsent ? caveat.activeSummary : caveat.ecoSummary}
                      </p>

                      <div style={{ marginBottom: '8px', fontSize: '0.72rem', color: '#b45309', background: '#fffbeb', padding: '6px 8px', borderRadius: '6px', border: '1px solid #fde68a', lineHeight: 1.35 }}>
                        <div><strong>CA / India Safe:</strong></div>
                        <div>{caveat.californiaNotice}</div>
                        <div style={{ marginTop: '2px' }}>{caveat.indiaNotice}</div>
                      </div>

                      <div style={{ marginBottom: '10px', fontSize: '0.75rem', color: '#64748b', background: '#f8fafc', padding: '6px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <strong>Device: </strong>
                        {nanoAvailable === 'yes' ? (
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>{caveat.deviceReadyText}</span>
                        ) : nanoAvailable === 'after-download' ? (
                          <span style={{ color: '#2563eb', fontWeight: 700 }}>{caveat.deviceDownloadText}</span>
                        ) : (
                          <span style={{ color: '#64748b' }}>{caveat.deviceUnsupportedText}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setUserAiConsent(!hasNanoConsent);
                          setShowNanoPopover(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '8px',
                          background: hasNanoConsent ? '#fee2e2' : '#2563eb',
                          color: hasNanoConsent ? '#991b1b' : '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        {hasNanoConsent ? caveat.ecoBtn : caveat.activateBtn}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <NavLink
            to="/settings"
            style={({ isActive }) => ({
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              padding: '0.4rem 0.65rem',
              fontSize: '0.88rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive
                ? '#2563eb'
                : colorMode === 'dark'
                ? '#94a3b8'
                : '#475569',
              backgroundColor: isActive
                ? colorMode === 'dark'
                  ? 'rgba(37, 99, 235, 0.15)'
                  : '#eff6ff'
                : 'transparent',
              borderRadius: '6px',
            })}
          >
            ⚙️ Settings
          </NavLink>

          {/* PWA Install Button (Displays when install prompt is available) */}
          {installPrompt && !isInstalled && (
            <button
              type="button"
              onClick={handleInstallClick}
              title="Install St Joseph's App on this device"
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.35rem 0.65rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 4px rgba(37,99,235,0.25)',
              }}
            >
              <span>📲</span>
              <span>Install</span>
            </button>
          )}

          <button
            type="button"
            onClick={toggleColorMode}
            title={colorMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Color Mode"
            style={{
              background: 'transparent',
              border: `1px solid ${colorMode === 'dark' ? '#334155' : '#cbd5e1'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              padding: '0.35rem 0.55rem',
              fontSize: '0.9rem',
              color: colorMode === 'dark' ? '#f8fafc' : '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {colorMode === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Mobile menu hamburger button */}
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            style={{
              background: 'transparent',
              border: `1px solid ${colorMode === 'dark' ? '#334155' : '#cbd5e1'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              padding: '0.35rem 0.55rem',
              fontSize: '1rem',
              color: colorMode === 'dark' ? '#f8fafc' : '#0f172a',
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: colorMode === 'dark' ? '#0f172a' : '#ffffff',
            borderTop: `1px solid ${colorMode === 'dark' ? '#1e293b' : '#e2e8f0'}`,
            padding: '0.75rem 1rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '0.6rem 0.8rem',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive
                  ? '#2563eb'
                  : colorMode === 'dark'
                  ? '#f8fafc'
                  : '#1e293b',
                backgroundColor: isActive
                  ? colorMode === 'dark'
                    ? 'rgba(37, 99, 235, 0.15)'
                    : '#eff6ff'
                  : 'transparent',
                borderRadius: '6px',
              })}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            style={({ isActive }) => ({
              textDecoration: 'none',
              padding: '0.6rem 0.8rem',
              fontSize: '0.95rem',
              fontWeight: isActive ? 600 : 500,
              color: isActive
                ? '#2563eb'
                : colorMode === 'dark'
                ? '#f8fafc'
                : '#1e293b',
              backgroundColor: isActive
                ? colorMode === 'dark'
                  ? 'rgba(37, 99, 235, 0.15)'
                  : '#eff6ff'
                : 'transparent',
              borderRadius: '6px',
            })}
          >
            ⚙️ Settings
          </NavLink>
        </div>
      )}
    </nav>
  );
}
