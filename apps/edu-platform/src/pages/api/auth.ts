import type { APIContext, APIRoute } from 'astro';
import { generateToken } from '../../server/auth';
import { sendMagicLinkEmail } from '@/server/email';
import { storeMagicLink, DEFAULT_MAGIC_LINK_TTL_MINUTES } from '@/server/magicLinkManager';

import {
  SITE_URL,
  MAILING_SERVICE_URL,
  JWT_SECRET, ENV,
  RESEND_API_KEY,
  TEN_X_DEVS_MAILERLITE_API_KEY,
  TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID
} from 'astro:env/server';
import { subscribeToNewsletter } from '@/server/newsletter';
import { log } from '@/lib/logger';

const createJsonResponse = (data: Record<string, unknown>, status: number, headers: Headers) => {
  headers.set('Content-Type', 'application/json');
  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
};

export const POST: APIRoute = async ({ request, locals }: APIContext) => {
  const responseHeaders = new Headers();

  try {
    const { email, newsletterOptIn, redirect } = await request.json();

    if (!email) {
      return createJsonResponse({ error: 'Email jest wymagany' }, 400, responseHeaders);
    }

    // Newsletter subscription — fire-and-forget
    const mlApiKey = TEN_X_DEVS_MAILERLITE_API_KEY;
    const mlGroupId = TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID;
    if (newsletterOptIn && mlApiKey && mlGroupId) {
      const clientIp = request.headers.get('cf-connecting-ip') || undefined;
      const nlPromise = subscribeToNewsletter(email, mlApiKey, mlGroupId, 'active', clientIp).catch((err) =>
        console.error('[newsletter] Subscription failed:', err)
      );
      locals.runtime.ctx.waitUntil(nlPromise);
    } else if (newsletterOptIn) {
      console.warn('[newsletter] ML subscription skipped on magic link signup', {
        hasApiKey: !!mlApiKey,
        hasGroupId: !!mlGroupId,
      });
    }

    const token = await generateToken(email, JWT_SECRET);

    await storeMagicLink(token, email, locals.runtime?.env, undefined, newsletterOptIn);
    let magicLink = `${SITE_URL}/verify?token=${token}`;
    if (redirect) {
      magicLink += `&redirect=${encodeURIComponent(redirect)}`;
    }

    log({ level: 'info', event: 'magic_link.generated', email });

    const destEmail = ENV === 'DEV' ? 'przeprogramowani@gmail.com' : email;
    const emailResult = await sendMagicLinkEmail({
      to: destEmail,
      magicLink,
      template: 'main',
      ttlMinutes: DEFAULT_MAGIC_LINK_TTL_MINUTES,
      lang: 'pl',
      resendApiKey: RESEND_API_KEY,
      fallbackMailingServiceUrl: MAILING_SERVICE_URL,
    });
    const emailSent = emailResult.success;

    if (emailSent) {
      return createJsonResponse(
        { success: true, message: 'Link do logowania został wysłany na podany email.' },
        200,
        responseHeaders
      );
    } else {
      log({ level: 'error', event: 'magic_link.email_failed', email });
      throw new Error('Nie udało się wysłać linku do logowania.');
    }
  } catch (error) {
    log({ level: 'error', event: 'auth.server_error', error: String(error) });
    return createJsonResponse({ error: 'Wystąpił błąd serwera.' }, 500, responseHeaders);
  }
};
