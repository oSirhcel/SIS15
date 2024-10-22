import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, Camera, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';

// Mock data for scanned items
const scannedItems = [
  { id: '1', name: 'Plastic Bottle', points: 10, date: '2023-05-01' },
  { id: '2', name: 'Cardboard Box', points: 15, date: '2023-05-02' },
  { id: '3', name: 'Aluminum Can', points: 5, date: '2023-05-03' },
  { id: '4', name: 'Glass Jar', points: 20, date: '2023-05-04' },
  { id: '5', name: 'Newspaper', points: 5, date: '2023-05-05' },
];

export default function HomePage() {
  const router = useRouter();

  const userPoints = scannedItems.reduce((sum, item) => sum + item.points, 0);

  const renderItem = ({
    item,
  }: {
    item: { id: string; name: string; points: number; date: string };
  }) => (
    <View className='flex-row items-center justify-between border-b border-gray-200 py-3'>
      <View className='flex-row items-center'>
        <Trash2 size={24} color='#4CAF50' />
        <View className='ml-3'>
          <Text className='text-base font-semibold text-gray-800'>
            {item.name}
          </Text>
          <Text className='text-sm text-gray-500'>{item.date}</Text>
        </View>
      </View>
      <Text className='text-lg font-bold text-green-600'>+{item.points}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className='px-4 py-6'>
        <View className='mb-6 items-center'>
          <Text className='text-3xl font-bold text-green-600'>Scan</Text>
          <Text className='text-base text-gray-600'>
            Scan and recycle responsibly
          </Text>
        </View>

        <View className='mb-6 rounded-xl bg-white p-6 shadow-sm'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center'>
              <Wallet size={24} color='#4CAF50' />
              <Text className='ml-2 text-lg font-semibold text-green-600'>
                Your EcoPoints
              </Text>
            </View>
            <Text className='text-3xl font-bold text-green-600'>
              {userPoints}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className='mb-6 flex-row items-center justify-center rounded-lg bg-green-600 py-4'
          onPress={() => router.push('/(tabs)/scan')}
        >
          <Camera size={24} color='#FFFFFF' />
          <Text className='ml-2 text-lg font-semibold text-white'>
            Start Scanning
          </Text>
        </TouchableOpacity>

        <Text className='mb-4 text-center text-gray-600'>
          Scan your items to get information on which bin to use and earn
          EcoPoints!
        </Text>

        <View className='rounded-xl bg-white p-4 shadow-sm'>
          <View className='flex flex-row items-center justify-between'>
            <Text className='mb-2 text-xl font-semibold text-gray-800'>
              Recent Scans
            </Text>
            <Button
              variant='link'
              onPress={() => router.push('/(tabs)/history')}
            >
              <Text>View More</Text>
            </Button>
          </View>

          <FlatList
            data={scannedItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
