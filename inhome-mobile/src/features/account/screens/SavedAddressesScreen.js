// File: src/features/account/screens/SavedAddressesScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import EmptyState from '../../../shared/components/feedback/EmptyState';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const SavedAddressesScreen = () => {
  return (
    <ScreenContainer>
      <ScreenHeader title="Adresses enregistrées" />
      <EmptyState
        icon={MapPin}
        message="Aucune adresse enregistrée"
        subtitle="Enregistrez votre domicile ou bureau pour commander plus rapidement."
        action={<PrimaryButton title="Ajouter une adresse" onPress={() => {}} />}
      />
      {/* TODO(INH-account): Gestion des favoris Domicile, Travail, Autre avec labels personnalisés */}
    </ScreenContainer>
  );
};

export default SavedAddressesScreen;
