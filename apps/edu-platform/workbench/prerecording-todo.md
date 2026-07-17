# Pre-recording TODO — m3-l3 & m3-l4

> Cel: po obiedzie wejść i nagrywać bez tarcia. Stan zweryfikowany 2026-05-31.
> Worktree per nagranie:
> - Nagranie 1 (m3-l3, context injection) → `/Users/admin/code/10xcards-m3l3-injection` (`video/m3l3-injection-prep`)
> - Nagranie 2 (m3-l4, review + re-prompt) → `/Users/admin/code/10xcards-m3l4-review` (`video/m3l4-review-prep`)

## 1. Przeczytaj (10–12 min, w tej kolejności)

1. `lessons/m3-l3/videos/video-context-injection.md` — Prerequisites (nota o 3 hookach), Segment 1 (decyzja o hooku `tsc`), Segment 2 Option A/B.
2. `lessons/m3-l4/videos/video-review-anti-patterns.md` — Segmenty 1–4 (polski UI, realne selektory).
3. `10xcards-m3l4-review/tests/REVIEW-NOTES.md` — źródło prawdy dla Nagrania 2 (seedowana fiszka, realne selektory, re-prompt). Jak wideo i notatki się rozjadą — wierz notatkom.

## 2. Zdecyduj teraz (3 decyzje, żeby nie myśleć na planie)

- [x] **m3-l3 — wybór: mix B + C.** B = pre-break `requestedCount` (gwarantowany błąd, commit `152a705`). C = prawdziwy prompt na żywo („add optional `temperature` to @src/lib/openrouter.ts, pass to fetch body, don't update caller"). Hook łapie błąd B, gdy agent edytuje `generateCards` pod C; agent naprawia przy okazji.
  - **Stan startowy dubla:** `git checkout src/lib/openrouter.ts` (wraca do `152a705` = sam B, bez `temperature`). Potwierdź `npx tsc --noEmit` → 1× TS2322.
  - **Fallback narracyjny:** jak agent zignoruje błąd B → „napraw też ten błąd typu, który wyskoczył".
- [ ] **m3-l3 — Segment 1:** hook `tsc` JUŻ jest w `.claude/settings.json`. Albo zdejmij go na chwilę, by dodać na kamerze, albo narracja „mam już komplet trzech". Wybierz jedno.
- [ ] **m3-l4 — re-prompt na żywo czy fallback?** Rekomendacja: pre-paste przygotowanego re-promptu; jak agent zamuli >15 s → tnij do `…fixed.spec.ts`.

## 3. Tuż przed nagraniem (po obiedzie) — pre-flight, ~30 s

```bash
# Nagranie 1 (m3-l3): pre-break uzbrojony?
cd /Users/admin/code/10xcards-m3l3-injection && git log --oneline -1   # → 152a705
npx tsc --noEmit                                                       # → 1× error TS2322 (Option B gotowe)

# Nagranie 2 (m3-l4): Supabase żyje? testy zielone?
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:54321/auth/v1/health   # → 200, inaczej: npx supabase start
cd /Users/admin/code/10xcards-m3l4-review
E2E_PORT=3001 E2E_EMAIL=e2e2@10xcards.test E2E_PASSWORD='Test1234!e2e' \
  E2E_USER_ID=eb465c8a-7e35-46a2-b1d5-db209c8e995b \
  npx playwright test generated-flashcard-persistence                  # → 3 passed
```

- [ ] **Duży font** w terminalu i edytorze (główny kadr — czytelność błędu `tsc` i kodu testu).
- [ ] Claude Code (lub Cursor) gotowy w sesji.

## 4. Komendy reset na planie (zapamiętaj te dwie)

- **m3-l3, czysty start pod Option A:** `git checkout HEAD~1 -- src/lib/openrouter.ts` (czysty plik w working tree, commit nietknięty). Powrót do pre-breaku: `git checkout src/lib/openrouter.ts`.
- **reset po dublu:** `git checkout src/lib/openrouter.ts` / `git checkout tests/generated-flashcard-persistence.spec.ts`.

## Gotchas

- **m3-l4 bez Supabase = cała suite pada na `auth.setup`.** Jeśli przerwa zatrzyma kontener — `npx supabase start` przed pierwszym dublem.
- **m3-l3: potwierdź na pierwszym dublu, że agent WIDZI treść błędu** (nie samo „blocked"). Jak nie — owiń hook: `bash -c 'npx tsc --noEmit 1>&2'`.
- Worktree m3-l3 jest teraz **celowo czerwony na `tsc`** (feature, nie bug — pre-break `152a705`).

## Po nagraniu (nie blokuje nagrań)

- [ ] Revert pre-breaku m3-l3: `git checkout src/lib/openrouter.ts` (lub `git revert 152a705`).
- [ ] Podmiana placeholderów `[VIDEO …]` w draftach: m3-l3 ~l.214, m3-l4 ~l.382.
- [ ] (Osobny tor — toolkit) push obu repo + smoke-test `10x get m3l3` / `10x get m3l4` w scratchu + `/10x-archive l3l4l5-toolkit`.
