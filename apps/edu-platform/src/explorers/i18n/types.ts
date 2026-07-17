import type { Locale } from '../utils/locale';
import { getLocale } from '../utils/locale';

export type BilingualText = Record<Locale, string>;

/**
 * Resolve a `BilingualText` to a plain string in the active locale.
 * Falls back to `pl` if the active locale entry is missing/empty (defensive
 * runtime fallback — the parity test still treats missing `en` keys as a
 * failing build).
 */
export function localized(text: BilingualText): string {
  const locale = getLocale();
  return text[locale] || text.pl;
}
