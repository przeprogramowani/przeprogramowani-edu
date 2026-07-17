import type { LevelManifest } from '../types';
import { dialogues } from './dialogues';
import { exams } from './exams';
import { quests } from './quests';
import { FLAGS } from '../../config/flags';

export const manifest: LevelManifest = {
  id: 'm0-exam-room',
  displayName: { pl: 'Sala Egzaminacyjna', en: 'Examination Hall' },
  dialogues,
  interactionRoutes: [
    {
      zoneId: 'study-notes-board',
      defaultDialogue: 'm0-study-notes-board',
      flagVariants: [{ flag: FLAGS.CMDS_BOOKMARKS, dialogue: 'm0-study-notes-board-revisit' }],
    },
    { zoneId: 'exam-llm-basics', defaultDialogue: 'm0-exam-agent-systems-already' },
    { zoneId: 'exam-prompting', defaultDialogue: 'm0-exam-operational-procedures-already' },
    { zoneId: 'exam-tokenization', defaultDialogue: 'm0-exam-context-engineering-already' },
    { zoneId: 'coreai-room-door', defaultDialogue: 'm0-exam-room-door-locked' },
    {
      zoneId: 'officer-harris',
      defaultDialogue: 'npc-officer-harris',
      flagVariants: [{ flag: FLAGS.QUEST_EXAMS_DONE, dialogue: 'npc-officer-harris-exams-done' }],
    },
  ],
  quests,
  questCompletionDialogues: {
    'q-pass-exams': 'q-pass-exams-done',
  },
  exams,
  examCompletionDialogues: {
    'm0-exam-agent-systems': 'm0-exam-agent-systems-done',
    'm0-exam-operational-procedures': 'm0-exam-operational-procedures-done',
    'm0-exam-context-engineering': 'm0-exam-context-engineering-done',
  },
};
