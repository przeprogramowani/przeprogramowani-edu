import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-15',
    title: { pl: 'Protokół Ekspedycyjny XV — Próba Generalna', en: 'Expedition Protocol XV — The Dress Rehearsal' },
    description: {
      pl: 'Doktryna probiercza: certyfikuj podróż, nie części. Przejdź całą trasę tak, jak przejdzie ją ten, kto nią pójdzie — od włazu do włazu — i zbierz każdy rodzaj świadka, zanim za coś poręczysz.',
      en: 'The assay doctrine: certify the journey, not the parts. Walk the whole route as the one who will travel it — hatch to hatch — and collect every kind of witness before you vouch for anything.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Przy pulpicie probierczym Izby przeglądasz test-plan misji: każda część stacji zdała próby osobno, ale poręcza się całe trasy. Które ryzyko naprawdę wymaga testu E2E, a nie tańszego testu jednostkowego lub integracyjnego?',
          en: 'At the Assay Office desk you review the mission test plan: every part of the station passed its trials separately, but it is whole routes that get vouched for. Which risk genuinely requires an E2E test rather than a cheaper unit or integration test?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Każde ryzyko o wysokim priorytecie — im ważniejszy scenariusz, tym wyższa warstwa testu powinna go chronić', en: 'Any high-priority risk — the more important the scenario, the higher the test layer that should protect it' } },
          { id: 'b', text: { pl: 'Walidacja formatu adresu e-mail w formularzu — dotyczy UI, a wszystko, co widzi użytkownik, testuje się przez przeglądarkę', en: 'Validating the e-mail format in a form — it concerns the UI, and everything the user sees is tested through the browser' } },
          { id: 'c', text: { pl: 'Wszystkie po kolei — E2E jest najbliżej użytkownika, więc domyślnie każde ryzyko powinno mieć scenariusz przeglądarkowy', en: 'All of them in turn — E2E is closest to the user, so by default every risk should get a browser scenario' } },
          { id: 'd', text: { pl: 'Takie, które przechodzi przez wiele granic systemu (auth, API, baza) albo istnieje tylko w wyrenderowanym UI — resztę łapie tańszy test', en: 'One that crosses multiple system boundaries (auth, API, database) or exists only in the rendered UI — the rest is caught by a cheaper test' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Agent generuje w Playwright testy E2E konsoli załogi — trasę od włazu do włazu, klik po kliku. Dlaczego seed test powinien używać selektorów typu getByRole zamiast klas CSS?',
          en: 'The agent generates Playwright E2E tests for the crew console — the route hatch to hatch, click by click. Why should the seed test use getByRole-style selectors instead of CSS classes?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo selektory CSS działają tylko w trybie headed, a wygenerowane testy odpalają się headless', en: 'Because CSS selectors only work in headed mode, and generated tests run headless' } },
          { id: 'b', text: { pl: 'Bo getByRole jest szybszy — Playwright nie musi wtedy renderować stylów strony', en: 'Because getByRole is faster — Playwright does not have to render the page styles then' } },
          { id: 'c', text: { pl: 'Bo agent nawiguje po drzewie dostępności (role, nazwy, stany), a selektory oparte na rolach przetrwają refaktor layoutu — i to ten wzorzec generator powiela z seeda', en: 'Because the agent navigates the accessibility tree (roles, names, states), and role-based selectors survive layout refactors — and that is the pattern the generator copies from the seed' } },
          { id: 'd', text: { pl: 'Bo klasy CSS bywają minifikowane dopiero na produkcji — lokalnie test przejdzie, a na produkcji nie', en: 'Because CSS classes may get minified only in production — the test passes locally but fails in production' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Wygenerowany test E2E ścieżki certyfikacji ma w środku await page.waitForTimeout(3000) i na pulpicie Izby przechodzi na zielono. Zanim przystawisz prasę probierczą — co z nim zrobić?',
          en: 'A generated E2E test of the certification path contains await page.waitForTimeout(3000) and passes green on the Office desk. Before you bring down the assay press — what should be done with it?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zostawić — trzy sekundy to bezpieczny margines, a zielony wynik lokalny potwierdza stabilność', en: 'Leave it — three seconds is a safe margin, and the green local result confirms stability' } },
          { id: 'b', text: { pl: 'Zamienić na czekanie na stan (np. waitForResponse, toBeVisible) — czekanie na czas jest z natury flaky i padnie w wolniejszym CI', en: 'Replace it with waiting for state (e.g. waitForResponse, toBeVisible) — waiting for time is inherently flaky and will fail in slower CI' } },
          { id: 'c', text: { pl: 'Wydłużyć do 10 sekund — dłuższy timeout obejmie także wolniejsze środowiska CI', en: 'Extend it to 10 seconds — a longer timeout will also cover slower CI environments' } },
          { id: 'd', text: { pl: 'Przenieść timeout do konfiguracji globalnej, żeby wszystkie testy czekały jednakowo', en: 'Move the timeout to the global config so all tests wait the same amount' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_15_DONE] },
  },
];
