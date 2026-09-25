# AST-Guided Low-Bloat Vector Motion Player (Standalone Suite)

An ultra-lightweight, sandboxed vector animation and curriculum manipulative player designed for continuous mathematical visualization, zero-cloud narration, and zero layout shift.

## Key Advantages
1. **0 Bytes Video Bloat**: 3.5 KB AST vector descriptor vs 40+ MB MP4/WebM video blobs.
2. **0% Main-Thread CPU Overhead**: Runs inside a decoupled iframe or web worker; 60 FPS portal navigation guaranteed.
3. **Universal LMS Embed**: Directly embeds into **Canvas, Google Classroom, Moodle, and Blackboard**.
4. **Zero-Cloud On-Device Speech**: Web Speech API narration in 10 languages with bilingual subtitles.
5. **Classroom Print-Off**: Instant A4 worksheet generator with grayscale contrast filter.

## Directory Structure
```
static/player/
├── index.html              # Clean HTML5 Sandboxed Player Shell
├── micro-vector-player.js  # Standalone <micro-vector-player> Web Component (< 5 KB)
├── demo-webcomponent.html  # Interactive test & demo for Web Component
├── player.css              # Responsive, zero-CLS Dark/Light styling
├── ast-engine.js           # Timeline, keyframe interpolator, speech & postMessage bridge
├── ast-scenes.js           # Curriculum scene definitions & ASTSceneRegistry
├── player-ui.js            # Scrubber, keyboard shortcuts, print/export controller
├── schema/                 # Formal Minimal AST Specifications
│   ├── SPECIFICATION.md    # Detailed human-readable spec
│   └── ast-scene.schema.json # JSON Schema validation draft-07
├── grammar/                # GBNF Grammars for Constrained Local LLMs
│   ├── ast-scene.gbnf      # llama.cpp / Ollama JSON grammar
│   ├── ast-sexpr.gbnf      # Lisp-like compact S-expression grammar
│   └── README.md           # llama.cpp, Ollama & Python usage guide
├── examples/               # Sample .ast and .json scene payloads
│   ├── orbit.ast
│   └── orbit.json
├── package.json            # Standalone npm package manifest for splitting off
└── README.md               # Architecture, Embed Guide & postMessage API
```

## Dropping the `<micro-vector-player>` Web Component into Any Website
```html
<!-- 1. Include the single lightweight script (< 5 KB) -->
<script src="https://your-domain.com/player/micro-vector-player.js"></script>

<!-- 2. Drop the player anywhere -->
<micro-vector-player src="orbit.ast" autoplay voice></micro-vector-player>
<micro-vector-player src="orbit.json" lang="es"></micro-vector-player>
<micro-vector-player preset="fractions"></micro-vector-player>
```

## Embedding in an LMS (Canvas, Moodle, Google Classroom)
```html
<iframe 
  src="https://your-domain.com/player/index.html?preset=fractions&lang=en&autoplay=0" 
  width="100%" 
  height="500" 
  frameborder="0" 
  allow="fullscreen" 
  loading="lazy" 
  style="border-radius:12px; border:1px solid #1e293b;">
</iframe>
```

## Supported URL Parameters
| Parameter | Default | Description |
|-----------|---------|-------------|
| `preset`  | `fractions` | Preset ID (`fractions`, `solar-system`, `photosynthesis`, `pythagoras`, `water-cycle`, `atom`, `velocity`, `dna-helix`) |
| `lang`    | `en`    | Operational language code (`en`, `es`, `fr`, `de`, `it`, `pl`, `pt`, `uk`, `ar`, `la`) |
| `speed`   | `1.0`   | Playback speed multiplier (`0.5`, `1.0`, `1.5`, `2.0`) |
| `autoplay`| `0`     | Autoplay on load (`1` = yes, `0` = no) |
| `theme`   | `dark`  | Visual theme (`dark` or `light`) |

## Bi-Directional postMessage API Protocol
### Send Commands to iFrame:
```javascript
const playerWindow = document.getElementById('my-player-iframe').contentWindow;

// Play / Pause / Seek
playerWindow.postMessage({ type: 'PLAY' }, '*');
playerWindow.postMessage({ type: 'PAUSE' }, '*');
playerWindow.postMessage({ type: 'SEEK', progress: 0.5 }, '*');

// Change preset or language
playerWindow.postMessage({ type: 'SET_PRESET', preset: 'solar-system' }, '*');
playerWindow.postMessage({ type: 'SET_LANG', lang: 'es' }, '*');
playerWindow.postMessage({ type: 'SET_SPEED', speed: 1.5 }, '*');
playerWindow.postMessage({ type: 'SET_THEME', theme: 'light' }, '*');

// Inject dynamic AST scene
playerWindow.postMessage({ 
  type: 'LOAD_AST', 
  ast: { id: 'custom-scene', title: 'My Custom Scene', duration: 8.0, ... } 
}, '*');
```

### Receive Telemetry Events from iFrame:
```javascript
window.addEventListener('message', (event) => {
  if (event.data?.source !== 'ast-vector-player') return;

  switch (event.data.type) {
    case 'PLAYER_READY':
      console.log('Player initialized with presets:', event.data.presets);
      break;
    case 'TIME_UPDATE':
      console.log('Current progress:', event.data.progress);
      break;
    case 'KEYFRAME_REACHED':
      console.log('Milestone reached:', event.data.title, event.data.rule);
      break;
    case 'STATE_CHANGE':
      console.log('Playback state:', event.data.isPlaying);
      break;
  }
});
```

## How to Split Off into an Independent Repository
1. Copy the entire `static/player/` folder to a new repository.
2. Run `npm publish --access public` (or host it as a static micro-frontend on Cloudflare Pages, Vercel, or GitHub Pages).
3. The player has **zero external runtime dependencies** (pure vanilla JS, SVG, Web Speech, and CSS variables).
