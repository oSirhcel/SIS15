// Represents a company with a name and website.
export type Company = {
  name: string;
  website: string;
};

// Suggestions for recycling and reuse are separate strings, 
// not just one "suggestions" string.
export type Suggestions = {
  recycle: string;
  reuse: string;
};

// Scanned item object that includes the suggestions, companies, etc.
export type ScannedItem = {
  suggestions: Suggestions;  // Updated to be an object with more fields
  id: string;
  userId: string;
  image: string | null;
  type: WasteType;
  companies: Company[];  // Array of companies
  date: Date;
};

// Enum-like string literals to represent different waste types.
export type WasteType = 'General Waste' | 'Plastic' | 'Organic Waste' | 'Cardboard' | 'Paper' | 'Glass';

// User object representing details about a user.
export type User = {
  id: string;
  username: string;
  email: string;
};

// Response format for fetching the scan history of a user.
export type GetHistoryResponse = {
  userId: string;
  items: ScannedItem[];  // Array of ScannedItem objects
};

// Request format for sending an image for scanning.
export type ScanItemRequest = {
  userId: string;
  img_base64: string;  // Base64 encoded image string
};
