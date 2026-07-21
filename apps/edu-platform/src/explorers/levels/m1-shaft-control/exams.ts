import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-2',
    title: { pl: 'Protokół Ekspedycyjny II — Narzędzia', en: 'Expedition Protocol II — Tools' },
    description: {
      pl: 'Doktryna zestawu narzędzi: dobierz właściwe narzędzie, postaw mu jasne zadanie i sprawdź, co wraca. Protokół sprawdza, czy nie ufasz wynikowi bez weryfikacji.',
      en: 'The toolkit doctrine: pick the right tool, give it a clear task, and check what comes back. This protocol tests whether you trust a result without verifying it.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Masz odbudować zwiadowcę z wraku i zlecasz to maszynie. Które sformułowanie zadania jest zgodne z doktryną narzędzi?',
          en: 'You must rebuild the scout from a wreck and you delegate it to the machine. Which framing of the task follows the toolkit doctrine?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: '„Napraw drona” — krótko, a resztę maszyna dopowie sobie sama', en: '"Fix the drone" — keep it short, the machine will fill in the rest itself' } },
          { id: 'b', text: { pl: 'Podać cel, zakres i warunek sukcesu: który dron i jaka sprawność ma wrócić, i jak to sprawdzisz', en: 'Give the goal, scope, and success condition: which drone and capability must return, and how you check it' } },
          { id: 'c', text: { pl: 'Zlecić naprawę wszystkich wraków w gaju naraz, żeby jednym poleceniem załatwić temat', en: 'Order every wreck in the grove repaired at once, to settle it all with a single command' } },
          { id: 'd', text: { pl: 'Podyktować maszynie każdy pojedynczy ruch po kolei, tak aby nie zostawić jej żadnego miejsca na jakiekolwiek własne decyzje', en: 'Dictate every single move to the machine one by one, so as to leave it no room whatsoever for any decisions of its own' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Zwiadowca melduje: rozruch zakończony sukcesem. Jedynym dowodem jest jego własny komunikat o statusie. Co jest zgodne z doktryną „weryfikuj to, co wraca”?',
          en: 'The scout reports: boot completed successfully. The only evidence is its own status message. What follows the "verify what comes back" doctrine?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Przyjąć meldunek na słowo — maszyna nie ma powodu podawać fałszywego statusu', en: 'Take the report at its word — the machine has no reason to give a false status' } },
          { id: 'b', text: { pl: 'Sprawdzić obserwowalny efekt: czy dron naprawdę odpowiada, rusza się i słyszy', en: 'Check the observable effect: whether the drone really responds, moves, and hears' } },
          { id: 'c', text: { pl: 'Od razu wysłać go w głąb dżungli, a ewentualne usterki wychwycić już podczas zadania', en: 'Send it deep into the jungle at once, and catch any faults during the task itself' } },
          { id: 'd', text: { pl: 'Poprosić maszynę, żeby potwierdziła sukces drugi raz — skoro powtarza to samo, to prawda', en: 'Ask the machine to confirm the success a second time — if it repeats the same thing, it is true' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'CORE AI proponuje: dokończę rozruch w pełni autonomicznie, jedną operacją. Rozruch jest nieodwracalny. Jaka decyzja jest zgodna z doktryną misji?',
          en: 'CORE AI offers: I will finish the boot fully autonomously, in one operation. The boot is irreversible. Which decision follows the mission doctrine?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zgodzić się na pełną automatyzację — jest szybsza, a właśnie na czasie najbardziej ci teraz zależy', en: 'Agree to full automation — it is faster, and time is exactly what you care about most right now' } },
          { id: 'b', text: { pl: 'Niech maszyna przygotuje wszystko, ale nieodwracalny krok zatwierdzasz i wykonujesz ty', en: 'Let the machine prepare everything, but you approve and perform the irreversible step yourself' } },
          { id: 'c', text: { pl: 'Odrzucić pomoc maszyny i przeprowadzić cały rozruch ręcznie, krok po kroku, bez jej udziału', en: 'Reject the machine\'s help and go through the whole boot by hand, step by step, without it' } },
          { id: 'd', text: { pl: 'Zgodzić się na pełną automatyzację, a wynik skontrolować dopiero po fakcie', en: 'Agree to full automation, and inspect the result only after the fact' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_2_DONE] },
  },
];
