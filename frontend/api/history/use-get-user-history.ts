import type { GetHistoryResponse, ScannedItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';

const STORAGE_KEY = 'scanHistory';

export const useGetUserHistory = () => {
  const query = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const historyString = await AsyncStorage.getItem(STORAGE_KEY);
      const history: ScannedItem[] = historyString ? JSON.parse(historyString) : [];
      return { items: history };
    },
    initialData: { items: [] }, // Provide initial data to avoid loading state
  });
  return query;
};

export const addScannedItemToHistory = async (item: ScannedItem) => {
  try {
    const historyString = await AsyncStorage.getItem(STORAGE_KEY);
    const history: ScannedItem[] = historyString ? JSON.parse(historyString) : [];

    // Set the date property (used solely for history item)
    item.date = new Date()

    history.push(item);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error adding item to history:', error);
  }
};