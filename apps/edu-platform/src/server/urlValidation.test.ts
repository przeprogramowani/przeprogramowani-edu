import { describe, expect, it } from 'vitest';
import {
  buildExternalCourseLoginUrl,
  localizeExternalAuthReturnUrl,
  resolveExternalAuthLanguage,
  resolveExternalAuthReturnUrl,
  validateReturnUrl,
} from './urlValidation';

const SITE_URL = 'https://przeprogramowani-edu.pages.dev';

describe('validateReturnUrl', () => {
  it('accepts safe localized 10xDevs 3 prework lesson paths', () => {
    expect(
      validateReturnUrl('/external/10xdevs-3-prework/pl/02', '10xdevs-3-prework', SITE_URL)
    ).toBe('/external/10xdevs-3-prework/pl/02');
    expect(
      validateReturnUrl('/external/10xdevs-3-prework/en/02', '10xdevs-3-prework', SITE_URL)
    ).toBe('/external/10xdevs-3-prework/en/02');
  });

  it('accepts safe localized 10xDevs 3 prework index paths', () => {
    expect(
      validateReturnUrl('/external/10xdevs-3-prework/pl', '10xdevs-3-prework', SITE_URL)
    ).toBe('/external/10xdevs-3-prework/pl');
    expect(
      validateReturnUrl('/external/10xdevs-3-prework/en', '10xdevs-3-prework', SITE_URL)
    ).toBe('/external/10xdevs-3-prework/en');
  });

  it('accepts safe localized 10xDevs 3 main course lesson paths', () => {
    expect(
      validateReturnUrl('/external/10xdevs-3/pl/01-m1l1-od-pomyslu-do-prd', '10xdevs-3', SITE_URL)
    ).toBe('/external/10xdevs-3/pl/01-m1l1-od-pomyslu-do-prd');
    expect(
      validateReturnUrl('/external/10xdevs-3/en/01-m1l1-od-pomyslu-do-prd', '10xdevs-3', SITE_URL)
    ).toBe('/external/10xdevs-3/en/01-m1l1-od-pomyslu-do-prd');
  });

  it('accepts safe localized 10xDevs 3 main course language index paths', () => {
    expect(
      validateReturnUrl('/external/10xdevs-3/pl', '10xdevs-3', SITE_URL)
    ).toBe('/external/10xdevs-3/pl');
    expect(
      validateReturnUrl('/external/10xdevs-3/en', '10xdevs-3', SITE_URL)
    ).toBe('/external/10xdevs-3/en');
  });

  it('rejects 10xDevs 3 main course paths with unsupported languages', () => {
    expect(
      validateReturnUrl('/external/10xdevs-3/de/01', '10xdevs-3', SITE_URL)
    ).toBe('/external/10xdevs-3');
  });

  it('accepts same-origin absolute localized prework URLs and strips the origin', () => {
    expect(
      validateReturnUrl(
        'https://przeprogramowani-edu.pages.dev/external/10xdevs-3-prework/en/02',
        '10xdevs-3-prework',
        SITE_URL
      )
    ).toBe('/external/10xdevs-3-prework/en/02');
  });

  it('keeps existing non-prework external lesson and checklist return paths valid', () => {
    expect(validateReturnUrl('/external/10xdevs-2/123', '10xdevs-2', SITE_URL)).toBe(
      '/external/10xdevs-2/123'
    );
    expect(
      validateReturnUrl('/external/10xdevs-2/checklists/setup', '10xdevs-2', SITE_URL)
    ).toBe('/external/10xdevs-2/checklists/setup');
  });

  it('rejects external and protocol-relative open redirects', () => {
    expect(validateReturnUrl('https://example.com/external/10xdevs-3-prework/pl/02', '10xdevs-3-prework', SITE_URL)).toBe(
      '/external/10xdevs-3-prework'
    );
    expect(validateReturnUrl('//example.com/external/10xdevs-3-prework/pl/02', '10xdevs-3-prework', SITE_URL)).toBe(
      '/external/10xdevs-3-prework'
    );
  });

  it('rejects encoded external URLs, backslashes, and unsupported internal paths', () => {
    expect(validateReturnUrl('https%3A%2F%2Fexample.com', '10xdevs-3-prework', SITE_URL)).toBe(
      '/external/10xdevs-3-prework'
    );
    expect(validateReturnUrl('/external/10xdevs-3-prework\\pl\\02', '10xdevs-3-prework', SITE_URL)).toBe(
      '/external/10xdevs-3-prework'
    );
    expect(validateReturnUrl('/api/logout', '10xdevs-3-prework', SITE_URL)).toBe(
      '/external/10xdevs-3-prework'
    );
  });

  it('rejects prework paths with unsupported languages, query strings, or course IDs', () => {
    expect(validateReturnUrl('/external/10xdevs-3-prework/de/02', '10xdevs-3-prework', SITE_URL)).toBe(
      '/external/10xdevs-3-prework'
    );
    expect(validateReturnUrl('/external/10xdevs-3-prework/pl/02?next=/api/logout', '10xdevs-3-prework', SITE_URL)).toBe(
      '/external/10xdevs-3-prework'
    );
    expect(validateReturnUrl('/external/10xdevs-2/123', '10xdevs-3-prework', SITE_URL)).toBe(
      '/external/10xdevs-3-prework'
    );
  });
});

describe('buildExternalCourseLoginUrl', () => {
  it('builds the unauthenticated prework login redirect with an encoded return URL', () => {
    expect(
      buildExternalCourseLoginUrl('10xdevs-3-prework', '/external/10xdevs-3-prework/en/02')
    ).toBe('/external/10xdevs-3-prework/login?returnUrl=%2Fexternal%2F10xdevs-3-prework%2Fen%2F02');
  });

  it('builds the unauthenticated prework language index redirect with an encoded return URL', () => {
    expect(
      buildExternalCourseLoginUrl('10xdevs-3-prework', '/external/10xdevs-3-prework/en')
    ).toBe('/external/10xdevs-3-prework/login?returnUrl=%2Fexternal%2F10xdevs-3-prework%2Fen');
  });
});

describe('resolveExternalAuthLanguage', () => {
  it('resolves Polish and English from safe localized prework return URLs', () => {
    expect(resolveExternalAuthLanguage('/external/10xdevs-3-prework/pl')).toBe('pl');
    expect(resolveExternalAuthLanguage('/external/10xdevs-3-prework/en')).toBe('en');
    expect(resolveExternalAuthLanguage('/external/10xdevs-3-prework/pl/02')).toBe('pl');
    expect(resolveExternalAuthLanguage('/external/10xdevs-3-prework/en/02')).toBe('en');
  });

  it('resolves Polish and English from safe localized main course return URLs', () => {
    expect(resolveExternalAuthLanguage('/external/10xdevs-3/pl')).toBe('pl');
    expect(resolveExternalAuthLanguage('/external/10xdevs-3/en')).toBe('en');
    expect(resolveExternalAuthLanguage('/external/10xdevs-3/pl/01')).toBe('pl');
    expect(resolveExternalAuthLanguage('/external/10xdevs-3/en/01')).toBe('en');
  });

  it('uses a safe direct-login language hint when no localized return URL is available', () => {
    expect(resolveExternalAuthLanguage('/external/10xdevs-3-prework', 'en')).toBe('en');
  });

  it('prefers the localized return URL over the hint', () => {
    expect(resolveExternalAuthLanguage('/external/10xdevs-3-prework/pl/02', 'en')).toBe('pl');
  });

  it('falls back to Polish for missing or invalid inputs', () => {
    expect(resolveExternalAuthLanguage('/external/10xdevs-3-prework', 'de')).toBe('pl');
    expect(resolveExternalAuthLanguage(null, null)).toBe('pl');
  });
});

describe('localizeExternalAuthReturnUrl', () => {
  it('localizes the safe prework course fallback to the resolved language index', () => {
    expect(localizeExternalAuthReturnUrl('/external/10xdevs-3-prework', 'en')).toBe(
      '/external/10xdevs-3-prework/en'
    );
    expect(localizeExternalAuthReturnUrl('/external/10xdevs-3-prework/', 'pl')).toBe(
      '/external/10xdevs-3-prework/pl'
    );
  });

  it('localizes the safe main course fallback to the resolved language index', () => {
    expect(localizeExternalAuthReturnUrl('/external/10xdevs-3', 'en')).toBe(
      '/external/10xdevs-3/en'
    );
    expect(localizeExternalAuthReturnUrl('/external/10xdevs-3/', 'pl')).toBe(
      '/external/10xdevs-3/pl'
    );
  });

  it('keeps already localized prework paths unchanged', () => {
    expect(localizeExternalAuthReturnUrl('/external/10xdevs-3-prework/en', 'pl')).toBe(
      '/external/10xdevs-3-prework/en'
    );
    expect(localizeExternalAuthReturnUrl('/external/10xdevs-3-prework/en/02', 'pl')).toBe(
      '/external/10xdevs-3-prework/en/02'
    );
  });

  it('keeps already localized main course paths unchanged', () => {
    expect(localizeExternalAuthReturnUrl('/external/10xdevs-3/en', 'pl')).toBe(
      '/external/10xdevs-3/en'
    );
    expect(localizeExternalAuthReturnUrl('/external/10xdevs-3/en/01', 'pl')).toBe(
      '/external/10xdevs-3/en/01'
    );
  });
});

describe('resolveExternalAuthReturnUrl', () => {
  it('uses the language hint to localize direct prework login redirects', () => {
    expect(resolveExternalAuthReturnUrl(null, '10xdevs-3-prework', SITE_URL, 'en')).toBe(
      '/external/10xdevs-3-prework/en'
    );
  });

  it('uses the language hint to localize direct main course login redirects', () => {
    expect(resolveExternalAuthReturnUrl(null, '10xdevs-3', SITE_URL, 'en')).toBe(
      '/external/10xdevs-3/en'
    );
  });

  it('preserves explicit localized prework return URLs over a conflicting hint', () => {
    expect(
      resolveExternalAuthReturnUrl(
        '/external/10xdevs-3-prework/pl/02',
        '10xdevs-3-prework',
        SITE_URL,
        'en'
      )
    ).toBe('/external/10xdevs-3-prework/pl/02');
  });

  it('preserves explicit localized main course return URLs over a conflicting hint', () => {
    expect(
      resolveExternalAuthReturnUrl(
        '/external/10xdevs-3/pl/01',
        '10xdevs-3',
        SITE_URL,
        'en'
      )
    ).toBe('/external/10xdevs-3/pl/01');
  });
});
