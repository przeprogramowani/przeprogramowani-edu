import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m1-calibration',
    completionType: 'api-answer',
    title: { pl: 'Kalibracja', en: 'Calibration' },
    briefing: {
      pl: 'Tablica sensorów jest złożona i zasilona na grani, ale jej punkt odniesienia trzeba zweryfikować krzyżowo z danymi po stronie Ziemi. Nawigator: uruchom procedurę Earth HQ, przefiltruj wiarygodne beacony, złóż klucz kalibracji i prześlij go przez earthctl.',
      en: 'The sensor array is assembled and powered on the crest, but its reference point must be cross-verified against Earth-side data. Navigator: run the Earth HQ procedure, filter the trustworthy beacons, assemble the calibration key, and submit it via earthctl.',
    },
    hints: [
      { pl: 'Instrukcja misji: module-001-agentic-environment/PROMPT_CALIBRATION.md w repozytorium Earth HQ.', en: 'Mission brief: module-001-agentic-environment/PROMPT_CALIBRATION.md in the Earth HQ repository.' },
      { pl: 'Liczą się tylko beacony zweryfikowane, ze źródła earth-hq, z dryfem w tolerancji. Klucz układasz rosnąco po dryfie.', en: 'Only verified beacons, from source earth-hq, with drift within tolerance count. Order the key by ascending drift.' },
      { pl: 'Format klucza: cal-<kod1>-<kod2>-<kod3>. Prześlij przez earthctl submit.', en: 'Key format: cal-<code1>-<code2>-<code3>. Submit via earthctl submit.' },
    ],
    answerHash: '43137fb4a8f2512314a8090cb54fe2f53cff86be0c77bec23f30b58b76409234',
    hint: {
      pl: 'Sprawdź reguły w CALIBRATION_POLICY.md: tylko verified = yes, source = earth-hq, drift_ms w tolerancji, klucz rosnąco po drift_ms.',
      en: 'Check the rules in CALIBRATION_POLICY.md: only verified = yes, source = earth-hq, drift_ms within tolerance, key ordered by ascending drift_ms.',
    },
    rewards: {
      xp: 225,
      flags: [
        FLAGS.M1_SENSORS_ONLINE,
        FLAGS.M1_HQ_ECHO_LOGGED,
        FLAGS.CMDS_SCAN,
        FLAGS.CMDS_SENSORS,
        FLAGS.CMDS_UPLINK,
      ],
    },
  },
];
