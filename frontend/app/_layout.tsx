import { Stack } from 'expo-router';
import '../styles/globals.css';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='index' />
    </Stack>
  );
}
