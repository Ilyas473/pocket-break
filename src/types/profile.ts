export interface CognitiveProfile {
  workingMemory: number;
  attention: number;
  processingSpeed: number;
  reactionTime: number;
  executiveFunction: number;
}

export interface UserProfile {
  userId: string;
  createdAt: number;
  lastUpdated: number;
  cognitiveProfile: CognitiveProfile;
  streakCount: number;
}
