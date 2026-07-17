<script lang="ts">
  const DISPLAY_SIZE = 28;

  interface Props {
    tileImages: ImageBitmap[];
    selectedTile: number;
    onSelect: (tileId: number) => void;
  }

  let { tileImages, selectedTile, onSelect }: Props = $props();
  let canvasRefs: (HTMLCanvasElement | undefined)[] = $state([]);

  function drawTile(canvas: HTMLCanvasElement, imageIndex: number) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    if (tileImages[imageIndex]) {
      ctx.drawImage(tileImages[imageIndex], 0, 0, DISPLAY_SIZE, DISPLAY_SIZE);
    }
  }

  $effect(() => {
    if (!tileImages.length) return;
    for (let i = 0; i < tileImages.length; i++) {
      const canvas = canvasRefs[i];
      if (canvas) drawTile(canvas, i);
    }
  });
</script>

<div class="p-2 border-b border-gray-700">
  <div class="text-xs text-gray-400 mb-2 uppercase tracking-wider">Tiles</div>
  <button
    class="mb-1.5 w-full flex items-center gap-2 px-2 py-1 rounded text-xs border transition-colors"
    class:border-yellow-400={selectedTile === 0}
    class:text-yellow-400={selectedTile === 0}
    class:border-gray-600={selectedTile !== 0}
    class:text-gray-400={selectedTile !== 0}
    class:hover:border-gray-400={selectedTile !== 0}
    onclick={() => onSelect(0)}
    title="Eraser (remove tile)"
  >
    <span class="text-red-400 font-bold">&#x2715;</span> Eraser
  </button>
  <div class="grid grid-cols-8 gap-0.5">
    {#each { length: tileImages.length } as _, i}
      {@const tileId = i + 1}
      <button
        class="w-7 h-7 border border-gray-600 hover:border-gray-400 transition-colors"
        class:border-yellow-400={selectedTile === tileId}
        class:border-2={selectedTile === tileId}
        onclick={() => onSelect(tileId)}
        title={`Tile ${tileId}`}
      >
        <canvas
          bind:this={canvasRefs[i]}
          width={DISPLAY_SIZE}
          height={DISPLAY_SIZE}
          class="w-full h-full"
        ></canvas>
      </button>
    {/each}
  </div>
</div>
