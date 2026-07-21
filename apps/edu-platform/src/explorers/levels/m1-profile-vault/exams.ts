import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm1-exam-agent-onboarding',
    title: { pl: 'Przechwycony test VOID: Kontekst i onboarding', en: 'Captured VOID Test: Context and Onboarding' },
    description: {
      pl: 'Test sprawdza, co powinno trafić do AGENTS.md, jak zamieniać błędy agenta w reguły oraz kiedy rozpocząć świeżą sesję.',
      en: 'This test checks what belongs in AGENTS.md, how to turn agent failures into rules, and when to start a fresh session.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Agent dołącza do repozytorium oprogramowania stacji. Zna język programowania, framework i potrafi czytać kod. Co powinno trafić do AGENTS.md?', en: 'An agent is joining a station-software repository. It knows the programming language and framework and can read the code. What belongs in AGENTS.md?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pełna kopia dokumentacji frameworka, aby żaden potencjalnie przydatny fakt nie został pominięty', en: 'A complete copy of the framework documentation so no potentially useful fact is omitted' } },
          { id: 'b', text: { pl: 'Projektowe komendy, lokalne konwencje, granice bezpieczeństwa i decyzje, których nie da się pewnie wywnioskować z kodu', en: 'Project commands, local conventions, safety boundaries, and decisions that cannot be reliably inferred from the code' } },
          { id: 'c', text: { pl: 'Podstawy języka programowania i opis wszystkich popularnych wzorców projektowych', en: 'Programming language fundamentals and descriptions of every popular design pattern' } },
          { id: 'd', text: { pl: 'Surowy zapis wszystkich rozmów prowadzonych podczas tworzenia projektu', en: 'A raw transcript of every conversation held while building the project' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: { pl: 'W świeżej sesji agent użył w module monitoringu stacji ogólnego formatu błędów zamiast formatu wymaganego w projekcie. Co robisz w pętli feedbacku?', en: 'In a fresh session, the agent used a generic error format in the station-monitoring module instead of the one required by the project. What do you do in the feedback loop?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Powtarzam identyczną próbę, dopóki losowo nie pojawi się poprawna odpowiedź', en: 'Repeat the identical trial until the correct answer appears by chance' } },
          { id: 'b', text: { pl: 'Dodaję ogólną regułę „nigdy nie twórz błędów samodzielnie”, choć nie wskazuje poprawnego formatu', en: 'Add a broad rule saying "never create errors yourself," even though it does not specify the correct format' } },
          { id: 'c', text: { pl: 'Dołączam całą dokumentację projektu, aby większa ilość kontekstu skompensowała pomyłkę', en: 'Attach all project documentation so that more context compensates for the mistake' } },
          { id: 'd', text: { pl: 'Zapisuję konkretny tryb błędu, zamieniam go w testowalną instrukcję, poprawiam onboarding i ponawiam świeżą próbę', en: 'Record the specific failure mode, turn it into a testable instruction, revise the onboarding, and rerun a fresh trial' } },
        ],
        correctOptionIds: ['d'],
      },
      {
        id: 'q3',
        text: { pl: 'Sesja pracy nad systemem stacji jest pełna nieudanych prób i sprzecznych wskazówek. Jak sprawdzić, czy poprawiony onboarding rzeczywiście działa?', en: 'A session working on the station system is full of failed attempts and conflicting hints. How do you test whether the revised onboarding actually works?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zapisuję potwierdzone decyzje i tryb błędu, uruchamiam świeżą sesję z poprawionym onboardingiem i powtarzam ten sam test', en: 'Save verified decisions and the failure mode, start a fresh session with the revised onboarding, and repeat the same test' } },
          { id: 'b', text: { pl: 'Kontynuuję w tej samej sesji, aby agent zachował pełny ślad wszystkich wcześniejszych prób', en: 'Continue in the same session so the agent retains the full trace of every previous attempt' } },
          { id: 'c', text: { pl: 'Wklejam całą historię do nowej sesji, łącznie ze sprzecznymi wskazówkami', en: 'Paste the entire history into a new session, including the contradictory guidance' } },
          { id: 'd', text: { pl: 'Zwiększam temperaturę modelu i uznaję inną odpowiedź za dowód poprawy onboardingu', en: 'Increase the model temperature and treat a different answer as proof that onboarding improved' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M1_EXAM_AGENT_ONBOARDING_DONE] },
  },
];
