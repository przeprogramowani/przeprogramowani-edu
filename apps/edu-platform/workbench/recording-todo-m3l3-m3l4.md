# Recording TODO — m3-l3 & m3-l4 (jedyne 2 nagrania w M3)

> Decyzja: nagrywamy tylko te dwa. Reszta scenariuszy zastąpiona tekstem + mermaidami (zweryfikowane 2026-05-31).
> **Każde nagranie ma własny worktree** (nie wspólny `/Users/admin/code/10xCards`):
> - Nagranie 1 (m3-l3) → `/Users/admin/code/10xcards-m3l3-injection` (gałąź `video/m3l3-injection-prep`)
> - Nagranie 2 (m3-l4) → `/Users/admin/code/10xcards-m3l4-review` (gałąź `video/m3l4-review-prep`)
> **Stan zweryfikowany 2026-05-31:** oba worktree mają `node_modules`; m3-l4 dry-run E2E = 4/4 zielone; m3-l3 hooki działają, `tsc` exit 2 + <10s. Szczegóły w sekcjach niżej.

## 🔧 Wspólny setup (raz, przed obiema sesjami)

- [x] Oba worktree zbudują się lokalnie (`node_modules` na miejscu)
- [x] `seed.spec.ts` jest w worktree m3-l4 (`10xcards-m3l4-review/tests/`) — referencja jakości; w worktree m3-l3 nie jest potrzebny
- [ ] Duży font w terminalu i edytorze (kluczowe: czytelność błędów `tsc` i kodu testu)
- [ ] Claude Code (lub Cursor) gotowy w sesji

---

## 🎬 Nagranie 1 — Context injection (m3-l3) · cel: 3–4 min

> Scenariusz: `lessons/m3-l3/videos/video-context-injection.md`. Pokazuje pętlę: edycja agenta → hook łapie błąd typu → agent widzi feedback → naprawia sam. Zamyka granicą „trywialna autokorekta ≠ debugging" i mostkiem do m3-l4.

### Setup
- [x] Trzy hooki aktywne w `.claude/settings.json`: ESLint (`--fix`), `tsc --noEmit`, `vitest related` (parsowanie `tool_input.file_path` przez `jq`) — zweryfikowane (`jq` jest, `vitest related` ~1.4s)
- [x] `tsc --noEmit` wykonuje się <10 s (~5.1s) — zweryfikowane
- [x] Hook zwraca exit code 2 przy błędzie `tsc` (Claude Code traktuje 2 jako blokujące) — zweryfikowane
- [ ] **DECYZJA: strategia złamania typu** — A (refaktor sygnatury), B (pre-break przed nagraniem), C (wymagany nowy parametr bez aktualizacji call-site)
  - Rekomendacja: dry-run Option A; jeśli agent nie wyprodukuje błędu → fallback Option B. **Pre-break JUŻ scommitowany** (`152a705` na `video/m3l3-injection-prep`): błędna adnotacja `requestedCount: string` w `generateCards` → dokładnie 1 błąd `tsc` (TS2322), bez kaskady w testach. Reset po każdym dublu: `git checkout src/lib/openrouter.ts`.
- [ ] **Potwierdź w dry-runie, że agent WIDZI treść błędu `tsc`** (nie tylko „blocked"). `tsc` pisze na stdout; injection przez exit 2 podaje stderr. W razie czego owiń hook: `bash -c 'npx tsc --noEmit 1>&2'`.
- [ ] **Segment 1 „dodaję typecheck na żywo"** — hook `tsc` JUŻ jest w settings. Albo zdejmij go tymczasowo, żeby dodać na kamerze, albo zmień narrację na „mam już komplet trzech".

### Recording
- [ ] Widoczny moment, gdy hook odpala się z błędem `tsc` (główny kadr)
- [ ] Widoczna odpowiedź agenta „widzę błąd, naprawiam" — NIE wycinać
- [ ] Bookmarki: (a) hook z błędem, (b) autokorekta agenta, (c) drugi przebieg hooków na zielono

### Decyzje do podjęcia na planie
- [ ] Pokazać wszystkie 3 hooki czy tylko `tsc`? → rekomendacja: wszystkie 3 (wzmacnia ideę „pipeline per-edit")

### Ryzyka / fallbacki
- Agent nie produkuje błędu typu → Option B (pre-break)
- `tsc` za wolny → komentarz „w większym projekcie przeniósłbym na bramkę commitową"
- Pętla poprawek >2 → tnij, powiedz „jeśli agent nie naprawia po dwóch próbach, problem jest głębszy"

### Po nagraniu
- [ ] Montaż do ~3–4 min
- [ ] Podmień placeholder `[VIDEO: Context injection …]` w `m3-l3/lesson-draft.md` (l.214) na finalny embed

---

## 🎬 Nagranie 2 — Review + re-prompt testu E2E / V3b (m3-l4) · cel: 4–5 min

> Scenariusz: `lessons/m3-l4/videos/video-review-anti-patterns.md`. Jeden plik testu z 3 anty-wzorcami (hallucynowana asercja, selektory CSS, `waitForTimeout`) → review → jeden compound re-prompt → weryfikacja względem seed testu.
>
> ⚠️ **Realna apka ≠ pierwotny scenariusz.** 10xCards jest **po polsku**, ma **jedną talię („Twoja talia")** i **brak ręcznego tworzenia decku/fiszki** — fiszki powstają tylko z generacji AI. Dlatego zły test **seeduje** fiszkę bezpośrednio (`helpers/seed-deck.ts`) i testuje persystencję na `/deck`. Źródło prawdy do nagrania: `10xcards-m3l4-review/tests/REVIEW-NOTES.md` + `tests/README.md`. Scenariusz i ten plik są już zsynchronizowane z tą rzeczywistością.

### Setup (zweryfikowane 2026-05-31 — dry-run 4/4 zielone)
- [x] Napisany „zły" test `tests/generated-flashcard-persistence.spec.ts` z 3 anty-wzorcami (seeduje fiszkę; realne klasy CSS)
- [x] Zły test PRZECHODZI na zielono (klasy z `DeckBrowser.tsx`/`PageHeader.astro`)
- [x] Poprawiona wersja `tests/generated-flashcard-persistence.fixed.spec.ts` — też przechodzi
- [x] `getByRole('heading',{name:'Twoja talia'})` + `getByText(marker,{exact:true})` matchują realny DOM
- [x] `storageState` skonfigurowany (`auth.setup.ts` → `playwright/.auth/user.json`)
- [x] Lokalny Supabase działa + `.env` z kluczami + chromium zainstalowany
- [ ] **(Opcjonalnie) Dry-run compound re-promptu na żywym agencie** — plik poprawiony jest „authored" (nie z żywej pętli); zweryfikowany na poziomie pliku. Na żywo: re-promptuj, a w razie czego tnij do `…fixed.spec.ts`.
- [x] Przygotowany pre-written poprawiony plik jako fallback

Komenda dry-runu:
```bash
cd /Users/admin/code/10xcards-m3l4-review
E2E_PORT=3001 E2E_EMAIL=e2e2@10xcards.test E2E_PASSWORD='Test1234!e2e' \
  E2E_USER_ID=eb465c8a-7e35-46a2-b1d5-db209c8e995b \
  npx playwright test generated-flashcard-persistence
```

### Recording
- [ ] Edytor i Claude Code obok siebie, oba czytelne (re-prompt + odpowiedź agenta)
- [ ] Bookmarki: (a) zielony zły test, (b) identyfikacja 3 problemów, (c) wysłanie re-promptu, (d) odpowiedź agenta, (e) porównanie z seed testem, (f) zielony dobry test

### Decyzje do podjęcia na planie
- [ ] Pokazać test PRZED i PO na zielono? → rekomendacja: tak (kontrast „fałszywa pewność" jest mocny, kosztuje ~20 s)
- [ ] Re-prompt wklejony czy pisany na żywo? → rekomendacja: pre-paste, komentarz „mam przygotowany re-prompt z trzema poprawkami"

### Ryzyka / fallbacki
- ~~Selektory CSS złego testu nie pasują do DOM~~ → **rozwiązane** (klasy z realnego DOM, test zielony)
- ~~Poprawiony test pada na `getByRole`~~ → **rozwiązane** (zweryfikowany zielony)
- Lokalny Supabase nie działa / brak `.env` → cała suite pada na `auth.setup`. Odpal `npx supabase start` przed nagraniem.
- Agent daje inną poprawkę → OK, Segment 4 to obsługuje; jeśli wprowadzi NOWY anty-wzorzec → dobry materiał, ale wydłuża wideo (preferuj czysty dry-run)
- Agent >15 s → tnij do przygotowanej poprawki, voice-over „agent wyprodukował poprawkę"
- Agent modyfikuje inne pliki → cofnij, „tylko ten plik"

### Po nagraniu
- [ ] Montaż do ~4–5 min
- [ ] Podmień placeholder `[VIDEO PLACEHOLDER: V3b …]` w `m3-l4/lesson-draft.md` (l.382) na finalny embed

---

## 🧩 Powiązane (nie-nagraniowe, ale spina się z release'em)
- [ ] Screeny do draftów: m3-l3 l.107, m3-l4 l.80 i l.246, m3-l5 l.88 (m3-l5 l.123 opcjonalny) + brakujący asset `m3-l4/assets/playwright-cli-open.png`
- [ ] Smoke-test toolkitu: `10x get m3l3` / `10x get m3l4` w katalogu scratch
- [ ] `/10x-archive l3l4l5-toolkit` po przeglądzie
