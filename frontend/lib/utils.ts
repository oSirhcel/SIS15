import type { WasteType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { LeafIcon, RecycleIcon, Trash2Icon } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIconAndColor(type: WasteType) {
  switch (type) {
    case 'General Waste':
      return {
        icon: Trash2Icon,
        color: 'Red',
        bgColor: 'bg-rose-500',
      };
    case 'Recycling':
      return {
        icon: RecycleIcon,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500',
      };
    case 'Organic Waste':
      return {
        icon: LeafIcon,
        color: 'Green',
        bgColor: 'bg-green-500',
      };
    
    case 'metal':
      return {
        icon: LeafIcon,
        color: 'Green',
        bgColor: 'bg-green-500',
      };

    default:
      return {
        icon: Trash2Icon,
        color: 'text-gray-500',
        bgColor: 'bg-gray-500',
      };
  }
}
