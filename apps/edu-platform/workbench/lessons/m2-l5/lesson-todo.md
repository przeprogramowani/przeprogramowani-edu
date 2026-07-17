DONE:
- ✅ Nie chcemy w tej lekcji wprowadzać /impl-review-ci — usunięte z draftu, spec i schematu
- ✅ Co najwyżej wprowadźmy goal + /auto-implement ale w uniwersalnej wersji — /goal jako główny, Ralph Wiggum loop jako uniwersalny wzorzec, /auto-implement jako launcher
- ✅ skupmy się na worktrees — worktrees jest centralną sekcją Core
- ✅ trzeba jasno powiedzieć, że można i warto równolegle pracować dokładnie tak samo jak w lekcjach 2-4, ale można też to zrobić na zasadzie "Implementacja bez rozmowy" zwłaszcza dla prostych zadań — sekcja "Dwa tryby: rozmowa albo delegowanie"
- ✅ codex, antigravity, superset, conductor, agent view - pokazywanie jak pracować na kilku sesjach — sekcja "Wiele sesji, jedno biurko"
- ✅ Brakuje tutaj czegoś uniwersalnego, co wykroczy poza /goal — Ralph Wiggum loop + bashowy while true + /auto-implement
- ✅ archive zostało już zaprezentowane i wytłumaczone w poprzednich lekcjach — usunięte z draftu
- ✅ trzeba znaleźć coś dodatkowego względem SR-05 (SR-04 wzięte), i opisać rozszerzenie roadmapy — S-04 zamienione na S-06 (UX improvements). Roadmapa rośnie organicznie.
- ✅ Kanoniczny heading 🧑🏻‍💻 Zadania praktyczne — dodany w drafcie
- ✅ Video p2 — nowy scenariusz multi-session tools overview (p2-multi-session-tools.md)
- ✅ Video p3 — zaktualizowany (/10x-status przywrócony jako dashboard, S-05+S-06)
- ✅ Spec — zaktualizowany (CI review/archive out, multi-session tools + Ralph Wiggum + /10x-status in, S-05+S-06)
- ✅ Schema — zaktualizowany (owns, learningOutcomes, videoPlaceholders, sideEffectLedger)
- ✅ /10x-status — usunięty z lekcji (nie obsługuje worktrees, nie widzi stanu zmian w izolowanych katalogach)


PRE-PRODUCTION (10xCards repo — `/Users/admin/code/10xCards/`):

Stan aktualny (2026-05-23):
- F-01, S-01, S-02, S-03: done + archived w `context/archive/`
- S-04 (srs-review-session): `implemented` w `change.md`, ale NIE zarchiwizowany. Roadmap wciąż mówi `implementing`. Wszystkie 4 fazy done (commity: 644421f, fba0e1d, cba6714, 0113d7c), epilogue zamknięty (86b13ab).
- S-05 (account-deletion-with-retention): `proposed` w roadmapie, BRAK folderu change, BRAK planu.
- S-06: NIE ISTNIEJE — ani w roadmapie, ani w repo.
- Brak worktrees (tylko master). Brak branchy feature/*. Git clean.
- Jedyny aktywny change folder: `context/changes/srs-review-session/`.

ROZBIEŻNOŚĆ: video scenario (p1-parallel-run.md) wciąż używa S-04+S-05 (stare), lesson draft już ma S-05+S-06 (nowe). Video scenario wymaga aktualizacji.
ROZBIEŻNOŚĆ: roadmap S-05 = `account-deletion-with-retention` (FR-005, GDPR), ale lesson draft nazywa go "Auth compliance". Trzeba ujednolicić nazewnictwo.


### Krok 1: Zarchiwizuj S-04 (srs-review-session)

S-04 jest zaimplementowane, ale nie przeszło archiwizacji. Punkt startowy wideo ("S-01 shipped, roadmap ma dalsze slice'y") wymaga S-04 w stanie `done` i zarchiwizowanym.

- [ ] 1a. Zaktualizuj `context/changes/srs-review-session/change.md`:
  - `status: archived`
  - `archived_at: <timestamp>`
- [ ] 1b. Przenieś folder: `context/changes/srs-review-session/` → `context/archive/2026-05-23-srs-review-session/`
- [ ] 1c. Zaktualizuj `context/foundation/roadmap.md`:
  - S-04 `Status`: `implementing` → `done`
  - Dodaj wpis do sekcji `## Done`:
    ```
    - **S-04: Start a review session; SRS library picks due cards; rate each card; first review state lands on disk** — Archived 2026-05-23 → `context/archive/2026-05-23-srs-review-session/`. Lesson: —.
    ```
- [ ] 1d. Commit: `chore(archive): close srs-review-session (S-04 north star shipped)`

### Krok 2: Zdecyduj nazewnictwo S-05

Roadmap S-05 = `account-deletion-with-retention` (FR-005), ale lesson draft i video używają `s05-auth-compliance` z opisem "Auth compliance — Logika autoryzacyjna".

**Opcje:**
- A) Zmień tematykę S-05 w roadmapie na "auth compliance" (prostsze na demo, ale zmiana roadmapy)
- B) Zachowaj roadmap S-05 = account-deletion, ale w change folderze użyj `account-deletion-with-retention` i zaktualizuj draft/video (spójność z roadmapą, ale wymaga edycji lesson-draft + video)
- C) Zachowaj roadmap S-05 = account-deletion, utwórz folder jako `s05-auth-compliance` i zaakceptuj różnicę nazw (szybkie, ale niespójne na kamerze gdy kursant widzi roadmapę obok folderu)

**Rekomendacja:** Opcja B — zachowaj roadmapowy `account-deletion-with-retention`, zaktualizuj lesson-draft i video. Na demo roadmapa i foldery są widoczne jednocześnie, niespójność byłaby myląca.

- [ ] 2a. Podejmij decyzję (A, B lub C)
- [ ] 2b. Jeśli B: zaktualizuj w lesson-draft.md tabelkę (S-05 → "Account deletion" zamiast "Auth compliance") i komendy worktree (`s05-account-deletion` zamiast `s05-auth-compliance`)
- [ ] 2c. Jeśli B: zaktualizuj video p1 analogicznie

### Krok 3: Dodaj S-06 do roadmapy

S-06 (UX improvements) nie istnieje w roadmapie — trzeba go dodać jako nowy slice, zgodny z narracją lekcji ("drobne usprawnienia UI odkryte podczas implementacji").

- [ ] 3a. Dodaj S-06 do tabeli "At a glance" w `context/foundation/roadmap.md`:
  ```
  | S-06 | ux-improvements | Bulk accept/reject on candidate review; reset SRS session; QoL polish (loading states, feedback toasts) | F-01 | — | planned |
  ```
- [ ] 3b. Dodaj S-06 do sekcji `## Streams` — Stream A lub nowy stream D (UX polish)
- [ ] 3c. Dodaj pełny opis S-06 w sekcji `## Slices`:
  - Outcome: bulk actions na candidate review, reset sesji SRS, lepsze stany ładowania
  - Change ID: `ux-improvements`
  - Prerequisites: F-01 (routes gated)
  - Parallel with: S-05
  - Status: planned
- [ ] 3d. Dodaj S-06 do tabeli `## Backlog Handoff`
- [ ] 3e. Commit: `chore(roadmap): add S-06 ux-improvements slice`

### Krok 4: Utwórz folder change S-05

- [ ] 4a. Utwórz `context/changes/s05-account-deletion/` (lub `s05-auth-compliance` — zależy od decyzji w kroku 2)
- [ ] 4b. `change.md`:
  ```yaml
  ---
  change_id: account-deletion-with-retention  # lub auth-compliance
  title: Account deletion with 30-day retention  # lub Auth compliance
  status: planned
  created: 2026-05-23
  updated: 2026-05-23
  archived_at: null
  ---
  ```
- [ ] 4c. `plan.md` — napisz plan z fazami, analogicznie do istniejących planów w 10xCards. Plan musi mieć:
  - Sekcję kontekstową (scope, refs, non-goals)
  - 2-3 fazy z weryfikowalnymi krokami
  - Sekcję Progress z checklistą `- [ ]` per krok
  - Musi być wystarczająco konkretny, żeby `/goal` mógł go wykonać
- [ ] 4d. Commit: `docs(s05): add change folder and implementation plan`

### Krok 5: Utwórz folder change S-06

- [ ] 5a. Utwórz `context/changes/s06-ux-improvements/`
- [ ] 5b. `change.md`:
  ```yaml
  ---
  change_id: ux-improvements
  title: UX improvements — bulk actions, session reset, QoL polish
  status: planned
  created: 2026-05-23
  updated: 2026-05-23
  archived_at: null
  ---
  ```
- [ ] 5c. `plan.md` — plan z trzema fazami:

  | Faza | Zakres | Szczegóły |
  |---|---|---|
  | 1 | Bulk actions | "Akceptuj wszystkie" / "Odrzuć wszystkie" w widoku kart do review (candidate review). Osobne przyciski + logika grupowej zmiany statusu FlashcardDraft. |
  | 2 | Reset sesji powtórek | Przycisk resetu sesji spaced repetition bez czekania na naturalny timeout. Endpoint `POST /api/review/reset` + przycisk w UI `/review`. |
  | 3 | QoL polish | Lepsze stany ładowania (skeleton/spinner), toast/feedback po bulk actions i po ratingu, progress indicator przy generowaniu fiszek. |

  Plan musi mieć format identyczny z istniejącymi planami 10xCards (sekcja kontekstowa, fazy, verification steps, progress checklist).
- [ ] 5d. Commit: `docs(s06): add change folder and implementation plan`

### Krok 6: Przygotuj fallback branche

Na wypadek gdyby `/goal` na kamerze nie zakończył się w rozsądnym czasie. Obie implementacje gotowe z commitami per faza.

- [ ] 6a. Branch `feature/s05-account-deletion` (lub `s05-auth-compliance`):
  - Zaimplementuj fazę po fazie z planu z kroku 4
  - Osobny commit per faza z opisowym message
  - Pushuj na remote
- [ ] 6b. Branch `feature/s06-ux-improvements`:
  - Zaimplementuj fazę po fazie z planu z kroku 5
  - Osobny commit per faza z opisowym message
  - Pushuj na remote
- [ ] 6c. Wróć na master po przygotowaniu obu branchy
- [ ] 6d. Usuń lokalne branche (zachowaj na remote) — czysty start do demo

### Krok 7: Zaktualizuj video scenario (p1-parallel-run.md)

Video scenario wciąż używa S-04+S-05, musi być zaktualizowane na S-05+S-06 zgodnie z draftem.

- [ ] 7a. Zamień wszystkie referencje:
  - `s04-account-deletion` → `s05-account-deletion` (lub `s05-auth-compliance`)
  - `s05-auth-compliance` → `s06-ux-improvements`
  - `10xcards-s04-account-deletion` → odpowiedni worktree name
  - `10xcards-s05-auth-compliance` → `10xcards-s06-ux-improvements`
  - `feature/s04-account-deletion` → odpowiedni branch name
  - `feature/s05-auth-compliance` → `feature/s06-ux-improvements`
- [ ] 7b. Zaktualizuj komentarz o kontekście w segment 1 — S-01 shipped → teraz S-01 do S-04 shipped
- [ ] 7c. Zaktualizuj segment 3 — `/goal` uruchamiany na S-05 (nie S-04)
- [ ] 7d. Zaktualizuj segment 4 — headless `claude -p "/goal ..."` na S-06 (nie S-05)
- [ ] 7e. Zaktualizuj segment 5 — podsumowanie z dwoma nowymi branchami
- [ ] 7f. Zaktualizuj sekcję "Pre-production TODO" — popraw nazwy folderów, branchy, worktrees
- [ ] 7g. Zaktualizuj sekcję "Video/text mismatches" — usuń stare, dodaj aktualne
- [ ] 7h. Upewnij się, że format promptu `/goal` w segmencie 3 odpowiada temu z lesson-draft:
  ```
  /goal Use 10x-implement skill to implement all phases of context/changes/s05-.../plan.md. Each phase is committed separately. All phases marked done in plan progress. Stop after 20 turns if not complete.
  ```

### Krok 8: Weryfikacja spójności lesson-draft ↔ video

- [ ] 8a. Sprawdź, że lesson-draft tabelka S-05/S-06 odpowiada nowym folder names i roadmapie
- [ ] 8b. Sprawdź, że komendy `git worktree add` w drafcie odpowiadają komendach w video scenario
- [ ] 8c. Sprawdź, że prompt `/goal` w drafcie = prompt w video scenario
- [ ] 8d. Sprawdź, że VIDEO PLACEHOLDER w drafcie opisuje poprawne S-05+S-06

### Krok 9: Dry-run i weryfikacja środowiska (dzień przed nagraniem)

- [ ] 9a. `git status` = clean na master
- [ ] 9b. `git worktree list` = tylko master
- [ ] 9c. Brak istniejących branchy `feature/s05-*`, `feature/s06-*` lokalnie
- [ ] 9d. `context/changes/` zawiera foldery S-05 i S-06 ze statusem `planned`
- [ ] 9e. `context/archive/` zawiera srs-review-session
- [ ] 9f. Roadmapa: S-04=done, S-05=planned, S-06=planned
- [ ] 9g. Dry-run `/goal` na jednym z planów — sprawdź, że ewaluator poprawnie rozpoznaje ukończone fazy
- [ ] 9h. Auto mode włączony w Claude Code
- [ ] 9i. `claude -p "/goal ..."` działa headless (segment 4)
- [ ] 9j. Zmienne środowiskowe: API keys, Anthropic token, Supabase
- [ ] 9k. Terminal font czytelny (min 14pt)
- [ ] 9l. Fallback branche na remote gotowe do `git checkout` jeśli `/goal` się zawiesi
- [ ] 9m. Turn limit 20 turns przetestowany — agent powinien ukończyć plan w < 20 turach


---

PRE-PRODUCTION VIDEO P2 (multi-session tools overview):

Stan aktualny (2026-05-23):
- p2 jest conversation-review, nie live-demo — nie wymaga zmian w 10xCards poza stanem z p1.
- p2 wymaga przygotowanych screenshotów/nagrań narzędzi PRZED nagraniem.

ROZBIEŻNOŚĆ: lista narzędzi w drafcie ≠ lista w video scenario p2:
- Draft body (linia 129): Cursor Agents, Antigravity, Superset, Conductor, Claude Code Agent View (5 narzędzi)
- Video p2: Superset, Conductor, Antigravity, VS Code Agent View (4 narzędzia)
- Brakuje **Cursor Agents** w video (jest w drafcie)
- Video ma **VS Code Agent View** zamiast **Claude Code Agent View** (to różne produkty!)
- Materiały dodatkowe (linie 175-180) mają OBA: Claude Code Agents View + VS Code Agents window (6 linków)

ROZBIEŻNOŚĆ: brak VIDEO PLACEHOLDER dla p2 w drafcie — jedyny placeholder (linia 123) dotyczy p1.


### Krok 10: Zdecyduj listę narzędzi do p2

Draft i video muszą pokazywać te same narzędzia. Obecny stan jest niespójny.

**Opcje:**
- A) Draft → video: dodaj Cursor Agents i Claude Code Agent View do video, zamień VS Code Agent View na Claude Code Agent View (5 narzędzi w video, 30-40 sek. per narzędzie = ~3 min, mieści się w 3-5 min)
- B) Video → draft: usuń Cursor Agents z draftu, zamień "Claude Code Agent View" na "VS Code Agent View" (4 narzędzia, prostsze nagranie)
- C) Pokaż 5 narzędzi w video ale zamień Claude Code Agent View na VS Code Agent View (Cursor Agents + Superset + Conductor + Antigravity + VS Code Agent View)

**Rekomendacja:** Opcja A — draft jest source of truth, video powinno dopasować się. Cursor Agents to znaczący gracz, a Claude Code Agent View jest bardziej relevantny dla naszego kontekstu (kurs używa Claude Code). VS Code Agent View może zostać w materiałach dodatkowych jako bonus link.

- [ ] 10a. Podejmij decyzję (A, B lub C)
- [ ] 10b. Zaktualizuj video scenario p2 lub lesson-draft (zależnie od decyzji)
- [ ] 10c. Upewnij się, że materiały dodatkowe w drafcie zawierają linki do WSZYSTKICH narzędzi z wideo + ewentualne dodatkowe

### Krok 11: Przygotuj materiały wizualne do p2

Każde narzędzie potrzebuje screenshot lub krótki screen recording (5-10 sek.) pokazujący multi-agent view.

- [ ] 11a. **Cursor Agents** (jeśli w finalnej liście):
  - Źródło: https://cursor.com/product lub aktualny UI Cursora
  - Pokaż: widok wielu agentów pracujących równolegle
  - Ciemny motyw, czytelna rozdzielczość, brak danych personalnych
- [ ] 11b. **Superset** (superset.sh):
  - Źródło: oficjalna strona, README, lub zainstalowany lokalnie
  - Pokaż: terminal z wieloma agentami CLI w osobnych worktrees
  - Sprawdź, czy narzędzie jest nadal aktywnie rozwijane
- [ ] 11c. **Conductor** (conductor.build):
  - Źródło: oficjalna strona lub demo
  - Pokaż: unified review z diffami i checkpointami wielu sesji
  - Sprawdź dostępność i aktualność UI
- [ ] 11d. **Antigravity** (Google):
  - Źródło: oficjalny blog Google Developers lub demo
  - **RYZYKO:** może nie być publicznie dostępny — jeśli brak dostępu, użyj screenshota z oficjalnego bloga/prezentacji
  - Pokaż: Manager view z wieloma agentami
  - Sprawdź status dostępności przed nagraniem
- [ ] 11e. **Claude Code Agent View** (jeśli w finalnej liście):
  - Źródło: https://code.claude.com/docs/en/agent-view lub aktualny UI Claude Code
  - Pokaż: widok zarządzania kilkoma agentami
  - Sprawdź, czy feature jest dostępny w aktualnej wersji Claude Code
- [ ] 11f. Zweryfikuj, że WSZYSTKIE screeny/nagrania mają:
  - Czytelną rozdzielczość (min 1080p)
  - Ciemny motyw (spójność z resztą nagrań)
  - Brak danych personalnych, tokenów, kluczy API
  - Aktualny UI (nie stare wersje)

### Krok 12: Zweryfikuj linki w materiałach dodatkowych

Wszystkie URL-e w sekcji "Materiały dodatkowe" draftu muszą być aktualne w momencie publikacji.

- [ ] 12a. https://cursor.com/product — Cursor Agents
- [ ] 12b. https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/ — Antigravity
- [ ] 12c. https://superset.sh/ — Superset
- [ ] 12d. https://www.conductor.build/ — Conductor
- [ ] 12e. https://code.claude.com/docs/en/agent-view — Claude Code Agents View
- [ ] 12f. https://code.visualstudio.com/docs/copilot/agents/agents-window — VS Code Agents window
- [ ] 12g. Jeśli któryś link jest martwy lub przekierowuje, zaktualizuj URL w drafcie

### Krok 13: Dodaj VIDEO PLACEHOLDER dla p2 w drafcie

Draft ma VIDEO PLACEHOLDER tylko dla p1 (linia 123). Sekcja "Wiele sesji w jednym widoku" nie ma placeholdera dla p2.

- [ ] 13a. Dodaj placeholder po linii 137 (przed "## Zadania praktyczne"):
  ```
  [VIDEO PLACEHOLDER: Multi-session tools overview. Prowadzący pokazuje dwa terminale z p1 jako punkt startu, następnie przegląda screeny/nagrania narzędzi do orkiestracji wielu agentów (Cursor Agents, Antigravity, Superset, Conductor, Claude Code Agent View), komentuje wspólny wzorzec: izoluj, deleguj, reviewuj.]
  ```
  (dostosuj listę narzędzi do decyzji z kroku 10)

### Krok 14: Weryfikacja p2 przed nagraniem

- [ ] 14a. Dwa terminale z p1 nadal widoczne jako punkt startu segmentu 1
- [ ] 14b. Worktrees z p1 istnieją (stan po p1 zachowany)
- [ ] 14c. Talking points przygotowane: prowadzący wie, co powiedzieć o każdym narzędziu w 30-45 sek.
- [ ] 14d. Prowadzący przećwiczył neutralny ton: żadnej rekomendacji, "najlepsze narzędzie", "musisz to zainstalować"
- [ ] 14e. Screeny narzędzi sprawdzone pod kątem aktualności — UI może się zmienić
- [ ] 14f. Czas trwania docelowy: 3-5 minut
- [ ] 14g. Nagranie p2 MUSI nastąpić PO p1 (zależy od stanu worktrees)


TODO:
**Video p1 (parallel run):**
- [ ] Krok 1: Archiwizuj S-04
- [ ] Krok 2: Zdecyduj nazewnictwo S-05
- [ ] Krok 3: Dodaj S-06 do roadmapy
- [ ] Krok 4: Utwórz folder change S-05
- [ ] Krok 5: Utwórz folder change S-06
- [ ] Krok 6: Przygotuj fallback branche
- [ ] Krok 7: Zaktualizuj video scenario p1
- [ ] Krok 8: Weryfikacja spójności draft ↔ video p1
- [ ] Krok 9: Dry-run i weryfikacja środowiska

**Video p2 (multi-session tools):**
- [ ] Krok 10: Zdecyduj listę narzędzi
- [ ] Krok 11: Przygotuj materiały wizualne
- [ ] Krok 12: Zweryfikuj linki w materiałach dodatkowych
- [ ] Krok 13: Dodaj VIDEO PLACEHOLDER dla p2 w drafcie
- [ ] Krok 14: Weryfikacja p2 przed nagraniem

**Nagranie:**
- [ ] Nagraj video p1 (live-demo, 8-12 min)
- [ ] Nagraj video p2 (conversation-review, 3-5 min) — bezpośrednio po p1
