import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Pattern,
  Rect,
  Path,
  Polygon,
  Circle,
  G,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const { colors } = majorelleTheme;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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

  const handleContinue = () => {
    if (navigation?.navigate) {
      navigation.navigate('LocationPermission');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* 1. Ambient Radial Glows (Majorelle Blue Top + Saffron Bottom Right) */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
          <Defs>
            <RadialGradient id="topMajorelleGlow" cx="50%" cy="6%" r="52%">
              <Stop offset="0%" stopColor="#1023D7" stopOpacity="0.22" />
              <Stop offset="60%" stopColor="#1023D7" stopOpacity="0.06" />
              <Stop offset="100%" stopColor="#1023D7" stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="bottomSaffronGlow" cx="85%" cy="76%" r="42%">
              <Stop offset="0%" stopColor="#FFB300" stopOpacity="0.12" />
              <Stop offset="65%" stopColor="#FFB300" stopOpacity="0.03" />
              <Stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#topMajorelleGlow)" />
          <Rect width="100%" height="100%" fill="url(#bottomSaffronGlow)" />
        </Svg>
      </View>

      {/* 2. Ultra-faint 8-Point Geometric Moroccan Zellige Star Pattern (5% opacity) */}
      <View style={[StyleSheet.absoluteFill, styles.zelligeOverlay]} pointerEvents="none">
        <Svg width="100%" height="100%">
          <Defs>
            <Pattern
              id="zellige-star-pattern"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <G fill="none" stroke="#69F9E5" strokeWidth="1.2">
                <Polygon points="40,16 46,28 58,28 48,36 52,48 40,41 28,48 32,36 22,28 34,28" />
                <Polygon
                  points="40,16 46,28 58,28 48,36 52,48 40,41 28,48 32,36 22,28 34,28"
                  transform="rotate(45 40 32)"
                />
                <Path
                  d="M0,0 L80,80 M80,0 L0,80"
                  strokeDasharray="3,3"
                  strokeWidth="0.6"
                />
                <Circle cx="40" cy="40" r="32" strokeWidth="0.5" />
                <Rect x="24" y="24" width="32" height="32" strokeWidth="0.6" />
                <Rect
                  x="24"
                  y="24"
                  width="32"
                  height="32"
                  strokeWidth="0.6"
                  transform="rotate(45 40 40)"
                />
              </G>
            </Pattern>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#zellige-star-pattern)" />
        </Svg>
      </View>

      {/* 3. Main Content Layout */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.innerContent}>
          {/* Top: Brand Lockup */}
          <View style={styles.brandHeader}>
            <View style={styles.brandSquircle}>
              <MaterialIcons
                name="home-repair-service"
                size={21}
                color={colors.surfaceContainerLowest}
              />
            </View>
            <View style={styles.brandTextRow}>
              <Text style={styles.brandTitle}>InHome</Text>
              <Text style={styles.brandDomain}>.ma</Text>
            </View>
          </View>

          {/* Middle: Bold French Value Proposition & Moroccan Entrance Illustration */}
          <View style={styles.heroSection}>
            <View style={styles.copyBlock}>
              <Text style={styles.heroHeadline}>
                {'Un pro\nà votre\n'}
                <Text style={styles.heroHighlight}>porte.</Text>
              </Text>
              <Text style={styles.heroSubtitle}>
                Proposez votre prix, choisissez le meilleur prestataire.
              </Text>
            </View>

            {/* Modern Moroccan Architectural Entrance Illustration */}
            <View style={styles.illustrationContainer}>
              {/* Soft Saffron Glow Pool Behind Doorway */}
              <View style={styles.doorwayGlowPool} />

              <Svg
                width="100%"
                height="100%"
                viewBox="0 0 320 260"
                fill="none"
                style={styles.doorwaySvg}
              >
                {/* Architectural Base & Wall Tone */}
                <Rect x="25" y="244" width="270" height="8" rx="4" fill="#161E3C" />

                {/* Outer Moorish Arch Wall Trim (Deep Midnight Blue) */}
                <Path
                  d="M60 244V124C60 68 104 28 160 28C216 28 260 68 260 124V244H60Z"
                  fill="#121A38"
                />

                {/* Majorelle Blue Architectural Portal Archway */}
                <Path
                  d="M74 244V128C74 80 112 44 160 44C208 44 246 80 246 128V244H74Z"
                  fill="#1023D7"
                />

                {/* Inner Deep Doorway Niche */}
                <Path
                  d="M88 244V132C88 92 120 60 160 60C200 60 232 92 232 132V244H88Z"
                  fill="#040B2A"
                />

                {/* Warm Saffron Interior Light Spill */}
                <Path
                  d="M102 244V136C102 104 128 78 160 78C192 78 218 104 218 136V244H102Z"
                  fill="#FFB300"
                  fillOpacity="0.12"
                />
                <Path
                  d="M120 244V146C120 124 138 106 160 106C182 106 200 124 200 146V244H120Z"
                  fill="#FFB300"
                  fillOpacity="0.22"
                />

                {/* Intricate Zellige Frieze Trim Detail along Arch */}
                <G stroke="#63F4E0" strokeOpacity="0.6" strokeWidth="1.5">
                  <Path
                    d="M80 130 C110 70, 210 70, 240 130"
                    strokeDasharray="2,6"
                  />
                  {/* Moroccan 8-point geometric Star Key Crest over keystone */}
                  <Polygon
                    points="160,34 163,41 170,41 164,46 166,53 160,49 154,53 156,46 150,41 157,41"
                    fill="#FFB300"
                    stroke="#FFD79B"
                    strokeWidth="0.8"
                  />
                </G>

                {/* Modern Architectural Door Panel (Partially Open Angle) */}
                <Path
                  d="M102 244V136C102 104 128 78 160 78V244H102Z"
                  fill="#161E3C"
                />

                {/* Door Geometric Grooves */}
                <Rect x="114" y="146" width="32" height="38" rx="4" fill="#212847" />
                <Rect x="114" y="192" width="32" height="42" rx="4" fill="#212847" />

                {/* Saffron Brass Hardware: Moroccan Doorknocker Ring */}
                <Circle cx="150" cy="165" r="5" fill="#FFB300" />
                <Circle
                  cx="150"
                  cy="165"
                  r="8"
                  fill="none"
                  stroke="#FFB300"
                  strokeWidth="1.8"
                />

                {/* Golden Light Spill Angle on threshold floor */}
                <Polygon
                  points="130,244 190,244 240,256 80,256"
                  fill="#FFB300"
                  fillOpacity="0.28"
                />

                {/* Craftsman Leather Toolbelt Draped on Side */}
                <Path
                  d="M184 162 C196 172, 204 190, 206 218"
                  stroke="#FFBA38"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <Rect x="194" y="184" width="28" height="34" rx="4" fill="#604100" />
                <Rect x="194" y="184" width="28" height="12" rx="2" fill="#7E5700" />

                {/* Spilling Tools: Screwdriver (Teal) & Wrench (Saffron) */}
                <Path
                  d="M200 174 L204 186"
                  stroke="#63F4E0"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <Path
                  d="M214 170 L212 185"
                  stroke="#FFB300"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Little Craftsman Brass Key with Radial Glow Ring */}
                <Circle cx="188" cy="160" r="8" fill="#FFD79B" fillOpacity="0.28" />
                <Circle cx="188" cy="160" r="3" fill="#FFD79B" />
                <Path
                  d="M188 163 V171 M188 167 H191"
                  stroke="#FFD79B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </View>

          {/* Bottom Section: Onboarding Stepper & Tactile Action CTA */}
          <View style={styles.bottomSection}>
            {/* 3-Dot Pagination Indicator */}
            <View style={styles.paginationRow}>
              <View style={styles.dotActive} />
              <View style={styles.dotInactive} />
              <View style={styles.dotInactive} />
            </View>

            {/* Primary CTA: 56px Tall Pill Button in Saffron (#FFB300) */}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleContinue}
                style={({ pressed }) => [
                  styles.ctaButton,
                  pressed && styles.ctaButtonPressed,
                ]}
              >
                <Text style={styles.ctaLabel}>Continuer</Text>
                <MaterialIcons
                  name="arrow-forward"
                  size={20}
                  color={colors.surfaceContainerLowest}
                />
              </Pressable>
            </Animated.View>

            {/* Reassurance Hint */}
            <Text style={styles.reassuranceText}>
              Artisans certifiés à Casablanca, Rabat &amp; Marrakech
            </Text>
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
    opacity: 0.05,
  },
  safeArea: {
    flex: 1,
  },
  innerContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28,
    maxWidth: 448,
    width: '100%',
    alignSelf: 'center',
  },
  // Top Brand Lockup
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 4,
  },
  brandSquircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  brandTextRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandTitle: {
    fontFamily: tokens.fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.4,
  },
  brandDomain: {
    fontFamily: tokens.fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '800',
    color: '#FFB300',
    marginLeft: 2,
  },
  // Hero Typography & Illustration
  heroSection: {
    marginTop: 16,
  },
  copyBlock: {
    gap: 12,
  },
  heroHeadline: {
    fontFamily: tokens.fonts.bold,
    fontSize: 32,
    lineHeight: 37,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.6,
  },
  heroHighlight: {
    color: '#FFB300',
    textShadowColor: 'rgba(255, 179, 0, 0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 14,
  },
  heroSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#BDC2FF',
    maxWidth: 280,
  },
  illustrationContainer: {
    width: '100%',
    height: 248,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  doorwayGlowPool: {
    position: 'absolute',
    top: 16,
    width: 176,
    height: 192,
    borderTopLeftRadius: 96,
    borderTopRightRadius: 96,
    backgroundColor: 'rgba(255, 179, 0, 0.14)',
  },
  doorwaySvg: {
    maxWidth: 310,
  },
  // Bottom Stepper & CTA
  bottomSection: {
    gap: 20,
    paddingTop: 8,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dotActive: {
    height: 8,
    width: 32,
    borderRadius: 9999,
    backgroundColor: '#FFB300',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  dotInactive: {
    height: 8,
    width: 8,
    borderRadius: 9999,
    backgroundColor: '#2C3352',
  },
  ctaButton: {
    height: 56,
    width: '100%',
    borderRadius: 9999,
    backgroundColor: '#FFB300',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaButtonPressed: {
    backgroundColor: '#FFBA38',
  },
  ctaLabel: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#040B2A',
  },
  reassuranceText: {
    textAlign: 'center',
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(214, 196, 172, 0.72)',
    letterSpacing: 0.2,
  },
});