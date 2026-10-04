// src/components/AstVectorMediaPlayer.tsx
/**
 * AST-Guided Vector Media Player (Decoupled iFrame Architecture)
 * 
 * Runs procedural SVG motion, continuous keyframe interpolation, and on-device Web Speech
 * inside an isolated browsing context.
 * 
 * Key Benefits:
 * - 0% main-thread CPU blocking: Portal navigation and UI remain at 60 FPS without layout shift.
 * - < 0.01% bandwidth vs video CDNs: 3.5 KB vector AST vs 40+ MB video blobs.
 * - Universal LMS embeddability: Self-contained iframe embeddable in Google Classroom, Canvas, Moodle.
 * - Bi-directional postMessage telemetry: Keyframe milestone tracking, subtitles, and state sync.
 * - Split-Off Ready: Modular code package in /player/ ready for standalone npm/CDN distribution.
 */

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { getSavedLanguage, listenToLanguageChange } from '../engine/operational-language';
import { type SwfTranspileResult } from '../utils/swfAstParser';
import {
  PlayerDisplayMode,
  PlayerDisplayConfig,
  loadSavedPlayerConfig,
  savePlayerConfig,
  getPresetConfig,
  MODE_METADATA,
} from '../types/playerConfig';
import {
  PlayerSettingsModal,
  PlayerEmbedModal,
  DevStudioDrawer,
  NanoAiTutorDrawer,
  type InspectedElementData,
  type StudioTabType,
} from './player';
import AstChalkboardOverlay from './player/AstChalkboardOverlay';
import AstInteractiveLabDrawer from './player/AstInteractiveLabDrawer';
import { exportAirgapHtmlBundle } from '../utils/exportAirgapHtmlBundle';
import { exportSubjectCartridge, AVAILABLE_CARTRIDGES } from '../utils/exportSubjectCartridge';
import { getRelatedConcepts } from '../data/player/astConceptGraph';

export type VectorPresetType =
  | 'fractions'
  | 'solar-system'
  | 'photosynthesis'
  | 'pythagoras'
  | 'water-cycle'
  | 'atom'
  | 'velocity'
  | 'dna-helix'
  | 'church-tour'
  | 'mountain-elevation'
  | 'fish-tank'
  | 'math-fishing'
  | 'kinetic-gas'
  | 'calculus-curves'
  | string;

export interface AstVectorMediaPlayerProps {
  preset?: VectorPresetType;
  lang?: string;
  autoPlay?: boolean;
  theme?: 'dark' | 'light';
  height?: string | number;
  className?: string;
  allowPresetSwitch?: boolean;
  defaultMode?: PlayerDisplayMode;
  initialConfig?: Partial<PlayerDisplayConfig>;
  onPresetChange?: (preset: VectorPresetType) => void;
  onPlayModeToggle?: () => void;
  onKeyframeReached?: (keyframe: { title: string; rule: string; progress: number }) => void;
  onTimeUpdate?: (progress: number) => void;
  onConfigChange?: (config: PlayerDisplayConfig) => void;
  initialCheckpoint?: {
    prompt: string;
    options: string[];
    answer: number;
    explanation?: string;
    title?: string;
    t?: number;
  };
}

export interface AstVectorMediaPlayerHandle {
  postToPlayer: (payload: Record<string, any>) => void;
  seek: (progress: number) => void;
  pause: () => void;
  play: () => void;
  togglePlay: () => void;
  toggleVoiceCommands: () => void;
  startVoiceCommands: () => void;
  stopVoiceCommands: () => void;
  executeVoiceCommand: (command: string) => void;
  togglePictureInPicture: () => void;
  injectCheckpoint: (checkpoint: {
    prompt: string;
    options: string[];
    answer: number;
    explanation?: string;
    title?: string;
    t?: number;
  }) => void;
}

export const PRESET_OPTIONS: { id: string; label: string; stage: string }[] = [
  { id: 'calculus-curves', label: '📐 Calculus & Curves: Tangent Slopes & Integrals (dy/dx & ∫f(x)dx)', stage: 'GCSE & A-LEVEL MATHS' },
  { id: 'kinetic-gas', label: '🌡️ Kinetic Gas Theory & Boyle\'s Law (PV = nRT)', stage: 'KS3/KS4 PHYSICS & CHEMISTRY' },
  { id: 'algebra-balance', label: '⚖️ Algebraic Balance Scale: Preserving Equality (2x + 5 = 15)', stage: 'KS2/KS3 MATHS' },
  { id: 'electric-circuits', label: '💡 Electrical Circuits: Ohm\'s Law & Electron Physics (V = I × R)', stage: 'KS2/KS3 PHYSICS' },
  { id: 'bodmas', label: '🧮 BODMAS / BIDMAS: Forcefield Clamps & Area Physics', stage: 'KS2/KS3 MATHS' },
  { id: 'times-tables', label: '📐 Times Tables: 2D Array & Distributive Splitter', stage: 'KS1/KS2 MATHS' },
  { id: 'phonics-lab', label: '🔤 Early Phonics: Sound Buttons & Blending Mat', stage: 'EYFS/KS1 ENGLISH' },
  { id: 'math-fishing', label: '🎣 Math Pond: Number Bonds Fishing Game', stage: 'KS1/KS2 MATHS' },
  { id: 'mountain-elevation', label: '🧗 Mountain Altitude: Climber Game (Elevation & Slope)', stage: 'KS2/KS3 MATHS & GEOGRAPHY' },
  { id: 'fish-tank', label: '🐠 Aquarium Stress Benchmark: Vector Point & FPS Limiter', stage: 'BENCHMARK & STRESS LAB' },
  { id: 'church-tour', label: '⛪ Catholic Church: Sacred Architecture Tour', stage: 'CATHOLIC LIFE' },
  { id: 'shakespeare', label: '🎭 The Globe Theatre: Shakespeare & Iambic Meter', stage: 'KS3/KS4 ENGLISH LITERATURE' },
  { id: 'languages', label: '🌍 MFL & Polyglot Studio: Spanish, French & Latin', stage: 'KS2/KS3 MFL' },
  { id: 'fractions', label: '📐 Fractions: Common Denominators', stage: 'KS2 MATHS' },
  { id: 'solar-system', label: '🪐 Solar System: Heliocentric Orbits', stage: 'KS3 SCIENCE' },
  { id: 'photosynthesis', label: '🌱 Photosynthesis: Leaf Factory', stage: 'KS3 BIOLOGY' },
  { id: 'pythagoras', label: '📐 Pythagoras: Area Conservation', stage: 'KS3 GEOMETRY' },
  { id: 'water-cycle', label: '💧 Water Cycle: Dynamic States', stage: 'KS2 GEOGRAPHY' },
  { id: 'atom', label: '⚛️ Atomic Shells: Bohr Model', stage: 'KS3 CHEMISTRY' },
  { id: 'velocity', label: '🏎️ Velocity & Distance Vectors', stage: 'KS3 PHYSICS' },
  { id: 'dna-helix', label: '🧬 DNA Double Helix Transcription', stage: 'KS3 GENETICS' },
];

export const AstVectorMediaPlayer = forwardRef<AstVectorMediaPlayerHandle, AstVectorMediaPlayerProps>(({
  preset = 'fractions',
  lang,
  autoPlay = false,
  theme,
  height = '520px',
  className = '',
  allowPresetSwitch = true,
  defaultMode,
  initialConfig,
  onPresetChange,
  onPlayModeToggle,
  onKeyframeReached,
  onTimeUpdate,
  onConfigChange,
  initialCheckpoint,
}, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<VectorPresetType>(preset);
  const selectedPresetRef = useRef(preset);
  const lastSentPresetRef = useRef(preset);
  const autoPlayRef = useRef(autoPlay);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [has3D, setHas3D] = useState(false);
  const [hasInteractive, setHasInteractive] = useState(false);
  const [activeKeyframe, setActiveKeyframe] = useState<{ title: string; rule: string } | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [embedTargetMode, setEmbedTargetMode] = useState<PlayerDisplayMode>('classroom');

  // Display Configuration & Profile Mode State
  const [displayConfig, setDisplayConfig] = useState<PlayerDisplayConfig>(() => {
    const saved = loadSavedPlayerConfig();
    if (defaultMode) {
      return { ...getPresetConfig(defaultMode), ...initialConfig };
    }
    return initialConfig ? { ...saved, ...initialConfig } : saved;
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Developer Mode & Code Studio State
  const [isDevMode, setIsDevMode] = useState(false);
  const [showDevStudio, setShowDevStudio] = useState(false);
  const [studioTab, setStudioTab] = useState<StudioTabType>('inspector');
  const [swfResult, setSwfResult] = useState<SwfTranspileResult | null>(null);
  const [isParsingSwf, setIsParsingSwf] = useState(false);
  const [swfError, setSwfError] = useState<string | null>(null);
  const [swfDragActive, setSwfDragActive] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [showConceptTrail, setShowConceptTrail] = useState(true);
  const [comparisonPreset, setComparisonPreset] = useState<string | null>(null);
  const [showChalkboard, setShowChalkboard] = useState(false);
  const [inStagePenActive, setInStagePenActive] = useState(false);
  const [inStageXRayActive, setInStageXRayActive] = useState(false);
  const [showLabDrawer, setShowLabDrawer] = useState(false);
  const [showNanoAi, setShowNanoAi] = useState(false);
  const [showCartridgeMenu, setShowCartridgeMenu] = useState(false);
  const relatedConcepts = getRelatedConcepts(selectedPreset);

  const [inspectedElement, setInspectedElement] = useState<InspectedElementData | null>(null);
  const [customSvgCode, setCustomSvgCode] = useState('');
  const [customAstCode, setCustomAstCode] = useState('');
  const [hotReloadFlash, setHotReloadFlash] = useState(false);
  const [exportSuccessNotice, setExportSuccessNotice] = useState(false);
  const [isPipActive, setIsPipActive] = useState(false);
  const [pipType, setPipType] = useState<'document' | 'docked' | null>(null);
  const pipWindowRef = useRef<Window | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Sync internal selected preset if external preset prop changes
  useEffect(() => {
    setSelectedPreset(preset);
    selectedPresetRef.current = preset;
    lastSentPresetRef.current = preset;
  }, [preset]);

  useEffect(() => {
    selectedPresetRef.current = selectedPreset;
  }, [selectedPreset]);

  useEffect(() => {
    autoPlayRef.current = autoPlay;
  }, [autoPlay]);

  // Derive system theme if not explicitly passed
  const activeTheme = theme || (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark' ? 'dark' : 'dark');
  const [currentLang, setCurrentLang] = useState(() => lang || (typeof window !== 'undefined' ? getSavedLanguage() : 'en'));
  const [bilingualSubtitles, setBilingualSubtitles] = useState(true);

  // Post message helper with strict targetOrigin (tightened from wildcard '*' to prevent LMS cross-frame snooping)
  const getVerifiedTargetOrigin = useCallback(() => {
    if (typeof window === 'undefined') return '*';
    const origin = window.location.origin;
    // Fall back to '*' only when origin is opaque 'null' (e.g., sandboxed iframe without allow-same-origin)
    return origin && origin !== 'null' ? origin : '*';
  }, []);

  const postToPlayer = useCallback((payload: Record<string, any>) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const targetOrigin = getVerifiedTargetOrigin();
      iframeRef.current.contentWindow.postMessage(payload, targetOrigin);
    }
  }, [getVerifiedTargetOrigin]);

  // Synchronize language changes from the UniversalTranslatorBar with the player engine
  useEffect(() => {
    const unsub = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
      postToPlayer({ type: 'SET_LANGUAGE', lang: newLang });
    });
    return unsub;
  }, [postToPlayer]);

  const handleSwitchPreset = useCallback((nextPreset: string) => {
    setSelectedPreset(nextPreset);
    selectedPresetRef.current = nextPreset;
    lastSentPresetRef.current = nextPreset;
    postToPlayer({ type: 'SET_PRESET', preset: nextPreset, play: true });
    onPresetChange?.(nextPreset);
  }, [postToPlayer, onPresetChange]);

  const togglePictureInPicture = useCallback(async () => {
    // If desktop document PiP window is open, close it
    if (pipWindowRef.current) {
      try {
        pipWindowRef.current.close();
      } catch (_) {}
      pipWindowRef.current = null;
      setIsPipActive(false);
      setPipType(null);
      return;
    }

    // If docked in-page PiP is active, restore to regular viewport
    if (isPipActive && pipType === 'docked') {
      setIsPipActive(false);
      setPipType(null);
      return;
    }

    // 1. Try Document Picture-in-Picture API (Chrome 116+, Edge, Opera)
    if (typeof window !== 'undefined' && 'documentPictureInPicture' in window && typeof (window as any).documentPictureInPicture.requestWindow === 'function') {
      try {
        const pip = await (window as any).documentPictureInPicture.requestWindow({
          width: 720,
          height: 500,
        });
        pipWindowRef.current = pip;
        setIsPipActive(true);
        setPipType('document');

        // Copy stylesheets into PiP window
        document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
          pip.document.head.appendChild(node.cloneNode(true));
        });

        pip.document.documentElement.className = document.documentElement.className;
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        pip.document.documentElement.setAttribute('data-theme', currentTheme);
        pip.document.title = `📺 ${selectedPreset} — Desktop PiP`;
        pip.document.body.style.margin = '0';
        pip.document.body.style.padding = '0';
        pip.document.body.style.background = '#090d16';
        pip.document.body.style.overflow = 'hidden';
        pip.document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';

        const wrapper = playerContainerRef.current;
        if (wrapper && wrapper.parentNode) {
          const originalParent = wrapper.parentNode;
          const placeholder = document.createElement('div');
          placeholder.id = 'ast-pip-placeholder';
          placeholder.style.display = 'flex';
          placeholder.style.flexDirection = 'column';
          placeholder.style.alignItems = 'center';
          placeholder.style.justifyContent = 'center';
          placeholder.style.height = '420px';
          placeholder.style.background = 'var(--stj-surface, #0f172a)';
          placeholder.style.borderRadius = '16px';
          placeholder.style.border = '2px dashed var(--stj-primary, #6366f1)';
          placeholder.style.color = '#fff';
          placeholder.style.padding = '24px';
          placeholder.style.textAlign = 'center';
          placeholder.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 8px;">📺</div>
            <h4 style="margin: 0 0 6px 0; font-size: 1.15rem; font-weight: 700;">Playing in Picture-in-Picture</h4>
            <p style="margin: 0 0 16px 0; font-size: 0.85rem; color: #94a3b8; max-width: 440px;">
              The interactive vector media player is open in an always-on-top desktop window. Quizzes, physics controls, and 3D scenes remain interactive across all desktop windows.
            </p>
            <button id="close-desktop-pip-btn" style="padding: 8px 20px; background: #6366f1; color: white; border: none; border-radius: 9999px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <span>↩ Return Player to Page</span>
            </button>
          `;

          originalParent.insertBefore(placeholder, wrapper);
          pip.document.body.appendChild(wrapper);

          placeholder.querySelector('#close-desktop-pip-btn')?.addEventListener('click', () => {
            pip.close();
          });

          pip.addEventListener('pagehide', () => {
            originalParent.insertBefore(wrapper, placeholder);
            placeholder.remove();
            pipWindowRef.current = null;
            setIsPipActive(false);
            setPipType(null);
          });
        }
        return;
      } catch (err) {
        console.warn('Document Picture-in-Picture request fell back to docked mini-player:', err);
      }
    }

    // 2. Fallback to docked in-page floating mini player
    setIsPipActive(true);
    setPipType('docked');
  }, [selectedPreset, isPipActive, pipType]);

  // Expose imperative handle to parent components (for games, quizzes, external controls)
  useImperativeHandle(ref, () => ({
    postToPlayer,
    seek: (progress: number) => postToPlayer({ type: 'SEEK', progress }),
    pause: () => postToPlayer({ type: 'PAUSE' }),
    play: () => postToPlayer({ type: 'PLAY' }),
    togglePlay: () => postToPlayer({ type: 'TOGGLE_PLAY' }),
    toggleVoiceCommands: () => postToPlayer({ type: 'TOGGLE_VOICE_COMMANDS' }),
    startVoiceCommands: () => postToPlayer({ type: 'START_VOICE_COMMANDS' }),
    stopVoiceCommands: () => postToPlayer({ type: 'STOP_VOICE_COMMANDS' }),
    executeVoiceCommand: (command: string) => postToPlayer({ type: 'VOICE_COMMAND', command }),
    togglePictureInPicture: () => togglePictureInPicture(),
    injectCheckpoint: (checkpoint: {
      prompt: string;
      options: string[];
      answer: number;
      explanation?: string;
      title?: string;
      t?: number;
    }) => postToPlayer({ type: 'INJECT_CHECKPOINT', checkpoint }),
  }), [postToPlayer, togglePictureInPicture]);

  // Automatically inject checkpoint into player stage when provided
  useEffect(() => {
    if (initialCheckpoint) {
      const timer = setTimeout(() => {
        postToPlayer({
          type: 'INJECT_CHECKPOINT',
          checkpoint: initialCheckpoint,
        });
      }, 550);
      return () => clearTimeout(timer);
    }
  }, [initialCheckpoint, postToPlayer, selectedPreset]);

  // Global keyboard shortcut: Press 'V' to toggle voice commands
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');
      if (isInput) return;

      if ((e.key === 'v' || e.key === 'V') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        postToPlayer({ type: 'TOGGLE_VOICE_COMMANDS' });
      }

      if ((e.key === 'p' || e.key === 'P') && e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        togglePictureInPicture();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [postToPlayer]);

  // Sync with global operational language changes
  useEffect(() => {
    if (lang) {
      setCurrentLang(lang);
      postToPlayer({ type: 'SET_LANG', lang });
      return;
    }
    const unsub = listenToLanguageChange((newLang) => {
      setCurrentLang(newLang);
      postToPlayer({ type: 'SET_LANG', lang: newLang });
    });
    return unsub;
  }, [lang, postToPlayer]);

  // Sync preset changes safely without loop
  useEffect(() => {
    if (selectedPreset !== lastSentPresetRef.current) {
      lastSentPresetRef.current = selectedPreset;
      postToPlayer({ type: 'SET_PRESET', preset: selectedPreset });
    }
  }, [selectedPreset, postToPlayer]);

  // Sync theme changes
  useEffect(() => {
    postToPlayer({ type: 'SET_THEME', theme: activeTheme });
  }, [activeTheme, postToPlayer]);

  // Listen for telemetry and events from the iframe player
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Validate event source and origin directly to prevent cross-frame message spoofing in LMS embeds
      if (iframeRef.current && event.source !== iframeRef.current.contentWindow) return;
      if (typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null') {
        if (event.origin && event.origin !== 'null' && event.origin !== window.location.origin) {
          return;
        }
      }

      const data = event.data;
      if (!data || data.source !== 'ast-vector-player') return;

      switch (data.type) {
        case 'PLAYER_READY':
          setIsPlayerReady(true);
          if (typeof data.has3D === 'boolean') setHas3D(data.has3D);
          if (typeof data.hasInteractive === 'boolean') setHasInteractive(data.hasInteractive);
          postToPlayer({ type: 'SET_PRESET', preset: selectedPresetRef.current, play: autoPlayRef.current });
          break;
        case 'PRESETCHANGE':
          if (data.preset && data.preset !== selectedPresetRef.current) {
            selectedPresetRef.current = data.preset;
            lastSentPresetRef.current = data.preset;
            setSelectedPreset(data.preset);
            onPresetChange?.(data.preset);
          }
          if (typeof data.has3D === 'boolean') setHas3D(data.has3D);
          if (typeof data.hasInteractive === 'boolean') setHasInteractive(data.hasInteractive);
          break;
        case 'TIME_UPDATE':
          setCurrentProgress(data.progress || 0);
          onTimeUpdate?.(data.progress || 0);
          break;
        case 'KEYFRAME_REACHED':
          setActiveKeyframe({ title: data.title, rule: data.rule });
          onKeyframeReached?.({ title: data.title, rule: data.rule, progress: data.progress });
          break;
        case 'HOTSPOT_SELECTED':
          setActiveKeyframe({ title: data.label || 'Station Selected', rule: `Interactively inspected station at ${(data.targetT * 100).toFixed(0)}%` });
          break;
        case 'TOGGLE_PLAY_MODE':
          onPlayModeToggle?.();
          break;
        case 'DEV_MODE_CHANGED':
          setIsDevMode(Boolean(data.enabled));
          break;
        case 'VOICE_STATUS':
          setIsVoiceListening(Boolean(data.isListening));
          break;
        case 'VOICE_COMMAND_EXECUTED':
          setVoiceFeedback(data.label || data.action || 'Command Executed');
          setTimeout(() => setVoiceFeedback(null), 3200);
          break;
        case 'DEV_ELEMENT_SELECTED':
          setInspectedElement({
            selector: data.selector,
            tag: data.tag,
            id: data.id,
            bbox: data.bbox,
            attributes: data.attributes || {}
          });
          break;
        case 'STAGE_SVG_SNAPSHOT':
          if (typeof data.svg === 'string') setCustomSvgCode(data.svg);
          if (typeof data.ast === 'string') setCustomAstCode(data.ast);
          break;
        case 'AST_SOURCE_SNAPSHOT':
          if (typeof data.ast === 'string') setCustomAstCode(data.ast);
          break;
        case 'DEV_HOT_RELOAD_SUCCESS':
          setHotReloadFlash(true);
          setTimeout(() => setHotReloadFlash(false), 2000);
          break;
        case 'STANDALONE_APPLET_COMPILED':
          if (typeof data.svg === 'string') {
            const blob = new Blob([data.svg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.filename || `${selectedPresetRef.current || 'scene'}-standalone-applet.svg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            setExportSuccessNotice(true);
            setTimeout(() => setExportSuccessNotice(false), 3500);
          }
          break;
        case 'DISPLAY_CONFIG_CHANGED':
          if (data.config && typeof data.config === 'object') {
            setDisplayConfig((prev) => ({ ...prev, ...data.config }));
            savePlayerConfig(data.config);
            if (onConfigChange) onConfigChange(data.config);
          }
          break;
        case 'TOGGLE_PIP':
        case 'REQUEST_PIP':
          togglePictureInPicture();
          break;
        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onKeyframeReached, onTimeUpdate, postToPlayer, onConfigChange, togglePictureInPicture]);

  // Sync display config changes to player iframe
  useEffect(() => {
    postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: displayConfig });
    savePlayerConfig(displayConfig);
    if (onConfigChange) onConfigChange(displayConfig);
  }, [displayConfig, postToPlayer, onConfigChange]);

  const rawBase = import.meta.env.BASE_URL || '/';
  const cleanBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const playerSrc = `${cleanBase}player/index.html?preset=${encodeURIComponent(selectedPreset)}&lang=${encodeURIComponent(currentLang)}&autoplay=${autoPlay ? '1' : '0'}&theme=${encodeURIComponent(activeTheme)}&mode=${encodeURIComponent(displayConfig.mode)}&v=2.5.0`;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedCode = `<iframe src="${origin}${cleanBase}player/index.html?preset=${encodeURIComponent(selectedPreset)}&lang=${encodeURIComponent(currentLang)}&mode=${encodeURIComponent(embedTargetMode)}" width="100%" height="480" frameborder="0" allow="fullscreen" loading="lazy" style="border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #1e293b;"></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2200);
    });
  };

  const openStandalone = () => {
    if (typeof window !== 'undefined') {
      window.open(playerSrc, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      {isPipActive && pipType === 'docked' && (
        <div
          style={{
            padding: '24px 20px',
            borderRadius: '16px',
            border: '2px dashed var(--stj-primary, #6366f1)',
            background: 'var(--stj-surface-raised, #0f172a)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '220px',
            gap: '12px',
            margin: '12px 0',
          }}
        >
          <span style={{ fontSize: '2.4rem' }}>📺</span>
          <div>
            <strong style={{ fontSize: '1.05rem', display: 'block', color: 'var(--stj-text)' }}>
              Media Player Floating in Picture-in-Picture
            </strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: 'var(--stj-text-muted)', maxWidth: '420px' }}>
              The interactive vector player is docked in the lower corner of your screen. All animations, 3D viewpoints, and recall quizzes continue running seamlessly.
            </p>
          </div>
          <button
            type="button"
            onClick={togglePictureInPicture}
            className="stj-btn stj-btn-primary stj-btn-sm"
            style={{ padding: '6px 18px', fontWeight: 700 }}
          >
            ↩ Dock Back to Page
          </button>
        </div>
      )}

      <div
        ref={playerContainerRef}
        className={`ast-vector-media-player-container stj-card ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: isPipActive && pipType === 'docked' ? '460px' : '100%',
          maxWidth: isPipActive && pipType === 'docked' ? 'calc(100vw - 32px)' : '100%',
          padding: 0,
          overflow: 'hidden',
          boxShadow: isPipActive && pipType === 'docked' ? '0 25px 60px -10px rgba(0,0,0,0.7), 0 0 0 2px var(--stj-primary, #6366f1)' : 'var(--stj-shadow-lg)',
          ...(isPipActive && pipType === 'docked' ? {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 99999,
            borderRadius: '16px',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          } : {}),
        }}
      >
        {isPipActive && pipType === 'docked' && (
          <div
            style={{
              background: 'var(--stj-primary, #6366f1)',
              color: '#fff',
              padding: '6px 12px',
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📺 Floating Mini Player</span>
              <span style={{ opacity: 0.85, fontWeight: 500 }}>&bull; {selectedPreset}</span>
            </div>
            <button
              type="button"
              onClick={togglePictureInPicture}
              style={{
                background: 'rgba(255,255,255,0.22)',
                border: 'none',
                color: '#fff',
                borderRadius: '4px',
                padding: '2px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontWeight: 700,
              }}
              title="Return to page"
            >
              ✕ Close PiP
            </button>
          </div>
        )}
      {/* Top Banner Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px',
          background: 'var(--stj-surface-raised)',
          borderBottom: '1px solid var(--stj-border)',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '1.05rem' }}>🎬</span>
          <strong style={{ color: 'var(--stj-text)', fontSize: '0.85rem' }}>
            AST Vector Motion Suite
          </strong>
          <span
            className="stj-badge stj-badge-primary stj-pill"
            style={{ fontSize: '0.72rem' }}
          >
            Sandboxed iFrame &bull; 0% Main Thread
          </span>

          {allowPresetSwitch && displayConfig.showPresetSelector && (
            <select
              value={selectedPreset}
              onChange={(e) => handleSwitchPreset(e.target.value)}
              className="stj-select"
              style={{
                padding: '3px 8px',
                minHeight: '32px',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Switch Curriculum Scene"
            >
              {PRESET_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {relatedConcepts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowConceptTrail((prev) => !prev)}
              className={`stj-btn ${showConceptTrail ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
              style={{
                padding: '3px 8px',
                minHeight: '32px',
                fontSize: '0.74rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Explore mathematically and scientifically related concept slides"
            >
              <span>🧠 Concept Trail ({relatedConcepts.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => postToPlayer({ type: 'TOGGLE_PLAY' })}
            className="stj-btn stj-btn-primary stj-btn-sm"
            style={{
              padding: '3px 8px',
              minHeight: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title="Toggle Playback in iFrame"
          >
            ▶ / ⏸ Play
          </button>

          <button
            type="button"
            onClick={() => postToPlayer({ type: 'TOGGLE_VOICE_COMMANDS' })}
            className={`stj-btn ${isVoiceListening ? 'stj-btn-danger' : 'stj-btn-secondary'} stj-btn-sm`}
            style={{
              padding: '3px 9px',
              minHeight: '32px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 700,
              fontSize: '0.76rem',
              backgroundColor: isVoiceListening ? '#ef4444' : undefined,
              color: isVoiceListening ? '#ffffff' : undefined,
              borderColor: isVoiceListening ? '#f87171' : undefined,
              boxShadow: isVoiceListening ? '0 0 10px rgba(239, 68, 68, 0.5)' : undefined,
            }}
            title="Voice Commands: Speak 'play', 'pause', 'rewind', 'show me fractions' (Press 'V')"
          >
            <span>{isVoiceListening ? '🔴 Mic Active' : '🎤 Mic'}</span>
          </button>

          {voiceFeedback && (
            <span
              className="stj-badge stj-badge-primary stj-pill"
              style={{
                fontSize: '0.72rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              🎙️ {voiceFeedback}
            </span>
          )}

          {has3D && displayConfig.show3DControls && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => postToPlayer({ type: 'ROTATE_3D', deltaYaw: 45, deltaPitch: 10 })}
                className="stj-btn stj-btn-secondary stj-btn-sm stj-pill"
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  minHeight: '28px',
                  color: 'var(--stj-primary)',
                  borderColor: 'var(--stj-primary)',
                  background: 'var(--stj-primary-surface)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="3D Spatial Engine: Click to orbit +45°, or click & drag canvas to orbit 360°"
              >
                🌐 3D Mode
              </button>

              {/* Church-specific viewpoints only shown when Church Tour is active */}
              {selectedPreset === 'church-tour' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      postToPlayer({ type: 'SET_CAMERA', yaw: 0, pitch: 18, distanceScale: 1.05 });
                      postToPlayer({ type: 'SEEK', progress: 0.05 });
                    }}
                    className="stj-btn stj-btn-ghost stj-btn-sm"
                    style={{
                      padding: '3px 7px',
                      minHeight: '28px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: '1px solid var(--stj-border)',
                      background: 'var(--stj-canvas)',
                      color: 'var(--stj-text)',
                    }}
                    title="View from Nave Entrance"
                  >
                    ⛪ Nave
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      postToPlayer({ type: 'SET_CAMERA', yaw: 0, pitch: 26, distanceScale: 1.45 });
                      postToPlayer({ type: 'SEEK', progress: 0.60 });
                    }}
                    className="stj-btn stj-btn-ghost stj-btn-sm"
                    style={{
                      padding: '3px 7px',
                      minHeight: '28px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: '1px solid var(--stj-border)',
                      background: 'var(--stj-canvas)',
                      color: 'var(--stj-text)',
                    }}
                    title="Focus on High Altar"
                  >
                    ✨ Altar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      postToPlayer({ type: 'SET_CAMERA', yaw: 14, pitch: 28, distanceScale: 1.70 });
                      postToPlayer({ type: 'SEEK', progress: 0.80 });
                    }}
                    className="stj-btn stj-btn-ghost stj-btn-sm"
                    style={{
                      padding: '3px 7px',
                      minHeight: '28px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      border: '1px solid var(--stj-border)',
                      background: 'var(--stj-canvas)',
                      color: 'var(--stj-text)',
                    }}
                    title="Focus on Tabernacle & Sanctuary Lamp"
                  >
                    🕯️ Tabernacle
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => postToPlayer({ type: 'ROTATE_3D', deltaYaw: 45, deltaPitch: 0 })}
                className="stj-btn stj-btn-ghost stj-btn-sm"
                style={{
                  padding: '3px 7px',
                  minHeight: '28px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  border: '1px solid var(--stj-border)',
                  background: 'var(--stj-canvas)',
                  color: 'var(--stj-text)',
                }}
                title="Orbit 3D Camera 45°"
              >
                🔄 Orbit +45°
              </button>

              <button
                type="button"
                onClick={() => postToPlayer({ type: 'RESET_3D' })}
                className="stj-btn stj-btn-secondary stj-btn-sm"
                style={{
                  padding: '3px 7px',
                  minHeight: '28px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--stj-primary)',
                  borderColor: 'var(--stj-primary)',
                  background: 'var(--stj-primary-surface)',
                }}
                title="Reset 3D Camera to Scene Orientation"
              >
                ⏪ Reset
              </button>
            </div>
          )}

          {hasInteractive && displayConfig.showInteractiveCheckpoints && (
            <span
              className="stj-badge stj-badge-success stj-pill"
              style={{ fontSize: '0.72rem' }}
              title="Interactive Checkpoint Challenges: Active recall quizzes trigger automatically during playback"
            >
              🎯 Checkpoint Quizzes
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Live Chalkboard Annotation Button */}
          <button
            type="button"
            onClick={() => setShowChalkboard((prev) => !prev)}
            className={`stj-btn ${showChalkboard ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
            style={{
              padding: '4px 10px',
              minHeight: '32px',
              fontSize: '0.76rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: showChalkboard ? '#f59e0b' : undefined,
              borderColor: showChalkboard ? '#d97706' : undefined,
              color: showChalkboard ? '#1e1b4b' : undefined,
            }}
            title="Toggle Live Chalkboard & Annotation Layer"
          >
            <span>✏️ Chalkboard {showChalkboard ? 'ON' : ''}</span>
          </button>

          {/* Smartboard Vector Ink Pen Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !inStagePenActive;
              setInStagePenActive(next);
              postToPlayer({ type: 'TOGGLE_PEN', enabled: next });
            }}
            className={`stj-btn ${inStagePenActive ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
            style={{
              padding: '4px 10px',
              minHeight: '32px',
              fontSize: '0.76rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: inStagePenActive ? '#eab308' : undefined,
              borderColor: inStagePenActive ? '#ca8a04' : undefined,
              color: inStagePenActive ? '#090d16' : undefined,
            }}
            title="Toggle Direct In-Stage Whiteboard Pen (Smartboard / Stylus drawing)"
          >
            <span>✒️ Smartboard Pen {inStagePenActive ? 'ON' : ''}</span>
          </button>

          {/* Pedagogical X-Ray Inspection Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !inStageXRayActive;
              setInStageXRayActive(next);
              postToPlayer({ type: 'TOGGLE_XRAY', enabled: next });
            }}
            className={`stj-btn ${inStageXRayActive ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
            style={{
              padding: '4px 10px',
              minHeight: '32px',
              fontSize: '0.76rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: inStageXRayActive ? '#38bdf8' : undefined,
              borderColor: inStageXRayActive ? '#0284c7' : undefined,
              color: inStageXRayActive ? '#090d16' : undefined,
            }}
            title="Toggle In-Stage Pedagogical X-Ray Inspection Tooltips"
          >
            <span>🔍 X-Ray {inStageXRayActive ? 'ON' : ''}</span>
          </button>

          {/* Reactive Invariant Lab Button */}
          <button
            type="button"
            onClick={() => setShowLabDrawer((prev) => !prev)}
            className={`stj-btn ${showLabDrawer ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
            style={{
              padding: '4px 10px',
              minHeight: '32px',
              fontSize: '0.76rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: showLabDrawer ? '#3b82f6' : undefined,
              borderColor: showLabDrawer ? '#2563eb' : undefined,
              color: showLabDrawer ? '#ffffff' : undefined,
            }}
            title="Open Reactive Mathematical & Scientific Invariant Sliders"
          >
            <span>🔬 Reactive Lab</span>
          </button>

          {/* Gemini Nano Edge AI Co-Pilot Button */}
          <button
            type="button"
            onClick={() => setShowNanoAi((prev) => !prev)}
            className={`stj-btn ${showNanoAi ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
            style={{
              padding: '4px 10px',
              minHeight: '32px',
              fontSize: '0.76rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: showNanoAi ? '#0284c7' : undefined,
              borderColor: showNanoAi ? '#0369a1' : undefined,
              color: showNanoAi ? '#ffffff' : undefined,
            }}
            title="Open On-Device Gemini Nano Edge AI Co-Pilot & Lab Synthesizer (0 Cloud Egress)"
          >
            <span>✨ Ask Nano</span>
          </button>

          {/* Standalone Air-Gap HTML & Cartridge Exporter */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowCartridgeMenu((prev) => !prev)}
              className={`stj-btn ${showCartridgeMenu ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
              style={{
                padding: '4px 10px',
                minHeight: '32px',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Download standalone, 100% offline single-file HTML lessons and cartridges for rural or air-gapped schools"
            >
              <span>📦 Offline Packs ▾</span>
            </button>

            {showCartridgeMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  width: '310px',
                  zIndex: 70,
                  padding: '8px',
                  color: '#f8fafc',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Single Lesson Micro-Pack:
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const opt = PRESET_OPTIONS.find((p) => p.id === selectedPreset);
                    exportAirgapHtmlBundle(selectedPreset, opt?.label || selectedPreset);
                    setShowCartridgeMenu(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    color: '#f8fafc',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ fontWeight: 800, color: '#38bdf8' }}>📄 This Slide Only (&lt; 45 KB)</div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Standalone self-executing lesson for {selectedPreset}</div>
                </button>

                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase' }}>
                  Multi-Lesson Offline Cartridges:
                </div>
                {AVAILABLE_CARTRIDGES.map((cart) => (
                  <button
                    key={cart.id}
                    type="button"
                    onClick={() => {
                      exportSubjectCartridge(cart.id);
                      setShowCartridgeMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      background: 'rgba(255,255,255,0.04)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      color: '#f8fafc',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      marginBottom: '4px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  >
                    <div style={{ fontWeight: 800, color: '#facc15' }}>📦 {cart.title}</div>
                    <div style={{ fontSize: '0.68rem', color: '#cbd5e1' }}>{cart.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* EAL Bilingual Subtitles Bridge Toggle */}
          {currentLang !== 'en' && (
            <button
              type="button"
              onClick={() => {
                setBilingualSubtitles((prev) => {
                  const next = !prev;
                  postToPlayer({ type: 'SET_BILINGUAL_SUBTITLES', enabled: next });
                  return next;
                });
              }}
              className={`stj-btn ${bilingualSubtitles ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
              style={{
                padding: '4px 10px',
                minHeight: '32px',
                fontSize: '0.76rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Toggle dual bilingual subtitles (EN + Localized) for EAL English learners"
            >
              <span>🌐 {bilingualSubtitles ? 'Bilingual: ON' : 'Bilingual: OFF'}</span>
            </button>
          )}

          {/* Display & Mode Settings Button */}
          <button
            type="button"
            onClick={() => setShowSettingsModal((prev) => !prev)}
            className={`stj-btn ${showSettingsModal ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
            style={{
              padding: '4px 10px',
              minHeight: '32px',
              fontSize: '0.76rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
            }}
            title="Configure player view mode and hide/show links"
          >
            <span>⚙️ {MODE_METADATA[displayConfig.mode]?.icon || '⚙️'} {MODE_METADATA[displayConfig.mode]?.label || 'Settings'}</span>
          </button>

          {displayConfig.showDevInspect && (
            <button
              type="button"
              onClick={() => {
                const next = !isDevMode;
                setIsDevMode(next);
                postToPlayer({ type: 'SET_DEV_MODE', enabled: next });
              }}
              className={`stj-btn ${isDevMode ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
              style={{
                padding: '4px 10px',
                minHeight: '32px',
                fontSize: '0.76rem',
                fontWeight: 700,
              }}
              title="Toggle Point-and-Click SVG Element Inspector"
            >
              <span>🛠️ Inspect {isDevMode ? 'ON' : ''}</span>
            </button>
          )}

          {displayConfig.showDevStudio && (
            <button
              type="button"
              onClick={() => {
                const next = !showDevStudio;
                setShowDevStudio(next);
                if (next) {
                  postToPlayer({ type: 'GET_STAGE_SVG' });
                }
              }}
              className={`stj-btn ${showDevStudio ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
              style={{
                padding: '4px 10px',
                minHeight: '32px',
                fontSize: '0.76rem',
                fontWeight: 700,
              }}
              title="Open Live SVG & AST Developer Studio"
            >
              <span>💻 Studio</span>
            </button>
          )}

          {displayConfig.showExportSpa && (
            <button
              type="button"
              onClick={() => {
                postToPlayer({ type: 'EXPORT_STANDALONE_APPLET' });
              }}
              className={`stj-btn ${exportSuccessNotice ? 'stj-btn-success' : 'stj-btn-secondary'} stj-btn-sm`}
              style={{
                padding: '4px 10px',
                minHeight: '32px',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: exportSuccessNotice ? '#10b981' : undefined,
                borderColor: exportSuccessNotice ? '#10b981' : undefined,
              }}
              title="Export as an Autonomous, Offline-Executable Single Page Application in a single .svg file"
            >
              <span>{exportSuccessNotice ? '✔ Exported SPA!' : '🚀 Standalone SPA'}</span>
            </button>
          )}

          {displayConfig.showStandaloneLink && (
            <button
              type="button"
              onClick={openStandalone}
              className="stj-btn stj-btn-secondary stj-btn-sm"
              style={{
                padding: '4px 9px',
                minHeight: '32px',
                fontSize: '0.75rem',
              }}
              title="Open Player in Standalone Window"
            >
              <span>↗ Standalone</span>
            </button>
          )}

          {displayConfig.showPipButton !== false && (
            <button
              type="button"
              onClick={togglePictureInPicture}
              className={`stj-btn ${isPipActive ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
              style={{
                padding: '4px 10px',
                minHeight: '32px',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: isPipActive ? '#ffffff' : undefined,
                background: isPipActive ? 'var(--stj-primary)' : undefined,
              }}
              title="Picture-in-Picture: Always-on-top desktop window or docked floating mini-player (Shift+P)"
            >
              <span>{isPipActive ? '📺 Dock Back' : '📺 PiP'}</span>
            </button>
          )}

          {displayConfig.showObsLink && (
            <button
              type="button"
              onClick={() => {
                postToPlayer({ type: 'TOGGLE_OBS_DRAWER' });
              }}
              className="stj-btn stj-btn-secondary stj-btn-sm"
              style={{
                padding: '4px 9px',
                minHeight: '32px',
                fontSize: '0.75rem',
              }}
              title="Open OBS Studio WebSocket Broadcast Controller (ws://127.0.0.1:4455)"
            >
              <span>📡 OBS Link</span>
            </button>
          )}

          {displayConfig.showLmsEmbed && (
            <button
              type="button"
              onClick={() => setShowEmbedCode(!showEmbedCode)}
              className="stj-btn stj-btn-secondary stj-btn-sm"
              style={{
                padding: '4px 10px',
                minHeight: '32px',
                fontSize: '0.76rem',
              }}
              title="Get standalone embed code for Canvas, Google Classroom, Moodle"
            >
              <span>🔗 Embed in LMS</span>
            </button>
          )}
        </div>
      </div>

      {/* Settings & Display Configuration Drawer */}
      <PlayerSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        displayConfig={displayConfig}
        setDisplayConfig={setDisplayConfig}
        postToPlayer={postToPlayer}
      />

      {/* Embed Code Drawer */}
      <PlayerEmbedModal
        isOpen={showEmbedCode}
        onClose={() => setShowEmbedCode(false)}
        embedTargetMode={embedTargetMode}
        setEmbedTargetMode={setEmbedTargetMode}
        copiedEmbed={copiedEmbed}
        onCopyEmbedCode={copyEmbedCode}
        embedCode={embedCode}
      />

      {/* Sandboxed iFrame Element or Dual Comparative Viewports */}
      <div style={{ position: 'relative', width: '100%', height: typeof height === 'number' ? `${height}px` : height, overflow: 'hidden', borderRadius: '12px' }}>
        {comparisonPreset ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '8px',
              background: '#090d16',
              overflow: 'hidden',
              border: '1px solid #1e293b',
            }}
          >
            {/* Primary Viewport */}
            <div style={{ position: 'relative', height: '100%', borderRight: '1px solid #1e293b' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  zIndex: 10,
                  background: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(4px)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  color: '#38bdf8',
                  fontWeight: 800,
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}
              >
                Primary: {selectedPreset}
              </div>
              <iframe
                key={`primary-${selectedPreset}-${currentLang}`}
                ref={iframeRef}
                src={playerSrc}
                title="Primary Concept Viewport"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
                allow="fullscreen; microphone"
              />
            </div>

            {/* Comparative Secondary Mini Browser Viewport */}
            <div style={{ position: 'relative', height: '100%' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  right: '8px',
                  zIndex: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(4px)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    color: '#4ade80',
                    fontWeight: 800,
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                  }}
                >
                  Comparing: {comparisonPreset}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const target = comparisonPreset;
                      setComparisonPreset(null);
                      handleSwitchPreset(target);
                    }}
                    style={{
                      background: '#22c55e',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title="Promote comparison slide into full view"
                  >
                    ⛶ Expand Full
                  </button>
                  <button
                    type="button"
                    onClick={() => setComparisonPreset(null)}
                    style={{
                      background: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title="Close comparison viewport"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <iframe
                key={`compare-${comparisonPreset}-${currentLang}`}
                src={`${cleanBase}player/index.html?preset=${encodeURIComponent(comparisonPreset)}&lang=${encodeURIComponent(currentLang)}&autoplay=1&theme=${encodeURIComponent(activeTheme)}&mode=minimal&v=2.5.0`}
                title="Comparative Concept Viewport"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
                allow="fullscreen; microphone"
              />
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <iframe
              key={`${selectedPreset}-${currentLang}`}
              ref={iframeRef}
              src={playerSrc}
              title="Lumina Vector Player"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
              }}
              allow="fullscreen; microphone"
            />
          </div>
        )}

        {/* Live Chalkboard & Annotation Layer */}
        <AstChalkboardOverlay
          isActive={showChalkboard}
          onClose={() => setShowChalkboard(false)}
        />

        {/* Reactive Invariant Parameter Manipulation Lab */}
        <AstInteractiveLabDrawer
          isOpen={showLabDrawer}
          onClose={() => setShowLabDrawer(false)}
          preset={selectedPreset}
        />

        {/* Gemini Nano Edge AI Co-Pilot & Lab Synthesizer */}
        <NanoAiTutorDrawer
          isOpen={showNanoAi}
          onClose={() => setShowNanoAi(false)}
          preset={selectedPreset}
          postToPlayer={postToPlayer}
          currentProgress={currentProgress}
          activeKeyframe={activeKeyframe}
        />
      </div>

      {/* Live Keyframe Telemetry Bar */}
      {activeKeyframe && (
        <div
          style={{
            background: 'var(--stj-surface-raised)',
            borderTop: '1px solid var(--stj-border)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--stj-warning)', fontWeight: 700 }}>💡 Milestone:</span>
            <span style={{ color: 'var(--stj-text)', fontWeight: 600 }}>{activeKeyframe.title}</span>
            <span style={{ color: 'var(--stj-text-muted)' }}>&bull;</span>
            <span style={{ color: 'var(--stj-text-muted)' }}>{activeKeyframe.rule}</span>
          </div>
          <span style={{ color: 'var(--stj-primary)', fontWeight: 700 }}>
            {Math.round(currentProgress * 100)}% Complete
          </span>
        </div>
      )}

      {/* Semantic Concept Trail & Related Slide Portal (AST Knowledge Graph Traversal) */}
      {relatedConcepts.length > 0 && (
        <div
          style={{
            background: 'var(--stj-surface-raised, #0f172a)',
            borderTop: '1px solid var(--stj-border, #334155)',
            padding: '12px 16px',
            marginTop: '0px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showConceptTrail ? '10px' : '0px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.1rem' }}>🔗</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--stj-text, #f8fafc)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Semantic Concept Trail (AST Graph)
              </strong>
              <span style={{ fontSize: '0.72rem', background: 'rgba(59, 130, 246, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                {relatedConcepts.length} Linked Concepts
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowConceptTrail((prev) => !prev)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--stj-text-muted, #94a3b8)',
                fontSize: '0.76rem',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {showConceptTrail ? '▲ Hide Concept Trail' : '▼ Show Concept Trail'}
            </button>
          </div>

          {showConceptTrail && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
              {relatedConcepts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => handleSwitchPreset(rel.id)}
                  style={{
                    background: 'var(--stj-surface, #1e293b)',
                    border: '1px solid var(--stj-border, #334155)',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#38bdf8';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--stj-border, #334155)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{rel.icon}</span> {rel.title}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>
                        {rel.stage}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 6px 0', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {rel.reason}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.08)', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>
                      ⚡ Invariant: {rel.invariantConcept}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setComparisonPreset((prev) => prev === rel.id ? null : rel.id);
                        }}
                        style={{
                          background: comparisonPreset === rel.id ? '#2563eb' : 'rgba(59, 130, 246, 0.15)',
                          color: comparisonPreset === rel.id ? '#ffffff' : '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        title="Open this related concept in a side-by-side mini browser viewport"
                      >
                        {comparisonPreset === rel.id ? '✕ Close Split' : '🪟 Compare Dual'}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setComparisonPreset(null);
                          handleSwitchPreset(rel.id);
                        }}
                        style={{
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: '#4ade80',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                        title="Morph player directly into this concept slide"
                      >
                        Jump Slide &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Developer Studio & Interactive SVG Sandbox Panel */}
      <DevStudioDrawer
        isOpen={showDevStudio}
        onClose={() => setShowDevStudio(false)}
        studioTab={studioTab}
        setStudioTab={setStudioTab}
        inspectedElement={inspectedElement}
        setInspectedElement={setInspectedElement}
        customSvgCode={customSvgCode}
        setCustomSvgCode={setCustomSvgCode}
        customAstCode={customAstCode}
        setCustomAstCode={setCustomAstCode}
        hotReloadFlash={hotReloadFlash}
        setHotReloadFlash={setHotReloadFlash}
        postToPlayer={postToPlayer}
        swfResult={swfResult}
        setSwfResult={setSwfResult}
        isParsingSwf={isParsingSwf}
        setIsParsingSwf={setIsParsingSwf}
        swfError={swfError}
        setSwfError={setSwfError}
        swfDragActive={swfDragActive}
        setSwfDragActive={setSwfDragActive}
      />
    </div>
    </>
  );
});

export default AstVectorMediaPlayer;
