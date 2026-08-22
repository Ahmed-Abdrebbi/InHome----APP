// File: src/components/Map/RadarAnimation.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import Colors from '../../theme/colors';

/**
 * Radar pulse animation matching the Stitch "Recherche de prestataire (Animé)" screen.
 * Three concentric pulsing rings that scale outward and fade, staggered by 0.8s.
 */
const RadarAnimation = ({ size = 240, color = Colors.secondaryContainer }) => {
  const rings = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const createPulse = (animValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2500,
            easing: Easing.bezier(0.215, 0.61, 0.355, 1),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animations = [
      createPulse(rings[0], 0),
      createPulse(rings[1], 800),
      createPulse(rings[2], 1600),
    ];

    animations.forEach((anim) => anim.start());

    return () => animations.forEach((anim) => anim.stop());
  }, []);

  const renderRing = (animValue, index) => {
    const scale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 4],
    });

    const opacity = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6 - index * 0.2, 0],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.ring,
          {
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: (size * 0.4) / 2,
            borderColor: color,
            transform: [{ scale }],
            opacity,
          },
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {rings.map((ring, i) => renderRing(ring, i))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
});

export default RadarAnimation;
