# M0 Exam Room Resource Page Implementation Plan

## Overview

Create a public static resource page at `/explorers/resources/m0-study-notes` that consolidates
study material for all three m0 exam topics (LLM basics, prompt engineering, tokenization). Wire it
into the study board dialogue by replacing the current Circle.so external lesson URL.

## Current State Analysis

The study board interaction (`m0-study-notes-board` dialogue, `src/explorers/levels/m0-exam-room/dialogues.ts:18-24`)
currently points to `/external/10xdevs-2/2580638` — a Circle.so lesson fetched and auth-gated via
the platform's external lesson pipeline. This URL is loaded in the `PreviewOverlay` iframe.

**The current flow:**
1. Player interacts with `study-notes-board` zone
2. `m0-study-notes-board` dialogue runs → `onComplete.addBookmark` fires
3. `BookmarkManager` emits `PREVIEW_SHOW` with `url: '/external/10xdevs-2/2580638'`
4. `PreviewOverlay.svelte` opens an iframe pointing to that Circle.so URL

No pages exist under `src/pages/explorers/`.

## Desired End State

- `src/pages/explorers/resources/m0-study-notes.astro` is a working public page accessible at `/explorers/resources/m0-study-notes`
- `src/content/resources/m0-study-notes.md` holds the human-editable study content (markdown)
- The page renders cleanly in the `PreviewOverlay` iframe (dark theme, scrollable, no navigation chrome)
- Both dialogue entries in `dialogues.ts` point to the new URL
- Existing exam mechanics, quest logic, and flags are untouched

### Verification:
1. Open the game at `/explorers`, enter the exam room, interact with the study board
2. The PreviewOverlay should open and display the new resource page with study notes
3. Visiting `/explorers/resources/m0-study-notes` directly in the browser should render the full page correctly (no auth wall)
4. Content can be edited by changing only `src/content/resources/m0-study-notes.md`

## Key Discoveries

- `DialogueEffect.addBookmark` (`src/explorers/systems/DialogueTypes.ts:21`) triggers `BookmarkManager` which emits `PREVIEW_SHOW` with the given URL
- `PreviewOverlay.svelte` opens that URL in an iframe with `sandbox="allow-scripts allow-same-origin allow-popups allow-forms"` (`src/explorers/PreviewOverlay.svelte:84`)
- The sandbox **requires `allow-same-origin`** so the resource page must be served from the same origin — a local Astro page satisfies this perfectly
- Astro supports direct `.md` file imports: `import Content from '../../content/resources/m0-study-notes.md'` — the default export is a renderable component. No content collection registration needed.
- The `checklists` collection uses `type: 'content'` markdown, but for a single static resource, a direct import is simpler and avoids changes to `src/content.config.ts`

## What We're NOT Doing

- Not creating separate pages per exam topic (combined page chosen)
- Not requiring auth (public page)
- Not modifying exam logic, quests, flags, or rewards
- Not changing how the PreviewOverlay works
- Not adding the resource to content collections (direct markdown import is sufficient)
- Not linking individual exam zones to the resource (only the study board)

## Critical Implementation Details

### Timing & Lifecycle Considerations

**N/A**: Static SSR page, no lifecycle concerns. The iframe loads the page normally.

### User Experience Specification

- **In-game**: the page appears inside the `PreviewOverlay` iframe (fixed inset-4, ~95% of viewport)
- **Styling goal**: dark theme matching the game aesthetic (`bg-gray-950` background, `text-gray-100`, Tailwind `prose prose-invert`)
- **No navigation chrome**: no sidebar, no top bar — just title + scrollable content
- **Padding**: enough padding (p-6 or p-8) so content doesn't touch iframe edges
- **iframe renders white until loaded**: the overlay already handles `opacity-0` until `load` event — no special handling needed in the page itself

### Performance & Optimization Strategy

**N/A**: Static page, no dynamic data fetching. SSR output just returns the pre-rendered HTML.

### State Management Sequencing

**N/A**: No client-side state.

### Debug & Observability Plan

- Navigate to `/explorers/resources/m0-study-notes` directly in browser to verify content and styling
- Open game, interact with study board, confirm PreviewOverlay loads the new URL (check Network tab for the iframe request)

---

## Phase 1: Create the Markdown Content File

### Overview

Create the human-editable study notes markdown file covering all three exam topics.
Placing it under `src/content/resources/` keeps content co-located with other content files.

### Changes Required

#### 1. Directory + file

**File**: `src/content/resources/m0-study-notes.md`

```markdown
# Notatki szkoleniowe — Weryfikacja pamięci

Materiały powtórkowe przed egzaminami weryfikacyjnymi w Sali Egzaminacyjnej.

---

## Moduł 1 – Fundamenty LLM

### Co to jest LLM?

**LLM** (Large Language Model) to duży model językowy — sieć neuronowa wytrenowana na ogromnych
zbiorach danych tekstowych. Modele takie jak GPT, Claude czy Gemini uczą się wzorców języka przez
przewidywanie kolejnego tokenu w tekście.

### Proces trenowania

Trenowanie polega na ekspozycji modelu na miliardy fragmentów tekstu. Model minimalizuje błąd
przewidywania następnego słowa. Nie programujemy reguł gramatycznych ręcznie — model sam je odkrywa.

### Halucynacje

**Halucynacja** to zjawisko, w którym model generuje przekonująco brzmiące, ale nieprawdziwe
informacje. Wynika z tego, że model optymalizuje spójność tekstu, a nie jego prawdziwość. Zawsze
weryfikuj odpowiedzi LLM w krytycznych zastosowaniach.

---

## Moduł 2 – Prompt Engineering

### System prompt

**System prompt** to instrukcja definiująca zachowanie i rolę modelu AI przed właściwą rozmową.
Określa ton, zakres tematyczny i ograniczenia. Użytkownik zazwyczaj go nie widzi.

### Few-shot prompting

**Few-shot prompting** polega na podaniu modelowi kilku przykładów wejście→wyjście przed właściwym
zadaniem. Dzięki temu model rozumie oczekiwany format i styl odpowiedzi bez dodatkowego trenowania.

```
Przykład:
Q: Stolica Francji? A: Paryż
Q: Stolica Niemiec? A: Berlin
Q: Stolica Polski? A: ...
```

### Temperature

**Temperature** (temperatura) to parametr kontrolujący losowość odpowiedzi:
- `0.0` — deterministyczne, powtarzalne odpowiedzi
- `1.0` — standardowa kreatywność
- `> 1.0` — duża losowość, ryzyko niespójności

Niska temperatura = precyzja. Wysoka temperatura = kreatywność.

---

## Moduł 3 – Tokenizacja

### Co to jest token?

**Token** to podstawowa jednostka tekstu przetwarzana przez model — może to być całe słowo, część
słowa lub pojedynczy znak. Modele nie "widzą" liter — widzą sekwencje tokenów.

Przykład: słowo „tokenizacja" może być rozbite na `token` + `izacja`.

### Context window

**Context window** (okno kontekstowe) to maksymalna liczba tokenów, które model może przetworzyć
w jednym wywołaniu (wejście + wyjście łącznie). Po przekroczeniu limitu model nie może "pamiętać"
wcześniejszych części rozmowy.

Typowe rozmiary: GPT-4 ~128k tokenów, Claude ~200k tokenów.

### Nieznane słowa

Tokenizer radzi sobie z nieznanymi słowami przez **subword tokenization** — rozbija je na mniejsze,
znane fragmenty. Rzadkie słowa, nazwy własne i neologizmy są dzielone na kilka tokenów.
```

### Success Criteria

#### Automated Verification:
- [x] File exists at `src/content/resources/m0-study-notes.md`
- [x] File is valid UTF-8 markdown

#### Manual Verification:
- [ ] Content covers all three exam topics with correct answers matching the exam questions in `exams.ts`

---

## Phase 2: Create the Astro Resource Page

### Overview

Create the public Astro page that imports and renders the markdown file. Styled for iframe display.

### Changes Required

#### 1. The page

**File**: `src/pages/explorers/resources/m0-study-notes.astro`

```astro
---
import { Content } from '../../content/resources/m0-study-notes.md';
---

<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Notatki szkoleniowe</title>
    <link rel="stylesheet" href="/styles/highlight-github-dark.min.css" />
  </head>
  <body class="bg-gray-950 text-gray-100 min-h-screen">
    <div class="max-w-2xl mx-auto px-6 py-8">
      <article class="prose prose-invert prose-sm max-w-none">
        <Content />
      </article>
    </div>
  </body>
</html>

<style is:global>
  html, body {
    margin: 0;
    font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  }
  .bg-gray-950 { background-color: rgb(3 7 18); }
  code {
    font-size: 0.85em;
  }
</style>
```

**Note**: `Content` (named export) is used instead of the default export component to avoid Astro
wrapping issues. Alternatively, if only the default export works: `import Content from '...'`.

### Success Criteria

#### Automated Verification:
- [x] `npm run build` completes without errors (TypeScript + Astro build)
- [ ] Page is reachable at `/explorers/resources/m0-study-notes` during `npm run dev`

#### Manual Verification:
- [ ] Page renders with dark background and prose-formatted markdown content
- [ ] Page loads cleanly when set as iframe src in a test HTML file
- [ ] All three exam topic sections are visible and readable

---

## Phase 3: Update Dialogue to Use New URL

### Overview

Replace the Circle.so bookmark URL in both study board dialogue entries with the new local URL.

### Changes Required

#### 1. `dialogues.ts` — study board (first visit)

**File**: `src/explorers/levels/m0-exam-room/dialogues.ts`

Change `url` in `m0-study-notes-board.onComplete.addBookmark` (line 20):
```ts
// Before:
url: '/external/10xdevs-2/2580638',
// After:
url: '/explorers/resources/m0-study-notes',
```

Also update `title` to something descriptive:
```ts
title: 'Notatki szkoleniowe',
```
(already set — no change needed)

#### 2. `dialogues.ts` — study board (revisit)

Change `url` in `m0-study-notes-board-revisit.onComplete.addBookmark` (line 47):
```ts
// Before:
url: '/external/10xdevs-2/2580638',
// After:
url: '/explorers/resources/m0-study-notes',
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript type checking passes: `npx tsc --noEmit` (pre-existing errors only, none introduced)

#### Manual Verification:
- [ ] In the game, interacting with the study board for the first time opens the new resource page in the PreviewOverlay
- [ ] After closing the overlay, the `m0-bookmarks-unlocked` follow-up dialogue fires correctly
- [ ] Revisiting the study board (after `cmds:bookmarks` flag is set) also opens the new resource page
- [ ] The `/bookmarks` terminal command still works (bookmark URL is now the new resource page)

---

## Testing Strategy

### Manual Testing Steps

1. Start dev server: `npm run dev`
2. Visit `/explorers/resources/m0-study-notes` directly — verify dark-themed prose content, no auth wall
3. Open the game at `/explorers`
4. Enter the exam room and interact with the study board zone
5. Confirm the PreviewOverlay opens with the new resource page (check browser Network tab — should see a request to `/explorers/resources/m0-study-notes`)
6. Close the overlay, confirm `m0-bookmarks-unlocked` dialogue fires
7. Use `/bookmarks` terminal command, confirm bookmarked URL opens the resource page
8. Interact with the study board again (revisit variant), confirm it reopens the resource page

## References

- `src/explorers/levels/m0-exam-room/dialogues.ts` — dialogue with URLs to update
- `src/explorers/systems/DialogueTypes.ts:21` — `addBookmark` effect definition
- `src/explorers/PreviewOverlay.svelte:79-87` — iframe with sandbox attributes
- `src/explorers/levels/m0-exam-room/exams.ts` — exam questions (used to verify content accuracy)
