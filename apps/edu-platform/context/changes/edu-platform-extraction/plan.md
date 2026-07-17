# Plan: ekstrakcja edu-platform do osobnego monorepo Nx

Status: draft → do akceptacji na bramce 1.
Wejścia: `research/01-methodology-m4l2-l5.md`, `research/02-coupling-map.md`,
decyzje z bramki 0 (zob. `change.md`).

Właściwości planu (za M4L4): guard-first, każda faza osobno odwracalna i weryfikowalna,
mechanizm ląduje zielony / przełączenie (odcięcie starego repo) osobno — poza zakresem
tego change'u.

## Docelowa struktura nowego monorepo

```
przeprogramowani-edu/          # github.com/przeprogramowani/przeprogramowani-edu
├── nx.json                    # namedInputs + targetDefaults (port z obecnego roota)
├── package.json               # workspaces + scalone zależności (root ∪ edu), pin astro@5.1.8
├── tsconfig.json              # inlined: astro/tsconfigs/strict + obecne opcje roota
├── .npmrc / .gitignore / eslint / prettier / husky
├── apps/
│   ├── edu-platform/          # kopia projects/edu-platform (src, workbench, testy, config)
│   │   └── project.json       # build/check/test/deploy (wrangler → przeprogramowani-edu)
│   ├── 10x-assistant/         # C10: asystent AI (deploy → CF Pages 10x-assistant)
│   ├── 10x-rag/               # C10: ingest → ChromaDB; NIE-workspace (własny lockfile),
│   │                          #   musi być rodzeństwem 10x-assistant (relatywny import źródeł)
│   └── slides/                # C10: decki React+Vite
├── libs/
│   └── circle/                # wchłonięte projects/common/src/circle (C1)
├── tools/
│   ├── astro-patches/         # C2: patch-content-datastore.js + rewrite-deps.js
│   └── circle-lesson-backup/  # C8
└── .github/workflows/         # ci.yml + refresh-circle-backup, render-upload-diagrams, refresh-10x-rag
```

Import rewrite: `@przeprogramowani/common/src/circle*` → `@edu/circle*`
(7 plików w `apps/edu-platform/src/server/circle/`), alias w tsconfig `paths` +
workspace `libs/circle`.

## Fazy

### Faza 1 — skrypt ekstrakcji (mechanizm)

`utils/extract-edu-platform/extract.mjs` w STARYM repo (jedyny commitowany kod wykonawczy):

- czyta manifest `manifest.json` (co kopiować, co przepisywać, szablony konfigów),
- materializuje strukturę j.w. do `--out <dir>` (spoza repo; nic wygenerowanego nie
  jest commitowane),
- kopiuje: `projects/edu-platform` → `apps/edu-platform`, `projects/common/src/circle`
  → `libs/circle/src`, `utils/astro-5-adapter` → `tools/astro-patches`,
  `utils/circle-lesson-backup` → `tools/circle-lesson-backup`,
- przepisuje: importy C1, ścieżki relatywne C2 w skrypcie `build`, `extends` w tsconfig,
- generuje: root `package.json` (scalone deps z pinami), `nx.json`, `project.json`,
  configi lint/format, workflowy CI z szablonów.

Weryfikacja fazy (bramka sukcesu 2): skrypt kończy się bez błędu, `--check` raportuje
0 nieprzepisanych referencji do `przeprogramowani-sites`/`@przeprogramowani/common`
w zmaterializowanym drzewie.

### Faza 2 — weryfikacja wykonawcza

W zmaterializowanym katalogu (poza repo):

1. `npm install` (postinstall = oba patche C2) — gate: exit 0.
2. `npx nx run edu-platform:check` (astro check) — gate: exit 0.
3. `npx nx run edu-platform:test` (vitest) — gate: wynik identyczny jak w starym repo
   (baseline zdjęty przed migracją).
4. `npx nx run edu-platform:build` — gate: exit 0 + `verify-build-content.mjs` przechodzi
   (to jest twardy dowód, że C2 działa w nowym układzie).

Wynik + logi wklejone do sekcji "Log weryfikacji" poniżej. To bramka sukcesu 3.

### Faza 3 — runbook migracji (dokument)

`runbook.md`: utworzenie repo GitHub, push zmaterializowanego drzewa, sekrety CI
(enumeracja z workflowów), przepięcie CF Pages `przeprogramowani-edu`, okres podwójnego
działania, kryteria odcięcia i plan wycofania (stare repo nietknięte = naturalny rollback).
Bramka decyzji 4: akceptacja runbooka kończy pętlę.

## Czego NIE robimy (powtórzenie z change.md)

- Zero zmian w działającym kodzie starego monorepo (skrypt ekstrakcji jest addytywny).
- Brak tworzenia repo GitHub / deployu / przełączania DNS w tej sesji.

## Log weryfikacji

Środowisko: kontener CCR (Linux, node v22.22.2, npm 10.9.7), katalog wyjściowy
poza drzewem gita. Data: 2026-07-12.

| Bramka | Komenda | Wynik |
|--------|---------|-------|
| Sukces 2 | `extract.mjs --out … --force` + wbudowany check | ✅ `CHECK OK — no stale references` (512 MB, po 3 iteracjach poprawek — patrz niżej) |
| — | `npm install` | ✅ exit 0, 1651 pakietów; oba patche astro zalogowały sukces z `tools/astro-patches` |
| Sukces 3 | `nx run edu-platform:check` | ✅ exit 0, 0 błędów ts |
| Sukces 3 | `nx run edu-platform:test` | ✅ exit 0 (vitest) |
| Sukces 3 | `nx run edu-platform:build` | ✅ exit 0; `verify-build-content`: lessons10xDevs3 25/25, Prework 15/15, PreworkEn 15/15 |

Problemy złapane przez bramki (wszystkie naprawione w `extract.mjs`):

1. **C8 głębsze niż w mapie**: `circle-lesson-backup` importuje
   `@przeprogramowani/common/src/circle` w 4 plikach + tsconfig paths —
   złapane przez check ekstrakcji; dopisane przepisania (korekta w `research/02`).
2. **Dryf rezolucji bez locka**: świeży `npm install` kończył się ERESOLVE
   (vite@8 vs @types/node@20). Fix: przeniesienie `package-lock.json`
   z przepisanymi ścieżkami workspace'ów.
3. **Fantomowa zależność `dotenv`**: `playwright.config.ts` importuje dotenv
   hoistowany w starym repo z `projects/10x-assistant`. Fix: jawny wpis
   `dotenv@17.2.3` w devDependencies generowanego roota.

Odstępstwo od planu: baseline'u testów w starym repo nie zdejmowano — testy
w nowym repo przeszły w całości, więc porównanie było zbędne.

### Log weryfikacji — zakres rozszerzony (bramka 5, lokalnie po teleporcie, 2026-07-17)

Środowisko: macOS (maszyna użytkownika), node v22.14.0. Pełny czysty cykl
(extract → install → check+test → build ×3, bez cache nx):

| Bramka | Wynik |
|--------|-------|
| `--check` ekstrakcji | ✅ CHECK OK (692 MB) |
| `npm install` | ✅ 1886 pakietów, patche astro OK |
| `nx run-many -t check test` | ✅ exit 0 (730/730 testów edu) |
| `nx run-many -t build` (edu + 10x-assistant + slides) | ✅ exit 0; verify-build-content 25/25, 15/15, 15/15 |

Problemy złapane przez bramki w rozszerzonym zakresie (wszystkie naprawione w extract.mjs):

4. **Sprzężenie kodowe 10x-assistant → 10x-rag** (nie tylko przez Chromę):
   `ragRetrievalService.ts` importuje `../../../10x-rag/src/lib/query-service.js`
   relatywnie. Fix: `10x-rag` ląduje w `apps/` jako rodzeństwo (import bez zmian),
   pozostając poza workspaces (własny lockfile). Korekta w `research/02` (C10).
5. **Fantomy bundla asystenta**: `cheerio` i `turndown` (w starym repo hoistowane
   z workspace'u `llm-utils`, który nie jedzie dalej). Fix: jawne devDeps w rootcie.
6. **Regresja topologii zależności**: root `cheerio@^1.1.2` → świeża rezolucja 1.2.0,
   a po pinie 1.1.2 dedupe wymusił `undici@7.28`, którego import pod jsdom rzuca
   InvalidCharacterError (padała suita preworkCodeBlockRepair). Fix: root
   `cheerio@1.0.0` — dokładnie ta wersja, którą hoistował stary root; celowy
   konflikt wersji trzyma kopię edu (1.1.2 + undici 7.25.0 z locka) zagnieżdżoną,
   odtwarzając topologię starego repo 1:1 (build asystenta w starym CI też bundlował 1.0.0).
