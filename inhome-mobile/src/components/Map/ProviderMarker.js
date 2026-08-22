// File: src/components/Map/ProviderMarker.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Wrench } from 'lucide-react-native';
import Colors from '../../theme/colors';

/**
 * Custom map pin for service providers.
 * Matches the Stitch "Recherche de prestataire" screen markers:
 *  - Dark circular avatar with handyman icon
 *  - Opacity varies based on active state
 *  - Optional pin-point triangle at bottom
 */
const ProviderMarker = ({
  isActive = false,
  size = 32,
  showPin = false,
  iconColor,
}) => {
  const markerSize = isActive ? size * 1.5 : size;
  const bgColor = isActive
    ? Colors.white
    : Colors.surfaceContainerHigh;
  const iColor = iconColor || (isActive ? Colors.primaryContainer : Colors.onSurfaceVariant);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.marker,
          {
            width: markerSize,
            height: markerSize,
            borderRadius: markerSize / 2,
            backgroundColor: bgColor,
            opacity: isActive ? 1 : 0.6,
          },
        ]}
      >
        <Wrench
          size={isActive ? size * 0.6 : size * 0.45}
          color={iColor}
          strokeWidth={2}
        />
      </View>
      {showPin && (
        <>
          <View style={styles.pinPoint} />
          <View style={styles.pinDot} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pinPoint: {
    width: 12,
    height: 12,
    backgroundColor: Colors.white,
    transform: [{ rotate: '45deg' }],
    marginTop: -6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginTop: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ProviderMarker;
