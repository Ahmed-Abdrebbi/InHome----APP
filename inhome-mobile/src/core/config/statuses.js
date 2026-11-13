// File: src/core/config/statuses.js
/**
 * Statuts des commandes et des offres InHome.ma
 */
export const BOOKING_STATUSES = {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  EN_ROUTE: 'EN_ROUTE',
  ARRIVED: 'ARRIVED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
};

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUSES.PENDING]: 'Recherche en cours',
  [BOOKING_STATUSES.MATCHED]: 'Prestataire sélectionné',
  [BOOKING_STATUSES.EN_ROUTE]: 'En route vers chez vous',
  [BOOKING_STATUSES.ARRIVED]: 'Arrivé sur place',
  [BOOKING_STATUSES.IN_PROGRESS]: 'Intervention en cours',
  [BOOKING_STATUSES.COMPLETED]: 'Terminée',
  [BOOKING_STATUSES.CANCELLED]: 'Annulée',
  [BOOKING_STATUSES.EXPIRED]: 'Expirée (aucun prestataire disponible)',
};

export const OFFER_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
};

export const OFFER_STATUS_LABELS = {
  [OFFER_STATUSES.PENDING]: 'En attente de réponse',
  [OFFER_STATUSES.ACCEPTED]: 'Acceptée',
  [OFFER_STATUSES.REJECTED]: 'Déclinée',
  [OFFER_STATUSES.WITHDRAWN]: 'Retirée',
};

export const TIERS = {
  STANDARD: {
    id: 'STANDARD',
    title: 'Offre Standard',
    subtitle: 'Intervention dès acceptation',
    multiplier: 1.0,
  },
  URGENT: {
    id: 'URGENT',
    title: 'Intervention Urgente',
    subtitle: 'Prioritaire sous 30 minutes (+20%)',
    multiplier: 1.2,
  },
  ESTIMATE: {
    id: 'ESTIMATE',
    title: 'Devis à distance',
    subtitle: 'Discussion et estimation préalable',
    multiplier: 1.0,
  },
};
