import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-2',
    title: { pl: 'Protokół Ekspedycyjny II — Narzędzia', en: 'Expedition Protocol II — Tools' },
    description: {
      pl: 'Doktryna zestawu narzędzi: powtarzalna procedura zasługuje na trwały mechanizm, nie na improwizację. Protokół sprawdza, czy wiesz, jak rozbudować CORE AI.',
      en: 'The toolkit doctrine: a repeatable procedure deserves a durable mechanism, not improvisation. This protocol checks whether you know how to increase capabilities of CORE AI.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'W sterowni szybu chcesz zoptymalizować swoją komunikację z CORE AI: część zleceń zostawić jako jednorazowe wiadomości, a część zamienić w reużywalne skille. Kiedy krok zasługuje na skilla, a kiedy wystarczy pojedyncza wiadomość?',
          en: 'In the shaft control room you want to optimize how you communicate with CORE AI: leave some requests as one-off messages and turn others into reusable skills. When does a step deserve a skill, and when does a single message suffice?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zawsze, gdy zadanie dotyka kodu — pojedyncze wiadomości nadają się wyłącznie do rozmów i wyjaśnień', en: 'Whenever the task touches code — single messages are only fit for conversations and explanations' } },
          { id: 'b', text: { pl: 'Gdy zadanie jest trudne — skill daje modelowi więcej mocy obliczeniowej niż pojedyncza wiadomość', en: 'When the task is hard — a skill gives the model more computing power than a single message' } },
          { id: 'c', text: { pl: 'Prawie nigdy — skill wymaga napisania kodu i utrzymywania osobnej infrastruktury, co rzadko się opłaca', en: 'Almost never — a skill requires writing code and maintaining separate infrastructure, which rarely pays off' } },
          { id: 'd', text: { pl: 'Gdy krok jest powtarzalny i ma nazwane wejście i wyjście — jednorazową eksplorację czy edycję załatwia pojedyncza wiadomość', en: 'When the step is repeatable and has a named input and output — a one-off exploration or edit is handled by a single message' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: {
          pl: 'CORE AI ma już kilkanaście zainstalowanych skilli, a mimo to sesja przy sterowni startuje z niemal pustym oknem kontekstowym. Który mechanizm to zapewnia?',
          en: 'CORE AI already has a dozen-plus skills installed, yet the session at the shaft control starts with a nearly empty context window. Which mechanism ensures that?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Skille są kompresowane do formatu binarnego, który model odczytuje przy znacznie niższym koszcie tokenów', en: 'Skills are compressed into a binary format that the model reads at a much lower token cost' } },
          { id: 'b', text: { pl: 'Harness ładuje wszystkie skille na starcie, ale każdy automatycznie streszcza do jednego zdania, żeby zmieściły się w limicie', en: 'The harness loads all skills at startup but automatically condenses each into a single sentence to fit the limit' } },
          { id: 'c', text: { pl: 'Progresywne ujawnianie — na starcie agent widzi tylko metadane każdego skilla, a pełne instrukcje SKILL.md ładują się dopiero po jego aktywacji', en: 'Progressive disclosure — at startup the agent sees only each skill\'s metadata, and the full SKILL.md instructions load only after it is activated' } },
          { id: 'd', text: { pl: 'Model zapamiętuje instrukcje skilli na stałe między sesjami, więc nie musi ich wczytywać do okna kontekstowego', en: 'The model permanently memorizes skill instructions across sessions, so it need not load them into the context window' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Skill doradczy od diagnostyki drona zwiadowczego obiecuje, że aktywuje się sam, gdy CORE AI będzie go potrzebować. Jaki praktyczny wniosek płynie z badań nad automatyczną aktywacją?',
          en: 'The scout-drone diagnostics advisory skill promises to activate itself whenever CORE AI needs it. What practical conclusion follows from research on automatic activation?',
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
