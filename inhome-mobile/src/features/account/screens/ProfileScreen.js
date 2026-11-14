// File: src/features/account/screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { User, Phone, Mail, LogOut } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { useAuthStore } from '../../auth/store/useAuthStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const ProfileScreen = () => {
  const { theme, tokens } = useTheme();
  const { user, logout } = useAuthStore();

  return (
    <ScreenContainer>
      <ScreenHeader title="Mon Profil" />
      <View style={[styles.content, { padding: tokens.Spacing.xl }]}>
        <View style={styles.centerBlock}>
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
            }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: theme.textPrimary, marginTop: tokens.Spacing.md }]}>
            {user?.fullName || 'Utilisateur InHome'}
          </Text>
          <Text style={[styles.roleBadge, { color: theme.accent }]}>
            Compte {user?.role || 'CLIENT'}
          </Text>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: tokens.Radius.lg,
              padding: tokens.Spacing.lg,
              marginTop: tokens.Spacing.xl,
            },
          ]}
        >
          <View style={styles.row}>
            <Phone size={18} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.textPrimary }]}>
              {user?.phone || '+212 6 12 34 56 78'}
            </Text>
          </View>
          <View style={[styles.row, { borderTopColor: theme.borderSubtle, borderTopWidth: 1, marginTop: tokens.Spacing.md, paddingTop: tokens.Spacing.md }]}>
            <Mail size={18} color={theme.textSecondary} />
            <Text style={[styles.infoText, { color: theme.textPrimary }]}>
              {user?.email || 'contact@inhome.ma'}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: tokens.Spacing.xxl }}>
          <PrimaryButton
            title="Se déconnecter"
            variant="outline"
            onPress={logout}
          />
        </View>
        {/* TODO(INH-profile): Modification de la photo de profil via expo-image-picker */}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  centerBlock: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
  },
  roleBadge: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  card: {
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ProfileScreen;
