import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m1-moreau-onboarding',
    completionType: 'api-answer',
    title: { pl: 'Przywróć kontekst Moreau', en: 'Restore Moreau\'s Context' },
    briefing: {
      pl: 'Misja HQ dla Nawigatora: w Earth HQ przygotuj minimalny pakiet onboardingu dla śpiącego Moreau — odfiltruj wiedzę, którą już ma, i wskaż trzy prawdziwe sygnatury Odyssey w podręczniku VOID. Od tego pakietu zależy bezpieczne wybudzenie.',
      en: 'HQ mission for the Navigator: at Earth HQ, prepare a minimal onboarding packet for the sleeping Moreau — filter out the knowledge he already has and identify the three genuine Odyssey signatures in the VOID manual. A safe wake-up depends on this packet.',
    },
    answerHash: 'bcd3d7d035d92c1f408bb907a8a45feaf3969c492f8fba952f1edd9f66080417',
    hint: {
      pl: 'W Earth HQ otwórz module-001-agentic-environment/PROMPT_MOREAU.md i zbuduj minimalny kontekst z dostarczonych materiałów.',
      en: 'At Earth HQ, open module-001-agentic-environment/PROMPT_MOREAU.md and build minimal context from the supplied materials.',
    },
    hints: [
      { pl: 'Moreau zna już radio, Dopplera i publiczną doktrynę VOID. Nie powtarzaj tej wiedzy.', en: 'Moreau already knows radio systems, Doppler, and public VOID doctrine. Do not repeat that knowledge.' },
      { pl: 'Sprawdź onboarding w świeżym kontekście albo z pomocą oddelegowanego agenta i popraw go na podstawie rzeczywistych pomyłek.', en: 'Test the onboarding in a fresh context or with a delegated agent, then improve it from observed mistakes.' },
      { pl: 'Kanoniczna odpowiedź używa rosnąco uporządkowanych numerów linii.', en: 'The canonical answer uses the line numbers in ascending order.' },
    ],
    rewards: {
      xp: 200,
      flags: [
        FLAGS.M1_MOREAU_CONTEXT_DONE,
        FLAGS.M1_MOREAU_AWAKE,
        FLAGS.M1_HARRIS_RECALL_DISCOVERED,
        FLAGS.CMDS_CREW,
      ],
    },
  },
];
