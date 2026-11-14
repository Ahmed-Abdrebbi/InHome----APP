// File: src/features/booking/screens/OffersListScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Star, Clock, MapPin, Check } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';
import { ROUTES } from '../../../app/navigation/routes';
import { formatPrice } from '../../../core/utils/formatPrice';
import { formatDistance } from '../../../core/utils/distance';
import { useBookingStore } from '../store/useBookingStore';
import { useOffersStore } from '../store/useOffersStore';
import { useJobStore } from '../../tracking/store/useJobStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import Loader from '../../../shared/components/feedback/Loader';
import EmptyState from '../../../shared/components/feedback/EmptyState';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const OffersListScreen = () => {
  const navigation = useNavigation();
  const { theme, tokens } = useTheme();
  const { activeBookingId } = useBookingStore();
  const { offers, fetchOffers, acceptOffer, loading } = useOffersStore();
  const { loadJob } = useJobStore();

  useEffect(() => {
    if (activeBookingId) {
      fetchOffers(activeBookingId);
    }
  }, [activeBookingId, fetchOffers]);

  const handleAccept = async (offerId) => {
    try {
      const result = await acceptOffer(offerId);
      if (result?.booking) {
        await loadJob(result.booking.id);
        navigation.navigate(ROUTES.JOB_TRACKING, { jobId: result.booking.id });
      }
    } catch (e) {
      // Géré
    }
  };

  const renderOfferItem = ({ item }) => (
    <View
      style={[
        styles.offerCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: tokens.Radius.lg,
          padding: tokens.Spacing.lg,
          marginBottom: tokens.Spacing.md,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.providerAvatar }} style={styles.avatar} />
        <View style={styles.providerInfo}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{item.providerName}</Text>
          <View style={styles.ratingRow}>
            <Star size={14} color="#FFB300" fill="#FFB300" />
            <Text style={[styles.rating, { color: theme.textPrimary }]}>{item.providerRating}</Text>
            <Text style={[styles.reviews, { color: theme.textSecondary }]}>
              ({item.providerReviewsCount} avis)
            </Text>
          </View>
        </View>
        <View style={styles.priceBadge}>
          <Text style={[styles.priceText, { color: theme.accent }]}>{formatPrice(item.price)}</Text>
        </View>
      </View>

      <View style={[styles.metaRow, { marginTop: tokens.Spacing.md, borderColor: theme.borderSubtle }]}>
        <View style={styles.metaItem}>
          <Clock size={14} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            Arrivée ~{item.etaMinutes} min
          </Text>
        </View>
        <View style={styles.metaItem}>
          <MapPin size={14} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            À {formatDistance(item.providerDistanceKm)}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: tokens.Spacing.md }}>
        <PrimaryButton
          title={t('booking.offers.accept')}
          onPress={() => handleAccept(item.id)}
        />
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('booking.offers.title')} />
      {loading ? (
        <Loader message="Actualisation des offres..." />
      ) : offers.length === 0 ? (
        <EmptyState
          message={t('booking.offers.empty')}
          subtitle="Les artisans de votre secteur sont en train d'examiner votre demande."
        />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id}
          renderItem={renderOfferItem}
          contentContainerStyle={{ padding: tokens.Spacing.lg }}
        />
      )}
      {/* TODO(INH-booking): WebSocket / Pusher pour l'apparition en temps réel avec son de notification */}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  offerCard: {
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  providerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  rating: {
    fontWeight: '600',
    fontSize: 13,
  },
  reviews: {
    fontSize: 12,
  },
  priceBadge: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
  },
});

export default OffersListScreen;
