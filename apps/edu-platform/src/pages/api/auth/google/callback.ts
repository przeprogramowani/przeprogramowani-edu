import type { APIRoute } from 'astro';
import { handleSocialAuth } from '@/server/socialAuth';
import { getSessionCookieOptions, normalizeEmail } from '@/server/auth';
import {
  SITE_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  TEN_X_DEVS_MAILERLITE_API_KEY,
  TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID
} from 'astro:env/server';
import { resolveRedirect } from '@/server/redirects';
import { upsertUser } from '@/server/supabase/userService';
import { syncFromAirtable } from '@/server/supabase/airtableSyncService';
import { syncAllCircleCourses } from '@/server/supabase/circleSyncService';
import { upsertGrant } from '@/server/supabase/accessService';
import { subscribeToNewsletter } from '@/server/newsletter';
import { log } from '@/lib/logger';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

/**
 * Google OAuth callback handler
 * This endpoint handles the callback from Google, exchanges the code for an access token,
 * and gets the user's email address to proceed with direct authentication
 */
export const GET: APIRoute = async ({ request, cookies, locals, redirect }) => {
  // Get the code and state from the URL
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  // Get state from cookie
  const storedState = cookies.get('oauth_state')?.value;

  // Validate state to prevent CSRF
  if (!code || !state || !storedState || state !== storedState) {
    return redirect('/login?error=INVALID_OAUTH');
  }

  try {
    // Clear state cookie
    cookies.delete('oauth_state');

    // Read and consume newsletter opt-in cookie
    const newsletterOptIn = cookies.get('newsletter_optin')?.value === '1';
    cookies.delete('newsletter_optin', { path: '/' });

    // Read and consume redirect cookie
    const redirectTarget = cookies.get('redirect_after_auth')?.value;
    cookies.delete('redirect_after_auth', { path: '/' });

    // Helper for error redirects that preserve the redirect param
    const errorRedirect = (error: string) => {
      const params = new URLSearchParams({ error });
      if (redirectTarget) params.set('redirect', redirectTarget);
      return redirect(`/login?${params.toString()}`);
    };

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: `${SITE_URL}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

    if (!tokenData.access_token) {
      console.error('Failed to get Google access token', tokenData);
      return errorRedirect('OAUTH_FAILED');
    }

    // Get user's info including email
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = (await userInfoResponse.json()) as GoogleUserInfo;

    if (!userInfo.email || !userInfo.verified_email) {
      return errorRedirect('NO_VERIFIED_EMAIL');
    }

    userInfo.email = normalizeEmail(userInfo.email);

    // Use helper function to get JWT token
    const authResult = await handleSocialAuth(userInfo.email, locals.runtime.env);

    if (!authResult.success || !authResult.token) {
      return errorRedirect(authResult.error || 'OAUTH_ERROR');
    }

    // Set JWT token cookie directly
    cookies.set('token', authResult.token, getSessionCookieOptions());

    // Supabase sync — registered with ctx.waitUntil so CF Workers keeps the
    // execution context alive after the redirect response is sent
    log({ level: 'info', event: 'auth.login', method: 'google', email: userInfo.email });
    const syncEnv = locals.runtime.env;
    // Avatar URL is deliberately not pulled from OAuth: avatar_url must always point at our
    // own bucket (link + file invariant) so we can hand it to external APIs without leaking
    // third-party CDN URLs. Users upload their avatar via /profile.
    const syncPromise = upsertUser(userInfo.email, syncEnv, {
      newsletterOptIn,
      firstName: userInfo.given_name ?? null,
      lastName: userInfo.family_name ?? null,
    })
      .then(async (userId) => {
        await upsertGrant(userId, 'explorers', 'free', syncEnv);
        await Promise.allSettled([
          syncFromAirtable(userId, userInfo.email, syncEnv),
          syncAllCircleCourses(userId, userInfo.email, syncEnv),
        ]);
        // Newsletter subscription
        const mlApiKey = TEN_X_DEVS_MAILERLITE_API_KEY;
        const mlGroupId = TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID;
        if (newsletterOptIn && mlApiKey && mlGroupId) {
          const clientIp = request.headers.get('cf-connecting-ip') || undefined;
          await subscribeToNewsletter(userInfo.email, mlApiKey, mlGroupId, 'active', clientIp);
        } else if (newsletterOptIn) {
          console.warn('[newsletter] ML subscription skipped on Google signup', {
            hasApiKey: !!mlApiKey,
            hasGroupId: !!mlGroupId,
          });
        }
      })
      .catch((err) => log({ level: 'error', event: 'auth.supabase_sync_failed', method: 'google', error: String(err) }));

    if (syncEnv.ENV === 'PROD') {
      locals.runtime.ctx.waitUntil(syncPromise);
    } else {
      await syncPromise;
    }

    // Redirect to intended destination
    return redirect(resolveRedirect(redirectTarget));
  } catch (error) {
    log({ level: 'error', event: 'auth.oauth_error', method: 'google', error: String(error) });
    return redirect('/login?error=OAUTH_ERROR');
  }
};
