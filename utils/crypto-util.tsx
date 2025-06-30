// src/utils/crypto-util.ts
import CryptoJS from "crypto-js";
import { environment } from "../environment/environment";

const ENCRYPTION_KEY = environment.SECRET_KEY;

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

export function decrypt(data: string): string | null {
  try {
    const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}
