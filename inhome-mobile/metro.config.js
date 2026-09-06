process.env.EXPO_ROUTER_DISABLE_RN_NAVIGATION_CHECK = '1';

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix Windows file watcher timeout issue
config.watcher = {
  ...config.watcher,
  healthCheck: {
    enabled: false,
  },
  watchman: {
    deferStates: ['hg.update'],
  },
};

// Exclude system directories that cause EPERM errors
config.resolver = {
  ...config.resolver,
  blockList: [
    /.*\\AppData\\Local\\ElevatedDiagnostics.*/,
  ],
};

module.exports = config;
