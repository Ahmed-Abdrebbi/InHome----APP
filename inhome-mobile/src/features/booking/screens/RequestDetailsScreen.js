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
  Rect,
  Text as SvgText,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function RequestDetailsScreen({ navigation, route }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();

  const initialAddress =
    route?.params?.address || 'Av. Marrakech, Imm. 14 • Racine';

  const [photoCount, setPhotoCount] = useState(2);
  const [description, setDescription] = useState(
    "Fuite d'eau sous l'évier depuis hier"
  );
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [proposedPrice, setProposedPrice] = useState(80);
  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'searching' | 'found'

  const haloScaleAnim = useRef(new Animated.Value(0.75)).current;
  const haloOpacityAnim = useRef(new Animated.Value(0.45)).current;
  const liveDotOpacity = useRef(new Animated.Value(1)).current;
  const plumberFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const radarPulse = Animated.loop(
      Animated.parallel([
        Animated.timing(haloScaleAnim, {
          toValue: 1.45,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(haloOpacityAnim, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );

    const liveBlink = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDotOpacity, {
          toValue: 0.3,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(liveDotOpacity, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );

    const floatPin = Animated.loop(
      Animated.sequence([
        Animated.timing(plumberFloatAnim, {
          toValue: -4,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(plumberFloatAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );

    radarPulse.start();
    liveBlink.start();
    floatPin.start();

    return () => {
      radarPulse.stop();
      liveBlink.stop();
      floatPin.stop();
    };
  }, [haloScaleAnim, haloOpacityAnim, liveDotOpacity, plumberFloatAnim]);

  const handleDecreasePrice = () => {
    setProposedPrice((prev) => (prev > 50 ? prev - 10 : prev));
  };

  const handleIncreasePrice = () => {
    setProposedPrice((prev) => (prev < 300 ? prev + 10 : prev));
  };

  const handleFindArtisan = () => {
    if (submitState !== 'idle') return;
    setSubmitState('searching');

    setTimeout(() => {
      setSubmitState('found');
      setTimeout(() => {
        if (navigation?.navigate) {
          navigation.navigate('OffersList', {
            address: initialAddress,
            description,
            photoCount,
            price: proposedPrice,
          });
        }
      }, 750);
    }, 950);
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
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* 1. Map Canvas Layer (360px) */}
        <View
          style={[
            styles.mapCanvas,
            { backgroundColor: colors.surfaceDim },
          ]}
        >
          {/* Stylized Dark Cartography (Casablanca Racine / Gauthier Grid) */}
          <Svg
            width={SCREEN_WIDTH}
            height={360}
            viewBox="0 0 420 360"
            preserveAspectRatio="none"
            style={StyleSheet.absoluteFill}
          >
            <Defs>
              {/* Zellige Star Subtle Motif Overlay */}
              <Pattern
                id="zellige-grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <Path
                  d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z"
                  fill="none"
                  stroke="#2C3352"
                  strokeOpacity="0.25"
                  strokeWidth="0.75"
                />
              </Pattern>
            </Defs>

            {/* Background Bed */}
            <Rect width="420" height="360" fill="#09112F" />

            {/* Coastline / Ocean Feature Corner */}
            <Path
              d="M -20 -10 Q 90 20, 180 -20 L 440 -20 L 440 40 L -20 40 Z"
              fill="#003731"
              fillOpacity="0.25"
            />
            <Path
              d="M -20 25 Q 120 45, 220 5 L 440 10"
              fill="none"
              stroke="#3FD7C4"
              strokeOpacity="0.15"
              strokeWidth="1"
            />

            {/* Moroccan Zellige Architectural Micro-texture */}
            <Rect width="420" height="360" fill="url(#zellige-grid)" />

            {/* Major Arteries: Bd Zerktouni & Av. Hassan II axes */}
            <Path
              d="M-40 260 L460 70"
              stroke="#161E3C"
              strokeLinecap="round"
              strokeWidth="16"
            />
            <Path
              d="M-40 260 L460 70"
              stroke="#212847"
              strokeWidth="7"
            />
            <Path
              d="M70 -30 L210 390"
              stroke="#161E3C"
              strokeWidth="12"
            />
            <Path
              d="M70 -30 L210 390"
              stroke="#212847"
              strokeWidth="5"
            />

            {/* Secondary Neighborhood Grid */}
            <Path
              d="M10 130 L430 200"
              stroke="#121A38"
              strokeWidth="6"
            />
            <Path
              d="M10 130 L430 200"
              stroke="#2C3352"
              strokeOpacity="0.6"
              strokeWidth="2"
            />
            <Path
              d="M160 50 L390 320"
              stroke="#121A38"
              strokeWidth="5"
            />
            <Path
              d="M160 50 L390 320"
              stroke="#2C3352"
              strokeOpacity="0.5"
              strokeWidth="1.8"
            />
            <Path
              d="M-20 60 L240 290"
              stroke="#2C3352"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />
            <Path
              d="M260 -20 L90 340"
              stroke="#2C3352"
              strokeOpacity="0.45"
              strokeWidth="1.5"
            />
            <Path
              d="M230 180 L440 130"
              stroke="#2C3352"
              strokeOpacity="0.35"
              strokeWidth="1.5"
            />

            {/* Micro Urban Blocks */}
            <Rect
              x="110"
              y="80"
              width="46"
              height="38"
              rx="4"
              fill="#121A38"
              opacity="0.6"
            />
            <Rect
              x="175"
              y="100"
              width="34"
              height="28"
              rx="3"
              fill="#121A38"
              opacity="0.5"
            />
            <Rect
              x="235"
              y="140"
              width="58"
              height="38"
              rx="4"
              fill="#121A38"
              opacity="0.7"
            />
            <Rect
              x="75"
              y="170"
              width="42"
              height="42"
              rx="3"
              fill="#121A38"
              opacity="0.5"
            />

            {/* Street Label Vignettes */}
            <SvgText
              x="310"
              y="86"
              fill="#A8AFFF"
              fontSize="7"
              fontWeight="600"
              letterSpacing="1"
              opacity="0.4"
              transform="rotate(-21 310 86)"
            >
              BD ZERKTOUNI
            </SvgText>
            <SvgText
              x="180"
              y="224"
              fill="#A8AFFF"
              fontSize="6.5"
              fontWeight="600"
              letterSpacing="0.8"
              opacity="0.35"
              transform="rotate(9 180 224)"
            >
              AV. MARRAKECH
            </SvgText>
            <SvgText
              x="135"
              y="325"
              fill="#A8AFFF"
              fontSize="6"
              fontWeight="500"
              letterSpacing="0.5"
              opacity="0.3"
            >
              QUARTIER GAUTHIER
            </SvgText>
          </Svg>

          {/* Top Floating Map Control Bar */}
          <View
            style={[
              styles.topControlBar,
              { paddingTop: Math.max(insets.top, 10) + 6 },
            ]}
          >
            {/* Back / Dismiss Button */}
            <Pressable
              onPress={() => {
                if (navigation?.canGoBack?.()) {
                  navigation.goBack();
                } else {
                  navigation?.navigate?.('MapHome');
                }
              }}
              style={({ pressed }) => [
                styles.mapRoundBtn,
                pressed && styles.pressedScale95,
              ]}
              accessibilityLabel="Retour"
            >
              <MaterialIcons name="chevron-left" size={24} color="#DDE1FF" />
            </Pressable>

            {/* Live Geolocation Pill */}
            <View style={styles.geoStatusPill}>
              <View style={styles.geoDotWrap}>
                <Animated.View
                  style={[styles.geoDotRing, { opacity: liveDotOpacity }]}
                />
                <View style={styles.geoDotCore} />
              </View>
              <Text style={styles.geoStatusText}>Casablanca • Racine</Text>
            </View>

            {/* Map Layer Recenter Button */}
            <Pressable
              onPress={() => navigation?.navigate?.('LocationPicker')}
              style={({ pressed }) => [
                styles.mapRoundBtn,
                pressed && styles.pressedScale95,
              ]}
              accessibilityLabel="Recentrer ma position"
            >
              <MaterialIcons name="near-me" size={20} color="#BDC2FF" />
            </Pressable>
          </View>

          {/* Active Map Interactive Markers Layer */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Artisan Marker 1: Teal Plumber (4 min) */}
            <Animated.View
              style={[
                styles.markerPlumber,
                { transform: [{ translateY: plumberFloatAnim }] },
              ]}
            >
              <View style={styles.plumberCircle}>
                <MaterialIcons name="plumbing" size={19} color="#003731" />
              </View>
              <View style={styles.etaBadgePill}>
                <Text style={[styles.etaBadgeText, { color: '#69F9E5' }]}>
                  4 min
                </Text>
              </View>
            </Animated.View>

            {/* Artisan Marker 2: Saffron Electrician (6 min) */}
            <View style={styles.markerElectrician}>
              <View style={styles.electricianCircle}>
                <MaterialIcons name="bolt" size={19} color="#6B4900" />
              </View>
              <View style={styles.etaBadgePill}>
                <Text style={[styles.etaBadgeText, { color: '#FFD79B' }]}>
                  6 min
                </Text>
              </View>
            </View>

            {/* Artisan Marker 3: Painter / Multi-service (9 min) */}
            <View style={styles.markerPainter}>
              <View style={styles.painterCircle}>
                <MaterialIcons name="format-paint" size={18} color="#A8AFFF" />
              </View>
              <View style={styles.etaBadgePill}>
                <Text style={[styles.etaBadgeText, { color: '#BDC2FF' }]}>
                  9 min
                </Text>
              </View>
            </View>

            {/* Client Pinned Location (Middle-Center Hero) */}
            <View style={styles.clientHeroPin}>
              <Animated.View
                style={[
                  styles.clientRadarHalo,
                  {
                    transform: [{ scale: haloScaleAnim }],
                    opacity: haloOpacityAnim,
                  },
                ]}
              />
              <View style={styles.clientPinDisc}>
                <MaterialIcons name="home" size={22} color="#6B4900" />
              </View>
              <View style={styles.clientStemDot} />
            </View>
          </View>
        </View>

        {/* 2. BOTTOM SHEET CONTAINER (Majorelle Night Surface Elevation Level 2) */}
        <View
          style={[
            styles.bottomSheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 12 },
          ]}
        >
          {/* Centered Tactile Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Sheet Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.stepMetaRow}>
              <Text style={styles.stepLabel}>
                ÉTAPE 2/3 • DEMANDE EN COURS
              </Text>
              <View style={styles.artisansReadyRow}>
                <View style={styles.readyTealDot} />
                <Text style={styles.artisansReadyText}>3 artisans prêts</Text>
              </View>
            </View>

            <Text style={styles.sheetTitle}>Détails de la demande</Text>

            {/* Confirmed Address Bar */}
            <View style={styles.addressBar}>
              <View style={styles.addressBarLeft}>
                <MaterialIcons name="location-on" size={18} color="#63F4E0" />
                <Text style={styles.addressBarText} numberOfLines={1}>
                  {initialAddress}
                </Text>
              </View>

              <Pressable
                onPress={() => navigation?.navigate?.('LocationPicker')}
                hitSlop={8}
              >
                <Text style={styles.modifierBtnText}>Modifier</Text>
              </Pressable>
            </View>
          </View>

          {/* Tappable Details Checklist Bento Stack */}
          <View style={styles.bentoStack}>
            {/* Row 1: Photos du problème (Filled State) */}
            <Pressable
              onPress={() => setPhotoCount((prev) => (prev >= 4 ? 2 : prev + 1))}
              style={({ pressed }) => [
                styles.bentoRowCard,
                pressed && styles.bentoRowCardPressed,
              ]}
            >
              <View style={styles.bentoRowLeft}>
                <View style={styles.photoIconBox}>
                  <MaterialIcons
                    name="photo-camera"
                    size={22}
                    color="#BDC2FF"
                  />
                </View>

                <View style={styles.bentoRowCopy}>
                  <View style={styles.bentoTitleRow}>
                    <Text style={styles.bentoRowTitle} numberOfLines={1}>
                      Photos du problème
                    </Text>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#63F4E0"
                    />
                  </View>
                  <Text style={styles.bentoRowSub} numberOfLines={1}>
                    {photoCount} photos ajoutées (fuite lavabo)
                  </Text>
                </View>
              </View>

              <MaterialIcons name="chevron-right" size={20} color="#514532" />
            </Pressable>

            {/* Row 2: Décrire le problème (Filled State) */}
            <Pressable
              onPress={() => setIsEditingDesc((prev) => !prev)}
              style={({ pressed }) => [
                styles.bentoRowCard,
                pressed && styles.bentoRowCardPressed,
              ]}
            >
              <View style={styles.bentoRowLeft}>
                <View style={styles.descIconBox}>
                  <MaterialIcons name="edit-note" size={22} color="#63F4E0" />
                </View>

                <View style={styles.bentoRowCopy}>
                  <View style={styles.bentoTitleRow}>
                    <Text style={styles.bentoRowTitle} numberOfLines={1}>
                      Décrire le problème
                    </Text>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color="#63F4E0"
                    />
                  </View>

                  {isEditingDesc ? (
                    <TextInput
                      value={description}
                      onChangeText={setDescription}
                      onBlur={() => setIsEditingDesc(false)}
                      placeholder="Décrivez votre besoin..."
                      placeholderTextColor="#9E8E78"
                      style={styles.descInlineInput}
                      autoFocus
                    />
                  ) : (
                    <Text style={styles.bentoRowSub} numberOfLines={1}>
                      « {description} »
                    </Text>
                  )}
                </View>
              </View>

              <MaterialIcons name="chevron-right" size={20} color="#514532" />
            </Pressable>

            {/* Row 3: Price Proposal Stepper Card (Configurable) */}
            <View style={styles.priceProposalCard}>
              <View style={styles.priceTopRow}>
                <View style={styles.priceLeftGroup}>
                  <View style={styles.paymentsIconBox}>
                    <MaterialIcons name="payments" size={22} color="#FFBA38" />
                  </View>

                  <View style={styles.priceCopyCol}>
                    <Text style={styles.bentoRowTitle} numberOfLines={1}>
                      Votre proposition de tarif
                    </Text>
                    <Text style={styles.priceHintSub} numberOfLines={1}>
                      80 DH suggéré pour plomberie rapide
                    </Text>
                  </View>
                </View>

                <View style={styles.recommendedPill}>
                  <Text style={styles.recommendedPillText}>Recommandé</Text>
                </View>
              </View>

              {/* Interactive Bid Stepper (Tactile Dial) */}
              <View style={styles.bidStepperBar}>
                <Pressable
                  onPress={handleDecreasePrice}
                  style={({ pressed }) => [
                    styles.stepperSquareBtn,
                    pressed && styles.pressedScale95,
                  ]}
                  accessibilityLabel="Diminuer le prix"
                >
                  <MaterialIcons name="remove" size={20} color="#DDE1FF" />
                </Pressable>

                <Pressable
                  onPress={() =>
                    navigation.navigate('BidPriceModal', {
                      price: proposedPrice,
                      onConfirmPrice: ({ price }) => {
                        setProposedPrice(price);
                      },
                    })
                  }
                  style={styles.bidReadoutRow}
                >
                  <Text style={styles.bidValueText}>{proposedPrice}</Text>
                  <Text style={styles.bidCurrencyText}>DH</Text>
                </Pressable>

                <Pressable
                  onPress={handleIncreasePrice}
                  style={({ pressed }) => [
                    styles.stepperSquareBtn,
                    pressed && styles.pressedScale95,
                  ]}
                  accessibilityLabel="Augmenter le prix"
                >
                  <MaterialIcons name="add" size={20} color="#DDE1FF" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Assurance & Trust Banner */}
          <View style={styles.assuranceBanner}>
            <MaterialIcons name="verified-user" size={17} color="#63F4E0" />
            <Text style={styles.assuranceText}>
              Artisans certifiés InHome • Paiement direct après service
            </Text>
          </View>

          {/* Primary Full-Width CTA (Saffron Vibrant Tactile Pill) */}
          <Pressable
            onPress={handleFindArtisan}
            style={({ pressed }) => [
              styles.primaryCtaBtn,
              pressed && styles.pressedScale98,
            ]}
          >
            {submitState === 'searching' ? (
              <>
                <ActivityIndicator size="small" color="#6B4900" />
                <Text style={styles.primaryCtaText}>
                  Recherche d'artisans...
                </Text>
              </>
            ) : submitState === 'found' ? (
              <>
                <MaterialIcons name="check-circle" size={22} color="#6B4900" />
                <Text style={styles.primaryCtaText}>
                  3 prestataires trouvés !
                </Text>
              </>
            ) : (
              <>
                <MaterialIcons name="radar" size={22} color="#6B4900" />
                <Text style={styles.primaryCtaText}>
                  Trouver un prestataire
                </Text>
              </>
            )}
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
  // Map Canvas Layer
  mapCanvas: {
    width: '100%',
    height: 360,
    position: 'relative',
    overflow: 'hidden',
  },
  topControlBar: {
    position: 'relative',
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  mapRoundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  geoStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  geoDotWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  geoDotRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3FD7C4',
  },
  geoDotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#63F4E0',
  },
  geoStatusText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#DDE1FF',
    letterSpacing: -0.2,
  },
  // Artisan Map Markers
  markerPlumber: {
    position: 'absolute',
    top: 96,
    left: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3FD7C4',
    borderWidth: 2,
    borderColor: '#63F4E0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3FD7C4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  markerElectrician: {
    position: 'absolute',
    top: 118,
    right: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  electricianCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFB300',
    borderWidth: 2,
    borderColor: '#FFD79B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  markerPainter: {
    position: 'absolute',
    top: 194,
    left: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.92,
  },
  painterCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1023D7',
    borderWidth: 2,
    borderColor: '#BDC2FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1023D7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  etaBadgePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    backgroundColor: 'rgba(44, 51, 82, 0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  etaBadgeText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
  },
  // Client Pinned Hero Location
  clientHeroPin: {
    position: 'absolute',
    top: 152,
    left: '50%',
    marginLeft: -22,
    alignItems: 'center',
  },
  clientRadarHalo: {
    position: 'absolute',
    top: -10,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 215, 155, 0.25)',
  },
  clientPinDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFB300',
    borderWidth: 4,
    borderColor: '#040B2A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  clientStemDot: {
    width: 10,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFB300',
    marginTop: 3,
    opacity: 0.85,
  },
  // Bottom Sheet Container
  bottomSheet: {
    marginTop: -28,
    zIndex: 30,
    width: '100%',
    backgroundColor: '#161E3C',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 14,
    shadowColor: '#040B2A',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 18,
  },
  dragHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#303757',
    alignSelf: 'center',
    marginBottom: 12,
  },
  // Sheet Header Section
  headerSection: {
    gap: 4,
    marginBottom: 16,
  },
  stepMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepLabel: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#BDC2FF',
    letterSpacing: 1.1,
    flexShrink: 1,
  },
  artisansReadyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 0,
  },
  readyTealDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#63F4E0',
  },
  artisansReadyText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#63F4E0',
  },
  sheetTitle: {
    fontFamily: tokens.fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.4,
  },
  addressBar: {
    marginTop: 4,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#121A38',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  addressBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  addressBarText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: '#DDE1FF',
    flex: 1,
  },
  modifierBtnText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#BDC2FF',
  },
  // Tappable Details Checklist Bento Stack
  bentoStack: {
    gap: 10,
    marginBottom: 18,
  },
  bentoRowCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#212847',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  bentoRowCardPressed: {
    backgroundColor: '#2C3352',
    transform: [{ scale: 0.99 }],
  },
  bentoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  photoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 35, 215, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  descIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(63, 215, 196, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bentoRowCopy: {
    flex: 1,
    minWidth: 0,
  },
  bentoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bentoRowTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: '#DDE1FF',
    flexShrink: 1,
  },
  bentoRowSub: {
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: '#BDC2FF',
    marginTop: 1,
  },
  descInlineInput: {
    marginTop: 4,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#121A38',
    paddingHorizontal: 10,
    fontFamily: tokens.fonts.regular,
    fontSize: 14,
    color: '#DDE1FF',
  },
  // Row 3: Price Proposal Stepper Card
  priceProposalCard: {
    width: '100%',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#212847',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  priceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  priceLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 0,
  },
  paymentsIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  priceCopyCol: {
    flex: 1,
    minWidth: 0,
  },
  priceHintSub: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#BDC2FF',
  },
  recommendedPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
    flexShrink: 0,
  },
  recommendedPillText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#FFD79B',
  },
  bidStepperBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121A38',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  stepperSquareBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidReadoutRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  bidValueText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: '#FFD79B',
  },
  bidCurrencyText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: '#DDE1FF',
    letterSpacing: 0.5,
  },
  // Assurance & Trust Banner
  assuranceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(18, 26, 56, 0.65)',
    marginBottom: 18,
  },
  assuranceText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#BDC2FF',
    textAlign: 'center',
    flexShrink: 1,
  },
  // Primary Full-Width CTA
  primaryCtaBtn: {
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
  primaryCtaText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: '#6B4900',
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
});