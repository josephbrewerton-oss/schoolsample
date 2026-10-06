/**
 * static/player/ast-registry.js
 *
 * St Joseph's Educational Media Suite - Zero-Bloat AST Scene Registry
 * Copyright (c) 2026 Joseph Brewerton.
 * SPDX-License-Identifier: AGPL-3.0-or-later OR Commercial-License
 *
 * Declarative catalog loader for .ast and .svg curriculum scenes.
 * Replaces legacy monolithic ast-scenes.js with on-demand streaming.
 */

(function (global) {
  'use strict';

  const scenes = {};

  const SceneRegistry = {
    register(id, scene) {
      if (!id) return;
      const norm = this.normalizeId(id);
      scenes[norm] = Object.assign({ id: norm }, scene);
      if (norm !== id) scenes[id] = scenes[norm];
      return scenes[norm];
    },

    get(id) {
      if (!id) return null;
      const norm = this.normalizeId(id);
      return scenes[norm] || scenes[id] || null;
    },

    getScene(id) {
      return this.get(id);
    },

    has(id) {
      if (!id) return false;
      const norm = this.normalizeId(id);
      return Boolean(scenes[norm] || scenes[id]);
    },

    list() {
      const seen = new Set();
      const result = [];
      Object.keys(scenes).forEach(k => {
        const s = scenes[k];
        if (s && s.id && !seen.has(s.id)) {
          seen.add(s.id);
          result.push({
            id: s.id,
            title: s.title || s.id,
            stage: s.stage || 'CURRICULUM',
            duration: s.duration || 14.0,
            has3D: Boolean(s.has3D),
            svgFile: s.svgFile || `scenes/${s.id}.svg`,
            astFile: s.astFile || `scenes/${s.id}.ast`,
            keyframeCount: s.keyframeCount || (s.keyframes ? s.keyframes.length : 0),
            subtitleCount: s.subtitleCount || (s.subtitles ? s.subtitles.length : 0)
          });
        }
      });
      return result;
    },

    normalizeId(id) {
      if (!id || typeof id !== 'string') return '';
      return id.toLowerCase().trim()
        .replace(/^(demo-|scene-|preset-)/, '')
        .replace(/\.(ast|svg|json)$/, '');
    },

    parseAstMetadata(content, id) {
      if (!content || typeof content !== 'string') return null;
      const titleMatch = content.match(/:title\s+"([^"]+)"/i);
      const stageMatch = content.match(/:stage\s+"([^"]+)"/i);
      const durationMatch = content.match(/:duration\s+([\d\.]+)/i);
      const keyframeCount = (content.match(/\(:t\s+[\d\.]+/gi) || []).length;
      const subtitleCount = (content.match(/\(:start\s+[\d\.]+/gi) || []).length;
      const has3D = content.includes(':3d-') || content.includes(':camera');

      return {
        id: id || 'custom-scene',
        title: titleMatch ? titleMatch[1] : (id || 'Custom Scene'),
        stage: stageMatch ? stageMatch[1] : 'CURRICULUM',
        duration: durationMatch ? parseFloat(durationMatch[1]) : 14.0,
        has3D: Boolean(has3D),
        keyframeCount,
        subtitleCount,
        svgFile: `scenes/${id}.svg`,
        astFile: `scenes/${id}.ast`
      };
    },

    registerFromAstText(id, content) {
      const meta = this.parseAstMetadata(content, id);
      if (meta) {
        return this.register(id, meta);
      }
      return null;
    },

    /**
     * Auto-Finds available scenes dynamically without requiring teachers to edit index files:
     * 1. Probes live dynamic API (/api/scenes or /player/api/scenes)
     * 2. Scrapes HTML directory index (e.g. static server directory listing)
     * 3. Falls back to pre-compiled manifest
     */
    async autoDiscover(basePath = './') {
      const base = (basePath || './').replace(/\/?$/, '/');

      // 1. Try Live Dynamic Discovery Endpoints (Vite / Dev / API Server)
      const dynamicUrls = ['/api/scenes', '/player/api/scenes', `${base}api/scenes`];
      for (const endpoint of dynamicUrls) {
        try {
          const res = await fetch(endpoint).catch(() => null);
          if (res && res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.scenes) && data.scenes.length > 0) {
              data.scenes.forEach(sc => {
                if (sc && sc.id) SceneRegistry.register(sc.id, sc);
              });
              return data;
            }
          }
        } catch (_) {}
      }

      // 2. Try HTML directory index probe on scenes/ (Nginx autoindex, Python http.server, Apache)
      try {
        const scenesIndexRes = await fetch(`${base}scenes/`).catch(() => null);
        if (scenesIndexRes && scenesIndexRes.ok) {
          const html = await scenesIndexRes.text();
          const hrefRegex = /href=["']([^"']+\.ast)["']/gi;
          let match;
          let discovered = 0;
          while ((match = hrefRegex.exec(html)) !== null) {
            const rawFile = match[1].split('/').pop();
            const id = rawFile.replace('.ast', '');
            if (id && !SceneRegistry.has(id)) {
              SceneRegistry.register(id, {
                id,
                title: id.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                stage: 'CURRICULUM',
                duration: 14.0,
                svgFile: `scenes/${id}.svg`,
                astFile: `scenes/${id}.ast`
              });
              discovered++;
            }
          }
          if (discovered > 0) {
            return { totalScenes: Object.keys(scenes).length, scenes: SceneRegistry.list() };
          }
        }
      } catch (_) {}

      // 3. Fallback: Load static configuration manifest
      return this.loadConfig(`${base}scenes.manifest.json`);
    },

    async loadConfig(url = './scenes.manifest.json') {
      try {
        let res = await fetch(url).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch('./scenes-config.json').catch(() => null);
        }
        if (!res || !res.ok) return null;
        const config = await res.json();
        if (config && Array.isArray(config.scenes)) {
          config.scenes.forEach(sc => {
            if (sc && sc.id) {
              SceneRegistry.register(sc.id, sc);
            }
          });
        }
        return config;
      } catch (err) {
        console.warn('[AST Registry] loadConfig notice:', err);
        return null;
      }
    }
  };

  global.ASTScenes = scenes;
  global.ASTSceneRegistry = SceneRegistry;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scenes, SceneRegistry };
  }
})(typeof window !== 'undefined' ? window : globalThis);
