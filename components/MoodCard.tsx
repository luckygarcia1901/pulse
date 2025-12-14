import React from 'react';
import { StyleSheet, TouchableOpacity, View, ImageBackground, Image } from 'react-native';
import { ThemedText } from './themed-text';
import { MoodEntry } from '@/services/moodStorage';

interface MoodCardProps {
  mood: MoodEntry;
  onPress: () => void;
}

export function MoodCard({ mood, onPress }: MoodCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
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
        
        {/* Artist Image in Corner */}
        {mood.artistImage && (
          <Image
            source={{ uri: mood.artistImage }}
            style={styles.artistImageCorner}
          />
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 16,
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
    textAlign: 'right',
  },
  song: {
    fontSize: 16,
    color: '#fff',
    marginTop: 2,
    lineHeight: 20,
    textAlign: 'right',
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
  artistImageCorner: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
