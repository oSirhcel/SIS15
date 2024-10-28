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