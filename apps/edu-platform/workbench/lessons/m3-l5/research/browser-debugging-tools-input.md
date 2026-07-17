# Wsad do m3-l5: Browser debugging z AI agentem

> **CORRECTION (2026-05-28):** The capability table below is WRONG about Playwright CLI/MCP console and network support. Verified against microsoft/playwright-mcp source:
> - Playwright CLI has `console` and `requests` commands (always available)
> - Playwright MCP has `browser_console_messages`, `browser_network_requests`, `browser_network_request` as **core** tools (no --caps flag needed)
> - BrowserTools MCP is abandoned (README: "THIS PROJECT IS NO LONGER ACTIVE"), last release March 2025, unpatched CVSS 9.8 vulnerability
> - **Conclusion: BrowserTools MCP adds zero unique value. Use Playwright CLI/MCP for all browser diagnostics.**

## Źródło

Pytanie z forum 10xDevs 3.0 (2026-05-28):

> "W jaki sposób dajecie możliwość zarządzania/testami w przeglądarce, aby mógł czytać logi w konsoli, network, klikać na stronie itp. Z czego korzystacie? Mcp dla chrome czy może macie jakiś inny flow"

## Dlaczego to trafia do m3-l5, nie do m3-l4

m3-l4 uczy **testowania E2E** — agent generuje i naprawia testy. Narzędzia (Playwright CLI, Playwright MCP) są zoptymalizowane pod automatyzację: snapshoty dostępności, klikanie po element refs, mockowanie sieci, generowanie testów.

Ale pytanie z forum dotyczy **debugowania**: agent widzi aplikację w przeglądarce, czyta console.log, sprawdza jakie requesty poleciały w Network, klika po stronie żeby zreprodukować buga. To nie jest testowanie — to diagnoza.

m3-l4 bridge do m3-l5 (draft, linia 461):
> "te trudniejsze przypadki, kiedy test E2E spada z nieoczywistego powodu i trzeba dojść od stack trace'a do fixa, to temat następnej lekcji."

Browser debugging tools to jedno z narzędzi, które agent ma do dyspozycji na drodze od "coś nie działa" do "mam fixa."

## Luka narzędziowa: co Playwright daje, a czego nie daje

| Potrzeba | Playwright CLI | Playwright MCP | BrowserTools MCP |
|----------|---------------|----------------|------------------|
| Klikanie, wypełnianie formularzy | ✅ element refs | ✅ narzędzia MCP | ❌ |
| Snapshoty dostępności | ✅ YAML na dysk | ✅ w kontekście | ❌ |
| Screenshoty + vision | ✅ `screenshot` | ✅ `--caps=vision` | ✅ `takeScreenshot` |
| Console logs / errors | ❌ | ❌ bezpośrednio | ✅ `getConsoleLogs`, `getConsoleErrors` |
| Network logs / errors | ❌ | Partial (`browser_route` = interception, nie inspection) | ✅ `getNetworkLogs`, `getNetworkErrors` |
| Mockowanie sieci | ❌ | ✅ `browser_route` | ❌ |
| Cookies / localStorage | ❌ (state-save/load) | ✅ pełna kontrola | ❌ |
| DOM element inspection | ❌ | ❌ | ✅ `getSelectedElement` |
| Token efficiency | ~27K/scenariusz | ~114K/scenariusz | zależy od ilości logów |

Kluczowy wniosek: **Playwright i BrowserTools MCP to komplementarne narzędzia**, nie konkurencyjne.

- **Playwright** = agent-as-user (klika, nawiguje, testuje, automatyzuje)
- **BrowserTools MCP** = agent-as-developer (czyta DevTools: console, network, DOM)

W kontekście debugowania agent potrzebuje obu: zreprodukować problem (Playwright) i zdiagnozować go (BrowserTools / console / network).

## Jak to pasuje do m3-l5 "od stack trace'a do fixa"

m3-l5 ma prowadzić learnera od awarii do rozwiązania. Browser debugging tools wchodzą na dwa etapy tego flow:

### 1. Reprodukcja

Agent musi zreprodukować problem. Jeśli bug jest w UI:
- Playwright CLI/MCP: agent otwiera stronę, klika, nawiguje → reprodukuje problem
- BrowserTools MCP: agent sprawdza czy w konsoli są errory, co poszło nie tak w Network

### 2. Diagnoza

Agent ma stack trace lub symptom. Potrzebuje danych diagnostycznych:
- Console logs: uncaught errors, warning, custom debug logs
- Network logs: 500 responses, CORS failures, timeout, wrong payload
- DOM state: element istnieje ale ma wrong attributes, hidden, disabled

### 3. Hipoteza i fix

Agent formułuje hipotezę na podstawie danych diagnostycznych, wprowadza fix, ponownie reprodukuje → sprawdza czy problem zniknął.

## Sugerowane umiejscowienie w m3-l5

Nie jako główny temat — jako **jedno z narzędzi diagnostycznych** obok:
- Stack trace analysis (core)
- Playwright trace viewer (`npx playwright trace`)
- Log analysis
- Debug-as-test workflow (pisanie testu jako sposobu reprodukcji)

Prawdopodobnie 1 podsekcja typu "Agent jako DevTools" lub "Browser-side debugging" w ramach większej sekcji o narzędziach diagnostycznych. Z tabelą porównawczą jak wyżej i 1 przykładem: learner ma bug w UI, agent otwiera stronę przez Playwright, czyta console logi przez BrowserTools MCP, diagnozuje problem, naprawia.

## Powiązane narzędzia do zbadania przy lesson-grounding

- **BrowserTools MCP** (github.com/anthropics/browsertools-mcp lub podobny) — getConsoleLogs, getConsoleErrors, getNetworkLogs, getNetworkErrors, getSelectedElement, takeScreenshot, wipeLogs
- **Playwright Trace Viewer** — `npx playwright show-trace trace.zip`, offline trace inspection bez browser tools
- **Playwright `page.on('console')`** — programmatic console log capture w test code (nie CLI/MCP)
- **`page.on('request')` / `page.on('response')`** — programmatic network inspection w test code
- **Chrome DevTools Protocol (CDP)** — low-level, Playwright abstracts it, Stagehand uses it directly

## Granica z m3-l4

m3-l4 mówi o Playwright MCP z `--caps=network,storage` w kontekście **testowania** (mockowanie sieci, vision verification). m3-l5 powinien mówić o browser tools w kontekście **debugowania** (czytanie logów, diagnoza). Ta sama przeglądarka, inny cel. Nie powtarzać setupu Playwright z m3-l4 — odwołać się jako reference.
