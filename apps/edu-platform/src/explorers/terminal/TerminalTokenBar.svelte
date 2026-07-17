<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from '../i18n/store';

  export let token: string;
  export let generated: boolean = true;

  const dispatch = createEventDispatcher<{ regenerated: { token: string } }>();

  let copied = false;
  let regenerating = false;

  async function copy() {
    await navigator.clipboard.writeText(token);
    copied = true;
    setTimeout(() => { copied = false; }, 2000);
  }

  async function regenerate() {
    regenerating = true;
    try {
      const res = await fetch('/api/game/token', { method: 'POST' });
      if (!res.ok) throw new Error('Regeneration failed');
      const { token: newToken } = await res.json();
      dispatch('regenerated', { token: newToken });
    } catch {
      // Silently fail — user can retry
    } finally {
      regenerating = false;
    }
  }
</script>

<div class="px-3 py-2 border-t border-teal-800/40 bg-teal-950/30 flex items-center gap-2">
  <span class="text-base font-mono text-teal-300 tracking-wider flex-1 truncate">{token}</span>

  {#if generated}
    <button
      class="text-sm px-2 py-1 rounded border transition-colors flex-shrink-0
        {copied
          ? 'border-teal-500 text-teal-300 bg-teal-900/40'
          : 'border-gray-600 text-gray-400 hover:border-teal-600 hover:text-teal-300'}"
      on:click={copy}>
      {copied ? $t('terminal.tokenCopied') : $t('terminal.tokenCopy')}
    </button>
  {:else}
    <button
      class="text-sm px-2 py-1 rounded border transition-colors flex-shrink-0
        border-gray-600 text-gray-400 hover:border-amber-600 hover:text-amber-300
        disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={regenerating}
      on:click={regenerate}>
      {regenerating ? $t('terminal.tokenGenerating') : $t('terminal.tokenRegenerate')}
    </button>
  {/if}
</div>
