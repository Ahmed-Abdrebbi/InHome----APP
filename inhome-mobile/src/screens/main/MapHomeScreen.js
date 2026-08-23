// File: src/screens/main/MapHomeScreen.js
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
import MapView, { Marker, Callout } from '../../components/Map/CustomMapView';
import * as Location from 'expo-location';
import {
  Menu,
  Wrench,
  Zap,
  Paintbrush,
  Star,
} from 'lucide-react-native';
import BottomSheetContainer from '../../components/UI/BottomSheetContainer';
import useMapStore from '../../store/useMapStore';
import useLocationStore from '../../store/useLocationStore';

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

/**
 * Helper to get icon component based on provider category
 */
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

  const selectedCategory = useMapStore((state) => state.selectedCategory);
  const providers = useMapStore((state) => state.providers);
  const userLocation = useLocationStore((state) => state.userLocation);

  // Dynamic filtering of providers
  const filteredProviders =
    selectedCategory === 'All'
      ? providers
      : providers.filter((p) => p.category === selectedCategory);

  const initialLocation = userLocation || INITIAL_REGION;

  /**
   * Geocode a Moroccan city and animate MapView camera
   */
  const handleSearchCity = async (cityName) => {
    try {
      const query = cityName.toLowerCase().includes('morocco') || cityName.toLowerCase().includes('maroc')
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
    navigation && navigation.navigate('ProviderDetails', { address: address.name });
  };

  return (
    <View style={styles.container}>
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
                <View style={styles.markerCircle}>
                  <IconComponent size={16} color="#FFFFFF" />
                </View>
                <View style={styles.markerTriangle} />
              </View>

              {/* Callout Popup */}
              <Callout
                tooltip
                onPress={() =>
                  navigation &&
                  navigation.navigate('ProviderDetails', { provider })
                }
              >
                <View style={styles.calloutCard}>
                  <Text style={styles.calloutName}>{provider.name}</Text>
                  <Text style={styles.calloutCategory}>
                    {provider.category} • {provider.price}
                  </Text>
                  <View style={styles.calloutRating}>
                    <Star size={12} color="#FF6B00" fill="#FF6B00" />
                    <Text style={styles.calloutRatingText}>
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
        {/* Hamburger Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation && navigation.navigate('MenuDrawer')}
          activeOpacity={0.85}
        >
          <Menu size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Bottom Sheet Section */}
        <View style={styles.bottomSheetWrapper}>
          <BottomSheetContainer
            onSearchCity={handleSearchCity}
            onSelectAddress={handleSelectAddress}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 48,
    left: 20,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B00',
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
    borderTopColor: '#FF6B00',
    alignSelf: 'center',
    marginTop: -1,
  },
  calloutCard: {
    backgroundColor: '#212121',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#383838',
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
    color: '#FFFFFF',
    marginBottom: 2,
  },
  calloutCategory: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 4,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calloutRatingText: {
    fontSize: 11,
    color: '#FF6B00',
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
