import CryptoJS from 'crypto-js';

// Generate a random encryption key
export const generateEncryptionKey = (): string => {
  // Generate a random string of 16 characters for AES-256 encryption
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = '';
  
  for (let i = 0; i < 32; i++) {
    key += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return key;
};

// Encrypt the content using the provided key
export const encryptContent = (content: string, key: string): string => {
  try {
    // Use AES encryption
    const encrypted = CryptoJS.AES.encrypt(content, key).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Encryption failed');
  }
};

// Decrypt the content using the provided key
export const decryptContent = (encryptedContent: string, key: string): string => {
  try {
    // Use AES decryption
    const decrypted = CryptoJS.AES.decrypt(encryptedContent, key);
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedText) {
      throw new Error('Invalid encryption key');
    }
    
    return decryptedText;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Invalid encryption key or corrupted content');
  }
};

// Verify if the encryption key is valid for the encrypted content
export const isValidKey = (encryptedContent: string, key: string): boolean => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedContent, key);
    return !!decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return false;
  }
};