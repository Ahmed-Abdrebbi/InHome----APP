// File: src/core/api/mocks/bookingsMock.js
import { getDb, scheduleMockOffersForBooking } from './mockDb';
import { BOOKING_STATUSES } from '../../config/statuses';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const bookingsMock = {
  async create(bookingPayload) {
    await delay(450);
    const db = getDb();
    const newBooking = {
      id: `bk_${Date.now()}`,
      clientId: db.users[0]?.id || 'usr_client_1',
      clientName: db.users[0]?.fullName || 'Client InHome',
      clientPhone: db.users[0]?.phone || '+212612345678',
      categoryId: bookingPayload.categoryId || 'plomberie',
      address: bookingPayload.address || 'Maârif, Casablanca',
      latitude: bookingPayload.latitude || 33.5731,
      longitude: bookingPayload.longitude || -7.5898,
      proposedPrice: Number(bookingPayload.proposedPrice) || 80,
      description: bookingPayload.description || '',
      tier: bookingPayload.tier || 'STANDARD',
      serviceTypes: bookingPayload.serviceTypes || [],
      materialIncluded: !!bookingPayload.materialIncluded,
      status: BOOKING_STATUSES.PENDING,
      assignedWorker: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.bookings.unshift(newBooking);

    // Planifie l'arrivée des offres d'artisans simulés
    scheduleMockOffersForBooking(newBooking.id, newBooking.proposedPrice, newBooking.categoryId);

    return newBooking;
  },

  async getMine() {
    await delay(300);
    const db = getDb();
    return db.bookings;
  },

  async getNearbyFeed({ category } = {}) {
    await delay(350);
    const db = getDb();
    // Le flux prestataire affiche les réservations en attente ou celles qui lui sont assignées
    let feed = db.bookings.filter(
      (b) => b.status === BOOKING_STATUSES.PENDING || b.status === BOOKING_STATUSES.MATCHED
    );
    if (category && category !== 'tous') {
      feed = feed.filter((b) => b.categoryId === category);
    }
    return feed;
  },

  async getById(id) {
    await delay(250);
    const db = getDb();
    const booking = db.bookings.find((b) => b.id === id);
    if (!booking) {
      throw new Error('Réservation introuvable');
    }
    return booking;
  },

  async updatePrice(id, newPrice) {
    await delay(300);
    const db = getDb();
    const booking = db.bookings.find((b) => b.id === id);
    if (booking) {
      booking.proposedPrice = Number(newPrice);
      booking.updatedAt = new Date().toISOString();
      // Relance des offres avec le prix rehaussé
      scheduleMockOffersForBooking(id, booking.proposedPrice, booking.categoryId);
    }
    return booking;
  },

  async cancel(id, reason = 'Annulé par le client') {
    await delay(350);
    const db = getDb();
    const booking = db.bookings.find((b) => b.id === id);
    if (booking) {
      booking.status = BOOKING_STATUSES.CANCELLED;
      booking.cancelReason = reason;
      booking.updatedAt = new Date().toISOString();
    }
    return booking;
  },

  async updateStatus(id, newStatus) {
    await delay(300);
    const db = getDb();
    const booking = db.bookings.find((b) => b.id === id);
    if (booking) {
      booking.status = newStatus;
      booking.updatedAt = new Date().toISOString();
    }
    return booking;
  },
};
