import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-protocol-5',
    title: { pl: 'Protokół Ekspedycyjny V — Łańcuch', en: 'Expedition Protocol V — The Chain' },
    description: {
      pl: 'Wybór platformy, weryfikacja założeń i bezpieczne wdrożenie z agentem.',
      en: 'Choosing a platform, validating assumptions, and deploying safely with an agent.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'System obsługujący tablicę sensorów jest gotowy do pierwszego wdrożenia. Kusi cię, by od razu dać CORE AI dostęp do platformy i powiedzieć tylko: „Wdrażaj”. Co robisz, żeby przeprowadzić wdrożenie bezpiecznie?',
          en: 'The system controlling the sensor array is ready for its first deployment. You are tempted to give CORE AI access to the platform and simply say, "deploy it." What do you do to deploy it safely?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Od razu zlecasz wdrożenie i traktujesz błędy wykryte na produkcji jako sposób dopracowania planu', en: 'Start the deployment immediately and use production errors as a way to refine the plan' } },
          { id: 'b', text: { pl: 'Kopiujesz instrukcję z pierwszego znalezionego poradnika i wykonujesz ją bez sprawdzenia, czy pasuje do projektu', en: 'Paste instructions from the first tutorial you find and follow them without checking whether they fit the project' } },
          { id: 'c', text: { pl: 'Włączasz Plan Mode, aby agent sprawdził kontekst, dopytał o braki i przedstawił plan przed wprowadzeniem zmian', en: 'Enable Plan Mode: have the agent review the context, ask about gaps, and present a plan before making changes' } },
          { id: 'd', text: { pl: 'Prosisz agenta wyłącznie o listę poleceń i wykonujesz je wszystkie bez wcześniejszej oceny skutków', en: 'Ask the agent only for commands and run them all before reviewing their effects' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Z pomocą CORE AI porównujesz platformy do obsługi telemetrii misji, ale od początku skłaniasz się ku jednej z nich. Model zaczyna dobierać argumenty tak, by potwierdzić twój wybór. Jak weryfikujesz wynik analizy?',
          en: 'You are comparing platforms for mission telemetry with CORE AI, but you have had a favorite from the start. The model begins shaping its arguments to confirm your choice. How do you test the research result?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Polecasz modelowi wskazać wady faworyta i odtworzyć scenariusz, w którym ten wybór okazał się błędem', en: 'Have the model find flaws in the favorite and reconstruct a scenario in which that choice failed' } },
          { id: 'b', text: { pl: 'Powtarzasz identyczne pytanie w kilku nowych sesjach i uznajesz najczęstszą odpowiedź za obiektywną', en: 'Repeat the same question in several new sessions and treat the most common answer as objective' } },
          { id: 'c', text: { pl: 'Usuwasz z rozmowy wymagania projektu, żeby model oceniał wszystkie platformy bez żadnego kontekstu', en: 'Remove the project requirements from the conversation so the model evaluates every platform without context' } },
          { id: 'd', text: { pl: 'Prosisz model o mocniejsze uzasadnienie faworyta, aż wszystkie wątpliwości znikną z podsumowania', en: 'Ask the model for a stronger case for the favorite until every doubt disappears from the summary' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Wdrożenie działa. Kusi cię, żeby zamknąć temat i niczego nie zapisywać. Wiesz jednak, że za kilka miesięcy ktoś może zapytać, dlaczego wybraliście właśnie tę platformę. Co robisz teraz?',
          en: 'The deployment works. You are tempted to close the task and record nothing. But in a few months, someone may ask why your team chose this platform. What do you do now?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zapisujesz tylko bieżące ustawienia platformy, bo z nich będzie można odtworzyć powody wyboru', en: 'Record only the platform\'s current settings, because they will reveal the reasons behind the choice' } },
          { id: 'b', text: { pl: 'Zapisujesz pełny dziennik wszystkich działań agenta, niezależnie od ich znaczenia dla decyzji', en: 'Record a complete log of every agent action, regardless of whether it mattered to the decision' } },
          { id: 'c', text: { pl: 'Nie zapisujesz niczego — skoro wdrożenie działa, analiza nie będzie już potrzebna', en: 'Record nothing — if the deployment works, the analysis will no longer be needed' } },
          { id: 'd', text: { pl: 'Zapisujesz wybór, uzasadnienie, znane ryzyka i sytuacje, w których trzeba ponownie ocenić decyzję', en: 'Record the choice, rationale, known risks, and situations in which the decision should be reviewed' } },
        ],
        correctOptionIds: ['d'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M1_EXAM_PROTOCOL_5_DONE] },
  },
];
