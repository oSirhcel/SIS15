import type { WasteType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { LeafIcon, RecycleIcon, Trash2Icon, Store, Trash2 } from 'lucide-react-native';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIconAndColor(type: WasteType) {
  switch (type) {
    case 'General Waste':
      return {
        icon: Trash2,
        color: 'Place in the Red bin',
        bgColor: 'bg-rose-500',
      };
    case 'Paper':
      return {
        icon: RecycleIcon,
        color: 'Place in the Blue bin',
        bgColor: 'bg-blue-500',
      };
    case 'Organic Waste':
      return {
        icon: LeafIcon,
        color: 'Place in the Green bin',
        bgColor: 'bg-green-500',
      };
    case 'Cardboard':
      return {
        icon: RecycleIcon,
        color: 'Place in the Yellow bin',
        bgColor: 'bg-yellow-500',
      };
    
    case 'Glass':
      return {
        icon: RecycleIcon,
        color: 'Place in the Yellow bin',
        bgColor: 'bg-yellow-500',
      };
    
    case 'Plastic':
      return {
        icon: RecycleIcon,
        color: 'Place in the Blue bin',
        bgColor: 'bg-blue-500',
      };

    default:
      return {
        icon: Trash2,
        color: 'Please refer to reuse/recycle suggestions',
        bgColor: 'bg-purple-500',
      };
  }
}
