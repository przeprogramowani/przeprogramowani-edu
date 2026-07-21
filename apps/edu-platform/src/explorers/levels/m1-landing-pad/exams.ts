import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-1',
    title: { pl: 'Protokół Ekspedycyjny I — Najpierw pytania', en: 'Expedition Protocol I — Questions First' },
    description: {
      pl: 'Doktryna otwarcia każdej ekspedycji: zbadaj, zanim zbudujesz; zapytaj, zanim zadziałasz. Protokół sprawdza, czy nie uzupełniasz luk domysłami.',
      en: 'The opening doctrine of every expedition: investigate before you build; ask before you act. This protocol checks that you do not fill gaps with guesses.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'CORE AI jest ślepe i zaraz wygeneruje plan rozstawienia obozu — wyłącznie z tego, co mu przekażesz. O tej polanie nie ma żadnych danych. Co robisz najpierw, zgodnie z doktryną „najpierw pytania”?',
          en: 'CORE AI is blind and is about to generate a camp-layout plan — using only what you feed it. It has no data about this clearing. What do you do first, following the "questions first" doctrine?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Rozstawić sprzęt od razu w pierwszym równym miejscu — układ obozu i tak dopracujesz w kolejnych podejściach', en: 'Set up gear right away on the first level spot — you will refine the camp layout over the next passes anyway' } },
          { id: 'b', text: { pl: 'Najpierw opisać maszynie realny teren — krawędzie, zagrożenia, przejścia — i dopiero z tego planować', en: 'First describe the real terrain to the machine — edges, hazards, passes — and only plan from that' } },
          { id: 'c', text: { pl: 'Wgrać maszynie sprawdzony układ obozu z poprzedniej misji i rozstawić się według niego bez zmian', en: 'Load the machine the proven camp layout from the previous mission and set up by it unchanged' } },
          { id: 'd', text: { pl: 'Kazać maszynie odtworzyć wygląd polany z tego, co już wie o podobnych księżycach', en: 'Have the machine reconstruct the clearing from what it already knows about similar moons' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Dostajesz rozkaz: „Zabezpiecz przejście na wschód, szybko”. Zanim uznasz to za gotowe zadanie do wykonania, co robisz?',
          en: 'You receive an order: "Secure the eastern pass, quickly." Before you treat it as a ready task to execute, what do you do?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Sam przyjąć, co znaczy „zabezpiecz” i „szybko”, na podstawie tego, jak wyglądało to na wcześniejszych misjach', en: 'Decide for yourself what "secure" and "quickly" mean, based on how it looked on earlier missions' } },
          { id: 'b', text: { pl: 'Ruszyć od razu i zabezpieczać najszybciej jak się da, a niejasności rozstrzygać już w trakcie', en: 'Move at once and secure as fast as you can, settling the ambiguities as you go' } },
          { id: 'c', text: { pl: 'Dopytać, co znaczy „zabezpieczone” i jaki czas jest akceptowalny — i zapisać to jako mierzalny warunek', en: 'Ask what "secured" means and what timeframe is acceptable — and record it as a measurable condition' } },
          { id: 'd', text: { pl: 'Przekazać rozkaz maszynie w tej samej formie i pozwolić jej samej rozstrzygnąć, o co chodziło', en: 'Hand the order to the machine as-is and let it decide for itself what was meant' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Masz niepełny opis nieznanego stanowiska, a maszyna chętnie dopowie resztę. Co najskuteczniej chroni przed tym, że luki wypełni prawdopodobnym, ale niepotwierdzonym domysłem?',
          en: 'You have an incomplete description of an unknown site, and the machine will happily fill in the rest. What best protects against it filling the gaps with a plausible but unconfirmed guess?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pozwolić maszynie samodzielnie dopowiedzieć wszystkie brakujące szczegóły i przyjąć je jako ustalony stan rzeczy', en: 'Let the machine fill in all the missing details entirely on its own and accept them as the established state of things' } },
          { id: 'b', text: { pl: 'Niech maszyna wskaże luki i zada pytania, decyzje podejmujesz ty, a ustalenia zapisujecie jako kontrakt', en: 'Have the machine flag the gaps and ask questions, you make the decisions, and you record the findings as a contract' } },
          { id: 'c', text: { pl: 'Wybrać pierwszą wersję opisu, która się spina, i już nie wracać do wątpliwości', en: 'Pick the first version of the description that holds together, and never revisit the doubts' } },
          { id: 'd', text: { pl: 'Podać maszynie wniosek, który już ci pasuje, i poprosić o argumenty, które go potwierdzą', en: 'Give the machine the conclusion you already like, and ask it for arguments that confirm it' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_1_DONE] },
  },
];
