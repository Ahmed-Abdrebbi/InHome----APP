// File: src/features/worker/screens/ActiveJobScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Phone, MessageSquare, CheckCircle, Navigation as NavIcon } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from '../../../core/config/statuses';
import { useJobStore } from '../../tracking/store/useJobStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import CustomMapView from '../../../shared/components/map/CustomMapView';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const ActiveJobScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, tokens } = useTheme();
  const { activeJob, status, loadJob, advanceStatus } = useJobStore();

  const jobId = route.params?.jobId || activeJob?.id;

  useEffect(() => {
    if (jobId) {
      loadJob(jobId);
    }
  }, [jobId, loadJob]);

  const handleNextStep = async () => {
    if (status === BOOKING_STATUSES.MATCHED || status === BOOKING_STATUSES.PENDING) {
      await advanceStatus(BOOKING_STATUSES.EN_ROUTE);
    } else if (status === BOOKING_STATUSES.EN_ROUTE) {
      await advanceStatus(BOOKING_STATUSES.ARRIVED);
    } else if (status === BOOKING_STATUSES.ARRIVED) {
      await advanceStatus(BOOKING_STATUSES.IN_PROGRESS);
    } else if (status === BOOKING_STATUSES.IN_PROGRESS) {
      await advanceStatus(BOOKING_STATUSES.COMPLETED);
      navigation.navigate(ROUTES.RATING, {
        bookingId: jobId,
        providerName: 'Client',
      });
    }
  };

  const getButtonTitle = () => {
    if (status === BOOKING_STATUSES.MATCHED || status === BOOKING_STATUSES.PENDING) {
      return 'Démarrer l’itinéraire (Je suis en route)';
    }
    if (status === BOOKING_STATUSES.EN_ROUTE) {
      return 'Je suis arrivé sur place';
    }
    if (status === BOOKING_STATUSES.ARRIVED) {
      return 'Commencer l’intervention';
    }
    if (status === BOOKING_STATUSES.IN_PROGRESS) {
      return 'Terminer le travail & encaisser';
    }
    return 'Prestation terminée';
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title="Mission en cours"
        subtitle={BOOKING_STATUS_LABELS[status] || status}
      />
      <View style={styles.mapContainer}>
        <CustomMapView style={StyleSheet.absoluteFillObject} />
      </View>

      <View
        style={[
          styles.bottomCard,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            padding: tokens.Spacing.lg,
          },
        ]}
      >
        <View style={styles.clientInfo}>
          <Text style={[styles.clientTitle, { color: theme.textSecondary }]}>Adresse d'intervention :</Text>
          <Text style={[styles.addressText, { color: theme.textPrimary }]}>
            {activeJob?.address || 'Maârif, Casablanca'}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => Linking.openURL('tel:+212612345678')}
            style={[styles.btn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
          >
            <Phone size={18} color={theme.textPrimary} />
            <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>Appeler le client</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.CHAT, { bookingId: jobId })}
            style={[styles.btn, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
          >
            <MessageSquare size={18} color={theme.textPrimary} />
            <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>Chat</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: tokens.Spacing.md }}>
          <PrimaryButton title={getButtonTitle()} onPress={handleNextStep} />
        </View>
      </View>
      {/* TODO(INH-worker): Bouton pour ouvrir l'itinéraire dans Google Maps / Waze directement */}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  bottomCard: {
    borderTopWidth: 1,
  },
  clientInfo: {
    marginBottom: 12,
  },
  clientTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  btn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default ActiveJobScreen;
