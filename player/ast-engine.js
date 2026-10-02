/**
 * static/player/ast-engine.js
 * 
 * St Joseph's AST Vector Media Player Engine & Runtime Suite
 * Copyright (c) 2026 Joseph Brewerton.
 * SPDX-License-Identifier: AGPL-3.0-or-later OR Commercial-License
 * 
 * Core AST Vector Media Player Engine with 3D Node Subsystem
 * Decoupled folder-based asset architecture:
 * - Dynamic ingestion of [id].svg templates & [id].ast S-expression descriptors
 * - Volumetric 3D Perspective Projection Subsystem (X, Y, Z -> x, y, scale, depthOpacity)
 * - Support for 3D Nodes (spheres/points), 3D Lines (rungs), 3D Rings (orbits/shells), and 3D Polygons (prisms/planes)
 * - Painter's Algorithm dynamic Z-sorting (unified occlusion layering)
 * - Interactive Camera Orbit Subsystem (drag to rotate, scroll to zoom, reset)
 * - Delta-time clamping (0.1s max) for background tab stability
 * - 100ms debounced on-device Web Speech synthesis
 * - Strict origin-validated bi-directional postMessage protocol
 * - Direct element attribute patching with compiled mathematical bindings (60 FPS budget)
 */

(function (global) {
  'use strict';

  /**
   * VectorMicroPhysics (< 1.5 KB Zero-Bloat Arcade & Educational 2D Physics)
   * Real-time Euler integration: Gravity, inertia, air drag, elastic bouncing,
   * ground friction, canvas boundaries, and inter-body circle collisions.
   */
  class VectorMicroPhysics {
    constructor(engine, options = {}) {
      this.engine = engine;
      this.gravity = options.gravity !== undefined ? options.gravity : 980; // px/sec² (~9.8 m/s²)
      this.friction = options.friction !== undefined ? options.friction : 0.985;
      this.groundY = options.groundY !== undefined ? options.groundY : 420;
      this.enabled = options.enabled !== false;
      this.bounds = Object.assign({ minX: 10, maxX: 790, minY: 0, maxY: 480 }, options.bounds || {});
      this.bodies = [];
      this.initialStates = new Map();
    }

    addBody(config = {}) {
      const id = config.id || (config.target ? String(config.target).replace(/^[#\.]/, '') : `body_${this.bodies.length + 1}`);
      const body = {
        id,
        target: config.target || `#${id}`,
        x: Number(config.x) || 0,
        y: Number(config.y) || 0,
        vx: Number(config.vx) || 0,
        vy: Number(config.vy) || 0,
        mass: Math.max(0.01, Number(config.mass) || 1.0),
        bounce: config.bounce !== undefined ? Number(config.bounce) : 0.45,
        friction: config.friction !== undefined ? Number(config.friction) : this.friction,
        groundY: config.groundY !== undefined ? Number(config.groundY) : this.groundY,
        radius: Number(config.radius) || 16,
        isGrounded: false,
        isStatic: Boolean(config.isStatic),
        element: null
      };

      this.removeBody(body.id);
      this.bodies.push(body);
      this.initialStates.set(body.id, Object.assign({}, body, { element: null }));
      return body;
    }

    removeBody(idOrTarget) {
      this.bodies = this.bodies.filter(b => b.id !== idOrTarget && b.target !== idOrTarget);
      this.initialStates.delete(idOrTarget);
    }

    clear() {
      this.bodies = [];
      this.initialStates.clear();
    }

    reset() {
      for (const b of this.bodies) {
        const init = this.initialStates.get(b.id);
        if (init) {
          b.x = init.x;
          b.y = init.y;
          b.vx = init.vx;
          b.vy = init.vy;
          b.isGrounded = false;
        }
      }
    }

    applyImpulse(idOrTarget, fx, fy) {
      const b = this.bodies.find(body => body.id === idOrTarget || body.target === idOrTarget);
      if (b && !b.isStatic) {
        b.vx += Number(fx || 0) / b.mass;
        b.vy += Number(fy || 0) / b.mass;
        b.isGrounded = false;
      }
    }

    jump(idOrTarget, jumpVelocity = -480) {
      const b = this.bodies.find(body => body.id === idOrTarget || body.target === idOrTarget);
      if (b && !b.isStatic && b.isGrounded) {
        b.vy = jumpVelocity;
        b.isGrounded = false;
        return true;
      }
      return false;
    }

    setGravity(g) {
      this.gravity = parseFloat(g) || 0;
    }

    setRestitution(bounce) {
      const bVal = Math.max(0, Math.min(1.0, parseFloat(bounce) || 0));
      for (const b of this.bodies) {
        b.bounce = bVal;
      }
    }

    setFriction(friction) {
      const fVal = Math.max(0.5, Math.min(1.0, parseFloat(friction) || 0.985));
      this.friction = fVal;
      for (const b of this.bodies) {
        b.friction = fVal;
      }
    }

    update(dt) {
      if (!this.enabled || dt <= 0 || this.bodies.length === 0) return;
      const root = (this.engine && this.engine.container) || (typeof document !== 'undefined' ? document : null);
      if (!root) return;

      for (let i = 0; i < this.bodies.length; i++) {
        const b = this.bodies[i];
        if (b.isStatic) continue;

        if (!b.element) {
          b.element = root.querySelector ? root.querySelector(b.target) : null;
        }

        // 1. Acceleration from gravity
        b.vy += this.gravity * dt;

        // 2. Air resistance damping
        const drag = Math.pow(b.friction, dt * 60);
        b.vx *= drag;
        b.vy *= drag;

        // 3. Integrate position
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // 4. Ground collision
        const effectiveGround = b.groundY !== undefined ? b.groundY : this.groundY;
        if (b.y >= effectiveGround) {
          b.y = effectiveGround;
          b.vy = -b.vy * b.bounce;
          // Surface friction
          b.vx *= 0.92;
          if (Math.abs(b.vy) < 20) {
            b.vy = 0;
            b.isGrounded = true;
          }
        } else {
          b.isGrounded = false;
        }

        // 5. Canvas horizontal boundaries bounce
        if (b.x < this.bounds.minX + b.radius) {
          b.x = this.bounds.minX + b.radius;
          b.vx = -b.vx * b.bounce;
        } else if (b.x > this.bounds.maxX - b.radius) {
          b.x = this.bounds.maxX - b.radius;
          b.vx = -b.vx * b.bounce;
        }

        // 6. Inter-body circle collisions
        for (let j = i + 1; j < this.bodies.length; j++) {
          const b2 = this.bodies[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b.radius + b2.radius;

          if (dist < minDist && dist > 0.001) {
            const nx = dx / dist;
            const ny = dy / dist;
            const overlap = minDist - dist;

            // Separate overlapping bodies
            if (!b.isStatic && !b2.isStatic) {
              b.x -= nx * overlap * 0.5;
              b.y -= ny * overlap * 0.5;
              b2.x += nx * overlap * 0.5;
              b2.y += ny * overlap * 0.5;
            } else if (!b.isStatic) {
              b.x -= nx * overlap;
              b.y -= ny * overlap;
            } else if (!b2.isStatic) {
              b2.x += nx * overlap;
              b2.y += ny * overlap;
            }

            // Normal impulse exchange
            const kx = b.vx - b2.vx;
            const ky = b.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / (b.mass + b2.mass);
            const restitution = Math.min(b.bounce, b2.bounce);

            if (!b.isStatic) {
              b.vx -= p * b2.mass * nx * (1 + restitution);
              b.vy -= p * b2.mass * ny * (1 + restitution);
            }
            if (!b2.isStatic) {
              b2.vx += p * b.mass * nx * (1 + restitution);
              b2.vy += p * b.mass * ny * (1 + restitution);
            }
          }
        }

        // 7. Render directly to SVG transform attribute
        if (b.element) {
          b.element.setAttribute('transform', `translate(${b.x.toFixed(2)}, ${b.y.toFixed(2)})`);
        }
      }
    }
  }

  class ASTVectorPlayerEngine {
    static VERSION = '2.5.1';
    static LICENSE = 'AGPL-3.0-or-later';
    constructor(options = {}) {
      this.options = Object.assign({
        preset: 'church-tour',
        lang: 'en',
        speed: 1.0,
        autoplay: false,
        theme: 'dark',
        voiceEnabled: false,
        container: null,
        basePath: './',
      }, options);

      this.activePresetId = this.options.preset || 'church-tour';
      this.currentLang = this.options.lang;
      this.speed = this.options.speed;
      this.isPlaying = this.options.autoplay;
      this.loop = this.options.loop !== undefined ? Boolean(this.options.loop) : true;
      this.volume = this.options.volume !== undefined ? parseFloat(this.options.volume) : 1.0;
      this.muted = Boolean(this.options.muted);
      this.progress = 0.0; // 0.000 to 1.000
      this.voiceEnabled = this.options.voiceEnabled;
      this.lastSpokenIndex = -1;
      this.lastTimestamp = null;
      this.animationFrameId = null;

      // Origin validation setup for strict zero-egress compliance
      let detectedOrigin = '*';
      if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null') {
        detectedOrigin = window.location.origin;
      }
      this.targetOrigin = this.options.targetOrigin || this.options.hostOrigin || detectedOrigin;

      // Container & Dynamic Bindings
      this._container = this.options.container || null;
      this.sceneCache = {};
      this.activeBindings = [];
      this.active3DNodes = [];
      this.active3DLines = [];
      this.active3DRings = [];
      this.active3DPolygons = [];
      this.active3DItems = []; // Unified 3D item collection for Painter's algorithm
      this._cachedElements = null;
      this._mountedSceneId = null;
      this._mountedContainer = null;

      // Interactive Camera Orbit State
      this.cameraOrbit = {
        yawOffset: 0,
        pitchOffset: 0,
        distanceScale: 1.0
      };

      // Speech synthesis debounce queue timer
      this._speakDebounceTimer = null;

      // Event listeners
      this.listeners = {
        timeupdate: [],
        keyframe: [],
        statechange: [],
        presetchange: [],
        langchange: [],
        camerachange: []
      };

      // Zero-Bloat Micro-Physics Subsystem (< 1.5 KB)
      this.physics = new VectorMicroPhysics(this, this.options.physics || {});

      // Load initial scene
      this.scene = this.getScene(this.activePresetId);
      this.durationSec = this.scene.duration || 10.0;

      // Bind methods
      this.tick = this.tick.bind(this);

      // Eagerly ingest initial scene assets if in browser
      if (typeof window !== 'undefined') {
        this.loadScene(this.activePresetId, this.isPlaying);
      }
    }

    get container() {
      return this._container;
    }

    set container(node) {
      this._container = node;
      if (node && this.scene) {
        this.mountSceneAsset(this.scene, node);
      }
    }

    getScene(presetId) {
      if (this.sceneCache && this.sceneCache[presetId]) {
        return this.sceneCache[presetId];
      }
      if (global.ASTSceneRegistry) {
        return global.ASTSceneRegistry.get(presetId);
      }
      if (global.ASTScenes && (global.ASTScenes[presetId] || global.ASTScenes['church-tour'])) {
        return global.ASTScenes[presetId] || global.ASTScenes['church-tour'];
      }
      return {
        id: presetId,
        stage: 'CURRICULUM',
        title: 'Parametric Scene',
        duration: 10.0,
        keyframes: [],
        subtitles: [],
        render: () => '<text x="400" y="240" fill="#fff" text-anchor="middle">Scene Ready</text>'
      };
    }

    on(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event].push(callback);
      }
      return () => this.off(event, callback);
    }

    off(event, callback) {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
      }
    }

    emit(event, data) {
      if (this.listeners[event]) {
        this.listeners[event].forEach(cb => {
          try { cb(data); } catch (err) { console.error('Engine event listener error:', err); }
        });
      }
      // Also notify parent iframe
      this.notifyParent({ type: event.toUpperCase(), ...data });
    }

    /**
     * Origin-validated parent notification
     * Replaces wildcard '*' with window.location.origin or explicit hostOrigin
     */
    notifyParent(payload) {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        const origin = (this.targetOrigin && this.targetOrigin !== 'null')
          ? this.targetOrigin
          : (window.location && window.location.origin && window.location.origin !== 'null' ? window.location.origin : '*');
        window.parent.postMessage({ source: 'ast-vector-player', ...payload }, origin);
      }
    }

    /**
     * Returns true if current active scene has 3D nodes/camera
     */
    has3D() {
      if (this.scene && this.scene.has3D) return true;
      if (this.activePresetId === 'church-tour' || this.activePresetId === 'solar-system' || this.activePresetId === 'atom') return true;
      if (this.active3DItems && this.active3DItems.length > 0) return true;
      if (this.active3DNodes && this.active3DNodes.length > 0) return true;
      if (this.active3DLines && this.active3DLines.length > 0) return true;
      if (this.active3DRings && this.active3DRings.length > 0) return true;
      return false;
    }

    /**
     * Rotate camera interactively (degrees)
     */
    rotateCamera(deltaYaw, deltaPitch) {
      this.cameraOrbit.yawOffset += deltaYaw;
      this.cameraOrbit.pitchOffset = Math.max(-85, Math.min(85, this.cameraOrbit.pitchOffset + deltaPitch));
      this.applyBindings(this.progress);
      this.emit('camerachange', { ...this.cameraOrbit });
    }

    /**
     * Zoom camera interactively (multiplier delta)
     */
    zoomCamera(deltaZoom) {
      this.cameraOrbit.distanceScale = Math.max(0.2, Math.min(4.0, this.cameraOrbit.distanceScale * (1 + deltaZoom)));
      this.applyBindings(this.progress);
      this.emit('camerachange', { ...this.cameraOrbit });
    }

    /**
     * Reset camera to default scene orientation
     */
    resetCamera() {
      this.cameraOrbit.yawOffset = 0;
      this.cameraOrbit.pitchOffset = 0;
      this.cameraOrbit.distanceScale = 1.0;
      this.applyBindings(this.progress);
      this.emit('camerachange', { ...this.cameraOrbit });
    }

    start() {
      if (!this.animationFrameId) {
        this.lastTimestamp = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        if (typeof requestAnimationFrame !== 'undefined') {
          this.animationFrameId = requestAnimationFrame(this.tick);
        }
      }
      if (this.isPlaying) {
        this.emit('statechange', { isPlaying: true, speed: this.speed });
      }
    }

    stop() {
      if (this.animationFrameId) {
        if (typeof cancelAnimationFrame !== 'undefined') {
          cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = null;
      }
      this.lastTimestamp = null;
      this.cancelSpeech();
    }

    play() {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.lastTimestamp = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        this.emit('statechange', { isPlaying: true, speed: this.speed });
      }
    }

    pause() {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.emit('statechange', { isPlaying: false, speed: this.speed });
      }
    }

    togglePlay() {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
      return this.isPlaying;
    }

    seek(newProgress) {
      this.progress = Math.max(0, Math.min(1, newProgress));
      this.updateActiveKeyframeAndSpeech(true);
      this.applyBindings(this.progress);
      this.emit('timeupdate', {
        progress: this.progress,
        currentTime: this.progress * this.durationSec,
        duration: this.durationSec
      });
    }

    step(delta) {
      this.seek(this.progress + delta);
    }

    setSpeed(newSpeed) {
      this.speed = Math.max(0.2, Math.min(5.0, parseFloat(newSpeed) || 1.0));
      this.emit('statechange', { isPlaying: this.isPlaying, speed: this.speed });
    }

    setLanguage(langCode) {
      this.currentLang = langCode || 'en';
      this.lastSpokenIndex = -1;
      this.cancelSpeech();
      this.emit('langchange', { lang: this.currentLang });
    }

    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled;
      if (!this.voiceEnabled) {
        this.cancelSpeech();
      }
      return this.voiceEnabled;
    }

    toggleLoop() {
      this.loop = !this.loop;
      this.emit('statechange', { isPlaying: this.isPlaying, loop: this.loop });
      return this.loop;
    }

    setLoop(enabled) {
      this.loop = Boolean(enabled);
      this.emit('statechange', { isPlaying: this.isPlaying, loop: this.loop });
      return this.loop;
    }

    setVolume(vol) {
      this.volume = Math.max(0, Math.min(1.0, parseFloat(vol) || 0));
      if (this.volume > 0 && this.muted) {
        this.muted = false;
      }
      this.emit('volumechange', { volume: this.volume, muted: this.muted });
      return this.volume;
    }

    toggleMute() {
      this.muted = !this.muted;
      this.emit('volumechange', { volume: this.volume, muted: this.muted });
      return this.muted;
    }

    setMuted(muted) {
      this.muted = Boolean(muted);
      this.emit('volumechange', { volume: this.volume, muted: this.muted });
      return this.muted;
    }

    cancelSpeech() {
      if (this._speakDebounceTimer) {
        clearTimeout(this._speakDebounceTimer);
        this._speakDebounceTimer = null;
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (err) {}
      }
    }

    speak(text) {
      this.speakText(text);
    }

    speakText(text) {
      if (typeof window === 'undefined' || !window.speechSynthesis || !this.voiceEnabled || !text) return;

      if (this._speakDebounceTimer) {
        clearTimeout(this._speakDebounceTimer);
        this._speakDebounceTimer = null;
      }

      try {
        window.speechSynthesis.cancel();
      } catch (err) {}

      this._speakDebounceTimer = setTimeout(() => {
        this._speakDebounceTimer = null;
        if (!this.voiceEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;

        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.95;
          utterance.volume = this.muted ? 0.0 : Math.max(0, Math.min(1.0, this.volume));
          utterance.lang = this.currentLang === 'es'
            ? 'es-ES'
            : this.currentLang === 'fr'
              ? 'fr-FR'
              : (this.currentLang === 'la' ? 'it-IT' : 'en-GB');
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('SpeechSynthesis error:', err);
        }
      }, 100);
    }

    getCurrentSubtitle() {
      if (!this.scene.subtitles || !this.scene.subtitles.length) return '';
      const sub = this.scene.subtitles.find(s => this.progress >= s.start && this.progress <= s.end);
      if (!sub) return '';
      return sub[this.currentLang] || sub.en || '';
    }

    updateActiveKeyframeAndSpeech(userSeeking = false) {
      if (!this.scene.keyframes || !this.scene.keyframes.length) return;

      let activeIndex = 0;
      for (let i = 0; i < this.scene.keyframes.length; i++) {
        if (this.progress >= this.scene.keyframes[i].t) {
          activeIndex = i;
        }
      }

      if (activeIndex !== this.lastSpokenIndex) {
        const kf = this.scene.keyframes[activeIndex];
        this.emit('keyframe', {
          index: activeIndex,
          title: kf.title,
          rule: kf.rule,
          progress: this.progress
        });

        if (this.voiceEnabled && (this.isPlaying || userSeeking)) {
          const subText = this.getCurrentSubtitle() || `${kf.title}. ${kf.rule}`;
          this.speakText(subText);
        }

        this.lastSpokenIndex = activeIndex;
      }
    }

    /**
     * Perspective 3D Projection Pipeline
     * Projects world space (X, Y, Z) to 2D SVG canvas (x, y, scale, depthOpacity)
     * Incorporates interactive camera orbit (yawOffset, pitchOffset, distanceScale)
     */
    project3D(x, y, z, camera, cx = 400, cy = 240) {
      const yawBase = (camera && camera.yaw) || 0;
      const pitchBase = (camera && camera.pitch) || 0;
      const rollBase = (camera && camera.roll) || 0;
      const distBase = (camera && camera.distance) || 450;
      const fov = (camera && camera.fov) || 60;

      const totalYaw = yawBase + (this.cameraOrbit ? this.cameraOrbit.yawOffset : 0);
      const totalPitch = Math.max(-85, Math.min(85, pitchBase + (this.cameraOrbit ? this.cameraOrbit.pitchOffset : 0)));
      const totalDist = Math.max(80, distBase * (this.cameraOrbit ? this.cameraOrbit.distanceScale : 1.0));

      const yawRad = totalYaw * (Math.PI / 180);
      const pitchRad = totalPitch * (Math.PI / 180);
      const rollRad = rollBase * (Math.PI / 180);
      const focalLength = 400 / Math.tan((fov * Math.PI) / 360);

      // 1. Yaw rotation (around Y axis)
      const x1 = x * Math.cos(yawRad) + z * Math.sin(yawRad);
      const y1 = y;
      const z1 = -x * Math.sin(yawRad) + z * Math.cos(yawRad);

      // 2. Pitch rotation (around X axis)
      const x2 = x1;
      const y2 = y1 * Math.cos(pitchRad) - z1 * Math.sin(pitchRad);
      const z2 = y1 * Math.sin(pitchRad) + z1 * Math.cos(pitchRad);

      // 3. Roll rotation (around Z axis)
      const x3 = x2 * Math.cos(rollRad) - y2 * Math.sin(rollRad);
      const y3 = x2 * Math.sin(rollRad) + y2 * Math.cos(rollRad);
      const z3 = z2;

      // 4. Camera distance offset
      const zCam = z3 + totalDist;
      const safeZ = Math.max(20, zCam);

      // 5. Perspective projection
      const scale = focalLength / safeZ;
      const projX = cx + x3 * scale;
      const projY = cy + y3 * scale;
      const depthOpacity = Math.min(1.0, Math.max(0.12, 0.35 + 0.65 * (scale / (focalLength / totalDist))));

      return {
        x: projX,
        y: projY,
        z: z3, // for Z-sorting (higher z means further back in camera space)
        scale,
        opacity: depthOpacity,
        safeZ
      };
    }

    /**
     * Parses S-Expression (.ast) into structured scene configuration
     * Supports :camera, :keyframes, :subtitles, 2D bindings, and 3D nodes/lines/rings/polygons
     */
    parseAst(astContent) {
      if (!astContent || typeof astContent !== 'string') return null;

      const extractSlot = (a, b) => {
        const text = b ? a : astContent;
        const reg = b ? b : a;
        if (!text || typeof text !== 'string') return null;
        const match = text.match(reg);
        return match ? match[1].trim().replace(/^"|"$/g, '') : null;
      };

      const id = extractSlot(/:id\s+("[^"]+"|[^\s\)]+)/i);
      const title = extractSlot(/:title\s+"([^"]+)"/i);
      const stage = extractSlot(/:stage\s+"([^"]+)"/i) || 'CURRICULUM';
      const durationStr = extractSlot(/:duration\s+([\d\.]+)/i);
      const duration = durationStr ? parseFloat(durationStr) : 10.0;

      // Camera definition
      const camMatch = astContent.match(/\(:camera\s+([\s\S]*?)\)/i);
      let camera = { distance: 500, pitch: 20, yaw: 0, fov: 60 };
      if (camMatch) {
        const cBody = camMatch[1];
        const getCamVal = (key) => {
          const m = cBody.match(new RegExp(`:${key}\\s+("[^"]+"|[\\d\\.-]+)`, 'i'));
          return m ? m[1].replace(/^"|"$/g, '') : null;
        };
        if (getCamVal('distance')) camera.distance = parseFloat(getCamVal('distance'));
        if (getCamVal('pitch')) camera.pitch = parseFloat(getCamVal('pitch')) || getCamVal('pitch');
        if (getCamVal('yaw')) camera.yaw = parseFloat(getCamVal('yaw')) || getCamVal('yaw');
        if (getCamVal('fov')) camera.fov = parseFloat(getCamVal('fov'));
      }

      // Keyframes
      const keyframes = [];
      const kfRegex = /\(:t\s+([\d\.]+)\s+:title\s+"([^"]+)"\s+:rule\s+"([^"]+)"\)/gi;
      let match;
      while ((match = kfRegex.exec(astContent)) !== null) {
        keyframes.push({
          t: parseFloat(match[1]),
          title: match[2],
          rule: match[3]
        });
      }

      // Subtitles
      const subtitles = [];
      const subRegex = /\(:start\s+([\d\.]+)\s+:end\s+([\d\.]+)\s+:en\s+"([^"]+)"(?:\s+:es\s+"([^"]+)")?(?:\s+:la\s+"([^"]+)")?\)/gi;
      while ((match = subRegex.exec(astContent)) !== null) {
        const subObj = {
          start: parseFloat(match[1]),
          end: parseFloat(match[2]),
          en: match[3]
        };
        if (match[4]) subObj.es = match[4];
        if (match[5]) subObj.la = match[5];
        subtitles.push(subObj);
      }

      // Helper to extract S-expression blocks with balanced parentheses
      const extractSexprBlocks = (text, tag) => {
        const blocks = [];
        const safeTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const startRegex = new RegExp('\\(' + safeTag + '[\\s)]', 'gi');
        let m;
        while ((m = startRegex.exec(text)) !== null) {
          const startIdx = m.index;
          let depth = 0;
          let inString = false;
          let endIdx = -1;
          for (let i = startIdx; i < text.length; i++) {
            const char = text[i];
            if (char === '"' && (i === 0 || text[i - 1] !== '\\')) {
              inString = !inString;
            } else if (!inString) {
              if (char === '(') depth++;
              else if (char === ')') {
                depth--;
                if (depth === 0) {
                  endIdx = i + 1;
                  break;
                }
              }
            }
          }
          if (endIdx !== -1) {
            blocks.push(text.slice(startIdx, endIdx));
          }
        }
        return blocks;
      };

      // Bindings (2D, 3D nodes, 3D lines, 3D rings, 3D polygons)
      const bindings = [];
      const bindBlocks = extractSexprBlocks(astContent, ':target');

      bindBlocks.forEach(block => {
        const target = extractSlot.call(null, block, /:target\s+"([^"]+)"/i);
        const type = extractSlot.call(null, block, /:type\s+"([^"]+)"/i);
        const attr = extractSlot.call(null, block, /:attr\s+"([^"]+)"/i);
        const expr = extractSlot.call(null, block, /:expr\s+"([^"]+)"/i);

        if (type === '3d-node') {
          const x = extractSlot.call(null, block, /:x\s+"([^"]+)"/i) || '0';
          const y = extractSlot.call(null, block, /:y\s+"([^"]+)"/i) || '0';
          const z = extractSlot.call(null, block, /:z\s+"([^"]+)"/i) || '0';
          const baseRStr = extractSlot.call(null, block, /:base-r\s+([\d\.]+)/i);
          const baseR = baseRStr ? parseFloat(baseRStr) : 8;
          const label = extractSlot.call(null, block, /:label\s+"([^"]+)"/i);
          const depthFogStr = extractSlot.call(null, block, /:depth-fog\s+([^\s\)]+)/i);
          const depthFog = depthFogStr !== 'false';

          bindings.push({
            type: '3d-node',
            target,
            x,
            y,
            z,
            baseR,
            label,
            depthFog
          });
        } else if (type === '3d-line') {
          bindings.push({
            type: '3d-line',
            target,
            x1: extractSlot.call(null, block, /:x1\s+"([^"]+)"/i) || '0',
            y1: extractSlot.call(null, block, /:y1\s+"([^"]+)"/i) || '0',
            z1: extractSlot.call(null, block, /:z1\s+"([^"]+)"/i) || '0',
            x2: extractSlot.call(null, block, /:x2\s+"([^"]+)"/i) || '0',
            y2: extractSlot.call(null, block, /:y2\s+"([^"]+)"/i) || '0',
            z2: extractSlot.call(null, block, /:z2\s+"([^"]+)"/i) || '0',
            cap1: extractSlot.call(null, block, /:cap1\s+"([^"]+)"/i),
            cap2: extractSlot.call(null, block, /:cap2\s+"([^"]+)"/i),
            baseR: parseFloat(extractSlot.call(null, block, /:base-r\s+([\d\.]+)/i) || '8')
          });
        } else if (type === '3d-ring') {
          const rStr = extractSlot.call(null, block, /:r\s+("[^"]+"|[\\d\\.]+)/i) || '100';
          const cx = extractSlot.call(null, block, /:cx\s+"([^"]+)"/i) || '0';
          const cy = extractSlot.call(null, block, /:cy\s+"([^"]+)"/i) || '0';
          const cz = extractSlot.call(null, block, /:cz\s+"([^"]+)"/i) || '0';
          const tiltX = extractSlot.call(null, block, /:tilt-x\s+("[^"]+"|[\\d\\.-]+)/i) || '0';
          const tiltY = extractSlot.call(null, block, /:tilt-y\s+("[^"]+"|[\\d\\.-]+)/i) || '0';
          const tiltZ = extractSlot.call(null, block, /:tilt-z\s+("[^"]+"|[\\d\\.-]+)/i) || '0';
          const segsStr = extractSlot.call(null, block, /:segments\s+([\d]+)/i);
          const segments = segsStr ? parseInt(segsStr, 10) : 24;
          const depthFogStr = extractSlot.call(null, block, /:depth-fog\s+([^\s\)]+)/i);
          const depthFog = depthFogStr !== 'false';

          bindings.push({
            type: '3d-ring',
            target,
            r: rStr,
            cx, cy, cz,
            tiltX, tiltY, tiltZ,
            segments,
            depthFog
          });
        } else if (type === '3d-polygon') {
          const ptsStr = extractSlot.call(null, block, /:points\s+"([^"]+)"/i) || extractSlot.call(null, block, /:pts\s+"([^"]+)"/i);
          const depthFogStr = extractSlot.call(null, block, /:depth-fog\s+([^\s\)]+)/i);
          const depthFog = depthFogStr !== 'false';
          const cullBackfaceStr = extractSlot.call(null, block, /:cull-backface\s+([^\s\)]+)/i);
          const cullBackface = cullBackfaceStr === 'true';

          bindings.push({
            type: '3d-polygon',
            target,
            pointsExpr: ptsStr,
            depthFog,
            cullBackface
          });
        } else if (target && attr && expr) {
          bindings.push({
            type: '2d-attr',
            target,
            attr,
            expr
          });
        }
      });

      // Checkpoints (Interactive Formative Assessment)
      const checkpoints = [];
      const cpBlocks = extractSexprBlocks(astContent, ':checkpoints');
      if (cpBlocks.length > 0) {
        const cpEntryBlocks = extractSexprBlocks(cpBlocks[0], ':t');
        cpEntryBlocks.forEach(cpText => {
          const tMatch = cpText.match(/:t\s+([\d\.]+)/i);
          const cpTitle = extractSlot.call(null, cpText, /:title\s+"([^"]+)"/i) || 'Checkpoint';
          const prompt = extractSlot.call(null, cpText, /:prompt\s+"([^"]+)"/i) || '';
          const ansMatch = cpText.match(/:answer\s+(\d+)/i);
          const explanation = extractSlot.call(null, cpText, /:explanation\s+"([^"]+)"/i) || '';

          const optBlocks = extractSexprBlocks(cpText, ':options');
          const options = [];
          if (optBlocks.length > 0) {
            const optRegex = /"([^"]+)"/g;
            let om;
            while ((om = optRegex.exec(optBlocks[0])) !== null) {
              options.push(om[1]);
            }
          }

          if (tMatch && prompt) {
            checkpoints.push({
              t: parseFloat(tMatch[1]),
              title: cpTitle,
              prompt: prompt,
              options: options.length > 0 ? options : ['Correct', 'Incorrect'],
              answer: ansMatch ? parseInt(ansMatch[1], 10) : 0,
              explanation: explanation
            });
          }
        });
      }

      // Micro-physics block parsing (:physics (:gravity 980 ...) (:body ...))
      const physicsBlocks = extractSexprBlocks(astContent, ':physics');
      let physics = null;
      if (physicsBlocks.length > 0) {
        const pb = physicsBlocks[0];
        const gMatch = pb.match(/:gravity\s+([\d\.\-]+)/i);
        const fMatch = pb.match(/:friction\s+([\d\.]+)/i);
        const grMatch = pb.match(/:ground\s+([\d\.]+)/i);

        const bodyBlocks = extractSexprBlocks(pb, ':body');
        const bodies = bodyBlocks.map(bText => {
          const bId = extractSlot(bText, /:id\s+"([^"]+)"/i) || extractSlot(bText, /:id\s+([^\s\)]+)/i);
          const target = extractSlot(bText, /:target\s+"([^"]+)"/i) || extractSlot(bText, /:target\s+([^\s\)]+)/i);
          const x = parseFloat(extractSlot(bText, /:x\s+([\d\.\-]+)/i) || 0);
          const y = parseFloat(extractSlot(bText, /:y\s+([\d\.\-]+)/i) || 0);
          const vx = parseFloat(extractSlot(bText, /:vx\s+([\d\.\-]+)/i) || 0);
          const vy = parseFloat(extractSlot(bText, /:vy\s+([\d\.\-]+)/i) || 0);
          const mass = parseFloat(extractSlot(bText, /:mass\s+([\d\.]+)/i) || 1.0);
          const bounce = parseFloat(extractSlot(bText, /:bounce\s+([\d\.]+)/i) || 0.45);
          const radius = parseFloat(extractSlot(bText, /:radius\s+([\d\.]+)/i) || 16);
          const groundYStr = extractSlot(bText, /:groundY\s+([\d\.]+)/i);
          const groundY = groundYStr ? parseFloat(groundYStr) : undefined;
          return { id: bId, target: target || `#${bId}`, x, y, vx, vy, mass, bounce, radius, groundY };
        });

        physics = {
          gravity: gMatch ? parseFloat(gMatch[1]) : 980,
          friction: fMatch ? parseFloat(fMatch[1]) : 0.985,
          groundY: grMatch ? parseFloat(grMatch[1]) : 420,
          bodies
        };
      }

      const has3D = Boolean(camMatch || bindings.some(b => b.type && b.type.startsWith('3d-')));

      return {
        id: id || 'custom-scene',
        title: title || 'AST Vector Scene',
        stage,
        duration,
        camera: camMatch ? camera : null,
        has3D,
        keyframes,
        subtitles,
        bindings,
        checkpoints,
        physics,
        interactive: checkpoints.length > 0 ? { checkpoints, hotspots: [] } : null
      };
    }

    /**
     * Dynamically ingests [id].svg and [id].ast assets on selection
     */
    async loadScene(presetId, shouldPlay = false) {
      this.cancelSpeech();
      const normalizedId = (global.ASTSceneRegistry && typeof global.ASTSceneRegistry.normalizeId === 'function')
        ? global.ASTSceneRegistry.normalizeId(presetId)
        : presetId;
      presetId = normalizedId;
      this.activePresetId = presetId;
      this.progress = 0.0;
      this.lastSpokenIndex = -1;
      this.resetCamera();

      // Clear active collections immediately to prevent race conditions during load
      this.active3DItems = [];
      this.active3DNodes = [];
      this.active3DLines = [];
      this.active3DRings = [];
      this.active3DPolygons = [];
      this.activeBindings = [];
      this._cachedElements = null;
      this._mountedSceneId = null;

      if (this.container) {
        this.container.innerHTML = '';
      }

      let scene = this.sceneCache[presetId];

      if (!scene) {
        const registryScene = (global.ASTSceneRegistry && global.ASTSceneRegistry.get(presetId)) || (global.ASTScenes && global.ASTScenes[presetId]) || {};
        let svgText = '';
        let astText = '';

        if (typeof fetch !== 'undefined') {
          try {
            const base = (this.options.basePath || './').replace(/\/?$/, '/');
            const cacheBust = '?v=2.5.1';
            const svgPath = `${base}scenes/${presetId}.svg${cacheBust}`;
            const astPath = `${base}scenes/${presetId}.ast${cacheBust}`;

            const [svgRes, astRes] = await Promise.all([
              fetch(svgPath).catch(() => null),
              fetch(astPath).catch(() => null)
            ]);

            if (svgRes && svgRes.ok) svgText = await svgRes.text();
            if (astRes && astRes.ok) astText = await astRes.text();
          } catch (e) {
            console.warn('[AST Engine] Asset fetch notice for:', presetId, e);
          }
        }

        const isNotFound = !svgText && !astText && !registryScene.mount && !registryScene.render && (!registryScene.keyframes || !registryScene.keyframes.length);
        if (isNotFound) {
          const errMsg = `Scene "${presetId}" could not be located in registry or fetched from asset path.`;
          console.warn(`[AST Engine] ${errMsg}`);
          this.emit('error', { type: 'SCENE_NOT_FOUND', presetId, message: errMsg });
          this.notifyParent({ type: 'PLAYER_ERROR', presetId, message: errMsg });
          if (this.container) {
            this.renderErrorPlaceholder(presetId, errMsg);
          }
          return null;
        }

        let parsedAst = null;
        if (astText) {
          try {
            parsedAst = this.parseAst(astText);
          } catch (err) {
            console.warn('[AST Engine] Error parsing AST for', presetId, err);
            this.emit('error', { type: 'AST_PARSE_ERROR', presetId, message: err.message });
          }
        }
        const has3D = Boolean(
          (parsedAst && parsedAst.has3D) ||
          (parsedAst && parsedAst.camera) ||
          (registryScene && registryScene.has3D)
        );

        scene = {
          id: presetId,
          title: (parsedAst && parsedAst.title) || registryScene.title || presetId,
          stage: (parsedAst && parsedAst.stage) || registryScene.stage || 'CURRICULUM',
          duration: (parsedAst && parsedAst.duration) || registryScene.duration || 10.0,
          camera: has3D ? ((parsedAst && parsedAst.camera) || registryScene.camera || { distance: 500, pitch: 20, yaw: 0, fov: 60 }) : null,
          has3D: has3D,
          interactive: registryScene.interactive || (parsedAst && parsedAst.interactive) || null,
          keyframes: (parsedAst && parsedAst.keyframes && parsedAst.keyframes.length) ? parsedAst.keyframes : (registryScene.keyframes || []),
          subtitles: (parsedAst && parsedAst.subtitles && parsedAst.subtitles.length) ? parsedAst.subtitles : (registryScene.subtitles || []),
          rawBindings: (parsedAst && parsedAst.bindings) || [],
          svgText: svgText,
          mount: registryScene.mount,
          update: registryScene.update,
          render: registryScene.render
        };

        this.sceneCache[presetId] = scene;
      }

      this.scene = scene;
      this.durationSec = this.scene.duration || 10.0;

      // Mount into container
      if (this.container) {
        this.mountSceneAsset(scene, this.container);
      }

      this.emit('presetchange', {
        preset: this.activePresetId,
        title: this.scene.title,
        stage: this.scene.stage,
        duration: this.durationSec,
        has3D: this.has3D(),
        hasInteractive: Boolean(this.scene && this.scene.interactive && this.scene.interactive.checkpoints && this.scene.interactive.checkpoints.length),
        camera: this.scene.camera,
        keyframes: this.scene.keyframes || []
      });

      this.seek(0);
      if (shouldPlay) {
        this.play();
      }
      return this.scene;
    }

    setPreset(presetId, shouldPlay = false) {
      return this.loadScene(presetId, shouldPlay);
    }

    /**
     * Ingests and mounts an in-memory scene object directly without requiring filesystem fetch.
     * Ideal for standalone npm packages and programmatic scene generation.
     * @param {Object} sceneData
     * @param {boolean} shouldPlay
     */
    loadSceneData(sceneData, shouldPlay = false) {
      if (!sceneData || typeof sceneData !== 'object') {
        const err = new Error('[AST Engine] loadSceneData requires a valid scene object');
        this.emit('error', { type: 'INVALID_SCENE_DATA', message: err.message });
        throw err;
      }
      const id = sceneData.id || `custom-${Date.now()}`;
      this.sceneCache[id] = {
        id,
        title: sceneData.title || id,
        stage: sceneData.stage || 'CUSTOM',
        duration: parseFloat(sceneData.duration) || 10.0,
        camera: sceneData.camera || null,
        has3D: Boolean(sceneData.has3D || sceneData.camera),
        interactive: sceneData.interactive || null,
        keyframes: sceneData.keyframes || [],
        subtitles: sceneData.subtitles || [],
        rawBindings: sceneData.bindings || sceneData.rawBindings || [],
        svgText: sceneData.svgText || '',
        mount: sceneData.mount,
        update: sceneData.update,
        render: sceneData.render
      };
      return this.loadScene(id, shouldPlay);
    }

    /**
     * Ingests local files (.json, .ast, .svg) via File/Blob APIs (e.g. file picker or drag-and-drop).
     * @param {File|Blob} file
     * @param {boolean} shouldPlay
     * @returns {Promise<Object>} Loaded scene
     */
    async loadFromFile(file, shouldPlay = false) {
      if (!file) {
        const err = new Error('[AST Engine] loadFromFile requires a valid File or Blob');
        this.emit('error', { type: 'FILE_LOAD_ERROR', message: err.message });
        throw err;
      }
      const filename = file.name || 'custom-asset';
      const ext = filename.split('.').pop().toLowerCase();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => {
          const err = new Error(`Failed to read file "${filename}": ${reader.error?.message}`);
          this.emit('error', { type: 'FILE_READ_ERROR', filename, message: err.message });
          if (this.container) {
            this.renderErrorPlaceholder(filename, err.message);
          }
          reject(err);
        };
        reader.onload = () => {
          try {
            const content = String(reader.result || '').trim();
            const id = filename.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9_-]/g, '-');

            if (ext === 'json') {
              const json = JSON.parse(content);
              json.id = json.id || id;
              const loaded = this.loadSceneData(json, shouldPlay);
              this.emit('fileloaded', { filename, type: 'json', id: json.id });
              resolve(loaded);
            } else if (ext === 'svg') {
              const loaded = this.loadSceneData({
                id,
                title: filename,
                stage: 'CUSTOM SVG',
                duration: 10.0,
                svgText: content,
                keyframes: [],
                subtitles: []
              }, shouldPlay);
              this.emit('fileloaded', { filename, type: 'svg', id });
              resolve(loaded);
            } else if (ext === 'ast') {
              const parsed = this.parseAst(content);
              const scene = {
                id: (parsed && parsed.id) || id,
                title: (parsed && parsed.title) || filename,
                stage: (parsed && parsed.stage) || 'CUSTOM AST',
                duration: (parsed && parsed.duration) || 10.0,
                keyframes: (parsed && parsed.keyframes) || [],
                subtitles: (parsed && parsed.subtitles) || [],
                rawBindings: (parsed && parsed.bindings) || [],
                svgText: ''
              };
              const loaded = this.loadSceneData(scene, shouldPlay);
              this.emit('fileloaded', { filename, type: 'ast', id: scene.id });
              resolve(loaded);
            } else {
              // Heuristic content-based detection
              if (content.startsWith('{')) {
                const json = JSON.parse(content);
                resolve(this.loadSceneData(json, shouldPlay));
              } else if (content.startsWith('(')) {
                const parsed = this.parseAst(content);
                resolve(this.loadSceneData({ id, ...parsed }, shouldPlay));
              } else if (content.includes('<svg')) {
                resolve(this.loadSceneData({ id, title: filename, svgText: content }, shouldPlay));
              } else {
                throw new Error(`Unsupported file extension: .${ext}. Expected .json, .ast, or .svg.`);
              }
            }
          } catch (parseErr) {
            console.error('[AST Engine] Error parsing file:', filename, parseErr);
            this.emit('error', { type: 'FILE_PARSE_ERROR', filename, message: parseErr.message });
            if (this.container) {
              this.renderErrorPlaceholder(filename, `File parse failed: ${parseErr.message}`);
            }
            reject(parseErr);
          }
        };
        reader.readAsText(file);
      });
    }

    /**
     * Loads an external standalone scene manifest (.json), AST file (.ast), or SVG (.svg) from a remote URL.
     * @param {string} url
     * @param {boolean} shouldPlay
     */
    async loadFromUrl(url, shouldPlay = false) {
      if (!url || typeof url !== 'string') {
        const err = new Error('[AST Engine] loadFromUrl requires a valid URL');
        this.emit('error', { type: 'INVALID_URL', message: err.message });
        throw err;
      }
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const text = await res.text();
        const cleanUrl = url.split('?')[0];
        const filename = cleanUrl.split('/').pop() || 'remote-asset';
        const blob = new Blob([text], { type: res.headers.get('content-type') || 'text/plain' });
        try {
          Object.defineProperty(blob, 'name', { value: filename, writable: false });
        } catch {}
        return await this.loadFromFile(blob, shouldPlay);
      } catch (err) {
        console.error('[AST Engine] Failed to load from URL:', url, err);
        this.emit('error', { type: 'URL_LOAD_ERROR', url, message: err.message });
        if (this.container) {
          this.renderErrorPlaceholder(url, `Network error: ${err.message}`);
        }
        throw err;
      }
    }

    /**
     * Renders a resilient, accessible vector fallback card inside the container when a scene fails to load.
     * Prevents empty/black screen states in standalone embeds.
     */
    renderErrorPlaceholder(identifier, message) {
      if (!this.container) return;
      const safeId = String(identifier || 'Unknown').replace(/<[^>]+>/g, '');
      const safeMsg = String(message || 'Failed to load vector asset').replace(/<[^>]+>/g, '');
      this.container.innerHTML = `
        <svg viewBox="0 0 800 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:#090d16; border-radius:12px;">
          <rect x="20" y="20" width="760" height="440" rx="16" fill="#0f172a" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/>
          <circle cx="400" cy="180" r="42" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-width="2.5"/>
          <text x="400" y="192" fill="#ef4444" font-size="34" font-weight="bold" text-anchor="middle" font-family="system-ui, sans-serif">⚠️</text>
          <text x="400" y="260" fill="#f8fafc" font-size="20" font-weight="700" text-anchor="middle" font-family="system-ui, sans-serif">Scene Load Error</text>
          <text x="400" y="295" fill="#94a3b8" font-size="14" text-anchor="middle" font-family="system-ui, sans-serif">${safeMsg}</text>
          <text x="400" y="325" fill="#64748b" font-size="12" text-anchor="middle" font-family="monospace">Target: ${safeId}</text>
          <g cursor="pointer" id="error-fallback-action" transform="translate(325, 360)">
            <rect width="150" height="38" rx="19" fill="#2563eb"/>
            <text x="75" y="24" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle" font-family="system-ui, sans-serif">Load Default Scene</text>
          </g>
        </svg>
      `;
      const btn = this.container.querySelector('#error-fallback-action');
      if (btn) {
        btn.onclick = () => {
          this.loadScene('fractions', true);
        };
      }
    }

    /**
     * Sanitizes raw SVG text against XML bombs (CWE-776) and DOM-based XSS (CWE-79 / js/xss-through-dom).
     * Strips DOCTYPE, ENTITY declarations, script/foreignObject/iframe tags, inline on* handlers, and javascript: protocols.
     * @param {string} rawSvg
     * @returns {string} Clean SVG markup
     */
    sanitizeSvg(rawSvg) {
      if (!rawSvg || typeof rawSvg !== 'string') return '';
      let clean = rawSvg.trim();

      // 1. Mitigate XML Bomb (CWE-776): Neutralize DOCTYPE and ENTITY expansion
      if (/<!doctype|<!entity/i.test(clean)) {
        clean = clean
          .replace(/<!DOCTYPE[\s\S]*?]>(\r?\n)?/gi, '')
          .replace(/<!ENTITY[\s\S]*?>/gi, '');
      }

      // 2. Strip dangerous executable containers from raw string prior to DOM reinterpretation
      clean = clean
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, '')
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/<object[\s\S]*?<\/object>/gi, '')
        .replace(/<embed[\s\S]*?<\/embed>/gi, '');

      // 3. Strip inline event handlers (onload, onerror, onclick, etc.) from tag definitions
      //    Apply repeatedly until stable to avoid incomplete multi-character sanitization bypasses.
      let prevClean;
      do {
        prevClean = clean;
        clean = clean.replace(/\s+on[a-z0-9_-]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '');
      } while (clean !== prevClean);

      // 4. Strip dangerous URI schemes in href / xlink:href / src attributes
      clean = clean.replace(
        /\s+(?:xlink:)?href\s*=\s*['"]\s*(?:javascript|vbscript|data:(?!image\/)):?[^'"]*['"]/gi,
        ' href=""'
      );

      return clean;
    }

    /**
     * Deep-sanitizes parsed SVG DOM element tree before mounting into live container.
     * Recursively scrubs any nested executable elements or script attributes.
     * @param {Element} rootSvg
     * @returns {Element|null} Sanitized root SVG node
     */
    sanitizeSvgElement(rootSvg) {
      if (!rootSvg) return null;

      // 1. Remove dangerous elements if any bypassed string sanitization
      const dangerousTags = ['script', 'foreignobject', 'iframe', 'embed', 'object', 'link', 'meta', 'style'];
      for (const tag of dangerousTags) {
        rootSvg.querySelectorAll(tag).forEach(el => el.remove());
      }

      // 2. Deep-clean attributes across all descendants
      const allElements = [rootSvg, ...rootSvg.querySelectorAll('*')];
      for (const el of allElements) {
        if (!el.attributes) continue;
        const toRemove = [];
        for (let i = 0; i < el.attributes.length; i++) {
          const attr = el.attributes[i];
          const name = attr.name.toLowerCase();
          const val = (attr.value || '').trim().toLowerCase();

          if (name.startsWith('on')) {
            toRemove.push(attr.name);
          } else if (
            (name === 'href' || name.endsWith(':href') || name === 'src') &&
            /^(javascript:|vbscript:|data:(?!image\/(png|jpe?g|gif|webp|svg\+xml)))/i.test(val)
          ) {
            toRemove.push(attr.name);
          }
        }
        for (const attrName of toRemove) {
          el.removeAttribute(attrName);
        }
      }

      return rootSvg;
    }

    /**
     * Mounts SVG template and compiles AST bindings to DOM nodes
     */
    mountSceneAsset(scene, container) {
      if (!container || !scene || this._isMounting) return;
      this._isMounting = true;
      try {
        this._mountedContainer = container;
        this._mountedSceneId = scene.id;
        this.activeBindings = [];
        this.active3DNodes = [];
        this.active3DLines = [];
        this.active3DRings = [];
        this.active3DPolygons = [];
        this.active3DItems = [];
        this._cachedElements = null;

        // 1. Mount SVG template if available
        if (scene.svgText) {
          try {
            const safeSvg = this.sanitizeSvg(scene.svgText);

            if (safeSvg && typeof DOMParser !== 'undefined') {
              const parser = new DOMParser();
              const doc = parser.parseFromString(safeSvg, 'image/svg+xml');

              if (!doc.querySelector('parsererror')) {
                const rootSvg = doc.querySelector('svg');
                if (rootSvg) {
                  this.sanitizeSvgElement(rootSvg);
                  container.replaceChildren(...rootSvg.childNodes);
                }
              }
            }
          } catch (err) {
            console.warn('SVG mount bypassed due to parse failure:', err);
          }
        } else if (typeof scene.render === 'function' && typeof scene.mount !== 'function') {
          const rendered = scene.render(this.progress);
          if (rendered instanceof Node) {
            container.replaceChildren(rendered);
          } else if (typeof rendered === 'string') {
            const temp = document.createElement('div');
            temp.textContent = rendered;
            container.replaceChildren(temp);
          }
        }

        // 2. Run procedural mount hook (can populate existing SVG nodes or build its own)
        if (typeof scene.mount === 'function') {
          this._cachedElements = scene.mount(container);
        }

      // Compile AST mathematical evaluation bindings
      if (scene.rawBindings && scene.rawBindings.length) {
        scene.rawBindings.forEach(b => {
          if (b.type === '3d-node') {
            const node = container.querySelector(b.target);
            if (node) {
              let evalX = () => 0, evalY = () => 0, evalZ = () => 0;
              try { evalX = new Function('t', 'Math', `"use strict"; return (${b.x});`); } catch {}
              try { evalY = new Function('t', 'Math', `"use strict"; return (${b.y});`); } catch {}
              try { evalZ = new Function('t', 'Math', `"use strict"; return (${b.z});`); } catch {}
              const labelNode = b.label ? container.querySelector(b.label) : null;
              
              const item = {
                type: '3d-node',
                target: b.target,
                domNode: node,
                labelNode,
                evalX, evalY, evalZ,
                baseR: b.baseR,
                depthFog: b.depthFog,
                meanZ: 0
              };
              this.active3DNodes.push(item);
              this.active3DItems.push(item);
            }
          } else if (b.type === '3d-line') {
            const line = container.querySelector(b.target);
            if (line) {
              let evalX1 = () => 0, evalY1 = () => 0, evalZ1 = () => 0;
              let evalX2 = () => 0, evalY2 = () => 0, evalZ2 = () => 0;
              try { evalX1 = new Function('t', 'Math', `"use strict"; return (${b.x1});`); } catch {}
              try { evalY1 = new Function('t', 'Math', `"use strict"; return (${b.y1});`); } catch {}
              try { evalZ1 = new Function('t', 'Math', `"use strict"; return (${b.z1});`); } catch {}
              try { evalX2 = new Function('t', 'Math', `"use strict"; return (${b.x2});`); } catch {}
              try { evalY2 = new Function('t', 'Math', `"use strict"; return (${b.y2});`); } catch {}
              try { evalZ2 = new Function('t', 'Math', `"use strict"; return (${b.z2});`); } catch {}
              const cap1 = b.cap1 ? container.querySelector(b.cap1) : null;
              const cap2 = b.cap2 ? container.querySelector(b.cap2) : null;

              const item = {
                type: '3d-line',
                target: b.target,
                domNode: line,
                cap1, cap2,
                baseR: b.baseR,
                evalX1, evalY1, evalZ1,
                evalX2, evalY2, evalZ2,
                meanZ: 0
              };
              this.active3DLines.push(item);
              this.active3DItems.push(item);
            }
          } else if (b.type === '3d-ring') {
            const ringNode = container.querySelector(b.target);
            if (ringNode) {
              let evalR = () => 100, evalCX = () => 0, evalCY = () => 0, evalCZ = () => 0;
              let evalTiltX = () => 0, evalTiltY = () => 0, evalTiltZ = () => 0;
              try { evalR = new Function('t', 'Math', `"use strict"; return (${b.r});`); } catch {}
              try { evalCX = new Function('t', 'Math', `"use strict"; return (${b.cx});`); } catch {}
              try { evalCY = new Function('t', 'Math', `"use strict"; return (${b.cy});`); } catch {}
              try { evalCZ = new Function('t', 'Math', `"use strict"; return (${b.cz});`); } catch {}
              try { evalTiltX = new Function('t', 'Math', `"use strict"; return (${b.tiltX});`); } catch {}
              try { evalTiltY = new Function('t', 'Math', `"use strict"; return (${b.tiltY});`); } catch {}
              try { evalTiltZ = new Function('t', 'Math', `"use strict"; return (${b.tiltZ});`); } catch {}

              const item = {
                type: '3d-ring',
                target: b.target,
                domNode: ringNode,
                evalR, evalCX, evalCY, evalCZ,
                evalTiltX, evalTiltY, evalTiltZ,
                segments: b.segments || 24,
                depthFog: b.depthFog,
                meanZ: 0
              };
              this.active3DRings.push(item);
              this.active3DItems.push(item);
            }
          } else if (b.type === '3d-polygon') {
            const polyNode = container.querySelector(b.target);
            if (polyNode) {
              let evalPts = () => [];
              try {
                evalPts = new Function('t', 'Math', `"use strict"; return (${b.pointsExpr});`);
              } catch {}

              const item = {
                type: '3d-polygon',
                target: b.target,
                domNode: polyNode,
                evalPts,
                depthFog: b.depthFog,
                cullBackface: b.cullBackface,
                meanZ: 0
              };
              this.active3DPolygons.push(item);
              this.active3DItems.push(item);
            }
          } else {
            // Standard 2D attribute binding
            const node = container.querySelector(b.target);
            if (node) {
              let evalFn = () => 0;
              try {
                evalFn = new Function('t', 'Math', `"use strict"; return (${b.expr});`);
              } catch (e) {
                console.warn('[AST Engine] Failed compiling expr:', b.expr, e);
              }
              this.activeBindings.push({
                target: b.target,
                attr: b.attr,
                node,
                evalFn
              });
            }
          }
        });
      }

      // Initialize zero-bloat micro-physics if defined on the scene
      if (scene.physics) {
        this.physics.clear();
        if (scene.physics.gravity !== undefined) this.physics.setGravity(scene.physics.gravity);
        if (scene.physics.friction !== undefined) this.physics.friction = scene.physics.friction;
        if (scene.physics.groundY !== undefined) this.physics.groundY = scene.physics.groundY;
        if (Array.isArray(scene.physics.bodies)) {
          scene.physics.bodies.forEach(b => this.physics.addBody(b));
        }
      }

      this.applyBindings(this.progress);
      } finally {
        this._isMounting = false;
      }
    }

    /**
     * Evaluates AST mathematical bindings directly on the DOM at 60 FPS
     * Includes 3D perspective projection, 3D rings, 3D polygons, and Painter's Algorithm Z-Sorting
     */
    applyBindings(t) {
      // Safety check: ensure container has scene elements mounted
      if (!this._isMounting && this._container && (this._mountedSceneId !== this.activePresetId || this._mountedContainer !== this._container)) {
        if (this.scene) {
          this.mountSceneAsset(this.scene, this._container);
        }
      }

      const camera = Object.assign({ distance: 500, pitch: 20, yaw: 0, fov: 60 }, (this.scene && this.scene.camera) || {});

      // Dynamic camera yaw if expression
      if (typeof camera.yaw === 'string') {
        try {
          const yawFn = new Function('t', 'Math', `"use strict"; return (${camera.yaw});`);
          camera.yaw = yawFn(t, Math);
        } catch {}
      }
      if (typeof camera.pitch === 'string') {
        try {
          const pitchFn = new Function('t', 'Math', `"use strict"; return (${camera.pitch});`);
          camera.pitch = pitchFn(t, Math);
        } catch {}
      }

      // Calculate combined camera orientation and distance scaling
      const yawBase = typeof camera.yaw === 'number' ? camera.yaw : 0;
      const pitchBase = typeof camera.pitch === 'number' ? camera.pitch : 0;
      const totalYaw = yawBase + (this.cameraOrbit ? this.cameraOrbit.yawOffset : 0);
      const totalPitch = Math.max(-85, Math.min(85, pitchBase + (this.cameraOrbit ? this.cameraOrbit.pitchOffset : 0)));
      const totalScale = Math.max(0.2, Math.min(4.0, (this.cameraOrbit ? this.cameraOrbit.distanceScale : 1.0)));

      // Apply hardware-accelerated 3D spatial transformation to the scene stage container
      if (this._container) {
        if (this.has3D() || (this.cameraOrbit && (this.cameraOrbit.yawOffset !== 0 || this.cameraOrbit.pitchOffset !== 0 || this.cameraOrbit.distanceScale !== 1.0))) {
          this._container.style.transformOrigin = '400px 240px';
          this._container.style.transformBox = 'view-box';
          this._container.style.transform = `perspective(800px) rotateX(${totalPitch.toFixed(1)}deg) rotateY(${totalYaw.toFixed(1)}deg) scale(${totalScale.toFixed(2)})`;
          this._container.style.transition = this.isOrbitDragging ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          this._container.style.transform = '';
          this._container.style.transition = '';
        }
      }

      // 1. Process 3D Items (Nodes, Lines, Rings, Polygons)
      if (this.active3DItems && this.active3DItems.length) {
        for (let i = 0; i < this.active3DItems.length; i++) {
          const item = this.active3DItems[i];

          if (item.type === '3d-node') {
            const wx = item.evalX(t, Math);
            const wy = item.evalY(t, Math);
            const wz = item.evalZ(t, Math);
            const proj = this.project3D(wx, wy, wz, camera, 400, 240);
            item.meanZ = proj.z;

            if (item.domNode) {
              item.domNode.setAttribute('cx', proj.x.toFixed(1));
              item.domNode.setAttribute('cy', proj.y.toFixed(1));
              if (item.baseR) {
                item.domNode.setAttribute('r', Math.max(1, item.baseR * proj.scale).toFixed(1));
              }
              if (item.depthFog) {
                item.domNode.setAttribute('opacity', proj.opacity.toFixed(2));
              }
            }

            if (item.labelNode) {
              item.labelNode.setAttribute('x', proj.x.toFixed(1));
              const r = item.baseR ? item.baseR * proj.scale : 8;
              item.labelNode.setAttribute('y', (proj.y + r + 14).toFixed(1));
              if (item.depthFog) {
                item.labelNode.setAttribute('opacity', proj.opacity.toFixed(2));
              }
            }
          } else if (item.type === '3d-line') {
            const x1 = item.evalX1(t, Math);
            const y1 = item.evalY1(t, Math);
            const z1 = item.evalZ1(t, Math);
            const x2 = item.evalX2(t, Math);
            const y2 = item.evalY2(t, Math);
            const z2 = item.evalZ2(t, Math);

            const p1 = this.project3D(x1, y1, z1, camera, 400, 240);
            const p2 = this.project3D(x2, y2, z2, camera, 400, 240);
            item.meanZ = (p1.z + p2.z) / 2;

            if (item.domNode) {
              item.domNode.setAttribute('x1', p1.x.toFixed(1));
              item.domNode.setAttribute('y1', p1.y.toFixed(1));
              item.domNode.setAttribute('x2', p2.x.toFixed(1));
              item.domNode.setAttribute('y2', p2.y.toFixed(1));
              item.domNode.setAttribute('opacity', ((p1.opacity + p2.opacity) / 2).toFixed(2));
            }
            if (item.cap1) {
              item.cap1.setAttribute('cx', p1.x.toFixed(1));
              item.cap1.setAttribute('cy', p1.y.toFixed(1));
              item.cap1.setAttribute('opacity', p1.opacity.toFixed(2));
              if (item.baseR) item.cap1.setAttribute('r', Math.max(1, item.baseR * p1.scale).toFixed(1));
            }
            if (item.cap2) {
              item.cap2.setAttribute('cx', p2.x.toFixed(1));
              item.cap2.setAttribute('cy', p2.y.toFixed(1));
              item.cap2.setAttribute('opacity', p2.opacity.toFixed(2));
              if (item.baseR) item.cap2.setAttribute('r', Math.max(1, item.baseR * p2.scale).toFixed(1));
            }
          } else if (item.type === '3d-ring') {
            const r = item.evalR(t, Math);
            const cx = item.evalCX(t, Math);
            const cy = item.evalCY(t, Math);
            const cz = item.evalCZ(t, Math);
            const tiltXDeg = item.evalTiltX(t, Math);
            const tiltYDeg = item.evalTiltY(t, Math);
            const tiltZDeg = item.evalTiltZ(t, Math);

            const rxRad = tiltXDeg * (Math.PI / 180);
            const ryRad = tiltYDeg * (Math.PI / 180);
            const rzRad = tiltZDeg * (Math.PI / 180);

            const n = item.segments;
            let pathD = '';
            let totalZ = 0;
            let totalOpacity = 0;

            for (let k = 0; k < n; k++) {
              const theta = (k / n) * Math.PI * 2;
              // Base circle in X-Z plane
              let px = r * Math.cos(theta);
              let py = 0;
              let pz = r * Math.sin(theta);

              // Apply local tilts
              if (tiltXDeg !== 0) {
                const py1 = py * Math.cos(rxRad) - pz * Math.sin(rxRad);
                const pz1 = py * Math.sin(rxRad) + pz * Math.cos(rxRad);
                py = py1; pz = pz1;
              }
              if (tiltYDeg !== 0) {
                const px1 = px * Math.cos(ryRad) + pz * Math.sin(ryRad);
                const pz1 = -px * Math.sin(ryRad) + pz * Math.cos(ryRad);
                px = px1; pz = pz1;
              }
              if (tiltZDeg !== 0) {
                const px1 = px * Math.cos(rzRad) - py * Math.sin(rzRad);
                const py1 = px * Math.sin(rzRad) + py * Math.cos(rzRad);
                px = px1; py = py1;
              }

              const proj = this.project3D(cx + px, cy + py, cz + pz, camera, 400, 240);
              totalZ += proj.z;
              totalOpacity += proj.opacity;

              if (k === 0) {
                pathD += `M ${proj.x.toFixed(1)} ${proj.y.toFixed(1)}`;
              } else {
                pathD += ` L ${proj.x.toFixed(1)} ${proj.y.toFixed(1)}`;
              }
            }
            pathD += ' Z';
            item.meanZ = totalZ / n;
            const avgOpacity = totalOpacity / n;

            if (item.domNode) {
              item.domNode.setAttribute('d', pathD);
              if (item.depthFog) {
                item.domNode.setAttribute('opacity', avgOpacity.toFixed(2));
              }
            }
          } else if (item.type === '3d-polygon') {
            const rawPts = item.evalPts(t, Math);
            if (Array.isArray(rawPts) && rawPts.length >= 3) {
              let pathD = '';
              let totalZ = 0;
              let totalOpacity = 0;

              for (let k = 0; k < rawPts.length; k++) {
                const pt = rawPts[k];
                const proj = this.project3D(pt[0], pt[1], pt[2], camera, 400, 240);
                totalZ += proj.z;
                totalOpacity += proj.opacity;
                if (k === 0) {
                  pathD += `M ${proj.x.toFixed(1)} ${proj.y.toFixed(1)}`;
                } else {
                  pathD += ` L ${proj.x.toFixed(1)} ${proj.y.toFixed(1)}`;
                }
              }
              pathD += ' Z';
              item.meanZ = totalZ / rawPts.length;

              if (item.domNode) {
                item.domNode.setAttribute('d', pathD);
                if (item.depthFog) {
                  item.domNode.setAttribute('opacity', (totalOpacity / rawPts.length).toFixed(2));
                }
              }
            }
          }
        }

        // Unified Painter's Algorithm: Sort furthest to closest in SVG DOM
        if (this.active3DItems.length > 1) {
          const sorted = [...this.active3DItems].sort((a, b) => b.meanZ - a.meanZ);
          sorted.forEach(item => {
            const cont = this._container;
            if (item.domNode && item.domNode.parentNode && cont && cont.contains(item.domNode)) {
              item.domNode.parentNode.appendChild(item.domNode);
            }
            if (item.labelNode && item.labelNode.parentNode && cont && cont.contains(item.labelNode)) {
              item.labelNode.parentNode.appendChild(item.labelNode);
            }
            if (item.cap1 && item.cap1.parentNode && cont && cont.contains(item.cap1)) {
              item.cap1.parentNode.appendChild(item.cap1);
            }
            if (item.cap2 && item.cap2.parentNode && cont && cont.contains(item.cap2)) {
              item.cap2.parentNode.appendChild(item.cap2);
            }
          });
        }
      }

      // 2. Direct 2D AST Math Bindings
      if (this.activeBindings && this.activeBindings.length) {
        for (let i = 0; i < this.activeBindings.length; i++) {
          const b = this.activeBindings[i];
          if (b.node) {
            const val = b.evalFn(t, Math);
            if (b.attr === 'textContent') {
              b.node.textContent = String(val);
            } else {
              b.node.setAttribute(b.attr, String(val));
            }
          }
        }
      }

      // 3. Procedural update hook if present
      if (this.scene && typeof this.scene.update === 'function' && this._cachedElements) {
        this.scene.update(t, this._cachedElements, this);
      }
    }

    /**
     * Direct Element Attribute Patching (Decoupled render)
     */
    renderCurrentVector(container) {
      const target = container || this.container;
      if (target) {
        if (!this._isMounting && (this._mountedSceneId !== this.activePresetId || this._mountedContainer !== target)) {
          if (this.scene) {
            this.mountSceneAsset(this.scene, target);
          }
        }
        this.applyBindings(this.progress);
        return '';
      }

      if (this.scene && typeof this.scene.render === 'function') {
        return this.scene.render(this.progress);
      }
      return '';
    }

    /**
     * Main Animation Tick Loop with Delta-Time Clamping
     */
    tick(currentTimestamp) {
      if (this.lastTimestamp !== null) {
        const rawDeltaSec = (currentTimestamp - this.lastTimestamp) / 1000.0;
        const deltaSec = Math.min(rawDeltaSec, 0.1);

        // Micro-Physics Subsystem Tick (< 1.5 KB zero-bloat)
        if (this.physics && this.physics.enabled && this.physics.bodies.length > 0) {
          this.physics.update(deltaSec);
        }

        if (this.isPlaying) {
          this.progress += (deltaSec / this.durationSec) * this.speed;

          if (this.progress >= 1.0) {
            if (this.loop) {
              this.progress = 0.0;
              this.lastSpokenIndex = -1;
            } else {
              this.progress = 1.0;
              this.pause();
              this.emit('ended', { duration: this.durationSec });
            }
          }

          this.updateActiveKeyframeAndSpeech(false);
          this.applyBindings(this.progress);

          this.emit('timeupdate', {
            progress: this.progress,
            currentTime: this.progress * this.durationSec,
            duration: this.durationSec
          });
        }
      }

      this.lastTimestamp = currentTimestamp;
      if (typeof requestAnimationFrame !== 'undefined') {
        this.animationFrameId = requestAnimationFrame(this.tick);
      }
    }

    /**
     * Hot-reloads raw SVG markup directly onto the stage container
     * Rebinds active AST expressions without losing clock state or timeline position
     */
/**
     * Hot-reloads raw SVG markup directly onto the stage container
     * Rebinds active AST expressions without losing clock state or timeline position
     */
    hotReloadSvg(svgMarkup) {
      if (!svgMarkup || typeof svgMarkup !== 'string') return false;
      try {
        if (!this.scene) {
          this.scene = { id: 'custom-scene', title: 'Custom SVG Scene', stage: 'DEVELOPER', duration: 10.0 };
        }
        this.scene.svgText = svgMarkup;

        if (this._container) {
          const safeSvg = this.sanitizeSvg(svgMarkup);

          if (safeSvg && typeof DOMParser !== 'undefined') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(safeSvg, 'image/svg+xml');
            const rootSvg = doc.querySelector('svg');
            if (rootSvg && !doc.querySelector('parsererror')) {
              this.sanitizeSvgElement(rootSvg);
              this._container.replaceChildren(...rootSvg.childNodes);
            }
          }

          // Recompile AST bindings to match newly mounted DOM nodes
          this.mountSceneAsset(this.scene, this._container);
          this.applyBindings(this.progress);
        }

        this.emit('svghotreloaded', { svg: svgMarkup, progress: this.progress });
        this.notifyParent({ type: 'DEV_HOT_RELOAD_SUCCESS', target: 'svg' });
        return true;
      } catch (err) {
        console.error('[AST Engine] Failed to hot-reload SVG:', err);
        return false;
      }
    }

    /**
     * Hot-reloads AST S-Expressions / keyframes / bindings in real-time
     * Recompiles mathematical expressions and applies them immediately
     */
    hotReloadAst(astInput) {
      if (!astInput) return false;
      try {
        let parsed = typeof astInput === 'string' ? this.parseAst(astInput) : astInput;
        if (!parsed) return false;

        if (!this.scene) this.scene = {};
        this.scene.id = parsed.id || this.scene.id || 'custom-ast';
        this.scene.title = parsed.title || this.scene.title || 'Custom AST Scene';
        this.scene.stage = parsed.stage || this.scene.stage || 'DEVELOPER';
        this.scene.duration = parsed.duration || this.scene.duration || 10.0;
        this.scene.keyframes = parsed.keyframes || [];
        this.scene.subtitles = parsed.subtitles || [];
        this.scene.rawBindings = parsed.bindings || parsed.rawBindings || [];
        if (parsed.interactive) {
          this.scene.interactive = parsed.interactive;
        } else if (parsed.checkpoints && parsed.checkpoints.length > 0) {
          this.scene.interactive = { checkpoints: parsed.checkpoints, hotspots: [] };
        }
        if (parsed.camera) this.scene.camera = parsed.camera;
        if (typeof parsed.has3D === 'boolean') this.scene.has3D = parsed.has3D;
        this.scene.astSource = typeof astInput === 'string' ? astInput : null;

        this.durationSec = this.scene.duration;

        if (this._container) {
          this.mountSceneAsset(this.scene, this._container);
          this.applyBindings(this.progress);
        }

        this.emit('asthotreloaded', { ast: parsed, progress: this.progress });
        this.notifyParent({ type: 'DEV_HOT_RELOAD_SUCCESS', target: 'ast' });
        return true;
      } catch (err) {
        console.error('[AST Engine] Failed to hot-reload AST:', err);
        return false;
      }
    }

    /**
     * Serializes clean SVG stage XML without transient developer overlay elements
     */
    getStageSvgSnapshot() {
      if (typeof document === 'undefined') return '';
      const svg = document.getElementById('stage-svg');
      if (!svg) return '';
      const clone = svg.cloneNode(true);
      const devOverlay = clone.querySelector('#dev-overlay-root');
      if (devOverlay) devOverlay.remove();
      return clone.outerHTML;
    }

    /**
     * Retrieves current AST source or formats current scene configuration
     */
    getCurrentAstSource() {
      if (this.scene && this.scene.astSource) return this.scene.astSource;
      if (!this.scene) return '';

      const s = this.scene;
      let ast = `(:scene :id "${s.id || 'custom'}" :title "${s.title || 'Parametric Scene'}" :stage "${s.stage || 'CURRICULUM'}" :duration ${(s.duration || 10.0).toFixed(1)}\n`;

      if (s.subtitles && s.subtitles.length) {
        ast += `  (:subtitles (\n`;
        s.subtitles.forEach(sub => {
          ast += `    (:start ${sub.start.toFixed(2)} :end ${sub.end.toFixed(2)} :en "${sub.en || ''}"${sub.es ? ` :es "${sub.es}"` : ''})\n`;
        });
        ast += `  ))\n`;
      }

      if (s.keyframes && s.keyframes.length) {
        ast += `  (:keyframes (\n`;
        s.keyframes.forEach(kf => {
          ast += `    (:t ${kf.t.toFixed(2)} :title "${kf.title}" :rule "${kf.rule}")\n`;
        });
        ast += `  ))\n`;
      }

      if (s.rawBindings && s.rawBindings.length) {
        ast += `  (:bindings (\n`;
        s.rawBindings.forEach(b => {
          if (b.type === '3d-node') {
            ast += `    (:3d-node :target "${b.target}" :x "${b.x}" :y "${b.y}" :z "${b.z}" :baseR ${b.baseR || 6})\n`;
          } else {
            ast += `    (:target "${b.target}" :attr "${b.attr}" :expr "${b.expr}")\n`;
          }
        });
        ast += `  ))\n`;
      }

      ast += `)\n`;
      return ast;
    }

    /**
     * Curriculum-aligned Socratic Checkpoints for interactive active recall
     */
    getDefaultCheckpoints(presetId) {
      const pid = (presetId || '').toLowerCase();
      if (pid.includes('frac')) {
        return [
          {
            t: 0.35,
            question: "Why does the laser slice 1/2 into two quarters (2/4) before adding?",
            options: [
              "To establish a common denominator so all pieces are equal size",
              "To make the total fraction twice as large as the original",
              "Because 1 + 2 = 3 in standard addition"
            ],
            answerKey: 0,
            hint: "Look at the slices: can you count parts that are different sizes?",
            explanation: "Fractions cannot be added until they share a common denominator representing identical part sizes."
          }
        ];
      }
      if (pid.includes('pythag')) {
        return [
          {
            t: 0.50,
            question: "In Pythagoras' theorem (a² + b² = c²), what does 'c' represent?",
            options: [
              "The hypotenuse (the longest side opposite the right angle)",
              "The shortest horizontal leg of the triangle",
              "The total geometric perimeter of the three squares"
            ],
            answerKey: 0,
            hint: "It is always the side facing the 90° right angle.",
            explanation: "c is the hypotenuse; its square equals the combined areas of the squares on the other two orthogonal sides."
          }
        ];
      }
      if (pid.includes('photo')) {
        return [
          {
            t: 0.40,
            question: "What is the primary role of chlorophyll during photosynthesis?",
            options: [
              "To absorb sunlight energy to drive the conversion of CO₂ and water into glucose",
              "To absorb nitrogen gas directly from atmospheric air",
              "To block sunlight to keep the leaf from drying out"
            ],
            answerKey: 0,
            hint: "Think of solar panels capturing photon energy.",
            explanation: "Chlorophyll pigments absorb light energy, powering the chemical synthesis of glucose and releasing oxygen."
          }
        ];
      }
      if (pid.includes('solar')) {
        return [
          {
            t: 0.35,
            question: "According to Kepler's orbital laws, which planet travels fastest in its orbit?",
            options: [
              "Mercury (closest to the Sun's gravitational field)",
              "Neptune (furthest from the central star)",
              "All planets orbit at exactly the same linear speed"
            ],
            answerKey: 0,
            hint: "Gravitational pull is strongest nearest to the massive central star.",
            explanation: "Inner planets orbit faster because gravity is strongest nearer the Sun, requiring higher velocities for orbital equilibrium."
          }
        ];
      }
      if (pid.includes('church') || pid.includes('sanctuary')) {
        return [
          {
            t: 0.50,
            question: "In Catholic basilica architecture, what is the golden Tabernacle reserved for?",
            options: [
              "The Real Presence of Christ in the consecrated Blessed Sacrament",
              "Archiving historic parish parchment documents",
              "A decorative candlestick holder"
            ],
            answerKey: 0,
            hint: "Think of Eucharistic adoration and the Sanctuary Lamp burning nearby.",
            explanation: "The Tabernacle is the sacred dwelling place reserved for the consecrated Eucharist (the Body of Christ) (CCC 1379)."
          }
        ];
      }
      if (pid.includes('atom')) {
        return [
          {
            t: 0.45,
            question: "What subatomic particles make up the central nucleus of an atom?",
            options: [
              "Protons and Neutrons bound by the strong nuclear force",
              "Electrons and Photons orbiting empty space",
              "Pure energy with no mass or electrical charge"
            ],
            answerKey: 0,
            hint: "Electrons orbit on the outside shells; the dense core is inside.",
            explanation: "The nucleus contains positively charged protons and neutral neutrons, surrounded by electron orbitals."
          }
        ];
      }
      // Generic fallback checkpoint
      return [
        {
          t: 0.50,
          question: `What primary invariant rule is demonstrated at this milestone in ${this.scene?.title || 'this lesson'}?`,
          options: [
            "The foundational principle defined by the active AST bindings",
            "An inverted contradictory outcome violating physical laws",
            "A static decorative effect with no mathematical relationship"
          ],
          answerKey: 0,
          hint: "Observe how the vector variables transform continuously across time.",
          explanation: "The continuous mathematical rules preserve structural, geometric, and physical invariants."
        }
      ];
    }

    /**
     * Compiles an Autonomous, Self-Contained Single Page Application (SPA) in a single .svg file
     * Contains vector visuals, embedded HUD controls, audio speech synthesis, and Socratic checkpoint quizzes.
     * Can be opened directly in any browser (file:///... or downloaded) with zero dependencies.
     */
    compileAutonomousSvgApplet() {
      if (typeof document === 'undefined') return '';
      const stage = document.getElementById('stage-svg');
      if (!stage) return '';

      const clone = stage.cloneNode(true);
      const devOverlay = clone.querySelector('#dev-overlay-root');
      if (devOverlay) devOverlay.remove();

      // Extract inner visual SVG elements
      const innerSvg = clone.innerHTML;
      const sceneId = this.scene?.id || this.activePresetId || 'scene';
      const sceneTitle = this.scene?.title || 'Interactive Vector Lesson';
      const sceneStage = this.scene?.stage || 'UK CURRICULUM';
      const duration = this.durationSec || 10.0;
      const subtitles = this.scene?.subtitles || [];
      const keyframes = this.scene?.keyframes || [];
      const rawBindings = this.scene?.rawBindings || [];
      const has3D = this.has3D();
      const camera = this.scene?.camera || { yaw: 0, pitch: 0, distance: 1.0 };
      const checkpoints = (this.scene && this.scene.checkpoints && this.scene.checkpoints.length)
        ? this.scene.checkpoints
        : this.getDefaultCheckpoints(sceneId);

      const manifestData = {
        id: sceneId,
        title: sceneTitle,
        stage: sceneStage,
        duration: duration,
        subtitles: subtitles,
        keyframes: keyframes,
        bindings: rawBindings,
        has3D: has3D,
        camera: camera,
        checkpoints: checkpoints
      };

      const manifestJson = JSON.stringify(manifestData).replace(/<\/script>/gi, '<\\/script>');

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 800 560" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <filter id="hud-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="hud-card-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.65" />
    </filter>
    <linearGradient id="hud-bg-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="hud-bar-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>

  <style>
    <![CDATA[
    * { box-sizing: border-box; }
    text { user-select: none; -webkit-user-select: none; }
    .hud-btn { cursor: pointer; transition: transform 0.15s ease, filter 0.15s ease; }
    .hud-btn:hover { filter: brightness(1.25); transform: translateY(-1px); }
    .hud-btn:active { transform: translateY(1px); }
    .quiz-btn { cursor: pointer; transition: filter 0.15s ease; }
    .quiz-btn:hover { filter: brightness(1.2); }
    ]]>
  </style>

  <!-- Canvas Background -->
  <rect width="800" height="560" fill="url(#hud-bg-grad)" />

  <!-- Top Title Bar -->
  <g id="hud-top-bar">
    <rect x="0" y="0" width="800" height="34" fill="#0b1120e6" stroke="#1e293b" stroke-width="1" />
    <text x="18" y="22" fill="#38bdf8" font-size="12" font-weight="800" font-family="system-ui, -apple-system, sans-serif">${sceneStage} • ${sceneTitle}</text>
    <text x="782" y="22" fill="#64748b" font-size="10" font-weight="700" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">⚡ AUTONOMOUS SVG SPA • ST JOSEPH'S</text>
  </g>

  <!-- Vector Scene Stage Viewport (480px height) -->
  <g id="scene-stage" transform="translate(0, 30)">
    ${innerSvg}
  </g>

  <!-- Synchronized Subtitle Overlay -->
  <g id="hud-subtitle-group" transform="translate(400, 470)">
    <rect id="sub-bg" x="-360" y="-18" width="720" height="36" rx="8" fill="#0f172af0" stroke="#38bdf850" stroke-width="1" />
    <text id="sub-text" x="0" y="5" fill="#f8fafc" font-size="13" font-weight="600" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">Loading lesson...</text>
  </g>

  <!-- Integrated Bottom HUD Control Bar -->
  <g id="hud-control-bar">
    <rect x="0" y="490" width="800" height="70" fill="url(#hud-bar-grad)" stroke="#1e293b" stroke-width="1.5" />
    
    <!-- Scrubber Progress Track -->
    <rect id="track-bg" x="20" y="500" width="760" height="6" rx="3" fill="#334155" cursor="pointer" />
    <rect id="track-fill" x="20" y="500" width="0" height="6" rx="3" fill="#38bdf8" pointer-events="none" />
    <circle id="track-thumb" cx="20" cy="503" r="6" fill="#ffffff" stroke="#0284c7" stroke-width="2" cursor="pointer" />

    <!-- Play/Pause Button -->
    <g id="btn-play" class="hud-btn" transform="translate(20, 516)">
      <rect width="76" height="30" rx="6" fill="#2563eb" />
      <text id="txt-play" x="38" y="20" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">▶ Play</text>
    </g>

    <!-- Reset Button -->
    <g id="btn-reset" class="hud-btn" transform="translate(104, 516)">
      <rect width="64" height="30" rx="6" fill="#334155" />
      <text x="32" y="20" fill="#e2e8f0" font-size="12" font-weight="600" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">↺ Reset</text>
    </g>

    <!-- Step Back & Forward -->
    <g id="btn-prev" class="hud-btn" transform="translate(176, 516)">
      <rect width="32" height="30" rx="6" fill="#1e293b" stroke="#475569" />
      <text x="16" y="20" fill="#cbd5e1" font-size="12" font-weight="700" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">◀</text>
    </g>
    <g id="btn-next" class="hud-btn" transform="translate(214, 516)">
      <rect width="32" height="30" rx="6" fill="#1e293b" stroke="#475569" />
      <text x="16" y="20" fill="#cbd5e1" font-size="12" font-weight="700" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">▶</text>
    </g>

    <!-- Time Readout -->
    <text id="txt-time" x="260" y="536" fill="#94a3b8" font-size="12" font-family="ui-monospace, monospace" font-weight="600">00:00 / 00:10</text>

    <!-- Speed Cycle Button -->
    <g id="btn-speed" class="hud-btn" transform="translate(370, 516)">
      <rect width="48" height="30" rx="6" fill="#1e293b" stroke="#475569" />
      <text id="txt-speed" x="24" y="20" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">1.0x</text>
    </g>

    <!-- Voice Narration Button (Web Speech) -->
    <g id="btn-voice" class="hud-btn" transform="translate(426, 516)">
      <rect id="bg-voice" width="86" height="30" rx="6" fill="#1e293b" stroke="#475569" />
      <text id="txt-voice" x="43" y="20" fill="#cbd5e1" font-size="11" font-weight="600" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">🎙️ Voice</text>
    </g>

    <!-- Socratic Quiz Trigger Button -->
    <g id="btn-quiz" class="hud-btn" transform="translate(520, 516)">
      <rect width="78" height="30" rx="6" fill="#047857" />
      <text x="39" y="20" fill="#ecfdf5" font-size="11" font-weight="700" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">🎯 Quiz</text>
    </g>

    <!-- Autonomous Status Indicator -->
    <circle cx="700" cy="531" r="4" fill="#22c55e" />
    <text x="710" y="535" fill="#22c55e" font-size="10" font-weight="700" font-family="system-ui, -apple-system, sans-serif">OFFLINE SPA</text>
  </g>

  <!-- Interactive Socratic Checkpoint Modal Card -->
  <g id="quiz-modal" style="display:none;" transform="translate(100, 70)">
    <rect width="600" height="360" rx="16" fill="#0f172af5" stroke="#38bdf8" stroke-width="2" filter="url(#hud-card-shadow)" />
    
    <!-- Modal Header -->
    <rect x="0" y="0" width="600" height="50" rx="16" fill="#1e293b" />
    <text x="24" y="32" fill="#38bdf8" font-size="16" font-weight="800" font-family="system-ui, -apple-system, sans-serif">🎯 Socratic Checkpoint</text>
    <text x="576" y="32" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">Formative Check</text>

    <!-- Question Prompt -->
    <text id="quiz-question-txt" x="24" y="85" fill="#f8fafc" font-size="13" font-weight="700" font-family="system-ui, -apple-system, sans-serif">Loading challenge...</text>

    <!-- Options A, B, C -->
    <g id="quiz-opt-0" class="quiz-btn" transform="translate(24, 110)">
      <rect width="552" height="42" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text id="quiz-opt-txt-0" x="16" y="26" fill="#e2e8f0" font-size="12" font-family="system-ui, -apple-system, sans-serif">Option A</text>
    </g>
    <g id="quiz-opt-1" class="quiz-btn" transform="translate(24, 160)">
      <rect width="552" height="42" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text id="quiz-opt-txt-1" x="16" y="26" fill="#e2e8f0" font-size="12" font-family="system-ui, -apple-system, sans-serif">Option B</text>
    </g>
    <g id="quiz-opt-2" class="quiz-btn" transform="translate(24, 210)">
      <rect width="552" height="42" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <text id="quiz-opt-txt-2" x="16" y="26" fill="#e2e8f0" font-size="12" font-family="system-ui, -apple-system, sans-serif">Option C</text>
    </g>

    <!-- Diagnostic Feedback Message -->
    <text id="quiz-feedback-txt" x="24" y="282" fill="#94a3b8" font-size="12" font-weight="600" font-family="system-ui, -apple-system, sans-serif">Select an option to evaluate your understanding.</text>

    <!-- Bottom Action Controls -->
    <g id="btn-quiz-resume" class="quiz-btn" style="display:none;" transform="translate(456, 305)">
      <rect width="120" height="34" rx="6" fill="#2563eb" />
      <text x="60" y="22" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">Resume ▶</text>
    </g>
    <g id="btn-quiz-dismiss" class="quiz-btn" transform="translate(24, 305)">
      <rect width="80" height="34" rx="6" fill="#334155" />
      <text x="40" y="22" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif">Close ✕</text>
    </g>
  </g>

  <!-- Autonomous Micro-Player Execution Engine -->
  <script type="text/javascript">
    <![CDATA[
    (function () {
      'use strict';
      const data = ${manifestJson};
      let isPlaying = false;
      let progress = 0.0;
      let speed = 1.0;
      let voiceEnabled = false;
      let lastTimestamp = null;
      let animId = null;
      let lastSpokenIndex = -1;
      const duration = data.duration || 10.0;

      // DOM references
      const elTrackBg = document.getElementById('track-bg');
      const elTrackFill = document.getElementById('track-fill');
      const elTrackThumb = document.getElementById('track-thumb');
      const elBtnPlay = document.getElementById('btn-play');
      const elTxtPlay = document.getElementById('txt-play');
      const elBtnReset = document.getElementById('btn-reset');
      const elBtnPrev = document.getElementById('btn-prev');
      const elBtnNext = document.getElementById('btn-next');
      const elTxtTime = document.getElementById('txt-time');
      const elBtnSpeed = document.getElementById('btn-speed');
      const elTxtSpeed = document.getElementById('txt-speed');
      const elBtnVoice = document.getElementById('btn-voice');
      const elTxtVoice = document.getElementById('txt-voice');
      const elBtnQuiz = document.getElementById('btn-quiz');
      const elSubText = document.getElementById('sub-text');

      const elQuizModal = document.getElementById('quiz-modal');
      const elQuizPrompt = document.getElementById('quiz-question-txt');
      const elQuizFeedback = document.getElementById('quiz-feedback-txt');
      const elBtnQuizResume = document.getElementById('btn-quiz-resume');
      const elBtnQuizDismiss = document.getElementById('btn-quiz-dismiss');

      let activeCheckpoint = null;
      const triggeredCheckpoints = {};

      // Compile continuous mathematical AST expressions
      const compiledBindings = (data.bindings || []).map(b => {
        if (!b.expr) return null;
        try {
          return {
            target: b.target,
            attr: b.attr,
            fn: new Function('t', 'Math', 'return (' + b.expr + ');')
          };
        } catch (e) {
          return null;
        }
      }).filter(Boolean);

      function applyBindings(t) {
        for (let i = 0; i < compiledBindings.length; i++) {
          const b = compiledBindings[i];
          const nodes = document.querySelectorAll(b.target);
          if (!nodes || !nodes.length) continue;
          try {
            const val = b.fn(t, Math);
            for (let j = 0; j < nodes.length; j++) {
              const n = nodes[j];
              if (b.attr === 'textContent') {
                n.textContent = String(val);
              } else if (b.attr === 'style' || b.attr.startsWith('style.')) {
                const prop = b.attr.replace(/^style\\./, '');
                n.style[prop] = val;
              } else {
                n.setAttribute(b.attr, String(val));
              }
            }
          } catch (err) {}
        }

        // Subtitles
        const curSec = t * duration;
        let foundSub = null;
        let subIdx = -1;
        if (data.subtitles) {
          for (let s = 0; s < data.subtitles.length; s++) {
            const sub = data.subtitles[s];
            if (t >= sub.start && t < sub.end) {
              foundSub = sub.en || sub.text;
              subIdx = s;
              break;
            }
          }
        }
        if (elSubText) elSubText.textContent = foundSub || (data.title + ' • Step ' + Math.ceil(t * 4));

        // On-Device Web Speech Synthesis
        if (voiceEnabled && 'speechSynthesis' in window && subIdx >= 0 && subIdx !== lastSpokenIndex && foundSub) {
          lastSpokenIndex = subIdx;
          try {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(foundSub);
            u.rate = 1.0;
            window.speechSynthesis.speak(u);
          } catch (e) {}
        }

        // Formative Socratic Checkpoint Trigger
        if (isPlaying && data.checkpoints && data.checkpoints.length) {
          for (let c = 0; c < data.checkpoints.length; c++) {
            const cp = data.checkpoints[c];
            if (Math.abs(t - cp.t) < 0.025 && !triggeredCheckpoints[c]) {
              triggeredCheckpoints[c] = true;
              showQuizCheckpoint(cp);
              pause();
              break;
            }
          }
        }

        // Scrubber HUD updates
        const trackWidth = 760;
        const fillW = Math.max(0, Math.min(trackWidth, t * trackWidth));
        if (elTrackFill) elTrackFill.setAttribute('width', fillW);
        if (elTrackThumb) elTrackThumb.setAttribute('cx', 20 + fillW);

        const sSec = Math.floor(curSec % 60).toString().padStart(2, '0');
        const sMin = Math.floor(curSec / 60).toString().padStart(2, '0');
        const tSec = Math.floor(duration % 60).toString().padStart(2, '0');
        const tMin = Math.floor(duration / 60).toString().padStart(2, '0');
        if (elTxtTime) elTxtTime.textContent = sMin + ':' + sSec + ' / ' + tMin + ':' + tSec;
      }

      function tick(ts) {
        if (!lastTimestamp) lastTimestamp = ts;
        const dt = Math.min(0.1, (ts - lastTimestamp) / 1000);
        lastTimestamp = ts;

        if (isPlaying) {
          progress += (dt * speed) / duration;
          if (progress >= 1.0) {
            progress = 1.0;
            pause();
          }
          applyBindings(progress);
        }
        if (isPlaying) {
          animId = requestAnimationFrame(tick);
        }
      }

      function play() {
        if (progress >= 1.0) progress = 0.0;
        isPlaying = true;
        lastTimestamp = null;
        if (elTxtPlay) elTxtPlay.textContent = '⏸ Pause';
        if (animId) cancelAnimationFrame(animId);
        animId = requestAnimationFrame(tick);
      }

      function pause() {
        isPlaying = false;
        lastTimestamp = null;
        if (elTxtPlay) elTxtPlay.textContent = '▶ Play';
        if (animId) cancelAnimationFrame(animId);
      }

      function seek(p) {
        progress = Math.max(0.0, Math.min(1.0, p));
        applyBindings(progress);
      }

      function showQuizCheckpoint(cp) {
        activeCheckpoint = cp;
        if (!elQuizModal) return;
        elQuizModal.style.display = 'block';
        if (elQuizPrompt) elQuizPrompt.textContent = cp.question;
        if (elQuizFeedback) {
          elQuizFeedback.textContent = '💡 ' + (cp.hint || 'Select an option to evaluate your understanding.');
          elQuizFeedback.setAttribute('fill', '#94a3b8');
        }
        if (elBtnQuizResume) elBtnQuizResume.style.display = 'none';

        (cp.options || []).forEach((opt, idx) => {
          const g = document.getElementById('quiz-opt-' + idx);
          const txt = document.getElementById('quiz-opt-txt-' + idx);
          if (g && txt) {
            g.style.display = 'block';
            txt.textContent = String.fromCharCode(65 + idx) + ') ' + opt;
            const rect = g.querySelector('rect');
            if (rect) {
              rect.setAttribute('fill', '#1e293b');
              rect.setAttribute('stroke', '#334155');
            }
            g.onclick = function () {
              const isCorrect = (idx === cp.answerKey);
              if (rect) {
                rect.setAttribute('fill', isCorrect ? '#064e3b' : '#7f1d1d');
                rect.setAttribute('stroke', isCorrect ? '#10b981' : '#ef4444');
              }
              if (elQuizFeedback) {
                elQuizFeedback.textContent = isCorrect
                  ? '✔ Correct! ' + (cp.explanation || 'Mastery confirmed.')
                  : '✘ Misconception: ' + (cp.explanation || 'Review core rule.');
                elQuizFeedback.setAttribute('fill', isCorrect ? '#34d399' : '#f87171');
              }
              if (elBtnQuizResume) elBtnQuizResume.style.display = 'block';
            };
          }
        });
      }

      // Event Listeners
      if (elBtnPlay) elBtnPlay.onclick = function () { isPlaying ? pause() : play(); };
      if (elBtnReset) elBtnReset.onclick = function () {
        pause();
        for (let k in triggeredCheckpoints) delete triggeredCheckpoints[k];
        seek(0.0);
      };
      if (elBtnPrev) elBtnPrev.onclick = function () { seek(progress - 0.1); };
      if (elBtnNext) elBtnNext.onclick = function () { seek(progress + 0.1); };
      if (elBtnSpeed) elBtnSpeed.onclick = function () {
        const speeds = [0.5, 1.0, 1.5, 2.0];
        const curIdx = speeds.indexOf(speed);
        speed = speeds[(curIdx + 1) % speeds.length];
        if (elTxtSpeed) elTxtSpeed.textContent = speed.toFixed(1) + 'x';
      };
      if (elBtnVoice) elBtnVoice.onclick = function () {
        voiceEnabled = !voiceEnabled;
        const bg = document.getElementById('bg-voice');
        if (bg) bg.setAttribute('fill', voiceEnabled ? '#0284c7' : '#1e293b');
        if (elTxtVoice) elTxtVoice.textContent = voiceEnabled ? '🔊 Voice ON' : '🎙️ Voice';
      };
      if (elBtnQuiz) elBtnQuiz.onclick = function () {
        const cp = (data.checkpoints && data.checkpoints[0]) || {
          question: "What core rule governs this concept?",
          options: ["The primary invariant definition", "Reversed condition", "Unrelated property"],
          answerKey: 0,
          explanation: "Observe the vector coordinates and mathematical bindings."
        };
        pause();
        showQuizCheckpoint(cp);
      };
      if (elBtnQuizResume) elBtnQuizResume.onclick = function () {
        if (elQuizModal) elQuizModal.style.display = 'none';
        play();
      };
      if (elBtnQuizDismiss) elBtnQuizDismiss.onclick = function () {
        if (elQuizModal) elQuizModal.style.display = 'none';
      };

      if (elTrackBg) {
        elTrackBg.onclick = function (e) {
          const rect = elTrackBg.getBoundingClientRect();
          const p = (e.clientX - rect.left) / rect.width;
          seek(p);
        };
      }

      // Keyboard Controls
      window.addEventListener('keydown', function (e) {
        if (e.code === 'Space') { e.preventDefault(); isPlaying ? pause() : play(); }
        else if (e.code === 'ArrowLeft') { e.preventDefault(); seek(progress - 0.05); }
        else if (e.code === 'ArrowRight') { e.preventDefault(); seek(progress + 0.05); }
      });

      // Initial Frame
      applyBindings(0.0);
    })();
    ]]>
  </script>
</svg>`;
    }
  }

  // Setup postMessage Gateway with Origin Validation
  function setupPostMessageBridge(engine, uiController) {
    if (typeof window === 'undefined') return;

    window.addEventListener('message', (event) => {
      const expectedOrigin = engine.targetOrigin;
      if (expectedOrigin && expectedOrigin !== '*' && event.origin !== expectedOrigin) {
        if (window.location.origin && window.location.origin !== 'null' && event.origin !== window.location.origin) {
          console.warn('[AST-Player] Rejected unauthorized cross-origin message from:', event.origin);
          return;
        }
      }

      const data = event.data;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'SEEK':
          if (typeof data.progress === 'number') engine.seek(data.progress);
          break;
        case 'PLAY':
          engine.play();
          break;
        case 'PAUSE':
          engine.pause();
          break;
        case 'TOGGLE_PLAY':
          engine.togglePlay();
          break;
        case 'SET_LOOP':
          if (typeof data.loop === 'boolean') engine.setLoop(data.loop);
          break;
        case 'TOGGLE_LOOP':
          engine.toggleLoop();
          break;
        case 'SET_VOLUME':
          if (typeof data.volume === 'number') engine.setVolume(data.volume);
          break;
        case 'SET_MUTED':
          if (typeof data.muted === 'boolean') engine.setMuted(data.muted);
          break;
        case 'TOGGLE_MUTE':
          engine.toggleMute();
          break;
        case 'SET_GRAVITY':
          if (typeof data.gravity === 'number' && engine.physics) engine.physics.setGravity(data.gravity);
          break;
        case 'SET_RESTITUTION':
          if (typeof data.bounce === 'number' && engine.physics) engine.physics.setRestitution(data.bounce);
          break;
        case 'SET_FRICTION':
          if (typeof data.friction === 'number' && engine.physics) engine.physics.setFriction(data.friction);
          break;
        case 'RESET_PHYSICS':
          if (engine.physics) engine.physics.reset();
          break;
        case 'PHYSICS_IMPULSE':
          if (engine.physics) engine.physics.applyImpulse(data.target || data.id, data.fx || 0, data.fy || -400);
          break;
        case 'PHYSICS_JUMP':
          if (engine.physics) engine.physics.jump(data.target || data.id, data.jumpVelocity || -480);
          break;
        case 'SET_SPEED':
          if (data.speed) engine.setSpeed(data.speed);
          break;
        case 'SET_LANG':
          if (data.lang) engine.setLanguage(data.lang);
          break;
        case 'SET_PRESET':
          if (data.preset) {
            engine.loadScene(data.preset, data.play !== false);
          }
          break;
        case 'SET_THEME':
          if (data.theme && uiController && uiController.setTheme) {
            uiController.setTheme(data.theme);
          }
          break;
        case 'ROTATE_3D':
          if (typeof data.deltaYaw === 'number' || typeof data.deltaPitch === 'number') {
            engine.rotateCamera(data.deltaYaw || 0, data.deltaPitch || 0);
          }
          break;
        case 'ZOOM_3D':
          if (typeof data.deltaZoom === 'number') {
            engine.zoomCamera(data.deltaZoom);
          }
          break;
        case 'SET_CAMERA':
          if (typeof data.yaw === 'number') engine.cameraOrbit.yawOffset = data.yaw;
          if (typeof data.pitch === 'number') engine.cameraOrbit.pitchOffset = data.pitch;
          if (typeof data.distanceScale === 'number') engine.cameraOrbit.distanceScale = data.distanceScale;
          engine.applyBindings(engine.progress);
          engine.emit('camerachange', { ...engine.cameraOrbit });
          break;
        case 'RESET_3D':
          engine.resetCamera();
          break;
        case 'VOICE_COMMAND':
        case 'EXECUTE_VOICE_COMMAND':
          if (uiController && typeof uiController.handleVoiceCommand === 'function') {
            uiController.handleVoiceCommand(data.command || data.transcript);
          }
          break;
        case 'TOGGLE_VOICE_COMMANDS':
          if (uiController && typeof uiController.toggleVoiceCommands === 'function') {
            uiController.toggleVoiceCommands();
          }
          break;
        case 'START_VOICE_COMMANDS':
          if (uiController && typeof uiController.startVoiceCommands === 'function') {
            uiController.startVoiceCommands();
          }
          break;
        case 'STOP_VOICE_COMMANDS':
          if (uiController && typeof uiController.stopVoiceCommands === 'function') {
            uiController.stopVoiceCommands();
          }
          break;
        case 'REQUEST_PRINT':
          window.print();
          break;
        case 'LOAD_AST':
          if (data.ast) {
            const parsed = engine.parseAst(data.ast);
            if (parsed && parsed.id) {
              if (global.ASTSceneRegistry) global.ASTSceneRegistry.register(parsed.id, parsed);
              engine.loadScene(parsed.id);
            }
          }
          break;
        case 'HOT_RELOAD_SVG':
          if (data.svg) {
            engine.hotReloadSvg(data.svg);
            if (uiController && uiController.showToast) {
              uiController.showToast('⚡ SVG Stage Hot-Reloaded');
            }
          }
          break;
        case 'HOT_RELOAD_AST':
          if (data.ast) {
            engine.hotReloadAst(data.ast);
            if (uiController && uiController.showToast) {
              uiController.showToast('⚡ AST Expressions Hot-Reloaded');
            }
          }
          break;
        case 'SET_DEV_MODE':
          if (uiController && typeof uiController.setDevMode === 'function') {
            uiController.setDevMode(Boolean(data.enabled));
          }
          break;
        case 'OPEN_DEV_STUDIO':
          if (uiController && typeof uiController.openDevStudio === 'function') {
            uiController.openDevStudio(data.tab || 'svg');
          }
          break;
        case 'UPDATE_ELEMENT_ATTR':
          if (data.selector && data.attr && engine.container) {
            const node = engine.container.querySelector(data.selector);
            if (node) {
              if (data.attr === 'style' || data.attr.startsWith('style.')) {
                const prop = data.attr.replace(/^style\./, '');
                node.style[prop] = data.value;
              } else if (data.attr === 'textContent') {
                node.textContent = data.value;
              } else {
                node.setAttribute(data.attr, data.value);
              }
            }
          }
          break;
        case 'GET_STAGE_SVG':
          engine.notifyParent({
            type: 'STAGE_SVG_SNAPSHOT',
            svg: engine.getStageSvgSnapshot(),
            ast: engine.getCurrentAstSource(),
            preset: engine.activePresetId
          });
          break;
        case 'GET_AST_SOURCE':
          engine.notifyParent({
            type: 'AST_SOURCE_SNAPSHOT',
            ast: engine.getCurrentAstSource(),
            preset: engine.activePresetId
          });
          break;
        case 'EXPORT_STANDALONE_APPLET':
        case 'GET_STANDALONE_SVG': {
          const appletSvg = engine.compileAutonomousSvgApplet();
          const filename = `${engine.activePresetId || 'scene'}-standalone-applet.svg`;
          engine.notifyParent({
            type: 'STANDALONE_APPLET_COMPILED',
            svg: appletSvg,
            filename: filename,
            preset: engine.activePresetId
          });
          if (uiController && typeof uiController.showToast === 'function') {
            uiController.showToast('🚀 Standalone SVG SPA Compiled');
          }
          break;
        }
        case 'PING':
          engine.notifyParent({
            type: 'PONG',
            ready: true,
            version: ASTVectorPlayerEngine.VERSION,
            license: ASTVectorPlayerEngine.LICENSE,
            has3D: engine.has3D()
          });
          break;
        case 'TOGGLE_OBS_DRAWER':
          if (uiController && typeof uiController.toggleObsDrawer === 'function') {
            uiController.toggleObsDrawer();
          }
          break;
        case 'CONNECT_OBS':
          if (uiController && uiController.obs) {
            uiController.obs.connect(data.url, data.password);
          }
          break;
        case 'DISCONNECT_OBS':
          if (uiController && uiController.obs) {
            uiController.obs.disconnect();
          }
          break;
        case 'SET_OBS_RECORDING':
          if (uiController && uiController.obs) {
            data.record ? uiController.obs.startRecord() : uiController.obs.stopRecord();
          }
          break;
        case 'SET_DISPLAY_CONFIG':
          if (data.config && uiController && typeof uiController.applyDisplayConfig === 'function') {
            uiController.applyDisplayConfig(data.config);
          }
          break;
        case 'TOGGLE_SETTINGS_DRAWER':
          if (uiController && typeof uiController.toggleSettingsDrawer === 'function') {
            uiController.toggleSettingsDrawer();
          }
          break;
        case 'TOGGLE_PIP':
          if (uiController && typeof uiController.togglePictureInPicture === 'function') {
            uiController.togglePictureInPicture();
          }
          break;
        case 'PHYSICS_INIT':
          if (engine.physics && data.config) {
            engine.physics.clear();
            if (data.config.gravity !== undefined) engine.physics.setGravity(data.config.gravity);
            if (data.config.groundY !== undefined) engine.physics.groundY = data.config.groundY;
            if (data.config.friction !== undefined) engine.physics.friction = data.config.friction;
            if (Array.isArray(data.config.bodies)) {
              data.config.bodies.forEach(b => engine.physics.addBody(b));
            }
          }
          break;
        case 'PHYSICS_IMPULSE':
          if (engine.physics) {
            engine.physics.applyImpulse(data.target || data.id, data.fx, data.fy);
          }
          break;
        case 'PHYSICS_JUMP':
          if (engine.physics) {
            engine.physics.jump(data.target || data.id, data.vy || -480);
          }
          break;
        case 'SET_GRAVITY':
          if (engine.physics) {
            engine.physics.setGravity(data.gravity);
          }
          break;
        case 'PHYSICS_RESET':
          if (engine.physics) {
            engine.physics.reset();
          }
          break;
        case 'PHYSICS_CLEAR':
          if (engine.physics) {
            engine.physics.clear();
          }
          break;
      }
    });

    // Notify ready
    engine.notifyParent({
      type: 'PLAYER_READY',
      version: ASTVectorPlayerEngine.VERSION,
      license: ASTVectorPlayerEngine.LICENSE,
      has3D: engine.has3D(),
      hasInteractive: Boolean(engine.scene && engine.scene.interactive && engine.scene.interactive.checkpoints && engine.scene.interactive.checkpoints.length),
      preset: engine.activePresetId,
      presets: global.ASTSceneRegistry ? global.ASTSceneRegistry.list() : []
    });
  }

  global.VectorMicroPhysics = VectorMicroPhysics;
  global.ASTVectorPlayerEngine = ASTVectorPlayerEngine;
  global.setupPostMessageBridge = setupPostMessageBridge;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VectorMicroPhysics, ASTVectorPlayerEngine, setupPostMessageBridge };
  }
})(typeof window !== 'undefined' ? window : globalThis);
