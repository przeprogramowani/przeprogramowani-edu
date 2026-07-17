# Cutover: przepięcie produkcji Cloudflare na repo przeprogramowani-edu

Stan zinwentaryzowany przez wranglera (OAuth: przeprogramowani@gmail.com,
konto `eb313d34b48a9aa3c87eb3554e33134d`), 2026-07-17. Uzupełnia `runbook.md`.

## Zasada nadrzędna

**Konfiguracja Cloudflare żyje na projektach CF, nie w repo** — KV, sekrety runtime,
domeny i bindingi NIE wymagają migracji. Repo dostarcza tylko artefakt (`wrangler
pages deploy dist`) + `wrangler.toml` z deklaracją bindingów. Przepięcie = sekrety CI
w nowym repo GitHub + przepięcie integracji Git w dwóch projektach Pages.

## 1. Projekty CF dotknięte migracją

| Projekt CF Pages | Domeny | Git provider | Deploy |
|---|---|---|---|
| `przeprogramowani-edu` | platforma.przeprogramowani.pl | **Yes → przepiąć** | wrangler z CI (branch master) |
| `10x-assistant` | przeprogramowani-sites-8bn.pages.dev | **Yes → przepiąć** | wrangler z CI |

Dodatkowo **Worker** (nie Pages): `edu-platform-membership-refresh-cron`
(cron `0 3 1 */2 *`, `apps/edu-platform/wrangler.membership-refresh.toml`) —
deployowany ręcznie: po migracji kolejne deploye robić z nowego repo:
`cd apps/edu-platform && npx wrangler deploy --config wrangler.membership-refresh.toml`.

Nietknięte przez migrację (zostają przy starym repo): opanuj-frontend,
opanuj-typescript, opanuj-ai, llm-utils i pozostałe projekty z listy Pages.

## 2. Sekrety GitHub Actions w nowym repo (do ustawienia PRZED pierwszym CI)

Wartości 1:1 ze starego repo `przeprogramowani-sites` (Settings → Secrets → Actions):

| Sekret | Workflow | Uwagi |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | ci.yml (deploy) | token musi mieć uprawnienia Pages:Edit do projektów `przeprogramowani-edu` i `10x-assistant` + Workers (membership-cron) |
| `CLOUDFLARE_ACCOUNT_ID` | ci.yml | `eb313d34b48a9aa3c87eb3554e33134d` |
| `GH_PKG_TOKEN` | ci.yml, refresh-circle-backup | prawdopodobnie zbędny po wchłonięciu common — pierwszy `npm ci` bez niego to zweryfikuje; ustawić na start, usunąć po weryfikacji |
| `E2E_RESEND_API_KEY`, `E2E_RESEND_INBOX_EMAIL`, `E2E_EXTERNAL_LOGIN_EMAIL` | ci.yml (e2e) | konto testowe Resend |
| `SENTRY_AUTH_TOKEN` | build (source maps) | opcjonalny — build przechodzi bez niego |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | render-upload-diagrams | upload assetów lekcji |
| `OPENAI_API_KEY`, `CHROMA_TENANT`, `CHROMA_DB_URL`, `CHROMA_API_KEY` | refresh-10x-rag | te same wartości co w starym repo |

Circle: workflow backupu NIE potrzebuje sekretu — tokeny są zahardkodowane
w `libs/circle/src/tokens.ts` (przeniesione z common). **Smell bezpieczeństwa**,
odnotowany jako follow-up (przenieść do sekretów), poza zakresem migracji.

## 3. Sekrety runtime na CF Pages (inwentarz — NIC nie przenosić, tylko zweryfikować)

`przeprogramowani-edu` (production, 17 sekretów): AIRTABLE_API_KEY,
BADGES_API_BASE_URL, CF_CAPTCHA_SECRET_KEY, CF_CAPTCHA_SITE_KEY,
CIRCLE_BRAVE_V1_TOKEN, CIRCLE_PRZEPROGRAMOWANI_V1_TOKEN, E2E_RESEND_API_KEY,
GH_PKG_TOKEN, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_SECRET, JWT_SECRET,
MAILING_SERVICE_URL, RESEND_API_KEY, SUPABASE_SERVICE_KEY,
TEN_X_DEVS_GAME_ACCOUNT_CREATED_GROUP_ID, TEN_X_DEVS_GAME_FINISHED_GROUP_ID,
TEN_X_DEVS_MAILERLITE_API_KEY.

`10x-assistant` (production, 4): CHROMA_API_KEY, CHROMA_TENANT, GH_PKG_TOKEN,
OPENAI_API_KEY.

⚠️ Listing środowiska **preview** przez wranglera 3.99 zwraca pusto dla obu
projektów — zweryfikować w dashboardzie, że sekrety preview są ustawione
(historyczna lekcja: brak sekretów na Preview = crash 1101 na deployach preview;
sekrety ustawiać ZAWSZE dla Production I Preview).

KV bindingi edu (deklarowane w `apps/edu-platform/wrangler.toml`, istnieją na koncie):
MAGIC_LINKS, PLATFORM_LESSON_CACHE, CIRCLE_MEMBERS, TOOLKIT_10X3_MEMBERSHIP_KV
(= CLI_10X3_MEMBERSHIP_KV `dd7fed…`), GAME_STATE, GAME_API_TOKENS
+ analytics engine `anon_game_starts`. Jadą z plikiem — zero akcji.

## 4. Kolejność przepięcia (krok po kroku)

1. **Push nowego repo** (runbook §1) — bez CI deploy (sekrety CF jeszcze nie ustawione,
   deploy step po prostu padnie; albo ustawić sekrety przed pierwszym pushem).
2. **Sekrety GH** w `przeprogramowani/przeprogramowani-edu` (tabela §2).
3. **Dashboard CF → Pages → przeprogramowani-edu → Settings → Builds & deployments:**
   sprawdzić stan integracji Git. Ponieważ produkcyjne deploye idą wranglerem z CI
   (Source w deployment list = commity CI), integrację Git ze starym repo należy
   **odłączyć** (lub przepiąć na nowe repo z WYŁĄCZONYMI automatic builds), żeby
   push do starego repo nigdy więcej nie zbudował platformy. To samo dla `10x-assistant`.
4. **Pierwszy deploy z nowego repo**: merge/push do master nowego repo → ci.yml →
   `nx run edu-platform:build && nx run edu-platform:deploy` (+ 10x-assistant).
   Weryfikacja: `npx wrangler pages deployment list --project-name przeprogramowani-edu`
   — najnowszy deployment z SHA nowego repo; smoke test platforma.przeprogramowani.pl
   (login, lekcja z KV cache, prework).
5. **Worker membership-refresh**: jednorazowo re-deploy z nowego repo (komenda w §1),
   żeby przyszłe zmiany kodu workera szły z właściwego miejsca (sam cron działa dalej
   bez re-deployu).
6. **Stare repo**: wyłączyć ścieżki edu/10x-assistant w quality-preview-deploy +
   workflowy refresh-* (runbook §4) — dopiero PO zielonym kroku 4.

## 5. Rollback

Deploy wrangler = direct upload; stary CI pozostaje sprawny do momentu kroku 6.
Rollback = ponowny deploy z master starego repo (lub `Rollback` na liście deploymentów
w dashboardzie CF — natychmiastowy powrót do poprzedniego builda).

## 6. Follow-upy po przepięciu

- Wynieść tokeny Circle z `libs/circle/src/tokens.ts` do sekretów (CF + GH).
- Usunąć `GH_PKG_TOKEN` wszędzie, jeśli pierwszy `npm ci` bez niego przejdzie.
- Zaktualizować wranglera (repo pinuje 3.99.0, dostępna 4.x) — osobny change.
- Rozważyć custom domain dla `10x-assistant` (dziś tylko *.pages.dev).
