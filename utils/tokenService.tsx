// src/services/token-service.ts
import axios from "axios";
import { encrypt, decrypt } from "../utils/crypto-util";
import { environment } from "../environment/environment";

const TOKEN_KEY = "nd_token";

const userCredentials = {
  loginname: "Superadmin",
  password: "@@@@@@",
};

function saveToken(token: string) {
  const encrypted = encrypt(token);
  localStorage.setItem(TOKEN_KEY, encrypted);
}

function getToken(): string | null {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  return encrypted ? decrypt(encrypted) : null;
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function fetchToken(): Promise<string | null> {
  try {
    const res = await axios.post(environment.TOKEN_API, userCredentials);
    const token = res?.data?.token || res?.data?.access;
    if (token) {
      saveToken(token);
      return token;
    }
  } catch (e) {
    console.error("Token fetch failed", e);
  }
  return null;
}

export async function getValidToken(): Promise<string | null> {
  let token = getToken();
  if (token) return token;
  token = await fetchToken();
  return token;
}

export { clearToken };
