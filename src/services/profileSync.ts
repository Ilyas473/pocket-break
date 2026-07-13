import { CognitiveProfile } from '../store/useStore';

export interface SyncableProfile {
  userId: string;
  createdAt: number;
  lastUpdated: number;
  cognitiveProfile: CognitiveProfile;
}

class ProfileSyncService {
  private profiles: Map<string, SyncableProfile> = new Map();

  async saveProfile(userId: string, profile: CognitiveProfile): Promise<boolean> {
    try {
      const syncable: SyncableProfile = {
        userId,
        createdAt: this.profiles.get(userId)?.createdAt ?? Date.now(),
        lastUpdated: Date.now(),
        cognitiveProfile: profile,
      };

      this.profiles.set(userId, syncable);
      return true;
    } catch (error) {
      console.error('Failed to save profile:', error);
      return false;
    }
  }

  async loadProfile(userId: string): Promise<SyncableProfile | null> {
    try {
      const cached = this.profiles.get(userId);
      if (cached) return cached;
      return null;
    } catch (error) {
      console.error('Failed to load profile:', error);
      return null;
    }
  }

  async syncToBackend(userId: string, profile: CognitiveProfile): Promise<boolean> {
    try {
      console.log('Backend sync simulated for user:', userId);
      return true;
    } catch (error) {
      console.error('Failed to sync to backend:', error);
      return false;
    }
  }

  clearProfile(userId: string): boolean {
    try {
      this.profiles.delete(userId);
      return true;
    } catch (error) {
      console.error('Failed to clear profile:', error);
      return false;
    }
  }
}

export const profileSyncService = new ProfileSyncService();
