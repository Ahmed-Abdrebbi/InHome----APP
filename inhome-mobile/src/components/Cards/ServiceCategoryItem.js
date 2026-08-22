// File: src/components/Cards/ServiceCategoryItem.js
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

/**
 * Service category pill/card shown on the home screen.
 * Matches the Stitch "Accueil Client" screen service category items:
 *  - Dark card with icon + label
 *  - Rounded corners, subtle border
 *  - Active state with orange accent border
 */
const ServiceCategoryItem = ({
  icon,
  label,
  isSelected = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          isSelected && styles.iconContainerSelected,
        ]}
      >
        {icon}
      </View>
      <Text
        style={[styles.label, isSelected && styles.labelSelected]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surfaceContainer,
  },
  containerSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accentSubtle,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {},
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: Colors.onSurface,
    lineHeight: 16,
  },
  labelSelected: {
    color: Colors.onSurface,
  },
});

export default ServiceCategoryItem;
