import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/button';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { Repeat2Icon } from '@/lib/icons';
import {
  usePermissions as useMediaPermissions,
  saveToLibraryAsync,
  getAssetsAsync,
} from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useSharedValue } from 'react-native-reanimated';
import {
  BottomSheetModal,
  BottomSheetHandle,
} from '@/components/ui/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';
import { useScanItem } from '@/api/scan/use-scan-item';
import type { ScannedItem } from '@/types';
import { ScannedItemDrawer } from '@/components/scan/scanned-item-drawer';
import { DRAWER_SNAP_POINTS } from '@/lib/constants';

export default function Tab() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [mediaPermission, requestMediaPermission] = useMediaPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => DRAWER_SNAP_POINTS, []);

  const handleOpenModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { mutate, isPending } = useScanItem();

  const [scannedItem, setScannedItem] = useState<ScannedItem>();

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
      const photo = await cameraRef.current.takePictureAsync({
        base64: true, // Capture the image as a base64 string
      });
      if (!photo) {
        console.log('No photo taken');
        return;
      }
      if (!mediaPermission.granted) {
        await requestMediaPermission();
      }

      //Open the modal first to show loading state
      handleOpenModal();

      // Send the base64 image data to the backend
      if (photo.base64) {
        // Check if photo.base64 is defined
        mutate(
          {
            img_base64: photo.base64,
            userId: '1', // Replace with actual user ID
          },
          {
            onSuccess: (data) => {
              setScannedItem(data);
            },
            onError: (error) => {
              console.error('Error scanning item:', error);
              // Handle error, e.g., show an error message to the user
            },
          },
        );
      } else {
        console.error('Error: Image data is undefined');
        throw new Error();
        // Handle the error, e.g., show an error message to the user
      }

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
      base64: true, // Get the image as a base64 string
    });

    if (!result.canceled && result.assets.length > 0) {
      setLastPhoto(result.assets[0].uri);

      // Send the base64 image data to the backend
      if (result.assets[0].base64) {
        // Check if base64 is defined
        mutate(
          {
            img_base64: result.assets[0].base64,
            userId: '1', // Replace with actual user ID
          },
          {
            onSuccess: (data) => {
              setScannedItem(data);
              handleOpenModal();
            },
            onError: (error) => {
              console.error('Error scanning item:', error);
              // Handle error, e.g., show an error message to the user
            },
          },
        );
      } else {
        console.error('Error: Image data is undefined');
        throw new Error();
        // Handle the error, e.g., show an error message to the user
      }
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        handleComponent={() => (
          <BottomSheetHandle
            className='mt-2 bg-green-300'
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        )}
        backgroundStyle={{ backgroundColor: '#f3f4f6' }}
      >
      
        {scannedItem && (
          <ScannedItemDrawer
            item={scannedItem}
            lastPhoto={lastPhoto}
            handleRemovePhoto={handleRemovePhoto}
            handleScanAnotherPhoto={handleScanAnotherPhoto}
          />
        )}
        {
          //TODO: Replace with loader/skeleton later
        }
        {isPending && (
          <View className='flex-1 items-center justify-center'>
            <Text>Loading...</Text>
          </View>
        )}
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
            <TouchableOpacity // Always render the TouchableOpacity
              onPress={pickImageFromLibrary}
              className='h-16 w-12 overflow-hidden rounded-md border-2 border-white'
            >
              {/* Conditionally render the image if lastPhoto exists */}
              {lastPhoto && (
                <Image
                  source={{ uri: lastPhoto }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  contentFit='cover'
                />
              )}
            </TouchableOpacity>
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
