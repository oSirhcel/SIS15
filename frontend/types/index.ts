//TODO: Change the types to match the actual data types from the backend

export type ScannedItemType = {
  id: string;
  userId: string;
  name: string;
  description: string;
  image?: string;
  type: WasteType;
  tips: string[];
  date: Date;
};

export type WasteType = 'General Waste' | 'Recycling' | 'Organic Waste';

export type UserType = {
  id: string;
  username: string;
  email: string;
};

export type GetUsersResponseType = {
  users: UserType[];
};

export type GetHistoryResponseType = {
  userId: string;
  items: ScannedItemType[];
};
