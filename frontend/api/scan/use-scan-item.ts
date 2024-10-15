import type { ScanItemRequest, ScannedItem } from '@/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { addScannedItemToHistory } from '../history/use-get-user-history';

const url = process.env.EXPO_PUBLIC_API_URL;

// const url = "https://tv6c2rc5.aue.devtunnels.ms:5001";

export const useScanItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ScannedItem, Error, ScanItemRequest>({
    mutationFn: async (json) => {
      const response = await fetch(`${url}/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      });

      // If the response is not OK, try to extract and log the error
      if (!response.ok) {
        const errorMessage = await getErrorMessage(response); // Custom function to handle various error types
        throw new Error(
          `Error scanning item: ${errorMessage || 'Unknown error'}`,
        );
      }

      const result = (await response.json()) as ScannedItem;
      console.log('Scan successful:', result);
      return result;
    },
    onSuccess: (data) => {
      // Add the scanned item to local storage history
      void addScannedItemToHistory(data);

      // Invalidate the history query
      void queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });

  return mutation;
};

// Helper function to extract error message
const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    // Try to extract a JSON error message
    const errorResponse = await response.json();
    return errorResponse.message || response.statusText || 'Unknown error';
  } catch (e) {
    // Fallback to status text if the error is not JSON
    return response.statusText || 'Unknown error';
  }
};