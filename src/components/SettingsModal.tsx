// src/components/SettingsModal.tsx
import React from 'react';
import { useCurriculumStandard } from '../hooks/useCurriculumStandard';
import { CurriculumProviderKey } from '../data/curriculumRegistry';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [standard, setStandard] = useCurriculumStandard();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>Settings & Access</h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.2rem',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            ✕
          </button>
        </div>

        {/* Curriculum Standard Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, fontSize: '0.875rem', color: '#334155', marginBottom: '0.5rem' }}>
            Curriculum Standard & Region
          </label>
          <select
            value={standard}
            onChange={(e) => setStandard(e.target.value as CurriculumProviderKey)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem',
              color: '#0f172a',
              background: '#f8fafc',
            }}
          >
            <option value="uk_oak">UK National Curriculum (Oak National)</option>
            <option value="international">International / Universal (Cambridge & IB Aligned)</option>
          </select>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
            {standard === 'uk_oak'
              ? 'Enforces standard UK English dialect, pounds (£/p), and Key Stage 1–4 regional topics.'
              : 'Enforces neutral international English, metric SI units, and universal syllabus topics.'}
          </p>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};