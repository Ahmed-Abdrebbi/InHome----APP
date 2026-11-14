// File: src/app/navigation/OnboardingStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { useTheme } from '../../core/theme';

import WelcomeScreen from '../../features/onboarding/screens/WelcomeScreen';
import LocationPermissionScreen from '../../features/onboarding/screens/LocationPermissionScreen';

const Stack = createNativeStackNavigator();

export const OnboardingStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.WELCOME}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={ROUTES.WELCOME} component={WelcomeScreen} />
      <Stack.Screen
        name={ROUTES.LOCATION_PERMISSION}
        component={LocationPermissionScreen}
      />
    </Stack.Navigator>
  );
};

export default OnboardingStack;
