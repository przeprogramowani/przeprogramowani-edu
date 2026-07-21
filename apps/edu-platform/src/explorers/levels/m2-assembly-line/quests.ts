import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m2-impl-control',
    completionType: 'api-answer',
    title: { pl: 'Skoryguj dryf wykonania', en: 'Correct the Execution Drift' },
    briefing: {
      pl: 'Misja HQ przez łącze zapasowe Moreau: F-6 wykonał kamień 1 planu BETA, a ślad wykonania trafił do Earth HQ. Porównaj ślad z zatwierdzonym planem, znajdź pierwszy dryf, przypisz go do właściwej bramki i nadaj działanie korygujące z polityki kontroli. Wraca sam werdykt: punkt i akcja.',
      en: 'An HQ mission via Moreau\'s backup relay: F-6 executed milestone 1 of the BETA plan, and the execution trace reached Earth HQ. Compare the trace against the approved plan, find the first drift, attribute it to the right gate, and issue the corrective action from the control policy. Only the verdict returns: a checkpoint and an action.',
    },
    answerHash: '0502a2552ef980c2af63fe4ae40bc6abc33d6d80e2d75eae23d892d82356951d',
    hint: {
      pl: 'W Earth HQ otwórz module-002-10xdevs-workflow/PROMPT_CONTROL.md. Odpowiedź ma format CP<numer>:<AKCJA>, bez spacji.',
      en: 'At Earth HQ, open module-002-10xdevs-workflow/PROMPT_CONTROL.md. The answer has the format CP<number>:<ACTION>, no spaces.',
    },
    hints: [
      { pl: 'Czytaj ślad w kolejności seq i porównuj każdą pozycję z planem — liczy się pierwszy dryf.', en: 'Read the trace in seq order and compare every row against the plan — only the first drift counts.' },
      { pl: 'Sprawdź zasadę przypisania: odchylenie przypisuje się bramce, przy której staje się widoczne.', en: 'Check the attribution rule: a deviation is attributed to the gate at which it becomes visible.' },
      { pl: 'Wartości graniczne tolerancji są nadal w tolerancji — nie każda liczba blisko limitu to dryf.', en: 'Boundary values are still within tolerance — not every number near the limit is drift.' },
    ],
    rewards: { xp: 200, flags: [FLAGS.M2_IMPL_CONTROL_DONE] },
  },
];
