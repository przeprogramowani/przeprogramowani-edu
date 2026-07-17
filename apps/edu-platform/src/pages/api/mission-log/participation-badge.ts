import type { APIRoute } from 'astro';
import { resolveMissionLogUser } from '@/server/missionLog/auth';
import {
  BadgesApiError,
  getParticipationBadge,
  type BadgesApiEnv,
} from '@/server/badges/badgesApiClient';
import {
  withApiErrorReporting,
  type RouteContextWithSentry,
} from '@/server/observability/withApiErrorReporting';

const jsonHeaders = { 'Content-Type': 'application/json' };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

async function handler(context: RouteContextWithSentry): Promise<Response> {
  const auth = await resolveMissionLogUser(context);
  if (!auth.ok) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  context.sentry.setUser({ id: auth.user.userId, email: auth.user.email });

  const env = context.locals.runtime.env;
  const badgesEnv: BadgesApiEnv = {
    BADGES_API_BASE_URL: env.BADGES_API_BASE_URL ?? 'https://badges.10xdevs.pl',
    SITE_URL: env.SITE_URL,
  };

  try {
    const badge = await getParticipationBadge(auth.user.email, badgesEnv);
    return jsonResponse({ badge });
  } catch (err) {
    if (err instanceof BadgesApiError) {
      if (err.code === 'origin_forbidden') {
        console.error(
          '[api/mission-log/participation-badge] Badges API origin forbidden — whitelist broken',
          { siteUrl: env.SITE_URL },
        );
        return jsonResponse({ error: 'upstream_origin_forbidden' }, 502);
      }
      console.error('[api/mission-log/participation-badge] Badges API error', {
        status: err.status,
        code: err.code,
        message: err.message,
      });
      return jsonResponse({ error: 'upstream_error' }, 502);
    }
    throw err;
  }
}

export const GET: APIRoute = withApiErrorReporting(handler, {
  route: 'mission-log.participation-badge',
});
