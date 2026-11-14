// File: src/features/rating/screens/RatingScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { useBookingStore } from '../../booking/store/useBookingStore';
import { ratingsApi } from '../api/ratingsApi';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';
import Loader from '../../../shared/components/feedback/Loader';

export const RatingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, tokens } = useTheme();
  const { reset: resetBooking } = useBookingStore();

  const bookingId = route.params?.bookingId;
  const providerName = route.params?.providerName || 'votre artisan';
  const providerId = route.params?.providerId || 'p1';

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await ratingsApi.submitRating({
        bookingId,
        providerId,
        rating,
        comment,
      });
      resetBooking();
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.MAP_HOME }],
      });
    } catch (e) {
      console.warn(e);
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Évaluation de l'intervention" showBack={false} />
      <View style={[styles.content, { padding: tokens.Spacing.xl }]}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Comment s'est passée votre intervention avec {providerName} ?
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary, marginTop: tokens.Spacing.xs }]}>
          Votre avis aide la communauté InHome à maintenir un haut niveau d'exigence.
        </Text>

        {/* 5 étoiles interactives */}
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((starIndex) => (
            <TouchableOpacity
              key={starIndex}
              onPress={() => setRating(starIndex)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Star
                size={42}
                color="#FFB300"
                fill={starIndex <= rating ? '#FFB300' : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Laissez un commentaire sur la ponctualité, la qualité du travail..."
          placeholderTextColor={theme.textDisabled}
          multiline
          numberOfLines={4}
          style={[
            styles.textarea,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              color: theme.textPrimary,
              borderRadius: tokens.Radius.md,
              marginTop: tokens.Spacing.xl,
            },
          ]}
        />

        <View style={{ marginTop: tokens.Spacing.xxl }}>
          {submitting ? (
            <Loader />
          ) : (
            <PrimaryButton title="Envoyer mon évaluation" onPress={handleSubmit} />
          )}
        </View>
        {/* TODO(INH-rating): Badges de pourboire optionnel en MAD (10, 20, 50 DH) */}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 28,
  },
  textarea: {
    height: 110,
    borderWidth: 1,
    padding: 14,
    fontSize: 15,
    textAlignVertical: 'top',
  },
});

export default RatingScreen;
