export type Visual = 'stacker2' | 'stacker3' | 'pit' | 'puzzle' | 'circulation' | 'two-wheeler' | 'custom';

export const FAMILIES = {
  'two-post': { label: 'Two-post stackers', blurb: 'Double any bay without excavation. Four models from 2000 to 2700 kg.' },
  'heavy-duty': { label: 'Heavy-duty systems', blurb: 'Structural-steel frames for wide platforms, shared pillars and long spans.' },
  'multi-level': { label: 'Multi-level & puzzle', blurb: 'Three levels, sliding puzzles and pit systems for dense sites.' },
  specialised: { label: 'Specialised & custom', blurb: 'Single-post, two-wheeler and fully customised systems for unusual sites.' },
} as const;
