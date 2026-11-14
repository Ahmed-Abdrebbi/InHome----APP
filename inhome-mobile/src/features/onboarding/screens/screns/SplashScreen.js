import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  Pattern,
  Rect,
  Path,
  G,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const { colors, gradients } = majorelleTheme;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (navigation?.replace) {
        navigation.replace('Welcome');
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Majorelle Night Atmospheric Canvas */}
      <LinearGradient
        colors={gradients.majorelleCanvas}
        locations={[0, 0.5, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 2. Ambient Saffron & Majorelle Luminescence (Radial Glows) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          <Defs>
            <RadialGradient id="saffronGlow" cx="50%" cy="48%" r="45%">
              <Stop offset="0%" stopColor="#FFB300" stopOpacity="0.18" />
              <Stop offset="55%" stopColor="#FFB300" stopOpacity="0.06" />
              <Stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="majorelleGlow" cx="50%" cy="68%" r="50%">
              <Stop offset="0%" stopColor="#1023D7" stopOpacity="0.24" />
              <Stop offset="65%" stopColor="#1023D7" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#1023D7" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#majorelleGlow)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#saffronGlow)" />
        </Svg>
      </View>

      {/* 3. Moroccan Geometric 8-Point Zellige Star Lattice Watermark (5% Opacity) */}
      <View style={[StyleSheet.absoluteFill, styles.zelligeLayer]} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="zellige-octagram"
              width="72"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <G
                fill="none"
                stroke="#FFD79B"
                strokeWidth="1.25"
                strokeLinejoin="round"
              >
                {/* Square 1 */}
                <Rect x="24" y="24" width="24" height="24" />
                {/* Square 2 rotated 45 deg (Khatam Sulayman 8-point star) */}
                <Rect
                  x="24"
                  y="24"
                  width="24"
                  height="24"
                  transform="rotate(45 36 36)"
                />
                {/* Orthogonal & Diagonal connection ties */}
                <Path d="M0 36 L16 36 M56 36 L72 36 M36 0 L36 16 M36 56 L36 72" />
                <Path d="M0 0 L18 18 M54 54 L72 72 M72 0 L54 18 M18 54 L0 72" />
                {/* Corner star fragments */}
                <Rect
                  x="-8"
                  y="-8"
                  width="16"
                  height="16"
                  transform="rotate(45 0 0)"
                />
                <Rect
                  x="64"
                  y="-8"
                  width="16"
                  height="16"
                  transform="rotate(45 72 0)"
                />
                <Rect
                  x="-8"
                  y="64"
                  width="16"
                  height="16"
                  transform="rotate(45 0 72)"
                />
                <Rect
                  x="64"
                  y="64"
                  width="16"
                  height="16"
                  transform="rotate(45 72 72)"
                />
              </G>
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#zellige-octagram)" />
        </Svg>
      </View>

      {/* 4. Centered Identity Core */}
      <Animated.View
        style={[
          styles.identityCore,
          {
            opacity: fadeAnim,
            transform: [{ translateY: -8 }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Radiant Saffron App Icon Container */}
        <View style={styles.iconWrapper}>
          {/* Outer Radiant Halo */}
          <View style={styles.outerHalo} />
          <View style={styles.innerHalo} />

          {/* 104x104 Icon Surface Tile */}
          <View style={styles.iconTile}>
            {/* Subtle internal specular edge light */}
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.38)',
                'rgba(255, 255, 255, 0)',
                'rgba(0, 0, 0, 0.12)',
              ]}
              locations={[0, 0.5, 1]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Artisan Home Silhouette with Crafted Wrench Keyway (#0A1230) */}
            <Svg width={56} height={56} viewBox="0 0 56 56" fill="none">
              {/* House Shell + Geometric Gable Roof */}
              <Path
                d="M28 8L10 23V46C10 47.1 10.9 48 12 48H44C45.1 48 46 47.1 46 46V23L28 8Z"
                fill="#0A1230"
              />
              {/* Door Arch Portal Cutout (Saffron #FFB300) */}
              <Path
                d="M23 48V32C23 29.2386 25.2386 27 28 27C30.7614 27 33 29.2386 33 32V48H23Z"
                fill="#FFB300"
              />
              {/* Wrench Head Silhouette Floating in Portal Entry (#0A1230) */}
              <Path
                d="M28 30C26.6193 30 25.5 31.1193 25.5 32.5C25.5 33.37 25.95 34.13 26.63 34.56L26.5 44H29.5L29.37 34.56C30.05 34.13 30.5 33.37 30.5 32.5C30.5 31.1193 29.3807 30 28 30ZM28 31.5C28.5523 31.5 29 31.9477 29 32.5C29 32.8 28.87 33.06 28.66 33.24L28 32.7L27.34 33.24C27.13 33.06 27 32.8 27 32.5C27 31.9477 27.4477 31.5 28 31.5Z"
                fill="#0A1230"
              />
            </Svg>
          </View>
        </View>

        {/* Wordmark & Top-Level Domain Identifier */}
        <View style={styles.wordmarkRow}>
          <Text style={styles.brandMain}>InHome</Text>
          <Text style={styles.brandTld}>.ma</Text>
        </View>

        {/* Minimal Sub-brand Descriptor in Balanced Bilingual Darija Harmony */}
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitleFr}>SERVICES D'ARTISANS</Text>
          <View style={styles.separatorDot} />
          <Text style={styles.subtitleAr}>خدمات منزلية</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  zelligeLayer: {
    opacity: 0.05,
  },
  identityCore: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerHalo: {
    position: 'absolute',
    width: 152,
    height: 152,
    borderRadius: 44,
    backgroundColor: 'rgba(255, 179, 0, 0.16)',
  },
  innerHalo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 186, 56, 0.28)',
  },
  iconTile: {
    width: 104,
    height: 104,
    borderRadius: tokens.radius.iconTile,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    // iOS & Android Radiant Saffron Elevation
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 16,
  },
  wordmarkRow: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandMain: {
    fontFamily: tokens.fonts.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: '#F4F6FF',
    letterSpacing: -0.6,
  },
  brandTld: {
    fontFamily: tokens.fonts.bold,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: '#FFB300',
    marginLeft: 2,
  },
  subtitleRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subtitleFr: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.1,
    color: 'rgba(214, 196, 172, 0.82)',
  },
  separatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 179, 0, 0.6)',
  },
  subtitleAr: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: 'rgba(214, 196, 172, 0.82)',
  },
});