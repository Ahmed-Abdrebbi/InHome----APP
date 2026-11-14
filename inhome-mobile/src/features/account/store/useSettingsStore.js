// File: src/features/account/store/useSettingsStore.js
import { create } from 'zustand';
import appStorage from '../../../core/storage/appStorage';
import { STORAGE_KEYS } from '../../../core/config/constants';
import { setLanguage as setI18nLanguage } from '../../../core/i18n';

export const useSettingsStore = create((set, get) => ({
  hasSeenOnboarding: false,
  language: 'fr',
  activeMode: 'client', // 'client' | 'worker'
  isHydrated: false,

  hydrate: async () => {
    try {
      const seen = await appStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, true);
      const mode = await appStorage.getItem(STORAGE_KEYS.ACTIVE_MODE);
      const settings = await appStorage.getItem(STORAGE_KEYS.SETTINGS, true);

      const lang = settings?.language || 'fr';
      setI18nLanguage(lang);

      set({
        hasSeenOnboarding: !!seen,
        activeMode: mode === 'worker' ? 'worker' : 'client',
        language: lang,
        isHydrated: true,
      });
    } catch (e) {
      console.warn('[useSettingsStore] Erreur hydratation:', e);
      set({ isHydrated: true });
    }
  },

  setHasSeenOnboarding: async (seen = true) => {
    await appStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, seen);
    set({ hasSeenOnboarding: seen });
  },

  setActiveMode: async (mode) => {
    const validMode = mode === 'worker' ? 'worker' : 'client';
    await appStorage.setItem(STORAGE_KEYS.ACTIVE_MODE, validMode);
    set({ activeMode: validMode });
  },

  setLanguage: async (lang) => {
    setI18nLanguage(lang);
    const currentSettings = (await appStorage.getItem(STORAGE_KEYS.SETTINGS, true)) || {};
    await appStorage.setItem(STORAGE_KEYS.SETTINGS, { ...currentSettings, language: lang });
    set({ language: lang });
  },
}));

export default useSettingsStore;
