import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m1-safe-bootstrap',
    completionType: 'event',
    title: { pl: 'Zabezpiecz i uruchom kontroler', en: 'Secure and Restart the Controller' },
    briefing: {
      pl: 'Entropia zdjęła kontrolerowi Podstacji 03 politykę uprawnień — sprawny bootloader wykona każdy rozkaz, także sabotaż. Zdaj trzyczęściowy test w terminalu certyfikacyjnym, aby zastosować zatwierdzoną politykę, bezpiecznie zrestartować kontroler i otworzyć wschodni właz.',
      en: 'Entropy stripped the Substation 03 controller of its permissions policy — the working bootloader will execute any command, sabotage included. Pass the certification terminal\'s three-part test to apply the approved policy, restart the controller safely, and open the east hatch.',
    },
    hints: [
      { pl: 'Terminal certyfikacyjny stoi w północno-zachodnim rogu podstacji.', en: 'The certification terminal is in the north-west corner of the substation.' },
      { pl: 'Napraw najmniejszy uszkodzony element: politykę uprawnień wokół sprawnego bootloadera.', en: 'Fix the smallest broken part: the permissions policy around the working bootloader.' },
      { pl: 'Bezpieczny przepływ to: sprawdź stan, wykonaj tylko dozwoloną operację, zweryfikuj wynik.', en: 'The safe flow is: check state, execute only an allowed operation, verify the result.' },
    ],
    objectives: [
      {
        id: 'earn-safe-bootstrap-certificate',
        label: { pl: 'Zdaj test i bezpiecznie uruchom kontroler', en: 'Pass the test and restart the controller safely' },
        event: 'exam:completed',
        matchPayload: { examId: 'm1-exam-safe-bootstrap', passed: true },
        requireFlag: FLAGS.M1_EXAM_SAFE_BOOTSTRAP_DONE,
      },
    ],
    rewards: {
      xp: 125,
      flags: [FLAGS.M1_SHAFT_POLICY_DONE, FLAGS.M1_VOID_AWARE_OF_ODYSSEY, FLAGS.CMDS_POLICY],
    },
  },
];
