// File: src/core/api/mocks/messagesMock.js
import { getDb } from './mockDb';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const messagesMock = {
  async getMessages(bookingId) {
    await delay(250);
    const db = getDb();
    if (!db.messages[bookingId]) {
      db.messages[bookingId] = [
        {
          id: 'msg_init',
          bookingId,
          senderId: 'system',
          senderName: 'InHome',
          text: 'La réservation est confirmée. Vous pouvez échanger directement avec votre artisan.',
          createdAt: new Date(Date.now() - 60000).toISOString(),
          isSystem: true,
        },
      ];
    }
    return db.messages[bookingId];
  },

  async sendMessage(bookingId, text, senderId = 'usr_client_1') {
    await delay(200);
    const db = getDb();
    if (!db.messages[bookingId]) {
      db.messages[bookingId] = [];
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      bookingId,
      senderId,
      senderName: senderId === 'usr_client_1' ? 'Client' : 'Artisan',
      text,
      createdAt: new Date().toISOString(),
    };

    db.messages[bookingId].push(newMessage);

    // Auto-reply simulé de l'artisan après 1.5 seconde
    if (senderId === 'usr_client_1') {
      setTimeout(() => {
        const replies = [
          'Salam! Bien reçu, je suis en route avec tout le matériel.',
          'Parfait, je serai chez vous dans une quinzaine de minutes.',
          'D’accord merci. Pourriez-vous me préciser l’étage ou le numéro d’appartement ?',
        ];
        const autoReply = {
          id: `msg_reply_${Date.now()}`,
          bookingId,
          senderId: 'usr_worker_1',
          senderName: 'Youssef (Artisan)',
          text: replies[Math.floor(Math.random() * replies.length)],
          createdAt: new Date().toISOString(),
        };
        db.messages[bookingId].push(autoReply);
      }, 1500);
    }

    return newMessage;
  },
};
