import type { ExamDefinition } from '../../systems/ExamTypes';
import { FLAGS } from '../../config/flags';

export const exams: ExamDefinition[] = [
  {
    id: 'm2-exam-impl-control',
    title: { pl: 'Przechwycony test VOID: Kontrola implementacji', en: 'Captured VOID Test: Implementation Control' },
    description: {
      pl: 'Test sprawdza nadzór nad wykonaniem planu przez agenta: punkty kontrolne, wykrywanie dryfu wykonania i dobór działań korygujących.',
      en: 'This test checks supervising an agent\'s plan execution: checkpoints, detecting execution drift, and choosing corrective actions.',
    },
    passingScore: 3,
    questions: [
      {
        id: 'q1',
        text: { pl: 'Agent dostał zatwierdzony plan implementacji podzielony na kroki. Jak zorganizować nadzór, żeby dryf wykonania nie pozostał niezauważony?', en: 'The agent received an approved implementation plan split into steps. How do you organise supervision so execution drift does not go unnoticed?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Sprawdzić dopiero końcowy rezultat — pośrednie kroki to szczegół wykonawczy', en: 'Check only the final result — intermediate steps are an execution detail' } },
          { id: 'b', text: { pl: 'Zdefiniować punkty kontrolne po kluczowych krokach i porównywać na nich faktyczny stan z planem, zanim praca pójdzie dalej', en: 'Define checkpoints after key steps and compare the actual state against the plan at each one before work continues' } },
          { id: 'c', text: { pl: 'Obserwować na żywo każdą linię kodu generowaną przez agenta', en: 'Watch live every line of code the agent generates' } },
          { id: 'd', text: { pl: 'Poprosić agenta, żeby sam zgłaszał momenty, w których zboczył z planu', en: 'Ask the agent to self-report the moments it strayed from the plan' } },
        ],
        correctOptionIds: ['b'],
      },
      {
        id: 'q2',
        text: { pl: 'Na punkcie kontrolnym odkrywasz, że agent wykonał dodatkową „ulepszającą" zmianę, której plan nie zawiera. Testy przechodzą. Co robisz?', en: 'At a checkpoint you discover the agent made an extra "improving" change the plan does not contain. Tests pass. What do you do?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Zostawić zmianę — skoro testy przechodzą, nie ma problemu', en: 'Keep the change — tests pass, so there is no problem' } },
          { id: 'b', text: { pl: 'Wycofać całą pracę agenta od początku planu', en: 'Roll back all of the agent\'s work to the start of the plan' } },
          { id: 'c', text: { pl: 'Odizolować zmianę spoza planu i podjąć decyzję o niej osobno — zakres wraca do decydenta, a plan wykonuje się dalej czysto', en: 'Isolate the out-of-plan change and decide on it separately — scope goes back to the decision-maker, and the plan continues clean' } },
          { id: 'd', text: { pl: 'Dopisać zmianę do planu wstecznie, żeby ślad wykonania się zgadzał', en: 'Backfill the change into the plan so the execution trace matches' } },
        ],
        correctOptionIds: ['c'],
      },
      {
        id: 'q3',
        text: { pl: 'Ślad wykonania pokazuje trzy odchylenia od planu: drobne w kroku 2, poważne w kroku 5 i kosmetyczne w kroku 7. Od czego zacząć korektę?', en: 'The execution trace shows three deviations from the plan: minor at step 2, serious at step 5, cosmetic at step 7. Where do you start correcting?' },
        type: 'single',
        options: [
          { id: 'a', text: { pl: 'Od pierwszego odchylenia w kolejności wykonania — późniejsze mogą być jego skutkami i wymagają ponownej oceny po korekcie', en: 'From the first deviation in execution order — later ones may be its consequences and need re-evaluation after the fix' } },
          { id: 'b', text: { pl: 'Od najpoważniejszego odchylenia, niezależnie od kolejności', en: 'From the most serious deviation, regardless of order' } },
          { id: 'c', text: { pl: 'Od najłatwiejszego do poprawienia, żeby szybko zredukować listę', en: 'From the easiest fix, to shorten the list quickly' } },
          { id: 'd', text: { pl: 'Wszystkie trzy naraz, jedną zbiorczą poprawką agenta', en: 'All three at once, in a single combined agent fix' } },
        ],
        correctOptionIds: ['a'],
      },
    ],
    rewards: { xp: 50, flags: [FLAGS.M2_EXAM_IMPL_CONTROL_DONE] },
  },
];
