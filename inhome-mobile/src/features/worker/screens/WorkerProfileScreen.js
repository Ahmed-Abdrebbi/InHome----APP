// File: src/features/worker/screens/WorkerProfileScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Star, Award, MapPin, Wrench } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';
import { useWorkerStore } from '../store/useWorkerStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

export const WorkerProfileScreen = () => {
  const { theme, tokens } = useTheme();
  const { profile, loadProfile } = useWorkerStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <ScreenContainer>
      <ScreenHeader title={t('worker.profile.title')} />
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        <View style={styles.centerBlock}>
          <Image
            source={{
              uri:
                profile?.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            }}
            style={styles.avatar}
          />
          <Text style={[styles.name, { color: theme.textPrimary, marginTop: tokens.Spacing.md }]}>
            {profile?.fullName || 'Youssef El Amrani'}
          </Text>
          <Text style={[styles.category, { color: theme.accent }]}>
            Artisan {profile?.category?.toUpperCase() || 'PLOMBIER'}
          </Text>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: tokens.Radius.lg,
              padding: tokens.Spacing.lg,
              marginTop: tokens.Spacing.xl,
            },
          ]}
        >
          <View style={styles.metricRow}>
            <View style={styles.metric}>
              <Star size={20} color="#FFB300" fill="#FFB300" />
              <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
                {profile?.rating || '4.9'}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Note clients</Text>
            </View>

            <View style={styles.metric}>
              <Award size={20} color={theme.accent} />
              <Text style={[styles.metricValue, { color: theme.textPrimary }]}>
                {profile?.totalReviews || '48'}
              </Text>
              <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Avis reçus</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: tokens.Spacing.lg }]}>
            À propos de l'artisan :
          </Text>
          <Text style={[styles.bio, { color: theme.textPrimary }]}>
            {profile?.bio || 'Artisan professionnel disponible pour les urgences et travaux à domicile.'}
          </Text>
        </View>

        <View style={{ marginTop: tokens.Spacing.xl }}>
          <PrimaryButton title="Modifier mes compétences" onPress={() => {}} variant="outline" />
        </View>
        {/* TODO(INH-worker): Ajout de photos de réalisations et chantiers passés */}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  centerBlock: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
  },
  category: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  infoCard: {
    borderWidth: 1,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  bio: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
});

export default WorkerProfileScreen;
