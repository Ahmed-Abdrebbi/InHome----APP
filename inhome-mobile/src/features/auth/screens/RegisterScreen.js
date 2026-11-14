// File: src/features/auth/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';
import { ROUTES } from '../../../app/navigation/routes';
import { useAuthStore } from '../store/useAuthStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';
import Loader from '../../../shared/components/feedback/Loader';

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const { theme, tokens } = useTheme();
  const { register, loading, error } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('CLIENT'); // 'CLIENT' | 'WORKER'

  const handleRegister = async () => {
    try {
      await register({
        fullName: fullName || 'Nouvel Utilisateur',
        phone: phone || '0600000000',
        role,
      });
    } catch (e) {
      // Géré par le store
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t('auth.register.title')} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={[styles.content, { padding: tokens.Spacing.xl }]}>
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: theme.danger + '20', borderColor: theme.danger }]}>
              <Text style={{ color: theme.danger }}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>{t('auth.register.fullName')}</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ex: Youssef El Amrani"
              placeholderTextColor={theme.textDisabled}
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  borderRadius: tokens.Radius.md,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: tokens.Spacing.lg }]}>
              Numéro de téléphone (+212)
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="06 XX XX XX XX"
              placeholderTextColor={theme.textDisabled}
              keyboardType="phone-pad"
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  borderRadius: tokens.Radius.md,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: tokens.Spacing.lg }]}>
              Je souhaite m'inscrire en tant que :
            </Text>
            <View style={styles.roleRow}>
              <TouchableOpacity
                onPress={() => setRole('CLIENT')}
                style={[
                  styles.roleBtn,
                  {
                    borderColor: role === 'CLIENT' ? theme.accent : theme.border,
                    backgroundColor: role === 'CLIENT' ? theme.accent + '20' : theme.surface,
                    borderRadius: tokens.Radius.md,
                  },
                ]}
              >
                <Text style={{ color: role === 'CLIENT' ? theme.accent : theme.textPrimary, fontWeight: '700' }}>
                  {t('auth.register.roleClient')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole('WORKER')}
                style={[
                  styles.roleBtn,
                  {
                    borderColor: role === 'WORKER' ? theme.accent : theme.border,
                    backgroundColor: role === 'WORKER' ? theme.accent + '20' : theme.surface,
                    borderRadius: tokens.Radius.md,
                  },
                ]}
              >
                <Text style={{ color: role === 'WORKER' ? theme.accent : theme.textPrimary, fontWeight: '700' }}>
                  {t('auth.register.roleWorker')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: tokens.Spacing.xxl }}>
              {loading ? (
                <Loader />
              ) : (
                <PrimaryButton title={t('auth.register.submit')} onPress={handleRegister} />
              )}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.LOGIN)}
              style={[styles.switchLink, { marginTop: tokens.Spacing.xl }]}
            >
              <Text style={{ color: theme.accent, textAlign: 'center', fontWeight: '600' }}>
                {t('auth.register.hasAccount')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* TODO(INH-auth): Ajout du upload photo CIN pour validation artisan */}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: 16,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    height: 52,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchLink: {
    padding: 12,
  },
});

export default RegisterScreen;
