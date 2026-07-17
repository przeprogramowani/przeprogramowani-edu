import { DEFAULT_MAGIC_LINK_TTL_MINUTES } from './constants';

interface MagicLink {
  token: string;
  email: string;
  expiresAt: number;
  newsletterOptIn?: boolean;
}

export interface MagicLinkResult {
  email: string;
  newsletterOptIn?: boolean;
}

const magicLinks: MagicLink[] = [];

export async function storeMagicLink(
  token: string,
  email: string,
  ttlMinutes: number = DEFAULT_MAGIC_LINK_TTL_MINUTES,
  newsletterOptIn?: boolean,
): Promise<void> {
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  magicLinks.push({ token, email, expiresAt, newsletterOptIn });
  console.log(`Magic link stored for email: ${email}`);
}

export async function verifyMagicLink(token: string): Promise<MagicLinkResult | null> {
  console.log(`Verifying magic link with token: ${token}`);
  const linkIndex = magicLinks.findIndex((l) => l.token === token);

  if (linkIndex === -1) {
    console.log('Magic link not found');
    return null;
  }

  const { email, expiresAt, newsletterOptIn } = magicLinks[linkIndex];

  if (Date.now() > expiresAt) {
    console.log('Magic link expired');
    magicLinks.splice(linkIndex, 1);
    return null;
  }

  console.log(`Magic link verified for email: ${email}`);
  magicLinks.splice(linkIndex, 1);
  return { email, newsletterOptIn };
}
