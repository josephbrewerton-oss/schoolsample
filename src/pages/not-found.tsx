import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage(): React.JSX.Element {
  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '4rem auto',
        padding: '2rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎓</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
        Curriculum Page Not Found
      </h1>
      <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        The topic or module you are looking for might have been moved, updated, or re-indexed in the local curriculum catalogue.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link
          to="/"
          style={{
            background: '#2563eb',
            color: '#ffffff',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Return to Portal Home
        </Link>
        <Link
          to="/practice-lab"
          style={{
            background: '#f1f5f9',
            color: '#1e293b',
            padding: '0.65rem 1.25rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Practice Arena
        </Link>
      </div>
    </div>
  );
}
