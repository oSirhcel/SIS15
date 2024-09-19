import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Trash2, Recycle, Leaf, Pencil, X } from 'lucide-react-native';
import { CameraIcon } from '@/lib/icons/CameraIcon';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTrigger,
  BottomSheetHandle,
} from '@/components/ui/bottom-sheet';
import { Image } from 'expo-image';
import {
  Info,
  RecycleIcon,
  Image as ImageIcon,
} from 'lucide-react-native';
import { useSharedValue } from 'react-native-reanimated';
import { ScannedItemType } from '@/types/types';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/lib/useColourScheme';
import { useGetUserHistory } from '@/api/history/use-get-user-history';

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

const ScannedItem = ({
  item,
  onPress,
  isSelected,
}: {
  item: ScannedItemType;
  onPress: () => void;
  isSelected: boolean;
}) => {
  const { icon: Icon, color, bgColor } = getIconAndColor(item.type);
  const { isDarkColorScheme } = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        'mb-2 flex-row items-center rounded-lg p-4',
        isSelected
          ? isDarkColorScheme
            ? 'bg-gray-800'
            : 'bg-blue-100'
          : isDarkColorScheme
            ? Colors.dark.background
            : Colors.light.background
      )}
    >
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
        <Text className='mt-1 text-xs text-gray-400'>{item.date.toLocaleString()}</Text>
      </View>
      <View className={cn('h-3 w-3 rounded-full', bgColor)} />
    </TouchableOpacity>
  );
};

const CallToActionButton = ({ onPress }: { onPress: () => void }) => {
  const { isDarkColorScheme } = useColorScheme();
  const textColor = isDarkColorScheme
    ? Colors.dark.tint
    : Colors.light.tint;

  return (
    <TouchableOpacity
      onPress={onPress}
      className='mt-4 flex-row items-center justify-center rounded-lg bg-blue-500 p-4'
      accessibilityRole='button'
      accessibilityLabel='Scan new item'
    >
      <CameraIcon className='mr-2 size-6 text-primary' />
      <Text
        className={cn('text-lg font-semibold text-primary', textColor)}
      >
        Scan New Item
      </Text>
    </TouchableOpacity>
  );
};

export default function HistoryTab() {
  // Fetch the user's scan history from the API, temporarily using a mock user ID
  // React Query has a built-in cache, and states like 'isLoading', 'isError', and 'isSuccess'
  //!!: See https://tanstack.com/query/latest/docs/framework/react/overview
  const historyQuery = useGetUserHistory('1');

  //TODO: Implement loading states and error handling
  const historyItems = historyQuery.data?.items ?? [];

  console.log(historyItems);

  const [scannedItems, setScannedItems] = useState<ScannedItemType[]>(
    historyItems,
  );
  const [selectedItem, setSelectedItem] = useState<ScannedItemType | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { isDarkColorScheme } = useColorScheme();

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '75%', '90%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsOpen(true);
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  const handleScanNewItem = () => {
    router.push('/scan');
  };

  const handleItemPress = (itemId: string) => {
    if (isEditing) {
      const updatedSelectedItems = selectedItems.includes(itemId)
        ? selectedItems.filter((id) => id !== itemId)
        : [...selectedItems, itemId];
      setSelectedItems(updatedSelectedItems);
    } else {
      const item = scannedItems.find((item) => item.id === itemId);
      setSelectedItem(item || null);
      handlePresentModalPress();
    }
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
  };

  const handleScanAnotherPhoto = () => {
    closeBottomSheet();
    router.push('/scan');
  };

  const handleRemovePhoto = () => {
    closeBottomSheet();
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    setSelectedItems([]); // Clear selections when exiting edit mode
  };

  const textColor = isDarkColorScheme ? Colors.dark.text : Colors.light.text;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        handleComponent={() => (
          <BottomSheetHandle
            className='mt-2 bg-green-300'
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        )}
        backgroundStyle={{ backgroundColor: '#f3f4f6' }}
      >
        <BottomSheetView className='flex-1 px-4 pb-6 pt-2'>
          {selectedItem && selectedItem.image && (
            <Image
              source={{ uri: selectedItem.image }}
              style={{ width: '100%', height: 300 }}
              contentFit='contain'
            />
          )}
          {selectedItem && (
            <>
              <View className='mt-4 mb-4 flex-row items-center justify-between'>
                <Text className='text-2xl font-bold text-gray-800'>
                  {selectedItem.name}
                </Text>
              </View>

              <View className='mb-6 flex-row items-center rounded-lg bg-blue-500 p-4'>
                <RecycleIcon size={24} color='white' />
                <Text className='ml-2 font-semibold text-white'>
                  Place in {selectedItem.type} Bin
                </Text>
              </View>

              <View className='mb-6 rounded-lg bg-white p-4 shadow-sm'>
                <Text className='text-base leading-relaxed text-gray-600'>
                  {selectedItem.description}
                </Text>
              </View>

              <View className='rounded-lg bg-white p-4 shadow-sm'>
                <View className='mb-3 flex-row items-center'>
                  <Info size={20} color='#4b5563' />
                  <Text className='ml-2 text-lg font-semibold text-gray-800'>
                    Recycling Tips
                  </Text>
                </View>
                {selectedItem.tips.map((tip, index) => (
                  <View key={index} className='mb-2 flex-row items-center'>
                    <View className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                    <Text className='text-gray-600'>{tip}</Text>
                  </View>
                ))}
              </View>

              <View className='mt-6 flex-row justify-between'>
                <TouchableOpacity
                  onPress={handleScanAnotherPhoto}
                  className='mb-6 flex-1 mr-2 flex-row items-center justify-center rounded-lg bg-blue-500 p-4'
                >
                  <CameraIcon size={20} color='white' />
                  <Text className='ml-2 font-semibold text-white'>
                    Scan Another Item
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRemovePhoto}
                  className='mb-6 flex-1 ml-2 flex-row items-center justify-center rounded-lg bg-red-500 p-4'
                >
                  <Trash2 size={20} color='white' />
                  <Text className='ml-2 font-semibold text-white'>
                    Remove Item
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
      <View className='flex-1 px-4 py-2'>
        <View className='mb-4 flex-row items-center justify-between'>
          <Text
            className={cn('text-2xl font-bold', textColor)}
          >
            {isEditing ? `Selected ${selectedItems.length} items` : 'Scan History'}
          </Text>
          <TouchableOpacity onPress={toggleEditMode}>
            {isEditing ? (
              <X size={24} color={textColor} />
            ) : (
              <Pencil size={24} color={textColor} />
            )}
          </TouchableOpacity>
        </View>

        {scannedItems.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {scannedItems.map((item) => (
              <ScannedItem
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item.id)}
                isSelected={isEditing && selectedItems.includes(item.id)}
              />
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