<script lang="ts">
  import { onMount } from 'svelte';
  import type { TiledMap, LayerName, EditorMode, ZoneObject } from './types';
  import { createBlankMap } from './mapFactory';
  import { loadTileImages } from './tilesetLoader';
  import { validateAndParseMap } from './mapImporter';
  import { fetchEditorMeta } from './editorConstants';
  import MapCanvas from './MapCanvas.svelte';
  import TilePalette from './TilePalette.svelte';
  import LayerPanel from './LayerPanel.svelte';
  import ZonePropertiesPanel from './ZonePropertiesPanel.svelte';
  import Toolbar from './Toolbar.svelte';
  import { TILE_SIZE } from '../config/constants';

  let mapData: TiledMap = $state(createBlankMap(14, 12));
  let mapName: string = $state('new-map');
  let activeLayer: LayerName = $state('Ground');
  let editorMode: EditorMode = $state('paint');
  let selectedTile: number = $state(1);
  let selectedZoneId: number | null = $state(null);
  let layerVisibility: Record<string, boolean> = $state({
    Ground: true,
    Walls: true,
    Above: true,
    Zones: true,
  });

  let tileImages: ImageBitmap[] = $state([]);
  let loading = $state(true);
  let hoverX = $state(-1);
  let hoverY = $state(-1);

  let knownEventIds: string[] = $state([]);
  let knownTargetMaps: string[] = $state([]);

  onMount(async () => {
    const [images, meta] = await Promise.all([loadTileImages(), fetchEditorMeta()]);
    tileImages = images;
    knownTargetMaps = meta.maps.map((m) => m.id);
    knownEventIds = meta.dialogueIds;
    loading = false;
  });

  // Derived: currently selected zone object
  let selectedZone: ZoneObject | null = $derived(
    selectedZoneId !== null
      ? mapData.layers[3].objects.find((z) => z.id === selectedZoneId) ?? null
      : null,
  );

  function resetSelection() {
    selectedZoneId = null;
    activeLayer = 'Ground';
    editorMode = 'paint';
    selectedTile = 1;
  }

  function createNewMap(width: number, height: number) {
    mapData = createBlankMap(width, height);
    mapName = 'new-map';
    resetSelection();
  }

  function loadMap(data: TiledMap) {
    mapData = data;
    resetSelection();
  }

  function paintTile(layerName: string, tileX: number, tileY: number, tileId: number) {
    const layer = mapData.layers.find((l) => l.name === layerName);
    if (!layer || layer.type !== 'tilelayer') return;
    const idx = tileY * mapData.width + tileX;
    if (layer.data[idx] === tileId) return;
    layer.data[idx] = tileId;
    mapData.layers = [...mapData.layers] as TiledMap['layers'];
  }

  function addZone(tileX: number, tileY: number) {
    const newZone: ZoneObject = {
      id: mapData.nextobjectid,
      name: `Zone ${mapData.nextobjectid}`,
      type: 'trigger',
      x: tileX * TILE_SIZE,
      y: tileY * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
      visible: true,
      properties: [
        { name: 'id', type: 'string', value: `zone-${mapData.nextobjectid}` },
        { name: 'eventId', type: 'string', value: '' },
      ],
    };
    mapData.layers[3].objects = [...mapData.layers[3].objects, newZone];
    mapData.nextobjectid++;
    mapData.layers = [...mapData.layers] as TiledMap['layers'];
    selectedZoneId = newZone.id;
  }

  function updateZone(updated: ZoneObject) {
    const objects = mapData.layers[3].objects;
    const idx = objects.findIndex((z) => z.id === updated.id);
    if (idx < 0) return;
    objects[idx] = updated;
    mapData.layers[3].objects = [...objects];
    mapData.layers = [...mapData.layers] as TiledMap['layers'];
  }

  function deleteZone(zoneId: number) {
    mapData.layers[3].objects = mapData.layers[3].objects.filter((z) => z.id !== zoneId);
    mapData.layers = [...mapData.layers] as TiledMap['layers'];
    selectedZoneId = null;
  }

  function handleZoneSelect(objectId: number) {
    selectedZoneId = objectId;
  }

  function selectLayer(layer: LayerName) {
    activeLayer = layer;
    if (layer === 'Zones') {
      editorMode = 'zones';
    } else if (editorMode === 'zones') {
      editorMode = selectedTile === 0 ? 'erase' : 'paint';
    }
  }

  function toggleVisibility(layer: string) {
    layerVisibility[layer] = !layerVisibility[layer];
    layerVisibility = { ...layerVisibility };
  }

  function handleHover(tileX: number, tileY: number) {
    hoverX = tileX;
    hoverY = tileY;
  }

  function handleFileDrop(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        const parsed = validateAndParseMap(json);
        loadMap(parsed);
        mapName = file.name.replace(/\.json$/i, '');
        console.log(`[MapEditor] Loaded map via drop: ${file.name}`);
      } catch (err) {
        console.error('[MapEditor] Drop import failed:', err);
        alert(`Failed to load map: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
  }
</script>

<div class="flex h-full w-full bg-[#0d1117] text-gray-200 font-mono text-sm">
  <!-- Main canvas area -->
  <div class="flex-1 flex flex-col min-w-0">
    <div class="h-10 border-b border-gray-700 flex items-center px-3 gap-2">
      <Toolbar
        {mapData}
        {mapName}
        onNewMap={createNewMap}
        onLoadMap={loadMap}
        onMapNameChange={(name) => mapName = name}
      />
      <span class="text-gray-600 ml-auto text-xs">{mapData.width} x {mapData.height}</span>
    </div>
    <div class="flex-1 relative overflow-hidden">
      {#if loading}
        <div class="flex items-center justify-center h-full text-gray-500">
          Loading tileset...
        </div>
      {:else}
        <MapCanvas
          {mapData}
          {tileImages}
          {activeLayer}
          {editorMode}
          {selectedTile}
          {layerVisibility}
          {selectedZoneId}
          onTilePaint={paintTile}
          onZoneClick={addZone}
          onZoneSelect={handleZoneSelect}
          onZoneUpdate={updateZone}
          onHover={handleHover}
          onFileDrop={handleFileDrop}
        />
      {/if}
    </div>
    <!-- Status bar -->
    <div class="h-6 border-t border-gray-700 flex items-center px-3 gap-4 text-xs text-gray-500 shrink-0">
      {#if hoverX >= 0 && hoverX < mapData.width && hoverY >= 0 && hoverY < mapData.height}
        <span>Tile: ({hoverX}, {hoverY})</span>
      {/if}
      <span>Layer: {activeLayer}</span>
      <span>Map: {mapData.width} x {mapData.height}</span>
      <span>Tile ID: {selectedTile}</span>
      <span class="ml-auto">{editorMode === 'erase' ? 'Eraser' : editorMode === 'zones' ? 'Zone Mode' : 'Paint'}</span>
    </div>
  </div>

  <!-- Right panel -->
  <div class="w-64 border-l border-gray-700 flex flex-col overflow-y-auto">
    {#if !loading}
      <TilePalette
        {tileImages}
        {selectedTile}
        onSelect={(id) => { selectedTile = id; if (activeLayer !== 'Zones') editorMode = id === 0 ? 'erase' : 'paint'; }}
      />
      <LayerPanel
        {activeLayer}
        {layerVisibility}
        onLayerSelect={selectLayer}
        onVisibilityToggle={toggleVisibility}
      />
      <ZonePropertiesPanel
        zone={selectedZone}
        {knownEventIds}
        {knownTargetMaps}
        onUpdate={updateZone}
        onDelete={deleteZone}
      />
    {/if}
  </div>
</div>
