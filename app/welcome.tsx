import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = async () => {
    try {
      // Mark that user has seen the welcome screen
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      // Navigate to add mood screen
      router.replace('/add-mood');
    } catch (error) {
      console.error('Error saving welcome state:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Tagline Section */}
        <View style={styles.headerSection}>
          <ThemedText style={styles.logo}>Pulse</ThemedText>
          <View style={styles.taglineSection}>
            <ThemedText style={styles.tagline}>Track the rhythm</ThemedText>
            <ThemedText style={styles.tagline}>of your life</ThemedText>
          </View>
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
          >
            <ThemedText style={styles.getStartedButtonText}>Get Started</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 120,
  },
  logo: {
    fontSize: 80,
    fontFamily: 'DaiBanna',
    color: '#fff',
    letterSpacing: 1,
    lineHeight: 88,
  },
  taglineSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  tagline: {
    fontSize: 28,
    fontFamily: 'DaiBanna',
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 36,
  },
  buttonSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  getStartedButtonText: {
    fontSize: 23,
    fontWeight: '800',
    color: '#1a1a1a',
  },
});
