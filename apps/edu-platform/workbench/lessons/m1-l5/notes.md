# Od localhosta na produkcję

- Krótkie podsumowanie osiągnięć z lekcji 1-4
- Czym domykamy tydzień - opuszczeniem localhosta i wystawieniem aplikacji publicznie

## 1. Research platformy - agent i wiedza z sieci

omówienie pobrania i wykorzystania skilla z 10x-cli

- `10x-infra-research` - details - /Users/psmyrdek/dev/10x-toolkit/packages/ai-artifacts/skills/10x-infra-research/SKILL.md


- jako baza - utworzone w poprzedniej lekcji `context/foundation/tech-stack.md`
- Agent z dostępem do internetu i tool WebFetch (lub podobne) - zbieramy opracowania z sieci pod decyzje
- Wywiad z programistą - Tak / Nie / Nie wiem (tool AskUserQuestion lub podobne)
- Oczekiwania względem platformy - zdalny dostęp przez CLI / MCP (deploymenty, logi)
- Cross-check planu Anti-Bias Prompting na 3 przykładach z /Users/psmyrdek/dev/przeprogramowani-sites/projects/10x-assistant/source/13-1x6_efektywna_praca_z_ai_cz_2.html

Outcome: Mamy wybraną platformę - `context/foundation/infrastructure.md`

## 2. Przygotowanie i realizacja deploymentu z Plan Mode

- Wbudowany Plan Mode - oddzielenie zamiarów agenta od implementacji
- Wsad - cel, oczekiwania, referencje (`context/foundation/infrastructure.md`, `context/foundation/tech-stack.md`)
- Plan wdrożenia aplikacji na bazie delegowania do Agenta
- przeprowadzenie pierwszego wdrożenia
- można sprawdzić auto-deploy po commitach na mastera (wg preferencji)

## Deep Dive - CLI vs MCP - narzędzia dla Agenta

- agentic operability - agenci mogą nam pomóc utrzymywać wdrożoną aplikację (deployment, czytanie logów, sprawdzanie wersji, calle do bazy, etc.)
- jak agent korzysta z cli
- jak agent korzysta z mcp

watch out - dajemy agentowi dostęp do produkcji na potrzeby MVP - jak projekt się rozrośnie, wolelibyśmy wdrożyć pre-prod

- na aws / gcp etc. - tokeny cli z okrojonym dostępem i "console user" tylko do wybranych operacji

- autoryzacja - logowanie przez czlowieka, nie wklejaj sekretów do okna rozmowy z agentem
