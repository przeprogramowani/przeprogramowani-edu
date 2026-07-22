import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-2',
    title: { pl: 'Protokół Ekspedycyjny II — Narzędzia', en: 'Expedition Protocol II — Tools' },
    description: {
      pl: 'Doktryna zestawu narzędzi: powtarzalna procedura zasługuje na trwały mechanizm, nie na improwizację. Protokół sprawdza, czy wiesz, jak działają Agent Skills.',
      en: 'The toolkit doctrine: a repeatable procedure deserves a durable mechanism, not improvisation. This protocol checks whether you know how Agent Skills work.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'W sterowni szybu porządkujesz warsztat CORE AI — część procedur ekspedycji ma zostać skillami, reszta zwykłymi poleceniami. Kiedy zgodnie z doktryną narzędzi warto zbudować Agent Skill, a kiedy wystarczy jednorazowy prompt?',
          en: 'In the shaft control room you are organizing CORE AI\'s workshop — some expedition procedures should become skills, the rest plain commands. According to the toolkit doctrine, when is it worth building an Agent Skill, and when does a one-off prompt suffice?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zawsze, gdy zadanie dotyka kodu — prompty powinny służyć wyłącznie do rozmów i wyjaśnień', en: 'Whenever the task touches code — prompts should be used only for conversations and explanations' } },
          { id: 'b', text: { pl: 'Gdy zadanie jest trudne — skill daje modelowi więcej mocy obliczeniowej niż zwykły prompt', en: 'When the task is hard — a skill gives the model more computing power than a plain prompt' } },
          { id: 'c', text: { pl: 'Prawie nigdy — skill wymaga napisania kodu i utrzymywania osobnej infrastruktury, co rzadko się opłaca', en: 'Almost never — a skill requires writing code and maintaining separate infrastructure, which rarely pays off' } },
          { id: 'd', text: { pl: 'Gdy krok jest powtarzalny i ma nazwane wejście i wyjście — jednorazową eksplorację czy edycję załatwia prompt', en: 'When the step is repeatable and has a named input and output — a one-off exploration or edit is handled by a prompt' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: {
          pl: 'CORE AI ma już zainstalowanych dwadzieścia skilli ekspedycyjnych, a mimo to sesja przy sterowni startuje z niemal pustym oknem kontekstowym. Jak progresywne ujawnianie to umożliwia?',
          en: 'CORE AI already has twenty expedition skills installed, yet the session at the shaft control starts with a nearly empty context window. How does progressive disclosure make that possible?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Skille są kompresowane do formatu binarnego, który model odczytuje przy znacznie mniejszym koszcie tokenów', en: 'Skills are compressed into a binary format that the model reads at a much lower token cost' } },
          { id: 'b', text: { pl: 'Agent widzi od startu tylko metadane każdego skilla (~100 tokenów) — pełne instrukcje SKILL.md ładują się dopiero po aktywacji', en: 'From the start the agent sees only each skill\'s metadata (~100 tokens) — the full SKILL.md instructions load only upon activation' } },
          { id: 'c', text: { pl: 'Harness trzyma treść skilli w osobnym oknie kontekstowym, które nie liczy się do limitu sesji', en: 'The harness keeps skill content in a separate context window that does not count against the session limit' } },
          { id: 'd', text: { pl: 'Instrukcje skilli są wczytywane raz i zapamiętywane przez model na stałe między sesjami', en: 'Skill instructions are loaded once and permanently memorized by the model across sessions' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Skill doradczy od diagnostyki drona zwiadowczego obiecuje, że aktywuje się sam, gdy CORE AI będzie go potrzebować. Jaki praktyczny wniosek płynie z badań nad automatyczną aktywacją (m.in. evali Vercela)?',
          en: 'The scout-drone diagnostics advisory skill promises to activate itself whenever CORE AI needs it. What practical conclusion follows from research on automatic activation (including Vercel\'s evals)?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Automatyczna aktywacja bywa zawodna, bo model nie wie, czego nie wie — kluczowe skille procesowe wywołuj jawnie po nazwie', en: 'Automatic activation can be unreliable because the model does not know what it does not know — invoke key process skills explicitly by name' } },
          { id: 'b', text: { pl: 'Aktywacja zawsze zadziała, bo opis skilla jest stale w kontekście — zawodzą tylko źle napisane instrukcje w środku', en: 'Activation always works because the skill\'s description is permanently in context — only badly written instructions inside can fail' } },
          { id: 'c', text: { pl: 'Automatyczna aktywacja działa niezawodnie, o ile skill jest zainstalowany globalnie, a nie tylko w projekcie', en: 'Automatic activation works reliably as long as the skill is installed globally rather than only in the project' } },
          { id: 'd', text: { pl: 'Najpewniej jest wkleić treść wszystkich skilli do promptu na starcie sesji — wtedy żaden nie zostanie pominięty', en: 'The safest approach is to paste the content of all skills into the prompt at session start — then none gets skipped' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_2_DONE] },
  },
];
