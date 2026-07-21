import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m2-solo-review',
    completionType: 'api-answer',
    title: { pl: 'Przeprowadź samodzielną recenzję', en: 'Run the Solo Review' },
    briefing: {
      pl: 'Ostatnia misja HQ Księżyca 2, przez łącze zapasowe Moreau: plan „WYDOBYCIE BETA" jest kompletny i czeka na zatwierdzenie. W Earth HQ przeczytaj pakiet recenzyjny jak plan obcego, któremu nie ufasz, znajdź prawdziwe defekty wśród pozorów i odeślij sam werdykt. Potem Dexo podejmie decyzję — ludzką.',
      en: 'The final HQ mission of Moon 2, via Moreau\'s backup relay: the "EXTRACTION BETA" plan is complete and awaits approval. At Earth HQ, read the review packet like a stranger\'s plan you do not trust, find the genuine defects among the look-alikes, and send back the verdict alone. Then Dexo makes the decision — a human one.',
    },
    answerHash: '36b82bbfffbe6d5d0674bc641b3aae92527697e1bac112a66c83ac6fc3bc60f2',
    hint: {
      pl: 'W Earth HQ otwórz module-002-10xdevs-workflow/PROMPT_REVIEW.md. Odpowiedź to posortowane identyfikatory defektów, rozdzielone przecinkami, bez spacji.',
      en: 'At Earth HQ, open module-002-10xdevs-workflow/PROMPT_REVIEW.md. The answer is the sorted defect ids, comma-separated, no spaces.',
    },
    hints: [
      { pl: 'Najpierw uzbrój kryteria z listy kontrolnej, dopiero potem czytaj pakiet.', en: 'Arm the checklist criteria first, and only then read the packet.' },
      { pl: 'Sekcje A i B pakietu to kontekst dla kryteriów mandatów i zależności.', en: 'Packet sections A and B are the context for the mandate and dependency criteria.' },
      { pl: 'Druga runda w roli adwokata planu: wartości graniczne i noty niewiążące to nie defekty.', en: 'A second pass as the plan\'s advocate: boundary values and non-normative notes are not defects.' },
    ],
    rewards: {
      xp: 225,
      flags: [
        FLAGS.M2_SOLO_REVIEW_DONE,
        FLAGS.M2_PLANNING_MODULE_RESTORED,
        FLAGS.M2_VOID_INTERCEPT_PLAN_FOUND,
        FLAGS.CMDS_PLANNER,
      ],
    },
  },
];
