# Lesson Spec: m1-l2 — Od chatbota do Agenta: tech stack, skille i metaprompting

## Schema Context

- Course: 10xdevs-3
- Module: m1 — Agentic Environment
- Position: moduleOrder 2 / globalOrder 2
- Depends on: m1-l1 (Sokratejski dialog z Agentem; PRD jako kontrakt; własność `/10x-shape`, `/10x-prd`)
- Prepares for: m1-l3 (AI-Powered Bootstrap na bazie PRD + wybranego stacku)

## Prework Continuity

- Relevant prework lessons: `[1.2]` chatbot vs Agent vs harness, `[3.1]` LLM jako predykcja tokenów + degradacja kontekstu, `[3.2]` prompt jako kontrakt + hierarchia instrukcji (system → AGENTS.md → memory → **skille** → prompt), `[3.3]` context engineering Write/Select/Compress/Isolate, `[4.1]` agent-friendly stack jako koncept, `[4.2]` dobry projekt kursowy.
- Assumed from prework: definicje chatbot/Agent/harness, mental model "prompt to kontrakt", istnienie warstwy "skille" w hierarchii instrukcji, świadomość że okno kontekstowe jest budżetowane, koncept stacku przyjaznego agentowi, posiadany pomysł projektu i działający PRD z m1-l1.
- Deepened here: warstwa "skille" awansuje z jednego bulleta hierarchii do pełnoprawnego artefaktu z anatomią, modelem ładowania (progresywne ujawnianie), modelem bezpieczeństwa, pętlą autorską (metaprompting przez skill-creator) i sposobem konsumpcji z rejestrów.
- Avoid repeating: nie definiujemy ponownie agenta ani harnessu, nie rysujemy hierarchii instrukcji od zera, nie wykładamy Write/Select/Compress/Isolate jako teorii, nie powtarzamy listy kryteriów agent-friendly stacku z `[4.1]`.

## Lesson Job

Pierwsza lekcja głównego kursu, w której PRD z m1-l1 zostaje *zużyty*. Lekcja podnosi "skille" z bulleta w hierarchii instrukcji do pełnoprawnego mechanizmu pracy: pokazuje czym Agent Skills są jako format pakowania wiedzy, jak je konsumować, jak odróżnić skill od jednorazowego promptu i jak przejść od jednorazowego promptu do ułożonego z kontraktów łańcucha. Tytułowe "od chatbota do Agenta" znaczy tu operacyjnie: zamiast hand-pisać prompt na każde nowe zadanie, składasz powtarzalne skille w pipeline, którego pierwszym widocznym ogniwem jest `/10x-tech-stack-selector` przekształcający PRD w `tech-stack.md` gotowe dla m1-l3. (Inne warstwy — AGENTS.md/CLAUDE.md i MCP — są zarezerwowane dla m1-l4 i m1-l5; m1-l2 ich nie wprowadza.)

Drugim, równie ważnym zadaniem lekcji jest zasadzenie ramy pod resztę kursu: **Agent Skills to kluczowa abstrakcja w pracy z agentem w programowaniu** — oficjalnie zdefiniowany format pakowania wiedzy proceduralnej (Anthropic + ekosystem narzędzi go honoruje), w praktyce najczęściej używany sposób, w jaki zespoły pakują powtarzalne workflow-y dla swoich agentów, i abstrakcja szersza w zasięgu niż MCP — bo MCP adresuje tylko warstwę narzędziową/RPC, a skille orkiestrują całe procesy ponad tym (i ponad AGENTS.md). Z tej perspektywy m1-l2 wprowadza **główny budulec 10xWorkflow** prezentowanego w modułach 2–5 (`/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review` itd.) i **budulec własnego toolkitu kursanta**: każdy następny krok pracy ma swój skill, każdy skill ma swój kontrakt, a kursant w trakcie kursu uczy się je *konsumować*, w m1-l2 widzi *jak są zbudowane*, a do końca kursu *składa z nich własny zestaw* — to jest operacyjna definicja AI-native software engineering w tym programie.

## Thesis

Gdy potrafisz nazwać kontrakt wejściowy i kontrakt wyjściowy kolejnego kroku w pracy z Agentem, przestajesz pisać jednorazowe prompty i zaczynasz konsumować lub pisać skille — bo tylko skill robi z tej pary kontraktów coś replayable, czytelnego dla człowieka i taniego w kontekście.

## Learning Outcomes

- Kursant czyta SKILL.md innego skilla i potrafi nazwać konkretne rzeczy, które skill robi, a jednorazowy prompt nie: progresywne ujawnianie, kontrakt wejścia/wyjścia jako plik na dysku, parametryzowane uruchomienie po nazwie, replayability w nowej sesji.
- Kursant instaluje skill ze sprawdzonego źródła po audycie SKILL.md (security + progressive-disclosure check) i uruchamia go w swoim środowisku (10xCLI / Claude Code / Codex).
- Kursant uruchamia `/10x-tech-stack-selector` na własnym PRD z m1-l1 i otrzymuje `tech-stack.md` gotowy dla m1-l3, rozumiejąc, że PRD → skill → `tech-stack.md` to kontrakt, nie luźna rozmowa.
- Kursant rozumie metaprompting przez `skill-creator`: gdy znany jest kontrakt wejściowy i wyjściowy kolejnego kroku łańcucha, meta-skill pomaga wygenerować szkielet skilla zamiast pisania go ręcznie.
- Kursant rozpoznaje, kiedy zadanie zasługuje na skill (powtarzalny krok łańcucha z nazwanym wejściem i wyjściem), a kiedy wystarczy jednorazowy prompt (jednorazowa eksploracja, jednorazowe wyjaśnienie, jednorazowa edycja) — i nie traktuje skilla jak wymyślnego promptu ani promptu jak ułomnego skilla.

## Audience Starting Point

Kursant po m1-l1 ma działający PRD i mglistą intuicję, że "kolejnym krokiem jest wybór stacku, a potem bootstrap". W prework `[3.2]` widział "skille" jako jeden z bulletów hierarchii instrukcji, ale nie ma jeszcze obrazu, co to konkretnie jest, czym różni się od jednorazowego promptu, jak to się instaluje i kiedy *warto* po skill sięgnąć zamiast napisać prompt. Może podejrzewać, że "skille = nowy hype" (kolejna abstrakcja) i bać się, że zaraz każe mu się pisać własną bibliotekę zanim w ogóle uruchomi pierwszy projekt. W prework `[1.2]` zinternalizował, że Agent ≠ chatbot, ale nadal hand-pisze prompty zamiast składać kontrakty.

## Behavioral Change

Kursant przestaje ręcznie pisać duże prompty na powtarzalne kroki w łańcuchu projektowym i zaczyna sięgać po istniejący skill (po audycie SKILL.md) lub zarysowywać własny przez `skill-creator`, kiedy potrafi nazwać kontrakt wejścia i wyjścia danego kroku.

## Owned Concepts

- Agent Skills jako format pakowania wiedzy: anatomia (SKILL.md, `references/`, `scripts/`, `assets/`), limit ~500 linii w SKILL.md, model bezpieczeństwa (skille mogą wykonywać kod — instaluj tylko ze sprawdzonych źródeł).
- Progresywne ujawnianie jako uzasadnienie kosztowe: trzy poziomy ładowania (metadane ~100 tokenów → SKILL.md ~5000 tokenów na aktywację → zasoby on-demand) i powiązanie tego z budżetem kontekstu z prework `[3.1]`/`[3.3]`.
- Ostry kontrast skill vs jednorazowy prompt + reguła decyzyjna "powtarzalny krok łańcucha czy jednorazowa rozmowa": skill ma anatomię (SKILL.md, references, allowed-tools), kontrakt wejścia/wyjścia jako plik na dysku, parametryzowane uruchomienie po nazwie, progresywne ujawnianie (nie obciąża okna kontekstowego, gdy nie pracuje), replayability w nowej sesji; prompt jest jednorazową, kontekstualną instrukcją, która znika z sesją i nie ma kontraktu, którego mógłby zużyć kolejny krok. Inne warstwy (AGENTS.md/CLAUDE.md, MCP) są zarezerwowane dla m1-l4 i m1-l5; m1-l2 ich nie wprowadza.
- Konsumpcja skilli: rejestry (`anthropics/skills`, `skills.sh`, vendorowe paczki jak `supabase/agent-skills`, `vercel-labs/agent-skills`), instalacja (`npx skills add <owner/repo>`), audyt SKILL.md przed użyciem (cel, allowed-tools, źródła, autor), uruchomienie w 10xCLI / Claude Code / Codex.
- Worked example PRD → `/10x-tech-stack-selector` → `tech-stack.md` na bazie 10xCards: before (ad-hoc prompt "wybierz mi stack do tego PRD") vs after (skill jako kontrakt — `recommended_defaults`, cztery bramki agent-friendly, `bootstrapper_confidence`, schemat hand-offu) — dowód, że skill nie jest kosmetyczną otoczką nad promptem, tylko że *robi* z PRD-a coś, czego prompt nie robi.
- Łańcuch `/10x-shape → /10x-prd → /10x-tech-stack-selector → /10x-bootstrapper` jako operacyjne znaczenie "od chatbota do Agenta": każdy krok ma kontrakt wejścia i wyjścia, każdy kontrakt jest plikiem na dysku, łańcuch jest replayable.
- **Skille jako budulec 10xWorkflow i własnego toolkitu kursanta** — pozycjonowanie skilli w skali całego kursu: moduł 1 przygotowuje środowisko do pracy z agentem (PRD → skill → stack → bootstrap → agent onboarding → deployment); moduł 2 wprowadza workflow implementacyjny i tam kursant zaczyna *operacyjnie* korzystać z łańcucha skilli (`/10x-research` — eksploracja kodu 2–4 równoległymi sub-agentami z syntezą do `research.md`, `/10x-frame` — rozdzielenie obserwacji od domniemanej przyczyny, mapa wymiarów problemu, testowanie hipotez agentami i sokratejskie pytania prowadzące do `frame.md`, `/10x-plan` — plan ze skalowanym pytaniem (4–15 pytań zależnie od złożoności i dostarczonych artefaktów upstream) produkujący `plan.md` + `plan-brief.md`, `/10x-implement` — egzekucja fazami z śledzeniem dotkniętych plików, gate'em manualnej weryfikacji, rytuałem commitów i wpisywaniem SHA do Progress, `/10x-tdd` — test-first z planu, `/10x-impl-review` — dwa równoległe agenty (drift detection + safety/quality scan) z 6-wymiarową oceną i interaktywną triażacją findingsów). Forma artefaktu jest w m1-l2 zinternalizowana raz; w m2–m5 dochodzi *zawartość* kolejnych skilli i ich kontraktów. Kluczowe: kursant nie uczy się nowej abstrakcji w każdym module — uczy się kolejnego ogniwa. Równolegle zaczyna zbierać własny toolkit: skille zewnętrzne, którym ufa po audycie, plus szkielety pisane przez `skill-creator` na potrzeby jego stacku, jego domeny, jego powtarzalnych zadań — to operacyjna definicja AI-native software engineering w tym kursie.
- Metaprompting przez `skill-creator` jako preview: gdy znasz kontrakt wejścia i kontrakt wyjścia następnego kroku (np. `/10x-bootstrapper` czyta `tech-stack.md`, pisze scaffolded project + `verification.md`), `skill-creator` pomaga wygenerować szkielet SKILL.md zamiast pisać go ręcznie. Pełne pisanie skilla jest poza tą lekcją — tu pokazujemy, że ta droga istnieje.
- **Ocena istniejącego stacku pod kątem agent-friendliness przez `/10x-stack-assess`** — ścieżka brownfield: te same 4 quality gates (typed, convention-based, popular in training data, well-documented) które `/10x-tech-stack-selector` używa do *wyboru* stacku, tu służą jako lens *ewaluacyjny* istniejącego projektu. Wynik: `stack-assessment.md` z per-komponentowym scoringiem, zidentyfikowanymi lukami i planem kompensacji (jakie wpisy do `CLAUDE.md`/`AGENTS.md` uzupełnią braki). Kursant brownfield nie wybiera stacku — ocenia swój i dowiaduje się, gdzie agent będzie miał tarcia.

## References Only

- chatbot vs Agent vs harness (prework `[1.2]`).
- hierarchia instrukcji (prework `[3.2]`) — wzmianka, nie redrawing.
- Write/Select/Compress/Isolate (prework `[3.3]`) — jednozdaniowe uzasadnienie progresywnego ujawniania.
- kryteria agent-friendly stacku jako koncept (prework `[4.1]`).
- pełny Q-flow `/10x-tech-stack-selector` i rejestr 25 starterów (wzmianka, nie tour).
- `/10x-bootstrapper` jako kolejny krok łańcucha (m1-l3).

## Must Not Cover

- AGENTS.md / CLAUDE.md, custom instructions, /init, hierarchia instrukcji jako osobny temat, hooki, auto-memory, taksonomia user vs project vs area rules — wszystko to jest m1-l4. m1-l2 nie wprowadza ich definicji ani nie kontrastuje ich z skillem; może w jednym zdaniu odesłać "do tego dochodzimy w m1-l4".
- MCP (Model Context Protocol): serwery, klienci, OAuth, RPC, projektowanie własnego serwera — to jest m1-l5 ("Deployment z Agentem: CI/CD, MCP i CLI"). m1-l2 nie buduje kontrastu skill vs MCP; może w jednym zdaniu odesłać "MCP omawiamy w m1-l5".
- Pełna taksonomia warstw konfiguracji agenta (skill / AGENTS.md / MCP / prompt) — porzucona w tej wersji speca. m1-l2 ogranicza kontrast do **skill vs jednorazowy prompt**, bo prompt jest jedyną warstwą, którą kursant zna z preworku `[3.2]` i którą da się odpowiedzialnie kontrastować z skillem bez zapowiedzi nie-omówionych mechanizmów.
- Bootstrap projektu, CLI scaffolding (`create-next-app`, `npm create astro`), cwd strategies, conflict policy, weryfikacja po-scaffoldowa — m1-l3.
- Pełny tour rejestru 25 starterów i czterech bramek jakości w `/10x-tech-stack-selector` — pokazujemy że istnieją, nie wykładamy ich.
- "Czym jest dobry PRD" / mechanika `/10x-shape` / `/10x-prd` — m1-l1.
- Wybór modelu na bazie benchmarków, modele rozumujące (prework `[3.5]`).
- Tour po 10xCLI / instalacja toolkitu od zera — minimalne uruchomienie należy do m1-l1; tu zakładamy, że kursant ma działający 10xCLI po m1-l1.

## Required Example Or Demo

Centralne demo: PRD `10xCards` (`/Users/admin/code/10xCards/context/foundation/prd.md`) → `/10x-tech-stack-selector` → `tech-stack.md` (`/Users/admin/code/10xCards/context/foundation/tech-stack.md`).

Inscenizacja:

1. **Ad-hoc prompt** — prowadzący wkleja PRD do nowej sesji agenta z otwartym promptem "ok, wybierz mi stack do tego projektu". Pokazujemy, co się sypie: brak kontraktu, brak agent-friendly gates, brak `bootstrapper_confidence`, brak pliku, który m1-l3 mógłby przeczytać. Wynik mógłby być sensowny, ale nie jest powtarzalny.
2. **Ten sam PRD przez skill** — `/10x-tech-stack-selector @context/foundation/prd.md`. Pokazujemy skróconą ścieżkę standard-path: priors z PRD, Q0 z rekomendowanym domyślem, `tech-stack.md` z frontmatter (`starter_id`, `bootstrapper_confidence`, `language_family`, `has_auth`/`has_ai`). Akcent: wynikiem jest plik z kontraktem — m1-l3 wie, jak go przeczytać.
3. **Skok na anatomię skilla** — otwieramy SKILL.md `/10x-tech-stack-selector`, pokazujemy frontmatter (`name`, `description`, `allowed-tools`), strukturę katalogu (`references/starter-registry.yaml`, `references/decision-flow.md`), zasadę "rich rationale stays in conversation; the file hand-off is minimal". Łączymy z kontrastem skill vs prompt: prompt zniknąłby z tą sesją; skill ma `description`, dzięki któremu agent wie *kiedy* po niego sięgnąć, ma `references/`, które ładują się dopiero w razie potrzeby (progresywne ujawnianie), i ma kontrakt wyjścia jako plik na dysku.
4. **Metaprompting preview** — pokazujemy `anthropics/skills/skill-creator` (lub jego polski odpowiednik z 10x-toolkitu) jako meta-skill: "tu jest kontrakt wejścia (`tech-stack.md`), tu jest kontrakt wyjścia (zbootstrapowany projekt + `verification.md`), wygeneruj mi szkielet skilla `/10x-bootstrapper`". Pełnego pisania skilla tu nie robimy — to jest haczyk do rozszerzonego tutoriala metapromptingu w m2 lub m3, gdy kursant zobaczy więcej skilli z 10xWorkflow w działaniu i ma już repertuar kontraktów do naśladowania.
5. **Prompt-or-skill picker** — krótkie ćwiczenie: 4-5 zadań ("popraw literówkę w README", "wytłumacz, co robi ta funkcja w pliku X", "wybierz mi stack do tego PRD", "wygeneruj plan implementacji feature'a logowania", "podsumuj mi tę długą sesję czatu", "co byś tu zmienił, żeby było czytelniej"), kursant decyduje: czy to powtarzalny krok łańcucha z nazwanym wejściem i wyjściem (sięgaj po skill — istniejący lub `skill-creator`), czy jednorazowa rozmowa (napisz prompt i ruszaj dalej). Reguła decyzyjna: gdy łapiesz się na pisaniu *trzeciego* podobnego promptu, to znak, że tam żyje skill.
6. **Forward-looking map 10xWorkflow** — krótka mapa łańcucha skilli z opisem kluczowych mechanizmów (sub-agenty, mapa hipotez, skalowane pytania, rytuał commitów, triażacja findingsów). Explicit framing: moduł 1 przygotowuje środowisko (stack, bootstrap, agent onboarding, deployment); moduł 2 wprowadza te skille jako codzienne narzędzia na realnych zadaniach w projekcie kursanta. Akcent: każdy z nich to *ten sam format* co `/10x-tech-stack-selector`; różni się tylko zawartość kontraktu wejścia/wyjścia. Kursant wychodzi z lekcji ze świadomością, że uczenie się reszty kursu = uczenie się kolejnych ogniw, a nie nowej abstrakcji za każdym razem.

Drugorzędne pomocnicze przykłady (referencje, nie tour): `supabase/agent-skills` jako przykład zewnętrznego, vendorowego skilla z best-practices Postgresa; `vercel-labs/react-best-practices` jako przykład skilli zorientowanych na audyt jakości. Każdy z dwóch zdań — żeby pokazać, że łańcuch chain-style (10x-toolkit) i always-on best-practices (vendor) to dwa różne kształty skilli.

**Zadanie domowe (akcent kończący lekcję):** kursant uruchamia `/10x-tech-stack-selector` na *własnym* PRD z m1-l1 (greenfield) LUB `/10x-stack-assess` w katalogu swojego istniejącego projektu (brownfield). Demo prowadzącego na 10xCards daje replayability i wspólny punkt odniesienia w grupie; samodzielne uruchomienie zamyka pętlę "PRD → skill → artefakt na dysku" jako rzecz, której kursant *dotknął* własnymi rękami przed wejściem w m1-l3. Bridge In do m1-l3 zakłada, że kursant greenfield ma swój `tech-stack.md`, a kursant brownfield ma `stack-assessment.md` z planem kompensacji.

## Failure Mode To Disarm

**Sięganie po jednorazowy prompt na powtarzalny krok łańcucha** — i jego lustrzane odbicie: traktowanie skilla jak wymyślnego promptu (wklejanie długiej instrukcji w czat zamiast uruchomienia istniejącego skilla, nadpisywanie jego workflowu w sesji, ignorowanie kontraktu wyjścia). Kursant po m1-l1 ma PRD i naturalny odruch "wkleję go w czat, niech mi powie, co dalej" — to działa raz, ale niszczy replayability i robi z każdego kroku w łańcuchu osobną improwizację. Lekcja rozbraja to przez (a) ostry paragraf "co skill *robi*, czego prompt nie zrobi" oparty na progresywnym ujawnianiu i kontrakcie wyjścia, (b) prompt-or-skill picker jako ćwiczenie, (c) heurystykę trzeciego promptu ("jeśli łapiesz się na pisaniu trzeciego podobnego promptu — tam żyje skill"). Powiązanie z m1-l3: bez tej dyscypliny `/10x-bootstrapper` w m1-l3 dostanie hand-pisany opis stacku zamiast `tech-stack.md` i łańcuch się rozjedzie.

**Brownfield: pomijanie oceny stacku, bo "ja znam swój projekt"** — kursant z istniejącym projektem przeskakuje `/10x-stack-assess`, bo zakłada, że skoro sam wybrał stack, to zna jego słabe strony. W praktyce luki w quality gates (brak typów, niestandardowe konwencje, mało popularne narzędzia w danych treningowych) nie są widoczne bez systematycznej oceny — i agent będzie generował gorszy kod bez kompensacji w `CLAUDE.md`. Lekcja rozbraja to przez (a) worked example z widocznymi lukami w quality gates, (b) kontrast: tech-stack-selector *wybiera* stack pod agenta, stack-assess *diagnozuje* istniejący i daje plan naprawczy, (c) powiązanie z m1-l3 — `/10x-health-check` w m1-l3 działa lepiej, jeśli ma `stack-assessment.md` jako punkt odniesienia.

## Suggested Structure

1. **Wstęp** — od chatbota do Agenta operacyjnie: w m1-l1 mamy PRD; co dalej? Jednorazowy prompt "wybierz mi stack" vs replayable kontrakt. Postawienie tezy.
2. **Core — Czym jest Agent Skill** — anatomia SKILL.md, progresywne ujawnianie (powiązanie z prework `[3.3]` jednym akapitem), `references/scripts/assets`. Bez tour po jednym konkretnym pliku.
3. **Core — Skill vs jednorazowy prompt + prompt-or-skill picker** — co skill *robi*, czego prompt nie zrobi (anatomia, progresywne ujawnianie, kontrakt wejścia/wyjścia jako plik, parametryzowane uruchomienie po nazwie, replayability). Reguła decyzyjna "powtarzalny krok łańcucha czy jednorazowa rozmowa" + heurystyka trzeciego promptu. Krótki quiz-jak-ćwiczenie (4-5 sytuacji prompt-or-skill). Jedno zdanie pod koniec sekcji: "istnieją też inne warstwy konfiguracji agenta — AGENTS.md/CLAUDE.md w m1-l4, MCP w m1-l5 — w tej lekcji ich nie wprowadzamy".
4. **Core — Konsumpcja skilli** — rejestry (anthropics/skills, skills.sh, supabase, vercel-labs), instalacja, audyt SKILL.md przed użyciem, model bezpieczeństwa.
5. **Core — Worked example: PRD → tech-stack.md** — before/after na 10xCards, skok na SKILL.md `/10x-tech-stack-selector`, dlaczego skill robi z PRD-a coś, czego ad-hoc prompt nie robi, co m1-l3 dostaje na wejściu.
6. **Core — Ocena istniejącego stacku (brownfield)** — `/10x-stack-assess` jako ścieżka dla kursanta z istniejącym projektem: te same 4 quality gates jako lens ewaluacyjny (nie selekcyjny), `stack-assessment.md` z planem kompensacji, kontrast z tech-stack-selector, powiązanie z `/10x-health-check` w m1-l3. Diagram podwójnej ścieżki: greenfield (tech-stack-selector → bootstrapper) vs brownfield (stack-assess → health-check), zbieżność w m1-l4.
7. **Core — Skille jako budulec 10xWorkflow i własnego toolkitu** — mapa łańcucha (`/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review`) z opisem mechanizmów każdego skilla i akcentem "to ten sam format, tylko inna zawartość kontraktu". Framing temporalny: moduł 1 = przygotowanie środowiska, moduł 2 = operacyjne użycie łańcucha na realnych zadaniach. Definicja AI-native software engineering w skali tego kursu: nie pojedyncze prompty, tylko zarządzany zestaw skilli, który rośnie wraz z kursantem. Szczegółowy reference: `references/10x-workflow-skills.md`.
8. **Deep Dive — Metaprompting preview przez skill-creator** — kiedy znasz kontrakt wejścia i wyjścia kolejnego kroku, możesz zarysować skill zamiast pisać go ręcznie. Pokaz na `/10x-bootstrapper`-as-target. Pełne autorstwo nie należy do tej lekcji — rozszerzony tutorial wraca w m2 lub m3.
9. **Materiały Dodatkowe** — `anthropics/skills` (overview + best-practices), `skills.sh` (rejestr), `supabase/agent-skills` blog, vercel-labs `react-best-practices` blog, prework `[3.2]`/`[3.3]` jako kontekst.

## Video Placeholders

- Powitanie + sytuacja w łańcuchu: "PRD jest, co dalej? Dziś zamieniamy jednorazowe prompty na skille."
- Live walkthrough: ad-hoc prompt "wybierz mi stack" na 10xCards PRD → frustracja → ten sam PRD przez `/10x-tech-stack-selector` → `tech-stack.md` na ekranie z widocznym frontmatter.
- Otwarcie SKILL.md `/10x-tech-stack-selector` w edytorze i przejście palcem po `description`, `allowed-tools`, sekcji `Workflow` — żeby kursant zobaczył, że skill to czytelny dla człowieka markdown, nie czarne pudełko.
- Krótkie demo `skill-creator`: pokaz na ekranie, jak meta-skill generuje szkielet SKILL.md dla `/10x-bootstrapper`-as-target. Wprost zaznaczyć, że pełne autorstwo to materiał dalszy.

## Bridge In

m1-l1 zostawił kursantowi `prd.md` jako kontrakt wejściowy. Lekcja zaczyna od pytania "co dalej?" i pokazuje, że pierwszy realny konsument PRD jest skillem, a nie czatem. Z prework `[3.2]` pożycza jeden bullet ("skille jako warstwa hierarchii") i awansuje go do tematu lekcji. Z prework `[3.3]` pożycza intuicję, że okno kontekstowe trzeba projektować — progresywne ujawnianie skilli to operacyjne narzędzie do tego.

## Bridge Out

Lekcja kończy się artefaktem na dysku: `tech-stack.md` (greenfield) lub `stack-assessment.md` (brownfield). Greenfield kursant wie, że kolejnym ogniwem łańcucha jest `/10x-bootstrapper`, który `tech-stack.md` *czyta*. Brownfield kursant wie, że jego artefaktem jest `stack-assessment.md` z planem kompensacji, a kolejnym krokiem jest `/10x-health-check` w m1-l3. Obie ścieżki zbiegają się w m1-l4 (agent onboarding) z równoważnym kontekstem. m1-l3 nie powtarza anatomii skilli, bo ta jest już zinternalizowana. m1-l4 (AGENTS.md / CLAUDE.md) i m1-l5 (MCP) dostają przygotowany grunt: kursant rozumie skille jako pełnoprawny artefakt, więc m1-l4 i m1-l5 mogą wprowadzić swoje warstwy *w odniesieniu do* skilla, nie zamiast definicji skilla.

Szerzej: m1-l2 zostawia całemu kursowi ramę "ucz się kolejnych ogniw, a nie nowych abstrakcji". Moduł 1 kończy przygotowanie środowiska (bootstrap w m1-l3, agent onboarding w m1-l4, deployment w m1-l5). Moduł 2 wprowadza workflow implementacyjny — i tam kursant zaczyna operacyjnie korzystać z `/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-impl-review` na realnych zadaniach w swoim projekcie. Każdy z nich konsumuje wcześniejszy artefakt i produkuje nowy. Kursant przestaje pytać "co to za nowy mechanizm" i zaczyna pytać "jaki ma kontrakt wejścia, jaki wyjścia". Pod koniec kursu ma własny toolkit (mieszankę zewnętrznych skilli i szkiców pisanych przez `skill-creator`), który traktuje jak osobistą bibliotekę powtarzalnych workflowów — co jest operacyjną definicją AI-native software engineering w tym programie.

## Open Questions

- **Skala metapromptingu (decyzja kuratorska).** W tej wersji `skill-creator` jest preview, nie tutorial. Czy w przyszłej iteracji m1-l2 chcemy pełne autorstwo skilla wyodrębnić do osobnej lekcji w module 5 (team workflow) jako "Shared AI Registry: jak pisać skille zespołowe", czy zostawić na poziomie preview na zawsze? Nie blokuje draftu m1-l2. Decyzja: robimy preview w tej lekcji, wracamy w m2 lub m3 z rozszerzonym tutorialem. Decyzja: Tutaj robimy preview, a bardziej rozbudowany tutorial robimy w m2 lub m3.
- **Cytować SkillsBench czy nie.** Numery 27%/13% są świeże, niezweryfikowane, autor anonimowy ("xdotli"), 8 połączonych zadań. Ryzyko nadinterpretacji. Propozycja: wzmianka jednym zdaniem jako "powstaje pierwszy benchmark", bez liczb, do potwierdzenia w lesson-grounding. Decyzja: Do wywalenia, dane nie są jeszcze zbyt wiarygodne.
- **Worked example: 10xCards czy projekt kursanta.** 10xCards jako demo prowadzącego ma plus (gotowe artefakty, real PRD), minus (kursant nie poczuł go w ręku). Alternatywa: kursant uruchamia skill na *własnym* PRD z m1-l1. Sugestia: prowadzący demonstruje na 10xCards (replayability), a *zadanie domowe* to uruchomienie na własnym PRD. Decyzja: Tutaj pokazujemy na 10xCards, ale prosimy kursantów, żeby uruchomili na własnym PRD.
- **Schema enrichment proposal — do zapisania w lessons-schema.json przy następnej iteracji.** Provisional values dla m1-l2 (`owns`, `referencesOnly`, `mustNotCover`, `learningOutcomes`) są spisane w sekcji "Schema enrichment proposal" poniżej. Sam plik schemy nie jest tym specem zmieniany.

## Schema Enrichment Proposal (Needs Human Decision)

Provisional values do zapisania w `lessons-schema.json` przy najbliższym schema-update step:

- **owns:** (9 pozycji) Agent Skills jako format pakowania (SKILL.md, references/scripts/assets, security model); progresywne ujawnianie jako uzasadnienie kosztowe (3 poziomy ładowania); ostry kontrast skill vs jednorazowy prompt + prompt-or-skill picker (heurystyka trzeciego promptu); konsumpcja skilli z rejestrów (anthropics/skills, skills.sh, supabase, vercel-labs) z audytem SKILL.md przed instalacją; worked example PRD → `/10x-tech-stack-selector` → `tech-stack.md` na 10xCards (before/after); łańcuch `/10x-shape → /10x-prd → /10x-tech-stack-selector → /10x-bootstrapper` jako operacyjne "od chatbota do Agenta"; metaprompting przez `skill-creator` jako preview pętli autorskiej (gdy znany kontrakt wejścia/wyjścia kolejnego kroku); pozycjonowanie skilli jako kluczowej, oficjalnie zdefiniowanej abstrakcji w pracy z agentem w programowaniu (najczęściej używanej w praktyce, większej w zasięgu niż MCP); **skille jako budulec 10xWorkflow (`/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review` w m2–m5) i własnego toolkitu kursanta jako operacyjna definicja AI-native software engineering w tym kursie**.
- **referencesOnly:** chatbot vs Agent vs harness (`[1.2]`); hierarchia instrukcji (`[3.2]`); Write/Select/Compress/Isolate (`[3.3]`); kryteria agent-friendly stacku (`[4.1]`); pełny Q-flow `/10x-tech-stack-selector` i rejestr 25 starterów; `/10x-bootstrapper` jako kolejny krok (m1-l3); kolejne skille łańcucha (`/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review`) jako forward-looking mapa — pełne mechaniki w m2–m4.
- **mustNotCover:** AGENTS.md/CLAUDE.md, custom instructions, /init, hooki, auto-memory, taksonomia rules-vs-memory (m1-l4); MCP — serwery, klienci, OAuth, RPC, projektowanie własnego serwera (m1-l5); pełna taksonomia warstw skill / AGENTS.md / MCP / prompt — porzucona w tej wersji, m1-l2 ogranicza kontrast do skill vs jednorazowy prompt; bootstrap projektu, CLI scaffolding, cwd strategies, conflict policy (m1-l3); pełny tour rejestru 25 starterów i czterech bramek jakości; mechanika `/10x-shape` / `/10x-prd` (m1-l1); wybór modelu na bazie benchmarków (`[3.5]`); instalacja 10xCLI od zera (m1-l1).
- **learningOutcomes:** patrz sekcja "Learning Outcomes" wyżej (5 pozycji).

## Side-Effect Ledger

- **New claims introduced:**
  - Agent Skills są formatem pakowania wiedzy z progresywnym ujawnianiem na trzech poziomach (metadane → SKILL.md → zasoby).
  - Operacyjne znaczenie "od chatbota do Agenta" w m1-l2: składanie skilli w replayable łańcuch zamiast hand-pisania promptów.
  - Prompt-or-skill picker + heurystyka trzeciego promptu jako reguła decyzyjna dla wyboru między jednorazową rozmową a powtarzalnym krokiem łańcucha. (Pełna taksonomia czterech warstw świadomie *odrzucona* w tej wersji speca, żeby nie pre-emptować m1-l4 i m1-l5.)
  - `/10x-tech-stack-selector` jest pierwszym realnym konsumentem PRD i pierwszym widocznym ogniwem łańcucha skilli w kursie.
  - Metaprompting przez `skill-creator` jako preview pętli autorskiej, gdy znane są kontrakty wejścia i wyjścia.
  - **Agent Skills są kluczową abstrakcją w pracy z agentem w programowaniu: oficjalnie zdefiniowanym, najczęściej używanym w praktyce formatem pakowania wiedzy proceduralnej, szerszym w zasięgu niż MCP (skille adresują orkiestrację workflowów ponad serwerami; MCP adresuje tylko warstwę narzędziową/RPC).**
  - **Agent Skills są głównym budulcem 10xWorkflow prezentowanego w modułach 2–5 (`/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review`) oraz własnego toolkitu kursanta — operacyjna definicja AI-native software engineering w tym kursie.**
- **Claims removed:** (none — m1-l2 było puste w schemie v1).
- **Neighboring lesson references changed:**
  - m1-l1 już deklaruje, że m1-l2 jest pierwszym konsumentem PRD i prowadzi wybór tech-stacku — ten spec to potwierdza i operacjonalizuje przez konkretne demo na 10xCards.
  - m1-l3 dostaje na wejściu `tech-stack.md` w schemacie z `references/handoff-schema.md`; m1-l2 nie wchodzi w bootstrap, ale eksplicytnie zostawia plik z kontraktem.
  - m1-l4 (AGENTS.md/CLAUDE.md) i m1-l5 (MCP) dostają czysty grunt: warstwa "skille" jest zoperacjonalizowana, więc obie kolejne lekcje mogą wprowadzić swoje warstwy *w odniesieniu do* skilla, nie zamiast definicji skilla.
  - m2–m5 dostają forward-looking ramę: m1-l2 zapowiada (`/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review`) jako *kolejne ogniwa tego samego formatu* — kolejne lekcje nie tłumaczą "co to skill", tylko "jaki kontrakt wejścia/wyjścia". Ryzyko: jeśli któryś z tych skilli zmieni nazwę przed RC, trzeba zaktualizować mapę w m1-l2.
- **Prework references used:** `[1.2]`, `[3.1]` (jednozdaniowo, dla kosztów kontekstu), `[3.2]`, `[3.3]`, `[4.1]`, `[4.2]` (jako kontekst projektu).
- **Prework concepts repeated intentionally:** "skille jako warstwa hierarchii" (`[3.2]`) — celowo pożyczone i awansowane do tematu lekcji; nie redrawing, tylko deepening.
- **Potential duplicates:**
  - Z m1-l4 i m1-l5 — taksonomia warstw zostaje *u nich*. m1-l2 owns wyłącznie kontrast skill vs jednorazowy prompt; m1-l4 wprowadza AGENTS.md/CLAUDE.md i taksonomię rules-vs-memory; m1-l5 wprowadza MCP. Granica do utrzymania w drafcie i RC: ani jedno zdanie definiujące AGENTS.md ani MCP; jedynie *odesłania* do m1-l4 i m1-l5.
  - Z prework `[3.2]` — sekcja Core "Czym jest skill" nie powtarza hierarchii instrukcji; tylko awansuje jeden bullet ("skille") do pełnoprawnego artefaktu.
  - Z m1-l3 — ryzyko, że Deep Dive przez przypadek pokaże fragment bootstrapu. Granica: m1-l2 kończy na `tech-stack.md` na dysku, nigdy nie odpala scaffolda.
- **Unsupported facts:**
  - Liczby z `skills.sh` ("ponad 25 609 umiejętności") — szybko się zmieniają, używać tylko jako "tysiące" / "duże repozytorium" w drafcie.
  - Adopcja narzędzi (Cursor, Gemini wspierają standard) — do potwierdzenia w lesson-grounding przed pojawieniem się w drafcie jako twierdzenie.
  - Forward-looking mapa skilli (`/10x-research`, `/10x-frame`, `/10x-plan`, `/10x-implement`, `/10x-tdd`, `/10x-impl-review`) — istnieją dziś w `10x-toolkit/packages/ai-artifacts/skills/`, ale przypisanie ich do konkretnych modułów (m2–m5) w drafcie wymaga sprawdzenia z aktualną wersją `lessons-schema.json` przed RC, żeby nie zapowiedzieć skilla, którego dany moduł nie omawia.
  - Pozycjonowanie skilli jako "kluczowej, oficjalnej, najczęściej używanej, szerszej w zasięgu niż MCP abstrakcji w pracy z agentem" — wymaga grounding-pass przed pojawieniem się w drafcie jako twardy claim. Akceptowalne źródła: oficjalna dokumentacja Anthropica (claim "official spec"), `skills.sh` jako sygnał skali ("najczęściej używana w praktyce") oraz źródła kontrastujące Skills/MCP (np. notatki kursanta w `1-agent-skills/skills-vs-rest/`). Bez grounding-pass w drafcie wystarczy ostrożniejszy ton ("jeden z głównych", "centralna abstrakcja w 10xWorkflow") zamiast superlatywu.
- **Video/text mismatches:** (none — scenariusz wideo jeszcze nie istnieje).
- **Needs human decision:** schema enrichment — kiedy zaktualizować `lessons-schema.json` provisional values dla m1-l2 (osobny krok poza tym specem). Pozostałe Open Questions zostały rozstrzygnięte: metaprompting → preview tutaj, rozszerzony tutorial w m2/m3; SkillsBench → wycięty, dane jeszcze niewiarygodne; worked example → demo na 10xCards + zadanie domowe na własnym PRD kursanta.
