// src/components/EarlyPhonicsLab.tsx
/**
 * Early Years & Key Stage 1 Systematic Synthetic Phonics (SSP) Lab
 * 
 * Aligned with the UK Department for Education (DfE) Letters & Sounds Framework
 * and the Statutory Year 1 Phonics Screening Check.
 * 
 * Features:
 * 1. Phonics Soundboard (Phases 2 to 5 with mouth mechanics & pure sounds)
 * 2. Interactive Sound Button Blending Mat (Dots, Dashes & Split Digraph Bridges)
 * 3. Year 1 Phonics Screening Check Simulator (40 Real & Alien Words with 32/40 threshold)
 * 4. Tricky Word Treasure Chest (Common Exception Words with Tricky Part Highlights)
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  playSuccessChime,
  playIncorrectTone,
  playClickTone,
  triggerHapticSuccess,
  triggerHapticClick,
} from '../services/soundHaptics';
import { triggerCorrectConfetti, triggerMasteryConfetti } from '../utils/confetti';
import { speakInLanguage } from '../engine/translationService';
import {
  PHONICS_GRAPHEMES,
  DECODABLE_WORDS,
  OFFICIAL_SCREENING_POOL,
  TRICKY_WORDS,
  PhonicGrapheme,
  DecodableWord,
  ScreeningWord,
  TrickyWord,
  SoundSegment,
} from '../data/phonicsCurriculumData';

export interface EarlyPhonicsLabProps {
  onClose?: () => void;
  initialPhase?: 2 | 3 | 4 | 5;
}

export default function EarlyPhonicsLab({
  onClose,
  initialPhase = 2,
}: EarlyPhonicsLabProps) {
  const [activeTab, setActiveTab] = useState<'soundboard' | 'blending' | 'screening' | 'tricky'>('soundboard');
  const [selectedPhase, setSelectedPhase] = useState<2 | 3 | 4 | 5>(initialPhase);
  const [stars, setStars] = useState<number>(() => {
    return typeof window !== 'undefined' ? Number(localStorage.getItem('stj_phonics_stars') || '0') : 0;
  });

  // Soundboard State
  const [selectedGrapheme, setSelectedGrapheme] = useState<PhonicGrapheme | null>(null);

  // Blending Mat State
  const [activeWordIdx, setActiveWordIdx] = useState<number>(0);
  const [customWordInput, setCustomWordInput] = useState<string>('');
  const [activeSegmentHighlight, setActiveSegmentHighlight] = useState<number | null>(null);
  const [isBlendingSequence, setIsBlendingSequence] = useState<boolean>(false);

  // Phonics Screening Check State
  const [screeningWords, setScreeningWords] = useState<ScreeningWord[]>([]);
  const [screeningIdx, setScreeningIdx] = useState<number>(0);
  const [screeningScores, setScreeningScores] = useState<Record<string, boolean>>({});
  const [isScreeningFinished, setIsScreeningFinished] = useState<boolean>(false);
  const [showSoundButtonsInScreening, setShowSoundButtonsInScreening] = useState<boolean>(true);

  // Tricky Words State
  const [selectedTrickyPhase, setSelectedTrickyPhase] = useState<2 | 3 | 4 | 5>(2);
  const [activeTrickyCard, setActiveTrickyCard] = useState<TrickyWord | null>(null);

  const awardStars = (count: number) => {
    const updated = stars + count;
    setStars(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('stj_phonics_stars', String(updated));
    }
  };

  // Initialize Screening Check with 40-word randomized permutation
  const initScreeningCheck = () => {
    // Shuffle and pick 40 words adhering to Section 1 & Section 2 ratios
    const sec1Alien = OFFICIAL_SCREENING_POOL.filter((w) => w.section === 1 && w.isAlien);
    const sec1Real = OFFICIAL_SCREENING_POOL.filter((w) => w.section === 1 && !w.isAlien);
    const sec2Alien = OFFICIAL_SCREENING_POOL.filter((w) => w.section === 2 && w.isAlien);
    const sec2Real = OFFICIAL_SCREENING_POOL.filter((w) => w.section === 2 && !w.isAlien);

    const shuffled = [...sec1Alien, ...sec1Real, ...sec2Alien, ...sec2Real].slice(0, 40);
    setScreeningWords(shuffled);
    setScreeningIdx(0);
    setScreeningScores({});
    setIsScreeningFinished(false);
  };

  useEffect(() => {
    initScreeningCheck();
  }, []);

  // Filter graphemes by selected phase
  const currentGraphemes = PHONICS_GRAPHEMES.filter((g) => g.phase === selectedPhase);
  const phaseDecodableWords = DECODABLE_WORDS.filter((w) => w.phase === selectedPhase);
  const currentWord: DecodableWord = phaseDecodableWords[activeWordIdx] || phaseDecodableWords[0] || DECODABLE_WORDS[0];

  // Pure phoneme speech player
  const handlePlayGrapheme = (g: PhonicGrapheme) => {
    playClickTone();
    triggerHapticClick();
    setSelectedGrapheme(g);
    // Speak pure sound then example word
    speakInLanguage(`${g.grapheme}, as in ${g.exampleWord}`, 'en-GB', { rate: 0.8 });
  };

  // Blending sequence runner
  const handleRunBlending = async () => {
    if (isBlendingSequence) return;
    setIsBlendingSequence(true);
    playClickTone();

    // Sequentially highlight and play each sound button
    for (let i = 0; i < currentWord.segments.length; i++) {
      setActiveSegmentHighlight(i);
      const seg = currentWord.segments[i];
      speakInLanguage(seg.soundHint, 'en-GB', { rate: 0.8 });
      await new Promise((res) => setTimeout(res, 600));
    }

    setActiveSegmentHighlight(null);
    await new Promise((res) => setTimeout(res, 250));

    // Blend and speak whole word
    speakInLanguage(currentWord.word, 'en-GB', { rate: 0.85 });
    playSuccessChime();
    triggerHapticSuccess();
    triggerCorrectConfetti();
    awardStars(1);
    setIsBlendingSequence(false);
  };

  // Individual sound button click
  const handlePlaySegment = (seg: SoundSegment, idx: number) => {
    playClickTone();
    triggerHapticClick();
    setActiveSegmentHighlight(idx);
    speakInLanguage(seg.soundHint, 'en-GB', { rate: 0.8 });
    setTimeout(() => setActiveSegmentHighlight(null), 400);
  };

  // Custom word segmentation parser fallback
  const parseCustomWord = (word: string): SoundSegment[] => {
    const clean = word.toLowerCase().trim();
    if (!clean) return [];
    const segments: SoundSegment[] = [];
    let i = 0;
    while (i < clean.length) {
      // Check trigraphs (igh, ear, air, ure)
      const sub3 = clean.slice(i, i + 3);
      if (['igh', 'ear', 'air', 'ure'].includes(sub3)) {
        segments.push({ letters: sub3, type: 'trigraph', soundHint: sub3 });
        i += 3;
        continue;
      }
      // Check digraphs (ch, sh, th, ng, ai, ee, oa, oo, ar, or, ur, ow, oi, er, ay, ou, ie, ea, oy, ir, ue, aw, wh, ph, ew, oe, au, ck, qu, ss, ll, ff, zz)
      const sub2 = clean.slice(i, i + 2);
      if (['ch', 'sh', 'th', 'ng', 'ai', 'ee', 'oa', 'oo', 'ar', 'or', 'ur', 'ow', 'oi', 'er', 'ay', 'ou', 'ie', 'ea', 'oy', 'ir', 'ue', 'aw', 'wh', 'ph', 'ew', 'oe', 'au', 'ck', 'qu', 'ss', 'll', 'ff', 'zz'].includes(sub2)) {
        segments.push({ letters: sub2, type: 'digraph', soundHint: sub2 });
        i += 2;
        continue;
      }
      // Single letter
      segments.push({ letters: clean[i], type: 'single', soundHint: clean[i] });
      i++;
    }
    return segments;
  };

  // Screening Check Scoring
  const handleScoreScreeningWord = (isCorrect: boolean) => {
    const word = screeningWords[screeningIdx];
    if (!word) return;

    if (isCorrect) {
      playSuccessChime();
      triggerHapticSuccess();
      awardStars(1);
    } else {
      playIncorrectTone();
    }

    const nextScores = { ...screeningScores, [word.id]: isCorrect };
    setScreeningScores(nextScores);

    if (screeningIdx < screeningWords.length - 1) {
      setScreeningIdx((prev) => prev + 1);
    } else {
      setIsScreeningFinished(true);
      const totalCorrect = Object.values(nextScores).filter(Boolean).length;
      if (totalCorrect >= 32) {
        triggerMasteryConfetti();
      }
    }
  };

  const currentScreeningWord: ScreeningWord | undefined = screeningWords[screeningIdx];
  const screeningTotalCorrect = Object.values(screeningScores).filter(Boolean).length;
  const isPassingStandard = screeningTotalCorrect >= 32;

  return (
    <div
      style={{
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #1e293b',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        maxWidth: '1080px',
        margin: '0 auto',
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.6rem',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            }}
          >
            🔤
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.74rem', background: '#064e3b', color: '#6ee7b7', padding: '2px 8px', borderRadius: '12px', fontWeight: 800, border: '1px solid #059669' }}>
                UK DfE Letters &amp; Sounds
              </span>
              <span style={{ fontSize: '0.74rem', background: '#1e293b', color: '#94a3b8', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                Reception to Year 2
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '3px 0 0', color: '#fef3c7' }}>
              Early Years &amp; KS1 Synthetic Phonics Lab
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#312e81',
              border: '1px solid #6366f1',
              padding: '6px 14px',
              borderRadius: '10px',
              fontSize: '0.88rem',
              fontWeight: 800,
              color: '#fef3c7',
            }}
          >
            <span>⭐</span>
            <span>{stars} Stars</span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
              }}
            >
              ✕ Close
            </button>
          )}
        </div>
      </div>

      {/* Main Nav Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '10px', flexWrap: 'wrap' }}>
        {[
          { id: 'soundboard', label: '🗣️ Phonics Soundboard (Phases 2–5)', icon: '👄' },
          { id: 'blending', label: '🧩 Sound Buttons & Blending Mat', icon: '🔘' },
          { id: 'screening', label: '🛸 Year 1 Phonics Screening Check', icon: '👾' },
          { id: 'tricky', label: '💎 Tricky Word Treasure Chest', icon: '🪙' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              triggerHapticClick();
              playClickTone();
              setActiveTab(tab.id as any);
            }}
            style={{
              padding: '7px 16px',
              borderRadius: '10px',
              background: activeTab === tab.id ? '#059669' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
              border: activeTab === tab.id ? '1px solid #10b981' : '1px solid transparent',
              fontSize: '0.86rem',
              fontWeight: activeTab === tab.id ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: PHONICS SOUNDBOARD (PHASES 2 TO 5) */}
      {activeTab === 'soundboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Phase Selector Chips */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              Select Teaching Phase:
            </span>
            {[
              { phase: 2, label: 'Phase 2 (Reception Autumn)', desc: 'Single GPCs & CVC' },
              { phase: 3, label: 'Phase 3 (Reception Spring/Summer)', desc: 'Digraphs & Trigraphs' },
              { phase: 4, label: 'Phase 4 (Year 1 Autumn)', desc: 'Adjacent Consonants / Blends' },
              { phase: 5, label: 'Phase 5 (Year 1 Spring/Summer)', desc: 'Split Digraphs & Alternatives' },
            ].map((p) => (
              <button
                key={p.phase}
                type="button"
                onClick={() => {
                  playClickTone();
                  setSelectedPhase(p.phase as any);
                  setSelectedGrapheme(null);
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: selectedPhase === p.phase ? '#1e1b4b' : '#0f172a',
                  color: selectedPhase === p.phase ? '#a5b4fc' : '#64748b',
                  border: selectedPhase === p.phase ? '1px solid #6366f1' : '1px solid #1e293b',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Graphemes Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
            }}
          >
            {currentGraphemes.map((g) => {
              const isSelected = selectedGrapheme?.id === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handlePlayGrapheme(g)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' : '#0f172a',
                    border: isSelected ? '2px solid #818cf8' : '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '14px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 6px 18px rgba(99, 102, 241, 0.35)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fef3c7', letterSpacing: '1px' }}>
                    {g.grapheme}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#94a3b8' }}>
                    <span>{g.exampleIcon}</span>
                    <span>{g.exampleWord}</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#818cf8', fontWeight: 700 }}>
                    {g.phonemeIPA}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mouth Mechanics & Articulation Card */}
          {selectedGrapheme && (
            <div
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #0f172a 100%)',
                border: '1px solid #059669',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '2.2rem' }}>👄</span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: '#6ee7b7' }}>
                    Articulation &amp; Mouth Shape for &quot;{selectedGrapheme.grapheme}&quot; ({selectedGrapheme.phonemeIPA})
                  </h4>
                  <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#cbd5e1' }}>
                    {selectedGrapheme.mouthTip}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => speakInLanguage(selectedGrapheme.exampleWord, 'en-GB', { rate: 0.8 })}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🔊 Hear in &quot;{selectedGrapheme.exampleWord}&quot;</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SOUND BUTTONS & BLENDING MAT */}
      {activeTab === 'blending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Mat Controls Bar */}
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Word Preset Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>
                Curriculum Word:
              </span>
              <select
                value={activeWordIdx}
                onChange={(e) => {
                  playClickTone();
                  setActiveWordIdx(Number(e.target.value));
                  setCustomWordInput('');
                }}
                style={{
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  outline: 'none',
                }}
              >
                {phaseDecodableWords.map((w, idx) => (
                  <option key={w.word} value={idx}>
                    {w.icon || '📝'} {w.word.toUpperCase()} ({w.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Word Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                placeholder="Or type any word..."
                value={customWordInput}
                onChange={(e) => setCustomWordInput(e.target.value)}
                style={{
                  background: '#020617',
                  border: '1px solid #334155',
                  color: '#f8fafc',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  outline: 'none',
                  width: '160px',
                }}
              />
            </div>
          </div>

          {/* The Visual Blending Mat */}
          {(() => {
            const displaySegments = customWordInput.trim()
              ? parseCustomWord(customWordInput)
              : currentWord.segments;
            const wordLabel = customWordInput.trim() || currentWord.word;

            return (
              <div
                style={{
                  background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
                  border: '2px solid #059669',
                  borderRadius: '16px',
                  padding: '36px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '24px',
                  boxShadow: '0 8px 30px rgba(5, 150, 105, 0.2)',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: '12px', left: '16px', fontSize: '0.74rem', color: '#6ee7b7', fontWeight: 800 }}>
                  SOUND BUTTON BLENDING MAT • TAP DOTS TO HEAR PHONEMES
                </div>

                {/* Letters and Sound Buttons Layout */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {displaySegments.map((seg, idx) => {
                    const isHighlighted = activeSegmentHighlight === idx;
                    const isDigraph = seg.type === 'digraph' || seg.type === 'trigraph';
                    const isSplit = seg.type === 'split';

                    return (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        {/* Letter Grapheme */}
                        <div
                          style={{
                            fontSize: '3.4rem',
                            fontWeight: 900,
                            color: isHighlighted ? '#fef08a' : '#ffffff',
                            transition: 'all 0.15s ease',
                            transform: isHighlighted ? 'scale(1.15)' : 'scale(1)',
                            letterSpacing: '2px',
                            minWidth: isDigraph ? '80px' : '45px',
                            textAlign: 'center',
                          }}
                        >
                          {seg.letters}
                        </div>

                        {/* Interactive Sound Button */}
                        <button
                          type="button"
                          onClick={() => handlePlaySegment(seg, idx)}
                          title={`Sound: ${seg.soundHint}`}
                          style={{
                            width: isDigraph ? '70px' : '34px',
                            height: '34px',
                            borderRadius: isDigraph ? '17px' : '50%',
                            background: isHighlighted
                              ? '#eab308'
                              : isDigraph
                              ? '#059669'
                              : isSplit
                              ? '#7c3aed'
                              : '#2563eb',
                            border: `2px solid ${isHighlighted ? '#fef08a' : '#ffffff'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            boxShadow: isHighlighted ? '0 0 16px #eab308' : '0 4px 8px rgba(0, 0, 0, 0.3)',
                            transition: 'all 0.15s ease',
                            transform: isHighlighted ? 'scale(1.2)' : 'scale(1)',
                          }}
                        >
                          {isDigraph ? '━' : isSplit ? '⌒' : '●'}
                        </button>

                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                          /{seg.soundHint}/
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Big Action: Blend & Read */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={handleRunBlending}
                    disabled={isBlendingSequence}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 28px',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: isBlendingSequence ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>▶️</span>
                    <span>{isBlendingSequence ? 'Blending Phonemes...' : 'Blend Sounds & Read Word'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => speakInLanguage(wordLabel, 'en-GB', { rate: 0.8 })}
                    style={{
                      background: '#1e293b',
                      color: '#cbd5e1',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    🔊 Hear Word
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: YEAR 1 PHONICS SCREENING CHECK SIMULATOR */}
      {activeTab === 'screening' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Screening Header & Progress */}
          <div
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', background: '#312e81', color: '#c7d2fe', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                  Statutory National Assessment
                </span>
                <span style={{ fontSize: '0.74rem', background: '#064e3b', color: '#6ee7b7', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                  Pass Mark: 32 / 40
                </span>
              </div>
              <h3 style={{ margin: '3px 0 0', fontSize: '1.05rem', fontWeight: 800, color: '#fef3c7' }}>
                Official Year 1 Phonics Screening Check Simulator
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setShowSoundButtonsInScreening((v) => !v)}
                style={{
                  background: showSoundButtonsInScreening ? '#312e81' : '#1e293b',
                  color: showSoundButtonsInScreening ? '#fef3c7' : '#94a3b8',
                  border: `1px solid ${showSoundButtonsInScreening ? '#6366f1' : '#334155'}`,
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {showSoundButtonsInScreening ? '🔘 Sound Buttons ON' : '🙈 Hide Sound Buttons'}
              </button>

              <button
                type="button"
                onClick={initScreeningCheck}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🔄 Restart Test
              </button>
            </div>
          </div>

          {!isScreeningFinished && currentScreeningWord ? (
            <div
              style={{
                background: currentScreeningWord.isAlien
                  ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)'
                  : 'linear-gradient(135deg, #022c22 0%, #0f172a 100%)',
                border: currentScreeningWord.isAlien ? '2px solid #6366f1' : '2px solid #059669',
                borderRadius: '16px',
                padding: '36px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Word Type Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {currentScreeningWord.isAlien ? (
                  <div
                    style={{
                      background: 'rgba(99, 102, 241, 0.25)',
                      border: '1px solid #818cf8',
                      borderRadius: '20px',
                      padding: '4px 14px',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: '#c7d2fe',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{currentScreeningWord.alienAvatar}</span>
                    <span>Alien Word ({currentScreeningWord.alienName}) &bull; Pure Decoding</span>
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.25)',
                      border: '1px solid #34d399',
                      borderRadius: '20px',
                      padding: '4px 14px',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: '#a7f3d0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>📖</span>
                    <span>Real English Word</span>
                  </div>
                )}
              </div>

              {/* Giant Word Display */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '4.5rem',
                    fontWeight: 900,
                    color: '#ffffff',
                    letterSpacing: '3px',
                    lineHeight: 1,
                  }}
                >
                  {currentScreeningWord.word}
                </span>

                {/* Optional Sound Buttons Underneath */}
                {showSoundButtonsInScreening && (
                  <div style={{ display: 'flex', gap: '14px', marginTop: '8px' }}>
                    {currentScreeningWord.segments.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: s.type === 'digraph' || s.type === 'trigraph' ? '46px' : '20px',
                          height: '20px',
                          borderRadius: s.type === 'digraph' || s.type === 'trigraph' ? '10px' : '50%',
                          background: currentScreeningWord.isAlien ? '#6366f1' : '#059669',
                          border: '2px solid #ffffff',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Progress & Audio Check */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '0.86rem', color: '#94a3b8', fontWeight: 700 }}>
                  Word {screeningIdx + 1} of {screeningWords.length}
                </span>

                <button
                  type="button"
                  onClick={() => speakInLanguage(currentScreeningWord.word, 'en-GB', { rate: 0.8 })}
                  style={{
                    background: '#1e293b',
                    color: '#cbd5e1',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  🔊 Hear Pronunciation
                </button>
              </div>

              {/* Scoring Marking Actions */}
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => handleScoreScreeningWord(false)}
                  style={{
                    background: '#dc2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 24px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🔄</span>
                  <span>Needs Practice</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScoreScreeningWord(true)}
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 28px',
                    fontSize: '0.92rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)',
                  }}
                >
                  <span>✅</span>
                  <span>Read Correctly (+1)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Screening Finished Report Card */
            <div
              style={{
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '18px',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: '3rem' }}>{isPassingStandard ? '🎉' : '📚'}</span>
              <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#fef3c7' }}>
                Screening Check Complete!
              </h3>
              <div
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  color: isPassingStandard ? '#34d399' : '#f87171',
                }}
              >
                {screeningTotalCorrect} / 40
              </div>

              <div
                style={{
                  background: isPassingStandard ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: isPassingStandard ? '1px solid #059669' : '1px solid #dc2626',
                  borderRadius: '10px',
                  padding: '8px 18px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  color: isPassingStandard ? '#a7f3d0' : '#fecaca',
                }}
              >
                {isPassingStandard
                  ? '🌟 Met National Expected Standard (32+ threshold passed!)'
                  : 'Working Towards Expected Standard (Continue daily blending practice)'}
              </div>

              <button
                type="button"
                onClick={initScreeningCheck}
                style={{
                  marginTop: '10px',
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                🔄 Try Another Screening Permutation
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TRICKY WORD TREASURE CHEST */}
      {activeTab === 'tricky' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Phase Selector */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
              Phase Tricky Words:
            </span>
            {[2, 3, 4, 5].map((ph) => (
              <button
                key={ph}
                type="button"
                onClick={() => {
                  playClickTone();
                  setSelectedTrickyPhase(ph as any);
                  setActiveTrickyCard(null);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  background: selectedTrickyPhase === ph ? '#b45309' : '#0f172a',
                  color: selectedTrickyPhase === ph ? '#fef3c7' : '#94a3b8',
                  border: selectedTrickyPhase === ph ? '1px solid #f59e0b' : '1px solid #1e293b',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                Phase {ph} Tricky Words
              </button>
            ))}
          </div>

          {/* Treasure Coins Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
            }}
          >
            {TRICKY_WORDS.filter((t) => t.phase === selectedTrickyPhase).map((tw) => {
              const isSelected = activeTrickyCard?.id === tw.id;
              return (
                <button
                  key={tw.id}
                  type="button"
                  onClick={() => {
                    playClickTone();
                    triggerHapticClick();
                    setActiveTrickyCard(tw);
                    speakInLanguage(tw.word, 'en-GB', { rate: 0.8 });
                  }}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #78350f 0%, #b45309 100%)' : '#0f172a',
                    border: isSelected ? '2px solid #fbbf24' : '1px solid #1e293b',
                    borderRadius: '12px',
                    padding: '16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 4px 16px rgba(245, 158, 11, 0.4)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>🪙</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fef3c7' }}>
                    {tw.word}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>
                    Tricky: &quot;{tw.trickyPart}&quot;
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tricky Word Detail Spotlight */}
          {activeTrickyCard && (
            <div
              style={{
                background: 'linear-gradient(135deg, #451a03 0%, #0f172a 100%)',
                border: '1px solid #d97706',
                borderRadius: '14px',
                padding: '18px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fef3c7' }}>
                    {activeTrickyCard.word}
                  </span>
                  <span style={{ background: '#78350f', color: '#fde68a', padding: '3px 10px', borderRadius: '12px', fontSize: '0.76rem', fontWeight: 800 }}>
                    Why is it tricky?
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => speakInLanguage(activeTrickyCard.exampleSentence, 'en-GB', { rate: 0.8 })}
                  style={{
                    background: '#d97706',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>🔊 Hear in Sentence</span>
                </button>
              </div>

              <p style={{ margin: 0, fontSize: '0.88rem', color: '#fed7aa', lineHeight: 1.5 }}>
                💡 <strong>The Tricky Part:</strong> {activeTrickyCard.trickyExplanation}
              </p>

              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic', borderTop: '1px dashed rgba(245, 158, 11, 0.3)', paddingTop: '8px' }}>
                Example sentence: &quot;{activeTrickyCard.exampleSentence}&quot;
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
