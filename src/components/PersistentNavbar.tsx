import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { hasUserGrantedAiConsent, setUserAiConsent, aiCaller } from '../engine/aicaller';
import { getSavedLanguage, listenToLanguageChange } from '../engine/operational-language';
import { getComplianceCaveat } from '../data/complianceCaveats';
import { isDataSaverActive, setDataSaverMode, listenToDataSaverChanges } from '../services/dataSaverStore';
import { isOfflineSyncComplete } from '../services/offlineSync';
import { OfflineStorageManager } from './OfflineStorageManager';

export default function PersistentNavbar(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasNanoConsent, setHasNanoConsent] = useState(false);
  const [nanoAvailable, setNanoAvailable] = useState<'checking' | 'yes' | 'after-download' | 'no'>('checking');
  const [showNanoPopover, setShowNanoPopover] = useState(false);
  const [dataSaverActive, setDataSaverActive] = useState<boolean>(() => isDataSaverActive());
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [isOfflineSynced, setIsOfflineSynced] = useState<boolean>(() => isOfflineSyncComplete());
  const [currentLang, setCurrentLang] = useState<string>(() => {
    return typeof window !== 'undefined' ? getSavedLanguage() : 'en';
  });
  const [openDropdown, setOpenDropdown] = useState<'learning' | 'admin' | null>(null);
  const location = useLocation();
  const navbarRef = useRef<HTMLElement>(null);
  const nanoContainerRef = useRef<HTMLDivElement>(null);
  const learningDropdownRef = useRef<HTMLDivElement>(null);
  const adminDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDropdownEnter = (menu: 'learning' | 'admin') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(menu);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 220);
  };

  const toggleDropdown = (menu: 'learning' | 'admin') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  // Close menus on Escape key or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileMenuOpen(false);
        setShowNanoPopover(false);
      }
    };
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        nanoContainerRef.current &&
        !nanoContainerRef.current.contains(target)
      ) {
        setShowNanoPopover(false);
      }
      if (
        learningDropdownRef.current &&
        !learningDropdownRef.current.contains(target) &&
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
      if (
        navbarRef.current &&
        !navbarRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleSyncUpdate = () => {
      setIsOfflineSynced(isOfflineSyncComplete());
    };
    window.addEventListener('stj_offline_sync_updated', handleSyncUpdate);
    window.addEventListener('storage', handleSyncUpdate);
    return () => {
      window.removeEventListener('stj_offline_sync_updated', handleSyncUpdate);
      window.removeEventListener('storage', handleSyncUpdate);
    };
  }, []);

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

  // Listen for Data Saver changes
  useEffect(() => {
    const unsub = listenToDataSaverChanges((enabled) => {
      setDataSaverActive(enabled);
    });
    return unsub;
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

  interface NavDropdownItem {
    to: string;
    icon: string;
    title: string;
    desc: string;
  }

  const learningNavItems: NavDropdownItem[] = [
    {
      to: '/learning-zone',
      icon: '📖',
      title: 'Lessons & Curriculum',
      desc: 'National Curriculum & Catholic RE interactive units',
    },
    {
      to: '/practice-lab',
      icon: '⚡',
      title: 'Practice Lab',
      desc: 'Self-paced question drills, adaptive cards & mastery',
    },
    {
      to: '/learning-zone?tab=inflation',
      icon: '🌱',
      title: 'Generative Seed Engine',
      desc: 'AST learning trajectories & generative syllabus builder',
    },
    {
      to: '/profile',
      icon: '⭐',
      title: 'Student Progress',
      desc: 'Mastery badges, learning streaks & offline jotter',
    },
  ];

  const adminNavItems: NavDropdownItem[] = [
    {
      to: '/teacher-beacon',
      icon: '📡',
      title: 'Teacher Beacon',
      desc: 'Live classroom synchronization & student broadcasts',
    },
    {
      to: '/curriculum-studio',
      icon: '🛠️',
      title: 'Curriculum Studio',
      desc: 'AST graph visualizer & curriculum node architect',
    },
    {
      to: '/settings',
      icon: '⚙️',
      title: 'System Settings',
      desc: 'Storage, device quotas, AI models & telemetry',
    },
    {
      to: '/licensing',
      icon: '⚖️',
      title: 'MAT SLA & Licensing',
      desc: 'Multi-Academy Trust enterprise terms & compliance',
    },
    {
      to: '/privacy',
      icon: '🛡️',
      title: 'Edge Privacy Guard',
      desc: 'Zero-cloud student data protection & audit logs',
    },
  ];

  const isLearningActive =
    location.pathname === '/learning-zone' ||
    location.pathname === '/practice-lab' ||
    location.pathname === '/profile';

  const isAdminActive =
    location.pathname === '/teacher-beacon' ||
    location.pathname === '/curriculum-studio' ||
    location.pathname === '/settings' ||
    location.pathname === '/licensing' ||
    location.pathname === '/privacy';

  return (
    <nav
      id="persistent-site-navbar"
      ref={navbarRef}
      role="navigation"
      aria-label="Main Navigation"
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

        {/* Desktop Navigation Links & Dropdowns */}
        <div
          className="desktop-nav-items"
          role="menubar"
          aria-label="Desktop menu"
        >
          {/* 1. Home */}
          <NavLink
            to="/"
            end
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
            🏠 Home
          </NavLink>

          {/* 2. Learning Dropdown */}
          <div
            ref={learningDropdownRef}
            className="nav-dropdown-wrapper"
            onMouseEnter={() => handleDropdownEnter('learning')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              id="navbar-learning-dropdown-btn"
              onClick={() => toggleDropdown('learning')}
              aria-expanded={openDropdown === 'learning'}
              aria-haspopup="true"
              style={{
                background: isLearningActive
                  ? colorMode === 'dark' ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff'
                  : openDropdown === 'learning'
                  ? colorMode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9'
                  : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.65rem',
                fontSize: '0.88rem',
                fontWeight: isLearningActive ? 600 : 500,
                color: isLearningActive
                  ? '#2563eb'
                  : colorMode === 'dark'
                  ? '#94a3b8'
                  : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span>📖 Learning</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  opacity: 0.7,
                  display: 'inline-block',
                  transform: openDropdown === 'learning' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              >
                ▼
              </span>
            </button>

            {openDropdown === 'learning' && (
              <div
                className="nav-dropdown-menu"
                role="menu"
                aria-label="Learning menu"
                style={{
                  backgroundColor: colorMode === 'dark' ? '#1e293b' : '#ffffff',
                  border: `1px solid ${colorMode === 'dark' ? '#334155' : '#e2e8f0'}`,
                  boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.2), 0 4px 10px -2px rgba(0, 0, 0, 0.08)',
                  width: '295px',
                }}
              >
                {learningNavItems.map((item) => {
                  const isItemActive = item.to.includes('?')
                    ? location.pathname === item.to.split('?')[0] && location.search.includes(item.to.split('?')[1])
                    : location.pathname === item.to && (!location.search || !location.search.includes('tab='));
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      className="nav-dropdown-item"
                      onClick={() => setOpenDropdown(null)}
                      style={{
                        backgroundColor: isItemActive
                          ? colorMode === 'dark' ? 'rgba(37, 99, 235, 0.2)' : '#eff6ff'
                          : 'transparent',
                      }}
                    >
                      <span style={{ fontSize: '1.15rem', lineHeight: 1, marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            color: isItemActive
                              ? '#2563eb'
                              : colorMode === 'dark'
                              ? '#f8fafc'
                              : '#0f172a',
                          }}
                        >
                          {item.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.73rem',
                            color: colorMode === 'dark' ? '#94a3b8' : '#64748b',
                            marginTop: '2px',
                            lineHeight: 1.3,
                          }}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Educator & Admin Dropdown */}
          <div
            ref={adminDropdownRef}
            className="nav-dropdown-wrapper"
            onMouseEnter={() => handleDropdownEnter('admin')}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              type="button"
              id="navbar-admin-dropdown-btn"
              onClick={() => toggleDropdown('admin')}
              aria-expanded={openDropdown === 'admin'}
              aria-haspopup="true"
              style={{
                background: isAdminActive
                  ? colorMode === 'dark' ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff'
                  : openDropdown === 'admin'
                  ? colorMode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : '#f1f5f9'
                  : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.65rem',
                fontSize: '0.88rem',
                fontWeight: isAdminActive ? 600 : 500,
                color: isAdminActive
                  ? '#2563eb'
                  : colorMode === 'dark'
                  ? '#94a3b8'
                  : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <span>🏫 Educator & Admin</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  opacity: 0.7,
                  display: 'inline-block',
                  transform: openDropdown === 'admin' ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              >
                ▼
              </span>
            </button>

            {openDropdown === 'admin' && (
              <div
                className="nav-dropdown-menu"
                role="menu"
                aria-label="Educator and Admin menu"
                style={{
                  backgroundColor: colorMode === 'dark' ? '#1e293b' : '#ffffff',
                  border: `1px solid ${colorMode === 'dark' ? '#334155' : '#e2e8f0'}`,
                  boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.2), 0 4px 10px -2px rgba(0, 0, 0, 0.08)',
                  width: '310px',
                }}
              >
                {adminNavItems.map((item) => {
                  const isItemActive = location.pathname === item.to;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      role="menuitem"
                      className="nav-dropdown-item"
                      onClick={() => setOpenDropdown(null)}
                      style={{
                        backgroundColor: isItemActive
                          ? colorMode === 'dark' ? 'rgba(37, 99, 235, 0.2)' : '#eff6ff'
                          : 'transparent',
                      }}
                    >
                      <span style={{ fontSize: '1.15rem', lineHeight: 1, marginTop: '2px', flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span
                          style={{
                            fontSize: '0.86rem',
                            fontWeight: 600,
                            color: isItemActive
                              ? '#2563eb'
                              : colorMode === 'dark'
                              ? '#f8fafc'
                              : '#0f172a',
                          }}
                        >
                          {item.title}
                        </span>
                        <span
                          style={{
                            fontSize: '0.73rem',
                            color: colorMode === 'dark' ? '#94a3b8' : '#64748b',
                            marginTop: '2px',
                            lineHeight: 1.3,
                          }}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. News */}
          <NavLink
            to="/blog"
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
            📰 News
          </NavLink>
        </div>

        {/* Right Actions (Settings & Theme Toggle & Mobile Hamburger) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {/* Nano Live Engine Status Pill */}
          <div ref={nanoContainerRef} style={{ position: 'relative' }}>
            {(() => {
              const caveat = getComplianceCaveat(currentLang);
              return (
                <>
                  <button
                    type="button"
                    id="navbar-nano-status-pill"
                    onClick={() => setShowNanoPopover(!showNanoPopover)}
                    aria-expanded={showNanoPopover}
                    aria-haspopup="dialog"
                    aria-controls="navbar-nano-popover"
                    title="On-Device Gemini Nano AI Status"
                    style={{
                      background: hasNanoConsent
                        ? colorMode === 'dark' ? '#064e3b' : '#ecfdf5'
                        : colorMode === 'dark' ? '#1e293b' : '#f8fafc',
                      color: hasNanoConsent
                        ? colorMode === 'dark' ? '#6ee7b7' : '#065f46'
                        : colorMode === 'dark' ? '#94a3b8' : '#475569',
                      border: `1px solid ${
                        hasNanoConsent
                          ? colorMode === 'dark' ? '#10b981' : '#a7f3d0'
                          : colorMode === 'dark' ? '#334155' : '#cbd5e1'
                      }`,
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
                      id="navbar-nano-popover"
                      role="dialog"
                      aria-label="Gemini Nano Local AI Settings"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '125%',
                        width: '290px',
                        background: colorMode === 'dark' ? '#1e293b' : '#ffffff',
                        border: `1px solid ${colorMode === 'dark' ? '#334155' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        padding: '1rem',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2), 0 8px 10px -6px rgba(0,0,0,0.1)',
                        zIndex: 9999,
                        textAlign: 'left',
                        color: colorMode === 'dark' ? '#f8fafc' : '#0f172a',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '0.9rem', color: colorMode === 'dark' ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🧠</span> Gemini Nano (Local AI)
                        </strong>
                        <button
                          type="button"
                          onClick={() => setShowNanoPopover(false)}
                          aria-label="Close popover"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.9rem' }}
                        >
                          ✕
                        </button>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: colorMode === 'dark' ? '#cbd5e1' : '#475569', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                        {hasNanoConsent ? caveat.activeSummary : caveat.ecoSummary}
                      </p>

                      <div style={{
                        marginBottom: '8px',
                        fontSize: '0.72rem',
                        color: colorMode === 'dark' ? '#fde68a' : '#b45309',
                        background: colorMode === 'dark' ? 'rgba(180, 83, 9, 0.2)' : '#fffbeb',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${colorMode === 'dark' ? '#78350f' : '#fde68a'}`,
                        lineHeight: 1.35
                      }}>
                        <div><strong>CA / India Safe:</strong></div>
                        <div>{caveat.californiaNotice}</div>
                        <div style={{ marginTop: '2px' }}>{caveat.indiaNotice}</div>
                      </div>

                      <div style={{
                        marginBottom: '10px',
                        fontSize: '0.75rem',
                        color: colorMode === 'dark' ? '#cbd5e1' : '#64748b',
                        background: colorMode === 'dark' ? '#0f172a' : '#f8fafc',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${colorMode === 'dark' ? '#334155' : '#e2e8f0'}`
                      }}>
                        <strong>Device: </strong>
                        {nanoAvailable === 'yes' ? (
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>{caveat.deviceReadyText}</span>
                        ) : nanoAvailable === 'after-download' ? (
                          <span style={{ color: '#38bdf8', fontWeight: 700 }}>{caveat.deviceDownloadText}</span>
                        ) : (
                          <span style={{ color: colorMode === 'dark' ? '#94a3b8' : '#64748b' }}>{caveat.deviceUnsupportedText}</span>
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

          {/* Data Saver Mode (Zero Data / Developing Nations) */}
          <button
            type="button"
            id="navbar-data-saver-btn"
            className="navbar-action-desktop-only"
            onClick={() => setDataSaverMode(!dataSaverActive)}
            title={dataSaverActive ? 'Data Saver: ON (Low bandwidth mode). Click to toggle.' : 'Data Saver: OFF. Click to enable ultra-low bandwidth mode.'}
            style={{
              background: dataSaverActive ? (colorMode === 'dark' ? '#064e3b' : '#ecfdf5') : 'transparent',
              color: dataSaverActive ? (colorMode === 'dark' ? '#6ee7b7' : '#065f46') : (colorMode === 'dark' ? '#94a3b8' : '#475569'),
              border: `1px solid ${dataSaverActive ? '#10b981' : (colorMode === 'dark' ? '#334155' : '#cbd5e1')}`,
              borderRadius: '6px',
              padding: '0.35rem 0.6rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{dataSaverActive ? '📶 Data Saver: ON' : '📶 Data Saver'}</span>
          </button>

          {/* Device Offline Storage Button (Zero Data / Air-gapped) */}
          <button
            type="button"
            id="navbar-offline-store-btn"
            className="navbar-action-desktop-only"
            onClick={() => setShowOfflineModal(true)}
            title="Store entire curriculum on your device for 100% offline / zero-data learning"
            style={{
              background: isOfflineSynced ? (colorMode === 'dark' ? '#064e3b' : '#ecfdf5') : 'transparent',
              color: isOfflineSynced ? (colorMode === 'dark' ? '#34d399' : '#059669') : (colorMode === 'dark' ? '#94a3b8' : '#475569'),
              border: `1px solid ${isOfflineSynced ? '#10b981' : (colorMode === 'dark' ? '#334155' : '#cbd5e1')}`,
              borderRadius: '6px',
              padding: '0.35rem 0.6rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{isOfflineSynced ? '💾 On Device (0 Data)' : '💾 Save to Device'}</span>
          </button>

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
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
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
          id="mobile-nav-drawer"
          role="region"
          aria-label="Mobile Navigation Drawer"
          style={{
            backgroundColor: colorMode === 'dark' ? '#0f172a' : '#ffffff',
            borderTop: `1px solid ${colorMode === 'dark' ? '#1e293b' : '#e2e8f0'}`,
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            maxHeight: 'calc(100vh - 60px)',
            overflowY: 'auto',
          }}
        >
          {/* Group 1: Learning & Practice */}
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colorMode === 'dark' ? '#94a3b8' : '#64748b',
                marginBottom: '0.35rem',
                paddingLeft: '0.5rem',
              }}
            >
              📖 Learning & Practice
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <NavLink
                to="/"
                end
                onClick={() => setMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  padding: '0.55rem 0.75rem',
                  fontSize: '0.92rem',
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                })}
              >
                <span>🏠</span> Home
              </NavLink>
              {learningNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.92rem',
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  })}
                >
                  <span>{item.icon}</span> {item.title}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Group 2: Educator & Administration */}
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colorMode === 'dark' ? '#94a3b8' : '#64748b',
                marginBottom: '0.35rem',
                paddingLeft: '0.5rem',
              }}
            >
              🏫 Educator & Administration
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    padding: '0.55rem 0.75rem',
                    fontSize: '0.92rem',
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  })}
                >
                  <span>{item.icon}</span> {item.title}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Group 3: Updates */}
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colorMode === 'dark' ? '#94a3b8' : '#64748b',
                marginBottom: '0.35rem',
                paddingLeft: '0.5rem',
              }}
            >
              📰 Updates
            </div>
            <NavLink
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '0.55rem 0.75rem',
                fontSize: '0.92rem',
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
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              })}
            >
              <span>📰</span> News & Curriculum Blog
            </NavLink>
          </div>

          {/* Group 4: Device Tools */}
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: colorMode === 'dark' ? '#94a3b8' : '#64748b',
                marginBottom: '0.35rem',
                paddingLeft: '0.5rem',
              }}
            >
              ⚡ Offline & Device Tools
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => {
                  setDataSaverMode(!dataSaverActive);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: `1px solid ${dataSaverActive ? '#10b981' : '#cbd5e1'}`,
                  background: dataSaverActive ? (colorMode === 'dark' ? '#064e3b' : '#ecfdf5') : 'transparent',
                  color: dataSaverActive ? (colorMode === 'dark' ? '#6ee7b7' : '#065f46') : (colorMode === 'dark' ? '#f8fafc' : '#1e293b'),
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>📶 Data Saver (Low Bandwidth)</span>
                <span>{dataSaverActive ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOfflineModal(true);
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '0.6rem 0.8rem',
                  borderRadius: '6px',
                  border: `1px solid ${isOfflineSynced ? '#10b981' : '#cbd5e1'}`,
                  background: isOfflineSynced ? (colorMode === 'dark' ? '#064e3b' : '#ecfdf5') : 'transparent',
                  color: isOfflineSynced ? (colorMode === 'dark' ? '#34d399' : '#059669') : (colorMode === 'dark' ? '#f8fafc' : '#1e293b'),
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>💾 Store on Device (0 Data)</span>
                <span>{isOfflineSynced ? 'SAVED' : 'DOWNLOAD'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zero-Data Offline Storage Manager Modal */}
      <OfflineStorageManager
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        colorMode={colorMode}
      />
    </nav>
  );
}
