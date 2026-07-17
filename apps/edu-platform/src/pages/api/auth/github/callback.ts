import type { APIRoute } from 'astro';
import { handleSocialAuth } from '@/server/socialAuth';
import { getSessionCookieOptions, normalizeEmail } from '@/server/auth';
import {
  SITE_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
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

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubEmailResponse {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

interface GitHubUserResponse {
  name: string | null;
}

function splitGitHubName(name: string | null | undefined): {
  firstName: string | null;
  lastName: string | null;
} {
  const trimmed = name?.trim();
  if (!trimmed) return { firstName: null, lastName: null };
  const idx = trimmed.indexOf(' ');
  if (idx === -1) return { firstName: trimmed, lastName: null };
  return {
    firstName: trimmed.slice(0, idx),
    lastName: trimmed.slice(idx + 1).trim() || null,
  };
}

/**
 * GitHub OAuth callback handler
 * This endpoint handles the callback from GitHub, exchanges the code for an access token,
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
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'PrzeprogramowaniPlatform',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${SITE_URL}/api/auth/github/callback`,
      }),
    });

    // Check if response is OK before parsing
    if (!tokenResponse.ok) {
      const responseText = await tokenResponse.text();
      console.error('GitHub token response error:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        responseBody: responseText,
      });
      return errorRedirect('GITHUB_API_ERROR');
    }

    // Parse the JSON response
    let tokenData: GitHubTokenResponse;
    try {
      tokenData = await tokenResponse.json();
    } catch (jsonError) {
      console.error('Failed to parse GitHub token response as JSON:', jsonError);
      return errorRedirect('INVALID_RESPONSE');
    }

    if (!tokenData.access_token) {
      console.error('Failed to get GitHub access token', tokenData);
      return errorRedirect('OAUTH_FAILED');
    }

    // Get user's email
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
        'User-Agent': 'PrzeprogramowaniPlatform',
      },
    });

    // Check if email response is OK
    if (!emailResponse.ok) {
      const responseText = await emailResponse.text();
      console.error('GitHub email API error:', {
        status: emailResponse.status,
        statusText: emailResponse.statusText,
        responseBody: responseText,
      });
      return errorRedirect('GITHUB_EMAIL_API_ERROR');
    }

    // Parse the email response
    let emails: GitHubEmailResponse[];
    try {
      emails = await emailResponse.json();
    } catch (jsonError) {
      console.error('Failed to parse GitHub email response as JSON:', jsonError);
      return errorRedirect('INVALID_EMAIL_RESPONSE');
    }

    // Find primary and verified email
    const rawPrimaryEmail = emails.find((e) => e.primary && e.verified)?.email;

    if (!rawPrimaryEmail) {
      return errorRedirect('NO_VERIFIED_EMAIL');
    }

    const primaryEmail = normalizeEmail(rawPrimaryEmail);

    // Best-effort fetch of name for first-time-signup pre-fill.
    // Failure must not block login.
    let githubProfile: GitHubUserResponse | null = null;
    try {
      const userResponse = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: 'application/json',
          'User-Agent': 'PrzeprogramowaniPlatform',
        },
      });
      if (userResponse.ok) {
        githubProfile = (await userResponse.json()) as GitHubUserResponse;
      } else {
        console.warn('[github/callback] /user fetch failed', { status: userResponse.status });
      }
    } catch (err) {
      console.warn('[github/callback] /user fetch threw', err);
    }

    // Use helper function to get JWT token
    const authResult = await handleSocialAuth(primaryEmail, locals.runtime.env);

    if (!authResult.success || !authResult.token) {
      return errorRedirect(authResult.error || 'OAUTH_ERROR');
    }

    // Set JWT token cookie directly
    cookies.set('token', authResult.token, getSessionCookieOptions());

    // Supabase sync — registered with ctx.waitUntil so CF Workers keeps the
    // execution context alive after the redirect response is sent
    log({ level: 'info', event: 'auth.login', method: 'github', email: primaryEmail });
    const syncEnv = locals.runtime.env;
    const { firstName, lastName } = splitGitHubName(githubProfile?.name);
    // Avatar URL is deliberately not pulled from OAuth: avatar_url must always point at our
    // own bucket (link + file invariant) so we can hand it to external APIs without leaking
    // third-party CDN URLs. Users upload their avatar via /profile.
    const syncPromise = upsertUser(primaryEmail, syncEnv, {
      newsletterOptIn,
      firstName,
      lastName,
    })
      .then(async (userId) => {
        await upsertGrant(userId, 'explorers', 'free', syncEnv);
        await Promise.allSettled([
          syncFromAirtable(userId, primaryEmail, syncEnv),
          syncAllCircleCourses(userId, primaryEmail, syncEnv),
        ]);
        // Newsletter subscription
        const mlApiKey = TEN_X_DEVS_MAILERLITE_API_KEY;
        const mlGroupId = TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID;
        if (newsletterOptIn && mlApiKey && mlGroupId) {
          const clientIp = request.headers.get('cf-connecting-ip') || undefined;
          await subscribeToNewsletter(primaryEmail, mlApiKey, mlGroupId, 'active', clientIp);
        } else if (newsletterOptIn) {
          console.warn('[newsletter] ML subscription skipped on GitHub signup', {
            hasApiKey: !!mlApiKey,
            hasGroupId: !!mlGroupId,
          });
        }
      })
      .catch((err) => log({ level: 'error', event: 'auth.supabase_sync_failed', method: 'github', error: String(err) }));

    if (syncEnv.ENV === 'PROD') {
      locals.runtime.ctx.waitUntil(syncPromise);
    } else {
      await syncPromise;
    }

    // Redirect to intended destination
    return redirect(resolveRedirect(redirectTarget));
  } catch (error) {
    log({ level: 'error', event: 'auth.oauth_error', method: 'github', error: String(error) });
    return redirect('/login?error=OAUTH_ERROR');
  }
};
