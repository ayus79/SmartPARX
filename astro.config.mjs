// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// SITE_URL / BASE_PATH let the same code deploy to the real domain (defaults) or a sub-path such as GitHub Pages.
const SITE = process.env.SITE_URL ?? 'https://www.smartparx.com';
const BASE = process.env.BASE_PATH ?? '/';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'never',
  redirects: {
    // Astro doesn't prefix redirect targets with `base`, so do it here.
    '/gallery': `${BASE.replace(/\/$/, '')}/projects`,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/gallery'),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(BASE.replace(/\/$/, ''), '').replace(/\/$/, '') || '/';
        const priority = path === '/' ? 1.0 : path.startsWith('/products') || path === '/planning-guide' ? 0.9 : 0.7;
        return { ...item, priority };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
