import type { GetHistoryResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

const url = process.env.EXPO_PUBLIC_API_URL;

export const useGetUserHistory = (userId: string) => {
  const query = useQuery({
    // The query key is used to generate the cache key for the data
    queryKey: ['history', userId],
    queryFn: async () => {
      const response = await fetch(`${url}/history?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = (await response.json()) as GetHistoryResponse;

      console.log(data);

      return data;
    },
  });
  return query;
};
