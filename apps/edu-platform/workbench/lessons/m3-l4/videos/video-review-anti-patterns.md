# Video Scenario: m3-l4 — Review + re-prompting testu E2E (V3b)

## Purpose

Show the learner the full review-and-fix loop for an agent-generated E2E test. A single test file contains three anti-patterns hidden in passing code: a hallucinated assertion, CSS selectors, and `waitForTimeout`. The video walks through each one — names it, explains why it doesn't protect the risk — then sends a single compound re-prompt to the agent. The agent fixes the test. The learner verifies the result against the seed test.

This is the lesson's core behavioral-change moment: from "test passes → done" to "test passes → review → re-prompt → verify → then done." It mirrors m3-l2's Ścieżka A video (prompt → bad output → re-prompt → fixed output) but at the E2E layer.

This video does NOT show the planner→generator workflow (that's V3a). It starts with a finished test file already on screen.

## Prerequisites

- Local Supabase running (`npx supabase start`) — auth + DB on `127.0.0.1:54321`
- Seeded test user + `.env` with `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SECRET_KEY`
- Chromium installed (`npx playwright install chromium`) and `storageState` saved (`auth.setup.ts` runs first)
- The prepared "bad" and "fixed" test files already on disk (see Segment 1)
- `seed.spec.ts` visible in the project for reference
- Claude Code (or Cursor) ready for the re-prompting segment

> **Verified 2026-05-31:** full dry-run green — `auth.setup`, bad spec, fixed spec, and `seed.spec` all pass (4/4). Environment is recording-ready in the worktree.

## Project context

- **Repo / recording location:** `10xcards-m3l4-review` worktree (`/Users/admin/code/10xcards-m3l4-review`, branch `video/m3l4-review-prep`)
- **Bad test file:** `tests/generated-flashcard-persistence.spec.ts` — pre-written, green, three anti-patterns baked in
- **Fixed test file:** `tests/generated-flashcard-persistence.fixed.spec.ts` — the re-prompt end product (fallback if the live agent loop misfires)
- **Seed test:** `tests/seed.spec.ts` — the quality reference from the draft
- **Risk being tested:** "utrata fiszek po odświeżeniu strony" from `context/foundation/test-plan.md` Phase 6

> **Reality vs. the original script (read `tests/REVIEW-NOTES.md` + `tests/README.md`).** The real 10xCards is **Polish** and has **no manual deck/card creation** — cards come only from AI generation. So the bad test **seeds a card directly** via `helpers/seed-deck.ts` and tests persistence on `/deck`, instead of creating one through the UI. All selectors below are real-DOM-accurate.

## Segment 1 — The "passing" test

**Format:** `live-demo`

**Goal:** Show a test that passes but is broken in three ways. Establish the false confidence problem — and frame honestly *why* an agent can still emit this despite seed + rules (more so with weaker models), so the example reads as motivation for review, not as an indictment of the flow.

**On screen:**

- Editor with `tests/generated-flashcard-persistence.spec.ts` open
- Terminal ready to run tests

**The bad test file (already on disk — `tests/generated-flashcard-persistence.spec.ts`):**

```typescript
import { test, expect } from "@playwright/test";
import { seedFlashcard, deleteFlashcard } from "./helpers/seed-deck";

test("flashcard persistence after reload", async ({ page }) => {
  // Real app has no manual add-card UI (cards come from AI generation),
  // so seed one row directly to stand in for a generated card.
  const card = await seedFlashcard(`Bad test card ${Date.now()}`, "A runtime check that narrows a type.");

  try {
    await page.goto("/deck");

    // Hardcoded wait — "works on my laptop", flaky in slower CI.
    await page.waitForTimeout(2000);

    // CSS selectors — coupled to styling classes, not to roles/text.
    await page.locator("div.whitespace-pre-wrap.text-foreground").first().waitFor();
    await page.locator("button.text-sm").first().waitFor();

    await page.waitForTimeout(1000);

    await page.reload();

    await page.waitForTimeout(2000);

    // HALLUCINATED ASSERTION: only checks the static page heading. True
    // regardless of whether the seeded card survived the reload — so the test
    // passes even if Risk #1 (data loss) materializes.
    await expect(page.locator("h1.font-bold").first()).toBeVisible();
  } finally {
    await deleteFlashcard(card.id);
  }
});
```

**Flow:**

1. Prowadzący opens the test file: "Agent wygenerował test dla ryzyka z test-plan.md Phase 6: czy fiszka przetrwa odświeżenie strony. Test seeduje fiszkę bezpośrednio, bo w 10xCards fiszki powstają z generacji AI, nie z ręcznego dodawania. Uruchommy go."
2. Run the test: `npx playwright test generated-flashcard-persistence`. Test passes.
3. Prowadzący: "Zielone. Ale zanim wrzucimy do suite'a — review."
4. **Framing (powiedz to — żeby przykład nie czytał się jak atak na własny flow):** "Można zapytać: mamy przecież seed test i reguły E2E, czemu w ogóle oglądamy zły test? Bo seed i reguły *zmniejszają* ryzyko anty-wzorców, ale go nie *zerują*. Agent optymalizuje na 'zielone teraz', nie 'stabilne jutro' — i im słabszy model, tym częściej coś takiego przepuści mimo kontroli. To jest przykład dokładnie takiego przypadku. Dlatego review i re-prompt to nie dodatek, tylko trzecia warstwa jakości — i właśnie ją zaraz pokażę."

**Duration:** ~60 seconds (with the framing beat).

## Segment 2 — Identifying all three anti-patterns

**Format:** `live-demo` (continues)

**Goal:** Walk through the test top-to-bottom, naming each anti-pattern and explaining why it fails to protect the risk. Do NOT fix anything yet — this is the review pass.

**On screen:**

- Same file, prowadzący scrolls through it

**Flow:**

1. Prowadzący starts at the top: "Przejdę test od góry. Pytanie kontrolne przy każdym fragmencie: czy to padnie, jeśli ryzyko się zmaterializuje?"

2. **CSS selectors (top of file).** Prowadzący highlights `div.whitespace-pre-wrap.text-foreground`: "Pierwszy problem. Kruche selektory CSS. `div.whitespace-pre-wrap.text-foreground`, `button.text-sm`, a na dole `h1.font-bold`. To klasy stylowania — łamią się przy dowolnym restyle albo refaktorze layoutu. Fałszywa awaria niezwiązana z ryzykiem. Seed test używa `getByRole` i `getByText`."

3. **waitForTimeout (middle).** Prowadzący highlights `waitForTimeout(2000)`: "Drugi problem. Trzy hardcoded waity: dwa, jeden, dwa sekundy. Przechodzi na moim laptopie. W CI, gdzie backend jest wolniejszy? Flaky test. Playwright ma auto-retry w asercjach — nie potrzebujemy manualnego czekania."

4. **Hallucinated / insufficient assertion (bottom).** Prowadzący highlights `expect(page.locator("h1.font-bold").first()).toBeVisible()`: "Trzeci i najgorszy. Jedyna asercja sprawdza statyczny nagłówek strony — 'Twoja talia'. Ten nagłówek jest zawsze, niezależnie od tego, czy seedowana fiszka przetrwała reload. Treść fiszki nie jest sprawdzana ani razu. Ten test przepuści nasz Risk #1 — utratę fiszek — bez mrugnięcia okiem."

5. Brief summary: "Trzy problemy, test przechodzi. Zamiast naprawiać ręcznie — re-promptuję agenta."

**Duration:** ~90 seconds.

## Segment 3 — Compound re-prompt

**Format:** `live-demo` (continues)

**Goal:** Send a single re-prompt to the agent that names all three anti-patterns with their fixes. This demonstrates the re-prompting pattern from the draft.

**On screen:**

- Claude Code (or Cursor) prompt input
- The bad test file visible

**The re-prompt (adapted to the real selectors — kept in sync with `tests/REVIEW-NOTES.md`):**

```text
Review tests/generated-flashcard-persistence.spec.ts. It is green but broken
three ways. Fix all three in one pass, following tests/seed.spec.ts:

1. HALLUCINATED ASSERTION: the only assertion checks the static "Twoja talia"
   heading (h1.font-bold). It passes even if the seeded card disappears after
   reload — exactly the risk we want to catch (utrata fiszek po odświeżeniu).
   Replace it with an assertion that the seeded card's front text is visible
   after page.reload(), using getByText(marker, { exact: true }) (exact, because
   the marker also appears in the island's hydration payload).

2. CSS SELECTORS: every locator is a styling class
   (div.whitespace-pre-wrap.text-foreground, button.text-sm, h1.font-bold).
   These break on any restyle. Replace with role/text locators:
   getByRole('heading', { name: 'Twoja talia' }) and getByText(...) — match
   seed.spec.ts.

3. HARDCODED WAITS: three waitForTimeout calls. Replace with web-first
   assertions (toBeVisible) and waitForResponse around the reload.

Also: use a unique Date.now() marker in the seeded card for isolation, and
clean up the seeded row in a finally block. Rename the test to
'flashcard data persists after page reload'.
```

**Flow:**

1. Prowadzący: "Jeden re-prompt, trzy problemy. Każdy wymieniony z nazwy, z uzasadnieniem dlaczego nie chroni ryzyka i z wzorcem docelowym."
2. Prowadzący sends the re-prompt. Agent starts working.
3. Brief wait (5-10 seconds). If the agent takes longer, voice-over: "Agent czyta test, seed test i reguły E2E z CLAUDE.md."
4. Agent produces the fixed file.

**Duration:** ~60 seconds (including agent response time).

**Fallback:** If the agent produces a poor fix or takes too long, cut to the pre-prepared fixed file. Say: "Agent wyprodukował poprawkę, zweryfikujmy ją."

## Segment 4 — Verify the fix against seed test

**Format:** `live-demo` (continues)

**Goal:** Compare the agent's fix with the seed test. Verify the fix actually addresses all three issues. Run the fixed test.

**On screen:**

- Agent's fixed test file in editor
- `seed.spec.ts` side-by-side (or briefly shown)

**Expected fixed test (already on disk as `…fixed.spec.ts`; agent should produce something close):**

```typescript
import { test, expect } from "@playwright/test";
import { seedFlashcard, deleteFlashcard } from "./helpers/seed-deck";

test("flashcard data persists after page reload", async ({ page }) => {
  const marker = `Fixed test card ${Date.now()}`;
  const card = await seedFlashcard(marker, "A runtime check that narrows a type.");

  try {
    await page.goto("/deck");

    await expect(page.getByRole("heading", { name: "Twoja talia" })).toBeVisible();

    // exact: true — the marker also appears in the island's hydration payload.
    await expect(page.getByText(marker, { exact: true })).toBeVisible();

    // The actual risk: does the data survive a full reload?
    await Promise.all([page.waitForResponse((res) => res.url().includes("/deck") && res.ok()), page.reload()]);

    await expect(page.getByText(marker, { exact: true })).toBeVisible();
  } finally {
    await deleteFlashcard(card.id);
  }
});
```

**Flow:**

1. Prowadzący reviews the agent's output: "Sprawdzam poprawkę. Selektory — `getByRole` i `getByText` zamiast klas CSS. Waity — `toBeVisible()` i `waitForResponse()` wokół reloadu zamiast timeoutów. Asercja — sprawdza treść seedowanej fiszki **po** reload, z unikalnym markerem `Date.now()`. Cleanup w `finally` przez helper."
2. Quick flash of `seed.spec.ts`: "Ten sam wzorzec co w seed teście. Seed kształtuje output, review łapie to, co się prześlizgnie, re-prompt naprawia."
3. Run the fixed test: `npx playwright test generated-flashcard-persistence`. Test passes.
4. Closing: "Dwie minuty review, jeden re-prompt. Różnica między testem, który wygląda na zielony, a testem, który naprawdę chroni system."

**Duration:** ~60 seconds.

## Pre-production TODO

### Setup (status 2026-05-31):

- [x] "Bad" test file written with all three anti-patterns — `tests/generated-flashcard-persistence.spec.ts`
- [x] Bad test passes against the running app (real-DOM CSS classes) — verified green in dry-run
- [x] Expected fixed version written and verified green — `tests/generated-flashcard-persistence.fixed.spec.ts`
- [x] `seed.spec.ts` in the project — verified green
- [x] `storageState` configured (`auth.setup.ts` → `playwright/.auth/user.json`) — verified
- [x] Local Supabase running, `.env` + chromium present — verified
- [ ] **Live re-prompt dry-run** — only the *file-level* output is pre-verified (the corrected file is authored, not produced by a live loop). Before recording, optionally send the compound re-prompt to Claude Code once to confirm it lands close to `…fixed.spec.ts`; otherwise record with the live re-prompt and cut to the pre-written fixed file per the fallback.
- [x] Pre-written fixed file ready as fallback

### Recording:

- [ ] Editor font size large enough to read both the re-prompt and the code
- [ ] Claude Code visible alongside the editor — the re-prompt input and agent response must be readable
- [ ] Total video length target: 4–5 minutes after editing
- [ ] Key frames to bookmark: (a) green test with bad assertions, (b) identifying the three problems, (c) the re-prompt being sent, (d) agent's response appearing, (e) comparison with seed test, (f) green test with good assertions

### Risks:

- ~~CSS selectors in bad test don't match actual DOM~~ — **resolved**: classes taken from the running app (`DeckBrowser.tsx` / `PageHeader.astro`); bad test verified green.
- ~~Fixed test fails on role selectors~~ — **resolved**: `getByRole('heading', { name: 'Twoja talia' })` + `getByText(marker, { exact: true })` verified green.
- **Supabase not running / `.env` missing.** The whole suite needs local Supabase up and `.env` keys present. If `auth.setup` fails, nothing downstream runs. Check `npx supabase start` before recording.
- **Agent produces a different fix than expected.** That's fine — the review in Segment 4 handles it. If the agent introduces NEW anti-patterns, that's even better footage: "Agent naprawił dwa z trzech problemów. Trzeci re-promptuję ponownie." But this extends the video, so prefer a clean dry run.
- **Agent takes too long.** If response time exceeds 15 seconds, cut to the pre-prepared fix. Brief voice-over: "Agent wyprodukował poprawkę."
- **Agent modifies other files.** Unlikely with a scoped re-prompt, but if it does, undo and re-focus: "Tylko ten plik."

## Video/text alignment

- Matches draft V3b placeholder (after anti-patterns section, before data isolation)
- Segment 1 framing ("seed + rules reduce but don't eliminate; weaker models slip more") anchors to draft line 315 ("Co jeśli agent **mimo to** wyprodukuje kruchy test?") and line 336 ("To nie jest wada konkretnego narzędzia. To fundamentalna cecha generowania kodu przez LLM"). Not a new claim — the three-layer model (seed shapes → rules constrain → review catches) is the draft's thesis (line 11).
- Anti-pattern identification: draft "Pięć anti-wzorców E2E od agenta" section
- Re-prompting approach: draft "Re-prompting: jak poprawić test E2E" section — video demonstrates the compound version of the three individual re-prompts shown in text
- Review question "czy ta asercja padnie...": draft line ~296
- Seed test comparison: draft "Seed test i reguły jakości" section
- Mirrors m3-l2 Ścieżka A video: prompt → bad output → review → re-prompt → fixed output → commit

## Claims introduced only in video

- Compound re-prompt (all three fixes in one message) — the draft shows individual re-prompts. The video demonstrates that you CAN batch them. Not a new claim, just a practical variation.

## Needs human decision

- ~~Exact CSS class names for the bad test~~ — **resolved**: real classes locked in (`div.whitespace-pre-wrap.text-foreground`, `button.text-sm`, `h1.font-bold`).
- **Whether to show the test running BEFORE and AFTER.** Showing both (bad test green → fixed test green) reinforces false confidence. Recommend: show both — it costs 20 seconds and the contrast is powerful.
- **Whether to show the re-prompt being typed or pre-pasted.** Pre-pasted is faster and more realistic (you'd prepare a re-prompt template). Typing is more organic but slower. Recommend: pre-paste, brief comment: "Mam przygotowany re-prompt z trzema poprawkami."
