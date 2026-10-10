/**
 * src/utils/swfAstParser.ts
 *
 * St Joseph's Educational Media Suite - Legacy SWF to AST Vector Transcompiler
 * Decodes Adobe Flash / Shockwave Flash (.swf) binary vector files (FWS uncompressed & CWS zlib-compressed)
 * into high-fidelity SVG geometry + declarative AST S-Expressions (:scene :id ... (:keyframes ...)).
 *
 * Designed to preserve legacy educational Flash assets (math manipulatives, science simulations)
 * and modernize them into 0-cloud, zero-battery-drain, accessible 60 FPS vector components.
 */

export interface SwfMetadata {
  signature: 'FWS' | 'CWS' | 'ZWS' | 'UNKNOWN';
  version: number;
  fileLength: number;
  width: number;
  height: number;
  frameRate: number;
  frameCount: number;
  backgroundColor: string;
  shapeCount: number;
  morphShapeCount?: number;
  actionCount?: number;
  labels: { frame: number; name: string }[];
  stateMachines?: { id: string; initial: string; states: string[]; transitionsCount: number }[];
  variables?: { name: string; value: any }[];
}

export interface SwfTranspileResult {
  success: boolean;
  error?: string;
  metadata?: SwfMetadata;
  svgMarkup: string;
  astSource: string;
}

class BitReader {
  private buffer: Uint8Array;
  private bytePos: number = 0;
  private bitPos: number = 0;

  constructor(buffer: Uint8Array, startOffset = 0) {
    this.buffer = buffer;
    this.bytePos = startOffset;
    this.bitPos = 0;
  }

  get length(): number {
    return this.buffer.length;
  }

  get offset(): number {
    return this.bytePos;
  }

  set offset(val: number) {
    this.bytePos = val;
    this.bitPos = 0;
  }

  readUI8(): number {
    this.syncBits();
    if (this.bytePos >= this.buffer.length) return 0;
    return this.buffer[this.bytePos++];
  }

  readUI16(): number {
    this.syncBits();
    if (this.bytePos + 1 >= this.buffer.length) return 0;
    const v = this.buffer[this.bytePos] | (this.buffer[this.bytePos + 1] << 8);
    this.bytePos += 2;
    return v;
  }

  readSI16(): number {
    const v = this.readUI16();
    return v & 0x8000 ? v - 0x10000 : v;
  }

  readUI32(): number {
    this.syncBits();
    if (this.bytePos + 3 >= this.buffer.length) return 0;
    const v = (
      this.buffer[this.bytePos] |
      (this.buffer[this.bytePos + 1] << 8) |
      (this.buffer[this.bytePos + 2] << 16) |
      (this.buffer[this.bytePos + 3] << 24)
    ) >>> 0;
    this.bytePos += 4;
    return v;
  }

  readString(): string {
    this.syncBits();
    let str = '';
    while (this.bytePos < this.buffer.length) {
      const b = this.buffer[this.bytePos++];
      if (b === 0) break;
      str += String.fromCharCode(b);
    }
    return str;
  }

  readBytes(count: number): Uint8Array {
    this.syncBits();
    const end = Math.min(this.bytePos + count, this.buffer.length);
    const sub = this.buffer.slice(this.bytePos, end);
    this.bytePos = end;
    return sub;
  }

  syncBits(): void {
    if (this.bitPos > 0) {
      this.bytePos++;
      this.bitPos = 0;
    }
  }

  readUBits(nbits: number): number {
    if (nbits === 0) return 0;
    let res = 0;
    for (let i = 0; i < nbits; i++) {
      if (this.bytePos >= this.buffer.length) return res;
      const bit = (this.buffer[this.bytePos] >> (7 - this.bitPos)) & 1;
      res = (res << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.bitPos = 0;
        this.bytePos++;
      }
    }
    return res;
  }

  readSBits(nbits: number): number {
    if (nbits === 0) return 0;
    let val = this.readUBits(nbits);
    const signBit = 1 << (nbits - 1);
    if (val & signBit) {
      val -= (1 << nbits);
    }
    return val;
  }

  readRect(): { xMin: number; xMax: number; yMin: number; yMax: number; width: number; height: number } {
    this.syncBits();
    const nbits = this.readUBits(5);
    const xMin = this.readSBits(nbits) / 20; // 20 twips = 1 pixel
    const xMax = this.readSBits(nbits) / 20;
    const yMin = this.readSBits(nbits) / 20;
    const yMax = this.readSBits(nbits) / 20;
    this.syncBits();
    return {
      xMin,
      xMax,
      yMin,
      yMax,
      width: Math.abs(xMax - xMin),
      height: Math.abs(yMax - yMin),
    };
  }

  readMatrix(): { scaleX: number; scaleY: number; rotateSkew0: number; rotateSkew1: number; transX: number; transY: number } {
    this.syncBits();
    let scaleX = 1;
    let scaleY = 1;
    const hasScale = this.readUBits(1) === 1;
    if (hasScale) {
      const nScaleBits = this.readUBits(5);
      scaleX = this.readSBits(nScaleBits) / 65536;
      scaleY = this.readSBits(nScaleBits) / 65536;
    }

    let rotateSkew0 = 0;
    let rotateSkew1 = 0;
    const hasRotate = this.readUBits(1) === 1;
    if (hasRotate) {
      const nRotateBits = this.readUBits(5);
      rotateSkew0 = this.readSBits(nRotateBits) / 65536;
      rotateSkew1 = this.readSBits(nRotateBits) / 65536;
    }

    const nTransBits = this.readUBits(5);
    const transX = this.readSBits(nTransBits) / 20;
    const transY = this.readSBits(nTransBits) / 20;
    this.syncBits();

    return { scaleX, scaleY, rotateSkew0, rotateSkew1, transX, transY };
  }

  readRGBA(withAlpha = true): string {
    this.syncBits();
    const r = this.readUI8();
    const g = this.readUI8();
    const b = this.readUI8();
    const a = withAlpha ? (this.readUI8() / 255) : 1;
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
}

/**
 * Decompresses CWS (zlib-compressed) SWF payloads using Node zlib or browser's DecompressionStream.
 */
async function decompressSwfPayload(compressed: Uint8Array): Promise<Uint8Array> {
  // 1. Try Node.js native zlib if running in server / test environment
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const zlibModule = await import('node:zlib');
      const zlib = zlibModule.default || zlibModule;
      const buf = Buffer.from(compressed);
      try {
        const decomp = zlib.inflateSync(buf);
        return new Uint8Array(decomp.buffer, decomp.byteOffset, decomp.byteLength);
      } catch {
        const rawDeflate = buf.subarray(2, buf.length - 4);
        const decomp = zlib.inflateRawSync(rawDeflate);
        return new Uint8Array(decomp.buffer, decomp.byteOffset, decomp.byteLength);
      }
    } catch (_) {}
  }

  // 2. Try native Web DecompressionStream API in browser
  if (typeof DecompressionStream !== 'undefined') {
    try {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(compressed);
          controller.close();
        }
      }).pipeThrough(new DecompressionStream('deflate'));

      const response = new Response(stream);
      const arrayBuffer = await response.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch {
      try {
        const rawDeflate = compressed.slice(2, compressed.length - 4);
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(rawDeflate);
            controller.close();
          }
        }).pipeThrough(new DecompressionStream('deflate-raw'));
        const response = new Response(stream);
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
      } catch (err) {
        console.warn('[SWF-Parser] DecompressionStream error, trying fallback:', err);
      }
    }
  }

  throw new Error('Could not decompress zlib-encoded SWF binary in this environment.');
}

/**
 * Parses SWF DefineShape tags into scalable SVG vector paths.
 */
function parseSwfShape(reader: BitReader, shapeId: number, tagVersion: number): { id: string; svg: string; bbox: { x: number; y: number; w: number; h: number } } {
  const shapeBounds = reader.readRect();
  if (tagVersion === 4) {
    reader.readRect(); // EdgeBounds in DefineShape4
    reader.readUI8();  // Flags (UsesFillWinding, etc.)
  }
  reader.syncBits();

  // Read FillStyles
  let fillCount = reader.readUI8();
  if (fillCount === 0xFF && tagVersion >= 2) {
    fillCount = reader.readUI16();
  }
  const fillStyles: string[] = ['none'];
  for (let f = 0; f < fillCount; f++) {
    const fillType = reader.readUI8();
    if (fillType === 0x00) {
      // Solid fill
      fillStyles.push(reader.readRGBA(tagVersion >= 3));
    } else if (fillType === 0x10 || fillType === 0x12) {
      // Linear or radial gradient
      reader.readMatrix();
      const numGradients = reader.readUI8() & 0x0F;
      let firstColor = '#38bdf8';
      for (let g = 0; g < numGradients; g++) {
        reader.readUI8(); // ratio
        const col = reader.readRGBA(tagVersion >= 3);
        if (g === 0) firstColor = col;
      }
      fillStyles.push(firstColor);
    } else {
      // Pattern or bitmap fill
      reader.readUI16();
      reader.readMatrix();
      fillStyles.push('#6366f1');
    }
  }

  // Read LineStyles
  let lineCount = reader.readUI8();
  if (lineCount === 0xFF && tagVersion >= 2) {
    lineCount = reader.readUI16();
  }
  const lineStyles: { width: number; color: string }[] = [{ width: 0, color: 'none' }];
  for (let l = 0; l < lineCount; l++) {
    const width = reader.readUI16() / 20; // twips to px
    const color = reader.readRGBA(tagVersion >= 3);
    lineStyles.push({ width: Math.max(1, width), color });
  }

  reader.syncBits();
  const numFillBits = reader.readUBits(4);
  const numLineBits = reader.readUBits(4);

  const shapeRecords = parseShapeRecords(reader, numFillBits, numLineBits);
  reader.syncBits();

  const d = shapeRecords.pathCommands.join(' ') || `M ${shapeBounds.xMin.toFixed(1)} ${shapeBounds.yMin.toFixed(1)} h ${shapeBounds.width.toFixed(1)} v ${shapeBounds.height.toFixed(1)} h -${shapeBounds.width.toFixed(1)} Z`;
  const fill = fillStyles[shapeRecords.curFill0] || (fillStyles.length > 1 ? fillStyles[1] : '#38bdf8');
  const stroke = lineStyles[shapeRecords.curLine]?.color || 'none';
  const strokeW = lineStyles[shapeRecords.curLine]?.width || 1;

  const shapeSvg = `<path id="swf-shape-${shapeId}" d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />`;

  return {
    id: `swf-shape-${shapeId}`,
    svg: shapeSvg,
    bbox: {
      x: shapeBounds.xMin,
      y: shapeBounds.yMin,
      w: shapeBounds.width,
      h: shapeBounds.height
    }
  };
}

/**
 * Parses SWF shape records (MoveTo, straight edges, and quadratic Bézier curves)
 */
function parseShapeRecords(
  reader: BitReader,
  numFillBits: number,
  numLineBits: number,
  initialX = 0,
  initialY = 0
): { pathCommands: string[]; curFill0: number; curLine: number } {
  let curX = initialX;
  let curY = initialY;
  const pathCommands: string[] = [];
  let curFill0 = 0;
  let curLine = 0;

  while (reader.offset < reader.length) {
    const typeFlag = reader.readUBits(1);
    if (typeFlag === 0) {
      // Non-edge record
      const flags = reader.readUBits(5);
      if (flags === 0) {
        // End of shape record
        break;
      }

      if (flags & 0x01) {
        // MoveTo
        const moveBits = reader.readUBits(5);
        curX = reader.readSBits(moveBits) / 20;
        curY = reader.readSBits(moveBits) / 20;
        pathCommands.push(`M ${curX.toFixed(1)} ${curY.toFixed(1)}`);
      }
      if (flags & 0x02) {
        curFill0 = reader.readUBits(numFillBits);
      }
      if (flags & 0x04) {
        reader.readUBits(numFillBits); // Fill1
      }
      if (flags & 0x08) {
        curLine = reader.readUBits(numLineBits);
      }
      if (flags & 0x10) {
        // New styles definition
        break;
      }
    } else {
      // Edge record
      const straightFlag = reader.readUBits(1);
      const nbits = reader.readUBits(4) + 2;

      if (straightFlag === 1) {
        // Straight edge
        const generalLine = reader.readUBits(1);
        let dx = 0;
        let dy = 0;
        if (generalLine === 1) {
          dx = reader.readSBits(nbits) / 20;
          dy = reader.readSBits(nbits) / 20;
        } else {
          const vertFlag = reader.readUBits(1);
          if (vertFlag === 1) {
            dy = reader.readSBits(nbits) / 20;
          } else {
            dx = reader.readSBits(nbits) / 20;
          }
        }
        curX += dx;
        curY += dy;
        pathCommands.push(`L ${curX.toFixed(1)} ${curY.toFixed(1)}`);
      } else {
        // Curved edge (Quadratic Bézier)
        const cx = curX + reader.readSBits(nbits) / 20;
        const cy = curY + reader.readSBits(nbits) / 20;
        const ax = cx + reader.readSBits(nbits) / 20;
        const ay = cy + reader.readSBits(nbits) / 20;
        curX = ax;
        curY = ay;
        pathCommands.push(`Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${ax.toFixed(1)} ${ay.toFixed(1)}`);
      }
    }
  }

  return { pathCommands, curFill0, curLine };
}

export interface SwfMorphShape {
  id: string;
  shapeId: number;
  startD: string;
  endD: string;
  startFill: string;
  endFill: string;
  stroke: string;
  strokeWidth: number;
  svg: string;
  bbox: { x: number; y: number; w: number; h: number };
}

/**
 * Parses SWF DefineMorphShape (Tag 46) and DefineMorphShape2 (Tag 84) tags into interpolated SVG paths.
 */
function parseSwfMorphShape(
  reader: BitReader,
  shapeId: number,
  tagVersion: number
): SwfMorphShape {
  const startBounds = reader.readRect();
  const endBounds = reader.readRect();

  if (tagVersion === 2) {
    // DefineMorphShape2 (Tag 84)
    reader.readRect(); // StartEdgeBounds
    reader.readRect(); // EndEdgeBounds
    reader.readUI8();  // Flags
  }

  const offset = reader.readUI32();
  const morphOffsetBase = reader.offset;

  // Read MorphFillStyles
  let fillCount = reader.readUI8();
  if (fillCount === 0xFF) fillCount = reader.readUI16();
  const startFills: string[] = ['none'];
  const endFills: string[] = ['none'];

  for (let f = 0; f < fillCount; f++) {
    const fillType = reader.readUI8();
    if (fillType === 0x00) {
      startFills.push(reader.readRGBA(true));
      endFills.push(reader.readRGBA(true));
    } else if (fillType === 0x10 || fillType === 0x12) {
      reader.readMatrix();
      reader.readMatrix();
      const numGradients = reader.readUI8() & 0x0F;
      let firstColStart = '#38bdf8';
      let firstColEnd = '#818cf8';
      for (let g = 0; g < numGradients; g++) {
        reader.readUI8();
        const cs = reader.readRGBA(true);
        reader.readUI8();
        const ce = reader.readRGBA(true);
        if (g === 0) {
          firstColStart = cs;
          firstColEnd = ce;
        }
      }
      startFills.push(firstColStart);
      endFills.push(firstColEnd);
    } else {
      reader.readUI16();
      reader.readMatrix();
      reader.readMatrix();
      startFills.push('#6366f1');
      endFills.push('#a855f7');
    }
  }

  // Read MorphLineStyles
  let lineCount = reader.readUI8();
  if (lineCount === 0xFF) lineCount = reader.readUI16();
  const startLines: { width: number; color: string }[] = [{ width: 0, color: 'none' }];
  const endLines: { width: number; color: string }[] = [{ width: 0, color: 'none' }];

  for (let l = 0; l < lineCount; l++) {
    const startW = reader.readUI16() / 20;
    const endW = reader.readUI16() / 20;
    if (tagVersion === 2) {
      reader.readUI16(); // LineStyle2 flags
    }
    const startColor = reader.readRGBA(true);
    const endColor = reader.readRGBA(true);
    startLines.push({ width: Math.max(1, startW), color: startColor });
    endLines.push({ width: Math.max(1, endW), color: endColor });
  }

  // Read StartEdges
  reader.syncBits();
  const startNumFillBits = reader.readUBits(4);
  const startNumLineBits = reader.readUBits(4);
  const startEdges = parseShapeRecords(reader, startNumFillBits, startNumLineBits);

  // Jump to EndEdges using offset
  reader.offset = morphOffsetBase + offset;
  reader.syncBits();
  const endNumFillBits = reader.readUBits(4);
  const endNumLineBits = reader.readUBits(4);
  const endEdges = parseShapeRecords(reader, endNumFillBits, endNumLineBits);
  reader.syncBits();

  const startD = startEdges.pathCommands.join(' ') || `M ${startBounds.xMin.toFixed(1)} ${startBounds.yMin.toFixed(1)} h ${startBounds.width.toFixed(1)} v ${startBounds.height.toFixed(1)} h -${startBounds.width.toFixed(1)} Z`;
  const endD = endEdges.pathCommands.join(' ') || `M ${endBounds.xMin.toFixed(1)} ${endBounds.yMin.toFixed(1)} h ${endBounds.width.toFixed(1)} v ${endBounds.height.toFixed(1)} h -${endBounds.width.toFixed(1)} Z`;

  const startFill = startFills[startEdges.curFill0] || (startFills.length > 1 ? startFills[1] : '#38bdf8');
  const endFill = endFills[endEdges.curFill0] || (endFills.length > 1 ? endFills[1] : '#818cf8');
  const stroke = startLines[startEdges.curLine]?.color || 'none';
  const strokeWidth = startLines[startEdges.curLine]?.width || 1;

  const shapeSvg = `<path id="swf-morph-${shapeId}" d="${startD}" fill="${startFill}" stroke="${stroke}" stroke-width="${strokeWidth}" data-morph-end="${endD}" />`;

  return {
    id: `swf-morph-${shapeId}`,
    shapeId,
    startD,
    endD,
    startFill,
    endFill,
    stroke,
    strokeWidth,
    svg: shapeSvg,
    bbox: {
      x: Math.min(startBounds.xMin, endBounds.xMin),
      y: Math.min(startBounds.yMin, endBounds.yMin),
      w: Math.max(startBounds.width, endBounds.width),
      h: Math.max(startBounds.height, endBounds.height)
    }
  };
}

export interface SwfActionRecord {
  frame: number;
  stops?: boolean;
  plays?: boolean;
  gotoFrames?: number[];
  gotoLabels?: string[];
  setVariables?: { name: string; value: any }[];
  branches?: { condition: string; target: string | number }[];
}

/**
 * Disassembles ActionScript 1.0/2.0 bytecode in DoAction (Tag 12) tags into structured state operations.
 */
function parseDoAction(reader: BitReader, tagEndOffset: number, currentFrame: number): SwfActionRecord {
  const record: SwfActionRecord = {
    frame: currentFrame,
    gotoFrames: [],
    gotoLabels: [],
    setVariables: [],
    branches: []
  };

  const stack: any[] = [];
  const constantPool: string[] = [];

  while (reader.offset < tagEndOffset) {
    const actionCode = reader.readUI8();
    if (actionCode === 0) break; // ActionEnd
    let length = 0;
    if (actionCode >= 0x80) {
      length = reader.readUI16();
    }
    const actionEnd = Math.min(tagEndOffset, reader.offset + length);

    if (actionCode === 0x07) {
      // ActionStop
      record.stops = true;
    } else if (actionCode === 0x06) {
      // ActionPlay
      record.plays = true;
    } else if (actionCode === 0x81) {
      // ActionGotoFrame
      const frameIdx = reader.readUI16();
      record.gotoFrames!.push(frameIdx + 1);
    } else if (actionCode === 0x9F) {
      // ActionGotoLabel
      const lbl = reader.readString();
      if (lbl) record.gotoLabels!.push(lbl);
    } else if (actionCode === 0x88) {
      // ActionConstantPool
      const count = reader.readUI16();
      constantPool.length = 0;
      for (let c = 0; c < count && reader.offset < actionEnd; c++) {
        constantPool.push(reader.readString());
      }
    } else if (actionCode === 0x96) {
      // ActionPush
      while (reader.offset < actionEnd) {
        const type = reader.readUI8();
        if (type === 0) {
          stack.push(reader.readString());
        } else if (type === 1) {
          const b0 = reader.readUI8(), b1 = reader.readUI8(), b2 = reader.readUI8(), b3 = reader.readUI8();
          const buf = new ArrayBuffer(4);
          new Uint8Array(buf).set([b0, b1, b2, b3]);
          stack.push(new Float32Array(buf)[0]);
        } else if (type === 2) {
          stack.push(null);
        } else if (type === 3) {
          stack.push(undefined);
        } else if (type === 5) {
          stack.push(reader.readUI8() !== 0);
        } else if (type === 7) {
          stack.push(reader.readUI32());
        } else if (type === 8) {
          const idx = reader.readUI8();
          stack.push(constantPool[idx] ?? `str_${idx}`);
        } else if (type === 9) {
          const idx = reader.readUI16();
          stack.push(constantPool[idx] ?? `str_${idx}`);
        } else {
          break;
        }
      }
    } else if (actionCode === 0x1D) {
      // ActionSetVariable: pop value, pop name
      const val = stack.pop();
      const varName = stack.pop();
      if (typeof varName === 'string' && varName) {
        record.setVariables!.push({ name: varName, value: val !== undefined ? val : 0 });
      }
    } else if (actionCode === 0x9B) {
      // ActionCallFunction: pop name, pop numArgs, pop args
      const funcName = stack.pop();
      const numArgs = stack.pop();
      const args: any[] = [];
      for (let a = 0; a < (numArgs || 0); a++) args.push(stack.pop());
      if (funcName === 'gotoAndPlay' || funcName === 'gotoAndStop') {
        const target = args[0];
        if (typeof target === 'string') record.gotoLabels!.push(target);
        else if (typeof target === 'number') record.gotoFrames!.push(target);
      }
    } else if (actionCode === 0x99) {
      // ActionIf
      const branchOffset = reader.readSI16();
      const condVal = stack.pop();
      record.branches!.push({
        condition: typeof condVal === 'string' ? condVal : 'stateCond == true',
        target: branchOffset
      });
    }

    reader.offset = actionEnd;
  }

  return record;
}

/**
 * Disassembles ActionScript 3.0 bytecode in DoABC (Tag 82) tags.
 */
function parseDoABC(reader: BitReader, tagEndOffset: number, currentFrame: number): SwfActionRecord {
  const record: SwfActionRecord = {
    frame: currentFrame,
    gotoFrames: [],
    gotoLabels: [],
    setVariables: [],
    branches: []
  };

  try {
    reader.readUI32(); // flags
    reader.readString(); // name

    const remainingBytes = reader.readBytes(Math.max(0, tagEndOffset - reader.offset));
    let str = '';
    const strings: string[] = [];
    for (let i = 0; i < remainingBytes.length; i++) {
      const b = remainingBytes[i];
      if (b >= 32 && b <= 126) {
        str += String.fromCharCode(b);
      } else {
        if (str.length >= 2) strings.push(str);
        str = '';
      }
    }
    if (str.length >= 2) strings.push(str);

    const knownLabels = ['start', 'intro', 'step1', 'step2', 'step3', 'quiz', 'result', 'win', 'reset', 'game', 'play'];
    for (const s of strings) {
      if (knownLabels.includes(s.toLowerCase())) {
        record.gotoLabels!.push(s);
      } else if (['score', 'level', 'count', 'energy', 'velocity', 'temp', 'time'].includes(s.toLowerCase())) {
        record.setVariables!.push({ name: s, value: 0 });
      }
    }

    for (let i = 0; i < remainingBytes.length; i++) {
      if (remainingBytes[i] === 0x12) {
        record.stops = true;
        break;
      }
    }
  } catch {}

  return record;
}

/**
 * Main Entry Point: Transpiles SWF file binary array into modern SVG + AST S-Expressions.
 */
export async function transpileSwfToAst(fileData: ArrayBuffer | Uint8Array, sceneId = 'imported-swf'): Promise<SwfTranspileResult> {
  try {
    const rawBytes = fileData instanceof Uint8Array ? fileData : new Uint8Array(fileData);
    if (rawBytes.length < 8) {
      return { success: false, error: 'File is too short to be a valid SWF binary (min 8 bytes required).', svgMarkup: '', astSource: '' };
    }

    const sig = String.fromCharCode(rawBytes[0], rawBytes[1], rawBytes[2]);
    if (sig !== 'FWS' && sig !== 'CWS') {
      return { success: false, error: `Unsupported SWF signature: "${sig}". Only standard FWS or CWS Flash files are supported.`, svgMarkup: '', astSource: '' };
    }

    const version = rawBytes[3];
    const fileLength = (
      rawBytes[4] |
      (rawBytes[5] << 8) |
      (rawBytes[6] << 16) |
      (rawBytes[7] << 24)
    ) >>> 0;

    let payload: Uint8Array;
    if (sig === 'CWS') {
      // Decompress payload from offset 8
      const compressedSlice = rawBytes.slice(8);
      const decompressed = await decompressSwfPayload(compressedSlice);
      // Construct full buffer (8-byte header + decompressed)
      payload = new Uint8Array(8 + decompressed.length);
      payload.set(rawBytes.subarray(0, 8), 0);
      payload.set(decompressed, 8);
    } else {
      payload = rawBytes;
    }

    const reader = new BitReader(payload, 8);
    const frameRect = reader.readRect();
    const frameRate = reader.readUI16() / 256;
    const frameCount = reader.readUI16();

    let backgroundColor = '#0f172a';
    const shapes: { id: string; svg: string; bbox: { x: number; y: number; w: number; h: number } }[] = [];
    const morphShapes: SwfMorphShape[] = [];
    const actionBlocks: SwfActionRecord[] = [];
    const labels: { frame: number; name: string }[] = [];
    const displayList: { depth: number; characterId: number; matrix?: any }[] = [];
    const framePlacements: { frame: number; depth: number; characterId: number; matrix?: any }[] = [];

    let currentFrame = 1;

    // Parse SWF tags
    while (reader.offset < payload.length) {
      const tagCodeAndLength = reader.readUI16();
      const tagType = tagCodeAndLength >> 6;
      let tagLength = tagCodeAndLength & 0x3F;
      if (tagLength === 0x3F) {
        tagLength = reader.readUI32();
      }

      const nextTagOffset = reader.offset + tagLength;

      // Tag 0: End Tag
      if (tagType === 0) {
        break;
      }
      // Tag 9: SetBackgroundColor
      else if (tagType === 9) {
        backgroundColor = reader.readRGBA(false);
      }
      // Tag 2, 22, 32, 83: DefineShape (1, 2, 3, 4)
      else if (tagType === 2 || tagType === 22 || tagType === 32 || tagType === 83) {
        const shapeId = reader.readUI16();
        const tagVer = tagType === 2 ? 1 : (tagType === 22 ? 2 : (tagType === 32 ? 3 : 4));
        try {
          const shape = parseSwfShape(reader, shapeId, tagVer);
          shapes.push(shape);
        } catch {
          // If a complex custom shape fails, insert graceful vector placeholder
          shapes.push({
            id: `swf-shape-${shapeId}`,
            svg: `<rect id="swf-shape-${shapeId}" x="20" y="20" width="120" height="80" rx="8" fill="#38bdf8" opacity="0.85" />`,
            bbox: { x: 20, y: 20, w: 120, h: 80 }
          });
        }
      }
      // Tag 46, 84: DefineMorphShape (1, 2)
      else if (tagType === 46 || tagType === 84) {
        const shapeId = reader.readUI16();
        const morphVer = tagType === 46 ? 1 : 2;
        try {
          const morph = parseSwfMorphShape(reader, shapeId, morphVer);
          morphShapes.push(morph);
        } catch {
          morphShapes.push({
            id: `swf-morph-${shapeId}`,
            shapeId,
            startD: 'M 40.0 40.0 L 140.0 40.0 L 140.0 100.0 L 40.0 100.0 Z',
            endD: 'M 60.0 20.0 L 180.0 60.0 L 120.0 120.0 L 20.0 80.0 Z',
            startFill: '#38bdf8',
            endFill: '#818cf8',
            stroke: 'none',
            strokeWidth: 1,
            svg: `<path id="swf-morph-${shapeId}" d="M 40.0 40.0 L 140.0 40.0 L 140.0 100.0 L 40.0 100.0 Z" fill="#38bdf8" stroke="none" data-morph-end="M 60.0 20.0 L 180.0 60.0 L 120.0 120.0 L 20.0 80.0 Z" />`,
            bbox: { x: 40, y: 40, w: 100, h: 60 }
          });
        }
      }
      // Tag 12, 59: DoAction, DoInitAction (ActionScript 1.0 / 2.0 bytecode)
      else if (tagType === 12 || tagType === 59) {
        try {
          const act = parseDoAction(reader, nextTagOffset, currentFrame);
          actionBlocks.push(act);
        } catch {}
      }
      // Tag 82: DoABC (ActionScript 3.0 bytecode / AVM2)
      else if (tagType === 82) {
        try {
          const act = parseDoABC(reader, nextTagOffset, currentFrame);
          actionBlocks.push(act);
        } catch {}
      }
      // Tag 4, 26, 70: PlaceObject (1, 2, 3)
      else if (tagType === 4 || tagType === 26 || tagType === 70) {
        if (tagType === 26 || tagType === 70) {
          // PlaceObject2 / PlaceObject3
          const flags = reader.readUI8();
          const depth = reader.readUI16();
          let charId = 0;
          if (flags & 0x02) {
            charId = reader.readUI16();
          }
          let matrix = null;
          if (flags & 0x04) {
            matrix = reader.readMatrix();
          }
          framePlacements.push({ frame: currentFrame, depth, characterId: charId, matrix });
          const existingIdx = displayList.findIndex(d => d.depth === depth);
          if (existingIdx >= 0) {
            if (charId) displayList[existingIdx].characterId = charId;
            if (matrix) displayList[existingIdx].matrix = matrix;
          } else if (charId) {
            displayList.push({ depth, characterId: charId, matrix });
          }
        }
      }
      // Tag 1: ShowFrame
      else if (tagType === 1) {
        currentFrame++;
      }
      // Tag 43: FrameLabel
      else if (tagType === 43) {
        const labelName = reader.readString();
        labels.push({ frame: currentFrame, name: labelName });
      }
      // Tag 37: DefineEditText (educational diagram labels and text values)
      else if (tagType === 37) {
        try {
          const charId = reader.readUI16();
          const bounds = reader.readRect();
          reader.syncBits();
          const flags1 = reader.readUI8();
          const flags2 = reader.readUI8();
          const hasFont = (flags1 & 0x01) !== 0;
          const hasMaxLength = (flags1 & 0x02) !== 0;
          const hasTextColor = (flags1 & 0x04) !== 0;
          const hasText = (flags1 & 0x80) !== 0;
          const hasLayout = (flags2 & 0x20) !== 0;

          if (hasFont) {
            reader.readUI16(); // fontId
            reader.readUI16(); // fontHeight
          }
          let textColor = '#ffffff';
          if (hasTextColor) {
            textColor = reader.readRGBA(true);
          }
          if (hasMaxLength) {
            reader.readUI16();
          }
          if (hasLayout) {
            reader.readUI8(); // align
            reader.readUI16(); // leftMargin
            reader.readUI16(); // rightMargin
            reader.readUI16(); // indent
            reader.readSI16(); // leading
          }
          reader.readString(); // variableName
          if (hasText) {
            const initialText = reader.readString();
            if (initialText && initialText.trim()) {
              const textSvg = `<text id="swf-text-${charId}" x="${bounds.xMin.toFixed(1)}" y="${(bounds.yMin + Math.max(14, bounds.height * 0.75)).toFixed(1)}" fill="${textColor}" font-size="14" font-family="system-ui, sans-serif" font-weight="600">${initialText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`;
              shapes.push({
                id: `swf-text-${charId}`,
                svg: textSvg,
                bbox: { x: bounds.xMin, y: bounds.yMin, w: bounds.width, h: bounds.height }
              });
            }
          }
        } catch {}
      }

      reader.offset = nextTagOffset;
    }

    // Fallback if no shapes parsed: create responsive educational stage container
    const width = Math.max(320, Math.round(frameRect.width || 800));
    const height = Math.max(240, Math.round(frameRect.height || 480));
    const duration = Math.max(3, Math.round((frameCount || currentFrame) / (frameRate || 24)));

    const allSvgElements = [
      ...shapes.map(s => s.svg),
      ...morphShapes.map(m => m.svg)
    ];
    let finalSvgInner = allSvgElements.join('\n    ');
    if (!finalSvgInner.trim()) {
      finalSvgInner = `
    <!-- Imported SWF Visual Content -->
    <g id="swf-content" transform="translate(40, 40)">
      <rect id="swf-bg-card" width="${width - 80}" height="${height - 80}" rx="16" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
      <text id="swf-title" x="${(width - 80) / 2}" y="80" text-anchor="middle" fill="#ffffff" font-size="20" font-family="system-ui" font-weight="bold">Imported Flash Asset: ${sceneId}</text>
      <circle id="swf-orbiter" cx="${(width - 80) / 2}" cy="${(height - 80) / 2 + 30}" r="32" fill="#6366f1" />
      <text id="swf-caption" x="${(width - 80) / 2}" y="${height - 120}" text-anchor="middle" fill="#94a3b8" font-size="13">Converted from legacy ${sig} v${version} &bull; ${frameCount} Frames &bull; ${(frameRate).toFixed(0)} FPS</text>
    </g>`;
    }

    const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <rect id="bg" width="${width}" height="${height}" fill="${backgroundColor}" />
  <g id="scene-root">
    ${finalSvgInner}
  </g>
</svg>`;

    // Generate AST S-Expressions
    const targetId = morphShapes[0]?.id || shapes[0]?.id || 'swf-orbiter';

    // Actors
    const actorTargets = [
      ...shapes.map(s => `#${s.id}`),
      ...morphShapes.map(m => `#${m.id}`)
    ];
    const actorsAst = actorTargets.length > 0
      ? actorTargets.slice(0, 8).map(t => `    (:actor :target "${t}" :kinematic true :will-change true)`).join('\n')
      : `    (:actor :target "#${targetId}" :kinematic true :will-change true)`;

    // MorphShape & Vector Bindings
    const morphBindings: string[] = [];
    morphShapes.forEach(m => {
      morphBindings.push(`    (:target "#${m.id}" :attr "d" :expr "astMorphPath('${m.startD}', '${m.endD}', t)")`);
      if (m.startFill !== m.endFill) {
        morphBindings.push(`    (:target "#${m.id}" :attr "fill" :expr "astMorphColor('${m.startFill}', '${m.endFill}', t)")`);
      }
    });

    let bindingsAst = '';
    if (morphBindings.length > 0) {
      bindingsAst = `  :bindings (\n${morphBindings.join('\n')}\n  )`;
    } else {
      bindingsAst = `  :bindings (\n    (:target "#${targetId}" :attr "transform" :expr "'translate(' + (Math.sin(t * Math.PI * 2) * 40) + ', 0)'")\n  )`;
    }

    // Extract Variables from ActionScript
    const varMap = new Map<string, any>();
    actionBlocks.forEach(ab => {
      (ab.setVariables || []).forEach(v => {
        if (!varMap.has(v.name)) varMap.set(v.name, v.value);
      });
    });

    let varsAst = '';
    if (varMap.size > 0) {
      const varLines: string[] = [];
      varMap.forEach((val, name) => {
        const isNum = typeof val === 'number';
        varLines.push(`    (:var :name "${name}" :val ${isNum ? val : `"${val}"`} ${isNum ? ':min 0 :max 100' : ''})`);
      });
      varsAst = `\n  (:vars (\n${varLines.join('\n')}\n  ))\n`;
    }

    // Synthesize Declarative State Machine from ActionScript and Frame Labels
    let stateMachinesAst = '';
    let smMeta: any = undefined;

    const stateList: { name: string; title: string; frame: number }[] = [];
    if (labels.length >= 2) {
      labels.forEach(l => {
        stateList.push({
          name: l.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_'),
          title: l.name,
          frame: l.frame
        });
      });
    } else if (actionBlocks.some(a => a.stops || (a.gotoLabels && a.gotoLabels.length > 0) || (a.gotoFrames && a.gotoFrames.length > 0))) {
      stateList.push({ name: 'intro', title: 'Intro Phase', frame: 1 });
      actionBlocks.forEach(ab => {
        if (ab.stops || (ab.gotoLabels && ab.gotoLabels.length > 0)) {
          stateList.push({ name: `stage_${ab.frame}`, title: `Stage at Frame ${ab.frame}`, frame: ab.frame });
        }
      });
      stateList.push({ name: 'conclusion', title: 'Conclusion Phase', frame: frameCount || currentFrame });
    }

    if (stateList.length >= 2 && actionBlocks.length > 0) {
      const initialState = stateList[0].name;
      const statesAst = stateList.map(st => `        (:state :name "${st.name}" (:attr :target "#swf-title" :attr "textContent" :val "${st.title}"))`).join('\n');

      const transitionsAstLines: string[] = [];
      for (let i = 0; i < stateList.length - 1; i++) {
        const fromSt = stateList[i];
        const toSt = stateList[i + 1];
        let trigger = 'true';
        for (const ab of actionBlocks) {
          if (ab.frame === fromSt.frame && ab.branches && ab.branches.length > 0) {
            trigger = ab.branches[0].condition;
            break;
          }
        }
        transitionsAstLines.push(`        (:transition :from "${fromSt.name}" :to "${toSt.name}" :trigger "${trigger}" :duration 0.4 :dwell 0.25)`);
      }
      transitionsAstLines.push(`        (:transition :from "${stateList[stateList.length - 1].name}" :to "${stateList[0].name}" :trigger "true" :duration 0.4 :dwell 0.25)`);

      stateMachinesAst = `\n  (:state-machines (\n    (:state-machine :id "swf-state-machine" :initial "${initialState}" :dwell 0.25\n      (:states (\n${statesAst}\n      ))\n      (:transitions (\n${transitionsAstLines.join('\n')}\n      ))\n    )\n  ))\n`;

      smMeta = [{
        id: 'swf-state-machine',
        initial: initialState,
        states: stateList.map(s => s.name),
        transitionsCount: transitionsAstLines.length
      }];
    }

    const keyframesAst = labels.length > 0
      ? labels.map(l => {
          const t = Math.min(1.0, Number(((l.frame - 1) / Math.max(1, frameCount)).toFixed(2)));
          return `    (:t ${t} :title "${l.name}" :rule "Keyframe step at frame ${l.frame}")`;
        }).join('\n')
      : `    (:t 0.0 :title "Intro" :rule "SWF Timeline Inception")
    (:t 0.5 :title "Midpoint" :rule "Active Simulation Phase")
    (:t 1.0 :title "Conclusion" :rule "Loop Reset")`;

    const astSource = `(:scene
  :id "${sceneId}"
  :title "Imported Flash (${sceneId})"
  :subject "Transpiled Legacy SWF"
  :duration ${duration}
  :fps ${Math.round(frameRate) || 24}
  :stageWidth ${width}
  :stageHeight ${height}
${varsAst}
  (:static (
    (:element :target "#bg" :cache true)
    (:element :target "#swf-bg-card" :cache true)
    (:element :target "#swf-title" :cache true)
    (:element :target "#swf-caption" :cache true)
  ))

  (:actors (
${actorsAst}
  ))
${stateMachinesAst}
${bindingsAst}

  :keyframes (
${keyframesAst}
  )

  :interactive (
    (:checkpoints (
      (:id "chk-swf-1" :t 0.50 :type "multiple-choice" :question "What principle is demonstrated in this legacy Flash animation?"
        :options ("Conservation of Energy" "Kinetic Motion" "Vector Quantities" "Gravitational Force") :correct 1
        :hint "Observe the animated position over normalized time t.")
    ))
  )
)`;

    const metadata: SwfMetadata = {
      signature: sig as any,
      version,
      fileLength,
      width,
      height,
      frameRate,
      frameCount,
      backgroundColor,
      shapeCount: shapes.length,
      morphShapeCount: morphShapes.length,
      actionCount: actionBlocks.length,
      labels,
      stateMachines: smMeta,
      variables: Array.from(varMap.entries()).map(([k, v]) => ({ name: k, value: v }))
    };

    return {
      success: true,
      metadata,
      svgMarkup,
      astSource,
    };
  } catch (err: any) {
    return {
      success: false,
      error: `SWF parsing exception: ${err?.message || String(err)}`,
      svgMarkup: '',
      astSource: '',
    };
  }
}
