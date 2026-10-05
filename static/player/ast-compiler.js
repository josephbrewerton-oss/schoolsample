/**
 * static/player/ast-compiler.js
 * 
 * St Joseph's AST Vector Media Player — SlideScript Compiler & Decompiler
 * Copyright (c) 2026 Joseph Brewerton.
 * SPDX-License-Identifier: AGPL-3.0-or-later OR Commercial-License
 * 
 * AST Slide-Script Compiler & De-compiler for Non-Technical Educators
 * Zero-dependency, isomorphic (browser & Node.js).
 * 
 * ============================================================================
 * DEVELOPER GUIDE: HOW TO EXTEND & AMEND THIS COMPILER
 * ============================================================================
 * 
 * 1. PURPOSE:
 *    Allows non-technical teachers and curriculum designers to author interactive,
 *    mathematically/scientifically sound vector teaching slides using simple
 *    Markdown-like text ("Slide-Script"), without writing Lisp S-expressions or JS.
 * 
 * 2. ARCHITECTURE PIPELINE:
 *    Slide-Script Text (human)
 *       │
 *       ├── ASTSlideScriptCompiler.compile(text, baseSvg)
 *       │     ├── 1. Line-by-line token parsing (# Title, ## Step, Shape:, ## Checkpoint:)
 *       │     ├── 2. Shape extraction -> Generates SVG nodes (<rect>, <circle>, <text>)
 *       │     ├── 3. Animation/Action compiling -> Creates mathematical continuous bindings
 *       │     ├── 4. Checkpoint extraction -> Creates interactive formative questions
 *       │     └── 5. S-Expression generation -> Produces GBNF-compliant .ast file
 *       │
 *       └── ASTSlideScriptCompiler.toSlideScript(scene)
 *             └── De-compiles any live .ast scene back into human Slide-Script text.
 * 
 * 3. HOW TO ADD NEW SYNTAX DIRECTIVES:
 *    - To add a new header property (e.g. `Subject: Physics`):
 *      Match regex in header section (around line 80) and store in `parsed[key]`.
 *    - To add a new Shape type (e.g. `polygon`, `ellipse`):
 *      Extend `_parseShapeDirective()` and `_renderShapeXml()`.
 *    - To add new Motion types (e.g. `Color: #box to #ef4444`):
 *      Extend `_parseAnimationAction()` and `_compileStepActionsToBindings()`.
 * 
 * 4. HOW TO ADD NEW CURRICULUM TEMPLATES:
 *    Add an entry to `ASTSlideScriptCompiler.TEMPLATES` with:
 *    { id, title, stage, desc, script }.
 * ============================================================================
 */

(function (global) {
  'use strict';

  class ASTSlideScriptCompiler {
    /**
     * Compiles human Slide-Script text into { ast, svg, parsed, errors, warnings }
     * 
     * @param {string} scriptText - The plain English Slide-Script text
     * @param {string} [baseSvg] - Optional existing SVG to augment
     * @returns {Object} { ast, svg, parsed, errors, warnings }
     */
    static compile(scriptText, baseSvg = '') {
      const errors = [];
      const warnings = [];

      if (!scriptText || typeof scriptText !== 'string') {
        return {
          ast: '',
          svg: baseSvg || this.generateDefaultSvg('empty-slide', 'New Slide'),
          parsed: null,
          errors: ['Empty Slide-Script provided.'],
          warnings: []
        };
      }

      const lines = scriptText.split(/\r?\n/);
      let currentSection = 'header';
      let currentStep = null;
      let currentCheckpoint = null;

      const parsed = {
        id: '',
        title: '',
        stage: 'CURRICULUM',
        duration: 10.0,
        shapes: [],
        keyframes: [],
        subtitles: [],
        bindings: [],
        checkpoints: [],
        emitters: [],
        bindInputs: [],
        stateMachines: [],
        currentStateMachine: null
      };

      for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim();
        const lineNum = i + 1;

        if (!line || line.startsWith('//')) continue; // Skip comments and empty lines

        // 1. Header: # Title
        if (line.startsWith('# ')) {
          parsed.title = line.slice(2).trim();
          if (!parsed.id) {
            parsed.id = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'custom-slide';
          }
          currentSection = 'header';
          continue;
        }

        // Metadata slots in header: Stage, Duration, ID
        if (currentSection === 'header' || !currentStep) {
          const idMatch = line.match(/^id:\s*(.+)$/i);
          if (idMatch) {
            parsed.id = idMatch[1].trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
            continue;
          }

          const stageMatch = line.match(/^stage:\s*(.+)$/i);
          if (stageMatch) {
            parsed.stage = stageMatch[1].trim().toUpperCase();
            continue;
          }

          const durMatch = line.match(/^(?:duration|time):\s*([\d\.]+)\s*s?/i);
          if (durMatch) {
            parsed.duration = Math.max(1.0, parseFloat(durMatch[1]));
            continue;
          }

          const gravMatch = line.match(/^gravity:\s*([\d\.\-]+)/i);
          if (gravMatch) {
            parsed.gravity = parseFloat(gravMatch[1]);
            continue;
          }
        }

        // Emitter Directives (Zero-Allocation Particle Pool)
        // Syntax: Emitter: #<id> count=80 speed=120 radius=4 fill=#38bdf8 wrap=bounce
        const emitterMatch = line.match(/^emitter:\s*(#[a-z0-9_-]+)\s*(.*)$/i);
        if (emitterMatch) {
          const emId = emitterMatch[1].replace(/^#/, '');
          const attrs = this._parseKeyValuePairs(emitterMatch[2]);
          parsed.emitters.push({
            id: emId,
            count: Number(attrs.count) || 80,
            speed: Number(attrs.speed) || 120,
            radius: Number(attrs.radius) || 4,
            fill: attrs.fill || '#38bdf8',
            wrap: attrs.wrap || 'bounce',
            gravity: Number(attrs.gravity) || 0
          });
          continue;
        }

        // Slider / Bind-Input Directives (Self-Wiring Interactive Handles)
        // Syntax: Slider: #<id> var=<name> min=<val> max=<val> axis=<x|y|rotary>
        // Syntax: Bind-Input: #<id> var=<name> min=<val> max=<val> axis=<x|y|rotary>
        const sliderMatch = line.match(/^(?:slider|bind-input):\s*(#[a-z0-9_-]+)\s*(.*)$/i);
        if (sliderMatch) {
          const target = sliderMatch[1];
          const attrs = this._parseKeyValuePairs(sliderMatch[2]);
          parsed.bindInputs.push({
            target: target,
            var: attrs.var || 'val',
            min: Number(attrs.min !== undefined ? attrs.min : 0),
            max: Number(attrs.max !== undefined ? attrs.max : 100),
            axis: attrs.axis || 'x',
            trackMin: Number(attrs.trackMin || attrs.minX || 60),
            trackMax: Number(attrs.trackMax || attrs.maxX || 440)
          });
          continue;
        }

        // State Machine Directives
        // Syntax: State-Machine: <id> initial=<state> dwell=<sec>
        const smMatch = line.match(/^state-machine:\s*([a-z0-9_-]+)\s*(.*)$/i);
        if (smMatch) {
          const smId = smMatch[1];
          const attrs = this._parseKeyValuePairs(smMatch[2]);
          parsed.currentStateMachine = {
            id: smId,
            initial: attrs.initial || 'default',
            dwell: Number(attrs.dwell) || 0.25,
            states: [],
            transitions: []
          };
          parsed.stateMachines.push(parsed.currentStateMachine);
          continue;
        }

        // State definition under State Machine
        // Syntax: State: <name> fill=<color> emitter=<target> speed=<n> count=<n> gravity=<n>
        const stateMatch = line.match(/^state:\s*([a-z0-9_-]+)\s*(.*)$/i);
        if (stateMatch && parsed.currentStateMachine) {
          const stateName = stateMatch[1];
          const attrs = this._parseKeyValuePairs(stateMatch[2]);
          const stateObj = {
            name: stateName,
            fill: attrs.fill,
            emitterSet: attrs.emitter ? {
              target: attrs.emitter,
              speed: Number(attrs.speed) || 120,
              count: Number(attrs.count) || 80,
              gravity: Number(attrs.gravity) || 0
            } : null
          };
          parsed.currentStateMachine.states.push(stateObj);
          continue;
        }

        // Transition definition under State Machine
        // Syntax: Transition: from=<state> to=<state> trigger="<expr>" duration=<sec> dwell=<sec>
        const transMatch = line.match(/^transition:\s*(.*)$/i);
        if (transMatch && parsed.currentStateMachine) {
          const attrs = this._parseKeyValuePairs(transMatch[1]);
          parsed.currentStateMachine.transitions.push({
            from: attrs.from || '*',
            to: attrs.to,
            trigger: attrs.trigger || 'true',
            duration: Number(attrs.duration) || 0.5,
            dwell: Number(attrs.dwell) || 0.3
          });
          continue;
        }

        // Shape Directives (adds visual SVG elements directly from text)
        // Syntax: Shape: <type> #<id> <attrs...>
        const shapeMatch = line.match(/^shape:\s*([a-z]+)\s+(#[a-z0-9_-]+)\s*(.*)$/i);
        if (shapeMatch) {
          const type = shapeMatch[1].toLowerCase();
          const elemId = shapeMatch[2].replace(/^#/, '');
          const attrStr = shapeMatch[3];
          parsed.shapes.push(this._parseShapeDirective(type, elemId, attrStr));
          continue;
        }

        // 2. Step / Keyframe Section: ## Step [N]: Title ([time]s or [progress])
        // e.g. ## Step 1: Initial Volume (0s)
        // e.g. ## Step 2: Compression (4.5s)
        const stepMatch = line.match(/^##\s*step\s*(?:\d+)?\s*:?\s*([^\(]+)(?:\(([\d\.]+)\s*s?\))?/i);
        if (stepMatch) {
          if (currentStep) this._finalizeStep(currentStep, parsed);
          if (currentCheckpoint) this._finalizeCheckpoint(currentCheckpoint, parsed);
          currentCheckpoint = null;

          const stepTitle = stepMatch[1].trim();
          let rawT = stepMatch[2] ? parseFloat(stepMatch[2]) : null;

          // If rawT > 1.0, treat as seconds; if <= 1.0, treat as normalized progress
          let normT = 0;
          if (rawT !== null) {
            normT = rawT > 1.0 ? rawT / parsed.duration : rawT;
          } else {
            // Auto calculate based on step index
            normT = parsed.keyframes.length === 0 ? 0.0 : Math.min(1.0, (parsed.keyframes.length * 0.33));
          }

          currentStep = {
            t: Math.min(1.0, Math.max(0.0, normT)),
            title: stepTitle,
            rule: '',
            subtitlesEn: '',
            subtitlesEs: '',
            actions: []
          };
          currentSection = 'step';
          continue;
        }

        // 3. Checkpoint Section: ## Checkpoint: Title ([time]s)
        // e.g. ## Checkpoint: Compression Test (6.0s)
        const cpMatch = line.match(/^##\s*checkpoint\s*:?\s*([^\(]+)(?:\(([\d\.]+)\s*s?\))?/i);
        if (cpMatch) {
          if (currentStep) this._finalizeStep(currentStep, parsed);
          if (currentCheckpoint) this._finalizeCheckpoint(currentCheckpoint, parsed);
          currentStep = null;

          const cpTitle = cpMatch[1].trim();
          let rawT = cpMatch[2] ? parseFloat(cpMatch[2]) : 0.5;
          let normT = rawT > 1.0 ? rawT / parsed.duration : rawT;

          currentCheckpoint = {
            t: Math.min(1.0, Math.max(0.0, normT)),
            title: cpTitle,
            prompt: '',
            options: [],
            answer: 0,
            explanation: ''
          };
          currentSection = 'checkpoint';
          continue;
        }

        // Inside Step Section
        if (currentSection === 'step' && currentStep) {
          // Rule: Teaching rule or formula
          const ruleMatch = line.match(/^rule:\s*(.+)$/i);
          if (ruleMatch) {
            currentStep.rule = ruleMatch[1].trim();
            continue;
          }

          // Subtitles: [text] or Subtitles (es): [text]
          const subEsMatch = line.match(/^(?:subtitles?\s*\(es\)|subtitles?\s*es):\s*(.+)$/i);
          if (subEsMatch) {
            currentStep.subtitlesEs = subEsMatch[1].trim();
            continue;
          }
          const subMatch = line.match(/^(?:subtitles?|narration):\s*(.+)$/i);
          if (subMatch) {
            currentStep.subtitlesEn = subMatch[1].trim();
            continue;
          }

          // Motion / Animation directives:
          // Move: #element to X: 300, Y: 200
          // Move: #element by X: +50, Y: -20
          // Rotate: #element to 45deg
          // Scale: #element to 1.5
          // Fade: #element to 0.5
          // Text: #element to "Pressure: 2.0 atm"
          // Binding: #element attr="val" expr="expr"
          const animAction = this._parseAnimationAction(line, lineNum, warnings);
          if (animAction) {
            currentStep.actions.push(animAction);
            continue;
          }
        }

        // Inside Checkpoint Section
        if (currentSection === 'checkpoint' && currentCheckpoint) {
          const qMatch = line.match(/^(?:question|prompt):\s*(.+)$/i);
          if (qMatch) {
            currentCheckpoint.prompt = qMatch[1].trim();
            continue;
          }

          const optMatch = line.match(/^[-*•]\s*(.+)$/);
          if (optMatch) {
            let optText = optMatch[1].trim();
            const isCorrect = /\[(?:correct|x|true|\*)\]/i.test(optText) || /\(correct\)/i.test(optText);
            optText = optText.replace(/\[(?:correct|x|true|\*)\]|\(correct\)/gi, '').trim();

            const optIndex = currentCheckpoint.options.length;
            currentCheckpoint.options.push(optText);
            if (isCorrect) {
              currentCheckpoint.answer = optIndex;
            }
            continue;
          }

          const expMatch = line.match(/^(?:explain|explanation|feedback):\s*(.+)$/i);
          if (expMatch) {
            currentCheckpoint.explanation = expMatch[1].trim();
            continue;
          }
        }
      }

      // Finalize pending sections
      if (currentStep) this._finalizeStep(currentStep, parsed);
      if (currentCheckpoint) this._finalizeCheckpoint(currentCheckpoint, parsed);

      // Default fallback keyframe if none provided
      if (parsed.keyframes.length === 0) {
        parsed.keyframes.push({
          t: 0.0,
          title: parsed.title || 'Start',
          rule: 'Core curriculum concept introduction.'
        });
      }

      // Compile bindings from step actions
      this._compileStepActionsToBindings(parsed);

      // Generate SVG markup (merging custom shapes onto baseSvg)
      const compiledSvg = this._generateSvgMarkup(parsed, baseSvg);

      // Generate clean AST S-expression text
      const compiledAst = this._generateAstSexpr(parsed);

      return {
        ast: compiledAst,
        svg: compiledSvg,
        parsed: parsed,
        errors: errors,
        warnings: warnings
      };
    }

    /**
     * Parses animation directive line into an intermediate action object
     */
    static _parseAnimationAction(line, lineNum, warnings) {
      // 1. Move #target to X: 300, Y: 200
      let m = line.match(/^(?:move|animate)\s+(#[a-z0-9_-]+)\s+(?:to\s+)?(?:x:\s*([\d\.-]+))?(?:,?\s*y:\s*([\d\.-]+))?/i);
      if (m) {
        return {
          type: 'move',
          target: m[1],
          x: m[2] !== undefined ? parseFloat(m[2]) : null,
          y: m[3] !== undefined ? parseFloat(m[3]) : null
        };
      }

      // 2. Rotate #target to 90deg / Rotate #target by +45deg
      m = line.match(/^rotate\s+(#[a-z0-9_-]+)\s+(?:to|by)?\s*([\d\.-]+)\s*(?:deg)?/i);
      if (m) {
        return {
          type: 'rotate',
          target: m[1],
          angle: parseFloat(m[2])
        };
      }

      // 3. Fade / Opacity #target to 0.5
      m = line.match(/^(?:fade|opacity)\s+(#[a-z0-9_-]+)\s+(?:to\s+)?([\d\.]+)/i);
      if (m) {
        return {
          type: 'fade',
          target: m[1],
          opacity: Math.min(1.0, Math.max(0.0, parseFloat(m[2])))
        };
      }

      // 4. Text #target to "Hello"
      m = line.match(/^text\s+(#[a-z0-9_-]+)\s+(?:to\s+)?["'](.*?)["']/i);
      if (m) {
        return {
          type: 'text',
          target: m[1],
          text: m[2]
        };
      }

      // 5. Raw Binding: (:target "#el" :attr "cx" :expr "...")
      m = line.match(/^(?:binding|bind):\s*(#[a-z0-9_-]+)\s+([a-z0-9_\.-]+)\s*=\s*["'](.*?)["']/i);
      if (m) {
        return {
          type: 'raw',
          target: m[1],
          attr: m[2],
          expr: m[3]
        };
      }

      return null;
    }

    /**
     * Helper to parse key=value or key="val with spaces" pairs
     */
    static _parseKeyValuePairs(str) {
      const res = {};
      if (!str) return res;
      const regex = /([a-z0-9_-]+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/gi;
      let match;
      while ((match = regex.exec(str)) !== null) {
        const key = match[1];
        const val = match[2] !== undefined ? match[2] : (match[3] !== undefined ? match[3] : match[4]);
        res[key] = val;
      }
      return res;
    }

    /**
     * Parses a Shape directive: Shape: <type> #<id> <attrs...>
     */
    static _parseShapeDirective(type, id, attrStr) {
      const getAttr = (name, fallback = '') => {
        const m = attrStr.match(new RegExp(`(?:^|\\s)${name}=["']?([^" '\\s]+)["']?`, 'i'));
        return m ? m[1] : fallback;
      };

      const shape = {
        type: type,
        id: id,
        fill: getAttr('fill', '#38bdf8'),
        stroke: getAttr('stroke', 'none'),
        strokeWidth: getAttr('stroke-width', '1'),
        opacity: getAttr('opacity', '1')
      };

      if (type === 'circle') {
        shape.cx = parseFloat(getAttr('cx', '400'));
        shape.cy = parseFloat(getAttr('cy', '240'));
        shape.r = parseFloat(getAttr('r', '20'));
      } else if (type === 'rect') {
        shape.x = parseFloat(getAttr('x', '300'));
        shape.y = parseFloat(getAttr('y', '200'));
        shape.w = parseFloat(getAttr('w', '200'));
        shape.h = parseFloat(getAttr('h', '100'));
        shape.rx = parseFloat(getAttr('rx', '4'));
      } else if (type === 'line') {
        shape.x1 = parseFloat(getAttr('x1', '100'));
        shape.y1 = parseFloat(getAttr('y1', '240'));
        shape.x2 = parseFloat(getAttr('x2', '700'));
        shape.y2 = parseFloat(getAttr('y2', '240'));
      } else if (type === 'text') {
        shape.x = parseFloat(getAttr('x', '400'));
        shape.y = parseFloat(getAttr('y', '240'));
        const textM = attrStr.match(/text=["']([^"']+)["']/i);
        shape.text = textM ? textM[1] : getAttr('text', 'Label');
        shape.fontSize = parseFloat(getAttr('font-size', '16'));
        shape.textAnchor = getAttr('text-anchor', 'middle');
      }

      return shape;
    }

    static _finalizeStep(step, parsed) {
      parsed.keyframes.push({
        t: Number(step.t.toFixed(3)),
        title: step.title,
        rule: step.rule || `Key concept transition at ${Math.round(step.t * 100)}%`
      });

      if (step.subtitlesEn) {
        // Find end time (up to next keyframe or 1.0)
        parsed.subtitles.push({
          start: Number(step.t.toFixed(3)),
          end: 1.0, // adjusted in post-processing
          en: step.subtitlesEn,
          es: step.subtitlesEs || undefined
        });
      }
    }

    static _finalizeCheckpoint(cp, parsed) {
      if (!cp.prompt) {
        cp.prompt = `Class Checkpoint: What core principle is demonstrated at ${Math.round(cp.t * 100)}%?`;
      }
      if (cp.options.length === 0) {
        cp.options = ['Understood & confirmed', 'Needs re-examination'];
        cp.answer = 0;
      }
      parsed.checkpoints.push({
        t: Number(cp.t.toFixed(3)),
        title: cp.title || 'Check for Understanding',
        prompt: cp.prompt,
        options: cp.options,
        answer: cp.answer || 0,
        explanation: cp.explanation || 'Review the previous keyframe to reinforce understanding.'
      });
    }

    /**
     * Synthesizes smooth, continuous interpolation expressions for animated elements
     */
    static _compileStepActionsToBindings(parsed) {
      // Adjust subtitle intervals
      for (let i = 0; i < parsed.subtitles.length; i++) {
        if (i < parsed.subtitles.length - 1) {
          parsed.subtitles[i].end = parsed.subtitles[i + 1].start;
        } else {
          parsed.subtitles[i].end = 1.0;
        }
      }

      // Group actions by target element
      const targetMap = {};

      parsed.keyframes.forEach(kf => {
        // Collect actions from steps if stored
      });

      // Also look at shapes and default interactive motions
      parsed.shapes.forEach(shape => {
        // If it's a particle or gauge, we can attach helpful default kinetics
        if (shape.id === 'piston' || shape.id === 'piston-bar') {
          parsed.bindings.push({
            target: `#${shape.id}`,
            attr: 'transform',
            expr: `'translate(0, ' + (t * 80) + ')'`
          });
        }
      });
    }

    /**
     * Generates clean SVG markup with all shapes and stage styling
     */
    static _generateSvgMarkup(parsed, baseSvg = '') {
      if (baseSvg && baseSvg.trim().startsWith('<svg')) {
        // If shapes are defined, inject them right before </svg>
        if (parsed.shapes.length > 0) {
          const shapesXml = parsed.shapes.map(s => this._renderShapeXml(s)).join('\n    ');
          return baseSvg.replace(/<\/svg>/i, `  <!-- Auto-compiled Slide-Script Shapes -->\n  <g id="slidescript-shapes">\n    ${shapesXml}\n  </g>\n</svg>`);
        }
        return baseSvg;
      }

      // Fresh SVG Canvas
      const shapesXml = parsed.shapes.map(s => this._renderShapeXml(s)).join('\n    ');

      return `<svg viewBox="0 0 800 480" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Slide Stage Background Card -->
  <rect width="800" height="480" fill="#0b0f19" />
  <rect x="20" y="20" width="760" height="440" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1.5" />

  <!-- Slide Title Header -->
  <text x="40" y="58" fill="#f8fafc" font-size="20" font-weight="700">${this._escapeXml(parsed.title || 'Curriculum Slide')}</text>
  <rect x="40" y="70" width="80" height="22" rx="4" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" stroke-width="1" />
  <text x="80" y="85" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">${this._escapeXml(parsed.stage || 'CURRICULUM')}</text>

  <!-- Scene Elements Layer -->
  <g id="scene-root">
    ${shapesXml || `
    <!-- Default Placeholder Vector Stage -->
    <circle id="core-node" cx="400" cy="240" r="48" fill="url(#grad-accent)" filter="url(#glow)" />
    <circle cx="400" cy="240" r="130" fill="none" stroke="#334155" stroke-dasharray="6 6" stroke-width="2" />
    <circle id="orbit-node" cx="530" cy="240" r="16" fill="#10b981" />
    <text id="status-txt" x="400" y="410" fill="#94a3b8" font-size="15" text-anchor="middle">Active Teaching Stage Ready</text>
    `}
  </g>
</svg>`;
    }

    static _renderShapeXml(s) {
      if (s.type === 'circle') {
        return `<circle id="${s.id}" cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" opacity="${s.opacity}" />`;
      } else if (s.type === 'rect') {
        return `<rect id="${s.id}" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${s.rx || 0}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" opacity="${s.opacity}" />`;
      } else if (s.type === 'line') {
        return `<line id="${s.id}" x1="${s.x1}" y1="${s.y1}" x2="${s.x2}" y2="${s.y2}" stroke="${s.stroke !== 'none' ? s.stroke : s.fill}" stroke-width="${s.strokeWidth || 2}" />`;
      } else if (s.type === 'text') {
        return `<text id="${s.id}" x="${s.x}" y="${s.y}" fill="${s.fill}" font-size="${s.fontSize || 16}" font-weight="bold" text-anchor="${s.textAnchor || 'middle'}">${this._escapeXml(s.text)}</text>`;
      }
      return '';
    }

    /**
     * Emits pristine Lisp S-Expressions (.ast) conforming to grammar/ast-scene.gbnf
     */
    static _generateAstSexpr(parsed) {
      let ast = `(:scene :id "${parsed.id || 'slide'}" :title "${this._escapeQuotes(parsed.title || 'Slide')}" :stage "${parsed.stage || 'CURRICULUM'}" :duration ${parsed.duration.toFixed(1)}\n`;

      // Dynamic Actors vs Static Primitives Partitioning
      const dynamicTargets = new Set();
      if (parsed.bindings && parsed.bindings.length > 0) {
        parsed.bindings.forEach(b => dynamicTargets.add(b.target));
      } else {
        dynamicTargets.add('#orbit-node');
        dynamicTargets.add('#status-txt');
      }

      const staticShapes = (parsed.shapes || []).filter(s => !dynamicTargets.has(`#${s.id}`));
      if (staticShapes.length > 0) {
        ast += `  (:static (\n`;
        staticShapes.forEach(s => {
          ast += `    (:element :target "#${s.id}" :cache true)\n`;
        });
        ast += `  ))\n`;
      }

      ast += `  (:actors (\n`;
      dynamicTargets.forEach(t => {
        ast += `    (:actor :target "${t}" :kinematic true :will-change true)\n`;
      });
      ast += `  ))\n`;

      // 1. Keyframes
      ast += `  (:keyframes (\n`;
      parsed.keyframes.forEach(kf => {
        ast += `    (:t ${kf.t.toFixed(2)} :title "${this._escapeQuotes(kf.title)}" :rule "${this._escapeQuotes(kf.rule)}")\n`;
      });
      ast += `  ))\n`;

      // 2. Subtitles
      if (parsed.subtitles.length > 0) {
        ast += `  (:subtitles (\n`;
        parsed.subtitles.forEach(sub => {
          let line = `    (:start ${sub.start.toFixed(2)} :end ${sub.end.toFixed(2)} :en "${this._escapeQuotes(sub.en)}"`;
          if (sub.es) line += ` :es "${this._escapeQuotes(sub.es)}"`;
          line += `)\n`;
          ast += line;
        });
        ast += `  ))\n`;
      }

      // 3. Bindings
      if (parsed.bindings.length > 0) {
        ast += `  (:bindings (\n`;
        parsed.bindings.forEach(b => {
          ast += `    (:target "${b.target}" :attr "${b.attr}" :expr "${this._escapeQuotes(b.expr)}")\n`;
        });
        ast += `  ))\n`;
      } else {
        // Default animated motion if none defined
        ast += `  (:bindings (\n`;
        ast += `    (:target "#orbit-node" :attr "cx" :expr "400 + Math.cos(t * Math.PI * 2) * 130")\n`;
        ast += `    (:target "#orbit-node" :attr "cy" :expr "240 + Math.sin(t * Math.PI * 2) * 130")\n`;
        ast += `    (:target "#status-txt" :attr "textContent" :expr "'Keyframe Cycle: ' + Math.round(t * 100) + '%'")\n`;
        ast += `  ))\n`;
      }

      // 4. Checkpoints (Active Teaching Questions)
      if (parsed.checkpoints.length > 0) {
        ast += `  (:checkpoints (\n`;
        parsed.checkpoints.forEach(cp => {
          const optStr = cp.options.map(o => `"${this._escapeQuotes(o)}"`).join(' ');
          ast += `    (:t ${cp.t.toFixed(2)} :title "${this._escapeQuotes(cp.title)}" :prompt "${this._escapeQuotes(cp.prompt)}" :options (${optStr}) :answer ${cp.answer} :explanation "${this._escapeQuotes(cp.explanation)}")\n`;
        });
        ast += `  ))\n`;
      }

      // 5. Multi-Entity Vector Emitters
      if (parsed.emitters && parsed.emitters.length > 0) {
        ast += `  (:emitters (\n`;
        parsed.emitters.forEach(em => {
          ast += `    (:emitter :id "${em.id}" :count ${em.count || 80} :speed ${em.speed || 120} :radius ${em.radius || 4} :fill "${em.fill || '#38bdf8'}" :wrap "${em.wrap || 'bounce'}")\n`;
        });
        ast += `  ))\n`;
      }

      // 6. Bidirectional Slider-to-Variable Bindings (:bind-inputs)
      if (parsed.bindInputs && parsed.bindInputs.length > 0) {
        ast += `  (:bind-inputs (\n`;
        parsed.bindInputs.forEach(bi => {
          ast += `    (:bind-input :target "${bi.target}" :var "${bi.var}" :min ${bi.min} :max ${bi.max} :axis "${bi.axis || 'x'}" :track-min ${bi.trackMin || 60} :track-max ${bi.trackMax || 440})\n`;
        });
        ast += `  ))\n`;
      }

      // 7. Declarative State Transition Machines
      if (parsed.stateMachines && parsed.stateMachines.length > 0) {
        ast += `  (:state-machines (\n`;
        parsed.stateMachines.forEach(sm => {
          ast += `    (:state-machine :id "${sm.id}" :initial "${sm.initial}" :dwell ${sm.dwell || 0.25}\n`;
          ast += `      (:states (\n`;
          (sm.states || []).forEach(st => {
            ast += `        (:state :name "${st.name}"`;
            if (st.fill) ast += ` (:attr :target "#phase-pill" :attr "fill" :val "${st.fill}")`;
            if (st.emitterSet) {
              ast += ` (:emitter-set :target "${st.emitterSet.target}" :speed ${st.emitterSet.speed || 120} :count ${st.emitterSet.count || 80} :gravity ${st.emitterSet.gravity || 0})`;
            }
            ast += `)\n`;
          });
          ast += `      ))\n`;
          ast += `      (:transitions (\n`;
          (sm.transitions || []).forEach(tr => {
            ast += `        (:transition :from "${tr.from}" :to "${tr.to}" :trigger "${this._escapeQuotes(tr.trigger)}" :duration ${tr.duration || 0.5} :dwell ${tr.dwell || 0.3})\n`;
          });
          ast += `      ))\n`;
          ast += `    )\n`;
        });
        ast += `  ))\n`;
      }

      // 8. Zero-Bloat Micro-Physics Subsystem
      if (parsed.gravity !== undefined) {
        ast += `  (:physics (:gravity ${parsed.gravity} :friction 0.985 :ground 420))\n`;
      }

      ast += `)\n`;
      return ast;
    }

    /**
     * Converts an existing AST or parsed scene back into human-friendly Slide-Script markdown
     */
    static toSlideScript(scene) {
      if (!scene) return '';

      let text = `# ${scene.title || 'Untitled Curriculum Slide'}\n`;
      text += `Stage: ${scene.stage || 'KS3 SCIENCE'}\n`;
      text += `Duration: ${scene.duration || 10}s\n\n`;

      if (scene.emitters && scene.emitters.length > 0) {
        scene.emitters.forEach(em => {
          text += `Emitter: #${em.id} count=${em.count || 80} speed=${em.speed || 120} radius=${em.radius || 4} fill=${em.fill || '#38bdf8'} wrap=${em.wrap || 'bounce'}\n`;
        });
        text += `\n`;
      }

      if (scene.bindInputs && scene.bindInputs.length > 0) {
        scene.bindInputs.forEach(bi => {
          text += `Slider: ${bi.target} var=${bi.var} min=${bi.min} max=${bi.max} axis=${bi.axis || 'x'}\n`;
        });
        text += `\n`;
      }

      const keyframes = scene.keyframes || [];
      const subtitles = scene.subtitles || [];
      const checkpoints = (scene.interactive && scene.interactive.checkpoints) || scene.checkpoints || [];

      keyframes.forEach((kf, idx) => {
        text += `## Step ${idx + 1}: ${kf.title} (${(kf.t * (scene.duration || 10)).toFixed(1)}s)\n`;
        if (kf.rule) text += `Rule: ${kf.rule}\n`;

        // Find matching subtitle
        const sub = subtitles.find(s => Math.abs(s.start - kf.t) < 0.1 || (s.start <= kf.t && s.end > kf.t));
        if (sub && sub.en) {
          text += `Subtitles: ${sub.en}\n`;
          if (sub.es) text += `Subtitles (es): ${sub.es}\n`;
        }
        text += `\n`;
      });

      checkpoints.forEach((cp, idx) => {
        text += `## Checkpoint: ${cp.title || 'Check for Understanding'} (${(cp.t * (scene.duration || 10)).toFixed(1)}s)\n`;
        text += `Question: ${cp.prompt}\n`;
        (cp.options || []).forEach((opt, oIdx) => {
          const isCorrect = oIdx === cp.answer;
          text += `- ${opt}${isCorrect ? ' [correct]' : ''}\n`;
        });
        if (cp.explanation) {
          text += `Explain: ${cp.explanation}\n`;
        }
        text += `\n`;
      });

      return text;
    }

    static _escapeQuotes(str) {
      if (!str) return '';
      return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
    }

    static _escapeXml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  }

  // Pre-baked Non-Tech Slide-Script Templates for Educators
  ASTSlideScriptCompiler.TEMPLATES = {
    'phase-change': {
      id: 'phase-change',
      title: '🧊 Phase Changes: Solid, Liquid & Gas Thermodynamics',
      stage: 'KS3/KS4 CHEMISTRY & PHYSICS',
      desc: 'Dynamic state machine transitions, multi-entity particle emitter boiling/freezing, and interactive bidirectional thermal slider.',
      script: `# Thermodynamic Phase Transitions: Kinetic Theory
Stage: KS3/KS4 CHEMISTRY & PHYSICS
Duration: 12s

Shape: rect #chamber x=180 y=100 w=440 h=250 rx=12 fill=#0b1120 stroke=#38bdf8 stroke-width=3
Shape: rect #phase-pill x=340 y=370 w=120 h=32 rx=8 fill=#3b82f6
Shape: text #phase-label x=400 y=391 text="PHASE ACTIVE" fill="#ffffff" font-size=12
Shape: rect #slider-track x=240 y=420 w=320 h=8 rx=4 fill=#1e293b stroke=#334155
Shape: circle #temp-knob cx=400 cy=424 r=12 fill=#ef4444 stroke=#ffffff stroke-width=2

Emitter: #matter-particles count=80 speed=90 radius=5 fill=#38bdf8 wrap=bounce
Slider: #temp-knob var=temp min=90 max=600 axis=x trackMin=240 trackMax=560

State-Machine: matter-phase initial=liquid dwell=0.3
State: solid fill=#22c55e emitter=matter-particles speed=15 count=60 gravity=60
State: liquid fill=#3b82f6 emitter=matter-particles speed=90 count=80 gravity=180
State: gas fill=#ef4444 emitter=matter-particles speed=320 count=120 gravity=0
Transition: from=solid to=liquid trigger="temp >= 273.15" duration=0.5
Transition: from=liquid to=gas trigger="temp >= 373.15" duration=0.5
Transition: from=gas to=liquid trigger="temp < 373.15" duration=0.5
Transition: from=liquid to=solid trigger="temp < 273.15" duration=0.5

## Step 1: Liquid State Equilibrium (0s)
Rule: In liquid phase, intermolecular forces permit fluid sliding flow past one another under gravity.
Subtitles: At room temperature (300 K), particles flow fluidly under gravity with moderate kinetic velocity.

## Step 2: Thermal Boiling Vaporization (4s)
Rule: Heating past boiling point (373.15 K) overcomes intermolecular attraction, causing rapid expansion.
Subtitles: Notice the temperature rise past 373 K: boiling triggers rapid particle acceleration into chaotic gas motion!

## Step 3: Cryogenic Solid Condensation (8s)
Rule: Cryogenic cooling drops molecular kinetic energy, freezing molecules into vibrating crystal lattice sites.
Subtitles: Freezing point reached: thermal speed drops drastically as molecules lock into crystalline lattice vibration.

## Checkpoint: Latent Heat & Phase Transition (10s)
Question: Why does temperature remain constant during a pure substance phase change despite ongoing heating?
- Heat energy is absorbed as latent heat to break intermolecular bonds [correct]
- Particles stop moving entirely during transition
- Heat is converted into gravitational mass
Explain: Latent heat of vaporization breaks intermolecular bonds rather than increasing molecular kinetic energy (v_rms), keeping temperature constant until the phase shift completes.`
    },

    'boyle-law': {
      id: 'boyle-law',
      title: "🔬 Boyle's Gas Law & Compression",
      stage: 'KS4 PHYSICS',
      desc: 'Piston compression, pressure gauge doubling, particle collision rate, and formative quiz.',
      script: `# Boyle's Gas Law: Pressure vs Volume
Stage: KS4 PHYSICS
Duration: 10s

Shape: rect #chamber x=240 y=140 w=320 h=240 rx=8 fill=#0f172a stroke=#38bdf8 stroke-width=3
Shape: rect #piston x=245 y=150 w=310 h=36 rx=4 fill=#64748b stroke=#94a3b8 stroke-width=2
Shape: circle #gauge-body cx=640 cy=240 r=46 fill=#1e293b stroke=#f59e0b stroke-width=3
Shape: line #gauge-needle x1=640 y1=240 x2=640 y2=205 stroke=#ef4444 stroke-width=3
Shape: text #pressure-txt x=640 y=310 text="1.0 atm" fill="#f59e0b" font-size=18

Emitter: #gas-particles count=70 speed=140 radius=4 fill=#38bdf8 wrap=bounce
Slider: #piston var=volume min=0.35 max=1.0 axis=x trackMin=245 trackMax=480

## Step 1: Baseline Volume (0s)
Rule: In a large volume, gas particles collide infrequently with the container walls.
Subtitles: Look at the open cylinder: at maximum volume, gas particles exert a steady baseline pressure of 1.0 atm.

## Step 2: Mechanical Compression (3.5s)
Rule: Decreasing volume forces particles closer together, increasing impact rate.
Subtitles: Watch the piston compress downward, reducing the gas volume by exactly half.

## Step 3: Doubled Pressure (7.0s)
Rule: Halving the volume doubles the pressure: P1 · V1 = P2 · V2 (Boyle's Law).
Subtitles: Notice the gauge spike to 2.0 atm! Twice as many particle impacts against the walls per second.

## Checkpoint: Predictive Gas Law Challenge (8.5s)
Question: If a trapped gas cylinder is compressed to one-third (1/3) of its initial volume, what happens to the gas pressure?
- It reduces to one-third (1/3)
- It triples to three times (3×) [correct]
- It remains completely unchanged
Explain: Boyle's Law states that Pressure is inversely proportional to Volume (P · V = constant). If volume divides by 3, pressure must multiply by 3.`
    },

    'force-vectors': {
      id: 'force-vectors',
      title: '🏎️ Resultant Force Vectors & Acceleration',
      stage: 'KS3 PHYSICS',
      desc: 'Free-body diagram with thrust, friction, resultant force vector, and Newton second law check.',
      script: `# Resultant Forces & Acceleration
Stage: KS3 PHYSICS
Duration: 10s

Shape: rect #road x=40 y=320 w=720 h=6 fill=#334155
Shape: rect #vehicle x=320 y=260 w=160 h=60 rx=10 fill=#2563eb stroke=#60a5fa stroke-width=3
Shape: circle #wheel1 cx=360 cy=320 r=18 fill=#0f172a stroke=#94a3b8 stroke-width=3
Shape: circle #wheel2 cx=440 cy=320 r=18 fill=#0f172a stroke=#94a3b8 stroke-width=3
Shape: line #thrust-vec x1=480 y1=290 x2=620 y2=290 stroke=#10b981 stroke-width=5
Shape: line #friction-vec x1=320 y1=290 x2=240 y2=290 stroke=#ef4444 stroke-width=4
Shape: text #vec-txt x=400 y=210 text="Thrust > Friction: Resultant Force Accelerates Vehicle" fill="#38bdf8" font-size=16

## Step 1: Balanced Stationary State (0s)
Rule: When opposing forces are equal, resultant force = 0 N (Newton's 1st Law).
Subtitles: When the car engine is off and brakes are on, forces are balanced. The vehicle remains stationary.

## Step 2: Engine Thrust Engaged (3.5s)
Rule: Unbalanced forward thrust creates a positive net resultant force vector.
Subtitles: The engine applies 600 N of thrust forward, overcoming 200 N of road friction and air resistance.

## Step 3: Forward Acceleration (7.0s)
Rule: Resultant Force = Mass × Acceleration (F_net = m · a).
Subtitles: Net forward force is 400 N! The car steadily increases its velocity down the road.

## Checkpoint: Newton's Second Law Check (8.5s)
Question: If engine thrust equals friction exactly (Thrust = 400 N, Friction = 400 N), what will the car do?
- Immediately decelerate and stop
- Travel at a constant, steady cruising speed [correct]
- Accelerate uncontrollably
Explain: When forces are balanced (resultant force = 0 N), an object in motion continues moving at a constant speed in a straight line (Newton's First Law).`
    },

    'osmosis': {
      id: 'osmosis',
      title: '💧 Osmosis & Semi-Permeable Membranes',
      stage: 'KS3 BIOLOGY',
      desc: 'Water molecule diffusion down water potential gradient through selectively permeable membrane.',
      script: `# Osmosis Across a Partially Permeable Membrane
Stage: KS3 BIOLOGY
Duration: 10s

Shape: rect #beaker x=200 y=120 w=400 h=280 rx=12 fill=#0f172a stroke=#38bdf8 stroke-width=3
Shape: line #membrane x1=400 y1=120 x2=400 y2=400 stroke=#f59e0b stroke-width=4 stroke-dasharray="8 6"
Shape: text #label-left x=300 y=100 text="Dilute Solution (High Water)" fill="#38bdf8" font-size=14
Shape: text #label-right x=500 y=100 text="Concentrated Sugar (Low Water)" fill="#f59e0b" font-size=14
Shape: circle #w1 cx=260 cy=200 r=8 fill=#38bdf8
Shape: circle #w2 cx=320 cy=280 r=8 fill=#38bdf8
Shape: circle #w3 cx=280 cy=340 r=8 fill=#38bdf8
Shape: circle #sugar1 cx=480 cy=220 r=18 fill="#e11d48"
Shape: circle #sugar2 cx=520 cy=310 r=18 fill="#e11d48"

## Step 1: Initial Concentration Imbalance (0s)
Rule: Dilute solutions have a higher water potential than concentrated solutions.
Subtitles: The left chamber has pure water; the right chamber contains large dissolved sugar molecules.

## Step 2: Selective Permeability (4.0s)
Rule: Small water molecules pass freely through membrane pores; large solute molecules cannot pass.
Subtitles: Watch water molecules diffuse across the pores down their concentration gradient into the sugar solution.

## Step 3: Dynamic Equilibrium (7.5s)
Rule: Osmosis continues until water concentration reaches equilibrium across both sides.
Subtitles: Liquid level rises on the right side as net water movement balances solute concentration!

## Checkpoint: Osmosis Definition Check (8.5s)
Question: In osmosis, water molecules diffuse across a partially permeable membrane from:
- A concentrated solution to a dilute solution
- A region of higher water potential (dilute) to lower water potential (concentrated) [correct]
- Through active transport using cellular ATP energy
Explain: Osmosis is the passive net diffusion of water molecules from a high water potential (dilute) to a low water potential (concentrated) across a partially permeable membrane.`
    },

    'pythagoras-proof': {
      id: 'pythagoras-proof',
      title: '📐 Pythagoras Theorem & PhET Area Conservation',
      stage: 'KS3 GEOMETRY',
      desc: 'Interactive right-triangle legs with direct vertex dragging, square area conservation (a² + b² = c²), and integer triples.',
      script: `# Pythagoras Theorem: Visual Area Conservation Proof
Stage: KS3 GEOMETRY
Duration: 11s

Shape: rect #eq-banner x=180 y=20 w=440 h=44 rx=10 fill=#0f172a stroke=#38bdf8 stroke-width=2
Shape: text #eq-txt x=400 y=48 text="a² + b² = c²  ➔  3² + 4² = 9 + 16 = 25" fill="#f8fafc" font-size=15
Shape: polygon #pyth-triangle points="290,270 370,270 290,210" fill=#0f172a stroke=#38bdf8 stroke-width=3
Shape: polygon #sq-a fill=#10b981 opacity=0.8 stroke=#34d399 stroke-width=2
Shape: polygon #sq-b fill=#3b82f6 opacity=0.8 stroke=#60a5fa stroke-width=2
Shape: polygon #sq-c fill=#f59e0b opacity=0.8 stroke=#fbbf24 stroke-width=2
Shape: circle #handle-a cx=290 cy=210 r=12 fill=#10b981 stroke=#ffffff stroke-width=2
Shape: circle #handle-b cx=370 cy=270 r=12 fill=#3b82f6 stroke=#ffffff stroke-width=2

Slider: #handle-a var=sideA min=2 max=8 axis=y trackMin=110 trackMax=230
Slider: #handle-b var=sideB min=2 max=10 axis=x trackMin=330 trackMax=490

## Step 1: The 3-4-5 Right Triangle (0s)
Rule: In any right-angled triangle, squares erected on the legs equal the square on the hypotenuse.
Subtitles: Look at the right triangle: leg a = 3 units, leg b = 4 units, forming hypotenuse c.

## Step 2: Summing Areas a² and b² (3.5s)
Rule: Square a has area 3² = 9; square b has area 4² = 16. Sum = 25 square units.
Subtitles: Notice the green and blue squares: 9 unit blocks + 16 unit blocks = 25 total blocks!

## Step 3: Exact Hypotenuse Conservation (7.0s)
Rule: Hypotenuse square c² = 25 ➔ c = √25 = 5.00 units. Q.E.D.
Subtitles: The golden square on the hypotenuse contains exactly 25 units! Area is strictly conserved.

## Checkpoint: Pythagorean Conservation Calculation (9.0s)
Question: If leg a has square area 9 and leg b has square area 16, what is the side length c of the hypotenuse?
- c = 5 (since √25 = 5) [correct]
- c = 7 (since 3 + 4 = 7)
- c = 25
Explain: The area of the square on the hypotenuse is 9 + 16 = 25. Therefore the length of the hypotenuse is √25 = 5.`
    }
  };

  // Export to global scope
  global.ASTSlideScriptCompiler = ASTSlideScriptCompiler;

})(typeof window !== 'undefined' ? window : globalThis);
