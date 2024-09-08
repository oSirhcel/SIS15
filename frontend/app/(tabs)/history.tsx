import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Trash2, Recycle, Leaf } from 'lucide-react-native';
import { CameraIcon } from '@/lib/icons/CameraIcon';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';

type ScannedItemType = {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'recyclable' | 'biodegradable' | 'trash';
};

// Mock data for scanned items
const scannedItems: ScannedItemType[] = [
  // {
  //   id: 1,
  //   title: 'Plastic Bottle',
  //   description: 'Empty water bottle',
  //   date: '2023-06-01',
  //   type: 'recyclable',
  // },
  // {
  //   id: 2,
  //   title: 'Banana Peel',
  //   description: 'Organic waste',
  //   date: '2023-06-02',
  //   type: 'biodegradable',
  // },
  // {
  //   id: 3,
  //   title: 'Styrofoam Cup',
  //   description: 'Used coffee cup',
  //   date: '2023-06-03',
  //   type: 'trash',
  // },
  // {
  //   id: 4,
  //   title: 'Cardboard Box',
  //   description: 'Amazon package',
  //   date: '2023-06-04',
  //   type: 'recyclable',
  // },
  // {
  //   id: 5,
  //   title: 'Apple Core',
  //   description: 'Fruit waste',
  //   date: '2023-06-05',
  //   type: 'biodegradable',
  // },
];

const getIconAndColor = (type: 'recyclable' | 'biodegradable' | 'trash') => {
  switch (type) {
    case 'recyclable':
      return {
        icon: Recycle,
        color: 'text-green-500',
        bgColor: 'bg-green-500',
      };
    case 'biodegradable':
      return { icon: Leaf, color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    case 'trash':
      return { icon: Trash2, color: 'text-red-500', bgColor: 'bg-red-500' };
    default:
      return { icon: Trash2, color: 'text-gray-500', bgColor: 'bg-gray-500' };
  }
};

const ScannedItem = ({ item }: { item: ScannedItemType }) => {
  const { icon: Icon, color, bgColor } = getIconAndColor(item.type);

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
        <Text className='text-lg font-semibold'>{item.title}</Text>
        <Text className='text-sm text-gray-600'>{item.description}</Text>
        <Text className='mt-1 text-xs text-gray-400'>{item.date}</Text>
      </View>
      <View className={cn('h-3 w-3 rounded-full', bgColor)} />
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