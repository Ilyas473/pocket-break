export interface GameResult {
  accuracy: number;
  speedMs: number;
  category: 'Memory' | 'Executive' | 'Attention' | 'Speed' | 'Logic' | 'Reaction';
  trialCount: number;
  timestamp: number;
}

export interface CardSortingCard {
  id: string;
  color: string;
  shape: '▲' | '■' | '●';
  count: number;
}

export interface GameMetrics {
  correctAttempts: number;
  totalAttempts: number;
  averageResponseTime: number;
  accuracy: number;
}
