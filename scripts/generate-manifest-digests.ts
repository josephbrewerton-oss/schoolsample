// scripts/generate-manifest-digests.ts
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const STATIC_DIR = path.resolve(process.cwd(), 'static');
const MANIFESTS_DIR = path.join(STATIC_DIR, 'manifests');
const PATTERNS_DIR = path.join(STATIC_DIR, 'patterns');
const OUT_FILE = path.join(STATIC_DIR, 'manifest-digests.json');

function computeFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

function scanAndDigest() {
  const fileDigests: Record<string, string> = {};
  const hashCollector = crypto.createHash('sha256');

  // Root substrates
  const rootSubstrates = ['nano-map.ast', 'manifest.json'];
  for (const f of rootSubstrates) {
    const fullPath = path.join(STATIC_DIR, f);
    if (fs.existsSync(fullPath)) {
      const h = computeFileHash(fullPath);
      fileDigests[f] = h;
      hashCollector.update(`${f}:${h}`);
    }
  }

  // Patterns directory
  if (fs.existsSync(PATTERNS_DIR)) {
    const patternFiles = fs.readdirSync(PATTERNS_DIR).filter(f => f.endsWith('.ast') || f.endsWith('.json'));
    for (const f of patternFiles) {
      const fullPath = path.join(PATTERNS_DIR, f);
      const h = computeFileHash(fullPath);
      fileDigests[`patterns/${f}`] = h;
      hashCollector.update(`patterns/${f}:${h}`);
    }
  }

  // Manifests directory
  if (fs.existsSync(MANIFESTS_DIR)) {
    const manifestFiles = fs.readdirSync(MANIFESTS_DIR).filter(f => f.endsWith('.json') || f.endsWith('.ast'));
    for (const f of manifestFiles) {
      const fullPath = path.join(MANIFESTS_DIR, f);
      const h = computeFileHash(fullPath);
      fileDigests[`manifests/${f}`] = h;
      hashCollector.update(`manifests/${f}:${h}`);
    }
  }

  const compositeHash = hashCollector.digest('hex').substring(0, 12);
  const result = {
    version: '1.0.0',
    compositeHash,
    generatedAt: new Date().toISOString(),
    files: fileDigests
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`[Manifest Digest] Generated compositeHash: ${compositeHash} across ${Object.keys(fileDigests).length} substrates.`);
  return compositeHash;
}

scanAndDigest();
