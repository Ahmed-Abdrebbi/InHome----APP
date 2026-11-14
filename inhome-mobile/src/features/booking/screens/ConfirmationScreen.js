// File: src/features/booking/screens/ConfirmationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  Wrench,
  Timer,
  Camera,
  ArrowLeft,
  Check,
} from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { formatPrice } from '../../../core/utils/formatPrice';
import { useBookingStore } from '../store/useBookingStore';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';
import ProviderInfoCard from '../../../shared/components/cards/ProviderInfoCard';

const ConfirmationScreen = ({ navigation }) => {
  const { theme, tokens } = useTheme();
  const { draft, createBooking, loading, updateDraft } = useBookingStore();
  const [selectedTierIndex, setSelectedTierIndex] = useState(0);

  const basePrice = draft?.proposedPrice || 80;
  const address = draft?.address || 'Av. Marrakech, Casablanca';
  const category = draft?.category || 'Plomberie';

  const tiers = [
    {
      id: 'standard',
      icon: Wrench,
      title: 'Intervention Standard',
      subtitle: 'Artisan disponible sous 30-45 min',
      price: basePrice,
    },
    {
      id: 'urgent',
      icon: Timer,
      title: 'Intervention Express',
      subtitle: 'Prioritaire sous 15-20 min (+25%)',
      price: Math.round(basePrice * 1.25),
    },
    {
      id: 'devis',
      icon: Camera,
      title: 'Devis préalable',
      subtitle: 'Estimation gratuite avant travaux',
      price: Math.min(basePrice, 40),
    },
  ];

  const handleSelectTier = (index) => {
    setSelectedTierIndex(index);
    const tier = tiers[index];
    updateDraft({
      tier: tier.id,
      proposedPrice: tier.price,
    });
  };

  const handleConfirmBooking = async () => {
    try {
      const tier = tiers[selectedTierIndex];
      const booking = await createBooking({
        tier: tier.id,
        proposedPrice: tier.price,
      });

      if (booking?.id) {
        navigation.navigate(ROUTES.SEARCHING_RADAR, { bookingId: booking.id });
      }
    } catch (e) {
      // In case of error
      navigation.navigate(ROUTES.SEARCHING_RADAR);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Top Header with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
          onPress={() => navigation && navigation.goBack()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.topTitle, { color: theme.textPrimary }]}>Récapitulatif</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Floating Info Card */}
      <View style={styles.infoCardContainer}>
        <ProviderInfoCard
          address={address}
          addressLabel="Adresse d'intervention"
          jobTitle={`Demande : ${category}`}
          jobEstimate="Prix proposé par vous"
          onEditPress={() => navigation && navigation.navigate(ROUTES.PRICE_PROPOSAL)}
        />
      </View>

      {/* Bottom Sheet */}
      <View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: theme.surfaceElevated || '#1E212A',
            borderTopColor: theme.border,
          },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: theme.borderSubtle }]} />
        </View>

        <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>Options d'intervention</Text>

        {/* Tiers List */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tiersContainer}>
          {tiers.map((tier, index) => {
            const IconComp = tier.icon;
            const isSelected = selectedTierIndex === index;

            return (
              <TouchableOpacity
                key={tier.id}
                style={[
                  styles.tierCard,
                  {
                    backgroundColor: isSelected
                      ? (theme.accentMuted || 'rgba(235, 67, 28, 0.15)')
                      : theme.surface,
                    borderColor: isSelected ? theme.accent : theme.border,
                  },
                ]}
                onPress={() => handleSelectTier(index)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.tierIcon,
                    {
                      backgroundColor: isSelected ? theme.accent : theme.surfaceElevated,
                    },
                  ]}
                >
                  <IconComp size={20} color={isSelected ? '#FFFFFF' : theme.textSecondary} />
                </View>
                <View style={styles.tierContent}>
                  <Text
                    style={[
                      styles.tierTitle,
                      {
                        color: isSelected ? theme.accent : theme.textPrimary,
                        fontWeight: isSelected ? '700' : '600',
                      },
                    ]}
                  >
                    {tier.title}
                  </Text>
                  <Text style={[styles.tierSubtitle, { color: theme.textSecondary }]}>
                    {tier.subtitle}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.tierPrice,
                    {
                      color: isSelected ? theme.accent : theme.textPrimary,
                    },
                  ]}
                >
                  {formatPrice(tier.price)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footerActions}>
          <PrimaryButton
            title={loading ? 'Publication de la demande...' : `Trouver un artisan (${formatPrice(tiers[selectedTierIndex].price)})`}
            onPress={handleConfirmBooking}
            disabled={loading}
            style={styles.findBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  infoCardContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingBottom: 34,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  tiersContainer: {
    gap: 10,
    paddingBottom: 16,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 12,
  },
  tierIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierContent: {
    flex: 1,
    gap: 2,
  },
  tierTitle: {
    fontSize: 14,
  },
  tierSubtitle: {
    fontSize: 12,
  },
  tierPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  footerActions: {
    paddingTop: 6,
  },
  findBtn: {
    borderRadius: 12,
  },
});

export default ConfirmationScreen;
