// File: src/app/navigation/routes.js
/**
 * Constantes des noms de routes de navigation InHome.ma
 * ATTENTION: Les noms existants sont scrupuleusement conservés pour éviter toute régression.
 */
export const ROUTES = {
  // Stacks
  ONBOARDING_STACK: 'OnboardingStack',
  AUTH_STACK: 'AuthStack',
  CLIENT_STACK: 'ClientStack',
  WORKER_STACK: 'WorkerStack',

  // Onboarding
  SPLASH: 'Splash',
  WELCOME: 'Welcome',
  LOCATION_PERMISSION: 'LocationPermission',

  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',

  // Client Flow
  MAP_HOME: 'MapHome',
  SEARCH_SERVICE: 'SearchService',
  LOCATION_PICKER: 'LocationPicker',
  MENU_DRAWER: 'MenuDrawer',
  PROVIDER_DETAILS: 'ProviderDetails',
  PRICE_PROPOSAL: 'PriceProposal',
  CONFIRMATION: 'Confirmation',
  SEARCHING_RADAR: 'SearchingRadar',
  OFFERS_LIST: 'OffersList',
  JOB_TRACKING: 'JobTracking',
  HISTORY: 'History',
  AI_CHAT_ASSISTANT: 'AIChatAssistant',

  // Worker Flow
  WORKER_HOME: 'WorkerHome',
  WORKER_REQUEST_DETAIL: 'WorkerRequestDetail',
  SEND_OFFER: 'SendOffer',
  ACTIVE_JOB: 'ActiveJob',
  WORKER_EARNINGS: 'WorkerEarnings',
  WORKER_PROFILE: 'WorkerProfile',
  WORKER_ONBOARDING: 'WorkerOnboarding',

  // Shared Screens
  CHAT: 'Chat',
  RATING: 'Rating',
  PROFILE: 'Profile',
  NOTIFICATIONS: 'Notifications',
  SAVED_ADDRESSES: 'SavedAddresses',
  SETTINGS: 'Settings',
  HELP: 'Help',

  // Dev
  DEV_MENU: 'DevMenu',
};

export default ROUTES;
