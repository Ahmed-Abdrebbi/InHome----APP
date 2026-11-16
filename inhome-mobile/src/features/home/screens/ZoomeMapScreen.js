import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Pattern,
  Path,
  Circle,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ARTISAN_MARKERS = [
  {
    id: 'art-1',
    name: 'Youssef B.',
    trade: 'plumbing',
    tradeLabel: 'Plomberie',
    icon: 'plumbing',
    color: '#63F4E0',
    iconColor: '#003731',
    badgeType: 'rating',
    badgeText: '4.9',
    verified: true,
    topPct: '27.4%',
    leftPct: '29.0%',
  },
  {
    id: 'art-2',
    name: 'Karim M.',
    trade: 'electricity',
    tradeLabel: 'Électricité',
    icon: 'bolt',
    color: '#FFB300',
    iconColor: '#432C00',
    badgeType: 'eta',
    badgeText: '3 min',
    verified: true,
    topPct: '21.4%',
    leftPct: '64.8%',
  },
  {
    id: 'art-3',
    name: 'Rachid T.',
    trade: 'painting',
    tradeLabel: 'Peinture',
    icon: 'format-paint',
    color: '#FFB4AB',
    iconColor: '#690005',
    badgeType: 'rating',
    badgeText: '★ 4.8',
    verified: false,
    topPct: '37.5%',
    leftPct: '15.5%',
  },
  {
    id: 'art-4',
    name: 'Amine L.',
    trade: 'electricity',
    tradeLabel: 'Électricité',
    icon: 'bolt',
    color: '#FFB300',
    iconColor: '#432C00',
    badgeType: 'eta',
    badgeText: '5 min',
    verified: false,
    topPct: '47.0%',
    leftPct: '82.1%',
  },
  {
    id: 'art-5',
    name: 'Hassan K.',
    trade: 'plumbing',
    tradeLabel: 'Plomberie',
    icon: 'plumbing',
    color: '#63F4E0',
    iconColor: '#003731',
    badgeType: null,
    badgeText: '',
    verified: true,
    topPct: '57.7%',
    leftPct: '63.1%',
  },
  {
    id: 'art-6',
    name: 'Mehdi O.',
    trade: 'painting',
    tradeLabel: 'Peinture',
    icon: 'format-paint',
    color: '#FFB4AB',
    iconColor: '#690005',
    badgeType: 'eta',
    badgeText: '8 min',
    verified: false,
    topPct: '68.5%',
    leftPct: '25.0%',
  },
  {
    id: 'art-7',
    name: 'Omar S.',
    trade: 'plumbing',
    tradeLabel: 'Plomberie',
    icon: 'plumbing',
    color: '#63F4E0',
    iconColor: '#003731',
    badgeType: null,
    badgeText: '',
    verified: false,
    topPct: '73.8%',
    leftPct: '77.4%',
  },
];

const TRADE_FILTERS = ['all', 'plumbing', 'electricity', 'painting'];

export default function ZoomedMapScreen({ navigation }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();

  const [selectedTrade, setSelectedTrade] = useState('all');
  const [zoomScale, setZoomScale] = useState(1);

  const mapScaleAnim = useRef(new Animated.Value(1)).current;
  const radarPulseAnim = useRef(new Animated.Value(0)).current;
  const liveDotAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const radarLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(radarPulseAnim, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(radarPulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );

    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotAnim, {
          toValue: 0.35,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(liveDotAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );

    radarLoop.start();
    dotLoop.start();

    return () => {
      radarLoop.stop();
      dotLoop.stop();
    };
  }, [radarPulseAnim, liveDotAnim]);

  const animateZoomTo = (nextScale) => {
    const clamped = Math.min(1.4, Math.max(0.88, Number(nextScale.toFixed(2))));
    setZoomScale(clamped);
    Animated.spring(mapScaleAnim, {
      toValue: clamped,
      useNativeDriver: true,
      damping: 18,
      stiffness: 180,
    }).start();
  };

  const handleCycleFilter = () => {
    const currentIndex = TRADE_FILTERS.indexOf(selectedTrade);
    const nextIndex = (currentIndex + 1) % TRADE_FILTERS.length;
    setSelectedTrade(TRADE_FILTERS[nextIndex]);
  };

  const visibleMarkers =
    selectedTrade === 'all'
      ? ARTISAN_MARKERS
      : ARTISAN_MARKERS.filter((m) => m.trade === selectedTrade);

  const radarRingScale = radarPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1.45],
  });

  const radarRingOpacity = radarPulseAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.45, 0.15, 0],
  });

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

      {/* 1. Zoomable Interactive Vector Map + Pins Layer */}
      <Animated.View
        style={[
          styles.mapViewport,
          { transform: [{ scale: mapScaleAnim }] },
        ]}
      >
        {/* Vector Map Canvas (Casablanca / Racine / Gauthier Grid) */}
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
          viewBox="0 0 420 840"
          preserveAspectRatio="xMidYMid slice"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            {/* Subtle Zellige Geometry for Urban Blocks */}
            <Pattern
              id="zellige-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <Path
                d="M24 0 L48 24 L24 48 L0 24 Z"
                fill="none"
                stroke="#212847"
                strokeOpacity="0.25"
                strokeWidth="0.75"
              />
              <Path
                d="M24 12 L36 24 L24 36 L12 24 Z"
                fill="none"
                stroke="#3FD7C4"
                strokeOpacity="0.08"
                strokeWidth="0.5"
              />
              <Circle
                cx="24"
                cy="24"
                r="2"
                fill="#FFD79B"
                fillOpacity="0.12"
              />
            </Pattern>
          </Defs>

          {/* Ocean / Harbor Canal Basin in Upper Quadrant */}
          <Path
            d="M-20,-20 L440,-20 L440,75 C370,82 320,68 250,88 C180,108 120,84 -20,110 Z"
            fill="#003731"
            fillOpacity="0.55"
          />
          <Path
            d="M-20,-20 L440,-20 L440,75 C370,82 320,68 250,88 C180,108 120,84 -20,110 Z"
            fill="none"
            stroke="#3FD7C4"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />

          {/* Upper City Footprints / Urban Fabric */}
          <Rect
            x="25"
            y="140"
            width="80"
            height="95"
            rx="8"
            fill="#121A38"
            fillOpacity="0.85"
          />
          <Rect
            x="25"
            y="140"
            width="80"
            height="95"
            rx="8"
            fill="url(#zellige-grid)"
          />

          <Rect
            x="125"
            y="130"
            width="130"
            height="85"
            rx="10"
            fill="#121A38"
            fillOpacity="0.9"
          />
          <Rect
            x="125"
            y="130"
            width="130"
            height="85"
            rx="10"
            fill="url(#zellige-grid)"
          />

          <Rect
            x="275"
            y="115"
            width="130"
            height="110"
            rx="10"
            fill="#121A38"
            fillOpacity="0.8"
          />
          <Rect
            x="275"
            y="115"
            width="130"
            height="110"
            rx="10"
            fill="url(#zellige-grid)"
          />

          {/* Mid-Tier Blocks (Racine Heart) */}
          <Rect
            x="20"
            y="270"
            width="105"
            height="140"
            rx="12"
            fill="#121A38"
            fillOpacity="0.95"
          />
          <Rect
            x="20"
            y="270"
            width="105"
            height="140"
            rx="12"
            fill="url(#zellige-grid)"
          />

          <Rect
            x="145"
            y="245"
            width="125"
            height="95"
            rx="8"
            fill="#161E3C"
            fillOpacity="0.75"
          />

          <Rect
            x="145"
            y="360"
            width="115"
            height="115"
            rx="10"
            fill="#121A38"
            fillOpacity="0.9"
          />
          <Rect
            x="145"
            y="360"
            width="115"
            height="115"
            rx="10"
            fill="url(#zellige-grid)"
          />

          <Rect
            x="290"
            y="250"
            width="115"
            height="160"
            rx="12"
            fill="#121A38"
            fillOpacity="0.85"
          />
          <Rect
            x="290"
            y="250"
            width="115"
            height="160"
            rx="12"
            fill="url(#zellige-grid)"
          />

          {/* Lower Urban Sector (Gauthier / Triangle d'Or Border) */}
          <Rect
            x="18"
            y="440"
            width="105"
            height="150"
            rx="10"
            fill="#121A38"
            fillOpacity="0.9"
          />
          <Rect
            x="150"
            y="505"
            width="125"
            height="135"
            rx="10"
            fill="#121A38"
            fillOpacity="0.85"
          />
          <Rect
            x="295"
            y="440"
            width="110"
            height="180"
            rx="12"
            fill="#121A38"
            fillOpacity="0.95"
          />
          <Rect
            x="295"
            y="440"
            width="110"
            height="180"
            rx="12"
            fill="url(#zellige-grid)"
          />
          <Rect
            x="20"
            y="620"
            width="120"
            height="160"
            rx="12"
            fill="#121A38"
            fillOpacity="0.8"
          />
          <Rect
            x="160"
            y="665"
            width="240"
            height="130"
            rx="12"
            fill="#121A38"
            fillOpacity="0.8"
          />

          {/* Tertiary Lanes & Alleys */}
          <Path
            d="M-10,310 L430,310"
            stroke="#161E3C"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <Path
            d="M-10,480 L430,460"
            stroke="#161E3C"
            strokeLinecap="round"
            strokeWidth="6"
          />
          <Path
            d="M75,100 L75,760"
            stroke="#161E3C"
            strokeLinecap="round"
            strokeWidth="5"
          />
          <Path
            d="M350,80 L350,780"
            stroke="#161E3C"
            strokeLinecap="round"
            strokeWidth="6"
          />

          {/* Secondary Avenues */}
          <Path
            d="M-20,235 L440,230"
            stroke="#212847"
            strokeLinejoin="round"
            strokeWidth="12"
          />
          <Path
            d="M-20,600 L440,590"
            stroke="#212847"
            strokeLinejoin="round"
            strokeWidth="14"
          />
          <Path
            d="M280,-10 L275,850"
            stroke="#212847"
            strokeLinejoin="round"
            strokeWidth="15"
          />

          {/* Major Arterials (Boulevards) */}
          {/* Bd d'Anfa Diagonal */}
          <Path
            d="M-40,680 L390,90"
            stroke="#2C3352"
            strokeLinecap="round"
            strokeWidth="22"
          />
          <Path
            d="M-40,680 L390,90"
            stroke="#FFD79B"
            strokeDasharray="8 10"
            strokeOpacity="0.4"
            strokeWidth="1"
          />

          {/* Bd Zerktouni Crossway */}
          <Path
            d="M-20,420 L440,410"
            stroke="#2C3352"
            strokeLinejoin="round"
            strokeWidth="26"
          />
          <Path
            d="M-20,420 L440,410"
            stroke="#A8AFFF"
            strokeDasharray="10 12"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />

          {/* Rue Jean Jaurès */}
          <Path
            d="M135,40 L135,840"
            stroke="#212847"
            strokeLinejoin="round"
            strokeWidth="14"
          />

          {/* Cartographic Typography Labels */}
          <SvgText
            x="210"
            y="398"
            fill="#DDE1FF"
            fillOpacity="0.45"
            fontSize="11"
            fontWeight="600"
            letterSpacing="1.5"
          >
            BD ZERKTOUNI
          </SvgText>
          <SvgText
            x="75"
            y="525"
            fill="#DDE1FF"
            fillOpacity="0.4"
            fontSize="11"
            fontWeight="600"
            letterSpacing="2"
            transform="rotate(-53 75 525)"
          >
            BOULEVARD D'ANFA
          </SvgText>
          <SvgText
            x="145"
            y="720"
            fill="#A8AFFF"
            fillOpacity="0.35"
            fontSize="10"
            fontWeight="500"
            letterSpacing="1"
          >
            RUE JEAN JAURÈS
          </SvgText>
          <SvgText
            x="310"
            y="340"
            fill="#A8AFFF"
            fillOpacity="0.3"
            fontSize="10"
            fontWeight="500"
          >
            RUE DE NORMANDIE
          </SvgText>
          <SvgText
            x="30"
            y="180"
            fill="#3FD7C4"
            fillOpacity="0.45"
            fontSize="13"
            fontWeight="700"
            letterSpacing="2.5"
          >
            RACINE
          </SvgText>
          <SvgText
            x="305"
            y="160"
            fill="#3FD7C4"
            fillOpacity="0.35"
            fontSize="13"
            fontWeight="700"
            letterSpacing="2"
          >
            GAUTHIER
          </SvgText>
        </Svg>

        {/* Artisan Pins & Markers */}
        {visibleMarkers.map((artisan) => (
          <Pressable
            key={artisan.id}
            onPress={() =>
              navigation?.navigate?.('PriceProposal', {
                selectedArtisan: artisan,
              })
            }
            style={[
              styles.artisanPinWrapper,
              {
                top: artisan.topPct,
                left: artisan.leftPct,
              },
            ]}
          >
            {/* Floating Rating or ETA Pill */}
            {artisan.badgeType && (
              <View style={styles.markerTagPill}>
                {artisan.badgeType === 'rating' && (
                  <MaterialIcons name="star" size={11} color="#FFD79B" />
                )}
                <Text
                  style={[
                    styles.markerTagText,
                    artisan.badgeType === 'eta' && { color: '#FFD79B' },
                  ]}
                >
                  {artisan.badgeText}
                </Text>
              </View>
            )}

            {/* 36px Trade Circle Badge */}
            <View
              style={[
                styles.artisanCircleBadge,
                {
                  backgroundColor: artisan.color,
                  shadowColor: artisan.color,
                },
              ]}
            >
              <MaterialIcons
                name={artisan.icon}
                size={19}
                color={artisan.iconColor}
              />

              {/* Verified Checkmark Dot */}
              {artisan.verified && (
                <View style={styles.verifiedOuterRing}>
                  <View style={styles.verifiedInnerCircle}>
                    <MaterialIcons name="check" size={8} color="#00201C" />
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        ))}

        {/* CLIENT LOCATION: Ahmed (Centered South-of-Center) */}
        <View style={styles.clientAnchorWrapper}>
          {/* Floating Address Pill */}
          <View style={styles.clientAddressPill}>
            <View style={styles.clientSaffronDot} />
            <Text style={styles.clientHereBold}>Vous êtes ici</Text>
            <Text style={styles.clientHereSub}>• Racine, Casablanca</Text>
          </View>

          {/* Glowing Saffron Pin with Expanding Blue GPS Radar Rings */}
          <View style={styles.clientRadarBox}>
            <Animated.View
              style={[
                styles.radarExpandingRing,
                {
                  transform: [{ scale: radarRingScale }],
                  opacity: radarRingOpacity,
                },
              ]}
            />
            <View style={styles.radarStaticHalo} />
            <View style={styles.clientHeroPin}>
              <MaterialIcons name="home" size={24} color="#6B4900" />
            </View>
          </View>
        </View>
      </Animated.View>

      {/* 2. Top City Label & Floating Minimal Action Bar */}
      <View
        style={[
          styles.topOverlayContainer,
          { paddingTop: Math.max(insets.top, 10) },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.citySubHeader} pointerEvents="none">
          <Text style={styles.cityLabel}>CASABLANCA</Text>
        </View>

        <View style={styles.topActionBar} pointerEvents="box-none">
          {/* Menu Drawer Trigger */}
          <Pressable
            onPress={() => navigation?.navigate?.('MenuDrawer')}
            style={({ pressed }) => [
              styles.menuBtn,
              pressed && styles.pressedScale95,
            ]}
            accessibilityLabel="Menu principal"
          >
            <MaterialIcons name="menu" size={22} color="#DDE1FF" />
          </Pressable>

          {/* Live Artisans Active Radar Pill */}
          <View style={styles.liveRadarPill}>
            <View style={styles.liveDotWrap}>
              <Animated.View
                style={[styles.liveDotPing, { opacity: liveDotAnim }]}
              />
              <View style={styles.liveDotCore} />
            </View>
            <Text style={styles.liveCountText}>
              {selectedTrade === 'all'
                ? '8 disponibles'
                : `${visibleMarkers.length} disponibles`}
            </Text>
            <Text style={styles.liveSubText}>en direct</Text>
          </View>
        </View>
      </View>

      {/* 3. Right Side Utility Controls (Floating Glass Stack) */}
      <View
        style={[
          styles.utilityStack,
          { top: Math.max(insets.top, 10) + 96 },
        ]}
      >
        <Pressable
          onPress={() => animateZoomTo(zoomScale + 0.14)}
          style={({ pressed }) => [
            styles.utilityBtn,
            pressed && styles.pressedScale90,
          ]}
          accessibilityLabel="Zoom avant"
        >
          <MaterialIcons name="add" size={20} color="#DDE1FF" />
        </Pressable>

        <Pressable
          onPress={() => animateZoomTo(zoomScale - 0.14)}
          style={({ pressed }) => [
            styles.utilityBtn,
            pressed && styles.pressedScale90,
          ]}
          accessibilityLabel="Zoom arrière"
        >
          <MaterialIcons name="remove" size={20} color="#DDE1FF" />
        </Pressable>

        <Pressable
          onPress={() => animateZoomTo(1)}
          style={({ pressed }) => [
            styles.utilityBtn,
            { marginTop: 4 },
            pressed && styles.pressedScale90,
          ]}
          accessibilityLabel="Recentrer ma position"
        >
          <MaterialIcons name="my-location" size={21} color="#FFB300" />
        </Pressable>

        <Pressable
          onPress={handleCycleFilter}
          style={({ pressed }) => [
            styles.utilityBtn,
            { marginTop: 4 },
            selectedTrade !== 'all' && styles.utilityBtnFiltered,
            pressed && styles.pressedScale90,
          ]}
          accessibilityLabel="Filtres des corps d'état"
        >
          <MaterialIcons name="tune" size={20} color="#63F4E0" />
          {selectedTrade !== 'all' && <View style={styles.filterActiveDot} />}
        </Pressable>
      </View>

      {/* 4. Discreet Trade Legend Float (Bottom Right Above Peek Dock) */}
      <View
        style={[
          styles.legendCard,
          { bottom: Math.max(insets.bottom, 12) + 82 },
        ]}
      >
        <Pressable
          onPress={() =>
            setSelectedTrade((prev) =>
              prev === 'plumbing' ? 'all' : 'plumbing'
            )
          }
          style={[
            styles.legendRow,
            selectedTrade !== 'all' &&
              selectedTrade !== 'plumbing' &&
              styles.legendRowDimmed,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#63F4E0' }]} />
          <Text style={styles.legendText}>Plomberie</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setSelectedTrade((prev) =>
              prev === 'electricity' ? 'all' : 'electricity'
            )
          }
          style={[
            styles.legendRow,
            selectedTrade !== 'all' &&
              selectedTrade !== 'electricity' &&
              styles.legendRowDimmed,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#FFB300' }]} />
          <Text style={styles.legendText}>Électricité</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            setSelectedTrade((prev) =>
              prev === 'painting' ? 'all' : 'painting'
            )
          }
          style={[
            styles.legendRow,
            selectedTrade !== 'all' &&
              selectedTrade !== 'painting' &&
              styles.legendRowDimmed,
          ]}
        >
          <View style={[styles.legendDot, { backgroundColor: '#FFB4AB' }]} />
          <Text style={styles.legendText}>Peinture</Text>
        </Pressable>
      </View>

      {/* 5. Bottom Sheet Peek (~72px Visible Dock) */}
      <Pressable
        onPress={() => {
          if (navigation?.canGoBack?.()) {
            navigation.goBack();
          } else {
            navigation?.navigate?.('MapHome');
          }
        }}
        style={({ pressed }) => [
          styles.bottomPeekDock,
          {
            paddingBottom: Math.max(insets.bottom, 12),
            height: 64 + Math.max(insets.bottom, 12),
          },
          pressed && styles.bottomPeekPressed,
        ]}
      >
        {/* Centered Drag Handle Pill */}
        <View style={styles.peekDragHandle} />

        {/* Single Peek Row */}
        <View style={styles.peekRow}>
          <View style={styles.peekLeft}>
            <View style={styles.peekIconCircle}>
              <MaterialIcons name="handyman" size={18} color="#FFB300" />
            </View>
            <View style={styles.peekTextCol}>
              <Text style={styles.peekTitle} numberOfLines={1}>
                14 artisans disponibles à proximité
              </Text>
              <Text style={styles.peekSubtitle} numberOfLines={1}>
                Glisser vers le haut pour demander un dépannage
              </Text>
            </View>
          </View>

          <View style={styles.peekChevronCircle}>
            <MaterialIcons
              name="keyboard-arrow-up"
              size={20}
              color="#D6C4AC"
            />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  mapViewport: {
    ...StyleSheet.absoluteFillObject,
  },
  // Top Overlay & Floating Bar
  topOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  citySubHeader: {
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  cityLabel: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#DDE1FF',
    letterSpacing: 0.6,
  },
  topActionBar: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  liveRadarPill: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  liveDotWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  liveDotPing: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFD79B',
  },
  liveDotCore: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FFB300',
  },
  liveCountText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
    letterSpacing: -0.2,
  },
  liveSubText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  // Right Side Utility Controls
  utilityStack: {
    position: 'absolute',
    right: 16,
    gap: 8,
    zIndex: 30,
  },
  utilityBtn: {
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
  utilityBtnFiltered: {
    borderWidth: 1,
    borderColor: 'rgba(99, 244, 224, 0.5)',
  },
  filterActiveDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#63F4E0',
  },
  // Artisan Pins
  artisanPinWrapper: {
    position: 'absolute',
    transform: [{ translateX: -20 }, { translateY: -24 }],
    alignItems: 'center',
    zIndex: 20,
  },
  markerTagPill: {
    marginBottom: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: '#2C3352',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  markerTagText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  artisanCircleBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  verifiedOuterRing: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedInnerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#69F9E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Client Location Hero Pin
  clientAnchorWrapper: {
    position: 'absolute',
    top: '53.0%',
    left: '44.0%',
    transform: [{ translateX: -105 }, { translateY: -48 }],
    alignItems: 'center',
    zIndex: 40,
  },
  clientAddressPill: {
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.96)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  clientSaffronDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFB300',
  },
  clientHereBold: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  clientHereSub: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  clientRadarBox: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarExpandingRing: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#1023D7',
  },
  radarStaticHalo: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(16, 35, 215, 0.32)',
  },
  clientHeroPin: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFB300',
    borderWidth: 4,
    borderColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 10,
  },
  // Discreet Trade Legend Float
  legendCard: {
    position: 'absolute',
    right: 16,
    zIndex: 30,
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(33, 40, 71, 0.88)',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendRowDimmed: {
    opacity: 0.38,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  // Bottom Sheet Peek
  bottomPeekDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#212847',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 10,
    justifyContent: 'space-between',
    zIndex: 40,
    shadowColor: '#040B2A',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.85,
    shadowRadius: 18,
    elevation: 20,
  },
  bottomPeekPressed: {
    backgroundColor: '#2C3352',
  },
  peekDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2C3352',
    alignSelf: 'center',
  },
  peekRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  peekLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  peekIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peekTextCol: {
    flex: 1,
    minWidth: 0,
  },
  peekTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  peekSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  peekChevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale90: {
    transform: [{ scale: 0.9 }],
  },
});