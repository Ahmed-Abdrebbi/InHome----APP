// File: src/shared/components/ui/ScreenContainer.js
import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../core/theme';

export const ScreenContainer = ({ children, style, edges = ['top', 'left', 'right'] }) => {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.container, { backgroundColor: theme.background }, style]}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.background} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenContainer;
