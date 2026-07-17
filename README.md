# edu-platform

Standalone Nx monorepo for the Przeprogramowani course platform
(extracted from `przeprogramowani/przeprogramowani-sites`).

## Layout

| Path | Purpose |
|------|---------|
| `apps/edu-platform` | Astro 5 + Svelte 5 course platform (Cloudflare Pages) |
| `apps/10x-assistant` | AI course assistant — Astro + React + ChromaDB retrieval (Cloudflare Pages) |
| `apps/slides` | React + Vite slide decks |
| `apps/10x-rag` | Lesson HTML → ChromaDB ingest pipeline. NOT an npm workspace (own lockfile, `npm ci` in-dir); lives under `apps/` because `10x-assistant` imports its `src/lib/query-service` via a relative sibling path |
| `libs/circle` | Circle.so API client + course access config (`@edu/circle`) |
| `tools/astro-patches` | Build-critical patches for astro@5.1.8 and the Cloudflare adapter (run on postinstall + prebuild — do not remove) |
| `tools/circle-lesson-backup` | Scheduled Circle content backup/restore scripts |

## Getting started

```bash
npm install          # runs both astro patches via postinstall
npm run dev:edu      # local dev server on :3000
npm run test:edu     # vitest
npm run build:edu    # full build incl. lesson-html checks and content verification
```

Nx targets: `npx nx run edu-platform:check|test|build|deploy|deploy:preview`.

## Provenance

Created by `utils/extract-edu-platform/extract.mjs` in the source monorepo.
Migration runbook: see `apps/edu-platform/context/changes/edu-platform-extraction/runbook.md`.
Git history intentionally starts fresh; the full history lives in
`przeprogramowani/przeprogramowani-sites`.
