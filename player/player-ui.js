/**
 * static/player/player-ui.js
 * 
 * St Joseph's AST Vector Media Player — UI Controller
 * Copyright (c) 2026 Joseph Brewerton.
 * SPDX-License-Identifier: AGPL-3.0-or-later OR Commercial-License
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
        ambientTimeline: document.getElementById('ambient-timeline'),
        ambientTimelineFill: document.getElementById('ambient-timeline-fill'),
        ambientTimelineThumb: document.getElementById('ambient-timeline-thumb'),
        stagePlayIndicator: document.getElementById('stage-play-indicator'),
        timelineFill: document.getElementById('timeline-fill'),
        timelineThumb: document.getElementById('timeline-thumb'),
        timelineTrack: document.getElementById('timeline-track'),
        scrubberBox: document.getElementById('scrubber-box'),
        timeReadout: document.getElementById('time-readout'),
        btnPlay: document.getElementById('btn-play'),
        btnPrev: document.getElementById('btn-prev'),
        btnNext: document.getElementById('btn-next'),
        btnReset: document.getElementById('btn-reset'),
        btnLoop: document.getElementById('btn-loop'),
        loopLabel: document.getElementById('loop-label'),
        btnVolumeMute: document.getElementById('btn-volume-mute'),
        volumeSlider: document.getElementById('volume-slider'),
        volumeBox: document.getElementById('volume-box'),
        btnShortcuts: document.getElementById('btn-shortcuts'),
        shortcutsModal: document.getElementById('shortcuts-modal'),
        shortcutsClose: document.getElementById('shortcuts-close'),
        btnStepMode: document.getElementById('btn-step-mode'),
        slideDeckBar: document.getElementById('slide-deck-bar'),
        slideDeckPills: document.getElementById('slide-deck-pills'),
        btnNarrate: document.getElementById('btn-narrate'),
        btnVoiceCmd: document.getElementById('btn-voice-cmd'),
        voiceCmdOverlay: document.getElementById('voice-cmd-overlay'),
        voiceCmdText: document.getElementById('voice-cmd-text'),
        btnTheme: document.getElementById('btn-theme'),
        btnSuiteMode: document.getElementById('btn-suite-mode'),
        playerFooter: document.querySelector('footer'),
        btnPip: document.getElementById('btn-pip'),
        btnFullscreen: document.getElementById('btn-fullscreen'),
        btnPrint: document.getElementById('btn-print'),
        btnCopySvg: document.getElementById('btn-copy-svg'),
        btnPlayMode: document.getElementById('btn-play-mode'),
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
        btnStudioExportSpa: document.getElementById('btn-studio-export-spa'),
        btnHeaderExportSpa: document.getElementById('btn-header-export-spa'),
        devEditorSvg: document.getElementById('dev-editor-svg'),
        devEditorAst: document.getElementById('dev-editor-ast'),
        devTemplateTab: document.getElementById('dev-template-tab'),
        devCompilerTab: document.getElementById('dev-compiler-tab'),
        devQuizbuilderTab: document.getElementById('dev-quizbuilder-tab'),
        devEditorSlideScript: document.getElementById('dev-editor-slidescript'),
        btnDecompileAst: document.getElementById('btn-decompile-ast'),
        qbTime: document.getElementById('qb-time'),
        qbBtnCaptureTime: document.getElementById('qb-btn-capture-time'),
        qbTimeSeconds: document.getElementById('qb-time-seconds'),
        qbTitle: document.getElementById('qb-title'),
        qbPrompt: document.getElementById('qb-prompt'),
        qbExplanation: document.getElementById('qb-explanation'),
        qbBtnInsert: document.getElementById('qb-btn-insert'),
        qbExistingList: document.getElementById('qb-existing-list'),
        btnObsLink: document.getElementById('btn-obs-link'),
        obsStatusDot: document.getElementById('obs-status-dot'),
        obsDrawer: document.getElementById('obs-drawer'),
        obsDrawerBadge: document.getElementById('obs-drawer-badge'),
        obsDrawerClose: document.getElementById('obs-drawer-close'),
        obsInputUrl: document.getElementById('obs-input-url'),
        obsInputPassword: document.getElementById('obs-input-password'),
        btnObsConnect: document.getElementById('btn-obs-connect'),
        btnObsDisconnect: document.getElementById('btn-obs-disconnect'),
        obsToggleRecord: document.getElementById('obs-toggle-record'),
        obsToggleSubtitles: document.getElementById('obs-toggle-subtitles'),
        obsInputSource: document.getElementById('obs-input-source'),
        obsToggleTransparent: document.getElementById('obs-toggle-transparent'),
        obsLiveControls: document.getElementById('obs-live-controls'),
        obsSelectScene: document.getElementById('obs-select-scene'),
        btnObsRecordToggle: document.getElementById('btn-obs-record-toggle'),
        btnSettings: document.getElementById('btn-settings'),
        settingsLabel: document.getElementById('settings-label'),
        settingsDrawer: document.getElementById('settings-drawer'),
        settingsDrawerClose: document.getElementById('settings-drawer-close'),
        settingsBadge: document.getElementById('settings-badge'),
        btnResetConfig: document.getElementById('btn-reset-config'),
        modeCardClassroom: document.getElementById('mode-card-classroom'),
        modeCardStudent: document.getElementById('mode-card-student'),
        modeCardBroadcast: document.getElementById('mode-card-broadcast'),
        modeCardDeveloper: document.getElementById('mode-card-developer'),
        cfgCheckpoints: document.getElementById('cfg-checkpoints'),
        cfg3D: document.getElementById('cfg-3d'),
        cfgInspect: document.getElementById('cfg-inspect'),
        cfgStudio: document.getElementById('cfg-studio'),
        cfgExportSpa: document.getElementById('cfg-export-spa'),
        cfgPip: document.getElementById('cfg-pip'),
        cfgObs: document.getElementById('cfg-obs'),
        cfgPrint: document.getElementById('cfg-print'),
        cfgCopySvg: document.getElementById('cfg-copy-svg'),
        cfgVoice: document.getElementById('cfg-voice'),
        cfgSubtitles: document.getElementById('cfg-subtitles'),
        cfgScrubber: document.getElementById('cfg-scrubber'),
        cfgSpeed: document.getElementById('cfg-speed'),
        cfgLang: document.getElementById('cfg-lang'),
        cfgLoop: document.getElementById('cfg-loop'),
        cfgVolume: document.getElementById('cfg-volume'),
        cfgPhysics: document.getElementById('cfg-physics'),
        physicsConfigSection: document.getElementById('physics-config-section'),
        cfgPhysicsGravity: document.getElementById('cfg-physics-gravity'),
        cfgPhysicsBounce: document.getElementById('cfg-physics-bounce'),
        cfgPhysicsFriction: document.getElementById('cfg-physics-friction'),
        cfgValGravity: document.getElementById('cfg-val-gravity'),
        cfgValBounce: document.getElementById('cfg-val-bounce'),
        cfgValFriction: document.getElementById('cfg-val-friction'),
        btnPhysicsImpulse: document.getElementById('btn-physics-impulse'),
        btnPhysicsReset: document.getElementById('btn-physics-reset'),
      }, elements);

      this.isDragging = false;
      this.isOrbitDragging = false;
      this.theme = document.body.getAttribute('data-theme') || 'dark';
      this.interactiveMode = true;
      this.completedCheckpoints = new Set();
      this.activeCheckpoint = null;
      this.stepMode = false;
      this.targetStop = null;
      this.toastTimeout = null;
      this._orbitHintTimeout = null;
      this.displayConfig = this.initDisplayConfig();

      // Voice Command SpeechRecognition State
      this.isListeningVoice = false;
      this.recognition = null;
      this._voiceRestartTimeout = null;
      this._voiceFeedbackTimeout = null;

      // Developer Mode & SVG Inspector State
      this.devModeActive = false;
      this.selectedElement = null;
      this.selectedElementSelector = '';
      this.activeStudioTab = 'compiler';

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
        completedMissions: new Set(),
        tourRunId: 1
      };

      this.questMissions = [
        {
          id: 'narthex',
          targetT: 0.00,
          cam: { yaw: 0, pitch: 12, scale: 1.0 },
          title: 'Mission 1: The Narthex & Holy Water Stoup',
          desc: 'Find where Christians first enter the sacred space and bless themselves with Holy Water.',
          questionPool: [
            {
              question: 'Why do we bless ourselves with Holy Water upon entering the church?',
              options: [
                'To recall our Holy Baptism and bless ourselves in the Name of the Father, Son, and Holy Spirit',
                'To wash physical dust off our hands before entering',
                'As an ancient medieval heating custom'
              ],
              correct: 0,
              explanation: 'Blessing ourselves with Holy Water at the Narthex stoup reminds us of our Baptism, cleansing our thoughts as we enter God\'s holy house.'
            },
            {
              question: 'What is the primary spiritual purpose of the church Narthex (vestibule)?',
              options: [
                'To mark the sacred transition from the secular, busy outside world into the reverent presence of God',
                'To serve as an overflow cloakroom and umbrella store',
                'To act as an administrative office for parish accounting'
              ],
              correct: 0,
              explanation: 'The Narthex is the holy threshold where the pilgrim prepares their heart to transition from worldly distraction into divine contemplation.'
            }
          ]
        },
        {
          id: 'nave',
          targetT: 0.20,
          cam: { yaw: 0, pitch: 10, scale: 0.9 },
          title: 'Mission 2: The Nave Colonnade & Central Aisle',
          desc: 'Walk down the central aisle where the pilgrim people of God gather.',
          questionPool: [
            {
              question: 'Why do Catholics genuflect on the right knee toward the Tabernacle before entering the pew?',
              options: [
                'To adore Jesus Christ truly and bodily present in the Eucharist inside the Tabernacle',
                'To show formal etiquette to fellow parishioners',
                'To stretch after walking up the nave'
              ],
              correct: 0,
              explanation: 'Genuflection is a sacred posture of royal adoration before Christ our Lord truly present in the Blessed Sacrament.'
            },
            {
              question: 'What does the Latin root of the word "Nave" (navis, meaning ship) symbolize?',
              options: [
                'The Church as the Barque of St Peter carrying the faithful through the storms of life',
                'That historical stone basilicas were constructed exclusively by sailors',
                'The storage holds used for grain in ancient churches'
              ],
              correct: 0,
              explanation: 'The Nave represents the Ark or Barque of Peter—the Church journeying across earthly waves toward the eternal harbor of Heaven.'
            }
          ]
        },
        {
          id: 'ambo',
          targetT: 0.40,
          cam: { yaw: -22, pitch: 8, scale: 0.7 },
          title: 'Mission 3: The Ambo (Table of the Word)',
          desc: 'Locate the sacred pulpit from which Sacred Scripture is read.',
          questionPool: [
            {
              question: 'What sacred proclamation takes place at the Ambo?',
              options: [
                'The Holy Gospel and the Word of God for the Liturgy of the Word',
                'Parish social announcements and ticket sales only',
                'Rehearsals for the pipe organists'
              ],
              correct: 0,
              explanation: 'The Ambo is the Table of the Word, dignified and consecrated for the proclamation of Sacred Scripture and the Holy Gospel.'
            },
            {
              question: 'Why do the faithful stand and sing the Alleluia when the Gospel is proclaimed from the Ambo?',
              options: [
                'To give joyful reverence and honor to Christ Himself speaking directly in the Gospel',
                'Because the priest asks for a posture change to keep the congregation awake',
                'To signal that the liturgy is almost finished'
              ],
              correct: 0,
              explanation: 'We stand and sing Alleluia because in the Gospel reading, Christ is personally present and speaking His living words to us.'
            }
          ]
        },
        {
          id: 'altar',
          targetT: 0.60,
          cam: { yaw: 0, pitch: 8, scale: 0.65 },
          title: 'Mission 4: The High Altar of Sacrifice',
          desc: 'Examine the sacred focal center of the Catholic basilica.',
          questionPool: [
            {
              question: 'What does the High Altar represent and what occurs upon it?',
              options: [
                'It represents Christ Himself; upon it the Holy Sacrifice of the Mass is offered',
                'It is a dining table for parish council meetings',
                'It is purely an architectural stone decoration with no liturgical function'
              ],
              correct: 0,
              explanation: 'The altar is Christ! During Mass, bread and wine become Christ\'s real Body and Blood in the Holy Eucharist.'
            },
            {
              question: 'Why does the priest kiss the High Altar at the beginning and end of Mass?',
              options: [
                'To venerate Jesus Christ, whom the altar symbolizes, and the relics of the saints embedded within it',
                'Because Catholic rubrics require inspecting the altar cloth for dust',
                'To cue the cantor to cease singing the entrance hymn'
              ],
              correct: 0,
              explanation: 'Kissing the altar is an act of deep veneration to Christ Jesus, the Living Stone and Eternal High Priest.'
            }
          ]
        },
        {
          id: 'tabernacle',
          targetT: 0.80,
          cam: { yaw: 0, pitch: 6, scale: 0.5 },
          title: 'Mission 5: The Golden Tabernacle & Sanctuary Lamp',
          desc: 'Locate the golden ark in the apse and note the burning red lamp.',
          questionPool: [
            {
              question: 'Why does the red Sanctuary Lamp burn day and night beside the Tabernacle?',
              options: [
                'To indicate the Real Presence of Christ reserved in the Blessed Sacrament',
                'To provide emergency fire exit lighting in the dark',
                'To illuminate the priest\'s liturgical books in the sanctuary'
              ],
              correct: 0,
              explanation: 'The sanctuary lamp is an undying beacon signaling to all pilgrims that Christ is truly present in the Tabernacle.'
            },
            {
              question: 'What sacred vessel is used to hold the consecrated Hosts reserved inside the Tabernacle?',
              options: [
                'The Ciborium (a covered sacred chalice)',
                'The Cruet for water and wine',
                'The Thurible for incense burning'
              ],
              correct: 0,
              explanation: 'The Ciborium (from the Latin cibus meaning food) is the consecrated, covered golden vessel that holds the Holy Eucharist inside the Tabernacle.'
            }
          ]
        },
        {
          id: 'lady-and-font',
          targetT: 1.00,
          cam: { yaw: 22, pitch: 10, scale: 0.75 },
          title: 'Mission 6: The Lady Chapel & Baptismal Font',
          desc: 'Explore the devotional side chapel of Our Lady and the Baptismal Font.',
          questionPool: [
            {
              question: 'Which Sacrament of Initiation is received at the Baptismal Font?',
              options: [
                'Holy Baptism, which washes away original sin and welcomes us into God\'s family',
                'Holy Orders, consecrating priests and bishops',
                'Anointing of the Sick for bodily and spiritual healing'
              ],
              correct: 0,
              explanation: 'At the Baptismal Font, the holy waters of regeneration give new spiritual life in Christ, washing away original sin.'
            },
            {
              question: 'Why is a devotional side chapel dedicated to Our Lady (the Virgin Mary) present in Catholic churches?',
              options: [
                'To honor Mary as the Mother of God and ask for her maternal intercession',
                'To serve as a private waiting room for altar servers',
                'Strictly as a gallery for seasonal floral arrangements'
              ],
              correct: 0,
              explanation: 'Catholics honor Mary as the Queen of Heaven and Mother of the Church, lighting votive candles and seeking her maternal prayers.'
            }
          ]
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

          if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
            window.parent.postMessage({
              type: 'CHECKPOINT_ANSWERED',
              index,
              chosenIdx,
              isCorrect,
              prompt: checkpoint.prompt,
              answer: checkpoint.answer,
            }, '*');
          }

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

    triggerFirstCheckpoint() {
      const scene = this.engine && this.engine.scene;
      if (!scene || !scene.interactive || !Array.isArray(scene.interactive.checkpoints) || scene.interactive.checkpoints.length === 0) {
        this.showToast('ℹ️ No checkpoint quizzes found for this scene');
        return;
      }
      let targetIdx = 0;
      for (let i = 0; i < scene.interactive.checkpoints.length; i++) {
        if (!this.completedCheckpoints.has(i)) {
          targetIdx = i;
          break;
        }
      }
      const cp = scene.interactive.checkpoints[targetIdx];
      this.engine.seek(cp.t);
      this.triggerCheckpoint(cp, targetIdx);
    }

    checkInteractiveCheckpoints() {
      if (!this.interactiveMode || this.activeCheckpoint !== null) return;
      const scene = this.engine.scene;
      if (!scene || !scene.interactive || !Array.isArray(scene.interactive.checkpoints)) return;

      const curT = this.engine.progress;
      const prevT = this._lastCheckedT !== undefined ? this._lastCheckedT : curT;
      this._lastCheckedT = curT;

      // Rewind detection: allow re-taking checkpoints when seeking backwards
      if (curT < prevT - 0.05) {
        scene.interactive.checkpoints.forEach((cp, idx) => {
          if (cp.t > curT) this.completedCheckpoints.delete(idx);
        });
      }

      scene.interactive.checkpoints.forEach((cp, idx) => {
        if (!this.completedCheckpoints.has(idx)) {
          // If playback crossed checkpoint or is within 0.018 of trigger point
          const justCrossed = curT >= cp.t && prevT <= cp.t && (curT - prevT) < 0.15;
          const isNear = Math.abs(curT - cp.t) < 0.018;
          if (justCrossed || isNear) {
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
      this.initObsBroadcast();
      this.applyDisplayConfig(this.displayConfig);
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
      try {
        let list = [];

      // 1. Check for Federated Manifest URLs (?manifest=... or ?catalog=...)
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const federatedUrls = urlParams ? (urlParams.get('manifest') || urlParams.get('catalog')) : null;

      if (federatedUrls) {
        const urls = federatedUrls.split(',').map(u => u.trim()).filter(Boolean);
        for (const fedUrl of urls) {
          try {
            const fedRes = await fetch(fedUrl).catch(() => null);
            if (fedRes && fedRes.ok) {
              const fedData = await fedRes.json();
              if (fedData && Array.isArray(fedData.scenes)) {
                fedData.scenes.forEach(sc => {
                  sc._source = 'federated';
                  sc._originUrl = fedUrl;
                  list.push(sc);
                });
              }
            }
          } catch (e) {
            console.warn('[Player UI] Federated manifest load notice for:', fedUrl, e);
          }
        }
      }

      // 2. Dynamic Auto-Find & Manifest Ingestion (Zero-Reindexing)
      try {
        if (global.ASTSceneRegistry && typeof global.ASTSceneRegistry.autoDiscover === 'function') {
          const autoResult = await global.ASTSceneRegistry.autoDiscover(this.engine.options.basePath || './');
          if (autoResult && Array.isArray(autoResult.scenes)) {
            autoResult.scenes.forEach(sc => {
              if (sc && sc.id && !list.some(item => item.id === sc.id)) {
                sc._source = 'builtin';
                list.push(sc);
              }
            });
          }
        }
      } catch (err) {
        console.warn('[Player UI] Auto-discover fallback notice:', err);
      }

      // 3. Fallback to in-memory scene registry
      if (global.ASTSceneRegistry && typeof global.ASTSceneRegistry.list === 'function') {
        const regList = global.ASTSceneRegistry.list();
        regList.forEach(sc => {
          if (!list.some(item => item.id === sc.id)) {
            list.push({ ...sc, _source: 'builtin' });
          }
        });
      }

      // If active preset is not yet in the list, auto-mount it
      if (this.engine.activePresetId && !list.some(item => item.id === this.engine.activePresetId)) {
        list.push({
          id: this.engine.activePresetId,
          title: (this.engine.scene && this.engine.scene.title) || this.engine.activePresetId,
          stage: (this.engine.scene && this.engine.scene.stage) || 'CURRICULUM',
          _source: 'builtin'
        });
      }

      // 4. Ingest In-Browser Local Vault (offline user simulations)
      let vaultList = [];
      try {
        const rawVault = localStorage.getItem('ast_local_vault');
        if (rawVault) {
          const parsed = JSON.parse(rawVault);
          if (Array.isArray(parsed)) {
            vaultList = parsed.map(item => ({ ...item, _source: 'vault' }));
          }
        }
      } catch (e) {}

      if (!list.length && !vaultList.length) {
        list = [
          { id: this.engine.activePresetId || 'standalone-stage', title: 'Standalone Vector Stage', stage: 'SYSTEM', _source: 'builtin' }
        ];
      }

      const activeId = this.engine.activePresetId || 'church-tour';
      this.elements.presetSelector.innerHTML = '';

      // Create Local Vault OptGroup if items exist
      if (vaultList.length > 0) {
        const vaultGroup = document.createElement('optgroup');
        vaultGroup.label = '📦 In-Browser Vault (Offline)';
        vaultList.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.id;
          opt.textContent = `★ ${item.title || item.id} (${item.stage || 'VAULT'})`;
          if (item.id === activeId) opt.selected = true;
          vaultGroup.appendChild(opt);
        });
        this.elements.presetSelector.appendChild(vaultGroup);
      }

      // Create Federated OptGroup if items exist
      const fedItems = list.filter(item => item._source === 'federated');
      if (fedItems.length > 0) {
        const fedGroup = document.createElement('optgroup');
        fedGroup.label = '🌐 Federated Simulation Catalog';
        fedItems.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.id;
          opt.textContent = `${item.title} (${item.stage || 'FEDERATED'})`;
          if (item.id === activeId) opt.selected = true;
          fedGroup.appendChild(opt);
        });
        this.elements.presetSelector.appendChild(fedGroup);
      }

      // Built-in / Auto-Found Curriculum Groups categorized by 3 types: Sim, Slide, App
      const builtInItems = list.filter(item => item._source === 'builtin');
      
      const simItems = builtInItems.filter(item => {
        const t = (item.type || '').toLowerCase();
        if (t === 'sim') return true;
        if (t === 'slide' || t === 'app') return false;
        return !['phonics-lab', 'languages', 'fish-tank', 'church-tour', 'photosynthesis', 'water-cycle', 'dna-helix', 'shakespeare', 'fractions', 'times-tables', 'bodmas'].includes(item.id);
      });

      const slideItems = builtInItems.filter(item => {
        const t = (item.type || '').toLowerCase();
        if (t === 'slide') return true;
        if (t === 'sim' || t === 'app') return false;
        return ['church-tour', 'photosynthesis', 'water-cycle', 'dna-helix', 'shakespeare', 'fractions', 'times-tables', 'bodmas'].includes(item.id);
      });

      const appItems = builtInItems.filter(item => {
        const t = (item.type || '').toLowerCase();
        if (t === 'app') return true;
        if (t === 'sim' || t === 'slide') return false;
        return ['phonics-lab', 'languages', 'fish-tank'].includes(item.id);
      });

      const appendCategoryGroup = (label, color, items) => {
        if (!items || items.length === 0) return;
        const grp = document.createElement('optgroup');
        grp.label = label;
        grp.style.background = '#0f172a';
        grp.style.color = color;
        items.forEach(item => {
          const opt = document.createElement('option');
          opt.value = item.id;
          opt.textContent = `${item.title} (${item.stage})`;
          opt.style.background = '#0f172a';
          opt.style.color = '#f8fafc';
          if (item.id === activeId) opt.selected = true;
          grp.appendChild(opt);
        });
        this.elements.presetSelector.appendChild(grp);
      };

      appendCategoryGroup('🎮 Simulations (Sim)', '#38bdf8', simItems);
      appendCategoryGroup('📑 Interactive Slides (Slide)', '#34d399', slideItems);
      appendCategoryGroup('💻 Vector Applications (App)', '#fbbf24', appItems);

      // Teacher Auto-Find Actions
      const actionGroup = document.createElement('optgroup');
      actionGroup.label = '⚡ Dynamic Auto-Finder';
      actionGroup.style.background = '#0f172a';
      actionGroup.style.color = '#fbbf24';
      const optFind = document.createElement('option');
      optFind.value = '__custom_find__';
      optFind.textContent = '🔍 Open Any Scene by Name / ID...';
      optFind.style.background = '#0f172a';
      optFind.style.color = '#f8fafc';
      actionGroup.appendChild(optFind);

      const optOpen = document.createElement('option');
      optOpen.value = '__open_local__';
      optOpen.textContent = '📂 Open Local .ast or .svg File...';
      optOpen.style.background = '#0f172a';
      optOpen.style.color = '#f8fafc';
      actionGroup.appendChild(optOpen);
      this.elements.presetSelector.appendChild(actionGroup);

        // Explicitly sync the select value to the engine's active preset
        if (activeId) {
          this.elements.presetSelector.value = activeId;
        }
      } finally {
        this._isPopulating = false;
      }
    }

    /**
     * Saves a simulation to the user's permanent browser local vault
     */
    saveToLocalVault(sceneData) {
      if (!sceneData || !sceneData.id) return;
      try {
        let vault = [];
        const raw = localStorage.getItem('ast_local_vault');
        if (raw) vault = JSON.parse(raw) || [];
        // Replace existing or prepend
        const existingIdx = vault.findIndex(v => v.id === sceneData.id);
        const item = {
          id: sceneData.id,
          title: sceneData.title || sceneData.id,
          stage: sceneData.stage || 'LOCAL VAULT',
          savedAt: new Date().toISOString()
        };
        if (existingIdx >= 0) {
          vault[existingIdx] = item;
        } else {
          vault.unshift(item);
        }
        localStorage.setItem('ast_local_vault', JSON.stringify(vault.slice(0, 30)));
        this.showToast(`💾 Saved to Local Vault: ${item.title}`);
        this.populatePresets();
      } catch (e) {
        console.warn('[Player UI] Could not save to local vault:', e);
      }
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

      if (scene.interactive && Array.isArray(scene.interactive.checkpoints)) {
        scene.interactive.checkpoints.forEach((cp, idx) => {
          const marker = document.createElement('div');
          marker.className = 'keyframe-marker';
          marker.style.left = `${cp.t * 100}%`;
          marker.style.background = '#f59e0b';
          marker.style.width = '6px';
          marker.style.height = '12px';
          marker.title = `🎯 Checkpoint: ${cp.title}`;
          marker.addEventListener('click', (e) => {
            e.stopPropagation();
            this.engine.seek(cp.t);
            this.triggerCheckpoint(cp, idx);
          });
          this.elements.timelineTrack.appendChild(marker);
        });
      }

      // Populate interactive slide deck pills
      if (this.elements.slideDeckPills) {
        this.elements.slideDeckPills.innerHTML = '';
        const kfs = (scene && scene.keyframes) || [];
        kfs.forEach((kf, idx) => {
          const pill = document.createElement('button');
          pill.type = 'button';
          pill.className = 'slide-pill-btn';
          pill.setAttribute('data-slide-idx', String(idx));
          pill.setAttribute('data-slide-t', String(kf.t));
          pill.style.cssText = 'padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; background: rgba(30, 41, 59, 0.85); border: 1px solid rgba(255, 255, 255, 0.15); color: #cbd5e1; white-space: nowrap; cursor: pointer; transition: all 0.15s ease;';
          pill.textContent = `Slide ${idx + 1}: ${kf.title}`;
          pill.title = `${kf.title}: ${kf.rule} (Click to jump to this slide)`;
          pill.addEventListener('click', (e) => {
            e.stopPropagation();
            this.engine.seek(kf.t);
            this.onStopReached(kf.t);
          });
          this.elements.slideDeckPills.appendChild(pill);
        });
      }
    }

    updateView() {
      const scene = this.engine.scene;
      if (this.elements.badgeStage) {
        this.elements.badgeStage.textContent = scene.stage || 'CURRICULUM';
      }

      // Highlight active slide pill
      if (this.elements.slideDeckPills && scene && Array.isArray(scene.keyframes)) {
        const curT = this.engine.progress;
        let activeIdx = 0;
        scene.keyframes.forEach((kf, idx) => {
          if (kf.t <= curT + 0.02) activeIdx = idx;
        });
        const pills = this.elements.slideDeckPills.querySelectorAll('.slide-pill-btn');
        pills.forEach((p, idx) => {
          if (idx === activeIdx) {
            p.style.background = '#0284c7';
            p.style.borderColor = '#38bdf8';
            p.style.color = '#ffffff';
            p.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.5)';
          } else {
            p.style.background = 'rgba(30, 41, 59, 0.85)';
            p.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            p.style.color = '#cbd5e1';
            p.style.boxShadow = 'none';
          }
        });
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
          if (typeof sub === 'object' && sub !== null && sub.localized && sub.en) {
            this.elements.subtitleOverlay.innerHTML = `
              <div style="font-size: 0.95em; color: #f8fafc; font-weight: 700; line-height: 1.3;">${sub.en}</div>
              <div style="font-size: 0.84em; color: #38bdf8; font-weight: 600; line-height: 1.3; margin-top: 3px;">🌐 ${sub.localized}</div>
            `;
          } else {
            this.elements.subtitleOverlay.textContent = typeof sub === 'string' ? sub : (sub.localized || sub.en || '');
          }
          if (this.obs && this.obs.isConnected && this.obs.settings.syncSubtitles) {
            const obsText = typeof sub === 'object' && sub !== null ? `${sub.en}\n(${sub.localized})` : String(sub);
            if (obsText !== this._lastSentObsSubtitle) {
              this._lastSentObsSubtitle = obsText;
              this.obs.updateTextSource(this.obs.settings.subtitleSource, obsText);
            }
          }
        } else {
          this.elements.subtitleOverlay.style.opacity = '0.7';
          this.elements.subtitleOverlay.textContent = scene.title || 'AST Vector Media Player';
        }
      }

      // Ambient Hairline and Legacy Scrubber
      const pct = (this.engine.progress * 100).toFixed(1);
      if (this.elements.ambientTimelineFill) {
        this.elements.ambientTimelineFill.style.width = `${pct}%`;
      }
      if (this.elements.ambientTimelineThumb) {
        this.elements.ambientTimelineThumb.style.left = `${pct}%`;
      }
      if (this.elements.timelineFill) {
        this.elements.timelineFill.style.width = `${pct}%`;
      }
      if (this.elements.timelineThumb) {
        this.elements.timelineThumb.style.left = `${pct}%`;
      }
      if (this.elements.timeReadout) {
        const kfs = (scene && scene.keyframes) || [];
        if (kfs.length > 0) {
          const curT = this.engine.progress;
          let activeIdx = 0;
          kfs.forEach((kf, idx) => {
            if (kf.t <= curT + 0.02) activeIdx = idx;
          });
          const curKf = kfs[activeIdx];
          const cleanTitle = (curKf && curKf.title) ? curKf.title.replace(/^\d+[\.\s]*/, '') : 'Interactive Slide';
          this.elements.timeReadout.textContent = `Slide ${activeIdx + 1} of ${kfs.length}: ${cleanTitle}`;
        } else {
          this.elements.timeReadout.textContent = `Interactive Slide • 60 FPS`;
        }
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

    showPlayPauseRipple(isPlaying) {
      if (!this.elements.stagePlayIndicator) return;
      const ind = this.elements.stagePlayIndicator;
      ind.textContent = isPlaying ? '▶' : '⏸';
      ind.classList.remove('hidden');
      ind.classList.remove('animate-ripple');
      void ind.offsetWidth; // re-flow
      ind.classList.add('animate-ripple');
      setTimeout(() => {
        ind.classList.add('hidden');
        ind.classList.remove('animate-ripple');
      }, 650);
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

      // Ambient Hairline Timeline Scrubbing
      if (el.ambientTimeline) {
        const handleAmbientScrub = (e) => {
          const rect = el.ambientTimeline.getBoundingClientRect();
          const clientX = e.touches ? e.touches[0].clientX : e.clientX;
          const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
          const targetT = clickX / rect.width;
          this.engine.seek(targetT);
          this.updateView();
        };

        el.ambientTimeline.addEventListener('click', (e) => handleAmbientScrub(e));

        el.ambientTimeline.addEventListener('mousedown', (e) => {
          this.isDragging = true;
          handleAmbientScrub(e);
        });

        el.ambientTimeline.addEventListener('touchstart', (e) => {
          this.isDragging = true;
          handleAmbientScrub(e);
        }, { passive: true });
      }

      // PhET-Grade Touch Substrate: Touching the stage never pauses or halts the dynamic simulation.
      // Spacebar or in-graphics controls handle explicit physics clock pausing.

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

      // Standalone Drag & Drop File Handling (.json, .ast, .svg)
      const stageWrap = el.stageWrap || document.getElementById('stage-wrap') || el.stage;
      if (stageWrap) {
        stageWrap.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.stopPropagation();
          stageWrap.classList.add('drag-drop-active');
        });

        stageWrap.addEventListener('dragleave', (e) => {
          e.preventDefault();
          e.stopPropagation();
          stageWrap.classList.remove('drag-drop-active');
        });

        stageWrap.addEventListener('drop', (e) => {
          e.preventDefault();
          e.stopPropagation();
          stageWrap.classList.remove('drag-drop-active');
          if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            this.engine.loadFromFile(file, true).catch((err) => {
              this.showToast('❌ ' + err.message, 4500);
            });
          }
        });
      }

      // Native Open File Picker for Touch Screens & Smartboards
      const btnOpen = el.btnOpenFile || document.getElementById('btn-open-file');
      const fileInput = el.fileInputHidden || document.getElementById('file-input-hidden');
      if (btnOpen && fileInput) {
        btnOpen.addEventListener('click', () => {
          fileInput.click();
        });
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files.length) {
            const file = e.target.files[0];
            this.engine.loadFromFile(file, true).catch((err) => {
              this.showToast('❌ ' + err.message, 4500);
            });
            fileInput.value = '';
          }
        });
      }

      // Controls
      if (el.btnStepMode) {
        el.btnStepMode.addEventListener('click', () => {
          this.toggleStepMode();
        });
      }

      if (el.btnPlay) {
        el.btnPlay.addEventListener('click', () => {
          const playing = this.engine.togglePlay();
          el.btnPlay.textContent = playing ? '⏹ Stop Sim' : '▶ Resume Sim';
          el.btnPlay.classList.toggle('active', playing);
        });
      }

      if (el.btnPrev) {
        el.btnPrev.addEventListener('click', () => {
          const scene = this.engine && this.engine.scene;
          if (this.stepMode || (scene && scene.keyframes && scene.keyframes.length > 0)) {
            this.stepToPrevKeyframe();
          } else {
            this.engine.step(-0.05);
          }
        });
      }

      if (el.btnNext) {
        el.btnNext.addEventListener('click', () => {
          const scene = this.engine && this.engine.scene;
          if (this.stepMode || (scene && scene.keyframes && scene.keyframes.length > 0)) {
            this.stepToNextKeyframe();
          } else {
            this.engine.step(0.05);
          }
        });
      }

      if (el.btnReset) {
        el.btnReset.addEventListener('click', () => {
          this.targetStop = null;
          this.engine.resetVars();
          if (this.engine.physics) this.engine.physics.reset();
          this.engine.resetCamera();
          this.engine.seek(0);
          this.showToast('↺ Simulation Reset to Initial State');
        });
      }

      // Loop toggle button
      if (el.btnLoop) {
        el.btnLoop.classList.toggle('active', this.engine.loop);
        el.btnLoop.addEventListener('click', () => {
          const loop = this.engine.toggleLoop();
          el.btnLoop.classList.toggle('active', loop);
          if (el.loopLabel) el.loopLabel.textContent = loop ? 'Loop: ON' : 'Loop: OFF';
          this.showToast(loop ? '🔁 Auto-Repeat Loop: ON' : '🔁 Auto-Repeat Loop: OFF');
        });
      }

      // Master Audio Volume & Mute Controls
      if (el.volumeSlider) {
        el.volumeSlider.value = this.engine.volume;
        el.volumeSlider.addEventListener('input', (e) => {
          const vol = parseFloat(e.target.value);
          this.engine.setVolume(vol);
          if (el.btnVolumeMute) {
            el.btnVolumeMute.textContent = vol === 0 ? '🔇' : (vol < 0.5 ? '🔉' : '🔊');
          }
        });
      }

      if (el.btnVolumeMute) {
        el.btnVolumeMute.addEventListener('click', () => {
          const muted = this.engine.toggleMute();
          el.btnVolumeMute.textContent = muted ? '🔇' : (this.engine.volume < 0.5 ? '🔉' : '🔊');
          if (el.volumeSlider) {
            el.volumeSlider.value = muted ? 0 : this.engine.volume;
          }
          this.showToast(muted ? '🔇 Audio Muted' : `🔊 Audio: ${Math.round(this.engine.volume * 100)}%`);
        });
      }

      // Shortcuts Modal Handlers
      if (el.btnShortcuts) {
        el.btnShortcuts.addEventListener('click', () => {
          this.toggleShortcutsModal();
        });
      }

      if (el.shortcutsClose) {
        el.shortcutsClose.addEventListener('click', () => {
          this.closeShortcutsModal();
        });
      }

      // Micro-Physics Live Sliders
      if (el.cfgPhysicsGravity) {
        el.cfgPhysicsGravity.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          if (this.engine.physics) this.engine.physics.setGravity(val);
          if (el.cfgValGravity) el.cfgValGravity.textContent = `${(val / 100).toFixed(1)}g`;
        });
      }

      if (el.cfgPhysicsBounce) {
        el.cfgPhysicsBounce.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          if (this.engine.physics) this.engine.physics.setRestitution(val);
          if (el.cfgValBounce) el.cfgValBounce.textContent = `${Math.round(val * 100)}%`;
        });
      }

      if (el.cfgPhysicsFriction) {
        el.cfgPhysicsFriction.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          if (this.engine.physics) this.engine.physics.setFriction(val);
          if (el.cfgValFriction) el.cfgValFriction.textContent = `${(val * 100).toFixed(1)}%`;
        });
      }

      // Physics Environment Preset Buttons
      const physButtons = document.querySelectorAll('.phys-btn');
      physButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          physButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const grav = parseFloat(btn.getAttribute('data-gravity'));
          const bounce = parseFloat(btn.getAttribute('data-bounce'));
          const friction = parseFloat(btn.getAttribute('data-friction'));

          if (this.engine.physics) {
            this.engine.physics.setGravity(grav);
            this.engine.physics.setRestitution(bounce);
            this.engine.physics.setFriction(friction);
          }

          if (el.cfgPhysicsGravity) el.cfgPhysicsGravity.value = grav;
          if (el.cfgValGravity) el.cfgValGravity.textContent = `${(grav / 100).toFixed(1)}g`;
          if (el.cfgPhysicsBounce) el.cfgPhysicsBounce.value = bounce;
          if (el.cfgValBounce) el.cfgValBounce.textContent = `${Math.round(bounce * 100)}%`;
          if (el.cfgPhysicsFriction) el.cfgPhysicsFriction.value = friction;
          if (el.cfgValFriction) el.cfgValFriction.textContent = `${(friction * 100).toFixed(1)}%`;

          this.playChime(659.25, 'triangle');
          this.showToast(`🪐 Physics: ${btn.textContent.trim()} Active`);
        });
      });

      if (el.btnPhysicsImpulse) {
        el.btnPhysicsImpulse.addEventListener('click', () => {
          if (this.engine.physics) {
            for (const b of this.engine.physics.bodies) {
              this.engine.physics.applyImpulse(b.id, (Math.random() - 0.5) * 200, -500);
            }
            this.playChime(784, 'triangle');
            this.showToast('⚡ Jump Impulse Applied!');
          }
        });
      }

      if (el.btnPhysicsReset) {
        el.btnPhysicsReset.addEventListener('click', () => {
          if (this.engine.physics) {
            this.engine.physics.reset();
            this.playChime(523.25, 'sine');
            this.showToast('↺ Physics Coordinates Reset');
          }
        });
      }

      if (el.speedSelector) {
        el.speedSelector.addEventListener('change', (e) => {
          this.engine.setSpeed(e.target.value);
        });
      }

      if (el.presetSelector) {
        el.presetSelector.addEventListener('change', (e) => {
          const val = e.target.value;
          if (val === '__custom_find__') {
            const id = prompt('Enter scene filename or ID to auto-find (e.g. electric-circuits or your-new-file):');
            if (id && id.trim()) {
              this.engine.loadScene(id.trim(), true).then(loaded => {
                if (!loaded) {
                  this.showToast('❌ Scene "' + id.trim() + '" not found in ./scenes/', 3500);
                  el.presetSelector.value = this.engine.activePresetId || '';
                }
              });
            } else {
              el.presetSelector.value = this.engine.activePresetId || '';
            }
            return;
          }
          if (val === '__open_local__') {
            const fileInput = el.fileInputHidden || document.getElementById('file-input-hidden');
            if (fileInput) fileInput.click();
            el.presetSelector.value = this.engine.activePresetId || '';
            return;
          }
          if (val) {
            this.engine.setPreset(val, true);
            if (this.engine && typeof this.engine.notifyParent === 'function') {
              this.engine.notifyParent({
                type: 'PRESETCHANGE',
                preset: val,
                title: el.presetSelector.options[el.presetSelector.selectedIndex]?.textContent || val,
              });
            }
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

      if (el.btnVoiceCmd) {
        el.btnVoiceCmd.addEventListener('click', () => {
          this.toggleVoiceCommands();
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

      if (el.btnPip) {
        el.btnPip.addEventListener('click', () => {
          this.togglePictureInPicture();
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
          if (this.activeCheckpoint !== null) {
            this.closeInteractiveCard();
            return;
          }
          const scene = this.engine && this.engine.scene;
          if (scene && scene.interactive && Array.isArray(scene.interactive.checkpoints) && scene.interactive.checkpoints.length > 0) {
            this.triggerFirstCheckpoint();
          } else {
            this.interactiveMode = !this.interactiveMode;
            el.btnInteractive.classList.toggle('active', this.interactiveMode);
            this.showToast(this.interactiveMode ? '🎯 Interactive Mode: ON' : '🎯 Interactive Mode: OFF');
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

window.addEventListener('message', (e) => {
  const data = e.data;
  if (!data) return;

  if (data.type === 'SET_PRESET' && data.preset) {
    if (el.presetSelector && el.presetSelector.value !== data.preset) {
      el.presetSelector.value = data.preset;
    }
    if (this.engine) {
      this.engine.setPreset(data.preset, Boolean(data.play));
    }
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

      // Interactive Suite Mode Button (Zero-Chrome Edge-to-Edge Instrument)
      if (el.btnSuiteMode) {
        el.btnSuiteMode.addEventListener('click', () => {
          const isSuite = this.displayConfig && this.displayConfig.mode === 'suite';
          this.setDisplayMode(isSuite ? 'classroom' : 'suite');
        });
      }

      // Interactive Play Mode Button
      if (el.btnPlayMode) {
        el.btnPlayMode.addEventListener('click', () => {
          this.engine.pause();
          this.showToast('🎮 Interactive Play Mode Active');
          el.btnPlayMode.classList.toggle('active');
          this.engine.notifyParent({
            type: 'TOGGLE_PLAY_MODE',
            preset: this.engine.activePresetId,
            source: 'player-ui'
          });
          if (this.engine.activePresetId === 'church-tour') {
            this.startQuestMode();
          }
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
          if (this.activeStudioTab === 'compiler') {
            if (global.ASTSlideScriptCompiler && el.devEditorSlideScript) {
              const scriptText = el.devEditorSlideScript.value;
              const currentSvg = this.engine.getStageSvgSnapshot();
              const result = global.ASTSlideScriptCompiler.compile(scriptText, currentSvg);
              if (result.errors && result.errors.length > 0) {
                this.playChime(220, 'sawtooth');
                this.showToast('⚠️ Compiler Notice: ' + result.errors[0]);
                return;
              }

              if (el.devEditorSvg) el.devEditorSvg.value = result.svg;
              if (el.devEditorAst) el.devEditorAst.value = result.ast;

              this.engine.hotReloadSvg(result.svg);
              this.engine.hotReloadAst(result.ast);
              this.engine.seek(0.0);
              this.playChime(784, 'triangle');
              this.showToast('🚀 SlideScript Compiled & Playing Live!');
              return;
            }
          }

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

      if (el.btnDecompileAst) {
        el.btnDecompileAst.addEventListener('click', () => {
          if (global.ASTSlideScriptCompiler && this.engine.scene) {
            const script = global.ASTSlideScriptCompiler.toSlideScript(this.engine.scene);
            if (el.devEditorSlideScript) {
              el.devEditorSlideScript.value = script;
            }
            this.switchStudioTab('compiler');
            this.playChime(659.25, 'triangle');
            this.showToast('🔄 Scene Converted to Plain SlideScript');
          }
        });
      }

      // SlideScript Compiler Template Buttons
      const compilerTplBtns = document.querySelectorAll('.compiler-tpl-btn');
      compilerTplBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const tplKey = btn.getAttribute('data-tpl');
          if (global.ASTSlideScriptCompiler && global.ASTSlideScriptCompiler.TEMPLATES && global.ASTSlideScriptCompiler.TEMPLATES[tplKey]) {
            const tpl = global.ASTSlideScriptCompiler.TEMPLATES[tplKey];
            if (el.devEditorSlideScript) {
              el.devEditorSlideScript.value = tpl.script;
            }
            const res = global.ASTSlideScriptCompiler.compile(tpl.script);
            if (el.devEditorSvg) el.devEditorSvg.value = res.svg;
            if (el.devEditorAst) el.devEditorAst.value = res.ast;
            this.engine.hotReloadSvg(res.svg);
            this.engine.hotReloadAst(res.ast);
            this.engine.seek(0.0);
            this.playChime(784, 'triangle');
            this.showToast(`✨ Loaded & Compiled ${tpl.title}`);
          }
        });
      });

      // Visual Checkpoint Builder Time Capture
      if (el.qbBtnCaptureTime) {
        el.qbBtnCaptureTime.addEventListener('click', () => {
          const curP = Number(this.engine.progress.toFixed(2));
          if (el.qbTime) el.qbTime.value = curP;
          const dur = this.engine.durationSec || 10;
          if (el.qbTimeSeconds) el.qbTimeSeconds.textContent = `(= ${(curP * dur).toFixed(1)}s)`;
          this.showToast(`📍 Captured t=${curP}`);
        });
      }

      if (el.qbTime) {
        el.qbTime.addEventListener('input', () => {
          const curP = parseFloat(el.qbTime.value) || 0;
          const dur = this.engine.durationSec || 10;
          if (el.qbTimeSeconds) el.qbTimeSeconds.textContent = `(= ${(curP * dur).toFixed(1)}s)`;
        });
      }

      // Visual Checkpoint Builder Ingestion
      if (el.qbBtnInsert) {
        el.qbBtnInsert.addEventListener('click', () => {
          const tVal = parseFloat(el.qbTime ? el.qbTime.value : '0.5') || 0.5;
          const title = (el.qbTitle && el.qbTitle.value.trim()) || 'Concept Check';
          const prompt = (el.qbPrompt && el.qbPrompt.value.trim()) || '';
          if (!prompt) {
            this.showToast('⚠️ Please enter a question prompt');
            return;
          }

          const optInputs = [
            document.getElementById('qb-opt-0'),
            document.getElementById('qb-opt-1'),
            document.getElementById('qb-opt-2'),
            document.getElementById('qb-opt-3'),
          ];
          const options = optInputs.map(inp => inp ? inp.value.trim() : '').filter(Boolean);
          if (options.length < 2) {
            this.showToast('⚠️ Please enter at least 2 answer options');
            return;
          }

          const correctRadio = document.querySelector('input[name="qb-opt-correct"]:checked');
          const answerIdx = correctRadio ? parseInt(correctRadio.value, 10) : 0;
          const explanation = (el.qbExplanation && el.qbExplanation.value.trim()) || '';

          const newCp = {
            t: Math.min(1.0, Math.max(0.0, tVal)),
            title: title,
            prompt: prompt,
            options: options,
            answer: Math.min(options.length - 1, answerIdx),
            explanation: explanation
          };

          if (!this.engine.scene) this.engine.scene = {};
          if (!this.engine.scene.interactive) {
            this.engine.scene.interactive = { checkpoints: [], hotspots: [] };
          }
          if (!Array.isArray(this.engine.scene.interactive.checkpoints)) {
            this.engine.scene.interactive.checkpoints = [];
          }

          this.engine.scene.interactive.checkpoints.push(newCp);
          this.engine.scene.interactive.checkpoints.sort((a, b) => a.t - b.t);

          this.completedCheckpoints.delete(this.engine.scene.interactive.checkpoints.length - 1);
          this.renderQuizBuilderExistingList();
          this.playChime(784, 'triangle');
          this.showToast(`🎯 Injected Checkpoint at ${(newCp.t * 100).toFixed(0)}%!`);

          if (global.ASTSlideScriptCompiler && el.devEditorSlideScript) {
            el.devEditorSlideScript.value = global.ASTSlideScriptCompiler.toSlideScript(this.engine.scene);
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

      if (el.btnStudioExportSpa) {
        el.btnStudioExportSpa.addEventListener('click', () => {
          this.downloadStandaloneSvgApplet();
        });
      }

      if (el.btnHeaderExportSpa) {
        el.btnHeaderExportSpa.addEventListener('click', () => {
          this.downloadStandaloneSvgApplet();
        });
      }

      if (el.btnObsLink) {
        el.btnObsLink.addEventListener('click', () => {
          this.toggleObsDrawer();
        });
      }

      if (el.obsDrawerClose) {
        el.obsDrawerClose.addEventListener('click', () => {
          this.closeObsDrawer();
        });
      }

      if (el.btnObsConnect) {
        el.btnObsConnect.addEventListener('click', () => {
          if (!this.obs) return;
          const url = el.obsInputUrl ? el.obsInputUrl.value.trim() : 'ws://127.0.0.1:4455';
          const pass = el.obsInputPassword ? el.obsInputPassword.value : '';
          this.obs.saveSettings({ url, password: pass });
          this.obs.connect(url, pass);
        });
      }

      if (el.btnObsDisconnect) {
        el.btnObsDisconnect.addEventListener('click', () => {
          if (this.obs) this.obs.disconnect();
          this.updateObsStatusUI(false, false);
          this.showToast('OBS Disconnected');
        });
      }

      if (el.obsToggleRecord) {
        el.obsToggleRecord.addEventListener('change', (e) => {
          if (this.obs) this.obs.saveSettings({ syncRecording: e.target.checked });
        });
      }

      if (el.obsToggleSubtitles) {
        el.obsToggleSubtitles.addEventListener('change', (e) => {
          if (this.obs) this.obs.saveSettings({ syncSubtitles: e.target.checked });
        });
      }

      if (el.obsInputSource) {
        el.obsInputSource.addEventListener('change', (e) => {
          if (this.obs) this.obs.saveSettings({ subtitleSource: e.target.value.trim() });
        });
      }

      if (el.obsToggleTransparent) {
        el.obsToggleTransparent.addEventListener('change', (e) => {
          const isTransparent = e.target.checked;
          document.body.classList.toggle('obs-transparent', isTransparent);
          if (this.obs) this.obs.saveSettings({ transparent: isTransparent });
          this.showToast(isTransparent ? 'Transparent Backdrop (OBS Mode) Active' : 'Standard Backdrop Restored');
        });
      }

      if (el.obsSelectScene) {
        el.obsSelectScene.addEventListener('change', (e) => {
          if (this.obs && e.target.value) {
            this.obs.switchScene(e.target.value);
          }
        });
      }

      if (el.btnObsRecordToggle) {
        el.btnObsRecordToggle.addEventListener('click', () => {
          if (!this.obs) return;
          if (this.obs.isRecording) {
            this.obs.stopRecord();
          } else {
            this.obs.startRecord();
          }
        });
      }

      // Display & Controls Settings Drawer
      if (el.btnSettings) {
        el.btnSettings.addEventListener('click', () => {
          this.toggleSettingsDrawer();
        });
      }

      if (el.settingsDrawerClose) {
        el.settingsDrawerClose.addEventListener('click', () => {
          this.closeSettingsDrawer();
        });
      }

      if (el.btnResetConfig) {
        el.btnResetConfig.addEventListener('click', () => {
          this.setDisplayMode('classroom');
          this.showToast('Reset to Classroom Mode (Clean Whiteboard)');
        });
      }

      const modeCards = [
        { el: el.modeCardClassroom, mode: 'classroom' },
        { el: el.modeCardStudent, mode: 'student' },
        { el: el.modeCardBroadcast, mode: 'broadcast' },
        { el: el.modeCardDeveloper, mode: 'developer' },
      ];

      modeCards.forEach(({ el: cardEl, mode }) => {
        if (cardEl) {
          cardEl.addEventListener('click', () => {
            this.setDisplayMode(mode);
          });
        }
      });

      const configInputs = [
        { el: el.cfgCheckpoints, key: 'showInteractiveCheckpoints' },
        { el: el.cfg3D, key: 'show3DControls' },
        { el: el.cfgInspect, key: 'showDevInspect' },
        { el: el.cfgStudio, key: 'showDevStudio' },
        { el: el.cfgExportSpa, key: 'showExportSpa' },
        { el: el.cfgPip, key: 'showPipButton' },
        { el: el.cfgObs, key: 'showObsLink' },
        { el: el.cfgPrint, key: 'showPrintWorksheet' },
        { el: el.cfgCopySvg, key: 'showCopySvg' },
        { el: el.cfgVoice, key: 'showVoiceNarration' },
        { el: el.cfgSubtitles, key: 'showSubtitles' },
        { el: el.cfgScrubber, key: 'showTimelineScrubber' },
        { el: el.cfgSpeed, key: 'showSpeedSelector' },
        { el: el.cfgLang, key: 'showLanguageSelector' },
        { el: el.cfgLoop, key: 'showLoopToggle' },
        { el: el.cfgVolume, key: 'showVolumeControl' },
        { el: el.cfgPhysics, key: 'showPhysicsControls' },
      ];

      configInputs.forEach(({ el: inputEl, key }) => {
        if (inputEl) {
          inputEl.addEventListener('change', () => {
            this.displayConfig.mode = 'custom';
            this.displayConfig[key] = inputEl.checked;
            this.applyDisplayConfig(this.displayConfig);
            this.saveDisplayConfig(this.displayConfig);
          });
        }
      });

      // Keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
        if (e.code === 'Space') {
          e.preventDefault();
          if (this.stepMode) {
            this.stepToNextKeyframe();
          } else {
            if (el.btnPlay) el.btnPlay.click();
          }
        } else if (e.code === 'ArrowLeft' || e.code === 'PageUp') {
          e.preventDefault();
          const scene = this.engine && this.engine.scene;
          if (this.stepMode || (scene && scene.keyframes && scene.keyframes.length > 0)) {
            this.stepToPrevKeyframe();
          } else {
            this.engine.step(-0.05);
          }
        } else if (e.code === 'ArrowRight' || e.code === 'PageDown') {
          e.preventDefault();
          const scene = this.engine && this.engine.scene;
          if (this.stepMode || (scene && scene.keyframes && scene.keyframes.length > 0)) {
            this.stepToNextKeyframe();
          } else {
            this.engine.step(0.05);
          }
        } else if (e.code === 'KeyL' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (el.btnLoop) el.btnLoop.click();
        } else if (e.code === 'KeyM') {
          e.preventDefault();
          if (el.btnVolumeMute) {
            el.btnVolumeMute.click();
          } else if (el.btnNarrate) {
            el.btnNarrate.click();
          }
        } else if (e.code === 'KeyV' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.toggleVoiceCommands();
        } else if (e.code === 'KeyS' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.toggleStepMode();
        } else if (e.code === 'KeyF' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (el.btnFullscreen) el.btnFullscreen.click();
        } else if (e.code === 'KeyO' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (el.btn3DOrbit) el.btn3DOrbit.click();
        } else if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.engine.resetCamera();
          this.showToast('🌐 3D Camera Reset');
        } else if (e.code === 'KeyP' && e.shiftKey && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          this.togglePictureInPicture();
        } else if (e.code === 'KeyP' && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          if (el.btnPlayMode) el.btnPlayMode.click();
        } else if (e.code === 'Home' || e.code === 'Digit0' || e.code === 'Numpad0') {
          e.preventDefault();
          if (el.btnReset) el.btnReset.click();
        } else if (e.key === '?' || (e.code === 'Slash' && e.shiftKey)) {
          e.preventDefault();
          this.toggleShortcutsModal();
        } else if (e.code === 'KeyI' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          this.toggleDevMode();
        } else if (e.code === 'Escape') {
          if (this.elements.shortcutsModal && !this.elements.shortcutsModal.classList.contains('hidden')) {
            this.closeShortcutsModal();
          } else if (this.elements.settingsDrawer && !this.elements.settingsDrawer.classList.contains('hidden')) {
            this.closeSettingsDrawer();
          } else if (this.elements.devInspectorDrawer && !this.elements.devInspectorDrawer.classList.contains('hidden')) {
            this.closeInspectorDrawer();
          } else if (this.elements.devStudioDrawer && !this.elements.devStudioDrawer.classList.contains('hidden')) {
            this.closeDevStudio();
          } else if (this.elements.obsDrawer && !this.elements.obsDrawer.classList.contains('hidden')) {
            this.closeObsDrawer();
          }
        }
      });
    }

    initDisplayConfig() {
      const urlParams = new URLSearchParams(window.location.search);
      const urlMode = urlParams.get('mode');

      // 1. Check for dedicated embed / iframe flags
      const isEmbed = urlParams.get('embed') === '1' || urlParams.get('embed') === 'true' || urlParams.get('embedded') === '1' || urlParams.get('embedded') === 'true' || urlMode === 'embed' || urlMode === 'embedded' || urlMode === 'minimal' || (typeof window !== 'undefined' && window.self !== window.top && urlParams.get('standalone') !== '1');
      if (isEmbed) {
        if (typeof document !== 'undefined' && document.body) {
          document.body.classList.add('ast-embedded-mode');
        }
        const profile = this.getPresetProfile('embedded');
        if (urlParams.get('presetSelector') === '1') {
          profile.showPresetSelector = true;
        }
        if (urlParams.get('controls') === '0') {
          profile.showPlaybackControls = false;
          profile.showTimelineScrubber = false;
        }
        if (urlParams.get('scrubber') === '0') profile.showTimelineScrubber = false;
        if (urlParams.get('subtitles') === '0') profile.showSubtitles = false;
        return profile;
      }

      if (urlMode && ['suite', 'classroom', 'student', 'broadcast', 'developer', 'embed', 'embedded'].includes(urlMode)) {
        return this.getPresetProfile(urlMode);
      }
      if (urlParams.get('clean') === '1' || urlParams.get('suite') === '1') {
        return this.getPresetProfile('suite');
      }

      // Check if current active scene is an interactive simulation apparatus
      const activePreset = this.engine && (this.engine.activePresetId || this.engine.preset);
      const isInteractiveSimulation = ['solar-system', 'water-cycle', 'pythagoras', 'kinetic-gas', 'calculus-curves', 'electric-circuits', 'math-fishing'].includes(activePreset);

      try {
        const raw = localStorage.getItem('stj_player_display_config');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            const base = parsed.mode ? this.getPresetProfile(parsed.mode) : this.getPresetProfile(isInteractiveSimulation ? 'suite' : 'classroom');
            return Object.assign({}, base, parsed);
          }
        }
      } catch (err) {
        console.warn('[AST-PlayerUI] Error reading saved display config:', err);
      }

      return this.getPresetProfile(isInteractiveSimulation ? 'suite' : 'classroom');
    }

    getPresetProfile(mode) {
      const base = {
        mode: mode || 'classroom',
        showPresetSelector: true,
        showStageBadge: true,
        showInteractiveCheckpoints: true,
        show3DControls: true,
        showDevInspect: false,
        showDevStudio: false,
        showExportSpa: false,
        showStandaloneLink: true,
        showObsLink: false,
        showLmsEmbed: false,
        showPrintWorksheet: true,
        showCopySvg: false,
        showThemeToggle: true,
        showFullscreen: true,
        showTimelineScrubber: true,
        showPlaybackControls: true,
        showSpeedSelector: true,
        showVoiceNarration: true,
        showVoiceCommands: true,
        showLanguageSelector: true,
        showSubtitles: true,
        showLoopToggle: true,
        showVolumeControl: true,
        showPhysicsControls: true,
      };

      if (mode === 'suite' || mode === 'interactive-suite') {
        base.mode = 'suite';
        base.showTimelineScrubber = false;
        base.showPlaybackControls = false;
        base.showSpeedSelector = false;
        base.showSubtitles = false;
        base.showLoopToggle = false;
        base.showVolumeControl = false;
        base.showVoiceCommands = false;
        base.showPhysicsControls = false;
      } else if (mode === 'embed' || mode === 'embedded' || mode === 'minimal') {
        base.mode = 'embedded';
        base.showPresetSelector = false; // Hide inner preset selector in embedded mode to eliminate multiple menus
        base.showStageBadge = false;
        base.showPrintWorksheet = false;
        base.showStandaloneLink = false;
        base.showDevInspect = false;
        base.showDevStudio = false;
        base.showExportSpa = false;
        base.showObsLink = false;
        base.showLmsEmbed = false;
        base.showCopySvg = false;
        base.showSpeedSelector = false;
        base.showVoiceCommands = false;
        base.showPhysicsControls = false;
      } else if (mode === 'student') {
        base.showPrintWorksheet = false;
        base.showStandaloneLink = false;
      } else if (mode === 'broadcast') {
        base.showObsLink = true;
        base.showPrintWorksheet = false;
      } else if (mode === 'developer') {
        base.showDevInspect = true;
        base.showDevStudio = true;
        base.showExportSpa = true;
        base.showObsLink = true;
        base.showLmsEmbed = true;
        base.showCopySvg = true;
      }

      return base;
    }

    setDisplayMode(mode) {
      this.displayConfig = this.getPresetProfile(mode);
      this.saveDisplayConfig(this.displayConfig);
      this.applyDisplayConfig(this.displayConfig);
      this.showToast(`Switched to ${mode.toUpperCase()} Mode`);
    }

    saveDisplayConfig(config) {
      try {
        localStorage.setItem('stj_player_display_config', JSON.stringify(config));
      } catch (e) {}
    }

    applyDisplayConfig(config) {
      if (!config || typeof config !== 'object') return;
      this.displayConfig = Object.assign({}, this.displayConfig, config);
      const c = this.displayConfig;
      const el = this.elements;

      // Top action buttons
      if (el.presetSelector) el.presetSelector.style.display = c.showPresetSelector !== false ? '' : 'none';
      if (el.badgeStage) el.badgeStage.style.display = c.showStageBadge !== false ? '' : 'none';
      if (el.btnInteractive) el.btnInteractive.style.display = c.showInteractiveCheckpoints !== false ? '' : 'none';
      
      if (el.btn3DOrbit) {
        if (c.show3DControls === false) {
          el.btn3DOrbit.classList.add('hidden');
        } else if (this.engine && this.engine.has3D()) {
          el.btn3DOrbit.classList.remove('hidden');
        }
      }

      if (el.cameraControlsBar) {
        if (c.show3DControls === false) {
          el.cameraControlsBar.classList.add('hidden');
          el.cameraControlsBar.style.display = 'none';
        } else if (this.engine && this.engine.has3D()) {
          el.cameraControlsBar.classList.remove('hidden');
          el.cameraControlsBar.style.display = 'flex';
        }
      }

      if (el.btnDevMode) el.btnDevMode.style.display = c.showDevInspect ? '' : 'none';
      if (el.btnDevStudio) el.btnDevStudio.style.display = c.showDevStudio ? '' : 'none';
      if (el.btnHeaderExportSpa) el.btnHeaderExportSpa.style.display = c.showExportSpa ? '' : 'none';
      if (el.btnObsLink) el.btnObsLink.style.display = c.showObsLink ? '' : 'none';
      if (el.btnPrint) el.btnPrint.style.display = c.showPrintWorksheet !== false ? '' : 'none';
      if (el.btnCopySvg) el.btnCopySvg.style.display = c.showCopySvg ? '' : 'none';
      if (el.btnTheme) el.btnTheme.style.display = c.showThemeToggle !== false ? '' : 'none';
      if (el.btnPip) el.btnPip.style.display = c.showPipButton !== false ? '' : 'none';
      if (el.btnFullscreen) el.btnFullscreen.style.display = c.showFullscreen !== false ? '' : 'none';

      // Bottom playback bar & overlays
      const isSuite = c.mode === 'suite' || (!c.showTimelineScrubber && !c.showPlaybackControls);
      if (isSuite) {
        document.body.classList.add('interactive-suite-mode');
        if (el.playerFooter) el.playerFooter.style.display = 'none';
        if (el.btnSuiteMode) el.btnSuiteMode.classList.add('active');
      } else {
        document.body.classList.remove('interactive-suite-mode');
        if (el.playerFooter) el.playerFooter.style.display = '';
        if (el.btnSuiteMode) el.btnSuiteMode.classList.remove('active');
      }

      if (el.scrubberBox) el.scrubberBox.style.display = c.showTimelineScrubber !== false ? '' : 'none';
      if (el.btnPlay) el.btnPlay.style.display = c.showPlaybackControls !== false ? '' : 'none';
      if (el.btnPrev) el.btnPrev.style.display = c.showPlaybackControls !== false ? '' : 'none';
      if (el.btnNext) el.btnNext.style.display = c.showPlaybackControls !== false ? '' : 'none';
      if (el.btnReset) el.btnReset.style.display = c.showPlaybackControls !== false ? '' : 'none';
      if (el.timeReadout) el.timeReadout.style.display = c.showPlaybackControls !== false ? '' : 'none';
      if (el.speedSelector) el.speedSelector.style.display = c.showSpeedSelector !== false ? '' : 'none';
      if (el.btnNarrate) el.btnNarrate.style.display = c.showVoiceNarration !== false ? '' : 'none';
      if (el.btnVoiceCmd) el.btnVoiceCmd.style.display = c.showVoiceCommands !== false ? '' : 'none';
      if (el.langSelector) el.langSelector.style.display = c.showLanguageSelector !== false ? '' : 'none';
      if (el.subtitleOverlay) el.subtitleOverlay.style.display = c.showSubtitles !== false ? '' : 'none';
      if (el.btnLoop) el.btnLoop.style.display = c.showLoopToggle !== false ? '' : 'none';
      if (el.volumeBox) el.volumeBox.style.display = c.showVolumeControl !== false ? 'flex' : 'none';
      if (el.physicsConfigSection) el.physicsConfigSection.style.display = c.showPhysicsControls !== false ? 'block' : 'none';

      this.syncSettingsDrawerUI();

      // Notify parent wrapper of active configuration
      if (this.engine && typeof this.engine.notifyParent === 'function') {
        this.engine.notifyParent({
          type: 'DISPLAY_CONFIG_CHANGED',
          config: this.displayConfig
        });
      }
    }

    toggleShortcutsModal() {
      if (!this.elements.shortcutsModal) return;
      this.elements.shortcutsModal.classList.toggle('hidden');
    }

    closeShortcutsModal() {
      if (!this.elements.shortcutsModal) return;
      this.elements.shortcutsModal.classList.add('hidden');
    }

    syncSettingsDrawerUI() {
      const c = this.displayConfig;
      const el = this.elements;
      if (!c) return;

      const mode = c.mode || 'classroom';
      if (el.settingsBadge) {
        el.settingsBadge.textContent = mode.toUpperCase();
      }

      if (el.settingsLabel) {
        const modeIcons = { classroom: '🎓 Classroom', student: '🎒 Student', broadcast: '📡 Broadcast', developer: '🛠️ Dev', custom: '🎛️ Custom' };
        el.settingsLabel.textContent = modeIcons[mode] || 'Settings';
      }

      const cards = [
        { el: el.modeCardClassroom, mode: 'classroom' },
        { el: el.modeCardStudent, mode: 'student' },
        { el: el.modeCardBroadcast, mode: 'broadcast' },
        { el: el.modeCardDeveloper, mode: 'developer' },
      ];

      cards.forEach(({ el: cardEl, mode: m }) => {
        if (cardEl) cardEl.classList.toggle('active', mode === m);
      });

      const inputs = [
        { el: el.cfgCheckpoints, val: c.showInteractiveCheckpoints },
        { el: el.cfg3D, val: c.show3DControls },
        { el: el.cfgInspect, val: c.showDevInspect },
        { el: el.cfgStudio, val: c.showDevStudio },
        { el: el.cfgExportSpa, val: c.showExportSpa },
        { el: el.cfgPip, val: c.showPipButton !== false },
        { el: el.cfgObs, val: c.showObsLink },
        { el: el.cfgPrint, val: c.showPrintWorksheet },
        { el: el.cfgCopySvg, val: c.showCopySvg },
        { el: el.cfgVoice, val: c.showVoiceNarration },
        { el: el.cfgSubtitles, val: c.showSubtitles },
        { el: el.cfgScrubber, val: c.showTimelineScrubber },
        { el: el.cfgSpeed, val: c.showSpeedSelector },
        { el: el.cfgLang, val: c.showLanguageSelector },
      ];

      inputs.forEach(({ el: inp, val }) => {
        if (inp) inp.checked = Boolean(val);
      });
    }

    toggleSettingsDrawer(force) {
      if (!this.elements.settingsDrawer) return;
      const willOpen = force !== undefined ? Boolean(force) : this.elements.settingsDrawer.classList.contains('hidden');
      if (willOpen) {
        this.closeDevStudio();
        this.closeInspectorDrawer();
        this.closeObsDrawer();
        this.elements.settingsDrawer.classList.remove('hidden');
        this.syncSettingsDrawerUI();
      } else {
        this.elements.settingsDrawer.classList.add('hidden');
      }
    }

    closeSettingsDrawer() {
      this.toggleSettingsDrawer(false);
    }

    async togglePictureInPicture() {
      // 1. Notify parent iframe container (React wrapper) if embedded
      if (window.parent && window.parent !== window) {
        if (this.engine && typeof this.engine.notifyParent === 'function') {
          this.engine.notifyParent({
            type: 'TOGGLE_PIP',
            preset: this.engine.activePresetId,
            progress: this.engine.progress,
            isPlaying: this.engine.isPlaying
          });
        }
      }

      // 2. Direct Document Picture-in-Picture API support (Chrome 116+, Edge, Opera)
      if ('documentPictureInPicture' in window && typeof window.documentPictureInPicture.requestWindow === 'function') {
        if (this.pipWindow) {
          try {
            this.pipWindow.close();
          } catch (_) {}
          this.pipWindow = null;
          this.showToast('📺 Picture-in-Picture Closed');
          return;
        }

        try {
          const pip = await window.documentPictureInPicture.requestWindow({
            width: 680,
            height: 480
          });
          this.pipWindow = pip;

          // Copy stylesheets into PiP window
          [...document.styleSheets].forEach((sheet) => {
            try {
              if (sheet.href) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = sheet.href;
                pip.document.head.appendChild(link);
              } else if (sheet.cssRules) {
                const style = document.createElement('style');
                [...sheet.cssRules].forEach((rule) => {
                  style.appendChild(document.createTextNode(rule.cssText));
                });
                pip.document.head.appendChild(style);
              }
            } catch (_) {
              if (sheet.href) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = sheet.href;
                pip.document.head.appendChild(link);
              }
            }
          });

          pip.document.title = `📺 ${document.title || 'AST Vector Player'} (PiP)`;
          pip.document.body.style.margin = '0';
          pip.document.body.style.padding = '0';
          pip.document.body.style.background = '#090d16';
          pip.document.body.style.overflow = 'hidden';

          const appContainer = document.getElementById('ast-player-container') || document.body.firstElementChild;
          if (appContainer && appContainer.parentNode) {
            const originalParent = appContainer.parentNode;
            const placeholder = document.createElement('div');
            placeholder.style.display = 'flex';
            placeholder.style.flexDirection = 'column';
            placeholder.style.alignItems = 'center';
            placeholder.style.justifyContent = 'center';
            placeholder.style.height = '100vh';
            placeholder.style.background = '#090d16';
            placeholder.style.color = '#fff';
            placeholder.style.textAlign = 'center';
            placeholder.style.padding = '20px';
            placeholder.innerHTML = `
              <div style="font-size:3rem; margin-bottom:12px;">📺</div>
              <h3 style="margin:0 0 8px 0; font-size:1.2rem;">Floating in Picture-in-Picture</h3>
              <p style="margin:0 0 16px 0; font-size:0.85rem; color:#94a3b8;">Stage is active in an always-on-top desktop window</p>
              <button id="pip-return-btn" style="padding:8px 18px; border-radius:9999px; background:#6366f1; color:#fff; border:none; font-weight:700; cursor:pointer;">↩ Return to Page</button>
            `;

            originalParent.insertBefore(placeholder, appContainer);
            pip.document.body.appendChild(appContainer);

            placeholder.querySelector('#pip-return-btn')?.addEventListener('click', () => {
              pip.close();
            });

            pip.addEventListener('pagehide', () => {
              originalParent.insertBefore(appContainer, placeholder);
              placeholder.remove();
              this.pipWindow = null;
              this.showToast('📺 Restored from Picture-in-Picture');
            });
          }

          this.showToast('📺 Always-on-Top PiP Window Opened');
          return;
        } catch (err) {
          console.warn('Document Picture-in-Picture request:', err);
        }
      }

      this.showToast('📺 Picture-in-Picture Toggled');
    }

    bindEngineEvents() {
      // Synchronize initial play button state immediately with the engine's real current state
      if (this.elements.btnPlay) {
        this.elements.btnPlay.textContent = this.engine.isPlaying ? '⏸ Pause Sim' : '▶ Resume Sim';
        this.elements.btnPlay.classList.toggle('active', Boolean(this.engine.isPlaying));
      }

      this.engine.on('timeupdate', () => {
        this.updateView();
        this.checkInteractiveCheckpoints();

        // If stepping towards a target stop in Step Mode, stop when reached
        if (this.targetStop !== null && this.engine.progress >= this.targetStop - 0.008) {
          const reached = this.targetStop;
          this.targetStop = null;
          this.engine.seek(reached);
          this.engine.pause();
          if (this.elements.btnPlay) {
            this.elements.btnPlay.textContent = '▶ Resume Sim';
            this.elements.btnPlay.classList.remove('active');
          }
          this.onStopReached(reached);
        }

        // If looped back to start, allow checkpoints to be answered again
        if (this.engine.progress < 0.05 && this.completedCheckpoints.size > 0) {
          this.completedCheckpoints.clear();
        }
      });

      this.engine.on('statechange', (data) => {
        if (this.elements.btnPlay) {
          this.elements.btnPlay.textContent = data.isPlaying ? '⏹ Stop Sim' : '▶ Resume Sim';
          this.elements.btnPlay.classList.toggle('active', data.isPlaying);
        }
        if (this.obs && this.obs.isConnected && this.obs.settings.syncRecording) {
          if (data.isPlaying) {
            this.obs.startRecord();
          } else {
            this.obs.stopRecord();
          }
        }
      });

      this.engine.on('keyframe', (kf) => {
        if (this.obs && this.obs.isConnected) {
          this.obs.bookmarkChapter(kf.title, this.engine.progress);
          if (this.obs.settings.syncScenes && kf.sceneName) {
            this.obs.switchScene(kf.sceneName);
          }
        }
      });

      this.engine.on('camerachange', () => {
        this.update3DStatus();
      });

      this.engine.on('error', (err) => {
        const msg = (err && (err.message || err.type)) || 'An asset error occurred';
        this.showToast('⚠️ ' + msg, 4000);
      });

      this.engine.on('fileloaded', (info) => {
        this.showToast(`📂 File Loaded: ${info.filename}`, 3000);
        if (this.elements.presetSelector) {
          let exists = false;
          for (let i = 0; i < this.elements.presetSelector.options.length; i++) {
            if (this.elements.presetSelector.options[i].value === info.id) {
              exists = true;
              break;
            }
          }
          if (!exists) {
            const opt = document.createElement('option');
            opt.value = info.id;
            opt.textContent = `📁 ${info.filename}`;
            this.elements.presetSelector.appendChild(opt);
          }
          this.elements.presetSelector.value = info.id;
        }
      });

      this.engine.on('presetchange', (data) => {
        if (this.elements.presetSelector) {
          let found = false;
          for (let i = 0; i < this.elements.presetSelector.options.length; i++) {
            if (this.elements.presetSelector.options[i].value === data.preset) {
              found = true;
              break;
            }
          }
          if (!found) {
            const opt = document.createElement('option');
            opt.value = data.preset;
            opt.textContent = `★ ${data.title || data.preset} (${data.stage || 'AUTO-FOUND'})`;
            this.elements.presetSelector.appendChild(opt);
          }
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

    // --- Step-by-Step Didactic Mode & Clicker Navigation Methods ---

    toggleStepMode(force) {
      this.stepMode = force !== undefined ? Boolean(force) : !this.stepMode;
      if (this.elements.btnStepMode) {
        this.elements.btnStepMode.classList.toggle('active', this.stepMode);
      }
      if (this.stepMode) {
        this.targetStop = null;
        this.engine.pause();
        if (this.elements.btnPlay) {
          this.elements.btnPlay.textContent = '▶ Play';
          this.elements.btnPlay.classList.remove('active');
        }
        this.playChime(659.25, 'triangle');
        this.showToast('👣 Clicker / Step Mode ON (Space / Next / Clicker)');
      } else {
        this.targetStop = null;
        this.showToast('▶ Continuous Playback Mode');
      }
    }

    getLessonStops() {
      const scene = this.engine.scene;
      if (!scene) return [0, 1];
      const set = new Set([0]);
      if (Array.isArray(scene.keyframes)) {
        scene.keyframes.forEach(kf => set.add(Number(kf.t.toFixed(3))));
      }
      if (scene.interactive && Array.isArray(scene.interactive.checkpoints)) {
        scene.interactive.checkpoints.forEach(cp => set.add(Number(cp.t.toFixed(3))));
      }
      set.add(1.0);
      return Array.from(set).sort((a, b) => a - b);
    }

    stepToNextKeyframe() {
      const stops = this.getLessonStops();
      const curT = this.engine.progress;
      const nextStop = stops.find(s => s > curT + 0.015);
      if (nextStop !== undefined) {
        this.targetStop = null;
        this.engine.pause();
        this.engine.seek(nextStop);
        this.onStopReached(nextStop);
        if (this.elements.btnPlay) {
          this.elements.btnPlay.textContent = '▶ Play';
          this.elements.btnPlay.classList.remove('active');
        }
      } else {
        this.showToast('🏁 End of Lesson Slides');
      }
    }

    stepToPrevKeyframe() {
      const stops = this.getLessonStops();
      const curT = this.engine.progress;
      const prevStops = stops.filter(s => s < curT - 0.02);
      this.targetStop = null;
      this.engine.pause();
      if (this.elements.btnPlay) {
        this.elements.btnPlay.textContent = '▶ Play';
        this.elements.btnPlay.classList.remove('active');
      }
      if (prevStops.length > 0) {
        const prevStop = prevStops[prevStops.length - 1];
        this.engine.seek(prevStop);
        this.onStopReached(prevStop);
      } else {
        this.engine.seek(0);
        this.onStopReached(0);
      }
    }

    onStopReached(t) {
      const scene = this.engine.scene;
      if (!scene) return;
      const kf = (scene.keyframes || []).find(k => Math.abs(k.t - t) < 0.035);
      const cp = (scene.interactive && scene.interactive.checkpoints || []).find(c => Math.abs(c.t - t) < 0.035);

      this.playChime(784, 'triangle');
      if (cp) {
        this.showToast(`🎯 Challenge: ${cp.title}`);
      } else if (kf) {
        this.showToast(`📍 ${kf.title}`);
      } else {
        this.showToast(`Step at ${Math.round(t * 100)}%`);
      }
    }

    startQuestMode() {
      if (!this.elements.questDrawer) return;
      this.questState.active = true;
      this.questState.tourRunId = (this.questState.tourRunId || 1) + 1;
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
            this.questState.tourRunId = (this.questState.tourRunId || 1) + 1;
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

      // Pick question from pool and shuffle options dynamically for current tour run
      if (!m.activeQuestion || m._lastTourRunId !== this.questState.tourRunId) {
        const pool = m.questionPool || [{
          question: m.question,
          options: m.options,
          correct: m.correct,
          explanation: m.explanation
        }];
        const selected = pool[Math.floor(Math.random() * pool.length)];

        // Shuffle options so correct answer is NOT always in the same position
        const correctText = selected.options[selected.correct];
        const shuffledOpts = [...selected.options];
        for (let i = shuffledOpts.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledOpts[i], shuffledOpts[j]] = [shuffledOpts[j], shuffledOpts[i]];
        }
        const newCorrect = shuffledOpts.indexOf(correctText);

        m.activeQuestion = {
          id: m.id,
          question: selected.question,
          options: shuffledOpts,
          correct: newCorrect,
          explanation: selected.explanation
        };
        m._lastTourRunId = this.questState.tourRunId;
      }

      const q = m.activeQuestion;

      let html = `
        <div class="quest-mission-title">${m.title}</div>
        <div class="quest-mission-desc">${m.desc}</div>
        <div style="font-weight: 700; font-size: 12px; color: #f8fafc; margin-bottom: 6px;">${q.question}</div>
        <div class="quest-options-grid">
      `;

      q.options.forEach((opt, optIdx) => {
        html += `<button type="button" class="quest-option-btn" data-opt="${optIdx}">${opt}</button>`;
      });

      html += `</div>`;
      this.elements.questBody.innerHTML = html;

      const optionBtns = this.elements.questBody.querySelectorAll('.quest-option-btn');
      optionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const optIdx = parseInt(e.currentTarget.getAttribute('data-opt'), 10);
          this.checkMissionAnswer(m, q, optIdx, optionBtns);
        });
      });
    }

    checkMissionAnswer(mission, activeQ, selectedIdx, optionBtns) {
      const isCorrect = selectedIdx === activeQ.correct;
      optionBtns.forEach((btn, i) => {
        btn.disabled = true;
        if (i === activeQ.correct) {
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
        <div style="color: #e2e8f0; margin-bottom: 8px;">${activeQ.explanation}</div>
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

    openDevStudio(tab = 'compiler') {
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
      if (el.devEditorSlideScript && !el.devEditorSlideScript.value && global.ASTSlideScriptCompiler && this.engine.scene) {
        el.devEditorSlideScript.value = global.ASTSlideScriptCompiler.toSlideScript(this.engine.scene);
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
        this.openDevStudio('compiler');
      }
    }

    switchStudioTab(tabName) {
      this.activeStudioTab = tabName;
      const el = this.elements;

      const tabBtns = document.querySelectorAll('.dev-tab-btn');
      tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
      });

      if (el.devCompilerTab) el.devCompilerTab.style.display = tabName === 'compiler' ? 'flex' : 'none';
      if (el.devQuizbuilderTab) {
        el.devQuizbuilderTab.style.display = tabName === 'quizbuilder' ? 'block' : 'none';
        if (tabName === 'quizbuilder') this.renderQuizBuilderExistingList();
      }
      if (el.devEditorSvg) el.devEditorSvg.style.display = tabName === 'svg' ? 'block' : 'none';
      if (el.devEditorAst) el.devEditorAst.style.display = tabName === 'ast' ? 'block' : 'none';
      if (el.devTemplateTab) el.devTemplateTab.style.display = tabName === 'templates' ? 'grid' : 'none';
    }

    renderQuizBuilderExistingList() {
      const el = this.elements;
      if (!el.qbExistingList) return;
      const scene = this.engine.scene;
      const checkpoints = (scene && scene.interactive && scene.interactive.checkpoints) || [];
      if (checkpoints.length === 0) {
        el.qbExistingList.innerHTML = '<div style="font-size:11px; color:#64748b; font-style:italic; padding:6px 0;">No active checkpoints in this slide yet. Build and inject one above!</div>';
        return;
      }
      const dur = this.engine.durationSec || 10;
      el.qbExistingList.innerHTML = checkpoints.map((cp, idx) => `
        <div class="qb-existing-card">
          <div style="display:flex; flex-direction:column; gap:2px; flex:1; margin-right:12px;">
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-weight:700; color:#38bdf8;">t=${(cp.t).toFixed(2)} (${(cp.t * dur).toFixed(1)}s)</span>
              <span style="color:#f8fafc; font-weight:600;">${cp.title}</span>
            </div>
            <div style="font-size:11px; color:#94a3b8; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${cp.prompt}</div>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" class="dev-btn qb-test-btn" data-idx="${idx}" style="font-size:10px; padding:3px 8px;">▶ Test</button>
            <button type="button" class="dev-btn qb-del-btn" data-idx="${idx}" style="font-size:10px; padding:3px 8px; color:#f43f5e;">✕ Remove</button>
          </div>
        </div>
      `).join('');

      el.qbExistingList.querySelectorAll('.qb-test-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          const cp = checkpoints[idx];
          if (cp) {
            this.engine.seek(cp.t);
            this.triggerCheckpoint(cp, idx);
          }
        });
      });

      el.qbExistingList.querySelectorAll('.qb-del-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          checkpoints.splice(idx, 1);
          this.renderQuizBuilderExistingList();
          this.showToast('🗑️ Checkpoint removed');
        });
      });
    }

    downloadStandaloneSvgApplet() {
      try {
        const appletSvg = this.engine.compileAutonomousSvgApplet();
        if (!appletSvg) {
          this.showToast('⚠️ Could not compile standalone SVG');
          return;
        }
        const blob = new Blob([appletSvg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.engine.activePresetId || 'scene'}-standalone-applet.svg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.playChime(880, 'sine');
        this.showToast('🚀 Autonomous SVG SPA Exported!');
      } catch (err) {
        console.error('Failed to export standalone SVG applet:', err);
        this.showToast('⚠️ Export failed');
      }
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

    initObsBroadcast() {
      if (typeof window === 'undefined' || !window.OBSBroadcastController) return;
      this.obs = new window.OBSBroadcastController();
      const el = this.elements;
      if (!el.obsDrawer) return;

      // Populate form with saved settings
      if (el.obsInputUrl) el.obsInputUrl.value = this.obs.settings.url || 'ws://127.0.0.1:4455';
      if (el.obsInputPassword) el.obsInputPassword.value = this.obs.settings.password || '';
      if (el.obsToggleRecord) el.obsToggleRecord.checked = Boolean(this.obs.settings.syncRecording);
      if (el.obsToggleSubtitles) el.obsToggleSubtitles.checked = Boolean(this.obs.settings.syncSubtitles);
      if (el.obsInputSource) el.obsInputSource.value = this.obs.settings.subtitleSource || 'LessonSubtitles';
      if (el.obsToggleTransparent) el.obsToggleTransparent.checked = Boolean(this.obs.settings.transparent);

      // Check transparent URL param or setting
      const params = new URLSearchParams(window.location.search);
      if (params.get('transparent') === '1' || params.get('transparent') === 'true' || params.get('obs') === '1' || this.obs.settings.transparent) {
        document.body.classList.add('obs-transparent');
        if (el.obsToggleTransparent) el.obsToggleTransparent.checked = true;
      }

      // OBS Event Listeners
      this.obs.on('connected', (info) => {
        this.updateObsStatusUI(true, false, info.version);
        this.showToast(`📡 OBS Studio Connected (${info.version || 'v5'})`);
        this.playChime(659, 'sine');
      });

      this.obs.on('disconnected', () => {
        this.updateObsStatusUI(false, false);
      });

      this.obs.on('recordingChanged', (data) => {
        this.updateObsStatusUI(this.obs.isConnected, data.isRecording);
      });

      this.obs.on('scenesListReceived', (data) => {
        if (!el.obsSelectScene) return;
        el.obsSelectScene.innerHTML = '';
        (data.scenes || []).forEach(sc => {
          const opt = document.createElement('option');
          opt.value = sc;
          opt.textContent = sc;
          if (sc === data.currentScene) opt.selected = true;
          el.obsSelectScene.appendChild(opt);
        });
      });

      this.obs.on('sceneChanged', (sceneName) => {
        if (el.obsSelectScene) el.obsSelectScene.value = sceneName;
      });

      this.obs.on('remoteCommand', (cmd, payload) => {
        switch (cmd) {
          case 'play':
            this.engine.play();
            break;
          case 'pause':
            this.engine.pause();
            break;
          case 'togglePlay':
            this.engine.isPlaying ? this.engine.pause() : this.engine.play();
            break;
          case 'seek':
            if (typeof payload?.progress === 'number') this.engine.seek(payload.progress);
            break;
          case 'next':
            this.engine.step(0.05);
            break;
          case 'prev':
            this.engine.step(-0.05);
            break;
          case 'reset':
            this.engine.seek(0);
            break;
          case 'quiz':
            if (el.btnInteractive) el.btnInteractive.click();
            break;
        }
      });
    }

    updateObsStatusUI(isConnected, isRecording, version) {
      const el = this.elements;
      if (el.obsStatusDot) {
        el.obsStatusDot.className = 'obs-status-dot ' + (isRecording ? 'recording' : (isConnected ? 'connected' : 'disconnected'));
      }
      if (el.obsDrawerBadge) {
        el.obsDrawerBadge.className = 'obs-drawer-badge ' + (isConnected ? 'connected' : 'disconnected');
        el.obsDrawerBadge.textContent = isConnected ? `CONNECTED ${version || ''}` : 'DISCONNECTED';
      }
      if (el.obsLiveControls) {
        el.obsLiveControls.style.display = isConnected ? 'block' : 'none';
      }
      if (el.btnObsRecordToggle) {
        el.btnObsRecordToggle.textContent = isRecording ? '⏹ Stop OBS Recording' : '⏺ Start OBS Recording';
        el.btnObsRecordToggle.className = 'obs-btn ' + (isRecording ? 'danger' : 'primary');
      }
    }

    toggleObsDrawer() {
      const el = this.elements;
      if (!el.obsDrawer) return;
      const isHidden = el.obsDrawer.classList.contains('hidden');
      if (isHidden) {
        el.obsDrawer.classList.remove('hidden');
        if (el.btnObsLink) el.btnObsLink.classList.add('active');
        if (this.obs && this.obs.isConnected) this.obs.refreshScenes();
      } else {
        this.closeObsDrawer();
      }
    }

    closeObsDrawer() {
      const el = this.elements;
      if (el.obsDrawer) el.obsDrawer.classList.add('hidden');
      if (el.btnObsLink) el.btnObsLink.classList.remove('active');
    }

    /**
     * Browser SpeechRecognition Voice Control Integration
     */
    initVoiceRecognition() {
      const SpeechRecognition = typeof window !== 'undefined'
        ? (window.SpeechRecognition || window.webkitSpeechRecognition)
        : null;

      if (!SpeechRecognition) {
        return null;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        const langMap = {
          en: 'en-US',
          es: 'es-ES',
          fr: 'fr-FR',
          de: 'de-DE',
          it: 'it-IT',
          pl: 'pl-PL',
          pt: 'pt-BR',
          uk: 'uk-UA',
          ar: 'ar-SA',
          la: 'la'
        };
        recognition.lang = langMap[this.engine?.lang] || 'en-US';

        recognition.onstart = () => {
          this.isListeningVoice = true;
          this.updateVoiceStatusUI(true, '🎙️ Listening for commands... ("play", "pause", "rewind", "show me fractions")');
          this.showToast('🎙️ Voice Control Active (Speak now)');
          if (this.engine && typeof this.engine.notifyParent === 'function') {
            this.engine.notifyParent({ type: 'VOICE_STATUS', isListening: true });
          }
        };

        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const result = event.results[i];
            const text = result[0]?.transcript || '';
            if (result.isFinal) {
              finalTranscript += text;
            } else {
              interimTranscript += text;
            }
          }

          if (interimTranscript) {
            this.updateVoiceOverlayText(`Hearing: "${interimTranscript.trim()}"...`);
          }

          if (finalTranscript) {
            const clean = finalTranscript.trim();
            this.updateVoiceOverlayText(`Recognized: "${clean}"`);
            this.handleVoiceCommand(clean);
          }
        };

        recognition.onerror = (event) => {
          console.warn('[AST-PlayerUI] Voice recognition notice:', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            this.isListeningVoice = false;
            this.updateVoiceStatusUI(false);
            this.showToast('⚠️ Microphone permission required for Voice Control');
            if (this.engine && typeof this.engine.notifyParent === 'function') {
              this.engine.notifyParent({ type: 'VOICE_STATUS', isListening: false, error: event.error });
            }
          } else if (event.error === 'no-speech') {
            if (this.isListeningVoice) {
              this.updateVoiceOverlayText('🎙️ Listening for commands... ("play", "pause", "show me fractions")');
            }
          } else if (event.error !== 'aborted') {
            this.showToast(`Voice input notice: ${event.error}`);
          }
        };

        recognition.onend = () => {
          if (this.isListeningVoice) {
            clearTimeout(this._voiceRestartTimeout);
            this._voiceRestartTimeout = setTimeout(() => {
              if (this.isListeningVoice && this.recognition) {
                try {
                  this.recognition.start();
                } catch (e) {}
              }
            }, 300);
          } else {
            this.updateVoiceStatusUI(false);
            if (this.engine && typeof this.engine.notifyParent === 'function') {
              this.engine.notifyParent({ type: 'VOICE_STATUS', isListening: false });
            }
          }
        };

        return recognition;
      } catch (err) {
        console.warn('[AST-PlayerUI] Error instantiating SpeechRecognition:', err);
        return null;
      }
    }

    startVoiceCommands() {
      const SpeechRecognition = typeof window !== 'undefined'
        ? (window.SpeechRecognition || window.webkitSpeechRecognition)
        : null;

      if (!SpeechRecognition) {
        this.showToast('⚠️ SpeechRecognition is not supported in this browser (Use Chrome, Edge, or Safari)');
        return false;
      }

      if (!this.recognition) {
        this.recognition = this.initVoiceRecognition();
      }

      if (!this.recognition) {
        this.showToast('⚠️ Unable to initialize voice recognition engine');
        return false;
      }

      this.isListeningVoice = true;
      try {
        this.recognition.start();
        return true;
      } catch (err) {
        // Recognition already active
        this.updateVoiceStatusUI(true);
        return true;
      }
    }

    stopVoiceCommands() {
      this.isListeningVoice = false;
      clearTimeout(this._voiceRestartTimeout);
      if (this.recognition) {
        try {
          this.recognition.stop();
        } catch (e) {}
      }
      this.updateVoiceStatusUI(false);
      this.showToast('🎙️ Voice Control Stopped');
      if (this.engine && typeof this.engine.notifyParent === 'function') {
        this.engine.notifyParent({ type: 'VOICE_STATUS', isListening: false });
      }
    }

    toggleVoiceCommands() {
      if (this.isListeningVoice) {
        this.stopVoiceCommands();
      } else {
        this.startVoiceCommands();
      }
    }

    updateVoiceStatusUI(active, text) {
      const el = this.elements;
      if (el.btnVoiceCmd) {
        el.btnVoiceCmd.classList.toggle('active', active);
        el.btnVoiceCmd.textContent = active ? '🔴 Listening...' : '🎤 Mic';
      }
      if (el.voiceCmdOverlay) {
        if (active) {
          el.voiceCmdOverlay.classList.remove('hidden');
          el.voiceCmdOverlay.style.display = 'flex';
          if (text) {
            this.updateVoiceOverlayText(text);
          }
        } else {
          el.voiceCmdOverlay.classList.add('hidden');
          el.voiceCmdOverlay.style.display = 'none';
        }
      }
    }

    updateVoiceOverlayText(text) {
      const el = this.elements;
      if (el.voiceCmdText) {
        el.voiceCmdText.textContent = text;
      }
    }

    handleVoiceCommand(rawTranscript) {
      if (!rawTranscript || typeof rawTranscript !== 'string') return;
      const text = rawTranscript.toLowerCase().trim().replace(/[.,!?;:]/g, '');
      const el = this.elements;

      let executedAction = null;
      let actionLabel = '';

      // 1. Playback Controls
      if (/^(play|resume|start|unpause|continue|go)$/.test(text) || text.includes('play video') || text.includes('play model') || text.includes('start playback')) {
        this.engine.play();
        executedAction = 'PLAY';
        actionLabel = '▶ Play';
      } else if (/^(pause|stop|freeze|halt|wait|hold)$/.test(text) || text.includes('pause video') || text.includes('stop playback')) {
        this.engine.pause();
        executedAction = 'PAUSE';
        actionLabel = '⏸ Pause';
      } else if (text === 'toggle' || text === 'toggle play' || text === 'toggle playback') {
        this.engine.togglePlay();
        executedAction = 'TOGGLE_PLAY';
        actionLabel = this.engine.isPlaying ? '▶ Play' : '⏸ Pause';
      }
      // 2. Rewind / Seek
      else if (/^(rewind|restart|start over|replay|beginning|back to start|reset)$/.test(text) || text.includes('rewind to start') || text.includes('from the beginning') || text.includes('back to the start')) {
        this.engine.seek(0);
        executedAction = 'REWIND';
        actionLabel = '⏮ Rewound to Beginning';
      } else if (/^(forward|fast forward|skip forward|step forward|ahead|next)$/.test(text) || text.includes('skip ahead') || text.includes('forward five')) {
        this.engine.step(0.1);
        executedAction = 'STEP_FORWARD';
        actionLabel = '⏩ Stepped Forward';
      } else if (/^(back|step back|backward|skip back|previous)$/.test(text) || text.includes('go back') || text.includes('step backwards')) {
        this.engine.step(-0.1);
        executedAction = 'STEP_BACK';
        actionLabel = '⏪ Stepped Backward';
      } else if (text.includes('middle') || text.includes('halfway') || text.includes('fifty percent') || text.includes('50%')) {
        this.engine.seek(0.5);
        executedAction = 'SEEK_50';
        actionLabel = '⏱ Jumped to 50%';
      }
      // 3. Curriculum Scenes ("show me fractions", "show me solar system", etc.)
      else if (text.includes('fraction') || text.includes('math fraction') || text.includes('fraction model')) {
        this.engine.loadScene('fractions', true);
        executedAction = 'LOAD_SCENE_fractions';
        actionLabel = '🥧 Loaded Fractions Scene';
      } else if (text.includes('solar system') || text.includes('solar') || text.includes('planet') || text.includes('orbit')) {
        this.engine.loadScene('solar-system', true);
        executedAction = 'LOAD_SCENE_solar-system';
        actionLabel = '🪐 Loaded Solar System Scene';
      } else if (text.includes('mountain') || text.includes('elevation') || text.includes('topography') || text.includes('climb')) {
        this.engine.loadScene('mountain-elevation', true);
        executedAction = 'LOAD_SCENE_mountain-elevation';
        actionLabel = '⛰️ Loaded Mountain Elevation Scene';
      } else if (text.includes('aquarium') || text.includes('fish tank') || text.includes('ocean') || (text.includes('fish') && !text.includes('math fish'))) {
        this.engine.loadScene('fish-tank', true);
        executedAction = 'LOAD_SCENE_fish-tank';
        actionLabel = '🐠 Loaded Aquarium Scene';
      } else if (text.includes('math fishing') || text.includes('math fish') || text.includes('fishing game')) {
        this.engine.loadScene('math-fishing', true);
        executedAction = 'LOAD_SCENE_math-fishing';
        actionLabel = '🎣 Loaded Math Fishing Scene';
      } else if (text.includes('atomic') || text.includes('atom') || text.includes('bohr')) {
        this.engine.loadScene('atomic-structure', true);
        executedAction = 'LOAD_SCENE_atomic-structure';
        actionLabel = '⚛️ Loaded Atomic Structure Scene';
      } else if (text.includes('church') || text.includes('cathedral') || text.includes('chapel')) {
        this.engine.loadScene('church-tour', true);
        executedAction = 'LOAD_SCENE_church-tour';
        actionLabel = '⛪ Loaded Church Tour Scene';
      } else if (text.includes('water cycle') || text.includes('rain cycle') || text.includes('evaporation')) {
        this.engine.loadScene('water-cycle', true);
        executedAction = 'LOAD_SCENE_water-cycle';
        actionLabel = '💧 Loaded Water Cycle Scene';
      } else if (text.includes('pythagor') || text.includes('geometry') || text.includes('triangle')) {
        this.engine.loadScene('pythagoras', true);
        executedAction = 'LOAD_SCENE_pythagoras';
        actionLabel = '📐 Loaded Pythagoras Scene';
      } else if (text.includes('photosynthesis') || text.includes('plant')) {
        this.engine.loadScene('photosynthesis', true);
        executedAction = 'LOAD_SCENE_photosynthesis';
        actionLabel = '🌱 Loaded Photosynthesis Scene';
      }
      // Dynamic query: "show me X", "load X", "open X", "go to X", "switch to X"
      else if (/^(show me|load|open|go to|switch to)\s+(.+)$/.test(text)) {
        const match = text.match(/^(show me|load|open|go to|switch to)\s+(.+)$/);
        const query = match ? match[2].trim() : '';
        const normalized = global.ASTSceneRegistry?.normalizeId?.(query) || query;
        if (global.ASTSceneRegistry?.getScene?.(normalized)) {
          this.engine.loadScene(normalized, true);
          executedAction = `LOAD_SCENE_${normalized}`;
          actionLabel = `✨ Loaded ${normalized}`;
        }
      }
      // 4. Playback Speed
      else if (text.includes('faster') || text.includes('speed up') || text.includes('double speed') || text.includes('2x') || text.includes('two x')) {
        this.engine.setSpeed(2.0);
        if (el.speedSelector) el.speedSelector.value = '2';
        executedAction = 'SET_SPEED_2';
        actionLabel = '⚡ Speed: 2.0×';
      } else if (text.includes('slower') || text.includes('slow down') || text.includes('half speed') || text.includes('0.5x') || text.includes('point five')) {
        this.engine.setSpeed(0.5);
        if (el.speedSelector) el.speedSelector.value = '0.5';
        executedAction = 'SET_SPEED_0.5';
        actionLabel = '🐢 Speed: 0.5×';
      } else if (text.includes('normal speed') || text.includes('regular speed') || text.includes('1x') || text.includes('one x')) {
        this.engine.setSpeed(1.0);
        if (el.speedSelector) el.speedSelector.value = '1';
        executedAction = 'SET_SPEED_1';
        actionLabel = '▶ Speed: 1.0×';
      } else if (text.includes('1.5x') || text.includes('one point five')) {
        this.engine.setSpeed(1.5);
        if (el.speedSelector) el.speedSelector.value = '1.5';
        executedAction = 'SET_SPEED_1.5';
        actionLabel = '⚡ Speed: 1.5×';
      }
      // 5. Sound & Voice Narration
      else if (text.includes('unmute') || text.includes('sound on') || text.includes('audio on')) {
        this.engine.setMuted(false);
        executedAction = 'UNMUTE';
        actionLabel = '🔊 Audio Unmuted';
      } else if (text.includes('mute') || text.includes('sound off') || text.includes('quiet') || text.includes('silence')) {
        this.engine.setMuted(true);
        executedAction = 'MUTE';
        actionLabel = '🔇 Audio Muted';
      } else if (text.includes('voice on') || text.includes('narrat') || text.includes('read to me') || text.includes('enable voice')) {
        if (!this.engine.voiceEnabled) {
          const enabled = this.engine.toggleVoice();
          if (el.btnNarrate) {
            el.btnNarrate.classList.toggle('active', enabled);
            el.btnNarrate.textContent = enabled ? '🔊 Voice: ON' : '🔊 Voice';
          }
        }
        executedAction = 'VOICE_NARRATION_ON';
        actionLabel = '🔊 Voice Narration Enabled';
      } else if (text.includes('voice off') || text.includes('stop voice') || text.includes('disable voice') || text.includes('stop reading')) {
        if (this.engine.voiceEnabled) {
          const enabled = this.engine.toggleVoice();
          if (el.btnNarrate) {
            el.btnNarrate.classList.toggle('active', enabled);
            el.btnNarrate.textContent = enabled ? '🔊 Voice: ON' : '🔊 Voice';
          }
        }
        executedAction = 'VOICE_NARRATION_OFF';
        actionLabel = '🔇 Voice Narration Disabled';
      }
      // 6. 3D Camera Controls
      else if (text.includes('orbit') || text.includes('rotate') || text.includes('spin') || text.includes('turn')) {
        this.engine.rotateCamera(45, 10);
        executedAction = 'ORBIT_3D';
        actionLabel = '🌐 3D Orbit (+45°)';
      } else if (text.includes('reset camera') || text.includes('reset 3d') || text.includes('reset view')) {
        this.engine.resetCamera();
        executedAction = 'RESET_3D';
        actionLabel = '🌐 3D Camera Reset';
      } else if (this.engine.activePresetId === 'church-tour' && (text.includes('nave') || text.includes('altar') || text.includes('tabernacle') || text.includes('ambo') || text.includes('overhead'))) {
        if (text.includes('nave')) {
          this.engine.cameraOrbit.yawOffset = 0;
          this.engine.cameraOrbit.pitchOffset = 18;
          this.engine.cameraOrbit.distanceScale = 1.05;
          this.engine.seek(0.05);
          actionLabel = '⛪ View from Nave Entrance';
        } else if (text.includes('altar')) {
          this.engine.cameraOrbit.yawOffset = 0;
          this.engine.cameraOrbit.pitchOffset = 26;
          this.engine.cameraOrbit.distanceScale = 1.45;
          this.engine.seek(0.60);
          actionLabel = '✨ Focus on High Altar';
        } else if (text.includes('tabernacle')) {
          this.engine.cameraOrbit.yawOffset = 14;
          this.engine.cameraOrbit.pitchOffset = 28;
          this.engine.cameraOrbit.distanceScale = 1.70;
          this.engine.seek(0.80);
          actionLabel = '🕯️ Focus on Tabernacle';
        }
        this.engine.applyBindings(this.engine.progress);
        this.engine.emit('camerachange', { ...this.engine.cameraOrbit });
        executedAction = 'CHURCH_VIEWPOINT';
      }
      // 7. Loop & Mode & Fullscreen
      else if (text.includes('loop') || text.includes('repeat')) {
        this.engine.toggleLoop();
        executedAction = 'TOGGLE_LOOP';
        actionLabel = this.engine.isLooping ? '🔁 Loop ON' : '➡️ Loop OFF';
      } else if (text.includes('game mode') || text.includes('interactive mode') || text.includes('play game')) {
        if (el.btnPlayMode) el.btnPlayMode.click();
        executedAction = 'TOGGLE_PLAY_MODE';
        actionLabel = '🎮 Toggled Play Mode';
      } else if (text.includes('fullscreen') || text.includes('full screen')) {
        if (el.btnFullscreen) el.btnFullscreen.click();
        executedAction = 'TOGGLE_FULLSCREEN';
        actionLabel = '⛶ Toggled Fullscreen';
      } else if (text.includes('pip') || text.includes('picture in picture') || text.includes('float window') || text.includes('floating player') || text.includes('mini player')) {
        this.togglePictureInPicture();
        executedAction = 'TOGGLE_PIP';
        actionLabel = '📺 Toggled Picture-in-Picture';
      } else if (text.includes('quiz') || text.includes('checkpoint') || text.includes('challenge')) {
        if (el.btnInteractive) el.btnInteractive.click();
        executedAction = 'OPEN_QUIZ';
        actionLabel = '🎯 Opened Interactive Challenge';
      }

      if (executedAction) {
        this.updateVoiceOverlayText(`✅ Executed: ${actionLabel}`);
        this.showToast(`🎙️ Voice: ${actionLabel}`);

        if (this.engine && typeof this.engine.notifyParent === 'function') {
          this.engine.notifyParent({
            type: 'VOICE_COMMAND_EXECUTED',
            command: text,
            action: executedAction,
            label: actionLabel,
          });
        }

        clearTimeout(this._voiceFeedbackTimeout);
        this._voiceFeedbackTimeout = setTimeout(() => {
          if (this.isListeningVoice) {
            this.updateVoiceOverlayText('🎙️ Listening for commands... ("play", "pause", "show me fractions")');
          }
        }, 3200);
      } else {
        this.updateVoiceOverlayText(`❓ Heard: "${rawTranscript}" (Try "play", "pause", "show me fractions")`);
        clearTimeout(this._voiceFeedbackTimeout);
        this._voiceFeedbackTimeout = setTimeout(() => {
          if (this.isListeningVoice) {
            this.updateVoiceOverlayText('🎙️ Listening for commands... ("play", "pause", "show me fractions")');
          }
        }, 3500);
      }
    }
  }

  global.ASTPlayerUI = ASTPlayerUI;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASTPlayerUI };
  }
})(typeof window !== 'undefined' ? window : globalThis);
