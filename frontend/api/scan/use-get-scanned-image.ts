import { useQuery } from '@tanstack/react-query';

const url = process.env.EXPO_PUBLIC_API_URL;

export const useGetScannedImage = (imageId: string) => {
  return useQuery({
    queryKey: ['scannedImage', imageId],
    queryFn: async () => {
      const response = await fetch(`${url}/image/${imageId}`);
      if (!response.ok) {
        throw new Error(`Error fetching image: ${response.status}`);
      }
      const imageBase64 = await response.text();
      return imageBase64;
    },
  });
};

export const useGetScannedImageIcon = (imageId: string) => {
  return useQuery({
    queryKey: ['scannedImageIcon', imageId],
    queryFn: async () => {
      const response = await fetch(`${url}/image/icon/${imageId}`);
      if (!response.ok) {
        throw new Error(`Error fetching image icon: ${response.status}`);
      }
      const imageBase64 = await response.text();
      return imageBase64;
    },
  });
};