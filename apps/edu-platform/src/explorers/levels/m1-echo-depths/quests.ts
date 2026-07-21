import type { ApiAnswerQuest } from '../../systems/QuestManager';
import { FLAGS } from '../../config/flags';

export const quests: ApiAnswerQuest[] = [
  {
    id: 'q-m1-echotrace',
    completionType: 'api-answer',
    title: { pl: 'Zbuduj EchoTrace', en: 'Build EchoTrace' },
    briefing: {
      pl: 'Misja HQ dla Nawigatora: w Earth HQ zbuduj powtarzalny skill EchoTrace, pobierz trzy chronione skany echa i sklasyfikuj komory — bez wchodzenia do niestabilnych tuneli. Dexo czeka przy konsoli na wyniki.',
      en: 'HQ mission for the Navigator: at Earth HQ, build the repeatable EchoTrace skill, fetch the three protected echo scans, and classify the cavities — without entering the unstable tunnels. Dexo is waiting at the console for the results.',
    },
    answerHash: 'dc678dbc056ac0da2252e9ef7fb044c3eaf3952890561a0d56fb6011b118b78e',
    hint: {
      pl: 'W Earth HQ otwórz module-001-agentic-environment/PROMPT_ECHOTRACE.md. Identyfikatory śladów znajdziesz także przy trzech barierach w Rozpadlinie Echa.',
      en: 'At Earth HQ, open module-001-agentic-environment/PROMPT_ECHOTRACE.md. The trace identifiers also appear beside the three barriers in the Echo Depths.',
    },
    hints: [
      { pl: 'Dobierz natywny mechanizm wielokrotnego użycia do swojego agenta: skill, instrukcję albo równoważny artefakt.', en: 'Choose the native reusable mechanism offered by your agent: a skill, instruction file, or equivalent artifact.' },
      { pl: 'Twój mechanizm ma pobierać token z konfiguracji lokalnej; sekret nie może trafić do repozytorium.', en: 'Your mechanism must read the token from local configuration; the secret must not enter the repository.' },
      { pl: 'Odpowiedź tworzą trzy kody klasyfikacji w kolejności ALFA, BETA, GAMMA.', en: 'The answer is formed from three classification codes in ALPHA, BETA, GAMMA order.' },
    ],
    rewards: { xp: 150, flags: [FLAGS.M1_ECHOTRACE_DONE, FLAGS.CMDS_SCAN] },
  },
];
