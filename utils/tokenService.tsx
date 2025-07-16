import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { environment, API } from "../environment/environment";
import { decrypt, encrypt, x_api_keyencryption } from "../utils/crypto-util";

const TOKEN_KEY = "nd_token";

// Function to save encrypted token
function saveToken(token: string) {
  const encrypted = encrypt(token);
  localStorage.setItem(TOKEN_KEY, encrypted);
}

// Function to get decrypted token
function getToken(): string | null {
  const encrypted = localStorage.getItem(TOKEN_KEY);
  return encrypted ? decrypt(encrypted) : null;
}

// Function to clear token
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Decode JWT to get expiry
function getTokenExpiry(token: string): number | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null; // Convert to ms
  } catch (error) {
    console.error("Failed to decode token expiry", error);
    return null;
  }
}

// Fetch new token
async function fetchToken(): Promise<string | null> {
  try {
    const res = await axios.post(
      API.TOKEN_API,
      {},
      {
        headers: {
          "X-API-KEY": x_api_keyencryption(
            environment.WEBSITE_CUSTOM_SECRET_KEY
          ),
        },
      }
    );

    const token = res?.data?.access || res?.data?.token;
    if (token) {
      saveToken(token); // Save encrypted token
      return token;
    }
  } catch (e) {
    console.error("Token fetch failed", e);
  }

  return null;
}
let tokenFetchPromise: Promise<string | null> | null = null;

export async function getValidToken(): Promise<string | null> {
  let token = getToken();

  const expiryTime = token ? getTokenExpiry(token) : null;
  const isExpired = !expiryTime || Date.now() >= expiryTime;

  if (token && !isExpired) {
    return token; // Return valid token
  }

  if (!tokenFetchPromise) {
    console.log("Token expired or missing. Fetching new token...");
    tokenFetchPromise = fetchToken();
    tokenFetchPromise.finally(() => {
      tokenFetchPromise = null; // Clear lock once done
    });
  } else {
    console.log("Waiting for ongoing token fetch...");
  }

  return tokenFetchPromise;
}
export { clearToken };
