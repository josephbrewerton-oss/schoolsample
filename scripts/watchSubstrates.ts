// scripts/watchSubstrates.ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collateProject } from './collateSubstrates';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcRoot = path.resolve(__dirname, '../src');
const outputFile = path.resolve(srcRoot, 'engine/rootSubstrate.generated.ts');

console.log('[Substrate Watcher] Initializing in-house AST Graph Cascade (native node:fs)...');

// Initial run
collateProject(srcRoot, outputFile);

let debounceTimer: NodeJS.Timeout | null = null;

const runCascade = (filename: string | null, event: string) => {
  if (filename) {
    // Ignore dotfiles, d.ts files, and the output file itself to avoid infinite loops
    if (
      filename.startsWith('.') ||
      filename.endsWith('.d.ts') ||
      filename.endsWith('.ast.ts') ||
      filename.includes('rootSubstrate.generated.ts')
    ) {
      return;
    }
    // Only trigger on TypeScript/TSX source changes
    if (!filename.endsWith('.ts') && !filename.endsWith('.tsx')) {
      return;
    }
  }

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    console.log(`[Substrate Cascade] Change detected (${event}: ${filename || 'file'}). Re-indexing AST graph...`);
    try {
      collateProject(srcRoot, outputFile);
      console.log('[Substrate Cascade] AST Graph updated and synchronized.');
    } catch (err) {
      console.error('[Substrate Cascade Error]:', err);
    }
  }, 150);
};

try {
  // Use native recursive fs.watch supported natively in Node.js 20+
  const watcher = fs.watch(srcRoot, { recursive: true }, (event, filename) => {
    runCascade(filename ? String(filename) : null, event);
  });

  watcher.on('error', (err) => {
    console.error('[Substrate Watcher Error]:', err);
  });

  console.log(`[Substrate Watcher] Actively watching ${srcRoot} with zero external dependencies.`);
} catch (err) {
  console.warn('[Substrate Watcher] Native recursive watch not available, running static cascade:', err);
}
