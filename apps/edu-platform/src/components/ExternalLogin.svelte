<script lang="ts">
  import { useCaptchaCallback, type CaptchaStatus } from '../hooks/useCaptcha.svelte';
  import { onMount } from 'svelte';
  import axios from 'axios';

  type ExternalAuthLanguage = 'pl' | 'en';

  interface ExternalLoginProps {
    cfSiteKey: string;
    courseId: string;
    returnUrl: string;
    lang?: ExternalAuthLanguage;
  }

  const { cfSiteKey, courseId, returnUrl, lang = 'pl' }: ExternalLoginProps = $props();

  const copy = {
    pl: {
      emailLabel: 'Adres email',
      emailPlaceholder: 'Adres email',
      captchaError: 'Weryfikacja nie powiodła się. Spróbuj ponownie.',
      rateLimitError: 'Zbyt wiele prób logowania. Odczekaj chwilę i spróbuj ponownie.',
      genericLoginError: 'Wystąpił błąd podczas logowania',
      unexpectedError: 'Wystąpił nieoczekiwany błąd',
      success: 'Na wskazany email wysłaliśmy link do logowania. Sprawdź swoją skrzynkę.',
      loading: 'Wysyłanie...',
      submit: 'Wyślij link do logowania',
      emailHint: 'Adres email musi być taki sam, jak ten użyty w społeczności Circle.',
      captchaStatuses: {
        checking: 'Rozwiązujemy Captchę dla Ciebie - zaraz ruszamy!',
        interactive: 'Potrzebujemy twojego wsparcia.',
        verifying: 'Gotowi za 3... 2... 1...',
        failed: 'Automatyczne sprawdzenie nie powiodło się. Odśwież stronę i spróbuj raz jeszcze.',
      },
      serverErrors: {
        INVALID_EMAIL: 'Nieprawidłowy adres email.',
        INVALID_COURSE: 'Nieprawidłowy identyfikator kursu.',
        NO_ACCESS: 'Nie masz aktywnego dostępu do 10xDevs 3.0 dla tego adresu email. Sprawdź, czy używasz właściwego adresu.',
        MISSING_TOKEN_CONFIG: 'Konfiguracja uwierzytelniania nie jest dostępna dla tego kursu.',
        AUTH_ERROR: 'Wystąpił błąd podczas weryfikacji.',
        NOT_MEMBER: 'Nie jesteś członkiem tej społeczności w Circle. Sprawdź, czy używasz właściwego adresu email.',
        EMAIL_FAILED: 'Nie udało się wysłać wiadomości email. Spróbuj ponownie.',
      },
    },
    en: {
      emailLabel: 'Email address',
      emailPlaceholder: 'Email address',
      captchaError: 'Verification failed. Try again.',
      rateLimitError: 'Too many sign-in attempts. Wait a moment and try again.',
      genericLoginError: 'An error occurred while signing in',
      unexpectedError: 'An unexpected error occurred',
      success: 'We sent a sign-in link to the email address you provided. Check your inbox.',
      loading: 'Sending...',
      submit: 'Send sign-in link',
      emailHint: 'Use the same email address you use in the Circle community.',
      captchaStatuses: {
        checking: 'We are checking things automatically for you.',
        interactive: 'We need one quick confirmation.',
        verifying: 'Ready in 3... 2... 1...',
        failed: 'The automatic check did not finish. Refresh and try again.',
      },
      serverErrors: {
        INVALID_EMAIL: 'Invalid email address.',
        INVALID_COURSE: 'Invalid course identifier.',
        NO_ACCESS: 'You do not have active access to 10xDevs 3.0 for this email address. Check that you are using the right address.',
        MISSING_TOKEN_CONFIG: 'Authentication is not configured for this course.',
        AUTH_ERROR: 'An error occurred during verification.',
        NOT_MEMBER: 'You are not a member of this Circle community. Check that you are using the right email address.',
        EMAIL_FAILED: 'We could not send the email. Try again.',
      },
    },
  } as const;

  const currentCopy = copy[lang];

  let email = $state('');
  let error = $state('');
  let success = $state('');
  let loading = $state(false);
  let isCaptchaVerified = $state(false);
  let captchaStatus = $state<CaptchaStatus>('checking');

  onMount(async () => {
    useCaptchaCallback(
      cfSiteKey,
      (captchaSuccess) => {
        isCaptchaVerified = captchaSuccess;
      },
      (status) => {
        captchaStatus = status;
      }
    );
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!isCaptchaVerified) {
      error = currentCopy.captchaError;
      return;
    }
    loading = true;
    error = '';
    success = '';

    try {
      const response = await axios.post('/api/external/auth', {
        email,
        courseId,
        returnUrl,
        lang,
      });

      if (response.data.success) {
        success = currentCopy.success;
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          error = currentCopy.rateLimitError;
        } else {
          const errorCode = err.response?.data?.errorCode;
          error =
            (typeof errorCode === 'string' && currentCopy.serverErrors[errorCode as keyof typeof currentCopy.serverErrors]) ||
            err.response?.data?.error ||
            currentCopy.genericLoginError;
        }
      } else {
        error = currentCopy.unexpectedError;
      }
    } finally {
      loading = false;
    }
  }
</script>

<form onsubmit={handleSubmit} class="mt-8 space-y-6">
  <div>
    <label for="email" class="sr-only">{currentCopy.emailLabel}</label>
    <input
      id="email"
      name="email"
      type="email"
      required
      bind:value={email}
      class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
      placeholder={currentCopy.emailPlaceholder} />
  </div>

  <div id="cf-captcha-container" class="hidden"></div>

  {#if captchaStatus !== 'verified'}
    <div
      class:text-amber-300={captchaStatus === 'interactive'}
      class:text-red-400={captchaStatus === 'failed'}
      class="flex items-center gap-2 text-sm text-gray-400"
      aria-live="polite">
      {#if captchaStatus === 'checking' || captchaStatus === 'verifying'}
        <span
          class="h-3 w-3 shrink-0 animate-spin rounded-full border border-gray-500 border-t-transparent"
          aria-hidden="true"></span>
      {/if}
      {currentCopy.captchaStatuses[captchaStatus]}
    </div>
  {/if}

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
        {currentCopy.loading}
      {:else}
        {currentCopy.submit}
      {/if}
    </button>
  </div>

  <div class="mt-3 text-xs text-center text-gray-400">
    {currentCopy.emailHint}
  </div>
</form>
