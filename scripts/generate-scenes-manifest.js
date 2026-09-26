/**
 * scripts/generate-scenes-manifest.js
 * 
 * Scans static/player/scenes/*.ast, verifies matching [id].svg exists,
 * parses root slots (:id, :title, :stage, :duration), and emits
 * static/player/scenes.manifest.json for the AST Vector Media Player.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const scenesDir = path.join(rootDir, 'static', 'player', 'scenes');
const manifestPath = path.join(rootDir, 'static', 'player', 'scenes.manifest.json');

function extractSlot(content, regex) {
  const match = content.match(regex);
  if (!match) return null;
  return match[1].trim().replace(/^"|"$/g, '');
}

function parseAstHeader(astContent, filename) {
  const id = extractSlot(astContent, /:id\s+("[^"]+"|[^\s\)]+)/i);
  const title = extractSlot(astContent, /:title\s+"([^"]+)"/i);
  const stage = extractSlot(astContent, /:stage\s+"([^"]+)"/i) || 'CURRICULUM';
  const durationStr = extractSlot(astContent, /:duration\s+([\d\.]+)/i);
  const duration = durationStr ? parseFloat(durationStr) : 10.0;

  // Count keyframes
  const keyframesMatch = astContent.match(/\(:keyframes\s*\(([\s\S]*?)\)\s*\)/i);
  const keyframeCount = keyframesMatch ? (keyframesMatch[1].match(/\(:t\s+/g) || []).length : 0;

  // Count subtitles
  const subtitlesMatch = astContent.match(/\(:subtitles\s*\(([\s\S]*?)\)\s*\)/i);
  const subtitleCount = subtitlesMatch ? (subtitlesMatch[1].match(/\(:start\s+/g) || []).length : 0;

  // Count bindings
  const bindingsCount = (astContent.match(/\(:target\s+/g) || []).length;

  // 3D capabilities
  const has3D = /:camera\s+|:type\s+"3d-/i.test(astContent);
  const nodes3DCount = (astContent.match(/:type\s+"3d-/gi) || []).length;

  if (!id) {
    console.warn(`[Manifest Generator] Warning: Could not find :id in ${filename}`);
    return null;
  }

  return {
    id,
    title: title || id,
    stage,
    duration,
    has3D,
    nodes3DCount,
    keyframeCount,
    subtitleCount,
    bindingsCount
  };
}

export function generateScenesManifest() {
  if (!fs.existsSync(scenesDir)) {
    console.error(`[Manifest Generator] Scenes directory not found: ${scenesDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(scenesDir);
  const astFiles = files.filter(f => f.endsWith('.ast'));

  console.log(`[Manifest Generator] Found ${astFiles.length} .ast scene definitions in ${scenesDir}`);

  const manifest = [];

  for (const astFile of astFiles) {
    const fullAstPath = path.join(scenesDir, astFile);
    const content = fs.readFileSync(fullAstPath, 'utf8');
    const meta = parseAstHeader(content, astFile);

    if (!meta) continue;

    const svgFile = `${meta.id}.svg`;
    const fullSvgPath = path.join(scenesDir, svgFile);

    if (!fs.existsSync(fullSvgPath)) {
      console.warn(`[Manifest Generator] Warning: Matching SVG file missing for ${astFile}: ${svgFile}`);
      continue;
    }

    manifest.push({
      id: meta.id,
      title: meta.title,
      stage: meta.stage,
      duration: meta.duration,
      has3D: meta.has3D,
      nodes3DCount: meta.nodes3DCount,
      svgFile: `scenes/${svgFile}`,
      astFile: `scenes/${astFile}`,
      keyframeCount: meta.keyframeCount,
      subtitleCount: meta.subtitleCount,
      bindingsCount: meta.bindingsCount
    });
  }

  // Consistent ordering: Catholic life first, then KS2/KS3
  const order = ['church-tour', 'fractions', 'solar-system', 'photosynthesis', 'pythagoras', 'water-cycle', 'atom', 'velocity', 'dna-helix'];
  manifest.sort((a, b) => {
    const ai = order.indexOf(a.id);
    const bi = order.indexOf(b.id);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.title.localeCompare(b.title);
  });

  const output = {
    version: '2.2.0',
    generatedAt: new Date().toISOString(),
    totalScenes: manifest.length,
    scenes: manifest
  };

  fs.writeFileSync(manifestPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`[Manifest Generator] Successfully wrote ${manifest.length} scenes to ${manifestPath}`);
  return output;
}

// Run when executed directly
if (process.argv[1] && process.argv[1].endsWith('generate-scenes-manifest.js')) {
  generateScenesManifest();
}
