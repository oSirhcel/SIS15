import React from 'react';

import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeTab() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className='flex-1 items-center justify-center px-4 py-2'>
        <Text className='text-2xl font-bold text-gray-600'>
          Welcome to the App!
        </Text>
        <Text className='mt-4 text-center text-gray-600'>
          This is the new home page. You can navigate to other tabs using the
          bottom navigation.
        </Text>
      </View>
    </SafeAreaView>
  );
}
