import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m2-plan-contract',
    completionType: 'event',
    title: { pl: 'Zarejestruj kontrakt planu', en: 'Register the Plan Contract' },
    briefing: {
      pl: 'Rejestr PN-0 nie przyjął nowego planu od 847 cykli. Z CORE AI ułóż kontrakt planu wydobycia BETA — cel, zakres, kryteria sukcesu, nie-cele — i zdobądź certyfikat Plan przed kodem, aby Registrar L-4 nadał kontraktowi sygnaturę.',
      en: 'The PN-0 registry has accepted no new plan in 847 cycles. With CORE AI, draft the BETA extraction plan contract — goal, scope, success criteria, non-goals — and earn the Plan Before Code certificate so Registrar L-4 assigns the contract its signature.',
    },
    hints: [
      { pl: 'Terminal certyfikacyjny stoi w południowej komorze atrium.', en: 'The certification terminal stands in the southern chamber of the atrium.' },
      { pl: 'Kontrakt planu opisuje cel, zakres, mierzalne kryteria sukcesu i jawne nie-cele — nie kod.', en: 'A plan contract describes the goal, scope, measurable success criteria, and explicit non-goals — not code.' },
      { pl: 'Zmiany zakresu w trakcie pracy wracają do decydenta przed dalszą implementacją.', en: 'Scope changes mid-work return to the decision-maker before implementation continues.' },
    ],
    objectives: [
      {
        id: 'earn-plan-first-certificate',
        label: { pl: 'Zdobądź certyfikat: Plan przed kodem', en: 'Earn certificate: Plan Before Code' },
        event: 'exam:completed',
        matchPayload: { examId: 'm2-exam-plan-first', passed: true },
        requireFlag: FLAGS.M2_EXAM_PLAN_FIRST_DONE,
      },
    ],
    rewards: { xp: 75, flags: [FLAGS.M2_PLAN_CONTRACT_DONE, FLAGS.CMDS_PLAN] },
  },
];
