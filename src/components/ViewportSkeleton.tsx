import React from 'react';

export default function ViewportSkeleton(): React.JSX.Element {
  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        width: '100%',
        minHeight: '60vh',
      }}
    >
      <div
        style={{
          width: '240px',
          height: '24px',
          backgroundColor: '#e2e8f0',
          borderRadius: '9999px',
          margin: '0 auto 1.5rem auto',
          opacity: 0.7,
        }}
      />
      <div
        style={{
          width: '60%',
          height: '42px',
          backgroundColor: '#cbd5e1',
          borderRadius: '8px',
          margin: '0 auto 1rem auto',
          opacity: 0.8,
        }}
      />
      <div
        style={{
          width: '80%',
          height: '20px',
          backgroundColor: '#e2e8f0',
          borderRadius: '6px',
          margin: '0 auto 2.5rem auto',
          opacity: 0.6,
        }}
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem',
        }}
      >
        <div
          style={{
            height: '180px',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        />
        <div
          style={{
            height: '180px',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        />
        <div
          style={{
            height: '180px',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
          }}
        />
      </div>
    </div>
  );
}
