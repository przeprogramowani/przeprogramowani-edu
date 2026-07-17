# Demo ideas — Claude Code dla Product Builderów

Wszystkie dema opierają się na jednym scenariuszu: **10xShoes** — fikcyjna marka butów prezentująca nową linię. Budujemy landing page z formularzem preorder od zera, używając 10x-astro-starter. Każde demo odpowiada na „co pokazać + dlaczego", nie „co wpisać" — host improwizuje z doświadczenia.

**Baza:** [10x-astro-starter](https://github.com/przeprogramowani/10x-astro-starter) (Astro + Tailwind + TypeScript)

**Scenariusz przewodni:** 10xShoes wypuszcza nową linię butów. Potrzebujemy landing page do walidacji zainteresowania — hero z produktem, prezentacja cech linii, formularz "Zostaw e-mail, damy znać o premierze".

---

## Demo A — CLAUDE.md: prawdziwy plik z produkcji

**Gdzie w webinarze:** Sekcja 3 (22–30 min)
**Potwierdza twierdzenie:** kontekst > prompt — CC jest tak dobry, jak instrukcja, którą mu dasz
**Czas:** ~5 min

**Co pokazać (high-level):**
- otworzyć prawdziwy CLAUDE.md z edu-platform (lub innego produkcyjnego repo)
- przejść przez sekcje: overview, architecture, conventions, constraints, env
- pokazać, jak duży i szczegółowy jest ten plik — to nie README, to instrukcja dla AI

**Co publiczność ma zobaczyć w kulminacji:**
Prawdziwy, wielosekcyjny CLAUDE.md z żyjącego projektu — widać, że to poważny artefakt, nie gadżet.

**Ryzyka live:**
- plik może zawierać wrażliwe dane (klucze, URL-e wewnętrzne) — przejrzeć przed webinarem
- bez kontekstu może wyglądać "za technicznie" — host tłumaczy każdą sekcję w jednym zdaniu

**Plan B (jeśli demo padnie):**
Slajd ze screenshotem struktury CLAUDE.md (sekcje jako nagłówki) — host tłumaczy ustnie.

**Przygotowanie przed live:**
- wybrać CLAUDE.md z edu-platform lub przeprogramowani-sites
- przejrzeć pod kątem wrażliwych danych — w razie potrzeby zamazać
- przygotować 1-2 zdania na każdą sekcję, zrozumiałe dla nietechnicznej publiczności

---

## Demo B — Od 10x-astro-starter do landing page 10xShoes

**Gdzie w webinarze:** Sekcja 4 (30–42 min)
**Potwierdza twierdzenie:** CC buduje prawdziwy kod z prawdziwym stackiem — nie mockup
**Czas:** ~12 min

**Co pokazać (high-level):**
- host otwiera sklonowany 10x-astro-starter w CC
- włącza Plan Mode (Shift+Tab) — agent planuje zanim napisze
- prompt w stylu: "Stwórz landing page dla 10xShoes — nowa linia butów do biegania. Hero z produktem, sekcja z 3 cechami linii (lekkość, amortyzacja, design), sekcja social proof, CTA."
- agent wypisuje plan → host akceptuje → CC generuje komponenty, layout, style
- host uruchamia dev server, pokazuje efekt w przeglądarce

**Co publiczność ma zobaczyć w kulminacji:**
Działający landing page 10xShoes w przeglądarce — hero, cechy produktu, CTA — z jednego promptu, z prawdziwym stackiem.

**Ryzyka live:**
- CC może generować >5 min — mieć checkpoint branch
- Plan Mode może dać zbyt długi plan — host skraca: "akceptuję, buduj"
- wynik wizualny może nie być "piękny" — host: "to kod, nie design; designer dopracuje"
- dev server hot reload może się zaciąć — mieć drugą kartę z `npm run build && npm run preview`

**Plan B (jeśli demo padnie):**
Przeskoczyć do brancha `demo/10xshoes-landing` z gotowym stanem — host pokazuje diff "co CC wygenerował".

**Przygotowanie przed live:**
- 10x-astro-starter sklonowany, `npm install` wykonany, dev server sprawdzony
- branch `demo/10xshoes-landing` z gotowym landing page jako backup
- prompt przetestowany minimum 2× — sprawdzony timing i jakość outputu
- Plan Mode włączony przed rozpoczęciem (Shift+Tab)

---

## Demo C — Skill jakościowy na kodzie 10xShoes

**Gdzie w webinarze:** Sekcja 6 (52–62 min)
**Potwierdza twierdzenie:** Skill = jeden plik markdown, cały pipeline jakościowy
**Czas:** ~8 min

**Co pokazać (high-level):**
- host otwiera plik skilla jakościowego (`.claude/skills/quality-check` lub podobny)
- pokazuje strukturę: tytuł, opis, kroki pipeline'u
- uruchamia CC z aktywnym skillem na kodzie 10xShoes z Demo B
- agent sam przechodzi przez pipeline: build → lint → testy → astro check → code review
- **kluczowy moment:** agent napotyka problem (błąd builda, warning linta, brak testu) — i sam go naprawia
- host narracyjnie: "widzicie — nie musiałem nic robić; skill zdefiniował proces, agent go wykonał"

**Co publiczność ma zobaczyć w kulminacji:**
Agent autonomicznie przechodzi pipeline QA, napotyka problem, naprawia go, puszcza ponownie — jeden plik markdown kontroluje cały proces.

**Ryzyka live:**
- kod z Demo B może być "za czysty" (brak błędów) — celowo zostawić jeden problem w kodzie (np. unused import, brakujący alt na img)
- pipeline może trwać >5 min — timer: po 5 min, jeśli agent nadal pracuje, host narracyjnie tłumaczy i przechodzi do wyniku
- agent może nie trafić w skill — upewnić się, że prompt pasuje do opisu skilla

**Plan B (jeśli demo padnie):**
Przygotowany recording lub screenshoty: skill.md po lewej, terminal output po prawej — host tłumaczy krok po kroku.

**Przygotowanie przed live:**
- napisać skill jakościowy (5 kroków: build, lint, test, astro check, review)
- przetestować na kodzie 10xShoes minimum 2×
- celowo zostawić 1-2 problemy w kodzie, żeby agent miał co naprawić (dramaturgicznie ważne)
- mieć branch `demo/10xshoes-after-quality` z kodem po naprawach jako backup
- zmierzyć czas pipeline'u — jeśli >7 min, skrócić do 3 kroków (build, lint, review)

---

## Demo D — Skill ficzerowy: formularz preorder 10xShoes

**Gdzie w webinarze:** Sekcja 7 (62–75 min)
**Potwierdza twierdzenie:** tu Lovable się kończy — CC dodaje logikę, której nie da się wyklikać
**Czas:** ~10 min

**Co pokazać (high-level):**
- host otwiera plik skilla ficzerowego — definiuje: jak budować formularze w tym projekcie
  - Svelte island do interaktywności
  - walidacja client-side (natychmiastowy feedback UX)
  - walidacja server-side (Astro API endpoint)
  - obsługa stanów: loading, success, error
  - testy
- host daje prompt: "Dodaj formularz preorder do strony 10xShoes — e-mail + imię, walidacja, endpoint API, komunikat sukcesu"
- CC czyta skilla → buduje komponent Svelte, endpoint API, walidację po obu stronach
- host pokazuje w przeglądarce: formularz działa, walidacja łapie pusty e-mail, submit daje feedback

**Co publiczność ma zobaczyć w kulminacji:**
Formularz preorder z walidacją client+server działający w przeglądarce — agent zbudował go spójnie z resztą projektu, prowadzony przez skill.

**Ryzyka live:**
- generacja formularza + endpointu może trwać >7 min — timer: po 7 min przeskok na backup
- walidacja server-side wymaga działającego dev servera — upewnić się, że serwer nie padł po Demo C
- agent może nie użyć Svelte (skill musi to jasno definiować) — przetestować
- formularz może nie wyglądać estetycznie — host: "funkcjonalność, nie pixel-perfect; to jest moment, w którym Lovable mówi stop"

**Plan B (jeśli demo padnie):**
Branch `demo/10xshoes-with-form` z gotowym formularzem — host pokazuje diff + działający formularz w przeglądarce.

**Przygotowanie przed live:**
- napisać skill ficzerowy (reguły: Svelte island, walidacja client+server, API endpoint, error handling)
- przetestować na 10xShoes minimum 2×
- branch `demo/10xshoes-with-form` z pełnym formularzem jako backup
- mieć dev server uruchomiony i działający przed rozpoczęciem
- przygotować "złe" dane do formularza (pusty e-mail, za krótkie imię) — do pokazania walidacji

---

## Przygotowanie ogólne — checklist przed webinarem

### Repo i branche
- [ ] 10x-astro-starter sklonowany i działający (`npm install && npm run dev`)
- [ ] Branch `demo/10xshoes-landing` — gotowy landing page (backup Demo B)
- [ ] Branch `demo/10xshoes-after-quality` — kod po quality pipeline (backup Demo C)
- [ ] Branch `demo/10xshoes-with-form` — landing + formularz preorder (backup Demo D)
- [ ] Każdy branch przetestowany: `npm run build` + `npm run dev` działają

### Skille
- [ ] Skill jakościowy napisany i przetestowany 2×
- [ ] Skill ficzerowy napisany i przetestowany 2×
- [ ] Oba skille w `.claude/skills/` w repo

### Środowisko
- [ ] CC zainstalowany i zalogowany (Plan $20+ aktywny)
- [ ] Terminal z odpowiednim fontem i rozmiarem (czytelny na projekcji)
- [ ] Przeglądarka otwarta obok terminala (split screen)
- [ ] Dev server sprawdzony — `npm run dev` startuje bez błędów
- [ ] CLAUDE.md z edu-platform przygotowany (wrażliwe dane zamazane)

### Timing
- [ ] Każde demo zmierzone — znany czas generacji CC
- [ ] Timery ustawione: Demo B ≤12 min, Demo C ≤8 min, Demo D ≤10 min
- [ ] Plan B przetestowany dla każdego demo

---

## Demo, których świadomie NIE robimy (i dlaczego)

- **Plan Mode jako osobne demo** — wpleciony w Demo B (landing page); osobne demo byłoby suche i oderwane od narracji.
- **Autonomiczna rutyna / scheduled agent** — wymaga konfiguracji zdalnego agenta, zbyt wysokie ryzyko na webinar wprowadzający. Ewentualnie teaser ze screenshotem.
- **MCP integration demo** — MCP to szczegół techniczny za głęboki dla mieszanej publiczności. Wspomniane jako kontekst do Skills, bez demo na żywo.
- **Pełny auth flow** — wymaga konfiguracji OAuth/bazy danych na żywo. Za dużo ruchomych części. Formularz preorder wystarczy, żeby pokazać server-side logic.
- **Deploy na Cloudflare/Vercel** — byłby efektowny, ale dodaje 5+ min i ryzyko konfiguracyjne. Wspomniany słownie jako "następny krok".
