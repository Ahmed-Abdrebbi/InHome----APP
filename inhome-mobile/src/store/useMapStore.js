// File: src/store/useMapStore.js
import { create } from 'zustand';

/**
 * Mock data representing service providers (prestataires)
 * located around Fquih Ben Salah and neighboring Moroccan regions.
 */
const INITIAL_PROVIDERS = [
  {
    id: '1',
    name: 'Youssef El Amrani',
    category: 'Plomberie',
    rating: 4.9,
    reviewsCount: 38,
    price: '150 DH',
    latitude: 32.5020,
    longitude: -6.6850,
  },
  {
    id: '2',
    name: 'Karim Bennani',
    category: 'Électricité',
    rating: 4.8,
    reviewsCount: 29,
    price: '120 DH',
    latitude: 32.4980,
    longitude: -6.6800,
  },
  {
    id: '3',
    name: 'Hassan Mansouri',
    category: 'Peinture',
    rating: 4.7,
    reviewsCount: 42,
    price: '200 DH',
    latitude: 32.5060,
    longitude: -6.6900,
  },
  {
    id: '4',
    name: 'Rachid Tazi',
    category: 'Plomberie',
    rating: 4.9,
    reviewsCount: 51,
    price: '180 DH',
    latitude: 32.5100,
    longitude: -6.6780,
  },
  {
    id: '5',
    name: 'Omar Alami',
    category: 'Électricité',
    rating: 4.6,
    reviewsCount: 19,
    price: '130 DH',
    latitude: 32.4950,
    longitude: -6.6920,
  },
  {
    id: '6',
    name: 'Mustapha Chraibi',
    category: 'Peinture',
    rating: 4.8,
    reviewsCount: 33,
    price: '220 DH',
    latitude: 32.5040,
    longitude: -6.6750,
  },
];

const useMapStore = create((set) => ({
  selectedCategory: 'All',
  providers: INITIAL_PROVIDERS,

  setSelectedCategory: (category) =>
    set({ selectedCategory: category }),
}));

export default useMapStore;
