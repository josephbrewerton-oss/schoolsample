# School AI Portal (Schoolsample) — System Architecture & Context

## 1. Project Overview & Commercial Thesis
The School AI Portal is a zero-marginal-cost, privacy-first interactive learning and practice engine built on Docusaurus, edge-first local LLMs (Gemini Nano / `window.ai`), and immediate-mode Canvas rendering.

* **Zero Cloud Compute Costs:** Inference, Socratic evaluation, AST compilation, and state validation run 100% client-side in the student's browser.
* **UK GDPR / Safeguarding Compliance:** Zero student data, telemetry, or generated quiz tokens leave the local device sandbox.
* **Decoupled Architecture:** Clean separation between curriculum registries, prompt strategy factories, WebRTC headless daemons, and low-level canvas renderers.

---

## 2. Core Architecture & Execution Pipeline

### Headless WebRTC Daemon Isolation
To maintain a strict 60 FPS UI budget on the main React thread, on-device neural inference is offloaded to a headless daemon (`static/worker.html`) connected via a local WebRTC `RTCDataChannel`.

### Deterministic S-Expression AST Compiler
Instead of brittle JSON schemas, generative model output is emitted and validated as Lisp-style S-expressions (`.ast`):
* `(:route ...)`: Dynamic archetype routing (e.g. `"quiz:mcq"`).
* `(:calc ...)`: Scratchpad arithmetic trace for verified STEM step-by-step reasoning.
* `(:prompt ...)`: Student-facing challenge prompt.
* `(:options (list ...))`: Validated answer and distractor payload.
* `(:answer-key <index>)`: Zero-indexed canonical solution key.

### Immediate-Mode 2D Canvas Engine
* Rendered via `src/components/NeuralLabCanvas.tsx`.
* Native coordinate math, dynamic text-wrapping, and custom bounding-box hit detection for interactive option selection.

---

## 3. Directory Layout & Module Boundaries

* `src/curriculum/oakCatalogue.ts`: Standalone curriculum dictionary (Key Stages 1–4 across STEM, Humanities, and Languages).
* `static/promptStrategies.js`: Isolated prompt generation factories, dimensional unit constraints, and domain routing.
* `static/worker.html`: Headless inference worker executing on-device LLM sessions over WebRTC data channels.
* `static/version.json`: On-device build handshake and cache invalidation metadata.
* `src/components/`: Modular React components (`NeuralLabCanvas.tsx`, `NanoAssistantPanel.tsx`, `DynamicLessonViewer.tsx`).
* `docs/practice-lab.mdx`: MDX orchestration layer with open-source MIT and Oak National Academy (OGL v3.0) licensing attribution.

---

## 4. Key Commands

```powershell
# Start local development server
npm run start

# Build static production bundle
npm run build

# Deploy live to GitHub Pages (josephbrewerton-oss.github.io/schoolsample/)
$env:GIT_USER="josephbrewerton-oss"; npm run deploy