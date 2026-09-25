/**
 * static/player/ast-engine.js
 * 
 * Core AST Vector Media Player Engine
 * Manages timeline, parametric keyframe interpolation, on-device Web Speech,
 * and bi-directional postMessage communication protocol.
 */

(function (global) {
  'use strict';

  class ASTVectorPlayerEngine {
    constructor(options = {}) {
      this.options = Object.assign({
        preset: 'fractions',
        lang: 'en',
        speed: 1.0,
        autoplay: false,
        theme: 'dark',
        voiceEnabled: false,
      }, options);

      this.activePresetId = this.options.preset;
      this.currentLang = this.options.lang;
      this.speed = this.options.speed;
      this.isPlaying = this.options.autoplay;
      this.progress = 0.0; // 0.000 to 1.000
      this.voiceEnabled = this.options.voiceEnabled;
      this.lastSpokenIndex = -1;
      this.lastTimestamp = null;
      this.animationFrameId = null;

      // Event listeners
      this.listeners = {
        timeupdate: [],
        keyframe: [],
        statechange: [],
        presetchange: [],
        langchange: [],
      };

      // Load initial scene
      this.scene = this.getScene(this.activePresetId);
      this.durationSec = this.scene.duration || 10.0;

      // Bind methods
      this.tick = this.tick.bind(this);
    }

    getScene(presetId) {
      if (global.ASTSceneRegistry) {
        return global.ASTSceneRegistry.get(presetId);
      }
      if (global.ASTScenes && global.ASTScenes[presetId]) {
        return global.ASTScenes[presetId];
      }
      return {
        stage: 'CURRICULUM',
        title: 'Parametric Scene',
        duration: 10.0,
        keyframes: [],
        subtitles: [],
        render: () => '<text x="400" y="240" fill="#fff" text-anchor="middle">Scene Not Found</text>'
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

    notifyParent(payload) {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        window.parent.postMessage({ source: 'ast-vector-player', ...payload }, '*');
      }
    }

    start() {
      if (!this.animationFrameId) {
        this.lastTimestamp = performance.now();
        this.animationFrameId = requestAnimationFrame(this.tick);
      }
      if (this.isPlaying) {
        this.emit('statechange', { isPlaying: true, speed: this.speed });
      }
    }

    stop() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      this.lastTimestamp = null;
    }

    play() {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.lastTimestamp = performance.now();
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
      this.emit('langchange', { lang: this.currentLang });
    }

    setPreset(presetId) {
      this.activePresetId = presetId;
      this.scene = this.getScene(presetId);
      this.durationSec = this.scene.duration || 10.0;
      this.progress = 0.0;
      this.lastSpokenIndex = -1;
      this.emit('presetchange', {
        preset: this.activePresetId,
        title: this.scene.title,
        stage: this.scene.stage,
        duration: this.durationSec,
        keyframes: this.scene.keyframes || []
      });
      this.seek(0);
    }

    toggleVoice() {
      this.voiceEnabled = !this.voiceEnabled;
      if (!this.voiceEnabled && typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return this.voiceEnabled;
    }

    speakText(text) {
      if (typeof window === 'undefined' || !window.speechSynthesis || !this.voiceEnabled || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = this.currentLang === 'es' ? 'es-ES' : this.currentLang === 'fr' ? 'fr-FR' : 'en-GB';
      window.speechSynthesis.speak(utterance);
    }

    getCurrentSubtitle() {
      if (!this.scene.subtitles || !this.scene.subtitles.length) return '';
      const sub = this.scene.subtitles.find(s => this.progress >= s.start && this.progress <= s.end);
      if (!sub) return '';
      return sub[this.currentLang] || sub.en || '';
    }

    updateActiveKeyframeAndSpeech(userSeeking = false) {
      if (!this.scene.keyframes || !this.scene.keyframes.length) return;

      // Find active keyframe
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

    renderCurrentVector() {
      if (typeof this.scene.render === 'function') {
        return this.scene.render(this.progress);
      }
      return '';
    }

    tick(currentTimestamp) {
      if (this.isPlaying && this.lastTimestamp !== null) {
        const deltaSec = (currentTimestamp - this.lastTimestamp) / 1000.0;
        this.progress += (deltaSec / this.durationSec) * this.speed;

        if (this.progress >= 1.0) {
          this.progress = 0.0;
          this.lastSpokenIndex = -1;
        }

        this.updateActiveKeyframeAndSpeech(false);
        this.emit('timeupdate', {
          progress: this.progress,
          currentTime: this.progress * this.durationSec,
          duration: this.durationSec
        });
      }

      this.lastTimestamp = currentTimestamp;
      this.animationFrameId = requestAnimationFrame(this.tick);
    }
  }

  // Setup postMessage Gateway
  function setupPostMessageBridge(engine, uiController) {
    if (typeof window === 'undefined') return;

    window.addEventListener('message', (event) => {
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
          if (data.preset) engine.setPreset(data.preset);
          break;
        case 'SET_THEME':
          if (data.theme && uiController && uiController.setTheme) {
            uiController.setTheme(data.theme);
          }
          break;
        case 'REQUEST_PRINT':
          window.print();
          break;
        case 'LOAD_AST':
          if (data.ast && global.ASTSceneRegistry) {
            const parsed = global.ASTSceneRegistry.parseAstScene(data.ast);
            if (parsed && parsed.id) {
              global.ASTSceneRegistry.register(parsed.id, parsed);
              engine.setPreset(parsed.id);
            }
          }
          break;
        case 'PING':
          engine.notifyParent({ type: 'PONG', ready: true, version: '2.1.0' });
          break;
      }
    });

    // Notify ready
    engine.notifyParent({
      type: 'PLAYER_READY',
      version: '2.1.0',
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
