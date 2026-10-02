// src/components/NavigationDirectoryGrid.tsx
/**
 * Shared National Curriculum Navigation Directory Grid
 * Displays interactive quick-navigation cards for the portal's core learning and management zones.
 */

import React from 'react';
import { Link } from 'react-router-dom';

export interface NavigationDirectoryGridProps {
  title?: string;
  className?: string;
}

export const NavigationDirectoryGrid: React.FC<NavigationDirectoryGridProps> = ({
  title = 'National Curriculum Navigation Directory',
  className = '',
}) => {
  return (
    <section className={className}>
      {title && (
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--stj-text)', marginBottom: '1rem' }}>
          {title}
        </h2>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        <Link
          to="/practice-lab"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⚡</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>Interactive Practice Arena</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Key Stage 1–4 diagnostic challenges with local Socratic Super Teacher Nano assistance.
          </p>
        </Link>

        <Link
          to="/learning-zone"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>📖</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>Curriculum Lessons</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Step-by-step S-Expression units spanning Academic, Faith Formation, and CPD streams.
          </p>
        </Link>

        <Link
          to="/curriculum-studio"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>🌍</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>Curriculum Studio</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Import custom CSV spreadsheets or activate national syllabi (Kenya, India, Ghana, Philippines).
          </p>
        </Link>

        <Link
          to="/profile"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⭐</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>My Progress &amp; Passport</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Local mastery breakdown, offline certificate generation, and GDPR-safe data control.
          </p>
        </Link>

        <Link
          to="/settings"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>⚙️</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>Portal Settings</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Configure local Ollama WebRTC models, OpenDyslexic fonts, and high-contrast themes.
          </p>
        </Link>

        <Link
          to="/news"
          className="stj-card stj-card-interactive"
          style={{
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <div style={{ fontSize: '1.75rem', marginBottom: '6px' }}>📰</div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--stj-text)' }}>School News</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--stj-text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
            Technical dispatches and updates from St Joseph&apos;s Fishponds AI engineering team.
          </p>
        </Link>
      </div>
    </section>
  );
};

export default NavigationDirectoryGrid;
