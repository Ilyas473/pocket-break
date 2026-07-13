import { useCallback } from 'react';

export interface GameMetricsPayload {
  accuracy: number;
  speedMs: number;
}

export const useGameMetrics = () => {
  const calculatePerformanceDelta = useCallback((accuracy: number, speedMs: number): number => {
    const normalizedSpeed = Math.max(speedMs, 200);
    const speedBonus = (1000 / normalizedSpeed) * 40;
    const accuracyScore = accuracy * 0.6;
    return Math.round(accuracyScore + speedBonus);
  }, []);

  const calculateAdaptiveScore = useCallback(
    (currentScore: number, performanceDelta: number): number => {
      const newScore = currentScore * 0.85 + performanceDelta * 0.15;
      return Math.min(100, Math.max(10, Math.round(newScore)));
    },
    []
  );

  return {
    calculatePerformanceDelta,
    calculateAdaptiveScore,
  };
};
