// File: src/features/ai/store/useAiChatStore.js
import { create } from 'zustand';
import aiApi from '../api/aiApi';

export const useAiChatStore = create((set, get) => ({
  messages: [
    {
      id: 'ai_welcome',
      role: 'assistant',
      content:
        'Salam! Je suis votre assistant InHome. Décrivez-moi votre problème en Darija ou Français (ex: "robini kayti7 ma" ou "fuite lavabo"), et je vous aiderai à identifier le bon artisan et estimer le tarif.',
      timestamp: new Date().toISOString(),
    },
  ],
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

  sendMessage: async (userText) => {
    if (!userText || !userText.trim()) return;

    const userMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText.trim(),
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }));

    try {
      const assistantMsgId = `ai_${Date.now()}`;
      let created = false;

      await aiApi.streamChat(userText, (accumulatedText) => {
        set((state) => {
          const msgs = [...state.messages];
          if (!created) {
            msgs.push({
              id: assistantMsgId,
              role: 'assistant',
              content: accumulatedText,
              timestamp: new Date().toISOString(),
            });
            created = true;
          } else {
            const last = msgs[msgs.length - 1];
            if (last && last.id === assistantMsgId) {
              last.content = accumulatedText;
            }
          }
          return { messages: msgs };
        });
      });
    } catch (e) {
      console.warn('[useAiChatStore] streamChat error:', e);
    } finally {
      set({ isTyping: false });
    }
  },

  clearChat: () => set({ messages: [], isTyping: false }),
}));

export default useAiChatStore;
