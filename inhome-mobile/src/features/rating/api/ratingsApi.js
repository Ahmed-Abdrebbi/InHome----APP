// File: src/features/rating/api/ratingsApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { getDb } from '../../../core/api/mocks/mockDb';

export const ratingsApi = {
  async submitRating({ bookingId, providerId, rating, comment }) {
    if (ENV.USE_MOCKS) {
      const db = getDb();
      const ratingObj = {
        id: `rat_${Date.now()}`,
        bookingId,
        providerId,
        rating: Number(rating),
        comment,
        createdAt: new Date().toISOString(),
      };
      db.ratings.push(ratingObj);
      return ratingObj;
    }
    return apiClient.post(ENDPOINTS.RATINGS, { bookingId, providerId, rating, comment });
  },
};

export default ratingsApi;
