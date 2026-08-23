// File: src/components/Map/CustomMapView.web.js
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';

export const Callout = ({ children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.webCallout}>
      {children}
    </TouchableOpacity>
  );
};

export const Marker = ({ coordinate, title, description, children, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.webMarkerWrapper}>
      {children}
    </TouchableOpacity>
  );
};

const CustomMapView = forwardRef(
  ({ style, initialRegion, children }, ref) => {
    const [region, setRegion] = useState(
      initialRegion || {
        latitude: 32.5000,
        longitude: -6.6833,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      }
    );

    useImperativeHandle(ref, () => ({
      animateToRegion: (newRegion) => {
        setRegion(newRegion);
      },
    }));

    // Calculate marker positions relative to current region center
    const getMarkerPosition = (coord) => {
      if (!coord) return { left: '50%', top: '50%' };
      const latDiff = (region.latitude - coord.latitude) / (region.latitudeDelta || 0.04);
      const lngDiff = (coord.longitude - region.longitude) / (region.longitudeDelta || 0.04);

      const top = 38 + latDiff * 35;
      const left = 50 + lngDiff * 40;

      return {
        top: `${Math.max(12, Math.min(68, top))}%`,
        left: `${Math.max(8, Math.min(92, left))}%`,
      };
    };

    return (
      <View style={[styles.container, style]}>
        {/* Dark Map Tiles / Texture Simulation */}
        <View style={styles.mapBackground}>
          {/* Subtle Grid Roads */}
          {Array.from({ length: 30 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.roadH, { top: i * 36 }]} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.roadV, { left: i * 36 }]} />
          ))}

          {/* Region City Label Badge */}
          <View style={styles.regionBadge}>
            <Text style={styles.regionBadgeText}>
              Zone: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
            </Text>
          </View>
        </View>

        {/* Render child markers */}
        {React.Children.map(children, (child, idx) => {
          if (!child || !child.props) return null;
          const { coordinate } = child.props;
          const pos = getMarkerPosition(coordinate);

          return (
            <View
              key={child.key || idx}
              style={[
                styles.markerPositioner,
                { top: pos.top, left: pos.left },
              ]}
            >
              {child}
            </View>
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#12161F',
    overflow: 'hidden',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#151922',
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  regionBadge: {
    position: 'absolute',
    top: 56,
    right: 20,
    backgroundColor: 'rgba(24, 24, 24, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333333',
    zIndex: 10,
  },
  regionBadgeText: {
    fontSize: 11,
    color: '#8A92A6',
    fontWeight: '600',
  },
  markerPositioner: {
    position: 'absolute',
    transform: [{ translateX: -18 }, { translateY: -36 }],
    zIndex: 5,
  },
  webMarkerWrapper: {
    alignItems: 'center',
  },
  webCallout: {
    position: 'absolute',
    bottom: 42,
    alignSelf: 'center',
    zIndex: 10,
  },
});

export default CustomMapView;
