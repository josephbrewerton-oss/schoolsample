// src/pages/media-player.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import AstVectorMediaPlayer, { VectorPresetType } from '../components/AstVectorMediaPlayer';
import { resolvePresetForTopic } from '../services/playerLauncher';

interface PresetItem {
  id: VectorPresetType;
  title: string;
  stage: string;
  category: string;
  desc: string;
  icon: string;
}

const PRESET_LIBRARY: PresetItem[] = [
  {
    id: 'fractions',
    title: 'Fractions & Proportions',
    stage: 'KS2 MATHS',
    category: 'Mathematics',
    desc: 'Visual slice partitioning, equivalent denominators, and geometric whole unit assembly.',
    icon: '🥧',
  },
  {
    id: 'pythagoras',
    title: "Pythagoras' Theorem (a² + b² = c²)",
    stage: 'KS3 MATHS',
    category: 'Mathematics',
    desc: 'Geometric visual proof illustrating area conservation across orthogonal right triangles.',
    icon: '📐',
  },
  {
    id: 'solar-system',
    title: 'Solar System Planetary Orbits',
    stage: 'KS3 SCIENCE',
    category: 'Science',
    desc: '3D Heliocentric orbital velocities, Keplerian mechanics, and scale celestial dynamics.',
    icon: '🪐',
  },
  {
    id: 'photosynthesis',
    title: 'Photosynthesis & Leaf Anatomy',
    stage: 'KS3 BIOLOGY',
    category: 'Science',
    desc: 'Light-dependent chloroplast reactions, stomata gas exchange, and glucose synthesis.',
    icon: '🍃',
  },
  {
    id: 'cell-mitosis',
    title: 'Cell Division: Mitosis Phases',
    stage: 'KS3 BIOLOGY',
    category: 'Science',
    desc: 'Prophase to telophase chromosome replication, spindle fibres, and cytokinesis.',
    icon: '🔬',
  },
  {
    id: 'atom',
    title: 'Atomic Structure: Bohr Shells',
    stage: 'KS3 CHEMISTRY',
    category: 'Science',
    desc: 'Quantized electron orbits, proton/neutron nucleus binding, and valence energy states.',
    icon: '⚛️',
  },
  {
    id: 'velocity',
    title: 'Velocity & Distance Vectors',
    stage: 'KS3 PHYSICS',
    category: 'Science',
    desc: 'Continuous motion physics, displacement vectors, and acceleration mechanics.',
    icon: '🏎️',
  },
  {
    id: 'dna-helix',
    title: 'DNA Double Helix & Base Pairs',
    stage: 'KS3 GENETICS',
    category: 'Science',
    desc: 'Antiparallel sugar-phosphate backbone and hydrogen-bonded A-T / C-G base pairing.',
    icon: '🧬',
  },
  {
    id: 'church-tour',
    title: 'Catholic Church Sanctuary Tour',
    stage: 'CATHOLIC LIFE',
    category: 'Catholic Faith',
    desc: 'Latin cross basilica architecture, Nave, High Altar, golden Tabernacle, and Marian Chapel.',
    icon: '⛪',
  },
];

export default function MediaPlayerPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPreset = searchParams.get('preset') as VectorPresetType | null;
  const urlTopic = searchParams.get('topic');
  const urlSubject = searchParams.get('sub') || searchParams.get('subject');

  const initialPreset: VectorPresetType =
    urlPreset && PRESET_LIBRARY.some((p) => p.id === urlPreset)
      ? urlPreset
      : urlTopic || urlSubject
      ? resolvePresetForTopic(urlSubject || '', urlTopic || '')
      : 'fractions';

  const [activePreset, setActivePreset] = useState<VectorPresetType>(initialPreset);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  useEffect(() => {
    if (urlPreset && PRESET_LIBRARY.some((p) => p.id === urlPreset) && urlPreset !== activePreset) {
      setActivePreset(urlPreset);
    }
  }, [urlPreset, activePreset]);

  const handleSelectPreset = (id: VectorPresetType) => {
    setActivePreset(id);
    setSearchParams({ preset: id });
  };

  const currentPresetMeta = PRESET_LIBRARY.find((p) => p.id === activePreset) || PRESET_LIBRARY[0];
  const filteredPresets =
    filterCategory === 'All'
      ? PRESET_LIBRARY
      : PRESET_LIBRARY.filter((p) => p.category === filterCategory);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      <PageMeta
        title={`${currentPresetMeta.title} — AST Vector Media Player`}
        description="High-fidelity 0-bloat vector media player with real-time SVG animation, synchronized subtitles, 3D orbit controls, and curriculum worksheets."
      />

      {/* Top Breadcrumb & Call Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/learning-zone"
            style={{
              fontSize: '0.84rem',
              color: '#64748b',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            &larr; Learning Zone
          </Link>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ fontSize: '0.84rem', color: '#0284c7', fontWeight: 700 }}>
            🎬 AST Vector Media Player
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link
            to="/catholic-life"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>⛪ Catholic Sanctuary</span>
          </Link>
          <Link
            to="/practice-lab"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontSize: '0.8rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <span>⚡ Practice Lab</span>
          </Link>
        </div>
      </div>

      {/* Main Interactive Player Container */}
      <div
        style={{
          background: '#090d16',
          borderRadius: '16px',
          border: '1px solid #1e293b',
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
          marginBottom: '2rem',
        }}
      >
        {/* Player Header Banner */}
        <div
          style={{
            padding: '12px 18px',
            background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
            borderBottom: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>{currentPresetMeta.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    background: currentPresetMeta.id === 'church-tour' ? '#831843' : '#0369a1',
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                  }}
                >
                  {currentPresetMeta.stage}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>&bull; Live Parametric Engine</span>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0' }}>
                {currentPresetMeta.title}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.74rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '3px 8px',
                borderRadius: '6px',
                fontWeight: 600,
              }}
            >
              Zero-Bloat Vector
            </span>
          </div>
        </div>

        {/* Embedded AST Player */}
        <AstVectorMediaPlayer
          preset={activePreset}
          autoPlay={true}
          allowPresetSwitch={true}
          height="540px"
        />
      </div>

      {/* Interactive SVG Developer Workstation Quick Guide */}
      <div
        className="stj-card"
        style={{
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(15, 23, 42, 0.02) 100%)',
          border: '1px solid var(--stj-border)',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🛠️</span>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--stj-text)' }}>
              Interactive SVG Developer &amp; Manipulative Sandbox Suite
            </h3>
          </div>
          <span className="stj-badge stj-badge-primary stj-pill" style={{ fontSize: '0.72rem' }}>
            60 FPS &bull; Zero Cloud Egress
          </span>
        </div>
        <p style={{ margin: '0 0 12px', fontSize: '0.84rem', color: 'var(--stj-text-muted)', lineHeight: 1.5 }}>
          Turn any curriculum model into an interactive SVG manipulative. Click <strong>🛠️ Inspect</strong> to select stage elements, view bounding geometry, and tweak CSS/SVG attributes in real-time. Use <strong>💻 Studio</strong> to live-code raw SVG nodes and compile continuous AST mathematical bindings with zero layout shift.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          <div style={{ padding: '8px 12px', background: 'var(--stj-canvas)', borderRadius: '8px', border: '1px solid var(--stj-border)' }}>
            <strong style={{ fontSize: '0.8rem', color: 'var(--stj-primary)', display: 'block', marginBottom: '2px' }}>
              🎯 Point-and-Click Inspector
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--stj-text-muted)' }}>
              Hover over SVG vectors to view bounding boxes and IDs. Click to live-tweak fill, stroke, and copy selectors.
            </span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--stj-canvas)', borderRadius: '8px', border: '1px solid var(--stj-border)' }}>
            <strong style={{ fontSize: '0.8rem', color: 'var(--stj-success)', display: 'block', marginBottom: '2px' }}>
              ⚡ Real-Time Hot Reload
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--stj-text-muted)' }}>
              Edit raw &lt;svg&gt; XML or AST S-expression bindings with instant on-canvas execution without losing playback state.
            </span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--stj-canvas)', borderRadius: '8px', border: '1px solid var(--stj-border)' }}>
            <strong style={{ fontSize: '0.8rem', color: 'var(--stj-warning)', display: 'block', marginBottom: '2px' }}>
              🚀 Starter Scratchpad
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--stj-text-muted)' }}>
              One-click starters for Keplerian orbits, harmonic sine waves, and kinetic pendulums ready for export.
            </span>
          </div>
        </div>
      </div>

      {/* Preset Library & Caller Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              📚 Curriculum Preset Library
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Select any National Curriculum or Catholic Life interactive vector model to play.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            {['All', 'Mathematics', 'Science', 'Catholic Faith'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  border: 'none',
                  background: filterCategory === cat ? '#ffffff' : 'transparent',
                  color: filterCategory === cat ? '#0f172a' : '#64748b',
                  fontSize: '0.8rem',
                  fontWeight: filterCategory === cat ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: filterCategory === cat ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Preset Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {filteredPresets.map((p) => {
            const isSelected = p.id === activePreset;
            return (
              <div
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                style={{
                  padding: '1.1rem',
                  borderRadius: '12px',
                  background: isSelected ? '#f0f9ff' : '#ffffff',
                  border: `2px solid ${isSelected ? '#0284c7' : '#e2e8f0'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{p.icon}</span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        background: isSelected ? '#0284c7' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#475569',
                      }}
                    >
                      {p.stage}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: isSelected ? '#0284c7' : '#94a3b8', fontWeight: 700 }}>
                    {isSelected ? '● Currently Playing' : 'Click to Load'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: isSelected ? '#0284c7' : '#94a3b8' }}>➔</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
