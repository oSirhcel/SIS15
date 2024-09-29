import type { ScanItemRequest, ScannedItem } from '@/types';
import { useQueryClient, useMutation } from '@tanstack/react-query';

//const url = process.env.EXPO_PUBLIC_API_URL;
const url = "https://tv6c2rc5.aue.devtunnels.ms:5001";

export const useScanItem = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ScannedItem, Error, ScanItemRequest>({
    mutationFn: async (json) => {
      try {
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
        console.log(response)
        // If the response is not OK, try to extract and log the error
        if (!response.ok) {
          const errorMessage = await getErrorMessage(response); // Custom function to handle various error types
          throw new Error(`Error scanning item: ${errorMessage || 'Unknown error'}`);
        }

        const result = await response.json();
        console.log('Scan successful:', result);
        return result;

      } catch (error) {
        console.error('Error scanning item:', error);
        // Ensure error is a type with a message
        if (error instanceof Error) {
          alert(`Error scanning item: ${error.message}`);
        } else {
          alert('Error scanning item: Unknown error occurred');
        }
        throw error;  // Ensure the error is re-thrown so that react-query handles it
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate the history query for the specific user
      void queryClient.invalidateQueries({
        queryKey: ['history', variables.userId],
      });
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
