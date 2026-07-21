import { getLocale, type Locale } from '../utils/locale';
import { hudStrings } from './hud';
import { sceneStrings } from './scene';
import { examStrings } from './exam';
import { arcadeStrings } from './arcade';
import { terminalStrings } from './terminal';
import { previewStrings } from './preview';
import { grantStrings } from './grant';
import { navigationStrings } from './navigation';

export const STRINGS = {
  pl: {
    ...hudStrings.pl,
    ...sceneStrings.pl,
    ...examStrings.pl,
    ...arcadeStrings.pl,
    ...terminalStrings.pl,
    ...previewStrings.pl,
    ...grantStrings.pl,
    ...navigationStrings.pl,
  },
  en: {
    ...hudStrings.en,
    ...sceneStrings.en,
    ...examStrings.en,
    ...arcadeStrings.en,
    ...terminalStrings.en,
    ...previewStrings.en,
    ...grantStrings.en,
    ...navigationStrings.en,
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type StringKey = keyof typeof STRINGS.pl;

/**
 * Resolve a localized string for the active locale, with `{name}`-style
 * interpolation. Falls back to `pl` if a key is missing in `en` (defensive).
 */
export function t(key: StringKey, params?: Record<string, string | number>): string {
  const locale = getLocale();
  const dict = STRINGS[locale] as Record<string, string>;
  const fallback = STRINGS.pl as Record<string, string>;
  const raw = dict[key] ?? fallback[key] ?? key;
  if (!params) return raw;
  return raw.replace(/\{(\w+)\}/g, (_match, name: string) => {
    const value = params[name];
    return value === undefined ? `{${name}}` : String(value);
  });
}

export { hudStrings, sceneStrings, examStrings, arcadeStrings, terminalStrings, previewStrings, grantStrings, navigationStrings };
