<script lang="ts">
  import { onMount } from 'svelte';
  import type { TiledMap, LayerName, EditorMode, ZoneObject } from './types';
  import { ZONE_COLORS } from './types';
  import { TILE_SIZE } from '../config/constants';

  interface Props {
    mapData: TiledMap;
    tileImages: ImageBitmap[];
    activeLayer: LayerName;
    editorMode: EditorMode;
    selectedTile: number;
    layerVisibility: Record<string, boolean>;
    selectedZoneId: number | null;
    onTilePaint: (layerName: string, tileX: number, tileY: number, tileId: number) => void;
    onZoneClick: (tileX: number, tileY: number) => void;
    onZoneSelect: (objectId: number) => void;
    onZoneUpdate: (zone: ZoneObject) => void;
    onHover: (tileX: number, tileY: number) => void;
    onFileDrop?: (file: File) => void;
  }

  let {
    mapData,
    tileImages,
    activeLayer,
    editorMode,
    selectedTile,
    layerVisibility,
    selectedZoneId,
    onTilePaint,
    onZoneClick,
    onZoneSelect,
    onZoneUpdate,
    onHover,
    onFileDrop,
  }: Props = $props();

  let canvasEl: HTMLCanvasElement | undefined = $state();
  let containerEl: HTMLDivElement | undefined = $state();

  // Viewport state
  let zoom = $state(2);
  let panX = $state(0);
  let panY = $state(0);
  let isPanning = $state(false);
  let lastPanX = 0;
  let lastPanY = 0;
  let spaceHeld = false;

  // Mouse state
  let hoverTileX = $state(-1);
  let hoverTileY = $state(-1);
  let isPainting = $state(false);

  // Drag-drop state
  let isDragOver = $state(false);

  // Zone drag state
  let isDraggingZone = $state(false);
  let hasDragMoved = false;
  let dragStartScreenX = 0;
  let dragStartScreenY = 0;
  let dragZoneStartX = 0;
  let dragZoneStartY = 0;
  let draggedZoneId: number | null = null;

  function screenToTile(clientX: number, clientY: number): { tileX: number; tileY: number } {
    if (!canvasEl) return { tileX: -1, tileY: -1 };
    const rect = canvasEl.getBoundingClientRect();
    const x = (clientX - rect.left - panX) / zoom;
    const y = (clientY - rect.top - panY) / zoom;
    const tileX = Math.floor(x / TILE_SIZE);
    const tileY = Math.floor(y / TILE_SIZE);
    return { tileX, tileY };
  }

  function isInBounds(tileX: number, tileY: number): boolean {
    return tileX >= 0 && tileX < mapData.width && tileY >= 0 && tileY < mapData.height;
  }

  function drawMap() {
    if (!canvasEl || !tileImages.length) return;
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    const w = canvasEl.width;
    const h = canvasEl.height;
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    const mapW = mapData.width;
    const mapH = mapData.height;

    // Viewport culling bounds
    const startCol = Math.max(0, Math.floor(-panX / zoom / TILE_SIZE));
    const startRow = Math.max(0, Math.floor(-panY / zoom / TILE_SIZE));
    const endCol = Math.min(mapW, Math.ceil((w - panX) / zoom / TILE_SIZE));
    const endRow = Math.min(mapH, Math.ceil((h - panY) / zoom / TILE_SIZE));

    // Draw tile layers in order: Ground, Walls, Above
    const tileLayerNames = ['Ground', 'Walls', 'Above'] as const;
    for (const layerName of tileLayerNames) {
      if (!layerVisibility[layerName]) continue;
      const layer = mapData.layers.find((l) => l.name === layerName);
      if (!layer || layer.type !== 'tilelayer') continue;

      // Dim non-active layers so the edited layer stands out
      const isActive = activeLayer === layerName;
      ctx.globalAlpha = isActive ? 1.0 : 0.2;

      for (let row = startRow; row < endRow; row++) {
        for (let col = startCol; col < endCol; col++) {
          const idx = row * mapW + col;
          const tileId = layer.data[idx];
          if (tileId > 0 && tileId <= tileImages.length) {
            ctx.drawImage(tileImages[tileId - 1], col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
          }
        }
      }
    }
    ctx.globalAlpha = 1.0;

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1 / zoom;
    for (let col = startCol; col <= endCol; col++) {
      ctx.beginPath();
      ctx.moveTo(col * TILE_SIZE, startRow * TILE_SIZE);
      ctx.lineTo(col * TILE_SIZE, endRow * TILE_SIZE);
      ctx.stroke();
    }
    for (let row = startRow; row <= endRow; row++) {
      ctx.beginPath();
      ctx.moveTo(startCol * TILE_SIZE, row * TILE_SIZE);
      ctx.lineTo(endCol * TILE_SIZE, row * TILE_SIZE);
      ctx.stroke();
    }

    // Draw map boundary
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(0, 0, mapW * TILE_SIZE, mapH * TILE_SIZE);

    // Draw zone overlays
    if (layerVisibility['Zones']) {
      const zonesLayer = mapData.layers[3];
      for (const zone of zonesLayer.objects) {
        const color = ZONE_COLORS[zone.type] ?? '#ffffff';
        const isSelected = zone.id === selectedZoneId;

        // Fill
        ctx.fillStyle = color;
        ctx.globalAlpha = isSelected ? 0.35 : 0.2;
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);

        // Stroke
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = color;
        ctx.lineWidth = (isSelected ? 3 : 2) / zoom;
        ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);

        // Label
        ctx.fillStyle = '#ffffff';
        ctx.font = `${11 / zoom}px monospace`;
        ctx.fillText(zone.name, zone.x + 2 / zoom, zone.y + 12 / zoom);
      }
      ctx.globalAlpha = 1.0;
    }

    // Hover highlight
    if (isInBounds(hoverTileX, hoverTileY)) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(hoverTileX * TILE_SIZE, hoverTileY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1 / zoom;
      ctx.strokeRect(hoverTileX * TILE_SIZE, hoverTileY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }

    ctx.restore();
  }

  function handleMouseDown(e: MouseEvent) {
    if (e.button === 1 || (e.button === 0 && spaceHeld)) {
      // Middle click or space+left click = pan
      isPanning = true;
      lastPanX = e.clientX;
      lastPanY = e.clientY;
      e.preventDefault();
      return;
    }

    if (e.button === 0) {
      const { tileX, tileY } = screenToTile(e.clientX, e.clientY);
      if (!isInBounds(tileX, tileY)) return;

      if (activeLayer === 'Zones' || editorMode === 'zones') {
        // Check if clicking on an existing zone
        const zonesLayer = mapData.layers[3];
        const px = tileX * TILE_SIZE;
        const py = tileY * TILE_SIZE;
        const clickedZone = zonesLayer.objects.find(
          (z) => px >= z.x && px < z.x + z.width && py >= z.y && py < z.y + z.height
        );
        if (clickedZone) {
          onZoneSelect(clickedZone.id);
          // Start potential drag
          isDraggingZone = true;
          hasDragMoved = false;
          dragStartScreenX = e.clientX;
          dragStartScreenY = e.clientY;
          dragZoneStartX = clickedZone.x;
          dragZoneStartY = clickedZone.y;
          draggedZoneId = clickedZone.id;
        } else {
          onZoneClick(tileX, tileY);
        }
        return;
      }

      // Paint mode
      isPainting = true;
      const tileId = editorMode === 'erase' ? 0 : selectedTile;
      onTilePaint(activeLayer, tileX, tileY, tileId);
    }

    if (e.button === 2) {
      // Right click = erase
      const { tileX, tileY } = screenToTile(e.clientX, e.clientY);
      if (!isInBounds(tileX, tileY)) return;
      if (activeLayer !== 'Zones') {
        isPainting = true;
        onTilePaint(activeLayer, tileX, tileY, 0);
      }
    }
  }

  function handleMouseMove(e: MouseEvent) {
    const { tileX, tileY } = screenToTile(e.clientX, e.clientY);
    hoverTileX = tileX;
    hoverTileY = tileY;
    onHover(tileX, tileY);

    if (isDraggingZone && draggedZoneId !== null) {
      const dx = (e.clientX - dragStartScreenX) / zoom;
      const dy = (e.clientY - dragStartScreenY) / zoom;

      // Only start visual drag after 4px threshold
      if (!hasDragMoved && Math.abs(dx) < 4 && Math.abs(dy) < 4) {
        return;
      }
      hasDragMoved = true;

      const zone = mapData.layers[3].objects.find((z) => z.id === draggedZoneId);
      if (zone) {
        zone.x = dragZoneStartX + dx;
        zone.y = dragZoneStartY + dy;
        onZoneUpdate({ ...zone });
      }
      return;
    }

    if (isPanning) {
      panX += e.clientX - lastPanX;
      panY += e.clientY - lastPanY;
      lastPanX = e.clientX;
      lastPanY = e.clientY;
      return;
    }

    if (isPainting && isInBounds(tileX, tileY) && activeLayer !== 'Zones') {
      const tileId = e.buttons === 2 ? 0 : editorMode === 'erase' ? 0 : selectedTile;
      onTilePaint(activeLayer, tileX, tileY, tileId);
    }
  }

  function handleMouseUp() {
    if (isDraggingZone && draggedZoneId !== null && hasDragMoved) {
      const zone = mapData.layers[3].objects.find((z) => z.id === draggedZoneId);
      if (zone) {
        // Snap to grid
        zone.x = Math.round(zone.x / TILE_SIZE) * TILE_SIZE;
        zone.y = Math.round(zone.y / TILE_SIZE) * TILE_SIZE;
        onZoneUpdate({ ...zone });
      }
    }
    isDraggingZone = false;
    draggedZoneId = null;
    isPanning = false;
    isPainting = false;
  }

  function handleWheel(e: WheelEvent) {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.max(0.5, Math.min(8, zoom * zoomFactor));

    // Zoom toward mouse position
    if (canvasEl) {
      const rect = canvasEl.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      panX = mx - ((mx - panX) / zoom) * newZoom;
      panY = my - ((my - panY) / zoom) * newZoom;
    }

    zoom = newZoom;
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.code === 'Space') {
      spaceHeld = true;
      e.preventDefault();
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    if (e.code === 'Space') {
      spaceHeld = false;
    }
  }

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragOver = true;
  }

  function handleDragLeave() {
    isDragOver = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragOver = false;
    const file = e.dataTransfer?.files[0];
    if (file && file.name.endsWith('.json') && onFileDrop) {
      onFileDrop(file);
    }
  }

  function resizeCanvas() {
    if (!canvasEl || !containerEl) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = containerEl.getBoundingClientRect();
    canvasEl.width = rect.width * dpr;
    canvasEl.height = rect.height * dpr;
    canvasEl.style.width = `${rect.width}px`;
    canvasEl.style.height = `${rect.height}px`;
    const ctx = canvasEl.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    drawMap();
  }

  onMount(() => {
    resizeCanvas();
    const observer = new ResizeObserver(resizeCanvas);
    if (containerEl) observer.observe(containerEl);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      observer.disconnect();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  // Redraw on state changes
  $effect(() => {
    // Touch reactive dependencies to trigger redraw
    mapData;
    layerVisibility;
    selectedZoneId;
    zoom;
    panX;
    panY;
    hoverTileX;
    hoverTileY;
    activeLayer;
    tileImages;
    drawMap();
  });
</script>

<div
  class="w-full h-full relative"
  bind:this={containerEl}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}>
  <canvas
    bind:this={canvasEl}
    onmousedown={handleMouseDown}
    onmousemove={handleMouseMove}
    onmouseup={handleMouseUp}
    onmouseleave={handleMouseUp}
    onwheel={handleWheel}
    oncontextmenu={handleContextMenu}
    class="block cursor-crosshair"
    class:cursor-grab={spaceHeld && !isPanning}
    class:cursor-grabbing={isPanning}></canvas>

  {#if isDragOver}
    <div
      class="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
      <span class="text-blue-300 text-lg">Drop JSON file here</span>
    </div>
  {/if}

  <!-- Coordinate display -->
  {#if isInBounds(hoverTileX, hoverTileY)}
    <div class="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-gray-300 pointer-events-none">
      Tile: ({hoverTileX}, {hoverTileY})
    </div>
  {/if}
</div>
