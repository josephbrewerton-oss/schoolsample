// src/components/SanctuaryPilgrimQuest.tsx
/**
 * Sanctuary Pilgrim Quest — 3D Sacred Architecture Educational Game
 * 
 * Interactive liturgical scavenger hunt and catechism game powered by
 * the AST Vector Media Player. Pupils explore the 3D Catholic basilica,
 * decipher sacred clues, answer liturgical checkpoints, and unlock the
 * official Parish Pilgrim Certificate.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import AstVectorMediaPlayer from './AstVectorMediaPlayer';

import { SANCTUARY_QUESTS, StationQuest } from "../data/catholic";

export { SANCTUARY_QUESTS };
export type { StationQuest };

export const SanctuaryPilgrimQuest: React.FC = () => {
  // Game Mode: 'tour' (narrated exploration) or 'quest' (scavenger hunt mode)
  const [gameMode, setGameMode] = useState<'tour' | 'quest'>('quest');
  const [activeStationIndex, setActiveStationIndex] = useState<number>(0);
  const [completedStations, setCompletedStations] = useState<Set<number>>(() => new Set());
  const [score, setScore] = useState<number>(0);
  const [quizState, setQuizState] = useState<{
    selectedOption: number | null;
    isSubmitted: boolean;
    isCorrect: boolean;
  }>({ selectedOption: null, isSubmitted: false, isCorrect: false });
  const [pilgrimName, setPilgrimName] = useState<string>('Pupil of St Joseph’s');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [hintOpen, setHintOpen] = useState<boolean>(false);

  const activeQuest = SANCTUARY_QUESTS[activeStationIndex];

  // Procedural Web Audio Sound Generator (No external MP3 files needed)
  const playChime = useCallback((type: 'success' | 'fanfare' | 'click' | 'step' | 'error') => {
    if (audioMuted || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      } else if (type === 'success') {
        // Melodic ascending triad: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.36);
        });
      } else if (type === 'fanfare') {
        // Grand cathedral fanfare: C5, E5, G5, C6
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.16);
          gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.16 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.16);
          osc.stop(ctx.currentTime + idx * 0.16 + 0.62);
        });
      } else if (type === 'error') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.26);
      }
    } catch {
      // Audio context policy fallback
    }
  }, [audioMuted]);

  // Navigate 3D player to specific station targetT
  const navigatePlayerToStation = useCallback((targetT: number) => {
    if (typeof window === 'undefined') return;
    window.postMessage({
      source: 'sanctuary-quest-parent',
      type: 'SEEK',
      progress: targetT
    }, '*');
    playChime('click');
  }, [playChime]);

  // Select station from quest list
  const handleSelectStation = (index: number) => {
    setActiveStationIndex(index);
    setQuizState({ selectedOption: null, isSubmitted: false, isCorrect: false });
    setHintOpen(false);
    navigatePlayerToStation(SANCTUARY_QUESTS[index].targetT);
  };

  // Submit answer to the station challenge
  const handleAnswerSubmit = (optionIndex: number) => {
    if (quizState.isSubmitted) return;
    const isCorrect = optionIndex === activeQuest.question.correctIndex;
    setQuizState({
      selectedOption: optionIndex,
      isSubmitted: true,
      isCorrect
    });

    if (isCorrect) {
      playChime('success');
      setScore(prev => prev + 100);
      setCompletedStations(prev => {
        const next = new Set(prev);
        next.add(activeStationIndex);
        if (next.size === SANCTUARY_QUESTS.length) {
          setTimeout(() => {
            playChime('fanfare');
            setShowCertificate(true);
          }, 800);
        }
        return next;
      });
    } else {
      playChime('error');
    }
  };

  // Listen to telemetry coming from child 3D iframe (e.g. user clicked station hotspot in 3D canvas)
  useEffect(() => {
    const handleChildMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== 'ast-vector-player') return;

      if (data.type === 'HOTSPOT_SELECTED' && typeof data.targetT === 'number') {
        // Find corresponding station index
        const matchedIndex = SANCTUARY_QUESTS.findIndex(
          q => Math.abs(q.targetT - data.targetT) < 0.08
        );
        if (matchedIndex !== -1 && matchedIndex !== activeStationIndex) {
          setActiveStationIndex(matchedIndex);
          setQuizState({ selectedOption: null, isSubmitted: false, isCorrect: false });
          playChime('step');
        }
      }
    };

    window.addEventListener('message', handleChildMessage);
    return () => window.removeEventListener('message', handleChildMessage);
  }, [activeStationIndex, playChime]);

  // Compute Pilgrim Rank
  const getPilgrimRank = () => {
    const count = completedStations.size;
    if (count === 6) return { title: 'Master Sacristan & Sanctuary Pilgrim', stars: '★★★★★★', color: '#eab308' };
    if (count >= 4) return { title: 'Altar Scholar & Sanctuary Guardian', stars: '★★★★☆☆', color: '#38bdf8' };
    if (count >= 2) return { title: 'Pilgrim Acolyte', stars: '★★☆☆☆☆', color: '#a855f7' };
    return { title: 'Novice Sanctuary Seeker', stars: '☆☆☆☆☆☆', color: '#94a3b8' };
  };

  const rank = getPilgrimRank();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
      }}
    >
      {/* Top Game Navigation & Status Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
          borderRadius: '16px',
          border: '1px solid #1e293b',
          padding: '1.25rem 1.5rem',
          color: '#f8fafc',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.5rem' }}>⛪</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                Sanctuary Pilgrim Quest: 3D Sacred Architecture Challenge
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.86rem', color: '#94a3b8' }}>
              Step into the sacred Latin-cross basilica. Solve the 6 theological clues, explore in 3D perspective, and earn your official Sanctuary Pilgrim Certificate.
            </p>
          </div>

          {/* Mode Switcher & Audio Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                display: 'inline-flex',
                background: '#1e293b',
                borderRadius: '8px',
                padding: '3px',
                border: '1px solid #334155',
              }}
            >
              <button
                type="button"
                onClick={() => setGameMode('tour')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: gameMode === 'tour' ? '#2563eb' : 'transparent',
                  color: gameMode === 'tour' ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.15s ease',
                }}
              >
                🎬 Guided Tour
              </button>
              <button
                type="button"
                onClick={() => setGameMode('quest')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: gameMode === 'quest' ? '#d97706' : 'transparent',
                  color: gameMode === 'quest' ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.15s ease',
                }}
              >
                🎯 Pilgrim Quest
              </button>
            </div>

            <button
              type="button"
              onClick={() => setAudioMuted(!audioMuted)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#1e293b',
                border: '1px solid #334155',
                color: audioMuted ? '#ef4444' : '#38bdf8',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
              title={audioMuted ? 'Unmute Liturgical Audio' : 'Mute Liturgical Audio'}
            >
              {audioMuted ? '🔇' : '🔔'}
            </button>
          </div>
        </div>

        {/* Live Quest Stats Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: '10px',
            padding: '10px 14px',
            border: '1px solid #1e293b',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#d97706', fontSize: '1.1rem' }}>🏆</span>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                Pilgrim Rank
              </span>
              <strong style={{ color: rank.color, fontSize: '0.85rem' }}>{rank.title}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#eab308', fontSize: '1.1rem' }}>★</span>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                Sacred Relics Discovered
              </span>
              <strong style={{ color: '#f8fafc' }}>
                {completedStations.size} / 6 Stations Completed
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38bdf8', fontSize: '1.1rem' }}>✨</span>
            <div>
              <span style={{ color: '#64748b', fontSize: '0.72rem', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                Catechetical Score
              </span>
              <strong style={{ color: '#38bdf8' }}>{score} XP</strong>
            </div>
          </div>

          {completedStations.size === 6 && (
            <button
              type="button"
              onClick={() => setShowCertificate(true)}
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.4)',
              }}
            >
              📜 View Official Certificate
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Vector Stage Window */}
      <div style={{ position: 'relative' }}>
        <AstVectorMediaPlayer
          preset="church-tour"
          autoPlay={gameMode === 'tour'}
          height="520px"
          allowPresetSwitch={true}
        />
      </div>

      {/* Quest Stations Stepper / Relic Shelf */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px',
        }}
      >
        {SANCTUARY_QUESTS.map((quest, idx) => {
          const isDone = completedStations.has(idx);
          const isCurrent = idx === activeStationIndex;

          return (
            <button
              key={quest.id}
              type="button"
              onClick={() => handleSelectStation(idx)}
              style={{
                background: isCurrent ? '#1e293b' : isDone ? '#064e3b' : '#0f172a',
                border: `2px solid ${isCurrent ? '#facc15' : isDone ? '#10b981' : '#334155'}`,
                borderRadius: '10px',
                padding: '8px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isCurrent ? '0 0 12px rgba(250, 204, 21, 0.35)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '1.15rem' }}>{quest.relicIcon}</span>
                {isDone && <span style={{ color: '#34d399', fontSize: '0.75rem', fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ fontSize: '0.7rem', color: isCurrent ? '#fef08a' : isDone ? '#a7f3d0' : '#94a3b8', fontWeight: 700, textAlign: 'center', lineHeight: 1.1 }}>
                Station {quest.stationNum}
              </span>
              <span style={{ fontSize: '0.64rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>
                {quest.relicName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Mission Interactive Console */}
      {gameMode === 'quest' && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          {/* Mission Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ background: '#fef3c7', color: '#92400e', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                  MISSION {activeQuest.stationNum} OF 6
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                  {activeQuest.latinName}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 2px 0' }}>
                {activeQuest.name}
              </h3>
            </div>

            {/* Quick 3D Focus Button */}
            <button
              type="button"
              onClick={() => navigatePlayerToStation(activeQuest.targetT)}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🌐 Orbit 3D Camera to Station
            </button>
          </div>

          {/* Clue Riddle Parchment Box */}
          <div
            style={{
              background: '#fdfbf7',
              border: '1px solid #fde68a',
              borderRadius: '12px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>📜</span>
              <strong style={{ fontSize: '0.9rem', color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pilgrim Riddle &amp; Sacred Clue
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#78350f', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{activeQuest.riddle}"
            </p>
          </div>

          {/* Theological Significance & Liturgical Action */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
              background: '#f8fafc',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '0.84rem',
            }}
          >
            <div>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                Theological Meaning:
              </strong>
              <span style={{ color: '#475569', lineHeight: 1.45 }}>
                {activeQuest.theologicalSignificance}
              </span>
            </div>
            <div>
              <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>
                Liturgical Action for Pupils:
              </strong>
              <span style={{ color: '#475569', lineHeight: 1.45 }}>
                {activeQuest.actionGuidance}
              </span>
            </div>
          </div>

          {/* Station Checkpoint Quiz */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Liturgical Knowledge Check
              </span>
              <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>
                +100 Pilgrim XP
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
              {activeQuest.question.prompt}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeQuest.question.options.map((opt, optIdx) => {
                const isChosen = quizState.selectedOption === optIdx;
                const isCorrect = optIdx === activeQuest.question.correctIndex;
                let btnBg = '#f8fafc';
                let btnBorder = '#e2e8f0';
                let btnColor = '#1e293b';

                if (quizState.isSubmitted) {
                  if (isCorrect) {
                    btnBg = '#ecfdf5';
                    btnBorder = '#10b981';
                    btnColor = '#065f46';
                  } else if (isChosen) {
                    btnBg = '#fef2f2';
                    btnBorder = '#ef4444';
                    btnColor = '#991b1b';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={quizState.isSubmitted}
                    onClick={() => handleAnswerSubmit(optIdx)}
                    style={{
                      background: btnBg,
                      border: `1px solid ${btnBorder}`,
                      color: btnColor,
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '0.88rem',
                      textAlign: 'left',
                      fontWeight: isChosen || isCorrect ? 700 : 500,
                      cursor: quizState.isSubmitted ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontWeight: 800, color: '#64748b' }}>
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span>{opt}</span>
                    {quizState.isSubmitted && isCorrect && <span style={{ marginLeft: 'auto', color: '#10b981' }}>✓ Correct</span>}
                    {quizState.isSubmitted && isChosen && !isCorrect && <span style={{ marginLeft: 'auto', color: '#ef4444' }}>✕ Try Again</span>}
                  </button>
                );
              })}
            </div>

            {/* Quiz Result Feedback */}
            {quizState.isSubmitted && (
              <div
                style={{
                  background: quizState.isCorrect ? '#f0fdf4' : '#fffbeb',
                  border: `1px solid ${quizState.isCorrect ? '#bbf7d0' : '#fde68a'}`,
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{quizState.isCorrect ? '🌟' : '💡'}</span>
                  <strong style={{ color: quizState.isCorrect ? '#166534' : '#92400e' }}>
                    {quizState.isCorrect ? 'Well Done! Relic Unlocked:' : 'Catechetical Reflection:'} {activeQuest.relicName}
                  </strong>
                </div>
                <p style={{ margin: 0, color: quizState.isCorrect ? '#14532d' : '#78350f', lineHeight: 1.45 }}>
                  {activeQuest.question.explanation}
                </p>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic', marginTop: '4px' }}>
                  {activeQuest.question.scriptureRef}
                </span>

                {/* Next Station Button */}
                {quizState.isCorrect && activeStationIndex < SANCTUARY_QUESTS.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleSelectStation(activeStationIndex + 1)}
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: '8px',
                      padding: '8px 16px',
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    Proceed to Station {activeStationIndex + 2} &rarr;
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Printable Parish Sanctuary Certificate Modal */}
      {showCertificate && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            style={{
              background: '#fffdf7',
              border: '8px double #d97706',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              padding: '2.5rem',
              color: '#1e1b4b',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowCertificate(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.4rem',
                cursor: 'pointer',
                color: '#64748b',
              }}
              title="Close Certificate"
            >
              &times;
            </button>

            {/* Certificate Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.4rem' }}>⛪</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#78350f', margin: '8px 0 2px 0', fontFamily: 'serif', letterSpacing: '0.04em' }}>
                CERTIFICATUM PEREGRINATIONIS SACRAE
              </h2>
              <span style={{ fontSize: '0.82rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                St Joseph’s Catholic Curriculum Portal &bull; Archdiocese of Westminster
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#451a03', fontStyle: 'italic', margin: '0 0 1rem 0' }}>
              This certifies that
            </p>

            {/* Editable Name Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <input
                type="text"
                value={pilgrimName}
                onChange={(e) => setPilgrimName(e.target.value)}
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  border: '2px solid #d97706',
                  color: '#1e1b4b',
                  background: '#ffffff',
                  width: '80%',
                  outline: 'none',
                  fontFamily: 'serif',
                }}
                placeholder="Enter Pupil Name"
              />
            </div>

            <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
              has successfully navigated the 3D Catholic Basilica Sanctuary, mastering the theological purpose, liturgical reverence, and architectural symbolism of the <strong>Narthex, Nave, Ambo, Altar of Sacrifice, Tabernacle, and Lady Chapel</strong>.
            </p>

            {/* Relic Badges Earned */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
              }}
            >
              {SANCTUARY_QUESTS.map(q => (
                <div key={q.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{q.relicIcon}</span>
                  <span style={{ fontSize: '0.64rem', color: '#78350f', fontWeight: 700 }}>{q.relicName}</span>
                </div>
              ))}
            </div>

            {/* Seal & Motto */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
              <span>Date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span style={{ fontStyle: 'italic', fontWeight: 700, color: '#78350f' }}>
                "Introibo ad altare Dei, ad Deum qui laetificat juventutem meam."
              </span>
              <span>Score: {score} XP ★★★★★★</span>
            </div>

            {/* Print Certificate Action */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                🖨️ Print A4 Certificate
              </button>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                style={{
                  background: '#1e293b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SanctuaryPilgrimQuest;
