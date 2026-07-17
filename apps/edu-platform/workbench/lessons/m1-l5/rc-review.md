# RC Review: m1-l5 — Od localhosta na produkcję

## Verdict

**Not ready** — dwa blokery (brakujące wymagane sekcje: auto-deploy + bridge out do m2-l1), kilka problemów Major (scope creep anti-bias, brakujące video scenariusze, niezweryfikowane fragmenty MCP demo, mechanika Plan Mode duplikowana z m1-l2/l3). Po ich usunięciu lekcja ma dobrą podstawę: spec jest solidny, grounding mocny, proza trzyma styl 10xDevs.

**Status (2026-05-14):** Major #1 (nazwa skilla) **resolved**; Major #7 (`gh run view`) **invalidated** decyzją zakresową — m1-l5 nie pokrywa GHA/CI; Major #4 (komendy CLI) **częściowo resolved** po dodaniu verified subsekcji "Wrangler i gh" — pozostały MCP placeholdery do nagrania video.

## Findings

### Blocker: Brakująca sekcja "Auto-deploy z GitHub integration" jako pierwsza produkcyjna pętla feedbacku

- Evidence: `lessons-schema.json` (m1-l5) → `requiredFragments` zawiera: *"Sekcja auto-deploy / CI: Cloudflare Pages + GitHub integracja jako pierwsza produkcyjna pętla feedbacku; framing 'pętle jakości to m3, tu wystarczy że auto-deploy działa'."* W draftcie ten temat pojawia się **tylko** w tabeli wideo ("krótka weryfikacja auto-deploy", linia 10) oraz mglistym wspomnieniu w sekcji Plan Mode.
- **Decyzja autora (2026-05-14):** w m1-l5 nie ma GHA / CI pipeline'ów. Tylko **platform-managed auto-deploy** — connect repo do Cloudflare Pages, push do mastera → automatyczny build i deploy po stronie platformy. To wystarcza dla MVP.
- Why it matters: Sekcja nadal jest wymagana — lekcja zamyka moduł 1 jako "pierwsze wystawienie na produkcję", a auto-deploy z integracji Git jest realnym mechanizmem operacyjnym po deployu. Bez sekcji kursant kończy z jednorazowym `wrangler deploy` i nie wie, że kolejne pushe nie muszą być ręczne.
- Required fix: Dopisz krótką sekcję (5–8 zdań) między "Deployment z Plan Mode" a Deep Dive, zawierającą: (1) framing "pierwsza produkcyjna pętla feedbacku po push", (2) Cloudflare Pages + GitHub integration setup (connect repo w panelu Cloudflare → każdy push do mastera triggeruje build/deploy po stronie platformy), (3) preview deploymenty per PR jako naturalny efekt integracji (z krótką adnotacją o ograniczeniach fork PRs / Cloudflare Access), (4) jawny forward ref: "pętle jakości i własne CI pipeline'y (GitHub Actions, własne testy w pipelinie) to temat modułu 3 — tu zatrzymujemy się przy auto-deployu z platformy". **Bez** `gh run view`, **bez** YAML GHA, **bez** approval gates.
- Source check: Cloudflare Pages Preview Deployments docs (grounding L139–151).

### Blocker: Brakujący Bridge out do m2-l1 + diagram zamknięcia modułu

- Evidence: Draft kończy się sekcją "Granica dostępu agenta do produkcji" (linia 404) oraz "Materiały Dodatkowe". Schema (linia 1152) wymaga: *"Bridge out do m2-l1: zamknięcie modułu 1 jako pełnego łańcucha artefaktów (diagram), zwrot do planowania MVP (milestony, zależności, priorytety)."* Spec Beat 11 (linia 157–163) wymaga tego samego. W draftcie nie ma ani podsumowania modułu, ani diagramu pełnego łańcucha m1, ani wskazania na m2-l1.
- Why it matters: Lekcja jest zamknięciem modułu 1 — bez tego beatu kursant kończy lekcję "w powietrzu" i nie wie, czemu m2-l1 zaczyna od milestonów. Spec wprost mówi: *"masz działającą aplikację — teraz zaplanujemy co naprawdę budujesz"*. To również brakuje diagramu pełnego łańcucha artefaktów (`prd.md → tech-stack.md → bootstrap → AGENTS.md → infrastructure.md + żywy URL`), który spina cały moduł i wraca do otwierającego diagramu z "?".
- Required fix: Dodaj krótki outro przed "Materiały Dodatkowe": (1) jednoakapitowe podsumowanie domknięcia modułu 1, (2) diagram Mermaid `prd.md → tech-stack.md → bootstrap → AGENTS.md → infrastructure.md + URL`, (3) zwrot do m2-l1 wpleciony organicznie (zgodnie z regułą `style.md` o forward references — nie jako wydzielony "Następny krok" paragraf). Trzymaj poniżej 8 zdań.
- Source check: Wewnętrzny kontrakt schematu + spec.

## Major Findings

### ~~Major: Grounding zawiera błędną nazwę skilla~~ — **RESOLVED**

- Evidence: `lesson-grounding.md` L70, L165, L355 używał `10x-platform-research`. Weryfikacja `~/dev/10x-toolkit/packages/ai-artifacts/skills/` potwierdziła, że tylko `10x-infra-research` istnieje.
- Resolution: Grounding zaktualizowany — wszystkie 3 wystąpienia `10x-platform-research` zamienione na `10x-infra-research`. Draft i spec były od początku poprawne. Schema również.
- Follow-up: Pozostałe "Resolved Editorial Decisions" w groundingu (demo target, video scope, deploy-plan.md jako artefakt) warto zweryfikować przed kolejną iteracją — jeden błąd w tej sekcji obniża zaufanie do reszty.

### Major: Brakujące pliki video scenariuszy

- Evidence: `workbench/lessons/m1-l5/videos/` nie istnieje. `requiredArtifacts` w schemie wymienia `video-scenario`. Draft posiada `## Lista video` z trzema zaplanowanymi nagraniami (linie 5–20), ale to tylko tabela — nie scenariusze.
- Why it matters: Schema oczekuje plików `video-{slug}.md` w katalogu `videos/` (per workbench CLAUDE.md, sekcja "Video Scenario"). Bez nich nie da się zweryfikować zgodności między tekstem a video (`videoTextMismatches`), a nagrania będą musiały być planowane ad hoc przez prowadzącego.
- Required fix: Wygenerować trzy scenariusze przez `video-scenario` skill: `videos/video-infra-research.md`, `videos/video-plan-mode-deploy.md`, `videos/video-cli-vs-mcp-operability.md`. Każdy musi przed nagraniem zweryfikować live: dokładne komendy `wrangler`, URL serwera Cloudflare MCP, nazwy MCP tools.
- Source check: workbench/CLAUDE.md sekcja "Video Scenario" oraz schema requiredArtifacts.

### Major: Niezweryfikowane konkretne komendy MCP w prozie (Wrangler — częściowo rozwiązane)

- Evidence (status 2026-05-14):
  - ✅ `wrangler pages deployment list --project-name 10xcards` (linia 357) — **zweryfikowane** w aktualnych Wrangler docs (Pages commands): `npx wrangler pages deployment list [--project-name STRING] [--environment STRING]`. Składnia poprawna.
  - ✅ Dodatkowo zweryfikowane komendy Wrangler i gh w nowej subsekcji Deep Dive (linie 388–411): `wrangler whoami`, `wrangler pages deployment tail`, `wrangler pages secret list`, `gh auth status`, `gh repo view --web`, `gh pr list`, `gh pr view --web`, `gh pr create --fill`. Wszystkie potwierdzone w oficjalnej dokumentacji.
  - ⚠ `pages_deployments_list` jako nazwa narzędzia MCP po stronie Cloudflare (linia 350) — **wciąż ilustracyjna**, nieweryfikowana w realnej sesji z podłączonym serwerem.
  - ⚠ URL serwera Cloudflare MCP w `.mcp.json` (linia 327) — **wciąż placeholder** `<url-serwera-z-dokumentacji-platformy>`.
- Why it matters: Część "CLI" jest teraz zwerifikowana z primary sources. Pozostały ryzykowne tylko dwa elementy MCP — i oba znajdują się w demonstracyjnym snippecie, który kursant prawdopodobnie skopiuje.
- Required fix:
  - URL Cloudflare MCP server: wkleić aktualny adres z oficjalnej dokumentacji Cloudflare przed publikacją (https://developers.cloudflare.com/agents/model-context-protocol/) **lub** dodać jawny in-line komentarz `<!-- TODO: zweryfikować URL serwera w docs Cloudflare przed nagraniem -->`.
  - Nazwa MCP tool (`pages_deployments_list`): w trakcie nagrywania video #3 podmienić na faktyczną nazwę narzędzia zwracaną przez serwer; alternatywnie zsoftować w prozie do *"agent woła narzędzie wyznaczone do listowania deploymentów (`pages_deployments_list` lub analogiczne, zależnie od wersji serwera)"*.
- Source check: Wrangler Pages commands (https://developers.cloudflare.com/workers/wrangler/commands/pages/) ✅ verified; gh manual (https://cli.github.com/manual/) ✅ verified; Cloudflare MCP server URL — open verification.

### Major: Scope creep w sekcji Anti-Bias — dwie dodatkowe techniki poza kontraktem

- Evidence: Draft sekcja "Anti-Bias prompting" (linie 126–180) zawiera 5 technik: 3 wymagane przez schema (devil's advocate, pre-mortem, unknown unknowns) **plus** 2 dodatkowe: "Porównanie alternatyw" (z gotowym promptem, linie 155–165) i "Zmiana ról i perspektyw" (z gotowym promptem, linie 167–178). Schema `requiredFragments` (linia 1145) i spec Beat 4 (linia 101–107) jednoznacznie wymagają tylko 3 soczewek.
- Why it matters: Spec `owns` (linia 1110) trzyma się dokładnie tej trójki ("devil's advocate, pre-mortem, unknown unknowns"). Dwie dodatkowe techniki to nowe `newClaimsIntroduced`, których nie ma w `sideEffectLedger`. Mogą również duplikować przyszłe lekcje (techniki promptowania to obszar często gęstniejący w m2/m3 oraz w preworku [3.x]). Wreszcie: trójka jest "wbudowana w skill", dwie pozostałe — *"możesz odpalić z poziomu zwykłego prompta"* — co rozmywa lesson job ("operacjonalizujemy 10x-infra-research"), bo nagle uczymy technik promptowania w lekcji o deployu.
- Required fix: Decyzja człowieka. Opcje: (1) wyciąć dwie dodatkowe techniki i zostawić linkowanie do innej lekcji/preworku (np. forward ref do m2 lub do preworku [3.x]); (2) zostawić, ale udokumentować w `sideEffectLedger.newClaimsIntroduced` + `potentialDuplicates` (sprawdzić czy nie kradną z m2-l2/m2-l4) + zaktualizować spec/schema; (3) wyciąć i przenieść do osobnej lekcji o anti-bias promptingu.
- Source check: Wewnętrzny kontrakt + szczegółowe porównanie z m2 lekcjami.

### Major: Sekcja Plan Mode zawiera nadmierny tutorial mechaniki, sprzeczność z `mustNotCover`

- Evidence: Linia 235: *"W sesji Claude Code przejdziesz do tego trybu skrótem `Shift+Tab` (cykl trybów: default → auto-accept → plan) - w IDE to zwykle dedykowany przycisk pod polem do wpisania wiadomości do agenta."* + 4-krokowa instrukcja Plan Mode (linie 237–242). Schema (linia 1124) wprost zabrania: `mustNotCover: "mechanika Plan Mode od zera (m1-l2, m1-l3)"`. Spec Beat 6 (linia 122–123): *"powielenie mechaniki Plan Mode z m1-l2/m1-l3; zakładamy Plan Mode jako znane narzędzie — beat skupia się wyłącznie na 'co dać na wejście' i 'co sprawdzić na wyjściu'."*
- Why it matters: To bezpośrednie pogwałcenie ownership boundary. m1-l2/m1-l3 są właścicielami mechaniki — m1-l5 tylko ją używa. Kursant na tym etapie zna Plan Mode; powtarzanie shortcut'u i cyklu trybów to nie tylko marnowane sekundy, ale również sygnał, że lekcje nie ufają sobie nawzajem.
- Required fix: Wytnij linię 235 (Shift+Tab + cycle modes) oraz uprość 4-krokową procedurę do 2 zdań: "Wsadem są `infrastructure.md` i `tech-stack.md`, agent wraca z planem, ty zatwierdzasz, agent wykonuje, plan zostaje w `context/deployment/deploy-plan.md`." Zachowaj framing "co dać na wejście / co sprawdzić na wyjściu". Mechanikę zostaw m1-l2/l3.
- Source check: Spec + schema mustNotCover.

### ~~Major: Brak `gh run view --log-failed` w prozie~~ — **INVALID** (decyzja zakresowa: w m1-l5 nie ma GHA/CI)

- Evidence: Schema `owns` (L1109) i `sideEffectLedger.newClaimsIntroduced` (L1370) wciąż zawierają zapis o `gh run view --log-failed`. Decyzja autora (2026-05-14): m1-l5 nie pokrywa GitHub Actions ani custom CI — auto-deploy jest platform-managed (Cloudflare Pages ↔ GitHub integration).
- Required schema fix (po stronie kontraktu, nie draftu):
  - `lessons-schema.json` m1-l5 → `owns` L1109: usuń fragment *"i read-only diagnostyką (`gh run view --log-failed`)"* — zachowaj resztę zdania o CI/CD i preview deploymentach.
  - `lessons-schema.json` m1-l5 → `sideEffectLedger.newClaimsIntroduced` L1370–1371: usuń pozycję `gh run view --log-failed`.
  - `lessons-schema.json` m1-l5 → `groundingSources` "gh run view manual" (L1253–1265): rozważ usunięcie albo zostawienie z `relevance: "Materiał dodatkowy — diagnostyka pipeline'u CI omawiana w m3"` i zmianą `confidence` na `medium` lub przeniesienie do m3 grounding.
  - `lessons-schema.json` m1-l5 → `groundingSources` "Deployments and environments — GitHub Docs" (L1349–1362) — już oznaczone jako "tylko Materiał Dodatkowy", można zostawić lub przenieść do m3.
  - `lesson-grounding.md` Claims To Support L18: zmienić framing "supports read-only-first and approval gates" na "Materiał dodatkowy do modułu 3".
- Required draft fix:
  - "Materiały Dodatkowe" w drafcie (linia 420) — usuń pozycję `gh run view manual` (lub przenieś do m3).
  - Jeśli `groundingSources` zostają, dodaj jednozdaniową adnotację w drafcie *"Pełne pipeline'y CI/CD z własnymi krokami i bramkami zatwierdzeń to temat modułu 3 — tutaj korzystamy z auto-deployu po stronie platformy"*.

## Minor Findings

### Minor: `ARD` zamiast poprawnego `ADR` (Architecture Decision Record)

- Evidence: Linia 219: *"tzw. Architectural Decision Record (ARD)"*. Poprawny akronim to **ADR**. Link Fowlera w tym samym zdaniu prowadzi do `ArchitectureDecisionRecord`, więc rozpoznawalność jest, ale akronim jest błędny.
- Required fix: `ARD` → `ADR` (jedna zmiana w linii 219).

### Minor: Image placeholdery w backtickach nie wyrenderują się

- Evidence: Linie 335 i 339: `` `![](./assets/mcp-tools-list.png)` `` oraz `` `![](./assets/mcp-deployment-status.png)` `` — owinięte w backticki, więc będą wyświetlone jako kod, nie jako obrazek. Reguła `style.md` "Add a screenshot placeholder" wymaga formy `![](./assets/filename.png)` (bez backticków).
- Required fix: Usuń backticki z linii 335 i 339.

### Minor: Brak `<!-- rendered: ... -->` adnotacji przy dwóch diagramach

- Evidence: Diagramy 1, 2, 3 mają komentarz `<!-- rendered: ../../assets/diagrams/... -->` (linie 65–66, 108–109, 199–200). Diagram Plan Mode flow (linie 248–259) i Diagram CLI vs MCP (linie 290–301) — nie mają.
- Why it matters: Asymetria wskazuje, że dwa diagramy nie przeszły jeszcze przez `mermaid` skill (renderowanie do PNG na CDN). Jeśli reszta lekcji ma renderowane wersje, te dwa zostaną "nagie" w lekcji platformowej.
- Required fix: Uruchomić `mermaid render` na lesson-draft po naprawie pozostałych problemów.

### Minor: Diagram CLI vs MCP — etykietowanie

- Evidence: Diagram porównawczy CLI vs MCP (linie 290–301) zestawia dwie ścieżki bez evaluation labels. Reguła `style.md` "Label comparison diagrams with explicit evaluation": *"Any diagram comparing two states — add (źle)/(lepiej) or (bez X)/(z X)"*.
- Why it matters: W tym konkretnym przypadku obie ścieżki są poprawne (lekcja explicit mówi "to nie walka") — wymuszanie `(źle)/(lepiej)` zaprzeczałoby tezie. Ale brak jakichkolwiek dyskryminatorów (np. `(lokalnie)` / `(zdalnie + auth)` lub `(setup zero)` / `(setup z .mcp.json)`) sprawia, że dwa subgraphy są wizualnie nierozróżnialne poza nazwami nodes.
- Required fix: Opcjonalnie — dodaj subgraph label z naturalną dyskryminatą (np. `Ścieżka CLI (lokalna, Bash)` vs `Ścieżka MCP (zdalna, struktura JSON)`).

### Minor: Wstęp — zbyt długi, łamie regułę "recognition level only"

- Evidence: Wstęp (linie 22–48) ma ~8 akapitów, w tym wspomina narzędzia (`wrangler deploy`, "Free hosting [twój framework]"), Medium, blog producenta, baza/cache/analityka — czyli konkrety. Reguła `style.md` "Wstęp without code snippets — recognition level only": *"specific filenames, and error message formats belong in Core sections. Close the Wstęp with a short punchy sentence (3–5 words)."*
- Why it matters: Reguła stylu — Wstęp powinien działać na poziomie rozpoznania wzorca, nie listy konkretnych technologii.
- Required fix: Skróć Wstęp do 3–5 akapitów. Konkretny tech-stack ("baza, cache, analityka") jest na granicy akceptowalności — można zostawić jako wyliczenie konsekwencji ("...inny runtime, powolny build, problem z zależnościami"), ale rozbij na krótsze akapity (style rule: max 3 zdania). Linia 40 ("Czas wyjść z localhosta.") jest dobrym 3-słowowym closerem — niech tam się skończy. Pakiet `npx @przeprogramowani/10x-cli@latest get m1l5` (linie 42–48) powinien zostać po Wstępie, jako osobny blok przed pierwszą sekcją Core.

### Minor: Literówka "No właśli" → "No właśnie"

- Evidence: Linia 30: *"...No dobra - to w którą stronę idziemy?"* — to akurat OK. Sprawdziłem, ale wcześniej w style.md jest literówka — w samym draftcie nie znalazłem "właśli". Zignoruj — false alarm.

### Minor: Linia 244 — `/10x-lesson` użyty bez kontekstu

- Evidence: Linia 244: *"Przy tej okazji warto też wrócić do skilla `/10x-lesson` - jeśli zauważysz, że dany skill lub fragment pracy agenta nie odpowiada twoim preferencjom (np. w planie analizowany jest nieistotny zakres repozytorium), dodaj to info do reguł na przyszłość."* Skill `10x-lesson` **istnieje** w toolkit (`~/dev/10x-toolkit/packages/ai-artifacts/skills/10x-lesson/`), więc to nie orphan reference. Problem: ani spec, ani schema, ani grounding tej lekcji nie wspominają tego skilla, więc kursant nie ma wskazówki, do czego on służy.
- Why it matters: Akapit pojawia się jako wtrącenie w środku sekcji Plan Mode, nie ma kontekstu, brakuje też wzmianki w której lekcji (m1-l2? m1-l4?) skill jest wprowadzany. Jeśli `/10x-lesson` jest formalnie ownership innej lekcji, m1-l5 powinno tylko go używać, nie referencowac w sposób, który czyta się jak "zajrzyj jeszcze tam".
- Required fix: (a) zweryfikować, w której lekcji `/10x-lesson` jest formalnie wprowadzany (jeśli nigdzie — to nowy claim do udokumentowania w `sideEffectLedger`); (b) albo zostawić wzmiankę z krótkim one-linerem co robi skill ("…wróć do `/10x-lesson`, który dodaje do reguł projektu obserwacje z bieżącej sesji"), (c) albo zamienić na ogólną zasadę bez nazwy skilla: "jeśli plan agenta nie pasuje twoim preferencjom, dopisz to do reguł projektu (m1-l4)".

## Spec Compliance

- Thesis: **pass** (świadoma decyzja infra + deliberatywne wdrożenie + agent operability — wszystkie 3 osie obecne).
- Learning outcomes: **issue** — outcome 3 (CLI vs MCP) pokryty bez podpunktu "podłącza co najmniej jeden gotowy serwer MCP do sesji agenta"; outcome 2 (Plan Mode deploy + persystowany `deploy-plan.md` + auto-deploy preview per PR) pokryty częściowo — brakuje auto-deploy/preview (patrz Blocker #1).
- Behavioral change: **pass** — wzorzec `research → anti-bias → infrastructure.md → Plan Mode deploy` wyraźnie wybudowany.
- Required example/demo: **pass** — 10xCards na Cloudflare obecny w prozie i video table.
- Failure mode: **pass** — sekcja "Wybór platformy jako świadoma decyzja" wprost disarmuje failure mode ze spec ("deployuje jak wszyscy").
- Bridge in: **pass** — Wstęp linkuje z m1-l4 (agent zna projekt → wyjście z localhosta).
- Bridge out: **issue** — brak (patrz Blocker #2).

## Grounding And External Checks

- Verified claims (mapowanie draft → grounding):
  - "API + CLI + MCP to trzy uzupełniające się drogi" → Anthropic blog (grounding L23–42) — **OK**.
  - "Każdy podłączony serwer MCP wnosi do okna kontekstowego definicje swoich narzędzi" → Anthropic engineering blog (grounding L76–90) — **OK**.
  - "Netlify zaleca instalację swojego CLI razem z serwerem MCP" → Netlify MCP docs (grounding L154–168) — **OK**.
  - "Netlify CLI `netlify deploy` defaultowo robi draft, `--prod` publikuje" → Netlify CLI deploy docs (grounding L170–183) — **OK**.
  - "Vercel MCP w beta, OAuth-backed" → Vercel docs (grounding L186–198) — **OK**.
  - "AWS Deployment SOPs wymagają review" → AWS docs (grounding L200–215) — **OK** (jako Materiał Dodatkowy + footer beta).
  - Sycophancy → OpenAI blog post — link prawdopodobnie istnieje (`https://openai.com/index/sycophancy-in-gpt-4o/`), ale to nie jest w `groundingSources` schematu, tylko inline. To OK jako pojedyncza referencja, ale warto dodać do `groundingSources` z `confidence: medium`.
- Unsupported or softened claims:
  - ✅ `wrangler pages deployment list --project-name 10xcards` — **zweryfikowane** w Wrangler Pages docs (2026-05-14). Schema `sideEffectLedger.unsupportedFacts` (L1394) wymaga aktualizacji — usunąć tę pozycję.
  - ✅ Komendy w nowej subsekcji "Wrangler i gh - kilka komend, które warto znać" (Deep Dive, linie 388–411) — wszystkie zweryfikowane (Wrangler Pages docs + Wrangler general docs + gh manual).
  - ⚠ `pages_deployments_list` jako konkretna nazwa narzędzia MCP — wciąż ilustracyjna, nieweryfikowana w realnej sesji.
  - ⚠ `<url-serwera-z-dokumentacji-platformy>` jako URL — jawny placeholder, kursant otrzyma niedziałający `.mcp.json`.
- Open verification:
  - ~~Aktualna składnia `wrangler pages deployment list`~~ — **zweryfikowane**: `npx wrangler pages deployment list [--project-name STRING] [--environment STRING]`. Flaga `--project-name` poprawna.
  - Aktualny URL serwera Cloudflare MCP (oficjalna dokumentacja Cloudflare Agents / MCP).
  - Nazwa narzędzia po stronie Cloudflare MCP server (`pages_deployments_list` lub inna).
  - Status beta Vercel MCP i AWS Deployment SOPs (recheck przed publikacją).
  - ~~Nazwa skilla `10x-infra-research` vs `10x-platform-research`~~ — **zweryfikowane**: w `~/dev/10x-toolkit/packages/ai-artifacts/skills/` istnieje tylko `10x-infra-research`. Grounding wymaga poprawki (patrz Major #1).

## Curriculum Continuity

- Previous lesson fit: **issue z drugiej strony** — m1-l4 schema `sideEffectLedger.neighboringLessonReferencesChanged` (L1077) zawiera: *"m1-l5: explicitly linked via inner loop (m1-l4) → outer loop (m1-l5 CI/CD) metaphor."* — ale m1-l5 spec i schema **usuwają** tę metaforę. To znaczy, że m1-l4 wciąż prawdopodobnie ma w drafcie bridge out odwołujący się do "outer loop", którego w m1-l5 nie ma. m1-l5 spec sam to wymienia w `Side-Effect Ledger` (linia 285): *"m1-l4: bridge out musi być zaktualizowany"*. **Status: nieaktualizowane, do zrobienia w m1-l4 RC.**
- Next lesson setup: bridge out do m2-l1 brakuje (patrz Blocker #2).
- Potential duplicates: 
  - Plan Mode mechanika — patrz Major #6 (sekcja zawiera za dużo mechaniki z m1-l2/l3).
  - Anti-bias techniki — 2 dodatkowe techniki mogą duplikować potencjalne lekcje promptowania w m2 (patrz Major #5).
- Scope theft risk:
  - "Inner loop / outer loop" framing — celowo unikany w drafcie, **OK**.
  - Architektura hooków — niewspomniana, **OK** (należy do m3-l3).
  - Pre-prod separacja — wspomniana jako forward ref (linia 404), **OK**.

## Editorial Quality

- Style guide fit: w większości dobry. Tone direct (ty/ci), inclusive ("my", "zajmiemy się"), casual asides (`Działa...`, `Niestety - choć...`) — obecne i naturalne. Akronimy CLI/JSON/MCP nie są niepotrzebnie rozwijane.
- AI-sounding patterns:
  - Wstęp — patrz Minor (zbyt długi, recognition level złamany konkretami).
  - "Anti-Bias prompting" jako nazwa sekcji — łączy angielskie i polskie słowa; rozważ "Anti-bias — jak unikać sugestii dopasowanych do ciebie" lub czysto polskie "Cross-check researchu" / "Testowanie własnego wyboru". To minor preference.
  - Linia 280: *"Aplikacja jest wdrożona, ale to nie koniec - cała przygoda z utrzymaniem produkcji tak naprawdę się rozpoczyna."* — "przygoda" jest emocjonalnie dramatyczne; reguła style.md "Tone down dramatic or elaborate metaphors". Drobne, ale do uchwycenia.
  - Linia 36: *"klasyczny de-risking dostarczenia rozwiązania klientowi"* — branżowy żargon, zostawiamy. OK.
- Polish/prose issues:
  - Linia 244 — błąkająca się referencja do `/10x-lesson` (patrz Minor).
  - Linia 270: *"Po zatwierdzeniu planu agent wykonuje te kroki, gdzie sam przypisał się jako 'owner'."* — kalka "gdzie" zamiast "które" lub przeformułowanie. Drobne.
  - Linia 312: *"Każdy podłączony serwer MCP wnosi do okna kontekstowego wszystkie definicje swoich narzędzi."* + *"definicje API"* w nawiasie. Trochę przeładowane, ale OK.

## Diagram Quality

- Diagrams present: 4 (Łańcuch m1, Założenia 10x-infra-research, Łańcuch kontraktów, Plan Mode flow, CLI vs MCP). Czyli 5 total — przeliczyłem ponownie. Linie 56–64, 98–107, 192–198, 248–259, 290–301. **5 diagramów.**
- Placement: każdy diagram jest blisko claimu, który wizualizuje — **pass**.
- Missing opportunities: 
  - **Diagram zamknięcia modułu 1** — wprost wymagany przez schema/spec (Blocker #2).
  - Opcjonalnie: diagram "kosztu kontekstu" dla MCP (linia 312) — ale to byłaby ozdoba, nie redukcja cognitive load. Pomijalne.
- Decorative or redundant:
  - Diagram "Założenia 10x-infra-research" (linie 98–107) — jest 6-nodowym sekwencyjnym flowem identycznym z numerowaną listą poniżej (linie 113–117). Sekwencja sama w sobie nie wymaga grafu — to lista. Rozważ wycięcie lub przemianę w prawdziwy decyzyjny flow (z brachami, np. "jeśli scoring tied → uruchamiamy 3 soczewki anti-bias").
- Syntax/rendering: dwa diagramy bez `<!-- rendered: -->` adnotacji (patrz Minor).

## Video Alignment

**No scenario present** — katalog `videos/` nie istnieje. Tabela video w `## Lista video` (linie 5–20) jest dobrą bazą startową dla `video-scenario` skilla. Trzy scenariusze do wygenerowania:
- `video-infra-research.md` — uruchomienie `/10x-infra-research`, wywiad, scoring, anti-bias.
- `video-plan-mode-deploy.md` — Plan Mode z infrastructure.md + tech-stack.md → Cloudflare Pages → URL.
- `video-cli-vs-mcp-operability.md` — porównanie tej samej operacji przez Cloudflare MCP i `wrangler` w terminalu.

Tabela już zawiera dobre ograniczenia (Granica bezpieczeństwa, Ryzyko produkcyjne, fallback dla live runów) — scenariusze powinny te decyzje przejąć.

## Side-Effect Ledger

New claims introduced:
- "Anti-bias prompting" jako oddzielny wątek edukacyjny rozszerzony o 2 techniki spoza 3 soczewek wymienionych w spec (Porównanie alternatyw, Zmiana ról) — **nieudokumentowane w schema `sideEffectLedger`**.
- Wzmianka o sycophancy z linkiem do OpenAI blog — nieudokumentowana w `groundingSources` schematu.
- ADR (linkowane do Martina Fowlera) jako analogia infrastructure.md — drobny dodatek, OK do zostawienia.
- (2026-05-14) Subsekcja "Wrangler i gh — kilka komend, które warto znać" (Deep Dive, linie 388–411): nowe verified komendy `wrangler whoami`, `wrangler pages deployment tail`, `wrangler pages secret list`, `gh auth status`, `gh repo view --web`, `gh pr list`, `gh pr view --web`, `gh pr create --fill`. Wszystkie zweryfikowane z primary docs. Dodaje też framing "read-only / draft jako wspólny mianownik" jako transition do sekcji o granicach dostępu.

Claims removed:
- (none) — wszystko co schema deklaruje jako removed (metafora inner loop → outer loop) faktycznie nie pojawia się w drafcie.

Neighboring lesson references changed:
- m1-l4: bridge out z metaforą "outer loop → m1-l5" wymaga aktualizacji w samej m1-l4 (poza scope tego RC, ale do oflagowania).
- m2-l1: bridge out z tej lekcji nie istnieje — m2-l1 nie otrzyma sygnału z m1-l5.
- m3: forward ref obecny ("pętle jakości to m3") — **OK**, ale tylko pod warunkiem dopisania sekcji CI (Blocker #1).

Prework references used:
- [4.1] Cloudflare jako rekomendacja stacku — wykorzystane organicznie (linia 72).
- [2.1] CLI/terminal jako universalne środowisko — wykorzystane (linia 286).
- [4.2] CI/CD jako wymaganie projektu — **nie wykorzystane explicit** (kolejna konsekwencja Blocker #1).

Prework concepts repeated intentionally:
- Cloudflare jako target — powtórzony jako konkretny deployment target, nie jako nowa informacja. **OK**.

Potential duplicates:
- Plan Mode mechanika z m1-l2/l3 — częściowo zduplikowana (patrz Major #6).
- Techniki anty-bias promptingu — potencjalna kolizja z m2 (do sprawdzenia).

Unsupported facts:
- ~~`wrangler pages deployment list --project-name 10xcards` — w prozie bez verifier note.~~ **Zweryfikowane** (Wrangler Pages docs, 2026-05-14).
- `pages_deployments_list` jako nazwa narzędzia MCP — w prozie jako konkretny przykład.
- URL serwera Cloudflare MCP — jawny placeholder w kopiowalnym snippecie.
- ARD/ADR — błędny akronim w prozie (Minor).

Video/text mismatches:
- (n/a — brak video scenariuszy do porównania)

Needs human decision:
- ~~Nazwa skilla~~ — rozstrzygnięte: `10x-infra-research` (poprawka po stronie groundingu, patrz Major #1).
- Czy zostawiamy 2 dodatkowe techniki anti-bias czy wycinamy (Major #5).
- Komendy Wrangler/gh w Deep Dive — **zweryfikowane**. Pozostałe live-verify items: URL serwera Cloudflare MCP + nazwa MCP tool — decyzja: weryfikować przed nagraniem video #3, czy w prozie zostawić explicit placeholder (Major #4).

## Acceptance Checklist

- [ ] Sekcja "Auto-deploy z GitHub integration" dopisana z framingiem "pierwsza produkcyjna pętla feedbacku po push" + preview per PR + **bez** GHA / `gh run view` (Blocker #1; Major #7 — INVALID, do trimu w schema)
- [ ] Bridge out do m2-l1 + diagram zamknięcia modułu 1 dopisane (Blocker #2)
- [x] ~~Grounding poprawiony: `10x-platform-research` → `10x-infra-research`~~ (Major #1 — done)
- [x] ~~Spec + grounding zaktualizowane: "CI/CD" → "auto-deploy z platform integration", GHA sources oznaczone jako deferred to m3~~ (decyzja 2026-05-14 — done)
- [ ] Schema (`lessons-schema.json` m1-l5) zaktualizowane analogicznie: `owns` L1109 — usunąć `gh run view --log-failed`; `sideEffectLedger.newClaimsIntroduced` L1370-1371 — usunąć tę pozycję; `groundingSources` (3 GitHub sources) — oznaczyć jako deferred / przenieść do m3 grounding
- [ ] Video scenariusze wygenerowane przez `video-scenario` skill (Major #2)
- [x] ~~Wrangler + gh komendy w Deep Dive — zweryfikowane z primary docs~~ (subsekcja "Wrangler i gh — kilka komend, które warto znać" dodana 2026-05-14)
- [ ] URL serwera Cloudflare MCP + nazwa MCP tool — zweryfikować live lub soft-frameować przed nagraniem video #3 (Major #4 — pozostała część)
- [ ] Schema `sideEffectLedger.unsupportedFacts` L1394 — usunąć pozycję o `wrangler pages deployment list` (już zweryfikowane)
- [ ] Decyzja w sprawie 2 dodatkowych technik anti-bias (Major #5)
- [ ] Plan Mode mechanika ścięta do "co dać na wejście / co sprawdzić na wyjściu" (Major #6)
- [ ] ARD → ADR (Minor)
- [ ] Backticki wokół `![](...)` usunięte w dwóch miejscach (Minor)
- [ ] `<!-- rendered: -->` adnotacje dodane na 2 diagramach (lub mermaid render uruchomiony ponownie) (Minor)
- [ ] Linia 244 z `/10x-lesson` — wyciąć lub doprecyzować (Minor)
- [ ] Wstęp przycięty do recognition level (Minor)
- [ ] Drafted-by-human pass na całość po naniesieniu zmian
