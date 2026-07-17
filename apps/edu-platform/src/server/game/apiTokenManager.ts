import { getUserIdByEmail } from '@/server/supabase/userService';
import { getSupabaseAdmin } from '@/server/supabase/client';

interface TokenEnv {
  GAME_API_TOKENS: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  ENV: string;
}

const TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

async function sha256hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateRawToken(): string {
  // Format: 10X-XXXX-XXXX-XXXX (3 groups of 4 uppercase hex chars from UUID)
  const segments = crypto.randomUUID().split('-'); // [8, 4, 4, 4, 12]
  return `10X-${segments[1].toUpperCase()}-${segments[2].toUpperCase()}-${segments[3].toUpperCase()}`;
}

function maskToken(rawToken: string): string {
  const parts = rawToken.split('-');
  return `10X-****-****-${parts[3]}`; // keep last segment for identification
}

export async function getOrCreateToken(
  email: string,
  env: TokenEnv
): Promise<{ token: string; generated: boolean }> {
  const userId = await getUserIdByEmail(email, env);
  if (!userId) throw new Error(`[apiTokenManager] User not found: ${email}`);

  const existenceKey = `api-token-exists:${userId}`;

  if (env.ENV === 'PROD') {
    const maskedExisting = await env.GAME_API_TOKENS.get(existenceKey);
    if (maskedExisting) {
      console.info('[apiTokenManager] token_retrieved', { userId: userId.slice(0, 8) });
      return { token: maskedExisting, generated: false };
    }
  }

  // Generate new token
  const rawToken = generateRawToken();
  const tokenHash = await sha256hex(rawToken);

  // Persist hash in Supabase (durable audit record)
  const supabase = getSupabaseAdmin(env);
  await supabase.from('game_api_tokens').insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString(),
  });

  if (env.ENV === 'PROD') {
    // hash → email for Bearer token lookup
    await env.GAME_API_TOKENS.put(tokenHash, email, { expirationTtl: TOKEN_TTL_SECONDS });
    // existence marker with masked token for subsequent /support calls
    await env.GAME_API_TOKENS.put(existenceKey, maskToken(rawToken), {
      expirationTtl: TOKEN_TTL_SECONDS,
    });
  }

  console.info('[apiTokenManager] token_generated', { userId: userId.slice(0, 8) });
  return { token: rawToken, generated: true };
}

export async function regenerateToken(
  email: string,
  env: TokenEnv
): Promise<{ token: string; generated: boolean }> {
  const userId = await getUserIdByEmail(email, env);
  if (!userId) throw new Error(`[apiTokenManager] User not found: ${email}`);

  const supabase = getSupabaseAdmin(env);

  // Revoke old tokens
  const { data: oldTokens } = await supabase
    .from('game_api_tokens')
    .select('token_hash')
    .eq('user_id', userId)
    .eq('revoked', false);

  if (oldTokens?.length && env.ENV === 'PROD') {
    for (const { token_hash } of oldTokens) {
      await env.GAME_API_TOKENS.delete(token_hash);
    }
  }
  if (oldTokens?.length) {
    await supabase
      .from('game_api_tokens')
      .update({ revoked: true })
      .eq('user_id', userId)
      .eq('revoked', false);
  }

  // Delete existence marker
  const existenceKey = `api-token-exists:${userId}`;
  if (env.ENV === 'PROD') {
    await env.GAME_API_TOKENS.delete(existenceKey);
  }

  // Generate new token
  const rawToken = generateRawToken();
  const tokenHash = await sha256hex(rawToken);

  await supabase.from('game_api_tokens').insert({
    user_id: userId,
    token_hash: tokenHash,
    expires_at: new Date(Date.now() + TOKEN_TTL_SECONDS * 1000).toISOString(),
  });

  if (env.ENV === 'PROD') {
    await env.GAME_API_TOKENS.put(tokenHash, email, { expirationTtl: TOKEN_TTL_SECONDS });
    await env.GAME_API_TOKENS.put(existenceKey, maskToken(rawToken), {
      expirationTtl: TOKEN_TTL_SECONDS,
    });
  }

  console.info('[apiTokenManager] token_regenerated', { userId: userId.slice(0, 8) });
  return { token: rawToken, generated: true };
}

export async function resolveTokenToEmail(
  rawToken: string,
  env: TokenEnv
): Promise<string | null> {
  // Basic format guard before hashing
  if (!/^10X-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/.test(rawToken)) return null;
  if (env.ENV !== 'PROD') return null; // KV not available locally

  const tokenHash = await sha256hex(rawToken);
  return env.GAME_API_TOKENS.get(tokenHash);
}
