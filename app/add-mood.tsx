import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { moodStorage } from '@/services/moodStorage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { searchTracks, getArtistImage } from '@/services/spotifyService';

const MOODS = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '🧐', label: 'Focused' },
  { emoji: '🤩', label: 'Excited' },
  { emoji: '😜', label: 'Playful' },
  { emoji: '😎', label: 'Cool' },
  { emoji: '😖', label: 'Stressed' },
  { emoji: '😔', label: 'Sad' },
];

interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  album: string;
  imageUrl: string | null;
  artistImageUrl: string | null;
  uri: string;
  previewUrl: string | null;
}

export default function AddMoodScreen() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [songName, setSongName] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistId, setArtistId] = useState('');
  const [artistImage, setArtistImage] = useState('');
  const [moodText, setMoodText] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (songName.trim().length > 2 && !artistName) {
      handleSearchSongs(songName);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [songName, artistName]);

  const handleSearchSongs = async (query: string) => {
    setSearchLoading(true);
    try {
      const results = await searchTracks(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching songs:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectTrack = async (track: SpotifyTrack) => {
    setSongName(track.name);
    setArtistName(track.artist);
    setArtistId(track.artistId);
    setShowSearchResults(false);
    setSearchResults([]);
    
    // Get artist image
    if (track.artistId) {
      const image = await getArtistImage(track.artistId);
      if (image) {
        setArtistImage(image);
      }
    }
  };

  const handleContinue = () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood');
      return;
    }
    if (!songName.trim()) {
      Alert.alert('Error', 'Please enter a song name');
      return;
    }
    setStep(2);
  };

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood');
      return;
    }
    if (!songName.trim()) {
      Alert.alert('Error', 'Please enter a song name');
      return;
    }
    if (!artistName.trim()) {
      Alert.alert('Error', 'Please enter an artist name');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a mood description');
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const date = now.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      // Get the mood label from the selected emoji
      const moodLabel = MOODS.find(m => m.emoji === selectedMood)?.label || '';

      await moodStorage.addMood({
        date,
        time,
        emoji: selectedMood,
        moodText: moodLabel,
        song: songName,
        artist: artistName,
        artistImage: artistImage || undefined,
        description,
        timestamp: now.getTime(),
      });

      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save mood');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
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

          {/* Song Input */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>What song captures{'\n'}how you feel today?</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="🔍"
              placeholderTextColor="#999"
              value={songName}
              onChangeText={setSongName}
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && songName.trim().length > 0 && (
              <View style={styles.searchResultsContainer}>
                {searchLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#FFC107" />
                  </View>
                ) : searchResults.length > 0 ? (
                  <ScrollView scrollEnabled={true} nestedScrollEnabled={true}>
                    {searchResults.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.searchResultItem}
                        onPress={() => handleSelectTrack(item)}
                      >
                        <View style={styles.resultContent}>
                          <ThemedText style={styles.resultTitle}>{item.name}</ThemedText>
                          <ThemedText style={styles.resultArtist}>{item.artist}</ThemedText>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <ThemedText style={styles.noResults}>No songs found</ThemedText>
                )}
              </View>
            )}
          </View>

          {/* Mood Selection */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>How are you?</ThemedText>
            <ThemedText style={styles.sectionSubtitle}>Choose 1 emotion</ThemedText>
            <View style={styles.moodBox}>
              <View style={styles.moodGrid}>
                {MOODS.map(mood => (
                  <TouchableOpacity
                    key={mood.emoji}
                    style={[
                      styles.moodButton,
                      selectedMood === mood.emoji && styles.moodButtonSelected,
                    ]}
                    onPress={() => setSelectedMood(mood.emoji)}
                  >
                    <ThemedText style={styles.moodEmoji}>{mood.emoji}</ThemedText>
                    <ThemedText style={[
                      styles.moodLabel,
                      selectedMood === mood.emoji && mood.label === 'Stressed' && styles.stressedLabelSelected,
                    ]}>
                      {mood.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
          </TouchableOpacity>
        </ScrollView>
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

        {/* Title and Subtitle */}
        <View style={styles.step2Section}>
          <ThemedText style={styles.step2Title}>What's making you{'\n'}feel this way today?</ThemedText>
          <ThemedText style={styles.step2Subtitle}>Write a little journal about{'\n'}this feeling you're having.</ThemedText>
        </View>

        {/* Text Area */}
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.step2TextArea}
            placeholder=""
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={10}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleSaveMood}
          disabled={loading}
        >
          <ThemedText style={styles.continueButtonText}>
            {loading ? 'Saving...' : 'Continue'}
          </ThemedText>
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
    paddingTop: 60,
    paddingBottom: 40,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 34,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#fff',
    paddingBottom: 12,
    textAlign: 'center',
    fontWeight: '400',
  },
  searchInput: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    alignSelf: 'center',
    width: '85%',
    marginBottom: 20,
  },
  moodBox: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 15,
    padding: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  moodButton: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodButtonSelected: {
    borderColor: '#FFD700',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 0,
    lineHeight: 48,
  },
  moodLabel: {
    fontSize: 17,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: -2,
  },
  continueButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
    alignSelf: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  input: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    textAlignVertical: 'top',
    paddingTop: 12,
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  backButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#FFC107',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  step2Section: {
    alignItems: 'center',
    marginBottom: 24,
  },
  step2Title: {
    fontSize: 28,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 12,
  },
  step2Subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
  },
  textAreaContainer: {
    marginBottom: 60,
  },
  step2TextArea: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#fff',
    fontSize: 14,
    minHeight: 280,
    textAlignVertical: 'top',
  },
  stressedLabelSelected: {
    fontSize: 16,
  },
  searchResultsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#444',
  },
  loadingContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResultItem: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  resultContent: {
    gap: 2,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  resultArtist: {
    fontSize: 12,
    color: '#999',
  },
  noResults: {
    padding: 16,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
});
