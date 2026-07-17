---
title: "[2.3] Claude Code — Podstawy operacyjne"
titleEn: "[2.3] Claude Code - Operational Basics"
lessonId: "06"
language: "pl"
order: 6
---

# Claude Code

Claude Code to twój osobisty Agent programowania, wyposażony w topowe modele jak Opus czy Sonnet, które kontroluje jakościowy harness - warstwa narzędzi, bezpieczeństwa i kontroli wywołań.

To właśnie ten słynny harness, czyli warstwa integracji samych modeli m.in. z twoim systemem plików czy zasobami zewnętrznymi sprawiła, że Claude Code błyskawicznie wyrósł na topowe narzędzie AI dla programistów - o ile dostęp do tych samych modeli oferowały wcześniej inne narzędzia jak choćby Cursor, to mało która alternatywa wykorzystywała maksimum potencjału tych rozwiązań - czy to na poziomie wywoływania właściwych narzędzi, posługiwania się terminalem, korekty swoich działań czy sprawnego przeszukiwania plików i trzymania aktualnej wiedzy o projekcie.

Jeśli różnica między modelem, Agentem i harnessem jest dla ciebie nieoczywista, to wróć do jednej z poprzednich lekcji gdzie tłumaczymy to na przykładach. Jeśli natomiast masz tę lekcję już za sobą, to skupmy się teraz na podstawach pracy z Claude Codem.

## Claude Code - Podstawy operacyjne

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1186504300?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="10x3-M0 L2 - claude-code"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Jeśli korzystasz z innego narzędzia

Nie każde narzędzie agentowe działa w terminalu tak jak Claude Code, ale każde powinieneś oceniać przez podobny zestaw pytań. Interfejs może być inny, natomiast sprawczość agenta, koszt pracy i bezpieczeństwo nadal zostają po twojej stronie.

Zacznij od uprawnień. Sprawdź, kiedy narzędzie pyta o zgodę na edycję plików, uruchamianie komend, czytanie danych spoza katalogu projektu, korzystanie z sieci i podłączanie zewnętrznych integracji. Jeżeli istnieje tryb bez pytań o zgodę, traktuj go jako opcję do kontrolowanych eksperymentów, a nie domyślny sposób pracy na ważnym repozytorium. Jeśli zauważysz, że wybrana konfiguracja pt. Agent + Model wychodzi poza obszar roboczy, rozważ inne środowisko.

Potem przejrzyj komendy operacyjne. Szukaj odpowiedników poleceń do pomocy, wyboru modelu, sprawdzenia kontekstu, podglądu zmian, czyszczenia sesji, kompaktowania rozmowy i kontroli kosztów. To nie są ozdobniki dla power-userów, a raczej podstawowe metody kontroli.

Kolejny punkt to pamięć projektu. Sprawdź, czy narzędzie ma plik konfiguracyjny podobny do `CLAUDE.md`, reguły projektu albo stałe instrukcje dodawane do każdej sesji.

Istotne będzie też wsparcie dla konwencji stających się standardami, w tym `AGENTS.md` oraz `.agents/skills`. 

- [AGENTS.md](https://agents.md/) - standaryzacja onboardingu Agenta w projekcie
- [.agents/skills](https://agentskills.io/) - nowe możliwości i wiedza dla Agentów

Jeżeli szukasz alternatywy dla Claude Code, na dziś rekomendujemy dwa kierunki. Pierwszy to Codex z modelami GPT-5.*. Drugi to OpenCode połączony z wiodącymi modelami otwartymi, takimi jak Kimi K2.6 czy GLM-5.1. To zwykle bardziej ekonomiczna opcja.

W trakcie szkolenia poznasz też nasz benchmark narzędzi i modeli, który uzasadnia te rekomendacje. Bez benchmarku łatwo porównywać narzędzia po ekranach startowych i marketingu, a to nie jest najbardziej precyzyjna metoda pracy.

Nie zapomnij o politykach prywatności - sprawdź czy i kiedy kod trafia do procesu treningu modeli a także to, jakie limity są dostępne w subskrypcji, tzn. kiedy płacisz stałą kwotę, a kiedy według zużycia tokenów przez API.

W 10xDevs będziemy jeszcze mocno rozbrajać ten temat, bo agent bez kontroli budżetu potrafi być bardzo przekonujący... i bardzo drogi.

## Materiały dodatkowe

- *Claude Code overview* / Anthropic Docs / 2026 — https://code.claude.com/docs/en/overview
- *Claude Code quickstart* / Anthropic Docs / 2026 — https://code.claude.com/docs/en/quickstart
- *Claude Code setup* / Anthropic Docs / 2026 — https://code.claude.com/docs/en/setup
- *Slash commands* / Anthropic Docs / 2026 — https://docs.claude.com/en/docs/claude-code/slash-commands
- *Managing costs* / Anthropic Docs / 2026 — https://docs.claude.com/en/docs/claude-code/costs
- *Permissions* / Anthropic Docs / 2026 — https://docs.claude.com/en/docs/claude-code/iam
- *Using Claude Code: session management and 1M context* / Thariq Shihipar / Anthropic / 2026-04-15 — https://claude.com/blog/using-claude-code-session-management-and-1m-context
- *OpenCode* - https://opencode.ai/
- *Codex CLI* - https://developers.openai.com/codex/cli
