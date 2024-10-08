import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/button';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import { Repeat2Icon } from '@/lib/icons';
import { DRAWER_SNAP_POINTS } from '@/lib/constants';
import {
  usePermissions as useMediaPermissions,
  getAssetsAsync,
} from 'expo-media-library';
import { useSharedValue } from 'react-native-reanimated';
import {
  BottomSheetModal,
  BottomSheetHandle,
} from '@/components/ui/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGetScannedItemData } from '@/api/useGetScannedItemData';
import { ScannedItemDrawer } from '@/components/scan/scanned-item-drawer';
import type { ScannedItemType } from '@/types/scan';

export default function Tab() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [mediaPermission, requestMediaPermission] = useMediaPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [scannedItem, setScannedItem] = useState<ScannedItemType | null>(null);

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => DRAWER_SNAP_POINTS, []);

  const handleOpenModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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

      handleOpenModal();
      //TODO: Error handling
      const res = await useGetScannedItemData();
      setScannedItem({
        ...res,
        image: photo.uri,
      });
    }
  };

  const changeFacing = () => {
    setFacing((facing) => (facing === 'back' ? 'front' : 'back'));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onClose={() => setScannedItem(null)}
        handleComponent={() => (
          <BottomSheetHandle
            className='mt-2 bg-green-300'
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        )}
        backgroundStyle={{ backgroundColor: '#f3f4f6' }}
      >
        {scannedItem && <ScannedItemDrawer item={scannedItem} />}
      </BottomSheetModal>
      <CameraView
        ref={cameraRef}
        facing={facing}
        ratio='4:3'
        style={{
          flex: 1,
        }}
      >
        <View className='absolute bottom-0 left-0 right-0 h-24 bg-black'>
          <View className='flex-1 flex-row items-center justify-between px-4'>
            {lastPhoto && (
              <TouchableOpacity className='h-16 w-12 overflow-hidden rounded-md border-2 border-white'>
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
