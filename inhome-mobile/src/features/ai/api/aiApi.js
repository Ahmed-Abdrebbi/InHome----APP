// File: src/features/ai/api/aiApi.js
import ENV from '../../../core/config/env';
import apiClient from '../../../core/api/client';
import ENDPOINTS from '../../../core/api/endpoints';
import { aiMock } from '../../../core/api/mocks/aiMock';

export const aiApi = {
  async matchService(query) {
    if (ENV.USE_MOCKS) {
      return aiMock.matchService(query);
    }
    return apiClient.post(ENDPOINTS.AI_MATCH, { query });
  },

  async streamChat(message, onChunk) {
    if (ENV.USE_MOCKS) {
      return aiMock.streamChat(message, onChunk);
    }
    // Future backend endpoint (EventSource or fetch stream)
    return apiClient.post(ENDPOINTS.AI_CHAT, { message });
  },
};

export default aiApi;
