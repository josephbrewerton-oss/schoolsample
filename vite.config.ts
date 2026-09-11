import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react()],
  publicDir: 'static',
  define: {
    'process.env': {},
    'process.browser': true,
  },
  resolve: {
    alias: {
      '@site': path.resolve(import.meta.dirname, '.'),
      '@': path.resolve(import.meta.dirname, 'src'),
      '@theme/Layout': path.resolve(import.meta.dirname, 'src/shims/LayoutShim.tsx'),
      '@docusaurus/Link': path.resolve(import.meta.dirname, 'src/shims/docusaurusLink.tsx'),
      '@docusaurus/useBaseUrl': path.resolve(import.meta.dirname, 'src/shims/docusaurusUseBaseUrl.ts'),
      '@docusaurus/router': path.resolve(import.meta.dirname, 'src/shims/docusaurusRouter.ts'),
      '@docusaurus/BrowserOnly': path.resolve(import.meta.dirname, 'src/shims/docusaurusBrowserOnly.tsx'),
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
    chunkSizeWarningLimit: 1500,
  },
});
