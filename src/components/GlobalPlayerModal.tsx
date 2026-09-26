// src/components/GlobalPlayerModal.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AstVectorMediaPlayer from './AstVectorMediaPlayer';
import {
  subscribeToPlayerCalls,
  closePlayerModal,
  PlayerCallOptions,
} from '../services/playerLauncher';

export default function GlobalPlayerModal(): React.JSX.Element | null {
  const [callOptions, setCallOptions] = useState<PlayerCallOptions | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = subscribeToPlayerCalls((options) => {
      setCallOptions(options);
    });
    return unsub;
  }, []);

  // Listen to Escape key to close modal
  useEffect(() => {
    if (!callOptions) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePlayerModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callOptions]);

  if (!callOptions) return null;

  const handleOpenFullPage = () => {
    const targetPreset = callOptions.preset || 'fractions';
    closePlayerModal();
    navigate(`/player?preset=${encodeURIComponent(targetPreset)}`);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(9, 13, 22, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closePlayerModal();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          background: '#090d16',
          border: '1px solid #334155',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '12px 18px',
            background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
            borderBottom: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🎬</span>
            <span style={{ color: '#f8fafc', fontWeight: 800, fontSize: '0.95rem' }}>
              {callOptions.title || 'AST Vector Media Player'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleOpenFullPage}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title="Open full standalone player page"
            >
              ⛶ Open Full Page
            </button>

            <button
              type="button"
              onClick={closePlayerModal}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                fontSize: '1.4rem',
                cursor: 'pointer',
                lineHeight: 1,
                padding: '4px 8px',
              }}
              title="Close Player (Esc)"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Modal Body - AST Vector Media Player */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <AstVectorMediaPlayer
            preset={callOptions.preset || 'fractions'}
            autoPlay={callOptions.autoPlay ?? true}
            lang={callOptions.lang}
            allowPresetSwitch={true}
            height="520px"
          />
        </div>
      </div>
    </div>
  );
}
