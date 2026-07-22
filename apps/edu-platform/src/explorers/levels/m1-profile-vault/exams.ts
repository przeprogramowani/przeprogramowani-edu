import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-4',
    title: { pl: 'Protokół Ekspedycyjny IV — Dziennik zewnętrzny', en: 'Expedition Protocol IV — External Journal' },
    description: {
      pl: 'Doktryna pamięci ekspedycji: hibernacja zabiera wszystko, czego nie zapisano. CORE AI zaczyna każdą sesję bez wiedzy o waszych konwencjach — protokół sprawdza, czy umiesz prowadzić CLAUDE.md / AGENTS.md, które naprawdę pomagają.',
      en: 'The expedition memory doctrine: hibernation takes everything that was not written down. CORE AI starts every session knowing nothing of your conventions — this protocol checks whether you can maintain a CLAUDE.md / AGENTS.md that actually helps.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Każda hibernacja zeruje pamięć sesji CORE AI — o konwencjach ekspedycji wie tylko tyle, ile zapiszesz w dzienniku zewnętrznym: pliku reguł CLAUDE.md / AGENTS.md w repozytorium misji. Co zgodnie z testem inkluzji powinno do niego trafiać?',
          en: 'Every hibernation wipes CORE AI\'s session memory — it knows only as much about the expedition\'s conventions as you record in the external journal: the CLAUDE.md / AGENTS.md rules file in the mission repo. According to the inclusion test, what should go into it?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Tylko to, czego agent nie wywnioskuje z kodu ani z danych treningowych: lokalne konwencje, pułapki projektu, nieoczywiste obejścia', en: 'Only what the agent cannot infer from the code or its training data: local conventions, project pitfalls, non-obvious workarounds' } },
          { id: 'b', text: { pl: 'Pełny opis architektury i stacku technologicznego — im więcej kontekstu o projekcie, tym lepsze wyniki', en: 'A full description of the architecture and tech stack — the more project context, the better the results' } },
          { id: 'c', text: { pl: 'Komendy z README przepisane w całości, żeby agent nie musiał otwierać dodatkowych plików', en: 'The README commands copied in full, so the agent never has to open extra files' } },
          { id: 'd', text: { pl: 'Ogólne zasady jakości w rodzaju „pisz czysty kod” — wyznaczają standard, do którego agent ma dążyć', en: 'General quality principles like "write clean code" — they set the standard the agent should aim for' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Dziennik reguł ekspedycji — CLAUDE.md w repozytorium misji — urósł do 400 linii, a CORE AI i tak ignoruje wpisy z jego dolnej połowy. Co najlepiej tłumaczy ten efekt?',
          en: 'The expedition\'s rules journal — the CLAUDE.md in the mission repo — has grown to 400 lines, and CORE AI still ignores the entries in its lower half. What best explains this effect?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Harness ucina plik po dwustu liniach, więc dalsza treść nigdy nie dociera do modelu', en: 'The harness truncates the file after two hundred lines, so the rest never reaches the model' } },
          { id: 'b', text: { pl: 'Długi plik spowalnia start sesji, ale na samą jakość przestrzegania reguł nie ma wpływu', en: 'A long file slows down session start, but has no effect on how well the rules are followed' } },
          { id: 'c', text: { pl: 'Modele mają U-kształtną uwagę — treść ze środka długiego kontekstu dostaje jej najmniej, a redundancja dodatkowo zajmuje okno kontekstowe', en: 'Models have U-shaped attention — content in the middle of a long context gets the least of it, and redundancy additionally eats the context window' } },
          { id: 'd', text: { pl: 'Problemem jest wyłącznie koszt tokenów — przy dużym limicie kontekstu długość pliku przestaje szkodzić', en: 'The only problem is token cost — with a large context limit, file length stops hurting' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: {
          pl: 'W kodzie inwentarza krypty profilów CORE AI sesja po sesji uparcie używa typu any. Które sformułowanie reguły w pliku instrukcji będzie najskuteczniejsze?',
          en: 'In the profile vault\'s inventory code, session after session, CORE AI stubbornly keeps using the any type. Which phrasing of the rule in the instructions file will be most effective?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: '„Pisz czysty, czytelny kod zgodny z dobrymi praktykami TypeScripta” — szeroka reguła pokryje też inne przypadki', en: '"Write clean, readable code following TypeScript best practices" — a broad rule will also cover other cases' } },
          { id: 'b', text: { pl: '„Unikaj typu any; publiczne funkcje mają jawne typy zwracane” — sprawdzalne zachowanie zamiast deklaracji intencji', en: '"Avoid the any type; public functions have explicit return types" — a checkable behavior instead of a statement of intent' } },
          { id: 'c', text: { pl: 'Wkleić do pliku reguł cały przykładowy, poprawnie otypowany moduł, żeby agent miał kompletny wzorzec', en: 'Paste a whole correctly-typed example module into the rules file, so the agent has a complete template' } },
          { id: 'd', text: { pl: '„Dbaj o bezpieczeństwo typów wszędzie tam, gdzie to możliwe” — zostawia agentowi przestrzeń na własną ocenę', en: '"Take care of type safety wherever possible" — it leaves the agent room for its own judgment' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_4_DONE] },
  },
];
