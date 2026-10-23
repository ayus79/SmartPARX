// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.smartparx.com',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      serialize(item) {
        if (item.url === 'https://www.smartparx.com/') {
          return { ...item, priority: 1.0 };
        }
        if (item.url.includes('/products/') && item.url !== 'https://www.smartparx.com/products') {
          return { ...item, priority: 0.9 };
        }
        if (item.url === 'https://www.smartparx.com/products') {
          return { ...item, priority: 0.9 };
        }
        return { ...item, priority: 0.7 };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
