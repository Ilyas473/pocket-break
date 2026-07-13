import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Theme } from '../../../config/theme';

const { width } = Dimensions.get('window');

export const DistractorGame: React.FC<{ onComplete: (accuracy: number, speedMs: number) => void }> = ({
  onComplete,
}) => {
  const targetSymbol = '★';
  const distractors = ['✦', '✶', '🟊', '✴', '✪'];

  const generateGridItems = () => {
    const items = Array(15)
      .fill(null)
      .map(() => distractors[Math.floor(Math.random() * distractors.length)]);
    const targetIndex = Math.floor(Math.random() * 16);
    items.splice(targetIndex, 0, targetSymbol);
    return items;
  };

  const [gridData, setGridData] = useState<string[]>(generateGridItems());
  const [clicks, setClicks] = useState(0);
  const [successHits, setSuccessHits] = useState(0);
  const [timerStart] = useState(Date.now());

  const handleTilePress = (symbol: string) => {
    const isTarget = symbol === targetSymbol;
    if (isTarget) setSuccessHits((prev) => prev + 1);

    const currentClicks = clicks + 1;
    setClicks(currentClicks);

    if (currentClicks >= 5) {
      const elapsed = Date.now() - timerStart;
      onComplete(
        Math.round((successHits / currentClicks) * 100),
        Math.round(elapsed / currentClicks)
      );
    } else {
      setGridData(generateGridItems());
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.promptLabel}>TAP THE TARGET: {targetSymbol}</Text>
      <View style={styles.puzzleMatrixGrid}>
        {gridData.map((sym, index) => (
          <TouchableOpacity key={index} style={styles.matrixTileNode} onPress={() => handleTilePress(sym)}>
            <Text style={styles.tileGlyphBody}>{sym}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.progressText}>
        Round {clicks}/5 • Hits: {successHits}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  promptLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Theme.colors.textDark,
    marginBottom: Theme.spacing.md,
  },
  puzzleMatrixGrid: {
    width: width * 0.82,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  matrixTileNode: {
    width: '22%',
    height: 60,
    backgroundColor: '#F8FAFC',
    borderRadius: Theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tileGlyphBody: {
    fontSize: 22,
    color: Theme.colors.textDark,
  },
  progressText: {
    marginTop: Theme.spacing.md,
    fontSize: 12,
    color: Theme.colors.textMuted,
    fontWeight: '600',
  },
});
