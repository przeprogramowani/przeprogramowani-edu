import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-safe-bootstrap',
    title: { pl: 'Przechwycony test VOID: Bezpieczny bootstrap', en: 'Captured VOID Test: Safe Bootstrap' },
    description: {
      pl: 'Test sprawdza, czy potrafisz zachować działający scaffold, nadać agentowi minimalne uprawnienia i zastosować trzy bramki egzekucji.',
      en: 'This test checks whether you can preserve a working scaffold, grant the agent least privilege, and apply the three execution gates.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Projekt panelu sterowania stacją, utworzony oficjalnym starterem, przechodzi health-check, ale konfiguracja nadaje agentowi nieograniczone uprawnienia. Jaki jest właściwy zakres zmiany?', en: 'A station-control dashboard created with an official starter passes its health check, but its configuration gives the agent unrestricted permissions. What is the right scope of change?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Usunąć cały projekt i wygenerować go ponownie innym narzędziem, mimo że health-check przechodzi', en: 'Delete the whole project and regenerate it with another tool even though the health check passes' } },
          { id: 'b', text: { pl: 'Zachować i zacommitować sprawny scaffold, poprawić tylko politykę uprawnień, a potem ponowić health-check', en: 'Preserve and commit the working scaffold, fix only the permissions policy, then rerun the health check' } },
          { id: 'c', text: { pl: 'Pozostawić konfigurację bez zmian, ponieważ kod działa tylko na komputerze dewelopera', en: 'Leave the configuration unchanged because the code runs only on a developer machine' } },
          { id: 'd', text: { pl: 'Najpierw uruchomić agenta z pełnymi uprawnieniami, a politykę dopisać po zakończeniu bootstrapu', en: 'Run the agent with full permissions first, then add the policy after bootstrapping is complete' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: { pl: 'Agent utrzymujący oprogramowanie stacji ma instalować zależności, edytować pliki projektu i uruchamiać testy. Nie powinien czytać sekretów, usuwać plików poza repozytorium ani wykonywać git push. Która polityka najlepiej realizuje minimalne uprawnienia?', en: 'An agent maintaining station software must install dependencies, edit project files, and run tests. It should not read secrets, delete files outside the repository, or run git push. Which policy best implements least privilege?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zezwolić na wszystkie polecenia powłoki, ale obowiązkowo zapisywać je do audytu', en: 'Allow every shell command but require all of them to be written to an audit log' } },
          { id: 'b', text: { pl: 'Zezwolić wyłącznie na dokładne komendy użyte podczas pierwszego bootstrapu, bez obsługi nowych wariantów', en: 'Allow only the exact commands used during the first bootstrap, with no support for new variants' } },
          { id: 'c', text: { pl: 'Zezwolić na wąskie rodziny potrzebnych operacji, zablokować sekrety i działania destrukcyjne, a nieznane przypadki kierować do akceptacji', en: 'Allow narrow families of required operations, block secrets and destructive actions, and route unknown cases for approval' } },
          { id: 'd', text: { pl: 'Zablokować wszystkie operacje zapisu i każdą rutynową zmianę przekazywać człowiekowi', en: 'Block every write operation and hand every routine change to a human' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: { pl: 'Która sekwencja poprawnie stosuje trzy bramki egzekucji podczas bootstrapu panelu sterowania stacją?', en: 'Which sequence correctly applies the three execution gates while bootstrapping a station-control dashboard?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Uruchom generator, a dopiero po błędzie sprawdź pliki wejściowe, uprawnienia i stan repozytorium', en: 'Run the generator, and only after an error check the input files, permissions, and repository state' } },
          { id: 'b', text: { pl: 'Przed: sprawdź kontrakty wejściowe i stan repo; w trakcie: użyj oficjalnego CLI w dozwolonym zakresie; po: uruchom testy i przejrzyj diff', en: 'Before: check input contracts and repository state; during: use the official CLI within allowed scope; after: run tests and review the diff' } },
          { id: 'c', text: { pl: 'Przygotuj szczegółowy plan i uznaj go za dowód, że wykonanie zakończy się poprawnie', en: 'Prepare a detailed plan and treat it as proof that execution will succeed' } },
          { id: 'd', text: { pl: 'Uruchom wszystkie komendy równolegle, a weryfikację zastąp pełnym logiem poleceń', en: 'Run every command in parallel and replace verification with a complete command log' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M1_EXAM_SAFE_BOOTSTRAP_DONE] },
  },
];
