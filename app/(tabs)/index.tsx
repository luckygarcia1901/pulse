import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { MoodCard } from '@/components/MoodCard';
import { CalendarIcon } from '@/components/CalendarIcon';
import { moodStorage, MoodEntry } from '@/services/moodStorage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      loadMoods();
    }, [])
  );

  const loadMoods = async () => {
    const allMoods = await moodStorage.getAllMoods();
    setMoods(allMoods);
  };

  const handleMoodPress = (moodId: string) => {
    router.push(`/detail/${moodId}`);
  };

  const handleAddMood = () => {
    router.push('/add-mood');
  };

  const handleMonthOverview = () => {
    router.push('/month-overview');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText style={styles.logo}>Pulse</ThemedText>
        </View>

        <View style={styles.moodsContainer}>
          {moods.length === 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>Your moods will show up</ThemedText>
              <ThemedText style={styles.emptyText}>on your home page here.</ThemedText>
            </View>
          ) : (
            moods.map(mood => (
              <MoodCard
                key={mood.id}
                mood={mood}
                onPress={() => handleMoodPress(mood.id)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={handleMonthOverview}
        >
          <CalendarIcon size={40} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMood}
        >
          <ThemedText style={styles.addButtonText}>+ add mood</ThemedText>
        </TouchableOpacity>

        <View style={styles.invisibleButton} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    fontSize: 48,
    fontFamily: 'DaiBanna',
    color: '#fff',
    letterSpacing: 0.5,
    lineHeight: 56,
  },
  moodsContainer: {
    gap: 0,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    backgroundColor: '#1a1a1a',
  },
  calendarButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  invisibleButton: {
    width: 48,
    height: 48,
  },
  addButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
});
