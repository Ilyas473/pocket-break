import { create } from 'zustand';

export interface SnackItem {
  id: string;
  name: string;
  category: 'Protein' | 'Fruit' | 'Trail Mix' | 'Water' | 'Sparkling Water' | 'Dark Chocolate';
  calories: number;
  protein: number;
  sugar: number;
  benefit: string;
  shelfCode: string;
  targetGameCategory: 'Memory' | 'Executive' | 'Attention' | 'Speed' | 'Logic' | 'Reaction';
}

export interface CognitiveProfile {
  workingMemory: number;
  attention: number;
  processingSpeed: number;
  reactionTime: number;
  executiveFunction: number;
}

interface HardwareState {
  isMachineConnected: boolean;
  connectedMachineId: string | null;
  ledMessage: string;
  isDispensing: boolean;
}

export type GameState = 'idle' | 'connecting' | 'snackSelected' | 'gameActive' | 'dispensing' | 'completed';

interface AppState {
  inventory: SnackItem[];
  selectedSnack: SnackItem | null;
  gameState: GameState;
  cognitiveProfile: CognitiveProfile;
  streakCount: number;
  hardware: HardwareState;

  connectToMachine: (machineId: string) => void;
  selectSnackDirectly: (shelfCode: string) => void;
  setGameState: (state: GameState) => void;
  submitGameMetrics: (category: keyof CognitiveProfile, accuracy: number, speedMs: number) => void;
  triggerDispenseComplete: () => void;
  resetSession: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  inventory: [
    {
      id: 's1',
      name: 'Almond Crunch Crisp',
      category: 'Trail Mix',
      calories: 140,
      protein: 7,
      sugar: 3,
      benefit: 'Working Memory Boost',
      shelfCode: 'A1',
      targetGameCategory: 'Memory',
    },
    {
      id: 's2',
      name: 'Pure Greek Berry Melt',
      category: 'Protein',
      calories: 110,
      protein: 14,
      sugar: 4,
      benefit: 'Cognitive Flexibility',
      shelfCode: 'A2',
      targetGameCategory: 'Executive',
    },
    {
      id: 's3',
      name: 'Electro Spark Hydrator',
      category: 'Sparkling Water',
      calories: 0,
      protein: 0,
      sugar: 0,
      benefit: 'Attention Refueling',
      shelfCode: 'B1',
      targetGameCategory: 'Attention',
    },
    {
      id: 's4',
      name: '72% Cacao Mental Shield',
      category: 'Dark Chocolate',
      calories: 135,
      protein: 3,
      sugar: 5,
      benefit: 'Stress Mitigation',
      shelfCode: 'B2',
      targetGameCategory: 'Reaction',
    },
  ],
  selectedSnack: null,
  gameState: 'idle',
  streakCount: 5,
  cognitiveProfile: {
    workingMemory: 72,
    attention: 68,
    processingSpeed: 80,
    reactionTime: 75,
    executiveFunction: 64,
  },
  hardware: {
    isMachineConnected: false,
    connectedMachineId: null,
    ledMessage: 'SCAN QR TO START',
    isDispensing: false,
  },

  connectToMachine: (machineId) =>
    set((state) => ({
      hardware: {
        ...state.hardware,
        isMachineConnected: true,
        connectedMachineId: machineId,
        ledMessage: 'WELCOME - SELECT SNACK',
      },
      gameState: 'idle',
    })),

  selectSnackDirectly: (shelfCode) => {
    const item = get().inventory.find((i) => i.shelfCode === shelfCode);
    if (!item) return;

    set((state) => ({
      selectedSnack: item,
      gameState: 'snackSelected',
      hardware: {
        ...state.hardware,
        ledMessage: `${item.shelfCode} SELECTED - PREPARING PUZZLE`,
      },
    }));
  },

  setGameState: (state) => set({ gameState: state }),

  submitGameMetrics: (category, accuracy, speedMs) =>
    set((state) => {
      const performanceDelta = Math.round(accuracy * 0.6 + (1000 / Math.max(speedMs, 200)) * 40);
      const currentScore = state.cognitiveProfile[category];
      const optimizedScore = Math.min(100, Math.max(10, Math.round(currentScore * 0.85 + performanceDelta * 0.15)));

      return {
        gameState: 'dispensing',
        cognitiveProfile: {
          ...state.cognitiveProfile,
          [category]: optimizedScore,
        },
        streakCount: state.streakCount + 1,
        hardware: {
          ...state.hardware,
          isDispensing: true,
          ledMessage: 'DISPENSING SNACK...',
        },
      };
    }),

  triggerDispenseComplete: () =>
    set((state) => ({
      gameState: 'completed',
      hardware: {
        ...state.hardware,
        isDispensing: false,
        ledMessage: 'THANK YOU - ENJOY!',
      },
    })),

  resetSession: () =>
    set((state) => ({
      selectedSnack: null,
      gameState: 'idle',
      hardware: {
        ...state.hardware,
        ledMessage: 'READY - CHOOSE SNACK',
      },
    })),
}));
