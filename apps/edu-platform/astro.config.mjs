// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import svelte from '@astrojs/svelte';
import sentry from '@sentry/astro';

import cloudflare from '@astrojs/cloudflare';
import { ASTRO_ENV_SCHEMA } from './astro-env';
import { levelEditorDevPlugin } from './scripts/levelEditorDevPlugin.mjs';
export default defineConfig({
  integrations: [
    tailwind(),
    svelte(),
    sentry({
      dsn: process.env.PUBLIC_SENTRY_DSN,
      project: 'javascript-astro',
      org: 'przeprogramowani-ju',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourceMapsUploadOptions: {
        enabled: !!process.env.SENTRY_AUTH_TOKEN,
      },
      // Server-side init is done via @sentry/cloudflare in src/middleware/index.ts
      // and src/server/observability/withApiErrorReporting.ts. The auto-injected
      // @sentry/astro server SDK uses @sentry/node's HTTP transport, which
      // silently drops events on Cloudflare Workers — leave only the browser SDK
      // managed by this integration.
      enabled: { client: true, server: false },
    }),
  ],
  output: 'server',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  server: {
    port: 3000
  },
  prefetch: {
    defaultStrategy: 'hover',
  },
  env: {
    schema: ASTRO_ENV_SCHEMA,
  },
  vite: {
    plugins: [levelEditorDevPlugin()],
    server: {
      allowedHosts: ['.ngrok-free.app', '.ngrok.app', '.ngrok.io'],
    },
    ssr: {
      external: ['fs', 'http', 'https', 'url', 'path', 'os'],
      // lucide-svelte ships .svelte files in its dist; Node's native ESM loader
      // (used when Vite externalizes a dep) has no handler for .svelte, so it
      // must be bundled through Vite + @astrojs/svelte instead.
      noExternal: ['lucide-svelte'],
    },
    build: {
      // Keep .zip assets as standalone files; data: URLs break browser redirects.
      assetsInlineLimit: (filePath) => (filePath.endsWith('.zip') ? false : undefined),
    },
  },
  devToolbar: {
    enabled: false,
  },
});
