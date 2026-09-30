// src/components/ShakespeareGlobeLab.tsx
/**
 * St Joseph's "0-Bloat the Bard" — The Globe Theatre & Iambic Pentameter Lab
 * 
 * An interactive, ultra-lightweight Shakespearean laboratory featuring:
 * 1. 1599 Globe Theatre Thrust Stage (SVG): The Heavens, Balcony, Thrust, Trapdoor to Hell, and The Pit.
 * 2. Iambic Pentameter Heartbeat Metronome: Real-time Web Audio heartbeat pulse (da-DUM da-DUM)
 *    with interactive scansion (˘ /) and meter-break analysis (feminine endings, trochaic flips).
 * 3. 1603 First Folio ⟷ Modern Translation Scrubber: Instant morphing between Elizabethan and modern English.
 * 4. Character Constellation & Tension Web: Interactive relationship and dramatic irony gauges.
 * 5. Soliloquy Director Mastery Challenge: Hands-on rhetorical puzzle to earn 3 Mastery Stars.
 * 
 * Zero external video, zero heavy game engines. 100% on-device & instant.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  playSuccessChime,
  playIncorrectTone,
  playClickTone,
  triggerHapticSuccess,
  triggerHapticError,
  triggerHapticClick,
} from '../services/soundHaptics';
import { triggerCorrectConfetti, triggerMasteryConfetti } from '../utils/confetti';
import { speakInLanguage } from '../engine/translationService';
import {
  SHAKESPEARE_PLAY_STORIES,
  ShakespearePlayStory,
  PlayAct,
  DramaticChoice,
} from '../data/shakespearePlays';

interface Syllable {
  text: string;
  stress: 'unstressed' | 'stressed';
  isFeminine?: boolean; // 11th unstressed syllable
  isInverted?: boolean; // Trochaic flip (stressed first)
}

interface VerseLine {
  lineNum: number;
  originalText: string;
  modernText: string;
  syllables: Syllable[];
  poeticDevice?: string;
  analysis: string;
}

interface SoliloquyPreset {
  id: string;
  play: string;
  character: string;
  actScene: string;
  title: string;
  context: string;
  dramaticIrony: {
    audienceKnows: string;
    characterBelieves: string;
    ironyScore: number; // 0 to 100
  };
  hamartiaMeter: {
    flaw: string;
    level: number; // 0 to 100
    description: string;
  };
  lines: VerseLine[];
  directorChallenge: {
    prompt: string;
    options: {
      id: string;
      text: string;
      isCorrect: boolean;
      explanation: string;
    }[];
  };
}

const SHAKESPEARE_PRESETS: SoliloquyPreset[] = [
  {
    id: 'macbeth-dagger',
    play: 'Macbeth',
    character: 'Macbeth',
    actScene: 'Act 2, Scene 1',
    title: 'The Dagger of the Mind',
    context: 'Midnight at Inverness castle. Hallucinating a floating bloody dagger guiding him to King Duncan’s bedchamber.',
    dramaticIrony: {
      audienceKnows: 'Macbeth is teetering on madness, driven by the witches’ prophecies and his vaulting ambition.',
      characterBelieves: 'He can murder Duncan, seize the Scottish crown, and escape the moral consequences of regicide.',
      ironyScore: 85,
    },
    hamartiaMeter: {
      flaw: 'Vaulting Ambition',
      level: 75,
      description: 'The ambition which overleaps itself and falls on the other side.',
    },
    lines: [
      {
        lineNum: 1,
        originalText: 'Is this a dagger which I see before me,',
        modernText: 'Is that a dagger I see floating in front of me,',
        syllables: [
          { text: 'Is', stress: 'unstressed' },
          { text: 'this', stress: 'stressed' },
          { text: 'a', stress: 'unstressed' },
          { text: 'dag-', stress: 'stressed' },
          { text: 'ger', stress: 'unstressed' },
          { text: 'which', stress: 'unstressed' },
          { text: 'I', stress: 'stressed' },
          { text: 'see', stress: 'unstressed' },
          { text: 'be-', stress: 'unstressed' },
          { text: 'fore', stress: 'stressed' },
          { text: 'me', stress: 'unstressed', isFeminine: true },
        ],
        poeticDevice: 'Feminine Ending (11th Syllable)',
        analysis: 'Notice the 11th unstressed syllable ("me"). The regular 10-beat heartbeat breaks, mirroring Macbeth’s psychological instability and moral hesitation.',
      },
      {
        lineNum: 2,
        originalText: 'The handle toward my hand? Come, let me clutch thee.',
        modernText: 'With its handle turned toward my hand? Come here, let me grab you.',
        syllables: [
          { text: 'The', stress: 'unstressed' },
          { text: 'han-', stress: 'stressed' },
          { text: 'dle', stress: 'unstressed' },
          { text: 'tow’rd', stress: 'stressed' },
          { text: 'my', stress: 'unstressed' },
          { text: 'hand?', stress: 'stressed' },
          { text: 'Come,', stress: 'unstressed' },
          { text: 'let', stress: 'stressed' },
          { text: 'me', stress: 'unstressed' },
          { text: 'clutch', stress: 'stressed' },
          { text: 'thee.', stress: 'unstressed', isFeminine: true },
        ],
        poeticDevice: 'Caesura (Punctuation Pause) & Apostrophe',
        analysis: 'Macbeth addresses an inanimate hallucination ("thee"). The mid-line question mark forces an actor to pause as he reaches out into empty air.',
      },
      {
        lineNum: 3,
        originalText: 'I have thee not, and yet I see thee still.',
        modernText: 'I cannot grasp you, yet I can still see you clearly.',
        syllables: [
          { text: 'I', stress: 'unstressed' },
          { text: 'have', stress: 'stressed' },
          { text: 'thee', stress: 'unstressed' },
          { text: 'not,', stress: 'stressed' },
          { text: 'and', stress: 'unstressed' },
          { text: 'yet', stress: 'stressed' },
          { text: 'I', stress: 'unstressed' },
          { text: 'see', stress: 'stressed' },
          { text: 'thee', stress: 'unstressed' },
          { text: 'still.', stress: 'stressed' },
        ],
        poeticDevice: 'Antithesis & Paradox',
        analysis: 'Perfect regular iambic pentameter (da-DUM da-DUM da-DUM da-DUM da-DUM). The contrast between physical emptiness and vivid sensory illusion.',
      },
      {
        lineNum: 4,
        originalText: 'Art thou not, fatal vision, sensible',
        modernText: 'Are you not tangible to physical touch, deadly phantom,',
        syllables: [
          { text: 'Art', stress: 'unstressed' },
          { text: 'thou', stress: 'stressed' },
          { text: 'not,', stress: 'unstressed' },
          { text: 'fa-', stress: 'stressed' },
          { text: 'tal', stress: 'unstressed' },
          { text: 'vi-', stress: 'stressed' },
          { text: 'sion,', stress: 'unstressed' },
          { text: 'sen-', stress: 'stressed' },
          { text: 'si-', stress: 'unstressed' },
          { text: 'ble', stress: 'stressed' },
        ],
        poeticDevice: 'Enjambment (Run-on Line)',
        analysis: 'The thought spills over without a concluding punctuation mark into the next line, accelerating Macbeth’s panicked heartbeat.',
      },
    ],
    directorChallenge: {
      prompt: 'Why did Shakespeare give the opening line ("Is this a dagger which I see before me,") 11 syllables instead of the standard 10?',
      options: [
        {
          id: 'opt-1',
          text: 'It has a "feminine ending" (an extra weak beat) to mirror Macbeth’s wavering resolve and psychological fracture.',
          isCorrect: true,
          explanation: 'Exactly! In Elizabethan drama, breaking the 10-beat strict meter with an unresolved 11th unstressed syllable signals an unsettled, questioning mind.',
        },
        {
          id: 'opt-2',
          text: 'Shakespeare made an accidental counting error while drafting the First Folio.',
          isCorrect: false,
          explanation: 'Shakespeare was an exacting master of rhythm. Meter disruptions were carefully calculated dramatic choices.',
        },
        {
          id: 'opt-3',
          text: 'Because Macbeth wants to make the groundlings laugh with comic relief.',
          isCorrect: false,
          explanation: 'This is the most terrifying psychological turning point in the tragedy—the moment before the King is murdered.',
        },
      ],
    },
  },
  {
    id: 'romeo-juliet-balcony',
    play: 'Romeo & Juliet',
    character: 'Romeo',
    actScene: 'Act 2, Scene 2',
    title: 'The Balcony Soliloquy',
    context: 'Under cover of night in the Capulet orchard. Romeo gazes up at Juliet’s high window.',
    dramaticIrony: {
      audienceKnows: 'Romeo has entered enemy territory carrying a death penalty from the Prince if caught.',
      characterBelieves: 'Love conquers ancient family hatred, impervious to mortal danger.',
      ironyScore: 70,
    },
    hamartiaMeter: {
      flaw: 'Impulsive Passion',
      level: 60,
      description: 'Violent delights having violent ends, acting before reflecting.',
    },
    lines: [
      {
        lineNum: 1,
        originalText: 'But soft! What light through yonder window breaks?',
        modernText: 'Wait, quiet! What light is shining through that window over there?',
        syllables: [
          { text: 'But', stress: 'unstressed' },
          { text: 'soft!', stress: 'stressed' },
          { text: 'What', stress: 'unstressed' },
          { text: 'light', stress: 'stressed' },
          { text: 'through', stress: 'unstressed' },
          { text: 'yon-', stress: 'stressed' },
          { text: 'der', stress: 'unstressed' },
          { text: 'win-', stress: 'stressed' },
          { text: 'dow', stress: 'unstressed' },
          { text: 'breaks?', stress: 'stressed' },
        ],
        poeticDevice: 'Trochaic Inversion / Exclamation',
        analysis: '"Soft!" acts as a hush. The line captures the sudden breathtaking awe of Juliet appearing on the upper gallery.',
      },
      {
        lineNum: 2,
        originalText: 'It is the East, and Juliet is the sun.',
        modernText: 'That window is the eastern dawn, and Juliet is the rising sun itself.',
        syllables: [
          { text: 'It', stress: 'unstressed' },
          { text: 'is', stress: 'stressed' },
          { text: 'the', stress: 'unstressed' },
          { text: 'East,', stress: 'stressed' },
          { text: 'and', stress: 'unstressed' },
          { text: 'Ju-', stress: 'stressed' },
          { text: 'liet', stress: 'unstressed' },
          { text: 'is', stress: 'unstressed' },
          { text: 'the', stress: 'unstressed' },
          { text: 'sun.', stress: 'stressed' },
        ],
        poeticDevice: 'Celestial Metaphor',
        analysis: 'Juliet is not merely *like* the sun; she *is* the sun. In Elizabethan cosmology, the sun banishes the darkness and sickness of the night.',
      },
      {
        lineNum: 3,
        originalText: 'Arise, fair sun, and kill the envious moon,',
        modernText: 'Rise up, radiant sun, and banish the jealous moon,',
        syllables: [
          { text: 'A-', stress: 'unstressed' },
          { text: 'rise,', stress: 'stressed' },
          { text: 'fair', stress: 'unstressed' },
          { text: 'sun,', stress: 'stressed' },
          { text: 'and', stress: 'unstressed' },
          { text: 'kill', stress: 'stressed' },
          { text: 'the', stress: 'unstressed' },
          { text: 'en-', stress: 'stressed' },
          { text: 'vious', stress: 'unstressed' },
          { text: 'moon,', stress: 'stressed' },
        ],
        poeticDevice: 'Personification & Light/Dark Motif',
        analysis: 'The moon is personified as jealous and sickly pale, unable to compete with Juliet’s radiant youth.',
      },
    ],
    directorChallenge: {
      prompt: 'When staging this at the Globe in 1599, where would the actor playing Juliet physically stand?',
      options: [
        {
          id: 'opt-1',
          text: 'On the elevated upper gallery (the "Tarras" / Frons Scenae above the main stage).',
          isCorrect: true,
          explanation: 'Correct! The upper gallery was used as castle battlements, city walls, and Juliet’s balcony, placing her literally high above Romeo.',
        },
        {
          id: 'opt-2',
          text: 'Down in the muddy yard surrounded by the noisy Groundlings.',
          isCorrect: false,
          explanation: 'The yard was packed with standing commoners; actors performed on the raised thrust stage or balcony.',
        },
        {
          id: 'opt-3',
          text: 'Underneath the trapdoor inside the Hell cellar.',
          isCorrect: false,
          explanation: 'The trapdoor was reserved for ghosts, demons, and gravediggers, not a celestial balcony scene!',
        },
      ],
    },
  },
  {
    id: 'macbeth-tomorrow',
    play: 'Macbeth',
    character: 'Macbeth',
    actScene: 'Act 5, Scene 5',
    title: 'Tomorrow, and tomorrow, and tomorrow',
    context: 'Dunsinane Castle under siege. Macbeth receives word that Lady Macbeth has died.',
    dramaticIrony: {
      audienceKnows: 'Malcolm’s army is carrying Birnam Wood branches toward the castle right now.',
      characterBelieves: 'Life has lost all significance, but he still clings desperately to the witches’ riddles.',
      ironyScore: 95,
    },
    hamartiaMeter: {
      flaw: 'Nihilism & Despair',
      level: 100,
      description: 'Complete collapse of moral meaning: a tale told by an idiot, signifying nothing.',
    },
    lines: [
      {
        lineNum: 1,
        originalText: 'Tomorrow, and tomorrow, and tomorrow,',
        modernText: 'Day after day, creeping endlessly forward into time,',
        syllables: [
          { text: 'To-', stress: 'unstressed' },
          { text: 'mor-', stress: 'stressed' },
          { text: 'row,', stress: 'unstressed' },
          { text: 'and', stress: 'unstressed' },
          { text: 'to-', stress: 'unstressed' },
          { text: 'mor-', stress: 'stressed' },
          { text: 'row,', stress: 'unstressed' },
          { text: 'and', stress: 'unstressed' },
          { text: 'to-', stress: 'unstressed' },
          { text: 'mor-', stress: 'stressed' },
          { text: 'row,', stress: 'unstressed', isFeminine: true },
        ],
        poeticDevice: 'Polysyndeton & Epizeuxis (Repetition)',
        analysis: 'The relentless repetition of "tomorrow" mimics the monotonous, agonizing tick of a clock, showing time as an endless burden.',
      },
      {
        lineNum: 2,
        originalText: 'Creeps in this petty pace from day to day,',
        modernText: 'Creeps at this trivial, sluggish speed from one day to the next,',
        syllables: [
          { text: 'Creeps', stress: 'stressed', isInverted: true },
          { text: 'in', stress: 'unstressed' },
          { text: 'this', stress: 'unstressed' },
          { text: 'pet-', stress: 'stressed' },
          { text: 'ty', stress: 'unstressed' },
          { text: 'pace', stress: 'stressed' },
          { text: 'from', stress: 'unstressed' },
          { text: 'day', stress: 'stressed' },
          { text: 'to', stress: 'unstressed' },
          { text: 'day,', stress: 'stressed' },
        ],
        poeticDevice: 'Trochaic Inversion ("Creeps in") & Alliteration',
        analysis: 'Notice the very first beat is STRESSED ("CREEPS in"). The inversion breaks the rhythm to make the reader stumble, embodying sluggish, heavy motion.',
      },
      {
        lineNum: 3,
        originalText: 'Out, out, brief candle!',
        modernText: 'Extinguish yourself, short-lived flickering candle!',
        syllables: [
          { text: 'Out,', stress: 'stressed' },
          { text: 'out,', stress: 'stressed' },
          { text: 'brief', stress: 'unstressed' },
          { text: 'can-', stress: 'stressed' },
          { text: 'dle!', stress: 'unstressed' },
        ],
        poeticDevice: 'Metaphor of the Candle & Spondaic Beat',
        analysis: 'Two consecutive heavy stresses ("OUT, OUT"). Human life is compared to a weak, fragile candle flame easily blown out in the dark.',
      },
      {
        lineNum: 4,
        originalText: 'Life’s but a walking shadow, a poor player,',
        modernText: 'Life is merely an insubstantial shadow, a pitiful actor,',
        syllables: [
          { text: 'Life’s', stress: 'stressed' },
          { text: 'but', stress: 'unstressed' },
          { text: 'a', stress: 'unstressed' },
          { text: 'wal-', stress: 'stressed' },
          { text: 'king', stress: 'unstressed' },
          { text: 'sha-', stress: 'stressed' },
          { text: 'dow,', stress: 'unstressed' },
          { text: 'a', stress: 'unstressed' },
          { text: 'poor', stress: 'unstressed' },
          { text: 'play-', stress: 'stressed' },
          { text: 'er,', stress: 'unstressed', isFeminine: true },
        ],
        poeticDevice: 'Metatheatre (Theatre Referencing Itself)',
        analysis: 'Shakespeare reminds the Globe audience that the actor standing on stage will soon exit and be heard no more—just like mortal kings.',
      },
    ],
    directorChallenge: {
      prompt: 'What rhetorical device does Shakespeare use in the phrase "a tale told by an idiot, full of sound and fury, signifying nothing"?',
      options: [
        {
          id: 'opt-1',
          text: 'Nihilistic Metaphor and Alliteration ("tale told", "full... fury").',
          isCorrect: true,
          explanation: 'Outstanding! Shakespeare reduces human existence and imperial ambition to noise without a plot, concluding the tragic collapse of meaning.',
        },
        {
          id: 'opt-2',
          text: 'A cheerful rhyming limerick to entertain children.',
          isCorrect: false,
          explanation: 'This is the bleakest existential reflection in Western dramatic literature.',
        },
        {
          id: 'opt-3',
          text: 'An algebraic formula for measuring sound decibels.',
          isCorrect: false,
          explanation: 'It is a profound literary metaphor examining the futility of tyrannical ambition.',
        },
      ],
    },
  },
];

export interface ShakespeareGlobeLabProps {
  onClose?: () => void;
  initialPresetId?: string;
}

export default function ShakespeareGlobeLab({
  onClose,
  initialPresetId = 'macbeth-dagger',
}: ShakespeareGlobeLabProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId);
  const [modernTranslationSlider, setModernTranslationSlider] = useState<number>(0); // 0 = Folio, 100 = Modern
  const [isRhythmPlaying, setIsRhythmPlaying] = useState<boolean>(false);
  const [activeLineIdx, setActiveLineIdx] = useState<number>(0);
  const [activeSyllableIdx, setActiveSyllableIdx] = useState<number>(-1);
  const [selectedStageZone, setSelectedStageZone] = useState<string | null>('thrust');
  const [activeTab, setActiveTab] = useState<'play-the-play' | 'scansion' | 'stage' | 'tension' | 'director'>('play-the-play');
  const [selectedPlayId, setSelectedPlayId] = useState<string>('macbeth');
  const [currentPlayActIdx, setCurrentPlayActIdx] = useState<number>(0);
  const [showModernQuote, setShowModernQuote] = useState<boolean>(false);
  const [chosenDramaticDecisions, setChosenDramaticDecisions] = useState<Record<string, number>>({});
  const [completedPlays, setCompletedPlays] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('stj_completed_plays') || '[]');
    } catch (_) {
      return [];
    }
  });
  const [challengeFeedback, setChallengeFeedback] = useState<{
    selectedId: string;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);
  const [starsEarned, setStarsEarned] = useState<number>(() => {
    return typeof window !== 'undefined' ? Number(localStorage.getItem('stj_shakespeare_stars') || '0') : 0;
  });

  const preset = SHAKESPEARE_PRESETS.find((p) => p.id === selectedPresetId) || SHAKESPEARE_PRESETS[0];

  // Synthesize rhythmic heartbeat oscillator (da-DUM)
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeatSound = useCallback((isStressed: boolean) => {
    try {
      if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
      }
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }
      const ctx = audioContextRef.current;
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isStressed) {
        // DUM: Punchy, resonant 240Hz heart thump
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        // da: Soft, lower 160Hz pulse
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch (_) {}
  }, []);

  // Rhythm Metronome ticker
  useEffect(() => {
    if (!isRhythmPlaying) {
      setActiveSyllableIdx(-1);
      return;
    }

    const currentLine = preset.lines[activeLineIdx] || preset.lines[0];
    const syllables = currentLine.syllables;

    let step = 0;
    const interval = setInterval(() => {
      if (step >= syllables.length) {
        // Advance to next line
        setActiveLineIdx((prev) => (prev + 1) % preset.lines.length);
        step = 0;
        return;
      }

      const syl = syllables[step];
      setActiveSyllableIdx(step);
      playBeatSound(syl.stress === 'stressed');
      step++;
    }, 380); // ~79 BPM, authentic theatrical speech cadence

    return () => clearInterval(interval);
  }, [isRhythmPlaying, activeLineIdx, preset, playBeatSound]);

  const handleReadAloud = (text: string) => {
    playClickTone();
    speakInLanguage(text, 'en');
  };

  const handleSelectOption = (opt: { id: string; text: string; isCorrect: boolean; explanation: string }) => {
    if (opt.isCorrect) {
      playSuccessChime();
      triggerHapticSuccess();
      triggerCorrectConfetti();
      const newStars = starsEarned + 1;
      setStarsEarned(newStars);
      localStorage.setItem('stj_shakespeare_stars', String(newStars));
      if (newStars % 3 === 0) {
        triggerMasteryConfetti();
      }
    } else {
      playIncorrectTone();
      triggerHapticError();
    }
    setChallengeFeedback({
      selectedId: opt.id,
      isCorrect: opt.isCorrect,
      explanation: opt.explanation,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Banner: Play Selector & Star Counter */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          background: 'linear-gradient(135deg, #1c1917 0%, #292524 100%)',
          border: '1.5px solid #44403c',
          borderRadius: '14px',
          padding: '12px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.8rem' }}>🎭</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: '#d97706',
                  color: '#ffffff',
                }}
              >
                1599 Globe Theatre Lab
              </span>
              <span style={{ fontSize: '0.78rem', color: '#a8a29e' }}>
                Zero-Bloat Iambic Metronome &amp; Dramatic Scansion
              </span>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '2px 0 0', color: '#fef3c7' }}>
              {preset.play}: {preset.title}
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Preset Selector */}
          <select
            value={selectedPresetId}
            onChange={(e) => {
              playClickTone();
              setSelectedPresetId(e.target.value);
              setActiveLineIdx(0);
              setActiveSyllableIdx(-1);
              setIsRhythmPlaying(false);
              setChallengeFeedback(null);
            }}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#0c0a09',
              color: '#fef3c7',
              border: '1px solid #78350f',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {SHAKESPEARE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.play} — {p.character} ({p.actScene})
              </option>
            ))}
          </select>

          {/* Star Counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#451a03',
              border: '1px solid #b45309',
              padding: '5px 12px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 800,
              color: '#fef3c7',
            }}
          >
            <span>⭐</span>
            <span>{starsEarned} Stars</span>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '5px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '8px', overflowX: 'auto', flexWrap: 'wrap' }}>
        {[
          { id: 'play-the-play', label: '🎮 Play the Plays (5-Act Story Walkthrough)', icon: '📜' },
          { id: 'scansion', label: '⚡ Iambic Rhythm & Scansion', icon: '🥁' },
          { id: 'stage', label: '🏛️ Globe Theatre Thrust Stage', icon: '🎪' },
          { id: 'tension', label: '🩸 Tension & Irony Matrix', icon: '🕸️' },
          { id: 'director', label: '🎬 Soliloquy Director Challenge', icon: '⭐' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              triggerHapticClick();
              setActiveTab(tab.id as any);
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: activeTab === tab.id ? '#78350f' : 'transparent',
              color: activeTab === tab.id ? '#fef3c7' : '#94a3b8',
              border: activeTab === tab.id ? '1px solid #d97706' : '1px solid transparent',
              fontSize: '0.84rem',
              fontWeight: activeTab === tab.id ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 0: PLAY THE PLAYS — 5-ACT INTERACTIVE STORY WALKTHROUGH */}
      {activeTab === 'play-the-play' && (() => {
        const currentPlay = SHAKESPEARE_PLAY_STORIES.find((p) => p.id === selectedPlayId) || SHAKESPEARE_PLAY_STORIES[0];
        const currentAct = currentPlay.acts[currentPlayActIdx] || currentPlay.acts[0];
        const decisionKey = `${currentPlay.id}-act-${currentAct.act}`;
        const chosenChoiceIdx = chosenDramaticDecisions[decisionKey];
        const isPlayCompleted = completedPlays.includes(currentPlay.id);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Play Selector Strip */}
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                Select a Shakespearean Masterwork to Play Through:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '8px' }}>
                {SHAKESPEARE_PLAY_STORIES.map((p) => {
                  const isSelected = selectedPlayId === p.id;
                  const isDone = completedPlays.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        playClickTone();
                        setSelectedPlayId(p.id);
                        setCurrentPlayActIdx(0);
                        setShowModernQuote(false);
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: isSelected ? '#451a03' : '#0f172a',
                        border: isSelected ? '1.5px solid #d97706' : '1px solid #334155',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '4px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                        <span
                          style={{
                            fontSize: '0.64rem',
                            fontWeight: 800,
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: p.genreBadgeColor,
                            color: '#ffffff',
                          }}
                        >
                          {p.genre}
                        </span>
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: isSelected ? '#fef3c7' : '#f8fafc' }}>
                        {p.title}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {isDone ? '✔ 5/5 Acts Mastered' : '5-Act Story Walkthrough'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Play Hero Overview Card */}
            <div
              style={{
                background: `linear-gradient(135deg, ${currentPlay.themeColor} 0%, #0c0a09 100%)`,
                border: '1px solid #57534e',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ maxWidth: '650px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{currentPlay.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fef3c7' }}>
                    {currentPlay.title}
                  </h3>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      background: currentPlay.genreBadgeColor,
                      color: '#ffffff',
                    }}
                  >
                    {currentPlay.genre}
                  </span>
                  {isPlayCompleted && (
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399', background: 'rgba(16, 185, 129, 0.2)', padding: '2px 8px', borderRadius: '9999px' }}>
                      🏆 Playwright Diploma
                    </span>
                  )}
                </div>
                <p style={{ margin: '0 0 6px', fontSize: '0.86rem', color: '#f5f5f4', lineHeight: 1.45 }}>
                  {currentPlay.tagline}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#fef08a' }}>
                  🎯 <strong>Core Thematic Dilemma:</strong> {currentPlay.coreQuestion}
                </div>
              </div>

              {/* Reset / Restart Play */}
              <button
                type="button"
                onClick={() => {
                  playClickTone();
                  setCurrentPlayActIdx(0);
                  setShowModernQuote(false);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#e2e8f0',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ↺ Restart from Act I
              </button>
            </div>

            {/* 5-Act Stepper Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '6px',
                background: '#090d16',
                border: '1px solid #1e293b',
                padding: '6px',
                borderRadius: '12px',
              }}
            >
              {currentPlay.acts.map((actItem, actIdx) => {
                const isCurrent = currentPlayActIdx === actIdx;
                const actKey = `${currentPlay.id}-act-${actItem.act}`;
                const hasChosen = chosenDramaticDecisions[actKey] !== undefined;

                return (
                  <button
                    key={actItem.act}
                    type="button"
                    onClick={() => {
                      playClickTone();
                      setCurrentPlayActIdx(actIdx);
                      setShowModernQuote(false);
                    }}
                    style={{
                      padding: '8px 6px',
                      borderRadius: '8px',
                      background: isCurrent ? '#78350f' : '#0f172a',
                      border: isCurrent ? '1.5px solid #d97706' : '1px solid #334155',
                      color: isCurrent ? '#fef3c7' : '#94a3b8',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 900 }}>{actItem.actRoman}</span>
                      {hasChosen && <span style={{ fontSize: '0.7rem', color: '#10b981' }}>✔</span>}
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                      }}
                    >
                      {actItem.title.replace(/^The\s+/, '')}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Interactive Act Stage */}
            <div
              style={{
                background: '#0f172a',
                border: '1.5px solid #334155',
                borderRadius: '14px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Act Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: '#78350f',
                        color: '#fef3c7',
                        border: '1px solid #d97706',
                      }}
                    >
                      {currentAct.actRoman} of 5
                    </span>
                    <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800, color: '#f8fafc' }}>
                      {currentAct.title}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#38bdf8', display: 'block', marginTop: '2px' }}>
                    📍 <strong>Setting:</strong> {currentAct.setting}
                  </span>
                </div>

                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Act {currentPlayActIdx + 1} of 5
                </span>
              </div>

              {/* Narrative Summary */}
              <p
                style={{
                  margin: 0,
                  fontSize: '0.94rem',
                  lineHeight: 1.55,
                  color: '#cbd5e1',
                  background: 'rgba(0,0,0,0.25)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  borderLeft: '4px solid #d97706',
                }}
              >
                {currentAct.summary}
              </p>

              {/* Iconic Quote Showcase */}
              <div
                style={{
                  background: '#1c1917',
                  border: '1px solid #78350f',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.1rem' }}>🗣️</span>
                    <strong style={{ fontSize: '0.82rem', color: '#d97706', textTransform: 'uppercase' }}>
                      Spoken by {currentAct.iconicQuote.speaker}:
                    </strong>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        playClickTone();
                        speakInLanguage(currentAct.iconicQuote.verse, 'en');
                      }}
                      style={{
                        background: '#0284c7',
                        border: 'none',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Read aloud in British theatrical voice"
                    >
                      <span>🔊 Listen to Quote</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClickTone();
                        setShowModernQuote(!showModernQuote);
                      }}
                      style={{
                        background: showModernQuote ? '#d97706' : '#292524',
                        border: '1px solid #78350f',
                        color: showModernQuote ? '#ffffff' : '#fde68a',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <span>{showModernQuote ? '📜 Show Folio Text' : '💡 Plain English'}</span>
                    </button>
                  </div>
                </div>

                {/* The Verse Line */}
                <div
                  style={{
                    fontSize: '1.05rem',
                    fontStyle: showModernQuote ? 'normal' : 'italic',
                    fontFamily: showModernQuote ? 'system-ui' : 'Georgia, serif',
                    color: showModernQuote ? '#38bdf8' : '#fef3c7',
                    lineHeight: 1.45,
                    margin: '4px 0',
                  }}
                >
                  &ldquo;{showModernQuote ? currentAct.iconicQuote.modernTranslation : currentAct.iconicQuote.verse}&rdquo;
                </div>

                <div style={{ fontSize: '0.78rem', color: '#a8a29e', lineHeight: 1.4 }}>
                  <strong>Dramatic Function:</strong> {currentAct.iconicQuote.dramaticSignificance}
                </div>
              </div>

              {/* The Dramatic Turning Point Choice */}
              <div
                style={{
                  background: '#1e1b4b',
                  border: '1.5px solid #6366f1',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.3rem' }}>⚡</span>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase' }}>
                      Dramatic Turning Point &bull; You Direct the Scene
                    </span>
                    <h4 style={{ margin: '2px 0 0', fontSize: '0.98rem', color: '#e0e7ff', fontWeight: 800 }}>
                      {currentAct.decisionPrompt}
                    </h4>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentAct.choices.map((choice, choiceIdx) => {
                    const isSelected = chosenChoiceIdx === choiceIdx;
                    return (
                      <button
                        key={choiceIdx}
                        type="button"
                        onClick={() => {
                          playSuccessChime();
                          triggerHapticClick();
                          setChosenDramaticDecisions({
                            ...chosenDramaticDecisions,
                            [decisionKey]: choiceIdx,
                          });
                        }}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          background: isSelected
                            ? choice.isCanon
                              ? 'rgba(16, 185, 129, 0.2)'
                              : 'rgba(56, 189, 248, 0.2)'
                            : '#0f172a',
                          border: isSelected
                            ? choice.isCanon
                              ? '1.5px solid #10b981'
                              : '1.5px solid #38bdf8'
                            : '1px solid #334155',
                          color: '#f8fafc',
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>
                          {isSelected ? (choice.isCanon ? '🎭' : '🔮') : '👉'}
                        </span>
                        <div>
                          <div>{choice.text}</div>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {choice.isCanon ? '(Shakespeare’s Original Dramatic Choice)' : '(The Alternative "What If?" Branch)'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback on Choice */}
                {chosenChoiceIdx !== undefined && (
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      borderLeft: currentAct.choices[chosenChoiceIdx].isCanon ? '4px solid #10b981' : '4px solid #38bdf8',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ fontSize: '0.86rem', color: '#f8fafc', lineHeight: 1.45 }}>
                      <strong>{currentAct.choices[chosenChoiceIdx].isCanon ? '🎬 What Happens in the Play:' : '🔮 What If This Happened:'}</strong>{' '}
                      {currentAct.choices[chosenChoiceIdx].consequence}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#fef08a' }}>
                      💡 <strong>Life &amp; Literary Takeaway:</strong> {currentAct.choices[chosenChoiceIdx].modernTakeaway}
                    </div>
                  </div>
                )}
              </div>

              {/* 1599 Globe Theatre Staging Secret */}
              <div
                style={{
                  background: 'rgba(120, 53, 15, 0.15)',
                  border: '1px dashed #d97706',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>🏛️</span>
                <div>
                  <strong style={{ fontSize: '0.78rem', color: '#fde68a', textTransform: 'uppercase', display: 'block' }}>
                    1599 Globe Theatre Staging Secret:
                  </strong>
                  <span style={{ fontSize: '0.82rem', color: '#e7e5e4', lineHeight: 1.4 }}>
                    {currentAct.globeStagingSecret}
                  </span>
                </div>
              </div>

              {/* Act Stepper Navigation Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <button
                  type="button"
                  disabled={currentPlayActIdx === 0}
                  onClick={() => {
                    playClickTone();
                    setCurrentPlayActIdx((prev) => Math.max(0, prev - 1));
                    setShowModernQuote(false);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: currentPlayActIdx === 0 ? 'rgba(255,255,255,0.05)' : '#334155',
                    color: currentPlayActIdx === 0 ? '#64748b' : '#ffffff',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: currentPlayActIdx === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  ⬅ Previous Act
                </button>

                {currentPlayActIdx < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      playSuccessChime();
                      setCurrentPlayActIdx((prev) => Math.min(4, prev + 1));
                      setShowModernQuote(false);
                    }}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Next: {currentPlay.acts[currentPlayActIdx + 1].actRoman} ➔</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      triggerMasteryConfetti();
                      playSuccessChime();
                      triggerHapticSuccess();
                      const nextCompleted = Array.from(new Set([...completedPlays, currentPlay.id]));
                      setCompletedPlays(nextCompleted);
                      localStorage.setItem('stj_completed_plays', JSON.stringify(nextCompleted));
                      const newStars = starsEarned + 3;
                      setStarsEarned(newStars);
                      localStorage.setItem('stj_shakespeare_stars', String(newStars));
                    }}
                    style={{
                      padding: '8px 22px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.86rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <span>🏆 Complete Play &amp; Claim 3 Stars!</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* TAB 1: IAMBIC PENTAMETER & SCANSION */}
      {activeTab === 'scansion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Controls Bar: Metronome Play & Translation Slider */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              background: '#0f172a',
              border: '1px solid #334155',
              padding: '10px 16px',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  triggerHapticClick();
                  setIsRhythmPlaying(!isRhythmPlaying);
                }}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  background: isRhythmPlaying
                    ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                    : 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <span>{isRhythmPlaying ? '⏸ Stop Metronome' : '▶ Play Iambic Heartbeat'}</span>
              </button>

              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                da-<strong>DUM</strong> &bull; 79 BPM authentic theatrical cadence
              </span>
            </div>

            {/* Translation Morph Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: '#fef3c7', fontWeight: 700 }}>
                📜 1603 First Folio
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={modernTranslationSlider}
                onChange={(e) => setModernTranslationSlider(Number(e.target.value))}
                style={{ width: '130px', cursor: 'pointer', accentColor: '#d97706' }}
              />
              <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 700 }}>
                Modern English 💡
              </span>
            </div>
          </div>

          {/* Context Card */}
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(120, 53, 15, 0.15)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              borderRadius: '10px',
              fontSize: '0.85rem',
              color: '#fde68a',
            }}
          >
            <strong>📍 Dramatic Context:</strong> {preset.context}
          </div>

          {/* Verse Scansion Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {preset.lines.map((line, lineIdx) => {
              const isCurrentLine = activeLineIdx === lineIdx && isRhythmPlaying;
              return (
                <div
                  key={line.lineNum}
                  onClick={() => {
                    playClickTone();
                    setActiveLineIdx(lineIdx);
                  }}
                  style={{
                    background: isCurrentLine ? '#1e293b' : '#0f172a',
                    border: isCurrentLine ? '1.5px solid #38bdf8' : '1px solid #334155',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>
                      Line {line.lineNum}
                    </span>
                    {line.poeticDevice && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: line.poeticDevice.includes('Feminine') ? '#7c2d12' : '#1e3a5f',
                          color: line.poeticDevice.includes('Feminine') ? '#fed7aa' : '#93c5fd',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}
                      >
                        {line.poeticDevice}
                      </span>
                    )}
                  </div>

                  {/* Syllable Stress Ticker */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      alignItems: 'flex-end',
                      margin: '4px 0',
                    }}
                  >
                    {line.syllables.map((syl, sylIdx) => {
                      const isHighlighted = isCurrentLine && activeSyllableIdx === sylIdx;
                      return (
                        <div
                          key={sylIdx}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            background: isHighlighted
                              ? '#d97706'
                              : syl.isFeminine
                              ? 'rgba(239, 68, 68, 0.15)'
                              : 'rgba(255, 255, 255, 0.04)',
                            border: isHighlighted
                              ? '1.5px solid #fef08a'
                              : syl.isFeminine
                              ? '1px dashed #ef4444'
                              : '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            transform: isHighlighted ? 'scale(1.08)' : 'scale(1)',
                            transition: 'all 0.1s ease',
                          }}
                        >
                          {/* Scansion Stress Mark */}
                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 900,
                              color: syl.isFeminine
                                ? '#f87171'
                                : syl.stress === 'stressed'
                                ? '#38bdf8'
                                : '#94a3b8',
                              lineHeight: 1,
                              marginBottom: '2px',
                            }}
                            title={syl.isFeminine ? 'Feminine Ending (11th weak syllable)' : syl.stress}
                          >
                            {syl.isFeminine ? '✕ 11th' : syl.stress === 'stressed' ? '／ DUM' : '˘ da'}
                          </span>

                          {/* Syllable Text */}
                          <span
                            style={{
                              fontSize: '0.98rem',
                              fontWeight: syl.stress === 'stressed' ? 800 : 500,
                              color: isHighlighted
                                ? '#ffffff'
                                : syl.stress === 'stressed'
                                ? '#f8fafc'
                                : '#cbd5e1',
                            }}
                          >
                            {syl.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Morphing Translation Line */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.92rem',
                        lineHeight: 1.4,
                        color: modernTranslationSlider > 50 ? '#38bdf8' : '#fef3c7',
                        fontWeight: 600,
                        fontStyle: modernTranslationSlider < 50 ? 'italic' : 'normal',
                      }}
                    >
                      {modernTranslationSlider === 0
                        ? `"${line.originalText}"`
                        : modernTranslationSlider === 100
                        ? `"${line.modernText}"`
                        : `"${line.originalText}" ➔ "${line.modernText}"`}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReadAloud(line.originalText);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        padding: '4px',
                      }}
                      title="Read aloud in British theatrical voice"
                      aria-label="Listen to verse"
                    >
                      🔊
                    </button>
                  </div>

                  {/* Pedagogical Commentary */}
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#94a3b8',
                      background: 'rgba(0,0,0,0.25)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      marginTop: '4px',
                      lineHeight: 1.45,
                    }}
                  >
                    💡 <strong style={{ color: '#e2e8f0' }}>Director’s Scansion Note:</strong> {line.analysis}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GLOBE THEATRE THRUST STAGE ARCHITECTURE */}
      {activeTab === 'stage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              padding: '10px 14px',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              fontSize: '0.84rem',
              color: '#cbd5e1',
            }}
          >
            🏛️ <strong>The 1599 Globe Theatre:</strong> Built by Lord Chamberlain’s Men on Bankside. Click any zone on the vector stage below to discover how Shakespeare blocked his actors!
          </div>

          {/* Interactive SVG Globe Theatre Diagram */}
          <div
            style={{
              background: '#090d16',
              border: '1.5px solid #44403c',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <svg
              viewBox="0 0 600 380"
              style={{ width: '100%', maxWidth: '600px', height: 'auto', overflow: 'visible' }}
            >
              {/* Outer Circular Thatched Roof Galleries */}
              <circle cx="300" cy="190" r="170" fill="none" stroke="#78350f" strokeWidth="22" strokeDasharray="12 4" />
              <circle cx="300" cy="190" r="150" fill="#1c1917" stroke="#44403c" strokeWidth="2" />

              {/* The Pit / Yard (Uncovered Groundlings Area) */}
              <circle
                cx="300"
                cy="230"
                r="110"
                fill={selectedStageZone === 'pit' ? '#3b82f6' : '#292524'}
                fillOpacity={selectedStageZone === 'pit' ? 0.35 : 0.6}
                stroke="#64748b"
                strokeWidth="2"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => {
                  triggerHapticClick();
                  setSelectedStageZone('pit');
                }}
              />
              <text x="300" y="325" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="700">
                THE YARD / PIT (1,000 Groundlings standing for 1 penny)
              </text>

              {/* The Thrust Stage (Projecting into audience) */}
              <polygon
                points="210,130 390,130 370,250 230,250"
                fill={selectedStageZone === 'thrust' ? '#b45309' : '#451a03'}
                stroke="#d97706"
                strokeWidth="2.5"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => {
                  triggerHapticClick();
                  setSelectedStageZone('thrust');
                }}
              />
              <text x="300" y="195" textAnchor="middle" fill="#fef3c7" fontSize="13" fontWeight="800">
                MAIN THRUST STAGE
              </text>
              <text x="300" y="210" textAnchor="middle" fill="#fde68a" fontSize="9">
                Actors surrounded on 3 sides
              </text>

              {/* The Trapdoor to Hell */}
              <rect
                x="280"
                y="220"
                width="40"
                height="22"
                rx="4"
                fill={selectedStageZone === 'hell' ? '#dc2626' : '#1c1917'}
                stroke="#ef4444"
                strokeWidth="1.5"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  triggerHapticClick();
                  setSelectedStageZone('hell');
                }}
              />
              <text x="300" y="235" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="800">
                TRAPDOOR
              </text>

              {/* The Two Pillars Supporting the Heavens */}
              <circle cx="240" cy="160" r="8" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
              <circle cx="360" cy="160" r="8" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
              <text x="240" y="150" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="700">Pillar</text>
              <text x="360" y="150" textAnchor="middle" fill="#fef3c7" fontSize="8" fontWeight="700">Pillar</text>

              {/* Frons Scenae (Rear Wall & Discovery Space) */}
              <rect
                x="200"
                y="80"
                width="200"
                height="45"
                rx="6"
                fill={selectedStageZone === 'frons' ? '#4f46e5' : '#1e1b4b'}
                stroke="#6366f1"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  triggerHapticClick();
                  setSelectedStageZone('frons');
                }}
              />
              <text x="300" y="105" textAnchor="middle" fill="#e0e7ff" fontSize="12" fontWeight="800">
                BALCONY &amp; DISCOVERY SPACE
              </text>
              <text x="300" y="118" textAnchor="middle" fill="#c7d2fe" fontSize="8">
                (Juliet’s Balcony / Duncan’s Chamber)
              </text>

              {/* The Heavens (Canopy over stage) */}
              <polygon
                points="190,75 410,75 380,45 220,45"
                fill={selectedStageZone === 'heavens' ? '#0284c7' : '#0c4a6e'}
                stroke="#38bdf8"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  triggerHapticClick();
                  setSelectedStageZone('heavens');
                }}
              />
              <text x="300" y="63" textAnchor="middle" fill="#e0f2fe" fontSize="11" fontWeight="800">
                THE HEAVENS (Sun, Moon &amp; Rope Winches)
              </text>
            </svg>

            {/* Stage Zone Details Card */}
            <div
              style={{
                width: '100%',
                maxWidth: '600px',
                marginTop: '12px',
                background: '#1c1917',
                border: '1.5px solid #d97706',
                borderRadius: '10px',
                padding: '12px 16px',
              }}
            >
              {selectedStageZone === 'thrust' && (
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#fef3c7', fontSize: '0.96rem' }}>
                    🎪 The Thrust Stage (Platform)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#d6d3d1', lineHeight: 1.45 }}>
                    Raised 5 feet off the ground so actors stood at eye level with the audience. Because spectators surrounded the stage on three sides, actors could not hide behind proscenium arches—they had to project in 360 degrees and address the groundlings directly during soliloquies.
                  </p>
                </div>
              )}
              {selectedStageZone === 'heavens' && (
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#38bdf8', fontSize: '0.96rem' }}>
                    🌌 The Heavens (Supernatural Canopy)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#d6d3d1', lineHeight: 1.45 }}>
                    The painted ceiling represented the celestial firmament, decorated with stars, the Sun, and zodiac symbols. Hidden trapdoors allowed gods, spirits, and angels to descend gracefully onto the stage via rope winches and pulleys.
                  </p>
                </div>
              )}
              {selectedStageZone === 'frons' && (
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#c7d2fe', fontSize: '0.96rem' }}>
                    🏰 Frons Scenae &amp; Upper Gallery (The Tarras)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#d6d3d1', lineHeight: 1.45 }}>
                    The multi-level back wall. The upper balcony was used for Juliet’s orchard window (*Romeo &amp; Juliet*), castle battlements, or musicians. Below it lay the "discovery space," a curtained inner chamber where Hamlet killed Polonius.
                  </p>
                </div>
              )}
              {selectedStageZone === 'hell' && (
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#fca5a5', fontSize: '0.96rem' }}>
                    🔥 The Cellarage / Hell (Understage Trapdoor)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#d6d3d1', lineHeight: 1.45 }}>
                    The cavernous space beneath the floorboards. Smoke, sulfur odors, and demonic figures emerged through this trapdoor, including the Ghost of Hamlet’s father, the Three Witches’ apparitions, and gravediggers.
                  </p>
                </div>
              )}
              {selectedStageZone === 'pit' && (
                <div>
                  <h4 style={{ margin: '0 0 4px', color: '#93c5fd', fontSize: '0.96rem' }}>
                    👥 The Yard &amp; The Groundlings
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#d6d3d1', lineHeight: 1.45 }}>
                    For a single penny, up to 1,000 ordinary apprentices, sailors, and Londoners stood in the open air, eating hazelnuts, drinking ale, and reacting loudly. If a play was boring, they threw fruit! Shakespeare wrote direct jokes and sword fights specifically to keep their attention.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DRAMATIC IRONY & TRAGIC FLAW MATRIX */}
      {activeTab === 'tension' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Dramatic Irony Dual-Level Gauge */}
          <div
            style={{
              background: '#0f172a',
              border: '1.5px solid #334155',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Pedagogical Diagnostic Tool
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.05rem', color: '#f8fafc', fontWeight: 800 }}>
                  ⚖️ The Dramatic Irony HUD
                </h3>
              </div>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid #f59e0b',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#fef08a',
                }}
              >
                Irony Gap: {preset.dramaticIrony.ironyScore}%
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>
              Dramatic irony occurs when the audience possesses critical knowledge that the character on stage is blind to.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
              {/* Audience Level */}
              <div
                style={{
                  background: '#042f2e',
                  border: '1.5px solid #14b8a6',
                  borderRadius: '10px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>👁️</span>
                  <strong style={{ fontSize: '0.88rem', color: '#5eead4' }}>
                    What the Audience Knows:
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#ccfbf1', lineHeight: 1.45 }}>
                  {preset.dramaticIrony.audienceKnows}
                </p>
              </div>

              {/* Character Level */}
              <div
                style={{
                  background: '#450a0a',
                  border: '1.5px solid #ef4444',
                  borderRadius: '10px',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '1.1rem' }}>🎭</span>
                  <strong style={{ fontSize: '0.88rem', color: '#fca5a5' }}>
                    What {preset.character} Believes:
                  </strong>
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#fee2e2', lineHeight: 1.45 }}>
                  {preset.dramaticIrony.characterBelieves}
                </p>
              </div>
            </div>
          </div>

          {/* Hamartia (Tragic Flaw) Meter */}
          <div
            style={{
              background: '#1c1917',
              border: '1.5px solid #78350f',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                  Aristotelian Tragedy
                </span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1rem', color: '#fef3c7' }}>
                  🩸 Hamartia (Tragic Fatal Flaw): <em>{preset.hamartiaMeter.flaw}</em>
                </h4>
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f87171' }}>
                {preset.hamartiaMeter.level}% Destructive Momentum
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '14px',
                background: '#292524',
                borderRadius: '9999px',
                overflow: 'hidden',
                border: '1px solid #44403c',
                margin: '10px 0',
              }}
            >
              <div
                style={{
                  width: `${preset.hamartiaMeter.level}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #d97706 0%, #ef4444 100%)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            <p style={{ margin: 0, fontSize: '0.84rem', color: '#d6d3d1', lineHeight: 1.45 }}>
              {preset.hamartiaMeter.description}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: SOLILOQUY DIRECTOR CHALLENGE */}
      {activeTab === 'director' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              background: '#1e1b4b',
              border: '1.5px solid #6366f1',
              borderRadius: '14px',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>🎬</span>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase' }}>
                  Theatre Director Challenge
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '1.05rem', color: '#e0e7ff', fontWeight: 800 }}>
                  Directing {preset.character} at the Globe
                </h3>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#c7d2fe', lineHeight: 1.5, margin: '8px 0 16px' }}>
              {preset.directorChallenge.prompt}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {preset.directorChallenge.options.map((opt) => {
                const isSelected = challengeFeedback?.selectedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      background: isSelected
                        ? opt.isCorrect
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)'
                        : '#0f172a',
                      border: isSelected
                        ? opt.isCorrect
                          ? '1.5px solid #10b981'
                          : '1.5px solid #ef4444'
                        : '1px solid #334155',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{isSelected ? (opt.isCorrect ? '✅' : '❌') : '👉'}</span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {challengeFeedback && (
              <div
                style={{
                  marginTop: '14px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: challengeFeedback.isCorrect
                    ? 'rgba(16, 185, 129, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                  border: challengeFeedback.isCorrect
                    ? '1px solid #10b981'
                    : '1px solid #ef4444',
                  fontSize: '0.86rem',
                  lineHeight: 1.45,
                  color: challengeFeedback.isCorrect ? '#6ee7b7' : '#fca5a5',
                }}
              >
                <strong>{challengeFeedback.isCorrect ? '⭐ Brilliant Direction! ' : '💡 Think like a Renaissance playwright: '}</strong>
                {challengeFeedback.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
