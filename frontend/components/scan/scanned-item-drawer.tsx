import { BottomSheetView } from '@/components/ui/bottom-sheet';
import { View, Text } from 'react-native';
import { cn, getIconAndColor } from '@/lib/utils';
import { InfoIcon } from '@/lib/icons';
import type { ScannedItemType } from '@/types/scan';

type Props = {
  item: ScannedItemType;
};

export const ScannedItemDrawer = ({ item }: Props) => {
  return (
    <BottomSheetView className='flex-1 px-4 pb-6 pt-2'>
      <View className='mb-4 flex-row items-center justify-between'>
        <Text className='text-2xl font-bold text-gray-800'>{item.name}</Text>
      </View>

      {(() => {
        const { icon: Icon, bgColor } = getIconAndColor(item.type);
        return (
          <View
            className={cn('mb-6 flex-row items-center rounded-lg p-4', bgColor)}
          >
            <Icon size={24} color='white' />
            <Text className='ml-2 font-semibold text-white'>
              Place in {item.type} Bin
            </Text>
          </View>
        );
      })()}

      <View className='mb-6 rounded-lg bg-white p-4 shadow-sm'>
        <Text className='text-base leading-relaxed text-gray-600'>
          {item.description}
        </Text>
      </View>

      <View className='rounded-lg bg-white p-4 shadow-sm'>
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
    </BottomSheetView>
  );
};
