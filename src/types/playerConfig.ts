// src/types/playerConfig.ts
/**
 * AST Vector Media Player Display & Control Configuration
 * 
 * Defines profile presets (Classroom, Student, Broadcast, Developer, Custom)
 * and granular visibility flags for buttons, controls, and dev tools.
 */

export type PlayerDisplayMode = 'classroom' | 'student' | 'broadcast' | 'developer' | 'custom';

export interface PlayerDisplayConfig {
  mode: PlayerDisplayMode;
  
  // Header & Quick Action Buttons
  showPresetSelector: boolean;       // Switch between topics/scenes
  showStageBadge: boolean;           // Show stage tag (e.g. KS2 MATHS)
  showInteractiveCheckpoints: boolean;// 🎯 Checkpoint Quizzes badge & cards
  show3DControls: boolean;           // 🌐 3D Orbit / Viewpoint Toolbar
  showDevInspect: boolean;           // 🛠️ Inspect button (SVG Element Inspector)
  showDevStudio: boolean;            // 💻 Studio button (Live SVG/AST editor)
  showExportSpa: boolean;            // 🚀 Standalone SPA export button
  showStandaloneLink: boolean;       // ↗ Standalone window button
  showObsLink: boolean;              // 📡 OBS WebSocket Link button
  showLmsEmbed: boolean;             // 🔗 Embed in LMS button
  showPrintWorksheet: boolean;       // 🖨️ Print A4 Worksheet button
  showCopySvg: boolean;              // 📋 Copy Raw SVG button
  showThemeToggle: boolean;          // ☀️ Theme toggle
  showFullscreen: boolean;           // ⛶ Fullscreen button
  showPipButton?: boolean;           // 📺 Document Picture-in-Picture floating window button

  // Viewport & Playback Bar
  showTimelineScrubber: boolean;     // Timeline scrubber track
  showPlaybackControls: boolean;     // Play/Pause, step, reset, time readout
  showSpeedSelector: boolean;        // Playback speed dropdown (0.5× – 2.0×)
  showVoiceNarration: boolean;       // Voice narration toggle button
  showVoiceControl?: boolean;        // 🎤 Voice commands control button (Web Speech API)
  showLanguageSelector: boolean;     // Subtitle/narration language dropdown
  showSubtitles: boolean;            // Synchronized subtitle banner overlay
  showLoopToggle?: boolean;          // 🔁 Auto-repeat loop toggle
  showVolumeControl?: boolean;       // 🔊 Master volume & mute controls
  showPhysicsControls?: boolean;     // 🪐 Micro-physics & gravity controls
}

export const MODE_METADATA: Record<PlayerDisplayMode, { label: string; icon: string; tag: string; description: string }> = {
  classroom: {
    label: 'Classroom Mode',
    icon: '🎓',
    tag: 'RECOMMENDED FOR TEACHERS',
    description: 'Optimized for smartboards & interactive whiteboards. Retains playback, checkpoints, narration, and print worksheets while hiding dev tools and stream controls.',
  },
  student: {
    label: 'Student Focus Mode',
    icon: '🎒',
    tag: 'DISTRACTION-FREE',
    description: 'Clean revision environment for pupils. Focuses exclusively on concepts, narration, and formative active-recall checkpoints with zero administrative clutter.',
  },
  broadcast: {
    label: 'Broadcast / OBS Mode',
    icon: '📡',
    tag: 'FLIPPED CLASSROOM',
    description: 'Configured for OBS Studio recording and live streaming. Prioritizes OBS WebSocket sync, live captioning, and transparent overlay workflows.',
  },
  developer: {
    label: 'Developer & Author Mode',
    icon: '🛠️',
    tag: 'FULL TOOLSUITE',
    description: 'Complete authoring environment: SVG element inspector, live AST code studio, standalone SPA compiler, and raw XML copy utilities.',
  },
  custom: {
    label: 'Custom Profile',
    icon: '🎛️',
    tag: 'USER DEFINED',
    description: 'Granularly toggle individual links, toolbars, and controls to match your exact institutional or personal preferences.',
  },
};

export const CLASSROOM_PRESET: PlayerDisplayConfig = {
  mode: 'classroom',
  showPresetSelector: true,
  showStageBadge: true,
  showInteractiveCheckpoints: true,
  show3DControls: true,
  showDevInspect: false,
  showDevStudio: false,
  showExportSpa: false,
  showStandaloneLink: true,
  showObsLink: false,
  showLmsEmbed: false,
  showPrintWorksheet: true,
  showCopySvg: false,
  showThemeToggle: true,
  showFullscreen: true,
  showPipButton: true,
  showTimelineScrubber: true,
  showPlaybackControls: true,
  showSpeedSelector: true,
  showVoiceNarration: true,
  showVoiceControl: true,
  showLanguageSelector: true,
  showSubtitles: true,
  showLoopToggle: true,
  showVolumeControl: true,
  showPhysicsControls: true,
};

export const STUDENT_PRESET: PlayerDisplayConfig = {
  mode: 'student',
  showPresetSelector: true,
  showStageBadge: true,
  showInteractiveCheckpoints: true,
  show3DControls: true,
  showDevInspect: false,
  showDevStudio: false,
  showExportSpa: false,
  showStandaloneLink: false,
  showObsLink: false,
  showLmsEmbed: false,
  showPrintWorksheet: false,
  showCopySvg: false,
  showThemeToggle: true,
  showFullscreen: true,
  showPipButton: true,
  showTimelineScrubber: true,
  showPlaybackControls: true,
  showSpeedSelector: true,
  showVoiceNarration: true,
  showVoiceControl: true,
  showLanguageSelector: true,
  showSubtitles: true,
  showLoopToggle: true,
  showVolumeControl: true,
  showPhysicsControls: false,
};

export const BROADCAST_PRESET: PlayerDisplayConfig = {
  mode: 'broadcast',
  showPresetSelector: true,
  showStageBadge: true,
  showInteractiveCheckpoints: true,
  show3DControls: true,
  showDevInspect: false,
  showDevStudio: false,
  showExportSpa: false,
  showStandaloneLink: true,
  showObsLink: true,
  showLmsEmbed: false,
  showPrintWorksheet: false,
  showCopySvg: false,
  showThemeToggle: true,
  showFullscreen: true,
  showPipButton: true,
  showTimelineScrubber: true,
  showPlaybackControls: true,
  showSpeedSelector: true,
  showVoiceNarration: true,
  showVoiceControl: true,
  showLanguageSelector: true,
  showSubtitles: true,
  showLoopToggle: true,
  showVolumeControl: true,
  showPhysicsControls: true,
};

export const DEVELOPER_PRESET: PlayerDisplayConfig = {
  mode: 'developer',
  showPresetSelector: true,
  showStageBadge: true,
  showInteractiveCheckpoints: true,
  show3DControls: true,
  showDevInspect: true,
  showDevStudio: true,
  showExportSpa: true,
  showStandaloneLink: true,
  showObsLink: true,
  showLmsEmbed: true,
  showPrintWorksheet: true,
  showCopySvg: true,
  showThemeToggle: true,
  showFullscreen: true,
  showPipButton: true,
  showTimelineScrubber: true,
  showPlaybackControls: true,
  showSpeedSelector: true,
  showVoiceNarration: true,
  showVoiceControl: true,
  showLanguageSelector: true,
  showSubtitles: true,
  showLoopToggle: true,
  showVolumeControl: true,
  showPhysicsControls: true,
};

export const CONFIG_STORAGE_KEY = 'stj_player_display_config';

export function getPresetConfig(mode: PlayerDisplayMode): PlayerDisplayConfig {
  switch (mode) {
    case 'student':
      return { ...STUDENT_PRESET };
    case 'broadcast':
      return { ...BROADCAST_PRESET };
    case 'developer':
      return { ...DEVELOPER_PRESET };
    case 'classroom':
    default:
      return { ...CLASSROOM_PRESET };
  }
}

export function loadSavedPlayerConfig(): PlayerDisplayConfig {
  if (typeof window === 'undefined') return { ...CLASSROOM_PRESET };

  try {
    // 1. Check URL parameters for explicit override (e.g. ?mode=student or ?mode=classroom or ?clean=1)
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode') as PlayerDisplayMode | null;
    if (urlMode && ['classroom', 'student', 'broadcast', 'developer'].includes(urlMode)) {
      return getPresetConfig(urlMode);
    }
    if (urlParams.get('clean') === '1') {
      return getPresetConfig('classroom');
    }

    // 2. Check LocalStorage
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const base = parsed.mode ? getPresetConfig(parsed.mode) : { ...CLASSROOM_PRESET };
        return {
          ...base,
          ...parsed,
        };
      }
    }
  } catch (err) {
    console.warn('[PlayerConfig] Error loading saved display config:', err);
  }

  // Default to Classroom preset for clean, high-impact teaching
  return { ...CLASSROOM_PRESET };
}

export function savePlayerConfig(config: PlayerDisplayConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('[PlayerConfig] Error saving display config:', err);
  }
}
