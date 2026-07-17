# Lesson Spec: m1-l5 — Od localhosta na produkcję

## Schema Context

- Course: 10xdevs-3
- Module: m1 — Agentic Environment
- Position: 5/5 (module), 5 (global)
- Depends on: m1-l4 — Agent Onboarding: Agents.md, AI Rules i feedback loops
- Prepares for: m2-l1 — Plan MVP: milestony, zależności i bezwzględne priorytety

## Prework Continuity

- Relevant prework lessons: [2.1] Agent w IDE, Terminalu czy w Chmurze; [2.3] Claude Code uprawnienia; [4.1] Tech Stack Overview; [4.2] Dobry i zły projekt kursowy
- Assumed from prework: Cloudflare jako rekomendowany hosting; agent ma uprawnienia do sieci i integracji; CI/CD to wymagany element dobrego projektu kursowego
- Deepened here: CLI/MCP jako dwie konkretne metody operability (prework tylko wzmianka); deliberatywny wzorzec wyboru infrastruktury; granica dostępu agenta do produkcji
- Avoid repeating: ogólna rekomendacja Cloudflare (4.1 — zakładana jako znana), CI/CD jako wymaganie projektu (4.2 — zakładane jako znane; tu operacjonalizowane przez platform-managed auto-deploy, **bez** własnych GHA pipeline'ów — te należą do m3)

## Lesson Job

M1-l5 zamyka Moduł 1 "Agentic Environment" przez realizację pierwszego wdrożenia produkcyjnego. Kursant przeszedł przez PRD (m1-l1), tech-stack i skille (m1-l2), bootstrap (m1-l3), agent onboarding przez AGENTS.md (m1-l4) — teraz wychodzi z localhosta. Lekcja uczy nie tylko jak wdrożyć, ale jak podjąć tę decyzję świadomie (research + anti-bias → infrastructure.md), jak agent może działać po wdrożeniu (CLI vs MCP) i jak ustalić granicę dostępu agenta do produkcji MVP.

## Thesis

Wyjście na produkcję to nie jednorazowe kliknięcie — to świadoma decyzja infra, deliberatywne wdrożenie z Plan Mode i konfiguracja tego, jak agent ma utrzymywać żywą aplikację.

## Learning Outcomes

- Kursant uruchamia `10x-infra-research` na swoim projekcie, przeprowadza cross-check przez ≥2 soczewki anti-bias przed wyborem platformy; efektem jest `infrastructure.md` z uzasadnionym wyborem.
- Kursant wdraża 10xCards (lub własny projekt) na Cloudflare używając Plan Mode jako struktury decyzji wdrożeniowej.
- Kursant wyjaśnia różnicę między CLI a MCP jako metodami agentowej operability i podłącza co najmniej jeden gotowy serwer MCP do sesji agenta.
- Kursant ustala i dokumentuje granicę dostępu agenta do produkcji MVP: ograniczone tokeny CLI, autoryzacja przez człowieka (nie przez agenta).

## Audience Starting Point

Kursant ma działające repo po bootstrapie (m1-l3) i skonfigurowanego agenta z AGENTS.md (m1-l4). Wie, że Cloudflare jest w rekomendowanym stacku (prework 4.1), ale nie wie jak podjąć tę decyzję deliberatywnie ani jak połączyć agenta z żywą infrastrukturą. Traktuje deployment jako "coś do zrobienia na koniec" — lekcja zmienia to postrzeganie.

## Behavioral Change

Kursant przestaje traktować wybór platformy jako guesswork lub default i zaczyna stosować wzorzec research → anti-bias → infrastructure.md → Plan Mode deploy za każdym razem, gdy projekt zmienia środowisko.

## Owned Concepts

- deliberatywny wzorzec wyboru infrastruktury: 10x-infra-research + anti-bias (devil's advocate, pre-mortem, unknown unknowns) → infrastructure.md
- infrastructure.md jako trzeci kontrakt w łańcuchu: prd.md (m1-l1) → tech-stack.md (m1-l2) → infrastructure.md (m1-l5)
- auto-deploy z integracji GitHub ↔ platforma (Cloudflare Pages) jako pierwsza produkcyjna pętla feedbacku po push; **bez własnych GHA pipeline'ów** — to temat m3
- agentic operability: CLI i MCP jako dwie metody nadawania agentowi narzędzi operacyjnych
- koncepcja MCP: klient/serwer, transport, gotowe serwery (np. Cloudflare MCP, Supabase MCP)
- granica dostępu agenta do produkcji: ograniczone tokeny CLI + autoryzacja przez człowieka

## References Only

- mechanika Plan Mode (m1-l2, m1-l3 — zakładana jako znana)
- AGENTS.md / agent onboarding (m1-l4 — zakładane jako znane)
- context engineering Write/Select/Compress/Isolate (prework 3.3)
- budowanie własnych serwerów MCP: OAuth, RPC (forward ref do późniejszego modułu)
- outer loop i feedback loop na poziomie jakości; własne GHA pipeline'y, approval gates, read-only diagnostyka CI (`gh run view --log-failed`) (m3)
- shared AI registry i team infra (m5-l3)

## Must Not Cover

- mechanika Plan Mode od zera (m1-l2, m1-l3)
- AGENTS.md / custom instructions / auto-memory (m1-l4)
- budowanie własnego serwera MCP (późniejszy moduł)
- OAuth / RPC MCP internals (późniejszy moduł)
- outer loop jako wzorzec jakości / architektura CI feedback loops (m3)
- własne GHA pipeline'y, custom workflows, approval gates, environment protection rules (m3)
- wybór tech-stacku (m1-l2)
- PRD authoring (m1-l1)
- planowanie MVP backlogu / milestony (m2-l1)
- Linux sandbox internals (m1-l3)

## Required Example Or Demo

10xCards wdrożone na Cloudflare Pages lub Workers — od scaffoldowanego repo (m1-l3) do działającego URL-a. Research poprzedzony `10x-infra-research` na `tech-stack.md` projektu; wynik: `infrastructure.md` z uzasadnionym wyborem Cloudflare i cross-checkiem przez soczewki anti-bias. Post-deployment: podłączenie Cloudflare MCP (lub innego gotowego serwera) do sesji agenta i demo operacji (np. sprawdzenie statusu deploymentu).

## Structural Logic Map

**Beat 1 — Bridge in: agent zna projekt, co poza localhostem?**
- **Question answered:** "Mam AGENTS.md, mam bootstrap — co teraz?"
- **Introduces:** wyjście z localhosta jako kolejny naturalny krok łańcucha m1; pytanie "gdzie" i "jak" jako decyzja, nie default
- **Depends on:** m1-l4 (AGENTS.md, agent skonfigurowany) i m1-l3 (repo na dysku)
- **Sets up:** dlaczego wybór platformy to deliberatywna decyzja
- **Diagram opportunity:** łańcuch artefaktów m1 do tej pory: prd.md (l1) → tech-stack.md (l2) → scaffolded repo (l3) → AGENTS.md (l4) → brakujące ogniwo: gdzie to działa?
- **Risk:** beat zbyt ogólny; musi od razu pokazać konkretny problem (kursant nie wie na jaką platformę, lub wybiera domyślnie bez refleksji)

**Beat 2 — Wybór platformy jako decyzja techniczna**
- **Question answered:** "Skoro Cloudflare jest w stacku, po co research?"
- **Introduces:** deliberatywny wzorzec: `context/foundation/tech-stack.md` jako input do `10x-infra-research`; czym różni się deliberatywny wybór od domyślnego
- **Depends on:** tech-stack.md z m1-l2/m1-l3 na dysku
- **Sets up:** uruchomienie skilla
- **Diagram opportunity:** potok decyzji: tech-stack.md → 10x-infra-research → scored comparison → anti-bias → infrastructure.md
- **Risk:** beat zaczyna uzasadniać dlaczego Cloudflare jest dobry, zamiast uczyć wzorca decyzji

**Beat 3 — 10x-infra-research: wywiad + research**
- **Question answered:** "Jak skill zbiera potrzebne informacje?"
- **Introduces:** wywiad z programistą (AskUserQuestion: tak/nie/nie wiem), web research agenta, scorowanie platform po 5 kryteriach agent-friendly
- **Depends on:** Beat 2 (input: tech-stack.md)
- **Sets up:** Anti-Bias cross-check
- **Diagram opportunity:** brak — sekwencja kroków skilla wystarczy jako lista
- **Risk:** beat staje się walkthroughiem UX skilla zamiast uczeniem wzorca; fokus na kryteriach oceny, nie na klikaniu

**Beat 4 — Anti-Bias cross-check (3 soczewki)**
- **Question answered:** "Dlaczego nie wystarczy jeden research?"
- **Introduces:** devil's advocate (co może pójść nie tak z top wyborem), pre-mortem (wyobraź sobie że za 3 miesiące żałujesz), unknown unknowns (co nie trafiło do scoringu); konkretne odpowiedzi dla Cloudflare jako przykład
- **Depends on:** Beat 3 (scored comparison jako wejście)
- **Sets up:** infrastructure.md jako output
- **Diagram opportunity:** brak — 3 pytania to lista; konkretne przykłady odpowiedzi są ważniejsze niż diagram
- **Risk:** beat abstrakcyjny bez przykładowych odpowiedzi dla Cloudflare; każda soczewka musi mieć przykład

**Beat 5 — infrastructure.md jako kontrakt**
- **Question answered:** "Co zostaje po researchu?"
- **Introduces:** infrastructure.md jako trzeci kontrakt w łańcuchu (prd.md → tech-stack.md → infrastructure.md); co plik zawiera: scoring, uzasadnienie, rejestr ryzyk
- **Depends on:** Beat 4
- **Sets up:** deployment z Plan Mode
- **Diagram opportunity:** łańcuch kontraktów plikowych: prd.md (m1-l1) → tech-stack.md (m1-l2) → infrastructure.md (m1-l5)
- **Risk:** kursant traktuje plik jako "automatycznie wygenerowany" — beat musi pokazać, że człowiek zatwierdza i uzupełnia

**Beat 6 — Deployment z Plan Mode**
- **Question answered:** "Jak deployować z agentem bez ryzyka przypadkowego nadpisania konfiguracji?"
- **Introduces:** Plan Mode dla deploymentu: input to infrastructure.md + tech-stack.md; agent generuje plan wdrożeniowy → człowiek zatwierdza → implementacja; weryfikacja działającego URL-a
- **Depends on:** Beat 5 (infrastructure.md gotowy)
- **Sets up:** auto-deploy z integracji GitHub ↔ platforma
- **Diagram opportunity:** Plan Mode flow: wsad (2 pliki) → plan zatwierdzony przez człowieka → implementacja agenta → URL na wyjściu
- **Risk:** powielenie mechaniki Plan Mode z m1-l2/m1-l3; zakładamy Plan Mode jako znane narzędzie — beat skupia się wyłącznie na "co dać na wejście" i "co sprawdzić na wyjściu"

**Beat 7 — Auto-deploy z GitHub integration: pierwsza produkcyjna pętla feedbacku**
- **Question answered:** "Co dzieje się po każdym pushu na mastera?"
- **Introduces:** platform-managed auto-deploy jako pierwsza automatyczna pętla po pierwszym wdrożeniu; connect repo do Cloudflare Pages w panelu → każdy push do mastera triggeruje build i deploy po stronie platformy; preview deploymenty per PR jako naturalny efekt integracji; weryfikacja że auto-deploy działa
- **Depends on:** Beat 6 (działający deployment)
- **Sets up:** sekcję agentic operability
- **Diagram opportunity:** brak — wystarczy krótka instrukcja konfiguracji w panelu
- **Risk:** beat urasta w tutorial GitHub Actions / custom CI; **w tej lekcji nie ma GHA i własnych pipeline'ów** — to temat m3. Zakres: "podłącz repo do platformy, push triggeruje deploy, koniec". Forward ref do m3 dla pełnych pipeline'ów.

**Beat 8 — CLI vs MCP: dwie metody agentowej operability**
- **Question answered:** "Jak agent może pomagać w utrzymaniu wdrożonej aplikacji?"
- **Introduces:** agentic operability jako koncepcja; CLI: agent wywołuje komendy przez Bash (npm, wrangler, gh); MCP: standaryzowany protokół klient/serwer — named tools przez protokół zamiast dowolnych komend; dlaczego MCP to inne podejście niż CLI
- **Depends on:** Beat 7 (jest co utrzymywać — działająca aplikacja)
- **Sets up:** demo gotowego serwera MCP
- **Diagram opportunity:** CLI vs MCP jako dwa tory: agent → Bash → system CLI (lewy) | agent → MCP client → MCP server → service API (prawy). Jeden diagram, dwie ścieżki.
- **Risk:** zbyt techniczna definicja MCP przed demo; kolejność: wpierw "co agent może zrobić z żywą aplikacją", potem "przez co to robi"

**Beat 9 — Demo gotowego serwera MCP**
- **Question answered:** "Jak to wygląda w praktyce?"
- **Introduces:** gotowy serwer MCP (Cloudflare MCP lub Supabase MCP); konfiguracja klienta; przykładowa operacja przez sesję agenta (sprawdzenie statusu deploymentu lub czytanie logów)
- **Depends on:** Beat 8 (konceptualna różnica CLI vs MCP)
- **Sets up:** sekcję granic dostępu
- **Diagram opportunity:** brak — demo wideo; tekst musi zawierać wystarczający snippet konfiguracyjny dla czytelnika bez wideo
- **Risk:** demo Cloudflare-specific nie transferuje dla kursantów na innym hoście; musi być wyjaśniony wzorzec, a Cloudflare jest tylko ilustracją

**Beat 10 — Granica dostępu agenta do produkcji**
- **Question answered:** "Czy agent ma teraz nieograniczony dostęp do mojej produkcji?"
- **Introduces:** wzorzec minimalnych uprawnień dla agenta; scope'owany token Cloudflare (tylko R/W do Pages, nie do DNS/Workers/Secrets); autoryzacja przez człowieka (nie wklejaj sekretów do okna rozmowy); forward reference: pre-prod separacja przy wzroście projektu
- **Depends on:** Beat 9 (agent właśnie podłączony do prod — właściwy moment na "watch out")
- **Sets up:** Bridge out / zamknięcie modułu
- **Diagram opportunity:** brak
- **Risk:** sekcja rozrasta się w tutorial IAM; zakres: jeden konkretny wzorzec + ogólna zasada + forward ref — nie więcej

**Beat 11 — Zamknięcie modułu + Bridge out**
- **Question answered:** "Co to oznacza dla mojego projektu i co dalej?"
- **Introduces:** podsumowanie Modułu 1 jako pełnego łańcucha (PRD → tech-stack → bootstrap → onboarding agenta → produkcja); bridge do m2-l1 — "masz URL na produkcji, czas zaplanować prawdziwe MVP"
- **Depends on:** wszystkie beaty
- **Sets up:** m2-l1 (Plan MVP: milestony)
- **Diagram opportunity:** łańcuch całego modułu 1: prd.md (l1) → tech-stack.md (l2) → scaffolded repo (l3) → AGENTS.md (l4) → infrastructure.md + żywy URL (l5)
- **Risk:** podsumowanie powtarza całą lekcję; musi być krótkie i konkretnie wskazywać na m2-l1

## Failure Mode To Disarm

Kursant deployuje "jak wszyscy" — domyślna platforma, config z dokumentacji, bez zrozumienia trade-offów. Kiedy projekt rośnie i platforma okazuje się złym wyborem, nie wie dlaczego podjął tę decyzję. Lekcja disarmuje przez `infrastructure.md` jako trwały dokument z uzasadnieniem — decyzja zapisana, możliwa do rewizji.

## Suggested Structure

1. **Intro: Mamy projekt — co poza localhostem?** — most z m1-l4, ustawienie pytania i tezy lekcji
   ```
   Previous: AGENTS.md (m1-l4) → this: wyjście na produkcję → next: deliberatywna decyzja infra
   Why here: bez tego beatu lekcja startuje bez kontekstu; musi linkować do łańcucha m1
   Must not introduce yet: mechanika deploymentu, MCP, security
   ```

2. **Sekcja 1: Research infrastruktury** — 10x-infra-research + anti-bias → infrastructure.md
   ```
   Previous: pytanie "gdzie?" postawione → this: deliberatywna decyzja infra → next: implementacja
   Why here: lekcja uczy wzorca decyzji, nie GUI-clickingu; research musi poprzedzać deploy
   Must not introduce yet: CLI/MCP, security, Plan Mode deployment
   ```

3. **Sekcja 2: Deployment z Plan Mode** — infrastructure.md + tech-stack.md → URL + platform-managed auto-deploy
   ```
   Previous: infrastructure.md gotowy → this: pierwsza implementacja → next: operability
   Why here: bez realnego deploymentu demo MCP i CLI nie mają przyczepności
   Must not introduce yet: MCP mechanics, security, agentic operability
   ```

4. **Deep Dive: CLI vs MCP** — koncepcja + demo gotowego serwera
   ```
   Previous: działający deployment → this: jak agent utrzymuje żywą aplikację → next: security
   Why here: po deploymencie kursant naturalnie pyta "co agent może zrobić z tym URL-em?"
   Must not introduce yet: security (budowanie napięcia do sekcji granic)
   ```

5. **Sekcja: Granica dostępu agenta do produkcji** — ograniczone tokeny + autoryzacja przez człowieka
   ```
   Previous: agent podłączony do prod → this: "watch out" → next: bridge out
   Why here: "watch out" musi być po tym jak agent dostał dostęp, nie przed — inaczej nie ma punktu odniesienia
   Must not introduce yet: pre-prod pipeline, team access policies (późniejszy moduł)
   ```

6. **Outro: Zamknięcie modułu + Bridge** — moduł 1 domknięty, przejście do m2-l1
   ```
   Previous: produkcja + operability skonfigurowane → this: moduł zamknięty, gotowi na MVP planning
   Must not introduce yet: milestony, backlog, architektura (m2)
   ```

## Video Placeholders

- **Video 1 (Sekcja 1 — Research):** Prowadzący uruchamia `10x-infra-research` na projekcie z `tech-stack.md`. Pokazuje wywiad (tak/nie/nie wiem), wyniki web research, scoringową tabelę platform i cross-check przez soczewki anti-bias. Efekt: `infrastructure.md` na dysku.
- **Video 2 (Sekcja 2 — Deployment):** Prowadzący używa Plan Mode z input: `infrastructure.md` + `tech-stack.md`. Pokazuje wygenerowany plan, zatwierdza go, przeprowadza deployment na Cloudflare Pages. Weryfikuje działający URL i konfiguruje auto-deploy.
- **Video 3 (Deep Dive — MCP):** Demo Cloudflare MCP podłączonego do sesji agenta. Agent wykonuje operację na żywej infrastrukturze. Prowadzący pokazuje konfigurację ograniczonego tokenu API i wyjaśnia dlaczego zakres dostępu ma znaczenie.

## Bridge In

M1-l4 zakończyło się skonfigurowanym agentem z AGENTS.md i regułami projektu. Projekt istnieje lokalnie, agent "zna" projekt. M1-l5 otwiera pytanie: "co poza localhostem?" — kursant ma wszystko co potrzebne, żeby po raz pierwszy wystawić aplikację publicznie.

## Bridge Out

Kursant opuszcza m1-l5 z działającym URL-em na Cloudflare i `infrastructure.md` w repozytorium. M2-l1 startuje od tego URL-a: "masz działającą aplikację — teraz zaplanujemy co naprawdę budujesz (milestony, zależności, priorytety)."

## Open Questions

- **Zakres demo MCP:** Cloudflare MCP jest naturalny przy deploymencie na Cloudflare. Co z kursantami na innym hoście? Czy pokazać dwa serwery (platform-specific + platform-agnostic, np. Supabase MCP) czy jeden Cloudflare-specific z adnotacją "wzorzec konfiguracji jest ten sam"?
- **Granulacja wzorca security:** Instrukcja "utwórz Cloudflare API token z scope R/W do Pages" jest Cloudflare-specific. Czy lekcja pokazuje to jako konkretny przykład z kodem, czy jako abstrakcyjny wzorzec transferowalny?
- **Eksponowanie kryteriów 10x-infra-research:** Skill definiuje 5 kryteriów agent-friendly dla platform. Czy lekcja ma je wyeksponować w tekście z przykładami, czy zakładać, że kursant przeczyta SKILL.md?

## Provisional Schema Proposal (needs human decision before updating lessons-schema.json)

```json
{
  "lessonId": "m1-l5",
  "globalOrder": 5,
  "moduleOrder": 5,
  "title": "Od localhosta na produkcję",
  "owns": [
    "deliberatywny wzorzec wyboru infrastruktury: 10x-infra-research + anti-bias → infrastructure.md",
    "infrastructure.md jako kontrakt decyzyjny (łańcuch: prd.md → tech-stack.md → infrastructure.md)",
    "auto-deploy z integracji GitHub ↔ platforma (Cloudflare Pages) jako pierwsza produkcyjna pętla feedbacku po push; **bez** GHA pipeline'ów (m3)",
    "agentic operability: CLI i MCP jako dwie metody nadawania agentowi narzędzi operacyjnych",
    "koncepcja MCP: klient/serwer, transport, gotowe serwery",
    "granica dostępu agenta do produkcji: ograniczone tokeny + autoryzacja przez człowieka"
  ],
  "referencesOnly": [
    "mechanika Plan Mode (m1-l2, m1-l3)",
    "AGENTS.md / agent onboarding (m1-l4)",
    "context engineering (prework 3.3)",
    "budowanie własnych serwerów MCP: OAuth, RPC (forward ref do późniejszego modułu)",
    "outer loop jako wzorzec jakości (m3)"
  ],
  "mustNotCover": [
    "mechanika Plan Mode od zera (m1-l2, m1-l3)",
    "AGENTS.md / custom instructions / auto-memory (m1-l4)",
    "budowanie własnego serwera MCP (późniejszy moduł)",
    "OAuth / RPC MCP internals (późniejszy moduł)",
    "outer loop jako wzorzec jakości / architektura CI feedback loops; własne GHA pipeline'y i approval gates (m3)",
    "wybór tech-stacku (m1-l2)",
    "PRD authoring (m1-l1)",
    "planowanie MVP backlogu / milestony (m2-l1)"
  ],
  "learningOutcomes": [
    "Kursant uruchamia 10x-infra-research na swoim projekcie i przeprowadza cross-check przez ≥2 soczewki anti-bias; efektem jest infrastructure.md z uzasadnionym wyborem.",
    "Kursant wdraża aplikację na Cloudflare używając Plan Mode jako struktury decyzji wdrożeniowej.",
    "Kursant wyjaśnia różnicę między CLI a MCP jako metodami agentowej operability i podłącza co najmniej jeden gotowy serwer MCP.",
    "Kursant ustala granicę dostępu agenta do produkcji MVP: ograniczone tokeny + autoryzacja przez człowieka."
  ]
}
```

## Side-Effect Ledger

New claims introduced:
- infrastructure.md jako kontrakt decyzyjny (analogia do PRD + tech-stack.md) — nowy artefakt w łańcuchu kursowym
- auto-deploy z integracji GitHub ↔ platforma jako pierwsza produkcyjna pętla feedbacku po push (bez framing outer loop i bez własnych GHA pipeline'ów — to temat m3)
- 3 soczewki anti-bias: devil's advocate, pre-mortem, unknown unknowns (z 10x-infra-research SKILL.md — do weryfikacji przed draftem)

Claims removed:
- metafora "inner loop → outer loop" usunięta (inner loop nie jest już tematem m1-l4; outer loop należy do m3)

Neighboring lesson references changed:
- m1-l4: bridge out musi być zaktualizowany — bez odwołania do "outer loop → m1-l5"; wystarczy "masz projekt lokalnie, m1-l5 wychodzi na produkcję"
- m3: outer loop jako wzorzec jakości należy do m3 — m1-l5 może forward-reference, ale nie może przywłaszczyć framing

Prework references used:
- [2.1] CLI jako środowisko universalne — rozwinięte w CLI vs MCP
- [2.3] Claude Code uprawnienia do sieci/integracji — rozwinięte do MCP koncepcji
- [4.1] Cloudflare w rekomendowanym stacku — zakładany jako znany, użyty jako deployment target
- [4.2] CI/CD jako wymaganie projektu — zakładane jako znane, operacjonalizowane

Prework concepts repeated intentionally:
- Cloudflare jako target (4.1) — powtórzony jako konkretny deployment target, nie jako nowa informacja

Potential duplicates:
- Plan Mode: ryzyko jeśli beat 6 tłumaczy mechanikę Plan Mode od zera (m1-l2, m1-l3)

Unsupported facts:
- Konfiguracja Cloudflare MCP — do grounding przed draftem; sprawdzić aktualny status (beta/GA) i dostępność
- 5 kryteriów agent-friendly z 10x-infra-research — do weryfikacji w SKILL.md przed draftem

Video/text mismatches:
(none na etapie spec)

Needs human decision:
- Zakres demo MCP: jeden serwer Cloudflare-specific vs. dwa (Cloudflare + platform-agnostic)
- Granulacja wzorca security: Cloudflare-specific z kodem vs. abstrakcyjny wzorzec
- Czy 5 kryteriów 10x-infra-research jest eksponowanych w tekście lekcji czy zakładanych z SKILL.md
