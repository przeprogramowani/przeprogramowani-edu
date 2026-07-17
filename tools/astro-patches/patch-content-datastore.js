// Patch astro@5.1.8 content-layer MutableDataStore.writeToDisk().
//
// Why: the stock implementation early-returns on `!#dirty` and routes every
// write through a debounced `#writeFileAtomic` whose in-progress guard makes
// concurrent callers re-run with a STALE serialized snapshot (the `data`
// captured by the first in-flight write). With many parallel inline content
// loaders (`src/content.config.ts`), the on-disk `data-store.json` freezes at
// an early partial snapshot — only the fastest/smallest collection
// (`lessons10xDevs3`, 5 files) survives, while larger collections
// (`lessons10xDevs3Prework*`, 15 files each) come back with 0 entries. The
// Cloudflare build bundles content straight from that stale file
// (`astro:data-layer-content` reads `data-store.json`), so the prework course
// ships empty and `scripts/verify-build-content.mjs` fails. Reproducible on
// Linux; macOS happened to win the race, hence "works locally, fails on GHA".
//
// Fix: rewrite `writeToDisk()` so it always serializes the CURRENT in-memory
// store and pushes the write onto a sequential chain. Each link re-serializes
// at the moment it runs, so the final explicit flush (called after the
// `Promise.all` over all loaders in `#doSync`) always persists the complete
// store, and no stale snapshot is ever frozen. The shared `#writeFileAtomic`
// helper is left untouched for asset/module-import files.

import fs from 'fs';
import path from 'path';

const target = path.join(
  new URL('.', import.meta.url).pathname,
  '../../node_modules/astro/dist/content/mutable-data-store.js'
);

const SENTINEL = '__PATCHED_DATASTORE_WRITE__';

const ORIGINAL = `  async writeToDisk() {
    if (!this.#dirty) {
      return;
    }
    if (!this.#file) {
      throw new AstroError(AstroErrorData.UnknownFilesystemError);
    }
    try {
      await this.#writeFileAtomic(this.#file, this.toString());
      this.#dirty = false;
    } catch (err) {
      throw new AstroError(AstroErrorData.UnknownFilesystemError, { cause: err });
    }
  }`;

const REPLACEMENT = `  async writeToDisk() {
    // ${SENTINEL}: serialize writes and always flush the current in-memory
    // store. Workaround for the astro@5.1.8 debounced-writer race that dropped
    // content collections from the on-disk data store. See
    // tools/astro-patches/patch-content-datastore.js for the full rationale.
    if (!this.#file) {
      throw new AstroError(AstroErrorData.UnknownFilesystemError);
    }
    this.#dirty = false;
    const file = this.#file;
    const runWrite = async () => {
      const data = this.toString();
      const tempFile = file instanceof URL ? new URL(\`\${file.href}.tmp\`) : \`\${file}.tmp\`;
      await fs.writeFile(tempFile, data);
      await fs.rename(tempFile, file);
    };
    this._dsWriteChain = (this._dsWriteChain ?? Promise.resolve()).then(
      () => runWrite(),
      () => runWrite()
    );
    try {
      await this._dsWriteChain;
    } catch (err) {
      throw new AstroError(AstroErrorData.UnknownFilesystemError, { cause: err });
    }
  }`;

try {
  const content = fs.readFileSync(target, 'utf8');

  if (content.includes(SENTINEL)) {
    console.log('[patch-content-datastore] already patched, skipping');
    process.exit(0);
  }

  if (!content.includes(ORIGINAL)) {
    console.warn(
      '[patch-content-datastore] expected astro@5.1.8 writeToDisk() body not found — ' +
        'skipping patch. If the astro version changed, re-verify the content-layer ' +
        'data-store race and update this patch.'
    );
    process.exit(0);
  }

  fs.writeFileSync(target, content.replace(ORIGINAL, REPLACEMENT), 'utf8');
  console.log('[patch-content-datastore] patched astro MutableDataStore.writeToDisk()');
} catch (error) {
  console.error('[patch-content-datastore] failed:', error.message);
  process.exit(1);
}
