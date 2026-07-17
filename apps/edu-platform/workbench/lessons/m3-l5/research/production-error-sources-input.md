# Wsad do m3-l5: Produkcyjne źródła błędów — Sentry i Wrangler

## Źródło

Notatki autorskie (2026-05-28):

> 4. Reagowanie na błędy
>    1. Sentry MCP or Sentry CLI
>    2. Wrangler MCP or CLI - pobieraj logi, zapnij się i daj mi znać jak coś się dzieje (push na proda lub realtime)

## Teza

m3-l5 uczy agenta diagnozować — a diagnoza wymaga danych. "Od stack trace'a do fixa" zakłada, że agent MA stack trace. Skąd go weźmie?

Dwa produkcyjne źródła komplementują lokalne narzędzia debugowania:

| Warstwa | Źródło danych | Narzędzie agenta | Co agent dostaje |
|---------|--------------|-------------------|-----------------|
| Lokalna: przeglądarka | Console/network logs | BrowserTools MCP | JS errors, failed requests, DOM state |
| Lokalna: testy | Spadły E2E test | Playwright trace | Stack trace, snapshot, timeline |
| Produkcja: errory | Monitoring | Sentry MCP / CLI | Stack trace, user context, breadcrumbs, frequency |
| Produkcja: logi | Runtime logs | Wrangler MCP / CLI | Request logs, worker errors, edge behavior |

## Sentry MCP / CLI

### Co daje agentowi

- Stack trace z production errora z pełnym kontekstem: user, browser, request URL, breadcrumbs
- Frequency i trend: "ten error pojawił się 47 razy w ostatniej godzinie po deploy"
- Grupowanie: Sentry grupuje duplikaty, agent widzi unikalny problem, nie szum
- Tags i custom context: jeśli app taguje errory (np. `course: 10xdevs-3`, `route: /external`), agent ma kontekst biznesowy

### Workflow w m3-l5

1. Sentry notification: "nowy error w produkcji" (lub agent poll'uje Sentry)
2. Agent czyta error: stack trace + request + breadcrumbs
3. Agent lokalizuje problem w codebase (grep, read)
4. Agent reprodukuje lokalnie (Playwright + BrowserTools) lub pisze test (debug-as-test)
5. Agent fixuje
6. Agent weryfikuje: test przechodzi, error nie wraca

### Narzędzia

- **Sentry MCP** — dostępny jako MCP server (`mcp__sentry__authenticate`). Agent ma bezpośredni dostęp do issues, events, stack traces.
- **Sentry CLI** (`sentry-cli`) — alternatywa CLI: `sentry-cli issues list`, `sentry-cli events list`. Mniej kontekstowe niż MCP, ale działa bez konfiguracji MCP.
- **Sentry API** — bezpośredni REST, agent może użyć `curl` lub `WebFetch`. Fallback jeśli ani MCP ani CLI nie jest dostępny.

### Granica

m3-l5 NIE uczy konfiguracji Sentry od zera (SDK deep dive, source maps pipeline, alert rules). Sentry jest skonfigurowany w 10xCards jako opcjonalna integracja (DSN pusty = Sentry wyłączony). Lekcja zakłada działający Sentry i uczy: jak agent CZYTA i REAGUJE na errory z Sentry. Konfiguracja SDK jest w `bug-sentry-wrangler-research.md`, sekcja 6.

## Wrangler MCP / CLI

### Co daje agentowi

- **`wrangler tail`** — realtime log stream z Cloudflare Workers. Agent widzi requesty, errory, console.log z produkcji na żywo.
- **`wrangler tail --format json`** — strukturalne logi, agent może parsować i filtrować.
- **Post-deploy monitoring** — "wrzuciłem deploy, tail'uję logi 2 minuty, sprawdzam czy nie lecą 500ki."
- **Reprodukcja edge-case'ów** — bug zgłoszony przez usera, agent tail'uje i czeka na ten sam request pattern.

### Workflow w m3-l5

1. Deploy (lub zgłoszenie buga)
2. `wrangler tail --format json | grep "ERROR"` — agent monitoruje
3. Error się pojawia — agent widzi request URL/method, console.log/warn/error output i exceptions (uwaga: wrangler tail NIE pokazuje response body ani HTTP status code — tylko worker outcome ok/error/canceled)
4. Agent lokalizuje problem
5. Fix → deploy → tail ponownie → error nie wraca

### Uniwersalność wzorca

Wrangler jest specyficzny dla Cloudflare, ale wzorzec jest uniwersalny:

| Stack | Narzędzie | Komenda agenta |
|-------|-----------|----------------|
| Cloudflare Workers | `wrangler tail` | `wrangler tail --format json` |
| Fly.io | `flyctl logs` | `flyctl logs --app myapp` |
| Vercel | `vercel logs` | `vercel logs <deployment-url>` |
| Kubernetes | `kubectl logs` | `kubectl logs -f deployment/myapp` |
| Docker | `docker logs` | `docker logs -f container-name` |
| AWS Lambda | `aws logs` | `aws logs tail /aws/lambda/fn --follow` |

m3-l5 powinien pokazać Wrangler (bo 10xCards jest na Cloudflare) ale explicite powiedzieć: "jeśli twój projekt jest na innym stacku, ten sam wzorzec — zapnij agenta na logi i pozwól mu reagować."

### Granica

m3-l5 NIE uczy konfiguracji Wranglera ani deployu na Cloudflare. To jest infrastruktura z wcześniejszych modułów (m1-l5, m2-l5). Uczy: jak agent CZYTA logi z produkcji i CO z nimi robi.

## Sugerowana struktura w m3-l5

Te dwa elementy razem z browser debugging tools tworzą sekcję "Źródła danych diagnostycznych" lub "Skąd agent bierze stack trace":

1. **Lokalne**: BrowserTools MCP (console, network) + Playwright trace (spadłe E2E)
2. **Produkcyjne**: Sentry (errory z monitoringu) + Wrangler (logi z runtime'u)
3. **Workflow**: error notification → read context → reproduce locally → fix → verify

Każde źródło daje agentowi inny typ danych, ale workflow jest ten sam: dane → hipoteza → reprodukcja → fix → weryfikacja.

## Powiązanie z bridge'em z m3-l4

m3-l4 kończy się na:
> "healer na zmianach logiki biznesowej maskuje buga [...] te trudniejsze przypadki to temat następnej lekcji"

m3-l5 podejmuje: "test E2E spadł. Skąd wiesz, że problem jest w logice, a nie w selektorze? Trace viewer mówi ci co. Sentry mówi ci że to samo dzieje się w produkcji. Wrangler mówi ci jak często."
