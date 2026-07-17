TODO:
- [x] Lekcja nie zawiera zadania praktycznego — DONE: dodano sekcję Zadania praktyczne
- [x] Lekcja nie zawiera wstępu do deep dive — DONE: dodano standardowy intro Deep Dive
- [x] Zamieniamy kolejność - lekcja 4 będzie 3, lekcja 3 będzie 4 — DONE: schema zaktualizowany, dependsOn/preparesFor poprawione, bridge-in/out dostosowane
- [x] Wybierz bardziej złożony plan do review — DONE: S-04 (srs-review-session), video scenarios zaktualizowane
- [x] Napraw strukturę draftu — DONE
- [x] Editorial polish x3 — DONE: trzy rundy /lesson-editor-pl
- [x] RC review x2 — DONE: verdict "Ready"
- [x] Napraw stale referencje w video scenarios po swapie — DONE: S-01→S-04, m2-l4→poprzednia lekcja, ścieżki plików poprawione

Przed publikacją (nie blokuje RC):
- [ ] Dodaj `m2l3` do CLI course-content wiring w 10x-toolkit
  - [ ] Dodaj: /10x-impl-review oraz /10x-lesson
  - Uwaga: toolkit `module-02/lesson-03.ts` aktualnie zawiera skille do SRS lesson (10x-frame, 10x-research) — po swapie powinien zawierać 10x-impl-review i 10x-lesson
- [ ] Nagraj video z p2-triage na S-04
- [ ] Zweryfikuj URL: https://code.claude.com/docs/en/code-review

---

## Przygotowanie nagrania p2-triage — checklist krok po kroku

### Stan 10xCards (`/Users/admin/code/10xCards`)

Zweryfikowano 2026-05-23: repo na masterze, S-04 (srs-review-session) w stanie `implemented` (nie zarchiwizowany). Cała implementacja zamknięta commitami `644421f`–`0113d7c`. Plan na dysku: `context/changes/srs-review-session/plan.md`.

### Krok 1: Wygeneruj raport review (output p1)

Raport review to wejście do p2-triage. Plik `context/changes/srs-review-session/reviews/impl-review.md` **nie istnieje** — musi zostać stworzony przed nagraniem p2.

- [x] Uruchom `/10x-impl-review` w 10xCards na S-04 srs-review-session — DONE 2026-05-23
- [x] Zweryfikuj, że raport trafił do `context/changes/srs-review-session/reviews/impl-review.md` — DONE
- [x] Upewnij się, że raport zawiera **minimum 4 findings** zróżnicowane pod severity/impact — DONE: 1 CRITICAL, 4 WARNING, 3 OBSERVATION (8 findings łącznie)
- [x] Jeśli live findings nie pokrywają 4 typów triage — DONE: live findings pokrywają wszystkie 4 typy, fallback niepotrzebny

### Krok 2: Zweryfikuj findings pod 4 segmenty triage

Poniżej potwierdzone findings z analizy kodu (2026-05-23). Sprawdź, czy raport z `/10x-impl-review` je pokrywa. Jeśli nie — wstaw je do fallback raportu.

#### Segment 2 — Fix (CRITICAL, impact LOW)

**Finding**: `src/lib/save-session.ts:25-29` — query `acceptedDrafts` filtruje po `session_id` i `state`, ale **pomija** `.eq("account_id", accountId)`. Brak defense-in-depth: RLS chroni, ale plan explicite mówi "every API mutation must `.eq("account_id", user.id)`" (plan.md §Critical Implementation Details). Analogiczny problem w linii 50-55 (query `anyDrafts`).

Porównaj z prawidłowym wzorcem w tym samym pliku:
- linia 15-21: query `existing` — **ma** `.eq("account_id", accountId)` ✓
- linia 38-41: delete drafts — **ma** `.eq("account_id", accountId)` ✓
- linia 95-99: delete drafts — **ma** `.eq("account_id", accountId)` ✓

**Fix na żywo**: dodaj `.eq("account_id", accountId)` do dwóch zapytań:
```typescript
// linia 28, po .eq("session_id", sessionId):
.eq("account_id", accountId)

// linia 53, po .eq("session_id", sessionId):
.eq("account_id", accountId)
```

**Komentarz prowadzącego**: "Severity CRITICAL, impact LOW. Problem jest poważny — bez tego filtra, jeśli RLS kiedykolwiek zawiedzie, mamy data leakage. Ale poprawka to dwa dodatkowe `.eq()` w jednym pliku."

- [ ] Zweryfikuj, że fix kompiluje się bez błędów (`npm run lint`)
- [ ] Przygotuj git tag/branch jako reset point przed nagraniem (po fixie łatwy `git checkout`)

#### Segment 3 — Accept-as-rule: WARNING → `/10x-lesson`

**Finding**: Nowe API routes z S-04 (`rate.ts:53`, `due.ts:26`) poprawnie używają `.eq("account_id", user.id)` w każdym query. Ale `save-session.ts` (utility function) niespójnie stosuje ten pattern — niektóre query go mają, inne nie. To nie jest jednorazowy bug, to brak reguły projektu.

**Reguła do zarejestrowania**: "Every Supabase query accessing user-owned data must include an explicit `.eq('account_id', ...)` filter as defense-in-depth, even when RLS is enabled. This applies equally to API routes and library/utility functions."

**Akcja na żywo**: prowadzący wybiera "accept as recurring rule" → agent uruchamia `/10x-lesson` → reguła trafia do `context/foundation/lessons.md` (plik jest aktualnie pusty, więc będzie to pierwszy wpis).

**Komentarz prowadzącego**: "To nie jest jednorazowy bug. To sygnał, że agent nie zna lokalnej reguły. Jeśli naprawię tylko tu, w następnym slice'u zrobi to samo."

- [ ] Dry-run `/10x-lesson` w 10xCards — sprawdź format wpisu i czy plik się poprawnie aktualizuje
- [ ] Zweryfikuj, że `context/foundation/lessons.md` jest pusty (aktualnie: tak, zawiera tylko nagłówek)
- [ ] Po dry-runie: zresetuj `lessons.md` do stanu sprzed — potrzebny czysty start na nagraniu

#### Segment 4 — Skip (OBSERVATION, impact LOW)

**Finding (opcja A)**: `ReviewSession.tsx:30` — `const d = new Date(now)` używa jednoliterowej zmiennej `d`. Mogłaby być `adjusted` lub `result`.

**Finding (opcja B)**: `save-session.ts:36-47` — blok cleanup orphan drafts nie ma komentarza wyjaśniającego intencję biznesową.

**Finding (opcja C)**: `save-session.ts:63` — `.map((d) => ...)` używa `d` zamiast `draft` w callback.

Rekomendacja: **opcja A** (najkrótsza do pokazania, jednoznaczna).

**Komentarz prowadzącego**: "Severity OBSERVATION, impact LOW. Nazwa jest zrozumiała w kontekście 3-liniowej funkcji. Mogę to naprawić, ale to nie zmieni jakości merge'a. Skip."

- [ ] Wybierz konkretny finding do skip (A/B/C) i przygotuj 1-zdaniowe uzasadnienie

#### Segment 5 — Disagree

**Finding**: `jsonResponse()` helper (8 linii) jest zduplikowany w 5+ plikach API routes:
- `src/pages/api/review/[flashcardId]/rate.ts:9-14`
- `src/pages/api/review/due.ts:7-12`
- `src/pages/api/review/next-due.ts:7-12`
- `src/pages/api/flashcards/index.ts`
- `src/pages/api/flashcards/[id].ts`

Agent mógłby zasugerować: "Extract `jsonResponse` to a shared utility to reduce duplication."

**Kontrargument prowadzącego**:
1. Astro file-based routing czyni każdy route self-contained — to celowy design pattern frameworku.
2. 8 linii to za mało, żeby coupling ze shared utility się opłacił.
3. Modyfikacja jednego route (np. dodanie CORS headers) nie powinna wymagać zmiany w shared utility, która wpływa na wszystkie routes.
4. To premature generalization — te routes mogą ewoluować w różnych kierunkach.

**Komentarz prowadzącego**: "Agent widzi powtórzony kod i sugeruje abstrakcję. Ale w Astro te handlery celowo są oddzielne — mają być self-contained. Abstrakcja teraz to premature generalization."

- [ ] Przygotuj kontrargumenty na wypadek pytań (powyższe 4 punkty)
- [ ] Jeśli live review nie produkuje tego finding — użyj przygotowanego fallback finding

### Krok 3: Przygotuj git state

- [x] Utwórz branch lub tag jako reset point: `git tag p2-triage-start` (na aktualnym masterze, przed jakimikolwiek zmianami) — DONE 2026-05-23
- [ ] Po fix i `/10x-lesson` dry-runie — sprawdź, że `git checkout p2-triage-start` przywraca czysty stan
- [ ] Podczas nagrania: fix z segmentu 2 zostanie scommitowany, `/10x-lesson` z segmentu 3 zmodyfikuje `lessons.md`
- [ ] Po nagraniu: zdecyduj czy zachować zmiany na masterze czy zresetować

### Krok 4: Terminal i środowisko

- [ ] Font size terminala: minimum 16pt, czytelny na nagraniu
- [ ] Window layout: terminal główny na ~70% ekranu
- [ ] Przygotuj shortcut do otworzenia `context/foundation/lessons.md` w edytorze (szybkie przeskoczenie po `/10x-lesson`)
- [ ] Upewnij się, że `npm run dev` startuje bez błędów w 10xCards
- [ ] Supabase local stack uruchomiony (`npx supabase start`)

### Krok 5: Dry run pełnego triage

- [ ] Pełny dry run 4 findings w kolejności: fix → accept-as-rule → skip → disagree
- [ ] Timing: cel 8-12 minut na cały triage (segmenty 2-5)
  - Segment 2 (Fix): 1-2 min
  - Segment 3 (/10x-lesson): 2-3 min
  - Segment 4 (Skip): 1-2 min
  - Segment 5 (Disagree): 1-2 min
- [ ] Komentarz tool-agnostic na koniec: "W twoim narzędziu triage może wyglądać inaczej, ale te same cztery grupy decyzji mają zastosowanie niezależnie od narzędzia."

### Krok 6: Mapowanie findings z raportu na segmenty

Live `/10x-impl-review` wyprodukował 8 findings. Poniżej mapowanie na segmenty triage (wybór 4 z 8):

| Segment | Finding | ID | Typ decyzji |
|---|---|---|---|
| S2 (Fix) | Missing `account_id` filter `save-session.ts:25-29,50-55` | **F1** (CRITICAL) | fix |
| S3 (Accept-as-rule) | Defense-in-depth inconsistency: review routes vs flashcard/draft routes | **F3** (WARNING, HIGH impact) | `/10x-lesson` |
| S4 (Skip) | Polish UI labels vs English plan labels — observation, consistent with existing UI | **F7** (OBSERVATION) | skip |
| S5 (Disagree) | `jsonResponse` duplication across 6 API files — suggestion to extract | **F2** (WARNING) | disagree |

Findings pominięte w nagraniu (F4, F5, F6, F8) — prowadzący może wspomnieć: "Mam jeszcze 4 findings, ale pokażę po jednym z każdej grupy decyzji."

**Dlaczego F3 zamiast wcześniejszego "inconsistent auth pattern"**: F3 jest lepszy pod accept-as-rule bo dotyczy cross-slice divergence (nie jednorazowego błędu w jednym pliku). Reguła brzmi: "Every Supabase query accessing user-owned data must include `.eq('account_id', ...)` as defense-in-depth — applies to all API routes and library functions, regardless of RLS."

**Dlaczego F7 zamiast single-letter variable**: F7 jest lepszy pod skip bo jest naturalnie mniej kontrowersyjny — prowadzący nie musi udowadniać, że nazwa jest OK, bo implementation po prostu zlokalizowała labele do polskiego UI. Alternatywa: F5 (trigger naming) lub F6 (RLS policy style).

- [x] Fallback raport niepotrzebny — live findings pokrywają wszystkie 4 typy triage

### Alignment z lesson-draft.md

Zweryfikowane mapowanie segmentów p2-triage → sekcje draftu:

| Segment | Draft section | Pasuje? |
|---|---|---|
| S1 (wznowienie triage) | "Triage: finding po findingu" | ✓ |
| S2 (fix CRITICAL) | "1. Napraw teraz" (linia 119-124) | ✓ — draft mówi "endpoint zapisujący zaakceptowaną fiszkę omija istniejący mechanizm autoryzacji", finding dotyczy `save-session.ts` (zapis fiszek) i brakującego `account_id` guard |
| S3 (accept-as-rule) | "3. Buduj pamięć projektu" (linia 135-141) | ✓ — draft mówi "nowe server actions muszą używać istniejącego auth guard pattern", finding dotyczy dokładnie tego samego |
| S4 (skip) | "2. Nie naprawiaj teraz" (linia 127-132) | ✓ — draft mówi "nazwa mogłaby być lepsza, ale nie narusza konwencji" |
| S5 (disagree) | "4. Odrzuć finding" (linia 145-149) | ✓ — draft mówi "sugestia wyodrębnienia wspólnej abstrakcji" |
| S6 (verdict) | "Werdykt przed merge" (linia 195-206) | ✓ |

**Brak rozbieżności** między scenariuszem, findingsami i draftem.
