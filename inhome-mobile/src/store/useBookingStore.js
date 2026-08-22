// File: src/store/useBookingStore.js
import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  selectedService: null,
  selectedAddress: 'Av. Marrakech',
  proposedPrice: '',
  materialIncluded: false,
  selectedServiceTypes: ['intervention', 'devis'],
  selectedTier: 0,
  activeBooking: null,

  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setProposedPrice: (price) => set({ proposedPrice: price }),
  setMaterialIncluded: (included) => set({ materialIncluded: included }),
  setSelectedServiceTypes: (types) => set({ selectedServiceTypes: types }),
  setSelectedTier: (tier) => set({ selectedTier: tier }),
  setActiveBooking: (booking) => set({ activeBooking: booking }),
  resetBooking: () =>
    set({
      selectedService: null,
      proposedPrice: '',
      materialIncluded: false,
      selectedServiceTypes: ['intervention', 'devis'],
      selectedTier: 0,
      activeBooking: null,
    }),
}));
