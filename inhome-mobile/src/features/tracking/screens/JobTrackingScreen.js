// File: src/features/tracking/screens/JobTrackingScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Phone, MessageSquare, CheckCircle, Navigation } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';
import { ROUTES } from '../../../app/navigation/routes';
import { BOOKING_STATUSES, BOOKING_STATUS_LABELS } from '../../../core/config/statuses';
import { formatPrice } from '../../../core/utils/formatPrice';
import { useJobStore } from '../store/useJobStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import CustomMapView from '../../../shared/components/map/CustomMapView';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const JobTrackingScreen = () => {
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

  const handleCall = () => {
    const phone = activeJob?.assignedWorker?.phone || '+212661234567';
    Linking.openURL(`tel:${phone}`);
  };

  const handleChat = () => {
    navigation.navigate(ROUTES.CHAT, { bookingId: jobId });
  };

  const handleFinish = async () => {
    await advanceStatus(BOOKING_STATUSES.COMPLETED);
    navigation.navigate(ROUTES.RATING, {
      bookingId: jobId,
      providerId: activeJob?.assignedWorker?.id,
      providerName: activeJob?.assignedWorker?.fullName || 'Artisan',
    });
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title={t('tracking.title')}
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
        <View style={styles.workerRow}>
          <Image
            source={{
              uri:
                activeJob?.assignedWorker?.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            }}
            style={styles.avatar}
          />
          <View style={styles.workerDetails}>
            <Text style={[styles.workerName, { color: theme.textPrimary }]}>
              {activeJob?.assignedWorker?.fullName || 'Youssef El Amrani'}
            </Text>
            <Text style={[styles.jobTitle, { color: theme.textSecondary }]}>
              {activeJob?.address || 'Intervention à domicile'} • {formatPrice(activeJob?.finalPrice || activeJob?.proposedPrice || 120)}
            </Text>
          </View>
        </View>

        {/* Stepper visuel */}
        <View style={[styles.stepper, { borderColor: theme.borderSubtle, marginVertical: tokens.Spacing.md }]}>
          <Text style={[styles.statusText, { color: theme.accent }]}>
            ● {BOOKING_STATUS_LABELS[status] || status}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={handleCall}
            style={[
              styles.iconBtn,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            ]}
          >
            <Phone size={18} color={theme.textPrimary} />
            <Text style={[styles.btnLabel, { color: theme.textPrimary }]}>{t('tracking.call')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleChat}
            style={[
              styles.iconBtn,
              { backgroundColor: theme.surfaceElevated, borderColor: theme.border },
            ]}
          >
            <MessageSquare size={18} color={theme.textPrimary} />
            <Text style={[styles.btnLabel, { color: theme.textPrimary }]}>{t('tracking.chat')}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: tokens.Spacing.md }}>
          <PrimaryButton
            title="Terminer & Payer en espèces"
            onPress={handleFinish}
          />
        </View>
      </View>
      {/* TODO(INH-tracking): Animation du marqueur de déplacement de l'artisan en temps réel */}
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
  workerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  workerDetails: {
    flex: 1,
    marginLeft: 12,
  },
  workerName: {
    fontSize: 17,
    fontWeight: '700',
  },
  jobTitle: {
    fontSize: 13,
    marginTop: 2,
  },
  stepper: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: '700',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnLabel: {
    fontWeight: '600',
    fontSize: 14,
  },
});

export default JobTrackingScreen;
