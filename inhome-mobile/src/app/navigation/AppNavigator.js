// File: src/app/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import legacyColors from '../../core/theme/legacyColors';

// Onboarding
import SplashScreen from '../../features/onboarding/screens/SplashScreen';
import WelcomeScreen from '../../features/onboarding/screens/WelcomeScreen';
import LocationPermissionScreen from '../../features/onboarding/screens/LocationPermissionScreen';

// Main / Home
import MapHomeScreen from '../../features/home/screens/MapHomeScreen';
import SearchServiceScreen from '../../features/home/screens/SearchServiceScreen';
import MenuDrawerScreen from '../../features/home/screens/MenuDrawerScreen';

// Booking
import ProviderDetailsScreen from '../../features/booking/screens/ProviderDetailsScreen';
import PriceProposalScreen from '../../features/booking/screens/PriceProposalScreen';
import SearchingRadarScreen from '../../features/booking/screens/SearchingRadarScreen';
import ConfirmationScreen from '../../features/booking/screens/ConfirmationScreen';

// AI
import AIChatAssistantScreen from '../../features/ai/screens/AIChatAssistantScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: legacyColors.background },
  animation: 'slide_from_right',
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={screenOptions}
      >
        {/* Onboarding */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="LocationPermission"
          component={LocationPermissionScreen}
        />

        {/* Main */}
        <Stack.Screen name="MapHome" component={MapHomeScreen} />
        <Stack.Screen
          name="SearchService"
          component={SearchServiceScreen}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen
          name="MenuDrawer"
          component={MenuDrawerScreen}
          options={{
            animation: 'slide_from_left',
            presentation: 'transparentModal',
          }}
        />

        {/* Booking */}
        <Stack.Screen
          name="ProviderDetails"
          component={ProviderDetailsScreen}
        />
        <Stack.Screen
          name="PriceProposal"
          component={PriceProposalScreen}
          options={{
            animation: 'slide_from_bottom',
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="SearchingRadar"
          component={SearchingRadarScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{ animation: 'fade' }}
        />

        {/* AI Assistant */}
        <Stack.Screen
          name="AIChatAssistant"
          component={AIChatAssistantScreen}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
