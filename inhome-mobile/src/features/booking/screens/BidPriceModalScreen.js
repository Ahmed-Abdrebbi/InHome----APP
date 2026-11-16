import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Polygon } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { majorelleTheme } from '../../../core/theme/themes/majorelle';
import { tokens } from '../../../core/theme/tokens';

const QUICK_PRICES = [
  { value: '60', label: '60 DH', tag: '(Min)', tagType: 'muted' },
  { value: '80', label: '80 DH', tag: '★ Suggéré', tagType: 'primary' },
  { value: '120', label: '120 DH', tag: 'Express', tagType: 'tertiary' },
];

const KEYPAD_ROWS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['C', '0', 'BACKSPACE'],
];

export default function BidPriceModalScreen({ navigation, route }) {
  const { colors } = majorelleTheme;
  const insets = useSafeAreaInsets();

  const initialPrice = route?.params?.price
    ? String(route.params.price)
    : '80';

  const [priceStr, setPriceStr] = useState(initialPrice);
  const [serviceMode, setServiceMode] = useState(
    route?.params?.serviceMode || 'domicile'
  ); // 'domicile' | 'video'
  const [includeMaterials, setIncludeMaterials] = useState(
    Boolean(route?.params?.includeMaterials)
  );

  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const switchTranslateX = useRef(
    new Animated.Value(route?.params?.includeMaterials ? 24 : 0)
  ).current;

  useEffect(() => {
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0.15,
          duration: 550,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }),
      ])
    );

    blinkLoop.start();
    return () => blinkLoop.stop();
  }, [cursorOpacity]);

  const handleToggleMaterials = () => {
    const nextValue = !includeMaterials;
    setIncludeMaterials(nextValue);
    Animated.spring(switchTranslateX, {
      toValue: nextValue ? 24 : 0,
      useNativeDriver: true,
      damping: 18,
      stiffness: 220,
    }).start();
  };

  const handleKeyPress = (key) => {
    if (key === 'C') {
      setPriceStr('0');
      return;
    }

    if (key === 'BACKSPACE') {
      setPriceStr((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }

    setPriceStr((prev) => {
      if (prev.length >= 4) return prev;
      if (prev === '0') return key;
      return prev + key;
    });
  };

  const numericPrice = Number(priceStr) || 0;
  const isValidPrice = numericPrice > 0;

  const handleClose = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation?.navigate?.('RequestDetails');
    }
  };

  const handleConfirmProposal = () => {
    if (!isValidPrice) return;

    const payload = {
      price: numericPrice,
      serviceMode,
      includeMaterials,
    };

    if (route?.params?.onConfirmPrice) {
      route.params.onConfirmPrice(payload);
      if (navigation?.canGoBack?.()) {
        navigation.goBack();
      }
      return;
    }

    if (navigation?.navigate) {
      navigation.navigate('SearchingArtisan', payload);
    } else {
      handleClose();
    }
  };

  return (
    <View style={styles.modalBackdrop}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 12) },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Dimmed Top Dismiss Zone with Subtle Zellige Star Watermark */}
        <Pressable
          onPress={handleClose}
          style={styles.dismissBackdropArea}
          accessibilityLabel="Fermer la fenêtre de proposition"
        >
          <View style={styles.zelligeStarWrap} pointerEvents="none">
            <Svg width={124} height={124} viewBox="0 0 100 100">
              <Polygon
                points="50,0 62,38 100,50 62,62 50,100 38,62 0,50 38,38"
                fill="#FFDEAC"
              />
              <Polygon
                points="50,15 59,41 85,50 59,59 50,85 41,59 15,50 41,41"
                fill="#FFDEAC"
                opacity="0.5"
              />
            </Svg>
          </View>
        </Pressable>

        {/* Bottom Sheet Modal Container */}
        <View
          style={[
            styles.modalSheet,
            {
              backgroundColor: colors.surfaceContainerLow,
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}
        >
          {/* Centered Drag Handle */}
          <View style={styles.dragHandleRow}>
            <View style={styles.dragHandle} />
          </View>

          {/* Header Section */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <View style={styles.titleBadgeRow}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  Proposer votre prix
                </Text>
                <View style={styles.inHomeBidBadge}>
                  <Text style={styles.inHomeBidText}>InHome Bid</Text>
                </View>
              </View>

              <View style={styles.subtitleRow}>
                <MaterialIcons name="verified" size={13} color="#63F4E0" />
                <Text style={styles.subtitleText} numberOfLines={1}>
                  Tarif libre sans frais cachés • Plomberie Casablanca
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.closeCircleBtn,
                pressed && styles.pressedScale95,
              ]}
              accessibilityLabel="Fermer"
            >
              <MaterialIcons name="close" size={18} color="#D6C4AC" />
            </Pressable>
          </View>

          {/* Hero Price Input Field Section */}
          <View style={styles.priceHeroBlock}>
            <View style={styles.priceReadoutRow}>
              <Text style={styles.currencyPrefix}>MAD</Text>
              <View style={styles.amountCursorWrap}>
                <Text style={styles.amountBigText}>{priceStr}</Text>
                <Animated.View
                  style={[
                    styles.blinkingCursor,
                    { opacity: cursorOpacity },
                  ]}
                />
              </View>
            </View>

            {/* Glowing Saffron Accent Underline */}
            <View style={styles.saffronUnderline} />

            {/* Quick Suggested Price Chips */}
            <View style={styles.quickChipsRow}>
              {QUICK_PRICES.map((chip) => {
                const isSelected = priceStr === chip.value;
                return (
                  <Pressable
                    key={chip.value}
                    onPress={() => setPriceStr(chip.value)}
                    style={({ pressed }) => [
                      styles.quickChip,
                      isSelected && styles.quickChipSelected,
                      pressed && styles.pressedScale95,
                    ]}
                  >
                    <Text
                      style={[
                        styles.quickChipLabel,
                        isSelected && styles.quickChipLabelSelected,
                      ]}
                    >
                      {chip.label}{' '}
                      <Text
                        style={[
                          styles.quickChipTag,
                          chip.tagType === 'primary' &&
                            styles.quickChipTagPrimary,
                          chip.tagType === 'tertiary' &&
                            styles.quickChipTagTertiary,
                        ]}
                      >
                        {chip.tag}
                      </Text>
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Service Type Badges (Two Pill Toggles) */}
          <View style={styles.serviceModeGrid}>
            {/* À domicile */}
            <Pressable
              onPress={() => setServiceMode('domicile')}
              style={({ pressed }) => [
                styles.modeCard,
                serviceMode === 'domicile'
                  ? styles.modeCardActive
                  : styles.modeCardInactive,
                pressed && styles.pressedScale98,
              ]}
            >
              <View style={styles.modeCardLeft}>
                <View
                  style={[
                    styles.modeIconBox,
                    serviceMode === 'domicile'
                      ? styles.modeIconBoxActive
                      : styles.modeIconBoxInactive,
                  ]}
                >
                  <MaterialIcons
                    name="home-repair-service"
                    size={18}
                    color={serviceMode === 'domicile' ? '#FFD79B' : '#D6C4AC'}
                  />
                </View>

                <View style={styles.modeTexts}>
                  <Text
                    style={[
                      styles.modeTitle,
                      serviceMode !== 'domicile' && styles.modeTitleMuted,
                    ]}
                    numberOfLines={1}
                  >
                    À domicile
                  </Text>
                  <Text
                    style={[
                      styles.modeSub,
                      serviceMode === 'domicile'
                        ? styles.modeSubActive
                        : styles.modeSubMuted,
                    ]}
                    numberOfLines={1}
                  >
                    Artisan sur place
                  </Text>
                </View>
              </View>

              {serviceMode === 'domicile' ? (
                <View style={styles.modeCheckCircle}>
                  <MaterialIcons name="check" size={12} color="#281900" />
                </View>
              ) : (
                <View style={styles.modeUncheckedCircle} />
              )}
            </Pressable>

            {/* Devis vidéo */}
            <Pressable
              onPress={() => setServiceMode('video')}
              style={({ pressed }) => [
                styles.modeCard,
                serviceMode === 'video'
                  ? styles.modeCardActive
                  : styles.modeCardInactive,
                pressed && styles.pressedScale98,
              ]}
            >
              <View style={styles.modeCardLeft}>
                <View
                  style={[
                    styles.modeIconBox,
                    serviceMode === 'video'
                      ? styles.modeIconBoxActive
                      : styles.modeIconBoxInactive,
                  ]}
                >
                  <MaterialIcons
                    name="videocam"
                    size={18}
                    color={serviceMode === 'video' ? '#FFD79B' : '#D6C4AC'}
                  />
                </View>

                <View style={styles.modeTexts}>
                  <Text
                    style={[
                      styles.modeTitle,
                      serviceMode !== 'video' && styles.modeTitleMuted,
                    ]}
                    numberOfLines={1}
                  >
                    Devis vidéo
                  </Text>
                  <Text
                    style={[
                      styles.modeSub,
                      serviceMode === 'video'
                        ? styles.modeSubActive
                        : styles.modeSubMuted,
                    ]}
                    numberOfLines={1}
                  >
                    Visio rapide
                  </Text>
                </View>
              </View>

              {serviceMode === 'video' ? (
                <View style={styles.modeCheckCircle}>
                  <MaterialIcons name="check" size={12} color="#281900" />
                </View>
              ) : (
                <View style={styles.modeUncheckedCircle} />
              )}
            </Pressable>
          </View>

          {/* Payment Method Row */}
          <View style={styles.optionRowCard}>
            <View style={styles.optionRowLeft}>
              <View style={styles.cashIconBox}>
                <MaterialIcons name="payments" size={20} color="#63F4E0" />
              </View>

              <View style={styles.optionTexts}>
                <View style={styles.cashTitleRow}>
                  <Text style={styles.cashTitle}>Espèces (Cash)</Text>
                  <View style={styles.zeroFeeBadge}>
                    <Text style={styles.zeroFeeText}>0% frais</Text>
                  </View>
                </View>
                <Text style={styles.optionSubtitle} numberOfLines={1}>
                  Paiement direct à la fin de l'intervention
                </Text>
              </View>
            </View>

            <View style={styles.chevronCircle}>
              <MaterialIcons name="chevron-right" size={18} color="#9E8E78" />
            </View>
          </View>

          {/* Material Inclusion Toggle Row */}
          <Pressable
            onPress={handleToggleMaterials}
            style={[styles.optionRowCard, styles.materialRowSpacing]}
          >
            <View style={styles.optionRowLeftPr}>
              <View style={styles.materialIconBox}>
                <MaterialIcons name="handyman" size={20} color="#D6C4AC" />
              </View>

              <View style={styles.optionTexts}>
                <Text style={styles.materialTitle} numberOfLines={1}>
                  Prestataire apporte le matériel
                </Text>
                <Text style={styles.optionSubtitle} numberOfLines={1}>
                  Joints, colle PVC, tuyauterie inclus
                </Text>
              </View>
            </View>

            {/* iOS-Style Animated Toggle Switch */}
            <View
              style={[
                styles.iosSwitchTrack,
                includeMaterials && styles.iosSwitchTrackActive,
              ]}
            >
              <Animated.View
                style={[
                  styles.iosSwitchThumb,
                  { transform: [{ translateX: switchTranslateX }] },
                ]}
              />
            </View>
          </Pressable>

          {/* Primary Confirmation CTA Button */}
          <Pressable
            onPress={handleConfirmProposal}
            disabled={!isValidPrice}
            style={({ pressed }) => [
              styles.confirmCtaBtn,
              !isValidPrice && styles.confirmCtaDisabled,
              pressed && isValidPrice && styles.pressedScale98,
            ]}
          >
            <Text style={styles.confirmCtaText}>
              Confirmer la proposition
            </Text>
            <View style={styles.ctaPricePill}>
              <Text style={styles.ctaPricePillText}>{priceStr} DH</Text>
            </View>
          </Pressable>

          {/* Dark Numeric Native Mobile Keypad */}
          <View style={styles.keypadWrapper}>
            {KEYPAD_ROWS.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.keypadRow}>
                {row.map((keyItem) => {
                  const isSpecial =
                    keyItem === 'C' || keyItem === 'BACKSPACE';
                  return (
                    <Pressable
                      key={keyItem}
                      onPress={() => handleKeyPress(keyItem)}
                      style={({ pressed }) => [
                        styles.keyTile,
                        isSpecial && styles.keyTileSpecial,
                        pressed && styles.keyTilePressed,
                      ]}
                      accessibilityLabel={
                        keyItem === 'BACKSPACE'
                          ? 'Effacer un chiffre'
                          : keyItem === 'C'
                          ? 'Réinitialiser le prix'
                          : keyItem
                      }
                    >
                      {keyItem === 'BACKSPACE' ? (
                        <MaterialIcons
                          name="backspace"
                          size={20}
                          color="#DDE1FF"
                        />
                      ) : (
                        <Text
                          style={[
                            styles.keyLabel,
                            keyItem === 'C' && styles.keyLabelClear,
                          ]}
                        >
                          {keyItem}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 11, 42, 0.82)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  dismissBackdropArea: {
    flex: 1,
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zelligeStarWrap: {
    opacity: 0.12,
  },
  // Bottom Sheet Modal Container
  modalSheet: {
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.65,
    shadowRadius: 22,
    elevation: 20,
  },
  dragHandleRow: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 2,
    paddingBottom: 12,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2C3352',
  },
  // Header Section
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
    minWidth: 0,
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontFamily: tokens.fonts.bold,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    color: '#DDE1FF',
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  inHomeBidBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 215, 155, 0.12)',
    flexShrink: 0,
  },
  inHomeBidText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600',
    color: '#FFD79B',
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  subtitleText: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
    flex: 1,
  },
  closeCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  // Hero Price Input Block
  priceHeroBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    paddingHorizontal: 8,
  },
  priceReadoutRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 6,
  },
  currencyPrefix: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: '#D6C4AC',
    letterSpacing: 0.6,
  },
  amountCursorWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountBigText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 46,
    lineHeight: 52,
    fontWeight: '800',
    color: '#DDE1FF',
    letterSpacing: -0.8,
  },
  blinkingCursor: {
    width: 3.5,
    height: 36,
    borderRadius: 2,
    backgroundColor: '#FFB300',
    marginLeft: 4,
  },
  saffronUnderline: {
    width: 192,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFB300',
    marginBottom: 12,
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.75,
    shadowRadius: 8,
    elevation: 6,
  },
  quickChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    backgroundColor: '#161E3C',
  },
  quickChipSelected: {
    backgroundColor: 'rgba(255, 215, 155, 0.16)',
    paddingHorizontal: 14,
  },
  quickChipLabel: {
    fontFamily: tokens.fonts.medium,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: '#DDE1FF',
  },
  quickChipLabelSelected: {
    fontFamily: tokens.fonts.semiBold,
    fontWeight: '600',
    color: '#FFD79B',
  },
  quickChipTag: {
    fontSize: 10,
    color: '#D6C4AC',
  },
  quickChipTagPrimary: {
    fontWeight: '700',
    color: '#FFD79B',
  },
  quickChipTagTertiary: {
    fontWeight: '600',
    color: '#63F4E0',
  },
  // Service Type Badges (2 Columns)
  serviceModeGrid: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  modeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    minWidth: 0,
  },
  modeCardActive: {
    backgroundColor: '#161E3C',
  },
  modeCardInactive: {
    backgroundColor: 'rgba(4, 11, 42, 0.6)',
  },
  modeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  modeIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  modeIconBoxActive: {
    backgroundColor: 'rgba(255, 215, 155, 0.15)',
  },
  modeIconBoxInactive: {
    backgroundColor: '#212847',
  },
  modeTexts: {
    flex: 1,
    minWidth: 0,
  },
  modeTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  modeTitleMuted: {
    fontFamily: tokens.fonts.medium,
    fontWeight: '500',
    color: '#D6C4AC',
  },
  modeSub: {
    fontFamily: tokens.fonts.regular,
    fontSize: 11,
    lineHeight: 14,
    marginTop: 1,
  },
  modeSubActive: {
    color: '#FFD79B',
  },
  modeSubMuted: {
    color: '#9E8E78',
  },
  modeCheckCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFB300',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    flexShrink: 0,
  },
  modeUncheckedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#161E3C',
    marginLeft: 4,
    flexShrink: 0,
  },
  // Payment Method & Material Rows
  optionRowCard: {
    backgroundColor: '#161E3C',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  materialRowSpacing: {
    marginBottom: 16,
  },
  optionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  optionRowLeftPr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  cashIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(63, 215, 196, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  materialIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#212847',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionTexts: {
    flex: 1,
    minWidth: 0,
  },
  cashTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cashTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  zeroFeeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    backgroundColor: 'rgba(99, 244, 224, 0.12)',
  },
  zeroFeeText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    color: '#63F4E0',
  },
  materialTitle: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  optionSubtitle: {
    fontFamily: tokens.fonts.regular,
    fontSize: 12,
    lineHeight: 16,
    color: '#D6C4AC',
    marginTop: 1,
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  // iOS Style Toggle Switch
  iosSwitchTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2C3352',
    padding: 2,
    justifyContent: 'center',
    flexShrink: 0,
  },
  iosSwitchTrackActive: {
    backgroundColor: '#1023D7',
  },
  iosSwitchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DDE1FF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  // Primary Confirmation CTA Button
  confirmCtaBtn: {
    width: '100%',
    height: 56,
    borderRadius: 9999,
    backgroundColor: '#FFB300',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
    shadowColor: '#FFB300',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  confirmCtaDisabled: {
    opacity: 0.65,
  },
  confirmCtaText: {
    fontFamily: tokens.fonts.bold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    color: '#281900',
  },
  ctaPricePill: {
    paddingHorizontal: 9,
    paddingVertical: 2.5,
    borderRadius: 9999,
    backgroundColor: 'rgba(40, 25, 0, 0.15)',
  },
  ctaPricePillText: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#281900',
  },
  // Dark Numeric Native Mobile Keypad
  keypadWrapper: {
    width: '100%',
    paddingTop: 6,
    gap: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  keyTile: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#161E3C',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  keyTileSpecial: {
    backgroundColor: 'rgba(22, 30, 60, 0.6)',
  },
  keyTilePressed: {
    backgroundColor: '#212847',
  },
  keyLabel: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    color: '#DDE1FF',
  },
  keyLabelClear: {
    fontFamily: tokens.fonts.semiBold,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: '#D6C4AC',
  },
  pressedScale98: {
    transform: [{ scale: 0.98 }],
  },
  pressedScale95: {
    transform: [{ scale: 0.95 }],
  },
});