import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m2-master-plan',
    completionType: 'api-answer',
    title: { pl: 'Plan Główny', en: 'The Master Plan' },
    briefing: {
      pl: 'Rdzeń Harmonogramu jest wyczyszczony z zatrutego planu. Szkielet nowego planu głównego trzeba sprawdzić krzyżowo z archiwami budowy Odyssey-F po stronie Ziemi. Nawigator uruchamia procedurę w centrali, składa podpisany klucz planu i przesyła go przez earthctl — zatwierdzenie należy do człowieka.',
      en: "The Schedule Core is scrubbed of the poisoned plan. The skeleton of the new master plan must be cross-checked against the Odyssey-F build archives on Earth's side. The Navigator runs the procedure at HQ, assembles the signed plan key, and submits it via earthctl — the human confirms.",
    },
    hints: [
      {
        pl: 'Procedurę prowadzi Nawigator w centrali (10x-explorers-hq), nie postać w grze.',
        en: 'The Navigator runs the procedure at HQ (10x-explorers-hq), not an in-game character.',
      },
      {
        pl: 'Liczą się tylko bloki harmonogramu z właściwym podpisem, statusem i rewizją budowy — reszta to wabiki.',
        en: 'Only schedule blocks with the right signature, status, and build revision count — the rest are decoys.',
      },
      {
        pl: 'Klucz ma format plan-<kod>-<kod>-<kod>, a kody układasz według rosnącego takt_index. Prześlij przez earthctl.',
        en: 'The key format is plan-<code>-<code>-<code>, with codes ordered by ascending takt_index. Submit via earthctl.',
      },
    ],
    hint: {
      pl: 'Zajrzyj do module-002-10xdevs-workflow/PROMPT_MASTER_PLAN.md w centrali i złóż klucz planu według polityki wyboru bloków.',
      en: 'Open module-002-10xdevs-workflow/PROMPT_MASTER_PLAN.md at HQ and assemble the plan key per the block-selection policy.',
    },
    answerHash: 'e784b67db0dc4a5c97e8c9bdf0f238c840443099e4d8ff2493e2ee0905cd3f45',
    rewards: {
      xp: 225,
      flags: [
        FLAGS.M2_PLANNING_ONLINE,
        FLAGS.M2_SABOTAGE_TIMESTAMPED,
        FLAGS.M2_PURSUIT_ON_MAP,
        FLAGS.M2_CHECKSUM_MISMATCH_SEEN,
        FLAGS.CMDS_PLAN,
      ],
    },
  },
];
