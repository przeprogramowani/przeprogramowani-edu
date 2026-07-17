<script lang="ts">
  import type { TiledMap } from './types';
  import { validateAndParseMap } from './mapImporter';
  import { exportMapJSON, downloadJSON } from './mapExporter';

  interface Props {
    mapData: TiledMap;
    mapName: string;
    onNewMap: (width: number, height: number) => void;
    onLoadMap: (data: TiledMap) => void;
    onMapNameChange: (name: string) => void;
  }

  let { mapData, mapName, onNewMap, onLoadMap, onMapNameChange }: Props = $props();
  let fileInput: HTMLInputElement | undefined = $state();
  let showNewMap = $state(false);

  function handleLoad() {
    fileInput?.click();
  }

  function handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    loadFile(file);
    input.value = '';
  }

  function loadFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        const parsed = validateAndParseMap(json);
        onLoadMap(parsed);
        // Derive name from filename
        const name = file.name.replace(/\.json$/i, '');
        onMapNameChange(name);
        console.log(`[MapEditor] Loaded map: ${file.name}`);
      } catch (err) {
        console.error('[MapEditor] Import failed:', err);
        alert(`Failed to load map: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
  }

  function handleExport() {
    const json = exportMapJSON(mapData);
    downloadJSON(json, mapName);
    console.log(`[MapEditor] Exported map: ${mapName}.json`);
  }
</script>

<div class="flex items-center gap-2 h-full">
  <button
    onclick={() => showNewMap = true}
    class="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
  >
    New
  </button>
  <button
    onclick={handleLoad}
    class="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
  >
    Load
  </button>
  <button
    onclick={handleExport}
    class="px-2 py-1 rounded text-xs bg-blue-700 hover:bg-blue-600 text-white transition-colors"
  >
    Export
  </button>

  <input
    bind:this={fileInput}
    type="file"
    accept=".json"
    onchange={handleFileChange}
    class="hidden"
  />

  <span class="text-gray-600 mx-1">|</span>

  <input
    type="text"
    value={mapName}
    oninput={(e) => onMapNameChange((e.target as HTMLInputElement).value)}
    class="bg-gray-800 border border-gray-600 rounded px-2 py-0.5 text-xs text-gray-300 w-32 focus:border-blue-500 focus:outline-none"
    placeholder="map-name"
  />
</div>

{#if showNewMap}
  {#await import('./NewMapModal.svelte') then mod}
    <mod.default
      onConfirm={(w, h) => { showNewMap = false; onNewMap(w, h); }}
      onCancel={() => showNewMap = false}
    />
  {/await}
{/if}
