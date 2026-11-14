// File: src/features/home/screens/MapHomeScreen.js
import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker, Callout } from '../../../shared/components/map/CustomMapView';
import * as Location from 'expo-location';
import {
  Menu,
  Wrench,
  Zap,
  Paintbrush,
  Star,
  Crosshair,
} from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';
import BottomSheetContainer from '../../../shared/components/ui/BottomSheetContainer';
import useMapStore from '../store/useMapStore';
import useLocationStore from '../store/useLocationStore';
import { useBookingStore } from '../../booking/store/useBookingStore';

/**
 * Custom dark map style for Google Maps & Apple Maps
 */
const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1A1D24' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8A92A6' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1A1D24' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#DCE1EB' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6C757D' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#15222E' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2C3240' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#202530' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#3A4254' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#242B38' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0F141C' }],
  },
];

const INITIAL_REGION = {
  latitude: 32.5000,
  longitude: -6.6833,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Électricité':
      return Zap;
    case 'Peinture':
      return Paintbrush;
    case 'Plomberie':
    default:
      return Wrench;
  }
};

const MapHomeScreen = ({ navigation }) => {
  const mapRef = useRef(null);
  const { theme } = useTheme();

  const selectedCategory = useMapStore((state) => state.selectedCategory);
  const providers = useMapStore((state) => state.providers);
  const userLocation = useLocationStore((state) => state.userLocation);
  const { updateDraft } = useBookingStore();

  const filteredProviders =
    selectedCategory === 'All'
      ? providers
      : providers.filter((p) => p.category === selectedCategory);

  const initialLocation = userLocation || INITIAL_REGION;

  const handleSearchCity = async (cityName) => {
    try {
      const query =
        cityName.toLowerCase().includes('morocco') || cityName.toLowerCase().includes('maroc')
          ? cityName
          : `${cityName}, Morocco`;

      const results = await Location.geocodeAsync(query);

      if (results && results.length > 0) {
        const { latitude, longitude } = results[0];
        mapRef.current?.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
        );
      } else {
        Alert.alert(
          'Ville non trouvée',
          `Impossible de localiser "${cityName}". Veuillez vérifier le nom de la ville.`
        );
      }
    } catch (error) {
      console.warn('Geocoding error:', error);
      Alert.alert(
        'Recherche impossible',
        'Une erreur est survenue lors de la recherche de la ville.'
      );
    }
  };

  const handleSelectAddress = (address) => {
    updateDraft({ address: address.name });
    if (navigation) {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { address: address.name });
    }
  };

  const handleSelectProvider = (provider) => {
    updateDraft({
      category: provider.category,
      providerId: provider.id,
      address: 'Intervention à proximité',
    });
    if (navigation) {
      navigation.navigate(ROUTES.PROVIDER_DETAILS, { provider });
    }
  };

  const handleCenterOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        800
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Live Interactive Map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        }}
        customMapStyle={DARK_MAP_STYLE}
        showsUserLocation={true}
        showsCompass={false}
      >
        {filteredProviders.map((provider) => {
          const IconComponent = getCategoryIcon(provider.category);
          return (
            <Marker
              key={provider.id}
              coordinate={{
                latitude: provider.latitude,
                longitude: provider.longitude,
              }}
              title={provider.name}
              description={`${provider.category} • ${provider.price}`}
            >
              {/* Custom Marker Pin */}
              <View style={styles.markerContainer}>
                <View style={[styles.markerCircle, { backgroundColor: theme.accent }]}>
                  <IconComponent size={16} color="#FFFFFF" />
                </View>
                <View style={[styles.markerTriangle, { borderTopColor: theme.accent }]} />
              </View>

              {/* Callout Popup */}
              <Callout tooltip onPress={() => handleSelectProvider(provider)}>
                <View
                  style={[
                    styles.calloutCard,
                    {
                      backgroundColor: theme.surfaceElevated || '#212121',
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.calloutName, { color: theme.textPrimary }]}>
                    {provider.name}
                  </Text>
                  <Text style={[styles.calloutCategory, { color: theme.textSecondary }]}>
                    {provider.category} • {provider.price}
                  </Text>
                  <View style={styles.calloutRating}>
                    <Star size={12} color="#FFB300" fill="#FFB300" />
                    <Text style={[styles.calloutRatingText, { color: theme.accent }]}>
                      {provider.rating} ({provider.reviewsCount} avis)
                    </Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Floating UI Overlays */}
      <View style={[StyleSheet.absoluteFillObject, { pointerEvents: 'box-none' }]}>
        {/* Top Controls */}
        <View style={styles.topRow}>
          {/* Hamburger Menu Button */}
          <TouchableOpacity
            style={[
              styles.floatingBtn,
              {
                backgroundColor: theme.surfaceElevated || '#212121',
                borderColor: theme.border,
              },
            ]}
            onPress={() => navigation && navigation.navigate(ROUTES.MENU_DRAWER)}
            activeOpacity={0.85}
          >
            <Menu size={22} color={theme.textPrimary} />
          </TouchableOpacity>

          {/* Center GPS Button */}
          <TouchableOpacity
            style={[
              styles.floatingBtn,
              {
                backgroundColor: theme.surfaceElevated || '#212121',
                borderColor: theme.border,
              },
            ]}
            onPress={handleCenterOnUser}
            activeOpacity={0.85}
          >
            <Crosshair size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet Section */}
        <View style={styles.bottomSheetWrapper}>
          <BottomSheetContainer
            onSearchCity={handleSearchCity}
            onSelectAddress={handleSelectAddress}
            onSearchPress={() => navigation && navigation.navigate(ROUTES.SEARCH_SERVICE)}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topRow: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 48,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    pointerEvents: 'box-none',
  },
  floatingBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
    marginTop: -1,
  },
  calloutCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    width: 180,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  calloutName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  calloutCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calloutRatingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomSheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default MapHomeScreen;
