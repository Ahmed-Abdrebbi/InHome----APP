// File: src/features/onboarding/screens/WelcomeScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Home } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { ROUTES } from '../../../app/navigation/routes';

const WelcomeScreen = ({ navigation }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />

      {/* Main content */}
      <View style={styles.mainContent}>
        <View style={styles.brandingBadge}>
          <Home size={38} color={theme.accent} />
          <Text style={[styles.brandName, { color: theme.textPrimary }]}>InHome</Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.headline, { color: theme.accent }]}>
            Le bon artisan,{'\n'}près de chez vous.
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Trouvez l'expert idéal au Maroc en un clin d'œil : plomberie, électricité, peinture, climatisation et plus.
          </Text>
        </View>
      </View>

      {/* Footer & Navigation CTA */}
      <View style={styles.footer}>
        {/* Pagination indicators */}
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.dotActive, { backgroundColor: theme.accent }]} />
          <View style={[styles.dot, { backgroundColor: theme.borderSubtle }]} />
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: theme.accent }]}
          onPress={() => navigation && navigation.navigate(ROUTES.LOCATION_PERMISSION)}
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
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  footer: {
    gap: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  nextButton: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default WelcomeScreen;
