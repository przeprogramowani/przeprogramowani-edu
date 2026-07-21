<script lang="ts">
  import { onMount } from 'svelte';
  import type { EditorTool } from './types';
  import type { CellKind, LevelSource, ValidationIssue, ZoneSource } from '../levels/mapAuthoring/types';
  import { compileLevel, compileLevelDraft } from '../levels/mapAuthoring/compile';
  import { parseLevelSource } from '../levels/mapAuthoring/parseSource';
  import { serializeSource } from '../levels/mapAuthoring/serializeSource';
  import { validateLevel } from '../levels/mapAuthoring/validate';
  import { loadTileImages } from './tilesetLoader';
  import { fetchEditorMeta, type EditorMeta } from './editorConstants';
  import { fetchLevelSources, saveLevelSource, type LevelYamlEntry } from './sourceApi';
  import MapCanvas from './MapCanvas.svelte';
  import SourcePalette from './SourcePalette.svelte';
  import LayerPanel from './LayerPanel.svelte';
  import ZonePropertiesPanel from './ZonePropertiesPanel.svelte';
  import ValidationPanel from './ValidationPanel.svelte';
  import Toolbar from './Toolbar.svelte';

  let levels: LevelYamlEntry[] = $state([]);
  let currentMapKey: string | null = $state(null);
  let source: LevelSource | null = $state(null);
  // Canonical serialization at load time — the dirty-check baseline, so
  // formatting-only canonicalization of hand-written yaml never counts as an edit.
  let loadedYaml = $state('');
  let meta: EditorMeta | null = $state(null);
  let tileImages: ImageBitmap[] = $state([]);
  let loading = $state(true);
  let loadError = $state('');
  let saving = $state(false);
  let statusMessage = $state('');
  let statusTimeout: ReturnType<typeof setTimeout> | undefined;

  let tool: EditorTool = $state('grid');
  let selectedCell: CellKind = $state('FLOOR');
  let selectedPropSlot = $state(1);
  let propSolid = $state(true);
  let selectedZoneIndex: number | null = $state(null);
  let layerVisibility: Record<string, boolean> = $state({
    Ground: true,
    Walls: true,
    Zones: true,
  });
  let hoverX = $state(-1);
  let hoverY = $state(-1);

  onMount(async () => {
    try {
      const [images, editorMeta, levelSources] = await Promise.all([
        loadTileImages(),
        fetchEditorMeta(),
        fetchLevelSources(),
      ]);
      tileImages = images;
      meta = editorMeta;
      levels = levelSources;
      if (levelSources.length > 0) {
        selectLevel(levelSources[0].mapKey, true);
      }
    } catch (err) {
      loadError = (err as Error).message;
    }
    loading = false;
  });

  $effect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  });

  const isDirty = $derived(source !== null && serializeSource(source) !== loadedYaml);

  const draft = $derived(
    source && currentMapKey ? compileLevelDraft(source, currentMapKey) : null,
  );

  // All levels parsed once per disk state; the edited map is swapped in live below.
  const parsedLevels = $derived.by(() => {
    const sources = new Map<string, LevelSource>();
    for (const entry of levels) {
      try {
        sources.set(entry.mapKey, parseLevelSource(entry.yaml, entry.mapKey));
      } catch (err) {
        console.warn(`[MapEditor] Skipping unparseable level ${entry.mapKey}:`, err);
      }
    }
    return sources;
  });

  const issues: ValidationIssue[] = $derived.by(() => {
    if (!source || !currentMapKey) return [];
    const sources = new Map(parsedLevels);
    sources.set(currentMapKey, source);
    const knownMaps = new Set([...sources.keys(), ...(meta?.maps.map((m) => m.id) ?? [])]);
    const manifests = meta ? new Map(Object.entries(meta.manifests)) : undefined;
    return validateLevel(source, currentMapKey, { sources, knownMaps, manifests });
  });

  const errorCount = $derived(issues.filter((i) => i.level === 'error').length);
  const warningCount = $derived(issues.filter((i) => i.level === 'warning').length);
  const errorCells: [number, number][] = $derived(
    issues.filter((i) => i.level === 'error' && i.at).map((i) => i.at as [number, number]),
  );

  const selectedZone: ZoneSource | null = $derived(
    source && selectedZoneIndex !== null ? (source.zones[selectedZoneIndex] ?? null) : null,
  );
  // Compiled Tiled object ids are index + 1 (see mapAuthoring/compile.ts).
  const selectedCompiledZoneId = $derived(selectedZoneIndex !== null ? selectedZoneIndex + 1 : null);
  const linkableProps = $derived(
    (source?.props ?? []).filter((p): p is typeof p & { id: string } => p.id !== undefined),
  );

  function showStatus(message: string) {
    statusMessage = message;
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => (statusMessage = ''), 5000);
  }

  function selectLevel(mapKey: string, skipDirtyCheck = false) {
    if (!skipDirtyCheck && isDirty && !confirm(`Discard unsaved changes to ${currentMapKey}?`)) {
      return;
    }
    const entry = levels.find((l) => l.mapKey === mapKey);
    if (!entry) return;
    let parsed: LevelSource;
    try {
      parsed = parseLevelSource(entry.yaml, mapKey);
    } catch (err) {
      alert(`Failed to parse ${mapKey}/map.level.yaml:\n${(err as Error).message}`);
      return;
    }
    source = parsed;
    currentMapKey = mapKey;
    loadedYaml = serializeSource(parsed);
    selectedZoneIndex = null;
  }

  function setTheme(theme: number) {
    if (source) source.theme = theme;
  }

  function paintCell(tileX: number, tileY: number, erase: boolean) {
    if (!source) return;
    if (tool === 'grid') {
      const kind: CellKind = erase ? 'OUT' : selectedCell;
      if (source.cells[tileY][tileX] !== kind) {
        source.cells[tileY][tileX] = kind;
      }
    } else if (tool === 'props') {
      if (erase) {
        removePropAt(tileX, tileY);
      } else {
        placeProp(tileX, tileY);
      }
    }
  }

  function placeProp(tileX: number, tileY: number) {
    if (!source) return;
    const existing = source.props.find((p) => p.at[0] === tileX && p.at[1] === tileY);
    if (existing) {
      // Restyle in place so an authoring id (and zones linked to it) survives.
      if (existing.slot === selectedPropSlot && existing.solid === propSolid) return;
      existing.slot = selectedPropSlot;
      existing.solid = propSolid;
      return;
    }
    source.props.push({ slot: selectedPropSlot, at: [tileX, tileY], solid: propSolid });
  }

  function removePropAt(tileX: number, tileY: number) {
    if (!source) return;
    const index = source.props.findIndex((p) => p.at[0] === tileX && p.at[1] === tileY);
    if (index < 0) return;
    const [removed] = source.props.splice(index, 1);
    if (removed.id !== undefined) {
      // A dangling propId would make the serialized yaml unparseable.
      for (const zone of source.zones) {
        if (zone.propId === removed.id) delete zone.propId;
      }
    }
  }

  function addZone(tileX: number, tileY: number) {
    if (!source) return;
    const existingIds = new Set(source.zones.map((z) => z.id));
    let n = source.zones.length + 1;
    while (existingIds.has(`zone-${n}`)) n++;
    source.zones.push({
      id: `zone-${n}`,
      type: 'trigger',
      at: [tileX, tileY],
      size: [1, 1],
      properties: {},
    });
    selectedZoneIndex = source.zones.length - 1;
  }

  function selectZone(objectId: number) {
    selectedZoneIndex = objectId - 1;
  }

  function moveZone(objectId: number, tileX: number, tileY: number) {
    const zone = source?.zones[objectId - 1];
    if (!zone) return;
    if (zone.at[0] === tileX && zone.at[1] === tileY) return;
    zone.at = [tileX, tileY];
    // Manual placement breaks the prop link; re-link from the properties panel.
    if (zone.propId !== undefined) delete zone.propId;
  }

  function updateZone(updated: ZoneSource) {
    if (!source || selectedZoneIndex === null) return;
    source.zones[selectedZoneIndex] = updated;
  }

  function deleteZone() {
    if (!source || selectedZoneIndex === null) return;
    source.zones.splice(selectedZoneIndex, 1);
    selectedZoneIndex = null;
  }

  function handleHover(tileX: number, tileY: number) {
    hoverX = tileX;
    hoverY = tileY;
  }

  async function save() {
    if (!source || !currentMapKey || saving) return;
    const mapKey = currentMapKey;

    try {
      compileLevel(source, mapKey);
    } catch (err) {
      alert(`Compilation failed:\n${(err as Error).message}`);
      return;
    }
    if (errorCount > 0) {
      alert(`Fix ${errorCount} validation error(s) before saving — see the Validation panel.`);
      return;
    }
    if (warningCount > 0) {
      const list = issues
        .filter((i) => i.level === 'warning')
        .map((i) => `• ${i.message}`)
        .join('\n');
      if (!confirm(`Save with ${warningCount} warning(s)?\n\n${list}`)) return;
    }

    const yaml = serializeSource(source);
    try {
      parseLevelSource(yaml, mapKey);
    } catch (err) {
      alert(`Internal error — serialized yaml does not parse back:\n${(err as Error).message}`);
      return;
    }
    if (yaml === loadedYaml) {
      showStatus('No changes to save.');
      return;
    }

    saving = true;
    try {
      await saveLevelSource(mapKey, yaml);
      loadedYaml = yaml;
      const entry = levels.find((l) => l.mapKey === mapKey);
      if (entry) entry.yaml = yaml;
      showStatus(`Saved ${mapKey}/map.level.yaml — run \`npm run levels:build\` to regenerate JSON.`);
    } catch (err) {
      alert((err as Error).message);
    }
    saving = false;
  }
</script>

<div class="flex h-full w-full bg-[#0d1117] text-gray-200 font-mono text-sm">
  <!-- Main canvas area -->
  <div class="flex-1 flex flex-col min-w-0">
    <div class="h-10 border-b border-gray-700 flex items-center px-3 gap-2 shrink-0">
      <Toolbar
        mapKeys={levels.map((l) => l.mapKey)}
        {currentMapKey}
        theme={source?.theme ?? 1}
        {isDirty}
        {saving}
        {errorCount}
        {warningCount}
        onSelectLevel={selectLevel}
        onThemeChange={setTheme}
        onSave={save}
      />
      {#if source}
        <span class="text-gray-600 ml-auto text-xs">{source.cells[0]?.length ?? 0} x {source.cells.length}</span>
      {/if}
    </div>
    <div class="flex-1 relative overflow-hidden">
      {#if loading}
        <div class="flex items-center justify-center h-full text-gray-500">
          Loading editor...
        </div>
      {:else if loadError}
        <div class="flex items-center justify-center h-full text-red-400 px-8 text-center">
          {loadError}
        </div>
      {:else if draft}
        <MapCanvas
          mapData={draft.map}
          {tileImages}
          {tool}
          {layerVisibility}
          selectedZoneId={selectedCompiledZoneId}
          {errorCells}
          onCellPaint={paintCell}
          onZoneAdd={addZone}
          onZoneSelect={selectZone}
          onZoneMove={moveZone}
          onHover={handleHover}
        />
      {/if}
    </div>
    <!-- Status bar -->
    <div class="h-6 border-t border-gray-700 flex items-center px-3 gap-4 text-xs text-gray-500 shrink-0">
      {#if source && hoverY >= 0 && hoverY < source.cells.length && hoverX >= 0 && hoverX < (source.cells[0]?.length ?? 0)}
        <span>Tile: ({hoverX}, {hoverY})</span>
      {/if}
      <span>Tool: {tool}</span>
      {#if statusMessage}
        <span class="text-emerald-400 truncate">{statusMessage}</span>
      {/if}
      {#if isDirty}
        <span class="ml-auto text-amber-400">Unsaved changes</span>
      {/if}
    </div>
  </div>

  <!-- Right panel -->
  <div class="w-64 border-l border-gray-700 flex flex-col overflow-y-auto shrink-0">
    {#if !loading && !loadError && source}
      <SourcePalette
        {tileImages}
        theme={source.theme}
        {tool}
        {selectedCell}
        {selectedPropSlot}
        {propSolid}
        onToolChange={(t) => (tool = t)}
        onCellSelect={(c) => (selectedCell = c)}
        onPropSlotSelect={(s) => (selectedPropSlot = s)}
        onPropSolidChange={(s) => (propSolid = s)}
      />
      <LayerPanel {layerVisibility} onVisibilityToggle={(layer) => (layerVisibility[layer] = !layerVisibility[layer])} />
      <ZonePropertiesPanel
        zone={selectedZone}
        {linkableProps}
        knownEventIds={meta?.dialogueIds ?? []}
        knownTargetMaps={meta?.maps.map((m) => m.id) ?? []}
        onUpdate={updateZone}
        onDelete={deleteZone}
      />
      <ValidationPanel {issues} />
    {/if}
  </div>
</div>
