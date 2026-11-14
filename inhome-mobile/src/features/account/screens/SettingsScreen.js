// File: src/features/account/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Globe, Palette, Shield } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { useSettingsStore } from '../store/useSettingsStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';

export const SettingsScreen = () => {
  const { theme, tokens, themeId, setThemeId } = useTheme();
  const { language, setLanguage } = useSettingsStore();

  const toggleTheme = () => {
    setThemeId(themeId === 'tomato' ? 'majorelle' : 'tomato');
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Paramètres" />
      <View style={{ padding: tokens.Spacing.lg }}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.row,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: tokens.Radius.md,
              padding: tokens.Spacing.lg,
              marginBottom: tokens.Spacing.md,
            },
          ]}
        >
          <View style={styles.left}>
            <Palette size={20} color={theme.accent} />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Thème visuel</Text>
          </View>
          <Text style={[styles.value, { color: theme.textSecondary }]}>
            {themeId === 'tomato' ? 'Tomato (Original)' : 'Majorelle Night'}
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.row,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: tokens.Radius.md,
              padding: tokens.Spacing.lg,
            },
          ]}
        >
          <View style={styles.left}>
            <Globe size={20} color={theme.accent} />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Langue de l'application</Text>
          </View>
          <Text style={[styles.value, { color: theme.textSecondary }]}>
            {language === 'fr' ? 'Français' : 'العربية'}
          </Text>
        </View>
        {/* TODO(INH-settings): Support complet du RTL pour la langue arabe */}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SettingsScreen;
