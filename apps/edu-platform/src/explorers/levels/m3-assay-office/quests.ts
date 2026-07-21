import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m3-standard',
    completionType: 'api-answer',
    title: { pl: 'Wzorzec', en: 'The Standard' },
    briefing: {
      pl: 'Odbudowany rdzeń diagnostyczny potrzebuje zaufanego wzorca odniesienia — podpisanego zestawu wektorów, zweryfikowanego krzyżowo z archiwami certyfikacji Ziemi. Nawigator uruchamia procedurę w centrali, filtruje archiwum, składa klucz wzorcowy i przesyła go przez earthctl. Każdy kandydat musi mieć drugiego, niezależnego świadka: jeden zielony nigdy nie wystarcza.',
      en: 'The rebuilt diagnostic core needs a trusted reference standard — a signed set of vectors cross-verified against Earth\'s certification archives. The Navigator runs the procedure at Earth control, filters the archive, assembles the standard key, and submits it via earthctl. Every candidate needs a second, independent witness: one green is never enough.',
    },
    hints: [
      { pl: 'Zacznij od polityki: tylko wektory z podpisem Odyssey, statusem „zatwierdzony" i zgodnym drugim odczytem.', en: 'Start with the policy: only vectors with the Odyssey signature, "approved" status, and a matching second reading.' },
      { pl: 'Klucz ma format wzorzec-<kod1>-<kod2>-<kod3>; kody układasz rosnąco według indeksu serii.', en: 'The key has the form standard-<code1>-<code2>-<code3>; order the codes by ascending series index.' },
      { pl: 'Kanarek nie wpływa na odpowiedź — odnotuj anomalię, ale klucz układasz z zatwierdzonych wektorów.', en: 'The canary does not affect the answer — log the anomaly, but assemble the key from the approved vectors.' },
    ],
    hint: {
      pl: 'Przeczytaj module-003-quality-maintenance/PROMPT_STANDARD.md i złóż podpisany klucz wzorcowy zgodnie z polityką doboru.',
      en: 'Read module-003-quality-maintenance/PROMPT_STANDARD.md and assemble the signed standard key per the selection policy.',
    },
    answerHash: '8c16f64e4f7caa2b7a8858ffff248a9446b34fcbfce1f4c25cd8d59d0921a623',
    rewards: {
      xp: 225,
      flags: [
        FLAGS.M3_DIAGNOSTICS_ONLINE,
        FLAGS.M3_CANARY_EDITED_SEEN,
        FLAGS.M3_WAKE_TRAP_DIAGNOSED,
        FLAGS.M3_PURSUIT_SPLIT_SEEN,
        FLAGS.CMDS_DIAG,
      ],
    },
  },
];
