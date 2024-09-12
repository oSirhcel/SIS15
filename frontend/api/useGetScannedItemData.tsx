//MOCK API
//TODO: Implement API call to get scanned item

import type { ScannedItem } from '@/types/scan';

export function useGetScannedItemData(): Promise<ScannedItem> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        name: 'Plastic Water Bottle',
        type: 'Organic Waste',
        description:
          'Plastic water bottles are recyclable and should be placed in the recycling bin. Please make sure to empty and rinse the bottle before recycling.',
        tips: [
          'Remove the cap and recycle separately',
          'Crush the bottle to save space',
          'Check for recycling symbol (#1 PET or #2 HDPE)',
        ],
        date: new Date(),
      });
    }, 1000);
  });
}
