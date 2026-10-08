/**
 * scripts/generate-scenes-manifest.js
 * 
 * Scans controlled input directories for *.ast cartridges, verifies matching [id].svg,
 * parses/ensures root slots (:id, :type ["Sim"|"Slide"|"App"], :title, :stage, :duration), and emits:
 * 1. static/player/scenes.manifest.json (Runtime payload for the iframe player)
 * 2. src/data/player/generatedScenes.ts (Single source of truth for React UI)
 * 3. Keeps controlled input directories (scenes, cartridges) synchronized
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const manifestPath = path.join(rootDir, 'static', 'player', 'scenes.manifest.json');
const tsExportPath = path.join(rootDir, 'src', 'data', 'player', 'generatedScenes.ts');

function extractSlot(content, regex) {
  const match = content.match(regex);
  if (!match) return null;
  return match[1].trim().replace(/^"|"$/g, '');
}

/**
 * Normalizes cartridge type to one of the 3 canonical types: "Sim", "Slide", "App"
 */
export function normalizeCartridgeType(rawType, id = '') {
  if (rawType) {
    const clean = rawType.replace(/^"|"$/g, '').trim().toLowerCase();
    if (clean === 'sim' || clean === 'simulation' || clean === 'interactive') return 'Sim';
    if (clean === 'slide' || clean === 'slides' || clean === 'presentation') return 'Slide';
    if (clean === 'app' || clean === 'application' || clean === 'tool' || clean === 'lab') return 'App';
  }
  // Canonical inference based on curriculum purpose
  const apps = ['phonics-lab', 'languages', 'fish-tank'];
  const slides = [
    'church-tour',
    'photosynthesis',
    'water-cycle',
    'dna-helix',
    'shakespeare',
    'fractions',
    'times-tables',
    'bodmas'
  ];
  if (apps.includes(id)) return 'App';
  if (slides.includes(id)) return 'Slide';
  return 'Sim';
}

/**
 * Resolves controlled input directories from options, CLI flags, env vars, or defaults.
 */
export function getControlledInputDirs(options = {}) {
  // 1. Explicit options
  if (options.inputDirs && Array.isArray(options.inputDirs) && options.inputDirs.length > 0) {
    return options.inputDirs.map((d) => (path.isAbsolute(d) ? d : path.join(rootDir, d)));
  }

  // 2. Command-line args --input-dirs=dir1,dir2 or --dirs=dir1,dir2
  const cliDirsArg = process.argv.find(
    (arg) => arg.startsWith('--input-dirs=') || arg.startsWith('--dirs=') || arg.startsWith('--input-dir=')
  );
  if (cliDirsArg) {
    const raw = cliDirsArg.split('=')[1];
    return raw
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => (path.isAbsolute(d) ? d : path.join(rootDir, d)));
  }

  // 3. Environment variables CARTRIDGE_DIRS or INPUT_DIRS
  const envDirs = process.env.CARTRIDGE_DIRS || process.env.INPUT_DIRS;
  if (envDirs) {
    return envDirs
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => (path.isAbsolute(d) ? d : path.join(rootDir, d)));
  }

  // 4. Default controlled search paths
  const defaultCandidates = [
    path.join(rootDir, 'static', 'player', 'scenes'),
    path.join(rootDir, 'static', 'player', 'cartridges'),
    path.join(rootDir, 'static', 'cartridges')
  ];

  return defaultCandidates.filter((d) => fs.existsSync(d));
}

function parseAstHeader(astContent, filename) {
  const id = extractSlot(astContent, /:id\s+("[^"]+"|[^\s\)]+)/i);
  const rawType = extractSlot(astContent, /:type\s+("Sim"|"Slide"|"App"|"[^"]+"|[^\s\)]+)/i);
  const title = extractSlot(astContent, /:title\s+"([^"]+)"/i);
  const stage = extractSlot(astContent, /:stage\s+"([^"]+)"/i) || 'CURRICULUM';
  const durationStr = extractSlot(astContent, /:duration\s+([\d\.]+)/i);
  const duration = durationStr ? parseFloat(durationStr) : 10.0;

  if (!id) {
    console.warn(`[Manifest Generator] Warning: Could not find :id in ${filename}`);
    return null;
  }

  const type = normalizeCartridgeType(rawType, id);

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

  return {
    id,
    type,
    rawType,
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

/**
 * Ensures the .ast content explicitly declares :type ("Sim", "Slide", "App")
 */
function ensureTypeCalledInAst(astContent, type) {
  // If already calls :type "Sim"|"Slide"|"App", preserve
  if (/:type\s+"(Sim|Slide|App)"/i.test(astContent)) {
    return astContent;
  }

  // If has other :type "3d-...", check if root header has :type
  const headerMatch = astContent.match(/^\s*\(:scene\s+:id\s+("[^"]+"|[^\s\)]+)/i);
  if (headerMatch) {
    return astContent.replace(
      /^(\s*\(:scene\s+:id\s+("[^"]+"|[^\s\)]+))/i,
      `$1 :type "${type}"`
    );
  }

  // Pattern (scene :id "..." ...)
  const altHeaderMatch = astContent.match(/^\s*\(scene\s+:id\s+("[^"]+"|[^\s\)]+)/i);
  if (altHeaderMatch) {
    return astContent.replace(
      /^(\s*\(scene\s+:id\s+("[^"]+"|[^\s\)]+))/i,
      `$1 :type "${type}"`
    );
  }

  return astContent;
}

export function generateScenesManifest(options = {}) {
  const inputDirs = getControlledInputDirs(options);
  if (!inputDirs.length) {
    console.error(`[Manifest Generator] No controlled input directories found.`);
    process.exit(1);
  }

  console.log(`[Manifest Generator] Controlled Input Directories:`, inputDirs);

  const manifest = [];
  const processedIds = new Set();
  const allCartridgeFiles = new Map(); // id -> { astPath, svgPath, meta, content }

  for (const dir of inputDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    const astFiles = files.filter((f) => f.endsWith('.ast'));

    for (const astFile of astFiles) {
      const fullAstPath = path.join(dir, astFile);
      let content = fs.readFileSync(fullAstPath, 'utf8');
      const meta = parseAstHeader(content, astFile);

      if (!meta || processedIds.has(meta.id)) continue;

      const svgFile = `${meta.id}.svg`;
      const fullSvgPath = path.join(dir, svgFile);

      // Verify matching SVG
      let svgExists = fs.existsSync(fullSvgPath);
      if (!svgExists) {
        // Check other input directories for SVG
        for (const otherDir of inputDirs) {
          const altSvg = path.join(otherDir, svgFile);
          if (fs.existsSync(altSvg)) {
            svgExists = true;
            break;
          }
        }
      }

      if (!svgExists) {
        console.warn(`[Manifest Generator] Warning: Matching SVG file missing for ${astFile}:${svgFile}`);
        continue;
      }

      // Ensure :type is called directly in the .ast file
      const updatedContent = ensureTypeCalledInAst(content, meta.type);
      if (updatedContent !== content) {
        fs.writeFileSync(fullAstPath, updatedContent, 'utf8');
        content = updatedContent;
      }

      processedIds.add(meta.id);
      allCartridgeFiles.set(meta.id, {
        astPath: fullAstPath,
        svgPath: fullSvgPath,
        meta,
        content
      });

      manifest.push({
        id: meta.id,
        type: meta.type, // "Sim" | "Slide" | "App"
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
    version: '2.6.0',
    generatedAt: new Date().toISOString(),
    totalScenes: manifest.length,
    inputDirs: inputDirs.map((d) => path.relative(rootDir, d) || '.'),
    types: ['Sim', 'Slide', 'App'],
    scenes: manifest
  };

  const jsonStr = JSON.stringify(output, null, 2) + '\n';
  fs.writeFileSync(manifestPath, jsonStr, 'utf8');
  console.log(`[Manifest Generator] Successfully wrote ${manifest.length} scenes to ${manifestPath}`);

  // Emit to root static/ directory for root-level fetches
  const rootManifestPath = path.join(rootDir, 'static', 'scenes.manifest.json');
  fs.writeFileSync(rootManifestPath, jsonStr, 'utf8');

  // Emit scenes-config.json for backward compatibility in both locations
  const legacyConfigPath = path.join(rootDir, 'static', 'player', 'scenes-config.json');
  fs.writeFileSync(legacyConfigPath, jsonStr, 'utf8');
  const rootLegacyConfigPath = path.join(rootDir, 'static', 'scenes-config.json');
  fs.writeFileSync(rootLegacyConfigPath, jsonStr, 'utf8');

  // Synchronize controlled cartridge folders so they all have the updated :type files
  const syncDirs = [
    path.join(rootDir, 'static', 'cartridges'),
    path.join(rootDir, 'static', 'player', 'cartridges'),
    path.join(rootDir, 'static', 'player', 'scenes')
  ];

  syncDirs.forEach((targetDir) => {
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    for (const [id, item] of allCartridgeFiles.entries()) {
      const targetAst = path.join(targetDir, `${id}.ast`);
      const targetSvg = path.join(targetDir, `${id}.svg`);
      fs.writeFileSync(targetAst, item.content, 'utf8');
      if (fs.existsSync(item.svgPath) && item.svgPath !== targetSvg) {
        fs.copyFileSync(item.svgPath, targetSvg);
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
    type: m.type, // 'Sim' | 'Slide' | 'App'
    label: `${m.title}`,
    stage: m.stage
  }));

  const tsContent = `// AUTO-GENERATED BY scripts/generate-scenes-manifest.js
// DO NOT EDIT MANUALLY - Derived directly from controlled cartridge input directories

export type CartridgeType = 'Sim' | 'Slide' | 'App';

export interface ScenePresetOption {
  id: string;
  type: CartridgeType;
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
