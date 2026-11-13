// File: src/features/booking/api/bookingsApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { bookingsMock } from '../../../core/api/mocks/bookingsMock';

export const bookingsApi = {
  async create(payload) {
    if (ENV.USE_MOCKS) {
      return bookingsMock.create(payload);
    }
    return apiClient.post(ENDPOINTS.BOOKINGS, payload);
  },

  async getMine() {
    if (ENV.USE_MOCKS) {
      return bookingsMock.getMine();
    }
    return apiClient.get(ENDPOINTS.BOOKINGS_MINE);
  },

  async getNearbyFeed(params) {
    if (ENV.USE_MOCKS) {
      return bookingsMock.getNearbyFeed(params);
    }
    return apiClient.get(ENDPOINTS.BOOKINGS_NEARBY, { params });
  },

  async getById(id) {
    if (ENV.USE_MOCKS) {
      return bookingsMock.getById(id);
    }
    return apiClient.get(ENDPOINTS.BOOKING_BY_ID(id));
  },

  async updatePrice(id, newPrice) {
    if (ENV.USE_MOCKS) {
      return bookingsMock.updatePrice(id, newPrice);
    }
    return apiClient.patch(ENDPOINTS.BOOKING_UPDATE_PRICE(id), { price: newPrice });
  },

  async cancel(id, reason) {
    if (ENV.USE_MOCKS) {
      return bookingsMock.cancel(id, reason);
    }
    return apiClient.patch(ENDPOINTS.BOOKING_CANCEL(id), { reason });
  },

  async updateStatus(id, status) {
    if (ENV.USE_MOCKS) {
      return bookingsMock.updateStatus(id, status);
    }
    return apiClient.patch(ENDPOINTS.BOOKING_STATUS(id), { status });
  },
};

export default bookingsApi;
