import { getMapDisplayNames } from '../levels/levelLoader';
import type { BilingualText } from '../i18n/types';

/** Map display names derived from level manifests. Accessed as a getter to ensure levelLoader is initialized. */
export const MAP_DISPLAY_NAMES: Record<string, BilingualText> = new Proxy({} as Record<string, BilingualText>, {
  get(_, prop: string) {
    return getMapDisplayNames()[prop];
  },
  ownKeys() {
    return Object.keys(getMapDisplayNames());
  },
  getOwnPropertyDescriptor(_, prop: string) {
    const names = getMapDisplayNames();
    if (prop in names) {
      return { configurable: true, enumerable: true, value: names[prop] };
    }
    return undefined;
  },
  has(_, prop: string) {
    return prop in getMapDisplayNames();
  },
});

export type MapKey = string;
