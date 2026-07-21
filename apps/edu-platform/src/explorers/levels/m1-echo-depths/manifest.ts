import type { LevelManifest } from '../types';
import { FLAGS } from '../../config/flags';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';

export const manifest: LevelManifest = {
  id: 'm1-echo-depths',
  displayName: { pl: 'Rozpadlina Echa', en: 'Echo Depths' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'echo-console',
      defaultDialogue: 'm1-echo-console-start',
      flagVariants: [{ flag: FLAGS.M1_ECHOTRACE_DONE, dialogue: 'm1-echo-console-done' }],
    },
    {
      zoneId: 'cavity-alpha',
      defaultDialogue: 'm1-cavity-alpha',
      flagVariants: [{ flag: FLAGS.M1_ECHOTRACE_DONE, dialogue: 'm1-cavity-alpha-scanned' }],
    },
    {
      zoneId: 'cavity-beta',
      defaultDialogue: 'm1-cavity-beta',
      flagVariants: [{ flag: FLAGS.M1_ECHOTRACE_DONE, dialogue: 'm1-cavity-beta-scanned' }],
    },
    {
      zoneId: 'cavity-gamma',
      defaultDialogue: 'm1-cavity-gamma',
      flagVariants: [{ flag: FLAGS.M1_ECHOTRACE_DONE, dialogue: 'm1-cavity-gamma-scanned' }],
    },
    {
      zoneId: 'synaptit-outcrop',
      defaultDialogue: 'm1-synaptit-outcrop',
      flagVariants: [{ flag: FLAGS.M1_ECHOTRACE_DONE, dialogue: 'm1-synaptit-confirmed' }],
    },
    {
      zoneId: 'echo-mapper',
      defaultDialogue: 'm1-echo-mapper',
      flagVariants: [{ flag: FLAGS.M1_ECHOTRACE_DONE, dialogue: 'm1-echo-mapper-done' }],
    },
    { zoneId: 'shaft-control-door', defaultDialogue: 'm1-shaft-door-locked' },
    { zoneId: 'exam-agent-skills', defaultDialogue: 'm1-exam-agent-skills-already' },
  ],
  quests,
  questCompletionDialogues: { 'q-m1-echotrace': 'm1-echotrace-complete' },
  exams,
  examCompletionDialogues: { 'm1-exam-agent-skills': 'm1-exam-agent-skills-done' },
  introDialogue: 'm1-echo-intro',
  introFlag: FLAGS.M1_ECHO_INTRO_SEEN,
  introCinematicTitle: 'Księżyc 1 — Rozpadlina Echa',
  introCinematicSubtitle: 'Trzy zapieczętowane komory',
};
