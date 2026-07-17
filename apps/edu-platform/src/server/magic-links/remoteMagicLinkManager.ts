import { DEFAULT_MAGIC_LINK_TTL_MINUTES } from './constants';

interface MagicLink {
  email: string;
  expiresAt: number;
  newsletterOptIn?: boolean;
}

export interface MagicLinkResult {
  email: string;
  newsletterOptIn?: boolean;
}

interface Env {
  MAGIC_LINKS: KVNamespace;
}

function getMagicLinksKV(env?: Env): KVNamespace {
  if (env?.MAGIC_LINKS) {
    return env.MAGIC_LINKS;
  }

  // @ts-expect-error MAGIC_LINKS is not defined in the global scope
  if (globalThis.MAGIC_LINKS) {
    // @ts-expect-error MAGIC_LINKS is not defined in the global scope
    return globalThis.MAGIC_LINKS;
  }
  throw new Error('MAGIC_LINKS KV namespace is not available');
}

export async function storeMagicLink(
  token: string,
  email: string,
  env?: Env,
  ttlMinutes: number = DEFAULT_MAGIC_LINK_TTL_MINUTES,
  newsletterOptIn?: boolean,
): Promise<void> {
  console.log('Storing magic link using remote KV database');
  const MAGIC_LINKS = getMagicLinksKV(env);
  const ttlSeconds = ttlMinutes * 60;
  const expiresAt = Date.now() + ttlSeconds * 1000;
  await MAGIC_LINKS.put(token, JSON.stringify({ email, expiresAt, newsletterOptIn }), { expirationTtl: ttlSeconds });
}

export async function verifyMagicLink(token: string, env?: Env): Promise<MagicLinkResult | null> {
  console.log('Verifying magic link using remote KV database');
  const MAGIC_LINKS = getMagicLinksKV(env);
  const data = await MAGIC_LINKS.get(token);
  if (!data) return null;

  const { email, expiresAt, newsletterOptIn } = JSON.parse(data) as MagicLink;

  if (Date.now() > expiresAt) {
    await MAGIC_LINKS.delete(token);
    return null;
  }

  await MAGIC_LINKS.delete(token);
  return { email, newsletterOptIn };
}
