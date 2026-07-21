import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-prd-contract',
    title: { pl: 'Przechwycony test VOID: Kontrakt PRD', en: 'Captured VOID Test: The PRD Contract' },
    description: {
      pl: 'Test sprawdza, czy potrafisz wydobyć wymagania metodą sokratejską i zapisać je w PRD bez dopowiadania decyzji za użytkownika.',
      en: 'This test checks whether you can elicit requirements with the Socratic method and record them in a PRD without making decisions for the user.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Projektujesz panel obsługi stacji kosmicznej. Który zapis powinien trafić do PRD, ponieważ opisuje rezultat dla użytkownika, a nie sposób implementacji?', en: 'You are designing a space-station operations dashboard. Which statement belongs in a PRD because it describes an outcome for the user rather than an implementation approach?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Dane telemetryczne zapiszemy w PostgreSQL z indeksem po identyfikatorze modułu', en: 'Telemetry data will be stored in PostgreSQL with an index on the module identifier' } },
          { id: 'b', text: { pl: 'Operator widzi dzienny raport zasobów stacji i może zatwierdzić albo odrzucić proponowaną zmianę limitu', en: 'The operator sees a daily station-resource report and can approve or reject a proposed limit change' } },
          { id: 'c', text: { pl: 'Panel stacji zbudujemy w Svelte, ponieważ zespół zna ten framework', en: 'The station dashboard will be built in Svelte because the team knows the framework' } },
          { id: 'd', text: { pl: 'API wystawi endpoint GET /station/status zwracający dane w JSON', en: 'The API will expose a GET /station/status endpoint returning JSON data' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: { pl: 'W wymaganiach panelu stacji zapisano: „Operator ma szybko znaleźć właściwy raport”. Co trzeba zrobić, zanim agent potraktuje ten zapis jako kontrakt do implementacji?', en: 'The station-dashboard requirements say: "The operator must find the correct report quickly." What must happen before the agent treats this statement as an implementation contract?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zostawić zapis bez zmian, bo PRD może opierać się na jakościowych oczekiwaniach', en: 'Leave it unchanged, because a PRD may rely on qualitative expectations' } },
          { id: 'b', text: { pl: 'Samodzielnie przyjąć limit dwóch sekund na podstawie podobnych aplikacji', en: 'Assume a two-second limit based on similar applications' } },
          { id: 'c', text: { pl: 'Przenieść zdanie bez zmian do specyfikacji technicznej, gdzie zajmie się nim wykonawca', en: 'Move the statement unchanged into the technical specification for the implementer to handle' } },
          { id: 'd', text: { pl: 'Dopytać użytkownika o konkretny przepływ i akceptowalny czas, a odpowiedź zapisać jako mierzalne kryterium', en: 'Ask the user about the exact flow and acceptable time, then record the answer as a measurable criterion' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: { pl: 'Masz niepełny opis systemu obsługi stacji kosmicznej. Który przebieg pracy ogranicza ryzyko, że agent uzupełni luki prawdopodobnymi, ale nieuzgodnionymi założeniami?', en: 'You have an incomplete description of a space-station operations system. Which workflow reduces the risk of the agent filling gaps with plausible but unconfirmed assumptions?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: '/10x-prd generuje dokument z niepełnego opisu, a człowiek sprawdza tylko styl i format', en: '/10x-prd generates the document from the incomplete description, and the human checks only its style and formatting' } },
          { id: 'b', text: { pl: 'Człowiek podaje preferowane rozwiązanie, a /10x-shape szuka argumentów potwierdzających ten wybór', en: 'The human provides a preferred solution, and /10x-shape looks for arguments supporting that choice' } },
          { id: 'c', text: { pl: '/10x-shape zadaje pytania pogłębiające i kwestionuje założenia, człowiek podejmuje decyzje, a /10x-prd zapisuje je w kontrakcie', en: '/10x-shape asks probing questions and challenges assumptions, the human makes the decisions, and /10x-prd records them in the contract' } },
          { id: 'd', text: { pl: '/10x-prd tworzy kilka wersji kontraktu, a człowiek wybiera tę z najmniejszą liczbą pytań otwartych', en: '/10x-prd creates several contract variants, and the human selects the one with the fewest open questions' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M1_EXAM_PRD_CONTRACT_DONE] },
  },
];
