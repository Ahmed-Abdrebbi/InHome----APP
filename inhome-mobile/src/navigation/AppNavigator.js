// File: src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Colors from '../theme/colors';

// Onboarding
import SplashScreen from '../screens/onboarding/SplashScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import LocationPermissionScreen from '../screens/onboarding/LocationPermissionScreen';

// Main
import MapHomeScreen from '../screens/main/MapHomeScreen';
import SearchServiceScreen from '../screens/main/SearchServiceScreen';
import MenuDrawerScreen from '../screens/main/MenuDrawerScreen';

// Booking
import ProviderDetailsScreen from '../screens/booking/ProviderDetailsScreen';
import PriceProposalScreen from '../screens/booking/PriceProposalScreen';
import SearchingRadarScreen from '../screens/booking/SearchingRadarScreen';
import ConfirmationScreen from '../screens/booking/ConfirmationScreen';

// AI
import AIChatAssistantScreen from '../screens/ai/AIChatAssistantScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: Colors.background },
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
