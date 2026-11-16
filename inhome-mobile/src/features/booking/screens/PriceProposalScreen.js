import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
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
  Polygon,
  Circle,
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PriceProposalScreen({ navigation, route }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();

  const serviceParam = route?.params?.service;
  const serviceTitle = serviceParam?.label
    ? `${serviceParam.label} — Fuite d'eau`
    : "Plomberie — Fuite d'eau";

  const [selectedTier, setSelectedTier] = useState('standard'); // 'standard' | 'urgent' | 'diagnostic'
  const [proposedPrice, setProposedPrice] = useState(80);
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'broadcasting' | 'notified'

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const liveDotAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const radarLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
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

    radarLoop.start();
    dotLoop.start();

    return () => {
      radarLoop.stop();
      dotLoop.stop();
    };
  }, [pulseAnim, liveDotAnim]);

  const handleDecrement = () => {
    setSelectedTier('standard');
    setProposedPrice((prev) => (prev > 40 ? prev - 10 : prev));
  };

  const handleIncrement = () => {
    setSelectedTier('standard');
    setProposedPrice((prev) => (prev < 350 ? prev + 10 : prev));
  };

  const handleFindArtisan = () => {
    if (submitState !== 'idle') return;
    setSubmitState('broadcasting');

    setTimeout(() => {
      setSubmitState('notified');
      setTimeout(() => {
        if (navigation?.navigate) {
          navigation.navigate('OffersList', {
            serviceTitle,
            tier: selectedTier,
            price:
              selectedTier === 'standard'
                ? proposedPrice
                : selectedTier === 'urgent'
                ? 100
                : 20,
          });
        }
      }, 900);
    }, 1100);
  };

  const haloScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1.35],
  });

  const haloOpacity = pulseAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.35, 0.12, 0],
  });

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
        {/* 1. Map Bed Canvas (360px) */}
        <View
          style={[
            styles.mapBed,
            { backgroundColor: colors.surfaceContainerLowest },
          ]}
        >
          {/* Nocturnal Vector Map Layer (Casablanca Racine Grid) */}
          <Svg
            width={SCREEN_WIDTH}
            height={360}
            viewBox="0 0 390 360"
            preserveAspectRatio="none"
            style={StyleSheet.absoluteFill}
          >
            {/* Subtle Urban Blocks */}
            <Rect
              x="18"
              y="24"
              width="110"
              height="48"
              rx="8"
              fill="#121A38"
              opacity="0.7"
            />
            <Rect
              x="148"
              y="18"
              width="120"
              height="55"
              rx="8"
              fill="#121A38"
              opacity="0.65"
            />
            <Rect
              x="295"
              y="30"
              width="85"
              height="65"
              rx="8"
              fill="#121A38"
              opacity="0.7"
            />
            <Rect
              x="105"
              y="125"
              width="135"
              height="85"
              rx="10"
              fill="#121A38"
              opacity="0.75"
            />
            <Rect
              x="290"
              y="120"
              width="95"
              height="75"
              rx="10"
              fill="#121A38"
              opacity="0.65"
            />

            {/* Road Arteries (Casablanca Racine Grid) */}
            <Path
              d="M-20 80 L420 110"
              stroke="#161E3C"
              strokeLinecap="round"
              strokeWidth="14"
            />
            <Path
              d="M60 -20 L90 380"
              stroke="#161E3C"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <Path
              d="M-10 260 L430 200"
              stroke="#212847"
              strokeLinecap="round"
              strokeWidth="18"
            />
            <Path
              d="M280 -10 L250 380"
              stroke="#161E3C"
              strokeLinecap="round"
              strokeWidth="10"
            />
            <Path
              d="M140 100 Q 220 180 340 160"
              fill="none"
              stroke="#161E3C"
              strokeWidth="8"
            />
            <Path
              d="M-10 180 L200 240 L420 310"
              fill="none"
              stroke="#212847"
              strokeWidth="9"
            />

            {/* Street Label Markings */}
            <SvgText
              x="70"
              y="278"
              fill="#D6C4AC"
              fontSize="10"
              letterSpacing="1"
              opacity="0.35"
            >
              BD ZERKTOUNI
            </SvgText>
            <SvgText
              x="210"
              y="98"
              fill="#D6C4AC"
              fontSize="9"
              letterSpacing="0.8"
              opacity="0.35"
            >
              RUE EL BOHTORI
            </SvgText>
            <SvgText
              x="290"
              y="235"
              fill="#D6C4AC"
              fontSize="9"
              letterSpacing="0.8"
              opacity="0.35"
            >
              RACINE
            </SvgText>
          </Svg>

          {/* Floating Top Navigation Overlay */}
          <View
            style={[
              styles.topNavRow,
              { paddingTop: Math.max(insets.top, 10) + 4 },
            ]}
          >
            <Pressable
              onPress={() => {
                if (navigation?.canGoBack?.()) {
                  navigation.goBack();
                } else {
                  navigation?.navigate?.('MapHome');
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

            {/* Live City Pulse Indicator */}
            <View style={styles.cityLivePill}>
              <View style={styles.liveDotBox}>
                <Animated.View
                  style={[styles.liveDotPing, { opacity: liveDotAnim }]}
                />
                <View style={styles.liveDotCore} />
              </View>
              <Text style={styles.cityLiveText}>Casablanca • En direct</Text>
            </View>
          </View>

          {/* Radar Waves & Active Client Pin (Centered) */}
          <View style={styles.clientPinCenter}>
            <Animated.View
              style={[
                styles.saffronRadarRing,
                {
                  transform: [{ scale: haloScale }],
                  opacity: haloOpacity,
                },
              ]}
            />
            <View style={styles.saffronStaticRing} />

            <View style={styles.clientPinCircle}>
              <MaterialIcons name="home" size={22} color="#6B4900" />
              <View style={styles.clientPinCornerDot} />
            </View>

            <View style={styles.vousEtesIciPill}>
              <Text style={styles.vousEtesIciText}>Vous êtes ici</Text>
            </View>
          </View>

          {/* Nearby Artisan Pins */}
          {/* Artisan 1: Plumber (Teal Wrench - 4 min) */}
          <View style={styles.artisanPin1}>
            <View style={styles.tealPinCircle}>
              <MaterialIcons name="build" size={18} color="#003731" />
            </View>
            <View style={styles.etaDarkPill}>
              <Text style={[styles.etaText, { color: '#69F9E5' }]}>4 min</Text>
            </View>
          </View>

          {/* Artisan 2: Electrician (Saffron Bolt - 7 min) */}
          <View style={styles.artisanPin2}>
            <View style={styles.etaDarkPill}>
              <Text style={[styles.etaText, { color: '#FFDEAC' }]}>7 min</Text>
            </View>
            <View style={styles.saffronPinCircle}>
              <MaterialIcons name="bolt" size={18} color="#281900" />
            </View>
          </View>

          {/* Artisan 3: Painter (Lavender Roller - 12 min) */}
          <View style={styles.artisanPin3}>
            <View style={styles.lavenderPinCircle}>
              <MaterialIcons name="format-paint" size={16} color="#0010A2" />
            </View>
            <View style={styles.etaCompactPill}>
              <Text style={[styles.etaText, { color: '#E0E0FF' }]}>
                12 min
              </Text>
            </View>
          </View>

          {/* Artisan 4: Fast Mover Plumber (Far Left Corner) */}
          <View style={styles.artisanPin4}>
            <View style={styles.tealContainerPinCircle}>
              <MaterialIcons name="plumbing" size={16} color="#005A51" />
            </View>
          </View>

          {/* Floating Summary Card (Av. Marrakech / Service Specs) */}
          <View style={styles.summaryCardWrap}>
            <View style={styles.summaryCard}>
              {/* Row 1: Address */}
              <View style={styles.summaryRow}>
                <View style={styles.summaryLeft}>
                  <View style={styles.summaryIconCircle}>
                    <MaterialIcons
                      name="location-on"
                      size={18}
                      color="#FFD79B"
                    />
                  </View>
                  <View style={styles.summaryTextCol}>
                    <Text style={styles.summaryTitle} numberOfLines={1}>
                      Av. Marrakech, Imm. 14
                    </Text>
                    <Text style={styles.summarySub} numberOfLines={1}>
                      Racine, Casablanca
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => navigation?.navigate?.('LocationPicker')}
                  style={({ pressed }) => [
                    styles.editCircleBtn,
                    pressed && styles.pressedScale95,
                  ]}
                  accessibilityLabel="Modifier l'adresse"
                >
                  <MaterialIcons name="edit" size={16} color="#D6C4AC" />
                </Pressable>
              </View>

              <View style={styles.summaryDivider} />

              {/* Row 2: Service Classification */}
              <View style={styles.summaryRow}>
                <View style={styles.summaryLeft}>
                  <View style={styles.summaryIconCircle}>
                    <MaterialIcons
                      name="water-damage"
                      size={18}
                      color="#63F4E0"
                    />
                  </View>
                  <View style={styles.summaryTextCol}>
                    <Text style={styles.summaryTitle} numberOfLines={1}>
                      {serviceTitle}
                    </Text>
                    <View style={styles.urgencyBadgeRow}>
                      <View style={styles.urgencyBadge}>
                        <Text style={styles.urgencyBadgeText}>
                          Urgence modérée
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.guaranteedBadge}>
                  <MaterialIcons name="verified" size={14} color="#63F4E0" />
                  <Text style={styles.guaranteedText}>Garanti</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Bottom Sheet: Pricing Proposals & Interventions */}
        <View
          style={[
            styles.bottomSheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 8 },
          ]}
        >
          {/* Subtle Moroccan Zellige Background Watermark Pattern (~3% opacity) */}
          <View style={styles.zelligeWatermark} pointerEvents="none">
            <Svg width="100%" height="100%">
              <Defs>
                <Pattern
                  id="zelligeGrid"
                  width="48"
                  height="48"
                  patternUnits="userSpaceOnUse"
                >
                  <Polygon
                    points="24,0 30,18 48,24 30,30 24,48 18,30 0,24 18,18"
                    fill="#FFD79B"
                  />
                  <Circle cx="24" cy="24" r="4" fill="#63F4E0" />
                </Pattern>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#zelligeGrid)" />
            </Svg>
          </View>

          {/* Drag Handle */}
          <View style={styles.dragHandleWrap}>
            <View style={styles.dragHandle} />
          </View>

          {/* Sheet Header */}
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <Text style={styles.sheetTitle}>
                Détails &amp; Proposition de tarif
              </Text>
              <Text style={styles.stepTag}>ÉTAPE 2/3</Text>
            </View>
            <Text style={styles.sheetSubtitle}>
              Fixez votre prix ou choisissez un mode d'intervention
            </Text>
          </View>

          {/* Service Mode Selection Cards */}
          <View style={styles.tiersColumn}>
            {/* Tier 1: SELECTED "Standard" with Price Stepper Negotiation */}
            <Pressable
              onPress={() => setSelectedTier('standard')}
              style={[
                styles.tierCard,
                selectedTier === 'standard' && styles.tierCardSelected,
              ]}
            >
              {/* Golden Accent Indicator Strip */}
              {selectedTier === 'standard' && (
                <View style={styles.selectedGoldStrip} />
              )}

              <View style={styles.standardTopRow}>
                <View style={styles.standardLeft}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedTier === 'standard' && styles.radioCircleActive,
                    ]}
                  >
                    {selectedTier === 'standard' ? (
                      <MaterialIcons name="check" size={14} color="#6B4900" />
                    ) : (
                      <View style={styles.radioInnerDot} />
                    )}
                  </View>

                  <View style={styles.standardCopy}>
                    <View style={styles.standardTitleRow}>
                      <Text style={styles.standardTitle}>Standard</Text>
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>Recommandé</Text>
                      </View>
                    </View>
                    <Text style={styles.tierCaption}>
                      Intervention flexible aujourd'hui
                    </Text>
                  </View>
                </View>

                {/* Price Stepper Controls */}
                <View style={styles.stepperColumn}>
                  <View style={styles.stepperPill}>
                    <Pressable
                      onPress={handleDecrement}
                      style={({ pressed }) => [
                        styles.stepperCircleBtn,
                        pressed && styles.pressedScale90,
                      ]}
                      accessibilityLabel="Diminuer le prix"
                    >
                      <MaterialIcons name="remove" size={16} color="#FFBA38" />
                    </Pressable>

                    <View style={styles.priceDisplayBox}>
                      <Text style={styles.currencyLabel}>DH</Text>
                      <Text style={styles.priceNumber}>{proposedPrice}</Text>
                    </View>

                    <Pressable
                      onPress={handleIncrement}
                      style={({ pressed }) => [
                        styles.stepperCircleBtn,
                        pressed && styles.pressedScale90,
                      ]}
                      accessibilityLabel="Augmenter le prix"
                    >
                      <MaterialIcons name="add" size={16} color="#FFBA38" />
                    </Pressable>
                  </View>
                  <Text style={styles.proposedCaption}>Prix proposé</Text>
                </View>
              </View>

              {/* Micro Reassurance Detail */}
              <View style={styles.reassuranceStrip}>
                <MaterialIcons name="receipt-long" size={16} color="#63F4E0" />
                <Text style={styles.reassuranceText}>
                  Prix direct artisan, sans commission cachée • MAD
                </Text>
              </View>
            </Pressable>

            {/* Tier 2: "Urgent — Immédiat" */}
            <Pressable
              onPress={() => setSelectedTier('urgent')}
              style={({ pressed }) => [
                styles.tierCardCollapsed,
                selectedTier === 'urgent' && styles.tierCardSelected,
                pressed && styles.tierCardPressed,
              ]}
            >
              {selectedTier === 'urgent' && (
                <View style={styles.selectedGoldStrip} />
              )}

              <View style={styles.collapsedLeft}>
                <View
                  style={[
                    styles.radioCircle,
                    selectedTier === 'urgent' && styles.radioCircleActive,
                  ]}
                >
                  {selectedTier === 'urgent' ? (
                    <MaterialIcons name="check" size={14} color="#6B4900" />
                  ) : (
                    <View style={styles.radioInnerDot} />
                  )}
                </View>

                <View style={styles.collapsedCopy}>
                  <View style={styles.collapsedTitleRow}>
                    <Text style={styles.collapsedTitle}>
                      Urgent — Immédiat
                    </Text>
                    <View style={styles.urgentPctPill}>
                      <MaterialIcons name="bolt" size={12} color="#FFD79B" />
                      <Text style={styles.urgentPctText}>+20%</Text>
                    </View>
                  </View>

                  <View style={styles.arrivalRow}>
                    <MaterialIcons name="near-me" size={14} color="#63F4E0" />
                    <Text style={styles.tierCaption}>Arrivée ~15 min</Text>
                  </View>
                </View>
              </View>

              <View style={styles.collapsedPriceCol}>
                <Text style={styles.collapsedPrice}>DH 100</Text>
                <Text style={styles.tierCaption}>Forfait direct</Text>
              </View>
            </Pressable>

            {/* Tier 3: "Diagnostic visuel" */}
            <Pressable
              onPress={() => setSelectedTier('diagnostic')}
              style={({ pressed }) => [
                styles.tierCardCollapsed,
                selectedTier === 'diagnostic' && styles.tierCardSelected,
                pressed && styles.tierCardPressed,
              ]}
            >
              {selectedTier === 'diagnostic' && (
                <View style={styles.selectedGoldStrip} />
              )}

              <View style={styles.collapsedLeft}>
                <View
                  style={[
                    styles.radioCircle,
                    selectedTier === 'diagnostic' && styles.radioCircleActive,
                  ]}
                >
                  {selectedTier === 'diagnostic' ? (
                    <MaterialIcons name="check" size={14} color="#6B4900" />
                  ) : (
                    <View style={styles.radioInnerDot} />
                  )}
                </View>

                <View style={styles.collapsedCopy}>
                  <View style={styles.collapsedTitleRow}>
                    <Text style={styles.collapsedTitle}>Diagnostic visuel</Text>
                    <View style={styles.noTravelPill}>
                      <Text style={styles.noTravelText}>Sans déplacement</Text>
                    </View>
                  </View>
                  <Text style={styles.tierCaption}>
                    Devis photo &amp; vidéo instantané
                  </Text>
                </View>
              </View>

              <View style={styles.collapsedPriceCol}>
                <Text style={[styles.collapsedPrice, { color: '#63F4E0' }]}>
                  DH 20
                </Text>
                <Text style={styles.tierCaption}>Télé-expertise</Text>
              </View>
            </Pressable>
          </View>

          {/* Moroccan Trust & Safety Capsule */}
          <View style={styles.trustCapsule}>
            <View style={styles.trustLeft}>
              <MaterialIcons name="verified-user" size={18} color="#FFD79B" />
              <Text style={styles.trustText} numberOfLines={1}>
                Artisans agréés InHome Maroc &amp; CNI vérifiée
              </Text>
            </View>
            <Text style={styles.trustRating}>4.9/5 ★</Text>
          </View>

          {/* Bottom Fixed CTA Section */}
          <View style={styles.ctaRow}>
            {/* Secondary Filter/Preferences Button */}
            <Pressable
              onPress={() => navigation?.navigate?.('SearchServices')}
              style={({ pressed }) => [
                styles.prefsCircleBtn,
                pressed && styles.pressedScale95,
              ]}
              accessibilityLabel="Préférences et options d'intervention"
            >
              <MaterialIcons name="tune" size={22} color="#D6C4AC" />
            </Pressable>

            {/* Primary Action CTA */}
            <Pressable
              onPress={handleFindArtisan}
              style={({ pressed }) => [
                styles.primaryFindBtn,
                submitState !== 'idle' && { opacity: 0.92 },
                pressed && styles.pressedScale98,
              ]}
            >
              {submitState === 'broadcasting' ? (
                <>
                  <ActivityIndicator size="small" color="#6B4900" />
                  <Text style={styles.primaryFindText}>
                    Diffusion en cours...
                  </Text>
                </>
              ) : submitState === 'notified' ? (
                <>
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#6B4900"
                  />
                  <Text style={styles.primaryFindText}>
                    3 Artisans notifiés
                  </Text>
                </>
              ) : (
                <>
                  <MaterialIcons name="radar" size={20} color="#6B4900" />
                  <Text style={styles.primaryFindText}>
                    Trouver un prestataire
                  </Text>
                </>
              )}
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
  // Map Bed Canvas (360px)
  mapBed: {
    width: '100%',
    height: 360,
    position: 'relative',
    overflow: 'hidden',
  },
  topNavRow: {
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
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 40, 71, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cityLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  liveDotBox: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveDotPing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#63F4E0',
  },
  liveDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#63F4E0',
  },
  cityLiveText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#DDE1FF',
  },
  // Client Center Pin
  clientPinCenter: {
    position: 'absolute',
    left: '50%',
    top: 146,
    transform: [{ translateX: -72 }, { translateY: -48 }],
    width: 144,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  saffronRadarRing: {
    position: 'absolute',
    top: -18,
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#FFB300',
  },
  saffronStaticRing: {
    position: 'absolute',
    top: 2,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
  },
  clientPinCircle: {
    marginTop: 26,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  clientPinCornerDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#FFD79B',
    borderWidth: 2,
    borderColor: '#040B2A',
  },
  vousEtesIciPill: {
    marginTop: 5,
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.94)',
  },
  vousEtesIciText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: '#FFD79B',
    letterSpacing: 0.2,
  },
  // Nearby Artisan Pins
  artisanPin1: {
    position: 'absolute',
    left: 52,
    top: 96,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tealPinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#63F4E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#63F4E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  etaDarkPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(44, 51, 82, 0.94)',
  },
  etaText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
  },
  artisanPin2: {
    position: 'absolute',
    right: 46,
    top: 112,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saffronPinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFBA38',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  artisanPin3: {
    position: 'absolute',
    right: 92,
    top: 215,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lavenderPinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BDC2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaCompactPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
  },
  artisanPin4: {
    position: 'absolute',
    left: 32,
    top: 235,
    zIndex: 10,
  },
  tealContainerPinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3FD7C4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Floating Summary Card
  summaryCardWrap: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 20,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: 'rgba(33, 40, 71, 0.96)',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  summaryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  summaryTextCol: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  summarySub: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  editCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  summaryDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#2C3352',
  },
  urgencyBadgeRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 9999,
    backgroundColor: '#2C3352',
  },
  urgencyBadgeText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500',
    color: '#D6C4AC',
  },
  guaranteedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  guaranteedText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#63F4E0',
  },
  // Bottom Sheet
  bottomSheet: {
    marginTop: -8,
    width: '100%',
    backgroundColor: '#121A38',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 14,
    zIndex: 30,
    overflow: 'hidden',
    shadowColor: '#040B2A',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 16,
  },
  zelligeWatermark: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  dragHandleWrap: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 2,
  },
  dragHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2C3352',
  },
  sheetHeader: {
    gap: 2,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  sheetTitle: {
    fontFamily: tokens.fonts.bold,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  stepTag: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#FFD79B',
    letterSpacing: 0.8,
  },
  sheetSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: '#D6C4AC',
  },
  // Tiers Selection
  tiersColumn: {
    gap: 10,
  },
  tierCard: {
    position: 'relative',
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#161E3C',
    padding: 14,
    gap: 12,
    overflow: 'hidden',
  },
  tierCardSelected: {
    backgroundColor: '#212847',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  tierCardCollapsed: {
    position: 'relative',
    width: '100%',
    borderRadius: 14,
    backgroundColor: '#161E3C',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    overflow: 'hidden',
  },
  tierCardPressed: {
    backgroundColor: '#212847',
  },
  selectedGoldStrip: {
    position: 'absolute',
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    backgroundColor: '#FFB300',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  standardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingLeft: 4,
    gap: 8,
  },
  standardLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  radioCircle: {
    marginTop: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioCircleActive: {
    backgroundColor: '#FFB300',
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2C3352',
  },
  standardCopy: {
    flex: 1,
    gap: 2,
  },
  standardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  standardTitle: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#DDE1FF',
  },
  recommendedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
  },
  recommendedText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#FFD79B',
  },
  tierCaption: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  // Price Stepper
  stepperColumn: {
    alignItems: 'flex-end',
  },
  stepperPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#040B2A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  stepperCircleBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceDisplayBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    minWidth: 58,
  },
  currencyLabel: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    color: '#FFD79B',
    marginRight: 3,
  },
  priceNumber: {
    fontFamily: tokens.fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#DDE1FF',
  },
  proposedCaption: {
    fontFamily: tokens.fonts.regular,
    fontSize: 11,
    lineHeight: 15,
    color: '#D6C4AC',
    marginTop: 4,
  },
  reassuranceStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 4,
    backgroundColor: 'rgba(44, 51, 82, 0.45)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  reassuranceText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
    flex: 1,
  },
  // Collapsed Tiers
  collapsedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingLeft: 4,
  },
  collapsedCopy: {
    flex: 1,
    gap: 2,
  },
  collapsedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  collapsedTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  urgentPctPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 179, 0, 0.16)',
  },
  urgentPctText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: '#FFD79B',
  },
  arrivalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noTravelPill: {
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 9999,
    backgroundColor: 'rgba(63, 215, 196, 0.2)',
  },
  noTravelText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 11,
    lineHeight: 14,
    color: '#63F4E0',
  },
  collapsedPriceCol: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  collapsedPrice: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#DDE1FF',
  },
  // Trust Capsule
  trustCapsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(44, 51, 82, 0.6)',
    gap: 8,
  },
  trustLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  trustText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
    flexShrink: 1,
  },
  trustRating: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#FFD79B',
    flexShrink: 0,
  },
  // Bottom CTA Row
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 2,
  },
  prefsCircleBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  primaryFindBtn: {
    flex: 1,
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
    shadowRadius: 14,
    elevation: 8,
  },
  primaryFindText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    color: '#6B4900',
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
  pressedScale90: {
    transform: [{ scale: 0.9 }],
  },
});