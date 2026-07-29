import * as crypto from 'crypto';

const SECRET_KEY = process.env.CHAT_ENCRYPTION_KEY || '12345678901234567890123456789012';
const ALGORITHM = 'aes-256-cbc';

export function encryptText(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptText(encryptedText: string): string {
  try {
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) return encryptedText;

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    return encryptedText;
  }
}