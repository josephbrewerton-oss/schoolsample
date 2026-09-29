// src/components/MathsFishingGame.tsx
/**
 * St Joseph's Number Bonds Fishing Adventure
 * 
 * An interactive, playable mathematics game built for Early Years, KS1, and KS2.
 * Pupils cast their fishing hook into the water to catch numbered fish that add up to a target sum
 * (e.g. Number Bonds to 10: 4 + 6 = 10, Number Bonds to 20, or Multiples).
 * 
 * Educational Pedagogy:
 * - Concrete to Pictorial to Abstract (CPA) Singapore Maths framework.
 * - Kinesthetic positive reinforcement with Web Audio synthesizer chimes.
 * - Scripture connection: St. Peter & The Miraculous Catch ("Cast your net on the right side" - John 21:6).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface MathsFishingGameProps {
  onCloseGameMode?: () => void;
}

interface FishEntity {
  id: number;
  value: number;
  x: number;
  y: number;
  vx: number;
  color: string;
  size: number;
  direction: 1 | -1;
  isCaught: boolean;
}

const FISH_PALETTES = [
  { fill: '#f97316', stroke: '#ea580c', badge: '#ffedd5', text: '#9a3412' }, // Orange Clownfish
  { fill: '#0284c7', stroke: '#0369a1', badge: '#e0f2fe', text: '#0369a1' }, // Blue Tang
  { fill: '#eab308', stroke: '#ca8a04', badge: '#fef9c3', text: '#854d0e' }, // Yellow Snapper
  { fill: '#ec4899', stroke: '#db2777', badge: '#fce7f3', text: '#9d174d' }, // Pink Guppy
  { fill: '#10b981', stroke: '#059669', badge: '#d1fae5', text: '#065f46' }, // Emerald Minnow
  { fill: '#8b5cf6', stroke: '#7c3aed', badge: '#ede9fe', text: '#5b21b6' }, // Purple Bass
];

export const MathsFishingGame: React.FC<MathsFishingGameProps> = ({ onCloseGameMode }) => {
  // Game mode & target
  const [level, setLevel] = useState<'bonds10' | 'bonds20' | 'multiples5'>('bonds10');
  const [targetSum, setTargetSum] = useState<number>(10);
  const [caughtFish, setCaughtFish] = useState<FishEntity[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' }>({
    text: 'Cast your line to catch numbers that add up to the Target!',
    type: 'info',
  });

  // Hook & Line State
  const [hookX, setHookX] = useState<number>(400); // 100 to 700
  const [hookY, setHookY] = useState<number>(130); // 130 (surface) to 430 (deep)
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [isReeling, setIsReeling] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Fish School State
  const [fishList, setFishList] = useState<FishEntity[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const hookXRef = useRef(hookX);
  hookXRef.current = hookX;
  const hookYRef = useRef(hookY);
  hookYRef.current = hookY;
  const isCastingRef = useRef(isCasting);
  isCastingRef.current = isCasting;
  const isReelingRef = useRef(isReeling);
  isReelingRef.current = isReeling;

  // Web Audio Synthesizer
  const playSound = useCallback((type: 'cast' | 'catch' | 'win' | 'miss') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'cast') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else if (type === 'catch') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      } else if (type === 'win') {
        const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
        chord.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          g.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + idx * 0.08);
          o.stop(ctx.currentTime + idx * 0.08 + 0.36);
        });
      } else if (type === 'miss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.setValueAtTime(220, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.31);
      }
    } catch (_) {}
  }, [soundEnabled]);

  // Generate a balanced school of fish based on current target
  const spawnFishSchool = useCallback((target: number, currentSum: number) => {
    const needed = target - currentSum;
    const pool: number[] = [];

    // Always ensure at least one or two fish can solve the equation!
    if (needed > 0 && needed <= 10) {
      pool.push(needed, needed);
    }

    // Add plausible companion numbers
    for (let i = 1; i <= 9; i++) {
      if (i !== needed) pool.push(i);
    }

    const newFish: FishEntity[] = [];
    const count = 8;

    for (let i = 0; i < count; i++) {
      const val = pool[Math.floor(Math.random() * pool.length)];
      const dir: 1 | -1 = Math.random() > 0.5 ? 1 : -1;
      const palette = FISH_PALETTES[i % FISH_PALETTES.length];

      newFish.push({
        id: Date.now() + i,
        value: val,
        x: 60 + Math.random() * 680,
        y: 190 + (i % 4) * 55 + Math.random() * 20,
        vx: (35 + Math.random() * 45) * dir,
        color: palette.fill,
        size: 0.85 + Math.random() * 0.3,
        direction: dir,
        isCaught: false,
      });
    }

    setFishList(newFish);
  }, []);

  // Initialize round
  useEffect(() => {
    const t = level === 'bonds10' ? 10 : level === 'bonds20' ? 20 : 15;
    setTargetSum(t);
    setCaughtFish([]);
    spawnFishSchool(t, 0);
  }, [level, spawnFishSchool]);

  // Cast fishing line downward
  const castHook = useCallback(() => {
    if (isCasting || isReeling) return;
    setIsCasting(true);
    playSound('cast');
  }, [isCasting, isReeling, playSound]);

  // Movement & Collision Animation Tick
  useEffect(() => {
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      // 1. Move fish horizontally
      setFishList((prev) =>
        prev.map((fish) => {
          if (fish.isCaught) return fish;
          let nx = fish.x + fish.vx * dt;
          let ndir = fish.direction;
          let nvx = fish.vx;

          if (nx > 760 && fish.vx > 0) {
            nvx = -Math.abs(fish.vx);
            ndir = -1;
          } else if (nx < 40 && fish.vx < 0) {
            nvx = Math.abs(fish.vx);
            ndir = 1;
          }

          return { ...fish, x: nx, vx: nvx, direction: ndir };
        })
      );

      // 2. Animate Hook descending or reeling
      if (isCastingRef.current) {
        setHookY((prevY) => {
          const nextY = prevY + 280 * dt;
          if (nextY >= 420) {
            // Reached lakebed, reel back
            setIsCasting(false);
            setIsReeling(true);
            return 420;
          }

          // Check collision with any uncaught fish
          setFishList((currentFish) => {
            const hx = hookXRef.current;
            for (let i = 0; i < currentFish.length; i++) {
              const f = currentFish[i];
              if (!f.isCaught) {
                const dist = Math.hypot(f.x - hx, f.y - nextY);
                if (dist < 32 * f.size) {
                  // Catch fish!
                  f.isCaught = true;
                  setIsCasting(false);
                  setIsReeling(true);
                  playSound('catch');
                  handleFishBite(f);
                  break;
                }
              }
            }
            return [...currentFish];
          });

          return nextY;
        });
      } else if (isReelingRef.current) {
        setHookY((prevY) => {
          const nextY = prevY - 320 * dt;
          if (nextY <= 130) {
            setIsReeling(false);
            return 130;
          }
          return nextY;
        });
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [playSound]);

  // Handle a fish biting the hook
  const handleFishBite = (fish: FishEntity) => {
    setCaughtFish((prevCaught) => {
      const updated = [...prevCaught, fish];
      const sum = updated.reduce((acc, curr) => acc + curr.value, 0);

      if (sum === targetSum) {
        // EXACT NUMBER BOND TARGET REACHED!
        playSound('win');
        setScore((s) => s + 100 + streak * 20);
        setStreak((st) => st + 1);
        setMessage({
          text: `🎉 Marvelous Catch! ${updated.map((f) => f.value).join(' + ')} = ${targetSum}!`,
          type: 'success',
        });

        // Respawn next challenge after celebratory pause
        setTimeout(() => {
          setCaughtFish([]);
          spawnFishSchool(targetSum, 0);
          setMessage({
            text: `🎯 New Round! Find numbers that add up to ${targetSum}`,
            type: 'info',
          });
        }, 2200);
      } else if (sum < targetSum) {
        // Still need more to reach target
        const remaining = targetSum - sum;
        setMessage({
          text: `🎣 Caught a ${fish.value}! So far: ${sum}. Catch ${remaining} more to reach ${targetSum}!`,
          type: 'info',
        });
        spawnFishSchool(targetSum, sum);
      } else {
        // OVER THE TARGET!
        playSound('miss');
        setStreak(0);
        setMessage({
          text: `💦 Too big! ${updated.map((f) => f.value).join(' + ')} = ${sum} (Over ${targetSum}). The fish swam back!`,
          type: 'warning',
        });

        setTimeout(() => {
          setCaughtFish([]);
          spawnFishSchool(targetSum, 0);
        }, 1800);
      }

      return updated;
    });
  };

  // Keyboard navigation for boat / rod
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setHookX((prev) => Math.max(80, prev - 24));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setHookX((prev) => Math.min(720, prev + 24));
      } else if (e.code === 'Space' || e.code === 'ArrowDown') {
        e.preventDefault();
        castHook();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [castHook]);

  const currentSum = caughtFish.reduce((acc, f) => acc + f.value, 0);

  return (
    <div
      style={{
        background: '#090d16',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Game Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0369a1 0%, #0284c7 100%)',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          borderBottom: '1px solid #0284c7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>🎣</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#ffffff',
                  color: '#0369a1',
                }}
              >
                EARLY YEARS &amp; KS1/KS2 MATHS
              </span>
              <span style={{ color: '#bae6fd', fontSize: '0.75rem', fontWeight: 600 }}>
                &bull; Lumina Kinetic Engine
              </span>
            </div>
            <h3 style={{ margin: '2px 0 0', fontSize: '1.15rem', color: '#ffffff', fontWeight: 800 }}>
              Number Bonds Fishing Adventure
            </h3>
          </div>
        </div>

        {/* Level Selector & Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.25)', padding: '3px', borderRadius: '8px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setLevel('bonds10')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: level === 'bonds10' ? '#ffffff' : 'transparent',
                color: level === 'bonds10' ? '#0369a1' : '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Bonds to 10
            </button>
            <button
              type="button"
              onClick={() => setLevel('bonds20')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: level === 'bonds20' ? '#ffffff' : 'transparent',
                color: level === 'bonds20' ? '#0369a1' : '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Bonds to 20
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled((s) => !s)}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: soundEnabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.3)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
            title="Toggle Sound Effects"
          >
            {soundEnabled ? '🔊 Sound: ON' : '🔇 Muted'}
          </button>

          {onCloseGameMode && (
            <button
              type="button"
              onClick={onCloseGameMode}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#0369a1',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer',
              }}
            >
              Exit Game
            </button>
          )}
        </div>
      </div>

      {/* Target Formula Bar (The Living Equation) */}
      <div
        style={{
          background: '#0f172a',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1e293b',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '6px 14px',
              background: '#0284c7',
              borderRadius: '10px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '1rem',
              boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)',
            }}
          >
            <span>🎯 Target Sum:</span>
            <span style={{ fontSize: '1.25rem', color: '#fef08a' }}>{targetSum}</span>
          </div>

          {/* Living Equation Box */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#f8fafc',
              background: '#1e293b',
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1px solid #334155',
            }}
          >
            <span>Equation:</span>
            {caughtFish.length === 0 ? (
              <span style={{ color: '#94a3b8' }}>[ Cast to catch 1st fish ]</span>
            ) : (
              <>
                {caughtFish.map((f, i) => (
                  <React.Fragment key={f.id}>
                    <span
                      style={{
                        background: f.color,
                        color: '#ffffff',
                        padding: '2px 10px',
                        borderRadius: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}
                    >
                      {f.value}
                    </span>
                    {i < caughtFish.length - 1 && <span style={{ color: '#38bdf8' }}>+</span>}
                  </React.Fragment>
                ))}
                <span style={{ color: '#38bdf8' }}>+</span>
                <span style={{ borderBottom: '2px dashed #38bdf8', padding: '0 8px', color: '#38bdf8' }}>?</span>
                <span>=</span>
                <span style={{ color: currentSum === targetSum ? '#34d399' : '#f8fafc' }}>{currentSum}</span>
              </>
            )}
          </div>
        </div>

        {/* Score & Streak Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Mastery Score
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#facc15' }}>
              ⭐ {score} pts
            </div>
          </div>
          {streak > 1 && (
            <div
              style={{
                background: '#7c3aed',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
              }}
            >
              🔥 {streak}x Streak!
            </div>
          )}
        </div>
      </div>

      {/* Main Vector Game Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '460px', background: '#0284c7' }}>
        <svg
          viewBox="0 0 800 460"
          style={{ width: '100%', height: '100%', display: 'block' }}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = ((e.clientX - rect.left) / rect.width) * 800;
            setHookX(Math.max(80, Math.min(720, clickX)));
            castHook();
          }}
        >
          <defs>
            {/* Sky to Sea Gradient */}
            <linearGradient id="lake-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>

            <linearGradient id="lake-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="30%" stopColor="#0369a1" />
              <stop offset="75%" stopColor="#075985" />
              <stop offset="100%" stopColor="#0c4a6e" />
            </linearGradient>

            <linearGradient id="lake-bed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>

          {/* Sky Layer (Top 120px) */}
          <rect x="0" y="0" width="800" height="120" fill="url(#lake-sky)" />

          {/* Mountains & Trees in Background */}
          <polygon points="40,120 160,40 280,120" fill="#94a3b8" opacity="0.6" />
          <polygon points="220,120 360,30 500,120" fill="#64748b" opacity="0.7" />
          <polygon points="440,120 580,50 720,120" fill="#94a3b8" opacity="0.6" />

          {/* Water Surface Line & Body */}
          <rect x="0" y="120" width="800" height="340" fill="url(#lake-water)" />
          <line x1="0" y1="120" x2="800" y2="120" stroke="#38bdf8" strokeWidth="4" strokeDasharray="16 8" />

          {/* Sandy Seabed */}
          <path d="M 0,430 Q 200,415 400,430 T 800,425 L 800,460 L 0,460 Z" fill="url(#lake-bed)" />

          {/* Fishing Boat (Follows hookX on surface) */}
          <g transform={`translate(${hookX - 45}, 94)`}>
            {/* Wooden Boat Hull */}
            <path d="M 10,24 L 80,24 L 92,10 L 0,10 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            {/* Fisher character silhouette */}
            <circle cx="36" cy="2" r="7" fill="#f59e0b" />
            <path d="M 32,9 L 40,9 L 44,24 L 28,24 Z" fill="#b45309" />
            {/* Fishing Rod */}
            <line x1="42" y1="10" x2="68" y2="-15" stroke="#f1f5f9" strokeWidth="3" strokeLinecap="round" />
            <circle cx="68" cy="-15" r="2" fill="#ef4444" />
          </g>

          {/* Fishing Line (from rod tip to hook) */}
          <line x1={hookX + 23} y1="79" x2={hookX} y2={hookY} stroke="#f8fafc" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Floating Bobber & Metal Hook */}
          <g transform={`translate(${hookX}, ${hookY})`}>
            {/* Bobber (Red/White buoy) */}
            <circle cx="0" cy="-6" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="0" cy="-6" r="2" fill="#ffffff" />
            {/* Curved Metal Hook */}
            <path d="M 0,0 L 0,12 A 5 5 0 0 0 10,12 L 10,8" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* Swimming Fish School */}
          {fishList.map((fish) => {
            const isFacingRight = fish.direction === 1;
            const size = fish.size;
            return (
              <g
                key={fish.id}
                transform={`translate(${fish.x}, ${fish.y})`}
                style={{ cursor: 'pointer', transition: fish.isCaught ? 'all 0.15s ease' : 'none' }}
              >
                {/* Fish Tail */}
                <polygon
                  points={
                    isFacingRight
                      ? `${-18 * size},0 ${-32 * size},${-10 * size} ${-32 * size},${10 * size}`
                      : `${18 * size},0 ${32 * size},${-10 * size} ${32 * size},${10 * size}`
                  }
                  fill={fish.color}
                  opacity="0.9"
                />

                {/* Fish Body Ellipse */}
                <ellipse cx="0" cy="0" rx={24 * size} ry={14 * size} fill={fish.color} stroke="#ffffff" strokeWidth="1.5" />

                {/* Fish Eye */}
                <circle cx={isFacingRight ? 14 * size : -14 * size} cy={-4 * size} r={3 * size} fill="#ffffff" />
                <circle cx={isFacingRight ? 15 * size : -15 * size} cy={-4 * size} r={1.5 * size} fill="#0f172a" />

                {/* Number Badge Circle on Fish Body */}
                <circle cx={isFacingRight ? -2 * size : 2 * size} cy="0" r={11 * size} fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <text
                  x={isFacingRight ? -2 * size : 2 * size}
                  y={4 * size}
                  fill="#0f172a"
                  fontSize={14 * size}
                  fontWeight="900"
                  textAnchor="middle"
                  fontFamily="system-ui, sans-serif"
                >
                  {fish.value}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Instruction / Feedback Banner */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background:
              message.type === 'success'
                ? '#059669'
                : message.type === 'warning'
                ? '#dc2626'
                : 'rgba(15, 23, 42, 0.85)',
            color: '#ffffff',
            padding: '8px 18px',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
        >
          {message.text}
        </div>
      </div>

      {/* Bottom Controls Bar for Touch/Keyboard */}
      <div
        style={{
          background: '#0f172a',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setHookX((p) => Math.max(80, p - 40))}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#1e293b',
              color: '#ffffff',
              border: '1px solid #334155',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ◀ Move Left
          </button>
          <button
            type="button"
            onClick={() => setHookX((p) => Math.min(720, p + 40))}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#1e293b',
              color: '#ffffff',
              border: '1px solid #334155',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Move Right ▶
          </button>
        </div>

        <button
          type="button"
          onClick={castHook}
          disabled={isCasting || isReeling}
          style={{
            padding: '10px 24px',
            borderRadius: '10px',
            background: isCasting || isReeling ? '#64748b' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 900,
            cursor: isCasting || isReeling ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span>🎣</span> {isCasting ? 'Casting Hook...' : isReeling ? 'Reeling Catch...' : 'CAST HOOK (Spacebar)'}
        </button>

        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
          <span>💡 Tip: Click or tap anywhere in the water to steer and drop hook!</span>
        </div>
      </div>
    </div>
  );
};

export default MathsFishingGame;
