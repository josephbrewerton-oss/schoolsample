// src/components/MathFishingGame.tsx
/**
 * St Joseph's Lumina Math Fishing Game — "Number Bonds Pond Adventure"
 * 
 * An interactive, playable vector fishing game for EYFS, KS1, and KS2 pupils.
 * Children cast their fishing line into a tranquil animated vector pond,
 * hook swimming fish bearing numbers (with visual Ten-Frame subitising dots),
 * and add them together to master number bonds (Target 10, Target 20, Free Add, and Doubles).
 * 
 * Features:
 * - Real-time line pendulum & bobber wave physics
 * - Fish boid swimming & hook collision detection
 * - Concrete-Pictorial-Abstract (CPA) representation: numerals + ten-frame dots
 * - Web Audio API synthesized water splashes, cast swooshes, reel clicks, and fanfare chords
 * - Offline browser speech synthesis encouragement
 * - Multi-mode selector: Number Bonds to 10, Bonds to 20, Catch & Add, Doubles Pond
 * - Touch, mouse, and keyboard controls (Arrow keys + Spacebar)
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AstVectorMediaPlayerHandle } from './AstVectorMediaPlayer';
import {
  getSavedLanguage,
  listenToLanguageChange,
  SUPPORTED_LANGUAGES,
} from '../engine/operational-language';

export interface MathFishingGameProps {
  playerRef?: React.RefObject<AstVectorMediaPlayerHandle | null>;
  onCloseGameMode?: () => void;
}

export type GameMode = 'bonds-10' | 'bonds-20' | 'free-add' | 'doubles';

interface SwimmingFish {
  id: number;
  val: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speciesIdx: number;
  hooked: boolean;
  wigglePhase: number;
}

const FISH_COLORS = [
  { body: '#f97316', belly: '#fdba74', tail: '#ea580c', name: 'Clownfish' },
  { body: '#06b6d4', belly: '#a5f3fc', tail: '#0891b2', name: 'Blue Tang' },
  { body: '#eab308', belly: '#fef08a', tail: '#ca8a04', name: 'Golden Fin' },
  { body: '#ec4899', belly: '#fbcfe8', tail: '#db2777', name: 'Coral Snapper' },
  { body: '#8b5cf6', belly: '#ddd6fe', tail: '#7c3aed', name: 'Mystic Guppy' },
  { body: '#10b981', belly: '#a7f3d0', tail: '#059669', name: 'Emerald Carp' },
];

interface MathPondTranslations {
  title: string;
  subtitle: string;
  bonds10: string;
  bonds20: string;
  freeAdd: string;
  doubles: string;
  welcome10: string;
  welcome20: string;
  welcomeFree: string;
  welcomeDoubles: string;
  firstCastPrompt: string;
  castInstruction: string;
}

const MATH_POND_I18N: Record<string, MathPondTranslations> = {
  en: {
    title: 'Lumina Math Pond: Number Bonds Fishing Game',
    subtitle: 'Concrete-to-Abstract Math Discovery • UK National Curriculum KS1/KS2',
    bonds10: '🎯 Bonds to 10',
    bonds20: '🚀 Bonds to 20',
    freeAdd: '➕ Catch & Add',
    doubles: '👯 Doubles Pond',
    welcome10: 'Welcome to Math Pond! Let us find number bonds to 10.',
    welcome20: 'Target 20! Hunt for pairs that make 20.',
    welcomeFree: 'Catch any two fish and find their sum!',
    welcomeDoubles: 'Doubles Pond! Catch a twin fish to double the score.',
    firstCastPrompt: 'Cast your line into the pond to catch your first fish!',
    castInstruction: 'Cast line with mouse, touch or SPACE to hook swimming fish!',
  },
  es: {
    title: 'Laguna Matemática: Pesca de Vínculos Numéricos',
    subtitle: 'Descubrimiento Matemático Concreto-Pictórico-Abstracto • Primaria KS1/KS2',
    bonds10: '🎯 Vínculos a 10',
    bonds20: '🚀 Vínculos a 20',
    freeAdd: '➕ Pescar y Sumar',
    doubles: '👯 Laguna de Dobles',
    welcome10: '¡Bienvenidos a la laguna matemática! Busquemos vínculos numéricos a 10.',
    welcome20: '¡Meta 20! Busca parejas que sumen 20.',
    welcomeFree: '¡Pesca dos peces y calcula su suma!',
    welcomeDoubles: '¡Laguna de dobles! Pesca peces gemelos para duplicar el puntaje.',
    firstCastPrompt: '¡Lanza la caña a la laguna para pescar tu primer número!',
    castInstruction: '¡Lanza la caña con el ratón, toque o ESPACIO para pescar!',
  },
  fr: {
    title: 'Étang des Maths : Pêche aux Liaisons Numériques',
    subtitle: 'Découverte Mathématique Concrète-Imagée-Abstraite • Primaire KS1/KS2',
    bonds10: '🎯 Liaisons à 10',
    bonds20: '🚀 Liaisons à 20',
    freeAdd: '➕ Pêcher et Additionner',
    doubles: '👯 Étang des Doubles',
    welcome10: 'Bienvenue dans l\'étang des maths ! Trouvons les paires qui font 10.',
    welcome20: 'Objectif 20 ! Cherchez les paires qui font 20.',
    welcomeFree: 'Attrapez deux poissons et trouvez leur somme !',
    welcomeDoubles: 'Étang des doubles ! Attrapez des poissons jumeaux pour doubler le score.',
    firstCastPrompt: 'Lancez votre ligne dans l\'étang pour pêcher votre premier poisson !',
    castInstruction: 'Lancez la ligne avec la souris, le toucher ou ESPACE !',
  },
  la: {
    title: 'Stagnum Mathematicum: Piscatio Vinculorum Numerorum',
    subtitle: 'Inventio Mathematica Concreta ad Abstractam • Curriculum Sancti Iosephi',
    bonds10: '🎯 Vincula ad 10',
    bonds20: '🚀 Vincula ad 20',
    freeAdd: '➕ Capere et Addere',
    doubles: '👯 Stagnum Duplorum',
    welcome10: 'Bene veneritis ad stagnum mathematicum! Inveniamus vincula numerorum ad decem.',
    welcome20: 'Meta viginti! Inveni pares qui viginti faciunt.',
    welcomeFree: 'Cape duos pisces et computa summam!',
    welcomeDoubles: 'Stagnum duplorum! Cape pisces geminos ad duplicandum!',
    firstCastPrompt: 'Iace linum in stagnum ad primum piscem capiendum!',
    castInstruction: 'Iace linum manu vel spatio ad pisces capiendos!',
  },
};

export const MathFishingGame: React.FC<MathFishingGameProps> = ({
  playerRef,
  onCloseGameMode,
}) => {
  // Operational Language & Universal Translator Synchronization
  const [currentLang, setCurrentLang] = useState<string>(() => {
    try {
      return getSavedLanguage() || 'en';
    } catch {
      return 'en';
    }
  });

  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
    });
    return unsub;
  }, []);

  // Game Configuration & Mode
  const [mode, setMode] = useState<GameMode>('bonds-10');
  const [showTenFrames, setShowTenFrames] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speechEnabled, setSpeechEnabled] = useState<boolean>(true);

  // Score & Round Progression
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [stars, setStars] = useState<number>(0);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);

  // Current Math Target & Bucket
  const [caughtFish, setCaughtFish] = useState<number[]>([]);
  const [targetSum, setTargetSum] = useState<number>(10);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('Cast your line into the pond to catch your first fish!');
  const [feedbackType, setFeedbackType] = useState<'info' | 'success' | 'warning' | 'cheer'>('info');

  // Angler & Fishing Line Physics State
  const [rodAngle, setRodAngle] = useState<number>(400); // X-target 100..700
  const [castState, setCastState] = useState<'idle' | 'casting' | 'in-water' | 'hooked' | 'reeling'>('idle');
  const [hookPos, setHookPos] = useState<{ x: number; y: number }>({ x: 400, y: 80 });
  const [hookedFishId, setHookedFishId] = useState<number | null>(null);

  // Fish School State
  const fishListRef = useRef<SwimmingFish[]>([]);
  const [, setFrameTick] = useState<number>(0);

  // Canvas / SVG reference
  const pondRef = useRef<SVGSVGElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Speech Helper with Multilingual Voice Selection
  const speakText = useCallback((text: string, langOverride?: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      const targetLang = langOverride || currentLang;
      utterance.lang = SUPPORTED_LANGUAGES[targetLang]?.ttsVoiceLang || 'en-GB';
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors
    }
  }, [speechEnabled, currentLang]);

  // Web Audio Synthesizer
  const playSfx = useCallback((type: 'cast' | 'plop' | 'nibble' | 'reel' | 'success' | 'splash' | 'wrong') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'cast') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.19);
      } else if (type === 'plop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.13);
      } else if (type === 'nibble') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, ctx.currentTime);
        osc.frequency.setValueAtTime(680, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.09, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.11);
      } else if (type === 'reel') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'success') {
        // Joyful chord (C major arpeggio)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
          gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.07);
          osc.stop(ctx.currentTime + i * 0.07 + 0.36);
        });
      } else if (type === 'wrong') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.23);
      }
    } catch {
      // AudioContext unavailable
    }
  }, [soundEnabled]);

  // Initialize or re-populate fish school according to mode
  const populatePond = useCallback(() => {
    const fishCount = 14;
    const newFish: SwimmingFish[] = [];

    // Values suited for mode
    let candidateValues: number[] = [];
    if (mode === 'bonds-10') {
      candidateValues = [1, 2, 3, 4, 5, 5, 6, 7, 8, 9];
      setTargetSum(10);
    } else if (mode === 'bonds-20') {
      candidateValues = [2, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16];
      setTargetSum(20);
    } else if (mode === 'free-add') {
      candidateValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      setTargetSum(10); // flexible
    } else if (mode === 'doubles') {
      candidateValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      setTargetSum(0); // target is matching double
    }

    for (let i = 0; i < fishCount; i++) {
      const val = candidateValues[Math.floor(Math.random() * candidateValues.length)];
      const direction = Math.random() > 0.5 ? 1 : -1;
      newFish.push({
        id: Date.now() + i,
        val,
        x: Math.random() * 700 + 50,
        y: 190 + Math.random() * 220, // Swimming below waterline (y=160 to y=420)
        vx: (30 + Math.random() * 45) * direction,
        vy: (Math.random() - 0.5) * 15,
        size: 0.85 + Math.random() * 0.3,
        speciesIdx: Math.floor(Math.random() * FISH_COLORS.length),
        hooked: false,
        wigglePhase: Math.random() * Math.PI * 2,
      });
    }
    fishListRef.current = newFish;
    setCaughtFish([]);
    setHookedFishId(null);
    setCastState('idle');
  }, [mode]);

  const i18n = MATH_POND_I18N[currentLang] || MATH_POND_I18N.en;

  // Initial populate & mode change
  useEffect(() => {
    populatePond();
    const curI18n = MATH_POND_I18N[currentLang] || MATH_POND_I18N.en;
    if (mode === 'bonds-10') {
      setFeedbackMsg(curI18n.welcome10);
      speakText(curI18n.welcome10);
    } else if (mode === 'bonds-20') {
      setFeedbackMsg(curI18n.welcome20);
      speakText(curI18n.welcome20);
    } else if (mode === 'free-add') {
      setFeedbackMsg(curI18n.welcomeFree);
      speakText(curI18n.welcomeFree);
    } else if (mode === 'doubles') {
      setFeedbackMsg(curI18n.welcomeDoubles);
      speakText(curI18n.welcomeDoubles);
    }
  }, [mode, populatePond, speakText, currentLang]);

  // Main 60 FPS Fish Boid Animation & Collision Loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const pondW = 800;
      const minWaterY = 175;
      const maxWaterY = 430;

      // Update fish positions
      fishListRef.current.forEach((fish) => {
        if (fish.hooked) return;

        fish.x += fish.vx * dt;
        fish.y += fish.vy * dt;
        fish.wigglePhase += dt * 5;

        // Bounce horizontally
        if (fish.x < 40 && fish.vx < 0) {
          fish.x = 40;
          fish.vx *= -1;
        } else if (fish.x > pondW - 40 && fish.vx > 0) {
          fish.x = pondW - 40;
          fish.vx *= -1;
        }

        // Gentle vertical wave bounds
        if (fish.y < minWaterY && fish.vy < 0) {
          fish.vy *= -1;
        } else if (fish.y > maxWaterY && fish.vy > 0) {
          fish.vy *= -1;
        }
      });

      // Hook in water collision detection
      if (castState === 'in-water') {
        const hookR = 26; // collision radius
        for (const fish of fishListRef.current) {
          if (!fish.hooked) {
            const dx = fish.x - hookPos.x;
            const dy = fish.y - hookPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < hookR) {
              // BITE!
              fish.hooked = true;
              setHookedFishId(fish.id);
              setCastState('hooked');
              playSfx('nibble');
              speakText(`You hooked a ${fish.val}!`);
              break;
            }
          }
        }
      }

      setFrameTick((t) => t + 1);
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [castState, hookPos, playSfx, speakText]);

  // Cast Action: Launch hook to target X, Y
  const castTo = useCallback((targetX: number, targetY: number) => {
    if (castState === 'reeling') return;

    const clampedX = Math.max(80, Math.min(720, targetX));
    const clampedY = Math.max(180, Math.min(420, targetY));

    setRodAngle(clampedX);
    setCastState('casting');
    playSfx('cast');

    // Simulate flight & water plop
    setTimeout(() => {
      setHookPos({ x: clampedX, y: clampedY });
      setCastState('in-water');
      playSfx('plop');
    }, 280);
  }, [castState, playSfx]);

  // Reel In Action: Lift fish to boat and evaluate math addition
  const reelIn = useCallback(() => {
    if (castState !== 'hooked' || hookedFishId === null) {
      // Empty reel
      setCastState('idle');
      setHookPos({ x: rodAngle, y: 80 });
      return;
    }

    setCastState('reeling');
    playSfx('reel');

    const caught = fishListRef.current.find((f) => f.id === hookedFishId);
    if (!caught) {
      setCastState('idle');
      return;
    }

    // Reeling animation delay
    setTimeout(() => {
      const caughtVal = caught.val;
      const nextCaught = [...caughtFish, caughtVal];
      setCaughtFish(nextCaught);

      // Remove caught fish from pond & spawn a replacement
      fishListRef.current = fishListRef.current.filter((f) => f.id !== caught.id);
      
      // Add replacement fish at edge
      const candidateVals = mode === 'bonds-10' ? [1,2,3,4,5,6,7,8,9] : [2,4,5,6,7,8,10,12,14];
      const repVal = candidateVals[Math.floor(Math.random() * candidateVals.length)];
      fishListRef.current.push({
        id: Date.now() + Math.random(),
        val: repVal,
        x: Math.random() > 0.5 ? 40 : 760,
        y: 190 + Math.random() * 220,
        vx: (30 + Math.random() * 40) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() - 0.5) * 12,
        size: 0.85 + Math.random() * 0.3,
        speciesIdx: Math.floor(Math.random() * FISH_COLORS.length),
        hooked: false,
        wigglePhase: 0,
      });

      setCastState('idle');
      setHookedFishId(null);
      setHookPos({ x: rodAngle, y: 80 });

      // MATH PEDAGOGICAL LOGIC & EVALUATION
      evaluateCaughtFish(nextCaught, caughtVal);
    }, 450);
  }, [castState, hookedFishId, caughtFish, rodAngle, mode, playSfx]);

  // Evaluate arithmetic depending on the mode
  const evaluateCaughtFish = (bucket: number[], lastVal: number) => {
    const lang = (currentLang || 'en').toLowerCase();

    if (mode === 'bonds-10') {
      const currentSum = bucket.reduce((a, b) => a + b, 0);

      if (bucket.length === 1) {
        const needed = 10 - bucket[0];
        let msg = `🐠 Caught ${bucket[0]}! To make 10, what do we need? Find and catch a ${needed}!`;
        let spoken = `You have ${bucket[0]}. You need ${needed} to make 10!`;
        if (lang.startsWith('es')) {
          msg = `🐠 ¡Pescaste ${bucket[0]}! Para formar 10, ¿cuánto falta? ¡Busca y pesca un ${needed}!`;
          spoken = `Tienes ${bucket[0]}. ¡Necesitas ${needed} para formar 10!`;
        } else if (lang.startsWith('fr')) {
          msg = `🐠 Pêché ${bucket[0]} ! Pour faire 10, que nous manque-t-il ? Trouvez et pêchez un ${needed} !`;
          spoken = `Vous avez ${bucket[0]}. Il vous faut ${needed} pour faire 10 !`;
        } else if (lang.startsWith('la')) {
          msg = `🐠 Piscis ${bucket[0]} captus! Ad decem conficiendum, requiritur ${needed}!`;
          spoken = `Habes ${bucket[0]}. Requiris ${needed} ad decem!`;
        }
        setFeedbackMsg(msg);
        setFeedbackType('info');
        speakText(spoken);
      } else if (currentSum === 10) {
        // SUCCESS! Perfect number bond!
        playSfx('success');
        const eqStr = bucket.join(' + ') + ' = 10!';
        let msg = `🌟 SPLENDID! ${eqStr} Perfect Number Bond to 10!`;
        let spoken = `Splendid! ${bucket.join(' plus ')} equals 10! That is a number bond!`;
        if (lang.startsWith('es')) {
          msg = `🌟 ¡EXCELENTE! ${eqStr} ¡Vínculo numérico a 10 perfecto!`;
          spoken = `¡Excelente! ¡${bucket.join(' más ')} es igual a 10!`;
        } else if (lang.startsWith('fr')) {
          msg = `🌟 SPLENDIDE ! ${eqStr} Liaison numérique parfaite à 10 !`;
          spoken = `Splendide ! ${bucket.join(' plus ')} égale 10 !`;
        } else if (lang.startsWith('la')) {
          msg = `🌟 OPTIME! ${eqStr} Perfectum vinculum ad decem!`;
          spoken = `Optime! ${bucket.join(' et ')} decem faciunt!`;
        }
        setFeedbackMsg(msg);
        setFeedbackType('cheer');
        setScore((s) => s + 100 + streak * 20);
        setStreak((st) => st + 1);
        setStars((star) => star + 1);
        setRoundsCompleted((r) => r + 1);
        speakText(spoken);

        // Reset bucket after celebratory pause
        setTimeout(() => {
          setCaughtFish([]);
          setFeedbackMsg(lang.startsWith('es') ? '🎯 ¡Lanza de nuevo para otro vínculo a 10!' : (lang.startsWith('fr') ? '🎯 Relancez pour une nouvelle liaison à 10 !' : (lang.startsWith('la') ? '🎯 Iterum iace ad novum vinculum!' : '🎯 Cast again to start a new number bond to 10!')));
          setFeedbackType('info');
        }, 2200);
      } else if (currentSum > 10) {
        // Overshoot
        playSfx('wrong');
        const eqStr = bucket.join(' + ') + ` = ${currentSum}`;
        let msg = `💦 Oops! ${eqStr} is greater than 10. Let's toss that one back and try again!`;
        let spoken = `Oops! ${currentSum} is bigger than 10. Let us try again!`;
        if (lang.startsWith('es')) {
          msg = `💦 ¡Ups! ${eqStr} es mayor que 10. ¡Devuélvelo y prueba de nuevo!`;
          spoken = `¡Ups! ${currentSum} es mayor que 10. ¡Probemos de nuevo!`;
        } else if (lang.startsWith('fr')) {
          msg = `💦 Oups ! ${eqStr} dépasse 10. Relâchons-le et réessayons !`;
          spoken = `Oups ! ${currentSum} dépasse 10. Réessayons !`;
        } else if (lang.startsWith('la')) {
          msg = `💦 Eheu! ${eqStr} maius est quam 10. Iterum conemur!`;
          spoken = `Eheu! ${currentSum} maius est quam decem. Iterum conemur!`;
        }
        setFeedbackMsg(msg);
        setFeedbackType('warning');
        speakText(spoken);
        setStreak(0);

        setTimeout(() => {
          setCaughtFish([]);
          setFeedbackMsg(lang.startsWith('es') ? '🎯 ¡Lanza para tu primer número!' : (lang.startsWith('fr') ? '🎯 Lancez pour votre premier nombre !' : '🎯 Cast for your first number!'));
          setFeedbackType('info');
        }, 2200);
      } else {
        // Still below 10 (e.g. 2 + 3 = 5)
        const needed = 10 - currentSum;
        setFeedbackMsg(`Current sum: ${bucket.join(' + ')} = ${currentSum}. Still need ${needed} to reach 10!`);
        setFeedbackType('info');
        speakText(lang.startsWith('es') ? `Total: ${currentSum}. ¡Pesca un ${needed} para llegar a 10!` : (lang.startsWith('fr') ? `Total : ${currentSum}. Pêchez un ${needed} pour atteindre 10 !` : `Total is ${currentSum}. Catch a ${needed} to reach 10!`));
      }
    } else if (mode === 'bonds-20') {
      const currentSum = bucket.reduce((a, b) => a + b, 0);

      if (bucket.length === 1) {
        const needed = 20 - bucket[0];
        setFeedbackMsg(`🐟 Caught ${bucket[0]}! To reach 20, find and catch a ${needed}!`);
        setFeedbackType('info');
        speakText(`Caught ${bucket[0]}. You need ${needed} to make 20!`);
      } else if (currentSum === 20) {
        playSfx('success');
        const eqStr = bucket.join(' + ') + ' = 20!';
        setFeedbackMsg(`🎉 BRILLIANT! ${eqStr} Number Bond to 20 Complete!`);
        setFeedbackType('cheer');
        setScore((s) => s + 200 + streak * 30);
        setStreak((st) => st + 1);
        setStars((star) => star + 1);
        setRoundsCompleted((r) => r + 1);
        speakText(`Brilliant! ${bucket.join(' plus ')} equals 20!`);

        setTimeout(() => {
          setCaughtFish([]);
          setFeedbackMsg('🎯 Cast again for your next bond to 20!');
          setFeedbackType('info');
        }, 2200);
      } else if (currentSum > 20) {
        playSfx('wrong');
        setFeedbackMsg(`💦 Total is ${currentSum} (over 20!). Fish slips back!`);
        setFeedbackType('warning');
        setStreak(0);
        speakText(`Too high! Total was ${currentSum}.`);

        setTimeout(() => {
          setCaughtFish([]);
          setFeedbackMsg('🎯 Cast again!');
          setFeedbackType('info');
        }, 2200);
      } else {
        const needed = 20 - currentSum;
        setFeedbackMsg(`Current sum: ${bucket.join(' + ')} = ${currentSum}. Need ${needed} more!`);
        setFeedbackType('info');
      }
    } else if (mode === 'free-add') {
      if (bucket.length === 2) {
        const sum = bucket[0] + bucket[1];
        playSfx('success');
        setFeedbackMsg(`⭐ Great Addition! ${bucket[0]} + ${bucket[1]} = ${sum}!`);
        setFeedbackType('success');
        setScore((s) => s + 50 * sum);
        setStreak((st) => st + 1);
        setStars((star) => star + 1);
        speakText(`${bucket[0]} plus ${bucket[1]} equals ${sum}!`);

        setTimeout(() => {
          setCaughtFish([]);
          setFeedbackMsg('🎣 Cast for two more fish to add together!');
          setFeedbackType('info');
        }, 2000);
      } else {
        setFeedbackMsg(`First fish: ${bucket[0]}! Now cast and catch a second fish to add them!`);
        setFeedbackType('info');
        speakText(`Caught ${bucket[0]}! Catch another fish to add them.`);
      }
    } else if (mode === 'doubles') {
      if (bucket.length === 1) {
        setFeedbackMsg(`👯 First twin is ${bucket[0]}! Now hunt the pond for another ${bucket[0]} to DOUBLE it!`);
        setFeedbackType('info');
        speakText(`We have ${bucket[0]}! Find another ${bucket[0]} to double it!`);
      } else if (bucket.length === 2) {
        if (bucket[0] === bucket[1]) {
          const doubleVal = bucket[0] * 2;
          playSfx('success');
          setFeedbackMsg(`🌟 TWINS HOOKED! Double ${bucket[0]} (${bucket[0]} + ${bucket[0]}) is ${doubleVal}!`);
          setFeedbackType('cheer');
          setScore((s) => s + 150 + streak * 25);
          setStreak((st) => st + 1);
          setStars((star) => star + 1);
          speakText(`Double ${bucket[0]} equals ${doubleVal}! Wonderful!`);
        } else {
          playSfx('wrong');
          setFeedbackMsg(`💦 Not twins! ${bucket[0]} and ${bucket[1]} are different. Try again!`);
          setFeedbackType('warning');
          setStreak(0);
          speakText(`Those fish are not twins. Let us try again!`);
        }

        setTimeout(() => {
          setCaughtFish([]);
          setFeedbackMsg('👯 Cast for a new fish to double!');
          setFeedbackType('info');
        }, 2200);
      }
    }
  };

  // Click on SVG Pond to Cast
  const handlePondClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!pondRef.current) return;
    const rect = pondRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 800;
    const svgY = ((e.clientY - rect.top) / rect.height) * 480;

    if (castState === 'hooked') {
      reelIn();
    } else if (castState === 'idle' || castState === 'in-water') {
      castTo(svgX, svgY);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setRodAngle((x) => Math.max(100, x - 30));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setRodAngle((x) => Math.min(700, x + 30));
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (castState === 'hooked') {
          reelIn();
        } else if (castState === 'idle') {
          castTo(rodAngle, 260);
        } else if (castState === 'in-water') {
          reelIn();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [castState, rodAngle, castTo, reelIn]);

  // Ten-Frame Dot Matrix Generator (CPA subitising dots)
  const renderTenFrameDots = (val: number) => {
    const dots = [];
    const count = Math.min(val, 20);
    for (let i = 0; i < count; i++) {
      dots.push(
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: i < 5 ? '#38bdf8' : i < 10 ? '#f59e0b' : '#ec4899',
            margin: '1px',
          }}
        />
      );
    }
    return dots;
  };

  return (
    <div
      className="math-fishing-container stj-card"
      style={{
        marginTop: '1.5rem',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '2px solid #0284c7',
        background: 'linear-gradient(180deg, #0f172a 0%, #0369a1 100%)',
        boxShadow: '0 20px 40px -15px rgba(2, 132, 199, 0.35)',
        color: '#ffffff',
        position: 'relative',
      }}
    >
      {/* Top Header / Mode & Telemetry Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎣</span>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#38bdf8' }}>
              {i18n.title}
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              {i18n.subtitle}
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setMode('bonds-10')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              background: mode === 'bonds-10' ? '#0284c7' : '#1e293b',
              color: mode === 'bonds-10' ? '#ffffff' : '#94a3b8',
              boxShadow: mode === 'bonds-10' ? '0 0 12px rgba(2,132,199,0.5)' : 'none',
            }}
          >
            {i18n.bonds10}
          </button>
          <button
            type="button"
            onClick={() => setMode('bonds-20')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              background: mode === 'bonds-20' ? '#0284c7' : '#1e293b',
              color: mode === 'bonds-20' ? '#ffffff' : '#94a3b8',
              boxShadow: mode === 'bonds-20' ? '0 0 12px rgba(2,132,199,0.5)' : 'none',
            }}
          >
            {i18n.bonds20}
          </button>
          <button
            type="button"
            onClick={() => setMode('free-add')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              background: mode === 'free-add' ? '#0284c7' : '#1e293b',
              color: mode === 'free-add' ? '#ffffff' : '#94a3b8',
              boxShadow: mode === 'free-add' ? '0 0 12px rgba(2,132,199,0.5)' : 'none',
            }}
          >
            {i18n.freeAdd}
          </button>
          <button
            type="button"
            onClick={() => setMode('doubles')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              background: mode === 'doubles' ? '#0284c7' : '#1e293b',
              color: mode === 'doubles' ? '#ffffff' : '#94a3b8',
              boxShadow: mode === 'doubles' ? '0 0 12px rgba(2,132,199,0.5)' : 'none',
            }}
          >
            {i18n.doubles}
          </button>
        </div>

        {/* Options & Sound */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setShowTenFrames((prev) => !prev)}
            title="Toggle Ten-Frame Visual Subitising Dots on Fish"
            style={{
              padding: '5px 10px',
              background: showTenFrames ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: '6px',
              color: '#38bdf8',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showTenFrames ? '🔟 Ten-Frames ON' : '🔟 Ten-Frames OFF'}
          </button>
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title="Toggle Synthesizer Sound FX"
            style={{
              padding: '5px 10px',
              background: soundEnabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '6px',
              color: '#34d399',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {soundEnabled ? '🔊 Sound' : '🔇 Muted'}
          </button>
          <button
            type="button"
            onClick={() => setSpeechEnabled((prev) => !prev)}
            title="Toggle Voice Guide & Math Readout"
            style={{
              padding: '5px 10px',
              background: speechEnabled ? 'rgba(234, 179, 8, 0.2)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              borderRadius: '6px',
              color: '#facc15',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {speechEnabled ? '🗣️ Voice' : '😶 Quiet'}
          </button>
          {onCloseGameMode && (
            <button
              type="button"
              onClick={onCloseGameMode}
              title="Return to Video Lesson View"
              style={{
                padding: '5px 10px',
                background: '#dc2626',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              ✕ Exit Game
            </button>
          )}
        </div>
      </div>

      {/* Real-time Math Scoreboard & Feedback Ribbon */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          background:
            feedbackType === 'cheer'
              ? 'linear-gradient(90deg, #15803d 0%, #047857 100%)'
              : feedbackType === 'warning'
              ? 'linear-gradient(90deg, #b45309 0%, #9a3412 100%)'
              : 'rgba(30, 41, 59, 0.7)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          gap: '12px',
          transition: 'background 0.3s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 300px' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            {feedbackMsg}
          </div>
        </div>

        {/* Stats: Score, Streak, Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Streak</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f59e0b' }}>🔥 {streak}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Stars</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#eab308' }}>⭐ {stars}</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Vector Pond Stage */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '800 / 480', cursor: 'crosshair' }}>
        <svg
          ref={pondRef}
          viewBox="0 0 800 480"
          onClick={handlePondClick}
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            {/* Water Gradients */}
            <linearGradient id="pond-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="pond-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#0369a1" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="pond-bank" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>

            {/* Bubble Filter */}
            <filter id="pond-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Sky & Distant Mountain Horizon */}
          <rect x="0" y="0" width="800" height="150" fill="url(#pond-sky)" />
          <path d="M 0,150 L 120,90 L 260,150 L 400,105 L 560,150 L 700,95 L 800,150 Z" fill="#0369a1" opacity="0.4" />
          <path d="M 0,150 L 180,115 L 340,150 L 480,120 L 640,150 L 800,130 Z" fill="#0284c7" opacity="0.6" />

          {/* Grassy Fishing Bank */}
          <path d="M 0,120 Q 200,140 400,135 T 800,130 L 800,165 L 0,165 Z" fill="url(#pond-bank)" />

          {/* Water Surface Wave Lines */}
          <rect x="0" y="150" width="800" height="330" fill="url(#pond-water)" />
          <path d="M 0,155 Q 100,150 200,155 T 400,155 T 600,155 T 800,155" fill="none" stroke="#bae6fd" strokeWidth="2.5" opacity="0.75" />
          <path d="M 0,165 Q 150,160 300,165 T 600,165 T 800,165" fill="none" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.5" />

          {/* Sunken Pond Plants & Water Reeds */}
          <path d="M 60,480 Q 75,360 65,300 Q 55,240 70,180" fill="none" stroke="#059669" strokeWidth="6" opacity="0.6" strokeLinecap="round" />
          <path d="M 90,480 Q 110,380 95,310 Q 80,240 100,200" fill="none" stroke="#10b981" strokeWidth="5" opacity="0.5" strokeLinecap="round" />
          <path d="M 720,480 Q 700,370 725,290 Q 740,220 710,180" fill="none" stroke="#059669" strokeWidth="6" opacity="0.6" strokeLinecap="round" />
          <path d="M 750,480 Q 735,390 760,320" fill="none" stroke="#34d399" strokeWidth="4.5" opacity="0.5" strokeLinecap="round" />

          {/* Floating Lily Pads */}
          <ellipse cx="160" cy="162" rx="35" ry="9" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" opacity="0.85" />
          <circle cx="170" cy="160" r="5" fill="#f43f5e" />
          <ellipse cx="640" cy="164" rx="42" ry="11" fill="#15803d" stroke="#22c55e" strokeWidth="1.5" opacity="0.85" />
          <circle cx="630" cy="162" r="6" fill="#fbcfe8" />

          {/* SWIMMING FISH BOIDS */}
          {fishListRef.current.map((fish) => {
            const isHookedThis = hookedFishId === fish.id;
            const species = FISH_COLORS[fish.speciesIdx];
            const direction = fish.vx >= 0 ? 1 : -1;
            const wiggle = Math.sin(fish.wigglePhase) * 4;

            // Tail coordinates
            const tailX = -20 * direction * fish.size;
            const tailY1 = (-10 * fish.size) + wiggle;
            const tailY2 = (10 * fish.size) - wiggle;

            return (
              <g
                key={fish.id}
                transform={`translate(${fish.x.toFixed(1)}, ${fish.y.toFixed(1)})`}
                style={{
                  transition: isHookedThis ? 'transform 0.15s ease-out' : 'none',
                  filter: isHookedThis ? 'url(#pond-glow)' : 'none',
                }}
              >
                {/* Fish Tail Fin */}
                <polygon
                  points={`0,0 ${tailX},${tailY1} ${tailX - (8 * direction * fish.size)},0 ${tailX},${tailY2}`}
                  fill={species.tail}
                  opacity="0.95"
                />

                {/* Fish Main Body */}
                <ellipse
                  cx={4 * direction * fish.size}
                  cy="0"
                  rx={22 * fish.size}
                  ry={14 * fish.size}
                  fill={species.body}
                  stroke="#ffffff"
                  strokeWidth={isHookedThis ? '3' : '1.5'}
                />

                {/* Belly Arc */}
                <path
                  d={`M ${-12 * direction * fish.size},0 Q ${4 * direction * fish.size},${12 * fish.size} ${18 * direction * fish.size},0 Z`}
                  fill={species.belly}
                  opacity="0.85"
                />

                {/* Fish Eye & Pupil */}
                <circle
                  cx={16 * direction * fish.size}
                  cy={-4 * fish.size}
                  r={3.8 * fish.size}
                  fill="#ffffff"
                />
                <circle
                  cx={17.5 * direction * fish.size}
                  cy={-4 * fish.size}
                  r={2 * fish.size}
                  fill="#0f172a"
                />

                {/* Number Badge & Value */}
                <circle
                  cx={2 * direction * fish.size}
                  cy={0}
                  r={12 * fish.size}
                  fill="#0f172a"
                  fillOpacity="0.75"
                  stroke="#f8fafc"
                  strokeWidth="1.5"
                />
                <text
                  x={2 * direction * fish.size}
                  y={4 * fish.size}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={14 * fish.size}
                  fontWeight="900"
                >
                  {fish.val}
                </text>

                {/* Subitising Dots Indicator under fish */}
                {showTenFrames && (
                  <g transform={`translate(${(-15 * fish.size).toFixed(1)}, ${(16 * fish.size).toFixed(1)})`}>
                    <rect
                      x="0"
                      y="0"
                      width={30 * fish.size}
                      height={9 * fish.size}
                      rx={3}
                      fill="#0f172a"
                      opacity="0.8"
                    />
                    {Array.from({ length: Math.min(fish.val, 10) }).map((_, dotIdx) => (
                      <circle
                        key={dotIdx}
                        cx={3 + dotIdx * (26 / Math.max(1, Math.min(fish.val, 10) - 1 || 1))}
                        cy={4.5 * fish.size}
                        r={1.8}
                        fill={dotIdx < 5 ? '#38bdf8' : '#f59e0b'}
                      />
                    ))}
                  </g>
                )}
              </g>
            );
          })}

          {/* FISHING ROD, LINE & BOBBER */}
          {/* Angler Rod on the bank */}
          <path
            d={`M 380,105 Q 400,60 ${rodAngle},50`}
            fill="none"
            stroke="#b45309"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="380" cy="105" r="5" fill="#78350f" />
          <circle cx={rodAngle} cy="50" r="3" fill="#ca8a04" />

          {/* Fishing Line */}
          {castState !== 'idle' && (
            <line
              x1={rodAngle}
              y1={50}
              x2={hookPos.x}
              y2={hookPos.y}
              stroke="#e2e8f0"
              strokeWidth="1.5"
              strokeDasharray={castState === 'casting' ? '4 3' : 'none'}
            />
          )}

          {/* Bobber & Hook */}
          {castState !== 'idle' && (
            <g transform={`translate(${hookPos.x}, ${hookPos.y})`}>
              {/* Ripple Ring on Water */}
              {hookPos.y >= 150 && (
                <ellipse cx="0" cy="0" rx="14" ry="4" fill="none" stroke="#bae6fd" strokeWidth="1.5" opacity="0.7">
                  <animate attributeName="rx" values="6;22;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite" />
                </ellipse>
              )}

              {/* Red/White Buoyant Bobber */}
              <circle cx="0" cy="-8" r="7" fill="#ef4444" />
              <path d="M -7,-8 A 7 7 0 0 0 7,-8 Z" fill="#ffffff" />

              {/* Metal Hook */}
              <path
                d="M 0,-1 L 0,8 A 6 6 0 0 0 10,8 L 10,4"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Hooked Splash Indicator */}
              {castState === 'hooked' && (
                <circle cx="0" cy="0" r="18" fill="none" stroke="#facc15" strokeWidth="2" strokeDasharray="3 3">
                  <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          )}

          {/* On-Stage Educational Hint / Touch Guide */}
          <text x="400" y="465" textAnchor="middle" fill="#bae6fd" fontSize="13" fontWeight="600" opacity="0.85">
            💡 Tap or Click anywhere on the water to cast • Hook a fish, then tap to reel into your bucket!
          </text>
        </svg>
      </div>

      {/* TACKLE BUCKET & NUMBER EQUATION DISPLAY */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          background: 'rgba(15, 23, 42, 0.95)',
          borderTop: '1px solid rgba(56, 189, 248, 0.25)',
          gap: '16px',
        }}
      >
        {/* Left: Caught Fish Bucket & Current Math Statement */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 320px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#0284c7',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)',
            }}
          >
            🪣
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              {mode === 'bonds-10'
                ? 'Target: 10 Number Bond Equation'
                : mode === 'bonds-20'
                ? 'Target: 20 Number Bond Equation'
                : mode === 'free-add'
                ? 'Current Addition Equation'
                : 'Doubles Equation'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              {caughtFish.length === 0 ? (
                <span style={{ color: '#64748b', fontStyle: 'italic', fontSize: '0.95rem' }}>
                  Bucket empty — cast your line to hook your first number!
                </span>
              ) : (
                caughtFish.map((val, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>+</span>}
                    <div
                      style={{
                        display: 'inline-flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: '#1e293b',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid #38bdf8',
                      }}
                    >
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                        {val}
                      </span>
                      {showTenFrames && (
                        <div style={{ display: 'flex', marginTop: '2px' }}>
                          {renderTenFrameDots(val)}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                ))
              )}

              {/* Show equals & target if in bonds mode */}
              {caughtFish.length > 0 && (mode === 'bonds-10' || mode === 'bonds-20') && (
                <>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#94a3b8' }}>+</span>
                  <div
                    style={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '2px dashed #38bdf8',
                      padding: '4px 10px',
                      borderRadius: '8px',
                    }}
                  >
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                      ?
                    </span>
                    <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Needed</span>
                  </div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>=</span>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34d399' }}>
                    {targetSum}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls: Manual Cast & Reel Buttons for Whiteboards / Touch screens */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => castTo(rodAngle, 260)}
            disabled={castState === 'casting' || castState === 'reeling'}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: '#0284c7',
              border: 'none',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              opacity: castState === 'casting' || castState === 'reeling' ? 0.6 : 1,
            }}
          >
            🎣 Cast Hook (Space)
          </button>

          <button
            type="button"
            onClick={reelIn}
            disabled={castState === 'idle' || castState === 'reeling'}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: castState === 'hooked' ? '#10b981' : '#334155',
              border: 'none',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: castState === 'hooked' ? '0 0 16px rgba(16, 185, 129, 0.6)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {castState === 'hooked' ? '⭐ REEL FISH IN!' : '↺ Reel In'}
          </button>

          <button
            type="button"
            onClick={populatePond}
            title="Reset Pond School"
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: '#1e293b',
              border: '1px solid #475569',
              color: '#94a3b8',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            🔄 New Fish
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathFishingGame;
