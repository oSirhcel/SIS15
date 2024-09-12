//TODO: Change the types to match the actual data types from the backend

export type ScannedItemType = {
  id: string;
  name: string;
  description: string;
  image?: string;
  type: WasteType;
  tips: string[];
  date: Date;
};

export type WasteType = 'General Waste' | 'Recycling' | 'Organic Waste';
