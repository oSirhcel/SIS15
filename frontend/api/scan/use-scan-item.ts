import type { ScanItemRequest, ScannedItem } from '@/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';

//const url = process.env.EXPO_PUBLIC_API_URL;
const url = "https://01lbxqjj.aue.devtunnels.ms:5001";

export const useScanItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ScannedItem, Error, ScanItemRequest>({
    mutationFn: async (json) => {
      if (json.img_base64) {
        console.log(`Base64 length: ${json.img_base64.length}`);
      }
      console.log(`${url}/scan`)
      const response = await fetch(`${url}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });
      if (!response.ok) {
        throw new Error('Internal Server Error');
      }

      const data = (await response.json()) as ScannedItem;

      return data;
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['history', variables.userId],
      });
    },
  });

  return mutation;
};
