import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-uplink-bay',
  displayName: { pl: 'Rezerwowa Zatoka Uplink', en: 'Reserve Uplink Bay' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'uplink-console',
      defaultDialogue: 'm1-uplink-console-start',
      flagVariants: [{ flag: FLAGS.M1_UPLINK_DONE, dialogue: 'm1-uplink-console-done' }],
    },
    { zoneId: 'classical-route', defaultDialogue: 'm1-classical-route' },
    { zoneId: 'amplified-route', defaultDialogue: 'm1-amplified-route' },
    { zoneId: 'relay-route', defaultDialogue: 'm1-relay-route' },
    {
      zoneId: 'human-auth-panel',
      defaultDialogue: 'm1-human-auth',
      flagVariants: [{ flag: FLAGS.M1_UPLINK_DONE, dialogue: 'm1-human-auth-done' }],
    },
    {
      zoneId: 'relay-tender',
      defaultDialogue: 'm1-relay-tender',
      flagVariants: [{ flag: FLAGS.M1_UPLINK_DONE, dialogue: 'm1-relay-tender-done' }],
    },
    { zoneId: 'moon-two-door', defaultDialogue: 'm1-moon-two-locked' },
    { zoneId: 'exam-authorization-boundary', defaultDialogue: 'm1-exam-authorization-boundary-already' },
  ],
  quests,
  exams,
  questCompletionDialogues: { 'q-m1-uplink-decision': 'm1-uplink-decision-complete' },
  examCompletionDialogues: { 'm1-exam-authorization-boundary': 'm1-exam-authorization-boundary-done' },
  introDialogue: 'm1-uplink-intro',
  introFlag: FLAGS.M1_UPLINK_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Rezerwowa Zatoka Uplink',
  introCinematicSubtitle: 'Ostatni krok do odzyskania sensorów',
};
