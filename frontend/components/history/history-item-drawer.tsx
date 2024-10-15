import { BottomSheetView } from '@/components/ui/bottom-sheet';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import { cn, getIconAndColor } from '@/lib/utils';
import { InfoIcon, CameraIcon, Trash2Icon } from '@/lib/icons';
import type { ScannedItem } from '@/types';

type Props = {
  item: ScannedItem;
  onScanAnotherPhoto: () => void;
  onRemovePhoto: () => void;
};

export const HistoryItemDrawer = ({
  item,
  onScanAnotherPhoto,
  onRemovePhoto,
}: Props) => {
  const { icon: Icon, color, bgColor } = getIconAndColor(item.type);

  return (
    <BottomSheetView className='flex-1 px-4 pb-6 pt-2'>
      {/* Image */}
      {item.image && (
        <View style={{ width: '100%', height: 300 }}>
          <TouchableOpacity
            onPress={onScanAnotherPhoto}
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: 8,
              borderRadius: 20,
            }}
          >
            <CameraIcon size={24} color='white' />
          </TouchableOpacity>
        </View>
      )}

      {/* Item Type */}
      <View className='mb-4 mt-4 flex-row items-center justify-between'>
        <Text className='text-2xl font-bold text-gray-800'>{item.type}</Text>
      </View>

      {/* Bin Suggestion */}
      <View
        className={cn('mb-6 flex-row items-center rounded-lg p-4', bgColor)}
      >
        <Icon size={24} color='white' />
        <Text className='ml-2 font-semibold text-white'>{color}</Text>
      </View>

      {/* Recycle and Reuse Suggestions */}
      <View className='mb-6 rounded-lg bg-white p-4 shadow-sm'>
        {item.suggestions && (
          <>
            <Text className='mb-2 font-semibold'>Recycle:</Text>
            <Text className='text-gray-600'>{item.suggestions.recycle}</Text>
            <Text className='mb-2 mt-4 font-semibold'>Reuse:</Text>
            <Text className='text-gray-600'>{item.suggestions.reuse}</Text>
          </>
        )}
      </View>

      {/* Relevant Businesses */}
      {item.companies && item.companies.length > 0 && (
        <View className='rounded-lg bg-white p-4 shadow-sm'>
          <View className='mb-3 flex-row items-center'>
            <InfoIcon size={20} color='#4b5563' />
            <Text className='ml-2 text-lg font-semibold text-gray-800'>
              Relevant businesses
            </Text>
          </View>
          {item.companies.map((company, index) => (
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
          ))}
        </View>
      )}

      {/* Buttons */}
      <View className='mt-6 flex-row justify-between'>
        <TouchableOpacity
          onPress={onScanAnotherPhoto}
          className='mb-6 mr-2 flex-1 flex-row items-center justify-center rounded-lg bg-blue-500 p-4'
        >
          <CameraIcon size={20} color='white' />
          <Text className='ml-2 font-semibold text-white'>
            Scan Another Item
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRemovePhoto}
          className='mb-6 ml-2 flex-1 flex-row items-center justify-center rounded-lg bg-red-500 p-4'
        >
          <Trash2Icon size={20} color='white' />
          <Text className='ml-2 font-semibold text-white'>Remove Item</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetView>
  );
};
