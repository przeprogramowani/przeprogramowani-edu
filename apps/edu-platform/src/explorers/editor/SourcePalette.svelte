<script lang="ts">
  import type { EditorTool } from './types';
  import type { CellKind } from '../levels/mapAuthoring/types';
  import { TileRole, tileIndex } from '../config/tileIndices';
  import { propTileIndex } from '../levels/mapAuthoring/compile';
  import { aliasForSlot } from '../levels/mapAuthoring/propAliases';

  const DISPLAY_SIZE = 28;
  const PROP_SLOTS = [1, 2, 3, 4, 5, 6, 7, 8];

  // Representative tile per grid brush; walls auto-tile on the map itself.
  const GRID_BRUSHES: { kind: CellKind; char: string; label: string; role: number }[] = [
    { kind: 'FLOOR', char: '.', label: 'Floor', role: TileRole.FLOOR_1 },
    { kind: 'WALL', char: '#', label: 'Wall', role: TileRole.EDGE_N_A },
    { kind: 'WINDOW', char: 'o', label: 'Window', role: TileRole.EDGE_N_B },
    { kind: 'DOOR', char: 'D', label: 'Door', role: TileRole.EDGE_W_B },
    { kind: 'OUT', char: '~', label: 'Outside', role: TileRole.BG_1 },
  ];

  const TOOLS: { id: EditorTool; label: string }[] = [
    { id: 'grid', label: 'Grid' },
    { id: 'props', label: 'Props' },
    { id: 'zones', label: 'Zones' },
  ];

  interface Props {
    tileImages: ImageBitmap[];
    theme: number;
    tool: EditorTool;
    selectedCell: CellKind;
    selectedPropSlot: number;
    propSolid: boolean;
    onToolChange: (tool: EditorTool) => void;
    onCellSelect: (kind: CellKind) => void;
    onPropSlotSelect: (slot: number) => void;
    onPropSolidChange: (solid: boolean) => void;
  }

  let {
    tileImages,
    theme,
    tool,
    selectedCell,
    selectedPropSlot,
    propSolid,
    onToolChange,
    onCellSelect,
    onPropSlotSelect,
    onPropSolidChange,
  }: Props = $props();

  let gridCanvasRefs: (HTMLCanvasElement | undefined)[] = $state([]);
  let propCanvasRefs: (HTMLCanvasElement | undefined)[] = $state([]);

  function drawTile(canvas: HTMLCanvasElement, absoluteIndex: number) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    const image = tileImages[absoluteIndex - 1];
    if (image) {
      ctx.drawImage(image, 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    }
  }

  $effect(() => {
    if (!tileImages.length) return;
    for (let i = 0; i < GRID_BRUSHES.length; i++) {
      const canvas = gridCanvasRefs[i];
      if (canvas) drawTile(canvas, tileIndex(theme, GRID_BRUSHES[i].role));
    }
    for (let i = 0; i < PROP_SLOTS.length; i++) {
      const canvas = propCanvasRefs[i];
      if (canvas) drawTile(canvas, propTileIndex(theme, PROP_SLOTS[i]));
    }
  });
</script>

<div class="p-2 border-b border-gray-700">
  <div class="flex gap-1 mb-2">
    {#each TOOLS as t}
      <button
        class="flex-1 px-2 py-1 rounded text-xs border transition-colors"
        class:border-blue-400={tool === t.id}
        class:text-blue-300={tool === t.id}
        class:bg-blue-900={tool === t.id}
        class:border-gray-600={tool !== t.id}
        class:text-gray-400={tool !== t.id}
        class:hover:border-gray-400={tool !== t.id}
        onclick={() => onToolChange(t.id)}
      >
        {t.label}
      </button>
    {/each}
  </div>

  {#if tool === 'grid'}
    <div class="flex flex-col gap-0.5">
      {#each GRID_BRUSHES as brush, i}
        <button
          class="flex items-center gap-2 px-2 py-1 rounded text-xs border transition-colors"
          class:border-yellow-400={selectedCell === brush.kind}
          class:text-yellow-300={selectedCell === brush.kind}
          class:border-gray-700={selectedCell !== brush.kind}
          class:text-gray-400={selectedCell !== brush.kind}
          class:hover:border-gray-400={selectedCell !== brush.kind}
          onclick={() => onCellSelect(brush.kind)}
        >
          <canvas
            bind:this={gridCanvasRefs[i]}
            width={DISPLAY_SIZE}
            height={DISPLAY_SIZE}
            class="w-6 h-6 shrink-0 border border-gray-800"
          ></canvas>
          <span class="font-bold w-3">{brush.char}</span>
          <span>{brush.label}</span>
        </button>
      {/each}
    </div>
    <div class="text-[10px] text-gray-600 mt-1.5">Right-click paints Outside (~)</div>
  {:else if tool === 'props'}
    <div class="grid grid-cols-4 gap-1">
      {#each PROP_SLOTS as slot, i}
        <button
          class="flex flex-col items-center gap-0.5 p-1 rounded border transition-colors"
          class:border-yellow-400={selectedPropSlot === slot}
          class:border-gray-700={selectedPropSlot !== slot}
          class:hover:border-gray-400={selectedPropSlot !== slot}
          onclick={() => onPropSlotSelect(slot)}
          title={aliasForSlot(theme, slot) ?? `slot ${slot}`}
        >
          <canvas
            bind:this={propCanvasRefs[i]}
            width={DISPLAY_SIZE}
            height={DISPLAY_SIZE}
            class="w-7 h-7"
          ></canvas>
          <span class="text-[9px] text-gray-500 truncate w-full text-center">
            {aliasForSlot(theme, slot) ?? `slot ${slot}`}
          </span>
        </button>
      {/each}
    </div>
    <label class="flex items-center gap-2 mt-2 text-xs text-gray-400 cursor-pointer">
      <input
        type="checkbox"
        checked={propSolid}
        onchange={(e) => onPropSolidChange((e.target as HTMLInputElement).checked)}
        class="rounded border-gray-600 bg-gray-800"
      />
      Solid (blocks walking)
    </label>
    <div class="text-[10px] text-gray-600 mt-1.5">Right-click removes a prop</div>
  {:else}
    <div class="text-xs text-gray-500 leading-relaxed">
      Click an empty tile to add a zone.<br />
      Click a zone to select, drag to move.<br />
      Dragging detaches a prop link.
    </div>
  {/if}
</div>
