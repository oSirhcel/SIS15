import type { ScanItemRequestType, ScannedItemType } from '@/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';

//Forwarded Backend URL
const url = 'https://4d9pbj7j-5000.aue.devtunnels.ms';

export const useScanItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ScannedItemType, Error, ScanItemRequestType>({
    mutationFn: async (json) => {
      const response = await fetch(`${url}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });

      console.log(response.ok);

      if (!response.ok) {
        throw new Error('Internal Server Error');
      }

      const data = (await response.json()) as ScannedItemType;

      console.log(data);

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
