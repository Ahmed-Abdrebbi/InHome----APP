// File: src/features/auth/api/authApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { authMock } from '../../../core/api/mocks/authMock';

export const authApi = {
  async login(credentials) {
    if (ENV.USE_MOCKS) {
      return authMock.login(credentials);
    }
    return apiClient.post(ENDPOINTS.AUTH_LOGIN, credentials);
  },

  async register(data) {
    if (ENV.USE_MOCKS) {
      return authMock.register(data);
    }
    return apiClient.post(ENDPOINTS.AUTH_REGISTER, data);
  },

  async getMe() {
    if (ENV.USE_MOCKS) {
      return authMock.getMe();
    }
    return apiClient.get(ENDPOINTS.AUTH_ME);
  },
};

export default authApi;
