// File: src/store/useLocationStore.js
import { create } from 'zustand';

export const useLocationStore = create((set) => ({
  currentLocation: {
    latitude: 31.6295,
    longitude: -7.9811,
    address: 'Av. Marrakech, Marrakech',
  },
  savedAddresses: [
    { id: '1', name: 'Av. Marrakech', subtitle: 'Appartement 12, 3ème étage' },
    { id: '2', name: 'Rue Ibn Batouta', subtitle: 'Villa 45' },
  ],
  hasPermission: false,

  setPermission: (granted) => set({ hasPermission: granted }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  addSavedAddress: (address) =>
    set((state) => ({
      savedAddresses: [address, ...state.savedAddresses],
    })),
}));
