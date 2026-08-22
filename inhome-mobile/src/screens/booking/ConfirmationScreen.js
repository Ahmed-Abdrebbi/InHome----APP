// File: src/screens/booking/ConfirmationScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Wrench,
  Timer,
  Camera,
  SlidersHorizontal,
} from 'lucide-react-native';
import Colors from '../../theme/colors';
import PrimaryButton from '../../components/UI/PrimaryButton';
import ProviderInfoCard from '../../components/Cards/ProviderInfoCard';

/**
 * Booking confirmation screen matching the Stitch "Confirmation de rénovation" design.
 * Features:
 *  - Map background with pins
 *  - Floating info card (address + job scope)
 *  - Bottom sheet: quote options (3 tiers — selected highlighted)
 *  - "Trouver un prestataire" CTA + settings button
 */
const ConfirmationScreen = ({ navigation }) => {
  const [selectedTier, setSelectedTier] = useState(0);

  const tiers = [
    {
      id: 'full',
      icon: Wrench,
      title: 'Devis complet',
      subtitle: 'Visite + devis détaillé',
      price: 'DH 350',
    },
    {
      id: 'express',
      icon: Timer,
      title: 'Devis express',
      subtitle: 'Visite rapide',
      price: 'DH 268',
    },
    {
      id: 'remote',
      icon: Camera,
      title: 'Devis à distance',
      subtitle: 'Par photo/vidéo',
      price: 'DH 100',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapBg}>
        <View style={styles.mapBase}>
          {/* Grid pattern */}
          <View style={styles.mapGrid}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 30 }]} />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 25 }]} />
            ))}
          </View>

          {/* Client pin */}
          <View style={styles.clientPin}>
            <View style={styles.clientPinHalo} />
            <View style={styles.clientPinDot} />
          </View>

          {/* Supplier pin */}
          <View style={styles.supplierPin}>
            <View style={styles.supplierPinOuter}>
              <View style={styles.supplierPinInner} />
            </View>
          </View>
        </View>
      </View>

      {/* Floating Info Card */}
      <View style={styles.infoCardContainer}>
        <ProviderInfoCard
          address="Av. Marrakech"
          addressLabel="Adresse d'intervention"
          jobTitle="Rénovation salle de bain"
          jobEstimate="~2 jours estimés"
          onEditPress={() => {}}
        />
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Drag Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <Text style={styles.sheetTitle}>Options de devis</Text>

        {/* Tiers */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tiersContainer}
        >
          {tiers.map((tier, index) => {
            const IconComp = tier.icon;
            const isSelected = selectedTier === index;

            return (
              <TouchableOpacity
                key={tier.id}
                style={[
                  styles.tierCard,
                  isSelected && styles.tierCardSelected,
                ]}
                onPress={() => setSelectedTier(index)}
                activeOpacity={0.7}
              >
                {isSelected && <View style={styles.tierHighlight} />}
                <View
                  style={[
                    styles.tierIcon,
                    isSelected && styles.tierIconSelected,
                  ]}
                >
                  <IconComp
                    size={22}
                    color={
                      isSelected
                        ? Colors.secondaryContainer
                        : Colors.primary
                    }
                  />
                </View>
                <View style={styles.tierContent}>
                  <Text
                    style={[
                      styles.tierTitle,
                      isSelected && styles.tierTitleSelected,
                    ]}
                  >
                    {tier.title}
                  </Text>
                  <Text style={styles.tierSubtitle}>{tier.subtitle}</Text>
                </View>
                <Text
                  style={[
                    styles.tierPrice,
                    isSelected && styles.tierPriceSelected,
                  ]}
                >
                  {tier.price}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer Actions */}
        <View style={styles.footerActions}>
          <PrimaryButton
            title="Trouver un prestataire"
            onPress={() => navigation && navigation.navigate('MapHome')}
            style={styles.findBtn}
          />
          <TouchableOpacity
            style={styles.settingsBtn}
            activeOpacity={0.7}
          >
            <SlidersHorizontal
              size={22}
              color={Colors.onBackground}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  mapBase: {
    flex: 1,
    backgroundColor: Colors.mapBase,
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.white,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: Colors.white,
  },
  clientPin: {
    position: 'absolute',
    top: '35%',
    left: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientPinHalo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.onBackground}1A`,
    position: 'absolute',
  },
  clientPinDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.onBackground,
  },
  supplierPin: {
    position: 'absolute',
    top: '55%',
    right: '25%',
  },
  supplierPinOuter: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supplierPinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.secondaryContainer,
  },
  infoCardContainer: {
    position: 'relative',
    zIndex: 10,
    paddingTop: 52,
    paddingHorizontal: 16,
  },
  bottomSheet: {
    position: 'relative',
    zIndex: 20,
    backgroundColor: Colors.surfaceContainerLow,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 24,
    borderTopWidth: 1,
    borderTopColor: `${Colors.outlineVariant}4D`,
  },
  handleContainer: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
  },
  sheetTitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: Colors.onBackground,
    marginBottom: 20,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  tiersContainer: {
    gap: 12,
    paddingBottom: 8,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    overflow: 'hidden',
  },
  tierCardSelected: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 2,
    borderColor: Colors.secondaryContainer,
  },
  tierHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${Colors.secondaryContainer}0D`,
  },
  tierIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierIconSelected: {
    backgroundColor: `${Colors.secondaryContainer}33`,
  },
  tierContent: {
    flex: 1,
    gap: 2,
  },
  tierTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: Colors.onBackground,
  },
  tierTitleSelected: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
  },
  tierSubtitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 16,
    color: Colors.onSurfaceVariant,
  },
  tierPrice: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: Colors.onBackground,
  },
  tierPriceSelected: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 28,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: `${Colors.outlineVariant}4D`,
  },
  findBtn: {
    flex: 1,
    borderRadius: 12,
  },
  settingsBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConfirmationScreen;
