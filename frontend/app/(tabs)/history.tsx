import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import {
  usePermissions,
  getAssetsAsync,
  type Asset,
} from 'expo-media-library';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetHandle,
} from '@/components/ui/bottom-sheet';
import { useSharedValue } from 'react-native-reanimated';
import {
  Info,
  RecycleIcon,
  Image as ImageIcon,
  Camera as CameraIcon,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import { Button } from '@/components/ui/button';

const numColumns = 3;
const { width } = Dimensions.get('window');
const itemWidth = width / numColumns - 10; // Adjust spacing as needed

export default function HistoryTab() {
  const [mediaPermission, requestMediaPermission] = usePermissions();
  const [photos, setPhotos] = useState<Asset[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ImagePickerAsset | Asset | null>(
    null,
  );

  const [isOpen, setIsOpen] = React.useState(false);

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '75%', '90%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    setIsOpen(!isOpen);
    if (isOpen) {
      bottomSheetModalRef.current?.dismiss();
    } else {
      bottomSheetModalRef.current?.present();
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (mediaPermission?.granted) {
        const { assets } = await getAssetsAsync({
          first: 100, // Fetch up to 100 photos
          sortBy: ['creationTime'],
          mediaType: ['photo'],
        });
        setPhotos(assets);
      } else {
        await requestMediaPermission();
      }
    };
    void fetchPhotos();
  }, [mediaPermission]);

  const openPhoto = (photo: Asset) => {
    setSelectedPhoto(photo);
    handlePresentModalPress();
  };

  const scannedItem = {
    name: 'Plastic Water Bottle',
    binType: 'Recycling',
    binColor: 'blue',
    image: '/placeholder.svg?height=200&width=200',
    description:
      'Plastic water bottles are recyclable and should be placed in the recycling bin. Please make sure to empty and rinse the bottle before recycling.',
    recyclingTips: [
      'Remove the cap and recycle separately',
      'Crush the bottle to save space',
      'Check for recycling symbol (#1 PET or #2 HDPE)',
    ],
  };

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedPhoto(result.assets[0]);
      handlePresentModalPress();
    }
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
    setIsOpen(false);
  };

  if (!mediaPermission?.granted) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='mb-4 text-center'>
          Media library permission is required to view history.
        </Text>
        <Button onPress={requestMediaPermission}>
          <Text>Request Permission</Text>
        </Button>
      </View>
    );
  }

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
          {selectedPhoto && (
            <Image
              source={{ uri: selectedPhoto.uri }}
              style={{ width: '100%', height: 300 }}
            />
          )}
          <View className='mt-4 mb-4 flex-row items-center justify-between'>
            <Text className='text-2xl font-bold text-gray-800'>
              {scannedItem.name}
            </Text>
          </View>

          <View className='mb-6 flex-row items-center rounded-lg bg-blue-500 p-4'>
            <RecycleIcon size={24} color='white' />
            <Text className='ml-2 font-semibold text-white'>
              Place in {scannedItem.binType} Bin
            </Text>
          </View>

          <View className='mb-6 rounded-lg bg-white p-4 shadow-sm'>
            <Text className='text-base leading-relaxed text-gray-600'>
              {scannedItem.description}
            </Text>
          </View>

          <View className='rounded-lg bg-white p-4 shadow-sm'>
            <View className='mb-3 flex-row items-center'>
              <Info size={20} color='#4b5563' />
              <Text className='ml-2 text-lg font-semibold text-gray-800'>
                Recycling Tips
              </Text>
            </View>
            {scannedItem.recyclingTips.map((tip, index) => (
              <View key={index} className='mb-2 flex-row items-center'>
                <View className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                <Text className='text-gray-600'>{tip}</Text>
              </View>
            ))}
          </View>

          <View className='mt-6 flex-row justify-between'>
            <TouchableOpacity
              onPress={pickImageFromLibrary}
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
                Return to Camera
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      <View className='flex-1 px-4 py-2'>
        <Text className='mb-4 text-2xl font-bold'>Scan History</Text>
        <FlatList
          data={photos}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => openPhoto(item)}
              style={{
                width: itemWidth,
                margin: 5,
                aspectRatio: 1, // Maintain aspect ratio for square thumbnails
              }}
            >
              <Image
                source={{ uri: item.uri }}
                style={{ width: '100%', height: '100%' }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}