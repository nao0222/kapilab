// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Astro の静的ビルド用設定
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://kapilab.jp',
  base: '/',
  // output: 'static',
});