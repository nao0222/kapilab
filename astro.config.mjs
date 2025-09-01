// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Astro の静的ビルド用設定
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    build: {
      cssCodeSplit: true, // CSS を JS から分離してファイル化
    },
  },
  site: 'https://kapilab.jp',
  base: '/',
});