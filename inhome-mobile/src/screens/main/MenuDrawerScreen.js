// File: src/screens/main/MenuDrawerScreen.js
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
  Bookmark,
  MapPin,
  Bell,
  Shield,
  Settings,
  Info,
  MessageCircle,
  ChevronRight,
  Star,
  Camera,
  Music,
  Users,
} from 'lucide-react-native';
import Colors from '../../theme/colors';
import PrimaryButton from '../../components/UI/PrimaryButton';

const { width } = Dimensions.get('window');

/**
 * Side drawer navigation matching the Stitch "Menu de navigation" design.
 * 80% width drawer with:
 *  - User profile header with avatar, name, rating
 *  - Navigation menu items with icons
 *  - "Devenir prestataire" CTA
 *  - Social media icons at bottom
 *  - Dimmed right overlay for closing
 */
const MenuDrawerScreen = ({ navigation }) => {
  const menuItems = [
    { icon: FileText, label: 'Mes demandes', key: 'requests' },
    { icon: Clock, label: 'Historique', key: 'history' },
    { icon: Bookmark, label: 'Prestataires favoris', key: 'favorites' },
    { icon: MapPin, label: 'Adresses enregistrées', key: 'addresses' },
    { icon: Bell, label: 'Notifications', key: 'notifications' },
    { divider: true },
    { icon: Shield, label: 'Sécurité', key: 'security' },
    { icon: Settings, label: 'Paramètres', key: 'settings' },
    { icon: Info, label: 'Aide', key: 'help' },
    { icon: MessageCircle, label: 'Support', key: 'support' },
  ];

  const handleClose = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Drawer Panel */}
      <View style={styles.drawer}>
        {/* Profile Header */}
        <TouchableOpacity
          style={styles.profileHeader}
          activeOpacity={0.7}
        >
          <View style={styles.profileLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Ahmed</Text>
              <View style={styles.ratingRow}>
                <Star
                  size={14}
                  color={Colors.accent}
                  fill={Colors.accent}
                />
                <Text style={styles.ratingText}>5,0</Text>
              </View>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.outline} />
        </TouchableOpacity>

        {/* Menu Items */}
        <ScrollView
          style={styles.menuList}
          showsVerticalScrollIndicator={false}
        >
          {menuItems.map((item, index) => {
            if (item.divider) {
              return (
                <View key={`divider-${index}`} style={styles.divider} />
              );
            }

            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.key}
                style={styles.menuItem}
                activeOpacity={0.6}
              >
                <IconComponent
                  size={22}
                  color={Colors.outline}
                />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Devenir prestataire"
            onPress={() => {}}
            style={styles.providerBtn}
          />

          {/* Social Icons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <MessageCircle size={22} color={Colors.outline} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Camera size={22} color={Colors.outline} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Users size={22} color={Colors.outline} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Music size={22} color={Colors.outline} />
            </TouchableOpacity>
          </View>
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
    backgroundColor: Colors.transparent,
  },
  drawer: {
    width: width * 0.8,
    maxWidth: 380,
    height: '100%',
    backgroundColor: Colors.primaryContainer,
    shadowColor: Colors.black,
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
    borderRightWidth: 1,
    borderRightColor: Colors.surfaceContainerHigh,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceContainerHigh,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 2,
    borderColor: Colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  profileInfo: {
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    color: Colors.onBackground,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.accent,
  },
  menuList: {
    flex: 1,
    paddingVertical: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.onBackground,
  },
  divider: {
    marginVertical: 8,
    marginHorizontal: 24,
    height: 1,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
    gap: 24,
  },
  providerBtn: {
    borderRadius: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeOverlay: {
    flex: 1,
  },
  dimOverlay: {
    flex: 1,
    backgroundColor: `${Colors.black}99`,
  },
});

export default MenuDrawerScreen;
