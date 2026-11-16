import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Pattern,
  Path,
  Circle,
  Rect,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const NEIGHBORHOODS = [
  {
    id: 'racine',
    name: 'Racine',
    street: 'Avenue Marrakech',
    shortStreet: 'Av. Marrakech',
    residence: 'Résidence Al Manar, Immeuble B',
    floor: 'Étage 3, N° 12',
    artisansCount: 8,
  },
  {
    id: 'gauthier',
    name: 'Gauthier',
    street: 'Rue Jean Jaurès',
    shortStreet: 'Rue Jean Jaurès',
    residence: 'Résidence Les Jardins, Bloc A',
    floor: 'Étage 2, N° 07',
    artisansCount: 11,
  },
  {
    id: 'maarif',
    name: 'Maârif',
    street: 'Boulevard Bir Anzarane',
    shortStreet: 'Bd Bir Anzarane',
    residence: 'Immeuble Atlas, Entrée C',
    floor: 'Étage 4, N° 15',
    artisansCount: 14,
  },
  {
    id: 'anfa',
    name: 'Anfa Supérieur',
    street: 'Boulevard Franklin Roosevelt',
    shortStreet: 'Bd Roosevelt',
    residence: 'Villa Oasis, Quartier Anfa',
    floor: 'RDC, Portail 2',
    artisansCount: 6,
  },
];

export default function LocationPickerScreen({ navigation, route }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();
  const inputRef = useRef(null);

  const [selectedNeighborhood, setSelectedNeighborhood] = useState(
    NEIGHBORHOODS[0]
  );
  const [searchText, setSearchText] = useState('Avenue Marrakech, Racine');
  const [floorDetails, setFloorDetails] = useState('Étage 3, N° 12');
  const [isEditingFloor, setIsEditingFloor] = useState(false);
  const [showArtisanRadar, setShowArtisanRadar] = useState(true);
  const [zoomScale, setZoomScale] = useState(1);
  const [confirmState, setConfirmState] = useState('idle'); // 'idle' | 'validating' | 'saved'

  const mapScaleAnim = useRef(new Animated.Value(1)).current;
  const pinBounceAnim = useRef(new Animated.Value(0)).current;
  const pingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pinBounceAnim, {
          toValue: -5,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(pinBounceAnim, {
          toValue: 0,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    const pingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, {
          toValue: 0.35,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(pingAnim, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );

    bounceLoop.start();
    pingLoop.start();

    return () => {
      bounceLoop.stop();
      pingLoop.stop();
    };
  }, [pinBounceAnim, pingAnim]);

  const animateZoom = (nextZoom) => {
    const clamped = Math.min(1.36, Math.max(0.88, Number(nextZoom.toFixed(2))));
    setZoomScale(clamped);
    Animated.spring(mapScaleAnim, {
      toValue: clamped,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  };

  const handleSelectNeighborhood = (item) => {
    setSelectedNeighborhood(item);
    setSearchText(`${item.street}, ${item.name}`);
    setFloorDetails(item.floor);
    setIsEditingFloor(false);
  };

  const handleClearSearch = () => {
    setSearchText('');
    inputRef.current?.focus();
  };

  const handleRecenter = () => {
    animateZoom(1);
    handleSelectNeighborhood(NEIGHBORHOODS[0]);
  };

  const handleConfirmAddress = () => {
    if (confirmState !== 'idle') return;
    setConfirmState('validating');

    setTimeout(() => {
      setConfirmState('saved');
      setTimeout(() => {
        if (route?.params?.onSelectAddress) {
          route.params.onSelectAddress({
            ...selectedNeighborhood,
            floor: floorDetails,
          });
        }
        if (navigation?.canGoBack?.()) {
          navigation.goBack();
        } else {
          navigation?.navigate?.('PriceProposal');
        }
      }, 650);
    }, 650);
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: colors.surfaceContainerLowest },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Interactive Vector Map Canvas */}
      <Animated.View
        style={[
          styles.mapLayer,
          { transform: [{ scale: mapScaleAnim }] },
        ]}
      >
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          viewBox="0 0 400 884"
          preserveAspectRatio="xMidYMid slice"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            {/* Moroccan 8-point geometric star watermark pattern */}
            <Pattern
              id="zellige-map-pattern"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <Path
                d="M32 0 L40 16 L56 8 L48 24 L64 32 L48 40 L56 56 L40 48 L32 64 L24 48 L8 56 L16 40 L0 32 L16 24 L8 8 L24 16 Z"
                fill="none"
                stroke="#212847"
                strokeWidth="0.8"
                opacity="0.22"
              />
              <Circle
                cx="32"
                cy="32"
                r="6"
                fill="none"
                stroke="#212847"
                strokeWidth="0.6"
                opacity="0.15"
              />
            </Pattern>
          </Defs>

          {/* Atlantic Casablanca Coastal Water Tint at Top Left */}
          <Path
            d="M-40 -40 L220 -40 C190 60 140 110 -20 130 Z"
            fill="#040B2A"
          />
          <Path
            d="M-30 -30 L200 -30 C175 55 125 100 -20 120 Z"
            fill="#121A38"
            opacity="0.65"
          />

          {/* Zellige Subtle Architectural Watermark Layer */}
          <Rect width="400" height="884" fill="url(#zellige-map-pattern)" />

          {/* Primary Arteries & Avenues */}
          {/* Bd Zerktouni (Diagonal Arterial Highway) */}
          <Path
            d="M-50 490 L450 310"
            stroke="#212847"
            strokeLinecap="round"
            strokeWidth="26"
          />
          <Path
            d="M-50 490 L450 310"
            stroke="#161E3C"
            strokeLinecap="round"
            strokeWidth="22"
          />

          {/* Bd d'Anfa (Cross Artery) */}
          <Path
            d="M120 -50 L270 920"
            stroke="#212847"
            strokeLinecap="round"
            strokeWidth="22"
          />
          <Path
            d="M120 -50 L270 920"
            stroke="#161E3C"
            strokeLinecap="round"
            strokeWidth="18"
          />

          {/* Avenue Marrakech (Primary Focus Road) */}
          <Path
            d="M-30 415 L430 460"
            stroke="#2C3352"
            strokeLinecap="round"
            strokeWidth="20"
          />
          <Path
            d="M-30 415 L430 460"
            stroke="#161E3C"
            strokeLinecap="round"
            strokeWidth="16"
          />

          {/* Secondary Residential Streets: Racine & Gauthier */}
          <Path d="M-20 220 L420 250" stroke="#161E3C" strokeWidth="10" />
          <Path d="M-30 330 L430 365" stroke="#161E3C" strokeWidth="12" />
          <Path d="M-20 570 L420 540" stroke="#161E3C" strokeWidth="12" />
          <Path d="M-20 670 L420 620" stroke="#161E3C" strokeWidth="10" />

          {/* North-South Secondary Streets */}
          <Path d="M50 80 L90 850" stroke="#161E3C" strokeWidth="9" />
          <Path d="M200 60 L180 850" stroke="#161E3C" strokeWidth="11" />
          <Path d="M330 90 L320 860" stroke="#161E3C" strokeWidth="10" />
          <Path d="M380 150 L370 750" stroke="#161E3C" strokeWidth="7" />

          {/* Rue El Bohtori & Jean Jaurès Connectors */}
          <Path d="M60 330 L230 490" stroke="#161E3C" strokeWidth="8" />
          <Path d="M180 340 L340 510" stroke="#161E3C" strokeWidth="8" />
          <Path d="M70 480 L190 620" stroke="#161E3C" strokeWidth="7" />

          {/* Road Names (Nocturnal Typography) */}
          <SvgText
            x="75"
            y="482"
            fill="#D6C4AC"
            fontSize="9"
            fontWeight="600"
            letterSpacing="1.2"
            opacity="0.65"
            transform="rotate(-13 75 482)"
          >
            BD ZERKTOUNI
          </SvgText>
          <SvgText
            x="210"
            y="240"
            fill="#D6C4AC"
            fontSize="9"
            fontWeight="600"
            letterSpacing="1.5"
            opacity="0.65"
            transform="rotate(82 210 240)"
          >
            BD D'ANFA
          </SvgText>
          <SvgText
            x="35"
            y="430"
            fill="#FFD79B"
            fontSize="10"
            fontWeight="700"
            letterSpacing="1"
            opacity="0.9"
          >
            AVENUE MARRAKECH
          </SvgText>
          <SvgText
            x="235"
            y="380"
            fill="#D6C4AC"
            fontSize="8"
            fontWeight="500"
            opacity="0.5"
          >
            RUE EL BOHTORI
          </SvgText>
          <SvgText
            x="45"
            y="240"
            fill="#D6C4AC"
            fontSize="8"
            fontWeight="500"
            opacity="0.5"
          >
            RUE JEAN JAURÈS
          </SvgText>

          {/* Urban POI Markers (Racine Casablanca Neighborhood) */}
          <G transform="translate(68, 305)">
            <Circle cx="12" cy="12" r="11" fill="#161E3C" />
            <Circle cx="12" cy="12" r="4" fill="#3FD7C4" />
            <SvgText
              x="28"
              y="15"
              fill="#D6C4AC"
              fontSize="8.5"
              fontWeight="500"
            >
              Pharmacie Racine
            </SvgText>
          </G>

          <G transform="translate(245, 275)">
            <Circle cx="12" cy="12" r="11" fill="#161E3C" />
            <Circle cx="12" cy="12" r="4" fill="#FFBA38" />
            <SvgText
              x="28"
              y="15"
              fill="#D6C4AC"
              fontSize="8.5"
              fontWeight="500"
            >
              Café Carré Racine
            </SvgText>
          </G>

          <G transform="translate(48, 520)">
            <Circle cx="12" cy="12" r="11" fill="#161E3C" />
            <Circle cx="12" cy="12" r="4" fill="#3FD7C4" />
            <SvgText
              x="28"
              y="15"
              fill="#D6C4AC"
              fontSize="8.5"
              fontWeight="500"
            >
              Mosquée Badr
            </SvgText>
          </G>

          <G transform="translate(250, 560)">
            <Circle cx="12" cy="12" r="11" fill="#161E3C" />
            <Circle cx="12" cy="12" r="4" fill="#BDC2FF" />
            <SvgText
              x="28"
              y="15"
              fill="#D6C4AC"
              fontSize="8.5"
              fontWeight="500"
            >
              Lycée Lyautey
            </SvgText>
          </G>

          {/* Nearby On-Duty Artisans (Ambient Pulse Circles) */}
          {showArtisanRadar && (
            <>
              <G transform="translate(130, 360)">
                <Circle cx="0" cy="0" r="18" fill="#3FD7C4" opacity="0.16" />
                <Circle cx="0" cy="0" r="6" fill="#3FD7C4" />
              </G>
              <G transform="translate(270, 480)">
                <Circle cx="0" cy="0" r="18" fill="#FFBA38" opacity="0.16" />
                <Circle cx="0" cy="0" r="6" fill="#FFBA38" />
              </G>
            </>
          )}
        </Svg>
      </Animated.View>

      {/* 2. Static Center Geolocation Anchor Pin */}
      <View style={styles.centerPinAnchor} pointerEvents="none">
        <Animated.View
          style={[
            styles.pinFloatingGroup,
            { transform: [{ translateY: pinBounceAnim }] },
          ]}
        >
          {/* Speech Callout Pill with Address Preview */}
          <View style={styles.calloutPill}>
            <View style={styles.calloutSaffronDot} />
            <View style={styles.calloutTexts}>
              <Text style={styles.calloutStreet} numberOfLines={1}>
                {selectedNeighborhood.shortStreet}
              </Text>
              <Text style={styles.calloutDistrict}>
                {selectedNeighborhood.name.toUpperCase()} • CASABLANCA
              </Text>
            </View>
            {/* Downward Triangle Notch */}
            <View style={styles.calloutTriangle} />
          </View>

          {/* Saffron Teardrop Location Pin */}
          <View style={styles.teardropBox}>
            <Svg width={48} height={56} viewBox="0 0 48 56" fill="none">
              <Path
                d="M24 0C10.745 0 0 10.745 0 24C0 39.5 21.5 54.2 22.8 55.1C23.5 55.6 24.5 55.6 25.2 55.1C26.5 54.2 48 39.5 48 24C48 10.745 37.255 0 24 0Z"
                fill="#FFBA38"
              />
              <Circle cx="24" cy="22" r="14" fill="#040B2A" />
            </Svg>
            <View style={styles.teardropIconWrap}>
              <MaterialIcons name="home" size={19} color="#FFBA38" />
            </View>
          </View>
        </Animated.View>

        {/* Elliptical Ground Shadow */}
        <View style={styles.groundShadow} />
      </View>

      {/* 3. Top Floating Navigation & Search Overlay */}
      <View
        style={[
          styles.topOverlay,
          { paddingTop: Math.max(insets.top, 10) + 6 },
        ]}
      >
        <View style={styles.searchHeaderRow}>
          {/* Back Button */}
          <Pressable
            onPress={() => {
              if (navigation?.canGoBack?.()) {
                navigation.goBack();
              } else {
                navigation?.navigate?.('MapHome');
              }
            }}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.pressedScale95,
            ]}
            accessibilityLabel="Retour"
          >
            <MaterialIcons name="arrow-back" size={20} color="#DDE1FF" />
          </Pressable>

          {/* Floating Search Bar Capsule */}
          <View style={styles.searchCapsule}>
            <MaterialIcons name="search" size={20} color="#FFB300" />
            <TextInput
              ref={inputRef}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Rechercher une rue ou quartier..."
              placeholderTextColor="#9E8E78"
              style={styles.searchInput}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <Pressable
                onPress={handleClearSearch}
                style={({ pressed }) => [
                  styles.clearCircleBtn,
                  pressed && styles.pressedScale90,
                ]}
                accessibilityLabel="Effacer recherche"
              >
                <MaterialIcons name="close" size={14} color="#D6C4AC" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Quick Moroccan Neighborhood Shortcuts Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.neighborhoodsScroll}
        >
          {NEIGHBORHOODS.map((item) => {
            const isSelected = item.id === selectedNeighborhood.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelectNeighborhood(item)}
                style={({ pressed }) => [
                  styles.neighborhoodPill,
                  isSelected && styles.neighborhoodPillActive,
                  pressed && styles.pressedScale95,
                ]}
              >
                {isSelected && (
                  <MaterialIcons
                    name="my-location"
                    size={14}
                    color="#6B4900"
                  />
                )}
                <Text
                  style={[
                    styles.neighborhoodText,
                    isSelected && styles.neighborhoodTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 4. Floating Map Controls (Right Flank) */}
      <View style={styles.rightControlsFlank}>
        {/* Zoom In / Zoom Out Capsule */}
        <View style={styles.zoomCapsule}>
          <Pressable
            onPress={() => animateZoom(zoomScale + 0.14)}
            style={({ pressed }) => [
              styles.zoomHalfBtn,
              pressed && styles.pressedScale90,
            ]}
            accessibilityLabel="Zoomer"
          >
            <MaterialIcons name="add" size={20} color="#DDE1FF" />
          </Pressable>
          <View style={styles.zoomDivider} />
          <Pressable
            onPress={() => animateZoom(zoomScale - 0.14)}
            style={({ pressed }) => [
              styles.zoomHalfBtn,
              pressed && styles.pressedScale90,
            ]}
            accessibilityLabel="Dézoomer"
          >
            <MaterialIcons name="remove" size={20} color="#DDE1FF" />
          </Pressable>
        </View>

        {/* Recenter / GPS Button */}
        <Pressable
          onPress={handleRecenter}
          style={({ pressed }) => [
            styles.roundControlBtn,
            pressed && styles.pressedScale95,
          ]}
          accessibilityLabel="Ma position actuelle"
        >
          <MaterialIcons name="near-me" size={22} color="#FFB300" />
        </Pressable>

        {/* Artisan Density Radar Toggle */}
        <Pressable
          onPress={() => setShowArtisanRadar((prev) => !prev)}
          style={({ pressed }) => [
            styles.roundControlBtn,
            showArtisanRadar && styles.radarBtnActive,
            pressed && styles.pressedScale95,
          ]}
          accessibilityLabel="Artisans à proximité"
        >
          <MaterialIcons name="handyman" size={20} color="#63F4E0" />
        </Pressable>
      </View>

      {/* 5. Bottom Action Sheet (Majorelle Night Tactile Drawer) */}
      <View
        style={[
          styles.bottomDrawer,
          { paddingBottom: Math.max(insets.bottom, 16) + 12 },
        ]}
      >
        {/* Drawer Pull Handle */}
        <View style={styles.drawerHandle} />

        {/* Coverage & Live Artisans Row */}
        <View style={styles.coverageRow}>
          <View style={styles.coverageLeft}>
            <MaterialIcons name="verified" size={18} color="#63F4E0" />
            <Text style={styles.coverageLabel}>
              ZONE COUVERTE PAR INHOME
            </Text>
          </View>

          <View style={styles.dispoPill}>
            <Animated.View
              style={[styles.dispoSaffronDot, { opacity: pingAnim }]}
            />
            <Text style={styles.dispoText}>
              {selectedNeighborhood.artisansCount} artisans dispo
            </Text>
          </View>
        </View>

        {/* Address Card & Specific Residence Details */}
        <View style={styles.addressCard}>
          <View style={styles.addressIconBox}>
            <MaterialIcons name="location-on" size={22} color="#FFB300" />
          </View>

          <View style={styles.addressBody}>
            <View style={styles.addressTitleRow}>
              <Text style={styles.addressStreet} numberOfLines={1}>
                {selectedNeighborhood.street}
              </Text>
              <Pressable onPress={() => setIsEditingFloor((prev) => !prev)}>
                <Text style={styles.modifierLink}>
                  {isEditingFloor ? 'OK' : 'Modifier'}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.addressResidence} numberOfLines={1}>
              {selectedNeighborhood.residence}
            </Text>

            {isEditingFloor ? (
              <TextInput
                value={floorDetails}
                onChangeText={setFloorDetails}
                placeholder="Ex: Étage 3, N° 12"
                placeholderTextColor="#9E8E78"
                style={styles.floorEditInput}
                autoFocus
              />
            ) : (
              <View style={styles.metaChipsRow}>
                <View style={styles.metaChip}>
                  <MaterialIcons name="apartment" size={13} color="#FFDEAC" />
                  <Text style={styles.metaChipGoldText}>{floorDetails}</Text>
                </View>

                <View style={styles.metaChip}>
                  <MaterialIcons name="gps-fixed" size={13} color="#63F4E0" />
                  <Text style={styles.metaChipTealText}>Précision: 3m</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Confirm Destination CTA */}
        <Pressable
          onPress={handleConfirmAddress}
          style={({ pressed }) => [
            styles.confirmCtaBtn,
            pressed && styles.confirmCtaPressed,
          ]}
        >
          {confirmState === 'validating' ? (
            <>
              <ActivityIndicator size="small" color="#6B4900" />
              <Text style={styles.confirmCtaText}>
                Localisation validée...
              </Text>
            </>
          ) : confirmState === 'saved' ? (
            <>
              <Text style={styles.confirmCtaText}>Adresse enregistrée</Text>
              <MaterialIcons name="check" size={20} color="#6B4900" />
            </>
          ) : (
            <>
              <Text style={styles.confirmCtaText}>
                Confirmer cette adresse
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#6B4900" />
            </>
          )}
        </Pressable>

        {/* Bilingual French / Darija Footnote */}
        <Text style={styles.footnoteText}>
          Artisans qualifiés prêts à intervenir à Casablanca • الحرفي ديالك
          واجد
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  mapLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  // Center Geolocation Static Anchor Pin
  centerPinAnchor: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 30,
  },
  pinFloatingGroup: {
    alignItems: 'center',
  },
  calloutPill: {
    position: 'relative',
    backgroundColor: '#2C3352',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  calloutSaffronDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFB300',
  },
  calloutTexts: {
    alignItems: 'center',
  },
  calloutStreet: {
    fontFamily: tokens.fonts.bold,
    fontSize: 14,
    lineHeight: 17,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.2,
  },
  calloutDistrict: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    color: '#FFDEAC',
    letterSpacing: 0.8,
  },
  calloutTriangle: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderTopWidth: 6,
    borderTopColor: '#2C3352',
  },
  teardropBox: {
    width: 48,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  teardropIconWrap: {
    position: 'absolute',
    top: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groundShadow: {
    width: 24,
    height: 7,
    borderRadius: 9999,
    backgroundColor: 'rgba(4, 11, 42, 0.85)',
    marginTop: 2,
  },
  // Top Navigation & Search Overlay
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 12,
    zIndex: 40,
  },
  searchHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  searchCapsule: {
    flex: 1,
    height: 44,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.96)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  searchInput: {
    flex: 1,
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    color: '#DDE1FF',
    paddingVertical: 0,
  },
  clearCircleBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
  },
  neighborhoodsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  neighborhoodPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  neighborhoodPillActive: {
    backgroundColor: '#FFB300',
  },
  neighborhoodText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#D6C4AC',
  },
  neighborhoodTextActive: {
    fontFamily: tokens.fonts.semiBold,
    fontWeight: '600',
    color: '#6B4900',
  },
  // Right Flank Map Controls
  rightControlsFlank: {
    position: 'absolute',
    right: 16,
    top: '39%',
    zIndex: 30,
    alignItems: 'center',
    gap: 10,
  },
  zoomCapsule: {
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  zoomHalfBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomDivider: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(81, 69, 50, 0.35)',
    alignSelf: 'center',
  },
  roundControlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(33, 40, 71, 0.96)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  radarBtnActive: {
    borderWidth: 1,
    borderColor: 'rgba(99, 244, 224, 0.45)',
  },
  // Bottom Action Sheet
  bottomDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    backgroundColor: '#121A38',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 12,
    shadowColor: '#040B2A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.75,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2C3352',
    alignSelf: 'center',
    marginBottom: 12,
  },
  coverageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
    gap: 8,
  },
  coverageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  coverageLabel: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#63F4E0',
    letterSpacing: 0.5,
  },
  dispoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#161E3C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    flexShrink: 0,
  },
  dispoSaffronDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFB300',
  },
  dispoText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#DDE1FF',
  },
  // Address Card
  addressCard: {
    backgroundColor: '#161E3C',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  addressIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 179, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  addressBody: {
    flex: 1,
    minWidth: 0,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  addressStreet: {
    fontFamily: tokens.fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#DDE1FF',
    flex: 1,
  },
  modifierLink: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#FFD79B',
  },
  addressResidence: {
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: '#D6C4AC',
    marginTop: 2,
  },
  floorEditInput: {
    marginTop: 8,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#212847',
    paddingHorizontal: 10,
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    color: '#FFDEAC',
  },
  metaChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#212847',
  },
  metaChipGoldText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: '#FFDEAC',
  },
  metaChipTealText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500',
    color: '#63F4E0',
  },
  // Confirm CTA
  confirmCtaBtn: {
    width: '100%',
    height: 56,
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
    elevation: 10,
  },
  confirmCtaPressed: {
    backgroundColor: '#FFD79B',
    transform: [{ scale: 0.98 }],
  },
  confirmCtaText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#6B4900',
  },
  footnoteText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(214, 196, 172, 0.8)',
    textAlign: 'center',
    marginTop: 12,
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale90: {
    transform: [{ scale: 0.9 }],
  },
});