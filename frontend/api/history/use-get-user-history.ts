import type { ScannedItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const STORAGE_KEY = 'scanHistory';

export const useGetUserHistory = () => {
  const query = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const historyString = await AsyncStorage.getItem(STORAGE_KEY);
      const history: ScannedItem[] = historyString ? JSON.parse(historyString) : [];
      return { items: history };
    },
  });
  return query;
};

export const addScannedItemToHistory = async (item: ScannedItem) => {
  try {
    const historyString = await AsyncStorage.getItem(STORAGE_KEY);
    const history: ScannedItem[] = historyString ? JSON.parse(historyString) : [];

    // Set the date property (used solely for history item)
    item.date = new Date();

    // Store the image as base64 in the history item
    if (item.image) {
      const response = await fetch(item.image);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        item.image = base64data.split(',')[1]; // Remove the data type prefix
      };
    }

    history.push(item);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error adding item to history:', error);
  }
};

export const useRemoveScannedItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemIdsToRemove: string[]) => {
      const historyString = await AsyncStorage.getItem(STORAGE_KEY);
      const history: ScannedItem[] = historyString ? JSON.parse(historyString) : [];

      const updatedHistory = history.filter(
        (item) => !itemIdsToRemove.includes(item.id),
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
};