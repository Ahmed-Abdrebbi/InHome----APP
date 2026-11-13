// File: src/core/api/mocks/offersMock.js
import { getDb } from './mockDb';
import { BOOKING_STATUSES, OFFER_STATUSES } from '../../config/statuses';

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const offersMock = {
  async getOffersForBooking(bookingId) {
    await delay(300);
    const db = getDb();
    return db.offers.filter((o) => o.bookingId === bookingId);
  },

  async sendOffer({ bookingId, price, etaMinutes = 20, message = '' }) {
    await delay(450);
    const db = getDb();
    const worker = db.users.find((u) => u.role === 'WORKER') || {
      id: 'usr_worker_1',
      fullName: 'Youssef El Amrani',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      rating: 4.9,
      totalReviews: 48,
    };

    const offer = {
      id: `off_${Date.now()}`,
      bookingId,
      providerId: worker.id,
      providerName: worker.fullName,
      providerAvatar: worker.avatar,
      providerRating: worker.rating || 4.8,
      providerReviewsCount: worker.totalReviews || 25,
      providerDistanceKm: 1.5,
      price: Number(price),
      etaMinutes: Number(etaMinutes),
      message,
      status: OFFER_STATUSES.PENDING,
      createdAt: new Date().toISOString(),
    };

    db.offers.push(offer);
    return offer;
  },

  async acceptOffer(offerId) {
    await delay(400);
    const db = getDb();
    const offer = db.offers.find((o) => o.id === offerId);
    if (!offer) {
      throw new Error('Offre introuvable');
    }

    offer.status = OFFER_STATUSES.ACCEPTED;

    // Décline les autres offres
    db.offers
      .filter((o) => o.bookingId === offer.bookingId && o.id !== offerId)
      .forEach((o) => {
        o.status = OFFER_STATUSES.REJECTED;
      });

    // Met à jour la réservation
    const booking = db.bookings.find((b) => b.id === offer.bookingId);
    if (booking) {
      booking.status = BOOKING_STATUSES.MATCHED;
      booking.finalPrice = offer.price;
      booking.assignedWorker = {
        id: offer.providerId,
        fullName: offer.providerName,
        avatar: offer.providerAvatar,
        rating: offer.providerRating,
        phone: '+212661234567',
        etaMinutes: offer.etaMinutes,
      };
      booking.updatedAt = new Date().toISOString();
    }

    return { offer, booking };
  },
};
