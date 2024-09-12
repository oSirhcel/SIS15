import { clsx, type ClassValue } from 'clsx';
import type { WasteType } from '@/types/scan';
import { LeafIcon, RecycleIcon, Trash2Icon } from '@/lib/icons';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIconAndColor(type: WasteType) {
  switch (type) {
    case 'General Waste':
      return {
        icon: Trash2Icon,
        color: 'text-rose-500',
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
        color: 'text-green-500',
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
