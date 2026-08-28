// src/components/CurriculumSelector.tsx
import React from 'react';
import { DEFAULT_OAK_CATALOGUE } from '../curriculum/oakCatalogue';

interface Props {
  keyStage: string;
  subject: string;
  unit: string;
  status: string;
  isReady: boolean;
  sessionId: string;
  buttonLabel?: string;
  curriculumTree?: Record<string, any>;
  onKeyStageChange: (ks: string, firstSub: string, firstUnit: string) => void;
  onSubjectChange: (sub: string, firstUnit: string) => void;
  onUnitChange: (unit: string) => void;
  onSessionIdChange: (name: string) => void;
  onNewQuestion: () => void;
  onDownloadReport: () => void;
}

export const CurriculumSelector: React.FC<Props> = ({
  keyStage,
  subject,
  unit,
  status,
  isReady,
  sessionId,
  buttonLabel = 'New Question',
  curriculumTree = DEFAULT_OAK_CATALOGUE,
  onKeyStageChange,
  onSubjectChange,
  onUnitChange,
  onSessionIdChange,
  onNewQuestion,
  onDownloadReport,
}) => {
  const catalogue = curriculumTree && Object.keys(curriculumTree).length > 0 ? curriculumTree : DEFAULT_OAK_CATALOGUE;
  const availableStages = Object.keys(catalogue);
  const safeStage = availableStages.includes(keyStage) ? keyStage : (availableStages[0] || keyStage);

  // 1. Safely extract subject list as [{ id, title, raw }]
  const getSubjectItems = (stageKey: string): { label: string; raw: any }[] => {
    const rawStage = catalogue[stageKey];
    if (!rawStage) return [];

    const rawSubjects = rawStage.subjects || rawStage;

    // If subjects is an Array: [{ title: 'Science', units: [...] }]
    if (Array.isArray(rawSubjects)) {
      return rawSubjects.map((s) => ({
        label: typeof s === 'string' ? s : s.title || s.name || s.id || String(s),
        raw: s,
      }));
    }

    // If subjects is an Object dictionary: { "Science": [...] }
    if (typeof rawSubjects === 'object') {
      return Object.keys(rawSubjects)
        .filter((k) => !['id', 'title', 'keyStage'].includes(k))
        .map((k) => ({
          label: k,
          raw: rawSubjects[k],
        }));
    }

    return [];
  };

  const subjectItems = getSubjectItems(safeStage);
  const availableSubjectLabels = subjectItems.map((s) => s.label);
  const safeSubject = availableSubjectLabels.includes(subject) ? subject : (availableSubjectLabels[0] || '');

  // 2. Safely extract unit strings
  const getUnitItems = (stageKey: string, targetSubLabel: string): string[] => {
    const sItems = getSubjectItems(stageKey);
    const matchedSubject = sItems.find((s) => s.label === targetSubLabel);
    if (!matchedSubject) return [];

    const subData = matchedSubject.raw;

    if (Array.isArray(subData)) {
      return subData.map((u) => (typeof u === 'string' ? u : u.title || u.name || u.id || String(u)));
    }

    if (subData && typeof subData === 'object') {
      const unitsList = subData.units || subData.lessons || subData.topics;
      if (Array.isArray(unitsList)) {
        return unitsList.map((u) => (typeof u === 'string' ? u : u.title || u.name || u.id || String(u)));
      }
      return Object.keys(subData).filter((k) => !['id', 'title', 'icon', 'name'].includes(k));
    }

    return [];
  };

  const availableUnits = getUnitItems(safeStage, safeSubject);
  const safeUnit = availableUnits.includes(unit) ? unit : (availableUnits[0] || '');

  const handleStageSelect = (newKs: string) => {
    const newSubItems = getSubjectItems(newKs);
    const firstSub = newSubItems[0]?.label || '';
    const units = getUnitItems(newKs, firstSub);
    const firstUnit = units[0] || '';
    onKeyStageChange(newKs, firstSub, firstUnit);
  };

  const handleSubjectSelect = (newSub: string) => {
    const units = getUnitItems(safeStage, newSub);
    const firstUnit = units[0] || '';
    onSubjectChange(newSub, firstUnit);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        {/* Key Stage */}
        <select
          aria-label="Select Key Stage"
          value={safeStage}
          onChange={(e) => handleStageSelect(e.target.value)}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontWeight: 600,
            color: '#1e3a8a',
            background: '#f8fafc',
          }}
        >
          {availableStages.map((ks) => (
            <option key={ks} value={ks}>
              {ks}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          aria-label="Select Subject"
          value={safeSubject}
          onChange={(e) => handleSubjectSelect(e.target.value)}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontWeight: 600,
            color: '#0f172a',
            background: '#f8fafc',
          }}
        >
          {subjectItems.map((sub) => (
            <option key={sub.label} value={sub.label}>
              {sub.label}
            </option>
          ))}
        </select>

        {/* Unit */}
        <select
          aria-label="Select Unit or Topic"
          value={safeUnit}
          onChange={(e) => onUnitChange(e.target.value)}
          style={{
            padding: '0.45rem 0.75rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            color: '#334155',
            background: '#f8fafc',
            maxWidth: '260px',
          }}
        >
          {availableUnits.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        {/* Action Button */}
        <button
          type="button"
          aria-label={buttonLabel}
          onClick={onNewQuestion}
          disabled={!isReady}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem 1.15rem',
            cursor: isReady ? 'pointer' : 'not-allowed',
            fontSize: '0.9rem',
            opacity: isReady ? 1 : 0.7,
          }}
        >
          {buttonLabel}
        </button>

        {/* Session & Report */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginLeft: '4px' }}>
          <input
            type="text"
            aria-label="Session or Lesson Name"
            value={sessionId}
            onChange={(e) => onSessionIdChange(e.target.value)}
            placeholder="Lesson name"
            title="Session Name for Local Jotter"
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontWeight: 500,
              fontSize: '0.85rem',
              width: '120px',
              background: '#f8fafc',
            }}
          />
          <button
            type="button"
            aria-label="Download Local Diagnostic Summary Report"
            onClick={onDownloadReport}
            title="Download Local Diagnostic Summary"
            style={{
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            📥 Report
          </button>
        </div>
      </div>

      <span
        role="status"
        aria-live="polite"
        style={{
          fontSize: '0.85rem',
          fontWeight: 600,
          padding: '0.35rem 0.75rem',
          borderRadius: '9999px',
          background: isReady ? '#ecfdf5' : '#fef3c7',
          color: isReady ? '#059669' : '#d97706',
          border: `1px solid ${isReady ? '#a7f3d0' : '#fde68a'}`,
        }}
      >
        ● {status}
      </span>
    </div>
  );
};

export default CurriculumSelector;