# Empty Astro content collections on GitHub Actions

## Symptom

`scripts/verify-build-content.mjs` fails on the GHA workflow `Quality, Preview
& Deploy`:

```
OK    lessons10xDevs3              source=  5  bundled=  5
FAIL  lessons10xDevs3Prework       source= 15  bundled=  0
FAIL  lessons10xDevs3PreworkEn     source= 15  bundled=  0
```

In reality every collection except `lessons10xDevs3` is missing from the
bundle; the verifier only checks these three. macOS happened to win the race
(below), so the build "worked locally" while Linux/GHA failed. The failure
reproduces deterministically in any clean Linux `astro build`.

## Root cause (confirmed)

A concurrency bug in `astro@5.1.8`
`node_modules/astro/dist/content/mutable-data-store.js` — **not** Nx caching,
**not** stale `.astro` state (a full `rm -rf .astro node_modules/.astro` was
tried and did not help), **not** the verifier regex.

The Cloudflare build bundles content by reading the on-disk
`node_modules/.astro/data-store.json` (the `astro:data-layer-content` virtual
module in `vite-plugin-content-virtual-mod.js`). That file is written by
`MutableDataStore`, whose writer is broken under concurrent load:

1. `content.config.ts` defines 13 collections, all using inline-array loaders
   (`htmlLessonLoader` returns `Promise<Entry[]>`). `ContentLayer.#doSync()`
   runs every loader in parallel via `Promise.all`.
2. Each `store.set()` calls `#saveToDiskDebounced()` (500 ms debounce).
3. The fast/small collection `lessons10xDevs3` (5 small files) finishes its
   `set()` burst first. A debounced `writeToDisk()` then fires and serializes
   that early **partial** snapshot.
4. `#writeFileAtomic()` has an in-progress guard: concurrent callers do
   `#pending.add(); return;`, and when the in-flight write finishes its
   `finally` re-runs `#writeFileAtomic(filePath, data, depth+1)` with the
   **stale `data` captured by the first call** — never re-serializing the now
   complete in-memory store.
5. `writeToDisk()` also early-returns on `!#dirty`, so the authoritative final
   flush at the end of `#doSync()` can be skipped entirely.

Net effect: the on-disk `data-store.json` freezes at the early snapshot
containing only `lessons10xDevs3`. The in-memory store is complete, but the
build only ever reads the stale file, so the prework course (and every other
collection) ships empty. Which collection "wins" is timing-dependent, which is
why it looked intermittent and platform-specific.

## Fix (shipped)

`utils/astro-5-adapter/patch-content-datastore.js`, applied in two places:

- the existing `postinstall` patch chain in the root `package.json`
  (alongside the pre-existing `patch-cloudflare`), for fresh installs and
  local `astro dev`; and
- **the edu-platform `build` script itself**, run before `astro build`.

The build-script invocation is the load-bearing one. The CI workflow
(`quality-preview-deploy.yml`) keys its `node_modules` cache solely on
`hashFiles('package-lock.json')` and only runs `npm ci` (hence `postinstall`)
on a cache miss. A `postinstall`-only patch therefore silently disappears on
every cache hit — which is exactly why the first fix passed once (cache miss)
then regressed (cache hit, stale unpatched `astro` restored). Running the
idempotent patch from `build` guarantees it is applied on every build
regardless of `node_modules` cache state. `verify-build-content.mjs` remains
the backstop: if the patch ever stops applying, the build fails loudly instead
of shipping an empty course.

The patch rewrites `MutableDataStore.writeToDisk()` so it:

- always serializes the **current** in-memory store (no `!#dirty`
  early-return), and
- pushes each write onto a sequential chain whose links re-serialize at run
  time, so the final explicit flush (after the `Promise.all` over all loaders)
  always persists the complete store and no stale snapshot is ever frozen.

`#writeFileAtomic()` is left untouched for asset/module-import files. The patch
is idempotent and no-ops with a warning if the `astro@5.1.8` source signature
changes (re-verify and update the patch on an Astro upgrade).

Verified: with the patch, repeated clean Linux `astro build` runs consistently
bundle 5/5 + 15/15 + 15/15; without it, the same environment reproduces 0/15.

## Notes / superseded theories

- The `rm -rf .astro node_modules/.astro` full-wipe (commit 0f2e465) was
  reverted (fbde69f) because it did not change the failure — confirming this is
  not a stale-state/incremental-sync problem.
- The verifier regex robustness change (fba7243) was a real improvement but not
  the cause; the content genuinely was not in any chunk.
- Converting `htmlLessonLoader` to the Astro 5 object-loader API is still
  reasonable hygiene, but it would **not** have fixed this bug: object loaders
  use the same `scopedStore.set()` → `writeToDisk()` path and the same racy
  writer.
