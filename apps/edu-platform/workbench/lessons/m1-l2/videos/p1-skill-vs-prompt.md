# P1 Brief: video-skill-vs-prompt — Ad-hoc prompt vs skill

| | |
|---|---|
| Lekcja | m1-l2 |
| Sesja | 3 |
| Format | Hybrid (live demo + conversation review + prezentacja), PUNKTY |
| Czas raw | 18-25 min -> 12-15 min po montazu |
| Ryzyko | 4/5 |
| Wartosc | **5/5 — ESENCJONALNE** |
| Kolejnosc nagrania | **4 z 5** |

## Setup

- [ ] 10xCards repo, czysty stan git
- [ ] `context/foundation/prd.md` obecny
- [ ] `context/foundation/tech-stack.md` **USUNIETY**
- [ ] Kopia tech-stack.md w `/tmp/10xCards-fallback/` — musi mieć `path_taken: standard`, `bootstrapper_confidence: first-class`, `starter_id`, `has_auth` i `has_ai`
- [ ] Claude Code + VS Code split screen
- [ ] SKILL.md `/10x-tech-stack-selector` otwarty w VS Code tab (ukryty)
- [ ] Folder `references/` widoczny w drzewie VS Code
- [ ] Tabelka porownawcza przygotowana (slajd/markdown)
- [ ] Dry run skilla — potwierdzic standard path + frontmatter output

## Przebieg nagrania (5 segmentow)

| Seg | Co | Format | Czas |
|-----|---|--------|------|
| 1 | Ad-hoc prompt: "Wybierz mi stack" -> brak pliku | live demo | 3-4 min |
| 2 | "Ten sam PRD, ale inaczej" | live demo | 30 sec |
| 3 | `/10x-tech-stack-selector` -> tech-stack.md na dysku | live demo | 5-7 min |
| 4 | Anatomia SKILL.md: description -> workflow -> references/ | conversation review | 5-7 min |
| 5 | Tabelka side-by-side + regula decyzyjna | prezentacja | 2-3 min |

## Segment 1 — Ad-hoc prompt

Nowa sesja Claude Code w 10xCards.

Wpisz: "Ok, mam PRD w context/foundation/prd.md. Wybierz mi stack do tego projektu."

Po odpowiedzi agenta:
- `ls context/foundation/` -> brak tech-stack.md
- MUST-SAY: "Agent odpowiedzial sensownie. Ale bootstrapper w nastepnej lekcji nie ma czego przeczytac. Wynik zyje tylko w tej sesji — zamkniesz okno i po nim."

## Segment 2 — Tranzycja

```
Ten sam PRD. Ale tym razem inaczej.
Zamiast pisac prompt od zera —
uruchomie skill, ktory wie
co przeczytac i co zostawic na dysku.
```

## Segment 3 — Skill run

Wpisz: `/10x-tech-stack-selector @context/foundation/prd.md`

Komentuj to co widzisz:
- "Skill sie zaladowal — przeczytal PRD i wyciagnal przeslanki."
- "Standardowa sciezka, bo PRD jest jednoznaczny."
- Po zakonczeniu: `ls context/foundation/` -> tech-stack.md jest na dysku
- Otworz tech-stack.md w VS Code
- MUST-SAY: "starter_id, bootstrapper_confidence, path_taken, has_auth, has_ai — to flagi, ktore bootstrapper umie przeczytac. Prompt tego nie zrobil."

**Fallback:** >3 min -> podmien na przygotowany tech-stack.md. "Podstawiam przygotowany wynik, zeby nie czekac."

## Segment 4 — Anatomia SKILL.md

Przelacz na VS Code z otwartym SKILL.md.

```
Dlaczego skill to zrobil, a prompt nie?
Zajrzyjmy do SKILL.md.
```

Przejdz po sekcjach:

1. **Description** — "To jest te sto tokenow, ktore agent widzi od startu sesji. Na tej podstawie decyduje, czy ten skill jest w ogole potrzebny."
2. **Workflow** — "Skill prowadzi decyzje po rejestrze, a nie generuje rekomendacje z pierwszych zasad."
3. **References/** — otworz drzewo references/. "Te pliki laduja sie dopiero wtedy, kiedy agent ich potrzebuje. Gdyby lezaly w glownym SKILL.md, kazdy skill zjadlby dwadziescia tysiecy tokenow zamiast pieciu."
4. **Allowed-tools** — "Lista narzedzi, ktore skill moze uzyc. Jawny kontrakt uprawnien — prompt tego nie ma."

Kontrast:
- "Prompt zniknal z ta sesja. Ten plik jest w repo — mozesz go otworzyc, audytowac, wersjonowac."
- "Prompt nie wiedzial, ze powinien sprawdzic bramki agent-friendly — bo nikt mu o nich nie powiedzial. Skill ma to w references."
- "Prompt nie wiedzial, jaki format ma miec plik wyjsciowy. Skill ma handoff-schema.md — kontrakt, ktory bootstrapper umie przeczytac."

**NIE otwieraj starter-registry.yaml** — za duzo na ekran, kradnie scope.

## Segment 5 — Recap: tabelka side-by-side

| | Ad-hoc prompt | `/10x-tech-stack-selector` |
|---|---|---|
| Wynik | tekst w czacie | `tech-stack.md` na dysku |
| Frontmatter | brak | `starter_id`, `bootstrapper_confidence`, flagi |
| Agent-friendly gates | niesprawdzone | wbudowane w `references/` |
| Nastepny krok | bootstrapper nie ma czego czytac | czyta kontrakt |
| Powtarzalnosc | znika z sesja | dziala identycznie za tydzien |

```
Regula jest prosta.
Powtarzalny krok lancucha z nazwanym wejsciem i wyjsciem —
siegnij po skill.
Jednorazowa rozmowa — wystarczy prompt.

W tekscie lekcji znajdziecie picker z piecioma scenariuszami.
Sprawdzcie sie, czy umiecie odroznic jedno od drugiego.

Za chwile zobaczycie,
jak skill-creator pomaga zarysowac szkielet nowego skilla,
a potem jak /10x-stack-assess ocenia istniejacy projekt.
```

## Reset po nagraniu

```bash
# Przywroc tech-stack.md
cp /tmp/10xCards-fallback/tech-stack.md context/foundation/tech-stack.md

# Wyzeruj settings.json
echo '{}' > .claude/settings.json
```

Przejscie do video-permission-prompts — **bez przerwy**.
