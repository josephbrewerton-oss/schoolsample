/**
 * @stjosephs/micro-vector-player v1.0.0
 * Ultra-lightweight AST-Guided Vector Media Player Web Component (< 5 KB)
 * 
 * Usage:
 *   <script src="./micro-vector-player.js"></script>
 *   <micro-vector-player src="./examples/orbit.json"></micro-vector-player>
 *   <micro-vector-player preset="fractions" autoplay></micro-vector-player>
 */
(function () {
  'use strict';

  // Built-in lightweight easing library
  const EASING = {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    cubic: (t) => t * t * t,
  };

  // Shadow DOM template
  const TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML = `
    <style>
      :host {
        display: block;
        width: 100%;
        max-width: 100%;
        position: relative;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        box-sizing: border-box;
        border-radius: 12px;
        overflow: hidden;
        background: var(--mvp-bg, #090d16);
        color: var(--mvp-text, #f8fafc);
        border: 1px solid var(--mvp-border, #1e293b);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        user-select: none;
      }
      :host([theme="light"]) {
        --mvp-bg: #f8fafc;
        --mvp-surface: #ffffff;
        --mvp-border: #cbd5e1;
        --mvp-text: #0f172a;
        --mvp-primary: #2563eb;
      }
      * { box-sizing: border-box; }
      .stage-wrap {
        position: relative;
        width: 100%;
        aspect-ratio: 800 / 480;
        background: radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, transparent 100%);
        overflow: hidden;
      }
      svg.canvas {
        width: 100%;
        height: 100%;
        display: block;
      }
      .sub-banner {
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.88);
        border: 1px solid rgba(56, 189, 248, 0.25);
        backdrop-filter: blur(6px);
        color: #f8fafc;
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        max-width: 90%;
        pointer-events: none;
        transition: opacity 0.2s ease;
      }
      .chrome {
        background: var(--mvp-surface, #0f172a);
        border-top: 1px solid var(--mvp-border, #1e293b);
        padding: 6px 10px 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .track-box {
        position: relative;
        height: 16px;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      .track {
        width: 100%;
        height: 5px;
        background: #334155;
        border-radius: 3px;
        position: relative;
      }
      .fill {
        height: 100%;
        background: #2563eb;
        border-radius: 3px;
        width: 0%;
      }
      .thumb {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        background: #fff;
        border: 2px solid #2563eb;
        border-radius: 50%;
        left: 0%;
      }
      .marker {
        position: absolute;
        top: -2px;
        width: 3px;
        height: 9px;
        background: #38bdf8;
        border-radius: 1px;
        transform: translateX(-50%);
      }
      .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 11px;
      }
      .btn-row { display: flex; align-items: center; gap: 4px; }
      button {
        background: #1e293b;
        color: #cbd5e1;
        border: 1px solid #334155;
        border-radius: 5px;
        padding: 3px 8px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
      }
      button:hover { background: #2563eb; color: #fff; }
      .badge {
        font-size: 10px;
        padding: 2px 6px;
        background: rgba(56, 189, 248, 0.15);
        color: #38bdf8;
        border-radius: 4px;
        font-weight: 700;
      }
    </style>
    <div class="stage-wrap">
      <svg class="canvas" viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="mvp-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>
        </defs>
        <g id="layer"></g>
      </svg>
      <div class="sub-banner" id="sub">Loading scene...</div>
    </div>
    <div class="chrome" id="chrome">
      <div class="track-box" id="scrubber">
        <div class="track" id="track">
          <div class="fill" id="fill"></div>
          <div class="thumb" id="thumb"></div>
        </div>
      </div>
      <div class="controls">
        <div class="btn-row">
          <button id="btn-play">▶ Play</button>
          <button id="btn-rewind">↺</button>
          <span id="readout">00:00 / 00:10</span>
        </div>
        <div class="btn-row">
          <span class="badge" id="badge">AST VECTOR</span>
          <button id="btn-voice">🔊 Voice</button>
        </div>
      </div>
    </div>
  `;

  class MicroVectorPlayer extends HTMLElement {
    static get observedAttributes() {
      return ['src', 'preset', 'autoplay', 'speed', 'lang', 'theme', 'voice'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));

      // Elements
      this.$layer = this.shadowRoot.getElementById('layer');
      this.$sub = this.shadowRoot.getElementById('sub');
      this.$fill = this.shadowRoot.getElementById('fill');
      this.$thumb = this.shadowRoot.getElementById('thumb');
      this.$track = this.shadowRoot.getElementById('track');
      this.$scrubber = this.shadowRoot.getElementById('scrubber');
      this.$readout = this.shadowRoot.getElementById('readout');
      this.$badge = this.shadowRoot.getElementById('badge');
      this.$btnPlay = this.shadowRoot.getElementById('btn-play');
      this.$btnRewind = this.shadowRoot.getElementById('btn-rewind');
      this.$btnVoice = this.shadowRoot.getElementById('btn-voice');

      // State
      this.progress = 0;
      this.isPlaying = false;
      this.speed = 1.0;
      this.duration = 10.0;
      this.voiceEnabled = false;
      this.lang = 'en';
      this.lastTimestamp = null;
      this.animId = null;
      this.scene = null;
      this.lastSpoken = -1;

      this.tick = this.tick.bind(this);
    }

    connectedCallback() {
      this.bindEvents();
      this.applyAttributes();

      if (this.getAttribute('src')) {
        this.loadSrc(this.getAttribute('src'));
      } else if (this.getAttribute('preset')) {
        this.loadPreset(this.getAttribute('preset'));
      } else {
        const inline = this.textContent.trim();
        if (inline) {
          this.parseAndSetScene(inline);
        } else {
          this.loadPreset('fractions');
        }
      }
    }

    disconnectedCallback() {
      if (this.animId) cancelAnimationFrame(this.animId);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }

    attributeChangedCallback(name, oldVal, newVal) {
      if (oldVal === newVal) return;
      if (name === 'src' && newVal) this.loadSrc(newVal);
      if (name === 'preset' && newVal) this.loadPreset(newVal);
      if (name === 'autoplay') this.isPlaying = newVal !== null && newVal !== 'false';
      if (name === 'speed') this.speed = parseFloat(newVal) || 1.0;
      if (name === 'lang') this.lang = newVal || 'en';
      if (name === 'voice') this.voiceEnabled = newVal !== null && newVal !== 'false';
      if (name === 'theme') this.setAttribute('theme', newVal);
    }

    applyAttributes() {
      if (this.hasAttribute('autoplay')) this.isPlaying = true;
      if (this.hasAttribute('speed')) this.speed = parseFloat(this.getAttribute('speed')) || 1.0;
      if (this.hasAttribute('lang')) this.lang = this.getAttribute('lang');
      if (this.hasAttribute('voice')) this.voiceEnabled = true;
    }

    bindEvents() {
      this.$btnPlay.onclick = () => this.toggle();
      this.$btnRewind.onclick = () => this.seek(0);
      this.$btnVoice.onclick = () => {
        this.voiceEnabled = !this.voiceEnabled;
        this.$btnVoice.textContent = this.voiceEnabled ? '🔊 Voice: ON' : '🔊 Voice';
      };

      const handleSeek = (e) => {
        const rect = this.$track.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        this.seek(p);
      };

      this.$scrubber.onclick = handleSeek;
      let dragging = false;
      this.$scrubber.onmousedown = (e) => { dragging = true; handleSeek(e); };
      window.addEventListener('mousemove', (e) => { if (dragging) handleSeek(e); });
      window.addEventListener('mouseup', () => { dragging = false; });

      // Interactive Hotspot Delegation
      this.$layer.addEventListener('click', (e) => {
        const hotspot = e.target.closest('[data-target-t]');
        if (hotspot) {
          const targetT = parseFloat(hotspot.getAttribute('data-target-t'));
          const label = hotspot.getAttribute('data-label') || 'Station';
          if (!isNaN(targetT)) {
            this.seek(targetT);
            this.dispatchEvent(new CustomEvent('hotspot', { detail: { targetT, label } }));
          }
        }
      });
    }

    async loadSrc(url) {
      try {
        const res = await fetch(url);
        const text = await res.text();
        this.parseAndSetScene(text);
      } catch (err) {
        console.warn('micro-vector-player failed to load src:', err);
        this.loadPreset('fractions');
      }
    }

    loadPreset(presetId) {
      const clean = String(presetId || '').trim().toLowerCase().replace(/\.(ast|json|svg)$/, '');
      if (window.ASTSceneRegistry && (window.ASTSceneRegistry.has(clean) || window.ASTSceneRegistry.has(presetId))) {
        this.setScene(window.ASTSceneRegistry.get(clean));
        return;
      }

      if (clean === 'church-tour' || clean === 'church' || clean === 'church_tour' || clean === 'churchtour') {
        this.setScene({
          id: 'church-tour',
          title: 'Tour of a Catholic Church: Sacred Architecture & Sacred Spaces',
          stage: 'CATHOLIC LIFE',
          duration: 16.0,
          interactive: {
            hotspots: [
              { id: 'narthex', label: '1. Narthex & Holy Water Stoup', targetT: 0.00 },
              { id: 'nave', label: '2. Nave & Central Aisle', targetT: 0.20 },
              { id: 'ambo', label: '3. The Ambo (Lectern)', targetT: 0.40 },
              { id: 'altar', label: '4. Altar of Sacrifice', targetT: 0.60 },
              { id: 'tabernacle', label: '5. Tabernacle & Sanctuary Lamp', targetT: 0.80 },
              { id: 'lady-chapel', label: '6. Lady Chapel & Baptismal Font', targetT: 1.00 }
            ]
          },
          keyframes: [
            { t: 0.00, title: '1. Narthex & Holy Water Stoup', rule: 'Vestibulum: We bless ourselves with Holy Water to recall our Baptism.' },
            { t: 0.20, title: '2. Nave & Central Aisle', rule: 'Navis: The Pilgrim People of God; we genuflect towards the Tabernacle before entering our pew.' },
            { t: 0.40, title: '3. Ambo (Lectern)', rule: 'Mensa Verbi: The Table of the Word from which the Holy Gospel is proclaimed.' },
            { t: 0.60, title: '4. Altar of Sacrifice', rule: 'Altare Christi: Represents Christ Himself and the Holy Sacrifice of the Mass.' },
            { t: 0.80, title: '5. Tabernacle & Sanctuary Lamp', rule: "Tabernaculum: Houses the Blessed Sacrament; red lamp indicates Christ's Real Presence." },
            { t: 1.00, title: '6. Lady Chapel & Baptismal Font', rule: 'Fons & Sacellum: Devotional side chapel of Our Lady and the waters of new birth.' }
          ],
          subtitles: [
            { start: 0.0, end: 0.20, en: "We enter through the Narthex, blessing ourselves with Holy Water in the Name of the Father, Son, and Holy Spirit.", es: "Entramos por el Nártex, bendiciéndonos con Agua Bendita en el Nombre del Padre, del Hijo y del Espíritu Santo." },
            { start: 0.20, end: 0.40, en: "Walking up the central aisle of the Nave, we genuflect on our right knee toward the Tabernacle before entering our pew.", es: "Por el pasillo de la Nave, hacemos una genuflexión con la rodilla derecha hacia el Sagrario antes de sentarnos." },
            { start: 0.40, end: 0.60, en: "The Ambo is the Table of the Word, where the Holy Gospel and readings of Sacred Scripture are proclaimed.", es: "El Ambón es la Mesa de la Palabra, donde se proclaman las lecturas de la Sagrada Escritura y el Evangelio." },
            { start: 0.60, end: 0.80, en: "The Altar is the sacred center representing Christ Himself, where the bread and wine become His Body and Blood.", es: "El Altar es el centro sagrado que representa a Cristo, donde el pan y el vino se convierten en Su Cuerpo y Sangre." },
            { start: 0.80, end: 1.00, en: "The golden Tabernacle holds the Real Presence of Christ in the Eucharist, watched over by the burning red Sanctuary Lamp.", es: "El Sagrario dorado guarda la Presencia Real de Jesús en la Eucaristía, acompañado por la lámpara roja del Santuario." }
          ],
          render: (t) => {
            let camX = 400, camY = 430;
            let stationTitle = "1. NARTHEX & HOLY WATER STOUP";
            if (t >= 0.20 && t < 0.40) {
              const f = (t - 0.20) / 0.20;
              camX = 400; camY = 430 - f * 150;
              stationTitle = "2. THE NAVE & PEWS";
            } else if (t >= 0.40 && t < 0.60) {
              const f = (t - 0.40) / 0.20;
              camX = 400 - f * 59; camY = 280 - f * 140;
              stationTitle = "3. THE AMBO (LECTERN)";
            } else if (t >= 0.60 && t < 0.80) {
              const f = (t - 0.60) / 0.20;
              camX = 341 + f * 59; camY = 140 - f * 12;
              stationTitle = "4. THE ALTAR OF SACRIFICE";
            } else if (t >= 0.80 && t < 0.92) {
              const f = (t - 0.80) / 0.12;
              camX = 400; camY = 128 - f * 56;
              stationTitle = "5. THE TABERNACLE & SANCTUARY LAMP";
            } else if (t >= 0.92) {
              const f = (t - 0.92) / 0.08;
              camX = 400 - Math.cos(f * Math.PI) * 180; camY = 190;
              stationTitle = "6. LADY CHAPEL & BAPTISMAL FONT";
            }

            return `
              <path d="M 310 440 L 310 240 L 160 240 L 160 160 L 310 160 L 310 50 Q 400 30, 490 50 L 490 160 L 640 160 L 640 240 L 490 240 L 490 440 Z" fill="#0b1120" stroke="#334155" stroke-width="3" />
              <rect x="375" y="180" width="50" height="260" fill="#7f1d1d" opacity="0.8" rx="2" />
              <rect x="360" y="115" width="80" height="34" rx="4" fill="#e2e8f0" stroke="#f8fafc" stroke-width="2" />
              <text x="400" y="138" fill="#0f172a" font-size="9" font-weight="900" text-anchor="middle">ALTAR</text>
              <rect x="382" y="58" width="36" height="28" rx="3" fill="#eab308" stroke="#fef08a" stroke-width="2" />
              <circle cx="432" cy="72" r="6" fill="#ef4444" opacity="0.9" filter="url(#mvp-glow)" />
              <rect x="330" y="125" width="22" height="24" rx="2" fill="#3b82f6" stroke="#60a5fa" stroke-width="1.5" />
              <text x="341" y="145" fill="#ffffff" font-size="7" font-weight="800" text-anchor="middle">AMBO</text>
              <circle cx="${camX.toFixed(1)}" cy="${camY.toFixed(1)}" r="38" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4 3" filter="url(#mvp-glow)" />
              <circle cx="${camX.toFixed(1)}" cy="${camY.toFixed(1)}" r="7" fill="#38bdf8" />
              <rect x="160" y="18" width="480" height="36" rx="8" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
              <text x="175" y="41" fill="#38bdf8" font-size="12" font-weight="800">⛪ ${stationTitle}</text>
            `;
          }
        });
        return;
      }

      if (clean === 'fractions' || clean === 'fraction') {
        this.setScene({
          id: 'fractions',
          stage: 'KS2 MATHS',
          title: 'Fractions: Why Common Denominators Rule',
          duration: 12.0,
          keyframes: [
            { t: 0.00, title: 'Step 1: Unequal Slices', rule: 'You cannot count slices of different sizes (1/2 + 1/4)!' },
            { t: 0.35, title: 'Step 2: The Equivalence Cut', rule: 'Cut 1/2 in half: (1×2)/(2×2) = 2/4. Same area, new denominator!' },
            { t: 0.70, title: 'Step 3: Vector Fusion', rule: 'Keep denominator 4 and add numerators: 2/4 + 1/4 = 3/4.' },
            { t: 1.00, title: 'Step 4: Solved Proof', rule: '3/4 of the whole! Remember: NEVER add denominators (not 2/6).' }
          ],
          subtitles: [
            { start: 0.0, end: 0.35, en: "Look at 1/2 and 1/4: they are completely different sizes! We cannot count them yet.", es: "Mira 1/2 y 1/4: ¡tienen tamaños diferentes! No podemos sumarlas todavía." },
            { start: 0.35, end: 0.70, en: "Watch the laser slice cut 1/2 into two equal quarters (2/4). The area stays the exact same!", es: "Mira cómo la línea corta 1/2 en dos cuartos (2/4). ¡El área es exactamente igual!" },
            { start: 0.70, end: 1.00, en: "Now they share a common denominator! 2 quarters + 1 quarter equals exactly 3 quarters.", es: "¡Ahora comparten el mismo denominador! 2 cuartos + 1 cuarto son 3 cuartos." }
          ],
          render: (t) => {
            const cx = 400, cy = 240, r = 130;
            return `
              <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#475569" stroke-width="2" stroke-dasharray="6 6" />
              <path d="M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="#3b82f6" fill-opacity="0.8" stroke="#60a5fa" stroke-width="3" />
              <text x="${cx + 50}" y="${cy + 8}" fill="#ffffff" font-size="22" font-weight="bold" text-anchor="middle">1/2</text>
              <rect x="250" y="24" width="300" height="42" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
              <text x="400" y="51" fill="#38bdf8" font-size="17" font-weight="bold" text-anchor="middle">${t < 0.35 ? '1/2 + 1/4 = ?' : '2/4 + 1/4 = 3/4'}</text>
            `;
          }
        });
        return;
      }

      // Built-in fallback orbit scene
      this.setScene({
        id: 'orbit',
        title: 'Planetary Gravitational Orbit',
        stage: 'KS3 PHYSICS',
        duration: 12.0,
        keyframes: [
          { t: 0.0, title: 'Heliocentric Sun', rule: 'Gravitational centripetal force' },
          { t: 0.5, title: 'Perihelion Sweep', rule: 'Peak orbital speed' },
          { t: 1.0, title: 'Orbital Period', rule: 'Completed 360° orbit' }
        ],
        subtitles: [
          { start: 0.0, end: 0.5, en: 'The Sun sits at the focal center, pulling planets into elliptical orbits.' },
          { start: 0.5, end: 1.0, en: 'At perihelion closest approach, orbital speed reaches its maximum.' }
        ],
        render: (t) => {
          const cx = 400, cy = 240, rx = 240, ry = 140;
          const angle = t * Math.PI * 2;
          const px = cx + Math.cos(angle) * rx;
          const py = cy + Math.sin(angle) * ry;
          return `
            <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="6 6"/>
            <circle cx="${cx}" cy="${cy}" r="30" fill="#f59e0b" filter="url(#mvp-glow)"/>
            <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="11" fill="#38bdf8"/>
            <text x="${px.toFixed(1)}" y="${(py + 24).toFixed(1)}" fill="#cbd5e1" font-size="12" font-weight="bold" text-anchor="middle">Planet</text>
          `;
        }
      });
    }

    parseAndSetScene(raw) {
      const trimmed = raw.trim();
      if (trimmed.startsWith('{')) {
        try {
          const json = JSON.parse(trimmed);
          this.setScene(this.compileJsonScene(json));
          return;
        } catch (_) {}
      }
      if (trimmed.startsWith('(')) {
        this.setScene(this.compileSexprScene(trimmed));
        return;
      }
      this.loadPreset('fractions');
    }

    compileJsonScene(json) {
      if (typeof json.render === 'function') return json;
      return {
        id: json.id || 'custom',
        title: json.title || 'AST Vector Scene',
        stage: json.stage || 'CURRICULUM',
        duration: json.duration || 10.0,
        keyframes: json.keyframes || [],
        subtitles: json.subtitles || [],
        render: (t) => {
          if (Array.isArray(json.elements)) {
            return json.elements.map(el => {
              if (el.type === 'circle') return `<circle cx="${el.cx}" cy="${el.cy}" r="${el.r}" fill="${el.fill || '#38bdf8'}"/>`;
              if (el.type === 'orbit-path') return `<ellipse cx="${el.cx}" cy="${el.cy}" rx="${el.rx}" ry="${el.ry}" fill="none" stroke="${el.stroke || '#334155'}" stroke-dasharray="${el.strokeDasharray || '4 4'}"/>`;
              if (el.type === 'particle' && el.orbit) {
                const angle = t * Math.PI * 2 * (el.orbit.speed || 1);
                const x = el.orbit.cx + Math.cos(angle) * el.orbit.rx;
                const y = el.orbit.cy + Math.sin(angle) * el.orbit.ry;
                return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${el.r || 8}" fill="${el.fill || '#38bdf8'}"/><text x="${x.toFixed(1)}" y="${(y+18).toFixed(1)}" fill="#fff" font-size="11" text-anchor="middle">${el.label || ''}</text>`;
              }
              return '';
            }).join('');
          }
          return `<rect x="250" y="200" width="300" height="80" rx="8" fill="#1e293b"/><text x="400" y="248" fill="#38bdf8" font-size="16" font-weight="bold" text-anchor="middle">${json.title || 'Scene'}</text>`;
        }
      };
    }

    compileSexprScene(sexpr) {
      const matchSlot = (re) => {
        const m = sexpr.match(re);
        return m ? m[1].trim().replace(/^"|"$/g, '') : null;
      };
      const title = matchSlot(/:title\s+"([^"]+)"/i) || 'AST Scene';
      const stage = matchSlot(/:stage\s+"([^"]+)"/i) || 'CURRICULUM';
      const duration = parseFloat(matchSlot(/:duration\s+([\d\.]+)/i) || '10.0');

      return {
        id: matchSlot(/:id\s+("[^"]+"|[^\s\)]+)/i) || 'sexpr-scene',
        title,
        stage,
        duration,
        keyframes: [],
        subtitles: [],
        render: (t) => {
          const cx = 400 + Math.sin(t * Math.PI * 2) * 100;
          return `<circle cx="${cx.toFixed(1)}" cy="240" r="28" fill="#38bdf8"/><text x="400" y="50" fill="#38bdf8" font-size="18" font-weight="bold" text-anchor="middle">${title}</text>`;
        }
      };
    }

    setScene(scene) {
      this.scene = scene;
      this.duration = scene.duration || 10.0;
      this.$badge.textContent = scene.stage || 'CURRICULUM';
      this.renderMarkers();
      this.seek(0);
      if (!this.animId) {
        this.lastTimestamp = performance.now();
        this.animId = requestAnimationFrame(this.tick);
      }
    }

    renderMarkers() {
      const old = this.$track.querySelectorAll('.marker');
      old.forEach(m => m.remove());
      if (!this.scene || !this.scene.keyframes) return;
      this.scene.keyframes.forEach(k => {
        const m = document.createElement('div');
        m.className = 'marker';
        m.style.left = `${k.t * 100}%`;
        m.title = `${k.title}: ${k.rule}`;
        this.$track.appendChild(m);
      });
    }

    toggle() {
      this.isPlaying = !this.isPlaying;
      this.$btnPlay.textContent = this.isPlaying ? '⏸ Pause' : '▶ Play';
      this.dispatchEvent(new CustomEvent(this.isPlaying ? 'play' : 'pause'));
    }

    seek(p) {
      this.progress = Math.max(0, Math.min(1, p));
      this.updateFrame();
    }

    speak(text) {
      if (!window.speechSynthesis || !this.voiceEnabled || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.lang = this.lang === 'es' ? 'es-ES' : this.lang === 'fr' ? 'fr-FR' : 'en-GB';
      window.speechSynthesis.speak(u);
    }

    updateFrame() {
      if (!this.scene) return;
      const pct = (this.progress * 100).toFixed(1);
      this.$fill.style.width = `${pct}%`;
      this.$thumb.style.left = `${pct}%`;

      const curSec = Math.floor(this.progress * this.duration);
      const durSec = Math.floor(this.duration);
      this.$readout.textContent = `00:${String(curSec).padStart(2, '0')} / 00:${String(durSec).padStart(2, '0')}`;

      // Render procedural vector
      this.$layer.innerHTML = this.scene.render(this.progress);

      // Subtitles & Voice
      if (this.scene.subtitles && this.scene.subtitles.length) {
        const s = this.scene.subtitles.find(sub => this.progress >= sub.start && this.progress <= sub.end);
        if (s) {
          const txt = s[this.lang] || s.en;
          this.$sub.textContent = txt;
          this.$sub.style.opacity = '1';
        } else {
          this.$sub.style.opacity = '0';
        }
      } else {
        this.$sub.textContent = this.scene.title;
        this.$sub.style.opacity = '0.7';
      }

      // Check keyframe speech
      if (this.scene.keyframes && this.scene.keyframes.length) {
        let activeIdx = -1;
        for (let i = 0; i < this.scene.keyframes.length; i++) {
          if (this.progress >= this.scene.keyframes[i].t) activeIdx = i;
        }
        if (activeIdx !== this.lastSpoken && activeIdx !== -1) {
          this.lastSpoken = activeIdx;
          const kf = this.scene.keyframes[activeIdx];
          this.dispatchEvent(new CustomEvent('keyframe', { detail: kf }));
          if (this.voiceEnabled) this.speak(`${kf.title}. ${kf.rule}`);
        }
      }

      this.dispatchEvent(new CustomEvent('timeupdate', { detail: { progress: this.progress } }));
    }

    tick(time) {
      if (this.isPlaying && this.lastTimestamp !== null) {
        const dt = (time - this.lastTimestamp) / 1000.0;
        this.progress += (dt / this.duration) * this.speed;
        if (this.progress >= 1.0) {
          this.progress = 0.0;
          this.lastSpoken = -1;
          this.dispatchEvent(new CustomEvent('ended'));
        }
        this.updateFrame();
      }
      this.lastTimestamp = time;
      this.animId = requestAnimationFrame(this.tick);
    }
  }

  // Register Custom Element
  if (typeof customElements !== 'undefined' && !customElements.get('micro-vector-player')) {
    customElements.define('micro-vector-player', MicroVectorPlayer);
  }

  window.MicroVectorPlayer = MicroVectorPlayer;
})();
