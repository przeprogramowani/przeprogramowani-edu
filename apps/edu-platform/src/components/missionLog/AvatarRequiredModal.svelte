<script lang="ts">
  interface Props {
    onClose: () => void;
    returnPath: string;
  }

  const { onClose, returnPath }: Props = $props();

  const profileHref = $derived(`/profile?next=${encodeURIComponent(returnPath)}`);

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="avatar-modal-title"
  class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
  onclick={handleBackdropClick}>
  <div
    class="relative w-full max-w-md rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-950 via-indigo-950 to-cyan-950 p-6 shadow-2xl">
    <h2 id="avatar-modal-title" class="text-xl font-semibold text-white mb-3">
      Najpierw ustaw zdjęcie profilowe
    </h2>
    <p class="text-sm text-gray-300 leading-relaxed mb-6">
      Twoje zdjęcie profilowe trafi na odznakę. Dodaj je w swoim profilu — po zapisaniu wrócimy
      tutaj automatycznie.
    </p>
    <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
      <button
        type="button"
        onclick={onClose}
        class="inline-flex justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-white/5 transition-colors">
        Anuluj
      </button>
      <a
        href={profileHref}
        class="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 transition-colors">
        Ustaw avatar
      </a>
    </div>
  </div>
</div>
