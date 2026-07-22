import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-3',
    title: { pl: 'Protokół Ekspedycyjny III — Bezpieczne operacje', en: 'Expedition Protocol III — Safe Operations' },
    description: {
      pl: 'Doktryna bezpieczeństwa ekspedycji: agent dostaje dostęp do dysku, więc granice muszą być jawne. Protokół sprawdza, czy znasz politykę uprawnień i zasadę delegowania do CLI.',
      en: 'The expedition safety doctrine: the agent gets disk access, so the boundaries must be explicit. This protocol checks whether you know the permission policy and the delegate-to-CLI rule.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Głęboko w dżungli, gdzie milknie echo, stawiasz od zera oprogramowanie nowego modułu misji. Bootstrapper robi to komendą npm create astro@latest, zamiast kazać CORE AI napisać boilerplate z pamięci. Dlaczego delegowanie do oficjalnego CLI jest regułą?',
          en: 'Deep in the jungle, where the echo dies out, you are scaffolding a new mission module\'s software from scratch. The bootstrapper does it with npm create astro@latest instead of having CORE AI write the boilerplate from memory. Why is delegating to the official CLI the rule?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo agent nie ma uprawnień do tworzenia plików — tylko zewnętrzne CLI może zapisywać na dysku', en: 'Because the agent has no permission to create files — only an external CLI can write to disk' } },
          { id: 'b', text: { pl: 'Bo CLI generuje aktualną konfigurację i strukturę, a model z pamięci treningowej dowiezie przestarzałe wersje pakietów i składnię sprzed kilku wydań', en: 'Because the CLI generates up-to-date configuration and structure, while the model working from training memory delivers outdated package versions and syntax from several releases back' } },
          { id: 'c', text: { pl: 'Bo CLI robi to szybciej, choć wynik byłby dokładnie taki sam, gdyby napisał go agent', en: 'Because the CLI does it faster, although the result would be exactly the same if the agent wrote it' } },
          { id: 'd', text: { pl: 'Bo scaffolding przez CLI nie zużywa okna kontekstowego — chodzi wyłącznie o oszczędność tokenów', en: 'Because scaffolding via CLI does not consume the context window — it is purely about saving tokens' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Moreau prosi cię o wypchnięcie poprawki do repozytorium obozu. W settings.json ekspedycji Bash(git add *) stoi na liście allow, a Bash(git push *) na liście deny. CORE AI chce wykonać git push. Jak zostanie rozstrzygnięta ta sytuacja?',
          en: 'Moreau asks you to push a fix to the camp repository. In the expedition\'s settings.json, Bash(git add *) sits on the allow list and Bash(git push *) on the deny list. CORE AI wants to run git push. How is this resolved?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Reguły allow mają pierwszeństwo — kolejność ewaluacji to allow → ask → deny, więc push przejdzie', en: 'Allow rules take precedence — the evaluation order is allow → ask → deny, so the push goes through' } },
          { id: 'b', text: { pl: 'Decyduje kolejność wpisów w pliku — wygrywa ta reguła, która została dopisana wcześniej', en: 'The order of entries in the file decides — whichever rule was added earlier wins' } },
          { id: 'c', text: { pl: 'Wygrywa bardziej szczegółowy wzorzec, niezależnie od tego, na której liście się znajduje', en: 'The more specific pattern wins, regardless of which list it is on' } },
          { id: 'd', text: { pl: 'Ewaluacja idzie deny → ask → allow — deny na git push wygrywa z allowlistą i komenda zostaje zablokowana', en: 'Evaluation runs deny → ask → allow — the deny on git push beats the allowlist and the command is blocked' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Po dwóch godzinach klikania „Yes” przy konsoli obozowej — Harris śpi na statku i nikt nie patrzy ci na ręce — kusi cię YOLO mode (--dangerously-skip-permissions). W jakich warunkach jego użycie jest uzasadnione?',
          en: 'After two hours of clicking "Yes" at the camp console — Harris asleep on the ship, no one looking over your shoulder — you are tempted by YOLO mode (--dangerously-skip-permissions). Under what conditions is using it justified?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'W żadnych — ten tryb istnieje wyłącznie do wewnętrznych testów producenta narzędzia', en: 'None — this mode exists solely for the tool vendor\'s internal testing' } },
          { id: 'b', text: { pl: 'Gdy projekt jest mały — w niewielkim repozytorium agent nie jest w stanie wyrządzić poważnej szkody', en: 'When the project is small — in a small repository the agent cannot do serious damage' } },
          { id: 'c', text: { pl: 'W izolowanym środowisku typu dev container lub VM — bez dostępu do sekretów i produkcji, z gitem jako siecią bezpieczeństwa', en: 'In an isolated environment such as a dev container or VM — with no access to secrets or production, and git as the safety net' } },
          { id: 'd', text: { pl: 'Gdy masz dobrą denylistę — reguła blokująca rm -rf wystarczy, bo polityka uprawnień działa w sposób absolutny', en: 'When you have a good denylist — a rule blocking rm -rf is enough, because the permission policy is absolute' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_3_DONE] },
  },
];
