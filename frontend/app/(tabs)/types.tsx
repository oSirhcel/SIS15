import mitt from 'mitt';

export type ScannedItemType = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'recyclable' | 'biodegradable' | 'trash';
  imageUri: string | null;
};

// Create and export the event emitter using mitt
export const scannedItemsEmitter = mitt();