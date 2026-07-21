import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m1-prd-contract',
    completionType: 'event',
    title: { pl: 'Odzyskaj kontrakt operacji', en: 'Recover the Operation Contract' },
    briefing: {
      pl: 'Entropia przemieszała PRD operacji wydobywczej — cel misji utonął w technicznym szumie. Oddziel kontrakt operacji od sposobu wykonania i zdobądź certyfikat Kontrakt PRD, aby maszyny VOID wskazały właściwą trasę.',
      en: 'Entropy scrambled the extraction operation\'s PRD — the mission goal drowned in technical noise. Separate the operation contract from its execution and earn the PRD Contract certificate so the VOID machines reveal the correct route.',
    },
    hints: [
      { pl: 'Terminal certyfikacyjny stoi w południowej części lądowiska.', en: 'The certification terminal is in the southern part of the landing site.' },
      { pl: 'PRD opisuje rezultat i granice produktu, nie bibliotekę, endpoint ani framework.', en: 'A PRD describes the product outcome and boundaries, not a library, endpoint, or framework.' },
      { pl: 'Niemierzalne założenia wracają do doprecyzowania przed implementacją.', en: 'Unmeasurable assumptions return to shaping before implementation.' },
    ],
    objectives: [
      {
        id: 'earn-prd-contract-certificate',
        label: { pl: 'Zdobądź certyfikat: Kontrakt PRD', en: 'Earn certificate: PRD Contract' },
        event: 'exam:completed',
        matchPayload: { examId: 'm1-exam-prd-contract', passed: true },
        requireFlag: FLAGS.M1_EXAM_PRD_CONTRACT_DONE,
      },
    ],
    rewards: { xp: 75, flags: [FLAGS.M1_PRD_AUDIT_DONE] },
  },
];
