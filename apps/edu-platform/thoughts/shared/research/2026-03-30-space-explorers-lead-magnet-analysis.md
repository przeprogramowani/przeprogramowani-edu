---
date: 2026-03-30T12:00:00+02:00
researcher: Claude Opus 4.6
git_commit: 959167aa867b7f05e4a5077b32cbc24709b4ef4c
branch: master
repository: przeprogramowani-sites/projects/edu-platform
topic: "Space Explorers jako lead magnet - analiza konwersji i pozyskiwania emaili"
tags: [research, lead-magnet, marketing, email-capture, conversion, explorers, newsletter]
status: complete
last_updated: 2026-03-30
last_updated_by: Claude Opus 4.6
---

# Research: Space Explorers jako Lead Magnet — Analiza Konwersji

**Date**: 2026-03-30T12:00:00+02:00
**Researcher**: Claude Opus 4.6
**Git Commit**: `959167aa`
**Branch**: master
**Repository**: przeprogramowani-sites/projects/edu-platform

## Research Question

Analiza gry Space Explorers pod katem lead magnetu — narzedzia z latwa sciezka pozyskiwania emailu uzytkownikow na potrzeby marketingowe. Czego brakuje, jak mozna ulatwic ten flow (konto wymagane jest przy komendzie /support w core-ai-room). Przekrojowa analiza i szanse na zwiekszenie konwersji.

## Summary

Space Explorers ma **solidny fundament techniczny** do dzialania jako lead magnet, ale **brakuje mu warstwy marketingowej** — nie istnieje zadne polaczenie miedzy gra a systemem newsletterowym (MailerLite), a jedyny moment wymuszajacy logowanie (`/support` w m0-core-ai) pojawia sie **zbyt pozno** w grze (po ~30-60 minutach) i jest narracyjnie uwarunkowany, a nie marketingowo. Gra pozwala na pelna rozgrywke anonimowa, a emaile zbierane przez auth flow trafiaja tylko do JWT tokena — **nie sa przekazywane do zadnego systemu marketingowego**.

### Kluczowe obserwacje

1. **Gra jest w pelni grywalna bez logowania** — anonimowi uzytkownicy moga przejsc 3 z 4 map Milestone 0
2. **Jedyny gate na email** to `/support` w m0-core-ai (mapa 4/4) — wymaga JWT sesji
3. **Zebrane emaile nie trafiaja do MailerLite** — sa uzywane wylacznie do auth (JWT + Supabase profile)
4. **Brak integracji z newsletterem** — zero kodu laczacego auth platformy z grupami MailerLite
5. **Games section na /courses jest wylaczona** (`SHOW_GAMES_SECTION = false`)
6. **Badge sharing istnieje** ale jest odblokowany dopiero po rankup do Tier 2 (100 XP)
7. **Free signup flow zostal zaprojektowany** (research z 2026-03-02) ale nie jest w pelni wdrozony

---

## Detailed Findings

### 1. Aktualny Funnel Konwersji (As-Is)

```
Uzytkownik dowiaduje sie o grze (skad? brak linkow)
    |
    v
Wchodzi na /explorers (bezposredni URL)
    |
    v
Gra anonimowo przez M0: awakening → crew-room → exam-room
    |                    (stan w localStorage, zero auth)
    v
Dociera do m0-core-ai, upgradeuje firmware
    |
    v
Probuje /support → Blad: "Brak aktywnej sesji"
    |                      "Przejdz na strone logowania: /login"
    v
[DECYZJA] Loguje sie LUB rezygnuje
    |
    v
Logowanie (magic link / GitHub / Google)
    |
    v
Email trafia do: JWT cookie + Supabase profiles + access_grants('explorers','free')
    |
    v
/support dziala → token + GitHub HQ URL
    |
    v
[KONIEC FUNNELA — email NIE trafia do MailerLite]
```

**Problemy:**
- Brak discovery path (gra nie jest linkowana z zadnej strony marketingowej)
- Email capture dopiero w mapie 4/4 (~30-60 min grania)
- Zero integracji z email marketingiem
- Uzytkownicy ktorzy nie dotra do /support nigdy nie podadza emaila

### 2. Punkty Zbierania Emaili — Co Istnieje

#### 2a. Auth Flow (Platform Login)
- **Magic link** (`src/pages/api/auth.ts`): Email → mailing service → JWT
- **GitHub OAuth** (`src/pages/api/auth/github/callback.ts`): GitHub email → JWT
- **Google OAuth** (`src/pages/api/auth/google/callback.ts`): Google email → JWT

**Co sie dzieje z emailem po logowaniu:**
```
Email → JWT cookie (24h)
     → Supabase profiles (upsertUser)
     → Supabase access_grants ('explorers', 'free')
     → Supabase syncFromAirtable() (fire-and-forget)
     → Supabase syncAllCircleCourses() (fire-and-forget)
```

**Czego brakuje:** Zero wywolan do MailerLite. Email jest uzywany wylacznie wewnatrz platformy.

#### 2b. Newsletter System (Monorepo)
- **MailerLite SDK** w `projects/common/src/components/newsletter/`
- **Grupy newsletterowe** zdefiniowane w `NewsletterGroup.ts` (21 grup)
- **Lead magnet pattern** istnieje w `projects/common/src/components/lead-magnet/`
- **Endpointy** `/api/newsletter-signup` w kazdym projekcie marketingowym

**Problem:** Platformy edu-platform i newsletter sa calkowicie rozlaczone. Nie ma zadnego endpointu ani kodu ktory by laczyl logowanie na platformie z subskrypcja MailerLite.

#### 2c. Free Signup Flow (Zaprojektowany, nie w pelni wdrozony)
- Research: `thoughts/shared/research/2026-03-02-free-user-signup-games-section.md`
- Plan: `thoughts/shared/plans/2026-03-02-free-user-signup-games-section.md`
- **Stan:** Plan ma Phase 1 (auth) i Phase 2 (UI) — czesc zmian wdrozona (Supabase grants 'free'), ale `SHOW_GAMES_SECTION` nadal `false`

### 3. Analiza Game Progression Pod Katem Lead Magnetu

#### Milestone 0 — Mapa po mapie

| Mapa | Wymaga auth? | Email capture? | Czas grania | Wartosc marketingowa |
|------|-------------|---------------|-------------|---------------------|
| **m0-awakening** (Sala Hibernacyjna) | NIE | NIE | ~10 min | Wysoka (hook narracyjny, terminal discovery) |
| **m0-crew-room** (Szatnia Zalogi) | NIE | NIE | ~5 min | Srednia (identity puzzle) |
| **m0-exam-room** (Sala Egzaminacyjna) | NIE | NIE | ~15 min | Bardzo wysoka (3 egzaminy, bookmarks) |
| **m0-core-ai** (Modul CORE AI) | TAK (na /support) | TAK (pozno) | ~10 min | Krytyczna (support token, HQ handoff) |

**Observations:**
- Gracz inwestuje 30+ minut ZANIM natrafi na auth wall
- Sala Egzaminacyjna to **najlepszy moment na capture** — gracz jest zaangazowany, zdal egzaminy, ma momentum
- CORE AI room ma za duzo mechanik naraz (firmware, malfunction, manual, support, quest) — auth wall gubi sie w szumie

#### Komendy wymagajace auth

| Komenda | Wymaga auth? | Wymaga flagi? | Kiedy dostepna? |
|---------|-------------|--------------|-----------------|
| `/me` | NIE | NIE | Zawsze |
| `/time` | NIE | NIE | Zawsze |
| `/quest` | NIE | `cmds:quest` | Po intro |
| `/bookmarks` | NIE | `cmds:bookmarks` | Po exam-room |
| `/navi` | NIE | `cmds:navi` | Po firmware upgrade |
| `/support` | **TAK** | `cmds:support` + `m0-support-calibrated` | Po kalibracji uplinku |
| `/badges` | NIE | `cmds:badges` | Po tier 2 rankup |

**Jedyny auth gate to /support** — wszystko inne dziala anonimowo.

### 4. Istniejaca Infrastruktura Marketingowa

#### MailerLite Groups (Relevant)

Nie istnieje **zadna grupa MailerLite dedykowana Space Explorers/10xDevs grze**. Istniejace grupy:

| Grupa | ID | Projekt |
|-------|-----|---------|
| OFE All | 103732707057469118 | Opanuj Frontend |
| OTS All | 127554102111503999 | Opanuj TypeScript |
| OpanujAI | 88776518727107826 | Opanuj AI |
| Lead Magnet: GHA | 123847680218629974 | OFE |
| Lead Magnet: TS Generics | 128987288843585161 | OTS |

**Brakuje:** Grupy dla Space Explorers / 10xDevs 3.0 / Game Players

#### Badge Sharing Feature
- **Plan:** `thoughts/shared/plans/2026-03-05-badges-sharing-feature.md`
- **Mechanizm:** `/badges` → PreviewOverlay → LinkedIn/Twitter share buttons
- **URL:** `/explorers/badges/rank?tier=X&name=Y&xp=Z` (public, no auth, og:image)
- **Unlock:** Dopiero po Tier 2 rankup (100 XP)
- **Problem:** Share URL nie zawiera zadnego CTA ani linka do logowania — jest czysto informacyjna

### 5. Braki i Mozliwosci (Gap Analysis)

#### GAP 1: Brak Discovery Path
**Problem:** Gra nie jest linkowana z zadnej strony marketingowej (opanujfrontend.pl, opanujtypescript.pl, opanuj.ai). Uzytkownik musi znac bezposredni URL `/explorers`.

**Mozliwosc:** Dodac widget/banner "Zagraj w Space Explorers" na stronach marketingowych + w newsletterach MailerLite.

#### GAP 2: Auth Wall Za Pozno
**Problem:** `/support` gate w m0-core-ai to 30-60 min od startu gry. Wielu graczy zrezygnuje wczesniej.

**Mozliwosc:**
- **Wczesniejszy soft-gate** — np. po zdaniu egzaminow (exam-room) zaproponuj logowanie dla cloud save: "Twoj postep zostanie utracony. Zaloguj sie, aby go zachowac."
- **Opcjonalny email prompt** przy starcie gry: "Podaj email aby otrzymac cloud save i bonusy"
- **SmartTerminal lock screen** — terminal wymaga kodu (juz istnieje: keycode 1030), ale moze tez opcjonalnie prosic o email

#### GAP 3: Zero Integracji Auth → MailerLite
**Problem:** Nawet gdy uzytkownik poda email (logowanie), nie trafia do zadnego systemu marketingowego.

**Mozliwosc:** Dodac opt-in checkbox przy logowaniu lub w grze:
```
[ ] Chce otrzymywac informacje o kursach i nowosciach (newsletter)
```
Przy zaznaczeniu → `POST /api/newsletter-signup` z email + grupa `SpaceExplorersPlayers`.

#### GAP 4: Badge Share Bez CTA
**Problem:** Shared badge URL (`/explorers/badges/rank?...`) nie zawiera zadnego CTA ani linka powrotnego do gry.

**Mozliwosc:** Dodac "Zagraj tez!" button + email capture form na stronie badge'a. Kazdy share staje sie lead magnetem.

#### GAP 5: Games Section Wylaczona
**Problem:** `SHOW_GAMES_SECTION = false` w `CourseList.astro:73`. Free users nie widza gry na platformie.

**Mozliwosc:** Wlaczyc sekcje + dodac marketing copy zachecajace do udostepniania.

#### GAP 6: Brak Dedicated Landing Page
**Problem:** Brak strony typu "10x Explorers — darmowa gra o AI-assisted development". Brak SEO, brak og:image, brak social proof.

**Mozliwosc:** Stworzyc landing page z: opisem gry, screenshotami, CTA "Zagraj za darmo" + opcjonalnym email capture.

---

## Rekomendacje — Priorytetyzowane

### TIER 1: Quick Wins (niski koszt, wysoki impact)

#### 1.1 Wlaczyc SHOW_GAMES_SECTION
- Zmiana: `CourseList.astro:73` → `SHOW_GAMES_SECTION = true`
- Impact: Zalogowani uzytkownicy widza gre na platformie
- Koszt: 1 linia kodu

#### 1.2 Dodac newsletter opt-in do auth flow
- Gdzie: `Login.svelte` (magic link form) + OAuth callbacks
- Mechanizm: Checkbox "Chce otrzymywac newsletter" → przy logowaniu POST do MailerLite
- Wymaga: Nowa grupa MailerLite (np. `SpaceExplorersPlayers`)
- Impact: Kazdy nowy gracz moze trafic do listy mailingowej
- Koszt: ~2-4h pracy

#### 1.3 Dodac CTA na stronie badge share
- Gdzie: `/explorers/badges/rank` (public page)
- Mechanizm: Button "Zagraj tez!" + email capture → MailerLite
- Impact: Kazdy share na social media staje sie lead magnetem
- Koszt: ~2-3h pracy

### TIER 2: Medium Effort (sredni koszt, wysoki impact)

#### 2.1 Wczesniejszy soft-gate — "Cloud Save" prompt
- Gdzie: Po zdaniu egzaminow w exam-room (quest `q-pass-exams` complete)
- Mechanizm: Dialogue/modal: "Gratulacje! Zaloguj sie, aby zachowac postep w chmurze."
- **Nie blokuje rozgrywki** — gracz moze odrzucic i kontynuowac
- Impact: Capture point w momencie najwyzszego zaangazowania (~25 min)
- Koszt: ~4-8h pracy

#### 2.2 Dedicated landing page
- Gdzie: `/explorers/landing` lub osobna subdomena
- Zawartosc: Opis gry, screenshots, "Zagraj za darmo" CTA, email capture form
- SEO: og:image, og:description, structured data
- Impact: Wlasny URL do promowania na social media, w newsletterach, na konferencjach
- Koszt: ~8-16h pracy

#### 2.3 Widget na stronach marketingowych
- Gdzie: opanujfrontend.pl, opanujtypescript.pl, opanuj.ai
- Mechanizm: Banner/card z linkiem do gry + CTA
- Impact: Cross-pollination miedzy produktami
- Koszt: ~4-8h pracy (komponent w common, integracja w 3 projektach)

### TIER 3: Strategic (wyzszy koszt, dlugoterminowy impact)

#### 3.1 In-game email capture z immediate value
- Mechanizm: Zamiast prostego "zaloguj sie", dac natychmiastowa wartosc:
  - "Podaj email → otrzymasz PDF z cheatsheetem do prompt engineeringu"
  - "Podaj email → odblokuj bonusowy egzamin"
  - "Podaj email → otrzymasz daily tip o AI development"
- Impact: Wartosc wymienna za email, nie tylko "cloud save"
- Wymaga: Integracja z MailerLite automation sequences

#### 3.2 Referral/invite system
- Mechanizm: Kazdy gracz dostaje unikalny link zaproszeniowy
- Nagroda: Bonus XP / kosmetyki / ekskluzywny content za zaproszenie
- Impact: Wiralowy wzrost bazy emaili
- Koszt: Znaczacy (nowy system)

#### 3.3 Leaderboard publiczny
- Mechanizm: Publiczna tablica wynikow (XP, rank, achievements)
- Impact: Social proof + motywacja do gry + SEO
- Wymaga: Nowy endpoint API + publiczna strona

---

## Analiza Konwersji — Estymowane Wskazniki

### Obecny Stan (bez zmian)

```
Visitors → /explorers:          100%
Dochodza do m0-core-ai:         ~30-40% (drop-off na egzaminach)
Probuja /support:                ~25-35%
Loguja sie (podaja email):       ~15-25%
Email w systemie marketingowym:  0% (brak integracji)
```

### Po TIER 1 Zmianach

```
Visitors → /explorers:          100%
Dochodza do m0-core-ai:         ~30-40%
Loguja sie (soft + hard gate):   ~20-35%
Email w MailerLite:              ~10-20% (z opt-in checkbox)
Badge shares → nowi odwiedzajacy: +5-15% (viral loop)
```

### Po TIER 1 + TIER 2 Zmianach

```
Visitors z landing page:         +30-50% wiecej (SEO + social)
Loguja sie (cloud save prompt):  ~35-50% (wczesniejszy gate)
Email w MailerLite:              ~20-35%
Badge shares → nowi:             +10-20%
Cross-pollination z marketing:   +15-25% nowych odwiedzin
```

---

## Code References

- `src/pages/explorers.astro:6-12` — JWT-only soft auth (anonymous play allowed)
- `src/explorers/PhaserGame.svelte:46,62,100-132` — User email prop, server state sync conditional
- `src/explorers/terminal/supportCommand.ts:10-28` — Unauthenticated user message + /login redirect
- `src/explorers/terminal/commandHandler.ts:365-393` — /support command implementation
- `src/explorers/terminal/commandRegistry.ts:18` — /support requires `CMDS_SUPPORT` flag
- `src/components/CourseList.astro:73` — `SHOW_GAMES_SECTION = false`
- `src/components/CourseList.astro:123-158` — Disabled Games section UI
- `src/components/Login.svelte:50-76` — Login form submission flow (no MailerLite)
- `src/pages/api/game/token.ts:43-55` — Explorers access grant check
- `src/server/supabase/accessService.ts:29-47` — Grant sources: free/airtable/circle/manual
- `src/explorers/config/flags.ts:26` — M0_SUPPORT_CALIBRATED flag
- `src/explorers/levels/m0-core-ai/quests.ts:5-20` — q-earth-signal (api-answer quest)
- `projects/common/src/components/newsletter/NewsletterGroup.ts:1-21` — MailerLite groups (no game group)
- `projects/common/src/components/newsletter/NewsletterSignupHandler.ts:15-55` — Newsletter signup handler
- `projects/common/src/components/lead-magnet/LeadMagnetHero.svelte:1-224` — Lead magnet pattern

## Architecture Insights

### Silne strony istniejacego systemu
1. **Supabase access_grants z source='free'** — infrastruktura do darmowych kont istnieje
2. **KV GAME_STATE** — stan gry persistuje dla authenticated users
3. **Badge sharing** — wiralna mechanika gotowa (LinkedIn/Twitter)
4. **MailerLite infra** — grupy, SDK, endpointy — wszystko gotowe w monorepo
5. **Lead magnet pattern** — komponent lead-magnet + signup form istnieje w common

### Slabe strony
1. **Zero integracji miedzy auth a MailerLite** — calkowita luka
2. **Brak newsletter grupy dla graczy** — nie mozna targetowac playerow
3. **Single hard gate na samym koncu** — za pozno, za malo okazji
4. **Brak landing page** — zero SEO, zero discoverability
5. **SHOW_GAMES_SECTION wylaczone** — istniejacy uzytkownicy platformy nie widza gry

### Kluczowa architektoniczna decyzja
Integracja auth → MailerLite powinna byc **opt-in** (checkbox), nie automatyczna. GDPR/RODO wymaga jawnej zgody na marketing. Istniejacy pattern z `NewsletterSignupForm.svelte` (consent checkbox) powinien byc reuzywany.

## Historical Context (from thoughts/)

- `thoughts/shared/research/2026-03-02-free-user-signup-games-section.md` — Pelna analiza free signup flow. Zidentyfikowane wszystkie auth gates. Plan Phase 1 (auth) i Phase 2 (UI) opisany szczegolowo.
- `thoughts/shared/plans/2026-03-02-free-user-signup-games-section.md` — Implementation plan z konkretnymi zmianami plikow. Phase 1 (remove Airtable gate) + Phase 2 (locked tiles, Games section).
- `thoughts/shared/research/2026-03-05-badges-sharing-feature.md` — Badge sharing via LinkedIn/Twitter. Public URL z og:image.
- `thoughts/shared/plans/2026-03-05-badges-sharing-feature.md` — Plan implementacji badge sharing.
- `thoughts/shared/research/2026-03-04-space-explorers-external-api.md` — API endpointy: /api/game/token, /mission, /submit. Bearer token auth.
- `thoughts/shared/research/2026-03-03-10xdevs-courses-homepage-integration.md` — 10xDevs courses not shown on homepage. Backend ready, frontend missing.

## Related Research

- `thoughts/shared/research/2026-03-02-free-user-signup-games-section.md`
- `thoughts/shared/research/2026-03-02-game-state-user-integration.md`
- `thoughts/shared/research/2026-03-05-badges-sharing-feature.md`
- `thoughts/shared/research/2026-03-04-space-explorers-external-api.md`
- `thoughts/shared/research/2026-03-03-10xdevs-courses-homepage-integration.md`

## Open Questions

1. **Czy istnieje dedykowana grupa MailerLite na potrzeby 10xDevs 3.0 / Space Explorers?** — W kodzie nie znaleziono. Trzeba stworzyc w panelu MailerLite.

2. **Jaki jest aktualny ruch na /explorers?** — Cloudflare Analytics / Google Analytics moglby dac odpowiedz. Bez danych ciezko estymowac impact zmian.

3. **Czy free signup flow (research z 2026-03-02) jest juz wdrozony?** — `SHOW_GAMES_SECTION = false` sugeruje ze Phase 2 nie jest complete. Supabase grants 'free' istnieja w kodzie auth callbacks.

4. **Czy na stronach marketingowych (opanujfrontend.pl itd.) mozna dodac widget bez zmian w infrastrukturze?** — Kazda strona jest osobnym workspace Astro, wiec wymaga zmian per-projekt.

5. **Czy badge share page powinna miec wlasny email capture form, czy wystarczy link do /login?** — Lead magnet pattern z common daje gotowy form, ale wymaga dodania do Astro page.

6. **Jak obsluzyc GDPR consent w kontekscie in-game email capture?** — Czy checkbox w login form wystarczy, czy potrzebny jest dodatkowy consent w samej grze?
