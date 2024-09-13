import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { CameraIcon } from '@/lib/icons';
import { cn, getIconAndColor } from '@/lib/utils';
import { router } from 'expo-router';
import type { ScannedItemType } from '@/types/scan';

// Mock data for scanned items
const scannedItems: ScannedItemType[] = [
  {
    id: '1',
    name: 'Plastic Bottle',
    description: 'Empty water bottle',
    date: new Date(),
    type: 'Recycling',
    tips: [
      'Remove the cap and recycle separately',
      'Crush the bottle to save space',
      'Check for recycling symbol (#1 PET or #2 HDPE)',
    ],
  },
  {
    id: '2',
    name: 'Banana Peel',
    description: 'Organic waste',
    date: new Date(),
    type: 'Organic Waste',
    tips: ['Compost the peel', 'Do not put in recycling or garbage bin'],
  },
  {
    id: '3',
    name: 'Plastic Bag',
    description: 'Empty shopping bag',
    date: new Date(),
    type: 'General Waste',
    tips: ['Reuse the bag', 'Dispose of in general waste bin'],
  },
  {
    id: '4',
    name: 'Aluminum Can',
    description: 'Empty soda can',
    date: new Date(),
    type: 'Recycling',
    tips: ['Rinse the can', 'Check for recycling symbol (#1 PET or #2 HDPE)'],
  },
  {
    id: '5',
    name: 'Paper Towel',
    description: 'Used paper towel',
    date: new Date(),
    type: 'Organic Waste',
    tips: ['Compost the paper towel', 'Do not put in recycling or garbage bin'],
  },
];

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
