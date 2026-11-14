// File: src/features/booking/screens/PriceProposalScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Switch,
  Alert,
} from 'react-native';
import {
  X,
  CreditCard,
  ChevronRight,
  Wrench,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { useBookingStore } from '../store/useBookingStore';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';
import CustomKeypad from '../../../shared/components/ui/CustomKeypad';

const PriceProposalScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { draft, setProposedPrice, updateDraft } = useBookingStore();

  const [price, setPrice] = useState(draft?.proposedPrice ? String(draft.proposedPrice) : '80');
  const [materialIncluded, setMaterialIncluded] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(['intervention']);
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
    if (price.length < 5) {
      setPrice((prev) => (prev === '0' ? key : prev + key));
    }
  };

  const handleDelete = () => {
    setPrice((prev) => (prev.length > 0 ? prev.slice(0, -1) : ''));
  };

  const toggleType = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const numPrice = parseInt(price || '0', 10);
  const isConfirmEnabled = numPrice >= 20;

  const handleConfirm = () => {
    if (numPrice < 20) {
      Alert.alert('Prix minimum', 'Le prix minimum pour une intervention est de 20 DH.');
      return;
    }

    setProposedPrice(numPrice);
    updateDraft({
      tier: selectedTypes.includes('devis') ? 'devis' : 'standard',
      materialIncluded,
    });

    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Dimmed background */}
      <View style={styles.mapBg}>
        <View style={styles.mapDim} />
      </View>

      {/* Bottom Sheet Modal */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.surfaceElevated || '#1E212A',
            borderTopColor: theme.border,
          },
        ]}
      >
        {/* Drag Handle */}
        <View style={styles.handleRow}>
          <View style={[styles.handle, { backgroundColor: theme.borderSubtle }]} />
        </View>

        {/* Scrollable content area */}
        <View style={styles.sheetContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
              Proposer votre prix
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => navigation && navigation.goBack()}
              activeOpacity={0.7}
            >
              <X size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Price Input Display */}
          <View style={[styles.priceContainer, { backgroundColor: theme.surface }]}>
            <Text style={[styles.currencyLabel, { color: theme.textSecondary }]}>MAD</Text>
            <View style={styles.priceInputRow}>
              <Text style={[styles.priceValue, { color: theme.textPrimary }]}>
                {price || '0'}
              </Text>
              <Animated.View
                style={[
                  styles.cursor,
                  {
                    backgroundColor: theme.accent,
                    opacity: cursorAnim,
                  },
                ]}
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={[styles.paymentSelector, { borderBottomColor: theme.borderSubtle }]}>
            <View style={styles.paymentLeft}>
              <CreditCard size={20} color={theme.textSecondary} />
              <Text style={[styles.paymentText, { color: theme.textPrimary }]}>
                Espèces (Cash à l'artisan)
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textSecondary} />
          </View>

          {/* Service Type Toggles */}
          <View style={styles.pillRow}>
            <TouchableOpacity
              style={[
                styles.pill,
                {
                  backgroundColor: selectedTypes.includes('intervention')
                    ? (theme.accentMuted || 'rgba(235, 67, 28, 0.15)')
                    : theme.surface,
                  borderColor: selectedTypes.includes('intervention')
                    ? theme.accent
                    : theme.border,
                },
              ]}
              onPress={() => toggleType('intervention')}
              activeOpacity={0.7}
            >
              {selectedTypes.includes('intervention') && (
                <Check size={16} color={theme.accent} />
              )}
              <Text
                style={[
                  styles.pillText,
                  {
                    color: selectedTypes.includes('intervention')
                      ? theme.accent
                      : theme.textSecondary,
                  },
                ]}
              >
                Intervention à domicile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.pill,
                {
                  backgroundColor: selectedTypes.includes('devis')
                    ? (theme.accentMuted || 'rgba(235, 67, 28, 0.15)')
                    : theme.surface,
                  borderColor: selectedTypes.includes('devis')
                    ? theme.accent
                    : theme.border,
                },
              ]}
              onPress={() => toggleType('devis')}
              activeOpacity={0.7}
            >
              {selectedTypes.includes('devis') && (
                <Check size={16} color={theme.accent} />
              )}
              <Text
                style={[
                  styles.pillText,
                  {
                    color: selectedTypes.includes('devis')
                      ? theme.accent
                      : theme.textSecondary,
                  },
                ]}
              >
                Devis préalable
              </Text>
            </TouchableOpacity>
          </View>

          {/* Material Toggle */}
          <View style={[styles.materialRow, { borderBottomColor: theme.borderSubtle }]}>
            <View style={styles.materialLeft}>
              <Wrench size={20} color={theme.textSecondary} />
              <View style={styles.materialTextContainer}>
                <Text style={[styles.materialTitle, { color: theme.textPrimary }]}>
                  L'artisan apporte le matériel
                </Text>
                <Text style={[styles.materialSubtitle, { color: theme.textSecondary }]}>
                  Matériel et pièces inclus
                </Text>
              </View>
            </View>
            <Switch
              value={materialIncluded}
              onValueChange={setMaterialIncluded}
              trackColor={{
                false: theme.surfaceElevated || '#333333',
                true: theme.accent,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Confirm Button */}
          <PrimaryButton
            title={`Confirmer (${price || 0} DH)`}
            onPress={handleConfirm}
            disabled={!isConfirmEnabled}
            style={styles.confirmBtn}
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
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
  },
  mapDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingBottom: 24,
  },
  handleRow: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    gap: 8,
  },
  currencyLabel: {
    fontSize: 20,
    fontWeight: '700',
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
  },
  cursor: {
    width: 3,
    height: 36,
    marginLeft: 4,
    borderRadius: 2,
  },
  paymentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentText: {
    fontSize: 14,
    fontWeight: '500',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 14,
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    marginBottom: 16,
  },
  materialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  materialTextContainer: {
    gap: 2,
    flex: 1,
  },
  materialTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  materialSubtitle: {
    fontSize: 11,
  },
  confirmBtn: {
    borderRadius: 12,
  },
});

export default PriceProposalScreen;
