import { runCLI } from '@docusaurus/core/lib/index.js';
import fs from 'fs';

try {
  await runCLI(['node', 'docusaurus', 'build', '--out-dir', 'dist']);
  if (fs.existsSync('dist')) {
    fs.cpSync('dist', 'build', { recursive: true });
  }
  process.exit(0);
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
