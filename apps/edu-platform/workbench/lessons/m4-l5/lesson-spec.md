# Lesson Spec: m4-l5 — Modernizacja legacy z DDD: wydzielaj domeny, potem deleguj Agentowi

> Editorial contract, zsynchronizowany wstecznie z `lesson-draft.md` (draft = źródło prawdy, back-prop 2026-06-06).
> Anchored w `lessons-schema.json` (`owns` ×5), `notes.md`, `lesson-grounding.md`.
> Prowadzący przykład: **asynchroniczna generacja fiszek w 10xCards** (zablokowane w `notes.md`).

## Schema Context

- Course: 10xdevs-3 (pl)
- Module: m4 — Large scale & legacy projects
- Position: moduleOrder 5 / globalOrder 20 · status: drafted
- Depends on: **m4-l4** — *Refaktoryzacja z Agentem: testy, zmiany, weryfikacja* (owns: Strangler Fig, Branch by Abstraction, Mikado Method, archetypy PoEAA)
- Prepares for: **m5-l1** — *Twój pierwszy Agent zespołowy: SDK, koszty, metryki*
- Ostatnia lekcja modułu m4.

> **Uwaga (back-prop):** wcześniejsza wersja specu wiązała tę lekcję ze „5-elementowym raportem architektonicznym (element ⑤)" i odznaką **10xArchitect**. Draft tego wątku NIE zawiera, więc został wycofany ze specu i ze schematu (decyzja użytkownika, 2026-06-05: „na razie to usuńmy, będę raz jeszcze opisywał i to wyrównam"). Spina raportu modułu jest do ponownego rozstrzygnięcia osobnym krokiem.

## Prework Continuity

- Relevant prework lessons: AI-as-ally/tutor + chatbot→agent→harness; cykl pracy *eksploracja → plan → implementacja → weryfikacja*; role modeli (*koder do egzekucji, architekt do planowania/architektury*); szablony pracy (refaktor, eksploracja bez edycji).
- Assumed from prework: rama „człowiek jest właścicielem i obrońcą decyzji" (reuse **verbatim**); model jako partner-architekt do planowania pod niepewnością; konwencja świeży wątek → plan → implementacja.
- Deepened here: prework uczy *cyklu pracy*; tu pokazujemy, że **przed planem trzeba odkryć domenę** — DDD/Event Storming jako brakujący krok „discovery" przed eksploracją/planem. Prework NIE wprowadza DDD ani Event Stormingu → ta lekcja je **owns**.
- Avoid repeating: nie re-tłumaczymy czym jest Agent/harness ani cyklu plan→implementacja (prework + m2). W sekcji „Wsad do dalszej refaktoryzacji" *wykorzystujemy* ten cykl, nie uczymy go od nowa.

## Lesson Job

Domknąć moduł „legacy & large scale" przejściem od **„refaktoruj kod" (m4-l4) do „odkryj domenę ukrytą w kodzie"**. Uczeń bierze projekt po MVP (przykład: 10xCards) i z Agentem w roli **DDD-coacha** wykonuje cztery konkretne ruchy, każdy oparty o gotowy, niczego nie zakładający prompt lub narzędzie: (1) destyluje i uspójnia ubiquitous language, (2) wyciąga rdzeniowy niezmiennik w agregat-strażnik, (3) odcina przeciekającą zależność Anti-Corruption Layerem, (4) prowadzi mini-warsztat Event Storming na wspólnym whiteboardzie. Produkty tych ruchów (`context/domain/*.md`, `board.json`) to nie cel sam w sobie — to **wsad do drugiego dużego cyklu „post-MVP"**, który uczeń oddaje sprawdzonej pętli `/10x-shape → /10x-roadmap → /10x-research → /10x-plan`. Lekcja domyka moduł i stanowi rampę do pracy zespołowej w M5.

## Thesis

Najtrudniejszą modernizacją nie jest przeniesienie kodu, lecz **odkrycie domeny, której kod nigdy nie nazwał** — a AI jest tu najsilniejsze jako *coach modelujący* (destylator języka, projektant niezmiennika i ACL, moderator warsztatu), nie jako autor decyzji. Powstałe artefakty DDD **zasilają** znaną z kursu pętlę planowania, a nie ją zastępują.

## Learning Outcomes

- Uczeń potrafi **wydobyć i uspójnić ubiquitous language** projektu, którego nie pisał, w dwóch trybach — symulowany wywiad z ekspertem domenowym oraz konfrontacja dokumentów kontekstowych (PRD) z realnym kodem — używając gotowego promptu do destylacji, którego produktem jest **mapa rozjazdów model-vs-kod** (`01-domain-distillation.md`).
- Uczeń potrafi **wskazać rdzeniowy niezmiennik domenowy i zaprojektować — gotowym promptem — jego egzekwowanie w jednym agregacie-strażniku**: metody z preconditions, nazwane błędy domenowe, atomowość w jednej transakcji (`02-invariant-aggregate-refactor.md`).
- Uczeń potrafi **zidentyfikować przeciekającą zależność zewnętrzną i zaprojektować Anti-Corruption Layer** (value object + wąski port + adapter) ze sprawdzalnym kryterium izolacji — grep po nazwie pakietu zwraca wyłącznie adapter (`03-anti-corruption-layer.md`).
- Uczeń potrafi **przeprowadzić mini-warsztat Event Storming z Agentem-moderatorem** na wspólnym whiteboardzie `event-storming-canvas` (board.json jako jedyne źródło prawdy, SSE), wyprowadzić hotspoty i **podać powstałe artefakty DDD jako wsad do drugiego cyklu „post-MVP"** przez `/10x-shape`, `/10x-roadmap`, `/10x-research`, `/10x-plan`.

## Audience Starting Point

Doświadczony programista po m4-l1…l4: ma już mapę projektu i pracował nad refaktoryzacją z Agentem. Zna cykl pracy z Agentem z prework/m2. Prawdopodobnie **myli „uporządkowanie kodu" z „uporządkowaniem domeny"**, traktuje DDD jako ciężki, „religijny" formalizm (agregaty, repo, warstwy) i nie wie, że LLM potrafi obniżyć próg wejścia do destylacji języka, projektu niezmiennika/ACL i Event Stormingu. Może też zakładać, że async/kolejki to „enterprise overkill" dla małej apki.

## Behavioral Change

Zanim programista każe Agentowi planować zmianę w nieznanym module, **najpierw przeprowadza z nim szybką sesję odkrycia domeny** (destylacja języka + niezmiennik + ACL + Event Storming), a dopiero wyprowadzone stąd artefakty wpuszcza jako wsad w pętlę roadmap → research → plan.

## Owned Concepts

- **Ubiquitous language — destylacja** (Evans): słownik domeny wyciągnięty gotowym promptem z dokumentów kontekstowych ORAZ z kodu; produkt = mapa rozjazdów **model-vs-kod** + ranking refaktoru (`01-domain-distillation.md`). Dwa tryby pozyskania: (a) symulowany wywiad z ekspertem domenowym (chatbot-level, video) — ręczny czat **lub** zautomatyzowany dwumodelowy wywiad narzędziem **`agent-forum`** (programista ↔ ekspert, opcjonalny `summarizer` destyluje brief domenowy do `summary.md`); (b) konfrontacja PRD↔kod z promptem (hands-on). Zasada nadrzędna: **granice językowe ujawniają granice kontekstów** (problem „3xAccount").
- **Niezmiennik → agregat-strażnik** (Evans/Vernon): reguła, która MUSI być zawsze prawdziwa, dziś „rozsmarowana" po warstwach; gotowy prompt odkrywa listę niezmienników, ocenia je na trzech osiach (rdzeniowość / rozsmarowanie / egzekwowanie), wybiera #1 i projektuje agregat: metody z preconditions, **nazwane błędy domenowe** (fail-fast, nie „połykanie"), repozytorium, **atomowość w jednej transakcji** (`02-invariant-aggregate-refactor.md`).
- **Anti-Corruption Layer** (Evans): cienka warstwa na granicy z przeciekającą zależnością; **value object** jako jedyne miejsce wiedzy o kształcie zależności + **wąski port** (interfejs w języku domeny) implementowany przez **adapter**. Sprawdzalne kryterium sukcesu: `grep` po nazwie pakietu zwraca wyłącznie pliki adaptera (`03-anti-corruption-layer.md`). Przykład: `ts-fsrs` jako przeciekający `Card`.
- **Event Storming z Agentem-moderatorem** (Brandolini): gramatyka karteczek (zdarzenia past-tense, komendy, aktorzy, hotspoty), fazy od `chaotic-exploration` przez `timeline` i `hotspots` po `aggregates`. Realizowane na **`event-storming-canvas`** — bezzależnościowej apce, gdzie człowiek i Agent pracują na tym samym stanie (`board.json`, jedyne źródło prawdy) w czasie rzeczywistym przez SSE; `CLAUDE.md` repo ustawia Agenta w roli moderatora.
- **AI-as-DDD-coach + handoff do drugiego cyklu (pattern lekcji)**: Agent jako destylator języka, projektant niezmiennika/ACL i moderator warsztatu; produkty (`context/domain/*`, `board.json`) jako **wsad** do drugiego cyklu „post-MVP" przez `/10x-shape`, `/10x-roadmap`, `/10x-research`, `/10x-plan`. DDD **zasila** znaną pętlę, nie zastępuje jej; człowiek pozostaje właścicielem decyzji.

## References Only

- **Pełny katalog Context Mappingu poza ACL** (Conformist, Open Host Service, Published Language, Shared Kernel, Customer/Supplier; Evans/Vernon) — wolno *nazwać* lub odesłać do Deep Dive, **nie uczymy**. Draft realnie pokazuje tylko **ACL**.
- **Destylacja subdomen Core / Supporting / Generic** — pojawia się wyłącznie *wewnątrz* promptu destylacji (KROK 2), nie jako osobno wykładany temat.
- **Encje vs value objects, reference-by-identity, eventual consistency, „jeden agregat na transakcję"** (Vernon) — lekkie tło niezmienników/agregatów; głębiej w Deep Dive.
- **Transactional Outbox** (Richardson) — *idea* trwałego rekordu + przetwarzania out-of-band (DB-backed job, nie broker); uzasadnia *dlaczego* async ma sens, **nie implementujemy**.
- **Strangler Fig / Branch by Abstraction / Mikado** (Fowler; **owned by m4-l4**) — wolno *nazwać* dla ciągłości, **nie uczyć**.
- **10x-roadmap + cykl research → plan → implementacja** (m2, prework) — w sekcji „Wsad do dalszej refaktoryzacji" *reużywamy* jako mechanizm drugiego cyklu; nie re-tłumaczymy.

## Must Not Cover

- Pełna, kodowa implementacja agregatu, ACL lub async pipeline w 10xCards — lekcja zostaje na poziomie **promptu/planu**; build jest **delegowany** do drugiego cyklu, nie pokazywany krok-po-kroku.
- Nauczanie strategii migracji (Strangler Fig, Branch by Abstraction, Mikado) — to **m4-l4**.
- Brokery (Kafka/RabbitMQ), pełny event-sourcing, CQRS, mikroserwisy — jawnie poza zakresem (`lesson-grounding.md` „Claims To Avoid").
- Agenci zespołowi / SDK / koszty / metryki — to **m5-l1**.
- SRS/`ts-fsrs`, auth, deck CRUD, rate-limit i GC jako tematy implementacyjne (mogą paść jako przykład przecieku lub hotspot, ale ich nie rozwiązujemy).
- Pełny kurs i kanon DDD (agregaty na pięć warstw, spór o repozytoria) — celowo „tyle DDD, ile potrzeba".

## Required Example Or Demo

Jeden kręgosłup przez całą lekcję: **asynchroniczna generacja fiszek w 10xCards**. Konkretne zaczepienia:

- **Kolizja języka jako hak:** „sesja generacji" istnieje w PRD jako byt z cyklem życia, ale w kodzie to luźny identyfikator na propozycjach; ten sam byt nazywa się `draft` / „propozycja" / `cards` / „kandydat" (jeden byt, cztery nazwy → problem „3xAccount").
- **`agent-forum` w domenie SRS:** konfig `threadName: "spaced-repetition-interview"`, programista (`gpt-4o-mini`) ↔ ekspert SRS (`claude-sonnet-4.6`), `summarizer` → brief domenowy; trzyma kręgosłup fiszek/SRS także w trybie zautomatyzowanego wywiadu.
- **Niezmiennik:** „sesja finalizuje się dopiero wtedy, gdy każda wygenerowana propozycja została rozstrzygnięta — zaakceptowana albo odrzucona"; dziś reguła jest „wszędzie i nigdzie", bo nie ma bytu `GenerationSession`.
- **ACL:** `ts-fsrs` jako przeciekający `Card` (pola `stability`, `difficulty`, `due`, `state`) — typ biblioteki ląduje w bazie, w odpowiedzi API i w propsach komponentu Svelte; ryzyko wciągnięcia biblioteki do bundla klienta.
- **Event Storming:** hotspoty procesu generacji — błąd modelu, częściowo zaakceptowana sesja, timeout generacji.

## Structural Logic Map

> Kolejność *language-first*: headline-hotspot jest kolizją języka, więc język jest rampą do reszty. Po języku idą dwa „taktyczne" ruchy (niezmiennik, ACL), potem warsztat scalający proces, na końcu handoff do drugiego cyklu.

**Sekcja 1 — Od „refaktoruj kod" do „odkryj domenę"**
- Beat: przejście od pytania *jak bezpiecznie zmienić ten kod?* (m4-l4) do *czy ten kod odpowiada temu, jak działa biznes?*; DDD jako soczewka, nie ceremoniał; AI jako coach, nie wyrocznia; „tyle DDD, ile potrzeba".
- Sets up: pierwsze narzędzie coacha — uspójnienie języka.
- Risk: ześlizg w teoretyczny wykład DDD; natychmiast wejść na 10xCards.

**Sekcja 2 — Najpierw język: dwa sposoby na ubiquitous language**
- Beat: (a) **symulowany wywiad z ekspertem domenowym** (chatbot-level, video) — z podrozdziałem „Od ręcznego czatu do zautomatyzowanego wywiadu" pokazującym **`agent-forum`** (dwa modele: programista ↔ ekspert, `rounds`, opcjonalny `summarizer` → `summary.md`); (b) **konfrontacja PRD ↔ realny kod** gotowym **promptem do destylacji** → `01-domain-distillation.md` (mapa rozjazdów model-vs-kod).
- Introduces: ubiquitous language; „granice językowe ujawniają granice kontekstów"; narzędzie `agent-forum`; prompt-artefakt #1.
- Diagram opportunity: tabela „termin → znaczenie → warstwa → kolizja" (przykład „3xAccount").
- Risk: dwa tryby mogą spuchnąć; (a) krótko jako ilustracja (+ `agent-forum` jako opcjonalna automatyzacja), (b) główny hands-on.

**Sekcja 3 — Invariants albo niezmienniki: tego przestrzegaj**
- Beat: reguła rozsmarowana po warstwach → agregat-strażnik; gotowy **prompt #2** odkrywa niezmienniki, ocenia na trzech osiach, wybiera #1 i projektuje egzekwowanie → `02-invariant-aggregate-refactor.md`.
- Introduces: niezmiennik; agregat jako granica spójności; preconditions; nazwane błędy domenowe; atomowość transakcji.
- Depends on: kolizja `GenerationSession` z Sekcji 2.
- Risk: nie ześlizgnąć się w pełną implementację — zostajemy na planie refaktoru.

**Sekcja 4 — Anti-Corruption Layer, czyli przeciwko szkodnikom**
- Beat: przeciekająca zależność (`ts-fsrs`) → value object + port + adapter; gotowy **prompt #3** ze sprawdzalnym kryterium grep → `03-anti-corruption-layer.md`.
- Introduces: ACL; value object jako jedyne miejsce wiedzy o kształcie zależności; wąski port; kryterium izolacji.
- Depends on: rama „granice" z Sekcji 2–3.
- Diagram/Video: iframe **ddd-prompts** — wyniki trzech sesji DDD w 10xCards.
- Risk: tool-specificity (`ts-fsrs`) — uczyć *patternu* izolacji, nie SRS.

**Sekcja 5 — Interaktywne warsztaty DDD z event-storming-canvas**
- Beat: wiedza, która nigdy nie trafiła do plików, wychodzi przy warsztacie; **Event Storming** z Agentem-moderatorem na `event-storming-canvas` (board.json + SSE); fazy `chaotic-exploration` → `hotspots`.
- Introduces: gramatyka Event Stormingu; AI-as-whiteboard (wspólny stan w czasie rzeczywistym); hotspoty jako kandydaci do dalszej analizy.
- Depends on: język i niezmienniki z wcześniejszych sekcji (warsztat je weryfikuje).
- Diagram/Video: iframe **ddd-mentor** — sesja moderacji na żywej tablicy.
- Risk: nie zgubić, że hotspoty to dowody z procesu, nie zmyślenia; narzędzie to *pattern*, nie produkt.

**Sekcja 6 — Wsad do dalszej refaktoryzacji**
- Beat: cztery artefakty + tablica to **wsad** do **drugiego dużego cyklu „post-MVP"**; te same skille (`/10x-shape`, `/10x-roadmap`, `/10x-research`, `/10x-plan`) przyjmują dokumenty DDD jako parametr; mechanika „kontekst z góry" (mniej pytań w `/10x-plan`). Mapowanie artefakt → etap cyklu.
- Question answered: „Mam te dokumenty — co z nimi realnie robię dalej?"
- Depends on: artefakty z Sekcji 2–5; cykl pracy z prework/m2.
- Risk: scope-theft z m2 — trzymać jako *reuse/handoff*, nie tutorial; forward-reference organicznie, bez promocyjnego „następny krok".

## Failure Mode To Disarm

Uczeń każe Agentowi „zaprojektuj/zrefaktoruj architekturę generacji" **bez uprzedniego uspójnienia języka i odkrycia procesu** — dostaje wiarygodnie brzmiący, ale oderwany od domeny plan (utrwala kolizję draft/candidate, projektuje wokół nieistniejącego bytu albo wpycha brokera w apkę o low QPS). Lekcja obnaża to: dopiero destylacja + niezmiennik + warsztat ujawniają brakujący `GenerationSession` i właściwe granice — i to **człowiek** wybiera kanoniczne nazwy i granice, a Agent je tylko operacjonalizuje.

## Suggested Structure

1. **[intro, bez nagłówka]** — rama: refaktor → discovery; AI-as-coach; „tyle DDD, ile potrzeba".
2. **Od „refaktoruj kod" do „odkryj domenę"** — dwa pytania (jak zmienić vs czy zgodne z biznesem).
3. **Najpierw język: dwa sposoby na ubiquitous language** — wywiad (video; ręczny czat + `agent-forum`) + PRD↔kod (prompt #1).
4. **Invariants albo niezmienniki** — prompt #2, agregat-strażnik.
5. **Anti-Corruption Layer** — prompt #3, value object/port/adapter; iframe ddd-prompts.
6. **Interaktywne warsztaty DDD z event-storming-canvas** — warsztat na żywej tablicy; iframe ddd-mentor.
7. **Wsad do dalszej refaktoryzacji** — handoff do drugiego cyklu post-MVP.
8. **🧑🏻‍💻 Zadania praktyczne** (3 prompty + opcjonalna sesja canvas) → **🔎 Deep Dive** (kiedy wprowadzać DDD; pięć mitów; halucynacje ekspertów i cross-check) → **📚 Materiały dodatkowe**.

> **Luki do uzupełnienia (back-prop ledger, 2026-06-06):** nagłówki kanoniczne znormalizowane — `## 🧑🏻‍💻 Zadania praktyczne` ✅, `## 🔎 Deep Dive` ✅ (z lead-inem i trzema podrozdziałami), `## 📚 Materiały dodatkowe` ✅. Wciąż otwarte: draft nie ma sekcji **`## Odbierz swoją odznakę`** (kanon `lesson-structure.md`: między „Zadania praktyczne" a „Deep Dive") — decyzja o odznace/raporcie odłożona przez użytkownika, więc sekcja nie jest dopisywana.

## Video Placeholders

- **Sekcja 4 / iframe `ddd-prompts` (Vimeo 1198893519):** wyniki trzech sesji DDD w 10xCards — destylacja języka, niezmiennik→agregat, ACL; pokaz artefaktów i rozjazdów model-vs-kod.
- **Sekcja 5 / iframe `ddd-mentor` (Vimeo 1198877956):** sesja Event Storming na `event-storming-canvas` — Agent-moderator czyta i edytuje `board.json` na żywo, od `chaotic-exploration` po hotspoty; tablica odświeża się przez SSE.

## Bridge In

Z **m4-l4**: uczeń umie refaktorować z Agentem (testy, zmiany, weryfikacja). Lekcja podnosi poziom z „uporządkuj kod" na „odkryj domenę". Z **prework**: rama „AI = sojusznik, człowiek broni decyzji" + cykl pracy (reuse, nie re-teach).

## Bridge Out

Cztery artefakty DDD + tablica Event Stormingu stają się **wsadem do drugiego cyklu „post-MVP"** (roadmap → research → plan). To domyka moduł m4 i jest rampą do **m5-l1** (pierwszy Agent zespołowy: SDK, koszty, metryki) oraz pracy zespołowej w M5. Forward-reference wpleciony organicznie w prozę, nie jako osobny „następny krok".

## Open Questions

**Rozstrzygnięte:**
- ✅ **Whiteboard tooling:** **`event-storming-canvas`** (bezzależnościowa apka, board.json + SSE) — zastąpiło wcześniejszy pomysł `tldraw MCP` + Mermaid (back-prop z draftu, 2026-06-05).
- ✅ **Zakres taktyczny:** lekcja uczy **trzech ruchów z gotowymi promptami** (destylacja, niezmiennik→agregat, ACL) + warsztat; każdy produkuje samodzielny artefakt do `context/domain/`.
- ✅ **Context Mapping:** realnie uczymy **tylko ACL**; pozostałe wzorce → referencesOnly / Deep Dive (decyzja użytkownika, 2026-06-05).
- ✅ **Domknięcie:** „Wsad do dalszej refaktoryzacji" → drugi cykl post-MVP przez `/10x-shape`, `/10x-roadmap`, `/10x-research`, `/10x-plan`; bez pełnego demo (chroni granicę m2/m5).

**Wciąż otwarte (do wyrównania przez użytkownika):**
- **Spina raportu modułu / odznaka 10xArchitect** — wycofana z tej lekcji; do ponownego opisania na poziomie modułu (użytkownik: „będę raz jeszcze opisywał i to wyrównam").
- **Normalizacja nagłówków** — ✅ zrobione (2026-06-06): `## 🧑🏻‍💻 Zadania praktyczne`, `## 🔎 Deep Dive`, `## 📚 Materiały dodatkowe`. Pozostaje wyłącznie **dodanie sekcji `Odbierz swoją odznakę`** — wstrzymane do decyzji o odznace/raporcie modułu.
- **`agent-forum` w „Materiały dodatkowe"** — w draftcie linkowany tylko inline (Sekcja 2 + Deep Dive); decyzja, czy dopisać go do listy „Materiały dodatkowe".
- **Brandolini „rok" książki** — cytować jako „Leanpub, ongoing (~2018)", technika = 2013 (`lesson-grounding.md`).

## Side-Effect Ledger

- New claims introduced (vs poprzedni spec): `event-storming-canvas` zamiast `tldraw MCP`/Mermaid; trzy gotowe prompty (destylacja, niezmiennik→agregat, ACL) jako owned z artefaktami `context/domain/0X-*.md`; framing „wsad → drugi cykl post-MVP" z `/10x-shape`/`/10x-roadmap`/`/10x-research`/`/10x-plan`; `ts-fsrs` jako przykład przecieku ACL.
- New claims introduced (back-prop 2026-06-06): **`agent-forum`** (przeprogramowani repo) jako zautomatyzowany dwumodelowy wywiad domenowy z opcjonalnym `summarizer` → `summary.md`, dołożony do Sekcji 2 i powtórzony w Deep Dive jako cross-check „dwa modele zamiast jednego"; pełny Deep Dive (trzy podrozdziały: kiedy sięgać po DDD, pięć mitów, halucynacje eksperta + cross-check); `ast-grep` jako alternatywa dla `grep` w ćwiczeniu ACL.
- Claims removed: spina „element ⑤ raportu" i odznaka **10xArchitect**; `tldraw MCP` + Mermaid; Context Mapping zawężony z 5–6 wzorców do samego ACL (reszta → referencesOnly).
- Neighboring lesson references changed: m4-l4 (reference-only migracje), m5-l1 (bridge-out, nie zakres), m2 (reuse pętli planowania, nie re-teach).
- Prework references used: AI-as-ally/„człowiek broni decyzji"; cykl eksploracja→plan→implementacja; role modeli (architekt).
- Prework concepts repeated intentionally: rama odpowiedzialności człowieka (jako spójnik tonu).
- Potential duplicates: ryzyko nakładki z m2 (roadmapa/plan) — zaadresowane przez reference-only + handoff drugiego cyklu.
- Unsupported facts: „małe apki nie potrzebują brokera" = sąd edytorski/practitioner (brak twardego primary; `lesson-grounding.md`).
- Video/text mismatches: (none) — dwa iframe'y w draftcie pokryte w *Video Placeholders*.
- Needs human decision: spina raportu/odznaka (wycofana, do wyrównania); normalizacja nagłówków + sekcja „Odbierz swoją odznakę".
