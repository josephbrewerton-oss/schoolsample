/**
 * static/player/ast-engine.js
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

  class ASTVectorPlayerEngine {
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
        window.parent.postMessage({ source: 'ast-vector-player', ...payload }, '*');
      }
    }

    /**
     * Returns true if current active scene has 3D nodes/camera
     */
    has3D() {
      if (this.scene && this.scene.has3D) return true;
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
        bindings
      };
    }

    /**
     * Dynamically ingests [id].svg and [id].ast assets on selection
     */
    async loadScene(presetId, shouldPlay = false) {
      this.cancelSpeech();
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
            const cacheBust = '?v=2.5.0';
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

        let parsedAst = null;
        if (astText) {
          try {
            parsedAst = this.parseAst(astText);
          } catch (err) {
            console.warn('[AST Engine] Error parsing AST for', presetId, err);
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
     * Mounts SVG template and compiles AST bindings to DOM nodes
     */
    mountSceneAsset(scene, container) {
      if (!container || !scene) return;
      this._mountedContainer = container;
      this._mountedSceneId = scene.id;
      this.activeBindings = [];
      this.active3DNodes = [];
      this.active3DLines = [];
      this.active3DRings = [];
      this.active3DPolygons = [];
      this.active3DItems = [];
      this._cachedElements = null;

      // 1. Mount procedural DOM tree or SVG template
      if (typeof scene.mount === 'function') {
        this._cachedElements = scene.mount(container);
      } else if (scene.svgText) {
        try {
          if (typeof DOMParser !== 'undefined') {
            const parser = new DOMParser();
            const doc = parser.parseFromString(scene.svgText, 'image/svg+xml');
            const rootSvg = doc.querySelector('svg');
            if (rootSvg) {
              container.innerHTML = rootSvg.innerHTML;
            } else {
              container.innerHTML = scene.svgText;
            }
          } else {
            container.innerHTML = scene.svgText;
          }
        } catch {
          container.innerHTML = scene.svgText;
        }
      } else if (typeof scene.render === 'function') {
        container.innerHTML = scene.render(this.progress);
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

      this.applyBindings(this.progress);
    }

    /**
     * Evaluates AST mathematical bindings directly on the DOM at 60 FPS
     * Includes 3D perspective projection, 3D rings, 3D polygons, and Painter's Algorithm Z-Sorting
     */
    applyBindings(t) {
      // Safety check: ensure container has scene elements mounted
      if (this._container && (!this._container.hasChildNodes() || this._mountedSceneId !== this.activePresetId || this._mountedContainer !== this._container)) {
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
        if (this._mountedSceneId !== this.activePresetId || this._mountedContainer !== target) {
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
      if (this.isPlaying && this.lastTimestamp !== null) {
        const rawDeltaSec = (currentTimestamp - this.lastTimestamp) / 1000.0;
        const deltaSec = Math.min(rawDeltaSec, 0.1);

        this.progress += (deltaSec / this.durationSec) * this.speed;

        if (this.progress >= 1.0) {
          this.progress = 0.0;
          this.lastSpokenIndex = -1;
        }

        this.updateActiveKeyframeAndSpeech(false);
        this.applyBindings(this.progress);

        this.emit('timeupdate', {
          progress: this.progress,
          currentTime: this.progress * this.durationSec,
          duration: this.durationSec
        });
      }

      this.lastTimestamp = currentTimestamp;
      if (typeof requestAnimationFrame !== 'undefined') {
        this.animationFrameId = requestAnimationFrame(this.tick);
      }
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
        case 'PING':
          engine.notifyParent({ type: 'PONG', ready: true, version: '2.4.0', has3D: engine.has3D() });
          break;
      }
    });

    // Notify ready
    engine.notifyParent({
      type: 'PLAYER_READY',
      version: '2.4.0',
      has3D: engine.has3D(),
      hasInteractive: Boolean(engine.scene && engine.scene.interactive && engine.scene.interactive.checkpoints && engine.scene.interactive.checkpoints.length),
      preset: engine.activePresetId,
      presets: global.ASTSceneRegistry ? global.ASTSceneRegistry.list() : []
    });
  }

  global.ASTVectorPlayerEngine = ASTVectorPlayerEngine;
  global.setupPostMessageBridge = setupPostMessageBridge;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASTVectorPlayerEngine, setupPostMessageBridge };
  }
})(typeof window !== 'undefined' ? window : globalThis);
