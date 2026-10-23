import type { CollectionEntry } from 'astro:content';

export type Visual = 'stacker2' | 'stacker3' | 'pit' | 'puzzle' | 'circulation' | 'two-wheeler' | 'custom';

/** Picks the illustration that matches a product's system family. */
export function visualFor(data: CollectionEntry<'products'>['data']): Visual {
  switch (data.category) {
    case 'stacker':
      return data.levels.trim().startsWith('3') ? 'stacker3' : 'stacker2';
    case 'pit':
    case 'puzzle':
    case 'circulation':
    case 'two-wheeler':
    case 'custom':
      return data.category;
  }
}

/** Short system code shown on cards, e.g. "STACKER · 2 LVL". */
export function systemLabel(data: CollectionEntry<'products'>['data']): string {
  const family: Record<CollectionEntry<'products'>['data']['category'], string> = {
    stacker: 'Stacker',
    pit: 'Pit',
    puzzle: 'Puzzle',
    circulation: 'Rotary',
    'two-wheeler': '2-Wheeler',
    custom: 'Custom',
  };
  const levels = /^\d/.test(data.levels) ? ` · ${data.levels.split(' ')[0]} LVL` : '';
  return `${family[data.category]}${levels}`;
}
