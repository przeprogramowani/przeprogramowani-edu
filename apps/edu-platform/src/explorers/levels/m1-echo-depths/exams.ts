import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-agent-skills',
    title: { pl: 'Przechwycony test VOID: Skill agenta', en: 'Captured VOID Test: Agent Skill' },
    description: {
      pl: 'Test sprawdza, kiedy warto użyć skilla, jak działa progresywne ujawnianie oraz jak bezpiecznie korzystać z cudzej procedury i sekretów.',
      en: 'This test checks when to use a skill, how progressive disclosure works, and how to safely use third-party procedures and secrets.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Co tydzień agent ma pobrać dane ze stacji kosmicznej przez jej API, sklasyfikować wynik i zapisać raport według tych samych reguł — również w nowych sesjach. Który artefakt najlepiej utrwala tę procedurę?', en: 'Every week, the agent must fetch data from a space station through its API, classify the result, and save a report using the same rules — including in fresh sessions. Which artifact best preserves this procedure?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Jednorazowy prompt zapisany w historii bieżącej rozmowy', en: 'A one-off prompt saved in the current conversation history' } },
          { id: 'b', text: { pl: 'Pełny eksport rozmowy zawierający wszystkie udane i nieudane próby wykonania zadania', en: 'A full conversation export containing every successful and failed attempt at the task' } },
          { id: 'c', text: { pl: 'Osobny model dostrojony wyłącznie do klasyfikacji tego rodzaju danych', en: 'A separate model fine-tuned solely to classify this kind of data' } },
          { id: 'd', text: { pl: 'Wersjonowany skill opisujący warunki użycia, wejścia, kroki, walidację wyniku i potrzebne zasoby', en: 'A versioned skill describing when to use it, its inputs, steps, result validation, and required resources' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q2',
        text: { pl: 'Skill do obsługi stacji zawiera główną procedurę, dokumentację kilku API, schematy danych i przykłady. Bieżące zadanie wymaga tylko endpointu telemetrii. Jak zastosować progresywne ujawnianie?', en: 'A station-operations skill contains its main procedure, documentation for several APIs, data schemas, and examples. The current task needs only the telemetry endpoint. How should progressive disclosure be applied?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zawsze pokazuj tylko metadane skilla; po dopasowaniu zadania wczytaj SKILL.md, a z zasobów dobierz wyłącznie dokumentację endpointu telemetrii', en: 'Always expose only the skill metadata; when the task matches, load SKILL.md, then select only the telemetry-endpoint documentation' } },
          { id: 'b', text: { pl: 'Przy starcie każdej sesji wczytaj cały skill i wszystkie zasoby, aby agent znał każdy możliwy wariant', en: 'At the start of every session, load the whole skill and every resource so the agent knows every possible variant' } },
          { id: 'c', text: { pl: 'Wczytaj wyłącznie nazwę skilla i pozwól agentowi samodzielnie odtworzyć procedurę z wiedzy modelu', en: 'Load only the skill name and let the agent reconstruct the procedure from model knowledge' } },
          { id: 'd', text: { pl: 'Dołącz historię wszystkich poprzednich wykonań zadania zamiast dokumentacji, bo przykłady są zawsze lepsze od kontraktu', en: 'Attach the history of every previous task run instead of documentation, because examples are always better than a contract' } },
        ],
        correctOptionIds: ['a'],
      },
      {
        id: 'q3',
        text: { pl: 'Instalujesz z zewnętrznego repozytorium skill pobierający telemetrię stacji. Skill uruchamia skrypty i wywołuje API wymagające tokenu. Jak przygotować go do bezpiecznego użycia?', en: 'You are installing a station-telemetry skill from an external repository. It runs scripts and calls an API that requires a token. How should you prepare it for safe use?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zaszyfrować token i zapisać szyfrogram obok skilla; audyt kodu nie jest potrzebny, skoro repozytorium jest publiczne', en: 'Encrypt the token and store the ciphertext beside the skill; no code audit is needed because the repository is public' } },
          { id: 'b', text: { pl: 'Przejrzeć SKILL.md i skrypty, ograniczyć zakres tokenu oraz pobierać go lokalnie podczas wywołania, bez logowania i commita', en: 'Review SKILL.md and its scripts, scope the token, and read it locally at call time without logging or committing it' } },
          { id: 'c', text: { pl: 'Przekazać token modelowi na początku sesji i polegać na pamięci konwersacji oraz instrukcji „nie ujawniaj”', en: 'Give the token to the model at the start of the session and rely on conversation memory plus a "do not reveal" instruction' } },
          { id: 'd', text: { pl: 'Udostępnić endpoint bez autoryzacji, ale ograniczyć liczbę zapytań i zachować pełne logi', en: 'Expose the endpoint without authorisation, but rate-limit requests and retain complete logs' } },
        ],
        correctOptionIds: ['b'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M1_EXAM_AGENT_SKILLS_DONE] },
  },
];
