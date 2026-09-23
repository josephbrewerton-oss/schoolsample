// src/components/CurriculumSelector.tsx
import React from 'react';
import { DEFAULT_OAK_CATALOGUE, findTopicLessons, OakLesson } from '../curriculum/oakCatalogue';

interface Props {
  keyStage: string;
  subject: string;
  unit: string;
  selectedLesson?: string;
  onLessonChange?: (lessonTitle: string) => void;
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
  selectedLesson,
  onLessonChange,
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
  const isMultiStageTree =
    curriculumTree &&
    typeof curriculumTree === 'object' &&
    (curriculumTree['ks1'] || curriculumTree['ks2'] || curriculumTree['Key Stage 1'] || curriculumTree['Key Stage 2']);
  const catalogue = isMultiStageTree ? curriculumTree : DEFAULT_OAK_CATALOGUE;

  // Helper to format stage display label cleanly
  const getStageLabel = (stageKey: string): string => {
    const rawStage = catalogue[stageKey];
    if (rawStage && typeof rawStage === 'object' && rawStage.title) {
      return rawStage.title;
    }
    const idMap: Record<string, string> = {
      ks1: 'Key Stage 1',
      ks2: 'Key Stage 2',
      ks3: 'Key Stage 3',
      ks4: 'Key Stage 4 (GCSE)',
      gcse: 'Key Stage 4 (GCSE)',
    };
    return idMap[stageKey.toLowerCase()] || stageKey;
  };

  const allStageKeys = Object.keys(catalogue);
  // Deduplicate stages so that both aliases (e.g. 'ks1' and 'Key Stage 1') don't create duplicate options
  const availableStages = allStageKeys.filter((k, idx) => {
    const label = getStageLabel(k);
    return allStageKeys.findIndex((otherKey) => getStageLabel(otherKey) === label) === idx;
  });

  // Resolve safe stage key matching either key directly, stage.title, or alias
  const resolveStageKey = (inputStage: string): string => {
    if (!inputStage) return availableStages[0] || '';
    if (availableStages.includes(inputStage)) return inputStage;

    const matched = availableStages.find((k) => {
      const obj = catalogue[k];
      if (obj && typeof obj === 'object') {
        if (obj.title && obj.title.toLowerCase() === inputStage.toLowerCase()) return true;
        if (obj.id && obj.id.toLowerCase() === inputStage.toLowerCase()) return true;
      }
      return getStageLabel(k).toLowerCase() === inputStage.toLowerCase();
    });

    if (matched) return matched;

    const norm = inputStage.toLowerCase().replace(/[^a-z0-9]/g, '');
    const aliasMatched = availableStages.find((k) => {
      const kNorm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
      return (
        kNorm === norm ||
        (norm.includes('2') && kNorm.includes('2')) ||
        (norm.includes('1') && kNorm.includes('1')) ||
        (norm.includes('3') && kNorm.includes('3')) ||
        (norm.includes('4') && kNorm.includes('4'))
      );
    });

    return aliasMatched || availableStages[0] || inputStage;
  };

  const safeStage = resolveStageKey(keyStage);

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
  const matchedSubjectLabel =
    availableSubjectLabels.find((lbl) => lbl === subject) ||
    availableSubjectLabels.find((lbl) => {
      const l1 = lbl.toLowerCase().replace(/[^a-z0-9]/g, '');
      const s1 = (subject || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return (
        l1 === s1 ||
        (l1.includes('math') && s1.includes('math')) ||
        (l1.includes('sci') && s1.includes('sci')) ||
        (l1.includes('eng') && s1.includes('eng'))
      );
    }) ||
    availableSubjectLabels[0] ||
    '';
  const safeSubject = matchedSubjectLabel;

  // 2. Safely extract unit strings
  const getUnitItems = (stageKey: string, targetSubLabel: string): string[] => {
    const sItems = getSubjectItems(stageKey);
    const matchedSubject =
      sItems.find((s) => s.label === targetSubLabel) ||
      sItems.find((s) => {
        const l = s.label.toLowerCase();
        const t = (targetSubLabel || '').toLowerCase();
        return (
          l.includes(t) ||
          t.includes(l) ||
          (l.includes('math') && t.includes('math')) ||
          (l.includes('sci') && t.includes('sci')) ||
          (l.includes('eng') && t.includes('eng')) ||
          (l.includes('mfl') && (t.includes('french') || t.includes('spanish') || t.includes('mfl')))
        );
      });
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
  const matchedUnit =
    availableUnits.find((u) => u === unit) ||
    availableUnits.find((u) => {
      const u1 = u.toLowerCase().replace(/[^a-z0-9]/g, '');
      const target = (unit || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return u1 === target || u1.includes(target) || target.includes(u1);
    }) ||
    availableUnits[0] ||
    '';
  const safeUnit = matchedUnit;

  // 3. Extract Oak National Academy lessons for the selected unit/topic
  const availableLessons = findTopicLessons(safeStage, safeSubject, safeUnit);
  const safeLesson = selectedLesson && availableLessons.some((l) => l.title === selectedLesson)
    ? selectedLesson
    : availableLessons[0]?.title || '';

  const handleStageSelect = (newKs: string) => {
    const stageObj = catalogue[newKs];
    const emittedStage = (stageObj && typeof stageObj === 'object' && stageObj.title) ? stageObj.title : getStageLabel(newKs);
    const newSubItems = getSubjectItems(newKs);
    const firstSub = newSubItems[0]?.label || '';
    const units = getUnitItems(newKs, firstSub);
    const firstUnit = units[0] || '';
    onKeyStageChange(emittedStage, firstSub, firstUnit);
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
        gap: '14px',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px -2px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', flex: '1 1 auto' }}>
        {/* Key Stage */}
        <select
          aria-label="Select Key Stage"
          value={safeStage}
          onChange={(e) => handleStageSelect(e.target.value)}
          style={{
            minHeight: '42px',
            padding: '0.5rem 0.85rem',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            fontWeight: 700,
            color: '#1e3a8a',
            background: '#f8fafc',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          {availableStages.map((ks) => (
            <option key={ks} value={ks}>
              {getStageLabel(ks)}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          aria-label="Select Subject"
          value={safeSubject}
          onChange={(e) => handleSubjectSelect(e.target.value)}
          style={{
            minHeight: '42px',
            padding: '0.5rem 0.85rem',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            fontWeight: 700,
            color: '#0f172a',
            background: '#f8fafc',
            fontSize: '0.9rem',
            cursor: 'pointer',
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
            minHeight: '42px',
            padding: '0.5rem 0.85rem',
            borderRadius: '10px',
            border: '1.5px solid #cbd5e1',
            color: '#334155',
            background: '#f8fafc',
            maxWidth: '300px',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {availableUnits.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        {/* Oak Lesson Sequence (when available) */}
        {availableLessons.length > 0 && onLessonChange && (
          <select
            aria-label="Select Oak Lesson"
            value={safeLesson}
            onChange={(e) => onLessonChange(e.target.value)}
            style={{
              minHeight: '42px',
              padding: '0.5rem 0.85rem',
              borderRadius: '10px',
              border: '1.5px solid #a7f3d0',
              color: '#065f46',
              background: '#f0fdf4',
              maxWidth: '300px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            title="Oak National Academy Lesson Sequence"
          >
            {availableLessons.map((l) => (
              <option key={l.id} value={l.title}>
                📖 {l.title}
              </option>
            ))}
          </select>
        )}

        {/* Action Button */}
        <button
          type="button"
          aria-label={buttonLabel}
          onClick={onNewQuestion}
          disabled={!isReady}
          style={{
            minHeight: '42px',
            background: '#2563eb',
            color: '#ffffff',
            fontWeight: 700,
            border: 'none',
            borderRadius: '10px',
            padding: '0.5rem 1.25rem',
            cursor: isReady ? 'pointer' : 'not-allowed',
            fontSize: '0.92rem',
            boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
            opacity: isReady ? 1 : 0.7,
            transition: 'all 0.15s ease',
          }}
        >
          {buttonLabel}
        </button>

        {/* Session & Report */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
          <input
            type="text"
            aria-label="Session or Lesson Name"
            value={sessionId}
            onChange={(e) => onSessionIdChange(e.target.value)}
            placeholder="Class or lesson"
            title="Class or lesson name"
            style={{
              minHeight: '42px',
              padding: '0.5rem 0.75rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontWeight: 600,
              fontSize: '0.85rem',
              width: '130px',
              background: '#f8fafc',
            }}
          />
          <button
            type="button"
            aria-label="Download Diagnostic Summary Report"
            onClick={onDownloadReport}
            title="Download Summary Report for Teacher or Pupil"
            style={{
              minHeight: '42px',
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '10px',
              padding: '0.5rem 0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
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
          fontSize: '0.82rem',
          fontWeight: 700,
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          background: isReady ? '#ecfdf5' : '#fef3c7',
          color: isReady ? '#059669' : '#d97706',
          border: `1px solid ${isReady ? '#a7f3d0' : '#fde68a'}`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '0.65rem' }}>●</span>
        {isReady ? 'Ready' : 'Thinking...'}
      </span>
    </div>
  );
};

export default CurriculumSelector;