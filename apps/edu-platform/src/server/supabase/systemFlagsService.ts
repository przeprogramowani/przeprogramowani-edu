import { getSupabaseAdmin } from './client';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export async function getEnabledSystemFlags(env: SupabaseEnv): Promise<string[]> {
  const supabase = getSupabaseAdmin(env);
  const { data } = await supabase
    .from('system_flags')
    .select('flag')
    .eq('enabled', true);
  return (data ?? []).map((row) => row.flag);
}
