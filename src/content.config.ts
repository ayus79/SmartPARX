import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      shortName: z.string(),
      family: z.enum(['two-post', 'heavy-duty', 'multi-level', 'specialised']),
      order: z.number(),
      summary: z.string(),
      // Search-result copy. Title gets ' | SmartPARX' appended (keep ≤ 48 chars); description 140–160 chars.
      seoTitle: z.string().max(48),
      seoDescription: z.string().min(120).max(160),
      model: z.string().optional(),
      variants: z.array(z.string()).default([]),
      // Spec sheet - every value comes from the brochure; omit what it doesn't state.
      capacity: z.string(),
      capacityKg: z.number().optional(),
      platformSizes: z.string().optional(),
      structure: z.string().optional(),
      mechanism: z.string().optional(),
      weight: z.string().optional(),
      paint: z.string().optional(),
      reverseParking: z.string().optional(),
      reverseKg: z.number().optional(),
      baseLength: z.string().optional(),
      colours: z.string().optional(),
      features: z.array(z.string()).default([]),
      addons: z.array(z.string()).default([]),
      image: image().optional(),
      imageFit: z.enum(['cover', 'contain']).default('contain'),
      gallery: z.array(image()).default([]),
      illustration: z.enum(['stacker2', 'stacker3', 'pit', 'puzzle', 'circulation', 'two-wheeler', 'custom']).optional(),
    }),
});

export const collections = { products };
