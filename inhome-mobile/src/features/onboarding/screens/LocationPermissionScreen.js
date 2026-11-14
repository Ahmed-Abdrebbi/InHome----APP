// File: src/features/onboarding/screens/LocationPermissionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import useLocationStore from '../../home/store/useLocationStore';
import { useSettingsStore } from '../../account/store/useSettingsStore';

/**
 * LocationPermissionScreen
 * Requests GPS permission and sets hasSeenOnboarding(true) to trigger RootNavigator transition.
 */
const LocationPermissionScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const setLocation = useLocationStore((state) => state.setLocation);
  const setPermissionStatus = useLocationStore((state) => state.setPermissionStatus);
  const setDefaultLocation = useLocationStore((state) => state.setDefaultLocation);
  const setHasSeenOnboarding = useSettingsStore((state) => state.setHasSeenOnboarding);

  const finishOnboarding = async () => {
    await setHasSeenOnboarding(true);
  };

  const handleRequestPermission = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setLocation(coords);
        setPermissionStatus('granted');
      } else {
        setDefaultLocation();
      }
    } catch (error) {
      console.warn('Error requesting location:', error);
      setDefaultLocation();
    } finally {
      setLoading(false);
      await finishOnboarding();
    }
  };

  const handleSkip = async () => {
    setDefaultLocation();
    await finishOnboarding();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Main content */}
      <View style={styles.content}>
        {/* Centered MapPin Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
          <MapPin size={48} color={theme.accent} />
        </View>

        {/* Header Title & Description */}
        <Text style={[styles.title, { color: theme.textPrimary }]}>Autoriser la localisation</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Activez la géolocalisation pour découvrir les artisans et prestataires qualifiés disponibles immédiatement autour de chez vous.
        </Text>
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {/* Primary Button */}
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.accent }]}
          onPress={handleRequestPermission}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Autoriser la localisation</Text>
          )}
        </TouchableOpacity>

        {/* Secondary Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={[styles.skipButtonText, { color: theme.textSecondary }]}>Plus tard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    gap: 24,
    marginTop: 60,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
  footer: {
    gap: 16,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

export default LocationPermissionScreen;
