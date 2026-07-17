# Notatki kierunkowe — M4L5 (Agent as DDD coach — Event Storming + DDD)

> NOTE: tytuł historyczny niżej mówi "M4L4 / event-driven" — to wcześniejszy
> brainstorm tej samej lekcji. Aktualny szkielet modułu: ta lekcja = **L5**,
> element raportu **⑤ DDD opportunities** (patrz `workbench/lessons/m4-shape.md`).
> Sekcja "Conceptual scaffolding" poniżej została dołączona z §5 shape-doca.

> Luźny brainstorm. Cel: znaleźć kierunek na lekcję, która powtarza dwubeatową
> strukturę lekcji referencyjnej (Event Storming → migracja w realnym projekcie),
> ale osadza ją w projekcie **10xCards** zamiast 10xCMS / webhooków.
>
> **DECYZJA (zablokowana po snapshocie AS-IS, patrz `repo-snapshot.md`):**
> jeden feature jako główna oś lekcji — **asynchroniczna generacja fiszek**
> (Beat 1: Event Storming pełnego cyklu, Beat 2: refaktor sync → async w 10xCards).
> Beat 1 i Beat 2 to **ten sam** feature w zoomie (odpowiedź na Open Q #2), nie dwa
> pokrewne. Resztę zostawiamy na później.
>
> **OŚ DYDAKTYCZNA (z snapshotu):** `GenerationSession` istnieje w PRD 10xCards
> (`prd.md:142-146`), ale **nie istnieje w kodzie** — to tylko luźny UUID stemplowany
> na draftach (`generate.ts:66`, `flashcard_drafts.session_id`). To podręcznikowy
> *model→implementation drift*. Łuk lekcji: Event Storming ujawnia „Sesję generacji"
> jako pierwszoklasowy byt z cyklem życia → w kodzie go nie ma → migracja sync→async
> **wymusza** jego wprowadzenie. DDD nie jest ozdobą, lecz warunkiem koniecznym async.

## 1. Co odtwarzamy z lekcji referencyjnej

Lekcja `[3x4] Modernizacja architektury` ma dwa beaty:

1. **Eksploracja domeny przez Event Storming z AI** — modelujemy proces (zdarzenia,
   komendy, aktorzy, polityki), AI jako moderator + diagram Mermaid jako whiteboard.
2. **Oś projektu (brownfield)** — bierzemy realny, monolityczny/synchroniczny fragment
   i z pomocą AI-Architekta planujemy migrację do architektury **zdarzeniowej /
   asynchronicznej**. Oryginał: webhooki w 10xCMS (blocking → async + kolejka).

Sedno dydaktyczne oryginału: **oddzielenie inicjowania działania od jego wykonania**
(async, kolejki, luźne powiązania) + planowanie migracji inkrementalnej z AI.

To samo chcemy uzyskać na 10xCards: jeden feature do *eksploracji* zdarzeniowej i
ten sam/pokrewny kierunek *zlądowany w realnym kodzie*.

## 2. Co w 10xCards nadaje się pod event-driven (mapa kandydatów)

System dziś jest mocno synchroniczny i transakcyjny. Najlepsze punkty zaczepienia:

| Kandydat | Dlaczego event-driven | Materiał na Event Storming | Realność w osi projektu |
|---|---|---|---|
| **A. Async generacja fiszek** | Generacja blokuje UI (guardrail 30s), to klasyczne „request ≠ execution” | średni (liniowy pipeline) | **wysoka** — bezpośredni analog webhooków |
| **B. Saga usunięcia konta (FR-005)** | soft-delete → 30 dni → hard-delete + kaskada | **bardzo wysoki** (czas, polityki, kompensacja, kaskada) | średnia (czasowe triggery) |
| **C. Pipeline metryk akceptacji** | Primary metric ≥75% accept — projekcja z domain events | średni (read-model/projekcja) | wysoka (lekki outbox/projection) |
| **D. GC nieotwartych sesji (Open Q #6)** | sesja bez finalize → wygaśnięcie po grace period | niski (jeden timer) | wysoka, ale za mały na całą lekcję |

## 3. Rekomendowany kierunek (do decyzji)

**Wariant główny — jeden temat na dwóch wysokościach:**

- **Beat 1 / Event Storming (szerzej, koncepcyjnie):** „Generacja fiszek jako proces
  zdarzeniowy” — modelujemy *pełny* cykl: walidacja wejścia → zlecenie → praca workera
  → wynik/awaria → powiadomienie ucznia → trwałe drafty. Tu wolno fantazjować
  (retry, wielu workerów, streaming, limity per-uczeń z Open Q #3).
- **Beat 2 / Oś projektu (węziej, wykonalnie):** realny refaktor *synchronicznej*
  generacji w 10xCards na **asynchroniczny pipeline** — to samo „oddzielenie zlecenia
  od wykonania” co webhooki w oryginale, ale na domenie, którą uczeń już zna.

Dlaczego ten wariant: najczystszy 1:1 z lekcją referencyjną, domena znana uczniowi z
PRD, a guardrail „30s / brak zamrożenia UI” daje *namacalny* powód biznesowy do migracji.

**Wariant alternatywny (bogatszy storming):** Beat 1 = **saga usunięcia konta** (więcej
do odkrycia: zdarzenia czasowe, polityki, kompensacja, kaskada), Beat 2 = async generacja.
Minus: oba beaty są „event-driven”, ale mniej do siebie podobne tematycznie.

## 4. Event Storming seed — async generacja (Beat 1)

Surowe kartki do whiteboardu (kolejność ~ przepływ):

- **Komendy / aktorzy:** `RequestGeneration` (Uczeń), `AcceptCandidate` / `RejectCandidate`
  (Uczeń), `FinalizeSession` (Uczeń), `RetryGeneration` (System/Uczeń).
- **Zdarzenia domenowe:**
  `GenerationRequested` → `InputValidated` / `InputRejected` (cap ≤10k znaków) →
  `GenerationJobQueued` → `LLMCallStarted` → `CandidatesGenerated` / `GenerationFailed` →
  `DraftsPersisted` → `LearnerNotified` → (`CandidateAccepted`/`CandidateRejected`)* →
  `SessionFinalized` → `DraftsPromotedToDeck`.
- **Polityki (reaction):**
  - on `InputValidated` → zakolejkuj job (nie wołaj LLM w request-response)
  - on `GenerationFailed` → jawny stan błędu, **żadnych** częściowych/uszkodzonych kart
  - timeout/grace → `SessionExpired` → discard draftów (Open Q #6)
- **Hot-spoty / kartki problemowe:**
  - tekst źródłowy nie jest trwale zapisywany (privacy guardrail) → generacja to one-shot,
    nie da się „wznowić” sesji na oryginale
  - „preferred count” to hint, nie gwarancja — gdzie to komunikujemy?
  - limit per-uczeń (Open Q #3) — czy to polityka na `GenerationRequested`?

## 5. Oś projektu — co realnie budujemy (Beat 2)

Migracja brownfield: **synchroniczny `POST /generate` (blocking) → zlecenie + przetwarzanie w tle**.

- stan dziś: jeden request trzyma połączenie przez cały call do OpenRouter (ryzyko 30s+).
- stan docelowy (lekki, bez przeinżynierowania — patrz §6):
  1. `RequestGeneration` zapisuje `GenerationSession` (status `queued`) i zwraca natychmiast.
  2. Przetwarzanie w tle (background job / worker / outbox) woła OpenRouter.
  3. Wynik ląduje jako `FlashcardDraft`-y (`pending`) — model już to zakłada (FR-009).
  4. UI odpytuje status / dostaje update → renderuje kandydatów; błąd = jawny stan.
- to jest dokładnie „oddzielenie inicjowania od wykonania” z oryginału, plus realny
  payoff: UI nigdy nie zamarza (guardrail spełniony „z definicji”, nie przez nadzieję).

## 6. Uczciwość / ograniczenia (ważne dla tonu lekcji)

- 10xCards to **mała skala, low QPS, MVP 1 tydzień, po godzinach** (PRD frontmatter).
  Nie wprowadzamy Kafki/RabbitMQ jako celu — to byłoby przeinżynierowanie.
- Lekcja powinna (jak oryginał) jasno powiedzieć: pracujemy na *lokalnej/małej* aplikacji,
  ale **uczymy się koncepcji produkcyjnych** (async, kolejka jako bufor, luźne powiązania).
  Implementacja może być lekka: DB-backed job / outbox / background task — nie broker.
- AI = sojusznik w modelowaniu i planowaniu migracji, decyzje architektoniczne zostają
  po stronie uczącego się (powtarzamy tę ramę z oryginału).

## 7. Otwarte pytania do decyzji (przed lesson-spec)

> Zaktualizowane po snapshocie AS-IS (`repo-snapshot.md`). ✅ = rozstrzygnięte, 🔶 = wciąż otwarte.

- ✅ **#1 Wariant:** główny (async generacja na 2 wysokościach). Saga usunięcia konta
  zostaje jako materiał zapasowy.
- ✅ **#2 Beat 1 vs Beat 2:** ten sam feature w zoomie, spięty osią „GenerationSession-drift".
- 🔶 **#3 Głębokość implementacji** — sam plan migracji (jak oryginał) czy też realny kod?
  Snapshot daje konkretne szwy (`repo-snapshot.md §8`), więc kod jest wykonalny — decyzja
  o ambicji lekcji wciąż po stronie człowieka.
- 🔶 **#4 Mechanizm async** — konkret (Cloudflare Queues / Durable Objects / `waitUntil`)
  czy poziom koncepcyjny/stack-agnostyczny? Snapshot pokazuje, że to **realne ograniczenie
  platformy** (`repo-snapshot.md §9`), nie trywialny `setTimeout` — warto zdecydować świadomie.
- 🔶 **#5 mustNotCover** — kandydaci do wykluczenia: SRS/`ts-fsrs`, auth, deck CRUD,
  rate-limit per-user (Open Q #3 z PRD), GC porzuconych draftów (Open Q #6 z PRD).
- 🔶 **#6 Retry vs prywatność (nowe, z snapshotu)** — `RetryGeneration` wymaga bufora tekstu
  źródłowego, którego PRD zabrania trzymać (`prd.md:118`). Lekcja mówi „one-shot, brak retry"
  czy wprowadza tymczasowy bufor na czas sesji `queued`? Decyzja produktowo-prawna.
- 🔶 **#7 Atomowość promocji (nowe)** — „atomic save" z FR-012 dziś **nie jest** atomowe
  (`save-session.ts` = 3 osobne wywołania + logi orphan). Lekcja zostawia best-effort czy
  proponuje RPC/transakcję Postgresa? Dobry wątek poboczny pod agregaty/inwarianty.

### Gotowe „czerwone karteczki" pod Beat 1 (z snapshotu, z dowodami w kodzie)

Hotspoty, których nie trzeba zmyślać na whiteboardzie — wszystkie podparte ścieżką w `repo-snapshot.md §6`:

- „Atomic save", które **nie jest atomowe** (sekwencja 3 wywołań Supabase bez transakcji, kompensacja tylko logiem).
- **Utrata pracy** przy `persistence_failed` — karty wygenerowane, koszt LLM poniesiony, tekst nietrzymany → nie do odzyskania, brak retry/outbox.
- **Brak stanu sesji** (`queued/generating/ready/failed`) — nie odróżnisz „w toku" od „porzuconej".
- **Dryf języka:** `draft` = `candidate` = `card` = „propozycja" (4 nazwy, 1 byt); `state` przeciążone (draft text vs SRS smallint).
- **Brak metryki akceptacji** — Primary metric PRD (≥75%) dziś niemierzalna, bo drafty są kasowane po finalize (okazja na read model z `CandidateAccepted/Rejected`).

---

## Conceptual scaffolding (dołączone z `m4-shape.md` §5)

> Concept-first lenses dla L5. Report element: **⑤ DDD opportunities.** Koncept jest
> bohaterem; AI operacjonalizuje go na skali. Atrybucje są confident-but-unverified —
> potwierdzić w `lesson-grounding` przed prozą dla ucznia.

### 1. Event Storming (big-picture → process → design) — *A. Brandolini, Introducing EventStorming (2013)*
Collaborative domain modeling na osi czasu zdarzeń domenowych, z komendami, aktorami,
politykami, read-modelami oraz **hotspotami** (czerwone karteczki) i **pivotal events**
oznaczającymi napięcia i szwy między kontekstami.
- **Apply:** silnik warsztatowy lekcji (już rozpisany w 2ed draft); hotspoty zasilają
  bezpośrednio "DDD opportunities".

### 2. Bounded Contexts & Context Mapping — *E. Evans, DDD (2003); V. Vernon, Implementing DDD (2013)*
Model jest ważny tylko wewnątrz granicy; wzorce integracji nazywają relacje:
**Anticorruption Layer, Conformist, Open Host Service, Published Language, Shared Kernel,
Customer/Supplier, Separate Ways**. Zasada: **granice językowe ujawniają granice kontekstów**.
- **Apply:** zdefiniuj konteksty *wewnątrz* analizowanego modułu i nazwij integracje.

### 3. Subdomain distillation: Core / Supporting / Generic — *Evans / Vernon*
Klasyfikuj subdomeny, by skierować inwestycję — **Core Domain** to miejsce, gdzie
modelowanie i modernizacja się zwracają; subdomeny generyczne to kandydaci buy/adopt.
- **Apply:** priorytetyzuje, które DDD-opportunities warto ścigać (strategicznie, nie tylko taktycznie).

### Bonus lenses (opcjonalnie)
- **Aggregate design & invariants** — *V. Vernon, "Effective Aggregate Design" (2011)*:
  agregaty jako granice spójności chroniące inwarianty; spójność transakcyjna vs ostateczna.
- **Entities vs Value Objects** — *Evans*: tożsamość vs równość przez wartość, niemutowalność.
- **Bounded Context Canvas** — *DDD Crew / N. Tune*: szablon do zapisania wyniku w raporcie.
