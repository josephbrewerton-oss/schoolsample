# AST Vector Player Language Specification (v2.6.0)

**St Joseph's Curriculum Portal — Decoupled Motion & Direct Manipulation Suite**  
*Document Version: 2.6.0 (October 2026)*  
*Codified Grammar & Architecture Standard*

---

## 1. Executive Philosophy & Purpose

The **Abstract Scene Tree (AST) Vector Language** is a domain-specific declarative grammar engineered as an **autonomous, zero-bloat, open-standard replacement for Adobe/Macromedia Flash and PhET simulations**.

### Core Invariants
1. **Zero Bloat (< 35 KB gzipped, < 150 KB uncompressed):** Zero external framework dependencies. Native browser SVG DOM, JavaScript, and Web Audio API.
2. **Deterministic Dual-Mode Delivery:**
   - **Narrative Mode:** 60 FPS keyframed timeline, bilingual narration, formative checkpoints.
   - **Direct Grab Sandbox Mode:** Direct mouse/stylus/touch drag-and-drop on live SVG elements with sub-pixel pointer capture.
3. **Smartboard Native:** Built-in Whiteboard Pen layer with quadratic Bézier smoothing for Promethean, SMART, ViewSonic, and Apple Pencil displays.
4. **Air-Gapped & Rural Ready:** Sub-15 ms cold start, zero cloud egress, standalone single-file packaging.

---

## 2. Formal Grammar Specification (EBNF & S-Expressions)

AST scenes are authored in token-efficient Lisp-like S-Expressions (`.ast`) or serialized JSON (`.json`). The canonical S-Expression grammar is defined below:

```ebnf
SceneDeclaration ::= "(:scene" ws 
                     ":id" ws String ws 
                     ":title" ws String ws 
                     ":stage" ws String ws 
                     ":duration" ws Number ws
                     (Camera)?
                     (Subtitles)?
                     (Keyframes)?
                     (Bindings)?
                     (Interactive)?
                     (Gestures)?
                     ")"

Camera           ::= "(:camera" ws 
                     ":distance" ws Number ws 
                     ":pitch" ws Number ws 
                     ":yaw" ws (String | Number) ws 
                     ":fov" ws Number ")"

Variables        ::= "(:vars" ws "(" ws (Variable)* ws ")" ws ")"
Variable         ::= "(:var" ws ":name" ws String ws ":val" ws Literal ws
                     (":min" ws Number)? ws (":max" ws Number)? ws
                     (":step" ws Number)? ws (":unit" ws String)? ws
                     (":label" ws String)? ")"

Inputs           ::= "(:inputs" ws "(" ws (InputControl)* ws ")" ws ")"
InputControl     ::= "(:" ("slider" | "switch" | "button" | "number") ws 
                     ":var" ws String ws ":label" ws String ")"

Computed         ::= "(:computed" ws "(" ws (ComputedProp)* ws ")" ws ")"
ComputedProp     ::= "(:name" ws String ws ":expr" ws MathExpr ")"

Keyframes        ::= "(:keyframes" ws "(" ws (Keyframe)* ws ")" ws ")"
Keyframe         ::= "(:t" ws Fraction ws ":title" ws String ws ":rule" ws String ")"

Subtitles        ::= "(:subtitles" ws "(" ws (Subtitle)* ws ")" ws ")"
Subtitle         ::= "(:start" ws Fraction ws ":end" ws Fraction ws 
                     ":en" ws String (ws ":es" ws String)? (ws ":la" ws String)? ")"

Bindings         ::= "(:bindings" ws "(" ws (Binding)* ws ")" ws ")"
Binding          ::= Node3D | Line3D | Ring3D | Attr2D

Node3D           ::= "(:target" ws String ws ":type" ws "\"3d-node\"" ws 
                     ":x" ws MathExpr ws ":y" ws MathExpr ws ":z" ws MathExpr 
                     (ws ":base-r" ws Number)? (ws ":depth-fog" ws Boolean)? ")"

Line3D           ::= "(:target" ws String ws ":type" ws "\"3d-line\"" ws 
                     ":x1" ws MathExpr ws ":y1" ws MathExpr ws ":z1" ws MathExpr ws 
                     ":x2" ws MathExpr ws ":y2" ws MathExpr ws ":z2" ws MathExpr ")"

Attr2D           ::= "(:target" ws String ws ":attr" ws String ws ":expr" ws MathExpr ")"
                     ; Note: MathExpr receives (t, vars, Math) for reactive evaluations

Interactive      ::= "(:interactive" ws "(" ws (Checkpoint)* ws ")" ws ")"
Checkpoint       ::= "(:checkpoint" ws ":t" ws Fraction ws 
                     ":prompt" ws String ws 
                     ":options" ws "(" (String)* ")" ws 
                     ":answer" ws Integer ws 
                     ":explanation" ws String ")"

Gestures         ::= "(:gestures" ws "(" ws (Gesture)* ws ")" ws ")"
Gesture          ::= "(:draggable" ws ":target" ws String ws 
                     ":axis" ws ("\"x\"" | "\"y\"" | "\"xy\"" | "\"curve\"") ws 
                     ":min" ws Number ws ":max" ws Number ")"
```

---

## 3. The 6 Subsystems of the AST Player

### 3.1. Direct In-Stage Pointer Manipulation (`ast-gestures.js`)
* Binds to `#stage-svg` with full `PointerCapture`.
* Coordinates mapped via SVG inverse screen transformation matrix:
  $$\begin{pmatrix} x_{\text{svg}} \\ y_{\text{svg}} \end{pmatrix} = \mathbf{M}_{\text{CTM}}^{-1} \begin{pmatrix} x_{\text{screen}} \\ y_{\text{screen}} \end{pmatrix}$$
* Supported manipulation modes:
  - `piston`: Horizontal cylinder compression with dynamic Boyle's law feedback ($P \propto \frac{1}{V}$).
  - `tangent-probe`: Real-time sliding along $y = f(x)$ with instantaneous slope calculation ($\frac{dy}{dx} = f'(x)$) and stationary turning point chimes.
  - `switch`: Bistable mechanical switch toggling with electron circuit disconnect.
  - `xy-plane`: 2D physics dragging (weights, pulleys, lenses).

### 3.2. Classroom Whiteboard & Stylus Pen Ink Layer
* Top-level vector group `#annotation-ink-root`.
* Midpoint quadratic Bézier smoothing:
  $$B(t) = (1-t)^2 P_0 + 2(1-t)t P_1 + t^2 P_2$$
* Supports Promethean ActivPen, SMART board touch, and Apple Pencil with zero input lag.

### 3.3. Pedagogical X-Ray Discovery Tooltips
* Elements annotated with `data-pedagogical="[id]"` pop up a translucent glass card when tapped or hovered.
* Displays:
  - Scientific Law / Concept Title.
  - Mathematical Equation and SI Units.
  - Bilingual explanation (English / Spanish).

### 3.4. Multi-Sensory Procedural Vector Sonification
* Synthesizes audio using native Web Audio API oscillators:
  - Gas Compression: Frequency sweeps from $200\text{ Hz}$ to $600\text{ Hz}$ as pressure increases.
  - Turning Points: 880 Hz harmonic bell chime when $\left|\frac{dy}{dx}\right| < 0.1$.
  - Switches: Square-wave mechanical snap impulse ($180\text{ Hz} \to 360\text{ Hz}$).

### 3.5. 3D Projective Mathematics Subsystem
* Transforms world $(X, Y, Z)$ into 2D SVG canvas $(x_s, y_s)$ via 3D Yaw/Pitch rotation matrix and perspective foreshortening:
  $$x_s = \frac{X' \cdot d}{Z' + d} + 400, \quad y_s = 240 - \frac{Y' \cdot d}{Z' + d}$$
* Depth-sorting via Painter's algorithm with simulated exponential depth fog.

### 3.6. Formative Assessment Checkpoints
* Checkpoints trigger automatic pause at time $t$ on the timeline.
* Embeds self-marking pedagogical questions with instant formative remediation.

---

## 4. Canonical Scene File Example

```lisp
(:scene :id "kinetic-gas" :title "Kinetic Gas Theory & Boyle's Law" :stage "KS3/KS4 PHYSICS" :duration 14.0
  (:subtitles (
    (:start 0.00 :end 3.50 :en "Kinetic Molecular Theory explains gas pressure." :es "La teoría cinética explica la presión.")
    (:start 3.50 :end 7.20 :en "Boyle's Law: Halving volume doubles collision frequency." :es "Ley de Boyle: Reducir volumen duplica colisiones.")
  ))
  (:keyframes (
    (:t 0.00 :title "Equilibrium" :rule "V = 100%, P = 101.3 kPa")
    (:t 0.35 :title "Boyle's Compression" :rule "V = 50%, P = 202.6 kPa")
  ))
  (:bindings (
    (:target "#piston-assembly" :attr "transform" :expr "'translate(' + (430 - 180 * t) + ', 0)'")
    (:target "#gauge-needle" :attr "transform" :expr "'rotate(' + (-45 + 130 * t) + ' 0 0)'")
    (:target "#gauge-value" :attr "textContent" :expr "(101.3 / (1.0 - 0.5 * t)).toFixed(1) + ' kPa'")
  ))
  (:gestures (
    (:draggable :target "#piston-assembly" :axis "x" :min 200 :max 450)
  ))
  (:interactive (
    (:checkpoint :t 0.34
      :prompt "What happens to pressure if gas volume is halved at constant temperature?"
      :options ("Pressure doubles (P ∝ 1/V)" "Pressure halves" "No change")
      :answer 0
      :explanation "Boyle's Law dictates that P1 × V1 = P2 × V2. Halving distance doubles collision rate.")
  ))
)
```
