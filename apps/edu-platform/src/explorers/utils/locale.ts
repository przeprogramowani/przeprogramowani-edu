import { writable, type Writable, get } from 'svelte/store';
import { devLog } from './logger';

export type Locale = 'pl' | 'en';

const STORAGE_KEY = 'space-explorers-locale';

function loadInitialLocale(): Locale {
  if (typeof localStorage === 'undefined') return 'pl';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'en' ? 'en' : 'pl';
  } catch {
    return 'pl';
  }
}

/**
 * Reactive store for the active UI locale of Space Explorers. Mirrors the
 * `isTouchMode` store precedent for cross-cutting Svelte ↔ Phaser state.
 */
export const locale: Writable<Locale> = writable(loadInitialLocale());

let initialised = false;

/**
 * Subscribe the store to localStorage so every set() persists the choice.
 * Idempotent: a second call returns a no-op cleanup.
 */
export function initLocaleStore(): () => void {
  if (initialised || typeof window === 'undefined') return () => {};
  initialised = true;

  const unsubscribe = locale.subscribe((value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable; ignore */
    }
  });

  return () => {
    unsubscribe();
    initialised = false;
  };
}

export function getLocale(): Locale {
  return get(locale);
}

export function setLocale(next: Locale): void {
  const current = get(locale);
  if (current === next) return;
  devLog(`[Locale] changed ${current} → ${next}`);
  locale.set(next);
}

export function toggleLocale(): void {
  setLocale(get(locale) === 'pl' ? 'en' : 'pl');
}
