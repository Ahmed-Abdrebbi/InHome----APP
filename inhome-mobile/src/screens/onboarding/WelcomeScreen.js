// File: src/screens/onboarding/WelcomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Home } from 'lucide-react-native';
import Colors from '../../theme/colors';

/**
 * WelcomeScreen UI
 * First slide in the onboarding flow featuring Stitch dark theme & #FF6B00 accents.
 */
const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#212121" />

      {/* Main content */}
      <View style={styles.mainContent}>
        <View style={styles.brandingBadge}>
          <Home size={36} color="#FF6B00" />
          <Text style={styles.brandName}>InHome</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.headline}>
            Le bon prestataire,{'\n'}près de chez vous.
          </Text>
          <Text style={styles.subtitle}>
            Trouvez l'expert idéal en un clin d'œil pour tous vos travaux et interventions à domicile.
          </Text>
        </View>
      </View>

      {/* Footer & Navigation CTA */}
      <View style={styles.footer}>
        {/* Pagination indicators */}
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => navigation && navigation.navigate('LocationPermission')}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  brandingBadge: {
    alignItems: 'center',
    gap: 12,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  textContainer: {
    alignItems: 'center',
    gap: 16,
    maxWidth: 340,
  },
  headline: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: '#FF6B00',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: '#B0B0B0',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 24,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#424242',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#FF6B00',
  },
  nextButton: {
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
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default WelcomeScreen;
