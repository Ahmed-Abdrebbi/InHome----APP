// File: src/core/api/mocks/authMock.js
import { getDb } from './mockDb';

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authMock = {
  async login({ phone, password }) {
    await delay(500);
    const db = getDb();
    // Trouve ou simule un utilisateur avec ce téléphone
    let user = db.users.find((u) => u.phone === phone);
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        fullName: 'Utilisateur InHome',
        phone,
        role: 'CLIENT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      };
      db.users.push(user);
    }
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    return { token, user };
  },

  async register({ fullName, phone, role = 'CLIENT' }) {
    await delay(600);
    const db = getDb();
    const user = {
      id: `usr_${Date.now()}`,
      fullName,
      phone,
      role: role.toUpperCase(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    };
    db.users.push(user);
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;
    return { token, user };
  },

  async getMe() {
    await delay(300);
    const db = getDb();
    return db.users[0];
  },
};
