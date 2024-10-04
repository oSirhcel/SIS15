import { BottomSheetView } from '@/components/ui/bottom-sheet';
import { View, Text, Linking } from 'react-native';
import { cn, getIconAndColor } from '@/lib/utils';
import { InfoIcon } from '@/lib/icons';
import type { ScannedItem } from '@/types';

type Props = {
  item: ScannedItem;
};

export const ScannedItemDrawer = ({ item }: Props) => {
  const { icon: Icon, color, bgColor } = getIconAndColor(item.type);

  return (
    <BottomSheetView className='flex-1 px-4 pb-6'>
      <View className='mb-4 flex-row items-center justify-between'>
        <Text className='text-2xl font-bold text-gray-800'>{item.type}</Text>
      </View>
      <View
        className={cn('mb-6 flex-row items-center rounded-lg p-4', bgColor)}
      >
        <Icon size={24} color='white' />
        <Text className='ml-2 font-semibold text-white'>{color}</Text>
      </View>

      {/* Display the recycle and reuse suggestions separately */}
      <View className='mb-6 rounded-lg bg-white p-4 shadow-sm'>
        <Text className='text-base leading-relaxed text-gray-600'>
          <Text style={{ fontWeight: 'bold' }}>Recycle:</Text>{' '}
          {item.suggestions.recycle}
        </Text>
        <Text className='text-base leading-relaxed text-gray-600'>
          <Text style={{ fontWeight: 'bold' }}>Reuse:</Text>{' '}
          {item.suggestions.reuse}
        </Text>
      </View>

      <View className='rounded-lg bg-white p-4 shadow-sm'>
        <View className='mb-3 flex-row items-center'>
          <InfoIcon size={20} color='#4b5563' />
          <Text className='ml-2 text-lg font-semibold text-gray-800'>
            Relevant businesses
          </Text>
        </View>

        {item.companies.map(
          (company: { name: string; website: string }, index: number) => (
            <View key={index} className='mb-2'>
              <View className='mb-2 flex-row items-center'>
                <View className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                <Text className='text-gray-600'>{company.name}</Text>
              </View>
              <Text
                className='text-blue-500'
                onPress={() => Linking.openURL(company.website)}
              >
                {company.website}
              </Text>
            </View>
          ),
        )}
      </View>
    </BottomSheetView>
  );
};

export const ScannedItemDrawerSkeleton = () => {
  return (
    <BottomSheetView className='flex-1 px-4 pb-6'>
      <View className='mb-4 flex-row items-center justify-between'>
        <View className='h-8 w-32 animate-pulse rounded-md bg-gray-200' />
      </View>

      <View className='mb-6 h-12 animate-pulse rounded-lg bg-gray-200' />

      <View className='mb-6 rounded-lg bg-white p-4 shadow-sm'>
        <View className='mb-2 h-4 w-3/4 animate-pulse rounded bg-gray-200' />
        <View className='h-4 w-full animate-pulse rounded bg-gray-200' />
        <View className='mt-4 h-4 w-2/3 animate-pulse rounded bg-gray-200' />
        <View className='mt-2 h-4 w-full animate-pulse rounded bg-gray-200' />
      </View>

      <View className='rounded-lg bg-white p-4 shadow-sm'>
        <View className='mb-3 flex-row items-center'>
          <View className='h-5 w-5 animate-pulse rounded-full bg-gray-200' />
          <View className='ml-2 h-6 w-40 animate-pulse rounded bg-gray-200' />
        </View>

        {[1, 2].map((_, index) => (
          <View key={index} className='mb-4'>
            <View className='mb-2 flex-row items-center'>
              <View className='mr-2 h-2 w-2 animate-pulse rounded-full bg-gray-200' />
              <View className='h-4 w-32 animate-pulse rounded bg-gray-200' />
            </View>
            <View className='h-4 w-48 animate-pulse rounded bg-gray-200' />
          </View>
        ))}
      </View>
    </BottomSheetView>
  );
};
