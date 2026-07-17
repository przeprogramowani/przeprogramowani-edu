---
title: "[2.2] Cursor — Podstawy operacyjne"
titleEn: "[2.2] Cursor - Operational Basics"
lessonId: "05"
language: "pl"
order: 5
---

# Cursor: pięć trybów, trzy strumienie danych, jedna decyzja o modelu

Cześć, w tym filmie pokażę ci podstawy pracy z Cursorem - środowiskiem umożliwiającym programowanie z AI.

Celowo mówię dzisiaj o środowisku a nie stricte edytorze kodu, bo Cursor już kilka razy przechodził istotną ewolucję sposobu pracy ze sztuczną inteligencją - na początku mieliśmy podpowiedzi i modyfikacje lokalne, następnie Cursor Composera który pracował bardziej przekrojowo, a od wersji 3.0 mamy Cursora jako centrum sterowania wieloma agentami.

W tym filmie pokaże ci klasycznego Cursora jako edytor kodu z Agentem AI, a w lekcji o Agent-Native IDE zobaczysz zupełnie nowy workflow z Cursora 3.0.

## Cursor - Podstawy operacyjne

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1186504288?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="10x3-M0 L1 - cursor"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Jeśli korzystasz z innego narzędzia

Jeśli chcesz korzystać z edytora innego niż Cursor, zadbaj o kilka istotnych elementów odpowiadających temu, co przedstawiliśmy na powyższym klipie.

Na start zajrzyj do dokumentacji polityk prywatności. Szukaj tam odpowiedzi na proste pytanie: czy twój kod, prompty i historia pracy mogą być używane do treningu modeli, analityki produktu albo usług chmurowych? Jeżeli tak jest, a ty pracujesz na kodzie komercyjnym, domyślna zgoda na szerokie współdzielenie danych powinna zapalić ci lampkę ostrzegawczą.

Druga rzecz to kontekst projektu. Sprawdź, czy narzędzie indeksuje repozytorium, jak odświeża ten indeks i jak możesz wykluczać pliki z widoku AI. Szukaj odpowiedników `.gitignore`, plików typu `ignore` dla AI, ustawień indeksowania oraz sposobu ręcznego wskazywania plików w rozmowie.

Trzecia rzecz to tryby pracy. Dobre narzędzie powinno pozwalać przynajmniej na lokalną edycję fragmentu kodu, rozmowę o wskazanym pliku, pracę agenta na wielu plikach oraz kontrolę zmian przed akceptacją. Bez tego szybko wracamy do kopiuj-wklej z chatem, czyli... no cóż, do 2023 roku.

Jeżeli szukasz alternatywy bliskiej temu trybowi pracy, sprawdź Windsurf albo GitHub Copilot w trybie Agenta. Nie muszą działać identycznie jak Cursor, ale powinny dawać ci podobny zestaw podstawowych możliwości: kontekst projektu, edycję wielu plików, uruchamianie komend i czytelny podgląd zmian.

Istotne będzie też wsparcie dla konwencji stających się standardami, w tym `AGENTS.md` oraz `.agents/skills`. 

- [AGENTS.md](https://agents.md/) - standaryzacja onboardingu Agenta w projekcie
- [.agents/skills](https://agentskills.io/) - nowe możliwości i wiedza dla Agentów

Na końcu sprawdź modele i koszty. W dokumentacji szukaj informacji o modelach domyślnych, możliwości wyboru mocniejszego modelu, limitach subskrypcji, cenniku użycia API oraz tym, czy narzędzie automatycznie przełącza modele pod tańszą lub droższą ścieżkę. W trakcie 10xDevs będziemy wracać do tego tematu, bo dobór modelu to nie detal techniczny, tylko decyzja o jakości, czasie i budżecie pracy.

## Materiały dodatkowe

- *Cursor — Modes* / Cursor Docs / 2026 — https://cursor.com/docs/agent/modes
- *Cursor — Context (@-symbols, Codebase)* / Cursor Docs / 2026 — https://cursor.com/docs/context
- *Cursor — Privacy & Security* / Cursor Docs / 2026 — https://cursor.com/docs/account/privacy
- *Cursor — Models & Pricing* / Cursor Docs / 2026 — https://cursor.com/docs/account/pricing
- *Best practices for coding with agents* / Lee Robinson / Cursor Blog / 2026-01-09 — https://cursor.com/blog/agent-best-practices
