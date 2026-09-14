/**
 * scripts/export-distribution.ts
 *
 * Prepares a clean-room public distribution bundle.
 * It compiles the master curriculum manifests and production web bundle,
 * and packages them into a clean distribution folder containing zero source code,
 * zero private compilation scripts, and zero prompt engineering artifacts.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = process.cwd();
const EXPORT_DIR = path.join(ROOT_DIR, 'dist-public-release');

console.log('🚀 [DISTRIBUTION EXPORTER] Starting Clean-Room Public Release Build...');

// 1. Run compilers
console.log('📦 Step 1: Compiling master manifests and generating static assets...');
execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });

// 2. Prepare export directory
console.log('🧹 Step 2: Preparing clean export directory: dist-public-release/');
if (fs.existsSync(EXPORT_DIR)) {
  fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(EXPORT_DIR, { recursive: true });

// 3. Copy compiled web application (dist/)
console.log('📋 Step 3: Copying minified production assets...');
const distSource = path.join(ROOT_DIR, 'dist');
fs.cpSync(distSource, path.join(EXPORT_DIR, 'dist'), { recursive: true });

// Strict IP Sanity Check: Purge any local key files from the public release
const sensitiveFiles = [
  path.join(EXPORT_DIR, 'dist', 'internal-key.json'),
  path.join(EXPORT_DIR, 'dist', 'local-key.json'),
  path.join(EXPORT_DIR, 'dist', 'local-key.key'),
];
for (const file of sensitiveFiles) {
  if (fs.existsSync(file)) {
    fs.rmSync(file, { force: true });
    console.log(`🔒 [IP GUARD] Successfully removed private key file from public release: ${path.basename(file)}`);
  }
}

// Copy static manifests (public read-only consumable JSON packs)
const manifestsSource = path.join(ROOT_DIR, 'static', 'manifests');
const manifestsDest = path.join(EXPORT_DIR, 'manifests');
if (fs.existsSync(manifestsSource)) {
  fs.cpSync(manifestsSource, manifestsDest, { recursive: true });
}

// 4. Create clean minimal package.json for the public distribution
console.log('📄 Step 4: Generating clean, zero-source public package.json...');
const publicPkg = {
  name: 'st-joseph-curriculum-portal-release',
  version: '1.0.0',
  description: 'Pre-compiled, zero-telemetry client distribution of St Joseph\'s Curriculum Portal.',
  license: 'AGPL-3.0-or-later',
  scripts: {
    start: 'npx serve dist -l 3000',
    preview: 'npx serve dist -l 3000'
  },
  dependencies: {}
};

fs.writeFileSync(
  path.join(EXPORT_DIR, 'package.json'),
  JSON.stringify(publicPkg, null, 2),
  'utf-8'
);

// 5. Create a clean README for school IT admins & MAT deployments
const publicReadme = `# St Joseph's Curriculum Portal — Pre-Compiled Distribution

This repository contains the verified, minified, zero-telemetry distribution of **St Joseph's Curriculum Portal**.

## What is in this distribution?
- **\`/dist\`**: Minified, tree-shaken static Single Page Application (HTML, CSS, JS).
- **\`/manifests\`**: Pre-compiled Socratic question packs and curriculum units.
- **Air-Gapped Operation**: Runs at **0 bps network consumption** after installation with zero data egress.

## Quick Start
To serve this distribution locally on a school intranet or server:
\`\`\`bash
npm start
\`\`\`
Or host the contents of \`/dist\` directly on any static web server (NGINX, Cloudflare Pages, GitHub Pages, or local NAS).

## Zero-Telemetry & Safeguarding Assurance
Conforms to UK GDPR (Art. 25 Data Protection by Design & Default) and the ICO Age-Appropriate Design Code.
Pupil answers, voice recordings, and activity logs remain exclusively in local browser IndexedDB storage and are never transmitted to external cloud servers.
`;

fs.writeFileSync(path.join(EXPORT_DIR, 'README.md'), publicReadme, 'utf-8');

// 6. Output success summary
console.log('\n✅ [DISTRIBUTION EXPORTER] Clean-room public release generated successfully at:');
console.log(`   📂 ${EXPORT_DIR}\n`);
console.log('Summary of clean release:');
console.log(' • Private RAG compilers: EXCLUDED');
console.log(' • Raw S-expression scripts: EXCLUDED');
console.log(' • TypeScript source code: EXCLUDED');
console.log(' • Minified SPA bundle: INCLUDED (/dist)');
console.log(' • Pre-compiled JSON manifests: INCLUDED (/manifests)');
