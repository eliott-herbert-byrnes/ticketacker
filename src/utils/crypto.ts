import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils';
import { base32 } from 'rfc4648';

export const generateRandomToken = (): string => {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return base32.stringify(bytes, { pad: false }).toLowerCase();
};

export const hashToken = (token: string): string => {
  const hashBytes = sha256(new TextEncoder().encode(token));
  return bytesToHex(hashBytes);
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateRandomString = (alphabet: string, length: number): string => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => alphabet[b % alphabet.length])
    .join('');
};

export const generateRandomCode = (): string => generateRandomString(ALPHABET, 8);
