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
          { id: 'a', text: { pl: 'Od razu proszę o fix — jedno zdanie plus dostęp do repo wystarczą, żeby model sam trafił w przyczynę', en: 'I ask for a fix right away — one sentence plus repo access is enough for the model to hit the cause itself' } },
          { id: 'b', text: { pl: 'Od ustrukturyzowania zgłoszenia: kroki reprodukcji, zakres, częstotliwość i możliwy obszar — agent ma najpierw znać pytania, nie odpowiedzi', en: 'From structuring the ticket: reproduction steps, scope, frequency, and probable area — the agent should first know the questions, not the answers' } },
          { id: 'c', text: { pl: 'Od czytania całego modułu powtórek linia po linii — bug siedzi w kodzie, więc od kodu trzeba zacząć', en: 'From reading the whole review module line by line — the bug lives in the code, so the code is where to start' } },
          { id: 'd', text: { pl: 'Od odesłania zgłoszenia z prośbą o stack trace — bez śladu błędu diagnoza nie może się zacząć', en: 'From sending the ticket back asking for a stack trace — without an error trace, diagnosis cannot begin' } },
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
          { id: 'a', text: { pl: 'Race condition — dwa zapisy ścigają się do bazy i problem zniknie po dodaniu blokady', en: 'A race condition — two writes race to the database, and a lock will make the problem go away' } },
          { id: 'b', text: { pl: 'Błąd walidacji — wystarczy mocniej sprawdzać dane wejściowe po stronie klienta', en: 'A validation bug — stricter input checking on the client side will do' } },
          { id: 'c', text: { pl: 'Problem frontendowy — skoro serwer zwraca 200, błędu należy szukać w przeglądarce', en: 'A frontend problem — since the server returns 200, the bug must be in the browser' } },
          { id: 'd', text: { pl: 'Połknięty błąd (swallowed error) — system melduje sukces mimo awarii, więc widzi go dopiero monitoring, nie użytkownik ani testy', en: 'A swallowed error — the system reports success despite the failure, so only monitoring sees it, not the user or the tests' } },
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
          { id: 'a', text: { pl: 'Piszę test, który reprodukuje buga i pada — po fixie przechodzi i zostaje w repo jako ochrona przed regresją', en: 'I write a test that reproduces the bug and fails — after the fix it passes and stays in the repo as a regression guard' } },
          { id: 'b', text: { pl: 'Naprawiam od razu — test przed fixem tylko odwleka rozwiązanie, a można go dopisać później', en: 'I fix immediately — a test before the fix only delays the solution, and it can be added later' } },
          { id: 'c', text: { pl: 'Robię refaktor całego modułu — skoro już tu jestem, poprawię kod dookoła, a bug zniknie przy okazji', en: 'I refactor the whole module — since I am here anyway, I will clean up the surrounding code and the bug will vanish along the way' } },
          { id: 'd', text: { pl: 'Owijam problematyczny zapis w try/catch, żeby błąd nie psuł odpowiedzi API', en: 'I wrap the failing write in a try/catch so the error stops breaking the API response' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_12_DONE] },
  },
];
