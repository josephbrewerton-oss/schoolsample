# St Joseph's Curriculum Portal — System Architecture & Context

## 1. Project Overview & Commercial Thesis
The St Joseph's Curriculum Portal is an enterprise-grade, edge-native learning platform and declarative vector animation runtime built on **Vite 8+ (Rolldown)**, **React 19**, and a **3-Tier client-side inference engine** with zero network egress.

* **Zero Marginal Compute Overhead:** Inference, procedural S-expression compilation, Socratic evaluation, and 60 FPS vector animation run 100% client-side in the browser.
* **Statutory Safeguarding & Zero-Telemetry:** Pupil records, diagnostics, voice recordings, and assessment tokens are strictly isolated in local IndexedDB (`EdgeLearningEngineDB`), fulfilling UK GDPR (Art. 25) and KCSIE standards.
* **Deterministic AST Substrate:** High-dimensional curriculum graphs, UI state, and procedural vector animations are represented as Lisp-style S-expressions rather than brittle JSON schemas.
* **Decoupled Sandbox Model:** Heavy neural workers and procedural vector animation engines execute inside isolated browsing contexts (`static/worker.html`, `static/player/index.html`) to guarantee 0% main-thread blocking on portal UI.

---

## 2. Core Subsystems & Execution Pipeline

```text
┌────────────────────────────────────────────────────────────────────────┐
│                              BROWSER TAB                               │
│                                                                        │
│   ┌────────────────────────┐             ┌──────────────────────────┐  │
│   │   React 19 / Vite 8    │ ◄─────────► │    IndexedDB Storage     │  │
│   │ (App Shell / Viewport) │             │ (Curriculum Cache & VFS) │  │
│   └───────────┬────────────┘             └──────────────────────────┘  │
│               │                                                        │
│               ▼ Hypercall Dispatch Bus                                 │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                    Hypercall Substrate Bus                     │   │
│   │  - QuestionEngine Node (Stage-Calibrated AST Logic)            │   │
│   │  - LessonSynthesizer Node (IndexedDB Cache + Baseline Influx)  │   │
│   │  - Peer-to-Peer Beacon Node (Local WebRTC Mesh)                │   │
│   └──────────────────────┬─────────────────────────────────────────┘   │
│                          │                                             │
│         ┌────────────────┴────────────────┐                            │
│         ▼                                 ▼                            │
│   ┌───────────────────────────┐     ┌──────────────────────────────┐   │
│   │   3-Tier Inference Engine │     │    AST Vector Media Player   │   │
│   │   • Tier 1: Chrome Nano   │     │    • Procedural SVG Motion   │   │
│   │   • Tier 2: WebLLM        │     │    • Document PiP Engine     │   │
│   │   • Tier 3: AST Synthesizer│    │    • SWF Transcompiler Lathe │   │
│   └───────────────────────────┘     └──────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
2.1 The 3-Tier Edge Cognitive Engine (@school-ai/edge-runtime)
To guarantee universal availability across heterogeneous school hardware (from M-series iPads to legacy 2GB Celeron Chromebooks), inference automatically negotiates three execution tiers:

Tier 1: Native Chromium Prompt API (window.ai.languageModel): High-speed, zero-heap Gemini Nano neural inference.

Tier 2: WebLLM Compute Pipeline (@mlc-ai/web-llm): In-browser WebGPU shader execution (SmolLM2-360M-Instruct-q4f16_1-MLC) protected by an automated memory heuristic guard (navigator.deviceMemory, core count, buffer binding checks) to prevent tab termination under iOS/iPadOS Jetsam limits.

Tier 3: Local Socratic Rule Synthesizer: Instantaneous (< 5ms), deterministic AST rule evaluation requiring zero GPU allocations and 0 bps bandwidth.

2.2 AST Vector Media Player & Transcompiler
A lightweight, dependency-free media runtime replacing bloated MP4 video streams and canvas wrappers:

Declarative S-Expression Animation: Scenes are defined via .ast manifests pairing SVG elements with parametric mathematical bindings (e.g. (:target "#arm" :attr "transform" :expr "'rotate(' + (t * 360) + ')'")).

Document Picture-in-Picture: Interactive simulations, 3D orbits, and active-recall checkpoints pop out into an always-on-top desktop window via documentPictureInPicture.

Legacy SWF / Flash Transcompiler: Client-side decompiler in AstVectorMediaPlayer.tsx that ingests raw FWS/CWS Flash binaries, parses shape records and twips coordinates, and translates them directly into modern SVG paths and S-expression bindings.

2.3 AST Route Harmoniser (AstHarmoniser.tsx)
A zero-404 navigation substrate that intercepts non-canonical or legacy deep links, projects the request onto the hierarchical curriculum tree, and automatically redirects or renders dynamic AST views without broken paths.

3. Directory Layout & Module Boundaries
src/engine/: Core runtime orchestration, including aicaller.ts, hypercall.ts, and operational-language.ts.

src/components/: Modular UI, including AstVectorMediaPlayer.tsx, PersistentAppShell.tsx, ConceptConstellation.tsx, and AstHarmoniser.tsx.

src/utils/sexprParser.ts: Recursive tokenizer and AST parser enforcing strict determinism and validation across all .ast files.

packages/edge-runtime/: Isolated SDK exposing EdgeCognitiveEngine, AstCompiler, and multi-tier execution abstractions.

static/player/: Standalone vector player iframe containing procedural SVG engines, 3D matrix math, and Web Speech integration.

static/manifests/: Pre-compiled curriculum units, RAG search indices, and Oak National Academy lesson sequences.

scripts/: Production build and verification tooling:

test-ast-manifests.ts: Automated invariant and determinism test suite.

simulate-questions.ts: Cross-subject question generation and CSN verification harness.

simulate-swf-import.ts: Automated SWF binary parser regression suite.

watchSubstrates.ts: Dependency-free code cascade watcher using native node:fs.

export-distribution.ts: Clean-room packaging script generating unencumbered /dist-public-release bundles.

4. Key Verification & Build Commands
Bash
# Start local development server (port 3000)
npm run dev

# Run End-to-End Determinism & Parser Verification Suites
npm run test:ast
npm run test:simulations
npm run test:swf

# Compile Oak National Academy manifests & scenes
npm run manifest:scenes
npm run ingest:oak

# Build minified static Single Page Application
npm run build

# Export clean-room public release distribution
npm run export:dist
