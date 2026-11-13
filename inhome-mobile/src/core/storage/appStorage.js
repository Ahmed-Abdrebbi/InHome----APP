// File: src/core/storage/appStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Stockage asynchrone standard pour les préférences utilisateur et caches non sensibles.
 */
export const appStorage = {
  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.warn(`[appStorage] Erreur setItem "${key}":`, error);
    }
  },

  async getItem(key, isJson = false) {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val === null) return null;
      return isJson ? JSON.parse(val) : val;
    } catch (error) {
      console.warn(`[appStorage] Erreur getItem "${key}":`, error);
      return null;
    }
  },

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn(`[appStorage] Erreur removeItem "${key}":`, error);
    }
  },

  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('[appStorage] Erreur clear:', error);
    }
  },
};

export default appStorage;
