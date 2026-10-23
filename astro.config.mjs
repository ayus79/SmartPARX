// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://www.smartparx.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  redirects: {
    '/gallery': '/projects',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/gallery'),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const priority = path === '/' ? 1.0 : path.startsWith('/products') || path === '/planning-guide' ? 0.9 : 0.7;
        return { ...item, priority };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
