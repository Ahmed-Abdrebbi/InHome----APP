// File: src/features/account/screens/NotificationsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import EmptyState from '../../../shared/components/feedback/EmptyState';

export const NotificationsScreen = () => {
  return (
    <ScreenContainer>
      <ScreenHeader title="Notifications" />
      <EmptyState
        icon={Bell}
        message="Aucune notification"
        subtitle="Vous recevrez ici les alertes concernant l'avancement de vos demandes et les contre-offres."
      />
      {/* TODO(INH-notifications): Historique des push notifications et filtres d'alertes */}
    </ScreenContainer>
  );
};

export default NotificationsScreen;
