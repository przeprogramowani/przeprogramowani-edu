<script lang="ts">
  interface Props {
    onConfirm: (width: number, height: number) => void;
    onCancel: () => void;
  }

  let { onConfirm, onCancel }: Props = $props();
  let width = $state(14);
  let height = $state(12);

  function handleSubmit(e: Event) {
    e.preventDefault();
    const w = Math.max(4, Math.min(64, width));
    const h = Math.max(4, Math.min(64, height));
    onConfirm(w, h);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
  onkeydown={(e) => { if (e.key === 'Escape') onCancel(); }}
  onclick={onCancel}
>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="bg-[#161b22] border border-gray-700 rounded-lg p-4 w-64 shadow-xl"
    onclick={(e) => e.stopPropagation()}
  >
    <h3 class="text-sm text-gray-200 mb-3">New Map</h3>
    <form onsubmit={handleSubmit} class="flex flex-col gap-3">
      <div class="flex gap-2">
        <label class="flex flex-col gap-0.5 flex-1">
          <span class="text-xs text-gray-500">Width (tiles)</span>
          <input
            type="number"
            min={4}
            max={64}
            bind:value={width}
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          />
        </label>
        <label class="flex flex-col gap-0.5 flex-1">
          <span class="text-xs text-gray-500">Height (tiles)</span>
          <input
            type="number"
            min={4}
            max={64}
            bind:value={height}
            class="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none"
          />
        </label>
      </div>
      <div class="flex gap-2 justify-end">
        <button
          type="button"
          onclick={onCancel}
          class="px-3 py-1.5 rounded text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-3 py-1.5 rounded text-xs bg-blue-600 text-white hover:bg-blue-500 transition-colors"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</div>
