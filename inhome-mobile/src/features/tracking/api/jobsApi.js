// File: src/features/tracking/api/jobsApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { bookingsMock } from '../../../core/api/mocks/bookingsMock';

export const jobsApi = {
  async getJob(jobId) {
    if (ENV.USE_MOCKS) {
      return bookingsMock.getById(jobId);
    }
    return apiClient.get(ENDPOINTS.BOOKING_BY_ID(jobId));
  },

  async updateStatus(jobId, status) {
    if (ENV.USE_MOCKS) {
      return bookingsMock.updateStatus(jobId, status);
    }
    return apiClient.patch(ENDPOINTS.BOOKING_STATUS(jobId), { status });
  },

  async sendWorkerLocation(jobId, { latitude, longitude }) {
    if (ENV.USE_MOCKS) {
      return { success: true, latitude, longitude };
    }
    return apiClient.post(ENDPOINTS.BOOKING_LOCATION(jobId), { latitude, longitude });
  },
};

export default jobsApi;
