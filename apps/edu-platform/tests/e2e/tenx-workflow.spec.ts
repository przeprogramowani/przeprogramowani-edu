import { expect } from '@playwright/test';
import { test } from './fixtures/test';

/**
 * Smoke stron 10x Workflow (10xdevs-3 internal + 10xdevs-4 public).
 * Bez logowania: sprawdzamy gating (redirect na login z returnUrl),
 * 404 dla stron nieotwartych publicznie i dostepnosc fontow.
 */

const WORKFLOW_SLUGS = [
  'fundament',
  'csc',
  'skalowanie',
  'jakosc',
  'legacy',
  'teamwork',
  'kanon',
  'top5',
  'docs',
  'log',
];

test.describe('10x Workflow pages', () => {
  for (const slug of WORKFLOW_SLUGS) {
    test(`gated /10xdevs-3/workflow/${slug} redirects anonymous to external login`, async ({
      page,
    }) => {
      const response = await page.goto(`/10xdevs-3/workflow/${slug}`);
      expect(response).not.toBeNull();
      await expect(page).toHaveURL(
        new RegExp(
          `/external/10xdevs-3/login\\?returnUrl=.*${encodeURIComponent(
            `/10xdevs-3/workflow/${slug}`
          ).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
        )
      );
    });
  }

  test('gated workflow index (docs) redirects anonymous to external login', async ({
    page,
  }) => {
    await page.goto('/10xdevs-3/workflow');
    await expect(page).toHaveURL(/\/external\/10xdevs-3\/login\?returnUrl=/);
  });

  test('gated skill page redirects anonymous to external login', async ({
    page,
  }) => {
    await page.goto('/10xdevs-3/workflow/skill/10x-new');
    await expect(page).toHaveURL(/\/external\/10xdevs-3\/login\?returnUrl=/);
  });

  test('unknown skill slug returns 404', async ({ page }) => {
    const response = await page.goto('/10xdevs-3/workflow/skill/bogus');
    expect(response?.status()).toBe(404);
  });

  test('login redirect preserves mode query params in returnUrl', async ({
    page,
  }) => {
    await page.goto('/10xdevs-3/workflow/csc?tryb=neutral&dd=0');
    await expect(page).toHaveURL(
      new RegExp(
        `returnUrl=${encodeURIComponent(
          '/10xdevs-3/workflow/csc?tryb=neutral&dd=0'
        ).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`
      )
    );
  });

  test('opened public /10xdevs-4 pages render without auth', async ({
    page,
  }) => {
    for (const path of [
      '/10xdevs-4',
      '/10xdevs-4/kurs',
      '/10xdevs-4/moduly',
      '/10xdevs-4/skille',
      '/10xdevs-4/ekosystem',
      '/10xdevs-4/csc',
      '/10xdevs-4/kanon',
      '/10xdevs-4/top5',
      '/10xdevs-4/docs',
      '/10xdevs-4/log',
      '/10xdevs-4/jak-dziala-kurs',
      '/10xdevs-4/certyfikacja',
      '/10xdevs-4/10x-cli',
      '/10xdevs-4/faq',
      '/10xdevs-4/skill/10x-new',
    ]) {
      const response = await page.goto(path);
      expect(response?.status(), `expected 200 for ${path}`).toBe(200);
    }
  });

  test('mostek shows category tiles and category pages index their subpages', async ({ page }) => {
    // Mostek: kafle prowadza do przegladow kategorii (nie do pojedynczych stron).
    await page.goto('/10xdevs-4');
    for (const slug of ['kurs', 'moduly', 'skille', 'ekosystem']) {
      await expect(
        page.locator(`#skrot .sum-card[href$="/10xdevs-4/${slug}"]`)
      ).toBeVisible();
    }
    // FAQ jest jednostronicowa - jej kafel linkuje wprost do strony faq.
    await expect(page.locator('#skrot .sum-card[href$="/10xdevs-4/faq"]')).toBeVisible();

    // Strona kategorii Moduly: indeks kart podstron (fundament..skalowanie).
    await page.goto('/10xdevs-4/moduly');
    await expect(
      page.locator('#index .sum-card[href$="/10xdevs-4/fundament"]')
    ).toBeVisible();
    await expect(
      page.locator('#index .sum-card[href$="/10xdevs-4/skalowanie"]')
    ).toBeVisible();

    // Strona kategorii Skille: karty prowadza na strony pojedynczych skilli.
    await page.goto('/10xdevs-4/skille');
    await expect(
      page.locator('#index .sum-card[href$="/10xdevs-4/skill/10x-plan"]')
    ).toBeVisible();

    // Kategoria w pasku ma laczke Przeglad na gorze rozwijanego menu.
    await page.goto('/10xdevs-4/moduly');
    const modCat = page.locator('nav.xnav .xcat', { hasText: 'Moduły' });
    await expect(
      modCat.locator('.xmenu a[href$="/10xdevs-4/moduly"]')
    ).toHaveText('Przegląd');
  });

  test('public course-flow and FAQ pages render their sections', async ({ page }) => {
    // "Jak dziala kurs": prework + 5 tygodni + certyfikacja (tresc z Circle
    // lub fallback - sekcja i tak istnieje).
    await page.goto('/10xdevs-4/jak-dziala-kurs');
    await expect(page.locator('#prework')).toBeVisible();
    await expect(page.locator('#tydzien')).toBeVisible();
    await expect(page.locator('#certyfikacja')).toBeVisible();
    // module cards link out to module pages
    await expect(
      page.locator('.sum-card[href$="/10xdevs-4/fundament"]')
    ).toBeVisible();

    // Dedykowana strona certyfikacji: terminy + bloki + osadzone zasady.
    await page.goto('/10xdevs-4/certyfikacja');
    await expect(page.locator('.cert-term').first()).toBeVisible();
    await expect(page.locator('.cert-block')).toHaveCount(3);
    await expect(page.locator('.cert-panel')).toBeAttached();

    // Strona narzedzia 10x-cli: komendy.
    await page.goto('/10xdevs-4/10x-cli');
    await expect(page.locator('.cli-cmd').first()).toContainText('10x auth');

    // FAQ: akordeon pytan rozwija odpowiedz.
    await page.goto('/10xdevs-4/faq');
    const firstItem = page.locator('.faq-item').first();
    await expect(firstItem).toBeAttached();
    await firstItem.locator('summary').click();
    await expect(firstItem).toHaveJSProperty('open', true);
  });

  test('FAQ search and category filter narrow the question list', async ({ page }) => {
    await page.goto('/10xdevs-4/faq');
    const items = page.locator('.faq-item');
    const countVisible = () =>
      items.evaluateAll((els) => els.filter((e) => !(e as HTMLElement).hidden).length);
    const totalVisible = await countVisible();
    expect(totalVisible).toBeGreaterThan(10);

    // Fraza zawezajaca liste do pojedynczych trafien.
    await page.locator('#faq-q').fill('raty');
    await expect.poll(countVisible).toBeLessThan(totalVisible);

    // Filtr kategorii (chip) pokazuje tylko jedna grupe.
    await page.locator('#faq-q').fill('');
    await page.locator('.faq-chip[data-cat="platnosci"]').click();
    await expect(page.locator('.faq-group#platnosci')).toBeVisible();
    await expect(page.locator('.faq-group#program')).toBeHidden();
  });

  test('unknown public routes return 404', async ({ page }) => {
    for (const path of ['/10xdevs-4/bogus', '/10xdevs-4/skill/bogus']) {
      const response = await page.goto(path);
      expect(response?.status(), `expected 404 for ${path}`).toBe(404);
    }
  });

  test('english pages render under /en/ across the portal', async ({ page }) => {
    // hub + modul + skill: kazda przetlumaczona strona ma wersje /en/
    for (const [path, needle] of [
      ['/10xdevs-4/en', 'Rocinante'],
      ['/10xdevs-4/en/log', 'this portal'],
      ['/10xdevs-4/en/csc', 'unit of work'],
      ['/10xdevs-4/en/skill/10x-new', '/10x-new'],
    ] as const) {
      const r = await page.goto(path);
      expect(r?.status(), `expected 200 for ${path}`).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('h1')).toContainText(needle);
      await expect(page.locator('nav.xnav [data-setlang="pl"]')).toBeVisible();
    }
    // docs jeszcze nie przetlumaczone (faza 3) - wersja EN nie istnieje
    const r404 = await page.goto('/10xdevs-4/en/docs');
    expect(r404?.status()).toBe(404);
  });

  test('polish pages keep polish content and expose hreflang alternates', async ({
    page,
  }) => {
    const response = await page.goto('/10xdevs-4/log');
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl');
    await expect(page.locator('h1')).toContainText('Jak powstał');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      /\/10xdevs-4\/en\/log$/
    );
    // strona bez wersji EN (docs, faza 3) nie pokazuje switchera jezyka
    await page.goto('/10xdevs-4/docs');
    await expect(page.locator('nav.xnav [data-setlang="en"]')).toHaveCount(0);
  });

  test('command palette opens, searches and lists results', async ({
    page,
  }) => {
    await page.goto('/10xdevs-4/csc');
    await page.locator('#cmdk-btn').click();
    await expect(page.locator('#cmdk')).toBeVisible();
    // Skrypt palety moze dopinac listenery po otwarciu (zimny start w CI) -
    // ponawiamy wpisywanie, az pojawia sie lista wynikow.
    await expect(async () => {
      await page.locator('#cmdk-q').fill('');
      await page.locator('#cmdk-q').pressSequentially('motyw');
      await expect(page.locator('#cmdk-list li').first()).toBeVisible({
        timeout: 1000,
      });
    }).toPass({ timeout: 15000 });
    await page.keyboard.press('Escape');
    await expect(page.locator('#cmdk')).toBeHidden();
  });

  test('promo banners render only on public pages', async ({ page }) => {
    await page.goto('/10xdevs-4/csc');
    await expect(page.locator('#promo-src')).toBeVisible();
    await expect(page.locator('.promo-nl').first()).toBeAttached();
  });

  test('public pages default to deep dive off, internal marketing params respected', async ({
    page,
  }) => {
    await page.goto('/10xdevs-4/csc');
    await expect(page.locator('html')).toHaveAttribute('data-dd', '0');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'sf');
    await page.goto('/10xdevs-4/csc?tryb=neutral&dd=1');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'neutral');
    await expect(page.locator('html')).toHaveAttribute('data-dd', '1');
  });

  test('chakra petch font files are served', async ({ request }) => {
    const response = await request.get(
      '/fonts/chakra-petch/chakra-petch.css'
    );
    expect(response.status()).toBe(200);
    const css = await response.text();
    expect(css).toContain("font-family: 'Chakra Petch'");
  });
});
