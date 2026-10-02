// src/components/player/PlayerEmbedModal.tsx
/**
 * Player LMS Embed Code Drawer
 * Generates copy-pasteable responsive iframe snippets for Canvas, Moodle, Google Classroom
 */

import React from 'react';
import { PlayerDisplayMode } from '../../types/playerConfig';

export interface PlayerEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  embedTargetMode: PlayerDisplayMode;
  setEmbedTargetMode: (mode: PlayerDisplayMode) => void;
  copiedEmbed: boolean;
  onCopyEmbedCode: () => void;
  embedCode: string;
}

export const PlayerEmbedModal: React.FC<PlayerEmbedModalProps> = ({
  isOpen,
  embedTargetMode,
  setEmbedTargetMode,
  copiedEmbed,
  onCopyEmbedCode,
  embedCode,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        background: 'var(--stj-surface-raised)',
        borderBottom: '1px solid var(--stj-border)',
        padding: '12px 16px',
        fontSize: '0.82rem',
        color: 'var(--stj-text)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600 }}>Embed for Canvas, Moodle, or Google Classroom:</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>Target Audience:</span>
            <select
              value={embedTargetMode}
              onChange={(e) => setEmbedTargetMode(e.target.value as PlayerDisplayMode)}
              className="stj-select"
              style={{ padding: '2px 6px', fontSize: '0.74rem', minHeight: '26px' }}
            >
              <option value="classroom">🎓 Classroom (Clean Whiteboard)</option>
              <option value="student">🎒 Student Focus (Distraction-Free)</option>
              <option value="developer">🛠️ Developer (Full Suite)</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={onCopyEmbedCode}
          className={`stj-btn ${copiedEmbed ? 'stj-btn-success' : 'stj-btn-primary'} stj-btn-sm`}
          style={{ minHeight: '28px', padding: '3px 9px' }}
        >
          {copiedEmbed ? '✓ Copied!' : 'Copy Code'}
        </button>
      </div>
      <code
        style={{
          display: 'block',
          background: 'var(--stj-canvas)',
          border: '1px solid var(--stj-border)',
          padding: '8px',
          borderRadius: 'var(--stj-radius-sm)',
          fontSize: '0.74rem',
          color: 'var(--stj-primary)',
          overflowX: 'auto',
          wordBreak: 'break-all',
          fontFamily: 'monospace',
        }}
      >
        {embedCode}
      </code>
    </div>
  );
};

export default PlayerEmbedModal;
