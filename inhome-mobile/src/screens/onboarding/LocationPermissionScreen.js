// File: src/screens/onboarding/LocationPermissionScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MapPin } from 'lucide-react-native';
import Colors from '../../theme/colors';
import PrimaryButton from '../../components/UI/PrimaryButton';

const { width } = Dimensions.get('window');

/**
 * Location Permission screen matching the Stitch "Autoriser la localisation" design.
 * Center illustration, bold headline, subtitle, two CTA buttons (primary + ghost).
 */
const LocationPermissionScreen = ({ navigation }) => {
  const handleEnableLocation = async () => {
    if (navigation) {
      navigation.replace('MapHome');
    }
  };

  const handleSkip = () => {
    if (navigation) {
      navigation.replace('MapHome');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <View style={styles.mainContent}>
        <View style={styles.centerContent}>
          {/* Illustration placeholder */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustrationInner}>
              <MapPin size={80} color={Colors.secondaryContainer} />
            </View>
          </View>

          {/* Typography */}
          <View style={styles.textContainer}>
            <Text style={styles.headline}>
              Autoriser l'accès à votre position
            </Text>
            <Text style={styles.subtitle}>
              Cela permet aux prestataires les plus proches de recevoir votre
              demande.
            </Text>
          </View>
        </View>

        {/* Bottom actions */}
        <View style={styles.bottomActions}>
          <PrimaryButton
            title="Activer la localisation"
            onPress={handleEnableLocation}
            style={styles.primaryBtn}
          />
          <PrimaryButton
            title="Plus tard"
            onPress={handleSkip}
            variant="ghost"
            style={styles.ghostBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  illustrationContainer: {
    width: width * 0.65,
    height: width * 0.65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  illustrationInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  textContainer: {
    alignItems: 'center',
    gap: 16,
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    color: Colors.onBackground,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 28,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  bottomActions: {
    gap: 8,
    paddingTop: 24,
  },
  primaryBtn: {
    borderRadius: 9999,
    backgroundColor: Colors.secondaryContainer,
  },
  ghostBtn: {
    borderRadius: 9999,
  },
});

export default LocationPermissionScreen;
