import { useCallback } from 'react';
import { CognitiveProfile } from '../store/useStore';
import { useGameMetrics } from './useGameMetrics';

export const useCognitiveAdaptivity = () => {
  const { calculatePerformanceDelta, calculateAdaptiveScore } = useGameMetrics();

  const adaptProfile = useCallback(
    (
      profile: CognitiveProfile,
      category: keyof CognitiveProfile,
      accuracy: number,
      speedMs: number
    ): CognitiveProfile => {
      const performanceDelta = calculatePerformanceDelta(accuracy, speedMs);
      const currentScore = profile[category];
      const adaptedScore = calculateAdaptiveScore(currentScore, performanceDelta);

      return {
        ...profile,
        [category]: adaptedScore,
      };
    },
    [calculatePerformanceDelta, calculateAdaptiveScore]
  );

  return {
    adaptProfile,
  };
};
