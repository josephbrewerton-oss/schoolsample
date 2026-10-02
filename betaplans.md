# Roadmap & Technical Specification: Gemini Nano × AST Vector Player Co-Pilot (Beta)

> **Document Status**: Draft / Proposed Beta Specification  
> **Target Subsystem**: `src/engine/aicaller.ts` ↔ `static/player/ast-engine.js`  
> **Privacy Invariant**: 100% On-Device Local Inference (Zero Cloud Telemetry / Children's Code Compliant)  
> **Author**: St Joseph's Curriculum Engineering Team  

---

## 1. Executive Vision

Current educational AI systems suffer from a severe limitation: **they can tell, but they cannot show**. When a student asks a visual, spatial, or mathematical question (e.g., *"Why does the denominator change when adding $\frac{1}{2}$ and $\frac{1}{4}$?"*), cloud chatbots respond with walls of abstract text.

This project possesses two unique architectural assets:
1. **Gemini Nano On-Device Inference (`aicaller.ts`)**: Fast, token-efficient, zero-cost, zero-cloud local reasoning running in the pupil's browser.
2. **AST Vector Motion Player (`static/player/`)**: A 60 FPS parametric vector rendering engine driven entirely by concise mathematical S-Expressions.

By bridging them through a sandboxed, bidirectional RPC protocol, Gemini Nano gains **"physical hands on the classroom whiteboard"**. It can dynamically scrub simulations, pulse geometric elements, slow down critical physics frames, and demonstrate concepts visually while narrating through Web Speech.

---

## 2. Core Architecture & Interaction Loop

```
┌────────────────────────────────────────────────────────────────────────┐
│                        HOST APPLICATION (React)                        │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                 Gemini Nano (Chrome Prompt API)              │     │
│   │   - System Prompt with AST Action Grammar                    │     │
│   │   - Context Window: Active Topic + 30-token Manipulative State│    │
│   └──────────────────────────────▲───────────────────────────────┘     │
│                                  │                                     │
│                     1. Telemetry │ 2. Sanitized                        │
│                        Snapshot  │    Action Tuples                    │
│                                  │                                     │
│   ┌──────────────────────────────┴───────────────────────────────┐     │
│   │               AiPlayerBridge (`src/engine/`)                 │     │
│   │   - Tokenizer & S-Expression Validator                      │     │
│   │   - Child Safety Filter (`childSafetyFilter.ts`)             │     │
│   │   - PostMessage TargetOrigin Security Guard                  │     │
│   └──────────────────────────────▲───────────────────────────────┘     │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │ postMessage (Same-Origin / Sandbox)
┌──────────────────────────────────▼─────────────────────────────────────┐
│                    AST VECTOR PLAYER (Sandboxed iFrame)                │
│                                                                        │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                 ast-engine.js / player-ui.js                 │     │
│   │   - Visual Tweener (smooth scrub to target progress)         │     │
│   │   - SVG Spotlight / Halo Glow Shader                         │     │
│   │   - Web Speech Synthesis Synchronizer                        │     │
│   │   - Pupil Instant-Interrupt Listener (mouse/touch override)  │     │
│   └──────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Communication Protocol (RPC Specification)

### 3.1 Player Telemetry Egress (Player ➔ Host)
Whenever the student manipulates a slider, advances a step, or makes a quiz mistake, the player emits an immutable snapshot to the host:

```typescript
interface PlayerTelemetryEvent {
  type: 'PLAYER_TELEMETRY';
  sceneId: string;              // e.g. "fractions", "pythagoras", "solar-system"
  progress: number;             // Timeline progress: 0.0 to 1.0
  activeKeyframe: number;       // Current step index
  variables: Record<string, any>; // e.g. { numerator: 2, denominator: 4, whole: 1 }
  lastUserAction: string;       // e.g. "SLIDER_DRAG", "CHECKPOINT_SUBMIT", "IDLE"
  lastErrorKey?: string;        // e.g. "COMMON_DENOMINATOR_MISMATCH"
  timestamp: number;
}
```

### 3.2 AI Action Ingestion (Host ➔ Player)
Gemini Nano generates structured, token-efficient S-Expressions that are parsed by the host and posted into the player iFrame:

```typescript
type AiVisualAction = 
  | { type: 'SEEK'; targetProgress: number; durationMs?: number }
  | { type: 'HIGHLIGHT'; selector: string; pulseColor?: string; durationMs?: number }
  | { type: 'SET_VARIABLE'; variable: string; value: number | string }
  | { type: 'STEP'; stepIndex: number }
  | { type: 'ANNOTATE'; targetSelector: string; labelText: string; arrowDirection?: 'up' | 'down' | 'left' | 'right' }
  | { type: 'NARRATE'; text: string; language?: string }
  | { type: 'RESET_VIEW' };

interface AiVisualCommandPacket {
  type: 'AI_VISUAL_COMMAND';
  transactionId: string;
  actions: AiVisualAction[];
  pedagogicalIntent: 'EXPLAIN_MISCONCEPTION' | 'STEP_BY_STEP_DEMO' | 'ENCOURAGE';
}
```

---

## 4. The S-Expression Grammar for Gemini Nano

To prevent token exhaustion on low-memory NPUs, Gemini Nano is instructed using a concise Lisp-style S-Expression grammar:

```lisp
;; Grammar Definition for Nano System Prompt:
;; (:act :seek <0.0-1.0> [:highlight "<svg-id>"] [:var "<name>" <val>] [:say "<text>"])

;; Example: Correcting a fraction addition error
(:act :seek 0.50 
      :highlight "#pie-slice-split" 
      :say "Notice how one half is physically identical to two quarters.")

;; Example: Illustrating Pythagoras' Theorem
(:act :seek 0.85 
      :highlight "#hypotenuse-square" 
      :var "c_sq" 25 
      :say "The 9 yellow units plus 16 blue units fill the 25 green units completely.")
```

---

## 5. Safeguarding, Security & Performance Invariants

1. **Zero Dynamic Code Execution (No `eval` / No `<script>`)**:
   * Nano can only reference existing, whitelisted SVG IDs defined in `scenes.manifest.json`.
   * Any command containing `<`, `>`, `script`, `javascript:`, or unapproved CSS properties is silently dropped by `childSafetyFilter.ts`.
2. **Pupil Agency & Instant Interrupt**:
   * If a pupil touches the screen, moves the mouse, or presses a key while Nano is demonstrating, Nano's commands are **instantly suspended** (`PUPIL_PREEMPTION`). The pupil remains in full control.
3. **Chromebook CPU/GPU Throttling Guard**:
   * In-browser LLM inference + 60 FPS vector animation can cause thermal throttling on older Celeron/MediaTek Chromebooks.
   * **Rule**: When Nano is actively generating tokens, the vector player locks its internal clock to 30 FPS. Once generation completes, full 60–120 FPS interpolation resumes.
4. **Strict Air-Gap & Zero Cloud Egress**:
   * In accordance with `AGENTS.md` and the ICO Children's Code, all prompt generation, state inspection, and speech synthesis occur purely on `localhost` / `window.ai`.

---

## 6. Phased Implementation Roadmap

### Phase 1: Feature Flag & Storage Configuration
- [ ] Add `ai_copilot_beta: boolean` to `PlayerDisplayConfig` (`src/types/playerConfig.ts`).
- [ ] Add an experimental toggle in **Settings > Experimental Labs** and the Player toolbar (**✨ Co-Pilot [Beta]**).
- [ ] Default flag state: **OFF** (opt-in only, requires explicit teacher/pupil confirmation).

### Phase 2: Telemetry Bridge (`static/player/ast-engine.js`)
- [ ] In `ast-engine.js`, add `emitTelemetrySnapshot()` on step change and scrubber release.
- [ ] Mount `window.addEventListener('message')` handler inside the player for `AI_VISUAL_COMMAND`.
- [ ] Implement SVG glow/pulse CSS animation (`.ai-spotlight-pulse`).

### Phase 3: Gemini Nano System Prompt & Adapter (`src/engine/aicaller.ts`)
- [ ] Add `promptAiCoPilotDemonstration(telemetry, pupilQuestion)` method.
- [ ] Write the token-compact system prompt instructing Nano to respond with `:act` tuples.
- [ ] Implement regex-based S-Expression extraction with fallback to plain speech.

### Phase 4: UI Experience & Micro-Interactions (`src/pages/media-player.tsx`)
- [ ] Add **"✨ Show Me How"** button next to the interactive scrubber.
- [ ] Add visual badge: *"Nano is demonstrating (click anywhere to take back control)"*.
- [ ] Add audio toggle for Web Speech narration.

### Phase 5: Classroom Beacon Integration (`src/services/classroomBeacon.ts`)
- [ ] Allow teachers to broadcast Nano demonstrations to all connected student desks over local WebRTC.
- [ ] Add teacher kill-switch: Teacher can disable Co-Pilot on all student desks with one click from the Beacon Console.

---

## 7. Go / No-Go Decision Criteria

Before graduating this feature from Beta to Core:
1. **Latency Benchmark**: Time-to-first-visual-tween must be `< 800ms` on an Intel Celeron N4020 Chromebook.
2. **Accuracy Benchmark**: >95% valid AST action parsing across 100 fuzzed curriculum prompts.
3. **Teacher Sentiment**: Zero negative impact on pupil exploratory agency reported during pilot classroom trials.
