// File: src/app/navigation/RootNavigator.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './navigationRef';
import { linking } from './linking';
import { TIMEOUTS } from '../../core/config/constants';

// Stores
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import { useSettingsStore } from '../../features/account/store/useSettingsStore';

// Stacks
import OnboardingStack from './OnboardingStack';
import AuthStack from './AuthStack';
import ClientStack from './ClientStack';
import WorkerStack from './WorkerStack';

// Splash boot screen
import SplashScreen from '../../features/onboarding/screens/SplashScreen';

export const RootNavigator = () => {
  const { status: authStatus, hydrate: hydrateAuth } = useAuthStore();
  const { hasSeenOnboarding, activeMode, isHydrated: settingsHydrated, hydrate: hydrateSettings } =
    useSettingsStore();

  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const initApp = async () => {
      const startTime = Date.now();

      await Promise.all([hydrateAuth(), hydrateSettings()]);

      // Garantit au moins 1.2s de SplashScreen pour un boot fluide
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, TIMEOUTS.AUTO_NAV_SPLASH_MS - elapsed);

      setTimeout(() => {
        if (isMounted) {
          setBootReady(true);
        }
      }, remainingTime);
    };

    initApp();

    return () => {
      isMounted = false;
    };
  }, [hydrateAuth, hydrateSettings]);

  // Étape 1 : Pendant l'hydratation, afficher le SplashScreen comme pur boot screen
  if (!bootReady || !settingsHydrated || authStatus === 'loading') {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {/* Étape 2 : Si l'utilisateur n'a jamais vu l'onboarding */}
      {!hasSeenOnboarding ? (
        <OnboardingStack />
      ) : /* Étape 3 : Si non connecté */
      authStatus !== 'signedIn' ? (
        <AuthStack />
      ) : /* Étape 4 : Selon le mode sélectionné */
      activeMode === 'worker' ? (
        <WorkerStack />
      ) : (
        <ClientStack />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
