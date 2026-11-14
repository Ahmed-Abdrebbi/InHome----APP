// File: src/features/booking/screens/HistoryScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock, CheckCircle, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { formatPrice } from '../../../core/utils/formatPrice';
import { formatBookingDate } from '../../../core/utils/date';
import { BOOKING_STATUS_LABELS } from '../../../core/config/statuses';
import bookingsApi from '../api/bookingsApi';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import Loader from '../../../shared/components/feedback/Loader';
import EmptyState from '../../../shared/components/feedback/EmptyState';

export const HistoryScreen = () => {
  const navigation = useNavigation();
  const { theme, tokens } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await bookingsApi.getMine();
        setHistory(data);
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderRadius: tokens.Radius.md,
          padding: tokens.Spacing.md,
          marginBottom: tokens.Spacing.md,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.category, { color: theme.textPrimary }]}>
            {item.categoryId?.toUpperCase()}
          </Text>
          <Text style={[styles.address, { color: theme.textSecondary }]}>{item.address}</Text>
          <Text style={[styles.date, { color: theme.textDisabled }]}>
            {formatBookingDate(item.createdAt)}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.price, { color: theme.accent }]}>
            {formatPrice(item.finalPrice || item.proposedPrice)}
          </Text>
          <Text style={[styles.status, { color: theme.textSecondary }]}>
            {BOOKING_STATUS_LABELS[item.status] || item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="Historique des demandes" />
      {loading ? (
        <Loader />
      ) : history.length === 0 ? (
        <EmptyState
          message="Aucune réservation pour le moment"
          subtitle="Vos demandes d'artisans passées apparaîtront ici."
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: tokens.Spacing.lg }}
        />
      )}
      {/* TODO(INH-history): Filtre par statut (En cours / Terminées / Annulées) et téléchargement de facture PDF */}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontWeight: '700',
    fontSize: 15,
  },
  address: {
    fontSize: 13,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  price: {
    fontWeight: '800',
    fontSize: 16,
  },
  status: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default HistoryScreen;
