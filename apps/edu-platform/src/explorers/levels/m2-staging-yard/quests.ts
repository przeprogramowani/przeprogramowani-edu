import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m2-deadlock',
    completionType: 'event',
    title: { pl: 'Zakleszczenie', en: 'Deadlock' },
    briefing: {
      pl: 'Trzy wagoniki blokują się nawzajem w rozjeździe. Nie przepychaj ich siłą — napraw kolejność. Odczytaj manifesty, wyznacz jedyną wykonalną kolejność i zwolnij wagoniki: gamma, potem beta, na końcu alfa.',
      en: 'Three trams block one another in the junction. Do not shove them through — fix the order. Read the manifests, find the one feasible sequence, and release the trams: gamma, then beta, alpha last.',
    },
    hints: [
      { pl: 'Tylko gamma ma wolną bocznicę — musi ruszyć pierwsza.', en: 'Only gamma has a free siding — it must move first.' },
      { pl: 'Beta zwolni się dopiero, gdy gamma zejdzie z toru. Alfa jako ostatnia.', en: 'Beta only releases once gamma is off the track. Alpha last.' },
      { pl: 'Zła kolejność daje ostrzeżenie, nie porażkę. Sopel czyta zależności na głos.', en: 'The wrong order gives a warning, not a failure. Sopel reads the dependencies aloud.' },
    ],
    objectives: [
      {
        id: 'release-gamma',
        label: { pl: 'Zwolnij wagonik gamma', en: 'Release tram gamma' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_TRAM_GAMMA_RELEASED },
        requireFlag: FLAGS.M2_TRAM_GAMMA_RELEASED,
      },
      {
        id: 'release-beta',
        label: { pl: 'Zwolnij wagonik beta', en: 'Release tram beta' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_TRAM_BETA_RELEASED },
        requireFlag: FLAGS.M2_TRAM_BETA_RELEASED,
      },
      {
        id: 'release-alpha',
        label: { pl: 'Zwolnij wagonik alfa', en: 'Release tram alpha' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_TRAM_ALPHA_RELEASED },
        requireFlag: FLAGS.M2_TRAM_ALPHA_RELEASED,
      },
    ],
    rewards: { xp: 125, flags: [FLAGS.M2_DEADLOCK_CLEARED, FLAGS.M2_ENTROPY_PROFILED] },
  },
];
