// File: src/shared/components/feedback/EmptyState.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';
import { t } from '../../../core/i18n';

export const EmptyState = ({ message, subtitle, icon: IconComponent = Inbox, action, style }) => {
  const { theme, tokens } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconWrap, { backgroundColor: theme.surface }]}>
        <IconComponent size={36} color={theme.textSecondary} />
      </View>
      <Text
        style={[
          styles.message,
          {
            color: theme.textPrimary,
            marginTop: tokens.Spacing.md,
            fontSize: tokens.Typography.fontSize.md,
          },
        ]}
      >
        {message || t('common.empty')}
      </Text>
      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.textSecondary,
              marginTop: tokens.Spacing.xs,
              fontSize: tokens.Typography.fontSize.sm,
            },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
      {action ? <View style={{ marginTop: tokens.Spacing.lg }}>{action}</View> : null}
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
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitle: {
    textAlign: 'center',
  },
});

export default EmptyState;
