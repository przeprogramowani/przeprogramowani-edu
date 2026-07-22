import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-3',
    title: { pl: 'Protokół Ekspedycyjny III — Bezpieczna obsługa robotów', en: 'Expedition Protocol III — Safe Robot Operations' },
    description: {
      pl: 'Roboty pracujące na odległych planetach potrzebują aktualnych narzędzi i jasno wyznaczonych granic. Protokół sprawdza bezpieczne uruchamianie projektów, politykę uprawnień i pracę bez potwierdzeń.',
      en: 'Robots working on distant planets need current tools and clearly defined boundaries. This protocol tests safe project setup, permission policy, and work without confirmations.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Przygotowujesz oprogramowanie sterujące nowym robotem badawczym na Marsa. Kusi cię skrót: poprosić CORE AI, żeby odtworzyło z pamięci całą strukturę projektu. Jak zaczynasz pracę, żeby dostać aktualny i przewidywalny punkt startu?',
          en: 'You are preparing control software for a new Mars research robot. A shortcut tempts you: ask CORE AI to recreate the entire project structure from memory. How do you begin to get a current and predictable starting point?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zlecasz wszystko agentowi, bo oficjalny generator daje tylko oszczędność czasu, a wynik będzie taki sam', en: 'You delegate everything to the agent, because the official generator only saves time and the result will be the same' } },
          { id: 'b', text: { pl: 'Najpierw używasz oficjalnego generatora projektu, a dopiero w utworzonej strukturze zlecasz agentowi dalszą pracę', en: 'You first use the official project generator, then delegate further work to the agent inside the generated structure' } },
          { id: 'c', text: { pl: 'Prosisz agenta o ręczne odtworzenie struktury, a wersje zależności aktualizujesz dopiero po pierwszym uruchomieniu', en: 'You ask the agent to recreate the structure manually and update dependency versions only after the first run' } },
          { id: 'd', text: { pl: 'Budujesz pusty projekt samodzielnie, bo agent nie powinien korzystać z narzędzi, które tworzą pliki', en: 'You build an empty project yourself, because the agent should not use tools that create files' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Robot serwisowy przygotował poprawkę sterownika łazika pracującego na Tytanie. Ma pozwolenie na lokalne zmiany, ale osobna reguła zabrania wysyłania ich do aktywnej floty. Robot próbuje rozpocząć wysyłkę. Co powinien zrobić system uprawnień?',
          en: 'A service robot prepared a controller fix for a rover operating on Titan. It may make local changes, but a separate rule forbids sending them to the active fleet. The robot attempts to start the transmission. What should the permission system do?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Uznać wcześniejsze pozwolenie za nadrzędne i wysłać poprawkę bez dodatkowej kontroli', en: 'Treat the earlier permission as decisive and send the fix without any additional check' } },
          { id: 'b', text: { pl: 'Zapytać operatora, bo ask zawsze ma pierwszeństwo przed regułami allow i deny', en: 'Ask the operator, because ask always takes precedence over allow and deny rules' } },
          { id: 'c', text: { pl: 'Wybrać regułę dodaną najpóźniej, bo kolejność zapisu rozstrzyga każdy konflikt', en: 'Choose the most recently added rule, because entry order resolves every conflict' } },
          { id: 'd', text: { pl: 'Zastosować kolejność deny → ask → allow; zakaz wygrywa, więc zablokować wysyłkę', en: 'Apply deny → ask → allow; the prohibition wins, so block the transmission' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Podczas testów robota transportowego przed misją na Europie męczy cię zatwierdzanie każdego ruchu. Kusi cię przełączyć jego agenta w tryb bez pytań o zgodę. Gdzie możesz bezpiecznie użyć takiego trybu?',
          en: 'While testing a cargo robot before a mission to Europa, you grow tired of approving every move. You are tempted to switch its agent into a mode that never asks for confirmation. Where can you use such a mode safely?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'W każdym małym projekcie, bo niewielka liczba plików wyklucza poważne szkody', en: 'In any small project, because a limited number of files rules out serious damage' } },
          { id: 'b', text: { pl: 'W środowisku produkcyjnym, jeśli deny blokuje każde polecenie, które mogłoby uszkodzić robota lub aktywną flotę', en: 'In production, as long as deny blocks every command that could cause serious damage to the robot or the active fleet' } },
          { id: 'c', text: { pl: 'W izolowanym symulatorze, bez sekretów, aktywnej floty i z możliwością cofnięcia zmian', en: 'In an isolated simulator, with no secrets, no active fleet, and recoverable changes' } },
          { id: 'd', text: { pl: 'Na pojeździe terenowym, jeśli operator obserwuje dziennik i może zatrzymać robota', en: 'On a field vehicle, if the operator watches the log and can stop the robot' } },
        ],
        correctOptionIds: ['c'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_3_DONE] },
  },
];
