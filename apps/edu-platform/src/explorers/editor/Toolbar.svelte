<script lang="ts">
  import { THEMES, THEME_COUNT } from '../config/tileIndices';

  interface Props {
    mapKeys: string[];
    currentMapKey: string | null;
    theme: number;
    isDirty: boolean;
    saving: boolean;
    errorCount: number;
    warningCount: number;
    onSelectLevel: (mapKey: string) => void;
    onThemeChange: (theme: number) => void;
    onSave: () => void;
  }

  let {
    mapKeys,
    currentMapKey,
    theme,
    isDirty,
    saving,
    errorCount,
    warningCount,
    onSelectLevel,
    onThemeChange,
    onSave,
  }: Props = $props();

  const themeOptions = Array.from({ length: THEME_COUNT }, (_, i) => i + 1);

  function handleLevelChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const mapKey = select.value;
    onSelectLevel(mapKey);
    // The parent may refuse the switch (dirty-check); resync the control.
    select.value = currentMapKey ?? '';
  }
</script>

<div class="flex items-center gap-2 h-full">
  <select
    value={currentMapKey ?? ''}
    onchange={handleLevelChange}
    class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none max-w-52"
  >
    {#each mapKeys as mapKey}
      <option value={mapKey}>{mapKey}</option>
    {/each}
  </select>

  <select
    value={theme}
    onchange={(e) => onThemeChange(Number((e.target as HTMLSelectElement).value))}
    class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
    title="Theme"
  >
    {#each themeOptions as t}
      <option value={t}>{t} — {THEMES[t]?.name ?? 'unknown'}</option>
    {/each}
  </select>

  <button
    onclick={onSave}
    disabled={saving || !isDirty || errorCount > 0}
    class="px-3 py-1 rounded text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed
      {errorCount > 0 ? 'bg-red-900/40 text-red-300' : 'bg-blue-700 hover:bg-blue-600 text-white'}"
    title={errorCount > 0 ? 'Fix validation errors before saving' : 'Write map.level.yaml'}
  >
    {saving ? 'Saving...' : 'Save'}
  </button>

  {#if errorCount > 0}
    <span class="text-xs text-red-400">{errorCount} error{errorCount === 1 ? '' : 's'}</span>
  {/if}
  {#if warningCount > 0}
    <span class="text-xs text-amber-400">{warningCount} warning{warningCount === 1 ? '' : 's'}</span>
  {/if}
</div>
