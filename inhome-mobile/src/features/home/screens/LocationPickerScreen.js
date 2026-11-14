// File: src/features/home/screens/LocationPickerScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { DEFAULT_CITY } from '../../../core/config/constants';
import { useBookingStore } from '../../booking/store/useBookingStore';
import ScreenContainer from '../../../shared/components/ui/ScreenContainer';
import ScreenHeader from '../../../shared/components/ui/ScreenHeader';
import PrimaryButton from '../../../shared/components/ui/PrimaryButton';
import CustomMapView from '../../../shared/components/map/CustomMapView';

export const LocationPickerScreen = () => {
  const navigation = useNavigation();
  const { theme, tokens } = useTheme();
  const { updateDraft } = useBookingStore();

  const [pickedLocation, setPickedLocation] = useState({
    latitude: DEFAULT_CITY.latitude,
    longitude: DEFAULT_CITY.longitude,
    address: 'Position sélectionnée sur la carte, Casablanca',
  });

  const handleConfirm = () => {
    updateDraft({
      address: pickedLocation.address,
      coordinates: {
        latitude: pickedLocation.latitude,
        longitude: pickedLocation.longitude,
      },
    });
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="Choisir l'adresse sur la carte" />
      <View style={styles.mapWrap}>
        <CustomMapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            ...DEFAULT_CITY,
          }}
          onRegionChangeComplete={(region) => {
            setPickedLocation({
              latitude: region.latitude,
              longitude: region.longitude,
              address: `Lat: ${region.latitude.toFixed(4)}, Lng: ${region.longitude.toFixed(4)}`,
            });
          }}
        />

        {/* Pin central fixe */}
        <View pointerEvents="none" style={styles.pinCenter}>
          <MapPin size={38} color={theme.accent} fill={theme.accent} />
        </View>
      </View>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
            padding: tokens.Spacing.lg,
          },
        ]}
      >
        <Text style={[styles.addressText, { color: theme.textPrimary, marginBottom: tokens.Spacing.md }]}>
          {pickedLocation.address}
        </Text>
        <PrimaryButton title="Confirmer cet emplacement" onPress={handleConfirm} />
      </View>
      {/* TODO(INH-geo): Reverse geocoding avec l'API Google Maps / Nominatim pour obtenir le nom de rue précis */}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  mapWrap: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -38,
    marginLeft: -19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    borderTopWidth: 1,
  },
  addressText: {
    fontWeight: '600',
    fontSize: 15,
  },
});

export default LocationPickerScreen;
