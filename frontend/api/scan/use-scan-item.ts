import type { ScanItemRequest, ScannedItemType } from '@/types/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';

//Forwarded Backend URL
const url = 'https://t9bh2v5k-5000.aue.devtunnels.ms';

export const useScanItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ScannedItemType, Error, ScanItemRequest>({
    mutationFn: async (json) => {
      if (json.img_base64) {
        console.log(`Base64 length: ${json.img_base64.length}`);
      }
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

      const data = (await response.json()) as ScannedItemType;

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