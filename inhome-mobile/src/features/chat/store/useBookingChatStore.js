// File: src/features/chat/store/useBookingChatStore.js
import { create } from 'zustand';
import messagesApi from '../api/messagesApi';

export const useBookingChatStore = create((set, get) => ({
  messages: [],
  loading: false,
  sending: false,
  error: null,

  fetchMessages: async (bookingId) => {
    if (!bookingId) return [];
    try {
      const messages = await messagesApi.getMessages(bookingId);
      set({ messages, error: null });
      return messages;
    } catch (e) {
      set({ error: e.message });
      return [];
    }
  },

  sendMessage: async (bookingId, text, senderId = 'usr_client_1') => {
    if (!text || !text.trim()) return;
    set({ sending: true });
    try {
      const msg = await messagesApi.sendMessage(bookingId, text.trim(), senderId);
      set((state) => ({
        messages: [...state.messages, msg],
        sending: false,
      }));
      return msg;
    } catch (e) {
      set({ sending: false, error: e.message });
      throw e;
    }
  },

  reset: () => {
    set({
      messages: [],
      loading: false,
      sending: false,
      error: null,
    });
  },
}));

export default useBookingChatStore;
