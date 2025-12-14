import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = React.useState<boolean | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'DaiBanna': require('@/assets/fonts/DaiBanna-Regular.ttf'),
        });
      } catch (e) {
        console.warn('Error loading fonts:', e);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    }

    async function checkWelcome() {
      try {
        const seen = await AsyncStorage.getItem('hasSeenWelcome');
        setHasSeenWelcome(seen === 'true');
      } catch (e) {
        console.warn('Error checking welcome state:', e);
        setHasSeenWelcome(true);
      }
    }

    loadFonts();
    checkWelcome();
  }, []);

  if (!fontsLoaded || hasSeenWelcome === null) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {!hasSeenWelcome && (
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-mood" options={{ headerShown: false, presentation: 'modal' }} />
        <Stack.Screen name="detail/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="month-overview" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
