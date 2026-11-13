// File: src/features/home/api/providersApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { providersMock } from '../../../core/api/mocks/providersMock';

export const providersApi = {
  async getNearby({ latitude, longitude, category, radiusKm }) {
    if (ENV.USE_MOCKS) {
      return providersMock.getNearby({ latitude, longitude, category, radiusKm });
    }
    return apiClient.get(ENDPOINTS.PROVIDERS_NEARBY, {
      params: { lat: latitude, lng: longitude, category, radiusKm },
    });
  },
};

export default providersApi;
