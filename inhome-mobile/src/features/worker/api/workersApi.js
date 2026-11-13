// File: src/features/worker/api/workersApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { workersMock } from '../../../core/api/mocks/workersMock';

export const workersApi = {
  async getProfile() {
    if (ENV.USE_MOCKS) {
      return workersMock.getProfile();
    }
    return apiClient.get(ENDPOINTS.WORKER_ME);
  },

  async updateAvailability(isOnline) {
    if (ENV.USE_MOCKS) {
      return workersMock.updateAvailability(isOnline);
    }
    return apiClient.patch(ENDPOINTS.WORKER_AVAILABILITY, { isOnline });
  },

  async getEarnings() {
    if (ENV.USE_MOCKS) {
      return workersMock.getEarnings();
    }
    return apiClient.get(ENDPOINTS.WORKER_EARNINGS);
  },

  async updateProfile(updates) {
    if (ENV.USE_MOCKS) {
      return workersMock.updateProfile(updates);
    }
    return apiClient.patch(ENDPOINTS.WORKER_ME, updates);
  },
};

export default workersApi;
