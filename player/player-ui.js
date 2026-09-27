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
        btn3DOrbit: document.getElementById('btn-3d-orbit'),
        orbitHint: document.getElementById('orbit-hint'),
        playerStage: document.getElementById('player-stage'),
        cameraControlsBar: document.getElementById('camera-controls-bar'),
        churchCamButtons: document.getElementById('church-cam-buttons'),
        btnQuestMode: document.getElementById('btn-quest-mode'),
        questDrawer: document.getElementById('quest-drawer'),
        questScore: document.getElementById('quest-score'),
        questBody: document.getElementById('quest-body'),
        questClose: document.getElementById('quest-close'),
        btnDevMode: document.getElementById('btn-dev-mode'),
        btnDevStudio: document.getElementById('btn-dev-studio'),
        devOverlayRoot: document.getElementById('dev-overlay-root'),
        devHoverBox: document.getElementById('dev-hover-box'),
        devSelectBox: document.getElementById('dev-select-box'),
        devHoverTooltip: document.getElementById('dev-hover-tooltip'),
        devInspectorDrawer: document.getElementById('dev-inspector-drawer'),
        devInspectorClose: document.getElementById('dev-inspector-close'),
        devInspectedTag: document.getElementById('dev-inspected-tag'),
        devInspectedSel: document.getElementById('dev-inspected-sel'),
        devPropXy: document.getElementById('dev-prop-xy'),
        devPropWh: document.getElementById('dev-prop-wh'),
        devColorFill: document.getElementById('dev-color-fill'),
        devPropFill: document.getElementById('dev-prop-fill'),
        devColorStroke: document.getElementById('dev-color-stroke'),
        devPropStroke: document.getElementById('dev-prop-stroke'),
        devPropStrokew: document.getElementById('dev-prop-strokew'),
        devRangeOpacity: document.getElementById('dev-range-opacity'),
        devValOpacity: document.getElementById('dev-val-opacity'),
        devPropTransform: document.getElementById('dev-prop-transform'),
        btnCopySelector: document.getElementById('btn-copy-selector'),
        btnCopyAstRule: document.getElementById('btn-copy-ast-rule'),
        btnCopyNodeXml: document.getElementById('btn-copy-node-xml'),
        devActiveBindings: document.getElementById('dev-active-bindings'),
        devStudioDrawer: document.getElementById('dev-studio-drawer'),
        devStudioClose: document.getElementById('dev-studio-close'),
        btnStudioRun: document.getElementById('btn-studio-run'),
        btnStudioReset: document.getElementById('btn-studio-reset'),
        btnStudioExport: document.getElementById('btn-studio-export'),
        devEditorSvg: document.getElementById('dev-editor-svg'),
        devEditorAst: document.getElementById('dev-editor-ast'),
        devTemplateTab: document.getElementById('dev-template-tab'),
      }, elements);

      this.isDragging = false;
      this.isOrbitDragging = false;
      this.theme = document.body.getAttribute('data-theme') || 'dark';
      this.interactiveMode = true;
      this.completedCheckpoints = new Set();
      this.activeCheckpoint = null;
      this.toastTimeout = null;
      this._orbitHintTimeout = null;

      // Developer Mode & SVG Inspector State
      this.devModeActive = false;
      this.selectedElement = null;
      this.selectedElementSelector = '';
      this.activeStudioTab = 'svg';

      this.starterTemplates = [
        {
          id: 'simple-orbit',
          title: '🪐 Simple Planetary Orbit',
          desc: 'Center star with orbiting planet governed by trigonometry.',
          svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="400" cy="240" r="140" fill="none" stroke="#334155" stroke-dasharray="4 4" />\n  <circle id="star-sun" cx="400" cy="240" r="32" fill="#f59e0b" filter="url(#glow)" />\n  <circle id="planet-earth" cx="540" cy="240" r="14" fill="#38bdf8" />\n  <text id="orbit-txt" x="400" y="440" fill="#94a3b8" font-size="16" text-anchor="middle">Planetary Orbit Period: 1.0 Cycle</text>\n</svg>`,
          ast: `(:scene :id "simple-orbit" :title "Simple Planetary Orbit" :stage "KS3 SCIENCE" :duration 6.0\n  (:keyframes (\n    (:t 0.00 :title "Perihelion" :rule "Planet starts at 0 rad")\n    (:t 0.50 :title "Aphelion" :rule "Planet reaches opposite orbital pole")\n  ))\n  (:bindings (\n    (:target "#planet-earth" :attr "cx" :expr "400 + Math.cos(t * Math.PI * 2) * 140")\n    (:target "#planet-earth" :attr "cy" :expr "240 + Math.sin(t * Math.PI * 2) * 140")\n    (:target "#orbit-txt" :attr "textContent" :expr "'Orbit Angle: ' + Math.round(t * 360) + '°'")\n  ))\n)`
        },
        {
          id: 'sine-wave',
          title: '🌊 Harmonic Sine Wave',
          desc: 'Continuous wave oscillation with frequency and amplitude.',
          svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">\n  <line x1="100" y1="240" x2="700" y2="240" stroke="#334155" stroke-width="2" />\n  <path id="harmonic-wave" d="M 100 240 Q 250 140 400 240 T 700 240" fill="none" stroke="#38bdf8" stroke-width="4" />\n  <circle id="wave-tracer" cx="400" cy="240" r="10" fill="#f43f5e" filter="url(#glow)" />\n  <text id="wave-label" x="400" y="80" fill="#38bdf8" font-size="20" font-weight="bold" text-anchor="middle">y = A · sin(ωt + φ)</text>\n</svg>`,
          ast: `(:scene :id "sine-wave" :title "Harmonic Sine Wave" :stage "KS4 PHYSICS" :duration 4.0\n  (:keyframes (\n    (:t 0.00 :title "Initial Phase" :rule "Zero displacement at origin")\n    (:t 0.25 :title "Crest Amplitude" :rule "Maximum positive displacement +A")\n    (:t 0.75 :title "Trough Amplitude" :rule "Maximum negative displacement -A")\n  ))\n  (:bindings (\n    (:target "#wave-tracer" :attr "cy" :expr "240 - Math.sin(t * Math.PI * 2) * 90")\n    (:target "#wave-tracer" :attr "cx" :expr "100 + (t * 600)")\n    (:target "#wave-label" :attr "textContent" :expr "'Displacement y = ' + (Math.sin(t * Math.PI * 2) * 10).toFixed(1) + ' cm'")\n  ))\n)`
        },
        {
          id: 'physics-pendulum',
          title: '⏱️ Physics Harmonic Pendulum',
          desc: 'Conservation of mechanical energy: kinetic vs potential.',
          svg: `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="400" cy="80" r="6" fill="#64748b" />\n  <line id="pendulum-rod" x1="400" y1="80" x2="400" y2="340" stroke="#94a3b8" stroke-width="3" />\n  <circle id="pendulum-bob" cx="400" cy="340" r="28" fill="#10b981" stroke="#34d399" stroke-width="2" />\n  <text id="energy-txt" x="400" y="420" fill="#34d399" font-size="16" font-weight="bold" text-anchor="middle">E = Ep + Ek</text>\n</svg>`,
          ast: `(:scene :id "physics-pendulum" :title "Harmonic Pendulum" :stage "KS3 PHYSICS" :duration 3.0\n  (:keyframes (\n    (:t 0.00 :title "Max Left Amplitude" :rule "Ep is maximal, Ek = 0")\n    (:t 0.25 :title "Equilibrium Pass" :rule "Ek is maximal at center, Ep is minimum")\n    (:t 0.50 :title "Max Right Amplitude" :rule "Ep is maximal, Ek = 0")\n  ))\n  (:bindings (\n    (:target "#pendulum-rod" :attr "transform" :expr "'rotate(' + (Math.sin(t * Math.PI * 2) * 40) + ' 400 80)'")\n    (:target "#pendulum-bob" :attr "transform" :expr "'rotate(' + (Math.sin(t * Math.PI * 2) * 40) + ' 400 80)'")\n    (:target "#energy-txt" :attr "textContent" :expr "'Potential Energy: ' + (Math.abs(Math.sin(t * Math.PI * 2)) * 100).toFixed(0) + '% | Kinetic: ' + ((1 - Math.abs(Math.sin(t * Math.PI * 2))) * 100).toFixed(0) + '%'")\n  ))\n)`
        }
      ];

      this.questState = {
        active: false,
        missionIndex: 0,
        score: 0,
        completedMissions: new Set()
      };

      this.questMissions = [
        {
          id: 'narthex',
          targetT: 0.00,
          cam: { yaw: 0, pitch: 12, scale: 1.0 },
          title: 'Mission 1: The Narthex & Holy Water Stoup',
          desc: 'Find where Christians first enter the sacred space and bless themselves with Holy Water.',
          question: 'Why do we bless ourselves with Holy Water upon entering the church?',
          options: [
            'To wash physical dust off our hands',
            'To recall our Holy Baptism and bless ourselves in the Name of the Father, Son, and Holy Spirit',
            'As an ancient medieval heating custom'
          ],
          correct: 1,
          explanation: 'Blessing ourselves with Holy Water at the Narthex stoup reminds us of our Baptism, cleansing our thoughts as we enter God\'s holy house.'
        },
        {
          id: 'nave',
          targetT: 0.20,
          cam: { yaw: 0, pitch: 10, scale: 0.9 },
          title: 'Mission 2: The Nave Colonnade & Central Aisle',
          desc: 'Walk down the central aisle where the pilgrim people of God gather.',
          question: 'Why do Catholics genuflect on the right knee toward the Tabernacle before entering the pew?',
          options: [
            'To show formal etiquette to fellow parishioners',
            'To adore Jesus Christ truly and bodily present in the Eucharist inside the Tabernacle',
            'To stretch after the long walk'
          ],
          correct: 1,
          explanation: 'Genuflection is a sacred posture of royal adoration before Christ our Lord truly present in the Blessed Sacrament.'
        },
        {
          id: 'ambo',
          targetT: 0.40,
          cam: { yaw: -22, pitch: 8, scale: 0.7 },
          title: 'Mission 3: The Ambo (Table of the Word)',
          desc: 'Locate the sacred pulpit from which Sacred Scripture is read.',
          question: 'What sacred proclamation takes place at the Ambo?',
          options: [
            'Weekly parish notices only',
            'The Holy Gospel and the Word of God for the Liturgy of the Word',
            'Organ choir practice'
          ],
          correct: 1,
          explanation: 'The Ambo is the Table of the Word, dignified and consecrated for the proclamation of Sacred Scripture and the Holy Gospel.'
        },
        {
          id: 'altar',
          targetT: 0.60,
          cam: { yaw: 0, pitch: 8, scale: 0.65 },
          title: 'Mission 4: The High Altar of Sacrifice',
          desc: 'Examine the sacred focal center of the Catholic basilica.',
          question: 'What does the High Altar represent and what occurs upon it?',
          options: [
            'It is a dining table for parish meetings',
            'It represents Christ Himself; upon it the Holy Sacrifice of the Mass is offered',
            'It is purely an architectural stone decoration'
          ],
          correct: 1,
          explanation: 'The altar is Christ! During Mass, bread and wine become Christ\'s real Body and Blood in the Holy Eucharist.'
        },
        {
          id: 'tabernacle',
          targetT: 0.80,
          cam: { yaw: 0, pitch: 6, scale: 0.5 },
          title: 'Mission 5: The Golden Tabernacle & Sanctuary Lamp',
          desc: 'Locate the golden ark in the apse and note the burning red lamp.',
          question: 'Why does the red Sanctuary Lamp burn day and night beside the Tabernacle?',
          options: [
            'To provide emergency fire exit lighting',
            'To indicate the Real Presence of Christ reserved in the Blessed Sacrament',
            'To illuminate the priest\'s books'
          ],
          correct: 1,
          explanation: 'The sanctuary lamp is an undying beacon signaling to all pilgrims that Christ is truly present in the Tabernacle.'
        },
        {
          id: 'lady-and-font',
          targetT: 1.00,
          cam: { yaw: 22, pitch: 10, scale: 0.75 },
          title: 'Mission 6: The Lady Chapel & Baptismal Font',
          desc: 'Explore the devotional side chapel of Our Lady and the Baptismal Font.',
          question: 'Which Sacrament of Initiation is received at the Baptismal Font?',
          options: [
            'Holy Baptism, which washes away original sin and welcomes us into God\'s family',
            'Holy Orders',
            'Anointing of the Sick'
          ],
          correct: 0,
          explanation: 'At the Baptismal Font, the holy waters of regeneration give new spiritual life in Christ, washing away original sin.'
        }
      ];

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

    update3DStatus() {
      const is3D = Boolean(this.engine && this.engine.has3D());
      const isChurchScene = Boolean(
        this.engine &&
        (this.engine.activePresetId === 'church-tour' ||
         (this.engine.scene && this.engine.scene.id === 'church-tour'))
      );

      if (this.elements.btn3DOrbit) {
        if (is3D) {
          this.elements.btn3DOrbit.classList.remove('hidden');
          this.elements.btn3DOrbit.style.display = '';
          const isModified = Boolean(
            this.engine.cameraOrbit &&
            (this.engine.cameraOrbit.yawOffset !== 0 ||
             this.engine.cameraOrbit.pitchOffset !== 0 ||
             this.engine.cameraOrbit.distanceScale !== 1.0)
          );
          this.elements.btn3DOrbit.classList.toggle('active', isModified);
          this.elements.btn3DOrbit.title = isModified
            ? 'Reset 3D Camera to Scene Default'
            : '3D Scene: Drag stage to orbit / Scroll to zoom / Click to reset';
        } else {
          this.elements.btn3DOrbit.classList.add('hidden');
          this.elements.btn3DOrbit.style.display = 'none';
        }
      }

      const stage = this.elements.playerStage || this.elements.stageSvg;
      if (stage) {
        stage.classList.toggle('has-3d-scene', is3D);
      }

      // Camera controls toolbar is only displayed for true 3D spatial scenes
      if (this.elements.cameraControlsBar) {
        this.elements.cameraControlsBar.classList.toggle('hidden', !is3D);
        this.elements.cameraControlsBar.style.display = is3D ? 'flex' : 'none';
      }

      // Church-specific buttons (Nave, Altar, Tabernacle, Ambo, Quest) strictly ONLY displayed for church-tour scene
      if (this.elements.churchCamButtons) {
        this.elements.churchCamButtons.classList.toggle('hidden', !isChurchScene);
        this.elements.churchCamButtons.style.display = isChurchScene ? 'inline-flex' : 'none';
      }

      if (this.elements.btnQuestMode) {
        this.elements.btnQuestMode.classList.toggle('hidden', !isChurchScene);
        this.elements.btnQuestMode.style.display = isChurchScene ? '' : 'none';
      }

      if (is3D && this.elements.orbitHint) {
        this.elements.orbitHint.classList.remove('hidden');
        this.elements.orbitHint.classList.remove('fade-out');
        this.elements.orbitHint.style.display = '';
        if (this._orbitHintTimeout) clearTimeout(this._orbitHintTimeout);
        this._orbitHintTimeout = setTimeout(() => {
          if (this.elements.orbitHint) {
            this.elements.orbitHint.classList.add('fade-out');
            setTimeout(() => {
              if (this.elements.orbitHint && this.elements.orbitHint.classList.contains('fade-out')) {
                this.elements.orbitHint.classList.add('hidden');
                this.elements.orbitHint.style.display = 'none';
              }
            }, 350);
          }
        }, 3200);
      } else if (this.elements.orbitHint) {
        this.elements.orbitHint.classList.add('hidden');
        this.elements.orbitHint.style.display = 'none';
      }
    }

    init() {
      if (this.elements.sceneRoot) {
        this.engine.container = this.elements.sceneRoot;
      }
      this.populatePresets();
      this.bindDOMEvents();
      this.bindEngineEvents();
      this.setupKeyframeMarkers();
      this.update3DStatus();
      this.updateView();

      // Ensure immediate render of initial scene onto stage
      if (this.engine && this.engine.scene && this.engine.container) {
        this.engine.mountSceneAsset(this.engine.scene, this.engine.container);
        this.engine.applyBindings(this.engine.progress);
      }
    }

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    async populatePresets() {
      if (!this.elements.presetSelector || this._isPopulating) return;
      this._isPopulating = true;
      let list = [];
      try {
        let res = await fetch('./scenes.manifest.json?v=2.5.0').catch(() => null);
        if (!res || !res.ok) {
          res = await fetch('./scenes-config.json?v=2.5.0').catch(() => null);
        }
        if (res && res.ok) {
          const manifest = await res.json();
          if (manifest && Array.isArray(manifest.scenes)) {
            list = manifest.scenes;
          }
        }
      } catch (err) {
        console.warn('[Player UI] Manifest load fallback:', err);
      }

      if (!list.length && global.ASTSceneRegistry) {
        list = global.ASTSceneRegistry.list();
      }

      const activeId = this.engine.activePresetId || 'church-tour';
      this.elements.presetSelector.innerHTML = '';
      list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `${item.title} (${item.stage})`;
        if (item.id === activeId) {
          opt.selected = true;
        }
        this.elements.presetSelector.appendChild(opt);
      });
      // Explicitly sync the select value to the engine's active preset
      if (activeId) {
        this.elements.presetSelector.value = activeId;
      }
      this._isPopulating = false;
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

      // Render vector SVG via direct element attribute patching (zero DOM thrashing, 60 FPS)
      if (this.elements.sceneRoot) {
        this.engine.renderCurrentVector(this.elements.sceneRoot);
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
          if (this._isPopulating) return;
          if (e.target.value && e.target.value !== this.engine.activePresetId) {
            this.engine.setPreset(e.target.value, true);
          }
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

      // 3D Reset / Orbit Toggle Button
      if (el.btn3DOrbit) {
        el.btn3DOrbit.addEventListener('click', () => {
          const isModified = Boolean(
            this.engine.cameraOrbit &&
            (this.engine.cameraOrbit.yawOffset !== 0 ||
             this.engine.cameraOrbit.pitchOffset !== 0 ||
             this.engine.cameraOrbit.distanceScale !== 1.0)
          );
          if (isModified) {
            this.engine.resetCamera();
            this.playChime(659.25, 'triangle');
            this.showToast('🌐 3D Camera Reset');
          } else {
            this.engine.rotateCamera(45, 18);
            this.playChime(587.33, 'triangle');
            this.showToast('🌐 3D Perspective Orbit (+45°)');
          }
          this.update3DStatus();
        });
      }

      // Interactive 3D Orbit Gestures on Viewport Stage (Mouse, Touch, Wheel, Double Click)
      const stage = el.playerStage || el.stageSvg;
      let startOrbitX = 0;
      let startOrbitY = 0;
      let initialPinchDist = 0;

      if (stage) {
        stage.addEventListener('mousedown', (e) => {
          if (this.devModeActive || e.target.closest('button') || e.target.closest('select') || e.target.closest('.interactive-card') || e.target.closest('.dev-inspector-drawer') || e.target.closest('.dev-studio-drawer')) return;
          if (this.engine.has3D()) {
            this.isOrbitDragging = true;
            startOrbitX = e.clientX;
            startOrbitY = e.clientY;
            stage.classList.add('is-orbiting');
          }
        });

        window.addEventListener('mousemove', (e) => {
          if (this.isOrbitDragging && this.engine.has3D()) {
            const dx = e.clientX - startOrbitX;
            const dy = e.clientY - startOrbitY;
            startOrbitX = e.clientX;
            startOrbitY = e.clientY;
            this.engine.rotateCamera(dx * 0.45, -dy * 0.45);
          }
        });

        window.addEventListener('mouseup', () => {
          if (this.isOrbitDragging) {
            this.isOrbitDragging = false;
            if (stage) stage.classList.remove('is-orbiting');
          }
        });

        // Touch gestures for iPad and mobile devices
        stage.addEventListener('touchstart', (e) => {
          if (e.target.closest('button') || e.target.closest('select') || e.target.closest('.interactive-card')) return;
          if (this.engine.has3D()) {
            if (e.touches.length === 1) {
              this.isOrbitDragging = true;
              startOrbitX = e.touches[0].clientX;
              startOrbitY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
              const dx = e.touches[0].clientX - e.touches[1].clientX;
              const dy = e.touches[0].clientY - e.touches[1].clientY;
              initialPinchDist = Math.hypot(dx, dy);
            }
          }
        }, { passive: true });

        stage.addEventListener('touchmove', (e) => {
          if (this.isOrbitDragging && e.touches.length === 1 && this.engine.has3D()) {
            const dx = e.touches[0].clientX - startOrbitX;
            const dy = e.touches[0].clientY - startOrbitY;
            startOrbitX = e.touches[0].clientX;
            startOrbitY = e.touches[0].clientY;
            this.engine.rotateCamera(dx * 0.55, -dy * 0.55);
          } else if (e.touches.length === 2 && this.engine.has3D()) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            if (initialPinchDist > 0) {
              const pinchDelta = (dist - initialPinchDist) / initialPinchDist;
              this.engine.zoomCamera(pinchDelta * 0.1);
              initialPinchDist = dist;
            }
          }
        }, { passive: true });

        stage.addEventListener('touchend', () => {
          this.isOrbitDragging = false;
          initialPinchDist = 0;
        });

        // Scroll wheel to zoom
        stage.addEventListener('wheel', (e) => {
          if (this.engine.has3D()) {
            e.preventDefault();
            this.engine.zoomCamera(-e.deltaY * 0.0015);
          }
        }, { passive: false });

        // Double click to reset orientation
        stage.addEventListener('dblclick', (e) => {
          if (e.target.closest('button') || e.target.closest('select')) return;
          if (this.engine.has3D()) {
            this.engine.resetCamera();
            this.playChime(659.25, 'triangle');
            this.showToast('🌐 3D Camera Reset');
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

      // 3D Camera Viewpoints Presets Toolbar
      if (el.cameraControlsBar) {
        el.cameraControlsBar.querySelectorAll('.cam-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const camType = btn.getAttribute('data-cam');
            if (camType === 'entrance') {
              this.engine.cameraOrbit.yawOffset = 0;
              this.engine.cameraOrbit.pitchOffset = 18;
              this.engine.cameraOrbit.distanceScale = 1.05;
              this.engine.seek(0.05);
              this.showToast('⛪ Nave Entrance 3D Perspective');
            } else if (camType === 'altar') {
              this.engine.cameraOrbit.yawOffset = 0;
              this.engine.cameraOrbit.pitchOffset = 26;
              this.engine.cameraOrbit.distanceScale = 1.45;
              this.engine.seek(0.60);
              this.showToast('✨ High Altar Focus (3D Zoom)');
            } else if (camType === 'tabernacle') {
              this.engine.cameraOrbit.yawOffset = 14;
              this.engine.cameraOrbit.pitchOffset = 28;
              this.engine.cameraOrbit.distanceScale = 1.70;
              this.engine.seek(0.80);
              this.showToast('🕯️ Golden Tabernacle Focus');
            } else if (camType === 'ambo') {
              this.engine.cameraOrbit.yawOffset = -24;
              this.engine.cameraOrbit.pitchOffset = 22;
              this.engine.cameraOrbit.distanceScale = 1.45;
              this.engine.seek(0.40);
              this.showToast('📖 Ambo (Table of the Word)');
            } else if (camType === 'overhead') {
              this.engine.cameraOrbit.yawOffset = 0;
              this.engine.cameraOrbit.pitchOffset = 58;
              this.engine.cameraOrbit.distanceScale = 1.25;
              this.showToast('🦅 Bird\'s-Eye 3D Perspective');
            } else if (camType === 'orbit') {
              this.engine.rotateCamera(45, 0);
              this.showToast('🔄 Orbiting +45° in 3D');
            } else if (camType === 'reset') {
              this.engine.resetCamera();
              this.showToast('🌐 3D Camera Reset');
            }
            this.engine.applyBindings(this.engine.progress);
            this.playChime(587.33, 'triangle');
            this.update3DStatus();
          });
        });
      }

      // 3D Pilgrim Quest Mode Button
      if (el.btnQuestMode) {
        el.btnQuestMode.addEventListener('click', () => {
          this.startQuestMode();
        });
      }

      if (el.questClose) {
        el.questClose.addEventListener('click', () => {
          this.closeQuestMode();
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

      // --- Developer Inspector & Live Studio Event Bindings ---
      if (el.btnDevMode) {
        el.btnDevMode.addEventListener('click', () => this.toggleDevMode());
      }

      if (el.btnDevStudio) {
        el.btnDevStudio.addEventListener('click', () => this.toggleDevStudio());
      }

      if (stage) {
        stage.addEventListener('mousemove', (e) => {
          if (!this.devModeActive || !el.sceneRoot || !el.stageSvg) return;
          if (e.target.closest('.dev-inspector-drawer') || e.target.closest('.dev-studio-drawer') || e.target.closest('header') || e.target.closest('footer')) {
            if (el.devHoverBox) el.devHoverBox.classList.add('hidden');
            if (el.devHoverTooltip) el.devHoverTooltip.classList.add('hidden');
            return;
          }

          let target = document.elementFromPoint(e.clientX, e.clientY);
          if (target && target.closest && target.closest('#scene-root') && target !== el.sceneRoot) {
            if (target.tagName && target.tagName.toLowerCase() === 'g' && target.children.length === 1) {
              target = target.children[0];
            }
            this.updateDevHover(target, e);
          } else {
            if (el.devHoverBox) el.devHoverBox.classList.add('hidden');
            if (el.devHoverTooltip) el.devHoverTooltip.classList.add('hidden');
          }
        });

        stage.addEventListener('mouseleave', () => {
          if (el.devHoverBox) el.devHoverBox.classList.add('hidden');
          if (el.devHoverTooltip) el.devHoverTooltip.classList.add('hidden');
        });

        stage.addEventListener('click', (e) => {
          if (!this.devModeActive) return;
          if (e.target.closest('.dev-inspector-drawer') || e.target.closest('.dev-studio-drawer') || e.target.closest('button') || e.target.closest('select')) return;

          let target = document.elementFromPoint(e.clientX, e.clientY);
          if (target && target.closest && target.closest('#scene-root') && target !== el.sceneRoot) {
            e.stopPropagation();
            if (target.tagName && target.tagName.toLowerCase() === 'g' && target.children.length === 1) {
              target = target.children[0];
            }
            this.selectElement(target);
          }
        });
      }

      if (el.devInspectorClose) {
        el.devInspectorClose.addEventListener('click', () => this.closeInspectorDrawer());
      }

      const syncAttr = (attr, val) => {
        if (!this.selectedElement) return;
        this.selectedElement.setAttribute(attr, val);
        this.refreshSelectBox();
        this.engine.notifyParent({
          type: 'DEV_ELEMENT_UPDATED',
          selector: this.selectedElementSelector,
          attr,
          value: val
        });
      };

      if (el.devColorFill && el.devPropFill) {
        el.devColorFill.addEventListener('input', (e) => {
          el.devPropFill.value = e.target.value;
          syncAttr('fill', e.target.value);
        });
        el.devPropFill.addEventListener('change', (e) => {
          el.devColorFill.value = e.target.value.startsWith('#') && e.target.value.length === 7 ? e.target.value : '#000000';
          syncAttr('fill', e.target.value);
        });
      }

      if (el.devColorStroke && el.devPropStroke) {
        el.devColorStroke.addEventListener('input', (e) => {
          el.devPropStroke.value = e.target.value;
          syncAttr('stroke', e.target.value);
        });
        el.devPropStroke.addEventListener('change', (e) => {
          el.devColorStroke.value = e.target.value.startsWith('#') && e.target.value.length === 7 ? e.target.value : '#000000';
          syncAttr('stroke', e.target.value);
        });
      }

      if (el.devPropStrokew) {
        el.devPropStrokew.addEventListener('input', (e) => {
          syncAttr('stroke-width', e.target.value);
        });
      }

      if (el.devRangeOpacity && el.devValOpacity) {
        el.devRangeOpacity.addEventListener('input', (e) => {
          el.devValOpacity.textContent = parseFloat(e.target.value).toFixed(2);
          syncAttr('opacity', e.target.value);
        });
      }

      if (el.devPropTransform) {
        el.devPropTransform.addEventListener('input', (e) => {
          syncAttr('transform', e.target.value);
        });
      }

      if (el.btnCopySelector) {
        el.btnCopySelector.addEventListener('click', () => {
          if (!this.selectedElementSelector) return;
          navigator.clipboard.writeText(this.selectedElementSelector).then(() => {
            this.showToast(`✓ Selector copied: ${this.selectedElementSelector}`);
          });
        });
      }

      if (el.btnCopyAstRule) {
        el.btnCopyAstRule.addEventListener('click', () => {
          if (!this.selectedElementSelector) return;
          const snippet = `(:target "${this.selectedElementSelector}" :attr "transform" :expr "'rotate(' + (t * 360) + ')'")`;
          navigator.clipboard.writeText(snippet).then(() => {
            this.showToast(`✓ AST rule copied`);
          });
        });
      }

      if (el.btnCopyNodeXml) {
        el.btnCopyNodeXml.addEventListener('click', () => {
          if (!this.selectedElement) return;
          navigator.clipboard.writeText(this.selectedElement.outerHTML).then(() => {
            this.showToast(`✓ OuterXML copied`);
          });
        });
      }

      if (el.devStudioClose) {
        el.devStudioClose.addEventListener('click', () => this.closeDevStudio());
      }

      const studioTabBtns = document.querySelectorAll('.dev-tab-btn');
      studioTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          this.switchStudioTab(tab);
        });
      });

      if (el.btnStudioRun) {
        el.btnStudioRun.addEventListener('click', () => {
          let svgOk = true, astOk = true;
          if (el.devEditorSvg && el.devEditorSvg.value) {
            svgOk = this.engine.hotReloadSvg(el.devEditorSvg.value);
          }
          if (el.devEditorAst && el.devEditorAst.value) {
            astOk = this.engine.hotReloadAst(el.devEditorAst.value);
          }
          if (svgOk && astOk) {
            this.playChime(784, 'triangle');
            this.showToast('⚡ Live Stage Hot-Reloaded!');
          } else {
            this.playChime(220, 'sawtooth');
            this.showToast('Notice: Syntax issue in SVG or AST');
          }
        });
      }

      if (el.btnStudioReset) {
        el.btnStudioReset.addEventListener('click', () => {
          this.engine.loadScene(this.engine.activePresetId, this.engine.isPlaying);
          setTimeout(() => {
            if (el.devEditorSvg) el.devEditorSvg.value = this.engine.getStageSvgSnapshot();
            if (el.devEditorAst) el.devEditorAst.value = this.engine.getCurrentAstSource();
            this.showToast('↺ Preset Reset');
          }, 150);
        });
      }

      if (el.btnStudioExport) {
        el.btnStudioExport.addEventListener('click', () => {
          const cleanSvg = this.engine.getStageSvgSnapshot();
          const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${this.engine.activePresetId || 'scene'}-export.svg`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          this.showToast('💾 Clean Vector SVG Exported');
        });
      }

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
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
        } else if (e.code === 'KeyI' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.toggleDevMode();
        } else if (e.code === 'Escape') {
          if (this.elements.devInspectorDrawer && !this.elements.devInspectorDrawer.classList.contains('hidden')) {
            this.closeInspectorDrawer();
          } else if (this.elements.devStudioDrawer && !this.elements.devStudioDrawer.classList.contains('hidden')) {
            this.closeDevStudio();
          }
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

      this.engine.on('camerachange', () => {
        this.update3DStatus();
      });

      this.engine.on('presetchange', (data) => {
        if (this.elements.presetSelector) {
          this.elements.presetSelector.value = data.preset;
        }
        this.completedCheckpoints.clear();
        this.closeInteractiveCard();
        this.closeQuestMode();
        this.setupKeyframeMarkers();
        this.update3DStatus();
        this.updateView();
      });

      this.engine.on('langchange', (data) => {
        if (this.elements.langSelector) {
          this.elements.langSelector.value = data.lang;
        }
        this.updateView();
      });
    }

    startQuestMode() {
      if (!this.elements.questDrawer) return;
      this.questState.active = true;
      this.elements.questDrawer.classList.remove('hidden');
      this.engine.pause();
      this.showToast('🎮 3D Pilgrim Quest: Sacred Space Explorer Started!');
      this.playChime(659.25, 'triangle');
      this.renderCurrentMission();
    }

    renderCurrentMission() {
      if (!this.elements.questBody || !this.elements.questScore) return;
      const idx = this.questState.missionIndex;
      const total = this.questMissions.length;

      this.elements.questScore.textContent = `⭐ ${this.questState.completedMissions.size}/${total} Stars • ${this.questState.score} Pts`;

      if (idx >= total) {
        this.elements.questBody.innerHTML = `
          <div style="text-align: center; padding: 12px 6px;">
            <div style="font-size: 28px; margin-bottom: 6px;">🏆 ⛪ ⭐</div>
            <div class="quest-mission-title" style="color: #facc15; font-size: 15px;">PILGRIM MASTER OF SACRED ARCHITECTURE!</div>
            <div class="quest-mission-desc" style="margin: 8px 0 14px 0;">
              Congratulations! You have explored all 6 sacred spaces in full 3D, mastering the Narthex, Nave Colonnade, Ambo, High Altar, Golden Tabernacle, Lady Chapel, and Baptismal Font!
            </div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button type="button" class="quest-action-btn" id="quest-replay-btn">🔄 Play Again</button>
              <button type="button" class="quest-action-btn" id="quest-finish-btn" style="background:#059669; border-color:#10b981;">✓ Complete Tour</button>
            </div>
          </div>
        `;
        const replayBtn = document.getElementById('quest-replay-btn');
        if (replayBtn) {
          replayBtn.addEventListener('click', () => {
            this.questState.missionIndex = 0;
            this.questState.score = 0;
            this.questState.completedMissions.clear();
            this.renderCurrentMission();
          });
        }
        const finishBtn = document.getElementById('quest-finish-btn');
        if (finishBtn) finishBtn.addEventListener('click', () => this.closeQuestMode());
        return;
      }

      const m = this.questMissions[idx];

      if (m.cam) {
        this.engine.cameraOrbit.yawOffset = m.cam.yaw;
        this.engine.cameraOrbit.pitchOffset = m.cam.pitch;
        this.engine.cameraOrbit.distanceScale = m.cam.scale;
        this.engine.seek(m.targetT);
        this.engine.applyBindings(m.targetT);
        this.update3DStatus();
      }

      let html = `
        <div class="quest-mission-title">${m.title}</div>
        <div class="quest-mission-desc">${m.desc}</div>
        <div style="font-weight: 700; font-size: 12px; color: #f8fafc; margin-bottom: 6px;">${m.question}</div>
        <div class="quest-options-grid">
      `;

      m.options.forEach((opt, optIdx) => {
        html += `<button type="button" class="quest-option-btn" data-opt="${optIdx}">${opt}</button>`;
      });

      html += `</div>`;
      this.elements.questBody.innerHTML = html;

      const optionBtns = this.elements.questBody.querySelectorAll('.quest-option-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const optIdx = parseInt(e.currentTarget.getAttribute('data-opt'), 10);
          this.checkMissionAnswer(m, optIdx, optionBtns);
        });
      });
    }

    checkMissionAnswer(mission, selectedIdx, optionBtns) {
      const isCorrect = selectedIdx === mission.correct;
      optionBtns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === mission.correct) {
          btn.classList.add('correct');
        } else if (i === selectedIdx) {
          btn.classList.add('incorrect');
        }
      });

      if (isCorrect) {
        this.playChime(784, 'triangle');
        if (!this.questState.completedMissions.has(mission.id)) {
          this.questState.score += 100;
          this.questState.completedMissions.add(mission.id);
        }
        this.showToast(`⭐ Correct! +100 Pilgrim Points`);
      } else {
        this.playChime(220, 'sawtooth');
        this.showToast(`Notice: Review the sacred symbolism`);
      }

      this.elements.questScore.textContent = `⭐ ${this.questState.completedMissions.size}/${this.questMissions.length} Stars • ${this.questState.score} Pts`;

      const feedbackDiv = document.createElement('div');
      feedbackDiv.style.marginTop = '10px';
      feedbackDiv.style.padding = '8px 12px';
      feedbackDiv.style.borderRadius = '8px';
      feedbackDiv.style.background = isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
      feedbackDiv.style.border = isCorrect ? '1px solid #10b981' : '1px solid #ef4444';
      feedbackDiv.style.fontSize = '11px';
      feedbackDiv.style.lineHeight = '1.4';
      feedbackDiv.innerHTML = `
        <div style="font-weight: 700; color: ${isCorrect ? '#34d399' : '#f87171'}; margin-bottom: 4px;">
          ${isCorrect ? '✓ Well answered, Pilgrim!' : 'Catechetical Insight:'}
        </div>
        <div style="color: #e2e8f0; margin-bottom: 8px;">${mission.explanation}</div>
        <button type="button" class="quest-action-btn" id="btn-next-mission">
          ${this.questState.missionIndex + 1 < this.questMissions.length ? 'Next Sacred Station ➜' : 'View Master Results 🏆'}
        </button>
      `;
      this.elements.questBody.appendChild(feedbackDiv);

      const nextBtn = document.getElementById('btn-next-mission');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          this.questState.missionIndex++;
          this.renderCurrentMission();
        });
      }
    }

    closeQuestMode() {
      if (this.elements.questDrawer) {
        this.elements.questDrawer.classList.add('hidden');
      }
      this.questState.active = false;
    }

    // --- Developer Inspector & Live Studio Methods ---

    setDevMode(enabled) {
      this.devModeActive = Boolean(enabled);
      const stage = this.elements.playerStage || this.elements.stageSvg;
      if (stage) {
        stage.classList.toggle('dev-mode-active', this.devModeActive);
      }
      if (this.elements.btnDevMode) {
        this.elements.btnDevMode.classList.toggle('active', this.devModeActive);
      }
      if (!this.devModeActive) {
        if (this.elements.devHoverBox) this.elements.devHoverBox.classList.add('hidden');
        if (this.elements.devHoverTooltip) this.elements.devHoverTooltip.classList.add('hidden');
        if (this.elements.devSelectBox) this.elements.devSelectBox.classList.add('hidden');
        this.closeInspectorDrawer();
      }
      this.showToast(this.devModeActive ? '🛠️ Inspector Mode: Click SVG node to inspect' : '🛠️ Inspector Mode: OFF');
      this.engine.notifyParent({
        type: 'DEV_MODE_CHANGED',
        enabled: this.devModeActive
      });
    }

    toggleDevMode() {
      this.setDevMode(!this.devModeActive);
    }

    updateDevHover(targetNode, e) {
      if (!this.elements.devHoverBox || !this.elements.devHoverTooltip || !this.elements.stageSvg) return;
      try {
        const svg = this.elements.stageSvg;
        const bbox = targetNode.getBBox ? targetNode.getBBox() : targetNode.getBoundingClientRect();
        
        this.elements.devHoverBox.setAttribute('x', bbox.x);
        this.elements.devHoverBox.setAttribute('y', bbox.y);
        this.elements.devHoverBox.setAttribute('width', Math.max(4, bbox.width));
        this.elements.devHoverBox.setAttribute('height', Math.max(4, bbox.height));
        this.elements.devHoverBox.classList.remove('hidden');

        const stageRect = svg.getBoundingClientRect();
        const tooltipX = Math.min(stageRect.width - 220, Math.max(10, e.clientX - stageRect.left + 14));
        const tooltipY = Math.min(stageRect.height - 40, Math.max(10, e.clientY - stageRect.top + 14));
        this.elements.devHoverTooltip.style.left = `${tooltipX}px`;
        this.elements.devHoverTooltip.style.top = `${tooltipY}px`;

        const tag = targetNode.tagName.toLowerCase();
        const idStr = targetNode.id ? `#${targetNode.id}` : '';
        const fill = targetNode.getAttribute('fill') || targetNode.style.fill || '';
        const stroke = targetNode.getAttribute('stroke') || targetNode.style.stroke || '';
        this.elements.devHoverTooltip.innerHTML = `<strong>&lt;${tag}${idStr}&gt;</strong> [${Math.round(bbox.width)}×${Math.round(bbox.height)}]${fill ? ' • fill:' + fill : ''}${stroke ? ' • strk:' + stroke : ''}`;
        this.elements.devHoverTooltip.classList.remove('hidden');
      } catch (_) {}
    }

    selectElement(node) {
      if (!node) return;
      this.selectedElement = node;
      this.selectedElementSelector = this.getSelectorForElement(node);

      this.playChime(660, 'triangle');
      this.refreshSelectBox();

      const el = this.elements;
      if (el.devInspectedTag) {
        el.devInspectedTag.textContent = `<${node.tagName.toLowerCase()}${node.id ? ' #' + node.id : ''}>`;
      }
      if (el.devInspectedSel) {
        el.devInspectedSel.textContent = this.selectedElementSelector;
      }

      let bbox = { x: 0, y: 0, width: 0, height: 0 };
      try {
        bbox = node.getBBox ? node.getBBox() : node.getBoundingClientRect();
      } catch (_) {}

      if (el.devPropXy) el.devPropXy.value = `x: ${Math.round(bbox.x)}, y: ${Math.round(bbox.y)}`;
      if (el.devPropWh) el.devPropWh.value = `w: ${Math.round(bbox.width)}, h: ${Math.round(bbox.height)}`;

      const curFill = node.getAttribute('fill') || node.style.fill || '#ffffff';
      const curStroke = node.getAttribute('stroke') || node.style.stroke || 'none';
      const curStrokeW = node.getAttribute('stroke-width') || node.style.strokeWidth || '1';
      const curOpacity = node.getAttribute('opacity') || node.style.opacity || '1';
      const curTransform = node.getAttribute('transform') || '';

      if (el.devPropFill) el.devPropFill.value = curFill;
      if (el.devColorFill) el.devColorFill.value = curFill.startsWith('#') && curFill.length === 7 ? curFill : '#38bdf8';

      if (el.devPropStroke) el.devPropStroke.value = curStroke;
      if (el.devColorStroke) el.devColorStroke.value = curStroke.startsWith('#') && curStroke.length === 7 ? curStroke : '#0284c7';

      if (el.devPropStrokew) el.devPropStrokew.value = curStrokeW;
      if (el.devRangeOpacity) el.devRangeOpacity.value = curOpacity;
      if (el.devValOpacity) el.devValOpacity.textContent = parseFloat(curOpacity).toFixed(2);
      if (el.devPropTransform) el.devPropTransform.value = curTransform;

      // Active AST bindings query
      if (el.devActiveBindings) {
        const rawBindings = (this.engine.scene && this.engine.scene.rawBindings) || [];
        const matched = rawBindings.filter(b => {
          if (!b.target) return false;
          if (node.id && b.target === `#${node.id}`) return true;
          return b.target === this.selectedElementSelector;
        });

        if (matched.length) {
          el.devActiveBindings.innerHTML = matched.map(m => `
            <div style="margin-bottom:4px; padding:3px 6px; background:#090d16; border-radius:4px; border:1px solid #1e293b;">
              <span style="color:#38bdf8; font-weight:700;">:${m.attr || m.type}</span>
              <span style="color:#94a3b8; font-size:10px;">${m.expr || '(3D projection)'}</span>
            </div>
          `).join('');
        } else {
          el.devActiveBindings.innerHTML = `<span style="color:#64748b;">No mathematical AST bindings attached.</span>`;
        }
      }

      if (el.devInspectorDrawer) {
        el.devInspectorDrawer.classList.remove('hidden');
      }

      this.engine.notifyParent({
        type: 'DEV_ELEMENT_SELECTED',
        selector: this.selectedElementSelector,
        tag: node.tagName.toLowerCase(),
        id: node.id || '',
        bbox: { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height },
        attributes: {
          fill: curFill,
          stroke: curStroke,
          strokeWidth: curStrokeW,
          opacity: curOpacity,
          transform: curTransform
        }
      });
    }

    refreshSelectBox() {
      if (!this.selectedElement || !this.elements.devSelectBox) return;
      try {
        const bbox = this.selectedElement.getBBox ? this.selectedElement.getBBox() : this.selectedElement.getBoundingClientRect();
        this.elements.devSelectBox.setAttribute('x', bbox.x);
        this.elements.devSelectBox.setAttribute('y', bbox.y);
        this.elements.devSelectBox.setAttribute('width', Math.max(4, bbox.width));
        this.elements.devSelectBox.setAttribute('height', Math.max(4, bbox.height));
        this.elements.devSelectBox.classList.remove('hidden');
      } catch (_) {}
    }

    closeInspectorDrawer() {
      if (this.elements.devInspectorDrawer) {
        this.elements.devInspectorDrawer.classList.add('hidden');
      }
      if (this.elements.devSelectBox) {
        this.elements.devSelectBox.classList.add('hidden');
      }
      this.selectedElement = null;
      this.selectedElementSelector = '';
    }

    getSelectorForElement(node) {
      if (node.id) return `#${node.id}`;
      let path = [];
      let cur = node;
      while (cur && cur.id !== 'scene-root' && cur.tagName.toLowerCase() !== 'svg') {
        let tag = cur.tagName.toLowerCase();
        if (cur.id) {
          path.unshift(`#${cur.id}`);
          break;
        } else {
          let siblingIndex = 1;
          let sib = cur.previousElementSibling;
          while (sib) {
            if (sib.tagName === cur.tagName) siblingIndex++;
            sib = sib.previousElementSibling;
          }
          path.unshift(`${tag}:nth-of-type(${siblingIndex})`);
        }
        cur = cur.parentElement;
      }
      return path.length ? path.join(' > ') : node.tagName.toLowerCase();
    }

    openDevStudio(tab = 'svg') {
      const el = this.elements;
      if (!el.devStudioDrawer) return;

      el.devStudioDrawer.classList.remove('hidden');
      if (el.btnDevStudio) el.btnDevStudio.classList.add('active');

      if (el.devEditorSvg) {
        el.devEditorSvg.value = this.engine.getStageSvgSnapshot();
      }
      if (el.devEditorAst) {
        el.devEditorAst.value = this.engine.getCurrentAstSource();
      }

      this.renderStarterTemplates();
      this.switchStudioTab(tab);
      this.showToast('💻 Live SVG & AST Code Studio Ready');
    }

    closeDevStudio() {
      if (this.elements.devStudioDrawer) {
        this.elements.devStudioDrawer.classList.add('hidden');
      }
      if (this.elements.btnDevStudio) {
        this.elements.btnDevStudio.classList.remove('active');
      }
    }

    toggleDevStudio() {
      if (this.elements.devStudioDrawer && !this.elements.devStudioDrawer.classList.contains('hidden')) {
        this.closeDevStudio();
      } else {
        this.openDevStudio('svg');
      }
    }

    switchStudioTab(tabName) {
      this.activeStudioTab = tabName;
      const el = this.elements;

      const tabBtns = document.querySelectorAll('.dev-tab-btn');
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
      });

      if (el.devEditorSvg) el.devEditorSvg.style.display = tabName === 'svg' ? 'block' : 'none';
      if (el.devEditorAst) el.devEditorAst.style.display = tabName === 'ast' ? 'block' : 'none';
      if (el.devTemplateTab) el.devTemplateTab.style.display = tabName === 'templates' ? 'grid' : 'none';
    }

    renderStarterTemplates() {
      const el = this.elements;
      if (!el.devTemplateTab) return;
      el.devTemplateTab.innerHTML = this.starterTemplates.map(tpl => `
        <div class="dev-template-card" data-template-id="${tpl.id}">
          <div class="dev-template-title">${tpl.title}</div>
          <div class="dev-template-desc">${tpl.desc}</div>
          <button type="button" class="dev-btn primary" style="margin-top:8px; width:100%; justify-content:center;">
            Load Starter ➜
          </button>
        </div>
      `).join('');

      el.devTemplateTab.querySelectorAll('.dev-template-card').forEach(card => {
        card.addEventListener('click', () => {
          const tplId = card.getAttribute('data-template-id');
          const tpl = this.starterTemplates.find(t => t.id === tplId);
          if (tpl) {
            if (el.devEditorSvg) el.devEditorSvg.value = tpl.svg;
            if (el.devEditorAst) el.devEditorAst.value = tpl.ast;
            this.engine.hotReloadSvg(tpl.svg);
            this.engine.hotReloadAst(tpl.ast);
            this.switchStudioTab('svg');
            this.playChime(784, 'triangle');
            this.showToast(`🚀 Loaded ${tpl.title}`);
          }
        });
      });
    }
  }

  global.ASTPlayerUI = ASTPlayerUI;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASTPlayerUI };
  }
})(typeof window !== 'undefined' ? window : globalThis);
