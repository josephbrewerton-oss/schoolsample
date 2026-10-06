import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function astSceneAutoFinder(): import('vite').Plugin {
  const getScenes = () => {
    const scenesDir = path.resolve(import.meta.dirname, 'static/player/scenes');
    if (!fs.existsSync(scenesDir)) return [];
    const files = fs.readdirSync(scenesDir);
    const astFiles = files.filter(f => f.endsWith('.ast')).sort();
    return astFiles.map(file => {
      const id = file.replace('.ast', '');
      const fullPath = path.join(scenesDir, file);
      const content = fs.readFileSync(fullPath, 'utf8');
      const titleMatch = content.match(/:title\s+"([^"]+)"/i);
      const stageMatch = content.match(/:stage\s+"([^"]+)"/i);
      const durationMatch = content.match(/:duration\s+([\d\.]+)/i);
      const keyframeCount = (content.match(/\(:t\s+[\d\.]+/gi) || []).length;
      const subtitleCount = (content.match(/\(:start\s+[\d\.]+/gi) || []).length;
      const bindingsCount = (content.match(/\(:target\s+/gi) || []).length;
      const has3D = content.includes(':3d-') || content.includes(':camera');
      return {
        id,
        title: titleMatch ? titleMatch[1] : id,
        stage: stageMatch ? stageMatch[1] : 'CURRICULUM',
        duration: durationMatch ? parseFloat(durationMatch[1]) : 14.0,
        has3D,
        nodes3DCount: has3D ? 1 : 0,
        svgFile: `scenes/${id}.svg`,
        astFile: `scenes/${id}.ast`,
        keyframeCount,
        subtitleCount,
        bindingsCount
      };
    });
  };

  return {
    name: 'ast-scene-auto-finder',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (
          url === '/api/scenes' ||
          url === '/player/api/scenes' ||
          url === '/player/scenes.manifest.json' ||
          url === '/player/scenes-config.json'
        ) {
          const scenes = getScenes();
          const payload = {
            version: '2.6.0',
            generatedAt: new Date().toISOString(),
            totalScenes: scenes.length,
            scenes
          };
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(JSON.stringify(payload));
          return;
        }
        next();
      });
    },
    buildStart() {
      const scenes = getScenes();
      const payload = {
        version: '2.6.0',
        generatedAt: new Date().toISOString(),
        totalScenes: scenes.length,
        scenes
      };
      const manifestPath = path.resolve(import.meta.dirname, 'static/player/scenes.manifest.json');
      const configPath = path.resolve(import.meta.dirname, 'static/player/scenes-config.json');
      fs.writeFileSync(manifestPath, JSON.stringify(payload, null, 2));
      fs.writeFileSync(configPath, JSON.stringify(payload, null, 2));
    }
  };
}

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react(), astSceneAutoFinder()],
  publicDir: 'static',
  define: {
    'process.env': {},
    'process.browser': true,
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      'react-router-dom': path.resolve(import.meta.dirname, 'src/router/index.tsx'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@mlc-ai/web-llm')) {
            return 'vendor-webllm';
          }
          if (id.includes('node_modules/katex/')) {
            return 'vendor-katex';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
