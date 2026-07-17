<script lang="ts">
  import { onMount } from 'svelte';
  import { getExternalLessonShellCopy } from '@/lib/externalLessonShellCopy';
  import { SIDEBAR_STORAGE_KEY, EXTERNAL_SIDEBAR_STORAGE_KEY } from '@/lib/topBarHelpers';

  interface Props {
    labels?: {
      collapseMenu: string;
      expandMenu: string;
    };
  }

  const { labels = getExternalLessonShellCopy() }: Props = $props();

  let isCollapsed = $state(false);
  let isHydrated = $state(false);

  onMount(() => {
    try {
      // Migration: read old key if new one doesn't exist
      let saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved === null) {
        const legacy = localStorage.getItem(EXTERNAL_SIDEBAR_STORAGE_KEY);
        if (legacy !== null) {
          localStorage.setItem(SIDEBAR_STORAGE_KEY, legacy);
          localStorage.removeItem(EXTERNAL_SIDEBAR_STORAGE_KEY);
          saved = legacy;
        }
      }
      if (saved !== null) {
        isCollapsed = JSON.parse(saved);
      }
    } catch {
      // localStorage blocked or contained invalid JSON — fall back to default expanded state.
    }
    isHydrated = true;
    updateBodyClass();
  });

  function toggle() {
    isCollapsed = !isCollapsed;
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isCollapsed));
    } catch {
      // Storage unavailable — toggle still works visually, just won't persist.
    }
    updateBodyClass();
  }

  function updateBodyClass() {
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
  }
</script>

{#if isHydrated}
  <button
    class="lesson-icon-button sidebar-toggle-button fixed z-50 hidden h-12 w-6 items-center justify-center rounded-r-md transition-all duration-300 md:flex"
    class:collapsed={isCollapsed}
    onclick={toggle}
    aria-label={isCollapsed ? labels.expandMenu : labels.collapseMenu}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4 transition-transform duration-300"
      class:rotate-180={isCollapsed}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
{/if}

<style>
  .sidebar-toggle-button {
    top: 4.5rem;
    left: calc(var(--sidebar-width) - 4px);
  }

  .sidebar-toggle-button.collapsed {
    left: 0;
  }
</style>
