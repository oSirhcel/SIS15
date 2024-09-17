import type { GetHistoryResponse } from '@/types';
import { useQuery } from '@tanstack/react-query';

//Development URL
const url = 'https://37rq6tqm-5000.aue.devtunnels.ms';

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

      console.log(response.ok);

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
