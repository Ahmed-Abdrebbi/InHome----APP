// File: src/shared/components/ui/ScreenHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../../core/theme';

export const ScreenHeader = ({
  title,
  subtitle,
  onBack,
  showBack = true,
  rightAction,
  style,
}) => {
  const navigation = useNavigation();
  const { theme, tokens } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: theme.borderSubtle || theme.border,
          paddingHorizontal: tokens.Spacing.lg,
          paddingVertical: tokens.Spacing.md,
        },
        style,
      ]}
    >
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={[styles.backBtn, { backgroundColor: theme.surface }]}
          >
            <ArrowLeft size={20} color={theme.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: theme.textPrimary, fontSize: tokens.Typography.fontSize.lg }]}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={[styles.subtitle, { color: theme.textSecondary, fontSize: tokens.Typography.fontSize.sm }]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>{rightAction || null}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    minHeight: 56,
  },
  left: {
    width: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    textAlign: 'center',
  },
  right: {
    width: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default ScreenHeader;
