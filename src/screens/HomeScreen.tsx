import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { Theme } from '../../config/theme';
import { useStore } from '../../store/useStore';
import { Button } from '../../components/Button';
import { GlassCard } from '../../components/GlassCard';
import { StatusRing } from '../../components/StatusRing';
import { InteractiveVendingMachine } from '../vending/InteractiveVendingMachine';
import { CardSortingGame } from '../games/executive/CardSortingGame';
import { DistractorGame } from '../games/attention/DistractorGame';

export const HomeScreen: React.FC = () => {
  const { cognitiveProfile, gameState, selectedSnack, submitGameMetrics, triggerDispenseComplete, resetSession } =
    useStore();
  const [showGame, setShowGame] = useState(false);
  const [gameType, setGameType] = useState<'cardSort' | 'distractor' | null>(null);

  const handleGameComplete = (accuracy: number, speedMs: number) => {
    if (selectedSnack) {
      submitGameMetrics(selectedSnack.targetGameCategory, accuracy, speedMs);
      setShowGame(false);
      setGameType(null);
    }
  };

  const handleDispenseComplete = () => {
    triggerDispenseComplete();
    setTimeout(() => {
      resetSession();
    }, 3000);
  };

  if (showGame && gameType === 'cardSort') {
    return (
      <SafeAreaView style={styles.gameContainer}>
        <CardSortingGame onComplete={handleGameComplete} />
      </SafeAreaView>
    );
  }

  if (showGame && gameType === 'distractor') {
    return (
      <SafeAreaView style={styles.gameContainer}>
        <DistractorGame onComplete={handleGameComplete} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screenRoot}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBanner}>
          <Text style={styles.titleText}>POCKET BREAK</Text>
          <Text style={styles.subtitleText}>Smart Cognitive Vending</Text>
        </View>

        <View style={styles.vendingSection}>
          <InteractiveVendingMachine />
        </View>

        {gameState === 'snackSelected' && selectedSnack && (
          <GlassCard style={styles.gamePromptCard}>
            <Text style={styles.gamePromptTitle}>Complete a cognitive challenge</Text>
            <Text style={styles.gamePromptSubtitle}>
              Master the puzzle to unlock {selectedSnack.name}
            </Text>
            <View style={styles.gameButtonGroup}>
              <Button
                label="Card Sorting"
                variant="primary"
                size="md"
                onPress={() => {
                  setGameType('cardSort');
                  setShowGame(true);
                }}
                style={{ flex: 1 }}
              />
              <Button
                label="Distractor Game"
                variant="secondary"
                size="md"
                onPress={() => {
                  setGameType('distractor');
                  setShowGame(true);
                }}
                style={{ flex: 1 }}
              />
            </View>
          </GlassCard>
        )}

        {gameState === 'dispensing' && (
          <GlassCard style={styles.dispensingCard}>
            <Text style={styles.dispensingTitle}>Excellent work! 🎉</Text>
            <Text style={styles.dispensingSubtitle}>Your snack is being dispensed...</Text>
            <Button label="Complete" variant="success" size="md" onPress={handleDispenseComplete} />
          </GlassCard>
        )}

        {gameState === 'completed' && (
          <GlassCard style={styles.completedCard}>
            <Text style={styles.completedTitle}>Thank you for playing!</Text>
            <Text style={styles.completedSubtitle}>Your cognitive profile has been updated.</Text>
            <Button label="Return Home" variant="primary" size="md" onPress={resetSession} />
          </GlassCard>
        )}

        <View style={styles.profileSection}>
          <Text style={styles.profileTitle}>Cognitive Profile</Text>
          <View style={styles.profileGrid}>
            <View style={styles.profileItem}>
              <StatusRing label="Memory" value={cognitiveProfile.workingMemory} color={Theme.colors.primaryTeal} />
            </View>
            <View style={styles.profileItem}>
              <StatusRing label="Attention" value={cognitiveProfile.attention} color={Theme.colors.accentBlue} />
            </View>
            <View style={styles.profileItem}>
              <StatusRing label="Speed" value={cognitiveProfile.processingSpeed} color={Theme.colors.successGreen} />
            </View>
            <View style={styles.profileItem}>
              <StatusRing label="Reaction" value={cognitiveProfile.reactionTime} color={Theme.colors.warningYellow} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
  },
  scrollContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.lg,
  },
  headerBanner: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  titleText: {
    fontSize: Theme.typography.fontSize['4xl'],
    fontWeight: '800',
    color: Theme.colors.primaryTeal,
    letterSpacing: 2,
  },
  subtitleText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textMuted,
    marginTop: Theme.spacing.xs,
    fontWeight: '500',
  },
  vendingSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gamePromptCard: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  gamePromptTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.textDark,
  },
  gamePromptSubtitle: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.textMuted,
  },
  gameButtonGroup: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  dispensingCard: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  dispensingTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.successGreen,
  },
  dispensingSubtitle: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.textMuted,
  },
  completedCard: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
    backgroundColor: 'rgba(14, 116, 144, 0.1)',
  },
  completedTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: '700',
    color: Theme.colors.primaryTeal,
  },
  completedSubtitle: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.textMuted,
  },
  gameContainer: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  profileSection: {
    gap: Theme.spacing.md,
  },
  profileTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: '700',
    color: Theme.colors.textDark,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  profileItem: {
    width: '48%',
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
});
