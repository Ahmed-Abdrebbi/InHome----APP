// File: src/core/api/mocks/mockDb.js
import { DEFAULT_CITY } from '../../config/constants';
import { BOOKING_STATUSES, OFFER_STATUSES } from '../../config/statuses';

const INITIAL_PROVIDERS = [
  {
    id: 'p1',
    fullName: 'Youssef El Amrani',
    phone: '+212661234567',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    category: 'plomberie',
    rating: 4.9,
    totalReviews: 48,
    isOnline: true,
    latitude: DEFAULT_CITY.latitude + 0.004,
    longitude: DEFAULT_CITY.longitude - 0.003,
    address: 'Maârif, Casablanca',
    bio: 'Plombier qualifié avec 12 ans d’expérience à Casablanca. Dépannage rapide 7j/7.',
  },
  {
    id: 'p2',
    fullName: 'Rachid Bennani',
    phone: '+212662345678',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    category: 'electricite',
    rating: 4.8,
    totalReviews: 35,
    isOnline: true,
    latitude: DEFAULT_CITY.latitude - 0.005,
    longitude: DEFAULT_CITY.longitude + 0.004,
    address: 'Gauthier, Casablanca',
    bio: 'Électricien agréé. Tableaux électriques, pannes et installations neuves.',
  },
  {
    id: 'p3',
    fullName: 'Hassan Mansouri',
    phone: '+212663456789',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    category: 'peinture',
    rating: 4.7,
    totalReviews: 29,
    isOnline: true,
    latitude: DEFAULT_CITY.latitude + 0.008,
    longitude: DEFAULT_CITY.longitude + 0.006,
    address: 'Bourgogne, Casablanca',
    bio: 'Artisan peintre soigné, finitions modernes et peinture décorative.',
  },
  {
    id: 'p4',
    fullName: 'Fatima Zahra Tazi',
    phone: '+212664567890',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    category: 'menage',
    rating: 4.95,
    totalReviews: 62,
    isOnline: true,
    latitude: DEFAULT_CITY.latitude - 0.003,
    longitude: DEFAULT_CITY.longitude - 0.005,
    address: 'Racine, Casablanca',
    bio: 'Service de nettoyage et ménage professionnel à domicile.',
  },
  {
    id: 'p5',
    fullName: 'Amine Chraibi',
    phone: '+212665678901',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    category: 'climatisation',
    rating: 4.85,
    totalReviews: 41,
    isOnline: true,
    latitude: DEFAULT_CITY.latitude + 0.002,
    longitude: DEFAULT_CITY.longitude + 0.007,
    address: 'Ain Diab, Casablanca',
    bio: 'Technicien frigoriste spécialisé climatisation et froid résidentiel.',
  },
  {
    id: 'p6',
    fullName: 'Karim Ouazzani',
    phone: '+212666789012',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    category: 'menuiserie',
    rating: 4.75,
    totalReviews: 19,
    isOnline: true,
    latitude: DEFAULT_CITY.latitude - 0.007,
    longitude: DEFAULT_CITY.longitude - 0.002,
    address: 'Sidi Maarouf, Casablanca',
    bio: 'Menuisier poseur: portes, serrures blindées et agencement sur mesure.',
  },
];

const INITIAL_USER_CLIENT = {
  id: 'usr_client_1',
  fullName: 'Ahmed Abdrebbi',
  phone: '+212612345678',
  email: 'ahmed@inhome.ma',
  role: 'CLIENT',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
};

const INITIAL_USER_WORKER = {
  id: 'usr_worker_1',
  fullName: 'Youssef El Amrani',
  phone: '+212661234567',
  email: 'youssef@inhome.ma',
  role: 'WORKER',
  category: 'plomberie',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  isOnline: true,
  rating: 4.9,
  totalReviews: 48,
  earningsToday: 420,
  earningsWeek: 2850,
};

let db = {
  users: [INITIAL_USER_CLIENT, INITIAL_USER_WORKER],
  providers: [...INITIAL_PROVIDERS],
  bookings: [],
  offers: [],
  messages: {},
  ratings: [],
  activeTimers: [],
};

export const getDb = () => db;

export const resetDb = () => {
  // Clear any pending timers
  if (db.activeTimers) {
    db.activeTimers.forEach((t) => clearTimeout(t));
  }
  db = {
    users: [{ ...INITIAL_USER_CLIENT }, { ...INITIAL_USER_WORKER }],
    providers: [...INITIAL_PROVIDERS.map((p) => ({ ...p }))],
    bookings: [],
    offers: [],
    messages: {},
    ratings: [],
    activeTimers: [],
  };
  return db;
};

/**
 * Simule l'arrivée automatique d'offres après la création d'une réservation côté client.
 */
export const scheduleMockOffersForBooking = (bookingId, proposedPrice, categoryId) => {
  const eligibleProviders = db.providers.filter(
    (p) => !categoryId || p.category === categoryId || p.category === 'plomberie'
  );

  const sampleCount = Math.min(3, Math.max(2, eligibleProviders.length));
  const selected = eligibleProviders.slice(0, sampleCount);

  selected.forEach((provider, index) => {
    // Échelonne l'arrivée des offres entre 3s et 8s
    const delayMs = (index + 1) * 2800;

    const timer = setTimeout(() => {
      const currentBooking = db.bookings.find((b) => b.id === bookingId);
      if (!currentBooking || currentBooking.status !== BOOKING_STATUSES.PENDING) {
        return; // Réservation déjà annulée ou acceptée
      }

      // 1er prestataire accepte le prix proposé, les autres font une petite contre-offre
      let offerPrice = proposedPrice;
      if (index === 1) {
        offerPrice = Math.round(proposedPrice * 1.15); // +15%
      } else if (index === 2) {
        offerPrice = Math.round(proposedPrice * 0.95); // -5%
      }

      const offer = {
        id: `off_${Date.now()}_${index}`,
        bookingId,
        providerId: provider.id,
        providerName: provider.fullName,
        providerAvatar: provider.avatar,
        providerRating: provider.rating,
        providerReviewsCount: provider.totalReviews,
        providerDistanceKm: 1.2 + index * 0.8,
        price: offerPrice,
        etaMinutes: 15 + index * 10,
        status: OFFER_STATUSES.PENDING,
        createdAt: new Date().toISOString(),
      };

      db.offers.push(offer);
    }, delayMs);

    db.activeTimers.push(timer);
  });
};
