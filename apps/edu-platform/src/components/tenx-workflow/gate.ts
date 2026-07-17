/**
 * Wspolna bramka auth stron gated 10x Workflow (wrappery w
 * src/pages/10xdevs-3/workflow). Weryfikuje token platformy i czlonkostwo
 * w kursie; brak auth = redirect (302) na login z powrotem na biezacy adres.
 *
 * Uzycie we wrapperze:
 *   const access = await tenxWorkflowAccess(Astro);
 *   if (access.redirect) return access.redirect;
 *   // 404 gdy strona poza access.groups; nawigacja: pagesForGroups(access.groups)
 */

import type { AstroGlobal } from 'astro';
import { ADMIN_EMAILS } from '@/server/admins';
import { verifyExternalAuth } from '@/server/externalAuth';
import { COURSE_ID, loginRedirectUrl } from './config';
import type { AccessGroup } from './pages';

/**
 * Wynik bramki z grupami dostepu widza (access groups, 2026-07-10):
 * kazdy zalogowany uczestnik = students-10xdevs-3; adres z ADMIN_EMAILS
 * (src/server/admins.ts) dostaje dodatkowo internal i widzi strony
 * w przygotowaniu. Kontekst publiczny /10xdevs-4 nie przechodzi przez
 * te bramke - jego grupa to zawsze leads-10xdevs-4 (bez logowania).
 */
export interface TenxWorkflowAccess {
  /** Redirect na login do zwrocenia z wrappera albo null, gdy user jest zalogowany. */
  redirect: Response | null;
  groups: AccessGroup[];
  email?: string;
}

/** Bramka gated z grupami dostepu - wrappery filtruja nawigacje przez pagesForGroups(groups). */
export async function tenxWorkflowAccess(Astro: AstroGlobal): Promise<TenxWorkflowAccess> {
  const env = Astro.locals.runtime.env;

  const authResult = await verifyExternalAuth(Astro.cookies, COURSE_ID, env);
  if (!authResult.isAuthenticated) {
    return {
      redirect: Astro.redirect(loginRedirectUrl(COURSE_ID, Astro.url.pathname + Astro.url.search)),
      groups: [],
    };
  }
  const groups: AccessGroup[] = ['students-10xdevs-3'];
  if (authResult.email && ADMIN_EMAILS.includes(authResult.email)) groups.push('internal');
  return { redirect: null, groups, email: authResult.email };
}

