import * as crypto from 'node:crypto';

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export const sha1 = (s: string) => crypto.createHash('sha1').update(s).digest('hex');

/**
 * Reasonable token estimate without extra deps.
 * (Small embeddings are fairly tolerant; you can swap in tiktoken later.)
 */
export function estimateTokens(text: string): number {
  // Collapse whitespace, approximate tokens by words * 1.2 (punctuation, subwords)
  const words = text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words * 1.2));
}

/**
 * Normalize cosine distance from Chroma to similarity score (0-1)
 * Chroma cosine distance is in [0,2]; we map to [0,1] similarity
 */
export function normalizeCosineDistance(distance: number): number {
  const clipped = Math.max(0, Math.min(2, distance));
  return 1 - clipped / 2;
}

/**
 * Deduplicate an array by a key function
 */
export function dedupBy<T>(arr: T[], key: (x: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const x of arr) {
    const k = key(x);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(x);
    }
  }
  return out;
}
