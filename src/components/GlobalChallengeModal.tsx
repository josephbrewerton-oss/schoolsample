// src/components/GlobalChallengeModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  subscribeToChallengeCalls,
  closeChallengeModal,
  ChallengeCallOptions,
} from '../services/challengeLauncher';
import MathFishingGame from './MathFishingGame';
import { MountainClimberGame } from './MountainClimberGame';
import FirstCommunionMasteryLab from './FirstCommunionMasteryLab';
import NeuralLabCanvas from './NeuralLabCanvas';
import ShakespeareGlobeLab from './ShakespeareGlobeLab';
import AstVectorMediaPlayer, { AstVectorMediaPlayerHandle } from './AstVectorMediaPlayer';

export default function GlobalChallengeModal(): React.JSX.Element | null {
  const [callOptions, setCallOptions] = useState<ChallengeCallOptions | null>(null);
  const dummyPlayerRef = useRef<AstVectorMediaPlayerHandle | null>(null);

  useEffect(() => {
    const unsub = subscribeToChallengeCalls((options) => {
      setCallOptions(options);
    });
    return unsub;
  }, []);

  // Listen to Escape key to close modal
  useEffect(() => {
    if (!callOptions) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeChallengeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callOptions]);

  if (!callOptions) return null;

  const { challenge } = callOptions;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={challenge.title}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(9, 13, 22, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeChallengeModal();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: challenge.type === 'liturgy-sequence' ? '1100px' : '960px',
          background: '#090d16',
          border: '1.5px solid #334155',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(2, 132, 199, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh',
        }}
      >
        {/* Modal Top Navigation Bar */}
        <div
          style={{
            padding: '12px 18px',
            background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
            borderBottom: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{challenge.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: challenge.badgeColor,
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {challenge.badge}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {challenge.subject} &bull; {challenge.unit}
                </span>
              </div>
              <h2
                style={{
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  margin: '2px 0 0',
                }}
              >
                {challenge.title}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={closeChallengeModal}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease',
              }}
              aria-label="Close Challenge"
            >
              <span>✕</span>
              <span>Close ESC</span>
            </button>
          </div>
        </div>

        {/* Modal Description Sub-banner */}
        <div
          style={{
            padding: '8px 18px',
            background: 'rgba(2, 132, 199, 0.08)',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
            fontSize: '0.84rem',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🎯</span>
          <span>{challenge.description}</span>
        </div>

        {/* Modal Scrollable Interactive Viewport */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            background: '#090d16',
          }}
        >
          {challenge.type === 'math-fishing' && (
            <MathFishingGame onCloseGameMode={closeChallengeModal} />
          )}

          {challenge.type === 'mountain-climber' && (
            <MountainClimberGame
              playerRef={dummyPlayerRef}
              onCloseGameMode={closeChallengeModal}
            />
          )}

          {challenge.type === 'liturgy-sequence' && (
            <div style={{ background: '#ffffff', borderRadius: '12px', overflow: 'hidden' }}>
              <FirstCommunionMasteryLab />
            </div>
          )}

          {challenge.type === 'neural-logic' && (
            <div style={{ background: '#0b1120', borderRadius: '12px', padding: '8px' }}>
              <NeuralLabCanvas
                initialKeyStage={challenge.keyStage}
                initialSubject={challenge.subject}
                initialUnit={challenge.unit}
              />
            </div>
          )}

          {challenge.type === 'shakespeare-theatre' && (
            <ShakespeareGlobeLab onClose={closeChallengeModal} />
          )}

          {challenge.type === 'vector-lab' && (
            <div style={{ minHeight: '520px' }}>
              <AstVectorMediaPlayer
                preset={challenge.preset || 'fractions'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
