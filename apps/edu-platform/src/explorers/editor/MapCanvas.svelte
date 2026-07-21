<script lang="ts">
  import { onMount } from 'svelte';
  import type { TiledMap, EditorTool } from './types';
  import { ZONE_COLORS } from './types';
  import { TILE_SIZE } from '../config/constants';

  interface Props {
    mapData: TiledMap;
    tileImages: ImageBitmap[];
    tool: EditorTool;
    layerVisibility: Record<string, boolean>;
    selectedZoneId: number | null;
    errorCells: [number, number][];
    onCellPaint: (tileX: number, tileY: number, erase: boolean) => void;
    onZoneAdd: (tileX: number, tileY: number) => void;
    onZoneSelect: (objectId: number) => void;
    onZoneMove: (objectId: number, tileX: number, tileY: number) => void;
    onHover: (tileX: number, tileY: number) => void;
  }

  let {
    mapData,
    tileImages,
    tool,
    layerVisibility,
    selectedZoneId,
    errorCells,
    onCellPaint,
    onZoneAdd,
    onZoneSelect,
    onZoneMove,
    onHover,
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
  let paintErase = false;

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

    // Draw tile layers in order: Ground, Walls
    const tileLayerNames = ['Ground', 'Walls'] as const;
    for (const layerName of tileLayerNames) {
      if (!layerVisibility[layerName]) continue;
      const layer = mapData.layers.find((l) => l.name === layerName);
      if (!layer || layer.type !== 'tilelayer') continue;

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

    // Validation error overlay
    if (errorCells.length) {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2 / zoom;
      for (const [ex, ey] of errorCells) {
        ctx.fillRect(ex * TILE_SIZE, ey * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeRect(ex * TILE_SIZE, ey * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
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

      if (tool === 'zones') {
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
          onZoneAdd(tileX, tileY);
        }
        return;
      }

      isPainting = true;
      paintErase = false;
      onCellPaint(tileX, tileY, false);
    }

    if (e.button === 2 && tool !== 'zones') {
      // Right click = erase (grid → outside, props → remove)
      const { tileX, tileY } = screenToTile(e.clientX, e.clientY);
      if (!isInBounds(tileX, tileY)) return;
      isPainting = true;
      paintErase = true;
      onCellPaint(tileX, tileY, true);
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

      // Only start the drag after a 4px threshold so plain clicks just select
      if (!hasDragMoved && Math.abs(dx) < 4 && Math.abs(dy) < 4) {
        return;
      }
      hasDragMoved = true;

      const zone = mapData.layers[3].objects.find((z) => z.id === draggedZoneId);
      if (zone) {
        // The source model stores tile coordinates, so drags snap live to the grid.
        const tilesW = Math.max(1, Math.round(zone.width / TILE_SIZE));
        const tilesH = Math.max(1, Math.round(zone.height / TILE_SIZE));
        const targetX = Math.max(
          0,
          Math.min(mapData.width - tilesW, Math.round((dragZoneStartX + dx) / TILE_SIZE)),
        );
        const targetY = Math.max(
          0,
          Math.min(mapData.height - tilesH, Math.round((dragZoneStartY + dy) / TILE_SIZE)),
        );
        onZoneMove(draggedZoneId, targetX, targetY);
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

    if (isPainting && isInBounds(tileX, tileY) && tool !== 'zones') {
      onCellPaint(tileX, tileY, paintErase || e.buttons === 2);
    }
  }

  function handleMouseUp() {
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
    errorCells;
    zoom;
    panX;
    panY;
    hoverTileX;
    hoverTileY;
    tool;
    tileImages;
    drawMap();
  });
</script>

<div class="w-full h-full relative" bind:this={containerEl}>
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

  <!-- Coordinate display -->
  {#if isInBounds(hoverTileX, hoverTileY)}
    <div class="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-gray-300 pointer-events-none">
      Tile: ({hoverTileX}, {hoverTileY})
    </div>
  {/if}
</div>
