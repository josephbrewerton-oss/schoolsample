// src/components/MobileBottomNav.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { triggerHapticSuccess } from '../services/soundHaptics';

export default function MobileBottomNav(): React.JSX.Element {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');

  // Sync color theme
  useEffect(() => {
    const updateTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setColorMode(isDark ? 'dark' : 'light');
    };
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Listen to drawer state changes from PersistentNavbar
  useEffect(() => {
    const handleDrawerState = (e: any) => {
      if (typeof e.detail?.open === 'boolean') {
        setDrawerOpen(e.detail.open);
      }
    };
    window.addEventListener('stj_mobile_drawer_state', handleDrawerState);
    return () => window.removeEventListener('stj_mobile_drawer_state', handleDrawerState);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  const toggleExploreDrawer = () => {
    triggerHapticSuccess();
    const next = !drawerOpen;
    setDrawerOpen(next);
    window.dispatchEvent(new CustomEvent('stj_toggle_mobile_drawer', { detail: { open: next } }));
  };

  const isHomeActive = location.pathname === '/';
  const isLessonsActive = location.pathname.startsWith('/learning-zone');
  const isPracticeActive = location.pathname.startsWith('/practice-lab');
  const isPlayerActive = location.pathname.startsWith('/player');

  const navItems = [
    {
      to: '/',
      label: 'Home',
      icon: '🏠',
      isActive: isHomeActive && !drawerOpen,
    },
    {
      to: '/learning-zone',
      label: 'Lessons',
      icon: '📖',
      isActive: isLessonsActive && !drawerOpen,
    },
    {
      to: '/practice-lab',
      label: 'Practice',
      icon: '⚡',
      isActive: isPracticeActive && !drawerOpen,
    },
    {
      to: '/player',
      label: 'Visual Lab',
      icon: '🎬',
      isActive: isPlayerActive && !drawerOpen,
    },
  ];

  return (
    <nav
      id="stj-mobile-bottom-dock"
      role="navigation"
      aria-label="Mobile Quick Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 995,
        backgroundColor: colorMode === 'dark' ? 'rgba(15, 23, 42, 0.94)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: `1px solid ${colorMode === 'dark' ? '#1e293b' : '#e2e8f0'}`,
        boxShadow: colorMode === 'dark' ? '0 -4px 20px rgba(0, 0, 0, 0.4)' : '0 -4px 16px rgba(0, 0, 0, 0.06)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: 'calc(58px + env(safe-area-inset-bottom, 0px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        boxSizing: 'border-box',
      }}
      className="mobile-bottom-dock-container"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          height: '58px',
          alignItems: 'center',
        }}
      >
        {navItems.map((item) => {
          const activeColor = colorMode === 'dark' ? '#38bdf8' : '#2563eb';
          const inactiveColor = colorMode === 'dark' ? '#94a3b8' : '#64748b';

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                triggerHapticSuccess();
                if (drawerOpen) {
                  window.dispatchEvent(new CustomEvent('stj_toggle_mobile_drawer', { detail: { open: false } }));
                }
              }}
              style={{
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '4px 0',
                gap: '2px',
                position: 'relative',
                color: item.isActive ? activeColor : inactiveColor,
                transition: 'transform 0.1s ease, color 0.15s ease',
              }}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {/* Active top accent pill indicator */}
              {item.isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '28px',
                    height: '3px',
                    borderRadius: '0 0 4px 4px',
                    backgroundColor: activeColor,
                  }}
                />
              )}

              <span
                style={{
                  fontSize: '1.25rem',
                  lineHeight: 1,
                  transform: item.isActive ? 'scale(1.12)' : 'scale(1)',
                  transition: 'transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: item.isActive ? 700 : 500,
                  letterSpacing: '0.01em',
                  lineHeight: 1.1,
                }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* 5th Tab: Explore / More (Toggles full mobile drawer) */}
        <button
          type="button"
          onClick={toggleExploreDrawer}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '4px 0',
            gap: '2px',
            position: 'relative',
            cursor: 'pointer',
            color: drawerOpen
              ? colorMode === 'dark' ? '#38bdf8' : '#2563eb'
              : colorMode === 'dark' ? '#94a3b8' : '#64748b',
            transition: 'color 0.15s ease',
          }}
          aria-expanded={drawerOpen}
          aria-label={drawerOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {drawerOpen && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                width: '28px',
                height: '3px',
                borderRadius: '0 0 4px 4px',
                backgroundColor: colorMode === 'dark' ? '#38bdf8' : '#2563eb',
              }}
            />
          )}
          <span
            style={{
              fontSize: '1.25rem',
              lineHeight: 1,
              transform: drawerOpen ? 'scale(1.12) rotate(90deg)' : 'scale(1)',
              transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            {drawerOpen ? '✕' : '🧭'}
          </span>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: drawerOpen ? 700 : 500,
              letterSpacing: '0.01em',
              lineHeight: 1.1,
            }}
          >
            {drawerOpen ? 'Close' : 'Explore'}
          </span>
        </button>
      </div>
    </nav>
  );
}
