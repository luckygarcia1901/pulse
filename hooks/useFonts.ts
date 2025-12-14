import * as Font from 'expo-font';

export async function loadFonts() {
  await Font.loadAsync({
    'Inter': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('@/assets/fonts/Inter-Bold.ttf'),
    'DaiBanna': require('@/assets/fonts/DaiBanna-Regular.ttf'),
  });
}
