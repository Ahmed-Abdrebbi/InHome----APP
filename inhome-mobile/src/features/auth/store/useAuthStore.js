// File: src/features/auth/store/useAuthStore.js
import { create } from 'zustand';
import secureStorage from '../../../core/storage/secureStorage';
import appStorage from '../../../core/storage/appStorage';
import { STORAGE_KEYS } from '../../../core/config/constants';
import authApi from '../api/authApi';
import { setOnUnauthorized } from '../../../core/api/client';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  status: 'idle', // 'idle' | 'loading' | 'signedIn' | 'signedOut'
  error: null,

  hydrate: async () => {
    try {
      set({ status: 'loading' });
      const token = await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const user = await appStorage.getItem(STORAGE_KEYS.USER_DATA, true);

      if (token && user) {
        set({ token, user, status: 'signedIn', error: null });
      } else {
        set({ token: null, user: null, status: 'signedOut', error: null });
      }
    } catch (e) {
      console.warn('[useAuthStore] Erreur hydratation:', e);
      set({ token: null, user: null, status: 'signedOut', error: e.message });
    }
  },

  login: async (credentials) => {
    try {
      set({ status: 'loading', error: null });
      const { token, user } = await authApi.login(credentials);

      await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await appStorage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({ token, user, status: 'signedIn', error: null });
      return { success: true, user };
    } catch (error) {
      set({ status: 'signedOut', error: error.message || 'Échec de la connexion' });
      throw error;
    }
  },

  register: async (data) => {
    try {
      set({ status: 'loading', error: null });
      const { token, user } = await authApi.register(data);

      await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await appStorage.setItem(STORAGE_KEYS.USER_DATA, user);

      set({ token, user, status: 'signedIn', error: null });
      return { success: true, user };
    } catch (error) {
      set({ status: 'signedOut', error: error.message || "Échec de l'inscription" });
      throw error;
    }
  },

  logout: async () => {
    try {
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await appStorage.removeItem(STORAGE_KEYS.USER_DATA);
      set({ user: null, token: null, status: 'signedOut', error: null });
    } catch (e) {
      console.warn('[useAuthStore] Erreur logout:', e);
    }
  },
}));

// Injection du callback de déconnexion automatique en cas de 401
setOnUnauthorized(() => {
  useAuthStore.getState().logout();
});

export default useAuthStore;
