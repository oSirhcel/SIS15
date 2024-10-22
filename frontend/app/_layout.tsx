import '../styles/globals.css';

import { type Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NAV_THEME } from '@/lib/constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@/components/ui/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={LIGHT_THEME}>
          <BottomSheetModalProvider>
            <StatusBar style={'light'} />
            <Stack>
              <Stack.Screen name={'(tabs)'} options={{ headerShown: false }} />
            </Stack>
          </BottomSheetModalProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
