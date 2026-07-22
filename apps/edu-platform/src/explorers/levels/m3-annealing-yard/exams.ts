import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm3-exam-protocol-14',
    title: { pl: 'Protokół Ekspedycyjny XIV — Samonaprawa', en: 'Expedition Protocol XIV — Self-Repair' },
    description: {
      pl: 'Doktryna utrzymania ruchu: maszynie wolno bez pytania powtórzyć znane lekarstwo na znaną chorobę. Ale każda samonaprawa zostawia bliznę w dzienniku, a blizny czyta człowiek. Trzecie identyczne podejście to już nie leczenie — to pętla.',
      en: 'The maintenance doctrine: a machine may repeat a known cure for a known ailment without asking. But every self-repair leaves a scar in the log, and scars are read by humans. A third identical attempt is no longer treatment — it is a loop.',
    },
    passingScore: 2,
    questions: [
      {
        id: 'q1',
        text: {
          pl: 'Rutyny samonaprawcze Wyżarzalni wracają do życia, a ty budujesz ich odpowiednik w warsztacie ekspedycji: hook, który po każdej edycji pliku przez agenta uruchamia linter. Z jakich elementów składa się każdy taki hook?',
          en: 'The Annealing Yard’s self-repair routines are coming back to life, and you are building their counterpart in the expedition workshop: a hook that runs the linter after every file edit by the agent. What parts does every such hook consist of?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Skrypt i harmonogram — hook to zadanie cron uruchamiane co ustalony odstęp czasu', en: 'A script and a schedule — a hook is a cron job that runs at a fixed interval' } },
          { id: 'b', text: { pl: 'Trigger (zdarzenie), matcher (filtr), handler (komenda) i sygnał (exit code + stdout wracające do agenta)', en: 'A trigger (event), a matcher (filter), a handler (command), and a signal (exit code + stdout returned to the agent)' } },
          { id: 'c', text: { pl: 'Reguła w CLAUDE.md — hook to instrukcja, którą model czyta i stosuje przed każdą edycją', en: 'A rule in CLAUDE.md — a hook is an instruction the model reads and applies before each edit' } },
          { id: 'd', text: { pl: 'Webhook i endpoint HTTP — hook zawsze wymaga zewnętrznego serwera, który odbierze zdarzenie', en: 'A webhook and an HTTP endpoint — a hook always requires an external server to receive the event' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: {
          pl: 'Hook z typecheckiem znalazł błąd w kodzie sterowania wygrzewem i ma zablokować pracę tak, żeby agent zobaczył feedback i sam go poprawił — jak rutyna, która zostawia bliznę w dzienniku zamiast milczeć. Jaki exit code powinien zwrócić?',
          en: 'A typecheck hook found an error in the annealing control code and should block the work so the agent sees the feedback and fixes it itself — like a routine that leaves a scar in the log instead of staying silent. What exit code should it return?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: '0 — sukces hooka gwarantuje, że komunikat ze stdout trafi do kontekstu agenta', en: '0 — a successful hook guarantees the stdout message reaches the agent context' } },
          { id: 'b', text: { pl: '1 — standardowy kod błędu w Unixie zawsze zatrzymuje pętlę agenta', en: '1 — the standard Unix error code always stops the agent loop' } },
          { id: 'c', text: { pl: '2 — kod błędu blokującego: agent widzi feedback w kontekście i może zareagować; inne kody są tylko logowane', en: '2 — the blocking error code: the agent sees the feedback in context and can react; other codes are only logged' } },
          { id: 'd', text: { pl: 'Dowolny niezerowy — każdy błąd hooka wstrzymuje agenta do czasu reakcji człowieka', en: 'Any non-zero — every hook error halts the agent until a human steps in' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: {
          pl: 'Pełny zestaw testów oprogramowania placu trwa kilka minut — tyle, ile pełny cykl wygrzewu partii — a agent edytuje pliki co chwilę. W której warstwie jakości zaczepić taki zestaw?',
          en: 'The full test suite of the yard software takes several minutes — as long as a full batch annealing cycle — while the agent edits files every moment. Which quality layer should such a suite be attached to?',
        },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Pre-commit, pre-push albo CI — hook per-edit blokuje pętlę agenta przy każdej edycji, więc zostają w nim tylko szybkie sprawdzenia i testy powiązane z plikiem', en: 'Pre-commit, pre-push, or CI — a per-edit hook blocks the agent loop on every edit, so it keeps only fast checks and tests related to the file' } },
          { id: 'b', text: { pl: 'Per-edit — im częściej odpala się pełny zestaw, tym szybciej agent łapie regresje, a stracony czas się zwraca', en: 'Per-edit — the more often the full suite runs, the faster the agent catches regressions, and the lost time pays back' } },
          { id: 'c', text: { pl: 'W żadnej — wolne testy uruchamia się ręcznie przed release’em, poza wszelką automatyką', en: 'None — slow tests are run manually before a release, outside any automation' } },
          { id: 'd', text: { pl: 'Wyłącznie w CI — warstwy lokalne służą tylko lintowaniu, a testy z zasady należą do serwera', en: 'CI only — local layers are just for linting, and tests by principle belong to the server' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 100, flags: [FLAGS.M3_EXAM_PROTOCOL_14_DONE] },
  },
];
