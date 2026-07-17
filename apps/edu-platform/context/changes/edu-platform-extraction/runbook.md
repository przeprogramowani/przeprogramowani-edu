# Runbook: migracja edu-platform do osobnego monorepo Nx

Status: draft → do akceptacji na bramce 4.
Warunek wstępny: bramki sukcesu 2 i 3 zaliczone (zob. log w `plan.md`).

## 1. Materializacja i pierwszy push

```bash
# w przeprogramowani-sites (master z wmergowanym tym change'em)
node utils/extract-edu-platform/extract.mjs --out ../przeprogramowani-edu
cd ../przeprogramowani-edu
npm install            # przepina lock na nowy układ workspace'ów (prune starych wpisów)
git init -b master
git add -A && git commit -m "chore: initial extraction from przeprogramowani-sites"
git remote add origin git@github.com:przeprogramowani/przeprogramowani-edu.git
git push -u origin master
```

Uwagi:
- Historia zaczyna się od zera (decyzja z bramki 0); stara historia pozostaje
  w `przeprogramowani-sites`.
- Pierwszy `npm install` przepisuje `package-lock.json` (usuwa wpisy nieistniejących
  workspace'ów) — commitować wynikowy lock, nie ten wygenerowany przez extract.

## 2. Sekrety CI w nowym repo

Z portowanych workflowów (enumeracja z `.github/workflows/*` starego repo):

| Sekret | Workflow | Uwagi |
|--------|----------|-------|
| `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | ci.yml (deploy) | te same wartości co w starym repo |
| `GH_PKG_TOKEN` | ci.yml, refresh-circle-backup | tylko jeśli nadal potrzebny (po wchłonięciu common prawdopodobnie zbędny — zweryfikować pierwszym `npm ci` bez tokenu) |
| `E2E_RESEND_API_KEY`, `E2E_RESEND_INBOX_EMAIL`, `E2E_EXTERNAL_LOGIN_EMAIL` | ci.yml (e2e) | z sekcji e2e-edu starego workflow |
| `SENTRY_AUTH_TOKEN` | build (source maps, opcjonalny) | build przechodzi bez niego |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | render-upload-diagrams | upload assetów lekcji |
| `SLACK_WEBHOOK_URL`, `SLACK_ALERTS_WEBHOOK_URL` | (porzucone w porcie ci.yml) | dodać przy przywracaniu powiadomień |
| `OPENAI_API_KEY`, `CHROMA_TENANT`, `CHROMA_DB_URL`, `CHROMA_API_KEY` | refresh-10x-rag | C10; te same wartości co w starym repo |

`unknown`: kredencjały Circle dla `refresh-circle-backup` — `getTokenForPlatform`
czyta je w runtime (env); sprawdzić w ustawieniach starego repo/organizacji
przed pierwszym uruchomieniem harmonogramu i przenieść te same zmienne.

Sekrety RUNTIME (Supabase, Airtable, JWT, OAuth, Resend itd. z `astro-env.ts`)
żyją w Cloudflare Pages (projekt `przeprogramowani-edu`) — migracja repo ich nie dotyka.

## 3. Cloudflare Pages

Deploy celuje w te same projekty CF Pages: `przeprogramowani-edu`
(prod: `platforma.przeprogramowani.pl`) oraz `10x-assistant` (C10). Wymagane jedynie:
- token CF z uprawnieniem do obu projektów w sekretach nowego repo,
- wyłączenie automatycznych buildów CF podpiętych do starego repo, jeśli istnieją
  (deploy w CI idzie przez wranglera, więc prawdopodobnie brak).

## 4. Okres podwójnego działania i odcięcie

1. Po pierwszym zielonym deployu z nowego repo: freeze zmian edu w starym repo
   (PR-y edu kierować do nowego).
2. W starym repo wyłączyć ścieżki edu i 10x-assistant w `quality-preview-deploy.yml`
   (job `e2e-edu`, `deploy_if_affected "edu-platform"` i `"10x-assistant"`, mapy
   PROJECTS/CF_SUBDOMAINS) oraz workflowy `refresh-circle-backup.yml`,
   `render-upload-diagrams.yml` i `refresh-10x-rag.yml`.
3. Po tygodniu stabilności: usunięcie `projects/{edu-platform,10x-assistant,10x-rag,slides}`,
   `utils/circle-lesson-backup` i skryptów `10x:*`/`dev:edu`/`build:10x` ze starego repo
   (osobny change; poza zakresem tego runbooka).

## 5. Rollback

Stare repo pozostaje nietknięte przez cały proces — rollback = dalsze deployowanie
ze starego repo i skasowanie nowego. Brak migracji danych (treść lekcji jest w repo,
runtime state w Supabase/CF KV/Circle — nieprzenoszone).

## 6. Follow-upy po migracji (świadomie poza zakresem)

- Przycięcie odziedziczonych zależności roota (przeniesione verbatim; np. `madge`,
  `octokit`, `openai`, `svgo` mogą być zbędne).
- Przywrócenie powiadomień Slack i bramki e2e (`e2e-gate`) w ci.yml.
- `nx affected` z `nrwl/nx-set-shas` zamiast `run-many` (istotne dopiero przy >1 projekcie).
- Decyzja o `10x-rag`/`impl-review` — workflowy nie referują ścieżek edu wprost,
  ale funkcjonalnie dotyczą platformy; przegląd osobno.
- Usunięcie luźnego `apps/edu-platform/test-real-lesson.js` (debug script).
