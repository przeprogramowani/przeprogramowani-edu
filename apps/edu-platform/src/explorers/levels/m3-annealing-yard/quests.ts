import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m3-first-cert',
    completionType: 'event',
    title: { pl: 'Pierwszy Certyfikat', en: 'The First Certificate' },
    briefing: {
      pl: 'Zasil moduł probierczy, certyfikuj pętlę chłodzenia placu, a potem przeprowadź partię przez wygrzew i badanie. Maszyna bada — ale poręczenie czeka na człowieka. Księżyc 1: znaleźć. Księżyc 2: przetopić. Księżyc 3: poręczyć.',
      en: 'Power the assay rig, certify the yard\'s cooling loop, then run the batch through the anneal and the assay. The machine tests — but the vouching waits on a human. Moon 1: find. Moon 2: smelt. Moon 3: vouch.',
    },
    hints: [
      { pl: 'Zacznij przy module probierczym — pierwsze dotknięcie go zasila.', en: 'Start at the assay rig — the first touch powers it up.' },
      { pl: 'Stacja „Regresja" certyfikuje pętlę chłodzenia. Sprawdzaj wersje ze środka podejrzanego zakresu; każdy niespójny odczyt sprawdź ponownie.', en: 'The Regression station certifies the cooling loop. Check versions from the middle of the suspect range; check every inconsistent reading again.' },
      { pl: 'Po certyfikacji pętli poprowadź partię przez rząd wygrzewu.', en: 'Once the loop is certified, run the batch through the anneal row.' },
    ],
    objectives: [
      {
        id: 'power-rig',
        label: { pl: 'Zasil moduł probierczy', en: 'Power the assay rig' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M3_ASSAY_RIG_POWERED },
        requireFlag: FLAGS.M3_ASSAY_RIG_POWERED,
      },
      {
        id: 'certify-loop',
        label: { pl: 'Certyfikuj pętlę chłodzenia', en: 'Certify the cooling loop' },
        event: 'arcade:completed',
        matchPayload: { arcadeGameId: 'arcade-fault-trace', solved: true },
        requireFlag: FLAGS.M3_COOLING_CERTIFIED,
      },
      {
        id: 'anneal-batch',
        label: { pl: 'Przeprowadź partię przez wygrzew', en: 'Run the batch through the anneal' },
        event: 'flag:set',
        matchPayload: { flag: FLAGS.M3_BATCH_ANNEALED },
        requireFlag: FLAGS.M3_BATCH_ANNEALED,
      },
    ],
    rewards: { xp: 150, flags: [FLAGS.M3_FIRST_CERT] },
  },
];
