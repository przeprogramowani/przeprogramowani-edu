import { getEnabledSystemFlags } from '@/server/supabase/systemFlagsService';

const CACHE_KEY = 'v1-system-flags';
const CACHE_TTL_SECONDS = 300; // 5 minutes

type SystemFlagsCacheEnv = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  GAME_STATE?: KVNamespace;
  ENV: string;
};

export async function getCachedSystemFlags(env: SystemFlagsCacheEnv): Promise<string[]> {
  // In dev mode, always query Supabase directly
  if (env.ENV !== 'PROD' || !env.GAME_STATE) {
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return [];
    return getEnabledSystemFlags(env);
  }

  // Try KV cache first
  const cached = await env.GAME_STATE.get(CACHE_KEY);
  if (cached) return JSON.parse(cached) as string[];

  // Cache miss — query Supabase and cache result
  const flags = await getEnabledSystemFlags(env);
  await env.GAME_STATE.put(CACHE_KEY, JSON.stringify(flags), {
    expirationTtl: CACHE_TTL_SECONDS,
  });
  return flags;
}
