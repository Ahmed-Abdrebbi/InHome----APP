// File: src/core/api/mocks/providersMock.js
import { getDb } from './mockDb';
import { calculateDistanceKm } from '../../utils/distance';

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export const providersMock = {
  async getNearby({ latitude, longitude, category, radiusKm = 10 }) {
    await delay(350);
    const db = getDb();
    let providers = db.providers.filter((p) => p.isOnline);

    if (category && category !== 'tous') {
      providers = providers.filter((p) => p.category === category);
    }

    // Calcule la distance de chaque prestataire par rapport au point demandé
    return providers.map((p) => {
      const dist =
        latitude && longitude
          ? calculateDistanceKm(latitude, longitude, p.latitude, p.longitude)
          : 1.5;
      return {
        ...p,
        distanceKm: dist,
      };
    });
  },
};
