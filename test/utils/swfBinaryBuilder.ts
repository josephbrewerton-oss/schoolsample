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
  DEFINE_SHAPE2: 22,
  DEFINE_SHAPE3: 32,
  FRAME_LABEL: 43,
  DEFINE_SHAPE4: 83,
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
