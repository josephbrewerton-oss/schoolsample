# St Joseph's Curriculum Portal — AI Agent Context & Rules

## Project Architecture
- **Framework**: High-performance client-side Single Page Application (SPA) powered by **Vite 6+**, **React 19**, and **React Router 7**.
- **Persistent App Shell**: The Universal Translator Bar, Persistent Navbar, and Footer are permanently mounted in `src/components/PersistentAppShell.tsx`. Route navigation occurs in-memory inside `#ast-persistent-viewport` via `<Outlet />`.
- **Styling**: Tailwind CSS & scoped CSS without heavy CSS framework overrides. `html { scrollbar-gutter: stable; }` must be preserved to prevent Cumulative Layout Shift (CLS).
- **Static Assets**: Located in `static/` (served at `/` via Vite's `publicDir: 'static'`).
- **Build**: `npm run build` runs icon generation, Oak manifest compilation, and `vite build` into `dist/`. Build time must remain sub-second (< 1s). Do NOT re-introduce Docusaurus or SSR build tools.

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
