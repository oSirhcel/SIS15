import { cn, getIconAndColor } from '@/lib/utils';

import { CameraIcon, InfoIcon } from '@/lib/icons';
import type { ScannedItem } from '@/types';

import { useGetUserHistory } from '@/api/history/use-get-user-history';

import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

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
        <View className='flex flex-row items-center justify-between'>
          <Text className='mb-4 text-2xl font-bold'>Scan History</Text>
          <Button
            variant={'outline'}
            className='flex-row'
            onPress={handleScanNewItem}
          >
            <CameraIcon className='mr-2 text-white' />
            <Text>Scan</Text>
          </Button>
        </View>
        {scannedItems.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Accordion type='multiple' collapsible className='w-full'>
              {scannedItems.map((item) => (
                <ScannedItem key={item.id} item={item} value={item.id} />
              ))}
            </Accordion>
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

const ScannedItem = ({ item, value }: { item: ScannedItem; value: string }) => {
  const { icon: Icon, bgColor } = getIconAndColor(item.type);

  //TODO: Styles for the accordion item, make expanded smaller (currently just copied from scan drawer) & add image? (optional)

  return (
    <AccordionItem
      value={value}
      className='mb-2 flex-col items-center rounded-lg bg-card p-4 shadow-sm'
    >
      <AccordionTrigger className='flex w-full flex-row'>
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
          <Text className='mt-1 text-xs text-gray-400'>
            {item.date.toString()}
          </Text>
        </View>
        <View className={cn('h-3 w-3 rounded-full', bgColor)} />
      </AccordionTrigger>
      <AccordionContent>
        <View>
          <Text>Place in the {item.type} Bin</Text>
          <View className='mb-6 rounded-lg p-4 shadow-sm'>
            <Text className='text-base leading-relaxed text-gray-600'>
              {item.description}
            </Text>
          </View>

          <View className='rounded-lg p-4 shadow-sm'>
            <View className='mb-3 flex-row items-center'>
              <InfoIcon size={20} color='#4b5563' />
              <Text className='ml-2 text-lg font-semibold text-gray-800'>
                Recycling Tips
              </Text>
            </View>
            {item.tips.map((tip, index) => (
              <View key={index} className='mb-2 flex-row items-center'>
                <View className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                <Text className='text-gray-600'>{tip}</Text>
              </View>
            ))}
          </View>
        </View>
      </AccordionContent>
    </AccordionItem>
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
