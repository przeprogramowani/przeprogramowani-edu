import { ChromaClient, IncludeEnum, Collection, Where } from 'chromadb';
import { Hit, Meta, MultiQueryOpts, RetrieveOpts } from './types.js';
import { estimateTokens, normalizeCosineDistance, dedupBy } from './helpers/utilities.js';
import { makeCollection } from './helpers/chroma.js';

function rrfFuse(groups: Hit[][], k = 60): { id: string; score: number; sample: Hit }[] {
  const map = new Map<string, { score: number; sample: Hit }>();
  for (const hits of groups) {
    for (const h of hits) {
      const r = h.rank + 1; // ranks are 0-based → +1
      const add = 1 / (k + r);
      const cur = map.get(h.id);
      if (!cur) map.set(h.id, { score: add, sample: h });
      else cur.score += add;
    }
  }
  return [...map.entries()].map(([id, { score, sample }]) => ({ id, score, sample })).sort((a, b) => b.score - a.score);
}

// Attach parent chunks if present in the raw results (or re-query by parentId if needed)
function attachParents(finals: Hit[], indexById: Map<string, Hit>): Hit[] {
  const out: Hit[] = [];
  for (const h of finals) {
    if (h.meta.parentId) {
      const p = indexById.get(h.meta.parentId);
      if (p) out.push(p);
    }
    out.push(h);
  }
  // prefer unique order: parent precedes child
  return dedupBy(out, (x) => x.id);
}

// Build a context string under a token budget
export function packContext(
  hits: Hit[],
  maxTokens = 900,
  header = 'Źródła (skróty):'
): { context: string; usedTokens: number; items: { title: string; slug: string; text: string }[] } {
  const items: { title: string; slug: string; text: string }[] = [];
  let used = estimateTokens(header);

  for (const h of hits) {
    const title = h.meta.breadcrumbs.join(' › ') || h.meta.sectionTitle;
    const pre = `## ${title}  \n#${h.meta.sectionSlug}\n\n`;
    const toks = estimateTokens(pre + h.text);
    if (used + toks > maxTokens) continue;
    used += toks;
    items.push({ title, slug: h.meta.sectionSlug, text: h.text });
  }

  const context = header + '\n\n' + items.map((i) => `${i.title}\n(${i.slug})\n\n${i.text}\n`).join('\n---\n\n');

  return { context, usedTokens: used, items };
}

// ------- Main: query multiple collections and fuse -------
export async function queryAcrossCollections(
  client: ChromaClient,
  query: string,
  {
    collectionNames,
    nPerCollection = 24,
    where,
    minSim = 0.15,
    attachParent = true,
    accessibleLessonIds,
  }: MultiQueryOpts
): Promise<{ fused: Hit[]; byCollection: Record<string, Hit[]> }> {
  // Open all collections (they embed the queryText internally using their configured embedder)
  const cols: { name: string; col: Collection }[] = [];
  for (const name of collectionNames) {
    cols.push({ name, col: await makeCollection(client, name) });
  }

  const results = await Promise.all(
    cols.map(async ({ name, col }) => {
      const queryParams: {
        queryTexts: string[];
        nResults: number;
        where?: Where;
        include: (IncludeEnum.documents | IncludeEnum.metadatas | IncludeEnum.distances)[];
      } = {
        queryTexts: [query],
        nResults: nPerCollection,
        include: [IncludeEnum.documents, IncludeEnum.metadatas, IncludeEnum.distances],
      };

      if (where) {
        queryParams.where = where as unknown as Where;
      }

      const res = await col.query(queryParams);

      const docs = res.documents?.[0] ?? [];
      const metas = res.metadatas?.[0] ?? [];
      const ids = res.ids?.[0] ?? [];
      const dists = res.distances?.[0] ?? [];

      let hits: Hit[] = [];
      for (let i = 0; i < docs.length; i++) {
        const text = docs[i];
        const id = ids[i];
        const meta = metas[i];
        const dist = dists[i];

        if (text && id && meta && typeof dist === 'number') {
          // Deserialize JSON strings back to arrays/objects
          const deserializedMeta = {
            ...meta,
            breadcrumbs: typeof meta.breadcrumbs === 'string' ? JSON.parse(meta.breadcrumbs) : meta.breadcrumbs,
            blockSpan: typeof meta.blockSpan === 'string' ? JSON.parse(meta.blockSpan) : meta.blockSpan,
            links: meta.links && typeof meta.links === 'string' ? JSON.parse(meta.links) : meta.links,
            images: meta.images && typeof meta.images === 'string' ? JSON.parse(meta.images) : meta.images,
          };

          hits.push({
            id,
            text,
            meta: deserializedMeta as unknown as Meta,
            distance: dist,
            similarity: normalizeCosineDistance(dist),
            rank: i,
            collection: name,
          });
        }
      }

      // Apply access control filter if provided
      if (accessibleLessonIds) {
        hits = hits.filter((h) => accessibleLessonIds.has(h.meta.lessonId));
      }

      // lightweight early filter
      return hits.filter((h) => h.similarity >= minSim);
    })
  );

  // For inspection
  const byCollection: Record<string, Hit[]> = {};
  results.forEach((hits, i) => {
    const col = cols[i];
    if (col) {
      byCollection[col.name] = hits;
    }
  });

  // Fuse
  const fusedRRF = rrfFuse(results);
  // Lift back to Hit, keep similarity as a second sort key
  const fusedHits = fusedRRF.map((x) => x.sample).sort((a, b) => b.similarity - a.similarity);

  // Index for parent attachment and global dedup
  const all = results.flat();
  const index = new Map<string, Hit>();
  for (const h of all) index.set(h.id, h);

  // Dedup identical chunks globally (same id)
  let finals = dedupBy(fusedHits, (h) => h.id);

  // Optionally attach parent section chunks
  if (attachParent) {
    finals = attachParents(finals, index);
  }

  return { fused: finals, byCollection };
}

// ------- Convenience: full pipeline returning LLM-ready context -------
export async function retrieveContext(
  client: ChromaClient,
  query: string,
  opts: RetrieveOpts
): Promise<{
  context: string;
  chunks: Hit[];
  debug: { byCollection: Record<string, Hit[]> };
}> {
  const { finalTopK = 12, contextTokens = 900, similarityFloor = 0.18, ...multi } = opts;

  const { fused, byCollection } = await queryAcrossCollections(client, query, multi);

  // Final filter + cap
  const pruned = fused.filter((h) => h.similarity >= similarityFloor).slice(0, Math.max(finalTopK, 1));

  // Optional tiny lexical bonus as tie-breaker (keyword overlap)
  const qTerms = new Set(query.toLowerCase().split(/\W+/).filter(Boolean));
  pruned.sort((a, b) => {
    const kw = (t: string) => {
      const s = new Set(
        t
          .toLowerCase()
          .split(/\W+/)
          .filter((x) => qTerms.has(x))
      );
      return s.size;
    };
    const da = kw(a.text);
    const db = kw(b.text);
    if (db !== da) return db - da;
    return b.similarity - a.similarity;
  });

  const { context } = packContext(pruned, contextTokens, 'Context (z dopasowanych fragmentów):');

  return { context, chunks: pruned, debug: { byCollection } };
}
