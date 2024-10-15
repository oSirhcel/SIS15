import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';

import { PencilIcon, XIcon } from '@/lib/icons';
import { cn, getIconAndColor } from '@/lib/utils';
import { router } from 'expo-router';
import {
  BottomSheetModal,
} from '@/components/ui/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import type { ScannedItem } from '@/types';

import { useGetUserHistory } from '@/api/history/use-get-user-history';
import { Button } from '@/components/ui/button';
import { DRAWER_SNAP_POINTS } from '@/lib/constants';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { HistoryItemDrawer } from '@/components/history/history-item-drawer'; // Import the new drawer component


const ScannedItem = ({
  item,
  onPress,
  isSelected,
}: {
  item: ScannedItem;
  onPress: () => void;
  isSelected: boolean;
}) => {
  const { icon: Icon, bgColor } = getIconAndColor(item.type);

  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        'mb-2 flex-row items-center rounded-lg p-4',
        isSelected
          ? 'bg-gray-800 dark:bg-blue-100'
          : 'bg-blue-100 dark:bg-gray-800',
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
        <Text
          className={cn(
            'text-lg font-semibold',
            isSelected && 'text-white dark:text-black',
          )}
        >
          {item.type}
        </Text>
        {/* <Text className='text-sm text-gray-600'>{item.type}</Text> */}
        <Text className='mt-1 text-xs text-gray-400'>
          {item.date && item.date.toString()}
        </Text>
      </View>
      <View className={cn('h-3 w-3 rounded-full', bgColor)} />
    </TouchableOpacity>
  );
};

const CallToActionButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button
      onPress={onPress}
      className='mt-4 flex-row items-center justify-center rounded-lg bg-blue-500 p-4'
      accessibilityRole='button'
      accessibilityLabel='Scan new item'
    >
      {/* <CameraIcon className='mr-2 size-6 text-white' /> */}
      <Text className={cn('text-lg font-semibold')}>Scan New Item</Text>
    </Button>
  );
};

export default function HistoryTab() {
  const historyQuery = useGetUserHistory();

  const historyItems = historyQuery.data?.items ?? [];

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScannedItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['90%'], []); // Only one snap point at 90%

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
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
      const item = historyItems.find((item) => item.id === itemId);
      setSelectedItem(item ?? null);
      handlePresentModalPress();
    }
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
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

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1} //Backdrop disappears when dismissed
        appearsOnIndex={0}
      />
    ),
    [],
  );

  if (historyQuery.isLoading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Loading history...</Text>
      </View>
    );
  }

  if (historyQuery.isError) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Error loading history</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        // handleComponent={() => (
        //   <BottomSheetHandle
        //     className='mt-2 bg-green-300'
        //     animatedIndex={animatedIndex}
        //     animatedPosition={animatedPosition}
        //   />
        // )}
        enablePanDownToClose={true} // Enable dismissing by dragging down
        backgroundStyle={{ backgroundColor: '#f3f4f6' }}
      >
        {selectedItem && (
          <HistoryItemDrawer 
            item={selectedItem} 
            onScanAnotherPhoto={handleScanAnotherPhoto} 
            onRemovePhoto={handleRemovePhoto} 
          />
        )}
      </BottomSheetModal>
      <View className='flex-1 px-4 py-2'>
        <View className='mb-4 flex-row items-center justify-between'>
          <Text className={cn('text-2xl font-bold')}>
            {isEditing
              ? `Selected ${selectedItems.length} items`
              : 'Scan History'}
          </Text>
          <TouchableOpacity onPress={toggleEditMode}>
            {isEditing ? (
              <XIcon size={24} className='text-foreground' />
            ) : (
              <PencilIcon size={24} className='text-foreground' />
            )}
          </TouchableOpacity>
        </View>

        {historyItems.length > 0 ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {historyItems.map((item) => (
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