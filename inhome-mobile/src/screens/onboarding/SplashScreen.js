// File: src/screens/onboarding/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import Colors from '../../theme/colors';

const { width } = Dimensions.get('window');

/**
 * InHome Splash Screen — matches the Stitch "InHome Splash Screen" design.
 * Center-aligned logo mark + wordmark "InHome" + decorative accent bar.
 * Fade-in-up animation on mount, auto-navigates after 2.5s.
 */
const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (navigation) {
        navigation.replace('Welcome');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryContainer} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Logo Mark Container */}
        <View style={styles.logoContainer}>
          <View style={styles.logoInner}>
            <Text style={styles.logoEmoji}>🏠</Text>
          </View>
        </View>

        {/* Wordmark */}
        <Text style={styles.wordmark}>InHome</Text>

        {/* Decorative accent bar */}
        <View style={styles.accentBar} />
      </Animated.View>

      {/* Home indicator area */}
      <View style={styles.homeIndicator}>
        <View style={styles.homeBar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryContainer,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  logoInner: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 40,
  },
  wordmark: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.64,
    color: Colors.onBackground,
  },
  accentBar: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.secondaryContainer,
    marginTop: 24,
  },
  homeIndicator: {
    width: '100%',
    height: 32,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  homeBar: {
    width: 128,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceVariant,
    opacity: 0.5,
  },
});

export default SplashScreen;
