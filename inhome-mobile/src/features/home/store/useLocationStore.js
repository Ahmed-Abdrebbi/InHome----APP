// File: src/store/useLocationStore.js
import { create } from 'zustand';

/**
 * Default location for Fquih Ben Salah, Morocco
 */
const DEFAULT_COORDS = {
  latitude: 32.5000,
  longitude: -6.6833,
};

/**
 * Zustand store for managing user location and permission status.
 */
const useLocationStore = create((set) => ({
  userLocation: null,
  permissionStatus: 'undetermined', // 'granted' | 'denied' | 'skipped' | 'undetermined'

  setLocation: (coords) => set({ userLocation: coords }),
  setPermissionStatus: (status) => set({ permissionStatus: status }),

  setDefaultLocation: () =>
    set({
      userLocation: DEFAULT_COORDS,
      permissionStatus: 'skipped',
    }),
}));

export default useLocationStore;
