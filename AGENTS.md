# St Joseph's Curriculum Portal — AI Agent Context & Rules

## Project Architecture
- **Framework**: High-performance client-side Single Page Application (SPA) powered by **Vite 6+**, **React 19**, and **React Router 7**.
- **Persistent App Shell**: The Universal Translator Bar, Persistent Navbar, and Footer are permanently mounted in `src/components/PersistentAppShell.tsx`. Route navigation occurs in-memory inside `#ast-persistent-viewport` via `<Outlet />`.
- **Styling**: Tailwind CSS & scoped CSS without heavy CSS framework overrides. `html { scrollbar-gutter: stable; }` must be preserved to prevent Cumulative Layout Shift (CLS).
- **Static Assets**: Located in `static/` (served at `/` via Vite's `publicDir: 'static'`).
- **Build**: `npm run build` runs icon generation, Oak manifest compilation, and `vite build` into `dist/`. Build time must remain sub-second (< 1s). Do NOT re-introduce Docusaurus or SSR build tools.

## AST Vector Player & Zero-Bloat Flash-Caliber Engine
- **Decoupled Engine Core**: Located in `static/player/` (`ast-engine.js`, `ast-scenes.js`, `ast-gestures.js`, `player-ui.js`).
- **Zero-Bloat Invariant**: Engine runtime is strictly < 35 KB gzipped (< 150 KB uncompressed) with 0 external runtime dependencies. Sub-15 ms cold start, < 8 MB RAM footprint.
- **Dual-Mode Execution**:
  - **Narrative Motion**: 60 FPS keyframed vector timeline, bilingual English/Spanish/Latin subtitles, and formative pause checkpoints.
  - **Direct In-Stage Grab & Drag (`ast-gestures.js`)**: Real-time pointer capture on live SVG elements (piston cylinder, tangent slope probe, knife switches, weights) with sub-pixel inverse CTM coordinate translation.
- **Smartboard & Stylus Pen Overlay**: Native in-stage whiteboard ink layer (`#annotation-ink-root`) with quadratic Bézier smoothing for Promethean, SMART, ViewSonic, and iPad stylus pens.
- **Pedagogical X-Ray & Sonification**: `data-pedagogical` discovery inspection with real-time procedural Web Audio synthesis (0 KB external audio files).
- **17 Production Curriculum Scenes**: `calculus-curves`, `kinetic-gas`, `church-tour`, `electric-circuits`, `math-fishing`, `mountain-elevation`, `fish-tank`, `fractions`, `solar-system`, `photosynthesis`, `pythagoras`, `water-cycle`, `atom`, `velocity`, `dna-helix`, `bodmas`, `phonics-lab`, `times-tables`.

## AST Language Grammar & S-Expression Specification
- **Language Codification**: Fully defined in `docs/AST_PLAYER_SPECIFICATION.md` and constrained by GGML grammars in `static/player/grammar/ast-sexpr.gbnf` and `ast-scene.gbnf`.
- **Declarative Nodes**:
  - Metadata: `:scene`, `:id`, `:title`, `:stage`, `:duration`, `:easing`
  - Camera & 3D: `:camera`, `:3d-node`, `:3d-line`, `:3d-ring`, `:3d-polygon`
  - Reactive Bindings: `:bindings`, `:target`, `:attr`, `:expr`
  - Formative Assessment: `:interactive`, `:checkpoint`, `:prompt`, `:options`, `:answer`, `:explanation`
  - Direct Manipulation: `:gestures`, `:draggable`, `:axis`, `:min`, `:max`

## On-Device Edge AI & Gemini Nano Guidelines
- **Zero Cloud Leakage**: Student logs, answers, and voice inputs never egress to cloud LLMs.
- **Inference Engine**:
  - Primary: Chrome Prompt API / Gemini Nano via `window.ai.languageModel` or `LanguageModel` (`src/engine/aicaller.ts`).
  - Secondary: WebLLM / local WebRTC data channels (`static/js/webrtc-agent.js`).
- **Data Substrates**:
  - Curriculum structures use Lisp-like S-Expressions defined in `static/nano-map.ast` and parsed by `src/utils/sexprParser.ts`.
  - Prompts to Nano should be concise AST descriptors (token-efficient) rather than verbose prose.
- **Persistence**:
  - Local database runs in browser IndexedDB via `src/services/dbStore.ts` and `src/services/jotter-db.ts`.
