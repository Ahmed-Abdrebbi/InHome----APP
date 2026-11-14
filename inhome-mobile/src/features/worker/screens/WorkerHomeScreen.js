// File: src/features/worker/screens/WorkerHomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Clock, DollarSign, Filter } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';
import { ROUTES } from '../../../app/navigation/routes';
import { formatPrice } from '../../../core/utils/formatPrice';
import { useWorkerStore } from '../store/useWorkerStore';
import { useSettingsStore } from '../../account/store/useSettingsStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import Loader from '../../../shared/components/feedback/Loader';
import EmptyState from '../../../shared/components/feedback/EmptyState';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const WorkerHomeScreen = () => {
  const navigation = useNavigation();
  const { theme, tokens } = useTheme();
  const { isOnline, toggleAvailability, nearbyRequests, loadNearbyRequests, loading } = useWorkerStore();
  const { setActiveMode } = useSettingsStore();

  useEffect(() => {
    loadNearbyRequests();
  }, [loadNearbyRequests]);

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(ROUTES.WORKER_REQUEST_DETAIL, { request: item })}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: tokens.Radius.lg,
          padding: tokens.Spacing.lg,
          marginBottom: tokens.Spacing.md,
        },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={[styles.badge, { backgroundColor: theme.accent + '20' }]}>
          <Text style={[styles.badgeText, { color: theme.accent }]}>
            {item.categoryId?.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.priceTag, { color: theme.textPrimary }]}>
          {formatPrice(item.proposedPrice)}
        </Text>
      </View>

      <Text style={[styles.desc, { color: theme.textPrimary }]} numberOfLines={2}>
        {item.description || 'Intervention demandée par un client proche'}
      </Text>

      <View style={[styles.cardMeta, { borderTopColor: theme.borderSubtle, marginTop: tokens.Spacing.md }]}>
        <View style={styles.metaItem}>
          <MapPin size={14} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {item.address || 'Casablanca'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
            paddingHorizontal: tokens.Spacing.lg,
            paddingVertical: tokens.Spacing.md,
          },
        ]}
      >
        <View>
          <Text style={[styles.appName, { color: theme.accent }]}>InHome Artisan</Text>
          <Text style={[styles.onlineStatus, { color: isOnline ? theme.success : theme.danger }]}>
            ● {isOnline ? t('worker.home.online') : t('worker.home.offline')}
          </Text>
        </View>
        <Switch
          value={isOnline}
          onValueChange={toggleAvailability}
          trackColor={{ false: theme.border, true: theme.accent }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Switch mode client quick action */}
      <View style={[styles.switchBar, { backgroundColor: theme.surfaceElevated, padding: tokens.Spacing.sm }]}>
        <TouchableOpacity
          onPress={() => setActiveMode('client')}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Text style={{ color: theme.textSecondary, fontSize: 13, fontWeight: '600' }}>
            ⇄ Passer en Mode Client
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.WORKER_EARNINGS)}
          style={{ flex: 1, alignItems: 'center' }}
        >
          <Text style={{ color: theme.accent, fontSize: 13, fontWeight: '600' }}>
            Mes Revenus
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loader message="Recherche des demandes proches..." />
      ) : nearbyRequests.length === 0 ? (
        <EmptyState
          message="Aucune demande à proximité pour l'instant"
          subtitle="Restez en ligne, de nouvelles demandes de clients arrivent régulièrement."
          action={<PrimaryButton title="Actualiser" onPress={() => loadNearbyRequests()} />}
        />
      ) : (
        <FlatList
          data={nearbyRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderRequestItem}
          contentContainerStyle={{ padding: tokens.Spacing.lg }}
        />
      )}
      {/* TODO(INH-worker): Vue carte interactive des demandes autour avec rayon de déplacement paramétrable */}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
  },
  onlineStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  switchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  priceTag: {
    fontSize: 18,
    fontWeight: '800',
  },
  desc: {
    fontSize: 14,
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: 'row',
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

export default WorkerHomeScreen;
