import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ImageBackground,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { moodStorage, MoodEntry } from '@/services/moodStorage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [mood, setMood] = useState<MoodEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMood();
  }, [id]);

  const loadMood = async () => {
    if (typeof id === 'string') {
      const moodData = await moodStorage.getMoodById(id);
      setMood(moodData);
    }
    setLoading(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete Mood', 'Are you sure you want to delete this mood?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          if (typeof id === 'string') {
            await moodStorage.deleteMood(id);
            router.back();
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  if (!mood) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <ThemedText style={styles.notFoundText}>Mood not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

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

        {/* Mood Card */}
        <TouchableOpacity style={styles.card} activeOpacity={0.9}>
          <ImageBackground
            source={mood.artistImage ? { uri: mood.artistImage } : { uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }}
            style={styles.background}
            blurRadius={3}
          >
            <View style={styles.overlay}>
              <View style={styles.header}>
                <ThemedText style={styles.date}>{mood.date}</ThemedText>
                <ThemedText style={styles.time}>{mood.time}</ThemedText>
              </View>

              <View style={styles.content}>
                <View style={styles.emojiSection}>
                  <ThemedText style={styles.emoji}>{mood.emoji}</ThemedText>
                </View>

                <View style={styles.songSection}>
                  <ThemedText style={styles.artist}>{mood.artist}</ThemedText>
                  <ThemedText style={styles.song}>{mood.song}</ThemedText>
                </View>
              </View>

              <View style={styles.footer}>
                <ThemedText style={styles.moodText}>I am feeling {mood.moodText}</ThemedText>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        {/* Description Box */}
        {mood.description && (
          <View style={styles.descriptionBox}>
            <ThemedText style={styles.descriptionText}>{mood.description}</ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Home Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
          <ThemedText style={styles.homeButtonText}>Home</ThemedText>
        </TouchableOpacity>
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
  card: {
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
    height: 160,
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    padding: 14,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
  },
  time: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginVertical: 4,
  },
  emojiSection: {
    justifyContent: 'center',
    minHeight: 50,
  },
  emoji: {
    fontSize: 50,
    lineHeight: 50,
  },
  songSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  artist: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    lineHeight: 22,
  },
  song: {
    fontSize: 16,
    color: '#fff',
    marginTop: 2,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  descriptionBox: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    padding: 16,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
  },
  buttonContainer: {
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
  homeButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: '#666',
  },
});
