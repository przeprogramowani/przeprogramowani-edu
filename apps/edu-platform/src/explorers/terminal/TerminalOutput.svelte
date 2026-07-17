<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { lineClass, lineText, type TerminalBlock } from './terminalTypes';
  import type { InteractiveItem } from './commandHandler';

  export let blocks: TerminalBlock[] = [];
  export let interactiveItems: InteractiveItem[] = [];
  // Increment to trigger a scroll-to-bottom (ignored on live-update ticks)
  export let scrollTrigger = 0;

  const dispatch = createEventDispatcher<{ interactiveClick: InteractiveItem }>();

  let outputEl: HTMLDivElement;

  $: if (scrollTrigger && outputEl) {
    requestAnimationFrame(() => { outputEl.scrollTop = outputEl.scrollHeight; });
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div bind:this={outputEl} class="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
  {#each blocks as block (block.id)}
    {#each block.lines as line}
      <div class="text-base leading-relaxed whitespace-pre-wrap {lineClass(line)}">
        {lineText(line)}
      </div>
    {/each}
  {/each}

  {#if interactiveItems.length > 0}
    {#each interactiveItems as item}
      <div
        class="text-base text-teal-400 cursor-pointer hover:text-teal-200 hover:bg-teal-900/20 px-2 py-1 rounded transition-colors"
        on:click={() => dispatch('interactiveClick', item)}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === 'Enter' && dispatch('interactiveClick', item)}>
        {item.label}
      </div>
    {/each}
  {/if}
</div>
