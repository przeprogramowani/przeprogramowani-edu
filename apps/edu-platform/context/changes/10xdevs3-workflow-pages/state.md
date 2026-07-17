# Stan prac — 10xdevs3-workflow-pages (2026-07-10 wieczór, przed misją EN)

## >>> STAN NA MOMENT KOMPAKTU (czytaj to pierwsze) <<<

WSZYSTKO WDROŻONE NA PRODUKCJĘ: platforma.przeprogramowani.pl/10xdevs-4
(pełny portal publiczny, bez auth) + gated lustro /10xdevs-3/workflow/.
Master HEAD = 04cdcad5. Working tree czysty w zakresie tenx-workflow
(zostają cudze: .gitignore, workbench/; untracked src/pages/preview-tmp/ -
lokalny podgląd, NIGDY nie commitować).

Zmergowane PR-y (wszystkie squash na MASTER - uwaga: default branch to
master, nie main):
- #219 v1 portalu (9b03c8d2), #220 v2 (ce3888f2) - patrz "Co jest na prodzie".
- #221 (6505222a): hero Motywu bez zdania o The Expanse; dziennik (log)
  złagodzony - bez "wypalenia" i samooceny, "intensywny okres, mniej energii",
  metafora zbiornika; osobiście ale bezpiecznie (prośba usera o anty-cringe).
- #222 (412af567): paleta Cmd+K zamykalna na mobile - znacznik ESC to teraz
  button #cmdk-close (desktop: ESC, mobile: ✕ 44x44; na mobile panel zakrywa
  tint i nie ma fizycznego Esc).
- #223 (06af61c8): sidebar SPIS TREŚCI (nav.toc #toc) - budowany klientowo
  z section[id] (label: h2 albo .eyebrow, innerText pomija spany trybu),
  scroll-spy (marker 28% viewportu), "↑ Początek", ukryty w druku.
- #224 (54278848): TOC widoczny od 1440px (szerokość clamp(150px,50vw-546px,224px),
  left calc(50%+538px)); poniżej ~1440 ukryty - brak miejsca obok wrap 1060px.
- #225 (04cdcad5): spójne glify - karty skrótu top5 = glify uniwersów jak hero
  i sektory (fundacja/lem/wh40k/trzycia/hyperion); hub: karta docs = glif lem,
  karta log = glif expanse; karta motywu celowo zostaje z orbitą (10 uniwersów).
  Moduły M1-M5 i CSC NIE ruszone - tam karty skrótu to celowo ikony mechanizmów
  per lekcja/krok (hero bez glifów, glify tylko w sec-uni sektorów).

Co jest na prodzie z v2 (#220) - delta względem v1:
- 12 stron publicznych: index=hub (konsola Rocinante, mobile chain-m), fundament,
  csc, jakosc, legacy, teamwork, skalowanie, top5 (SEKTOR 01-05 + RYS.),
  docs (quick search), kanon = strona "Motyw sci-fi" (slug `kanon` bez zmian!),
  log (dziennik pokładowy/backstory) + 5 stron skilli CSC pod skill/<slug>.
- "Kanon SF" → "Motyw sci-fi" wszędzie w etykietach/copy (nav "SF · Motyw SF",
  breadcrumb "MOTYW SF // 10 UNIWERSÓW"); "Core Skill Chain" → "Core Skills Chain".
- Layout: pasek akcji TRYB/DEEP DIVE/SZUKAJ po lewej za linkami stron
  (border-left + odstęp 22px); logo 10xDevs → mostek (navHref('index'));
  localStorage tenx-tryb/tenx-dd (jawny ?tryb/?dd wygrywa i zapisuje; restore
  w <head> przed renderem; sync aria-current po DOMContentLoaded przez
  [data-set]); paleta Cmd+K z kolorami kategorii (.cmdk-g[data-g]:
  SKILL #f472b6, DOCS #7aa2ff, STRONA indigo); tytuły stron opisowe w pages.ts
  + sufiks "| 10x Workflow" w layoucie (docTitle, bez dubla gdy tytuł zawiera
  "10x Workflow"); bannery: dane oferty w config.ts (TENX_DEVS_PROMO
  {deadline 30 lipca, 1990/2990 zł}, tenxDevsUrl(), NEWSLETTER_URL);
  hub: panel LOG w konsoli (desktop dolny rząd 5 paneli po 164px, mobile
  5. rząd; motyw SF x=766, neutral STATUS "9/9 ONLINE"), karta LOG w skrócie,
  sekcja DALEJ rekomenduje 10xTop5 jako pierwszą stronę (akcent Hyperiona
  #a78bfa zmieszany z teal mostka).

Proces deployu (przećwiczony 5x, działa):
1. `git fetch origin master && git checkout -b <branch> origin/master`
2. commit TYLKO jawne pathspecs (nigdy add -A; cudze pliki w indexie się
   zdarzają - RÓWNOLEGŁA SESJA CZASEM COMMITUJE, sprawdzać git log/status
   przed stagingiem), push, `gh pr create`, `gh pr merge N --squash`.
3. Watcher: deployment "production (edu-platform)" dla sha squasha przez
   `gh api .../deployments` + statuses aż success, potem curl weryfikacja
   na platforma.przeprogramowani.pl.
Bramki lokalne: `npx astro check` (0 err), `npx astro build`, e2e:
`npx wrangler pages dev dist --port 8791` + `PLAYWRIGHT_TEST_BASE_URL=http://localhost:8791
npx playwright test tests/e2e/tenx-workflow.spec.ts --workers=1 --timeout=90000`
(zimny miniflare renderuje 30-45 s; równoległe workery = fałszywe timeouty).
Dev server podglądu: `npx astro dev --port 4517` (route preview-tmp bez auth).

OTWARTE:
- Beacon Cloudflare Web Analytics - decyzja usera: toggle w projekcie Pages
  przeprogramowani-edu (zero kodu) ALBO token → beacon w head layoutu.
- "Syf z wyświetlaniem linków z edu-platform" (zgłoszenie usera) -
  NIEZREPRODUKOWANY: linki lekcji (wiersz "Lekcja" w modułach, "OTWÓRZ
  LEKCJĘ →" w docs, wpisy DOCS w palecie) czyste w markupie i na screenach.
  Możliwe, że chodziło o rozjechane ikony (naprawione w #225). Dopytać.
- Misja V3 Prework (sekcja niżej) i plan spłaty długu (sekcja niżej) -
  KOLEJNOŚĆ ZMIENIONA: user zlecił najpierw WERSJĘ ANGIELSKĄ (sekcja niżej).

## MISJA NASTĘPNA: WERSJA ANGIELSKA CAŁEGO PORTALU /10xdevs-4 (user, 2026-07-10)

Cel: pełna angielska wersja publicznego portalu 10xdevs-4.

Zakres tłumaczenia (inwentarz):
- 11 stron: hub/index, fundament, csc, jakosc, legacy, teamwork, skalowanie,
  top5, docs, kanon(motyw), log + 5 stron skilli (skills/*SkillBody).
  Bodies to duże pliki .astro z treścią PL wpisaną na sztywno, w tym pary
  sf-only/neutral-only (KAŻDY wariant wymaga tłumaczenia) i aria-labels SVG.
- Rejestry: pages.ts (title/navLabel/breadcrumb/footerRight), skills.ts,
  docs-data.ts (55 wpisów: tytul/streszczenie/tagi/artefakt), universes.ts
  (opisy? sprawdzić - glify i kolory wspólne).
- UI layoutu: TRYB/NEUTRALNY/DEEP DIVE/SZUKAJ, placeholder palety, "BRAK
  WYNIKÓW", bannery (przedsprzedaż + newsletter), TOC ("NA TEJ STRONIE" /
  "KONSOLA // SEKCJE"), stopka, map-cap, komunikaty wyszukiwarki docs.
- e2e: nowe ścieżki EN + istniejące asercje tekstowe.

DECYZJE PODJĘTE Z USEREM (2026-07-10, wiążące):
1. Routing: /10xdevs-4/en/<slug> - rozszerzenie [...slug] o prefiks en
   (parsowanie w wrapperze, nie nowy plik). ZATWIERDZONE.
2. Architektura treści: SŁOWNIKI i18n (wybór usera, wbrew rekomendacji
   równoległych bodies). Jeden body per strona, teksty w słownikach
   src/components/tenx-workflow/i18n/, body dostaje prop lang i czyta
   t = DICT[lang]. Markup/SVG/wizualizacje wspólne - zero dryfu struktury.
   Bramka refactoru: render PL identyczny pre/post (diff HTML).
3. Switcher PL/EN w pasku akcji obok TRYB, persist localStorage tenx-lang,
   <html lang>, hreflang alternate. ZATWIERDZONE. Bez auto-redirectu
   (localStorage = pamięć wyboru, nie przymus; do rewizji po launchu).
4. Bannery na EN: POKAZYWAĆ, przetłumaczone, bez dopisków - KURS JEST TEŻ
   PO ANGIELSKU (korekta usera vs założenie state.md). TENX_DEVS_PROMO
   potrzebuje wariantu EN deadline'u ('July 30').
5. Linki lekcji na EN prowadzą do ANGIELSKICH lekcji:
   /external/10xdevs-3/en/NN. ZWERYFIKOWANE: src/content/lessons10xDevs3/en/
   ma pełne 25 plików 1:1 z pl/, routing [courseId]/[lang]/[lessonId] działa,
   prod 302->login OK. lessonUrl(nn, lang) w config.ts.
6. en-US, ton techniczny; nazwy własne bez tłumaczenia (Core Skills Chain,
   10x Workflow, /10x-*); tytuły książek SF w oryginałach EN. ZATWIERDZONE.
7. Paleta i docs-search: indeks per język (SSR z rejestru). ZATWIERDZONE.

ROLLOUT PROGRESYWNY: lista EN_PAGES (analogia PUBLIC_PAGES) steruje 404
na /en/ i widocznością switchera per strona - strony EN merguje się
przyrostowo do mastera bez ekspozycji półprzetłumaczonego portalu.
Do launchu (faza 4) strony EN z meta robots noindex.

FAZY (taski #25-#28 w sesji):
1. Infra: routing en/, i18n/ (Lang, layout.ts UI strings), lang w layoucie
   (html lang, hreflang, switcher, tenx-lang), lessonUrl(nn, lang),
   bannery EN, paleta per język, EN_PAGES; PILOT: BackstoryBody (log,
   najmniejszy) na słownik + pełne EN. Bramki: check/build, render PL
   bez zmian, e2e PL green + smoke EN.
2. Refactor bodies na słowniki + tłumaczenie falami agentów (10 stron +
   5 skilli): kontrakt STATUS/TOUCHED/UNCERTAINTIES, bramki per plik
   (render PL identyczny, tag balance, zero em dash, liczności
   sf-only/neutral-only PL=EN, astro check). Rejestry per-lang.
3. docs-data EN (55 wpisów) + wyszukiwarka docs EN; rozważyć dług #5
   (karty docs z docs-data.ts) w ramach tej fazy.
4. Launch: EN_PAGES=wszystkie, switcher globalnie, zdjęcie noindex,
   pełne e2e EN + PL bez regresji, deploy, weryfikacja prod.

## ACCESS GROUPS (user, 2026-07-10, wdrożone w trakcie misji EN)

Prośba: wersje portalu per widownia - internal / external 10xdevs 3.0 students /
external 10xdevs 4.0 leads. Mechanizm (bez nowych URL-i i bez nowego auth):
- `AccessGroup = 'internal' | 'students-10xdevs-3' | 'leads-10xdevs-4'` (pages.ts);
  każdy wpis WORKFLOW_PAGES ma pole `access: AccessGroup[]` (dziś: ALL_GROUPS).
- Kontekst /10xdevs-4 = grupa leads (bez logowania); PUBLIC_PAGES to POCHODNA
  access (strony z leads-10xdevs-4) - otwieranie/zamykanie stron przez access.
- Kontekst /10xdevs-3/workflow: `tenxWorkflowAccess(Astro)` w gate.ts zwraca
  { redirect, groups, email }; zalogowany = students-10xdevs-3, adres
  z ADMIN_EMAILS (src/server/admins.ts) dodatkowo internal.
- Wrappery gated (11 + skill/[skill]) 404-ują strony spoza grup widza
  i podają layoutowi `pages={pagesForGroups(access.groups)}` (nawigacja
  i paleta widzą tylko strony danej wersji). Skille dziedziczą po csc.
- Wersja internal = strona z `access: ['internal']` widoczna tylko dla
  zespołu w kontekście gated (staging treści, np. prework przed premierą).
- tenxWorkflowGate usunięty (zastąpiony przez tenxWorkflowAccess).
- E2E nie testuje rozróżnienia students/internal (wymaga zalogowanej sesji);
  anonimowe redirecty i 404 pokryte istniejącymi testami.

## MISJA V3: PREWORK (po EN, chyba że user zmieni kolejność)

Cel usera: 10xdevs-3-prework jako osobny segment - wpis w nawigacji głównej 10x Workflow,
z WŁASNĄ subnawigacją. Dużo ważnych konceptów oczekiwanych na start; duża wartość
za darmo, zajawka do dołączenia (publiczne).

RESEARCH (2026-07-10, zweryfikowane):
- Lekcje prework: src/content/lessons10xDevs3Prework/pl/ - 15 lekcji w 4 grupach:
  1.x fundamenty pojęciowe: [1.1] Co potrafi AI w 2026, [1.2] Chatbot vs Agent vs Harness,
      [1.3] Jak uczyć się i rozwijać z AI
  2.x narzędzia: [2.1] Agent w IDE/Terminalu/Chmurze, [2.2] Cursor podstawy,
      [2.3] Claude Code podstawy, [2.4] Agent-Native IDE
  3.x praca z LLM: [3.1] LLMy a codzienna praca, [3.2] Wzorce i antywzorce promptowania,
      [3.3] Cykl życia wątku i zarządzanie kontekstem, [3.4] Język pracy z AI,
      [3.5] Rekomendowane modele i jak być na bieżąco
  4.x organizacja kursu: [4.1] Tech Stack Overview, [4.2] Dobry i zły projekt kursowy,
      [4.3] Checklista uczestnika i support (te 3 raczej NIE do publicznej zajawki - wewnętrzne)
- Pełne lekcje na platformie: /external/10xdevs-3-prework/pl/NN (PREWORK_COURSE_ID =
  '10xdevs-3-prework', prod zweryfikowany: 302 na login; format NN jak main course).
- Numery plików: 01-07 to 1.1-2.4, potem 09-16 to 3.1-4.3 (BRAK pliku 08 - sprawdzić
  mapowanie NN→lekcja przy linkowaniu, nie zakładać ciągłości).

SZKIC ARCHITEKTURY (do /10x-plan przy starcie misji):
- Rejestr PREWORK_PAGES w pages.ts lub osobny prework.ts (slug, title, navLabel, group).
- TenxCosmicLayout: nowy prop `subnav?: { base: string; pages: ... ; activeSlug?: string }`
  renderujący DRUGI rząd chipów pod xpages (mobile: drugi scroll-row).
- Wpis "Prework" (moduleLabel np. M0) w WORKFLOW_PAGES → strona-hub
  /10xdevs-3/workflow/prework + publicznie /10xdevs-4/prework; podstrony konceptów
  /prework/<slug> (routing rest-param jak skill/).
- Treść: destylacja konceptów z lekcji 1.x-3.x (12 lekcji) w kosmicznym design systemie,
  pary sf-only/neutral-only, DeepDive tam gdzie jest materiał, linki "Pełna lekcja"
  do /external/10xdevs-3-prework/pl/NN. Grupy 4.x pominąć publicznie.
- Publiczne od startu (user: darmowa wartość); banner przedsprzedaży już działa na public.
- Docs quick search: dodać wpisy konceptów prework (kind: koncept, modul: PREWORK).
- QUIZ (user 2026-07-10): wpiąć istniejący quiz personalizacyjny platformy
  (src/components/prework/PreworkPathQuiz.svelte; są też recommendations w
  src/lib/quiz/10x-devs-3-prework/) w segment prework - personalizacja ścieżki
  + zajawka pod kurs; zbadać osadzenie w kosmicznym layoucie vs link.
- BANNERY (user): dobre rozłożenie bannerów "zakup kurs" na prework/public -
  obecna heurystyka layoutu (klon po co 3. sektorze + 1 przed stopką,
  tylko base=/10xdevs-4) do skalibrowania per długość strony, nie nachalnie.

## DŁUG TECHNICZNY - decyzja sekwencji (2026-07-10, action produces information)

DECYZJA (sprzed misji EN): prework najpierw, spłata długu po nim - prework to
nowy archetyp strony; komponentyzacja po nim projektuje granice na dowodach.
UWAGA: misja EN podbija wartość spłaty (2 języki x N stron = dryf rośnie);
przy scopingu EN rozważyć wciągnięcie pozycji 5 (karty docs generowane
z docs-data.ts) - inaczej EN dubluje też ręczne karty docs.
MIKRO-SPŁATA #1 ZROBIONA (dane oferty w config.ts).
PLAN SPŁATY (sesja przez /10x-plan): 1) research wariancji wzorców markupu
na pełnym korpusie; 2) ekstrakcja 4-6 komponentów sekcji, bramka render
bajt-w-bajt, migracja agentami; 3) spike 30 min: konsolidacja map slug→Body
(public/preview/gated); 4) testy jednostkowe czystych funkcji palety/
wyszukiwarki; 5) karty docs generowane z docs-data.ts (koniec podwójnego
źródła). Znane pozycje: markup sekcji powtarzany, bodies jako duże pliki,
mapy Body x3, brak unitów.

## KANON KOLORÓW (zatwierdzony - nie zmieniać bez decyzji)

Ender #4ade9b · Trzy ciała #4cc9f0 · Hyperion #a78bfa · Diuna #f0a64a ·
WH40k #e2564a · Expanse #3ddad0 · Star Wars #ffd166 · Fundacja #f472b6 ·
Lem/Solaris #7aa2ff · Red Rising #ff4f6e. Glify w universes.ts.
Mapowanie stron: fundament-Ender, csc-Fundacja, jakosc-Trzy ciała, legacy-WH40k,
teamwork-Red Rising, skalowanie-Star Wars, top5-Hyperion, docs-Lem/Solaris,
log-Expanse, motyw-indigo #7c8cff, hub-Expanse.

## Konwencje twarde

Polski (do misji EN), zero em dash („—" → "-"), bez emoji, bez prawdziwych
nazwisk (WYJĄTKI: "Marcin" na stronach motyw/log - jawna prośba usera;
nazwiska badaczy w liniach GRUNT na legacy), fonty przez public/fonts (nigdy
data-URI). W repo sites: commity TYLKO przez jawne pathspecs (index miewa
cudze pliki z równoległej sesji - NIE commitować ich, NIE stashować).
Depolenglisz wg workbench/.claude/skills/lesson-editor-pl/SKILL.md.

## Historia (skrót; szczegóły w git log 10xdevs3-workflow-pages)

Nocny loop: 7 landingów w vaulcie → migracja do edu-platform (#219) →
wygaszenie 7 projektów Pages (3f038d18). Dzień: v2 przez ~15 agentów
z bramkami (tryby sf/neutral, DeepDive, mobile, linki lekcji, strony skilli,
motyw 10 uniwersów + soundtrack Expanse, top5 3 iteracje, rebalans SF,
pass depolenglisz ~120 poprawek, refaktor rejestrowy z bramką byte-diff
27 par IDENTICAL, paleta Cmd+K, hub Rocinante, bannery, backstory) →
deploy #220 → poprawki #221-#225. Lekcje: URL lekcji /external/10xdevs-3/pl/NN
(01-25); e2e na zimnym miniflare wymaga --workers=1.

## Rzeczy odłożone

- Manual rows w vaultowych planach zmian (akceptacja wizualna) - vault
  `kierunek-2026/context/changes/{m1-fundament,skalowanie,m3-jakosc,m4-legacy,m5-teamwork,10xdevs-docs}-page/`.
- Ewentualne custom domeny.
