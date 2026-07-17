<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from '../i18n/store';

  export let pulse: boolean = false;

  const dispatch = createEventDispatcher<{ unlock: void }>();

  let input = '';
  let error = '';
  let shake = false;
  let inputEl: HTMLInputElement;

  $: if (inputEl) inputEl.focus();

  function submit() {
    if (input === '1030') {
      error = '';
      dispatch('unlock');
    } else {
      error = $t('terminal.lockInvalidCode');
      shake = true;
      setTimeout(() => { shake = false; }, 500);
      input = '';
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') submit();
    if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
  }
</script>

<div class="flex flex-col items-center justify-center h-full px-6 text-center gap-6">
  <div class="text-3xl">🔒</div>
  <h2 class="text-lg font-bold text-gray-400 tracking-wider">{$t('terminal.lockGreeting')}</h2>
  <div class="text-base text-gray-600 leading-relaxed">
    {$t('terminal.lockBlockedLine1')}<br />
    {$t('terminal.lockBlockedLine2')}
  </div>
  <div class="relative">
    <input
      bind:this={inputEl}
      bind:value={input}
      on:keydown={handleKeydown}
      type="text"
      maxlength="4"
      placeholder="____"
      class="w-32 text-center text-2xl tracking-[0.5em] bg-gray-900 border border-gray-700 text-teal-400 py-2 px-3 font-mono focus:outline-none focus:border-teal-500
        {pulse ? 'animate-pulse border-teal-500 shadow-[0_0_12px_rgba(0,212,170,0.3)]' : ''}
        {shake ? 'animate-shake' : ''}" />
  </div>
  {#if error}
    <div class="text-red-400 text-sm">{error}</div>
  {/if}
  <div class="text-sm text-gray-700 leading-relaxed mt-4">{$t('terminal.lockMotto')}</div>
</div>

<style>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  .animate-shake {
    animation: shake 0.4s ease-in-out;
  }
</style>
