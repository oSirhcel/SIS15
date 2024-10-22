import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, Camera, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';
import { useGetUserHistory } from '@/api/history/use-get-user-history';
import { format } from 'date-fns';

export default function HomePage() {
  const router = useRouter();
  const { data: historyData, isLoading } = useGetUserHistory();

  const scannedItems = historyData?.items || [];

  //const userPoints = scannedItems.reduce((sum, item) => sum + item.points, 0);
  const userPoints = scannedItems.reduce((sum, item) => sum + 0, 0);

  const renderItem = ({ item }: { item: any }) => (
    <View className='flex-row items-center justify-between border-b border-gray-200 py-3'>
      <View className='flex-row items-center'>
        <Trash2 size={24} color='#4CAF50' />
        <View className='ml-3'>
          <Text className='text-base font-semibold text-gray-800'>
            {item.type}
          </Text>
          <Text className='text-sm text-gray-500'>
            {format(item.date, 'MMM dd HH:mm aaaaa')}m
          </Text>
        </View>
      </View>
      {/* You might want to display something else here, as points are not currently stored */}
      <Text className='text-lg font-bold text-green-600'>
        +{item.points || 0}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View className='flex-1 items-center justify-center px-4 py-6'>
          <Text>Loading recent scans...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

          {scannedItems.length > 0 ? (
            <FlatList
              data={scannedItems}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <Text className='text-center text-gray-500'>
              No scanned items yet. Start by scanning your first item!
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}