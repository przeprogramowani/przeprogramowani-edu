import { slug } from 'github-slugger';

/**
 * Slugify text to create URL-friendly IDs
 * Uses github-slugger to match Astro's default markdown heading ID generation
 *
 * @param text - Text to slugify
 * @returns Slugified string (e.g., "Krok 1: Wybór" → "krok-1-wybór")
 */
export function slugify(text: string): string {
  return slug(text);
}
