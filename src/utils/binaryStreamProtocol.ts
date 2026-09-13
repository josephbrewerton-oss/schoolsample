// src/utils/binaryStreamProtocol.ts
/**
 * Binary Stream Protocol for WebRTC RTCDataChannel Loopback & Zero-Copy ArrayBuffer Transfers.
 * 
 * Minimizes garbage collection churn during heavy token synthesis and AST node compilation.
 * 
 * Frame Layout (16-byte fixed header + variable UTF-8 payload):
 * [0..1] Magic Bytes: 0x53, 0x4A ('SJ' - St Joseph's Supervised AST Protocol)
 * [2]    Protocol Version: 0x02
 * [3]    Opcode (e.g. OP_TOKEN_CHUNK = 0x01, OP_AST_NODE_COMPLETE = 0x03, OP_STREAM_EOF = 0x0F)
 * [4..5] Flags: bit 0: isFinal, bit 1: isGoverned, bit 2: isJson
 * [6..9] Stream ID / Request Hash (Uint32)
 * [10..11] Reserved (0x0000)
 * [12..15] Payload byte length (Uint32)
 * [16..N] UTF-8 Payload bytes
 */

export const PROTOCOL_MAGIC_0 = 0x53; // 'S'
export const PROTOCOL_MAGIC_1 = 0x4a; // 'J'
export const PROTOCOL_VERSION = 0x02;

export const OP_TOKEN_CHUNK = 0x01;
export const OP_AST_NODE_CHUNK = 0x02;
export const OP_AST_NODE_COMPLETE = 0x03;
export const OP_HEARTBEAT_PING = 0x04;
export const OP_HEARTBEAT_PONG = 0x05;
export const OP_STATUS = 0x06;
export const OP_ERROR = 0x07;
export const OP_STREAM_EOF = 0x0f;

export const FLAG_IS_FINAL = 0x0001;
export const FLAG_IS_GOVERNED = 0x0002;
export const FLAG_IS_JSON = 0x0004;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8', { fatal: false });

export interface DecodedBinaryFrame {
  opcode: number;
  flags: number;
  streamId: number;
  isFinal: boolean;
  isGoverned: boolean;
  isJson: boolean;
  payloadBytes: Uint8Array;
  payloadText: string;
}

/**
 * Checks if a given incoming message data is an ArrayBuffer with the protocol magic header.
 */
export function isBinaryFrame(data: unknown): data is ArrayBuffer {
  if (!(data instanceof ArrayBuffer)) return false;
  if (data.byteLength < 16) return false;
  const view = new DataView(data);
  return view.getUint8(0) === PROTOCOL_MAGIC_0 && view.getUint8(1) === PROTOCOL_MAGIC_1;
}

/**
 * Encodes payload into a transferable ArrayBuffer binary frame.
 */
export function encodeBinaryFrame(
  opcode: number,
  payload: string | Uint8Array = '',
  streamId: number = 0,
  flags: number = 0
): ArrayBuffer {
  const payloadBytes = typeof payload === 'string' ? textEncoder.encode(payload) : payload;
  const totalLength = 16 + payloadBytes.byteLength;
  const buffer = new ArrayBuffer(totalLength);
  const view = new DataView(buffer);
  const uint8 = new Uint8Array(buffer);

  view.setUint8(0, PROTOCOL_MAGIC_0);
  view.setUint8(1, PROTOCOL_MAGIC_1);
  view.setUint8(2, PROTOCOL_VERSION);
  view.setUint8(3, opcode);
  view.setUint16(4, flags, false); // Big-endian
  view.setUint32(6, streamId >>> 0, false);
  view.setUint16(10, 0, false);
  view.setUint32(12, payloadBytes.byteLength, false);

  uint8.set(payloadBytes, 16);
  return buffer;
}

/**
 * Decodes an ArrayBuffer binary frame with zero-copy subarray views.
 */
export function decodeBinaryFrame(buffer: ArrayBuffer): DecodedBinaryFrame | null {
  if (!isBinaryFrame(buffer)) return null;

  const view = new DataView(buffer);
  const opcode = view.getUint8(3);
  const flags = view.getUint16(4, false);
  const streamId = view.getUint32(6, false);
  const payloadLength = view.getUint32(12, false);

  const safeLen = Math.min(payloadLength, buffer.byteLength - 16);
  const payloadBytes = new Uint8Array(buffer, 16, safeLen);
  const payloadText = textDecoder.decode(payloadBytes);

  return {
    opcode,
    flags,
    streamId,
    isFinal: Boolean(flags & FLAG_IS_FINAL),
    isGoverned: Boolean(flags & FLAG_IS_GOVERNED),
    isJson: Boolean(flags & FLAG_IS_JSON),
    payloadBytes,
    payloadText,
  };
}

/**
 * Convenience helper to create a zero-copy token chunk frame.
 */
export function createTokenChunkFrame(token: string, streamId: number = 0, isFinal: boolean = false): ArrayBuffer {
  const flags = isFinal ? FLAG_IS_FINAL : 0;
  return encodeBinaryFrame(OP_TOKEN_CHUNK, token, streamId, flags);
}

/**
 * Convenience helper to create a zero-copy AST complete node frame.
 */
export function createAstNodeFrame(
  rawAst: string,
  streamId: number = 0,
  isGoverned: boolean = false,
  metadata?: Record<string, any>
): ArrayBuffer {
  let flags = FLAG_IS_FINAL | (isGoverned ? FLAG_IS_GOVERNED : 0);
  let payload = rawAst;

  if (metadata) {
    flags |= FLAG_IS_JSON;
    payload = JSON.stringify({ ...metadata, raw: rawAst });
  }

  return encodeBinaryFrame(OP_AST_NODE_COMPLETE, payload, streamId, flags);
}

/**
 * Convenience helper to create a zero-copy EOF frame.
 */
export function createEofFrame(streamId: number = 0): ArrayBuffer {
  return encodeBinaryFrame(OP_STREAM_EOF, '', streamId, FLAG_IS_FINAL);
}
