// test/utils/swfBinaryBuilder.ts
/**
 * Test Utility: In-Memory Binary SWF & Bitstream Builders
 * Provides byte-level and bit-level serialization primitives (BitWriter,
 * TWIPS rects, FWS/CWS header assembly, straight & curved shape records).
 */

import * as zlib from 'node:zlib';

export const SwfTagCode = {
  END: 0,
  SHOW_FRAME: 1,
  DEFINE_SHAPE: 2,
  SET_BACKGROUND_COLOR: 9,
  DO_ACTION: 12,
  DEFINE_SHAPE2: 22,
  DEFINE_SHAPE3: 32,
  FRAME_LABEL: 43,
  DEFINE_MORPH_SHAPE: 46,
  DO_ABC: 82,
  DEFINE_SHAPE4: 83,
  DEFINE_MORPH_SHAPE2: 84,
} as const;

/**
 * BitWriter helper to construct valid binary SWF payloads in memory.
 */
export class BitWriter {
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
export function assembleFwsSwf(
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
export function assembleCwsSwf(
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
export function writeTag(writer: BitWriter, tagType: number, tagData: Uint8Array): void {
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
export function buildRectShapeTag(
  shapeId: number,
  x: number,
  y: number,
  w: number,
  h: number,
  fillColor = [56, 189, 248, 255],
  tagVersion = 2
): Uint8Array {
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
export function buildCurvedShapeTag(shapeId: number): Uint8Array {
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

/**
 * Helper to construct a DefineMorphShape (Tag 46 or Tag 84) with start and end edge records
 */
export function buildMorphShapeTag(
  shapeId: number,
  startX: number,
  startY: number,
  startW: number,
  startH: number,
  endX: number,
  endY: number,
  endW: number,
  endH: number,
  startFill = [56, 189, 248, 255],
  endFill = [129, 140, 248, 255],
  tagVersion = 46
): Uint8Array {
  const wtr = new BitWriter();
  wtr.writeUI16(shapeId);
  // StartBounds
  wtr.writeRect(startX * 20, (startX + startW) * 20, startY * 20, (startY + startH) * 20);
  // EndBounds
  wtr.writeRect(endX * 20, (endX + endW) * 20, endY * 20, (endY + endH) * 20);

  if (tagVersion === 84) {
    // DefineMorphShape2
    wtr.writeRect(startX * 20, (startX + startW) * 20, startY * 20, (startY + startH) * 20);
    wtr.writeRect(endX * 20, (endX + endW) * 20, endY * 20, (endY + endH) * 20);
    wtr.writeUI8(0); // Flags
  }

  // Pre-generate StartEdges and EndEdges in separate writers so we know the offset!
  const startEdgesWtr = new BitWriter();
  startEdgesWtr.writeUBits(1, 4);
  startEdgesWtr.writeUBits(1, 4);
  // MoveTo (startX, startY)
  startEdgesWtr.writeUBits(0, 1);
  startEdgesWtr.writeUBits(0x01 | 0x02 | 0x08, 5);
  startEdgesWtr.writeUBits(14, 5);
  startEdgesWtr.writeSBits(startX * 20, 14);
  startEdgesWtr.writeSBits(startY * 20, 14);
  startEdgesWtr.writeUBits(1, 1);
  startEdgesWtr.writeUBits(1, 1);
  // 4 Straight edges (start rect)
  const edgeBits = 14;
  startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeUBits(edgeBits - 2, 4);
  startEdgesWtr.writeUBits(0, 1); startEdgesWtr.writeUBits(0, 1); startEdgesWtr.writeSBits(startW * 20, edgeBits);
  startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeUBits(edgeBits - 2, 4);
  startEdgesWtr.writeUBits(0, 1); startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeSBits(startH * 20, edgeBits);
  startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeUBits(edgeBits - 2, 4);
  startEdgesWtr.writeUBits(0, 1); startEdgesWtr.writeUBits(0, 1); startEdgesWtr.writeSBits(-startW * 20, edgeBits);
  startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeUBits(edgeBits - 2, 4);
  startEdgesWtr.writeUBits(0, 1); startEdgesWtr.writeUBits(1, 1); startEdgesWtr.writeSBits(-startH * 20, edgeBits);
  startEdgesWtr.writeUBits(0, 1); startEdgesWtr.writeUBits(0, 5);
  const startEdgesBytes = startEdgesWtr.toByteArray();

  const endEdgesWtr = new BitWriter();
  endEdgesWtr.writeUBits(1, 4);
  endEdgesWtr.writeUBits(1, 4);
  // MoveTo (endX, endY)
  endEdgesWtr.writeUBits(0, 1);
  endEdgesWtr.writeUBits(0x01 | 0x02 | 0x08, 5);
  endEdgesWtr.writeUBits(14, 5);
  endEdgesWtr.writeSBits(endX * 20, 14);
  endEdgesWtr.writeSBits(endY * 20, 14);
  endEdgesWtr.writeUBits(1, 1);
  endEdgesWtr.writeUBits(1, 1);
  // 4 Straight edges (end rect)
  endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeUBits(edgeBits - 2, 4);
  endEdgesWtr.writeUBits(0, 1); endEdgesWtr.writeUBits(0, 1); endEdgesWtr.writeSBits(endW * 20, edgeBits);
  endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeUBits(edgeBits - 2, 4);
  endEdgesWtr.writeUBits(0, 1); endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeSBits(endH * 20, edgeBits);
  endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeUBits(edgeBits - 2, 4);
  endEdgesWtr.writeUBits(0, 1); endEdgesWtr.writeUBits(0, 1); endEdgesWtr.writeSBits(-endW * 20, edgeBits);
  endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeUBits(edgeBits - 2, 4);
  endEdgesWtr.writeUBits(0, 1); endEdgesWtr.writeUBits(1, 1); endEdgesWtr.writeSBits(-endH * 20, edgeBits);
  endEdgesWtr.writeUBits(0, 1); endEdgesWtr.writeUBits(0, 5);
  const endEdgesBytes = endEdgesWtr.toByteArray();

  // MorphOffset is the length of StartEdges in bytes
  wtr.writeUI32(startEdgesBytes.length);

  // MorphFillStyles: 1 solid color
  wtr.writeUI8(1);
  wtr.writeUI8(0); // solid
  wtr.writeUI8(startFill[0]); wtr.writeUI8(startFill[1]); wtr.writeUI8(startFill[2]); wtr.writeUI8(startFill[3]);
  wtr.writeUI8(endFill[0]); wtr.writeUI8(endFill[1]); wtr.writeUI8(endFill[2]); wtr.writeUI8(endFill[3]);

  // MorphLineStyles: 1 line style
  wtr.writeUI8(1);
  wtr.writeUI16(2 * 20); // startWidth 2px
  wtr.writeUI16(4 * 20); // endWidth 4px
  if (tagVersion === 84) {
    wtr.writeUI16(0); // flags
  }
  wtr.writeUI8(255); wtr.writeUI8(255); wtr.writeUI8(255); wtr.writeUI8(255);
  wtr.writeUI8(200); wtr.writeUI8(200); wtr.writeUI8(255); wtr.writeUI8(255);

  const headerBytes = wtr.toByteArray();
  const total = new Uint8Array(headerBytes.length + startEdgesBytes.length + endEdgesBytes.length);
  total.set(headerBytes, 0);
  total.set(startEdgesBytes, headerBytes.length);
  total.set(endEdgesBytes, headerBytes.length + startEdgesBytes.length);

  return total;
}

/**
 * Helper to construct an ActionScript 1/2 DoAction (Tag 12) binary payload
 */
export function buildDoActionTag(actions: {
  stop?: boolean;
  gotoFrame?: number;
  gotoLabel?: string;
  setVariable?: { name: string; value: any };
}): Uint8Array {
  const wtr = new BitWriter();

  if (actions.setVariable) {
    // ActionPush varName, varValue
    const pushWtr = new BitWriter();
    pushWtr.writeUI8(0); // type string
    pushWtr.writeString(actions.setVariable.name);

    if (typeof actions.setVariable.value === 'number') {
      pushWtr.writeUI8(7); // integer
      pushWtr.writeUI32(actions.setVariable.value);
    } else {
      pushWtr.writeUI8(0); // string
      pushWtr.writeString(String(actions.setVariable.value));
    }
    const pushBytes = pushWtr.toByteArray();
    wtr.writeUI8(0x96); // ActionPush
    wtr.writeUI16(pushBytes.length);
    for (let i = 0; i < pushBytes.length; i++) wtr.writeUI8(pushBytes[i]);

    // ActionSetVariable (0x1D)
    wtr.writeUI8(0x1D);
  }

  if (actions.gotoFrame !== undefined) {
    wtr.writeUI8(0x81); // ActionGotoFrame
    wtr.writeUI16(2); // length
    wtr.writeUI16(actions.gotoFrame - 1); // 0-based
  }

  if (actions.gotoLabel !== undefined) {
    const lblBytes: number[] = [];
    for (let i = 0; i < actions.gotoLabel.length; i++) lblBytes.push(actions.gotoLabel.charCodeAt(i));
    lblBytes.push(0);
    wtr.writeUI8(0x9F); // ActionGotoLabel
    wtr.writeUI16(lblBytes.length);
    for (let i = 0; i < lblBytes.length; i++) wtr.writeUI8(lblBytes[i]);
  }

  if (actions.stop) {
    wtr.writeUI8(0x07); // ActionStop
  }

  wtr.writeUI8(0x00); // ActionEnd
  return wtr.toByteArray();
}
