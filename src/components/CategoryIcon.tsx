import React from 'react';
import {
  Moon,
  Smartphone,
  Activity,
  Droplets,
  Utensils,
  Smile,
  Users,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { CategoryId } from '../types';

interface CategoryIconProps {
  categoryId: CategoryId;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ categoryId, className = 'w-5 h-5' }) => {
  switch (categoryId) {
    case 'sleep':
      return <Moon className={className} />;
    case 'digital':
      return <Smartphone className={className} />;
    case 'physical':
      return <Activity className={className} />;
    case 'hydration':
      return <Droplets className={className} />;
    case 'nutrition':
      return <Utensils className={className} />;
    case 'stress':
      return <Smile className={className} />;
    case 'social':
      return <Users className={className} />;
    case 'routine':
      return <CalendarCheck className={className} />;
    default:
      return <CheckCircle2 className={className} />;
  }
};
