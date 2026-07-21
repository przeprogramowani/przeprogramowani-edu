<script lang="ts">
  import type { ValidationIssue } from '../levels/mapAuthoring/types';

  interface Props {
    issues: ValidationIssue[];
  }

  let { issues }: Props = $props();

  const sorted = $derived(
    [...issues].sort((a, b) => (a.level === b.level ? 0 : a.level === 'error' ? -1 : 1)),
  );
</script>

<div class="p-2 border-b border-gray-700">
  <div class="text-xs text-gray-400 mb-2 uppercase tracking-wider">Validation</div>
  {#if sorted.length === 0}
    <div class="text-xs text-emerald-500">No issues.</div>
  {:else}
    <div class="flex flex-col gap-1">
      {#each sorted as issue}
        <div
          class="text-[11px] leading-snug px-1.5 py-1 rounded border-l-2
            {issue.level === 'error'
              ? 'border-red-500 bg-red-950/40 text-red-300'
              : 'border-amber-500 bg-amber-950/30 text-amber-300'}"
        >
          {issue.message}
          {#if issue.at}
            <span class="text-gray-500">({issue.at[0]}, {issue.at[1]})</span>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
