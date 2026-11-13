// File: src/core/storage/secureStorage.js
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Stockage sécurisé pour les secrets et tokens sensibles (JWT).
 * Sur le Web, fallback propre sur localStorage car SecureStore n'est pas supporté nativement.
 */
export const secureStorage = {
  async setItem(key, value) {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn(`[secureStorage] Erreur setItem pour la clé "${key}":`, error);
    }
  },

  async getItem(key) {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[secureStorage] Erreur getItem pour la clé "${key}":`, error);
      return null;
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`[secureStorage] Erreur removeItem pour la clé "${key}":`, error);
    }
  },
};

export default secureStorage;
