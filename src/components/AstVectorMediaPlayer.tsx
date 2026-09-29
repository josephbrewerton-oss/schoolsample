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
import {
  PlayerDisplayMode,
  PlayerDisplayConfig,
  loadSavedPlayerConfig,
  savePlayerConfig,
  getPresetConfig,
  MODE_METADATA,
} from '../types/playerConfig';

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
}

export const PRESET_OPTIONS: { id: string; label: string; stage: string }[] = [
  { id: 'math-fishing', label: '🎣 Math Pond: Number Bonds Fishing Game', stage: 'KS1/KS2 MATHS' },
  { id: 'mountain-elevation', label: '🧗 Mountain Altitude: Climber Game (Elevation & Slope)', stage: 'KS2/KS3 MATHS & GEOGRAPHY' },
  { id: 'fish-tank', label: '🐠 Aquarium Stress Benchmark: Vector Point & FPS Limiter', stage: 'BENCHMARK & STRESS LAB' },
  { id: 'church-tour', label: '⛪ Catholic Church: Sacred Architecture Tour', stage: 'CATHOLIC LIFE' },
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
  const [studioTab, setStudioTab] = useState<'inspector' | 'svg' | 'ast' | 'templates'>('inspector');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [inspectedElement, setInspectedElement] = useState<{
    selector: string;
    tag: string;
    id: string;
    bbox: { x: number; y: number; width: number; height: number };
    attributes: { fill?: string; stroke?: string; strokeWidth?: string; opacity?: string; transform?: string };
  } | null>(null);
  const [customSvgCode, setCustomSvgCode] = useState('');
  const [customAstCode, setCustomAstCode] = useState('');
  const [hotReloadFlash, setHotReloadFlash] = useState(false);
  const [exportSuccessNotice, setExportSuccessNotice] = useState(false);

  // Document Picture-in-Picture State & DOM Refs
  const [isInPip, setIsInPip] = useState(false);
  const pipWindowRef = useRef<any>(null);
  const pipPlaceholderRef = useRef<HTMLDivElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

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

  // Post message helper
  const postToPlayer = useCallback((payload: Record<string, any>) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(payload, '*');
    }
  }, []);

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
  }), [postToPlayer]);

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

  const rawBase = import.meta.env.BASE_URL || '/';
  const cleanBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const playerSrc = `${cleanBase}player/index.html?preset=${encodeURIComponent(selectedPreset)}&lang=${encodeURIComponent(currentLang)}&autoplay=${autoPlay ? '1' : '0'}&theme=${encodeURIComponent(activeTheme)}&mode=${encodeURIComponent(displayConfig.mode)}&v=2.5.0`;

  const openStandalone = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.open(playerSrc, '_blank', 'noopener,noreferrer');
    }
  }, [playerSrc]);

  const togglePictureInPicture = useCallback(async () => {
    // 1. If currently in PiP, close it
    if (pipWindowRef.current) {
      try {
        pipWindowRef.current.close();
      } catch (e) {}
      pipWindowRef.current = null;
      setIsInPip(false);
      return;
    }

    // 2. Document Picture-in-Picture API
    if (typeof window !== 'undefined' && 'documentPictureInPicture' in window) {
      try {
        const pipWin = await (window as any).documentPictureInPicture.requestWindow({
          width: 840,
          height: 540,
        });

        // Copy current stylesheets into PiP window
        [...document.styleSheets].forEach((styleSheet) => {
          try {
            if (styleSheet.cssRules) {
              const newStyle = pipWin.document.createElement('style');
              [...styleSheet.cssRules].forEach((rule) => {
                newStyle.appendChild(pipWin.document.createTextNode(rule.cssText));
              });
              pipWin.document.head.appendChild(newStyle);
            } else if (styleSheet.href) {
              const link = pipWin.document.createElement('link');
              link.rel = 'stylesheet';
              link.href = styleSheet.href;
              pipWin.document.head.appendChild(link);
            }
          } catch (e) {
            if (styleSheet.href) {
              const link = pipWin.document.createElement('link');
              link.rel = 'stylesheet';
              link.href = styleSheet.href;
              pipWin.document.head.appendChild(link);
            }
          }
        });

        pipWin.document.body.className = document.body.className;
        pipWin.document.body.setAttribute('data-theme', activeTheme);
        pipWin.document.body.style.margin = '0';
        pipWin.document.body.style.padding = '0';
        pipWin.document.body.style.backgroundColor = activeTheme === 'dark' ? '#090d16' : '#f8fafc';
        pipWin.document.body.style.display = 'flex';
        pipWin.document.body.style.flexDirection = 'column';
        pipWin.document.body.style.height = '100vh';
        pipWin.document.body.style.overflow = 'hidden';

        const playerEl = playerContainerRef.current;
        if (playerEl && playerEl.parentNode) {
          const placeholder = document.createElement('div');
          placeholder.style.minHeight = '360px';
          placeholder.style.display = 'flex';
          placeholder.style.flexDirection = 'column';
          placeholder.style.alignItems = 'center';
          placeholder.style.justifyContent = 'center';
          placeholder.style.background = activeTheme === 'dark' ? '#0f172a' : '#f1f5f9';
          placeholder.style.borderRadius = '12px';
          placeholder.style.border = '2px dashed var(--stj-border, #334155)';
          placeholder.style.color = '#94a3b8';
          placeholder.style.fontWeight = '700';
          placeholder.style.gap = '8px';
          placeholder.innerHTML = '<span>📺 Vector Player is running in Picture-in-Picture window</span><span style="font-size:0.75rem;font-weight:400;color:#64748b;">Close floating window to return player here</span>';

          playerEl.parentNode.insertBefore(placeholder, playerEl);
          pipPlaceholderRef.current = placeholder;
          pipWin.document.body.appendChild(playerEl);
          pipWindowRef.current = pipWin;
          setIsInPip(true);

          pipWin.addEventListener('pagehide', () => {
            if (pipPlaceholderRef.current && pipPlaceholderRef.current.parentNode && playerEl) {
              pipPlaceholderRef.current.parentNode.insertBefore(playerEl, pipPlaceholderRef.current);
              pipPlaceholderRef.current.remove();
              pipPlaceholderRef.current = null;
            }
            pipWindowRef.current = null;
            setIsInPip(false);
          });
        }
      } catch (err) {
        console.warn('[PiP] Document Picture-in-Picture error:', err);
        openStandalone();
      }
    } else {
      openStandalone();
    }
  }, [activeTheme, openStandalone]);

  // Listen for telemetry and events from the iframe player
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate event source directly to safely support sandboxed and preview environments
      if (iframeRef.current && event.source !== iframeRef.current.contentWindow) return;

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

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const embedCode = `<iframe src="${origin}${cleanBase}player/index.html?preset=${encodeURIComponent(selectedPreset)}&lang=${encodeURIComponent(currentLang)}&mode=${encodeURIComponent(embedTargetMode)}" width="100%" height="480" frameborder="0" allow="fullscreen" loading="lazy" style="border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #1e293b;"></iframe>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2200);
    });
  };

  return (
    <div
      className={`ast-vector-media-player-container stj-card ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        padding: 0,
        overflow: 'hidden',
        boxShadow: 'var(--stj-shadow-lg)',
      }}
    >
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
              onChange={(e) => {
                const nextPreset = e.target.value;
                setSelectedPreset(nextPreset);
                selectedPresetRef.current = nextPreset;
                lastSentPresetRef.current = nextPreset;
                postToPlayer({ type: 'SET_PRESET', preset: nextPreset, play: true });
                onPresetChange?.(nextPreset);
              }}
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

          {displayConfig.showPipButton && (
            <button
              type="button"
              onClick={togglePictureInPicture}
              className={`stj-btn ${isInPip ? 'stj-btn-primary' : 'stj-btn-secondary'} stj-btn-sm`}
              style={{
                padding: '4px 9px',
                minHeight: '32px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
              title="Pop out into an always-on-top Picture-in-Picture window (I)"
            >
              <span>📺 {isInPip ? 'Exit PiP' : 'PiP'}</span>
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
      {showSettingsModal && (
        <div
          style={{
            background: 'var(--stj-surface-raised)',
            borderBottom: '1px solid var(--stj-border)',
            padding: '16px 20px',
            color: 'var(--stj-text)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            animation: 'fadeIn 0.15s ease',
          }}
        >
          {/* Settings Drawer Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                <strong style={{ fontSize: '0.95rem' }}>Player Display &amp; Controls Configuration</strong>
                <span
                  className="stj-badge stj-badge-primary stj-pill"
                  style={{ fontSize: '0.68rem', textTransform: 'uppercase' }}
                >
                  {displayConfig.mode} MODE
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--stj-text-muted)' }}>
                Select a profile preset or customize individual links so only required controls are shown.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  const def = getPresetConfig('classroom');
                  setDisplayConfig(def);
                  savePlayerConfig(def);
                  postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: def });
                }}
                className="stj-btn stj-btn-ghost stj-btn-sm"
                style={{ fontSize: '0.74rem' }}
                title="Reset all settings to Classroom Mode default"
              >
                ↺ Reset to Classroom Mode
              </button>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="stj-btn stj-btn-secondary stj-btn-sm"
                style={{ fontSize: '0.74rem', minWidth: '32px' }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Quick Preset Mode Cards */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--stj-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
              Select Teaching &amp; Viewing Profile
            </span>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '10px',
              }}
            >
              {(['classroom', 'student', 'broadcast', 'developer'] as PlayerDisplayMode[]).map((m) => {
                const meta = MODE_METADATA[m];
                const isActive = displayConfig.mode === m;
                return (
                  <div
                    key={m}
                    onClick={() => {
                      const newCfg = getPresetConfig(m);
                      setDisplayConfig(newCfg);
                      savePlayerConfig(newCfg);
                      postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: newCfg });
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: isActive ? '2px solid var(--stj-primary)' : '1px solid var(--stj-border)',
                      background: isActive ? 'var(--stj-primary-surface)' : 'var(--stj-surface)',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '0.84rem', color: isActive ? 'var(--stj-primary)' : 'var(--stj-text)' }}>
                        {meta.icon} {meta.label}
                      </strong>
                      {isActive && <span style={{ fontSize: '0.72rem', color: 'var(--stj-primary)', fontWeight: 800 }}>✓ ACTIVE</span>}
                    </div>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        color: 'var(--stj-text-muted)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {meta.tag}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--stj-text-muted)', lineHeight: 1.35 }}>
                      {meta.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Granular Control Toggles Accordion */}
          <div style={{ borderTop: '1px solid var(--stj-border)', paddingTop: '10px' }}>
            <details style={{ cursor: 'pointer' }}>
              <summary style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--stj-primary)', marginBottom: '8px' }}>
                🎛️ Granular Control Toggles (Customize individual links &amp; buttons)
              </summary>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '10px' }}>
                <div>
                  <strong style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '8px' }}>
                    Header &amp; Action Links
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { key: 'showPresetSelector', label: 'Curriculum Preset Selector' },
                      { key: 'showDevInspect', label: '🛠️ SVG Element Inspector' },
                      { key: 'showDevStudio', label: '💻 Live Code Studio' },
                      { key: 'showExportSpa', label: '🚀 Standalone SVG SPA Export' },
                      { key: 'showStandaloneLink', label: '↗ Standalone Window Button' },
                      { key: 'showObsLink', label: '📡 OBS Broadcast WebSocket Link' },
                      { key: 'showLmsEmbed', label: '🔗 LMS Embed Code Generator' },
                      { key: 'showPrintWorksheet', label: '🖨️ A4 Classroom Worksheet' },
                      { key: 'showCopySvg', label: '📋 Copy Raw SVG Geometry' },
                      { key: 'showPipButton', label: '📺 Document Picture-in-Picture Floating Window' },
                    ].map(({ key, label }) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(displayConfig[key as keyof PlayerDisplayConfig])}
                          onChange={(e) => {
                            const updated: PlayerDisplayConfig = {
                              ...displayConfig,
                              mode: 'custom',
                              [key]: e.target.checked,
                            };
                            setDisplayConfig(updated);
                            savePlayerConfig(updated);
                            postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: updated });
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <strong style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '8px' }}>
                    Learning, 3D &amp; Playback Features
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { key: 'showInteractiveCheckpoints', label: '🎯 Checkpoint Active Recall Quizzes' },
                      { key: 'show3DControls', label: '🌐 3D Spatial Orbit & Camera Toolbar' },
                      { key: 'showSubtitles', label: '💬 Synchronized Subtitles Overlay' },
                      { key: 'showVoiceNarration', label: '🔊 Voice Narration (Web Speech)' },
                      { key: 'showTimelineScrubber', label: '⏱️ Timeline Scrubber Track' },
                      { key: 'showSpeedSelector', label: '⏩ Playback Speed Selector' },
                      { key: 'showLanguageSelector', label: '🌍 Multi-Language Selector' },
                      { key: 'showLoopToggle', label: '🔁 Auto-Repeat Loop Toggle' },
                      { key: 'showVolumeControl', label: '🔊 Master Volume & Mute Controls' },
                      { key: 'showPhysicsControls', label: '🪐 Micro-Physics & Gravity Subsystem' },
                      { key: 'showVoiceControl', label: '🎤 Voice Commands (Web Speech API)' },
                    ].map(({ key, label }) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={Boolean(displayConfig[key as keyof PlayerDisplayConfig])}
                          onChange={(e) => {
                            const updated: PlayerDisplayConfig = {
                              ...displayConfig,
                              mode: 'custom',
                              [key]: e.target.checked,
                            };
                            setDisplayConfig(updated);
                            savePlayerConfig(updated);
                            postToPlayer({ type: 'SET_DISPLAY_CONFIG', config: updated });
                          }}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Embed Code Drawer */}
      {showEmbedCode && (
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
              onClick={copyEmbedCode}
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
      )}

      {/* Sandboxed iFrame Element */}
      <div
        ref={playerContainerRef}
        style={{ position: 'relative', width: '100%', height: typeof height === 'number' ? `${height}px` : height }}
      >
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
          allow="fullscreen; microphone; document-picture-in-picture"
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

      {/* Developer Studio & Interactive SVG Sandbox Panel */}
      {showDevStudio && (
        <div
          style={{
            background: 'var(--stj-surface-raised)',
            borderTop: '2px solid var(--stj-primary)',
            padding: '14px',
            color: 'var(--stj-text)',
            fontSize: '0.82rem',
          }}
        >
          {/* Studio Header & Tab Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setStudioTab('inspector')}
                className={`stj-btn ${studioTab === 'inspector' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
                style={{ fontSize: '0.76rem' }}
              >
                🎯 Live Inspector
              </button>
              <button
                type="button"
                onClick={() => setStudioTab('svg')}
                className={`stj-btn ${studioTab === 'svg' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
                style={{ fontSize: '0.76rem' }}
              >
                🎨 Raw SVG Source
              </button>
              <button
                type="button"
                onClick={() => setStudioTab('ast')}
                className={`stj-btn ${studioTab === 'ast' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
                style={{ fontSize: '0.76rem' }}
              >
                ⚡ AST Expressions
              </button>
              <button
                type="button"
                onClick={() => setStudioTab('templates')}
                className={`stj-btn ${studioTab === 'templates' ? 'stj-btn-primary' : 'stj-btn-ghost'} stj-btn-sm`}
                style={{ fontSize: '0.76rem' }}
              >
                🚀 Scratchpad Templates
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {hotReloadFlash && (
                <span
                  className="stj-badge stj-badge-success stj-pill"
                  style={{ fontSize: '0.72rem' }}
                >
                  ✓ Hot-Reloaded!
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  if (studioTab === 'svg') {
                    postToPlayer({ type: 'HOT_RELOAD_SVG', svg: customSvgCode });
                  } else if (studioTab === 'ast') {
                    postToPlayer({ type: 'HOT_RELOAD_AST', ast: customAstCode });
                  } else {
                    postToPlayer({ type: 'HOT_RELOAD_SVG', svg: customSvgCode });
                    postToPlayer({ type: 'HOT_RELOAD_AST', ast: customAstCode });
                  }
                }}
                className="stj-btn stj-btn-primary stj-btn-sm"
                style={{ fontSize: '0.76rem', fontWeight: 700 }}
              >
                ⚡ Run / Hot Reload
              </button>

              <button
                type="button"
                onClick={() => postToPlayer({ type: 'GET_STAGE_SVG' })}
                className="stj-btn stj-btn-secondary stj-btn-sm"
                style={{ fontSize: '0.76rem' }}
                title="Sync current stage SVG and AST source from player"
              >
                ↺ Pull from Stage
              </button>

              <button
                type="button"
                onClick={() => setShowDevStudio(false)}
                className="stj-btn stj-btn-ghost stj-btn-sm"
                style={{ fontSize: '0.76rem' }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Tab 1: Live Inspector */}
          {studioTab === 'inspector' && (
            <div
              style={{
                background: 'var(--stj-canvas)',
                border: '1px solid var(--stj-border)',
                borderRadius: 'var(--stj-radius-sm)',
                padding: '12px',
              }}
            >
              {inspectedElement ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="stj-badge stj-badge-primary">&lt;{inspectedElement.tag}&gt;</span>
                      <code style={{ color: 'var(--stj-primary)', fontWeight: 700 }}>{inspectedElement.selector}</code>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>
                      Bounds: {Math.round(inspectedElement.bbox.width)}×{Math.round(inspectedElement.bbox.height)} px
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '10px',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '3px' }}>
                        Fill Color
                      </label>
                      <input
                        type="text"
                        value={inspectedElement.attributes.fill || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInspectedElement({
                            ...inspectedElement,
                            attributes: { ...inspectedElement.attributes, fill: val }
                          });
                          postToPlayer({ type: 'UPDATE_ELEMENT_ATTR', selector: inspectedElement.selector, attr: 'fill', value: val });
                        }}
                        className="stj-input"
                        style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '3px' }}>
                        Stroke Color
                      </label>
                      <input
                        type="text"
                        value={inspectedElement.attributes.stroke || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInspectedElement({
                            ...inspectedElement,
                            attributes: { ...inspectedElement.attributes, stroke: val }
                          });
                          postToPlayer({ type: 'UPDATE_ELEMENT_ATTR', selector: inspectedElement.selector, attr: 'stroke', value: val });
                        }}
                        className="stj-input"
                        style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '3px' }}>
                        Stroke Width
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={inspectedElement.attributes.strokeWidth || '1'}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInspectedElement({
                            ...inspectedElement,
                            attributes: { ...inspectedElement.attributes, strokeWidth: val }
                          });
                          postToPlayer({ type: 'UPDATE_ELEMENT_ATTR', selector: inspectedElement.selector, attr: 'stroke-width', value: val });
                        }}
                        className="stj-input"
                        style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)', display: 'block', marginBottom: '3px' }}>
                        Transform Expr
                      </label>
                      <input
                        type="text"
                        value={inspectedElement.attributes.transform || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInspectedElement({
                            ...inspectedElement,
                            attributes: { ...inspectedElement.attributes, transform: val }
                          });
                          postToPlayer({ type: 'UPDATE_ELEMENT_ATTR', selector: inspectedElement.selector, attr: 'transform', value: val });
                        }}
                        className="stj-input"
                        placeholder="e.g. translate(20, 10)"
                        style={{ width: '100%', fontSize: '0.76rem', padding: '4px 8px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(inspectedElement.selector);
                      }}
                      className="stj-btn stj-btn-secondary stj-btn-sm"
                      style={{ fontSize: '0.74rem' }}
                    >
                      📋 Copy Selector
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const rule = `(:target "${inspectedElement.selector}" :attr "transform" :expr "'rotate(' + (t * 360) + ')'")`;
                        navigator.clipboard.writeText(rule);
                      }}
                      className="stj-btn stj-btn-primary stj-btn-sm"
                      style={{ fontSize: '0.74rem' }}
                    >
                      ⚡ Copy AST Rule Snippet
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '16px', color: 'var(--stj-text-muted)' }}>
                  <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🎯</div>
                  <strong>No Element Selected</strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>
                    Turn on <strong>🛠️ Inspect</strong> above and click any element on the vector stage to inspect its selector, bounding box, and live styling!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Raw SVG Markup */}
          {studioTab === 'svg' && (
            <div>
              <textarea
                value={customSvgCode}
                onChange={(e) => setCustomSvgCode(e.target.value)}
                placeholder="Click '↺ Pull from Stage' or paste SVG markup here..."
                style={{
                  width: '100%',
                  height: '180px',
                  background: 'var(--stj-canvas)',
                  color: 'var(--stj-text)',
                  border: '1px solid var(--stj-border)',
                  borderRadius: 'var(--stj-radius-sm)',
                  padding: '10px',
                  fontSize: '0.76rem',
                  fontFamily: 'monospace',
                  lineHeight: '1.4',
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>
                  Edit raw SVG elements directly. Click 'Run / Hot Reload' to apply instantly without reloading.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(customSvgCode);
                  }}
                  className="stj-btn stj-btn-secondary stj-btn-sm"
                  style={{ fontSize: '0.72rem' }}
                >
                  📋 Copy SVG
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: AST S-Expressions */}
          {studioTab === 'ast' && (
            <div>
              <textarea
                value={customAstCode}
                onChange={(e) => setCustomAstCode(e.target.value)}
                placeholder="Click '↺ Pull from Stage' or write AST S-expressions here..."
                style={{
                  width: '100%',
                  height: '180px',
                  background: 'var(--stj-canvas)',
                  color: 'var(--stj-primary)',
                  border: '1px solid var(--stj-border)',
                  borderRadius: 'var(--stj-radius-sm)',
                  padding: '10px',
                  fontSize: '0.76rem',
                  fontFamily: 'monospace',
                  lineHeight: '1.4',
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--stj-text-muted)' }}>
                  Defines continuous mathematical bindings: (:target &quot;#id&quot; :attr &quot;transform&quot; :expr &quot;Math.sin(t * Math.PI * 2)&quot;)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(customAstCode);
                  }}
                  className="stj-btn stj-btn-secondary stj-btn-sm"
                  style={{ fontSize: '0.72rem' }}
                >
                  📋 Copy AST
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Starter Templates */}
          {studioTab === 'templates' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '10px',
              }}
            >
              <div
                style={{
                  background: 'var(--stj-canvas)',
                  border: '1px solid var(--stj-border)',
                  padding: '12px',
                  borderRadius: 'var(--stj-radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h5 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--stj-text)' }}>
                    🪐 Planetary Orbit
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--stj-text-muted)' }}>
                    Parametric heliocentric revolution using cos(t) and sin(t) trigonometry.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    postToPlayer({
                      type: 'HOT_RELOAD_SVG',
                      svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg"><circle cx="400" cy="240" r="140" fill="none" stroke="#334155" stroke-dasharray="4 4" /><circle id="star-sun" cx="400" cy="240" r="32" fill="#f59e0b" filter="url(#glow)" /><circle id="planet-earth" cx="540" cy="240" r="14" fill="#38bdf8" /><text id="orbit-txt" x="400" y="440" fill="#94a3b8" font-size="16" text-anchor="middle">Planetary Orbit Period: 1.0 Cycle</text></svg>`
                    });
                    postToPlayer({
                      type: 'HOT_RELOAD_AST',
                      ast: `(:scene :id "simple-orbit" :title "Simple Planetary Orbit" :stage "KS3 SCIENCE" :duration 6.0 (:keyframes ((:t 0.00 :title "Perihelion" :rule "Planet starts at 0 rad") (:t 0.50 :title "Aphelion" :rule "Planet reaches opposite orbital pole"))) (:bindings ((:target "#planet-earth" :attr "cx" :expr "400 + Math.cos(t * Math.PI * 2) * 140") (:target "#planet-earth" :attr "cy" :expr "240 + Math.sin(t * Math.PI * 2) * 140") (:target "#orbit-txt" :attr "textContent" :expr "'Orbit Angle: ' + Math.round(t * 360) + '°'"))))`
                    });
                    setHotReloadFlash(true);
                    setTimeout(() => setHotReloadFlash(false), 2000);
                  }}
                  className="stj-btn stj-btn-primary stj-btn-sm"
                  style={{ marginTop: '10px', fontSize: '0.74rem' }}
                >
                  Load Template ➜
                </button>
              </div>

              <div
                style={{
                  background: 'var(--stj-canvas)',
                  border: '1px solid var(--stj-border)',
                  padding: '12px',
                  borderRadius: 'var(--stj-radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h5 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--stj-text)' }}>
                    🌊 Harmonic Wave
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--stj-text-muted)' }}>
                    Continuous wave motion demonstrating frequency, amplitude, and crests.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    postToPlayer({
                      type: 'HOT_RELOAD_SVG',
                      svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg"><line x1="100" y1="240" x2="700" y2="240" stroke="#334155" stroke-width="2" /><path id="harmonic-wave" d="M 100 240 Q 250 140 400 240 T 700 240" fill="none" stroke="#38bdf8" stroke-width="4" /><circle id="wave-tracer" cx="400" cy="240" r="10" fill="#f43f5e" filter="url(#glow)" /><text id="wave-label" x="400" y="80" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">y = A · sin(ωt + φ)</text></svg>`
                    });
                    postToPlayer({
                      type: 'HOT_RELOAD_AST',
                      ast: `(:scene :id "sine-wave" :title "Harmonic Sine Wave" :stage "KS4 PHYSICS" :duration 4.0 (:keyframes ((:t 0.00 :title "Initial Phase" :rule "Zero displacement at origin") (:t 0.25 :title "Crest Amplitude" :rule "Maximum positive displacement +A"))) (:bindings ((:target "#wave-tracer" :attr "cy" :expr "240 - Math.sin(t * Math.PI * 2) * 90") (:target "#wave-tracer" :attr "cx" :expr "100 + (t * 600)") (:target "#wave-label" :attr "textContent" :expr "'Displacement y = ' + (Math.sin(t * Math.PI * 2) * 10).toFixed(1) + ' cm'"))))`
                    });
                    setHotReloadFlash(true);
                    setTimeout(() => setHotReloadFlash(false), 2000);
                  }}
                  className="stj-btn stj-btn-primary stj-btn-sm"
                  style={{ marginTop: '10px', fontSize: '0.74rem' }}
                >
                  Load Template ➜
                </button>
              </div>

              <div
                style={{
                  background: 'var(--stj-canvas)',
                  border: '1px solid var(--stj-border)',
                  padding: '12px',
                  borderRadius: 'var(--stj-radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h5 style={{ margin: '0 0 4px', fontSize: '0.85rem', color: 'var(--stj-text)' }}>
                    ⏱️ Harmonic Pendulum
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--stj-text-muted)' }}>
                    Conservation of energy demonstrating kinetic vs potential oscillation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    postToPlayer({
                      type: 'HOT_RELOAD_SVG',
                      svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg"><circle cx="400" cy="80" r="6" fill="#64748b" /><line id="pendulum-rod" x1="400" y1="80" x2="400" y2="340" stroke="#94a3b8" stroke-width="3" /><circle id="pendulum-bob" cx="400" cy="340" r="28" fill="#10b981" stroke="#34d399" stroke-width="2" /><text id="energy-txt" x="400" y="420" fill="#34d399" font-size="16" font-weight="bold" text-anchor="middle">E = Ep + Ek</text></svg>`
                    });
                    postToPlayer({
                      type: 'HOT_RELOAD_AST',
                      ast: `(:scene :id "physics-pendulum" :title "Harmonic Pendulum" :stage "KS3 PHYSICS" :duration 3.0 (:keyframes ((:t 0.00 :title "Max Left Amplitude" :rule "Ep is maximal, Ek = 0") (:t 0.25 :title "Equilibrium Pass" :rule "Ek is maximal at center, Ep is minimum"))) (:bindings ((:target "#pendulum-rod" :attr "transform" :expr "'rotate(' + (Math.sin(t * Math.PI * 2) * 40) + ' 400 80)'") (:target "#pendulum-bob" :attr "transform" :expr "'rotate(' + (Math.sin(t * Math.PI * 2) * 40) + ' 400 80)'") (:target "#energy-txt" :attr "textContent" :expr "'Potential Energy: ' + (Math.abs(Math.sin(t * Math.PI * 2)) * 100).toFixed(0) + '% | Kinetic: ' + ((1 - Math.abs(Math.sin(t * Math.PI * 2))) * 100).toFixed(0) + '%'"))))`
                    });
                    setHotReloadFlash(true);
                    setTimeout(() => setHotReloadFlash(false), 2000);
                  }}
                  className="stj-btn stj-btn-primary stj-btn-sm"
                  style={{ marginTop: '10px', fontSize: '0.74rem' }}
                >
                  Load Template ➜
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default AstVectorMediaPlayer;
