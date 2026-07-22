import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-12',
    title: { pl: 'Protokół Ekspedycyjny XII — Karta Prób', en: 'Expedition Protocol XII — The Trial Card' },
    description: {
      pl: 'Doktryna warsztatowa: spisz, jak próbujesz — te same słowa, ta sama kolejność, zero zgadywania. Usterka przyznana to dane; usterka przemilczana to pułapka. Karta prób jest po to, żeby następny wiedział, co już sprawdzono.',
      en: 'The workshop doctrine: write down how you try — the same words, the same order, zero guessing. An admitted fault is data; a silenced fault is a trap. The trial card exists so the next hand knows what was already checked.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Na moduł serwisowy Złomowiska przychodzi jednozdaniowe zgłoszenie od Moreau: „Zatwierdzam odczyt, a on wciąż wraca do kolejki pomiarów". Brak stack trace’a i screenshota. Od czego zaczynasz pracę z agentem?',
          en: 'A one-sentence report from Moreau reaches the Boneyard service module: "I approve a reading and it keeps coming back to the measurement queue." No stack trace, no screenshot. Where do you start working with the agent?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Od razu proszę o fix — jedno zdanie plus dostęp do repozytorium wystarczą, żeby model sam trafił w przyczynę', en: 'I ask for a fix right away — one sentence plus repository access is enough for the model to hit the cause itself' } },
          { id: 'b', text: { pl: 'Od rozpisania zgłoszenia na kroki reprodukcji, zakres i częstotliwość — agent ma najpierw znać pytania, nie odpowiedzi', en: 'From breaking the report into reproduction steps, scope, and frequency — the agent should first know the questions, not the answers' } },
          { id: 'c', text: { pl: 'Od czytania całego modułu powtórek linia po linii — bug siedzi przecież w kodzie, więc od kodu trzeba zacząć', en: 'From reading the whole review module line by line — the bug lives in the code after all, so the code is where to start' } },
          { id: 'd', text: { pl: 'Od odesłania zgłoszenia z prośbą o stack trace — bez śladu błędu w logach diagnoza nie może się zacząć', en: 'From sending the report back asking for a stack trace — without an error trail in the logs, diagnosis cannot begin' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Wraki wokół weszły w lawę z zielonymi kontrolkami. W oprogramowaniu stacji znajdujesz mechanizm tej katastrofy: API oceny stanu zwraca 200 OK, ale nowy termin przeglądu nigdy nie trafia do bazy — handler łapie błąd zapisu, loguje warning i zwraca sukces. Co to za klasa problemu?',
          en: 'The wrecks around you drove into the lava with green status lights. In the station software you find the mechanism of that disaster: the condition-rating API returns 200 OK, yet the new inspection date never reaches the database — the handler catches the write error, logs a warning, and returns success. What class of problem is this?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Race condition — dwa równoległe zapisy ścigają się do bazy, a problem zniknie po dodaniu blokady na rekordzie', en: 'A race condition — two concurrent writes race to the database, and the problem will vanish once a record lock is added' } },
          { id: 'b', text: { pl: 'Błąd walidacji danych wejściowych — wystarczy mocniej sprawdzać formularz po stronie klienta, zanim wyśle żądanie', en: 'An input validation bug — stricter client-side checking of the form before it sends the request will do' } },
          { id: 'c', text: { pl: 'Problem frontendowy — skoro serwer odpowiada 200 OK, błędu należy szukać w przeglądarce, nie po stronie API', en: 'A frontend problem — since the server answers 200 OK, the bug should be sought in the browser, not on the API side' } },
          { id: 'd', text: { pl: 'Połknięty błąd (swallowed error) — system melduje sukces mimo awarii i nie widzą go ani testy, ani użytkownik', en: 'A swallowed error — the system reports success despite the failure, and neither the tests nor the user see it' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Dziennik usterek Iskry i logi stacji zgodnie wskazały przyczynę buga. Co robisz, zanim agent zacznie go naprawiać?',
          en: 'Iskra’s fault journal and the station logs agree on the cause of the bug. What do you do before the agent starts fixing it?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Piszę test, który reprodukuje buga i pada — po fixie przechodzi i zostaje jako ochrona przed regresją', en: 'I write a test that reproduces the bug and fails — after the fix it passes and stays as a regression guard' } },
          { id: 'b', text: { pl: 'Naprawiam od razu — test przed fixem tylko odwleka rozwiązanie, a można go dopisać później', en: 'I fix immediately — a test before the fix only delays the solution, and it can be added later' } },
          { id: 'c', text: { pl: 'Robię refaktor całego modułu — skoro już tu jestem, poprawię kod dookoła, a bug zniknie przy okazji', en: 'I refactor the whole module — since I am here anyway, I will clean up the surrounding code and the bug will vanish along the way' } },
          { id: 'd', text: { pl: 'Owijam problematyczny zapis w try/catch, żeby błąd przestał psuć odpowiedź API do czasu spokojnej analizy', en: 'I wrap the failing write in a try/catch so the error stops breaking the API response until a calmer analysis' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_12_DONE] },
  },
];
