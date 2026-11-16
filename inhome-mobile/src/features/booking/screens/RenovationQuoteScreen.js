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
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Pattern,
  Path,
  Rect,
  Circle,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CLIENT_PIN_X = Math.round((110 / 390) * SCREEN_WIDTH);
const SUPPLIER_PIN_X = Math.round((275 / 390) * SCREEN_WIDTH);

const QUOTE_TIERS = [
  {
    id: 'complet',
    title: 'Devis complet',
    badge: 'OPTIMAL',
    badgeType: 'primary',
    description: 'Visite + métré + chiffrage sous 24h',
    price: 350,
    subPriceNote: 'Déductible des travaux',
    icon: 'check',
    iconColor: '#6B4900',
    trustBadges: [
      { icon: 'shield', label: 'Garantie InHome 100%', tone: 'secondary' },
      { icon: 'commute', label: 'Déplacement inclus', tone: 'tertiary' },
    ],
  },
  {
    id: 'express',
    title: 'Devis express — visite rapide',
    badge: null,
    description: 'Évaluation 30 min sur place',
    price: 268,
    subPriceNote: null,
    icon: 'schedule',
    iconColor: '#D6C4AC',
    trustBadges: [
      { icon: 'bolt', label: 'Créneau prioritaire', tone: 'secondary' },
      { icon: 'commute', label: 'Déplacement inclus', tone: 'tertiary' },
    ],
  },
  {
    id: 'remote',
    title: 'Devis à distance',
    badge: 'Économique',
    badgeType: 'tertiary',
    description: 'Estimation sous 2h par photo/vidéo',
    price: 100,
    subPriceNote: null,
    icon: 'videocam',
    iconColor: '#63F4E0',
    trustBadges: [
      { icon: 'verified', label: 'Chiffrage certifié', tone: 'secondary' },
      { icon: 'schedule', label: 'Réponse sous 2h', tone: 'tertiary' },
    ],
  },
];

export default function RenovationQuoteScreen({ navigation, route }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();

  const addressStreet =
    route?.params?.street || 'Avenue Marrakech, Imm. 14';
  const addressDistrict =
    route?.params?.district || 'Quartier Racine, Casablanca';

  const [projectScope, setProjectScope] = useState(
    route?.params?.scope || 'Rénovation salle de bain'
  );
  const [isEditingScope, setIsEditingScope] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState('complet');

  const routePulseAnim = useRef(new Animated.Value(0.55)).current;
  const chantierPingAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const routeLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(routePulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(routePulseAnim, {
          toValue: 0.5,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    const pinDotLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(chantierPingAnim, {
          toValue: 0.3,
          duration: 850,
          useNativeDriver: true,
        }),
        Animated.timing(chantierPingAnim, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true,
        }),
      ])
    );

    routeLoop.start();
    pinDotLoop.start();

    return () => {
      routeLoop.stop();
      pinDotLoop.stop();
    };
  }, [routePulseAnim, chantierPingAnim]);

  const activeTier =
    QUOTE_TIERS.find((t) => t.id === selectedTierId) || QUOTE_TIERS[0];

  const handleFindArtisan = () => {
    if (navigation?.navigate) {
      navigation.navigate('SearchingArtisan', {
        serviceTitle: `${projectScope} • ${activeTier.title}`,
        price: activeTier.price,
        quoteTier: activeTier.id,
        address: `${addressStreet} • ${addressDistrict}`,
      });
    }
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* 1. Ambient Map & Logistics Canvas Section (370px) */}
        <View
          style={[
            styles.mapSection,
            { backgroundColor: colors.surfaceContainerLowest },
          ]}
        >
          {/* Static Dark Map Backdrop */}
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZOapPbuYV6LBnMx3DEoFYtUR-Nk-QdSQw_OaICk9ASlKO-eYiK09eprywn6p_c6vCdTpx3K7sSzUZJqHAs6zqoeeV3LWgHmPRJ5mpakyvDIhow6gqsUSuqj1bjMBYoob6uO4XshGY9xbQohmmFvBDleVY7Nc20eXww-xoRHvPaK7A11r7bm7r7eXmYVJ3O5JaTdfNyyVZTn2O7Sl4i1G-iK72N5w_SySl2buW0GbC',
            }}
            style={styles.mapBackdropImg}
          />

          {/* Stylized Dark Vector Map Overlay with Moroccan Zellige Watermark */}
          <Svg
            width={SCREEN_WIDTH}
            height={370}
            viewBox="0 0 390 370"
            preserveAspectRatio="none"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            <Defs>
              {/* Subtle 8-Point Moroccan Star / Zellige Tile Watermark */}
              <Pattern
                id="zellige-grid"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <Path
                  d="M24 0 L28 14 L42 14 L31 22 L35 36 L24 28 L13 36 L17 22 L6 14 L20 14 Z"
                  fill="#63F4E0"
                  fillOpacity="0.045"
                />
                <Path
                  d="M0 24 L14 20 L14 6 L22 17 L36 13 L28 24 L36 35 L22 31 L14 42 L14 28 Z"
                  fill="#FFD79B"
                  fillOpacity="0.035"
                />
              </Pattern>

              <LinearGradient
                id="routeGlow"
                x1="110"
                y1="215"
                x2="275"
                y2="145"
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0%" stopColor="#FFB300" stopOpacity="0.95" />
                <Stop offset="100%" stopColor="#3FD7C4" stopOpacity="0.85" />
              </LinearGradient>

              <RadialGradient id="clientRadar" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#FFB300" stopOpacity="0.35" />
                <Stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
              </RadialGradient>
            </Defs>

            {/* Zellige Geometry Canvas Backdrop */}
            <Rect width="390" height="370" fill="url(#zellige-grid)" />

            {/* Vector Midnight Road Network */}
            <Path
              d="M-20 80 Q 90 90, 180 50 T 410 70"
              stroke="#161E3C"
              strokeLinecap="round"
              strokeWidth="14"
              fill="none"
            />
            <Path
              d="M60 -20 L95 190 L130 380"
              stroke="#161E3C"
              strokeLinecap="round"
              strokeWidth="12"
              fill="none"
            />
            <Path
              d="M220 -20 L240 180 L290 380"
              stroke="#121A38"
              strokeLinecap="round"
              strokeWidth="18"
              fill="none"
            />
            <Path
              d="M-10 240 C 90 230, 200 270, 400 220"
              stroke="#161E3C"
              strokeLinecap="round"
              strokeWidth="10"
              fill="none"
            />
            <Path
              d="M110 215 L 275 145"
              stroke="#212847"
              strokeLinecap="round"
              strokeWidth="6"
              fill="none"
            />

            {/* Logistics Supply Corridor (Dotted Saffron-Teal Path) */}
            <Path
              d="M110 215 C 160 210, 205 185, 275 145"
              stroke="url(#routeGlow)"
              strokeDasharray="6 6"
              strokeLinecap="round"
              strokeWidth="3.5"
              fill="none"
            />

            {/* Client Location Radar Glow */}
            <Circle cx="110" cy="215" r="32" fill="url(#clientRadar)" />

            {/* Subtle Neighboring Artisan Markers */}
            <Circle cx="68" cy="130" r="14" fill="#161E3C" />
            <Circle cx="68" cy="130" r="5" fill="#BDC2FF" fillOpacity="0.7" />
            <Circle cx="330" cy="245" r="14" fill="#161E3C" />
            <Circle cx="330" cy="245" r="5" fill="#BDC2FF" fillOpacity="0.6" />
          </Svg>

          {/* Interactive Map Pins Layer */}
          {/* 1. Client Residence Pin ("Votre chantier") */}
          <View
            pointerEvents="none"
            style={[
              styles.clientPinAnchor,
              { left: CLIENT_PIN_X - 58, top: 132 },
            ]}
          >
            <View style={styles.chantierCalloutPill}>
              <Animated.View
                style={[styles.chantierDot, { opacity: chantierPingAnim }]}
              />
              <Text style={styles.chantierCalloutText}>Votre chantier</Text>
            </View>
            <View style={styles.clientSaffronPin}>
              <MaterialIcons name="home" size={22} color="#6B4900" />
            </View>
            <View style={styles.clientPinTip} />
          </View>

          {/* 2. Hardware Materials Supplier Pin ("Comptoir BTP Racine") */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.supplierPinAnchor,
              {
                left: SUPPLIER_PIN_X - 82,
                top: 66,
                opacity: routePulseAnim,
              },
            ]}
          >
            <View style={styles.supplierCalloutPill}>
              <MaterialIcons name="store" size={13} color="#63F4E0" />
              <Text style={styles.supplierCalloutText} numberOfLines={1}>
                Comptoir BTP Racine
              </Text>
            </View>
            <View style={styles.supplierCirclePin}>
              <MaterialIcons name="hardware" size={20} color="#63F4E0" />
            </View>
            <View style={styles.supplierPinTip} />
          </Animated.View>

          {/* Live Logistics Pill Floating Indicator */}
          <View style={styles.logisticsPill}>
            <MaterialIcons name="local-shipping" size={16} color="#FFB300" />
            <Text style={styles.logisticsPillText}>
              Hub logistique à 1,4 km • Racine Nord
            </Text>
          </View>

          {/* Floating Top Context Card (Address & Scope) */}
          <View
            style={[
              styles.topContextWrapper,
              { paddingTop: Math.max(insets.top, 10) + 4 },
            ]}
          >
            <View style={styles.topContextCard}>
              {/* Row 1: Location Info */}
              <View style={styles.contextRow}>
                <View style={styles.contextRowLeft}>
                  <View style={styles.locationBadgeIcon}>
                    <MaterialIcons
                      name="location-on"
                      size={18}
                      color="#FFB300"
                    />
                  </View>
                  <View style={styles.contextTextBlock}>
                    <Text style={styles.contextPrimaryText} numberOfLines={1}>
                      {addressStreet}
                    </Text>
                    <Text
                      style={styles.contextSecondaryText}
                      numberOfLines={1}
                    >
                      {addressDistrict}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => navigation?.navigate?.('LocationPicker')}
                  style={({ pressed }) => [
                    styles.modifierPillBtn,
                    pressed && styles.pressedScale95,
                  ]}
                >
                  <Text style={styles.modifierPillText}>Modifier</Text>
                </Pressable>
              </View>

              {/* Subtle Separator */}
              <View style={styles.contextDivider} />

              {/* Row 2: Scope Info */}
              <View style={styles.contextRow}>
                <View style={styles.contextRowLeft}>
                  <View style={styles.scopeBadgeIcon}>
                    <MaterialIcons name="bathtub" size={18} color="#63F4E0" />
                  </View>
                  <View style={styles.contextTextBlock}>
                    {isEditingScope ? (
                      <TextInput
                        value={projectScope}
                        onChangeText={setProjectScope}
                        onBlur={() => setIsEditingScope(false)}
                        placeholder="Nom du chantier..."
                        placeholderTextColor="#9E8E78"
                        style={styles.scopeEditInput}
                        autoFocus
                      />
                    ) : (
                      <Text
                        style={styles.contextPrimaryText}
                        numberOfLines={1}
                      >
                        {projectScope}
                      </Text>
                    )}
                    <Text
                      style={styles.contextSecondaryText}
                      numberOfLines={1}
                    >
                      Intervention estimée à ~2 jours
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => setIsEditingScope((prev) => !prev)}
                  style={({ pressed }) => [
                    styles.editRoundBtn,
                    pressed && styles.pressedScale95,
                  ]}
                  accessibilityLabel="Modifier le projet"
                >
                  <MaterialIcons
                    name={isEditingScope ? 'check' : 'edit'}
                    size={15}
                    color={isEditingScope ? '#63F4E0' : '#D6C4AC'}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* 2. Bottom Sheet: Quote Formulation Options */}
        <View
          style={[
            styles.bottomSheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 10 },
          ]}
        >
          {/* Sheet Drag Bar */}
          <View style={styles.dragHandle} />

          {/* Sheet Header */}
          <View style={styles.sheetHeaderRow}>
            <View style={styles.sheetHeaderLeft}>
              <View style={styles.sheetTitleBadgeRow}>
                <Text style={styles.sheetTitle}>Formules de devis</Text>
                <View style={styles.proRecommendedBadge}>
                  <Text style={styles.proRecommendedText}>Pro Recommandé</Text>
                </View>
              </View>
              <Text style={styles.sheetSubtitle}>
                Intervention gros œuvre & rénovation certifiée
              </Text>
            </View>

            <View style={styles.shieldCircleIcon}>
              <MaterialIcons name="verified-user" size={18} color="#63F4E0" />
            </View>
          </View>

          {/* Tier Selection Stack (Interactive Radio Cards) */}
          <View style={styles.tierStack}>
            {QUOTE_TIERS.map((tier) => {
              const isSelected = tier.id === selectedTierId;

              if (isSelected) {
                return (
                  <Pressable
                    key={tier.id}
                    onPress={() => setSelectedTierId(tier.id)}
                    style={({ pressed }) => [
                      styles.selectedTierCard,
                      pressed && styles.pressedScale99,
                    ]}
                  >
                    <View style={styles.selectedTierTopRow}>
                      <View style={styles.selectedTierLeft}>
                        {/* Moroccan Saffron Check Badge */}
                        <View style={styles.saffronCheckCircle}>
                          <MaterialIcons
                            name="check"
                            size={18}
                            color="#6B4900"
                          />
                        </View>

                        <View style={styles.tierCopyCol}>
                          <View style={styles.tierTitleRow}>
                            <Text
                              style={styles.selectedTierTitle}
                              numberOfLines={1}
                            >
                              {tier.title}
                            </Text>
                            {tier.badge && (
                              <View
                                style={[
                                  styles.tierInlineBadge,
                                  tier.badgeType === 'tertiary' &&
                                    styles.tierInlineBadgeTeal,
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.tierInlineBadgeText,
                                    tier.badgeType === 'tertiary' &&
                                      styles.tierInlineBadgeTextTeal,
                                  ]}
                                >
                                  {tier.badge}
                                </Text>
                              </View>
                            )}
                          </View>

                          <Text style={styles.selectedTierDesc}>
                            {tier.description}
                          </Text>
                        </View>
                      </View>

                      {/* Pricing Right Block */}
                      <View style={styles.selectedPriceCol}>
                        <View style={styles.priceRowBaseline}>
                          <Text style={styles.selectedPriceBig}>
                            {tier.price}
                          </Text>
                          <Text style={styles.selectedPriceCurrency}>DH</Text>
                        </View>
                        {tier.subPriceNote && (
                          <Text style={styles.deductibleNote}>
                            {tier.subPriceNote}
                          </Text>
                        )}
                      </View>
                    </View>

                    {/* Trust Badges Chips */}
                    <View style={styles.trustChipsRow}>
                      {tier.trustBadges.map((tb) => (
                        <View key={tb.label} style={styles.trustChip}>
                          <MaterialIcons
                            name={tb.icon}
                            size={14}
                            color={
                              tb.tone === 'tertiary' ? '#63F4E0' : '#BDC2FF'
                            }
                          />
                          <Text
                            style={[
                              styles.trustChipText,
                              tb.tone === 'tertiary' &&
                                styles.trustChipTextTeal,
                            ]}
                          >
                            {tb.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={tier.id}
                  onPress={() => setSelectedTierId(tier.id)}
                  style={({ pressed }) => [
                    styles.unselectedTierCard,
                    pressed && styles.unselectedTierPressed,
                  ]}
                >
                  <View style={styles.unselectedLeft}>
                    <View style={styles.unselectedIconCircle}>
                      <MaterialIcons
                        name={tier.icon}
                        size={16}
                        color={tier.iconColor}
                      />
                    </View>

                    <View style={styles.tierCopyCol}>
                      <View style={styles.tierTitleRow}>
                        <Text
                          style={styles.unselectedTierTitle}
                          numberOfLines={1}
                        >
                          {tier.title}
                        </Text>
                        {tier.badge && (
                          <View style={styles.ecoBadge}>
                            <Text style={styles.ecoBadgeText}>
                              {tier.badge}
                            </Text>
                          </View>
                        )}
                      </View>

                      <Text
                        style={styles.unselectedTierDesc}
                        numberOfLines={1}
                      >
                        {tier.description}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.unselectedPriceRow}>
                    <Text style={styles.unselectedPriceNum}>{tier.price}</Text>
                    <Text style={styles.unselectedPriceDh}>DH</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Assurance Reassurance Note */}
          <View style={styles.assuranceNoteBar}>
            <View style={styles.assuranceNoteLeft}>
              <MaterialIcons name="info" size={16} color="#FFB300" />
              <Text style={styles.assuranceNoteText} numberOfLines={1}>
                Paiement sécurisé après validation de l'artisan
              </Text>
            </View>
            <Text style={styles.conditionsLink}>Conditions</Text>
          </View>

          {/* Bottom Action Bar Row */}
          <View style={styles.bottomActionsRow}>
            <Pressable
              onPress={handleFindArtisan}
              style={({ pressed }) => [
                styles.primaryCtaPill,
                pressed && styles.pressedScale98,
              ]}
            >
              <Text style={styles.primaryCtaLabel}>
                Trouver un prestataire
              </Text>
              <MaterialIcons name="east" size={20} color="#6B4900" />
            </Pressable>

            <Pressable
              onPress={() => navigation?.navigate?.('RequestDetails')}
              style={({ pressed }) => [
                styles.filterTuneRoundBtn,
                pressed && styles.pressedScale95,
              ]}
              accessibilityLabel="Filtres avancés"
            >
              <MaterialIcons name="tune" size={22} color="#DDE1FF" />
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
  // Map & Logistics Section
  mapSection: {
    width: '100%',
    height: 370,
    position: 'relative',
    overflow: 'hidden',
  },
  mapBackdropImg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.35,
    resizeMode: 'cover',
  },
  // Map Pins
  clientPinAnchor: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 15,
  },
  chantierCalloutPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#2C3352',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  chantierDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFB300',
  },
  chantierCalloutText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '600',
    color: '#FFD79B',
    letterSpacing: -0.2,
  },
  clientSaffronPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
  },
  clientPinTip: {
    width: 8,
    height: 8,
    backgroundColor: '#FFB300',
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
    borderRadius: 1,
  },
  supplierPinAnchor: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 14,
  },
  supplierCalloutPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#161E3C',
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: 170,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  supplierCalloutText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '500',
    color: '#D6C4AC',
  },
  supplierCirclePin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#303757',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  supplierPinTip: {
    width: 8,
    height: 8,
    backgroundColor: '#303757',
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
    borderRadius: 1,
  },
  // Live Logistics Pill
  logisticsPill: {
    position: 'absolute',
    bottom: 28,
    left: 16,
    zIndex: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: 'rgba(33, 40, 71, 0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  logisticsPillText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#DDE1FF',
  },
  // Floating Top Context Card
  topContextWrapper: {
    position: 'absolute',
    top: 0,
    left: 12,
    right: 12,
    zIndex: 20,
  },
  topContextCard: {
    width: '100%',
    backgroundColor: 'rgba(22, 30, 60, 0.96)',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 12,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  contextRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  locationBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scopeBadgeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(63, 215, 196, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  contextTextBlock: {
    flex: 1,
    minWidth: 0,
  },
  contextPrimaryText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  contextSecondaryText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  scopeEditInput: {
    height: 26,
    paddingHorizontal: 8,
    paddingVertical: 0,
    borderRadius: 6,
    backgroundColor: '#212847',
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    color: '#DDE1FF',
  },
  modifierPillBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#212847',
    flexShrink: 0,
  },
  modifierPillText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#BDC2FF',
  },
  contextDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(44, 51, 82, 0.45)',
  },
  editRoundBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  // Bottom Sheet
  bottomSheet: {
    width: '100%',
    marginTop: -20,
    zIndex: 20,
    backgroundColor: '#121A38',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 18,
  },
  dragHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2C3352',
    alignSelf: 'center',
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  sheetHeaderLeft: {
    flex: 1,
    minWidth: 0,
  },
  sheetTitleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 2,
  },
  sheetTitle: {
    fontFamily: tokens.fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.3,
  },
  proRecommendedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 35, 215, 0.4)',
  },
  proRecommendedText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#BDC2FF',
  },
  sheetSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
  },
  shieldCircleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  // Tier Selection Stack
  tierStack: {
    gap: 10,
  },
  selectedTierCard: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#212847',
    borderWidth: 2,
    borderColor: '#FFB300',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  selectedTierTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  selectedTierLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  saffronCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  tierCopyCol: {
    flex: 1,
    minWidth: 0,
  },
  tierTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTierTitle: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#DDE1FF',
  },
  tierInlineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 1.5,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 179, 0, 0.2)',
  },
  tierInlineBadgeTeal: {
    backgroundColor: 'rgba(63, 215, 196, 0.2)',
  },
  tierInlineBadgeText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '600',
    color: '#FFBA38',
    letterSpacing: 0.5,
  },
  tierInlineBadgeTextTeal: {
    color: '#63F4E0',
  },
  selectedTierDesc: {
    fontFamily: tokens.fonts.regular,
    fontSize: 15,
    lineHeight: 21,
    color: '#D6C4AC',
    marginTop: 2,
  },
  selectedPriceCol: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  priceRowBaseline: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  selectedPriceBig: {
    fontFamily: tokens.fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: '#DDE1FF',
  },
  selectedPriceCurrency: {
    fontFamily: tokens.fonts.bold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    color: '#FFD79B',
  },
  deductibleNote: {
    fontFamily: tokens.fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    color: '#D6C4AC',
  },
  trustChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 2,
  },
  trustChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#161E3C',
  },
  trustChipText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#BDC2FF',
  },
  trustChipTextTeal: {
    color: '#63F4E0',
  },
  // Unselected Tier Cards
  unselectedTierCard: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#161E3C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  unselectedTierPressed: {
    backgroundColor: '#212847',
  },
  unselectedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  unselectedIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#303757',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  unselectedTierTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
    flexShrink: 1,
  },
  ecoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(63, 215, 196, 0.2)',
    flexShrink: 0,
  },
  ecoBadgeText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#63F4E0',
  },
  unselectedTierDesc: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
    marginTop: 1,
  },
  unselectedPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    flexShrink: 0,
  },
  unselectedPriceNum: {
    fontFamily: tokens.fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#DDE1FF',
  },
  unselectedPriceDh: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  // Assurance Reassurance Note
  assuranceNoteBar: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(22, 30, 60, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  assuranceNoteLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  assuranceNoteText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
    flex: 1,
  },
  conditionsLink: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#BDC2FF',
    flexShrink: 0,
  },
  // Bottom Action Bar Row
  bottomActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
  },
  primaryCtaPill: {
    flex: 1,
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
  primaryCtaLabel: {
    fontFamily: tokens.fonts.bold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    color: '#6B4900',
  },
  filterTuneRoundBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  pressedScale99: {
    transform: [{ scale: 0.99 }],
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
});