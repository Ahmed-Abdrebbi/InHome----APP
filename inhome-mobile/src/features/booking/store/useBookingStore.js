// File: src/features/booking/store/useBookingStore.js
import { create } from 'zustand';
import bookingsApi from '../api/bookingsApi';
import { DEFAULT_CITY } from '../../../core/config/constants';
import { TIERS } from '../../../core/config/statuses';

const INITIAL_DRAFT = {
  category: 'plomberie',
  address: 'Maârif, Casablanca',
  coordinates: {
    latitude: DEFAULT_CITY.latitude,
    longitude: DEFAULT_CITY.longitude,
  },
  description: '',
  photoUris: [],
  proposedPrice: 80,
  tier: TIERS.STANDARD.id,
  serviceTypes: ['Diagnostic', 'Réparation standard'],
  materialIncluded: false,
};

export const useBookingStore = create((set, get) => ({
  draft: { ...INITIAL_DRAFT },
  activeBooking: null,
  activeBookingId: null,
  loading: false,
  error: null,

  updateDraft: (fields) => {
    set((state) => ({
      draft: { ...state.draft, ...fields },
    }));
  },

  setProposedPrice: (price) => {
    set((state) => ({
      draft: { ...state.draft, proposedPrice: Number(price) },
    }));
  },

  createBooking: async () => {
    const { draft } = get();
    set({ loading: true, error: null });
    try {
      const booking = await bookingsApi.create({
        categoryId: draft.category,
        address: draft.address,
        latitude: draft.coordinates.latitude,
        longitude: draft.coordinates.longitude,
        proposedPrice: draft.proposedPrice,
        description: draft.description,
        tier: draft.tier,
        serviceTypes: draft.serviceTypes,
        materialIncluded: draft.materialIncluded,
      });

      set({
        activeBooking: booking,
        activeBookingId: booking.id,
        loading: false,
      });
      return booking;
    } catch (e) {
      set({ loading: false, error: e.message || 'Erreur lors de la création' });
      throw e;
    }
  },

  loadBooking: async (id) => {
    set({ loading: true, error: null });
    try {
      const booking = await bookingsApi.getById(id);
      set({ activeBooking: booking, activeBookingId: booking.id, loading: false });
      return booking;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  updatePrice: async (newPrice) => {
    const { activeBookingId } = get();
    if (!activeBookingId) return;
    set({ loading: true });
    try {
      const updated = await bookingsApi.updatePrice(activeBookingId, newPrice);
      set((state) => ({
        activeBooking: updated,
        draft: { ...state.draft, proposedPrice: Number(newPrice) },
        loading: false,
      }));
      return updated;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  cancelActiveBooking: async (reason) => {
    const { activeBookingId } = get();
    if (!activeBookingId) return;
    set({ loading: true });
    try {
      const cancelled = await bookingsApi.cancel(activeBookingId, reason);
      set({ activeBooking: cancelled, loading: false });
      return cancelled;
    } catch (e) {
      set({ loading: false, error: e.message });
      throw e;
    }
  },

  resetDraft: () => {
    set({ draft: { ...INITIAL_DRAFT } });
  },

  reset: () => {
    set({
      draft: { ...INITIAL_DRAFT },
      activeBooking: null,
      activeBookingId: null,
      loading: false,
      error: null,
    });
  },
}));

export default useBookingStore;
