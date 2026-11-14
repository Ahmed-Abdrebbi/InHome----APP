// File: src/features/home/store/useMapStore.js
import { create } from 'zustand';
import providersApi from '../api/providersApi';
import { DEFAULT_CITY } from '../../../core/config/constants';

export const useMapStore = create((set, get) => ({
  selectedCategory: 'tous',
  selectedProvider: null,
  providers: [],
  loading: false,
  error: null,

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().fetchProviders();
  },

  setSelectedProvider: (provider) => {
    set({ selectedProvider: provider });
  },

  fetchProviders: async (coords = null) => {
    set({ loading: true, error: null });
    const { selectedCategory } = get();
    const lat = coords?.latitude || DEFAULT_CITY.latitude;
    const lng = coords?.longitude || DEFAULT_CITY.longitude;

    try {
      const providers = await providersApi.getNearby({
        latitude: lat,
        longitude: lng,
        category: selectedCategory === 'All' || selectedCategory === 'tous' ? null : selectedCategory,
        radiusKm: 15,
      });

      set({ providers, loading: false });
      return providers;
    } catch (e) {
      console.warn('[useMapStore] fetchProviders error:', e);
      set({ loading: false, error: e.message });
      return [];
    }
  },
}));

export default useMapStore;
