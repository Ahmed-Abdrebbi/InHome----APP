// File: src/shared/components/feedback/ErrorState.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';

export const ErrorState = ({ message, onRetry, style }) => {
  const { theme, tokens } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.danger + '20' }]}>
        <AlertCircle size={32} color={theme.danger} />
      </View>
      <Text
        style={[
          styles.message,
          {
            color: theme.textPrimary,
            marginTop: tokens.Spacing.md,
            fontSize: tokens.Typography.fontSize.base,
          },
        ]}
      >
        {message || t('common.error')}
      </Text>
      {onRetry ? (
        <TouchableOpacity
          onPress={onRetry}
          style={[
            styles.retryBtn,
            {
              backgroundColor: theme.surfaceElevated,
              borderColor: theme.border,
              marginTop: tokens.Spacing.lg,
              paddingVertical: tokens.Spacing.sm,
              paddingHorizontal: tokens.Spacing.lg,
              borderRadius: tokens.Radius.md,
            },
          ]}
        >
          <RefreshCw size={16} color={theme.textPrimary} style={{ marginRight: 8 }} />
          <Text style={{ color: theme.textPrimary, fontWeight: '600' }}>
            {t('common.retry')}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    fontWeight: '500',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});

export default ErrorState;
