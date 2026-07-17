# Video Scenario: m1-l2 — Skill vs Prompt (centerpiece)

## Cel wideo

Uczynić widocznym na ekranie różnicę między ad-hoc promptem a skillem jako kontraktem. Widz ma zobaczyć ten sam PRD przetworzony dwoma sposobami: najpierw jako luźna rozmowa w czacie (brak pliku, brak kontraktu, brak reużywalności), potem przez `/10x-tech-stack-selector` (plik `tech-stack.md` z frontmatter na dysku, kontrakt czytelny dla następnego ogniwa łańcucha). Druga połowa wideo otwiera SKILL.md i pokazuje, *dlaczego* skill to zrobił — anatomia, progresywne ujawnianie, `references/` ładowane on-demand. Widz wychodzi z pytaniem odwróconym: nie "czy skill jest lepszy od promptu", ale "w których sytuacjach prompt wystarczy, a w których potrzebuję kontraktu".

## Założenia

- Kursant ukończył m1-l1 i ma działający PRD. Rozumie, że PRD to kontrakt wejściowy.
- Kursant zna definicje chatbot/Agent/harness z preworku `[1.2]`, ale jeszcze nie pracował ze skillami.
- Główne narzędzie nagrania: Claude Code w terminalu + VS Code jako edytor.
- Demo używa projektu 10xCards (`/Users/admin/code/10xCards/`) — PRD istnieje, `tech-stack.md` jest usuwany przed nagraniem i przywracany jako fallback.
- Wideo NIE pokazuje bootstrapu (m1-l3), NIE definiuje AGENTS.md/CLAUDE.md (m1-l4), NIE wprowadza MCP (m1-l5).
- Prowadzący nie tworzy skilla od zera — to jest preview, nie tutorial.

## Materiały i setup nagrania

- Repo/projekt: `/Users/admin/code/10xCards/` — czysty stan z `context/foundation/prd.md` obecnym, `context/foundation/tech-stack.md` **usuniętym** (do przywrócenia po demo lub jako fallback).
- Narzędzie główne: Claude Code (terminal) + VS Code (edytor do otwarcia SKILL.md).
- Pliki startowe: `context/foundation/prd.md` (PRD 10xCards).
- Pliki tworzone/edytowane: `context/foundation/tech-stack.md` (tworzony przez skill).
- Stan fallback: kopia `tech-stack.md` z wcześniejszego uruchomienia (`/Users/admin/code/10xCards/context/foundation/tech-stack.md` — backup w osobnym katalogu). Jeśli agent nie wygeneruje pliku live albo trwa to za długo, prowadzący podmienia na przygotowany artefakt i jasno mówi: "tu wstawiam przygotowany wynik, żeby nie czekać na modelu".
- SKILL.md do pokazania: `/Users/admin/code/10x-toolkit/packages/ai-artifacts/skills/10x-tech-stack-selector/SKILL.md` (otwarty w VS Code).
- Ryzyka live demo:
  - Agent może dać sensowną odpowiedź na ad-hoc prompt (nie "frustracja" per se) — prowadzący skupia się na braku artefaktu na dysku, nie na jakości odpowiedzi.
  - `/10x-tech-stack-selector` może wejść w custom path zamiast standard path — prowadzący może przerwać i przywrócić fallback `tech-stack.md`.
  - Czas uruchomienia skilla jest niedeterministyczny — dla płynności nagrania prowadzący ma przygotowany cut point.

## Segment 1 — Ad-hoc prompt: "wybierz mi stack"

**Format:** `live-demo`

**Cel:** Pokazać, co dostaje kursant, gdy używa jednorazowego promptu do wyboru stacku — tekst w czacie bez artefaktu na dysku.

**Na ekranie:**

- Claude Code w terminalu — nowa, czysta sesja.
- `context/foundation/prd.md` widoczny w drzewie plików VS Code (split screen: terminal + edytor).
- Brak `context/foundation/tech-stack.md` w drzewie.

**Przebieg:**

1. Prowadzący otwiera nową sesję Claude Code w katalogu `10xCards`.
2. Wpisuje prompt: "Ok, mam PRD w `context/foundation/prd.md`. Wybierz mi stack do tego projektu."
3. Pozwala agentowi odpowiedzieć — czeka na pełną odpowiedź (lub przerywa po ~2 minutach, jeśli agent wchodzi w zbyt długą rozmowę).
4. Gdy agent odpowie, prowadzący pokazuje:
   - **Wynik jest w czacie** — tekst, nie plik.
   - **Brak `tech-stack.md` na dysku** — `ls context/foundation/` w terminalu, brak nowego pliku.
   - **Brak frontmatter** — nie ma `starter_id`, `bootstrapper_confidence`, flag `has_auth`/`has_ai`.
   - **Brak kryteriów agent-friendly** — agent nie sprawdził bramek jakości, bo nikt mu tego nie powiedział.
5. Prowadzący nie mówi "to jest źle" — mówi: "Agent odpowiedział sensownie. Ale `/10x-bootstrapper` w następnej lekcji nie ma czego przeczytać. Ten wynik żyje tylko w tej sesji."

**Rezultat:** Widz widzi, że prompt daje wynik-w-czacie, a nie artefakt-na-dysku. Problem nie jest w jakości odpowiedzi — jest w braku kontraktu.

**Most do tekstu:** Odpowiada sekcji "PRD -> tech-stack.md w praktyce" — paragraf "Najpierw: ad-hoc prompt" z draftu.

## Segment 2 — Tranzycja: "Ten sam PRD, ale inaczej"

**Format:** `live-demo`

**Cel:** Zbudować oczekiwanie na różnicę. Jeden zdaniowy most między częścią "prompt" a częścią "skill".

**Na ekranie:**

- Claude Code — ta sama sesja lub nowa (prowadzący może otworzyć nową sesję dla czystości kontekstu).
- Terminal gotowy do wpisania komendy.

**Przebieg:**

1. Prowadzący zamyka poprzednią sesję (lub robi `/clear`).
2. Mówi: "Ten sam PRD, ale inaczej. Zamiast pisać prompt od zera, uruchomię skill, który wie, co ma przeczytać i co ma zostawić na dysku."
3. Nie tłumaczy jeszcze co to skill — to przychodzi po demo.

**Rezultat:** Widz wie, że zaraz zobaczy alternatywne podejście do tego samego zadania.

**Most do tekstu:** Odpowiada jednozdaniowemu przejściu w drafcie: "Teraz: ten sam PRD przez skill."

## Segment 3 — Skill run: `/10x-tech-stack-selector`

**Format:** `live-demo`

**Cel:** Pokazać pełny przebieg skilla od uruchomienia do pliku na dysku. Widz ma zobaczyć: ładowanie skilla, standardową ścieżkę, pojawienie się `tech-stack.md` z frontmatter.

**Na ekranie:**

- Claude Code w terminalu.
- VS Code z drzewem plików `context/foundation/` (widoczny brak `tech-stack.md` na początku).

**Przebieg:**

1. Prowadzący wpisuje: `/10x-tech-stack-selector @context/foundation/prd.md`
2. Komentuje to, co widzi na ekranie w trakcie pracy skilla:
   - "Skill się załadował — widzicie, że przeczytał PRD i wyciągnął przesłanki: typ projektu, timeline, wymagania."
   - "Teraz daje rekomendację — standardowa ścieżka, bo PRD jest jednoznaczny."
   - Jeśli skill zadaje pytanie Q0 (path-fork): prowadzący akceptuje recommended defaults.
3. Gdy skill kończy pracę, prowadzący:
   - Pokazuje `ls context/foundation/` — `tech-stack.md` jest na dysku.
   - Otwiera `tech-stack.md` w VS Code.
   - Wskazuje frontmatter: `starter_id: 10x-astro-starter`, `bootstrapper_confidence: first-class`, `path_taken: standard`, `has_auth: true`, `has_ai: true`.
   - Pokazuje sekcję "Why this stack" — jedno zdanie: "Wymagania z PRD powiązane z możliwościami startera."
4. Jeśli skill trwa za długo lub wchodzi w custom path:
   - Prowadzący przerywa i podmienia na przygotowany fallback `tech-stack.md`.
   - Mówi jasno: "Podstawiam przygotowany wynik, żeby nie czekać — w waszym uruchomieniu to może trwać 2-3 minuty."

**Rezultat:** Na dysku jest `tech-stack.md` z frontmatter. `/10x-bootstrapper` w m1-l3 ma co przeczytać. Widz widzi różnicę między wynikiem-w-czacie a artefaktem-na-dysku.

**Most do tekstu:** Odpowiada sekcji "Teraz: ten sam PRD przez skill" i blokowi YAML z frontmatter w drafcie.

## Segment 4 — Anatomia SKILL.md

**Format:** `conversation-review`

**Cel:** Otworzyć SKILL.md `/10x-tech-stack-selector` w edytorze i pokazać, *dlaczego* skill zrobił to, czego prompt nie potrafił. Widz ma zobaczyć czytelny-dla-człowieka markdown z opisem, narzędziami, workflow i referencjami.

**Na ekranie:**

- VS Code z otwartym SKILL.md `/10x-tech-stack-selector`.
- Folder `references/` widoczny w drzewie plików.

**Przebieg:**

1. Prowadzący otwiera SKILL.md w VS Code.
2. Przechodzi palcem po kluczowych elementach:
   - **Frontmatter** — `name`, `description` (wskazuje: "To jest te ~100 tokenów, które agent widzi od startu sesji. Na tej podstawie *decyduje*, czy ten skill jest potrzebny."), `allowed-tools`.
   - **Opis workflow** — "Skill jest facilitatorem decyzji nad rejestrem, nie generatorem rekomendacji z pierwszych zasad."
   - **Referencje** — przewija do wzmianki o `references/starter-registry.yaml`, `references/handoff-schema.md`, `references/agent-friendly-criteria.md`. Otwiera drzewo `references/` i komentuje: "Te pliki ładują się dopiero wtedy, kiedy agent ich potrzebuje. Gdyby były w głównym SKILL.md, każdy skill zjadłby 20 000 tokenów zamiast 5000."
3. Prowadzący podsumowuje kontrast:
   - "Prompt zniknął z tą sesją. Ten plik jest w repo — możesz go otworzyć, audytować, zmieniać, wersjonować."
   - "Prompt nie wiedział, że powinien sprawdzić bramki agent-friendly — bo nikt mu o nich nie powiedział. Skill ma to wbudowane w `references/agent-friendly-criteria.md`."
   - "Prompt nie wiedział, jaki format ma mieć plik wyjściowy. Skill ma `references/handoff-schema.md` — kontrakt, który `/10x-bootstrapper` umie przeczytać."

**Rezultat:** Widz rozumie, że skill to folder z markdownem i zasobami — nie czarne pudełko, ale czytelny-dla-człowieka artefakt z jawnym kontraktem.

**Most do tekstu:** Odpowiada sekcji "Dlaczego skill to zrobił, a prompt nie?" oraz sekcji "Czym jest Agent Skill" w drafcie.

## Segment 5 — Recap: side-by-side

**Format:** `presentation`

**Cel:** Domknąć porównanie jednym ekranem. Widz ma mieć obraz before/after, który zapamięta.

**Na ekranie:**

- Split screen lub przygotowany slajd/notatka z porównaniem:

| | Ad-hoc prompt | `/10x-tech-stack-selector` |
|---|---|---|
| Wynik | tekst w czacie | `tech-stack.md` na dysku |
| Frontmatter | brak | `starter_id`, `bootstrapper_confidence`, flagi |
| Agent-friendly gates | niesprawdzone | wbudowane w `references/` |
| Następny krok | m1-l3 nie ma czego przeczytać | `/10x-bootstrapper` czyta kontrakt |
| Powtarzalność | prompt znika z sesją | skill działa identycznie za tydzień |

**Przebieg:**

1. Prowadzący pokazuje tabelkę (slajd, plik markdown lub fizycznie narysowana w edytorze).
2. Komentuje każdy wiersz jednym zdaniem.
3. Domyka: "Reguła jest prosta. Powtarzalny krok łańcucha z nazwanym wejściem i wyjściem — sięgnij po skill. Jednorazowa rozmowa — napisz prompt i ruszaj dalej."
4. Bridge do lekcji: "W tekście lekcji znajdziecie prompt-or-skill picker z pięcioma scenariuszami — sprawdźcie się, czy umiecie odróżnić."
5. Bridge do następnych wideo: "Za chwilę zobaczycie, jak meta-skill `skill-creator` pomaga zarysować szkielet nowego skilla, a potem jak `/10x-stack-assess` ocenia istniejący projekt."

**Rezultat:** Widz ma zwięzły obraz różnicy skill vs prompt i wie, że reszta lekcji pogłębia oba tematy.

**Most do tekstu:** Odpowiada tabelce z sekcji "Skill vs jednorazowy prompt" i regule decyzyjnej w drafcie.

## Pre-production TODO

### For `live-demo` segments (1, 2, 3):

- [ ] 10xCards repo sklonowane i w czystym stanie git — `context/foundation/prd.md` obecny, `context/foundation/tech-stack.md` usunięty.
- [ ] Kopia zapasowa `tech-stack.md` w osobnym katalogu jako fallback (np. `/tmp/10xCards-fallback/tech-stack.md`).
- [ ] Claude Code zainstalowany i zweryfikowany — `claude --version`.
- [ ] Skill `/10x-tech-stack-selector` zainstalowany i przetestowany w dry run — potwierdzić, że standard path generuje `tech-stack.md` z oczekiwanym frontmatter.
- [ ] Terminal font size >= 16pt, VS Code font size >= 14pt.
- [ ] Klucze API ustawione (jeśli skill wymaga LLM API).
- [ ] Git clean state — łatwy reset point: `git stash` lub `git checkout -- context/foundation/tech-stack.md`.
- [ ] Przygotowany timing: jeśli skill nie kończy się w ~3 minuty, przejście na fallback.

### For `conversation-review` segments (4):

- [ ] SKILL.md `/10x-tech-stack-selector` otwarty w VS Code i przeskrolowany — prowadzący wie, gdzie są kluczowe sekcje.
- [ ] Folder `references/` widoczny w drzewie plików — `starter-registry.yaml`, `handoff-schema.md`, `agent-friendly-criteria.md`.
- [ ] Talking points do każdej sekcji SKILL.md przygotowane (description = metadane, references = on-demand loading, handoff-schema = kontrakt wyjścia).
- [ ] Nie otwierać całego `starter-registry.yaml` — to za dużo na ekran. Wystarczy pokazać nazwę pliku i powiedzieć "25 sprawdzonych starterów".

### For `presentation` segments (5):

- [ ] Tabelka porównawcza przygotowana jako plik markdown lub slajd.
- [ ] Kolejność wierszy ustalona: wynik -> frontmatter -> gates -> następny krok -> powtarzalność.
- [ ] Tranzycja do pozostałych wideo zaplanowana (bridge sentence).

### General:

- [ ] Cały scenariusz przetestowany w dry run — prowadzący nagrywa próbę od segmentu 1 do 5.
- [ ] Przygotowany plan cięcia: segmenty 1-3 mogą być nagrane jako ciągły take, segmenty 4-5 jako osobne.
- [ ] Zaplanowane okno edycji: 18-25 min raw -> 12-15 min edited.

## Video/text mismatches

- Wideo pokazuje konkretny output agenta na ad-hoc prompt — draft opisuje to ogólnie ("agent coś zaproponuje"). Brak konfliktu, ale widz może zobaczyć inny tekst niż oczekiwał z draftu — to OK, bo draft celowo nie przywiązuje się do konkretnego outputu.
- Wideo otwiera prawdziwy SKILL.md z pełną treścią — draft cytuje tylko wybrane fragmenty (description, references, handoff-schema). Brak konfliktu, ale prowadzący powinien unikać omawiania sekcji SKILL.md, których draft nie pokrywa (np. eval-cases, residual-interview).

## Claims introduced only in video

(none) — wszystkie twierdzenia są w drafcie lub w schemie.

## Needs human decision

- Czy prowadzący powinien otworzyć `references/starter-registry.yaml` i pokazać 2-3 startery, czy wystarczy wskazać nazwę pliku? Ryzyko: tour po rejestrze kradnie zakres (mustNotCover: "pełny tour rejestru 25 starterów").
- Czy tranzycja (segment 2) powinna być osobnym segmentem, czy wcięta w segment 3 jako intro? Jeżeli video będzie krótsze niż 18 min, można połączyć.
- Czy fallback `tech-stack.md` powinien być identyczny z tym, co skill generuje live, czy celowo inny (np. z `path_taken: custom`)? Rekomendacja: identyczny z `standard` path dla spójności.
