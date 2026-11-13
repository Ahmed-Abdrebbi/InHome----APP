// File: src/features/booking/api/offersApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { offersMock } from '../../../core/api/mocks/offersMock';

export const offersApi = {
  async getOffersForBooking(bookingId) {
    if (ENV.USE_MOCKS) {
      return offersMock.getOffersForBooking(bookingId);
    }
    return apiClient.get(ENDPOINTS.BOOKING_OFFERS(bookingId));
  },

  async sendOffer({ bookingId, price, etaMinutes, message }) {
    if (ENV.USE_MOCKS) {
      return offersMock.sendOffer({ bookingId, price, etaMinutes, message });
    }
    return apiClient.post(ENDPOINTS.BOOKING_OFFERS(bookingId), { price, etaMinutes, message });
  },

  async acceptOffer(offerId) {
    if (ENV.USE_MOCKS) {
      return offersMock.acceptOffer(offerId);
    }
    return apiClient.post(ENDPOINTS.OFFER_ACCEPT(offerId));
  },
};

export default offersApi;
