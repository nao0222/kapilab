// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    build: {
      cssCodeSplit: true, // CSS を JS から分離してファイル化
    },
  },
  site: 'https://kapilab.jp',
  base: '/',
  adapter: cloudflare(),
});