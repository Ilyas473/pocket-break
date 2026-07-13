import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Theme } from '../../config/theme';
import { useStore, SnackItem } from '../../store/useStore';

const { width } = Dimensions.get('window');

export const InteractiveVendingMachine: React.FC = () => {
  const { inventory, selectedSnack, selectSnackDirectly, hardware, gameState } = useStore();

  const ledPulse = useSharedValue(1);
  const coilRotation = useSharedValue(0);
  const snackDropY = useSharedValue(0);

  useEffect(() => {
    ledPulse.value = withRepeat(withTiming(0.6, { duration: 1000 }), -1, true);
  }, []);

  useEffect(() => {
    if (gameState === 'dispensing') {
      coilRotation.value = withTiming(360, { duration: 1800 }, () => {
        snackDropY.value = withSequence(
          withTiming(180, { duration: 600 }),
          withTiming(170, { duration: 150 }),
          withTiming(180, { duration: 100 })
        );
      });
    } else if (gameState === 'idle') {
      coilRotation.value = 0;
      snackDropY.value = 0;
    }
  }, [gameState]);

  const animatedLedStyle = useAnimatedStyle(() => ({ opacity: ledPulse.value }));
  const animatedCoilStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${coilRotation.value}deg` }],
  }));
  const animatedSnackStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: snackDropY.value }],
  }));

  return (
    <View style={styles.outerFrame}>
      <View style={styles.brushedChassis}>
        <View style={styles.glassDisplayViewport}>
          <View style={styles.internalBackdrop}>
            {['A', 'B'].map((rowKey) => (
              <View key={rowKey} style={styles.shelfBarrier}>
                <View style={styles.ledStripLighting} />
                <View style={styles.slotArray}>
                  {inventory
                    .filter((item) => item.shelfCode.startsWith(rowKey))
                    .map((item) => {
                      const isActiveTarget = selectedSnack?.id === item.id;
                      return (
                        <TouchableOpacity
                          key={item.id}
                          activeOpacity={0.85}
                          onPress={() => selectSnackDirectly(item.shelfCode)}
                          style={[
                            styles.snackChamber,
                            isActiveTarget && styles.snackChamberGlow,
                          ]}
                        >
                          <Animated.View
                            style={isActiveTarget && gameState === 'dispensing' ? animatedSnackStyle : null}
                          >
                            <Text style={styles.productArt}>
                              {item.category === 'Water' || item.category === 'Sparkling Water'
                                ? '🥤'
                                : item.category === 'Dark Chocolate'
                                  ? '🍫'
                                  : item.category === 'Protein'
                                    ? '💪'
                                    : '🥜'}
                            </Text>
                          </Animated.View>

                          <Animated.View
                            style={[
                              styles.coilSpringPath,
                              isActiveTarget && gameState !== 'idle' && animatedCoilStyle,
                            ]}
                          >
                            <View style={styles.coilLoopArc} />
                          </Animated.View>

                          <View style={styles.productCodeBadge}>
                            <Text style={styles.productCodeText}>{item.shelfCode}</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </View>
            ))}
          </View>

          <View
            style={[
              styles.dispenserBinFlap,
              gameState === 'dispensing' && styles.dispenserBinFlapIlluminated,
            ]}
          >
            <Text style={styles.binTypography}>PUSH FOR HEALTHY REWARD</Text>
          </View>
        </View>

        <View style={styles.industrialControlTower}>
          <View style={styles.ledWindowBox}>
            <Animated.Text style={[styles.ledMatrixText, animatedLedStyle]}>
              {hardware.ledMessage}
            </Animated.Text>
          </View>

          <View style={styles.keypadMatrixContainer}>
            {['A1', 'A2', 'B1', 'B2'].map((code) => (
              <TouchableOpacity
                key={code}
                style={styles.keypadButtonNode}
                onPress={() => selectSnackDirectly(code)}
              >
                <Text style={styles.keypadNodeLabel}>{code}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.peripheralDock}>
            <View style={styles.nfcSensorArea}>
              <Text style={styles.sensorTypography}>🔳 NFC</Text>
            </View>
            <View style={styles.qrScannerOpticsCamera}>
              <Text style={styles.sensorTypography}>📷</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerFrame: {
    width: width * 0.92,
    height: 520,
    backgroundColor: '#64748B',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.sm,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8,
  },
  brushedChassis: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#94A3B8',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
  },
  glassDisplayViewport: {
    flex: 2.4,
    backgroundColor: '#1E293B',
    padding: Theme.spacing.sm,
    justifyContent: 'space-between',
  },
  internalBackdrop: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: Theme.borderRadius.sm,
    padding: Theme.spacing.xs,
    justifyContent: 'space-around',
  },
  shelfBarrier: {
    borderBottomWidth: 4,
    borderBottomColor: '#475569',
    paddingBottom: Theme.spacing.xs,
  },
  ledStripLighting: {
    height: 2,
    backgroundColor: Theme.colors.accentBlue,
    shadowColor: Theme.colors.accentBlue,
    shadowOpacity: 1,
    shadowRadius: 4,
    marginBottom: Theme.spacing.xs,
  },
  slotArray: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  snackChamber: {
    width: '44%',
    height: 120,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: Theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155',
  },
  snackChamberGlow: {
    borderColor: Theme.colors.accentBlue,
    backgroundColor: 'rgba(14, 116, 144, 0.25)',
    shadowColor: Theme.colors.accentBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  productArt: {
    fontSize: 42,
    zIndex: 10,
  },
  coilSpringPath: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 3,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
    opacity: 0.4,
    zIndex: 5,
  },
  coilLoopArc: {
    flex: 1,
  },
  productCodeBadge: {
    position: 'absolute',
    bottom: 4,
    backgroundColor: '#0F172A',
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: 4,
  },
  productCodeText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: 'bold',
  },
  dispenserBinFlap: {
    height: 65,
    backgroundColor: '#334155',
    borderRadius: Theme.borderRadius.sm,
    marginTop: Theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  dispenserBinFlapIlluminated: {
    backgroundColor: '#1E293B',
    borderColor: Theme.colors.accentBlue,
  },
  binTypography: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  industrialControlTower: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderLeftWidth: 2,
    borderLeftColor: '#334155',
    padding: Theme.spacing.xs,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ledWindowBox: {
    backgroundColor: '#000000',
    width: '100%',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#475569',
  },
  ledMatrixText: {
    color: '#22C55E',
    fontFamily: 'monospace',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  keypadMatrixContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
  },
  keypadButtonNode: {
    width: '42%',
    height: 34,
    backgroundColor: '#475569',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#0F172A',
  },
  keypadNodeLabel: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  peripheralDock: {
    width: '100%',
    gap: 8,
    alignItems: 'center',
  },
  nfcSensorArea: {
    width: '90%',
    height: 35,
    backgroundColor: '#334155',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  sensorTypography: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  qrScannerOpticsCamera: {
    width: '90%',
    height: 35,
    backgroundColor: '#000',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#475569',
  },
});
