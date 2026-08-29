// scripts/watchSubstrates.ts
import chokidar from 'chokidar';
import path from 'path';
import { fileURLToPath } from 'url';
import { collateProject } from './collateSubstrates';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcRoot = path.resolve(__dirname, '../src');
const outputFile = path.resolve(srcRoot, 'engine/rootSubstrate.generated.ts');

console.log('[Substrate Watcher] Initializing AST Graph Cascade...');

// Initial run
collateProject(srcRoot, outputFile);

// Initialize watcher
const watcher = chokidar.watch(`${srcRoot}/**/*.{ts,tsx}`, {
  ignored: [
    /(^|[\/\\])\../,            // dotfiles
    /\.d\.ts$/,                 // type definitions
    /\.ast\.ts$/,               // generated AST wrappers
    /rootSubstrate\.generated\.ts$/ // generated root
  ],
  persistent: true,
  ignoreInitial: true,
});

let debounceTimer: NodeJS.Timeout | null = null;

const runCascade = (filePath: string, event: string) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(() => {
    console.log(`[Substrate Cascade] Change detected (${event}: ${path.basename(filePath)}). Re-indexing AST graph...`);
    try {
      collateProject(srcRoot, outputFile);
      console.log('[Substrate Cascade] AST Graph updated and synchronized.');
    } catch (err) {
      console.error('[Substrate Cascade Error]:', err);
    }
  }, 150); // debounce rapid typing/saves
};

watcher
  .on('add', (filePath) => runCascade(filePath, 'added'))
  .on('change', (filePath) => runCascade(filePath, 'modified'))
  .on('unlink', (filePath) => runCascade(filePath, 'deleted'));