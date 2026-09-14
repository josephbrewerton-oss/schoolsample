/**
 * src/utils/cryptoVault.ts
 *
 * Zero-Cloud, Hardware-Accelerated Local Cryptography Engine.
 * Uses the browser/Node W3C Web Crypto API (crypto.subtle).
 *
 * Capabilities:
 *  - 100% on-device (Zero network requests, zero cloud keys)
 *  - AES-256-GCM symmetric encryption & decryption
 *  - PBKDF2 key derivation from a passphrase or school token (100,000 iterations of SHA-256)
 *  - Cryptographic integrity hashing (SHA-256)
 */

export interface EncryptedPayload {
  version: number;
  algorithm: 'AES-GCM-256';
  iv: string;   // Base64-encoded 12-byte initialization vector
  salt: string; // Base64-encoded 16-byte salt for PBKDF2
  data: string; // Base64-encoded ciphertext
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to Uint8Array
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives an AES-256-GCM CryptoKey from a user passphrase or school token.
 */
async function deriveKeyFromPassphrase(
  passphrase: string,
  salt: Uint8Array,
  usage: KeyUsage[]
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    usage
  );
}

/**
 * Encrypts any string or JSON payload on-device using a local passphrase.
 * No external API or cloud service is contacted.
 */
export async function encryptLocalData(
  plainText: string,
  passphrase: string
): Promise<EncryptedPayload> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKeyFromPassphrase(passphrase, salt, ['encrypt']);

  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    enc.encode(plainText)
  );

  return {
    version: 1,
    algorithm: 'AES-GCM-256',
    iv: arrayBufferToBase64(iv.buffer),
    salt: arrayBufferToBase64(salt.buffer),
    data: arrayBufferToBase64(encryptedBuffer),
  };
}

/**
 * Decrypts an EncryptedPayload on-device in memory.
 */
export async function decryptLocalData(
  payload: EncryptedPayload,
  passphrase: string
): Promise<string> {
  const salt = base64ToUint8Array(payload.salt);
  const iv = base64ToUint8Array(payload.iv);
  const cipherBytes = base64ToUint8Array(payload.data);

  const key = await deriveKeyFromPassphrase(passphrase, salt, ['decrypt']);

  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv as BufferSource,
    },
    key,
    cipherBytes as BufferSource
  );

  const dec = new TextDecoder();
  return dec.decode(decryptedBuffer);
}

/**
 * Computes a SHA-256 cryptographic digest of any text or manifest.
 */
export async function computeSha256(text: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(text));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
