// File: src/features/dev/screens/DevMenuScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Code, RefreshCw, Palette, UserCheck, ShieldAlert, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { resetDb } from '../../../core/api/mocks/mockDb';
import { useSettingsStore } from '../../account/store/useSettingsStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useBookingStore } from '../../booking/store/useBookingStore';
import { useOffersStore } from '../../booking/store/useOffersStore';
import { useJobStore } from '../../tracking/store/useJobStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const DevMenuScreen = () => {
  const navigation = useNavigation();
  const { theme, tokens, themeId, setThemeId } = useTheme();
  const { activeMode, setActiveMode, setHasSeenOnboarding } = useSettingsStore();
  const { user, login, logout } = useAuthStore();
  const { reset: resetBooking } = useBookingStore();
  const { reset: resetOffers } = useOffersStore();
  const { reset: resetJob } = useJobStore();

  const handleResetDatabase = () => {
    resetDb();
    resetBooking();
    resetOffers();
    resetJob();
    Alert.alert('Mock Database', 'La base de données mock in-memory a été réinitialisée.');
  };

  const handleToggleMode = async () => {
    const nextMode = activeMode === 'client' ? 'worker' : 'client';
    await setActiveMode(nextMode);
    navigation.goBack();
  };

  const handleToggleTheme = () => {
    setThemeId(themeId === 'tomato' ? 'majorelle' : 'tomato');
  };

  const handleResetOnboarding = async () => {
    await setHasSeenOnboarding(false);
    Alert.alert('Onboarding', 'Flag réinitialisé. Relancez l’app pour revoir le Welcome.');
  };

  const handleFastLogin = async (role = 'CLIENT') => {
    await login({
      phone: role === 'CLIENT' ? '0612345678' : '0661234567',
      password: 'password123',
    });
    Alert.alert('Auth', `Connecté en tant que ${role}`);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="🛠️ Menu Développeur" />
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        <Text style={[styles.sectionTitle, { color: theme.accent }]}>
          Environnement & Simulation
        </Text>

        <TouchableOpacity
          onPress={handleToggleMode}
          style={[styles.item, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <View style={styles.itemLeft}>
            <UserCheck size={20} color={theme.accent} />
            <View>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>Mode Actuel</Text>
              <Text style={[styles.itemSub, { color: theme.textSecondary }]}>
                {activeMode === 'client' ? 'Mode Client' : 'Mode Prestataire (Artisan)'}
              </Text>
            </View>
          </View>
          <Text style={{ color: theme.accent, fontWeight: '700' }}>Basculer ⇄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleTheme}
          style={[styles.item, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <View style={styles.itemLeft}>
            <Palette size={20} color={theme.accent} />
            <View>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>Thème Visuel</Text>
              <Text style={[styles.itemSub, { color: theme.textSecondary }]}>
                {themeId === 'tomato' ? 'Tomato (#EB431C)' : 'Majorelle Night (#FFB300)'}
              </Text>
            </View>
          </View>
          <Text style={{ color: theme.accent, fontWeight: '700' }}>Changer 🎨</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleResetDatabase}
          style={[styles.item, { backgroundColor: theme.surface, borderColor: theme.danger }]}
        >
          <View style={styles.itemLeft}>
            <RefreshCw size={20} color={theme.danger} />
            <View>
              <Text style={[styles.itemTitle, { color: theme.danger }]}>Réinitialiser Mock DB</Text>
              <Text style={[styles.itemSub, { color: theme.textSecondary }]}>
                Efface réservations, offres et messages in-memory
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: theme.accent, marginTop: tokens.Spacing.xl }]}>
          Actions Rapides
        </Text>

        <View style={styles.btnRow}>
          <TouchableOpacity
            onPress={() => handleFastLogin('CLIENT')}
            style={[styles.quickBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
          >
            <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>Login Client</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleFastLogin('WORKER')}
            style={[styles.quickBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
          >
            <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>Login Artisan</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: tokens.Spacing.md }}>
          <PrimaryButton
            title="Revoir Onboarding"
            variant="outline"
            onPress={handleResetOnboarding}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DevMenuScreen;
