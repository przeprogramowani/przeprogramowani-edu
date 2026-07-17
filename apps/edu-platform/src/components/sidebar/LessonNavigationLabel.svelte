<script lang="ts">
  import type { SidebarLessonItem } from './types';

  interface Props {
    name: string;
    personalization?: SidebarLessonItem['personalization'];
    textClass?: string;
    nameClass?: string;
  }

  const {
    name,
    personalization,
    textClass = 'text-xs',
    nameClass = 'min-w-0',
  }: Props = $props();
</script>

<span class={`grid min-w-0 grid-cols-[minmax(0,1fr)_1rem] items-start gap-2 ${textClass}`}>
  <span class={nameClass}>{name}</span>
  {#if personalization}
    <span
      class="group/recommendation relative flex h-4 w-4 items-center justify-center text-[13px] leading-none text-amber-200"
      aria-label={personalization.tooltip}
    >
      {personalization.label}
      <span
        class="pointer-events-none absolute right-0 top-5 z-50 w-64 rounded-md border border-gray-700 bg-gray-950 px-3 py-2 text-left text-xs leading-snug text-gray-100 opacity-0 shadow-lg transition duration-100 group-hover/recommendation:translate-y-0 group-hover/recommendation:opacity-100"
        aria-hidden="true"
      >
        {personalization.tooltip}
      </span>
    </span>
  {:else}
    <span aria-hidden="true"></span>
  {/if}
</span>
