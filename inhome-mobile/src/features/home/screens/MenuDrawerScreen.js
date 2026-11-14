// File: src/features/home/screens/MenuDrawerScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  FileText,
  Clock,
  MapPin,
  Bell,
  Settings,
  Info,
  ChevronRight,
  Star,
  Sparkles,
  Briefcase,
  User,
  LogOut,
} from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { useSettingsStore } from '../../account/store/useSettingsStore';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

const { width } = Dimensions.get('window');

const MenuDrawerScreen = ({ navigation }) => {
  const { theme, tokens } = useTheme();
  const { user, logout } = useAuthStore();
  const { activeMode, setActiveMode } = useSettingsStore();

  const isWorker = user?.role === 'worker' || activeMode === 'worker';

  const menuItems = [
    { icon: Sparkles, label: 'Assistant IA (Diagnostic)', route: ROUTES.AI_CHAT_ASSISTANT, highlight: true },
    { icon: FileText, label: 'Mes demandes', route: ROUTES.HISTORY },
    { icon: Clock, label: 'Historique des interventions', route: ROUTES.HISTORY },
    { icon: MapPin, label: 'Adresses enregistrées', route: ROUTES.SAVED_ADDRESSES },
    { icon: Bell, label: 'Notifications', route: ROUTES.NOTIFICATIONS },
    { divider: true },
    { icon: Settings, label: 'Paramètres', route: ROUTES.SETTINGS },
    { icon: Info, label: 'Aide & Support', route: ROUTES.HELP },
  ];

  const handleClose = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const handleNavigate = (route) => {
    if (navigation && route) {
      navigation.navigate(route);
    }
  };

  const handleModeSwitch = () => {
    if (isWorker) {
      // Toggle back to client mode
      setActiveMode('client');
      navigation.navigate(ROUTES.MAP_HOME);
    } else {
      // Onboard worker or switch to worker mode
      if (user?.role === 'worker') {
        setActiveMode('worker');
        navigation.navigate(ROUTES.WORKER_HOME);
      } else {
        navigation.navigate(ROUTES.WORKER_ONBOARDING);
      }
    }
  };

  const handleDevMenuLongPress = () => {
    if (navigation) {
      navigation.navigate(ROUTES.DEV_MENU);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Drawer Panel */}
      <View
        style={[
          styles.drawer,
          {
            backgroundColor: theme.surfaceElevated || '#1A1D24',
            borderRightColor: theme.border,
          },
        ]}
      >
        {/* Profile Header */}
        <TouchableOpacity
          style={[styles.profileHeader, { borderBottomColor: theme.borderSubtle }]}
          activeOpacity={0.7}
          onPress={() => handleNavigate(ROUTES.PROFILE)}
          onLongPress={handleDevMenuLongPress}
          delayLongPress={600}
        >
          <View style={styles.profileLeft}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.accentMuted || '#332018',
                  borderColor: theme.accent,
                },
              ]}
            >
              <Text style={[styles.avatarText, { color: theme.accent }]}>
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textPrimary }]}>
                {user?.fullName || 'Utilisateur'}
              </Text>
              <View style={styles.ratingRow}>
                <Star size={14} color="#FFB300" fill="#FFB300" />
                <Text style={[styles.ratingText, { color: theme.accent }]}>
                  {user?.rating ? user.rating.toFixed(1) : '5.0'}
                </Text>
                <Text style={{ fontSize: 11, color: theme.textSecondary, marginLeft: 4 }}>
                  ({activeMode === 'worker' ? 'Prestataire' : 'Client'})
                </Text>
              </View>
            </View>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        {/* Menu Items */}
        <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            if (item.divider) {
              return (
                <View
                  key={`divider-${index}`}
                  style={[styles.divider, { backgroundColor: theme.borderSubtle }]}
                />
              );
            }

            const IconComponent = item.icon;
            const iconColor = item.highlight ? theme.accent : theme.textSecondary;

            return (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                activeOpacity={0.6}
                onPress={() => handleNavigate(item.route)}
              >
                <IconComponent size={22} color={iconColor} />
                <Text
                  style={[
                    styles.menuItemText,
                    {
                      color: item.highlight ? theme.accent : theme.textPrimary,
                      fontWeight: item.highlight ? '600' : '400',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Section */}
        <View style={[styles.bottomSection, { borderTopColor: theme.borderSubtle }]}>
          <PrimaryButton
            title={isWorker ? 'Passer en mode Client' : 'Devenir prestataire'}
            onPress={handleModeSwitch}
            style={styles.providerBtn}
          />

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={async () => {
              await logout();
              handleClose();
            }}
          >
            <LogOut size={16} color={theme.textSecondary} />
            <Text style={[styles.logoutText, { color: theme.textSecondary }]}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Close overlay (right 20%) */}
      <TouchableOpacity
        style={styles.closeOverlay}
        onPress={handleClose}
        activeOpacity={1}
      >
        <View style={styles.dimOverlay} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  drawer: {
    width: width * 0.82,
    maxWidth: 380,
    height: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
    borderRightWidth: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    gap: 2,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
  },
  menuList: {
    flex: 1,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 15,
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 20,
    height: 1,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    gap: 14,
  },
  providerBtn: {
    borderRadius: 12,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 13,
  },
  closeOverlay: {
    flex: 1,
  },
  dimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default MenuDrawerScreen;
