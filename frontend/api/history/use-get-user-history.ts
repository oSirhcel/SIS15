import type { GetHistoryResponseType } from '@/types';
import { useQuery } from '@tanstack/react-query';

//Development URL
const url = 'http://127.0.0.1:5000/';

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

      const data = (await response.json()) as GetHistoryResponseType;

      return data;
    },
  });
  return query;
};
