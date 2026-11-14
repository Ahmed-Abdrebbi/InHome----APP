// File: src/features/worker/screens/WorkerRequestDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MapPin, AlertTriangle, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { formatPrice } from '../../../core/utils/formatPrice';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';
import CustomMapView from '../../../shared/components/map/CustomMapView';

export const WorkerRequestDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, tokens } = useTheme();

  const request = route.params?.request || {
    id: 'req_1',
    categoryId: 'plomberie',
    address: 'Quartier Palmier, Casablanca',
    proposedPrice: 120,
    description: 'Robinet mélangeur cuisine qui fuit en permanence sous le meuble.',
    tier: 'STANDARD',
  };

  const handleOpenOffer = () => {
    navigation.navigate(ROUTES.SEND_OFFER, { request });
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Détail de la demande" />
      <ScrollView contentContainerStyle={{ padding: tokens.Spacing.lg }}>
        <View style={styles.mapWrap}>
          <CustomMapView style={StyleSheet.absoluteFillObject} />
          <View style={[styles.privacyBanner, { backgroundColor: theme.surface + 'EE' }]}>
            <ShieldCheck size={16} color={theme.success} />
            <Text style={[styles.privacyText, { color: theme.textSecondary }]}>
              Adresse exacte dévoilée dès l'acceptation de votre offre
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderRadius: tokens.Radius.lg,
              padding: tokens.Spacing.lg,
              marginTop: tokens.Spacing.lg,
            },
          ]}
        >
          <Text style={[styles.category, { color: theme.accent }]}>
            {request.categoryId?.toUpperCase()}
          </Text>
          <Text style={[styles.proposedPrice, { color: theme.textPrimary }]}>
            Tarif proposé par le client : {formatPrice(request.proposedPrice)}
          </Text>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: tokens.Spacing.md }]}>
            Description du problème :
          </Text>
          <Text style={[styles.desc, { color: theme.textPrimary }]}>{request.description}</Text>

          <View style={[styles.metaRow, { borderColor: theme.borderSubtle, marginTop: tokens.Spacing.md }]}>
            <MapPin size={16} color={theme.textSecondary} />
            <Text style={[styles.address, { color: theme.textSecondary }]}>{request.address}</Text>
          </View>
        </View>

        <View style={{ marginTop: tokens.Spacing.xl }}>
          <PrimaryButton title="Répondre & Envoyer une offre" onPress={handleOpenOffer} />
        </View>
        {/* TODO(INH-worker): Afficher les photos jointes par le client dans un carrousel */}
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mapWrap: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  privacyBanner: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    borderWidth: 1,
  },
  category: {
    fontSize: 13,
    fontWeight: '700',
  },
  proposedPrice: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  desc: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  address: {
    fontSize: 14,
  },
});

export default WorkerRequestDetailScreen;
