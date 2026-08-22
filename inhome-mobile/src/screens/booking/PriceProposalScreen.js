// File: src/screens/booking/PriceProposalScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Switch,
  Dimensions,
} from 'react-native';
import {
  X,
  CreditCard,
  ChevronRight,
  Wrench,
  Check,
} from 'lucide-react-native';
import Colors from '../../theme/colors';
import PrimaryButton from '../../components/UI/PrimaryButton';
import CustomKeypad from '../../components/UI/CustomKeypad';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Price proposal bottom-sheet screen matching the Stitch "Proposer votre prix" design.
 * Features:
 *  - Map background (dimmed)
 *  - Bottom sheet (80% height) with:
 *    - Drag handle, header + close button
 *    - Price input with MAD currency + blinking cursor
 *    - Payment method selector (Cash)
 *    - Service type pill toggles (Intervention / Devis)
 *    - Material toggle switch
 *    - Confirm button (disabled when no price)
 *  - Full numeric keypad at bottom
 */
const PriceProposalScreen = ({ navigation }) => {
  const [price, setPrice] = useState('');
  const [materialIncluded, setMaterialIncluded] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([
    'intervention',
    'devis',
  ]);
  const cursorAnim = useRef(new Animated.Value(1)).current;

  // Blinking cursor animation
  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    blink.start();
    return () => blink.stop();
  }, []);

  const handleKeyPress = (key) => {
    if (price.length < 7) {
      setPrice((prev) => prev + key);
    }
  };

  const handleDelete = () => {
    setPrice((prev) => prev.slice(0, -1));
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const isConfirmEnabled = price.length > 0 && parseInt(price, 10) > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Dimmed map background */}
      <View style={styles.mapBg}>
        <View style={styles.mapDim} />
      </View>

      {/* Bottom Sheet Modal (80% height) */}
      <View style={styles.sheet}>
        {/* Drag Handle */}
        <View style={styles.handleRow}>
          <View style={styles.handle} />
        </View>

        {/* Scrollable content area */}
        <View style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Proposer votre prix</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => navigation && navigation.goBack()}
              activeOpacity={0.7}
            >
              <X size={28} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Price Input */}
          <View style={styles.priceContainer}>
            <Text style={styles.currencyLabel}>MAD</Text>
            <View style={styles.priceInputRow}>
              <Text style={styles.priceValue}>
                {price || ''}
              </Text>
              <Animated.View
                style={[
                  styles.cursor,
                  { opacity: cursorAnim },
                ]}
              />
            </View>
          </View>

          {/* Payment Method */}
          <TouchableOpacity
            style={styles.paymentSelector}
            activeOpacity={0.7}
          >
            <View style={styles.paymentLeft}>
              <CreditCard size={22} color={Colors.onSurfaceVariant} />
              <Text style={styles.paymentText}>Cash</Text>
            </View>
            <ChevronRight size={22} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>

          {/* Service Type Toggles */}
          <View style={styles.pillRow}>
            <TouchableOpacity
              style={[
                styles.pill,
                selectedTypes.includes('intervention') && styles.pillSelected,
              ]}
              onPress={() => toggleType('intervention')}
              activeOpacity={0.7}
            >
              {selectedTypes.includes('intervention') && (
                <Check size={16} color={Colors.accent} />
              )}
              <Text style={styles.pillText}>Intervention à domicile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pill,
                selectedTypes.includes('devis') && styles.pillSelected,
              ]}
              onPress={() => toggleType('devis')}
              activeOpacity={0.7}
            >
              {selectedTypes.includes('devis') && (
                <Check size={16} color={Colors.accent} />
              )}
              <Text style={styles.pillText}>Devis à distance</Text>
            </TouchableOpacity>
          </View>

          {/* Material Toggle */}
          <View style={styles.materialRow}>
            <View style={styles.materialLeft}>
              <Wrench size={22} color={Colors.onSurfaceVariant} />
              <View style={styles.materialTextContainer}>
                <Text style={styles.materialTitle}>
                  Le prestataire apporte le matériel
                </Text>
                <Text style={styles.materialSubtitle}>
                  Matériel inclus dans le prix
                </Text>
              </View>
            </View>
            <Switch
              value={materialIncluded}
              onValueChange={setMaterialIncluded}
              trackColor={{
                false: Colors.surfaceVariant,
                true: Colors.accent,
              }}
              thumbColor={
                materialIncluded ? Colors.white : Colors.outline
              }
            />
          </View>

          {/* Confirm Button */}
          <PrimaryButton
            title="Confirmer"
            onPress={() => navigation && navigation.goBack()}
            disabled={!isConfirmEnabled}
            style={[
              styles.confirmBtn,
              !isConfirmEnabled && styles.confirmBtnDisabled,
            ]}
          />
        </View>

        {/* Numeric Keypad */}
        <CustomKeypad
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onGlobe={() => {}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.mapNavy,
  },
  mapDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${Colors.background}A0`,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.82,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 24,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceVariant,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: Colors.onSurface,
  },
  closeBtn: {
    padding: 8,
    marginRight: -8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceVariant,
    paddingBottom: 8,
  },
  currencyLabel: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    color: Colors.onSurfaceVariant,
    marginBottom: 4,
  },
  priceInputRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: Colors.onSurface,
  },
  cursor: {
    width: 2,
    height: 32,
    backgroundColor: Colors.accent,
    marginLeft: 2,
  },
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainer,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.onSurface,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.transparent,
  },
  pillSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 16,
    color: Colors.onSurface,
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  materialLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  materialTextContainer: {
    flex: 1,
    gap: 4,
  },
  materialTitle: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.onSurface,
  },
  materialSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 16,
    color: Colors.onSurfaceVariant,
  },
  confirmBtn: {
    borderRadius: 12,
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.surfaceContainerHigh,
    opacity: 0.5,
  },
});

export default PriceProposalScreen;
