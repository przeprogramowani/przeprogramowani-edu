import type { ApiAnswerQuest } from '@/explorers/systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-earth-signal',
    completionType: 'api-answer',
    title: { pl: 'Sygnał z Ziemi', en: 'Signal from Earth' },
    briefing:
      { pl: 'Twój SmartTerminal wykrył słaby sygnał z Ziemi. Wygląda na to, że ktoś jest po drugiej stronie. Docelowa wiadomość nie została jednak odebrana. Trwa oczekiwanie.', en: 'Your SmartTerminal has detected a faint signal from Earth. Someone appears to be on the other end. The target message has not been received yet. Waiting.' },
    answerHash: '48bfc67cf7698f4540c14c5d6ee5f5ee2229e9019f22512ef1238ba690fae334',
    hint: { pl: 'Wykonaj ekstrakcję logów związanych z misją kosmiczną. Patrz na krańce wiadomości. Łącz to, co rozproszone.', en: 'Extract logs related to the space mission. Look at the edges of the messages. Connect what is scattered.' },
    hints: [
      { pl: "Raport zawiera zaszumione komunikaty. Usuń zbędne informacje.", en: "The report contains noisy messages. Remove the irrelevant data." },
      { pl: "Skup się na tym, co istotne. Niektóre fragmenty są tylko szumem.", en: "Focus on what matters. Some fragments are just noise." },
      { pl: "Ostatnie elementy to klucz do rozwiązania zagadki.", en: "The final elements are the key to solving the puzzle." },
    ],
    rewards: {
      xp: 100,
      flags: [FLAGS.M0_EARTH_SIGNAL_RECEIVED],
    },
  },
];
