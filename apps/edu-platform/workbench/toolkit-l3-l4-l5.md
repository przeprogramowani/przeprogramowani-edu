# Artefakty toolkitowe dla m3-l3 / m3-l4 / m3-l5

> **STATUS: ZAIMPLEMENTOWANE** (2026-05-31, change `l3l4l5-toolkit`). Wiązanie + artefakty w repo toolkitu, get-blocki w draftach (workbench). Build `course-content` waliduje wszystkie referencje. Zostały: ręczny przegląd redakcyjny, smoke-test `10x get`, push, archiwizacja. Szczegóły niżej.
>
> Oryginalna treść tego pliku (kontekst, ścieżki, mechanika wiązania) zachowana pod statusem jako materiał referencyjny.

---

## ✅ Co zostało zrobione

**Toolkit repo** (`/Users/admin/code/10x-toolkit`, master) — 3 commity:
| SHA | Lekcja | Co |
| --- | --- | --- |
| `9d16ec8` | m3-l3 | `ai-artifacts/rules/CLAUDE-m3l3.md` (nowa) + `module-03/lesson-03.ts` (wiring, `rules:["CLAUDE-m3l3"]`, summary) |
| `183b07a` | m3-l4 | `ai-artifacts/prompts/m3l4-e2e-prompt.md` (nowa) + `ai-artifacts/rules/CLAUDE-m3l4.md` (nowa) + `module-03/lesson-04.ts` (wiring, `+m3l4-e2e-prompt`, `rules:["CLAUDE-m3l4"]`, summary) |
| `fbaec49` | m3-l5 | `module-03/lesson-05.ts` (wiring, dziedziczy łańcuch, `rules:[]`, summary) — **bez nowego artefaktu** |

**Workbench repo** (`przeprogramowani-sites`, master) — 1 commit:
| SHA | Co |
| --- | --- |
| `ab47f4f5` | get-block `get m3l3` (m3-l3 draft) + get-block `get m3l4` (m3-l4 draft) + dodany Copilot do zadania konfiguracji hooków (m3-l3) + domknięty `plan.md`/`change.md` zmiany |

**Walidacja (automat, przeszła):**
- `npm run build:lessons` (w `course-content`) → exit 0, **zero** błędów `Missing root artifact`.
- Inspekcja bundli: `m3l3` ma `rules:[CLAUDE-m3l3]` (7950 zn.) + odziedziczone skills/prompts; `m3l4` ma `prompts:[…, m3l4-e2e-prompt]` + `rules:[CLAUDE-m3l4]` (7775 zn.); `m3l5` dziedziczy łańcuch (z `m3l4-e2e-prompt`), `rules:[]`.
- `vitest run` w `course-content`: 46/46 zielone.

## 🔑 Decyzje podjęte w trakcie (odstępstwa od pierwotnego planu w tym pliku)

1. **`configs` NIE użyte na żadnej lekcji.** Pierwotnie m3-l3 miało dostarczać hooki przez `configs:["settings"]`. Zweryfikowano w kodzie CLI (`10x-cli/src/lib/writer.ts`): dostawa `configs` jest **reference-only** — wrzuca plik do `.claude/config-templates/`, **nie merge'uje** do aktywnego `.claude/settings.json` i nie zdejmuje sufiksu `.template`. To wprowadzałoby kursanta w błąd („hooki zainstalowane"), więc **m3-l3 dostarcza tylko regułę; hooki zostają inline w drafcie** (gdzie już są). → To zamyka otwarte pytanie „Do potwierdzenia #1".
2. **m3-l5 nie dostarcza żadnego artefaktu** — brak `CLAUDE-m3l5`, brak wpisu Sentry MCP w `mcp.json.template`, brak bloku `get m3l5` w drafcie. Lekcja tylko dziedziczy łańcuch i ma wypełnione `summary`. Powód: brak instalowalnego artefaktu; unikamy niemal pustej paczki.
3. **Seed test E2E nie jest dostarczany** — brak slotu na surowe pliki testowe; seed zostaje przykładem inline w drafcie m3-l4.
4. **`lefthook.yml` nie jest artefaktem** — żyje inline w drafcie m3-l3.
5. **`rules` nie jest akumulowane** (spread) — każda lekcja niesie tylko swoją regułę (m3-l3 → `CLAUDE-m3l3`, m3-l4 → `CLAUDE-m3l4`, m3-l5 → brak). Akumulowane są tylko `skills`/`prompts`/`configs`.
6. **Copilot w drafcie m3-l3** — do zadania „Skonfiguruj hook lint + typecheck" dopisano Copilota (`.github/hooks/*.json`, w VS Code kompatybilny z formatem `.claude/settings.json`). Reguła `CLAUDE-m3l3` już miała Copilota w tabeli cross-tool, więc reguły nie ruszano.

## ⬜ Co jeszcze do zrobienia

- **Ręczny przegląd redakcyjny (pozycje manualne planu)** — nieodhaczone, czekają na decyzję człowieka:
  - get-block `get m3l3` czyta się naturalnie przy pierwszym użyciu hooka; treść `CLAUDE-m3l3` zgodna z modelem hooków z draftu (bez zmyślonych claimów).
  - prompt `m3l4-e2e-prompt` jest 1:1 z draftem; przykład renderuje się poprawnie.
  - `CLAUDE-m3l4` oddaje reguły E2E + anty-wzorce bez kradzieży zakresu l3/l5.
  - get-block `get m3l4` czyta się naturalnie przy sekcji prompt-template.
- **Smoke-test z realnym CLI** — w katalogu scratch: `npx @przeprogramowani/10x-cli@latest get m3l3` (→ `CLAUDE.md` dostaje blok reguły m3l3), potem `get m3l4` (→ `.claude/prompts/m3l4-e2e-prompt.md` istnieje + reguła m3l4 w `CLAUDE.md`).
- **Push** — oba repo lokalnie na master, nic nie wypchnięte.
- **Archiwizacja** — po smoke-teście `/10x-archive l3l4l5-toolkit`.
- **(Opcjonalnie) `toolkit-l3-l4-l5.md`** (ten plik) jest untracked w korzeniu workbench — folder zmiany ma własny `plan-brief.md`, więc nie wszedł do commita. Dorzuć osobno, jeśli chcesz go wersjonować.
- **(Poza tym change'em) Track A — 10xCards demo** — patrz sekcja „Track A vs Track B" niżej. Plant buga z m3l5 **nigdy do mastera 10xCards**.

## ℹ️ Side-effecty / domknięte flagi
- m3-l2 literówka (stray „` i`") — **już naprawiona** commitem `1381a4e0` (fence czysty).
- m3-l2 etykieta cross-reference w m3-l5 („Testy jednostkowe i integracyjne z agentem (M3L2)") — **zostawiona** świadomie (czyta się naturalnie, nie łamie).

---
---

# (Referencja) Oryginalny brief — kontekst i mechanika

> Poniżej pierwotna treść TODO. Zachowana dla kontekstu ścieżek i mechaniki wiązania. Sekcje wykonawcze zrealizowane — patrz status wyżej.

## Po co to / problem

Lekcje 10xDevs 3.0 dostarczają kursantom artefakty przez CLI (`10x get m3l4`). Źródło artefaktów to monorepo toolkitu:
`/Users/admin/code/10x-toolkit/packages/ai-artifacts/` (skille, prompty, reguły, config-templates),
a podpięcie „który artefakt do której lekcji" żyje w:
`/Users/admin/code/10x-toolkit/packages/course-content/src/courses/10xdevs3/module-03/lesson-0X.ts`.

**Kluczowe ułatwienie:** żadna z tych trzech lekcji NIE wprowadza nowego `/10x-*` skilla. Dorabiamy **prompt + reguły**, nie piszemy skilli. (Pierwotnie zakładano też `config`; patrz decyzja #1 — ostatecznie bez configs.)

## Mechanika wiązania (potwierdzona w kodzie)

W `module-03/lesson-0X.ts` jest `defineLesson({ ... artifacts: { root: {...}, local: {...} } })`.
Każdy z `root`/`local` ma cztery tablice stringów: `skills`, `prompts`, `configs`, `rules`. Stringi rozwiązują się do plików:

- `skills: ["10x-tdd"]` → katalog `ai-artifacts/skills/10x-tdd/`
- `prompts: ["m3l2-ad-hoc-testing"]` → `ai-artifacts/prompts/m3l2-ad-hoc-testing.md`
- `rules: ["CLAUDE-m3l2"]` → `ai-artifacts/rules/CLAUDE-m3l2.md`
- `configs: ["..."]` → `ai-artifacts/config-templates/` (reference-only — patrz decyzja #1; nieużyte)

Lekcje **dziedziczą przez spread** poprzedniej, np.:
```ts
prompts: [...lesson01.artifacts.root.prompts, "m3l2-ad-hoc-testing"],
```

### Wzorce do naśladowania
- Wypełniona lekcja: `…/course-content/src/courses/10xdevs3/module-03/lesson-02.ts`
- Format promptu: `…/ai-artifacts/prompts/m3l2-ad-hoc-testing.md`
- Format reguły (intro → task-router table → kluczowe reguły → **Lesson boundaries** → „Paths used"): `…/ai-artifacts/rules/CLAUDE-m3l2.md`
- Schematy: `…/course-content/src/schemas/lesson.ts`

### Drafty źródłowe (treść do wyciągnięcia)
- `…/edu-platform/workbench/lessons/m3-l3/lesson-draft.md`
- `…/edu-platform/workbench/lessons/m3-l4/lesson-draft.md`
- `…/edu-platform/workbench/lessons/m3-l5/lesson-draft.md`

### Blok `get m3lX` w treści lekcji
Każda lekcja, która coś dostarcza, ma w drafcie blok pobrania paczki. Wzorzec:
> Teraz pobierz paczkę artefaktów dla tej lekcji:
> ```bash
> npx @przeprogramowani/10x-cli@latest get m3lX
> ```
> Ta paczka dostarcza `<skill/prompt/regułę>`: `...`.
>
> ✅ m3-l3 (przy `### Pierwszy hook w praktyce`) i m3-l4 (przy `### Prompt-template dla E2E`) — zrobione. m3-l5 — celowo bez bloku (brak artefaktu).

---

## m3-l4 (E2E) — ✅ ZROBIONE

Lekcja: „Testy E2E: Playwright, MCP i multimodalne scenariusze". Bez nowego skilla.

- ✅ **Prompt** → `ai-artifacts/prompts/m3l4-e2e-prompt.md`: template 1:1 z draftu (`### Prompt-template dla E2E`) + przykład 10xCards (Phase 6, „utrata fiszek po reload"). Format jak `m3l2-ad-hoc-testing.md` (pure text, bez front-mattera).
- ✅ **Reguła** → `ai-artifacts/rules/CLAUDE-m3l4.md` (wzór `CLAUDE-m3l2.md`): drzewo dostępności, CLI vs MCP + budżet tokenów (~27K/~114K) + heurystyka, blok `# E2E Testing Rules`, 5 anty-wzorców + dyscyplina re-promptu, vision jako suplement, E2E w CI, granica healera, task-router + Lesson boundaries.
- ✅ **Wiring** → `module-03/lesson-04.ts`: `import lesson03`, `prompts:[...,"m3l4-e2e-prompt"]`, `rules:["CLAUDE-m3l4"]`, summary.

## m3-l3 (Hooki) — ✅ ZROBIONE

Lekcja: „Hooki i triggery". Bez nowego skilla — reguła (hooki inline w drafcie, bez config-template — decyzja #1).

- ✅ **Reguła** → `ai-artifacts/rules/CLAUDE-m3l3.md`: cykl hooka (trigger→matcher→handler→sygnał), 3 warstwy lokalnej jakości + CI, exit codes 0/2/inny + context injection (`additionalContext`, limit 10k), tabela cross-tool (CC/Cursor/Codex/Windsurf/Copilot; Windsurf bez context injection), powiązanie z `test-plan.md`, task-router + Lesson boundaries.
- ✅ **Wiring** → `module-03/lesson-03.ts`: `import lesson02`, `configs:[]` (bez settings), `rules:["CLAUDE-m3l3"]`, summary.
- ⛔ **Config-template** — świadomie pominięty (reference-only delivery, decyzja #1). Kanon 3 hooków zostaje inline w drafcie.

## m3-l5 (Debug) — ✅ ZROBIONE (sam wiring)

Lekcja: „Debugowanie z AI". Bez nowego skilla, bez nowego artefaktu (decyzja #2).

- ✅ **Wiring** → `module-03/lesson-05.ts`: `import lesson04`, dziedziczy pełny łańcuch, `rules:[]`, summary (konwergencja dowodów, debug-as-test, swallowed errors / OWASP A10:2025, jeden workflow / cztery punkty wejścia).
- ⛔ **Reguła `CLAUDE-m3l5`** — niedostarczona (decyzja #2).
- ⛔ **Sentry MCP config** — niedostarczony (decyzja #2).

---

## Track A vs Track B (nie mylić)
- **Track A — kod demo w 10xCards** (seed/anty-wzorce/hook settings/plant buga): osobna sprawa od toolkitu. Reguły mergowania do mastera 10xCards: seed+config+reguły E2E tak; **plant buga z m3l5 (commit `f108898`/RED na gałęzi `video/m3l5-debug-prep`) NIGDY do mastera**; z m3l5 uratować tylko test `rate.invariants.integration.test.ts`. **(NIEZROBIONE — poza tym change'em.)**
- **Track B — ten plik** — artefakty dostarczane kursantowi przez toolkit. **✅ Zrobione (patrz status).**

## Worktree źródłowe (gotowce — referencja)
- Hooki (3 szt., kanon): `/Users/admin/code/10xcards-m3l3-injection/.claude/settings.json`
- Seed E2E + reguły prozą: `/Users/admin/code/10xcards-m3l4-review/tests/seed.spec.ts`, `tests/README.md`, `tests/REVIEW-NOTES.md`
