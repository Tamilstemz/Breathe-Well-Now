// src/utils/crypto-util.ts
import * as CryptoJS from "crypto-js";
import { environment } from "../environment/environment";
import { Base64 } from "js-base64";

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

export function x_api_keyencryption(key: string): string {
  return CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(key), // plaintext
    CryptoJS.enc.Utf8.parse(environment.WEBSITE_CUSTOM_ENCRYPTION_SECRET_KEY), // raw key
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  ).ciphertext.toString(CryptoJS.enc.Base64);
}

