/**
 * URL validation utilities to prevent open redirect attacks
 */

const PREWORK_COURSE_ID = '10xdevs-3-prework';
const MAIN_COURSE_ID = '10xdevs-3';
const SUPPORTED_LANGUAGES = new Set(['pl', 'en']);

export type ExternalAuthLanguage = 'pl' | 'en';

function decodeSafely(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function hasUnsafeRedirectPattern(value: string): boolean {
  const decoded = decodeSafely(value);
  return (
    value.includes('\\') ||
    decoded === null ||
    decoded.includes('\\')
  );
}

const LANGUAGE_AWARE_COURSES = new Set([PREWORK_COURSE_ID, MAIN_COURSE_ID]);

function isSafeLanguageAwareCoursePath(pathname: string, search: string, targetCourseId: string): boolean {
  if (search) {
    return false;
  }

  if (pathname === `/external/${targetCourseId}` || pathname === `/external/${targetCourseId}/`) {
    return true;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 3) {
    const [externalSegment, courseId, language] = segments;

    return (
      externalSegment === 'external' &&
      courseId === targetCourseId &&
      SUPPORTED_LANGUAGES.has(language)
    );
  }

  if (segments.length !== 4) {
    return false;
  }

  const [externalSegment, courseId, language, lessonId] = segments;

  return (
    externalSegment === 'external' &&
    courseId === targetCourseId &&
    SUPPORTED_LANGUAGES.has(language) &&
    /^[A-Za-z0-9_-]+$/.test(lessonId)
  );
}

function isSafeExternalCoursePath(pathname: string, search: string, courseId: string): boolean {
  if (!pathname.startsWith(`/external/${courseId}`)) {
    return false;
  }

  if (LANGUAGE_AWARE_COURSES.has(courseId)) {
    return isSafeLanguageAwareCoursePath(pathname, search, courseId);
  }

  if (pathname === `/external/${courseId}` || pathname === `/external/${courseId}/`) {
    return true;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'external' || segments[1] !== courseId) {
    return false;
  }

  return segments.length >= 3;
}

/**
 * Validates that returnUrl is a safe same-origin URL for external auth pages.
 * Prevents open redirect attacks by ensuring the URL:
 * 1. Stays on the same origin
 * 2. Points to an allowed external path for the requested course
 *
 * @param returnUrl - The URL to validate
 * @param courseId - The course ID for default fallback
 * @param siteUrl - The site's base URL for origin validation
 * @returns A safe URL to redirect to
 */
export function validateReturnUrl(returnUrl: string | null | undefined, courseId: string, siteUrl: string): string {
  const defaultUrl = `/external/${courseId}`;

  if (!returnUrl) {
    return defaultUrl;
  }

  const trimmedUrl = returnUrl.trim();

  if (hasUnsafeRedirectPattern(trimmedUrl)) {
    return defaultUrl;
  }

  try {
    const parsedReturn = new URL(trimmedUrl, siteUrl);
    const parsedSite = new URL(siteUrl);

    if (parsedReturn.origin !== parsedSite.origin) {
      return defaultUrl;
    }

    const decodedPathname = decodeSafely(parsedReturn.pathname);
    if (!decodedPathname || parsedReturn.pathname.includes('//') || decodedPathname.includes('//')) {
      return defaultUrl;
    }

    if (!isSafeExternalCoursePath(parsedReturn.pathname, parsedReturn.search, courseId)) {
      return defaultUrl;
    }

    return parsedReturn.pathname + parsedReturn.search + parsedReturn.hash;
  } catch {
    return defaultUrl;
  }
}

export function buildExternalCourseLoginUrl(courseId: string, returnPath: string): string {
  return `/external/${courseId}/login?returnUrl=${encodeURIComponent(returnPath)}`;
}

function isExternalAuthLanguage(value: string | null | undefined): value is ExternalAuthLanguage {
  return value === 'pl' || value === 'en';
}

function resolveLanguageFromExternalPath(returnUrl: string | null | undefined): ExternalAuthLanguage | null {
  if (!returnUrl) {
    return null;
  }

  try {
    const parsedReturn = new URL(returnUrl, 'https://local.przeprogramowani');
    const segments = parsedReturn.pathname.split('/').filter(Boolean);

    if (
      segments[0] === 'external' &&
      LANGUAGE_AWARE_COURSES.has(segments[1]) &&
      isExternalAuthLanguage(segments[2])
    ) {
      return segments[2];
    }
  } catch {
    return null;
  }

  return null;
}

export function resolveExternalAuthLanguage(
  safeReturnUrl: string | null | undefined,
  langHint?: string | null
): ExternalAuthLanguage {
  return resolveLanguageFromExternalPath(safeReturnUrl) ?? (isExternalAuthLanguage(langHint) ? langHint : 'pl');
}

export function localizeExternalAuthReturnUrl(
  safeReturnUrl: string,
  lang: ExternalAuthLanguage
): string {
  for (const courseId of LANGUAGE_AWARE_COURSES) {
    const basePath = `/external/${courseId}`;
    if (safeReturnUrl === basePath || safeReturnUrl === `${basePath}/`) {
      return `${basePath}/${lang}`;
    }
  }

  return safeReturnUrl;
}

export function resolveExternalAuthReturnUrl(
  returnUrl: string | null | undefined,
  courseId: string,
  siteUrl: string,
  langHint?: string | null
): string {
  const safeReturnUrl = validateReturnUrl(returnUrl, courseId, siteUrl);
  const lang = resolveExternalAuthLanguage(safeReturnUrl, langHint);

  return localizeExternalAuthReturnUrl(safeReturnUrl, lang);
}
