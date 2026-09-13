# St Joseph's Curriculum Portal — Filemap

Current active repository structure (Vite 6+ SPA, Edge AI Engine, PWA):

## Root Configuration
- `package.json` — Root dependency and script manifest (Pure Vite SPA, sub-second build)
- `tsconfig.json` — TypeScript configuration
- `vite.config.ts` — Vite 6 build configuration with rollup manual vendor chunking
- `index.html` — Application entry point, critical inline CSS, PWA meta tags
- `metadata.json` — AI Studio applet metadata (edge execution, no remote cloud dependencies)
- `AGENTS.md` — Project context, on-device Gemini Nano and offline-first directives
- `Filemap.md` — Active directory index

## Source Code (`src/`)
- `src/main.tsx` — Root React 19 application bootstrapper, service worker registration
- `src/App.tsx` — Router setup with React Router 7 and persistent layout routes
- `src/types.ts` — Shared TypeScript types
- `src/registerServiceWorker.ts` — Offline PWA service worker lifecycle manager
- `src/components/`
  - `src/components/PersistentAppShell.tsx` — Universal Translator bar, Persistent Navbar, Footer, and sandboxed Worker guest VM
  - `src/components/PersistentNavbar.tsx` — Responsive navigation, Gemini Nano indicator, Data Saver toggle, PWA install prompt
  - `src/components/InteractiveEdgeSandbox.tsx` — In-browser local interactive practice sandbox
  - `src/components/DynamicLessonViewer.tsx` — Lesson viewer for interactive curriculum units
  - `src/components/UniversalTranslatorBar.tsx` — Multi-language switcher and live DOM translation controller
  - `src/components/PageMeta.tsx` — Dynamic page title and meta description tag updater
- `src/css/`
  - `src/css/custom.css` — Global styling, high-contrast mode, zero-CLS rules, and low-bandwidth/Data-Saver hardware rules
- `src/data/`
  - `src/data/curriculumRegistry.ts` — Curriculum standard catalog
  - `src/data/curriculumPacks.ts` — Pre-bundled curriculum pack definitions
  - `src/data/complianceCaveats.ts` — Translations and local AI caveats
  - `src/data/lessons.ts` — Lesson metadata
  - `src/data/questions.ts` — Question data structures
- `src/engine/`
  - `src/engine/aicaller.ts` — Unified on-device Chrome Prompt API / Gemini Nano client
  - `src/engine/fastEndpoint.ts` — Substrate gateway for dynamic imports
  - `src/engine/hypervisor.ts` — Hypervisor host coordinating off-main-thread worker execution
  - `src/engine/operational-language.ts` — Supported language state and event emitter
  - `src/engine/universalDomTranslator.ts` — Live DOM translation engine
  - `src/engine/EdgeCognitiveEngine.ts` — Local cognitive engine
- `src/pages/`
  - `src/pages/index.tsx` — Home portal dashboard & curriculum stream browser
  - `src/pages/practice-lab.tsx` — Practice lab with real-time on-device feedback
  - `src/pages/learning-zone.tsx` — Interactive learning zone & lesson viewer
  - `src/pages/profile.tsx` — Student offline mastery profile & badges
  - `src/pages/curriculum-studio.tsx` — Overseas curriculum importer & CSV editor
  - `src/pages/teacher-beacon.tsx` — Local WebRTC peer-to-peer classroom sync
  - `src/pages/settings.tsx` — Settings, PWA status, Nano AI consent, and Low-Bandwidth Data Saver
  - `src/pages/licensing.tsx` — Perpetual free licensing declaration for Catholic schools & emerging nations
  - `src/pages/privacy.tsx` — Zero-cloud leakage privacy policy
  - `src/pages/blog.tsx` — News and updates
  - `src/pages/not-found.tsx` — 404 handler
- `src/services/`
  - `src/services/dataSaverStore.ts` — Ultra-low bandwidth & battery saver controller
  - `src/services/offlineSyncService.ts` — One-click curriculum pre-cacher for offline learning
  - `src/services/curriculumPackStore.ts` — Custom curriculum packs storage in IndexedDB
  - `src/services/dbStore.ts` — IndexedDB local state store
  - `src/services/jotter-db.ts` — Local student exercise jotter
- `src/utils/`
  - `src/utils/sexprParser.ts` — S-Expression AST parser for curriculum logic

## Static Assets (`static/`)
- `static/manifest.json` — PWA Web App Manifest
- `static/sw.js` — Service worker script (Cache-first offline strategy)
- `static/worker.html` — Sandboxed neural worker guest VM iframe daemon
- `static/nano-map.ast` — Curriculum knowledge graph compiled in Lisp-like S-Expressions
- `static/manifests/`
  - `static/manifests/rag-index.json` — Complete local search & RAG index of all curriculum lessons
  - `static/manifests/lessons/*.json` — Pre-compiled JSON curriculum units
- `static/img/` — Favicons, app icons, and logos
- `static/js/webrtc-agent.js` — Local peer-to-peer data channel agent
- `static/patterns/` — S-Expression question templates (.ast)

## Scripts (`scripts/`)
- `scripts/compile-oak-manifest.cjs` — Ingests and compiles Oak curriculum into offline manifests
- `scripts/generate-icons.py` — Vector logo and favicon asset generator
- `scripts/setup-sdk.js` — Scaffolds local `@school-ai/edge-runtime` package
