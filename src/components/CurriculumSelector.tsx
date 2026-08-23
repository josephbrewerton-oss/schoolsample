import React from 'react';
import { DEFAULT_OAK_CATALOGUE } from '../curriculum/oakCatalogue';

interface Props {
  keyStage: string;
  subject: string;
  unit: string;
  status: string;
  isReady: boolean;
  onKeyStageChange: (ks: string) => void;
  onSubjectChange: (sub: string) => void;
  onUnitChange: (unit: string) => void;
  onNewQuestion: () => void;
}

export const CurriculumSelector: React.FC<Props> = ({
  keyStage,
  subject,
  unit,
  status,
  isReady,
  onKeyStageChange,
  onSubjectChange,
  onUnitChange,
  onNewQuestion
}) => {
  const availableSubjects = Object.keys(DEFAULT_OAK_CATALOGUE[keyStage] || {});
  const availableUnits = DEFAULT_OAK_CATALOGUE[keyStage]?.[subject] || [];

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <select
          value={keyStage}
          onChange={(e) => onKeyStageChange(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, color: '#1e3a8a' }}
        >
          {Object.keys(DEFAULT_OAK_CATALOGUE).map((ks) => (
            <option key={ks} value={ks}>{ks}</option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, color: '#0f172a' }}
        >
          {availableSubjects.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>

        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          style={{ padding: '0.45rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', color: '#334155', maxWidth: '280px' }}
        >
          {availableUnits.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        <button
          onClick={onNewQuestion}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1.25rem',
            cursor: 'pointer'
          }}
        >
          New Question
        </button>
      </div>

      <span style={{
        fontSize: '0.85rem',
        fontWeight: 600,
        padding: '0.35rem 0.75rem',
        borderRadius: '9999px',
        background: isReady ? '#ecfdf5' : '#fef3c7',
        color: isReady ? '#059669' : '#d97706',
        border: `1px solid ${isReady ? '#a7f3d0' : '#fde68a'}`
      }}>
        ● {status}
      </span>
    </div>
  );
};