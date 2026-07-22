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
          { id: 'c', text: { pl: 'Test powiela implementację zamiast wymagań — jeśli w funkcji siedzi błąd, test go betonuje', en: 'The test mirrors the implementation instead of the requirements — if the function has a bug, the test cements it' } },
          { id: 'd', text: { pl: 'Asercję należało oprzeć na mocku funkcji, a nie na prawdziwym wyniku — mock odizoluje test od implementacji', en: 'The assertion should have been based on a mock of the function, not the real result — a mock isolates the test from the implementation' } },
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
          { id: 'a', text: { pl: 'Celowo zepsuć kod i sprawdzić, czy test spadnie — jeśli dalej jest zielony, asercja niczego nie chroni', en: 'Deliberately break the code and see whether the test fails — if it stays green, the assertion protects nothing' } },
          { id: 'b', text: { pl: 'Zajrzeć do raportu pokrycia — skoro linie funkcji są w całości pokryte, test wykonuje swoją pracę', en: 'Check the coverage report — since the function lines are fully covered, the test is doing its job' } },
          { id: 'c', text: { pl: 'Uruchomić test kilkanaście razy z rzędu — stabilnie zielony wynik dowodzi, że asercja jest solidna', en: 'Run the test a dozen times in a row — a consistently green result proves the assertion is solid' } },
          { id: 'd', text: { pl: 'Rozbić test na kilka mniejszych — im drobniejsze przypadki, tym mocniejsza ochrona przed regresją', en: 'Split the test into several smaller ones — the finer the cases, the stronger the regression protection' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Agent oddał moduł oprogramowania obozu z pokryciem 95% i kompletem zielonych testów — morze zieleni, zupełnie jak na tablicy martwej stacji. Co naprawdę poświadcza taki wynik?',
          en: 'The agent delivered a camp software module with 95% coverage and a full set of green tests — a sea of green, just like the dead station’s board. What does such a result actually attest to?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Prawie pełną ochronę — do gwarancji brakuje tylko domknięcia pokrycia do pełnych 100%', en: 'Nearly full protection — all that is missing for a guarantee is closing coverage to a full 100%' } },
          { id: 'b', text: { pl: 'Niewiele, bo to testy jednostkowe — realny sygnał dają dopiero testy E2E w przeglądarce', en: 'Little, because these are unit tests — only browser E2E tests give a real signal' } },
          { id: 'c', text: { pl: 'Ochronę dopiero po podpięciu pod pipeline CI — lokalnie zielony wynik się nie liczy', en: 'Protection only once wired into the CI pipeline — a locally green result does not count' } },
          { id: 'd', text: { pl: 'Tylko tyle, że linie się wykonały — pokrycie nie mówi, czy asercje wykryłyby błąd', en: 'Only that the lines executed — coverage does not say whether the assertions would catch a bug' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_11_DONE] },
  },
];
