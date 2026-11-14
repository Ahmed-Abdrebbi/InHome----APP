// File: src/features/worker/store/useWorkerStore.js
import { create } from 'zustand';
import workersApi from '../api/workersApi';
import bookingsApi from '../../booking/api/bookingsApi';
import offersApi from '../../booking/api/offersApi';

export const useWorkerStore = create((set, get) => ({
  isOnline: true,
  profile: null,
  nearbyRequests: [],
  earnings: null,
  loading: false,
  error: null,

  loadProfile: async () => {
    try {
      const profile = await workersApi.getProfile();
      set({ profile, isOnline: profile.isOnline });
      return profile;
    } catch (e) {
      console.warn('[useWorkerStore] loadProfile error:', e);
    }
  },

  toggleAvailability: async () => {
    const { isOnline } = get();
    const nextState = !isOnline;
    set({ isOnline: nextState });
    try {
      await workersApi.updateAvailability(nextState);
    } catch (e) {
      set({ isOnline, error: e.message });
    }
  },

  loadNearbyRequests: async (category = 'tous') => {
    set({ loading: true, error: null });
    try {
      const requests = await bookingsApi.getNearbyFeed({ category });
      set({ nearbyRequests: requests, loading: false });
      return requests;
    } catch (e) {
      set({ loading: false, error: e.message });
      return [];
    }
  },

  loadEarnings: async () => {
    try {
      const earnings = await workersApi.getEarnings();
      set({ earnings });
      return earnings;
    } catch (e) {
      console.warn('[useWorkerStore] loadEarnings error:', e);
    }
  },

  sendOffer: async ({ bookingId, price, etaMinutes, message }) => {
    set({ loading: true });
    try {
      const offer = await offersApi.sendOffer({ bookingId, price, etaMinutes, message });
      set({ loading: false });
      return offer;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },
}));

export default useWorkerStore;
