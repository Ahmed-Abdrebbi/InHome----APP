// File: src/components/UI/PrimaryButton.js
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../theme/colors';

/**
 * The main CTA button — tomato-red (#EB431C) background, dark text.
 * Matches the Stitch design "Trouver un prestataire" / "Activer la localisation" buttons.
 */
const PrimaryButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'filled', // 'filled' | 'outline' | 'ghost'
  style,
  textStyle,
  icon,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const getContainerStyle = () => {
    switch (variant) {
      case 'outline':
        return [
          styles.base,
          styles.outline,
          disabled && styles.disabledOutline,
        ];
      case 'ghost':
        return [styles.base, styles.ghost];
      case 'filled':
      default:
        return [
          styles.base,
          styles.filled,
          disabled && styles.disabledFilled,
        ];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return [styles.textBase, styles.textOutline];
      case 'ghost':
        return [styles.textBase, styles.textGhost];
      case 'filled':
      default:
        return [styles.textBase, styles.textFilled];
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[...getContainerStyle(), style]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'filled' ? Colors.background : Colors.accent}
            size="small"
          />
        ) : (
          <>
            {icon && icon}
            <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
  },
  filled: {
    backgroundColor: Colors.accent,
  },
  disabledFilled: {
    backgroundColor: Colors.surfaceContainerHigh,
    opacity: 0.5,
  },
  outline: {
    backgroundColor: Colors.transparent,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  disabledOutline: {
    borderColor: Colors.outlineVariant,
    opacity: 0.5,
  },
  ghost: {
    backgroundColor: Colors.transparent,
  },
  textBase: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  textFilled: {
    color: Colors.background,
    fontWeight: '700',
  },
  textOutline: {
    color: Colors.accent,
    fontWeight: '600',
  },
  textGhost: {
    color: Colors.onBackground,
    fontWeight: '400',
  },
});

export default PrimaryButton;
