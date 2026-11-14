// File: src/features/worker/screens/WorkerOnboardingScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wrench, CheckCircle, Shield } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { SERVICE_CATEGORIES } from '../../../core/config/categories';
import { useSettingsStore } from '../../account/store/useSettingsStore';
import { useWorkerStore } from '../store/useWorkerStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const WorkerOnboardingScreen = () => {
  const navigation = useNavigation();
  const { theme, tokens } = useTheme();
  const { setActiveMode } = useSettingsStore();
  const { loadProfile } = useWorkerStore();

  const [selectedCategory, setSelectedCategory] = useState('plomberie');

  const handleStartWorkerMode = async () => {
    await setActiveMode('worker');
    await loadProfile();
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Devenir Prestataire InHome" />
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Rejoignez le réseau des meilleurs artisans du Maroc
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, marginTop: tokens.Spacing.sm }]}>
          Choisissez votre métier principal et commencez à recevoir des demandes de clients autour de vous.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: tokens.Spacing.xl, marginBottom: tokens.Spacing.md }]}>
          Votre métier principal :
        </Text>

        <View style={styles.grid}>
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.catItem,
                  {
                    backgroundColor: isSelected ? theme.accent + '25' : theme.surface,
                    borderColor: isSelected ? theme.accent : theme.border,
                    borderRadius: tokens.Radius.md,
                    padding: tokens.Spacing.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.catName,
                    { color: isSelected ? theme.accent : theme.textPrimary },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: tokens.Spacing.xxl }}>
          <PrimaryButton title="Activer mon Mode Prestataire" onPress={handleStartWorkerMode} />
        </View>
        {/* TODO(INH-worker): Upload pièces justificatives (CIN + Registre de commerce ou Carte d'artisan) */}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catItem: {
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default WorkerOnboardingScreen;
