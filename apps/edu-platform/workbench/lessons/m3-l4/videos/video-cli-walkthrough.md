# Video Scenario: m3-l4 — Playwright CLI walkthrough (V2)

> **STATUS: SUPERSEDED BY TEXT (3. edycja).** Nie nagrywany w 10xDevs 3.0 — treść zastąpiona tekstem + mermaidem (sekcja „Playwright CLI jako interfejs agenta") i screenem (l.80) w `lesson-draft.md`. Zachowany jako materiał referencyjny; kandydat do nagrania w 4. edycji.

## Purpose

Give the learner a first-contact experience with Playwright CLI as an agent-browser interface. The video covers: install the CLI, open 10xCards in the browser, see the accessibility snapshot (YAML with element refs), interact via refs (`click e15`, `fill e21`), and briefly contrast with the old approach of hand-writing CSS selectors. The goal is practical familiarity — after watching, the learner should feel confident running `playwright-cli open` on their own project.

This video does NOT cover storageState (text in draft is sufficient), planner/generator (V3a), or test review (V3b).

## Prerequisites

- 10xCards running locally (`npm run dev`, `http://localhost:3000`)
- `@playwright/cli` NOT yet installed globally (so the install step is visible)
- Node.js 18+ available

## Project context

- **Repo:** 10xCards (`/Users/admin/code/10xCards`)
- **Target page for exploration:** `http://localhost:3000` (dashboard with decks, or login page if not authenticated)
- **Interactive element for the demo:** any button or form field visible on the page (e.g., "New deck" button, deck name input)

## Segment 1 — Install and open

**Format:** `live-demo`

**Goal:** Zero to browser open in under 60 seconds. Show the install is one command.

**On screen:**

- Terminal in 10xCards project root
- 10xCards running in background (`npm run dev` already done)

**Flow:**

1. Prowadzący: "Playwright CLI to narzędzie zoptymalizowane pod agentów kodujących. Instalacja: jedna komenda."
2. Run: `npm install -g @playwright/cli@latest`
3. Open the app: `playwright-cli open http://localhost:3000 --headed`
4. Browser window appears. Terminal shows the first accessibility snapshot.
5. Prowadzący: "Przeglądarka się otworzyła, a w terminalu mam snapshot — strukturalną mapę całej strony."

**Duration:** ~30 seconds.

## Segment 2 — Reading the snapshot

**Format:** `live-demo` (continues)

**Goal:** Show what the agent "sees" — the YAML snapshot with roles, names, and element refs.

**On screen:**

- Terminal with the snapshot output visible
- Browser with the corresponding page next to it (side-by-side if possible)

**Flow:**

1. Prowadzący scrolls through the snapshot: "Każdy element ma rolę — button, textbox, heading. Ma nazwę — to, co screen reader by przeczytał. I ma referencję — `e5`, `e15`, `e21`."
2. Points to a specific element, e.g.:
   ```yaml
   - button "New deck" [ref=e15]
   - textbox "Search decks" [ref=e8]
   - heading "My Decks" [ref=e3]
   ```
3. Prowadzący: "Agent nie zgaduje selektorów CSS. Nawiguje po tej mapie. Klikam `e15` — klikam przycisk 'New deck'. Deterministycznie, bez zgadywania."

**Duration:** ~45 seconds.

## Segment 3 — Interacting via element refs

**Format:** `live-demo` (continues)

**Goal:** Show the command→snapshot→command loop that the agent uses.

**On screen:**

- Terminal for commands, browser visible in background

**Flow:**

1. Prowadzący: "Zróbmy to, co agent robi automatycznie. Kliknę przycisk, wypełnię formularz."
2. Run commands:
   ```bash
   playwright-cli click e15
   ```
   Browser reacts — modal/form appears. New snapshot in terminal.
3. Read the new snapshot — find the textbox ref:
   ```bash
   playwright-cli fill e21 "Demo Deck"
   ```
   Text appears in the input field.
4. Find the submit button ref:
   ```bash
   playwright-cli click e25
   ```
   Deck created. New snapshot.
5. Prowadzący: "Trzy komendy. Każda zwraca nowy snapshot. Agent czyta snapshot, decyduje co dalej, wydaje kolejną komendę. Ta pętla jest podstawą całego E2E z agentem."
6. Optionally take a screenshot:
   ```bash
   playwright-cli screenshot
   ```
   Shows the screenshot file path.

**Duration:** ~90 seconds.

## Segment 4 — Contrast: element refs vs CSS selectors

**Format:** `voiceover` over split view or `live-demo`

**Goal:** Quick contrast that connects to seed test patterns from later in the lesson.

**On screen:**

- Side-by-side or sequential: the snapshot element `button "New deck" [ref=e15]` vs a CSS selector `div.sidebar-nav > button.btn-new-deck`

**Flow:**

1. Prowadzący: "W snapshocie: `button 'New deck'`. W starym podejściu: `div.sidebar-nav > button.btn-new-deck`. Agent widzi role i nazwy, nie klasy CSS. Dlatego seed test, który za chwilę napiszemy, używa `getByRole` — to jest to, co agent naturalnie produkuje, gdy widzi accessibility tree."
2. "A token budget? CLI zapisuje snapshoty na dysk i zwraca jednolinijkową ścieżkę. MCP przesyła pełne drzewa do kontekstu agenta. Ten sam scenariusz: CLI — dwadzieścia siedem tysięcy tokenów. MCP — sto czternaście. Mniej więcej czterokrotna różnica."

**Duration:** ~30 seconds.

## Segment 5 — Closing

**Format:** `voiceover` or `live-demo`

**Goal:** Connect to next steps — storageState and seed test.

**On screen:**

- Terminal with CLI session still open, or browser showing created deck

**Flow:**

1. Prowadzący: "Mam agenta, który widzi moją aplikację przez przeglądarkę. Następny krok: zapisuję sesję zalogowaną, żeby nie logować się na nowo w każdym teście. A potem — seed test, który pokaże agentowi, jak wygląda dobry test E2E."

**Duration:** ~15 seconds.

## Pre-production TODO

### Setup:

- [ ] 10xCards running locally with at least one existing deck (or empty dashboard — both work)
- [ ] Uninstall `@playwright/cli` if already installed globally, so the `npm install -g` step is visible
- [ ] Verify `playwright-cli open http://localhost:3000 --headed` works and shows a snapshot
- [ ] Identify the actual element refs for the demo flow (e.g., which ref is "New deck" button) — these will differ each session, so the exact `e15`, `e21` numbers are placeholders
- [ ] If 10xCards requires auth, either: (a) start on the login page and interact there, or (b) pre-authenticate so the dashboard is visible immediately

### Recording:

- [ ] Terminal font size large enough to read YAML snapshot
- [ ] Browser window visible alongside terminal (side-by-side layout)
- [ ] Total video length target: 3–4 minutes after editing
- [ ] Key frames: (a) snapshot appearing for the first time, (b) `click` command → browser reacts, (c) contrast moment (refs vs CSS)

### Risks:

- **Element refs change every session.** The exact numbers (`e15`, `e21`) are assigned dynamically. Don't memorize them — read them from the snapshot on camera. This is actually good footage: it shows the real workflow.
- **Snapshot is very long.** If the page has many elements, the snapshot may be too long to read on camera. Scroll to the relevant section and narrate: "Tu jest przycisk, tu jest formularz."
- **CLI version changes.** Command syntax is current as of 2026-05-27. Verify before recording. Core commands (`open`, `click`, `fill`, `screenshot`) are stable.
- **10xCards requires login.** If the dashboard is behind auth, start the demo on the login page — it still has interactive elements (email field, password field, submit button). Or pre-authenticate.

## Video/text alignment

- Matches draft line 73: `[VIDEO PLACEHOLDER: V2 — ...]`
- CLI installation: draft lines 41–46
- Snapshot and element refs: draft lines 15–31 (accessibility tree concept), lines 48–57 (CLI commands)
- Token budget contrast: draft lines 59–63
- Agent session integration: draft lines 67–72
- "Agent nie zgaduje selektorów CSS": draft line 31
- Contrast with hand-written selectors: sets up the seed test rationale (draft line 160)

## Claims introduced only in video

- (none) — video demonstrates CLI behavior already described in the draft

## Needs human decision

- **Start on dashboard or login page.** Dashboard is better for showing interactive elements (decks, buttons), but requires pre-auth. Login page is simpler but less visually interesting. Recommend: pre-authenticate, start on dashboard.
- **Whether to show `playwright-cli screenshot` command.** Brief, shows another capability. Recommend: include it (5 seconds, one command).
