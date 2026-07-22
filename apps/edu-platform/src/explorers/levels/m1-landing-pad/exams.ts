import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-1',
    title: { pl: 'Protokół Ekspedycyjny I — Najpierw pytania', en: 'Expedition Protocol I — Questions First' },
    description: {
      pl: 'Doktryna otwarcia każdej ekspedycji: zanim maszyna zacznie budować, kontrakt musi być spisany. Protokół sprawdza, czy wiesz, jak z mętnego pomysłu powstaje PRD.',
      en: 'The opening doctrine of every expedition: before the machine starts building, the contract must be written down. This protocol checks whether you know how a vague idea becomes a PRD.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Moreau chce, żeby CORE AI zaprojektowało system zarządzania zapasami obozu. Przy konsoli obozowej kusi cię skrót: wkleić maszynie mętny pomysł i napisać „przygotuj PRD”. Dlaczego sesja pytań (/10x-shape) powinna przyjść przed generowaniem dokumentu?',
          en: 'Moreau wants CORE AI to design the camp\'s supply-management system. At the base-camp console the shortcut is tempting: paste the machine a vague idea and write "generate a PRD". Why should a questioning session (/10x-shape) come before generating the document?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo model nie potrafi wygenerować tak długiego dokumentu w jednym kroku i trzeba go prowadzić etapami', en: 'Because the model cannot generate such a long document in one step and must be guided in stages' } },
          { id: 'b', text: { pl: 'Bo PRD napisany bez pytań będzie zbyt krótki i zbyt mało techniczny, by dało się z nim pracować', en: 'Because a PRD written without questions will be too short and too untechnical to work with' } },
          { id: 'c', text: { pl: 'Bo poproszony od razu o dokument model uzupełni braki prawdopodobnymi założeniami — dostaniesz tekst z decyzjami, których nigdy nie podjąłeś', en: 'Because asked for a document right away, the model will fill the gaps with plausible assumptions — you get text containing decisions you never made' } },
          { id: 'd', text: { pl: 'Bo bez sesji pytań agent nie ma uprawnień do zapisania pliku prd.md na dysku projektu', en: 'Because without a questioning session the agent has no permission to write the prd.md file to the project disk' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Po sesji planistycznej z Moreau uruchamiasz w repozytorium ekspedycji /10x-prd. Skill przepisuje wasze shape-notes.md do struktury PRD i trafia na decyzję, której w notatkach brakuje. Co robi z taką luką?',
          en: 'After the planning session with Moreau you run /10x-prd in the expedition repo. The skill rewrites your shape-notes.md into the PRD structure and hits a decision missing from the notes. What does it do with such a gap?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Wpisuje ją wprost do sekcji Open Questions, żebyś mógł ją uzupełnić — nie domyśla się i nie dopowiada za ciebie', en: 'It records it explicitly in the Open Questions section for you to fill in — it does not guess or fill it in for you' } },
          { id: 'b', text: { pl: 'Uzupełnia ją najbardziej sensownym domysłem, żeby dokument był kompletny i gotowy do dalszej pracy', en: 'It fills it with the most sensible guess, so the document is complete and ready for further work' } },
          { id: 'c', text: { pl: 'Przerywa generowanie i automatycznie uruchamia nową sesję /10x-shape od początku', en: 'It aborts generation and automatically restarts a fresh /10x-shape session from the beginning' } },
          { id: 'd', text: { pl: 'Pomija ją bez śladu — do PRD trafiają wyłącznie potwierdzone decyzje', en: 'It skips it without a trace — only confirmed decisions make it into the PRD' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Moreau przegląda gotowy dokument przy kawie, której wciąż nie ma, i pyta: co właściwie należy do zakresu dobrego PRD, a co celowo zostaje poza nim?',
          en: 'Moreau reviews the finished document over the coffee she still does not have and asks: what actually belongs in the scope of a good PRD, and what is deliberately left out of it?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'PRD powinien zawierać też tech stack i plan wdrożenia — jeden dokument z kompletem decyzji jest wygodniejszy', en: 'A PRD should also contain the tech stack and the deployment plan — one document with the full set of decisions is more convenient' } },
          { id: 'b', text: { pl: 'PRD to zapis przebiegu sesji shape — im wierniej oddaje rozmowę, tym lepiej służy jako kontrakt', en: 'A PRD is a transcript of the shape session — the more faithfully it reflects the conversation, the better it serves as a contract' } },
          { id: 'c', text: { pl: 'PRD jest dokumentem jednorazowym — po bootstrapie projektu przestaje mieć znaczenie dla kolejnych promptów', en: 'A PRD is a one-off document — after the project bootstrap it stops mattering for subsequent prompts' } },
          { id: 'd', text: { pl: 'PRD opisuje produkt i biznes: personę, user stories, non-goals, kryteria sukcesu — tech stack i deployment celowo zostają w osobnych artefaktach', en: 'A PRD describes the product and the business: persona, user stories, non-goals, success criteria — the tech stack and deployment deliberately live in separate artifacts' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_1_DONE] },
  },
];
