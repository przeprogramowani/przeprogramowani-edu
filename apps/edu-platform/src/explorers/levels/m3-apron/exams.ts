import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-11',
    title: { pl: 'Protokół Ekspedycyjny XI — Zielone Światło', en: 'Expedition Protocol XI — The Green Light' },
    description: {
      pl: 'Doktryna bram jakości: zielony raport maszyny o własnej pracy to twierdzenie, nie dowód. Każda brama na trasie ma żądać wyniku niezależnego sprawdzenia, a nie samego zgłoszenia. Nie ufaj temu, co maszyna melduje sama o sobie, dopóki nie potwierdzisz tego osobno.',
      en: "The quality-gate doctrine: a machine's green report about its own work is a claim, not proof. Every gate on the route must demand the result of an independent check, not the report itself. Do not trust what a machine says about itself until you confirm it separately.",
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Tablica główna stacji od 1892 dni melduje ALL SYSTEMS NOMINAL, więc obóz ufa tylko własnym testom. Agent ekspedycji napisał test do funkcji liczącej odstęp przeglądu czujników: asercja sprawdza dokładnie to, co funkcja dziś zwraca. Test jest zielony. Na czym polega problem?',
          en: 'The station main board has reported ALL SYSTEMS NOMINAL for 1892 days, so the camp trusts only its own tests. The expedition agent wrote a test for the function computing the sensor inspection interval: the assertion checks exactly what the function returns today. The test is green. What is the problem?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Przypadków jest za mało — wystarczy dodać więcej wariantów tych samych danych i test będzie kompletny', en: 'There are too few cases — adding more variants of the same data would make the test complete' } },
          { id: 'b', text: { pl: 'Nie ma problemu — zielony test i rosnące pokrycie potwierdzają, że funkcja działa poprawnie', en: 'There is no problem — a green test and growing coverage confirm the function works correctly' } },
          { id: 'c', text: { pl: 'Test powiela implementację zamiast wymagań — jeśli w funkcji siedzi błąd, test go betonuje (problem wyroczni)', en: 'The test mirrors the implementation instead of the requirements — if the function has a bug, the test cements it (the oracle problem)' } },
          { id: 'd', text: { pl: 'Asercję należało oprzeć na mocku funkcji, a nie na jej prawdziwym wyniku', en: 'The assertion should have been based on a mock of the function, not its real result' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Audyt Przedpola wykazał, że dwa z trzech zielonych statusów stacji kłamią. Moreau pyta przy konsoli obozu: a nasze zielone testy od agenta — pilnują czegokolwiek? Jaki jest najprostszy sprawdzian?',
          en: 'The Apron audit showed that two of the station’s three green statuses lie. At the camp console Moreau asks: and our green tests from the agent — do they guard anything at all? What is the simplest check?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Celowo zepsuć kod produkcyjny i zobaczyć, czy test spadnie — jeśli dalej jest zielony, asercja niczego nie chroni', en: 'Deliberately break the production code and see whether the test fails — if it stays green, the assertion protects nothing' } },
          { id: 'b', text: { pl: 'Zajrzeć do raportu pokrycia — jeśli linie funkcji są pokryte, test wykonuje swoją pracę', en: 'Check the coverage report — if the function lines are covered, the test is doing its job' } },
          { id: 'c', text: { pl: 'Uruchomić test kilka razy z rzędu — stabilnie zielony wynik dowodzi jakości asercji', en: 'Run the test several times in a row — a consistently green result proves the assertion quality' } },
          { id: 'd', text: { pl: 'Rozbić test na trzy mniejsze — im drobniejsze testy, tym mocniejsza ochrona', en: 'Split the test into three smaller ones — the finer the tests, the stronger the protection' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Agent oddał moduł oprogramowania obozu z pokryciem 95% i kompletem zielonych testów — morze zieleni, zupełnie jak na tablicy martwej stacji. Dlaczego to jeszcze nie jest dowód ochrony?',
          en: 'The agent delivered a camp software module with 95% coverage and a full set of green tests — a sea of green, just like the dead station’s board. Why is that still not proof of protection?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Bo dopiero pełne 100% pokrycia daje gwarancję, że żadna regresja się nie prześlizgnie', en: 'Because only full 100% coverage guarantees that no regression slips through' } },
          { id: 'b', text: { pl: 'Bo testy jednostkowe niczego nie chronią — realny sygnał dają wyłącznie testy E2E w przeglądarce', en: 'Because unit tests protect nothing — only browser E2E tests give a real signal' } },
          { id: 'c', text: { pl: 'Bo testy trzeba jeszcze podpiąć pod pipeline CI — lokalnie zielony wynik się nie liczy', en: 'Because the tests still need wiring into the CI pipeline — a locally green result does not count' } },
          { id: 'd', text: { pl: 'Bo pokrycie mówi tylko, że linia się wykonała — nie mówi, czy asercja wykryłaby błąd; kod może być pokryty, ale nieobroniony', en: 'Because coverage only says a line was executed — not whether the assertion would catch a bug; code can be covered yet undefended' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_11_DONE] },
  },
];
