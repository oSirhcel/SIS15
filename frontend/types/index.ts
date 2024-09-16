//TODO: Change the types to match the actual data types from the backend

export type ScannedItem = {
  id: string;
  userId: string;
  name: string;
  description: string;
  image?: string;
  type: Waste;
  tips: string[];
  date: Date;
};

export type Waste = 'General Waste' | 'Recycling' | 'Organic Waste';

export type User = {
  id: string;
  username: string;
  email: string;
};

export type GetUsersResponse = {
  users: User[];
};

export type GetHistoryResponse = {
  userId: string;
  items: ScannedItem[];
};

export type ScanItemRequest = {
  userId: string;
  img_base64: string;
};
