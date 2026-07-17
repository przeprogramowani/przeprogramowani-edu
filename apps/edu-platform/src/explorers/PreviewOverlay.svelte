<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { GameEvents } from './events/GameEvents';
  import type { PreviewShowPayload } from './events/GameEvents';
  import { devLog } from './utils/logger';
  import { t } from './i18n/store';

  export let game: Phaser.Game;

  let visible = false;
  let loaded = false;
  let url = '';
  let title = '';

  $: displayTitle = title || $t('preview.defaultTitle');

  function open(payload: PreviewShowPayload) {
    url = payload.url;
    title = payload.title ?? '';
    loaded = false;
    visible = true;
    game.events.emit(GameEvents.TERMINAL_FOCUS_CHANGED, { focused: true });
    devLog(`[PreviewOverlay] Opened: ${url}`);
  }

  function close() {
    if (!visible) return;
    visible = false;
    url = '';
    game.events.emit(GameEvents.TERMINAL_FOCUS_CHANGED, { focused: false });
    game.events.emit(GameEvents.PREVIEW_DISMISSED);
    devLog('[PreviewOverlay] Closed');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && visible) {
      e.stopPropagation();
      close();
    }
  }

  onMount(() => {
    game.events.on(GameEvents.PREVIEW_SHOW, open);
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    game.events.off(GameEvents.PREVIEW_SHOW, open);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if visible}
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-black/60 z-30" on:click={close}></div>

  <!-- Content card -->
  <div class="fixed inset-4 z-40 flex flex-col rounded-xl overflow-hidden
              border border-teal-700/50 bg-gray-950 shadow-2xl shadow-teal-900/40">
    <!-- Header bar -->
    <div class="flex items-center justify-between px-4 py-2
                bg-gradient-to-r from-gray-900 via-gray-900 to-gray-800
                border-b border-teal-800/40">
      <div class="flex items-center gap-3">
        <span class="text-teal-400 font-mono text-xs tracking-widest uppercase opacity-70">
          // VIZ_laY3R
        </span>
        <span class="text-gray-200 font-mono text-sm">{displayTitle}</span>
      </div>
      <button
        on:click={close}
        class="w-7 h-7 flex items-center justify-center rounded
               text-gray-400 hover:text-white hover:bg-gray-700/60
               transition-colors font-mono text-sm">
        X
      </button>
    </div>

    <!-- Iframe -->
    <iframe
      src={url}
      title={displayTitle}
      class="flex-1 w-full border-0 bg-white transition-opacity duration-200"
      class:opacity-0={!loaded}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      on:load={() => (loaded = true)}
    ></iframe>
  </div>
{/if}
