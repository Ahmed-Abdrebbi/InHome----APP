// File: src/app/navigation/ClientStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { useTheme } from '../../core/theme';

// Home & Search
import MapHomeScreen from '../../features/home/screens/MapHomeScreen';
import SearchServiceScreen from '../../features/home/screens/SearchServiceScreen';
import LocationPickerScreen from '../../features/home/screens/LocationPickerScreen';
import MenuDrawerScreen from '../../features/home/screens/MenuDrawerScreen';

// Booking Flow
import ProviderDetailsScreen from '../../features/booking/screens/ProviderDetailsScreen';
import PriceProposalScreen from '../../features/booking/screens/PriceProposalScreen';
import ConfirmationScreen from '../../features/booking/screens/ConfirmationScreen';
import SearchingRadarScreen from '../../features/booking/screens/SearchingRadarScreen';
import OffersListScreen from '../../features/booking/screens/OffersListScreen';
import HistoryScreen from '../../features/booking/screens/HistoryScreen';

// Tracking & Chat
import JobTrackingScreen from '../../features/tracking/screens/JobTrackingScreen';
import ChatScreen from '../../features/chat/screens/ChatScreen';
import RatingScreen from '../../features/rating/screens/RatingScreen';

// AI
import AIChatAssistantScreen from '../../features/ai/screens/AIChatAssistantScreen';

// Account & Settings
import ProfileScreen from '../../features/account/screens/ProfileScreen';
import NotificationsScreen from '../../features/account/screens/NotificationsScreen';
import SavedAddressesScreen from '../../features/account/screens/SavedAddressesScreen';
import SettingsScreen from '../../features/account/screens/SettingsScreen';
import HelpScreen from '../../features/account/screens/HelpScreen';
import WorkerOnboardingScreen from '../../features/worker/screens/WorkerOnboardingScreen';

// Dev
import DevMenuScreen from '../../features/dev/screens/DevMenuScreen';

const Stack = createNativeStackNavigator();

export const ClientStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MAP_HOME}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      {/* Home & Search */}
      <Stack.Screen name={ROUTES.MAP_HOME} component={MapHomeScreen} />
      <Stack.Screen
        name={ROUTES.SEARCH_SERVICE}
        component={SearchServiceScreen}
        options={{ animation: 'fade_from_bottom' }}
      />
      <Stack.Screen
        name={ROUTES.LOCATION_PICKER}
        component={LocationPickerScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name={ROUTES.MENU_DRAWER}
        component={MenuDrawerScreen}
        options={{
          animation: 'slide_from_left',
          presentation: 'transparentModal',
        }}
      />

      {/* Booking Flow Target Order */}
      <Stack.Screen name={ROUTES.PROVIDER_DETAILS} component={ProviderDetailsScreen} />
      <Stack.Screen
        name={ROUTES.PRICE_PROPOSAL}
        component={PriceProposalScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'transparentModal',
        }}
      />
      <Stack.Screen
        name={ROUTES.CONFIRMATION}
        component={ConfirmationScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen
        name={ROUTES.SEARCHING_RADAR}
        component={SearchingRadarScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name={ROUTES.OFFERS_LIST} component={OffersListScreen} />
      <Stack.Screen name={ROUTES.JOB_TRACKING} component={JobTrackingScreen} />
      <Stack.Screen name={ROUTES.HISTORY} component={HistoryScreen} />

      {/* Shared */}
      <Stack.Screen name={ROUTES.CHAT} component={ChatScreen} />
      <Stack.Screen name={ROUTES.RATING} component={RatingScreen} />
      <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
      <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
      <Stack.Screen name={ROUTES.SAVED_ADDRESSES} component={SavedAddressesScreen} />
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={ROUTES.HELP} component={HelpScreen} />
      <Stack.Screen name={ROUTES.WORKER_ONBOARDING} component={WorkerOnboardingScreen} />

      {/* AI */}
      <Stack.Screen
        name={ROUTES.AI_CHAT_ASSISTANT}
        component={AIChatAssistantScreen}
        options={{ animation: 'slide_from_bottom' }}
      />

      {/* Dev Menu */}
      <Stack.Screen
        name={ROUTES.DEV_MENU}
        component={DevMenuScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default ClientStack;
