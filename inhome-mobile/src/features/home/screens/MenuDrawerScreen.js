import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Image,
  Animated,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Polygon, Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.82;

const AVATAR_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBeySaHOdHURVcJ7mO-Y4AUbLGFOMzNzNnarHcrN1QG4B_5pH43fv0PAUOo05XV18QRtaZ-oYYGgTRk-iu3YFqB89EkC93Um_1tHEQ6JQj7KKT3PuARyFmX3ZMzMeZBFkHFfu-g2qAN2CqGyvNrj_ZLYQgTgx_OWkmsEDClBf3sI7v5AkXygECLBWkEenE2Nt8LUis7Mu8MHtH9jOWdgbcqIGGHK90M8T91xxznx_Zp';

const MENU_ITEMS = [
  {
    key: 'offers',
    label: 'Mes demandes',
    icon: 'assignment',
    route: 'OffersList',
    badgeType: 'pill',
    badgeText: '2 en cours',
  },
  {
    key: 'history',
    label: 'Historique',
    icon: 'history',
    route: 'History',
  },
  {
    key: 'favorites',
    label: 'Prestataires favoris',
    icon: 'favorite',
    route: 'Favorites',
    badgeType: 'text',
    badgeText: '4 saved',
  },
  {
    key: 'addresses',
    label: 'Adresses enregistrées',
    icon: 'location-on',
    route: 'SavedAddresses',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: 'notifications',
    route: 'Notifications',
    hasUnreadDot: true,
  },
  {
    key: 'security',
    label: 'Sécurité',
    icon: 'shield',
    route: 'Settings',
  },
  {
    key: 'settings',
    label: 'Paramètres',
    icon: 'settings',
    route: 'Settings',
  },
  {
    key: 'help',
    label: 'Aide',
    icon: 'help',
    route: 'Help',
  },
  {
    key: 'support',
    label: 'Support',
    icon: 'support-agent',
    route: 'Help',
    badgeType: 'tag',
    badgeText: '24/7',
  },
];

export default function MenuDrawerScreen({
  navigation,
  onClose,
  userName = 'Ahmed',
  userRating = '5,0',
  initialActiveKey = 'offers',
}) {
  const { colors } = majorelleTheme;
  const [activeKey, setActiveKey] = useState(initialActiveKey);
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 24,
        stiffness: 220,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, backdropOpacity]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (typeof onClose === 'function') {
        onClose();
      } else if (navigation?.canGoBack?.()) {
        navigation.goBack();
      }
    });
  };

  const handleMenuPress = (item) => {
    setActiveKey(item.key);
    if (navigation?.navigate && item.route) {
      navigation.navigate(item.route);
    }
  };

  const handleBecomeWorker = () => {
    if (navigation?.navigate) {
      navigation.navigate('WorkerOnboarding');
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surfaceContainerLowest }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Map Underlay Layer (Visible on right 18% and beneath scrim) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.surfaceContainerLowest },
          ]}
        />

        {/* Ambient Road Vector Network (Casablanca Dark Grid) */}
        <Svg width="100%" height="100%" style={styles.mapVectorLayer}>
          <Path
            d="M-20 180 C 140 160, 260 260, 440 220"
            fill="none"
            stroke="#161E3C"
            strokeLinecap="round"
            strokeWidth="12"
          />
          <Path
            d="M310 0 L 290 850"
            fill="none"
            stroke="#161E3C"
            strokeWidth="14"
          />
          <Path
            d="M220 340 L 420 520"
            fill="none"
            stroke="#161E3C"
            strokeWidth="6"
          />
          <Path
            d="M0 600 C 120 580, 280 650, 430 710"
            fill="none"
            stroke="#161E3C"
            strokeWidth="9"
          />
        </Svg>

        {/* Glowing Service Map Pin Visible in Right Map Slice */}
        <View style={styles.mapPinTopRight}>
          <View style={styles.mapPinTealHalo} />
          <View style={styles.mapPinTealCircle}>
            <MaterialIcons name="build" size={14} color="#63F4E0" />
          </View>
        </View>

        {/* Secondary Artisan Pin */}
        <View style={styles.mapPinLowerRight}>
          <View style={styles.mapPinSaffronCircle}>
            <MaterialIcons name="bolt" size={13} color="#FFB300" />
          </View>
        </View>
      </View>

      {/* 2. Dark Scrim Over Exposed Map Slice */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.backdropScrim,
          { opacity: backdropOpacity },
        ]}
        pointerEvents="none"
      />

      {/* 3. 82% Width Side Drawer Container */}
      <Animated.View
        style={[
          styles.drawerContainer,
          {
            width: DRAWER_WIDTH,
            backgroundColor: colors.surfaceContainerLowest,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {/* Subtle Moroccan 8-Point Zellige Star Watermark (~3.8% opacity) */}
        <View style={styles.zelligeWatermark} pointerEvents="none">
          <Svg width={420} height={420} viewBox="0 0 200 200">
            <Polygon
              points="100,0 128,68 200,68 144,112 168,180 100,138 32,180 56,112 0,68 72,68"
              fill="#FFD79B"
            />
            <Polygon
              points="100,200 128,132 200,132 144,88 168,20 100,62 32,20 56,88 0,132 72,132"
              fill="#FFD79B"
              transform="rotate(45 100 100)"
            />
            <Circle
              cx="100"
              cy="100"
              r="30"
              fill="none"
              stroke="#FFD79B"
              strokeWidth="4"
            />
            <Polygon
              points="100,30 115,75 160,75 125,100 140,145 100,120 60,145 75,100 40,75 85,75"
              fill="none"
              stroke="#FFD79B"
              strokeWidth="2"
            />
          </Svg>
        </View>

        <SafeAreaView style={styles.drawerSafeArea} edges={['top', 'bottom']}>
          {/* Scrollable Content Wrap */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Drawer Header: User Profile Block */}
            <View style={styles.profileSection}>
              <Pressable
                onPress={() => navigation?.navigate?.('Profile')}
                style={({ pressed }) => [
                  styles.profileCard,
                  pressed && styles.profileCardPressed,
                ]}
              >
                <View style={styles.profileLeft}>
                  {/* Avatar with Saffron 2px Accent Ring */}
                  <View style={styles.avatarRing}>
                    <Image
                      source={{ uri: AVATAR_URI }}
                      style={styles.avatarImage}
                    />
                    <View style={styles.onlineDot} />
                  </View>

                  {/* Name & Rating */}
                  <View style={styles.profileMeta}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {userName}
                    </Text>
                    <View style={styles.ratingRow}>
                      <MaterialIcons name="star" size={13} color="#FFB300" />
                      <Text style={styles.ratingValue}>{userRating}</Text>
                      <Text style={styles.verifiedTag}>Client vérifié</Text>
                    </View>
                  </View>
                </View>

                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color="#BDC2FF"
                />
              </Pressable>
            </View>

            {/* Subtle Section Separation */}
            <View style={styles.divider} />

            {/* Navigation Menu List (9 Items) */}
            <View style={styles.navList}>
              {MENU_ITEMS.map((item) => {
                const isActive = activeKey === item.key;

                return (
                  <Pressable
                    key={item.key}
                    onPress={() => handleMenuPress(item)}
                    style={({ pressed }) => [
                      styles.navItem,
                      isActive && styles.navItemActive,
                      !isActive && pressed && styles.navItemPressed,
                    ]}
                  >
                    {/* Active 4px Vertical Saffron Bar */}
                    {isActive && <View style={styles.activeIndicatorBar} />}

                    <View
                      style={[
                        styles.navItemLeft,
                        isActive && { marginLeft: 6 },
                      ]}
                    >
                      <View style={styles.iconContainer}>
                        <MaterialIcons
                          name={item.icon}
                          size={20}
                          color={isActive ? '#FFB300' : '#BDC2FF'}
                        />
                        {item.hasUnreadDot && (
                          <View style={styles.iconUnreadDot} />
                        )}
                      </View>

                      <Text
                        style={[
                          styles.navLabel,
                          isActive && styles.navLabelActive,
                        ]}
                        numberOfLines={1}
                      >
                        {item.label}
                      </Text>
                    </View>

                    {/* Right Badges */}
                    {item.badgeType === 'pill' && (
                      <View style={styles.saffronPillBadge}>
                        <Text style={styles.saffronPillText}>
                          {item.badgeText}
                        </Text>
                      </View>
                    )}

                    {item.badgeType === 'text' && (
                      <Text style={styles.savedCountText}>
                        {item.badgeText}
                      </Text>
                    )}

                    {item.hasUnreadDot && (
                      <View style={styles.rightTealDot} />
                    )}

                    {item.badgeType === 'tag' && (
                      <View style={styles.supportTag}>
                        <Text style={styles.supportTagText}>
                          {item.badgeText}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          {/* Drawer Bottom Section */}
          <LinearGradient
            colors={[
              'rgba(4, 11, 42, 0)',
              'rgba(4, 11, 42, 0.96)',
              '#040B2A',
            ]}
            locations={[0, 0.25, 1]}
            style={styles.bottomSection}
          >
            {/* Radiant Saffron Primary CTA: "Devenir prestataire" */}
            <Pressable
              onPress={handleBecomeWorker}
              style={({ pressed }) => [
                styles.workerCtaButton,
                pressed && styles.workerCtaPressed,
              ]}
            >
              <MaterialIcons name="handyman" size={20} color="#432C00" />
              <Text style={styles.workerCtaText}>Devenir prestataire</Text>
            </Pressable>

            {/* Social Media Channels & App Version Signature */}
            <View style={styles.footerInfo}>
              <View style={styles.socialRow}>
                <Pressable
                  onPress={() => Linking.openURL('https://wa.me/212600000000').catch(() => {})}
                  style={styles.socialCircle}
                >
                  <MaterialIcons name="chat" size={17} color="#BDC2FF" />
                </Pressable>
                <Pressable
                  onPress={() => Linking.openURL('https://instagram.com').catch(() => {})}
                  style={styles.socialCircle}
                >
                  <MaterialIcons name="photo-camera" size={17} color="#BDC2FF" />
                </Pressable>
                <Pressable
                  onPress={() => Linking.openURL('https://inhome.ma').catch(() => {})}
                  style={styles.socialCircle}
                >
                  <MaterialIcons name="public" size={17} color="#BDC2FF" />
                </Pressable>
                <Pressable
                  onPress={() => navigation?.navigate?.('Help')}
                  style={styles.socialCircle}
                >
                  <MaterialIcons name="forum" size={17} color="#BDC2FF" />
                </Pressable>
              </View>

              <View style={styles.legalRow}>
                <Text style={styles.legalText}>InHome.ma v1.2</Text>
                <Text style={styles.legalText}>•</Text>
                <View style={styles.countryTag}>
                  <Text style={styles.legalText}>Maroc</Text>
                  <View style={styles.moroccoTealDot} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </SafeAreaView>
      </Animated.View>

      {/* 4. Dismiss Tap Cue on Exposed 18% Right Map Strip */}
      <Pressable
        onPress={handleDismiss}
        style={styles.dismissStrip}
        accessibilityLabel="Fermer le menu"
      >
        <View style={styles.dismissHandlePill} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  mapVectorLayer: {
    opacity: 0.45,
  },
  mapPinTopRight: {
    position: 'absolute',
    top: 176,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinTealHalo: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(99, 244, 224, 0.25)',
  },
  mapPinTealCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  mapPinLowerRight: {
    position: 'absolute',
    top: 410,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinSaffronCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdropScrim: {
    backgroundColor: 'rgba(4, 11, 42, 0.72)',
  },
  // 82% Side Drawer
  drawerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 20,
    overflow: 'hidden',
    shadowColor: '#040B2A',
    shadowOffset: { width: 16, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 32,
    elevation: 24,
  },
  zelligeWatermark: {
    position: 'absolute',
    top: -40,
    left: -76,
    opacity: 0.038,
  },
  drawerSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollArea: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  // User Profile Card
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#121A38',
  },
  profileCardPressed: {
    backgroundColor: '#161E3C',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  avatarRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 2,
    backgroundColor: '#FFB300',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: '#212847',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3FD7C4',
    borderWidth: 2,
    borderColor: '#040B2A',
  },
  profileMeta: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingValue: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#FFB300',
  },
  verifiedTag: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(189, 194, 255, 0.7)',
    marginLeft: 4,
  },
  divider: {
    marginHorizontal: 20,
    height: 1,
    backgroundColor: 'rgba(44, 51, 82, 0.6)',
    marginBottom: 8,
  },
  // Menu Navigation List
  navList: {
    paddingHorizontal: 8,
    gap: 2,
  },
  navItem: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  navItemActive: {
    backgroundColor: '#161E3C',
  },
  navItemPressed: {
    backgroundColor: '#121A38',
  },
  activeIndicatorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FFB300',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  navItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  iconContainer: {
    position: 'relative',
  },
  iconUnreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#63F4E0',
    borderWidth: 1.5,
    borderColor: '#040B2A',
  },
  navLabel: {
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: '#DDE1FF',
    flexShrink: 1,
  },
  navLabelActive: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#DDE1FF',
  },
  saffronPillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
  },
  saffronPillText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#FFB300',
  },
  savedCountText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(189, 194, 255, 0.6)',
  },
  rightTealDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#63F4E0',
  },
  supportTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#212847',
  },
  supportTagText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: '#BDC2FF',
  },
  // Bottom Section
  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    zIndex: 10,
    gap: 14,
  },
  workerCtaButton: {
    height: 56,
    width: '100%',
    borderRadius: 9999,
    backgroundColor: '#FFB300',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 8,
  },
  workerCtaPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#FFBA38',
  },
  workerCtaText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#432C00',
  },
  footerInfo: {
    alignItems: 'center',
    gap: 10,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    opacity: 0.75,
  },
  socialCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#121A38',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.5,
  },
  legalText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: '#BDC2FF',
  },
  countryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moroccoTealDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3FD7C4',
  },
  // Right 18% Dismiss Tap Strip
  dismissStrip: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '18%',
    zIndex: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissHandlePill: {
    width: 6,
    height: 48,
    borderRadius: 9999,
    backgroundColor: 'rgba(189, 194, 255, 0.3)',
  },
});