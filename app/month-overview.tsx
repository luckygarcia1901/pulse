import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { moodStorage, MoodEntry } from '@/services/moodStorage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MOOD_COLORS: { [key: string]: string } = {
  '😄': '#FFD700',
  '😌': '#66BB6A',
  '🧐': '#9E9E9E',
  '🤩': '#FF9800',
  '😜': '#E91E63',
  '😎': '#00BCD4',
  '😖': '#F44336',
  '😔': '#9C27B0',
};

const MOOD_LABELS: { [key: string]: string } = {
  '😄': 'Happy',
  '😌': 'Calm',
  '🧐': 'Focused',
  '🤩': 'Excited',
  '😜': 'Playful',
  '😎': 'Cool',
  '😖': 'Stressed',
  '😔': 'Sad',
};

const LABEL_TO_COLOR: { [key: string]: string } = {
  'Happy': '#FFD700',
  'Calm': '#66BB6A',
  'Focused': '#9E9E9E',
  'Excited': '#FF9800',
  'Playful': '#E91E63',
  'Cool': '#00BCD4',
  'Stressed': '#F44336',
  'Sad': '#9C27B0',
};

interface DayMood {
  date: number;
  mood: MoodEntry | null;
  color: string;
}

export default function MonthOverviewScreen() {
  const router = useRouter();
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [calendarDays, setCalendarDays] = useState<DayMood[]>([]);
  const monthScrollRef = React.useRef<ScrollView>(null);
  
  // Get installation date (today, or could be stored in AsyncStorage)
  const installationDate = today;

  useFocusEffect(
    React.useCallback(() => {
      loadMoods();
    }, [])
  );

  useEffect(() => {
    generateCalendar();
  }, [currentDate, moods]);

  useEffect(() => {
    // Scroll to current month
    setTimeout(() => {
      monthScrollRef.current?.scrollTo({ x: 0, animated: false });
    }, 100);
  }, []);

  const loadMoods = async () => {
    const allMoods = await moodStorage.getAllMoods();
    setMoods(allMoods);
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    let startingDayOfWeek = firstDay.getDay();
    
    // Convert Sunday (0) to Monday (1) based system
    // Sunday = 0 -> 6, Monday = 1 -> 0, ..., Saturday = 6 -> 5
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    const days: DayMood[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ date: 0, mood: null, color: '#1a1a1a' });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      const moodForDay = moods.find(m => m.date === dateStr);
      let color = '#2a2a2a';
      if (moodForDay) {
        // Try to find color by emoji first
        color = MOOD_COLORS[moodForDay.emoji];
        // If not found, try to find by label
        if (!color && moodForDay.moodText) {
          color = LABEL_TO_COLOR[moodForDay.moodText];
        }
        // If still not found, use fallback
        if (!color) {
          color = '#FF00FF';
        }
      }

      days.push({
        date: day,
        mood: moodForDay || null,
        color,
      });
    }

    setCalendarDays(days);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayPress = (dayMood: DayMood) => {
    if (dayMood.mood) {
      router.push(`/detail/${dayMood.mood.id}`);
    }
  };

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoSection}>
          <ThemedText style={styles.logo}>Pulse</ThemedText>
        </View>

        {/* Month Selector */}
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <MaterialCommunityIcons name="chevron-left" size={20} color="#fff" />
          </TouchableOpacity>
          <ScrollView
            ref={monthScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.monthScroll}
            contentContainerStyle={styles.monthScrollContent}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const date = new Date(installationDate.getFullYear(), installationDate.getMonth() + i, 1);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth() && 
                                     date.getFullYear() === currentDate.getFullYear();
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setCurrentDate(date)}
                  style={[styles.monthButton, isCurrentMonth && styles.monthButtonActive]}
                >
                  <ThemedText style={[styles.monthButtonText, isCurrentMonth && styles.monthButtonTextActive]}>
                    {date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity onPress={handleNextMonth}>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View style={styles.weekDaysHeader}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
            <ThemedText key={day} style={styles.weekDayLabel}>
              {day}
            </ThemedText>
          ))}
        </View>

        {/* Calendar */}
        <View style={styles.calendar}>
          {calendarDays.map((dayMood, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                { backgroundColor: dayMood.color },
                dayMood.date === 0 && styles.emptyCell,
              ]}
              onPress={() => handleDayPress(dayMood)}
              disabled={dayMood.date === 0}
            >
              {dayMood.date !== 0 && (
                <ThemedText style={styles.dayNumber}>{dayMood.date}</ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legendSection}>
          <ThemedText style={styles.legendTitle}>Moods</ThemedText>
          <View style={styles.legendGrid}>
            {Object.entries(MOOD_COLORS).map(([emoji, color]) => (
              <View key={emoji} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: color }]} />
                <ThemedText style={styles.legendEmoji}>{emoji}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Home Button */}
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.homeButtonText}>Home</ThemedText>
        </TouchableOpacity>
      </ScrollView>
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
    paddingVertical: 40,
    paddingBottom: 60,
  },
  logoSection: {
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
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  monthScroll: {
    flex: 1,
  },
  monthScrollContent: {
    gap: 8,
  },
  monthButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  monthButtonActive: {
    backgroundColor: '#FFC107',
  },
  monthButtonText: {
    fontSize: 12,
    color: '#999',
  },
  monthButtonTextActive: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  monthYear: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  weekDayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 20,
    marginBottom: 32,
  },
  dayCell: {
    width: '14.285%',
    aspectRatio: 1,
    minHeight: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  emptyCell: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  dayNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  dayEmoji: {
    fontSize: 16,
    marginTop: 2,
  },
  legendSection: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendEmoji: {
    fontSize: 18,
  },
  homeButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    alignSelf: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
  },
});
