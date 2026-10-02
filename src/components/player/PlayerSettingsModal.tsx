// src/components/player/PlayerSettingsModal.tsx
/**
 * Player Settings & Display Configuration Drawer
 * Manages teaching profile presets (Classroom, Student, Broadcast, Developer)
 * and granular UI toggle options for the media player.
 */

import React from 'react';
import {
  PlayerDisplayMode,
  PlayerDisplayConfig,
  getPresetConfig,
  savePlayerConfig,
  MODE_METADATA,
} from '../../types/playerConfig';

export interface PlayerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  displayConfig: PlayerDisplayConfig;
  setDisplayConfig: React.Dispatch<React.SetStateAction<PlayerDisplayConfig>>;
  postToPlayer: (payload: Record<string, any>) => void;
}

export const PlayerSettingsModal: React.FC<PlayerSettingsModalProps> = ({
  isOpen,
  onClose,
  displayConfig,
  setDisplayConfig,
  postToPlayer,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        background: 'var(--stj-surface-raised)',
        borderBottom: '1px solid var(--stj-border)',
        padding: '16px 20px',
        color: 'var(--stj-text)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      {/* Settings Drawer Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚙️</span>
            <strong style={{ fontSize: '0.95rem' }}>Player Display &amp; Controls Configuration</strong>
            <span
              className="stj-badge stj-badge-primary stj-pill"
              style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}
            >
              {displayConfig.mode} MODE
            </span>
          </div>
          <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--stj-text-muted)' }}>
            Select a profile preset or customize individual links so only required controls are shown.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => {
              const def = getPresetConfig('classroom');
              setDisplayConfig(def);
              savePlayerConfig(def);
              postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: def });
            }}
            className="stj-btn stj-btn-ghost stj-btn-sm"
            style={{ fontSize: '0.74rem' }}
            title="Reset all settings to Classroom Mode default"
          >
            ↺ Reset to Classroom Mode
          </button>
          <button
            type="button"
            onClick={onClose}
            className="stj-btn stj-btn-secondary stj-btn-sm"
            style={{ fontSize: '0.74rem', minWidth: '32px' }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Quick Preset Mode Cards */}
      <div>
        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stj-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
          Select Teaching &amp; Viewing Profile
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
          }}
        >
          {(['classroom', 'student', 'broadcast', 'developer'] as PlayerDisplayMode[]).map((m) => {
            const meta = MODE_METADATA[m];
            const isActive = displayConfig.mode === m;
            return (
              <div
                key={m}
                onClick={() => {
                  const newCfg = getPresetConfig(m);
                  setDisplayConfig(newCfg);
                  savePlayerConfig(newCfg);
                  postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: newCfg });
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: isActive ? '2px solid var(--stj-primary)' : '1px solid var(--stj-border)',
                  background: isActive ? 'var(--stj-primary-surface)' : 'var(--stj-surface)',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '0.84rem', color: isActive ? 'var(--stj-primary)' : 'var(--stj-text)' }}>
                    {meta.icon} {meta.label}
                  </strong>
                  {isActive && <span style={{ fontSize: '0.72rem', color: 'var(--stj-primary)', fontWeight: 800 }}>✓ ACTIVE</span>}
                </div>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 700,
                    color: 'var(--stj-text-muted)',
                    letterSpacing: '0.04em',
                  }}
                >
                  {meta.tag}
                </span>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--stj-text-muted)', lineHeight: 1.35 }}>
                  {meta.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Granular Control Toggles Accordion */}
      <div style={{ borderTop: '1px solid var(--stj-border)', paddingTop: '10px' }}>
        <details style={{ cursor: 'pointer' }}>
          <summary style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--stj-primary)', marginBottom: '8px' }}>
            🎛️ Granular Control Toggles (Customize individual links &amp; buttons)
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '10px' }}>
            <div>
              <strong style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '8px' }}>
                Header &amp; Action Links
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { key: 'showPresetSelector', label: 'Curriculum Preset Selector' },
                  { key: 'showDevInspect', label: '🛠️ SVG Element Inspector' },
                  { key: 'showDevStudio', label: '💻 Live Code Studio' },
                  { key: 'showExportSpa', label: '🚀 Standalone SVG SPA Export' },
                  { key: 'showStandaloneLink', label: '↗ Standalone Window Button' },
                  { key: 'showPipButton', label: '📺 Document Picture-in-Picture & Floating Player' },
                  { key: 'showObsLink', label: '📡 OBS Broadcast WebSocket Link' },
                  { key: 'showLmsEmbed', label: '🔗 LMS Embed Code Generator' },
                  { key: 'showPrintWorksheet', label: '🖨️ A4 Classroom Worksheet' },
                  { key: 'showCopySvg', label: '📋 Copy Raw SVG Geometry' },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(displayConfig[key as keyof PlayerDisplayConfig])}
                      onChange={(e) => {
                        const updated: PlayerDisplayConfig = {
                          ...displayConfig,
                          mode: 'custom',
                          [key]: e.target.checked,
                        };
                        setDisplayConfig(updated);
                        savePlayerConfig(updated);
                        postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: updated });
                      }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <strong style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '8px' }}>
                Learning, 3D &amp; Playback Features
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { key: 'showInteractiveCheckpoints', label: '🎯 Checkpoint Active Recall Quizzes' },
                  { key: 'show3DControls', label: '🌐 3D Spatial Orbit & Camera Toolbar' },
                  { key: 'showSubtitles', label: '💬 Synchronized Subtitles Overlay' },
                  { key: 'showVoiceNarration', label: '🔊 Voice Narration (Web Speech)' },
                  { key: 'showTimelineScrubber', label: '⏱️ Timeline Scrubber Track' },
                  { key: 'showSpeedSelector', label: '⏩ Playback Speed Selector' },
                  { key: 'showLanguageSelector', label: '🌍 Multi-Language Selector' },
                  { key: 'showLoopToggle', label: '🔁 Auto-Repeat Loop Toggle' },
                  { key: 'showVolumeControl', label: '🔊 Master Volume & Mute Controls' },
                  { key: 'showPhysicsControls', label: '🪐 Micro-Physics & Gravity Subsystem' },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(displayConfig[key as keyof PlayerDisplayConfig])}
                      onChange={(e) => {
                        const updated: PlayerDisplayConfig = {
                          ...displayConfig,
                          mode: 'custom',
                          [key]: e.target.checked,
                        };
                        setDisplayConfig(updated);
                        savePlayerConfig(updated);
                        postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: updated });
                      }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default PlayerSettingsModal;
