// File: src/store/useChatStore.js
import { create } from 'zustand';

/**
 * Zustand store for managing AI Chat messages, streaming chunks, and typing state.
 */
const useChatStore = create((set) => ({
  messages: [],
  isTyping: false,

  setIsTyping: (status) => set({ isTyping: status }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: message.id || Date.now().toString(),
          role: message.role || 'user',
          content: message.content || '',
          timestamp: message.timestamp || new Date().toISOString(),
        },
      ],
    })),

  appendChunk: (chunk) =>
    set((state) => {
      const messages = [...state.messages];
      const lastIndex = messages.length - 1;

      if (lastIndex >= 0 && messages[lastIndex].role === 'assistant') {
        messages[lastIndex] = {
          ...messages[lastIndex],
          content: messages[lastIndex].content + chunk,
        };
        return { messages };
      } else {
        const newMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: chunk,
          timestamp: new Date().toISOString(),
        };
        return { messages: [...messages, newMessage] };
      }
    }),

  clearChat: () => set({ messages: [], isTyping: false }),
}));

export default useChatStore;
