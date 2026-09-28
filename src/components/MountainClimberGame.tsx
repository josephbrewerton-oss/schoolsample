// src/components/MountainClimberGame.tsx
/**
 * St Joseph's Mountain Altitude & Hypotenuse Climber Game
 * 
 * An interactive, playable expedition simulation that pairs active player controls
 * (Keyboard ArrowUp/Space or Touch Buttons) with the AST Vector Media Player.
 * 
 * Pupils physically guide the climber to the 3,000m summit while observing
 * real-time trigonometry (hypotenuse vs vertical altitude), oxygen drop, and stamina management.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AstVectorMediaPlayerHandle } from './AstVectorMediaPlayer';

export interface MountainClimberGameProps {
  playerRef: React.RefObject<AstVectorMediaPlayerHandle | null>;
  onCloseGameMode?: () => void;
}

export const MountainClimberGame: React.FC<MountainClimberGameProps> = ({
  playerRef,
  onCloseGameMode,
}) => {
  // Game state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0.0); // 0.0 to 1.0
  const [stamina, setStamina] = useState<number>(100); // 0 to 100
  const [oxygenBottles, setOxygenBottles] = useState<number>(3);
  const [heartRate, setHeartRate] = useState<number>(75); // bpm
  const [isAxeAnchored, setIsAxeAnchored] = useState<boolean>(false);
  const [stepsTaken, setStepsTaken] = useState<number>(0);
  const [gameTimeSec, setGameTimeSec] = useState<number>(0);
  const [weatherEvent, setWeatherEvent] = useState<string | null>(null);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [isExhausted, setIsExhausted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const staminaRef = useRef(stamina);
  staminaRef.current = stamina;
  const isAxeAnchoredRef = useRef(isAxeAnchored);
  isAxeAnchoredRef.current = isAxeAnchored;
  const hasWonRef = useRef(hasWon);
  hasWonRef.current = hasWon;

  // Sound generator via Web Audio API
  const playSfx = useCallback((type: 'step' | 'rest' | 'axe' | 'oxygen' | 'slip' | 'win') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'step') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140 + Math.random() * 30, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'rest') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else if (type === 'axe') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
      } else if (type === 'oxygen') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else if (type === 'slip') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.36);
      } else if (type === 'win') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.12);
          osc.stop(ctx.currentTime + i * 0.12 + 0.45);
        });
      }
    } catch {
      // Audio context policy fallback
    }
  }, [soundEnabled]);

  // Pause the player's automatic video clock on mount so the user has full physical control
  useEffect(() => {
    playerRef.current?.pause();
    playerRef.current?.seek(0.0);
  }, [playerRef]);

  // Periodic game tick: handles passive stamina recovery when resting, heart rate decay, and game timer
  useEffect(() => {
    if (!isPlaying || hasWon) return;

    const interval = setInterval(() => {
      setGameTimeSec((prev) => prev + 1);

      // Passive stamina recovery (faster if stamina is low)
      setStamina((prev) => {
        if (prev < 100) {
          const next = Math.min(100, prev + 2.5);
          if (next >= 20 && isExhausted) setIsExhausted(false);
          return next;
        }
        return prev;
      });

      // Heart rate recovery towards baseline (75 bpm)
      setHeartRate((prev) => {
        if (prev > 75) return Math.max(75, prev - 2);
        return prev;
      });

      // Random mountain wind gust check every ~12 seconds
      if (Math.random() < 0.08 && progressRef.current > 0.4 && !isAxeAnchoredRef.current) {
        setWeatherEvent('💨 Sudden Alpine Wind Gust! Footing shaken!');
        playSfx('slip');
        const slipAmount = 0.015;
        const newProg = Math.max(0, progressRef.current - slipAmount);
        setProgress(newProg);
        playerRef.current?.seek(newProg);
        setTimeout(() => setWeatherEvent(null), 3000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, hasWon, isExhausted, playerRef, playSfx]);

  // Primary Action: Take Step / Climb
  const handleTakeStep = useCallback(() => {
    if (hasWonRef.current || isExhausted) return;

    if (staminaRef.current <= 5) {
      setIsExhausted(true);
      setWeatherEvent('⚠️ Exhausted! Rest to catch your breath!');
      playSfx('slip');
      setTimeout(() => setWeatherEvent(null), 2500);
      return;
    }

    const currentT = progressRef.current;
    // Step size: slightly smaller as slope steepens near summit
    const stepSize = currentT > 0.7 ? 0.018 : 0.024;
    const nextT = Math.min(1.0, currentT + stepSize);

    // Stamina drain increases with altitude
    const staminaDrain = currentT > 0.7 ? 5.5 : 3.5;
    setStamina((prev) => Math.max(0, prev - staminaDrain));
    setHeartRate((prev) => Math.min(185, prev + 4));
    setStepsTaken((prev) => prev + 1);
    setProgress(nextT);
    setIsAxeAnchored(false); // Moving un-anchors the axe
    playSfx('step');

    // Live seek the AST Vector Media Player
    playerRef.current?.seek(nextT);

    // Check Summit Win
    if (nextT >= 0.99 && !hasWonRef.current) {
      setHasWon(true);
      playSfx('win');
    }
  }, [isExhausted, playerRef, playSfx]);

  // Secondary Action: Rest & Catch Breath
  const handleRest = useCallback(() => {
    if (hasWonRef.current) return;
    setStamina((prev) => Math.min(100, prev + 18));
    setHeartRate((prev) => Math.max(75, prev - 12));
    setIsExhausted(false);
    playSfx('rest');
  }, [playSfx]);

  // Secondary Action: Plant Ice Axe (Anchors footing against wind and slips)
  const handlePlantAxe = useCallback(() => {
    if (hasWonRef.current) return;
    setIsAxeAnchored((prev) => !prev);
    playSfx('axe');
  }, [playSfx]);

  // Action: Oxygen Boost
  const handleOxygenBoost = useCallback(() => {
    if (hasWonRef.current || oxygenBottles <= 0) return;
    setOxygenBottles((prev) => prev - 1);
    setStamina(100);
    setHeartRate((prev) => Math.max(75, prev - 25));
    setIsExhausted(false);
    setWeatherEvent('💨 Pure O2 Inhaled! Energy Restored to 100%!');
    playSfx('oxygen');
    setTimeout(() => setWeatherEvent(null), 3000);
  }, [hasWonRef, oxygenBottles, playSfx]);

  // Keyboard navigation binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleTakeStep();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleRest();
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handlePlantAxe();
      } else if (e.key === 'o' || e.key === 'O' || e.key === '2') {
        e.preventDefault();
        handleOxygenBoost();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTakeStep, handleRest, handlePlantAxe, handleOxygenBoost]);

  // Calculated telemetry
  const altitudeM = Math.round(progress * 3000);
  const slopeDistM = Math.round(progress * 3256);
  const baseDistM = Math.round(progress * 2200);
  const temperatureC = (20.0 - progress * 3000 * 0.0065).toFixed(1);
  const oxygenPct = Math.round(100 - progress * 28); // 100% down to 72%

  // Current expedition stage title
  const currentStageName =
    progress < 0.25
      ? '🌲 Stage 1: Base Camp Foothills'
      : progress < 0.55
      ? '🧗 Stage 2: Ridge & Camp 1 (1,500m)'
      : progress < 0.85
      ? '❄️ Stage 3: The Ice Shelf & Glacial Moraine (2,400m)'
      : '🏔️ Stage 4: Summit Arête (3,000m)';

  const resetGame = () => {
    setProgress(0);
    setStamina(100);
    setOxygenBottles(3);
    setHeartRate(75);
    setIsAxeAnchored(false);
    setStepsTaken(0);
    setGameTimeSec(0);
    setHasWon(false);
    setIsExhausted(false);
    playerRef.current?.seek(0.0);
  };

  return (
    <div
      style={{
        background: '#090d16',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '1.25rem',
        color: '#f8fafc',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
        marginTop: '1.25rem',
      }}
    >
      {/* Top Game Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '12px',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🧗</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#0284c7',
                  color: '#ffffff',
                }}
              >
                PLAYABLE EXPEDITION
              </span>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Active Student Physics &amp; Trigonometry Controller
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0', color: '#f8fafc' }}>
              {currentStageName}
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: soundEnabled ? '#38bdf8' : '#64748b',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Toggle Web Audio SFX"
          >
            {soundEnabled ? '🔊 Audio ON' : '🔇 Audio Muted'}
          </button>
          <button
            type="button"
            onClick={resetGame}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ↺ Restart Climb
          </button>
          {onCloseGameMode && (
            <button
              type="button"
              onClick={onCloseGameMode}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                background: '#1e293b',
                color: '#94a3b8',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ✕ Exit Game Mode
            </button>
          )}
        </div>
      </div>

      {/* Weather Banner Alert */}
      {weatherEvent && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '8px 12px',
            marginBottom: '14px',
            color: '#fca5a5',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{weatherEvent}</span>
          <span style={{ fontSize: '0.75rem', color: '#f87171' }}>Use [A] Ice Axe to anchor!</span>
        </div>
      )}

      {/* Real-Time Mathematical Telemetry Gauges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '10px',
          marginBottom: '16px',
        }}
      >
        {/* True Vertical Altitude */}
        <div style={{ background: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>VERTICAL ALTITUDE (h)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399', margin: '2px 0' }}>
            {altitudeM} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ 3000 m</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Opposite side of triangle</div>
        </div>

        {/* Slope Distance (Hypotenuse) */}
        <div style={{ background: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 800 }}>WALKING DISTANCE (c)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fbbf24', margin: '2px 0' }}>
            {slopeDistM} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ 3256 m</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Hypotenuse (Slope path)</div>
        </div>

        {/* Horizontal Base Distance */}
        <div style={{ background: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800 }}>HORIZONTAL BASE (x)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0ea5e9', margin: '2px 0' }}>
            {baseDistM} <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/ 2200 m</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Adjacent ground run</div>
        </div>

        {/* Stamina & Energy */}
        <div style={{ background: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 800 }}>STAMINA</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: stamina > 30 ? '#f43f5e' : '#f87171' }}>
              {Math.round(stamina)}%
            </span>
          </div>
          <div style={{ background: '#1e293b', height: '8px', borderRadius: '4px', overflow: 'hidden', margin: '8px 0 4px' }}>
            <div
              style={{
                width: `${stamina}%`,
                height: '100%',
                background: stamina > 50 ? '#10b981' : stamina > 20 ? '#f59e0b' : '#ef4444',
                transition: 'width 0.15s ease',
              }}
            />
          </div>
          <div style={{ fontSize: '0.68rem', color: isExhausted ? '#f87171' : '#64748b' }}>
            {isExhausted ? 'Exhausted! Rest now!' : 'Press [Rest] to recover'}
          </div>
        </div>

        {/* Heart Rate & Temp */}
        <div style={{ background: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #1e293b' }}>
          <div style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 800 }}>HEART RATE &amp; TEMP</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: heartRate > 150 ? '#f87171' : '#c084fc', margin: '2px 0' }}>
            {heartRate} <span style={{ fontSize: '0.75rem' }}>BPM</span> &bull; {temperatureC}°C
          </div>
          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Lapse: -6.5°C / 1,000m</div>
        </div>
      </div>

      {/* Main Interactive Control Console */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '12px',
          padding: '14px',
          border: '1px solid #334155',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Physical Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* STEP CLIMB BUTTON */}
          <button
            type="button"
            onClick={handleTakeStep}
            disabled={hasWon || isExhausted}
            style={{
              padding: '12px 22px',
              borderRadius: '10px',
              border: 'none',
              background: isExhausted
                ? '#475569'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isExhausted || hasWon ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isExhausted ? 'none' : '0 4px 14px rgba(16, 185, 129, 0.4)',
              transform: 'scale(1)',
              transition: 'all 0.1s ease',
            }}
          >
            <span>▲</span>
            <span>CLIMB STEP</span>
            <kbd
              style={{
                fontSize: '0.65rem',
                background: 'rgba(0,0,0,0.25)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              SPACE / ↑
            </kbd>
          </button>

          {/* REST & BREATHE BUTTON */}
          <button
            type="button"
            onClick={handleRest}
            disabled={hasWon}
            style={{
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1px solid #334155',
              background: '#0f172a',
              color: '#38bdf8',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: hasWon ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🧘</span>
            <span>Rest &amp; Breathe</span>
            <kbd
              style={{
                fontSize: '0.65rem',
                background: 'rgba(255,255,255,0.1)',
                padding: '2px 5px',
                borderRadius: '4px',
                color: '#cbd5e1',
              }}
            >
              ↓
            </kbd>
          </button>

          {/* ANCHOR ICE AXE BUTTON */}
          <button
            type="button"
            onClick={handlePlantAxe}
            disabled={hasWon}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: `1px solid ${isAxeAnchored ? '#f59e0b' : '#334155'}`,
              background: isAxeAnchored ? 'rgba(245, 158, 11, 0.2)' : '#0f172a',
              color: isAxeAnchored ? '#fbbf24' : '#cbd5e1',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: hasWon ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⛏️</span>
            <span>{isAxeAnchored ? 'Axe Anchored! (Protected)' : 'Plant Ice Axe'}</span>
            <kbd
              style={{
                fontSize: '0.65rem',
                background: 'rgba(255,255,255,0.1)',
                padding: '2px 5px',
                borderRadius: '4px',
                color: '#cbd5e1',
              }}
            >
              A
            </kbd>
          </button>

          {/* OXYGEN BOTTLE BUTTON */}
          <button
            type="button"
            onClick={handleOxygenBoost}
            disabled={hasWon || oxygenBottles <= 0}
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #334155',
              background: oxygenBottles > 0 ? '#0f172a' : '#1e293b',
              color: oxygenBottles > 0 ? '#a855f7' : '#64748b',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: oxygenBottles > 0 ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>💨</span>
            <span>Oxygen Boost ({oxygenBottles})</span>
            <kbd
              style={{
                fontSize: '0.65rem',
                background: 'rgba(255,255,255,0.1)',
                padding: '2px 5px',
                borderRadius: '4px',
                color: '#cbd5e1',
              }}
            >
              O
            </kbd>
          </button>
        </div>

        {/* Live Mathematical Verification Box */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '8px 12px',
            border: '1px solid #334155',
            fontSize: '0.78rem',
            color: '#cbd5e1',
            minWidth: '220px',
          }}
        >
          <div style={{ fontWeight: 800, color: '#f59e0b', marginBottom: '2px' }}>
            📐 Live Trigonometry Rule:
          </div>
          <div>
            Slope Distance: <strong style={{ color: '#fbbf24' }}>{slopeDistM}m</strong> (Walking)
          </div>
          <div>
            Vertical Rise: <strong style={{ color: '#34d399' }}>{altitudeM}m</strong> (Straight Up)
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '2px' }}>
            sin(θ) = 3000 / 3256 ≈ 0.92
          </div>
        </div>
      </div>

      {/* Summit Victory Modal Overlay */}
      {hasWon && (
        <div
          style={{
            marginTop: '16px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(2, 132, 199, 0.2) 100%)',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>🏆 🏔️ 🧗</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#34d399', margin: '0 0 6px' }}>
            SUMMIT REACHED! 3,000m CONQUERED!
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#f8fafc', maxWidth: '600px', margin: '0 auto 12px' }}>
            Outstanding expedition! You paced your stamina, handled the thinning atmospheric pressure,
            and mathematically proved the difference between walking distance along the hypotenuse
            (<strong>3,256m</strong>) and true vertical elevation (<strong>3,000m</strong>).
          </p>
          <div
            style={{
              display: 'inline-flex',
              gap: '16px',
              background: '#090d16',
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #334155',
              fontSize: '0.8rem',
              marginBottom: '14px',
            }}
          >
            <div>
              <span style={{ color: '#94a3b8' }}>Steps:</span> <strong>{stepsTaken}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Expedition Time:</span> <strong>{gameTimeSec}s</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Final Temp:</span> <strong>-0.5°C</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Pythagoras Check:</span>{' '}
              <strong style={{ color: '#38bdf8' }}>2200² + 3000² ≈ 3256²</strong>
            </div>
          </div>
          <div>
            <button
              type="button"
              onClick={resetGame}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#10b981',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Play Again / Speedrun ➜
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MountainClimberGame;
