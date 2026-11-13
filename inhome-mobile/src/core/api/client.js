import axios from 'axios';
import ENV from '../config/env';
import { STORAGE_KEYS } from '../config/constants';
import secureStorage from '../storage/secureStorage';
import { normalizeError } from './errors';

let onUnauthorizedCallback = null;

export const setOnUnauthorized = (callback) => {
  onUnauthorizedCallback = callback;
};

export const apiClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: inject Bearer token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(normalizeError(error))
);

// Response Interceptor: return payload data & normalize errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalized = normalizeError(error);
    if (normalized.status === 401) {
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(normalized);
  }
);

export default apiClient;
