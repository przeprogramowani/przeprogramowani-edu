import type { APIContext, APIRoute } from 'astro';
import { verifyCaptcha } from '@/server/verifyCaptcha';
import {
  DEFAULT_MEMBERSHIP_FRESHNESS_HOURS,
} from '@/server/circle/membershipCache';
import { getExternalAuthConfig, getCourseDisplayName } from '@/server/circle/externalAuthConfig';
import { resolveMembership } from '@/server/circle/membershipResolver';
import { storeMagicLink } from '@/server/magicLinkManager';
import { sendMagicLinkEmail } from '@/server/email';
import { generateToken } from '@/server/auth';
import { resolveExternalAuthLanguage, resolveExternalAuthReturnUrl, type ExternalAuthLanguage } from '@/server/urlValidation';
import { checkTenXDevs3ToolkitMembership } from '@/server/toolkit/tenXDevs3Membership';
import { log } from '@/lib/logger';

const MAGIC_LINK_TTL_MINUTES = 90;

const LOCAL_TEN_X_DEVS_3_PREWORK_ALLOWED_EMAILS = new Set([
  'marcin@przeprogramowani.pl',
  'przemek@przeprogramowani.pl',
  'przemek.smyrdek@gmail.com',
  'przeprogramowani@gmail.com',
]);

const createJsonResponse = (data: Record<string, unknown>, status: number) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const authMessages: Record<ExternalAuthLanguage, Record<string, string>> = {
  pl: {
    INVALID_EMAIL: 'Nieprawidłowy adres email.',
    INVALID_COURSE: 'Nieprawidłowy identyfikator kursu.',
    NO_ACCESS: 'Nie masz aktywnego dostępu do 10xDevs 3.0 dla tego adresu email. Sprawdź, czy używasz właściwego adresu.',
    MISSING_TOKEN_CONFIG: 'Konfiguracja uwierzytelniania nie jest dostępna dla tego kursu.',
    AUTH_ERROR: 'Wystąpił błąd podczas weryfikacji.',
    NOT_MEMBER: 'Nie jesteś członkiem tej społeczności w Circle. Sprawdź, czy używasz właściwego adresu email.',
    EMAIL_FAILED: 'Nie udało się wysłać wiadomości email. Spróbuj ponownie.',
    SERVER_ERROR: 'Wystąpił błąd serwera.',
  },
  en: {
    INVALID_EMAIL: 'Invalid email address.',
    INVALID_COURSE: 'Invalid course identifier.',
    NO_ACCESS: 'You do not have active access to 10xDevs 3.0 for this email address. Check that you are using the right address.',
    MISSING_TOKEN_CONFIG: 'Authentication is not configured for this course.',
    AUTH_ERROR: 'An error occurred during verification.',
    NOT_MEMBER: 'You are not a member of this Circle community. Check that you are using the right email address.',
    EMAIL_FAILED: 'We could not send the email. Try again.',
    SERVER_ERROR: 'A server error occurred.',
  },
};

function getMessage(lang: ExternalAuthLanguage, code: keyof typeof authMessages.pl): string {
  return authMessages[lang][code];
}

function createErrorResponse(lang: ExternalAuthLanguage, code: keyof typeof authMessages.pl, status: number) {
  return createJsonResponse({ success: false, errorCode: code, error: getMessage(lang, code) }, status);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasLocalPreworkAccessBypass(email: string, courseId: string, env: { ENV?: string; TEST_MODE?: string }): boolean {
  return (
    env.ENV === 'DEV' &&
    env.TEST_MODE === 'true' &&
    courseId === '10xdevs-3-prework' &&
    LOCAL_TEN_X_DEVS_3_PREWORK_ALLOWED_EMAILS.has(email)
  );
}

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
  const env = locals.runtime.env;

  try {
    const body = await request.json();
    const { email, courseId, returnUrl, lang: langHint } = body as {
      email: string;
      courseId: string;
      returnUrl: string;
      lang?: string;
    };
    const responseLang = resolveExternalAuthLanguage(null, langHint);

    // Validate email format
    if (!email || !isValidEmail(email)) {
      return createErrorResponse(responseLang, 'INVALID_EMAIL', 400);
    }

    // Validate courseId exists in configuration
    const config = getExternalAuthConfig(courseId);
    if (!config) {
      return createErrorResponse(responseLang, 'INVALID_COURSE', 400);
    }

    const safeReturnUrl = resolveExternalAuthReturnUrl(returnUrl, courseId, env.SITE_URL, langHint);
    const lang = resolveExternalAuthLanguage(safeReturnUrl, langHint);

    const normalizedEmail = email.toLowerCase().trim();
    const hasLocalAccessBypass = hasLocalPreworkAccessBypass(normalizedEmail, courseId, env);

    if (!hasLocalAccessBypass) {
      // Temporary pre-broker toolkit KV bridge for 10xDevs 3.
      // Plan: thoughts/shared/plans/2026-04-26-10xdevs-3-toolkit-kv-external-auth.md
      const toolkitDecision = await checkTenXDevs3ToolkitMembership(normalizedEmail, courseId, env);

      if (toolkitDecision.applies) {
        if (!toolkitDecision.allowed) {
          return createErrorResponse(lang, 'NO_ACCESS', 403);
        }
      } else {
        const membershipDecision = await resolveMembership(normalizedEmail, courseId, env, {
          freshnessHours: env.EXTERNAL_MEMBERSHIP_CACHE_TTL_HOURS || DEFAULT_MEMBERSHIP_FRESHNESS_HOURS,
        });

        if (membershipDecision.status === 'error') {
          if (membershipDecision.reason === 'missing_v1_token') {
            return createErrorResponse(lang, 'MISSING_TOKEN_CONFIG', 500);
          }

          return createErrorResponse(lang, 'AUTH_ERROR', 500);
        }

        if (membershipDecision.status !== 'active') {
          return createErrorResponse(lang, 'NOT_MEMBER', 403);
        }
      }
    }

    // Generate magic link token
    const token = await generateToken(normalizedEmail, env.JWT_SECRET);
    await storeMagicLink(token, normalizedEmail, env, MAGIC_LINK_TTL_MINUTES);

    // Build magic link URL (course-specific verify page)
    const verifyUrl = `${env.SITE_URL}/external/${courseId}/verify?token=${token}&returnUrl=${encodeURIComponent(safeReturnUrl)}`;

    // Send email with external template and course name
    const destEmail = env.ENV === 'DEV' ? 'przeprogramowani@gmail.com' : normalizedEmail;
    const courseName = getCourseDisplayName(courseId);
    const emailResult = await sendMagicLinkEmail({
      to: destEmail,
      magicLink: verifyUrl,
      template: 'external',
      ttlMinutes: MAGIC_LINK_TTL_MINUTES,
      lang,
      courseName,
      brandColor: config.brandColor,
      resendApiKey: env.RESEND_API_KEY,
      fallbackMailingServiceUrl: env.MAILING_SERVICE_URL,
    });
    const emailSent = emailResult.success;

    if (!emailSent) {
      log({ level: 'error', event: 'external_auth.email_failed', courseId, email: normalizedEmail });
      return createErrorResponse(lang, 'EMAIL_FAILED', 500);
    }

    log({ level: 'info', event: 'external_auth.magic_link_sent', courseId, email: normalizedEmail });
    return createJsonResponse({ success: true }, 200);
  } catch (error) {
    log({ level: 'error', event: 'external_auth.server_error', error: String(error) });
    return createErrorResponse('pl', 'SERVER_ERROR', 500);
  }
};
