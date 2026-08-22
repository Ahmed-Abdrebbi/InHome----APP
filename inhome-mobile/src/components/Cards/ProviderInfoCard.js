// File: src/components/Cards/ProviderInfoCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, MapPin, ChevronRight } from 'lucide-react-native';
import Colors from '../../theme/colors';

/**
 * Provider information card matching the Stitch "Confirmation de rénovation" screen.
 * Shows address, job scope, pricing tier — rounded card with glassmorphism backdrop.
 */
const ProviderInfoCard = ({
  address = 'Av. Marrakech',
  addressLabel = "Adresse d'intervention",
  jobTitle = 'Rénovation salle de bain',
  jobEstimate = '~2 jours estimés',
  onEditPress,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      {/* Address Row */}
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <MapPin size={20} color={Colors.primary} />
        </View>
        <View style={styles.rowContent}>
          <Text style={styles.labelText}>{addressLabel}</Text>
          <Text style={styles.valueText}>{address}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Job Scope Row */}
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Star size={20} color={Colors.primary} />
        </View>
        <View style={styles.rowContent}>
          <Text style={styles.valueText} numberOfLines={1}>
            {jobTitle}
          </Text>
          <Text style={styles.labelText}>{jobEstimate}</Text>
        </View>
        {onEditPress && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={onEditPress}
            activeOpacity={0.7}
          >
            <ChevronRight size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: `${Colors.surfaceContainerHigh}E6`, // 90% opacity for glassmorphism
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 16,
    gap: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
    gap: 2,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    lineHeight: 16,
    color: Colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: Colors.onBackground,
  },
  divider: {
    height: 1,
    backgroundColor: `${Colors.outlineVariant}80`,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProviderInfoCard;
