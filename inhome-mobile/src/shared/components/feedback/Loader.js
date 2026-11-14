// File: src/shared/components/feedback/Loader.js
import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../core/theme';

export const Loader = ({ message, size = 'large', style }) => {
  const { theme, tokens } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={theme.accent} />
      {message ? (
        <Text
          style={[
            styles.message,
            {
              color: theme.textSecondary,
              marginTop: tokens.Spacing.md,
              fontSize: tokens.Typography.fontSize.sm,
            },
          ]}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
  },
});

export default Loader;
