// File: src/screens/booking/ProviderDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  Menu,
  Camera,
  FileText,
  CreditCard,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '../../theme/colors';
import PrimaryButton from '../../components/UI/PrimaryButton';

/**
 * Provider/request details screen matching the Stitch "Détails de la demande" design.
 * Features:
 *  - Map background (full screen)
 *  - Floating menu button
 *  - Bottom sheet with: location dot, action rows (photos, describe, price), CTA
 */
const ProviderDetailsScreen = ({ navigation, route }) => {
  const address = route?.params?.address || 'Av. Marrakech';

  const actionItems = [
    {
      id: 'photos',
      icon: Camera,
      label: 'Ajouter des photos',
      onPress: () => {},
    },
    {
      id: 'describe',
      icon: FileText,
      label: 'Décrire le problème',
      onPress: () => {},
    },
    {
      id: 'price',
      icon: CreditCard,
      label: 'Proposer votre prix',
      onPress: () => navigation && navigation.navigate('PriceProposal'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapBackground}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapGrid}>
            {Array.from({ length: 20 }).map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 36 }]} />
            ))}
          </View>
        </View>
      </View>

      {/* Floating Menu Button */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation && navigation.goBack()}
        activeOpacity={0.8}
      >
        <Menu size={24} color={Colors.onSurface} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Drag Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Header */}
        <Text style={styles.sheetTitle}>Détails de la demande</Text>

        {/* Location Row */}
        <View style={styles.locationRow}>
          <View style={styles.greenDot} />
          <Text style={styles.locationText}>{address}</Text>
        </View>

        {/* Action Rows */}
        <View style={styles.actionsContainer}>
          {actionItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.actionRow}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={styles.actionLeft}>
                  <IconComponent size={22} color={Colors.outline} />
                  <Text style={styles.actionLabel}>{item.label}</Text>
                </View>
                <ChevronRight size={20} color={Colors.outline} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA */}
        <PrimaryButton
          title="Trouver un prestataire"
          onPress={() =>
            navigation && navigation.navigate('SearchingRadar')
          }
          style={styles.ctaBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.mapNavy,
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
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
  menuButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 50,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 24,
    zIndex: 20,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
    color: Colors.white,
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.green,
  },
  locationText: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    color: Colors.white,
  },
  actionsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.white,
  },
  ctaBtn: {
    borderRadius: 12,
  },
});

export default ProviderDetailsScreen;
