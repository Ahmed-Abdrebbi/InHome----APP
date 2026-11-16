import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    title: 'Résidence Fgdal, Imm. C',
    district: 'Maârif',
    city: 'Casablanca',
    distance: '1.4 km',
    icon: 'apartment',
    category: 'suggested',
    saved: false,
  },
  {
    id: 'addr-2',
    title: 'Café Fgd Oasis',
    district: 'Quartier Oasis',
    city: 'Casablanca',
    distance: '2.8 km',
    icon: 'local-cafe',
    category: 'suggested',
    saved: false,
  },
  {
    id: 'addr-3',
    title: 'Pharmacie Fgdani',
    district: 'Racine, Rue El Bohtori',
    city: 'Casablanca',
    distance: '3.2 km',
    icon: 'local-pharmacy',
    category: 'suggested',
    saved: true,
  },
  {
    id: 'addr-4',
    title: 'Résidence Bab Fgdoud',
    district: "Ain Diab, Bd de l'Océan",
    city: 'Casablanca',
    distance: '5.1 km',
    icon: 'home',
    category: 'suggested',
    saved: false,
  },
];

const PREDICTIVE_CHIPS = ['Fgdal', 'Ghandi', 'Fiduciaire', 'Racine'];

export default function AddressSearchScreen({ navigation, route }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef(null);

  const [query, setQuery] = useState('Fgd');
  const [activeTab, setActiveTab] = useState('results'); // 'results' | 'suggested' | 'saved'
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);

  const filteredAddresses = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (activeTab === 'saved') {
      return addresses.filter((item) => item.saved);
    }

    if (activeTab === 'suggested') {
      return addresses;
    }

    if (!trimmed) {
      return addresses;
    }

    return addresses.filter(
      (item) =>
        item.title.toLowerCase().includes(trimmed) ||
        item.district.toLowerCase().includes(trimmed)
    );
  }, [addresses, activeTab, query]);

  const toggleBookmark = (id) => {
    setAddresses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, saved: !item.saved } : item
      )
    );
  };

  const handleSelectAddress = (item) => {
    if (route?.params?.onSelectAddress) {
      route.params.onSelectAddress(item);
    }
    if (navigation?.navigate) {
      navigation.navigate('LocationPicker', { selectedPlace: item });
    }
  };

  const handleOpenMapPicker = () => {
    if (navigation?.navigate) {
      navigation.navigate('LocationPicker');
    }
  };

  const handleClose = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('MapHome');
    }
  };

  const renderHighlightedTitle = (title) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return (
        <Text style={styles.resultTitle} numberOfLines={1}>
          {title}
        </Text>
      );
    }

    const lowerTitle = title.toLowerCase();
    const lowerQuery = cleanQuery.toLowerCase();
    const matchIndex = lowerTitle.indexOf(lowerQuery);

    if (matchIndex === -1) {
      return (
        <Text style={styles.resultTitle} numberOfLines={1}>
          {title}
        </Text>
      );
    }

    const before = title.slice(0, matchIndex);
    const match = title.slice(matchIndex, matchIndex + cleanQuery.length);
    const after = title.slice(matchIndex + cleanQuery.length);

    return (
      <Text style={styles.resultTitle} numberOfLines={1}>
        {before}
        <Text style={styles.resultTitleHighlight}>{match}</Text>
        {after}
      </Text>
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }]}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Subtle Architectural Moroccan 8-Point Star Watermark (~3.5% opacity) */}
      <View style={styles.starWatermark} pointerEvents="none">
        <Svg width={460} height={460} viewBox="0 0 100 100">
          <Path
            d="M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z"
            fill="#FFD79B"
          />
          <Path
            d="M50 7 L59 41 L93 50 L59 59 L50 93 L41 59 L7 50 L41 41 Z"
            fill="#FFD79B"
            opacity="0.5"
          />
        </Svg>
      </View>

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 12) + 8,
              paddingBottom: 24,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerTextCol}>
              <Text style={styles.headerTitle}>Entrez votre adresse</Text>
              <Text style={styles.headerSubtitle}>
                Casablanca • خدمة المنازل
              </Text>
            </View>

            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.closeCircleBtn,
                pressed && styles.pressedScale95,
              ]}
              accessibilityLabel="Fermer"
            >
              <MaterialIcons name="close" size={20} color="#DDE1FF" />
            </Pressable>
          </View>

          {/* 2. Stacked Search Form Card */}
          <View style={styles.formWrapper}>
            <View style={styles.stackedCard}>
              {/* Field 1: Current Origin Position */}
              <Pressable
                onPress={handleOpenMapPicker}
                style={({ pressed }) => [
                  styles.originField,
                  pressed && styles.originFieldPressed,
                ]}
              >
                <View style={styles.originLeft}>
                  <View style={styles.originIconCircle}>
                    <MaterialIcons name="near-me" size={18} color="#FFBA38" />
                  </View>

                  <View style={styles.originCopy}>
                    <View style={styles.originTitleRow}>
                      <Text style={styles.originTitle} numberOfLines={1}>
                        Ma position actuelle
                      </Text>
                      <View style={styles.gpsBadge}>
                        <View style={styles.gpsTealDot} />
                        <Text style={styles.gpsBadgeText}>GPS actif</Text>
                      </View>
                    </View>
                    <Text style={styles.originSub} numberOfLines={1}>
                      Boulevard d'Anfa, Casablanca
                    </Text>
                  </View>
                </View>

                <MaterialIcons
                  name="check-circle"
                  size={18}
                  color="rgba(189, 194, 255, 0.5)"
                />
              </Pressable>

              {/* Vertical Connection Indicator */}
              <View style={styles.connectorRow}>
                <View style={styles.connectorBar} />
              </View>

              {/* Field 2: Destination Focused Search Input */}
              <View style={styles.destinationField}>
                <View style={styles.destinationLeft}>
                  <MaterialIcons name="search" size={20} color="#FFBA38" />
                  <TextInput
                    ref={searchInputRef}
                    value={query}
                    onChangeText={(text) => {
                      setQuery(text);
                      if (activeTab !== 'results') {
                        setActiveTab('results');
                      }
                    }}
                    placeholder="Rechercher un quartier, une rue..."
                    placeholderTextColor="rgba(189, 194, 255, 0.45)"
                    selectionColor="#FFBA38"
                    style={styles.destinationInput}
                    autoFocus
                    returnKeyType="search"
                  />
                </View>

                {/* Right Input Controls: Clear + Divider + Map Trigger */}
                <View style={styles.destinationActions}>
                  {query.length > 0 && (
                    <Pressable
                      onPress={() => {
                        setQuery('');
                        searchInputRef.current?.focus();
                      }}
                      style={({ pressed }) => [
                        styles.clearInputBtn,
                        pressed && styles.pressedScale90,
                      ]}
                      accessibilityLabel="Effacer"
                    >
                      <MaterialIcons
                        name="close"
                        size={14}
                        color="rgba(221, 225, 255, 0.85)"
                      />
                    </Pressable>
                  )}

                  <View style={styles.verticalDivider} />

                  <Pressable
                    onPress={handleOpenMapPicker}
                    style={({ pressed }) => [
                      styles.mapIconBtn,
                      pressed && styles.pressedScale95,
                    ]}
                    accessibilityLabel="Choisir sur la carte"
                  >
                    <MaterialIcons name="map" size={19} color="#BDC2FF" />
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {/* 3. Filter Segment Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            <Pressable
              onPress={() => setActiveTab('results')}
              style={[
                styles.tabPill,
                activeTab === 'results' && styles.tabPillActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'results' && styles.tabTextActive,
                ]}
              >
                Résultats ({filteredAddresses.length})
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('suggested')}
              style={[
                styles.tabPill,
                activeTab === 'suggested' && styles.tabPillActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'suggested' && styles.tabTextActive,
                ]}
              >
                Suggérées
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab('saved')}
              style={[
                styles.tabPill,
                activeTab === 'saved' && styles.tabPillActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'saved' && styles.tabTextActive,
                ]}
              >
                Enregistrées
              </Text>
            </Pressable>
          </ScrollView>

          {/* 4. Results List Header Note */}
          <View style={styles.listSectionHeader}>
            <Text style={styles.listSectionTitle}>ADRESSES À PROXIMITÉ</Text>
            <Pressable
              onPress={() => setActiveTab('suggested')}
              style={styles.filterTrigger}
            >
              <MaterialIcons name="tune" size={14} color="#FFBA38" />
              <Text style={styles.filterText}>Filtrer</Text>
            </Pressable>
          </View>

          {/* 5. Moroccan Casablanca Suggestions List */}
          <View style={styles.resultsColumn}>
            {filteredAddresses.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleSelectAddress(item)}
                style={({ pressed }) => [
                  styles.resultCard,
                  pressed && styles.resultCardPressed,
                ]}
              >
                <View style={styles.resultLeft}>
                  <View style={styles.resultIconCircle}>
                    <MaterialIcons
                      name={item.icon}
                      size={20}
                      color="#FFBA38"
                    />
                  </View>

                  <View style={styles.resultCopy}>
                    {renderHighlightedTitle(item.title)}

                    <View style={styles.resultMetaRow}>
                      <Text style={styles.resultMetaText} numberOfLines={1}>
                        {item.district}
                      </Text>
                      <Text style={styles.resultMetaDot}>•</Text>
                      <Text style={styles.resultMetaText}>{item.city}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.resultRight}>
                  <Text style={styles.distanceText}>{item.distance}</Text>
                  <Pressable
                    onPress={() => toggleBookmark(item.id)}
                    hitSlop={8}
                    style={({ pressed }) => [
                      pressed && styles.pressedScale90,
                    ]}
                  >
                    <MaterialIcons
                      name={item.saved ? 'bookmark' : 'bookmark-border'}
                      size={20}
                      color={
                        item.saved ? '#FFBA38' : 'rgba(189, 194, 255, 0.6)'
                      }
                    />
                  </Pressable>
                </View>
              </Pressable>
            ))}

            {/* Quick Action: Pinpoint Directly on Vector Map */}
            <View style={styles.mapActionWrap}>
              <Pressable
                onPress={handleOpenMapPicker}
                style={({ pressed }) => [
                  styles.pinpointMapBtn,
                  pressed && styles.pressedScale98,
                ]}
              >
                <MaterialIcons name="pin-drop" size={22} color="#FFBA38" />
                <Text style={styles.pinpointMapText}>
                  Pointer directement sur la carte
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* 6. Predictive Quick Suggestion Bar (Docked Above Native Keyboard) */}
        <View
          style={[
            styles.predictiveBar,
            { paddingBottom: Math.max(insets.bottom, 8) },
          ]}
        >
          {PREDICTIVE_CHIPS.map((chip, index) => (
            <React.Fragment key={chip}>
              <Pressable
                onPress={() => {
                  setQuery(chip);
                  setActiveTab('results');
                }}
                style={({ pressed }) => [
                  styles.predictiveChip,
                  pressed && styles.predictiveChipPressed,
                ]}
              >
                <Text
                  style={[
                    styles.predictiveText,
                    index === 1 && styles.predictiveTextBold,
                  ]}
                >
                  {index === 0 ? `"${chip}"` : chip}
                </Text>
              </Pressable>
              {index < PREDICTIVE_CHIPS.length - 1 && (
                <View style={styles.predictiveDivider} />
              )}
            </React.Fragment>
          ))}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  flexContainer: {
    flex: 1,
  },
  starWatermark: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.035,
  },
  scrollView: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Header Row
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: tokens.fonts.bold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(189, 194, 255, 0.7)',
    marginTop: 2,
  },
  closeCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  // Stacked Search Form Card
  formWrapper: {
    paddingHorizontal: 16,
  },
  stackedCard: {
    backgroundColor: '#121A38',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#040B2A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  originField: {
    backgroundColor: '#161E3C',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  originFieldPressed: {
    backgroundColor: '#212847',
  },
  originLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  originIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  originCopy: {
    flex: 1,
    minWidth: 0,
  },
  originTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  originTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  gpsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(63, 215, 196, 0.2)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 9999,
  },
  gpsTealDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#63F4E0',
  },
  gpsBadgeText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    color: '#63F4E0',
  },
  originSub: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(189, 194, 255, 0.6)',
    marginTop: 1,
  },
  connectorRow: {
    paddingLeft: 28,
    paddingVertical: 4,
  },
  connectorBar: {
    width: 2,
    height: 12,
    borderRadius: 1,
    backgroundColor: '#2C3352',
  },
  destinationField: {
    backgroundColor: '#212847',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  destinationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  destinationInput: {
    flex: 1,
    fontFamily: tokens.fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: '#DDE1FF',
    letterSpacing: 0.3,
    paddingVertical: 2,
  },
  destinationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  clearInputBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2C3352',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#2C3352',
  },
  mapIconBtn: {
    paddingLeft: 2,
    paddingVertical: 2,
  },
  // Filter Segment Tabs
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 16,
  },
  tabPill: {
    backgroundColor: '#161E3C',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 9999,
  },
  tabPillActive: {
    backgroundColor: '#FFB300',
    paddingHorizontal: 16,
  },
  tabText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: '#BDC2FF',
  },
  tabTextActive: {
    fontFamily: tokens.fonts.semiBold,
    fontWeight: '600',
    color: '#6B4900',
  },
  // List Header Note
  listSectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listSectionTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: 'rgba(189, 194, 255, 0.6)',
    letterSpacing: 0.8,
  },
  filterTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#FFBA38',
  },
  // Results Cards
  resultsColumn: {
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: '#161E3C',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  resultCardPressed: {
    backgroundColor: '#212847',
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  resultIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  resultCopy: {
    flex: 1,
    minWidth: 0,
  },
  resultTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  resultTitleHighlight: {
    fontFamily: tokens.fonts.bold,
    fontWeight: '700',
    color: '#FFBA38',
    textDecorationLine: 'underline',
  },
  resultMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  resultMetaText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(189, 194, 255, 0.7)',
    flexShrink: 1,
  },
  resultMetaDot: {
    fontSize: 12,
    color: 'rgba(189, 194, 255, 0.5)',
  },
  resultRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 8,
    flexShrink: 0,
  },
  distanceText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: 'rgba(189, 194, 255, 0.8)',
  },
  // Pinpoint Map Action Button
  mapActionWrap: {
    paddingTop: 8,
  },
  pinpointMapBtn: {
    width: '100%',
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#212847',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  pinpointMapText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  // Predictive Bar Above Native Keyboard
  predictiveBar: {
    backgroundColor: 'rgba(4, 11, 42, 0.96)',
    paddingTop: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  predictiveChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  predictiveChipPressed: {
    backgroundColor: '#212847',
  },
  predictiveText: {
    fontFamily: tokens.fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
    color: 'rgba(221, 225, 255, 0.9)',
  },
  predictiveTextBold: {
    fontFamily: tokens.fonts.semiBold,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  predictiveDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#2C3352',
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