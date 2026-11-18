import React, { useEffect, useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Pattern, Path, Circle, Rect } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SERVICES = [
  {
    id: 'plumbing',
    label: 'Plomberie',
    price: '~150 DH',
    icon: 'plumbing',
    tintBg: 'rgba(63, 215, 196, 0.15)',
    tintColor: '#63F4E0',
  },
  {
    id: 'electricity',
    label: 'Électricité',
    price: '~120 DH',
    icon: 'bolt',
    tintBg: 'rgba(255, 179, 0, 0.15)',
    tintColor: '#FFB300',
  },
  {
    id: 'painting',
    label: 'Peinture',
    price: '~200 DH',
    icon: 'format-paint',
    tintBg: 'rgba(255, 180, 171, 0.15)',
    tintColor: '#FFB4AB',
  },
  {
    id: 'cleaning',
    label: 'Ménage',
    price: '~80 DH/h',
    icon: 'cleaning-services',
    tintBg: 'rgba(224, 224, 255, 0.15)',
    tintColor: '#BDC2FF',
  },
  {
    id: 'moving',
    label: 'Transport',
    price: 'Sur devis',
    icon: 'local-shipping',
    tintBg: 'rgba(255, 222, 172, 0.2)',
    tintColor: '#FFDEAC',
  },
  {
    id: 'hvac',
    label: 'Clim & Froid',
    price: '~180 DH',
    icon: 'ac-unit',
    tintBg: 'rgba(99, 244, 224, 0.15)',
    tintColor: '#63F4E0',
  },
];

const SAVED_ADDRESSES = [
  {
    id: 'home',
    title: 'Domicile',
    subtitle: 'Av. Marrakech, Guéliz',
    icon: 'location-on',
    isFavorite: true,
  },
  {
    id: 'office',
    title: 'Bureau',
    subtitle: 'Centre-ville, Bd Mohammed V',
    icon: 'business-center',
    isFavorite: false,
  },
];

export default function MapHomeScreen({ navigation, userName = 'Ahmed' }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();

  const [selectedServiceId, setSelectedServiceId] = useState('plumbing');
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const [userCoords, setUserCoords] = useState({ latitude: 33.5898, longitude: -7.6388 });
  const [locationLabel, setLocationLabel] = useState('{locationLabel}');

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserCoords(coords);
        mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.015, longitudeDelta: 0.015 }, 600);
        const geo = await Location.reverseGeocodeAsync(coords);
        if (geo && geo[0]) {
          const place = [geo[0].city || geo[0].region, geo[0].district || geo[0].street].filter(Boolean).join(', ');
          if (place) setLocationLabel(place);
        }
      } catch (_) {}
    })();
  }, []);
  const recenterRotate = useRef(new Animated.Value(0)).current;

  const selectedService =
    SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  const handleRecenter = () => {
    mapRef.current?.animateToRegion({ ...userCoords, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 500);
    Animated.sequence([
      Animated.timing(recenterRotate, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(recenterRotate, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const rotateInterpolate = recenterRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleOrderService = () => {
    if (navigation?.navigate) {
      navigation.navigate(selectedService.id === 'moving' ? 'RenovationQuote' : 'RequestDetails', {
        service: selectedService,
        query: searchQuery,
      });
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* 1. Map Canvas & Top Navigation Layer */}
        <View style={[styles.mapCanvas, { backgroundColor: colors.surface }]}>
          {/* Map Vector Grounding Elements (Casablanca Coastline + Roads + Zellige Watermark) */}
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            userInterfaceStyle="dark"
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={{
              latitude: userCoords.latitude,
              longitude: userCoords.longitude,
              latitudeDelta: 0.018,
              longitudeDelta: 0.018,
            }}
          >
            <Marker coordinate={userCoords} title={locationLabel}>
              <View style={styles.userPinCore}>
                <MaterialIcons name="home" size={18} color="#6B4900" />
              </View>
            </Marker>
            <Marker
              coordinate={{ latitude: userCoords.latitude + 0.0035, longitude: userCoords.longitude - 0.003 }}
              title="Youssef • Plombier (4 min)"
            >
              <View style={styles.artisanPinCircle}>
                <MaterialIcons name="plumbing" size={16} color="#63F4E0" />
              </View>
            </Marker>
            <Marker
              coordinate={{ latitude: userCoords.latitude - 0.0025, longitude: userCoords.longitude + 0.004 }}
              title="Karim • Électricien (7 min)"
            >
              <View style={styles.artisanPinCircle}>
                <MaterialIcons name="bolt" size={16} color="#FFB300" />
              </View>
            </Marker>
          </MapView>

          {/* Top Floating Quick Controls */}
          <View
            style={[
              styles.topControlsRow,
              { paddingTop: Math.max(insets.top, 12) + 6 },
            ]}
          >
            {/* Menu Drawer Trigger */}
            <Pressable
              onPress={() => navigation?.navigate?.('MenuDrawer')}
              style={({ pressed }) => [
                styles.menuCircleBtn,
                pressed && styles.pressedScale95,
              ]}
              accessibilityLabel="Menu principal"
            >
              <MaterialIcons name="menu" size={22} color="#DDE1FF" />
            </Pressable>

            {/* Active Artisans Pill & Recenter Target */}
            <View style={styles.rightControlsGroup}>
              <Pressable
                onPress={() => navigation?.navigate?.("DevMenu")}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 9999,
                  backgroundColor: "#FFB300",
                }}
              >
                <Text style={{ color: "#281900", fontWeight: "700", fontSize: 12 }}>
                  Pages
                </Text>
              </Pressable>

              <View style={styles.activeArtisansPill}>
                <View style={styles.liveTealDot} />
                <Text style={styles.activeArtisansText}>
                  18 Artisans actifs
                </Text>
              </View>

              <Pressable
                onPress={handleRecenter}
                style={({ pressed }) => [
                  styles.recenterBtn,
                  pressed && styles.pressedScale90,
                ]}
                accessibilityLabel="Recentrer ma position"
              >
                <Animated.View
                  style={{ transform: [{ rotate: rotateInterpolate }] }}
                >
                  <MaterialIcons name="my-location" size={20} color="#FFB300" />
                </Animated.View>
              </Pressable>
            </View>
          </View>

          {/* Active Map Pins */}
          {/* User Pin: Casablanca, Racine (Anchor) */}
          <Pressable
            onPress={() => navigation?.navigate?.('LocationPicker')}
            style={styles.userPinAnchor}
          >
            <View style={styles.locationBadge}>
              <View style={styles.locationSaffronDot} />
              <Text style={styles.locationBadgeText}>Casablanca, Racine</Text>
            </View>

            <View style={styles.userPinRings}>
              <View style={styles.userOuterHalo} />
              <View style={styles.userInnerHalo} />
              <View style={styles.userPinCore}>
                <MaterialIcons name="home" size={20} color="#6B4900" />
              </View>
            </View>
          </Pressable>

          {/* Artisan Pin 1: Plumber (Teal - 4 min) */}
          <Pressable
            onPress={() => setSelectedServiceId('plumbing')}
            style={styles.artisanPinPlumber}
          >
            <View style={[styles.etaBadge, { backgroundColor: '#3FD7C4' }]}>
              <Text style={[styles.etaBadgeText, { color: '#005A51' }]}>
                4 min
              </Text>
            </View>
            <View style={styles.pinAvatarWrap}>
              <View style={styles.tealPinHalo} />
              <View style={styles.artisanPinCircle}>
                <MaterialIcons name="plumbing" size={17} color="#63F4E0" />
              </View>
            </View>
          </Pressable>

          {/* Artisan Pin 2: Electrician (Saffron - 7 min) */}
          <Pressable
            onPress={() => setSelectedServiceId('electricity')}
            style={styles.artisanPinElectrician}
          >
            <View style={[styles.etaBadge, { backgroundColor: '#FFB300' }]}>
              <Text style={[styles.etaBadgeText, { color: '#6B4900' }]}>
                7 min
              </Text>
            </View>
            <View style={styles.pinAvatarWrap}>
              <View style={styles.saffronPinHalo} />
              <View style={styles.artisanPinCircle}>
                <MaterialIcons name="bolt" size={17} color="#FFB300" />
              </View>
            </View>
          </Pressable>

          {/* Artisan Pin 3: Painter (Lavender - 12 min) */}
          <Pressable
            onPress={() => setSelectedServiceId('painting')}
            style={styles.artisanPinPainter}
          >
            <View style={[styles.etaBadge, { backgroundColor: '#2C3352' }]}>
              <Text style={[styles.etaBadgeText, { color: '#BDC2FF' }]}>
                12 min
              </Text>
            </View>
            <View style={styles.artisanPinCircle}>
              <MaterialIcons name="format-paint" size={16} color="#BDC2FF" />
            </View>
          </Pressable>

          {/* Express Mode Floating Indicator */}
          <View style={styles.emergencyBanner}>
            <View style={styles.emergencyLeft}>
              <MaterialIcons name="bolt" size={18} color="#FFB300" />
              <Text style={styles.emergencyText}>
                Mode Urgence 24/7 disponible
              </Text>
            </View>
            <Text style={styles.emergencyStatus}>ACTIF</Text>
          </View>
        </View>

        {/* 2. Bottom Sheet Layer */}
        <View
          style={[
            styles.bottomSheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          <View style={styles.sheetBody}>
            {/* Greeting & Heading Prompt */}
            <View style={styles.greetingRow}>
              <View style={styles.greetingTextCol}>
                <View style={styles.greetingSubRow}>
                  <Text style={styles.greetingSubText}>
                    Bonjour {userName} 👋
                  </Text>
                  <View style={styles.vipPill}>
                    <Text style={styles.vipPillText}>VIP Pro</Text>
                  </View>
                </View>
                <Text style={styles.mainQuestion}>
                  De quoi avez-vous besoin ?
                </Text>
              </View>

              <Pressable
                onPress={() => navigation?.navigate?.('Notifications')}
                style={({ pressed }) => [
                  styles.bellBtn,
                  pressed && styles.pressedScale95,
                ]}
              >
                <MaterialIcons
                  name="notifications-active"
                  size={20}
                  color="#FFB300"
                />
              </Pressable>
            </View>

            {/* Pill Search Bar with Dirham Price Cue */}
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color="#D6C4AC" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Quel service, et à quel prix ?"
                placeholderTextColor="#D6C4AC"
                style={styles.searchInput}
                returnKeyType="search"
                onSubmitEditing={() =>
                  navigation?.navigate?.('SearchServices', {
                    initialQuery: searchQuery,
                  })
                }
              />
              <Pressable
                onPress={() => navigation?.navigate?.('SearchServices')}
                style={({ pressed }) => [
                  styles.filterCircleBtn,
                  pressed && styles.pressedScale90,
                ]}
              >
                <MaterialIcons name="tune" size={16} color="#FFB300" />
              </Pressable>
            </View>

            {/* Service Category Tiles Section */}
            <View style={styles.servicesSection}>
              <View style={styles.servicesHeader}>
                <Text style={styles.sectionCapsTitle}>
                  SERVICES À PROXIMITÉ
                </Text>
                <Pressable
                  onPress={() => navigation?.navigate?.('SearchServices')}
                >
                  <Text style={styles.seeAllLink}>Tout voir (14)</Text>
                </Pressable>
              </View>

              {/* Horizontal Scrollable Service Tiles */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tilesScrollContent}
                style={styles.tilesScrollView}
              >
                {SERVICES.map((service) => {
                  const isSelected = service.id === selectedServiceId;

                  return (
                    <Pressable
                      key={service.id}
                      onPress={() => setSelectedServiceId(service.id)}
                      style={({ pressed }) => [
                        styles.serviceTile,
                        isSelected && styles.serviceTileActive,
                        pressed && styles.pressedScale95,
                      ]}
                    >
                      <View
                        style={[
                          styles.serviceIconBox,
                          {
                            backgroundColor: isSelected
                              ? 'rgba(0, 90, 81, 0.15)'
                              : service.tintBg,
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={service.icon}
                          size={22}
                          color={isSelected ? '#005A51' : service.tintColor}
                        />
                      </View>
                      <Text
                        style={[
                          styles.serviceTileLabel,
                          isSelected && styles.serviceTileLabelActive,
                        ]}
                        numberOfLines={1}
                      >
                        {service.label}
                      </Text>
                      <Text
                        style={[
                          styles.serviceTilePrice,
                          isSelected && styles.serviceTilePriceActive,
                        ]}
                      >
                        {service.price}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Quick Action CTA Card: Demander un artisan express */}
            <LinearGradient
              colors={['#212847', '#161E3C']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.expressCard}
            >
              <View style={styles.expressLeft}>
                <View style={styles.expressIconCircle}>
                  <MaterialIcons name="speed" size={22} color="#FFB300" />
                </View>
                <View style={styles.expressCopy}>
                  <Text style={styles.expressTitle}>
                    Artisan en moins de 15 min
                  </Text>
                  <Text style={styles.expressSubtitle}>
                    Attribution directe sans négociation
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleOrderService}
                style={({ pressed }) => [
                  styles.proposerPillBtn,
                  pressed && styles.pressedScale95,
                ]}
              >
                <Text style={styles.proposerPillText}>Proposer</Text>
              </Pressable>
            </LinearGradient>

            {/* Recent Saved Addresses Section */}
            <View style={styles.addressesSection}>
              <Text style={styles.addressesHeader}>ADRESSES RÉCENTES</Text>

              {SAVED_ADDRESSES.map((addr) => (
                <Pressable
                  key={addr.id}
                  onPress={() =>
                    navigation?.navigate?.('LocationPicker', { address: addr })
                  }
                  style={({ pressed }) => [
                    styles.addressRow,
                    pressed && styles.addressRowPressed,
                  ]}
                >
                  <View style={styles.addressLeft}>
                    <View style={styles.addressIconCircle}>
                      <MaterialIcons
                        name={addr.icon}
                        size={19}
                        color="#BDC2FF"
                      />
                    </View>
                    <View>
                      <Text style={styles.addressTitle}>{addr.title}</Text>
                      <Text style={styles.addressSubtitle}>
                        {addr.subtitle}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.addressRight}>
                    {addr.isFavorite && (
                      <View style={styles.favoriBadge}>
                        <Text style={styles.favoriBadgeText}>Favori</Text>
                      </View>
                    )}
                    <MaterialIcons
                      name="chevron-right"
                      size={18}
                      color="#9E8E78"
                    />
                  </View>
                </Pressable>
              ))}
            </View>

            {/* Primary Action CTA Button */}
            <Pressable
              onPress={handleOrderService}
              style={({ pressed }) => [
                styles.primaryCtaBtn,
                pressed && styles.primaryCtaPressed,
              ]}
            >
              <MaterialIcons name="handyman" size={22} color="#6B4900" />
              <Text style={styles.primaryCtaText}>
                Commander un service ({selectedService.label})
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Map Canvas (380px)
  mapCanvas: {
    width: '100%',
    height: 380,
    position: 'relative',
    overflow: 'hidden',
  },
  topControlsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 20,
  },
  menuCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  rightControlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activeArtisansPill: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  liveTealDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#63F4E0',
  },
  activeArtisansText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#63F4E0',
  },
  recenterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  // User Pin (Casablanca, Racine)
  userPinAnchor: {
    position: 'absolute',
    left: '45%',
    top: 148,
    transform: [{ translateX: -66 }, { translateY: -36 }],
    zIndex: 10,
    alignItems: 'center',
  },
  locationBadge: {
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(44, 51, 82, 0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  locationSaffronDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFB300',
  },
  locationBadgeText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#DDE1FF',
    letterSpacing: 0.2,
  },
  userPinRings: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userOuterHalo: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 179, 0, 0.18)',
  },
  userInnerHalo: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 179, 0, 0.3)',
  },
  userPinCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  // Artisan Map Pins
  artisanPinPlumber: {
    position: 'absolute',
    left: '22%',
    top: 88,
    transform: [{ translateX: -20 }, { translateY: -24 }],
    zIndex: 10,
    alignItems: 'center',
  },
  artisanPinElectrician: {
    position: 'absolute',
    left: '78%',
    top: 112,
    transform: [{ translateX: -20 }, { translateY: -24 }],
    zIndex: 10,
    alignItems: 'center',
  },
  artisanPinPainter: {
    position: 'absolute',
    left: '82%',
    top: 230,
    transform: [{ translateX: -22 }, { translateY: -24 }],
    zIndex: 10,
    alignItems: 'center',
  },
  etaBadge: {
    marginBottom: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  etaBadgeText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
  },
  pinAvatarWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tealPinHalo: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 244, 224, 0.22)',
  },
  saffronPinHalo: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
  },
  artisanPinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1023D7',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  // Express Mode Floating Banner
  emergencyBanner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  emergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  emergencyStatus: {
    fontFamily: tokens.fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#63F4E0',
    letterSpacing: 0.8,
  },
  // Bottom Sheet
  bottomSheet: {
    marginTop: -14,
    width: '100%',
    backgroundColor: '#121A38',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    zIndex: 30,
    shadowColor: '#040B2A',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2C3352',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetBody: {
    paddingHorizontal: 20,
    gap: 16,
  },
  // Greeting
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingTextCol: {
    flex: 1,
  },
  greetingSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greetingSubText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#D6C4AC',
  },
  vipPill: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 9999,
    backgroundColor: '#2C3352',
  },
  vipPillText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    color: '#63F4E0',
  },
  mainQuestion: {
    fontFamily: tokens.fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.2,
    marginTop: 2,
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Search Bar
  searchBar: {
    width: '100%',
    height: 48,
    borderRadius: 9999,
    backgroundColor: '#212847',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    color: '#DDE1FF',
    paddingVertical: 0,
  },
  filterCircleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Service Category Tiles
  servicesSection: {
    gap: 8,
    marginTop: 2,
  },
  servicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionCapsTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#D6C4AC',
    letterSpacing: 0.8,
  },
  seeAllLink: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#63F4E0',
  },
  tilesScrollView: {
    marginHorizontal: -20,
  },
  tilesScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    gap: 10,
  },
  serviceTile: {
    width: 78,
    height: 86,
    borderRadius: 16,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  serviceTileActive: {
    backgroundColor: '#3FD7C4',
    shadowColor: '#3FD7C4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  serviceIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  serviceTileLabel: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#DDE1FF',
    letterSpacing: -0.2,
  },
  serviceTileLabelActive: {
    fontFamily: tokens.fonts.bold,
    fontWeight: '700',
    color: '#005A51',
  },
  serviceTilePrice: {
    fontFamily: tokens.fonts.medium,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
    color: '#D6C4AC',
  },
  serviceTilePriceActive: {
    color: 'rgba(0, 90, 81, 0.85)',
  },
  // Express Action Card
  expressCard: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  expressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  expressIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expressCopy: {
    flex: 1,
  },
  expressTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  expressSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
    marginTop: 1,
  },
  proposerPillBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 9999,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proposerPillText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#6B4900',
  },
  // Recent Saved Addresses
  addressesSection: {
    gap: 8,
    marginTop: 2,
  },
  addressesHeader: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#9E8E78',
    letterSpacing: 0.8,
  },
  addressRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#161E3C',
  },
  addressRowPressed: {
    backgroundColor: '#212847',
  },
  addressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  addressIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16, 35, 215, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  addressSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  addressRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favoriBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: 'rgba(63, 215, 196, 0.25)',
  },
  favoriBadgeText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: '#63F4E0',
  },
  // Primary CTA Button
  primaryCtaBtn: {
    width: '100%',
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#FFB300',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryCtaPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#FFBA38',
  },
  primaryCtaText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#6B4900',
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale90: {
    transform: [{ scale: 0.9 }],
  },
});