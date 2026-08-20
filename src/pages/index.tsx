import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Home() {
  return (
    <Layout title="Home" description="School AI Learning Portal">
      <main style={{ padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#0f172a' }}>
          Welcome to St Joseph's Learning Portal
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '3rem' }}>
          Interactive national curriculum mastery powered by on-device edge AI.
        </p>

        {/* Phase Selector Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          textAlign: 'left'
        }}>
          {/* Primary */}
          <Link
            to="/primary"
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: 'var(--ifm-card-background-color, #ffffff)',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎒</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#059669' }}>Primary School</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Key Stages 1 & 2 (Years 1–6). Foundational Maths, English, Science & Languages.
            </p>
          </Link>

          {/* Secondary */}
          <Link
            to="/secondary"
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: 'var(--ifm-card-background-color, #ffffff)',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔬</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2563eb' }}>Secondary School</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Key Stages 3 & 4 (Years 7–11 / GCSE). In-depth STEM, Humanities, and Socratic analysis.
            </p>
          </Link>

          {/* Sixth Form & Formation */}
          <Link
            to="/formation"
            style={{
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              background: 'var(--ifm-card-background-color, #ffffff)',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏛️</div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#7c3aed' }}>Sixth Form & Formation</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
              Advanced Key Stage 5, Parish Faith Formation, and Professional CPD modules.
            </p>
          </Link>
        </div>
      </main>
    </Layout>
  );
}