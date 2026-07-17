<script lang="ts">
  import { onMount } from 'svelte';
  import {
    applyLessonTheme,
    getStoredLessonTheme,
    LESSON_THEME_STORAGE_KEY,
    storeLessonTheme,
    type LessonTheme,
  } from '@/lib/lessonTheme';

  let theme = $state<LessonTheme>('dark');
  let isHydrated = $state(false);

  const nextTheme = $derived<LessonTheme>(theme === 'dark' ? 'light' : 'dark');
  const label = $derived(theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');

  onMount(() => {
    theme = getStoredLessonTheme();
    applyLessonTheme(theme);
    isHydrated = true;
  });

  function toggleTheme() {
    const next = nextTheme;
    theme = next;
    applyLessonTheme(next);

    try {
      storeLessonTheme(next);
    } catch {
      // Storage can be unavailable in private or embedded contexts; keep the current-page visual state.
    }
  }
</script>

<button
  type="button"
  class="lesson-theme-toggle lesson-icon-button"
  aria-label={label}
  title={label}
  data-theme={theme}
  data-storage-key={LESSON_THEME_STORAGE_KEY}
  disabled={!isHydrated}
  onclick={toggleTheme}
>
  <svg class="lesson-theme-toggle__sun h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m12.728 0-1.414-1.414M7.05 7.05 5.636 5.636M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
    />
  </svg>
  <svg class="lesson-theme-toggle__moon h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
    />
  </svg>
</button>
