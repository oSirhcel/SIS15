import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Button } from '@/components/ui/button';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { Repeat2Icon } from '@/lib/icons/Repeat2Icon';
import {
  usePermissions as useMediaPermissions,
  saveToLibraryAsync,
  getAssetsAsync,
} from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { useSharedValue } from 'react-native-reanimated';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetTrigger,
  BottomSheetHandle,
} from '@/components/ui/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Info,
  RecycleIcon,
  Image as ImageIcon,
  Camera as CameraIcon,
} from 'lucide-react-native';

export default function Tab() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [mediaPermission, requestMediaPermission] = useMediaPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);

  const [isOpen, setIsOpen] = React.useState(false);

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['50%', '75%', '90%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    if (isOpen) {
      bottomSheetModalRef.current?.dismiss();
      setIsOpen(false);
    } else {
      bottomSheetModalRef.current?.present();
      setIsOpen(true);
    }
  }, [isOpen]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

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

  React.useEffect(() => {
    const fetchLastPhoto = async () => {
      if (mediaPermission?.granted) {
        const { assets } = await getAssetsAsync({
          first: 1,
          sortBy: ['creationTime'],
        });
        if (assets.length > 0) {
          setLastPhoto(assets[0].uri);
        }
      }
    };
    void fetchLastPhoto();
  }, [mediaPermission]);

  if (!cameraPermission || !mediaPermission) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text className='mb-4 text-center'>
          Camera permission is required to use this app
        </Text>
        <Button onPress={requestCameraPermission}>
          <Text>Request Permission</Text>
        </Button>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (!photo) {
        console.log('No photo taken');
        return;
      }
      if (!mediaPermission.granted) {
        await requestMediaPermission();
      }

      handlePresentModalPress();
      await saveToLibraryAsync(photo.uri);
      setLastPhoto(photo.uri);
    }
  };

  const changeFacing = () => {
    setFacing((facing) => (facing === 'back' ? 'front' : 'back'));
  };

  const pickImageFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setLastPhoto(result.assets[0].uri);
      handlePresentModalPress();
    }
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
          {lastPhoto && (
            <Image
              source={{ uri: lastPhoto }}
              style={{ width: '100%', height: 300 }}
              contentFit='contain'
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
      <CameraView
        ref={cameraRef}
        facing={facing}
        style={{
          flex: 1,
        }}
      >
        <View className='absolute bottom-0 left-0 right-0 h-24 bg-black'>
          <View className='flex-1 flex-row items-center justify-between px-4'>
          {lastPhoto && (
              <TouchableOpacity
                onPress={pickImageFromLibrary}
                className='h-16 w-12 overflow-hidden rounded-md border-2 border-white'
              >
                <Image
                  source={{ uri: lastPhoto }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  contentFit='cover'
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={takePicture}
              className='h-16 w-16 items-center justify-center rounded-full bg-white'
            >
              <View className='h-14 w-14 rounded-full bg-gray-200' />
            </TouchableOpacity>
            <Button onPress={changeFacing} variant='ghost'>
              <Repeat2Icon className='h-16 w-12 text-white' />
            </Button>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}