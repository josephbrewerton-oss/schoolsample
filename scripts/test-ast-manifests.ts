#!/usr/bin/env tsx
/**
 * Automated End-to-End AST & Seed Manifest Test Suite
 * 
 * Verifiable proof of determinism and syntax integrity for commercial enterprise contracts.
 * Asserts src/utils/sexprParser.ts parses and validates every seed manifest, AST substrate,
 * and curriculum definition without a single syntax corruption or unhandled exception.
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { parseSExpr, stripSExprComments } from '../src/utils/sexprParser';
import { VFS_CURRICULUM_SEEDS } from '../src/manifests/vfsSeedModules';
import { SCHOOL_MANIFEST } from '../src/manifests/school';
import { COMMUNION_MANIFEST } from '../src/manifests/communion';
import { SExprAST, SExprNode } from '../src/types/sexpr';

// ANSI styling for readable terminal output
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const GRAY = '\x1b[90m';

interface TestStats {
  filesTested: number;
  astNodesParsed: number;
  determinismChecks: number;
  corruptionsDetected: number;
  unhandledExceptions: number;
  suitesPassed: number;
  suitesFailed: number;
}

const stats: TestStats = {
  filesTested: 0,
  astNodesParsed: 0,
  determinismChecks: 0,
  corruptionsDetected: 0,
  unhandledExceptions: 0,
  suitesPassed: 0,
  suitesFailed: 0,
};

/**
 * Recursively validates that an SExprAST node is structurally pure and free of corruptions.
 */
function validateAstNode(node: SExprAST, sourceName: string, pathTrace = 'root'): void {
  stats.astNodesParsed++;

  if (node === null) return;
  if (typeof node === 'boolean' || typeof node === 'number') {
    if (typeof node === 'number' && isNaN(node)) {
      stats.corruptionsDetected++;
      throw new Error(`[CORRUPTION] NaN detected in AST at ${sourceName} -> ${pathTrace}`);
    }
    return;
  }
  if (typeof node === 'string') {
    if (node === '(' || node === ')' || node === '[' || node === ']') {
      stats.corruptionsDetected++;
      throw new Error(`[CORRUPTION] Raw delimiter token "${node}" unparsed at ${sourceName} -> ${pathTrace}`);
    }
    return;
  }

  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) {
      validateAstNode(node[i], sourceName, `${pathTrace}[${i}]`);
    }
    return;
  }

  if (typeof node === 'object') {
    const sNode = node as SExprNode;
    if (!sNode.tag || typeof sNode.tag !== 'string' || sNode.tag.trim().length === 0) {
      stats.corruptionsDetected++;
      throw new Error(`[CORRUPTION] Node missing valid tag at ${sourceName} -> ${pathTrace}: ${JSON.stringify(node)}`);
    }
    if (sNode.tag === '(' || sNode.tag === ')' || sNode.tag === '[' || sNode.tag === ']') {
      stats.corruptionsDetected++;
      throw new Error(`[CORRUPTION] Node tag corrupted with delimiter "${sNode.tag}" at ${sourceName} -> ${pathTrace}`);
    }

    if (!sNode.props || typeof sNode.props !== 'object' || Array.isArray(sNode.props)) {
      stats.corruptionsDetected++;
      throw new Error(`[CORRUPTION] Node props corrupted at ${sourceName} -> ${pathTrace}.${sNode.tag}`);
    }

    // Validate properties
    for (const [key, value] of Object.entries(sNode.props)) {
      if (key.includes('(') || key.includes(')')) {
        stats.corruptionsDetected++;
        throw new Error(`[CORRUPTION] Corrupted prop key "${key}" at ${sourceName} -> ${pathTrace}.${sNode.tag}`);
      }
      validateAstNode(value, sourceName, `${pathTrace}.${sNode.tag}:${key}`);
    }

    // Validate children
    if (!Array.isArray(sNode.children)) {
      stats.corruptionsDetected++;
      throw new Error(`[CORRUPTION] Node children is not an array at ${sourceName} -> ${pathTrace}.${sNode.tag}`);
    }
    for (let i = 0; i < sNode.children.length; i++) {
      validateAstNode(sNode.children[i], sourceName, `${pathTrace}.${sNode.tag}.children[${i}]`);
    }
    return;
  }

  stats.corruptionsDetected++;
  throw new Error(`[CORRUPTION] Unrecognized AST type "${typeof node}" at ${sourceName} -> ${pathTrace}`);
}

/**
 * Asserts strict determinism by parsing input multiple times and asserting deep equality.
 */
function assertDeterminism(input: string, sourceName: string): SExprAST {
  const runA = parseSExpr(input);
  const runB = parseSExpr(input);
  const runC = parseSExpr(input);

  const jsonA = JSON.stringify(runA);
  const jsonB = JSON.stringify(runB);
  const jsonC = JSON.stringify(runC);

  if (jsonA !== jsonB || jsonB !== jsonC) {
    stats.corruptionsDetected++;
    throw new Error(`[DETERMINISM DRIFT] Parser returned non-identical AST outputs on consecutive runs for ${sourceName}`);
  }

  assert.deepStrictEqual(runA, runB, `Determinism failure on ${sourceName}`);
  stats.determinismChecks += 3;

  return runA;
}

console.log(`${BOLD}${CYAN}================================================================================${RESET}`);
console.log(`${BOLD}${CYAN} AUTOMATED END-TO-END AST & SEED MANIFEST TEST SUITE${RESET}`);
console.log(`${BOLD}${CYAN} Verifiable Proof of Determinism for Enterprise Compliance${RESET}`);
console.log(`${BOLD}${CYAN}================================================================================${RESET}\n`);

// -----------------------------------------------------------------------------
// SUITE 1: Parser Syntax Integrity & Determinism Invariants
// -----------------------------------------------------------------------------
try {
  console.log(`${BOLD}Suite 1: Parser Invariant & Syntax Edge-Case Verification${RESET}`);

  const invariantTestCases = [
    { name: 'Atomic primitives (numbers, booleans, nil)', code: '(:int 42 :neg -17 :float 3.1415 :b1 true :b2 false :n1 nil :n2 null)' },
    { name: 'Escaped string literals', code: '(text :variant "h1" :content "Hello \\"World\\", \\\\ escaped backslash")' },
    { name: 'Nested S-expressions', code: '(view :class "main" (header :title "Welcome") (body (p "First") (p "Second")))' },
    { name: 'Lisp-style comments (; and ;;)', code: ';; Leading comment\n(view :id "test" ; inline comment\n  ;; line comment with (nested paren)\n  (button "Click"))' },
    { name: 'Keyword argument lists', code: '(pattern:def :id "quiz:mcq" :slots (:prompt :options :answer-key))' },
    { name: 'Empty lists and vectors', code: '(list () [])' },
  ];

  for (const tc of invariantTestCases) {
    const parsed = assertDeterminism(tc.code, tc.name);
    validateAstNode(parsed, tc.name);
    console.log(`  ${GREEN}✓${RESET} ${tc.name}`);
  }

  stats.suitesPassed++;
  console.log(`${GREEN}Suite 1 Passed!${RESET}\n`);
} catch (err: any) {
  stats.suitesFailed++;
  stats.unhandledExceptions++;
  console.error(`${RED}Suite 1 Failed:${RESET}`, err.message);
}

// -----------------------------------------------------------------------------
// SUITE 2: Static S-Expression Substrates & Pattern Definitions
// -----------------------------------------------------------------------------
try {
  console.log(`${BOLD}Suite 2: Seed S-Expression Substrates (.ast & .lisp files)${RESET}`);

  const substrateFiles = [
    'static/nano-map.ast',
    'static/patterns/mcq.ast',
    'static/patterns/fill-blank.ast',
    'static/patterns/numeric.ast',
    'static/patterns/pair-sort.ast',
    'static/patterns/harmony.ast',
    'src/rules/quiz.rules.ast',
    'src/curriculum/curriculumoutput.ast',
    'src/curriculum/curriculum.ast',
    'sys/views/cheat_sheet.lisp',
  ];

  for (const relativePath of substrateFiles) {
    const fullPath = path.resolve(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Expected substrate file missing: ${relativePath}`);
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const parsed = assertDeterminism(content, relativePath);

    if (parsed === null) {
      stats.corruptionsDetected++;
      throw new Error(`Substrate parsed to null: ${relativePath}`);
    }

    validateAstNode(parsed, relativePath);
    stats.filesTested++;

    const summaryTag = typeof parsed === 'object' && !Array.isArray(parsed) && 'tag' in parsed
      ? `Node(${parsed.tag})`
      : Array.isArray(parsed)
      ? `Array[${parsed.length}]`
      : typeof parsed;

    console.log(`  ${GREEN}✓${RESET} ${relativePath} ${GRAY}-> ${summaryTag}${RESET}`);
  }

  stats.suitesPassed++;
  console.log(`${GREEN}Suite 2 Passed!${RESET}\n`);
} catch (err: any) {
  stats.suitesFailed++;
  stats.unhandledExceptions++;
  console.error(`${RED}Suite 2 Failed:${RESET}`, err.message);
}

// -----------------------------------------------------------------------------
// SUITE 3: Virtual File System Seed Modules (VFS_CURRICULUM_SEEDS)
// -----------------------------------------------------------------------------
try {
  console.log(`${BOLD}Suite 3: Virtual File System Curriculum Seeds${RESET}`);

  const entries = Object.entries(VFS_CURRICULUM_SEEDS);
  for (const [vfsPath, lispSource] of entries) {
    const parsed = assertDeterminism(lispSource, vfsPath);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || !('tag' in parsed)) {
      stats.corruptionsDetected++;
      throw new Error(`VFS seed ${vfsPath} failed to produce a valid root AST node.`);
    }

    if (parsed.tag !== 'view') {
      stats.corruptionsDetected++;
      throw new Error(`VFS seed ${vfsPath} expected root tag "view", received "${parsed.tag}".`);
    }

    validateAstNode(parsed, vfsPath);
    stats.filesTested++;
    console.log(`  ${GREEN}✓${RESET} ${vfsPath} ${GRAY}(Root: ${parsed.tag}, Props: ${Object.keys(parsed.props).length}, Children: ${parsed.children.length})${RESET}`);
  }

  stats.suitesPassed++;
  console.log(`${GREEN}Suite 3 Passed!${RESET}\n`);
} catch (err: any) {
  stats.suitesFailed++;
  stats.unhandledExceptions++;
  console.error(`${RED}Suite 3 Failed:${RESET}`, err.message);
}

// -----------------------------------------------------------------------------
// SUITE 4: Seed Domain Manifests (School Core & Sacramental Formation)
// -----------------------------------------------------------------------------
try {
  console.log(`${BOLD}Suite 4: Seed Domain & Formation Manifests${RESET}`);

  const domainManifests = [
    { id: 'SCHOOL_MANIFEST', manifest: SCHOOL_MANIFEST },
    { id: 'COMMUNION_MANIFEST', manifest: COMMUNION_MANIFEST },
  ];

  for (const { id, manifest } of domainManifests) {
    assert(manifest.meta?.domainId, `${id} missing domainId`);
    assert(manifest.cohorts?.length > 0, `${id} cohorts must not be empty`);
    assert(manifest.challenges?.length > 0, `${id} challenges must not be empty`);

    for (const challenge of manifest.challenges) {
      assert(challenge.id, `Challenge in ${id} missing id`);
      assert(challenge.prompt, `Challenge ${challenge.id} in ${id} missing prompt`);
      assert(challenge.expectedAnswer, `Challenge ${challenge.id} in ${id} missing expectedAnswer`);

      // Verify any S-expression starter prompts or rules parse cleanly
      if (challenge.prompt.startsWith('(')) {
        const parsed = assertDeterminism(challenge.prompt, `${id}:${challenge.id}`);
        validateAstNode(parsed, `${id}:${challenge.id}`);
      }
    }

    stats.filesTested++;
    console.log(`  ${GREEN}✓${RESET} ${id} ${GRAY}(Domain: ${manifest.meta.domainId}, Cohorts: ${manifest.cohorts.length}, Challenges: ${manifest.challenges.length})${RESET}`);
  }

  stats.suitesPassed++;
  console.log(`${GREEN}Suite 4 Passed!${RESET}\n`);
} catch (err: any) {
  stats.suitesFailed++;
  stats.unhandledExceptions++;
  console.error(`${RED}Suite 4 Failed:${RESET}`, err.message);
}

// -----------------------------------------------------------------------------
// SUITE 5: Comprehensive Lesson JSON Manifests & Curriculum Trees
// -----------------------------------------------------------------------------
try {
  console.log(`${BOLD}Suite 5: Lesson Manifest Catalog & Unit Seed Files${RESET}`);

  const manifestsDir = path.resolve(process.cwd(), 'static/manifests');
  const lessonsDir = path.resolve(manifestsDir, 'lessons');

  const rootManifests = [
    'catalog.json',
    'rag-index.json',
    'oak-angles-triangles.json',
    'oak-states-of-matter.json',
    'history-ks2.json',
    'seasonal-changes.json',
  ];

  for (const rm of rootManifests) {
    const fullPath = path.resolve(manifestsDir, rm);
    if (fs.existsSync(fullPath)) {
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const data = JSON.parse(raw);
      assert(data, `Manifest ${rm} empty`);
      stats.filesTested++;
      console.log(`  ${GREEN}✓${RESET} static/manifests/${rm}`);
    }
  }

  // Scan all individual unit manifests in static/manifests/lessons/
  if (fs.existsSync(lessonsDir)) {
    const lessonFiles = fs.readdirSync(lessonsDir).filter((f) => f.endsWith('.json'));
    console.log(`  ${CYAN}• Validating ${lessonFiles.length} Oak curriculum lesson manifests...${RESET}`);

    let questionsChecked = 0;
    for (const lf of lessonFiles) {
      const fullPath = path.resolve(lessonsDir, lf);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const manifest = JSON.parse(raw);

      // Validate core manifest structure
      assert(manifest.m, `Manifest ${lf} missing metadata (m)`);
      assert(manifest.m.d, `Manifest ${lf} missing id (m.d)`);
      assert(manifest.m.n, `Manifest ${lf} missing name (m.n)`);
      assert(manifest.c && Array.isArray(manifest.c), `Manifest ${lf} missing challenges array (c)`);

      for (const ch of manifest.c) {
        assert(ch.i, `Challenge in ${lf} missing id (i)`);
        assert(ch.p, `Challenge ${ch.i} in ${lf} missing prompt (p)`);
        questionsChecked++;

        // If prompt is an S-Expression, parse and validate AST
        if (typeof ch.p === 'string' && ch.p.trim().startsWith('(')) {
          const ast = assertDeterminism(ch.p, `${lf}:${ch.i}`);
          validateAstNode(ast, `${lf}:${ch.i}`);
        }
      }

      stats.filesTested++;
    }

    console.log(`  ${GREEN}✓${RESET} Verified ${lessonFiles.length} lesson manifests (${questionsChecked} total challenges validated)`);
  }

  stats.suitesPassed++;
  console.log(`${GREEN}Suite 5 Passed!${RESET}\n`);
} catch (err: any) {
  stats.suitesFailed++;
  stats.unhandledExceptions++;
  console.error(`${RED}Suite 5 Failed:${RESET}`, err.message);
}

// -----------------------------------------------------------------------------
// SUITE 6: Fuzz & Resilience Testing (Zero Unhandled Exceptions)
// -----------------------------------------------------------------------------
try {
  console.log(`${BOLD}Suite 6: Fuzz & Corruption Resilience (Zero Unhandled Exceptions)${RESET}`);

  const fuzzInputs = [
    '',
    '   \n\t  ',
    '(incomplete-tag',
    '(quiz :q "Unclosed string literal)',
    '(view :nested ((broken [brackets)))',
    '```lisp\n(markdown-wrapped :test 1)\n```',
    ';;; Only comments with (parens inside them)\n;;; second comment line',
    '(deep ' + '('.repeat(60) + '"deeply nested"' + ')'.repeat(60) + ')',
    'Random unformatted natural language text from user',
  ];

  for (let i = 0; i < fuzzInputs.length; i++) {
    const input = fuzzInputs[i];
    // Must never throw an unhandled exception
    const result = parseSExpr(input);
    assert(result !== undefined, `Fuzz test ${i} returned undefined instead of AST/null`);
    console.log(`  ${GREEN}✓${RESET} Fuzz test case #${i + 1} handled cleanly`);
  }

  stats.suitesPassed++;
  console.log(`${GREEN}Suite 6 Passed!${RESET}\n`);
} catch (err: any) {
  stats.suitesFailed++;
  stats.unhandledExceptions++;
  console.error(`${RED}Suite 6 Failed:${RESET}`, err.message);
}

// -----------------------------------------------------------------------------
// FINAL REPORT
// -----------------------------------------------------------------------------
const totalSuites = stats.suitesPassed + stats.suitesFailed;
console.log(`${BOLD}${CYAN}================================================================================${RESET}`);
console.log(`${BOLD} AST TEST SUITE VERIFICATION REPORT${RESET}`);
console.log(`${BOLD}${CYAN}================================================================================${RESET}`);
console.log(`Total Manifests & Substrates Tested: ${BOLD}${stats.filesTested}${RESET}`);
console.log(`Total AST Nodes Evaluated:           ${BOLD}${stats.astNodesParsed}${RESET}`);
console.log(`Determinism Invariant Checks:        ${BOLD}${stats.determinismChecks}${RESET}`);
console.log(`Syntax Corruptions Detected:         ${BOLD}${stats.corruptionsDetected === 0 ? GREEN + '0 (CLEAN)' : RED + stats.corruptionsDetected}${RESET}`);
console.log(`Unhandled Exceptions:                ${BOLD}${stats.unhandledExceptions === 0 ? GREEN + '0 (RESILIENT)' : RED + stats.unhandledExceptions}${RESET}`);
console.log(`Suites Passed:                       ${BOLD}${stats.suitesPassed} / ${totalSuites}${RESET}`);
console.log(`${BOLD}${CYAN}================================================================================${RESET}`);

if (stats.corruptionsDetected === 0 && stats.unhandledExceptions === 0 && stats.suitesFailed === 0) {
  console.log(`\n${BOLD}${GREEN}✔ VERIFIABLE PROOF OF DETERMINISM CONFIRMED: ALL AST MANIFESTS 100% VALID.${RESET}\n`);
  process.exit(0);
} else {
  console.error(`\n${BOLD}${RED}✘ VERIFICATION FAILED: Corruptions or unhandled exceptions detected.${RESET}\n`);
  process.exit(1);
}
