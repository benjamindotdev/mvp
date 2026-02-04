import { LucideIcon } from 'lucide-react';

export interface Layer {
    id: string;
    iconId: string;
    x: number;
    y: number;
    scale: number;
    rotate: number;
    opacity: number;
    color: string;
    zIndex: number;
}

export interface IconDef {
  id: string;
  name: string;
  component: LucideIcon;
  category: string;
}
