# P1 Brief: video-permission-prompts — Trzy decyzje w trakcie biegu

| | |
|---|---|
| Lekcja | m1-l3 |
| Sesja | 3 (zaraz po skill-vs-prompt!) |
| Format | Live demo, PUNKTY |
| Czas raw | 10 min |
| Ryzyko | 3/5 |
| Wartosc | **5/5 — ESENCJONALNE** |
| Kolejnosc nagrania | **5 z 5** |

## Setup (po resecie z m1-l2)

- [ ] `context/foundation/prd.md` + `tech-stack.md` obecne
- [ ] **KRYTYCZNE:** `echo '{}' > .claude/settings.json` (lub usunac plik)
- [ ] Dry run bootstrappera — zanotowac tresc promptow!
- [ ] Screenshoty promptow jako fallback do postprodukcji
- [ ] Sprawdzic polaczenie z npm registry
- [ ] Zanotowac `starter_id` z tech-stack.md
- [ ] Zmierzyc czas scaffoldu w dry run — jesli >60s, zaplanowac cut point
- [ ] Punkt resetu git przygotowany

## Przebieg nagrania (6 segmentow)

| Seg | Co | Czas |
|-----|---|------|
| 1 | Stan wyjsciowy: `ls context/foundation/`, `cat .claude/settings.json` — pusty | 1 min |
| 2 | `/10x-bootstrapper`, pierwszy prompt (`npm create astro@latest`) -> opcja 2 | 2 min |
| 3 | Kolejne prompty: Write/Edit + brak git init | 2 min |
| 4 | Otworzyc settings.json — co harness dopisal | 1 min |
| 5 | Reczna edycja: allow + deny rules | 2 min |
| 6 | Zamkniecie: co mamy, czego brakuje | 1 min |

## Segment 1 — Stan wyjsciowy

```
[Pokaz: ls context/foundation/ — prd.md i tech-stack.md]
[Pokaz: cat .claude/settings.json — pusty]

Dwa pliki z poprzednich lekcji — PRD i tech-stack.
Projektu jeszcze nie ma.

Settings.json jest czysty.
Harness bedzie pytal o wszystko —
i dokladnie o to nam chodzi.
```

## Segment 2 — Pierwszy permission prompt

Wpisz: `/10x-bootstrapper`

Gdy pojawi sie prompt na `npm create astro@latest`:

```
Oficjalny kreator Astro.
Pytanie: co ten wzorzec moze popsuc poza moim repo?
Nic — poza polaczeniem z rejestrem npm,
czego i tak potrzebuje.
Opcja druga — Yes, don't ask again.

[wybierz opcje 2]

Harness dopisal regule do settings.json.
Od teraz npm komendy w tym katalogu nie pytaja.
```

## Segment 3 — Kolejne prompty

Komentuj kazdy prompt przez filtr:
- MUST-SAY: "Co ten wzorzec moze popsuc poza moim repo?"

Jesli Write/Edit pytaja:
- MUST-SAY: "Write i Edit dotykaja plikow w katalogu roboczym. Ten sam filtr: co to moze popsuc poza repo? Nic, jesli jestem w dobrym katalogu. Dodaje do allow dla tego projektu."

Jesli Write/Edit nie pytaja:
- MUST-SAY: "W tym biegu harness nie zapytal o Write/Edit. Nie zakladam z tego zasady na zawsze — wersja narzedzia i tryb uprawnien maja znaczenie. Bash komendy oceniam osobno."

- MUST-SAY: "Bootstrapper nie inicjalizuje gita — to twoja decyzja."

## Segment 4 — Settings.json po biegu

```
[Otworz .claude/settings.json w edytorze]

To sa reguly z moich klikniec "Yes, don't ask again".
Kazda odpowiada jednemu promptowi.
Ale czegos tu brakuje — regul deny.

Harness dopisuje tylko to, co zatwierdziles.
Regul ochronnych nie dodaje.
Te musisz dopisac sam.
```

## Segment 5 — Edycja deny rules

```
[Edytuj settings.json na zywo]

[Dodaj do allow:]
Bash(git *) — operacje gitowe w katalogu projektu.
Nie wychodza poza repo.

[Dodaj sekcje deny:]
Bash(rm -rf *) — ten wzorzec moze zniszczyc caly katalog domowy.
Zatrzymujemy zawsze.

Bash(git push *) — push to decyzja publikacyjna.
Nie deleguje jej bez swiadomego potwierdzenia.

[pauza]

Piec minut roboty.
Jeden filtr na kazdy wpis:
co ten wzorzec moze popsuc poza moim repo.

"Nic" — allow.
"Potencjalnie wszystko" — deny.
"Nie wiem" — zostaw. Harness zapyta.

Kolejnosc ewaluacji: deny sprawdzane pierwsze, potem ask, potem allow.
Pierwszy pasujacy wygrywa.
Dlatego git push w deny ma priorytet nad git * w allow.

To nie jest polityka na cale zycie.
To punkt startu, ktory jutro pozwoli lancuchowi przejsc
bez nadmiaru pytanek.
```

Docelowy settings.json:

```json
{
  "permissions": {
    "allow": ["Bash(npm *)", "Bash(git *)", "Read", "Edit", "Write"],
    "deny": ["Bash(rm -rf *)", "Bash(git push *)"]
  }
}
```

## Segment 6 — Zamkniecie

```
Projekt jest na dysku.
Bootstrapper uzywal autorytatywnego CLI —
nie generowal struktury z glowy.

Polityka uprawnien na miejscu.
Harness wie, co moze robic bez pytania, a co ma zglaszac.
To nie jest obietnica absolutnego bezpieczenstwa.
To polityka, ktora podnosi koszt glupich bledow.

Ale repo jest na razie gluche.
Agent nie zna twoich konwencji, formatow, komend testowych.
Tego nie robimy dzisiaj — to temat m1-l4.

Dzis mamy fundament:
scaffoldowane repo i polityke uprawnien.
Na tym m1-l4 zbuduje onboarding agenta.

Za chwile w tekscie lekcji zobaczysz verification.md —
raport, ktory bootstrapper zostawil obok scaffoldu.
Trzecia bramka — post-execution.
```

## KRYTYCZNE: NIE RESETUJ po nagraniu!

`verification.md` z tego biegu jest potrzebny do video-verification-report.

## Podsumowanie dnia

| # | Film | Typ | Czas z buforem |
|---|------|-----|----------------|
| 1 | welcome | prompter, 0 ryzyka | 10 min |
| 2 | lesson-intro | prompter + slajd, 0 ryzyka | 10 min |
| — | *zmiana setupu na terminal* | | 10 min |
| 3 | shape-session | live demo, high risk | 45-60 min |
| — | *zmiana setupu na 10xCards* | | 10 min |
| 4 | skill-vs-prompt | hybrid, high risk | 30-40 min |
| — | *reset settings.json* | | 5 min |
| 5 | permission-prompts | live demo, medium risk | 20-25 min |
| | **LACZNIE** | | **~2.5 - 3.5h** |
