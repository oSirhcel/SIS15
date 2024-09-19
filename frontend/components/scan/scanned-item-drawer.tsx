import { BottomSheetView } from '@/components/ui/bottom-sheet';
import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { cn, getIconAndColor } from '@/lib/utils';
import { CameraIcon, InfoIcon, Trash2Icon } from '@/lib/icons';
import type { ScannedItem } from '@/types';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  item: ScannedItem;
  lastPhoto: string | null;
  handleScanAnotherPhoto: () => void;
  handleRemovePhoto: () => void;
};

export const ScannedItemDrawer = ({
  item,
  lastPhoto,
  handleRemovePhoto,
  handleScanAnotherPhoto,
}: Props) => {
  const { icon: Icon, color, bgColor } = getIconAndColor(item.type);

  return (
    <BottomSheetView className='flex-1 px-4 pb-6 pt-2'>
      {lastPhoto && (
        <Image
          source={{ uri: lastPhoto }}
          style={{ width: '100%', height: 300 }}
          contentFit='contain'
        />
      )}
      {item && (
        <>
          <View className='mb-4 mt-4 flex-row items-center justify-between'>
            <Text className='text-2xl font-bold text-gray-800'>
              {item.name}
            </Text>
          </View>

          <View
            className={cn('mb-6 flex-row items-center rounded-lg p-4', bgColor)}
          >
            <Icon size={24} color='white' />
            <Text className='ml-2 font-semibold text-white'>
              Place in the {color} bin
            </Text>
          </View>

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
            {item.tips.map((tip: string, index: number) => (
              <View key={index} className='mb-2 flex-row items-center'>
                <View className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                <Text className='text-gray-600'>{tip}</Text>
              </View>
            ))}
          </View>

          <View className='mt-6 flex-row justify-between'>
            <TouchableOpacity
              onPress={handleScanAnotherPhoto}
              className='mb-6 mr-2 flex-1 flex-row items-center justify-center rounded-lg bg-blue-500 p-4'
            >
              <CameraIcon size={20} color='white' />
              <Text className='ml-2 font-semibold text-white'>
                Scan Another Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRemovePhoto}
              className='mb-6 ml-2 flex-1 flex-row items-center justify-center rounded-lg bg-red-500 p-4'
            >
              <Trash2Icon size={20} color='white' />
              <Text className='ml-2 font-semibold text-white'>
                Remove Photo
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </BottomSheetView>
  );
};
