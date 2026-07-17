# P1 Brief: video-cli-intro — Pierwsze uruchomienie 10x-cli

| | |
|---|---|
| Lekcja | m1-l1 |
| Sesja | osobna (niezalezna od sesji 1-3 — celowo oddzielona, bo CLI moze sie zmienic) |
| Format | Live demo, PUNKTY na prompterze |
| Czas | 5-7 min |
| Ryzyko | 2/5 |
| Kolejnosc nagrania | niezalezna — przed pierwszym uzyciem /10x-shape w shape-session |

## Setup

- [ ] Pusty katalog `~/projects/my-10x-project/` (lub podobny)
- [ ] Node.js >= 20 zainstalowany
- [ ] Konto kursowe z dzialajacym emailem (do magic link)
- [ ] Token wylogowany przed nagraniem (`npx @przeprogramowani/10x-cli@latest auth --logout` lub usunac token recznie)
- [ ] Paczka m1l1 dostepna na serwerze (przetestowac `get m1l1` przed nagraniem)
- [ ] Terminal: ciemne tlo, czcionka >= 16pt, szerokosc >= 120 kolumn
- [ ] Powiadomienia systemowe wylaczone
- [ ] Fallback: nagranie outputu `get m1l1` na wypadek problemow z siecia
- [ ] Fallback: juz zalogowana sesja na wypadek opoznienia magic linka
- [ ] Dry run pelnego flow min. 1 raz: `--help` -> `auth` -> `get m1l1` -> `ls .claude/skills/`
- [ ] Ton: rzeczowy, zwiezly, zero hype — "pokazuje co wpisac, nie sprzedaje narzedzia"

## Przebieg nagrania (5 segmentow)

| Seg | Co | Czas |
|-----|---|------|
| 1 | `npx @latest --help` — CLI bez globalnej instalacji | 1 min |
| 2 | `auth` — magic link, token lokalny | 1-2 min |
| 3 | `get m1l1` — pobranie skilli | 1 min |
| 4 | `ls .claude/skills/` + `head SKILL.md` — co wyladowalo na dysku | 1-2 min |
| 5 | Zamkniecie: `get` na poczatku kazdej lekcji, deep dive w m1-l2 | 30 sec |

## Segment 1 — CLI bez globalnej instalacji

Wpisz: `npx @przeprogramowani/10x-cli@latest --help`

```
Nie instalujemy globalnie.
npx z @latest daje nam zawsze najnowszą wersję.
W pierwszych dniach kursu będziemy iterować szybko —
to eliminuje problem nieaktualnego narzędzia.
```

## Segment 2 — Autentykacja

Wpisz: `npx @przeprogramowani/10x-cli@latest auth`

```
Auth wysyła magic link na twój email z platformy.
Klikasz link, CLI zapisuje token lokalnie.
[przejdź do emaila, kliknij magic link, wróć do terminala]
Jednorazowy krok — nie powtarzasz go przy każdej lekcji.
```

**Fallback:** jesli magic link nie przychodzi w ciagu 30s — przejdz na przygotowana zalogowana sesje. "Email w drodze, ale mam juz zalogowana sesje — idziemy dalej."

## Segment 3 — Pobranie skilli

Wpisz: `npx @przeprogramowani/10x-cli@latest get m1l1`

```
Każda lekcja ma swoją paczkę.
m1l1 to identyfikator tej lekcji.

[poczekaj na output — CLI wypisuje listę dostarczonych artefaktów]

Skille pobrane.
Ponowne uruchomienie get jest bezpieczne —
CLI sprawdza co już masz i aktualizuje tylko to, co się zmieniło.
```

## Segment 4 — Co wyladowalo na dysku

```
[wpisz: ls .claude/skills/]
[pokaż: 10x-shape/ i 10x-prd/]

Skille to pliki markdown w twoim projekcie.
Mówią agentowi co ma robić.
Nie magia w chmurze — pliki na dysku,
które możesz otworzyć, przeczytać, sprawdzić.

[wpisz: head -20 .claude/skills/10x-shape/SKILL.md]
[pokaż początek pliku — opis + workflow]

Za chwilę uruchomimy /10x-shape.
Agent przeczyta ten plik i poprowadzi sesję według instrukcji w środku.
```

## Segment 5 — Zamkniecie

```
Każda lekcja w kursie zaczyna się od npx @latest get.
Skille lądują tutaj.

Pełny przegląd toolkitu — jak skille działają pod spodem,
jak je konfigurować, co jeszcze daje CLI —
robimy w m1-l2.

Na razie wystarczy auth, get i to, co widzisz na dysku.
Wracamy do lekcji.
```

## MUST-SAY frazy

| Po czym | Fraza |
|---------|-------|
| Segment 1 | "npx z @latest — zawsze najnowsza wersja, zero globalnej instalacji." |
| Segment 3 | "Bez get komendy z tej lekcji nie zadziałają. Każda lekcja zaczyna się od get." |
| Segment 4 | "Skille to pliki markdown na dysku — nie magia w chmurze." |
| Segment 5 | "Deep dive na toolkit jest w m1-l2. Na razie — auth, get, gotowe." |

## Fallback plan

- Magic link nie przychodzi -> przygotowana zalogowana sesja
- `get m1l1` timeout/blad sieci -> wklej przygotowany output + recznie skopiowane skille
- Output CLI sie zmienil od dry runu -> komentuj to co widzisz, nie trzymaj sie skryptu

## Reset

```bash
rm -rf .claude/ && npx @przeprogramowani/10x-cli@latest auth --logout
```

## Po nagraniu

To nagranie jest niezalezne od sesji 1-3. Moze byc nagrane wczesniej lub pozniej. Jedyne wymaganie: musi byc gotowe przed publikacja m1-l1.
