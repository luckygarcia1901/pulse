import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry } from '@/services/moodStorage';

const MOODS_KEY = 'pulse_moods';

export const addTestData = async () => {
  const testMoods: MoodEntry[] = [
    {
      id: '1',
      date: '19 Jan 2026',
      time: '19:36',
      emoji: '😌',
      moodText: 'Calm',
      song: 'La Yugular',
      artist: 'Rosalía',
      description: 'Feeling peaceful and relaxed today',
      timestamp: new Date('2026-01-19').getTime(),
    },
    {
      id: '2',
      date: '18 Jan 2026',
      time: '21:12',
      emoji: '😂',
      moodText: 'Excited',
      song: 'Debi tirar más fotos',
      artist: 'Bad Bunny',
      description: 'Everything seems moving at a steady pace, and I feel quite good',
      timestamp: new Date('2026-01-18').getTime(),
    },
  ];

  try {
    await AsyncStorage.setItem(MOODS_KEY, JSON.stringify(testMoods));
    console.log('Test data added successfully');
  } catch (error) {
    console.error('Error adding test data:', error);
  }
};
