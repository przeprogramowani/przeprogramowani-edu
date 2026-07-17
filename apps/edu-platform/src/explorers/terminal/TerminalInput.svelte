<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { t } from '../i18n/store';

  export let availableCommands: string[] = [];

  const dispatch = createEventDispatcher<{ submit: string }>();

  let commandInput = '';
  let suggestions: string[] = [];
  let selectedSuggestion = -1;
  let inputEl: HTMLInputElement;

  export function focus() {
    inputEl?.focus();
  }

  $: if (inputEl) inputEl.focus();

  $: {
    if (commandInput.startsWith('/')) {
      const typed = commandInput.slice(1).toLowerCase();
      suggestions = typed === ''
        ? availableCommands
        : availableCommands.filter((c) => c.startsWith(typed));
      if (suggestions.length === 1 && `/${suggestions[0]}` === commandInput) {
        suggestions = [];
      }
    } else {
      suggestions = [];
    }
    selectedSuggestion = suggestions.length > 0 ? 0 : -1;
  }

  function applySuggestion(cmd: string) {
    commandInput = `/${cmd} `;
    suggestions = [];
    selectedSuggestion = -1;
    inputEl?.focus();
  }

  function submitCommand(raw: string) {
    commandInput = '';
    suggestions = [];
    selectedSuggestion = -1;
    dispatch('submit', raw.trim());
  }

  function handleKeydown(e: KeyboardEvent) {
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSuggestion = selectedSuggestion < suggestions.length - 1 ? selectedSuggestion + 1 : 0;
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSuggestion = selectedSuggestion > 0 ? selectedSuggestion - 1 : suggestions.length - 1;
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        submitCommand(`/${suggestions[selectedSuggestion >= 0 ? selectedSuggestion : 0]}`);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        applySuggestion(suggestions[selectedSuggestion >= 0 ? selectedSuggestion : 0]);
        return;
      }
      if (e.key === 'Escape') {
        suggestions = [];
        selectedSuggestion = -1;
        return;
      }
    }
    if (e.key === 'Enter') {
      submitCommand(commandInput);
    }
  }
</script>

{#if suggestions.length > 0}
  <div class="px-3 py-1 border-t border-gray-800/50">
    {#each suggestions as cmd, i}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="px-2 py-0.5 text-base cursor-pointer transition-colors
          {i === selectedSuggestion ? 'text-teal-400 bg-teal-900/30' : 'text-gray-500 hover:text-gray-300'}"
        on:click={() => applySuggestion(cmd)}>
        /{cmd}
      </div>
    {/each}
  </div>
{/if}

<div class="flex items-center px-3 py-2 border-t border-gray-800 bg-gray-900/30">
  <span class="text-teal-400 mr-2">&gt;</span>
  <input
    bind:this={inputEl}
    bind:value={commandInput}
    on:keydown={handleKeydown}
    type="text"
    placeholder={$t('terminal.inputPlaceholder')}
    class="flex-1 bg-transparent text-gray-200 text-base font-mono focus:outline-none placeholder-gray-700" />
</div>
