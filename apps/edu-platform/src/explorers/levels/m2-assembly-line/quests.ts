import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m2-first-melt',
    completionType: 'event',
    title: { pl: 'Pierwszy Wytop', en: 'The First Melt' },
    briefing: {
      pl: 'Wznów wytop huty i odbierz pierwszy rafinowany Synaptit. Otwórz lodową galerię przy sterowni, zaplanuj dostawy rudy do pieca na stacji zwrotnicy, a na końcu poprowadź ostatnią fazę — odlew — ręcznie przy kadzi.',
      en: 'Restart the foundry\'s melt and secure the first refined Synaptit. Open the ice gallery at the control console, plan the ore deliveries to the furnace at the switchyard station, then finish the last phase — the cast — by hand at the crucible.',
    },
    hints: [
      { pl: 'Zacznij przy sterowni huty — stamtąd otworzysz galerię.', en: 'Start at the foundry control — that is where you open the gallery.' },
      { pl: 'Zwrotnica to plan tras: ułóż go, gdy wagoniki stoją, potem uruchom harmonogram.', en: 'The switchyard is a route plan: lay it out while the trams stand still, then run the schedule.' },
      { pl: 'Odlew kończysz ręcznie przy kadzi — maszyna niesie wytop, ty kończysz robotę.', en: 'You finish the cast by hand at the crucible — the machine carries the melt, you finish the job.' },
    ],
    objectives: [
      {
        id: 'open-gallery',
        label: { pl: 'Otwórz lodową galerię', en: 'Open the ice gallery' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_GALLERY_OPEN },
        requireFlag: FLAGS.M2_GALLERY_OPEN,
      },
      {
        id: 'switchyard',
        label: { pl: 'Zaplanuj dostawy na zwrotnicy', en: 'Plan the deliveries at the switchyard' },
        event: 'arcade:completed',
        matchPayload: { arcadeGameId: 'arcade-switchyard', solved: true },
        requireFlag: FLAGS.M2_SWITCHYARD_DONE,
      },
      {
        id: 'manual-cast',
        label: { pl: 'Poprowadź ręczny odlew', en: 'Finish the manual cast' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M2_CAST_DONE },
        requireFlag: FLAGS.M2_CAST_DONE,
      },
    ],
    rewards: { xp: 150, flags: [FLAGS.M2_FIRST_INGOT] },
  },
];
