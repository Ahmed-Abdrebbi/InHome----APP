// File: src/core/hooks/useCurrentLocation.js
import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { DEFAULT_CITY } from '../config/constants';

export const useCurrentLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission de localisation refusée.');
        // Fallback propre sur Casablanca
        setLocation({
          latitude: DEFAULT_CITY.latitude,
          longitude: DEFAULT_CITY.longitude,
          isFallback: true,
        });
        setLoading(false);
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setLocation({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        isFallback: false,
      });
    } catch (e) {
      setError(e.message || 'Impossible de récupérer la position.');
      setLocation({
        latitude: DEFAULT_CITY.latitude,
        longitude: DEFAULT_CITY.longitude,
        isFallback: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { location, error, loading, refresh: fetchLocation };
};

export default useCurrentLocation;
