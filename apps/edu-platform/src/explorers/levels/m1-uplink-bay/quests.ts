import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m1-uplink-decision',
    completionType: 'api-answer',
    title: { pl: 'Przygotuj bezpieczny uplink', en: 'Prepare a Safe Uplink' },
    briefing: {
      pl: 'Ostatnia misja HQ Księżyca 1: w Earth HQ porównaj trzy trasy transmisji, wybierz jedną z minimalnym ładunkiem, poddaj decyzję kontrariańskiej recenzji i zatrzymaj gotową transmisję na granicy autoryzacji człowieka.',
      en: 'The final HQ mission of Moon 1: at Earth HQ, compare the three transmission routes, pick one with a minimal payload, subject the decision to adversarial review, and stop the prepared transmission at the human-authorisation boundary.',
    },
    answerHash: '4004fda5f0d9f8f9f6de8e5b55b9c72a14dfbeaa62bf211c8be6e7a706fef33d',
    hint: {
      pl: 'W Earth HQ otwórz module-001-agentic-environment/PROMPT_UPLINK.md. Ostatnia transmisja wymaga osobistego potwierdzenia Nawigatora.',
      en: 'At Earth HQ, open module-001-agentic-environment/PROMPT_UPLINK.md. The final transmission requires the Navigator\'s explicit confirmation.',
    },
    hints: [
      { pl: 'Porównaj ograniczenia polityki z parametrami wszystkich tras i elementów ładunku.', en: 'Compare the policy constraints with every route and payload item.' },
      { pl: 'Poproś oddelegowane agenty o kontrariańskie sprawdzenie, jeśli Twoje narzędzie to umożliwia; w przeciwnym razie wykonaj osobne przebiegi recenzji.', en: 'Ask delegated agents for adversarial checks when your tool supports them; otherwise run separate review passes.' },
      { pl: 'Agent przygotowuje odpowiedź, lecz nie może sam zatwierdzić wysłania współrzędnych.', en: 'The agent prepares the answer but cannot authorise sending the coordinates by itself.' },
    ],
    rewards: {
      xp: 225,
      flags: [
        FLAGS.M1_UPLINK_DONE,
        FLAGS.M1_BASIC_SENSORS_RESTORED,
        FLAGS.M1_HQ_CHANNEL_SUSPECT,
        FLAGS.CMDS_INTEL,
        FLAGS.CMDS_UPLINK,
        FLAGS.CMDS_SENSORS,
      ],
    },
  },
];
