import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { CameraIcon } from '@/lib/icons';
import { cn, getIconAndColor } from '@/lib/utils';
import { router } from 'expo-router';
import type { ScannedItemType } from '@/types';
import { useGetUserHistory } from '@/api/history/use-get-user-history';

const ScannedItem = ({ item }: { item: ScannedItemType }) => {
  const { icon: Icon, bgColor, color } = getIconAndColor(item.type);

  return (
    <View className='mb-2 flex-row items-center rounded-lg bg-card p-4 shadow-sm'>
      <View
        className={cn(
          'mr-4 h-12 w-12 items-center justify-center rounded-full',
          bgColor,
        )}
      >
        <Icon size={24} color='white' />
      </View>
      <View className='flex-1'>
        <Text className='text-lg font-semibold'>{item.name}</Text>
        <Text className='text-sm text-gray-600'>{item.description}</Text>
        <Text className='mt-1 text-xs text-gray-400'>
          {item.date.toString()}
        </Text>
      </View>
      <View className={cn('h-3 w-3 rounded-full', color)} />
    </View>
  );
};

const CallToActionButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    className='mt-4 flex-row items-center justify-center rounded-lg bg-blue-500 p-4'
    accessibilityRole='button'
    accessibilityLabel='Scan new item'
  >
    <CameraIcon className='mr-2 size-6 text-primary' />
    <Text className='text-lg font-semibold text-primary'>Scan New Item</Text>
  </TouchableOpacity>
);

export default function HistoryTab() {
  const handleScanNewItem = () => {
    // Implement the logic to navigate to the scanning screen
    router.push('/scan');
  };

  // Fetch the user's scan history from the API, temporarily using a mock user ID
  // React Query has a built-in cache, and states like 'isLoading', 'isError', and 'isSuccess'
  //!!: See https://tanstack.com/query/latest/docs/framework/react/overview
  const historyQuery = useGetUserHistory('1');

  //TODO: Implement loading states and error handling
  const scannedItems = historyQuery.data?.items ?? [];

  console.log(scannedItems);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className='flex-1 px-4 py-2'>
        <Text className='mb-4 text-2xl font-bold'>Scan History</Text>
        {scannedItems.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {scannedItems.map((item) => (
              <ScannedItem key={item.id} item={item} />
            ))}
          </ScrollView>
        ) : (
          <View className='flex-1 items-center justify-center'>
            <Text className='mb-4 text-center text-lg text-gray-600'>
              No items scanned yet. Start by scanning your first item!
            </Text>
            <CallToActionButton onPress={handleScanNewItem} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
