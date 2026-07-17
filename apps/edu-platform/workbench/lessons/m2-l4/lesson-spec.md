# Lesson Spec: m2-l4 — Implementacja z AI: SRS jako trudniejszy stream po CRUD

## Schema Context

- Course: 10xdevs-3
- Module: 10xDevs Workflow (m2)
- Position: moduleOrder 4 / globalOrder 9
- Depends on: m2-l3 (Solo Code Review: weryfikuj kod AI szybko i skutecznie)
- Prepares for: m2-l5 (Innovate: Więcej ficzerów, mniej czekania - wielowątkowa praca z Agentami)
- Schema note: `lessons-schema.json` ma już groundingSources z poprzedniej iteracji. Po akceptacji obecnego specu trzeba zsynchronizować z nową strukturą: (1) `owns`/`learningOutcomes` przejmują dyscyplinę internal vs external research, (2) silver-bullet check znika z głównej osi i schodzi do Deep Dive, (3) `/10x-frame` schodzi do końcowej sekcji "kolo zapasowe" na osobnym przykładzie (Space Explorers), (4) drift handling jako dedykowany beat/demo zostaje wycofany — SRS path kończy się udaną implementacją, drift wraca tylko jako krótkie operacyjne przypomnienie w fazie implement, (5) groundingSources dostają exa.ai, Context7, Cloudflare markdown-for-agents, `llms.txt`.

## Prework Continuity

- Relevant prework lessons: [3.3] Cykl życia wątku i zarządzanie kontekstem, [3.2] Wzorce i antywzorce promptowania, [1.2] Chatbot vs Agent vs Harness, [4.2] Dobry i zły projekt kursowy
- Assumed from prework: context engineering Write/Select/Compress/Isolate, sygnały degradacji wątku, prompt jako kontrakt, agent = tool use in harness, MVP jako przepływ z logiką biznesową
- Deepened here: trudniejszy stream wymaga szerszego przygotowania przed planem; „research" rozpada się na dwa różne ruchy z różnymi narzędziami — internal po kodzie i external po sieci/docs; agent dostaje świadomą dyscyplinę external researchu (AI-native search, live docs, preferencja dla agent-friendly źródeł); kursant poznaje też pojęcie „kolo zapasowe" w workflow z AI — `/10x-frame` jako narzędzie do sięgnięcia, gdy nie wiadomo, w którą stronę iść z planem, albo gdy zbudowany plan nie przynosi spodziewanych rezultatów (pokazane na osobnym przykładzie poza SRS)
- Avoid repeating: definicja context engineering, ogólny antywzorzec „jednym promptem", podstawy planowania z m2-l2, ogólne definicje agenta/harnessu

## Lesson Job

Po m2-l2 kursant widzi już pierwszy workflow na CRUD/generation path: roadmap item → plan → review → implement. M2-l3 bierze trudniejszą gałąź tej samej roadmapy: `S-04 srs-review-session`, czyli spaced repetition. Ten slice jest inny niż CRUD: blokuje go wybór biblioteki SRS, a ta decyzja determinuje `ReviewState`, rating scale i politykę edycji kart. Trudniejszy slice wymaga szerszego przygotowania przed planem. Lekcja pokazuje, że „research" rozpada się na dwa różne ruchy: **internal research** (`/10x-research` po codebase: co już mamy, jakie konwencje, co jest reusable) i **external research** (web, library docs, ekosystem — z konkretnym toolkitem: exa.ai dla AI-native search, Context7 dla live library docs, preferencja dla agent-friendly źródeł takich jak Cloudflare markdown-for-agents, `llms.txt`, `/md` endpoints). Dopiero zsumowane internal + external evidence trafia do `/10x-plan`, gdzie pytania są solution-focused, bo kontekst i decyzje techniczne są już zebrane. SRS path kończy się **udaną implementacją** fazową — pokazujemy, że research-backed workflow domyka się na trudniejszym streamie. Dopiero po domknięciu SRS otwieramy **osobną, krótką sekcję** „kolo zapasowe" na innym przykładzie (Space Explorers): co zrobić, gdy w pracy z AI nie wiadomo, w którą stronę iść z planem, albo gdy zbudowany plan nie przynosi spodziewanych rezultatów. Tym narzędziem jest `/10x-frame`. Sekcja jest celowo krótkim intro + odesłaniem do istniejącego demo video.

## Thesis

Ten sam workflow działa na trudniejszym streamie, ale **przygotowanie przed planem** rośnie razem z ryzykiem. W CRUD streamie często wystarcza `/10x-plan`; w SRS streamie internal i external research są wejściem do sensownego planu, bo bez decyzji bibliotecznej i znajomości istniejących konwencji agent projektowałby na piasku. External research dla agentów to dyscyplina, nie improwizacja: AI-native search dla evidence, live docs przez ID, preferencja dla źródeł czytelnych dla LLM. Gdy ten workflow zawodzi — plan nie układa się w jasną decyzję albo zbudowany plan nie przynosi spodziewanych rezultatów — w odwodzie zostaje `/10x-frame` jako „kolo zapasowe" do reframingu problemu. Pokazujemy go na osobnym, kontrastowym przykładzie poza SRS.

## Learning Outcomes

- Kursant rozpoznaje, dlaczego `S-04 srs-review-session` nie jest zwykłym CRUD-em: wybór biblioteki SRS wpływa na model danych, UI ratingu, due-card selection i edit-vs-reset policy.
- Kursant rozróżnia **internal research** (`/10x-research` po kodzie) od **external research** (web, docs, biblioteki) i wie, że trudniejszy slice potrzebuje obu.
- Kursant uruchamia `/10x-research` dla SRS branch po stronie kodu: konwencje, utilities, istniejące state patterns; rozumie, że internal research nie odpowie na pytanie biblioteczne.
- Kursant używa **exa.ai** świadomie jako AI-native search dla evidence: query formułowane pod ocenę, nie pod „jedną poprawną odpowiedź".
- Kursant używa **Context7** do pobierania aktualnych library docs przez ID (`resolve-library-id` → `get-library-docs`), zamiast zgadywać API z pamięci modelu.
- Kursant rozumie pattern **agent-friendly docs** (Cloudflare markdown-for-agents, `llms.txt`, `/md` endpoints) i traktuje obecność takich źródeł jako evidence quality signal.
- Kursant łączy internal + external evidence jako kontekst do `/10x-plan` i widzi redukcję pytań diagnostycznych oraz przeniesienie decyzji do `plan-brief.md`.
- Kursant uruchamia `/10x-plan-review` na planie SRS i interpretuje findings jako bramkę przed kodem.
- Kursant prowadzi `/10x-implement` faza-po-fazie przez SRS slice aż do udanego domknięcia: verification gates, manual confirmation, commit ritual, context assessment.
- Kursant rozpoznaje, kiedy sięgnąć po **`/10x-frame`** jako „kolo zapasowe": (a) gdy nie wiadomo, w którą stronę iść z planem, (b) gdy zbudowany plan nie przynosi spodziewanych rezultatów, (c) gdy implementacja rozjeżdża się z planem (drift) i kolejne próby kontynuacji wskazują, że problem był źle nazwany, nie tylko niedoinformowany. Kursant wie, że demo tego ruchu odbywa się na innym przykładzie niż SRS, bo `/10x-frame` adresuje błąd framingu, nie brak evidence.

## Audience Starting Point

Kursant ma po m2-l2:
- roadmapę 10xCards z jasnym podziałem: CRUD/generation w m2-l2, SRS w m2-l4
- co najmniej checkpoint po `S-02`: zapisane `Flashcard` rows albo zrozumienie, że `S-04` zależy od kart w decku
- doświadczenie pierwszego cyklu `/10x-plan → /10x-plan-review → /10x-implement`
- świadomość, że `S-05` compliance i `F-02` deploy line są poza głównym torem tej lekcji

Kursant prawdopodobnie:
- próbuje potraktować SRS jak kolejny endpoint CRUD
- nie widzi, że biblioteka SRS może narzucić shape `ReviewState` i rating scale
- traktuje „research" jako „więcej grepowania w kodzie" albo „wklejam pytanie do ChatGPT"
- nie odróżnia internal od external researchu i nie wie, że istnieją źródła zaprojektowane pod LLM
- zna już plan/implement loop, ale nie wie, jak zachować kontrolę, gdy stream wymaga decyzji technicznej przed planem
- nie rozróżnia jeszcze „brakuje evidence → research" od „problem jest źle postawiony → frame"

## Behavioral Change

Kursant przed trudniejszym slice'em robi research budgeting: krótki internal scan po kodzie, external evidence z AI-native search i live library docs. Dopiero zsumowane evidence trafia do `/10x-plan`. Gdy mimo to plan się nie układa lub implementacja nie przynosi rezultatów, sięga po `/10x-frame` zamiast siłowo poprawiać plan.

## Owned Concepts

- Trudniejszy slice = szersze przygotowanie przed planem: internal research → external research → plan.
- **Internal research** przez `/10x-research`: parallel sub-agents po codebase; dobre do „co już mamy / jakie konwencje / co jest reusable"; nie odpowie na „którą bibliotekę wybrać".
- **External research toolkit** dla agentów:
  - **exa.ai** jako AI-native search (neural/embedding) dla evidence; query pod ocenę, nie pod jedną odpowiedź; różnica względem klasycznego keyword search.
  - **Context7** jako live library docs przez ID; `resolve-library-id` przed `get-library-docs`; aktualne docs zamiast zgadywania API z pamięci modelu.
- **Agent-friendly docs** jako evidence quality signal:
  - Cloudflare markdown-for-agents jako kanoniczny pattern publisher-side.
  - `llms.txt` jako konwencja „where to find LLM-readable content".
  - `/md`, `.md`, „view as markdown" endpoints na popularnych docs.
  - Obecność takich źródeł = sygnał, że projekt świadomie pracuje z AI workflow i ryzyko halucynacji z parsowania HTML jest mniejsze.
- Source hierarchy w praktyce: agent-friendly markdown → official docs → repos/changelogs → technical posts od znanych autorów → community signals (HN/Reddit) jako objawy, nie dowody.
- External evidence discipline: ocena źródła, aktualności i wpływu na plan, zanim finding trafi do `plan-brief.md`.
- SRS branch jako przykład non-CRUD complexity: library choice, `ReviewState`, due-card selection, rating scale, edit-vs-reset policy.
- `/10x-plan` z combined research (internal + external): mniej pytań diagnostycznych, więcej konkretnych solution decisions z evidence pointers.
- `/10x-plan-review` jako bramka przed implementacją trudniejszego planu: end-state alignment, architectural fitness, blind spots, plan completeness.
- `/10x-implement` phase discipline w trudniejszym streamie aż do udanego domknięcia: verification/manual gates, touched-file tracking, commit ritual, context assessment między fazami.
- **`/10x-frame` jako „kolo zapasowe"** — odrębny ruch demonstrowany **na innym przykładzie niż SRS** (Space Explorers, krótkie intro + odesłanie do istniejącego demo video). Trzy triggery: (a) nie wiadomo, w którą stronę iść z planem, (b) zbudowany plan nie przynosi spodziewanych rezultatów, (c) drift — implementacja rozjeżdża się z planem i kolejne próby kontynuacji wskazują, że problem był źle nazwany. Frame oddziela obserwację od zakładanej przyczyny i od proponowanego fixa, zanim wraca się do planu. Konkretny przykład framingowego błędu w Space Explorers: zgłoszenie „collision system jest popsuty" → próba naprawy w warstwie kolizji/hitboxów → realny problem to porządek warstw renderowania (z-depth, layer ordering), nie kolizje. Frame odróżnia obserwację (postacie nakładają się wizualnie) od zakładanej przyczyny („collision detection") i od proponowanego fixa („popraw collision system").
- Bridge from CRUD to SRS: `S-04` zależy od `S-02`, nie od pełnego `S-03`.

## References Only

- Roadmap generation, milestone sequencing i stream selection (m2-l1/m2-l2)
- CRUD/generation implementation details: `F-01`, `S-01`, `S-02`, `S-03` (m2-l2)
- Pełna anatomia `plan.md` i `plan-brief.md` (m2-l2)
- Compliance/account deletion `S-05` (świadomie pominięte)
- Production deploy line `F-02` (równoległy stream, nie temat SRS)
- Code review po implementacji przez `/10x-impl-review` (m2-l3)
- Równoległa egzekucja wielu streamów/worktrees (m2-l5)
- Test-first development i osobna strategia testów (m3-l1/m3-l2)
- Hooki i automatyczne triggery (m3-l3)
- Pełna teoria spaced repetition i porównanie algorytmów SRS (poza zakresem)
- Market survey AI search tools (exa to konkretny przykład AI-native search, nie pełne porównanie ekosystemu)
- Silver-bullet / golden hammer / law of the instrument jako anti-pattern — pojawia się **wyłącznie w Deep Dive** jako teoretyczne tło dla `/10x-frame`, nie jako step w głównej osi.
- Pełna mechanika `/10x-frame` (Frame Brief, observation vs stated cause, dimension map) — owned by `10x-frame` skill source; m2-l4 pokazuje tylko jego rolę i trigger.
- Drift handling jako rozbudowane spektrum decyzji (adapt vs replan vs frame) — wycofane z głównej osi; może wrócić w m2-l3 lub m3 razem z głębszym treatmentem testów/hooków.

## Must Not Cover

- Nie powtarzać big-picture podziału całej roadmapy poza krótkim bridge in.
- Nie implementować CRUD/generation od zera; m2-l4 zakłada output/checkpoint po m2-l2.
- Nie budować własnego algorytmu SRS; roadmap i non-goals mówią o adopcji biblioteki open-source as-is.
- Nie robić pełnej lekcji o bibliotekach SRS ani porównania ekosystemu bez powiązania z planem.
- Nie robić market survey AI search tools ani agent-friendly docs jako tematu samego w sobie; oba służą decyzji w `S-04`.
- Nie sugerować, że agent-friendly docs są wszędzie — większość projektów ich nie ma, i to też jest sygnał.
- Nie sugerować, że dane z sieci automatycznie rozwiązują problem prawdziwości; research ma dawać evidence, które człowiek i plan muszą ocenić.
- Nie przenosić code review wygenerowanego kodu do m2-l4; końcowy review należy do m2-l3.
- Nie robić compliance `S-05`.
- **Nie wprowadzać silver-bullet checku ani `/10x-frame` w głównej osi przed researchem.** Główna oś SRS to internal → external → plan → review → implement aż do domknięcia.
- **Nie pokazywać `/10x-frame` na przykładzie SRS/10xCards.** Frame demonstrujemy w osobnej, końcowej sekcji na innym przykładzie (Space Explorers), żeby kontrast „research-backed loop kończy się udaną impl" vs „kolo zapasowe na sytuację, gdy plan nie układa się jasno" był wyraźny.
- Nie rozbudowywać końcowej sekcji `/10x-frame` w pełen demo — to krótkie intro + odesłanie do istniejącego demo video.
- **Nie kończyć SRS demo na drift scenario.** SRS path domyka się udaną implementacją; drift wraca tylko jako krótkie operacyjne przypomnienie w fazie implement (context assessment, stop-when-something-feels-off), nie jako osobny demo beat.

## Required Example Or Demo

Główne demo bazuje na `S-04: srs-review-session` z roadmapy 10xCards.

Zakładany starting point:
- po m2-l2 istnieje albo jest zasymulowany checkpoint po `S-02`: zaakceptowane karty zapisane jako `Flashcard`
- `S-04` jest blokowany przez Open Roadmap Question #1: wybór SRS library

Rekomendowany przebieg (SRS path):
1. Otworzyć `S-04` w roadmapie i nazwać blocker: nie brak kodu, brak evidence o tym, jaką bibliotekę przyjąć i co już mamy w kodzie.
2. **Internal research** — uruchomić `/10x-research srs-review-session` po codebase: czy mamy istniejące utilities/conventions wokół scheduling, time-based logic, state machines. Pokazać, że internal research ustala kontekst, ale nie odpowie na pytanie biblioteczne.
3. **External research** jako osobny krok:
   - **exa.ai demo**: query typu „TypeScript SRS library production-ready 2026"; pokazać różnicę między keyword search a AI-native; podkreślić, że pierwszy wynik nie jest prawdą.
   - **Context7 demo**: `resolve-library-id` na 1-2 kandydatach SRS, potem `get-library-docs` — pokazać, że docs przychodzą jako structured markdown gotowe do agentowego cytowania.
   - **Agent-friendly docs**: pokazać Cloudflare markdown-for-agents URL jako kanoniczny pattern, krótko wzmianka o `llms.txt` i `/md` endpoints; sformułować to jako evidence quality signal.
4. Combine internal + external evidence i uruchomić `/10x-plan srs-review-session` z research contextem; pokazać, że pytania są solution-focused, decyzja biblioteczna jest w `plan-brief.md` z pointerami do evidence.
5. Uruchomić `/10x-plan-review`, zwracając uwagę na powierzchnie kontraktu i kompletność `## Progress`.
6. Uruchomić `/10x-implement srs-review-session` faza po fazie aż do **udanego domknięcia slice'a**: verify gate, manual gate, commit ritual, context assessment między fazami. SRS path kończy się na pozytywnym domknięciu — `## Progress` complete, działająca review session.

Następnie (osobna, krótka końcowa sekcja, **inny przykład**):

7. **Kolo zapasowe: `/10x-frame` na przykładzie Space Explorers.** Bridge: „research-backed loop dowiózł SRS, ale nie każdy problem da się ruszyć evidence-em. Czasem plan się nie układa, implementacja drifftuje od planu, albo zbudowany plan nie przynosi spodziewanych rezultatów."

   Krótkie intro do `/10x-frame`:
   - Trzy triggery: (a) nie wiem, w którą stronę iść z planem; (b) zbudowany plan nie przynosi rezultatów; (c) drift — implementacja rozjeżdża się z planem mimo prób kontynuacji.
   - Shape skillu: oddziel obserwację od zakładanej przyczyny i od proponowanego fixa.
   - Output: Frame Brief jako input do `/10x-plan`.
   - Gdzie szukać skillu: `10x-frame` w 10x toolkit.

   Konkretny przykład framingowego błędu, wokół którego krąży demo Space Explorers:
   - Obserwacja: „postacie nakładają się wizualnie" (player i NPC są rysowani jedno na drugim w nieoczekiwany sposób).
   - Zakładana przyczyna i proponowany fix wleciały razem: „collision system jest popsuty, popraw collision detection".
   - Realna przyczyna: porządek warstw renderowania (z-depth / layer ordering w Phaserze), nie wykrywanie kolizji.
   - Bez frame'a agent grzebałby w hitboxach i fizyce; frame nazywa właściwy problem i otwiera planowi inny słownik (`depth`, `setDepth`, layer ordering, scene graph).

   **Bez nowego live demo** — odesłanie do istniejącego demo video na przykładzie Space Explorers (video placeholder). Sekcja kończy się bridge-outem do m2-l3: gdy implementacja domyka się czysto, następnym krokiem nie jest frame, tylko code review (m2-l3).

## Structural Logic Map

**Beat 1 — Bridge: po CRUD mamy karty, ale nie mamy nauki**
- Question answered: Po co kolejna lekcja, skoro m2-l2 pokazało workflow?
- Introduces: SRS branch jako drugi stream — karty istnieją, ale system nie wie, kiedy je pokazywać.
- Depends on: m2-l2 checkpoint po `S-02`.
- Sets up: różnicę CRUD vs SRS complexity.
- Diagram opportunity: data flow `Flashcard → ReviewState → due cards → rating → updated ReviewState`.
- Risk: Powtórzenie roadmapy. Trzymać krótko i tylko dla `S-04`.

**Beat 2 — Dlaczego SRS nie jest CRUD-em**
- Question answered: Co sprawia, że ten slice wymaga szerszego przygotowania?
- Introduces: library choice jako blocker; `ReviewState`, rating scale, edit-vs-reset policy; brakuje nie kodu, brakuje evidence.
- Depends on: Beat 1.
- Sets up: dwa różne ruchy researchu (internal i external) — bo ten brak evidence ma dwie warstwy.
- Diagram opportunity: decision impact map: library choice → schema/UI/policy/tests.
- Risk: Za głęboki wykład o spaced repetition. Uczyć tylko tyle, ile potrzeba do decyzji implementacyjnej.

**Beat 3 — Internal research: `/10x-research` po codebase**
- Question answered: Co już mamy w kodzie, co da się reużyć?
- Introduces: `/10x-research` jako parallel sub-agents po codebase; pytania internal-only: konwencje, utilities, state patterns, dotychczasowe podejście do time-based logic.
- Depends on: Beat 2.
- Sets up: external research jako drugi ruch.
- Diagram opportunity: internal scan output → planning context (jedna połowa diagramu, drugą połowę dorzuca Beat 4).
- Risk: Mylenie internal z external. Podkreślić, że `/10x-research` nie odpowie na „którą bibliotekę wybrać".

**Beat 4 — External research toolkit dla agentów**
- Question answered: Czym konkretnie zbieram external evidence?
- Introduces: exa.ai jako AI-native search (neural/embedding, query pod ocenę evidence); Context7 jako live library docs przez ID (`resolve-library-id` → `get-library-docs`); różnica względem „wklejam pytanie do ChatGPT".
- Depends on: Beat 3.
- Sets up: quality signals (Beat 5) i plan z połączonym kontekstem (Beat 6).
- Diagram opportunity: tooling map: exa (search) vs Context7 (docs) vs raw web fetch.
- Risk: Market survey AI tools. Exa jest przykładem AI-native search; Context7 jest narzędziem live docs; nie robimy bazaru.

**Beat 5 — Agent-friendly docs jako evidence quality signal**
- Question answered: Skąd wiem, że źródło jest dobre dla agenta?
- Introduces: Cloudflare markdown-for-agents pattern; `llms.txt` convention; `/md` / „view as markdown" endpoints; obecność takich źródeł jako sygnał świadomego AI workflow po stronie publishera.
- Depends on: Beat 4.
- Sets up: combine + plan.
- Diagram opportunity: source preference order: agent-friendly md → official docs → repos → posts → community signals.
- Risk: Sugestia, że bez agent-friendly docs nie da się pracować. Większość projektów ich nie ma; chodzi o świadomość, nie o gating.

**Beat 6 — Combine + plan: `/10x-plan` z research contextem**
- Question answered: Jak internal + external evidence zmieniają `/10x-plan`?
- Introduces: `/10x-plan` z research doc + external evidence pointers; fewer questions; solution decisions w `plan-brief`.
- Depends on: Beat 5.
- Sets up: review.
- Diagram opportunity: research findings → key decisions in plan-brief.
- Risk: Powtarzanie m2-l2. Kontrast: w m2-l2 plan był defaultem; tutaj internal + external research są warunkiem sensownego planu.

**Beat 7 — Plan review na trudniejszym kontrakcie**
- Question answered: Jak sprawdzić, czy plan SRS nie jest fikcją?
- Introduces: `/10x-plan-review` z naciskiem na end-state, architectural fitness, blind spots, malformed Progress.
- Depends on: Beat 6.
- Sets up: implementację.
- Diagram opportunity: none.
- Risk: Wejście w m2-l3. Granica: review planu przed kodem, nie review implementacji.

**Beat 8 — Implementacja fazowa do udanego domknięcia**
- Question answered: Jak doprowadzić trudniejszy plan do końca bez utraty kontroli?
- Introduces: `/10x-implement` phase loop, verification/manual gates, touched-file set, commit ritual; context assessment low/medium/high jako decyzja operacyjna; krótkie przypomnienie „zatrzymaj się, gdy coś nie pasuje" jako element fazy, nie osobny temat.
- Depends on: Beat 7.
- Sets up: pozytywne domknięcie SRS i przejście do końcowej sekcji „kolo zapasowe".
- Diagram opportunity: phase loop with gates and commit; decision branch by context level.
- Risk: Powtórzenie m2-l2 i preworku 3.3. Pokazać punkt decyzyjny w workflow, nie definicje. Nie rozbudowywać drift handlingu do osobnego beatu.

**Beat 9 — SRS domknięty: co dalej, gdy plan jednak nie działa**
- Question answered: Domknęliśmy SRS evidence-em. A co, jeśli w innym przypadku nawet dobrze zebrane evidence nie wystarczy?
- Introduces: pojęcie „kolo zapasowe" w workflow z AI; trzy triggery: (a) plan się nie układa w jasną decyzję, (b) zbudowany plan nie przynosi spodziewanych rezultatów, (c) drift — implementacja rozjeżdża się z planem i kolejne próby kontynuacji nie pomagają, bo problem został źle nazwany. Transition do osobnego przykładu (poza SRS), żeby kontrast był wyraźny.
- Depends on: Beat 8 (udane domknięcie SRS).
- Sets up: Beat 10 (Space Explorers + `/10x-frame`).
- Diagram opportunity: oś decyzyjna: clear problem + missing evidence → research; suspect framing (też ujawniony przez drift) → frame.
- Risk: Sugestia, że frame to alternatywa dla researchu albo że drift to zawsze frame. Frame nie zastępuje researchu i nie każdy drift to misframing; chodzi o sytuację, gdy drift utrzymuje się mimo prób kontynuacji i wskazuje na błędne nazwanie problemu.

**Beat 10 — Kolo zapasowe: `/10x-frame` na Space Explorers (krótkie intro + video placeholder)**
- Question answered: Jak `/10x-frame` wygląda w praktyce na nie-SRS przykładzie, w którym to framing — nie evidence — był brakującym elementem?
- Introduces: shape skillu (obserwacja vs zakładana przyczyna vs proponowany fix); Frame Brief jako artefakt; gdzie szukać skillu (`10x-frame` w 10x toolkit); rola Frame Brief jako wejścia do `/10x-plan`. Konkretny przykład: w Space Explorers zgłoszenie „popsuty collision system" (postacie nakładają się wizualnie) wciąga zespół w fix po stronie kolizji/hitboxów, a prawdziwy problem to rendering depth i layer ordering. Frame wymusza rozpisanie obserwacji oddzielnie od zakładanej przyczyny i od proponowanego fixa, dzięki czemu wraca właściwy słownik problemu (`depth`, `setDepth`, layer ordering). Demo: placeholder na istniejące demo video na Space Explorers.
- Depends on: Beat 9.
- Sets up: bridge out do m2-l3 (po udanym impl idzie review).
- Diagram opportunity: trójkąt observation / stated cause / proposed fix z opisem, co frame separuje; konkretne wpisy z przykładu Space Explorers w trójkącie.
- Risk: Rozbudowa sekcji do drugiego pełnego demo. Trzymać jako krótkie intro + odesłanie. Nie wracać do SRS jako frame example. Nie zamieniać sekcji w lekcję o Phaserze ani o systemach kolizji — przykład służy ilustracji błędu framingowego, nie nauki render orderingu.

## Failure Mode To Disarm

**Traktowanie trudnego slice'a jak CRUD:** kursant widzi `S-04` jako „dodaj endpoint /review" i pomija decyzję biblioteczną. Lekcja pokazuje, że źle dobrany albo niezbadany kontrakt SRS psuje schema, UI i policy, więc szersze przygotowanie przed planem jest oszczędnością, nie overheadem.

**Mylenie internal i external researchu:** kursant uruchamia `/10x-research` w nadziei, że odpowie „którą bibliotekę wybrać", albo wkleja pytanie do ChatGPT i bierze pierwszy wynik jako prawdę w planie. Lekcja uczy: `/10x-research` ogląda kod, external research ma własny toolkit (exa, Context7) i dyscyplinę (agent-friendly źródła, ocena evidence).

**Mylenie braku evidence z błędnym framingiem:** gdy plan się nie układa, kursant odruchowo robi „jeszcze więcej researchu" zamiast zapytać, czy w ogóle dobrze postawił problem. Lekcja uczy: research adresuje brak evidence przy jasnym problemie; `/10x-frame` adresuje sytuację, gdy obserwacja i zakładana przyczyna albo problem i proponowane rozwiązanie zlewają się w jedno. Pokazujemy to celowo na innym przykładzie niż SRS, bo na SRS frame nie był potrzebny — i to też jest informacja.

**Niewidzenie driftu jako sygnału błędnego framingu:** gdy implementacja rozjeżdża się z planem, kursant próbuje siłowo poprawiać plan i kod, zamiast rozważyć, że problem mógł być od początku źle nazwany. Lekcja uczy: drift, który utrzymuje się mimo prób kontynuacji, jest jednym z trzech triggerów `/10x-frame`. Konkretny przykład w Space Explorers: drift fixu „collision system" stale prowadzi w błędne miejsca, bo prawdziwy problem to rendering depth, nie kolizje.

## Suggested Structure

1. **Po CRUD: brakuje scheduling loop** — krótki bridge z m2-l2 do `S-04`.
   ```text
   m2-l2 checkpoint -> this section -> SRS complexity:
   Nie opowiadać całej roadmapy jeszcze raz.
   ```

2. **SRS jako decyzja kontraktowa** — library choice wpływa na dane, UI i policy.
   ```text
   Bridge -> this section -> internal research:
   Nazwij blocker: nie brak kodu, brak evidence.
   ```

3. **Internal research: `/10x-research` po codebase** — co już mamy.
   ```text
   SRS complexity -> this section -> external research:
   Internal ustala kontekst, nie odpowiada na pytanie biblioteczne.
   ```

4. **External research toolkit** — exa.ai (AI-native search), Context7 (live docs).
   ```text
   Internal research -> this section -> quality signals:
   Konkretne narzędzia, konkretne demo na `S-04`.
   ```

5. **Agent-friendly docs jako quality signal** — markdown-for-agents, `llms.txt`, `/md`.
   ```text
   External toolkit -> this section -> combine + plan:
   Preferencja, nie gating.
   ```

6. **Plan z research contextem** — `/10x-plan` z evidence pointers.
   ```text
   Quality signals -> this section -> review:
   Research kończy się decyzjami w planie, nie raportem do szuflady.
   ```

7. **Plan review** — czy plan SRS jest gotowy do implementacji?
   ```text
   Plan -> this section -> implement:
   Pre-code bramka, bez wchodzenia w review kodu.
   ```

8. **Implementacja fazowa do udanego domknięcia** — phase loop, gates, context assessment, pozytywne zamknięcie SRS.
   ```text
   Review -> this section -> spare wheel bridge:
   Pokazujemy egzekucję planu, dowozimy SRS. Drift to krótka wzmianka w obrębie fazy, nie osobny temat.
   ```

9. **Kolo zapasowe — `/10x-frame` na innym przykładzie (Space Explorers)** — krótkie intro + placeholder na istniejące demo video. Trzy triggery (plan się nie układa / plan nie przynosi rezultatów / drift). Konkretny framingowy błąd: „collision system" okazuje się problemem render depth / layer ordering, nie kolizji.
   ```text
   SRS domknięty -> this section -> bridge out do m2-l3:
   Inny przykład niż SRS jest celowy — kontrast research-backed loop vs reframing premise. Bez nowego live demo; krótkie intro + odesłanie do istniejącego video.
   ```

10. **Deep Dive** — teoria framingu (Tversky/Kahneman), cognitive biases in SE (confirmation, anchoring, golden hammer), silver-bullet / „no silver bullet" (Brooks), background dla agent-friendly docs (markdown-for-agents, `llms.txt`). Bez zmian wzgl. obecnego pomysłu, ale to JEDYNE miejsce, gdzie pojawiają się silver-bullet i frame teoretycznie poza Beat 10.
    ```text
    Spare wheel section -> this section -> end of lesson:
    Deep Dive uzupełnia kontekst dla frame i preferencji źródeł; nie wraca do SRS demo.
    ```

## Video Placeholders

- **Video 1: SRS prep (internal + external) → plan** — prowadzący otwiera `S-04`, uruchamia `/10x-research` po codebase, potem demo external research: exa.ai (query + ocena wyników) i Context7 (`resolve-library-id` → `get-library-docs` dla 1-2 SRS libraries), pokazuje Cloudflare markdown-for-agents URL jako pattern. Kończy `/10x-plan` z combined research contextem.
- **Video 2: Plan review + implementacja do udanego domknięcia** — `/10x-plan-review` na planie SRS, potem `/10x-implement` faza po fazie aż do działającej review session; verification/manual gates, commit ritual, context assessment między fazami. Bez drift scenario.
- **Video 3 (placeholder): `/10x-frame` na Space Explorers** — odesłanie do **istniejącego** demo video na przykładzie Space Explorers. Brak nowego nagrania. Kontekst osadzający (w prozie lekcji, nie w video): zespół chciał naprawić „collision system", a okazało się, że problem wcale nie był po stronie kolizji — postacie nakładały się przez rendering depth / layer ordering. `/10x-frame` rozdzielił obserwację („postacie nakładają się"), zakładaną przyczynę („collision detection"), i proponowany fix („popraw collisions"), i tym samym przekierował plan w stronę z-depth / layer ordering. W draft / RC potwierdzić finalny URL / lokalizację video.

## Bridge In

Kursant wchodzi z m2-l2 z:
- zrozumieniem Streams A/B/C i decyzją, że SRS jest osobnym branchiem
- checkpointem po CRUD/generation path: `Flashcard` rows istnieją albo są założonym outputem `S-02`
- doświadczeniem podstawowego loopa `/10x-plan → /10x-plan-review → /10x-implement`

Lekcja startuje: „Mamy karty. Następny slice nie blokuje brak kodu — blokuje pytanie, na które trzeba odpowiedzieć evidence-em, zanim plan ma sens. Workflow zostaje ten sam, ale przygotowanie przed planem rośnie."

## Bridge Out

Kursant wychodzi z:
- świadomym podziałem internal vs external research i konkretnym external toolkit (exa, Context7) plus odruchem szukania agent-friendly źródeł
- research-backed planem dla `S-04` i **udanie domkniętą implementacją** SRS branch
- doświadczeniem `/10x-plan-review` + phase-based `/10x-implement` na trudniejszym slice'u
- świadomością `/10x-frame` jako „kolo zapasowe" w pracy z AI: trzy triggery (plan się nie układa / plan nie przynosi rezultatów / drift utrzymujący się mimo prób kontynuacji), shape skillu (obserwacja vs zakładana przyczyna vs proponowany fix), gdzie szukać skillu (toolkit), oraz konkretny przykład framingowego błędu (Space Explorers „collision system" → realny problem render depth / layer ordering); demo widzą na osobnym video
- jasnym next step: `/10x-impl-review` w m2-l3 sprawdza, czy zbudowany kod realizuje plan i nie wprowadza regresji

## Open Questions

- Schema sync po akceptacji specu: zaktualizować `lessons-schema.json` (`owns`, `learningOutcomes`, `mustNotCover`):
  - usunąć: „silver-bullet check przed researchem"; `/10x-frame` jako escalation **przed** researchem; pełne drift handling spectrum jako owned concept w m2-l4.
  - dodać: rozróżnienie internal vs external research i toolkit (exa, Context7, agent-friendly docs); `/10x-frame` jako „kolo zapasowe" demonstrowane na osobnym przykładzie z **trzema** triggerami (plan się nie układa / plan nie przynosi rezultatów / drift utrzymujący się mimo prób kontynuacji); informacja, że silver-bullet / golden hammer / Brooks żyją tylko w Deep Dive; przykład Space Explorers („collision system" → render depth / layer ordering) jako kanoniczny framingowy błąd dla tej lekcji.
- Space Explorers demo video: **potwierdzone**. Potwierdzić finalny URL / file path w draft / RC; rozważyć krótki bridging voice-over osadzający framingowy błąd („collision" → render depth), jeśli video sam nie wprowadza tej narracji.
- Czy bridging między Beat 8 (udane SRS) i Beat 9 (kolo zapasowe) wymaga krótkiego diagramu (np. „research adresuje brak evidence; frame adresuje błąd framingu") czy wystarczy 2-3 zdania? Rekomendacja: jedno krótkie zdanie + ewentualny diagram z Beat 9 logic mapy.
- Które biblioteki SRS będą realnymi kandydatami w demo? Rekomendacja: wybrać 1-2 TypeScript-friendly opcje w grounding przed draftem/video (`ts-fsrs` jako pierwszy kandydat).
- Czy exa.ai jest jedynym demoym AI-native search, czy wzmiankujemy alternatywy (Perplexity, Tavily)? Rekomendacja: exa jako główny demo, alternatywy w `Materiały dodatkowe`.
- Jak kursant uruchamia Context7 — MCP, CLI, web? Rekomendacja: potwierdzić obecny setup w course-content / 10x-cli i pokazać jedną ścieżkę zgodną z kursowym środowiskiem.
- Które agent-friendly docs URL użyjemy jako pokazowe? Rekomendacja: Cloudflare developers (kanoniczny markdown-for-agents) + jeden z bibliotek SRS, jeśli ma `.md` / `llms.txt`.
- Czy drift handling w jakiejś formie (np. krótka ramka „kiedy zatrzymać fazę") wraca w m2-l3 albo m3? Rekomendacja: zostawić jako follow-up dla m2-l3 / m3, nie wciągać z powrotem do m2-l4.

## Side-Effect Ledger

New claims introduced:
- m2-l4 jako drugi end-to-end stream, **zakończony udaną implementacją SRS**, nie tylko implementacja planu z m2-l2.
- Trudniejszy slice = szersze przygotowanie przed planem (internal → external → plan).
- Rozróżnienie internal (`/10x-research`) vs external (exa, Context7, web docs) research jako odrębne kroki workflow z różnymi narzędziami.
- exa.ai jako konkretny przykład AI-native search dla evidence gathering.
- Context7 jako narzędzie do live library docs przez ID (`resolve-library-id` → `get-library-docs`).
- Agent-friendly docs (markdown-for-agents, `llms.txt`, `/md` endpoints) jako evidence quality signal.
- Source preference order z agent-friendly markdown jako pierwszą warstwą.
- SRS library choice jako decyzja kontraktowa wpływająca na schema/UI/policy.
- **`/10x-frame` jako „kolo zapasowe"** demonstrowane na osobnym przykładzie (Space Explorers) z **trzema** triggerami: (a) nie wiadomo, w którą stronę iść z planem, (b) zbudowany plan nie przynosi spodziewanych rezultatów, (c) drift utrzymujący się mimo prób kontynuacji jako sygnał błędnego framingu.
- Konkretny framingowy błąd jako przykład w Space Explorers: zgłoszenie „collision system jest popsuty" okazuje się problemem render depth / layer ordering, nie kolizji.

Claims removed:
- Założenie, że m2-l4 wyłącznie implementuje plan przygotowany w m2-l2.
- Założenie, że planning/research są must-not-cover w m2-l4.
- Założenie, że `/10x-research` pokrywa również web/external research.
- Sugestia, że external evidence to „wklejam pytanie do ChatGPT i biorę pierwszy wynik".
- **Silver-bullet check + `/10x-frame` jako framing safety w głównej osi PRZED researchem.** Silver-bullet → tylko Deep Dive; `/10x-frame` → osobna końcowa sekcja na innym przykładzie.
- **Drift handling jako dedykowany beat / demo w m2-l4.** SRS path kończy się udaną impl; drift jako short operational reminder w fazie implement. **Drift wraca** w końcowej sekcji `/10x-frame` jako jeden z trzech triggerów framingu (gdy utrzymuje się mimo prób kontynuacji), nie jako osobny temat operacyjny.

Neighboring lesson references changed:
- m2-l2: bridge in to CRUD/generation checkpoint, nie pełny `plan.md` dla S-01 jako jedyny input.
- m2-l3: bridge out pozostaje code review po implementacji; m2-l3 może być naturalnym miejscem na rozbudowane drift handling, jeśli zdecydujemy się je przywrócić.
- m2-l5: nadal przejmuje równoległość i headless execution.

Prework references used:
- [3.3] context assessment i cykl wątku.
- [3.2] prompt/plan jako kontrakt; evidence vs improwizacja.
- [1.2] agent w harnessie z kontrolą narzędzi (tool use dla researchu).
- [4.2] MVP z realną logiką biznesową, nie pusty CRUD.

Prework concepts repeated intentionally:
- Context degradation tylko jako most do metryki low/medium/high, bez powtarzania listy sygnałów.

Potential duplicates:
- `/10x-plan-review` i `/10x-implement` pojawiają się też w m2-l2. Granica: m2-l2 = pierwszy minimalny loop; m2-l4 = research-backed wariant z context assessment na trudniejszym kontrakcie.
- `/10x-research` może zahaczyć o dawne intencje m2-l2. Nowy podział: m2-l4 jest naturalnym miejscem dla researchu, bo SRS library choice realnie blokuje plan.
- Context7 może pojawić się w innych lekcjach (m3+). Tu wprowadzamy go jako część external research toolkit dla agentów.
- `/10x-frame` może pojawić się w m2-l1 (roadmapa) lub innych miejscach. Granica: m2-l4 wprowadza go **jako koło zapasowe** (po fakcie, na innym przykładzie), nie jako framing safety przed researchem ani jako pełny demo skillu.

Unsupported facts (require grounding before draft/video):
- Konkretne biblioteki SRS kandydaci i ich API.
- exa.ai — query semantics, AI-native search behavior, dostępność/pricing jeśli wpływa na demo.
- Context7 — aktualny tryb uruchomienia dla kursanta (MCP/CLI), kompatybilność z 10x-cli.
- Cloudflare markdown-for-agents — aktualny URL i scope.
- `llms.txt` — aktualny status adopcji jako konwencji.
- Lista popularnych docs z `/md` / „view as markdown" endpointami (poza Cloudflare).
- Learner-facing CLI ref (`m2l4`) wymaga potwierdzenia w course-content wiring.
- Finalny URL / lokalizacja istniejącego Space Explorers demo video dla `/10x-frame` (Beat 10) — istnienie potwierdzone, ścieżka do uzupełnienia w draft / RC.

Video/text mismatches:
- Ryzyko: video może wejść za głęboko w teorię spaced repetition. Spec wymaga, by SRS theory była tylko tłem dla decyzji implementacyjnej.
- Ryzyko: video może wpaść w market survey AI search tools. Spec wymaga jednego AI-native search demo (exa) + Context7, nie bazaru.
- Ryzyko: video implementacyjne (Video 2) skończy się drift scenario zamiast udanego domknięcia. Spec wymaga pozytywnego zamknięcia SRS przed przejściem do końcowej sekcji.
- Ryzyko: Space Explorers demo wideo (Video 3) zostanie pokazane jako pełnoprawne drugie demo. Spec wymaga, by w lekcji towarzyszyło mu krótkie intro tekstowe i traktowane było jako odesłanie, nie drugi tor.

Needs human decision:
- Potwierdzić kandydatów bibliotek SRS dla shortlisty.
- Potwierdzić exa.ai vs alternatywa jako główny demo AI search.
- Potwierdzić Context7 setup dla kursanta (MCP / CLI).
- Potwierdzić pokazowe agent-friendly docs URL (Cloudflare + ewentualnie SRS lib).
- Potwierdzić finalny URL / file path Space Explorers demo video dla Beat 10 i ewentualną potrzebę bridging voice-over.
- Po akceptacji zaktualizować `lessons-schema.json` zgodnie z sekcją Open Questions (silver-bullet/Frame demotion + drift handling pullback + agent research toolkit).
