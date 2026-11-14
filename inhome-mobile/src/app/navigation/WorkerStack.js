// File: src/app/navigation/WorkerStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import { useTheme } from '../../core/theme';

// Worker Screens
import WorkerHomeScreen from '../../features/worker/screens/WorkerHomeScreen';
import WorkerRequestDetailScreen from '../../features/worker/screens/WorkerRequestDetailScreen';
import SendOfferScreen from '../../features/worker/screens/SendOfferScreen';
import ActiveJobScreen from '../../features/worker/screens/ActiveJobScreen';
import WorkerEarningsScreen from '../../features/worker/screens/WorkerEarningsScreen';
import WorkerProfileScreen from '../../features/worker/screens/WorkerProfileScreen';

// Shared Screens
import ChatScreen from '../../features/chat/screens/ChatScreen';
import RatingScreen from '../../features/rating/screens/RatingScreen';
import SettingsScreen from '../../features/account/screens/SettingsScreen';
import HelpScreen from '../../features/account/screens/HelpScreen';
import NotificationsScreen from '../../features/account/screens/NotificationsScreen';

// Dev
import DevMenuScreen from '../../features/dev/screens/DevMenuScreen';

const Stack = createNativeStackNavigator();

export const WorkerStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.WORKER_HOME}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name={ROUTES.WORKER_HOME} component={WorkerHomeScreen} />
      <Stack.Screen
        name={ROUTES.WORKER_REQUEST_DETAIL}
        component={WorkerRequestDetailScreen}
      />
      <Stack.Screen
        name={ROUTES.SEND_OFFER}
        component={SendOfferScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen name={ROUTES.ACTIVE_JOB} component={ActiveJobScreen} />
      <Stack.Screen name={ROUTES.WORKER_EARNINGS} component={WorkerEarningsScreen} />
      <Stack.Screen name={ROUTES.WORKER_PROFILE} component={WorkerProfileScreen} />

      {/* Shared */}
      <Stack.Screen name={ROUTES.CHAT} component={ChatScreen} />
      <Stack.Screen name={ROUTES.RATING} component={RatingScreen} />
      <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} />
      <Stack.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
      <Stack.Screen name={ROUTES.HELP} component={HelpScreen} />

      {/* Dev Menu */}
      <Stack.Screen
        name={ROUTES.DEV_MENU}
        component={DevMenuScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

export default WorkerStack;
