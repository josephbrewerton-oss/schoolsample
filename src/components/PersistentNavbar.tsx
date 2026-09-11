import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export default function PersistentNavbar(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
  const location = useLocation();

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
    { to: '/profile', label: '⭐ Progress' },
    { to: '/curriculum-studio', label: '🌍 Studio' },
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
