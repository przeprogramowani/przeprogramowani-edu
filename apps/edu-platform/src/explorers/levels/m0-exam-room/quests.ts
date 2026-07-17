import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

const questPassExams: EventQuest = {
  id: 'q-pass-exams',
  completionType: 'event',
  title: { pl: 'Zdaj egzaminy weryfikacyjne', en: 'Pass the verification exams' },
  briefing:
    { pl: 'Zdaj wszystkie trzy egzaminy weryfikacyjne, aby odzyskać dostęp do systemów statku.', en: 'Pass all three verification exams to regain access to the ship systems.' },
  hints: [
    { pl: 'W sali egzaminacyjnej znajdziesz materiały do nauki.', en: 'You will find study materials in the exam room.' },
    { pl: 'Udziel poprawnych odpowiedzi aby zaliczyć egzamin.', en: 'Answer correctly to pass the exam.' },
    { pl: 'Użyj /bookmarks, aby wracać do notatek szkoleniowych.', en: 'Use /bookmarks to return to your training notes.' },
  ],
  objectives: [
    {
      id: 'exam-agent-systems',
      label: { pl: 'Zdaj egzamin: Systemy agentowe', en: 'Pass exam: Agentic Systems' },
      event: 'exam:completed',
      matchPayload: { examId: 'm0-exam-agent-systems', passed: true },
      requireFlag: FLAGS.M0_EXAM_AGENT_SYSTEMS_DONE,
    },
    {
      id: 'exam-operational-procedures',
      label: { pl: 'Zdaj egzamin: Procedury operacyjne', en: 'Pass exam: Operational Procedures' },
      event: 'exam:completed',
      matchPayload: { examId: 'm0-exam-operational-procedures', passed: true },
      requireFlag: FLAGS.M0_EXAM_OPERATIONAL_PROCEDURES_DONE,
    },
    {
      id: 'exam-context-engineering',
      label: { pl: 'Zdaj egzamin: Context Engineering', en: 'Pass exam: Context Engineering' },
      event: 'exam:completed',
      matchPayload: { examId: 'm0-exam-context-engineering', passed: true },
      requireFlag: FLAGS.M0_EXAM_CONTEXT_ENGINEERING_DONE,
    },
  ],
  rewards: { xp: 20, flags: [FLAGS.QUEST_EXAMS_DONE] },
};

export const quests = [questPassExams];
