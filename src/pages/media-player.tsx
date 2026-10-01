// src/pages/media-player.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import AstVectorMediaPlayer, { VectorPresetType, AstVectorMediaPlayerHandle } from '../components/AstVectorMediaPlayer';
import MountainClimberGame from '../components/MountainClimberGame';
import MathFishingGame from '../components/MathFishingGame';
import ShakespeareGlobeLab from '../components/ShakespeareGlobeLab';
import MflLanguageLab from '../components/MflLanguageLab';
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
  {
    id: 'shakespeare',
    title: 'The Globe Theatre: Shakespeare & Iambic Meter',
    stage: 'KS3/KS4 ENGLISH LITERATURE',
    category: 'English & Drama',
    desc: 'The Zero-Bloat Bard: 1599 Globe Theatre vector stage, real-time Iambic Pentameter heartbeat metronome, First Folio to modern translation scrubber, and dramatic irony tension matrix.',
    icon: '🎭',
  },
  {
    id: 'languages',
    title: 'MFL & Polyglot Studio: Spanish, French & Latin',
    stage: 'KS2/KS3 MFL',
    category: 'Languages & MFL',
    desc: 'Interactive Modern Foreign Languages & Polyglot Lab: Spanish & French phonics studio, dynamic verb conjugation engine (-ar, -er, -ir), and rapid vocabulary recall sprints with native audio.',
    icon: '🌍',
  },
  {
    id: 'math-fishing',
    title: 'Math Pond: Number Bonds Fishing Game',
    stage: 'KS1/KS2 MATHS',
    category: 'Games & Simulations',
    desc: 'Interactive vector pond fishing adventure: cast your line, hook swimming fish with numerals and ten-frame dots, adding them together for number bonds to 10 & 20, doubles, and mental arithmetic.',
    icon: '🎣',
  },
  {
    id: 'mountain-elevation',
    title: 'Mountain Altitude: Climber Game & Trigonometry',
    stage: 'KS2/KS3 MATHS & GEOGRAPHY',
    category: 'Games & Simulations',
    desc: 'Interactive hill climber game: ascending the mountain slope while contrasting true vertical altitude against slope distance, right-angle hypotenuse, and atmospheric lapse rate.',
    icon: '🧗',
  },
  {
    id: 'fish-tank',
    title: 'Aquarium Stress Benchmark & Point Limiter',
    stage: 'BENCHMARK & STRESS LAB',
    category: 'Diagnostics & Games',
    desc: 'Multi-species vector fish tank stress test: measures real-time 60 FPS performance, active vector points, and frame render budget to determine the device safe point limit.',
    icon: '🐠',
  },
];

export default function MediaPlayerPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPreset = searchParams.get('preset') as VectorPresetType | null;
  const urlTopic = searchParams.get('topic');
  const urlSubject = searchParams.get('sub') || searchParams.get('subject');
  const urlMode = searchParams.get('mode');

  // Default to the featured Mountain Climber interactive simulation if no specific preset is requested
  const initialPreset: VectorPresetType =
    urlPreset && PRESET_LIBRARY.some((p) => p.id === urlPreset)
      ? urlPreset
      : urlTopic || urlSubject
      ? resolvePresetForTopic(urlSubject || '', urlTopic || '')
      : 'mountain-elevation';

  const [activePreset, setActivePreset] = useState<VectorPresetType>(initialPreset);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const playerRef = useRef<AstVectorMediaPlayerHandle>(null);

  // Initialize playMode from urlMode if provided, or default to 'game' for mountain-elevation, math-fishing, shakespeare, and languages
  const initialPlayMode: 'video' | 'game' =
    urlMode === 'video'
      ? 'video'
      : urlMode === 'game'
      ? 'game'
      : initialPreset === 'mountain-elevation' || initialPreset === 'math-fishing' || initialPreset === 'shakespeare' || initialPreset === 'languages'
      ? 'game'
      : 'video';

  const [playMode, setPlayMode] = useState<'video' | 'game'>(initialPlayMode);

  useEffect(() => {
    if (urlPreset && PRESET_LIBRARY.some((p) => p.id === urlPreset) && urlPreset !== activePreset) {
      setActivePreset(urlPreset);
      if (urlMode === 'game' || urlPreset === 'mountain-elevation' || urlPreset === 'math-fishing') {
        setPlayMode('game');
      }
    } else if (urlMode && (urlMode === 'game' || urlMode === 'video') && urlMode !== playMode) {
      setPlayMode(urlMode);
    }
  }, [urlPreset, urlMode, activePreset, playMode]);

  const handleSelectPreset = (id: VectorPresetType, targetMode?: 'video' | 'game') => {
    setActivePreset(id);
    const chosenMode = targetMode || (id === 'mountain-elevation' || id === 'math-fishing' ? 'game' : playMode);
    setPlayMode(chosenMode);
    setSearchParams({ preset: id, mode: chosenMode });
  };

  const currentPresetMeta = PRESET_LIBRARY.find((p) => p.id === activePreset) || PRESET_LIBRARY[0];
  const filteredPresets = PRESET_LIBRARY.filter((p) => {
    const matchesCategory =
      filterCategory === 'All' ? true : p.category === filterCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.stage.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      <PageMeta
        title={`${currentPresetMeta.title} — Lumina Vector Player | St Joseph's`}
        description="High-fidelity 0-bloat Lumina vector media player with real-time SVG animation, synchronized subtitles, 3D orbit controls, and curriculum worksheets."
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
            🎬 Lumina Vector Player
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
                <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>&bull; Lumina Motion Suite</span>
              </div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: '2px 0 0' }}>
                {currentPresetMeta.title}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Primary Mode Selector Bar — Always visible so Play Mode and Lesson Video Mode can always be toggled */}
            <div
              style={{
                display: 'inline-flex',
                background: '#090d16',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid #334155',
                gap: '4px',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  if (activePreset !== 'mountain-elevation' && activePreset !== 'church-tour') {
                    // Switch to the featured interactive climber game if currently on a static diagram
                    handleSelectPreset('mountain-elevation', 'game');
                  } else {
                    setPlayMode('game');
                    setSearchParams({ preset: activePreset, mode: 'game' });
                  }
                  playerRef.current?.pause();
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: playMode === 'game' ? '1px solid #10b981' : '1px solid transparent',
                  background: playMode === 'game' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                  color: playMode === 'game' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: playMode === 'game' ? '0 0 14px rgba(16, 185, 129, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                }}
                title="Switch to Interactive Play Mode (Keyboard & Touch Game Controls)"
              >
                <span style={{ fontSize: '0.95rem' }}>🎮</span>
                <span>Play Mode</span>
                {playMode === 'game' && (
                  <span style={{ fontSize: '0.62rem', background: '#ffffff', color: '#047857', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>
                    ACTIVE
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPlayMode('video');
                  setSearchParams({ preset: activePreset, mode: 'video' });
                  playerRef.current?.play();
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: playMode === 'video' ? '1px solid #0284c7' : '1px solid transparent',
                  background: playMode === 'video' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
                  color: playMode === 'video' ? '#ffffff' : '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: playMode === 'video' ? '0 0 14px rgba(2, 132, 199, 0.4)' : 'none',
                  transition: 'all 0.15s ease',
                }}
                title="Switch to Lesson Video Mode (Automated 60 FPS Animation & Narration)"
              >
                <span style={{ fontSize: '0.95rem' }}>🎬</span>
                <span>Lesson Video</span>
                {playMode === 'video' && (
                  <span style={{ fontSize: '0.62rem', background: '#ffffff', color: '#0369a1', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>
                    ACTIVE
                  </span>
                )}
              </button>
            </div>

            <span
              style={{
                fontSize: '0.72rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              Zero-Bloat Vector
            </span>
          </div>
        </div>

        {/* Real-time Mode State Notice Banner */}
        {playMode === 'game' ? (
          <div
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(90deg, #064e3b 0%, #0f172a 100%)',
              borderBottom: '1px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              color: '#d1fae5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🎮</span>
              <span>
                <strong style={{ color: '#ffffff' }}>INTERACTIVE PLAY MODE ENGAGED</strong> &mdash; Direct physics simulation &amp; telemetry active!
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#6ee7b7',
                  background: 'rgba(5, 150, 105, 0.25)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #10b981',
                  fontWeight: 600,
                }}
              >
                ⌨️ Controls: Space / &uarr; Step &bull; S / &darr; Rest &bull; A / 1 Axe &bull; O / 2 Oxygen
              </span>
              <button
                type="button"
                onClick={() => {
                  setPlayMode('video');
                  setSearchParams({ preset: activePreset, mode: 'video' });
                  playerRef.current?.play();
                }}
                style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #475569',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Switch to Lesson Video &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(90deg, #0c4a6e 0%, #0f172a 100%)',
              borderBottom: '1px solid #0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              color: '#e0f2fe',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🎬</span>
              <span>
                <strong style={{ color: '#ffffff' }}>LESSON VIDEO MODE</strong> &mdash; Continuous timeline animation &amp; on-device narration.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (activePreset !== 'mountain-elevation') {
                  handleSelectPreset('mountain-elevation', 'game');
                } else {
                  setPlayMode('game');
                  setSearchParams({ preset: activePreset, mode: 'game' });
                }
                playerRef.current?.pause();
              }}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.76rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
              }}
            >
              <span>🎮</span> Launch Interactive Play Mode Now
            </button>
          </div>
        )}

        {/* Embedded AST Player (Hidden when in standalone interactive full-stage labs like Languages) */}
        {!(activePreset === 'languages' && playMode === 'game') && (
          <AstVectorMediaPlayer
            ref={playerRef}
            preset={activePreset}
            autoPlay={playMode === 'video'}
            allowPresetSwitch={true}
            height="min(520px, 55vh)"
            onPresetChange={(newPreset) => handleSelectPreset(newPreset)}
            onPlayModeToggle={() => {
              const nextMode = playMode === 'game' ? 'video' : 'game';
              if (nextMode === 'game' && activePreset !== 'mountain-elevation' && activePreset !== 'math-fishing' && activePreset !== 'church-tour' && activePreset !== 'shakespeare' && activePreset !== 'languages') {
                handleSelectPreset('languages', 'game');
              } else {
                setPlayMode(nextMode);
                setSearchParams({ preset: activePreset, mode: nextMode });
                if (nextMode === 'game') {
                  playerRef.current?.pause();
                } else {
                  playerRef.current?.play();
                }
              }
            }}
          />
        )}

        {/* Playable Interactive Game Mode Consoles (Active Player Physics & Telemetry) */}
        {activePreset === 'mountain-elevation' && playMode === 'game' && (
          <MountainClimberGame
            playerRef={playerRef}
            onCloseGameMode={() => {
              setPlayMode('video');
              setSearchParams({ preset: activePreset, mode: 'video' });
              playerRef.current?.play();
            }}
          />
        )}

        {activePreset === 'math-fishing' && playMode === 'game' && (
          <MathFishingGame
            playerRef={playerRef}
            onCloseGameMode={() => {
              setPlayMode('video');
              setSearchParams({ preset: activePreset, mode: 'video' });
              playerRef.current?.play();
            }}
          />
        )}

        {activePreset === 'shakespeare' && playMode === 'game' && (
          <div style={{ padding: '16px', background: '#090d16', borderTop: '1px solid #1e293b' }}>
            <ShakespeareGlobeLab
              onClose={() => {
                setPlayMode('video');
                setSearchParams({ preset: activePreset, mode: 'video' });
                playerRef.current?.play();
              }}
            />
          </div>
        )}

        {activePreset === 'languages' && playMode === 'game' && (
          <div style={{ padding: '16px', background: '#090d16', borderTop: '1px solid #1e293b' }}>
            <MflLanguageLab
              onClose={() => {
                setPlayMode('video');
                setSearchParams({ preset: activePreset, mode: 'video' });
                playerRef.current?.play();
              }}
            />
          </div>
        )}
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
          <div style={{ padding: '8px 12px', background: 'var(--stj-canvas)', borderRadius: '8px', border: '1px solid var(--stj-border)' }}>
            <strong style={{ fontSize: '0.8rem', color: '#8b5cf6', display: 'block', marginBottom: '2px' }}>
              💾 Autonomous SVG SPA
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--stj-text-muted)' }}>
              1-click export of an entire self-contained Single Page Application into a single .svg file. Runs offline in any browser forever.
            </span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--stj-canvas)', borderRadius: '8px', border: '1px solid var(--stj-border)' }}>
            <strong style={{ fontSize: '0.8rem', color: '#ec4899', display: 'block', marginBottom: '2px' }}>
              📡 OBS Studio Broadcast Link
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--stj-text-muted)' }}>
              Direct local WebSocket v5 link: synchronized recording, live text overlays, automated scene switching, and transparent camera browser source.
            </span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--stj-canvas)', borderRadius: '8px', border: '1px solid var(--stj-border)' }}>
            <strong style={{ fontSize: '0.8rem', color: '#0284c7', display: 'block', marginBottom: '2px' }}>
              ⚙️ Display Profiles &amp; Clean Settings
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--stj-text-muted)' }}>
              1-click switch between 🎓 Classroom (clean whiteboard), 🎒 Student Focus (distraction-free), 📡 Broadcast, or 🛠️ Developer Mode so you only show what you need.
            </span>
          </div>
          <div style={{ padding: '8px 12px', background: 'var(--stj-canvas)', borderRadius: '8px', border: '1px solid var(--stj-border)' }}>
            <strong style={{ fontSize: '0.8rem', color: '#10b981', display: 'block', marginBottom: '2px' }}>
              🎙️ Voice Command Control (SpeechRecognition API)
            </strong>
            <span style={{ fontSize: '0.74rem', color: 'var(--stj-text-muted)' }}>
              Hands-free navigation via the browser's SpeechRecognition API. Click 🎤 <strong>Mic</strong> or press <kbd style={{ padding: '1px 5px', fontSize: '0.7rem', background: 'var(--stj-surface-raised)', borderRadius: '4px', border: '1px solid var(--stj-border)' }}>V</kbd> to speak: <em>"play"</em>, <em>"pause"</em>, <em>"rewind"</em>, or <em>"show me fractions"</em>.
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

          {/* Search Input & Category Filter Pills */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search games & models (e.g. climber, altitude)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px 6px 30px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  outline: 'none',
                  minWidth: '220px',
                  background: '#ffffff',
                  color: '#0f172a',
                }}
              />
              <span style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94a3b8' }}>
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', flexWrap: 'wrap' }}>
              {['All', 'Languages & MFL', 'Games & Simulations', 'Mathematics', 'Science', 'English & Drama', 'Catholic Faith'].map((cat) => (
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
                  {cat === 'Languages & MFL' ? '🌍 Languages & MFL' : cat === 'Games & Simulations' ? '🎮 Games & Sims' : cat === 'English & Drama' ? '🎭 English & Drama' : cat}
                </button>
              ))}
            </div>
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

                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  {p.id === 'mountain-elevation' ? (
                    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPreset(p.id, 'game');
                        }}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          background: isSelected && playMode === 'game' ? '#059669' : '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          boxShadow: '0 1px 3px rgba(16, 185, 129, 0.3)',
                        }}
                      >
                        <span>🎮</span> Play Game {isSelected && playMode === 'game' ? '✔' : ''}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPreset(p.id, 'video');
                        }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: isSelected && playMode === 'video' ? '#0284c7' : '#f1f5f9',
                          color: isSelected && playMode === 'video' ? '#ffffff' : '#334155',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>🎬</span> Video
                      </button>
                    </div>
                  ) : p.id === 'fish-tank' ? (
                    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPreset(p.id, 'video');
                        }}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          background: isSelected ? '#0284c7' : '#0ea5e9',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          boxShadow: '0 1px 3px rgba(14, 165, 233, 0.3)',
                        }}
                      >
                        <span>🐠</span> Run Stress Benchmark {isSelected ? '✔' : ''}
                      </button>
                    </div>
                  ) : p.id === 'church-tour' ? (
                    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPreset(p.id, 'game');
                        }}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          borderRadius: '6px',
                          background: isSelected && playMode === 'game' ? '#9333ea' : '#a855f7',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>⛪</span> 3D Quest {isSelected && playMode === 'game' ? '✔' : ''}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPreset(p.id, 'video');
                        }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          background: isSelected && playMode === 'video' ? '#0284c7' : '#f1f5f9',
                          color: isSelected && playMode === 'video' ? '#ffffff' : '#334155',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <span>🎬</span> Tour
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: isSelected ? '#0284c7' : '#94a3b8', fontWeight: 700 }}>
                        {isSelected ? (playMode === 'game' ? '🎮 Playing Game' : '🎬 Playing Video') : 'Click to Load'}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: isSelected ? '#0284c7' : '#94a3b8' }}>➔</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
