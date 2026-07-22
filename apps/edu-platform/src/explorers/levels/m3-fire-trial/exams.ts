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
          { id: 'd', text: { pl: 'Scenariusze o wysokim wpływie i wysokim prawdopodobieństwie — priorytet to kombinacja obu osi, nie jedna z nich', en: 'Scenarios with high impact and high likelihood — priority is the combination of both axes, not either alone' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: {
          pl: 'CORE AI proponuje szybki start prac nad jakością: wskazać agentowi pierwszy lepszy plik z repozytorium stacji i wydać prompt „Write tests for this file". Dlaczego to najgorszy możliwy początek?',
          en: 'CORE AI proposes a quick start on quality: point the agent at the first file at hand in the station repository and issue the prompt "Write tests for this file". Why is that the worst possible opening?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo agent pokryje to, co najłatwiej pokryć — coverage rośnie, a krytyczny flow użytkownika dalej nie ma ochrony; zaczynać trzeba od ryzyk, nie od pliku', en: 'Because the agent will cover whatever is easiest — coverage grows while the critical user flow stays unprotected; you start from risks, not from a file' } },
          { id: 'b', text: { pl: 'Bo test pojedynczego pliku zawsze będzie jednostkowy, a projekt realnie chronią tylko testy E2E', en: 'Because a single-file test will always be a unit test, and only E2E tests really protect a project' } },
          { id: 'c', text: { pl: 'Bo prompt jest za krótki — po rozbudowaniu go o szczegóły implementacji tego pliku wynik będzie dobry', en: 'Because the prompt is too short — expanded with the implementation details of that file, the result will be fine' } },
          { id: 'd', text: { pl: 'Bo testów nie powierza się agentom — kod testowy z zasady powinien pisać wyłącznie człowiek', en: 'Because tests are not something you delegate to agents — test code should, as a rule, be written only by humans' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Odtwarzasz rejestr ryzyka poligonu i w mapie ryzyk test-planu znajdujesz wiersz „brak retry w session.ts" — wpisany jeszcze przez ekipę Odyssey. Dlaczego taki wpis trzeba przeformułować?',
          en: 'You are rebuilding the range’s risk register and in the test plan risk map you find the row "missing retry in session.ts" — left there by the Odyssey crew. Why does such an entry need rephrasing?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo nazwa pliku może się zmienić po refaktorze i wpis stanie się nieaktualny', en: 'Because the file name may change after a refactor and the entry will go stale' } },
          { id: 'b', text: { pl: 'Bo to zbyt niski poziom szczegółu — mapa ryzyk opisuje wyłącznie ryzyka bezpieczeństwa', en: 'Because it is too low-level — the risk map describes security risks only' } },
          { id: 'c', text: { pl: 'Bo mapa ryzyk działa na poziomie sygnałów i scenariuszy awarii użytkownika — wskazywanie miejsc w kodzie to rola researchu, nie planu', en: 'Because the risk map works at the level of signals and user-facing failure scenarios — pointing at places in code is the job of research, not the plan' } },
          { id: 'd', text: { pl: 'Bo plan testów w ogóle nie powinien wspominać o kodzie — to dokument dla biznesu, nie dla programistów', en: 'Because a test plan should not mention code at all — it is a document for business, not for developers' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_13_DONE] },
  },
];
