# Change: edu-platform-extraction

## Intencja

Wydzielenie `projects/edu-platform` z monorepo `przeprogramowani-sites` do **osobnego
monorepo Nx**, prowadzone zgodnie z metodyką 10xDevs-3 M4L2–M4L5
(`research/01-methodology-m4l2-l5.md`, przeniesiona z brancha
`claude/10xdevs-modularization-analysis-sxtc0g`): tani deterministyczny zbiór dowodów →
interpretacja → decyzja człowieka na bramce; każda faza osobno odwracalna.

Proces prowadzony w pętli (`/loop`) z bramkami decyzji (wybór kierunku) i bramkami
sukcesu (weryfikowalny wynik — zielony build/testy zmaterializowanego repo).

## Decyzje z bramki 0 (zaakceptowane przez użytkownika, 2026-07-12)

1. **Deliverable:** plan + **wykonywalna ekstrakcja na branchu** — skrypt, który
   materializuje nowe monorepo Nx do katalogu wyjściowego; weryfikacja buildem.
   Bez tworzenia nowego repo GitHub w tej sesji.
2. **`@przeprogramowani/common`:** używana część (`src/circle`, 36K) zostaje
   **wchłonięta jako lib** (`libs/circle`) w nowym monorepo; stare monorepo
   zachowuje swoją kopię.
3. **Historia gita:** **fresh start** — nowe repo zaczyna od czystego commita;
   historia zostaje w `przeprogramowani-sites`.

## Decyzje z bramki 5 (rozszerzenie zakresu, 2026-07-17, po teleporcie sesji do CLI)

1. **Repo docelowe istnieje**: `github.com/przeprogramowani/przeprogramowani-edu`
   (utworzone ręcznie przez użytkownika; nazwa inna niż robocza z runbooka).
2. **Zakres rozszerzony o trzy projekty** (decyzja użytkownika na bramce):
   - `projects/10x-assistant` → `apps/10x-assistant` (asystent AI kursu; własny projekt CF Pages),
   - `projects/10x-rag` → `apps/10x-rag` (pipeline ingest → ChromaDB; standalone, własny
     lockfile, poza workspaces; pod `apps/`, bo 10x-assistant importuje jego źródła
     relatywną ścieżką rodzeństwa — wykryte przez bramkę buildową),
   - `projects/slides` → `apps/slides` (decki React+Vite).
   Uzasadnienie: zero sprzężeń kodowych z resztą starego monorepo; 10x-assistant i 10x-rag
   dzielą bazę Chroma (para danych), funkcjonalnie należą do platformy kursowej.

## Etapy i bramki

| Etap | Praca | Artefakt | Bramka |
|------|-------|----------|--------|
| 0. Research (Wide Scan) | metodyka + inwentaryzacja sprzężeń | `research/01–02` | ✅ decyzja: zakres/common/historia |
| 1. Plan faz (Deep Focus) | fazowany, odwracalny plan ekstrakcji | `plan.md` | ✅ decyzja: plan zaakceptowany |
| 2. Skrypt ekstrakcji | `utils/extract-edu-platform/` materializuje nowe repo | skrypt + scaffolding | ✅ sukces: CHECK OK |
| 3. Weryfikacja | install + check + testy + build w zmaterializowanym repo | log weryfikacji w `plan.md` | ✅ sukces: build zielony |
| 4. Runbook migracji | CI/sekrety/Cloudflare/odłączenie od starego repo | `runbook.md` | ✅ decyzja: zaakceptowany, pętla zakończona |

## Czego NIE robimy

- Nie tworzymy nowego repozytorium GitHub ani nie deployujemy (poza zasięgiem sesji).
- Nie zmieniamy zachowania edu-platform — ekstrakcja jest strukturalna, nie funkcjonalna.
- Nie usuwamy `projects/edu-platform` ze starego monorepo (to osobna, przyszła decyzja
  po udanej migracji — opisana w runbooku).
- Nie publikujemy `@przeprogramowani/common` jako pakietu npm (decyzja z bramki 0).
