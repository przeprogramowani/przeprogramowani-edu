import type { APIContext, APIRoute } from 'astro';
import { resolveTokenToEmail } from '@/server/game/apiTokenManager';
import { loadGameState } from '@/server/game/serverGameStateManager';

const QUEST_ID = 'q-m1-echotrace';

const READINGS = {
  'ECH-A17': {
    scan_id: 'ECH-A17',
    waveform: [4, 9, 15, 9, 4, 2, 1],
    echo_delay_ms: 184,
    decay_ratio: 0.81,
    harmonics_khz: [12.4, 24.8],
    material_response: { synaptit: 0.031 },
    structural_markers: ['irregular-boundary', 'progressive-collapse'],
  },
  'ECH-B04': {
    scan_id: 'ECH-B04',
    waveform: [3, 18, 44, 18, 3, 18, 44, 18, 3],
    echo_delay_ms: 96,
    decay_ratio: 0.22,
    harmonics_khz: [18.6, 37.2, 55.8],
    material_response: { synaptit: 0.964 },
    structural_markers: ['crystalline-resonance', 'dense-formation'],
  },
  'ECH-G22': {
    scan_id: 'ECH-G22',
    waveform: [8, 8, 2, 8, 8, 2, 8, 8],
    echo_delay_ms: 132,
    decay_ratio: 0.47,
    harmonics_khz: [9.1, 18.2],
    material_response: { synaptit: 0.118 },
    structural_markers: ['regular-support-spacing', 'machined-shaft-wall'],
  },
} as const;

type ScanId = keyof typeof READINGS;

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'private, no-store',
    },
  });
}

export const GET: APIRoute = async (context: APIContext) => {
  const env = context.locals.runtime.env;
  const authHeader = context.request.headers.get('Authorization');
  const rawToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!rawToken) return json({ error: 'Missing Authorization header' }, 401);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const email = await resolveTokenToEmail(rawToken, env as any);
  if (!email) return json({ error: 'Invalid or expired token' }, 401);

  const state = await loadGameState(email, env);
  const canScan =
    state?.quests.active === QUEST_ID || state?.quests.completed.includes(QUEST_ID);
  if (!canScan) return json({ error: 'EchoTrace mission is not available' }, 403);

  const scanId = String(context.params.scanId ?? '').toUpperCase() as ScanId;
  const reading = READINGS[scanId];
  if (!reading) return json({ error: 'Unknown echo scan' }, 404);

  return json({ reading }, 200);
};
