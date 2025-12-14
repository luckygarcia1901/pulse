import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MoodEntry {
  id: string;
  date: string;
  time: string;
  emoji: string;
  moodText: string;
  song: string;
  artist: string;
  artistImage?: string;
  previewUrl?: string;
  description: string;
  timestamp: number;
}

const MOODS_KEY = 'pulse_moods';

export const moodStorage = {
  async getAllMoods(): Promise<MoodEntry[]> {
    try {
      const data = await AsyncStorage.getItem(MOODS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading moods:', error);
      return [];
    }
  },

  async addMood(mood: Omit<MoodEntry, 'id'>): Promise<MoodEntry> {
    try {
      const moods = await this.getAllMoods();
      
      // Remove any existing mood from the same day
      const filteredMoods = moods.filter(m => m.date !== mood.date);
      
      console.log('Moods before:', moods.length);
      console.log('Moods after filtering:', filteredMoods.length);
      console.log('New mood date:', mood.date);
      
      const newMood: MoodEntry = {
        ...mood,
        id: Date.now().toString(),
      };
      const updatedMoods = [newMood, ...filteredMoods];
      await AsyncStorage.setItem(MOODS_KEY, JSON.stringify(updatedMoods));
      return newMood;
    } catch (error) {
      console.error('Error adding mood:', error);
      throw error;
    }
  },

  async updateMood(id: string, updates: Partial<MoodEntry>): Promise<MoodEntry | null> {
    try {
      const moods = await this.getAllMoods();
      const index = moods.findIndex(m => m.id === id);
      if (index === -1) return null;
      
      moods[index] = { ...moods[index], ...updates };
      await AsyncStorage.setItem(MOODS_KEY, JSON.stringify(moods));
      return moods[index];
    } catch (error) {
      console.error('Error updating mood:', error);
      throw error;
    }
  },

  async deleteMood(id: string): Promise<boolean> {
    try {
      const moods = await this.getAllMoods();
      const filtered = moods.filter(m => m.id !== id);
      await AsyncStorage.setItem(MOODS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting mood:', error);
      throw error;
    }
  },

  async getMoodById(id: string): Promise<MoodEntry | null> {
    try {
      const moods = await this.getAllMoods();
      return moods.find(m => m.id === id) || null;
    } catch (error) {
      console.error('Error getting mood:', error);
      return null;
    }
  },

  async clearAllMoods(): Promise<void> {
    try {
      await AsyncStorage.removeItem(MOODS_KEY);
    } catch (error) {
      console.error('Error clearing moods:', error);
      throw error;
    }
  },
};
