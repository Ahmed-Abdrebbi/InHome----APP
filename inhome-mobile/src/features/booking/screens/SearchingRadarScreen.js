// File: src/features/booking/screens/SearchingRadarScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { X, Sparkles, Plus, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { formatPrice } from '../../../core/utils/formatPrice';
import { useBookingStore } from '../store/useBookingStore';
import { useOffersStore } from '../store/useOffersStore';
import RadarAnimation from '../../../shared/components/map/RadarAnimation';
import ProviderMarker from '../../../shared/components/map/ProviderMarker';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

const { width } = Dimensions.get('window');

const SearchingRadarScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { activeBookingId, cancelActiveBooking, updatePrice, draft } = useBookingStore();
  const { offers, fetchOffers, reset: resetOffers } = useOffersStore();

  const bookingId = route.params?.bookingId || activeBookingId;
  const progressAnim = useRef(new Animated.Value(0.2)).current;
  const [currentPrice, setCurrentPrice] = useState(draft?.proposedPrice || 80);

  // Radar pulsing progress animation
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 0.9,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0.2,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    anim.start();

    return () => anim.stop();
  }, [progressAnim]);

  // Polling for incoming offers every 3.5 seconds
  useEffect(() => {
    if (!bookingId) return;

    fetchOffers(bookingId);
    const interval = setInterval(() => {
      fetchOffers(bookingId);
    }, 3500);

    return () => clearInterval(interval);
  }, [bookingId, fetchOffers]);

  const handleCancel = async () => {
    if (bookingId) {
      await cancelActiveBooking(bookingId);
    }
    resetOffers();
    navigation.navigate(ROUTES.MAP_HOME);
  };

  const handleIncreasePrice = async () => {
    const newPrice = currentPrice + 20;
    setCurrentPrice(newPrice);
    if (bookingId) {
      await updatePrice(bookingId, newPrice);
    }
  };

  const handleViewOffers = () => {
    navigation.navigate(ROUTES.OFFERS_LIST);
  };

  const hasOffers = offers && offers.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background Grid */}
      <View style={[styles.mapBg, { backgroundColor: theme.surface }]}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 25 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={[styles.gridLineH, { top: i * 36, backgroundColor: theme.borderSubtle }]}
            />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[styles.gridLineV, { left: i * 30, backgroundColor: theme.borderSubtle }]}
            />
          ))}
        </View>
      </View>

      {/* Floating Close Button */}
      <TouchableOpacity
        style={[
          styles.closeButton,
          {
            backgroundColor: theme.surfaceElevated || '#212121',
            borderColor: theme.border,
          },
        ]}
        onPress={handleCancel}
        activeOpacity={0.8}
      >
        <X size={22} color={theme.textPrimary} />
      </TouchableOpacity>

      {/* Radar + Center Pin */}
      <View style={styles.radarContainer}>
        <RadarAnimation size={260} color={theme.accent} />
        <View style={styles.centerPinContainer}>
          <ProviderMarker isActive showPin size={34} />
        </View>
      </View>

      {/* Scattered Provider Markers */}
      <View style={[styles.scatteredMarker, { top: '22%', left: '26%' }]}>
        <ProviderMarker size={28} />
      </View>
      <View style={[styles.scatteredMarker, { top: '65%', left: '18%' }]}>
        <ProviderMarker size={28} />
      </View>
      <View style={[styles.scatteredMarker, { top: '38%', right: '22%' }]}>
        <ProviderMarker size={28} />
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

        <View style={styles.sheetContent}>
          {/* Status Text */}
          <Text style={[styles.searchingTitle, { color: theme.textPrimary }]}>
            {hasOffers
              ? `${offers.length} proposition(s) d'artisan reçue(s) !`
              : "Recherche d'un artisan à proximité..."}
          </Text>

          <Text style={[styles.priceNotice, { color: theme.textSecondary }]}>
            Prix proposé : <Text style={{ color: theme.accent, fontWeight: '700' }}>{formatPrice(currentPrice)}</Text>
          </Text>

          {/* Animated Progress Bar */}
          <View style={[styles.progressTrack, { backgroundColor: theme.surface }]}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: theme.accent,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          {/* Action Row: inDrive-style boost price + view offers */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.boostBtn,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={handleIncreasePrice}
              activeOpacity={0.8}
            >
              <Plus size={16} color={theme.accent} />
              <Text style={[styles.boostText, { color: theme.textPrimary }]}>+20 DH</Text>
            </TouchableOpacity>

            {hasOffers && (
              <View style={{ flex: 1 }}>
                <PrimaryButton
                  title={`Voir les offres (${offers.length})`}
                  onPress={handleViewOffers}
                  style={styles.viewOffersBtn}
                />
              </View>
            )}
          </View>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
              ANNULER LA RECHERCHE
            </Text>
          </TouchableOpacity>
        </View>
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
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 10,
    elevation: 4,
  },
  radarContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerPinContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scatteredMarker: {
    position: 'absolute',
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
  sheetContent: {
    alignItems: 'center',
    paddingTop: 8,
  },
  searchingTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  priceNotice: {
    fontSize: 13,
    marginBottom: 16,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  actionRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    alignItems: 'center',
    marginBottom: 14,
  },
  boostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  boostText: {
    fontSize: 14,
    fontWeight: '700',
  },
  viewOffersBtn: {
    borderRadius: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default SearchingRadarScreen;
