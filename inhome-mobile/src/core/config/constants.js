// File: src/core/config/constants.js
/**
 * Constantes globales de l'application InHome.ma
 */
export const DEFAULT_CITY = {
  name: 'Casablanca',
  latitude: 33.5731,
  longitude: -7.5898,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const GEO_CONFIG = {
  DEFAULT_RADIUS_KM: 10,
  MAX_RADIUS_KM: 30,
  LOCATION_TIMEOUT_MS: 15000,
};

export const POLLING_INTERVALS = {
  SEARCHING_RADAR_MS: 3000,
  OFFERS_REFRESH_MS: 4000,
  JOB_TRACKING_MS: 5000,
  CHAT_MESSAGES_MS: 3000,
};

export const CURRENCY = {
  CODE: 'MAD',
  SYMBOL: 'DH',
  FORMAT: 'DH %s',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'inhome_auth_token',
  USER_DATA: 'inhome_user_data',
  SETTINGS: 'inhome_settings',
  ACTIVE_MODE: 'inhome_active_mode', // 'client' | 'worker'
  HAS_SEEN_ONBOARDING: 'inhome_has_seen_onboarding',
};

export const TIMEOUTS = {
  SEARCHING_MAX_SECONDS: 60,
  AUTO_NAV_SPLASH_MS: 1200,
};
