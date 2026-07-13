import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Theme } from '../config/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, elevated = false }) => {
  return (
    <View style={[styles.container, elevated && styles.elevated, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    ...Theme.shadows.sm,
  },
  elevated: {
    ...Theme.shadows.lg,
  },
});
