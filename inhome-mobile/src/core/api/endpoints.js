// File: src/core/api/endpoints.js
/**
 * Constantes d'endpoints de l'API InHome Backend
 */
export const ENDPOINTS = {
  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_ME: '/auth/me',

  // Providers & Map
  PROVIDERS_NEARBY: '/providers/nearby',

  // Bookings
  BOOKINGS: '/bookings',
  BOOKINGS_MINE: '/bookings/mine',
  BOOKINGS_NEARBY: '/bookings/nearby', // Flux des demandes pour les prestataires
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  BOOKING_UPDATE_PRICE: (id) => `/bookings/${id}`,
  BOOKING_CANCEL: (id) => `/bookings/${id}/cancel`,
  BOOKING_STATUS: (id) => `/bookings/${id}/status`,

  // Offers
  BOOKING_OFFERS: (bookingId) => `/bookings/${bookingId}/offers`,
  OFFER_ACCEPT: (offerId) => `/offers/${offerId}/accept`,

  // Live Tracking & Location
  BOOKING_LOCATION: (bookingId) => `/bookings/${bookingId}/location`,

  // Chat
  BOOKING_MESSAGES: (bookingId) => `/bookings/${bookingId}/messages`,

  // Ratings
  RATINGS: '/ratings',

  // Worker Mode
  WORKER_ME: '/workers/me',
  WORKER_AVAILABILITY: '/workers/me/availability',
  WORKER_EARNINGS: '/workers/me/earnings',

  // AI Assistant
  AI_MATCH: '/ai/match',
  AI_CHAT: '/ai/chat',

  // Uploads & Devices
  UPLOADS: '/uploads',
  DEVICES: '/devices',
};

export default ENDPOINTS;
