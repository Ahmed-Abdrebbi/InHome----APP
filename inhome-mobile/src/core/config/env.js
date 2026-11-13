// File: src/core/config/env.js
/**
 * Configuration de l'environnement InHome Mobile.
 * NOTE (Real Device): sur un vrai téléphone, n'utilisez JAMAIS localhost.
 * Utilisez l'adresse IP locale de votre PC sur le Wi-Fi (ex: http://192.168.1.50:3000/api).
 */
export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  USE_MOCKS: process.env.EXPO_PUBLIC_USE_MOCKS !== 'false', // Par défaut activé pour le mode démo / MVP
  THEME: process.env.EXPO_PUBLIC_THEME || 'tomato', // 'tomato' | 'majorelle'
  APP_NAME: 'InHome.ma',
  VERSION: '1.0.0',
};

export default ENV;
