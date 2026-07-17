<script lang="ts">
  import axios from 'axios';

  interface ProfileFormProps {
    email: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
    nextPath?: string | null;
  }

  const props: ProfileFormProps = $props();

  const NAME_MAX_LENGTH = 60;
  const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
  const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

  let firstName = $state(props.firstName ?? '');
  let lastName = $state(props.lastName ?? '');
  let avatarUrl = $state<string | null>(props.avatarUrl);
  let avatarFailed = $state(false);

  let nameError = $state('');
  let nameSuccess = $state('');
  let nameSaving = $state(false);

  let avatarError = $state('');
  let avatarSuccess = $state('');
  let avatarBusy = $state(false);

  let fileInput = $state<HTMLInputElement | null>(null);

  const initials = $derived.by(() => {
    const f = firstName.trim();
    const l = lastName.trim();
    if (f && l) return (f.charAt(0) + l.charAt(0)).toUpperCase();
    if (f) return f.charAt(0).toUpperCase();
    return props.email.charAt(0).toUpperCase();
  });

  function clearAvatarMessages() {
    avatarError = '';
    avatarSuccess = '';
  }

  function clearNameMessages() {
    nameError = '';
    nameSuccess = '';
  }

  function normalizeNameInput(value: string): string | null {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  }

  async function handleNameSubmit(e: SubmitEvent) {
    e.preventDefault();
    clearNameMessages();

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    if (trimmedFirst.length > NAME_MAX_LENGTH || trimmedLast.length > NAME_MAX_LENGTH) {
      nameError = `Imię i nazwisko mogą mieć maksymalnie ${NAME_MAX_LENGTH} znaków.`;
      return;
    }

    nameSaving = true;
    try {
      const { data } = await axios.put('/api/profile', {
        firstName: normalizeNameInput(firstName),
        lastName: normalizeNameInput(lastName),
      });
      firstName = data.firstName ?? '';
      lastName = data.lastName ?? '';
      nameSuccess = 'Zapisano zmiany.';
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.error;
        if (code === 'INVALID_FIRST_NAME') {
          nameError = `Imię jest niepoprawne (maks. ${NAME_MAX_LENGTH} znaków).`;
        } else if (code === 'INVALID_LAST_NAME') {
          nameError = `Nazwisko jest niepoprawne (maks. ${NAME_MAX_LENGTH} znaków).`;
        } else if (err.response?.status === 401) {
          nameError = 'Sesja wygasła. Zaloguj się ponownie.';
        } else {
          nameError = 'Nie udało się zapisać zmian. Spróbuj ponownie.';
        }
      } else {
        nameError = 'Wystąpił nieoczekiwany błąd.';
      }
    } finally {
      nameSaving = false;
    }
  }

  function openFilePicker() {
    clearAvatarMessages();
    fileInput?.click();
  }

  async function handleFileChange(e: Event) {
    clearAvatarMessages();
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      avatarError = 'Niedozwolony format. Akceptujemy PNG, JPEG, WebP.';
      target.value = '';
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      avatarError = 'Plik jest zbyt duży. Maksymalny rozmiar to 2MB.';
      target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    avatarBusy = true;
    try {
      const { data } = await axios.post('/api/profile/avatar', formData);
      avatarUrl = data.avatarUrl;
      avatarFailed = false;
      avatarSuccess = 'Zdjęcie zostało zaktualizowane.';
      if (props.nextPath) {
        window.location.href = props.nextPath;
        return;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const code = err.response?.data?.error;
        if (code === 'TOO_LARGE') {
          avatarError = 'Plik jest zbyt duży. Maksymalny rozmiar to 2MB.';
        } else if (code === 'INVALID_TYPE') {
          avatarError = 'Niedozwolony format. Akceptujemy PNG, JPEG, WebP.';
        } else if (code === 'MISSING_FILE') {
          avatarError = 'Nie wybrano pliku.';
        } else if (err.response?.status === 401) {
          avatarError = 'Sesja wygasła. Zaloguj się ponownie.';
        } else {
          avatarError = 'Nie udało się przesłać zdjęcia. Spróbuj ponownie.';
        }
      } else {
        avatarError = 'Wystąpił nieoczekiwany błąd.';
      }
    } finally {
      avatarBusy = false;
      target.value = '';
    }
  }

  async function handleRemoveAvatar() {
    clearAvatarMessages();
    avatarBusy = true;
    try {
      await axios.delete('/api/profile/avatar');
      avatarUrl = null;
      avatarSuccess = 'Zdjęcie zostało usunięte.';
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        avatarError = 'Sesja wygasła. Zaloguj się ponownie.';
      } else {
        avatarError = 'Nie udało się usunąć zdjęcia. Spróbuj ponownie.';
      }
    } finally {
      avatarBusy = false;
    }
  }
</script>

<div class="space-y-8">
  <section class="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6">
    <h2 class="text-lg font-medium text-white mb-1">Email</h2>
    <p class="text-gray-200 break-all">{props.email}</p>
    <p class="mt-2 text-xs text-gray-500">Adresu email nie można zmienić.</p>
  </section>

  <section class="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6">
    <h2 class="text-lg font-medium text-white mb-4">Zdjęcie profilowe</h2>

    <div class="flex items-center gap-4">
      <div class="flex-shrink-0 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-600 text-white text-2xl font-medium overflow-hidden">
        {#if avatarUrl && !avatarFailed}
          <img
            src={avatarUrl}
            alt="Avatar"
            class="w-full h-full object-cover"
            onerror={() => (avatarFailed = true)} />
        {:else}
          <span>{initials}</span>
        {/if}
      </div>

      <div class="flex flex-col gap-2">
        <button
          type="button"
          onclick={openFilePicker}
          disabled={avatarBusy}
          class="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {avatarBusy ? 'Przesyłanie...' : 'Wybierz zdjęcie'}
        </button>

        {#if avatarUrl}
          <button
            type="button"
            onclick={handleRemoveAvatar}
            disabled={avatarBusy}
            class="inline-flex justify-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-transparent hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
            Usuń zdjęcie
          </button>
        {/if}
      </div>
    </div>

    <input
      bind:this={fileInput}
      type="file"
      accept="image/png,image/jpeg,image/webp"
      onchange={handleFileChange}
      class="hidden" />

    <p class="mt-3 text-xs text-gray-500">Zalecane: kwadratowy obraz, max 2MB.</p>

    {#if avatarError}
      <div class="mt-3 text-red-500 text-sm">{avatarError}</div>
    {/if}
    {#if avatarSuccess}
      <div class="mt-3 text-green-500 text-sm">{avatarSuccess}</div>
    {/if}
  </section>

  <section class="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6">
    <h2 class="text-lg font-medium text-white mb-4">Imię i nazwisko</h2>

    <form onsubmit={handleNameSubmit} class="space-y-4">
      <div>
        <label for="firstName" class="block text-sm text-gray-300 mb-1">Imię</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          maxlength={NAME_MAX_LENGTH}
          bind:value={firstName}
          class="appearance-none rounded-md block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="np. Anna" />
      </div>

      <div>
        <label for="lastName" class="block text-sm text-gray-300 mb-1">Nazwisko</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          maxlength={NAME_MAX_LENGTH}
          bind:value={lastName}
          class="appearance-none rounded-md block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="np. Kowalska" />
      </div>

      {#if nameError}
        <div class="text-red-500 text-sm">{nameError}</div>
      {/if}
      {#if nameSuccess}
        <div class="text-green-500 text-sm">{nameSuccess}</div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={nameSaving}
          class="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
          {nameSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
        </button>
      </div>
    </form>
  </section>

  <section class="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6">
    <h2 class="text-lg font-medium text-white mb-2">Pomoc</h2>
    <p class="text-sm text-gray-300">
      Masz pytanie lub problem? Napisz do nas na
      <a href="mailto:kontakt@przeprogramowani.pl" class="text-indigo-400 hover:text-indigo-300">kontakt@przeprogramowani.pl</a>.
    </p>
  </section>
</div>
