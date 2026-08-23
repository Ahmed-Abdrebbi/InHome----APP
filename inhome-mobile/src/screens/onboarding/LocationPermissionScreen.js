// File: src/screens/onboarding/LocationPermissionScreen.js
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
import useLocationStore from '../../store/useLocationStore';

/**
 * LocationPermissionScreen UI
 * Handles requesting GPS permissions or skipping to default coordinates (Fquih Ben Salah).
 */
const LocationPermissionScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const setLocation = useLocationStore((state) => state.setLocation);
  const setPermissionStatus = useLocationStore((state) => state.setPermissionStatus);
  const setDefaultLocation = useLocationStore((state) => state.setDefaultLocation);

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
        navigation.replace('MapHome');
      } else {
        setDefaultLocation();
        navigation.replace('MapHome');
      }
    } catch (error) {
      console.warn('Error requesting location:', error);
      setDefaultLocation();
      navigation.replace('MapHome');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setDefaultLocation();
    navigation.replace('MapHome');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#212121" />

      {/* Main content */}
      <View style={styles.content}>
        {/* Centered MapPin Icon */}
        <View style={styles.iconContainer}>
          <MapPin size={48} color="#FF6B00" />
        </View>

        {/* Header Title & Description */}
        <Text style={styles.title}>Autoriser la localisation</Text>
        <Text style={styles.description}>
          Activez la géolocalisation pour découvrir les bricoleurs et prestataires qualifiés disponibles immédiatement autour de vous.
        </Text>
      </View>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        {/* Primary Button */}
        <TouchableOpacity
          style={styles.primaryButton}
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
          <Text style={styles.skipButtonText}>Ignorer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 107, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 0, 0.25)',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#9E9E9E',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  footer: {
    width: '100%',
    gap: 16,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FF6B00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9E9E9E',
  },
});

export default LocationPermissionScreen;
