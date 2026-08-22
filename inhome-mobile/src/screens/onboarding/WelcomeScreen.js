// File: src/screens/onboarding/WelcomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Home } from 'lucide-react-native';
import Colors from '../../theme/colors';
import PrimaryButton from '../../components/UI/PrimaryButton';

const { width } = Dimensions.get('window');

/**
 * Welcome / Onboarding slide matching the Stitch "InHome Onboarding Slide" screen.
 * Features:
 *  - Script headline in secondaryContainer color
 *  - Subtitle copy
 *  - InHome branding at bottom with home icon
 *  - Pagination dots (1 of 3)
 *  - "Continuer" CTA button
 */
const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryContainer} />

      {/* Background texture overlay */}
      <View style={styles.bgOverlay} />

      {/* Main content */}
      <View style={styles.mainContent}>
        <View style={styles.textContainer}>
          <Text style={styles.headline}>
            Le bon prestataire,{'\n'}près de chez vous.
          </Text>
          <Text style={styles.subtitle}>
            Trouvez l'expert idéal en un clin d'œil pour tous vos besoins à domicile.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Branding */}
        <View style={styles.brandingContainer}>
          <Home size={32} color={Colors.secondaryContainer} />
          <Text style={styles.brandName}>InHome</Text>
        </View>

        {/* Pagination dots */}
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* CTA Button */}
        <PrimaryButton
          title="Continuer"
          onPress={() => navigation && navigation.navigate('LocationPermission')}
          style={styles.ctaButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryContainer,
    paddingHorizontal: 20,
  },
  bgOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  textContainer: {
    alignItems: 'center',
    gap: 24,
    maxWidth: 360,
  },
  headline: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700',
    color: Colors.secondaryContainer,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
    gap: 24,
    zIndex: 10,
  },
  brandingContainer: {
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    letterSpacing: -0.64,
    color: Colors.onSurface,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceVariant,
  },
  dotActive: {
    width: 48,
    backgroundColor: Colors.onSurface,
  },
  ctaButton: {
    width: '100%',
    maxWidth: 320,
    minHeight: 56,
    borderRadius: 9999,
    marginTop: 16,
    backgroundColor: Colors.secondaryContainer,
  },
});

export default WelcomeScreen;
