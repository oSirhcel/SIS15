import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Trash2, Recycle, Leaf } from 'lucide-react-native';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSharedValue } from 'react-native-reanimated';
import { scannedItemsEmitter, ScannedItemType } from './types';

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
}: {
  item: ScannedItemType;
  onPress: () => void;
}) => {
  const { icon: Icon, color, bgColor } = getIconAndColor(item.type);

  return (
    <TouchableOpacity
      onPress={onPress}
      className='mb-2 flex-row items-center rounded-lg bg-card p-4 shadow-sm'
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
        <Text className='text-lg font-semibold'>{item.title}</Text>
        <Text className='text-sm text-gray-600'>{item.description}</Text>
        <Text className='mt-1 text-xs text-gray-400'>{item.date}</Text>
      </View>
      <View className={cn('h-3 w-3 rounded-full', bgColor)} />
    </TouchableOpacity>
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
  const [scannedItems, setScannedItems] = useState<ScannedItemType[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScannedItemType | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

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

  const loadScannedItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('scannedItems');
      if (storedItems) {
        setScannedItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.error('Error loading scanned items:', error);
    }
  };

  React.useEffect(() => {
    // Load scanned items initially
    loadScannedItems();

    // Listen for new scanned items using mitt's "on" method
    const updateScannedItemsListener = () => {
      loadScannedItems();
    };

    scannedItemsEmitter.on('newItemScanned', updateScannedItemsListener);

    // Clean up the listener using mitt's "off" method
    return () => {
      scannedItemsEmitter.off('newItemScanned', updateScannedItemsListener);
    };
  }, []);

  const handleItemPress = (item: ScannedItemType) => {
    setSelectedItem(item);
    handlePresentModalPress(); 
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
  };

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
          {selectedItem && selectedItem.imageUri && (
            <Image
              source={{ uri: selectedItem.imageUri }}
              style={{ width: '100%', height: 300 }}
              contentFit='contain'
            />
          )}
          {selectedItem && (
            <>
              <View className='mt-4 mb-4 flex-row items-center justify-between'>
                <Text className='text-2xl font-bold text-gray-800'>
                  {selectedItem.title}
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
                {/* Replace with actual recycling tips based on item type */}
                <View className='mb-2 flex-row items-center'>
                  <View className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                  <Text className='text-gray-600'>
                    Tip 1 based on {selectedItem.type}
                  </Text>
                </View>
                <View className='mb-2 flex-row items-center'>
                  <View className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                  <Text className='text-gray-600'>
                    Tip 2 based on {selectedItem.type}
                  </Text>
                </View>
              </View>

              <View className='mt-6 flex-row justify-between'>
                <TouchableOpacity
                  onPress={() => {
                    // Implement logic to select image from album
                  }}
                  className='mb-6 flex-row items-center rounded-lg bg-blue-500 p-4'
                >
                  <ImageIcon size={20} color='white' />
                  <Text className='ml-2 font-semibold text-white'>
                    Select from Album
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeBottomSheet}
                  className='mb-6 flex-row items-center rounded-lg bg-red-500 p-4'
                >
                  <CameraIcon size={20} color='white' />
                  <Text className='ml-2 font-semibold text-white'>
                    Return to History
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
      <View className='flex-1 px-4 py-2'>
        <Text className='mb-4 text-2xl font-bold'>Scan History</Text>
        {scannedItems.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {scannedItems.map((item) => (
              <ScannedItem
                key={item.id}
                item={item}
                onPress={() => handleItemPress(item)}
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