// File: src/core/api/mocks/workersMock.js
import { getDb } from './mockDb';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const workersMock = {
  async getProfile() {
    await delay(300);
    const db = getDb();
    return (
      db.users.find((u) => u.role === 'WORKER') || {
        id: 'usr_worker_1',
        fullName: 'Youssef El Amrani',
        phone: '+212661234567',
        category: 'plomberie',
        isOnline: true,
        rating: 4.9,
        totalReviews: 48,
        earningsToday: 420,
        earningsWeek: 2850,
      }
    );
  },

  async updateAvailability(isOnline) {
    await delay(200);
    const db = getDb();
    const worker = db.users.find((u) => u.role === 'WORKER');
    if (worker) {
      worker.isOnline = isOnline;
    }
    return { isOnline };
  },

  async getEarnings() {
    await delay(300);
    return {
      todayMAD: 420,
      weekMAD: 2850,
      monthMAD: 9400,
      completedJobsCount: 38,
      history: [
        { id: 'earn_1', title: 'Réparation fuite lavabo', date: 'Aujourd’hui 11:30', amountMAD: 120 },
        { id: 'earn_2', title: 'Remplacement mitigeur', date: 'Aujourd’hui 09:15', amountMAD: 180 },
        { id: 'earn_3', title: 'Débouchage douche', date: 'Hier 16:45', amountMAD: 150 },
      ],
    };
  },

  async updateProfile(updates) {
    await delay(350);
    const db = getDb();
    const worker = db.users.find((u) => u.role === 'WORKER');
    if (worker) {
      Object.assign(worker, updates);
    }
    return worker;
  },
};
