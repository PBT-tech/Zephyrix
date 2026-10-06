import crypto from 'crypto';

// AES-256 GCM Encryption/Decryption
// Uses ENCRYPTION_KEY from environment variables

const ALGORITHM = 'aes-256-gcm';
const ENCODING = 'hex';
const IV_LENGTH = 16; // 128 bits

/**
 * Encrypt sensitive data with AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @returns {string} Encrypted data (iv:authTag:encrypted format)
 */
export function encryptData(plaintext) {
  if (!plaintext) return null;

  const key = Buffer.from(process.env.ENCRYPTION_KEY, ENCODING);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', ENCODING);
  encrypted += cipher.final(ENCODING);

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString(ENCODING)}:${authTag.toString(ENCODING)}:${encrypted}`;
}

/**
 * Decrypt AES-256-GCM encrypted data
 * @param {string} encryptedData - Encrypted data (iv:authTag:encrypted format)
 * @returns {string} Decrypted plaintext
 */
export function decryptData(encryptedData) {
  if (!encryptedData) return null;

  try {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, ENCODING);
    const parts = encryptedData.split(':');

    if (parts.length !== 3) {
      console.error('Invalid encrypted data format');
      return null;
    }

    const iv = Buffer.from(parts[0], ENCODING);
    const authTag = Buffer.from(parts[1], ENCODING);
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, ENCODING, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    return null;
  }
}

/**
 * Create a hash of data (for validation without decryption)
 * @param {string} data - Data to hash
 * @returns {string} SHA-256 hash
 */
export function hashData(data) {
  if (!data) return null;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Encrypt multiple fields in an object
 * @param {object} obj - Object with data
 * @param {array} fieldsToEncrypt - Field names to encrypt
 * @returns {object} Object with encrypted fields
 */
export function encryptObject(obj, fieldsToEncrypt = []) {
  const encrypted = { ...obj };

  for (const field of fieldsToEncrypt) {
    if (encrypted[field]) {
      encrypted[field] = encryptData(encrypted[field]);
    }
  }

  return encrypted;
}

/**
 * Decrypt multiple fields in an object
 * @param {object} obj - Object with encrypted data
 * @param {array} fieldsToDecrypt - Field names to decrypt
 * @returns {object} Object with decrypted fields
 */
export function decryptObject(obj, fieldsToDecrypt = []) {
  const decrypted = { ...obj };

  for (const field of fieldsToDecrypt) {
    if (decrypted[field]) {
      decrypted[field] = decryptData(decrypted[field]);
    }
  }

  return decrypted;
}
