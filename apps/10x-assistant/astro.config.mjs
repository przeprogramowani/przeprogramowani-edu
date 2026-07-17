// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  server: {
    port: 3000,
  },

  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['fs', 'http', 'https', 'url', 'path', 'os', 'crypto'],
    },
  },

  devToolbar: {
    enabled: false,
  },

  integrations: [react()],
  adapter: cloudflare(),

  env: {
    schema: {
      OPENAI_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      CHROMA_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHROMA_TENANT: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHROMA_DATABASE: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      CHROMA_DB_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
});
