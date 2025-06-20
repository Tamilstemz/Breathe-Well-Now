import axios from "axios";
import CryptoJS from "crypto-js";
import { environment } from "../environment/environment.prod";

const TOKEN_KEY = "nd_token";
const ENCRYPTION_KEY = "@@secure@@";

const userCredentials = {
  loginname: "Superadmin",
  password: "@@@@@@",
};

function encrypt(data: any) {
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

function decrypt(data: any) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
}

function saveToken(token: any) {
  const encrypted = encrypt(token);
  localStorage.setItem(TOKEN_KEY, encrypted);
}

function getToken() {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  return encrypted ? decrypt(encrypted) : null;
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function fetchToken() {
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

export async function getValidToken() {
  let token = getToken();
  if (token) return token;
  token = await fetchToken();
  return token;
}

export { clearToken };
