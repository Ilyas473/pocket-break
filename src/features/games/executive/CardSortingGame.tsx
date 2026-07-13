import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Theme } from '../../../config/theme';

interface CardItem {
  id: string;
  color: string;
  shape: '▲' | '■' | '●';
  count: number;
}

export const CardSortingGame: React.FC<{ onComplete: (accuracy: number, speedMs: number) => void }> = ({
  onComplete,
}) => {
  const rules: Array<'color' | 'shape' | 'count'> = ['color', 'shape', 'count'];
  const [currentRule, setCurrentRule] = useState<'color' | 'shape' | 'count'>('color');
  const [currentCard, setCurrentCard] = useState<CardItem>({
    id: '1',
    color: '#EF4444',
    shape: '▲',
    count: 3,
  });
  const [trialsCompleted, setTrialsCompleted] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startTime] = useState(Date.now());

  const targetBins: CardItem[] = [
    { id: 'b1', color: '#EF4444', shape: '▲', count: 1 },
    { id: 'b2', color: '#3B82F6', shape: '■', count: 2 },
    { id: 'b3', color: '#22C55E', shape: '●', count: 3 },
  ];

  useEffect(() => {
    if (trialsCompleted > 0 && trialsCompleted % 3 === 0) {
      const nextRule = rules[(rules.indexOf(currentRule) + 1) % rules.length];
      setCurrentRule(nextRule);
    }
  }, [trialsCompleted]);

  const generateRandomCard = (): CardItem => {
    const colors = ['#EF4444', '#3B82F6', '#22C55E'];
    const shapes: Array<'▲' | '■' | '●'> = ['▲', '■', '●'];
    const counts = [1, 2, 3];
    return {
      id: Math.random().toString(),
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      count: counts[Math.floor(Math.random() * counts.length)],
    };
  };

  const handleBinSelection = (bin: CardItem) => {
    let isCorrect = false;
    if (currentRule === 'color') isCorrect = bin.color === currentCard.color;
    if (currentRule === 'shape') isCorrect = bin.shape === currentCard.shape;
    if (currentRule === 'count') isCorrect = bin.count === currentCard.count;

    if (isCorrect) setCorrectCount((prev) => prev + 1);

    const nextTrial = trialsCompleted + 1;
    setTrialsCompleted(nextTrial);

    if (nextTrial >= 9) {
      const duration = Date.now() - startTime;
      const totalAccuracy = Math.round((correctCount / nextTrial) * 100);
      onComplete(totalAccuracy, Math.round(duration / nextTrial));
    } else {
      setCurrentCard(generateRandomCard());
    }
  };

  return (
    <View style={styles.cardPuzzleContainer}>
      <Text style={styles.ruleIndicatorText}>SORT BY: {currentRule.toUpperCase()}</Text>

      <View style={[styles.mainCardDisplay, { borderColor: currentCard.color }]}>
        <Text style={[styles.cardGlyphText, { color: currentCard.color }]}>
          {Array(currentCard.count).fill(currentCard.shape).join(' ')}
        </Text>
      </View>

      <View style={styles.destinationBinRow}>
        {targetBins.map((bin) => (
          <TouchableOpacity key={bin.id} style={styles.binTriggerNode} onPress={() => handleBinSelection(bin)}>
            <Text style={[styles.binGlyph, { color: bin.color }]}>
              {Array(bin.count).fill(bin.shape).join(' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.progressText}>
        {trialsCompleted}/9 • Correct: {correctCount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardPuzzleContainer: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  ruleIndicatorText: {
    fontSize: 14,
    fontWeight: '800',
    color: Theme.colors.primaryTeal,
    letterSpacing: 1.2,
    marginBottom: Theme.spacing.lg,
  },
  mainCardDisplay: {
    width: 140,
    height: 180,
    borderWidth: 4,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    marginBottom: Theme.spacing.xl,
  },
  cardGlyphText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  destinationBinRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  binTriggerNode: {
    flex: 1,
    height: 70,
    backgroundColor: '#F1F5F9',
    borderRadius: Theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  binGlyph: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressText: {
    marginTop: Theme.spacing.md,
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
});
