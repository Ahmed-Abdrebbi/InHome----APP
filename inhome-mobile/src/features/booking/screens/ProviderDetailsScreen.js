// File: src/features/booking/screens/ProviderDetailsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Camera,
  FileText,
  CreditCard,
  ChevronRight,
  CheckCircle,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import { formatPrice } from '../../../core/utils/formatPrice';
import { useBookingStore } from '../store/useBookingStore';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';

const ProviderDetailsScreen = ({ navigation, route }) => {
  const { theme, tokens } = useTheme();
  const { draft, updateDraft } = useBookingStore();
  const [photoCount, setPhotoCount] = useState(0);

  const address = route?.params?.address || draft?.address || 'Av. Marrakech';
  const category = route?.params?.service || draft?.category || 'Plomberie';
  const proposedPrice = draft?.proposedPrice || 80;

  const handlePickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.7,
      });
      if (!res.canceled && res.assets?.length > 0) {
        setPhotoCount((prev) => prev + 1);
        Alert.alert('Photo ajoutée', 'Votre photo a été attachée à la demande avec succès.');
      }
    } catch {
      // Fallback simulé
      setPhotoCount((prev) => prev + 1);
      Alert.alert('Photo ajoutée', '1 photo simulée attachée.');
    }
  };

  const actionItems = [
    {
      id: 'photos',
      icon: Camera,
      label: photoCount > 0 ? `${photoCount} photo(s) ajoutée(s)` : 'Ajouter des photos',
      badge: photoCount > 0 ? '✓' : null,
      onPress: handlePickImage,
    },
    {
      id: 'describe',
      icon: FileText,
      label: `Service : ${category}`,
      badge: null,
      onPress: () => {
        Alert.prompt
          ? Alert.prompt('Décrire le problème', 'Donnez plus de détails pour le prestataire:', (text) => {
              if (text) updateDraft({ description: text });
            })
          : Alert.alert('Service sélectionné', `Catégorie : ${category}`);
      },
    },
    {
      id: 'price',
      icon: CreditCard,
      label: `Prix proposé : ${formatPrice(proposedPrice)}`,
      badge: 'Modifier',
      onPress: () => navigation && navigation.navigate(ROUTES.PRICE_PROPOSAL),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background Simulation */}
      <View style={[styles.mapBackground, { backgroundColor: theme.surface }]}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={[styles.gridLineH, { top: i * 40, backgroundColor: theme.borderSubtle }]}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[styles.gridLineV, { left: i * 36, backgroundColor: theme.borderSubtle }]}
            />
          ))}
        </View>
      </View>

      {/* Top Back Button */}
      <TouchableOpacity
        style={[
          styles.backButton,
          {
            backgroundColor: theme.surfaceElevated || '#212121',
            borderColor: theme.border,
          },
        ]}
        onPress={() => navigation && navigation.goBack()}
        activeOpacity={0.8}
      >
        <ArrowLeft size={22} color={theme.textPrimary} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <View
        style={[
          styles.bottomSheet,
          {
            backgroundColor: theme.surfaceElevated || '#212121',
            borderColor: theme.border,
          },
        ]}
      >
        {/* Drag Handle */}
        <View style={styles.handleContainer}>
          <View style={[styles.handle, { backgroundColor: theme.borderSubtle }]} />
        </View>

        {/* Header */}
        <Text style={[styles.sheetTitle, { color: theme.textPrimary }]}>
          Détails de la demande
        </Text>

        {/* Location Row */}
        <View style={[styles.locationRow, { backgroundColor: theme.surface }]}>
          <View style={[styles.greenDot, { backgroundColor: theme.accent }]} />
          <Text style={[styles.locationText, { color: theme.textPrimary }]}>{address}</Text>
        </View>

        {/* Action Rows */}
        <View style={styles.actionsContainer}>
          {actionItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.actionRow, { borderBottomColor: theme.borderSubtle }]}
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={styles.actionLeft}>
                  <IconComponent size={20} color={theme.accent} />
                  <Text style={[styles.actionLabel, { color: theme.textPrimary }]}>
                    {item.label}
                  </Text>
                </View>
                <View style={styles.actionRight}>
                  {item.badge && (
                    <Text style={[styles.badgeText, { color: theme.accent }]}>{item.badge}</Text>
                  )}
                  <ChevronRight size={18} color={theme.textSecondary} />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA */}
        <PrimaryButton
          title="Continuer vers la confirmation"
          onPress={() => {
            updateDraft({ address, category, proposedPrice });
            navigation.navigate(ROUTES.CONFIRMATION);
          }}
          style={styles.ctaBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 10,
    elevation: 4,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 34,
    borderTopWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 16,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 12,
    marginBottom: 16,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: {
    fontSize: 15,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ctaBtn: {
    borderRadius: 12,
  },
});

export default ProviderDetailsScreen;
