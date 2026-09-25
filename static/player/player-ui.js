/**
 * static/player/player-ui.js
 * 
 * AST Vector Media Player UI Controller
 * Binds DOM elements, timeline scrubbing, responsive touch events, keyboard shortcuts,
 * and SVG export / print rendering.
 */

(function (global) {
  'use strict';

  class ASTPlayerUI {
    constructor(engine, elements = {}) {
      this.engine = engine;
      this.elements = Object.assign({
        stageSvg: document.getElementById('stage-svg'),
        sceneRoot: document.getElementById('scene-root'),
        subtitleOverlay: document.getElementById('subtitle-overlay'),
        timelineFill: document.getElementById('timeline-fill'),
        timelineThumb: document.getElementById('timeline-thumb'),
        timelineTrack: document.getElementById('timeline-track'),
        scrubberBox: document.getElementById('scrubber-box'),
        timeReadout: document.getElementById('time-readout'),
        btnPlay: document.getElementById('btn-play'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        btnReset: document.getElementById('btn-reset'),
        btnNarrate: document.getElementById('btn-narrate'),
        btnTheme: document.getElementById('btn-theme'),
        btnFullscreen: document.getElementById('btn-fullscreen'),
        btnPrint: document.getElementById('btn-print'),
        btnCopySvg: document.getElementById('btn-copy-svg'),
        btnInteractive: document.getElementById('btn-interactive'),
        interactiveCard: document.getElementById('interactive-card'),
        interactiveBody: document.getElementById('interactive-body'),
        interactiveBadge: document.getElementById('interactive-badge'),
        interactiveClose: document.getElementById('interactive-close'),
        astToast: document.getElementById('ast-toast'),
        presetSelector: document.getElementById('preset-selector'),
        speedSelector: document.getElementById('speed-selector'),
        langSelector: document.getElementById('lang-selector'),
        badgeStage: document.getElementById('badge-stage'),
      }, elements);

      this.isDragging = false;
      this.theme = document.body.getAttribute('data-theme') || 'dark';
      this.interactiveMode = true;
      this.completedCheckpoints = new Set();
      this.activeCheckpoint = null;
      this.toastTimeout = null;

      this.init();
    }

    playChime(freq = 523.25, type = 'sine') {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.36);
      } catch (_) {}
    }

    showToast(message) {
      if (!this.elements.astToast) return;
      this.elements.astToast.textContent = message;
      this.elements.astToast.classList.add('show');
      if (this.toastTimeout) clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        if (this.elements.astToast) this.elements.astToast.classList.remove('show');
      }, 2200);
    }

    closeInteractiveCard() {
      if (this.elements.interactiveCard) {
        this.elements.interactiveCard.classList.add('hidden');
      }
      this.activeCheckpoint = null;
    }

    triggerCheckpoint(checkpoint, index) {
      if (!this.elements.interactiveCard || !this.elements.interactiveBody) return;
      this.activeCheckpoint = index;
      this.engine.pause();

      if (this.elements.interactiveBadge) {
        this.elements.interactiveBadge.textContent = checkpoint.title || 'CHECKPOINT CHALLENGE';
      }

      const bodyHtml = `
        <div class="interactive-prompt">${checkpoint.prompt}</div>
        <div class="interactive-options">
          ${checkpoint.options.map((opt, i) => `
            <button type="button" class="interactive-opt-btn" data-opt-idx="${i}">
              ${String.fromCharCode(65 + i)}. ${opt}
            </button>
          `).join('')}
        </div>
        <div id="interactive-result" class="interactive-feedback" style="display: none;"></div>
      `;

      this.elements.interactiveBody.innerHTML = bodyHtml;
      this.elements.interactiveCard.classList.remove('hidden');

      const optBtns = this.elements.interactiveBody.querySelectorAll('.interactive-opt-btn');
      const resultBox = this.elements.interactiveBody.querySelector('#interactive-result');

      optBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const chosenIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
          const isCorrect = chosenIdx === checkpoint.answer;

          optBtns.forEach(b => { b.disabled = true; });

          if (isCorrect) {
            btn.classList.add('correct');
            this.playChime(784, 'triangle'); // G5 happy chime
            this.completedCheckpoints.add(index);
            if (resultBox) {
              resultBox.style.display = 'block';
              resultBox.style.color = '#34d399';
              resultBox.innerHTML = `<strong>✓ Correct!</strong> ${checkpoint.explanation || ''}`;
            }
            if (this.engine.voiceEnabled) {
              this.engine.speak(`Correct! ${checkpoint.explanation || ''}`);
            }
            // Resume after 2 seconds
            setTimeout(() => {
              this.closeInteractiveCard();
              this.engine.play();
            }, 2200);
          } else {
            btn.classList.add('incorrect');
            const correctBtn = this.elements.interactiveBody.querySelector(`[data-opt-idx="${checkpoint.answer}"]`);
            if (correctBtn) correctBtn.classList.add('correct');
            this.playChime(220, 'sawtooth'); // Error buzz
            if (resultBox) {
              resultBox.style.display = 'block';
              resultBox.style.color = '#f87171';
              resultBox.innerHTML = `<strong>Hint:</strong> ${checkpoint.explanation || 'Try reviewing the previous station!'}`;
            }
            if (this.engine.voiceEnabled) {
              this.engine.speak(`Remember: ${checkpoint.explanation || ''}`);
            }
            // Allow retry or resume after 3 seconds
            setTimeout(() => {
              this.closeInteractiveCard();
              this.engine.play();
            }, 3200);
          }
        });
      });
    }

    checkInteractiveCheckpoints() {
      if (!this.interactiveMode || this.activeCheckpoint !== null) return;
      const scene = this.engine.scene;
      if (!scene || !scene.interactive || !Array.isArray(scene.interactive.checkpoints)) return;

      const curT = this.engine.progress;
      scene.interactive.checkpoints.forEach((cp, idx) => {
        if (!this.completedCheckpoints.has(idx)) {
          // If within 0.015 of the trigger point
          if (Math.abs(curT - cp.t) < 0.015) {
            this.triggerCheckpoint(cp, idx);
          }
        }
      });
    }

    init() {
      this.bindDOMEvents();
      this.bindEngineEvents();
      this.populatePresets();
      this.setupKeyframeMarkers();
      this.updateView();
    }

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    populatePresets() {
      if (!this.elements.presetSelector || !global.ASTSceneRegistry) return;
      const list = global.ASTSceneRegistry.list();
      this.elements.presetSelector.innerHTML = '';
      list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `${item.title} (${item.stage})`;
        if (item.id === this.engine.activePresetId) {
          opt.selected = true;
        }
        this.elements.presetSelector.appendChild(opt);
      });
    }

    setupKeyframeMarkers() {
      if (!this.elements.timelineTrack) return;
      // Remove old markers
      const oldMarkers = this.elements.timelineTrack.querySelectorAll('.keyframe-marker');
      oldMarkers.forEach(m => m.remove());

      const scene = this.engine.scene;
      if (!scene || !scene.keyframes) return;

      scene.keyframes.forEach(kf => {
        const marker = document.createElement('div');
        marker.className = 'keyframe-marker';
        marker.style.left = `${kf.t * 100}%`;
        marker.title = `${kf.title}: ${kf.rule}`;
        marker.addEventListener('click', (e) => {
          e.stopPropagation();
          this.engine.seek(kf.t);
        });
        this.elements.timelineTrack.appendChild(marker);
      });
    }

    updateView() {
      const scene = this.engine.scene;
      if (this.elements.badgeStage) {
        this.elements.badgeStage.textContent = scene.stage || 'CURRICULUM';
      }

      // Render vector SVG
      if (this.elements.sceneRoot) {
        this.elements.sceneRoot.innerHTML = this.engine.renderCurrentVector();
      }

      // Subtitles
      if (this.elements.subtitleOverlay) {
        const sub = this.engine.getCurrentSubtitle();
        if (sub) {
          this.elements.subtitleOverlay.style.opacity = '1';
          this.elements.subtitleOverlay.textContent = sub;
        } else {
          this.elements.subtitleOverlay.style.opacity = '0.7';
          this.elements.subtitleOverlay.textContent = scene.title || 'AST Vector Media Player';
        }
      }

      // Scrubber and Readout
      const pct = (this.engine.progress * 100).toFixed(1);
      if (this.elements.timelineFill) {
        this.elements.timelineFill.style.width = `${pct}%`;
      }
      if (this.elements.timelineThumb) {
        this.elements.timelineThumb.style.left = `${pct}%`;
      }
      if (this.elements.timeReadout) {
        const curSec = this.engine.progress * this.engine.durationSec;
        this.elements.timeReadout.textContent =
          `${this.formatTime(curSec)} / ${this.formatTime(this.engine.durationSec)} (${Math.round(pct)}%)`;
      }
    }

    setTheme(theme) {
      this.theme = theme === 'dark' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', this.theme);
      if (this.elements.btnTheme) {
        this.elements.btnTheme.textContent = this.theme === 'dark' ? '☀️' : '🌙';
      }
    }

    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    }

    handleScrubberClick(e) {
      if (!this.elements.timelineTrack) return;
      const rect = this.elements.timelineTrack.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const targetT = clickX / rect.width;
      this.engine.seek(targetT);
      this.updateView();
    }

    bindDOMEvents() {
      const el = this.elements;

      // Scrubber drag / click
      if (el.scrubberBox) {
        el.scrubberBox.addEventListener('click', (e) => this.handleScrubberClick(e));
        
        el.scrubberBox.addEventListener('mousedown', (e) => {
          this.isDragging = true;
          this.handleScrubberClick(e);
        });

        el.scrubberBox.addEventListener('touchstart', (e) => {
          this.isDragging = true;
          this.handleScrubberClick(e);
        }, { passive: true });
      }

      window.addEventListener('mousemove', (e) => {
        if (this.isDragging) this.handleScrubberClick(e);
      });

      window.addEventListener('touchmove', (e) => {
        if (this.isDragging) this.handleScrubberClick(e);
      }, { passive: true });

      window.addEventListener('mouseup', () => {
        if (this.isDragging) this.isDragging = false;
      });

      window.addEventListener('touchend', () => {
        if (this.isDragging) this.isDragging = false;
      });

      // Controls
      if (el.btnPlay) {
        el.btnPlay.addEventListener('click', () => {
          const playing = this.engine.togglePlay();
          el.btnPlay.textContent = playing ? '⏸ Pause' : '▶ Play';
          el.btnPlay.classList.toggle('active', playing);
        });
      }

      if (el.btnPrev) {
        el.btnPrev.addEventListener('click', () => this.engine.step(-0.05));
      }

      if (el.btnNext) {
        el.btnNext.addEventListener('click', () => this.engine.step(0.05));
      }

      if (el.btnReset) {
        el.btnReset.addEventListener('click', () => this.engine.seek(0));
      }

      if (el.speedSelector) {
        el.speedSelector.addEventListener('change', (e) => {
          this.engine.setSpeed(e.target.value);
        });
      }

      if (el.presetSelector) {
        el.presetSelector.addEventListener('change', (e) => {
          this.engine.setPreset(e.target.value);
        });
      }

      if (el.langSelector) {
        el.langSelector.addEventListener('change', (e) => {
          this.engine.setLanguage(e.target.value);
          this.updateView();
        });
      }

      if (el.btnNarrate) {
        el.btnNarrate.addEventListener('click', () => {
          const enabled = this.engine.toggleVoice();
          el.btnNarrate.classList.toggle('active', enabled);
          el.btnNarrate.textContent = enabled ? '🔊 Voice: ON' : '🔊 Voice';
        });
      }

      if (el.btnTheme) {
        el.btnTheme.addEventListener('click', () => this.toggleTheme());
      }

      if (el.btnFullscreen) {
        el.btnFullscreen.addEventListener('click', () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        });
      }

      if (el.btnPrint) {
        el.btnPrint.addEventListener('click', () => window.print());
      }

      if (el.btnCopySvg && el.stageSvg) {
        el.btnCopySvg.addEventListener('click', () => {
          const rawSvg = el.stageSvg.outerHTML;
          navigator.clipboard.writeText(rawSvg).then(() => {
            const orig = el.btnCopySvg.textContent;
            el.btnCopySvg.textContent = '✓ Copied!';
            setTimeout(() => { el.btnCopySvg.textContent = orig; }, 2000);
          }).catch(() => {});
        });
      }

      // Interactive Toggle Button
      if (el.btnInteractive) {
        el.btnInteractive.classList.toggle('active', this.interactiveMode);
        el.btnInteractive.addEventListener('click', () => {
          this.interactiveMode = !this.interactiveMode;
          el.btnInteractive.classList.toggle('active', this.interactiveMode);
          this.showToast(this.interactiveMode ? '🎯 Interactive Mode: ON' : '🎯 Interactive Mode: OFF');
          if (!this.interactiveMode) {
            this.closeInteractiveCard();
          }
        });
      }

      // Interactive Card Close Button
      if (el.interactiveClose) {
        el.interactiveClose.addEventListener('click', () => {
          this.closeInteractiveCard();
          this.engine.play();
        });
      }

      // SVG Hotspot Click Delegation
      if (el.sceneRoot) {
        el.sceneRoot.addEventListener('click', (e) => {
          const hotspot = e.target.closest('[data-target-t]');
          if (hotspot) {
            const targetT = parseFloat(hotspot.getAttribute('data-target-t'));
            const label = hotspot.getAttribute('data-label') || 'Station';
            if (!isNaN(targetT)) {
              this.engine.seek(targetT);
              this.playChime(660, 'triangle');
              this.showToast(`⛪ ${label}`);
              this.engine.notifyParent({
                type: 'HOTSPOT_SELECTED',
                targetT,
                label,
                preset: this.engine.activePresetId
              });
            }
          }
        });
      }

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
        if (e.code === 'Space') {
          e.preventDefault();
          if (el.btnPlay) el.btnPlay.click();
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          this.engine.step(-0.05);
        } else if (e.code === 'ArrowRight') {
          e.preventDefault();
          this.engine.step(0.05);
        } else if (e.code === 'KeyM') {
          e.preventDefault();
          if (el.btnNarrate) el.btnNarrate.click();
        }
      });
    }

    bindEngineEvents() {
      this.engine.on('timeupdate', () => {
        this.updateView();
        this.checkInteractiveCheckpoints();
        // If looped back to start, allow checkpoints to be answered again
        if (this.engine.progress < 0.05 && this.completedCheckpoints.size > 0) {
          this.completedCheckpoints.clear();
        }
      });

      this.engine.on('statechange', (data) => {
        if (this.elements.btnPlay) {
          this.elements.btnPlay.textContent = data.isPlaying ? '⏸ Pause' : '▶ Play';
          this.elements.btnPlay.classList.toggle('active', data.isPlaying);
        }
      });

      this.engine.on('presetchange', (data) => {
        if (this.elements.presetSelector) {
          this.elements.presetSelector.value = data.preset;
        }
        this.completedCheckpoints.clear();
        this.closeInteractiveCard();
        this.setupKeyframeMarkers();
        this.updateView();
      });

      this.engine.on('langchange', (data) => {
        if (this.elements.langSelector) {
          this.elements.langSelector.value = data.lang;
        }
        this.updateView();
      });
    }
  }

  global.ASTPlayerUI = ASTPlayerUI;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASTPlayerUI };
  }
})(typeof window !== 'undefined' ? window : globalThis);
