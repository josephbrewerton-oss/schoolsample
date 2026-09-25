# Minimal Vector AST Schema Specification (v1.0.0)

A lightweight, deterministic schema for parametric 2D vector animation, continuous interpolation, and synchronized pedagogical narration. Designed for sub-second edge AI generation, zero-cloud execution, and zero layout shift.

---

## 1. Design Principles

1. **Parametric Continuity**: All visual geometry is expressed as continuous functions of a normalized temporal coordinate $t \in [0.0, 1.0]$.
2. **Deterministic Reproducibility**: Given any $t$, the renderer outputs the exact same SVG vector frame across any device or resolution.
3. **Zero-Cloud Narration**: Audio cues and bilingual subtitle tracks are pinned to normalized timestamps and synthesized on-device via the Web Speech API.
4. **Token-Efficiency**: Descriptors are compact (under 3.5 KB) so local SLMs (1B–3B parameters, Gemini Nano) can generate complete scenes in a single inference pass.

---

## 2. Core Payload Structure

An AST Payload may be expressed in either **JSON** or **Lisp-like S-Expression** (`.ast`).

### Formal JSON Representation
```json
{
  "$schema": "https://stjosephs.sch.uk/schemas/ast-scene-v1.json",
  "id": "orbit",
  "stage": "KS3 SCIENCE",
  "title": "Planetary Gravitational Orbits",
  "duration": 12.0,
  "viewBox": "0 0 800 480",
  "easing": "easeInOutQuad",
  "keyframes": [
    {
      "t": 0.0,
      "title": "Heliocentric Center",
      "rule": "The Sun provides the centripetal gravitational pull.",
      "mathNotation": "F = G(m1*m2)/r^2"
    },
    {
      "t": 0.5,
      "title": "Perihelion Acceleration",
      "rule": "Planetary velocity peaks at closest approach (Kepler's 2nd Law)."
    },
    {
      "t": 1.0,
      "title": "Orbital Period Completion",
      "rule": "Square of period is proportional to cube of semi-major axis."
    }
  ],
  "subtitles": [
    {
      "start": 0.0,
      "end": 0.5,
      "en": "Watch how the planet accelerates as it sweeps closer to the Sun.",
      "es": "Observa cómo el planeta se acelera al acercarse al Sol."
    },
    {
      "start": 0.5,
      "end": 1.0,
      "en": "Kepler's 2nd law dictates equal areas swept in equal intervals of time.",
      "es": "La segunda ley de Kepler dicta áreas iguales recorridas en tiempos iguales."
    }
  ],
  "elements": [
    {
      "type": "circle",
      "cx": 400,
      "cy": 240,
      "r": 28,
      "fill": "#f59e0b",
      "filter": "glow"
    },
    {
      "type": "orbit-path",
      "cx": 400,
      "cy": 240,
      "rx": 220,
      "ry": 140,
      "stroke": "#334155",
      "strokeDasharray": "4 4"
    },
    {
      "type": "particle",
      "orbit": { "cx": 400, "cy": 240, "rx": 220, "ry": 140, "speed": 1.0 },
      "r": 10,
      "fill": "#38bdf8",
      "label": "Earth"
    }
  ]
}
```

---

## 3. Field Definitions

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | **Yes** | Unique slug matching `^[a-z0-9-]+$` |
| `title` | `string` | **Yes** | Human-readable lesson topic name |
| `stage` | `string` | No | Curriculum Key Stage (e.g. `KS2 MATHS`, `KS3 PHYSICS`) |
| `duration` | `number` | **Yes** | Total loop duration in seconds ($> 0$, typically $8.0$ to $20.0$) |
| `viewBox` | `string` | No | SVG viewBox boundaries. Default: `"0 0 800 480"` |
| `easing` | `string` | No | Master easing function: `linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`, `cubic` |
| `keyframes` | `Array<Keyframe>` | **Yes** | Milestone markers for timeline navigation and student check-ins |
| `subtitles` | `Array<Subtitle>` | No | Time-coded bilingual narration tracks |
| `audioCues` | `Array<AudioCue>` | No | Procedural Web Audio synthesizer triggers |
| `elements` | `Array<Element>` | No | Parametric vector geometry elements |
| `interactive` | `Interactive` | No | Zero-bloat hotspots and checkpoint gates |
| `render` | `Function / string`| No | Custom JS procedural SVG string generator function |

### Interactive Object (Hotspots & Checkpoints)
- `hotspots`: Array of clickable regions with `{ id, label, targetT, hint }`. Clicking on these elements jumps the player directly to `targetT`, plays a Web Audio chime, and narrates the station.
- `checkpoints`: Array of active recall gates with `{ t, title, prompt, options, answer, explanation }`. When playback reaches `t`, the player automatically pauses, displays a zero-bloat vector modal with multiple choice options, and resumes on correct answer.

### Keyframe Object
- `t`: Normalized timestamp from `0.00` to `1.00`.
- `title`: Short label (max 40 characters) displayed on timeline marker pins.
- `rule`: The pedagogical axiom or core curriculum rule.
- `mathNotation`: Optional ASCII or LaTeX expression.
- `misconceptionAlert`: Optional warning addressing typical student misunderstandings.

### Subtitle Object
- `start`: Timestamp in range `[0.0, 1.0]`.
- `end`: Timestamp in range `[0.0, 1.0]`, where `end > start`.
- `en`: English caption string (read aloud by speech engine if language is `en`).
- `es`, `fr`, `de`, `it`, `pl`, `pt`, `uk`, `ar`, `la`: Localized translations.

---

## 4. Supported Easing Functions

```
linear(t)        = t
easeInQuad(t)    = t * t
easeOutQuad(t)   = t * (2 - t)
easeInOutQuad(t) = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
cubic(t)         = t * t * t
```

---

## 5. Compact Lisp S-Expression Notation (`.ast`)

For token-constrained local inference, the schema maps 1:1 to S-Expressions:

```lisp
(scene :id "orbit" :duration 12.0 :stage "KS3 SCIENCE"
  (:title "Planetary Gravitational Orbits")
  (:easing "easeInOutQuad")
  (:keyframes
    ((:t 0.0 :title "Sun Center" :rule "Sun exerts gravitational pull.")
     (:t 0.5 :title "Perihelion" :rule "Max orbital speed.")
     (:t 1.0 :title "Period"     :rule "Completed orbit.")))
  (:subtitles
    ((:start 0.0 :end 0.5 :en "The planet accelerates toward perihelion." :es "El planeta acelera hacia el perihelio.")
     (:start 0.5 :end 1.0 :en "Equal areas in equal time intervals." :es "Áreas iguales en tiempos iguales.")))
  (:elements
    ((:circle :cx 400 :cy 240 :r 28 :fill "#f59e0b")
     (:orbit-path :cx 400 :cy 240 :rx 220 :ry 140 :stroke "#334155")
     (:particle :orbit (:cx 400 :cy 240 :rx 220 :ry 140) :r 10 :fill "#38bdf8" :label "Earth"))))
```
