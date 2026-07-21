import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m2-mvp-milestones',
    completionType: 'api-answer',
    title: { pl: 'Wyznacz kamienie milowe MVP', en: 'Set the MVP Milestones' },
    briefing: {
      pl: 'Misja HQ przez łącze zapasowe Moreau: zajezdnia ma twardy budżet cieplny, a kontrakt BETA potrzebuje pierwszej partii rudy w doku. W Earth HQ wybierz najmniejszy uporządkowany łańcuch odmrożeń, który dowozi wartość na każdym etapie, i prześlij sam łańcuch — nic więcej.',
      en: 'An HQ mission via Moreau\'s backup relay: the yard runs on a hard heat budget, and the BETA contract needs the first ore batch at the dock. At Earth HQ, choose the smallest ordered chain of thaws that delivers value at every step, and transmit the chain alone — nothing more.',
    },
    answerHash: '176d1b7feea954ac953a77cb60d58a5f14d16c4046a299cf81c9f4632e28876d',
    hint: {
      pl: 'W Earth HQ otwórz module-002-10xdevs-workflow/PROMPT_MILESTONES.md. Odpowiedź to identyfikatory kamieni rozdzielone „>", w kolejności wykonania.',
      en: 'At Earth HQ, open module-002-10xdevs-workflow/PROMPT_MILESTONES.md. The answer is the milestone ids joined with ">", in execution order.',
    },
    hints: [
      { pl: 'Zacznij od celu minimalnego z THAW_BUDGET.md i idź wstecz po kolumnie wymagań.', en: 'Start from the minimal goal in THAW_BUDGET.md and walk backwards along the requirements column.' },
      { pl: 'Kamień bez fizycznego efektu w zajezdni nie jest kamieniem milowym — raporty odpadają.', en: 'A milestone without a physical effect in the yard is not a milestone — reports do not qualify.' },
      { pl: 'Policz sumę kosztów łańcucha i sprawdź, czy usunięcie dowolnego kamienia łamie reguły.', en: 'Sum the chain\'s costs and check that removing any single milestone breaks the rules.' },
    ],
    rewards: { xp: 150, flags: [FLAGS.M2_MILESTONES_DONE] },
  },
];
