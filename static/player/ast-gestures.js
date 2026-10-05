/**
 * static/player/ast-gestures.js
 *
 * St Joseph's Educational Media Suite - Zero-Bloat Flash-Caliber Direct Manipulation Subsystem
 * Copyright (c) 2026 Joseph Brewerton.
 * SPDX-License-Identifier: AGPL-3.0-or-later OR Commercial-License
 *
 * Provides true Adobe Flash / PhET / GeoGebra caliber direct interactivity:
 * 1. Direct In-Stage Pointer Drag & Drop (Piston, Tangent Probe, Weights, Wires, Levers)
 * 2. Stage-Embedded Glassmorphism Floating HUD Controls
 * 3. Smartboard & Stylus Pen Vector Annotation Whiteboard Layer
 * 4. Interactive Pedagogical X-Ray Hotspot Inspector
 * 5. Multi-sensory Procedural Acoustic Sonification (Pressure hiss, Switch snap, Slope pitch)
 */

(function (global) {
  'use strict';

  class ASTDirectGestureSubsystem {
    constructor(engine, options = {}) {
      this.engine = engine;
      this.options = options;
      this.stageSvg = null;
      this.sceneRoot = null;
      this.inkRoot = null;
      this.hudRoot = null;
      this.xrayTooltip = null;

      // Pointer Drag State
      this.isDragging = false;
      this.dragTarget = null;
      this.dragMode = null; // 'piston', 'tangent-probe', 'switch', 'generic-x', 'generic-xy'
      this.dragStart = { x: 0, y: 0 };
      this.targetInitial = { x: 0, y: 0 };

      // Pen Annotation Whiteboard State
      this.isPenActive = false;
      this.currentInkColor = '#facc15'; // Neon Gold default
      this.currentInkWidth = 3.5;
      this.isDrawing = false;
      this.currentStroke = null;
      this.strokes = [];

      // X-Ray Pedagogical Tooltip Mode
      this.isXRayActive = false;
      this.sonificationEnabled = true;

      // Audio Synthesizer Context
      this.audioCtx = null;

      // Bind methods
      this.handlePointerDown = this.handlePointerDown.bind(this);
      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handlePointerUp = this.handlePointerUp.bind(this);
      this.handlePointerCancel = this.handlePointerCancel.bind(this);
    }

    /**
     * Initializes and mounts gesture subsystem onto the SVG stage
     */
    init(stageSvg, sceneRoot) {
      this.stageSvg = stageSvg || document.getElementById('stage-svg');
      this.sceneRoot = sceneRoot || document.getElementById('scene-root');
      if (!this.stageSvg) return;

      this.setupDomLayers();
      this.setupEventListeners();
      this.setupGlassHud();
      this.setupXRayTooltip();
      this.enhanceSceneInteractivity();

      // Listen for scene load changes
      if (this.engine && typeof this.engine.on === 'function') {
        this.engine.on('presetchange', () => {
          setTimeout(() => this.enhanceSceneInteractivity(), 100);
        });
      }
    }

    /**
     * Creates dedicated SVG layers for annotations, HUD and X-Ray
     */
    setupDomLayers() {
      // 1. Whiteboard Ink Layer
      let inkGroup = this.stageSvg.querySelector('#annotation-ink-root');
      if (!inkGroup) {
        inkGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        inkGroup.id = 'annotation-ink-root';
        inkGroup.style.pointerEvents = 'none';
        this.stageSvg.appendChild(inkGroup);
      }
      this.inkRoot = inkGroup;

      // 2. Stage Drag Feedback Layer
      let hudGroup = this.stageSvg.querySelector('#stage-hud-root');
      if (!hudGroup) {
        hudGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        hudGroup.id = 'stage-hud-root';
        this.stageSvg.appendChild(hudGroup);
      }
      this.hudRoot = hudGroup;
    }

    /**
     * Attaches Pointer Events with full capture support for touch, stylus and mouse
     */
    setupEventListeners() {
      if (!this.stageSvg) return;

      this.stageSvg.addEventListener('pointerdown', this.handlePointerDown, { passive: false });
      window.addEventListener('pointermove', this.handlePointerMove, { passive: false });
      window.addEventListener('pointerup', this.handlePointerUp);
      window.addEventListener('pointercancel', this.handlePointerCancel);

      // Prevent default pinch-zoom or scrolling when dragging on interactive elements
      this.stageSvg.style.touchAction = 'none';
    }

    /**
     * Converts client screen coordinates into precise SVG coordinate space (0..800, 0..480)
     */
    screenToSvg(clientX, clientY) {
      if (!this.stageSvg) return { x: 0, y: 0 };
      const pt = this.stageSvg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = this.stageSvg.getScreenCTM();
      if (!ctm) return { x: clientX, y: clientY };
      const svgPt = pt.matrixTransform(ctm.inverse());
      return { x: svgPt.x, y: svgPt.y };
    }

    /**
     * Enhances interactive nodes with grab cursors, data attributes and tactile hover feedback
     */
    enhanceSceneInteractivity() {
      if (!this.stageSvg) return;

      // 1. Kinetic Gas Piston Handle
      const piston = this.stageSvg.querySelector('#kg-piston') || this.stageSvg.querySelector('#piston-assembly');
      if (piston) {
        piston.style.cursor = 'ew-resize';
        piston.setAttribute('data-draggable', 'piston');
        piston.setAttribute('data-pedagogical', 'kg-piston');
      }

      // 2. Calculus Tangent Probe
      const tangentAssembly = this.stageSvg.querySelector('#cc-tangent-assembly') || this.stageSvg.querySelector('#tangent-assembly') || this.stageSvg.querySelector('#tangent-probe');
      if (tangentAssembly) {
        tangentAssembly.style.cursor = 'grab';
        tangentAssembly.setAttribute('data-draggable', 'tangent-probe');
        tangentAssembly.setAttribute('data-pedagogical', 'cc-probe');
      }

      // 3. Electrical Switch
      const switchEl = this.stageSvg.querySelector('[data-action="toggle-switch"]') || this.stageSvg.querySelector('#circuit-switch') || this.stageSvg.querySelector('#switch-assembly');
      if (switchEl) {
        switchEl.style.cursor = 'pointer';
        switchEl.setAttribute('data-interactive', 'switch');
        switchEl.setAttribute('data-pedagogical', 'ec-switch');
      }

      // 4. Bourdon Gauge & Thermometer
      const gauge = this.stageSvg.querySelector('#kg-gauge-needle')?.parentNode;
      if (gauge) gauge.setAttribute('data-pedagogical', 'kg-gauge');

      const thermo = this.stageSvg.querySelector('#kg-thermo-fluid')?.parentNode;
      if (thermo) thermo.setAttribute('data-pedagogical', 'kg-thermo');

      const brownian = this.stageSvg.querySelector('#kg-brownian');
      if (brownian) brownian.setAttribute('data-pedagogical', 'kg-brownian');

      const integralArea = this.stageSvg.querySelector('#cc-integral-area') || this.stageSvg.querySelector('#integral-shaded-area');
      if (integralArea) integralArea.setAttribute('data-pedagogical', 'cc-integral');

      // 5. Pythagoras Theorem Draggable Handles & Action Buttons
      const pythHandleA = this.stageSvg.querySelector('#pyth-handle-a');
      if (pythHandleA) {
        pythHandleA.style.cursor = 'ns-resize';
        pythHandleA.setAttribute('data-draggable', 'pyth-handle-a');
        pythHandleA.setAttribute('data-pedagogical', 'pyth-handle-a');
      }
      const pythHandleB = this.stageSvg.querySelector('#pyth-handle-b');
      if (pythHandleB) {
        pythHandleB.style.cursor = 'ew-resize';
        pythHandleB.setAttribute('data-draggable', 'pyth-handle-b');
        pythHandleB.setAttribute('data-pedagogical', 'pyth-handle-b');
      }
      const sqA = this.stageSvg.querySelector('#pyth-poly-a');
      if (sqA) sqA.setAttribute('data-pedagogical', 'pyth-sq-a');
      const sqB = this.stageSvg.querySelector('#pyth-poly-b');
      if (sqB) sqB.setAttribute('data-pedagogical', 'pyth-sq-b');
      const sqC = this.stageSvg.querySelector('#pyth-poly-c');
      if (sqC) sqC.setAttribute('data-pedagogical', 'pyth-sq-c');
      const tri = this.stageSvg.querySelector('#pyth-triangle');
      if (tri) tri.setAttribute('data-pedagogical', 'pyth-triangle');
      const ra = this.stageSvg.querySelector('#pyth-right-angle');
      if (ra) ra.setAttribute('data-pedagogical', 'pyth-right-angle');

      // 6. Math Fishing Pond Hook & Bobber Manipulation
      const bobber = this.stageSvg.querySelector('#fishing-bobber');
      const hook = this.stageSvg.querySelector('#fishing-hook');
      if (bobber) {
        bobber.style.cursor = 'grab';
        bobber.setAttribute('data-draggable', 'fishing-hook');
        bobber.setAttribute('data-pedagogical', 'math-bobber');
      }
      if (hook) {
        hook.style.cursor = 'grab';
        hook.setAttribute('data-draggable', 'fishing-hook');
        hook.setAttribute('data-pedagogical', 'math-hook');
      }
    }

    /**
     * Primary PointerDown Handler
     */
    handlePointerDown(e) {
      if (e.target.closest('#stage-glass-hud-ui') || e.target.closest('.interactive-card')) {
        return;
      }

      const svgPt = this.screenToSvg(e.clientX, e.clientY);

      // A. If Whiteboard Pen Mode is active, draw ink stroke
      if (this.isPenActive) {
        e.preventDefault();
        this.isDrawing = true;
        this.startInkStroke(svgPt);
        return;
      }

      // B. Check for interactive direct-grab targets or action buttons
      const target = e.target.closest('[data-draggable], [data-interactive], [data-action], #kg-piston, #piston-assembly, #cc-tangent-assembly, #tangent-assembly, #tangent-probe, #pyth-handle-a, #pyth-handle-b, #fishing-hook, #fishing-bobber, #fishing-bobber-rig');

      if (target) {
        // Direct Action Buttons (e.g. Pythagoras steppers, presets, toggles)
        if (target.hasAttribute('data-action')) {
          e.preventDefault();
          this.handleActionClick(target.getAttribute('data-action'));
          this.createTouchRipple(svgPt.x, svgPt.y);
          return;
        }

        e.preventDefault();
        try {
          this.stageSvg.setPointerCapture(e.pointerId);
        } catch {}

        this.isDragging = true;
        this.dragTarget = target;
        this.dragStart = { x: svgPt.x, y: svgPt.y };

        // Determine specific drag mode
        if (target.id === 'mtn-climber' || target.getAttribute('data-draggable') === 'climber' || target.closest('#mtn-climber')) {
          this.dragMode = 'climber';
          target.style.cursor = 'grabbing';
          if (this.engine && this.engine._cachedElements) this.engine._cachedElements.isUserControlled = true;
          this.playAudioTone(440, 'triangle', 0.08);
        } else if (target.id === 'pyth-handle-a' || target.getAttribute('data-draggable') === 'pyth-handle-a') {
          this.dragMode = 'pyth-handle-a';
          target.style.cursor = 'ns-resize';
          if (this.engine && this.engine._cachedElements) this.engine._cachedElements.isUserControlled = true;
          this.playAudioTone(440, 'triangle', 0.08);
        } else if (target.id === 'pyth-handle-b' || target.getAttribute('data-draggable') === 'pyth-handle-b') {
          this.dragMode = 'pyth-handle-b';
          target.style.cursor = 'ew-resize';
          if (this.engine && this.engine._cachedElements) this.engine._cachedElements.isUserControlled = true;
          this.playAudioTone(554.37, 'triangle', 0.08);
        } else if (target.hasAttribute('data-bind-input') || (this.engine && this.engine.activeBindInputs && this.engine.activeBindInputs.some(b => b.node === target || b.target === '#' + target.id || (target.id && b.target === target.id)))) {
          this.dragMode = 'bind-input';
          target.style.cursor = 'grabbing';
          this.playAudioTone(380, 'sine', 0.05);
        } else if (target.id === 'kg-piston' || target.id === 'piston-assembly' || target.getAttribute('data-draggable') === 'piston') {
          this.dragMode = 'piston';
          target.style.cursor = 'grabbing';
          this.playAudioTone(330, 'triangle', 0.08);
        } else if (target.id === 'cc-tangent-assembly' || target.id === 'tangent-assembly' || target.id === 'tangent-probe' || target.getAttribute('data-draggable') === 'tangent-probe') {
          this.dragMode = 'tangent-probe';
          target.style.cursor = 'grabbing';
          this.playAudioTone(440, 'sine', 0.08);
        } else if (target.id === 'fishing-hook' || target.id === 'fishing-bobber' || target.id === 'fishing-bobber-rig' || target.getAttribute('data-draggable') === 'fishing-hook' || target.closest('#fishing-rod-group')) {
          this.dragMode = 'fishing-hook';
          target.style.cursor = 'grabbing';
          if (this.engine && this.engine._cachedElements) this.engine._cachedElements.isUserControlled = true;
          this.playAudioTone(320, 'sine', 0.08, 0.18);
        } else if (target.getAttribute('data-interactive') === 'switch') {
          this.toggleSwitch(target);
          return;
        }

        // Show live touch ripples
        this.createTouchRipple(svgPt.x, svgPt.y);
      } else if (this.isXRayActive) {
        const pedNode = e.target.closest('[data-pedagogical]');
        if (pedNode) {
          this.showXRayPopup(pedNode.getAttribute('data-pedagogical'), svgPt.x, svgPt.y);
        }
      }
    }

    /**
     * Primary PointerMove Handler
     */
    handlePointerMove(e) {
      const svgPt = this.screenToSvg(e.clientX, e.clientY);

      // A. Whiteboard Pen Drawing
      if (this.isDrawing && this.currentStroke) {
        e.preventDefault();
        this.continueInkStroke(svgPt);
        return;
      }

      // B. Direct Canvas Dragging
      if (this.isDragging && this.dragTarget) {
        e.preventDefault();

        if (this.dragMode === 'climber') {
          this.handleClimberDrag(svgPt);
        } else if (this.dragMode === 'piston') {
          this.handlePistonDrag(svgPt.x);
        } else if (this.dragMode === 'tangent-probe') {
          this.handleTangentProbeDrag(svgPt.x);
        } else if (this.dragMode === 'bind-input') {
          this.handleBindInputDrag(this.dragTarget, svgPt);
        } else if (this.dragMode === 'pyth-handle-a') {
          this.handlePythagorasDragA(svgPt.y);
        } else if (this.dragMode === 'pyth-handle-b') {
          this.handlePythagorasDragB(svgPt.x);
        } else if (this.dragMode === 'fishing-hook') {
          this.handleFishingHookDrag(svgPt);
        }
      } else if (this.isXRayActive) {
        const pedNode = e.target.closest('[data-pedagogical]');
        if (pedNode) {
          this.showXRayPopup(pedNode.getAttribute('data-pedagogical'), svgPt.x, svgPt.y);
        } else {
          this.hideXRayPopup();
        }
      }
    }

    /**
     * Primary PointerUp Handler
     */
    handlePointerUp(e) {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.currentStroke = null;
      }

      if (this.isDragging && this.dragTarget) {
        try {
          this.stageSvg.releasePointerCapture(e.pointerId);
        } catch {}

        if (this.dragMode === 'piston') {
          this.dragTarget.style.cursor = 'ew-resize';
          this.playAudioTone(220, 'sine', 0.05);
        } else if (this.dragMode === 'tangent-probe') {
          this.dragTarget.style.cursor = 'grab';
          this.playAudioTone(523.25, 'sine', 0.06);
        } else if (this.dragMode === 'bind-input') {
          this.dragTarget.style.cursor = 'grab';
          this.playAudioTone(520, 'sine', 0.04);
        } else if (this.dragMode === 'pyth-handle-a') {
          this.dragTarget.style.cursor = 'ns-resize';
          this.playAudioTone(523.25, 'triangle', 0.08);
        } else if (this.dragMode === 'pyth-handle-b') {
          this.dragTarget.style.cursor = 'ew-resize';
          this.playAudioTone(659.25, 'triangle', 0.08);
        } else if (this.dragMode === 'fishing-hook') {
          if (this.dragTarget) this.dragTarget.style.cursor = 'grab';
          this.finishFishingHookDrag();
        }

        this.isDragging = false;
        this.dragTarget = null;
        this.dragMode = null;
      }
    }

    handlePointerCancel(e) {
      this.handlePointerUp(e);
    }

    // =========================================================================
    // Direct Manipulation Action 0: Bidirectional Slider-to-Variable Drag
    // =========================================================================
    handleBindInputDrag(target, svgPt) {
      if (!this.engine || !this.engine.activeBindInputs) return;
      const binding = this.engine.activeBindInputs.find(b => b.node === target || b.target === '#' + target.id || (target.id && b.target === target.id));
      if (!binding) return;

      const axis = binding.axis || 'x';
      const tMin = binding.trackMin !== undefined ? binding.trackMin : (axis === 'y' ? 320 : 60);
      const tMax = binding.trackMax !== undefined ? binding.trackMax : (axis === 'y' ? 80 : 440);
      let ratio = 0;

      if (axis === 'y') {
        const minY = Math.min(tMin, tMax);
        const maxY = Math.max(tMin, tMax);
        const clampedY = Math.max(minY, Math.min(maxY, svgPt.y));
        ratio = (clampedY - tMin) / (tMax - tMin);
        target.setAttribute('transform', `translate(0, ${clampedY.toFixed(1)})`);
      } else if (axis === 'rotary') {
        const center = { x: binding.originX || 0, y: binding.originY || 0 };
        const angleRad = Math.atan2(svgPt.y - center.y, svgPt.x - center.x);
        let angleDeg = (angleRad * 180 / Math.PI) + 90;
        if (angleDeg < -135) angleDeg = -135;
        if (angleDeg > 135) angleDeg = 135;
        ratio = (angleDeg + 135) / 270;
        target.setAttribute('transform', `rotate(${angleDeg.toFixed(1)} ${center.x} ${center.y})`);
      } else {
        const minX = Math.min(tMin, tMax);
        const maxX = Math.max(tMin, tMax);
        const clampedX = Math.max(minX, Math.min(maxX, svgPt.x));
        ratio = (clampedX - tMin) / (tMax - tMin);
        target.setAttribute('transform', `translate(${clampedX.toFixed(1)}, 0)`);
      }

      ratio = Math.max(0, Math.min(1, ratio));
      const val = binding.min + ratio * (binding.max - binding.min);
      this.engine.setVar(binding.var, Number(val.toFixed(2)));
    }

    // =========================================================================
    // Direct Manipulation Action 1: Kinetic Gas Piston Direct Compression
    // =========================================================================
    handlePistonDrag(svgX) {
      // Piston bounds: 200 (compressed) to 450 (decompressed)
      const clampedX = Math.max(200, Math.min(450, svgX));
      
      // Update Piston Transform
      const pistonEl = this.stageSvg.querySelector('#kg-piston') || this.stageSvg.querySelector('#piston-assembly');
      if (pistonEl) {
        pistonEl.setAttribute('transform', `translate(${clampedX.toFixed(1)}, 0)`);
      }

      // Volume ratio: 1.0 at 450, 0.40 at 200
      const volRatio = (clampedX - 150) / 300;
      // Boyle's Law: P = P0 / V
      const pressureKpa = (101.3 / Math.max(0.35, volRatio)).toFixed(1);

      // Gauge needle angle: -45 deg at 101.3 kPa, +85 deg at 289 kPa
      const gaugeAngle = -45 + (1.0 - volRatio) * 130;
      const needle = this.stageSvg.querySelector('#kg-gauge-needle') || this.stageSvg.querySelector('#gauge-needle');
      if (needle) {
        needle.setAttribute('transform', `rotate(${gaugeAngle.toFixed(1)} 0 0)`);
      }

      const gaugeVal = this.stageSvg.querySelector('#kg-gauge-val') || this.stageSvg.querySelector('#gauge-value');
      if (gaugeVal) {
        gaugeVal.textContent = `${pressureKpa} kPa`;
      }

      const eqCard = this.stageSvg.querySelector('#kg-pv-eq') || this.stageSvg.querySelector('#pv-equation');
      if (eqCard) {
        eqCard.textContent = `P × V = ${(parseFloat(pressureKpa) * volRatio).toFixed(0)}  •  [Boyle's Law Direct Grab: V=${(volRatio * 100).toFixed(0)}%]`;
      }

      // Sync with Engine Reactive State Variables and Scene Cache
      if (this.engine && this.engine._cachedElements) {
        this.engine._cachedElements.userPistonX = clampedX;
      }
      if (this.engine && typeof this.engine.setVar === 'function') {
        this.engine.setVar('volume', parseFloat(volRatio.toFixed(3)));
        this.engine.setVar('pressure', parseFloat(pressureKpa));
      }

      // Procedural audio: compression pitch rises as pressure spikes
      if (this.sonificationEnabled && Math.random() < 0.15) {
        const freq = 200 + (1.0 - volRatio) * 400;
        this.playAudioTone(freq, 'sawtooth', 0.03, 0.05);
      }
    }

    // =========================================================================
    // Direct Manipulation Action 2: Calculus Curve Tangent Probe Dragging
    // =========================================================================
    handleTangentProbeDrag(svgX) {
      // Grid domain: x from 70 to 470 (center origin at x=250)
      const clampedX = Math.max(80, Math.min(460, svgX));
      const mathX = (clampedX - 250) / 50; // -3.4 to +4.2
      // Parabola equation: y = x^2 - 2x
      const mathY = mathX * mathX - 2 * mathX;
      // SVG Y: origin at 210, 25px per math unit
      const svgY = 210 - mathY * 25;

      const assembly = this.stageSvg.querySelector('#cc-tangent-assembly') || this.stageSvg.querySelector('#tangent-assembly');
      if (assembly) {
        assembly.setAttribute('transform', `translate(${clampedX.toFixed(1)}, ${svgY.toFixed(1)})`);
      }

      // Derivative slope: dy/dx = 2x - 2
      const slope = 2 * mathX - 2;
      const angleDeg = (-Math.atan(slope) * 180) / Math.PI;

      const line = this.stageSvg.querySelector('#cc-tangent-line') || this.stageSvg.querySelector('#tangent-line');
      if (line) {
        line.setAttribute('transform', `rotate(${angleDeg.toFixed(1)})`);
      }

      const slopeVal = this.stageSvg.querySelector('#cc-slope-val') || this.stageSvg.querySelector('#card-slope-val');
      if (slopeVal) {
        slopeVal.textContent = `m = ${slope >= 0 ? '+' : ''}${slope.toFixed(2)}`;
      }

      // Sync with Engine Reactive State Variables and Scene Cache
      if (this.engine && this.engine._cachedElements) {
        this.engine._cachedElements.userProbeX = clampedX;
      }
      if (this.engine && typeof this.engine.setVar === 'function') {
        this.engine.setVar('probeX', parseFloat(mathX.toFixed(2)));
        this.engine.setVar('probeY', parseFloat(mathY.toFixed(2)));
        this.engine.setVar('slope', parseFloat(slope.toFixed(2)));
      }

      // Detect Stationary Turning Point (dy/dx ≈ 0)
      if (Math.abs(slope) < 0.12) {
        if (!this._lastStationarySound || Date.now() - this._lastStationarySound > 800) {
          this.playAudioTone(880, 'sine', 0.25, 0.2); // Bright chime
          this._lastStationarySound = Date.now();
        }
      }
    }

    // =========================================================================
    // Direct Manipulation Action 3: Electrical Knife Switch Toggle
    // =========================================================================
    toggleSwitch(switchEl) {
      const isClosed = switchEl.getAttribute('data-state') !== 'open';
      const newState = isClosed ? 'open' : 'closed';
      switchEl.setAttribute('data-state', newState);

      // Sync with Engine Reactive State Variables
      if (this.engine && typeof this.engine.setVar === 'function') {
        this.engine.setVar('switchClosed', newState === 'closed');
      }

      // Play authentic mechanical snap click
      this.playAudioTone(isClosed ? 180 : 360, 'square', 0.04, 0.3);

      const bulbGlow = this.stageSvg.querySelector('#bulb-halo');
      const dots = this.stageSvg.querySelectorAll('.e-dot');

      if (newState === 'open') {
        if (bulbGlow) bulbGlow.setAttribute('opacity', '0.05');
        if (dots) dots.forEach(d => d.setAttribute('opacity', '0.2'));
      } else {
        if (bulbGlow) bulbGlow.setAttribute('opacity', '0.9');
        if (dots) dots.forEach(d => d.setAttribute('opacity', '1.0'));
      }
    }

    // =========================================================================
    // Direct Manipulation Action 4: Pythagoras Theorem PhET Geometry & Controls
    // =========================================================================
    handlePythagorasDragA(svgY) {
      const el = this.engine && this.engine._cachedElements;
      if (!el || typeof el.renderGeometry !== 'function') return;

      el.isUserControlled = true;
      const originY = el.oy !== undefined ? el.oy : 270;
      const scale = el.s !== undefined ? el.s : 20;

      // Vertical leg a extends upwards: topY = oy - a * s => a = (oy - svgY) / s
      const rawA = (originY - svgY) / scale;
      const clampedA = Math.max(2, Math.min(8, Math.round(rawA)));

      if (clampedA !== el.curA) {
        el.renderGeometry(clampedA, el.curB);
        if (this.engine && typeof this.engine.setVar === 'function') {
          this.engine.setVar('sideA', clampedA);
        }
        // Sonification & integer triple detection
        const c = Math.sqrt(clampedA * clampedA + el.curB * el.curB);
        const isTriple = Math.abs(c - Math.round(c)) < 0.001;
        if (isTriple) {
          this.playAudioTone(880, 'sine', 0.22, 0.22);
        } else {
          this.playAudioTone(300 + clampedA * 45, 'triangle', 0.05, 0.12);
        }
      }
    }

    handlePythagorasDragB(svgX) {
      const el = this.engine && this.engine._cachedElements;
      if (!el || typeof el.renderGeometry !== 'function') return;

      el.isUserControlled = true;
      const originX = el.ox !== undefined ? el.ox : 290;
      const scale = el.s !== undefined ? el.s : 20;

      // Horizontal leg b extends rightwards: rightX = ox + b * s => b = (svgX - ox) / s
      const rawB = (svgX - originX) / scale;
      const clampedB = Math.max(2, Math.min(10, Math.round(rawB)));

      if (clampedB !== el.curB) {
        el.renderGeometry(el.curA, clampedB);
        if (this.engine && typeof this.engine.setVar === 'function') {
          this.engine.setVar('sideB', clampedB);
        }
        // Sonification & integer triple detection
        const c = Math.sqrt(el.curA * el.curA + clampedB * clampedB);
        const isTriple = Math.abs(c - Math.round(c)) < 0.001;
        if (isTriple) {
          this.playAudioTone(880, 'sine', 0.22, 0.22);
        } else {
          this.playAudioTone(320 + clampedB * 40, 'triangle', 0.05, 0.12);
        }
      }
    }

    /**
     * Direct Manipulation of Mountain Elevation Climber
     * Projects pointer position onto slope line segment from (180, 380) to (400, 130)
     */
    handleClimberDrag(svgPt) {
      const el = this.engine && this.engine._cachedElements;
      if (!el || typeof el.updateGeometry !== 'function') return;

      el.isUserControlled = true;

      const startX = 180, startY = 380;
      const endX = 400, endY = 130;
      const dx = endX - startX;
      const dy = endY - startY;
      const segLenSq = dx * dx + dy * dy;

      const px = svgPt.x - startX;
      const py = svgPt.y - startY;
      const dot = px * dx + py * dy;
      let t = dot / segLenSq;
      t = Math.max(0, Math.min(1, t));

      el.updateGeometry(t);

      // Footstep & altitude audio feedback
      const freq = 360 + t * 300;
      this.playAudioTone(freq, 'sine', 0.04, 0.08);

      if (t >= 0.98) {
        this.playAudioTone(880, 'triangle', 0.2, 0.2);
      }
    }

    /**
     * Direct Manipulation of Math Fishing Hook & Bobber
     * Provides real-time pointer capture, rod flexion, fish collision & bond resolution
     */
    handleFishingHookDrag(svgPt) {
      const el = this.engine && this.engine._cachedElements;
      if (!this.stageSvg) return;

      if (el) el.isUserControlled = true;

      const clampedX = Math.max(80, Math.min(740, svgPt.x));
      const clampedY = Math.max(120, Math.min(440, svgPt.y));

      const hook = this.stageSvg.querySelector('#fishing-hook');
      const bobber = this.stageSvg.querySelector('#fishing-bobber');
      const bobberRig = this.stageSvg.querySelector('#fishing-bobber-rig');
      const line = this.stageSvg.querySelector('#fishing-line');
      const eqText = this.stageSvg.querySelector('#math-hud-equation');
      const rod = this.stageSvg.querySelector('#fishing-rod');

      // 1. Dynamic rod bending towards pointer
      if (rod) {
        const rodTipX = 80 + (clampedX - 80) * 0.35;
        const rodTipY = 30 + Math.min(45, (clampedY - 120) * 0.15);
        rod.setAttribute('x2', rodTipX.toFixed(1));
        rod.setAttribute('y2', rodTipY.toFixed(1));

        if (line) {
          line.setAttribute('x1', rodTipX.toFixed(1));
          line.setAttribute('y1', rodTipY.toFixed(1));
        }
      }

      // 2. Position hook & line
      if (hook) {
        hook.setAttribute('transform', `translate(${clampedX.toFixed(1)}, ${clampedY.toFixed(1)})`);
      }
      if (line) {
        line.setAttribute('x2', clampedX.toFixed(1));
        line.setAttribute('y2', clampedY.toFixed(1));
      }

      // 3. Bobber floats at waterline unless submerged by drag
      const bobberY = Math.min(160, Math.max(130, clampedY));
      if (bobber) {
        bobber.setAttribute('cx', clampedX.toFixed(1));
        bobber.setAttribute('cy', bobberY.toFixed(1));
      }
      if (bobberRig) {
        bobberRig.setAttribute('transform', `translate(${(clampedX - 320).toFixed(1)}, ${(bobberY - 140).toFixed(1)})`);
      }

      // 4. Fish collision detection in the pond
      if (el && el.fishEls && el.fishEls.length) {
        if (!this._hookedFish) {
          for (let i = 0; i < el.fishEls.length; i++) {
            const fish = el.fishEls[i];
            if (fish.caught) continue;
            // Get current fish coordinate
            let fx = fish.curX !== undefined ? fish.curX : fish.x;
            let fy = fish.curY !== undefined ? fish.curY : fish.y;
            const dist = Math.hypot(clampedX - fx, clampedY - fy);
            if (dist < 34) {
              // NIBBLE & HOOK!
              this._hookedFish = fish;
              fish.isHooked = true;
              this.playAudioTone(540, 'sine', 0.08, 0.2);
              setTimeout(() => this.playAudioTone(680, 'sine', 0.08, 0.25), 60);

              if (eqText) {
                const lang = (window.AST_ENGINE_ACTIVE_LANG || window.STJ_CURRENT_LANG || 'en').toLowerCase();
                if (lang.startsWith('es')) eqText.textContent = `¡Enganchaste un ${fish.val}! ¡Llévalo arriba!`;
                else if (lang.startsWith('fr')) eqText.textContent = `Accroché ${fish.val} ! Remontez-le !`;
                else if (lang.startsWith('la')) eqText.textContent = `Piscis ${fish.val} captus! Attolle!`;
                else eqText.textContent = `Hooked ${fish.val}! Pull above surface!`;
              }
              break;
            }
          }
        } else {
          // Move hooked fish with the hook
          if (this._hookedFish.el) {
            this._hookedFish.el.setAttribute('transform', `translate(${clampedX.toFixed(1)}, ${(clampedY + 12).toFixed(1)})`);
          }
        }
      }
    }

    finishFishingHookDrag() {
      if (!this._hookedFish) return;

      const hook = this.stageSvg.querySelector('#fishing-hook');
      const eqText = this.stageSvg.querySelector('#math-hud-equation');
      const el = this.engine && this.engine._cachedElements;
      const lang = (window.AST_ENGINE_ACTIVE_LANG || window.STJ_CURRENT_LANG || 'en').toLowerCase();

      // Check if dragged above surface (y < 200)
      const ctm = hook ? hook.getAttribute('transform') : null;
      let hookY = 240;
      if (ctm) {
        const match = ctm.match(/translate\(\s*[\d.-]+,\s*([\d.-]+)\)/);
        if (match) hookY = parseFloat(match[1]);
      }

      if (hookY < 200) {
        // Reeled In!
        const caughtFish = this._hookedFish;
        this._hookedFish = null;
        if (!el.caughtList) el.caughtList = [];
        el.caughtList.push(caughtFish.val);
        caughtFish.caught = true;

        if (el.caughtList.length === 1) {
          const needed = 10 - caughtFish.val;
          this.playAudioTone(440, 'triangle', 0.12, 0.2);
          if (eqText) {
            if (lang.startsWith('es')) eqText.textContent = `Pescado: ${caughtFish.val}. ¡Busca un ${needed} para hacer 10!`;
            else if (lang.startsWith('fr')) eqText.textContent = `Pêché : ${caughtFish.val}. Trouvez un ${needed} pour faire 10 !`;
            else if (lang.startsWith('la')) eqText.textContent = `Captus: ${caughtFish.val}. Requiris ${needed} ad decem!`;
            else eqText.textContent = `Caught ${caughtFish.val}! Need ${needed} to make 10!`;
          }
        } else {
          const sum = el.caughtList.reduce((a, b) => a + b, 0);
          if (sum === 10) {
            // Perfect Bond! Ascending Pentatonic Fanfare (C5 - E5 - G5 - C6)
            this.playAudioTone(523.25, 'triangle', 0.15, 0.25);
            setTimeout(() => this.playAudioTone(659.25, 'triangle', 0.15, 0.25), 140);
            setTimeout(() => this.playAudioTone(783.99, 'triangle', 0.15, 0.25), 280);
            setTimeout(() => this.playAudioTone(1046.50, 'sine', 0.40, 0.35), 420);

            if (eqText) {
              eqText.textContent = `🌟 ${el.caughtList.join(' + ')} = 10 (Bond Mastered!)`;
            }
            el.caughtList = [];
          } else {
            // Misconception / overshoot
            this.playAudioTone(180, 'sawtooth', 0.2, 0.2);
            if (eqText) {
              if (lang.startsWith('es')) eqText.textContent = `Total: ${sum} (≠ 10). ¡Intentémoslo de nuevo!`;
              else if (lang.startsWith('fr')) eqText.textContent = `Total : ${sum} (≠ 10). Réessayons !`;
              else if (lang.startsWith('la')) eqText.textContent = `Summa: ${sum}. Iterum conemur!`;
              else eqText.textContent = `Sum ${sum} != 10. Let's try again!`;
            }
            el.caughtList = [];
          }
        }
      } else {
        // Released back into water
        this._hookedFish.isHooked = false;
        this._hookedFish = null;
      }
    }

    handleActionClick(action) {
      const el = this.engine && this.engine._cachedElements;
      if (!el) return;

      el.isUserControlled = true;

      // -----------------------------------------------------------------------
      // Mountain Altitude & Trigonometry Apparatus Actions
      // -----------------------------------------------------------------------
      if (typeof el.updateGeometry === 'function') {
        if (action === 'mtn-inc-alt') {
          const newT = Math.min(1.0, (el.curT || 0) + (250 / 3000));
          el.updateGeometry(newT);
          this.playAudioTone(400 + newT * 260, 'sine', 0.06);
          return;
        } else if (action === 'mtn-dec-alt') {
          const newT = Math.max(0.0, (el.curT || 0) - (250 / 3000));
          el.updateGeometry(newT);
          this.playAudioTone(400 + newT * 260, 'sine', 0.06);
          return;
        } else if (action === 'mtn-angle-15') {
          el.slopeAngleDeg = 15;
          if (el.btnAng15) el.btnAng15.setAttribute('fill', '#0284c7');
          if (el.btnAng30) el.btnAng30.setAttribute('fill', '#1e293b');
          if (el.btnAng45) el.btnAng45.setAttribute('fill', '#1e293b');
          el.updateGeometry(el.curT);
          this.playAudioTone(520, 'triangle', 0.08);
          return;
        } else if (action === 'mtn-angle-30') {
          el.slopeAngleDeg = 30;
          if (el.btnAng15) el.btnAng15.setAttribute('fill', '#1e293b');
          if (el.btnAng30) el.btnAng30.setAttribute('fill', '#0284c7');
          if (el.btnAng45) el.btnAng45.setAttribute('fill', '#1e293b');
          el.updateGeometry(el.curT);
          this.playAudioTone(580, 'triangle', 0.08);
          return;
        } else if (action === 'mtn-angle-45') {
          el.slopeAngleDeg = 45;
          if (el.btnAng15) el.btnAng15.setAttribute('fill', '#1e293b');
          if (el.btnAng30) el.btnAng30.setAttribute('fill', '#1e293b');
          if (el.btnAng45) el.btnAng45.setAttribute('fill', '#0284c7');
          el.updateGeometry(el.curT);
          this.playAudioTone(640, 'triangle', 0.08);
          return;
        } else if (action === 'mtn-toggle-trig') {
          el.showTrig = !el.showTrig;
          el.updateGeometry(el.curT);
          this.playAudioTone(el.showTrig ? 600 : 300, 'sine', 0.06);
          return;
        } else if (action === 'mtn-toggle-lapse') {
          el.showAtmosphere = !el.showAtmosphere;
          if (el.hudGroup) el.hudGroup.style.display = el.showAtmosphere ? 'block' : 'none';
          if (el.btnLapseBg && el.btnLapseTxt) {
            el.btnLapseBg.setAttribute('fill', el.showAtmosphere ? '#0284c7' : '#1e293b');
            el.btnLapseTxt.textContent = el.showAtmosphere ? '🌡️ HUD: FULL' : '🌡️ HUD: MINI';
          }
          this.playAudioTone(el.showAtmosphere ? 520 : 320, 'sine', 0.06);
          return;
        } else if (action === 'mtn-jump-summit') {
          el.updateGeometry(1.0);
          this.playAudioTone(880, 'triangle', 0.2);
          return;
        } else if (action === 'mtn-reset') {
          el.isUserControlled = false;
          el.slopeAngleDeg = 30;
          el.showTrig = true;
          el.showAtmosphere = true;
          if (el.btnAng15) el.btnAng15.setAttribute('fill', '#1e293b');
          if (el.btnAng30) el.btnAng30.setAttribute('fill', '#0284c7');
          if (el.btnAng45) el.btnAng45.setAttribute('fill', '#1e293b');
          if (el.hudGroup) el.hudGroup.style.display = 'block';
          el.updateGeometry(0.0);
          this.playAudioTone(440, 'sine', 0.12);
          return;
        }
      }

      // -----------------------------------------------------------------------
      // Pythagoras Theorem Apparatus Actions
      // -----------------------------------------------------------------------
      if (typeof el.renderGeometry === 'function') {
        if (action === 'pyth-dec-a') {
          const newA = Math.max(2, (el.curA || 3) - 1);
          el.renderGeometry(newA, el.curB);
          if (this.engine && this.engine.setVar) this.engine.setVar('sideA', newA);
          this.playAudioTone(380, 'sine', 0.06);
        } else if (action === 'pyth-inc-a') {
          const newA = Math.min(8, (el.curA || 3) + 1);
          el.renderGeometry(newA, el.curB);
          if (this.engine && this.engine.setVar) this.engine.setVar('sideA', newA);
          this.playAudioTone(460, 'sine', 0.06);
        } else if (action === 'pyth-dec-b') {
          const newB = Math.max(2, (el.curB || 4) - 1);
          el.renderGeometry(el.curA, newB);
          if (this.engine && this.engine.setVar) this.engine.setVar('sideB', newB);
          this.playAudioTone(420, 'sine', 0.06);
        } else if (action === 'pyth-inc-b') {
          const newB = Math.min(10, (el.curB || 4) + 1);
          el.renderGeometry(el.curA, newB);
          if (this.engine && this.engine.setVar) this.engine.setVar('sideB', newB);
          this.playAudioTone(520, 'sine', 0.06);
        } else if (action === 'pyth-pre-345') {
          el.renderGeometry(3, 4);
          if (this.engine && this.engine.setVar) { this.engine.setVar('sideA', 3); this.engine.setVar('sideB', 4); }
          this.playAudioTone(660, 'triangle', 0.15);
        } else if (action === 'pyth-pre-6810') {
          el.renderGeometry(6, 8);
          if (this.engine && this.engine.setVar) { this.engine.setVar('sideA', 6); this.engine.setVar('sideB', 8); }
          this.playAudioTone(880, 'triangle', 0.15);
        } else if (action === 'pyth-pre-51213') {
          el.renderGeometry(5, 12);
          if (this.engine && this.engine.setVar) { this.engine.setVar('sideA', 5); this.engine.setVar('sideB', 12); }
          this.playAudioTone(1046.5, 'triangle', 0.18);
        } else if (action === 'pyth-toggle-grid') {
          el.showGrid = !el.showGrid;
          el.renderGeometry(el.curA, el.curB);
          this.playAudioTone(el.showGrid ? 600 : 300, 'sine', 0.06);
        } else if (action === 'pyth-toggle-liquid') {
          el.liquidMode = !el.liquidMode;
          el.renderGeometry(el.curA, el.curB);
          if (el.liquidMode && typeof el.animateLiquidPour === 'function') {
            el.animateLiquidPour();
          }
          this.playAudioTone(el.liquidMode ? 587.33 : 293.66, 'sine', 0.12);
        } else if (action === 'pyth-reset') {
          el.isUserControlled = false;
          el.showGrid = true;
          el.liquidMode = false;
          el.renderGeometry(3, 4);
          if (this.engine && this.engine.setVar) { this.engine.setVar('sideA', 3); this.engine.setVar('sideB', 4); }
          this.playAudioTone(440, 'sine', 0.15);
        }
      }
    }

    // =========================================================================
    // Whiteboard & Stylus Pen Ink Drawing Layer (Promethean / SMART / iPads)
    // =========================================================================
    startInkStroke(pt) {
      if (!this.inkRoot) return;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', this.currentInkColor);
      path.setAttribute('stroke-width', this.currentInkWidth.toString());
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('d', `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `);

      this.inkRoot.appendChild(path);
      this.currentStroke = {
        element: path,
        d: `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)} `,
        lastX: pt.x,
        lastY: pt.y
      };
      this.strokes.push(path);
    }

    continueInkStroke(pt) {
      if (!this.currentStroke) return;
      // Midpoint quadratic bézier smoothing for silky pen ink
      const midX = (this.currentStroke.lastX + pt.x) / 2;
      const midY = (this.currentStroke.lastY + pt.y) / 2;
      this.currentStroke.d += `Q ${this.currentStroke.lastX.toFixed(1)} ${this.currentStroke.lastY.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)} `;
      this.currentStroke.element.setAttribute('d', this.currentStroke.d);
      this.currentStroke.lastX = pt.x;
      this.currentStroke.lastY = pt.y;
    }

    clearWhiteboardInk() {
      if (!this.inkRoot) return;
      this.inkRoot.innerHTML = '';
      this.strokes = [];
      this.playAudioTone(440, 'triangle', 0.1);
    }

    // =========================================================================
    // Stage-Embedded Glass HUD Floating Bar
    // =========================================================================
    setupGlassHud() {
      const container = this.stageSvg.parentNode;
      if (!container || container.querySelector('#stage-glass-hud-ui')) return;

      const hud = document.createElement('div');
      hud.id = 'stage-glass-hud-ui';
      hud.style.cssText = `
        position: absolute;
        bottom: 58px;
        right: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(15, 23, 42, 0.88);
        backdrop-filter: blur(10px);
        padding: 5px 8px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        z-index: 30;
        user-select: none;
      `;

      // 1. Pen Tool Button
      const penBtn = this.createHudButton('✏️', 'Smartboard Pen Mode (Draw & Annotate)', () => {
        this.isPenActive = !this.isPenActive;
        penBtn.style.background = this.isPenActive ? '#eab308' : 'rgba(255, 255, 255, 0.08)';
        penBtn.style.color = this.isPenActive ? '#090d16' : '#ffffff';
        this.stageSvg.style.cursor = this.isPenActive ? 'crosshair' : 'default';
        penPalette.style.display = this.isPenActive ? 'flex' : 'none';
        this.playAudioTone(this.isPenActive ? 660 : 440, 'sine', 0.06);
      });

      // Pen Palette Mini Bar
      const penPalette = document.createElement('div');
      penPalette.style.cssText = 'display:none; align-items:center; gap:4px; margin-right:4px;';
      const colors = ['#facc15', '#38bdf8', '#4ade80', '#f43f5e', '#ffffff'];
      colors.forEach(col => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.style.cssText = `width:18px; height:18px; border-radius:50%; background:${col}; border:1px solid rgba(255,255,255,0.4); cursor:pointer; padding:0;`;
        dot.onclick = () => {
          this.currentInkColor = col;
          this.playAudioTone(587, 'sine', 0.03);
        };
        penPalette.appendChild(dot);
      });

      // Clear Ink Button
      const clearBtn = this.createHudButton('🗑️', 'Clear Whiteboard Ink', () => this.clearWhiteboardInk());

      // 2. X-Ray Discovery Button
      const xrayBtn = this.createHudButton('🔬', 'Pedagogical X-Ray Inspection', () => {
        this.isXRayActive = !this.isXRayActive;
        xrayBtn.style.background = this.isXRayActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)';
        xrayBtn.style.color = this.isXRayActive ? '#090d16' : '#ffffff';
        this.playAudioTone(this.isXRayActive ? 784 : 392, 'sine', 0.08);
      });

      // 3. Audio Sonification Button
      const soundBtn = this.createHudButton('🔊', 'Multi-sensory Procedural Audio', () => {
        this.sonificationEnabled = !this.sonificationEnabled;
        soundBtn.textContent = this.sonificationEnabled ? '🔊' : '🔇';
        soundBtn.style.opacity = this.sonificationEnabled ? '1.0' : '0.5';
        if (this.sonificationEnabled) this.playAudioTone(523, 'sine', 0.05);
      });

      hud.appendChild(penPalette);
      hud.appendChild(penBtn);
      hud.appendChild(clearBtn);
      hud.appendChild(xrayBtn);
      hud.appendChild(soundBtn);
      container.appendChild(hud);
    }

    createHudButton(icon, title, onClick) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.title = title;
      btn.innerHTML = icon;
      btn.style.cssText = `
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #f8fafc;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.15s ease;
      `;
      btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
      btn.onmouseleave = () => btn.style.transform = 'scale(1.0)';
      btn.onclick = onClick;
      return btn;
    }

    // =========================================================================
    // X-Ray Pedagogical Knowledge Tooltip
    // =========================================================================
    setupXRayTooltip() {
      const container = this.stageSvg.parentNode;
      if (!container || container.querySelector('#stage-xray-tooltip')) return;

      const tip = document.createElement('div');
      tip.id = 'stage-xray-tooltip';
      tip.style.cssText = `
        position: absolute;
        display: none;
        background: rgba(15, 23, 42, 0.95);
        backdrop-filter: blur(12px);
        border: 1px solid #38bdf8;
        border-radius: 8px;
        padding: 8px 12px;
        color: #f8fafc;
        font-size: 11px;
        font-family: system-ui, sans-serif;
        box-shadow: 0 6px 20px rgba(0,0,0,0.5);
        pointer-events: none;
        z-index: 35;
        max-width: 220px;
        line-height: 1.4;
      `;
      container.appendChild(tip);
      this.xrayTooltip = tip;
    }

    showXRayPopup(pedId, svgX, svgY) {
      if (!this.xrayTooltip) return;
      const KNOWLEDGE_BASE = {
        'kg-piston': {
          title: 'Movable Cylinder Piston',
          eq: 'V ∝ 1 / P',
          desc: 'Direct mechanical compression. Compressing the gas reduces container volume, doubling particle-wall collision frequency.'
        },
        'kg-gauge': {
          title: 'Bourdon Pressure Gauge',
          eq: 'P = Σ Δp / (A Δt)',
          desc: 'Measures continuous wall impulse momentum in kilopascals (kPa). Standard atmospheric pressure is 101.3 kPa.'
        },
        'kg-thermo': {
          title: 'Mercury Thermometer',
          eq: 'T = K (Kelvin)',
          desc: 'Scales root-mean-square kinetic velocity: v_rms = √(3kT/m). Thermal energy directly powers molecular velocity.'
        },
        'kg-brownian': {
          title: 'Brownian Pollen Particle',
          eq: 'Δx² = 2Dt',
          desc: 'Direct proof of atomic theory. Microscopic pollen jiggles from random unequal collisions from gas molecules.'
        },
        'cc-probe': {
          title: 'Instantaneous Tangent Probe',
          eq: 'dy/dx = lim(Δy / Δx)',
          desc: 'Calculates instantaneous rate of change. The slope of the line equals the exact derivative at that point.'
        },
        'cc-integral': {
          title: 'Definite Riemann Area',
          eq: 'Area = ∫[a,b] f(x) dx',
          desc: 'Continuous accumulation. Calculates the exact signed geometric area trapped between the curve and the horizontal x-axis.'
        },
        'ec-switch': {
          title: 'Knife Circuit Switch',
          eq: 'Closed: I = V / R',
          desc: 'Conductive copper bridge. When opened, air gap resistance is infinite, cutting current flow to 0 Amperes.'
        },
        'pyth-handle-a': {
          title: 'Leg a Dynamic Vertex Handle',
          eq: 'Leg a = Δy / scale',
          desc: 'Direct drag vertex. Vertically resizes side a. The square on leg a instantly updates to area a².'
        },
        'pyth-handle-b': {
          title: 'Leg b Dynamic Vertex Handle',
          eq: 'Leg b = Δx / scale',
          desc: 'Direct drag vertex. Horizontally resizes side b. The square on leg b instantly updates to area b².'
        },
        'pyth-sq-a': {
          title: 'Square on Leg a (a²)',
          eq: 'Area_a = a²',
          desc: 'Unit grid array of a × a squares. Green area represents the contribution of leg a.'
        },
        'pyth-sq-b': {
          title: 'Square on Leg b (b²)',
          eq: 'Area_b = b²',
          desc: 'Unit grid array of b × b squares. Blue area represents the contribution of leg b.'
        },
        'pyth-sq-c': {
          title: 'Hypotenuse Square (c²)',
          eq: 'c² = a² + b²',
          desc: 'Conservation of Area. Gold square exactly matches the sum of areas a² and b² in all Euclidean right triangles.'
        },
        'pyth-triangle': {
          title: 'Euclidean Right Triangle',
          eq: 'a² + b² = c²',
          desc: 'Right triangle connecting sides a, b, and hypotenuse c. Demonstrates invariant area conservation.'
        },
        'pyth-right-angle': {
          title: 'Right Angle Vertex (90°)',
          eq: 'a ⊥ b (90° / π/2 rad)',
          desc: 'The fundamental condition of Pythagoras theorem. Legs a and b must meet at an exact 90-degree angle.'
        },
        'mtn-climber': {
          title: 'High-Altitude Alpine Climber',
          eq: 'Elevation = Slope × sin(θ)',
          desc: 'Direct drag climber. Walking along a slope is the hypotenuse; true vertical altitude is the opposite rise above sea level.'
        },
        'mtn-lapse': {
          title: 'Environmental Lapse Rate',
          eq: 'T = T_0 - (h / 1000) × 6.5°C',
          desc: 'Tropospheric cooling with altitude. Atmospheric pressure drops exponentially with elevation, causing temperature and water boiling point to fall.'
        }
      };

      const info = KNOWLEDGE_BASE[pedId];
      if (!info) return;

      this.xrayTooltip.innerHTML = `
        <div style="color:#38bdf8; font-weight:800; font-size:11px; margin-bottom:2px;">${info.title}</div>
        <div style="color:#fde047; font-family:monospace; font-weight:800; margin-bottom:3px;">${info.eq}</div>
        <div style="color:#cbd5e1; font-size:10px;">${info.desc}</div>
      `;

      // Position relative to stage container
      const rect = this.stageSvg.getBoundingClientRect();
      const clientX = rect.left + (svgX / 800) * rect.width;
      const clientY = rect.top + (svgY / 480) * rect.height;

      this.xrayTooltip.style.left = `${Math.min(window.innerWidth - 240, clientX + 15)}px`;
      this.xrayTooltip.style.top = `${Math.max(10, clientY - 40)}px`;
      this.xrayTooltip.style.display = 'block';
    }

    hideXRayPopup() {
      if (this.xrayTooltip) {
        this.xrayTooltip.style.display = 'none';
      }
    }

    // =========================================================================
    // Touch Feedback Ripple
    // =========================================================================
    createTouchRipple(x, y) {
      if (!this.hudRoot) return;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toFixed(1));
      circle.setAttribute('cy', y.toFixed(1));
      circle.setAttribute('r', '8');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#38bdf8');
      circle.setAttribute('stroke-width', '2');
      circle.style.transition = 'all 0.4s ease-out';
      this.hudRoot.appendChild(circle);

      requestAnimationFrame(() => {
        circle.setAttribute('r', '32');
        circle.setAttribute('opacity', '0');
        setTimeout(() => circle.remove(), 420);
      });
    }

    // =========================================================================
    // Procedural Audio Sonification
    // =========================================================================
    playAudioTone(frequency = 440, type = 'sine', duration = 0.1, gainVal = 0.15) {
      if (!this.sonificationEnabled) return;
      try {
        if (!this.audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) this.audioCtx = new AudioContextClass();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
          this.audioCtx.resume();
        }
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + duration);
      } catch {}
    }
  }

  // Expose globally
  global.ASTDirectGestureSubsystem = ASTDirectGestureSubsystem;

})(typeof window !== 'undefined' ? window : globalThis);
