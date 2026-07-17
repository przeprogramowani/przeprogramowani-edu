import { getSupabaseAdmin } from './client';
import type { GameState } from '@/explorers/state/types';

type SupabaseEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_KEY: string };

export async function saveGameState(
  userId: string,
  state: GameState,
  env: SupabaseEnv
): Promise<void> {
  const supabase = getSupabaseAdmin(env);
  await supabase.from('game_state').upsert(
    {
      user_id: userId,
      state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
}

export async function deleteGameState(userId: string, env: SupabaseEnv): Promise<void> {
  const supabase = getSupabaseAdmin(env);
  await supabase.from('game_state').delete().eq('user_id', userId);
}

export async function loadGameState(
  userId: string,
  env: SupabaseEnv
): Promise<GameState | null> {
  const supabase = getSupabaseAdmin(env);
  const { data } = await supabase
    .from('game_state')
    .select('state')
    .eq('user_id', userId)
    .single();
  return (data?.state as GameState) ?? null;
}
