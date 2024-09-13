import type { GetUsersResponseType } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export const useGetUsers = () => {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:5000/');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = (await response.json()) as GetUsersResponseType;

      return data;
    },
  });
  return query;
};
