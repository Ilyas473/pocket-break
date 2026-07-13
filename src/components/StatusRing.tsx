import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../config/theme';

interface StatusRingProps {
  label: string;
  value: number;
  color?: string;
}

export const StatusRing: React.FC<StatusRingProps> = ({
  label,
  value,
  color = Theme.colors.primaryTeal,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        <View
          style={[
            styles.circle,
            {
              borderColor: '#E2E8F0',
              borderWidth: 4,
            },
          ]}
        />
        <View style={[styles.circle, { borderColor: color, borderWidth: 4, opacity: value / 100 }]} />
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
  },
  ringContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    position: 'absolute',
  },
  content: {
    alignItems: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.textDark,
  },
  label: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '500',
  },
});
