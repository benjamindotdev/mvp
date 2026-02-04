import * as LucideIcons from 'lucide-react';
import { IconDef } from '@/types/layer';
import { LucideIcon } from 'lucide-react';

const EXCLUDED_KEYS = ['createLucideIcon', 'default', 'icons', 'lazyIcon'];

function toKebabCase(str: string) {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export const icons: IconDef[] = (() => {
  const seenIds = new Set<string>();
  return Object.entries(LucideIcons)
    .filter(([name]) => !EXCLUDED_KEYS.includes(name))
    .filter(([name]) => !name.endsWith('Icon')) // Remove alias duplicates like 'SquareIcon'
    .filter(([, component]) => !!component) // Ensure it's not null/undefined
    .map(([name, component]) => ({
      id: toKebabCase(name),
      name: name.replace(/([A-Z])/g, ' $1').trim(),
      component: component as LucideIcon,
      category: 'all'
    }))
    .filter(icon => {
      if (seenIds.has(icon.id)) return false;
      seenIds.add(icon.id);
      return true;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
})();

export const getIconById = (id: string) => icons.find(i => i.id === id);
