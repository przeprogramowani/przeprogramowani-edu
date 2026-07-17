import type { APIRoute } from 'astro';
import { isModuleUnlocked } from '@/server/courseGating';
import { TEN_X_DEVS_3_GATING } from '@/server/courseGating/tenXDevs3';
import { resolveMissionLogUser } from '@/server/missionLog/auth';
import {
  BadgesApiError,
  generateBadge,
  type BadgesApiEnv,
} from '@/server/badges/badgesApiClient';
import {
  MAX_GENERATIONS_PER_LESSON,
  QuotaExhaustedError,
  getQuotaForUser,
  recordGeneration,
} from '@/server/missionLog/quotaService';
import { findMissionLogLesson } from '@/models/missionLog/lessonCatalog';
import {
  withApiErrorReporting,
  type RouteContextWithSentry,
} from '@/server/observability/withApiErrorReporting';

const jsonHeaders = { 'Content-Type': 'application/json' };

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function handler(context: RouteContextWithSentry): Promise<Response> {
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  if (!isObject(body) || typeof body.lessonId !== 'string') {
    return jsonResponse({ error: 'Invalid request body' }, 400);
  }

  const lessonId = body.lessonId;
  const requestedDevBypass = body.devBypassGating === true;

  context.sentry.setMissionLogContext({
    lessonId,
    devBypassGating: requestedDevBypass,
  });

  const auth = await resolveMissionLogUser(context);
  if (!auth.ok) {
    return jsonResponse({ error: auth.error }, auth.status);
  }

  context.sentry.setUser({ id: auth.user.userId, email: auth.user.email });

  const lesson = findMissionLogLesson(lessonId);
  if (!lesson) {
    return jsonResponse({ error: 'lesson_not_found' }, 404);
  }

  context.sentry.setMissionLogContext({
    lessonId,
    devBypassGating: requestedDevBypass,
    badgeId: lesson.badgeId,
    moduleId: lesson.moduleId,
  });

  if (!auth.user.avatarUrl) {
    return jsonResponse({ error: 'avatar_missing' }, 409);
  }

  const env = context.locals.runtime.env;
  const devBypassActive = requestedDevBypass && env.ENV !== 'PROD';
  if (devBypassActive) {
    console.warn('[api/mission-log/generate] dev bypass active — skipping module gating', {
      lessonId,
      env: env.ENV,
    });
  }

  if (!devBypassActive && !isModuleUnlocked(TEN_X_DEVS_3_GATING, lesson.moduleId)) {
    const moduleConfig = TEN_X_DEVS_3_GATING.modules.find((m) => m.id === lesson.moduleId);
    return jsonResponse(
      { error: 'module_locked', unlocksAt: moduleConfig?.unlocksAt ?? null },
      403,
    );
  }
  const supabaseEnv = {
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: env.SUPABASE_SERVICE_KEY,
  };

  const quota = await getQuotaForUser(auth.user.userId, supabaseEnv);
  const existing = quota.find((q) => q.lessonId === lessonId);
  if (existing && existing.count >= MAX_GENERATIONS_PER_LESSON) {
    return jsonResponse({ error: 'quota_exhausted' }, 429);
  }

  const badgesEnv: BadgesApiEnv = {
    BADGES_API_BASE_URL: env.BADGES_API_BASE_URL ?? 'https://badges.10xdevs.pl',
    SITE_URL: env.SITE_URL,
  };

  let upstream;
  try {
    upstream = await generateBadge(
      { email: auth.user.email, badgeId: lesson.badgeId, imageUrl: auth.user.avatarUrl },
      badgesEnv,
    );
  } catch (err) {
    if (err instanceof BadgesApiError) {
      if (err.code === 'rate_limited') {
        return jsonResponse({ error: 'upstream_busy' }, 503);
      }
      if (err.code === 'origin_forbidden') {
        console.error('[api/mission-log/generate] Badges API origin forbidden — whitelist broken', {
          siteUrl: env.SITE_URL,
        });
        return jsonResponse({ error: 'upstream_origin_forbidden' }, 502);
      }
      console.error('[api/mission-log/generate] Badges API error', {
        status: err.status,
        code: err.code,
        message: err.message,
      });
      return jsonResponse({ error: 'upstream_error' }, 502);
    }
    console.error('[api/mission-log/generate] Unexpected upstream error', err);
    return jsonResponse({ error: 'upstream_error' }, 502);
  }

  try {
    const result = await recordGeneration(
      {
        userId: auth.user.userId,
        lessonId,
        badgeId: lesson.badgeId,
        badgeImageUrl: upstream.imageUrl,
      },
      supabaseEnv,
    );
    return jsonResponse({
      badgeImageUrl: upstream.imageUrl,
      count: result.count,
      remaining: MAX_GENERATIONS_PER_LESSON - result.count,
    });
  } catch (err) {
    if (err instanceof QuotaExhaustedError) {
      return jsonResponse({ error: 'quota_exhausted' }, 429);
    }
    throw err;
  }
}

export const POST: APIRoute = withApiErrorReporting(handler, {
  route: 'mission-log.generate',
});
