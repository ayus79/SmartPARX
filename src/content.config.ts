import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    shortName: z.string(),
    category: z.enum(['stacker', 'pit', 'puzzle', 'circulation', 'two-wheeler', 'custom']),
    summary: z.string(),
    capacity: z.string(),
    liftSpeed: z.string(),
    levels: z.string(),
    powerSupply: z.string(),
    features: z.array(z.string()),
    safetyFeatures: z.array(z.string()),
    applications: z.array(z.string()),
    order: z.number().default(99),
  }),
});

export const collections = { products };
