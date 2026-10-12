import crypto from 'crypto';

// AES-256-GCM: authenticated encryption (confidentiality + tamper detection).
// Key must be a 32-byte value, base64-encoded, held in ENCRYPTION_KEY.
const ALGORITHM = 'aes-256-gcm';

const CURRENT_VERSION = 1;

// v1 -> ENCRYPTION_KEY. Future versions -> ENCRYPTION_KEY_V<n> (or a KMS-unwrapped data key).
function getKey(version: number = CURRENT_VERSION): Buffer {
  const envName = version === 1 ? 'ENCRYPTION_KEY' : `ENCRYPTION_KEY_V${version}`;
  const raw = process.env[envName];
  if (!raw) throw new Error(`${envName} is not set`);
  const key = Buffer.from(raw, 'base64');
  if (key.length !== 32) throw new Error('ENCRYPTION_KEY must decode to exactly 32 bytes');
  return key;
}

// Output format: v<n>:base64(iv):base64(authTag):base64(ciphertext)
export function encryptField(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12); // 96-bit IV is the GCM standard
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `v${CURRENT_VERSION}:${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted.toString('base64')}`;
}

export function decryptField(payload: string): string {
  let parts = payload.split(':');
  let version = 1; // legacy 3-part payloads are v1
  if (parts.length === 4 && /^v\d+$/.test(parts[0])) {
    version = parseInt(parts[0].slice(1), 10);
    parts = parts.slice(1);
  }
  const [ivB64, tagB64, dataB64] = parts;
  if (parts.length !== 3 || !ivB64 || !tagB64 || !dataB64) throw new Error('Malformed encrypted payload');
  const key = getKey(version);
  const iv = Buffer.from(ivB64, 'base64');
  const authTag = Buffer.from(tagB64, 'base64');
  const data = Buffer.from(dataB64, 'base64');
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
}

// Detects our own format so callers can distinguish already-encrypted values
// from legacy plaintext during migration.
export function isEncryptedPayload(value: string | null | undefined): boolean {
  if (!value) return false;
  let parts = value.split(':');
  if (parts.length === 4 && /^v\d+$/.test(parts[0])) parts = parts.slice(1);
  return parts.length === 3 && parts.every(p => /^[A-Za-z0-9+/]+=*$/.test(p));
}
