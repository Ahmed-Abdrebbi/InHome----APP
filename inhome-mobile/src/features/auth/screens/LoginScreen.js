// File: src/features/auth/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';
import { ROUTES } from '../../../app/navigation/routes';
import { useAuthStore } from '../store/useAuthStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';
import Loader from '../../../shared/components/feedback/Loader';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const { theme, tokens } = useTheme();
  const { login, loading, error } = useAuthStore();

  const [phone, setPhone] = useState('0612345678');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    try {
      await login({ phone, password });
      // Gating automatique via RootNavigator
    } catch (e) {
      // Géré par le store
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={[styles.content, { padding: tokens.Spacing.xl }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary, fontSize: tokens.Typography.fontSize.display }]}>
              {t('auth.login.title')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary, marginTop: tokens.Spacing.sm }]}>
              {t('auth.login.subtitle')}
            </Text>
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: theme.danger + '20', borderColor: theme.danger }]}>
              <Text style={{ color: theme.danger }}>{error}</Text>
            </View>
          ) : null}

          <View style={[styles.form, { marginTop: tokens.Spacing.xxl }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Numéro de téléphone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder={t('auth.login.phonePlaceholder')}
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

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: tokens.Spacing.lg }]}>Mot de passe</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder={t('auth.login.passwordPlaceholder')}
              placeholderTextColor={theme.textDisabled}
              secureTextEntry
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

            <View style={{ marginTop: tokens.Spacing.xxl }}>
              {loading ? (
                <Loader />
              ) : (
                <PrimaryButton title={t('auth.login.submit')} onPress={handleLogin} />
              )}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate(ROUTES.REGISTER)}
              style={[styles.switchLink, { marginTop: tokens.Spacing.xl }]}
            >
              <Text style={{ color: theme.accent, textAlign: 'center', fontWeight: '600' }}>
                {t('auth.login.noAccount')}
              </Text>
            </TouchableOpacity>
          </View>
          {/* TODO(INH-auth): Ajout de la connexion par OTP SMS Twilio/Firebase */}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
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
  switchLink: {
    padding: 12,
  },
});

export default LoginScreen;
