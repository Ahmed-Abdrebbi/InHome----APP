// File: src/screens/booking/SearchingRadarScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { X } from 'lucide-react-native';
import Colors from '../../theme/colors';
import RadarAnimation from '../../components/Map/RadarAnimation';
import ProviderMarker from '../../components/Map/ProviderMarker';

const { width, height } = Dimensions.get('window');

/**
 * Searching/radar screen matching the Stitch "Recherche de prestataire (Animé)" design.
 * Features:
 *  - Full-screen dark map background
 *  - Central radar pulse animation around a pin
 *  - Scattered provider markers at fixed positions
 *  - Bottom sheet: searching text + animated progress bar + cancel button
 *  - Floating close button (top-left)
 */
const SearchingRadarScreen = ({ navigation }) => {
  const progressAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 0.85,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressAnim, {
          toValue: 0.3,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    anim.start();

    // Auto-navigate to confirmation after 5s
    const timer = setTimeout(() => {
      if (navigation) {
        navigation.replace('Confirmation');
      }
    }, 5000);

    return () => {
      anim.stop();
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Map Background */}
      <View style={styles.mapBg}>
        <View style={styles.mapGrid}>
          {Array.from({ length: 25 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 36 }]} />
          ))}
          {Array.from({ length: 15 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 30 }]} />
          ))}
        </View>
      </View>

      {/* Floating Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation && navigation.goBack()}
        activeOpacity={0.8}
      >
        <X size={24} color={Colors.onSurface} />
      </TouchableOpacity>

      {/* Radar + Center Pin */}
      <View style={styles.radarContainer}>
        <RadarAnimation size={256} color={Colors.secondaryContainer} />
        <View style={styles.centerPinContainer}>
          <ProviderMarker isActive showPin size={32} />
        </View>
      </View>

      {/* Scattered Provider Markers */}
      <View style={[styles.scatteredMarker, { top: '20%', left: '30%' }]}>
        <ProviderMarker size={28} />
      </View>
      <View style={[styles.scatteredMarker, { top: '70%', left: '20%' }]}>
        <ProviderMarker size={28} />
      </View>
      <View style={[styles.scatteredMarker, { top: '40%', right: '25%' }]}>
        <ProviderMarker size={28} />
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Handle */}
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.sheetContent}>
          {/* Text */}
          <Text style={styles.searchingTitle}>
            Recherche d'un prestataire à proximité...
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          {/* Cancel */}
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation && navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>ANNULER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mapNavy,
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.8,
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
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
  closeButton: {
    position: 'absolute',
    top: 52,
    left: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
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
  radarContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -128,
    marginTop: -180,
    width: 256,
    height: 256,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerPinContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 20,
  },
  scatteredMarker: {
    position: 'absolute',
    zIndex: 5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceContainerHighest,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 32,
    paddingHorizontal: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.surfaceContainerHigh,
    zIndex: 30,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
  },
  sheetContent: {
    alignItems: 'center',
    gap: 24,
    marginTop: 16,
  },
  searchingTitle: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.surfaceContainerLow,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.secondaryContainer,
  },
  cancelBtn: {
    marginTop: 8,
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
});

export default SearchingRadarScreen;
