import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m1-eyes',
    completionType: 'event',
    title: { pl: 'Oczy misji', en: 'Eyes of the Mission' },
    briefing: {
      pl: 'CORE AI jest ślepe — nie ma sensorów. Zostań jego wywiadem: odwiedź trzy punkty pomiarowe na obrzeżach polany i opisz każdy, a potem zamelduj się przy stole obozowym.',
      en: 'CORE AI is blind — it has no sensors. Become its reconnaissance: visit the three survey points on the edges of the clearing and describe each, then report back at the camp table.',
    },
    hints: [
      { pl: 'Trzy punkty: ściana dżungli na zachodzie, linia spalenizny przy promie, widok na grań od wschodu.', en: 'Three points: the jungle wall to the west, the burn line by the shuttle, the ridge view to the east.' },
      { pl: 'Najpierw patrz i opisuj, potem buduj. To cała lekcja tego obozu.', en: 'Look and describe first, build second. That is the whole lesson of this camp.' },
      { pl: 'Po trzech opisach wróć do stołu obozowego i złóż raport.', en: 'After all three descriptions, return to the camp table and file the report.' },
    ],
    objectives: [
      {
        id: 'survey-wall',
        label: { pl: 'Opisz ścianę dżungli', en: 'Describe the jungle wall' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M1_EYES_WALL_SEEN },
        requireFlag: FLAGS.M1_EYES_WALL_SEEN,
      },
      {
        id: 'survey-burn',
        label: { pl: 'Opisz linię spalenizny', en: 'Describe the burn line' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M1_EYES_BURN_SEEN },
        requireFlag: FLAGS.M1_EYES_BURN_SEEN,
      },
      {
        id: 'survey-ridge',
        label: { pl: 'Opisz widok na grań', en: 'Describe the ridge view' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M1_EYES_RIDGE_SEEN },
        requireFlag: FLAGS.M1_EYES_RIDGE_SEEN,
      },
    ],
    rewards: { xp: 75, flags: [FLAGS.M1_EYES_DONE, FLAGS.CMDS_CREW] },
  },
];
