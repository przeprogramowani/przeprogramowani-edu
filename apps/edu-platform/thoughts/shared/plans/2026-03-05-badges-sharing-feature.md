# Badges Sharing Feature Implementation Plan

## Overview

Dodajemy komendę `/badges` do terminala w grze 10x Explorers, która wyświetla odznakę rangi gracza w PreviewOverlay (iframe). Strona odznaki umożliwia udostępnienie jej na LinkedIn i Twitter. Komenda jest odblokowana po pierwszym awansie (tier 1 → tier 2).

## Current State Analysis

- Brak `/explorers/badges/` directory — do stworzenia od zera
- `cmds:badges` flaga nie istnieje nigdzie w kodzie
- `commandRegistry.ts` ma 8 komend bez `/badges`
- `commandHandler.ts` nie ma case'a dla `badges`
- `buildRankUpDialogues()` w `ranks.ts` generuje dialogi bez `onComplete` dla żadnego tiera
- `PreviewOverlay.svelte` z `allow-popups` jest gotowy
- `setFlag(game, flag)` w `flagManager.ts` to ustalony wzorzec
- `m0-study-notes.astro` to wzorzec publicznej strony zasobu w iframe (bez auth)

## Desired End State

Po wdrożeniu:
1. Gracz osiąga 100 XP → awans do "Space Scout" → wyświetla się rank-up dialogue
2. Po zakończeniu dialogu awansu tier 2 → flaga `cmds:badges` jest ustawiana automatycznie
3. W terminalu pojawia się `/badges` w `/help` output
4. Gracz wpisuje `/badges` → widzi output + klikalny link `Space Scout — pokaż odznakę`
5. Kliknięcie otwiera PreviewOverlay z iframe → `src/pages/explorers/badges/rank.astro?tier=2&name=Space+Scout&xp=250`
6. Na stronie odznaki: dark space card z rangą, XP, przyciskami LinkedIn i Twitter
7. Twitter button otwiera: `twitter.com/intent/tweet?text=Osiągam+nowy+level+w+Space+Explorers+-+Space+Scout&url=...`
8. LinkedIn button otwiera: `linkedin.com/sharing/share-offsite/?url=...`
9. Udostępniony URL jest publicznie dostępny (bez auth) i pokazuje og:image z `public/game/badges/rank-{tier}.png`

### Key Discoveries

- `src/explorers/terminal/commandRegistry.ts:7-17` — COMMAND_REGISTRY (prosty array, add entry)
- `src/explorers/terminal/commandHandler.ts:50-64` — switch(cmd) — add `case 'badges'`
- `src/explorers/terminal/commandHandler.ts:271-286` — `cmdBookmarks()` — wzorzec dla `cmdBadges()`
- `src/explorers/config/ranks.ts:105-122` — `buildRankUpDialogues()` — brak `onComplete`, tu dodajemy `setFlags`
- `src/explorers/systems/DialogueTypes.ts:9-23` — `DialogueEffect.setFlags` — obsługa przez DialogueManager
- `src/explorers/PhaserGame.svelte:174-189` — RANK_UP detection przez XP_GAINED handler
- `src/pages/explorers/resources/m0-study-notes.astro` — wzorzec standalone iframe page (dark bg, no auth)
- `src/explorers/PreviewOverlay.svelte:84` — `sandbox="allow-scripts allow-same-origin allow-popups allow-forms"`

## What We're NOT Doing

- Brak badge'ów za misje/egzaminy (v2)
- Brak dynamicznego generowania og:image (satori/wasm) — statyczne PNG
- Brak JWT/signed URL — query params wystarczą (dane kosmetyczne)
- Brak weryfikacji parametrów URL na stronie (manipulacja = oszukiwanie samego siebie)
- Brak nowych event'ów w GameEvents.ts — używamy istniejących

## Implementation Approach

Trzy niezależne fazy wdrażane inkrementalnie:
1. **Strona badge'a** — standalone Astro page, testowalna bezpośrednio w przeglądarce
2. **Komenda terminala** — rejestracja + handler + funkcja
3. **Odblokowanie flagi** — `onComplete.setFlags` w dialogu awansu tier 2

## Critical Implementation Details

### User Experience Specification

- **W grze (iframe)**: Gracz klika link w terminalu → PreviewOverlay otwiera się z tytułem "Odznaka rangi" → dark card z rangą i XP → przyciski share otwierają nową kartę (allow-popups)
- **Standalone (shared link)**: Odwiedzający widzi pełnostronicową kartę badge'a w stylu dark space → może kliknąć share buttons ponownie
- **Loading state**: PreviewOverlay fade-in via `opacity-0` na iframe dopóki nie załaduje (`on:load={() => loaded = true}`)
- **Edge case — tier 1**: `cmdBadges()` jest dostępne tylko z flagą `cmds:badges`, która ustawiana jest przy tier ≥ 2 → gracz na tier 1 nigdy nie zobaczy komendy
- **Edge case — brak PNG**: Jeśli plik `rank-{tier}.png` nie istnieje w `/public/game/badges/`, og:image po prostu nie renderuje się w social preview — graceful degradation

### Timing & Lifecycle Considerations

- **Flag set timing**: `onComplete` dialogu `rank-up-tier-2` jest wywołane po zakończeniu całej sekwencji dialogu przez `DialogueManager.applyEffects()` → flaga dostępna natychmiast po dialogu
- **Komenda vs flaga**: SmartTerminal.svelte używa `getAvailableCommands(state.flags)` — stan flags jest reaktywny (Svelte store), więc `/badges` pojawi się w `/help` natychmiast po ustawieniu flagi
- **N/A**: Brak race conditions — komenda synchroniczna, brak fetch w `cmdBadges()`

### Performance & Optimization Strategy

**N/A**: Komenda jest synchroniczna, dane z lokalnego `GameState`. Strona badge'a jest statycznym renderem SSR bez żadnych API calls.

### Debug & Observability Plan

- **Weryfikacja flagi**: W DevTools → localStorage → klucz `demoGameState` → `flags` array powinien zawierać `cmds:badges` po awansie
- **Weryfikacja komendy**: `/help` w terminalu powinien pokazywać `/badges` po ustawieniu flagi
- **Weryfikacja strony**: Otwieranie `http://localhost:3000/explorers/badges/rank?tier=2&name=Space+Scout&xp=250` bezpośrednio w przeglądarce
- **devLog**: `flagManager.ts` automatycznie loguje `[Flag] Set: cmds:badges` przez istniejący `devLog()`

---

## Phase 1: Badge Astro Page

### Overview

Tworzymy publiczną stronę `/explorers/badges/rank.astro` wyświetlającą odznakę rangi. Strona czyta parametry z URL (`tier`, `name`, `xp`), renderuje dark space card z metadanymi og: i przyciskami share. Nie wymaga auth.

### Changes Required

#### 1. Badge Astro Page

**File**: `src/pages/explorers/badges/rank.astro`
**Changes**: Nowy plik — standalone iframe-safe page

```astro
---
const tier = Number(Astro.url.searchParams.get('tier') ?? '2');
const name = Astro.url.searchParams.get('name') ?? 'Space Scout';
const xp = Number(Astro.url.searchParams.get('xp') ?? '0');

const siteUrl = import.meta.env.SITE_URL || 'https://przeprogramowani-edu.pages.dev';
const shareUrl = Astro.url.href;
const ogImage = `${siteUrl}/game/badges/rank-${tier}.png`;

const twitterText = `Osiągam nowy level w Space Explorers - ${name}`;
const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`;
const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

const tierLabels: Record<number, string> = {
  2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI', 7: 'VII'
};
const tierLabel = tierLabels[tier] ?? String(tier);
---
<!doctype html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{name} — 10x Explorers</title>
    <meta name="robots" content="noindex" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={`${name} — 10x Explorers`} />
    <meta property="og:description" content={`Osiągam nowy level w Space Explorers - ${name}! Tier ${tier}, ${xp} XP.`} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:url" content={shareUrl} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={`${name} — 10x Explorers`} />
    <meta name="twitter:description" content={`Tier ${tier} • ${xp} XP`} />
    <meta name="twitter:image" content={ogImage} />
  </head>
  <body class="bg-gray-950 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md mx-auto">
      <!-- Badge Card -->
      <div class="border border-teal-700/50 rounded-xl overflow-hidden bg-gray-900 shadow-2xl shadow-teal-900/30">

        <!-- Header bar -->
        <div class="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-teal-800/40 px-5 py-3">
          <span class="text-teal-400 font-mono text-xs tracking-widest uppercase opacity-70">
            // 10x EXPLORERS — ODZNAKA RANGI
          </span>
        </div>

        <!-- Badge content -->
        <div class="px-6 py-8 text-center">
          <div class="text-5xl mb-4">🚀</div>
          <div class="text-2xl font-mono font-bold text-white mb-1">{name}</div>
          <div class="text-teal-400 font-mono text-sm mb-4">TIER {tierLabel}</div>
          <div class="text-gray-400 font-mono text-xs">{xp} XP</div>
        </div>

        <!-- Share buttons -->
        <div class="border-t border-teal-800/40 px-5 py-4 flex gap-3">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 text-center py-2 px-3 rounded bg-gray-800 border border-gray-700 text-gray-200 font-mono text-xs hover:border-teal-600 hover:text-teal-300 transition-colors"
          >
            𝕏 Twitter
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 text-center py-2 px-3 rounded bg-gray-800 border border-gray-700 text-gray-200 font-mono text-xs hover:border-teal-600 hover:text-teal-300 transition-colors"
          >
            in LinkedIn
          </a>
        </div>
      </div>

      <!-- Branding -->
      <p class="text-center text-gray-600 font-mono text-xs mt-4">przeprogramowani.pl</p>
    </div>
  </body>
</html>

<style is:global>
  html, body { margin: 0; font-family: ui-monospace, monospace; }
</style>
```

#### 2. Static PNG Placeholders (do dostarczenia przez user)

**Paths** (pliki 16:9 do umieszczenia w repo):
```
public/game/badges/rank-2.png   — Space Scout
public/game/badges/rank-3.png   — Moon Engineer
public/game/badges/rank-4.png   — Solar Builder
public/game/badges/rank-5.png   — Stellar Explorer
public/game/badges/rank-6.png   — Cosmic Architect
public/game/badges/rank-7.png   — Deep Space Pioneer
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript kompiluje się bez błędów: `npm run build --workspace=projects/edu-platform`
- [x] Brak błędów lint: `npm run lint --workspace=projects/edu-platform`

#### Manual Verification:
- [ ] Otwórz `http://localhost:3000/explorers/badges/rank?tier=2&name=Space+Scout&xp=250` — dark card widoczny, ranga "Space Scout", Tier II, 250 XP
- [ ] Kliknij "𝕏 Twitter" → otwiera nową kartę z pre-wypełnionym tweetem "Osiągam nowy level w Space Explorers - Space Scout"
- [ ] Kliknij "in LinkedIn" → otwiera nową kartę z LinkedIn share
- [ ] Sprawdź dla `tier=7&name=Deep+Space+Pioneer&xp=5000` — strona renderuje się poprawnie
- [ ] Sprawdź `tier=1` (edge case) — strona renderuje się (og:image będzie 404, ale strona OK)

**Implementation Note**: Po ukończeniu tej fazy i pozytywnej weryfikacji manualnej, zatrzymaj się i potwierdź przed przejściem do Phase 2.

---

## Phase 2: Terminal Command `/badges`

### Overview

Rejestrujemy komendę `/badges` w systemie terminala. Po wywołaniu zwraca interactive item z linkiem do strony badge'a (otwiera PreviewOverlay). Komenda wymaga flagi `cmds:badges` (ustawianej w Phase 3).

### Changes Required

#### 1. Command Registry

**File**: `src/explorers/terminal/commandRegistry.ts`
**Changes**: Dodaj wpis `/badges` przed zamknięciem array'a

```typescript
// src/explorers/terminal/commandRegistry.ts:7-17
export const COMMAND_REGISTRY: CommandEntry[] = [
  { name: 'me', description: 'Status Astronauty' },
  { name: 'time', description: 'Chronometr pokładowy' },
  { name: 'bookmarks', description: 'Zakładki i zasoby', requiredFlag: 'cmds:bookmarks' },
  { name: 'quest', description: 'Briefing misji', requiredFlag: 'cmds:quest' },
  { name: 'solve', description: 'Odpowiedź na misję', requiredFlag: 'cmds:quest' },
  { name: 'hint', description: 'Wskazówka do misji', requiredFlag: 'cmds:quest' },
  { name: 'navi', description: 'Etapy podróży', requiredFlag: 'cmds:navi' },
  { name: 'support', description: 'Łączność z HQ', requiredFlag: 'cmds:support' },
  { name: 'badges', description: 'Odznaka rangi', requiredFlag: 'cmds:badges' }, // <-- nowe
];
```

#### 2. Command Handler

**File**: `src/explorers/terminal/commandHandler.ts`
**Changes A**: Dodaj case w switch (po `case 'support'`, przed `default`)

```typescript
// Po linii ~63 (case 'support')
case 'badges':
  return cmdBadges(state);
```

**Changes B**: Dodaj funkcję `cmdBadges()` na końcu pliku (po `cmdSupport`)

```typescript
function cmdBadges(state: GameState): CommandResult {
  const { rank } = getRankForXP(state.xp);
  const url = `/explorers/badges/rank?tier=${rank.tier}&name=${encodeURIComponent(rank.name)}&xp=${state.xp}`;

  return {
    output: ['ODZNAKA RANGI', '═════════════════════════════', ''],
    interactive: [
      {
        label: `  ${rank.name} — pokaż odznakę`,
        action: { type: 'preview' as const, url, title: 'Odznaka rangi' },
      },
    ],
  };
}
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript kompiluje się bez błędów: `npm run build --workspace=projects/edu-platform`
- [x] Brak błędów lint: `npm run lint --workspace=projects/edu-platform`

#### Manual Verification:
- [ ] Tymczasowo ustaw flagę `cmds:badges` ręcznie w localStorage (lub przez DevTools): `JSON.parse(localStorage.getItem('demoGameState')).flags.push('cmds:badges')` i odśwież — `/badges` pojawia się w `/help`
- [ ] Wpisz `/badges` → widzisz output z "ODZNAKA RANGI" i klikalny link z aktualną rangą
- [ ] Kliknij link → PreviewOverlay otwiera się z iframe wyświetlającym stronę badge'a
- [ ] Tytał overlay to "Odznaka rangi"
- [ ] Escape zamyka overlay
- [ ] Usuń tymczasową flagę po testach

**Implementation Note**: Po ukończeniu tej fazy i pozytywnej weryfikacji manualnej, zatrzymaj się i potwierdź przed przejściem do Phase 3.

---

## Phase 3: Flag Unlock on Rank-Up

### Overview

Modyfikujemy `buildRankUpDialogues()` w `ranks.ts` tak, by dialog awansu do tier 2 ustawiał flagę `cmds:badges` po zakończeniu. Spójne z wzorcem jak `cmds:bookmarks` / `cmds:quest` / `cmds:support` są ustawiane przez `onComplete.setFlags`.

### Changes Required

#### 1. Rank-Up Dialogue for Tier 2

**File**: `src/explorers/config/ranks.ts`
**Changes**: W `buildRankUpDialogues()` dodaj `onComplete` dla tier 2

```typescript
// src/explorers/config/ranks.ts — buildRankUpDialogues()
export function buildRankUpDialogues(): Record<string, DialogueSequence> {
  const dialogues: Record<string, DialogueSequence> = {};

  for (const rank of RANKS) {
    if (rank.tier === 1) continue;

    const id = getRankUpDialogueId(rank.tier);
    dialogues[id] = {
      id,
      lines: [
        { speaker: 'system', text: '═══ AWANS ═══', mode: 'system', autoAdvance: 2000 },
        { speaker: 'system', text: `Nowa ranga: ${rank.name}`, mode: 'system', autoAdvance: 2500 },
        { speaker: 'system', text: RANK_FLAVOR[rank.tier] ?? '', mode: 'system', autoAdvance: 2500 },
      ],
      // Unlock /badges command on first rank-up
      ...(rank.tier === 2 ? { onComplete: { setFlags: ['cmds:badges'] } } : {}),
    };
  }

  return dialogues;
}
```

### Success Criteria

#### Automated Verification:
- [x] TypeScript kompiluje się bez błędów: `npm run build --workspace=projects/edu-platform`
- [x] Brak błędów lint: `npm run lint --workspace=projects/edu-platform`

#### Manual Verification:
- [ ] Zresetuj stan gry do tier 1 (0 XP)
- [ ] Zdobądź 100 XP (przez quest/exam) → pojawia się rank-up dialogue z "Nowa ranga: Space Scout"
- [ ] Po zakończeniu dialogu: sprawdź localStorage — `flags` zawiera `cmds:badges`
- [ ] Wpisz `/help` — `/badges` jest widoczne na liście komend
- [ ] Wpisz `/badges` — działa poprawnie, otwiera PreviewOverlay

**Implementation Note**: Po ukończeniu tej fazy wykonaj pełny end-to-end test (Phase 3 Manual Verification). To jest ostatnia faza — po pozytywnej weryfikacji feature jest kompletny.

---

## Testing Strategy

### Manual Testing — Full E2E:
1. Zacznij z czystym stanem gry (tier 1, 0 XP)
2. Sprawdź że `/badges` **nie ma** w `/help` output
3. Zdobądź 100+ XP → dialog awansu "Space Scout" wyświetla się i auto-zamyka
4. Sprawdź `/help` — `/badges` **jest** widoczne
5. Wpisz `/badges` → widać "ODZNAKA RANGI" + link "Space Scout — pokaż odznakę"
6. Kliknij link → PreviewOverlay z iframe
7. Na stronie: ranga, tier, XP + przyciski LinkedIn i Twitter
8. Kliknij Twitter → nowa karta z pre-wypełnionym tweetem "Osiągam nowy level w Space Explorers - Space Scout"
9. Kliknij LinkedIn → nowa karta z LinkedIn sharer
10. Zamknij overlay (Escape lub X)
11. Po dalszych awansach (tier 3+): `/badges` nadal działa, pokazuje aktualną rangę

### Edge Cases:
- Tier 7 (Deep Space Pioneer) — badge page renderuje się, twitter text OK
- Szybkie wielokrotne klikanie linku — PreviewOverlay obsługuje to poprawnie (nadpisuje URL)
- User otwiera shared URL bezpośrednio (bez gry) — strona renderuje się standalone

## Performance Considerations

Brak implikacji — `cmdBadges()` jest synchroniczne i nie wykonuje żadnych fetch calls. Strona badge'a jest renderowana server-side przez Astro SSR bez dodatkowych API calls.

## References

- Research: `thoughts/shared/research/2026-03-05-badges-sharing-feature.md`
- Pattern: `src/explorers/terminal/commandHandler.ts:271-286` (cmdBookmarks)
- Pattern: `src/pages/explorers/resources/m0-study-notes.astro` (standalone iframe page)
- Pattern: `src/explorers/levels/m0-exam-room/dialogues.ts` (setFlags in onComplete)
- Rank config: `src/explorers/config/ranks.ts:9-17` (7 tierów)
- Flag system: `src/explorers/state/flagManager.ts` (setFlag)
