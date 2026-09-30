/**
 * scripts/simulate-swf-import.ts
 *
 * Automated simulation runner for legacy SWF to AST Vector Transpiler.
 * Tests multiple SWF binary structures (FWS, CWS zlib, DefineShape 1-4, quadratic Béziers,
 * ShowFrame sequences, FrameLabels, and adversarial corruptions).
 *
 * Verifies XML/SVG validity, AST S-Expression parseability, and performance metrics.
 */

import { transpileSwfToAst } from '../src/utils/swfAstParser';
import { parseSExpr } from '../src/utils/sexprParser';
import * as zlib from 'node:zlib';

interface SimulationReport {
  name: string;
  passed: boolean;
  durationMs: number;
  details: string;
  errors?: string[];
}

const reports: SimulationReport[] = [];

/**
 * BitWriter helper to construct valid binary SWF payloads in memory.
 */
class BitWriter {
  private bytes: number[] = [];
  private currentByte = 0;
  private bitPos = 0;

  writeUBits(val: number, nbits: number): void {
    for (let i = nbits - 1; i >= 0; i--) {
      const bit = (val >> i) & 1;
      this.currentByte = (this.currentByte << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.bytes.push(this.currentByte);
        this.currentByte = 0;
        this.bitPos = 0;
      }
    }
  }

  writeSBits(val: number, nbits: number): void {
    if (val < 0) {
      val = (1 << nbits) + val;
    }
    this.writeUBits(val, nbits);
  }

  syncBits(): void {
    if (this.bitPos > 0) {
      this.currentByte = this.currentByte << (8 - this.bitPos);
      this.bytes.push(this.currentByte);
      this.currentByte = 0;
      this.bitPos = 0;
    }
  }

  writeUI8(v: number): void {
    this.syncBits();
    this.bytes.push(v & 0xFF);
  }

  writeUI16(v: number): void {
    this.syncBits();
    this.bytes.push(v & 0xFF, (v >> 8) & 0xFF);
  }

  writeUI32(v: number): void {
    this.syncBits();
    this.bytes.push(
      v & 0xFF,
      (v >> 8) & 0xFF,
      (v >> 16) & 0xFF,
      (v >> 24) & 0xFF
    );
  }

  writeString(str: string): void {
    this.syncBits();
    for (let i = 0; i < str.length; i++) {
      this.bytes.push(str.charCodeAt(i));
    }
    this.bytes.push(0); // null terminator
  }

  writeRect(xMinTwips: number, xMaxTwips: number, yMinTwips: number, yMaxTwips: number): void {
    this.syncBits();
    const maxVal = Math.max(Math.abs(xMinTwips), Math.abs(xMaxTwips), Math.abs(yMinTwips), Math.abs(yMaxTwips), 1);
    const nbits = Math.min(31, Math.ceil(Math.log2(maxVal + 1)) + 2);

    this.writeUBits(nbits, 5);
    this.writeSBits(xMinTwips, nbits);
    this.writeSBits(xMaxTwips, nbits);
    this.writeSBits(yMinTwips, nbits);
    this.writeSBits(yMaxTwips, nbits);
    this.syncBits();
  }

  toByteArray(): Uint8Array {
    this.syncBits();
    return new Uint8Array(this.bytes);
  }
}

/**
 * Builds a complete uncompressed FWS SWF buffer from tag payload
 */
function assembleFwsSwf(
  widthPx: number,
  heightPx: number,
  frameRate: number,
  frameCount: number,
  tagsPayload: Uint8Array,
  version = 8
): Uint8Array {
  const headerWriter = new BitWriter();
  headerWriter.writeRect(0, widthPx * 20, 0, heightPx * 20);
  headerWriter.writeUI16(Math.round(frameRate * 256));
  headerWriter.writeUI16(frameCount);

  const headerBytes = headerWriter.toByteArray();
  const totalLength = 8 + headerBytes.length + tagsPayload.length;

  const full = new Uint8Array(totalLength);
  // Signature FWS
  full[0] = 0x46; // 'F'
  full[1] = 0x57; // 'W'
  full[2] = 0x53; // 'S'
  full[3] = version;
  // File length (little-endian 32-bit)
  full[4] = totalLength & 0xFF;
  full[5] = (totalLength >> 8) & 0xFF;
  full[6] = (totalLength >> 16) & 0xFF;
  full[7] = (totalLength >> 24) & 0xFF;

  full.set(headerBytes, 8);
  full.set(tagsPayload, 8 + headerBytes.length);

  return full;
}

/**
 * Builds a zlib-compressed CWS SWF buffer
 */
function assembleCwsSwf(
  widthPx: number,
  heightPx: number,
  frameRate: number,
  frameCount: number,
  tagsPayload: Uint8Array,
  version = 9
): Uint8Array {
  const bodyWriter = new BitWriter();
  bodyWriter.writeRect(0, widthPx * 20, 0, heightPx * 20);
  bodyWriter.writeUI16(Math.round(frameRate * 256));
  bodyWriter.writeUI16(frameCount);

  const bodyBytes = bodyWriter.toByteArray();
  const uncompressedBody = new Uint8Array(bodyBytes.length + tagsPayload.length);
  uncompressedBody.set(bodyBytes, 0);
  uncompressedBody.set(tagsPayload, bodyBytes.length);

  const totalUncompressedLength = 8 + uncompressedBody.length;
  const compressedBody = zlib.deflateSync(uncompressedBody);

  const full = new Uint8Array(8 + compressedBody.length);
  // Signature CWS
  full[0] = 0x43; // 'C'
  full[1] = 0x57; // 'W'
  full[2] = 0x53; // 'S'
  full[3] = version;
  // Uncompressed file length
  full[4] = totalUncompressedLength & 0xFF;
  full[5] = (totalUncompressedLength >> 8) & 0xFF;
  full[6] = (totalUncompressedLength >> 16) & 0xFF;
  full[7] = (totalUncompressedLength >> 24) & 0xFF;

  full.set(compressedBody, 8);
  return full;
}

/**
 * Writes a SWF tag with proper short/long header
 */
function writeTag(writer: BitWriter, tagType: number, tagData: Uint8Array): void {
  const len = tagData.length;
  if (len < 63) {
    writer.writeUI16((tagType << 6) | len);
  } else {
    writer.writeUI16((tagType << 6) | 0x3F);
    writer.writeUI32(len);
  }
  for (let i = 0; i < len; i++) {
    writer.writeUI8(tagData[i]);
  }
}

/**
 * Helper to construct a DefineShape tag with straight lines (e.g. geometric rectangle)
 */
function buildRectShapeTag(shapeId: number, x: number, y: number, w: number, h: number, fillColor = [56, 189, 248, 255], tagVersion = 2): Uint8Array {
  const wtr = new BitWriter();
  wtr.writeUI16(shapeId);
  // ShapeBounds
  wtr.writeRect(x * 20, (x + w) * 20, y * 20, (y + h) * 20);

  // FillStyles: 1 solid color
  wtr.writeUI8(1);
  wtr.writeUI8(0); // solid fill
  wtr.writeUI8(fillColor[0]);
  wtr.writeUI8(fillColor[1]);
  wtr.writeUI8(fillColor[2]);
  if (tagVersion >= 3) {
    wtr.writeUI8(fillColor[3]); // RGBA (SWF 8+ / DefineShape3/4)
  }

  // LineStyles: 1 line style
  wtr.writeUI8(1);
  wtr.writeUI16(2 * 20); // 2px width
  wtr.writeUI8(255);
  wtr.writeUI8(255);
  wtr.writeUI8(255);
  if (tagVersion >= 3) {
    wtr.writeUI8(255); // White RGBA (SWF 8+ / DefineShape3/4)
  }

  // NumFillBits (1), NumLineBits (1)
  wtr.writeUBits(1, 4);
  wtr.writeUBits(1, 4);

  // Non-edge record: MoveTo (x, y), FillStyle0 = 1, LineStyle = 1
  wtr.writeUBits(0, 1); // type = non-edge
  wtr.writeUBits(0x01 | 0x02 | 0x08, 5); // MoveTo, Fill0, Line
  const moveBits = 14;
  wtr.writeUBits(moveBits, 5);
  wtr.writeSBits(x * 20, moveBits);
  wtr.writeSBits(y * 20, moveBits);
  wtr.writeUBits(1, 1); // Fill0 = 1
  wtr.writeUBits(1, 1); // Line = 1

  // 4 Straight Edge Records (rectangle)
  const edgeBits = 14;
  // Edge 1: horizontal +w
  wtr.writeUBits(1, 1); // edge
  wtr.writeUBits(1, 1); // straight
  wtr.writeUBits(edgeBits - 2, 4);
  wtr.writeUBits(0, 1); // general = 0
  wtr.writeUBits(0, 1); // vert = 0 (horizontal)
  wtr.writeSBits(w * 20, edgeBits);

  // Edge 2: vertical +h
  wtr.writeUBits(1, 1); // edge
  wtr.writeUBits(1, 1); // straight
  wtr.writeUBits(edgeBits - 2, 4);
  wtr.writeUBits(0, 1); // general = 0
  wtr.writeUBits(1, 1); // vert = 1 (vertical)
  wtr.writeSBits(h * 20, edgeBits);

  // Edge 3: horizontal -w
  wtr.writeUBits(1, 1); // edge
  wtr.writeUBits(1, 1); // straight
  wtr.writeUBits(edgeBits - 2, 4);
  wtr.writeUBits(0, 1); // general = 0
  wtr.writeUBits(0, 1); // vert = 0 (horizontal)
  wtr.writeSBits(-w * 20, edgeBits);

  // Edge 4: vertical -h
  wtr.writeUBits(1, 1); // edge
  wtr.writeUBits(1, 1); // straight
  wtr.writeUBits(edgeBits - 2, 4);
  wtr.writeUBits(0, 1); // general = 0
  wtr.writeUBits(1, 1); // vert = 1 (vertical)
  wtr.writeSBits(-h * 20, edgeBits);

  // End of shape record (flags = 0)
  wtr.writeUBits(0, 1);
  wtr.writeUBits(0, 5);

  return wtr.toByteArray();
}

/**
 * Helper to construct a DefineShape tag with quadratic curved edges (Bézier curves)
 */
function buildCurvedShapeTag(shapeId: number): Uint8Array {
  const wtr = new BitWriter();
  wtr.writeUI16(shapeId);
  wtr.writeRect(100 * 20, 300 * 20, 100 * 20, 300 * 20);

  // FillStyles: 1 solid color (purple/indigo)
  wtr.writeUI8(1);
  wtr.writeUI8(0);
  wtr.writeUI8(99);
  wtr.writeUI8(102);
  wtr.writeUI8(241);
  wtr.writeUI8(255);

  // LineStyles: 1 line style
  wtr.writeUI8(1);
  wtr.writeUI16(2 * 20);
  wtr.writeUI8(255);
  wtr.writeUI8(255);
  wtr.writeUI8(255);
  wtr.writeUI8(255);

  wtr.writeUBits(1, 4);
  wtr.writeUBits(1, 4);

  // Non-edge record: MoveTo (100, 100)
  wtr.writeUBits(0, 1);
  wtr.writeUBits(0x01 | 0x02 | 0x08, 5);
  wtr.writeUBits(14, 5);
  wtr.writeSBits(100 * 20, 14);
  wtr.writeSBits(100 * 20, 14);
  wtr.writeUBits(1, 1);
  wtr.writeUBits(1, 1);

  // Curved Edge 1 (Quadratic Bézier): Control point (+50, -30), Anchor point (+100, +50)
  const nbits = 14;
  wtr.writeUBits(1, 1); // edge
  wtr.writeUBits(0, 1); // curved (straightFlag = 0)
  wtr.writeUBits(nbits - 2, 4);
  wtr.writeSBits(50 * 20, nbits); // ControlDeltaX
  wtr.writeSBits(-30 * 20, nbits); // ControlDeltaY
  wtr.writeSBits(50 * 20, nbits); // AnchorDeltaX
  wtr.writeSBits(80 * 20, nbits); // AnchorDeltaY

  // Straight line back
  wtr.writeUBits(1, 1); // edge
  wtr.writeUBits(1, 1); // straight
  wtr.writeUBits(nbits - 2, 4);
  wtr.writeUBits(1, 1); // general
  wtr.writeSBits(-100 * 20, nbits);
  wtr.writeSBits(-50 * 20, nbits);

  // End record
  wtr.writeUBits(0, 1);
  wtr.writeUBits(0, 5);

  return wtr.toByteArray();
}

async function runSimulations() {
  console.log('\n=============================================================');
  console.log('🧪 St Joseph\'s Educational SWF-to-AST Transpiler Simulation');
  console.log('=============================================================\n');

  // --------------------------------------------------------------------------
  // SIMULATION 1: Standard FWS Uncompressed SWF with Geometry & Frames
  // --------------------------------------------------------------------------
  {
    const start = performance.now();
    const tagWriter = new BitWriter();

    // Tag 9: SetBackgroundColor (#090d16)
    writeTag(tagWriter, 9, new Uint8Array([0x09, 0x0d, 0x16]));

    // Tag 22: DefineShape2 (id: 1)
    const rectShape = buildRectShapeTag(1, 50, 50, 200, 120, [16, 185, 129, 255]);
    writeTag(tagWriter, 22, rectShape);

    // Tag 43: FrameLabel ("Scene Start")
    const lbl1 = new BitWriter();
    lbl1.writeString('Scene Start');
    writeTag(tagWriter, 43, lbl1.toByteArray());

    // Tag 1: ShowFrame
    writeTag(tagWriter, 1, new Uint8Array(0));

    // Tag 43: FrameLabel ("Midpoint")
    const lbl2 = new BitWriter();
    lbl2.writeString('Midpoint');
    writeTag(tagWriter, 43, lbl2.toByteArray());

    // Tag 1: ShowFrame
    writeTag(tagWriter, 1, new Uint8Array(0));

    // Tag 0: End
    writeTag(tagWriter, 0, new Uint8Array(0));

    const swfBinary = assembleFwsSwf(800, 480, 24, 24, tagWriter.toByteArray(), 8);
    const result = await transpileSwfToAst(swfBinary, 'sim-fws-basic');
    const duration = performance.now() - start;

    const errors: string[] = [];
    if (!result.success) errors.push(`Transpilation failed: ${result.error}`);
    if (result.metadata?.signature !== 'FWS') errors.push(`Expected FWS signature, got ${result.metadata?.signature}`);
    if (result.metadata?.width !== 800) errors.push(`Expected width 800, got ${result.metadata?.width}`);
    if (result.metadata?.height !== 480) errors.push(`Expected height 480, got ${result.metadata?.height}`);
    if (!result.svgMarkup.includes('<svg') || !result.svgMarkup.includes('</svg>')) errors.push('Generated SVG markup missing <svg> tags');
    if (!result.svgMarkup.includes('d="M 50.0 50.0')) errors.push('SVG does not contain expected MoveTo 50.0 50.0');

    // Verify AST S-Expression parseability
    const ast = parseSExpr(result.astSource);
    if (!ast) errors.push('Failed to parse generated AST S-Expressions via sexprParser');

    reports.push({
      name: 'Sim 1: Standard FWS Uncompressed SWF (Geometry & Frames)',
      passed: errors.length === 0,
      durationMs: duration,
      details: `Generated ${result.metadata?.shapeCount} shapes, ${result.metadata?.frameCount} frames in ${duration.toFixed(2)}ms.`,
      errors
    });
  }

  // --------------------------------------------------------------------------
  // SIMULATION 2: Curved Quadratic Bézier Curves (DefineShape3 with Q commands)
  // --------------------------------------------------------------------------
  {
    const start = performance.now();
    const tagWriter = new BitWriter();

    // Tag 32: DefineShape3 (id: 2) with Bézier curve
    const curveShape = buildCurvedShapeTag(2);
    writeTag(tagWriter, 32, curveShape);

    // Tag 0: End
    writeTag(tagWriter, 0, new Uint8Array(0));

    const swfBinary = assembleFwsSwf(640, 480, 30, 30, tagWriter.toByteArray(), 9);
    const result = await transpileSwfToAst(swfBinary, 'sim-bezier-curve');
    const duration = performance.now() - start;

    const errors: string[] = [];
    if (!result.success) errors.push(`Transpilation failed: ${result.error}`);
    if (!result.svgMarkup.includes('Q ')) errors.push('SVG does not contain Quadratic Bézier curve "Q " command');
    if (!result.svgMarkup.includes('fill="#6366f1"')) errors.push('Expected shape fill #6366f1 not found');

    const ast = parseSExpr(result.astSource);
    if (!ast) errors.push('AST S-Expression parse failed');

    reports.push({
      name: 'Sim 2: Curved Quadratic Bézier Vectors (SVG Q Commands)',
      passed: errors.length === 0,
      durationMs: duration,
      details: `Extracted quadratic Béziers into clean SVG path markup with bounding box ${result.metadata?.width}x${result.metadata?.height}.`,
      errors
    });
  }

  // --------------------------------------------------------------------------
  // SIMULATION 3: CWS Zlib-Compressed SWF Payload (Native Decompression)
  // --------------------------------------------------------------------------
  {
    const start = performance.now();
    const tagWriter = new BitWriter();

    // Tag 9: SetBackgroundColor (#1e293b)
    writeTag(tagWriter, 9, new Uint8Array([0x1e, 0x29, 0x3b]));

    // Tag 22: DefineShape2
    const shape = buildRectShapeTag(3, 100, 100, 300, 200, [234, 88, 12, 255]);
    writeTag(tagWriter, 22, shape);

    // Multiple ShowFrames
    for (let i = 0; i < 48; i++) {
      if (i === 12) {
        const lbl = new BitWriter();
        lbl.writeString('Equilibrium');
        writeTag(tagWriter, 43, lbl.toByteArray());
      }
      writeTag(tagWriter, 1, new Uint8Array(0));
    }
    writeTag(tagWriter, 0, new Uint8Array(0));

    const cwsBinary = assembleCwsSwf(720, 480, 24, 48, tagWriter.toByteArray(), 9);
    const result = await transpileSwfToAst(cwsBinary, 'sim-cws-compressed');
    const duration = performance.now() - start;

    const errors: string[] = [];
    if (!result.success) errors.push(`CWS Decompression/Transpilation failed: ${result.error}`);
    if (result.metadata?.signature !== 'CWS') errors.push(`Expected CWS signature, got ${result.metadata?.signature}`);
    if (result.metadata?.backgroundColor !== '#1e293b') errors.push(`Expected background #1e293b, got ${result.metadata?.backgroundColor}`);
    if (!result.astSource.includes('Equilibrium')) errors.push('Keyframe label "Equilibrium" was not preserved in AST');

    const ast = parseSExpr(result.astSource);
    if (!ast) errors.push('AST S-Expression parse failed');

    reports.push({
      name: 'Sim 3: Compressed CWS SWF (Zlib Decompression Stream)',
      passed: errors.length === 0,
      durationMs: duration,
      details: `Decompressed ${cwsBinary.length} compressed bytes into ${result.metadata?.fileLength} uncompressed bytes in ${duration.toFixed(2)}ms.`,
      errors
    });
  }

  // --------------------------------------------------------------------------
  // SIMULATION 4: Adversarial & Edge-Case Robustness Testing
  // --------------------------------------------------------------------------
  {
    const start = performance.now();
    const errors: string[] = [];

    // Test 4a: File too short (< 8 bytes)
    const tooShort = new Uint8Array([0x46, 0x57, 0x53]);
    const resShort = await transpileSwfToAst(tooShort, 'short');
    if (resShort.success) errors.push('Expected short file to fail gracefully');

    // Test 4b: Invalid signature
    const badSig = new Uint8Array([0x58, 0x59, 0x5a, 0x08, 0x00, 0x00, 0x00, 0x10]);
    const resBadSig = await transpileSwfToAst(badSig, 'bad-sig');
    if (resBadSig.success) errors.push('Expected bad signature to fail gracefully');

    // Test 4c: Zero-dimension rect and truncated tag length
    const corruptWriter = new BitWriter();
    corruptWriter.writeRect(0, 0, 0, 0); // 0x0 canvas
    corruptWriter.writeUI16(0);
    corruptWriter.writeUI16(0);
    // Write corrupted long tag length that exceeds payload length
    corruptWriter.writeUI16((22 << 6) | 0x3F);
    corruptWriter.writeUI32(9999999); // Exceeds payload

    const corruptBytes = corruptWriter.toByteArray();
    const corruptFull = new Uint8Array(8 + corruptBytes.length);
    corruptFull.set([0x46, 0x57, 0x53, 0x08, corruptFull.length, 0, 0, 0]);
    corruptFull.set(corruptBytes, 8);

    const resCorrupt = await transpileSwfToAst(corruptFull, 'corrupted');
    // Must not crash or hang in infinite loop, must fallback safely
    if (!resCorrupt.success) errors.push(`Corrupted SWF crashed instead of graceful fallback: ${resCorrupt.error}`);
    if (!resCorrupt.svgMarkup.includes('<svg')) errors.push('Fallback SVG missing for corrupted stream');

    const duration = performance.now() - start;
    reports.push({
      name: 'Sim 4: Adversarial & Edge-Case Input Robustness',
      passed: errors.length === 0,
      durationMs: duration,
      details: 'Validated short inputs, invalid magic headers, and out-of-bounds tag offsets without crashing.',
      errors
    });
  }

  // --------------------------------------------------------------------------
  // SIMULATION 5: Realistic Educational Flash Lab (Pendulum Harmonic Motion)
  // --------------------------------------------------------------------------
  {
    const start = performance.now();
    const tagWriter = new BitWriter();

    // Set dark lab background
    writeTag(tagWriter, 9, new Uint8Array([0x0b, 0x11, 0x20]));

    // Stand top bar
    const standBar = buildRectShapeTag(1, 350, 40, 100, 12, [148, 163, 184, 255]);
    writeTag(tagWriter, 22, standBar);

    // String + Bob
    const bob = buildRectShapeTag(2, 395, 52, 10, 240, [56, 189, 248, 255]);
    writeTag(tagWriter, 22, bob);

    // Milestone labels
    const milestones = [
      { frame: 1, name: 'Initial Release (Max Potential Energy)' },
      { frame: 12, name: 'Equilibrium Crossing (Max Velocity)' },
      { frame: 24, name: 'Opposite Amplitude Peak' },
      { frame: 36, name: 'Return Swing' },
      { frame: 48, name: 'Full Harmonic Period (T = 2.0s)' },
    ];

    let currentFrame = 1;
    for (const m of milestones) {
      while (currentFrame < m.frame) {
        writeTag(tagWriter, 1, new Uint8Array(0));
        currentFrame++;
      }
      const lbl = new BitWriter();
      lbl.writeString(m.name);
      writeTag(tagWriter, 43, lbl.toByteArray());
      writeTag(tagWriter, 1, new Uint8Array(0));
      currentFrame++;
    }

    writeTag(tagWriter, 0, new Uint8Array(0));

    const swfBinary = assembleFwsSwf(800, 500, 24, 48, tagWriter.toByteArray(), 8);
    const result = await transpileSwfToAst(swfBinary, 'physics-pendulum-lab');
    const duration = performance.now() - start;

    const errors: string[] = [];
    if (!result.success) errors.push(`Transpilation failed: ${result.error}`);
    if (result.metadata?.labels.length !== 5) errors.push(`Expected 5 milestone labels, got ${result.metadata?.labels.length}`);
    if (!result.astSource.includes('Max Potential Energy')) errors.push('Milestone text missing from AST');
    if (!result.astSource.includes('chk-swf-1')) errors.push('Interactive quiz checkpoint missing from AST');

    const ast = parseSExpr(result.astSource);
    if (!ast) errors.push('Generated AST failed S-Expression validator');

    reports.push({
      name: 'Sim 5: Realistic Educational Flash Lab (Harmonic Motion Simulation)',
      passed: errors.length === 0,
      durationMs: duration,
      details: `Transpiled physics lab with ${result.metadata?.shapeCount} shapes, ${result.metadata?.labels.length} chapters, and active recall checkpoints.`,
      errors
    });
  }

  // --------------------------------------------------------------------------
  // Summary Presentation
  // --------------------------------------------------------------------------
  console.log('RESULTS BREAKDOWN:\n');
  let allPassed = true;
  for (const r of reports) {
    const mark = r.passed ? '✅ PASS' : '❌ FAIL';
    if (!r.passed) allPassed = false;
    console.log(`[${mark}] ${r.name} (${r.durationMs.toFixed(2)} ms)`);
    console.log(`       ${r.details}`);
    if (r.errors && r.errors.length > 0) {
      for (const err of r.errors) {
        console.log(`       ⚠️ ERROR: ${err}`);
      }
    }
  }

  console.log('\n=============================================================');
  if (allPassed) {
    console.log('🎉 ALL 5 SIMULATIONS PASSED! No SWF import issues detected.');
  } else {
    console.log('⚠️ SIMULATION ENCOUNTERED ISSUES. Please review logs above.');
    process.exit(1);
  }
  console.log('=============================================================\n');
}

runSimulations().catch(err => {
  console.error('Fatal simulation error:', err);
  process.exit(1);
});
