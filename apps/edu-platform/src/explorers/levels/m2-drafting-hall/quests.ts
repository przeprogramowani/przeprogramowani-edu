import type { EventQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: EventQuest[] = [
  {
    id: 'q-m2-agent-architecture',
    completionType: 'event',
    title: { pl: 'Narysuj architekturę operacji', en: 'Draw the Operation Architecture' },
    briefing: {
      pl: 'Rejestr nie dopuści wykonania planu BETA bez aneksu architektury. Z CORE AI i Draftsmanem A-3 rozpisz role jednostek-agentów, kontrakty interfejsów i granice mandatów, a potem zdobądź certyfikat Architektura z agentami, aby A-3 ostemplował aneks.',
      en: 'The registry will not clear the BETA plan for execution without an architecture annex. With CORE AI and Draftsman A-3, lay out the agent-unit roles, interface contracts, and mandate boundaries, then earn the Architecture with Agents certificate so A-3 stamps the annex.',
    },
    hints: [
      { pl: 'Terminal certyfikacyjny stoi przy północno-wschodniej ścianie kreślarni.', en: 'The certification terminal stands by the north-east wall of the drafting hall.' },
      { pl: 'Architektura z agentami odpowiada na trzy pytania A-3: kto, czym i dokąd.', en: 'Architecture with agents answers A-3\'s three questions: who, with what, and up to where.' },
      { pl: 'Jednostka, która przekracza swój mandat, to Entropia w wersji kieszonkowej.', en: 'A unit exceeding its mandate is Entropy, pocket edition.' },
    ],
    objectives: [
      {
        id: 'earn-agent-architecture-certificate',
        label: { pl: 'Zdobądź certyfikat: Architektura z agentami', en: 'Earn certificate: Architecture with Agents' },
        event: 'exam:completed',
        matchPayload: { examId: 'm2-exam-agent-architecture', passed: true },
        requireFlag: FLAGS.M2_EXAM_AGENT_ARCHITECTURE_DONE,
      },
    ],
    rewards: { xp: 125, flags: [FLAGS.M2_ARCHITECTURE_DONE] },
  },
];
