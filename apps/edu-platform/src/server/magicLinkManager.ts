import * as localManager from './magic-links/localMagicLinkManager';
import * as remoteManager from './magic-links/remoteMagicLinkManager';

export { DEFAULT_MAGIC_LINK_TTL_MINUTES } from './magic-links/constants';
export type { MagicLinkResult } from './magic-links/remoteMagicLinkManager';

export async function storeMagicLink(
  token: string,
  email: string,
  env?: any,
  ttlMinutes?: number,
  newsletterOptIn?: boolean,
): Promise<void> {
  if (env.ENV === 'PROD') {
    return await remoteManager.storeMagicLink(token, email, env, ttlMinutes, newsletterOptIn);
  } else {
    return await localManager.storeMagicLink(token, email, ttlMinutes, newsletterOptIn);
  }
}

export async function verifyMagicLink(token: string, env?: any): Promise<import('./magic-links/remoteMagicLinkManager').MagicLinkResult | null> {
  if (env.ENV === 'PROD') {
    return await remoteManager.verifyMagicLink(token, env);
  } else {
    return await localManager.verifyMagicLink(token);
  }
}
