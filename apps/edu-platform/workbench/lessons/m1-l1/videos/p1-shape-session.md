# P1 Brief: video-shape-session — Sesja /10x-shape na zywo

| | |
|---|---|
| Lekcja | m1-l1 |
| Sesja | 2 |
| Format | Live demo, PUNKTY na prompterze |
| Czas raw | 20-30 min -> 12-15 min po montazu |
| Ryzyko | 4/5 |
| Wartosc | **5/5 — ESENCJONALNE** |
| Kolejnosc nagrania | **3 z 5** |

## Setup

- [ ] Pusty katalog `~/projects/10xcards/` z `git init`
- [ ] `npx @przeprogramowani/10x-cli@latest auth` + `npx @przeprogramowani/10x-cli@latest get m1l1` zrobione
- [ ] `ls .claude/skills/10x-shape/` — potwierdzic
- [ ] Claude Code: font >= 16, ciemny motyw, okno max
- [ ] Terminal prompt czysty (np. `10xcards $`)
- [ ] Powiadomienia systemowe wylaczone
- [ ] API key aktywny, brak rate limitow
- [ ] **Min. 2-3 proby generalne PRZED nagraniem**
- [ ] **Golden-path cheat sheet WYDRUKOWANY** (tabela ponizej)
- [ ] Fallback `shape-notes.md` z udanej proby
- [ ] Screenshoty: Socratic challenge, empty-CRUD, soft-gate z prob

## Golden-path cheat sheet (WYDRUKUJ)

| Faza | Zacznij od (mętnie) | Po dociśnięciu agenta |
|------|---------------------|----------------------|
| Vision | "Chcę zrobić apkę do fiszek z AI" | "Ludzie uczący się samodzielnie z artykułów i książek nie wyrabiają nawyku spaced repetition, bo tworzenie fiszek ręcznie jest za wolne" |
| Persona | "Użytkownik" | Jedna persona: self-directed learner, po sesji nauki, kiedy motywacja do ręcznego tworzenia fiszek jest najniższa. Bez cramerów, bez exam-prep |
| MVP | "Generowanie fiszek, deck, review, import PDF, eksport Anki, reset hasła" | "Wklej tekst → wygeneruj kandydatów → accept/reject każdego → review z SRS. Jeden flat deck, bez importu, bez eksportu" |
| FRs | Naturalne zdania | Na Socratic: "Bez explicit accept/reject user nie kontroluje jakości decku — AI wrzuca śmieci" |
| Business Logic | **CELOWO pusty CRUD:** "User wkleja tekst, AI generuje fiszki" | Po empty-CRUD: "Trzy odpowiedzialności: LLM generuje kandydatów, user gatuje (accept/reject), algorytm SRS planuje review" — **to jest reguła domenowa, nie ficzer** |
| Product Framing | Szybko | — |
| Soft-gate | Pozwól wylistować braki | Zamknij 1-2 luki, resztę zaakceptuj. **6 elementów:** (1) Access Control, (2) Data Model, (3) Business Logic (one-sentence rule), (4) Project Artifacts, (5) MVP-in-a-week, (6) Non-Goals |

## Przebieg nagrania (7 segmentow)

| Seg | Co | Czas | Uwagi |
|-----|---|------|-------|
| 1 | Setup: pusty katalog, CLI gotowe | 2 min | "Pusty katalog. Żadnego kodu. Mam tylko pomysł." |
| 2 | Start + Vision + Persona | 5 min | Agent drąży, ty dajesz mętne → konkret |
| 3 | MVP discipline | 3-5 min | Ambitna lista → cięcie do jednego przepływu |
| 4 | FRs + Business Logic | 5-8 min | **KLUCZOWY!** Socratic challenge + empty-CRUD |
| 5 | Product Framing + Soft-gate | 3-5 min | Agent listuje braki, ty zamykasz 1-2 |
| 6 | Artefakt: shape-notes.md | 3 min | `cat` lub edytor, wskaż sekcje |
| 7 | Komentarz zamykający | 1 min | CTA: "Twój ruch: uruchom /10x-shape" |

## Tekst promptera — intro (segment 1)

```
Pusty katalog. Zero kodu, zero struktury.
Jest tylko pomysł — 10xCards, aplikacja do fiszek z AI.

npx @przeprogramowani/10x-cli@latest auth
i npx @przeprogramowani/10x-cli@latest get m1l1 mam za sobą.
Skille są w .claude/skills/.

Odpalam /10x-shape.
Podam mu mój pomysł i zobaczymy, co z tego wyjdzie.
```

## Tekst promptera — artefakt (segment 6)

```
Sesja skończona. Zobaczmy co wyszło.

[otwórz shape-notes.md — cat lub edytor]
[scrolluj, wskazuj sekcje: persona, przepływ, non-goals, business logic]

Zaczynałem od "chcę zbudować 10xCards".
Kończę z produktem dla jednej konkretnej osoby,
z jednym przepływem, z regułą domenową
i listą rzeczy, których świadomie nie buduję.

Z tego /10x-prd zrobi PRD.
Nie dokument do szuflady —
kontrakt, który moje kolejne prompty będą czytać.
```

## Tekst promptera — zamkniecie (segment 7)

```
Mam shape-notes.md.
Następny krok — /10x-prd.
Weźmie te notatki i zapisze jako PRD.
To już opisujemy w tekście lekcji.

Twój ruch: odpal /10x-shape na swoim pomyśle.
Daj się przepytać.
Zobaczysz, ile decyzji jeszcze nie podjąłeś.

Jeśli masz istniejący projekt —
odpal /10x-shape w jego katalogu.
Agent sam zaproponuje tryb brownfield
i zapyta o to, co jest dzisiaj,
zamiast budować od zera.
```

## MUST-SAY frazy (WYDRUKUJ jako backup)

| Po czym | Fraza |
|---------|-------|
| Vision+Persona | "Agent nie akceptuje 'użytkownik ogólnie'. Wymusza jedną personę — bo bez niej wymagania są rozmyte." |
| MVP | "MVP-in-a-week wymusza cięcie. Import PDF, eksport Anki, reset hasła — przeszły do non-goals." |
| **Empty-CRUD** | "To jest moment, którego sam bym sobie nie dał. Agent złapał, że 'user wkleja tekst, AI generuje fiszki' to pusty CRUD. I zmusił mnie do decyzji: kto gatuje kandydatów? Kto planuje powtórki? Bez tego miałbym ładną apkę bez wartości." |
| Soft-gate | "Soft-gate nie blokuje — ale pokazuje explicite, gdzie mam luki: access control, data model, reguła biznesowa, artefakty projektu, MVP-in-a-week i non-goals. Mogę iść dalej, ale nie mogę nie wiedzieć." |

## Improwizacja — demo (segmenty 2-5)

Wpisz `/10x-shape`. Podaj mętny pomysł: "Chcę zbudować aplikację do fiszek z AI. Użytkownik wkleja tekst, AI generuje fiszki, user dodaje je do decku i powtarza."

Reaguj na pytania agenta wg cheat sheetu. W pauzach między odpowiedziami agenta — komentuj do kamery.

## Fallback plan

- Agent nie odpala empty-CRUD -> wstaw fragment z proby generalnej
- Sesja sie zawiesi -> wklej fallback shape-notes.md, nagraj segmenty 6-7
- Pauzy >15s -> w montazu overlay "Agent mysli..."
- Po 3 probach bez empty-CRUD -> metniejsza odpowiedz w fazie 5 LUB montaz z proby

## Reset

```bash
rm -rf context/ && git checkout -- .
```

Rezerwacja czasu: 45-60 min.

## Po nagraniu

Przerwa, zmiana setupu na 10xCards (~10 min).
