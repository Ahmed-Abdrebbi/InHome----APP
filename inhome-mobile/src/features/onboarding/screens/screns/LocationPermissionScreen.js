import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Animated,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Pattern,
  Rect,
  Path,
  Circle,
  Ellipse,
  Line,
  G,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LocationPermissionScreen({ navigation, onComplete }) {
  const { colors } = majorelleTheme;
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'granted'
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const goNext = () => {
    if (typeof onComplete === 'function') {
      onComplete();
      return;
    }
    if (navigation?.navigate) {
      navigation.navigate('Login');
    }
  };

  const handleEnableLocation = async () => {
    if (status === 'loading') return;
    setStatus('loading');

    try {
      const { status: permStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (permStatus === 'granted') {
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }).catch(() => null);
      }
      setStatus('granted');
      setTimeout(goNext, 450);
    } catch (_err) {
      setStatus('granted');
      setTimeout(goNext, 350);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Subtle Moroccan Zellige Background Motif (~4% opacity) */}
      <View
        style={[StyleSheet.absoluteFill, styles.zelligeOverlay]}
        pointerEvents="none"
      >
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="zellige-grid"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <G fill="none" stroke="#DDE1FF" strokeWidth="1.5">
                <Path d="M40 0 L52 28 L80 40 L52 52 L40 80 L28 52 L0 40 L28 28 Z" />
                <Path d="M0 0 L15 15 L0 30 L-15 15 Z" />
                <Path d="M80 0 L95 15 L80 30 L65 15 Z" />
                <Path d="M0 80 L15 95 L0 110 L-15 95 Z" />
                <Path d="M80 80 L95 95 L80 110 L65 95 Z" />
                <Circle cx="40" cy="40" r="10" />
                <Line x1="0" y1="40" x2="80" y2="40" />
                <Line x1="40" y1="0" x2="40" y2="80" />
              </G>
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#zellige-grid)" />
        </Svg>
      </View>

      {/* 2. Ambient Radial Glow Behind Illustration */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          <Defs>
            <RadialGradient id="illustrationAmbientGlow" cx="50%" cy="28%" r="45%">
              <Stop offset="0%" stopColor="#1023D7" stopOpacity="0.24" />
              <Stop offset="60%" stopColor="#1023D7" stopOpacity="0.07" />
              <Stop offset="100%" stopColor="#1023D7" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect
            width="100%"
            height="100%"
            fill="url(#illustrationAmbientGlow)"
          />
        </Svg>
      </View>

      {/* 3. Main Content */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.innerContent}>
          {/* Header: Minimalist Top Bar with Brand & Passer */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandIconBox}>
                <MaterialIcons name="roofing" size={20} color="#FFB300" />
              </View>
              <View style={styles.brandTextGroup}>
                <Text style={styles.brandName}>InHome</Text>
                <View style={styles.brandTealDot} />
              </View>
            </View>

            <Pressable
              onPress={goNext}
              style={({ pressed }) => [
                styles.skipPill,
                pressed && styles.skipPillPressed,
              ]}
            >
              <Text style={styles.skipPillText}>Passer</Text>
            </Pressable>
          </View>

          {/* Center Stage: Vector Illustration (Radar + Moroccan House + Resident + Trade Badges) */}
          <View style={styles.illustrationStage}>
            <View style={styles.svgFrame}>
              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 340 340"
                fill="none"
              >
                <Defs>
                  <SvgLinearGradient
                    id="radarGradient"
                    x1="170"
                    y1="170"
                    x2="260"
                    y2="40"
                    gradientUnits="userSpaceOnUse"
                  >
                    <Stop offset="0%" stopColor="#3949F0" stopOpacity="0.5" />
                    <Stop offset="100%" stopColor="#63F4E0" stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>

                {/* Concentric Sonar / Geolocation Rings */}
                <Circle
                  cx="170"
                  cy="170"
                  r="150"
                  stroke="#212847"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  opacity="0.6"
                />
                <Circle
                  cx="170"
                  cy="170"
                  r="115"
                  stroke="#212847"
                  strokeWidth="1.2"
                  opacity="0.8"
                />
                <Circle
                  cx="170"
                  cy="170"
                  r="75"
                  stroke="#212847"
                  strokeWidth="1.2"
                  strokeDasharray="6 4"
                />

                {/* Radar Scanning Wave Cone */}
                <Path
                  d="M170 170 L275 65 A150 150 0 0 0 170 20 Z"
                  fill="url(#radarGradient)"
                  opacity="0.35"
                />

                {/* Ground Blueprint Matrix Lines */}
                <Ellipse cx="170" cy="245" rx="125" ry="36" fill="#121A38" />
                <Path
                  d="M60 245 C60 260 110 275 170 275 C230 275 280 260 280 245"
                  stroke="#2C3352"
                  strokeWidth="1"
                />
                <Line
                  x1="170"
                  y1="210"
                  x2="170"
                  y2="275"
                  stroke="#2C3352"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <Line
                  x1="110"
                  y1="228"
                  x2="110"
                  y2="262"
                  stroke="#2C3352"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <Line
                  x1="230"
                  y1="228"
                  x2="230"
                  y2="262"
                  stroke="#2C3352"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Moroccan Inspired Geometric Contemporary House */}
                <G transform="translate(68, 140)">
                  {/* Base Structure */}
                  <Path d="M10 70 L10 102 L95 102 L95 70 Z" fill="#1023D7" />
                  <Path d="M95 50 L95 102 L145 102 L145 50 Z" fill="#161E3C" />

                  {/* Moroccan Arch Entryway Door */}
                  <Path
                    d="M35 102 L35 84 C35 76 43 72 52 72 C61 72 69 76 69 84 L69 102 Z"
                    fill="#09112F"
                  />
                  <Path
                    d="M43 84 C43 79 48 76 52 76 C56 76 61 79 61 84 L61 102 L43 102 Z"
                    fill="#FFB300"
                    opacity="0.3"
                  />

                  {/* Modern Cantilever Upper Floor */}
                  <Path d="M0 45 L95 45 L95 70 L0 70 Z" fill="#212847" />

                  {/* Glowing Geometric Windows */}
                  <Rect
                    x="15"
                    y="52"
                    width="24"
                    height="11"
                    rx="2"
                    fill="#FFD79B"
                    opacity="0.9"
                  />
                  <Rect
                    x="47"
                    y="52"
                    width="38"
                    height="11"
                    rx="2"
                    fill="#FFD79B"
                    opacity="0.95"
                  />

                  {/* Pergola / Terrace Slats on Flat Roof */}
                  <Line
                    x1="8"
                    y1="40"
                    x2="88"
                    y2="40"
                    stroke="#3FD7C4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <Line
                    x1="18"
                    y1="45"
                    x2="18"
                    y2="40"
                    stroke="#2C3352"
                    strokeWidth="2"
                  />
                  <Line
                    x1="48"
                    y1="45"
                    x2="48"
                    y2="40"
                    stroke="#2C3352"
                    strokeWidth="2"
                  />
                  <Line
                    x1="78"
                    y1="45"
                    x2="78"
                    y2="40"
                    stroke="#2C3352"
                    strokeWidth="2"
                  />
                  <Rect
                    x="108"
                    y="60"
                    width="22"
                    height="22"
                    rx="3"
                    fill="#FFD79B"
                    opacity="0.8"
                  />
                </G>

                {/* Saffron Location Beacon Pin Floating Over House */}
                <G transform="translate(108, 68)">
                  <Circle cx="16" cy="16" r="28" fill="#FFB300" opacity="0.12" />
                  <Circle cx="16" cy="16" r="19" fill="#FFB300" opacity="0.25" />
                  <Path
                    d="M16 2 C8.268 2 2 8.268 2 16 C2 25.5 16 38 16 38 C16 38 30 25.5 30 16 C30 8.268 23.732 2 16 2 Z"
                    fill="#FFB300"
                  />
                  <Circle cx="16" cy="14" r="5.5" fill="#432C00" />
                </G>

                {/* Flat Vector Character: Resident with Smartphone */}
                <G transform="translate(202, 168)">
                  <Ellipse
                    cx="28"
                    cy="88"
                    rx="20"
                    ry="5"
                    fill="#040B2A"
                    opacity="0.7"
                  />
                  {/* Legs */}
                  <Path
                    d="M21 54 L19 86 L26 86 L30 58 L34 86 L41 86 L37 54 Z"
                    fill="#09112F"
                  />
                  {/* Sneakers */}
                  <Path d="M16 86 L26 86 L26 89 L14 89 Z" fill="#DDE1FF" />
                  <Path d="M34 86 L44 86 L44 89 L32 89 Z" fill="#DDE1FF" />
                  {/* Saffron Gold Jacket */}
                  <Path
                    d="M15 22 C15 17 38 17 41 22 L45 54 L12 54 Z"
                    fill="#FFB300"
                  />
                  <Path d="M26 22 L27 54" stroke="#6B4900" strokeWidth="1.5" />
                  {/* Head & Hair */}
                  <Circle cx="28" cy="11" r="7.5" fill="#FFD79B" />
                  <Path
                    d="M21 9 C22 4 33 3 35 7 C35 9 34 11 34 11 L22 11 Z"
                    fill="#040B2A"
                  />
                  {/* Left Arm Holding Phone */}
                  <Path
                    d="M14 24 L7 38 L16 43"
                    stroke="#FFB300"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="17" cy="43" r="2.5" fill="#FFD79B" />
                  {/* Glowing Smartphone */}
                  <Rect
                    x="16"
                    y="36"
                    width="7"
                    height="12"
                    rx="1.5"
                    fill="#63F4E0"
                    transform="rotate(-15 16 36)"
                  />
                  <Path
                    d="M18 36 L24 28 L30 38 Z"
                    fill="#63F4E0"
                    opacity="0.35"
                  />
                  {/* Right Arm Relaxed */}
                  <Path
                    d="M41 24 L45 38 L43 48"
                    stroke="#FFB300"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </G>

                {/* Floating Trade Badge 1: Wrench (Plomberie) - Teal */}
                <G transform="translate(18, 92)">
                  <Circle cx="22" cy="22" r="21" fill="#161E3C" />
                  <Circle
                    cx="22"
                    cy="22"
                    r="21"
                    fill="#3FD7C4"
                    fillOpacity="0.1"
                    stroke="#3FD7C4"
                    strokeWidth="1.2"
                  />
                  <Path
                    d="M28 14 C26.5 12.5 24.3 12.2 22.8 13.2 L25 15.4 L23.5 16.9 L21.3 14.7 C20.3 16.2 20.6 18.4 22.1 19.9 C22.9 20.7 23.9 21.1 25 21.1 L28.2 29 C28.4 29.5 29 29.8 29.5 29.6 L30.6 29.1 C31.1 28.9 31.3 28.3 31.1 27.8 L28 21.6 C28.9 20.4 28.8 18.7 28 17.8 Z"
                    fill="#63F4E0"
                    transform="translate(-5, -3)"
                  />
                </G>

                {/* Floating Trade Badge 2: Light Bulb (Électricité) - Saffron */}
                <G transform="translate(268, 64)">
                  <Circle cx="22" cy="22" r="21" fill="#161E3C" />
                  <Circle
                    cx="22"
                    cy="22"
                    r="21"
                    fill="#FFB300"
                    fillOpacity="0.1"
                    stroke="#FFB300"
                    strokeWidth="1.2"
                  />
                  <Path
                    d="M22 13 C18.1 13 15 16.1 15 20 C15 22.4 16.2 24.5 18.1 25.7 L18.1 28 C18.1 28.6 18.5 29 19.1 29 L24.9 29 C25.5 29 25.9 28.6 25.9 28 L25.9 25.7 C27.8 24.5 29 22.4 29 20 C29 16.1 25.9 13 22 13 ZM20.1 30 L23.9 30 L23.9 31 L20.1 31 Z"
                    fill="#FFD79B"
                  />
                </G>

                {/* Floating Trade Badge 3: Paint Roller (Peinture) - Coral */}
                <G transform="translate(272, 196)">
                  <Circle cx="20" cy="20" r="19" fill="#161E3C" />
                  <Circle
                    cx="20"
                    cy="20"
                    r="19"
                    fill="#FFB4AB"
                    fillOpacity="0.1"
                    stroke="#FFB4AB"
                    strokeWidth="1.2"
                  />
                  <Rect
                    x="13"
                    y="12"
                    width="14"
                    height="6"
                    rx="1.5"
                    fill="#FFB4AB"
                  />
                  <Path
                    d="M27 15 L30 15 L30 22 L20 22 L20 27"
                    fill="none"
                    stroke="#FFB4AB"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </G>

                {/* Floating Trade Badge 4: Water Droplet (Dépannage) - Teal */}
                <G transform="translate(28, 202)">
                  <Circle cx="19" cy="19" r="18" fill="#161E3C" />
                  <Circle
                    cx="19"
                    cy="19"
                    r="18"
                    fill="#69F9E5"
                    fillOpacity="0.1"
                    stroke="#69F9E5"
                    strokeWidth="1.2"
                  />
                  <Path
                    d="M19 12 C19 12 13 18.5 13 22 C13 25.3 15.7 28 19 28 C22.3 28 25 25.3 25 22 C25 18.5 19 12 19 12 Z"
                    fill="#69F9E5"
                  />
                </G>
              </Svg>
            </View>
          </View>

          {/* Content & Value Proposition Area */}
          <View style={styles.copySection}>
            {/* Trust Micro-Pill */}
            <View style={styles.trustPill}>
              <MaterialIcons name="verified-user" size={15} color="#63F4E0" />
              <Text style={styles.trustPillText}>
                Précision garantie • Données protégées
              </Text>
            </View>

            {/* Main Headline */}
            <Text style={styles.headline}>
              Autoriser l'accès à votre position
            </Text>

            {/* Explanatory Subtitle */}
            <Text style={styles.subtitle}>
              Pour que les artisans qualifiés les plus proches de chez vous
              reçoivent votre demande instantanément.
            </Text>

            {/* 3 Contextual Signal Tags */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#FFB300' }]}>
                  ~8 min
                </Text>
                <Text style={styles.statLabel}>Arrivée rapide</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#63F4E0' }]}>
                  100%
                </Text>
                <Text style={styles.statLabel}>Artisans vérifiés</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#DDE1FF' }]}>
                  Casablanca
                </Text>
                <Text style={styles.statLabel}>&amp; Grand Maroc</Text>
              </View>
            </View>
          </View>

          {/* Bottom Action Group */}
          <View style={styles.bottomActions}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleEnableLocation}
                style={({ pressed }) => [
                  styles.primaryCta,
                  pressed && styles.primaryCtaPressed,
                ]}
              >
                {status === 'loading' ? (
                  <>
                    <ActivityIndicator size="small" color="#6B4900" />
                    <Text style={styles.primaryCtaText}>
                      Position localisée...
                    </Text>
                  </>
                ) : status === 'granted' ? (
                  <>
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color="#6B4900"
                    />
                    <Text style={styles.primaryCtaText}>Autorisé</Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="near-me" size={20} color="#6B4900" />
                    <Text style={styles.primaryCtaText}>
                      Activer la localisation
                    </Text>
                  </>
                )}
              </Pressable>
            </Animated.View>

            <Pressable
              onPress={goNext}
              style={({ pressed }) => [
                styles.secondaryBtn,
                pressed && styles.secondaryBtnPressed,
              ]}
            >
              <Text style={styles.secondaryBtnText}>Plus tard</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  zelligeOverlay: {
    opacity: 0.04,
  },
  safeArea: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  brandName: {
    fontFamily: tokens.fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.3,
  },
  brandTealDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#63F4E0',
  },
  skipPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: 'rgba(22, 30, 60, 0.6)',
  },
  skipPillPressed: {
    backgroundColor: '#161E3C',
    transform: [{ scale: 0.96 }],
  },
  skipPillText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: '#BDC2FF',
  },
  // Illustration Stage
  illustrationStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 'auto',
  },
  svgFrame: {
    width: '100%',
    maxWidth: 325,
    aspectRatio: 1,
  },
  // Copy & Signal Tags
  copySection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.85)',
    marginBottom: 12,
  },
  trustPillText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#BDC2FF',
    letterSpacing: 0.2,
  },
  headline: {
    fontFamily: tokens.fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: '#DDE1FF',
    textAlign: 'center',
    maxWidth: 320,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    color: '#D6C4AC',
    textAlign: 'center',
    maxWidth: 310,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    maxWidth: 330,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(18, 26, 56, 0.75)',
  },
  statValue: {
    fontFamily: tokens.fonts.bold,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontFamily: tokens.fonts.regular,
    fontSize: 11,
    lineHeight: 15,
    color: '#BDC2FF',
    marginTop: 2,
    textAlign: 'center',
  },
  // Bottom Buttons
  bottomActions: {
    gap: 8,
    paddingTop: 4,
  },
  primaryCta: {
    width: '100%',
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#FFB300',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryCtaPressed: {
    backgroundColor: '#FFBA38',
  },
  primaryCtaText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: '#6B4900',
  },
  secondaryBtn: {
    width: '100%',
    height: 44,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnPressed: {
    backgroundColor: 'rgba(33, 40, 71, 0.4)',
  },
  secondaryBtnText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: '#BDC2FF',
  },
});