import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Button } from '@/components/ui/button';
import { type CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import {
  CameraIcon,
  ImageIcon,
  Repeat2Icon,
  ArrowLeftIcon,
} from '@/lib/icons';
import {
  usePermissions as useMediaPermissions,
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
import {
  ScannedItemDrawer,
  ScannedItemDrawerSkeleton,
} from '@/components/scan/scanned-item-drawer';
import { DRAWER_SNAP_POINTS } from '@/lib/constants';
import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useRemoveScannedItems } from '@/api/history/use-get-user-history';

export default function ScanTab() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = useMediaPermissions();
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

  const animatedIndex = useSharedValue<number>(0);
  const animatedPosition = useSharedValue<number>(0);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => DRAWER_SNAP_POINTS, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
      />
    ),
    [],
  );

  const handleOpenModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { mutate, isPending } = useScanItem();
  const { mutate: removeItems } = useRemoveScannedItems();

  const [scannedItem, setScannedItem] = useState<ScannedItem>();

  // Getting permission from the user to access camera.
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

  /*
   * Getting permission from the user to access location data. Ideally the
   * application should still work if they refuse, but we wouldn't be able
   * to show them where they could recycle their batteries for example.
   */
  useEffect(() => {
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    if (!locationPermission) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
      }
    }
  };

  // No longer needed since we get location inside takePicture
  // const getLocation = async () => {
  //   let location = await Location.getCurrentPositionAsync();
  //   setLocation(location);
  // };

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

      // Open the modal first to show loading state
      handleOpenModal();

      // Send the base64 image data to the backend
      if (!photo.base64) {
        console.error('Error: Image data is undefined');
        return;
      }

      // Get location only if permission is granted and location services are enabled
      let latitude = undefined;
      let longitude = undefined;
      if (locationPermission) {
        try {
          const locationResult = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          });
          latitude = locationResult.coords.latitude;
          longitude = locationResult.coords.longitude;
        } catch (error) {
          console.warn('Error getting location:', error);
          // Optionally show an error to user here, but not implemented
        }
      }

      setCurrentPhoto(photo.uri);

      mutate(
        {
          img_base64: photo.base64,
          latitude: latitude,
          longitude: longitude,
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
      base64: true,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    setCurrentPhoto(result.assets[0].uri);
    setScannedItem(undefined);

    if (!result.assets[0].base64) {
      console.error('Error: Image data is undefined');
      return;
    }

    handleOpenModal();

    mutate(
      {
        img_base64: result.assets[0].base64,
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
  };

  const closeBottomSheet = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleScanAnotherPhoto = () => {
    closeBottomSheet();
    setScannedItem(undefined);
    setCurrentPhoto(null);
    router.push('/scan');
  };

  const handleRemovePhotoFromBottomSheet = () => {
    if (scannedItem) {
      Alert.alert(
        'Remove Item',
        'Are you sure you want to remove this item from your history?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              removeItems([scannedItem.id]);
              closeBottomSheet();
              setScannedItem(undefined);
              setCurrentPhoto(null);
            },
          },
        ],
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={() => (
          <BottomSheetHandle
            className='mt-2 bg-primary'
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
          />
        )}
        enablePanDownToClose={false}
      >
        {!!scannedItem && (
          <ScannedItemDrawer
            item={scannedItem}
            onScanAnotherPhoto={handleScanAnotherPhoto}
            onSelectFromLibrary={pickImageFromLibrary}
            onRemovePhoto={handleRemovePhotoFromBottomSheet}
          />
        )}
        {isPending && <ScannedItemDrawerSkeleton />}
      </BottomSheetModal>

      {/* Consistent back button position */}
      <View style={{ position: 'absolute', top: 92, left: 16, zIndex: 10 }}>
        <Button
          onPress={() => {
            router.push('/');
            closeBottomSheet();
          }}
          size={'icon'}
          className='rounded-full bg-background'
        >
          <ArrowLeftIcon size={24} className='text-card-foreground' />
        </Button>
      </View>

      {currentPhoto ? (
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: currentPhoto }}
            contentFit="cover"
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
            }}
          />
          <View className='absolute bottom-0 left-0 right-0 h-32 bg-background'>
            <View className='flex-1 flex-row items-end justify-between px-4'>
              <Button
                onPress={pickImageFromLibrary}
                size={'icon'}
                className='rounded-full bg-primary p-8'
              >
                <ImageIcon className='text-primary-foreground' />
              </Button>
              <Button
                onPress={handleScanAnotherPhoto}
                disabled={isPending}
                size={'icon'}
                className='rounded-full p-8'
              >
                <CameraIcon className='text-primary-foreground' />
              </Button>
            </View>
          </View>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          facing={facing}
          style={{
            flex: 1,
          }}
        >
          <View className='absolute bottom-0 left-0 right-0 h-40 bg-black'>
            <View className='flex-1 flex-row items-center justify-between px-4'>
              <TouchableOpacity
                onPress={pickImageFromLibrary}
                className='h-16 w-12 overflow-hidden rounded-md border-2 border-primary'
              >
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
                <View className='flex h-14 w-14 items-center justify-center rounded-full bg-black'>
                  <View className='size-12 rounded-full bg-white' />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={changeFacing}
                className='flex h-16 w-12 items-center justify-center'
              >
                <Repeat2Icon className='h-16 w-12 text-white' />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </SafeAreaView>
  );
}
