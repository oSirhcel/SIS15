//TODO: Change the types to match the actual data types from the backend

export type ScannedItemType = {
  id: string;
  userId: string;
  name: string;
  description: string;
  image: string | null;
  type: Waste;
  tips: string[];
  date: Date;
  colour: Bin;
};

export type Bin = 'red' | 'yellow' | 'blue';
export type Waste = 'recyclable' | 'biodegradable' | 'trash';

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
  items: ScannedItemType[];
};

export type ScanItemRequest = {
  userId: string;
  img_base64: string;
};
