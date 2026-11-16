import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Animated,
  Easing,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Pattern,
  Path,
  Rect,
  Line,
  Circle,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SearchingArtisanScreen({ navigation, route }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();

  const proposedPrice = route?.params?.price ?? 80;
  const serviceLabel =
    route?.params?.serviceTitle || "Plomberie • Fuite d'eau";

  const [isCancelled, setIsCancelled] = useState(false);

  const spinAnim = useRef(new Animated.Value(0)).current;
  const outerRingAnim = useRef(new Animated.Value(0.65)).current;
  const ahmedPingAnim = useRef(new Animated.Value(0.35)).current;
  const liveDotAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0.58)).current;

  useEffect(() => {
    if (isCancelled) return;

    const sweepLoop = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const ringPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(outerRingAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(outerRingAnim, {
          toValue: 0.55,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    const pingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(ahmedPingAnim, {
          toValue: 0.9,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(ahmedPingAnim, {
          toValue: 0.25,
          duration: 950,
          useNativeDriver: true,
        }),
      ])
    );

    const dotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotAnim, {
          toValue: 0.3,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(liveDotAnim, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );

    const progressLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 0.92,
          duration: 4800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0.58,
          duration: 600,
          useNativeDriver: false,
        }),
      ])
    );

    sweepLoop.start();
    ringPulse.start();
    pingLoop.start();
    dotLoop.start();
    progressLoop.start();

    return () => {
      sweepLoop.stop();
      ringPulse.stop();
      pingLoop.stop();
      dotLoop.stop();
      progressLoop.stop();
    };
  }, [
    isCancelled,
    spinAnim,
    outerRingAnim,
    ahmedPingAnim,
    liveDotAnim,
    progressAnim,
  ]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const handleCancelRequest = () => {
    if (isCancelled) return;
    Alert.alert(
      'Annuler la recherche',
      'Voulez-vous interrompre la recherche en cours à Casablanca Racine ?',
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Annuler la demande',
          style: 'destructive',
          onPress: () => {
            setIsCancelled(true);
            setTimeout(() => {
              if (navigation?.canGoBack?.()) {
                navigation.goBack();
              } else {
                navigation?.navigate?.('RequestDetails');
              }
            }, 650);
          },
        },
      ]
    );
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
        {/* 1. Dynamic Interactive Radar Map Area */}
        <View
          style={[
            styles.mapContainer,
            { backgroundColor: colors.surfaceContainerLowest },
          ]}
        >
          {/* Top Floating Controls Layer */}
          <View
            style={[
              styles.topFloatingHeader,
              { paddingTop: Math.max(insets.top, 10) + 6 },
            ]}
          >
            {/* Back Button */}
            <Pressable
              onPress={() => {
                if (navigation?.canGoBack?.()) {
                  navigation.goBack();
                } else {
                  navigation?.navigate?.('RequestDetails');
                }
              }}
              style={({ pressed }) => [
                styles.backCircleBtn,
                pressed && styles.pressedScale95,
              ]}
              accessibilityLabel="Retour"
            >
              <MaterialIcons name="arrow-back" size={20} color="#DDE1FF" />
            </Pressable>

            {/* Neighborhood Live Pill */}
            <View style={styles.neighborhoodLivePill}>
              <View style={styles.pingWrap}>
                <Animated.View
                  style={[styles.pingOuterDot, { opacity: liveDotAnim }]}
                />
                <View style={styles.pingInnerDot} />
              </View>
              <Text style={styles.neighborhoodLiveText}>
                Casablanca • Racine
              </Text>
            </View>

            {/* Active Broadcast Counter Pill */}
            <View style={styles.nearbyCountPill}>
              <Animated.View style={{ opacity: liveDotAnim }}>
                <MaterialIcons name="radar" size={15} color="#63F4E0" />
              </Animated.View>
              <Text style={styles.nearbyCountText}>3 proches</Text>
            </View>
          </View>

          {/* Stylized Vector Map of Racine, Casablanca */}
          <Svg
            width={SCREEN_WIDTH}
            height={520}
            viewBox="0 0 390 520"
            preserveAspectRatio="xMidYMid slice"
            style={StyleSheet.absoluteFill}
          >
            <Defs>
              {/* Zellige 8-point geometric star pattern for city block watermarks */}
              <Pattern
                id="zellige-pattern"
                width="36"
                height="36"
                patternUnits="userSpaceOnUse"
              >
                <Path
                  d="M18,0 L22,10 L32,6 L28,16 L36,18 L26,22 L30,32 L20,28 L18,36 L14,26 L4,30 L8,20 L0,18 L10,14 L6,4 L16,8 Z"
                  fill="none"
                  stroke="#2C3352"
                  strokeOpacity="0.16"
                  strokeWidth="0.75"
                />
              </Pattern>
            </Defs>

            {/* Base Bed */}
            <Rect x="0" y="0" width="390" height="520" fill="#09112F" />

            {/* District Urban Blocks with Zellige Watermark */}
            <Rect x="15" y="24" width="110" height="96" rx="8" fill="#121A38" />
            <Rect
              x="15"
              y="24"
              width="110"
              height="96"
              rx="8"
              fill="url(#zellige-pattern)"
            />

            <Rect x="140" y="10" width="235" height="110" rx="8" fill="#121A38" />
            <Rect
              x="140"
              y="10"
              width="235"
              height="110"
              rx="8"
              fill="url(#zellige-pattern)"
            />

            <Rect x="15" y="136" width="105" height="140" rx="8" fill="#121A38" />
            <Rect
              x="15"
              y="136"
              width="105"
              height="140"
              rx="8"
              fill="url(#zellige-pattern)"
            />

            <Rect
              x="270"
              y="136"
              width="105"
              height="135"
              rx="8"
              fill="#121A38"
            />
            <Rect
              x="270"
              y="136"
              width="105"
              height="135"
              rx="8"
              fill="url(#zellige-pattern)"
            />

            <Rect x="15" y="292" width="120" height="190" rx="8" fill="#121A38" />
            <Rect
              x="15"
              y="292"
              width="120"
              height="190"
              rx="8"
              fill="url(#zellige-pattern)"
            />

            <Rect
              x="260"
              y="288"
              width="115"
              height="195"
              rx="8"
              fill="#121A38"
            />
            <Rect
              x="260"
              y="288"
              width="115"
              height="195"
              rx="8"
              fill="url(#zellige-pattern)"
            />

            {/* Major Casablanca Arterial Roads */}
            {/* Bd Zerktouni (Diagonal) */}
            <Line
              x1="-30"
              y1="90"
              x2="420"
              y2="390"
              stroke="#161E3C"
              strokeWidth="26"
              strokeLinecap="round"
            />
            <Line
              x1="-30"
              y1="90"
              x2="420"
              y2="390"
              stroke="#212847"
              strokeWidth="18"
              strokeLinecap="round"
            />

            {/* Bd d'Anfa */}
            <Line
              x1="135"
              y1="-10"
              x2="135"
              y2="530"
              stroke="#161E3C"
              strokeWidth="22"
              strokeLinecap="round"
            />
            <Line
              x1="135"
              y1="-10"
              x2="135"
              y2="530"
              stroke="#212847"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Rue El Bohtori / Av Marrakech */}
            <Line
              x1="-10"
              y1="284"
              x2="400"
              y2="284"
              stroke="#161E3C"
              strokeWidth="18"
              strokeLinecap="round"
            />
            <Line
              x1="-10"
              y1="284"
              x2="400"
              y2="284"
              stroke="#212847"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <Line
              x1="255"
              y1="120"
              x2="255"
              y2="520"
              stroke="#212847"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Casablanca Street Labels */}
            <SvgText
              x="32"
              y="70"
              fill="#514532"
              fontSize="8.5"
              fontWeight="700"
              letterSpacing="1.2"
            >
              RUE AHMED EL MEJJATI
            </SvgText>
            <SvgText
              x="144"
              y="65"
              fill="#9E8E78"
              fontSize="9"
              fontWeight="700"
              letterSpacing="1.5"
            >
              BD D'ANFA
            </SvgText>
            <SvgText
              x="210"
              y="200"
              fill="#FFD79B"
              fillOpacity="0.4"
              fontSize="9.5"
              fontWeight="700"
              letterSpacing="2"
              transform="rotate(33 210 200)"
            >
              BD ZERKTOUNI
            </SvgText>
            <SvgText
              x="30"
              y="278"
              fill="#9E8E78"
              fontSize="8.5"
              fontWeight="700"
              letterSpacing="1.2"
            >
              RUE EL BOHTORI
            </SvgText>
            <SvgText
              x="270"
              y="340"
              fill="#514532"
              fontSize="8"
              fontWeight="600"
              letterSpacing="1.1"
            >
              AV. MARRAKECH
            </SvgText>

            {/* Subtle POI Map Markers in Racine */}
            <Circle cx="85" cy="80" r="3.5" fill="#303757" />
            <Circle cx="95" cy="205" r="3" fill="#303757" />
            <Circle cx="310" cy="95" r="3" fill="#303757" />
            <Circle cx="330" cy="385" r="3.5" fill="#303757" />
          </Svg>

          {/* Concentric Radar Search Ripples */}
          <Animated.View
            style={[styles.radarRingOuter, { opacity: outerRingAnim }]}
            pointerEvents="none"
          />
          <View style={styles.radarRingMiddle} pointerEvents="none" />
          <View style={styles.radarRingInner} pointerEvents="none" />

          {/* Sweeping Radar Sector (360° Smooth Rotation) */}
          {!isCancelled && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.radarSweepWrap,
                { transform: [{ rotate: spinInterpolate }] },
              ]}
            >
              <Svg width={380} height={380} viewBox="0 0 380 380">
                <Defs>
                  <LinearGradient
                    id="radarSweepGrad"
                    x1="0%"
                    y1="50%"
                    x2="100%"
                    y2="0%"
                  >
                    <Stop offset="0%" stopColor="#1023D7" stopOpacity="0" />
                    <Stop offset="55%" stopColor="#1023D7" stopOpacity="0.24" />
                    <Stop offset="100%" stopColor="#FFB300" stopOpacity="0.46" />
                  </LinearGradient>
                </Defs>
                {/* Top-Left Quadrant Sweep Leading into 12-o'clock Saffron Edge */}
                <Path
                  d="M 190 190 L 0 190 A 190 190 0 0 1 190 0 Z"
                  fill="url(#radarSweepGrad)"
                />
                <Line
                  x1="190"
                  y1="190"
                  x2="190"
                  y2="0"
                  stroke="#FFB300"
                  strokeOpacity="0.7"
                  strokeWidth="1.5"
                />
              </Svg>
            </Animated.View>
          )}

          {/* Client Center Saffron Home Pin */}
          <View style={styles.clientCenterPin}>
            <View style={styles.clientSaffronCircle}>
              <MaterialIcons name="home" size={26} color="#6B4900" />
            </View>
            <View style={styles.clientShadowDot} />
            <View style={styles.vousPillBadge}>
              <Text style={styles.vousPillText}>Vous • Racine</Text>
            </View>
          </View>

          {/* Worker 1: Detected Nearby Edge of Inner Wave (Plumber - Teal Ping Glow) */}
          <Pressable
            onPress={() => navigation?.navigate?.('OffersList')}
            style={styles.workerAhmedPos}
          >
            <View style={styles.ahmedPingBox}>
              <Animated.View
                style={[styles.ahmedTealHalo, { opacity: ahmedPingAnim }]}
              />
              <View style={styles.ahmedIconCircle}>
                <MaterialIcons name="plumbing" size={18} color="#63F4E0" />
              </View>
            </View>
            <View style={styles.ahmedNameTag}>
              <Text style={styles.ahmedNameText}>Ahmed • 350m</Text>
            </View>
          </Pressable>

          {/* Worker 2: Electrician Outside Middle Ring */}
          <View style={styles.workerKarimPos}>
            <View style={styles.secondaryWorkerCircle}>
              <MaterialIcons name="bolt" size={15} color="#FFD79B" />
            </View>
            <Text style={styles.secondaryWorkerName}>Karim</Text>
          </View>

          {/* Worker 3: Multi-trade Craftsman Outside Perimeter */}
          <View style={styles.workerYoussefPos}>
            <View style={styles.secondaryWorkerCircle}>
              <MaterialIcons name="format-paint" size={15} color="#BDC2FF" />
            </View>
            <Text style={styles.secondaryWorkerName}>Youssef</Text>
          </View>

          {/* Worker 4: Plumber in Transit Outside Perimeter */}
          <View style={styles.workerRachidPos}>
            <View style={styles.secondaryWorkerCircle}>
              <MaterialIcons name="construction" size={15} color="#63F4E0" />
            </View>
            <Text style={styles.secondaryWorkerName}>Rachid</Text>
          </View>
        </View>

        {/* 2. Bottom Sheet Docked Container */}
        <View
          style={[
            styles.bottomSheet,
            { paddingBottom: Math.max(insets.bottom, 14) + 10 },
          ]}
        >
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header & Searching Status */}
          <View style={styles.sheetHeaderBlock}>
            <View style={styles.titleStatusRow}>
              <Text style={styles.sheetHeading}>
                {isCancelled ? 'Recherche interrompue' : 'Recherche en cours...'}
              </Text>
              <View style={styles.cityBadge}>
                <Text style={styles.cityBadgeText}>Casablanca</Text>
              </View>
            </View>

            <Text style={styles.sheetSubtitle} numberOfLines={2}>
              Diffusion de votre demande aux artisans vérifiés et disponibles
              autour du quartier Racine.
            </Text>
          </View>

          {/* Animated Radar Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: isCancelled ? '0%' : progressWidth,
                  },
                ]}
              />
            </View>

            <View style={styles.progressMetaRow}>
              <View style={styles.metaItemLeft}>
                <MaterialIcons name="schedule" size={15} color="#FFD79B" />
                <Text style={styles.metaTimeText}>
                  Temps estimé : ~45 sec
                </Text>
              </View>

              <View style={styles.metaItemRight}>
                <MaterialIcons name="group" size={15} color="#63F4E0" />
                <Text style={styles.metaNotifiedText}>
                  3 artisans notifiés
                </Text>
              </View>
            </View>
          </View>

          {/* Quick Service Order Recap Tile */}
          <View style={styles.orderRecapCard}>
            <View style={styles.recapLeft}>
              <View style={styles.recapIconBox}>
                <MaterialIcons name="plumbing" size={22} color="#63F4E0" />
              </View>
              <View style={styles.recapTexts}>
                <Text style={styles.recapServiceTitle} numberOfLines={1}>
                  {serviceLabel}
                </Text>
                <Text style={styles.recapPriceText}>
                  {proposedPrice} DH proposé
                </Text>
              </View>
            </View>

            <View style={styles.standardBadge}>
              <Text style={styles.standardBadgeText}>Standard</Text>
            </View>
          </View>

          {/* Moroccan Trust & Security Assurance Badge */}
          <View style={styles.trustBanner}>
            <MaterialIcons name="verified" size={18} color="#FFD79B" />
            <Text style={styles.trustBannerText}>
              Artisans certifiés InHome avec garantie d'intervention sous 1h.
            </Text>
          </View>

          {/* Cancellation Button */}
          <Pressable
            onPress={handleCancelRequest}
            style={({ pressed }) => [
              styles.cancelBtn,
              pressed && styles.pressedOpacity70,
            ]}
          >
            <Text
              style={[
                styles.cancelBtnText,
                isCancelled && styles.cancelledErrorText,
              ]}
            >
              {isCancelled ? 'Demande annulée' : 'Annuler la demande'}
            </Text>
          </Pressable>
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
  // Radar Map Area
  mapContainer: {
    width: '100%',
    height: 520,
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topFloatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  backCircleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  neighborhoodLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pingWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pingOuterDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#63F4E0',
  },
  pingInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#63F4E0',
  },
  neighborhoodLiveText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#DDE1FF',
    letterSpacing: 0.3,
  },
  nearbyCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: '#161E3C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nearbyCountText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  // Concentric Radar Rings
  radarRingOuter: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: 'rgba(16, 35, 215, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 155, 0.16)',
  },
  radarRingMiddle: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(16, 35, 215, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 155, 0.3)',
  },
  radarRingInner: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(16, 35, 215, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 155, 0.6)',
  },
  radarSweepWrap: {
    position: 'absolute',
    width: 380,
    height: 380,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Client Center Pin
  clientCenterPin: {
    zIndex: 20,
    alignItems: 'center',
  },
  clientSaffronCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  clientShadowDot: {
    width: 20,
    height: 7,
    borderRadius: 9999,
    backgroundColor: 'rgba(40, 25, 0, 0.55)',
    marginTop: 4,
  },
  vousPillBadge: {
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
  },
  vousPillText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#FFD79B',
    letterSpacing: 0.3,
  },
  // Nearby Artisan Pins
  workerAhmedPos: {
    position: 'absolute',
    top: 158,
    right: 54,
    zIndex: 15,
    alignItems: 'center',
  },
  ahmedPingBox: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ahmedTealHalo: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(99, 244, 224, 0.32)',
  },
  ahmedIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ahmedNameTag: {
    marginTop: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#161E3C',
  },
  ahmedNameText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    color: '#DDE1FF',
  },
  workerKarimPos: {
    position: 'absolute',
    bottom: 130,
    left: 42,
    zIndex: 10,
    alignItems: 'center',
  },
  workerYoussefPos: {
    position: 'absolute',
    top: 94,
    left: 68,
    zIndex: 10,
    alignItems: 'center',
  },
  workerRachidPos: {
    position: 'absolute',
    bottom: 145,
    right: 50,
    zIndex: 10,
    alignItems: 'center',
  },
  secondaryWorkerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  secondaryWorkerName: {
    marginTop: 2,
    fontFamily: tokens.fonts.regular,
    fontSize: 9.5,
    lineHeight: 12,
    color: '#D6C4AC',
  },
  // Bottom Sheet Docked Container
  bottomSheet: {
    marginTop: -18,
    zIndex: 30,
    width: '100%',
    backgroundColor: '#161E3C',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowColor: '#040B2A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 18,
  },
  dragHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2C3352',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeaderBlock: {
    gap: 6,
  },
  titleStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sheetHeading: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: '#DDE1FF',
    flex: 1,
  },
  cityBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(63, 215, 196, 0.2)',
    flexShrink: 0,
  },
  cityBadgeText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#63F4E0',
  },
  sheetSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: '#D6C4AC',
  },
  // Animated Radar Progress Indicator
  progressSection: {
    gap: 8,
    marginTop: 16,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#212847',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFB300',
    borderRadius: 3,
  },
  progressMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  metaItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  metaTimeText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#D6C4AC',
  },
  metaItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  metaNotifiedText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#63F4E0',
  },
  // Quick Service Order Recap Tile
  orderRecapCard: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#121A38',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  recapLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  recapIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  recapTexts: {
    flex: 1,
    minWidth: 0,
  },
  recapServiceTitle: {
    fontFamily: tokens.fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: '#DDE1FF',
  },
  recapPriceText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#FFD79B',
    marginTop: 1,
  },
  standardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#2C3352',
    flexShrink: 0,
  },
  standardBadgeText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#DDE1FF',
  },
  // Moroccan Trust & Security Assurance Badge
  trustBanner: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(4, 11, 42, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trustBannerText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
    flex: 1,
  },
  // Cancellation Button
  cancelBtn: {
    marginTop: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: '#D6C4AC',
  },
  cancelledErrorText: {
    color: '#FFB4AB',
    fontWeight: '600',
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedOpacity70: {
    opacity: 0.7,
  },
});