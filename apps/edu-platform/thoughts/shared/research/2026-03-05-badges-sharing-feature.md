---
date: 2026-03-05T00:00:00+01:00
researcher: Claude Sonnet 4.6
git_commit: c23406d2
branch: master
repository: przeprogramowani-sites
topic: "Badges/Achievement sharing feature - /badges terminal command"
tags: [research, game, explorers, terminal, badges, achievements, rank, sharing]
status: complete
last_updated: 2026-03-05
last_updated_by: Claude Sonnet 4.6
last_updated_note: "Decisions confirmed: PNG-style card in iframe, LinkedIn+Twitter share buttons, rank badge only for now"
---

# Research: Badges/Achievement Sharing Feature — `/badges` Terminal Command

**Date**: 2026-03-05
**Researcher**: Claude Sonnet 4.6
**Git Commit**: c23406d2
**Branch**: master
**Repository**: przeprogramowani-sites

## Research Question

Chcę wprowadzić możliwość udostępniania postępów z gry lub achievementów na zewnątrz, w formie grafik (static assets wyświetlane w określonym momencie). Mamy już mechanizm otwierania zewnętrznej strony in-game przy okazji notatek do egzaminów, teraz chciałbym to zamienić na on-demand plansze np. z rangą lub zaliczoną misją. Główne wejście jako komenda w smart terminal — `/badges`, odblokowana po pierwszym awansie.

## Summary

Codebase ma dojrzałą infrastrukturę, która bardzo dobrze mapuje się na ten feature. Mechanizm `PREVIEW_SHOW` + `PreviewOverlay` (iframe) jest gotowy do użycia — wystarczy stworzyć nowe strony `/explorers/badges/[type]` renderujące grafiki odznaczek. System rang (7 tierów, XP-based) i questy są już w stanie gry. Komenda `/badges` może być dodana identycznie jak inne komendy — z flagą `cmds:badges` odblokowaną przy pierwszym awansie (`RANK_UP` event, tier ≥ 2).

**Podjęte decyzje (2026-03-05):**
- Badge wyświetlany jako karta PNG-like w PreviewOverlay (iframe z dedykowaną Astro page)
- Na stronie badge'a: przyciski share do LinkedIn i Twitter
- Zakres v1: tylko badge rangi
- Ważne ograniczenie: `@napi-rs/canvas` **nie działa na Cloudflare Workers** (native bindings) — badge musi być HTML/CSS lub PNG pre-generated statycznie

## Detailed Findings

### 1. System Komend Terminala

**Pliki:**
- `src/explorers/terminal/commandRegistry.ts` — Rejestr komend z flagami odblokowania
- `src/explorers/terminal/commandHandler.ts` — Wykonywanie komend, interfejsy `CommandResult`, `InteractiveItem`
- `src/explorers/SmartTerminal.svelte` — UI terminala, autocomplete, klik na interactive items

**Istniejące komendy (8 szt.):**

| Komenda | Wymagana flaga | Cel |
|---------|---------------|-----|
| `/me` | — | Status gracza (ranga, XP) |
| `/time` | — | Zegar pokładowy |
| `/help` | — | Lista komend |
| `/bookmarks` | `cmds:bookmarks` | Zapisane linki (preview w iframe) |
| `/quest` | `cmds:quest` | Aktywna misja |
| `/solve` | `cmds:quest` | Odpowiedź na misję |
| `/hint` | `cmds:quest` | Podpowiedź |
| `/navi` | `cmds:navi` | Harmonogram misji |
| `/support` | `cmds:support` | Token HQ |

**Kluczowy interfejs (commandHandler.ts:18-25):**
```typescript
interface CommandResult {
  output: string[];
  interactive?: InteractiveItem[];
  triggerDialogue?: string;
  liveUpdate?: { intervalMs: number };
}
```

**Jak dodać `/badges`:**
1. Nowy wpis w `COMMAND_REGISTRY` z `requiredFlag: 'cmds:badges'`
2. Nowy case w switch w `handleCommand()`
3. Funkcja `cmdBadges()` zwracająca interactive items z `action: { type: 'preview', url, title }`
4. Ustawienie flagi `cmds:badges` w momencie pierwszego awansu

### 2. Mechanizm Podglądu (PreviewOverlay / iframe)

**Pliki:**
- `src/explorers/PreviewOverlay.svelte` — Komponent iframe overlay
- `src/explorers/events/GameEvents.ts:41-43` — Eventy `PREVIEW_SHOW` / `PREVIEW_DISMISSED`
- `src/explorers/PhaserGame.svelte:271` — Renderowanie PreviewOverlay

**Flow:**
1. Komenda emituje `GameEvents.PREVIEW_SHOW` z `{ url, title }`
2. `PreviewOverlay.svelte` odbiera event i otwiera iframe pod danym URL
3. Użytkownik zamyka → emit `PREVIEW_DISMISSED`
4. PreviewOverlay: sandbox `allow-scripts allow-same-origin allow-popups allow-forms`

**Analogia z bookmarks (commandHandler.ts:271-286):**
```typescript
function cmdBookmarks(state: GameState): CommandResult {
  return {
    output: [...],
    interactive: state.bookmarks.map(b => ({
      label: b.title,
      action: { type: 'preview', url: b.url, title: b.title }
    }))
  };
}
```

**SmartTerminal.svelte:273-281:**
```typescript
function handleInteractiveClick(item: InteractiveItem) {
  if (item.action.type === 'preview') {
    getBus().emit(GameEvents.PREVIEW_SHOW, {
      url: item.action.url,
      title: item.action.title,
    });
  }
}
```

### 3. System Rang i Stan Gry

**Pliki:**
- `src/explorers/config/ranks.ts` — Definicja rang i dialogów awansu
- `src/explorers/state/types.ts:5-24` — `GameState` interface
- `src/explorers/PhaserGame.svelte:171-190` — Detekcja awansu, emit `RANK_UP`

**7 tierów rang:**
```typescript
export const RANKS = [
  { tier: 1, name: '???',               minXP: 0    },
  { tier: 2, name: 'Space Scout',       minXP: 100  },
  { tier: 3, name: 'Moon Engineer',     minXP: 1000 },
  { tier: 4, name: 'Solar Builder',     minXP: 2000 },
  { tier: 5, name: 'Stellar Explorer',  minXP: 3000 },
  { tier: 6, name: 'Cosmic Architect',  minXP: 4000 },
  { tier: 7, name: 'Deep Space Pioneer',minXP: 5000 },
];
```

**Dane dostępne dla badge'a:**
```typescript
interface GameState {
  xp: number;
  quests: { completed: string[]; active: string | null };
  flags: string[];
  exams: { completed: string[] };
  activityLog: ActivityLogEntry[];
}
```

**Trigger pierwszego awansu (PhaserGame.svelte:174-189):**
```typescript
game.events.on(GameEvents.XP_GAINED, ({ oldTotal, newTotal }) => {
  const oldRank = getRankForXP(oldTotal);
  const newRank = getRankForXP(newTotal);
  if (newRank.tier > oldRank.tier) {
    game.events.emit(GameEvents.RANK_UP, { ... });
  }
});
```

### 4. Istniejące Strony Zasobów (wzorzec dla nowych stron badge'ów)

**Wzorcowy plik:** `src/pages/explorers/resources/m0-study-notes.astro`

```astro
---
import content from '@/content/resources/m0-study-notes.md';
---
<!DOCTYPE html>
<html lang="pl">
  <head>
    <meta charset="UTF-8" />
    <title>Notatki szkoleniowe</title>
    <!-- styles dla iframe embedding -->
  </head>
  <body>
    <Content />
  </body>
</html>
```

**Nowe strony badge'ów powinny być w tym samym katalogu:** `src/pages/explorers/badges/`

### 5. Infrastruktura Generowania Grafik

**Canvas (`@napi-rs/canvas` v0.1.93):**
- Jest już jako dev-dependency w `package.json:27`
- Używany w `scripts/generate-placeholder-assets.mjs` do generowania PNG
- Eksportuje: `createCanvas`, `canvas.toBuffer('image/png')`

**Ograniczenie Cloudflare Workers:**
`@napi-rs/canvas` jest dev-dependency używanym tylko w build scripts — używa natywnych bindingów Node.js, które **nie działają w środowisku Cloudflare Workers/Pages** runtime. Opcje generowania grafiki na CF Workers:
- `satori` + `@resvg-js/resvg-wasm` (JSX/HTML → SVG → PNG przez WASM) — działa na CF Workers
- Strona HTML/CSS renderowana w przeglądarce (inside iframe)

**Wybrana strategia implementacji:**

| Warstwa | Rozwiązanie | Uzasadnienie |
|---------|------------|-------------|
| In-game preview | Strona Astro HTML/CSS (`src/pages/explorers/badges/rank.astro`) wyświetlana w iframe | Gotowy PreviewOverlay, brak ograniczeń |
| Share buttons | LinkedIn + Twitter linki na stronie badge'a | `allow-popups` w iframe sandbox jest już włączone |
| og:image dla social preview | Statyczny PNG per tier w `/public/game/badges/rank-{tier}.png` | 7 plików, brak runtime generation |
| Dane w URL | Signed JWT lub query params + brak auth na publicznej stronie | JWT zapobiega fałszowaniu rangi |

**Ścieżki plików:**
- `src/pages/explorers/badges/rank.astro` — publiczna strona badge'a rangi (bez auth)
- `public/game/badges/rank-2.png` ... `rank-7.png` — ikony/tła rang dla og:image

### 6. Odblokowanie Komendy `/badges`

**Mechanizm flagi:**
- Flaga: `cmds:badges`
- Trigger: pierwszy awans (tier 1 → tier 2, minXP: 100)
- Gdzie ustawić: w `PhaserGame.svelte` przy obsłudze `RANK_UP` eventu, gdy `newTier === 2`
  - Wywołać `setFlag('cmds:badges')` lub przez `onComplete` dialogu awansu tier 2

**Alternatywnie przez dialog awansu:**
- `ranks.ts:buildRankUpDialogues()` generuje dialogi `rank-up-tier-2` ... `rank-up-tier-7`
- Rozszerzyć `DialogueEffect` o `setFlags` dla dialogu `rank-up-tier-2`

**Przykładowy kod ustawienia flagi (ranks.ts lub PhaserGame.svelte):**
```typescript
// W obsłudze RANK_UP w PhaserGame.svelte
if (newTier >= 2 && !state.flags.includes('cmds:badges')) {
  setFlag('cmds:badges');
}
```

## Code References

- `src/explorers/terminal/commandRegistry.ts:1-26` — Rejestr komend z interfejsem `CommandEntry`
- `src/explorers/terminal/commandHandler.ts:7-25` — Interfejsy `InteractiveAction`, `InteractiveItem`, `CommandResult`
- `src/explorers/terminal/commandHandler.ts:27-65` — Główna funkcja `handleCommand()`
- `src/explorers/terminal/commandHandler.ts:271-286` — `cmdBookmarks()` — wzorzec dla `/badges`
- `src/explorers/SmartTerminal.svelte:273-281` — `handleInteractiveClick()` — obsługa kliknięcia preview
- `src/explorers/PreviewOverlay.svelte:14-43` — Komponent iframe overlay
- `src/explorers/events/GameEvents.ts:41-43` — Eventy `PREVIEW_SHOW` / `PREVIEW_DISMISSED`
- `src/explorers/PhaserGame.svelte:171-190` — Detekcja `RANK_UP`, trigger awansu
- `src/explorers/config/ranks.ts:9-17` — Definicja 7 rang z progami XP
- `src/explorers/config/ranks.ts:92-110` — `buildRankUpDialogues()` — dialogi awansu tier 2-7
- `src/explorers/state/types.ts:5-24` — `GameState` interface
- `src/explorers/systems/DialogueTypes.ts:16-21` — `DialogueEffect.openUrl` — trigger preview z dialogu
- `src/explorers/levels/m0-exam-room/dialogues.ts:5-25` — Wzorzec `addBookmark` + `openUrl` w dialogu
- `src/pages/explorers/resources/m0-study-notes.astro` — Wzorzec strony zasobu w iframe
- `scripts/generate-placeholder-assets.mjs:1-394` — Użycie `@napi-rs/canvas` do generowania PNG

## Architecture Insights

### Docelowa architektura feature'u (v1 — tylko ranga):

```
Terminal: /badges
     │
     ├─ commandRegistry.ts
     │     └─ { name: 'badges', description: 'Odznaka rangi', requiredFlag: 'cmds:badges' }
     │
     ├─ commandHandler.ts: cmdBadges(state)
     │     └─ generuje URL: /explorers/badges/rank?token=<signedJWT>
     │     └─ zwraca InteractiveItem z action: { type: 'preview', url, title: 'Odznaka rangi' }
     │
     ├─ SmartTerminal.svelte → emit GameEvents.PREVIEW_SHOW { url }
     │
     ├─ PreviewOverlay.svelte → iframe
     │
     └─ src/pages/explorers/badges/rank.astro (publiczna, bez auth)
           ├─ odczytuje ?token=<signedJWT>, weryfikuje podpis (JWT_SECRET)
           ├─ renderuje kartę badge'a: ranga, XP, data
           ├─ og:image → /game/badges/rank-{tier}.png (statyczny plik)
           ├─ [LinkedIn share button] → window.open do linkedin.com/sharing/share-offsite/?url=...
           └─ [Twitter/X share button] → window.open do twitter.com/intent/tweet?text=...&url=...
```

### Flaga odblokowania:

`cmds:badges` ustawiana przy `RANK_UP` do tier ≥ 2 (po osiągnięciu 100 XP / "Space Scout").
Logika w `PhaserGame.svelte` przy obsłudze `GameEvents.RANK_UP`.

### Przekazanie danych do publicznej strony badge'a:

**Wybór: Query params (bez auth, bez podpisywania)**
- Dane: `tier`, `name`, `xp` — wyłącznie kosmetyczne, bez wrażliwości
- Generowane synchronicznie w `cmdBadges()` z lokalnego `GameState` + `getRankForXP()`
- Strona `/explorers/badges/rank.astro` renderuje to co dostanie — brak weryfikacji
- Manipulacja URL = oszukiwanie samego siebie, żadne ryzyko bezpieczeństwa

```typescript
// commandHandler.ts — cmdBadges() jest synchroniczne, brak fetch
function cmdBadges(state: GameState): CommandResult {
  const rank = getRankForXP(state.xp);
  const url = `/explorers/badges/rank?tier=${rank.tier}&name=${encodeURIComponent(rank.name)}&xp=${state.xp}`;
  return {
    output: ['◆ Odznaka rangi dostępna'],
    interactive: [{ label: `${rank.name} — pokaż odznakę`, action: { type: 'preview', url, title: 'Odznaka rangi' } }]
  };
}
```

**Przepływ share buttonów:**
```
Shared URL: https://przeprogramowani-edu.pages.dev/explorers/badges/rank?tier=2&name=Space+Scout&xp=250

LinkedIn: https://www.linkedin.com/sharing/share-offsite/?url=<encoded-shared-url>
Twitter:  https://twitter.com/intent/tweet?text=Osiągam%20rangę%20Space%20Scout%20🚀&url=<encoded-shared-url>
```
`allow-popups` w sandboxie iframe jest już włączone → linki `target="_blank"` działają.

## Open Questions (po decyzjach z 2026-03-05)

~~1. Format badge'a~~ → **HTML/CSS card w iframe** (wygląda jak PNG, ale to styled HTML)
~~2. Publiczne sharing~~ → **Tak**, LinkedIn + Twitter, URL z signed JWT
~~3. Dane do badge'a~~ → **Tylko ranga** (tier, nazwa, XP) — v1
~~5. Typy badge'ów~~ → **Tylko ranga** w v1

~~4. JWT generowanie~~ → **Nie potrzebne** — query params wystarczą, dane są kosmetyczne

**Pozostałe otwarte pytania:**

5. **og:image dla LinkedIn/Twitter preview**: Czy potrzebne są statyczne PNG pliki dla rang?
   - LinkedIn i Twitter pobierają og:image przed wyświetleniem linku
   - Potrzebne: `public/game/badges/rank-{2..7}.png` (6 plików) lub jeden generic
   - Alternatywa: dynamiczne og:image przez endpoint (wymaga Satori/WASM lub pre-generation)

6. **Tekst tweet'a**: Jaki preset tekstu dla Twitter share button?
   - Propozycja: `"Osiągam rangę {rankName} w grze 10x Explorers 🚀 #10xDevs"` + URL
