import axios from "axios";
import { clearToken, getValidToken } from "../utils/tokenService";

const httpClient = axios.create();

httpClient.interceptors.request.use(async (config) => {
  const token = await getValidToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      clearToken();
    }
    return Promise.reject(error);
  }
);

export default httpClient;
