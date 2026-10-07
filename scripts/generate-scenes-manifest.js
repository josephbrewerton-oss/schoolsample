/**
 * scripts/generate-scenes-manifest.js
 * 
 * Scans static/player/scenes/*.ast, verifies matching [id].svg exists,
 * parses root slots (:id, :title, :stage, :duration), and emits:
 * 1. static/player/scenes.manifest.json (Runtime payload for the iframe player)
 * 2. src/data/player/generatedScenes.ts (Single source of truth for React UI)
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const scenesDir = path.join(rootDir, 'static', 'player', 'scenes');
const manifestPath = path.join(rootDir, 'static', 'player', 'scenes.manifest.json');
const tsExportPath = path.join(rootDir, 'src', 'data', 'player', 'generatedScenes.ts');

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

  console.log(`[Manifest Generator] Found ${astFiles.length} .ast scene definitions in${scenesDir}`);

  const manifest = [];

  for (const astFile of astFiles) {
    const fullAstPath = path.join(scenesDir, astFile);
    const content = fs.readFileSync(fullAstPath, 'utf8');
    const meta = parseAstHeader(content, astFile);

    if (!meta) continue;

    const svgFile = `${meta.id}.svg`;
    const fullSvgPath = path.join(scenesDir, svgFile);

    if (!fs.existsSync(fullSvgPath)) {
      console.warn(`[Manifest Generator] Warning: Matching SVG file missing for ${astFile}:${svgFile}`);
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

  // Consistent ordering: Catholic life first, then KS1–KS4 sciences and mathematics
  const priorityOrder = [
    'church-tour',
    'calculus-curves',
    'kinetic-gas',
    'electric-circuits',
    'bodmas',
    'times-tables',
    'phonics-lab',
    'math-fishing',
    'mountain-elevation',
    'fish-tank',
    'fractions',
    'solar-system',
    'photosynthesis',
    'pythagoras',
    'water-cycle',
    'atom',
    'velocity',
    'dna-helix'
  ];

  manifest.sort((a, b) => {
    const ai = priorityOrder.indexOf(a.id);
    const bi = priorityOrder.indexOf(b.id);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.title.localeCompare(b.title);
  });

  // 1. Output runtime JSON manifest
  const output = {
    version: '2.5.0',
    generatedAt: new Date().toISOString(),
    totalScenes: manifest.length,
    scenes: manifest
  };

  fs.writeFileSync(manifestPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  console.log(`[Manifest Generator] Successfully wrote ${manifest.length} scenes to ${manifestPath}`);

  // Also emit scenes-config.json for backward compatibility
  const legacyConfigPath = path.join(rootDir, 'static', 'player', 'scenes-config.json');
  fs.writeFileSync(legacyConfigPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

  // Synchronize cartridge folders
  const cartridgesDir = path.join(rootDir, 'static', 'cartridges');
  const playerCartridgesDir = path.join(rootDir, 'static', 'player', 'cartridges');
  [cartridgesDir, playerCartridgesDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(scenesDir)) {
      if (f.endsWith('.ast') || f.endsWith('.svg') || f.endsWith('.json')) {
        fs.copyFileSync(path.join(scenesDir, f), path.join(dir, f));
      }
    }
  });

  // 2. Output strongly typed presets for React UI
  const tsDataDir = path.dirname(tsExportPath);
  if (!fs.existsSync(tsDataDir)) {
    fs.mkdirSync(tsDataDir, { recursive: true });
  }

  const presetEntries = manifest.map((m) => ({
    id: m.id,
    label: `${m.title}`,
    stage: m.stage
  }));

  const tsContent = `// AUTO-GENERATED BY scripts/generate-scenes-manifest.js
// DO NOT EDIT MANUALLY - Derived directly from static/player/scenes/*.ast and *.svg

export interface ScenePresetOption {
  id: string;
  label: string;
  stage: string;
}

export const PRESET_OPTIONS: ScenePresetOption[] = ${JSON.stringify(presetEntries, null, 2)};
`;

  fs.writeFileSync(tsExportPath, tsContent, 'utf8');
  console.log(`[Manifest Generator] Successfully wrote ${presetEntries.length} typed presets to ${tsExportPath}`);

  return output;
}

// Run when executed directly
if (process.argv[1] && process.argv[1].endsWith('generate-scenes-manifest.js')) {
  generateScenesManifest();
}
