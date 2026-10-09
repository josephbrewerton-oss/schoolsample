// src/pages/media-player.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PageMeta from '../components/PageMeta';
import AstVectorMediaPlayer, { VectorPresetType, AstVectorMediaPlayerHandle } from '../components/AstVectorMediaPlayer';
import MountainClimberGame from '../components/MountainClimberGame';
import MathFishingGame from '../components/MathFishingGame';
import ShakespeareGlobeLab from '../components/ShakespeareGlobeLab';
import MflLanguageLab from '../components/MflLanguageLab';
import EarlyPhonicsLab from '../components/EarlyPhonicsLab';
import MathsFundamentalsLab from '../components/MathsFundamentalsLab';
import AquariumSimulationLab from '../components/AquariumSimulationLab';
import { resolvePresetForTopic } from '../services/playerLauncher';
import {
  getAllCartridges,
  getCartridge,
  normalizeCartridgeId,
  importCartridgeFile,
  createCustomCartridge,
  deleteCustomCartridge,
  type CartridgeDefinition,
} from '../services/cartridgeStore';
import { exportSubjectCartridge, exportCustomCartridgeBundle } from '../utils/exportSubjectCartridge';

export default function MediaPlayerPage(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPreset = searchParams.get('preset') as VectorPresetType | null;
  const urlTopic = searchParams.get('topic');
  const urlSubject = searchParams.get('sub') || searchParams.get('subject');
  const urlMode = searchParams.get('mode');

  // Dynamic Decentralized Cartridges
  const [cartridges, setCartridges] = useState<CartridgeDefinition[]>(() => getAllCartridges());

  useEffect(() => {
    const handleUpdate = () => {
      setCartridges(getAllCartridges());
    };
    window.addEventListener('cartridges_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cartridges_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Fault-tolerant preset resolution with alias mapping (e.g. pythagorus -> kinetic-gas, or user/phet cartridge)
  const resolvedPreset = urlPreset ? getCartridge(urlPreset) : null;
  const initialPreset: VectorPresetType =
    resolvedPreset
      ? resolvedPreset.id
      : urlTopic || urlSubject
      ? resolvePresetForTopic(urlSubject || '', urlTopic || '')
      : 'kinetic-gas';

  const [activePreset, setActivePreset] = useState<VectorPresetType>(initialPreset);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSimStopped, setIsSimStopped] = useState(false);
  const playerRef = useRef<AstVectorMediaPlayerHandle>(null);

  // Modals for Decentralized Cartridge Management
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);

  // Import State
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create Cartridge State
  const [createTitle, setCreateTitle] = useState('');
  const [createCategory, setCreateCategory] = useState('Science');
  const [createStage, setCreateStage] = useState('KS3/KS4 PHYSICS');
  const [createDesc, setCreateDesc] = useState('');
  const [createSvg, setCreateSvg] = useState('');
  const [createAst, setCreateAst] = useState('');

  // Pack Builder State
  const [selectedPackIds, setSelectedPackIds] = useState<string[]>(['kinetic-gas', 'algebra-balance', 'electric-circuits']);
  const [packTitle, setPackTitle] = useState('Classroom Custom STEM Pack');
  const [packDesc, setPackDesc] = useState('Offline interactive laboratory cartridge bundle.');

  // Direct cartridge navigation
  useEffect(() => {
    if (urlPreset) {
      const target = getCartridge(urlPreset);
      if (target && target.id !== activePreset) {
        setActivePreset(target.id);
      }
    }
  }, [urlPreset]);

  const handleSelectPreset = useCallback((id: VectorPresetType) => {
    const canonical = normalizeCartridgeId(id);
    if (!canonical) return;
    setActivePreset(canonical);
    const currentPresetInUrl = searchParams.get('preset');
    if (currentPresetInUrl !== canonical) {
      const next = new URLSearchParams(searchParams);
      next.set('preset', canonical);
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const currentPresetMeta = cartridges.find((p) => p.id === activePreset) || cartridges[0] || {
    id: 'kinetic-gas',
    title: "Kinetic Gas Theory & Boyle's Law",
    stage: 'KS3/KS4 PHYSICS & CHEMISTRY',
    category: 'Science',
    desc: 'Real-time particle kinematics in a compression cylinder',
    icon: '🌡️',
    source: 'builtin'
  };

  const filteredPresets = cartridges.filter((p) => {
    const matchesCategory =
      filterCategory === 'All'
        ? true
        : filterCategory === 'Sim' || filterCategory === 'Slide' || filterCategory === 'App'
        ? (p.type || (['phonics-lab', 'languages', 'fish-tank'].includes(p.id) ? 'App' : ['church-tour', 'photosynthesis', 'water-cycle', 'dna-helix', 'shakespeare', 'fractions', 'times-tables', 'bodmas'].includes(p.id) ? 'Slide' : 'Sim')) === filterCategory
        : filterCategory === 'PhET Distilled'
        ? p.source === 'phet'
        : filterCategory === 'User Created'
        ? p.source === 'user' || p.source === 'imported'
        : p.category === filterCategory;
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
            {/* Physical Dropdown Selector on Simulators */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <label
                htmlFor="main-sim-dropdown-selector"
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: '#94a3b8',
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}
              >
                🎮 Cartridge:
              </label>
              <select
                id="main-sim-dropdown-selector"
                value={activePreset}
                onChange={(e) => handleSelectPreset(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  color: '#ffffff',
                  border: '1.5px solid #0284c7',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                  minWidth: '220px',
                  maxWidth: '340px',
                  pointerEvents: 'auto',
                  userSelect: 'auto',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                }}
                title="Select Simulation, Slide, or App Cartridge"
              >
                <optgroup label="🎮 Simulations (Sim)" style={{ background: '#0f172a', color: '#38bdf8' }}>
                  {cartridges
                    .filter((c) => (c.type === 'Sim' || (!c.type && ['algebra-balance', 'electric-circuits', 'kinetic-gas', 'calculus-curves', 'solar-system', 'atom', 'velocity', 'mountain-elevation', 'math-fishing'].includes(c.id))) && c.source === 'builtin')
                    .map((c) => (
                      <option key={c.id} value={c.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                        {c.icon} {c.title} ({c.stage})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="📑 Interactive Slides (Slide)" style={{ background: '#0f172a', color: '#34d399' }}>
                  {cartridges
                    .filter((c) => (c.type === 'Slide' || (!c.type && ['church-tour', 'photosynthesis', 'water-cycle', 'dna-helix', 'shakespeare', 'fractions', 'times-tables', 'bodmas'].includes(c.id))) && c.source === 'builtin')
                    .map((c) => (
                      <option key={c.id} value={c.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                        {c.icon} {c.title} ({c.stage})
                      </option>
                    ))}
                </optgroup>
                <optgroup label="💻 Vector Applications (App)" style={{ background: '#0f172a', color: '#fbbf24' }}>
                  {cartridges
                    .filter((c) => (c.type === 'App' || (!c.type && ['phonics-lab', 'languages', 'fish-tank'].includes(c.id))) && c.source === 'builtin')
                    .map((c) => (
                      <option key={c.id} value={c.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                        {c.icon} {c.title} ({c.stage})
                      </option>
                    ))}
                </optgroup>
                {cartridges.filter((c) => c.source === 'user' || c.source === 'imported' || c.source === 'phet').length > 0 && (
                  <optgroup label="🧪 Custom & Imported Cartridges" style={{ background: '#0f172a', color: '#a78bfa' }}>
                    {cartridges
                      .filter((c) => c.source === 'user' || c.source === 'imported' || c.source === 'phet')
                      .map((c) => (
                        <option key={c.id} value={c.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                          {c.icon} {c.title} ({c.stage}) [{c.type || 'Sim'}]
                        </option>
                      ))}
                  </optgroup>
                )}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                playerRef.current?.seek(0);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
              title="Reset simulation physics and variables to initial conditions"
            >
              <span>↺</span> Reset Sim
            </button>

            <button
              type="button"
              onClick={() => {
                playerRef.current?.togglePlay();
                setIsSimStopped((prev) => !prev);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
              title="Stop or resume continuous physics simulation"
            >
              <span>{isSimStopped ? '▶' : '⏹'}</span> {isSimStopped ? 'Resume Sim' : 'Stop Sim'}
            </button>

            <span
              style={{
                fontSize: '0.72rem',
                color: '#38bdf8',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '5px 12px',
                borderRadius: '8px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>⚡</span> Live Simulator (PhET / Flash Style)
            </span>
          </div>
        </div>

        {/* Embedded AST Player or Dedicated Interactive Lab Stage */}
        {activePreset === 'mountain-elevation' ? (
          <MountainClimberGame playerRef={playerRef} onCloseGameMode={() => handleSelectPreset('kinetic-gas')} />
        ) : activePreset === 'math-fishing' ? (
          <MathFishingGame playerRef={playerRef} onCloseGameMode={() => handleSelectPreset('kinetic-gas')} />
        ) : activePreset === 'fish-tank' ? (
          <AquariumSimulationLab playerRef={playerRef} onCloseGameMode={() => handleSelectPreset('kinetic-gas')} />
        ) : activePreset === 'shakespeare' ? (
          <div style={{ padding: '16px', background: '#090d16', borderTop: '1px solid #1e293b' }}>
            <ShakespeareGlobeLab onClose={() => handleSelectPreset('kinetic-gas')} />
          </div>
        ) : activePreset === 'languages' ? (
          <div style={{ padding: '16px', background: '#090d16', borderTop: '1px solid #1e293b' }}>
            <MflLanguageLab onClose={() => handleSelectPreset('kinetic-gas')} />
          </div>
        ) : activePreset === 'phonics-lab' ? (
          <div style={{ padding: '16px', background: '#090d16', borderTop: '1px solid #1e293b' }}>
            <EarlyPhonicsLab onClose={() => handleSelectPreset('kinetic-gas')} />
          </div>
        ) : (activePreset === 'bodmas' || activePreset === 'times-tables') ? (
          <div style={{ padding: '16px', background: '#090d16', borderTop: '1px solid #1e293b' }}>
            <MathsFundamentalsLab
              initialTab={activePreset === 'times-tables' ? 'times-tables' : 'bodmas'}
              onClose={() => handleSelectPreset('kinetic-gas')}
            />
          </div>
        ) : (
          <AstVectorMediaPlayer
            ref={playerRef}
            preset={activePreset}
            autoPlay={true}
            allowPresetSwitch={false}
            embedded={true}
            height="min(540px, 60vh)"
            onPresetChange={(newPreset) => handleSelectPreset(newPreset)}
          />
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
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📚 Decentralized Cartridge Library</span>
              <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0284c7', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                {cartridges.length} Cartridges
              </span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Explore built-in STEM labs, import external PhET/Flash simulations, or author your own decentralized cartridges.
            </p>
          </div>

          {/* Decentralized Cartridge Action Toolbar */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setImportStatus(null);
                setImportError(null);
                setShowImportModal(true);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              }}
              title="Import PhET HTML5 bundles, Flash SWF, or AST/SVG capsules directly into local browser storage"
            >
              <span>📥 Import PhET / Cartridge</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCreateTitle('');
                setCreateDesc('');
                setCreateSvg('');
                setCreateAst('');
                setShowCreateModal(true);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.25)',
              }}
              title="Create a new interactive SVG & AST physics simulation"
            >
              <span>➕ Create Cartridge</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPackModal(true)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#6366f1',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(99, 102, 241, 0.25)',
              }}
              title="Bundle multiple cartridges into a single, 100% offline self-executing HTML file for air-gapped schools"
            >
              <span>📦 Build Offline Pack</span>
            </button>
          </div>
        </div>

        {/* Search Input & Category Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search games & cartridges (e.g. pythagoras, circuits)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '6px 12px 6px 30px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                outline: 'none',
                minWidth: '240px',
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
            {['All', 'Sim', 'Slide', 'App', 'Mathematics', 'Science', 'PhET Distilled', 'User Created', 'Games & Simulations', 'Languages & MFL', 'Catholic Faith'].map((cat) => (
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
                {cat === 'Sim' ? '🎮 Sims' : cat === 'Slide' ? '📑 Slides' : cat === 'App' ? '💻 Apps' : cat === 'Languages & MFL' ? '🌍 Languages & MFL' : cat === 'Games & Simulations' ? '🎮 Games & Sims' : cat === 'PhET Distilled' ? '🧪 PhET Distilled' : cat === 'User Created' ? '✨ User Created' : cat}
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
            const isCustom = p.source === 'user' || p.source === 'imported' || p.source === 'phet';
            const cardType = p.type || (['phonics-lab', 'languages', 'fish-tank'].includes(p.id) ? 'App' : ['church-tour', 'photosynthesis', 'water-cycle', 'dna-helix', 'shakespeare', 'fractions', 'times-tables', 'bodmas'].includes(p.id) ? 'Slide' : 'Sim');
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
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: cardType === 'Sim' ? '#e0f2fe' : cardType === 'Slide' ? '#dcfce7' : '#fef3c7',
                          color: cardType === 'Sim' ? '#0369a1' : cardType === 'Slide' ? '#15803d' : '#b45309',
                          border: `1px solid ${cardType === 'Sim' ? '#bae6fd' : cardType === 'Slide' ? '#bbf7d0' : '#fde68a'}`,
                        }}
                      >
                        {cardType === 'Sim' ? '🎮 Sim' : cardType === 'Slide' ? '📑 Slide' : '💻 App'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: p.source === 'phet' ? '#f0fdf4' : p.source === 'user' ? '#fdf2f8' : isSelected ? '#0284c7' : '#f1f5f9',
                          color: p.source === 'phet' ? '#166534' : p.source === 'user' ? '#9d174d' : isSelected ? '#ffffff' : '#475569',
                          border: `1px solid ${p.source === 'phet' ? '#bbf7d0' : p.source === 'user' ? '#fbcfe8' : 'transparent'}`,
                        }}
                      >
                        {p.source === 'phet' ? 'PhET Distilled' : p.source === 'user' ? 'User Authored' : p.source === 'imported' ? 'Imported' : 'Built-in'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: '#f8fafc',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {p.stage}
                      </span>
                    </div>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                    {p.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset(p.id);
                    }}
                    style={{
                      flex: 1,
                      padding: '7px 12px',
                      borderRadius: '6px',
                      background: isSelected ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : '#0f172a',
                      color: '#ffffff',
                      border: isSelected ? '1px solid #38bdf8' : '1px solid #334155',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>⚡</span> {isSelected ? 'Active Simulation' : 'Launch Simulation'}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportSubjectCartridge(p.id);
                    }}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '7px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#334155',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                    title="Download standalone 100% offline HTML cartridge"
                  >
                    💾 Offline
                  </button>

                  {isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete cartridge "${p.title}" from local decentralized storage?`)) {
                          deleteCustomCartridge(p.id);
                        }
                      }}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        padding: '7px 8px',
                        fontSize: '0.72rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                      }}
                      title="Delete this custom cartridge"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. Modal: Import PhET / Flash / Cartridge Package */}
      {showImportModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowImportModal(false)}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '1.5rem',
              color: '#f8fafc',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📥 Import PhET / Flash / Cartridge</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
              Import monolithic PhET simulations (HTML5, SWF, JSON) or custom AST cartridges. They are distilled into zero-cloud <strong style={{ color: '#4ade80' }}>&lt; 4 KB AST S-Expressions</strong> and saved directly to your browser's decentralized IndexedDB/LocalStorage.
            </p>

            {/* Drag & Drop File Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #38bdf8',
                borderRadius: '12px',
                padding: '2rem 1rem',
                textAlign: 'center',
                background: 'rgba(56, 189, 248, 0.05)',
                cursor: 'pointer',
                marginBottom: '1rem',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.phet,.json,.swf,.ast,.svg"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setIsImporting(true);
                  setImportError(null);
                  setImportStatus(null);
                  try {
                    const cart = await importCartridgeFile(file);
                    setImportStatus(`Successfully imported "${cart.title}"! Distilled into ${cart.stage} and stored offline.`);
                    handleSelectPreset(cart.id);
                  } catch (err: any) {
                    setImportError(err?.message || 'Error processing cartridge file.');
                  } finally {
                    setIsImporting(false);
                  }
                }}
              />
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📂</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                {isImporting ? 'Transpiling & Distilling Simulation...' : 'Click or Drag & Drop File Here'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Supports PhET HTML5 (.html, .phet), Flash (.swf), Vector Capsules (.ast.svg), or Cartridge Packages (.json)
              </div>
            </div>

            {/* Quick Benchmark PhET Synthesizers */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                Or 1-Click Import PhET Benchmark Model:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
                {[
                  { id: 'phet-ohms-law', title: "💡 Ohm's Law (V=IR)", cat: 'Science', stage: 'PhET PHYSICS' },
                  { id: 'phet-faraday', title: "🧲 Faraday Induction", cat: 'Science', stage: 'PhET ELECTROMAG' },
                  { id: 'phet-pendulum', title: "⏱️ Pendulum Lab", cat: 'Science', stage: 'PhET HARMONICS' },
                  { id: 'phet-acid-base', title: "🧪 Acid-Base pH", cat: 'Science', stage: 'PhET CHEMISTRY' },
                ].map((bench) => (
                  <button
                    key={bench.id}
                    type="button"
                    onClick={() => {
                      const newCart = createCustomCartridge({
                        title: bench.title,
                        category: bench.cat,
                        stage: bench.stage,
                        desc: `Distilled from PhET monolithic benchmark model into clean 60 FPS vector loop.`,
                      });
                      setImportStatus(`Imported PhET preset: ${bench.title}!`);
                      handleSelectPreset(newCart.id);
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      color: '#cbd5e1',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {bench.title}
                  </button>
                ))}
              </div>
            </div>

            {importStatus && (
              <div style={{ padding: '8px 12px', background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', borderRadius: '8px', color: '#4ade80', fontSize: '0.78rem', marginBottom: '1rem' }}>
                ✓ {importStatus}
              </div>
            )}

            {importError && (
              <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: '8px', color: '#ef4444', fontSize: '0.78rem', marginBottom: '1rem' }}>
                ✕ {importError}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowImportModal(false)}
                style={{ padding: '7px 16px', borderRadius: '6px', background: '#334155', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Create New Cartridge */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              padding: '1.5rem',
              color: '#f8fafc',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>➕ Create Decentralized Cartridge</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Author your own interactive learning manipulative. Saved locally to your decentralized storage without needing to touch server files.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Simulation Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Lever & Moments (F1 × d1 = F2 × d2)"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#ffffff', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Subject Category
                  </label>
                  <select
                    value={createCategory}
                    onChange={(e) => setCreateCategory(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#ffffff', fontSize: '0.82rem', outline: 'none' }}
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science & Physics</option>
                    <option value="Biology">Biology & Nature</option>
                    <option value="English & Drama">English & Drama</option>
                    <option value="Languages & MFL">Languages & MFL</option>
                    <option value="Games & Simulations">Games & Simulations</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                    Key Stage / Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. KS3 PHYSICS"
                    value={createStage}
                    onChange={(e) => setCreateStage(e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#ffffff', fontSize: '0.82rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Educational Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe the mathematical or physical invariant being preserved..."
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#ffffff', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                  Choose Starter Template:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { label: '📐 Geometry Proof', cat: 'Mathematics', desc: 'Area conservation right triangle' },
                    { label: '💡 Circuit Lab', cat: 'Science', desc: "Closed-loop Ohm's law circuit" },
                    { label: '⚖️ Dynamic Balance', cat: 'Mathematics', desc: 'Linear equation balance scale' },
                  ].map((tpl) => (
                    <button
                      key={tpl.label}
                      type="button"
                      onClick={() => {
                        if (!createTitle) setCreateTitle(tpl.label.slice(2).trim());
                        setCreateCategory(tpl.cat);
                        setCreateDesc(tpl.desc);
                      }}
                      style={{
                        padding: '5px 10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: '#cbd5e1',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '7px 16px', borderRadius: '6px', background: '#334155', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!createTitle.trim()) {
                    alert('Please enter a simulation title.');
                    return;
                  }
                  const created = createCustomCartridge({
                    title: createTitle.trim(),
                    category: createCategory,
                    stage: createStage.trim() || 'CUSTOM STEM',
                    desc: createDesc.trim() || 'Decentralized interactive vector simulation.',
                    svgMarkup: createSvg || undefined,
                    astSource: createAst || undefined,
                  });
                  setShowCreateModal(false);
                  handleSelectPreset(created.id);
                }}
                style={{ padding: '7px 18px', borderRadius: '6px', background: '#10b981', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Save & Launch Cartridge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Build Multi-Lesson Offline Cartridge Pack */}
      {showPackModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setShowPackModal(false)}
        >
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '1.5rem',
              color: '#f8fafc',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📦 Build Offline Air-Gapped Cartridge Pack</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPackModal(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Select ANY combination of built-in, PhET-imported, or user-authored cartridges to export into a single, self-contained HTML file (&lt; 75 KB) for air-gapped classrooms.
            </p>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '4px' }}>
                Pack Title
              </label>
              <input
                type="text"
                value={packTitle}
                onChange={(e) => setPackTitle(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', background: '#1e293b', border: '1px solid #475569', color: '#ffffff', fontSize: '0.82rem', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                Select Cartridges to Include ({selectedPackIds.length} selected):
              </label>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #334155', borderRadius: '8px', padding: '6px', background: '#1e293b' }}>
                {cartridges.map((c) => {
                  const isChecked = selectedPackIds.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        color: isChecked ? '#ffffff' : '#cbd5e1',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedPackIds(selectedPackIds.filter((id) => id !== c.id));
                          } else {
                            setSelectedPackIds([...selectedPackIds, c.id]);
                          }
                        }}
                      />
                      <span>{c.icon}</span>
                      <strong style={{ flex: 1 }}>{c.title}</strong>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>({c.category})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowPackModal(false)}
                style={{ padding: '7px 16px', borderRadius: '6px', background: '#334155', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedPackIds.length === 0) {
                    alert('Please select at least 1 cartridge.');
                    return;
                  }
                  const chosenScenes = selectedPackIds.map((id) => {
                    const cart = cartridges.find((c) => c.id === id);
                    return {
                      id,
                      title: cart?.title || id,
                      category: cart?.category || 'STEM',
                      svgMarkup: cart?.svgMarkup,
                      astSource: cart?.astSource,
                    };
                  });
                  exportCustomCartridgeBundle(chosenScenes, packTitle, packDesc, `stj-cartridge-pack.html`);
                  setShowPackModal(false);
                }}
                style={{ padding: '7px 18px', borderRadius: '6px', background: '#6366f1', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Download Offline HTML Pack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
