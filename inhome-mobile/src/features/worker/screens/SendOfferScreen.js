// File: src/features/worker/screens/SendOfferScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { useWorkerStore } from '../store/useWorkerStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';
import Loader from '../../../shared/components/feedback/Loader';

export const SendOfferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme, tokens } = useTheme();
  const { sendOffer, loading } = useWorkerStore();

  const request = route.params?.request;
  const [offerPrice, setOfferPrice] = useState(String(request?.proposedPrice || '100'));
  const [etaMinutes, setEtaMinutes] = useState('20');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try {
      await sendOffer({
        bookingId: request?.id,
        price: Number(offerPrice),
        etaMinutes: Number(etaMinutes),
        message,
      });
      setSubmitted(true);
      setTimeout(() => {
        navigation.navigate(ROUTES.ACTIVE_JOB, { jobId: request?.id });
      }, 1500);
    } catch (e) {
      // Géré
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Envoyer mon offre" />
      <View style={[styles.content, { padding: tokens.Spacing.xl }]}>
        {submitted ? (
          <View style={styles.successBox}>
            <Text style={[styles.successTitle, { color: theme.success }]}>
              Offre envoyée avec succès !
            </Text>
            <Text style={[styles.successSub, { color: theme.textSecondary }]}>
              En attente de la confirmation du client...
            </Text>
            <Loader message="Connexion au job..." />
          </View>
        ) : (
          <>
            <Text style={[styles.label, { color: theme.textSecondary }]}>
              Votre tarif pour cette intervention (en DH) :
            </Text>
            <TextInput
              value={offerPrice}
              onChangeText={setOfferPrice}
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.accent,
                  borderRadius: tokens.Radius.md,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: tokens.Spacing.lg }]}>
              Temps d'arrivée estimé (minutes) :
            </Text>
            <TextInput
              value={etaMinutes}
              onChangeText={setEtaMinutes}
              keyboardType="numeric"
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  borderRadius: tokens.Radius.md,
                },
              ]}
            />

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: tokens.Spacing.lg }]}>
              Message pour le client (facultatif) :
            </Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ex: J'ai le matériel adapté dans ma camionnette"
              placeholderTextColor={theme.textDisabled}
              style={[
                styles.input,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                  borderRadius: tokens.Radius.md,
                },
              ]}
            />

            <View style={{ marginTop: tokens.Spacing.xxl }}>
              {loading ? (
                <Loader />
              ) : (
                <PrimaryButton title="Valider & Transmettre l'offre" onPress={handleSubmit} />
              )}
            </View>
          </>
        )}
      </View>
      {/* TODO(INH-worker): Prédicteur de tarif suggéré basé sur les transactions historiques du quartier */}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: '700',
  },
  successBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSub: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default SendOfferScreen;
