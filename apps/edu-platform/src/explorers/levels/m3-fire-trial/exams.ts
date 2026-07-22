import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-13',
    title: { pl: 'Protokół Ekspedycyjny XIII — Rachunek Ryzyka', en: 'Expedition Protocol XIII — The Risk Ledger' },
    description: {
      pl: 'Doktryna poligonowa: badaj najpierw to, co zabija pierwsze, a odłożone naprawy prowadź w jawnym rejestrze zaległości. Dług ukryty rośnie w ciemności; dług spisany można spłacić.',
      en: 'The range doctrine: test first what kills first, and keep deferred repairs in an open backlog register. Hidden debt grows in the dark; written debt can be paid.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Trzy stanowiska badawcze nad dyszami lawy czekają na uczciwe próby, a Iskra czyta na głos rejestr zagrożeń poligonu. Budujesz plan testów dla oprogramowania stacji i nie pokryjesz wszystkiego naraz. Które ryzyko chronisz testami najpierw?',
          en: 'Three test stands over the lava nozzles await honest trials, and Iskra reads the range’s threat register aloud. You are building a test plan for the station software and cannot cover everything at once. Which risk do you protect with tests first?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Kod, który najłatwiej pokryć — helpery i formatery szybko podbiją coverage i dadzą zielony start', en: 'The code easiest to cover — helpers and formatters quickly bump coverage and give a green start' } },
          { id: 'b', text: { pl: 'Globalną awarię dostawcy chmury — skoro jej wpływ jest największy ze wszystkich, musi iść pierwsza w kolejce', en: 'A global cloud-provider outage — since its impact is the biggest of all, it must go first in line' } },
          { id: 'c', text: { pl: 'Wszystkie obszary po równo — plan ma pokryć projekt równomiernie, bez faworyzowania żadnego scenariusza', en: 'All areas equally — the plan should cover the project evenly, favouring no scenario' } },
          { id: 'd', text: { pl: 'Scenariusze o wysokim wpływie i prawdopodobieństwie naraz — priorytet to obie osie, nie jedna z nich', en: 'Scenarios high in impact and likelihood at once — priority is both axes, not either alone' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: {
          pl: 'CORE AI proponuje szybki start prac nad jakością: wskazać agentowi pierwszy lepszy plik z repozytorium stacji i wydać prompt „Write tests for this file". Co odpowiadasz?',
          en: 'CORE AI proposes a quick start on quality: point the agent at the first file at hand in the station repository and issue the prompt "Write tests for this file". What is your answer?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Że tak agent pokryje to, co najłatwiej pokryć, a krytyczny flow dalej będzie bez ochrony — zaczynamy od ryzyk, nie od pliku', en: 'That the agent will cover whatever is easiest while the critical flow stays unprotected — we start from risks, not from a file' } },
          { id: 'b', text: { pl: 'Że test pojedynczego pliku zawsze wyjdzie jednostkowy, a projekt realnie chronią wyłącznie scenariusze E2E w przeglądarce', en: 'That a single-file test always comes out unit-level, and a project is really protected only by browser E2E scenarios' } },
          { id: 'c', text: { pl: 'Że prompt jest tylko za krótki — po rozbudowaniu go o szczegóły implementacji tego pliku wynik będzie w porządku', en: 'That the prompt is merely too short — expanded with the implementation details of that file, the result will be fine' } },
          { id: 'd', text: { pl: 'Że testów w ogóle nie powierza się agentom — kod testowy z zasady powinien pisać wyłącznie człowiek', en: 'That tests are not delegated to agents at all — test code should, as a rule, be written only by humans' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Odtwarzasz rejestr ryzyka poligonu i w mapie ryzyk test-planu znajdujesz wiersz „brak retry w session.ts" — wpisany jeszcze przez ekipę Odyssey. Co robisz z takim wpisem?',
          en: 'You are rebuilding the range’s risk register and in the test plan risk map you find the row "missing retry in session.ts" — left there by the Odyssey crew. What do you do with such an entry?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zostawiam bez zmian — wskazanie konkretnego pliku to najprecyzyjniejszy wpis, jaki może mieć mapa ryzyk', en: 'Leave it as is — pointing at a specific file is the most precise entry a risk map can have' } },
          { id: 'b', text: { pl: 'Poprawiam tylko nazwę pliku na aktualną — po refaktorach ekipy Odyssey wpis mógł się zdezaktualizować', en: 'Just update the file name — after the Odyssey crew’s refactors the entry may have gone stale' } },
          { id: 'c', text: { pl: 'Przepisuję na scenariusz awarii widoczny dla użytkownika — miejsca w kodzie wskazuje dopiero research', en: 'Rewrite it as a user-visible failure scenario — places in code are pointed out later, by research' } },
          { id: 'd', text: { pl: 'Usuwam — mapa ryzyk to dokument dla biznesu, więc nie powinna w ogóle schodzić do poziomu techniki', en: 'Delete it — the risk map is a business document, so it should not descend to the technical level at all' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_13_DONE] },
  },
];
