import { Button } from '@/components/ui/button';
import { Text, View } from 'react-native';
import { useRef } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import {
  usePermissions as useMediaPermissions,
  saveToLibraryAsync,
} from 'expo-media-library';
export default function Index() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = useMediaPermissions();
  const cameraRef = useRef<CameraView>(null);

  //TODO: Styles

  if (!cameraPermission || !mediaPermission) {
    return (
      <View className='flex-1'>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!cameraPermission.granted) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Text>Camera permission is required to use this app</Text>
        <Button onPress={requestCameraPermission}>
          <Text>Request Permission</Text>
        </Button>
      </View>
    );
  }

  //TODO: Stream picture to the server instead of saving to the library
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

      console.log(await saveToLibraryAsync(photo.uri));
    }
  };

  return (
    <View className='flex-1'>
      <CameraView
        ref={cameraRef}
        facing={'back'}
        style={{
          flex: 1,
        }}
      >
        <View className='flex-1 flex-row justify-center'>
          <Button onPress={takePicture} className='m-16 self-end'>
            <Text>Take Picture</Text>
          </Button>
        </View>
      </CameraView>
    </View>
  );
}
