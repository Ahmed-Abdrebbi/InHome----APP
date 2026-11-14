// File: src/features/booking/store/useOffersStore.js
import { create } from 'zustand';
import offersApi from '../api/offersApi';

export const useOffersStore = create((set, get) => ({
  offers: [],
  loading: false,
  error: null,
  acceptedOffer: null,

  fetchOffers: async (bookingId) => {
    if (!bookingId) return [];
    try {
      const offers = await offersApi.getOffersForBooking(bookingId);
      set({ offers, error: null });
      return offers;
    } catch (e) {
      set({ error: e.message });
      return [];
    }
  },

  acceptOffer: async (offerId) => {
    set({ loading: true, error: null });
    try {
      const result = await offersApi.acceptOffer(offerId);
      set({
        acceptedOffer: result.offer,
        loading: false,
      });
      return result;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  reset: () => {
    set({
      offers: [],
      loading: false,
      error: null,
      acceptedOffer: null,
    });
  },
}));

export default useOffersStore;
