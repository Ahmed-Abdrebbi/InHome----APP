// File: src/features/worker/screens/WorkerEarningsScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Wallet, TrendingUp, Calendar, CheckCircle } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';
import { formatPrice } from '../../../core/utils/formatPrice';
import { useWorkerStore } from '../store/useWorkerStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import Loader from '../../../shared/components/feedback/Loader';

export const WorkerEarningsScreen = () => {
  const { theme, tokens } = useTheme();
  const { earnings, loadEarnings } = useWorkerStore();

  useEffect(() => {
    loadEarnings();
  }, [loadEarnings]);

  return (
    <ScreenContainer>
      <ScreenHeader title={t('worker.earnings.title')} />
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.accent,
              borderRadius: tokens.Radius.lg,
              padding: tokens.Spacing.xl,
            },
          ]}
        >
          <Text style={[styles.heroLabel, { color: theme.onAccent }]}>Revenus d'aujourd'hui</Text>
          <Text style={[styles.heroAmount, { color: theme.onAccent }]}>
            {formatPrice(earnings?.todayMAD || 420)}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                borderRadius: tokens.Radius.md,
                padding: tokens.Spacing.md,
              },
            ]}
          >
            <Calendar size={18} color={theme.accent} />
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Cette semaine</Text>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {formatPrice(earnings?.weekMAD || 2850)}
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                borderRadius: tokens.Radius.md,
                padding: tokens.Spacing.md,
              },
            ]}
          >
            <TrendingUp size={18} color={theme.success} />
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Ce mois</Text>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>
              {formatPrice(earnings?.monthMAD || 9400)}
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: tokens.Spacing.xl, marginBottom: tokens.Spacing.md }]}>
          Dernières prestations encaissées :
        </Text>

        {earnings?.history?.map((item) => (
          <View
            key={item.id}
            style={[
              styles.historyItem,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                borderRadius: tokens.Radius.md,
                padding: tokens.Spacing.md,
                marginBottom: tokens.Spacing.sm,
              },
            ]}
          >
            <View>
              <Text style={[styles.itemTitle, { color: theme.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.itemDate, { color: theme.textSecondary }]}>{item.date}</Text>
            </View>
            <Text style={[styles.itemAmount, { color: theme.success }]}>
              +{formatPrice(item.amountMAD)}
            </Text>
          </View>
        ))}
        {/* TODO(INH-earnings): Virement bancaire / RIB vers CIH ou Attijariwafa Bank */}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  heroAmount: {
    fontSize: 36,
    fontWeight: '900',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  itemDate: {
    fontSize: 12,
    marginTop: 2,
  },
  itemAmount: {
    fontWeight: '800',
    fontSize: 16,
  },
});

export default WorkerEarningsScreen;
