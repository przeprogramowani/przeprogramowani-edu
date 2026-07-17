<script lang="ts">
  import { useCaptchaCallback } from '../hooks/useCaptcha.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  interface LoginFormProps {
    cfSiteKey: string;
    redirect?: string | null;
  }

  const { cfSiteKey, redirect }: LoginFormProps = $props();

  let email = $state('');
  let error = $state('');
  let success = $state('');
  let loading = $state(false);
  let isCaptchaVerified = $state(false);

  onMount(async () => {
    useCaptchaCallback(cfSiteKey, (success) => {
      isCaptchaVerified = success;
    });
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!isCaptchaVerified) {
      error = 'Weryfikacja nie powiodła się. Spróbuj ponownie.';
      return;
    }
    loading = true;
    error = '';
    success = '';

    try {
      await axios.post('/api/auth', { email, redirect });
      success = 'Na wskazany email wysłaliśmy link do logowania';
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          error = 'Zbyt wiele prób logowania. Odczekaj chwilę i spróbuj ponownie.';
        } else {
          error = err.response?.data?.error || 'Wystąpił błąd podczas logowania';
        }
      } else {
        error = 'Wystąpił nieoczekiwany błąd';
      }
    } finally {
      loading = false;
    }
  }

  function handleSocialLogin(provider: 'github' | 'google') {
    // Persist redirect target across OAuth round-trip
    if (redirect) {
      document.cookie = `redirect_after_auth=${redirect}; path=/; max-age=600; secure; samesite=lax`;
    }
    window.location.href = `/api/auth/${provider}`;
  }

</script>

<h2 class="mt-6 text-center text-2xl font-main text-white">Zaloguj się</h2>

<form onsubmit={handleSubmit} class="mt-8 space-y-6">
  <div>
    <label for="email" class="sr-only">Email address</label>
    <input
      id="email"
      name="email"
      type="email"
      required
      bind:value={email}
      class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder="Adres email" />
  </div>

  <div id="cf-captcha-container" class="hidden"></div>

  {#if error}
    <div class="text-red-500 text-sm">{error}</div>
  {/if}

  {#if success}
    <div class="text-green-500 text-sm">{success}</div>
  {/if}

  <div>
    <button
      type="submit"
      disabled={!isCaptchaVerified || loading}
      class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
      {#if loading}
        Wysyłanie...
      {:else}
        Wyślij link do logowania
      {/if}
    </button>
  </div>

  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-700"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 bg-gray-800 text-gray-400">Lub zaloguj się przez</span>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <button
        type="button"
        onclick={() => handleSocialLogin('github')}
        class="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd" />
        </svg>
        GitHub
      </button>

      <button
        type="button"
        onclick={() => handleSocialLogin('google')}
        class="w-full flex items-center justify-center px-4 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
        </svg>
        Google
      </button>
    </div>

  </div>

  <div class="mt-4 text-center text-sm text-gray-400">
    Nie masz konta?
    <a
      href={redirect ? `/signup?redirect=${redirect}` : '/signup'}
      class="text-indigo-400 hover:text-indigo-300">Zarejestruj się</a>
  </div>
</form>
