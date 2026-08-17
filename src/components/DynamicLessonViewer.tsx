import React, { useState } from 'react';
import { LESSON_REGISTRY, resolveLessonByCode, LessonASTNode } from '../data/lessons';
import InteractiveEdgeSandbox from './InteractiveEdgeSandbox';

interface ViewerProps {
  defaultCode?: string;
}

export default function DynamicLessonViewer({ defaultCode = 'Y4-SCI-01' }: ViewerProps): React.JSX.Element {
  const [activeCode, setActiveCode] = useState<string>(defaultCode);
  const [searchInput, setSearchInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeNode: LessonASTNode = resolveLessonByCode(activeCode) ?? LESSON_REGISTRY[0];

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = resolveLessonByCode(searchInput);
    if (matched) {
      setActiveCode(matched.code);
      setSearchInput('');
      setErrorMsg(null);
    } else {
      setErrorMsg(`No lesson found matching "${searchInput}". Try "Y4", "Y10", "Maths", or a lesson code.`);
    }
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
      
      {/* Code Search & Dropdown Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '8px', flex: '1 1 280px' }}>
          <input
            type="text"
            placeholder="Search code or keyword (e.g. Y4, GCSE, Maths)..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' }}
          />
          <button
            type="submit"
            style={{ padding: '8px 16px', borderRadius: '6px', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Load
          </button>
        </form>

        {/* Quick Dropdown */}
        <select
          value={activeNode.code}
          onChange={(e) => {
            setActiveCode(e.target.value);
            setErrorMsg(null);
          }}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc' }}
        >
          {LESSON_REGISTRY.map((node) => (
            <option key={node.code} value={node.code}>
              {node.code} — {node.stage} {node.subject}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Select Preset Buttons */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b', alignSelf: 'center', marginRight: '4px' }}>Presets:</span>
        {LESSON_REGISTRY.map((node) => (
          <button
            key={node.code}
            onClick={() => {
              setActiveCode(node.code);
              setErrorMsg(null);
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.8rem',
              borderRadius: '20px',
              border: activeNode.code === node.code ? '1px solid #2563eb' : '1px solid #e2e8f0',
              background: activeNode.code === node.code ? '#eff6ff' : '#f8fafc',
              color: activeNode.code === node.code ? '#1d4ed8' : '#475569',
              cursor: 'pointer',
              fontWeight: activeNode.code === node.code ? 600 : 400,
            }}
          >
            {node.icon} {node.code} ({node.stage})
          </button>
        ))}
      </div>

      {/* Inline Feedback */}
      {errorMsg && (
        <div style={{ padding: '8px 12px', background: '#fef2f2', color: '#dc2626', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {errorMsg}
        </div>
      )}

      {/* Lesson Header */}
      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
            {activeNode.yearGroup}
          </span>
          <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
            {activeNode.stage} · {activeNode.subject}
          </span>
          <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: '0.85rem' }}>
            Code: <strong>{activeNode.code}</strong>
          </span>
        </div>

        <h1 style={{ margin: '0.5rem 0' }}>{activeNode.title} {activeNode.icon}</h1>
        <p style={{ fontSize: '1.05rem', color: '#475569', margin: '0 0 1.5rem 0' }}>{activeNode.description}</p>
      </div>

      {/* Shared Neuro-Symbolic Sandbox */}
      <InteractiveEdgeSandbox runtimeConfig={activeNode.runtime} />
    </div>
  );
}