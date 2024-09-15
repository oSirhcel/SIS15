export type ScannedItemType = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'recyclable' | 'biodegradable' | 'trash';
  imageUri: string | null;
};