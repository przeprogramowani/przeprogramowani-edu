import { derived } from 'svelte/store';
import { locale } from '../utils/locale';
import { t as tStatic, type StringKey } from './index';

/**
 * Reactive `$t` for Svelte components. Recomputes whenever the locale
 * store changes so `{$t('hud.homeButton')}` re-renders automatically.
 */
export const t = derived(
  locale,
  // depend on the locale value so Svelte re-runs the function on change
  () => (key: StringKey, params?: Record<string, string | number>) => tStatic(key, params)
);
