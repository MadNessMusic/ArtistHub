import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/server';

export default defineConfig({
  output:'server',
  adapters: [vercel()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel()
});