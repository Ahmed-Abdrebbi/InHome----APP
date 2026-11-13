// File: src/features/chat/api/messagesApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { messagesMock } from '../../../core/api/mocks/messagesMock';

export const messagesApi = {
  async getMessages(bookingId) {
    if (ENV.USE_MOCKS) {
      return messagesMock.getMessages(bookingId);
    }
    return apiClient.get(ENDPOINTS.BOOKING_MESSAGES(bookingId));
  },

  async sendMessage(bookingId, text, senderId) {
    if (ENV.USE_MOCKS) {
      return messagesMock.sendMessage(bookingId, text, senderId);
    }
    return apiClient.post(ENDPOINTS.BOOKING_MESSAGES(bookingId), { text });
  },
};

export default messagesApi;
